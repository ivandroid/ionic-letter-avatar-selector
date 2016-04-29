/*!
 * Copyright 2016 Ivan Weber
 *
 * ionic-letter-avatar-selector, v1.0.2
 *
 * By @_ivandroid_
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

/* global ionic */

(function (angular) {
    
    angular.module("ionicLetterAvatarSelector.constants", [])
        .constant("IONIC_LETTER_AVATAR_SELECTOR_ICONS", {
            "delete": ionic.Platform.isAndroid() ? "ion-android-delete" : "ion-ios-trash",
            "finish": ionic.Platform.isAndroid() ? "ion-android-arrow-back" : "ion-ios-checkmark-empty"
        })
        .constant("IONIC_LETTER_AVATAR_SELECTOR_THEMES", {
            light: "#fff",
            stable: "#f8f8f8",
            positive: "#387ef5",
            calm: "#11c1f3",
            balanced: "#33cd5f",
            energized: "#ffc900",
            assertive: "#ef473a",
            royal: "#886aea",
            dark: "#444"
        });
        
    angular.module("ionicLetterAvatarSelector.values", [])
        .value("ionicLetterAvatarSelectorHeader", undefined);

    angular.module("ionicLetterAvatarSelector.decorators", [])
        .decorator("ionItemDirective", [
            "$delegate", 
            "$document",
            "$ionicGesture",
            "$ionicHistory", 
            "$ionicNavBarDelegate", 
            "$ionicLetterAvatarSelector", 
            "$ionicLetterAvatarSelectorConfig" , 
            "ionicLetterAvatarSelectorHeader",
            "IONIC_LETTER_AVATAR_SELECTOR_THEMES", function(
            $delegate, 
            $document,
            $ionicGesture,
            $ionicHistory,
            $ionicNavBarDelegate, 
            $ionicLetterAvatarSelector, 
            $ionicLetterAvatarSelectorConfig, 
            ionicLetterAvatarSelectorHeader,
            IONIC_LETTER_AVATAR_SELECTOR_THEMES) {
                
            var directive = $delegate[0];
            directive.compile = function($element, $attrs) {
                var isAnchor = angular.isDefined($attrs.href) || angular.isDefined($attrs.ngHref) || angular.isDefined($attrs.uiSref);
                var innerElement = angular.element(isAnchor ? "<a></a>" : "<div></div>");
                innerElement.addClass("item-content");
                if (angular.isDefined($attrs.href) || angular.isDefined($attrs.ngHref)) {
                    innerElement.attr("ng-href", "{{$href()}}");
                    if (angular.isDefined($attrs.target)) {
                        innerElement.attr("target", "{{$target()}}");
                    }
                }
                innerElement.append($element.contents());
                $element.addClass("item item-complex").append(innerElement);
                var usePlugin = angular.isDefined($attrs.lettersOf);
                if (usePlugin) {
                    $element.addClass("item-avatar-left");
                    $element.addClass("item-icon-right");
                    innerElement.prepend('<img id="img" ng-src="{{src}}" class="ionic-letter-avatar-selector-animate-img" ng-click="select($event)"/>');
                    if (angular.isUndefined($attrs.hideAccessoryIcon) && !$ionicLetterAvatarSelectorConfig.isAndroid) {
                        innerElement.append('<i class="icon ion-chevron-right icon-accessory"></i>');
                    }
                };

                return function($scope, $element, $attrs) {
                    $scope.$href = function () {
                        return $attrs.href || $attrs.ngHref;
                    };
                    
                    $scope.$target = function () { 
                        return $attrs.target;
                    };
                    
                    var content = $element[0].querySelector(".item-content");
                    if (content) {
                        $scope.$on("$collectionRepeatLeave", function () {
                            if (content && content.$$ionicOptionsOpen) {
                                content.style[ionic.CSS.TRANSFORM] = "";
                                content.style[ionic.CSS.TRANSITION] = "none";
                                $$rAF(function () {
                                    content.style[ionic.CSS.TRANSITION] = "";
                                });
                                content.$$ionicOptionsOpen = false;
                            }
                        });
                    }

                    if (usePlugin) {
                        var selectionEnabled = ($ionicLetterAvatarSelectorConfig.isIos || $ionicLetterAvatarSelectorConfig.isAndroid) && angular.isDefined($attrs.item);
                        var gesture = $ionicGesture.on("hold", onHold, $element);
                        var imgDefault = svg(false, $attrs.lettersOf, $attrs.letters, $attrs.background, $attrs.color);
                        var imgChecked = selectionEnabled ? svg(true) : null;
                        var selected, title;
                        
                        var $headers = $document[0].body.querySelectorAll(".bar-header");
                        var $img = angular.element($element[0].querySelector("#img"));
                        var $title = angular.element($document[0].body.querySelectorAll(".title"));
                        
                        renderBorder();
                        
                        if (!ionicLetterAvatarSelectorHeader) {
                            ionicLetterAvatarSelectorHeader = {
                                background: $headers[0].style.background,
                                border: $headers[0].style.border
                            };
                        }
                        
                        if (!$ionicLetterAvatarSelector.active()) {
                            title = $ionicHistory.currentTitle();
                        }
                        
                        function generateColor() {
                            var letters = "0123456789ABCDEF".split("");
                            var _color = "#";
                            for (var i = 0; i < 6; i++) {
                                    _color += letters[Math.floor(Math.random() * 16)];
                            }
                            return _color;
                        }
                        
                        function onHold($event) {
                            $scope.$apply(function() {
                                $scope.select($event);
                            });
                        }
                        
                        function renderBorder(border) {
                            if (!border) {
                                border = $attrs.border || $ionicLetterAvatarSelectorConfig.border;
                            }
                            $img.css("border", border);
                        }
                        
                        function renderHeader(background, border) {
                            for (var i in $headers) {
                                var header = $headers[i];
                                if (header.style) {
                                    header.style.background = background;
                                    header.style.border = border;
                                }
                            }
                        }

                        function renderFinished() {
                            if (selected) {
                                renderUnselected();
                            }
                            $ionicNavBarDelegate.title(title);
                            renderHeader(ionicLetterAvatarSelectorHeader.background, ionicLetterAvatarSelectorHeader.border);
                            if ($ionicLetterAvatarSelectorConfig.isAndroid) {
                                $title.css("margin-left", "10px");
                            }
                        }
                        
                        function renderSelected() {
                            $element.addClass("active");
                            $img.addClass("ng-hide-add");
                            $scope.src = imgChecked;
                            renderBorder("none");
                        }
                        
                        function renderStarted() {
                            renderHeader($ionicLetterAvatarSelectorConfig.selectionColor, "none");
                            if ($ionicLetterAvatarSelectorConfig.isAndroid) {
                                $title.css("margin-left", "30px");
                            }
                        }
                        
                        function renderUnselected() {
                            $element.removeClass("active");
                            $img.removeClass("ng-hide-add");
                            $scope.src = imgDefault;
                            selected = false;
                            renderBorder();
                        }

                        function select($event) {
                            if (selectionEnabled) {
                                $event.preventDefault();
                                $event.stopPropagation();
                                
                                selected = $ionicLetterAvatarSelector.select($attrs.item);
                                if (selected) {
                                    renderSelected();
                                } else {
                                    renderUnselected();
                                }
                                if ($ionicLetterAvatarSelector.active()) {
                                    $ionicNavBarDelegate.title($ionicLetterAvatarSelector.count());
                                }
                            }
                        }
                        
                        function svg(selected, text, letters, background, color) {
                            var avatar;
                            if (selected) {
                                avatar = "\u2713";
                                background = $ionicLetterAvatarSelectorConfig.selectionColor;
                                if (!letters) {
                                    letters = 1;
                                }
                            } else {
                                if (!letters) {
                                    letters = $ionicLetterAvatarSelectorConfig.letters;
                                }
                                if (!letters) {
                                    var parts = text.split(" ");
                                    letters = parts.length;
                                    if (letters > 2) {
                                        letters = 2;
                                    }
                                    avatar = "";
                                    for (var i = 0; i < parts.length; i++) {
                                        var part = parts[i];
                                        if (part.match(/\w/g) && avatar.length < 2) {
                                            avatar += part.substr(0, 1).toUpperCase();
                                        }
                                    }
                                } else {
                                    avatar = text.substr(0, letters).toUpperCase();
                                }
                                  
                                if (background === "random") {
                                    background = generateColor();
                                } else 
                                if (!background) {
                                    background = $ionicLetterAvatarSelectorConfig.background;
                                }
                                if (IONIC_LETTER_AVATAR_SELECTOR_THEMES[background]) {
                                    background = IONIC_LETTER_AVATAR_SELECTOR_THEMES[background];
                                }
                            }
                            if (!color) {
                                color = $ionicLetterAvatarSelectorConfig.color;
                            }
                            if (IONIC_LETTER_AVATAR_SELECTOR_THEMES[color]) {
                                color = IONIC_LETTER_AVATAR_SELECTOR_THEMES[color];
                            }
                            var defaultFontSize = 30;
                            var charObject = angular.element('<text></text>').attr({
                                "text-anchor": "middle",
                                "y": "50%",
                                "x": "50%",
                                "dy": "0.35em",
                                "pointer-events": "auto",
                                "fill": color,
                                "font-family": "HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif"
                            }).html(avatar).css({
                                "font-weight": 400,
                                "font-size": defaultFontSize - (letters - 1) * 5 + "px"
                            });
                            var svg = angular.element("<svg></svg>").attr({
                                "xmlns": "http://www.w3.org/2000/svg",
                                "pointer-events": "none",
                                "width": 50,
                                "height": 50
                            }).css({
                                "width": "50px",
                                "height": "50px",
                                "background": background
                            });
                            svg.append(charObject);
                            var lvcomponent = angular.element("<div>").append(svg.clone()).html();
                            return "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(lvcomponent)));
                        };
                        
                        $scope.src = imgDefault;
                        $scope.select = select;
                        $scope.$on($ionicLetterAvatarSelector.finished, renderFinished);
                        $scope.$on($ionicLetterAvatarSelector.started, renderStarted);
                        $scope.$on('$destroy', function() {
                            $ionicGesture.off(gesture, "hold", onHold);
                        });
                        $scope.$on("$stateChangeStart", $ionicLetterAvatarSelector.finish);
                    }
                };
            };
            return $delegate;
        }]);

    angular.module("ionicLetterAvatarSelector.providers", [])
        .provider("$ionicLetterAvatarSelectorConfig", function() {
            var background = "#387ef5";
            var color = "light";
            var border = "none";
            var letters;
            var selectionAndroid = ionic.Platform.isAndroid();
            var selectionColor = "#A8A8A8";
            var selectionIos = false;
            return {
                setBackground: function(_background) {
                    background = _background;
                },
                setBorder: function(_border) {
                    border = _border;
                },
                setColor: function(_color) {
                    color = _color;
                },
                setLetters: function(_letters) {
                    letters = _letters;
                },
                setSelectionAndroid: function(_selectionAndroid) {
                    selectionAndroid = _selectionAndroid;
                },
                setSelectionColor: function(_selectionColor) {
                    selectionColor = _selectionColor;
                },
                setSelectionIos: function(_selectionIos) {
                    selectionIos = _selectionIos;
                },
                $get: function() {
                    return {
                        background: background,
                        border: border,
                        color: color,
                        isAndroid: selectionAndroid,
                        isIos: selectionIos,
                        letters: letters,
                        selectionColor: selectionColor
                    };
                }
            };
        });
        
    angular.module("ionicLetterAvatarSelector.directives", [])
        .directive("ilasButtonDelete", [
            "$ionicLetterAvatarSelector",
            "$ionicLetterAvatarSelectorConfig",
            "IONIC_LETTER_AVATAR_SELECTOR_ICONS", function(
            $ionicLetterAvatarSelector,
            $ionicLetterAvatarSelectorConfig,
            IONIC_LETTER_AVATAR_SELECTOR_ICONS) {
            return {
                restrict: "E",
                replace: true,
                template: '<button class="button button-icon {{icon}}"' +
                            'ng-class="{\'ionic-letter-avatar-selector-icon-smaller\': isAndroid}"' + 
                            'ng-show="selectionActive"' +
                          '</button>',
                link: function($scope) {
                    $scope.isAndroid = $ionicLetterAvatarSelectorConfig.isAndroid;
                    $scope.icon = IONIC_LETTER_AVATAR_SELECTOR_ICONS.delete;
                    
                    $scope.$on($ionicLetterAvatarSelector.started, function() {
                        $scope.selectionActive = true;
                    });
                    $scope.$on($ionicLetterAvatarSelector.finished, function() {
                        $scope.selectionActive = false;
                    });
                }
            };
        }])
        .directive("ilasButtonFinish", [
            "$ionicLetterAvatarSelector",
            "$ionicLetterAvatarSelectorConfig",
            "IONIC_LETTER_AVATAR_SELECTOR_ICONS", function(
            $ionicLetterAvatarSelector, 
            $ionicLetterAvatarSelectorConfig,
            IONIC_LETTER_AVATAR_SELECTOR_ICONS) {
            return {
                restrict: "E",
                replace: true,
                template: '<button class="button button-icon {{icon}}"' +
                            'ng-class="{\'ionic-letter-avatar-selector-icon-smaller\': isAndroid}"' + 
                            'ng-show="selectionActive"' + 
                            'ng-click="finish()">' +
                          '</button>',
                link: function($scope) {
                    $scope.finish = $ionicLetterAvatarSelector.finish;
                    $scope.isAndroid = $ionicLetterAvatarSelectorConfig.isAndroid;
                    $scope.icon = IONIC_LETTER_AVATAR_SELECTOR_ICONS.finish;
                    
                    $scope.$on($ionicLetterAvatarSelector.started, function() {
                        $scope.selectionActive = true;
                    });
                    $scope.$on($ionicLetterAvatarSelector.finished, function() {
                        $scope.selectionActive = false;
                    });
                }
            };
        }]);

    angular.module("ionicLetterAvatarSelector.services", [])
        .factory("$ionicLetterAvatarSelector", [
            "$rootScope", function(
            $rootScope) {
            var self = this;
            var data = [];
            var started = false;
            
            self.started = "ionicLetterAvatarSelector.started";
            self.finished = "ionicLetterAvatarSelector.finished";
            self.stateChanged = "ionicLetterAvatarSelector.stateChanged";
            
            self.active = function() {
                return data.length > 0;
            };
            
            self.finish = function() {
                if (data.length > 0) {
                    data = [];
                }
                $rootScope.$broadcast(self.finished);
                $rootScope.$broadcast(self.stateChanged, false);
            };            
            
            self.count = function() {
                return data.length;
            };
            
            self.getData = function() {
                data.forEach(function(value, index) {
                    data[index] = JSON.parse(value, function(key, value) {
                        if (angular.isString(value) && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/.exec(value)) {
                            return new Date(value);
                        }
                        return value;
                    });
                });
                return data;
            };
            
            self.select = function(item) {
                var lengthBefore = data.length;
                var index = data.indexOf(item);
                if (index === -1) {
                    data.push(item);
                } else {
                    data.splice(index, 1);
                }
                var lengthAfter = data.length;
                started = lengthBefore === 0 && lengthAfter === 1;
                if (started) {
                    $rootScope.$broadcast(self.started);
                    $rootScope.$broadcast(self.stateChanged, true);
                }
                if (!self.active()) {
                    $rootScope.$broadcast(self.finished);
                    $rootScope.$broadcast(self.stateChanged, false);
                }
                return data.indexOf(item) !== -1;
            };

            return self;
        }]);

    // App
    angular.module("ionicLetterAvatarSelector", [
        "ionicLetterAvatarSelector.constants",
        "ionicLetterAvatarSelector.decorators",
        "ionicLetterAvatarSelector.directives",
        "ionicLetterAvatarSelector.providers",
        "ionicLetterAvatarSelector.services",
        "ionicLetterAvatarSelector.values"
    ]);
})(angular);