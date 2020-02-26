---
id: azNumber
title: AzNumber
---

O `azNumber` é utilizado para a formatação de números.

## Utilização

HTML

```html
<p>{{ number | azNumber }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            number: 7428
        }
    }
}
```

Resultado
![Resultado az-number](../../img/examples/example-az-number.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| value | Informação com a ser exibida. | String |