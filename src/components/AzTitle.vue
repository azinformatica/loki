<template>
    <v-toolbar-title class="az-title">
        <span class="az-title__title">{{title}}</span>
        <span class="az-title__subtitle">» {{subtitle}}</span>
    </v-toolbar-title>
</template>
<script>
    export default {
        methods: {
            routes() {
                return this.$router.options.routes
            },
            findRouteByName(name) {
                return this.routes().find(function (route) {
                    return route.name === name
                })
            }
        },
        computed: {
            title() {
                return this.$store.state.wids.pageTitle
            },
            subtitle() {
                return this.$store.state.wids.pageSubtitle
            }
        }
    }
</script>
<style lang="less">
    .az-title {
        margin-left: 20px !important;
        &__title {
            font-size: 18px;
            font-weight: bold;
            color: #3a6861;
            padding-right: 5px;
        }
        &__subtitle {
            color: #7f7f7f;
            font-size: 14px;
            font-weight: normal;
        }
    }
</style>
