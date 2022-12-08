<template>
    <div
        :class="`${$parent.$options.propsData.draggableTargetZoneName} az-draggable-target-zone-item`"
        :style="draggableTargetZonePosition"
        :draggable-target-zone-item-id="draggableTargetZoneItemId"
        @click="$emit('draggableTargetZoneItemClick', $event)"
    >
        <slot>
        </slot>
    </div>
</template>

<script>
export default {
    name: "AzDraggableTargetZoneItem",
    props: {
        draggableTargetZoneItemId: {
            type: String,
            required: true
        },
        draggableTargetZoneItemRect: {
            type: Object,
            required: true
        }
    },
    computed: {
        draggableTargetZonePosition() {
            return {
                left: `${this.draggableTargetZoneItemRect.x}px`,
                top: `${this.draggableTargetZoneItemRect.y}px`,
                width: `${this.draggableTargetZoneItemRect.width}px`,
                height: `${this.draggableTargetZoneItemRect.height}px`
            }
        }
    }
}
</script>

<style scoped lang="stylus">
.az-draggable-target-zone-item
    position absolute
</style>