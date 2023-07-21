import AzBpmProcess from './AzBpmProcess'

const createCurrentTaskMock = () => ({
    id: 'a82cb167-0957-11ee-a3f3-a6628296c1c1',
    key: 'UserTask_example',
    name: 'User name Exemple Task',
    assignee: {
        name: 'user-name-example-01',
    },
    candidateGroups: ['user-role-example-01'],
    candidateUsers: ['user-name-example-01'],
    revokedPermissions: '',
    firstTask: false,
    nextTasks: [
        {
            taskId: 'next-user-task-01',
            taskName: 'Next user task 01',
            flowExpression: '${humanDecision == "next-user-task-01"}',
        },
    ],
    previousTask: {
        assignee: 'user-name-example-01',
        candidateGroups: ['user-role-example-01'],
    },
})

const createProcessInstanceMock = () => ({
    statusInstance: 'ACTIVE',
    currentTasks: [
        {
            id: 'a82cb167-0957-11ee-a3f3-a6628296c1c1',
            key: 'UserTask_example',
            name: 'User name Exemple Task',
            assignee: {
                name: 'user-name-example-01',
            },
            candidateGroups: ['user-role-example-01'],
            candidateUsers: ['user-name-example-01'],
            revokedPermissions: '',
            firstTask: false,
            nextTasks: [
                {
                    taskId: 'next-user-task-01',
                    taskName: 'Next user task 01',
                    flowExpression: '${humanDecision == "next-user-task-01"}',
                },
            ],
            previousTask: {
                key: 'test-key',
                assignee: 'user-name-example-01',
                candidateGroups: ['user-role-example-01'],
            },
        },
    ],
    currentTask: createCurrentTaskMock(),
})

const createStoreState = (processKey, businessKey) => ({
    loki: {
        user: {
            name: 'user-name-example-01',
            authorities: [
                {
                    hasAccess: true,
                    name: 'authority-example-01',
                },
                {
                    hasAccess: true,
                    name: 'authority-example-02',
                },
            ],
            roles: ['user-role-example-01'],
        },
        bpm: {
            api: 'api/bpm',
            process: {
                [processKey]: {
                    [businessKey]: {
                        currentTask: createCurrentTaskMock(),
                        instance: createProcessInstanceMock(),
                        isLoading: false,
                    },
                },
            },
        },
    },
})

const createStore = (state) => {
    const store = {}

    store.state = state
    store.dispatch = jest.fn()
    store.commit = jest.fn()

    return store
}

const getProcess = (state, processKey, businessKey) => {
    return state.loki.bpm.process[processKey][businessKey]
}

