import Vue from 'vue'
import Vuetify from 'vuetify'
import AzPdfDocumentViewerPage from '../../../src/components/viewer/AzPdfDocumentViewerPage'
import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('AzPdfDocumentViewerPage.vue', () => {
  let wrapper, pageNum, pageSize

  beforeEach(() => {
    pageNum = 1
    pageSize = { height: 100, width: 100 }
    wrapper = shallowMount(AzPdfDocumentViewerPage, {
      localVue,
      propsData: { pageNum, pageSize }
    })
  })

  describe('Rendering and props', () => {
    it('Should be a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy()
    })

    it('Should receive a pageNum props', () => {
      expect(wrapper.props().pageNum).toBe(pageNum)
    })

    it('Should receive a pageSize props', () => {
      expect(wrapper.props().pageSize).toBe(pageSize)
    })

    it('Should have a div with page identification and dimensions', () => {
      let page = wrapper.find('div')
      expect(page.attributes('id')).toBe('page1')
      expect(page.attributes('height')).toBe(String(pageSize.height))
      expect(page.attributes('width')).toBe(String(pageSize.width))
    })

    it('Should have a canvas with page dimensions', () => {
      let canvas = wrapper.find('canvas')
      expect(canvas.attributes('height')).toBe(String(pageSize.height))
      expect(canvas.attributes('width')).toBe(String(pageSize.width))
    })
  })

  describe('Methods', () => {
    it('Should return the canvas context', () => {
      let canvas = document.createElement('canvas')
      canvas.setAttribute('width', pageSize.width)
      canvas.setAttribute('height', pageSize.height)

      let pageContainer = document.createElement('div')
      pageContainer.setAttribute('id', 'page1')
      pageContainer.setAttribute('width', pageSize.width)
      pageContainer.setAttribute('height', pageSize.height)
      pageContainer.appendChild(canvas)

      document.body.appendChild(pageContainer)

      // this mock prevent to raise error on not implemented function getCanvasContext()
      window.HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
        width: pageSize.width,
        height: pageSize.height
      })

      let context = wrapper.vm.getCanvasContext()
      expect(context.height).toEqual(pageSize.height)
      expect(context.width).toEqual(pageSize.width)
    })
  })

  describe('Watchers', () => {
    it('Should emit an event with pageNum and canvasContext', () => {
      let newPageSize = { height: 200, width: 200 }

      let canvas = document.createElement('canvas')
      canvas.setAttribute('width', pageSize.width)
      canvas.setAttribute('height', pageSize.height)

      let pageContainer = document.createElement('div')
      pageContainer.setAttribute('id', 'page1')
      pageContainer.setAttribute('width', pageSize.width)
      pageContainer.setAttribute('height', pageSize.height)
      pageContainer.appendChild(canvas)

      document.body.appendChild(pageContainer)

      // this mock prevent to raise error on not implemented function getCanvasContext()
      window.HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
        width: newPageSize.width,
        height: newPageSize.height
      })

      wrapper.vm.$options.watch.pageSize.call(wrapper.vm, newPageSize)
      expect(wrapper.emitted('resize')).toBeTruthy()
      expect(wrapper.emitted('resize')[0][0]).toEqual({ pageNum, canvasContext: newPageSize })
    })
  })
})
