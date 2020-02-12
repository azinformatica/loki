# Loki [![npm version](https://badge.fury.io/js/%40azinformatica%2Floki.svg)](https://badge.fury.io/js/%40azinformatica%2Floki)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
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
    <td align="center"><a href="https://github.com/hengling"><img src="https://avatars0.githubusercontent.com/u/4369590?v=4" width="100px;" alt=""/><br /><sub><b>Adolfo M. Hengling</b></sub></a><br /><a href="#question-hengling" title="Answering Questions">💬</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3Ahengling" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=hengling" title="Code">💻</a> <a href="#design-hengling" title="Design">🎨</a> <a href="#ideas-hengling" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/pulls?q=is%3Apr+reviewed-by%3Ahengling" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=hengling" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://jefersonurbieta.com.br"><img src="https://avatars3.githubusercontent.com/u/12651715?v=4" width="100px;" alt=""/><br /><sub><b>Jeferson Urbieta</b></sub></a><br /><a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3AJefersonUrbieta" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=JefersonUrbieta" title="Code">💻</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=JefersonUrbieta" title="Documentation">📖</a> <a href="#ideas-JefersonUrbieta" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=JefersonUrbieta" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/heliokanno"><img src="https://avatars0.githubusercontent.com/u/4403948?v=4" width="100px;" alt=""/><br /><sub><b>Helio Makoto Kanno</b></sub></a><br /><a href="#question-heliokanno" title="Answering Questions">💬</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3Aheliokanno" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=heliokanno" title="Code">💻</a> <a href="#design-heliokanno" title="Design">🎨</a> <a href="#ideas-heliokanno" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-heliokanno" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-heliokanno" title="Maintenance">🚧</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/pulls?q=is%3Apr+reviewed-by%3Aheliokanno" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/charlesviegas"><img src="https://avatars2.githubusercontent.com/u/1191771?v=4" width="100px;" alt=""/><br /><sub><b>Charles Viegas</b></sub></a><br /><a href="#question-charlesviegas" title="Answering Questions">💬</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=charlesviegas" title="Code">💻</a> <a href="#design-charlesviegas" title="Design">🎨</a> <a href="#ideas-charlesviegas" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-charlesviegas" title="Maintenance">🚧</a> <a href="#projectManagement-charlesviegas" title="Project Management">📆</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/pulls?q=is%3Apr+reviewed-by%3Acharlesviegas" title="Reviewed Pull Requests">👀</a> <a href="#talk-charlesviegas" title="Talks">📢</a></td>
    <td align="center"><a href="https://github.com/morelli690"><img src="https://avatars2.githubusercontent.com/u/17299358?v=4" width="100px;" alt=""/><br /><sub><b>cesar-morelli</b></sub></a><br /><a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3Amorelli690" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=morelli690" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mrevandro"><img src="https://avatars3.githubusercontent.com/u/10819826?v=4" width="100px;" alt=""/><br /><sub><b>Evandro Oliveira da Silva</b></sub></a><br /><a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3Amrevandro" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=mrevandro" title="Code">💻</a> <a href="#design-mrevandro" title="Design">🎨</a> <a href="#ideas-mrevandro" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=mrevandro" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/leandroduprat"><img src="https://avatars1.githubusercontent.com/u/39559287?v=4" width="100px;" alt=""/><br /><sub><b>Leandro Duprat</b></sub></a><br /><a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3Aleandroduprat" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=leandroduprat" title="Code">💻</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/carlos-henrique-costa-silva/"><img src="https://avatars3.githubusercontent.com/u/25915025?v=4" width="100px;" alt=""/><br /><sub><b>Carlos Henrique</b></sub></a><br /><a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3Acaarloshenrique" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=caarloshenrique" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Gaboso"><img src="https://avatars1.githubusercontent.com/u/12553474?v=4" width="100px;" alt=""/><br /><sub><b>Gabriel de Carvalho</b></sub></a><br /><a href="https://github.com/@azinformatica/@azinformatica/loki/issues?q=author%3AGaboso" title="Bug reports">🐛</a> <a href="https://github.com/@azinformatica/@azinformatica/loki/commits?author=Gaboso" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!