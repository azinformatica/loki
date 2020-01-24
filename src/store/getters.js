export default {
    currentPageNum: state => {
        return state.document.paginator.currentPageNum;
    },
    pageContainer: state => {
        return {
            height: state.document.pageContainer.height,
            width: state.document.pageContainer.width
        };
    },
    pages: state => {
        return state.document.pages;
    },
    renderedPages: state => {
        return state.document.renderedPages;
    },
    scale: state => {
        return state.document.scale.current;
    },
    totalPageNum: state => {
        return state.document.paginator.totalPageNum;
    }
}
