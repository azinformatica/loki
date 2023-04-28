import AzBpmHistory from './AzBpmHistory'

describe('AzBpmHistory', () => {
    let azBpmHistory

    beforeEach(() => {
        azBpmHistory = new AzBpmHistory({})
        azBpmHistory.store.dispatch = jest.fn(
            () =>
                new Promise((resolve) =>
                    resolve([
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
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '1418a35f-d3ba-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0q6mnuh',
                            activityName: 'Quinto',
                            activityStartTime: '2023-04-05T10:59:27.288-0300',
                            activityEndTime: '2023-04-05T10:59:42.083-0300',
                            activityDuration: 14795,
                            previousTask: 'f04f1bb6-d3b9-11ed-9b7f-0aac80447f94',
                            completeDate: '2023-04-05T10:59:42.059-0300',
                            completeUser: 'Administrador do sistema',
                            completeUserLogin: 'admin',
                            activityAssignees: [
                                {
                                    assigneeLogin: 'admin',
                                    assignee: 'Administrador do sistema',
                                    assigneeDate: '2023-04-05T10:59:33.966-0300',
                                },
                            ],
                            activityType: 'userTask',
                            canceled: false,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '1cea5437-d3ba-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0vyxa16',
                            activityName: 'Segundo',
                            activityStartTime: '2023-04-05T10:59:42.084-0300',
                            activityEndTime: '2023-04-05T11:14:58.683-0300',
                            activityDuration: 916599,
                            activityAssignees: null,
                            activityType: 'userTask',
                            canceled: true,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '3f40b0f3-d3bc-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0q6mnuh',
                            activityName: 'Quinto',
                            activityStartTime: '2023-04-05T11:14:58.685-0300',
                            activityEndTime: '2023-04-05T11:15:03.623-0300',
                            activityDuration: 4938,
                            previousTask: 'f04f1bb6-d3b9-11ed-9b7f-0aac80447f94',
                            completeDate: '2023-04-05T11:15:03.605-0300',
                            completeUser: 'Administrador do sistema',
                            completeUserLogin: 'admin',
                            activityAssignees: [
                                {
                                    assigneeLogin: 'admin',
                                    assignee: 'Administrador do sistema',
                                    assigneeDate: '2023-04-05T11:15:00.243-0300',
                                },
                            ],
                            activityType: 'userTask',
                            canceled: false,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '4232049c-d3bc-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0vyxa16',
                            activityName: 'Segundo',
                            activityStartTime: '2023-04-05T11:15:03.624-0300',
                            activityEndTime: '2023-04-05T11:15:07.882-0300',
                            activityDuration: 4258,
                            previousTask: '3f40b0f3-d3bc-11ed-9b7f-0aac80447f94',
                            completeDate: '2023-04-05T11:15:07.861-0300',
                            completeUser: 'Administrador do sistema',
                            completeUserLogin: 'admin',
                            activityAssignees: [
                                {
                                    assigneeLogin: 'admin',
                                    assignee: 'Administrador do sistema',
                                    assigneeDate: '2023-04-05T11:15:06.664-0300',
                                },
                            ],
                            activityType: 'userTask',
                            canceled: false,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '44bbe3e4-d3bc-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0q6mnuh',
                            activityName: 'Quinto',
                            activityStartTime: '2023-04-05T11:15:07.882-0300',
                            activityEndTime: '2023-04-05T11:15:14.307-0300',
                            activityDuration: 6425,
                            previousTask: '4232049c-d3bc-11ed-9b7f-0aac80447f94',
                            completeDate: '2023-04-05T11:15:14.289-0300',
                            completeUser: 'Administrador do sistema',
                            completeUserLogin: 'admin',
                            activityAssignees: [
                                {
                                    assigneeLogin: 'admin',
                                    assignee: 'Administrador do sistema',
                                    assigneeDate: '2023-04-05T11:15:08.708-0300',
                                },
                                {
                                    assigneeLogin: null,
                                    assignee: null,
                                    assigneeDate: '2023-04-05T11:15:09.989-0300',
                                },
                                {
                                    assigneeLogin: 'admin',
                                    assignee: 'Administrador do sistema',
                                    assigneeDate: '2023-04-05T11:15:10.996-0300',
                                },
                            ],
                            activityType: 'userTask',
                            canceled: false,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '48906ba2-d3bc-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0vyxa16',
                            activityName: 'Segundo',
                            activityStartTime: '2023-04-05T11:15:14.308-0300',
                            activityEndTime: '2023-04-05T11:15:18.910-0300',
                            activityDuration: 4602,
                            activityAssignees: null,
                            activityType: 'userTask',
                            canceled: true,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '4b4ea154-d3bc-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0q6mnuh',
                            activityName: 'Quinto',
                            activityStartTime: '2023-04-05T11:15:18.911-0300',
                            activityEndTime: '2023-04-05T11:15:20.862-0300',
                            activityDuration: 1951,
                            activityAssignees: null,
                            activityType: 'userTask',
                            canceled: true,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '4c787b67-d3bc-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0vyxa16',
                            activityName: 'Segundo',
                            activityStartTime: '2023-04-05T11:15:20.863-0300',
                            activityEndTime: '2023-04-05T11:16:05.110-0300',
                            activityDuration: 44247,
                            previousTask: '3f40b0f3-d3bc-11ed-9b7f-0aac80447f94',
                            uncompleteUser: 'Administrador do sistema',
                            uncompleteUserLogin: 'admin',
                            uncompleteDate: '2023-04-05T11:16:05.100-0300',
                            activityAssignees: [
                                {
                                    assigneeLogin: 'admin',
                                    assignee: 'Administrador do sistema',
                                    assigneeDate: '2023-04-05T11:15:59.563-0300',
                                },
                                {
                                    assigneeLogin: null,
                                    assignee: null,
                                    assigneeDate: '2023-04-05T11:16:03.907-0300',
                                },
                            ],
                            activityType: 'userTask',
                            canceled: true,
                        },
                        {
                            processDefinitionId: 'process_002:1:0c9fa754-d2fa-11ed-876f-0242ac120007',
                            instanceId: '35e2a6a8-d3b9-11ed-9b7f-0aac80447f94',
                            taskId: '66d809f0-d3bc-11ed-9b7f-0aac80447f94',
                            activityId: 'UserTask_0q6mnuh',
                            activityName: 'Quinto',
                            activityStartTime: '2023-04-05T11:16:05.110-0300',
                            activityEndTime: null,
                            activityDuration: null,
                            previousTask: 'f04f1bb6-d3b9-11ed-9b7f-0aac80447f94',
                            activityAssignees: [
                                {
                                    assigneeLogin: 'admin',
                                    assignee: 'Administrador do sistema',
                                    assigneeDate: '2023-04-05T11:25:48.592-0300',
                                },
                            ],
                            activityType: 'userTask',
                            canceled: false,
                        },
                    ])
                )
        )
    })

    it('zica', () => {
        azBpmHistory.getLogs('a', 'b').then((logs) => console.log())
    })
})
