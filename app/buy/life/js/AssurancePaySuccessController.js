/*
 * Description	: This file contains methods for successful payment for product.
 * Author		: Shubham Jain
 * Date			: 8 December 2016
 *
 * */
'use strict';
angular.module('paySuccessLife', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('paySuccessLifeController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce) {
        if (agencyPortalEnabled) {
            $scope.agencyPortalEnabled = agencyPortalEnabled;
            $scope.rampUniqueId = "";
            if (localStorageService.get('rampUniqueId'))
                $scope.rampUniqueId = JSON.parse(localStorageService.get('rampUniqueId'));
            $scope.agencyURL = $rootScope.affilateURL + $scope.rampUniqueId;
        }
        loadDatbase(function() {
            // Setting application labels to avoid static assignment.
            $rootScope.modalSurvey = true;
            if (wordPressEnabled) {
                $rootScope.wordPressEnabled = wordPressEnabled;
                $rootScope.wp_path = wp_path;
                localStorageService.set("wordPressEnabled", true);
            } else {
                $rootScope.wp_path = '';
                localStorageService.set("wordPressEnabled", false);
            }
            // var applicationLabels  = localStorageService.get("applicationLabels");
            // $scope.globalLabel = applicationLabels.globalLabels;
            $scope.p365Labels = lifePolicyLabels;
            $scope.policies365Details = policies365Details;
            if ($scope.p365Labels.common.surveySuccess == true) {
                $rootScope.modalSurvey = true;

            }
            $rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };
            $rootScope.title = $scope.p365Labels.policies365Title.PaySuccess;
            $scope.authenticate = {};
            $scope.loading = true;
            $scope.showSuccessScreen = false;

            //$scope.carrierLogoList = localStorageService.get("carrierLogoList");
            $scope.lifeProposeFormDetails = localStorageService.get("lifeProposeFormDetails");
            $scope.lifeReponseToken = localStorageService.get("lifeReponseToken");
            if (localStorageService.get("quoteUserInfo")) {
                $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                $scope.quoteUserInfo.createLeadStatus = true;
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                messageIDVar = $scope.quoteUserInfo.messageId;
            }


            var createLifePolicyParam = {};
            createLifePolicyParam.transactionStausInfo = {};
            createLifePolicyParam.carrierId = $scope.lifeProposeFormDetails.carrierId;
            createLifePolicyParam.productId = $scope.lifeProposeFormDetails.productId;
            createLifePolicyParam.businessLineId = localStorageService.get("selectedBusinessLineId");
            createLifePolicyParam.transactionStausInfo.transactionStatusCode = 1;
            createLifePolicyParam.transactionStausInfo.proposalId = $scope.lifeReponseToken.proposalId;

            getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.createLifePolicy, createLifePolicyParam, function(createPolicyDoc) {
                $scope.loading = false;
                if (createPolicyDoc.responseCode == $scope.p365Labels.responseCode.success) {
                    $scope.showSuccessScreen = true;
                    $scope.lifeReponseToken.policyNo = createPolicyDoc.data.policyNo;


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


                } else {
                    $scope.showSuccessScreen = false;
                    $location.path("/payfailurelife");
                }
            });

            $scope.viewPolicy = function() {
                $scope.modalOTP = true;
                $scope.authenticateUser(function(authStatus) {
                    if (authStatus) {
                        $scope.modalOTP = false;
                        $location.path("/dashboard");
                    }
                });
            }

            $scope.closeAuthenticateForm = function() {
                $scope.modalOTP = false;
            }

            $scope.authenticateUser = function(authResp) {
                var authenticateUserParam = {};
                authenticateUserParam.mobileNumber = $scope.lifeProposeFormDetails.proposerDetails.mobileNumber;
                authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);

                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.invalidOTPError = "";
                        $scope.modalOTP = false;
                        authResp(true);
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.noRecordsFound) {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.invalidOTP;
                        authResp(false);
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.expiredOTP) {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.expiredOTP;
                        authResp(false);
                    } else {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.authOTP;
                        authResp(false);
                    }
                });
            }

            $scope.resendOTP = function() {
                var validateLoginParam = {};
                validateLoginParam.paramMap = {};
                validateLoginParam.mobileNumber = $scope.lifeProposeFormDetails.proposerDetails.mobileNumber;
                validateLoginParam.funcType = $scope.p365Labels.functionType.optAuth;
                validateLoginParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateLoginParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.invalidOTPError = "";
                    } else {
                        $scope.invalidOTPError = $scope.p365Labels.errorMessage.createOTP;
                    }
                });
            }
        });

    }]);