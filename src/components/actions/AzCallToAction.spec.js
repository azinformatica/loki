import AzCallToActionn from './AzCallToAction'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('AzCallToAction.spec.js', () => {
    let wrapper

    beforeEach(() => {
        const propsData = {
            active: true,
            disabled: true,
            dark: true,
            hideBorder: true,
            cssClass: 'myCssClass'
        }

        wrapper = shallowMount(AzCallToActionn, { localVue, propsData })
    })

    it('Color property is properly returned', () => {
        expect(wrapper.vm.color).toContain('secondary')

        wrapper.setProps({ active: false })
        expect(wrapper.vm.color).toContain('')

        wrapper.setProps({ dark: false })
        expect(wrapper.vm.color).toContain('primary')
    })

    it('isDark property is properly returned', () => {
        expect(wrapper.vm.isDark).toBe(false)

        wrapper.setProps({ active: false })
        expect(wrapper.vm.isDark).toBe(true)
    })

    it('sytle class is properly rendered', () => {
        expect(wrapper.html()).toContain('call-to-action')
        expect(wrapper.html()).toContain('myCssClass')
        expect(wrapper.html()).toContain('hide-border')
        expect(wrapper.html()).toContain('btn-disabled-action')

        wrapper.setProps({ active: false })
        expect(wrapper.vm.hideBorder).not.toContain('hide-border')
        
        wrapper.setProps({ disabled: false })
        expect(wrapper.vm.hideBorder).not.toContain('btn-disabled-action')
    })
})
