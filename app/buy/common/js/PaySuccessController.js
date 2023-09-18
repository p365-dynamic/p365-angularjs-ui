/*
 * Description	: This file contains methods for successful payment for product.
 * Author		: Yogesh Shisode
 * Date			: 13 May 2016
 *
 * */
'use strict';
angular.module('paySuccess', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
.controller('paySuccessController', ['RestAPI', '$scope', '$rootScope', '$location','$http', 'localStorageService', '$timeout', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout){
	loadDatbase(function(){
		var selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
		if(selectedBusinessLineId == 1){
			$location.path('/paysuccesslife');
			$scope.$apply();
		}
		else if(selectedBusinessLineId == 2){
			$location.path('/paysuccessbike');
			$scope.$apply();
		}
		else if(selectedBusinessLineId == 3){
			$location.path('/paysuccesscar');
			$scope.$apply();
		}
		else if(selectedBusinessLineId == 4){
			$location.path('/paysuccesshealth');
			$scope.$apply();
		}else if(selectedBusinessLineId == 8){
			$location.path('/paysuccesspersonalaccident');
			$scope.$apply();
		}else{
			$location.path('/paysuccesstravel');
			$scope.$apply();
		}
	});
}]);