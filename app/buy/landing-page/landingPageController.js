"use strict";
angular.module("landingPageModule", ["LocalStorageModule"]).controller(
  "landingPageController",
  [
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
      console.log("landing page controller works");

      $rootScope.routeTo = function (category) {
        console.log("routeto rn");
        if (!category) return;
        $location.path(category + "/#/PBQuote");
      };

      const url = document.referrer.split("/");
      const category = url[url.length - 2];
      console.log("cat ", document.referrer);
      $rootScope.routeTo(category);
    },
  ]

  // below function invokes when opened inside wordpress, has no meaning otherwise
  //   function () {
  //     const optionSelected = url.split("/");
  //     console.log(optionSelected);
  //     const len = optionSelected.length;
  //     switch (optionSelected[len - 2]) {
  //       case "bike":
  //         routeToBikeQuote();
  //         break;

  //       case "car":
  //         routeToCarQuote();
  //         break;

  //       case "life":
  //         routeToLifeQuote();
  //         break;

  //       case "health":
  //         routeToHealthQuote();
  //     }
  //   ]}
);
