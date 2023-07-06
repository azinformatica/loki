<template>
    <div v-if="hasComponents" class="d-flex justify-center align-center">
        <v-select
            v-model="selectedParallelTask"
            v-show="select.parallel.show"
            :items="select.parallel.items"
            :label="select.parallel.label"
            :disabled="disabled || select.parallel.disabled"
            v-bind="selectMergedAttrs"
        ></v-select>
        <v-select
            v-model="selectedHumanTask"
            v-show="select.humanDecision.show"
            :items="select.humanDecision.items"
            :label="select.humanDecision.label"
            :disabled="disabled || select.humanDecision.disabled"
            v-bind="selectMergedAttrs"
        ></v-select>
        <v-btn
            v-for="buttonType of buttonTypes"
            :key="buttonType"
            v-show="button[buttonType].show"
            :disabled="disabled || button[buttonType].disabled"
            v-bind="buttonMergedAttrs[buttonType]"
            @click="executeButtonAction(buttonType)"
        >
            {{ button[buttonType].label }}
        </v-btn>
    </div>
</template>

<script>
import _ from 'lodash'
import AzBpmInteraction from './AzBpmInteraction'
import { mutationTypes } from '../../store'
import AzBpmProcess from '../../utils/bpm/AzBpmProcess'

export default {
    name: 'AzBpmAction',
    props: {
        disabled: {
            default: false,
            type: Boolean,
        },
        processKey: {
            default: '',
            type: String,
        },
        businessKey: {
            default: '',
            type: String,
        },
        bpmParameters: {
            default: () => ({}),
            type: Object,
        },
        selectAttrs: {
            default: () => ({}),
            type: Object,
        },
        buttonAttrs: {
            default: () => ({}),
            type: Object,
            validator: (buttonAttrs) =>
                ['claim', 'unclaim', 'complete', 'uncomplete'].every(
                    (buttonType) =>
                        !buttonAttrs.hasOwnProperty(buttonType) || typeof buttonAttrs[buttonType] === 'object'
                ),
        },
        beforeAction: {
            type: Function,
            default: () => true,
        },
        afterAction: {
            type: Function,
            default: () => null,
        },
    },
    data() {
        return {
            selectedHumanTask: '',
            selectedParallelTask: '',
            selectDefaultAttrs: {},
            buttonDefaultAttrs: {
                claim: {},
                unclaim: {},
                complete: {},
                uncomplete: {},
            },
            interaction: null,
            process: null,
        }
    },
    methods: {
        async executeButtonAction(buttonType) {
            const button = this.button[buttonType]
            if (await this.beforeAction(buttonType)) {
                const processInstance = await button.action(this.bpmMergedParameters)
                await this.afterAction(processInstance)
            }
        },
        initializeProcess() {
            if (!this.currentProcessKey) {
                throw new Error('É necessário informar uma "processKey" na prop ou no AzBpmInteraction ascendente.')
            }

            if (!this.currentProcessKey) {
                throw new Error('É necessário informar uma "businessKey" na prop ou no AzBpmInteraction ascendente.')
            }

            this.process = new AzBpmProcess(this.$store, this.currentProcessKey, this.currentBusinessKey)
            this.process.load()
        },
        initializeInteraction() {
            this.interaction = this.findClosestInteraction(this.$parent)
        },
        getComponentName(vm) {
            return (vm && vm.$options && vm.$options.name) || ''
        },
        isBpmInteraction(vm) {
            return this.getComponentName(vm) === AzBpmInteraction.name
        },
        findClosestInteraction(vm) {
            if (!vm) {
                return null
            }

            if (this.isBpmInteraction(vm)) {
                return vm
            }

            return this.findClosestInteraction(vm.$parent)
        },
        setCurrentTaskSelected() {
            if (this.isSetCurrentTaskValid) {
                this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_PROCESS, this.setCurrentTaskParams)
                this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE, this.setCurrentTaskParams)
            }
        },
        selectHumanTask() {
            if (!this.isSelectedHumanTaskValid) {
                this.selectedHumanTask = this.firstHumanItemValue
            }
        },
        selectParallelTask() {
            if (this.currentTask) {
                this.selectedParallelTask = this.currentTask.id
            }
        },
    },
    watch: {
        select() {
            this.selectHumanTask()
            this.selectParallelTask()
        },
        selectedParallelTask() {
            this.setCurrentTaskSelected()
        },
    },
    computed: {
        setCurrentTaskParams() {
            return {
                processKey: this.currentProcessKey,
                businessKey: this.currentBusinessKey,
                currentTaskId: this.selectedParallelTask,
            }
        },
        isSetCurrentTaskValid() {
            return (
                this.isSelectedParallelTaskValid &&
                this.currentProcessKey &&
                this.currentBusinessKey &&
                this.selectedParallelTask
            )
        },
        bpmMergedParameters() {
            return _.merge({}, this.bpmDefaultParameters, this.bpmParameters)
        },
        bpmDefaultParameters() {
            return {
                humanDecision: this.selectedHumanTask,
            }
        },
        firstHumanItem() {
            return this.select.humanDecision.items[0] || {}
        },
        firstHumanItemValue() {
            return this.firstHumanItem.value || null
        },
        isSelectedHumanTaskValid() {
            return this.select.humanDecision.items.some((obj) => {
                return obj.value === this.selectedHumanTask
            })
        },
        isSelectedParallelTaskValid() {
            return this.select.parallel.items.some((obj) => {
                return obj.value === this.selectedParallelTask
            })
        },
        select() {
            return this.components.select || {}
        },
        selectMergedAttrs() {
            return _.merge({}, this.selectDefaultAttrs, this.selectAttrs)
        },
        button() {
            return this.components.button || {}
        },
        buttonTypes() {
            return Object.keys(this.button)
        },
        buttonMergedAttrs() {
            return _.merge({}, this.buttonDefaultAttrs, this.buttonAttrs)
        },
        interactionProps() {
            return (this.interaction && this.interaction.$props) || {}
        },
        currentProcessKey() {
            return this.processKey || this.interactionProps.processKey || ''
        },
        currentBusinessKey() {
            return this.businessKey || this.interactionProps.businessKey || ''
        },
        components() {
            return (this.process && this.process.getComponents()) || {}
        },
        currentTask() {
            return (this.process && this.process.getCurrentTask()) || {}
        },
        hasComponents() {
            return !_.isEmpty(this.components)
        },
    },
    created() {
        this.initializeInteraction()
        this.initializeProcess()
    },
}
</script>
