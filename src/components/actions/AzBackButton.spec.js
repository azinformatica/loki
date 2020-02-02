import AzBackButton from './AzBackButton'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
Vue.use(Vuetify)
localVue.use(VueRouter)

describe('AzBackButton.spec.js', () => {
    let wrapper

    beforeEach(() => {
        const propsData = {
            route: { name: 'myRoute' },
            text: 'Button Text'
        }

        const router = new VueRouter({ routes: [{ path: '/route', name: 'myRoute' }] })
        wrapper = mount(AzBackButton, { localVue, propsData, router })
    })

    it('Required data is rendered properly', () => {
        expect(wrapper.html()).toContain('Button Text')
    })

    it('Back button method is pushing the route', () => {
        expect(wrapper.vm.$router.currentRoute.name).toBeNull()
        wrapper.find('button').trigger('click.native')
        expect(wrapper.vm.$router.currentRoute.name).toEqual('myRoute')
    })
})
