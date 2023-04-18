<template>
    <div>
        <az-draggable-target-zone
            name="document-draggable-target-zone"
            :accepted-draggables-names="['document-draggable']"
            @draggable-enter="handleDraggableEnter"
            @draggable-leave="handleDraggableLeave"
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
            ref="azDraggable"
            name="document-draggable"
            resizable
            @drag-start="handleStartChangeDraggable"
            @resize-start="handleStartChangeDraggable"
            @resize="handleChangeDraggable"
            @drag="handleChangeDraggable"
            @drag-end="handleEndChangeDraggable"
            @resize-end="handleEndChangeDraggable"
        >
            <az-draggable-item
                ref="draggableItemRef"
                v-for="draggable of formattedDraggables"
                :key="draggable.id"
                :id="draggable.id"
                :rect="draggable.rect"
                :target-zone-item-id="draggable.targetZoneItemId"
            >
                <div class="document-draggable-item__button-container">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <button
                                v-show="!draggable.groupId"
                                @click="handleLinkDraggable(draggable)"
                                data-test="link-draggable-button"
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-icon size="12">link</v-icon>
                            </button>
                        </template>
                        <span>{{ draggableLinkTooltip }}</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <button
                                v-show="draggable.groupId"
                                @click="handleUnlinkDraggable(draggable)"
                                data-test="unlink-draggable-button"
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-icon size="12">link_off</v-icon>
                            </button>
                        </template>
                        <span>{{ draggableUnlinkTooltip }}</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <button
                                @click="handleDeleteDraggable(draggable)"
                                data-test="delete-draggable-button"
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-icon size="12">close</v-icon>
                            </button>
                        </template>
                        <span>{{ draggableDeleteTooltip }}</span>
                    </v-tooltip>
                </div>
                <div class="document-draggable-item__background"></div>
                <div class="document-draggable-item__content">
                    <slot name="draggable-content" :draggable="draggable"></slot>
                </div>
            </az-draggable-item>
        </az-draggable>
    </div>
</template>

