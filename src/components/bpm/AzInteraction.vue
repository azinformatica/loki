<template>
	<div>
		<slot>
		</slot>
	</div>
</template>

<script>
const HTML_TAGS_BPM = [
	// 'input',
	// 'select',
	'zicona'
]

const VUETIFY_TAGS_BPM = [
	'v-input',
	'v-select',
	'v-radio-button'
]

const EXTRA_TAGS_BPM = [
	'mascara-campo-texto'
]

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
	methods: {
		buscarElementosListadosNoBPM(elemento) {
			return elemento.querySelectorAll(HTML_TAGS_BPM)
		},
		desabilitarElementos(elementos) {
			for (const elemento of elementos) {
				elemento.disabled = true
			}
		},
		buscarComponentesListadosNoBPM(componente) {
			if (this.ehComponenteListadoNoBPM(componente)) {
				return [ componente ]
			}

			return this.getFilhosDoComponente(componente).reduce((filhosListadosNoBPM, filho) => {
				return [].concat(
					filhosListadosNoBPM,
					this.buscarComponentesListadosNoBPM(filho)
				)
			}, [])
		},

		ehComponenteListadoNoBPM(componente) {
			const tag = this.getTagDoComponente(componente)
			return [].concat(VUETIFY_TAGS_BPM, EXTRA_TAGS_BPM).includes(tag)
		},
		getTagDoComponente(componente) {
			return componente.$vnode.componentOptions.tag
		},
		getFilhosDoComponente(componente) {
			return (componente && componente.$children) || []
		},
		desabilitarComponentes(componentes) {
			for (const componente of componentes) {
				componente.$attrs.disabled = true
			}
		},
		getTagElemento(elemento) {
		},
		desabilitarElemento(elemento) {
			// elemento.
		}
	},
	mounted() {
		const elementos = this.buscarElementosListadosNoBPM(this.$el)
		this.desabilitarElementos(elementos)

		const componentes = this.buscarComponentesListadosNoBPM(this)
		this.desabilitarComponentes(componentes)
		console.log(componentes)
	}
}
</script>

<style scoped>

</style>
