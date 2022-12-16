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
                :style="draggableTargetZone.style"
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
                ref="draggableItemRef"
                v-for="draggable of formattedDraggables"
                :key="draggable.id"
                :id="draggable.id"
                :rect="draggable.rect"
                :target-zone-item-id="draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber]"
            >
                <div class="document-draggable-item__button-container">
                    <button @click="handleDeleteDraggable(draggable)" data-test="delete-draggable-button">
                        <v-icon size="12"> close</v-icon>
                    </button>
                </div>
                <div class="document-draggable-item__content">
                    <slot name="draggable-content" :draggable="draggable"></slot>
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
                style: this.createDraggableTargetZoneItemStyle(page),
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
        validDraggables() {
            return this.draggables.filter((draggable) => {
                return draggable.pageNumber && this.isDraggablePageLoaded(draggable)
            })
        },
        formattedDraggables() {
            return this.validDraggables.map(this.convertInputDraggable)
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
            if (this.isDraggableValidOnStopChanging(eventData)) {
                this.updateDraggable(eventData)
            } else {
                this.cancelDraggableChanges(eventData)
            }
        },
        handleDeleteDraggable(draggable) {
            this.deleteDraggable(draggable)
        },
        handleDraggableTargetZoneItemClick(eventData) {
            if (this.isCreatingDraggable) {
                this.createDraggable(eventData)
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
        isDraggablePageLoaded(draggable) {
            return !!this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber]
        },
        convertInputDraggable(draggable) {
            const draggableTargetZoneItemId = this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber] || ''
            const draggableTargetZone = this.findDraggableTargetZoneById(draggableTargetZoneItemId)

            const targetZoneItemId = draggableTargetZoneItemId
            const rect = {
                x: Math.round(draggable.rect.x * draggableTargetZone.rect.width),
                y: Math.round(draggable.rect.y * draggableTargetZone.rect.height),
                width: Math.round(draggable.rect.width * draggableTargetZone.rect.width),
                height: Math.round(draggable.rect.height * draggableTargetZone.rect.height)
            }

            return Object.assign({}, draggable,{ targetZoneItemId, rect })
        },
        convertOutputDraggable(draggable) {
            const draggableTargetZoneItemId = this.draggableTargetZoneIdPerLoadedPageNumber[draggable.pageNumber] || ''
            const draggableTargetZone = this.findDraggableTargetZoneById(draggableTargetZoneItemId)

            const rect = {
                x: DraggableUtil.round(draggable.rect.x / draggableTargetZone.rect.width),
                y: DraggableUtil.round(draggable.rect.y / draggableTargetZone.rect.height),
                width: DraggableUtil.round(draggable.rect.width / draggableTargetZone.rect.width),
                height: DraggableUtil.round(draggable.rect.height / draggableTargetZone.rect.height)
            }

            return Object.assign({}, draggable, { rect })
        },
        isDraggableValidOnStopChanging(eventData) {
            if (!eventData.draggableTargetZoneItemId) {
                return false
            }

            const draggableTargetZoneItemElement = document.getElementById(eventData.draggableTargetZoneItemId)
            if (!draggableTargetZoneItemElement) {
                return false
            }

            const draggableItemElement = eventData.draggableItemElement
            return DraggableUtil.isElementInsideAnotherElement(draggableItemElement, draggableTargetZoneItemElement)
        },
        isDraggableValidOnCreate(draggable, draggableTargetZoneItemId) {
            const draggableTargetZone = this.findDraggableTargetZoneById(draggableTargetZoneItemId)

            const draggableAbsoluteX = draggable.rect.x * draggableTargetZone.rect.width
            const draggableAbsoluteY = draggable.rect.y * draggableTargetZone.rect.height

            const maxDraggableAbsoluteX = (1.0 - draggable.rect.width) * draggableTargetZone.rect.width
            const maxDraggableAbsoluteY = (1.0 - draggable.rect.height) * draggableTargetZone.rect.height

            return draggableAbsoluteX <= maxDraggableAbsoluteX && draggableAbsoluteY <= maxDraggableAbsoluteY
        },
        cancelDraggableChanges(eventData) {
            const draggableIndex = this.findDraggableIndexById(eventData.draggableItemId)
            this.$refs.draggableItemRef[draggableIndex].updateElementAttributesWithProps()
        },
        updateDraggable(eventData) {
            const { draggable, draggableIndex } = this.findDraggableCloneAndIndex(eventData.draggableItemId)
            draggable.rect = eventData.draggableItemRect

            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            draggable.pageNumber = draggableTargetZone.pageNumber || null

            const { rect } = this.convertOutputDraggable(draggable)
            draggable.rect = rect

            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        createDraggable(eventData) {
            const draggable = DraggableUtil.createDraggable()
            draggable.rect.x = eventData.mousePositionRelativeToTargetZone.x
            draggable.rect.y = eventData.mousePositionRelativeToTargetZone.y

            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            draggable.pageNumber = draggableTargetZone.pageNumber
            draggable.rect.width = this.initialDraggableWidth
            draggable.rect.height = this.initialDraggableHeight

            const { rect } = this.convertOutputDraggable(draggable)
            draggable.rect = rect

            const isDraggableValid = this.isDraggableValidOnCreate(draggable, eventData.draggableTargetZoneItemId)
            if (isDraggableValid) this.$emit('create:draggable', { draggable })
        },
        deleteDraggable(draggable) {
            const draggableIndex = this.findDraggableIndexById(draggable.id)
            this.$emit('delete:draggable', { draggable, draggableIndex })
        },
        createDraggableTargetZoneItemStyle(page) {
            const pageRect = DraggableUtil.getElementRectRelativeToAnotherElementRect(page, page.parentElement)
            return {
                left: `${Math.round(pageRect.x)}px`,
                top: `${Math.round(pageRect.y)}px`,
                width: `${Math.round(pageRect.width)}px`,
                height: `${Math.round(pageRect.height)}px`
            }
        }
    },
}
</script>

<style scoped lang="stylus">
>>> .document-draggable-item
    border-radius 4px
    border 2px dashed var(--v-accent-base)
    background-color var(--v-accent-lighten3)
    user-select none
    -webkit-user-select none
    -khtml-user-select none
    -moz-user-select none
    -ms-user-select none

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
    width 0
    height 0
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
