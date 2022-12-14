import Vue from 'vue'
import Vuetify from 'vuetify'
import AzDraggableTargetZoneItem from './AzDraggableTargetZoneItem'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createRect = (x, y, width, height) => {
    return { x, y, width, height }
}

const createDefaultProps = () => {
    return {
        id: 'draggable-target-zone-item-spec',
        rect: createRect(0, 0, 100, 100),
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzDraggableTargetZoneItem, options)
}

describe('AzDraggableTargetZoneItem.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData })
    })

    describe('Props', () => {
        it('Should receive id', () => {
            expect(wrapper.props().id).toEqual(propsData.id)
        })

        it('Should receive rect', () => {
            expect(wrapper.props().rect).toEqual(propsData.rect)
        })
    })

    describe('Events', () => {
        beforeEach(() => {
            wrapper = createWrapper({ propsData, shallow: false })
        })

        it('Should emit click on click draggable target zone item', async () => {
            const draggableTargetZoneItemElement = wrapper.find('.az-draggable-target-zone-item')
            await draggableTargetZoneItemElement.trigger('click')
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted('click')[0][0].draggableTargetZoneItemElement).toBeInstanceOf(Element)
            expect(wrapper.emitted('click')[0][0].draggableTargetZoneItemId).toEqual(propsData.id)
            expect(wrapper.emitted('click')[0][0].mousePositionRelativeToTargetZone).toBeInstanceOf(Object)
            expect(wrapper.emitted('click')[0][0].mousePositionRelativeToTargetZone.x).toBeDefined()
            expect(wrapper.emitted('click')[0][0].mousePositionRelativeToTargetZone.y).toBeDefined()
        })
    })

    describe('Computed', () => {
        it('Should transform and apply styles according to rect properties', () => {
            propsData.rect = createRect(5, 5, 100, 100)
            wrapper = createWrapper({ propsData, shallow: false })
            const expectedHeightString = `${propsData.rect.height}px`
            const expectedWidthString = `${propsData.rect.width}px`
            const expectedTransformString = `translate(${propsData.rect.x || 0}px, ${propsData.rect.y || 0}px)`
            expect(wrapper.vm.draggableTargetZoneItemHeight.height).toEqual(expectedHeightString)
            expect(wrapper.vm.draggableTargetZoneItemWidth.width).toEqual(expectedWidthString)
            expect(wrapper.vm.draggableTargetZoneItemTransform.transform).toEqual(expectedTransformString)
        })

        it('Should not transform or apply styles if rect was not informed', () => {
            propsData.rect = undefined
            wrapper = createWrapper({ propsData, shallow: false })
            expect(wrapper.vm.draggableTargetZoneItemTransform.transform).toBeUndefined()
            expect(wrapper.vm.draggableTargetZoneItemTransform.height).toBeUndefined()
            expect(wrapper.vm.draggableTargetZoneItemTransform.width).toBeUndefined()
        })

        it('Should not change width if rect width were not informed', () => {
            propsData.rect = createRect(0, 0, null, 100)
            wrapper = createWrapper({ propsData, shallow: false })
            expect(wrapper.vm.draggableTargetZoneItemWidth.width).toBeUndefined()
        })

        it('Should not change height if rect height were not informed', () => {
            propsData.rect = createRect(0, 0, 100, null)
            wrapper = createWrapper({ propsData, shallow: false })
            expect(wrapper.vm.draggableTargetZoneItemHeight.height).toBeUndefined()
        })
    })
})
