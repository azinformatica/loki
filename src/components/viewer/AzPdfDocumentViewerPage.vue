<template>
  <div :id="'page' + pageNum" :height="pageSize.height" :width="pageSize.width" class="page">
    <canvas :height="pageSize.height" :width="pageSize.width" />
  </div>
</template>

<script>
export default {
  name: "Page",
  props: {
    pageNum: { type: Number, required: true },
    pageSize: { type: Object, required: true }
  },
  methods: {
    getCanvasContext() {
      return document.getElementById(`page${this.$props.pageNum}`).firstChild.getContext("2d");
    }
  },
  watch: {
    pageSize() {
      this.$emit("resize", {
        pageNum: this.$props.pageNum,
        canvasContext: this.getCanvasContext()
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.page
  margin-bottom: 15px
</style>
