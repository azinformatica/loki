<template>
    <div :class="`${className} az-draggable-item`" :id="id">
        <slot></slot>
    </div>
</template>

<script>
import DraggableUtil from './DraggableUtil'
export default {
    name: 'AzDraggableItem',
    props: {
        id: {
            type: String,
            required: true,
        },
        targetZoneItemId: {
            type: String,
            default: '',
        },
        rect: {
            type: Object,
            default: () => null,
        },
    },
    data: () => ({
        draggableTargetZoneItemElement: null,
    }),
    computed: {
        className() {
            if (!this.$parent.$options.propsData) return ''
            return `${this.$parent.$options.propsData.name}-item`
        },
    },
    watch: {
        targetZoneItemId() {
            this.getDraggableTargetZoneItemElement()
            this.updateElementStyle()
        },
        rect() {
            this.updateElementStyle()
        },
    },
    mounted() {
        this.getDraggableTargetZoneItemElement()
        this.updateElementStyle()
    },
    methods: {
        getDraggableTargetZoneItemElement() {
            this.draggableTargetZoneItemElement = this.targetZoneItemId
                ? document.getElementById(this.targetZoneItemId)
                : null
        },
        updateElementStyle() {
            this.updateElementStyleTransform()
            this.updateElementStyleWidth()
            this.updateElementStyleHeight()
        },
        updateElementStyleWidth() {
            this.$el.style.width = this.rect && this.rect.width ? `${this.rect.width}px` : ''
        },
        updateElementStyleHeight() {
            this.$el.style.height = this.rect && this.rect.height ? `${this.rect.height}px` : ''
        },
        updateElementStyleTransform() {
            const origin = this.getOriginPosition()
            const targetZone = this.getTargetZonePosition()
            const rect = {
                x: (this.rect && this.rect.x) || 0,
                y: (this.rect && this.rect.y) || 0,
            }
            const translateX = Math.round(targetZone.x - origin.x + rect.x)
            const translateY = Math.round(targetZone.y - origin.y + rect.y)
            this.$el.style.transform = `translate(${translateX}px, ${translateY}px)`
        },
        getOriginPosition() {
            const transform = this.$el.style.transform
            this.$el.style.transform = ''
            const originRect = DraggableUtil.getElementRectRelativeToAnotherElementRect(this.$el, this.$parent.$el)
            this.$el.style.transform = transform
            return originRect
        },
        getTargetZonePosition() {
            const destinationElement = this.draggableTargetZoneItemElement || this.$parent.$el
            return DraggableUtil.getElementRectRelativeToAnotherElementRect(destinationElement, this.$parent.$el)
        },
    },
}
</script>
