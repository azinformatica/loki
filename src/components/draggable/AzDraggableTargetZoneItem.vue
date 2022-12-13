<template>
    <div
        :class="`${className} az-draggable-target-zone-item`"
        :style="draggableTargetZoneRectStyle"
        :id="id"
        @click="handleClick"
    >
        <slot> </slot>
    </div>
</template>

<script>
export default {
    name: 'AzDraggableTargetZoneItem',
    props: {
        id: {
            type: String,
            required: true,
        },
        rect: {
            type: Object,
            default: () => null,
        },
    },
    computed: {
        className() {
            if (!this.$parent.$options.propsData) return ''
            return `${this.$parent.$options.propsData.name}-item`
        },
        draggableTargetZoneRectStyle() {
            return Object.assign(
                {},
                this.draggableTargetZoneItemTransform,
                this.draggableTargetZoneItemWidth,
                this.draggableTargetZoneItemHeight
            )
        },
        draggableTargetZoneItemTransform() {
            return this.rect ? { transform: `translate(${this.rect.x || 0}px, ${this.rect.y || 0}px)` } : {}
        },
        draggableTargetZoneItemWidth() {
            return this.rect && this.rect.width ? { width: `${this.rect.width}px` } : {}
        },
        draggableTargetZoneItemHeight() {
            return this.rect && this.rect.height ? { height: `${this.rect.height}px` } : {}
        },
    },
    methods: {
        handleClick(event) {
            this.$emit('click', this.getClickEventData(event))
        },
        getClickEventData(event) {
            const draggableTargetZoneItemElement = event.target
            const draggableTargetZoneItemRect = draggableTargetZoneItemElement.getBoundingClientRect()
            return {
                draggableTargetZoneItemElement,
                draggableTargetZoneItemId: draggableTargetZoneItemElement.id,
                mousePositionRelativeToTargetZone: {
                    x: Math.round(event.clientX - draggableTargetZoneItemRect.x),
                    y: Math.round(event.clientY - draggableTargetZoneItemRect.y),
                },
            }
        }
    },
}
</script>
