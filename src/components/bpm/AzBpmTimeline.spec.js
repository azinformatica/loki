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
    })

    describe('Created', () => {
        it('Should fetch history', () => {
            expect(wrapper.vm.azBpmHistory.getHistory).toHaveBeenCalled()
        })
    })
})
