import AzFileUpload from '../../../src/components/file/AzFileUpload'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { shallowMount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('AzFileUpload.test.js', () => {
    let wrapper, props, store, actions

    beforeEach(() => {
        actions = {
            uploadFile: jest.fn()
        }

        store = new Vuex.Store({
            state: {
                loki: {
                    uploadFileProgress: {},
                    uploadedFiles: []
                }
            },
            actions
        })

        props = {
            repository: 'repo1'
        }

        wrapper = shallowMount(AzFileUpload, { localVue, store, props, vuetify: new Vuetify({}) })
        wrapper.setProps(props)
    })

    it('Props are defined', () => {
        expect(wrapper.vm.thumbnail).toBeFalsy()
        expect(wrapper.vm.repository).toEqual('repo1')
        expect(wrapper.vm.accept).toEqual('*')
    })

    it('Do nothing when the list of selected files to be uploaded is empty', () => {
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
                getAsFile() {
                    return { name: 'file1' }
                }
            },
            1: {
                name: 'file2',
                kind: 'notfile'
            }
        }
        wrapper.vm.onDropFiles(droppedItems)

        expect(actions.uploadFile.mock.calls).toHaveLength(1)
        expect(actions.uploadFile.mock.calls[0][1].filename).toEqual(droppedItems['0'].name)
    })

    it('Opens the file selector', () => {
        const mockedInput = {
            click: jest.fn()
        }
        jest.spyOn(document, 'getElementById').and.returnValue(mockedInput)
        wrapper.vm.openFileSelector()
        expect(mockedInput.click).toHaveBeenCalled()
    })
})
