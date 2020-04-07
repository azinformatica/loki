<template>
    <v-flex xs12 class="az-pdf-document-viewer" justify-center :class="style">
        <v-progress-linear
            v-show="loading && progressBar"
            v-model="progress"
            :active="show"
            :indeterminate="query"
            :query="true"
        />
        <div v-show="!loading">
            <az-pdf-document-viewer-toolbar
                v-bind="{ currentPage, totalPages }"
                @zoomOut="resolveEventZoomOut"
                @zoomIn="resolveEventZoomIn"
                @resetZoom="resolveEventResetZoom"
            />
            <div :id="`${id}-documentContainer`" class="az-pdf-document-viewer__container" :style="{ height: height }">
                <az-pdf-document-viewer-page
                    :id="id"
                    v-for="page in pages"
                    :key="page.pageIndex + 1"
                    :pageNum="page.pageIndex + 1"
                    :pageSize="pageSize"
                    @mounted="saveCanvasContext"
                />
            </div>
        </div>
    </v-flex>
</template>

<script>
import AzPdfDocumentViewerToolbar from './AzPdfDocumentViewerToolbar'
import AzPdfDocumentViewerPage from './AzPdfDocumentViewerPage'
import { actionTypes } from '../../store'
export default {
    components: {
        AzPdfDocumentViewerToolbar,
        AzPdfDocumentViewerPage
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
            default: '100vh'
        },
        httpHeader: {
            type: Object,
            default: () => new Object()
        },
        progressBar: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        documentContainerWidth: 0,
        pagesCanvasContext: {},
        visiblePageNum: 1,
        progress: 0,
        query: false,
        show: true,
        interval: 0,
        loading: false
    }),
    computed: {
        computedSrc() {
            return this.src
        },
        currentPage() {
            return this.$store.getters.currentPageNum
        },
        pageHeight() {
            return this.$store.getters.pageContainer.height
        },
        pages() {
            return this.$store.getters.pages
        },
        pageSize() {
            return this.$store.getters.pageContainer
        },
        renderedPages() {
            return this.$store.getters.renderedPages
        },
        style() {
            let styleObj = {}
            if (this.cssClass) {
                const classes = this.cssClass.split(' ')
                classes.forEach(clazz => (styleObj[clazz] = true))
            }
            return styleObj
        },
        totalPages() {
            return this.$store.getters.totalPageNum
        }
    },
    mounted() {
        this.queryAndIndeterminate()
        this.getDocumentContainer().addEventListener('scroll', this.handleScroll)
    },
    methods: {
        async updatePdfRendering() {
            try {
                if (this.validatenNotEmptySrc()) {
                    this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDER_CONTEXT)
                    this.loading = true
                    await this.$store.dispatch(actionTypes.DOCUMENT.FETCH_DOCUMENT, {
                        src: this.computedSrc,
                        httpHeader: this.httpHeader
                    })
                    this.loading = false
                    this.setPageContainer()
                    this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM, 1)
                    await this.renderPage(1)
                }
            } catch (error) {
                this.loading = false
                if (this.validatenNotEmptySrc()) {
                    if (error.message === 'Invalid PDF structure') {
                        throw new Error('URL do documento inválida.')
                    } else if (error.status === 401) {
                        throw new Error('Não autorizado, verifique seu token de acesso.')
                    }
                }
            }
        },
        async handleScroll(e) {
            this.visiblePageNum = e.target.scrollTop / this.pageHeight + 1
            if (this.needRenderNextPage()) {
                await this.renderPage(this.currentPage + 1)
            }
            if (this.needRenderPreviousPage()) {
                await this.renderPage(this.currentPage - 1)
            }
            this.visiblePageNum = Math.floor(this.visiblePageNum)
            if (this.validatePageChange()) {
                this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM, this.visiblePageNum)
            }
        },
        resolveEventZoomOut() {
            this.$store.dispatch(actionTypes.DOCUMENT.DECREASE_SCALE)
            this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES)
            this.renderPage(this.visiblePageNum)
        },
        resolveEventZoomIn() {
            this.$store.dispatch(actionTypes.DOCUMENT.INCREASE_SCALE)
            this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES)
            this.renderPage(this.visiblePageNum)
        },
        resolveEventResetZoom() {
            this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES)
            this.setPageContainer()
            this.renderPage(this.visiblePageNum)
        },
        async saveCanvasContext(payload) {
            this.pagesCanvasContext[payload.pageNum] = payload
        },
        queryAndIndeterminate() {
            this.query = true
            this.show = true
            this.progress = 0

            setTimeout(() => {
                this.query = false

                this.interval = setInterval(() => {
                    if (this.progress === 100) {
                        clearInterval(this.interval)
                        this.show = false
                        return setTimeout(this.queryAndIndeterminate, 2000)
                    }
                    this.progress += 25
                }, 1000)
            }, 2500)
        },
        setPageContainer() {
            if (this.documentContainerWidth <= 700) {
                this.$store.dispatch(actionTypes.DOCUMENT.CALCULATE_SCALE, this.documentContainerWidth)
            } else {
                this.$store.dispatch(actionTypes.DOCUMENT.CALCULATE_SCALE)
            }
            this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER)
        },
        async renderPage(pageNum) {
            this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES, pageNum)
            await this.$store.dispatch(actionTypes.DOCUMENT.RENDER_PAGE, this.pagesCanvasContext[pageNum])
        },
        getDocumentContainer() {
            return document.getElementById(`${this.id}-documentContainer`)
        },
        needRenderNextPage() {
            return (
                this.visiblePageNum > this.currentPage + 0.2 &&
                this.validateHasNextPage() &&
                this.validateNextPageNotRendered()
            )
        },
        validateHasNextPage() {
            return this.currentPage < this.totalPages
        },
        validateNextPageNotRendered() {
            return this.renderedPages.indexOf(this.currentPage + 1) === -1
        },
        needRenderPreviousPage() {
            return (
                this.visiblePageNum < this.currentPage + 0.8 &&
                this.validateHasPreviousPage() &&
                this.validatePreviousPageNotRendered()
            )
        },
        validateHasPreviousPage() {
            return this.currentPage - 1 >= 1
        },
        validatePreviousPageNotRendered() {
            return this.renderedPages.indexOf(this.currentPage - 1) === -1
        },
        validatePageChange() {
            return this.visiblePageNum !== this.currentPage && this.visiblePageNum <= this.totalPages
        },
        validatenNotEmptySrc() {
            return this.computedSrc.length > 0
        }
    },
    watch: {
        async computedSrc() {
            this.documentContainerWidth = this.getDocumentContainer().clientWidth
            await this.updatePdfRendering()
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>

<style scoped lang="stylus">
.az-pdf-document-viewer
    position relative
    width 100%
    background-color #f8f9fa

    &__container
        height 100vh
        overflow scroll
</style>
