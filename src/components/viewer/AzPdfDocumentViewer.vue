<template>
    <div class="az-pdf-container" :class="customContainerClass" :style="{ height: height }">
        <Toolbar
            :downloadButton="downloadButton"
            :pagination="pagination"
            @zoomIn="zoomIn"
            @zoomOut="zoomOut"
            @resetZoom="resetZoom"
            @download="download"
            v-show="!loadingPlaceHolder"
        />
        <div
            id="az-pdf-viewer"
            class="Viewer"
            :style="{ height: `calc(${height} - 62px)` }"
            v-show="!loadingPlaceHolder"
        >
            <div class="pdfViewer"></div>
        </div>
        <LoadingPlaceHolder :loading="loadingPlaceHolder" />
    </div>
</template>

<script>
import Toolbar from './Toolbar'
import LoadingPlaceHolder from './LoadingPlaceHolder'
import PDFJSLib from 'pdfjs-dist/build/pdf'
import { PDFJS as PDFJSViewer } from 'pdfjs-dist/web/pdf_viewer.js'
export default {
    components: {
        Toolbar,
        LoadingPlaceHolder
    },
    mounted() {
        this.start()
        window.addEventListener('resize', this.updateScaleType)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateScaleType)
    },
    watch: {
        src() {
            this.start()
        }
    },
    methods: {
        start() {
            this.startLoadingPlaceHolderIfNecessary()
            this.getPdfContainer()
            this.createEventBus()
            this.createPdfViewer()
            this.renderDocument()
        },
        getPdfContainer() {
            this.pdf.container = document.querySelector('#az-pdf-viewer')
        },
        createEventBus() {
            const eventBus = new PDFJSViewer.EventBus()
            eventBus.on('pagesinit', this.pagesInitEventHandler)
            eventBus.on('scalechange', this.scaleChangeEventHandler)
            eventBus.on('pagechange', this.pageChangeEventHandler)
            this.pdf.eventBus = eventBus
        },
        pagesInitEventHandler(e) {
            this.setInitialPagination(e.source)
            this.updateScaleType()
            this.setInitialScale(e.source)
        },
        scaleChangeEventHandler(e) {
            this.scale.current = e.scale
        },
        pageChangeEventHandler(e) {
            this.pagination.current = e.pageNumber
        },
        createPdfViewer() {
            this.pdf.viewer = new PDFJSViewer.PDFViewer({
                container: this.pdf.container,
                eventBus: this.pdf.eventBus
            })
        },
        renderDocument() {
            if (!this.src) return this.stopLoadingPlaceHolder()
            PDFJSLib.getDocument({
                url: this.src,
                httpHeaders: this.httpHeader,
                withCredentials: true
            })
                .then(pdf => {
                    this.pdf.viewer.setDocument(pdf)
                    this.stopLoadingPlaceHolder()
                })
                .catch(error => {
                    this.stopLoadingPlaceHolder()
                    this.handlePdfError(error)
                })
        },
        setInitialPagination(pagination) {
            this.pagination.current = pagination.currentPageNumber
            this.pagination.total = pagination.pagesCount
        },
        updateScaleType() {
            if (this.isSmallScreen()) {
                this.pdf.viewer.currentScaleValue = 'page-width'
            } else {
                this.pdf.viewer.currentScaleValue = 'page-fit'
            }
        },
        setInitialScale(scale) {
            this.scale.current = scale.currentScale
            this.scale.default = scale.currentScale
        },
        isSmallScreen() {
            return this.pdf.container.clientWidth <= 700
        },
        handlePdfError(error) {
            if (error.name === 'InvalidPDFException') {
                throw new Error('URL do documento inválida.')
            } else if (error.name === 'MissingPDFException') {
                throw new Error(error.message.replace('Missing PDF', 'Documento não encontrado em'))
            } else if (error.status === 401) {
                throw new Error('Não autorizado, verifique seu token de acesso.')
            }
        },
        zoomIn() {
            this.pdf.viewer.currentScale = this.scale.current * 1.1
        },
        zoomOut() {
            if (this.scale.current > 0.2) {
                this.pdf.viewer.currentScale = this.scale.current / 1.1
            }
        },
        resetZoom() {
            this.pdf.viewer.currentScale = this.scale.default
        },
        download() {
            this.$emit('download')
        },
        startLoadingPlaceHolderIfNecessary() {
            this.loadingPlaceHolder = this.progressBar
        },
        stopLoadingPlaceHolder() {
            this.loadingPlaceHolder = false
        }
    },
    props: {
        src: {
            type: String,
            default: ''
        },
        cssClass: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '100vh'
        },
        httpHeader: {
            type: Object,
            default: () => new Object()
        },
        progressBar: {
            type: Boolean,
            default: false
        },
        downloadButton: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        customContainerClass() {
            let classObject = {}
            if (this.cssClass) {
                const classes = this.cssClass.split(' ')
                classes.forEach(clazz => (classObject[clazz] = true))
            }
            return classObject
        }
    },
    data: () => ({
        loadingPlaceHolder: false,
        pagination: {
            current: null,
            total: null
        },
        pdf: {
            container: null,
            eventBus: null,
            viewer: {}
        },
        scale: {
            default: null,
            current: null
        }
    })
}
</script>

<style src="pdfjs-dist/web/pdf_viewer.css" />

<style lang="stylus">
.az-pdf-container
    background-color #e4e4e4

    .Viewer
        width 100%
        position relative
        overflow scroll
        background-color #e4e4e4

        .page
            margin 15px auto
            border none
            border-image none

            .canvasWrapper
                -webkit-box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
                box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
</style>
