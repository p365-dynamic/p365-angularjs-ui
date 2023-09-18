/*
 * Description	: This file contains methods for successful payment for product.
 * Author		: Shubham Jain
 * Date			: 8 December 2016
 *
 * */
'use strict';
angular.module('payFailureLife', ['CoreComponentApp', 'LocalStorageModule'])
    .controller('payFailureLifeController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce) {
    	if(agencyPortalEnabled){
    		$scope.agencyPortalEnabled = agencyPortalEnabled;
    		$scope.rampUniqueId="";
    		if(localStorageService.get('rampUniqueId'))
    		$scope.rampUniqueId = JSON.parse(localStorageService.get('rampUniqueId'));
    		$scope.agencyURL=$rootScope.affilateURL+$scope.rampUniqueId;
        	}
    	loadDatbase(function() {
            if (wordPressEnabled) {
                $rootScope.wordPressEnabled = wordPressEnabled;
                $rootScope.wp_path = wp_path;
                localStorageService.set("wordPressEnabled", true);
            } else {
                $rootScope.wp_path = '';
                localStorageService.set("wordPressEnabled", false);
            }
            // Setting application labels to avoid static assignment.	-	modification-0003
            $rootScope.modalSurvey = true;
            // var applicationLabels  = localStorageService.get("applicationLabels");
            // $scope.globalLabel = applicationLabels.globalLabels;
            $scope.p365Labels = lifePolicyLabels;
            if ($scope.p365Labels.common.surveyFailure == true) {
                $rootScope.modalSurvey = true;
            }
            $rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };

            //	$scope.carrierLogoList = localStorageService.get("carrierLogoList");
            $scope.lifeProposeFormDetails = localStorageService.get("lifeProposeFormDetails");
            $scope.lifeReponseToken = localStorageService.get("lifeReponseToken");
            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
        });
        //added by gauri for mautic application
        if (imauticAutomation == true) {
            imatEvent('PaymentFailure');
        }
    }]);