/*
 * Description	: This file contains methods for successful payment for product.
 * Author		: Yogesh Shisode
 * Date			: 13 May 2016
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *  1		13-06-2016		Dropdown list moved to dropdown-list-manager.										  modification-0001		Yogesh S.
 *
 * */
'use strict';
angular.module('payFailure', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
.controller('payFailureController', ['RestAPI', '$scope', '$rootScope', '$location','$http', 'localStorageService', '$timeout', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout){
	loadDatbase(function(){
		var selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
		console.log('selectedBusinessLineId in payfailure controller is:',selectedBusinessLineId);
		if(selectedBusinessLineId == 1){
			$location.path('/payfailurelife');
			$scope.$apply();
		}
		else if(selectedBusinessLineId == 2){
			$location.path('/payfailurebike');
			$scope.$apply();
		}
		else if(selectedBusinessLineId == 3){
			$location.path('/payfailurecar');
			$scope.$apply();
		}
		else if(selectedBusinessLineId == 4){
			$location.path('/payfailurehealth');
			$scope.$apply();
		}
		else if(selectedBusinessLineId == 8){
			$location.path('/payfailurepersonalaccident');
			$scope.$apply();
		}else{
			$location.path('/payfailuretravel');
			$scope.$apply();
		}
	});

}]);