# Loki [![npm version](https://badge.fury.io/js/%40azinformatica%2Floki.svg)](https://badge.fury.io/js/%40azinformatica%2Floki)
Vue UI Components built with Vuetify framework

## Installing
* Download the project using "`git clone`" command (or download the zip file and extract the project if you don't have git installed on your machine)
* Access the project folder (usually loki)
* Install dependencies via npm (`npm install`)
* That's all! 

## How to use

Usage of az-confirm in Parent:
````
<v-flex xs12 sm3 d-flex>
                    <v-btn @click="mostrarAzConfirmDialog = true">Mostrar Dialog</v-btn>
                    <az-confirm question="TEXTO TESTE CHILD AAAA"
                                v-if="mostrarAzConfirmDialog"
                                @onConfirm="eventoConfirm()"
                                @onDecline="eventoDecline()"
                    ></az-confirm>
                </v-flex>
````
You can also add 'labelConfirm' and 'labelDecline' parameters to change 'yes/no' language. 
Not required parameters:
````
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
````            

You can use our UI Libray in your projects, improve it and propose modifications to us.
