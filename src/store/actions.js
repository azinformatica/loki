import axios from 'axios'
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

    async [actionTypes.SIGNATURE.DIGITAL.START](context, { certificateContent, documentId }) {
        const flowbeeAccessParams = getFlowbeeAccessParams(context.state.flowbee.accessToken)
        const url = `${flowbeeAccessParams.url}/${documentId}/assinaturas/digitais/iniciar`
        const headers = {
            'Content-Type': 'text/plain',
            ...flowbeeAccessParams.headers,
        }

        const { data } = await axios.post(url, certificateContent, { headers })

        return data
    },

    async [actionTypes.SIGNATURE.DIGITAL.FINISH](
        context,
        { documentId, signHash, temporarySubscription, rubricBase64, participation }
    ) {
        const flowbeeAccessParams = getFlowbeeAccessParams(context.state.flowbee.accessToken)
        const url = `${flowbeeAccessParams.url}/${documentId}/assinaturas/digitais/finalizar`
        const headers = {
            ...flowbeeAccessParams.headers,
        }
        const requestData = {
            assinatura: signHash,
            assinaturaTemporariaId: temporarySubscription,
            rubricaBase64: rubricBase64,
            participacao: participation,
        }

        const { data } = await axios.post(url, requestData, { headers })

        return data
    },
}

function getFlowbeeAccessParams(accessToken) {
    if (accessToken) {
        return {
            url: '/flowbee/api/public/documentos',
            headers: { ...accessToken },
        }
    } else {
        return {
            url: '/flowbee/api/documentos',
        }
    }
}
