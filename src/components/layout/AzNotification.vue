<template>
    <v-snackbar v-model="show" :color="color" right top>
        {{ text }}
        <v-btn dark flat @click="show = false">
            <v-icon small>close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        name: 'AzNotification',
        data() {
            return {
                text: '',
                color: '',
                show: false
            }
        },
        created: function () {
            this.$store.watch(state => state.loki.notification, () => {
                const notification = this.$store.state.loki.notification
                if (notification.message !== '') {
                    this.show = true
                    this.text = notification.message
                    this.color = notification.type
                }
            })
        }
    }
</script>