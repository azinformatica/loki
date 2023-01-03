import Vue from 'vue'
import Vuetify from 'vuetify'
import AzDraggable from './AzDraggable'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createDefaultProps = () => {
    return {
        name: 'draggable-spec',
        resizable: true,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 200,
        maxHeight: 200,
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzDraggable, options)
}

describe('AzDraggable.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData })
    })

    describe('Props', () => {
        it('Should receive name', () => {
            expect(wrapper.props().name).toEqual(propsData.name)
        })

        it('Should receive resizable', () => {
            expect(wrapper.props().resizable).toBe(propsData.resizable)
        })

        it('Should have a default value to resizable', () => {
            propsData.resizable = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().resizable).toBeFalsy()
        })

        it('Should receive minWidth', () => {
            expect(wrapper.props().minWidth).toBe(propsData.minWidth)
        })

        it('Should have a default value to minWidth', () => {
            propsData.minWidth = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().minWidth).toBe(50)
        })

        it('Should receive minHeight', () => {
            expect(wrapper.props().minHeight).toBe(propsData.minHeight)
        })

        it('Should have a default value to minHeight', () => {
            propsData.minHeight = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().minHeight).toBe(50)
        })

        it('Should receive maxWidth', () => {
            expect(wrapper.props().maxWidth).toBe(propsData.maxWidth)
        })

        it('Should have a default value to maxWidth', () => {
            propsData.maxWidth = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().maxWidth).toBe(1000)
        })

        it('Should receive maxHeight', () => {
            expect(wrapper.props().maxHeight).toBe(propsData.maxHeight)
        })

        it('Should have a default value to maxHeight', () => {
            propsData.maxHeight = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().maxHeight).toBe(1000)
        })
    })

    describe('Interactor', () => {
        it('Should have configured target zone interactor', () => {
            expect(wrapper.vm.$data.interactor).toBeTruthy()
        })

        it('Should set interactor target to props name', () => {
            expect(wrapper.vm.$data.interactor.target).toEqual(`.${propsData.name}-item`)
        })

        it('Should unset interactor on destroy', () => {
            wrapper.destroy()
            expect(wrapper.vm.$data.interactor).toBeNull()
        })
    })
})
