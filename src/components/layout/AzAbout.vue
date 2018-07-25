<template>
    <v-flex text-xs-center class="az-about">
        <span class="az-about__copywrite">
            &copy;{{ yearCopywrite }} — {{ companyCopywrite }}
        </span>
        <span class="az-about__version">
            v{{ versionNumber }}
        </span>
    </v-flex>
</template>

<script>
    export default {
        computed: {
            versionNumber() {
                return this.$store.state.loki.version;
            },
            yearCopywrite() {
                return (new Date()).getFullYear()
            },
            companyCopywrite() {
                return this.$store.state.loki.copywrite
            }
        }
    }
</script>

<style lang="stylus">
    .az-about
        border-top: 1px solid #ccc
        height: 46px
        background-color: #f6f9f9
        color: #7f7f7f
        font-size: 14px
        font-weight: normal
        -webkit-box-align: center
        -ms-flex-align: center
        align-items: center
        display: -webkit-box
        display: -ms-flexbox
        display: flex
        justify-content: space-between

        &__copywrite
            padding-left: 20px

        &__version
            padding-right: 20px
</style>
