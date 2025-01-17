---
title: Serializador & Deserializador
weight: 123
description: >-
  Nesta seção, você encontra a descrição de como criar um
  Serializador/Deserializador customizado usando o Beagle e detalhes dos métodos que ele
  implementa.
---

# Serializador/Deserializador customizado

## Introdução

O **Beagle** oferece um **`serializador/deserializador`** customizado por meio da **Interface** `BeagleTypeAdapter.` Com esse **`Adapter`** é possível mapear uma classe qualquer, inclusive as que representam **tipos concretos**, como um **Integer**. 

Veja abaixo o contrato definido da interface:

```kotlin
interface BeagleTypeAdapter<T> {
    fun fromJson(json: String) : T
    fun toJson(type: T) : String
}
```

## Exemplo

Neste exemplo um `adapter` foi criado para a interface `Person` que é extendida a partir da **`data class`** `PersonImpl` e que possui somente um **atributo** `name` do tipo `String`. 

Para criar um **`adapter`** você deve:

1. Criar uma classe que será o seu `adapter` e anotá-la com `@RegisterBeagleAdapter.`Neste exemplo o nome dado foi **`PersonAdapter`**;

2. Declarar qual classe se quer mapear com esse adapter. Aqui mapeamos a interface **`Person`** que representa a `data class PersomImpl`;

3. Estender a classe `adapter` \(**`PersonAdapter`**\) a partir da **Interface** `BeagleTypeAdapter` informando a classe que você quer mapear;
4. Ao estender a interface você deverá implementar os métodos `fromJson` e `toJson`, como no exemplo abaixo:

```kotlin
interface Person

data class PersonImpl(val name: String) : Person

@RegisterBeagleAdapter
class PersonAdapter : BeagleTypeAdapter<Person> {

    override fun fromJson(json: String): Person {
        val rootObject = JSONObject(json)
        return PersonImpl(rootObject.getString(KEY))
    }

    override fun toJson(type: Person): String {
        type as PersonImpl
        val rootObject = JSONObject()
        rootObject.put(KEY, type.name)
        return rootObject.toString()
    }
}
```


## BeagleJsonSerializationFactory
Você pode chamar a BeagleJsonSerializationFactory para delegar a responsabilidade de serializar/deserializar componentes customizados do beagle.

Exemplo:
```kotlin
private const val KEY_NAME = "name"
interface Person {
    val name: Text // This attribute should be serialized/deserialized by the Beagle platform
}
data class PersonImpl(override val name: Text) : Person

@RegisterBeagleAdapter
class PersonAdapter(private val serializer: BeagleJsonSerializer = BeagleJsonSerializerFactory.serializer) :
    BeagleTypeAdapter<Person> {

    override fun fromJson(json: String): Person {
        val rootObject = JSONObject(json)
        val nameJsonObject = rootObject.getJSONObject(KEY_NAME)
        val text = serializer.deserializeComponent(nameJsonObject.toString())
        return PersonImpl(name = text as Text)
    }

    override fun toJson(type: Person): String {
        val rootObject = JSONObject()
        rootObject.put(KEY_NAME, serializer.serializeComponent(type.name))
        return rootObject.toString()
    }

}

@RegisterWidget
data class TextWithPersonName(
    val person: Person,
) : WidgetView() {
    override fun buildView(rootView: RootView): TextView = TextView(rootView.getContext()).also {
        it.setTextColor(Color.BLACK)
        observeBindChanges(rootView, it, person.name.text) { personName ->
            it.text = personName
        }
    }
}
```

### Método fromJson

Esse método recebe um JSONObject como string e retorna uma instância da classe mapeada \(Person\).

### Método toJson

Esse método recebe o tipo de dado mapeado \(Person\) e retorna um JSONObject como uma string.
