import moment from 'moment-timezone'
import { actionTypes } from '../../store'

export default class AzBpmHistory {
    constructor(store) {
        this.store = store
    }

    getHistory(processKey, businessKey) {
        return this._findLogs(processKey, businessKey).then((logs) => this._formatLogs(logs))
    }

    getHumanizedDuration(startDate, endDate) {
        const momentStartDate = moment(startDate)
        const momentEndDate = moment(endDate)
        const momentDuration = moment.duration(momentEndDate.diff(momentStartDate))

        const duration = this._getDurationWithProperScale(momentDuration)

        return this._humanizeDuration(duration)
    }

    _findLogs(processKey, businessKey) {
        const processLogsParams = this._getProcessLogsParams(processKey, businessKey)
        return Promise.resolve(this.store.dispatch(actionTypes.BPM.GET_PROCESS_LOGS, processLogsParams))
    }

    _getProcessLogsParams(processKey, businessKey) {
        return {
            processKey,
            businessKey,
        }
    }

    _formatLogs(logs) {
        const history = []

        logs.forEach((currentLog, currentLogIndex) => {
            const previousLog = this._findPreviousTaskLastLog(logs, currentLogIndex, currentLog.originTask)

            this._addHistoryComplete(history, currentLog, previousLog)
            this._addHistoryUncomplete(history, currentLog, previousLog)

            const assignees = currentLog.activityAssignees || []
            assignees.reduce((previousAssignee, currentAssignee) => {
                this._addHistoryClaim(history, currentLog, previousLog, currentAssignee)
                this._addHistoryUnclaim(history, currentLog, previousLog, currentAssignee, previousAssignee)

                return currentAssignee
            }, null)

            this._addHistoryFinish(history, currentLog)
        })

        this._sortHistory(history)

        return history
    }

