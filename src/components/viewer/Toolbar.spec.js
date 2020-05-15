import Vue from 'vue'
import Vuetify from 'vuetify'
import Toolbar from './Toolbar'
import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('Toolbar.spec.js', () => {
    let downloadButton, pagination, wrapper

    beforeEach(() => {
        downloadButton = true
        pagination = {
            current: 1,
            total: 3
        }
        wrapper = shallowMount(Toolbar, {
            localVue,
            propsData: {
                downloadButton,
                pagination
            }
        })
    })

    describe('Props', () => {
        it('Should receive a pagination', () => {
            expect(wrapper.props().pagination).toEqual(pagination)
        })

        it('Should have a default value to pagination', () => {
            wrapper = shallowMount(Toolbar, { localVue })
            expect(wrapper.props().pagination).toEqual({ current: '-', total: '-' })
        })

        it('Should receive a downloadButton', () => {
            expect(wrapper.props().pagination).toBeTruthy()
        })

        it('Should have a default value to downloadButton', () => {
            wrapper = shallowMount(Toolbar, { localVue })
            expect(wrapper.props().downloadButton).toBeFalsy()
        })
    })

    describe('Template', () => {
        it('Shoud display pagination', () => {
            let pagination = wrapper.find('[data-test="pagination"]')
            expect(pagination.html()).toContain('1 / 3')
        })

        it('Should have a zoomOut button', () => {
            let zoomOutBtn = wrapper.find('[data-test="resetZoom"]')
            expect(zoomOutBtn).toBeTruthy()
        })

        it('Should have a zoomIn button', () => {
            let zoomInBtn = wrapper.find('[data-test="zoomIn"]')
            expect(zoomInBtn).toBeTruthy()
        })

        it('Should have a resetZoom button', () => {
            expect(wrapper.find('[data-test="resetZoom"]')).toBeTruthy()
        })
    })

    describe('Events', () => {
        it('Should emit an event on click at zoomOut button', () => {
            let zoomOutBtn = wrapper.find('[data-test="zoomOut"]')
            zoomOutBtn.vm.$emit('click')
            expect(wrapper.emitted().zoomOut).toBeTruthy()
        })

        it('Shoud emit an event on click at zoomIn button', () => {
            let zoomInBtn = wrapper.find('[data-test="zoomIn"]')
            zoomInBtn.vm.$emit('click')
            expect(wrapper.emitted().zoomIn).toBeTruthy()
        })

        it('Should emit an event on click at resetZoom button', () => {
            let resetZoomBtn = wrapper.find('[data-test="resetZoom"]')
            resetZoomBtn.vm.$emit('click')
            expect(wrapper.emitted().resetZoom).toBeTruthy()
        })
    })
})
