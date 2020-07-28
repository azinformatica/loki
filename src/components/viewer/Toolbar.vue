<template>
    <!-- eslint-disable max-len prettier/prettier -->
    <v-toolbar class="az-pdf-toolbar" flat>
        <v-spacer />
        <v-btn class="az-pdf-toolbar__content" @click="$emit('zoomOut')" icon data-test="zoomOut" :disabled="disableButtons">
            <v-tooltip bottom open-delay="800">
                <span>Zoom -</span>
                <v-icon slot="activator" >zoom_out</v-icon>
            </v-tooltip>
        </v-btn>
        <v-btn class="az-pdf-toolbar__content" @click="$emit('changeScaleType')" icon data-test="changeScaleType" :disabled="disableButtons">
            <v-tooltip bottom open-delay="800">
                <span v-if="scaleType === 'page-fit'" >Ajustar à largura</span>
                <span v-else >Ajustar à altura</span>

                <v-icon v-if="scaleType === 'page-fit'" slot="activator" >fullscreen</v-icon>
                <v-icon v-else slot="activator" >fullscreen_exit</v-icon>
            </v-tooltip>
        </v-btn>
        <v-btn class="az-pdf-toolbar__content" @click="$emit('zoomIn')" icon data-test="zoomIn" :disabled="disableButtons">
            <v-tooltip bottom open-delay="800">
                <span>Zoom +</span>
                <v-icon slot="activator" >zoom_in</v-icon>
            </v-tooltip>
        </v-btn>
        <div class="az-pdf-toolbar__pagination" data-test="pagination">
            {{ pagination.current || '-' }} / {{ pagination.total || '-' }}
        </div>
        <v-spacer />
        <v-btn 
            class="az-pdf-toolbar__content"
            @click="$emit('rotate')"
            v-if="rotateButton"
            icon
            data-test="rotate"
            :disabled="disableButtons"
        >
            <v-tooltip bottom open-delay="800">
                <span>Rotacionar</span>
                <v-icon slot="activator">rotate_right</v-icon>
            </v-tooltip>
        </v-btn>
        <v-btn
            class="az-pdf-toolbar__content"
            @click="$emit('download')"
            v-if="downloadButton"
            icon
            data-test="download"
            :disabled="disableButtons"
        >
            <v-tooltip bottom open-delay="800">
                <span>Download</span>
                <v-icon slot="activator" >get_app</v-icon>
            </v-tooltip>
        </v-btn>
    </v-toolbar>
</template>

<script>
export default {
    name: 'Toolbar',
    props: {
        disableButtons: {
            type: Boolean,
            default: false
        },
        downloadButton: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Object,
            default: () => ({ current: '-', total: '-' })
        },
        rotateButton: {
            type: Boolean,
            default: false
        },
        scaleType: {
            type: String,
            default: 'page-fit'
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
