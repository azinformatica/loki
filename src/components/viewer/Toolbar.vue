<template>
    <v-toolbar class="az-pdf-toolbar" flat>
        <v-spacer />
        <toolbar-button
            v-if="previousDocumentButton"
            class="az-pdf-toolbar__content"
            data-test="previousDocument"
            :tooltip="previousDocumentButtonTooltip"
            icon="mdi-page-first"
            :disabled="disableButtons"
            @click="$emit('previousDocument')"
        />
        <div class="az-pdf-toolbar__pagination" data-test="pagination">
            <toolbar-button
                class="az-pdf-toolbar__content"
                data-test="previousPage"
                tooltip="Ir para a página anterior"
                icon="mdi-chevron-left"
                :disabled="disableButtons || (!hasPreviousPage && !hasPreviousDocument)"
                @click="$emit('previousPage')"
            />
            <v-text-field outline type="number" v-model="page" @change="$emit('changePage', formatPage($event))" />
            de {{ totalPages || '1' }}
            <toolbar-button
                class="az-pdf-toolbar__content"
                data-test="nextPage"
                tooltip="Ir para a próxima página"
                icon="mdi-chevron-right"
                :disabled="disableButtons || (!hasNextPage && !hasNextDocument)"
                @click="$emit('nextPage')"
            />
        </div>
        <toolbar-button
            v-if="nextDocumentButton"
            class="az-pdf-toolbar__content"
            data-test="nextDocument"
            :tooltip="nextDocumentButtonTooltip"
            icon="mdi-page-last"
            :disabled="disableButtons"
            @click="$emit('nextDocument')"
        />
        <div class="az-pdf-toolbar__display">
            <toolbar-button
                class="az-pdf-toolbar__content"
                data-test="zoomOut"
                tooltip="Zoom -"
                icon="mdi-magnify-minus-outline"
                :disabled="disableButtons"
                @click="$emit('zoomOut')"
            />
            <toolbar-button
                class="az-pdf-toolbar__content"
                data-test="changeScaleType"
                :tooltip="scaleTypeTooltip"
                :icon="scaleTypeIcon"
                :disabled="disableButtons"
                @click="$emit('changeScaleType')"
            />
            <toolbar-button
                class="az-pdf-toolbar__content"
                data-test="zoomIn"
                tooltip="Zoom +"
                icon="mdi-magnify-plus-outline"
                :disabled="disableButtons"
                @click="$emit('zoomIn')"
            />
        </div>
        <v-spacer />
        <div id="az-pdf-toolbar-actions" class="az-pdf-toolbar__actions" :class="{ show: showActions }">
            <toolbar-button
                v-if="rotateButton"
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__btn"
                data-test="rotate"
                tooltip="Girar"
                icon="mdi-rotate-right"
                :disabled="disableButtons"
                @click="$emit('rotate')"
            />
            <toolbar-button
                v-if="downloadButton"
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__btn"
                data-test="download"
                tooltip="Download"
                icon="mdi-download"
                :disabled="disableButtons"
                @click="$emit('download')"
            />
            <toolbar-button
                v-if="printButton"
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__btn"
                data-test="print"
                tooltip="Imprimir"
                icon="mdi-printer"
                :disabled="disableButtons"
                @click="$emit('print')"
            />
            <toolbar-button
                v-if="hasActionButtons"
                class="az-pdf-toolbar__content az-pdf-toolbar__actions__more"
                tooltip="Mais opções"
                icon="mdi-dots-vertical"
                @click="toggleToolbarActions"
            />
        </div>
    </v-toolbar>
</template>

<script>
import ToolbarButton from './ToolbarButton'
import _ from 'lodash'

export default {
    name: 'Toolbar',
    components: { ToolbarButton },
    props: {
        disableButtons: {
            type: Boolean,
            default: false,
        },
        downloadButton: {
            type: Boolean,
            default: false,
        },
        currentPage: {
            type: Number,
            default: 1,
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
        previousDocumentButton: {
            type: Boolean,
            default: false,
        },
        previousDocumentButtonTooltip: {
            type: String,
            default: 'Ir para o documento anterior',
        },
        nextDocumentButton: {
            type: Boolean,
            default: false,
        },
        nextDocumentButtonTooltip: {
            type: String,
            default: 'Ir para o próximo documento',
        },
        totalPages: {
            type: Number,
            default: 1,
        },
        hasNextDocument: {
            type: Boolean,
            default: false,
        },
        hasPreviousDocument: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        showActions: false,
        page: 1,
    }),
    methods: {
        toggleToolbarActions() {
            this.showActions = !this.showActions
        },
        formatPage(value) {
            this.page = value
            this.page = this.filterDigitsFromPage(this.page)
            this.page = this.convertPageToNumber(this.page)
            this.page = this.clampPage(this.page)

            return this.page
        },
        filterDigitsFromPage(page) {
            return page.toString().replace(/[^0-9]/g, '')
        },
        convertPageToNumber(page) {
            return parseInt(page || '1')
        },
        clampPage(page) {
            return _.clamp(page, 1, this.totalPages)
        },
        updatePage() {
            this.page = this.formatPage(this.currentPage)
        },
    },
    computed: {
        hasActionButtons() {
            return this.downloadButton || this.printButton || this.rotateButton
        },
        isScaleTypePageFit() {
            return this.scaleType === 'page-fit'
        },
        scaleTypeTooltip() {
            return this.isScaleTypePageFit ? 'Ajustar à largura' : 'Ajustar à altura'
        },
        scaleTypeIcon() {
            return this.isScaleTypePageFit ? 'mdi-fullscreen' : 'mdi-fullscreen-exit'
        },
        hasNextPage() {
            return this.page < this.totalPages
        },
        hasPreviousPage() {
            return this.currentPage > 1
        },
    },
    watch: {
        currentPage() {
            this.updatePage()
        },
    },
    mounted() {
        this.updatePage()
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
        display flex
        flex-wrap nowrap
        align-items center
        justify-content center
        height 32px

        .v-input
            margin-right 8px

            &__slot, &__control
                margin-bottom 0
                min-height auto !important
                display: flex !important;
                align-items: center !important;
                border-radius 0 !important
                border-color #a0a0a0 !important

                input
                    color #777 !important
                    font-size 14px !important
                    width 45px
                    text-align center
                    margin-top 0
                    -moz-appearance textfield

                    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button
                        -webkit-appearance none
                        margin 0

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
