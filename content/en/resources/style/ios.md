---
title: IOS
weight: 204
description: 'Here, you''ll find how to make components'' stylization on iOS'' projects.'
---

---

## Introdução 

Inside Beagle's library for iOS, there's an `AppTheme` class that allows you to personalize components used on your application. 

This class also can map application's styles so it can be referenced on BFF to build a [**Server-Driven**]({{< ref path="/key-concepts#server-driven-ui" lang="en" >}}) screen.

It makes possible to personalize, for example: 

* Texts' styles;
* Button's styles;
* TabView. 

It's importante to make it clear that iOS doesn't map all the components' attributes. However, the most important ones are already mapped, so they can be modified if necessary.

## Customized attributes  

Not all customization's attributes can be stylized. On the list below you will know which one can be personalized through Beagle.

Another important point is that styles created on iOS and related to componentes that came from backend. On these cases, you can configure the styles so each of them can be referenced, just like the example below:


```swift
    let theme = AppTheme(styles: [
    
    Styles.customButton.key    : Styles.customButton.style,
    Styles.customText.key      : Styles.customText.style,
    Styles.customTab.key      : Styles.customTab.style
    ])

    dependencies.theme = theme
```


Besides reference styles, you have to create a key value pair defining a name to each style created:


```swift
struct StylePair {
    var key: String
    var style: Any
}
class Styles {
    static let customText = StylePair(key: "CustomText", style: customText)
    static let customButton = StylePair(key: "CustomButton", style: customButton)
    static let customTab = StylePair(key: "CustomTab", style: customTab)
    
}
```


### Text

The text components for Beagle iOS are **totally customizable.** To make any attribute change, follow the example below: 


```swift
private static func textH1() -> (UITextView?) -> Void {
    BeagleStyle.text(font: .boldSystemFont(ofSize: 32), 
    color: UIColor(named: "ColorText")!)
}
```


### Button

Besides the complete text personalization, the Button component can be customized by another attribute: the **withTitleColor**, which personalizes the button's color.

On Swift, you can also add extra styles to a component by using the `<>` note, according to the example below: 


```swift
static func defaultStylishButton() -> (UIButton?) -> Void {
    return BeagleStyle.button(withTitleColor: .white)
        <> {
            $0?.titleLabel |> BeagleStyle.label(withFont: .systemFont(ofSize: 16, weight: .regular))
            $0?.layer.cornerRadius = 6
            $0?.clipsToBounds = true
            $0?.backgroundColor = UIColor(hex: "#3C3737")
        }
}
```


### TabView

Beagle's TabView component for iOS can be stylized with these attributes:

1. **backGroundColor**: attributes a different color to a selected tab background.
2. **indicatorColor**: attributes a color to a selected background.


```swift
static func customTab() -> (UITabBar) -> Void {
        return BeagleStyle
                .tabView(backgroundColor: .blue, 
                        indicatorColor: .white)
    }
```