<template>
   <v-snackbar v-model="show" :color="color" right top :timeout="timeout">
       <div class="d-flex align-center">
           <v-icon v-if="computedIcon" class="mr-2" color="white">
               {{ computedIcon }}
           </v-icon>
           <span :style="style">{{ text }}</span>
           <a v-if="hasButtom" class="ml-2" @click="undoAction" :style="styleButtom">
               {{ mensageButtom }}
           </a>
       </div>


       <template v-slot:action="{ attrs }">
           <v-btn plain v-bind="attrs" @click="show = false" :style="styleButtomClose">
               <v-icon small color="white">mdi-close</v-icon>
           </v-btn>
       </template>
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
               alertIcon: ''
           }
       },
       computed: {
           computedIcon() {
               if (this.alertIcon) return this.alertIcon
               const iconMap = {
                   success: 'mdi-check-circle',
                   error: 'mdi-alert-circle',
                   warning: 'mdi-alert',
                   info: 'mdi-information',
               }
               const key = (this.color || '').toLowerCase().trim()
               return iconMap[key] || ''
           }
       },
       methods: {
           async undoAction() {
               const rollback = true
               await this.$store.commit(mutationTypes.ROLLBACK_ACTION, rollback)
               this.show = false
           }
       },
       created: function () {
           this.$store.watch(
               (state) => state.loki.alert,
               () => {
                   const alert = this.$store.state.loki.alert
                   if (alert && alert.message !== '') {
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
                       this.alertIcon = alert.icon || ''
                   }
               }
           )
       }
   }
</script>

<style lang="stylus" scoped>
   v-snackbar
       width: 12px !important
</style>
