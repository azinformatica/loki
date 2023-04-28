import { actionTypes } from '../store'

export default class AzBpmHistory {
    constructor(store) {
        this.store = store
    }

    async getLogs(processKey, businessKey) {
        const formattedLogs = []
        const logs = await this._findLogs(processKey, businessKey)
        logs.reduce((previousLog, currentLog) => {
            this._addHistoryComplete(formattedLogs, currentLog, previousLog)
            this._addHistoryUncomplete(formattedLogs, currentLog, previousLog)

            const assignees = currentLog.activityAssignees || []
            assignees.reduce((previousAssignee, currentAssignee) => {
                this._addHistoryClaim(formattedLogs, currentLog, currentAssignee)
                this._addHistoryUnclaim(formattedLogs, currentLog, currentAssignee, previousAssignee)

                return currentAssignee
            }, null)

            return currentLog
        }, null)
        return formattedLogs
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

    _addHistoryComplete(formattedLogs, currentLog, previousLog) {
        if (previousLog && !previousLog.canceled) {
            const historyComplete = this._getHistoryComplete(currentLog, previousLog)

            formattedLogs.push(historyComplete)
        }
    }

    _addHistoryUncomplete(formattedLogs, currentLog, previousLog) {
        if (previousLog && previousLog.canceled) {
            const historyUncomplete = this._getHistoryUncomplete(currentLog, previousLog)

            formattedLogs.push(historyUncomplete)
        }
    }

    _addHistoryClaim(formattedLogs, currentLog, currentAssignee) {
        if (currentAssignee.assignee) {
            const assignee = currentAssignee.assignee
            const assigneeDate = currentAssignee.assigneeDate
            const historyClaim = this._getHistoryClaim(currentLog, assignee, assigneeDate)

            formattedLogs.push(historyClaim)
        }
    }

    _addHistoryUnclaim(formattedLogs, currentLog, currentAssignee, previousAssignee) {
        if (!currentAssignee.assignee) {
            const assignee = previousAssignee.assignee
            const assigneeDate = currentAssignee.assigneeDate
            const historyUnclaim = this._getHistoryUnclaim(currentLog, assignee, assigneeDate)

            formattedLogs.push(historyUnclaim)
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
