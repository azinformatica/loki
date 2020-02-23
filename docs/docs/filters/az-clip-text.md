---
id: azClipText
title: AzClipText
---

O `azClipText` é utilizado para limitar a quantidade de caracteres que será exibido no texto.

## Utilização

HTML

```html
<p>{{ phrase | azClipText(size) }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            phrase: 'Pokem ipsum dolor sit amet Charizard.',
            size: 10
        }
    }
}
```

Resultado
![Resultado az-clip-text](../../img/examples/example-az-clip-text.jpeg)

## API

| Params | Descrição | Default |
| ------------- | ------------- | ------------- |
| text | Texto completo a ser exibido. | String |
| length | Limite de caracteres que deve ser exibido. | String |
| suffix | Informações que devem ser mostradas ao chegar ao limite. | String - `...` |

## Exemplo

HTML

```html
<p>{{ phrase | azClipText(size, ' [...]') }}</p>
```

Vue.js
```js
export default {
    data() {
        return {
            phrase: 'Pokem ipsum dolor sit amet Charizard.',
            size: 25
        }
    }
}
```

Resultado
![Resultado 2 az-clip-text](../../img/examples/example-az-clip-text-2.jpeg)