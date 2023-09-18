/*
 * Description	: This is the controller file for car policy buy.
 * Author		: Yogesh
 * Date			: 28 June 2016
 *
 * */

'use strict';
angular.module('buyFourWheeler', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('buyFourWheelerController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function ($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce) {

        $scope.carProposalSectionHTML = wp_path + 'buy/car/html/CarProposalSection.html';
        $scope.saveProposal = false;
        $scope.saveNomineeDetails = false;
        $scope.savePrevPolicyDetails = false;
        $scope.savePersonalDetails = false;
        $scope.redirectForPayment = false;
        $scope.proposalId = null;
        $scope.proposerInfo = {};
        $scope.proposerDetails = {};
        $scope.proposerDetails.communicationAddress = {};
        $scope.organizationDetails = {};
        $scope.nominationInfo = {};
        $scope.nominationDetails = {};
        $scope.appointeeInfo = {};
        $scope.appointeeDetails = {};
        $scope.insuranceInfo = {};
        $scope.insuranceDetails = {};
        $scope.vehicleInfo = {};
        $scope.vehicleDetails = {};
        $scope.vehicleDetails.registrationAddress = {};
        $scope.carProposeFormCookieDetails = {};
        $scope.authenticate = {};
        $scope.premiumDetails = {};
        $scope.inspectionDetails = {};
        $scope.iposRequest = {};
        $scope.prevPolDetails = {};
        $scope.iposRequest.docId = $location.search().quoteId;
        $scope.iposRequest.carrierId = $location.search().carrierId;
        $scope.iposRequest.productId = $location.search().productId;

        $scope.screenOneStatus = true;
        $scope.screenTwoStatus = false;
        $scope.screenThreeStatus = false;
        $scope.screenFourStatus = false;
        $scope.screenFiveStatus = false;
        //$scope.loading = false;
        $scope.proposalStatusForm = false;
        $scope.alreadyExpiredPolicyError = false;
        $scope.breakInInspectionStatus = false;
        $scope.submitProposalClicked = false;
        $scope.shortenURL = "";
        $scope.longURL = "";

        if(!$rootScope.customEnvEnabled){
            $rootScope.customEnvEnabled = customEnvEnabled;
        }
        if(!$rootScope.baseEnvEnabled){
            $rootScope.baseEnvEnabled = baseEnvEnabled;
        }

        $scope.maritalStatusType = maritalStatusListGeneric;
        $scope.drivingExpYearsList = drivingExperienceYears;
        $scope.vehicleDrivenOnList = vehicleDrivenPlaces;
        $scope.ncbList = buyScreenNcbList;
        $scope.mileageList = buyScreenMileageList;
        $scope.vehicleLoanTypes = vehicleLoanTypes;
        $scope.genderType = genderTypeGeneric;
        $scope.purchasedLoanStatus = purchasedLoanStatusGeneric;
        $scope.automobileMembershipList = automobileMembershipTypes;
        $scope.policyTypes = policyTypesGeneric;
        $scope.pucStatus = true;

        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
            $rootScope.mainTabsMenu[0].active = false;
            $rootScope.mainTabsMenu[1].active = true;
        }

        //added to apply different position to back button in ipos/iquote for website/posp
        if (pospEnabled) {
            $scope.pospEnabled = pospEnabled;
        }

        $scope.selectedVehicleDetails = localStorageService.get("selectedCarDetails");
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
        $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");

        /*
         * Yogesh-11072017 : As discussed with Uday and Dany, default marital status set to MARRIED.
         */
        $scope.proposerDetails.maritalStatus = $scope.maritalStatusType[0].name;

        //for third party API like droom
        if ($rootScope.affilateUser) {
            $scope.isThirdPartyResource = true;
        } else {
            $scope.isThirdPartyResource = false;
        }

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
 
        // Method to get list of pincodes
        $scope.getPinCodeAreaList = function (searchValue) {
            var docType = $scope.p365Labels.documentType.cityDetails;
            var carrierId = $scope.selectedProduct.carrierId;

            return $http.get(getSearchServiceLink + docType + "&q=" + searchValue + "&id=" + carrierId).then(function (response) {
                return JSON.parse(response.data).data;
            });
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

        
        $scope.carQuoteRequestFormation = function () {
            $scope.quote = {};
           $scope.quote.vehicleInfo={};
           $scope.quote.quoteParam={};
           console.log('$scope.selectedProductInputParam in bikeQuoteRequestFormation is:', $scope.selectedProductInputParam);
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
          $scope.quote.vehicleInfo.fuel =$scope.selectedProductInputParam.vehicleInfo.fuel;
          $scope.quote.vehicleInfo.cubicCapacity =$scope.selectedProductInputParam.vehicleInfo.cubicCapacity;
          
          
          $scope.quote.quoteParam.ncb = $scope.selectedProductInputParam.quoteParam.ncb;
          $scope.quote.quoteParam.ownedBy =$scope.selectedProductInputParam.quoteParam.ownedBy;
          console.log('$scope.selectedProductInputParam.quoteParam.ownedBy in step 4 is: ',$scope.selectedProductInputParam.quoteParam.ownedBy);
          $scope.quote.quoteParam.policyType = $scope.selectedProductInputParam.quoteParam.policyType;
          $scope.quote.quoteParam.riders =$scope.selectedProductInputParam.quoteParam.riders;
       }
      
        $scope.onSelectPinOrArea = function (item) {
            console.log('item in $scope.onSelectPinOrArea is: ',item);
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

        //function created for quote recalculation on registration number for TATA AIG
        $scope.calcQuoteOnRegistrationNumber = function (regNumber) {
            $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam);
            if ($scope.selectedProductInputParamCopy.vehicleInfo.registrationNumber) {
                $scope.registrationNumberCopy = $scope.selectedProductInputParam.vehicleInfo.registrationNumber.toUpperCase();
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
                        $scope.carQuoteRequestFormation();
                        RestAPI.invoke($scope.p365Labels.getRequest.getQuote, $scope.quote).then(function (proposeFormResponse) {
                            $scope.carRecalculateQuoteRequest = [];
                            if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                $scope.responseRecalculateCodeList = [];
                                $scope.quoteCalcResponse = [];

                                if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                                    $scope.quoteCalcResponse.length = 0;
                                }
     
                                localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
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

                                    $http({
                                        method: 'POST',
                                        url: getQuoteCalcLink,
                                        data: request
                                    }).
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
                                                    localStorageService.set("carSelectedProduct", $scope.selectedProduct);
                                                    /*if($scope.selectedProductInputParam.vehicleInfo.registerNumber){
                                                    	delete $scope.selectedProductInputParam.vehicleInfo.registerNumber
                                                    }*/
                                                }
                                            }
                                                carQuoteResponse.data.quotes[0].id = i;
                                                if(Number(carQuoteResponse.data.quotes[0].grossPremium) > 0)
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
                        $scope.carQuoteRequestFormation();
                        RestAPI.invoke($scope.p365Labels.getRequest.getQuote, $scope.quote).then(function (proposeFormResponse) {
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

                                    $http({
                                        method: 'POST',
                                        url: getQuoteCalcLink,
                                        data: request
                                    }).
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
                                                    localStorageService.set("carSelectedProduct", $scope.selectedProduct);
                                                    /*if($scope.selectedProductInputParam.vehicleInfo.registerNumber){
                                                    	delete $scope.selectedProductInputParam.vehicleInfo.registerNumber
                                                    }*/
                                                }
                                            }
                                                carQuoteResponse.data.quotes[0].id = i;
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
                $scope.vehicleDetails.registrationAddress.regPincode =$scope.proposerDetails.communicationAddress.comPincode;
                $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.proposerDetails.communicationAddress.comDoorNo;
                $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
                $scope.vehicleDetails.registrationAddress.regCity = $scope.proposerDetails.communicationAddress.comCity;
                $scope.vehicleDetails.registrationAddress.regState =$scope.proposerDetails.communicationAddress.comState; 
            }
        }

        $scope.onSelectVehiclePinOrArea = function (item) {
            $scope.selectedProductInputParamCopy = angular.copy($scope.selectedProductInputParam.vehicleInfo);
            $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
            var selState = $scope.selectedProductInputParam.vehicleInfo.state;
            console.log('selState onSelectVehiclePinOrArea is: ',selState);
            if(selState){
                $scope.vehicleDetails.registrationAddress.regState = selState.toUpperCase();
            }
           // if ($scope.vehicleDetails.state != item.state) {
            if ( $scope.vehicleDetails.registrationAddress.regState != item.state) {
                $scope.selectedProductInputParam.vehicleInfo.state = item.state;
                $scope.selectedProductInputParam.vehicleInfo.city = item.city;
                $scope.selectedProductInputParam.quoteParam.customerCity = item.city;
                $scope.selectedProductInputParam.quoteParam.customerState = item.state;
                $scope.selectedProductInputParam.quoteParam.customerpinCode = item.pincode;
                $scope.proposerDetailsCopied = angular.copy(item);

                $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.locationChangeMsg, "No", "Yes", function (confirmStatus) {
                    if (confirmStatus) {
                        $scope.loading = true;
                        $scope.carQuoteRequestFormation();
                        // $scope.quote = $scope.selectedProductInputParam;
                        // if (localStorageService.get("quoteUserInfo")) {
                        //     $scope.quote.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                        // }
                        // if (localStorageService.get("PROF_QUOTE_ID")) {
                        //     $scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                        // }
                        RestAPI.invoke($scope.p365Labels.getRequest.getQuote, $scope.quote).then(function (proposeFormResponse) {
                            $scope.carRecalculateQuoteRequest = [];
                            if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                $scope.responseRecalculateCodeList = [];
                                $scope.quoteCalcResponse = [];

                                if (String($scope.quoteCalcResponse) != "undefined" && $scope.quoteCalcResponse.length > 0) {
                                    $scope.quoteCalcResponse.length = 0;
                                }

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

                                    $http({
                                        method: 'POST',
                                        url: getQuoteCalcLink,
                                        data: request
                                    }).
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
                                                    localStorageService.set("carSelectedProduct", $scope.selectedProduct);
                                                }
                                            }
                                                carQuoteResponse.data.quotes[0].id = i;
                                                $scope.quoteCalcResponse.push(carQuoteResponse.data.quotes[0]);

                                            } else {
                                                $scope.loading = false;
                                                if (carQuoteResponse.data != null) {
                                                    if(carQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                        carQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId){
                                                    $scope.vehicleDetails.pincode = '';
                                                    $scope.vehicleDetails.city = '';
                                                    $scope.vehicleDetails.state = '';
                                                    $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                                    $scope.selectedProductInputParam.vehicleInfo.state = '';
                                                    localStorageService.set("carQuoteInputParamaters", $scope.selectedProductInputParam);
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
                                /*
                                for (var j = 0; j < $scope.quoteCalcResponse.length; j++) {
                                    $scope.quoteCalcResponse[j].id = (j + 1);
                                }
								*/
                            } else {
                                $scope.loading = false;
                                $scope.vehicleDetails.pincode = '';
                                $scope.vehicleDetails.city = '';
                                $scope.vehicleDetails.state = '';
                                $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
                                $scope.selectedProductInputParam.vehicleInfo.state = '';
                                localStorageService.set("carQuoteInputParamaters", $scope.selectedProductInputParam);
                                var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
                            }
                        });

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
            $scope.loadPlaceholder();
            localStorageService.set("carRegAddress", item);
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

        $scope.changeMaritalStatus = function () { };

        $scope.changePrevInsurer = function () {
            $scope.insuranceDetails.insurerName = $scope.insuranceInfo.insurerName.carrierName;
            $scope.insuranceDetails.insurerId = $scope.insuranceInfo.insurerName.carrierId;
        };

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
                $scope.vehicleDetails.registrationAddress.regDoorNo = $scope.proposerDetails.communicationAddress.comDoorNo;
               $scope.vehicleDetails.registrationAddress.regDisplayArea = $scope.proposerDetails.communicationAddress.comDisplayArea;
               $scope.vehicleDetails.registrationAddress.regPincode = $scope.proposerDetails.communicationAddress.comPincode;
               $scope.vehicleDetails.registrationAddress.regCity= $scope.proposerDetails.communicationAddress.comCity;
              $scope.vehicleDetails.registrationAddress.regState =$scope.proposerDetails.communicationAddress.comState;
            } else {
                if (localStorageService.get("carRegAddress")) {
                $scope.vehicleDetails.registrationAddress.regPincode = localStorageService.get("carRegAddress").pincode;
                $scope.vehicleDetails.registrationAddress.regDisplayArea = localStorageService.get("carRegAddress").displayArea;
                $scope.vehicleDetails.registrationAddress.regCity = localStorageService.get("carRegAddress").city;
                $scope.vehicleDetails.registrationAddress.regState = localStorageService.get("carRegAddress").state;
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
              //$scope.prevPolStatusError = true;
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

        $scope.initCarBuyScreen = function () {
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

        //logic for setting inspection date for expired policy
        $scope.initiateInspectionDatePicker = function () {
            var inspectionDateOption = {};

            inspectionDateOption.minimumDateStringFormat = "0"
            inspectionDateOption.maximumDateStringFormat = "2W";

            inspectionDateOption.changeMonth = true;
            inspectionDateOption.changeYear = true;
            inspectionDateOption.dateFormat = "dd/mm/yy";
            $scope['inspectionDateOption'] = setP365DatePickerProperties(inspectionDateOption);

            //logic for inspection time slot
            $scope.inspectionTime = [{
                id: 1,
                name: '09:00AM-11.00AM'
            },
            {
                id: 2,
                name: '11.00AM-02.00PM'
            },
            {
                id: 3,
                name: '02.00PM-04.00PM'
            },
            {
                id: 4,
                name: '04.00PM-06.00PM'
            }
            ]

            $scope.inspectionDetails.time = $scope.inspectionTime[0];
        }

        $scope.validatePolicyStartDate = function () {
            if (String($scope.policyStartDate) !== "undefined") {
                convertStringFormatToDate($scope.policyStartDate, function (formattedPolStartDate) {
                    if ($scope.selectedProduct.ownDamagePolicyTerm) {
                        $scope.ODPolicyStartDate = $scope.policyStartDate;
                        console.log('$scope.ODPolicyStartDate is in step 1 ::',$scope.ODPolicyStartDate);
                        console.log('$scope.policyStartDate is in step 1 ::',$scope.policyStartDate);
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
            console.log('$scope.vehicleInfo is : ',$scope.vehicleInfo);
            if ($scope.vehicleInfo.insuranceType.value == "renew") {
                console.log('inside if...');
                $scope.previousPolicyStatus = true;
               // $scope.insuranceDetails.isPrevPolicy = "Yes";
               if($scope.vehicleInfo.PreviousPolicyStartDate){
               $scope.prevPolDetails.prevPolicyStartDate = $scope.vehicleInfo.PreviousPolicyStartDate;
               }else if($scope.selectedPreviousPolicyStartDate){
                $scope.prevPolDetails.prevPolicyStartDate = $scope.selectedPreviousPolicyStartDate;   
               }
               $scope.prevPolDetails.prevPolicyEndDate = $scope.selectedProductInputParam.vehicleInfo.PreviousPolicyExpiryDate;

                //Expiry Date fix dd/m/yyyy to dd/mm/yyyy;
                var setValidExpiryDate = $scope.prevPolDetails.prevPolicyEndDate;
               // $scope.insuranceDetails.prevPolicyEndDate = setValidExpiryDate.replace(/\b\d\b/g, '0$&');
               // $scope.insuranceDetails.previousPolicyExpired = $scope.selectedProductInputParam.vehicleInfo.previousPolicyExpired;

                convertStringFormatToDate($scope.prevPolDetails.prevPolicyEndDate, function (formattedPrevPolEndDate) {
                    var todayDate = new Date();
                    if ($scope.vehicleInfo.policyStatus.key == 1 || $scope.vehicleInfo.policyStatus.key == 2) {
                        var policyStartDate = new Date(todayDate.setDate(todayDate.getDate() + 3));
                    } else {
                        policyStartDate = new Date(formattedPrevPolEndDate.setDate(formattedPrevPolEndDate.getDate() + 1));
                    }

                    if ($scope.selectedVehicleDetails.previousPolicyExpired == 'Y') {
                        $scope.alreadyExpiredPolicyError = true;
                        var todayDate = new Date();
                        // policyStartDate = new Date(todayDate.setDate(todayDate.getDate() + 7));
                        policyStartDate = new Date(todayDate.setDate(todayDate.getDate()));
                        $scope.initiateInspectionDatePicker();
                    }

                    convertDateFormatToString(policyStartDate, function (formattedPolicyStartDate) {
                        //$scope.insuranceDetails.policyStartDate = formattedPolicyStartDate;
                        $scope.policyStartDate = formattedPolicyStartDate;
                        console.log('$scope.policyStartDate is in step 2 ::',$scope.policyStartDate);
                    });
                });
            } else {
                //$scope.insuranceDetails.isPrevPolicy = "No";
                $scope.previousPolicyStatus = false;

                /*
                 * Yogesh-07062017 : As discussed with Uday and Vipin, Policy Start Date for new policy should be equal to registration date. 
                (Today Date = Registration Date = Policy Start Date). So current default date (which is tomorrow date), changes to registration date.
                 */
                var policyStartDate = new Date();
                convertDateFormatToString(policyStartDate, function (formattedPolicyStartDate) {
                    $scope.policyStartDate = formattedPolicyStartDate;
                    console.log('$scope.policyStartDate is in step 3 ::',$scope.policyStartDate);
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
            $scope.screenFiveStatus = false;
            $scope.Section2Inactive = false;
            $scope.accordion = '2';
           // $scope.splitAddressField();

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
            $scope.carProposeFormCookieDetails.proposerDetails = $scope.proposerDetails;
            $scope.carProposeFormCookieDetails.proposerInfo = $scope.proposerInfo;
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.saveProposal = true;
                $scope.savePersonalDetails = true;
                $scope.saveNomineeDetails = false;
                $scope.savePrevPolicyDetails = false;

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
            if (!$scope.personalDetailsFlag && ($scope.nominationDetails.nomFirstName && $scope.nominationDetails.nomLastName)) {
                $scope.carProposeFormCookieDetails.nominationDetails = $scope.nominationDetails;
            } else if ($scope.personalDetailsFlag) {
                $scope.carProposeFormCookieDetails.nominationDetails = $scope.nominationDetails;
            } else {
                $scope.carProposeFormCookieDetails.nominationDetails = {};
            }
            $scope.carProposeFormCookieDetails.appointeeDetails = $scope.appointeeDetails;
            $scope.carProposeFormCookieDetails.nominationInfo = $scope.nominationInfo;
            $scope.carProposeFormCookieDetails.appointeeInfo = $scope.appointeeInfo;
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.saveProposal = true;
                $scope.saveNomineeDetails = true;
                $scope.savePersonalDetails = true;
                $scope.savePrevPolicyDetails = false;
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
                $scope.saveProposal = true;
                $scope.savePrevPolicyDetails = true;
                $scope.savePersonalDetails = true;
                $scope.saveNomineeDetails = true;
                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };

        // $scope.splitAddressField = function () {
        //     var doorNo = "";
        //     if (String($scope.proposerDetails.doorNo) != "undefined" && String($scope.proposerDetails.doorNo).length > 0) {
        //         doorNo = $scope.proposerDetails.doorNo + ", ";
        //     }

        //     $scope.proposerDetails.addressLine1 = doorNo;
        //     $scope.proposerDetails.addressLine2 = "";
        //     if ($scope.proposerDetails.address) {
        //         var tempAddressArray = $scope.proposerDetails.address.split(/[\s,]+/);
        //         var addressArrayLength = tempAddressArray.length;

        //         if (addressArrayLength > 1) {
        //             var addressArrayLimit = Math.round(addressArrayLength / 2);
        //             var i;
        //             for (i = 0; i < addressArrayLimit; i++) {
        //                 if (i == (addressArrayLimit - 1))
        //                     $scope.proposerDetails.addressLine1 += tempAddressArray[i].trim();
        //                 else
        //                     $scope.proposerDetails.addressLine1 += tempAddressArray[i].trim() + " ";
        //             }

        //             for (i = addressArrayLimit; i < addressArrayLength; i++) {
        //                 if (i == (addressArrayLength - 1))
        //                     $scope.proposerDetails.addressLine2 += tempAddressArray[i].trim();
        //                 else
        //                     $scope.proposerDetails.addressLine2 += tempAddressArray[i].trim() + " ";
        //             }
        //         } else {
        //             $scope.proposerDetails.addressLine1 += $scope.proposerDetails.address;
        //             $scope.proposerDetails.addressLine2 = "";
        //         }
        //     }
        // };

        // $scope.splitVehicleAddressField = function () {
        //     var doorNo = "";
        //     if (JSON.stringify($scope.vehicleDetails.doorNo) != "undefined" && String($scope.vehicleDetails.doorNo).length > 0) {
        //         doorNo = $scope.vehicleDetails.doorNo + ", ";
        //     }

        //     $scope.vehicleDetails.addressLine1 = doorNo;
        //     $scope.vehicleDetails.addressLine2 = "";
        //     if ($scope.vehicleDetails.address) {
        //         var tempAddressArray = $scope.vehicleDetails.address.split(/[\s,]+/);
        //         var addressArrayLength = tempAddressArray.length;

        //         if (addressArrayLength > 1) {
        //             var addressArrayLimit = Math.round(addressArrayLength / 2);
        //             var i;
        //             for (i = 0; i < addressArrayLimit; i++) {
        //                 if (i == (addressArrayLimit - 1))
        //                     $scope.vehicleDetails.addressLine1 += tempAddressArray[i].trim();
        //                 else
        //                     $scope.vehicleDetails.addressLine1 += tempAddressArray[i].trim() + " ";
        //             }

        //             for (i = addressArrayLimit; i < addressArrayLength; i++) {
        //                 if (i == (addressArrayLength - 1))
        //                     $scope.vehicleDetails.addressLine2 += tempAddressArray[i].trim();
        //                 else
        //                     $scope.vehicleDetails.addressLine2 += tempAddressArray[i].trim() + " ";
        //             }
        //         } else {
        //             $scope.vehicleDetails.addressLine1 += $scope.vehicleDetails.address;
        //             $scope.vehicleDetails.addressLine2 = "";
        //         }
        //     }
        // };

        $scope.backToResultScreen = function () {
            console.log('redirecting to result screen from proposal');
            if ($rootScope.vehicleDetails.registrationNumber) {
                $scope.selectedVehicleDetails = localStorageService.get("selectedCarDetails");
                $scope.selectedVehicleDetails.registrationNumber = $scope.vehicleDetails.registrationNumber;
                localStorageService.set("selectedCarDetails", $scope.selectedVehicleDetails);
            }
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $rootScope.mainTabsMenu[0].active = true;
                $rootScope.mainTabsMenu[1].active = false;
            }
            $location.path("/carResult");
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
            vehicleDetailRequest.registrationAddress.regCity = $scope.vehicleDetails.registrationAddress.regCity;
            vehicleDetailRequest.registrationAddress.regDisplayArea =$scope.vehicleDetails.registrationAddress.regDisplayArea;
            vehicleDetailRequest.registrationAddress.regPincode = $scope.vehicleDetails.registrationAddress.regPincode;
            vehicleDetailRequest.registrationAddress.regState = $scope.vehicleDetails.registrationAddress.regState;
            vehicleDetailRequest.registrationAddress.regArea = $scope.vehicleDetails.registrationAddress.regArea;
            vehicleDetailRequest.registrationAddress.regDistrict = $scope.vehicleDetails.registrationAddress.regDistrict;
            vehicleDetailRequest.registrationAddress.regDisplayField = $scope.vehicleDetails.registrationAddress.regDisplayField;
            $scope.carProposeFormDetails.vehicleDetails = vehicleDetailRequest;
        }

        $scope.proposalInfo = function () {
            var vehicleDetailsCookie = {};
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.carProposeFormDetails = {};
                $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
                if ($scope.savePersonalDetails) {
                    //$scope.carProposeFormDetails.premiumDetails = $scope.selectedProduct;
                    $scope.carProposeFormDetails.proposerDetails = $scope.proposerDetails;
                    $scope.carProposeFormDetails.organizationDetails = {};
                    if (!$scope.personalDetailsFlag) {
                      $scope.carProposeFormDetails.organizationDetails.contactPersonName = $scope.organizationDetails.contactPersonName;
                      $scope.carProposeFormDetails.organizationDetails.organizationName = $scope.organizationDetails.organizationName;
                    } 

                    if ($scope.vehicleInfo.insuranceType.value) {
                        $scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                    }
                    if ($scope.vehicleDetails.purchasedLoan == 'Yes') {
                        $scope.vehicleDetails.vehicleLoanType = $scope.vehicleInfo.vehicleLoanType.name;
                    }
                    if (String($scope.vehicleInfo.registrationNumber) != "undefined" && $scope.vehicleInfo.registrationNumber != null) {
                       // $scope.vehicleDetails.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();
                        //$scope.vehicleDetails.registrationNumberFormatted = $scope.vehicleDetails.registrationNumber.replace(/([a-zA-Z]{2})([0-9]{1,2})([a-zA-Z]{1,3})([0-9]{1,4})/, "$1-$2-$3-$4");

                        //added for registration number issue
                        vehicleDetailsCookie.registrationNumber = $scope.vehicleDetails.registrationNumber;
                        vehicleDetailsCookie.RTOCode = $scope.vehicleDetails.RTOCode.toUpperCase();
                        localStorageService.set("carRegistrationDetails", vehicleDetailsCookie);
                     }

                    $scope.carProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                   // $scope.carProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                   $scope.createCarVehicleDetailsRequest();
                }
                if ($scope.saveNomineeDetails) {
                    $scope.carProposeFormDetails.nominationDetails = $scope.nominationDetails;
                    if($scope.appointeeDetails){
                    $scope.carProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                    }
                    if (localStorageService.get("proposalId")) {
                        $scope.proposalId = localStorageService.get("proposalId");
                        $scope.carProposeFormDetails.proposalId = $scope.proposalId;
                    }
                }
                if ($scope.savePrevPolicyDetails) {
                    $scope.carProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
                    if (localStorageService.get("proposalId")) {
                        $scope.proposalId = localStorageService.get("proposalId");
                        $scope.carProposeFormDetails.proposalId = $scope.proposalId;
                    }
                }


                if (!$scope.saveProposal) {

                    if ($scope.vehicleInfo.insuranceType.value) {
                        $scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                    }
                        $scope.createCarVehicleDetailsRequest();
                    if (localStorageService.get("proposalId")) {
                        $scope.proposalId = localStorageService.get("proposalId");
                        $scope.carProposeFormDetails.proposalId = $scope.proposalId;
                    }
                }
                // if ($scope.selectedProduct.policyType == 'new') {
                //    $scope.carProposeFormDetails.policyStartDate = $scope.ODPolicyStartDate;
                //    // commenting with dout agency portal issue of libality date is getting  changed  as per OD end   date                  

                //     $scope.carProposeFormDetails.policyEndDate = $scope.ODPolicyEndDate;
                //      $scope.carProposeFormDetails.policyEndDate = $scope.policyEndDate;

                // }

                if ($scope.referralCode) {
                    $scope.carProposeFormDetails.referralCode = $scope.referralCode;
                }

                $scope.carProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
                $scope.carProposeFormDetails.productId = $scope.selectedProduct.productId;
            }
            if ($rootScope.baseEnvEnabled && $rootScope.wordPressEnabled) {
                $scope.carProposeFormDetails = {};

                $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
                if ($scope.vehicleInfo.insuranceType) {
                    $scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                }

                if ($scope.vehicleDetails.purchasedLoan == 'Yes') {
                    $scope.vehicleDetails.vehicleLoanType = $scope.vehicleInfo.vehicleLoanType.name;
                }

                if (String($scope.vehicleInfo.registrationNumber) != "undefined" && $scope.vehicleInfo.registrationNumber != null) {
                   // $scope.vehicleDetails.registrationNumber = $scope.vehicleDetails.RTOCode.toUpperCase() + $scope.vehicleInfo.registrationNumber.toUpperCase();
                   // $scope.vehicleDetails.registrationNumberFormatted = $scope.vehicleDetails.registrationNumber.replace(/([a-zA-Z]{2})([0-9]{1,2})([a-zA-Z]{1,3})([0-9]{1,4})/, "$1-$2-$3-$4");

                    //added for registration number issue
                    vehicleDetailsCookie.registrationNumber = $scope.vehicleDetails.registrationNumber;
                    vehicleDetailsCookie.RTOCode = $scope.vehicleDetails.RTOCode.toUpperCase();
                    localStorageService.set("carRegistrationDetails", vehicleDetailsCookie);
                }

                var selectedInsuranceType = localStorageService.get("selectedInsuranceType");
                if ($scope.selectedProduct.policyType == 'new' && selectedInsuranceType == "comprehensive") {
                    $scope.policyStartDate = $scope.ODPolicyStartDate;
                  
                    $scope.policyEndDate = $scope.ODPolicyEndDate;

                }
                $scope.carProposeFormDetails.proposerDetails = $scope.proposerDetails;
                if (!$scope.personalDetailsFlag && ($scope.nominationDetails.nomFirstName && $scope.nominationDetails.nomLastName)) {
                    $scope.carProposeFormDetails.nominationDetails = $scope.nominationDetails;
                } else if ($scope.personalDetailsFlag) {
                    $scope.carProposeFormDetails.nominationDetails = $scope.nominationDetails;
                } else {
                    $scope.carProposeFormDetails.nominationDetails = {};
                }
                $scope.carProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
                $scope.carProposeFormDetails.insuranceDetails = $scope.insuranceDetails;
              // $scope.carProposeFormDetails.personalDetailsFlag = $scope.personalDetailsFlag;
                $scope.carProposeFormDetails.organizationDetails = {};
               if (!$scope.personalDetailsFlag) {
                    $scope.carProposeFormDetails.organizationDetails.contactPersonName = $scope.organizationDetails.contactPersonName;
                    $scope.carProposeFormDetails.organizationDetails.organizationName = $scope.organizationDetails.organizationName;
                }
                //$scope.carProposeFormDetails.vehicleDetails = $scope.vehicleDetails;
                $scope.createCarVehicleDetailsRequest();
               // $scope.carProposeFormDetails.basicCoverage = $scope.selectedProduct.basicCoverage;
                
                //for future generali-added based on Kuldeep Patil 
                /*if($scope.selectedProduct.policyNo){
                	$scope.carProposeFormDetails.premiumDetails.policyNo = $scope.selectedProduct.policyNo;
                }*/

                if ($scope.referralCode) {
                    $scope.carProposeFormDetails.referralCode = $scope.referralCode;
                }
                //added user-idv in proposal request as suggested by srikant
                //$scope.carProposeFormDetails.premiumDetails.userIdv = localStorageService.get("carQuoteInputParamaters").vehicleInfo.IDV;
                $scope.carProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
                $scope.carProposeFormDetails.productId = $scope.selectedProduct.productId;
            }
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
        }

        $scope.proceedForPayment = function () {
            $scope.proceedPaymentStatus = false;
            $scope.submitProposalClicked = false;

            $scope.proposalInfo();

            $scope.carProposeFormDetails.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
            $scope.carProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.car;
            $scope.carProposeFormDetails.personalDetailsFlag = $scope.personalDetailsFlag;
            $scope.carProposeFormDetails.requestSource = sourceOrigin;
            $scope.carProposeFormDetails.source = sourceOrigin;
           
                if ($rootScope.agencyPortalEnabled) {
                    delete $scope.carProposeFormDetails.proposalId;
                    $scope.carProposeFormDetails.source = sourceOrigin;
                    const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                    if (localdata) {
                        $scope.carProposeFormDetails.userName = localdata.username;
                        $scope.carProposeFormDetails.agencyId = localdata.agencyId;
                    }
                    if(localStorage.getItem("desiSkillUniqueId")){
                        if(localStorage.getItem("desiSkillUserId")){
                            $scope.carProposeFormDetails.userName = localStorage.getItem("desiSkillUserId");
                            }
                           $scope.carProposeFormDetails.agencyId =  localStorage.getItem("desiSkillAgencyId");   
                    }
                }  
            // Google Analytics Tracker added.
            //analyticsTrackerSendData($scope.carProposeFormDetails); 
            if ($scope.carProposeFormDetails.QUOTE_ID) {
                $scope.loading = true;
                RestAPI.invoke("carProposal", $scope.carProposeFormDetails).then(function (proposeFormResponse) {
                    $scope.modalOTP = false;
                    $scope.authenticate.enteredOTP = "";
                    $scope.modalOTPError = false;
                    if (!$rootScope.wordPressEnabled) {
                        $scope.proceedPaymentStatus = true;
                    }
                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                        $scope.proposalId = proposeFormResponse.data.proposalId;
                        $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                        localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                        //added by gauri for mautic application
                        if (imauticAutomation == true) {
                            imatCarProposal(localStorageService, $scope, 'MakePayment', function (shortURLResponse) {
                            });
                        }

                        var proposalId = $scope.proposalId;
                        var proposal_url = "" + sharePaymentLink + "" + proposalId + "&lob=3";

                        $scope.responseToken = proposeFormResponse.data;
                        $scope.responseToken.paymentGateway = $scope.paymentURL;
                        $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.car;
                        localStorageService.set("carReponseToken", $scope.responseToken);
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
            $scope.proposerDetails = localStorageService.get("CarProposalResForRenewal").proposerDetails;
            $scope.vehicleDetails = localStorageService.get("CarProposalResForRenewal").vehicleDetails;
            $scope.vehicleInfo.registrationNumber = $scope.vehicleDetails.regNumberPrefix + '' + $scope.vehicleDetails.regNumber;
            $scope.nominationDetails = localStorageService.get("CarProposalResForRenewal").nominationDetails;
            for (var i = 0; i < $scope.genericRelationshipList.length; i++) {
                if ($scope.genericRelationshipList[i].relationship == $scope.nominationDetails.nominationRelation) {
                    $scope.nominationInfo.nominationRelation = $scope.genericRelationshipList[i];
                    break;
                }
            }
            $scope.appointeeDetails = localStorageService.get("CarProposalResForRenewal").appointeeDetails;
            for (var i = 0; i < $scope.genericRelationshipList.length; i++) {
                if ($scope.genericRelationshipList[i].relationship == $scope.appointeeDetails.appointeeRelation) {
                    $scope.appointeeInfo.nominationRelation = $scope.genericRelationshipList[i];
                    break;
                }
            }
            $scope.insuranceDetails = localStorageService.get("CarProposalResForRenewal").insuranceDetails;
            for (var i = 0; i < $scope.carrierList.length; i++) {
                if ($scope.carrierList[i].carrierId == $scope.insuranceDetails.insurerId) {
                    $scope.insuranceInfo.insurerName = $scope.carrierList[i];
                    break;
                }
            }
        }

        $scope.prepopulateFields = function () {
            /* commented for testing purpose
            $scope.proposerDetails.doorNo = '';
            $scope.proposerDetails.address = '';*/
            $scope.authenticate.enteredOTP = "";
            //formatting registration number
            $scope.vehicleDetails.registrationNumber = angular.copy($rootScope.vehicleDetails.registrationNumber);
            $scope.vehicleInfo.registrationNumber = '';
            //function called to fill proposal form using proposal number in case of RenewalEmail
            if ($location.search().isForRenewal) {
                $scope.fillDataForRenewal();
            }
            $scope.selectedVehicleDetails = localStorageService.get("selectedCarDetails");
            if ($rootScope.vehicleDetails.registrationNumber && $rootScope.showCarRegAreaStatus == false) {
                var formatRegisCode = $rootScope.vehicleDetails.registrationNumber;
                $scope.vehicleInfo.registrationNumber = formatRegisCode.substring(4);
            }
            //disabling Registration Number for Car Registration API commented for temp purpose
            if ($scope.vehicleInfo.registrationNumber) {
                if ($scope.selectedVehicleDetails.isregNumberDisabled) {
                    $rootScope.isregNumber = true;
                } else {
                    $rootScope.isregNumber = false;
                }
            }

            if ($scope.selectedProductInputParam.vehicleInfo.regYear) {
                $scope.vehicleDetails.regYear = $scope.selectedProductInputParam.vehicleInfo.regYear;
            }
            //prepopulating chassisNumber and engine Number from Car Registration API
            if ($scope.selectedVehicleDetails.chassisNumber) {
                $scope.vehicleDetails.chassisNumber = $scope.selectedVehicleDetails.chassisNumber;
            }
            if ($scope.selectedVehicleDetails.engineNumber) {
                $scope.vehicleDetails.engineNumber = $scope.selectedVehicleDetails.engineNumber;
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
            if($scope.selectedProductInputParam.quoteParam.policyType == 'renew'){
                if($scope.selectedProductInputParam.quoteParam.onlyODApplicable){
                    $scope.insuranceDetails.prevPolicyType = policyTypesGeneric[1].display;
                }
            }
            $scope.vehicleDetails.RTOCode = $scope.selectedProductInputParam.vehicleInfo.RTOCode;
            $scope.riderStatus = false;
            if ($scope.selectedProduct.ridersList != null && String($scope.selectedProduct.ridersList) != "undefined") {
                for (var i = 0; i < $scope.selectedProduct.ridersList.length; i++) {
                    if ($scope.selectedProduct.ridersList[i].riderValue != null) {
                        $scope.riderStatus = true;
                        delete $scope.selectedProduct.ridersList[i].$$hashKey;
                    }
                }
            }
            // $scope.checkLength = function (ridersList) {
            //     $scope.selectedProduct.ridersList = $filter('orderBy')($scope.selectedProduct.rPidersList, 'riderValue');

            //     var validateLength = false;
            //     for (var i = 0; i < ridersList.length; i++) {
            //         if (ridersList[i].riderValue == 0 || !ridersList[i].riderValue) {
            //             validateLength = true;
            //         } else {
            //             validateLength = false;
            //         }
            //     }
            //     return validateLength;
            // }

            if ($scope.vehicleInfo.policyStatus.policyType == "expired" && $scope.vehicleInfo.policyStatus.displayText2 == "> 90 days") {
                $scope.showPaymentButton = false;
            } else {
                $scope.showPaymentButton = true;
            }

            // Below piece of code written for Car HDFC Ergo Product.
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

            
            if (localStorageService.get("commAddressDetails")) {
               // $scope.proposerDetails.communicationAddress = localStorageService.get("commAddressDetails");
              $scope.proposerDetails.communicationAddress.comPincode = localStorageService.get("commAddressDetails").pincode;
               $scope.proposerDetails.communicationAddress.comDisplayArea= localStorageService.get("commAddressDetails").displayArea;
               $scope.proposerDetails.communicationAddress.comCity = localStorageService.get("commAddressDetails").city;
               $scope.proposerDetails.communicationAddress.comState = localStorageService.get("commAddressDetails").state;           
            } else {
               $scope.proposerDetails.communicationAddress.comPincode = "";                
              $scope.proposerDetails.communicationAddress.comDoorNo = "";
              $scope.proposerDetails.communicationAddress.comDisplayArea = "";
              $scope.proposerDetails.communicationAddress.comCity = "";
              $scope.proposerDetails.communicationAddress.comState = "";            
            }

            if (localStorageService.get("carRegAddress")) {
              //  $scope.vehicleDetails.pincode = localStorageService.get("bikeRegAddress").pincode;
             $scope.vehicleDetails.registrationAddress.regPincode= localStorageService.get("carRegAddress").pincode;
             $scope.vehicleDetails.registrationAddress.regDisplayArea = localStorageService.get("carRegAddress").displayArea;
             $scope.vehicleDetails.registrationAddress.regCity = localStorageService.get("carRegAddress").city;
             $scope.vehicleDetails.registrationAddress.regState = localStorageService.get("carRegAddress").state;            
            } else {
             $scope.vehicleDetails.registrationAddress.regPincode = "";                 
             $scope.vehicleDetails.registrationAddress.regDoorNo = "";
             $scope.vehicleDetails.registrationAddress.regDisplayArea = "";
             $scope.vehicleDetails.registrationAddress.regCity = "";
             $scope.vehicleDetails.registrationAddress.regState= "";           
            }
         //   $scope.calcDefaultRegAreaDetails($scope.vehicleDetails.pincode);
         $scope.calcDefaultRegAreaDetails($scope.vehicleDetails.registrationAddress.regPincode);
        };

        // Fetch generic relationship list from DB.
        $scope.getRelationshipList = function () {
            getDocUsingId(RestAPI, "relationshipdetailslist", function (relationList) {
                $scope.genericRelationshipList = relationList.relationships;

                // if (localStorageService.get("carProposeFormCookieDetails")) {
                //     $scope.carProposeFormCookieDetails = localStorageService.get("carProposeFormCookieDetails");
                //     $scope.proposerDetails = $scope.carProposeFormCookieDetails.proposerDetails;
                //     if (!$scope.personalDetailsFlag && ($scope.carProposeFormCookieDetails.nominationDetails.firstName && $scope.carProposeFormCookieDetails.nominationDetails.lastName)) {
                //         $scope.nominationDetails = $scope.carProposeFormCookieDetails.nominationDetails;
                //     } else if ($scope.personalDetailsFlag) {
                //         $scope.nominationDetails = $scope.carProposeFormCookieDetails.nominationDetails;
                //     } else {
                //         $scope.nominationDetails = {};
                //     }
                //     $scope.appointeeDetails = $scope.carProposeFormCookieDetails.appointeeDetails;

                //     $scope.insuranceDetails = $scope.carProposeFormCookieDetails.insuranceDetails;
                //     $scope.organizationDetails = $scope.carProposeFormCookieDetails.organizationDetails;
                //     $scope.proposerInfo = $scope.carProposeFormCookieDetails.proposerInfo;
                //     $scope.nominationInfo = $scope.carProposeFormCookieDetails.nominationInfo;
                //     $scope.appointeeInfo = $scope.carProposeFormCookieDetails.appointeeInfo;
                //     $scope.insuranceInfo = $scope.carProposeFormCookieDetails.insuranceInfo;

                //     $scope.vehicleInfo = localStorageService.get("selectedCarDetails");



                //     if ($scope.nominationDetails.personAge < 18) {
                //         $scope.appointeeStatus = true;
                //     } else {
                //         $scope.appointeeStatus = false;
                //     }
                //     $scope.relationList = $scope.genericRelationshipList;
                //     $scope.vehicleDetails.purchasedLoan = "No";
                //     // $scope.proposerDetails.occupation = $scope.vehicleInfo.occupationObject.occupation;
                //     // $scope.proposerDetails.occupationId = $scope.vehicleInfo.occupationObject.occupationId;


                //     $scope.prepopulateFields();
                //     $scope.prevPolicyStatus();
                //     $scope.loadPlaceholder();
                // } 
                // else {
                    if (localStorageService.get("selectedCarDetails")) {
                        $scope.vehicleInfo = localStorageService.get("selectedCarDetails");
                    }

                    $scope.proposerDetails.gender = "Male";
                    $scope.proposerDetails.salutation = "Mr";

                    //condition added for ipos
                    if ($scope.quoteUserInfo) {
                        $scope.proposerDetails.firstName = String($scope.quoteUserInfo.firstName) !== "undefined" ? $scope.quoteUserInfo.firstName : $scope.proposerDetails.firstName;
                        $scope.proposerDetails.lastName = String($scope.quoteUserInfo.lastName) !== "undefined" ? $scope.quoteUserInfo.lastName : $scope.proposerDetails.lastName;
                        $scope.proposerDetails.emailId = String($scope.quoteUserInfo.emailId) !== "undefined" ? $scope.quoteUserInfo.emailId : $scope.proposerDetails.emailId;
                        $scope.proposerDetails.mobileNumber = String($scope.quoteUserInfo.mobileNumber) !== "undefined" ? $scope.quoteUserInfo.mobileNumber : $scope.proposerDetails.mobileNumber;
                        console.log('$scope.selectedProductInputParam.quoteParam.ownedBy in step 2 is: ',$scope.selectedProductInputParam.quoteParam.ownedBy);
                        if ($scope.selectedProductInputParam.quoteParam.ownedBy == "Individual") {
                            $scope.personalDetailsFlag = true;
                        } else if ($scope.selectedProductInputParam.quoteParam.ownedBy == "Organization") {
                            $scope.personalDetailsFlag = false;
                            $scope.organizationDetails.salutation = "M/S";
                            if (!$scope.organizationDetails.organizationName)
                                $scope.organizationDetails.organizationName = "";
                            if ($scope.proposerDetails.firstName) {
                                $scope.organizationDetails.contactPersonName = $scope.proposerDetails.firstName;
                            } else if ($scope.proposerDetails.firstName && $scope.proposerDetails.lastName) {
                                $scope.organizationDetails.contactPersonName = $scope.proposerDetails.firstName + " " + $scope.proposerDetails.lastName;
                            } else {
                                $scope.organizationDetails.contactPersonName = "";
                            }
                            $scope.organizationDetails.emailId = $scope.proposerDetails.emailId;
                            $scope.organizationDetails.mobileNumber = $scope.proposerDetails.mobileNumber;
                        }else{
                            $scope.personalDetailsFlag = true;
                        }
                    }
                    $scope.proposerDetails.dateOfBirth = $scope.selectedProductInputParam.vehicleInfo.dateOfBirth;
                    var nominationDateOfBirth = new Date(new Date().setYear(Number(new Date().getFullYear()) - 35));
                    convertDateFormatToString(nominationDateOfBirth, function (formattedDOB) {
                        $scope.nominationDetails.nomDateOfBirth = formattedDOB;
                        $scope.validateNomineeDateOfBirth();
                    });

                    // if ($scope.vehicleInfo.occupationObject) {
                    // 	$scope.proposerDetails.occupation = $scope.vehicleInfo.occupationObject.occupation;
                    // 	$scope.proposerDetails.occupationId = $scope.vehicleInfo.occupationObject.occupationId;
                    // }

                    $scope.vehicleDetails.isVehicleAddressSameAsCommun = false;
                    $scope.vehicleDetails.purchasedLoan = "No";

                    $scope.prepopulateFields();
                    $scope.prevPolicyStatus();
                    $scope.changeRegAddress();
                    $scope.loadPlaceholder();
               // }
            });
        }
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
        /*setTimeout(function(){
        $('.buyform-control').on('focus blur', function (e) {
            $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
        }).trigger('blur');
    },4000);
	
    setTimeout(function(){
        $('.buyform-control').on('focus blur', function (e) {
            $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
        }).trigger('blur');
    },500);*/


        $scope.onSelectPinInVehicleInspctionModal = function (item) {
            $scope.inspectionDetails.state = item.state;
            $scope.inspectionDetails.pincode = item.pincode;
            $scope.inspectionDetails.city = item.city;
        }
        $scope.closePrevPolExpiredError = function () {
            $scope.prevPolExpiredError = false;
        }
        $scope.closeInspectionModal = function () {
            $scope.modalVehicleInspection = false;
        }

        $scope.submitVehicleInsectionDetails = function () {
            $scope.prevPolExpiredError = false;
            $scope.proceedPaymentStatus = false;
            $scope.proposalInfo();
            $scope.carProposeFormDetails.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
            $scope.carProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.car;
            if (!$rootScope.wordPressEnabled) {
                $scope.carProposeFormDetails.source = sourceOrigin;
            } else {
                $scope.carProposeFormDetails.source = sourceOrigin;
            }
            $scope.carProposeFormDetails.inspectionDetails = $scope.inspectionDetails;
            // Google Analytics Tracker added.
            //analyticsTrackerSendData($scope.carProposeFormDetails); 
            $scope.loading = true;
            RestAPI.invoke("carProposal", $scope.carProposeFormDetails).then(function (proposeFormResponse) {
                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                    $scope.loading = false;
                    if(proposeFormResponse.data.inspectionReferenceNo){
                        $scope.inspectionReferenceNo = proposeFormResponse.data.inspectionReferenceNo;
                    }
                    $scope.longURL = "" + sharePaymentLink + "" + proposeFormResponse.data.proposalId + "&lob=3";
                    $scope.modalVehicleInspection = true;
                } else if ((proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error)  || ($rootScope.agencyPortalEnabled && proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error1) || ($rootScope.agencyPortalEnabled && proposeFormResponse.responseCode == $scope.p365Labels.responseCode.serverError1)) {
                    $scope.loading = false;
                    $scope.responseToken = proposeFormResponse.data;
                    if ($scope.responseToken.proposalId) {
                        localStorageService.set("proposalIdEncrypted", $scope.responseToken.encryptedProposalId);
                    }
                    if($scope.responseToken.proposalId){
                    if (imauticAutomation == true) {
                        console.log('calling mautic proposal function for sharing payment link');
                        imatCarProposal(localStorageService, $scope, 'SubmitProposal', function (shortURLResponse) {
                            if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.shortURLResponse = shortURLResponse;
                                    console.log('$scope.shortURLResponse in imatCarProposal  1 is: ',$scope.shortURLResponse);
								 if($scope.shortURLResponse.data.shortURL){
                                    $scope.shortenURL = $scope.shortURLResponse.data.shortURL;
                                }else{
                                    $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
                                }
                                $scope.sendProposalEmail();
                            } else {
                                $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
                                //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                $scope.sendProposalEmail();
                                $scope.loading = false;
                            }
                            console.log('$scope.shortURLResponse in bike expired case is:', $scope.shortURLResponse);
                        });
                    }
                }
                
                $rootScope.P365Alert("Error", proposeFormResponse.message, "Ok");
                $scope.proceedPaymentStatus = true;
            } else {
                    $scope.loading = false;
                    if(proposeFormResponse.message){
                        $rootScope.P365Alert("Error", proposeFormResponse.message, "Ok");
                    }else{
                        $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                    }
                    $scope.proceedPaymentStatus = true;
                }
            });
        }

$scope.scheduleVehicleInspection = function () {
    $scope.inspectionDetails.mobNumber = $scope.proposerDetails.mobileNumber;
    $scope.inspectionDetails.address = $scope.proposerDetails.communicationAddress.comDisplayArea;
    $scope.inspectionDetails.state = $scope.proposerDetails.communicationAddress.comState;
    $scope.inspectionDetails.pincode = $scope.proposerDetails.communicationAddress.comPincode;
    $scope.inspectionDetails.city = $scope.proposerDetails.communicationAddress.comCity;
    $scope.prevPolExpiredError = true;
    //$location.path('/FourWheelerscheduleInspection');
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
    getListFromDB(RestAPI, "", $scope.p365Labels.documentType.carCarrier, $scope.p365Labels.request.findAppConfig, function (carCarrierList) {
        if (carCarrierList.responseCode == $scope.p365Labels.responseCode.success) {
            $scope.carrierList = carCarrierList.data;
            // var docId = $scope.p365Labels.documentType.buyScreen + "-" + $scope.selectedProductInputParam.quoteParam.quoteType;
            // getDocUsingId(RestAPI, docId, function (buyScreenTooltip) {
            // 	$scope.buyTooltip = buyScreenTooltip.toolTips;
            console.log('$scope.carrierList is : ',JSON.stringify($scope.carrierList));
            $scope.getRelationshipList();
            $rootScope.loading = false;
            // });
        } else {
           // $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.serverError, "Ok");
           $scope.carrierList = carProposalLabels.carCarrierList; 
           console.log('$scope.carrierList from application label',$scope.carrierList);
           $scope.getRelationshipList();
            $rootScope.loading = false;
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
    proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.car;
    //proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
    if($scope.iposRequest.docId){
         proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
         }else{
             proposalDetailsEmail.paramMap.quoteId =localStorageService.get("CAR_UNIQUE_QUOTE_ID");
        }
    proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
    proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
    proposalDetailsEmail.paramMap.LOB = "2";
    console.log('$rootScope.encryptedProposalID in bike is:',$rootScope.encryptedProposalID);
        if($scope.shortenURL){
            proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;
        }else{
            $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";   
            proposalDetailsEmail.paramMap.url = $scope.longURL;   
        }
		console.log('**$scope.longURL **: ',$scope.longURL);
        RestAPI.invoke($scope.p365Labels.transactionName.sendEmail, proposalDetailsEmail).then(function (emailResponse) {
        if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                $scope.sendSMS();
            if (baseEnvEnabled == true && agencyPortalEnabled == true) {
                var frameURL = agencyPortalUrl + proposalDetailsEmail.paramMap.docId + "&lob=" + proposalDetailsEmail.paramMap.LOB;
                $scope.URLforPayment = $sce.trustAsResourceUrl(frameURL);
                if(!$scope.alreadyExpiredPolicyError){
                $scope.modalAP = true;
                }
                $scope.loading = false;
            } else {
                $scope.redirectForPayment = false;
                $scope.loading = false;
                if(!$scope.alreadyExpiredPolicyError){
                $scope.modalIPOS = true;
                }
            }
        } else {
                $scope.sendSMS();
            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
            $scope.loading = false;
        }
    });
}
$scope.submitProposalData = function () {
    $scope.submitProposalClicked = true;
    $scope.proposalInfo();
    $scope.carProposeFormDetails.QUOTE_ID = $scope.iposRequest.docId;
    $scope.carProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.car;
   // $scope.carProposeFormDetails.carrierProposalStatus = false;
    $scope.carProposeFormDetails.personalDetailsFlag = $scope.personalDetailsFlag;
    if (!$rootScope.wordPressEnabled) {
        //$scope.carProposeFormDetails.baseEnvStatus = baseEnvEnabled;
        $scope.carProposeFormDetails.requestSource = sourceOrigin;
        $scope.carProposeFormDetails.source = sourceOrigin;
    } else {
        $scope.carProposeFormDetails.source = sourceOrigin;
    }

    $scope.loading = true;

    if (!$scope.saveProposal) {

        /*$scope.transactionName = $scope.transactionNameCopy;*/
       // $scope.carProposeFormDetails.isCleared = true;
        //			alert("proposeFormResponse :"+JSON.stringify(proposeFormResponse.data));
        delete $scope.carProposeFormDetails.proposalId;
        if ($rootScope.agencyPortalEnabled) {
            const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
            $scope.carProposeFormDetails.requestSource = sourceOrigin;
            $scope.carProposeFormDetails.source = sourceOrigin;
            if (localdata) {
                $scope.carProposeFormDetails.userName = localdata.username;
                $scope.carProposeFormDetails.agencyId = localdata.agencyId;
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

                    $scope.proposalId = proposeFormResponse.data.proposalId;
                    $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                    localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                    $scope.responseToken = proposeFormResponse.data;
                    $scope.responseToken.paymentGateway = $scope.paymentURL;
                    $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.car;
                    localStorageService.set("carReponseToken", $scope.responseToken);

                    $rootScope.encryptedLOB = $scope.p365Labels.businessLineType.car;
                    $rootScope.encryptedProposalID = $scope.encryptedProposalId;

                    //added by gauri for mautic application
                    if (imauticAutomation == true) {
                        //imatCarProposal(localStorageService, $scope, 'SubmitProposal');
                        imatCarProposal(localStorageService, $scope, 'SubmitProposal', function (shortURLResponse) {
                            if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.shortURLResponse = shortURLResponse;
                                console.log('$scope.shortURLResponse in imatCarProposal is: ',$scope.shortURLResponse);
                                if($scope.shortURLResponse.data.shortURL){
                                $scope.shortenURL = $scope.shortURLResponse.data.shortURL;
                                $scope.sendProposalEmail();
                                }else{
                                    $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
                                $scope.sendProposalEmail();
                                }
                            }else {
                                //$rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
                                console.log('long url is: ',$scope.longURL);
                                $scope.sendProposalEmail();                             
                            }
                        });

                    } else {
                        var body = {};
                        body.longURL = sharePaymentLink + String($scope.responseToken.proposalId) + "&lob=" + String($scope.p365Labels.businessLineType.car);
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
        RestAPI.invoke($scope.transactionSaveProposal, $scope.carProposeFormDetails).then(function (proposeFormResponse) {
            if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                $scope.proposalId = proposeFormResponse.data;
                localStorageService.set("proposalId", $scope.proposalId);
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
    validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
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

    proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
    console.log('$scope.shortenURL in send email is: ',$scope.shortenURL);
    if($scope.shortenURL){
    proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;
    }else{
        $scope.longURL = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";  
        proposalDetailsEmail.paramMap.url = $scope.longURL;   
    }
    console.log('$scope.longURL  in car is:',$scope.longURL);
    proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
    //proposalDetailsEmail.isBCCRequired = 'Y';
    proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
     proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.car;
    RestAPI.invoke($scope.p365Labels.transactionName.sendEmail, proposalDetailsEmail).then(function (emailResponse) {
        if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
            $scope.sendSMS();
        } else {
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

$scope.closeModal = function () {
    $scope.modalPrevPolExpiredError = false;
}

/*----- iPOS+ Functions Ends -------*/

/*----- iPOS+ Code Starts -------*/
var getLeadInfodata = {};
// add proposal  of the renewal if present 
if (localStorageService.get("renewPolicyDetails")) {

    var renewPolicyDetails = localStorageService.get("renewPolicyDetails");
    getLeadInfodata.proposalId = renewPolicyDetails.productId;
}
getLeadInfodata.messageId = messageIDVar;

RestAPI.invoke("getLeadInfo", getLeadInfodata).then(function (callback) {

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
            //$http.get('ApplicationLabels.json').then(function (applicationCommonLabels) {
            //$scope.globalLabel = applicationCommonLabels.data.globalLabels;
            //localStorageService.set("applicationLabels", applicationCommonLabels.data);
            $scope.p365Labels = carProposalLabels;                  
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

            $scope.vehicleData = {};
            $scope.vehicleData.occupationObject = {};
            $scope.vehicleData.deductibleObject = {};
            $scope.vehicleData.addOnCoverCustomAmount = {};
            $rootScope.vehicleDetails = {};
            $scope.carInsuranceTypes = carInsuranceTypeGeneric;
            RestAPI.invoke("quoteDataReader", $scope.iposRequest).then(function (quoteData) {
                if (quoteData.responseCode == $scope.p365Labels.responseCode.success) {
                    $scope.quoteInfo = quoteData.data;
                    $scope.selectedProductInputParam = $scope.quoteInfo.carQuoteRequest;

                    // connemted and added  as disscussed with danny  
                    // $scope.vehicleInfo = $scope.selectedProductInputParam.vehicleInfo                    
                    $scope.vehicleInfo = localStorageService.get("selectedCarDetails");

                    //$scope.insuranceDetails.insuranceType = $scope.vehicleInfo.insuranceType.value;
                    $scope.insuranceDetails.insuranceType = $scope.quoteInfo.carQuoteRequest.quoteParam.policyType;
                    $scope.quoteCalcResponse = $scope.quoteInfo.carQuoteResponse;
                    for (var j = 0; j < $scope.quoteCalcResponse.length; j++) {
                        $scope.quoteCalcResponse[j].id = (j + 1);
                    }
                    for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                        if ($scope.quoteCalcResponse[i].carrierId == $scope.iposRequest.carrierId &&
                            $scope.quoteCalcResponse[i].productId == $scope.iposRequest.productId) {
                            $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                            $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                            break;
                        }
                    }
                    console.log('$scope.selectedProductInputParam.quoteParam.ownedBy in step 1 from quote response is: ',$scope.selectedProductInputParam.quoteParam.ownedBy);
                    if($scope.selectedProductInputParam.quoteParam.ownedBy == "Individual") {
                        $scope.personalDetailsFlag = true;
                    }else if ($scope.selectedProductInputParam.quoteParam.ownedBy == "Organization") {
                        $scope.personalDetailsFlag = false;
                    }else{
                        $scope.personalDetailsFlag = true;
                    }

                    $scope.changeInsuranceCompany = function () {
                        // reloading same page for updating form validations and carrier specific fields  -- Akash K.
                        $location.path('/buyFourWheeler').search({
                            quoteId: localStorageService.get("CAR_UNIQUE_QUOTE_ID"),
                            carrierId: $scope.premiumDetails.selectedProductDetails.carrierId,
                            productId: $scope.premiumDetails.selectedProductDetails.productId,
                            lob: localStorageService.get("selectedBusinessLineId")
                        });
                    }



                    for (i = 0; i < $scope.carInsuranceTypes.length; i++) {
                        if ($scope.selectedProductInputParam.quoteParam.policyType == $scope.carInsuranceTypes[i].value) {
                            $scope.vehicleData.insuranceType = $scope.carInsuranceTypes[i];
                            break;
                        }
                    }
                    var todayDate = new Date();
                    var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
                        ("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
                    getPolicyStatusList(formatedTodaysDate);

                    $scope.policyStatusList = policyStatusListGeneric;

                    var dateArray = $scope.selectedProductInputParam.vehicleInfo.PreviousPolicyExpiryDate.split("/");
                    var previousPolicyExpiredDays = getDays(dateArray[2] + "," + dateArray[1] + "," + dateArray[0]);

                    if ($scope.selectedVehicleDetails.previousPolicyExpired == "N") {
                        $scope.vehicleData.policyStatusKey = 3;
                    } else if (previousPolicyExpiredDays > 90) {

                        $scope.vehicleData.policyStatusKey = 1;
                    } else {
                        $scope.vehicleData.policyStatusKey = 2;
                    }

                    for (i = 0; i < $scope.policyStatusList.length; i++) {
                        if ($scope.vehicleData.policyStatusKey == $scope.policyStatusList[i].key) {
                            $scope.vehicleData.policyStatus = $scope.policyStatusList[i];
                            break;
                        }
                    }
                    if ($scope.selectedProductInputParam.quoteParam.riders) {
                        for (i = 0; i < $scope.selectedProductInputParam.quoteParam.riders.length; i++) {
                            if ($scope.selectedProductInputParam.quoteParam.riders[i].riderId == 21) {
                                $scope.vehicleData.addOnCoverCustomAmount.passengerCover = $scope.selectedProductInputParam.quoteParam.riders[i].riderAmount;
                            }
                            if ($scope.selectedProductInputParam.quoteParam.riders[i].riderId == 20) {
                                $scope.vehicleData.addOnCoverCustomAmount.driverAccidentCover = $scope.selectedProductInputParam.quoteParam.riders[i].riderAmount;
                            }
                            if ($scope.selectedProductInputParam.quoteParam.riders[i].riderId == 25) {
                                $scope.vehicleData.addOnCoverCustomAmount.electricalAccessories = $scope.selectedProductInputParam.quoteParam.riders[i].riderAmount;
                            }
                            if ($scope.selectedProductInputParam.quoteParam.riders[i].riderId == 30) {
                                $scope.vehicleData.addOnCoverCustomAmount.nonElectricalAccessories = $scope.selectedProductInputParam.quoteParam.riders[i].riderAmount;
                            }
                            if ($scope.selectedProductInputParam.quoteParam.riders[i].riderId == 35) {
                                $scope.vehicleData.addOnCoverCustomAmount.lpgCngKitCover = $scope.selectedProductInputParam.quoteParam.riders[i].riderAmount;
                            }
                        }
                    }
                    //$scope.vehicleData.occupationObject.occupationId = $scope.selectedProductInputParam.quoteParam.occupationId;
                    //$scope.vehicleData.occupationObject.occupation = $scope.selectedProductInputParam.quoteParam.occupation;
                    $scope.vehicleData.manufacturingYear = Number($scope.selectedProductInputParam.vehicleInfo.regYear);
                    $rootScope.vehicleDetails.registrationNumber = $scope.selectedProductInputParam.vehicleInfo.registrationNumber;
                    //$scope.vehicleData.deductibleObject.actualValue = $scope.selectedProductInputParam.quoteParam.deductible;
                    $scope.vehicleData.maxVehicleAge = 15;

                    $rootScope.voluntaryDeductable = 0;
                    $rootScope.antiTheftDeviceAmount = 0;
                    var buyScreenParam = {};
                    buyScreenParam.documentType = "proposalScreenConfig";
                    buyScreenParam.carrierId = Number($scope.iposRequest.carrierId);

                    for (var i = 0; i < $scope.quoteInfo.carQuoteResponse.length; i++) {
                        if (Number($scope.iposRequest.carrierId) == $scope.quoteInfo.carQuoteResponse[i].carrierId &&
                            $scope.quoteCalcResponse[i].productId == $scope.iposRequest.productId) {
                            $scope.selectedProduct = $scope.quoteInfo.carQuoteResponse[i];
                            buyScreenParam.productId = $scope.quoteInfo.carQuoteResponse[i].productId;
                            buyScreenParam.businessLineId = $scope.p365Labels.businessLineType.car;
                        } else {
                            $rootScope.loading = true;
                        }
                    }
                    for (var i = 0; i < $scope.selectedProduct.discountList.length; i++) {
                        if ($scope.selectedProduct.discountList[i].type == "Voluntary Deductible Discount" && $scope.selectedProduct.discountList[i].discountAmount > 0) {
                            $rootScope.voluntaryDeductable = $scope.selectedProduct.discountList[i].discountAmount;
                        }
                        if ($scope.selectedProduct.discountList[i].type == "Anti-Theft Discount" && $scope.selectedProduct.discountList[i].discountAmount > 0) {
                            $rootScope.antiTheftDeviceAmount = $scope.selectedProduct.discountList[i].discountAmount;
                        }
                    }
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
                            $scope.transactionNameCopy = $scope.transactionName;
                            $scope.transactionSaveProposal = "saveProposalService";
                            $scope.transactionSubmitProposal = "submitProposal";

                            //added for hdfc
                            if ($scope.productValidation.PUCValidation) {
                                $scope.PUCValidation = true;
                            } else {
                                $scope.PUCValidation = false;
                            }

                            $scope.initCarBuyScreen();
                            $scope.getCarrierList();
                        }
                    });
                } else {

                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.iposFormErrorMsg, "Ok");
                }
            });
            //}); /*----- iPOS+ Code Ends -------*/
        } else {
            $scope.p365Labels = carProposalLabels;
            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");

            $rootScope.loaderContent = {
                businessLine: '3',
                header: 'Car Insurance',
                desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct)
            };

            $rootScope.title = $scope.p365Labels.policies365Title.carBuyQuote;

            var quoteUserInfo = localStorageService.get("quoteUserInfo");

            var buyScreens = localStorageService.get("buyScreen");

            $scope.selectedProduct = localStorageService.get("carSelectedProduct");
            $scope.insuranceDetails.insuranceType = $scope.selectedProduct.policyType;
            $scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
            $scope.addOnCovers = localStorageService.get("addOnCoverListForCar");

            if ($scope.selectedProductInputParam.quoteParam.ownedBy == "Individual") {
                $scope.personalDetailsFlag = true;
            } else if ($scope.selectedProductInputParam.quoteParam.ownedBy == "Organization") {
                $scope.personalDetailsFlag = false;
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
               $scope.proposerDetails.communicationAddress.comDisplayArea = localStorageService.get("commAddressDetails").displayArea;
               $scope.proposerDetails.communicationAddress.comPincode = localStorageService.get("commAddressDetails").pincode;
               $scope.proposerDetails.communicationAddress.comState = localStorageService.get("commAddressDetails").state;
               $scope.proposerDetails.communicationAddress.comCity = localStorageService.get("commAddressDetails").city;
                  
          } else {
                $scope.proposerDetails.communicationAddress.comDisplayArea= "";
                $scope.proposerDetails.communicationAddress.comPincode = "";
                $scope.proposerDetails.communicationAddress.comState= "";
                $scope.proposerDetails.communicationAddress.comCity = "";                 
          }
            $scope.initCarBuyScreen();
            $scope.getCarrierList();
        }
    } else {
        $rootScope.P365Alert("Policies365", "Server Error", "Ok");
    }
});
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
                  //  $scope.proposerDetails.address = fomattedAddress;
                  $scope.proposerDetails.communicationAddress.comDisplayArea= fomattedAddress;

                    if (String(formattedPincode) != "undefined" && formattedPincode != "") {
                        $scope.calcDefaultAreaDetails(formattedPincode);
                    } else {
                      //  $scope.proposerDetails.pincode = "";
                      $scope.proposerDetails.communicationAddress.comPincode = "";
                          
                   //   $scope.proposerDetails.state = "";
                   $scope.proposerDetails.communicationAddress.comState = "";
                       
                  // $scope.proposerDetails.city = "";
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
                   // $scope.vehicleDetails.address = fomattedAddress;
                   $scope.vehicleDetails.registrationAddress.regDisplayArea = fomattedAddress;

                    if (String(formattedPincode) != "undefined" && formattedPincode != "") {
                        $scope.calcDefaultRegAreaDetails(formattedPincode);
                    } else {
                    //    $scope.vehicleDetails.pincode = "";
                    $scope.vehicleDetails.registrationAddress.regPincode = "";
                         
                //    $scope.vehicleDetails.state = "";
                $scope.vehicleDetails.registrationAddress.regState = "";
                    
               // $scope.vehicleDetails.city = "";
               $scope.vehicleDetails.registrationAddress.regCity = "";
                      
            }

                    $scope.$apply();
                });
            }, 10);
        });

// Hide the footer navigation links.
$(".activateFooter").hide();
$(".activateHeader").hide();

    }]);