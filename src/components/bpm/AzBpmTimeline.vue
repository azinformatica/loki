<template>
    <div>
        <div v-if="visibleItemsLength" class="az-bpm-timeline-wrapper">
            <v-timeline class="az-bpm-timeline">
                <template v-for="timelineItem of visibleTimelineItems">
                    <v-timeline-item
                        class="az-bpm-timeline-item"
                        :key="timelineItem.keyDuration"
                        v-if="timelineItem.duration"
                        hide-dot
                        :right="isSmallDevice"
                        :left="!isSmallDevice"
                    >
                        <template #default>
                            <p class="az-bpm-timeline-item__duration">
                                <i>
                                    {{ timelineItem.duration }}
                                </i>
                            </p>
                        </template>
                    </v-timeline-item>
                    <v-timeline-item
                        class="az-bpm-timeline-item"
                        :key="timelineItem.keyDate"
                        :icon="timelineItem.icon"
                        color="grey lighten-2"
                        icon-color="grey darken-2"
                        large
                        fill-dot
                        :right="isSmallDevice"
                        :left="!isSmallDevice"
                    >
                        <template #default>
                            <p class="az-bpm-timeline-item__datetime">
                                <b>
                                    {{ timelineItem.date }}
                                    <span v-if="isSmallDevice">
                                        {{ '-' }}
                                    </span>
                                    <br v-if="!isSmallDevice" />
                                    {{ timelineItem.time }}
                                </b>
                            </p>
                        </template>
                    </v-timeline-item>
                    <v-timeline-item class="az-bpm-timeline-item" :key="timelineItem.keyCard" right hide-dot>
                        <template #default>
                            <div class="az-bpm-timeline-item__card">
                                <div>
                                    <p class="az-bpm-timeline-item__card__title">
                                        <b>
                                            {{ timelineItem.title }}
                                        </b>
                                    </p>
                                    <p class="az-bpm-timeline-item__card__subtitle">
                                        {{ timelineItem.subtitle }}
                                    </p>
                                </div>
                                <div>
                                    <p class="az-bpm-timeline-item__card__content">
                                        <b>
                                            {{ timelineItem.content }}
                                        </b>
                                    </p>
                                </div>
                            </div>
                        </template>
                    </v-timeline-item>
                </template>
            </v-timeline>
            <div class="az-bpm-timeline-info">
                <a class="az-bpm-timeline-info__see-more" v-if="seeMoreLength" @click="seeMore">
                    Ver mais {{ seeMoreLength }}
                </a>
                <p class="az-bpm-timeline-info__counter">
                    {{ visibleItemsLength }} de {{ timelineItems.length }} - Registros
                </p>
            </div>
        </div>
        <slot name="empty"></slot>
    </div>
</template>

<script>
import AzBpmHistory from '../../utils/AzBpmHistory'

