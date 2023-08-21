import Vue from 'vue'
import AzBpmModal from './AzBpmModal'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createDefaultProps = () => {
    return {
        components: {
            select: {
                humanDecision: {
                    show: false,
                    disabled: false,
                    items: [
                        {
                            value: 'value-ex-1',
                            text: 'text-ex-1',
                        },
                        {
                            value: 'value-ex-2',
                            text: 'text-ex-2',
                        },
                    ],
                },
                route: {
                    show: false,
                    disabled: false,
                    items: [
                        {
                            value: 'value-ex-1',
                            text: 'text-ex-1',
                        },
                        {
                            value: 'value-ex-2',
                            text: 'text-ex-2',
                        },
                    ],
                },
            },
            button: {
                complete: {
                    show: true,
                    disabled: false,
                    label: 'Encaminhar',
                    action: jest.fn(),
                },
            },
        },
        buttonType: 'complete',
        currentTask: {
            name: 'Atividade inicial',
        },
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
        stubs: {
            AzModal: true,
        },
        vuetify: new Vuetify(),
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzBpmModal, options)
}

describe('AzBpmModal.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData })
    })

    describe('Props', () => {
        it('Should receive components', () => {
            expect(wrapper.props().components).toBe(propsData.components)
        })

        it('Should receive buttonType', () => {
            expect(wrapper.props().buttonType).toBe(propsData.buttonType)
        })

        it('Should receive currentTask', () => {
            expect(wrapper.props().currentTask).toBe(propsData.currentTask)
        })
    })

    describe('Buttons', () => {
        beforeEach(() => {
            wrapper = createWrapper({ propsData, shallow: false })
        })

        it('Should emit close event on press close icon', () => {
            const buttonClose = wrapper.find('[data-test="button-close"]')
            buttonClose.trigger('click')

            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('Should emit close event on press cancel button', () => {
            const buttonClose = wrapper.find('[data-test="button-cancel"]')
            buttonClose.trigger('click')

            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('Should emit action event on press close icon', () => {
            const buttonClose = wrapper.find('[data-test="button-action"]')
            buttonClose.trigger('click')

            expect(wrapper.emitted('action')).toBeTruthy()
        })
    })

    describe('Select', () => {
        let selector, getSelect

        beforeAll(() => {
            getSelect = () => wrapper.find(selector)
        })

        describe('Human decision', () => {
            beforeEach(() => {
                selector = '#human-decision-select'
                propsData.buttonType = 'complete'
                propsData.components.select.humanDecision.show = true
                wrapper = createWrapper({ propsData })
            })

            it('Should not show human decision select if button type is not "complete"', () => {
                propsData.buttonType = 'any-type-different-from-complete'
                wrapper = createWrapper({ propsData })

                expect(getSelect().exists()).toBe(false)
            })

            it('Should not show human decision select if not showed in components', () => {
                propsData.components.select.humanDecision.show = false
                wrapper = createWrapper({ propsData })

                expect(getSelect().exists()).toBe(false)
            })

            it('Should show human decision select if button type is "complete" and component show', () => {
                expect(getSelect().exists()).toBe(true)
            })

            it('Should change selectedHumanTask when component emits change event', () => {
                const selectedOption = propsData.components.select.humanDecision.items[1].value
                getSelect().vm.$emit('input', selectedOption)

                expect(wrapper.vm.selectedHumanTask).toBe(selectedOption)
            })
        })

        describe('Route', () => {
            beforeEach(() => {
                selector = '#route-select'
                propsData.buttonType = 'route'
                propsData.components.select.route.show = true
                wrapper = createWrapper({ propsData })
            })

            it('Should not show human decision select if button type is not "route"', () => {
                propsData.buttonType = 'any-type-different-from-route'
                wrapper = createWrapper({ propsData })

                expect(getSelect().exists()).toBe(false)
            })

            it('Should show human decision select if button type is "route"', () => {
                expect(getSelect().exists()).toBe(true)
            })

            it('Should change selectedHumanTask when component emits change event', () => {
                const selectedOption = propsData.components.select.route.items[1].value
                getSelect().vm.$emit('input', selectedOption)

                expect(wrapper.vm.selectedRoute).toBe(selectedOption)
            })
        })
    })
})
