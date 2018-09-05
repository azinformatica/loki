import AzLogo from '../../src/components/layout/AzLogo'
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
                loki: {
                    asideClosed: true,
                    product: {
                        id: null,
                        name: '',
                        mainLogo: 'mainLogoPicture.jpg',
                        symbolLogo: 'symbolLogoPicture.jpg'
                    }
                }
            }
        })

        wrapper = shallow(AzLogo, {localVue, store})
    })

    it('Computed properties are rendered properly', () => {
        expect(wrapper.html()).not.toContain('mainLogoPicture.jpg')
        expect(wrapper.html()).toContain('symbolLogoPicture.jpg')
    })

    it('Methods are defined', () => {
        expect(typeof wrapper.vm.redirectToHome).toBe('function')
    })

    it('Click events', () => {
        spyOn(wrapper.vm, 'redirectToHome')
        wrapper.find('a').trigger('click')
        expect(wrapper.vm.redirectToHome).toBeCalled()
    })

})
