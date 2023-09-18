/*
 * Description	: This controller file for car proposal response data result.
 * Author		: Sayli Boralkar
 * Date			: 21 Aug 2017
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */
// var messageIDVar;
angular.module('proposalresdatacar', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('proposalResponseDataCarController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function ($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce) {
        loadDatbase(function () {
            $scope.carProposalSectionHTML = wp_path + 'buy/car/html/CarProposalSection.html';
            $scope.p365Labels = carProposalLabels;
          
            $rootScope.loading = true;
            $scope.saveProposal = false;
            $scope.saveNomineeDetails = false;
            $scope.savePrevPolicyDetails = false;
            $scope.modalPropScreenError = false;
            $scope.modalPrevPolExpiredError = false;
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = false;
            $scope.screenFourStatus = false;
            $scope.redirectForPayment = false;
            $scope.alreadyExpiredPolicyError = false;
            $scope.breakInInspectionStatus = false;
            $scope.submitProposalClicked = false;
            $scope.accordion = '1';
            //added for break in inspection 
            var inspectionNumber;

            $scope.proposerDetails = {};
            $scope.proposerDetails.communicationAddress = {};
            $scope.vehicleDetails = {};
            $scope.vehicleDetails.registrationAddress = {};
            $scope.organizationDetails = {};

            if (!$rootScope.customEnvEnabled) {
                $rootScope.customEnvEnabled = customEnvEnabled;
            }if (!$rootScope.baseEnvEnabled) {
                $rootScope.baseEnvEnabled = baseEnvEnabled;
            }

            //function created to send vehicle details in proposal request
        $scope.createCarVehicleDetailsRequest = function (){
            var vehicleDetailRequest = {};
            vehicleDetailRequest.registrationAddress = {};
            vehicleDetailRequest.registrationAddress.regDoorNo = $scope.vehicleDetails.registrationAddress.regDoorNo;
            vehicleDetailRequest.purchasedLoan = $scope.vehicleDetails.purchasedLoan;
            vehicleDetailRequest.engineNumber = $scope.vehicleDetails.engineNumber;
            vehicleDetailRequest.isVehicleAddressSameAsCommun = $scope.vehicleDetails.isVehicleAddressSameAsCommun;
            vehicleDetailRequest.chassisNumber = $scope.vehicleDetails.chassisNumber;
            vehicleDetailRequest.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();;
            if($scope.vehicleDetails.vehicleLoanType){
            vehicleDetailRequest.vehicleLoanType = $scope.vehicleDetails.vehicleLoanType;
            }if($scope.vehicleDetails.financeInstitution){
            vehicleDetailRequest.financeInstitution = $scope.vehicleDetails.financeInstitution;
            }if($scope.vehicleDetails.financeInstitutionCode){
            vehicleDetailRequest.financeInstitutionCode = $scope.vehicleDetails.financeInstitutionCode;
            }
            if($scope.vehicleDetails.monthlyMileage){
            vehicleDetailRequest.monthlyMileage = $scope.vehicleDetails.monthlyMileage;
            }
            if(inspectionNumber){
            vehicleDetailRequest.inspectionReferenceNo = inspectionNumber; 
            }
            vehicleDetailRequest.registrationAddress.regCity = $scope.vehicleDetails.registrationAddress.regCity;
            vehicleDetailRequest.registrationAddress.regDisplayArea =$scope.vehicleDetails.registrationAddress.regDisplayArea;
            vehicleDetailRequest.registrationAddress.regPincode = $scope.vehicleDetails.registrationAddress.regPincode;
            vehicleDetailRequest.registrationAddress.regState = $scope.vehicleDetails.registrationAddress.regState;
            vehicleDetailRequest.registrationAddress.regArea = $scope.vehicleDetails.registrationAddress.regArea;
            vehicleDetailRequest.registrationAddress.regDistrict = $scope.vehicleDetails.registrationAddress.regDistrict;
            vehicleDetailRequest.registrationAddress.regDisplayField = $scope.vehicleDetails.registrationAddress.regDisplayField;
            $scope.carProposeFormDetails.vehicleDetails = vehicleDetailRequest;
        }

            $scope.editPesonalInfo = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = false;
                $scope.accordion = '1';
                $scope.disableAllFields();
            }

            $scope.editNomineeInfo = function () {
                $scope.screenOneStatus = false;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = false;
                $scope.accordion = '2';
                $scope.disableAllFields();
            }
            $scope.editPrevPolicyInfo = function () {
                $scope.screenOneStatus = false;
                $scope.screenTwoStatus = false;
                $scope.screenThreeStatus = true;
                $scope.accordion = '3';
                $scope.disableAllFields();
            }
            $scope.Section2Inactive = true;
            $scope.Section3Inactive = true;
            $scope.Section4Inactive = true;

            $scope.submitPersonalDetails = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = false;
                $scope.screenFourStatus = false;
                $scope.Section2Inactive = false;
                $scope.accordion = '2';
                $scope.disableAllFields();

                //added by gauri for imautic
                if (imauticAutomation == true) {
                    imatEvent('ProposalFilled');
                }
               
                if ($scope.organizationDetails.contactPersonName) {
                    if ($scope.organizationDetails.contactPersonName.indexOf(' ') >= 0) {
                        $scope.proposerDetails.firstName = $scope.organizationDetails.contactPersonName.split(' ')[0];
                        $scope.proposerDetails.lastName = $scope.organizationDetails.contactPersonName.split(' ')[1];
                    }
                }
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.ownerDetailsForm.$dirty || $scope.changeCompanyName) {
                        //	$scope.responseProduct.proposalRequest.premiumDetails=$scope.premiumDetails;
                        $scope.responseProduct.proposalRequest.proposerDetails = $scope.proposerDetails;
                        $scope.responseProduct.proposalRequest.insuranceDetails = $scope.insuranceDetails;
                        if ($scope.vehicleDetailsForm.$dirty)
                            $scope.responseProduct.vehicleDetails = $scope.vehicleDetails;
                        // call a function to submit proposal for save purpose
                        $scope.saveProposal = true;
                        $scope.submitProposalData();
                        $scope.ownerDetailsForm.$setPristine();
                        $scope.changeCompanyName = false;

                    }
                }
                /*		var temp = {};
                		if(String($scope.nominationDetails) === String(temp)){
                			$scope.nomineeDetailsForm.dateOfBirth.$setValidity('dateOfBirth',false);
                			$scope.nomineeDetailsForm.firstName.$setValidity('firstName',false); 
                			$scope.nomineeDetailsForm.lastName.$setValidity('lastName',false);
                		}*/
            }
            $scope.submitAddressDetails = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = false;
                $scope.screenFiveStatus = false;
                $scope.Section3Inactive = false;
                $scope.accordion = '3';
            }

            $scope.submitNomineeDetails = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                if ($scope.previousPolicyStatus) {
                    $scope.screenFourStatus = true;
                    $scope.screenFiveStatus = false;
                    $scope.Section3Inactive = false;
                    $scope.accordion = '4';
                } else {
                    $scope.screenFourStatus = false;
                    $scope.screenFiveStatus = true;
                    $scope.proceedPaymentStatus = true;
                    $scope.Section4Inactive = false;
                    $scope.accordion = '5';
                    $scope.disableAllFields();
                }

                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {

                    if (!$scope.responseProduct.proposalRequest.nominationDetails || $scope.nomineeDetailsForm.$dirty) {
                        $scope.saveProposal = true;
                        $scope.saveNomineeDetails = true;
                        $scope.savePrevPolicyDetails = false;
                        $scope.responseProduct.proposalRequest.nominationDetails = $scope.nominationDetails;
                        $scope.responseProduct.proposalRequest.appointeeDetails = $scope.appointeeDetails;
                        /* call a function to submit proposal for save purpose*/
                        $scope.submitProposalData();
                        $scope.nomineeDetailsForm.$setPristine();
                    }
                }

            }
            $scope.submitPrevPolicyDetails = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = true;
                $scope.screenFiveStatus = true;
                $scope.proceedPaymentStatus = true;
                $scope.Section5Inactive = false;
                $scope.accordion = '5';
                $scope.disableAllFields();

                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if (!$scope.responseProduct.proposalRequest.insuranceDetails.policyNumber || $scope.prevPolicyDetailsForm.$dirty) {
                        $scope.saveProposal = true;
                        $scope.saveNomineeDetails = true;
                        $scope.savePrevPolicyDetails = true;
                        $scope.responseProduct.proposalRequest.insuranceDetails = $scope.insuranceDetails;
                        /* call a function to submit proposal for save purpose*/
                        $scope.submitProposalData();
                        $scope.prevPolicyDetailsForm.$setPristine();

                    }
                }
            };

            $scope.disableAllFields = function () {
                if ($scope.proposalStatus) {
                    if ($scope.proposalStatus.statusPaym == "completed") {
                        setTimeout(function () {
                            $('form md-option').attr('disabled', 'disabled');
                            $('form md-select').attr('disabled', 'disabled');
                            $('input').attr('disabled', 'disabled');
                            $('md-radio-button').attr('disabled', 'disabled');
                            $('md-checkbox').attr('disabled', 'disabled');
                            $scope.vehicleDetailsForm.$invalid = true;
                        }, 1000);
                    }
                }
            }
            $scope.sendSMS = function(){
                var validateAuthParam = {};
                validateAuthParam.paramMap = {};
                validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                validateAuthParam.paramMap.firstName = $scope.proposerDetails.firstName;
                validateAuthParam.funcType = "ProposalFilled";
                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function (createOTP) {
                   if(!$scope.submitProposalClicked){
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.redirectToPaymentGateway();
                    } else {
                        $scope.redirectToPaymentGateway();
                    }
                }
                });
            }       

