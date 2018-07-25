<template>
    <v-text-field
            required
            :label=label
            placeholder="R$ 0,00"
            v-money="money"
            maxLength="24"
            v-model="preco"
    ></v-text-field>
</template>
<script>
    var accounting = require("accounting");

    export default {
        data() {
            return {
                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: 'R$ ',
                    suffix: '',
                    precision: 2,
                    masked: false
                },
                preco:'0',
                precoFormatado :null
            }
        },
        watch: {
            preco: function (val, oldVal) {
                this.precoFormatado = accounting.unformat(val, ",");
            }
        },
        props: ['label']
    }
</script>
