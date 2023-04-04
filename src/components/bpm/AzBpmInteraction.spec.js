import Vue from 'vue'
import Vuetify from 'vuetify'
import AzBpmInteraction from './AzBpmInteraction'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import { actionTypes } from '@/store'

const localVue = createLocalVue()
Vue.use(Vuex)
Vue.use(Vuetify)

const createDefaultProps = () => {
    return {
        id: 'az-interaction-id-example',
        authorities: [],
        businessKey: 'business-key-example',
        processKey: 'process-key-example',
        disabled: false,
    }
}

const createStoreState = () => ({
    loki: {
        user: {
            authorities: [],
        },
    },
})

const createStoreActions = () => ({
    [actionTypes.BPM.PROCESS_INSTANCE]: jest.fn(),
})

const createStore = ({ state } = {}) => {
    const actions = createStoreActions()

    return new Vuex.Store({
        state,
        actions,
    })
}

const createProcessInstanceMock = () => ({
    currentTask: {
        candidateGroups: [],
        candidateUsers: ['admin'],
        revokedPermissions: 'Permission.Mock1,Permission.Mock2',
    },
})

const createWrapper = ({ propsData = {}, store, shallow = true }) => {
    const options = {
        localVue,
        propsData,
        store,
    }
    const mountingFunction = shallow ? shallowMount : mount
    const wrapper = mountingFunction(AzBpmInteraction, options)
    wrapper.vm.getProcessInstance = jest.fn(() => createProcessInstanceMock())
    return wrapper
}

describe('AzBpmInteraction.spec.js', () => {
    let propsData, state, store, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        state = createStoreState()
        store = createStore({ state })
        wrapper = createWrapper({ propsData, store })
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

        it('Should throw error if businessKey is not provided', () => {
            propsData.businessKey = undefined
            wrapper = createWrapper({ propsData, store })
            expect(wrapper.props().businessKey).toEqual('')
        })

        it('Should receive processKey', () => {
            expect(wrapper.props().processKey).toEqual(propsData.processKey)
        })

        it('Should throw error if processKey is not provided', () => {
            propsData.processKey = undefined
            wrapper = createWrapper({ propsData, store })
            expect(wrapper.props().processKey).toEqual('')
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
        it('Should receive id', () => {
            state = createStoreState()
            state.loki.user.authorities = []

            store = createStore({ state })
            wrapper = createWrapper({ propsData, state })

            expect(wrapper.props().id).toEqual(propsData.id)
        })
    })
})
