<template>
	<div class="d-flex justify-center align-center">
		<v-select
			class="pr-4"
			v-model="selectedTask"
			:selected="selectedTask"
			:items="select.items"
			:label="select.label"
			v-show="select.show"
			:disabled="select.disabled"
		></v-select>
		<v-btn
			v-for="button in buttons"
			min-width="100"
			v-show="button.show"
			:disabled="button.disabled"
			@click="button.action(selectedTask, bpmParameter)"
		>
			{{ button.label }}
		</v-btn>
	</div>
</template>

<script>
import AzBpmInteraction from "./AzBpmInteraction"

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
		}
	},
	data() {
		return {
			selectedTask: '',
			closestBpmInteraction: null
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
		buttons() {
			return this.components.button || {}
		},
	},
	created() {
		this.closestBpmInteraction = this.findClosestBpmInteraction(this.$parent)
	}
}
</script>

<style scoped>
</style>
