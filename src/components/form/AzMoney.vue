<template>
    <v-text-field
            v-money="moneyConfig"
            :name="name"
            :label="label"
            :maxLength="maxLength"
            :disabled="disabled"
            :required="required"
            :value="valueFormated"
            @input="updateValue($event)"
            @keydown="validatorNegative($event)"
            @keyup.enter="$emit('keyupEnter')"/>
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
                moneyConfig: {}
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
                return accounting.formatMoney(this.value, this.prefix, this.precision, this.thousands, this.decimal)
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
                    this.$emit('input', valueFormatedSimple)
                }
            },
            validatorNegative($event) {
                if ($event.key === '-' && !this.negative) {
                    $event.preventDefault()
                }
            }
        }
    }
</script>

<style scoped lang="stylus">
</style>