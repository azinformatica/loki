import AzSearch from '../../src/components/AzSearch'
import {shallow} from 'vue-test-utils'


describe('AzSearch.test.js', () => {

    let wrapper

    beforeEach(() => {
        wrapper = shallow(AzSearch)
    })

    it('Component data is configured properly', () => {
        expect(wrapper.vm.teste).toBeUndefined()
    })

    it('Component is rendered properly', () => {
        expect(wrapper.html()).toContain('Informe o código')
    })

    it('Component style is used', () => {
        expect(wrapper.find('.az-search').exists()).toBe(true)
    })

})
