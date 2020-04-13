<template>
    <v-snackbar v-model="show" :color="color" right top>
        <span :style="style">{{ text }}</span>
         <a v-if="desfazer" @click="desfazerAcao" :style="styleDesfazer">Desfazer</a>
        <v-btn dark text @click="show = false">
            <v-icon small :color="iconColor">close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
import  mutationTypes  from '@azinformatica/loki/src/store/mutation-types'
export default {
    name: 'AzAlert',
    data() {
        return {
            text: '',
            color: '',
            show: false,
            desfazer:false,
            style:"",
            styleDesfazer:""
        }
    },
    methods:{
       async desfazerAcao(){
            console.log('Desfeito')
            const rollback  = true
            await this.$store.commit(mutationTypes.ROLLBACK_ACTION,rollback)
            this.show = false
            console.log(this.$store.state.loki)
        },
    },
    created: function() {
        this.$store.watch(
            state => state.loki.alert,
            () => {
                const alert = this.$store.state.loki.alert
                if (alert.message !== '') {
                    this.show = true
                    this.text = alert.message
                    this.desfazer=alert.desfazer
                    this.color = alert.type
                    this.style = alert.style
                    this.styleDesfazer = alert.styleDesfazer
                    this.iconColor = alert.iconColor
                }
            }
        )
        
    }
}
</script>
