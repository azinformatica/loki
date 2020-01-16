import axios from 'axios'
import pdfjs from "@/utils/pdfJsLib";
import mutationsTypes from './mutations-types'
import actionsTypes from './actions-types'

export default {

    async getProduct({commit, state}) {
        const response = await axios.get('public/produtos', {params: {productName: state.productName}})
        commit(mutationsTypes.SET_PRODUCT_EXTENDED_ATTRS, response.data.atributosExtendidos)
    },

    async uploadFile({commit, state}, {filename, formData}) {

        const hashName = filename + (new Date()).getTime()
        commit(mutationsTypes.SET_UPLOAD_FILE_PROGRESS, {hashName, filename, progress: 0})

        const onUploadProgress = (progressEvent) => {
            const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
            commit(mutationsTypes.SET_UPLOAD_FILE_PROGRESS, {hashName, filename, progress})
        }
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: onUploadProgress
        }

        try {
            const {data} = await axios.post(state.file.api, formData, options)
            data.name = filename
            commit(mutationsTypes.REMOVE_UPLOAD_FILE_PROGRESS, hashName)
            commit(mutationsTypes.ADD_UPLOADED_FILE, Object.assign({}, data, {status: 'success'}))
            return data
        } catch (e) {
            commit(mutationsTypes.SET_UPLOAD_FILE_PROGRESS_ERROR, hashName)
        }
    },

    async [actionsTypes.DOCUMENT.FETCH_DOCUMENT](context, src) {
        let pdf = await pdfjs.fetchDocument(src);
        context.commit(mutationsTypes.DOCUMENT.SET_TOTAL_PAGE_NUM, pdf.numPages);
        context.commit(mutationsTypes.DOCUMENT.SET_PAGES, await pdfjs.getPages(pdf));
    },

    [actionsTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM](context, currentPageNum) {
        context.commit(mutationsTypes.DOCUMENT.SET_CURRENT_PAGE_NUM, currentPageNum);
    },

    [actionsTypes.DOCUMENT.UPDATE_PAGE_CONTAINER](context) {
        let pageContainer = pdfjs.getPageContainer(context.state.document.pages[0], context.state.document.scale.current);
        context.commit(mutationsTypes.DOCUMENT.SET_PAGE_CONTAINER, pageContainer);
    },

    [actionsTypes.DOCUMENT.INCREASE_SCALE](context) {
        if (context.state.document.scale.current < context.state.document.scale.max) {
            context.commit(mutationsTypes.DOCUMENT.SET_CURRENT_SCALE, context.state.document.scale.current + 0.5);
            context.dispatch(actionsTypes.DOCUMENT.UPDATE_PAGE_CONTAINER);
        }
    },

    [actionsTypes.DOCUMENT.DECREASE_SCALE](context) {
        if (context.state.document.scale.current > context.state.document.scale.default) {
            context.commit(mutationsTypes.DOCUMENT.SET_CURRENT_SCALE, context.state.document.scale.current - 0.5);
            context.dispatch(actionsTypes.DOCUMENT.UPDATE_PAGE_CONTAINER);
        }
    },

    [actionsTypes.DOCUMENT.RESTORE_SCALE](context) {
        if (context.state.document.scale.current != context.state.document.scale.default) {
            context.commit(mutationsTypes.DOCUMENT.SET_CURRENT_SCALE, context.state.document.scale.default);
            context.dispatch(actionsTypes.DOCUMENT.UPDATE_PAGE_CONTAINER);
        }
    },

    async [actionsTypes.DOCUMENT.RENDER_PAGE](context, { pageNum, canvasContext }) {
        let page = context.state.document.pages[pageNum - 1];
        let scale = context.state.document.scale.current;
        await pdfjs.renderPage({ page, scale, canvasContext });
    }

}
