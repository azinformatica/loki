<template>
    <v-app class="az-template">
        <az-loading></az-loading>
        <az-aside>
            <az-logo slot="logo"/>
            <az-menu slot="menu"/>
        </az-aside>
        <v-toolbar app height="60" class="az-template__toolbar">
            <az-title/>
            <v-spacer></v-spacer>
            <az-avatar/>
        </v-toolbar>
        <v-content>
            <v-container fluid class="az-template__container">
                <az-notification></az-notification>
                <slot></slot>
                <v-footer app inset>
                    <az-about/>
                </v-footer>
                <az-file-progress></az-file-progress>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import AzNotification from './AzNotification'
    import AzFileProgress from '../file/AzFileProgress'
    import AzLoading from './AzLoading'
    export default {
        components: {AzLoading, AzNotification, AzFileProgress}
    }
</script>
<style lang="stylus">
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
</style>
