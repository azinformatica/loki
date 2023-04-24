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
        <v-btn icon slot="activator" @click="$emit('read')">
            <v-badge right overlap color="secondary">
                <span slot="badge" v-if="hasNotificationsToRead">{{ notification.unread }}</span>
                <v-icon color="white">mdi-bell</v-icon>
            </v-badge>
        </v-btn>
        <v-list>
            <div class="notification__top">
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
                <v-list-tile
                    v-for="(message, index) in notification.messages"
                    :key="index"
                    :class="getNotificationCardClass(message)"
                >
                    <div @click="$emit('visit', message)">
                        <div v-html="message.text" class="text" />
                        <div class="when">
                            <v-icon size="14px">mdi-alarm</v-icon>
                            {{ message.when | azElapsedTime }}
                        </div>
                    </div>
                    <div>
                        <a @click.prevent="$emit('remove', message)">
                            <v-icon size="14px">mdi-close</v-icon>
                        </a>
                    </div>
                </v-list-tile>
                <v-list-tile v-if="notification.viewMore">
                    <a class="more" @click="$emit('paginate')">Ver mais</a>
                </v-list-tile>
                <span id="notificationListEnd" style="visibility: hidden">Fim das notificações.</span>
            </div>
            <div v-else class="notification notification__top">Nenhuma notificação encontrada...</div>
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
    },
}
</script>

<style lang="stylus">
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
        .v-list__tile
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

@media (max-width: 720px)
    .notification
        &__no-mobile
            display none !important
</style>
