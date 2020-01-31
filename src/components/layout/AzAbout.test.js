import AzAbout from './AzAbout'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)
localVue.use(Vuex)

describe('AzAbout.test.js', () => {
    let wrapper, store

    beforeEach(() => {
        store = new Vuex.Store({
            state: {
                loki: {
                    product: {
                        copywrite: '123456',
                        version: '1.2.3'
                    }
                }
            }
        })

        //A Wrapper is an object that contains a mounted component
        wrapper = shallowMount(AzAbout, { localVue, store })
    })

    it('About computed properties are rendered correctly', () => {
        expect(wrapper.html()).toContain('123456')
        expect(wrapper.html()).toContain('1.2.3')
        expect(wrapper.html()).toContain(new Date().getFullYear())
    })

    it('Methods return correct information', () => {
        expect(wrapper.vm.companyCopywrite).toEqual('123456')
        expect(wrapper.vm.versionNumber).toEqual('1.2.3')
        expect(wrapper.vm.yearCopywrite).toEqual(new Date().getFullYear())
    })

    it('Correct styles are used', () => {
        expect(wrapper.find('.az-about').exists()).toBe(true)
        expect(wrapper.find('.az-about__copywrite').exists()).toBe(true)
        expect(wrapper.find('.az-about__version').exists()).toBe(true)
    })
})
