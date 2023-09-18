/*
 * Description	: This file contains methods for successful payment for product.
 * Author		: Akash Kumawat
 * Date			: 24 May 2018
 * Modification : 21 June 2018
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */
'use strict';
angular.module('paySuccessTravel', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('paySuccessTravelController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce) {
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
                    request.message = "success";
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
            // $http.get(wp_path + 'ApplicationLabels.json').then(function(applicationCommonLabels) {
            // var applicationLabels = applicationCommonLabels.data;
            //localStorageService.set("applicationLabels", applicationLabels);
            //$scope.globalLabel = applicationLabels.globalLabels;
            $scope.p365Labels = travelPolicyLabels;
            $scope.policies365Details = policies365Details;

            //$rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled");
            $rootScope.wordPressEnabled = wordPressEnabled;
           $rootScope.loaderContent = { businessLine: '5', header: 'Travel Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };
            $rootScope.title = $scope.p365Labels.policies365Title.travelPaySuccess;
            $scope.authenticate = {};

            $scope.showSuccessScreen = false;


            if (String($location.search().proposalId) != "undefined" && $location.search().proposalId != null) {

                // get the proposal id from the link 
                $scope.proposalId = $location.search().proposalId;

                // Create request to get proposal docume
                $scope.proposalDocParam = {}
                $scope.proposalDocParam.proposalId = $scope.proposalId
                $scope.proposalDocParam.businessLineId = 5;
                // Read the proposal documnet
                RestAPI.invoke("proposalDataReader", $scope.proposalDocParam).then(function(proposalDataResponse) {
                    if (proposalDataResponse.responsecode == 1000) {
                        $scope.proposalDataResponse = proposalDataResponse.data.PolicyTransaction;

                        // for storing the proposl request 
                        $scope.proposalRequest = angular.copy($scope.proposalDataResponse.proposalRequest);

                        //added by gauri for mautic application
                        if ($scope.proposalDataResponse.bikePolicyResponse.policyNo) {
                            if (imauticAutomation == true) {
                                imatEvent('PaymentGenerated');
                            }
                        } else {
                            if (imauticAutomation == true) {
                                imatEvent('PaymentSuccess');
                            }
                        }

                        // quoteuserinfo is present then
                        if (localStorageService.get("quoteUserInfo")) {
                            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                            $scope.quoteUserInfo.createLeadStatus = true;
                            localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                            if ($scope.quoteUserInfo) {
                                messageIDVar = $scope.quoteUserInfo.messageId;
                            }
                        }

                        $scope.loading = false;
                        $scope.showSuccessScreen = false;
                    } else {
                        // If screen are not present in DB. Show Error Message and redirect to instant quote screen (home page).
                        $scope.loading = false;
                        $rootScope.P365Alert("Policies365", "Some error Occurred ", "Ok");
                    }

                });
            };




            $scope.viewPolicy = function() {
                $scope.modalOTP = true;
                $scope.resendOTP();
            };

            $scope.closeAuthenticateForm = function() {
                $scope.modalOTP = false;
            };
            $scope.authenticateUser = function() {
                $scope.disableOTP = false;
                var authenticateUserParam = {};
                authenticateUserParam.mobileNumber = $scope.proposalRequest.proposerDetails.mobileNumber;
                authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.invalidOTPError = "";
                        $scope.modalOTP = false;

                        var userLoginInfo = {};
                        userLoginInfo.username = createOTP.data.firstName;
                        userLoginInfo.mobileNumber = createOTP.data.mobile;
                        userLoginInfo.status = true;
                        localStorageService.set("userLoginInfo", userLoginInfo);
                        localStorageService.set("userProfileDetails", createOTP.data);
                        $location.path("/dashboard");
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.noRecordsFound) {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.invalidOTP;
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.expiredOTP) {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.expiredOTP;
                    } else {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.authOTP;
                    }
                });
            }

            $scope.resendOTP = function() {
                var validateLoginParam = {};
                validateLoginParam.paramMap = {};
                validateLoginParam.mobileNumber = $scope.proposalRequest.proposerDetails.mobileNumber;
                validateLoginParam.funcType = $scope.p365Labels.functionType.optAuth;
                validateLoginParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateLoginParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.invalidOTPError = "";
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                        $scope.disableOTP = true;
                        $scope.invalidOTPError = createOTP.message;
                    } else {
                        $scope.invalidOTPError = $scope.p365Labels.errorMessage.createOTP;
                    }
                });
            }

            //   });
        });

    }]);