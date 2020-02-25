---
id: azElapsedTime
title: AzElapsedTime
---

O `azElapsedTime` é utilizado para exibir a quantidade de horas decorridas a partir da data atual.

## Utilização

HTML

```html
<p>{{ date | azElapsedTime }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            date: '2020-02-25T15:04:49'
        }
    }
}
```

Resultado
![Resultado az-elapsed-time](../../img/examples/example-az-elapsed-time.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| date | Informação com a data completa. | String |