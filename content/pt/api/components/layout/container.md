---
title: Container
weight: 338
description: Descrição do componente Container e seus atributos
---

---

## O que é?

O `Container` é um componente responsável por conter outros componentes dentro de si.

A sua estrutura é representada como mostrado abaixo:

| **Atributo** | **Tipo**                                                       | Obrigatório | **Definição**                                                                                                     |
| :----------- | :------------------------------------------------------------- | :---------: | :---------------------------------------------------------------------------------------------------------------- |
| children     | List &lt;[ServerDriven Component]({{< ref path="/api/components" lang="pt" >}})&gt; |      ✓      | Define a lista de componentes que fazem parte do container                                                        |
| context      | [ContextData]({{< ref path="/api/context/" lang="pt" >}})                           |             | É o [contexto]({{< ref path="/api/context/" lang="pt" >}}) contido por este Widget.                                                    |
| onInit       | List&lt;[Action]({{< ref path="/api/actions" lang="pt" >}})&gt;                     |             | Um parâmetro que te possibilita definir uma lista de ações a serem executadas assim que esse Widget seja exibido. |

## Como usar?

{{< tabs id="T145" >}}
{{% tab name="JSON" %}}

<!-- json-playground:container.json
{
    "_beagleComponent_": "beagle:container",
    "children": [
        {
          "_beagleComponent_": "beagle:text",
          "text": "@{myContext}"
        }
    ],
    "context": {
        "id": "myContext",
        "value": "Hello world!"
    }
}
-->

{{% playground file="container.json" language="pt" %}}
{{% /tab %}}

{{% tab name="Kotlin DSL" %}}

```kotlin
Container(
    children = listOf(
        Text(text = "@{myContext}")
    ),
    context = ContextData(
        id = "myContext",
        value = "Hello World!"
    )
)
```

{{% /tab %}}
{{< /tabs >}}