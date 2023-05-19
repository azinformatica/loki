<template>
    <v-text-field
        ref="azMoney"
        v-model.lazy="formattedValue"
        v-money="conditionalMoneyConfig"
        v-validate="getValidator"
        :name="name"
        :label="label"
        :disabled="disabled"
        :required="required"
        :placeholder="placeholder"
        :clearable="showClearButton"
        :error-messages="errors.collect(getFieldName)"
        :dense="dense"
        @click:clear="cleanValue"
        @blur="updateValue('blur')"
        @change="updateValue('change')"
        @focus="$emit('focus', $event)"
        @keydown="checkKeydown($event)"
        @keyup="checkKeyup($event)"
    >
        <template v-slot:label v-if="$slots['label']">
            <slot name="label" />
        </template>
        <template v-slot:append-outer v-if="$slots['append-outer']">
            <slot name="append-outer" />
        </template>
        <template v-slot:append v-if="$slots['append']">
            <slot name="append" />
        </template>
    </v-text-field>
</template>

<script>
import accounting from 'accounting'

export default {
    inject: ['$validator'],
    props: {
        dense: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
        },
        eventSubmit: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: '',
        },
        maxLength: {
            type: Number,
            default: 15,
        },
        name: {
            type: String,
            default: '',
        },
        negative: {
            type: Boolean,
        },
        placeholder: {
            type: String,
            default: '',
        },
        precision: {
            type: Number,
            default: 2,
        },
        prefix: {
            type: String,
            default: 'R$ ',
        },
        required: {
            type: Boolean,
        },
        showClearButton: {
            type: Boolean,
        },
        suffix: {
            type: String,
            default: '',
        },
        validate: {
            type: Object,
            default() {
                return {}
            },
        },
        validateLength: {
            type: Boolean,
        },
        value: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            clickedField: false,
            formattedValue: null,
            moneyConfig: {
                decimal: ',',
                thousands: '.',
                prefix: this.prefix,
                suffix: this.suffix,
                precision: this.precision,
                masked: false,
            },
        }
    },
    computed: {
        conditionalMoneyConfig() {
            return this.value !== null || this.clickedField ? this.moneyConfig : null
        },
        getFieldName() {
            return this.$attrs['data-vv-scope'] ? `${this.$attrs['data-vv-scope']}.${this.name}` : this.name
        },
        getValidator() {
            return {
                required: this.required,
                ...this.validate,
                ...this.checkMaxLength(),
            }
        },
    },
    watch: {
        value(newValue) {
            this.setFormattedValue(newValue)
        },
    },
    mounted() {
        this.createRules()
        this.setFormattedValue(this.value)
    },
    methods: {
        async checkKeydown(event) {
            if (event.key === '-') {
                await this.updateSign(event)
            }
        },
        async checkKeyup(event) {
            if (event.key === 'Tab') {
                return
            }

            this.clickedField = true
            if (event.key === 'Enter') {
                await this.updateValue('keyupEnter')
            } else if (event.key === 'Escape') {
                await this.updateValue('keyupEsc')
            } else {
                await this.updateValue('keyup')
            }
        },
        checkMaxLength() {
            if (this.validateLength) {
                return {
                    digits: this.maxLength,
                }
            } else {
                return {}
            }
        },
        cleanValue() {
            this.setFormattedValue(null)
            this.clickedField = false

            this.$emit('input', null)
            if (this.eventSubmit) {
                this.$emit(this.eventSubmit, null)
            }
        },
        createRules() {
            this.createRuleDigits()
        },
        createRuleDigits() {
            this.$validator.extend('digits', {
                validate(value, args) {
                    if (!value || !args.digits) {
                        return true
                    }
                    const digits = value.replace(/\D/g, '')
                    return digits.length <= args.digits
                },
                getMessage: (field, params) => 'O campo permite no máximo ' + params[0] + ' dígito(s)',
                paramNames: ['digits'],
            })
        },
        getNumberValue() {
            if (!this.formattedValue) {
                return null
            }

            return accounting.unformat(this.formattedValue, ',')
        },
        setFormattedValue(value) {
            if (value !== null) {
                this.formattedValue = accounting.formatMoney(value, '', this.precision, '.', ',')
            } else {
                this.formattedValue = null
            }

            const input = this.$refs.azMoney.$el.querySelector('input')
            input.value = this.formattedValue
        },
        async updateSign(event) {
            await this.$nextTick()

            if (!this.negative) {
                event.preventDefault()
                return
            }

            const numberValue = this.getNumberValue()
            if (numberValue !== null) {
                this.setFormattedValue(numberValue * -1)
            }

            event.preventDefault()
        },
        async updateValue(event) {
            await this.$nextTick()
            const numberValue = this.getNumberValue()

            if (this.clickedField || event === 'keyupEnter' || event === 'keyupEsc') {
                if (numberValue !== this.value) {
                    this.$emit('input', numberValue)
                }

                if (!this.eventSubmit || this.eventSubmit === event) {
                    this.$emit(event, numberValue)
                    this.clickedField = false
                }
            }
        },
    },
}
</script>
