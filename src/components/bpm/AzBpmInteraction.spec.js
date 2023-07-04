import 'regenerator-runtime/runtime'
import Vue from 'vue'
import AzBpmInteraction from './AzBpmInteraction'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
const localVue = createLocalVue()
Vue.use(Vuex)

const createDefaultProps = () => {
    return {
        id: 'az-interaction-id-example',
        authorities: ['authority-example-01', 'authority-example-02'],
        businessKey: 'business-key-example',
        processKey: 'process-key-example',
        disabled: false,
    }
}

const createStoreState = ({ propsData }) => ({
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
                [propsData.processKey]: {
                    [propsData.businessKey]: {
                        currentTask: createCurrentTaskMock(),
                        instance: createProcessInstanceMock(),
                        isLoading: false,
                    },
                },
            },
        },
    },
})

const getProcess = ({ state, propsData }) => {
    return state.loki.bpm.process[propsData.processKey][propsData.businessKey]
}

const createStore = ({ state } = {}) => {
    const store = new Vuex.Store({
        state,
    })

    store.dispatch = jest.fn()
    store.commit = jest.fn()

    return store
}

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
                assignee: 'user-name-example-01',
                candidateGroups: ['user-role-example-01'],
            },
        },
    ],
    currentTask: createCurrentTaskMock(),
})

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

const createScopedSlots = () => ({
    default: `
        <template>
            {{ !!props.hasAuthority }}
            {{ !!props.processInstance }}
            {{ !!props.components }}
        </template>
    `,
})

const createWrapper = ({ propsData = {}, store, shallow = true }) => {
    const scopedSlots = createScopedSlots()
    const options = {
        localVue,
        propsData,
        store,
        scopedSlots,
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzBpmInteraction, options)
}

