<template>
    <div :class="`${className} az-draggable-target-zone-item`" :id="id" @click="handleClick">
        <slot></slot>
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
    },
    computed: {
        className() {
            if (!this.$parent.$options.propsData) return ''
            return `${this.$parent.$options.propsData.name}-item`
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
        },
    },
}
</script>