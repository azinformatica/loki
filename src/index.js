import Vue from 'vue'
import {actions, mutations, mutationsTypes, state} from './store'

import AzTitle from './components/layout/AzTitle'
import AzAvatar from './components/layout/AzAvatar'
import AzLogo from './components/layout/AzLogo'
import AzMenu from './components/layout/AzMenu'
import AzAbout from './components/layout/AzAbout'
import AzAside from './components/layout/AzAside'
import AzTemplate from './components/layout/AzTemplate'
import AzContainer from './components/layout/AzContainer'
import AzSearch from './components/search/AzSearch'
import AzAdvancedSearch from './components/search/AzAdvancedSearch'
import AzToolbar from './components/search/AzToolbar'
import AzForm from './components/form/AzForm'
import AzFormbar from './components/form/AzFormbar'
import AzFileUpload from './components/file/AzFileUpload'

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
        Vue.component('az-logo', AzLogo)
        Vue.component('az-about', AzAbout)
        Vue.component('az-menu', AzMenu)
        Vue.component('az-title', AzTitle)
        Vue.component('az-template', AzTemplate)
        Vue.component('az-advanced-search', AzAdvancedSearch)
        Vue.component('az-search', AzSearch)
        Vue.component('az-toolbar', AzToolbar)
        Vue.component('az-container', AzContainer)
        Vue.component('az-formbar', AzFormbar)
        Vue.component('az-form', AzForm)
        Vue.component('az-file-upload', AzFileUpload)

        store.commit(mutationsTypes.SET_MENU_ACTIONS, router)

        router.afterEach((to, from) => {
            store.commit(mutationsTypes.SET_CURRENT_PAGE, to)
        })
    }
}

export default lokiPlugin
