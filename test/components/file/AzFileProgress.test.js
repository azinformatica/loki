import AzFileUpload from '../../../src/components/file/AzFileProgress'
import Vuex from 'vuex'
import {shallowMount, createLocalVue} from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vue from 'vue'

const localVue = createLocalVue();
localVue.use(Vuex)
Vue.use(Vuetify)

describe('AzFileProgress.test.js', () => {
    let wrapper, props, store, mutations

    beforeEach(() => {
        mutations = {
            REMOVE_UPLOAD_FILE_PROGRESS: jest.fn()
        }

        store = new Vuex.Store({
            state: {
                loki: {
                    uploadFileProgress: {
                        'default.png': {filename: 'default.png'},
                        'error.png': {filename: 'error.png', error: true}
                    },
                    uploadedFiles: [{name: 'picture.png'}]
                }
            },
            mutations
        })

        props = {
            repository: 'repo1'
        }

        wrapper = shallowMount(AzFileUpload, {localVue, store, props})
        wrapper.setProps(props)
    })

    it('Computed properties are set properly', () => {
        expect(wrapper.vm.showDialog).toBeTruthy()
        expect(wrapper.vm.isUploading).toBeTruthy()
        expect(wrapper.vm.filesBeingUploaded[0].filename).toEqual('default.png')
        expect(wrapper.vm.filesBeingUploaded[1].filename).toEqual('error.png')
        expect(wrapper.vm.finishedUploadsCount).toEqual(1)
    })

    it('Returns short name for file', () => {
        const file = {filename:"file12345678901234567890123456789012345678901234567890.pdf"};
        expect(wrapper.vm.getFileShortName(file).length).toBe(43)
    })

    it('Checks if there is progress info for the specified file', () => {
        let filename = 'default.png'
        expect(wrapper.vm.hasProgressForFile(filename)).toBeTruthy()

        let filenameUndef
        expect(wrapper.vm.hasProgressForFile(filenameUndef)).toBeFalsy()
    })

    it('Checks if there was error while uploading an specified file', () => {

        let file = {filename:"default.png", error: false};
        expect(wrapper.vm.hasUploadError(file)).toBeFalsy()

        expect(wrapper.vm.hasUploadError(file)).toBeFalsy()

        file = {filename:"erro.png", error: true};
        expect(wrapper.vm.hasUploadError(file)).toBeTruthy()
    })

    it('Returns the number of uploading files', () => {
        expect(wrapper.vm.getUploadInProgressCount()).toEqual(1)
    })

    it('Removes all files with errors when closing the progress windo', () => {
        wrapper.vm.close()
        expect(mutations.REMOVE_UPLOAD_FILE_PROGRESS).toHaveBeenCalled()
    })

})
