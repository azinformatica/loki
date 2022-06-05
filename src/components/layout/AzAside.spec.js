import AzAside from './AzAside'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)
localVue.use(Vuex)

describe('AzAside', () => {
    let wrapper, store

    beforeEach(() => {
        store = new Vuex.Store({
            state: {
                loki: {
                    asideClosed: true,
                },
            },
        })

        wrapper = shallowMount(AzAside, {
            localVue,
            store,
            vuetify: new Vuetify(),
        })
    })

    it('asideClosed computed property works properly', () => {
        expect(wrapper.find('.arrow-opened').exists()).toBe(false)
        expect(wrapper.find('.arrow-closed').exists()).toBe(true)

        expect(wrapper.vm.asideClosed).toBe(true)
        wrapper.vm.$store.state.loki.asideClosed = false
        expect(wrapper.vm.asideClosed).toBe(false)

        //expect(wrapper.find('.arrow-opened').exists()).toBe(true)
        //expect(wrapper.find('.arrow-closed').exists()).toBe(false)
    })
})
