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
            cssClass: 'myCssClass',
        }

        wrapper = shallowMount(AzCallToActionn, { localVue, propsData })
    })

    it('Color property is properly returned', async () => {
        expect(wrapper.vm.color).toContain('secondary')

        await wrapper.setProps({ active: false })
        expect(wrapper.vm.color).toContain('')

        await wrapper.setProps({ dark: false })
        expect(wrapper.vm.color).toContain('primary')
    })

    it('isDark property is properly returned', async () => {
        expect(wrapper.vm.isDark).toBe(false)

        await wrapper.setProps({ active: false })
        expect(wrapper.vm.isDark).toBe(true)
    })

    it('sytle class is properly rendered', async () => {
        expect(wrapper.html()).toContain('call-to-action')
        expect(wrapper.html()).toContain('myCssClass')
        expect(wrapper.html()).toContain('hide-border')
        expect(wrapper.html()).toContain('btn-disabled-action')

        await wrapper.setProps({ active: false })
        expect(wrapper.vm.hideBorder).not.toContain('hide-border')

        await wrapper.setProps({ disabled: false })
        expect(wrapper.vm.hideBorder).not.toContain('btn-disabled-action')
    })
})
