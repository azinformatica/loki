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
        Vue.set(state.uploadFileProgress, uploadProgress.filename, uploadProgress.progress)
    },

    [actionTypes.REMOVE_UPLOAD_FILE_PROGRESS](state, filename) {
        Vue.delete(state.uploadFileProgress, filename)
    },

    [actionTypes.SET_UPLOADED_FILES](state, files) {
        state.uploadedFiles = files
    },

    [actionTypes.ADD_UPLOADED_FILE](state, uploadedFile) {
        Vue.set(state.uploadedFiles, uploadedFile.name, uploadedFile)
    }
}
