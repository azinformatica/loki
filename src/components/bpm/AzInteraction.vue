<template>
	<div>
		<slot
			name="default"
			:bpmDisabled="bpmDisabled"
			:processInstance="processInstance"
		>
		</slot>
	</div>
</template>

<script>
import _ from 'lodash'
import {actionTypes} from "../../store"

export default {
	name: 'AzInteraction',
	props: {
		id: {
			type: String,
			required: true
		},
		azAuthorities: {
			default: () => [],
			type: Array
		},
		azBusinessKey: {
			default: '',
			type: String,
			required: true
		},
		azProcessKey: {
			default: '',
			type: String,
			required: true
		},
		azDisabled: {
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			processInstance: null
		}
	},
	methods: {
		isAuthorityRevoked(authorityName) {
			return this.revokedAuthorities.length && this.revokedAuthorities.includes(authorityName)
		},
		isAuthorityPresentInProps(authorityName) {
			return !this.azAuthorities.length || this.azAuthorities.includes(authorityName)
		},
		async getProcessInstance(processKey, businessKey) {
			return this.$store.dispatch(actionTypes.BPM.PROCESS_INSTANCE, {
				processKey,
				businessKey,
			})
		}
	},
	computed: {
		user() {
			return this.$store.state.loki.user
		},
		userAuthorities() {
			return this.user.authorities || []
		},
		userAuthoritiesWithAccess() {
			return this.userAuthorities.filter(authority => authority.hasAccess)
		},
		revokedAuthorities() {
			return _
				.get(this.processInstance, 'currentTask.revokedPermissions', '')
				.replaceAll(/\s+/g, '')
				.split(',')
				.filter(Boolean)
		},
		hasSomeRevokedAuthority() {
			return this.userAuthoritiesWithAccess.some(authority => this.isAuthorityRevoked(authority.name))
		},
		hasSomeAuthorityPresentInProps() {
			return this.userAuthoritiesWithAccess.some(authority => this.isAuthorityPresentInProps(authority.name))
		},
		hasAuthorityToInteraction() {
			return !this.hasSomeRevokedAuthority && this.hasSomeAuthorityPresentInProps
		},
		bpmDisabled() {
			return this.azDisabled || !this.hasAuthorityToInteraction
		}
	},
	async mounted() {
		this.processInstance = await this.getProcessInstance(this.azProcessKey, this.azBusinessKey)
	}
}
</script>

<style scoped>

</style>
