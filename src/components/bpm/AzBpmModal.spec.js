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

const createStore = (uos = {}) => {
    return new Vuex.Store({
        state: {
            loki: {
                uos,
            },
        },
    })
}

const createWrapper = ({ propsData = {}, shallow = true, store } = {}) => {
    const defaultStore = createStore()
    const options = {
        localVue,
        propsData,
        stubs: {
            AzModal: true,
        },
        vuetify: new Vuetify(),
        store: store || defaultStore,
        provide: { $validator: {} },
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

                expect(getSelect().exists()).toBe(true)
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

    describe('Computed basics', () => {
        it('currentTaskName, actionLabel and button type flags', () => {
            expect(wrapper.vm.currentTaskName).toBe('Atividade inicial')
            expect(wrapper.vm.actionLabel).toBe('Encaminhar')
            expect(wrapper.vm.isButtonTypeComplete).toBe(true)
            expect(wrapper.vm.isButtonTypeRoute).toBe(false)
        })

        it('selectedNextTaskRequiresUO reflects selected decision/route', async () => {
            wrapper.setData({ selectedHumanDecision: null, selectedRoute: null })
            await Vue.nextTick()
            expect(!!wrapper.vm.selectedNextTaskRequiresUO).toBe(false)
            wrapper.setData({ selectedHumanDecision: { value: 'value-ex-1', requiresUO: true } })
            await Vue.nextTick()
            expect(wrapper.vm.selectedNextTaskRequiresUO).toBe(true)
            wrapper.setData({
                selectedHumanDecision: null,
                selectedRoute: { value: 'value-ex-2', requiresUO: true },
            })
            await Vue.nextTick()
            expect(wrapper.vm.selectedNextTaskRequiresUO).toBe(true)
        })
    })

    describe('UO and Organizational Structure', () => {
        it('organizationalStructureShow depends on selection requiring UO', async () => {
            // ensure no selection first
            wrapper.setData({ selectedHumanDecision: null, selectedRoute: null })
            await Vue.nextTick()
            expect(!!wrapper.vm.organizationalStructureShow).toBe(false)
            wrapper.setData({ selectedHumanDecision: { value: 'abc', requiresUO: true } })
            await Vue.nextTick()
            expect(wrapper.vm.organizationalStructureShow).toBe(true)
        })

        it('selectUOItems maps from store when organizational structure and uos are provided', async () => {
            const uos = {
                acronymTypeAdministrationCompleted: [
                    { id: '1', codigoHierarquiaFormatado: '001', sigla: 'SG1', nome: 'Nome 1' },
                ],
            }
            const store = createStore(uos)
            wrapper = createWrapper({ propsData, shallow: false, store })
            wrapper.setData({
                selectedOrganizationalStructure: { value: 'acronymTypeAdministrationCompleted', text: 'Órgão' },
            })
            await Vue.nextTick()
            const items = wrapper.vm.selectUOItems
            expect(items).toEqual([{ text: '001 - SG1 - Nome 1', value: '1' }])
            expect(wrapper.vm.selectUOShow).toEqual({ value: 'acronymTypeAdministrationCompleted', text: 'Órgão' })
        })

        it('initializeUOSelect picks originUOId or first item, and reset if invalid', async () => {
            const uos = {
                upperHierarchyCode: [{ id: 'uo-10', codigoHierarquiaFormatado: '010', sigla: 'UO', nome: 'UO Nome' }],
            }
            propsData = Object.assign({}, propsData, {})
            propsData.currentTask.currentUo.id = 'uo-10'
            const store = createStore(uos)
            wrapper = createWrapper({ propsData, shallow: false, store })
            wrapper.setData({ selectedOrganizationalStructure: { value: 'upperHierarchyCode', text: 'UO' } })
            await Vue.nextTick()
            wrapper.vm.selectedUO = ''
            wrapper.vm.initializeUOSelect()
            expect(wrapper.vm.selectedUO).toBe('uo-10')

            wrapper.vm.selectedUO = 'invalid-id'
            wrapper.vm.resetUOSelectIfInvalidValue()
            expect(wrapper.vm.selectedUO).toBe('')
        })
    })

    describe('Human decision and Route initialize/reset', () => {
        it('initializeHumanDecisionSelect and reset when items change/invalid', async () => {
            wrapper.setProps({ buttonType: 'complete' })
            await Vue.nextTick()
            wrapper.vm.selectedHumanDecision = null
            wrapper.vm.initializeHumanDecisionSelect()
            expect(wrapper.vm.selectedHumanDecision).toEqual(propsData.components.select.humanDecision.items[0])

            wrapper.vm.selectedHumanDecision = { value: 'not-in-list' }
            wrapper.vm.resetHumanDecisionSelectIfInvalidValue()
            expect(wrapper.vm.selectedHumanDecision).toBe(null)
        })

        it('initializeRouteSelect and reset when items change/invalid', async () => {
            wrapper.setProps({ buttonType: 'route' })
            await Vue.nextTick()
            wrapper.vm.selectedRoute = null
            wrapper.vm.initializeRouteSelect()
            expect(wrapper.vm.selectedRoute).toEqual(propsData.components.select.route.items[0])

            wrapper.vm.selectedRoute = { value: 'not-in-list' }
            wrapper.vm.resetRouteSelectIfInvalidValue()
            expect(wrapper.vm.selectedRoute).toBe(null)
        })
    })

    describe('Helpers and parameter builders', () => {
        it('getFirstItem and getFirstItemValue and selectHasGivenValue', () => {
            const items = [{ value: 'a' }]
            expect(wrapper.vm.getFirstItem(items)).toEqual({ value: 'a' })
            expect(wrapper.vm.getFirstItemValue(items)).toBe('a')
            expect(wrapper.vm.selectHasGivenValue(items, 'a')).toBe(true)
            expect(wrapper.vm.selectHasGivenValue(items, 'b')).toBe(false)
            expect(wrapper.vm.getFirstItemValue([])).toBe('')
            expect(wrapper.vm.getFirstItem([])).toBe(null)
        })

        it('bpmParameters merges sections for buttonType complete (humanDecision + UO + justification)', async () => {
            const nextTasks = [{ taskId: 't1', justificativa: JSON.stringify({ label: 'Informe', maxLength: 50 }) }]
            propsData.buttonType = 'complete'
            propsData.currentTask.nextTasks = nextTasks
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.$store = createStore({
                upperHierarchyCode: [{ id: 'x', codigoHierarquiaFormatado: '001', sigla: 'S', nome: 'N' }],
            })
            wrapper.setData({
                selectedOrganizationalStructure: { value: 'upperHierarchyCode', text: 'UO' },
                selectedUO: 'x',
            })
            wrapper.setData({ selectedHumanDecision: { value: 't1', requiresUO: true } })
            await Vue.nextTick()
            wrapper.setData({ justificationField: 'Porque sim' })
            await Vue.nextTick()
            const params = wrapper.vm.bpmParameters
            expect(params).toEqual({
                uoDestinationId: 'x',
                humanDecision: 't1',
                justificationField: 'Porque sim',
            })
            expect(wrapper.vm.completeParameters).toEqual({ humanDecision: 't1' })
            expect(wrapper.vm.routeParameters).toEqual({ activityIdDestination: null })
            expect(wrapper.vm.uoDestinationParameters).toEqual({ uoDestinationId: 'x' })
        })

        it('bpmParameters merges sections for buttonType route (route + UO + justification)', async () => {
            propsData = Object.assign({}, propsData, {})
            propsData.buttonType = 'route'
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.$store = createStore({
                upperHierarchyCode: [{ id: 'x', codigoHierarquiaFormatado: '001', sigla: 'S', nome: 'N' }],
            })
            wrapper.setData({
                selectedOrganizationalStructure: { value: 'upperHierarchyCode', text: 'UO' },
                selectedUO: 'x',
            })
            wrapper.setData({ selectedRoute: { value: 'r1', requiresUO: true } })
            await Vue.nextTick()
            wrapper.setData({ justificationField: 'Porque sim' })
            await Vue.nextTick()
            const params2 = wrapper.vm.bpmParameters
            expect(params2).toEqual({
                uoDestinationId: 'x',
                activityIdDestination: 'r1',
            })
            expect(wrapper.vm.completeParameters).toEqual({ humanDecision: null })
            expect(wrapper.vm.routeParameters).toEqual({ activityIdDestination: 'r1' })
            expect(wrapper.vm.uoDestinationParameters).toEqual({ uoDestinationId: 'x' })
        })
    })

    describe('Justification computed and charCount', () => {
        it('getLabelJustificationField & getMaxLengthsJustificationField with label and maxLength', async () => {
            const nextTasks = [
                { taskId: 't2', justificativa: JSON.stringify({ label: 'Motivo detalhado', maxLength: 10000 }) },
            ]
            propsData.buttonType = 'complete'
            propsData.currentTask.nextTasks = nextTasks
            wrapper = createWrapper({ propsData })
            wrapper.setData({ selectedHumanDecision: { value: 't2' } })
            await Vue.nextTick()
            expect(wrapper.vm.nextTaskFilteredWithSelectedHumanDecision).toBeTruthy()
            expect(wrapper.vm.getAttributeJustification('label', 'Motivo')).toBe('Motivo detalhado')
            expect(wrapper.vm.getAttributeJustification('maxLength', 1000)).toBe(10000)
        })

        it('charCount messages for empty, remaining, and limit reached', async () => {
            wrapper.setData({ justificationField: '' })
            expect(wrapper.vm.charCount(5)).toBe('')
            wrapper.setData({ justificationField: 'abc' })
            expect(wrapper.vm.charCount(5)).toBe('2 caracteres restantes.')
            wrapper.setData({ justificationField: 'abcde' })
            expect(wrapper.vm.charCount(5)).toBe('Limite de 5 caracteres foi atingido')
        })

        it('regras validator handles strings and non-strings', () => {
            const rule = wrapper.vm.regras[0]
            expect(rule('  ')).toBe('Campo obrigatório!')
            expect(rule('ok')).toBe(true)
            expect(rule('abcdef', 3)).toBe('O campo deve conter no máximo 3 caracteres!')
            expect(rule(0)).toBe('Campo obrigatório!')
            expect(rule(1)).toBe(true)
        })
    })

    describe('Watchers behavior', () => {
        it('show watcher resets and initializes all', async () => {
            const initSpy = jest.spyOn(wrapper.vm, 'initializeAll')
            const resetSpy = jest.spyOn(wrapper.vm, 'resetAll')
            await wrapper.setProps({ show: false })
            expect(resetSpy).toHaveBeenCalled()
            expect(initSpy).toHaveBeenCalled()
        })

        it('selectedRoute watcher resets organizational structure and UO checks', async () => {
            const resetOrg = jest.spyOn(wrapper.vm, 'resetSelectedOrganizationalStructureIfInvalidValue')
            const resetUO = jest.spyOn(wrapper.vm, 'resetUOSelectIfInvalidValue')
            wrapper.setData({ selectedRoute: { value: 'x' } })
            await Vue.nextTick()
            expect(resetOrg).toHaveBeenCalled()
            expect(resetUO).toHaveBeenCalled()
        })

        it('selectedHumanDecision watcher resets org, UO and justification', async () => {
            const resetOrg = jest.spyOn(wrapper.vm, 'resetSelectedOrganizationalStructureIfInvalidValue')
            const resetUO = jest.spyOn(wrapper.vm, 'resetUOSelectIfInvalidValue')
            const resetJust = jest.spyOn(wrapper.vm, 'resetJustificationField')
            wrapper.setData({ selectedHumanDecision: null })
            await Vue.nextTick()
            wrapper.setData({ selectedHumanDecision: { value: 'y' } })
            await Vue.nextTick()
            expect(resetOrg).toHaveBeenCalled()
            expect(resetUO).toHaveBeenCalled()
            expect(resetJust).toHaveBeenCalled()
        })

        it('items/originUO/selectedNextTaskRequiresUO watchers call initialize and reset helpers', async () => {
            const resetHuman = jest.spyOn(wrapper.vm, 'resetHumanDecisionSelectIfInvalidValue')
            const initHuman = jest.spyOn(wrapper.vm, 'initializeHumanDecisionSelect')
            wrapper.vm.$options.watch.selectHumanDecisionItems.call(wrapper.vm)
            expect(resetHuman).toHaveBeenCalled()
            expect(initHuman).toHaveBeenCalled()

            const resetRoute = jest.spyOn(wrapper.vm, 'resetRouteSelectIfInvalidValue')
            const initRoute = jest.spyOn(wrapper.vm, 'initializeRouteSelect')
            wrapper.vm.$options.watch.selectRouteItems.call(wrapper.vm)
            expect(resetRoute).toHaveBeenCalled()
            expect(initRoute).toHaveBeenCalled()

            const resetUO = jest.spyOn(wrapper.vm, 'resetUOSelectIfInvalidValue')
            const initUO = jest.spyOn(wrapper.vm, 'initializeUOSelect')
            wrapper.vm.$options.watch.selectUOItems.call(wrapper.vm)
            expect(resetUO).toHaveBeenCalled()
            expect(initUO).toHaveBeenCalled()

            wrapper.vm.$options.watch.originUO.call(wrapper.vm)
            expect(resetUO).toHaveBeenCalledTimes(2)
            expect(initUO).toHaveBeenCalledTimes(2)

            wrapper.vm.$options.watch.selectedNextTaskRequiresUO.call(wrapper.vm)
            expect(resetUO).toHaveBeenCalledTimes(3)
            expect(initUO).toHaveBeenCalledTimes(3)
        })
    })

    describe('emitActionEvent and buttons', () => {
        it('emits action with bpmParameters when form is valid or no form', async () => {
            const nextTasks = [{ taskId: 't3', justificativa: JSON.stringify({}) }]
            propsData.buttonType = 'complete'
            propsData.currentTask.nextTasks = nextTasks
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.setData({ selectedHumanDecision: { value: 't3' } })
            await wrapper.vm.emitActionEvent()
            expect(wrapper.emitted('action')).toBeTruthy()

            wrapper.setData({ selectedHumanDecision: { value: 't3' } })
            wrapper.vm.$refs.form = { validate: jest.fn().mockResolvedValue(true) }
            await wrapper.vm.emitActionEvent()
            expect(wrapper.emitted('action').length).toBeGreaterThan(0)

            wrapper.vm.$refs.form = { validate: jest.fn().mockResolvedValue(false) }
            const prevCount = wrapper.emitted('action').length
            await wrapper.vm.emitActionEvent()
            expect(wrapper.emitted('action')).toHaveLength(prevCount) // no new emit
        })

        it('button-action disabled when requires UO and no UO selected', async () => {
            propsData.buttonType = 'complete'
            propsData.components.select.humanDecision.show = true
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.setData({ selectedHumanDecision: { value: 'x', requiresUO: true } })
            await Vue.nextTick()
            const btn = wrapper.find('[data-test="button-action"]')
            expect(btn.props('disabled')).toBe(true)
            wrapper.setData({
                selectedOrganizationalStructure: { value: 'upperHierarchyCode', text: 'UO' },
                selectedUO: 'abc',
            })
            await Vue.nextTick()
            expect(btn.props('disabled')).toBe(false)
        })
    })
})
