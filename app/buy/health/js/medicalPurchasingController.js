'use strict'
angular.module('medicalPurchasing', ['LocalStorageModule']) 
.controller('medicalPurchasingController', ['$scope','localStorageService', function ($scope,localStorageService){
	$scope.policyDocument = localStorageService.get("policyDocDetails");
}]);