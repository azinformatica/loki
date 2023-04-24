<template>
    <v-menu
        offset-y
        transition="slide-x-transition"
        bottom
        left
        class="notification notification__no-mobile"
        :close-on-content-click="false"
        v-model="menu"
        @input="setVisibility"
    >
        <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="$emit('read')">
                <v-badge right overlap :content="notification.unread" :value="notification.unread" class="badge-number">
                    <template v-slot:badge>
                        <span>{{ notification.unread }}</span>
                    </template>
                    <v-icon class="notification-icon">{{ notificationIcon }}</v-icon>
                </v-badge>
            </v-btn>
        </template>
        <v-list>
            <div v-if="title" class="notification__top">
                <b>{{ title }}</b>
                <div v-if="enableFiltering">
                    <a
                        v-for="filter in filters"
                        :key="filter"
                        :class="getActiveFilterClass(filter)"
                        @click="filterBy(filter)"
                    >
                        {{ filter }}
                    </a>
                </div>
            </div>
            <div class="notification__body" id="notificationContainer" v-if="hasMessages">
                <v-list-item
                    v-for="(message, index) in notification.messages"
                    :key="index"
                    :class="getNotificationCardClass(message)"
                >
                    <div @click="visit(message)">
                        <div v-html="message.text" class="text" />
                        <div class="when">
                            <v-icon v-if="whenIcon" class="when-icon">{{ whenIcon }}</v-icon>
                            {{ message.when | azElapsedTime }}
                        </div>
                    </div>
                    <div v-if="closeIcon">
                        <a @click.prevent="$emit('remove', message)">
                            <v-icon class="close-icon">{{ closeIcon }}</v-icon>
                        </a>
                    </div>
                </v-list-item>
                <v-list-item class="list-item-more" v-if="notification.viewMore">
                    <div v-if="isViewMoreLoading" class="more">
                        <v-progress-circular indeterminate class="loading-view-more" />
                    </div>
                    <a v-else class="more" @click="pagination">{{ viewMoreText }}</a>
                </v-list-item>
                <div class="end-notification">
                    <span v-if="endNotificationText && notification.endNotification" id="notificationListEnd">{{
                        endNotificationText
                    }}</span>
                </div>
            </div>
            <div v-else class="notification notification__top">{{ noNotificationText }}</div>
        </v-list>
    </v-menu>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import mutationTypes from '../../store/mutation-types'

export default {
    name: 'AzNotification',
    props: {
        enableFiltering: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isOpen: false,
            processUpdate: undefined,
            isViewMoreLoading: false,
            menu: false,
        }
    },
    watch: {
        'notification.messages.length'() {
            this.isViewMoreLoading = false
        },
    },
    computed: {
        ...mapState(['loki']),
        activeFilter() {
            return this.loki.notificationConfig.activeFilter
        },
        filters() {
            return this.loki.notificationConfig.filters
        },
        hasMessages() {
            return this.notification.messages && this.notification.messages.length > 0
        },
        hasNotificationsToRead() {
            return this.notification.unread > 0
        },
        notification() {
            return this.loki.notification
        },
        notificationConfig() {
            return this.loki.notificationConfig
        },
        title() {
            return this.loki.notificationConfig.title
        },
        notificationIcon() {
            return this.loki.notificationConfig.notificationIcon
        },
        whenIcon() {
            return this.loki.notificationConfig.whenIcon
        },
        closeIcon() {
            return this.loki.notificationConfig.closeIcon
        },
        allowLoadingViewMore() {
            return this.loki.notificationConfig.allowLoadingViewMore
        },
        endNotificationText() {
            return this.loki.notificationConfig.endNotificationText
        },
        noNotificationText() {
            return this.loki.notificationConfig.noNotificationText
        },
        viewMoreText() {
            return this.loki.notificationConfig.viewMoreText
        },
        closeMenuOnVisit() {
            return this.loki.notificationConfig.closeMenuOnVisit
        },
    },
    created() {
        this.setupUpdateInterval()
    },
    beforeDestroy() {
        this.cancelAutoUpdate()
    },
    methods: {
        ...mapMutations([mutationTypes.SET_NOTIFICATION_ACTIVE_FILTER]),
        askForPagination() {
            this.$emit('paginate')
        },
        askForRefresh() {
            if (!this.isOpen) {
                this.$emit('refresh', this.activeFilter)
            }
        },
        cancelAutoUpdate() {
            if (this.processUpdate) {
                window.clearInterval(this.processUpdate)
            }
        },
        filterBy(filter) {
            this.setNotificationActiveFilter(filter)
            this.askForRefresh()
        },
        getNotificationCardClass(message) {
            return {
                notification__card: true,
                notification__unread: !message.read,
            }
        },
        getActiveFilterClass(filter) {
            return {
                'font-weight-bold': filter === this.activeFilter,
            }
        },
        setupUpdateInterval() {
            const refreshTimeout = this.notificationConfig.refreshTimeout
            this.processUpdate = window.setInterval(this.askForRefresh, refreshTimeout)
        },
        setVisibility(visibility) {
            this.isOpen = visibility
            if (this.isOpen) {
                this.$emit('open')
            } else {
                this.$emit('close')
            }
        },
        pagination() {
            if (this.allowLoadingViewMore) {
                this.isViewMoreLoading = true
            }
            this.$emit('paginate')
        },
        visit(message) {
            if (this.closeMenuOnVisit) {
                this.menu = false
            }
            this.$emit('visit', message)
        },
    },
}
</script>

<style lang="stylus">
.loading-view-more
    color #487b9c
    height 25px!important
.close-icon
    font-size 14px!important
.when-icon
    font-size 14px!important
.notification-icon
    color white!important
.end-notification
    width 100%
    text-align center
    color gray
    font-size 14px
.notification
    &__body
        cursor pointer
        max-height 250px
        overflow-y auto
        .more
            width 100%
            text-align center
            color gray
            font-size 12px
        .v-list-item
            display flex
            justify-content space-between
            border-bottom 1px solid #eee
            width 400px
            padding 10px 20px !important
            height auto !important
            .text
                font-size 13px
                color #777
            .when
                margin-top 5px
                font-size 11px
                color #777
    &__top
        padding 10px 20px
        justify-content space-between
        border-bottom 1px solid #eee
        display flex
        font-size 13px
        color #777
        a
            color #777
            margin-left 15px
    &__unread
        background-color #edf2fa

@media (max-width 720px)
    .notification
        &__no-mobile
            display none !important
</style>
