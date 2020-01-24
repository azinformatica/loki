<template>
    <v-text-field
        v-money="conditionalMoneyConfig"
        :name="name"
        :label="label"
        :maxLength="maxLength"
        :disabled="disabled"
        :required="required"
        :value="valueFormated"
        :placeholder="placeholder"
        :showClearButton="showClearButton"
        class="clear-button"
        :prepend-inner-icon="showClearButtonIf"
        @click:prepend-inner="cleanValue"
        @blur="updateValue($event.target.value, 'blur')"
        @keydown="validatorNegative($event)"
        @keyup.enter="updateValue($event.target.value, 'keyupEnter')"
        @keyup="checkKey($event)"
    />
</template>

<script>
import accounting from 'accounting'

export default {
    props: {
        value: {
            required: true,
            default: null
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showClearButton: {
            type: Boolean,
            default: true
        },
        maxLength: {
            type: Number,
            default: 24
        },
        negative: {
            type: Boolean,
            default: false
        },
        precision: {
            type: Number,
            default: 2
        },
        prefix: {
            type: String,
            default: 'R$ '
        },
        suffix: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            moneyConfig: {
                decimal: ',',
                thousands: '.',
                prefix: this.prefix,
                suffix: this.suffix,
                precision: this.precision,
                masked: false
            },
            clickedField: false
        }
    },
    computed: {
        valueFormated() {
            if (this.value !== null) {
                return accounting.formatMoney(this.value, this.prefix, this.precision, this.thousands, this.decimal)
            } else {
                return null
            }
        },
        conditionalMoneyConfig() {
            return this.value !== null || this.clickedField ? this.moneyConfig : null
        },
        showClearButtonIf() {
            return this.value !== null && this.showClearButton ? 'fas fa-times-circle' : ''
        }
    },
    methods: {
        updateValue(value, event) {
            let valueNumber = value
            if (this.prefix) {
                valueNumber = valueNumber.replace(this.prefix, '')
            }
            if (this.suffix) {
                valueNumber = valueNumber.replace(this.suffix, '')
            }
            const valueFormatedSimple = accounting.unformat(valueNumber, ',')
            if (valueFormatedSimple !== this.value && this.clickedField) {
                this.$emit(event, valueFormatedSimple)
                this.clickedField = false
            }
        },
        validatorNegative($event) {
            if ($event.key === '-' && !this.negative) {
                $event.preventDefault()
            }
        },
        cleanValue() {
            this.$emit('blur', null)
            this.clickedField = false
        },
        checkKey($event) {
            if ($event.key !== 'Tab') {
                this.clickedField = true
            }
        }
    }
}
</script>

<style lang="stylus">
.clear-button
    .v-input__icon
        min-width 13px
        width 13px

    i
        font-size 13px
</style>
