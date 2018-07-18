<template>
    <div>
        <form enctype="multipart/form-data" novalidate>
            <div class="az-drop-file"
                 :style="{'height': height}"
                 @drop.prevent="onDropFiles($event.dataTransfer.items)"
                 @dragover.prevent="">
                <input id="azFileSelector" type="file" multiple class="input-file"
                       :name="uploadFieldName"
                       :accept="accept"
                       @change="onSelectFiles($event.target.files)"/>
                <div class="center">
                    <slot></slot>
                </div>
            </div>
        </form>
        <az-file-progress></az-file-progress>
    </div>
</template>

<script>

    import AzFileProgress from './AzFileProgress'

    export default {
        props: {
            accept: {
                type: String,
                default: '*'
            },
            repository: {
                type: String,
                required: true
            },
            thumbnail: {
                type: Boolean,
                default: false
            },
            height: {
                type: String,
                default: '200px'
            }
        },
        data() {
            return {
                uploadFieldName: 'file'
            }
        },
        methods: {
            onSelectFiles(fileList) {
                if (!fileList.length) {
                    return;
                }
                this.uploadFiles(fileList)
            },
            onDropFiles(eventItems) {
                if (!Object.keys(eventItems).length) {
                    return;
                }
                const files = []
                Object.keys(eventItems).forEach((key) => {
                    const item = eventItems[key]
                    if (item.kind === 'file') {
                        files.push(item.getAsFile())
                    }
                })
                this.uploadFiles(files)
            },
            uploadFiles(fileList) {
                Array
                    .from(Array(fileList.length).keys())
                    .map(x => {
                        const payload = this.createPayload(fileList[x])
                        this.$store.dispatch('uploadFile', payload)
                    });
            },
            createPayload(file) {
                return {
                    repository: this.repository,
                    thumbnail: this.thumbnail,
                    formData: this.createFormData(file),
                    filename: file.name
                }
            },
            createFormData(file) {
                const formData = new FormData()
                formData.append(this.uploadFieldName, file)
                return formData
            },
            openFileSelector() {
                document.getElementById('azFileSelector').click()
            }
        },
        components: {
            AzFileProgress
        }
    }

</script>

<style scoped>

    .az-drop-file {
        background: #f0f0f0;
        color: #7b7b7b;
        display: flex;
        align-items: center;
        border: 2px dashed #b5b5b5;
        text-align: center;
        position: relative;
    }

    .az-drop-file:hover {
        border-color: #939393;
    }

    .az-drop-file .center {
        margin: 0 auto;
        padding: 0;
    }

    .az-drop-file .input-file {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        width: 10px;
        height: 10px;
        z-index: 1;
    }

</style>
