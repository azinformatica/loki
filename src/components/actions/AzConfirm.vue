<template>
    <v-layout row justify-center>
        <v-dialog persistent value="true" :max-width="maxWidth">
            <v-card>
                <v-card-text>{{question}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="$emit('onDecline')">{{labelDecline}}</v-btn>
                    <v-btn color="primary" flat @click="$emit('onConfirm')">{{labelConfirm}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        name: 'AzConfirmDialog',
        props: {
            question: {
                type: String,
                required: true
            },
            labelConfirm: {
                type: String,
                default: 'Sim'
            },
            labelDecline: {
                type: String,
                default: 'Não'
            },
            maxWidth: {
                type: Number,
                default: 290
            }
        }
    }
</script>