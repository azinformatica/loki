<template>
    <div id="azFileProgress" class="card" v-show="showDialog">
        <div class="card_title">
            {{ finishedUploadsCount }} arquivos concluídos
            <a href="#" class="close" @click.prevent="close()" v-show="!isUploading">
                <v-icon color="grey">close</v-icon>
            </a>
        </div>
        <div class="scroll">
            <ul class="upload_list">
                <li v-for="(file, index) in filesBeingUploaded" :key="index">
                    <div v-show="hasProgressForFile(file)">
                        <span class="filename">{{ getFileShortName(file) }}</span>
                        <div class="fas">
                            <v-progress-circular
                                size="24"
                                :value="getFileUploadProgress(file)"
                                v-show="!hasUploadError(file)"
                            ></v-progress-circular>
                            <v-icon v-show="hasUploadError(file)">error</v-icon>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import mutationTypes from '../../store/mutation-types'

export default {
    name: 'AzFileProgress',
    computed: {
        showDialog() {
            return Object.keys(this.$store.state.loki.uploadFileProgress).length > 0
        },
        isUploading() {
            return this.getUploadInProgressCount() > 0
        },
        filesBeingUploaded() {
            const uploadFileProgress = this.$store.state.loki.uploadFileProgress
            const hashNames = Object.keys(uploadFileProgress)
            const files = []
            hashNames.forEach((hashName) => {
                files.push(uploadFileProgress[hashName])
            })
            return files
        },
        finishedUploadsCount() {
            return this.$store.state.loki.uploadedFiles.length
        },
    },
    methods: {
        close() {
            Object.keys(this.$store.state.loki.uploadFileProgress).forEach((filename) => {
                this.$store.commit(mutationTypes.REMOVE_UPLOAD_FILE_PROGRESS, filename)
            })
        },
        getFileShortName(file) {
            return file.filename.substr(0, 40) + '...'
        },
        getFileUploadProgress(file) {
            return file.progress
        },
        getUploadInProgressCount() {
            let uploading = 0

            Object.keys(this.$store.state.loki.uploadFileProgress).forEach((filename) => {
                const file = this.$store.state.loki.uploadFileProgress[filename]
                if (file && !file.error) {
                    uploading++
                }
            })

            return uploading
        },
        hasProgressForFile(file) {
            return file !== undefined
        },
        hasUploadError(file) {
            return file && file.error
        },
    },
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Roboto:300, 400, 700')

.card
    position: absolute
    right: 15px
    bottom: 0
    border: 1px solid #ebebeb
    min-width: 350px
    background-color: #fff
    z-index: 999

    .scroll
        max-height: 350px
        overflow-y: scroll

    .card_title
        background: #2c2c2c
        padding: 15px 20px
        color: #fdfdfd
        font-weight: 300
        font-size: 12px

        .close
            position: absolute
            right: 15px
            top: 12px
            text-decoration: none

.upload_list
    list-style-type: none
    margin: 0
    padding: 0

    li
        padding: 15px 20px
        border-bottom: 1px solid #ebebeb
        font-size: 14px
        color: #434343
        position: relative

        .fas
            position: absolute
            right: 15px
            top: 12px

    .filename
        font-family: 'Roboto', sans-serif
        font-weight: normal
        font-size: 12px
</style>
