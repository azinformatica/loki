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
        mutationObserver: null,
        resizeObserver: null,
        draggableTargetZoneItemElement: null,
    }),
    computed: {
        className() {
            if (!this.$parent.$options.propsData) return ''
            return `${this.$parent.$options.propsData.name}-item`
        },
    },
    mounted() {
        this.configureMutationObserver()
        this.configureResizeObserver()
        this.updateElementAttributesWithProps()
        this.getDraggableTargetZoneItemElement()
    },
    destroyed() {
        this.getMutationObserver().disconnect()
        this.getResizeObserver().disconnect()
    },
    watch: {
        targetZoneItemId() {
            this.updateElementTargetZoneItemId()
        },
        rect() {
            this.updateElementRect()
        },
    },
    methods: {
        updateElementAttributesWithProps() {
            this.updateElementTargetZoneItemId()
            this.updateElementRect()
        },
        updateElementTargetZoneItemId() {
            DraggableUtil.saveTargetZoneItemIdAsElementAttribute(this.$el, this.targetZoneItemId)
        },
        configureMutationObserver() {
            this.observeCurrentElementParentElementChildListChange()
        },
        getMutationObserver() {
            if (!this.mutationObserver) {
                this.mutationObserver = new MutationObserver(this.mutationObserverCallback)
            }
            return this.mutationObserver
        },
        getResizeObserver() {
            if (!this.resizeObserver) {
                this.resizeObserver = new ResizeObserver(this.resizeObserverCallback)
            }
            return this.resizeObserver
        },
        observeCurrentElementParentElementChildListChange() {
            this.getMutationObserver().observe(this.$parent.$el, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [].concat(DraggableUtil.RECT_ATTRIBUTES, DraggableUtil.TARGET_ZONE_ITEM_ID_ATTRIBUTE),
            })
        },
        mutationObserverCallback() {
            this.getDraggableTargetZoneItemElement()
            this.updateElementStyle()
        },
        configureResizeObserver() {
            this.observeCurrentElementParentElementResize()
            this.observeTargetZoneElementResize()
        },
        observeCurrentElementParentElementResize() {
            this.getResizeObserver().observe(document.documentElement)
            this.getResizeObserver().observe(this.$parent.$el)
        },
        observeTargetZoneElementResize() {
            if (this.draggableTargetZoneItemElement) {
                this.getResizeObserver().observe(this.draggableTargetZoneItemElement)
            }
        },
        unobserveTargetZoneElementResize() {
            if (this.draggableTargetZoneItemElement) {
                this.getResizeObserver().unobserve(this.draggableTargetZoneItemElement)
            }
        },
        resizeObserverCallback() {
            this.updateElementStyle()
        },
        getDraggableTargetZoneItemElement() {
            this.unobserveTargetZoneElementResize()
            const targetZoneItemId = DraggableUtil.getTargetZoneItemIdFromElementAttribute(this.$el)
            this.draggableTargetZoneItemElement = targetZoneItemId ? document.getElementById(targetZoneItemId) : null
            this.observeTargetZoneElementResize()
        },
        updateElementRect() {
            DraggableUtil.saveRectAsElementAttributes(this.$el, this.rect)
        },
        updateElementStyle() {
            const rect = DraggableUtil.getRectFromElementAttributes(this.$el)
            this.updateElementStyleTransform(rect)
            this.updateElementStyleWidth(rect)
            this.updateElementStyleHeight(rect)
        },
        updateElementStyleWidth(rect) {
            this.$el.style.width = rect.width ? `${rect.width}px` : ''
        },
        updateElementStyleHeight(rect) {
            this.$el.style.height = rect.height ? `${rect.height}px` : ''
        },
        updateElementStyleTransform(rect) {
            const origin = this.getOriginPosition()
            const targetZone = this.getTargetZonePosition()

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
