import Vue from 'vue'
import Vuetify from 'vuetify'
import Toolbar from './Toolbar'
import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

describe('Toolbar.spec.js', () => {
    let disableButtons,
        downloadButton,
        currentPage,
        rotateButton,
        scaleType,
        previousDocumentButton,
        previousDocumentButtonTooltip,
        nextDocumentButton,
        nextDocumentButtonTooltip,
        totalPages,
        hasNextDocument,
        hasPreviousDocument,
        scale,
        propsData,
        wrapper

    beforeEach(() => {
        disableButtons = true
        downloadButton = true
        currentPage = 10
        rotateButton = true
        scaleType = 'page-fit'
        previousDocumentButton = true
        previousDocumentButtonTooltip = 'tp1'
        nextDocumentButton = true
        nextDocumentButtonTooltip = 'tp2'
        totalPages = 20
        hasNextDocument = true
        hasPreviousDocument = true
        scale = 1.25

        propsData = {
            disableButtons,
            downloadButton,
            currentPage,
            rotateButton,
            scaleType,
            previousDocumentButton,
            previousDocumentButtonTooltip,
            nextDocumentButton,
            nextDocumentButtonTooltip,
            totalPages,
            hasNextDocument,
            hasPreviousDocument,
            scale
        }

        wrapper = shallowMount(Toolbar, {
            localVue,
            propsData
        })
    })

    describe('Props', () => {
        it('Should receive a currentPage', () => {
            expect(wrapper.props().currentPage).toEqual(currentPage)
        })

        it('Should have a default value to currentPage', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().currentPage).toBe(1)
        })

        it('Should receive a disableButtons', () => {
            expect(wrapper.props().disableButtons).toBeTruthy()
        })

        it('Should have a default value to disableButtons', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().disableButtons).toBeFalsy()
        })

        it('Should receive a downloadButton', () => {
            expect(wrapper.props().downloadButton).toBeTruthy()
        })

        it('Should have a default value to downloadButton', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().downloadButton).toBeFalsy()
        })

        it('Should receive a rotateButton', () => {
            expect(wrapper.props().rotateButton).toBeTruthy()
        })

        it('Should have a default value to rotateButton', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().rotateButton).toBeFalsy()
        })

        it('Should receive a previousDocumentButton', () => {
            expect(wrapper.props().previousDocumentButton).toBe(previousDocumentButton)
        })

        it('Should have a default value to previousDocumentButton', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().previousDocumentButton).toBe(false)
        })

        it('Should receive a previousDocumentButtonTooltip', () => {
            expect(wrapper.props().previousDocumentButtonTooltip).toBe(previousDocumentButtonTooltip)
        })

        it('Should have a default previousDocumentButtonTooltip', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().previousDocumentButtonTooltip).toBeTruthy()
        })

        it('Should receive a nextDocumentButton', () => {
            expect(wrapper.props().nextDocumentButton).toBe(nextDocumentButton)
        })

        it('Should have a default value to nextDocumentButton', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().nextDocumentButton).toBe(false)
        })

        it('Should receive a nextDocumentButtonTooltip', () => {
            expect(wrapper.props().nextDocumentButtonTooltip).toBe(nextDocumentButtonTooltip)
        })

        it('Should have a default nextDocumentButtonTooltip', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().nextDocumentButtonTooltip).toBeTruthy()
        })

        it('Should receive a totalPages', () => {
            expect(wrapper.props().totalPages).toEqual(totalPages)
        })

        it('Should have a default value to totalPages', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().totalPages).toBe(1)
        })

        it('Should receive a hasNextDocument', () => {
            expect(wrapper.props().hasNextDocument).toEqual(hasNextDocument)
        })

        it('Should have a default value to hasNextDocument', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().hasNextDocument).toBe(false)
        })

        it('Should receive a hasPreviousDocument', () => {
            expect(wrapper.props().hasPreviousDocument).toEqual(hasPreviousDocument)
        })

        it('Should have a default value to hasPreviousDocument', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().hasPreviousDocument).toBe(false)
        })

        it('Should receive a scale', () => {
            expect(wrapper.props().scale).toEqual(scale)
        })

        it('Should have a default value to scale', () => {
            wrapper = shallowMount(Toolbar, { localVue, propsData: { scaleType } })
            expect(wrapper.props().scale).toBe(1)
        })
    })

    describe('Template', () => {
        it('Should have previousDocument button', () => {
            let previousDocumentBtn = wrapper.find('[data-test="previousDocument"]')
            expect(previousDocumentBtn).toBeTruthy()
        })

        it('Should have previousPage button', () => {
            let previousPageBtn = wrapper.find('[data-test="previousPage"]')
            expect(previousPageBtn).toBeTruthy()
        })

        it('Should display pagination', () => {
            let pagination = wrapper.find('[data-test="pagination"]')
            expect(pagination.html()).toContain('de 20')
        })

        it('Should have nextPage button', () => {
            let nextPageBtn = wrapper.find('[data-test="nextPage"]')
            expect(nextPageBtn).toBeTruthy()
        })

        it('Should have nextDocument button', () => {
            let nextDocumentBtn = wrapper.find('[data-test="nextDocument"]')
            expect(nextDocumentBtn).toBeTruthy()
        })

        it('Should have a zoomOut button', () => {
            let zoomOutBtn = wrapper.find('[data-test="zoomOut"]')
            expect(zoomOutBtn).toBeTruthy()
        })

        it('Should have a zoomIn button', () => {
            let zoomInBtn = wrapper.find('[data-test="zoomIn"]')
            expect(zoomInBtn).toBeTruthy()
        })

        it('Should have a download button', () => {
            let downloadBtn = wrapper.find('[data-test="download"]')
            expect(downloadBtn).toBeTruthy()
        })

        it('Should have a rotate button', () => {
            let rotateBtn = wrapper.find('[data-test="rotate"]')
            expect(rotateBtn).toBeTruthy()
        })

        it('Should have a changeScaleType button', () => {
            let changeScaleType = wrapper.find('[data-test="changeScaleType"]')
            expect(changeScaleType.html()).toContain('mdi-arrow-expand-horizontal')

            wrapper = shallowMount(Toolbar, {
                localVue,
                propsData: {
                    scaleType: 'page-width',
                },
            })
            changeScaleType = wrapper.find('[data-test="changeScaleType"]')
            expect(changeScaleType.html()).toContain('mdi-arrow-expand-vertical')
        })

        it('Should disable the buttons', () => {
            expect(wrapper.find('[data-test="previousDocument"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="previousPage"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="nextPage"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="nextDocument"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="zoomOut"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="zoomIn"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="changeScaleType"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="download"]').html()).toContain('disabled="true"')
            expect(wrapper.find('[data-test="rotate"]').html()).toContain('disabled="true"')
        })
    })

    describe('Events', () => {
        it('Should emit an event on click at previousDocument button', () => {
            let previousDocumentBtn = wrapper.find('[data-test="previousDocument"]')
            previousDocumentBtn.vm.$emit('click')
            expect(wrapper.emitted().previousDocument).toBeTruthy()
        })

        it('Should emit an event on click at previousPage button', () => {
            let previousPageBtn = wrapper.find('[data-test="previousPage"]')
            previousPageBtn.vm.$emit('click')
            expect(wrapper.emitted().previousPage).toBeTruthy()
        })

        it('Should emit an event on click at nextPage button', () => {
            let nextPageBtn = wrapper.find('[data-test="nextPage"]')
            nextPageBtn.vm.$emit('click')
            expect(wrapper.emitted().nextPage).toBeTruthy()
        })

        it('Should emit an event on click at nextDocument button', () => {
            let nextDocumentBtn = wrapper.find('[data-test="nextDocument"]')
            nextDocumentBtn.vm.$emit('click')
            expect(wrapper.emitted().nextDocument).toBeTruthy()
        })

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

        it('Should emit an event on click at resetScale tooltip', () => {
            propsData.disableButtons = false
            wrapper = shallowMount(Toolbar, {
                localVue,
                propsData,
                stubs: {
                    'v-tooltip': {
                        template: `
                            <div>
                                <slot name="activator" :on="{ click: () => {} }"></slot>
                                <slot name="default"></slot>
                            </div>
                        `
                    }
                }
            })

            let resetScaleTooltip = wrapper.find('[data-test="resetScale"]')
            resetScaleTooltip.trigger('click')
            expect(wrapper.emitted().resetScale).toBeTruthy()
        })

        it('Should emit an event on click at download button', () => {
            let downloadBtn = wrapper.find('[data-test="download"]')
            downloadBtn.vm.$emit('click')
            expect(wrapper.emitted().download).toBeTruthy()
        })

        it('Should emit an event on click at rotate button', () => {
            let rotateBtn = wrapper.find('[data-test="rotate"]')
            rotateBtn.vm.$emit('click')
            expect(wrapper.emitted().rotate).toBeTruthy()
        })
    })
})
