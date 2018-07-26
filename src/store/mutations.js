import Vue from 'vue'
import mutationTypes from './mutations-types'

export default {

    [mutationTypes.ADD_UPLOADED_FILE](state, uploadedFile) {
        state.uploadedFiles.push(uploadedFile)
    },

    [mutationTypes.SET_COPYWRITE](state, copywrite) {
        state.copywrite = copywrite
    },

    [mutationTypes.SET_VERSION](state, version) {
        state.version = version
    },

    [mutationTypes.SET_ASIDE](state, closed) {
        state.asideClosed = closed
    },

    [mutationTypes.SET_UPLOAD_FILE_PROGRESS](state, uploadProgress) {
        Vue.set(state.uploadFileProgress, uploadProgress.filename, {progress: uploadProgress.progress})
    },

    [mutationTypes.SET_UPLOAD_FILE_PROGRESS_ERROR](state, filename) {
        const progress = state.uploadFileProgress[filename].progress
        Vue.set(state.uploadFileProgress, filename, {progress, error: true})
    },

    [mutationTypes.SET_UPLOADED_FILES](state, files) {
        state.uploadedFiles = files
    },

    [mutationTypes.SET_MENU_ACTIONS](state, router) {
        router.options.routes.forEach((route) => {
            if (route.meta && route.meta.menu) {
                let action = {
                    name: route.meta.menu.title,
                    icon: route.meta.menu.icon,
                    path: route.path,
                    selected: false
                }
                if (route.children && route.children.length > 0) {
                    action.expanded = false
                    action.children = []
                    route.children.forEach((subRoute) => {
                        let child = {
                            name: subRoute.meta.menu.title,
                            icon: subRoute.meta.menu.icon,
                            path: subRoute.path,
                            selected: false
                        }
                        action.children.push(child)
                    })
                }
                state.menuActions.push(action)
            }
        })
    },

    [mutationTypes.SET_CURRENT_PAGE](state, to) {
        if (to.meta && to.meta.page) {
            state.page.title = to.meta.page.title
            state.page.subtitle = to.meta.page.subtitle
        }
    },

    [mutationTypes.REMOVE_UPLOAD_FILE_PROGRESS](state, filename) {
        Vue.delete(state.uploadFileProgress, filename)
    },

    [mutationTypes.TOOGLE_ASIDE](state) {
        state.asideClosed = !state.asideClosed
    }
}
