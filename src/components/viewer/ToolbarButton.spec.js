import Vue from 'vue'
import Vuetify from 'vuetify'
import ToolbarButton from './ToolbarButton'
import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('ToolbarButton.spec.js', () => {
    let icon, tooltip, wrapper

    beforeEach(() => {
        icon = 'mdi-icon'
        tooltip = 'Fechar'
        wrapper = shallowMount(ToolbarButton, {
            localVue,
            propsData: {
                icon,
                tooltip,
            },
        })
    })

    describe('Props', () => {
        it('Should receive a icon', () => {
            expect(wrapper.props().icon).toBe(icon)
        })

        it('Should receive a tooltip', () => {
            expect(wrapper.props().tooltip).toBe(tooltip)
        })
    })

    describe('Events', () => {
        it('Should emit click', () => {
            const click = jest.fn()
            wrapper = shallowMount(ToolbarButton, {
                localVue,
                propsData: {
                    icon,
                    tooltip,
                },
                listeners: {
                    click,
                },
                stubs: {
                    'v-btn': {
                        template: '<button v-bind="$attrs" v-on="$listeners"/>',
                    },
                },
            })
            const button = wrapper.find('button')
            button.trigger('click')

            expect(click).toHaveBeenCalled()
        })
    })
})
