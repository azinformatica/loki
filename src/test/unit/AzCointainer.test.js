import AzContainer from '../../components/AzContainer'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';

const localVue = createLocalVue();
localVue.use(Vuetify)



describe('AzContainer.test.js', () => {

    let wrapper

    beforeEach(() => {
        wrapper = shallow(AzContainer, {
                localVue,
                slots: {default: '**Default Content**'}
        })
    })

    it('Slot content is rendered with correct css class', () => {
        expect(wrapper.html()).toContain('**Default Content**')
        expect(wrapper.find('.az-container').exists()).toBe(true)
    })




})
