/*
 * Description	: This file contains methods for unsuccessful payment for product.
 * Author		: Akash Kumawat
 * Date			: 24 May 2018
 * Modification : 21 June 2018
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */
'use strict';
angular.module('payFailureTravel', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('payFailureTravelController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce) {
        if (agencyPortalEnabled) {
            $scope.agencyPortalEnabled = agencyPortalEnabled;
        }
        $scope.redirectURL = function() {
            if (isAPICall) {
                $scope.rampUniqueId = "";
                $scope.rampRedirectURL = "";
                var url = "";
                var request = {};
                if (localStorageService.get('rampUniqueId') && localStorageService.get('rampRedirectURL')) {
                    $scope.rampUniqueId = JSON.parse(localStorageService.get('rampUniqueId'));
                    $scope.rampRedirectURL = JSON.parse(localStorageService.get('rampRedirectURL'));
                    url = "https://" + $scope.rampRedirectURL;
                    request.rampUniqueId = $scope.rampUniqueId;
                    request.message = "failure";
                } else {
                    url = $rootScope.affilateRedirection;
                }
                $http({ method: 'POST', url: url, data: request }).
                success(function(callback, status) {
                        var Response = JSON.parse(callback);
                        $window.location.href = $rootScope.affilateURL;
                        console.log("API Response : " + Response);
                    })
                    .error(function(data, status) {
                        $window.location.href = $rootScope.affilateURL;
                    });
                $window.location.href = $rootScope.affilateURL;
            } else {
                $window.location.href = $rootScope.affilateURL;
            }
        };

        loadDatbase(function() {
            // Setting application labels to avoid static assignment.	-	modification-0003
            if (idepProdEnv) {
                $rootScope.modalSurvey = true;
            }

            //$http.get(wp_path + 'ApplicationLabels.json').then(function(applicationCommonLabels) {
                //var applicationLabels = applicationCommonLabels.data;
                //localStorageService.set("applicationLabels", applicationLabels);
                //$scope.globalLabel = applicationLabels.globalLabels;
                $scope.p365Labels=travelPolicyLabels;
                $scope.statusCode = ($location.search().statusCode) ? $location.search().statusCode : undefined;
				$rootScope.wordPressEnabled = wordPressEnabled;
                //$rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled")
                $rootScope.loaderContent = { businessLine: '5', header: 'Travel Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };
                $rootScope.title = $scope.p365Labels.policies365Title.travelPayFailure;
                $scope.travelResponseToken = localStorageService.get("travelReponseToken");
                //			console.log("travelResponseToken Received. : " + JSON.stringify($scope.travelResponseToken));
                $scope.selectedProduct = localStorageService.get("selectedProduct");
                //			console.log("Seleced Product Details Received. : " + JSON.stringify($scope.selectedProduct));
                $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                messageIDVar = $scope.quoteUserInfo.messageId;

                $scope.$apply();
            //});
        });
        //added by gauri for mautic application
        if (imauticAutomation == true) {
            imatEvent('PaymentFailure');
        }
    }]);