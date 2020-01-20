<template>
    <div class="az-pdf-document-viewer">
        <az-pdf-document-viewer-toolbar
                v-bind="{ currentPage, totalPages }"
                @zoomOut="resolveEventZoomOut"
                @zoomIn="resolveEventZoomIn"
                @resetZoom="resolveEventResetZoom"
        />
        <div id="documentContainer" class="az-document-container">
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
            src: { type: String, required: true }
        },
        data: () => ({
            visiblePageNum: 0
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
            totalPages() {
                return this.$store.getters.totalPageNum
            }
        },
        async created() {
            await this.$store.dispatch(actionTypes.DOCUMENT.FETCH_DOCUMENT, this.$props.src)
            this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER)
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll)
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        methods: {
            handleScroll(e) {
                this.visiblePageNum = Math.round(e.target.scrollingElement.scrollTop / this.pageHeight) + 1
                this.$store.dispatch(actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM, this.visiblePageNum)
            },
            resolveEventZoomOut() {
                this.$store.dispatch(actionTypes.DOCUMENT.DECREASE_SCALE)
            },
            resolveEventZoomIn() {
                this.$store.dispatch(actionTypes.DOCUMENT.INCREASE_SCALE)
            },
            resolveEventResetZoom() {
                this.$store.dispatch(actionTypes.DOCUMENT.RESTORE_SCALE)
            },
            async resolveEventResize({ pageNum, canvasContext }) {
                await this.$store.dispatch(actionTypes.DOCUMENT.RENDER_PAGE, { pageNum, canvasContext })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .az-document-container
        margin-top 15px
</style>
