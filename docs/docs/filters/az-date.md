---
id: azDate
title: AzDate
---

O `azDate` é utilizado para formatação de datas.

## Utilização

HTML

```html
<p>{{ date | azDate }}</p>
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
![Resultado az-date](../../img/examples/example-az-date.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| date | Informação com a data completa. | String |
| format | Formato para exibir a data. | String |

## Exemplo

HTML

```html
<p>{{ date | azDate('DD/MM/YYYY HH:mm:ss') }}</p>
```

Resultado
![Resultado 2 az-date](../../img/examples/example-az-date-2.jpeg)