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
angular.module('payFailureCar', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('payFailureCarController', ['RestAPI', '$scope', '$rootScope', '$location', '$window', '$http', 'localStorageService', '$timeout', '$sce', function(RestAPI, $scope, $rootScope, $location, $window, $http, localStorageService, $timeout, $sce) {
        console.log('agencyPortalEnabled flag is : ',agencyPortalEnabled);
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
        if(agencyPortalEnabled){
    		$scope.agencyPortalEnabled = agencyPortalEnabled;
            }
            if($location.search().source){
                if($location.search().source == 'posp'){
                    pospBackButtonEnabled = true;
                }
            }

            
            $scope.callbackApi = function() {
                if (localStorage.getItem('rampUniqueId') && localStorage.getItem('rampRedirectURL')) {
                    var  rampUniqueId = localStorage.getItem('rampUniqueId');
                    var  rampRedirectURL = localStorage.getItem('rampRedirectURL');
                   
                  var policyDetails = {"rampUniqueId":rampUniqueId,"policyDetails":{"status":"failure"}};
                   console.log('redirection url is:'+JSON.stringify(policyDetails));
                     // ramp api integration
                     var reqObj={
                         method:"POST",
                         url: rampRedirectURL,
                         headers:{'Content-Type':'text/plain'},
                        data :  policyDetails};
               $http(reqObj).
               success(function(callback, status) {
                   console.log('ramp api response is: ',callback);
               })
                   .error(function(data, status) {
                     console.log('ramp api response in error is: ',data);
                   });
                     //api integration end
                    //window.location.href = rampRedirectURL+"?"+'Details:'+JSON.stringify(policyDetails);    
             }
             if (localStorage.getItem('desiSkillUniqueId')) {
                var  desiSkillUniqueId = localStorage.getItem('desiSkillUniqueId');
                var desiSkillAgentId = localStorage.getItem('desiSkillAgentId');
                var policyNo ;
                var selectedMake = "";
                var selectedModel = "";
                var selectedVariant = "";
                var selectedVehicleDetails = {};
                if($scope.proposalDataResponse){
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
            };

            $scope.sendSMS = function(){
                var validateAuthParam = {};
                validateAuthParam.paramMap = {};
                validateAuthParam.mobileNumber = $scope.proposalDataResponse.proposalRequest.proposerDetails.mobileNumber;
                validateAuthParam.paramMap.firstName = $scope.proposalDataResponse.proposalRequest.proposerDetails.firstName;
                validateAuthParam.funcType = "ProposalFailed";
               
                getDocUsingParam(RestAPI,"sendSMS", validateAuthParam, function (createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.callbackApi();
                        console.log('sms sent successfully for payment success');
                    } else {
                        $scope.callbackApi();
                        console.log('unable to  sent sms for payment success');
                    }
                });
            }

            $scope.sendPolicySuccessEmail = function(){
                var proposalDetailsEmail = {};
                proposalDetailsEmail.paramMap = {};
            
                proposalDetailsEmail.funcType = "ProposalFailureTemplate";
                console.log('$scope.proposalDataResponse is: ',$scope.proposalDataResponse);
                proposalDetailsEmail.username = $scope.proposalDataResponse.proposalRequest.proposerDetails.emailId.trim();
                //proposalDetailsEmail.isBCCRequired = 'Y';
                proposalDetailsEmail.paramMap.customerName = $scope.proposalDataResponse.proposalRequest.proposerDetails.firstName.trim() + " " +$scope.proposalDataResponse.proposalRequest.proposerDetails.lastName.trim();
                 proposalDetailsEmail.paramMap.selectedPolicyType = "Car";
                RestAPI.invoke("sendEmail", proposalDetailsEmail).then(function (emailResponse) {
                    if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.sendSMS();
                    } else {
                        $scope.sendSMS();
                    }
                });  
            }
    	$scope.redirectURL = function() {
    		if(localStorage.getItem('rampUniqueId') && localStorage.getItem('rampRedirectURL')){
				var rampUniqueId = localStorage.getItem('rampUniqueId');
                var rampRedirectURL =localStorage.getItem('rampRedirectURL');
                // var policyDetails = "{"+"rampUniqueId:"+rampUniqueId+","+"policyDetails"+":"+"{status:failure}"+"}"
                // console.log('redirection url is:'+JSON.stringify(policyDetails));
                // window.location.href = rampRedirectURL+"?"+'Details:'+JSON.stringify(policyDetails);
                window.location.href = rampRedirectURL;
             } 
             else if(localStorage.getItem('carEagerUniqueId')){
                var thirdPartyRedirectionURL = "http://13.233.36.16:4000/api/job/callback/new/policy/?registration_no="+$scope.proposalDataResponse.proposalRequest.vehicleDetails.registrationNumber+"&"+"policy_holder="+$scope.proposalDataResponse.proposalRequest.proposerDetails.firstName+"&"+"insurance_company="+$scope.proposalDataResponse.proposalRequest.premiumDetails.insuranceCompany+"&policy_no="+$scope.proposalDataResponse.carPolicyResponse.policyNo+"&premium="+$scope.proposalDataResponse.proposalRequest.premiumDetails.grossPremium+"&expire="+$scope.proposalDataResponse.proposalRequest.insuranceDetails.policyEndDate+"&cashless=Yes"+"&policy_type="+$scope.proposalDataResponse.proposalRequest.insuranceDetails.insuranceType+"&UniqueId="+localStorage.getItem("carEagerUniqueId");
                console.log('thirdPartyRedirectionURL is::',thirdPartyRedirectionURL);
                $window.location.href = $sce.trustAsResourceUrl(thirdPartyRedirectionURL);         
            }else if(pospBackButtonEnabled){
                $window.location.href = "http://pospuat.policies365.com";   
             }else if(agencyPortalEnabled){
                //   if(idepProdEnv){
                //     $window.location.href =  "https://iagency.policies365.com/#/login";
                // }else{
                //     $window.location.href =  "http://uagency.policies365.com/#/login";
                // } 
                if(idepProdEnv){
                    $window.location.href =  "https://www.policies365.com";
              }else{
                    $window.location.href =  "http://uat.policies365.com";
              } 
			}else{
                $window.location.href =  $rootScope.affilateURL;
            }
            };
    	loadDatbase(function() {
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

            $rootScope.displayTimer = function(maxDuration) {
                var timer = maxDuration;
                $timeout(function() {
                    $rootScope.displayTime = maxDuration - 1;
                    maxDuration--;
                    if ($rootScope.displayTime == 1) {
                        $window.top.location.href = $rootScope.affilateURL;
                    }
                    if ($rootScope.displayTime > 1)
                        $rootScope.displayTimer(maxDuration);
                }, 1000)
            };

            console.log('$rootScope.affilateUser in paysucess :' + $rootScope.affilateUser);
            //added for testing affilate integration on UAT.
            if ($rootScope.affilateRedirection && !idepProdEnv) {
                $rootScope.displayTime = 10;
                //if(!idepProdEnv)
                $rootScope.displayTimer($scope.displayTime);
            }

            //$http.get(wp_path+'ApplicationLabels.json').then(function (applicationCommonLabels) {

            // var applicationLabels  = applicationCommonLabels.data;
            // localStorageService.set("applicationLabels", applicationLabels);
            // $scope.globalLabel = applicationLabels.globalLabels;
            $scope.p365Labels = carPolicyLabels;
            if (policies365Details) {
                $scope.policies365Details = policies365Details;
            } else {
                console.log('retrieving p365 labels using UI');
                $scope.policies365Details = p365UIVar;
            }
            /*if($scope.globalLabel.applicationLabels.common.surveyFailure	== true){
				$rootScope.modalSurvey = true;
		
			}*/         
            $scope.statusCode = ($location.search().statusCode) ? $location.search().statusCode : undefined;

           // $rootScope.loaderContent = { businessLine: '3', header: 'Car Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbPayFailure) };
            $rootScope.title = $scope.p365Labels.policies365Title.PayFailure;


            console.log("Car Common Labels Received.");

            //$scope.carProposeFormDetails = localStorageService.get("carProposeFormDetails");
           // console.log("Car Proposal Form Param Received. : " + JSON.stringify($scope.carProposeFormDetails));
            $scope.carReponseToken = localStorageService.get("carReponseToken");
            console.log("Car Proposal Submission Response Received. : " + JSON.stringify($scope.carReponseToken));
            var quoteUserInfo = localStorageService.get("quoteUserInfo");
            console.log("Car Quote User Info Received. : " + JSON.stringify($scope.quoteUserInfo));
            if (quoteUserInfo) {
                messageIDVar = quoteUserInfo.messageId;
                $scope.$apply();
            }
            var proposalId = '' ;
            if ($location.search().proposalId) {
                proposalId = $location.search().proposalId;
            }else if($scope.carReponseToken){
                if($scope.carReponseToken.proposalId){
                proposalId = $scope.carReponseToken.proposalId ;
                }
            }
            // Create request to get proposal document
            if(proposalId){
            var proposalDocParam = {}
            proposalDocParam.proposalId = proposalId;
            proposalDocParam.businessLineId = 3;
            // Read the proposal documnet
            RestAPI.invoke("proposalDataReader", proposalDocParam).then(function (proposalDataResponse) {
                
                if (proposalDataResponse.responsecode == $scope.p365Labels.responseCode.success) {
                    var proposalDataResponse = proposalDataResponse.data.PolicyTransaction;
                    $scope.proposalDataResponse = proposalDataResponse;
                    //attaching userName in payment url for POSP
                    $scope.sendPolicySuccessEmail();
                    console.log('$scope.proposalDataResponse in car failure', proposalDataResponse);
                    if (proposalDataResponse.requestSource) {
                        if (proposalDataResponse.requestSource == 'posp') {
                            $location.search("userName", proposalDataResponse.userName);
                        }
                    }
                    $scope.loading = false;
                }else{
                    $scope.callbackApi();
                }
                
            });
        }else{
                $scope.callbackApi();
        }
            //});
        });
        //added by gauri for mautic application
        if (imauticAutomation == true) {
            imatEvent('PaymentFailure');
        }
    }]);