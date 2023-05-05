<template>
    <div class="az-bpm-timeline">
        <div v-if="visibleItemsLength" class="az-bpm-timeline__timeline">
            <v-timeline>
                <template v-for="timelineItem of visibleTimelineItems">
                    <v-timeline-item v-if="timelineItem.duration" hide-dot right>
                        <template v-if="!$vuetify.breakpoint.smAndDown" #opposite>
                            <p class="grey--text text--darken-2 font-italic text-right mb-0 mr-n9">
                                {{ timelineItem.duration }}
                            </p>
                        </template>
                        <template v-else #default>
                            <p class="grey--text text--darken-2 font-italic text-left mb-0 ml-n9">
                                {{ timelineItem.duration }}
                            </p>
                        </template>
                    </v-timeline-item>
                    <v-timeline-item
                        :icon="timelineItem.icon"
                        color="grey lighten-2"
                        icon-color="grey darken-2"
                        large
                        right
                        fill-dot
                    >
                        <template v-if="!$vuetify.breakpoint.smAndDown" #opposite>
                            <p class="primary--text font-weight-bold text-no-wrap mb-0">
                                {{ timelineItem.date }}
                                <br />
                                {{ timelineItem.time }}
                            </p>
                        </template>
                        <template #default>
                            <p
                                v-if="$vuetify.breakpoint.smAndDown"
                                class="primary--text font-weight-bold text-no-wrap mb-2"
                            >
                                {{ timelineItem.date }} - {{ timelineItem.time }}
                            </p>
                            <v-card class="pa-4 grey--text text--darken-2" outlined flat>
                                <v-row dense align="center" justify="space-between">
                                    <v-col cols="auto">
                                        <p class="font-weight-bold mb-0">
                                            {{ timelineItem.title }}
                                        </p>
                                        <p class="mb-0">
                                            {{ timelineItem.subtitle }}
                                        </p>
                                    </v-col>
                                    <v-col cols="auto">
                                        <p class="font-weight-bold mb-0">
                                            {{ timelineItem.content }}
                                        </p>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </template>
                    </v-timeline-item>
                </template>
            </v-timeline>
            <v-row dense align="center" justify="space-between">
                <v-col cols="auto">
                    <a v-if="seeMoreLength" @click="seeMore"> Ver mais {{ seeMoreLength }} </a>
                </v-col>
                <v-col cols="auto">
                    <p class="text-right grey--text text--lighten-1 mb-0">
                        {{ visibleItemsLength }} de {{ timelineItems.length }} - Registros
                    </p>
                </v-col>
            </v-row>
        </div>
        <div v-else class="az-bpm-timeline__empty">
            <slot name="empty"></slot>
        </div>
    </div>
</template>

<script>
import AzBpmHistory from '../../utils/AzBpmHistory'

export default {
    name: 'AzBpmHistory',
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
.az-bpm-timeline
    &__empty
        width 100%

    &__timeline
        max-width 900px
        margin auto

        > .row
            margin-left: 196px

        .v-card
            border-width 3px !important

        .v-timeline::before
            left 147px !important

        .v-timeline-item
            &__opposite
                min-width 100px
                width 100px
                flex 0 1 auto

            &__body
                max-width calc(100% - 196px) !important

            &__dot
                box-shadow none

            &--after
                justify-content flex-end

@media (max-width: 960px)
    .az-bpm-timeline
        padding-right 20px

        &__timeline
            > .row
                margin-left: 96px

            .v-timeline::before
                left 47px !important

            .v-timeline-item
                &__body
                    max-width calc(100% - 96px) !important
</style>
