import 'regenerator-runtime/runtime'
import Vue from 'vue'
import AzBpmInteraction from './AzBpmInteraction'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
const localVue = createLocalVue()
Vue.use(Vuex)

jest.mock('../../utils/bpm/AzBpmProcess.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getComponents: jest.fn(() => ({})),
            hasAuthority: jest.fn(() => false),
            getProcessInstance: jest.fn(() => ({})),
            load: jest.fn(),
        }
    })
})

const createDefaultProps = () => {
    return {
        id: 'az-interaction-id-example',
        authorities: ['authority-example-01', 'authority-example-02'],
        businessKey: 'business-key-example',
        processKey: 'process-key-example',
        disabled: false,
    }
}

const createStoreState = () => ({
    loki: {
        user: {
            name: 'user-name-example-01',
            authorities: [],
            roles: [],
        },
        bpm: {
            api: 'api/bpm',
            process: {},
        },
    },
})

const createStore = ({ state } = {}) => {
    const store = new Vuex.Store({
        state,
    })

    store.dispatch = jest.fn()
    store.commit = jest.fn()

    return store
}

const createScopedSlots = () => ({
    default: `
        <template>
            {{ props.hasOwnProperty('hasAuthority') }}
            {{ props.hasOwnProperty('processInstance') }}
            {{ props.hasOwnProperty('components') }}
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
    let propsData, state, store, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        state = createStoreState()
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

    describe('Scoped slots', () => {
        describe('Default', () => {
            it('Should have the variables provided on scoped slot', () => {
                const regex = /(.*true.*){3}/gs
                expect(regex.test(wrapper.html())).toBe(true)
            })
        })
    })
})
