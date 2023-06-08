<template>
    <div class="d-flex justify-center align-center">
        <v-select
            v-model="selectParallelTask"
            v-show="select.parallel.show"
            :items="select.parallel.items"
            :label="select.parallel.label"
            :disabled="disabled || select.parallel.disabled"
            v-bind="selectMergedAttrs"
        ></v-select>
        <v-select
            v-model="selectHumanTask"
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
            @click="button[buttonType].action(bpmMergedParameters)"
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
    },
    data() {
        return {
            selectHumanTask: '',
            selectParallelTask: '',
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
    },
    watch: {
        select() {
            if (!this.isSelectedHumanTaskValid) {
                this.selectHumanTask = this.firstHumanItemValue
            }

            if (this.currentTask) {
                this.selectParallelTask = this.currentTask.id
            }

            if (!this.isSelectedParallelTaskValid) {
                this.selectParallelTask = this.firstParallelItemValue
            }
        },
        selectParallelTask() {
            if (this.isSetCurrentTaskValid) {
                if (this.currentTask && !this.selectParallelTask) {
                    this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE, this.setCurrentTaskParams)
                } else {
                    this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_PROCESS, this.setCurrentTaskParams)
                    this.$store.commit(mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE, this.setCurrentTaskParams)
                }
            }
        },
    },
    computed: {
        setCurrentTaskParams() {
            return {
                processKey: this.processKey,
                businessKey: this.businessKey,
                currentTaskId: this.selectParallelTask,
            }
        },
        isSetCurrentTaskValid() {
            return this.isSelectedParallelTaskValid && this.processKey && this.businessKey && this.selectParallelTask
        },
        bpmMergedParameters() {
            return _.merge({}, this.bpmDefaultParameters, this.bpmParameters)
        },
        bpmDefaultParameters() {
            return {
                humanDecision: this.selectHumanTask,
            }
        },
        firstHumanItem() {
            return this.select.humanDecision.items[0] || {}
        },
        firstHumanItemValue() {
            return this.firstHumanItem.value || null
        },
        firstParallelItem() {
            return this.select.parallel.items[0] || {}
        },
        firstParallelItemValue() {
            return this.firstParallelItem.value || null
        },
        isSelectedHumanTaskValid() {
            return this.select.humanDecision.items.some((obj) => {
                return obj.value === this.selectHumanTask
            })
        },
        isSelectedParallelTaskValid() {
            return this.select.parallel.items.some((obj) => {
                return obj.value === this.selectParallelTask
            })
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
        currentTask() {
            return this.closestBpmInteraction.bpmAtProcessKeyAtBusinessKey.currentTask || null
        },
        components() {
            return (this.closestBpmInteraction && this.closestBpmInteraction.components) || {}
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
    },
    created() {
        this.closestBpmInteraction = this.findClosestBpmInteraction(this.$parent)
    },
}
</script>
