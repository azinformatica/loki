import Vue from 'vue'
import Vuetify from 'vuetify'
import Draggable from './Draggable'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import DraggableUtil from '@/components/draggable/DraggableUtil'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createDraggableMock = (draggableId, pageNumber) => {
    const draggable = {}
    draggable.id = draggableId
    draggable.pageNumber = pageNumber
    draggable.rect = {}
    draggable.rect.x = 0
    draggable.rect.y = 0
    draggable.rect.width = 100
    draggable.rect.height = 100
    return draggable
}

const createDraggablesMock = () => {
    return [createDraggableMock('draggable-item-1', 1)]
}

const createPageMock = (pageContainer) => {
    const page = document.createElement('div')
    page.setAttribute('class', 'page')
    page.setAttribute('style', 'width: 729px; height: 1152px;')
    page.setAttribute('data-loaded', 'true')
    page.setAttribute('data-page-number', `${pageContainer.childElementCount}`)
    pageContainer.appendChild(page)
    return page
}

const createPagesMock = () => {
    const pageContainer = document.createElement('div')
    return [createPageMock(pageContainer), createPageMock(pageContainer)]
}

const mockDraggableEventData = (draggable) => {
    return {
        draggableItemId: draggable.id,
        draggableItemRect: {
            x: draggable.rect.x,
            y: draggable.rect.y,
            width: draggable.rect.width,
            height: draggable.rect.height,
        },
        draggableItemElement: document.createElement('div'),
        draggableTargetZoneItemId: 'draggable-target-zone-item-1',
    }
}

const mockDraggableTargetZoneClickEventData = () => {
    return {
        draggableTargetZoneItemElement: document.createElement('div'),
        draggableTargetZoneItemId: 'draggable-target-zone-item-1',
        mousePositionRelativeToTargetZone: {
            x: 50,
            y: 50,
        },
    }
}

