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
        authorities: [],
        businessKey: 'business-key-example',
        processKey: 'process-key-example',
        disabled: false,
    }
}

const createStoreState = ({ propsData }) => ({
    loki: {
        user: {
            name: '',
            authorities: [],
            roles: [],
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

const updateStateProcess = ({ state, propsData }, callback) => {
    const process = state.loki.bpm.process[propsData.processKey][propsData.businessKey]
    return callback(process)
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
        assignee: null,
        candidateGroups: [],
        candidateUsers: [],
        revokedPermissions: '',
    },
    previousTask: {
        candidateGroups: [],
        assignee: null,
    },
})

const createWrapper = ({ propsData = {}, store, shallow = true }) => {
    const options = {
        localVue,
        propsData,
        store,
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzBpmInteraction, options)
}

describe('AzBpmInteraction.spec.js', () => {
    let propsData, state, store, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        state = createStoreState({ propsData })
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
            updateStateProcess({ state, propsData }, (process) => {
                process.isLoading = true
            })
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if has some revoked authority', () => {
            state.loki.user.roles = ['authority-example-01']
            updateStateProcess({ state, propsData }, (process) => {
                process.instance.currentTask.revokedPermissions = 'authority-example-01'
            })
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if there are authorities in props and user has no authority included in them', () => {
            propsData.authorities = ['authority-example-01']
            state.loki.user.authorities = [
                {
                    hasAccess: true,
                    name: 'authority-example-02',
                },
            ]
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if status instance is ended', () => {
            propsData.authorities = ['authority-example-01']
            state.loki.user.authorities = [
                {
                    hasAccess: true,
                    name: 'authority-example-01',
                },
            ]
            updateStateProcess({ state, propsData }, (process) => {
                process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ENDED
            })
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if status instance is active without assignee', () => {
            propsData.authorities = ['authority-example-01']
            state.loki.user.authorities = [
                {
                    hasAccess: true,
                    name: 'authority-example-01',
                },
            ]
            updateStateProcess({ state, propsData }, (process) => {
                process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ACTIVE
                process.instance.currentTask.assignee = null
            })
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be false if user is not a candidate user and does not belong to candidate group', () => {
            propsData.authorities = ['authority-example-01']
            state.loki.user.name = 'user-name-example-01'
            state.loki.user.roles = ['user-role-example-01']
            state.loki.user.authorities = [
                {
                    hasAccess: true,
                    name: 'authority-example-01',
                },
            ]
            updateStateProcess({ state, propsData }, (process) => {
                process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ACTIVE
                process.instance.currentTask.assignee = {
                    name: 'assignee-example-01',
                }
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
            })
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(false)
        })

        it('Should be true if user is a candidate user', () => {
            propsData.authorities = ['authority-example-01']
            state.loki.user.name = 'user-name-example-01'
            state.loki.user.roles = ['user-role-example-01']
            state.loki.user.authorities = [
                {
                    hasAccess: true,
                    name: 'authority-example-01',
                },
            ]
            updateStateProcess({ state, propsData }, (process) => {
                process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ACTIVE
                process.instance.currentTask.assignee = {
                    name: 'assignee-example-01',
                }
                process.instance.currentTask.candidateUsers = ['user-name-example-01']
                process.instance.currentTask.candidateGroups = ['user-role-example-02']
            })
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(true)
        })

        it('Should be true if user belongs to candidate group', () => {
            propsData.authorities = ['authority-example-01']
            state.loki.user.name = 'user-name-example-01'
            state.loki.user.roles = ['user-role-example-01']
            state.loki.user.authorities = [
                {
                    hasAccess: true,
                    name: 'authority-example-01',
                },
            ]
            updateStateProcess({ state, propsData }, (process) => {
                process.instance.statusInstance = bpmConstants.STATUS_INSTANCE.ACTIVE
                process.instance.currentTask.assignee = {
                    name: 'assignee-example-01',
                }
                process.instance.currentTask.candidateUsers = ['user-name-example-02']
                process.instance.currentTask.candidateGroups = ['user-role-example-01']
            })
            store = createStore({ state })
            wrapper = createWrapper({ propsData, store })

            expect(wrapper.vm.hasAuthority).toBe(true)
        })
    })
})
