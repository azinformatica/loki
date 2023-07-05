import 'regenerator-runtime/runtime'
import Vue from 'vue'
import AzBpmAction from './AzBpmAction'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import AzBpmInteraction from './AzBpmInteraction'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
Vue.use(Vuetify)

jest.mock('../../utils/bpm/AzBpmProcess.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getComponents: jest.fn(() => ({
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
                        items: [
                            {
                                text: 'example-text-03',
                                value: 'example-value-03',
                            },
                            {
                                text: 'example-text-04',
                                value: 'example-value-04',
                            },
                        ],
                    },
                },
                button: {
                    claim: {
                        disabled: false,
                        show: true,
                        label: 'example-button-claim-label',
                        action: jest.fn(() => new Promise((resolve) => resolve(''))),
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
            })),
            getCurrentTask: jest.fn(() => null),
            hasAuthority: jest.fn(() => false),
            getProcessInstance: jest.fn(() => true),
            load: jest.fn(),
        }
    })
})

const createDefaultProps = () => {
    return {
        disabled: false,
        processKey: '',
        businessKey: '',
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
        props: {
            id: {
                default: 'example-id',
                type: String,
            },
            processKey: {
                default: 'example-process-key-01',
                type: String,
            },
            businessKey: {
                default: 'example-business-key-01',
                type: String,
            },
        },
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

        it('Should receive processKey', () => {
            expect(wrapper.props().processKey).toEqual(propsData.processKey)
        })

        it('Should receive businessKey', () => {
            expect(wrapper.props().businessKey).toEqual(propsData.businessKey)
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
        let select, selects

        beforeEach(() => {
            selects = wrapper.findAllComponents({ name: 'v-select' })
        })

        describe('Parallel', () => {
            beforeEach(() => {
                select = selects.at(0)
            })

            it('Should have items from closest bpm interaction', () => {
                expect(select.props().items).toStrictEqual(wrapper.vm.components.select.parallel.items)
            })

            it('Should have label from closest bpm interaction', () => {
                expect(select.props().label).toBe(wrapper.vm.components.select.parallel.label)
            })

            it('Should have disabled from closest bpm interaction', () => {
                expect(select.props().disabled).toBe(wrapper.vm.components.select.parallel.disabled)
            })

            it('Should have attrs given through props', () => {
                expect(select.vm.$el.classList.contains(propsData.selectAttrs.class)).toBe(true)
                expect(select.props().color).toBe(propsData.selectAttrs.color)
            })
        })

        describe('HumanDecision', () => {
            beforeEach(() => {
                select = selects.at(1)
            })

            it('Should have items from closest bpm interaction', () => {
                expect(select.props().items).toStrictEqual(wrapper.vm.components.select.humanDecision.items)
            })

            it('Should have label from closest bpm interaction', () => {
                expect(select.props().label).toBe(wrapper.vm.components.select.humanDecision.label)
            })

            it('Should have disabled from closest bpm interaction', () => {
                expect(select.props().disabled).toBe(wrapper.vm.components.select.humanDecision.disabled)
            })

            it('Should have attrs given through props', () => {
                expect(select.vm.$el.classList.contains(propsData.selectAttrs.class)).toBe(true)
                expect(select.props().color).toBe(propsData.selectAttrs.color)
            })
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

            it('Should have disabled value', () => {
                expect(getButton().props().disabled).toBe(wrapper.vm.components.button[key].disabled)
            })

            it('Should have label value', () => {
                expect(getButton().html()).toContain(wrapper.vm.components.button[key].label)
            })

            it('Should have action function', async () => {
                getButton().trigger('click')

                await wrapper.vm.$nextTick()

                expect(wrapper.vm.components.button[key].action).toHaveBeenCalled()
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

            it('Should have disabled value', () => {
                expect(getButton().props().disabled).toBe(wrapper.vm.components.button[key].disabled)
            })

            it('Should have label value', () => {
                expect(getButton().html()).toContain(wrapper.vm.components.button[key].label)
            })

            it('Should have action function', async () => {
                getButton().trigger('click')

                await wrapper.vm.$nextTick()

                expect(wrapper.vm.components.button[key].action).toHaveBeenCalled()
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

            it('Should have disabled value', () => {
                expect(getButton().props().disabled).toBe(wrapper.vm.components.button[key].disabled)
            })

            it('Should have label value', () => {
                expect(getButton().html()).toContain(wrapper.vm.components.button[key].label)
            })

            it('Should have action function', async () => {
                getButton().trigger('click')

                await wrapper.vm.$nextTick()

                expect(wrapper.vm.components.button[key].action).toHaveBeenCalled()
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

            it('Should have disabled value', () => {
                expect(getButton().props().disabled).toBe(wrapper.vm.components.button[key].disabled)
            })

            it('Should have label value', () => {
                expect(getButton().html()).toContain(wrapper.vm.components.button[key].label)
            })

            it('Should have action function', async () => {
                getButton().trigger('click')

                await wrapper.vm.$nextTick()

                expect(wrapper.vm.components.button[key].action).toHaveBeenCalled()
            })

            it('Should have attrs given through props', () => {
                expect(getButton().vm.$el.classList.contains(propsData.buttonAttrs[key].class)).toBe(true)
                expect(getButton().props().color).toBe(propsData.buttonAttrs[key].color)
            })
        })
    })

    describe('Computed', () => {
        describe('setCurrentTaskParams', () => {
            it('Should have same processKey', () => {
                expect(wrapper.vm.setCurrentTaskParams.processKey).toBe(wrapper.vm.currentProcessKey)
            })

            it('Should have same businessKey', () => {
                expect(wrapper.vm.setCurrentTaskParams.businessKey).toBe(wrapper.vm.currentBusinessKey)
            })

            it('Should have currentTaskId equals selectedParallelTask', () => {
                expect(wrapper.vm.setCurrentTaskParams.currentTaskId).toBe(wrapper.vm.selectedParallelTask)
            })
        })

        describe('isSetCurrentTaskValid', () => {
            it('Should return false if isSelectedParallelTaskValid is false', () => {
                expect(wrapper.vm.isSetCurrentTaskValid).toBe(false)
            })
        })
    })

    describe('Watch', () => {
        describe('selectedParallelTask', () => {
            it('Should update current task selected on select a different parallel task', async () => {
                wrapper.vm.setCurrentTaskSelected = jest.fn()

                wrapper.vm.selectedParallelTask = 'changed-value'

                await wrapper.vm.$nextTick()

                expect(wrapper.vm.setCurrentTaskSelected).toHaveBeenCalled()
            })
        })
    })

    describe('Methods', () => {
        describe('selectHumanTask', () => {
            it('Should update selectedHumanTask', async () => {
                wrapper.vm.selectHumanTask()

                expect(wrapper.vm.selectedHumanTask).toBe(wrapper.vm.firstHumanItemValue)
            })
        })

        describe('selectParallelTask', () => {
            it('Should update selectedParallelTask', () => {
                wrapper.vm.selectParallelTask()

                expect(wrapper.vm.selectedParallelTask).toBe(wrapper.vm.currentTask.id)
            })
        })
    })
})
