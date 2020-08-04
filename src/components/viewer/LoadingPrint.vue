<template>
    <v-dialog v-model="isPrinting" width="500">
        <v-card>
            <v-card-title>Gerando impressão...</v-card-title>
            <v-card-text>
                <v-progress-linear v-model="printProgress" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'LoadingPrint',
    props: {
        isPrinting: {
            type: Boolean,
            default: false
        },
        printProgress: {
            type: Number || String,
            default: 0
        }
    }
}
</script>
