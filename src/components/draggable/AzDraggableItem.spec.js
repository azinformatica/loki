import Vue from 'vue'
import Vuetify from 'vuetify'
import AzDraggableItem from './AzDraggableItem'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import DraggableUtil from '@/components/draggable/DraggableUtil'

const localVue = createLocalVue()
Vue.use(Vuetify)

const getRectFromElementAttributes = (element) => {
    return DraggableUtil.getRectFromElementAttributes(element)
}

const createRect = (x, y, width, height) => {
    return { x, y, width, height }
}

const createDefaultProps = () => {
    return {
        id: 'draggable-item-spec',
        targetZoneItemId: 'target-zone-item-id-spec',
        rect: createRect(5, 5, 100, 100),
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzDraggableItem, options)
}

const configureMutationObserver = () => {
    global.MutationObserver = jest.fn(function MutationObserver() {
        this.observe = jest.fn()
        this.disconnect = jest.fn()
    })
}

const configureResizeObserver = () => {
    global.ResizeObserver = jest.fn(function ResizeObserver() {
        this.observe = jest.fn()
        this.unobserve = jest.fn()
        this.disconnect = jest.fn()
    })
}

configureMutationObserver()
configureResizeObserver()

describe('AzDraggableItem.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData })
    })

    describe('Props', () => {
        it('Should receive id', () => {
            expect(wrapper.props().id).toEqual(propsData.id)
        })

        it('Should receive targetZoneItemId', () => {
            expect(wrapper.props().targetZoneItemId).toBe(propsData.targetZoneItemId)
        })

        it('Should have a default value to targetZoneItemId', () => {
            propsData.targetZoneItemId = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().targetZoneItemId).toBe('')
        })

        it('Should receive rect', () => {
            expect(wrapper.props().rect).toStrictEqual(propsData.rect)
        })

        it('Should have a default value to rect', () => {
            propsData.rect = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().rect).toBeNull()
        })
    })

    describe('Computed', () => {
        it('Should transform and apply styles according to rect properties', () => {
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.updateElementStyle()
            const expectedHeightString = `${propsData.rect.height}px`
            const expectedWidthString = `${propsData.rect.width}px`
            const rect = getRectFromElementAttributes(wrapper.vm.$el)
            expect(rect.x).toBe(propsData.rect.x)
            expect(rect.y).toBe(propsData.rect.y)
            expect(rect.width).toBe(propsData.rect.width)
            expect(rect.height).toBe(propsData.rect.height)
            expect(wrapper.vm.$el.style.height).toEqual(expectedHeightString)
            expect(wrapper.vm.$el.style.width).toEqual(expectedWidthString)
        })

        it('Should not transform or apply styles if rect was not informed', () => {
            propsData.rect = undefined
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.updateElementStyle()
            DraggableUtil.RECT_ATTRIBUTES.forEach((attribute) => {
                expect(wrapper.vm.$el.getAttribute(attribute)).toBeNull()
            })
            const rect = getRectFromElementAttributes(wrapper.vm.$el)
            expect(rect.x).toBe(0)
            expect(rect.y).toBe(0)
            expect(rect.width).toBe(0)
            expect(rect.height).toBe(0)
            expect(wrapper.vm.$el.style.height).toEqual('')
            expect(wrapper.vm.$el.style.width).toEqual('')
        })

        it('Should not change width if rect width were not informed', () => {
            propsData.rect = createRect(5, 5, null, 100)
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.updateElementStyle()
            const expectedHeightString = `${propsData.rect.height}px`
            const rect = getRectFromElementAttributes(wrapper.vm.$el)
            expect(rect.x).toBe(propsData.rect.x)
            expect(rect.y).toBe(propsData.rect.y)
            expect(rect.width).toBe(0)
            expect(rect.height).toBe(propsData.rect.height)
            expect(wrapper.vm.$el.style.height).toEqual(expectedHeightString)
            expect(wrapper.vm.$el.style.width).toEqual('')
        })

        it('Should not change height if rect height were not informed', () => {
            propsData.rect = createRect(5, 5, 100, null)
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.updateElementStyle()
            const expectedWidthString = `${propsData.rect.width}px`
            const rect = getRectFromElementAttributes(wrapper.vm.$el)
            expect(rect.x).toBe(propsData.rect.x)
            expect(rect.y).toBe(propsData.rect.y)
            expect(rect.width).toBe(propsData.rect.width)
            expect(rect.height).toBe(0)
            expect(wrapper.vm.$el.style.height).toEqual('')
            expect(wrapper.vm.$el.style.width).toEqual(expectedWidthString)
        })
    })
})
