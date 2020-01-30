<template>
    <div class="az-form-bar primary">
        <slot />
    </div>
</template>
<script>
export default {}
</script>
<style lang="stylus">
.az-form-bar
    .show
        padding: 0 20px
        display: flex
        height: 60px
        align-items: center
        justify-content: space-between
        transition: .2s
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

    .hide
        transition: 1s
        padding: 0 20px
        display: flex
        height: 10px
        align-items: center
        justify-content: space-between
        .itens
            display: none

        .actions
            display: none

@media (max-width 720px)
    .az-form-bar .show
        height unset !important

        .itens
            display: block !important
            margin: 10px 0 !important

            .item
                margin: 10px 0 !important
</style>
