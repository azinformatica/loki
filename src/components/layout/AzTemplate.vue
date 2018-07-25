<template>
    <v-app class="az-template">
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
                <slot></slot>
                <v-footer app inset>
                    <az-about/>
                </v-footer>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    export default {}
</script>
<style lang="stylus">
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
