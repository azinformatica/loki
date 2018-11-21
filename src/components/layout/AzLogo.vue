<template>
    <div class="az-logo">
        <a @click="redirectToHome()">
            <img v-if="!asideClosed" class="main" :src="mainLogo"/>
            <img v-else class="symbol" :src="symbolLogo"/>
        </a>
    </div>
</template>
<script>
    export default {
        methods: {
            redirectToHome() {
                console.log('Go')
            }
        },
        computed: {
            asideClosed() {
                return this.$store.state.loki.asideClosed
            },
            mainLogo() {
                return this.$store.state.loki.product.mainLogo
            },
            symbolLogo() {
                return this.$store.state.loki.product.symbolLogo
            }
        }
    };
</script>

<style lang="stylus">
    .az-logo
        display flex
        align-items center
        height 100%
        width 100%
        text-align center
        overflow hidden
        a
            width: 100%
</style>
