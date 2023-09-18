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
angular.module('paySuccessPersonalAccident', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('paySuccessPersonalAccidentController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce) {

        loadDatbase(function() {
            // Setting application labels to avoid static assignment.	-	modification-0003
            if (idepProdEnv) {
                $rootScope.modalSurvey = true;
            }
            if (wordPressEnabled) {
                $rootScope.wordPressEnabled = wordPressEnabled;
                $rootScope.wp_path = wp_path;
                localStorageService.set("wordPressEnabled", true);
            } else {
                $rootScope.wp_path = '';
                localStorageService.set("wordPressEnabled", false);
            }
            $http.get(wp_path + 'ApplicationLabels.json').then(function(applicationCommonLabels) {
                var applicationLabels = applicationCommonLabels.data;
                localStorageService.set("applicationLabels", applicationLabels);
                $scope.globalLabel = applicationLabels.globalLabels;
                /*if($scope.globalLabel.applicationLabels.common.surveySuccess	== true){
				$rootScope.modalSurvey = true;
		
			}*/
                //$rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled");
                $rootScope.loaderContent = { businessLine: '8', header: 'PersonalAccident Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.personalAccident.proverbBuyProduct) };
                $rootScope.title = $scope.globalLabel.policies365Title.personalAccidentPaySuccess;
                $scope.authenticate = {};

                //$scope.loading = true;
                $scope.showSuccessScreen = false;

                // if(localStorageService.get("paReponseToken")){	

                // 	$scope.pAReponseToken = localStorageService.get("paReponseToken");	
                // 	// console.log("$scope.pAReponseToken",$scope.pAReponseToken);

                // 	// if($location.search("policyNo")){
                // 	// 	console.log($location.search('policyNo'))

                // 	// 	$scope.pAReponseToken.policyNo =   $location.search("policyNo")
                // 	// 	$scope.pAReponseToken.source =   $location.search("source")
                // 	// 	$scope.pAReponseToken.proposalId =   $location.search("proposalId")
                // 	// }	


                // }else{
                // 	$scope.pAReponseToken = {};
                // }


                if ($location.search().policyNo != null || String($location.search().policyNo) != "undefined") {
                    $scope.pAReponseToken = {};
                    $scope.pAReponseToken.policyNo = $location.search().policyNo;
                    $scope.pAReponseToken.proposalCreatedDate = $location.search().proposalCreatedDate;
                    $scope.pAReponseToken.policyEndDate = $location.search().policyEndDate;
                    $scope.pAReponseToken.policyStartDate = $location.search().policyStartDate;
                    $scope.pAReponseToken.proposalId = $location.search().proposalId;
                    $scope.pAReponseToken.netPremium = Math.round($location.search().netPremium);
                    $scope.pAReponseToken.sumInsured = $location.search().sumInsured;
                    $scope.pAReponseToken.source = $location.search().source;

                    // console.log("$scope.pAReponseToken",$scope.pAReponseToken);
                } else {
                    $scope.pAReponseToken = {};
                }





                $scope.selectedProduct = localStorageService.get("personalAccidentSelectedProduct");
                $scope.selectedProductInputParam = localStorageService.get("personalAccidentQuoteInputParamaters");

                $scope.selectedProductInputParam = localStorageService.get("personalAccidentQuoteInputParamaters");
                $scope.selectedProduct = localStorageService.get("personalAccidentSelectedProduct");
                $scope.proposalRequest = localStorageService.get("pAProposeFormDetails");
                // console.log("$scope.proposalRequest",$scope.proposalRequest);
                if (localStorageService.get("quoteUserInfo")) {
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                    $scope.quoteUserInfo.createLeadStatus = true;
                    localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                    messageIDVar = $scope.quoteUserInfo.messageId;
                }

                $scope.purchaseStatement = function() {
                    //below lines of code will display age in policy purchase document for PA
                    for (var i = 0; i < $scope.selectedPolicyDetails.insuredDetails.insuredMembers.length; i++) {
                        if ($scope.selectedPolicyDetails.insuredDetails.insuredMembers[i].dateOfBirth) {
                            $scope.selectedPolicyDetails.insuredDetails.insuredMembers[i].age = calculateAgeByDOB(String($scope.selectedPolicyDetails.insuredDetails.insuredMembers[i].dateOfBirth));
                        }
                    }

                    localStorageService.set("policyDocDetails", $scope.selectedPolicyDetails);


                    if ($scope.selectedPolicyDetails.businessLineId == 1) {
                        // For Life Policy
                    } else if ($scope.selectedPolicyDetails.businessLineId == 2) {
                        $location.path("/bikepolicypurchase");
                    } else if ($scope.selectedPolicyDetails.businessLineId == 3) {
                        $location.path("/carpolicypurchase");
                    } else {
                        $location.path("/medicalPurchasing");
                    }
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
                    authenticateUserParam.mobileNumber = $scope.proposalRequest.proposerInfo.contactInfo.mobile;
                    authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
                    getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.validateOTP, authenticateUserParam, function(createOTP) {
                        if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.invalidOTPError = "";
                            $scope.modalOTP = false;

                            var userLoginInfo = {};
                            userLoginInfo.username = createOTP.data.firstName;
                            userLoginInfo.mobileNumber = createOTP.data.mobile;
                            userLoginInfo.status = true;
                            localStorageService.set("userLoginInfo", userLoginInfo);
                            localStorageService.set("userProfileDetails", createOTP.data);
                            $location.path("/dashboard");
                        } else if (createOTP.responseCode == $scope.globalLabel.responseCode.noRecordsFound) {
                            $scope.invalidOTPError = $scope.globalLabel.validationMessages.invalidOTP;
                        } else if (createOTP.responseCode == $scope.globalLabel.responseCode.expiredOTP) {
                            $scope.invalidOTPError = $scope.globalLabel.validationMessages.expiredOTP;
                        } else {
                            $scope.invalidOTPError = $scope.globalLabel.validationMessages.authOTP;
                        }
                    });
                };
                $scope.resendOTP = function() {
                    var validateLoginParam = {};
                    validateLoginParam.paramMap = {};
                    validateLoginParam.mobileNumber = $scope.proposalRequest.proposerInfo.contactInfo.mobile;
                    validateLoginParam.funcType = $scope.globalLabel.functionType.optAuth;
                    validateLoginParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;

                    getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.sendSMS, validateLoginParam, function(createOTP) {
                        if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.invalidOTPError = "";
                        } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                            $scope.invalidOTPError = createOTP.message;
                            $scope.disableOTP = true;
                        } else {
                            $scope.invalidOTPError = $scope.globalLabel.errorMessage.createOTP;
                        }
                    });
                };
            });
        });
    }]);