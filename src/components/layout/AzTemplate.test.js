import AzTemplate from './templates/AzTemplateDefault'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('AzTemplate.test.js', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(AzTemplate, { localVue, vuetify: new Vuetify() })
    })

    xit('Component style is used', () => {
        expect(wrapper.find('.az-template').exists()).toBe(true)
        expect(wrapper.find('.az-template__toolbar').exists()).toBe(true)
        expect(wrapper.find('.az-template__container').exists()).toBe(true)
    })
})
