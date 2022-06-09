<template>
    <v-toolbar-title class="az-title">
        <span class="az-title__title primary--text">{{ title }}</span>
        <span class="az-title__subtitle" v-if="subtitle">» {{ subtitle }}</span>
    </v-toolbar-title>
</template>

<script>
export default {
    computed: {
        title() {
            return this.$store.state.loki.page.title
        },
        subtitle() {
            return this.$store.state.loki.page.subtitle
        },
    },
}
</script>

<style lang="stylus">
.az-title
    margin-left 0 !important

    &__title
        font-size 16px
        font-weight bold
        padding-right 5px

    &__subtitle
        color #7f7f7f
        font-size 14px
        font-weight normal
</style>
