import AzLogo from './AzLogo'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueRouter)

describe('AzLogo', () => {
    let wrapper, router, store

    beforeEach(() => {
        store = new Vuex.Store({
            state: {
                loki: {
                    asideClosed: true,
                    product: {
                        id: null,
                        name: '',
                        mainLogo: 'mainLogoPicture.jpg',
                        symbolLogo: 'symbolLogoPicture.jpg',
                    },
                },
            },
        })

        router = {
            init: jest.fn(),
            push: jest.fn(),
            history: { current: {} },
        }

        wrapper = shallowMount(AzLogo, { localVue, router, store })
    })

    it('Computed properties are rendered properly', () => {
        expect(wrapper.html()).not.toContain('mainLogoPicture.jpg')
        expect(wrapper.html()).toContain('symbolLogoPicture.jpg')
    })

    it('Methods are defined', () => {
        expect(typeof wrapper.vm.redirectToHome).toBe('function')
    })

    it('Click events', async () => {
        jest.spyOn(wrapper.vm, 'redirectToHome')
        wrapper.find('a').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.redirectToHome).toBeCalled()
    })
})
