<template>
    <v-toolbar class="az-pdf-toolbar" flat>
        <v-spacer />
        <v-btn @click="zoomOut" icon data-test="zoomOut" :disabled="disableButtons">
            <v-icon>zoom_out</v-icon>
        </v-btn>
        <v-btn @click="resetZoom" icon data-test="resetZoom" :disabled="disableButtons">
            <v-icon>aspect_ratio</v-icon>
        </v-btn>
        <v-btn @click="zoomIn" icon data-test="zoomIn" :disabled="disableButtons">
            <v-icon>zoom_in</v-icon>
        </v-btn>
        <v-btn v-show="downloadButton" @click="download" icon data-test="download" :disabled="disableButtons">
            <v-icon size="20">fas fa-download</v-icon>
        </v-btn>
        <div class="az-pdf-toolbar__page-viewer">{{ currentPage }} / {{ totalPages }}</div>
        <v-spacer />
    </v-toolbar>
</template>

<script>
export default {
    props: {
        currentPage: {
            required: true
        },
        totalPages: {
            required: true
        },
        downloadButton: {
            required: true
        }
    },
    computed: {
        disableButtons() {
            return this.totalPages === '-'
        }
    },
    methods: {
        zoomOut() {
            this.$emit('zoomOut')
        },
        zoomIn() {
            this.$emit('zoomIn')
        },
        resetZoom() {
            this.$emit('resetZoom')
        },
        download() {
            this.$emit('download')
        }
    }
}
</script>

<style scoped lang="stylus">
.az-pdf-toolbar
    background-color #fff !important
    margin-bottom  5px

    &__page-viewer
        margin-left 10px
        color #777
</style>
