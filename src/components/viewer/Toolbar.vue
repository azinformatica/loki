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
        <div id="az-pdf-toolbar-actions" class="az-pdf-toolbar__actions" :class="{ 'show': showActions }">
            <v-btn
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__btn"
                @click="$emit('rotate')"
                v-if="rotateButton"
                icon
                data-test="rotate"
                :disabled="disableButtons"
            >
                <v-tooltip bottom open-delay="800">
                    <span>Girar</span>
                    <v-icon slot="activator">rotate_right</v-icon>
                </v-tooltip>
            </v-btn>
            <v-btn
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__btn"
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
            <v-btn
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__btn"
                @click="$emit('print')"
                v-if="printButton"
                icon
                data-test="print"
                :disabled="disableButtons"
            >
                <v-tooltip bottom open-delay="800">
                    <span>Imprimir</span>
                    <v-icon slot="activator">print</v-icon>
                </v-tooltip>
            </v-btn>
            <v-btn
                v-if="hasActionButtons()"
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__more"
                @click="toggleToolbarActions"
                icon
            >
                <v-icon>more_vert</v-icon>
            </v-btn>
        </div>
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
        printButton: {
            type: Boolean,
            default: false
        },
        rotateButton: {
            type: Boolean,
            default: false
        },
        scaleType: {
            type: String,
            default: 'page-fit'
        }
    },
    data: () => ({
        showActions: false
    }),
    methods: {
        toggleToolbarActions() {
            this.showActions = !this.showActions
        },
        hasActionButtons() {
            return this.downloadButton || this.printButton || this.rotateButton
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

    &__actions
        position absolute
        right 20px

        &__more
            display none;

@media (max-width: 600px)
    .az-pdf-toolbar
        &__actions
            &__btn
                display none

            &__more
                display inline

    .show
        .az-pdf-toolbar__actions__btn
            display inline

        background-color #fff
        border-radius 6px
        -webkit-box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
        box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
</style>
