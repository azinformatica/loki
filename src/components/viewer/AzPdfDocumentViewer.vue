<template>
    <div class="az-pdf-document-viewer" justify-center :class="style">
        <az-pdf-document-viewer-toolbar
                v-bind="{ currentPage, totalPages }"
                @zoomOut="resolveEventZoomOut"
                @zoomIn="resolveEventZoomIn"
                @resetZoom="resolveEventResetZoom"
        />
        <div id="documentContainer" class="az-pdf-document-viewer__container" :style="{ height: height }">
            <az-pdf-document-viewer-page
                    v-for="page in pages"
                    :key="page.pageIndex + 1"
                    :pageNum="page.pageIndex + 1"
                    :pageSize="pageSize"
                    @resize="resolveEventResize"
            />
        </div>
    </div>
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
            src: {
                type: String,
                required: true,
                default: ''
            },
            cssClass: {
                type: String,
                default: ''
            },
            height: {
                type: String,
                default: '100hv'
            }
        },
        data: () => ({
            okToRender: false,
            pagesCanvasContext: {},
            visiblePageNum: 1
        }),
        computed: {
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
            },
            updateSrc() {
                return this.src
            }
        },
        async mounted() {
            await this.getDocumentContainer().addEventListener('scroll', this.handleScroll)
            await this.updatePdfRendering()
        },
        methods: {
            async updatePdfRendering() {
                if (this.updateSrc) {
                    this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM, this.visiblePageNum)
                    this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES)
                    await this.$store.dispatch(actionTypes.DOCUMENT.FETCH_DOCUMENT, this.updateSrc)
                }
            },
            getDocumentContainer() {
                return document.getElementById('documentContainer')
            },
            async handleScroll(e) {
                this.visiblePageNum = Math.round(e.target.scrollTop / this.pageHeight) + 1
                this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM, this.visiblePageNum)
                if (this.renderedPages.indexOf(this.visiblePageNum) === -1) {
                    this.okToRender = true
                    this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES, this.visiblePageNum)
                }
                if (this.okToRender) {
                    this.okToRender = false
                    await this.$store.dispatch(
                        actionTypes.DOCUMENT.RENDER_PAGE,
                        this.pagesCanvasContext[this.visiblePageNum]
                    )
                }
            },
            resolveEventZoomOut() {
                this.$store.dispatch(actionTypes.DOCUMENT.DECREASE_SCALE)
                this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES)
            },
            resolveEventZoomIn() {
                this.$store.dispatch(actionTypes.DOCUMENT.INCREASE_SCALE)
                this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES)
            },
            resolveEventResetZoom() {
                this.$store.dispatch(actionTypes.DOCUMENT.RESTORE_SCALE)
                this.$store.dispatch(actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES)
            },
            async resolveEventResize(payload) {
                this.pagesCanvasContext[payload.pageNum] = payload
                if (payload.pageNum === this.visiblePageNum) {
                    await this.$store.dispatch(
                        actionTypes.DOCUMENT.RENDER_PAGE,
                        this.pagesCanvasContext[this.visiblePageNum]
                    )
                    this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES, payload.pageNum)
                }
            }
        },
        watch: {
            async updateSrc() {
                await this.updatePdfRendering()
            }
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
