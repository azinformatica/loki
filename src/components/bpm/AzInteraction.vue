<template>
	<div>
		<slot
			name="default"
			:bpmDisabled="bpmDisabled"
		>
		</slot>
	</div>
</template>

<script>
export default {
	name: 'AzInteraction',
	props: {
		id: {
			type: String,
			required: true
		},
		azAuthorities: {
			default: [],
			type: Array
		},
		azBusinessKey: {
			default: '',
			type: String
		},
		azProcessKey: {
			default: '',
			type: String
		},
		azIgnoreBpm: {
			default: false,
			type: Boolean
		},
		azDisabled: {
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			revokedPermissions: "ComprasPreparacao.Processo,ComprasPreparacao.Modelo"
		}
	},
	methods: {
		isAuthorityRevoked(authorityName) {
			return this.revokedPermissions.includes(authorityName)
		},
		isAuthorityWithAccess(authorityName) {
			return this.azAuthorities.includes(authorityName)
		},
		logica() {
			return true
		},
		removeWhitespace(text) {
			return text.replace(/\s+/g, '')
		},
		splitStringCommasToArray(text) {
			return text.split(',')
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
		hasAuthority() {
			return this.userAuthoritiesWithAccess.some(authority =>
				this.isAuthorityWithAccess(authority.name) &&
				!this.isAuthorityRevoked(authority.name)
			)
		},
		bpmDisabled() {
			return this.azDisabled || this.hasAuthority
		}
	},
	mounted() {

	}
}
</script>

<style scoped>

</style>
