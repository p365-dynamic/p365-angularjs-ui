/*contact Controller*/

'use strict';
angular.module('contact', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages']) 
.controller('contactController', ['$scope', '$window', '$rootScope', '$location','$http', 'RestAPI', 'localStorageService', function ($scope, $window, $rootScope, $location, $http, RestAPI, localStorageService){

	// Setting application labels to avoid static assignment.	-	modification-0003
	/*var applicationLabels  = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;*/

	$window.scrollTo(0, 0);
	$scope.emailSendCfrmStatus = false;
	$scope.inputValidStatus = false;
	$scope.composeEmail = {};
	$scope.composeEmail.paramMap = {};
	
	//set default
	$scope.composeEmail.paramMap.ticketType = 'query';
	$scope.composeEmail.paramMap.insuranceType = 'car';
	
	$scope.sendEmail = function(){
        if($scope.contactUsForm.$invalid){
                $scope.inputValidStatus = true;
                angular.forEach($scope.contactUsForm.$invalid, function(field) {
                        field.$setTouched();
                });
        }else{
                $scope.inputValidStatus = false;
                if($scope.composeEmail.paramMap.ticketType== 'query'){
                $scope.composeEmail.funcType = $scope.globalLabel.functionType.query;
                }
                else if ($scope.composeEmail.paramMap.ticketType== 'complaint'){
                        $scope.composeEmail.funcType = $scope.globalLabel.functionType.complaint;
                }
                else if($scope.composeEmail.paramMap.ticketType== 'request'){
                        $scope.composeEmail.funcType = $scope.globalLabel.functionType.request;
                }
                else {
                        $scope.composeEmail.funcType = $scope.globalLabel.functionType.userEnquiry;
                }
                RestAPI.invoke($scope.globalLabel.transactionName.userEnquiry, $scope.composeEmail).then(function(callback){
                        console.log('call back details' + JSON.stringify($scope.composeEmail));
                        $scope.emailSendCfrmStatus = true;
                        $scope.composeEmail = '';


                });
        }
	}

	/*$scope.sendEmail = function(){
		if($scope.contactUsForm.$invalid){
			$scope.inputValidStatus = true;
			angular.forEach($scope.contactUsForm.$invalid, function(field) {
				field.$setTouched();
			});
		}else{
			$scope.inputValidStatus = false;
			$scope.composeEmail.funcType = $scope.globalLabel.functionType.userEnquiry;
			RestAPI.invoke($scope.globalLabel.transactionName.userEnquiry, $scope.composeEmail).then(function(callback){
				$scope.emailSendCfrmStatus = true;
			});	
		}
	}*/
}]);