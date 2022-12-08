<template>
    <div class="az-draggable">
        <az-draggable-item
            v-for="(draggable, draggableIndex) of draggables"
            :key="draggable.id"
            :draggable-item-id="draggable.id"
            :draggable-item-rect="draggable.rect"
            :draggable-target-zone-item-rect="draggable.targetZoneRect"
        >
            <template v-slot:default>
                <slot
                    :draggable="draggable"
                    :draggableIndex="draggableIndex"
                >
                </slot>
            </template>
        </az-draggable-item>
    </div>
</template>

<script>
import interact from 'interactjs'
import AzDraggableItem from './AzDraggableItem'
export default {
    name: "AzDraggable",
    components: {
        AzDraggableItem
    },
    methods: {
        configureInteractor() {
            this.interactor = interact(`.${this.draggableName}`)
            this.configureResizable()
            this.configureDraggable()
        },
        configureResizable() {
            this.interactor = !this.resizable
                ? this.interactor
                : this.interactor.resizable({
                    edges: this.createResizableEdges(),
                    listeners: this.createResizableListeners(),
                    modifiers: this.createResizableModifiers(),
                    inertia: true
                })
        },
        configureDraggable() {
            this.interactor = this.interactor.draggable({
                modifiers: this.createDraggableModifiers(),
                listeners: this.createDraggableListeners(),
                autoScroll: true,
                inertia: true
            })
        },
        createResizableEdges() {
            return {
                left: true,
                right: true,
                bottom: true,
                top: true
            }
        },
        createResizableListeners() {
            return {
                start: event => this.createResizableListenersStartEvent(event),
                move: event => this.createResizableListenersMoveEvent(event),
                end: event => this.createResizableListenersEndEvent(event)
            }
        },
        createResizableModifiers() {
            return [
                interact.modifiers.restrictSize({
                    min: { width: this.minWidth, height: this.minHeight }
                })
            ]
        },
        createResizableListenersStartEvent(event) {
            event.target.classList.add(`${this.draggableName}--resize`)
            this.$emit('resizeStart', this.getEventData(event))
        },
        createResizableListenersMoveEvent(event) {
            this.$emit('resize', this.getEventData(event))
        },
        createResizableListenersEndEvent(event) {
            event.target.classList.remove(`${this.draggableName}--resize`)
            this.$emit('resizeEnd', this.getEventData(event))
        },
        createDraggableModifiers() {
            return []
        },
        createDraggableListeners() {
            return  {
                start: event => this.createDraggableListenersStart(event),
                move: event => this.createDraggableListenersMove(event),
                end: event => this.createDraggableListenersEnd(event)
            }
        },
        createDraggableListenersStart(event) {
            event.target.classList.add(`${this.draggableName}--drag`)
            this.$emit('dragStart', this.getEventData(event))
        },
        createDraggableListenersMove(event) {
            this.$emit('drag', this.getEventData(event))
        },
        createDraggableListenersEnd(event) {
            event.target.classList.remove(`${this.draggableName}--drag`)
            this.$emit('dragEnd', this.getEventData(event))
        },
        getEventData(event) {
            return {
                draggableItemId: event.target.getAttribute('draggable-item-id'),
                draggableItemIndex: this.getElementIndex(event.target),
                draggableItemRect: {
                    x: this.getUpdatedDraggableItemRectX(event),
                    y: this.getUpdatedDraggableItemRectY(event),
                    width: event.rect.width,
                    height: event.rect.height
                },
                draggableItem: event.target
            }
        },
        getUpdatedDraggableItemRectX(event) {
            const dataX = event.target.getAttribute('data-x')

            const x = parseFloat(dataX) || 0
            const dx = event.type.includes('resize') ? event.deltaRect.left : event.dx

            return x + dx
        },
        getUpdatedDraggableItemRectY(event) {
            const dataY = event.target.getAttribute('data-y')

            const y = parseFloat(dataY) || 0
            const dy = event.type.includes('resize') ? event.deltaRect.top : event.dy

            return y + dy
        },
        getElementIndex(element) {
            return Array.from(element.parentElement.children).indexOf(element);
        }
    },
    mounted() {
        this.configureInteractor()
    },
    props: {
        draggableName: {
            type: String,
            required: true
        },
        draggables: {
          type: Array,
          default: () => []
        },
        resizable: {
            type: Boolean,
            default: false
        },
        minWidth: {
            type: Number,
            default: 50
        },
        minHeight: {
            type: Number,
            default: 50
        }
    },
    data: () => ({
        interactor: null
    })
}
</script>

<style scoped lang="stylus">
.az-draggable
    position absolute
    top 15px
    left 0
    z-index 9999
</style>