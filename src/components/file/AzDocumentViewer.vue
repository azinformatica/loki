<template>
    <div>
        <div class="az-dv-controls" v-if="isZoomEnabled" :style="{ width: containerStyle.width }">
            <v-btn @click="zoomOut" depressed flat>
                <v-icon>mdi-magnify-minus-outline</v-icon>
            </v-btn>
            <v-btn @click="restoreZoom" depressed flat>
                <v-icon>mdi-aspect-ratio</v-icon>
            </v-btn>
            <v-btn @click="zoomIn" depressed flat>
                <v-icon>mdi-magnify-plus-outline</v-icon>
            </v-btn>
            <div class="pagination-label no-mobile">Página {{ currentPage }} de {{ totalPages }}</div>
        </div>
        <div id="azDocumentViewer" class="az-dv-container" :style="containerStyle" ref="azDocumentViewer">
            <div class="az-dv-pages">
                <div :id="page.elementId" v-for="page in pages" :key="page.id">
                    <img :src="page.image" class="az-dv-page" :style="pageZoom" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import scrollmonitor from 'scrollmonitor'
import imagesloaded from 'imagesloaded'

const INCREASE_ZOOM_BY = 5

export default {
    name: 'AzDocumentViewer',
    props: {
        background: {
            type: String,
            default: '#ccc',
        },
        height: {
            type: String,
        },
        images: {
            default: [],
        },
        width: {
            type: String,
        },
        enableZoom: {
            type: Boolean,
            default: false,
        },
        initialZoom: {
            type: Number,
            default: 75,
        },
    },
    data() {
        return {
            currentPage: 1,
            pageIndicatorPosition: {},
            showPageIndicator: false,
            zoom: this.initialZoom,
        }
    },
    computed: {
        containerStyle() {
            return {
                width: this.width ? this.width : 'auto',
                height: this.height ? this.height : 'auto',
                'overflow-x': 'scroll',
                'background-color': this.background,
            }
        },
        isZoomEnabled() {
            return (this.width && this.height) || this.enableZoom
        },
        pages() {
            const pages = []
            this.images.forEach((image, index) => {
                pages.push({
                    image,
                    index,
                    elementId: `az-document-viewer-page-${index}`,
                })
            })
            return pages
        },
        pageZoom() {
            return `width:${this.zoom}%`
        },
        totalPages() {
            return this.pages.length
        },
    },
    mounted() {
        this.createWindowListeners()
        this.createPageChangeListeners()
    },
    methods: {
        createPageChangeListeners() {
            if (this.isZoomEnabled) {
                this.createPageChangeListenersForScrollableContainer()
            } else {
                this.createPageChangeListenersForFullScreenContainer()
            }
            this.currentPage = 1
        },
        createPageChangeListenersForFullScreenContainer() {
            for (let page of this.pages) {
                const domElement = document.getElementById(page.elementId)
                const elementWatcher = scrollmonitor.create(domElement)
                elementWatcher.fullyEnterViewport(() => {
                    this.currentPage = page.index + 1
                })
            }
        },
        createPageChangeListenersForScrollableContainer() {
            const containerElement = document.getElementById('azDocumentViewer')
            const containerMonitor = scrollmonitor.createContainer(containerElement)
            for (let page of this.pages) {
                const childElement = document.getElementById(page.elementId)
                const elementWatcher = containerMonitor.create(childElement)
                elementWatcher.fullyEnterViewport(() => {
                    this.currentPage = page.index + 1
                })
            }
        },
        createWindowListeners() {
            const azDocumentViewerElement = document.getElementById('azDocumentViewer')
            imagesloaded(azDocumentViewerElement, () => {
                this.showPageIndicator = true
            })
        },
        restoreZoom() {
            this.zoom = this.initialZoom
        },
        zoomIn() {
            this.zoom += INCREASE_ZOOM_BY
        },
        zoomOut() {
            this.zoom -= INCREASE_ZOOM_BY
        },
    },
}
</script>

<style scoped lang="stylus">
.az-dv-container
    position: relative

.az-dv-pages
    text-align: center
    height: 100%

.az-dv-page
    border: 1px solid #ccc
    margin: 5% 5% 0 5%

.az-dv-controls
    display: flex
    background-color: white
    justify-content: center
    height: 50px
    .pagination-label
        position: absolute
        right: 15px
        top: 15px
        color: #777
    .v-btn__content
        i
            color: #777

@media (max-width: 720px)
    .az-dv-controls
        height 40px !important
        button
            height 30px !important
</style>
