<template>
    <div :class="`${className} az-draggable-item`" :id="id">
        <slot> </slot>
    </div>
</template>

<script>
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
        this.configureAttributeElementTargetZoneItemId()
        this.configureElementRect()
        this.getDraggableTargetZoneItemElement()
    },
    destroyed() {
        this.getMutationObserver().disconnect()
        this.getResizeObserver().disconnect()
    },
    watch: {
        targetZoneItemId() {
            this.configureAttributeElementTargetZoneItemId()
        },
        rect() {
            this.configureElementRect()
        },
    },
    methods: {
        configureAttributeElementTargetZoneItemId() {
            this.$el.setAttribute('target-zone-item-id', this.targetZoneItemId)
        },
        configureMutationObserver() {
            this.observeCurrentElementAttributesChanges()
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
        observeCurrentElementAttributesChanges() {
            this.getMutationObserver().observe(this.$el, {
                attributes: true,
                attributeFilter: ['data-x', 'data-y', 'data-width', 'data-height', 'target-zone-item-id'],
            })
        },
        observeCurrentElementParentElementChildListChange() {
            this.getMutationObserver().observe(this.$parent.$el, {
                childList: true,
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
        },
        observeTargetZoneElementResize() {
            if (!this.draggableTargetZoneItemElement) return
            this.getResizeObserver().observe(this.draggableTargetZoneItemElement)
        },
        unobserveTargetZoneElementResize() {
            if (!this.draggableTargetZoneItemElement) return
            this.getResizeObserver().unobserve(this.draggableTargetZoneItemElement)
        },
        resizeObserverCallback() {
            this.updateElementStyle()
        },
        getDraggableTargetZoneItemElement() {
            this.unobserveTargetZoneElementResize()
            const targetZoneItemId = this.$el.getAttribute('target-zone-item-id')
            const selectors = `[id="${targetZoneItemId}"]`
            this.draggableTargetZoneItemElement = document.querySelector(selectors)
            this.observeTargetZoneElementResize()
        },
        configureElementRect() {
            if (!this.rect) return
            this.configureElementAttribute('data-x', this.rect.x)
            this.configureElementAttribute('data-y', this.rect.y)
            this.configureElementAttribute('data-width', this.rect.width)
            this.configureElementAttribute('data-height', this.rect.height)
        },
        configureElementAttribute(rectAttributeName, rectAttributeValue) {
            if (rectAttributeValue == null) return
            this.$el.setAttribute(rectAttributeName, rectAttributeValue)
        },
        getElementAttributeValueAsInt(rectAttributeName) {
            return parseInt(this.$el.getAttribute(rectAttributeName)) || 0
        },
        updateElementStyleWidth() {
            const rectWidth = this.getElementAttributeValueAsInt('data-width')
            this.$el.style.width = rectWidth ? `${rectWidth}px` : ''
        },
        updateElementStyleHeight() {
            const rectHeight = this.getElementAttributeValueAsInt('data-height')
            this.$el.style.height = rectHeight ? `${rectHeight}px` : ''
        },
        updateElementStyle() {
            this.updateElementStyleTransform()
            this.updateElementStyleWidth()
            this.updateElementStyleHeight()
        },
        updateElementStyleTransform() {
            const origin = this.getOriginPosition()
            const destination = this.getDestinationPosition()
            const rect = {
                x: this.getElementAttributeValueAsInt('data-x'),
                y: this.getElementAttributeValueAsInt('data-y'),
            }

            const translateX = destination.x - origin.x + rect.x
            const translateY = destination.y - origin.y + rect.y

            this.$el.style.transform = `translate(${translateX}px, ${translateY}px)`
        },
        getOriginPosition() {
            const transform = this.$el.style.transform
            this.$el.style.transform = ''
            const elementRect = this.$el.getBoundingClientRect()
            const parentElementRect = this.$parent.$el.getBoundingClientRect()
            this.$el.style.transform = transform
            return {
                x: elementRect.x - parentElementRect.x,
                y: elementRect.y - parentElementRect.y,
            }
        },
        getDestinationPosition() {
            const parentElementRect = this.$parent.$el.getBoundingClientRect()
            if (this.draggableTargetZoneItemElement) {
                const draggableTargetZoneElementRect = this.draggableTargetZoneItemElement.getBoundingClientRect()
                return {
                    x: draggableTargetZoneElementRect.x - parentElementRect.x,
                    y: draggableTargetZoneElementRect.y - parentElementRect.y,
                }
            }
            return { x: 0, y: 0 }
        },
    },
}
</script>
