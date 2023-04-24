import Vue from 'vue'
import Vuetify from 'vuetify'
import Draggable from './Draggable'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createDraggableMock = (draggableId, pageNumber, groupId = null) => {
    const draggable = {}
    draggable.id = draggableId
    draggable.groupId = groupId
    draggable.pageNumber = pageNumber
    draggable.percentX = 0
    draggable.percentY = 0
    draggable.percentWidth = 0.1
    draggable.percentHeight = 0.1
    return draggable
}

const createDraggablesMock = () => {
    return [
        createDraggableMock('draggable-item-1', 1, null),
        createDraggableMock('draggable-item-2', 1, 'group-1'),
        createDraggableMock('draggable-item-3', 2, 'group-1'),
    ]
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
            x: draggable.percentX * 100,
            y: draggable.percentY * 100,
            width: draggable.percentWidth * 100,
            height: draggable.percentHeight * 100,
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

const mockDraggableTargetZone = () => {
    return {
        pageNumber: 1,
        rect: {
            x: 5,
            y: 5,
            height: 10,
            width: 10,
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
        draggableLinkTooltip: 'link',
        draggableUnlinkTooltip: 'unlink',
        draggableDeleteTooltip: 'delete',
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
        vuetify: new Vuetify(),
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(Draggable, options)
}

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

        it('Should receive draggableLinkTooltip', () => {
            expect(wrapper.props().draggableLinkTooltip).toBe('link')
        })

        it('Should have a default value to draggableLinkTooltip', () => {
            propsData.draggableLinkTooltip = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().draggableLinkTooltip).toBe('Vincular')
        })

        it('Should receive draggableUnlinkTooltip', () => {
            expect(wrapper.props().draggableUnlinkTooltip).toBe('unlink')
        })

        it('Should have a default value to draggableUnlinkTooltip', () => {
            propsData.draggableUnlinkTooltip = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().draggableUnlinkTooltip).toBe('Desvincular')
        })

        it('Should receive draggableDeleteTooltip', () => {
            expect(wrapper.props().draggableDeleteTooltip).toBe('delete')
        })

        it('Should have a default value to draggableDeleteTooltip', () => {
            propsData.draggableDeleteTooltip = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().draggableDeleteTooltip).toBe('Remover')
        })
    })

    describe('Vue Lifecycle', () => {
        it('Should register window resize event listener on mount', async () => {
            window.addEventListener = jest.fn()

            wrapper = createWrapper({ propsData })
            await wrapper.vm.$nextTick()

            expect(window.addEventListener.mock.calls[0][0]).toEqual('resize')
        })

        it('Should unregister window resize event listener when destroyed', async () => {
            window.removeEventListener = jest.fn()

            wrapper = createWrapper({ propsData })
            wrapper.destroy()

            expect(window.removeEventListener.mock.calls[0][0]).toEqual('resize')
        })
    })

    describe('Events', () => {
        beforeEach(() => {
            wrapper = createWrapper({ propsData, shallow: false })
        })

        it('Should emit delete:draggable on click draggable delete button to all group', async () => {
            propsData.draggables[0].groupId = 'group-1'
            wrapper = createWrapper({ propsData, shallow: false })

            const buttonContainer = wrapper.find('[data-test="delete-draggable-button"]')
            const deleteDraggableButton = buttonContainer.find('button')
            await deleteDraggableButton.trigger('click')
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('delete:draggable')[0][0]['draggableIndex']).toBe(0)
            expect(wrapper.emitted('delete:draggable')).toHaveLength(propsData.draggables.length)
        })

        it('Should emit delete:draggable on click draggable delete button to only to itself', async () => {
            const buttonContainer = wrapper.find('[data-test="delete-draggable-button"]')
            const deleteDraggableButton = buttonContainer.find('button')
            await deleteDraggableButton.trigger('click')
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('delete:draggable')[0][0]['draggableIndex']).toBe(0)
            expect(wrapper.emitted('delete:draggable')).toHaveLength(1)
        })

        it('Should emit update:draggable to entire group when end dragging draggable', async () => {
            propsData.draggables[0].groupId = 'group-1'
            wrapper = createWrapper({ propsData, shallow: false })

            const eventData = mockDraggableEventData(propsData.draggables[0])
            wrapper.vm.areDraggableChangesValid = jest.fn(() => true)
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => mockDraggableTargetZone())
            wrapper.vm.setActiveDraggable(propsData.draggables[0].id)
            wrapper.find('.az-draggable').vm.$emit('drag-end', eventData)

            expect(wrapper.emitted('update:draggable')[0][0]['draggable'].id).toEqual(eventData.draggableItemId)
            expect(wrapper.emitted('update:draggable')).toHaveLength(propsData.draggables.length)
        })

        it('Should emit update:draggable only to itself when end dragging draggable', async () => {
            const eventData = mockDraggableEventData(propsData.draggables[0])
            wrapper.vm.areDraggableChangesValid = jest.fn(() => true)
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => mockDraggableTargetZone())
            wrapper.vm.setActiveDraggable(propsData.draggables[0].id)
            wrapper.find('.az-draggable').vm.$emit('drag-end', eventData)

            expect(wrapper.emitted('update:draggable')[0][0]['draggable'].id).toEqual(eventData.draggableItemId)
            expect(wrapper.emitted('update:draggable')).toHaveLength(1)
        })

        it('Should emit update:draggable to entire group when end resizing draggable', async () => {
            propsData.draggables[0].groupId = 'group-1'
            wrapper = createWrapper({ propsData, shallow: false })

            const eventData = mockDraggableEventData(propsData.draggables[0])
            wrapper.vm.areDraggableChangesValid = jest.fn(() => true)
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => mockDraggableTargetZone())
            wrapper.vm.setActiveDraggable(propsData.draggables[0].id)
            wrapper.find('.az-draggable').vm.$emit('resize-end', eventData)

            expect(wrapper.emitted('update:draggable')[0][0]['draggable'].id).toEqual(eventData.draggableItemId)
            expect(wrapper.emitted('update:draggable')).toHaveLength(propsData.draggables.length)
        })

        it('Should emit update:draggable only to itself when end resizing draggable', async () => {
            const eventData = mockDraggableEventData(propsData.draggables[0])
            wrapper.vm.areDraggableChangesValid = jest.fn(() => true)
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => mockDraggableTargetZone())
            wrapper.vm.setActiveDraggable(propsData.draggables[0].id)
            wrapper.find('.az-draggable').vm.$emit('resize-end', eventData)

            expect(wrapper.emitted('update:draggable')[0][0]['draggable'].id).toEqual(eventData.draggableItemId)
            expect(wrapper.emitted('update:draggable')).toHaveLength(1)
        })

        it('Should emit create:draggable on click page while isCreatingDraggable', () => {
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => mockDraggableTargetZone())
            wrapper.vm.validateOutputDraggable = jest.fn()
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()
            azDraggable.vm.$emit('click', eventData)

            expect(wrapper.emitted('create:draggable')[0][0]['draggable'].id).toBeTruthy()
        })

        it('Should emit create:draggable with correct initial width', () => {
            propsData.initialDraggableWidth = 500
            wrapper = createWrapper({ propsData, shallow: false })
            const draggableTargetZone = mockDraggableTargetZone()
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => draggableTargetZone)
            wrapper.vm.validateOutputDraggable = jest.fn()
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()
            azDraggable.vm.$emit('click', eventData)
            const createDraggableEventEmitted = wrapper.emitted('create:draggable')
            const percentWidth = createDraggableEventEmitted[0][0].draggable.percentWidth

            expect(createDraggableEventEmitted).toBeTruthy()
            expect(percentWidth * draggableTargetZone.rect.width).toBe(propsData.initialDraggableWidth)
        })

        it('Should emit create:draggable with correct initial height', () => {
            propsData.initialDraggableWidth = 120
            wrapper = createWrapper({ propsData, shallow: false })
            const draggableTargetZone = mockDraggableTargetZone()
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => draggableTargetZone)
            wrapper.vm.validateOutputDraggable = jest.fn()
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()
            azDraggable.vm.$emit('click', eventData)
            const createDraggableEventEmitted = wrapper.emitted('create:draggable')
            const percentHeight = createDraggableEventEmitted[0][0].draggable.percentHeight

            expect(createDraggableEventEmitted).toBeTruthy()
            expect(percentHeight * draggableTargetZone.rect.height).toBe(propsData.initialDraggableHeight)
        })

        it('Should not emit create:draggable if draggable is not valid', () => {
            const consoleError = console.error
            console.error = jest.fn()
            wrapper.vm.findDraggableTargetZoneById = jest.fn(() => mockDraggableTargetZone())
            wrapper.vm.validateOutputDraggable = jest.fn(() => {
                throw new Error()
            })
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()

            azDraggable.vm.$emit('click', eventData)

            expect(wrapper.vm.validateOutputDraggable).toThrow(Error)
            expect(wrapper.emitted('create:draggable')).toBeFalsy()
            console.error = consoleError
        })

        it('Should not emit create:draggable if not started adding draggable', async () => {
            propsData.isCreatingDraggable = false
            wrapper = createWrapper({ propsData, shallow: false })
            const azDraggable = wrapper.find('.document-draggable-target-zone-item')
            const eventData = mockDraggableTargetZoneClickEventData()

            azDraggable.vm.$emit('click', eventData)

            expect(wrapper.emitted('create:draggable')).toBeFalsy()
        })

        it('Should emit link:draggable on click draggable link button', async () => {
            const buttonContainer = wrapper.find('[data-test="link-draggable-button"]')
            const linkDraggableButton = buttonContainer.find('button')
            await linkDraggableButton.trigger('click')
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('link:draggable')[0][0]['draggableIndex']).toBe(0)
        })

        it('Should emit unlink:draggable on click draggable unlink button', async () => {
            propsData.draggables[0].groupId = 'group-1'
            wrapper = createWrapper({ propsData, shallow: false })

            const buttonContainer = wrapper.find('[data-test="unlink-draggable-button"]')
            const unlinkDraggableButton = buttonContainer.find('button')
            await unlinkDraggableButton.trigger('click')
            await wrapper.vm.$nextTick()

            expect(wrapper.emitted('unlink:draggable')[0][0]['draggableIndex']).toBe(0)
        })
    })
})
