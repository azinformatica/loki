import Vue from 'vue'
import Vuetify from 'vuetify'
import AzPdfDocumentViewerToolbar from './AzPdfDocumentViewerToolbar'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('AzPdfDocumentViewerToolbar.spec.js', () => {
    let currentPage, totalPages, wrapper

    beforeEach(() => {
        currentPage = 1
        totalPages = 3
        wrapper = mount(AzPdfDocumentViewerToolbar, {
            localVue,
            propsData: { currentPage, totalPages }
        })
    })

    it('Should be a Vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    })

    it('Received a currentPage', () => {
        expect(wrapper.props().currentPage).toBe(currentPage)
    })

    it('Received a totalPages props', () => {
        expect(wrapper.props().totalPages).toBe(totalPages)
    })

    it('Should have a zoomOut button', () => {
        let zoomOutBtn = wrapper.find('[data-test="zoomOut"]')
        expect(zoomOutBtn).toBeTruthy()
    })

    it('Should emit an event on click at zoomOut button', () => {
        let zoomOutBtn = wrapper.find('[data-test="zoomOut"]')
        zoomOutBtn.trigger('click')
        expect(wrapper.emitted().zoomOut).toBeTruthy()
    })

    it('Should have a zoomIn button', () => {
        let zoomInBtn = wrapper.find('[data-test="zoomIn"]')
        expect(zoomInBtn).toBeTruthy()
    })

    it('Shoud emit an event on click at zoomIn button', () => {
        let zoomInBtn = wrapper.find('[data-test="zoomIn"]')
        zoomInBtn.trigger('click')
        expect(wrapper.emitted().zoomIn).toBeTruthy()
    })

    it('Should have a resetZoom button', () => {
        expect(wrapper.find('[data-test="resetZoom"]')).toBeTruthy()
    })

    it('Should emit an event on click at resetZoom button', () => {
        let resetZoomBtn = wrapper.find('[data-test="resetZoom"]')
        resetZoomBtn.trigger('click')
        expect(wrapper.emitted().resetZoom).toBeTruthy()
    })
})
