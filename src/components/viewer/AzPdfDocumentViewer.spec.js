import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'regenerator-runtime'
import '@azinformatica/pdfjs-dist/build/pdf'
import '@azinformatica/pdfjs-dist/web/pdf_viewer.js'
import AzPdfDocumentViewer from './AzPdfDocumentViewer'
import { createLocalVue, shallowMount } from '@vue/test-utils'

jest.mock('@azinformatica/pdfjs-dist', () => ({
    getDocument: jest.fn(() => ({
        promise: Promise.resolve(true),
    })),
    GlobalWorkerOptions: jest.fn(() => ({
        workerSrc: jest.fn(),
    })),
    LinkTarget: {
        BLANK: 2,
    },
}))

jest.mock('@azinformatica/pdfjs-dist/web/pdf_viewer.js', () => ({
    EventBus: jest.fn(() => ({
        on: jest.fn().mockImplementation((e, cb) =>
            cb({
                source: {
                    currentPageNumber: 1,
                    currentScale: 1,
                    pagesCount: 10,
                },
                scale: 1,
                pageNumber: 2,
            })
        ),
    })),

    PDFViewer: jest.fn(() => ({
        setDocument: jest.fn(),
    })),

    PDFLinkService: jest.fn(() => ({
        setDocument: jest.fn(),
        setViewer: jest.fn(),
    })),
}))

const localVue = createLocalVue()
Vue.use(Vuetify)
Vue.use(Vuex)

