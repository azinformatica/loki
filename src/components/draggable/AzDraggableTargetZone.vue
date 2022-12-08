<template>
    <div class="az-draggable-target-zone">
        <az-draggable-target-zone-item
            v-for="draggableTargetZone of draggableTargetZones"
            :key="draggableTargetZone.id"
            :draggable-target-zone-item-id="draggableTargetZone.id"
            :draggable-target-zone-item-rect="draggableTargetZone.rect"
            @draggableTargetZoneItemClick="handleDraggableTargetZoneItemClick"
        />
    </div>
</template>

<script>
import interact from 'interactjs'
import AzDraggableTargetZoneItem from './AzDraggableTargetZoneItem'
export default {
    name: "AzDraggableTargetZone",
    components: {
        AzDraggableTargetZoneItem
    },
    methods: {
        configureInteractor() {
            this.interactor = interact(`.${this.draggableTargetZoneName}`)
            this.configureDropzone()
        },
        configureDropzone() {
            this.interactor = this.interactor.dropzone({
                accept: `.${this.draggableName}`,
                overlap: this.overlap,
                ondropactivate: event => this.createDropzoneOnDropActivateEvent(event),
                ondragenter: event => this.createDropzoneOnDragEnterEvent(event),
                ondragleave: event => this.createDropzoneOnDragLeaveEvent(event),
                ondropdeactivate: event => this.createDropzoneOnDropDeactivateEvent(event)
            })
        },
        createDropzoneOnDropActivateEvent(event) {
            const { draggableTargetZoneItem } = this.getDraggableTargetZoneItemEventData(event.target)
            draggableTargetZoneItem.classList.add(`${this.draggableTargetZoneName}--active`)
        },
        createDropzoneOnDragEnterEvent(event) {
            this.$emit('draggableEnter', Object.assign(
                this.getDraggableTargetZoneItemEventData(event.target),
                this.getDraggableItemEventData(event.relatedTarget),
                this.getDraggableItemPositionRelativeToTargetZoneEventData(event.relatedTarget, event.target)
            ))
        },
        createDropzoneOnDragLeaveEvent(event) {
            this.$emit('draggableLeave', Object.assign(
                this.getDraggableTargetZoneItemEventData(event.target),
                this.getDraggableItemEventData(event.relatedTarget)
            ))
        },
        createDropzoneOnDropDeactivateEvent(event) {
            const { draggableTargetZoneItem } = this.getDraggableTargetZoneItemEventData(event.target)
            draggableTargetZoneItem.classList.remove(`${this.draggableTargetZoneName}--active`)
        },
        getDraggableTargetZoneItemEventData(draggableTargetZoneItem) {
            return {
                draggableTargetZoneItem: draggableTargetZoneItem,
                draggableTargetZoneItemId: this.getDraggableTargetZoneItemId(draggableTargetZoneItem),
                draggableTargetZoneItemIndex: this.getElementIndex(draggableTargetZoneItem),
            }
        },
        getDraggableItemEventData(draggableItem) {
            return {
                draggableItem: draggableItem,
                draggableItemId: this.getDraggableItemId(draggableItem),
                draggableItemIndex: this.getElementIndex(draggableItem),
                draggableItemPositionRelativeToParent: this.getDraggableItemPositionRelativeToParent(draggableItem)
            }
        },
        getDraggableItemPositionRelativeToTargetZoneEventData(draggableItem, draggableTargetZoneItem) {
            return {
                draggableItemPositionRelativeToTargetZone: this.getDraggableItemPositionRelativeToTargetZone(draggableItem, draggableTargetZoneItem)
            }
        },
        getDraggableTargetZoneItemId(draggableTargetZoneItem) {
            return draggableTargetZoneItem.getAttribute('draggable-target-zone-item-id')
        },
        getElementIndex(element) {
            return Array.from(element.parentElement.children).indexOf(element);
        },
        getDraggableItemId(draggableItem) {
            return draggableItem.getAttribute('draggable-item-id')
        },
        getDraggableItemPositionRelativeToTargetZone(draggableItem, draggableTargetZoneItem) {
            return this.getElementPositionRelativeToAnotherElement(draggableItem, draggableTargetZoneItem)
        },
        getDraggableItemPositionRelativeToParent(draggableItem) {
            return this.getElementPositionRelativeToAnotherElement(draggableItem, draggableItem.parentElement)
        },
        getElementPositionRelativeToAnotherElement(element, relativeElement) {
            const relativeElementRect = relativeElement.getBoundingClientRect()
            const elementRect = element.getBoundingClientRect()

            return {
                x: Math.round(elementRect.left - relativeElementRect.left),
                y: Math.round(elementRect.top - relativeElementRect.top)
            }
        },
        handleDraggableTargetZoneItemClick(event) {
            this.$emit('draggableTargetZoneItemClick', Object.assign(
                this.getDraggableTargetZoneItemEventData(event.target),
                this.getDraggableTargetZoneItemClickEventData(event)
            ))
        },
        getDraggableTargetZoneItemClickEventData(event) {
            const draggableTargetZoneItem = event.target
            const draggableTargetZoneItemRect = draggableTargetZoneItem.getBoundingClientRect()
            return {
                mousePositionInsideTargetZone: {
                    x: Math.round(event.clientX - draggableTargetZoneItemRect.left),
                    y: Math.round(event.clientY - draggableTargetZoneItemRect.top)
                }
            }
        }
    },
    mounted() {
        this.configureInteractor()
    },
    destroyed() {
        this.interactor.unset()
    },
    props: {
        draggableTargetZoneName: {
            type: String,
            required: true
        },
        draggableName: {
            type: String,
            required: true
        },
        draggableTargetZones: {
            type: Array,
            default: () => []
        },
        overlap: {
            type: Number,
            default: 1
        }
    },
    data: () => ({
        interactor: null
    })
}
</script>

<style scoped lang="stylus">
.az-draggable-target-zone
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index 9998
</style>