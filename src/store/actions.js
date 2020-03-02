import axios from 'axios'
import pdfjs from '../utils/AzPdfJsLib'
import mutationTypes from './mutation-types'
import actionTypes from './action-types'

export default {
    async getProduct({ commit, state }) {
        const response = await axios.get('public/produtos', { params: { productName: state.productName } })
        commit(mutationTypes.SET_PRODUCT_EXTENDED_ATTRS, response.data.atributosExtendidos)
    },

    async uploadFile({ commit, state }, { filename, formData }) {
        const hashName = filename + new Date().getTime()
        commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS, { hashName, filename, progress: 0 })

        const onUploadProgress = progressEvent => {
            const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
            commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS, { hashName, filename, progress })
        }
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: onUploadProgress
        }

        try {
            const { data } = await axios.post(state.file.api, formData, options)
            data.name = filename
            commit(mutationTypes.REMOVE_UPLOAD_FILE_PROGRESS, hashName)
            commit(mutationTypes.ADD_UPLOADED_FILE, Object.assign({}, data, { status: 'success' }))
            return data
        } catch (e) {
            commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS_ERROR, hashName)
        }
    },

    async [actionTypes.DOCUMENT.FETCH_DOCUMENT](context, src) {
        let pdf = await pdfjs.fetchDocument(src)
        context.commit(mutationTypes.DOCUMENT.SET_TOTAL_PAGE_NUM, pdf.numPages)
        context.commit(mutationTypes.DOCUMENT.SET_PAGES, await pdfjs.getPages(pdf))
        context.commit(mutationTypes.DOCUMENT.SET_CURRENT_SCALE, 1.5)
        context.dispatch(actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER)
    },

    [actionTypes.DOCUMENT.UPDATE_CURRENT_PAGE_NUM](context, currentPageNum) {
        context.commit(mutationTypes.DOCUMENT.SET_CURRENT_PAGE_NUM, currentPageNum)
    },

    [actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER](context) {
        let pageContainer = pdfjs.getPageContainer(
            context.state.document.pages[0],
            context.state.document.scale.current
        )
        context.commit(mutationTypes.DOCUMENT.SET_PAGE_CONTAINER, pageContainer)
    },

    [actionTypes.DOCUMENT.INCREASE_SCALE](context) {
        if (context.state.document.scale.current < context.state.document.scale.max) {
            context.commit(mutationTypes.DOCUMENT.SET_CURRENT_SCALE, context.state.document.scale.current + 0.5)
            context.dispatch(actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER)
        }
    },

    [actionTypes.DOCUMENT.DECREASE_SCALE](context) {
        if (context.state.document.scale.current > context.state.document.scale.default) {
            context.commit(mutationTypes.DOCUMENT.SET_CURRENT_SCALE, context.state.document.scale.current - 0.5)
            context.dispatch(actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER)
        }
    },

    [actionTypes.DOCUMENT.RESTORE_SCALE](context) {
        if (context.state.document.scale.current != context.state.document.scale.default) {
            context.commit(mutationTypes.DOCUMENT.SET_CURRENT_SCALE, context.state.document.scale.default)
            context.dispatch(actionTypes.DOCUMENT.UPDATE_PAGE_CONTAINER)
        }
    },

    async [actionTypes.DOCUMENT.RENDER_PAGE](context, { pageNum, canvasContext }) {
        let page = context.state.document.pages[pageNum - 1]
        let scale = context.state.document.scale.current
        await pdfjs.renderPage({ page, scale, canvasContext })
    },

    [actionTypes.DOCUMENT.UPDATE_RENDERED_PAGES](context, pageNum) {
        context.commit(mutationTypes.DOCUMENT.SET_RENDERED_PAGES, pageNum)
    },

    [actionTypes.DOCUMENT.CLEAR_RENDER_CONTEXT](context) {
        context.commit(mutationTypes.DOCUMENT.SET_PAGES, [])
        context.commit(mutationTypes.DOCUMENT.SET_RENDERED_PAGES, 'clear')
        context.commit(mutationTypes.DOCUMENT.SET_TOTAL_PAGE_NUM, '-')
        context.commit(mutationTypes.DOCUMENT.SET_CURRENT_PAGE_NUM, '-')
        context.commit(mutationTypes.DOCUMENT.SET_CURRENT_SCALE, 1.5)
        context.commit(mutationTypes.DOCUMENT.SET_PAGE_CONTAINER, { height: 0, width: 0 })
    },

    [actionTypes.DOCUMENT.CLEAR_RENDERED_PAGES](context) {
        context.commit(mutationTypes.DOCUMENT.SET_RENDERED_PAGES, 'clear')
    }
}
