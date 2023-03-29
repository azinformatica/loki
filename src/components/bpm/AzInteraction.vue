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
			default: '',
			type: [ String, Array ]
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
		temPermissao() {
			const { user } = this.$store.state.loki
			const authoritiesNames = user.authorities
				.filter(authority => authority.hasAccess)
				.map(authority => authority.name)

			return this.authoritiesFormatted.some(authority => {
				return authoritiesNames.includes(authority) && !this.revokedPermissionsFormatted.includes(authority)
			})
		},
		converterStringParaArray(texto) {
			if (!texto) {
				return []
			}

			if (typeof texto === 'string') {
				return texto.split(',')
			}

			if (Array.isArray(texto)) {
				return texto
			}

			return []
		},
		logica() {
			return true
		}
	},
	computed: {
		checkTemPermissao() {
			return this.temPermissao()
		},
		revokedPermissionsFormatted() {
			return this.converterStringParaArray(this.revokedPermissions)
		},
		authoritiesFormatted() {
			return this.converterStringParaArray(this.azAuthorities)
		},
		bpmDisabled() {
			return this.azDisabled || this.logica()
		}
	},
	mounted() {

	}
}
</script>

<style scoped>

</style>
