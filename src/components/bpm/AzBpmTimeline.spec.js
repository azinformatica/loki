import Vue from 'vue'
import AzBpmHistory from './AzBpmTimeline'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
Vue.use(Vuetify)

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
    return mountingFunction(AzBpmHistory, options)
}

describe('AzBpmTimeline.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData, shallow: false })
    })

    describe('Props', () => {
        it('Should receive businessKey', () => {
            expect(wrapper.props().businessKey).toEqual(propsData.businessKey)
        })

        it('Should receive processKey', () => {
            expect(wrapper.props().processKey).toEqual(propsData.processKey)
        })
    })
})
