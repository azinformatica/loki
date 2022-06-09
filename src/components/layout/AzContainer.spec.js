import AzContainer from './AzContainer'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('AzContainer', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(AzContainer, {
            localVue,
            vuetify: new Vuetify(),
            slots: { default: '**Default Content**' },
        })
    })

    it('Slot content is rendered with correct css class', () => {
        expect(wrapper.html()).toContain('**Default Content**')
        expect(wrapper.find('.az-container').exists()).toBe(true)
    })
})
