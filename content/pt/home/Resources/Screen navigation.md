---
title: Navegação de telas
weight: 213
description: >-
  Nesta seção, você encontra uma demonstração de como o Beagle lida com
  navegação de tela.
---

---

No Beagle, a navegação \(ou Navigate\) é um tipo de [**Ação**](/pt/home/api/actions) e que, por isso, pode ser usada por todos componentes que recebem uma ação.

{{% alert color="info" %}}
Vale lembrar que, antes de configurar a navegação entre telas da sua aplicação, é preciso que você já tenha feito a [**instalação do Beagle**](/pt/home/get-started/installing-beagle/), as [**configurações de uso**](/pt/home/get-started/using-beagle/) e testado o framework do Beagle no tutorial para [**exibir uma tela server-driven.**](/pt/home/tutorials/how-to-display-a-screen)
{{% /alert %}}

Depois de fazer todas as configurações, basta colocar o código dos exemplos como retorno do seu serviço e chamar o endpoint, definido na sua controller, no frontend de sua preferência.

## Rotas de Navegação

Algumas ações de navegação precisam de um parâmetro. É possível receber dois tipos de rota, que são:

- **Local:** navegação interna que já espera pela nova [**tela**](/pt/home/api/screen/).
- **Remote:** navegação que, a partir de uma URL, aponta para uma API que irá retornar um ou mais componentes do Beagle.

No exemplo abaixo, você vê um caso onde o `route` é `remote`:

{{< tabs id="T89" >}}
{{% tab name="JSON" %}}

```javascript
{
    "_beagleComponent_": "beagle:button",
    "text": "Click me!",
    "onPress": [
        {
            "_beagleAction_": "beagle:pushStack",
            "route": {
                "url": "/my-next-screen",
                "shouldPrefetch": false
            }
        }
    ]
}
```

{{% /tab %}}

{{% tab name="Kotlin DSL" %}}

```kotlin
Button(
   text = "Click me!",
   onPress = listOf(
       Navigate.PushStack(
           route = Route.Remote("/my-next-screen")
       )
   )
)
```

{{% /tab %}}
{{< /tabs >}}

![](/navigate-remote.gif)

## Tipos de navegação

Nas páginas a seguir, você confere mais detalhes de cada tipo de navegação do Beagle:

[**OpenNativeRoute**](/pt/home/api/actions/navigate/opennativeroute)

[**OpenExternalURL**](/pt/home/api/actions/navigate/openexternalurl)

[**PushStack**](/pt/home/api/actions/navigate/pushstack)

[**PushView**](/pt/home/api/actions/navigate/pushview)

[**PopStack**](/pt/home/api/actions/navigate/popstack)

[**PopView**](/pt/home/api/actions/navigate/popview)

[**PopToView**](/pt/home/api/actions/navigate/poptoview)

[**ResetApplication**](/pt/home/api/actions/navigate/resetapplication)

[**ResetStack**](/pt/home/api/actions/navigate/resetstack)