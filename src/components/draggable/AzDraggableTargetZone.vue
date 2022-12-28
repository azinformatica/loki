<template>
    <div :class="`${this.name} az-draggable-target-zone`">
        <slot></slot>
    </div>
</template>

<script>
import interact from 'interactjs'
import DraggableUtil from './DraggableUtil'
export default {
    name: 'AzDraggableTargetZone',
    props: {
        name: {
            type: String,
            required: true,
        },
        acceptedDraggablesNames: {
            type: Array,
            required: true,
            validator: (value) => value.length,
        },
        overlap: {
            type: Number,
            default: 1,
        },
    },
    data: () => ({
        interactor: null,
    }),
    computed: {
        acceptedDraggablesNamesBetweenCommas() {
            return this.acceptedDraggablesNames.map((name) => `.${name}-item`).join(', ')
        },
    },
    mounted() {
        this.configureInteractor()
    },
    destroyed() {
        this.interactor.unset()
        this.interactor = null
    },
    methods: {
        configureInteractor() {
            this.interactor = interact(`.${this.name}-item`)
            this.configureDropzone()
        },
        configureDropzone() {
            this.interactor = this.interactor.dropzone({
                accept: this.acceptedDraggablesNamesBetweenCommas,
                overlap: this.overlap,
                ondropactivate: (event) => this.createDropzoneOnDropActivateEvent(event),
                ondragenter: (event) => this.createDropzoneOnDragEnterEvent(event),
                ondragleave: (event) => this.createDropzoneOnDragLeaveEvent(event),
                ondropdeactivate: (event) => this.createDropzoneOnDropDeactivateEvent(event),
            })
        },
        createDropzoneOnDropActivateEvent(event) {
            const draggableTargetZoneItemElement = event.target
            draggableTargetZoneItemElement.classList.add(`${this.name}-item--active`)
        },
        createDropzoneOnDragEnterEvent(event) {
            const eventData = Object.assign(
                {},
                this.getDraggableTargetZoneItemEventData(event.target),
                this.getDraggableItemEventData(event.relatedTarget),
                this.getDraggableItemRectEventData(event.relatedTarget, event.target)
            )
            this.updateDraggableItemAttributeTargetZoneItemId(event.relatedTarget, eventData.draggableTargetZoneItemId)
            this.updateDraggableItemAttributeRect(event.relatedTarget, eventData.draggableItemRect)
            this.$emit('draggable-enter', eventData)
        },
        createDropzoneOnDragLeaveEvent(event) {
            const eventData = Object.assign(
                {},
                this.getDraggableTargetZoneItemEventData(event.target),
                this.getDraggableItemEventData(event.relatedTarget),
                this.getDraggableItemRectEventData(event.relatedTarget)
            )
            this.updateDraggableItemAttributeTargetZoneItemId(event.relatedTarget, '')
            this.updateDraggableItemAttributeRect(event.relatedTarget, eventData.draggableItemRect)
            this.$emit('draggable-leave', eventData)
        },
        createDropzoneOnDropDeactivateEvent(event) {
            const draggableTargetZoneItemElement = event.target
            draggableTargetZoneItemElement.classList.remove(`${this.name}-item--active`)
        },
        getDraggableTargetZoneItemEventData(draggableTargetZoneItemElement) {
            return {
                draggableTargetZoneItemElement: draggableTargetZoneItemElement,
                draggableTargetZoneItemId: draggableTargetZoneItemElement.id,
            }
        },
        getDraggableItemEventData(draggableItemElement) {
            return {
                draggableItemElement: draggableItemElement,
                draggableItemId: draggableItemElement.id,
            }
        },
        getDraggableItemRectEventData(draggableItemElement, draggableTargetZoneItemElement) {
            return {
                draggableItemRect: this.getDraggableItemRect(draggableItemElement, draggableTargetZoneItemElement),
            }
        },
        getDraggableItemRect(draggableItemElement, draggableTargetZoneItemElement) {
            const relativeElement = draggableTargetZoneItemElement || draggableItemElement.parentElement
            return DraggableUtil.getElementRectRelativeToAnotherElementRect(draggableItemElement, relativeElement)
        },
        updateDraggableItemAttributeRect(draggableItemElement, draggableItemRect) {
            DraggableUtil.saveRectAsElementAttributes(draggableItemElement, draggableItemRect)
        },
        updateDraggableItemAttributeTargetZoneItemId(draggableItemElement, draggableTargetZoneItemId) {
            DraggableUtil.saveTargetZoneItemIdAsElementAttribute(draggableItemElement, draggableTargetZoneItemId)
        },
    },
}
</script>

<style scoped lang="stylus">
.az-draggable-target-zone
    pointer-events none
    > *
        pointer-events auto
</style>