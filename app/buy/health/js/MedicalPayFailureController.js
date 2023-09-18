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
angular.module('payFailureHealth', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('payFailureHealthController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce) {
        //in some scenario policies365 label get undefined 
        var p365UIVar =  {
			"mobileNumber": "+91 9962411255",
			"mobileNumberTrim": "+919962411255",
			"salesAssistNumber":  "(022) 68284343",
			"salesAssistNumberTrim": "02268284343",
			"salesAssistNumberLanding":"022-68284343",
			"claimsNumber": "(022) 42114299",
			"claimsNumberTrim": "02242114299",
			"claimsNumberLanding":"022-42114299",
			"infoEmailId": "contact@policies365.com"
		} 
        if(agencyPortalEnabled){
    		$scope.agencyPortalEnabled = agencyPortalEnabled
    		//$scope.agencyURL=$rootScope.affilateURL+$scope.rampUniqueId;
            }
        
            if($location.search().source){
                if($location.search().source == 'posp'){
                $scope.pospBackButtonEnabled = true;
                }
        }

        $scope.redirectURL = function() {
            if(localStorage.getItem('rampRedirectURL')){
                $window.location.href =localStorage.getItem('rampRedirectURL');
            }else if(agencyPortalEnabled){
                //     if(idepProdEnv){
                //       $window.location.href =  "https://iagency.policies365.com/#/login";
                //   }else{
                //       $window.location.href =  "http://uagency.policies365.com/#/login";
                //   } 
                if(idepProdEnv){
                    $window.location.href =  "https://www.policies365.com";
              }else{
                    $window.location.href =  "http://uat.policies365.com";
              }  
              }else if($scope.pospBackButtonEnabled){
                $window.location.href = "http://pospuat.policies365.com";  
            }else{
                $window.location.href =  $rootScope.affilateURL;
            }
        }

    	loadDatbase(function() {
            // Setting application labels to avoid static assignment.	-	modification-0003
            if (idepProdEnv) {
                $rootScope.modalSurvey = true;
            }
            if (wordPressEnabled) {
                $rootScope.wordPressEnabled = wordPressEnabled;
                $rootScope.wp_path = wp_path;
                //localStorageService.set("wordPressEnabled", true);
            } else {
                $rootScope.wp_path = '';
               // localStorageService.set("wordPressEnabled", false);
            }
            //	$http.get(wp_path+'ApplicationLabels.json').then(function (applicationCommonLabels) {
            // var applicationLabels  = applicationCommonLabels.data;
            // localStorageService.set("applicationLabels", applicationLabels);
            // $scope.globalLabel = applicationLabels.globalLabels;
            $scope.p365Labels = healthPolicyLabels;
            if (policies365Details) {
                $scope.policies365Details = policies365Details;
            } else {
                console.log('retrieving p365 labels using UI');
                $scope.policies365Details = p365UIVar;
            }
            /*if($scope.globalLabel.applicationLabels.common.surveyFailure	== true){
            	$rootScope.modalSurvey = true;
            }*/
            //$rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled");

            $scope.statusCode = ($location.search().statusCode) ? $location.search().statusCode : undefined;

            $rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };
            $rootScope.title = $scope.p365Labels.policies365Title.healthPayFailure;
            console.log("Common Labels Received.");
            $scope.medicalReponseToken = localStorageService.get("medicalReponseToken");
            $scope.selectedProduct = localStorageService.get("healthSelectedProduct");
            console.log("Seleced Product Details Received. : " + JSON.stringify($scope.selectedProduct));
            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
            console.log("Quote User Info Received. : " + JSON.stringify($scope.quoteUserInfo));
            if ($scope.quoteUserInfo) {
                messageIDVar = $scope.quoteUserInfo.messageId;

                $scope.$apply();
            }
            //});
             // Create request to get proposal document
             $scope.proposalDocParam = {}
             $scope.proposalDocParam.proposalId = localStorageService.get("proposalId");
             $scope.proposalDocParam.businessLineId = 4;
             // Read the proposal documnet
             RestAPI.invoke("proposalDataReader", $scope.proposalDocParam).then(function (proposalDataResponse) {
                 if (proposalDataResponse.responsecode == $scope.p365Labels.responseCode.success) {
                     $scope.proposalDataResponse = proposalDataResponse.data.PolicyTransaction;
                     //attaching userName in payment url for POSP
                     console.log('$scope.proposalDataResponse in car failure', $scope.proposalDataResponse);
                     if ($scope.proposalDataResponse.requestSource) {
                         if ($scope.proposalDataResponse.requestSource == 'posp') {
                             $location.search("userName", $scope.proposalDataResponse.userName);
                         }
                     }
                     $scope.loading = false;
                 } 
             });
        });
        //added by gauri for mautic application
        if (imauticAutomation == true) {
            imatEvent('PaymentFailure');
        }
    }]);