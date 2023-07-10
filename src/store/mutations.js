import Vue from 'vue'
import mutationTypes from './mutation-types'
import moment from 'moment-timezone'

export default {
    [mutationTypes.ADD_UPLOADED_FILE](state, uploadedFile) {
        state.uploadedFiles.push(uploadedFile)
    },

    [mutationTypes.DISABLE_GLOBAL_LOADING](state) {
        state.isGlobalLoadingEnabled = false
    },

    [mutationTypes.ENABLE_GLOBAL_LOADING](state) {
        state.isGlobalLoadingEnabled = true
    },

    [mutationTypes.SET_COPYWRITE](state, copywrite) {
        state.copywrite = copywrite
    },

    [mutationTypes.HIDE_NOTIFICATION](state) {
        state.notificacao = { message: '', type: '' }
    },

    [mutationTypes.SET_VERSION](state, version) {
        state.version = version
    },

    [mutationTypes.SET_ASIDE](state, closed) {
        state.asideClosed = closed
    },

    [mutationTypes.SET_ASIDE_HIDE](state, hide) {
        state.asideHide = hide
    },

    [mutationTypes.SET_UPLOAD_FILE_PROGRESS](state, uploadProgress) {
        Vue.set(state.uploadFileProgress, uploadProgress.hashName, {
            filename: uploadProgress.filename,
            progress: uploadProgress.progress,
        })
    },

    [mutationTypes.SET_UPLOAD_FILE_PROGRESS_ERROR](state, filename) {
        const progress = state.uploadFileProgress[filename].progress
        Vue.set(state.uploadFileProgress, filename, { filename, progress, error: true })
    },

    [mutationTypes.SET_FILES_CONFIG](state, config) {
        state.file = config
    },

    [mutationTypes.SET_GLOBAL_LOADING](state, loading) {
        if (state.isGlobalLoadingEnabled) {
            state.isLoading = loading
        } else if (!loading) {
            state.isLoading = loading
        }
    },

    [mutationTypes.SET_LOADING_MESSAGE](state, message) {
        state.loadingMessage = message
    },

    [mutationTypes.SET_NOTIFICATION](state, notification) {
        state.notification = notification
    },

    [mutationTypes.SET_NOTIFICATION_CONFIG](state, notificationConfig) {
        Vue.set(state, 'notificationConfig', notificationConfig)
    },

    [mutationTypes.SET_NOTIFICATION_ACTIVE_FILTER](state, activeFilter) {
        Vue.set(state.notificationConfig, 'activeFilter', activeFilter)
    },

    [mutationTypes.SET_UPLOADED_FILES](state, files) {
        state.uploadedFiles = files
    },

    [mutationTypes.SET_MENU_ACTIONS](state, actions) {
        Vue.set(state, 'menuActions', actions)
    },

    [mutationTypes.SET_CURRENT_PAGE](state, to) {
        if (to.meta && to.meta.page) {
            state.page.title = to.meta.page.title
            state.page.subtitle = to.meta.page.subtitle
            state.autoSave.show = to.meta.page.showAutoSave
        }
    },

    [mutationTypes.SHOW_ALERT](
        state,
        { message, type, hasButtom, style, styleButtom, iconColor, mensageButtom, timeOut, styleButtomClose }
    ) {
        state.alert = {
            message,
            type,
            hasButtom,
            style,
            styleButtom,
            iconColor,
            mensageButtom,
            timeOut,
            styleButtomClose,
        }
    },
    [mutationTypes.ROLLBACK_ACTION](state, rollback) {
        state.rollback = rollback
        setTimeout(() => {
            state.rollback = false
        }, 2000)
    },
    [mutationTypes.REMOVE_UPLOAD_FILE_PROGRESS](state, filename) {
        Vue.delete(state.uploadFileProgress, filename)
    },

    [mutationTypes.TOOGLE_ASIDE](state) {
        state.asideClosed = !state.asideClosed
    },

    [mutationTypes.SET_TIMEZONE](state, timezone) {
        state.timezone = timezone
        state.offset = moment().tz(timezone).format('Z')
    },

    [mutationTypes.DOCUMENT.SET_PAGE_CONTAINER](state, { height, width }) {
        state.document.pageContainer.height = height
        state.document.pageContainer.width = width
    },

    [mutationTypes.DOCUMENT.SET_PAGES](state, pages) {
        state.document.pages = pages
    },

    [mutationTypes.DOCUMENT.SET_CURRENT_PAGE_NUM](state, currentPageNum) {
        state.document.paginator.currentPageNum = currentPageNum
    },

    [mutationTypes.DOCUMENT.SET_TOTAL_PAGE_NUM](state, totalPageNum) {
        state.document.paginator.totalPageNum = totalPageNum
    },

    [mutationTypes.DOCUMENT.SET_CURRENT_SCALE](state, scale) {
        state.document.scale.current = scale
    },

    [mutationTypes.DOCUMENT.SET_RENDERED_PAGES](state, payload) {
        if (typeof payload === 'number') {
            state.document.renderedPages.push(payload)
        } else {
            state.document.renderedPages = []
        }
    },

    [mutationTypes.AUTO_SAVING.DISABLE_AUTO_SAVING](state) {
        setTimeout(function () {
            Vue.set(state.autoSave, 'saving', false)
            Vue.set(state.autoSave, 'dateLastSaved', new Date())
        }, 500)
    },

    [mutationTypes.AUTO_SAVING.ENABLE_AUTO_SAVING](state) {
        Vue.set(state.autoSave, 'saving', true)
        Vue.set(state.autoSave, 'dateLastSaved', null)
    },

    [mutationTypes.AUTO_SAVING.RESET_AUTO_SAVE](state) {
        Vue.set(state.autoSave, 'saving', false)
        Vue.set(state.autoSave, 'dateLastSaved', null)
    },

    [mutationTypes.AUTO_SAVING.SET_SAVING_MESSAGE](state, message) {
        state.autoSave.autoSavedDescription = message
    },

    [mutationTypes.AUTO_SAVING.SET_AUTO_SAVED_MESSAGE](state, message) {
        state.autoSave.autoSavedMessage = message
    },

    [mutationTypes.AUTO_SAVING.SET_AUTO_SAVED_DESCRIPTION](state, message) {
        state.autoSave.autoSavedMessage = message
    },

    [mutationTypes.FLOWBEE.SET_LACUNA_LICENSE](state, url) {
        state.flowbee.license = url
    },

    [mutationTypes.FLOWBEE.SET_ACCESS_TOKEN](state, token) {
        state.flowbee.accessToken = token
    },

    [mutationTypes.BPM.INITIALIZE_PROCESS_INSTANCE](state, { processKey, businessKey }) {
        if (!state.bpm.process[processKey]) {
            Vue.set(state.bpm.process, processKey, {})
        }

        if (!state.bpm.process[processKey][businessKey]) {
            Vue.set(state.bpm.process[processKey], businessKey, {
                instance: null,
                isLoading: false,
            })
        }
    },

    [mutationTypes.BPM.SET_PROCESS_INSTANCE](state, { processKey, businessKey, instance }) {
        Vue.set(state.bpm.process[processKey][businessKey], 'instance', instance)
    },

    [mutationTypes.BPM.SET_USER_TASKS](state, { processKey, userTasks }) {
        Vue.set(state.bpm.process[processKey], 'userTasks', userTasks)
    },

    [mutationTypes.BPM.SET_CURRENT_TASK](state, { processKey, businessKey, currentTask }) {
        Vue.set(state.bpm.process[processKey][businessKey], 'currentTask', currentTask)
    },

    [mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_PROCESS](state, { processKey, businessKey, currentTaskId }) {
        const process = state.bpm.process[processKey][businessKey]
        const instance = process.instance || {}
        const currentTasks = instance.currentTasks || []
        const currentTask = currentTasks.find((currentTask) => currentTask.id === currentTaskId)

        Vue.set(process, 'currentTask', currentTask)
    },

    [mutationTypes.BPM.SET_CURRENT_TASK_FOR_ID_IN_INSTANCE](state, { processKey, businessKey, currentTaskId }) {
        const process = state.bpm.process[processKey][businessKey]
        const instance = process.instance || {}
        const currentTasks = instance.currentTasks || []
        const currentTask = currentTasks.find((currentTask) => currentTask.id === currentTaskId)

        Vue.set(instance, 'currentTask', currentTask)
    },

    [mutationTypes.BPM.SET_IS_LOADING_PROCESS_INSTANCE](state, { processKey, businessKey, isLoading }) {
        state.bpm.process[processKey][businessKey].isLoading = isLoading
    },

    [mutationTypes.BPM.SET_BPM_API_URL](state, { url }) {
        state.bpm.api = url
    },
}
