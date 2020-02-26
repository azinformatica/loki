---
id: auth
title: Auth
---

A diretiva `azAuth` é utilizada para verificar se o componente tem a permissão necessária para visualização.

## Utilização

HTML

```html
<az-call-to-action v-az-auth="'Perfil.Admin,Perfil.Normal'"
                   active class="btn-new">
    Novo
</az-call-to-action>
```

Resultado
![Resultado az-clip-text](../loki/img/examples/example-az-clip-text.jpeg)