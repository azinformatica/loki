<template>
    <div class="text-xs-center">
        <v-dialog value="true" :width="width" persistent>
            <v-card>
                <v-card-text>
                    <slot></slot>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="$emit('ok')">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'AzDialog',
    props: {
        width: {
            type: Number,
            default: 500
        }
    }
}
</script>
