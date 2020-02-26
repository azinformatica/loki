---
id: azEnum
title: AzEnum
---

O `azEnum` é utilizado para formatar listas de objetos com suas respectivas labels.

## Utilização

HTML

```html
<p>{{ status | azEnum(options) }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            status: 'EM_ANALISE',
            options: {
                ABERTA: 'Aberta',
                EM_ELABORACAO: 'Em Elaboração',
                EM_ANALISE: 'Em Análise',
                ENCERRADA: 'Encerrada'
            }
        }
    }
}
```

Resultado
![Resultado az-enum](../../img/examples/example-az-enum.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| value | Informação com a ser comparada e exibida. | String |
| enumObject | Enum de objetos. | Object |