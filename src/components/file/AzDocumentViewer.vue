<template>
    <div>
        <div class="dv-controls" v-if="isZoomEnabled" :style="{'width': containerDimensions.width}">
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
        <div id="azDocumentViewer" class="dv-container" :style="containerDimensions" ref="azDocumentViewer">
            <div class="dv-pages">
                <div :id="page.elementId" v-for="page in pages" :key="page.id">
                    <img :src="page.image" class="dv-page" :style="pageZoom"/>
                </div>
                <div class="dv-page-indicator" :style="pageIndicatorPosition">
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
            images: {
                default: []
            },
            height: {
                type: String
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
                zoom: 85,
                pageIndicatorPosition: {}
            }
        },
        computed: {
            containerDimensions() {
                return {
                    width: this.width ? this.width : 'auto',
                    height: this.height ? this.height : 'auto',
                    overflow: this.width || this.height ? 'scroll' : 'hidden'
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
    .dv-container
        background-color: gray
        position: relative

    .dv-pages
        text-align: center
        height: 100%

    .dv-page
        border: 1px solid #000
        margin: 5% 5% 0 5%

    .dv-page-indicator
        position: fixed
        width: 320px
        padding: 20px
        opacity: .52
        border-radius: 4px
        text-align: center
        font-weight: 700
        color: #fff
        background-color: #000

    .dv-controls
        display: flex
        background-color: white
        justify-content: center
        height: 50px
        .v-btn__content
            i
                color: #777
</style>