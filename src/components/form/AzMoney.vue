<template>
    <v-text-field
        ref="azMoney"
        v-model="formattedValue"
        v-money="conditionalMoneyConfig"
        v-validate="getValidator"
        :name="name"
        :label="label"
        :disabled="disabled"
        :required="required"
        :placeholder="placeholder"
        :clearable="showClearButton"
        :error-messages="errors.collect(`${name}`)"
        :dense="dense"
        @click:clear="cleanValue"
        @blur="updateValue('blur')"
        @change="updateValue('change')"
        @focus="$emit('focus', $event)"
        @keydown="checkKeyAndValidate($event)"
        @keyup="checkKey($event)"
    >
        <template v-if="$slots['label']">
            <slot name="label" />
        </template>
        <template v-if="$slots['append-outer']">
            <slot name="append-outer" />
        </template>
        <template v-if="$slots['append']">
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
        value: {
            type: Number,
            default: null,
        },
        placeholder: {
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
        validateLength: {
            type: Boolean,
        },
    },
    data() {
        return {
            clickedField: false,
            formatted: false,
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
        getValidator() {
            return {
                required: this.required,
                ...this.checkMaxLength(),
            }
        },
    },
    watch: {
        value() {
            this.setFormattedValue()
            const input = this.$refs.azMoney.$el.querySelector('input')
            input.value = this.formattedValue
        },
    },
    mounted() {
        this.createRules()
        this.setFormattedValue()
    },
    methods: {
        async checkKey(event) {
            if (event.key === 'Tab') {
                return
            }

            this.clickedField = true
            if (event.key === 'Enter') {
                await this.updateValue('keyupEnter')
            } else if (event.key === 'Escape') {
                await this.updateValue(event.target.value, 'keyupEsc')
            } else {
                await this.updateValue('keyup')
            }
        },
        checkKeyAndValidate(event) {
            this.validatorNegative(event)
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
            this.$emit('input', null)
            this.$emit(this.eventSubmit, null)
            this.clickedField = false
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
        setFormattedValue() {
            if (this.value !== null) {
                this.formattedValue = accounting.formatMoney(
                    this.value,
                    this.prefix,
                    this.precision,
                    this.thousands,
                    this.decimal
                )
            } else {
                this.formattedValue = null
            }
        },
        async updateValue(event) {
            await this.$nextTick()

            this.formatted = true
            let valueNumber = this.formattedValue

            if (valueNumber) {
                if (this.prefix) {
                    valueNumber = valueNumber.replace(this.prefix, '')
                }
                if (this.suffix) {
                    valueNumber = valueNumber.replace(this.suffix, '')
                }
                valueNumber = accounting.unformat(valueNumber, ',')
            }

            if (this.clickedField || event === 'keyupEnter' || event === 'keyupEsc') {
                if (valueNumber !== this.value) {
                    this.$emit('input', valueNumber)
                }

                if (this.eventSubmit === event) {
                    this.$emit(event, valueNumber)
                    this.clickedField = false
                }
            }
        },
        validatorNegative(event) {
            if (event.key === '-' && !this.negative) {
                event.preventDefault()
            }
        },
    },
}
</script>
