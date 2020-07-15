import Vue from 'vue'
import Vuetify from 'vuetify'
import Toolbar from './Toolbar'
import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('Toolbar.spec.js', () => {
    let disableButtons, downloadButton, pagination, wrapper

    beforeEach(() => {
        disableButtons = true
        downloadButton = true
        pagination = {
            current: 1,
            total: 3
        }
        wrapper = shallowMount(Toolbar, {
            localVue,
            propsData: {
                disableButtons,
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

        it('Should receive a disableButtons', () => {
            expect(wrapper.props().disableButtons).toBeTruthy()
        })

        it('Should have a default value to disableButtons', () => {
            wrapper = shallowMount(Toolbar, { localVue })
            expect(wrapper.props().disableButtons).toBeFalsy()
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
            let zoomOutBtn = wrapper.find('[data-test="zoomOut"]')
            expect(zoomOutBtn).toBeTruthy()
        })

        it('Should have a zoomIn button', () => {
            let zoomInBtn = wrapper.find('[data-test="zoomIn"]')
            expect(zoomInBtn).toBeTruthy()
        })

        it('Should have a changeScaleType button', () => {
            const changeScaleType = wrapper.find('[data-test="changeScaleType"]')
            expect(changeScaleType).toBeTruthy()
        })

        it('Should disable the buttons', () => {
            expect(wrapper.find('[data-test="zoomOut"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="zoomIn"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="changeScaleType"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="download"]').html()).toContain('disabled="true"')
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

        it('Should emit an event on click at changeScaleType button', () => {
            let changeScaleTypeBtn = wrapper.find('[data-test="changeScaleType"]')
            changeScaleTypeBtn.vm.$emit('click')
            expect(wrapper.emitted().changeScaleType).toBeTruthy()
        })
    })
})
