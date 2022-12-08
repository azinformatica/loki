<template>
    <div
        :class="`${$parent.$options.propsData.draggableName} az-draggable-item`"
        :style="draggablePosition"
        :draggable-item-id="draggableItemId"
        :data-x="draggableItemRect.x"
        :data-y="draggableItemRect.y"
    >
        <slot>
        </slot>
    </div>
</template>

<script>
export default {
    name: "AzDraggableItem",
    props: {
        draggableItemId: {
            type: String,
            required: true
        },
        draggableItemRect: {
            type: Object,
            required: true
        },
        draggableTargetZoneItemRect: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        draggablePosition() {
            return {
                left: `${this.draggableTargetZoneItemRectX + this.draggableItemRect.x}px`,
                top: `${this.draggableTargetZoneItemRectY + this.draggableItemRect.y}px`,
                width: `${this.draggableItemRect.width}px`,
                height: `${this.draggableItemRect.height}px`
            }
        },
        draggableTargetZoneItemRectX() {
            return this.draggableTargetZoneItemRect ? this.draggableTargetZoneItemRect.x : 0
        },
        draggableTargetZoneItemRectY() {
            return this.draggableTargetZoneItemRect ? this.draggableTargetZoneItemRect.y : 0
        }
    }
}
</script>

<style scoped lang="stylus">
.az-draggable-item
    position absolute
    z-index 9999
    -webkit-user-select: none
    -khtml-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    -o-user-select: none
    user-select: none
</style>