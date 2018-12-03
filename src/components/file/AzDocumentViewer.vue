<template>
    <div>
        <div class="az-dv-controls" v-if="isZoomEnabled" :style="{'width': containerStyle.width}">
            <v-btn @click="zoomOut" depressed flat>
                <v-icon>zoom_out</v-icon>
            </v-btn>
            <v-btn @click="restoreZoom" depressed>
                <v-icon>aspect_ratio</v-icon>
            </v-btn>
            <v-btn @click="zoomIn" depressed>
                <v-icon>zoom_in</v-icon>
            </v-btn>
        </div>
        <div id="azDocumentViewer" class="az-dv-container" :style="containerStyle" ref="azDocumentViewer">
            <div class="az-dv-pages">
                <div :id="page.elementId" v-for="page in pages" :key="page.id">
                    <img :src="page.image" class="az-dv-page" :style="pageZoom"/>
                </div>
                <div class="az-dv-page-indicator" :style="pageIndicatorPosition" v-show="showPageIndicator">
                    Página {{currentPage}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import scrollmonitor from 'scrollmonitor'
    import imagesloaded from 'imagesloaded'
    import elementResizeEvent from 'element-resize-event'

    export default {
        name: 'AzDocumentViewer',
        props: {
            background: {
                type: String,
                default: '#ccc'
            },
            height: {
                type: String
            },
            images: {
                default: []
            },
            width: {
                type: String
            },
            enableZoom: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                currentPage: 1,
                pageIndicatorPosition: {},
                showPageIndicator: false,
                zoom: 85
            }
        },
        computed: {
            containerStyle() {
                return {
                    width: this.width ? this.width : 'auto',
                    height: this.height ? this.height : 'auto',
                    overflow: this.width || this.height ? 'scroll' : 'hidden',
                    'background-color': this.background
                }
            },
            isZoomEnabled() {
                return this.width && this.height
            },
            pages() {
                const pages = []
                this.images.forEach((image, index) => {
                    pages.push({
                        image,
                        index,
                        elementId: `az-document-viewer-page-${index}`
                    })
                })
                return pages
            },
            pageZoom() {
                return `width:${this.zoom}%`
            }
        },
        mounted() {
            this.createWindowListeners()
            this.createPageChangeListeners()
        },
        methods: {
            calcPageIndicatorPosition() {
                const boundingRect = this.getElementCoordinates('azDocumentViewer')
                const startingX = boundingRect.x
                const startingY = boundingRect.y
                const elementWidth = boundingRect.width
                const elementHeight = boundingRect.height
                const windowHeight = window.innerHeight
                const leftOffset = startingX + (elementWidth / 2) - 160
                let topOffset = 0
                if (elementHeight + startingY > windowHeight) {
                    topOffset = windowHeight - 110
                } else {
                    topOffset = startingY + elementHeight - 90
                }
                this.pageIndicatorPosition = {
                    left: `${leftOffset}px`,
                    top: `${topOffset}px`
                }
            },
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
                    elementWatcher.enterViewport(() => {
                        this.currentPage = page.index + 1
                    })
                }
            },
            createPageChangeListenersForScrollableContainer() {
                const containerElement = document.getElementById('azDocumentViewer')
                const containerMonitor = scrollMonitor.createContainer(containerElement)

                for (let page of this.pages) {
                    const childElement = document.getElementById(page.elementId)
                    const elementWatcher = containerMonitor.create(childElement)
                    elementWatcher.enterViewport(() => {
                        this.currentPage = page.index + 1
                    })
                }
            },
            createWindowListeners() {
                const azDocumentViewerElement = document.getElementById('azDocumentViewer')
                imagesloaded(azDocumentViewerElement, () => {
                    this.calcPageIndicatorPosition()
                    this.showPageIndicator = true
                })
                elementResizeEvent(azDocumentViewerElement, () => {
                    this.calcPageIndicatorPosition()
                })
            },
            getElementCoordinates(elementId) {
                const element = document.getElementById(elementId)
                return element.getBoundingClientRect()
            },
            restoreZoom() {
                this.zoom = 85
            },
            zoomIn() {
                this.zoom += 5
            },
            zoomOut() {
                this.zoom -= 5
            }
        }
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

    .az-dv-page-indicator
        position: fixed
        width: 320px
        padding: 20px
        opacity: .52
        border-radius: 4px
        text-align: center
        font-weight: 700
        color: #fff
        background-color: #000

    .az-dv-controls
        display: flex
        background-color: white
        justify-content: center
        height: 50px
        .v-btn__content
            i
                color: #777
</style>