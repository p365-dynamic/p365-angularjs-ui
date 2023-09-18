/*
 * Description	: This file contains methods for successful payment for product.
 * Author		: Shubham Jain
 * Date			: 13 May 2016
 * Modification :
 * 
 * Sr.Id	   Date				Description												Search ID			Modified By
 *  1		13-06-2016		Dropdown list moved to dropdown-list-manager.										  modification-0001		Yogesh S.
 *
 * */
'use strict';
angular.module('paySuccessCar', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('paySuccessCarController', ['RestAPI', '$scope', '$rootScope', '$location', '$window', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $window, $http, localStorageService, $timeout, $sce) {
        $scope.authenticate = {};
        var proposalId = '';
        var pospBackButtonEnabled = false;
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

        if (agencyPortalEnabled) {
            $scope.agencyPortalEnabled = agencyPortalEnabled;
        }
        if($location.search().source){
            if($location.search().source == 'posp'){
            pospBackButtonEnabled = true;
            }
        }

        $scope.sendSMS = function(){
            var validateAuthParam = {};
            validateAuthParam.paramMap = {};
            validateAuthParam.mobileNumber = $scope.proposalDataResponse.proposalRequest.proposerDetails.mobileNumber;
            validateAuthParam.paramMap.firstName = $scope.proposalDataResponse.proposalRequest.proposerDetails.firstName;
            validateAuthParam.funcType = "PaymentSuccess";
            getDocUsingParam(RestAPI,"sendSMS", validateAuthParam, function (createOTP) {
                if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                    console.log('sms sent successfully for payment success');
                } else {
                    console.log('unable to  sent sms for payment success');
                }
            });
        }
        $scope.sendPolicySuccessEmail = function(){
            var proposalDetailsEmail = {};
            proposalDetailsEmail.paramMap = {};
        
            proposalDetailsEmail.funcType = "ProposalSuccessTemplate";
            console.log('$scope.proposalDataResponse is: ',$scope.proposalDataResponse);
            proposalDetailsEmail.username = $scope.proposalDataResponse.proposalRequest.proposerDetails.emailId.trim();
            //proposalDetailsEmail.isBCCRequired = 'Y';
            proposalDetailsEmail.paramMap.customerName = $scope.proposalDataResponse.proposalRequest.proposerDetails.firstName.trim() + " " + $scope.proposalDataResponse.proposalRequest.proposerDetails.lastName.trim();
             proposalDetailsEmail.paramMap.selectedPolicyType = "Car";
            RestAPI.invoke("sendEmail", proposalDetailsEmail).then(function (emailResponse) {
                if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                    $scope.sendSMS();
                } else {
                    $scope.sendSMS();
                }
            });  
        }

        $scope.callbackApi = function() {
            if (localStorage.getItem('rampUniqueId') && localStorage.getItem('rampRedirectURL')) {
                var  rampUniqueId = localStorage.getItem('rampUniqueId');
                var  rampRedirectURL = localStorage.getItem('rampRedirectURL');
                var policyEndDate ;
                if($scope.proposalDataResponse.proposalRequest.insuranceDetails.policyEndDate){
                    policyEndDate = $scope.proposalDataResponse.proposalRequest.insuranceDetails.policyEndDate;
                }else{
                    policyEndDate = "NA";
                }
              var policyDetails = {"rampUniqueId":rampUniqueId,"policyDetails":{"status":"success","ins_provider_name":$scope.proposalDataResponse.proposalRequest.premiumDetails.insuranceCompany,"exp_date":policyEndDate,"payment_amount":$scope.proposalDataResponse.proposalRequest.premiumDetails.grossPremium}};
               console.log('redirection url is:'+JSON.stringify(policyDetails));
                 // ramp api integration
                 var reqObj={
                     method:"POST",
                     url: rampRedirectURL,
                     headers:{'Content-Type':'text/plain'},
          //data:{ "rampUniqueId":$scope.rampUniqueId, "policy_details":"{status: success}" }};
            data :  policyDetails};
           $http(reqObj).
           success(function(callback, status) {
               console.log('ramp api response is: ',callback);
           })
               .error(function(data, status) {
                 console.log('ramp api response in error is: ',data);
               });
                 //api integration end
         }
         if (localStorage.getItem('desiSkillUniqueId')) {
            var  desiSkillUniqueId = localStorage.getItem('desiSkillUniqueId');
            var desiSkillAgentId = localStorage.getItem('desiSkillAgentId');
            var policyNo ;
            var selectedMake = "";
            var selectedModel = "";
            var selectedVariant = "";
            var selectedVehicleDetails = {};
            if(localStorageService.get("carQuoteInputParamaters")){
                selectedVehicleDetails = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
                selectedMake = selectedVehicleDetails.make;
                selectedModel = selectedVehicleDetails.model;
                selectedVariant = selectedVehicleDetails.variant;
            }else{
                selectedMake = $scope.proposalDataResponse.proposalRequest.vehicleDetails.make;
                selectedModel = $scope.proposalDataResponse.proposalRequest.vehicleDetails.model;
                selectedVariant = $scope.proposalDataResponse.proposalRequest.vehicleDetails.variant;
            }
            if($location.search().policyNo){
                policyNo = $location.search().policyNo;
            }else{
                policyNo = $scope.proposalDataResponse.carPolicyResponse.policyNo;
            }
            
          var policyDetails = {
                               "mblNum":$scope.proposalDataResponse.carPolicyResponse.mobile,
                               "txnId":desiSkillUniqueId,
                               "make":selectedMake,
                               "model":selectedModel,
                               "variant":selectedVariant,
                               "policyNumber": policyNo,
                               "type":"car",
                               "agentId":desiSkillAgentId,
                               "premiumAmount":$scope.proposalDataResponse.proposalRequest.premiumDetails.grossPremium
                            };
           console.log('policy details  is:'+JSON.stringify(policyDetails));
             // ramp api integration
             var reqObj={
                 method:"POST",
                 url: "https://crm.gkms.in/api/insurance/p365_callback.php",
                 headers:{'Content-Type':'text/plain'},
      //data:{ "rampUniqueId":$scope.rampUniqueId, "policy_details":"{status: success}" }};
        data :  policyDetails};
       $http(reqObj).
       success(function(callback, status) {
           console.log('desiskill api response is: ',callback);
       })
           .error(function(data, status) {
             console.log('desiskill api response in error is: ',data);
           });
             //api integration end
     }

        }
        $scope.redirectURL = function() {
            if (localStorage.getItem('rampUniqueId') && localStorage.getItem('rampRedirectURL')) {
                   var  rampUniqueId = localStorage.getItem('rampUniqueId');
                   var  rampRedirectURL = localStorage.getItem('rampRedirectURL');
                   $window.location.href = rampRedirectURL;
            }else if(localStorage.getItem('carEagerUniqueId')){
                    var thirdPartyRedirectionURL = "http://13.233.36.16:4000/api/job/callback/new/policy/?registration_no="+$scope.proposalDataResponse.proposalRequest.vehicleDetails.registrationNumber+"&"+"policy_holder="+$scope.proposalDataResponse.proposalRequest.proposerDetails.firstName+"&"+"insurance_company="+$scope.proposalDataResponse.proposalRequest.premiumDetails.insuranceCompany+"&policy_no="+$scope.proposalDataResponse.carPolicyResponse.policyNo+"&premium="+$scope.proposalDataResponse.proposalRequest.premiumDetails.grossPremium+"&expire="+$scope.proposalDataResponse.proposalRequest.insuranceDetails.policyEndDate+"&cashless=Yes"+"&policy_type="+$scope.proposalDataResponse.proposalRequest.insuranceDetails.insuranceType+"&UniqueId="+localStorage.getItem("carEagerUniqueId");
                    console.log('thirdPartyRedirectionURL is::',thirdPartyRedirectionURL);
                    $window.location.href = $sce.trustAsResourceUrl(thirdPartyRedirectionURL);
            }else if(pospBackButtonEnabled){
                    $window.location.href = "http://pospuat.policies365.com";
            }else if(agencyPortalEnabled){
                if(idepProdEnv){
                    $window.location.href =  "https://www.policies365.com";
              }else{
                    $window.location.href =  "http://uat.policies365.com";
              }  
            }else {
                console.log('$rootScope.affilateURL is: ',$rootScope.affilateURL);
                $window.location.href = $rootScope.affilateURL;
            }
        };

        $scope.isFromMobileApp = localStorage.getItem("isFromMobileApp");
        if ($scope.isFromMobileApp) {
            var proposalId = $location.search().proposalId;
            RestAPI.invoke("proposalDataReader", {
                proposalId: proposalId,
                businessLineId: 3
            }).then(function(response) {


                if (response.responseCode = 1000) {
                    $scope.policyInfo = {
                        carrierId: response.data.PolicyTransaction.carrierId,
                        registrationNo: response.data.PolicyTransaction.proposalRequest.vehicleDetails.registrationNumber,
                        policyNo: response.data.PolicyTransaction.carPolicyResponse.policyNo,
                        idv: response.data.PolicyTransaction.proposalRequest.premiumDetails.insuredDeclareValue,
                        ncb: response.data.PolicyTransaction.proposalRequest.premiumDetails.ncbPercentage,
                        vehicle: response.data.PolicyTransaction.proposalRequest.vehicleDetails.make + " " + response.data.PolicyTransaction.proposalRequest.vehicleDetails.model + " " + response.data.PolicyTransaction.proposalRequest.vehicleDetails.variant,
                        email: response.data.PolicyTransaction.proposalRequest.proposerDetails.emailId,
                        transactionId: response.data.PolicyTransaction.proposalId,
                        premium: response.data.PolicyTransaction.proposalRequest.premiumDetails.grossPremium,
                        validity: response.data.PolicyTransaction.policyStartDate + " to " + response.data.PolicyTransaction.policyExpiryDate,
                        mobileNo: response.data.PolicyTransaction.proposalRequest.proposerDetails.mobileNumber
                        
                    }
                }

            })

        } else {
            loadDatbase(function() {
                // Setting application labels to avoid static assignment.
                if (idepProdEnv) {
                    $rootScope.modalSurvey = true;
                }
                if (wordPressEnabled) {
                    $rootScope.wordPressEnabled = wordPressEnabled;
                    $rootScope.wp_path = wp_path;
                } else {
                    $rootScope.wp_path = '';
                }
                $scope.p365Labels = carPolicyLabels;
                if(policies365Details){
                $scope.policies365Details = policies365Details;
                }else{
                    console.log('retrieving p365 labels using UI');
                $scope.policies365Details =p365UIVar;
                }
                $rootScope.title = $scope.p365Labels.policies365Title.PaySuccess;

                // get the proposal id from the link 
                if ($location.search().proposalId) {
                    proposalId = $location.search().proposalId;
                    console.log('proposal id found ..');
                } else if ($location.search().proposalNo) {
                    proposalId = $location.search().proposalNo;
                    console.log('proposal number found ..');
                } else if(localStorageService.get("proposalIdEncrypted")){
                    proposalId = localStorageService.get("proposalIdEncrypted") ;
                }
                //Check for the proposal Id .
                if (proposalId) {
                    // Create request to get proposal docume
                    var proposalDocParam = {}
                     proposalDocParam.proposalId = proposalId;
                     proposalDocParam.businessLineId = 3;
                        // Read the proposal documnet
                    RestAPI.invoke("proposalDataReader",proposalDocParam).then(function(proposalDataResponse) {
                        if (proposalDataResponse.responsecode == $scope.p365Labels.responseCode.success) {
                            $scope.proposalDataResponse = proposalDataResponse.data.PolicyTransaction;
                            //attaching userName in payment url for POSP
                             $scope.sendPolicySuccessEmail();
                            console.log('$scope.proposalDataResponse in car pay success', $scope.proposalDataResponse);
                            if ($scope.proposalDataResponse.requestSource) {
                                if ($scope.proposalDataResponse.requestSource == 'posp') {
                                    $location.search("userName", $scope.proposalDataResponse.userName);
                                }
                            }

                            console.log('imauticAutomation flag is: ',imauticAutomation);
                            //added by gauri for mautic application
                            if ($scope.proposalDataResponse.carPolicyResponse.policyNo) {
                                console.log('inside if block as policy number found');
                                if (imauticAutomation == true) {
                                    imatEvent('PaymentGenerated');
                                }
                            } else {
                                console.log('inside else block as no policy number found');
                                if (imauticAutomation == true) {
                                    imatEvent('PaymentSuccess');
                                }
                            }

                            // for storing the proposl request 
                            $scope.carProposeFormDetails = $scope.proposalDataResponse.proposalRequest;

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
                            $scope.callbackApi();               
                        } else {
                            // If screen are not present in DB. Show Error Message and redirect to instant quote screen (home page).             
                            $scope.loading = false;
                            $scope.callbackApi();
                            $rootScope.P365Alert("Policies365", "Some error Occurred ", "Ok");
                        }

                    });
                };

                /*var createCarPolicyParam = {};
				createCarPolicyParam.transactionStausInfo = {};
				createCarPolicyParam.carrierId = $scope.carProposeFormDetails.carrierId;
				createCarPolicyParam.productId = $scope.carProposeFormDetails.productId;
				createCarPolicyParam.businessLineId = 3;
				createCarPolicyParam.transactionStausInfo = $location.search();
				createCarPolicyParam.transactionStausInfo.transactionStatusCode = 1;
				createCarPolicyParam.transactionStausInfo.proposalId = $scope.carReponseToken.proposalId;
	
				getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.createCarPolicy, createCarPolicyParam, function(createPolicyDoc){
					$scope.loading = false;
					if(createPolicyDoc.responseCode == $scope.globalLabel.responseCode.success){
						$scope.showSuccessScreen = true;
						if(String($scope.carReponseToken.policyNo) == "undefined" || $scope.carReponseToken.policyNo == null){
							$scope.carReponseToken.policyNo = createPolicyDoc.data.policyNo;				
						}
					}else{
						$scope.showSuccessScreen = false;
						$location.path("/payfailurecar");
					}
				});*/

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
                   authenticateUserParam.mobileNumber = $scope.carProposeFormDetails.proposerDetails.mobileNumber;
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
                };

                $scope.resendOTP = function() {
                    var validateLoginParam = {};
                    validateLoginParam.paramMap = {};
                    validateLoginParam.mobileNumber = $scope.carProposeFormDetails.proposerDetails.mobileNumber;
                    validateLoginParam.funcType = $scope.p365Labels.functionType.optAuth;
                    validateLoginParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateLoginParam, function(createOTP) {
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
                //	});
            });

        }

    }]);