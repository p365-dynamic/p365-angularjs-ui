'use strict';
angular.module('landingPage', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages']) 
.controller('landingPageController', ['$scope', '$window', '$rootScope', '$location','$http', 'RestAPI', 'localStorageService', function ($scope, $window, $rootScope, $location, $http, RestAPI, localStorageService){

	// Setting application labels to avoid static assignment
	//var applicationLabels  = localStorageService.get("applicationLabels");
	//$scope.globalLabel = applicationLabels.globalLabels;
	$window.scrollTo(0, 0);
	
	$scope.controller = "hello Rakesh!!";
	

    $scope.routeToBikeQuote = () => {
        $location.path("/bike/#/PBQuote");
    }

    $scope.routeToCarQuote = () => {
        $location.path("/car/#/PBQuote");
    }


}]);