describe('AzBpmProcess', () => {
    let azBpmProcess, store, process, state, authorities, processKey, businessKey

    beforeEach(() => {
        processKey = 'process-key'
        businessKey = 'business-key'

        authorities = ['authority-example-01', 'authority-example-02']
        state = createStoreState(processKey, businessKey)
        process = getProcess(state, processKey, businessKey)
        store = createStore(state)
        azBpmProcess = new AzBpmProcess(store, processKey, businessKey)
    })

    describe('hasAuthority', () => {
        it('Should be false if process instance is loading', () => {
            process.isLoading = true

            expect(azBpmProcess.hasAuthority()).toBe(false)
        })

        it('Should be false if every authority was revoked', () => {
            process.instance.currentTask.revokedPermissions = 'authority-example-01,authority-example-02'

            expect(azBpmProcess.hasAuthority()).toBe(false)
        })

        it('Should be true if not every authority was revoked', () => {
            process.instance.currentTask.revokedPermissions = 'authority-example-01'

            expect(azBpmProcess.hasAuthority()).toBe(true)
        })

        it('Should be false if there are authorities in props and user has no authority included in them', () => {
            authorities = ['authority-example-03']

            expect(azBpmProcess.hasAuthority(authorities)).toBe(false)
        })

        it('Should be true if authorities in props is empty', () => {
            authorities = []

            expect(azBpmProcess.hasAuthority(authorities)).toBe(true)
        })

        it('Should be false if status instance is ended', () => {
            process.instance.statusInstance = 'ENDED'

            expect(azBpmProcess.hasAuthority()).toBe(false)
        })

        it('Should be false if status instance is active without assignee', () => {
            process.instance.statusInstance = 'ACTIVE'
            process.instance.currentTask.assignee = null

            expect(azBpmProcess.hasAuthority()).toBe(false)
        })

        it('Should be false if user is not a candidate user and does not belong to candidate group', () => {
            process.instance.currentTask.candidateUsers = ['user-name-example-02']
            process.instance.currentTask.candidateGroups = ['user-role-example-02']

            expect(azBpmProcess.hasAuthority()).toBe(false)
        })

        it('Should be true if user is a candidate user', () => {
            process.instance.currentTask.candidateGroups = ['user-role-example-02']

            expect(azBpmProcess.hasAuthority()).toBe(true)
        })

        it('Should be true if user belongs to candidate group', () => {
            process.instance.currentTask.candidateUsers = ['user-name-example-02']

            expect(azBpmProcess.hasAuthority()).toBe(true)
        })
    })

    describe('getComponents', () => {
        let components

        beforeEach(() => {
            components = azBpmProcess.getComponents()
        })

        describe('SelectHumanDecision', () => {
            it('Should not show if status instance is not active', () => {
                process.instance.statusInstance = 'ENDED'
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.show).toBe(false)
            })

            it('Should not show if has no assignee', () => {
                process.instance.currentTask.assignee = null
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.show).toBe(false)
            })

            it('Should not show if has no next tasks', () => {
                process.instance.currentTask.nextTasks = []
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.show).toBe(false)
            })

            it('Should not show if some next task has no human decision', () => {
                process.instance.currentTask.nextTasks = [
                    {
                        taskId: 'next-user-task-02',
                        taskName: 'Next user task 02',
                        flowExpression: '${randomVariable == "randomValue"}',
                    },
                ]
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.show).toBe(false)
            })

            it('Should show if every next task has human decision', () => {
                const nextTasks = [
                    {
                        taskId: 'next-user-task-02',
                        taskName: 'Next user task 02',
                        flowExpression: '${humanDecision == "humanValue"}',
                    },
                    {
                        taskId: 'next-user-task-02',
                        taskName: 'Next user task 02',
                        flowExpression: '${humanDecision == "humanValue"}',
                    },
                ]

                process.currentTask.nextTasks = nextTasks
                process.instance.currentTask.nextTasks = nextTasks
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.show).toBe(true)
            })

            it('Should disable if is loading process instance', () => {
                process.isLoading = true
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.disabled).toBe(true)
            })

            it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.disabled).toBe(true)
            })

            it('Should not disable if user is a candidate user', () => {
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.disabled).toBe(false)
            })

            it('Should not disable if user belongs to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                components = azBpmProcess.getComponents()

                expect(components.select.humanDecision.disabled).toBe(false)
            })

            it('Should have items as array', () => {
                expect(Array.isArray(components.select.humanDecision.items)).toBe(true)
            })

            it('Should have property "text" in every item of items array', () => {
                for (const item of components.select.humanDecision.items) {
                    expect(item.hasOwnProperty('text')).toBe(true)
                }
            })

            it('Should have property "value" in every item of items array', () => {
                for (const item of components.select.humanDecision.items) {
                    expect(item.hasOwnProperty('value')).toBe(true)
                }
            })
        })

        describe('SelectParallel', () => {
            beforeEach(() => {
                const createCurrentTaskMock = () => ({
                    id: 'a82cb167-0957-11ee-a3f3-a6628296c1c1',
                    key: 'UserTask_example',
                    name: 'User name Exemple Task',
                    assignee: null,
                    candidateGroups: ['user-role-example-01'],
                    candidateUsers: ['user-name-example-01'],
                    revokedPermissions: '',
                    firstTask: false,
                    nextTasks: [
                        {
                            taskId: 'next-user-task-01',
                            taskName: 'Next user task 01',
                            flowExpression: null,
                        },
                    ],
                    isParallel: true,
                    previousTask: {
                        key: 'UserTask_example',
                        name: 'Exemple 1',
                        assignee: 'user-name-example-01',
                        candidateGroups: ['user-name-example-01'],
                        isNextNodeParallelHasSingleOutgoing: false,
                        isNextNodeParallelHasMultipleOutgoing: true,
                    },
                })

                const createOtherCurrentTaskMock = () => ({
                    id: '7dec3761-0a2e-11ee-8cb9-be327d53330d',
                    key: 'UserTask_example',
                    name: 'User name Exemple Task',
                    assignee: null,
                    candidateGroups: ['user-role-example-01'],
                    candidateUsers: ['user-name-example-01'],
                    revokedPermissions: '',
                    firstTask: false,
                    nextTasks: [
                        {
                            taskId: 'next-user-task-02',
                            taskName: 'Next user task 02',
                            flowExpression: null,
                        },
                    ],
                    isParallel: true,
                    previousTask: {
                        key: 'UserTask_example',
                        name: 'Exemple 1',
                        assignee: 'user-name-example-01',
                        candidateGroups: ['user-name-example-01'],
                        isNextNodeParallelHasSingleOutgoing: false,
                        isNextNodeParallelHasMultipleOutgoing: true,
                    },
                })

                const createProcessInstanceMock = () => ({
                    statusInstance: 'ACTIVE',
                    currentTasks: [createCurrentTaskMock(), createOtherCurrentTaskMock()],
                    currentTask: createCurrentTaskMock(),
                })

                process.currentTask = createCurrentTaskMock()
                process.instance = createProcessInstanceMock()

                components = azBpmProcess.getComponents()
            })

            it('Should not show if status instance is not active', () => {
                process.instance.statusInstance = 'ENDED'
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.show).toBe(false)
            })

            it('Should not show if user can not interact with task', () => {
                process.instance.currentTasks[0].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[0].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[0].previousTask.assignee = null
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.show).toBe(false)
            })

            it('Should not show if has no multiple current tasks', () => {
                process.instance.currentTasks.length = 1
                components = azBpmProcess.getComponents()

                expect(process.instance.currentTasks.length < 2).toBe(true)
                expect(components.select.parallel.show).toBe(false)
            })

            it('Should show if user is in candidateGroups in at least one of the current tasks', () => {
                process.instance.currentTasks[0].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[0].previousTask.assignee = null
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.show).toBe(true)
            })

            it('Should show if user is in candidateUsers in at least one of the current tasks', () => {
                process.instance.currentTasks[0].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[0].previousTask.assignee = null
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.show).toBe(true)
            })

            it('Should show if user is assigne in at least one of the current tasks previous task', () => {
                process.instance.currentTasks[0].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[0].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.show).toBe(true)
            })

            it('Should not show if has moreThenOneCurrentTasksUserHasPermissionForAction', () => {
                expect(components.select.parallel.show).toBe(true)
            })

            it('Should disable if is loading process instance', () => {
                process.isLoading = true
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.disabled).toBe(true)
            })

            it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.disabled).toBe(true)
            })

            it('Should not disable if user is a candidate user', () => {
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.disabled).toBe(false)
            })

            it('Should not disable if user belongs to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                components = azBpmProcess.getComponents()

                expect(components.select.parallel.disabled).toBe(false)
            })

            it('Should have items as array', () => {
                expect(Array.isArray(components.select.parallel.items)).toBe(true)
            })

            it('Should have property "text" in every item of items array', () => {
                for (const item of components.select.parallel.items) {
                    expect(item.hasOwnProperty('text')).toBe(true)
                }
            })

            it('Should have property "value" in every item of items array', () => {
                for (const item of components.select.parallel.items) {
                    expect(item.hasOwnProperty('value')).toBe(true)
                }
            })
        })

        describe('Button', () => {
            let getButton, buttonType

            beforeAll(() => {
                getButton = () => components.button[buttonType]
            })

            describe('Claim', () => {
                beforeAll(() => {
                    buttonType = 'claim'
                })

                it('Should not show if status instance is not active', () => {
                    process.instance.statusInstance = 'ENDED'
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has assignee', () => {
                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has no assignee', () => {
                    process.instance.currentTask.assignee = null
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(true)
                })

                it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(true)
                })

                it('Should not disable if user is a candidate user', () => {
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should have label', () => {
                    expect(getButton().hasOwnProperty('label')).toBe(true)
                })

                it('Should have action and action must be a function', () => {
                    expect(getButton().hasOwnProperty('action')).toBe(true)
                    expect(typeof getButton().action).toBe('function')
                })
            })

            describe('Unclaim', () => {
                beforeAll(() => {
                    buttonType = 'unclaim'
                })

                it('Should not show if status instance is not active', () => {
                    process.instance.statusInstance = 'ENDED'
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has no assignee', () => {
                    process.instance.currentTask.assignee = null
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has assignee', () => {
                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(true)
                })

                it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(true)
                })

                it('Should not disable if user is a candidate user', () => {
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should have label', () => {
                    expect(getButton().hasOwnProperty('label')).toBe(true)
                })

                it('Should have action and action must be a function', () => {
                    expect(getButton().hasOwnProperty('action')).toBe(true)
                    expect(typeof getButton().action).toBe('function')
                })
            })

            describe('Complete', () => {
                beforeAll(() => {
                    buttonType = 'complete'
                })

                it('Should not show if status instance is not active', () => {
                    process.instance.statusInstance = 'ENDED'
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has no assignee', () => {
                    process.instance.currentTask.assignee = null
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has assignee', () => {
                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(true)
                })

                it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(true)
                })

                it('Should not disable if user is a candidate user', () => {
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should have label', () => {
                    expect(getButton().hasOwnProperty('label')).toBe(true)
                })

                it('Should have action and action must be a function', () => {
                    expect(getButton().hasOwnProperty('action')).toBe(true)
                    expect(typeof getButton().action).toBe('function')
                })
            })

            describe('Uncomplete', () => {
                beforeAll(() => {
                    buttonType = 'uncomplete'
                })

                it('Should not show if status instance is not active', () => {
                    process.instance.statusInstance = 'ENDED'
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has assignee', () => {
                    expect(getButton().show).toBe(false)
                })

                it('Should not show if is first task', () => {
                    process.instance.currentTask.assignee = null
                    process.instance.currentTask.firstTask = true
                    process.instance.currentTask.previousTask = {}
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has no assignee and is not first task', () => {
                    process.instance.currentTask.assignee = null
                    components = azBpmProcess.getComponents()

                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(true)
                })

                it(
                    'Should disable if is not a candidate user' +
                        'and does not belong to candidate group in previous task',
                    () => {
                        process.instance.currentTask.previousTask.assignee = 'user-name-example-02'
                        process.instance.currentTask.previousTask.candidateGroups = ['user-role-example-02']
                        components = azBpmProcess.getComponents()

                        expect(getButton().disabled).toBe(true)
                    }
                )

                it('Should not disable if user is a candidate user in previous task', () => {
                    process.currentTask.candidateGroups = ['user-role-example-01']
                    process.instance.currentTask.candidateGroups = ['user-role-example-01']
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.previousTask.assignee = 'user-name-example-01'
                    components = azBpmProcess.getComponents()

                    expect(getButton().disabled).toBe(false)
                })

                it('Should have label', () => {
                    expect(getButton().hasOwnProperty('label')).toBe(true)
                })

                it('Should have action and action must be a function', () => {
                    expect(getButton().hasOwnProperty('action')).toBe(true)
                    expect(typeof getButton().action).toBe('function')
                })
            })
        })
    })
})
