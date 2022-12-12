<template>
    <div>
        <az-draggable-target-zone
            name="document-draggable-target-zone"
            :accepted-draggable-names="['document-draggable']"
            @draggable-enter="handleDraggableEnter"
            @draggable-leave="handleDraggableLeave"
        >
            <az-draggable-target-zone-item
                v-for="draggableTargetZone of draggableTargetZones"
                :key="draggableTargetZone.id"
                :id="draggableTargetZone.id"
                :rect="draggableTargetZone.rect"
                @click="handleDraggableTargetZoneItemClick"
            />
        </az-draggable-target-zone>
        <az-draggable
            name="document-draggable"
            resizable
            @drag-start="handleStartChangeDraggable"
            @drag="handleChangeDraggable"
            @drag-end="handleEndChangeDraggable"
            @resize-start="handleStartChangeDraggable"
            @resize="handleChangeDraggable"
            @resize-end="handleEndChangeDraggable"
        >
            <az-draggable-item
                v-for="draggable of formattedDraggables"
                :key="draggable.id"
                :id="draggable.id"
                :rect="draggable.rect"
                :target-zone-item-id="draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber]"
            >
                <div class="document-draggable-item__button-container">
                    <button
                        @click="handleDeleteDraggable(draggable)"
                        data-test="delete-draggable-button"
                    >
                        <v-icon size="12">
                            close
                        </v-icon>
                    </button>
                </div>
                <div class="document-draggable-item__content">
                    <slot
                        name="draggable-content"
                        :draggable="draggable"
                    >
                    </slot>
                </div>
            </az-draggable-item>
        </az-draggable>
    </div>
</template>

<script>
import _ from 'lodash'
import AzDraggableTargetZone from "../draggable/AzDraggableTargetZone";
import AzDraggableTargetZoneItem from "../draggable/AzDraggableTargetZoneItem";
import AzDraggable from "../draggable/AzDraggable";
import AzDraggableItem from "../draggable/AzDraggableItem";
export default {
    name: "Draggable",
    components: {
        AzDraggableTargetZone,
        AzDraggableTargetZoneItem,
        AzDraggable,
        AzDraggableItem
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
            return this.loadedPages.map(page => ({
                id: this.generateUUID(),
                rect: this.getElementCoordinatesRelativeToParent(page),
                pageNumber: this.getPageNumberAsInt(page),
                screenWidth: this.screenWidth,
                screenHeight: this.screenHeight,
            }))
        },
        draggableTargetZoneIdPerLoadedPageNumber() {
            const draggableTargetZoneIdPerLoadedPageNumber = {}
            for (const draggableTargetZone of this.draggableTargetZones) {
                draggableTargetZoneIdPerLoadedPageNumber[draggableTargetZone.pageNumber] = draggableTargetZone.id
            }
            return draggableTargetZoneIdPerLoadedPageNumber
        },
        filteredDraggablesByLoadedPages() {
            return this.draggables.filter(draggable => !draggable.pageNumber || this.draggablePageIsLoaded(draggable))
        },
        formattedDraggables() {
            return this.filteredDraggablesByLoadedPages.map(draggable => {
                draggable.targetZoneItemId = this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber] || ''
                return draggable
            })
        }
    },
    mounted() {
        window.addEventListener('resize', this.updateScreenSize)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateScreenSize)
    },
    methods: {
        handleStartChangeDraggable(eventData) {
            this.handleChangeDraggable(eventData)
        },
        handleEndChangeDraggable(eventData) {
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect = eventData.draggableItemRect
            if (!this.isDraggableValid(draggable)) {
                draggable.rect = this.getLastValidRect(eventData.draggableItemElement)
                draggable.pageNumber = this.getLastValidPageNumber(eventData.draggableItemElement)
            }
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleChangeDraggable(eventData) {
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect = eventData.draggableItemRect
            if (this.isDraggableValid(draggable)) {
                this.setLastValidRect(eventData.draggableItemElement, draggable.rect)
                this.setLastValidPageNumber(eventData.draggableItemElement, draggable.pageNumber)
            }
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleDraggableEnter(eventData) {
            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect.x = eventData.draggableItemRect.x
            draggable.rect.y = eventData.draggableItemRect.y
            draggable.pageNumber = draggableTargetZone.pageNumber
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleDraggableLeave(eventData) {
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect.x = eventData.draggableItemRect.x
            draggable.rect.y = eventData.draggableItemRect.y
            draggable.pageNumber = null
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleDeleteDraggable(draggable) {
            const draggableIndex = this.findDraggableIndexById(draggable.id)
            this.$emit('delete:draggable', { draggable, draggableIndex })
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
            const draggableTargetZoneId = this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber]
            const draggableTargetZone = this.findDraggableTargetZoneById(draggableTargetZoneId)
            return (
                draggableTargetZone &&
                draggable.rect.x >= 0 &&
                draggable.rect.y >= 0 &&
                draggable.rect.x + draggable.rect.width <= draggableTargetZone.rect.width &&
                draggable.rect.y + draggable.rect.height <= draggableTargetZone.rect.height
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
            return !!this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber]
        },
        handleDraggableTargetZoneItemClick(eventData) {
            if (!this.isCreatingDraggable) return
            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            const draggable = this.createDraggable()
            draggable.rect.x = eventData.mousePositionRelativeToTargetZone.x
            draggable.rect.y = eventData.mousePositionRelativeToTargetZone.y
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
                id: this.generateUUID()
            }
        },
        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0
                const v = c === 'x' ? r : (r&0x3|0x8)
                return v.toString(16)
            });
        }
    }
}
</script>

<style scoped lang="stylus">
>>> .document-draggable-item
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

        .document-draggable-item__button-container
            display flex

>>> .document-draggable
    position absolute
    top 0
    left 0
    z-index 9999

>>> .document-draggable-target-zone
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index 9998

>>> .document-draggable-target-zone-item
    position absolute
    margin 15px auto

    &--active
        border 4px dashed #8c8c8c

</style>