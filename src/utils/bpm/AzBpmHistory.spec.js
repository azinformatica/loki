import AzBpmHistory from './AzBpmHistory'

describe('AzBpmHistory', () => {
    let azBpmHistory

    beforeAll(() => {
        azBpmHistory = new AzBpmHistory({})
        azBpmHistory.store.dispatch = jest.fn(() => [
            {
                activityName: 'Primeiro',
                activityEndTime: '2023-04-05T10:58:27.246-0300',
                completeUser: 'Administrador do sistema',
                activityAssignees: [
                    {
                        assignee: 'Administrador do sistema',
                        assigneeDate: '2023-04-05T10:58:11.366-0300',
                    },
                ],
                canceled: false,
            },
        ])
        azBpmHistory.getHistory = jest.fn(() => azBpmHistory._formatLogs(azBpmHistory.store.dispatch()))
    })

    describe('getHistory', () => {
        let history, updateHistory, getLastLog

        beforeAll(() => {
            updateHistory = () => (history = azBpmHistory.getHistory())
            getLastLog = () => history[history.length - 1] || null

            updateHistory()
        })

        describe('Property', () => {
            it('Should have "status" property', () => {
                expect(getLastLog().hasOwnProperty('status')).toBe(true)
            })

            it('Should have "icon" property', () => {
                expect(getLastLog().hasOwnProperty('icon')).toBe(true)
            })

            it('Should have "taskName" property', () => {
                expect(getLastLog().hasOwnProperty('taskName')).toBe(true)
            })

            it('Should have "toTaskName" property', () => {
                expect(getLastLog().hasOwnProperty('toTaskName')).toBe(true)
            })

            it('Should have "assignee" property', () => {
                expect(getLastLog().hasOwnProperty('assignee')).toBe(true)
            })

            it('Should have "toAssignee" property', () => {
                expect(getLastLog().hasOwnProperty('toAssignee')).toBe(true)
            })

            it('Should have "date" property', () => {
                expect(getLastLog().hasOwnProperty('date')).toBe(true)
            })
        })

        describe('History finish', () => {
            let currentLog
            beforeEach(() => {
                currentLog = {
                    state: 'COMPLETED',
                    activityName: 'example-name',
                    completeUser: 'example-complete-user',
                    activityEndTime: '2020-02-02',
                }
                azBpmHistory.store.dispatch = jest.fn(() => [currentLog])
                updateHistory()
            })

            it('Should add history with "status" FINALIZADO', () => {
                expect(getLastLog().status).toBe('FINALIZADO')
            })

            it('Should add history with proper "taskName"', () => {
                expect(getLastLog().taskName).toBe(currentLog.activityName)
            })

            it('Should add history with proper "assignee"', () => {
                expect(getLastLog().assignee).toBe(currentLog.completeUser)
            })

            it('Should add history with proper "date"', () => {
                expect(getLastLog().date).toBe(currentLog.activityEndTime)
            })

            it('Should add history with default values on unused fields', () => {
                expect(getLastLog().toAssignee).toBeFalsy()
                expect(getLastLog().toTaskName).toBeFalsy()
            })
        })

        describe('History complete', () => {
            let currentLog, previousLog
            beforeEach(() => {
                previousLog = {
                    canceled: false,
                    activityName: 'example-name-01',
                    activityEndTime: '2020-02-02',
                    completeUser: 'user-name-example',
                }
                currentLog = {
                    activityName: 'example-name-02',
                }

                azBpmHistory.store.dispatch = jest.fn(() => [previousLog, currentLog])
                updateHistory()
            })

            it('Should not add if has no previous log', () => {
                azBpmHistory.store.dispatch = jest.fn(() => [currentLog])
                updateHistory()

                expect(history).toHaveLength(0)
            })

            it('Should not add if is canceled', () => {
                previousLog.canceled = true
                updateHistory()

                expect(history).toHaveLength(1)
                expect(getLastLog().status).not.toBe('ENCAMINHADO')
            })

            it('Should add history with "status" ENCAMINHADO', () => {
                expect(getLastLog().status).toBe('ENCAMINHADO')
            })

            it('Should add history with proper "taskName"', () => {
                expect(getLastLog().taskName).toBe(previousLog.activityName)
            })

            it('Should add history with proper "toTaskName"', () => {
                expect(getLastLog().toTaskName).toBe(currentLog.activityName)
            })

            it('Should add history with proper "assignee"', () => {
                expect(getLastLog().assignee).toBe(previousLog.completeUser)
            })

            it('Should add history with proper "date"', () => {
                expect(getLastLog().date).toBe(previousLog.activityEndTime)
            })

            it('Should add history with default values on unused fields', () => {
                expect(getLastLog().toAssignee).toBeFalsy()
            })
        })

        describe('History uncomplete', () => {
            let currentLog, previousLog
            beforeEach(() => {
                previousLog = {
                    canceled: true,
                    activityName: 'example-name-01',
                    activityEndTime: '2020-02-02',
                    uncompleteUser: 'user-name-example',
                }
                currentLog = {
                    activityName: 'example-name-02',
                }

                azBpmHistory.store.dispatch = jest.fn(() => [previousLog, currentLog])
                updateHistory()
            })

            it('Should not add if has no previous log', () => {
                azBpmHistory.store.dispatch = jest.fn(() => [currentLog])
                updateHistory()

                expect(history).toHaveLength(0)
            })

            it('Should not add if is not canceled', () => {
                previousLog.canceled = false
                updateHistory()

                expect(history).toHaveLength(1)
                expect(history[0].status).not.toBe('ENCAMINHAMENTO CANCELADO')
            })

            it('Should add history with "status" ENCAMINHAMENTO CANCELADO', () => {
                expect(history[0].status).toBe('ENCAMINHAMENTO CANCELADO')
            })

            it('Should add history with proper "taskName"', () => {
                expect(history[0].taskName).toBe(previousLog.activityName)
            })

            it('Should add history with proper "toTaskName"', () => {
                expect(history[0].toTaskName).toBe(currentLog.activityName)
            })

            it('Should add history with proper "assignee"', () => {
                expect(history[0].assignee).toBe(previousLog.uncompleteUser)
            })

            it('Should add history with proper "date"', () => {
                expect(history[0].date).toBe(previousLog.activityEndTime)
            })

            it('Should add history with default values on unused fields', () => {
                expect(history[0].toAssignee).toBeFalsy()
            })
        })

        describe('History claim', () => {
            let previousLog, currentLog, currentAssignee
            beforeEach(() => {
                previousLog = {
                    activityName: 'example-name-01',
                    completeUser: 'user-name-example-01',
                }
                currentAssignee = {
                    assignee: 'user-name-example-02',
                    assigneeDate: '2020-02-02',
                }
                currentLog = {
                    activityName: 'example-name-02',
                    activityAssignees: [currentAssignee],
                }

                azBpmHistory.store.dispatch = jest.fn(() => [previousLog, currentLog])
                updateHistory()
            })

            it('Should not add if has no assignee', () => {
                currentAssignee.assignee = null
                updateHistory()

                expect(getLastLog()).not.toBe('RECEBIDO')
                expect(getLastLog()).not.toBe('CRIADO')
            })

            it('Should add history with "status" RECEBIDO if has previous log', () => {
                expect(getLastLog().status).toBe('RECEBIDO')
            })

            it('Should add history with "status" CRIADO if has no previous log', () => {
                azBpmHistory.store.dispatch = jest.fn(() => [currentLog])
                updateHistory()

                expect(getLastLog().status).toBe('CRIADO')
            })

            it('Should add history with proper "taskName"', () => {
                expect(getLastLog().taskName).toBe(currentLog.activityName)
            })

            it('Should add history with proper "assignee"', () => {
                expect(getLastLog().assignee).toBe(previousLog.completeUser)
            })

            it('Should add history with proper "toAssignee"', () => {
                expect(getLastLog().toAssignee).toBe(currentAssignee.assignee)
            })

            it('Should add history with proper "date"', () => {
                expect(getLastLog().date).toBe(currentAssignee.assigneeDate)
            })

            it('Should add history with default values on unused fields', () => {
                expect(getLastLog().toTaskName).toBeFalsy()
            })
        })

        describe('History unclaim', () => {
            let currentLog, currentAssignee
            beforeEach(() => {
                currentAssignee = {
                    assignee: null,
                    assigneeDate: '2020-02-02',
                }
                currentLog = {
                    activityName: 'example-name-02',
                    activityAssignees: [currentAssignee],
                }

                azBpmHistory.store.dispatch = jest.fn(() => [currentLog])
                updateHistory()
            })

            it('Should not add if has assignee', () => {
                currentAssignee.assignee = 'user-name-example-01'
                updateHistory()

                expect(getLastLog()).not.toBe('RECEBIMENTO CANCELADO')
            })

            it('Should add history with "status" RECEBIMENTO CANCELADO', () => {
                expect(getLastLog().status).toBe('RECEBIMENTO CANCELADO')
            })

            it('Should add history with proper "taskName"', () => {
                expect(getLastLog().taskName).toBe(currentLog.activityName)
            })

            it('Should add history with proper "assignee"', () => {
                expect(getLastLog().assignee).toBe(null)
            })

            it('Should add history with proper "date"', () => {
                expect(getLastLog().date).toBe(currentAssignee.assigneeDate)
            })

            it('Should add history with default values on unused fields', () => {
                expect(getLastLog().toAssignee).toBeFalsy()
                expect(getLastLog().toTaskName).toBeFalsy()
            })
        })
    })

    describe('getHumanizedDuration', () => {
        let duration, startDate, endDate, updateDuration

        beforeAll(() => {
            updateDuration = () => {
                duration = azBpmHistory.getHumanizedDuration(startDate, endDate)
            }
        })

        it('Should show difference in seconds and on singular', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-01T00:00:01'
            updateDuration()

            expect(duration).toBe('1 segundo')
        })

        it('Should show difference in seconds and on plural', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-01T00:00:02'
            updateDuration()

            expect(duration).toBe('2 segundos')
        })

        it('Should show difference in minutes and on singular', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-01T00:01:00'
            updateDuration()

            expect(duration).toBe('1 minuto')
        })

        it('Should show difference in minutes and on plural', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-01T00:02:00'
            updateDuration()

            expect(duration).toBe('2 minutos')
        })

        it('Should show difference in hours and on singular', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-01T01:00:00'
            updateDuration()

            expect(duration).toBe('1 hora')
        })

        it('Should show difference in hours and on plural', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-01T02:00:00'
            updateDuration()

            expect(duration).toBe('2 horas')
        })

        it('Should show difference in days and on singular', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-02T01:00:00'
            updateDuration()

            expect(duration).toBe('1 dia')
        })

        it('Should show difference in days and on plural', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-01-03T00:00:00'
            updateDuration()

            expect(duration).toBe('2 dias')
        })

        it('Should show difference in days even if it has been months', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2023-03-01T00:00:00'
            updateDuration()

            expect(duration).toBe('59 dias')
        })

        it('Should show difference in days if it has been years', () => {
            startDate = '2023-01-01T00:00:00'
            endDate = '2024-01-01T00:00:00'
            updateDuration()

            expect(duration).toBe('365 dias')
        })
    })
})
