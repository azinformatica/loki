import AzLogo from '../../components/AzLogo'
import Vuex from 'vuex'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';

const localVue = createLocalVue();
localVue.use(Vuetify)
localVue.use(Vuex)


describe('AzLogo.test.js', () => {

    let wrapper, store

    beforeEach(() => {

        store = new Vuex.Store({
            state: {
                wids: {
                    asideClosed: true,
                    mainLogo: 'mainLogoPicture.jpg',
                    symbolLogo: 'symbolLogoPicture.jpg'
                }
            }
        })

        wrapper = shallow(AzLogo, {localVue, store})
    })

    it('Computed properties are rendered properly', () => {
        const renderedHtml= expect(wrapper.html());

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
        wrapper.find('.list__tile--link').trigger('click')

        expect(wrapper.vm.logout).toBeCalled()
        expect(wrapper.vm.redirectTo).toBeCalled()
    })


})
