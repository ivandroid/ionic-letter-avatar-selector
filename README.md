# <img src="http://fs5.directupload.net/images/160429/yhu3tfae.png" width="30"> ionic-letter-avatar-selector  

* [Introduction](#1-introduction)
* [Usage](#2-usage)
* [Configuration provider](#3-configuration-provider)
* [Services](#4-services)
* [Directives](#5-directives)

##1. Introduction
This plugin provides letter avatars for list items and multiple list item selection similar to the Android gmail app. 
It can be integrated into your ionic 1.x app using the `ion-item` directive. By default the item selection feature is disabled on iOS. 
You can test the plugin via the [ionic view app](http://view.ionic.io/) with the ID **d5a27312**.

###1.1 Features 
* letter avatars for ionic list items based on the `ion-item` directive
* multiple selection and deselection of list items by clicking on a letter avatar or long clicking on a list item
* retrieval of selected items
* two buttons for finishing a selection and deleting selected items

###1.2 Demo
#### [Ionic Playground](http://play.ionic.io/app/ceff331aea68)  
#### ![animation](https://dl.dropbox.com/s/b0zopcqjssu65ko/demo.gif)

###1.3 License

[MIT](https://github.com/ivandroid/ionic-letter-avatar-selector/blob/master/LICENSE)

###1.4 Versions

[CHANGELOG](https://github.com/ivandroid/ionic-letter-avatar-selector/blob/master/CHANGELOG.md)

###1.5 Author
* E-Mail: ivan.weber@gmx.de
* Twitter: https://twitter.com/hybrid_app
* Github: https://github.com/ivandroid
* Ionic Market: https://market.ionic.io/user/6540
* Your support: If you find this project useful and want support its development you can press the button below or star the project. Thanks in advance!

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ivan%2eweber%40gmx%2ede&lc=DE&item_name=GithubRepositories&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHostedGuest)

##2. Usage 
1. Get the files from here or install from bower:

    ```
    bower install ionic-letter-avatar-selector
    ```
    
2. Include the javascript and css files or their minified versions in your `index.html` file.

    ```html
    <link href="style/css/ionic-letter-avatar-selector.min.css" rel="stylesheet">
    <script src="dist/ionic-letter-avatar-selector.min.js"></script>
    ```
    
3. Add the module `ionicLetterAvatarSelector` to your application dependencies:

    ```javascript
    angular.module('starter', ['ionic', 'ionicLetterAvatarSelector'])
    ```
    
4. Add the attribute `letters-of` to the `ion-item` directive for using **only** the letter avatar feature.
For using the item selection feature add the additional attribute `item` and pass an item identifier. 

5. Add the default button directives `ilas-button-finish` and `ilas-button-delete` to your navigation bar.

#### Example *(based on the ionic starter tabs app)*

```html
<ion-view view-title="Chats">
    <ion-nav-buttons side="left">
        <ilas-button-finish></ilas-button-finish>
    </ion-nav-buttons>    
    <ion-nav-buttons side="right">
        <ilas-button-delete ng-click="delete()"></ilas-button-delete>
    </ion-nav-buttons>  
    <ion-content>
        <ion-list>
            <ion-item class="item-remove-animate"
                      letters-of="{{chat.name}}"
                      item="{{chat.id}}"
                      href="#/tab/chats/{{chat.id}}"
                      ng-repeat="chat in chats" >
                <h2>{{chat.name}}</h2>
                <p>{{chat.lastText}}</p>
                <i class="icon ion-chevron-right icon-accessory"></i>
            </ion-item>
        </ion-list>
    </ion-content>
</ion-view>
```

```javascript
angular.module('starter.controllers', [])

// Inject the $ionicLetterAvatarSelector service 
.controller('ChatsCtrl', function($ionicLetterAvatarSelector, $scope, Chats) {
    $scope.delete = function() {
        // Get selected item IDs
        var selectedItems = $ionicLetterAvatarSelector.getData();
        
        //Write your code to delete selected items
        
        // Finish selection
        $ionicLetterAvatarSelector.finish();
    };
});
```

##3. Configuration provider

In the angular configuration phase you can define global settings for this plugin. For that purpose there is a provider named `$ionicLetterAvatarSelectorConfigProvider`.
The following options can be set in the configuration phase:

option|description|type|accepted values|default value
---|---|---|---|---
background|Background color of letter avatars|string|css color names, hex color codes, ionic color names (e.g. *positive*) and *random* for random colors|*positive*
color|Foreground color of letter avatars (text color)|string|css color names, hex color codes and ionic color names|*light*
border|Border of letter avatars|string|css border values|none
finishOnStateChange|Enable / disable finishing selection on angular state change event|boolean|*true, false*|*false*
letterNumber|number of letters to show inside a letter avatar|integer|1-n|the default letter number is detected depending on the word number in a given string
selectionAndroid|Enable / disable selection on Android|boolean|*true, false*|*true*
selectionIos|Enable / disable selection on iOS|boolean|*true, false*|*false*
selectionColor|Color of avatars and navigation bar during selection|string|hex color codes|*#A8A8A8*

#### Example
##### Code

```javascript
angular.module('starter', ['ionic', 'ionicLetterAvatarSelector'])
.config(function($ionicLetterAvatarSelectorConfigProvider) {
    $ionicLetterAvatarSelectorConfigProvider.setBackground('calm');
    $ionicLetterAvatarSelectorConfigProvider.setColor('light');
    $ionicLetterAvatarSelectorConfigProvider.setBorder('1px solid black');    
    $ionicLetterAvatarSelectorConfigProvider.setFinishOnStateChange(true);
    $ionicLetterAvatarSelectorConfigProvider.setLetterNumber(3);
    $ionicLetterAvatarSelectorConfigProvider.setSelectionAndroid(false);
    $ionicLetterAvatarSelectorConfigProvider.setSelectionIos(true);
    $ionicLetterAvatarSelectorConfigProvider.setSelectionColor('#86b0f9');
});
```

##### Result
![screenshot1](http://fs5.directupload.net/images/160223/r766ommj.png)

##4. Services

###4.1 Service `$ionicLetterAvatarSelector`

Using this service you have access to the following events and methods:

event|description|type|return-value
---|---|---|---
`started`|Selection started event|string|none
`finished`|Selection finished event|string|none
`stateChanged`|Selection state event|boolean|*true* if selection is active and *false* if selection is not active

method|description|return-value
---|---|---
`getData()`|Retrieval of selected items|array
`finish()`|Finishing selection|

##5. Directives
###5.1 Extended directive `ion-item`

Add the attribute `letters-of` and `item` to the `ion-item` directive of your list items:

attribute|description
---|---
`letters-of`|String value from which the first letter(s) will be used for building a letter avatar
`item`|Corresponding list item identifier which will be cached during selection. Leave the `item` attribute out, if you don't want to use the item selection feature. 


The attributes `background`, `color`, `border` and `letters` are optional and can be also set globally in the configuration phase:

#### Example
##### Code

```html
<ion-list>
    <ion-item letters-of="{{chat.name}}"
              item="{{chat.id}}"
              background="random"
              border="none"
              color="white"
              letters="1"
              href="#/tab/chats/{{chat.id}}"
              ng-repeat="chat in chats">
        <h2>{{chat.name}}</h2>
        <p>{{chat.lastText}}</p>
        <i class="icon ion-chevron-right icon-accessory"></i>
    </ion-item>
</ion-list>
```
##### Result

![screenshot2](http://fs5.directupload.net/images/160222/z72w4mqz.png)

###5.2 Directive `ilas-button-finish`

You can use this directive to show / hide a button for finishing item selection. The default icons for iOS and Android are `ion-checkmark-empty` and `ion-android-arrow-back`.

#### Example

```html
<ion-nav-bar class="bar-positive">
    <ion-nav-back-button></ion-nav-back-button>
    <ion-nav-buttons side="left">
        <ilas-button-finish></ilas-button-finish>
    </ion-nav-buttons>    
</ion-nav-bar>
```

###5.3 Directive `ilas-button-delete`

This directive shows / hides a button for deleting selected items. The default icons for iOS and Android are `ion-ios-trash` and `ion-android-delete`.
Using `ng-click` attribute you have to invoke your specific delete function considering the following actions: 

2. In your delete function first get selected item identifiers invoking the `getData()` function of the `$ionicLetterAvatarSelector` service.
3. Write your code for deleting selected items. 
4. Finish selection invoking the `finish()` method of the service.

#### Example

```html
<ion-view view-title="Chats">
    <ion-nav-buttons side="right">
        <ilas-button-delete ng-click="delete()"></ilas-button-delete>
    </ion-nav-buttons>  
</ion-view>
```

```javascript
angular.module('starter.controllers', [])
.controller('ChatsCtrl', function($ionicLetterAvatarSelector, $scope, Chats) {
    $scope.delete = function() {
        var chats = Chats.all();
        
        //1. Getting selected items
        var selectedIDs = $ionicLetterAvatarSelector.getData();
        
        //2. Deleting items
        selectedIDs.forEach(function(id) {
            var chat = chats.filter(function(chat) {
                return chat.id === id;
            })[0];
            chats.splice(chats.indexOf(chat), 1);
        });
        
        //3. Finishing selection
        $ionicLetterAvatarSelector.finish();
    };
})
```

Instead of using this directives you can also add your own buttons and show / hide them depending on the selection state.

#### Example
##### Code

```html
<ion-view view-title="Chats">
    <ion-nav-buttons side="left">
        <button class="button button-icon icon ion-checkmark-circled" 
                ng-show="selectionActive" 
                ng-click="finish()">
        </button>
    </ion-nav-buttons>  
    <ion-nav-buttons side="right">
        <button class="button button-icon icon ion-trash-b" 
                ng-show="selectionActive" 
                ng-click="delete()">
        </button>
    </ion-nav-buttons>  
    <ion-content>
        <ion-list>
            <ion-item letters-of="{{chat.name}}"
                      item="{{chat.id}}"
                      href="#/tab/chats/{{chat.id}}"
                      ng-repeat="chat in chats" >
                <h2>{{chat.name}}</h2>
                <p>{{chat.lastText}}</p>
                <i class="icon ion-chevron-right icon-accessory"></i>
            </ion-item>
        </ion-list>
    </ion-content>
</ion-view>
```

```javascript
angular.module('starter.controllers', [])
.controller('ChatsCtrl',function($ionicLetterAvatarSelector, $scope, Chats) {
    $scope.$on($ionicLetterAvatarSelector.stateChanged, function($event, selectionActive) {
        $scope.selectionActive = selectionActive;
    });
    
    $scope.finish = $ionicLetterAvatarSelector.finish;
    
    $scope.delete = function() {
        var chats = Chats.all();
        var selectedIDs = $ionicLetterAvatarSelector.getData();
        selectedIDs.forEach(function(id) {
            var chat = chats.filter(function(chat) {
                return chat.id === id;
            })[0];
            chats.splice(chats.indexOf(chat), 1);
        });
        $scope.finish();
    };
});
```

##### Result

![screenshot3](http://fs5.directupload.net/images/160222/m5heu6xg.png)
