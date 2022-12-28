import Vue from 'vue'
import Vuetify from 'vuetify'
import AzDraggableTargetZone from './AzDraggableTargetZone'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import _ from 'lodash'

const localVue = createLocalVue()
Vue.use(Vuetify)

const createDefaultProps = () => {
    return {
        name: 'draggable-target-zone-spec',
        acceptedDraggablesNames: ['draggable-spec'],
        overlap: 0.5,
    }
}

const createWrapper = ({ propsData = {}, shallow = true }) => {
    const options = {
        localVue,
        propsData,
    }
    const mountingFunction = shallow ? shallowMount : mount
    return mountingFunction(AzDraggableTargetZone, options)
}

describe('AzDraggableTargetZone.spec.js', () => {
    let propsData, wrapper

    beforeEach(() => {
        propsData = createDefaultProps()
        wrapper = createWrapper({ propsData })
    })

    describe('Props', () => {
        it('Should receive name', () => {
            expect(wrapper.props().name).toEqual(propsData.name)
        })

        it('Should receive acceptedDraggableNames', () => {
            expect(_.isEqual(wrapper.props().acceptedDraggablesNames, propsData.acceptedDraggablesNames)).toBe(true)
        })

        it('Should receive overlap', () => {
            expect(wrapper.props().overlap).toBe(propsData.overlap)
        })

        it('Should have a default value to overlap', () => {
            propsData.overlap = undefined
            wrapper = createWrapper({ propsData })
            expect(wrapper.props().overlap).toBe(1)
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