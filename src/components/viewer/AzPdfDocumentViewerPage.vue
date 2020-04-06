<template>
    <div :id="'page' + pageNum" :height="pageSize.height" :width="pageSize.width" class="az-pdf-page">
        <canvas :height="pageSize.height" :width="pageSize.width" />
    </div>
</template>

<script>
export default {
    props: {
        pageNum: { type: Number, required: true },
        pageSize: { type: Object, required: true }
    },
    mounted() {
        this.$emit('mounted', {
            pageNum: this.$props.pageNum,
            canvasContext: this.getCanvasContext()
        })
    },
    methods: {
        getCanvasContext() {
            return document.getElementById(`page${this.$props.pageNum}`).firstChild.getContext('2d')
        }
    }
}
</script>

<style lang="stylus" scoped>
.az-pdf-page
    margin-bottom 15px
    text-align center

    canvas
        -webkit-box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
        box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
</style>
