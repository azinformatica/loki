<template>
    <v-app class="az-template-vader" dark>
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
            <v-container fluid class="container">
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
    .application--wrap
        position: absolute !important
        width: 100%
        height: 100%
    .v-content
        height: 100%
    .az-template-vader
        font-family 'Open Sans' !important
        .az-about
            background-color var(--v-primary-lighten2) !important
            border-top 1px solid var(--v-primary-lighten2)
        .az-aside
            .logo
                border-bottom 1px solid rgba(255,255,255,0.05)
                height 120px
                color rgba(255,255,255,0.4) !important
            .az-menu

                .v-list__tile__title
                    font-size 13px
                    color rgba(255,255,255,0.4)
                    font-weight: normal
                .v-list__tile
                    height 55px
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    &:hover
                        .v-list__tile__title
                            color var(--v-secondary-lighten5) !important
                        i
                            color var(--v-secondary-lighten5) !important
                .active-menu
                    .v-list__tile__action i
                        color var(--v-secondary-lighten5) !important
                    .v-list__tile__title
                        font-weight bold
                        color var(--v-secondary-lighten5) !important

        .container
            background-color #2b2b2a
            height 100%
            padding: 0
        .toolbar
            box-shadow 0 2px 4px -1px rgba(0, 0, 0, .2)
            background-color var(--v-secondary-base) !important
            .az-title
                &__title
                    color rgba(255,255,255,0.7) !important
                &__subtitle
                    color rgba(255,255,255,0.7) !important

        .mobile_menu
            display none

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