describe('AzBpmInteraction.spec.js', () => {
    let propsData, state, process, store, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        state = createStoreState({ propsData })
        process = getProcess({ state, propsData })
        store = createStore({ state })
        wrapper = createWrapper({ propsData, store, shallow: false })
    })

    describe('Props', () => {
        it('Should receive id', () => {
            expect(wrapper.props().id).toEqual(propsData.id)
        })

        it('Should receive authorities', () => {
            expect(wrapper.props().authorities).toStrictEqual(propsData.authorities)
        })

        it('Should have a default value to authorities', () => {
            propsData.authorities = undefined
            wrapper = createWrapper({ propsData, store })
            expect(wrapper.props().authorities.hasOwnProperty('length')).toBeTruthy()
        })

        it('Should receive businessKey', () => {
            expect(wrapper.props().businessKey).toEqual(propsData.businessKey)
        })

        it('Should receive processKey', () => {
            expect(wrapper.props().processKey).toEqual(propsData.processKey)
        })

        it('Should receive disabled', () => {
            expect(wrapper.props().disabled).toEqual(propsData.disabled)
        })

        it('Should throw error if disabled is not provided', () => {
            propsData.disabled = undefined
            wrapper = createWrapper({ propsData, store })
            expect(wrapper.props().disabled).toBe(false)
        })
    })

    describe('hasAuthority', () => {
        it('Should be false if bpm interaction is disabled', () => {
            propsData.disabled = true
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if process instance is loading', () => {
            process.isLoading = true
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if every authority was revoked', () => {
            process.instance.currentTask.revokedPermissions = 'authority-example-01,authority-example-02'
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be true if not every authority was revoked', () => {
            process.instance.currentTask.revokedPermissions = 'authority-example-01'
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(true)
        })

        it('Should be false if there are authorities in props and user has no authority included in them', () => {
            propsData.authorities = ['authority-example-03']
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be true if authorities in props is empty', () => {
            propsData.authorities = []
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(true)
        })

        it('Should be false if status instance is ended', () => {
            process.instance.statusInstance = 'ENDED'
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if status instance is active without assignee', () => {
            process.instance.statusInstance = 'ACTIVE'
            process.instance.currentTask.assignee = null
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if user is not a candidate user and does not belong to candidate group', () => {
            process.instance.currentTask.candidateUsers = ['user-name-example-02']
            process.instance.currentTask.candidateGroups = ['user-role-example-02']
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be true if user is a candidate user', () => {
            process.instance.currentTask.candidateGroups = ['user-role-example-02']
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(true)
        })

        it('Should be true if user belongs to candidate group', () => {
            process.instance.currentTask.candidateUsers = ['user-name-example-02']
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(true)
        })
    })

    describe('Components', () => {
        describe('SelectHumanDecision', () => {
            it('Should not show if status instance is not active', () => {
                process.instance.statusInstance = 'ENDED'
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.show).toBe(false)
            })

            it('Should not show if has no assignee', () => {
                process.instance.currentTask.assignee = null
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.show).toBe(false)
            })

            it('Should not show if has no next tasks', () => {
                process.instance.currentTask.nextTasks = []
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.show).toBe(false)
            })

            it('Should not show if some next task has no human decision', () => {
                process.instance.currentTask.nextTasks = [
                    {
                        taskId: 'next-user-task-02',
                        taskName: 'Next user task 02',
                        flowExpression: '${randomVariable == "randomValue"}',
                    },
                ]
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.show).toBe(false)
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

                expect(wrapper.vm.components.select.humanDecision.show).toBe(true)
            })

            it('Should disable if is loading process instance', () => {
                process.isLoading = true
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.disabled).toBe(true)
            })

            it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.disabled).toBe(true)
            })

            it('Should not disable if user is a candidate user', () => {
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.disabled).toBe(false)
            })

            it('Should not disable if user belongs to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.humanDecision.disabled).toBe(false)
            })

            it('Should have items as array', () => {
                expect(Array.isArray(wrapper.vm.components.select.humanDecision.items)).toBe(true)
            })

            it('Should have property "text" in every item of items array', () => {
                for (const item of wrapper.vm.components.select.humanDecision.items) {
                    expect(item.hasOwnProperty('text')).toBe(true)
                }
            })

            it('Should have property "value" in every item of items array', () => {
                for (const item of wrapper.vm.components.select.humanDecision.items) {
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
                    currentTasks: [
                        createCurrentTaskMock(),
                        createOtherCurrentTaskMock()
                    ],
                    currentTask: createCurrentTaskMock(),
                })

                propsData = createDefaultProps()
                state = createStoreState({ propsData })
                process = getProcess({ state, propsData })

                process.currentTask = createCurrentTaskMock()
                process.instance = createProcessInstanceMock()
            })

            it('Should not show if status instance is not active', () => {
                process.instance.statusInstance = 'ENDED'
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.show).toBe(false)
            })

            it('Should not show if user can not interact with task', () => {
                process.instance.currentTasks[0].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[0].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[0].previousTask.assignee = null
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null

                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.show).toBe(false)
            })

            it('Should not show if has no multiple current tasks', () => {
                process.instance.currentTasks.length = 1

                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(process.instance.currentTasks.length < 2).toBe(true)
                expect(wrapper.vm.components.select.parallel.show).toBe(false)
            })

            it('Should show if user is in candidateGroups in at least one of the current tasks', () => {
                process.instance.currentTasks[0].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[0].previousTask.assignee = null
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null

                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.show).toBe(true)
            })

            it('Should show if user is in candidateUsers in at least one of the current tasks', () => {
                process.instance.currentTasks[0].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[0].previousTask.assignee = null
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null

                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.show).toBe(true)
            })

            it('Should show if user is assigne in at least one of the current tasks previous task', () => {
                process.instance.currentTasks[0].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[0].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].candidateGroups = ['user-name-example-05']
                process.instance.currentTasks[1].candidateUsers = ['user-name-example-05']
                process.instance.currentTasks[1].previousTask.assignee = null

                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.show).toBe(true)
            })

            it('Should not show if has moreThenOneCurrentTasksUserHasPermissionForAction', () => {
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.show).toBe(true)
            })

            it('Should disable if is loading process instance', () => {
                process.isLoading = true
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.disabled).toBe(true)
            })

            it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.disabled).toBe(true)
            })

            it('Should not disable if user is a candidate user', () => {
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.disabled).toBe(false)
            })

            it('Should not disable if user belongs to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.parallel.disabled).toBe(false)
            })

            it('Should have items as array', () => {
                expect(Array.isArray(wrapper.vm.components.select.parallel.items)).toBe(true)
            })

            it('Should have property "text" in every item of items array', () => {
                for (const item of wrapper.vm.components.select.parallel.items) {
                    expect(item.hasOwnProperty('text')).toBe(true)
                }
            })

            it('Should have property "value" in every item of items array', () => {
                for (const item of wrapper.vm.components.select.parallel.items) {
                    expect(item.hasOwnProperty('value')).toBe(true)
                }
            })
        })

        describe('Button', () => {
            let getButton, buttonType

            beforeAll(() => {
                getButton = () => wrapper.vm.components.button[buttonType]
            })

            describe('Claim', () => {
                beforeAll(() => {
                    buttonType = 'claim'
                })

                it('Should not show if status instance is not active', () => {
                    process.instance.statusInstance = 'ENDED'
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has assignee', () => {
                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has no assignee', () => {
                    process.instance.currentTask.assignee = null
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(true)
                })

                it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(true)
                })

                it('Should not disable if user is a candidate user', () => {
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

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
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has no assignee', () => {
                    process.instance.currentTask.assignee = null
                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has assignee', () => {
                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(true)
                })

                it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(true)
                })

                it('Should not disable if user is a candidate user', () => {
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

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
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has no assignee', () => {
                    process.instance.currentTask.assignee = null
                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has assignee', () => {
                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(true)
                })

                it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(true)
                })

                it('Should not disable if user is a candidate user', () => {
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.candidateUsers = ['user-name-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

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
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().show).toBe(false)
                })

                it('Should not show if has assignee', () => {
                    expect(getButton().show).toBe(false)
                })

                it('Should not show if is first task', () => {
                    process.instance.currentTask.assignee = null
                    process.instance.currentTask.firstTask = true
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().show).toBe(false)
                })

                it('Should show if status instance is active and has no assignee and is not first task', () => {
                    process.instance.currentTask.assignee = null
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().show).toBe(true)
                })

                it('Should disable if is loading process instance', () => {
                    process.isLoading = true
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(true)
                })

                it(
                    'Should disable if is not a candidate user' +
                        'and does not belong to candidate group in previous task',
                    () => {
                        process.instance.currentTask.previousTask.assignee = 'user-name-example-02'
                        process.instance.currentTask.previousTask.candidateGroups = ['user-role-example-02']
                        store = createStore({ state })
                        wrapper = createWrapper({ propsData, store })

                        expect(getButton().disabled).toBe(true)
                    }
                )

                it('Should not disable if user is a candidate user in previous task', () => {
                    process.currentTask.candidateGroups = ['user-role-example-01']
                    process.instance.currentTask.candidateGroups = ['user-role-example-01']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.currentTask.previousTask.assignee = 'user-name-example-01'
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

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

    describe('Scoped slots', () => {
        describe('Default', () => {
            it('Should have the variables provided on scoped slot', () => {
                const regex = /(.*true.*){3}/gs
                expect(regex.test(wrapper.html())).toBe(true)
            })
        })
    })
})
