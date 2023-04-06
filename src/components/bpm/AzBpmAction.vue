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
            @click="button[buttonType].action(bpmMergedParameters)"
        >
            {{ button[buttonType].label }}
        </v-btn>
    </div>
</template>

<script>
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
                class: 'ml-4 text-none',
            },
            buttonClaimDefaultAttrs: {},
            buttonUnclaimDefaultAttrs: {
                text: true,
            },
            buttonCompleteDefaultAttrs: {},
            buttonUncompleteDefaultAttrs: {
                text: true,
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
        bpmMergedParameters() {
            return this.mergeAttrs(this.bpmDefaultParameters, this.bpmParameters)
        },
        bpmDefaultParameters() {
            return {
                humanDecision: this.selectedTask,
            }
        },
        selectMergedAttrs() {
            return this.mergeAttrs(this.selectDefaultAttrs, this.selectAttrs)
        },
        buttonAttrs() {
            return {
                claim: this.buttonClaimMergedAttrs,
                unclaim: this.buttonUnclaimMergedAttrs,
                complete: this.buttonCompleteMergedAttrs,
                uncomplete: this.buttonUncompleteMergedAttrs,
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
        buttonTypes() {
            return Object.keys(this.button)
        },
    },
    created() {
        this.closestBpmInteraction = this.findClosestBpmInteraction(this.$parent)
    },
}
</script>

<style scoped></style>