# Loki [![npm version](https://badge.fury.io/js/%40azinformatica%2Floki.svg)](https://badge.fury.io/js/%40azinformatica%2Floki)
Vue UI Components built with Vuetify framework

## Installing
* Download the project using "`git clone`" command (or download the zip file and extract the project if you don't have git installed on your machine)
* Access the project folder (usually loki)
* Install dependencies via npm (`npm install`)
* That's all! 

## How to use

Usage example of az-confirm component:
````
<v-flex xs12 sm3 d-flex>
    <v-btn @click="showDialog = true">Show Dialog Button</v-btn>
    <az-confirm question="This is the text content of the dialog"
                v-if="showDialog"
                @onConfirm="eventoConfirm()"
                @onDecline="eventoDecline()"
    ></az-confirm>
</v-flex>
````
Parameters:

|Name|Description|Type|Default| Required|
|----|-----------|----|-------|---------|
label-confirm|"Yes" button label| String|'Sim'|no|
label-decline|"No" button label| String|'Não'|no|
maxWidth|Component width| Number|290|no|
question|Content of dialog| String||yes|

Events:

|Name|Description|
|----|-----------|
@onConfirm|Yes button event|
@onDecline|No botton event|


You can use our UI Libray in your projects, improve it and propose modifications to us.
