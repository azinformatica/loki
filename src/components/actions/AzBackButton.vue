<template>
    <div class="az-back-button">
        <v-btn color="primary" flat depressed @click="back">
            <v-icon>chevron_left</v-icon>{{text}}
        </v-btn>
    </div>
</template>

<script>
    export default {
        name: 'AzBackButton',
        props: {
            route: {
                type: Object,
                required: true
            },
            text: {
                type: String,
                required: true
            }
        },
        methods: {
            back() {
                this.$router.push(this.route)
            }
        }
    }
</script>

<style scoped lang="stylus">
    .az-back-button
        margin-left: 12px
        top: 10px
        position: relative
        font-weight: bold
        font-size: 14px
        .v-btn
            padding: 0
            margin: 0
            height: 20px
            text-transform: none
</style>