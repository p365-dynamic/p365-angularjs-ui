/*
 * Description	: Privacy Policy Page Controller.
 * Author		: Shubham Jain
 * Date			: 5 November 2016
 *
 * */

'use strict';
angular.module('privacy', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages']) 
.controller('privacyPolicyController', ['$scope', '$window', '$rootScope', '$location','$http', 'RestAPI', 'localStorageService', function ($scope, $window, $rootScope, $location, $http, RestAPI, localStorageService){

	// Setting application labels to avoid static assignment
	var applicationLabels  = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	$window.scrollTo(0, 0);
}]);