<script>
import AzDraggableTargetZone from '../draggable/AzDraggableTargetZone'
import AzDraggableTargetZoneItem from '../draggable/AzDraggableTargetZoneItem'
import AzDraggable from '../draggable/AzDraggable'
import AzDraggableItem from '../draggable/AzDraggableItem'
import DraggableUtil from '../draggable/DraggableUtil'
import _ from 'lodash'
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
        draggableLinkTooltip: {
            type: String,
            default: 'Vincular',
        },
        draggableUnlinkTooltip: {
            type: String,
            default: 'Desvincular',
        },
        draggableDeleteTooltip: {
            type: String,
            default: 'Remover',
        },
    },
    data: () => ({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        activeDraggable: null,
    }),
    computed: {
        totalPages() {
            return this.pages.length
        },
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
        loadedDraggables() {
            return this.draggables.filter(this.loadedDraggablesFilter)
        },
        formattedDraggables() {
            return this.loadedDraggables.map(this.formattedDraggableMapper)
        },
    },
    mounted() {
        window.addEventListener('resize', this.updateScreenSize)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateScreenSize)
    },
    methods: {
        loadedDraggablesFilter(draggable) {
            return this.hasValidPageNumber(draggable) && this.isDraggablePageLoaded(draggable)
        },
        formattedDraggableMapper(draggable) {
            return this.isBeingModified(draggable) ? this.activeDraggable : this.convertInputDraggable(draggable)
        },
        setActiveDraggable(draggableItemId) {
            const draggable = this.formattedDraggables.find((draggable) => draggable.id === draggableItemId)
            this.activeDraggable = _.cloneDeep(draggable)
        },
        updateActiveDraggable(eventData) {
            this.activeDraggable.rect = eventData.draggableItemRect
            this.activeDraggable.targetZoneItemId = eventData.draggableTargetZoneItemId
        },
        resetActiveDraggable() {
            this.activeDraggable = null
        },
        handleStartChangeDraggable(eventData) {
            this.setActiveDraggable(eventData.draggableItemId)
        },
        handleEndChangeDraggable(eventData) {
            if (this.areDraggableChangesValid(eventData)) {
                this.updateActiveDraggable(eventData)
                this.emitUpdatedDraggables()
            }
            this.resetActiveDraggable()
        },
        emitUpdatedDraggables() {
            if (!this.activeDraggable.groupId) {
                this.emitUpdatedUnlinkedDraggable()
            } else {
                this.emitUpdatedLinkedDraggables()
            }
        },
        emitUpdatedUnlinkedDraggable() {
            const draggableIndex = this.findDraggableIndexById(this.activeDraggable.id)
            const updatedDraggable = this.convertOutputDraggable(this.activeDraggable)
            this.$emit('update:draggable', { draggable: updatedDraggable, draggableIndex })
        },
        emitUpdatedLinkedDraggables() {
            this.draggables.forEach(this.emitUpdatedLinkedDraggable)
        },
        emitUpdatedLinkedDraggable(draggable, draggableIndex) {
            const { groupId } = this.activeDraggable
            if (this.belongsToGroup(draggable, groupId)) {
                const updatedDraggable = this.convertOutputDraggable(this.activeDraggable)
                updatedDraggable.id = draggable.id
                updatedDraggable.pageNumber = draggable.pageNumber
                this.$emit('update:draggable', { draggable: updatedDraggable, draggableIndex })
            }
        },
        handleChangeDraggable(eventData) {
            this.updateActiveDraggable(eventData)
        },
        handleDeleteDraggable(draggable) {
            this.setActiveDraggable(draggable.id)
            this.deleteAllDraggablesByGroupId(draggable.groupId)
            this.resetActiveDraggable()
        },
        handleDraggableTargetZoneItemClick(eventData) {
            if (this.isCreatingDraggable) {
                this.createDraggable(eventData)
            }
        },
        handleDraggableLeave(eventData) {
            eventData.draggableTargetZoneItemId = null
            eventData.draggableTargetZoneItemElement = eventData.draggableTargetZoneItemElement.parentElement
            this.updateActiveDraggable(eventData)
        },
        handleDraggableEnter(eventData) {
            this.updateActiveDraggable(eventData)
        },
        handleLinkDraggable(draggable) {
            const draggableIndex = this.findDraggableIndexById(draggable.id)
            const outputDraggable = this.convertOutputDraggable(draggable)
            this.$emit('link:draggable', { draggable: outputDraggable, draggableIndex })
        },
        handleUnlinkDraggable(draggable) {
            const draggableIndex = this.findDraggableIndexById(draggable.id)
            const outputDraggable = this.convertOutputDraggable(draggable)
            this.$emit('unlink:draggable', { draggable: outputDraggable, draggableIndex })
        },
        linkDraggablesByPageInterval(draggable, pageInterval) {
            draggable.groupId = DraggableUtil.generateUUID()
            for (let page = pageInterval.startPage; page <= pageInterval.endPage; page++) {
                if (draggable.pageNumber !== page) {
                    this.linkDraggable(draggable, page)
                }
            }
            const draggableIndex = this.findDraggableIndexById(draggable.id)
            this.$emit('update:draggable', { draggable, draggableIndex })
        },
        linkDraggable(draggable, page) {
            const linkedDraggable = _.cloneDeep(draggable)
            linkedDraggable.id = DraggableUtil.generateUUID()
            linkedDraggable.pageNumber = page
            this.$emit('create:draggable', { draggable: linkedDraggable })
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
            const round = (number) => Math.round(number)
            return {
                id: draggable.id,
                groupId: draggable.groupId,
                targetZoneItemId: draggableTargetZoneItemId,
                rect: {
                    x: round(draggable.percentX * draggableTargetZone.rect.width),
                    y: round(draggable.percentY * draggableTargetZone.rect.height),
                    width: round(draggable.percentWidth * draggableTargetZone.rect.width),
                    height: round(draggable.percentHeight * draggableTargetZone.rect.height),
                },
                content: draggable.content,
            }
        },
        convertOutputDraggable(draggable) {
            const draggableTargetZone = this.findDraggableTargetZoneById(draggable.targetZoneItemId)
            const round = (number) => DraggableUtil.round(number)
            return {
                id: draggable.id,
                groupId: draggable.groupId,
                pageNumber: draggableTargetZone.pageNumber,
                percentX: round(draggable.rect.x / draggableTargetZone.rect.width),
                percentY: round(draggable.rect.y / draggableTargetZone.rect.height),
                percentWidth: round(draggable.rect.width / draggableTargetZone.rect.width),
                percentHeight: round(draggable.rect.height / draggableTargetZone.rect.height),
            }
        },
        createDraggable(eventData) {
            const outputDraggable = this.convertOutputDraggable({
                rect: {
                    x: eventData.mousePositionRelativeToTargetZone.x,
                    y: eventData.mousePositionRelativeToTargetZone.y,
                    width: this.initialDraggableWidth,
                    height: this.initialDraggableHeight,
                },
                targetZoneItemId: eventData.draggableTargetZoneItemId,
                groupId: null,
                id: DraggableUtil.generateUUID(),
            })
            this.validateOutputDraggable(outputDraggable)
            this.$emit('create:draggable', { draggable: outputDraggable })
        },
        deleteAllDraggablesByGroupId(groupId) {
            this.draggables
                .filter((draggable) => this.belongsToGroup(draggable, groupId) || this.isBeingModified(draggable))
                .forEach(this.deleteDraggable)
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
                height: `${Math.round(pageRect.height)}px`,
                pointerEvents: this.isCreatingDraggable ? 'auto' : 'none',
            }
        },
        findDraggableIndexById(draggableId) {
            return this.draggables.findIndex((draggable) => draggable.id === draggableId)
        },
        findDraggableTargetZoneById(draggableTargetZoneId) {
            return this.draggableTargetZones.find((draggableTargetZone) => {
                return draggableTargetZone.id === draggableTargetZoneId
            })
        },
        validateOutputDraggable(draggable) {
            if (draggable.percentX < 0.0) {
                throw new Error('Extrapolou o limite esquerdo da página.')
            }
            if (draggable.percentY < 0.0) {
                throw new Error('Extrapolou o limite superior da página.')
            }
            if (draggable.percentX + draggable.percentWidth > 1.0) {
                throw new Error('Extrapolou o limite direito da página.')
            }
            if (draggable.percentY + draggable.percentHeight > 1.0) {
                throw new Error('Extrapolou o limite inferior da página.')
            }
        },
        areDraggableChangesValid(eventData) {
            if (!eventData.draggableTargetZoneItemId) {
                return false
            }
            const draggableTargetZoneItemElement = document.getElementById(eventData.draggableTargetZoneItemId)
            if (!draggableTargetZoneItemElement) {
                return false
            }
            const draggableIndex = this.findDraggableIndexById(eventData.draggableItemId)
            const draggable = this.draggables[draggableIndex]
            const draggableTargetZone = this.findDraggableTargetZoneById(eventData.draggableTargetZoneItemId)
            if (draggable.groupId && draggableTargetZone.pageNumber !== draggable.pageNumber) {
                return false
            }
            const draggableItemElement = eventData.draggableItemElement
            return DraggableUtil.isElementInsideAnotherElement(draggableItemElement, draggableTargetZoneItemElement)
        },
        belongsToGroup(draggable, groupId) {
            return groupId && draggable.groupId === groupId
        },
        isBeingModified(draggable) {
            return this.activeDraggable && draggable.id === this.activeDraggable.id
        },
        hasValidPageNumber(draggable) {
            return draggable.pageNumber && draggable.pageNumber > 0
        },
    },
}
</script>

<style scoped lang="stylus">
>>> .document-draggable-item
    position absolute
    top 0
    left 0
    border-radius 4px
    border 2px dashed var(--v-accent-lighten1)
    user-select none
    -webkit-user-select none
    -khtml-user-select none
    -moz-user-select none
    -ms-user-select none
    &__content
        width 100%
        height 100%
        overflow hidden
    &__background
        position absolute
        inset 0
        opacity 0.2
        background-color var(--v-accent-base)
        z-index -1
    &__button-container
        display none
        position absolute
        background-color var(--v-accent-base)
        right 0
        top 0
        flex-direction row
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
                    color var(--v-accent-lighten4)
            i
                height 100%
                width 100%
                color var(--v-accent-darken4)
    &:hover
        border 2px solid var(--v-accent-base)
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