import Vue from 'vue'
import Vuetify from 'vuetify'
import AzDraggableTargetZoneItem from './AzDraggableTargetZoneItem'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createDefaultProps = () => {
    return {
        id: 'draggable-target-zone-item-spec'
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
})
