<template>
    <div class="az-form">
        <slot />
    </div>
</template>

<script>
export default {}
</script>

<style lang="stylus">
.az-action-link-icon
    text-decoration none

.table-actions
    text-align -webkit-center

.az-table-list
    .v-select__selection
        font-size 13px
        color #777

    .v-input__slot
        margin 0
        border 1px solid #ccc
        border-radius 2px
        padding 0 10px

    .v-input__slot::before
        background-color unset

    .v-text-field__details
        display none

    .v-input
        margin 0 !important

    .v-table tbody tr td
        height unset
        padding 10px

    .v-table thead tr th
        padding 10px

.az-pagination
    display flex
    justify-content space-between
    font-size 13px

    .v-pagination__item
        height 24px
        width 24px
        font-size 13px
        margin 2px
        border 1px solid #ccc
        -webkit-box-shadow none
        box-shadow none

    .v-pagination__navigation
        height 24px
        width 24px
        font-size 13px
        margin 2px
        -webkit-box-shadow none
        box-shadow none

    .v-input
        width 100px

    .az-select-pagination
        align-items center
        display flex
        color #777777

        span
            color #777777
            margin-right 10px

        .v-select
            font-size 13px

        .v-select__selection--comma
            font-size 13px
            margin 10px 5px 5px 0 !important

.az-form
    padding 20px

.az-form-content
    padding 20px
    width 100%
    height 100%
    margin-top 10px

    .v-input__slot
        &:before
            border-color #ccc !important

    .az-text
        margin-bottom 8px

        label
            color #777 !important
            font-weight bold
            font-size 13px

        p
            color #888 !important
            font-size 13px

    .v-text-field
        .v-label
            color #777 !important
            font-weight bold
            font-size 13px
            overflow unset

        input:-webkit-autofill
            background-color white !important

        input
            font-size 13px
            color #888 !important

        .v-label--active
            -webkit-transform translateY(-18px)
            transform translateY(-18px)

    .v-select__selection--comma
        font-size 13px
        color #888 !important

    .checkbox-label
        font-size 13px
        font-weight bold
        color #777 !important

    .v-input__icon i
        font-size 18px

    .az-checkbox
        i
            font-size 14px
            margin-bottom 3px

        .v-input--selection-controls__ripple
            cursor pointer
            height 20px
            width 20px
            left -1px
            top calc(50% - 10px)

        .v-input--selection-controls__input
            margin-right 0
            width 18px

        .accent--text
            color #777 !important

        .v-input
            margin-top 0 !important
            padding 0

            .v-label
                font-size 13px
                color #888 !important

            .accent--text
                label
                    font-size 13px
                    color #888 !important

    .v-textarea textarea
        font-size 13px
        color #888 !important

    .az-subtitle
        font-size 16px
        font-weight bold
        margin 10px 0
        border-bottom 1px solid #ccc

.az-actions-form
    padding 0 20px 30px 20px
    margin-top 15px
    justify-content space-between
    display flex
    font-size 13px

    .align-left
        .action-secundary
            padding 10px 15px
            margin-right 10px
            color #555555
            border 1px solid #555555
            border-radius 2px

            &:hover
                color white
                border 1px solid #555555
                background-color #555555

        .action-delete
            padding 10px 15px
            margin-right 10px
            color #cccccc
            border 1px solid #cccccc
            border-radius 2px

            &:hover
                color white
                border 1px solid #a03232
                background-color #a03232

    .align-right
        .action-primary
            padding 10px 15px
            border 1px solid #7aa329
            background-color #7aa329
            color white
            margin-left 10px
            border-radius 2px

            &:hover
                background-color lighten(#7aa329, 10%)
                border 1px solid lighten(#7aa329, 10%)

        .action-secundary
            padding 10px 15px
            margin-left 10px
            color #777777

            &:hover
                color darkred

@media (max-width: 720px)
    .az-pagination
        display block !important

        .az-select-pagination
            height 10px

        .v-pagination
            height 50px

    .v-table tbody tr:hover:not(.v-datatable__expand-row)
        background unset !important

    .az-table-list
        tbody tr td
            padding 5px 10px !important

        .table-actions
            text-align center
            border-top 2px dotted #ccc
            padding 0 !important
            height unset !important

            i
                font-size 24px
                margin 5px 10px

        td
            height unset !important

            &:before
                position relative
                top -2px
                padding-right 10px
                white-space nowrap
                font-weight bold
                color #3a6861

        td
            border none
            position relative
            padding-left 50%

        table, thead, tbody, th, td
            display block !important

        tr
            border 1px solid #ddd
            display block !important

            &:nth-child(even)
                background-color #eee !important

        .v-table tbody tr:hover:not(.v-datatable__expand-row)
            background-color transparent

        thead
            tr
                position absolute
                top -9999px
                left -9999px
</style>
