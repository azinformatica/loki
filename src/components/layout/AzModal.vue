<template>
    <v-dialog value="true" persistent :max-width="maxWidth">
        <v-card>
            <v-card-title class="primary modal-title" primary-title>
                <slot name="title" />
            </v-card-title>
            <v-card-text>
                <slot name="body" />
            </v-card-text>
            <v-card-actions>
                <v-flex>
                    <slot name="actions" />
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'AzModal',
    props: {
        maxWidth: {
            type: String,
            default: '650px'
        }
    }
}
</script>

<style lang="stylus">
.modal-title
    margin: 0
    padding: 10px 20px
    font-size: 18px !important
    color: white
</style>
