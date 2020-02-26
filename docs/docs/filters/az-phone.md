---
id: azPhone
title: AzPhone
---

O `azPhone` é utilizado para a formatação de números de telefone.

## Utilização

HTML

```html
<p>{{ phoneNumber | azPhone }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            phoneNumber: 61993490234
        }
    }
}
```

Resultado
![Resultado az-phone](../../img/examples/example-az-phone.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| phone | Informação com o número de celular completo sem formatação. | String |