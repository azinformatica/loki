<template>
    <v-snackbar v-model="show" :color="color" right top :timeout="timeout">
        <span :style="style">{{ text }}</span>
        <a v-if="hasButtom" @click="undoAction" :style="styleButtom">{{ mensageButtom }}</a>
        <v-btn dark text @click="show = false" :style="styleButtomClose">
            <v-icon small :color="iconColor">close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
import mutationTypes from '@azinformatica/loki/src/store/mutation-types'
export default {
    name: 'AzAlert',
    data() {
        return {
            text: '',
            color: '',
            iconColor: '',
            show: false,
            hasButtom: false,
            style: '',
            styleButtom: '',
            mensageButtom: '',
            timeout: 6000,
            styleButtomClose: '',
        }
    },
    methods: {
        async undoAction() {
            const rollback = true
            await this.$store.commit(mutationTypes.ROLLBACK_ACTION, rollback)
            this.show = false
        },
    },
    created: function () {
        this.$store.watch(
            (state) => state.loki.alert,
            () => {
                const alert = this.$store.state.loki.alert
                if (alert.message !== '') {
                    this.show = true
                    this.text = alert.message
                    this.hasButtom = alert.hasButtom
                    this.color = alert.type
                    this.style = alert.style
                    this.styleButtom = alert.styleButtom
                    this.iconColor = alert.iconColor
                    this.mensageButtom = alert.mensageButtom
                    this.timeout = alert.timeOut
                    this.styleButtomClose = alert.styleButtomClose
                }
            }
        )
    },
}
</script>

<style lang="stylus" scoped>
v-snackbar
    width: 12px !important
</style>
