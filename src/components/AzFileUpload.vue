<template>
    <form enctype="multipart/form-data" novalidate v-if="!isUploading">
        <div class="az-drop-file">
            <input type="file" multiple :name="uploadFieldName" class="input-file" :accept="accept"
                   @change="filesChange($event.target.files)"/>
            <slot></slot>
        </div>
    </form>
</template>

<script>

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
            }
        },
        data() {
            return {
                uploadFieldName: 'file'
            }
        },
        computed: {
            isUploading() {
                return Object.keys(this.$store.state.loki.uploadFileProgress).length > 0
            }
        },
        methods: {
            filesChange(fileList) {
                if (!fileList.length) {
                    return;
                }
                this.uploadFiles(fileList)
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
            }
        }
    }
</script>

<style scoped>

    .az-drop-file {
        border: 2px dashed #ccc;
        margin: 10px 0;
        padding: 30px 0 20px;
        display: block;
        align-content: center;
        align-items: center;
        text-align: center;
        background-color: #eeeeee;
    }

    .input-file {
        opacity: 0; /* invisible but it's there! */
        left: 0;
        height: 200px;
        width: 100%;
        position: absolute;
        cursor: pointer;
    }

</style>
