/*
 * Description	: This is the controller file for bike policy buy.
 * Author		: Yogesh
 * Date			: 01 Jan 2017
 *	
 * */

"use strict";
angular.module('buyTwoWheeler', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('buyTwoWheelerController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function ($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce) {

        $scope.bikeProposalSectionHTML = wp_path + 'buy/bike/html/BikeProposalSection.html';
        $scope.proposerInfo = {};
        $scope.proposerDetails = {};
        $scope.proposerDetails.communicationAddress = {};
        $scope.vehicleInfo = {};
        $scope.vehicleDetails = {};
        $scope.vehicleDetails.registrationAddress = {};
        $scope.nominationInfo = {};
        $scope.nominationDetails = {};
        $scope.organizationDetails = {};
        $scope.appointeeInfo = {};
        $scope.appointeeDetails = {};
        $scope.insuranceInfo = {};
        $scope.insuranceDetails = {};
        $scope.bikeProposeFormCookieDetails = {};
        $scope.authenticate = {};
        $scope.iposRequest = {};
        $scope.prevPolDetails = {};
        $scope.premiumDetails = {};
        //var tempRegNum;
        $scope.iposRequest.docId = $location.search().quoteId;
        $scope.iposRequest.carrierId = $location.search().carrierId;
        var saveProposal = false;
        var saveNomineeDetails = false;
        var savePrevPolicyDetails = false;
        var savePersonalDetails = false;
        var isPolicyRenewed = false;
        //flag to check Renew Policy(i.e. previous policy insurer same as new insurer)
        var isPrevPolSameAsNew = false;
        $scope.redirectForPayment = false;
        $scope.proposalId = null;
        $scope.pucStatus = true;
        $scope.submitProposalClicked = false;

        //for third party API like droom
        // if ($rootScope.affilateUser) {
        //     $scope.isThirdPartyResource = true;
        // } else {
        //     $scope.isThirdPartyResource = false;
        // }
        
        if(!$rootScope.customEnvEnabled){
            $rootScope.customEnvEnabled = customEnvEnabled;
        }
        if(!$rootScope.baseEnvEnabled){
            $rootScope.baseEnvEnabled = baseEnvEnabled;
        }

        //added to apply different position to back button in ipos/iquote for website/posp
        if (pospEnabled) {
            $scope.pospEnabled = pospEnabled;
        }
        $scope.screenOneStatus = true;
        $scope.screenTwoStatus = false;
        $scope.screenThreeStatus = false;
        $scope.screenFourStatus = false;
       // $scope.loading = false;
        $scope.prevAddressDiv = false;
        $scope.prevPolStatusError = false;
        $scope.proposalStatusForm = false;

        $scope.maritalStatusType = maritalStatusListGeneric;
        $scope.drivingExpYearsList = drivingExperienceYears;
        $scope.vehicleDrivenOnList = vehicleDrivenPlaces;
        $scope.ncbList = buyScreenNcbList;
        $scope.mileageList = buyScreenMileageList;
        $scope.vehicleLoanTypes = vehicleLoanTypes;
        $scope.genderType = genderTypeGeneric;
        $scope.purchasedLoanStatus = purchasedLoanStatusGeneric;
        $scope.addressStatus = yesNoStatusGeneric;
        $scope.policyTypes = policyTypesGeneric;

        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
            $rootScope.mainTabsMenu[0].active = false;
            $rootScope.mainTabsMenu[1].active = true;
        }

        if (localStorageService.get("professionalQuoteParams")) {
            if (localStorageService.get("professionalQuoteParams").commonInfo) {
                $scope.commonInfo = localStorageService.get("professionalQuoteParams").commonInfo;
            } else {
                if (localStorageService.get("quoteUserInfo")) {
                    $scope.commonInfo = localStorageService.get("quoteUserInfo");
                    $scope.commonInfo.salutation = ($scope.proposerDetails.gender == "Female") ? "Miss" : "Mr";
                }
            }
        } else {
            if (localStorageService.get("quoteUserInfo")) {
                $scope.commonInfo = localStorageService.get("quoteUserInfo");
                $scope.commonInfo.salutation = ($scope.proposerDetails.gender == "Female") ? "Miss" : "Mr";
            }
        }
        $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
        /*
         * Yogesh-11072017 : As discussed with Uday and Dany, default marital status set to MARRIED.
         */
        $scope.proposerDetails.maritalStatus = $scope.maritalStatusType[0].name;

        $scope.resetCommunicationAddress = function () {
           // if (String($scope.proposerDetails.address) == "undefined" || $scope.proposerDetails.address.length == 0) 
           
           if (String($scope.proposerDetails.communicationAddress.comDisplayArea) == "undefined" || $scope.proposerDetails.communicationAddress.comDisplayArea.length == 0) 
           {
             $scope.proposerDetails.communicationAddress.comPincode = "";
             $scope.proposerDetails.communicationAddress.comState = "";
             $scope.proposerDetails.communicationAddress.comCity = "";              
             $scope.proposerDetails.communicationAddress.comDoorNo = "";
            }
        };

        $scope.calculateBikeQuote = function (){

            RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {
                $scope.bikeRecalculateQuoteRequest = [];
                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                    $scope.responseRecalculateCodeList = [];
                    $scope.quoteCalcResponse = [];

                    if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                        $scope.quoteCalcResponse.length = 0;
                    }
                    if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                        delete $scope.selectedProductInputParam.vehicleInfo.registrationNumber
                    }
                    localStorageService.set("bikeQuoteInputParamaters",$scope.quote);
                    //localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                    localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                    localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                    $scope.bikeRecalculateQuoteRequest = proposeFormResponse.data;
                    angular.forEach($scope.bikeRecalculateQuoteRequest, function (obj, i) {
                        var request = {};
                        var header = {};

                        header.messageId = messageIDVar;
                        header.campaignID = campaignIDVar;
                        header.source = sourceOrigin;
                        header.transactionName = getBikeQuoteResult;
                        header.deviceId = deviceIdOrigin;
                        request.header = header;
                        request.body = obj;

                        $http({
                            method: 'POST',
                            url: getQuoteCalcLink,
                            data: request
                        }).
                            success(function (callback, status) {
                                var carQuoteResponse = JSON.parse(callback);
                                $scope.responseRecalculateCodeList.push(carQuoteResponse.responseCode);
                                if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                    if (carQuoteResponse.data != null){
                                        console.log('carQuoteResponse.data is :',carQuoteResponse.data);
                                        console.log('carQuoteResponse.data.renewalPlan is : ',carQuoteResponse.data.renewalPlan);
                                    if (carQuoteResponse.data.renewalPlan) {
                                       if(carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId){
                                        $scope.loading = false;
                                        angular.copy($scope.selectedProductInputParam, $scope.selectedProductInputParamCopy);
                                        $scope.premiumDetails.selectedProductDetails = carQuoteResponse.data.quotes[0];
                                        $scope.selectedProduct = carQuoteResponse.data.quotes[0];
                                        console.log('selected product details after quote recalculation : ',$scope.selectedProduct);
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
                                  if (carQuoteResponse.data != null)
                                        {
                                            if ( carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                carQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) 
                                          
                                       {
                                        $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                                       // $scope.selectedProductInputParam.vehicleInfo.registrationNumber = '';
                                        $scope.vehicleInfo.registrationNumber = '';
                                        if ($scope.selectedProductInputParam.vehicleInfo.registrationNumber) {
                                            $scope.selectedProductInputParam.vehicleInfo.registrationNumber = '';
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
                        $scope.loading = false;
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
        }

        $scope.resetRegistrationAddress = function () {
          //  if (String($scope.vehicleDetails.address) == "undefined" || $scope.vehicleDetails.address.length == 0) 
            if (String($scope.vehicleDetails.registrationAddress.regDisplayArea) == "undefined" || $scope.vehicleDetails.registrationAddress.regDisplayArea.length == 0) 
           
            {
               // $scope.vehicleDetails.pincode = "";
               $scope.vehicleDetails.registrationAddress.regPincode = "";
                 
              // $scope.vehicleDetails.state = "";
              $scope.vehicleDetails.registrationAddress.regState = "";
                  
            //  $scope.vehicleDetails.city = "";
            $scope.vehicleDetails.registrationAddress.regCity = "";
                
            $scope.vehicleDetails.registrationAddress.regDoorNo = "";
            }
        };

        // Method to get list of pincodes
        $scope.getPinCodeAreaList = function (searchValue) {
            var docType = $scope.p365Labels.documentType.cityDetails;
            var carrierId = $scope.selectedProduct.carrierId;

            return $http.get(getSearchServiceLink + docType + "&q=" + searchValue + "&id=" + carrierId).then(function (response) {
                return JSON.parse(response.data).data;
            });
        };

        $scope.onSelectPinOrArea = function (item) {
            $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam.vehicleInfo);
           if(item.address){
            $scope.proposerDetails.communicationAddress.comDisplayArea = item.address;
           }
           $scope.proposerDetails.communicationAddress.comPincode = item.pincode;
           $scope.proposerDetails.communicationAddress.comCity = item.city;
           $scope.proposerDetails.communicationAddress.comState = item.state;
             
           $scope.checkForSameAddress();

            $scope.loadPlaceholder();
           // if ($scope.proposerDetails.address)
           if ($scope.proposerDetails.communicationAddress.comDisplayArea)  
           {
           item.displayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
            }
            localStorageService.set("commAddressDetails", item);
        };
        //check communication & permanent address
        $scope.checkForSameAddress = function () {
            if ($scope.vehicleDetails.isVehicleAddressSameAsCommun) {
            $scope.vehicleDetails.registrationAddress.regPincode =$scope.proposerDetails.communicationAddress.comPincode;
            $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.proposerDetails.communicationAddress.comDoorNo;
            $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
            $scope.vehicleDetails.registrationAddress.regCity = $scope.proposerDetails.communicationAddress.comCity;
            $scope.vehicleDetails.registrationAddress.regState =$scope.proposerDetails.communicationAddress.comState;           
            }
        }

        $scope.bikeQuoteRequestFormation = function () {
            $scope.quote = {};
            $scope.quote.vehicleInfo={};
            $scope.quote.quoteParam={};
            
            $scope.quote.vehicleInfo.IDV = $scope.selectedProductInputParam.vehicleInfo.IDV;
            $scope.quote.vehicleInfo.PreviousPolicyExpiryDate =$scope.selectedProductInputParam.vehicleInfo.PreviousPolicyExpiryDate;
            $scope.quote.vehicleInfo.TPPolicyExpiryDate = $scope.selectedProductInputParam.vehicleInfo.TPPolicyExpiryDate;
            $scope.quote.vehicleInfo.TPPolicyStartDate = $scope.selectedProductInputParam.vehicleInfo.TPPolicyStartDate;
            $scope.quote.vehicleInfo.RTOCode = $scope.selectedProductInputParam.vehicleInfo.RTOCode;
            $scope.quote.vehicleInfo.city = $scope.selectedProductInputParam.vehicleInfo.city;
            if($scope.selectedProductInputParam.vehicleInfo.dateOfRegistration){
                $scope.quote.vehicleInfo.dateOfRegistration = $scope.selectedProductInputParam.vehicleInfo.dateOfRegistration;
           }
           $scope.quote.vehicleInfo.idvOption = $scope.selectedProductInputParam.vehicleInfo.idvOption;
           $scope.quote.vehicleInfo.best_quote_id = $scope.selectedProductInputParam.vehicleInfo.best_quote_id;
           $scope.quote.vehicleInfo.previousClaim = $scope.selectedProductInputParam.vehicleInfo.previousClaim;
           $scope.quote.vehicleInfo.registrationNumber = $scope.selectedProductInputParam.vehicleInfo.registrationNumber;
           $scope.quote.vehicleInfo.registrationPlace = $scope.selectedProductInputParam.vehicleInfo.registrationPlace;
           $scope.quote.vehicleInfo.state = $scope.selectedProductInputParam.vehicleInfo.state;
           $scope.quote.vehicleInfo.make = $scope.selectedProductInputParam.vehicleInfo.make;
           $scope.quote.vehicleInfo.model =$scope.selectedProductInputParam.vehicleInfo.model;
           $scope.quote.vehicleInfo.variant =$scope.selectedProductInputParam.vehicleInfo.variant.toString();
             $scope.quote.quoteParam.ncb = $scope.selectedProductInputParam.quoteParam.ncb;
             $scope.quote.quoteParam.ownedBy =$scope.selectedProductInputParam.quoteParam.ownedBy;
             $scope.quote.quoteParam.policyType = $scope.selectedProductInputParam.quoteParam.policyType;
             $scope.quote.quoteParam.riders =$scope.selectedProductInputParam.quoteParam.riders;
        }

        $scope.onSelectVehiclePinOrArea = function (item) {
            $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam.vehicleInfo);
            $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
            var selState = $scope.selectedProductInputParam.vehicleInfo.state;
           // $scope.vehicleDetails.state = selState.toUpperCase();
  
           $scope.vehicleDetails.registrationAddress.regState= selState.toUpperCase();
          //  if ($scope.vehicleDetails.state != item.state)
          if ( $scope.vehicleDetails.registrationAddress.regState != item.state){
                $scope.selectedProductInputParam.vehicleInfo.state = item.state;
                $scope.vehicleDetailsCopied = angular.copy(item);
                $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.locationChangeMsg, "No", "Yes", function (confirmStatus) {
                    if (confirmStatus) {
                        $scope.loading = true;
                        $scope.bikeQuoteRequestFormation();
                        $scope.quote.vehicleInfo.city = item.city ;
                        $scope.quote.vehicleInfo.state = item.state ;

                        RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {
                            $scope.bikeRecalculateQuoteRequest = [];
                            if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                $scope.responseRecalculateCodeList = [];
                                localStorageService.set("bikeQuoteInputParamaters",$scope.quote);
                                localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                                $scope.bikeRecalculateQuoteRequest = proposeFormResponse.data;

                                $scope.quoteCalcResponse = [];
                                angular.forEach($scope.bikeRecalculateQuoteRequest, function (obj, i) {
                                    var request = {};
                                    var header = {};

                                    header.messageId = messageIDVar;
                                    header.campaignID = campaignIDVar;
                                    header.source = sourceOrigin;
                                    header.transactionName = $scope.p365Labels.transactionName.bikeQuoteResult;
                                    header.deviceId = deviceIdOrigin;
                                    request.header = header;
                                    request.body = obj;

                                    $http({
                                        method: 'POST',
                                        url: getQuoteCalcLink,
                                        data: request
                                    }).
                                        success(function (callback, status) {
                                            var bikeQuoteResponse = JSON.parse(callback);
                                            $scope.responseRecalculateCodeList.push(bikeQuoteResponse.responseCode);
                                            if (bikeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                                if (bikeQuoteResponse.data != null){
                                                    if (bikeQuoteResponse.data != null && bikeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId ) {
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
                                                    if ( bikeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                        bikeQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId)
                                                        {
                                                    $scope.loading = false;
                                                //    $scope.vehicleDetails.pincode = '';
                                                $scope.vehicleDetails.registrationAddress.regPincode= '';
                                                    
                                           //     $scope.vehicleDetails.city = '';
                                           $scope.vehicleDetails.registrationAddress.regCity = '';
                                               
                                           //    $scope.vehicleDetails.state = '';
                                                $scope.vehicleDetails.registrationAddress.regState = '';
                                                    
                                                $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                                                    $scope.selectedProductInputParam.vehicleInfo.state = '';
                                                    localStorageService.set("bikeQuoteInputParamaters", $scope.selectedProductInputParam);
                                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                                    $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
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
                              //  $scope.vehicleDetails.pincode = '';
                              $scope.vehicleDetails.registrationAddress.regPincode= '';
                                  
                           //   $scope.vehicleDetails.city = '';
                           $scope.vehicleDetails.registrationAddress.regCity = '';
                               
                           //  $scope.vehicleDetails.state = '';
                              $scope.vehicleDetails.registrationAddress.regState = '';
                                  
                              $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                                $scope.selectedProductInputParam.vehicleInfo.state = '';
                                localStorageService.set("bikeQuoteInputParamaters", $scope.selectedProductInputParam);
                                var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                            }

                        });

                       // $scope.vehicleDetails.registrationAddress = item;
                        //$scope.displayArea = item.area + ", " + item.city;
                       // $scope.vehicleDetails.area = item.area;
                    //    $scope.vehicleDetails.pincode = item.pincode;
                    $scope.vehicleDetails.registrationAddress.regPincode = item.pincode;
                    $scope.vehicleDetails.registrationAddress.regCity = item.city;
                    $scope.vehicleDetails.registrationAddress.regState = item.state;
                        
                    $scope.checkForSameAddress();
                    } else {
                        $scope.vehicleDetails.registrationAddress = $scope.vehicleDetailsCopied;
                        $scope.vehicleDetails.registrationAddress.regPincode = $scope.selectedProductInputParamCopy.pincode;
                        $scope.vehicleDetails.registrationAddress.regCity = $scope.selectedProductInputParamCopy.city;
                        $scope.vehicleDetails.registrationAddress.regState = $scope.selectedProductInputParamCopy.state;
                        
                    $scope.checkForSameAddress();
                    }
                });
            } else {
              if(item.address){
                $scope.vehicleDetails.registrationAddress.regDisplayArea = item.address;
              }
              $scope.vehicleDetails.registrationAddress.regPincode = item.pincode;
              $scope.vehicleDetails.registrationAddress.regCity = item.city;
              $scope.vehicleDetails.registrationAddress.regState = item.state;       
              $scope.checkForSameAddress();
            }

            //after quote calculation condition changes
            $scope.loadPlaceholder();
            localStorageService.set("bikeRegAddress", item);
        };

        // Method to get list of pincodes
        $scope.getFinancialInstituteList = function (instituteName) {
            var carrierId = $scope.selectedProduct.carrierId;
            return $http.get(getSearchServiceLink + "CarrierLoanFinancer" + "&q=" + instituteName + "&id=" + carrierId).then(function (financeInstituteList) {
                return JSON.parse(financeInstituteList.data).data;
            });
        };

        $scope.onFinancialInstitute = function (item) {
            $scope.vehicleDetails.financeInstitutionId = item.financerId;
            //for TATA AIG
            if ($scope.productValidation.isFinanceType) {
                $scope.vehicleDetails.financeType = item.financerType;
            }
           //for KOTAK
           if ($scope.productValidation.isFinanceCode) {
            $scope.vehicleDetails.financeInstitutionCode = item.financerId;
            } 
           
            $scope.loadPlaceholder();
        };


        //	$scope.changeMaritalStatus = function(){
        //	$scope.proposerDetails.maritalStatus = $scope.proposerInfo.maritalStatus.name;
        //	};

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
                       // $scope.insuranceDetails.prevPolicyAddress = '';
                    }
                }
            }
        }

        

        $scope.changeVehicleLoanType = function () {
            $scope.vehicleDetails.vehicleLoanType = $scope.vehicleInfo.vehicleLoanType.name;
        };

        $scope.changeGender = function () {
            if ($scope.proposerDetails.gender == "Male") {
                $scope.proposerDetails.salutation = "Mr";
                if ($scope.commonInfo) {
                    $scope.commonInfo.salutation = "Mr";
                }
            } else {
                $scope.proposerDetails.salutation = "Mrs";
                if ($scope.commonInfo) {
                    $scope.commonInfo.salutation = "Miss";
                }
            }
        };

        $scope.changeNomineeRelation = function () {
            if (String($scope.nominationInfo.nominationRelation) != "undefined") {
                $scope.nominationDetails.nominationRelation = $scope.nominationInfo.nominationRelation.relationship;
                $scope.nominationDetails.nominationRelationId = $scope.nominationInfo.nominationRelation.relationshipId;
            }
        };

        $scope.changeAppointeeRelation = function () {
            if (String($scope.appointeeInfo.appointeeRelation) != "undefined") {
                $scope.appointeeDetails.appointeeRelation = $scope.appointeeInfo.appointeeRelation.relationship;
                $scope.appointeeDetails.appointeeRelationId = $scope.appointeeInfo.appointeeRelation.relationshipId;

            }
        };

        $scope.changeRegAddress = function () {
            if ($scope.vehicleDetails.isVehicleAddressSameAsCommun) {
               $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
               $scope.vehicleDetails.registrationAddress.regPincode = $scope.proposerDetails.communicationAddress.comPincode;
               $scope.vehicleDetails.registrationAddress.regCity= $scope.proposerDetails.communicationAddress.comCity;
              $scope.vehicleDetails.registrationAddress.regState =$scope.proposerDetails.communicationAddress.comState;
            } else {
                if (localStorageService.get("bikeRegAddress")) {
                $scope.vehicleDetails.registrationAddress.regPincode = localStorageService.get("bikeRegAddress").pincode;
                $scope.vehicleDetails.registrationAddress.regDisplayArea = localStorageService.get("bikeRegAddress").displayArea;
                $scope.vehicleDetails.registrationAddress.regCity = localStorageService.get("bikeRegAddress").city;
                $scope.vehicleDetails.registrationAddress.regState = localStorageService.get("bikeRegAddress").state;
                } else {
                   $scope.vehicleDetails.registrationAddress ={};
                   $scope.vehicleDetails.registrationAddress.regDisplayArea = "";                     
                   $scope.vehicleDetails.registrationAddress.regDoorNo = "";
                   $scope.vehicleDetails.registrationAddress.regPincode = "";
                   $scope.vehicleDetails.registrationAddress.regCity = "";
                   $scope.vehicleDetails.registrationAddress.regState = "";                
                }
            }
          //  $scope.calcDefaultRegAreaDetails($scope.vehicleDetails.pincode);
          $scope.calcDefaultRegAreaDetails($scope.vehicleDetails.registrationAddress.regPincode);
        
        };

        $scope.changePrevPolType = function () {
            if ($scope.insuranceDetails.prevPolicyType == $scope.policyTypes[0].display) {
                $scope.prevPolStatusError = false;
            } else {
                $scope.prevPolStatusError = true;
            }
        }

        $scope.changePurchasedLoan = function () {
            if ($scope.vehicleDetails.purchasedLoan == "No") {
                $scope.vehicleDetails.financeInstitution = "";
            }
            $scope.loadPlaceholder();
        };
        //commented based on bug id: 169
        /*$scope.validNomineeRelation = function(relation){
			var proposerAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
			var nomineeAge = getAgeFromDOB($scope.nominationDetails.dateOfBirth);
	
			if((Number(proposerAge) - Number(nomineeAge)) >= 18){
				if(relation.isMinorRelationsheep == "Y")
					return relation.relationship;
			}else{
				if(relation.isMinorRelationsheep == "N")
					return relation.relationship;
			}
		};*/

        $scope.validAppointeeRelation = function (relation) {
            if (relation.isApointeeRelationship == "Y")
                return relation.relationship;
        };

        $scope.validateNomineeDateOfBirth = function () { 
            //$scope.nominationDetails.personAge = getAgeFromDOB($scope.nominationDetails.dateOfBirth);
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
            $scope.relationList = $scope.genericRelationshipList;
        };

        $scope.calculateAppointeeAge = function () {
            $scope.appointeeDetails.personAge = getAgeFromDOB($scope.appointeeDetails.dateOfBirth);
        };

        $scope.calculateProposerAge = function () {
            $scope.proposerDetails.personAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
        };

        $scope.initBikeBuyScreen = function () {
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


        };

        $scope.validatePolicyStartDate = function () {
            // if (String($scope.insuranceDetails.policyStartDate) !== "undefined") {
                if (String($scope.policyStartDate) !== "undefined") {   
            //convertStringFormatToDate($scope.insuranceDetails.policyStartDate, function (formattedPolStartDate) {
                convertStringFormatToDate($scope.policyStartDate, function (formattedPolStartDate) {    
                    if ($scope.selectedProduct.ownDamagePolicyTerm) {
                        //$scope.insuranceDetails.ODPolicyStartDate = $scope.insuranceDetails.policyStartDate;
                        $scope.ODPolicyStartDate = $scope.policyStartDate;
                    }
                    if ($scope.vehicleInfo.insuranceType.value == "renew") {
                        var polEndDate = new Date(formattedPolStartDate.setFullYear(formattedPolStartDate.getFullYear() + 1));
                    } else {
                        var polEndDate = new Date(formattedPolStartDate.setFullYear(formattedPolStartDate.getFullYear() + 5));
                    }
                    polEndDate = new Date(polEndDate.setDate(polEndDate.getDate() - 1));
                    convertDateFormatToString(polEndDate, function (formattedPolEndDate) {
                        //$scope.insuranceDetails.policyEndDate = formattedPolEndDate;
                        $scope.policyEndDate = formattedPolEndDate;
                    });
                });
                // added for Own damage policy period start date and end date. as discussed with Abhishek Dh.
                if ($scope.selectedProduct.ownDamagePolicyTerm) {
                    convertStringFormatToDate($scope.ODPolicyStartDate, function (formattedODPolStartDate) {
                        var ODPolEndDate = new Date(formattedODPolStartDate.setFullYear(formattedODPolStartDate.getFullYear() + $scope.selectedProduct.ownDamagePolicyTerm));
                        ODPolEndDate = new Date(ODPolEndDate.setDate(ODPolEndDate.getDate() - 1));
                        convertDateFormatToString(ODPolEndDate, function (formattedODPolEndDate) {
                            $scope.ODPolicyEndDate = formattedODPolEndDate;
                        });
                    });
                }
            }
        };

        $scope.prevPolicyStatus = function () {
            if ($scope.vehicleInfo.insuranceType.value == "renew") {
                $scope.previousPolicyStatus = true;
                //$scope.insuranceDetails.isPrevPolicy = "Yes";
                // $scope.insuranceDetails.prevPolicyStartDate = $scope.vehicleInfo.PreviousPolicyStartDate;
                // $scope.insuranceDetails.prevPolicyEndDate = $scope.selectedProductInputParam.vehicleInfo.PreviousPolicyExpiryDate;

                if($scope.vehicleInfo.PreviousPolicyStartDate){
                    $scope.prevPolDetails.prevPolicyStartDate = $scope.vehicleInfo.PreviousPolicyStartDate;
                }else if($scope.selectedPreviousPolicyStartDate){
                    $scope.prevPolDetails.prevPolicyStartDate = $scope.selectedPreviousPolicyStartDate;   
                }
                $scope.prevPolDetails.prevPolicyEndDate = $scope.selectedProductInputParam.vehicleInfo.PreviousPolicyExpiryDate;
               // $scope.insuranceDetails.previousPolicyExpired = $scope.selectedProductInputParam.vehicleInfo.previousPolicyExpired;
                convertStringFormatToDate($scope.prevPolDetails.prevPolicyEndDate, function (formattedPrevPolEndDate) {
                    //Yogesh-25052017: Based on discussion with uday, in case of expired policy, new policy start date must be start from 3 days from todays date.
                    var todayDate = new Date();
                    if ($scope.vehicleInfo.policyStatus.key == 1 || $scope.vehicleInfo.policyStatus.key == 2) {
                        var policyStartDate = new Date(todayDate.setDate(todayDate.getDate() + 3));
                    } else {
                        policyStartDate = new Date(formattedPrevPolEndDate.setDate(formattedPrevPolEndDate.getDate() + 1));
                    }

                    convertDateFormatToString(policyStartDate, function (formattedPolicyStartDate) {
                        // $scope.insuranceDetails.policyStartDate = formattedPolicyStartDate;
                        $scope.policyStartDate = formattedPolicyStartDate;
                    });
                });
            } else {
               // $scope.insuranceDetails.isPrevPolicy = "No";
                $scope.previousPolicyStatus = false;

                /*
                 * Yogesh-07062017 : As discussed with Uday and Vipin, Policy Start Date for new policy should be equal to registration date. 
                (Today Date = Registration Date = Policy Start Date). So current default date (which is tomorrow date), changes to registration date.
                 */
                var policyStartDate = new Date();
                convertDateFormatToString(policyStartDate, function (formattedPolicyStartDate) {
                        $scope.policyStartDate = formattedPolicyStartDate;
                    // $scope.insuranceDetails.policyStartDate = formattedPolicyStartDate;
                    if ($scope.selectedProduct.ownDamagePolicyTerm) {
                        $scope.ODPolicyStartDate = formattedPolicyStartDate;
                    }
                });
            }
            $scope.validatePolicyStartDate();
        };

        $scope.validateMemebershipEndDate = function () {
            if (String($scope.vehicleInfo.memebershipEndDate) !== "undefined") {
                convertDateFormatToString($scope.vehicleInfo.memebershipEndDate, function (formattedMemEndDate) {
                    var memebershipExpiryDate = formattedMemEndDate.split("/");
                    var tempMemebershipExpiryDate = memebershipExpiryDate[1] + "/" + memebershipExpiryDate[0] + "/" + memebershipExpiryDate[2];

                    //var policyExpiryDate = $scope.insuranceDetails.policyEndDate.split("/");
                    var policyExpiryDate = $scope.policyEndDate.split("/");
                    var tempPolicyExpiryDate = policyExpiryDate[1] + "/" + policyExpiryDate[0] + "/" + policyExpiryDate[2];

                    if (new Date(tempMemebershipExpiryDate).setHours(0, 0, 0, 0) < new Date(tempPolicyExpiryDate).setHours(0, 0, 0, 0)) {
                        $scope.vehicleDetails.memebershipEndDate = undefined;
                        $scope.vehicleInfo.memebershipEndDate = null;
                    } else {
                        $scope.vehicleDetails.memebershipEndDate = formattedMemEndDate;
                        $scope.loadPlaceholder();
                    }
                });
            } else {
                $scope.vehicleDetails.memebershipEndDate = undefined;
                $scope.vehicleInfo.memebershipEndDate = null;
                $scope.memebershipEndDateError = $scope.productValidation.messages.memebershipEndDateErrorOne;
            }
        };

        $scope.changeDrivingExp = function () {
            $scope.proposerDetails.drivingExp = $scope.proposerInfo.drivingExp.display;
        };

        $scope.changeVehicleDrivenOn = function () {
            $scope.proposerDetails.vehicleDrivenOn = $scope.proposerInfo.vehicleDrivenOn.name;
        };

        $scope.changeMonthlyMileage = function () {
            $scope.vehicleDetails.monthlyMileage = $scope.vehicleInfo.monthlyMileage.value;
        };

        $scope.accordion = '1';
        $scope.editPesonalInfo = function () {
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = false;
            $scope.screenFiveStatus = false;
            $scope.accordion = '1';
        };
        $scope.editAddressInfo = function () {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.accordion = '2';
        };
        $scope.editNomineeInfo = function () {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = true;
            $scope.screenFiveStatus = false;
            $scope.accordion = '3';
        };

        $scope.editPrevPolicyInfo = function () {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = true;
            $scope.screenFiveStatus = false;
            $scope.accordion = '4';
        };

        $scope.Section2Inactive = true;
        $scope.Section3Inactive = true;
        $scope.Section4Inactive = true;
        $scope.Section5Inactive = true;
        $scope.submitPersonalDetails = function () {
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.screenFourStatus = false;
            $scope.Section2Inactive = false;
            $scope.accordion = '2';
            //added by gauri for imautic
            if (imauticAutomation == true) {
                imatEvent('ProposalFilled');
            }

            $scope.bikeProposeFormCookieDetails.proposerDetails = $scope.proposerDetails;
            $scope.bikeProposeFormCookieDetails.proposerInfo = $scope.proposerInfo;
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                saveProposal = true;
                savePersonalDetails = true;
                saveNomineeDetails = false;
                savePrevPolicyDetails = false;

                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };
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
            }
            $scope.bikeProposeFormCookieDetails.nominationDetails = $scope.nominationDetails;
            $scope.bikeProposeFormCookieDetails.appointeeDetails = $scope.appointeeDetails;
            $scope.bikeProposeFormCookieDetails.nominationInfo = $scope.nominationInfo;
            $scope.bikeProposeFormCookieDetails.appointeeInfo = $scope.appointeeInfo;
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                saveProposal = true;
                saveNomineeDetails = true;
                savePersonalDetails = true;
                savePrevPolicyDetails = false;

                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };

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
                saveProposal = true;
                savePrevPolicyDetails = true;
                savePersonalDetails = true;
                saveNomineeDetails = true;
                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };

        $scope.backToResultScreen = function () {
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $rootScope.mainTabsMenu[0].active = true;
                $rootScope.mainTabsMenu[1].active = false;
            }
            $location.path("/bikeResult");
        };

        $scope.showAuthenticateForm = function () {
            $scope.disableOTP = false;
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


        $scope.resendOTP = function () {
            var validateAuthParam = {};
            validateAuthParam.paramMap = {};
            validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
            validateAuthParam.funcType = $scope.p365Labels.functionType.optAuth;
            validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function (createOTP) {
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
                }if($scope.vehicleDetails.monthlyMileage){
                vehicleDetailRequest.monthlyMileage = $scope.vehicleDetails.monthlyMileage;
                }
                if($scope.vehicleDetails.financeInstitutionCode){
                vehicleDetailRequest.financeInstitutionCode = $scope.vehicleDetails.financeInstitutionCode;
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
        $scope.proposalInfo = function () {
            var vehicleDetailsCookie = {};
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {

                $scope.bikeProposeFormDetails = {};                
                $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
                //$scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                if (savePersonalDetails) {
                    //$scope.bikeProposeFormDetails.premiumDetails = $scope.selectedProduct;
                    $scope.bikeProposeFormDetails.proposerDetails = $scope.proposerDetails;

                    // if (!$scope.personalDetailsFlag) {
                    //     $scope.organizationDetails.salutation = "M/S";
                    //     $scope.bikeProposeFormDetails.organizationDetails = $scope.organizationDetails;
                    // } else {
                    //     $scope.bikeProposeFormDetails.organizationDetails = {};
                    // }
                    if (!$scope.personalDetailsFlag && ($scope.nominationDetails.firstName && $scope.nominationDetails.lastName)) {
                        $scope.bikeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                    } else if ($scope.personalDetailsFlag) {
                        $scope.bikeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                    } else {
                        $scope.bikeProposeFormDetails.nominationDetails = {};
                    }
                           
                    if ($scope.vehicleInfo.insuranceType) {
                        $scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                    }
                    //$scope.vehicleDetails.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();
                    //$scope.vehicleDetails.registrationNumberFormatted = $scope.vehicleDetails.registrationNumber.replace(/([a-zA-Z]{2})([0-9]{1,2})([a-zA-Z]{1,3})([0-9]{1,4})/, "$1-$2-$3-$4");

                    //added for registration number issue
                    vehicleDetailsCookie.registrationNumber = $scope.vehicleDetails.registrationNumber;
                    vehicleDetailsCookie.RTOCode = $scope.vehicleDetails.RTOCode.toUpperCase() ;
                    localStorageService.set("bikeRegistrationDetails", vehicleDetailsCookie);

                   //  tempRegNum = $scope.vehicleDetails.registrationNumberFormatted.split("-");
                    // $scope.vehicleDetails.stateCode = tempRegNum[0];
                    // $scope.vehicleDetails.cityCode = tempRegNum[1];
                    // $scope.vehicleDetails.regNumberPrefix = tempRegNum[2];
                    // $scope.vehicleDetails.regNumber = tempRegNum[3];

                    //$scope.bikeProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                    $scope.bikeProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                    $scope.createBikeVehicleDetailsRequest();
                }
                if (saveNomineeDetails) {
                    $scope.bikeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                    $scope.bikeProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                    if (localStorageService.get("proposalId")) {
                        $scope.proposalId = localStorageService.get("proposalId");
                        $scope.bikeProposeFormDetails.proposalId = $scope.proposalId;
                    }
                }
                if (savePrevPolicyDetails) {
                    $scope.bikeProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                    if (localStorageService.get("proposalId")) {
                        $scope.proposalId = localStorageService.get("proposalId");
                        $scope.bikeProposeFormDetails.proposalId = $scope.proposalId;
                    }
                }

                if (!saveProposal) {
                    if ($scope.vehicleInfo.insuranceType) {
                        $scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                    }
                    $scope.vehicleDetails.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();
                    // $scope.vehicleDetails.registrationNumberFormatted = $scope.vehicleDetails.registrationNumber.replace(/([a-zA-Z]{2})([0-9]{1,2})([a-zA-Z]{1,3})([0-9]{1,4})/, "$1-$2-$3-$4");

                     // tempRegNum = $scope.vehicleDetails.registrationNumberFormatted.split("-");
                    // $scope.vehicleDetails.stateCode = tempRegNum[0];
                    // $scope.vehicleDetails.cityCode = tempRegNum[1];
                    // $scope.vehicleDetails.regNumberPrefix = tempRegNum[2];
                    // $scope.vehicleDetails.regNumber = tempRegNum[3];

                    $scope.vehicleDetails.engineNumber = $scope.vehicleDetails.engineNumber.toUpperCase();
                    $scope.vehicleDetails.chassisNumber = $scope.vehicleDetails.chassisNumber.toUpperCase();
                    // $scope.vehicleDetails.RTOCode = $scope.selectedProductInputParam.vehicleInfo.RTOCode;
                   // $scope.bikeProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                        $scope.createBikeVehicleDetailsRequest();
                }
                var selectedInsuranceType = localStorageService.get("selectedInsuranceType");
                if ($scope.selectedProduct.policyType == 'new' && selectedInsuranceType == "comprehensive") {
                    // $scope.insuranceDetails.policyStartDate = $scope.insuranceDetails.ODPolicyStartDate;
                    // $scope.insuranceDetails.policyEndDate = $scope.insuranceDetails.ODPolicyEndDate;
                    $scope.policyStartDate = $scope.ODPolicyStartDate;
                    $scope.policyEndDate = $scope.ODPolicyEndDate;
                }
                $scope.bikeProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
                $scope.bikeProposeFormDetails.productId = $scope.selectedProduct.productId;
            }
            if ($rootScope.baseEnvEnabled && $rootScope.wordPressEnabled) {
                $scope.bikeProposeFormDetails = {};
                $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";

                if ($scope.vehicleInfo.insuranceType) {
                    $scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                }

               // $scope.vehicleDetails.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();
                //$scope.vehicleDetails.registrationNumberFormatted = $scope.vehicleDetails.registrationNumber.replace(/([a-zA-Z]{2})([0-9]{1,2})([a-zA-Z]{1,3})([0-9]{1,4})/, "$1-$2-$3-$4");

                vehicleDetailsCookie.registrationNumber = $scope.vehicleDetails.registrationNumber;
                vehicleDetailsCookie.RTOCode = $scope.vehicleDetails.RTOCode.toUpperCase() ;
                localStorageService.set("bikeRegistrationDetails", vehicleDetailsCookie);

                $scope.vehicleDetails.engineNumber = $scope.vehicleDetails.engineNumber.toUpperCase();
                $scope.vehicleDetails.chassisNumber = $scope.vehicleDetails.chassisNumber.toUpperCase();
               
                // $scope.vehicleDetails.RTOCode = $scope.selectedProductInputParam.vehicleInfo.RTOCode;
                    // if($scope.selectedProductInputParam.quoteParam.onlyODApplicable!=undefined){
                    // $scope.insuranceDetails.onlyODApplicable = $scope.selectedProductInputParam.quoteParam.onlyODApplicable;
                    // }
                
                    var selectedInsuranceType = localStorageService.get("selectedInsuranceType");
                if ($scope.selectedProduct.policyType == 'new' && selectedInsuranceType == "comprehensive") {
                    // $scope.insuranceDetails.policyStartDate = $scope.insuranceDetails.ODPolicyStartDate;
                    // $scope.insuranceDetails.policyEndDate = $scope.insuranceDetails.ODPolicyEndDate;
                    $scope.policyStartDate = $scope.ODPolicyStartDate;
                    $scope.policyEndDate = $scope.ODPolicyEndDate;
                }
    
                $scope.bikeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                //$scope.bikeProposeFormDetails.premiumDetails = $scope.selectedProduct;
                $scope.bikeProposeFormDetails.proposerDetails = $scope.proposerDetails;
                $scope.bikeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                $scope.bikeProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                $scope.bikeProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                $scope.bikeProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
                $scope.bikeProposeFormDetails.productId = $scope.selectedProduct.productId;
               // $scope.bikeProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                $scope.createBikeVehicleDetailsRequest();
              }
        }
        $scope.proceedForPayment = function () {
            $scope.proceedPaymentStatus = false;
            $scope.submitProposalClicked = false;
            $scope.invalidOTPError = "";
            $scope.proposalInfo();
            $scope.bikeProposeFormDetails.QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
            $scope.bikeProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.bike;
            $scope.bikeProposeFormDetails.source = sourceOrigin;
            if(isPolicyRenewed){
            $scope.bikeProposeFormDetails.isPolicyRenewed = isPolicyRenewed;
            }
            delete $scope.bikeProposeFormDetails.proposalId;
            if ($scope.referralCode) {
                $scope.bikeProposeFormDetails.referralCode = $scope.referralCode;
            }
            if (!$rootScope.wordPressEnabled) {
                if ($rootScope.baseEnvEnabled && $rootScope.agencyPortalEnabled) {
                    const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
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
            } 
 
            // Google Analytics Tracker added.
            //analyticsTrackerSendData($scope.bikeProposeFormDetails);
            
            if ($scope.bikeProposeFormDetails.QUOTE_ID) {
                $scope.loading = true;

                RestAPI.invoke("bikeProposal", $scope.bikeProposeFormDetails).then(function (proposeFormResponse) {
                    $scope.modalOTP = false;
                    if (!$rootScope.wordPressEnabled) {
                        $scope.proceedPaymentStatus = true;
                    }
                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                        if(proposeFormResponse.data.encryptedProposalId)
                        localStorageService.set("proposalIdEncrypted",proposeFormResponse.data.encryptedProposalId);

                        //added by gauri for mautic application
                        if (imauticAutomation == true) {
                            imatBikeProposal(localStorageService, $scope, 'MakePayment', function (shortURLResponse) {
                            });
                        }

                        $scope.responseToken = proposeFormResponse.data;
                        $scope.responseToken.paymentGateway = $scope.paymentURL;

                        $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.bike;
                        localStorageService.set("bikeReponseToken", $scope.responseToken);
                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.paymentService, $scope.responseToken, function (paymentDetails) {
                            if (paymentDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.paymentServiceResponse = paymentDetails.data;
                                //olark
                                var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                // for (var i = 0; i < paymentURLParamListLength; i++) {
                                //     if ($scope.paymentServiceResponse.paramterList[i].name == 'SourceTxnId' && $scope.paymentServiceResponse.paramterList[i].ngModel == 'SourceTxnId') {
                                //         olarkCustomParam($scope.paymentServiceResponse.paramterList[i].value, $scope.p365Labels.businessLineType.car, '', 'proposal');
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
                                if ($rootScope.wordPressEnabled) {
                                    $scope.proceedPaymentStatus = true;
                                }
                                var buyScreenCnfrmError = paymentDetails.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                               // $rootScope.P365Alert($scope.p365Labels.common.p365prompt, buyScreenCnfrmError, "Ok");
                               if(proposeFormResponse.message){
                                $rootScope.P365Alert("Policies365", proposeFormResponse.message, "Ok"); 
                            }else{
                                $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");
                            }
                            }
                        });
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
                            $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");  
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
            } else {
                $scope.proceedPaymentStatus = true;
                $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
            }
           
        };

        $scope.loadPlaceholder = function () {
            setTimeout(function () {
                $('.buyform-control').on('focus blur', function (e) {
                    $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
                }).trigger('blur');
            }, 100);
        };

        $scope.fillDataForRenewal = function () {
            $scope.proposerDetails = localStorageService.get("BikeProposalResForRenewal").proposerDetails;
            $scope.vehicleDetails = localStorageService.get("BikeProposalResForRenewal").vehicleDetails;
           // $scope.vehicleInfo.registrationNumber = tempRegNum[2] + '' + tempRegNum[3];
            $scope.nominationDetails = localStorageService.get("BikeProposalResForRenewal").nominationDetails;
            for (var i = 0; i < $scope.genericRelationshipList.length; i++) {
                if ($scope.genericRelationshipList[i].relationship == $scope.nominationDetails.nominationRelation) {
                    $scope.nominationInfo.nominationRelation = $scope.genericRelationshipList[i];
                    break;
                }
            }

            $scope.appointeeDetails = localStorageService.get("BikeProposalResForRenewal").appointeeDetails;
            for (var i = 0; i < $scope.genericRelationshipList.length; i++) {
                if ($scope.genericRelationshipList[i].relationship == $scope.appointeeDetails.appointeeRelation) {
                    $scope.validateNomineeDateOfBirth();
                    $scope.appointeeInfo.appointeeRelation = $scope.genericRelationshipList[i];
                    break;
                }
            }
            $scope.insuranceDetails = localStorageService.get("BikeProposalResForRenewal").insuranceDetails;
            for (var i = 0; i < $scope.carrierList.length; i++) {
                if ($scope.carrierList[i].carrierName == $scope.insuranceDetails.insurerName) {
                    $scope.insuranceInfo.insurerName = $scope.carrierList[i];
                    break;
                    
                }
            }
        }

        $scope.closeModal = function(){
            $scope.modalPrevPolExpiredError = false;
        }
        
        $scope.prepopulateFields = function () {
            $scope.authenticate.enteredOTP = "";

            //formatting registration number
            $scope.vehicleDetails.registrationNumber = angular.copy($rootScope.vehicleDetails.registrationNumber);
            $scope.vehicleInfo.registrationNumber = '';

            //function called to fill proposal form using proposal number in case of RenewalEmail
            if ($location.search().isForRenewal) {
                $scope.fillDataForRenewal();
            }
            if ($rootScope.vehicleDetails.registrationNumber && $rootScope.showBikeRegAreaStatus == false) {
                var formatRegisCode = $rootScope.vehicleDetails.registrationNumber;
                $scope.vehicleInfo.registrationNumber = formatRegisCode.substring(4);
            }
            if ($scope.proposerDetails.GSTIN) {
                //$scope.selectedProductInputParam.GSTIN=$scope.proposerDetails.GSTIN;
                $scope.checkGSTINNumber($scope.proposerDetails.GSTIN);
                //$scope.calcQuoteOnGSTINNumber($scope.proposerDetails.GSTIN);
            }

            $scope.insuranceDetails.ncb = $scope.selectedProductInputParam.quoteParam.ncb;
            //$scope.insuranceDetails.isNCB = ($scope.selectedProductInputParam.vehicleInfo.previousClaim == "false") ? "Y" : "N";
            var regDate = $scope.selectedProductInputParam.vehicleInfo.dateOfRegistration.split("/");
            $scope.displayRegistrationDate = regDate[0] + "-" + monthListGeneric[Number(regDate[1]) - 1] + "-" + regDate[2];
            $scope.panCardStaus = Number($scope.selectedProduct.grossPremium) >= 100000 ? true : false;
            $scope.insuranceDetails.prevPolicyType = policyTypesGeneric[0].display;
            $scope.vehicleDetails.RTOCode = $scope.selectedProductInputParam.vehicleInfo.RTOCode;

            // if ($scope.vehicleInfo.regYear) {
            //     $scope.vehicleDetails.regYear = $scope.vehicleInfo.regYear;
            // }
            $scope.riderStatus = false;
            if ($scope.selectedProduct.ridersList != null && String($scope.selectedProduct.ridersList) != "undefined") {
                for (var i = 0; i < $scope.selectedProduct.ridersList.length; i++) {
                    if ($scope.selectedProduct.ridersList[i].riderValue != null) {
                        $scope.riderStatus = true;
                        delete $scope.selectedProduct.ridersList[i].$$hashKey;
                    }
                }
            }

            if ($scope.vehicleInfo.policyStatus.policyType == "expired" && $scope.vehicleInfo.policyStatus.displayText2 == "> 90 days") {
                $scope.showPaymentButton = false;
            } else {
                $scope.showPaymentButton = true;
            }

            // Below piece of code written for bike HDFC Ergo Product.
            $scope.proposerAgeValue = function (personAge) {
                $scope.proposerDetails.personAge = personAge;
                if (personAge <= 35) {
                    $scope.proposerDetails.personAgeCaption = "Up to 35";
                } else if (personAge > 35 && personAge <= 45) {
                    $scope.proposerDetails.personAgeCaption = "35 to 45";
                } else {
                    $scope.proposerDetails.personAgeCaption = "More than 45";
                }
            };
            $scope.proposerAgeValue($scope.selectedProductInputParam.quoteParam.personAge);

            //fxn to calculate default area details
            $scope.calcDefaultAreaDetails = function (areaCode) {
                //Sayli-04082017: As disscussed with yogesh, Delhi Pincode pre population issue
                if (areaCode != null && String(areaCode) != "undefined" && String(areaCode).length > 0) {
                    var docType = $scope.p365Labels.documentType.cityDetails;
                    var carrierId = $scope.selectedProduct.carrierId;

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
                    var carrierId = $scope.selectedProduct.carrierId;

                    $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {
                        var areaDetails = JSON.parse(response.data);
                        if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                            $scope.onSelectVehiclePinOrArea(areaDetails.data[0]);
                        }
                    });
                }
            };

            // if (String($scope.proposerDetails.pincode) == "undefined") {
            // 	if (localStorageService.get("commAddressDetails") != null && String(localStorageService.get("commAddressDetails")) != "undefined") {
            // 		if (localStorageService.get("commAddressDetails").cityStatus) {
            // 			$scope.proposerDetails.pincode = localStorageService.get("commAddressDetails").pincode;
            // 		} else {
            // 			$scope.proposerDetails.pincode = "";
            // 		}
            // 	} else {
            // 		$scope.proposerDetails.pincode = "";
            // 	}
            // }

            if (localStorageService.get("commAddressDetails")) {
                $scope.proposerDetails.communicationAddress = localStorageService.get("commAddressDetails");
              //  $scope.proposerDetails.pincode = localStorageService.get("commAddressDetails").pincode;
              $scope.proposerDetails.communicationAddress.comPincode = localStorageService.get("commAddressDetails").pincode;
             
              //   $scope.proposerDetails.address = localStorageService.get("commAddressDetails").displayArea;
             $scope.proposerDetails.communicationAddress.comDisplayArea= localStorageService.get("commAddressDetails").displayArea;
             
               // $scope.proposerDetails.city = localStorageService.get("commAddressDetails").city;
               $scope.proposerDetails.communicationAddress.comCity = localStorageService.get("commAddressDetails").city;
               
               // $scope.proposerDetails.state = localStorageService.get("commAddressDetails").state;
               $scope.proposerDetails.communicationAddress.comState = localStorageService.get("commAddressDetails").state;
            
            } else {
               // $scope.proposerDetails.pincode = "";
               $scope.proposerDetails.communicationAddress.comPincode = "";
                 
               $scope.proposerDetails.communicationAddress.comDoorNo = "";
               // $scope.proposerDetails.address = "";
               $scope.proposerDetails.communicationAddress.comDisplayArea = "";

              // $scope.proposerDetails.city = "";
              $scope.proposerDetails.communicationAddress.comCity = "";
                
              // $scope.proposerDetails.state = "";
               $scope.proposerDetails.communicationAddress.comState = "";
            
            }


            if (localStorageService.get("bikeRegAddress")) {
              //  $scope.vehicleDetails.pincode = localStorageService.get("bikeRegAddress").pincode;
              $scope.vehicleDetails.registrationAddress.regPincode= localStorageService.get("bikeRegAddress").pincode;
              
              //  $scope.vehicleDetails.address = localStorageService.get("bikeRegAddress").displayArea;
              $scope.vehicleDetails.registrationAddress.regDisplayArea = localStorageService.get("bikeRegAddress").displayArea;
                  
           //   $scope.vehicleDetails.city = localStorageService.get("bikeRegAddress").city;
           $scope.vehicleDetails.registrationAddress.regCity = localStorageService.get("bikeRegAddress").city;
               
           //  $scope.vehicleDetails.state = localStorageService.get("bikeRegAddress").state;
              $scope.vehicleDetails.registrationAddress.regState = localStorageService.get("bikeRegAddress").state;
            
            } else {
              //  $scope.vehicleDetails.pincode = "";
              $scope.vehicleDetails.registrationAddress.regPincode = "";
                  
              $scope.vehicleDetails.registrationAddress.regDoorNo = "";
               // $scope.vehicleDetails.address = "";
               $scope.vehicleDetails.registrationAddress.regDisplayArea = "";
                 
             //  $scope.vehicleDetails.city = "";
             $scope.vehicleDetails.registrationAddress.regCity = "";
             
             //   $scope.vehicleDetails.state = "";
             $scope.vehicleDetails.registrationAddress.regState= "";
            
            }

            // $scope.calcDefaultAreaDetails($scope.proposerDetails.pincode);
         //   $scope.calcDefaultRegAreaDetails($scope.vehicleDetails.pincode);
         $scope.calcDefaultRegAreaDetails($scope.vehicleDetails.registrationAddress.regPincode);
        
        };

        // Fetch generic relationship list from DB.
        $scope.getRelationshipList = function () {
            getDocUsingId(RestAPI, "relationshipdetailslist", function (relationList) {
                $scope.genericRelationshipList = relationList.relationships;
                
                    if (localStorageService.get("selectedBikeDetails")) {
                        $scope.vehicleInfo = localStorageService.get("selectedBikeDetails");
                    }
                    $scope.proposerDetails.gender = "Male";
                    $scope.proposerDetails.salutation = "Mr";
                    
                    //condition added for ipos as quoteUserInfo is null when we came from dcp controller
                    if ($scope.quoteUserInfo) {
                        $scope.proposerDetails.emailId = String($scope.quoteUserInfo.emailId) !== "undefined" ? $scope.quoteUserInfo.emailId : $scope.proposerDetails.emailId;
                        $scope.proposerDetails.mobileNumber = String($scope.quoteUserInfo.mobileNumber) !== "undefined" ? $scope.quoteUserInfo.mobileNumber : $scope.proposerDetails.mobileNumber;
                        $scope.proposerDetails.lastName = String($scope.quoteUserInfo.lastName) !== "undefined" ? $scope.quoteUserInfo.lastName : $scope.proposerDetails.lastName;
                        $scope.proposerDetails.firstName = String($scope.quoteUserInfo.firstName) !== "undefined" ? $scope.quoteUserInfo.firstName : $scope.proposerDetails.firstName;                                          
                    }
                    $scope.proposerDetails.dateOfBirth = $scope.selectedProductInputParam.vehicleInfo.dateOfBirth;

                    var nominationDateOfBirth = new Date(new Date().setYear(Number(new Date().getFullYear()) - 35));
                    convertDateFormatToString(nominationDateOfBirth, function (formattedDOB) {
                        //$scope.nominationDetails.dateOfBirth = formattedDOB;
                        $scope.nominationDetails.nomDateOfBirth = formattedDOB;
                        $scope.validateNomineeDateOfBirth();
                    });

                    $scope.vehicleDetails.isVehicleAddressSameAsCommun = false;
                    $scope.vehicleDetails.purchasedLoan = "No";

                    $scope.prepopulateFields();
                    $scope.prevPolicyStatus();
                    $scope.changeRegAddress();
                    $scope.loadPlaceholder();
            });
        }

        $scope.validateRegistrationNumber = function (registrationNumber) {
            if (String(registrationNumber) != "undefined") {
                registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
                if ((registrationNumber.trim()).match(/^[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 7 && (registrationNumber.trim()).length >= 2) {
                    $scope.regNumStatus = false;
                    $scope.vehicleDetailsForm.RegistrationNumber.$setValidity('RegistrationNumber', true);
                    if ($scope.productValidation.regNumberReQuoteCalc) {
                        $scope.calcQuoteOnRegistrationNumber(registrationNumber);
                    }else if($scope.productValidation.renewPolicyQuoteCalc){  // flag to recalculate quote for renewal with same carrier policy
                        if($scope.selectedProductInputParam.quoteParam.policyType == 'renew'){
                        if( $scope.selectedProduct.carrierId == $scope.insuranceDetails.insurerId){
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
        }
        //function created for quote recalculation on registration number in renewal case for HDFC
        $scope.calcQuoteOnRegistrationNumber = function (regNumber) {
            $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam);
            if ($scope.selectedProductInputParamCopy.vehicleInfo.registrationNumber) {
                $scope.registrationNumberCopy = $scope.selectedProductInputParam.vehicleInfo.registrationNumber.toUpperCase();
            } else {
                $scope.registrationNumberCopy = '';
            }
            $scope.newRegistrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + regNumber.toUpperCase();
            if ($scope.newRegistrationNumber != $scope.registrationNumberCopy) {
                $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");

                $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.regNumberChangeMsg, "No", "Yes", function (confirmStatus) {
                    if (confirmStatus) {
                        $scope.loading = true;
                        $scope.selectedProductInputParam.vehicleInfo.registrationNumber = $scope.newRegistrationNumber;
                        $scope.bikeQuoteRequestFormation();
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
                        $scope.calculateBikeQuote();
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
                        $scope.bikeQuoteRequestFormation();
                        // if (localStorageService.get("quoteUserInfo").mobileNumber) {

                        //     $scope.quote.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;

                        // }
                        // if (localStorageService.get("PROF_QUOTE_ID")) {
                        //     $scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                        // }
                        localStorageService.set("bikeQuoteInputParamaters",$scope.quote);
                        RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quote).then(function (proposeFormResponse) {
                            $scope.bikeRecalculateQuoteRequest = [];
                            if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                $scope.responseRecalculateCodeList = [];
                                $scope.quoteCalcResponse = [];

                                if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                                    $scope.quoteCalcResponse.length = 0;
                                }
                                
                                localStorageService.set("bikeQuoteInputParamaters",$scope.quote);
                               // localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                               localStorageService.set("BIKE_UNIQUE_QUOTE_ID", proposeFormResponse.QUOTE_ID);
                               localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", proposeFormResponse.encryptedQuoteId);
                               $scope.bikeRecalculateQuoteRequest = proposeFormResponse.data;
                                angular.forEach($scope.bikeRecalculateQuoteRequest, function (obj, i) {
                                    var request = {};
                                    var header = {};

                                    header.messageId = messageIDVar;
                                    header.campaignID = campaignIDVar;
                                    header.source = sourceOrigin;
                                    header.transactionName = getBikeQuoteResult;
                                    header.deviceId = deviceIdOrigin;
                                    request.header = header;
                                    request.body = obj;

                                    $http({
                                        method: 'POST',
                                        url: getQuoteCalcLink,
                                        data: request
                                    }).
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
                                                        if ( carQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            carQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) 
                                                      
                                                   {
                                                   
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
            					$scope.proposerDetails.pincode = item.pincode;
            					$scope.proposerDetails.city = item.city;
            					$scope.proposerDetails.state = item.state;
            					$scope.checkForSameAddress();
            				}*/
        };

        $scope.scheduleVehicleInspection = function () {
            $location.path('/FourWheelerscheduleInspection');
        };

        $rootScope.signout = function () {
            $rootScope.userLoginStatus = false;
            var userLoginInfo = {};
            userLoginInfo.username = "";
            userLoginInfo.status = $rootScope.userLoginStatus;
            localStorageService.set("userLoginInfo", userLoginInfo);
            $location.path("/quote");
        };

        $scope.missionCompled = function () {
            $scope.loading = false;
        };

        /*----- iPOS+ Functions-------*/
        $scope.getCarrierList = function () {
            getListFromDB(RestAPI, "", $scope.p365Labels.documentType.carCarrier, $scope.p365Labels.request.findAppConfig, function (bikeCarrierList) {
                if (bikeCarrierList.responseCode == $scope.p365Labels.responseCode.success) {
                    $scope.carrierList = bikeCarrierList.data;
                    // var docId = $scope.p365Labels.documentType.buyScreen + "-" + $scope.selectedProductInputParam.quoteParam.quoteType;
                    // getDocUsingId(RestAPI, docId, function (buyScreenTooltip) {
                    // 	$scope.buyTooltip = buyScreenTooltip.toolTips;
                    $scope.getRelationshipList();
                    $rootScope.loading = false;
                    // });
                } else {

                    $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.serverError, "Ok");
                }
            });
        }

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

        $scope.sendProposalEmail = function () {
            var proposalDetailsEmail = {};
            proposalDetailsEmail.paramMap = {};

            proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
            proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
            proposalDetailsEmail.isBCCRequired = 'Y';
            proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
            proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.bike;
           // proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
           if($scope.iposRequest.docId){
                proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
            }else{
                proposalDetailsEmail.paramMap.quoteId =localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
            }
            proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
            proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
            proposalDetailsEmail.paramMap.LOB = String($scope.p365Labels.businessLineType.bike);
            console.log('$rootScope.encryptedProposalID in bike is:',$rootScope.encryptedProposalID);
            if($scope.shortenURL){
                proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;
            }else{
                $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2";   
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
                    $scope.sendSMS();
                    $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                    $scope.loading = false;
                }
            });
        }
        $scope.submitProposalData = function () {

            $scope.bikeProposalDetails= {};
            $scope.submitProposalClicked = true;
            $scope.proposalInfo();
            $scope.bikeProposeFormDetails.QUOTE_ID = $scope.iposRequest.docId;
            $scope.bikeProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.bike;
            $scope.bikeProposeFormDetails.source = sourceOrigin;
            $scope.bikeProposeFormDetails.requestSource = sourceOrigin;
            if(isPolicyRenewed){
                $scope.bikeProposeFormDetails.isPolicyRenewed = isPolicyRenewed;
            }
            //$scope.bikeProposeFormDetails.carrierProposalStatus = false;

            $scope.loading = true;
            if (!saveProposal) {
                //$scope.bikeProposeFormDetails.isCleared = true;
                delete $scope.bikeProposeFormDetails.proposalId;
                if ($rootScope.agencyPortalEnabled) {
                    const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
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
                    //alert("proposeFormResponse :"+JSON.stringify(proposeFormResponse.data));
                    RestAPI.invoke("bikeProposal", $scope.bikeProposeFormDetails).then(function (proposeFormResponse) {
                        if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                            $scope.responseToken = proposeFormResponse.data;
                            $scope.responseToken.paymentGateway = $scope.paymentURL;
                            $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.bike;
                            localStorageService.set("bikeReponseToken", $scope.responseToken);

                            // added to store the encrypted store prosal id 
                            localStorageService.set("proposalIdEncrypted", proposeFormResponse.data.encryptedProposalId);

                            $rootScope.encryptedProposalID = proposeFormResponse.data.encryptedProposalId;
                            $rootScope.encryptedLOB = $scope.p365Labels.businessLineType.bike;
                            
                            //added by gauri for mautic application
                            if (imauticAutomation == true) {
                                // $scope.shortURLResponse= imatBikeProposal(localStorageService, $scope, 'SubmitProposal');                    
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
                                $http({
                                    method: 'POST',
                                    url: getShortURLLink,
                                    data: body
                                }).
                                    success(function (shortURLResponse) {
                                        if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.shortURLResponse = shortURLResponse;
                                            $scope.shortenURL = $scope.shortURLResponse.data.shortURL;
                                            $scope.sendProposalEmail();
                                        } else {
                                            //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                            $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2";
                                            $scope.sendProposalEmail();
                                            $scope.loading = false;
                                        }
                                    });
                            }

                        }else if ((proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error)||( proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1)) {
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
                                $rootScope.P365Alert("Policies365", proposeFormResponse.data, "Ok");  
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
                    }else {
                    $scope.loading = false;
                    $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                }
            } else {
                RestAPI.invoke($scope.transactionSaveProposal, $scope.bikeProposeFormDetails).then(function (proposeFormResponse) {
                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.proposalId = proposeFormResponse.data;
                        localStorageService.set("proposalId", $scope.proposalId);
                        $scope.loading = false;
                        saveProposal = false;
                    } else {
                        $scope.loading = false;
                        saveProposal = false;
                    }
                });
            }
        }

        $scope.sendPaymentSuccessEmail = function(){
            var proposalDetailsEmail = {};
            proposalDetailsEmail.paramMap = {};
        
            proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
    
            console.log('$scope.longURL in send email is: ',$scope.longURL);
            console.log('$rootScope.encryptedProposalID in bike is:',$rootScope.encryptedProposalID);
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
            // if($scope.iposRequest.docId){
            // proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
            // }else{
            //     proposalDetailsEmail.paramMap.quoteId =localStorageService.get("CAR_UNIQUE_QUOTE_ID");
            // }
            // proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
            // proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
            // proposalDetailsEmail.paramMap.LOB = "2";
            // if($scope.shortURLResponse){
            // proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;
            // }else{
            //     proposalDetailsEmail.paramMap.url ="" + sharePaymentLink + "" + proposalId + "&lob=3";
            // }
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
                //$scope.redirectToPaymentGateway();
            }
        };
        /*----- iPOS+ Functions Ends -------*/


        $scope.hideModalAP = function () {
            $scope.modalAP = false;
        };


        /*----- iPOS+ Code Starts -------*/
        var data = {};
        // add proposal  of the renewal if present 
        if (localStorageService.get("renewPolicyDetails")) {
            var renewPolicyDetails = localStorageService.get("renewPolicyDetails");
            data.proposalId = renewPolicyDetails.productId;
        }
        data.messageId = messageIDVar;
        RestAPI.invoke("getLeadInfo", data).then(function (callback) {
            if (callback.responseCode == 1000) {

                // if data is present then assign the values    
                if (callback.data) {
                    if (callback.data.proposerDetails && Object.keys(callback.data.proposerDetails).length !== 0) {
                        //$scope.proposerDetails = callback.data.proposerDetails;

                        if (callback.data.proposerDetails.communicationAddress) {
                            // Copy  contents of the communication address 
                            // Object.keys(callback.data.proposerDetails.communicationAddress).forEach(function (key) {
                            //     $scope.proposerDetails[key] = angular.copy(callback.data.proposerDetails.communicationAddress[key]);
                            // })
                            $scope.proposerDetails.communicationAddress.comCity = callback.data.proposerDetails.communicationAddress.comCity ;
                            $scope.proposerDetails.communicationAddress.comDisplayArea= callback.data.proposerDetails.communicationAddress.comDisplayArea ;
                            $scope.proposerDetails.communicationAddress.comPincode = callback.data.proposerDetails.communicationAddress.comPincode ;
                            $scope.proposerDetails.communicationAddress.comState = callback.data.proposerDetails.communicationAddress.comState;
                            localStorageService.set("commAddressDetails",$scope.proposerDetails.communicationAddress);
                        }

                    }
                    if (callback.data.vehicleDetails && Object.keys(callback.data.vehicleDetails).length !== 0) {
                        //$scope.vehicleDetails = callback.data.vehicleDetails;
                        $scope.vehicleDetails.registrationAddress.regDoorNo = callback.data.vehicleDetails.doorNo;
                        $scope.vehicleDetails.purchasedLoan = callback.data.vehicleDetails.purchasedLoan;
                        $scope.vehicleDetails.isVehicleAddressSameAsCommun = callback.data.vehicleDetails.isVehicleAddressSameAsCommun;
                        $scope.vehicleDetails.chassisNumber = callback.data.vehicleDetails.chassisNumber;
                        $scope.vehicleDetails.registrationNumber = callback.data.vehicleDetails.registrationNumber;
                        // Copy  contents of the vehicleDetails.registrationAddress to vehicleDetails 
                        if (callback.data.vehicleDetails.registrationAddress) {
                            // Object.keys(callback.data.vehicleDetails.registrationAddress).forEach(function (key) {
                            //     $scope.vehicleDetails[key] = callback.data.vehicleDetails.registrationAddress[key];
                            // });
                            $scope.vehicleDetails.registrationAddress.regCity = callback.data.vehicleDetails.registrationAddress.regCity ;
                            $scope.vehicleDetails.registrationAddress.regDisplayArea= callback.data.vehicleDetails.registrationAddress.regDisplayArea ;
                            $scope.vehicleDetails.registrationAddress.regPincode = callback.data.vehicleDetails.registrationAddress.regPincode ;
                            $scope.vehicleDetails.registrationAddress.regState = callback.data.vehicleDetails.registrationAddress.regState;
                            // Added for setting the  re details
                            $rootScope.vehicleDetails.registrationNumber = callback.data.vehicleDetails.registrationNumber
                            $rootScope.showCarRegAreaStatus = false;
                        }
                    }
                    if (callback.data.appointeeDetails && Object.keys(callback.data.appointeeDetails).length !== 0)
                        $scope.appointeeDetails = callback.data.appointeeDetails;
                    if (callback.data.nominationDetails && Object.keys(callback.data.nominationDetails).length !== 0){
                        //$scope.nominationDetails = callback.data.nominationDetails;
                        $scope.nominationDetails.nomDateOfBirth = callback.data.nominationDetails.nomDateOfBirth;
                        $scope.nominationDetails.nomFirstName = callback.data.nominationDetails.nomFirstName;
                        $scope.nominationDetails.nomLastName = callback.data.nominationDetails.nomLastName;
                        $scope.nominationDetails.nominationRelation = callback.data.nominationDetails.nominationRelation;
                        $scope.nominationDetails.nominationRelationId = callback.data.nominationDetails.nominationRelationId;
                        $scope.nominationDetails.nomPersonAge = callback.data.nominationDetails.nomPersonAge;
                    }
                    if (callback.data.insuranceDetails && Object.keys(callback.data.insuranceDetails).length !== 0){
                       //$scope.insuranceDetails = callback.data.insuranceDetails;
                       $scope.insuranceDetails.policyNumber = callback.data.insuranceDetails.policyNumber;
                       $scope.insuranceDetails.insuranceType = callback.data.insuranceDetails.insuranceType;
                       $scope.insuranceDetails.ncb = callback.data.insuranceDetails.ncb;
                       $scope.insuranceDetails.insurerId = callback.data.insuranceDetails.insurerId;
                       $scope.insuranceDetails.insurerName = callback.data.insuranceDetails.insurerName;
                       $scope.insuranceDetails.prevPolicyType = callback.data.insuranceDetails.prevPolicyType;
                    }if (callback.data.insuranceInfo && Object.keys(callback.data.insuranceInfo).length !== 0)
                        $scope.insuranceInfo = callback.data.insuranceInfo;
                }
                if ($scope.iposRequest.docId) {
                    //	$http.get(wp_path+'ApplicationLabels.json').then(function (applicationCommonLabels) {
                    // $scope.p365Labels = applicationCommonLabels.data.globalLabels;
                    // localStorageService.set("applicationLabels", applicationCommonLabels.data);
                    $scope.p365Labels = bikePreoposalLabels;                                   
                    if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                        $rootScope.iquoteRedirectionURL = '/sharefromAPI';
                        $scope.isIquoteEnabled = false;
                        $rootScope.iquoteRequestParam = { lob: $scope.p365Labels.businessLineType.bike, createLeadFlag: $location.search().createLeadFlag, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName };
                        $rootScope.iquoteRequestParam.docId = $scope.iposRequest.docId;
                        
                        $rootScope.iposRedirectionURL = "/proposalresdata";
                        $rootScope.iposRequestParam = { proposalId: $location.search().proposalId, messageId: $location.search().messageId, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName };

                        $rootScope.isActiveTab = 'ipos';
                        $rootScope.mainTabsMenu = [{ url: $rootScope.iquoteRedirectionURL, requestParam: $rootScope.iquoteRequestParam, className: 'iQuoteTab tabs wp_border32', name: 'iquote', title: "iQuote", active: $scope.isIquoteEnabled },
                        { url: $rootScope.iposRedirectionURL, requestParam: $rootScope.iposRequestParam, className: 'iPosTab tabs wp_border32', name: 'ipos', title: "iPos", active: !$scope.isIquoteEnabled }];
                    }
                   
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");

                    //$scope.vehicleData = {};
                    $rootScope.vehicleDetails = {};
                    $scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;

                    RestAPI.invoke("quoteDataReader", $scope.iposRequest).then(function (quoteData) {

                        if (quoteData.responseCode == $scope.p365Labels.responseCode.success) {

                            $scope.quoteInfo = quoteData.data;
                            var buyScreenParam = {};
                            buyScreenParam.documentType = "proposalScreenConfig";
                            $scope.selectedProductInputParam = $scope.quoteInfo.bikeQuoteRequest;
                            $scope.vehicleInfo = $scope.selectedProductInputParam.vehicleInfo;
                            //$scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                            $scope.insuranceDetails.insuranceType = $scope.quoteInfo.bikeQuoteRequest.quoteParam.policyType;
                            $scope.quoteCalcResponse = $scope.quoteInfo.bikeQuoteResponse;
                            
                            if($scope.vehicleInfo.PreviousPolicyStartDate){
                            $scope.selectedPreviousPolicyStartDate = $scope.vehicleInfo.PreviousPolicyStartDate;
                            }
                            for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                                if ($scope.quoteCalcResponse[i].carrierId == $scope.iposRequest.carrierId) {
                                    $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                                    $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                                    break;
                                }
                            }

                            $scope.changeInsuranceCompany = function () {
                                // reloading same page for updating form validations and carrier specific fields  -- Akash K.
                                /*$location.path('/ipos').search({quoteId:localStorageService.get("BIKE_UNIQUE_QUOTE_ID"),carrierId:$scope.premiumDetails.selectedProductDetails.carrierId,productId:.$scope.premiumDetails.selectedProductDetails.productId,lob:localStorageService.get("selectedBusinessLineId")});*/
                                $location.path('/buyTwoWheeler').search({
                                    quoteId: localStorageService.get("BIKE_UNIQUE_QUOTE_ID"),
                                    carrierId: $scope.premiumDetails.selectedProductDetails.carrierId,
                                    productId: $scope.premiumDetails.selectedProductDetails.productId,
                                    lob: localStorageService.get("selectedBusinessLineId")
                                });
                                //$scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                            }


                            var todayDate = new Date();
                            var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
                                ("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
                            getPolicyStatusList(formatedTodaysDate);

                            $scope.policyStatusList = policyStatusListGeneric;

                            var dateArray = $scope.selectedProductInputParam.vehicleInfo.PreviousPolicyExpiryDate.split("/");
                            var previousPolicyExpiredDays = getDays(dateArray[2] + "," + dateArray[1] + "," + dateArray[0]);

                             $rootScope.vehicleDetails.registrationNumber = $scope.selectedProductInputParam.vehicleInfo.registrationNumber;
                           // $scope.vehicleData.maxVehicleAge = 15;
                            buyScreenParam.carrierId = Number($scope.iposRequest.carrierId);
                            for (var i = 0; i < $scope.quoteInfo.bikeQuoteResponse.length; i++) {
                                if (Number($scope.iposRequest.carrierId) == $scope.quoteInfo.bikeQuoteResponse[i].carrierId) {
                                    $scope.selectedProduct = $scope.quoteInfo.bikeQuoteResponse[i];
                                    buyScreenParam.productId = $scope.quoteInfo.bikeQuoteResponse[i].productId;
                                    buyScreenParam.businessLineId = $scope.p365Labels.businessLineType.bike;
                                } else {
                                    $rootScope.loading = true;
                                }
                            }
                            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.productDataReader, buyScreenParam, function (buyScreen) {

                                if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {
                                    buyScreens = buyScreen.data;
                                    $scope.ownerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                                    $scope.nominationDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
                                    $scope.prevPolicyDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                                    $scope.vehicleDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);

                                    $scope.productValidation = buyScreens.validation;
                                    $scope.requestFormat = buyScreens.requestFormat;
                                    $scope.transactionName = buyScreens.transaction.proposalService.name;
                                    $scope.transactionNameCopy = $scope.transactionName;
                                    $scope.transactionSaveProposal = "saveProposalService";
                                    $scope.transactionSubmitProposal = "submitProposal";

                                    //added for hdfc
                                    if ($scope.productValidation.PUCValidation) {
                                        $scope.PUCValidation = true;
                                    } else {
                                        $scope.PUCValidation = false;
                                    }
                                    if (localStorageService.get("commAddressDetails")) {
                                       // $scope.proposerDetails.address = localStorageService.get("commAddressDetails").displayArea;
                                       $scope.proposerDetails.communicationAddress.comDisplayArea = localStorageService.get("commAddressDetails").displayArea;
                                        
                                     //  $scope.proposerDetails.pincode = localStorageService.get("commAddressDetails").pincode;
                                     $scope.proposerDetails.communicationAddress.comPincode = localStorageService.get("commAddressDetails").pincode;
                                         
                                   //  $scope.proposerDetails.state = localStorageService.get("commAddressDetails").state;
                                   $scope.proposerDetails.communicationAddress.comState = localStorageService.get("commAddressDetails").state;
                                       
                                 //  $scope.proposerDetails.city = localStorageService.get("commAddressDetails").city;
                                 $scope.proposerDetails.communicationAddress.comCity = localStorageService.get("commAddressDetails").city;
                                      
                                } else {
                                       // $scope.proposerDetails.address = "";
                                       $scope.proposerDetails.communicationAddress.comDisplayArea = "";
                                    //    $scope.proposerDetails.pincode = "";
                                    $scope.proposerDetails.communicationAddress.comPincode = "";
                                        
                                   // $scope.proposerDetails.state = "";
                                   $scope.proposerDetails.communicationAddress.comState= "";
                                       
                                  // $scope.proposerDetails.city = "";
                                  $scope.proposerDetails.communicationAddress.comCity = "";
                                        
                                }

                                    $scope.initBikeBuyScreen();
                                    $scope.getCarrierList();
                                }
                            });
                        } else {

                            $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.iposFormErrorMsg, "Ok");
                        }
                    });
                    //	}); 

                    /*----- iPOS+ Code Ends -------*/
                } else {
                    $scope.p365Labels = bikePreoposalLabels;
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");

                    $rootScope.title = $scope.p365Labels.policies365Title.bikeBuyQuote;

                    var quoteUserInfo = localStorageService.get("quoteUserInfo");
                    var buyScreens = localStorageService.get("buyScreen");

                    $scope.selectedProduct = localStorageService.get("bikeSelectedProduct");
                    $scope.insuranceDetails.insuranceType = $scope.selectedProduct.policyType;
                    $scope.selectedProductInputParam = localStorageService.get("bikeQuoteInputParamaters");
                    $scope.addOnCovers = localStorageService.get("addOnCoverListForbike");
                    if($scope.selectedProductInputParam.quoteParam.ownedBy == "Individual"){                    	
                    	$scope.personalDetailsFlag=true;
                    }else if($scope.selectedProductInputParam.quoteParam.ownedBy == "Organization"){
                    	$scope.personalDetailsFlag=false;
                    }else{
                        $scope.personalDetailsFlag=true;
                    }
        
                    $scope.ownerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                    $scope.nominationDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
                    $scope.prevPolicyDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                    $scope.vehicleDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);

                    $scope.productValidation = buyScreens.validation;
                    $scope.requestFormat = buyScreens.requestFormat;
                    $scope.transactionName = buyScreens.transaction.proposalService.name;
                    $scope.paymentURL = buyScreens.paymentUrl;

                    //added for hdfc
                    if ($scope.productValidation.PUCValidation) {
                        $scope.PUCValidation = true;
                    } else {
                        $scope.PUCValidation = false;
                    }
                    if (localStorageService.get("commAddressDetails")) {
                      //  $scope.proposerDetails.address = localStorageService.get("commAddressDetails").displayArea;
                      $scope.proposerDetails.communicationAddress.comDisplayArea = localStorageService.get("commAddressDetails").displayArea;
                       
                       // $scope.proposerDetails.pincode = localStorageService.get("commAddressDetails").pincode;
                       $scope.proposerDetails.communicationAddress.comPincode = localStorageService.get("commAddressDetails").pincode;
                         
                     //  $scope.proposerDetails.state = localStorageService.get("commAddressDetails").state;
                     $scope.proposerDetails.communicationAddress.comState = localStorageService.get("commAddressDetails").state;
                         
                    // $scope.proposerDetails.city = localStorageService.get("commAddressDetails").city;
                    $scope.proposerDetails.communicationAddress.comCity = localStorageService.get("commAddressDetails").city;
                        
                } else {
                      //  $scope.proposerDetails.address = "";
                      $scope.proposerDetails.communicationAddress.comDisplayArea= "";
                     
                      //  $scope.proposerDetails.pincode = "";
                      $scope.proposerDetails.communicationAddress.comPincode = "";
                          
                     // $scope.proposerDetails.state = "";
                     $scope.proposerDetails.communicationAddress.comState= "";
                         
                   //  $scope.proposerDetails.city = "";
                   $scope.proposerDetails.communicationAddress.comCity = "";
                        
                }

                    $scope.initBikeBuyScreen();
                    $scope.getCarrierList();
                   // $scope.getRelationshipList();

                }
            }
        });
       // $scope.$watch('proposerDetails.address', function (newValue) 
       $scope.$watch('proposerDetails.communicationAddress.comDisplayArea', function (newValue)  
       {
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

        // Hide the footer navigation links.
        $(".activateFooter").hide();
        $(".activateHeader").hide();
    }])