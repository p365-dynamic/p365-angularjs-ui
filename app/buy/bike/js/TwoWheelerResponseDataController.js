/*
 * Description	: This controller file for bike proposal response data result.
 * Author		: Sayli Boralkar
 * Date			: 21 Aug 2017
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */
// var messageIDVar;
angular.module('proposalresdatabike', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('proposalResponseDataBikeController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function ($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce) {
        loadDatbase(function () {
            $scope.bikeProposalSectionHTML = wp_path + 'buy/bike/html/BikeProposalSection.html';
            // $http.get(wp_path+'ApplicationLabels.json').then(function (applicationCommonLabels) {
            // 	$scope.globalLabel = applicationCommonLabels.data.globalLabels;
            // 	localStorageService.set("applicationLabels", applicationCommonLabels.data);


            if (agencyPortalEnabled) {
                if ($location.search().rampUniqueId && $location.search().url) {
                    localStorageService.set("rampUniqueId", $location.search().rampUniqueId);
                    localStorageService.set("rampRedirectURL", $location.search().url);
                }
            }

            if (!$rootScope.customEnvEnabled) {
                $rootScope.customEnvEnabled = customEnvEnabled;
            }if (!$rootScope.baseEnvEnabled) {
                $rootScope.baseEnvEnabled = baseEnvEnabled;
            }

            $scope.p365Labels = bikePreoposalLabels;
            $rootScope.loaderContent = { businessLine: '2', header: 'Bike Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };
            $rootScope.title = $scope.p365Labels.policies365Title.bikeBuyQuote;
            $rootScope.loading = true;
            $scope.changeCompanyName = false;
            $scope.saveProposal = false;
            $scope.saveNomineeDetails = false;
            $scope.savePrevPolicyDetails = false;
            $scope.modalPropScreenError = false;
            $scope.modalPrevPolExpiredError = false;
            $scope.redirectForPayment = false;
            $scope.policytransaction = {};
            $scope.proposerInfo = {};
            $scope.proposerDetails = {};
            $scope.proposerDetails.communicationAddress = {};
            $scope.vehicleInfo = {};
            $scope.vehicleDetails = {};
            $scope.vehicleDetails.registrationAddress = {};
            $scope.nominationInfo = {};
            $scope.nominationDetails = {};
            $scope.appointeeInfo = {};
            $scope.appointeeDetails = {};
            $scope.previousPolicyStatus = {};
            $scope.insuranceInfo = {};
            $scope.vehicleInfo.insuranceType = {}
            $scope.insuranceDetails = {};
            $scope.bikeProposalResponse = {};
            $scope.paymentResponse = {};
            $scope.bikePolicyResponse = {};
            $scope.prevPolDetails = {};
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = false;
            $scope.screenFourStatus = false;
            $scope.submitProposalClicked = false;
            var isPrevPolSameAsNew = false;
            var isPolicyRenewed = false;

            $scope.accordion = '1';
            $scope.editPesonalInfo = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = false;
                $scope.accordion = '1';
            }

            $scope.editNomineeInfo = function () {
                $scope.screenOneStatus = false;
                $scope.screenTwoStatus = false;
                $scope.screenThreeStatus = true;
                $scope.accordion = '3';
            }

            // // function used to make the selected  proposaal section  visible 
            // $scope.controlProposalScreen = function(screenNumber){
            //     $scope.screenOneStatus = false;
            //     $scope.screenTwoStatus = false;
            //     $scope.screenThreeStatus = false;
            //     $scope.screenFourStatus = false;
            //     $scope.screenFiveStatus = false;

            //     // select the accordian Number 
            //     $scope.accordion = String(screenNumber)                  
            //     switch(screenNumber) {
            //         case 1:
            //           $scope.screenOneStatus = true;
            //           break;
            //           case 2:
            //            $scope.screenTwoStatus = true;
            //           break;
            //           case 3:
            //            $scope.screenThreeStatus = true;
            //           break;
            //           case 4:
            //           $scope.screenFourStatus = true;
            //           break;
            //           case 5:
            //           $scope.screenFiveStatus = true;
            //           break;

            //         default:
            //         // default visible  screen is  one 
            //          $scope.screenOneStatus = true;                   

            //       }
            // }

            $scope.editAddressInfo = function () {
                $scope.screenOneStatus = false;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = false;
                $scope.screenFourStatus = false;
                $scope.screenFiveStatus = false;
                $scope.accordion = '2';
            }

            $scope.editPrevPolicyInfo = function () {
                $scope.screenOneStatus = false;
                $scope.screenTwoStatus = false;
                $scope.screenThreeStatus = false;
                $scope.screenFourStatus = true;
                $scope.accordion = '4';
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
                //$scope.splitAddressField();
                // if (!$scope.vehicleDetails.isVehicleAddressSameAsCommun) {
                //     $scope.splitVehicleAddressField();
                // }

                //added by gauri for imautic
                if (imauticAutomation == true) {
                    imatEvent('ProposalFilled');
                }
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.ownerDetailsForm.$dirty || $scope.changeCompanyName) {
                        //$scope.responseProduct.proposalRequest.premiumDetails=$scope.premiumDetails;
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
                /*	var temp = {};
                	if(String($scope.nominationDetails) === String(temp)){
                		$scope.nomineeDetailsForm.dateOfBirth.$setValidity('dateOfBirth',false);
                		$scope.nomineeDetailsForm.firstName.$setValidity('firstName',false); 
                		$scope.nomineeDetailsForm.lastName.$setValidity('lastName',false);
                	}
                */
            }
            $scope.submitAddressDetails = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = false;
                $scope.screenFiveStatus = false;
                $scope.Section3Inactive = false;
                $scope.accordion = '3';
                //$scope.splitAddressField();
                // if (!$scope.vehicleDetails.isVehicleAddressSameAsCommun) {
                //     $scope.splitVehicleAddressField();
                // } else {
                //     //commented with doubt
                //     /*$scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
                //     $scope.vehicleDetails.doorNo = $scope.proposerDetails.doorNo;
                //     $scope.vehicleDetails.city = $scope.proposerDetails.communicationAddress.comCity;
                //     $scope.vehicleDetails.state = $scope.proposerDetails.communicationAddress.comState;
                //     $scope.vehicleDetails.pincode = $scope.proposerDetails.communicationAddress.comPincode;
                //     $scope.vehicleDetails.addressLine1 = $scope.proposerDetails.addressLine1;
                //     $scope.vehicleDetails.addressLine2 = $scope.proposerDetails.addressLine2;*/
                // }
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

            $scope.bikeQuoteRequestFormation = function (bikeQuoteRequestParam) {
                $scope.quote = {};
                $scope.quote.vehicleInfo={};
                $scope.quote.quoteParam={};
     
                $scope.quote.vehicleInfo.IDV = bikeQuoteRequestParam.vehicleInfo.IDV;
                $scope.quote.vehicleInfo.PreviousPolicyExpiryDate = bikeQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
                $scope.quote.vehicleInfo.TPPolicyExpiryDate = bikeQuoteRequestParam.vehicleInfo.TPPolicyExpiryDate;
                $scope.quote.vehicleInfo.TPPolicyStartDate = bikeQuoteRequestParam.vehicleInfo.TPPolicyStartDate;
                $scope.quote.vehicleInfo.ODPolicyExpiryDate = bikeQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
                $scope.quote.vehicleInfo.RTOCode = bikeQuoteRequestParam.vehicleInfo.RTOCode;
                $scope.quote.vehicleInfo.city = bikeQuoteRequestParam.vehicleInfo.city;
                if(bikeQuoteRequestParam.vehicleInfo.dateOfRegistration){
                    $scope.quote.vehicleInfo.dateOfRegistration = bikeQuoteRequestParam.vehicleInfo.dateOfRegistration;
               }
               $scope.quote.vehicleInfo.idvOption = bikeQuoteRequestParam.vehicleInfo.idvOption;
               $scope.quote.vehicleInfo.best_quote_id = bikeQuoteRequestParam.vehicleInfo.best_quote_id;
               $scope.quote.vehicleInfo.previousClaim = bikeQuoteRequestParam.vehicleInfo.previousClaim;
               $scope.quote.vehicleInfo.registrationNumber = bikeQuoteRequestParam.vehicleInfo.registrationNumber;
               $scope.quote.vehicleInfo.registrationPlace = bikeQuoteRequestParam.vehicleInfo.registrationPlace;
               $scope.quote.vehicleInfo.state = bikeQuoteRequestParam.vehicleInfo.state;
               $scope.quote.vehicleInfo.make = bikeQuoteRequestParam.vehicleInfo.make;
               $scope.quote.vehicleInfo.model = bikeQuoteRequestParam.vehicleInfo.model;
               $scope.quote.vehicleInfo.variant = bikeQuoteRequestParam.vehicleInfo.variant.toString();
               $scope.quote.quoteParam.ncb = bikeQuoteRequestParam.quoteParam.ncb;
               $scope.quote.quoteParam.ownedBy = bikeQuoteRequestParam.quoteParam.ownedBy;
               $scope.quote.quoteParam.policyType = bikeQuoteRequestParam.quoteParam.policyType;
               $scope.quote.quoteParam.riders = bikeQuoteRequestParam.quoteParam.riders; 
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
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.isPolicyNumber == false || $scope.prevPolicyDetailsForm.$dirty) {
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
            var request = {};
            request.proposalId = $location.search().proposalId;
            request.businessLineId = $scope.p365Labels.businessLineType.bike;
            $scope.selectedProduct = [];
            //$scope.insuranceDetails={};
            $scope.premiumDetails = {};
            $scope.premiumDetails.discountList = [];
            //$scope.proposerDetails=[];
            $scope.nominationInfo = [];
            //$scope.nominationDetails={};
            $scope.insuranceInfo = [];
            $scope.insuranceInfo.insurerName = [];
            $scope.selectedProductInputParam = [];
            $scope.vehicleInfo = [];
            //$scope.vehicleDetails=[]
            $scope.selectedProductInputParam.vehicleInfo = [];
            $scope.proposalStatus = [];
            $scope.proposalStatusForm = [];
            $scope.undertakingStatus = [];
            $scope.quoteUserInfo = {};
            $scope.bikeProposeFormDetails = [];


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

            RestAPI.invoke("proposalDataReader", request).then(function (callback) {
                if (callback.responsecode == $scope.p365Labels.responseCode.success) {
                    $scope.responseProduct = callback.data.PolicyTransaction;
                    /**
                     * This block of code is responsible to updated iquote and ipos urls.
                     */
                    console.log("$scope.responseProduct.bikeProposalResponse is :",$scope.responseProduct.bikeProposalResponse);
                        if($scope.responseProduct.bikeProposalResponse){
                            isPolicyRenewed = $scope.responseProduct.bikeProposalResponse.renewalPlan;
                        }
                    
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
                    $scope.bikeProposeFormDetails.carrierId = $scope.responseProduct.carrierId;
                    $scope.bikeProposeFormDetails.productId = $scope.responseProduct.productId;
                    $scope.bikeProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                    //$scope.bikeProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.responseProduct.encryptedQuoteId;
                    $scope.bikeProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.bike;
                    //$scope.bikeProposeFormDetails.requestType = $scope.p365Labels.request.bikePropRequestType;
                   // messageIDVar = $scope.responseProduct.leadMessageId;
                    messageIDVar = $scope.responseProduct.messageId;

                    // Adding campaign from proposal
                    campaign_id = $scope.responseProduct.campaign_id;
                    requestSource = $scope.responseProduct.requestSource;
                    sourceOrigin = $scope.responseProduct.source;
                    $scope.selectedProduct.userName = $scope.responseProduct.userName;
                    $scope.selectedProduct.agencyId = $scope.responseProduct.agencyId;
                    $scope.bikeProposeFormDetails.agencyId = $scope.responseProduct.agencyId;
                    $scope.bikeProposeFormDetails.userName = $scope.responseProduct.userName
                   // $scope.selectedProduct.grossPremium = $scope.responseProduct.proposalRequest.premiumDetails.grossPremium;

                    if ($scope.responseProduct.referralCode) {
                        $scope.referralCode = $scope.responseProduct.referralCode;
                    }

                    var buyScreenParam = {};
                    buyScreenParam.documentType = "proposalScreenConfig";
                    buyScreenParam.businessLineId = Number($scope.p365Labels.businessLineType.bike);
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

                            getDocUsingIdQuoteDB(RestAPI, $scope.bikeProposeFormDetails.QUOTE_ID, function (quoteCalcDetails) {
                                var quoteCalcRequest = {};
                                $scope.quote = {};
                                $scope.quoteCalcResponse = quoteCalcDetails.bikeQuoteResponse;
                                quoteCalcRequest = quoteCalcDetails.bikeQuoteRequest;
                                if(quoteCalcDetails.bikeQuoteRequest.systemPolicyStartDate){
                                $scope.policyStartDate = quoteCalcDetails.bikeQuoteRequest.systemPolicyStartDate.sysPolicyStartDate;
                                $scope.policyEndDate = quoteCalcDetails.bikeQuoteRequest.systemPolicyStartDate.sysPolicyEndDate;
                                }
                                $scope.vehicleInfoCopy = quoteCalcRequest.vehicleInfo;
                               // $scope.vehicleInfo = quoteCalcRequest.vehicleInfo;                           
                               $scope.vehicleInfo={};
                               $scope.vehicleInfo.IDV = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.IDV;
                                $scope.vehicleInfo.PreviousPolicyExpiryDate = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                $scope.vehicleInfo.TPPolicyExpiryDate = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.TPPolicyExpiryDate;
                                $scope.vehicleInfo.TPPolicyStartDate = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.TPPolicyStartDate;
                               // $scope.vehicleInfo.ODPolicyExpiryDate = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.ODPolicyExpiryDate;
                                $scope.vehicleInfo.RTOCode = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.RTOCode;
                               $scope.vehicleInfo.city = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.city;
                               if(quoteCalcDetails.bikeQuoteRequest.vehicleInfo.dateOfRegistration){
                               $scope.vehicleInfo.dateOfRegistration = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.dateOfRegistration;
                               var bikeRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/"); 
                               $scope.vehicleDetails.regYear = bikeRegistrationYearList[2] ;
                              }
                                $scope.vehicleInfo.idvOption = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.idvOption;
                                $scope.vehicleInfo.best_quote_id = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.best_quote_id;
                                $scope.vehicleInfo.previousClaim = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.previousClaim;
                                $scope.vehicleInfo.registrationNumber = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.registrationNumber;
                                $scope.vehicleInfo.registrationPlace = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.registrationPlace;
                                $scope.vehicleInfo.state = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.state;
                                if(quoteCalcDetails.bikeQuoteRequest.vehicleInfo.make){
                                $scope.vehicleInfo.make = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.make;
                                }else if(quoteCalcDetails.bikeQuoteRequest.vehicleInfo.name){
                                $scope.vehicleInfo.make = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.name;
                                }
                                $scope.vehicleInfo.model = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.model;
                                if(quoteCalcDetails.bikeQuoteRequest.vehicleInfo.variant){
                                $scope.vehicleInfo.variant = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.variant.toString();
                                }
                                //$scope.quoteParam = quoteCalcRequest.quoteParam;
                                $scope.quoteParam={};
                                $scope.quoteParam.ncb = quoteCalcDetails.bikeQuoteRequest.quoteParam.ncb;
                                $scope.quoteParam.ownedBy = quoteCalcDetails.bikeQuoteRequest.quoteParam.ownedBy;
                                $scope.quoteParam.policyType = quoteCalcDetails.bikeQuoteRequest.quoteParam.policyType;
                                $scope.quoteParam.riders = quoteCalcDetails.bikeQuoteRequest.quoteParam.riders;
                              

                                $scope.quote.quoteParam = $scope.quoteParam;
                                $scope.quote.vehicleInfo = $scope.vehicleInfo;

                                $scope.prevPolDetails.prevPolicyStartDate = quoteCalcDetails.bikeQuoteRequest.vehicleInfo.PreviousPolicyStartDate;
                                $scope.prevPolDetails.prevPolicyEndDate = $scope.vehicleInfo.PreviousPolicyExpiryDate;
                                quoteCalcRequest.carrierId = $scope.responseProduct.carrierId;
                                quoteCalcRequest.productId = $scope.responseProduct.productId;
                                for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                                    //if ($scope.quoteCalcResponse[i].carrierId == $scope.responseProduct.proposalRequest.premiumDetails.carrierId) {
                                        if ($scope.quoteCalcResponse[i].carrierId == $scope.responseProduct.carrierId && $scope.quoteCalcResponse[i].productId == $scope.responseProduct.productId) {
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
                               
                                localStorageService.set("bikeQuoteInputParamaters",$scope.quote);
                                if ($scope.productValidation.reQuoteCalc) {
                                    if (!quoteCalcRequest.vehicleInfo.best_quote_id)
                                        quoteCalcRequest.vehicleInfo.best_quote_id = quoteCalcRequest.QUOTE_ID;
                                    localStorageService.set("bike_best_quote_id", quoteCalcRequest.QUOTE_ID);
                           
                                    $scope.bikeQuoteRequestFormation(quoteCalcRequest);
                                    RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {
                                    //RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, quoteCalcRequest).then(function (proposeFormResponse) {
                                        $scope.carRecalculateQuoteRequest = [];
                                        if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                            $scope.responseRecalculateCodeList = [];
                                            $scope.responseProduct.QUOTE_ID = proposeFormResponse.QUOTE_ID;
                                            //localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                            localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                            localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                            $scope.carRecalculateQuoteRequest = proposeFormResponse.data;

                                            $scope.quoteCalcResponse = [];
                                            angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.transactionName = $scope.p365Labels.transactionName.bikeQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                    success(function (callback, status) {
                                                        var bikeQuoteResponse = JSON.parse(callback);
                                                        $scope.responseRecalculateCodeList.push(bikeQuoteResponse.responseCode);
                                                        if (bikeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                            if (bikeQuoteResponse.data != null){
                                                                if(bikeQuoteResponse.data.quotes[0]){
                                                                if(bikeQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                bikeQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId) {
                                                                $scope.loading = false;
                                                                $scope.premiumDetails.selectedProductDetails = bikeQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = bikeQuoteResponse.data.quotes[0];
                                                                $scope.proposalDataReader();
                                                            }
                                                            bikeQuoteResponse.data.quotes[0].id = bikeQuoteResponse.messageId;
                                                            $scope.quoteCalcResponse.push(bikeQuoteResponse.data.quotes[0]);
                                                          }
                                                        }
                                                        } else {
                                                            if (bikeQuoteResponse.data != null) {
                                                                if(bikeQuoteResponse.data.quotes[0]){
                                                                if(bikeQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                bikeQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId) {
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
                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.proposalFormErrorMsg, "Ok");
                }

                $scope.proposalDataReader = function () {
                    getDocUsingId(RestAPI, "relationshipdetailslist", function (relationList) {
                        $scope.relationList = relationList.relationships;

                        getListFromDB(RestAPI, "", carCarrier, findAppConfig, function (carCarrierList) {
                            if (carCarrierList.responseCode == $scope.p365Labels.responseCode.success) {
                                //localStorageService.set("carCarrierList", carCarrierList.data);
                                $scope.carrierList = carCarrierList.data;
                            }
                        });

                    });
                    $scope.responseProduct = callback.data.PolicyTransaction;
                    $rootScope.loading = false;

                    if ($scope.responseProduct.proposalRequest.insuranceDetails) {
                        $scope.insuranceDetails.ODPolicyEndDate = $scope.responseProduct.proposalRequest.insuranceDetails.ODPolicyEndDate;
                        $scope.insuranceDetails.insuranceType = $scope.responseProduct.proposalRequest.insuranceDetails.insuranceType
                        // $scope.insuranceDetails.isNCB = $scope.responseProduct.proposalRequest.insuranceDetails.isNCB;
                       // $scope.insuranceDetails.isPrevPolicy = $scope.responseProduct.proposalRequest.insuranceDetails.isPrevPolicy;
                        $scope.insuranceDetails.insurerName = $scope.responseProduct.proposalRequest.insuranceDetails.insurerName;
                        $scope.insuranceDetails.insurerId = $scope.responseProduct.proposalRequest.insuranceDetails.insurerId;

                        if ($scope.insuranceDetails.insuranceType == 'new') {
                            $scope.previousPolicyStatus = false;
                        } else {
                            $scope.previousPolicyStatus = true;
                        }
                        if ($scope.previousPolicyStatus) {
                            $scope.insuranceDetails.policyNumber = $scope.responseProduct.proposalRequest.insuranceDetails.policyNumber;

                            if ($scope.responseProduct.proposalRequest.insuranceDetails.insurerName) {

                                var insurerName = {};
                                insurerName.carrierName = $scope.responseProduct.proposalRequest.insuranceDetails.insurerName;
                                insurerName.carrierId = $scope.responseProduct.proposalRequest.insuranceDetails.insurerId;
                                //$scope.insuranceInfo.insurerName = insurerName;
                                $scope.insuranceInfo.insurerName = insurerName;
                            }
                            $scope.insuranceDetails.prevPolicyStartDate = $scope.responseProduct.proposalRequest.insuranceDetails.prevPolicyStartDate;
                            $scope.insuranceDetails.prevPolicyEndDate = $scope.responseProduct.proposalRequest.insuranceDetails.prevPolicyEndDate;
                            // if ($scope.responseProduct.proposalRequest.insuranceDetails.previousPolicyExpired) {
                            //     $scope.insuranceDetails.previousPolicyExpired = $scope.responseProduct.proposalRequest.insuranceDetails.previousPolicyExpired;
                            // }
                            $scope.insuranceDetails.ncb = $scope.responseProduct.proposalRequest.insuranceDetails.ncb;
                            $scope.insuranceDetails.prevPolicyType = $scope.responseProduct.proposalRequest.insuranceDetails.prevPolicyType;
                        } else {
                            if($scope.responseProduct.proposalRequest.insuranceDetails.ncb){
                            $scope.insuranceDetails.ncb = $scope.responseProduct.proposalRequest.insuranceDetails.ncb;
                            }else{
                            $scope.insuranceDetails.ncb  = 0;
                            }
                            $scope.insuranceDetails.policyNumber = "";
                            $scope.insuranceInfo.insurerName = "";
        
                            // $scope.prevPolDetails.prevPolicyStartDate = "";
                            // $scope.prevPolDetails.prevPolicyEndDate = "";                         
                        }
                    }

                    if ($scope.responseProduct.proposalRequest.proposerDetails) {
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
                        if($scope.responseProduct.proposalRequest.proposerDetails.panNumber){
                        $scope.proposerDetails.panNumber = $scope.responseProduct.proposalRequest.proposerDetails.panNumber;
                        }
                        if($scope.proposerDetails.communicationAddress){
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
                    }
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
                            $scope.appointeeDetails.firstName = $scope.responseProduct.proposalRequest.appointeeDetails.firstName;
                            $scope.appointeeDetails.lastName = $scope.responseProduct.proposalRequest.appointeeDetails.lastName;
                            $scope.appointeeDetails.dateOfBirth = $scope.responseProduct.proposalRequest.appointeeDetails.dateOfBirth;

                            if ($scope.responseProduct.proposalRequest.appointeeDetails.appointeeRelation) {
                                $scope.appointeeInfo.appointeeRelation = {};
                                $scope.appointeeInfo.appointeeRelation.relationship = $scope.responseProduct.proposalRequest.appointeeDetails.appointeeRelation;
                                $scope.appointeeInfo.appointeeRelation.relationshipId = $scope.responseProduct.proposalRequest.appointeeDetails.appointeeRelationId;
                            }
                        }
                    }
                    $scope.quoteUserInfo.termsCondition = true;
                    localStorageService.set("quoteUserInfo", $scope.quoteUserInfo)

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
                   
                    if ($scope.responseProduct.proposalRequest.vehicleDetails) {
                        /* This block of code is added because some times RTO code is not getting recorded in proposal request,
                         * So we are fetching RTO code by reading quote document and adding into vehicle details so that it can be recorded in proposal.
                         * $scope.vehicleInfoCopy node is representing vehicleInfo node of quoteRequest.
                         * */
                        //  console.log("vehicleInfoCopy step 2: ",$scope.vehicleInfoCopy);
                        //$scope.responseProduct.proposalRequest.vehicleDetails.RTOCode = $scope.vehicleInfoCopy.RTOCode;
                        $scope.vehicleDetails.isVehicleAddressSameAsCommun=$scope.responseProduct.proposalRequest.vehicleDetails.isVehicleAddressSameAsCommun;
                        $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regDoorNo;
                        $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regDisplayArea;
                        $scope.vehicleDetails.registrationAddress.regPincode = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regPincode;
                        $scope.vehicleDetails.registrationAddress.regCity = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regCity;
                        $scope.vehicleDetails.registrationAddress.regState = $scope.responseProduct.proposalRequest.vehicleDetails.registrationAddress.regState;

                        $scope.selectedProductInputParam.vehicleInfo.name = $scope.responseProduct.proposalRequest.vehicleDetails.make;
                        $scope.selectedProductInputParam.vehicleInfo.model = $scope.responseProduct.proposalRequest.vehicleDetails.model;
                        $scope.selectedProductInputParam.vehicleInfo.variant = $scope.responseProduct.proposalRequest.vehicleDetails.variant;
                        var regDate = $scope.vehicleInfo.dateOfRegistration.split("/");
                        $scope.displayRegistrationDate = regDate[0] + "-" + monthListGeneric[Number(regDate[1]) - 1] + "-" + regDate[2];
                        $scope.vehicleInfo.manufacturingYear = regDate[2] ;
                        //$scope.displayRegistrationDate = $scope.responseProduct.proposalRequest.vehicleDetails.registrationDate;
                        //$scope.vehicleInfo.manufacturingYear = $scope.responseProduct.proposalRequest.vehicleDetails.manufacturingYear;
                        $scope.vehicleDetails.engineNumber = $scope.responseProduct.proposalRequest.vehicleDetails.engineNumber;
                        $scope.vehicleDetails.chassisNumber = $scope.responseProduct.proposalRequest.vehicleDetails.chassisNumber;
                        $scope.vehicleDetails.registrationNumber = $scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber;
                        if($scope.responseProduct.proposalRequest.vehicleDetails.financeInstitution)
                        $scope.vehicleDetails.financeInstitution = $scope.responseProduct.proposalRequest.vehicleDetails.financeInstitution;
                        if($scope.responseProduct.proposalRequest.vehicleDetails.financeInstitutionCode)
                        $scope.vehicleDetails.financeInstitutionCode= $scope.responseProduct.proposalRequest.vehicleDetails.financeInstitutionCode;
                        if ($scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber) {
                            var formatRegisCode = $scope.responseProduct.proposalRequest.vehicleDetails.registrationNumber;
                            $scope.vehicleInfo.registrationNumber = formatRegisCode.substring(4);
                        }
                        $scope.vehicleDetails.RTOCode = $scope.responseProduct.proposalRequest.vehicleDetails.RTOCode;

                        if (!$scope.responseProduct.proposalRequest.vehicleDetails.purchasedLoan) {
                            $scope.vehicleInfo.vehicleLoanType = "";
                            if ($scope.responseProduct.proposalRequest.vehicleDetails.vehicleLoanType) {
                                if ($scope.responseProduct.proposalRequest.vehicleDetails.vehicleLoanType.id == 1 || $scope.responseProduct.proposalRequest.vehicleDetails.vehicleLoanType.id == 2) {
                                    $scope.vehicleDetails.financeInstitution = $scope.responseProduct.proposalRequest.vehicleDetails.financeInstitution;
                                }
                            }
                            $scope.vehicleDetails.purchasedLoan = $scope.responseProduct.proposalRequest.vehicleDetails.purchasedLoan;
                        } else {
                            $scope.vehicleDetails.purchasedLoan = $scope.responseProduct.proposalRequest.vehicleDetails.purchasedLoan;
                        }
                        if ($scope.responseProduct.proposalRequest.vehicleDetails.vehicleLoanType) {
                            for (var i = 0; i < $scope.vehicleLoanTypes.length; i++) {
                                if ($scope.vehicleLoanTypes[i].name == $scope.responseProduct.proposalRequest.vehicleDetails.vehicleLoanType) {
                                    var vehicleLoanType = {};
                                    vehicleLoanType.id = $scope.vehicleLoanTypes[i].id;
                                    vehicleLoanType.name = $scope.responseProduct.proposalRequest.vehicleDetails.vehicleLoanType;
                                    $scope.vehicleInfo.vehicleLoanType = vehicleLoanType;
                                }
                            }
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
                        //for KOTAK
                    if ($scope.productValidation.isFinanceCode) {
                        $scope.vehicleDetails.financeInstitutionCode = item.financerId;
                    } 
                        $scope.loadPlaceholder();
                    };

                    $scope.loadPlaceholder = function () {sp
                        setTimeout(function () {
                            $('.buyform-control').on('focus blur', function (e) {
                                $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
                            }).trigger('blur');
                        }, 100);
                    };
                    /*var res =String($scope.responseProduct.proposalRequest.vehicleDetails.registrationNumberFormatted);
				$scope.vehicleDetails.registrationNumber = res.replace(/-/g ,"");*/
                    //$scope.vehicleDetails.RTOCode=$scope.responseProduct.proposalRequest.vehicleDetails.RTOCode;					$scope.pucStatus = true;
                    $scope.undertakingStatus = true;

                    $scope.proposalStatusform = true;

                    if ($scope.responseProduct.bikeProposalResponse != null) {
                        $scope.proposalStatus.statusDateProp = $scope.responseProduct.bikeProposalResponse.updatedDate;
                        $scope.proposalStatus.proposalId = $scope.responseProduct.bikeProposalResponse.proposalId;
                        $scope.proposalStatus.statusProp = "completed";
                    }
                    if ($scope.responseProduct.paymentResponse != null) {
                        if ($scope.responseProduct.paymentResponse.transactionStatusCode == 1) {
                            $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                            $scope.proposalStatus.preferId = $scope.responseProduct.paymentResponse.apPreferId;
                            $scope.proposalStatus.statusPaym = "completed";
                            $scope.disablePaymentButton = true;

                        } else if ($scope.responseProduct.paymentResponse.transactionStatusCode == 0) {
                            $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                            $scope.proposalStatus.statusPaym = "failed";
                        } else {
                            $scope.proposalStatus.statusPaym = "pending";
                            $scope.proposalStatus.statusPoli = "pending";
                        }
                    }
                    if ($scope.responseProduct.bikePolicyResponse != null) {
                        if ($scope.responseProduct.bikePolicyResponse.transactionStatusCode == 1) {
                            $scope.proposalStatus.statusDatePoli = $scope.responseProduct.bikePolicyResponse.updatedDate;
                            $scope.proposalStatus.policyNo = $scope.responseProduct.bikePolicyResponse.policyNo;
                            $scope.proposalStatus.statusPoli = "completed";
                        } else if ($scope.responseProduct.bikePolicyResponse.transactionStatusCode == 0) {
                            $scope.proposalStatus.statusDatePoli = $scope.responseProduct.bikePolicyResponse.updatedDate;
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
                                    $scope.policyEndDate = formattedPolEndDate;

                                    var tempPolicyEndDate = $scope.policyEndDate.split("/");
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
                     $scope.hideModalAP = function () {
                      $scope.modalAP = false;
        };

                    $scope.closeModal = function () {
                        $scope.modalPrevPolExpiredError = false;
                    }

                    //function created to send vehicle details in proposal request
            $scope.createBikeVehicleDetailsRequest = function (){
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
                }
                if($scope.vehicleDetails.financeInstitutionCode){
                    $scope.vehicleDetails.financeInstitutionCode = $scope.vehicleDetails.financeInstitutionCode;
                }if($scope.vehicleDetails.monthlyMileage){
                    vehicleDetailRequest.monthlyMileage = $scope.vehicleDetails.monthlyMileage;
                }
                vehicleDetailRequest.registrationAddress.regCity = $scope.vehicleDetails.registrationAddress.regCity;
                vehicleDetailRequest.registrationAddress.regDisplayArea =$scope.vehicleDetails.registrationAddress.regDisplayArea;
                vehicleDetailRequest.registrationAddress.regPincode = $scope.vehicleDetails.registrationAddress.regPincode;
                vehicleDetailRequest.registrationAddress.regState = $scope.vehicleDetails.registrationAddress.regState;
                vehicleDetailRequest.registrationAddress.regArea = $scope.vehicleDetails.registrationAddress.regArea;
                vehicleDetailRequest.registrationAddress.regDistrict = $scope.vehicleDetails.registrationAddress.regDistrict;
                vehicleDetailRequest.registrationAddress.regDisplayField = $scope.vehicleDetails.registrationAddress.regDisplayField;
                $scope.bikeProposeFormDetails.vehicleDetails = vehicleDetailRequest;
            }
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
                    };
                    $scope.authenticate = {};
                    $scope.vehicleInfo.insuranceType = {};

                    $scope.proposalInfo = function () {
                        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                            $scope.bikeProposeFormDetails = {};
                            $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";

                            /* agentDetails will be sent in proposal*/
                            if ($scope.responseProduct.userName) {
                                $scope.selectedProduct.userName = $scope.responseProduct.userName;
                                $scope.bikeProposeFormDetails.userName = $scope.responseProduct.userName;
                            }

                            if ($scope.responseProduct.agencyId) {
                                $scope.selectedProduct.agencyId = $scope.responseProduct.agencyId;
                                $scope.bikeProposeFormDetails.agencyId = $scope.responseProduct.agencyId;
                            }
                            
                            if (!$scope.saveProposal) {
                                //$scope.bikeProposeFormDetails.premiumDetails = $scope.selectedProduct;
                                $scope.bikeProposeFormDetails.proposerDetails = $scope.proposerDetails;
                                $scope.bikeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                                $scope.bikeProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                                $scope.bikeProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                                $scope.bikeProposeFormDetails.proposalId = $scope.proposalId;

                                // if ($scope.vehicleInfo.insuranceType) {
                                //     $scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                                // }
                                if ($scope.responseProduct.vehicleDetails) {
                                    $scope.vehicleDetails.RTOCode = $scope.responseProduct.vehicleDetails.RTOCode.toUpperCase();

                                }


                                $scope.vehicleDetails.engineNumber = $scope.vehicleDetails.engineNumber.toUpperCase();
                                $scope.vehicleDetails.chassisNumber = $scope.vehicleDetails.chassisNumber.toUpperCase();
                                // $scope.vehicleDetails.manufacturingDate = "01/01/" + $scope.vehicleInfo.manufacturingYear;
                                // $scope.vehicleDetails.manufacturingYear = $scope.vehicleInfo.manufacturingYear;

                                //$scope.bikeProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                                $scope.createBikeVehicleDetailsRequest();
                            }

                            var selectedInsuranceType = localStorageService.get("selectedInsuranceType");
                            if ($scope.selectedProduct.policyType == 'new' && selectedInsuranceType == "comprehensive") {
                                $scope.policyStartDate = $scope.insuranceDetails.ODPolicyStartDate;
                                $scope.policyEndDate = $scope.insuranceDetails.ODPolicyEndDate;
                            }

                            $scope.selectedProduct.userIdv = localStorageService.get("bikeQuoteInputParamaters").quoteParam.userIdv;
                            $scope.bikeProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
                            $scope.bikeProposeFormDetails.productId = $scope.selectedProduct.productId;
                            //$scope.bikeProposeFormDetails.personalDetailsFlag = $scope.personalDetailsFlag;
                        }
                        if ($rootScope.baseEnvEnabled && $rootScope.wordPressEnabled) {

                            // if ($scope.responseProduct.proposalRequest.insuranceDetails.onlyODApplicable) {
                            //     $scope.insuranceDetails.onlyODApplicable = $scope.responseProduct.proposalRequest.insuranceDetails.onlyODApplicable;
                            // }

                            $scope.bikeProposeFormDetails = {};
                            $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
                            $scope.insuranceDetails.insuranceType = $scope.responseProduct.proposalRequest.insuranceDetails.insuranceType;
                            $scope.vehicleDetails.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();

                            $scope.vehicleDetails.engineNumber = $scope.vehicleDetails.engineNumber.toUpperCase();
                            $scope.vehicleDetails.chassisNumber = $scope.vehicleDetails.chassisNumber.toUpperCase();
 
                            /* agentDetails will be sent in proposal*/
                            if ($scope.responseProduct.userName) {
                                $scope.selectedProduct.userName = $scope.responseProduct.userName;
                                $scope.bikeProposeFormDetails.userName = $scope.responseProduct.userName;
                            }
                            if ($scope.responseProduct.agencyId) {
                                $scope.selectedProduct.agencyId = $scope.responseProduct.agencyId;
                                $scope.bikeProposeFormDetails.agencyId = $scope.responseProduct.agencyId;
                            }
                            //$scope.bikeProposeFormDetails.premiumDetails = $scope.selectedProduct;
                            $scope.bikeProposeFormDetails.proposerDetails = $scope.proposerDetails;
                            $scope.bikeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                            $scope.bikeProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                            $scope.bikeProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                            //$scope.bikeProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                            $scope.bikeProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
                            $scope.bikeProposeFormDetails.productId = $scope.selectedProduct.productId;
                            //$scope.bikeProposeFormDetails.requestType = $scope.p365Labels.request.bikePropRequestType;
                            $scope.createBikeVehicleDetailsRequest();
                        }



                    }

                    /*----- iPOS+ Functions-------*/


                    $scope.sendProposalEmail = function () {
                        var proposalDetailsEmail = {};
                        proposalDetailsEmail.paramMap = {};

                        proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
                        proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
                        proposalDetailsEmail.isBCCRequired = 'Y';
                        proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
                        proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.bike;
                        proposalDetailsEmail.paramMap.quoteId = $scope.responseToken.QUOTE_ID;
                        proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                        proposalDetailsEmail.paramMap.docId = $scope.responseToken.proposalId;
                        proposalDetailsEmail.paramMap.LOB = String($scope.p365Labels.businessLineType.bike);
                        if($scope.shortenURL){
                                proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;
                        }else{
                                $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2";  
                                proposalDetailsEmail.paramMap.url = $scope.longURL;   
                        }

                        RestAPI.invoke($scope.p365Labels.transactionName.sendEmail, proposalDetailsEmail).then(function (emailResponse) {
                            if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
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
                                $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                $scope.loading = false;
                            }
                        });
                    }
                    $scope.submitProposalData = function () {
                        $scope.submitProposalClicked = true;
                        $scope.proposalInfo();
                      // $scope.bikeProposeFormDetails.PACoverDetails = $scope.PACoverDetails;
                        //$scope.bikeProposeFormDetails.QUOTE_ID = $rootScope.responseProduct.QUOTE_ID;
                        $scope.bikeProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        $scope.bikeProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.bike;
                        //$scope.bikeProposeFormDetails.carrierProposalStatus = false;
                        $scope.bikeProposeFormDetails.source = sourceOrigin;
                        // if(isPolicyRenewed){
                        //     $scope.bikeProposeFormDetails.isPolicyRenewed = isPolicyRenewed;
                        // }

                        $scope.loading = true;
                        
                        if (!$scope.saveProposal) {
                            console.log("Proposal submission started");
                           // $scope.bikeProposeFormDetails.isCleared = true;
                           // delete $scope.bikeProposeFormDetails.proposalId;
                            if ($rootScope.agencyPortalEnabled) {
                                const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                                $scope.bikeProposeFormDetails.requestSource = sourceOrigin;
                                $scope.bikeProposeFormDetails.source = sourceOrigin;
                                if (localdata) {
                                    $scope.bikeProposeFormDetails.userName = localdata.username;
                                    $scope.bikeProposeFormDetails.agencyId = localdata.agencyId;
                                }
                                if(localStorage.getItem("desiSkillUniqueId")){
                                    if(localStorage.getItem("desiSkillUserId")){
                                    $scope.bikeProposeFormDetails.userName = localStorage.getItem("desiSkillUserId");
                                    }
                                    $scope.bikeProposeFormDetails.agencyId =  localStorage.getItem("desiSkillAgencyId");
                                }
                            }
                            if ($scope.bikeProposeFormDetails.QUOTE_ID) {
                                RestAPI.invoke("bikeProposal", $scope.bikeProposeFormDetails).then(function (proposeFormResponse) {
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {

                                        $scope.proposalId = proposeFormResponse.data.proposalId;
                                        // added to store the encrypted store prosal id 
                                        $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                        localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                                        // //added by gauri for mautic application
                                        // if (imauticAutomation == true) {
                                        //     console.log('$scope.proposalId ', $scope.proposalId);
                                        //     var proposalId = $scope.proposalId;
                                        //     var proposal_url = "" + sharePaymentLink + "" + $scope.encryptedProposalId + "&lob=2";
                                        //     imatProposal('bike', proposalId, proposal_url, messageIDVar, 'MakePayment');
                                        // }

                                        $scope.responseToken = proposeFormResponse.data;
                                        $scope.responseToken.paymentGateway = $scope.paymentURL;
                                        $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.bike;
                                        localStorageService.set("bikeReponseToken", $scope.responseToken);
                                        //									console.log("Payment service started");
                                        $rootScope.encryptedProposalID = String($scope.responseToken.proposalId);
                                        $rootScope.encryptedLOB = String($scope.p365Labels.businessLineType.bike);

                                        if (imauticAutomation == true) {
                                            //imatBikeProposal(localStorageService, $scope, 'SubmitProposal');								
                                            imatBikeProposal(localStorageService, $scope, 'SubmitProposal', function (shortURLResponse) {
                                                if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                    $scope.shortURLResponse = shortURLResponse;
                                                    if($scope.shortURLResponse.data.shortURL){
                                                        $scope.shortenURL = $scope.shortURLResponse.data.shortURL;
                                                        }else{
                                                        $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2";
                                                        }
                                                    $scope.sendProposalEmail();
                                                } else {
                                                    //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                                    $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2"; 
                                                    $scope.sendProposalEmail();
                                                    $scope.loading = false;
                                                }
                                            });
                                        } else {
                                            var body = {};
                                            body.longURL = sharePaymentLink + String($scope.responseToken.proposalId) + "&lob=" + String($scope.p365Labels.businessLineType.bike);
                                            $scope.longURL = body.longURL;
                                            $http({ method: 'POST', url: getShortURLLink, data: body }).
                                                success(function (shortURLResponse) {
                                                    if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                        $scope.shortURLResponse = shortURLResponse;
                                                        $scope.shortenURL = $scope.shortURLResponse.data.shortURL;
                                                        $scope.sendProposalEmail();
                                                    } else {
                                                        //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                                        $scope.longURL ="" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2"; 
                                                        $scope.sendProposalEmail();
                                                        $scope.loading = false;
                                                    }
                                                });
                                        }
                                    } else if ((proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error)||( proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1)) {
                                        $scope.loading = false;
                                        if ($rootScope.wordPressEnabled) {
                                            $scope.proceedPaymentStatus = true;
                                        }
                                        if(proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1){
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
                                        $scope.loading = false;
                                        $scope.modalPrevPolExpiredError = true;
                                        // $scope.vehicleInfo.previousPolicyExpired = proposeFormResponse.data.previousPolicyExpired;
                                        //console.log('$scope.vehicleInfo.previousPolicyExpired',$scope.vehicleInfo.previousPolicyExpired);
                                        $scope.prevPolicyExpiredError = proposeFormResponse.message;
                                    }else {
                                        //added by gauri for imautic
                                        if (imauticAutomation == true) {
                                            imatEvent('ProposalFailed');
                                        }
                                        $scope.loading = false;
                                        if ($rootScope.wordPressEnabled) {
                                            $scope.proceedPaymentStatus = true;
                                        }
                                        var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                       // $rootScope.P365Alert($scope.p365Labels.common.p365prompt, buyScreenCnfrmError, "Ok");
                                        if(proposeFormResponse.message){
                                            $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                        }else{
                                            $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                        }
                                    }
                                });
                                }else{
                                $scope.loading = false;
                                $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                            }
                        } else {
                            $scope.bikeProposeFormDetails.proposalId = $scope.responseProduct.proposalId;
                            RestAPI.invoke($scope.transactionSaveProposal, $scope.responseProduct).then(function (proposeFormResponse) {
                                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                    $scope.proposalId = proposeFormResponse.data;
                                    //localStorageService.set("proposalId", $scope.proposalId);
                                    $scope.loading = false;
                                    $scope.saveProposal = false;
                                } else {
                                    $scope.loading = false;
                                    $scope.saveProposal = false;
                                }
                            });
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
                            $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2";   
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
                    
                    /*----- iPOS+ Functions Ends -------*/

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
                    };
                    $scope.proceedForPayment = function () {
                        $scope.proceedPaymentStatus = false;
                        $scope.submitProposalClicked = false;
                        /*below code is commented : as discussed with pranjal and abhishek Dh. We will not show OTP popup after user clicks make payment*/
                        /*var authenticateUserParam = {};
                        authenticateUserParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                        authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function(createOTP){		
                        	if(createOTP.responseCode == $scope.p365Labels.responseCode.success){
                        		$scope.invalidOTPError = "";*/
                        $scope.proposalInfo();
                        //$scope.bikeProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        $scope.bikeProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.bike;
                        $scope.bikeProposeFormDetails.source = sourceOrigin;
                        if(localStorageService.get("BIKE_UNIQUE_QUOTE_ID")){
                            $scope.bikeProposeFormDetails.QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
                        }else{
                            $scope.bikeProposeFormDetails.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        }
                        if($scope.bikeProposeFormDetails.proposalId){
                        delete $scope.bikeProposeFormDetails.proposalId;
                        }
                        //sending flag if renewal policy insurer is same as previous policy insurer                       
                        if(isPolicyRenewed){
                            $scope.bikeProposeFormDetails.isPolicyRenewed = isPolicyRenewed;
                        }
                        if ($scope.referralCode) {
                            $scope.bikeProposeFormDetails.referralCode = $scope.referralCode;
                        }

                        if ($scope.bikeProposeFormDetails.QUOTE_ID) {
                            $scope.loading = true;
                            RestAPI.invoke("bikeProposal", $scope.bikeProposeFormDetails).then(function (proposeFormResponse) {
                                //var proposeFormResponse=$scope.responseProduct.bikeProposalResponse;
                                $scope.modalOTP = false;
                                $scope.proceedPaymentStatus = true;

                                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                    //$scope.responseToken = proposeFormResponse;

                                    $scope.proposalId = proposeFormResponse.data.proposalId;
                                    // added to store the encrypted store prosal id 
                                    $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                    localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);
                                    console.log("$scope.encryptedProposalId", $scope.encryptedProposalId);
                                    //added by gauri for mautic application
                                    if (imauticAutomation == true) {
                                        imatBikeProposal(localStorageService, $scope, 'MakePayment', function (shortURLResponse) {
                                        });
                                    }

                                    $scope.responseToken = proposeFormResponse.data;
                                    $scope.responseToken.paymentGateway = $scope.paymentURL;

                                    $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.bike;

                                    localStorageService.set("bikeReponseToken", $scope.responseToken);
                                    //alert('LMS proposeFormResponse.data'+JSON.stringify( proposeFormResponse.data));
                                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.paymentService, $scope.responseToken, function (paymentDetails) {
                                        if (paymentDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.paymentServiceResponse = paymentDetails.data;
                                            //olark
                                            var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                            // for (var i = 0; i < paymentURLParamListLength; i++) {
                                            //     if ($scope.paymentServiceResponse.paramterList[i].name == 'SourceTxnId' && $scope.paymentServiceResponse.paramterList[i].ngModel == 'SourceTxnId') {
                                            //         olarkCustomParam($scope.paymentServiceResponse.paramterList[i].value, $scope.p365Labels.businessLineType.bike, '', 'proposal');
                                            //     }
                                            // }

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
                                } else if ((proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error)||(proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error1)|| (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1)) {
                                    $scope.loading = false;
                                   // $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                                   if(proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1){
                                    //$rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok");
                                    if(proposeFormResponse.message){
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                    }else{
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                    }
                                }else{
                                    if(proposeFormResponse.data){
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                    }else{
                                        $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok");
                                    }  
                                }
                                } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.prevPolicyExpired) {
                                    $scope.loading = false;
                                    $scope.modalPrevPolExpiredError = true;
                                    //commented from p365 restructure
                                    //$scope.vehicleInfo.previousPolicyExpired = proposeFormResponse.data.previousPolicyExpired;
                                    //console.log('$scope.vehicleInfo.previousPolicyExpired',$scope.vehicleInfo.previousPolicyExpired);
                                    $scope.prevPolicyExpiredError = proposeFormResponse.message;
                                } else {
                                    //added by gauri for imautic
                                    if (imauticAutomation == true) {
                                        imatEvent('ProposalFailed');
                                    }
                                    $scope.loading = false;
                                    var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                   // $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                                   if(proposeFormResponse.message){
                                    $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                                }else if(proposeFormResponse.data){
                                    $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                                }else{
                                    $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                                }
                                }
                            });
                        } else {
                            $scope.proceedPaymentStatus = true;
                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
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

                //start for pincode
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
                     if (String($scope.vehicleDetails.registrationAddress.regDisplayArea) == "undefined" || $scope.vehicleDetails.registrationAddress.regDisplayArea.length == 0)                     
                     {
                        $scope.vehicleDetails.registrationAddress.regPincode = ""
                        $scope.vehicleDetails.registrationAddress.regState = "";
                        $scope.vehicleDetails.registrationAddress.regCity = "";                        
                        $scope.vehicleDetails.registrationAddress.regDoorNo = "";
                     }
                 };
         

                // Method to get list of pincodes
                $scope.getPinCodeAreaList = function (searchValue) {
                    var docType = $scope.p365Labels.documentType.cityDetails;
                    //var carrierId = $scope.selectedProduct.carrierId;
                    var carrierId = $scope.responseProduct.carrierId;

                    return $http.get(getSearchServiceLink + docType + "&q=" + searchValue + "&id=" + carrierId).then(function (response) {
                        return JSON.parse(response.data).data;
                    });
                };

                $scope.onSelectPinOrArea = function (item) {
       
                    $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");                  
                    $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam.vehicleInfo);
                    var selState = $scope.selectedProductInputParam.vehicleInfo.state;
                     $scope.proposerDetails.communicationAddress.comState = selState.toUpperCase();

                    if ($scope.proposerDetails.communicationAddress.comState != item.state) {
                        $scope.selectedProductInputParam.vehicleInfo.state = item.state;
                        $scope.selectedProductInputParam.vehicleInfo.city = item.city;
                      
                        $scope.proposerDetailsCopied = angular.copy(item);
                        $rootScope.P365Confirm("Policies365", "There is a change in location and premium would be re-calculated. Do you want to proceed?", "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;
                              //  $scope.quote = {};

                                //$scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                           //     $scope.quote = $scope.selectedProductInputParam;
                                $scope.bikeQuoteRequestFormation($scope.selectedProductInputParam);

                                RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {
                                    $scope.carRecalculateQuoteRequest = [];
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                        $scope.responseRecalculateCodeList = [];

                                        //localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                        $scope.carRecalculateQuoteRequest = proposeFormResponse.data;

                                        $scope.quoteCalcResponse = [];
                                        angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.transactionName = $scope.p365Labels.transactionName.bikeQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var bikeQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(bikeQuoteResponse.responseCode);
                                                    if (bikeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                        if (bikeQuoteResponse.data != null ){
                                                        if(bikeQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                            bikeQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId) {
                                                            $scope.loading = false;
                                                            $scope.premiumDetails.selectedProductDetails = bikeQuoteResponse.data.quotes[0];
                                                            $scope.selectedProduct = bikeQuoteResponse.data.quotes[0];
                                                            bikeQuoteResponse.data.quotes[0].id = bikeQuoteResponse.messageId;
                                                            $scope.quoteCalcResponse.push(bikeQuoteResponse.data.quotes[0]);
                                                        }
                                                     }
                                                    } else {
                                                        if (bikeQuoteResponse.data != null)
                                                        {
                                                        if( bikeQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                            bikeQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId)
                                                             {
                                                            $scope.loading = false;
                                                            $scope.proposerDetails.communicationAddress.comPincode = '';
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
                                if(item.address){
                                    $scope.proposerDetails.communicationAddress.comDisplayArea = item.address;
                                }
                                $scope.proposerDetails.communicationAddress.comPincode = item.pincode;
                                $scope.proposerDetails.communicationAddress.comCity = item.city;
                                $scope.proposerDetails.communicationAddress.comState = item.state;
                                $scope.checkForSameAddress();
                            } else {
                                //$scope.proposerDetails.communicationAddress = $scope.proposerDetailsCopied;
                                //$scope.displayArea = $scope.selectedProductInputParamCopy.area + ", " + $scope.selectedProductInputParamCopy.city;
                              //  $scope.proposerDetails.area = $scope.selectedProductInputParamCopy.area;
                                $scope.proposerDetails.communicationAddress.comDisplayArea =  $scope.selectedProductInputParamCopy.address;
                                $scope.proposerDetails.communicationAddress.comPincode = $scope.selectedProductInputParamCopy.pincode;
                                $scope.proposerDetails.communicationAddress.comCity = $scope.selectedProductInputParamCopy.city;
                                $scope.proposerDetails.communicationAddress.comState = $scope.selectedProductInputParamCopy.state;
                                $scope.checkForSameAddress();
                            }
                        });
                    } else {
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
                    } else {
                           $scope.vehicleDetails.registrationAddress ={};
                           $scope.vehicleDetails.registrationAddress.regDisplayArea = "";                     
                           $scope.vehicleDetails.registrationAddress.regDoorNo = "";
                           $scope.vehicleDetails.registrationAddress.regPincode = "";
                           $scope.vehicleDetails.registrationAddress.regCity = "";
                           $scope.vehicleDetails.registrationAddress.regState = "";                
                    }
                };

                //fxn to calculate default area details
                $scope.calcDefaultAreaDetails = function (areaCode) {
                    //Sayli-04082017: As disscussed with yogesh, Delhi Pincode pre population issue
                    if (areaCode != null && String(areaCode) != "undefined" && String(areaCode).length > 0) {
                        var docType = $scope.p365Labels.documentType.cityDetails;
                        //var carrierId = $scope.selectedProduct.carrierId;
                        var carrierId = $scope.responseProduct.carrierId;
                        $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {
                            var areaDetails = JSON.parse(response.data);
                            if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.onSelectPinOrArea(areaDetails.data[0]);
                            }
                        });
                    }
                };

                // //fxn to calculate default area for registration details
                $scope.calcDefaultRegAreaDetails = function (areaCode) {
                    //Sayli-04082017: As disscussed with yogesh, Delhi Pincode pre population issue
                    if (areaCode != null && String(areaCode) != "undefined" && String(areaCode).length > 0) {
                        var docType = $scope.p365Labels.documentType.cityDetails;
                        var carrierId = $scope.selectedProduct.carrierId;
    
                        $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {
                            var areaDetails = JSON.parse(response.data);
                            if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.onSelectVehiclePinOrArea(areaDetails.data[0]);
                            }
                        });
                    }
                };

                // if (String($scope.proposerDetails.communicationAddress.comPincode) == "undefined") {
                //     if (localStorageService.get("cityDataFromIP") != null && String(localStorageService.get("cityDataFromIP")) != "undefined") {
                //         if (localStorageService.get("cityDataFromIP").cityStatus) {
                //             $scope.proposerDetails.communicationAddress.comPincode = localStorageService.get("cityDataFromIP").pincode;
                //         } else {
                //             $scope.proposerDetails.communicationAddress.comPincode = "";
                //         }
                //     } else {
                //         $scope.proposerDetails.communicationAddress.comPincode = "";
                //     }
                // }

               // $scope.calcDefaultAreaDetails($scope.proposerDetails.communicationAddress.comPincode);

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
                    $scope.appointeeDetails.personAge = getAgeFromDOB($scope.appointeeDetails.dateOfBirth);
                };

                $scope.calculateProposerAge = function () {
                    $scope.proposerDetails.personAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
                };
                $scope.changeNomineeRelation = function () {
                    if (String($scope.nominationInfo.nominationRelation) != "undefined") {
                        $scope.nominationDetails.nominationRelation = $scope.nominationInfo.nominationRelation.relationship;
                        $scope.nominationDetails.nominationRelationId = $scope.nominationInfo.nominationRelation.relationshipId;
                    }
                    if ($scope.responseProduct.proposalRequest.nominationDetails)
                        $scope.nomineeDetailsForm.$dirty = false;
                };
                // $scope.splitAddressField = function () {
                //     var doorNo = "";
                //     if (String($scope.proposerDetails.doorNo) != "undefined" && String($scope.proposerDetails.doorNo).length > 0) {
                //         doorNo = $scope.proposerDetails.doorNo + ", ";
                //     }

                //     $scope.proposerDetails.addressLine1 = doorNo;
                //     $scope.proposerDetails.addressLine2 = "";

                //     var tempAddressArray = $scope.proposerDetails.communicationAddress.comDisplayArea.split(/[\s,]+/);
                //     var addressArrayLength = tempAddressArray.length;

                //     if (addressArrayLength > 1) {
                //         var addressArrayLimit = Math.round(addressArrayLength / 2);

                //         for (var i = 0; i < addressArrayLimit; i++) {
                //             if (i == (addressArrayLimit - 1))
                //                 $scope.proposerDetails.addressLine1 += tempAddressArray[i].trim();
                //             else
                //                 $scope.proposerDetails.addressLine1 += tempAddressArray[i].trim() + " ";
                //         }

                //         for (i = addressArrayLimit; i < addressArrayLength; i++) {
                //             if (i == (addressArrayLength - 1))
                //                 $scope.proposerDetails.addressLine2 += tempAddressArray[i].trim();
                //             else
                //                 $scope.proposerDetails.addressLine2 += tempAddressArray[i].trim() + " ";
                //         }
                //     } else {
                //         $scope.proposerDetails.addressLine1 += $scope.proposerDetails.communicationAddress.comDisplayArea;
                //         $scope.proposerDetails.addressLine2 = "";
                //     }
                // };

                // $scope.splitVehicleAddressField = function () {
                //     var doorNo = "";
                //     if (JSON.stringify($scope.vehicleDetails.doorNo) != "undefined" && String($scope.vehicleDetails.doorNo).length > 0) {
                //         doorNo = $scope.vehicleDetails.doorNo + ", ";
                //     }

                //     $scope.vehicleDetails.addressLine1 = doorNo;
                //     $scope.vehicleDetails.addressLine2 = "";

                //     var tempAddressArray = $scope.vehicleDetails.address.split(/[\s,]+/);
                //     var addressArrayLength = tempAddressArray.length;

                //     if (addressArrayLength > 1) {
                //         var addressArrayLimit = Math.round(addressArrayLength / 2);

                //         for (var i = 0; i < addressArrayLimit; i++) {
                //             if (i == (addressArrayLimit - 1))
                //                 $scope.vehicleDetails.addressLine1 += tempAddressArray[i].trim();
                //             else
                //                 $scope.vehicleDetails.addressLine1 += tempAddressArray[i].trim() + " ";
                //         }

                //         for (i = addressArrayLimit; i < addressArrayLength; i++) {
                //             if (i == (addressArrayLength - 1))
                //                 $scope.vehicleDetails.addressLine2 += tempAddressArray[i].trim();
                //             else
                //                 $scope.vehicleDetails.addressLine2 += tempAddressArray[i].trim() + " ";
                //         }
                //     } else {
                //         $scope.vehicleDetails.addressLine1 += $scope.vehicleDetails.address;
                //         $scope.vehicleDetails.addressLine2 = "";
                //     }
                // }

                $scope.changePrevInsurer = function () {
                    $scope.insuranceDetails.insurerName = $scope.insuranceInfo.insurerName.carrierName;
                    $scope.insuranceDetails.insurerId = $scope.insuranceInfo.insurerName.carrierId;
                    if( $scope.selectedProduct.carrierId == $scope.insuranceDetails.insurerId){
                        isPrevPolSameAsNew = true;
                    }else{
                        isPrevPolSameAsNew = false;
                        isPolicyRenewed = false;
                    }

                    if ($scope.productValidation.carrierListforPrevPolicy != null && String($scope.productValidation.carrierListforPrevPolicy) != "undefined" &&
                        $scope.productValidation.carrierListforPrevPolicy.length > 0) {
                        for (var j = 0; j < $scope.productValidation.carrierListforPrevPolicy.length; j++) {
                            if ($scope.insuranceDetails.insurerId == $scope.productValidation.carrierListforPrevPolicy[j].carrierId) {
                                $scope.prevAddressDiv = true;
                                break;
                            } else {
                                $scope.prevAddressDiv = false;
                                $scope.insuranceDetails.prevPolicyAddress = '';
                            }
                        }
                    }
                }

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
                        $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                        $scope.selectedProductInputParam.vehicleInfo.registrationNumber = $scope.newRegistrationNumber;

                        if ($scope.selectedProductInputParamCopy.GSTIN) {
                            $scope.selectedProductInputParam.GSTIN = $scope.selectedProductInputParamCopy.GSTIN;
                        }

                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.regNumberChangeMsg, "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;
                                $scope.quote = {};

                                $scope.quote = $scope.selectedProductInputParam;
                                $scope.selectedProductInputParam.vehicleInfo.registrationNumber = $scope.newRegistrationNumber;
                                $scope.bikeQuoteRequestFormation($scope.selectedProductInputParam);
                                $scope.quote.isPolicyRenewed = false;
                                isPolicyRenewed = false;
                         if(isPrevPolSameAsNew){
                            $scope.quote.isPolicyRenewed = true; 
                            isPolicyRenewed = true;
                            $scope.quote.previousPolicyInsurerDetails = {};
                            $scope.quote.previousPolicyInsurerDetails.insurerId = $scope.insuranceDetails.insurerId;
                            $scope.quote.previousPolicyInsurerDetails.insurerName = $scope.insuranceDetails.insurerName;
                            $scope.quote.previousPolicyInsurerDetails.policyNumber = $scope.insuranceDetails.policyNumber;
                        }
                                RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {
                                    $scope.carRecalculateQuoteRequest = [];
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                        $scope.responseRecalculateCodeList = [];
                                        $scope.quoteCalcResponse = [];

                                        if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                                            $scope.quoteCalcResponse.length = 0;
                                        }
                                        if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                            delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                        }
                                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                        $scope.carRecalculateQuoteRequest = proposeFormResponse.data;
                                        angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.messageId = messageIDVar;
                                            header.campaignID = campaignIDVar;
                                            header.source = sourceOrigin;
                                            header.transactionName = getBikeQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var carQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(carQuoteResponse.responseCode);
                                                    if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                        if (carQuoteResponse.data != null){
                                                            if (carQuoteResponse.data.renewalPlan) {
                                                                if(carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId){
                                                                $scope.loading = false;
                                                                angular.copy($scope.selectedProductInputParam, $scope.selectedProductInputParamCopy);
                                                                $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                                                /*if($scope.selectedProductInputParam.vehicleInfo.registerNumber){
                                                                    delete $scope.selectedProductInputParam.vehicleInfo.registerNumber
                                                                }*/
                                                                if(Number(carQuoteResponse.data.quotes[0].grossPremium) > 0)
                                                                $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);
                                                                }
                                                            } else  if (carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                carQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {
                                                                $scope.loading = false;
                                                                angular.copy($scope.selectedProductInputParam, $scope.selectedProductInputParamCopy);
                                                                $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                                                /*if($scope.selectedProductInputParam.vehicleInfo.registerNumber){
                                                                    delete $scope.selectedProductInputParam.vehicleInfo.registerNumber
                                                                }*/
                                                                if(Number(carQuoteResponse.data.quotes[0].grossPremium) > 0)
                                                                $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);
                                                            }
                                                        }
                                                    } else {
                                                        $scope.loading = false;
                                                        if (carQuoteResponse.data != null){
                                                        if( carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            carQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {
                                                           
                                                            $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                                                            $scope.selectedProductInputParam.vehicleInfo.registrationNumber = '';
                                                            $scope.vehicleInfo.registrationNumber = '';
                                                            if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                                                delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                                            }
                                                            localStorageService.set("bikeQuoteInputParamaters", $scope.selectedProductInputParam);
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
                                        $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                                        $scope.vehicleInfo.registrationNumber = '';
                                        if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                            delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                        }
                                        localStorageService.set("bikeQuoteInputParamaters", $scope.selectedProductInputParam);
                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.regNumberScreenConfirmErrorMsg
                                        $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                                    }
                                });
                            } else {
                                //$scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
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
                };

                $scope.checkGSTINNumber = function (selGSTIN) {
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
                        $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                        $scope.selectedProductInputParam.GSTIN = $scope.newGSTINNumber;
                        if ($scope.selectedProductInputParamCopy.vehicleInfo.registrationNumber) {
                            $scope.selectedProductInputParam.vehicleInfo.registrationNumber = $scope.selectedProductInputParamCopy.vehicleInfo.registrationNumber;
                        }
                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.GSTINNumberChangeMsg, "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;
                                $scope.quote = {};
                                $scope.quote = $scope.selectedProductInputParam;
                                $scope.bikeQuoteRequestFormation($scope.selectedProductInputParam);
                                RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {
                                    $scope.carRecalculateQuoteRequest = [];
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                        $scope.responseRecalculateCodeList = [];
                                        $scope.quoteCalcResponse = [];

                                        if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                                            $scope.quoteCalcResponse.length = 0;
                                        }

                                       // localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                       localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                       localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                        $scope.carRecalculateQuoteRequest = proposeFormResponse.data;
                                        angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.messageId = messageIDVar;
                                            header.campaignID = campaignIDVar;
                                            header.source = sourceOrigin;
                                            header.transactionName = getBikeQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var carQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(carQuoteResponse.responseCode);
                                                    if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                        if (carQuoteResponse.data != null && carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            carQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {
                                                            $scope.loading = false;
                                                            angular.copy($scope.selectedProductInputParam, $scope.selectedProductInputParamCopy);
                                                            $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                                            $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                                            /*if($scope.selectedProductInputParam.vehicleInfo.registerNumber){
                                                            	delete $scope.selectedProductInputParam.vehicleInfo.registerNumber
                                                            }*/
                                                        }
                                                        $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);
                                                    } else {
                                                        $scope.loading = false;
                                                        if (carQuoteResponse.data != null)
                                                        {
                                                        if( carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            carQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {
                                                          
                                                            $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                                                            $scope.selectedProductInputParam.vehicleInfo.registrationNumber = '';
                                                            $scope.vehicleInfo.registrationNumber = '';
                                                            $scope.proposerDetails.GSTIN = '';
                                                            if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                                                delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                                            }
                                                            localStorageService.set("bikeQuoteInputParamaters", $scope.selectedProductInputParam);
                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.GSTINNumberScreenConfirmErrorMsg
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
                                        $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                                        $scope.vehicleInfo.registrationNumber = '';
                                        $scope.proposerDetails.GSTIN = '';
                                        if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                            delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                                        }
                                        localStorageService.set("bikeQuoteInputParamaters", $scope.selectedProductInputParam);
                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.GSTINNumberScreenConfirmErrorMsg
                                        $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                                    }
                                });
                            } else {
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
                    								$scope.proposerDetails.communicationAddress.comPincode = item.pincode;
                    								$scope.proposerDetails.communicationAddress.comCity = item.city;
                    								$scope.proposerDetails.communicationAddress.comState = item.state;
                    								$scope.checkForSameAddress();
                    							}*/
                };

                //added for validating registration number
                $scope.validateRegistrationNumber = function (registrationNumber) {
                    if (String(registrationNumber) != "undefined") {
                        registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
                        if ((registrationNumber.trim()).match(/^[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 7 && (registrationNumber.trim()).length >= 2) {
                            $scope.regNumStatus = false;
                            $scope.vehicleDetailsForm.RegistrationNumber.$setValidity('RegistrationNumber', true);
                            if ($scope.productValidation.regNumberReQuoteCalc) {
                                $scope.calcQuoteOnRegistrationNumber(registrationNumber);
                            }else if($scope.productValidation.renewPolicyQuoteCalc){  // flag to recalculate quote for renewal with same carrier policy
                                if($scope.selectedProduct.policyType == 'renew'){
                                if( $scope.responseProduct.carrierId == $scope.insuranceDetails.insurerId){
                                    isPrevPolSameAsNew = true;
                                    $scope.calcQuoteOnRegistrationNumber(registrationNumber);  
                                }
                                    }
                            }
                        } else {
                            $scope.regNumStatus = true;
                            $scope.vehicleDetailsForm.RegistrationNumber.$setValidity('RegistrationNumber', false);
                        }
                        $scope.vehicleInfo.registrationNumber = registrationNumber.trim();
                    }
                } //end

            });
            $scope.calcQuoteOnPolicyExpired = function (prevPoliExpiredData) {
                $scope.modalPrevPolExpiredError = false;

                $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                $scope.selectedProductInputParam.vehicleInfo.previousPolicyExpired = $scope.vehicleInfo.previousPolicyExpired;
                
                $scope.loading = true;
                $scope.quote = {};
                $scope.quote = $scope.selectedProductInputParam;
                $scope.calcQuotePrevPol();

            }
            $scope.calcQuotePrevPol = function () {


                RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {

                    $scope.carRecalculateQuoteRequest = [];
                    //console.log('$scope.p365Labels.responseCode.prevPolicyExpired',$scope.p365Labels.responseCode.prevPolicyExpired);
                    //console.log('proposeFormResponse.responseCode',proposeFormResponse.responseCode)
                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.responseRecalculateCodeList = [];

                        //localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                        $scope.carRecalculateQuoteRequest = proposeFormResponse.data;
                        //as discussed with kuldeep,sending start and end date in quote request
                        if (String($scope.policyStartDate) != "undefined") {
                            $scope.policyStartDate = proposeFormResponse.policyDate.policyStartDate;
                        }
                        if (String($scope.policyEndDate) != "undefined") {
                            $scope.policyEndDate = proposeFormResponse.policyDate.policyEndDate;
                        }
                        $scope.quoteCalcResponse = [];
                        angular.forEach($scope.carRecalculateQuoteRequest, function (obj, i) {
                            var request = {};
                            var header = {};

                            header.transactionName = $scope.p365Labels.transactionName.bikeQuoteResult;
                            header.deviceId = deviceIdOrigin;
                            request.header = header;
                            request.body = obj;

                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                success(function (callback, status) {
                                    var bikeQuoteResponse = JSON.parse(callback);
                                    $scope.responseRecalculateCodeList.push(bikeQuoteResponse.responseCode);
                                    if (bikeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                        if (bikeQuoteResponse.data != null && bikeQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                            bikeQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId) {
                                            $scope.loading = false;
                                            $scope.premiumDetails.selectedProductDetails = bikeQuoteResponse.data.quotes[0];
                                            $scope.selectedProduct = bikeQuoteResponse.data.quotes[0];
                                        }
                                        bikeQuoteResponse.data.quotes[0].id = bikeQuoteResponse.messageId;
                                        $scope.quoteCalcResponse.push(bikeQuoteResponse.data.quotes[0]);
                                    } else {
                                        if (bikeQuoteResponse.data != null && bikeQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                            bikeQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId) {
                                            $scope.loading = false;
                                            $scope.proposerDetails.communicationAddress.comPincode = '';
                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + " does not provide Insurance for  the owner. Please change the input or select any other insurer from the quote screen"
                                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
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
                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + " does not provide Insurance for the selected  owner. Please change the input or select any other insurer from the quote screen"
                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                    }
                });
            }
            $scope.backToResultScreen = function () {
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    $rootScope.mainTabsMenu[0].active = true;
                    $rootScope.mainTabsMenu[1].active = false;
                    if ($scope.bikeProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED) {
                        $location.path("/sharefromAPI").search({ docId: $scope.bikeProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: $scope.p365Labels.businessLineType.bike });
                    } else {
                        $location.path("/sharefromAPI").search({ docId: $scope.bikeProposeFormDetails.QUOTE_ID, LOB: $scope.p365Labels.businessLineType.bike });
                    }
                } else {
                    if ($scope.bikeProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED) {
                        var shareURL = shareQuoteLink + $scope.bikeProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED;
                        $window.location.href = shareURL;
                        // $location.path("/sharefromAPI").search({ docId: $scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: $scope.p365Labels.businessLineType.car });
                    } else {
                        // $location.path("/sharefromAPI").search({ docId: $scope.carProposeFormDetails.QUOTE_ID, LOB: $scope.p365Labels.businessLineType.car });
                        var shareURL = shareQuoteLink + $scope.bikeProposeFormDetails.QUOTE_ID;
                        $window.location.href = shareURL;
                    }
                }

            }
            // });
        });
    }]);