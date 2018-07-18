import AzAdvancedSearch from '../../src/components/AzAdvancedSearch'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';

const localVue = createLocalVue();
localVue.use(Vuetify)


describe('AzAdvancedSearch.test.js', () => {

    let wrapper

    beforeEach(() => {
        wrapper = shallow(AzAdvancedSearch, localVue)
    })

    it('Default Data is correct', () => {
        expect(wrapper.vm.isClosed).toBe(true)
        expect(wrapper.vm.isActiveAdvancedSearch).toBe(false)
    })

    it('Toggle method is called after closing window', () => {
        spyOn(wrapper.vm, 'toggle')
        wrapper.vm.cancel()
        expect(wrapper.vm.toggle).toBeCalled()
    })

    it('Toggle method is OK', () => {
        const isClosed = wrapper.vm.isClosed
        spyOn(wrapper.vm, 'closeAsideMenu')

        wrapper.vm.toggle()

        expect(wrapper.vm.isClosed).toBe(!isClosed)
        expect(wrapper.vm.closeAsideMenu).toBeCalled()
    })

    it('Search Button emits event', () => {
        spyOn(wrapper.vm, 'callSearch')
        wrapper.find('.btn__buscar').trigger('click')
        expect(wrapper.vm.callSearch).toBeCalled()
    })


})
