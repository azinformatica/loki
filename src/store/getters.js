export default {
    currentPageNum: state => {
        return state.loki.document.paginator.currentPageNum;
    },
    pageContainer: state => {
        return {
            height: state.loki.document.pageContainer.height,
            width: state.loki.document.pageContainer.width
        };
    },
    pages: state => {
        return state.loki.document.pages;
    },
    scale: state => {
        return state.loki.document.scale.current;
    },
    totalPageNum: state => {
        return state.loki.document.paginator.totalPageNum;
    }
}
