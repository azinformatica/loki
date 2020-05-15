<template>
    <div class="az-pdf-container">
        <Toolbar
            :downloadButton="downloadButton"
            :pagination="pagination"
            @zoomIn="zoomIn"
            @zoomOut="zoomOut"
            @resetZoom="resetZoom"
            @download="download"
            v-show="!loadingPlaceHolder"
        />
        <div id="az-pdf-viewer" class="Viewer" :style="{ height: height }" v-show="!loadingPlaceHolder">
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
import 'pdfjs-dist/web/pdf_viewer.css'
import { actionTypes } from '../../store'
export default {
    components: {
        Toolbar,
        LoadingPlaceHolder
    },
    mounted() {
        this.start()
    },
    watch: {
        src() {
            this.start()
        }
    },
    methods: {
        start() {
            this.loadingPlaceHolder = this.progressBar
            this.getPdfContainer()
            this.createEventBus()
            this.createPdfViewer()
            this.renderDocument()
            this.loadingPlaceHolder = false
        },
        getPdfContainer() {
            this.pdf.container = document.querySelector('#az-pdf-viewer')
        },
        createEventBus() {
            const eventBus = new PDFJSViewer.EventBus()
            eventBus.on('pagesinit', e => {
                this.pagination.current = e.source.currentPageNumber
                this.pagination.total = e.source.pagesCount
                if (this.validateSmallScreen()) {
                    this.pdf.viewer.currentScaleValue = 'page-width'
                } else {
                    this.pdf.viewer.currentScaleValue = 'page-fit'
                }
                this.scale.current = e.source.currentScale
                this.scale.default = e.source.currentScale
            })
            eventBus.on('scalechange', e => {
                this.scale.current = e.scale
            })
            eventBus.on('pagechange', e => {
                this.pagination.current = e.pageNumber
            })
            this.pdf.eventBus = eventBus
        },
        createPdfViewer() {
            this.pdf.viewer = new PDFJSViewer.PDFViewer({
                container: this.pdf.container,
                eventBus: this.pdf.eventBus
            })
        },
        renderDocument() {
            if (!this.src) return
            PDFJSLib.getDocument({
                url: this.src,
                httpHeaders: this.httpHeader,
                withCredentials: true
            })
                .then(pdf => {
                    this.pdf.viewer.setDocument(pdf)
                })
                .catch(error => {
                    this.handlePdfError(error)
                })
        },
        validateSmallScreen() {
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
            this.scale.current = this.scale.current * 1.1
            this.pdf.viewer.currentScale = this.scale.current
        },
        zoomOut() {
            if (this.scale.current > 0.2) {
                this.scale.current = this.scale.current / 1.1
                this.pdf.viewer.currentScale = this.scale.current
            }
        },
        resetZoom() {
            this.pdf.viewer.currentScale = this.scale.default
        },
        download() {
            this.$store.dispatch(actionTypes.DOCUMENT.DOWNLOAD, {
                src: this.src,
                httpHeader: this.httpHeader,
                filename: this.pdf.viewer.pdfDocument.transport._fullReader._filename || 'download.pdf'
            })
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        },
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
            default: 'calc(100vh - 62px)'
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
    data: () => ({
        loadingPlaceHolder: false,
        pagination: {
            current: null,
            total: null
        },
        pdf: {
            container: null,
            eventBus: null,
            viewer: null
        },
        scale: {
            default: null,
            current: null
        }
    })
}
</script>

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