const createDefaultProps = () => {
    return {
        draggables: createDraggablesMock(),
        pages: createPagesMock(),
        isCreatingDraggable: true,
        initialDraggableWidth: 50,
        initialDraggableHeight: 50,
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(Draggable, options)
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

describe('Draggable.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData })
    })

    describe('Props', () => {
        it('Should receive draggables', () => {
            expect(wrapper.props().draggables).toEqual(propsData.draggables)
        })

        it('Should have a default value to draggables', () => {
            propsData.draggables = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().draggables).toEqual([])
        })

        it('Should receive pages', () => {
            expect(wrapper.props().pages).toEqual(propsData.pages)
        })

        it('Should have a default value to pages', () => {
            propsData.pages = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().pages).toEqual([])
        })

        it('Should receive isCreatingDraggable', () => {
            expect(wrapper.props().isCreatingDraggable).toBeTruthy()
        })

        it('Should have a default value to isCreatingDraggable', () => {
            propsData.isCreatingDraggable = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().isCreatingDraggable).toBeFalsy()
        })

        it('Should receive initialDraggableWidth', () => {
            expect(wrapper.props().initialDraggableWidth).toBe(50)
        })

        it('Should have a default value to initialDraggableWidth', () => {
            propsData.initialDraggableWidth = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().initialDraggableWidth).toBe(100)
        })

        it('Should receive initialDraggableHeight', () => {
            expect(wrapper.props().initialDraggableHeight).toBe(50)
        })

        it('Should have a default value to initialDraggableHeight', () => {
            propsData.initialDraggableHeight = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().initialDraggableHeight).toBe(100)
        })
    })

    describe('Vue Lifecycle', () => {
        it('Should register window resize event listener on mount', async () => {
            window.addEventListener = jest.fn()

            wrapper = createWrapper()
            await wrapper.vm.$nextTick()

            expect(window.addEventListener.mock.calls[0][0]).toEqual('resize')
        })

        it('Should unregister window resize event listener when destroyed', async () => {
            window.removeEventListener = jest.fn()

            wrapper = createWrapper()
            wrapper.destroy()

            expect(window.removeEventListener.mock.calls[0][0]).toEqual('resize')
        })
    })

    describe('Events', () => {
        beforeEach(() => {
            wrapper = createWrapper({ propsData, shallow: false })
        })

        it('Should emit delete:draggable on click draggable delete button', async () => {
            const buttonContainer = wrapper.find('[data-test="delete-draggable-button"]')
            const deleteDraggableButton = buttonContainer.find('button')
            await deleteDraggableButton.trigger('click')
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted('delete:draggable')[0][0]['draggableIndex']).toBe(0)
        })

        it('Should emit update:draggable when end dragging draggable', async () => {
            const eventData = mockDraggableEventData(propsData.draggables[0])
            wrapper.vm.isDraggableValidOnStopChanging = jest.fn(() => true)
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => ({ pageNumber: 1 }))
            wrapper.find('.az-draggable').vm.$emit('drag-end', eventData)
            expect(wrapper.emitted('update:draggable')[0][0]['draggable'].id).toEqual(eventData.draggableItemId)
        })

        it('Should emit update:draggable when end resizing draggable', async () => {
            const eventData = mockDraggableEventData(propsData.draggables[0])
            wrapper.vm.isDraggableValidOnStopChanging = jest.fn(() => true)
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => ({ pageNumber: 1 }))
            wrapper.find('.az-draggable').vm.$emit('resize-end', eventData)
            expect(wrapper.emitted('update:draggable')[0][0]['draggable'].id).toEqual(eventData.draggableItemId)
        })

        it('Should emit create:draggable on click page while isCreatingDraggable', () => {
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => ({ pageNumber: 1 }))
            wrapper.vm.isDraggableValidOnCreate = jest.fn(() => true)
            DraggableUtil.createDraggable = jest.fn(() => createDraggableMock('draggable-id-spec', 1))
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()
            azDraggable.vm.$emit('click', eventData)
            expect(wrapper.emitted('create:draggable')[0][0]['draggable'].id).toEqual('draggable-id-spec')
        })

        it('Should emit create:draggable with correct initial width', () => {
            propsData.initialDraggableWidth = 500
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => ({ pageNumber: 1 }))
            wrapper.vm.isDraggableValidOnCreate = jest.fn(() => true)
            DraggableUtil.createDraggable = jest.fn(() => createDraggableMock('draggable-id-spec', 1))
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()
            azDraggable.vm.$emit('click', eventData)
            const createDraggableEventEmitted = wrapper.emitted('create:draggable')
            const createdDraggableRect = createDraggableEventEmitted[0][0].draggable.rect
            expect(createDraggableEventEmitted).toBeTruthy()
            expect(createdDraggableRect.width).toBe(propsData.initialDraggableWidth)
        })

        it('Should emit create:draggable with correct initial height', () => {
            propsData.initialDraggableWidth = 120
            wrapper = createWrapper({ propsData, shallow: false })
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => ({ pageNumber: 1 }))
            wrapper.vm.isDraggableValidOnCreate = jest.fn(() => true)
            DraggableUtil.createDraggable = jest.fn(() => createDraggableMock('draggable-id-spec', 1))
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()
            azDraggable.vm.$emit('click', eventData)
            const createDraggableEventEmitted = wrapper.emitted('create:draggable')
            const createdDraggableRect = createDraggableEventEmitted[0][0].draggable.rect
            expect(createDraggableEventEmitted).toBeTruthy()
            expect(createdDraggableRect.height).toBe(propsData.initialDraggableHeight)
        })

        it('Should not emit create:draggable if draggable is not valid', () => {
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => ({ pageNumber: 1 }))
            wrapper.vm.isDraggableValidOnCreate = jest.fn(() => false)
            DraggableUtil.createDraggable = jest.fn(() => createDraggableMock('draggable-id-spec', 1))
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            azDraggable.vm.$emit('click')
            expect(wrapper.emitted('create:draggable')).toBeFalsy()
        })

        it('Should not emit create:draggable if not started adding draggable', async () => {
            propsData.isCreatingDraggable = false
            wrapper = createWrapper({ propsData, shallow: false })
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            azDraggable.vm.$emit('click')
            expect(wrapper.emitted('create:draggable')).toBeFalsy()
        })
    })
})
