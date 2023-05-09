import Vue from 'vue'
import AzBpmTimeline from './AzBpmTimeline'
import AzBpmHistory from '../../utils/AzBpmHistory'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
Vue.use(Vuetify)

AzBpmHistory.prototype.getHistory = jest.fn(() => Promise.resolve([]))

const createDefaultProps = () => {
    return {
        businessKey: 'business-key-example',
        processKey: 'process-key-example',
        initialVisibleItemsLength: 100,
        seeMoreStep: 20,
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
        vuetify: new Vuetify(),
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzBpmTimeline, options)
}

describe('AzBpmTimeline.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData, shallow: false })
    })

    describe('Props', () => {
        it('Should receive businessKey', () => {
            expect(wrapper.props().businessKey).toBe(propsData.businessKey)
        })

        it('Should receive processKey', () => {
            expect(wrapper.props().processKey).toBe(propsData.processKey)
        })

        it('Should receive initialVisibleItemsLength', () => {
            expect(wrapper.props().initialVisibleItemsLength).toBe(propsData.initialVisibleItemsLength)
        })

        it('Should have default initialVisibleItemsLength', () => {
            propsData.initialVisibleItemsLength = undefined
            wrapper = createWrapper({ propsData, shallow: false })

            expect(wrapper.props().initialVisibleItemsLength).toBe(10)
        })

        it('Should receive seeMoreStep', () => {
            expect(wrapper.props().seeMoreStep).toBe(propsData.seeMoreStep)
        })

        it('Should have default seeMoreStep', () => {
            propsData.seeMoreStep = undefined
            wrapper = createWrapper({ propsData, shallow: false })

            expect(wrapper.props().seeMoreStep).toBe(10)
        })
    })

    describe('Created', () => {
        it('Should fetch history', () => {
            expect(wrapper.vm.azBpmHistory.getHistory).toHaveBeenCalled()
        })
    })
})
