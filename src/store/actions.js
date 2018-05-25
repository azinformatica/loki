import axios from 'axios'
import actionTypes from './actions-types'

export default {

    async getProduct({commit, state}) {
        const response = await axios.get('public/produtos', {params: {productName: state.productName}})
        commit(actionTypes.SET_PRODUCT_EXTENDED_ATTRS, response.data.atributosExtendidos)
    }

}