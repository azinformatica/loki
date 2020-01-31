import AzConfirm from './AzConfirm'
import { createLocalVue, mount } from '@vue/test-utils'
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
        wrapper = mount(AzConfirm, { localVue, propsData, vuetify: new Vuetify() })
    })

    it('Labels are properly rendered', () => {
        expect(wrapper.html()).toContain('Confirm')
        expect(wrapper.html()).toContain('Decline')
    })

    it('Component has default max width', () => {
        expect(wrapper.vm.maxWidth).toBeGreaterThan(0)
    })

    it('Events are being emmited', () => {
        wrapper
            .findAll('button')
            .at(0)
            .trigger('click.native')
        expect(wrapper.emitted().onDecline).toBeTruthy()

        wrapper
            .findAll('button')
            .at(1)
            .trigger('click.native')
        expect(wrapper.emitted().onConfirm).toBeTruthy()
    })
})
