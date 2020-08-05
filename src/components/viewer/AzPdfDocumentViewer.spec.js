import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'regenerator-runtime'
import 'pdfjs-dist/build/pdf'
import 'pdfjs-dist/web/pdf_viewer.js'
import AzPdfDocumentViewer from './AzPdfDocumentViewer'
import { createLocalVue, shallowMount } from '@vue/test-utils'

jest.mock('pdfjs-dist/build/pdf', () => ({
    getDocument: jest.fn(() => Promise.resolve(true))
}))

jest.mock('pdfjs-dist/web/pdf_viewer.js', () => ({
    PDFJS: {
        EventBus: jest.fn(() => ({
            on: jest.fn().mockImplementation((e, cb) =>
                cb({
                    source: {
                        currentPageNumber: 1,
                        currentScale: 1,
                        pagesCount: 10
                    },
                    scale: 1,
                    pageNumber: 2
                })
            )
        })),

        PDFViewer: jest.fn(() => ({
            setDocument: jest.fn()
        }))
    }
}))

const localVue = createLocalVue()
Vue.use(Vuetify)
Vue.use(Vuex)

describe('AzPdfDocumentViewer.spec.js', () => {
    let src, httpHeader, downloadButton, progressBar, rotateButton, wrapper

    beforeEach(() => {
        src = 'document/url'
        httpHeader = { token: '123abcd456' }
        downloadButton = true
        progressBar = true
        rotateButton = true

        wrapper = shallowMount(AzPdfDocumentViewer, {
            localVue,
            propsData: {
                src,
                httpHeader,
                downloadButton,
                progressBar,
                rotateButton
            },
            attachTo: document.body
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
                attachTo: document.body
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
                attachTo: document.body
            })
            await wrapper.vm.$nextTick()

            expect(window.addEventListener.mock.calls[0][0]).toEqual('resize')
        })

        it('Should remove resize event listener', async () => {
            window.removeEventListener = jest.fn()
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton, progressBar },
                attachTo: document.body
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
            wrapper.vm.scaleChangeEventHandler = jest.fn()
            wrapper.vm.pageChangeEventHandler = jest.fn()
            wrapper.vm.createEventBus()

            expect(wrapper.vm.pagesInitEventHandler).toHaveBeenCalled()
            expect(wrapper.vm.scaleChangeEventHandler).toHaveBeenCalled()
            expect(wrapper.vm.pageChangeEventHandler).toHaveBeenCalled()
        })

        it('Should execute pagesInitEventHandler to "small screen"', () => {
            wrapper.vm.isSmallScreen = jest.fn().mockReturnValue(true)
            wrapper.vm.pagesInitEventHandler({
                source: {
                    currentPageNumber: 1,
                    currentScale: 1,
                    pagesCount: 10
                }
            })

            expect(wrapper.vm.pagination).toEqual({ current: 1, total: 10 })
            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-width')
            expect(wrapper.vm.scale).toEqual({ current: 1, default: 1 })
        })

        it('Should execute pagesInitEventHandler to "non small screen"', () => {
            wrapper.vm.isSmallScreen = jest.fn().mockReturnValue(false)
            wrapper.vm.pagesInitEventHandler({
                source: {
                    currentPageNumber: 1,
                    currentScale: 1,
                    pagesCount: 10
                }
            })

            expect(wrapper.vm.pagination).toEqual({ current: 1, total: 10 })
            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-fit')
            expect(wrapper.vm.scale).toEqual({ current: 1, default: 1 })
        })

        it('Should execute scaleChangeEventHandler', () => {
            wrapper.vm.scaleChangeEventHandler({ scale: 10 })

            expect(wrapper.vm.scale.current).toEqual(10)
        })

        it('Should execute pageChangeEventHandler', () => {
            wrapper.vm.pageChangeEventHandler({ pageNumber: 100 })

            expect(wrapper.vm.pagination.current).toEqual(100)
        })

        it('Should execute createPdfViewer', () => {
            wrapper.vm.createPdfViewer()

            expect(typeof wrapper.vm.pdf.viewer.setDocument).toEqual('function')
        })
    })

    describe('Zoom control methods', () => {
        it('Should execute the zoomIn method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("zoomIn")\' ></button>' }
                }
            })
            wrapper.setData({
                scale: {
                    current: 1
                },
                pdf: {
                    viewer: {
                        currentScale: 1
                    }
                }
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScale).toEqual(1.1)
        })

        it('Should execute the zoomOut method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("zoomOut")\' ></button>' }
                }
            })
            wrapper.setData({
                scale: {
                    current: 1
                },
                pdf: {
                    viewer: {
                        currentScale: 1
                    }
                }
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScale).toEqual(1 / 1.1)
        })

        it('Should block zoomOut when scale is too small', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("zoomOut")\' ></button>' }
                }
            })
            wrapper.setData({
                scale: {
                    current: 0.2
                },
                pdf: {
                    viewer: {
                        currentScale: 0.2
                    }
                }
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScale).toEqual(0.2)
        })

        it('Should execute changeScaleType method when has a default value', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("changeScaleType")\' ></button>' }
                }
            })
            wrapper.setData({
                scale: {
                    default: 1
                },
                pdf: {
                    viewer: {
                        currentScale: 3
                    }
                }
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-fit')
        })

        it('Should execute changeScaleType method when has any value', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("changeScaleType")\' ></button>' }
                }
            })
            wrapper.setData({
                scale: {
                    default: 1,
                    type: 'page-fit'
                },
                pdf: {
                    viewer: {
                        currentScale: 3
                    }
                }
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.vm.pdf.viewer.currentScaleValue).toEqual('page-width')
        })

        it('Should execute rotate method', () => {
            wrapper = shallowMount(AzPdfDocumentViewer, {
                localVue,
                propsData: { src, httpHeader, downloadButton },
                stubs: {
                    Toolbar: { template: '<button @click=\'$emit("rotate")\' ></button>' }
                }
            })
            wrapper.setData({
                pdf: {
                    viewer: {
                        pagesRotation: 0
                    }
                }
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
                    Toolbar: { template: '<button @click=\'$emit("download")\' ></button>' }
                }
            })
            wrapper.find('button').trigger('click')

            expect(wrapper.emitted().download).toBeTruthy()
        })
    })
})
