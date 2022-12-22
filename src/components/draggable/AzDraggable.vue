<template>
    <div :class="`${this.name} az-draggable`">
        <slot></slot>
    </div>
</template>

<script>
import interact from 'interactjs'
import DraggableUtil from './DraggableUtil'

export default {
    name: 'AzDraggable',
    props: {
        name: {
            type: String,
            required: true,
        },
        resizable: {
            type: Boolean,
            default: false,
        },
        minWidth: {
            type: Number,
            default: 50,
        },
        minHeight: {
            type: Number,
            default: 50,
        },
        maxWidth: {
            type: Number,
            default: 1000,
        },
        maxHeight: {
            type: Number,
            default: 1000,
        },
    },
    data: () => ({
        interactor: null,
    }),
    methods: {
        configureInteractor() {
            this.interactor = interact(`.${this.name}-item`)
            this.configureResizable()
            this.configureDraggable()
        },
        configureResizable() {
            if (!this.resizable) return
            this.interactor.resizable({
                edges: this.createResizableEdges(),
                listeners: this.createResizableListeners(),
                modifiers: this.createResizableModifiers(),
                inertia: true,
            })
        },
        configureDraggable() {
            this.interactor.draggable({
                listeners: this.createDraggableListeners(),
                autoScroll: true,
                inertia: true,
            })
        },
        createResizableEdges() {
            return {
                left: true,
                right: true,
                bottom: true,
                top: true,
            }
        },
        createResizableListeners() {
            return {
                start: (event) => this.createResizableListenersStartEvent(event),
                move: (event) => this.createResizableListenersMoveEvent(event),
                end: (event) => this.createResizableListenersEndEvent(event),
            }
        },
        createResizableModifiers() {
            return [
                interact.modifiers.restrictSize({
                    min: {
                        width: this.minWidth,
                        height: this.minHeight,
                    },
                    max: {
                        width: this.maxWidth,
                        height: this.maxHeight,
                    },
                }),
            ]
        },
        createResizableListenersStartEvent(event) {
            event.target.classList.add(`${this.name}-item--resize`)
            const eventData = this.getEventData(event)
            this.updateDraggableItemAttributes(eventData.draggableItemElement, eventData.draggableItemRect)
            this.$emit('resize-start', eventData)
        },
        createResizableListenersMoveEvent(event) {
            const eventData = this.getEventData(event)
            this.updateDraggableItemAttributes(eventData.draggableItemElement, eventData.draggableItemRect)
            this.$emit('resize', eventData)
        },
        createResizableListenersEndEvent(event) {
            event.target.classList.remove(`${this.name}-item--resize`)
            const eventData = this.getEventData(event)
            this.updateDraggableItemAttributes(eventData.draggableItemElement, eventData.draggableItemRect)
            this.$emit('resize-end', eventData)
        },
        createDraggableListeners() {
            return {
                start: (event) => this.createDraggableListenersStart(event),
                move: (event) => this.createDraggableListenersMove(event),
                end: (event) => this.createDraggableListenersEnd(event),
            }
        },
        createDraggableListenersStart(event) {
            event.target.classList.add(`${this.name}-item--drag`)
            const eventData = this.getEventData(event)
            this.updateDraggableItemAttributes(eventData.draggableItemElement, eventData.draggableItemRect)
            this.$emit('drag-start', eventData)
        },
        createDraggableListenersMove(event) {
            const eventData = this.getEventData(event)
            this.updateDraggableItemAttributes(eventData.draggableItemElement, eventData.draggableItemRect)
            this.$emit('drag', eventData)
        },
        createDraggableListenersEnd(event) {
            event.target.classList.remove(`${this.name}-item--drag`)
            const eventData = this.getEventData(event)
            this.updateDraggableItemAttributes(eventData.draggableItemElement, eventData.draggableItemRect)
            this.$emit('drag-end', eventData)
        },
        getEventData(event) {
            return {
                draggableItemElement: event.target,
                draggableItemId: event.target.id,
                draggableItemRect: this.getUpdatedDraggableItemRect(event),
                draggableTargetZoneItemId: DraggableUtil.getTargetZoneItemIdFromElementAttribute(event.target),
            }
        },
        getUpdatedDraggableItemRect(event) {
            const currentRect = DraggableUtil.getRectFromElementAttributes(event.target)
            return {
                x: this.getUpdatedDraggableItemRectX(event, currentRect.x),
                y: this.getUpdatedDraggableItemRectY(event, currentRect.y),
                width: this.getUpdatedDraggableItemRectWidth(event),
                height: this.getUpdatedDraggableItemRectHeight(event),
            }
        },
        getUpdatedDraggableItemRectX(event, currentRectX) {
            const dx = this.isResizeEvent(event) ? event.deltaRect.left : event.dx
            return currentRectX + dx
        },
        getUpdatedDraggableItemRectY(event, currentRectY) {
            const dy = this.isResizeEvent(event) ? event.deltaRect.top : event.dy
            return currentRectY + dy
        },
        getUpdatedDraggableItemRectWidth(event) {
            return event.rect.width
        },
        getUpdatedDraggableItemRectHeight(event) {
            return event.rect.height
        },
        updateDraggableItemAttributes(draggableItemElement, rect) {
            DraggableUtil.saveRectAsElementAttributes(draggableItemElement, rect)
        },
        isResizeEvent(event) {
            return event.type.includes('resize')
        },
    },
    mounted() {
        this.configureInteractor()
    },
    destroyed() {
        this.interactor.unset()
        this.interactor = null
    },
}
</script>

<style scoped lang="stylus">
.az-draggable
    pointer-events none

    > *
        pointer-events auto
</style>
