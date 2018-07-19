import AzTemplate from '../../src/components/AzTemplate'
import {shallow} from 'vue-test-utils'


describe('AzTemplate.test.js', () => {

    let wrapper

    beforeEach(() => {
        wrapper = shallow(AzTemplate)
    })

    it('Component style is used', () => {
        expect(wrapper.find('.az-template').exists()).toBe(true)
        expect(wrapper.find('.az-template__toolbar').exists()).toBe(true)
        expect(wrapper.find('.az-template__container').exists()).toBe(true)
    })

})
