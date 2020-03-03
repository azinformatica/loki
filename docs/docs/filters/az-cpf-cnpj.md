---
id: azCpfCnpj
title: AzCpfCnpj
---

O `azCpfCnpj` é utilizado para formatar os valores de CPF ou CNPJ.

## Utilização

HTML

```html
<p>CPNJ: {{ cnpj | azCpfCnpj }}</p>
<p>CPF: {{ cpf | azCpfCnpj }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            cnpj: '90573070000121',
            cpf: '24940622096'
        }
    }
}
```

Resultado
![Resultado az-cnpj-cpf](/loki/img/examples/example-az-cnpj-cpf.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| cpfCnpj | Texto com a informação. | String |