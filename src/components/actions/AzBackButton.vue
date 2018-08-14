<template>
    <div class="az-back-button">
        <router-link :to="route">
            <v-icon>chevron_left</v-icon>
            {{text}}
        </router-link>
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
        }
    }
</script>

<style scoped lang="stylus">
    .az-back-button
        margin-left: 12px
        top: 10px
        position: relative
        color: #3a6861
        font-weight: bold
        font-size: 14px

        a
            text-decoration: none
            font-size: 14px
            i
                position: relative
                font-size: 22px
                top: 3px
                color: #3a6861
                margin: 0
                padding: 0
</style>