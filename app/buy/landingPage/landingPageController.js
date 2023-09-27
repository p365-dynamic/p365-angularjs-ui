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

      function routeToBikeQuote() {
        $location.path("/bike/#/PBQuote");
      }

      function routeToCarQuote() {
        $location.path("/car/#/PBQuote");
      }

      function routeToLifeQuote() {
        $location.path("/life/#/PBQuote");
      }

      function routeToHealthQuote() {
        $location.path("/health/#/PBQuote");
      }

      const optionSelected = url.split("/");
      console.log(optionSelected);
      const len = optionSelected.length;
      console.log(len);
      console.log("selected option = ", optionSelected[len - 2]);
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
    },
  ]);
