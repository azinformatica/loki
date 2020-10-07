<template>
    <v-btn depressed :disabled="disabled" :color="color" :dark="isDark" :outlined="isOutline" :class="style" @click="$emit('click')">
        <slot />
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
        disabled:{
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
        },
        cssClass: {
            type: String,
            default: ''
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
            let styleObj = {
                'call-to-action': true,
                'hide-border': this.hideBorder,
                'btn-disabled-action': this.disabled
            }

            if (this.cssClass) {
                const classes = this.cssClass.split(' ')
                classes.forEach(clazz => (styleObj[clazz] = true))
            }
            return styleObj
        }
    }
}
</script>

<style lang="stylus">
.call-to-action
    font-size 14px
    margin 0
    text-transform none
    position relative
    height unset
    padding 5px 15px
    box-shadow none
    font-weight bold

    i
        margin-right 5px
        font-size 18px

    &.hide-border
        border 0 !important

    &.btn-disabled-action
        pointer-events visible !important
        cursor not-allowed !important
</style>
