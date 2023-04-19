<template>
    <v-toolbar class="az-pdf-toolbar" flat>
        <v-spacer />
        <v-btn
            class="az-pdf-toolbar__content"
            @click="$emit('zoomOut')"
            icon
            data-test="zoomOut"
            :disabled="disableButtons"
        >
            <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{on}">
                    <v-icon v-on="on">mdi-magnify-minus-outline</v-icon>
                </template>
                <span>Zoom -</span>
            </v-tooltip>
        </v-btn>
        <v-btn
            class="az-pdf-toolbar__content"
            @click="$emit('changeScaleType')"
            icon
            data-test="changeScaleType"
            :disabled="disableButtons"
        >
            <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{on}">
                    <v-icon v-if="scaleType === 'page-fit'" v-on="on">mdi-fullscreen</v-icon>
                    <v-icon v-else v-on="on">mdi-fullscreen-exit</v-icon>
                </template>
                <span v-if="scaleType === 'page-fit'">Ajustar à largura</span>
                <span v-else>Ajustar à altura</span>
            </v-tooltip>
        </v-btn>
        <v-btn
            class="az-pdf-toolbar__content"
            @click="$emit('zoomIn')"
            icon
            data-test="zoomIn"
            :disabled="disableButtons"
        >
            <v-tooltip bottom open-delay="800">
                <template v-slot:activator="{on}">
                    <v-icon v-on="on">mdi-magnify-plus-outline</v-icon>
                </template>
                <span>Zoom +</span>
            </v-tooltip>
        </v-btn>
        <div class="az-pdf-toolbar__pagination" data-test="pagination">
            {{ pagination.current || '-' }} / {{ pagination.total || '-' }}
        </div>
        <v-spacer />
        <div id="az-pdf-toolbar-actions" class="az-pdf-toolbar__actions" :class="{ show: showActions }">
            <v-btn
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__btn"
                @click="$emit('rotate')"
                v-if="rotateButton"
                icon
                data-test="rotate"
                :disabled="disableButtons"
            >
                <v-tooltip bottom open-delay="800">
                    <template v-slot:activator="{on}">
                        <v-icon v-on="on">mdi-rotate-right</v-icon>
                    </template>
                    <span>Girar</span>
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
                    <template v-slot:activator="{on}">
                        <v-icon v-on="on">mdi-download</v-icon>
                    </template>
                    <span>Download</span>
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
                    <template v-slot:activator="{on}">
                        <v-icon v-on="on">mdi-printer</v-icon>
                    </template>
                    <span>Imprimir</span>
                </v-tooltip>
            </v-btn>
            <v-btn
                v-if="hasActionButtons()"
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__more"
                @click="toggleToolbarActions"
                icon
            >
                <v-icon>mdi-dots-vertical</v-icon>
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
            default: false,
        },
        downloadButton: {
            type: Boolean,
            default: false,
        },
        pagination: {
            type: Object,
            default: () => ({ current: '-', total: '-' }),
        },
        printButton: {
            type: Boolean,
            default: false,
        },
        rotateButton: {
            type: Boolean,
            default: false,
        },
        scaleType: {
            type: String,
            default: 'page-fit',
        },
    },
    data: () => ({
        showActions: false,
    }),
    methods: {
        toggleToolbarActions() {
            this.showActions = !this.showActions
        },
        hasActionButtons() {
            return this.downloadButton || this.printButton || this.rotateButton
        },
    },
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
