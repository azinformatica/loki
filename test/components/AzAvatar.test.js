import AzAvatar from '../../src/components/layout/AzAvatar'
import Vuex from 'vuex'
import {createLocalVue, mount} from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'


const localVue = createLocalVue();
Vue.use(Vuetify)
localVue.use(Vuex)


describe('AzAvatar.test.js', () => {

    let wrapper, store

    beforeEach(() => {

        store = new Vuex.Store({
            state: {
                loki: {
                    user: {
                        photo: 'picture.jpg',
                        name: 'Andrew Stuart Tanenbaum',
                    },
                    avatarActions: {
                        1: {title: "Profile", icon: 'star', path: '/profile'},
                        2: {title: "Settings", icon: 'settings', path: '/settings'},
                        3: {title: "More...", icon: 'more', path: '/more'}
                    }
                }
            }
        })

        wrapper = mount(AzAvatar, {localVue, store})
    })

    it('Computed properties are rendered properly', () => {
        const renderedHtml = expect(wrapper.html());

        renderedHtml.toContain('src="picture.jpg"')
        renderedHtml.toContain('Andrew Stuart Tanenbaum')
        Object.keys(wrapper.vm.avatarActions).map(
            (key, index) => {
                renderedHtml.toContain(wrapper.vm.avatarActions[key].title)
                renderedHtml.toContain(wrapper.vm.avatarActions[key].icon)
            }
        );
    })

    it('Methods are defined', () => {
        expect(typeof wrapper.vm.redirectTo).toBe('function')
        expect(typeof wrapper.vm.logout).toBe('function')
    })

    it('Click on Buttons', () => {
        spyOn(wrapper.vm, 'redirectTo')
        spyOn(wrapper.vm, 'logout')
        wrapper.find('.az-avatar__logout').trigger('click')
        wrapper.find('.v-list__tile--link').trigger('click')

        expect(wrapper.vm.logout).toBeCalled()
        expect(wrapper.vm.redirectTo).toBeCalled()
    })

})
