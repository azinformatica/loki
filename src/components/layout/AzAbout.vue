<template>
    <v-flex text-xs-center class="az-about">
        <span class="az-about__copywrite"> &copy;{{ yearCopywrite }} — {{ companyCopywrite }} </span>
        <span class="az-about__version"> v{{ versionNumber }} </span>
    </v-flex>
</template>

<script>
export default {
    computed: {
        versionNumber() {
            return this.$store.state.loki.product.version
        },
        yearCopywrite() {
            return new Date().getFullYear()
        },
        companyCopywrite() {
            return this.$store.state.loki.product.copywrite
        },
    },
}
</script>

<style lang="stylus">
.az-about
    border-top 1px solid #ccc
    height 36px
    background-color #f6f9f9
    color #7f7f7f
    font-size 14px
    font-weight normal
    -webkit-box-align center
    -ms-flex-align center
    align-items center
    display -webkit-box
    display -ms-flexbox
    display flex
    justify-content space-between

    .theme--light.v-footer
        background none !important

    &__copywrite
        padding-left 20px

    &__version
        padding-right 20px


@media (max-width 720px)
    .v-footer
        display none
</style>
