import AzConfirm from './AzConfirm'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('AzConfirm.spec.js', () => {
    let wrapper

    beforeEach(() => {
        const propsData = {
            labelConfirm: 'Confirm',
            labelDecline: 'Decline'
        }
        wrapper = shallowMount(AzConfirm, { localVue, propsData })
    })

    it('Labels are properly rendered', () => {
        expect(wrapper.html()).toContain('Confirm')
        expect(wrapper.html()).toContain('Decline')
    })

    it('Component has default max width', () => {
        expect(wrapper.vm.maxWidth).toBeGreaterThan(0)
    })

    it('Events are being emmited', () => {
        const btnDecline = wrapper.find('#btnDecline')
        btnDecline.vm.$emit('click')
        expect(wrapper.emitted().onDecline).toBeTruthy()

        const btnConfirm = wrapper.find('#btnConfirm')
        btnConfirm.vm.$emit('click')
        expect(wrapper.emitted().onConfirm).toBeTruthy()
    })
})
