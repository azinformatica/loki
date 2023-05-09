<template>
    <div ref="azReorderable" class="az-reorderable">
        <slot></slot>
    </div>
</template>

<script>
import { cloneDeep, difference } from 'lodash'
import Sortable from 'sortablejs/modular/sortable.complete.esm'

export default {
    name: 'az-reorderable',
    props: {
        dragElement: {
            type: String,
            required: true,
        },
        dropElementContainer: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            default() {
                return []
            },
        },
        options: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    data() {
        return {
            propsInternal: {},
            sortable: null,
        }
    },
    computed: {
        getInitialOptions() {
            return {
                draggable: this.dragElement,
                swap: false,
                onEnd: this.onSortEnd,
            }
        },
        getDefaultOptions() {
            return {
                forceFallback: true,
                animation: 150,
                multiDrag: true,
                scroll: true,
                forceAutoscrollFallback: true,
                scrollSensitivity: 120,
                scrollSpeed: 10,
                bubbleScroll: true,
                fallbackClass: 'item-fallback',
                dragClass: 'item-drag',
                ghostClass: 'item-drop',
                selectedClass: 'item-selected',
            }
        },
    },
    watch: {
        items: {
            deep: true,
            immediate: true,
            handler() {
                this.setItemsPropsInternal()
            },
        },
        options: {
            deep: true,
            immediate: true,
            handler() {
                this.setOptionsPropsInternal()
                this.destroySortable()
                this.initSortable()
            },
        },
    },
    destroyed() {
        this.destroySortable()
    },
    methods: {
        checkMultiDragEventChanges(newIndicies, oldIndicies) {
            return difference(newIndicies, oldIndicies).length > 0 && this.propsInternal.options.multiDrag
        },
        checkSimpleDragEventChanges(newIndex, oldIndex) {
            return newIndex !== oldIndex
        },
        destroySortable() {
            if (this.sortable) {
                this.sortable.destroy()
            }
        },
        emitReorderedItems(interval, itemsReordered) {
            this.$emit('reordered-items', { interval, itemsReordered })
        },
        extractItemsIndices() {
            return Array.from(Array(this.propsInternal.items.length).keys())
        },
        extractAvailableIndices(itemsIndices, newIndicies) {
            const extractedNewIndicies = this.getMultiDragIndices(newIndicies)
            return itemsIndices.filter((e) => !extractedNewIndicies.includes(e))
        },
        extractUnaffectedIndices(itemsIndices, oldIndicies) {
            const extractedOldIndicies = this.getMultiDragIndices(oldIndicies)
            return itemsIndices.filter((e) => !extractedOldIndicies.includes(e))
        },
        getAffectedItemsInterval(affectedItemsInterval) {
            const minIndex = Math.min(...affectedItemsInterval)
            const maxIndex = Math.max(...affectedItemsInterval)

            return { start: minIndex, end: maxIndex }
        },
        getMultiDragIndices(indices) {
            return indices.map((item) => item.index)
        },
        initSortable() {
            this.$nextTick(() => {
                this.sortable = Sortable.create(
                    this.$refs.azReorderable.querySelector(this.dropElementContainer),
                    this.propsInternal.options
                )
            })
        },
        moveDraggedItems(originalItems, newIndicies, oldIndicies) {
            oldIndicies.forEach((oldIndexInterval, index) => {
                const newIndexInternal = newIndicies[index]
                const elementInOriginalList = originalItems[oldIndexInterval.index]
                this.propsInternal.items.splice(newIndexInternal.index, 1, elementInOriginalList)
            })
        },
        moveUnaffectedItemsDrag(originalItems, availablePositions, untouchedArrayPositions) {
            availablePositions.forEach((availablePosition, index) => {
                const position = untouchedArrayPositions[index]
                const element = originalItems[position]
                this.propsInternal.items.splice(availablePosition, 1, element)
            })
        },
        onSortEnd(event) {
            const { newIndex, oldIndex, newIndicies, oldIndicies } = event
            const extractedNewIndicies = this.getMultiDragIndices(newIndicies)
            const extractedOldIndicies = this.getMultiDragIndices(oldIndicies)
            const changeMultiDrag = this.checkMultiDragEventChanges(extractedNewIndicies, extractedOldIndicies)
            const changeSimpleDrag = this.checkSimpleDragEventChanges(newIndex, oldIndex)

            if (!changeMultiDrag && !changeSimpleDrag) {
                return
            }

            if (changeMultiDrag) {
                const interval = this.getAffectedItemsInterval([...extractedNewIndicies, ...extractedOldIndicies])
                this.reorderItemsMultiDrag(newIndicies, oldIndicies)
                this.emitReorderedItems(interval, cloneDeep(this.propsInternal.items))
            } else if (changeSimpleDrag) {
                const interval = this.getAffectedItemsInterval([newIndex, oldIndex])
                this.reorderItemsSimpleDrag(newIndex, oldIndex)
                this.emitReorderedItems(interval, cloneDeep(this.propsInternal.items))
            }
        },
        reorderItemsMultiDrag(newIndicies, oldIndicies) {
            const originalItems = cloneDeep(this.propsInternal.items)
            const originalIndices = this.extractItemsIndices()
            const availablePositions = this.extractAvailableIndices(originalIndices, newIndicies)
            const nonMovedIndicesArray = this.extractUnaffectedIndices(originalIndices, oldIndicies)

            this.resetItemsIndices()
            this.moveDraggedItems(originalItems, newIndicies, oldIndicies)
            this.moveUnaffectedItemsDrag(originalItems, availablePositions, nonMovedIndicesArray)
        },
        resetItemsIndices() {
            this.propsInternal.items.forEach((value, index) => {
                this.propsInternal.items.splice(index, 1, null)
            })
        },
        reorderItemsSimpleDrag(newIndex, oldIndex) {
            const itemRemoved = this.propsInternal.items.splice(oldIndex, 1)[0]
            this.propsInternal.items.splice(newIndex, 0, itemRemoved)
        },
        setItemsPropsInternal() {
            this.$set(this.propsInternal, 'items', cloneDeep(this.items))
        },
        setOptionsPropsInternal() {
            const options = Object.assign({}, this.getDefaultOptions, this.options, this.getInitialOptions)
            this.$set(this.propsInternal, 'options', options)
        },
    },
}
</script>

<style lang="stylus">
.az-reorderable
    .item-drag
        border thin solid rgba(0, 0, 0, .12)
        background #C8EBFB

    .item-drop
        opacity .5
        background #C8EBFB
        cursor move

    .item-selected
        background #C8EBFB
</style>
