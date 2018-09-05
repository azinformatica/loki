<template>
    <v-btn :color="color" :dark="isDark" :outline="isOutline" :class="style" @click="$emit('click')">
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
                    'hide-border': this.hideBorder
                }
            }
        }
    }
</script>

<style lang="stylus">

    .hide-border
        border: 0 !important

</style>