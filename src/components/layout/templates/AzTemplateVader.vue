<template>
    <v-app class="az-template-vader" dark>
        <az-loading></az-loading>

        <az-aside>
            <div class="az-aside">
                <div class="logo">
                    <az-logo />
                </div>
                <div class="menu">
                    <az-menu />
                </div>
            </div>
        </az-aside>

        <v-app-bar app height="60" class="toolbar">
            <v-icon class="mobile_menu" @click="showAside()">dehaze</v-icon>
            <az-title />
            <v-spacer></v-spacer>
            <az-avatar />
        </v-app-bar>
        <v-main>
            <v-container fluid class="container">
                <az-alert />
                <slot />
                <v-footer app inset>
                    <az-file-progress></az-file-progress>
                    <az-about />
                </v-footer>
            </v-container>
        </v-main>
    </v-app>
</template>
<script>
import AzAlert from '../AzAlert'
import AzFileProgress from '../../file/AzFileProgress'
import AzLoading from '../AzLoading'
import mutationTypes from '../../../store/mutation-types'

export default {
    components: { AzLoading, AzAlert, AzFileProgress },
    methods: {
        showAside() {
            this.$store.commit(mutationTypes.SET_ASIDE_HIDE, true)
        },
    },
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
            border-bottom 1px solid rgba(255,255,255,.05)
            height 120px
            color rgba(255,255,255,.4) !important
        .az-menu

            .v-list-item__title
                font-size 13px
                color rgba(255,255,255,.4)
                font-weight: normal
            .v-list-item
                height 55px
                border-bottom: 1px solid rgba(255,255,255,.05);
                &:hover
                    .v-list-item__title
                        color var(--v-secondary-lighten5) !important
                    i
                        color var(--v-secondary-lighten5) !important
            .active-menu
                .v-list-item__action i
                    color var(--v-secondary-lighten5) !important
                .v-list-item__title
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
                color rgba(255,255,255,.7) !important
            &__subtitle
                color rgba(255,255,255,.7) !important

    .mobile_menu
        display none

.application.theme--light
    background: unset !important

.application--wrap
    min-height: unset !important

html
    overflow-y: auto

@media (max-width 720px)
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
