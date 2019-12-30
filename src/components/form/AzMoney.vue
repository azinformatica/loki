<template>
    <v-text-field
            v-money="(value !== null || restarted) ? moneyConfig : null"
            :name="name"
            :label="label"
            :maxLength="maxLength"
            :disabled="disabled"
            :required="required"
            :value="valueFormated"
            :placeholder="placeholder"
            class="clear-button"
            :prepend-inner-icon="(value !== null) ? 'fas fa-times-circle' : ''"
            @click:prepend-inner="cleanValue"
            @blur="updateValue($event.target.value)"
            @keydown="validatorNegative($event)"
            @keyup.enter="$emit('keyupEnter')"
            @focus="restartMoneyConfig"/>
</template>

<script>
    import accounting from 'accounting'

    export default {
        props: {
            value: {
                required: true
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
                moneyConfig: {},
                restarted: false
            }
        },
        mounted() {
            this.moneyConfig = {
                decimal: ',',
                thousands: '.',
                prefix: this.prefix,
                suffix: this.suffix,
                precision: this.precision,
                masked: false
            }
        },
        computed: {
            valueFormated() {
                if (this.value !== null) {
                    return accounting.formatMoney(this.value, this.prefix, this.precision, this.thousands, this.decimal)
                } else {
                    return null
                }
            }
        },
        methods: {
            updateValue(value) {
                let valueNumber = value
                if (this.prefix) {
                    valueNumber = valueNumber.replace(this.prefix, '')
                }
                if (this.suffix) {
                    valueNumber = valueNumber.replace(this.suffix, '')
                }
                const valueFormatedSimple = accounting.unformat(valueNumber, ',')
                if (valueFormatedSimple !== this.value) {
                    this.$emit('blur', valueFormatedSimple)
                }
            },
            validatorNegative($event) {
                if ($event.key === '-' && !this.negative) {
                    $event.preventDefault()
                }
            },
            restartMoneyConfig() {
                this.restarted = true
            },
            cleanValue() {
                this.restarted = false
                this.$emit('blur', null)
            }
        }
    }
</script>

<style lang="stylus">
    .clear-button i
        font-size 13px

</style>