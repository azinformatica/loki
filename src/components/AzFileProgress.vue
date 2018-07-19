<template>
    <div class="card" v-show="showDialog">
        <div class="card_title">
            {{finishedUploadsCount}} upload concluídos
            <a href="#" class="close" @click.prevent="close()" v-show="!isUploading">
                <v-icon color="grey">close</v-icon>
            </a>
        </div>
        <div class="scroll">
            <ul class="lista_upload">
                <li v-for="file in filesBeingUploaded" :key="file">
                    <div v-show="hasProgressForFile(file)">
                        <span class="filename">{{getFileShortName(file)}}</span>
                        <div class="fas">
                            <v-progress-circular size="24" :value="getFileUploadProgress(file)"
                                                 v-show="!hasUploadError(file)"></v-progress-circular>
                            <v-icon v-show="hasUploadError(file)">error</v-icon>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    import actionTypes from '../store/actions-types'

    export default {
        computed: {
            showDialog() {
                return Object.keys(this.$store.state.loki.uploadFileProgress).length > 0
            },
            isUploading() {
                return this.getUploadInProgressCount() > 0
            },
            filesBeingUploaded() {
                return Object.keys(this.$store.state.loki.uploadFileProgress)
            },
            finishedUploadsCount() {
                return this.$store.state.loki.uploadedFiles.length
            }
        },
        methods: {
            getFileShortName(filename) {
                return filename.substr(0, 40) + '...'
            },
            hasProgressForFile(file) {
                return this.$store.state.loki.uploadFileProgress[file] !== undefined
            },
            getFileUploadProgress(filename) {
                return this.$store.state.loki.uploadFileProgress[filename].progress
            },
            hasUploadError(filename) {
                const fileProgressInfo = this.$store.state.loki.uploadFileProgress[filename]
                return fileProgressInfo && fileProgressInfo.error
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
            close() {
                Object.keys(this.$store.state.loki.uploadFileProgress).forEach((filename) => {
                    this.$store.commit(actionTypes.REMOVE_UPLOAD_FILE_PROGRESS, filename)
                })
            }
        }
    }
</script>

<style>

    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700');

    .card {
        position: absolute;
        right: 15px;
        bottom: 0;
        border: 1px solid #ebebeb;
        min-width: 350px;
        background-color: #fff;
    }

    .card .scroll {
        max-height: 350px;
        overflow-y: scroll;
    }

    .card .card_title {
        background: #2c2c2c;
        padding: 15px 20px;
        color: #fdfdfd;
        font-weight: 300;
        font-size: 12px;
    }

    .card .card_title .close {
        position: absolute;
        right: 15px;
        top: 12px;
    }

    .lista_upload {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .lista_upload li {
        padding: 15px 20px;
        border-bottom: 1px solid #ebebeb;
        font-size: 14px;
        color: #434343;
        position: relative;
    }

    .lista_upload li .fas {
        position: absolute;
        right: 15px;
        top: 12px;
    }

    .lista_upload .filename {
        font-family: 'Roboto', sans-serif;
        font-weight: normal;
        font-size: 12px;
    }

</style>
