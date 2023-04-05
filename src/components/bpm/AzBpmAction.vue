<template>
    <div class="d-flex justify-center align-center">
        <v-select
            v-bind="selectMergedAttrs"
            v-model="selectedTask"
            v-show="select.show"
            :items="select.items"
            :label="select.label"
            :disabled="select.disabled"
        ></v-select>
        <v-btn
            v-for="buttonType of buttonTypes"
            :key="buttonType"
            v-bind="buttonAttrs[buttonType]"
            v-show="button[buttonType].show"
            :disabled="button[buttonType].disabled"
            @click="button[buttonType].action(bpmMergedVariables)"
        >
            {{ button[buttonType].label }}
        </v-btn>
    </div>
</template>

<script>
import AzBpmInteraction from './AzBpmInteraction'
import bpmConstants from './bpm-constants'

export default {
    name: 'AzBpmAction',
    props: {
        disabled: {
            default: false,
            type: Boolean,
        },
        bpmVariables: {
            default: () => ({}),
            type: Object,
        },
        selectAttrs: {
            default: () => ({}),
            type: Object,
        },
        buttonClaimAttrs: {
            default: () => ({}),
            type: Object,
        },
        buttonUnclaimAttrs: {
            default: () => ({}),
            type: Object,
        },
        buttonCompleteAttrs: {
            default: () => ({}),
            type: Object,
        },
        buttonUncompleteAttrs: {
            default: () => ({}),
            type: Object,
        },
    },
    data() {
        return {
            selectedTask: '',
            closestBpmInteraction: null,
            selectDefaultAttrs: {},
            buttonDefaultAttrs: {
                color: 'primary',
                class: 'ml-4',
            },
            buttonClaimDefaultAttrs: {},
            buttonUnclaimDefaultAttrs: {
                text: true,
            },
            buttonCompleteDefaultAttrs: {},
            buttonUncompleteDefaultAttrs: {
                text: true,
            },
            buttonTypes: bpmConstants.BUTTON_TYPES,
        }
    },
    methods: {
        isBpmInteraction(vm) {
            return vm && vm.$options && vm.$options.name === AzBpmInteraction.name
        },
        findClosestBpmInteraction(vm) {
            if (!vm) {
                throw new Error(`${this.$options.name} must be inside ${AzBpmInteraction.name}`)
            }

            if (this.isBpmInteraction(vm)) {
                return vm
            }

            return this.findClosestBpmInteraction(vm.$parent)
        },
        mergeAttrs(...attrs) {
            return Object.assign({}, ...attrs)
        },
        mergeButtonAttrs(...buttonAttrs) {
            return this.mergeAttrs(this.buttonDefaultAttrs, ...buttonAttrs)
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
        bpmMergedVariables() {
            return this.mergeAttrs(this.bpmDefaultVariables, this.bpmVariables)
        },
        bpmDefaultVariables() {
            return {
                humanDecision: this.selectedTask,
            }
        },
        selectMergedAttrs() {
            return this.mergeAttrs(this.selectDefaultAttrs, this.selectAttrs)
        },
        buttonAttrs() {
            return {
                [bpmConstants.BUTTON_TYPES.CLAIM]: this.buttonClaimMergedAttrs,
                [bpmConstants.BUTTON_TYPES.UNCLAIM]: this.buttonUnclaimMergedAttrs,
                [bpmConstants.BUTTON_TYPES.COMPLETE]: this.buttonCompleteMergedAttrs,
                [bpmConstants.BUTTON_TYPES.UNCOMPLETE]: this.buttonUncompleteMergedAttrs,
            }
        },
        buttonClaimMergedAttrs() {
            return this.mergeButtonAttrs(this.buttonClaimDefaultAttrs, this.buttonClaimAttrs)
        },
        buttonUnclaimMergedAttrs() {
            return this.mergeButtonAttrs(this.buttonUnclaimDefaultAttrs, this.buttonUnclaimAttrs)
        },
        buttonCompleteMergedAttrs() {
            return this.mergeButtonAttrs(this.buttonCompleteDefaultAttrs, this.buttonCompleteAttrs)
        },
        buttonUncompleteMergedAttrs() {
            return this.mergeButtonAttrs(this.buttonUncompleteDefaultAttrs, this.buttonUncompleteAttrs)
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
        button() {
            return this.components.button || {}
        },
    },
    created() {
        this.closestBpmInteraction = this.findClosestBpmInteraction(this.$parent)
    },
}
</script>

<style scoped></style>
