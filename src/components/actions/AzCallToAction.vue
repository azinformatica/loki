<template>
    <v-btn depressed :color="color" :dark="isDark" :outline="isOutline" :class="style" @click="$emit('click')">
        <slot/>
    </v-btn>
</template>

<script>
    export default {
        name: 'AzCallToAction',
        props: {
            active: {
                type: Boolean,
                default: false
            },
            dark: {
                type: Boolean,
                default: false
            },
            hideBorder: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            color() {
                if (this.active) {
                    return 'secondary'
                } else if (this.dark) {
                    return ''
                } else {
                    return 'primary'
                }
            },
            isDark() {
                return this.dark && !this.active
            },
            isOutline() {
                return !this.active
            },
            style() {
                return {
                    'call-to-action': true,
                    'hide-border': this.hideBorder
                }
            }
        }
    }
</script>

<style lang="stylus">

    .call-to-action
        font-size: 14px
        margin: 0 10px 0 0
        text-transform: none
        position: relative
        height: unset
        padding: 5px 15px
        box-shadow: none
        i
            margin-right: 5px
            font-size: 18px

        &.hide-border
            border: 0 !important

</style>
