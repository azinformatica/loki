import Vue from 'vue'
import money from 'v-money'
import accounting from 'accounting'
import moment from 'moment'
import {actions, mutations, mutationsTypes, state} from './store'

import AzTitle from './components/layout/AzTitle'
import AzAvatar from './components/layout/AzAvatar'
import AzLogo from './components/layout/AzLogo'
import AzConfirm from './components/actions/AzConfirm'
import AzMenu from './components/layout/AzMenu'
import AzAbout from './components/layout/AzAbout'
import AzAside from './components/layout/AzAside'
import AzTemplate from './components/layout/AzTemplate'
import AzContainer from './components/layout/AzContainer'
import AzSearch from './components/search/AzSearch'
import AzSearchItem from './components/search/AzSearchItem'
import AzToolbar from './components/search/AzToolbar'
import AzDate from './components/form/AzDate'
import AzForm from './components/form/AzForm'
import AzFormbar from './components/form/AzFormbar'
import AzMoney from './components/form/AzMoney'
import AzFileUpload from './components/file/AzFileUpload'
import AzFileProgress from './components/file/AzFileProgress'
import AzBackButton from './components/actions/AzBackButton'

Vue.use(accounting)
Vue.use(money, {
    decimal: ',',
    thousands: '.',
    prefix: 'R$ ',
    suffix: '',
    precision: 2,
    masked: true})
Vue.prototype.moment = moment

const lokiPlugin = {

    install(vue, {store, router}) {
        if (!store) {
            throw new Error('Please provide vuex store.')
        }
        if (!router) {
            throw new Error('Please provide router.')
        }

        store.registerModule('loki', {state, mutations, actions})
        Vue.component('az-avatar', AzAvatar)
        Vue.component('az-aside', AzAside)
        Vue.component('az-confirm', AzConfirm)
        Vue.component('az-logo', AzLogo)
        Vue.component('az-about', AzAbout)
        Vue.component('az-menu', AzMenu)
        Vue.component('az-title', AzTitle)
        Vue.component('az-template', AzTemplate)
        Vue.component('az-search-item', AzSearchItem)
        Vue.component('az-search', AzSearch)
        Vue.component('az-toolbar', AzToolbar)
        Vue.component('az-container', AzContainer)
        Vue.component('az-date', AzDate)
        Vue.component('az-formbar', AzFormbar)
        Vue.component('az-form', AzForm)
        Vue.component('az-money',AzMoney)
        Vue.component('az-file-upload', AzFileUpload)
        Vue.component('az-file-progress', AzFileProgress)
        Vue.component('az-back-button', AzBackButton)

        store.commit(mutationsTypes.SET_MENU_ACTIONS, router)

        router.afterEach((to, from) => {
            store.commit(mutationsTypes.SET_CURRENT_PAGE, to)
        })
    }
}

export default lokiPlugin
