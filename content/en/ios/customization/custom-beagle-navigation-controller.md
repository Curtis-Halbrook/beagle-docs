---
title: Custom Beagle Navigation Controller
weight: 145
description: >-
  You will find how to use Beagle Navigation Controller to handle the
  server-driven screen state.
---

---

## Introduction

Beagle Navigation Controller is a class like the `UINavigationController`, but more focused on handle the server-driven screen state when it starts or finishes.

The method `serverDrivenStateDidChange()` is the entry point to handle screen state changes.

The default implementation shows a `UIActivityIndicatorView` when the screen is loading. It also shows a default error screen with errors treatment and a retry button.

When overriding, if you want to preserve a loading and error behavior, a `super` implementation should be called to represent the superclass `BeagleNavigationController` or you can customize a loading and handle the error behavior by yourself.

Both implementations can be seen in the examples below.

## Parameters

- **State:** New state that tells if screen is loading or any error happened
- **ScreenController:** Controller that triggered the state change

Check out below the Beagle Navigation Controller class:

```swift
open class BeagleNavigationController: UINavigationController {

    private var errorView = BeagleErrorView(message: nil) { }

    open func serverDrivenStateDidChange(
        to state: ServerDrivenState,
        at screenController: BeagleController
    ) {
        switch state {
        case .started:
            view.showLoading(.whiteLarge)
        case .finished:
            view.hideLoading()
        case .error(let serverDrivenError, let retry):
            let message = getServerDrivenErrorMessage(from: serverDrivenError)
            guard let retry = retry else { return }
            if !view.subviews.contains(errorView) {
                errorView = BeagleErrorView(message: message, retry: retry)
                errorView.present(in: view)
            } else {
                errorView.addRetry(retry)
            }
        case .success:
            break
        }
    }

}

```

The ServerDrivenState is an enum that typifies the screen state. See its structure below:

```swift
public typealias BeagleRetry = () -> Void

public enum ServerDrivenState {
    case started
    case finished
    case success
    case error(ServerDrivenState.Error, BeagleRetry)
}

extension ServerDrivenState {
    public enum Error: Swift.Error {
        case remoteScreen(Request.Error)
        case action(Swift.Error)
        case lazyLoad(Request.Error)
        case submitForm(Request.Error)
        case webView(Swift.Error)
        case declarativeText
    }
}
```

## Examples

## **Using default error and loading implementation**

When preserving loading and error behavior, a `super` implementation with the method `serverDrivenStateDidChange` should be called to represent the superclass **BeagleNavigationController**.

```swift
class CustomBeagleNavigationController: BeagleNavigationController {
    
    override func serverDrivenStateDidChange(
        to state: ServerDrivenState,
        at screenController: BeagleController
    ) {
        super.serverDrivenStateDidChange(to: state, at: screenController)
    }
}
```

## **Overriding error state**

### **Step 1: Create a class inherited from BeagleNavigationController**

You will see below an example of a class inherited from `BeagleNavigationController`. The `serverDrivenStateDidChange` method is overridden in it and handles the error state differently.

```swift

class CustomBeagleNavigationController: BeagleNavigationController {

    private var errorView = ErrorView(message: nil) { }

    override func serverDrivenStateDidChange(
        to state: ServerDrivenState,
        at screenController: BeagleController
    ) {
        guard case let .error(serverDrivenError, retry) = state else { return }
        let message: String
        switch serverDrivenError {
        case .remoteScreen(let error), .lazyLoad(let error), .submitForm(let error):
            switch error {
            case .networkError(let messageError):
                message = messageError.localizedDescription
            case .decoding(let messageError):
                message = messageError.localizedDescription
            case .loadFromTextError, .urlBuilderError:
                message = error.localizedDescription
            }

        case .action(let error):
            message = error.localizedDescription

        default:
            message = "Unknow Error."
        }

        if !view.subviews.contains(errorView) {
            errorView = ErrorView(message: message, retry: retry)
            errorView.present(in: view)
        } else {
            errorView.addRetry(retry)
        }
    }
}

```

### **Step 2: Register Custom Navigation Controller**

```swift
let dependencies = BeagleDependencies()
dependencies.navigator.registerNavigationController(
    builder: CustomBeagleNavigationController.init,
    forId: "CustomBeagleNavigation"
)
BeagleConfigurator.setup(dependencies: dependencies)
```

{{% alert color="info" %}}
You can register as many **BeagleNavigationController** as you need.
{{% /alert %}}

### **Step 3: Use BeagleScreenViewController with controllerId**

Now, when you are instantiating the BeagleScreenViewController, you can pass the `controllerId` "CustomBeagleNavigation" so that your BeagleScreenViewController uses your `CustomBeagleNavigationController`.

```swift
func screenController() -> UIViewController {
    let screen = Screen(
        child: Text()
    )

    return BeagleScreenViewController(
        .declarative(screen),
        controllerId: "CustomBeagleNavigation"
    )
}
```