$scope.sendPaymentSuccessEmail = function(){
    var proposalDetailsEmail = {};
    proposalDetailsEmail.paramMap = {};

    proposalDetailsEmail.funcType = "ProposalDetailsTemplate";
    if($scope.shortenURL){
        proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;
    }else{
        $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";  
        proposalDetailsEmail.paramMap.url = $scope.longURL;   
    }
    proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
    //proposalDetailsEmail.isBCCRequired = 'Y';
    proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
     proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.car;
    
    RestAPI.invoke($scope.p365Labels.transactionName.sendEmail, proposalDetailsEmail).then(function (emailResponse) {
        if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
            $scope.sendSMS();
        } else {
            //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emapilSentFailed, "Ok");
            //$scope.loading = false;
            $scope.sendSMS();
        }
    });  
}
           
        $scope.hideModalIPOS = function () {
                $scope.modalIPOS = false;
                if ($scope.redirectForPayment == true) {
                    $scope.sendPaymentSuccessEmail();
                    // $scope.redirectToPaymentGateway();
                }
            };

            $scope.hideModalAP = function () {
                $scope.modalAP = false;
            };

            $scope.resetCommunicationAddress = function () {            
                if (String($scope.proposerDetails.communicationAddress.comDisplayArea) == "undefined" || $scope.proposerDetails.communicationAddress.comDisplayArea.length == 0) 
                {
                  $scope.proposerDetails.communicationAddress.comPincode = "";
                  $scope.proposerDetails.communicationAddress.comState = "";
                  $scope.proposerDetails.communicationAddress.comCity = "";               
                  $scope.proposerDetails.communicationAddress.comDoorNo = "";
                }
             };
     
             $scope.resetRegistrationAddress = function () {
               //  if (String($scope.vehicleDetails.address) == "undefined" || $scope.vehicleDetails.address.length == 0) 
                 if (String($scope.vehicleDetails.registrationAddress.regDisplayArea) == "undefined" || $scope.vehicleDetails.registrationAddress.regDisplayArea.length == 0){
                  $scope.vehicleDetails.registrationAddress.regPincode = "";
                  $scope.vehicleDetails.registrationAddress.regState = "";
                  $scope.vehicleDetails.registrationAddress.regCity = "";                 
                  $scope.vehicleDetails.registrationAddress.regDoorNo = "";
                 }
             };
            $scope.PolicyTransaction = {};
            $scope.proposerDetails = {};
            $scope.proposerDetails.communicationAddress = {};
            $scope.proposalRequest = {};
            $scope.productType = {};
            $scope.carrierPolicyUpdateReq = {};
            $scope.communicationAddress = {};
            $scope.nominationDetails = {};
            $scope.vehicleDetails = {};
            $scope.vehicleDetails.registrationAddress = {};
            $scope.carProposalResponse = {};
            $scope.paymentResponse = {};
            $scope.carPolicyResponse = {};
            $scope.vehicleInfo = {};
            $scope.nominationInfo = {};
            $scope.appointeeInfo = {};
            $scope.appointeeDetails = {};
            $scope.previousPolicyStatus = {};
            $scope.authenticate = {}
            $scope.vehicleInfo.insuranceType = {}
            $scope.vehicleDetails.RTOCode = {}
            $scope.insuranceDetails = {};
            $scope.selectedProduct = {};
            $scope.proposerInfo = {};
            $scope.proposerInfo.drivingExp = {};
            $scope.proposerInfo.vehicleDrivenOn = {};
            $scope.quoteUserInfo = {};

            $scope.request = {};
            $scope.request.proposalId = $location.search().proposalId;
            $scope.request.businessLineId = $scope.p365Labels.businessLineType.car;

            $scope.premiumDetails = {};
            $scope.selectedProductInputParam = [];
            $scope.selectedProductInputParam.vehicleInfo = [];
            $scope.relationList = [];
            $scope.nominationInfo = [];
            /*$scope.nomineeDetailsForm = {};*/
            $scope.proposalStatus = [];
            $scope.insuranceInfo = [];
            $scope.undertakingStatus = [];
            $scope.proposalStatusForm = [];
            $scope.carProposeFormDetails = {};

            $scope.genderType = genderTypeGeneric;
            $scope.maritalStatusType = maritalStatusListGeneric;
            $scope.purchasedLoanStatus = purchasedLoanStatusGeneric;
            $scope.vehicleLoanTypes = vehicleLoanTypes;
            $scope.drivingExpYearsList = drivingExperienceYears;
            $scope.vehicleDrivenOnList = vehicleDrivenPlaces;
            $scope.ncbList = buyScreenNcbList;
            $scope.mileageList = buyScreenMileageList;
            $scope.automobileMembershipList = automobileMembershipTypes;
            $scope.policyTypes = policyTypesGeneric;

            //added to apply different position to back button in ipos/iquote for website/posp
            if (pospEnabled) {
                $scope.pospEnabled = pospEnabled;
            }

            $scope.carQuoteRequestFormation = function (carQuoteRequestParam) {
                $scope.quote = {};
               $scope.quote.vehicleInfo={};
               $scope.quote.quoteParam={};
               
               $scope.quote.vehicleInfo.IDV = carQuoteRequestParam.vehicleInfo.IDV;
               $scope.quote.vehicleInfo.PreviousPolicyExpiryDate = carQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
               $scope.quote.vehicleInfo.TPPolicyExpiryDate = carQuoteRequestParam.vehicleInfo.TPPolicyExpiryDate;
                $scope.quote.vehicleInfo.TPPolicyStartDate = carQuoteRequestParam.vehicleInfo.TPPolicyStartDate;
               $scope.quote.vehicleInfo.RTOCode = carQuoteRequestParam.vehicleInfo.RTOCode;
               $scope.quote.vehicleInfo.city = carQuoteRequestParam.vehicleInfo.city;
               if(carQuoteRequestParam.vehicleInfo.dateOfRegistration){
                   $scope.quote.vehicleInfo.dateOfRegistration = carQuoteRequestParam.vehicleInfo.dateOfRegistration;
              }
              $scope.quote.vehicleInfo.idvOption = carQuoteRequestParam.vehicleInfo.idvOption;
              $scope.quote.vehicleInfo.best_quote_id = carQuoteRequestParam.vehicleInfo.best_quote_id;
              $scope.quote.vehicleInfo.previousClaim = carQuoteRequestParam.vehicleInfo.previousClaim;
              $scope.quote.vehicleInfo.registrationNumber = carQuoteRequestParam.vehicleInfo.registrationNumber;
              $scope.quote.vehicleInfo.registrationPlace = carQuoteRequestParam.vehicleInfo.registrationPlace;
              $scope.quote.vehicleInfo.state = carQuoteRequestParam.vehicleInfo.state;
              if(carQuoteRequestParam.vehicleInfo.make){
              $scope.quote.vehicleInfo.make = carQuoteRequestParam.vehicleInfo.make;
              } else if(carQuoteRequestParam.vehicleInfo.name){
              $scope.quote.vehicleInfo.make = carQuoteRequestParam.vehicleInfo.name;
              }
              $scope.quote.vehicleInfo.model = carQuoteRequestParam.vehicleInfo.model;
              if(carQuoteRequestParam.vehicleInfo.variant){
              $scope.quote.vehicleInfo.variant = carQuoteRequestParam.vehicleInfo.variant.toString();
              }
              $scope.quote.vehicleInfo.fuel = carQuoteRequestParam.vehicleInfo.fuel;
              $scope.quote.vehicleInfo.cubicCapacity = carQuoteRequestParam.vehicleInfo.cubicCapacity;
              
              $scope.quote.quoteParam.ncb = carQuoteRequestParam.quoteParam.ncb;
              $scope.quote.quoteParam.ownedBy = carQuoteRequestParam.quoteParam.ownedBy;
              $scope.quote.quoteParam.policyType = carQuoteRequestParam.quoteParam.policyType;
              $scope.quote.quoteParam.riders = carQuoteRequestParam.quoteParam.riders;
           }

            RestAPI.invoke("proposalDataReader", $scope.request).then(function (proposalDataResponse) {
                if (proposalDataResponse.responsecode == $scope.p365Labels.responseCode.success) {
                    $scope.responseProduct = proposalDataResponse.data.PolicyTransaction;
                    $rootScope.responseProduct = proposalDataResponse.data.PolicyTransaction;

                    //flag for expired policy case
                    if (proposalDataResponse.data.PolicyTransaction.breakInInspectionStatus) {
                        $scope.breakInInspectionStatus = proposalDataResponse.data.PolicyTransaction.breakInInspectionStatus;
                    }
					/**
                     * This block of code is responsible to updated iquote and ipos urls.
                     */
                    if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                        $rootScope.iquoteRedirectionURL = '/sharefromAPI';
                        $scope.isIquoteEnabled = false;
                        $rootScope.iquoteRequestParam = { lob: $scope.p365Labels.businessLineType.bike, createLeadFlag: $location.search().createLeadFlag, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName };

                        if ($scope.responseProduct.encryptedQuoteId) {
                            $rootScope.iquoteRequestParam.docId = $scope.responseProduct.encryptedQuoteId;
                        } else {
                            $rootScope.iquoteRequestParam.docId = $scope.responseProduct.QUOTE_ID;
                        }

                        $rootScope.iposRedirectionURL = "/proposalresdata";
                        $rootScope.iposRequestParam = { proposalId: $location.search().proposalId, messageId: $location.search().messageId, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName };

                        $rootScope.mainTabsMenu = [{ url: $rootScope.iquoteRedirectionURL, requestParam: $rootScope.iquoteRequestParam, className: 'iQuoteTab tabs wp_border32', name: 'iquote', title: "iQuote", active: $scope.isIquoteEnabled },
                        { url: $rootScope.iposRedirectionURL, requestParam: $rootScope.iposRequestParam, className: 'iPosTab tabs wp_border32', name: 'ipos', title: "iPos", active: !$scope.isIquoteEnabled }];
                    }
                    /**
                      *iquote and ipos urls updation code ends here.
                      */

                    $scope.carProposeFormDetails.carrierId = $scope.responseProduct.carrierId;
                    $scope.carProposeFormDetails.productId = $scope.responseProduct.productId;
                    $scope.carProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                    //$scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.responseProduct.encryptedQuoteId;
                    $scope.carProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.car;
                    messageIDVar = $scope.responseProduct.messageId;
                    // Adding campaign from proposal
                    campaign_id = $scope.responseProduct.campaign_id;
                    requestSource = $scope.responseProduct.requestSource;
                    sourceOrigin = $scope.responseProduct.source;
                    $scope.selectedProduct.userName = $scope.responseProduct.userName;
                    $scope.selectedProduct.agencyId = $scope.responseProduct.agencyId;
                    $scope.carProposeFormDetails.agencyId = $scope.responseProduct.agencyId;
                    $scope.carProposeFormDetails.userName = $scope.responseProduct.userName;
                   //$scope.carProposeFormDetails.requestType = $scope.p365Labels.request.carPropRequestType;

                    $scope.selectedProduct.grossPremium = $scope.responseProduct.proposalRequest.premiumDetails.grossPremium;
                   // $scope.premiumDetails.insuranceCompany = $scope.responseProduct.proposalRequest.premiumDetails.insuranceCompany;

                    if ($scope.responseProduct.referralCode) {
                        $scope.referralCode = $scope.responseProduct.referralCode;
                    }
                    var buyScreenParam = {};
                    buyScreenParam.documentType = "proposalScreenConfig";
                    buyScreenParam.businessLineId = Number($scope.p365Labels.businessLineType.car);
                    buyScreenParam.carrierId = $scope.responseProduct.carrierId;
                    buyScreenParam.productId = $scope.responseProduct.productId;

                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.productDataReader, buyScreenParam, function (buyScreen) {
                        if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {
                            var buyScreens = buyScreen.data;
                            $scope.ownerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                            $scope.nominationDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
                            $scope.prevPolicyDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                            $scope.vehicleDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);

                            $scope.productValidation = buyScreens.validation;
                            $scope.requestFormat = buyScreens.requestFormat;
                            $scope.transactionName = buyScreens.transaction.proposalService.name;
                            $scope.transactionSaveProposal = "saveProposalService";
                            $scope.transactionSubmitProposal = "submitProposal";
                            $scope.paymentURL = buyScreens.paymentUrl;
                            //added for hdfc
                            if ($scope.productValidation.PUCValidation) {
                                $scope.PUCValidation = true;
                            } else {
                                $scope.PUCValidation = false;
                            }

                            getDocUsingIdQuoteDB(RestAPI, $scope.carProposeFormDetails.QUOTE_ID, function (quoteCalcDetails) {
                                var quoteCalcRequest = {};
                                $scope.quoteCalcResponse = [];

                                $scope.quoteCalcResponse = quoteCalcDetails.carQuoteResponse;
                                quoteCalcRequest = quoteCalcDetails.carQuoteRequest;
                                $scope.vehicleInfoCopy = quoteCalcRequest.vehicleInfo;
                               
                                if(quoteCalcDetails.carQuoteRequest.systemPolicyStartDate){
                                    $scope.policyStartDate = quoteCalcDetails.carQuoteRequest.systemPolicyStartDate.sysPolicyStartDate;
                                    $scope.policyEndDate = quoteCalcDetails.carQuoteRequest.systemPolicyStartDate.sysPolicyEndDate;
                                    }
                                    $scope.vehicleInfoCopy = quoteCalcRequest.vehicleInfo;
                                   // $scope.vehicleInfo = quoteCalcRequest.vehicleInfo;                           
                                   $scope.vehicleInfo={};
                                   $scope.vehicleInfo.IDV = quoteCalcDetails.carQuoteRequest.vehicleInfo.IDV;
                                    $scope.vehicleInfo.PreviousPolicyExpiryDate = quoteCalcDetails.carQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                    $scope.vehicleInfo.TPPolicyExpiryDate = quoteCalcDetails.carQuoteRequest.vehicleInfo.TPPolicyExpiryDate;
                                    $scope.vehicleInfo.TPPolicyStartDate = quoteCalcDetails.carQuoteRequest.vehicleInfo.TPPolicyStartDate;    
                                    $scope.vehicleInfo.RTOCode = quoteCalcDetails.carQuoteRequest.vehicleInfo.RTOCode;
                                   $scope.vehicleInfo.city = quoteCalcDetails.carQuoteRequest.vehicleInfo.city;
                                   if(quoteCalcDetails.carQuoteRequest.vehicleInfo.dateOfRegistration){
                                   $scope.vehicleInfo.dateOfRegistration = quoteCalcDetails.carQuoteRequest.vehicleInfo.dateOfRegistration;
                                   var carRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/"); 
                                   $scope.vehicleDetails.regYear = carRegistrationYearList[2] ;
                                  }
                                    $scope.vehicleInfo.idvOption = quoteCalcDetails.carQuoteRequest.vehicleInfo.idvOption;
                                    $scope.vehicleInfo.best_quote_id = quoteCalcDetails.carQuoteRequest.vehicleInfo.best_quote_id;
                                    $scope.vehicleInfo.previousClaim = quoteCalcDetails.carQuoteRequest.vehicleInfo.previousClaim;
                                    $scope.vehicleInfo.registrationNumber = quoteCalcDetails.carQuoteRequest.vehicleInfo.registrationNumber;
                                    $scope.vehicleInfo.registrationPlace = quoteCalcDetails.carQuoteRequest.vehicleInfo.registrationPlace;
                                    $scope.vehicleInfo.state = quoteCalcDetails.carQuoteRequest.vehicleInfo.state;
                                    if(quoteCalcDetails.carQuoteRequest.vehicleInfo.make){
                                    $scope.vehicleInfo.make = quoteCalcDetails.carQuoteRequest.vehicleInfo.make;
                                    }else if(quoteCalcDetails.carQuoteRequest.vehicleInfo.name){
                                    $scope.vehicleInfo.make = quoteCalcDetails.carQuoteRequest.vehicleInfo.name;
                                    }
                                    $scope.vehicleInfo.model = quoteCalcDetails.carQuoteRequest.vehicleInfo.model;
                                    if(quoteCalcDetails.carQuoteRequest.vehicleInfo.variant){
                                    $scope.vehicleInfo.variant = quoteCalcDetails.carQuoteRequest.vehicleInfo.variant.toString();
                                    }
                                    $scope.vehicleInfo.cubicCapacity = quoteCalcDetails.carQuoteRequest.vehicleInfo.cubicCapacity;
                                    $scope.vehicleInfo.fuel = quoteCalcDetails.carQuoteRequest.vehicleInfo.fuel;
                                    //$scope.quoteParam = quoteCalcRequest.quoteParam;
                                    $scope.quoteParam={};
                                    $scope.quoteParam.ncb = quoteCalcDetails.carQuoteRequest.quoteParam.ncb;
                                    $scope.quoteParam.ownedBy = quoteCalcDetails.carQuoteRequest.quoteParam.ownedBy;
                                    $scope.quoteParam.policyType = quoteCalcDetails.carQuoteRequest.quoteParam.policyType;
                                    $scope.quoteParam.riders = quoteCalcDetails.carQuoteRequest.quoteParam.riders;
                                     
                                    $scope.quote = {};
                                    $scope.quote.quoteParam = $scope.quoteParam;
                                    $scope.quote.vehicleInfo = $scope.vehicleInfo;
    
                                    $scope.prevPolDetails = {};
                                    $scope.prevPolDetails.prevPolicyStartDate = quoteCalcDetails.carQuoteRequest.vehicleInfo.PreviousPolicyStartDate;
                                    $scope.prevPolDetails.prevPolicyEndDate = $scope.vehicleInfo.PreviousPolicyExpiryDate;
                                    quoteCalcRequest.carrierId = $scope.responseProduct.carrierId;
                                    quoteCalcRequest.productId = $scope.responseProduct.productId;

                                    for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                                    if ($scope.quoteCalcResponse[i].carrierId == $scope.responseProduct.proposalRequest.premiumDetails.carrierId && $scope.quoteCalcResponse[i].productId == $scope.responseProduct.proposalRequest.premiumDetails.productId) {
                                        $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                                        $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                                        break;
                                    }
                                }

                                $scope.changeInsuranceCompany = function () {
                                    $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                                    $scope.responseProduct.proposalRequest.premiumDetails = $scope.selectedProduct;
                                    $scope.changeCompanyName = true;
                                }

                                /*	quoteCalcRequest.grossPremium = $scope.responseProduct.proposalRequest.premiumDetails.grossPremium;
                                 * 
                                 */ //reseting IDV to actual value, as instant quote is fetching wrong details - confirmed with kuldeep
                                //quoteCalcRequest.vehicleInfo.IDV = parseInt(quoteCalcRequest.quoteParam.userIdv);
                                quoteCalcRequest.quoteParam.userIdv = parseInt($scope.responseProduct.proposalRequest.premiumDetails.insuredDeclareValue);
                                localStorageService.set("carQuoteInputParamaters", quoteCalcRequest);
                                if ($scope.productValidation.reQuoteCalc) {
                                    if (!quoteCalcRequest.vehicleInfo.IDV_QUOTE_ID)
                                        quoteCalcRequest.vehicleInfo.IDV_QUOTE_ID = quoteCalcRequest.QUOTE_ID;
                                    localStorageService.set("CAR_IDV_QUOTE_ID", quoteCalcRequest.QUOTE_ID);
                                    // if ($scope.responseProduct.mobile) {
                                    //     quoteCalcRequest.mobileNumber = $scope.responseProduct.mobile;
                                    // }
                                    $scope.carQuoteRequestFormation(quoteCalcRequest);
                                    RestAPI.invoke($scope.p365Labels.getRequest.quoteCar, $scope.quote).then(function (proposeFormResponse) {

                                        $scope.carRecalculateQuoteRequest = [];
                                        if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                            $scope.responseRecalculateCodeList = [];
                                            $scope.responseProduct.QUOTE_ID = proposeFormResponse.QUOTE_ID;
                                            localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                            $scope.carRecalculateQuoteRequest = proposeFormResponse.data;

                                            $scope.quoteCalcResponse = [];
                                            angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.transactionName = $scope.p365Labels.transactionName.carQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                    success(function (callback, status) {
                                                        var carQuoteResponse = JSON.parse(callback);
                                                        $scope.responseRecalculateCodeList.push(carQuoteResponse.responseCode);
                                                        if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                            if (carQuoteResponse.data != null) {
                                                                if(carQuoteResponse.data.quotes[0]){
                                                                if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                    carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                                $scope.loading = false;
                                                                $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                                                $scope.proposalDataReader();
                                                               }
                                                            carQuoteResponse.data.quotes[0].id = carQuoteResponse.messageId;
                                                            if(Number(carQuoteResponse.data.quotes[0].grossPremium) > 0)
                                                            $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);
                                                            }
                                                        }                                                          
                                                        } else {
                                                            if (carQuoteResponse.data != null) {
                                                              if(carQuoteResponse.data.quotes[0]){
                                                              if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                                $scope.loading = false;
                                                                $scope.propScreenError = $scope.p365Labels.validationMessages.generalisedErrMsg;
                                                                $scope.modalPropScreenError = true;
                                                              }  
                                                            }
                                                        }
                                                        }
                                                    })
                                            });
                                                $scope.loading = false;
                                        } else {
                                            $scope.propScreenError = $scope.p365Labels.validationMessages.generalisedErrMsg;
                                            $scope.modalPropScreenError = true;
                                            $scope.loading = false;
                                        }
                                    });
                                } else {
                                    $scope.proposalDataReader();
                                }
                            });
                        }
                    });
                    $scope.redirectToQuote = function () {
                        $location.path("/quote");
                    }
                } else {
                    // If screen are not present in DB. Show Error Message and redirect to instant quote screen (home page).
                    $scope.loading = false;
                    var buyScreenCnfrmError = $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                    $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");;
                }
                $scope.proposalDataReader = function () {

                    getDocUsingId(RestAPI, "relationshipdetailslist", function (relationList) {
                        $scope.relationList = relationList.relationships;

                        getListFromDB(RestAPI, "", carCarrier, findAppConfig, function (carCarrierList) {
                            if (carCarrierList.responseCode == $scope.p365Labels.responseCode.success) {
                               // localStorageService.set("carCarrierList", carCarrierList.data);
                                $scope.carrierList = carCarrierList.data;
                            }
                        });
                    });

                    // if ($scope.insuranceDetails.insuranceType == 'new') {
                    //     $scope.previousPolicyStatus = false;
                    // } else {
                    //     $scope.previousPolicyStatus = true;
                    // }
                    $rootScope.loading = false;
                    if (!$scope.responseProduct.proposalRequest.insuranceDetails.policyNumber) {
                        $scope.isPolicyNumber = false;
                    };
                    // if ($scope.responseProduct.proposalRequest.PACoverDetails) {
                    //     $scope.PACoverDetails = $scope.responseProduct.proposalRequest.PACoverDetails;
                    // } else if ($scope.responseProduct.PACoverDetails) {
                    //     $scope.PACoverDetails = $scope.responseProduct.PACoverDetails;
                    // } else {
                    //     $scope.PACoverDetails = {};
                    //     $scope.PACoverDetails.isPACoverApplicable = false;
                    //     $scope.PACoverDetails.existingInsurance = true;
                    // }
                  //  localStorageService.set("CarPACoverDetails", $scope.PACoverDetails);

                    if ($scope.responseProduct.proposalRequest.insuranceDetails) {
                        //$scope.insuranceDetails = $scope.responseProduct.proposalRequest.insuranceDetails;
                        $scope.insuranceDetails.insurerName = $scope.responseProduct.proposalRequest.insuranceDetails.insurerName;
                        $scope.insuranceDetails.insuranceType = $scope.responseProduct.proposalRequest.insuranceDetails.insuranceType;
                       // $scope.insuranceDetails.isNCB = $scope.responseProduct.proposalRequest.insuranceDetails.isNCB;
                        $scope.insuranceDetails.prevPolicyType = $scope.responseProduct.proposalRequest.insuranceDetails.prevPolicyType;
                        $scope.insuranceDetails.policyNumber = $scope.responseProduct.proposalRequest.insuranceDetails.policyNumber;
                        $scope.insuranceDetails.insurerId = $scope.responseProduct.proposalRequest.insuranceDetails.insurerId;
                        $scope.insuranceDetails.ncb = $scope.responseProduct.proposalRequest.insuranceDetails.ncb;
                       
                    }
                    if ($scope.insuranceDetails.insuranceType == 'new') {
                            $scope.previousPolicyStatus = false;
                        } else {
                            $scope.previousPolicyStatus = true;
                        }
                    console.log("$scope.insuranceDetails is : ",$scope.insuranceDetails);
                    if($scope.responseProduct.personalDetailsFlag){
                    $scope.personalDetailsFlag = $scope.responseProduct.personalDetailsFlag;
                    }else{
                        $scope.personalDetailsFlag = true;  
                    }
                    if ($scope.responseProduct.organizationDetails) {
                        $scope.organizationDetails.contactPersonName = $scope.responseProduct.organizationDetails.contactPersonName;
                        $scope.organizationDetails.organizationName = $scope.responseProduct.organizationDetails.organizationName;
                    }
                    //$scope.organizationDetails.owneredBy = $scope.responseProduct.proposalRequest.owneredBy;
        
                    if ($scope.responseProduct.proposalRequest.proposerDetails) {
                    //$scope.proposerDetails = $scope.responseProduct.proposalRequest.proposerDetails;
                    if ($scope.responseProduct.proposalRequest.proposerDetails.drivingExp)
                    $scope.proposerDetails.drivingExp = $scope.responseProduct.proposalRequest.proposerDetails.drivingExp.display;
                    if ($scope.responseProduct.proposalRequest.proposerDetails.vehicleDrivenOn)
                    $scope.proposerDetails.vehicleDrivenOn = $scope.responseProduct.proposalRequest.proposerDetails.vehicleDrivenOn.name;          
                    $scope.proposerDetails.firstName = $scope.responseProduct.proposalRequest.proposerDetails.firstName;
                    $scope.proposerDetails.lastName = $scope.responseProduct.proposalRequest.proposerDetails.lastName;
                    $scope.proposerDetails.emailId = $scope.responseProduct.proposalRequest.proposerDetails.emailId;
                    $scope.proposerDetails.mobileNumber = $scope.responseProduct.proposalRequest.proposerDetails.mobileNumber;
                    $scope.proposerDetails.maritalStatus = $scope.responseProduct.proposalRequest.proposerDetails.maritalStatus;
                    $scope.proposerDetails.dateOfBirth = $scope.responseProduct.proposalRequest.proposerDetails.dateOfBirth;
                    $scope.proposerDetails.gender = $scope.responseProduct.proposalRequest.proposerDetails.gender;
                    //$scope.proposerDetails.area = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress.area;
                    $scope.proposerDetails.personAge = $scope.responseProduct.proposalRequest.proposerDetails.personAge;
                    $scope.proposerDetails.salutation = $scope.responseProduct.proposalRequest.proposerDetails.salutation;
                   // $scope.proposerDetails.doorNo = $scope.responseProduct.proposalRequest.proposerDetails.doorNo;
                    if($scope.responseProduct.proposalRequest.proposerDetails.panNumber){
                    $scope.proposerDetails.panNumber = $scope.responseProduct.proposalRequest.proposerDetails.panNumber;
                    }

                    if($scope.responseProduct.proposalRequest.proposerDetails.communicationAddress){
                    $scope.proposerDetails.communicationAddress = {};
                    $scope.proposerDetails.communicationAddress.comDisplayArea = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress.comDisplayArea;
                    $scope.proposerDetails.communicationAddress.comPincode = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress.comPincode;
                    $scope.proposerDetails.communicationAddress.comCity = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress.comCity;
                    $scope.proposerDetails.communicationAddress.comState = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress.comState;
                    $scope.proposerDetails.communicationAddress.comDoorNo = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress.comDoorNo;
                    }  
                    //for setting value for lead
                        $scope.quoteUserInfo.firstName = $scope.proposerDetails.firstName;
                        $scope.quoteUserInfo.lastName = $scope.proposerDetails.lastName;
                        $scope.quoteUserInfo.emailId = $scope.proposerDetails.emailId;
                        $scope.quoteUserInfo.mobileNumber = $scope.proposerDetails.mobileNumber;
                        $scope.quoteUserInfo.termsCondition = true;
                        localStorageService.set("quoteUserInfo", $scope.quoteUserInfo)                    
                }
                    if ($scope.previousPolicyStatus) {
                        $scope.insuranceDetails.policyNumber = $scope.responseProduct.proposalRequest.insuranceDetails.policyNumber;
                        $scope.insuranceInfo.insurerName = $scope.responseProduct.proposalRequest.insuranceDetails.insurerName;

                        if ($scope.responseProduct.proposalRequest.insuranceDetails.insurerName) {
                            var insurerName = {};
                            insurerName.carrierName = $scope.responseProduct.proposalRequest.insuranceDetails.insurerName;
                            insurerName.carrierId = $scope.responseProduct.proposalRequest.insuranceDetails.insurerId;
                            //$scope.insuranceInfo.insurerName = insurerName;
                            $scope.insuranceInfo.insurerName = insurerName;
                        }
                    } else {
                        $scope.insuranceDetails.policyNumber = "";
                        $scope.insuranceInfo.insurerName = "";
                        // $scope.insuranceDetails.prevPolicyStartDate = "";
                        // $scope.insuranceDetails.prevPolicyEndDate = "";
                        /*$scope.insuranceDetails.ncb="";
                        $scope.insuranceDetails.prevPolicyType="";*/
                    }
                    // if ($scope.responseProduct.proposalRequest.insuranceDetails.previousPolicyExpired) {
                    //     $scope.insuranceDetails.previousPolicyExpired = $scope.responseProduct.proposalRequest.insuranceDetails.previousPolicyExpired;
                    // }
                    //dynamic from product validation
                    if ($scope.selectedProduct.grossPremium) {
                        $scope.panCardStaus = Number($scope.selectedProduct.grossPremium) >= 100000 ? true : false;
                    }

                    // Below piece of code added for iPos.
                    if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                        $scope.screenOneStatus = true;
                        $scope.screenTwoStatus = true;

                        if ($scope.insuranceDetails.insuranceType == "renew") {
                            $scope.screenThreeStatus = true;
                            $scope.Section3Inactive = false;
                        }
                        $scope.screenFourStatus = true;
                        $scope.proceedPaymentStatus = true;
                        $scope.Section1Inactive = false;
                        $scope.Section2Inactive = true;
                        $scope.Section3Inactive = true;
                        $scope.Section4Inactive = true;
                        $scope.accordion = '1';
                    }

                    // Setting properties for new policy start date-picker.
                    var polStartDateOption = {};
                    polStartDateOption.minimumYearLimit = "+0D";
                    polStartDateOption.maximumYearLimit = "+" + $scope.productValidation.policyStartDateLimit + "D";
                    polStartDateOption.changeMonth = true;
                    polStartDateOption.changeYear = true;
                    polStartDateOption.dateFormat = "dd/mm/yy";
                    $scope.polStartDateOptions = setP365DatePickerProperties(polStartDateOption);

                    // Setting properties for proposer DOB date-picker.
                    var proposerDOBOption = {};
                    proposerDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMaxLimit + "Y";
                    proposerDOBOption.maximumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMinLimit + "Y";
                    proposerDOBOption.changeMonth = true;
                    proposerDOBOption.changeYear = true;
                    proposerDOBOption.dateFormat = "dd/mm/yy";
                    $scope.proposerDOBOptions = setP365DatePickerProperties(proposerDOBOption);

                    // Setting properties for proposer DOB date-picker.
                    var nomineeDOBOption = {};
                    nomineeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMaxLimit + "Y";
                    nomineeDOBOption.maximumYearLimit = "-1Y";
                    nomineeDOBOption.changeMonth = true;
                    nomineeDOBOption.changeYear = true;
                    nomineeDOBOption.dateFormat = "dd/mm/yy";
                    $scope.nomineeDOBOptions = setP365DatePickerProperties(nomineeDOBOption);

                            if ($scope.responseProduct.proposalRequest.nominationDetails) {
                                $scope.nominationDetails.nomFirstName = $scope.responseProduct.proposalRequest.nominationDetails.nomFirstName;
                                $scope.nominationDetails.nomLastName = $scope.responseProduct.proposalRequest.nominationDetails.nomLastName;
                                $scope.nominationDetails.nomDateOfBirth = $scope.responseProduct.proposalRequest.nominationDetails.nomDateOfBirth;
                                if($scope.responseProduct.proposalRequest.nominationDetails.nomPersonAge)
                                $scope.nominationDetails.nomPersonAge = $scope.responseProduct.proposalRequest.nominationDetails.nomPersonAge;
        
                                if ($scope.responseProduct.proposalRequest.nominationDetails) {
                                    $scope.nominationInfo.nominationRelation = {};
                                    $scope.nominationInfo.nominationRelation.relationship = $scope.responseProduct.proposalRequest.nominationDetails.nominationRelation;
                                    $scope.nominationInfo.nominationRelation.relationshipId = $scope.responseProduct.proposalRequest.nominationDetails.nominationRelationId;
                                }
        
                                if ($scope.responseProduct.proposalRequest.nominationDetails.nomPersonAge < 18) {
                                    $scope.appointeeStatus = true;
                                } else {
                                    $scope.appointeeStatus = false;
                                }
                                if ($scope.appointeeStatus) {
                                    $scope.appointeeDetails.appointeeFirstName = $scope.responseProduct.proposalRequest.appointeeDetails.appointeeFirstName;
                                    $scope.appointeeDetails.appointeeLastName = $scope.responseProduct.proposalRequest.appointeeDetails.appointeeLastName;
                                    $scope.appointeeDetails.appointeeDateOfBirth = $scope.responseProduct.proposalRequest.appointeeDetails.appointeeDateOfBirth;
        
                                    if ($scope.responseProduct.proposalRequest.appointeeDetails.appointeeRelation) {
                                        $scope.appointeeInfo.appointeeRelation = {};
                                        $scope.appointeeInfo.appointeeRelation.relationship = $scope.responseProduct.proposalRequest.appointeeDetails.appointeeRelation;
                                        $scope.appointeeInfo.appointeeRelation.relationshipId = $scope.responseProduct.proposalRequest.appointeeDetails.appointeeRelationId;
                                    }
                                }
                            }
                        
                        if ($scope.responseProduct.proposalRequest.vehicleDetails) {
                        if ($scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber) {
                            var formatRegisCode = $scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber;
                            $scope.vehicleInfo.registrationNumber = formatRegisCode.substring(4);
                        }

                        $scope.selectedProductInputParam.vehicleInfo.name = $scope.responseProduct.proposalRequest.vehicleDetails.make;
                        $scope.selectedProductInputParam.vehicleInfo.model = $scope.responseProduct.proposalRequest.vehicleDetails.model;
                        $scope.selectedProductInputParam.vehicleInfo.variant = $scope.responseProduct.proposalRequest.vehicleDetails.variant;

                        $scope.displayRegistrationDate = $scope.responseProduct.proposalRequest.vehicleDetails.registrationDate;
                        var regDate = $scope.vehicleInfo.dateOfRegistration.split("/");
                        $scope.displayRegistrationDate = regDate[0] + "-" + monthListGeneric[Number(regDate[1]) - 1] + "-" + regDate[2];
                        $scope.vehicleInfo.manufacturingYear = regDate[2] ;
                        if ($scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber) {
                            var formatRegisCode = $scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber;
                            $scope.vehicleInfo.registrationNumber = formatRegisCode.substring(4);
                        }
                        $scope.vehicleDetails.RTOCode = $scope.responseProduct.proposalRequest.vehicleDetails.RTOCode;
                        $scope.vehicleDetails.engineNumber = $scope.responseProduct.proposalRequest.vehicleDetails.engineNumber;
                        $scope.vehicleDetails.chassisNumber = $scope.responseProduct.proposalRequest.vehicleDetails.chassisNumber;
                        $scope.vehicleDetails.registrationNumber = $scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber;
                        $scope.vehicleDetails.isVehicleAddressSameAsCommun = $scope.responseProduct.proposalRequest.vehicleDetails.isVehicleAddressSameAsCommun;
                        
                        $scope.vehicleDetails.registrationAddress = {};
                        $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regDoorNo;
                        $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regDisplayArea;
                        $scope.vehicleDetails.registrationAddress.regPincode = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regPincode;
                        $scope.vehicleDetails.registrationAddress.regCity = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regCity;
                        $scope.vehicleDetails.registrationAddress.regState = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regState;
                        
        
                        if (!$scope.responseProduct.proposalRequest.vehicleDetails.purchasedLoan) {
                            $scope.vehicleInfo.vehicleLoanType = "";
                            $scope.vehicleDetails.purchasedLoan = $scope.responseProduct.proposalRequest.vehicleDetails.purchasedLoan;
                        } else {
                            $scope.vehicleDetails.purchasedLoan = $scope.responseProduct.proposalRequest.vehicleDetails.purchasedLoan;
                        }
                        if($scope.responseProduct.proposalRequest.vehicleDetails.financeInstitutionCode){
                        $scope.vehicleDetails.financeInstitutionCode = $scope.responseProduct.proposalRequest.vehicleDetails.financeInstitutionCode;
                        }
                        if($scope.responseProduct.proposalRequest.vehicleDetails.financeInstitution){
                        $scope.vehicleDetails.financeInstitution = $scope.responseProduct.proposalRequest.vehicleDetails.financeInstitution ;
                        }
                    }

                    $scope.getFinancialInstituteList = function (instituteName) {
                        var carrierId = $scope.responseProduct.carrierId;
                        return $http.get(getSearchServiceLink + "CarrierLoanFinancer" + "&q=" + instituteName + "&id=" + carrierId).then(function (financeInstituteList) {
                            return JSON.parse(financeInstituteList.data).data;
                        });
                    };

                    $scope.onFinancialInstitute = function (item) {
                        $scope.vehicleDetails.financeInstitutionId = item.financerId;
                        $scope.loadPlaceholder();
                    };

                    $scope.loadPlaceholder = function () {
                        setTimeout(function () {
                            $('.buyform-control').on('focus blur', function (e) {
                                $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
                            }).trigger('blur');
                        }, 100);
                    };
                    var vehicleDrivenOn = {};
                    vehicleDrivenOn.name = $scope.responseProduct.proposalRequest.proposerDetails.vehicleDrivenOn;
                    $scope.proposerInfo.vehicleDrivenOn = vehicleDrivenOn;
                    if($scope.proposerInfo.vehicleDrivenOn)
                    $scope.proposerDetails.vehicleDrivenOn = $scope.proposerInfo.vehicleDrivenOn;

                    var drivingExp = {};
                    if ($scope.responseProduct.proposalRequest.proposerDetails.drivingExp) {
                        drivingExp.display = $scope.responseProduct.proposalRequest.proposerDetails.drivingExp;
                        $scope.proposerInfo.drivingExp = drivingExp;
                        $scope.proposerDetails.drivingExp = $scope.proposerInfo.drivingExp;
                    }
                    $scope.changeDrivingExp = function () {
                        $scope.proposerDetails.drivingExp = $scope.proposerInfo.drivingExp.display;
                    };

                    $scope.changeVehicleDrivenOn = function () {
                        $scope.proposerDetails.vehicleDrivenOn = $scope.proposerInfo.vehicleDrivenOn.name;
                    };
                    $scope.changePrevInsurer = function () {
                        $scope.insuranceDetails.insurerName = $scope.insuranceInfo.insurerName.carrierName;
                        $scope.insuranceDetails.insurerId = $scope.insuranceInfo.insurerName.carrierId;
                    };

                    $scope.changeVehicleLoanType = function () {
                        $scope.vehicleDetails.vehicleLoanType = $scope.vehicleInfo.vehicleLoanType.name;
                    };


                    $scope.pucStatus = true;
                    $scope.undertakingStatus = true;
                    //Proposal Status Form
                    $scope.proposalStatusform = true;
            
                    if ($scope.responseProduct.carProposalResponse != null) {
                        $scope.proposalStatus.statusDateProp = $scope.responseProduct.carProposalResponse.updatedDate;
                        $scope.proposalStatus.statusProp = "completed";
                        if($scope.responseProduct.carProposalResponse.inspectionReferenceNo){
                            inspectionNumber = $scope.responseProduct.carProposalResponse.inspectionReferenceNo;
                        }
                    }
                    if ($scope.responseProduct.paymentResponse != null) {
                        if ($scope.responseProduct.paymentResponse.transactionStatusCode == 1) {
                            $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                            $scope.proposalStatus.statusPaym = "completed";
                            $scope.disablePaymentButton = true;
                            $scope.disableAllFields = function () {
                                setTimeout(function () {
                                    $('form md-option').attr('disabled', 'disabled');
                                    $('form md-select').attr('disabled', 'disabled');
                                    $('input').attr('disabled', 'disabled');
                                    $('md-radio-button').attr('disabled', 'disabled');
                                    $('md-checkbox').attr('disabled', 'disabled');
                                    $scope.vehicleDetailsForm.$invalid = true;
                                }, 1000);
                            }

                        } else if ($scope.responseProduct.paymentResponse.transactionStatusCode == 0) {
                            $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                            $scope.proposalStatus.statusPaym = "failed";
                        } else {
                            $scope.proposalStatusform = false;
                        }
                    } else {
                        $scope.proposalStatus.statusPaym = "pending";
                        $scope.proposalStatus.statusPoli = "pending";
                    }
                    if ($scope.responseProduct.carPolicyResponse != null) {
                        if ($scope.responseProduct.carPolicyResponse.transactionStatusCode == 1) {
                            $scope.proposalStatus.statusDatePoli = $scope.responseProduct.carPolicyResponse.updatedDate;
                            $scope.proposalStatus.statusPoli = "completed";
                        } else if ($scope.responseProduct.carPolicyResponse.transactionStatusCode == 0) {
                            $scope.proposalStatus.statusDatePoli = $scope.responseProduct.carPolicyResponse.updatedDate;
                            $scope.proposalStatus.statusPoli = "failed";
                        }
                    }
                   
                    $scope.validatePolicyStartDate = function () {
                        if (String($scope.policyStartDate) !== "undefined") {
                            convertStringFormatToDate($scope.policyStartDate, function (formattedPolStartDate) {
                                if ($scope.selectedProduct.ownDamagePolicyTerm) {
                                    $scope.insuranceDetails.ODPolicyStartDate = $scope.policyStartDate;
                                }
                                if ($scope.vehicleInfo.insuranceType.value == "renew") {
                                    var polEndDate = new Date(formattedPolStartDate.setFullYear(formattedPolStartDate.getFullYear() + 1));
                                } else {
                                    var polEndDate = new Date(formattedPolStartDate.setFullYear(formattedPolStartDate.getFullYear() + 3));
                                }
                                //var polEndDate = new Date(formattedPolStartDate.setFullYear(formattedPolStartDate.getFullYear() + 1));
                                polEndDate = new Date(polEndDate.setDate(polEndDate.getDate() - 1));
                                convertDateFormatToString(polEndDate, function (formattedPolEndDate) {
                                    $scope.insuranceDetails.policyEndDate = formattedPolEndDate;

                                    var tempPolicyEndDate = $scope.insuranceDetails.policyEndDate.split("/");
                                    var PolicyEndDate = tempPolicyEndDate[1] + "/" + tempPolicyEndDate[0] + "/" + tempPolicyEndDate[2];

                                    // Setting properties for automobile membership expiry date-picker.
                                    var polStartDateOption = {};
                                    polStartDateOption.minimumDateLimit = PolicyEndDate;
                                    polStartDateOption.maximumYearLimit = "+" + $scope.productValidation.vehicleAutoMemberExpDateLimit + "Y";
                                    polStartDateOption.changeMonth = true;
                                    polStartDateOption.changeYear = true;
                                    polStartDateOption.dateFormat = "dd/mm/yy";
                                    $scope.proposerAutoMemberExpDateOptions = setP365DatePickerProperties(polStartDateOption);
                                });
                            });
                            // added for Own damage policy period start date and end date. as discussed with Abhishek Dh.
                            if ($scope.selectedProduct.ownDamagePolicyTerm) {
                                convertStringFormatToDate($scope.insuranceDetails.ODPolicyStartDate, function (formattedODPolStartDate) {
                                    var ODPolEndDate = new Date(formattedODPolStartDate.setFullYear(formattedODPolStartDate.getFullYear() + $scope.selectedProduct.ownDamagePolicyTerm));
                                    ODPolEndDate = new Date(ODPolEndDate.setDate(ODPolEndDate.getDate() - 1));
                                    convertDateFormatToString(ODPolEndDate, function (formattedODPolEndDate) {
                                        $scope.insuranceDetails.ODPolicyEndDate = formattedODPolEndDate;
                                    });
                                });
                            }
                        }
                    };

                    $scope.showAuthenticateForm = function () {
                        var validateAuthParam = {};
                        validateAuthParam.paramMap = {};
                        validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                        validateAuthParam.funcType = $scope.p365Labels.functionType.optAuth;
                        validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function (createOTP) {
                            if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.createOTPError = "";
                                $scope.modalOTP = true;
                            } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                                $scope.createOTPError = createOTP.message;
                                $scope.modalOTPError = true;
                            } else {
                                $scope.createOTPError = $scope.p365Labels.errorMessage.createOTP;
                                $scope.modalOTPError = true;
                            }
                        });
                    };


                    $scope.hideModal = function () {
                        $scope.modalOTP = false;
                        $scope.proceedPaymentStatus = true;
                        $scope.authenticate.enteredOTP = "";
                    };

                    $scope.hideModalError = function () {
                        $scope.modalOTPError = false;
                    };
                    //$scope.screenOneStatus = true;
                    //alert($scope.screenOneStatus);

                    $scope.resendOTP = function () {
                        var validateAuthParam = {};
                        validateAuthParam.paramMap = {};
                        validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                        validateAuthParam.funcType = $scope.p365Labels.functionType.optAuth;
                        validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function (createOTP) {
                            if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.invalidOTPError = "";
                            } else {
                                $scope.invalidOTPError = $scope.p365Labels.errorMessage.createOTP;
                            }
                        });
                    }

                    /*----- iPOS+ Functions-------*/

                    $scope.sendProposalEmail = function () {
                        var proposalDetailsEmail = {};
                        proposalDetailsEmail.paramMap = {};

                        proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
                        proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
                        proposalDetailsEmail.isBCCRequired = 'Y';
                        proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
                        proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.car;
                        proposalDetailsEmail.paramMap.quoteId = $scope.responseToken.QUOTE_ID;
                        proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                        proposalDetailsEmail.paramMap.docId = $scope.responseToken.proposalId;
                        proposalDetailsEmail.paramMap.LOB = String($scope.p365Labels.businessLineType.car);
                        if($scope.shortenURL){
                            proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;
                        }else{
                            $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";  
                            proposalDetailsEmail.paramMap.url = $scope.longURL;   
                        }
                        RestAPI.invoke($scope.p365Labels.transactionName.sendEmail, proposalDetailsEmail).then(function (emailResponse) {
                            if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.sendSMS();
                                if (baseEnvEnabled == true && agencyPortalEnabled == true) {
                                    var frameURL = agencyPortalUrl + proposalDetailsEmail.paramMap.docId + "&lob=" + proposalDetailsEmail.paramMap.LOB;
                                    $scope.URLforPayment = $sce.trustAsResourceUrl(frameURL);
                                    $scope.modalAP = true;
                                    $scope.loading = false;
                                } else {
                                    $scope.redirectForPayment = false;
                                    $scope.loading = false;
                                    $scope.modalIPOS = true;
                                }
                            } else {
                                scope.sendSMS();
                                $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                $scope.loading = false;
                            }
                        });
                    }

                    $scope.submitProposalData = function () {
                        $scope.submitProposalClicked = true;
                         $scope.carProposeFormDetails = {};
                        // if ($scope.responseProduct.proposalRequest.insuranceDetails.onlyODApplicable) {
                        //     $scope.insuranceDetails.onlyODApplicable = $scope.responseProduct.proposalRequest.insuranceDetails.onlyODApplicable;
                        // }
                        //$scope.carProposeFormDetails.premiumDetails = $scope.selectedProduct;
                        $scope.carProposeFormDetails.proposerDetails = $scope.proposerDetails;
                        $scope.carProposeFormDetails.nominationDetails = $scope.nominationDetails;
                        $scope.carProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                        $scope.carProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                         $scope.createCarVehicleDetailsRequest();
                        //$scope.carProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                        $scope.carProposeFormDetails.carrierId = $scope.responseProduct.carrierId;
                        $scope.carProposeFormDetails.productId = $scope.responseProduct.productId;
                        $scope.carProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        $scope.carProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.car;
                       // $scope.carProposeFormDetails.carrierProposalStatus = false;
                       // $scope.carProposeFormDetails.proposalId = $scope.responseProduct.proposalId;
                        $scope.carProposeFormDetails.personalDetailsFlag = $scope.personalDetailsFlag;
                        if ($scope.breakInInspectionStatus) {
                            $scope.carProposeFormDetails.breakInInspectionStatus = $scope.breakInInspectionStatus;
                        }
                        $scope.carProposeFormDetails.organizationDetails = {};
                        if(!$scope.personalDetailsFlag){
                            $scope.carProposeFormDetails.organizationDetails.contactPersonName=$scope.organizationDetails.contactPersonName;
                            $scope.carProposeFormDetails.organizationDetails.organizationName=$scope.organizationDetails.organizationName;
                        }
                        $scope.loading = true;
                        
                        if (!$scope.saveProposal) {
                            if (String($scope.vehicleInfo.registrationNumber) != "undefined" && $scope.vehicleInfo.registrationNumber != null) {
                                $scope.vehicleDetails.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();
                            }

                            delete $scope.carProposeFormDetails.proposalId;
                            if ($rootScope.agencyPortalEnabled) {
                                const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                                $scope.carProposeFormDetails.requestSource = sourceOrigin;
                                if (localdata) {
                                    $scope.carProposeFormDetails.userName = localdata.username;
                                    $scope.carProposeFormDetails.agencyId = localdata.agencyId;
                                    $scope.carProposeFormDetails.source = sourceOrigin;
                                }
                                if(localStorage.getItem("desiSkillUniqueId")){
                                    if(localStorage.getItem("desiSkillUserId")){
                                    $scope.carProposeFormDetails.userName = localStorage.getItem("desiSkillUserId");
                                    }
                                    $scope.carProposeFormDetails.agencyId =  localStorage.getItem("desiSkillAgencyId");   
                                }
                            }
                            if ($scope.carProposeFormDetails.QUOTE_ID) {
                                RestAPI.invoke("carProposal", $scope.carProposeFormDetails).then(function (proposeFormResponse) {
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                        console.log("Proposal updated");
                                        $scope.responseToken = proposeFormResponse.data;
                                        $scope.responseToken.paymentGateway = $scope.paymentURL;
                                        $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.car;
                                        localStorageService.set("carReponseToken", $scope.responseToken);
                                        console.log("Payment service started");
                                        var encodeproposalID = String($scope.responseToken.proposalId);
                                        var encodeLOB = String($scope.p365Labels.businessLineType.car);

                                        $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                        localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);
                                        console.log("$scope.encryptedProposalId", $scope.encryptedProposalId);

                                        $rootScope.encryptedProposalID = encodeproposalID
                                        $rootScope.encryptedLOB = String($scope.p365Labels.businessLineType.car);

                                        // added by gauri 
                                        if (imauticAutomation == true) {
                                            imatCarProposal(localStorageService, $scope, 'SubmitProposal', function (shortURLResponse) {
                                                if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                    $scope.shortURLResponse = shortURLResponse;
                                                    if($scope.shortURLResponse.data.shortURL){
                                                        $scope.shortenURL = $scope.shortURLResponse.data.shortURL;
                                                    }else{
                                                            $scope.longURL  ="" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
                                                        }
                                                    $scope.sendProposalEmail();
                                                } else {
                                                    $scope.longURL ="" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
                                                    //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                                    $scope.sendProposalEmail();
                                                    $scope.loading = false;
                                                }
                                                console.log('$scope.shortURLResponse in bike buy product is:', $scope.shortURLResponse);
                                            });
                                        } else {

                                            console.log("Sending payment link to customer.");
                                            var body = {};
                                            body.longURL = sharePaymentLink + String($scope.responseToken.proposalId) + "&lob=" + String($scope.p365Labels.businessLineType.car);
                                            $scope.longURL = body.longURL;
                                            $http({ method: 'POST', url: getShortURLLink, data: body }).
                                                success(function (shortURLResponse) {
                                                    if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                        $scope.shortURLResponse = shortURLResponse;
                                                        $scope.shortenURL = $scope.shortURLResponse.data.shortURL;
                                                        $scope.sendProposalEmail();
                                                    } else {
                                                        $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
                                                        //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                                        $scope.sendProposalEmail();
                                                        $scope.loading = false;
                                                    }
                                                });
                                        }
                                    } else if ((proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error)  || (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error1) || (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1)) {
                                        $scope.loading = false;
                                        if ($rootScope.wordPressEnabled) {
                                            $scope.proceedPaymentStatus = true;
                                        }                                
                                       if(proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1){
                                            if(proposeFormResponse.message){
                                            $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                        }else{
                                            $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                        }
                                        }else{
                                            if(proposeFormResponse.message){
                                                $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                            }else{
                                                $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                            }                                        }
                                    } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.prevPolicyExpired) {
                                        // console.log('in policy expired');
                                        $scope.loading = false;
                                        $scope.modalPrevPolExpiredError = true;
                                        // $scope.vehicleInfo.previousPolicyExpired = proposeFormResponse.data.previousPolicyExpired;
                                        //console.log('$scope.vehicleInfo.previousPolicyExpired',$scope.vehicleInfo.previousPolicyExpired);
                                        $scope.prevPolicyExpiredError = proposeFormResponse.message;
                                    } else {
                                        //added by gauri for imautic
                                        if (imauticAutomation == true) {
                                            imatEvent('ProposalFailed');
                                        }
                                        $scope.loading = false;
                                        if ($rootScope.wordPressEnabled) {
                                            $scope.proceedPaymentStatus = true;
                                        }
                                        var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                        //$rootScope.P365Alert($scope.p365Labels.common.p365prompt, buyScreenCnfrmError, "Ok");
                                        if(proposeFormResponse.message){
                                            $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                        }else{
                                            $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                        }
                                    }
                
                                });
                            } else{
                                $scope.loading = false;
                                $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                            }
                        } else {
                            RestAPI.invoke($scope.transactionSaveProposal, $scope.responseProduct).then(function (proposeFormResponse) {
                                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {


                                    $scope.proposalId = proposeFormResponse.data;
                                    localStorageService.set("proposalId", $scope.proposalId);
                                    $scope.loading = false;
                                    $scope.saveProposal = false;
                                    console.log("Proposal Created/Saved");
                                } else {
                                    $scope.loading = false;
                                    $scope.saveProposal = false;
                                    console.log("Error in Proposal Creation/Saving");
                                }
                            });
                        }

                    } /*----- iPOS+ Functions Ends -------*/


                    $scope.redirectToPaymentGateway = function () {
                        if ($scope.paymentURLParam) {
                            if ($rootScope.affilateUser || $rootScope.agencyPortalEnabled) {
                                $window.top.location.href = $scope.paymentServiceResponse.paymentURL + $scope.paymentURLParam;
                            } else {
                                $window.location.href = $scope.paymentServiceResponse.paymentURL + $scope.paymentURLParam;
                            }
                        } else {
                            $timeout(function () {
                                $scope.paymentForm.setAction($scope.paymentServiceResponse.paymentURL);
                                $scope.paymentForm.commit();
                                $scope.$apply();
                            }, 100);
                        }
                    }
                    $scope.proceedForPayment = function () {
                        $scope.proceedPaymentStatus = false;
                        $scope.submitProposalClicked =false;

                        //for setting value for lead
                        $scope.quoteUserInfo.firstName = $scope.proposerDetails.firstName;
                        $scope.quoteUserInfo.lastName = $scope.proposerDetails.lastName;
                        $scope.quoteUserInfo.emailId = $scope.proposerDetails.emailId;
                        $scope.quoteUserInfo.mobileNumber = $scope.proposerDetails.mobileNumber;
                        $scope.quoteUserInfo.termsCondition = true;
                        localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);

                        $scope.carProposeFormDetails = {};

                        $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
                        /*$scope.proposerDetails.userOTP = authenticateUserParam.OTP; */
                        $scope.insuranceDetails.insuranceType = $scope.responseProduct.proposalRequest.insuranceDetails.insuranceType;

                        /* agentDetails will be sent in proposal*/
                        if ($scope.responseProduct.userName) {
                            $scope.selectedProduct.userName = $scope.responseProduct.userName;
                            $scope.carProposeFormDetails.userName = $scope.responseProduct.userName;
                        }
                        if ($scope.responseProduct.agencyId) {
                            $scope.selectedProduct.agencyId = $scope.responseProduct.agencyId;
                            $scope.carProposeFormDetails.agencyId = $scope.responseProduct.agencyId;
                        }


                        //$scope.carProposeFormDetails.premiumDetails = $scope.selectedProduct;
                        $scope.carProposeFormDetails.proposerDetails = $scope.proposerDetails;
                        $scope.carProposeFormDetails.nominationDetails = $scope.nominationDetails;
                       
                        $scope.carProposeFormDetails.organizationDetails = {};
                        if(!$scope.personalDetailsFlag){
                            $scope.carProposeFormDetails.organizationDetails.contactPersonName=$scope.organizationDetails.contactPersonName;
                            $scope.carProposeFormDetails.organizationDetails.organizationName=$scope.organizationDetails.organizationName;
                        }
                        // if ($scope.responseProduct.proposalRequest.insuranceDetails.onlyODApplicable) {
                        //     $scope.insuranceDetails.onlyODApplicable = $scope.responseProduct.proposalRequest.insuranceDetails.onlyODApplicable;
                        // }
                        $scope.carProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                        $scope.carProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                        //$scope.carProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                        $scope.createCarVehicleDetailsRequest();
                        // $scope.carProposeFormDetails.PACoverDetails = localStorageService.get("CarPACoverDetails");
                        //$scope.carProposeFormDetails.personalDetailsFlag = $scope.personalDetailsFlag;
                        //$scope.carProposeFormDetails.owneredBy = localStorageService.get("carQuoteInputParamaters").quoteParam.owneredBy;
                        // if ($scope.breakInInspectionStatus) {
                        //     $scope.carProposeFormDetails.breakInInspectionStatus = $scope.breakInInspectionStatus;
                        // }
                        if ($scope.referralCode) {
                            $scope.carProposeFormDetails.referralCode = $scope.referralCode;
                        }
                        
                        $scope.carProposeFormDetails.carrierId = $scope.responseProduct.carrierId;
                        $scope.carProposeFormDetails.productId = $scope.responseProduct.productId;
                        if(localStorageService.get("CAR_UNIQUE_QUOTE_ID")){
                        $scope.carProposeFormDetails.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
                        }else{
                        $scope.carProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        }
                        //$scope.carProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        $scope.carProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.car;
                        //$scope.carProposeFormDetails.requestType = $scope.p365Labels.request.carPropRequestType;

                        if (!$rootScope.wordPressEnabled) {
                            //$scope.carProposeFormDetails.baseEnvStatus = baseEnvEnabled;
                            $scope.carProposeFormDetails.requestSource = sourceOrigin;
                            $scope.carProposeFormDetails.source = sourceOrigin;
                        } else {
                            $scope.carProposeFormDetails.source = sourceOrigin;
                        }
                        //localStorageService.set("$scope.carProposeFormDetails", $scope.carProposeFormDetails);
                        // Google Analytics Tracker added.
                        //analyticsTrackerSendData($scope.carProposeFormDetails); 
                        if ($scope.carProposeFormDetails.QUOTE_ID) {
                            $scope.loading = true;
                            //alert('LMS $scope.carProposeFormDetails'+JSON.stringify($scope.carProposeFormDetails));
                            RestAPI.invoke("carProposal", $scope.carProposeFormDetails).then(function (proposeFormResponse) {
                                // var proposeFormResponse=$scope.responseProduct.carProposalResponse;
                                $scope.modalOTP = false;
                                $scope.authenticate.enteredOTP = "";
                                $scope.modalOTPError = false;
                                $scope.proceedPaymentStatus = true;
                                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                    $scope.proposalId = proposeFormResponse.data.proposalId;
                                    // added to store the encrypted store prosal id 
                                    $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                    localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);
                                    console.log("$scope.encryptedProposalId", $scope.encryptedProposalId);

                                    //added by gauri for mautic application
                                    if (imauticAutomation == true) {
                                        imatCarProposal(localStorageService, $scope, 'MakePayment', function (shortURLResponse) {
                                        });
                                    }
                                    //$scope.responseToken = proposeFormResponse;
                                    $scope.responseToken = proposeFormResponse.data;
                                    $scope.responseToken.paymentGateway = $scope.paymentURL;
                                    $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.car;

                                    localStorageService.set("carReponseToken", $scope.responseToken);
                                    //alert('LMS proposeFormResponse.data'+JSON.stringify(proposeFormResponse.data));
                                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.paymentService, $scope.responseToken, function (paymentDetails) {
                                        if (paymentDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.paymentServiceResponse = paymentDetails.data;

                                            if ($scope.paymentServiceResponse.method == "GET") {
                                                $scope.paymentURLParam = "?";
                                                var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                                for (var i = 0; i < paymentURLParamListLength; i++) {
                                                    if (i < (paymentURLParamListLength - 1))
                                                        $scope.paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value + "&";
                                                    else
                                                        $scope.paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value;
                                                }
                                                $scope.redirectForPayment = true;
                                                $scope.loading = false;
                                                $scope.modalIPOS = true;
                                            } else {
                                                $scope.paymentURLParam = null;
                                                $scope.redirectForPayment = true;
                                                $scope.loading = false;
                                                $scope.modalIPOS = true;
                                            }

                                        } else {
                                            $scope.loading = false;
                                            var buyScreenCnfrmError = paymentDetails.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                            $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                                        }
                                    });
                                } else if ((proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error)||(proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error1)|| (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1) ||(proposeFormResponse.responseCode == $scope.p365Labels.responseCode.inspectionPending)) {
                                    $scope.loading = false;
                                   // $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                                   if(proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1 || proposeFormResponse.responseCode == $scope.p365Labels.responseCode.inspectionPending){
                                    //$rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok");
                                    if(proposeFormResponse.message){
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                    }else{
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                    }
                                }else{
                                    if(proposeFormResponse.message){
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                    }else{
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                    }  
                                }
                                } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.prevPolicyExpired) {
                                    // console.log('in policy expired');
                                    $scope.loading = false;
                                    $scope.modalPrevPolExpiredError = true;
                                    // $scope.vehicleInfo.previousPolicyExpired = proposeFormResponse.data.previousPolicyExpired;
                                    //console.log('$scope.vehicleInfo.previousPolicyExpired',$scope.vehicleInfo.previousPolicyExpired);
                                    $scope.prevPolicyExpiredError = proposeFormResponse.message;
                                } else {
                                    //added by gauri for imautic
                                    if (imauticAutomation == true) {
                                        imatEvent('ProposalFailed');
                                    }
                                    $scope.loading = false;
                        //            var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                   // $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                                   if(proposeFormResponse.message){
                                    $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                }else{
                                    $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                }
                                }
                            });
                        } else {
                            $scope.proceedPaymentStatus = true;
                            if(proposeFormResponse.message){
                                $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                            }else{
                                $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                            }
                           // $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                        }
                        /*below code is commented : as discussed with pranjal and abhishek Dh. We will not show OTP popup after user clicks make payment*/
                        /*}else if(createOTP.responseCode == $scope.p365Labels.responseCode.noRecordsFound){
								$scope.invalidOTPError = $scope.p365Labels.validationMessages.invalidOTP;
							}else if(createOTP.responseCode == $scope.p365Labels.responseCode.expiredOTP){
								$scope.invalidOTPError = $scope.p365Labels.validationMessages.expiredOTP;
							}else if(createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile){
								$scope.invalidOTPError = createOTP.message;
							}else{
								$scope.invalidOTPError = $scope.p365Labels.validationMessages.authOTP;
							}
						});*/
                    };
                }



                //start for pin
                $scope.$watch('proposerDetails.communicationAddress.comDisplayArea', function (newValue) {
                    if ($scope.vehicleDetails.isVehicleAddressSameAsCommun) {
                        $scope.changeRegAddress();
                    }
                });

                $scope.$watch('proposerDetails.communicationAddress.comDoorNo', function (newValue) {
                    if ($scope.vehicleDetails.isVehicleAddressSameAsCommun) {
                        $scope.changeRegAddress();
                    }
                });

                $scope.$on("setCommAddressByAPI", function () {
                    setTimeout(function () {
                        var googleAddressObject = angular.copy($rootScope.chosenCommPlaceDetails);
                        getAddressFields(googleAddressObject, function (fomattedAddress, formattedCity, formattedState, formattedPincode) {
                          $scope.proposerDetails.communicationAddress.comDisplayArea= fomattedAddress;
                            if (String(formattedPincode) != "undefined" && formattedPincode != "") {
                                $scope.calcDefaultAreaDetails(formattedPincode);
                            } else {
                              $scope.proposerDetails.communicationAddress.comPincode = "";
                              $scope.proposerDetails.communicationAddress.comState = "";
                              $scope.proposerDetails.communicationAddress.comCity = "";                       
                        }
                           $scope.$apply();
                        });
                    }, 10);
                });
        
                $scope.$on("setRegAddressByAPI", function () {
                    setTimeout(function () {
                        var googleAddressObject = angular.copy($rootScope.chosenRegPlaceDetails);
                        getAddressFields(googleAddressObject, function (fomattedAddress, formattedCity, formattedState, formattedPincode) {
                           $scope.vehicleDetails.registrationAddress.regDisplayArea = fomattedAddress;
                            if (String(formattedPincode) != "undefined" && formattedPincode != "") {
                                $scope.calcDefaultRegAreaDetails(formattedPincode);
                            } else {
                                $scope.vehicleDetails.registrationAddress.regPincode = "";
                               $scope.vehicleDetails.registrationAddress.regState = ""; 
                                $scope.vehicleDetails.registrationAddress.regCity = "";                      
                    }
                            $scope.$apply();
                        });
                    }, 10);
                });

                //fxn to calculate default area details
                $scope.calcDefaultAreaDetails = function (areaCode) {
                    //Sayli-04082017: As disscussed with yogesh, Delhi Pincode pre population issue 
                    if (areaCode != null && String(areaCode) != "undefined" && String(areaCode).length > 0) {
                        var docType = $scope.p365Labels.documentType.cityDetails;
                        var carrierId = $scope.responseProduct.carrierId;
                        $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {
                            var areaDetails = JSON.parse(response.data);
                            if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.onSelectPinOrArea(areaDetails.data[0]);
                            }
                        });
                    }
                };

                //fxn to calculate default area for registration details
                $scope.calcDefaultRegAreaDetails = function (areaCode) {
                    //Sayli-04082017: As disscussed with yogesh, Delhi Pincode pre population issue
                    if (areaCode != null && String(areaCode) != "undefined" && String(areaCode).length > 0) {
                        var docType = $scope.p365Labels.documentType.cityDetails;
                        var carrierId = $scope.responseProduct.carrierId;

                        $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {
                            var areaDetails = JSON.parse(response.data);
                            if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.onSelectVehiclePinOrArea(areaDetails.data[0]);
                            }
                        });
                    }
                };


                $scope.onSelectPinOrArea = function (item) {

                    $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                    $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam.vehicleInfo);
                    var selState = $scope.selectedProductInputParam.vehicleInfo.state;
                    $scope.proposerDetails.state = selState.toUpperCase();
                    if ($scope.proposerDetails.state != item.state) {
                        //$scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                        $scope.selectedProductInputParam.vehicleInfo.state = item.state;
                        $scope.selectedProductInputParam.vehicleInfo.city = item.city;
                        $scope.proposerDetailsCopied = angular.copy(item);

                        $rootScope.P365Confirm("Policies365", "There is a change in location and premium would be re-calculated. Do you want to proceed?", "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;
                                // $scope.quote = {};

                                // $scope.quote = $scope.selectedProductInputParam;
                                // if ($scope.proposerDetails.mobileNumber) {
                                //     $scope.quote.mobileNumber = $scope.proposerDetails.mobileNumber;
                                // }
                                $scope.carQuoteRequestFormation($scope.selectedProductInputParam);
                                RestAPI.invoke($scope.p365Labels.getRequest.quoteCar, $scope.quote).then(function (proposeFormResponse) {

                                    $scope.carRecalculateQuoteRequest = [];
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                        $scope.responseRecalculateCodeList = [];

                                        //localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("CAR_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                        $scope.responseProduct.QUOTE_ID = proposeFormResponse.QUOTE_ID;

                                        $scope.carRecalculateQuoteRequest = proposeFormResponse.data;

                                        $scope.quoteCalcResponse = [];
                                        angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.transactionName = $scope.p365Labels.transactionName.carQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var carQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(carQuoteResponse.responseCode);
                                                    if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                        if (carQuoteResponse.data != null) {
                                                            if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                            $scope.loading = false;
                                                            $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                                            $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                                        }
                                                    }
                                                        carQuoteResponse.data.quotes[0].id = carQuoteResponse.messageId;
                                                        $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);
                                                    } else {
                                                        if (carQuoteResponse.data != null) {
                                                            if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                            $scope.loading = false;
                                                            $scope.proposerDetails.pincode = '';
                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + " does not provide Insurance for the selected pincode of the owner. Please change the input or select any other insurer from the quote screen"
                                                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                        }
                                                    }
                                                    }
                                                })
                                                .error(function (data, status) {
                                                    $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                    $scope.loading = false;
                                                });
                                        });
                                    } else {
                                        $scope.loading = false;
                                        $scope.proposerDetails.communicationAddress.comPincode = '';
                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + " does not provide Insurance for the selected pincode of the owner. Please change the input or select any other insurer from the quote screen"
                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                    }
                                });

                                $scope.proposerDetails.communicationAddress.comDisplayArea = item.address;
                                $scope.proposerDetails.communicationAddress.comPincode = item.pincode;
                                $scope.proposerDetails.communicationAddress.comCity = item.city;
                                $scope.proposerDetails.communicationAddress.comState = item.state;
                                $scope.checkForSameAddress();
                            } else {
                                //$scope.proposerDetails.communicationAddress = $scope.proposerDetailsCopied;
                                
                               // $scope.proposerDetails.area = $scope.selectedProductInputParamCopy.area;                           
                                $scope.proposerDetails.communicationAddress.comDisplayArea = $scope.selectedProductInputParamCopy.address;
                                $scope.proposerDetails.communicationAddress.comPincode = $scope.selectedProductInputParamCopy.pincode;
                                $scope.proposerDetails.communicationAddress.comCity = $scope.selectedProductInputParamCopy.city;
                                $scope.proposerDetails.communicationAddress.comState = $scope.selectedProductInputParamCopy.state;
                                $scope.checkForSameAddress();
                            }
                        });
                    } else {
                       // $scope.proposerDetails.communicationAddress = item;
                       // $scope.displayArea = item.area + ", " + item.city;
                        if(item.address){
                            $scope.proposerDetails.communicationAddress.comDisplayArea = item.address;
                           }
                           $scope.proposerDetails.communicationAddress.comPincode = item.pincode;
                           $scope.proposerDetails.communicationAddress.comCity = item.city;
                           $scope.proposerDetails.communicationAddress.comState = item.state;
                        $scope.checkForSameAddress();
                    }

                    $scope.loadPlaceholder();
                    localStorageService.set("userGeoDetails", item);
                };

                  //check communication & permanent address
            $scope.checkForSameAddress = function () {
                if ($scope.vehicleDetails.isVehicleAddressSameAsCommun) {
                $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.proposerDetails.communicationAddress.comDoorNo;
                $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
                $scope.vehicleDetails.registrationAddress.regPincode =$scope.proposerDetails.communicationAddress.comPincode;          
                $scope.vehicleDetails.registrationAddress.regCity = $scope.proposerDetails.communicationAddress.comCity;
                $scope.vehicleDetails.registrationAddress.regState =$scope.proposerDetails.communicationAddress.comState;
                
                }
            }
            $scope.onSelectVehiclePinOrArea = function (item) {
                if(item.address){
                    $scope.vehicleDetails.registrationAddress.regDisplayArea = item.address;
                }
                $scope.vehicleDetails.registrationAddress.regPincode = item.pincode;
                $scope.vehicleDetails.registrationAddress.regCity = item.city;
                $scope.vehicleDetails.registrationAddress.regState = item.state;
                $scope.loadPlaceholder();
                        //localStorageService.set("regGeoDetails", item);
                    };

            $scope.changeRegAddress = function () {             
             if ($scope.vehicleDetails.isVehicleAddressSameAsCommun) {
                    $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.proposerDetails.communicationAddress.comDoorNo;
                    $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
                    $scope.vehicleDetails.registrationAddress.regPincode = $scope.proposerDetails.communicationAddress.comPincode;
                    $scope.vehicleDetails.registrationAddress.regCity= $scope.proposerDetails.communicationAddress.comCity;
                    $scope.vehicleDetails.registrationAddress.regState =$scope.proposerDetails.communicationAddress.comState;
            } else{
                    $scope.vehicleDetails.registrationAddress ={};
                    $scope.vehicleDetails.registrationAddress.regDisplayArea = "";                     
                    $scope.vehicleDetails.registrationAddress.regDoorNo = "";
                    $scope.vehicleDetails.registrationAddress.regPincode = "";
                    $scope.vehicleDetails.registrationAddress.regCity = "";
                    $scope.vehicleDetails.registrationAddress.regState = "";                
                  }
            };

                //function created for quote recalculation on registration number for TATA AIG
            $scope.calcQuoteOnRegistrationNumber = function (regNumber) {
                $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam);
                if ($scope.selectedProductInputParamCopy.vehicleInfo) {
                         if ($scope.selectedProductInputParamCopy.vehicleInfo.registrationNumber) {
                            $scope.registrationNumberCopy = $scope.selectedProductInputParam.vehicleInfo.registrationNumber.toUpperCase();
                        } else {
                            $scope.registrationNumberCopy = '';
                        }
                    } else {
                        $scope.registrationNumberCopy = '';
                    }
                    $scope.newRegistrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + regNumber.toUpperCase();
                    if ($scope.newRegistrationNumber != $scope.registrationNumberCopy) {
                        $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                        $scope.selectedProductInputParam.vehicleInfo.registrationNumber = $scope.newRegistrationNumber;

                        if ($scope.selectedProductInputParamCopy.GSTIN) {
                            $scope.selectedProductInputParam.GSTIN = $scope.selectedProductInputParamCopy.GSTIN;
                        }
                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.regNumberChangeMsg, "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;
                                // $scope.quote = {};

                                // $scope.quote = $scope.selectedProductInputParam;
                                // if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                //     $scope.quote.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                                // }
                                $scope.carQuoteRequestFormation($scope.selectedProductInputParam);
                                RestAPI.invoke($scope.p365Labels.getRequest.quoteCar, $scope.quote).then(function (proposeFormResponse) {
                                    $scope.carRecalculateQuoteRequest = [];
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                        $scope.responseRecalculateCodeList = [];
                                        $scope.quoteCalcResponse = [];

                                        if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                                            $scope.quoteCalcResponse.length = 0;
                                        }
                                        /*if($scope.selectedProductInputParam.vehicleInfo.registrationNumber){
                                        	delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                        }*/
                                       // localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("CAR_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                        $scope.carRecalculateQuoteRequest = proposeFormResponse.data;
                                        angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.messageId = messageIDVar;
                                            header.campaignID = campaignIDVar;
                                            header.source = sourceOrigin;
                                            header.transactionName = getCarQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var carQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(carQuoteResponse.responseCode);
                                                    if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                        if (carQuoteResponse.data != null) {
                                                            if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                            $scope.loading = false;
                                                            $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam);
                                                            $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                                            $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                                            /*if($scope.selectedProductInputParam.vehicleInfo.registerNumber){
                                                            	delete $scope.selectedProductInputParam.vehicleInfo.registerNumber
                                                            }*/
                                                        }
                                                    }
                                                        $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);
                                                    } else {
                                                        $scope.loading = false;
                                                        if (carQuoteResponse.data != null) {
                                                            if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                            $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                                            $scope.selectedProductInputParam.vehicleInfo.registrationNumber = '';
                                                            $scope.vehicleInfo.registrationNumber = '';
                                                            if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                                                delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                                            }
                                                            localStorageService.set("carQuoteInputParamaters", $scope.selectedProductInputParam);
                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.regNumberScreenConfirmErrorMsg
                                                            $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                                                        }
                                                    }
                                                    }
                                                })
                                                .error(function (data, status) {
                                                    delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                                    $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                    $scope.loading = false;
                                                });
                                        });
                                    } else {
                                        $scope.loading = false;
                                        $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                        $scope.vehicleInfo.registrationNumber = '';
                                        if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                            delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                        }
                                        localStorageService.set("carQuoteInputParamaters", $scope.selectedProductInputParam);
                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.regNumberScreenConfirmErrorMsg
                                        $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                                    }
                                });
                            } else {
                                //$scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                $scope.selectedProductInputParam.vehicleInfo = $scope.selectedProductInputParamCopy.vehicleInfo;
                                if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                    var formatVehicleCode = $scope.selectedProductInputParam.vehicleInfo.registrationNumber;
                                    $scope.vehicleInfo.registrationNumber = formatVehicleCode.substring(4);
                                } else {
                                    $scope.vehicleInfo.registrationNumber = '';
                                    delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                }
                            }
                        });
                    }
                    /*else{
                    						$scope.proposerDetails.communicationAddress = item;
                    						$scope.displayArea = item.area + ", " + item.city;
                    						$scope.proposerDetails.area = item.area;
                    						$scope.proposerDetails.pincode = item.pincode;
                    						$scope.proposerDetails.city = item.city;
                    						$scope.proposerDetails.state = item.state;
                    						$scope.checkForSameAddress();
                    					}*/

                    /*$scope.loadPlaceholder();
                    localStorageService.set("userGeoDetails", item);*/
                };

                $scope.checkGSTINNumber = function (selGSTIN) {
                    //recalculating quote on GSTIN for TATA AIG
                    if ($scope.productValidation.regNumberReQuoteCalc) {
                        if (selGSTIN) {
                            $scope.calcQuoteOnGSTINNumber(selGSTIN);
                        }
                    }
                }

                //function created for quote recalculation on GSTIN number for TATA AIG
                $scope.calcQuoteOnGSTINNumber = function (selGSTIN) {
                    $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam);
                    if ($scope.selectedProductInputParamCopy.GSTIN) {
                        $scope.GSTINCopy = $scope.selectedProductInputParamCopy.GSTIN;
                    } else {
                        $scope.GSTINCopy = '';
                    }
                    $scope.newGSTINNumber = selGSTIN;
                    if ($scope.newGSTINNumber != $scope.GSTINCopy) {
                        $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                        $scope.selectedProductInputParam.GSTIN = $scope.newGSTINNumber;
                        if ($scope.selectedProductInputParamCopy.vehicleInfo.registrationNumber) {
                            $scope.selectedProductInputParam.vehicleInfo.registrationNumber = $scope.selectedProductInputParamCopy.vehicleInfo.registrationNumber;
                        }

                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.GSTINNumberChangeMsg, "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;
                                // $scope.quote = {};

                                // $scope.quote = $scope.selectedProductInputParam;
                                // if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                //     $scope.quote.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                                // }
                                $scope.carQuoteRequestFormation($scope.selectedProductInputParam);
                                RestAPI.invoke($scope.p365Labels.getRequest.quoteCar, $scope.quote).then(function (proposeFormResponse) {
                                    $scope.carRecalculateQuoteRequest = [];
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                        $scope.responseRecalculateCodeList = [];
                                        $scope.quoteCalcResponse = [];

                                        if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                                            $scope.quoteCalcResponse.length = 0;
                                        }
                                        /*if($scope.selectedProductInputParam.vehicleInfo.registrationNumber){
                                        	delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                        }*/
                                        //localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("CAR_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                        $scope.carRecalculateQuoteRequest = proposeFormResponse.data;
                                        angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.messageId = messageIDVar;
                                            header.campaignID = campaignIDVar;
                                            header.source = sourceOrigin;
                                            header.transactionName = getCarQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var carQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(carQuoteResponse.responseCode);
                                                    if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                        if (carQuoteResponse.data != null) {
                                                            if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                            $scope.loading = false;
                                                            angular.copy($scope.selectedProductInputParam, $scope.selectedProductInputParamCopy);
                                                            $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                                            $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                                            /*if($scope.selectedProductInputParam.vehicleInfo.registerNumber){
                                                            	delete $scope.selectedProductInputParam.vehicleInfo.registerNumber
                                                            }*/
                                                        }
                                                    }
                                                        $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);
                                                    } else {
                                                        $scope.loading = false;
                                                        if (carQuoteResponse.data != null) {
                                                            if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                            $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                                            $scope.selectedProductInputParam.vehicleInfo.registrationNumber = '';
                                                            $scope.vehicleInfo.registrationNumber = '';
                                                            $scope.proposerDetails.GSTIN = '';
                                                            if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                                                delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                                            }
                                                            localStorageService.set("carQuoteInputParamaters", $scope.selectedProductInputParam);
                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.GSTINNumberScreenConfirmErrorMsg
                                                            $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                                                        }
                                                    }
                                                    }
                                                })
                                                .error(function (data, status) {
                                                    delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                                    $scope.proposerDetails.GSTIN = '';
                                                    $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                    $scope.loading = false;
                                                });
                                        });
                                    } else {
                                        $scope.loading = false;
                                        $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                        $scope.vehicleInfo.registrationNumber = '';
                                        $scope.proposerDetails.GSTIN = '';
                                        if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                            delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                        }
                                        localStorageService.set("carQuoteInputParamaters", $scope.selectedProductInputParam);
                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.GSTINNumberScreenConfirmErrorMsg
                                        $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                                    }
                                });
                            } else {
                                //$scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                $scope.selectedProductInputParam = $scope.selectedProductInputParamCopy;
                                if ($scope.selectedProductInputParam.GSTIN) {
                                    $scope.proposerDetails.GSTIN = $scope.selectedProductInputParam.GSTIN;
                                } else {
                                    $scope.proposerDetails.GSTIN = '';
                                }
                            }
                        });
                    }
                    /*else{
                    						$scope.proposerDetails.communicationAddress = item;
                    						$scope.displayArea = item.area + ", " + item.city;
                    						$scope.proposerDetails.area = item.area;
                    						$scope.proposerDetails.pincode = item.pincode;
                    						$scope.proposerDetails.city = item.city;
                    						$scope.proposerDetails.state = item.state;
                    						$scope.checkForSameAddress();
                    					}*/

                    /*$scope.loadPlaceholder();
                    localStorageService.set("userGeoDetails", item);*/
                };

                //check communication & permanent address
                $scope.checkForSameAddress = function () {
                if ($scope.vehicleDetails.isVehicleAddressSameAsCommun) {
                $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.proposerDetails.communicationAddress.comDoorNo;
                $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
                $scope.vehicleDetails.registrationAddress.regPincode =$scope.proposerDetails.communicationAddress.comPincode;          
                $scope.vehicleDetails.registrationAddress.regCity = $scope.proposerDetails.communicationAddress.comCity;
                $scope.vehicleDetails.registrationAddress.regState =$scope.proposerDetails.communicationAddress.comState;            
                   }
                }
                // Method to get list of pincodes
                $scope.getPinCodeAreaList = function (searchValue) {
                    var docType = $scope.p365Labels.documentType.cityDetails;
                    var carrierId = $scope.responseProduct.carrierId;

                    return $http.get(getSearchServiceLink + docType + "&q=" + searchValue + "&id=" + carrierId).then(function (response) {
                        return JSON.parse(response.data).data;
                    });
                };

                $scope.changeNomineeRelation = function () {
                    if (String($scope.nominationInfo.nominationRelation) != "undefined") {
                        $scope.nominationDetails.nominationRelation = $scope.nominationInfo.nominationRelation.relationship;
                        $scope.nominationDetails.nominationRelationId = $scope.nominationInfo.nominationRelation.relationshipId;
                    }
                    if ($scope.responseProduct.proposalRequest.nominationDetails)
                        $scope.nomineeDetailsForm.$dirty = false;
                };
                $scope.changeAppointeeRelation = function () {
                    if (String($scope.appointeeInfo.appointeeRelation) != "undefined") {
                        $scope.appointeeDetails.appointeeRelation = $scope.appointeeInfo.appointeeRelation.relationship;
                        $scope.appointeeDetails.appointeeRelationId = $scope.appointeeInfo.appointeeRelation.relationshipId;
                    }
                };

                $scope.validAppointeeRelation = function (relation) {
                    if (relation.isApointeeRelationship == "Y")
                        return relation.relationship;
                };

                $scope.validateNomineeDateOfBirth = function () {
                    $scope.nominationDetails.nomPersonAge = getAgeFromDOB($scope.nominationDetails.nomDateOfBirth);
                    if ($scope.nominationDetails.nomPersonAge < 18) {
                        $scope.appointeeStatus = true;

                        // Setting properties for appointee DOB date-picker.
                        var appointeeDOBOption = {};
                        appointeeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMaxLimit + "Y";
                        appointeeDOBOption.maximumYearLimit = "-18Y";
                        appointeeDOBOption.changeMonth = true;
                        appointeeDOBOption.changeYear = true;
                        appointeeDOBOption.dateFormat = "dd/mm/yy";
                        $scope.appointeeDOBOptions = setP365DatePickerProperties(appointeeDOBOption);
                    } else {
                        $scope.appointeeStatus = false;
                    }
                    $scope.relationList = $scope.relationList;
                };

                $scope.calculateAppointeeAge = function () {
                    $scope.appointeeDetails.appointeePersonAge = getAgeFromDOB($scope.appointeeDetails.appointeeDateOfBirth);
                };

                $scope.calculateProposerAge = function () {
                    $scope.proposerDetails.personAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
                };

                $scope.validateAadhar = function () {
                    $scope.proposerDetails.aadharNumber = $scope.proposerDetails.aadharNumber;
                };

                $scope.validateGSTN = function () {
                    $scope.proposerDetails.GSTN = $scope.proposerDetails.GSTN;
                };

                //added for validating registration number
                $scope.validateRegistrationNumber = function (registrationNumber) {
                    if (String(registrationNumber) != "undefined") {
                        registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
                        if ((registrationNumber.trim()).match(/^[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 7 && (registrationNumber.trim()).length >= 2) {
                            $scope.regNumStatus = false;
                            $scope.vehicleDetailsForm.RegistrationNumber.$setValidity('RegistrationNumber', true);
                            if ($scope.productValidation.regNumberReQuoteCalc)
                                $scope.calcQuoteOnRegistrationNumber(registrationNumber);
                        } else {
                            $scope.regNumStatus = true;
                            $scope.vehicleDetailsForm.RegistrationNumber.$setValidity('RegistrationNumber', false);
                        }
                        $scope.vehicleInfo.registrationNumber = registrationNumber.trim();
                    }
                }

                //end
            });
            $scope.closeModal = function () {
                $scope.modalPrevPolExpiredError = false;
            }

            $scope.backToResultScreen = function () {
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    $rootScope.mainTabsMenu[0].active = true;
                    $rootScope.mainTabsMenu[1].active = false;
                    if ($scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED) {
                        $location.path("/sharefromAPI").search({docId:$scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: $scope.p365Labels.businessLineType.car });
                    } else {
                        $location.path("/sharefromAPI").search({docId:$scope.carProposeFormDetails.QUOTE_ID, LOB: $scope.p365Labels.businessLineType.car });
                    }
                } else { 
                    if ($scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED) {
                        var shareURL = shareQuoteLink + $scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED;
                        console.log('encrypted quote id found with share url as: ', shareURL);
                        $window.location.href = shareURL;
                        // $location.path("/sharefromAPI").search({ docId: $scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: $scope.p365Labels.businessLineType.car });
                    } else {
                        // $location.path("/sharefromAPI").search({ docId: $scope.carProposeFormDetails.QUOTE_ID, LOB: $scope.p365Labels.businessLineType.car });
                       var shareURL = shareQuoteLink + $scope.carProposeFormDetails.QUOTE_ID;
                       console.log(' no encrypted quote id found with share url as: ', shareURL);
                        $window.location.href = shareURL;
                    }
                }
            }
        });
    }]);