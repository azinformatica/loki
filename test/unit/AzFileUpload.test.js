import AzFileUpload from '../../src/components/AzFileUpload'
import Vuex from 'vuex'
import {shallow, createLocalVue} from 'vue-test-utils'

const localVue = createLocalVue();
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
                },
            },
            actions
        })

        props = {
            repository: 'repo1'
        }

        wrapper = shallow(AzFileUpload, {localVue, store, props})
        wrapper.setProps(props)
    })

    it('Props are defined', () => {
        expect(wrapper.vm.thumbnail).toBeFalsy()
        expect(wrapper.vm.repository).toEqual('repo1')
        expect(wrapper.vm.accept).toEqual('*')
    })

    it('Component is rendered according to reactivity of computed properties', () => {
        const renderedHtml = expect(wrapper.html())
        renderedHtml.toContain('az-drop-file')
    })

    it('Do nothing when the list of files to be uploaded is empty', () => {
        const filesToBeUploaded = []
        wrapper.vm.filesChange(filesToBeUploaded)
        expect(actions.uploadFile.mock.calls).toHaveLength(0)
    })

    it('Calls the store to upload the files that were dragged into the component', () => {
        const filesToBeUploaded = [{name: 'file1'}, {name: 'file2'}]
        wrapper.vm.filesChange(filesToBeUploaded)

        expect(actions.uploadFile.mock.calls).toHaveLength(2)
        for (let i = 0; i < filesToBeUploaded.length; i++) {
            expect(actions.uploadFile.mock.calls[i][1].filename).toEqual(filesToBeUploaded[i].name)
        }
    })

    it('Methods are defined', () => {
        expect(typeof wrapper.vm.filesChange).toBe('function')
        expect(typeof wrapper.vm.uploadFiles).toBe('function')
        expect(typeof wrapper.vm.createPayload).toBe('function')
        expect(typeof wrapper.vm.createFormData).toBe('function')
    })

})