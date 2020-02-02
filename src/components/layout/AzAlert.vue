<template>
    <v-snackbar v-model="show" :color="color" right top>
        {{ text }}
        <v-btn dark text @click="show = false">
            <v-icon small>close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    name: 'AzAlert',
    data() {
        return {
            text: '',
            color: '',
            show: false
        }
    },
    created: function() {
        this.$store.watch(
            state => state.loki.alert,
            () => {
                const alert = this.$store.state.loki.alert
                if (alert.message !== '') {
                    this.show = true
                    this.text = alert.message
                    this.color = alert.type
                }
            }
        )
    }
}
</script>
