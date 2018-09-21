<template>
    <v-app class="az-template">
        <az-loading></az-loading>
        <az-aside>
            <az-logo slot="logo"/>
            <az-menu slot="menu"/>
        </az-aside>
        <v-toolbar app height="60" class="az-template__toolbar">
            <v-icon class="mobile_menu" @click="showAside()">dehaze</v-icon>
            <az-title/>
            <v-spacer></v-spacer>
            <az-avatar/>
        </v-toolbar>
        <v-content>
            <v-container fluid class="az-template__container">
                <az-notification></az-notification>
                <slot></slot>
                <v-footer app inset>
                    <az-file-progress></az-file-progress>
                    <az-about/>
                </v-footer>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import AzNotification from './AzNotification'
    import AzFileProgress from '../file/AzFileProgress'
    import AzLoading from './AzLoading'
    import mutationTypes from '../../store/mutations-types'

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
    .mobile_menu
        display: none

    body
        background-color: #eee

    .application.theme--light
        background: unset !important

    .application--wrap
        min-height: unset !important

    .toolbar
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2)
        background-color: white !important

    .az-template
        &__container
            background-color: #eee
            height: 100%

    .container
        padding: 0

    html
        overflow-y: auto

    @media (max-width: 720px)
        .mobile_menu
            margin-right: 10px
            display: unset
            top: 1px
            position: relative

        .az-title__subtitle
            display: none

        .no-mobile
            display: none !important
</style>
