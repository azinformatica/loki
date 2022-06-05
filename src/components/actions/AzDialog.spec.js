import AzDialog from './AzDialog'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('AzDialog.spec.js', () => {
    let wrapper

    beforeEach(() => {
        const slots = {
            default: '<div>Sample Text</div>',
        }
        wrapper = mount(AzDialog, { localVue, slots, vuetify: new Vuetify() })
    })

    it('Slot is being rendered', () => {
        expect(wrapper.html()).toContain('Sample Text')
    })

    it('Component has default width', () => {
        expect(wrapper.vm.width).toBeGreaterThan(0)
    })

    it('Events are being emmited', () => {
        wrapper.find('button').trigger('click.native')
        expect(wrapper.emitted().ok).toBeTruthy()
    })
})
