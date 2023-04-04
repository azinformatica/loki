<template>
	<div class="d-flex justify-center align-center">
		<v-select
			v-bind="selectMergedAttrs"
			v-model="selectedTask"
			:items="select.items"
			:label="select.label"
			v-show="select.show"
			:disabled="select.disabled"
		></v-select>
		<v-btn
			v-for="buttonType of buttonTypes"
			v-bind="buttonAttrs[buttonType]"
			v-show="button[buttonType].show"
			:disabled="button[buttonType].disabled"
			@click="buttonActions[buttonType]"
		>
			{{ button[buttonType].label }}
		</v-btn>
	</div>
</template>

<script>
import AzBpmInteraction from "./AzBpmInteraction"
import bpmConstants from "./bpm-constants"

export default {
	name: "AzBpmAction",
	props: {
		disabled: {
			default: false,
			type: Boolean
		},
		bpmParameter: {
			default: () => ({}),
			type: Object
		},
		selectAttrs: {
			default: () => ({}),
			type: Object
		},
		buttonsAttrs: {
			default: () => ({}),
			type: Object
		},
		buttonClaimAttrs: {
			default: () => ({}),
			type: Object
		},
		buttonUnclaimAttrs: {
			default: () => ({}),
			type: Object
		},
		buttonCompleteAttrs: {
			default: () => ({}),
			type: Object
		},
		buttonUncompleteAttrs: {
			default: () => ({}),
			type: Object
		}
	},
	data() {
		return {
			selectedTask: '',
			closestBpmInteraction: null,
			selectDefaultAttrs: {},
			buttonsDefaultAttrs: {
				color: 'primary',
				text: true,
				class: 'ml-4'
			},
			buttonClaimDefaultAttrs: {},
			buttonUnclaimDefaultAttrs: {
				outlined: true
			},
			buttonCompleteDefaultAttrs: {},
			buttonUncompleteDefaultAttrs: {
				outlined: true
			},
			buttonTypes: bpmConstants.BUTTON_TYPES
		}
	},
	methods: {
		findClosestBpmInteraction(vm) {
			if (!vm) {
				const error = new Error(`${this.$options.name} must be inside ${AzBpmInteraction.name}`)
				console.error(error)
				throw error
			}

			if (vm.$options.name === AzBpmInteraction.name) {
				return vm
			}

			return this.findClosestBpmInteraction(vm.$parent)
		},
		mergeAttrs(...attrs) {
			return Object.assign({}, ...attrs)
		},
		mergeButtonAttrs(...buttonAttrs) {
			return this.mergeAttrs(
				this.buttonsMergedAttrs,
				...buttonAttrs
			)
		},
		createButtonAction(buttonType, ...actionArgs) {
			return {
				[buttonType]: () => this.button[buttonType].action(...actionArgs)
			}
		}
	},
	watch: {
		select() {
			if (!this.isSelectedTaskValid) {
				this.selectedTask = this.firstItemValue
			}
		}
	},
	computed: {
		selectMergedAttrs() {
			return this.mergeAttrs(this.selectDefaultAttrs, this.selectAttrs)
		},
		buttonAttrs() {
			return {
				[bpmConstants.BUTTON_TYPES.CLAIM]: this.buttonClaimMergedAttrs,
				[bpmConstants.BUTTON_TYPES.UNCLAIM]: this.buttonUnclaimMergedAttrs,
				[bpmConstants.BUTTON_TYPES.COMPLETE]: this.buttonCompleteMergedAttrs,
				[bpmConstants.BUTTON_TYPES.UNCOMPLETE]: this.buttonUncompleteMergedAttrs
			}
		},
		buttonActions() {
			return this.mergeAttrs(
				this.createButtonAction(bpmConstants.BUTTON_TYPES.CLAIM),
				this.createButtonAction(bpmConstants.BUTTON_TYPES.UNCLAIM),
				this.createButtonAction(bpmConstants.BUTTON_TYPES.COMPLETE, this.selectedTask, this.bpmParameter),
				this.createButtonAction(bpmConstants.BUTTON_TYPES.UNCOMPLETE),
			)
		},
		buttonsMergedAttrs() {
			return this.mergeAttrs(this.buttonsDefaultAttrs, this.buttonsAttrs)
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
		}
	},
	created() {
		this.closestBpmInteraction = this.findClosestBpmInteraction(this.$parent)
	}
}
</script>

<style scoped>
</style>
