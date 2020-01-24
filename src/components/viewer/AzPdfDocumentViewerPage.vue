<template>
    <v-layout justify-center align-center>
        <div :id="'page' + pageNum" :height="pageSize.height" :width="pageSize.width" class="az-pdf-page">
            <canvas :height="pageSize.height" :width="pageSize.width" />
        </div>
    </v-layout>
</template>

<script>
export default {
    props: {
        pageNum: { type: Number, required: true },
        pageSize: { type: Object, required: true }
    },
    mounted() {
        this.emitEventWithContext('resize')
    },
    methods: {
        emitEventWithContext(event) {
            this.$emit(event, {
                pageNum: this.$props.pageNum,
                canvasContext: this.getCanvasContext()
            })
        },
        getCanvasContext() {
            return document.getElementById(`page${this.$props.pageNum}`).firstChild.getContext('2d')
        }
    },
    watch: {
        pageSize() {
            this.emitEventWithContext('resize')
        }
    }
}
</script>

<style lang="stylus" scoped>
.az-pdf-page
    margin-bottom 15px

    canvas
        -webkit-box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
        box-shadow 0 3px 6px -1px rgba(0, 0, 0, .2)
</style>
