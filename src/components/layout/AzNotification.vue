<template>
    <v-menu
        offset-y
        transition="slide-x-transition"
        bottom
        left
        class="notification notification__no-mobile"
        :close-on-content-click="false"
        @input="setVisibility"
    >
        <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="$emit('read')">
                <v-badge :left="isBadgeLeft" :offset-x="badgeOffsetX" :offset-y="badgeOffsetY" overlap :color="badgeColor" class="badgeNumber">
                    <span slot="badge" v-if="hasNotificationsToRead">{{ notification.unread }}</span>
                    <v-icon :size="notificationIconSize" :color="notificationIconColor">{{notificationIcon}}</v-icon>
                </v-badge>
            </v-btn>
        </template>
        <v-list>
            <div v-if="!hideTitle" class="notification__top">
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
                    <div @click="$emit('visit', message)">
                        <div v-html="message.text" class="text" />
                        <div class="when">
                            <v-icon :size="whenIconSize" :color="whenIconColor">{{whenIcon}}</v-icon>
                            {{ message.when | azElapsedTime }}
                        </div>
                    </div>
                    <div v-if="!hideCloseIcon">
                        <a @click.prevent="$emit('remove', message)">
                            <v-icon :size="closeIconSize" :color="closeIconColor">{{closeIcon}}</v-icon>
                        </a>
                    </div>
                </v-list-item>
                <v-list-item class="listItemMore" v-if="notification.viewMore">
                    <div v-if="isViewMoreLoading" class="more">
                        <v-progress-circular indeterminate :color="loadingViewMoreColor" :size="loadingViewMoreSize"/>
                    </div>
                    <a v-else class="more" @click="pagination">{{viewMoreText}}</a>
                </v-list-item>
              <div class="endNotification">
                <span v-if="!hideEndNotificationText && notification.endNotification" id="notificationListEnd">{{endNotificationText}}</span>
              </div>
            </div>
            <div v-else class="notification notification__top">{{noNotificationText}}</div>
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
            default: false
        }
    },
    data() {
        return {
            isOpen: false,
            processUpdate: undefined,
            isViewMoreLoading: false
        }
    },
    watch: {
        'notification.messages.length'() {
            this.isViewMoreLoading = false
        }
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
        notificationIconColor() {
            return this.loki.notificationConfig.notificationIconColor
        },
        notificationIconSize() {
            return this.loki.notificationConfig.notificationIconSize
        },
        whenIcon() {
            return this.loki.notificationConfig.whenIcon
        },
        whenIconColor() {
            return this.loki.notificationConfig.whenIconColor
        },
        whenIconSize() {
            return this.loki.notificationConfig.whenIconSize
        },
        closeIcon() {
            return this.loki.notificationConfig.closeIcon
        },
        closeIconColor() {
            return this.loki.notificationConfig.closeIconColor
        },
        closeIconSize() {
            return this.loki.notificationConfig.closeIconSize
        },
        badgeColor() {
            return this.loki.notificationConfig.badgeColor
        },
        badgeOffsetX(){
            return this.loki.notificationConfig.badgeOffsetX
        },
        badgeOffsetY(){
            return this.loki.notificationConfig.badgeOffsetY
        },
        isBadgeLeft() {
            return this.loki.notificationConfig.isBadgeLeft
        },
        hideCloseIcon() {
            return this.loki.notificationConfig.hideCloseIcon
        },
        hideTitle() {
            return this.loki.notificationConfig.hideTitle
        },
        hideEndNotificationText() {
            return this.loki.notificationConfig.hideEndNotificationText
        },
        changeNotificationUnreadColor() {
            return this.loki.notificationConfig.changeNotificationUnreadColor
        },
        notificationUnreadColor() {
            return this.loki.notificationConfig.notificationUnreadColor
        },
        allowLoadingViewMore() {
            return this.loki.notificationConfig.allowLoadingViewMore
        },
        loadingViewMoreColor() {
            return this.loki.notificationConfig.loadingViewMoreColor
        },
        loadingViewMoreSize() {
            return this.loki.notificationConfig.loadingViewMoreSize
        },
        endNotificationText() {
            return this.loki.notificationConfig.endNotificationText
        },
        noNotificationText() {
            return this.loki.notificationConfig.noNotificationText
        },
        viewMoreText(){
            return this.loki.notificationConfig.viewMoreText
        }
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
            if(this.changeNotificationUnreadColor){
                return this.notificationUnreadColor
            }else {
                return {
                    notification__card: true,
                    notification__unread: !message.read
                }
            }
        },
        getActiveFilterClass(filter) {
            return {
                'font-weight-bold': filter === this.activeFilter
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
            if(this.allowLoadingViewMore){
                this.isViewMoreLoading = true
            }
            this.$emit('paginate')
        }
    }
}
</script>

<style lang="stylus">
.endNotification
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
