<template>
    <div>
        <az-draggable-target-zone
            draggable-target-zone-name="document-draggable-target-zone"
            draggable-name="document-draggable"
            :draggable-target-zones="draggableTargetZones"
            @draggableEnter="handleDraggableEnter"
            @draggableLeave="handleDraggableLeave"
            @draggableTargetZoneItemClick="handleDraggableTargetZoneItemClick"
        />
        <az-draggable
            draggable-name="document-draggable"
            :draggables="formattedDraggables"
            @dragStart="handleStartChangeDraggable"
            @drag="handleChangeDraggable"
            @dragEnd="handleEndChangeDraggable"
            @resizeStart="handleStartChangeDraggable"
            @resize="handleChangeDraggable"
            @resizeEnd="handleEndChangeDraggable"
            resizable
        >
            <template v-slot:default="{ draggable }">
                <div class="document-draggable__button-container">
                    <button @click="handleDeleteDraggable(draggable)">
                        <v-icon size="12">
                            close
                        </v-icon>
                    </button>
                </div>
                <div class="document-draggable__content">
                    <slot
                        name="draggable-content"
                        :draggable="draggable"
                    >
                    </slot>
                </div>
            </template>
        </az-draggable>
    </div>
</template>

<script>
import _ from 'lodash'
import AzDraggable from "../draggable/AzDraggable";
import AzDraggableTargetZone from "../draggable/AzDraggableTargetZone";
export default {
    name: "Draggable",
    components: {
        AzDraggableTargetZone,
        AzDraggable
    },
    props: {
        draggables: {
            type: Array,
            default: () => []
        },
        pages: {
            type: Array,
            default: () => []
        },
        isCreatingDraggable: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    }),
    computed: {
        loadedPages() {
            return this.pages.filter(page => page.getAttribute('data-loaded'))
        },
        draggableTargetZones() {
            return this.loadedPages.map((page, pageIndex) => ({
                id: `dsadasd-${pageIndex}`,
                rect: this.getElementCoordinatesRelativeToParent(page),
                pageNumber: this.getPageNumberAsInt(page),
                screenWidth: this.screenWidth,
                screenHeight: this.screenHeight,
            }))
        },
        draggableTargetZoneRectPerLoadedPageNumber() {
            const draggableTargetZoneRectPerLoadedPageNumber = {}
            for (const draggableTargetZone of this.draggableTargetZones) {
                draggableTargetZoneRectPerLoadedPageNumber[draggableTargetZone.pageNumber] = draggableTargetZone.rect
            }
            return draggableTargetZoneRectPerLoadedPageNumber
        },
        filteredDraggablesByLoadedPages() {
            return this.draggables.filter(draggable => !draggable.pageNumber || this.draggablePageIsLoaded(draggable))
        },
        formattedDraggables() {
            return this.filteredDraggablesByLoadedPages.map(draggable => ({
                ...draggable,
                targetZoneRect: this.draggableTargetZoneRectPerLoadedPageNumber[draggable.pageNumber] || null
            }))
        }
    },
    created() {
        window.addEventListener('resize', this.updateScreenSize)
    },
    destroy() {
        window.removeEventListener('resize', this.updateScreenSize)
    },
    methods: {
        handleStartChangeDraggable(eventData) {
            this.handleChangeDraggable(eventData)
        },
        handleEndChangeDraggable(eventData) {
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            if (!this.isDraggableValid(draggable)) {
                draggable.rect = this.getLastValidRect(eventData.draggableItem)
                draggable.pageNumber = this.getLastValidPageNumber(eventData.draggableItem)
                this.$emit('update:draggable', { draggable, draggableIndex })
            }
        },
        handleChangeDraggable(eventData) {
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect = eventData.draggableItemRect
            if (this.isDraggableValid(draggable)) {
                this.setLastValidRect(eventData.draggableItem, draggable.rect)
                this.setLastValidPageNumber(eventData.draggableItem, draggable.pageNumber)
            }
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleDraggableEnter(eventData) {
            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect.x = eventData.draggableItemPositionRelativeToTargetZone.x
            draggable.rect.y = eventData.draggableItemPositionRelativeToTargetZone.y
            draggable.pageNumber = draggableTargetZone.pageNumber
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleDraggableLeave(eventData) {
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect.x = eventData.draggableItemPositionRelativeToParent.x
            draggable.rect.y = eventData.draggableItemPositionRelativeToParent.y
            draggable.pageNumber = null
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleDeleteDraggable(draggable) {
            const draggableIndex = this.findDraggableIndexById(draggable.id)
            this.$emit('delete:draggable', { draggableIndex })
        },
        findDraggableCloneAndIndex(draggableId) {
            const draggableIndex = this.findDraggableIndexById(draggableId)
            const draggable = _.cloneDeep(this.draggables[draggableIndex])
            return { draggable, draggableIndex }
        },
        findDraggableIndexById(draggableId) {
            return this.draggables.findIndex(draggable => draggable.id === draggableId)
        },
        findDraggableTargetZoneById(draggableTargetZoneId) {
            return this.draggableTargetZones.find(draggableTargetZone => draggableTargetZone.id === draggableTargetZoneId)
        },
        updateScreenSize() {
            this.screenWidth = window.innerWidth
            this.screenHeight = window.innerHeight
        },
        getElementCoordinatesRelativeToElement(element, relativeElement) {
            const relativeElementRect = relativeElement.getBoundingClientRect()
            const elementRect = element.getBoundingClientRect()
            return {
                x: Math.round(elementRect.left - relativeElementRect.left),
                y: Math.round(elementRect.top - relativeElementRect.top),
                width: Math.round(elementRect.width),
                height: Math.round(elementRect.height)
            }
        },
        getElementCoordinatesRelativeToParent(element) {
            return this.getElementCoordinatesRelativeToElement(element, element.parentElement)
        },
        getPageNumberAsInt(page) {
            return parseInt(page.getAttribute('data-page-number'))
        },
        isDraggableValid(draggable) {
            return this.isDraggableRectValid(draggable) && !!draggable.pageNumber
        },
        isDraggableRectValid(draggable) {
            const draggableTargetZoneRect = this.draggableTargetZoneRectPerLoadedPageNumber[draggable.pageNumber]
            return (
                draggableTargetZoneRect &&
                draggable.rect.x >= 0 &&
                draggable.rect.y >= 0 &&
                draggable.rect.x + draggable.rect.width <= draggableTargetZoneRect.width &&
                draggable.rect.y + draggable.rect.height <= draggableTargetZoneRect.height
            )
        },
        setLastValidRect(draggableItem, lastValidRect) {
            draggableItem.setAttribute('last-valid-x', lastValidRect.x)
            draggableItem.setAttribute('last-valid-y', lastValidRect.y)
            draggableItem.setAttribute('last-valid-width', lastValidRect.width)
            draggableItem.setAttribute('last-valid-height', lastValidRect.height)
        },
        getLastValidRect(draggableItem) {
            return {
                x: parseInt(draggableItem.getAttribute('last-valid-x') || 0),
                y: parseInt(draggableItem.getAttribute('last-valid-y') || 0),
                width: parseInt(draggableItem.getAttribute('last-valid-width') || 0),
                height: parseInt(draggableItem.getAttribute('last-valid-height') || 0)
            }
        },
        setLastValidPageNumber(draggableItem, lastValidPageNumber) {
            draggableItem.setAttribute('last-valid-page-number', lastValidPageNumber)
        },
        getLastValidPageNumber(draggableItem) {
            return parseInt(draggableItem.getAttribute('last-valid-page-number') || null)
        },
        draggablePageIsLoaded(draggable) {
            return !!this.draggableTargetZoneRectPerLoadedPageNumber[draggable.pageNumber]
        },
        handleDraggableTargetZoneItemClick(eventData) {
            if (!this.isCreatingDraggable) return
            const draggableTargetZone = this.draggableTargetZones[eventData.draggableTargetZoneItemIndex]
            const draggable = this.createDraggable()
            draggable.rect.x = eventData.mousePositionInsideTargetZone.x
            draggable.rect.y = eventData.mousePositionInsideTargetZone.y
            draggable.pageNumber = draggableTargetZone.pageNumber
            if(this.isDraggableValid(draggable)) {
                this.$emit('create:draggable', { draggable })
            }
        },
        createDraggable() {
            return {
                rect: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 50
                },
                pageNumber: null,
                id: (new Date()).toISOString()
            }
        }
    }
}
</script>

<style scoped lang="stylus">
>>> .document-draggable
    border-radius 4px
    border 2px dashed var(--v-accent-base)
    background-color var(--v-accent-lighten3)

    &__content
        width 100%
        height 100%
        overflow hidden

    &__button-container
        display none
        position absolute
        background-color var(--v-primary-base)
        right -2px
        top -2px
        flex-direction column
        align-items center
        justify-content center
        border-radius 4px

        button
            display flex
            align-items center
            justify-content center
            width 16px
            height 16px
            border-radius 4px
            margin 0 2px 2px 2px

            &:first-of-type
                margin-top 2px

            &:hover
                background-color var(--v-primary-darken1)

            i
                height 100%
                width 100%


    &:hover
        border 2px solid var(--v-primary-base)
        background-color transparent

        .document-draggable__button-container
            display flex

>>> .document-draggable-target-zone--active
    border 4px dashed #8c8c8c

</style>