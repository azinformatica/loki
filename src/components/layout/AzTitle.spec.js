import AzTitle from './AzTitle'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)
localVue.use(Vuex)

describe('AzTitle.spec.js', () => {
    let wrapper, store

    beforeEach(() => {
        store = new Vuex.Store({
            state: {
                loki: {
                    page: {
                        title: '***Page Title***',
                        subtitle: '***Page SubTitle***'
                    }
                }
            }
        })

        wrapper = shallowMount(AzTitle, { localVue, store })
    })

    it('Computed properties are rendered properly', () => {
        expect(wrapper.html()).toContain('***Page Title***')
        expect(wrapper.html()).toContain('***Page SubTitle***')
    })

    it('Component style is used', () => {
        expect(wrapper.find('.az-title').exists()).toBe(true)
    })
})
