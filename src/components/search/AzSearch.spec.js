import AzSearch from './AzSearch'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import Vuex from 'vuex'
import { mutationTypes } from '../../store'

const localVue = createLocalVue()
Vue.use(Vuetify)
localVue.use(Vuex)

describe('AzSearch.spec.js', () => {
    let wrapper, store

    beforeEach(() => {
        store = new Vuex.Store({
            state: {
                loki: {
                    asideClosed: true
                }
            },
            mutations: {
                [mutationTypes.SET_ASIDE]: jest.fn()
            }
        })

        wrapper = shallowMount(AzSearch, {
            localVue,
            store,
            propsData: {
                filter: {},
                simpleSearchPlaceholder: 'Informe o objeto'
            }
        })
    })

    it('Default Data is correct', () => {
        expect(wrapper.vm.hasAdvancedSearchItems).toBeFalsy()
        expect(wrapper.vm.isClosedAdvancedSearch).toBeFalsy()
        expect(wrapper.vm.isSimpleSearch).toBe(false)
        expect(wrapper.vm.searchTextSize).toBe(200)
    })

    it('Toggle method is called after closing window', () => {
        jest.spyOn(wrapper.vm, 'toggle')
        wrapper.vm.cancel()
        expect(wrapper.vm.toggle).toBeCalled()
    })

    it('Toggle method is OK', () => {
        const isClosed = wrapper.vm.isClosedAdvancedSearch
        jest.spyOn(wrapper.vm, 'closeAsideMenu')

        wrapper.vm.toggle()

        expect(wrapper.vm.isClosedAdvancedSearch).toBe(!isClosed)
        expect(wrapper.vm.closeAsideMenu).toBeCalled()
    })

    it('Search Button emits event', () => {
        wrapper = shallowMount(AzSearch, {
            localVue,
            store,
            propsData: {
                filter: {},
                simpleSearchPlaceholder: 'Informe o objeto'
            }
        })

        jest.spyOn(wrapper.vm, 'advancedSearch')
        const btn = wrapper.find('.ad-search')
        btn.vm.$emit('click')
        expect(wrapper.vm.advancedSearch).toBeCalled()
    })
})
