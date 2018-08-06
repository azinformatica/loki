<template>
    <div class="az-form">
        <slot/>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="stylus">
    .az-form
        padding: 20px

    .az-form-content
        padding: 20px
        width: 100%
        height: 100%
        margin-top: 10px

    .v-input__slot
        &:before
            border-color: #ccc !important

    .az-text
        label
            color: #777 !important
            font-weight: bold
            font-size: 13px
        p
            color: #888 !important
            font-size: 13px

    .v-text-field

        .v-label
            color: #777 !important
            font-weight: bold
            font-size: 13px
            overflow: unset

        input
            font-size: 13px
            color: #888 !important

        .v-label--active
            -webkit-transform: translateY(-18px)
            transform: translateY(-18px)

    .v-select__selection--comma
        font-size: 13px
        color: #888 !important

    .checkbox-label
        font-size: 13px
        font-weight: bold
        color: #777 !important

    .az-checkbox
        i
            font-size: 14px
            margin-bottom: 3px

        .v-input--selection-controls__ripple
            cursor: pointer
            height: 20px
            width: 20px
            left: -1px
            top: calc(50% - 10px)

        .v-input--selection-controls__input
            margin-right: 0
            width: 18px

        .accent--text
            color: #777 !important

        .v-input
            .accent--text
                label
                    font-size: 14px
                    color: #888 !important

    .v-textarea textarea
        font-size: 13px
        color: #888 !important

    .az-subtitle
        font-size: 16px
        font-weight: bold
        color: #3a6861
        margin: 10px 0
        border-bottom: 1px solid #ccc

    .az-actions-form
        padding: 0 20px 30px 20px
        margin-top: 15px
        justify-content: space-between
        display: flex
        font-size: 13px
        
        .align-left
            .action-secundary
                padding: 10px 15px
                margin-right: 10px
                color: #3a6861
                border: 1px solid #3a6861
                border-radius: 2px
                &:hover
                    color: white
                    border: 1px solid #3a6861
                    background-color: #3a6861
            .action-delete
                padding: 10px 15px
                margin-right: 10px
                color: #cccccc
                border: 1px solid #cccccc
                border-radius: 2px
                &:hover
                    color: white
                    border: 1px solid #a03232
                    background-color: #a03232
        .align-right
            .action-primary
                padding: 10px 15px
                border: 1px solid #7aa329
                background-color: #7aa329
                color: white
                margin-left: 10px
                border-radius: 2px
                &:hover
                    background-color: lighten(#7aa329, 10%)
                    border: 1px solid lighten(#7aa329, 10%)
            .action-secundary
                padding: 10px 15px
                margin-left: 10px
                color: #777777
                &:hover
                    color: darkred
</style>
