import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'pdfjs-dist/build/pdf'
import AzPdfDocumentViewer from './AzPdfDocumentViewer'
import AzPdfDocumentViewerToolbar from './AzPdfDocumentViewerToolbar'
import AzPdfDocumentViewerPage from './AzPdfDocumentViewerPage'
import { actionTypes } from '../../../src/store'
import { createLocalVue, shallowMount } from '@vue/test-utils'

jest.mock('pdfjs-dist/build/pdf')
const localVue = createLocalVue()
Vue.use(Vuetify)
Vue.use(Vuex)

describe('AzPdfDocumentViewer.spec.js', () => {
    let src, wrapper, store, state, getters, actions

    beforeEach(async () => {
        state = {
            document: {
                pageContainer: {
                    height: 1,
                    width: 1
                },
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
            pageContainer: jest.fn().mockReturnValue({ height: 1, width: 1 }),
            pages: jest.fn().mockReturnValue(state.document.pages),
            scale: jest.fn().mockReturnValue(1),
            totalPageNum: jest.fn().mockReturnValue(3)
        }

        actions = {
            [actionTypes.DOCUMENT.FETCH_DOCUMENT]: jest.fn(),
            [actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER]: jest.fn(),
            [actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM]: jest.fn(),
            [actionTypes.DOCUMENT.DECREASE_SCALE]: jest.fn(),
            [actionTypes.DOCUMENT.INCREASE_SCALE]: jest.fn(),
            [actionTypes.DOCUMENT.RESTORE_SCALE]: jest.fn(),
            [actionTypes.DOCUMENT.RENDER_PAGE]: jest.fn(),
            [actionTypes.DOCUMENT.CLEAR_RENDER_CONTEXT]: jest.fn(),
            [actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES]: jest.fn(),
            [actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES]: jest.fn(),
            [actionTypes.DOCUMENT.CALCULATE_SCALE]: jest.fn()
        }

        store = new Vuex.Store({ state, getters, actions })
        src = 'document/url'
        wrapper = shallowMount(AzPdfDocumentViewer, {
            localVue,
            store,
            propsData: { src },
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

        it('Should access pageContainer.height', () => {
            expect(wrapper.vm.pageHeight).toBe(store.getters.pageContainer.height)
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

    describe('Pagination handling methods', () => {
        it('Should exist a scroll handler method', async () => {
            await expect(typeof wrapper.vm.handleScroll).toBe('function')
        })

        it('Should update current page number', async () => {
            let e = {
                target: {
                    scrollTop: 2
                }
            }
            wrapper.vm.needRenderNextPage = jest.fn().mockReturnValue(false)
            wrapper.vm.needRenderPreviousPage = jest.fn().mockReturnValue(false)
            wrapper.vm.validatePageChange = jest.fn().mockReturnValue(true)
            await wrapper.vm.handleScroll(e)
            await wrapper.vm.$nextTick()

            expect(actions[actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM].mock.calls[0][1]).toBe(3)
        })

        it('Should render next page', async () => {
            let e = {
                target: {
                    scrollTop: 2
                }
            }
            wrapper.vm.needRenderNextPage = jest.fn().mockReturnValue(true)
            wrapper.vm.needRenderPreviousPage = jest.fn().mockReturnValue(false)
            wrapper.vm.validatePageChange = jest.fn().mockReturnValue(false)
            wrapper.vm.pagesCanvasContext = {
                '2': { pageNum: 2, canvasContext: {} }
            }
            await wrapper.vm.handleScroll(e)
            await wrapper.vm.$nextTick()

            expect(actions[actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES].mock.calls[0][1]).toBe(2)
            expect(actions[actionTypes.DOCUMENT.RENDER_PAGE].mock.calls[0][1]).toEqual({
                pageNum: 2,
                canvasContext: {}
            })
        })

        it('Should render previous page', async () => {
            let e = {
                target: {
                    scrollTop: 2
                }
            }
            wrapper.vm.needRenderNextPage = jest.fn().mockReturnValue(false)
            wrapper.vm.needRenderPreviousPage = jest.fn().mockReturnValue(true)
            wrapper.vm.validatePageChange = jest.fn().mockReturnValue(false)
            wrapper.vm.pagesCanvasContext = {
                '0': { pageNum: 0, canvasContext: {} }
            }
            await wrapper.vm.handleScroll(e)
            await wrapper.vm.$nextTick()

            expect(actions[actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES].mock.calls[0][1]).toBe(0)
            expect(actions[actionTypes.DOCUMENT.RENDER_PAGE].mock.calls[0][1]).toEqual({
                pageNum: 0,
                canvasContext: {}
            })
        })
    })
})
