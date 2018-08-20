<template>
    <div class="az-search-items">
        <slot></slot>
    </div>
</template>
<style lang="stylus">
    .az-search-items
        padding: 0 15px 0 15px
        .v-input__slot
            &:before
                border-color: #ccc !important

        .az-text
            margin-bottom: 8px
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

            input:-webkit-autofill
                background-color: white !important

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

        .v-input__icon i
            font-size: 18px

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
                margin-top 0 !important
                padding: 0
                .v-label
                    font-size: 13px
                    color: #888 !important

                .accent--text
                    label
                        font-size: 13px
                        color: #888 !important

        .v-textarea textarea
            font-size: 13px
            color: #888 !important

</style>
