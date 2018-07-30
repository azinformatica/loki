<template>
    <div class="az-toolbar">
        <div class="actions">
            <slot name="actions"></slot>
        </div>

        <div class="search">
            <slot name="simpleSearch"></slot>
        </div>
    </div>
</template>
<script>
    import mutationTypes from '../../store/mutations-types'

    export default {
        data() {
            return {
                isClosed: true
            }
        },
        methods: {
            toggle() {
                this.isClosed = !this.isClosed
                this.closeAsideMenu()
            },
            close() {
                this.isClosed = true
            },
            closeAsideMenu() {
                this.$store.commit(mutationTypes.SET_ASIDE, true)
            }
        }
    }
</script>
<style lang="stylus">
    .v-toolbar__content
        padding: 0 20px

    .az-toolbar
        width: 100%
        height: 60px
        background-color: #f6f9f9
        border-bottom: 1px solid #ddd
        align-items: center
        display: flex
        justify-content: space-between

        .search
            position: absolute
            right: 0
            top: 15px
            display: flex

            .clear
                margin-right: 10px
                padding: 5px
                color: #777777

        .ripple__container
            display: none

        .actions
            padding: 0 20px
            a
                font-size: 14px
                padding: 7px 10px
                border-radius: 5px
                margin-right: 10px
                i
                    margin-right: 5px
                    font-size: 18px

        .btn-primary
            color: white
            background-color: #d28a2C
            i
                color: white

        .btn-alternative
            color: white
            background-color: #777777
            i
                color: white

    .az-toolbar-mini
        width: 100%
        position: absolute
        top: 60px
        height: 30px
        background-color: darken(#3a6861, 5%)
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2)
        border-bottom: 1px solid #ddd
        display: flex
        justify-content: space-between

        .search
            display: none

        .ripple__container
            display: none

        .actions
            height: 60px
            padding: 6px 5px
            .btn
                text-transform: none
                border-radius: 5px
                min-width: unset

               .icon
                   margin-right: 5px

               .btn__content
                   width: 100%
                   padding: 0 5px

    .btn-primary
        color: white

    .btn-alternative
        color: white

</style>
