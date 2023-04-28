import { actionTypes } from '../store'

export default class AzBpmHistory {
    constructor(store) {
        this.store = store
    }

    async getHistory(processKey, businessKey) {
        const history = []
        const logs = await this._findLogs(processKey, businessKey)
        logs.reduce((previousLog, currentLog) => {
            this._addHistoryComplete(history, currentLog, previousLog)
            this._addHistoryUncomplete(history, currentLog, previousLog)

            const assignees = currentLog.activityAssignees || []
            assignees.reduce((previousAssignee, currentAssignee) => {
                this._addHistoryClaim(history, currentLog, currentAssignee)
                this._addHistoryUnclaim(history, currentLog, currentAssignee, previousAssignee)

                return currentAssignee
            }, null)

            return currentLog
        }, null)
        return history
    }

    async _findLogs(processKey, businessKey) {
        const processLogsParams = this._getProcessLogsParams(processKey, businessKey)
        return await this.store.dispatch(actionTypes.BPM.GET_PROCESS_LOGS, processLogsParams)
    }

    _getProcessLogsParams(processKey, businessKey) {
        return {
            processKey,
            businessKey,
        }
    }

    _addHistoryComplete(history, currentLog, previousLog) {
        if (previousLog && !previousLog.canceled) {
            const historyComplete = this._getHistoryComplete(currentLog, previousLog)

            history.push(historyComplete)
        }
    }

    _addHistoryUncomplete(history, currentLog, previousLog) {
        if (previousLog && previousLog.canceled) {
            const historyUncomplete = this._getHistoryUncomplete(currentLog, previousLog)

            history.push(historyUncomplete)
        }
    }

    _addHistoryClaim(history, currentLog, currentAssignee) {
        if (currentAssignee.assignee) {
            const assignee = currentAssignee.assignee
            const assigneeDate = currentAssignee.assigneeDate
            const historyClaim = this._getHistoryClaim(currentLog, assignee, assigneeDate)

            history.push(historyClaim)
        }
    }

    _addHistoryUnclaim(history, currentLog, currentAssignee, previousAssignee) {
        if (!currentAssignee.assignee) {
            const assignee = previousAssignee.assignee
            const assigneeDate = currentAssignee.assigneeDate
            const historyUnclaim = this._getHistoryUnclaim(currentLog, assignee, assigneeDate)

            history.push(historyUnclaim)
        }
    }

    _getHistoryClaim(currentLog, assignee, assigneeDate) {
        const defaultData = this._getDefaultData()

        defaultData.taskName = currentLog.activityName
        defaultData.status = 'RECEBIDO'
        defaultData.assignee = assignee
        defaultData.date = assigneeDate

        return defaultData
    }

    _getHistoryUnclaim(currentLog, assignee, assigneeDate) {
        const defaultData = this._getDefaultData()

        defaultData.taskName = currentLog.activityName
        defaultData.status = 'RECEBIMENTO CANCELADO'
        defaultData.assignee = assignee
        defaultData.date = assigneeDate

        return defaultData
    }

    _getHistoryComplete(currentLog, previousLog) {
        const defaultData = this._getDefaultData()

        defaultData.taskName = previousLog.activityName
        defaultData.status = 'ENCAMINHADO'
        defaultData.nextTaskName = currentLog.activityName
        defaultData.assignee = previousLog.completeUser
        defaultData.date = (previousLog.activityAssignees || []).length
            ? previousLog.completeDate
            : previousLog.activityEndTime

        return defaultData
    }

    _getHistoryUncomplete(currentLog, previousLog) {
        const defaultData = this._getDefaultData()

        defaultData.taskName = previousLog.activityName
        defaultData.status = 'ENCAMINHAMENTO CANCELADO'
        defaultData.nextTaskName = currentLog.activityName
        defaultData.assignee = previousLog.uncompleteUser
        defaultData.date = previousLog.date

        return defaultData
    }

    _getDefaultData() {
        return {
            date: null,
            taskName: '',
            assignee: null,
            nextTaskName: '',
            duration: null,
            status: '',
        }
    }
}
