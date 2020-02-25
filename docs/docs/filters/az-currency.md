---
id: azCurrency
title: AzCurrency
---

O `azCurrency` é utilizado para formatação de valores monetários.

## Utilização

HTML

```html
<p>{{ value | azCurrency }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            value: 49458.29
        }
    }
}
```

Resultado
![Resultado az-currency](../../img/examples/example-az-currency.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| value | Valor monetário. | String |
| precision | Total de casas decimais. | Number |

## Exemplo

HTML

```html
<p>{{ value | azCurrency(4) }}</p>
```

Resultado
![Resultado 2 az-currency](../../img/examples/example-az-currency-2.jpeg)