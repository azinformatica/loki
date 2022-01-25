<template>
    <v-app class="az-template-gmail">
        <az-loading></az-loading>

        <az-aside width="250">
            <div class="az-aside">
                <div class="logo">
                    <az-logo />
                </div>
                <div v-if="showMainAction" class="action">
                    <slot name="main-action" />
                </div>
                <div class="menu">
                    <az-menu />
                </div>
            </div>
            <template v-slot:banner>
              <slot name="bannerAside"></slot>
            </template>
        </az-aside>

        <v-toolbar app height="60" class="toolbar">
            <v-icon class="mobile_menu" @click="showAside()">dehaze</v-icon>
            <img class="mobile" :src="logoMobile" />
            <div class="top-search">
                <div class="input-search">
                    <input
                        class="input-text"
                        v-model="searchText"
                        :placeholder="placeholderSearch"
                        @keyup.enter="$emit('searchEvent', searchText)"
                    />
                </div>
                <v-btn class="icon-search" fab dark small depressed @click="$emit('searchEvent', searchText)">
                    <v-icon small>search</v-icon>
                </v-btn>
            </div>
            <v-spacer></v-spacer>
            <az-notification
                @open="$emit('openNotifications')"
                @close="$emit('closeNotifications')"
                @paginate="$emit('paginateNotifications')"
                @refresh="$emit('refreshNotifications')"
                @read="$emit('readNotifications')"
                @visit="visitNotification"
                @remove="removeNotification"
            />
            <az-avatar color="white" />
        </v-toolbar>
        <v-content>
            <v-container fluid class="container">
                <az-alert />
                <slot />
                <v-footer app inset>
                    <az-file-progress></az-file-progress>
                    <az-about />
                </v-footer>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
import AzAlert from '../AzAlert'
import AzFileProgress from '../../file/AzFileProgress'
import AzLoading from '../AzLoading'
import mutationTypes from '../../../store/mutation-types'
import AzNotification from '../AzNotification'

export default {
    components: { AzNotification, AzLoading, AzAlert, AzFileProgress },
    props: {
        showMainAction: {
            type: Boolean,
            default: true
        },
        placeholderSearch: {
            type: String,
            default: 'O que você procura?'
        }
    },
    data() {
        return {
            searchText: ''
        }
    },
    computed: {
        logoMobile() {
            return this.$store.state.loki.product.logoMobile
        }
    },
    methods: {
        removeNotification(message) {
            this.$emit('removeNotification', message)
        },
        showAside() {
            this.$store.commit(mutationTypes.SET_ASIDE_HIDE, true)
        },
        visitNotification(message) {
            this.$emit('visitNotification', message)
        }
    }
}
</script>
<style lang="stylus">
.az-template-gmail
    .mobile_menu
        display: none
    .az-aside
        .logo
            height 60px
            border-right 1px solid rgba(255, 255, 255, 0.1)
            background-color: var(--v-primary-lighten1) !important
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .container
        background-color #eee
        height 100%
        padding: 0
    .toolbar
        box-shadow 0 2px 4px -1px rgba(0, 0, 0, .2)
        background-color: var(--v-primary-lighten1) !important
        .top-search
            width 400px
            height 28px
            background-color: var(--v-primary-darken1) !important
            display flex
            align-items center
            .input-search
                display flex
                transition 0.2s
                .input-text
                    height 28px
                    padding 10px 15px
                    width 400px
                    font-size 12px
                    outline none
                    color: #fff
            ::placeholder
                color: rgba(255, 255, 255, 0.3)
            :-ms-input-placeholder
                color: #cccccc !important
            .icon-search
                width: 28px
                height 28px
                margin: 0 10px 0 0
                padding: 0
                font-weight normal
                background-color: var(--v-primary-darken1) !important
                border-radius 0
                color: rgba(255, 255, 255, 0.3)

            .btn-search
                margin-right: 10px
                padding: 5px 10px

                i
                    color: rgba(255, 255, 255, 0.8)
                    font-size: 13px
                    font-weight: bold

body
    background-color: #eee

.application.theme--light
    background: unset !important

.application--wrap
    min-height: unset !important

html
    overflow-y: auto

@media (max-width: 720px)
    .az-template-gmail
        .mobile_menu
            margin-right: 10px
            display: unset
            top: 1px
            position: relative
            color white !important

        .top-search
            display none !important

        .no-mobile
            display: none !important
</style>
