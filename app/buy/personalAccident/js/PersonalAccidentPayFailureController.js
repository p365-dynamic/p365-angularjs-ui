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
angular.module('payFailurePersonalAccident', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
.controller('payFailurePersonalAccidenntController', ['RestAPI', '$scope', '$rootScope', '$location','$http', 'localStorageService', '$timeout','$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout,$sce){
	loadDatbase(function(){
		// Setting application labels to avoid static assignment.	-	modification-0003
		if(idepProdEnv){
			$rootScope.modalSurvey = true;
		}	
		$http.get(wp_path+'ApplicationLabels.json').then(function (applicationCommonLabels) {
			var applicationLabels  = applicationCommonLabels.data;
			localStorageService.set("applicationLabels", applicationLabels);
			$scope.globalLabel = applicationLabels.globalLabels;
			
			$rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled");
			
			/*if($scope.globalLabel.applicationLabels.common.surveyFailure	== true){
				$rootScope.modalSurvey = true;
			}*/
			$rootScope.loaderContent={businessLine:'8',header:'Personal Accident Insurance',desc:$sce.trustAsHtml($scope.globalLabel.applicationLabels.personalAccident.proverbBuyProduct)};
						$rootScope.title = $scope.globalLabel.policies365Title.personalAccidentPayFailure;
			$scope.PAReponseToken = localStorageService.get("paReponseToken");
			$scope.selectedProduct = localStorageService.get("personalAccidentSelectedProduct");
			console.log("Seleced Product Details Received. : " + JSON.stringify($scope.selectedProduct));
			$scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
			messageIDVar=$scope.quoteUserInfo.messageId;

			$scope.$apply();
		});
	});
}]);