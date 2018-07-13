import AzToolbar from '../../components/AzToolbar'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';

const localVue = createLocalVue();
localVue.use(Vuetify)

describe('AzToolbar.test.js', () => {

    let wrapper


    beforeEach(() => {
        wrapper = shallow(AzToolbar, {
            slots: {
                actions: '*Actions Slot*',
                simpleSearch: '*Simple Search Slot*',
                advanceSearch: '*Advanced Search Slot*'
            }
        })
    })

    it('Computed properties are rendered properly', () => {
        expect(wrapper.html()).toContain('*Actions Slot*');
        expect(wrapper.html()).toContain('*Simple Search Slot*');
        expect(wrapper.html()).toContain('*Advanced Search Slot*')
    })

    it('Component style is used', () => {
        expect(wrapper.find('.az-toolbar').exists()).toBe(true)
    })


})
