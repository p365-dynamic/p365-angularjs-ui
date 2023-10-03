"use strict";
angular
  .module("landingPage", [
    "CoreComponentApp",
    "LocalStorageModule",
    "ngMessages",
  ])
  .controller("landingPageController", [
    "$scope",
    "$window",
    "$rootScope",
    "$location",
    "$http",
    "RestAPI",
    "localStorageService",
    function (
      $scope,
      $window,
      $rootScope,
      $location,
      $http,
      RestAPI,
      localStorageService
    ) {
      $window.scrollTo(0, 0);
      const url = document.referrer;
      $scope.routeToBikeQuote = function () {
        $location.path("/bike/#/PBQuote");
      }

      $scope.routeToCarQuote = function () {
        $location.path("/car/#/PBQuote");
      }

      $scope.routeToLifeQuote = function() {
        $location.path("/life/#/PBQuote");
      }

      $scope.routeToHealthQuote = function() {
        $location.path("/health/#/PBQuote");
      }

      // below function invokes when opened inside wordpress, has no meaning otherwise
      (function() {
        const optionSelected = url.split("/");
        console.log(optionSelected);
        const len = optionSelected.length;
        switch (optionSelected[len - 2]) {
          case "bike":
            routeToBikeQuote();
            break;
  
          case "car":
            routeToCarQuote();
            break;
  
          case "life":
            routeToLifeQuote();
            break;
  
          case "health":
            routeToHealthQuote();
        }
      })
    },
  ]);