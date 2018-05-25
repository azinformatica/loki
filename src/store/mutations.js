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
    }
}
