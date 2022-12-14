<template>
    <div>
        <az-draggable-target-zone
            name="document-draggable-target-zone"
            :accepted-draggables-names="['document-draggable']"
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
            @drag-end="handleEndChangeDraggable"
            @resize-end="handleEndChangeDraggable"
        >
            <az-draggable-item
                v-for="draggable of formattedDraggables"
                :key="draggable.id"
                :ref="draggable.id"
                :id="draggable.id"
                :rect="draggable.rect"
                :target-zone-item-id="draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber]"
            >
                <div class="document-draggable-item__button-container">
                    <button @click="handleDeleteDraggable(draggable)" data-test="delete-draggable-button">
                        <v-icon size="12"> close </v-icon>
                    </button>
                </div>
                <div class="document-draggable-item__content">
                    <slot name="draggable-content" :draggable="draggable"> </slot>
                </div>
            </az-draggable-item>
        </az-draggable>
    </div>
</template>

<script>
import _ from 'lodash'
import AzDraggableTargetZone from '../draggable/AzDraggableTargetZone'
import AzDraggableTargetZoneItem from '../draggable/AzDraggableTargetZoneItem'
import AzDraggable from '../draggable/AzDraggable'
import AzDraggableItem from '../draggable/AzDraggableItem'
import DraggableUtil from '../draggable/DraggableUtil'

export default {
    name: 'Draggable',
    components: {
        AzDraggableTargetZone,
        AzDraggableTargetZoneItem,
        AzDraggable,
        AzDraggableItem,
    },
    props: {
        draggables: {
            type: Array,
            default: () => [],
        },
        pages: {
            type: Array,
            default: () => [],
        },
        isCreatingDraggable: {
            type: Boolean,
            default: false,
        },
        initialDraggableWidth: {
            type: Number,
            default: 100,
        },
        initialDraggableHeight: {
            type: Number,
            default: 100,
        },
    },
    data: () => ({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
    }),
    computed: {
        loadedPages() {
            return this.pages.filter((page) => page.getAttribute('data-loaded'))
        },
        draggableTargetZones() {
            return this.loadedPages.map((page) => ({
                id: DraggableUtil.generateUUID(),
                rect: DraggableUtil.getElementRectRelativeToAnotherElementRect(page, page.parentElement),
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
            return this.draggables.filter((draggable) => !draggable.pageNumber || this.draggablePageIsLoaded(draggable))
        },
        formattedDraggables() {
            return this.filteredDraggablesByLoadedPages.map(this.assignTargetZoneItemIdToDraggable)
        },
    },
    mounted() {
        window.addEventListener('resize', this.updateScreenSize)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateScreenSize)
    },
    methods: {
        handleEndChangeDraggable(eventData) {
            if (!this.isDraggableValidOnStopChanging(eventData)) {
                return this.$refs[eventData.draggableItemId][0].updateElementAttributesWithProps()
            }
            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect = eventData.draggableItemRect
            draggable.pageNumber = draggableTargetZone.pageNumber || null
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        handleDeleteDraggable(draggable) {
            const draggableIndex = this.findDraggableIndexById(draggable.id)
            this.$emit('delete:draggable', { draggable, draggableIndex })
        },
        handleDraggableTargetZoneItemClick(eventData) {
            if (!this.isCreatingDraggable) return
            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            const draggable = DraggableUtil.createDraggable()
            draggable.rect.x = eventData.mousePositionRelativeToTargetZone.x
            draggable.rect.y = eventData.mousePositionRelativeToTargetZone.y
            draggable.rect.width = this.initialDraggableWidth
            draggable.rect.height = this.initialDraggableHeight
            draggable.pageNumber = draggableTargetZone.pageNumber
            if (this.isDraggableValidOnCreate(draggable, draggableTargetZone)) {
                this.$emit('create:draggable', { draggable })
            }
        },
        findDraggableCloneAndIndex(draggableId) {
            const draggableIndex = this.findDraggableIndexById(draggableId)
            const draggable = _.cloneDeep(this.draggables[draggableIndex])
            return { draggable, draggableIndex }
        },
        findDraggableIndexById(draggableId) {
            return this.draggables.findIndex((draggable) => draggable.id === draggableId)
        },
        findDraggableTargetZoneById(draggableTargetZoneId) {
            return this.draggableTargetZones.find((draggableTargetZone) => {
                return draggableTargetZone.id === draggableTargetZoneId
            })
        },
        updateScreenSize() {
            this.screenWidth = window.innerWidth
            this.screenHeight = window.innerHeight
        },
        getPageNumberAsInt(page) {
            return parseInt(page.getAttribute('data-page-number'))
        },
        draggablePageIsLoaded(draggable) {
            return !!this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber]
        },
        assignTargetZoneItemIdToDraggable(draggable) {
            const targetObject = {
                targetZoneItemId: this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber] || '',
            }
            return Object.assign(targetObject, draggable)
        },
        isDraggableValidOnStopChanging(eventData) {
            if (!eventData.draggableTargetZoneItemId) {
                return false
            }
            const draggableTargetZoneItemElement = document.getElementById(eventData.draggableTargetZoneItemId)
            const draggableItemElement = eventData.draggableItemElement
            return DraggableUtil.isElementInsideAnotherElement(draggableItemElement, draggableTargetZoneItemElement)
        },
        isDraggableValidOnCreate(draggable, draggableTargetZone) {
            const maxX = draggableTargetZone.rect.width - draggable.rect.width
            const maxY = draggableTargetZone.rect.height - draggable.rect.height
            return draggable.rect.x <= maxX && draggable.rect.y <= maxY
        },
    },
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
        right 0
        top 0
        flex-direction column
        align-items center
        justify-content center
        border-bottom-left-radius 4px
        padding-left 1px
        padding-bottom 1px

        button
            display flex
            align-items center
            justify-content center
            width 16px
            height 16px
            border-radius 2px
            margin: 2px

            &:hover
                i
                    color var(--v-primary-darken2)

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
