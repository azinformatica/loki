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
        display: -webkit-flex
        display: flex
        align-items: center
        height: 120px
        width: 100%
        text-align: center
        overflow: hidden
        position: fixed
        border-bottom: 1px solid rgba(255, 255, 255, 0.15)
        a
            width: 100%

        .main
            width: 200px
            padding: 40px
        .symbol
            width: 30px
            height: 60px
</style>
