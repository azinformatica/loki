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
            progress: uploadProgress.progress
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
        }
    },

    [mutationTypes.SHOW_ALERT](state, { message, type }) {
        state.alert = { message, type }
    },

    [mutationTypes.REMOVE_UPLOAD_FILE_PROGRESS](state, filename) {
        Vue.delete(state.uploadFileProgress, filename)
    },

    [mutationTypes.TOOGLE_ASIDE](state) {
        state.asideClosed = !state.asideClosed
    },

    [mutationTypes.SET_TIMEZONE](state, timezone) {
        state.timezone = timezone
        state.offset = moment()
            .tz(timezone)
            .format('Z')
    },

    [mutationTypes.DOCUMENT.SET_CURRENT_PAGE_NUM](state, currentPageNum) {
        state.document.paginator.currentPageNum = currentPageNum
    },

    [mutationTypes.DOCUMENT.SET_CURRENT_SCALE](state, scale) {
        state.document.scale.current = scale
    },

    [mutationTypes.DOCUMENT.SET_FILENAME](state, filename) {
        state.document.filename = filename
    },

    [mutationTypes.DOCUMENT.SET_PAGE_CONTAINER](state, containerList) {
        state.document.pageContainer = containerList
    },

    [mutationTypes.DOCUMENT.SET_PAGES](state, pages) {
        state.document.pages = pages
    },

    [mutationTypes.DOCUMENT.SET_TOTAL_PAGE_NUM](state, totalPageNum) {
        state.document.paginator.totalPageNum = totalPageNum
    },

    [mutationTypes.DOCUMENT.SET_RENDERED_PAGES](state, payload) {
        if (typeof payload === 'number') {
            state.document.renderedPages.push(payload)
        } else {
            state.document.renderedPages = []
        }
    },

    [mutationTypes.FLOWBEE.SET_LACUNA_LICENSE](state, url) {
        state.flowbee.license = url
    },

    [mutationTypes.FLOWBEE.SET_ACCESS_TOKEN](state, token) {
        state.flowbee.accessToken = token
    }
}
