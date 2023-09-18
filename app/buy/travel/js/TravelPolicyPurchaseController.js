/*This controller is responsible to show data on purchase statement*/
'use strict';
angular.module('travelPolicyPurchase', ['LocalStorageModule']) 
.controller('travelPolicyPurchaseController', ['$scope', 'localStorageService', function ($scope, localStorageService){
	$scope.policyDocument = localStorageService.get("policyDocDetails");
	$scope.businessLineId = localStorageService.get("selectedBusinessLineId");
	
	if($scope.businessLineId == 1){
		$scope.lineOfBusiness = "Life";	
	}else if($scope.businessLineId == 2){
		$scope.lineOfBusiness = "Bike";
	}else if($scope.businessLineId == 3){
		$scope.lineOfBusiness = "Car";
	}else if($scope.businessLineId == 5){
		$scope.lineOfBusiness = "Travel";
	}else{
		$scope.lineOfBusiness = "Health";
	}
}]);