---
id: azTitleCase
title: AzTitleCase
---

O `azTitleCase` é utilizado para deixar somente a primeira letra de uma frase maíuscula.

## Utilização

HTML

```html
<p>{{ title | azTitleCase }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            title: 'AQUI SERÁ UM TÍTULO'
        }
    }
}
```

Resultado
![Resultado az-title-case](../../img/examples/example-az-title-case.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| str | Informação ser exibida. | String |