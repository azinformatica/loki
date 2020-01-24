<template>
    <v-select
        :items="combo"
        :value="value"
        @input="alteraValor"
        :label="label"
        :placeholder="placeholder"
        v-validate="{ required: isRequired }"
        :name="name"
        :error-messages="errors.collect(`${name}`)"
    ></v-select>
</template>

<script>
import _ from 'lodash'

export default {
    props: {
        enumObject: {
            type: Object,
            required: true
        },
        label: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        isRequired: {
            type: Boolean,
            default: false
        },
        value: {
            required: true
        }
    },
    inject: ['$validator'],
    data() {
        return {
            combo: []
        }
    },
    beforeMount() {
        this.combo = this.converteParaCombo(this.enumObject)
    },
    methods: {
        alteraValor(event) {
            this.$emit('input', event)
        },
        converteParaCombo(objeto) {
            let novoArray = []

            if (objeto) {
                for (let [chave, valor] of Object.entries(objeto)) {
                    novoArray.push({ text: valor, value: chave })
                }
                novoArray = _.sortBy(novoArray, 'text')
            }

            return _.union([{ text: 'Selecione', value: null }], novoArray)
        }
    }
}
</script>