    _sortHistory(history) {
        history.sort((previousHistory, currentHistory) => {
            return Date.parse(previousHistory.date) - Date.parse(currentHistory.date)
        })
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

    _addHistoryFinish(history, currentLog) {
        if (currentLog.state === 'COMPLETED') {
            const historyFinish = this._getHistoryFinish(currentLog)

            history.push(historyFinish)
        }
    }

    _addHistoryClaim(history, currentLog, previousLog, currentAssignee) {
        if (currentAssignee.assignee) {
            const historyClaim = this._getHistoryClaim(currentLog, previousLog, currentAssignee)

            history.push(historyClaim)
        }
    }

    _addHistoryUnclaim(history, currentLog, previousLog, currentAssignee, previousAssignee) {
        if (!currentAssignee.assignee) {
            const historyUnclaim = this._getHistoryUnclaim(currentLog, previousLog, currentAssignee, previousAssignee)

            history.push(historyUnclaim)
        }
    }

    _getHistoryClaim(currentLog, previousLog, currentAssignee) {
        const defaultData = this._getDefaultData()

        defaultData.status = previousLog ? 'RECEBIDO' : 'CRIADO'
        defaultData.icon = previousLog ? 'mdi-account-arrow-left' : 'mdi-text-box-check-outline'
        defaultData.taskName = currentLog.activityName
        defaultData.assignee = previousLog && previousLog.completeUser
        defaultData.toAssignee = currentAssignee.assignee
        defaultData.date = currentAssignee.assigneeDate
        defaultData.uoName = this._getUOName(currentLog, previousLog)

        return defaultData
    }

    _getHistoryUnclaim(currentLog, previousLog, currentAssignee, previousAssignee) {
        const defaultData = this._getDefaultData()

        defaultData.status = 'RECEBIMENTO CANCELADO'
        defaultData.icon = 'mdi-account-cancel'
        defaultData.date = currentAssignee.assigneeDate
        defaultData.taskName = currentLog.activityName
        defaultData.assignee = previousAssignee && previousAssignee.assignee
        defaultData.uoName = this._getUOName(currentLog, previousLog)

        return defaultData
    }

    _getHistoryFinish(currentLog) {
        const defaultData = this._getDefaultData()

        defaultData.status = 'FINALIZADO'
        defaultData.icon = 'mdi-progress-check'
        defaultData.date = currentLog.activityEndTime || currentLog.completeDate || currentLog.routingDate
        defaultData.taskName = currentLog.activityName
        defaultData.assignee = currentLog.completeUser || currentLog.routingUser
        defaultData.uoName = currentLog.uoOrigin ? currentLog.uoOrigin.sigla : ''

        return defaultData
    }

    _getHistoryComplete(currentLog, previousLog) {
        const defaultData = this._getDefaultData()

        defaultData.status = 'ENCAMINHADO'
        defaultData.icon = 'mdi-progress-check'
        defaultData.date = previousLog.activityEndTime || previousLog.completeDate || previousLog.routingDate
        defaultData.taskName = previousLog.activityName
        defaultData.toTaskName = currentLog.activityName
        defaultData.assignee = previousLog.completeUser || previousLog.routingUser
        defaultData.uoName = previousLog.uoOrigin ? previousLog.uoOrigin.sigla : ''
        defaultData.toUoName = previousLog.uoDestination ? previousLog.uoDestination.sigla : ''

        return defaultData
    }

    _getHistoryUncomplete(currentLog, previousLog) {
        const defaultData = this._getDefaultData()

        defaultData.status = 'ENCAMINHAMENTO CANCELADO'
        defaultData.icon = 'mdi-progress-close'
        defaultData.date = previousLog.activityEndTime || previousLog.uncompleteDate
        defaultData.taskName = previousLog.activityName
        defaultData.toTaskName = currentLog.activityName
        defaultData.assignee = previousLog.uncompleteUser
        defaultData.uoName = previousLog.uoDestination ? previousLog.uoDestination.sigla : ''
        defaultData.toUoName = previousLog.uoOrigin ? previousLog.uoOrigin.sigla : ''

        return defaultData
    }

    _getDefaultData() {
        return {
            status: '',
            icon: '',
            date: null,
            taskName: '',
            toTaskName: '',
            assignee: null,
            toAssignee: null,
            uoName: '',
            toUoName: '',
        }
    }

    _getUOName(currentLog, previousLog) {
        const previousLogCanceled = previousLog && previousLog.canceled
        const uoDestinationName = previousLog && previousLog.uoDestination && previousLog.uoDestination.sigla
        const uoOriginName = previousLog && previousLog.uoOrigin && previousLog.uoOrigin.sigla
        const uoDefault = currentLog.uoOrigin && currentLog.uoOrigin.sigla
        const uoName = previousLogCanceled ? uoOriginName : uoDestinationName

        return uoName || uoDefault || ''
    }

    _findPreviousTaskLastLog(logs, currentLogIndex, originTaskId) {
        const previousLogIndex = currentLogIndex - 1
        if (!originTaskId) {
            return logs[previousLogIndex] || null
        }

        for (let logIndex = previousLogIndex; logIndex >= 0; logIndex--) {
            const log = logs[logIndex]
            if (log.taskId === originTaskId) {
                return log
            }
        }

        return null
    }

    _getDurationWithProperScale(momentDuration) {
        const durations = [
            this._createDuration(momentDuration.asDays(), 'dia'),
            this._createDuration(momentDuration.asHours(), 'hora'),
            this._createDuration(momentDuration.asMinutes(), 'minuto'),
            this._createDuration(momentDuration.asSeconds(), 'segundo'),
        ]

        return durations.find((duration) => duration.quantity >= 1 || duration.unit === 'segundo')
    }

    _createDuration(quantity, unit) {
        return {
            quantity: Math.max(Math.floor(quantity), 0),
            unit,
        }
    }

    _humanizeDuration(duration) {
        const quantity = duration.quantity
        const unit = duration.unit

        return `${quantity} ${unit}${quantity !== 1 ? 's' : ''}`
    }
}
