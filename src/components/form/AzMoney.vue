<template>
    <v-text-field
        v-money="conditionalMoneyConfig"
        :name="name"
        :label="label"
        :maxLength="length"
        :disabled="disabled"
        :required="required"
        :value="valueFormated"
        :placeholder="placeholder"
        :showClearButton="showClearButton"
        class="clear-button"
        :prepend-inner-icon="showClearButtonIf"
        :error-messages="errors.collect(`${name}`)"
        @click:prepend-inner="cleanValue"
        @blur="updateValue($event.target.value, 'blur')"
        @keydown.ctrl.65="selectValue"
        @keydown="checkKeyAndValidateLength($event)"
        @keyup="checkKey($event)">
        <template v-slot:label if="this.$slots['label']">
            <slot name="label" />
        </template>
        <template v-slot:append-outer v-if="this.$slots['append-outer']">
            <slot name="append-outer" />
        </template>
        <template v-slot:append v-if="this.$slots['append']">
            <slot name="append" />
        </template>
    </v-text-field>
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
            default: false
        },
        maxLength: {
            type: Number,
            default: 24
        },
        validateLength: {
            type: Boolean,
            default: false
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
        },
        requeridMessage: {
            type: String,
            default: 'O campo {name} é obrigatório'
        },
        validationField: {
            type: Number
        },
        eventSubmit: {
            type: String
        }
    },
    inject: ['$validator'],
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
            clickedField: false,
            formatted: false,
            select: false,
            length: this.maxLength
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
    watch: {
        validationField() {
            this.validateRequired(this.value)
        }
    },
    updated(){
        if(!this.required){
            this.clearErrorValidate()
        }
    },
    methods: {
        updateValue(value, event) {
            this.formatted = true
            let valueNumber = value
            if (this.prefix) {
                valueNumber = valueNumber.replace(this.prefix, '')
            }
            if (this.suffix) {
                valueNumber = valueNumber.replace(this.suffix, '')
            }
            const valueFormatedSimple = accounting.unformat(valueNumber, ',')

            if (
                (valueFormatedSimple !== this.value || event === 'keyupEnter' || event === 'keyupEsc') &&
                this.clickedField
            ) {

                if(!this.eventSubmit || this.eventSubmit === event ) {
                    this.$emit('input', valueFormatedSimple)
                    this.$emit(event, valueFormatedSimple)
                    this.clickedField = false
                }
            }

            this.validateRequired(value)
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
            if ($event.key === 'Enter') {
                this.updateValue($event.target.value, 'keyupEnter')
            } else if ($event.key === 'Escape') {
                this.updateValue($event.target.value, 'keyupEsc')
            } else {
                this.updateValue($event.target.value, 'keyup')
            }
        },
        validateRequired(value) {
            if (this.required) {
                this.clearErrorValidate()
                if (!value) {
                    this.errors.add({
                        field: this.name,
                        msg: this.requeridMessage.replace('{name}', this.name)
                    })
                }
            }
        },
        checkMaxLength($event) {
            if (this.validateLength) {
                if (this.formatted && this.isDigit($event.code) && !this.select) {
                    this.length = this.maxLength + Math.floor(this.maxLength / 3) + this.prefix.length
                } else {
                    this.length = this.maxLength
                }

                if (this.isDigit($event.code)) {
                    this.select = false
                }
            }
        },
        isDigit(key) {
            const pattern = /Digit\d|Numpad\d/i

            return pattern.test(key)
        },
        selectValue() {
            this.select = true
        },
        checkKeyAndValidateLength($event) {
            this.validatorNegative($event)
            this.checkMaxLength($event)
        },
        clearErrorValidate() {
            for (var index = 0; index < this.$validator.errors.items.length; index++) {
                if (this.$validator.errors.items[index].field === this.name) {
                    this.$validator.errors.items.splice(index, 1)
                }
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
