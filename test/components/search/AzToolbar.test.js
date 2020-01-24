import AzToolbar from '../../../src/components/search/AzToolbar'
import { shallowMount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()

describe('AzToolbar.test.js', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(AzToolbar, {
            localVue,
            slots: {
                actions: '<div>Actions Slot</div>',
                simpleSearch: '<div>Simple Search Slot</div>'
            }
        })
    })

    it('Computed properties are rendered properly', () => {
        expect(wrapper.html()).toContain('Actions Slot')
        expect(wrapper.html()).toContain('Simple Search Slot')
    })

    it('Component style is used', () => {
        expect(wrapper.find('.az-toolbar').exists()).toBe(true)
    })
})
