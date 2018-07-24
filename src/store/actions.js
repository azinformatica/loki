import axios from 'axios'
import mutationTypes from './mutations-types'

export default {

    async getProduct({commit, state}) {
        const response = await axios.get('public/produtos', {params: {productName: state.productName}})
        commit(mutationTypes.SET_PRODUCT_EXTENDED_ATTRS, response.data.atributosExtendidos)
    },

    async uploadFile({commit, state}, payload) {

        const filename = payload.filename;
        commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS, {filename, progress: 0})

        const onUploadProgress = (progressEvent) => {
            const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
            commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS, {filename, progress})
        }
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: onUploadProgress
        }

        const url = `${state.filesApi}?repository${payload.repository}&thumnail=${payload.thumbnail}`
        try {
            const {data} = await axios.post(url, payload.formData, options)
            commit(mutationTypes.REMOVE_UPLOAD_FILE_PROGRESS, filename)
            commit(mutationTypes.ADD_UPLOADED_FILE, Object.assign({}, data, {status: 'success'}))
        } catch (e) {
            commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS_ERROR, filename)
        }
    }

}
