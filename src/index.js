import Vue from 'vue'
import AzTitle from './components/AzTitle'
import AzAvatar from './components/AzAvatar'
import AzLogo from './components/AzLogo'
import AzMenu from './components/AzMenu'
import AzAbout from './components/AzAbout'
import AzSearch from './components/AzSearch'
import AzAdvancedSearch from './components/AzAdvancedSearch'
import AzToolbar from './components/AzToolbar'
import AzAside from './components/AzAside'
import AzTemplate from './components/AzTemplate'
import AzContainer from './components/AzContainer'
import {state, mutations, actions} from './store'

const widsPlugin = {

    install(vue, {store}) {
        if (!store) {
            throw new Error('Please provide vuex store.')
        }

        store.registerModule('wids', {state, mutations, actions})
        Vue.component('az-avatar', AzAvatar)
        Vue.component('az-aside', AzAside)
        Vue.component('az-logo', AzLogo)
        Vue.component('az-about', AzAbout)
        Vue.component('az-menu', AzMenu)
        Vue.component('az-title', AzTitle)
        Vue.component('az-template', AzTemplate)
        Vue.component('az-advanced-search',AzAdvancedSearch)
        Vue.component('az-search',AzSearch)
        Vue.component('az-toolbar',AzToolbar)
        Vue.component('az-container',AzContainer)
    }
}

export default widsPlugin
