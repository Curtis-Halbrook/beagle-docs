---
title: ImageDownloader
weight: 151
description: >-
  Nesta seção, você encontra a descrição do protocolo ImageDownloader e os detalhes dos métodos que a implementa.
---

---

## **Introdução**

Você pode registrar a forma como imagens remotas serão baixadas e preenchidas nas **UIImageView** fornecendo uma classe que implementa essa lógica, que foi adicionado ao Beagle na versão 1.3.0.

Com o **ImageDownloader** sendo criado no frontend de sua aplicação iOS, o Beagle saberá qual lógica usar para baixar e configurar o componente **Image** do tipo **ImagePath.Remote**.

## **Protocolo ImageDownloaderProtocol**

O protocolo **ImageDownloader** se consiste em apenas método chamado **fetchImage** que será utilizado para fazer a requisição de suas imagens remotas.

```swift

public protocol ImageDownloaderProtocol {
    @discardableResult
    func fetchImage(
        url: String,
        additionalData: HttpAdditionalData?,
        completion: @escaping (Result<Data, Request.Error>) -> Void
    ) -> RequestToken?
}

```

A função fetchImage recebe 3 parâmetros:

- **url**: valor do tipo String por onde será passado a url da imagem
- **additionalData**: valor do tipo HttpAdditionalData, que poderá ser utilizado quando há necessidade de passar headers adicionais para uma requisição.
- **completion**: bloco que deve ser chamado ao final da execução da função passando o resultado da requisição.

Além disso a função pode retornar o **RequestToken** para que a requisição possa ser cancelada internamente pelo Beagle.

## **Implementação Default**

No Beagle iOS, temos uma estrutura chamada **ImageDownloader** que realiza as requisições das imagens de acordo com sua camada de rede.

Em seu método `fetchImage` essa estrutura basicamente chama o `networkClient` e mapeia o resultado daquela requisição, ou seja, ela depende da implementação da sua camada de rede, você pode ver como configurá-la [**aqui**]({{< ref path="/ios/customization/dependencies/network-layer" lang="pt" >}}).

## **Substituindo o ImageDownloader**

Para substituir a classe responsável por realizar as requisições de imagens para o Beagle, siga os passos a seguir:

### **Passo 1: Criar uma implementação para ImageDownloaderProtocol**

Implemente o protocolo `ImageDownloaderProtocol` na classe que deseja utilizar para realizar as requisições, neste caso o `CustomImageDownloader` será usado como exemplo:

```swift

class CustomImageDownloader: ImageDownloaderProtocol {
    func fetchImage(
        url: String,
        additionalData: HttpAdditionalData?,
        completion: @escaping (Result<Data, Request.Error>) -> Void
    ) -> RequestToken? {
        //Implementacao da requisição da imagem
    }
    //Implementacao do ImageDownloader...
}

```

### **Passo 2: Atribuir as dependências**

No AppDelegate ou na classe de configurações do ambiente do Beagle, atribua a instância de `CustomImageDownloader` ao atributo `imageDownloader` presente no BeagleDependencies:

```swift
let dependencies = BeagleDependencies()
let customImageDownloader = CustomImageDownloader()
dependencies.imageDownloader = customImageDownloader
BeagleConfigurator.setup(dependencies: dependencies)
```

Pronto! Agora o Beagle utilizará a sua classe com todas as modificações e definições necessárias para realizar o download de suas imagens remotas.
