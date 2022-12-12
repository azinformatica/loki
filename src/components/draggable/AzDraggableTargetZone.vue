<template>
    <div :class="`${this.name} az-draggable-target-zone`">
        <slot>
        </slot>
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
    props: {
        name: {
            type: String,
            required: true
        },
        acceptedDraggableNames: {
            type: Array,
            required: true
        },
        overlap: {
            type: Number,
            default: 1
        }
    },
    data: () => ({
        interactor: null
    }),
    computed: {
        acceptedDraggableNamesBetweenCommas() {
            return this.acceptedDraggableNames.map(name => `.${name}-item`).join(', ')
        }
    },
    mounted() {
        this.configureInteractor()
    },
    destroyed() {
        this.interactor.unset()
    },
    methods: {
        configureInteractor() {
            this.interactor = interact(`.${this.name}-item`)
            this.configureDropzone()
        },
        configureDropzone() {
            this.interactor = this.interactor.dropzone({
                accept: this.acceptedDraggableNamesBetweenCommas,
                overlap: this.overlap,
                ondropactivate: event => this.createDropzoneOnDropActivateEvent(event),
                ondragenter: event => this.createDropzoneOnDragEnterEvent(event),
                ondragleave: event => this.createDropzoneOnDragLeaveEvent(event),
                ondropdeactivate: event => this.createDropzoneOnDropDeactivateEvent(event)
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
                draggableTargetZoneItemId: this.getDraggableTargetZoneItemId(draggableTargetZoneItemElement),
            }
        },
        getDraggableItemEventData(draggableItemElement) {
            return {
                draggableItemElement: draggableItemElement,
                draggableItemId: this.getDraggableItemId(draggableItemElement)
            }
        },
        getDraggableItemRectEventData(draggableItemElement, draggableTargetZoneItemElement) {
            return {
                draggableItemRect: draggableTargetZoneItemElement
                    ? this.getDraggableItemPositionRelativeToTargetZone(draggableItemElement, draggableTargetZoneItemElement)
                    : this.getDraggableItemPositionRelativeToParent(draggableItemElement)
            }
        },
        getDraggableTargetZoneItemId(draggableTargetZoneItemElement) {
            return draggableTargetZoneItemElement.getAttribute('id')
        },
        getDraggableItemId(draggableItemElement) {
            return draggableItemElement.getAttribute('id')
        },
        getDraggableItemPositionRelativeToTargetZone(draggableItemElement, draggableTargetZoneItemElement) {
            return this.getElementPositionRelativeToAnotherElement(draggableItemElement, draggableTargetZoneItemElement)
        },
        getDraggableItemPositionRelativeToParent(draggableItemElement) {
            return this.getElementPositionRelativeToAnotherElement(draggableItemElement, draggableItemElement.parentElement)
        },
        getElementPositionRelativeToAnotherElement(element, relativeElement) {
            const relativeElementRect = relativeElement.getBoundingClientRect()
            const elementRect = element.getBoundingClientRect()
            return {
                x: Math.round(elementRect.left - relativeElementRect.left),
                y: Math.round(elementRect.top - relativeElementRect.top),
                width: elementRect.width,
                height: elementRect.height
            }
        },
        updateDraggableItemAttributeRect(draggableItemElement, draggableItemRect) {
            draggableItemElement.setAttribute('data-x', draggableItemRect.x)
            draggableItemElement.setAttribute('data-y', draggableItemRect.y)
        },
        updateDraggableItemAttributeTargetZoneItemId(draggableItemElement, draggableTargetZoneItemId) {
            draggableItemElement.setAttribute('target-zone-item-id', draggableTargetZoneItemId)
        }
    }
}
</script>