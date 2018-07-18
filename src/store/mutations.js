import Vue from 'vue'
import actionTypes from './actions-types'

export default {

    [actionTypes.SET_COPYWRITE](state, copywrite) {
        state.copywrite = copywrite
    },

    [actionTypes.SET_VERSION](state, version) {
        state.version = version
    },

    [actionTypes.SET_ASIDE](state, closed) {
        state.asideClosed = closed
    },

    [actionTypes.TOOGLE_ASIDE](state) {
        state.asideClosed = !state.asideClosed
    },

    [actionTypes.SET_UPLOAD_FILE_PROGRESS](state, uploadProgress) {
        Vue.set(state.uploadFileProgress, uploadProgress.filename, {progress: uploadProgress.progress})
    },

    [actionTypes.SET_UPLOAD_FILE_PROGRESS_ERROR](state, filename) {
        const progress = state.uploadFileProgress[filename].progress
        Vue.set(state.uploadFileProgress, filename, {progress, error: true})
    },

    [actionTypes.REMOVE_UPLOAD_FILE_PROGRESS](state, filename) {
        Vue.delete(state.uploadFileProgress, filename)
    },

    [actionTypes.SET_UPLOADED_FILES](state, files) {
        state.uploadedFiles = files
    },

    [actionTypes.ADD_UPLOADED_FILE](state, uploadedFile) {
        state.uploadedFiles.push(uploadedFile)
    }
}
