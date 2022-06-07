<template>
    <v-dialog v-model="isPrinting" width="500">
        <v-card class="az-pdf-loading-print">
            <v-card-title class="az-pdf-loading-print__title">Gerando impressão...</v-card-title>
            <v-card-text>
                <v-progress-linear v-model="printProgress" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn outline class="az-pdf-loading-print__action" @click="$emit('cancel')">Cancelar</v-btn>
                <v-spacer />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'LoadingPrint',
    props: {
        isPrinting: {
            type: Boolean,
            default: false,
        },
        printProgress: {
            type: Number || String,
            default: 0,
        },
    },
}
</script>

<style lang="stylus">
.az-pdf-loading-print__action
    color #777 !important
</style>
