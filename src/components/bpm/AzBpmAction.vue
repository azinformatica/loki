<template>
    <div class="d-flex justify-center align-center">
        <v-select
            v-model="selectedTask"
            v-show="select.show"
            :items="select.items"
            :label="select.label"
            :disabled="disabled || select.disabled"
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
            selectedTask: '',
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
            if (!this.isSelectedTaskValid) {
                this.selectedTask = this.firstItemValue
            }
        },
    },
    computed: {
        bpmMergedParameters() {
            return _.merge({}, this.bpmDefaultParameters, this.bpmParameters)
        },
        bpmDefaultParameters() {
            return {
                humanDecision: this.selectedTask,
            }
        },
        firstItem() {
            return this.select.items[0] || {}
        },
        firstItemValue() {
            return this.firstItem.value || null
        },
        isSelectedTaskValid() {
            return this.select.items.includes(this.selectedTask)
        },
        closestBpmInteractionProps() {
            return (this.closestBpmInteraction && this.closestBpmInteraction.$props) || {}
        },
        processKey() {
            return this.closestBpmInteractionProps.processKey
        },
        businessKey() {
            return this.closestBpmInteractionProps.businessKey
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
