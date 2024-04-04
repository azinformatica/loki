import axios from 'axios'
import mutationTypes from './mutation-types'
import actionTypes from './action-types'
import state from './state'
import mutations from './mutations'

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use((config) => {
    config.headers.common['Authorization'] = state.keycloak.accessToken
    mutations[mutationTypes.SET_GLOBAL_LOADING](state, true)
    return config
})

axiosInstance.interceptors.response.use((config) => {
    mutations[mutationTypes.SET_GLOBAL_LOADING](state, false)
    return config
})

export default {
    async getProduct({ commit, state }) {
        const response = await axiosInstance.get('public/produtos', { params: { productName: state.productName } })
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
            const { data } = await axiosInstance.post(state.file.api, formData, options)
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

        const { data } = await axiosInstance.post(url, certificateContent, { headers })

        return data
    },

    async [actionTypes.SIGNATURE.DIGITAL.FINISH](
        context,
        { documentId, signHash, temporarySubscription, rubricBase64, participation, visualPositionings, extraDatas }
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
            dadosExtras:
                extraDatas &&
                extraDatas.map((extraData) => ({
                    nome: extraData.name,
                    valor: extraData.value,
                    tipoDado: extraData.dataType,
                })),
            posicionamentosVisuais:
                visualPositionings &&
                visualPositionings.map((visualPositioning) => ({
                    porcentagemEmX: visualPositioning.percentX,
                    porcentagemEmY: visualPositioning.percentY,
                    porcentagemLargura: visualPositioning.percentWidth,
                    porcentagemAltura: visualPositioning.percentHeight,
                    indiceDadoExtra: visualPositioning.indexExtraData,
                    pagina: visualPositioning.pageNumber,
                    tipo: visualPositioning.type,
                })),
        }

        const { data } = await axiosInstance.post(url, requestData, { headers })

        return data
    },

    async [actionTypes.BPM.GET_PROCESS_LOGS]({ commit, state }, { processKey, businessKey }) {
        const response = await axiosInstance.get(`${state.bpm.api}/getLog/${processKey}/${businessKey}`)
        return response.data
    },

    async [actionTypes.BPM.GET_PROCESS_INSTANCE]({ commit, state }, { processKey, businessKey }) {
        const defaultParams = {
            processKey,
            businessKey,
        }

        const setLoading = (isLoading) =>
            commit(mutationTypes.BPM.SET_IS_LOADING_PROCESS_INSTANCE, { ...defaultParams, isLoading })

        const setProcessInstance = (instance) =>
            commit(mutationTypes.BPM.SET_PROCESS_INSTANCE, { ...defaultParams, instance })

        try {
            setLoading(true)

            const response = await axiosInstance.get(`${state.bpm.api}/getInstance/${processKey}/${businessKey}`)
            const processInstance = response.data
            const process = state.bpm.process[processKey][businessKey]
            processInstance.currentTask = process.currentTask

            setProcessInstance(processInstance)

            return processInstance
        } finally {
            setLoading(false)
        }
    },

    [actionTypes.BPM.ROUTE]({ state }, { processKey, taskId, bpmParameters }) {
        const processPath = `/process/${processKey}`
        const routePath = `/route/from/${taskId}/destination/${bpmParameters.activityIdDestination}`

        return axiosInstance.put(`${state.bpm.api}${processPath}${routePath}`, bpmParameters)
    },

    async [actionTypes.BPM.GET_USER_TASKS]({ commit, state }, { processKey }) {
        const response = await axiosInstance.get(`${state.bpm.api}/getActivity/${processKey}`)
        commit(mutationTypes.BPM.SET_USER_TASKS, { processKey, userTasks: response.data })

        return response.data
    },

    [actionTypes.BPM.CLAIM]({ state }, { taskId }) {
        return axiosInstance.get(`${state.bpm.api}/claim/${taskId}`)
    },

    [actionTypes.BPM.UNCLAIM]({ state }, { taskId }) {
        return axiosInstance.get(`${state.bpm.api}/unclaim/${taskId}`)
    },

    [actionTypes.BPM.COMPLETE]({ state }, { taskId, processKey, bpmParameters }) {
        return axiosInstance.put(`${state.bpm.api}/complete/${processKey}/${taskId}`, bpmParameters)
    },

    [actionTypes.BPM.UNCOMPLETE]({ state }, { taskId, processKey }) {
        return axiosInstance.get(`${state.bpm.api}/uncomplete/${processKey}/${taskId}`)
    },

    async [actionTypes.UO.FIND_ALL_ACTIVE]({ commit },queryParams) {
        const {data} = await axiosInstance.get(`/hal/unidadeOrganizacional/buscarComFiltros?${queryParams}`)

        if(queryParams.has('tipoAdministracaoPreenchido')){
            commit(mutationTypes.UO.SET_ACRONYM_TYPE_ADINISTRATION_COMPLETED, data)
        }
        if(queryParams.has('codigoHierarquiaSuperior')){
            commit(mutationTypes.UO.SET_UPPER_HIERARCHY_CODE, data)
        }

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

