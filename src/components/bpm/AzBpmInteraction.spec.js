import Vue from 'vue'
import AzBpmInteraction from './AzBpmInteraction'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import bpmConstants from './bpm-constants'

const localVue = createLocalVue()
Vue.use(Vuex)

const createDefaultProps = () => {
    return {
        id: 'az-interaction-id-example',
        authorities: ['authority-example-01'],
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
            ],
            roles: ['user-role-example-01'],
        },
        bpm: {
            api: 'api/bpm',
            process: {
                [propsData.processKey]: {
                    [propsData.businessKey]: {
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
    statusInstance: bpmConstants.STATUS_INSTANCE.ACTIVE,
    currentTask: {
        assignee: {
            name: 'user-name-example-01',
        },
        candidateGroups: ['user-role-example-01'],
        candidateUsers: ['user-name-example-01'],
        revokedPermissions: '',
        firstTask: false,
    },
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

        it('Should be false if has some revoked authority', () => {
            process.instance.currentTask.revokedPermissions = 'authority-example-01'
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if there are authorities in props and user has no authority included in them', () => {
            propsData.authorities = ['authority-example-02']
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
            process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ENDED
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if status instance is active without assignee', () => {
            process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ACTIVE
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
        describe('Select', () => {
            it('Should not show if status instance is not active', () => {
                process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ENDED
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.show).toBe(false)
            })

            it('Should not show if has no assignee', () => {
                process.instance.currentTask.assignee = null
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.show).toBe(false)
            })

            it('Should not show if has no next tasks', () => {
                process.instance.nextTasks = []
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.show).toBe(false)
            })

            it('Should not show if some next task has no human decision', () => {
                process.instance.nextTasks.push({
                    taskId: 'next-user-task-02',
                    taskName: 'Next user task 02',
                    flowExpression: '${randomVariable == "randomValue"}',
                })
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.show).toBe(false)
            })

            it('Should show if every next task has human decision', () => {
                expect(wrapper.vm.components.select.show).toBe(true)
            })

            it('Should disable if is loading process instance', () => {
                process.isLoading = true
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.disabled).toBe(true)
            })

            it('Should disable if user is not a candidate user and does not belong to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.disabled).toBe(true)
            })

            it('Should not disable if user is a candidate user', () => {
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.disabled).toBe(false)
            })

            it('Should not disable if user belongs to candidate group', () => {
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                store = createStore({ state })
                wrapper = createWrapper({ propsData, store })

                expect(wrapper.vm.components.select.disabled).toBe(false)
            })

            it('Should have items as array', () => {
                expect(Array.isArray(wrapper.vm.components.select.items)).toBe(true)
            })

            it('Should have property "text" in every item of items array', () => {
                for (const item of wrapper.vm.components.select.items) {
                    expect(item.hasOwnProperty('text')).toBe(true)
                }
            })

            it('Should have property "value" in every item of items array', () => {
                for (const item of wrapper.vm.components.select.items) {
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
                    process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ENDED
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
                    process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ENDED
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
                    process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ENDED
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
                    process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ENDED
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
                        process.instance.previousTask.assignee = 'user-name-example-02'
                        process.instance.previousTask.candidateGroups = ['user-role-example-02']
                        store = createStore({ state })
                        wrapper = createWrapper({ propsData, store })

                        expect(getButton().disabled).toBe(true)
                    }
                )

                it('Should not disable if user is a candidate user in previous task', () => {
                    process.instance.currentTask.candidateGroups = ['user-role-example-02']
                    store = createStore({ state })
                    wrapper = createWrapper({ propsData, store })

                    expect(getButton().disabled).toBe(false)
                })

                it('Should not disable if user belongs to candidate group', () => {
                    process.instance.previousTask.assignee = 'user-name-example-02'
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
