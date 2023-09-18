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
angular.module('paySuccessHealth', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('paySuccessHealthController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', function (RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce) {

        //in some scenario policies365 label get undefined 
        var p365UIVar = {
            "mobileNumber": "+91 9962411255",
            "mobileNumberTrim": "+919962411255",
            "salesAssistNumber": "(022) 68284343",
            "salesAssistNumberTrim": "02268284343",
            "salesAssistNumberLanding": "022-68284343",
            "claimsNumber": "(022) 42114299",
            "claimsNumberTrim": "02242114299",
            "claimsNumberLanding": "022-42114299",
            "infoEmailId": "contact@policies365.com"
        }

        if (agencyPortalEnabled) {
            $scope.agencyPortalEnabled = agencyPortalEnabled;
            $scope.rampUniqueId = "";
            if (localStorageService.get('rampUniqueId'))
                $scope.rampUniqueId = JSON.parse(localStorageService.get('rampUniqueId'));

        }

        $scope.redirectURL = function () {
            if (localStorage.getItem('rampRedirectURL')) {
                $window.location.href = localStorage.getItem('rampRedirectURL');
            } else if (agencyPortalEnabled) {
                //     if(idepProdEnv){
                //       $window.location.href =  "https://iagency.policies365.com/#/login";
                //   }else{
                //       $window.location.href =  "http://uagency.policies365.com/#/login";
                //   } 
                if (idepProdEnv) {
                    $window.location.href = "https://www.policies365.com";
                } else {
                    $window.location.href = "http://uat.policies365.com";
                }
            } else if ($scope.pospBackButtonEnabled) {
                $window.location.href = "http://pospuat.policies365.com";
            } else {
                $window.location.href = $rootScope.affilateURL;
            }
        }
        loadDatbase(function () {
            // Setting application labels to avoid static assignment.	-	modification-0003
            if (idepProdEnv) {
                $rootScope.modalSurvey = true;
            }
            if (wordPressEnabled) {
                $rootScope.wordPressEnabled = wordPressEnabled;
                $rootScope.wp_path = wp_path;
               // localStorageService.set("wordPressEnabled", true);
            } else {
                $rootScope.wp_path = '';
               // localStorageService.set("wordPressEnabled", false);
            }
            //$http.get(wp_path+'ApplicationLabels.json').then(function (applicationCommonLabels) {
            //	var applicationLabels  = applicationCommonLabels.data;
            //localStorageService.set("applicationLabels", applicationLabels);
            //	$scope.globalLabel = applicationLabels.globalLabels;
            /*if($scope.globalLabel.applicationLabels.common.surveySuccess	== true){
				$rootScope.modalSurvey = true;
		
			}*/
            //$rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled");
            $scope.p365Labels = healthPolicyLabels;
            if (policies365Details) {
                $scope.policies365Details = policies365Details;
            } else {
                console.log('retrieving p365 labels using UI');
                $scope.policies365Details = p365UIVar;
            }
            $rootScope.loaderContent = {
                businessLine: '4',
                header: 'Health Insurance',
                desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct)
            };
            $rootScope.title = $scope.p365Labels.policies365Title.healthPaySuccess;
            $scope.authenticate = {};
            // get the proposal id from the link 
            if ($location.search().proposalId) {
                $scope.proposalId = $location.search().proposalId;
                console.log('proposal id found ..');
            } else if ($location.search().proposalNo) {
                $scope.proposalId = $location.search().proposalNo;
                console.log('proposal number found ..');
            } else if (localStorageService.get("proposalIdEncrypted")) {
                $scope.proposalId = localStorageService.get("proposalIdEncrypted");
            }
            //Check for the proposal Id .
            if ($scope.proposalId) {
                // get the proposal id from the link 
                $scope.proposalId = $location.search().proposalId;

                // Create request to get proposal document
                $scope.proposalDocParam = {}
                $scope.proposalDocParam.proposalId = $scope.proposalId
                $scope.proposalDocParam.businessLineId = 4
                // Read the proposal documnet
                RestAPI.invoke("proposalDataReader", $scope.proposalDocParam).then(function (proposalDataResponse) {
                    if (proposalDataResponse.responsecode == $scope.p365Labels.responseCode.success) {
                        $scope.proposalDataResponse = proposalDataResponse.data.PolicyTransaction;
                        console.log('$scope.proposalDataResponse in health is:', $scope.proposalDataResponse);
                        if ($scope.proposalDataResponse.requestSource) {
                            if ($scope.proposalDataResponse.requestSource == 'posp') {
                                $location.search("userName", $scope.proposalDataResponse.userName);
                            }
                        }
                        // for storing the proposl request 
                        $scope.proposalRequest = angular.copy($scope.proposalDataResponse.proposalRequest);

                        //added by gauri for mautic application
                        console.log('imauticAutomation flag is: ', imauticAutomation);
                        if ($scope.proposalDataResponse.bikePolicyResponse.policyNo) {
                            console.log('inside if block as policy number found');
                            if (imauticAutomation == true) {
                                imatEvent('PaymentGenerated');
                            }
                        } else {
                            console.log('inside else block as policy number found');
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


            $scope.purchaseStatement = function () {
                //below lines of code will display age in policy purchase document for health
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

            $scope.viewPolicy = function () {
                $scope.modalOTP = true;
                $scope.resendOTP();
            };

            $scope.closeAuthenticateForm = function () {
                $scope.modalOTP = false;
            };

            $scope.authenticateUser = function () {
                $scope.disableOTP = false;
                var authenticateUserParam = {};
                authenticateUserParam.mobileNumber = $scope.proposalRequest.proposerInfo.contactInfo.mobile;
                authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function (createOTP) {
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
            };
            $scope.resendOTP = function () {
                var validateLoginParam = {};
                validateLoginParam.paramMap = {};
                validateLoginParam.mobileNumber = $scope.proposalRequest.proposerInfo.contactInfo.mobile;
                validateLoginParam.funcType = $scope.p365Labels.functionType.optAuth;
                validateLoginParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateLoginParam, function (createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.invalidOTPError = "";
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                        $scope.invalidOTPError = createOTP.message;
                        $scope.disableOTP = true;
                    } else {
                        $scope.invalidOTPError = $scope.p365Labels.errorMessage.createOTP;
                    }
                });
            };
            //});
        });

    }]);