export default {
    name: 'AzBpmTimeline',
    props: {
        businessKey: {
            type: String,
            required: true,
        },
        processKey: {
            type: String,
            required: true,
        },
        initialVisibleItemsLength: {
            type: Number,
            default: 10,
            validator: (value) => value >= 0,
        },
        seeMoreStep: {
            type: Number,
            default: 10,
            validator: (value) => value >= 0,
        },
    },
    data() {
        return {
            azBpmHistory: null,
            history: [],
            visibleItemsLength: 0,
        }
    },
    computed: {
        isSmallDevice() {
            return this.$vuetify.breakpoint.smAndDown
        },
        visibleTimelineItems() {
            return this.timelineItems.slice(0, this.visibleItemsLength)
        },
        hiddenTimelineItemsLength() {
            return this.timelineItems.length - this.visibleItemsLength
        },
        seeMoreLength() {
            return Math.max(Math.min(this.seeMoreStep, this.hiddenTimelineItemsLength), 0)
        },
        timelineItems() {
            return this.history.map((currentLog, currentLogIndex) => {
                const previousLog = this.getPreviousItem(this.history, currentLogIndex)

                return {
                    date: this.formatTimelineDate(currentLog),
                    time: this.formatTimelineTime(currentLog),
                    duration: this.formatTimelineDuration(currentLog, previousLog),
                    icon: this.formatTimelineIcon(currentLog),
                    title: this.formatTimelineTitle(currentLog),
                    subtitle: this.formatTimelineSubtitle(currentLog),
                    content: this.formatTimelineContent(currentLog),
                    keyDate: this.formatTimelineKeyDate(currentLog),
                    keyCard: this.formatTimelineKeyCard(currentLog),
                    keyDuration: this.formatTimelineKeyDuration(currentLog),
                }
            })
        },
    },
    methods: {
        seeMore() {
            this.visibleItemsLength += this.seeMoreLength
        },
        getPreviousItem(items, itemIndex) {
            return items[itemIndex - 1] || null
        },
        formatTimelineDate(currentLog) {
            return this.$options.filters.azDate(currentLog.date, 'DD/MM/YYYY')
        },
        formatTimelineTime(currentLog) {
            return this.$options.filters.azDate(currentLog.date, 'HH[h]mm')
        },
        formatTimelineDuration(currentLog, previousLog) {
            return previousLog ? this.azBpmHistory.getHumanizedDuration(currentLog.date, previousLog.date) : null
        },
        formatTimelineIcon(currentLog) {
            return currentLog.icon
        },
        formatTimelineTitle(currentLog) {
            return currentLog.status
        },
        formatTimelineSubtitle(currentLog) {
            return [currentLog.assignee, currentLog.toAssignee].filter(Boolean).join(' » ')
        },
        formatTimelineContent(currentLog) {
            return currentLog.toTaskName || currentLog.taskName
        },
        formatTimelineKeyDate(currentLog) {
            return `key-date-${currentLog.date}`
        },
        formatTimelineKeyCard(currentLog) {
            return `key-card-${currentLog.date}`
        },
        formatTimelineKeyDuration(currentLog) {
            return `key-duration-${currentLog.date}`
        },
        initializeAzBpmHistory() {
            this.azBpmHistory = new AzBpmHistory(this.$store)
        },
        async fetchHistory() {
            this.history = await this.azBpmHistory.getHistory(this.processKey, this.businessKey)
            this.history.reverse()
            this.visibleItemsLength = Math.min(this.initialVisibleItemsLength, this.history.length)
        },
    },
    async created() {
        this.initializeAzBpmHistory()
        await this.fetchHistory()
    },
}
</script>

<style lang="stylus">
.az-bpm-timeline-wrapper
    max-width 900px
    margin auto

    .v-timeline::before
        left 147px !important

    .v-timeline-item
        &__dot
            box-shadow none

        &--after
            justify-content flex-end

            .v-timeline-item__body
                margin-top -92px
                margin-left 100px
                max-width calc(100% - 96px) !important

        &--before
            .v-timeline-item__body
                min-width 100px
                width 100px
                flex 0 1 auto
                max-width 100px !important

.az-bpm-timeline-item
    align-items center

    &__duration
        color #616161
        text-align right
        margin-right -36px

    &__datetime
        text-align right
        color var(--v-primary-base)
        white-space nowrap
        margin-bottom 0 !important

    &__card
        color #616161
        border-radius 4px
        border 3px solid #e0e0e0
        display flex
        flex-wrap wrap
        justify-content space-between
        align-items center
        padding 16px
        word-break break-word

        &__title
            margin-bottom 0 !important

        &__subtitle
            margin-bottom 0 !important

        &__content
            margin-bottom 0 !important

.az-bpm-timeline-info
    display flex
    justify-content space-between
    align-items center
    flex-wrap wrap
    margin-left 196px

    &__see-more
        color var(--v-primary-base)

    &__counter
        flex 1 1 auto
        text-align right
        color #bdbdbd
        margin-bottom 0 !important

    &__see-more + &__counter
        flex 0 1 auto

@media (max-width: 960px)
    .az-bpm-timeline-wrapper
        .v-timeline::before
            left 47px !important

        .v-timeline-item
            &__body
                margin-top 0 !important
                margin-left 0 !important

            &--fill-dot
                padding-bottom 0 !important

    .az-bpm-timeline-item
        &__duration
            text-align left
            margin-left -36px

        &__datetime
            text-align left
            display inline

    .az-bpm-timeline-info
        margin-left 96px
</style>
