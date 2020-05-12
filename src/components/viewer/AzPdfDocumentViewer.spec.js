import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'pdfjs-dist/build/pdf'
import 'scrollmonitor'
import AzPdfDocumentViewer from './AzPdfDocumentViewer'
import AzPdfDocumentViewerToolbar from './AzPdfDocumentViewerToolbar'
import AzPdfDocumentViewerPage from './AzPdfDocumentViewerPage'
import { actionTypes } from '../../../src/store'
import { createLocalVue, shallowMount } from '@vue/test-utils'

jest.mock('pdfjs-dist/build/pdf')
jest.mock('scrollmonitor', () => ({
    createContainer: jest.fn().mockReturnValue({
        create: jest.fn().mockReturnValue({
            enterViewport: jest.fn(cb => cb()),
            fullyEnterViewport: jest.fn(cb => cb())
        })
    })
}))
const localVue = createLocalVue()
Vue.use(Vuetify)
Vue.use(Vuex)

describe('AzPdfDocumentViewer.spec.js', () => {
    let src, downloadButton, wrapper, store, state, getters, actions

    beforeEach(async () => {
        state = {
            document: {
                filename: 'NomeDoArquivo.pdf',
                pageContainer: [],
                pages: [{ pageIndex: 0 }, { pageIndex: 1 }, { pageIndex: 2 }],
                paginator: {
                    currentPageNum: 1,
                    totalPageNum: 1
                },
                scale: {
                    current: 1.0,
                    default: 1.0,
                    max: 3.0
                },
                renderedPages: []
            }
        }

        getters = {
            currentPageNum: jest.fn().mockReturnValue(1),
            filename: jest.fn().mockReturnValue(state.document.filename),
            pageContainer: jest.fn().mockReturnValue(state.document.pageContainer),
            pages: jest.fn().mockReturnValue(state.document.pages),
            renderedPages: jest.fn().mockReturnValue(state.document.renderedPages),
            scale: jest.fn().mockReturnValue(1),
            totalPageNum: jest.fn().mockReturnValue(3)
        }

        actions = {
            [actionTypes.DOCUMENT.FETCH_DOCUMENT]: jest.fn(),
            [actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER]: jest.fn(),
            [actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM]: jest.fn(),
            [actionTypes.DOCUMENT.DECREASE_SCALE]: jest.fn(),
            [actionTypes.DOCUMENT.DOWNLOAD]: jest.fn(),
            [actionTypes.DOCUMENT.INCREASE_SCALE]: jest.fn(),
            [actionTypes.DOCUMENT.RESTORE_SCALE]: jest.fn(),
            [actionTypes.DOCUMENT.RENDER_PAGE]: jest.fn(),
            [actionTypes.DOCUMENT.CLEAR_RENDER_CONTEXT]: jest.fn(),
            [actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES]: jest.fn(),
            [actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES]: jest.fn(page => state.document.renderedPages.push(page)),
            [actionTypes.DOCUMENT.CALCULATE_SCALE]: jest.fn()
        }

        store = new Vuex.Store({ state, getters, actions })
        src = 'document/url'
        downloadButton = true
        wrapper = shallowMount(AzPdfDocumentViewer, {
            localVue,
            store,
            propsData: { src, downloadButton },
            attachToDocument: true
        })
        await wrapper.vm.$nextTick()
    })

    describe('Rendered components and props', () => {
        it('Should be a Vue instance', () => {
            expect(wrapper.isVueInstance()).toBeTruthy()
        })

        it('Should receive props src', () => {
            expect(wrapper.props().src).toBe(src)
        })

        it('Should receive props downloadButton', () => {
            expect(wrapper.props().downloadButton).toBe(downloadButton)
        })

        it('Should have a AzPdfDocumentViewerToolbar component', () => {
            let toolbar = wrapper.find(AzPdfDocumentViewerToolbar)
            expect(toolbar.exists()).toBeTruthy()
        })

        it('Should have a documentContainer div', () => {
            let documentContainer = wrapper.find('#-documentContainer')
            expect(documentContainer.is('div')).toBeTruthy()
        })

        it('Should have a AzPdfDocumentViewerPage component with the same pages amount of the pdf', () => {
            let pages = wrapper.findAll(AzPdfDocumentViewerPage)
            expect(pages.exists()).toBeTruthy()
            expect(pages).toHaveLength(3)
        })
    })

    describe('Vue Lifecycle', () => {
        it('Should clear render context and load the document on the watch method', async () => {
            wrapper.vm.$options.watch.computedSrc.call(wrapper.vm, 'document/url')
            await wrapper.vm.$nextTick()

            expect(actions[actionTypes.DOCUMENT.CLEAR_RENDER_CONTEXT]).toHaveBeenCalledTimes(1)
            expect(actions[actionTypes.DOCUMENT.FETCH_DOCUMENT].mock.calls[0][1]).toEqual({
                src: 'document/url',
                httpHeader: {}
            })
        })
    })

    describe('Vuex state access', () => {
        it('Should access currentPageNum', () => {
            expect(wrapper.vm.currentPage).toBe(store.getters.currentPageNum)
        })

        it('Should access filename', () => {
            expect(wrapper.vm.filename).toBe(store.getters.filename)
        })

        it('Should access pages', () => {
            expect(wrapper.vm.pages).toBe(store.getters.pages)
        })

        it('Should access pageContainer', () => {
            expect(wrapper.vm.pageSize).toBe(store.getters.pageContainer)
        })

        it('Should access totalPageNum', () => {
            expect(wrapper.vm.totalPages).toBe(store.getters.totalPageNum)
        })
    })

    describe('Zoom control methods', () => {
        it('Should execute the resolveEventZoomIn method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                store,
                propsData: { src },
                stubs: {
                    AzPdfDocumentViewerToolbar: '<button @click=\'$emit("zoomIn")\' ></button>'
                }
            })
            wrapper.find('button').trigger('click')

            expect(actions[actionTypes.DOCUMENT.INCREASE_SCALE].mock.calls).toHaveLength(1)
        })

        it('Should execute the resolveEventZoomOut method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                store,
                propsData: { src },
                stubs: {
                    AzPdfDocumentViewerToolbar: '<button @click=\'$emit("zoomOut")\' ></button>'
                }
            })
            wrapper.find('button').trigger('click')

            expect(actions[actionTypes.DOCUMENT.DECREASE_SCALE].mock.calls).toHaveLength(1)
        })

        it('Should execute the resolveEventResetZoom method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                store,
                propsData: { src },
                stubs: {
                    AzPdfDocumentViewerToolbar: '<button @click=\'$emit("resetZoom")\' ></button>'
                }
            })
            wrapper.find('button').trigger('click')

            expect(actions[actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES]).toHaveBeenCalledTimes(1)
        })

        it('Should execute the saveCanvasContext method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                store,
                propsData: { src },
                stubs: {
                    AzPdfDocumentViewerPage:
                        '<button @click=\'$emit("mounted",{ pageNum: 1, canvasContext: {} })\'></button>'
                }
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pagesCanvasContext).toEqual({
                '1': { pageNum: 1, canvasContext: {} }
            })
        })
    })

    describe('Download action', () => {
        it('Should execute the download action', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                store,
                propsData: { src, downloadButton },
                stubs: {
                    AzPdfDocumentViewerToolbar: '<button @click=\'$emit("download")\' ></button>'
                }
            })
            wrapper.find('button').trigger('click')

            expect(actions[actionTypes.DOCUMENT.DOWNLOAD]).toHaveBeenCalled()
        })
    })

    describe('Pagination handling methods', () => {
        it('Should exist a scroll handler method', async () => {
            await expect(typeof wrapper.vm.handleScroll).toBe('function')
        })

        it('Should update current page number', async () => {
            wrapper.vm.needRenderNextPage = jest.fn().mockReturnValue(false)
            wrapper.vm.needRenderPreviousPage = jest.fn().mockReturnValue(false)
            wrapper.vm.validatePageChange = jest.fn(visiblePageNum => visiblePageNum === 2)
            await wrapper.vm.handleScroll()
            await wrapper.vm.$nextTick()

            expect(actions[actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM].mock.calls[0][1]).toBe(2)
        })

        it('Should render next page', async () => {
            wrapper.vm.needRenderCurrentPage = jest.fn().mockReturnValue(false)
            wrapper.vm.needRenderPreviousPage = jest.fn().mockReturnValue(false)
            wrapper.vm.validatePageChange = jest.fn().mockReturnValue(false)
            wrapper.vm.pagesCanvasContext = {
                '2': { pageNum: 2, canvasContext: {} }
            }
            await wrapper.vm.handleScroll()
            await wrapper.vm.$nextTick()

            expect(actions[actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES].mock.calls[0][1]).toBe(2)
            expect(actions[actionTypes.DOCUMENT.RENDER_PAGE].mock.calls[0][1]).toEqual({
                pageNum: 2,
                canvasContext: {}
            })
        })

        it('Should render previous page', async () => {
            getters.currentPageNum = jest.fn().mockReturnValue(2)
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                store: new Vuex.Store({ state, getters, actions }),
                propsData: { src, downloadButton },
                attachToDocument: true
            })
            wrapper.vm.needRenderCurrentPage = jest.fn().mockReturnValue(false)
            wrapper.vm.needRenderNextPage = jest.fn().mockReturnValue(false)
            wrapper.vm.validatePageChange = jest.fn().mockReturnValue(false)
            wrapper.vm.pagesCanvasContext = {
                '1': { pageNum: 1, canvasContext: {} }
            }
            await wrapper.vm.handleScroll()
            await wrapper.vm.$nextTick()

            expect(actions[actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES].mock.calls[0][1]).toBe(1)
            expect(actions[actionTypes.DOCUMENT.RENDER_PAGE].mock.calls[0][1]).toEqual({
                pageNum: 1,
                canvasContext: {}
            })
        })

        it('Should scroll to first page', async () => {
            wrapper.vm.getDocumentContainer().scrollTop = 14
            expect(wrapper.vm.getDocumentContainer().scrollTop).toBe(14)

            wrapper.vm.scrollToFirstPage()
            expect(wrapper.vm.getDocumentContainer().scrollTop).toBe(0)
        })
    })
})
