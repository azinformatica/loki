import Vue from 'vue'
import money from 'v-money'
import accounting from 'accounting'
import moment from 'moment'
import {actions, mutations, mutationsTypes, state} from './store'

import AzTitle from './components/layout/AzTitle'
import AzAvatar from './components/layout/AzAvatar'
import AzLogo from './components/layout/AzLogo'
import AzMenu from './components/layout/AzMenu'
import AzAbout from './components/layout/AzAbout'
import AzAside from './components/layout/AzAside'
import AzTemplateDefault from './components/layout/templates/AzTemplateDefault'
import AzTemplateGmail from './components/layout/templates/AzTemplateGmail'
import AzTemplateVader from './components/layout/templates/AzTemplateVader'
import AzContainer from './components/layout/AzContainer'
import AzOps from './components/layout/AzOps'
import AzModal from './components/layout/AzModal'
import AzSearch from './components/search/AzSearch'
import AzSearchItem from './components/search/AzSearchItem'
import AzToolbar from './components/search/AzToolbar'
import AzDate from './components/form/AzDate'
import AzForm from './components/form/AzForm'
import AzFormbar from './components/form/AzFormbar'
import AzMoney from './components/form/AzMoney'
import AzTextView from './components/form/AzTextView'
import AzComboEnum from './components/form/AzComboEnum'
import AzFileUpload from './components/file/AzFileUpload'
import AzFileProgress from './components/file/AzFileProgress'
import AzDocumentViewer from './components/file/AzDocumentViewer'
import AzConfirm from './components/actions/AzConfirm'
import AzBackButton from './components/actions/AzBackButton'
import AzCallToAction from './components/actions/AzCallToAction'
import AzDialog from './components/actions/AzDialog'

import azAuth from './directives/auth'

import azCpfCnpjFilter from './filters/cpf-cnpj'
import azDateFilter from './filters/date'
import azClipTextFilter from './filters/clip-text'
import azPhoneFilter from './filters/phone'
import azTitleCaseFilter from './filters/title-case'

import AzSearchUrlBuilder from './utils/AzSearchUrlBuilder'
import AzSoundex from './utils/AzSoundex'
import buildMenu from './utils/az-menu'

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
        Vue.component('az-title', AzTitle)
        Vue.component('az-avatar', AzAvatar)
        Vue.component('az-logo', AzLogo)
        Vue.component('az-menu', AzMenu)
        Vue.component('az-about', AzAbout)
        Vue.component('az-aside', AzAside)
        Vue.component('az-template-default', AzTemplateDefault)
        Vue.component('az-template-gmail', AzTemplateGmail)
        Vue.component('az-template-vader', AzTemplateVader)
        Vue.component('az-container', AzContainer)
        Vue.component('az-ops', AzOps)
        Vue.component('az-modal', AzModal)
        Vue.component('az-search', AzSearch)
        Vue.component('az-search-item', AzSearchItem)
        Vue.component('az-toolbar', AzToolbar)
        Vue.component('az-date', AzDate)
        Vue.component('az-form', AzForm)
        Vue.component('az-formbar', AzFormbar)
        Vue.component('az-money',AzMoney)
        Vue.component('az-text-view', AzTextView)
        Vue.component('az-combo-enum', AzComboEnum)
        Vue.component('az-file-upload', AzFileUpload)
        Vue.component('az-file-progress', AzFileProgress)
        Vue.component('az-document-viewer', AzDocumentViewer)
        Vue.component('az-confirm', AzConfirm)
        Vue.component('az-back-button', AzBackButton)
        Vue.component('az-call-to-action', AzCallToAction)
        Vue.component('az-dialog', AzDialog)

        Vue.directive('az-auth', azAuth)

        Vue.filter('az-cpf-cnpj', azCpfCnpjFilter)
        Vue.filter('az-date', azDateFilter)
        Vue.filter('az-clip-text', azClipTextFilter)
        Vue.filter('az-phone', azPhoneFilter)
        Vue.filter('az-title-case', azTitleCaseFilter)

        store.commit(mutationsTypes.SET_MENU_ACTIONS, buildMenu(store, router))

        router.afterEach((to, from) => {
            store.commit(mutationsTypes.SET_CURRENT_PAGE, to)
        })
    }
}

export default lokiPlugin

const filters = {
    azCpfCnpjFilter,
    azDateFilter,
    azClipTextFilter,
    azPhoneFilter,
    azTitleCaseFilter
}

export {
    lokiPlugin,
    filters,
    AzSearchUrlBuilder,
    AzSoundex,
    buildMenu
}
