import { createLocalVue, shallowMount } from '@vue/test-utils'
import AzDraggableReordered from './AzDraggableReordered'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

jest.mock('sortablejs/modular/sortable.complete.esm', () => ({
	__esModule: true,
	default: jest.genMockFromModule('sortablejs'),
}))

const localVue = createLocalVue()
Vue.use(Vuex)
Vue.use(Vuetify)

describe('AzDraggableReordered', () => {
	let wrapper, vuetify, propsData

	beforeEach(() => {
		vuetify = new Vuetify()

		propsData = {
			dragElement: 'span',
			dropElementContainer: 'div',
			items: ['Item 1', 'Item 2', 'Item 3'],
		}
	})

	it('should initialize Sortable when component is mounted', async () => {
		const spy = jest.spyOn(AzDraggableReordered.methods, 'initSortable')
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})
		expect(spy).toHaveBeenCalled()
	})

	it('should destroy Sortable when component is destroyed', async () => {
		const destroy = jest.fn()
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})
		wrapper.vm.sortable = { destroy }
		wrapper.vm.destroySortable()
		expect(destroy).toHaveBeenCalled()
	})

	it('sets the initial options', async () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		await wrapper.setProps({
			options: {
				swap: true,
				onEnd: jest.fn(),
			},
		})

		expect(wrapper.vm.propsInternal.options.draggable).toBe('span')
		expect(wrapper.vm.propsInternal.options.swap).toBeFalsy()
		expect(wrapper.vm.propsInternal.options.onEnd.name).toEqual('bound onSortEnd')
	})

	it('sets the default options', async () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		await wrapper.setProps({
			options: {
				multiDrag: false,
				dragClass: 'item-drag-test',
			},
		})

		expect(wrapper.vm.propsInternal.options.multiDrag).toBeFalsy()
		expect(wrapper.vm.propsInternal.options.dragClass).toBe('item-drag-test')
	})

	it('emits reordered-items event', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const emit = {
			interval: { end: 3, start: 1 },
			itemsReordered: ['item3', 'item1', 'item2'],
		}

		wrapper.vm.reorderItemsMultiDrag(
			[
				{ index: 1, multiDragElement: true },
				{ index: 0, multiDragElement: true },
				{ index: 2, multiDragElement: true },
			],
			[
				{ index: 0, multiDragElement: true },
				{ index: 1, multiDragElement: true },
				{ index: 2, multiDragElement: true },
			],
		)
		wrapper.vm.emitReorderedItems(emit.interval, emit.itemsReordered)
		expect(wrapper.emitted()['reordered-items'][0][0]).toEqual(emit)
	})

	it('return true check multidrag event changes', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const result = wrapper.vm.checkMultiDragEventChanges([1, 2], [4, 5])
		expect(result).toBeTruthy()
	})

	it('return false check multidrag event changes', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const result = wrapper.vm.checkMultiDragEventChanges([1, 2], [1, 2])
		expect(result).toBeFalsy()
	})

	it('return false check multidrag event changes and multiDrag false', async () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		await wrapper.setProps({
			options: {
				multiDrag: false,
			},
		})

		const result = wrapper.vm.checkMultiDragEventChanges([1, 2], [1, 2])
		expect(result).toBeFalsy()
	})

	it('return true check simple drag event changes', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const result = wrapper.vm.checkSimpleDragEventChanges(1, 2)
		expect(result).toBeTruthy()
	})

	it('return false check simple drag event changes', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const result = wrapper.vm.checkSimpleDragEventChanges(2, 2)
		expect(result).toBeFalsy()
	})

	it('extracts items indices', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const itemsIndices = wrapper.vm.extractItemsIndices()
		expect(itemsIndices).toEqual([0, 1, 2])
	})

	it('extracts available indices', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const availableIndices = wrapper.vm.extractAvailableIndices([0, 1, 2], [{ index: 0 }, { index: 1 }])
		expect(availableIndices).toEqual([2])
	})

	it('extracts unaffected indices', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const unaffectedIndices = wrapper.vm.extractUnaffectedIndices([0, 1, 2], [{ index: 1 }, { index: 2 }])
		expect(unaffectedIndices).toEqual([0])
	})

	it('get affected items interval', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const interval = wrapper.vm.getAffectedItemsInterval([4, 2, 1, 3])
		expect(interval).toEqual({ start: 1, end: 4 })
	})

	it('get multiDrag indices', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const indices = wrapper.vm.getMultiDragIndices([{ index: 1 }, { index: 2 }, { index: 4 }])
		expect(indices).toEqual([1, 2, 4])
	})

	it('move dragged items', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const originalItems = ['Item 1', 'Item 2', 'Item 3']
		const newIndicies = [{ index: 0 }, { index: 1 }]
		const oldIndicies = [{ index: 1 }, { index: 2 }]

		wrapper.vm.propsInternal.items = [null, null, null]

		wrapper.vm.moveDraggedItems(originalItems, newIndicies, oldIndicies)
		expect(wrapper.vm.propsInternal.items).toEqual(['Item 2', 'Item 3', null])
	})

	it('move unaffected items drag', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const originalItems = ['Item 1', 'Item 2', 'Item 3']
		const availablePositions = [2]
		const untouchedArrayPositions = [0]

		wrapper.vm.propsInternal.items = [null, null, null]

		wrapper.vm.moveUnaffectedItemsDrag(originalItems, availablePositions, untouchedArrayPositions)
		expect(wrapper.vm.propsInternal.items).toEqual([null, null, 'Item 1'])
	})

	it('should reorder items when a simple drag event occurs', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const newIndex = 0
		const oldIndex = 2
		const newIndicies = []
		const oldIndicies = []

		wrapper.vm.onSortEnd({
			newIndex,
			oldIndex,
			newIndicies,
			oldIndicies,
		})

		const emit = {
			interval: { end: 2, start: 0 },
			itemsReordered: ['Item 3', 'Item 1', 'Item 2'],
		}
		expect(wrapper.vm.propsInternal.items).toEqual(['Item 3', 'Item 1', 'Item 2'])
		expect(wrapper.emitted()['reordered-items'][0][0]).toEqual(emit)
	})

	it('should reorder items when a multi drag event occurs', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		const newIndex = 0
		const oldIndex = 2
		const newIndicies = [{ index: 1 }, { index: 2 }]
		const oldIndicies = [{ index: 0 }, { index: 2 }]

		const emit = {
			interval: { end: 2, start: 0 },
			itemsReordered: ['Item 2', 'Item 1', 'Item 3'],
		}

		wrapper.vm.onSortEnd({
			newIndex,
			oldIndex,
			newIndicies,
			oldIndicies,
		})

		expect(wrapper.vm.propsInternal.items).toEqual(['Item 2', 'Item 1', 'Item 3'])
		expect(wrapper.emitted()['reordered-items'][0][0]).toEqual(emit)
	})

	it('reset items indices', () => {
		wrapper = shallowMount(AzDraggableReordered, {
			localVue,
			vuetify,
			propsData,
			slots: {
				default: propsData.items.map((item) => `<div>${item}</div>`),
			},
		})

		wrapper.vm.resetItemsIndices()

		expect(wrapper.vm.propsInternal.items).toEqual([null, null, null])
	})
})
