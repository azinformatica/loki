import 'regenerator-runtime/runtime'
import AzBpmModal from './AzBpmModal'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
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
                            requiresUO: true,
                        },
                        {
                            value: 'value-ex-2',
                            text: 'text-ex-2',
                            requiresUO: true,
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
                            requiresUO: true,
                        },
                        {
                            value: 'value-ex-2',
                            text: 'text-ex-2',
                            requiresUO: true,
                        },
                    ],
                },
                uo: {
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
            currentUo: {
                id: 'id-current-uo',
            },
        },
        show: true,
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

        it('Should receive show', () => {
            expect(wrapper.props().show).toBe(propsData.show)
        })
    })

    describe('Events', () => {
        beforeEach(() => {
            wrapper = createWrapper({ propsData })
        })

        it('Should emit close event on press close icon', () => {
            const iconClose = wrapper.find('[data-test="icon-close"]')
            iconClose.trigger('click')

            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('Should emit close event on press cancel button', async () => {
            const buttonCancel = wrapper.find('[data-test="button-cancel"]')
            buttonCancel.vm.$emit('click')

            expect(wrapper.emitted('close')).toBeTruthy()
        })

        it('Should emit action event on press close icon', () => {
            const buttonAction = wrapper.find('[data-test="button-action"]')
            buttonAction.vm.$emit('click')

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

            it('Should disable human decision select if disabled', () => {
                propsData.components.select.humanDecision.disabled = true
                wrapper = createWrapper({ propsData })

                expect(getSelect().vm.disabled).toBe(true)
            })

            it('Should change selectedHumanTask when component emits change event', () => {
                const selectedOption = propsData.components.select.humanDecision.items[1].value
                getSelect().vm.$emit('input', selectedOption)

                expect(wrapper.vm.selectedHumanDecision).toBe(selectedOption)
            })
        })

        describe('Route', () => {
            beforeEach(() => {
                selector = '#route-select'
                propsData.buttonType = 'route'
                propsData.components.select.route.show = true
                wrapper = createWrapper({ propsData })
            })

            it('Should not show route select if button type is not "route"', () => {
                propsData.buttonType = 'any-type-different-from-route'
                wrapper = createWrapper({ propsData })

                expect(getSelect().exists()).toBe(false)
            })

            it('Should show route select if button type is "route"', () => {
                expect(getSelect().exists()).toBe(true)
            })

            it('Should disable route select if disabled', () => {
                propsData.components.select.route.disabled = true
                wrapper = createWrapper({ propsData })

                expect(getSelect().vm.disabled).toBe(true)
            })

            it('Should change selectedRoute when component emits change event', () => {
                const selectedOption = propsData.components.select.route.items[1].value
                getSelect().vm.$emit('input', selectedOption)

                expect(wrapper.vm.selectedRoute).toBe(selectedOption)
            })
        })

        describe('UO', () => {
            beforeEach(() => {
                selector = '#uo-select'
                propsData.components.select.uo.show = true
                wrapper = createWrapper({ propsData })
            })

            it('Should not show uo select if not showed in components', () => {
                propsData.components.select.uo.show = false
                wrapper = createWrapper({ propsData })

                expect(getSelect().exists()).toBe(false)
            })


        })
    })

    describe('Watch', () => {
        beforeEach(() => {
            const resetRequiresUO = (items) => {
                items.forEach((item) => {
                    item.requiresUO = false
                })
            }

            resetRequiresUO(propsData.components.select.humanDecision.items)
            resetRequiresUO(propsData.components.select.route.items)

            wrapper = createWrapper({ propsData })
        })

        it('Should reset all selects on change "show"', async () => {
            wrapper.vm.initializeAll = jest.fn()
            await wrapper.setProps({ show: false })

            expect(wrapper.vm.selectedUO).toBe('')
            expect(wrapper.vm.selectedRoute).toBe(null)
            expect(wrapper.vm.selectedHumanDecision).toBe(null)
            expect(wrapper.vm.selectedOrganizationalStructure).toBe(null)
        })
    })
})
