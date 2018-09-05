<template>
    <v-btn :color="color" :dark="isDark" :outline="isOutline" @click="$emit('click')">
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
            }
        }
    }
</script>