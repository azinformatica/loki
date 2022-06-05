import axios from 'axios'
import mutationTypes from './mutation-types'
export default {
    async getProduct({ commit, state }) {
        const response = await axios.get('public/produtos', { params: { productName: state.productName } })
        commit(mutationTypes.SET_PRODUCT_EXTENDED_ATTRS, response.data.atributosExtendidos)
    },

    async uploadFile({ commit, state }, { filename, formData }) {
        const hashName = filename + new Date().getTime()
        commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS, { hashName, filename, progress: 0 })

        const onUploadProgress = (progressEvent) => {
            const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
            commit(mutationTypes.SET_UPLOAD_FILE_PROGRESS, { hashName, filename, progress })
        }
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onUploadProgress,
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
}