describe('AzPdfDocumentViewer.spec.js', () => {
    let src,
        httpHeader,
        downloadButton,
        progressBar,
        rotateButton,
        draggables,
        initialDraggableWidth,
        initialDraggableHeight,
        draggableLinkTooltip,
        draggableUnlinkTooltip,
        draggableDeleteTooltip,
        wrapper

    beforeEach(() => {
        src = 'document/url'
        httpHeader = { token: '123abcd456' }
        downloadButton = true
        progressBar = true
        rotateButton = true
        draggables = [
            {
                percentX: 5,
                percentY: 5,
                percentHeight: 10,
                percentWidth: 10,
                pageNumber: 1,
                id: 'draggable-id',
            },
        ]
        initialDraggableWidth = 200
        initialDraggableHeight = 200
        draggableLinkTooltip = 'link'
        draggableUnlinkTooltip = 'unlink'
        draggableDeleteTooltip = 'delete'
        wrapper = shallowMount(AzPdfDocumentViewer, {
            localVue,
            propsData: {
                src,
                httpHeader,
                downloadButton,
                progressBar,
                rotateButton,
                draggables,
                initialDraggableWidth,
                initialDraggableHeight,
                draggableLinkTooltip,
                draggableUnlinkTooltip,
                draggableDeleteTooltip,
            },
            attachTo: document.body,
        })
    })

    describe('Props', () => {
        it('Should receive props src', () => {
            expect(wrapper.props().src).toEqual('document/url')
        })

        it('Should receive props httpHeader', () => {
            expect(wrapper.props().httpHeader).toEqual({ token: '123abcd456' })
        })

        it('Should have a default value to props httpHeader', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, downloadButton },
                attachTo: document.body,
            })
            expect(wrapper.props().httpHeader).toEqual({})
        })

        it('Should receive props downloadButton', () => {
            expect(wrapper.props().downloadButton).toBeTruthy()
        })

        it('Should receive props progressBar', () => {
            expect(wrapper.props().progressBar).toBeTruthy()
        })

        it('Should receive props rotateButton', () => {
            expect(wrapper.props().rotateButton).toBeTruthy()
        })

        it('Should receive props draggables', () => {
            expect(wrapper.props().draggables).toEqual(draggables)
        })

        it('Should have default value to draggables', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, downloadButton },
                attachTo: document.body,
            })
            expect(wrapper.props().draggables).toEqual([])
        })

        it('Should receive props initialDraggableWidth', () => {
            expect(wrapper.props().initialDraggableWidth).toBe(initialDraggableWidth)
        })

        it('Should receive props initialDraggableHeight', () => {
            expect(wrapper.props().initialDraggableHeight).toBe(initialDraggableHeight)
        })

        it('Should receive draggableLinkTooltip', () => {
            expect(wrapper.props().draggableLinkTooltip).toBe('link')
        })

        it('Should receive draggableUnlinkTooltip', () => {
            expect(wrapper.props().draggableUnlinkTooltip).toBe('unlink')
        })

        it('Should receive draggableDeleteTooltip', () => {
            expect(wrapper.props().draggableDeleteTooltip).toBe('delete')
        })
    })

    describe('Vue Lifecycle', () => {
        it('Should run start function when src is updated', async () => {
            wrapper.vm.start = jest.fn()
            wrapper.vm.$options.watch.src.call(wrapper.vm, 'document/url/2')
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.start).toHaveBeenCalledTimes(1)
        })

        it('Should start loading animation when run start function and stop when finish it', async () => {
            wrapper.vm.getPdfContainer = jest.fn()
            wrapper.vm.createEventBus = jest.fn()
            wrapper.vm.createPdfViewer = jest.fn()
            jest.spyOn(wrapper.vm, 'startLoadingPlaceHolderIfNecessary')
            jest.spyOn(wrapper.vm, 'stopLoadingPlaceHolder')
            wrapper.vm.start()
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.startLoadingPlaceHolderIfNecessary).toBeCalledTimes(1)
            expect(wrapper.vm.stopLoadingPlaceHolder).toBeCalledTimes(1)
        })

        it('Should register resize event listener', async () => {
            window.addEventListener = jest.fn()
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton, progressBar },
                attachTo: document.body,
            })
            await wrapper.vm.$nextTick()

            expect(window.addEventListener.mock.calls[0][0]).toEqual('resize')
        })

        it('Should remove resize event listener', async () => {
            window.removeEventListener = jest.fn()
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton, progressBar },
                attachTo: document.body,
            })
            wrapper.destroy()

            expect(window.removeEventListener.mock.calls[0][0]).toEqual('resize')
        })
    })

    describe('PDF Rendering', () => {
        it('Should execute getPdfContainer', () => {
            wrapper.vm.getPdfContainer()
            const container = wrapper.vm.pdf.container

            expect(container.getAttribute('class')).toEqual('Viewer')
            expect(container.firstChild.getAttribute('class')).toEqual('pdfViewer')
        })

        it('Should execute createEventBus', () => {
            wrapper.vm.pagesInitEventHandler = jest.fn()
            wrapper.vm.pageChangeEventHandler = jest.fn()
            wrapper.vm.createEventBus()

            expect(wrapper.vm.pagesInitEventHandler).toHaveBeenCalled()
            expect(wrapper.vm.pageChangeEventHandler).toHaveBeenCalled()
        })

        it('Should execute pagesInitEventHandler to "small screen"', () => {
            wrapper.vm.isSmallScreen = jest.fn().mockReturnValue(true)
            wrapper.vm.pagesInitEventHandler({
                source: {
                    currentPageNumber: 1,
                    currentScale: 1,
                    pagesCount: 10,
                },
            })

            expect(wrapper.vm.pagination).toEqual({ current: 1, total: 10 })
            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-width')
            expect(wrapper.vm.scale).toEqual({ default: 1 })
        })

        it('Should execute pagesInitEventHandler to "non small screen"', () => {
            wrapper.vm.isSmallScreen = jest.fn().mockReturnValue(false)
            wrapper.vm.pagesInitEventHandler({
                source: {
                    currentPageNumber: 1,
                    currentScale: 1,
                    pagesCount: 10,
                },
            })

            expect(wrapper.vm.pagination).toEqual({ current: 1, total: 10 })
            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-fit')
            expect(wrapper.vm.scale).toEqual({ default: 1 })
        })

        it('Should execute pageChangeEventHandler', () => {
            wrapper.vm.pageChangeEventHandler({ pageNumber: 100 })

            expect(wrapper.vm.pagination.current).toEqual(100)
        })

        it('Should execute createPdfViewer', () => {
            wrapper.vm.createPdfViewer()

            expect(typeof wrapper.vm.pdf.viewer.setDocument).toEqual('function')
        })

        it('Should execute createPdfLinkService', () => {
            wrapper.vm.createPdfLinkService()

            expect(typeof wrapper.vm.pdf.linkService.setDocument).toEqual('function')
            expect(typeof wrapper.vm.pdf.linkService.setViewer).toEqual('function')
        })
    })

    describe('Zoom control methods', () => {
        it('Should execute the zoomIn method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("zoomIn")\' ></button>' },
                },
            })
            wrapper.setData({
                pdf: {
                    viewer: {
                        currentScale: 1,
                    },
                },
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScale).toEqual(1.1)
        })

        it('Should execute the zoomOut method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("zoomOut")\' ></button>' },
                },
            })
            wrapper.setData({
                pdf: {
                    viewer: {
                        currentScale: 1,
                    },
                },
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScale).toEqual(1 / 1.1)
        })

        it('Should block zoomOut when scale is too small', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("zoomOut")\' ></button>' },
                },
            })
            wrapper.setData({
                pdf: {
                    viewer: {
                        currentScale: 0.2,
                    },
                },
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScale).toEqual(0.2)
        })

        it('Should execute changeScaleType method when has a default value', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("changeScaleType")\' ></button>' },
                },
            })
            wrapper.setData({
                scale: {
                    default: 1,
                },
                pdf: {
                    viewer: {
                        currentScale: 3,
                    },
                },
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-fit')
        })

        it('Should execute changeScaleType method when has any value', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("changeScaleType")\' ></button>' },
                },
            })
            wrapper.setData({
                scale: {
                    default: 1,
                    type: 'page-fit',
                },
                pdf: {
                    viewer: {
                        currentScale: 3,
                    },
                },
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-width')
        })

        it('Should execute rotate method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("rotate")\' ></button>' },
                },
            })
            wrapper.setData({
                pdf: {
                    viewer: {
                        pagesRotation: 0,
                    },
                },
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.pagesRotation).toEqual(90)
        })
    })

    describe('Download action', () => {
        it('Should execute the download action', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("download")\' ></button>' },
                },
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.emitted().download).toBeTruthy()
        })
    })

    describe('Draggable', () => {
        it('Should start creating draggable on call method startCreateDraggable and reset page configuration', () => {
            wrapper.vm.startCreateDraggable()

            expect(wrapper.vm.isCreatingDraggable).toBeTruthy()
            expect(wrapper.vm.pdf.viewer.pagesRotation).toBe(0)
        })

        it('Should emit create:draggable and turn isCreatingDraggable to false', () => {
            const draggable = {
                percentX: 0,
                percentY: 0,
                percentWidth: 0.5,
                percentHeight: 0.5,
                pageNumber: 1,
                id: 'draggable-item-spec-2',
            }
            const draggableWrapper = wrapper.find('[data-test="draggable"]')

            draggableWrapper.vm.$emit('create:draggable', { draggable })

            expect(wrapper.emitted('create:draggable')).toBeTruthy()
            expect(wrapper.emitted('create:draggable')[0][0].draggable).toEqual(draggable)
            expect(wrapper.vm.isCreatingDraggable).toBeFalsy()
        })

        it('Should emit update:draggable', () => {
            const draggableIndex = 0
            const draggable = draggables[draggableIndex]
            const draggableWrapper = wrapper.find('[data-test="draggable"]')

            draggableWrapper.vm.$emit('update:draggable', { draggable, draggableIndex })

            expect(wrapper.emitted('update:draggable')).toBeTruthy()
            expect(wrapper.emitted('update:draggable')[0][0].draggable).toEqual(draggable)
            expect(wrapper.emitted('update:draggable')[0][0].draggableIndex).toEqual(draggableIndex)
        })

        it('Should emit delete:draggable', () => {
            const draggableIndex = 0
            const draggable = draggables[draggableIndex]
            const draggableWrapper = wrapper.find('[data-test="draggable"]')

            draggableWrapper.vm.$emit('delete:draggable', { draggable, draggableIndex })

            expect(wrapper.emitted('delete:draggable')).toBeTruthy()
            expect(wrapper.emitted('delete:draggable')[0][0].draggable).toEqual(draggable)
            expect(wrapper.emitted('delete:draggable')[0][0].draggableIndex).toEqual(draggableIndex)
        })

        it('Should emit link:draggable', () => {
            const draggableIndex = 0
            const draggable = draggables[draggableIndex]
            const draggableWrapper = wrapper.find('[data-test="draggable"]')

            draggableWrapper.vm.$emit('link:draggable', { draggable, draggableIndex })

            expect(wrapper.emitted('link:draggable')).toBeTruthy()
            expect(wrapper.emitted('link:draggable')[0][0].draggable).toEqual(draggable)
            expect(wrapper.emitted('link:draggable')[0][0].draggableIndex).toEqual(draggableIndex)
        })

        it('Should emit unlink:draggable', () => {
            const draggableIndex = 0
            const draggable = draggables[draggableIndex]
            const draggableWrapper = wrapper.find('[data-test="draggable"]')

            draggableWrapper.vm.$emit('unlink:draggable', { draggable, draggableIndex })

            expect(wrapper.emitted('unlink:draggable')).toBeTruthy()
            expect(wrapper.emitted('unlink:draggable')[0][0].draggable).toEqual(draggable)
            expect(wrapper.emitted('unlink:draggable')[0][0].draggableIndex).toEqual(draggableIndex)
        })
    })

    describe('Method linkDraggablesByPageInterval', () => {
        let draggable, pageIntervalCallback

        beforeEach(() => {
            draggable = draggables[0]
            pageIntervalCallback = () => ({
                startPage: 1,
                endPage: 10,
            })
        })

        it('Should not throw any errors when startPage and endPage are valid', () => {
            wrapper.vm.$refs.draggableRef.linkDraggablesByPageInterval = jest.fn()
            wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapper.vm.$refs.draggableRef.linkDraggablesByPageInterval.mock.calls).toHaveLength(1)
        })

        it('Should throw error if pageIntervalCallback is null/undefined', () => {
            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, null)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if pageIntervalCallback is not a function', () => {
            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, { test: 1 })

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if pageIntervalCallback returns null/undefined', () => {
            pageIntervalCallback = () => null

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if startPage is null/undefined', () => {
            pageIntervalCallback = () => ({ endPage: 10 })

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if endPage is null/undefined', () => {
            pageIntervalCallback = () => ({ startPage: 1 })

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if startPage is < 1', () => {
            pageIntervalCallback = () => ({ startPage: 0, endPage: 10 })

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if startPage is > totalPages', () => {
            pageIntervalCallback = () => ({ startPage: 11, endPage: 10 })

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if endPage is < 1', () => {
            pageIntervalCallback = () => ({ startPage: 1, endPage: 0 })

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if endPage is > totalPages', () => {
            pageIntervalCallback = () => ({ startPage: 1, endPage: 11 })

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })

        it('Should throw error if startPage > endPage', () => {
            pageIntervalCallback = () => ({ startPage: 5, endPage: 4 })

            const wrapperCallback = () => wrapper.vm.linkDraggablesByPageInterval(draggable, pageIntervalCallback)

            expect(wrapperCallback).toThrow(Error)
        })
    })
})
