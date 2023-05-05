import AzBpmHistory from './AzBpmHistory'

describe('AzBpmHistory', () => {
    let azBpmHistory

    beforeAll(() => {
        azBpmHistory = new AzBpmHistory({})
        azBpmHistory.store.dispatch = jest.fn(() => [
            {
                processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                taskId: '35e4063b-d3b9-11ed-9b7f-0aac80447f94',
                activityId: 'UserTask_0gosj4v',
                activityName: 'Primeiro',
                activityStartTime: '2023-04-05T10:53:14.490-0300',
                activityEndTime: '2023-04-05T10:58:27.246-0300',
                activityDuration: 312756,
                completeDate: '2023-04-05T10:58:27.216-0300',
                completeUser: 'Administrador do sistema',
                completeUserLogin: 'admin',
                activityAssignees: [
                    {
                        assigneeLogin: 'admin',
                        assignee: 'Administrador do sistema',
                        assigneeDate: '2023-04-05T10:58:11.366-0300',
                    },
                ],
                activityType: 'userTask',
                canceled: false,
            },
            {
                processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                taskId: 'f04f1bb6-d3b9-11ed-9b7f-0aac80447f94',
                activityId: 'UserTask_0vyxa16',
                activityName: 'Segundo',
                activityStartTime: '2023-04-05T10:58:27.247-0300',
                activityEndTime: '2023-04-05T10:59:27.284-0300',
                activityDuration: 60037,
                completeDate: '2023-04-05T10:59:27.263-0300',
                completeUser: 'Administrador do sistema',
                completeUserLogin: 'admin',
                previousTask: '35e4063b-d3b9-11ed-9b7f-0aac80447f94',
                activityAssignees: [
                    {
                        assigneeLogin: 'admin',
                        assignee: 'Administrador do sistema',
                        assigneeDate: '2023-04-05T10:58:35.926-0300',
                    },
                ],
                activityType: 'userTask',
                canceled: false,
            },
        ])
    })

    describe('getHistory', () => {
        let history, processKey, businessKey

        beforeAll(async () => {
            processKey = 'example-process-key'
            businessKey = 'example-business-key'
            history = await azBpmHistory.getHistory(processKey, businessKey)
        })

        describe('Property', () => {
            it('Should have "status" property', () => {
                expect(history[0].hasOwnProperty('status')).toBe(true)
            })

            it('Should have "icon" property', () => {
                expect(history[0].hasOwnProperty('icon')).toBe(true)
            })

            it('Should have "taskName" property', () => {
                expect(history[0].hasOwnProperty('taskName')).toBe(true)
            })

            it('Should have "toTaskName" property', () => {
                expect(history[0].hasOwnProperty('toTaskName')).toBe(true)
            })

            it('Should have "assignee" property', () => {
                expect(history[0].hasOwnProperty('assignee')).toBe(true)
            })

            it('Should have "toAssignee" property', () => {
                expect(history[0].hasOwnProperty('toAssignee')).toBe(true)
            })

            it('Should have "date" property', () => {
                expect(history[0].hasOwnProperty('date')).toBe(true)
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
