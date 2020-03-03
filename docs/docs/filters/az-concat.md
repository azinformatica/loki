---
id: azConcat
title: AzConcat
---

O `azConcat` é utilizado para concatenar e exibir informações juntas.

## Utilização

HTML

```html
<p>{{ list | azConcat }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            list: ['ME', 'EPP', 'MEI']
        }
    }
}
```

Resultado
![Resultado az-concat](/loki/img/examples/example-az-concat.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| value | Lista de array com as palavras. | Array |
| separator | Caracter que deve ser o separador das palavras. | String - `/` |

## Exemplo

HTML

```html
<p>{{ list | azConcat(' - ') }}</p>
```

Resultado
![Resultado 2 az-concat](/loki/img/examples/example-az-concat-2.jpeg)