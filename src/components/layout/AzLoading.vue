<template>
    <div class="az-loading">
        <v-overlay :value="isLoading">
            <v-card color="white" dark width="300">
                <v-card-text class="black--text">
                    {{ loadingMessage }}
                    <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-overlay>
    </div>
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
        },
    },
}
</script>

<style lang="stylus">
.az-loading
    z-index 100
</style>
