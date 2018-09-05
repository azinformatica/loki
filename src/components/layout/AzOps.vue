<template>
    <div class="az-ops">
        <div class="text-big">{{title}}</div>
        <div class="text-small">{{message}}</div>
    </div>
</template>

<script>
    export default {
        name: 'AzOps',
        props: {
            title: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped lang="stylus">

    .az-ops
        background-color: #f0f0f0
        display: block
        align-items: center
        padding: 40px 10px
        text-align: center
        .text-big
            font-size: 24px
            color: #555
            font-weight: bold
        .text-small
            font-size: 14px
            color: #777

</style>