<template>
    <v-select
        :items="combo"
        :value="value"
        @input="alteraValor"
        :label="label"
        :chips="chips"
        :multiple="multiple"
        :placeholder="placeholder"
        v-validate="{ required: isRequired }"
        :name="name"
        :error-messages="errors.collect(`${name}`)"
        :disabled="disabled">
        <template v-slot:label if="this.$slots['label']">
            <slot name="label" />
        </template>
        <template v-slot:append-outer v-if="this.$slots['append-outer']">
            <slot name="append-outer" />
        </template>
        <template v-if="selectionSlot" v-slot:selection="{item,index}">
            <v-chip v-if="index ===0">
                <span>{{item.text}}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text caption">(+{{ value.length - 1 }} others)</span>
        </template>
        <template v-slot:append v-if="this.$slots['append']">
            <slot name="append" />
        </template>
    </v-select>
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
        chips: {
            default: false
        },
        multiple: {
            type:Boolean,
            default: false
        },
        selectionSlot:{
            type:Boolean,
            default:false
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
        },
        disabled: {
            type: Boolean,
            default: false
        },
        insertNullItem: {
            type: Boolean,
            default: true
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
            if (this.insertNullItem) {
                return _.union([{ text: 'Selecione', value: null }], novoArray)
            }

            return novoArray
        }
    }
}
</script>
