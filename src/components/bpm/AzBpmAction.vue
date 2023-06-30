<template>
    <div class="d-flex justify-center align-center">
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

export default {
    name: 'AzBpmAction',
    props: {
        disabled: {
            default: false,
            type: Boolean,
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
            default: (buttonType) => true,
        },
        afterAction: {
            type: Function,
            default: (processInstance) => null,
        },
    },
    data() {
        return {
            selectedHumanTask: '',
            selectedParallelTask: '',
            closestBpmInteraction: null,
            selectDefaultAttrs: {},
            buttonDefaultAttrs: {
                claim: {},
                unclaim: {},
                complete: {},
                uncomplete: {},
            },
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
        getComponentName(vm) {
            return (vm && vm.$options && vm.$options.name) || ''
        },
        isBpmInteraction(vm) {
            return this.getComponentName(vm) === AzBpmInteraction.name
        },
        findClosestBpmInteraction(vm) {
            if (!vm) {
                throw new Error(`${this.getComponentName(this)} must be inside ${AzBpmInteraction.name}`)
            }

            if (this.isBpmInteraction(vm)) {
                return vm
            }

            return this.findClosestBpmInteraction(vm.$parent)
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
                processKey: this.processKey,
                businessKey: this.businessKey,
                currentTaskId: this.selectedParallelTask,
            }
        },
        isSetCurrentTaskValid() {
            return this.isSelectedParallelTaskValid && this.processKey && this.businessKey && this.selectedParallelTask
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
        closestBpmInteractionProps() {
            return (this.closestBpmInteraction && this.closestBpmInteraction.$props) || {}
        },
        processKey() {
            return this.closestBpmInteractionProps.processKey || null
        },
        businessKey() {
            return this.closestBpmInteractionProps.businessKey || null
        },
        components() {
            return (this.closestBpmInteraction && this.closestBpmInteraction.components) || {}
        },
        currentTask() {
            return this.closestBpmInteraction.bpmAtProcessKeyAtBusinessKey.currentTask || null
        },
    },
    created() {
        this.closestBpmInteraction = this.findClosestBpmInteraction(this.$parent)
    },
}
</script>
