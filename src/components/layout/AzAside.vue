<template>
    <v-navigation-drawer app :mini-variant.sync="asideClosed" v-model="drawer" mobile-break-point="720"
                         mini-variant-width="60" width="200" class="az-aside primary" floating>
        <div class="az-aside__logo">
            <slot name="logo"></slot>
        </div>
        <div class="az-aside__menu">
            <slot name="menu"></slot>
        </div>

        <div :class="{'arrow-opened' : !asideClosed, 'arrow-closed' : asideClosed}" class="no-mobile">
            <v-btn icon @click="toogle()" flat>
                <v-icon color="white">{{ asideClosed ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}</v-icon>
            </v-btn>
        </div>
    </v-navigation-drawer>
</template>
<script>
    import mutationTypes from '../../store/mutations-types'

    export default {
        methods: {
            toogle() {
                this.$store.commit(mutationTypes.TOOGLE_ASIDE)
            },
            change(closed) {
                this.$store.commit(mutationTypes.SET_ASIDE, closed)
            }
        },
        computed: {
            asideClosed: {
                get() {
                    return this.$store.state.loki.asideClosed
                },
                set(closed) {
                    this.change(closed)
                }
            },
            drawer: {
                get() {
                    return this.$store.state.loki.asideHide
                },
                set(hide) {
                    this.$store.commit(mutationTypes.SET_ASIDE_HIDE, hide)
                }
            }
        }
    }
</script>
<style scoped lang="stylus">
    .az-aside::-webkit-scrollbar
        width: 6px

    .az-aside::-webkit-scrollbar-thumb
        background: rgba(255, 255, 255, 0.5)

    .az-aside
        padding: 0
        max-height: unset !important

        &__menu
            height: 100%
            padding-bottom: 40px
            padding-top: 120px

        .arrow-closed
            position: absolute
            bottom: 0
            width: 60px
            border-top: 1px solid rgba(255, 255, 255, 0.1)
            display: flex
            align-items: center
            height:36px !important

            .v-btn
                height: 28px
                width: 28px
                margin: 2px 10px !important
                color: rgba(255, 255, 255, 0.8) !important

            .v-btn--icon
                border-radius: unset

        .arrow-opened
            position: absolute
            bottom: 0
            width: 200px
            height: 36px !important
            border-top: 1px solid rgba(255, 255, 255, 0.1)

            .v-btn
                height: 28px
                width: 28px
                margin: 2px 10px !important
                color: rgba(255, 255, 255, 0.8) !important
</style>
