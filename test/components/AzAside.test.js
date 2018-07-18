import AzAside from '../../src/components/AzAside'
import Vue from 'vue'
import Vuex from 'vuex'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';

const localVue = createLocalVue();
localVue.use(Vuetify)
localVue.use(Vuex)

describe('AzAside.test.js', () => {

    let wrapper, store

    beforeEach(() => {

        store = new Vuex.Store({
            state: {
                loki: {
                    asideClosed: true
                }
            }
        })

        wrapper = shallow(AzAside, { localVue, store })
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
