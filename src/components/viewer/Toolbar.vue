<template>
    <v-toolbar class="az-pdf-toolbar" flat>
        <v-spacer />
        <v-btn class="az-pdf-toolbar__content" @click="$emit('zoomOut')" icon data-test="zoomOut">
            <v-icon>zoom_out</v-icon>
        </v-btn>
        <v-btn class="az-pdf-toolbar__content" @click="$emit('resetZoom')" icon data-test="resetZoom">
            <v-icon>aspect_ratio</v-icon>
        </v-btn>
        <v-btn class="az-pdf-toolbar__content" @click="$emit('zoomIn')" icon data-test="zoomIn">
            <v-icon>zoom_in</v-icon>
        </v-btn>
        <div class="az-pdf-toolbar__pagination" data-test="pagination">
            {{ pagination.current }} / {{ pagination.total }}
        </div>
        <v-spacer />
    </v-toolbar>
</template>

<script>
export default {
    name: 'Toolbar',
    props: {
        pagination: {
            type: Object,
            default: () => ({ current: '-', total: '-' })
        }
    }
}
</script>

<style lang="stylus">
.az-pdf-toolbar
    background-color #fff !important
    margin-bottom 2px !important
    height 60px !important

    &__content, &__pagination
        color #777 !important

    &__pagination
        margin-left 10px

    .v-toolbar__content
        height 100% !important
</style>
