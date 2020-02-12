# Loki [![npm version](https://badge.fury.io/js/%40azinformatica%2Floki.svg)](https://badge.fury.io/js/%40azinformatica%2Floki)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/thalita12"><img src="https://avatars0.githubusercontent.com/u/12161520?v=4" width="100px;" alt=""/><br /><sub><b>Thalita Oliveira</b></sub></a><br /><a href="#question-thalita12" title="Answering Questions">💬</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3Athalita12" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=thalita12" title="Code">💻</a> <a href="#design-thalita12" title="Design">🎨</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=thalita12" title="Documentation">📖</a> <a href="#ideas-thalita12" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-thalita12" title="Maintenance">🚧</a> <a href="#projectManagement-thalita12" title="Project Management">📆</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/pulls?q=is%3Apr+reviewed-by%3Athalita12" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=thalita12" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!