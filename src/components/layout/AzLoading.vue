<template>
    <v-layout row justify-center>
        <v-dialog v-model="isLoading" persistent width="300">
            <v-card color="white" class="black--text" dark>
                <v-card-text>
                    {{loadingMessage}}
                    <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        name: 'AzLoading',
        computed: {
            isLoading() {
                return this.$store.state.loki.isLoading
            },
            loadingMessage() {
                return this.$store.state.loki.loadingMessage
            }
        }
    }
</script>