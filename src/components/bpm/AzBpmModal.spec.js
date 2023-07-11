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
                    show: true,
                    disabled: false,
                    items: [],
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
})
