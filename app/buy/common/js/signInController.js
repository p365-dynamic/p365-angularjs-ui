/*
 * Description	: This file contains methods for get instant quote.
 * Author		: Yogesh Shisode
 * Date			: 13 May 2016
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By

 *
 * */


'use strict';
angular.module('signIn', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('signInController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$filter', '$anchorScroll', '$sce', '$window', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $filter, $anchorScroll, $sce, $window) {
        $scope.authenticate = {};
        if (localStorageService.get("userLoginInfo")) {
            $scope.userLoginInfo = localStorageService.get("userLoginInfo");
            if ($scope.userLoginInfo.username) {
                //added by gauri for mautic application
                if (imauticAutomation == true) {
                    imatEvent('CustomerSignIN');
                }
                $location.path("/dashboard");
            }
        }

        // $http.get(wp_path + 'ApplicationLabels.json').then(function(response) {
        //   localStorageService.set("applicationLabels", response.data);
        //  $scope.globalLabel = localStorageService.get("applicationLabels").globalLabels;
        $scope.p365Labels = profileLabels;
        // Validate mobile number.
        $scope.validateLogin = function() {
            if ($scope.loginForm.$valid) {
                $scope.disableOTP = false;
                $scope.authenticate.enteredOTP = ""
                var validateLoginParam = {};
                validateLoginParam.paramMap = {};
                validateLoginParam.mobileNumber = $scope.login.MobileNumber;
                validateLoginParam.funcType = $scope.p365Labels.functionType.otpAuth;
                validateLoginParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
                if (sessionIDvar) {
                    validateLoginParam.sessionId = sessionIDvar;
                }
                getDocUsingParam(RestAPI, userValidation, validateLoginParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.createOTPError = "";
                        $scope.modalLogin = false;
                        $rootScope.showAuthenticateForm();
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.userNotExist) {
                        $scope.createOTPError = createOTP.message;
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                        $scope.createOTPError = createOTP.message;
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.mobileInvalidCode) {
                        $scope.createOTPError = createOTP.message;
                    } else {
                        $scope.createOTPError = $scope.p365Labels.errorMessage.createOTP;
                    }
                });
            }
        };

        // Show OTP input form to get login.
        $rootScope.showAuthenticateForm = function() {
            $scope.modalOTP = true;
        };

        // Close OTP input form.
        $scope.closeAuthenticateForm = function() {
            $scope.modalOTP = false;
            $scope.login.MobileNumber = "";
            $scope.authenticate.enteredOTP = "";
        };

        // Validate user using mobile number and OTP entered.		-	modification-0008
        $scope.authenticateUser = function() {
            //$scope.login.MobileNumber = "";
            if ($scope.authenticateForm.$valid) {
                var authenticateUserParam = {};
                authenticateUserParam.mobileNumber = $scope.login.MobileNumber;
                authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);

                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function(createOTP) {
                if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.invalidOTPError = "";
                        //$scope.modalOTP = false;

                        var userLoginInfo = {};

                        if(createOTP.data.profileDetails){
                            userLoginInfo.username = createOTP.data.profileDetails.firstName;
                            userLoginInfo.mobileNumber = createOTP.data.profileDetails.mobile;                       
                        }
                        userLoginInfo.status = true;
                        localStorageService.set("userLoginInfo", userLoginInfo);
                        localStorageService.set("userProfileDetails", createOTP.data);

                        //to prepopulate lead info is user has already sign in 
                        var quoteUserInfo = {};
                        quoteUserInfo.firstName = createOTP.data.firstName;
                        quoteUserInfo.lastName = createOTP.data.lastName;
                        quoteUserInfo.emailId = createOTP.data.emailId;
                        quoteUserInfo.mobileNumber = createOTP.data.mobile;
                        quoteUserInfo.termsCondition = true;

                        if (messageIDVar) {
                            quoteUserInfo.messageIDVar = messageIDVar;
                        } else {

                            quoteUserInfo.termsCondition = false;
                            messageIDVar = '';
                        }
                        localStorageService.set("quoteUserInfo", quoteUserInfo);


                        $('.signin_link a').text(createOTP.data.firstName + " Account");
                        //$('.logout_link').closest('li').show();
                        $('.logout_link').closest('li').attr('style', 'display:inline-block !important');
                        localStorage.setItem("loggedIn", "true");
                        $location.path("/dashboard");

                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.noRecordsFound) {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.invalidOTP;
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.expiredOTP) {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.expiredOTP;
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                        $scope.invalidOTPError = createOTP.message;
                    } else {
                        $scope.invalidOTPError = $scope.p365Labels.validationMessages.authOTP;
                    }
                });
            }
        };


        // Resend OTP webservice call.
        $scope.resendOTP = function() {
            var validateLoginParam = {};
            validateLoginParam.paramMap = {};
            validateLoginParam.mobileNumber = $scope.login.MobileNumber;
            validateLoginParam.funcType = $scope.p365Labels.functionType.optAuth;
            validateLoginParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
            /*if(sessionIDvar){

            	validateLoginParam.sessionId=sessionIDvar;

            }*/
            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateLoginParam, function(createOTP) {

                if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                    $scope.invalidOTPError = "";
                } else if (createOTP.responseCode == $scope.p365Labels.responseCode.userNotExist) {
                    $scope.invalidOTPError = createOTP.message;
                } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                    $scope.invalidOTPError = createOTP.message;
                    $scope.disableOTP = true;
                } else if (createOTP.responseCode == $scope.p365Labels.responseCode.mobileInvalidCode) {
                    $scope.invalidOTPError = createOTP.message;
                } else {
                    $scope.invalidOTPError = $scope.p365Labels.errorMessage.createOTP;
                }
            });

        };
        // });
    }]);