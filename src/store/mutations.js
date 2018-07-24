import Vue from 'vue'
import mutationTypes from './mutations-types'

export default {

    [mutationTypes.SET_COPYWRITE](state, copywrite) {
        state.copywrite = copywrite
    },

    [mutationTypes.SET_VERSION](state, version) {
        state.version = version
    },

    [mutationTypes.SET_ASIDE](state, closed) {
        state.asideClosed = closed
    },

    [mutationTypes.TOOGLE_ASIDE](state) {
        state.asideClosed = !state.asideClosed
    },

    [mutationTypes.SET_UPLOAD_FILE_PROGRESS](state, uploadProgress) {
        Vue.set(state.uploadFileProgress, uploadProgress.filename, {progress: uploadProgress.progress})
    },

    [mutationTypes.SET_UPLOAD_FILE_PROGRESS_ERROR](state, filename) {
        const progress = state.uploadFileProgress[filename].progress
        Vue.set(state.uploadFileProgress, filename, {progress, error: true})
    },

    [mutationTypes.REMOVE_UPLOAD_FILE_PROGRESS](state, filename) {
        Vue.delete(state.uploadFileProgress, filename)
    },

    [mutationTypes.SET_UPLOADED_FILES](state, files) {
        state.uploadedFiles = files
    },

    [mutationTypes.ADD_UPLOADED_FILE](state, uploadedFile) {
        state.uploadedFiles.push(uploadedFile)
    }
}
