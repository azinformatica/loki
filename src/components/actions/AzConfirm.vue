<template>
    <v-layout row justify-center class="az-confirm">
        <v-dialog persistent value="true" :max-width="maxWidth">
            <v-card>
                <v-card-text>
                    <slot></slot>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" id="btnDecline" flat @click="$emit('onDecline')">{{ labelDecline }}</v-btn>
                    <v-btn color="primary" id="btnConfirm" flat @click="$emit('onConfirm')">{{ labelConfirm }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
export default {
    name: 'AzConfirmDialog',
    props: {
        labelConfirm: {
            type: String,
            default: 'Sim'
        },
        labelDecline: {
            type: String,
            default: 'Não'
        },
        maxWidth: {
            type: Number,
            default: 290
        }
    }
}
</script>

<style scoped lang="stylus">
.az-confirm
    .v-btn
        font-size: 13px
        margin: 0 10px 0 0
        text-transform: none
        position: relative
        height: unset
        padding: 5px 15px
</style>
