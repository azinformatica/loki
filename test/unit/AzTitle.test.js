import AzTitle from '../../components/AzTitle'
import Vuex from 'vuex'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';


const localVue = createLocalVue();
localVue.use(Vuetify)
localVue.use(Vuex)


describe('AzTitle.test.js', () => {

    let wrapper, store


    beforeEach(() => {

        store = new Vuex.Store({
            state: {
                loki: {
                    pageTitle: '***Page Title***',
                    pageSubtitle: '***Page SubTitle***'
                }
            }
        })

        wrapper = shallow(AzTitle, {localVue, store})
    })

    it('Computed properties are rendered properly', () => {
        expect(wrapper.html()).toContain('***Page Title***');
        expect(wrapper.html()).toContain('***Page SubTitle***')
    })

    it('Component style is used', () => {
        expect(wrapper.find('.az-title').exists()).toBe(true)
    })


})
