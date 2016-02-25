/* global expect */

"use strict";

describe("modules", function() {
    var module;
    var dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {
        // Get module
        module = angular.module("ionicLetterAvatarSelector");
        dependencies = module.requires;
    });
        
    // Loading modules
    it("should load constants module", function() {
        expect(hasModule("ionicLetterAvatarSelector.constants")).toBeTruthy();
    });
    
    it("should load decorators module", function() {
        expect(hasModule("ionicLetterAvatarSelector.decorators")).toBeTruthy();
    });
    
    it("should load directives module", function() {
        expect(hasModule("ionicLetterAvatarSelector.directives")).toBeTruthy();
    });
    
    it("should load providers module", function() {
        expect(hasModule("ionicLetterAvatarSelector.providers")).toBeTruthy();
    });
    
    it("should load services module", function() {
        expect(hasModule("ionicLetterAvatarSelector.services")).toBeTruthy();
    });
    
    it("should load config values", function() {
        expect(hasModule("ionicLetterAvatarSelector.values")).toBeTruthy();
    });
});