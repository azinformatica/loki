import AzFileUpload from './AzFileUpload'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'

const localVue = createLocalVue()
Vue.use(Vuex)
Vue.use(Vuetify)

describe('AzFileUpload.spec.js', () => {
    let wrapper, propsData, store, actions

    beforeEach(() => {
        actions = {
            uploadFile: jest.fn(),
        }

        store = new Vuex.Store({
            state: {
                loki: {
                    uploadFileProgress: {},
                    uploadedFiles: [],
                    file: {
                        maxSize: '16Mb',
                    },
                },
            },
            actions,
        })

        propsData = {
            repository: 'repo1',
        }

        wrapper = shallowMount(AzFileUpload, { localVue, store, propsData })
    })

    it('Props are defined', () => {
        expect(wrapper.vm.thumbnail).toBeFalsy()
        expect(wrapper.vm.repository).toEqual('repo1')
        expect(wrapper.vm.accept).toEqual('*')
        expect(wrapper.vm.useCustomBehavior).toEqual(false)
    })

    it('Do nothing when the list of selected files to be uploaded is empty', () => {
        const input = { value: '' }
        document.getElementById = jest.fn().mockReturnValue(input)

        const filesToBeUploaded = []
        wrapper.vm.onSelectFiles(filesToBeUploaded)

        expect(actions.uploadFile.mock.calls).toHaveLength(0)
    })

    it('Calls the store to upload the files that were selected through the component', () => {
        const input = { value: '' }
        document.getElementById = jest.fn().mockReturnValue(input)

        const filesToBeUploaded = [{ name: 'file1' }, { name: 'file2' }]
        wrapper.vm.onSelectFiles(filesToBeUploaded)

        expect(actions.uploadFile.mock.calls).toHaveLength(2)
        for (let i = 0; i < filesToBeUploaded.length; i++) {
            expect(actions.uploadFile.mock.calls[i][1].filename).toEqual(filesToBeUploaded[i].name)
        }
    })

    it('Do nothing when the list of dropped files to be uploaded is empty', () => {
        const eventItems = []
        wrapper.vm.onSelectFiles(eventItems)
        expect(actions.uploadFile.mock.calls).toHaveLength(0)
    })

    it('Calls the store to upload the files that were dropped into the component', () => {
        const droppedItems = {
            0: {
                name: 'file1',
                kind: 'file',
                getAsFile: () => ({
                    name: 'file1',
                }),
            },
            1: {
                name: 'file2',
                kind: 'notfile',
            },
            length: 2,
        }
        wrapper.vm.onDropFiles(droppedItems)

        expect(actions.uploadFile.mock.calls).toHaveLength(1)
        expect(actions.uploadFile.mock.calls[0][1].filename).toEqual(droppedItems['0'].name)
    })

    it('Opens the file selector', () => {
        const mockedInput = {
            click: jest.fn(),
        }
        document.getElementById = jest.fn().mockReturnValue(mockedInput)
        wrapper.vm.openFileSelector()
        expect(mockedInput.click).toHaveBeenCalled()
    })
})
