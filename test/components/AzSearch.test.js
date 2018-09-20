import AzAdvancedSearch from '../../src/components/search/AzSearch'
import {shallow, createLocalVue} from 'vue-test-utils'
import Vuetify from 'vuetify';

const localVue = createLocalVue();
localVue.use(Vuetify)


xdescribe('AzSearch.test.js', () => {

    let wrapper

    beforeEach(() => {
        wrapper = shallow(AzAdvancedSearch, localVue)
    })

    xit('Default Data is correct', () => {
        expect(wrapper.vm.isClosed).toBe(true)
        expect(wrapper.vm.isActiveAdvancedSearch).toBe(false)
    })

    xit('Toggle method is called after closing window', () => {
        spyOn(wrapper.vm, 'toggle')
        wrapper.vm.cancel()
        expect(wrapper.vm.toggle).toBeCalled()
    })

    xit('Toggle method is OK', () => {
        const isClosed = wrapper.vm.isClosed
        spyOn(wrapper.vm, 'closeAsideMenu')

        wrapper.vm.toggle()

        expect(wrapper.vm.isClosed).toBe(!isClosed)
        expect(wrapper.vm.closeAsideMenu).toBeCalled()
    })

    xit('Search Button emits event', () => {
        spyOn(wrapper.vm, 'callSearch')
        wrapper.find('.btn__buscar').trigger('click')
        expect(wrapper.vm.callSearch).toBeCalled()
    })


})
