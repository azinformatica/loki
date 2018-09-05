import AzMenu from '../../src/components/layout/AzMenu'
import Vuex from 'vuex'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';
import VueRouter from 'vue-router'



const localVue = createLocalVue();
localVue.use(Vuetify)
localVue.use(Vuex)
localVue.use(VueRouter)


describe('AzMenu.test.js', () => {

    let wrapper, store

    const routes = [];
    const router = new VueRouter({ routes });

    beforeEach(() => {

        store = new Vuex.Store({
            state: {
                loki: {
                    asideClosed: false,
                    menuActions: [
                        {
                            name: 'Item 1',
                            icon: 'item1',
                            path: '/item1',
                            selected: false
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
                                    selected: false
                                },
                                {
                                    name: 'Item 2.2',
                                    icon: 'item22',
                                    path: '/item2/item22',
                                    selected: false
                                }
                            ]
                        },
                        {
                            name: 'Item 3',
                            icon: 'item3',
                            path: '/item3',
                            selected: false
                        }
                    ]
                }
            }
        })

        wrapper = shallow(AzMenu, {localVue, store, router})
    })

    it('Computed properties are rendered properly', () => {
        const renderedHtml = expect(wrapper.html());

        wrapper.vm.menuActions.map(
            (action) => {
                renderedHtml.toContain(action.name)
                renderedHtml.toContain(action.icon)
                //renderedHtml.toContain(action.path)
            }
        );
    })

    it('Methods are defined', () => {
        expect(typeof wrapper.vm.redirectTo).toBe('function')
    })

    it('Click on Buttons', () => {
        spyOn(wrapper.vm, 'redirectTo')
        wrapper.find('.v-list__tile--link').trigger('click')
        expect(wrapper.vm.redirectTo).toBeCalled()
    })


})
