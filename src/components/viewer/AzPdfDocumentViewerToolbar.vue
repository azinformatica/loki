<template>
    <v-toolbar class="az-toolbar" flat>
        <v-btn @click="zoomOut" icon data-test="zoomOut">
            <v-icon>zoom_out</v-icon>
        </v-btn>
        <v-btn @click="resetZoom" icon data-test="resetZoom">
            <v-icon>aspect_ratio</v-icon>
        </v-btn>
        <v-btn @click="zoomIn" icon data-test="zoomIn">
            <v-icon>zoom_in</v-icon>
        </v-btn>
        <div class="pageViewer">{{ currentPage }} / {{ totalPages }}</div>
    </v-toolbar>
</template>

<script>
    export default {
        props: {
            currentPage: {
                type: Number,
                required: true
            },
            totalPages: {
                type: Number,
                required: true
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
            }
        }
    }
</script>

<style lang="stylus">
    .pageViewer
        margin-left 10px
        color #777

    .az-toolbar
        background-color #fff !important

        .v-toolbar__content
            margin 0 auto
</style>
