import AzMenu from './AzMenu'
import Vuex from 'vuex'
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueRouter)

describe('AzMenu', () => {
    let wrapper, vuetify, store

    const routes = []
    const router = new VueRouter({ routes })

    beforeEach(() => {
        vuetify = new Vuetify()

        store = new Vuex.Store({
            state: {
                loki: {
                    asideClosed: false,
                    menuActions: [
                        {
                            name: 'Item 1',
                            icon: 'item1',
                            path: '/item1',
                            selected: false,
                        },
                        {
                            name: 'Item 2',
                            icon: 'item2',
                            path: '/item2',
                            expanded: true,
                            children: [
                                {
                                    name: 'Item 2.1',
                                    icon: 'item21',
                                    path: '/item2/item21',
                                    selected: false,
                                },
                                {
                                    name: 'Item 2.2',
                                    icon: 'item22',
                                    path: '/item2/item22',
                                    selected: false,
                                },
                            ],
                        },
                        {
                            name: 'Item 3',
                            icon: 'item3',
                            path: '/item3',
                            selected: false,
                        },
                    ],
                },
            },
        })

        wrapper = shallowMount(AzMenu, { localVue, vuetify, store, router })
    })

    it('Computed properties are rendered properly', () => {
        const renderedHtml = expect(wrapper.html())

        wrapper.vm.menuActions.map((action) => {
            renderedHtml.toContain(action.name)
            renderedHtml.toContain(action.icon)
            //renderedHtml.toContain(action.path)
        })
    })

    it('Methods are defined', () => {
        expect(typeof wrapper.vm.redirectTo).toBe('function')
    })

    it('Click on Buttons', async () => {
        // Full mount to render vuetify components correctly
        let wrapperFull = mount(AzMenu, { localVue, vuetify, store, router })
        wrapperFull.vm.redirectTo = jest.fn()
        jest.spyOn(wrapperFull.vm, 'redirectTo')
        wrapperFull.find('.menu-item').trigger('click.native')
        await wrapperFull.vm.$nextTick()
        expect(wrapperFull.vm.redirectTo).toBeCalled()
    })
})
