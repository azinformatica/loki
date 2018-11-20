<template>
    <v-app class="az-template-default">
        <az-loading></az-loading>

        <az-aside>
            <div class="az-aside">
                <div class="logo">
                    <az-logo/>
                </div>
                <div class="menu">
                    <az-menu/>
                </div>
            </div>
        </az-aside>

        <v-toolbar app height="60" class="toolbar">
            <v-icon class="mobile_menu" @click="showAside()">dehaze</v-icon>
            <az-title/>
            <v-spacer></v-spacer>
            <az-avatar/>
        </v-toolbar>
        <v-content>
            <v-container fluid class="content-container">
                <az-notification></az-notification>
                <slot/>
                <v-footer app inset>
                    <az-file-progress></az-file-progress>
                    <az-about/>
                </v-footer>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import AzNotification from '../AzNotification'
    import AzFileProgress from '../../file/AzFileProgress'
    import AzLoading from '../AzLoading'
    import mutationTypes from '../../../store/mutations-types'

    export default {
        components: {AzLoading, AzNotification, AzFileProgress},
        methods: {
            showAside() {
                this.$store.commit(mutationTypes.SET_ASIDE_HIDE, true)
            }
        }
    }
</script>
<style lang="stylus">
    .az-template-default
        .az-aside
            .logo
                border-bottom 1px solid rgba(255,255,255,0.1)
                padding 5px
                height 120px

        .content-container
            background-color #eee
            height 100%
            padding: 0
        .toolbar
            box-shadow 0 2px 4px -1px rgba(0, 0, 0, .2)
            background-color white !important


        .mobile_menu
            display: none

    body
        background-color: #eee

    .application.theme--light
        background: unset !important

    .application--wrap
        min-height: unset !important


    html
        overflow-y: auto

    @media (max-width: 720px)
        .az-template-default
            .mobile_menu
                margin-right: 10px
                display: unset !important
                top: 1px
                position: relative
                color: var(--v-primary-base) !important

            .az-title__subtitle
                display: none

            .no-mobile
                display: none !important
</style>
