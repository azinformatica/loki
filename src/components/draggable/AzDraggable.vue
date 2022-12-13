<template>
    <div :class="`${this.name} az-draggable`">
        <slot> </slot>
    </div>
</template>

<script>
import interact from 'interactjs'
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
                draggableItemId: this.getDraggableItemId(event.target),
                draggableItemRect: this.getDraggableItemRect(event),
                draggableTargetZoneItemId: this.getDraggableTargetZoneItemId(event.target),
            }
        },
        getDraggableItemId(draggableItemElement) {
            return draggableItemElement.getAttribute('id')
        },
        getDraggableItemRect(event) {
            return {
                x: this.getDraggableItemRectX(event),
                y: this.getDraggableItemRectY(event),
                width: this.getDraggableItemRectWidth(event),
                height: this.getDraggableItemRectHeight(event),
            }
        },
        getDraggableTargetZoneItemId(draggableItemElement) {
            return draggableItemElement.getAttribute('target-zone-item-id') || ''
        },
        getDraggableItemRectX(event) {
            const dataX = event.target.getAttribute('data-x')

            const x = parseFloat(dataX) || 0
            const dx = event.type.includes('resize') ? event.deltaRect.left : event.dx

            return x + dx
        },
        getDraggableItemRectY(event) {
            const dataY = event.target.getAttribute('data-y')

            const y = parseFloat(dataY) || 0
            const dy = event.type.includes('resize') ? event.deltaRect.top : event.dy

            return y + dy
        },
        getDraggableItemRectWidth(event) {
            return event.rect.width
        },
        getDraggableItemRectHeight(event) {
            return event.rect.height
        },
        updateDraggableItemAttributes(draggableItemElement, rect) {
            draggableItemElement.setAttribute('data-x', rect.x)
            draggableItemElement.setAttribute('data-y', rect.y)
            draggableItemElement.setAttribute('data-width', rect.width)
            draggableItemElement.setAttribute('data-height', rect.height)
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
