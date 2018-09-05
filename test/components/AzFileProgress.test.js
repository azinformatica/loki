import AzFileUpload from '../../src/components/file/AzFileProgress'
import Vuex from 'vuex'
import {shallow, createLocalVue} from 'vue-test-utils'

const localVue = createLocalVue();
localVue.use(Vuex)

xdescribe('AzFileProgress.test.js', () => {
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

        wrapper = shallow(AzFileUpload, {localVue, store, props})
        wrapper.setProps(props)
    })

    it('Computed properties are set properly', () => {
        expect(wrapper.vm.showDialog).toBeTruthy()
        expect(wrapper.vm.isUploading).toBeTruthy()
        expect(wrapper.vm.filesBeingUploaded).toEqual(['default.png', 'error.png'])
        expect(wrapper.vm.finishedUploadsCount).toEqual(1)
    })

    it('Returns short name for file', () => {
        const filename = 'file12345678901234567890123456789012345678901234567890.pdf'
        expect(wrapper.vm.getFileShortName(filename).length).toBe(43)
    })

    it('Checks if there is progress info for the specified file', () => {
        let filename = 'default.png'
        expect(wrapper.vm.hasProgressForFile(filename)).toBeTruthy()

        filename = 'file.png'
        expect(wrapper.vm.hasProgressForFile(filename)).toBeFalsy()
    })

    it('Checks if there was error while uploading an specified file', () => {
        let filename = 'default.png'
        expect(wrapper.vm.hasUploadError(filename)).toBeFalsy()

        filename = 'file.png'
        expect(wrapper.vm.hasUploadError(filename)).toBeFalsy()

        filename = 'error.png'
        expect(wrapper.vm.hasUploadError(filename)).toBeTruthy()
    })

    it('Returns the number of uploading files', () => {
        expect(wrapper.vm.getUploadInProgressCount()).toEqual(1)
    })

    it('Removes all files with errors when closing the progress windo', () => {
        wrapper.vm.close()
        expect(mutations.REMOVE_UPLOAD_FILE_PROGRESS).toHaveBeenCalled()
    })

})
