<template>
    <div class="az-form-bar">
        <slot/>
    </div>
</template>
<script>
    export default {}
</script>
<style lang="stylus">
    .az-form-bar
        .show
            background-color: #3a6861
            padding: 0 20px
            display: flex
            height: 60px
            align-items: center
            justify-content: space-between
            transition: 0.2s
            .v-btn
                font-size: 13px
                margin: 0 10px 0 0
                text-transform: none
                position: relative
                height: unset
                padding: 5px 15px
                box-shadow: none
            .itens
                display: flex
                .item
                    margin-right: 20px
                    display: block
                    label
                        font-size: 13px
                        color: white
                        display: block

                    span
                        font-size: 12px
                        color: white
            .actions
                display: flex
                align-items: center
                .icon
                    margin-left: 10px
                    i
                        color: white
                .action
                    color: white
                    border: 1px solid white
                    padding: 8px 15px
                    border-radius: 2px
                    font-size: 12px
                    margin-left: 15px
                    &:hover
                        background-color: darken(#D28A2C, 10%)
                        border-color: darken(#D28A2C, 10%)
                .action-primary
                    color: white
                    background-color: #D28A2C
                    border: 1px solid #D28A2C
                    padding: 8px 15px
                    border-radius: 2px
                    font-size: 12px
                    margin-left: 15px
                    &:hover
                        background-color: darken(#D28A2C, 10%)
                        border-color: darken(#D28A2C, 10%)
        .hide
            transition: 1s
            background-color: #3a6861
            padding: 0 20px
            display: flex
            height: 10px
            align-items: center
            justify-content: space-between
            .itens
                display: none

            .actions
                display: none
</style>
