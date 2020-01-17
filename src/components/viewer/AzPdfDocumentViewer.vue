<template>
  <div>
    <Toolbar
      v-bind="{ currentPage, totalPages }"
      @zoomOut="resolveEventZoomOut"
      @zoomIn="resolveEventZoomIn"
      @resetZoom="resolveEventResetZoom"
    />
    <div id="documentContainer" class="documentContainer" justify-center align-center>
      <Page
        v-for="page in pages"
        :key="page.pageIndex + 1"
        :pageNum="page.pageIndex + 1"
        :pageSize="pageSize"
        @resize="resolveEventResize"
      />
    </div>
  </div>
</template>

<script>
import Toolbar from "./AzPdfDocumentViewerToolbar";
import Page from "./AzPdfDocumentViewerPage";
import { actionsTypes } from "../../store";
export default {
  components: {
    Toolbar,
    Page
  },
  props: {
    src: { type: String, required: true }
  },
  data: () => ({
    visiblePageNum: 0
  }),
  computed: {
    currentPage() {
      return this.$store.getters.currentPageNum;
    },
    pageHeight() {
      return this.$store.getters.pageContainer.height;
    },
    pages() {
      return this.$store.getters.pages;
    },
    pageSize() {
      return this.$store.getters.pageContainer;
    },
    totalPages() {
      return this.$store.getters.totalPageNum;
    }
  },
  async created() {
    await this.$store.dispatch(actionsTypes.DOCUMENT.FETCH_DOCUMENT, this.$props.src);
    this.$store.dispatch(actionsTypes.DOCUMENT.UPDATE_PAGE_CONTAINER);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll(e) {
      this.visiblePageNum = Math.round(e.target.scrollingElement.scrollTop / this.pageHeight) + 1;
      this.$store.dispatch(actionsTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM, this.visiblePageNum);
    },
    resolveEventZoomOut() {
      this.$store.dispatch(actionsTypes.DOCUMENT.DECREASE_SCALE);
    },
    resolveEventZoomIn() {
      this.$store.dispatch(actionsTypes.DOCUMENT.INCREASE_SCALE);
    },
    resolveEventResetZoom() {
      this.$store.dispatch(actionsTypes.DOCUMENT.RESTORE_SCALE);
    },
    resolveEventResize({ pageNum, canvasContext }) {
      this.$store.dispatch(actionsTypes.DOCUMENT.RENDER_PAGE, { pageNum, canvasContext });
    }
  }
};
</script>

<style lang="stylus" scoped>
.documentContainer
  margin-top: 65px
</style>
