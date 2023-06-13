import 'regenerator-runtime/runtime'
import Vue from 'vue'
import AzBpmAction from './AzBpmAction'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import AzBpmInteraction from './AzBpmInteraction'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createDefaultProps = () => {
    return {
        disabled: false,
        bpmParameters: {},
        selectAttrs: {
            class: 'example-select-class',
            color: 'example-select-color',
        },
        buttonAttrs: {
            claim: {
                class: 'example-claim-class',
                color: 'example-claim-color',
            },
            unclaim: {
                class: 'example-unclaim-class',
                color: 'example-unclaim-color',
            },
            complete: {
                class: 'example-complete-class',
                color: 'example-complete-color',
            },
            uncomplete: {
                class: 'example-uncomplete-class',
                color: 'example-uncomplete-color',
            },
        },
    }
}

const createParentComponent = () => {
    return {
        name: AzBpmInteraction.name,
        data: () => ({
            id: 'example-id',
            processKey: 'example-process-key-01',
            businessKey: 'example-business-key-01',
            bpmAtProcessKeyAtBusinessKey: {
                currentTask: {},
            },
            components: {
                select: {
                    humanDecision: {
                        disabled: false,
                        show: true,
                        label: 'example-select-humanDecision-label',
                        items: [
                            {
                                text: 'example-text-01',
                                value: 'example-value-01',
                            },
                        ],
                    },
                    parallel: {
                        disabled: false,
                        show: false,
                        label: 'example-select-parallel-label',
                        items: [],
                    },
                },
                button: {
                    claim: {
                        disabled: false,
                        show: true,
                        label: 'example-button-claim-label',
                        action: jest.fn(),
                    },
                    unclaim: {
                        disabled: false,
                        show: true,
                        label: 'example-button-unclaim-label',
                        action: jest.fn(),
                    },
                    complete: {
                        disabled: false,
                        show: true,
                        label: 'example-button-complete-label',
                        action: jest.fn(),
                    },
                    uncomplete: {
                        disabled: false,
                        show: true,
                        label: 'example-button-uncomplete-label',
                        action: jest.fn(),
                    },
                },
            },
        }),
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const parentComponent = createParentComponent()
    const options = {
        localVue,
        propsData,
        parentComponent,
        vuetify: new Vuetify(),
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzBpmAction, options)
}

describe('AzBpmAction.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData, shallow: false })
    })

    describe('Props', () => {
        it('Should receive id', () => {
            expect(wrapper.props().id).toEqual(propsData.id)
        })

        it('Should receive disabled', () => {
            expect(wrapper.props().disabled).toEqual(propsData.disabled)
        })

        it('Should have default disabled', () => {
            propsData.disabled = undefined
            wrapper = createWrapper({ propsData, shallow: false })

            expect(wrapper.props().disabled).toEqual(false)
        })

        it('Should receive bpmParameters', () => {
            expect(wrapper.props().bpmParameters).toStrictEqual(propsData.bpmParameters)
        })

        it('Should have default bpmParameters', () => {
            propsData.bpmParameters = undefined
            wrapper = createWrapper({ propsData, shallow: false })

            expect(wrapper.props().bpmParameters).toStrictEqual({})
        })

        it('Should receive selectAttrs', () => {
            expect(wrapper.props().selectAttrs).toStrictEqual(propsData.selectAttrs)
        })

        it('Should have default selectAttrs', () => {
            propsData.selectAttrs = undefined
            wrapper = createWrapper({ propsData, shallow: false })

            expect(wrapper.props().selectAttrs).toStrictEqual({})
        })

        it('Should receive buttonAttrs', () => {
            expect(wrapper.props().buttonAttrs).toStrictEqual(propsData.buttonAttrs)
        })

        it('Should have default buttonAttrs', () => {
            propsData.buttonAttrs = undefined
            wrapper = createWrapper({ propsData, shallow: false })

            expect(wrapper.props().buttonAttrs).toStrictEqual({})
        })
    })

    describe('Select', () => {
        let selectHumanDecision

        beforeEach(() => {
            selectHumanDecision = wrapper.findAllComponents({ name: 'v-select' }).at(1)
        })

        it('Should have items from closest bpm interaction', () => {
            expect(selectHumanDecision.props().items).toStrictEqual(
                wrapper.vm.closestBpmInteraction.components.select.humanDecision.items
            )
        })

        it('Should have label from closest bpm interaction', () => {
            expect(selectHumanDecision.props().label).toBe(
                wrapper.vm.closestBpmInteraction.components.select.humanDecision.label
            )
        })

        it('Should have disabled from closest bpm interaction', () => {
            expect(selectHumanDecision.props().disabled).toBe(
                wrapper.vm.closestBpmInteraction.components.select.humanDecision.disabled
            )
        })

        it('Should have attrs given through props', () => {
            selectHumanDecision = wrapper.findComponent({ name: 'v-select' })

            expect(selectHumanDecision.vm.$el.classList.contains(propsData.selectAttrs.class)).toBe(true)
            expect(selectHumanDecision.props().color).toBe(propsData.selectAttrs.color)
        })
    })

    describe('Button', () => {
        let buttons, getButton, key

        beforeEach(() => {
            buttons = wrapper.findAllComponents({ name: 'v-btn' })
            getButton = () => buttons.wrappers.find((wrapper) => wrapper.vm.$vnode.key === key)
        })

        describe('Claim', () => {
            beforeAll(() => {
                key = 'claim'
            })

            it('Should have disabled from closest bpm interaction', () => {
                expect(getButton().props().disabled).toBe(
                    wrapper.vm.closestBpmInteraction.components.button[key].disabled
                )
            })

            it('Should have label from closest bpm interaction', () => {
                expect(getButton().html()).toContain(wrapper.vm.closestBpmInteraction.components.button[key].label)
            })

            it('Should have action from closest bpm interaction', () => {
                getButton().trigger('click')

                expect(wrapper.vm.$parent.components.button[key].action).toHaveBeenCalled()
            })

            it('Should have attrs given through props', () => {
                expect(getButton().vm.$el.classList.contains(propsData.buttonAttrs[key].class)).toBe(true)
                expect(getButton().props().color).toBe(propsData.buttonAttrs[key].color)
            })
        })

        describe('Unclaim', () => {
            beforeAll(() => {
                key = 'unclaim'
            })

            it('Should have disabled from closest bpm interaction', () => {
                expect(getButton().props().disabled).toBe(
                    wrapper.vm.closestBpmInteraction.components.button[key].disabled
                )
            })

            it('Should have label from closest bpm interaction', () => {
                expect(getButton().html()).toContain(wrapper.vm.closestBpmInteraction.components.button[key].label)
            })

            it('Should have action from closest bpm interaction', () => {
                getButton().trigger('click')

                expect(wrapper.vm.$parent.components.button[key].action).toHaveBeenCalled()
            })

            it('Should have attrs given through props', () => {
                expect(getButton().vm.$el.classList.contains(propsData.buttonAttrs[key].class)).toBe(true)
                expect(getButton().props().color).toBe(propsData.buttonAttrs[key].color)
            })
        })

        describe('Complete', () => {
            beforeAll(() => {
                key = 'complete'
            })

            it('Should have disabled from closest bpm interaction', () => {
                expect(getButton().props().disabled).toBe(
                    wrapper.vm.closestBpmInteraction.components.button[key].disabled
                )
            })

            it('Should have label from closest bpm interaction', () => {
                expect(getButton().html()).toContain(wrapper.vm.closestBpmInteraction.components.button[key].label)
            })

            it('Should have action from closest bpm interaction', () => {
                getButton().trigger('click')

                expect(wrapper.vm.$parent.components.button[key].action).toHaveBeenCalled()
            })

            it('Should have attrs given through props', () => {
                expect(getButton().vm.$el.classList.contains(propsData.buttonAttrs[key].class)).toBe(true)
                expect(getButton().props().color).toBe(propsData.buttonAttrs[key].color)
            })
        })

        describe('Uncomplete', () => {
            beforeAll(() => {
                key = 'uncomplete'
            })

            it('Should have disabled from closest bpm interaction', () => {
                expect(getButton().props().disabled).toBe(
                    wrapper.vm.closestBpmInteraction.components.button[key].disabled
                )
            })

            it('Should have label from closest bpm interaction', () => {
                expect(getButton().html()).toContain(wrapper.vm.closestBpmInteraction.components.button[key].label)
            })

            it('Should have action from closest bpm interaction', () => {
                getButton().trigger('click')

                expect(wrapper.vm.$parent.components.button[key].action).toHaveBeenCalled()
            })

            it('Should have attrs given through props', () => {
                expect(getButton().vm.$el.classList.contains(propsData.buttonAttrs[key].class)).toBe(true)
                expect(getButton().props().color).toBe(propsData.buttonAttrs[key].color)
            })
        })
    })
})
