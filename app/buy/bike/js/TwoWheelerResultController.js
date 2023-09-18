/*
 * Description	: This is the controller file for bike quote result.
 * Author		: Yogesh Shisode
 * Date			: -
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *  1		12-01-2017		Changes for idv button.																modification-0001		Reena S.
 *  
 * */
var jsonEncodeCarrierList = []; 
'use strict';
angular.module('bikeResult', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('bikeResultController', ['$scope', '$rootScope', '$location', '$filter', '$http', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$sce', '$q', function ($scope, $rootScope, $location, $filter, $http, RestAPI, localStorageService, $timeout, $interval, $sce, $q) {
        // Setting application labels to avoid static assignment.	-	modification-0003
        $scope.EmailChoices = [{ 'username': '', 'addNew': true, paramMap: { 'docId': '', 'LOB': localStorageService.get("selectedBusinessLineId").toString(), 'userId': '', 'selectedPolicyType': '', 'make': '', 'model': '', 'registrationNum': '', 'Variant': '' } }];

        var applicationLabels = localStorageService.get("applicationLabels");
        var sharePDFQuote = {};
        $scope.globalLabel = applicationLabels.globalLabels;
        $scope.p365Labels = insBikeQuoteLables;

        $scope.focusInput = true;
        $sce.polTypeChanged = false;
        $rootScope.loading = true;
        $scope.BikePACoverDetails = {};
        $scope.BikePACoverDetails.isPACoverApplicable = false;
        $scope.resetDisplayVehicle = false;
        //added for ODonly plan
        $scope.odOnlyPlan = false;
       // $rootScope.isBackButtonPressed = false;

        $scope.quoteUserInfo = {};
        $scope.quoteUserInfo.messageId = '';
        $scope.quoteUserInfo.termsCondition = true;
        $scope.bikePremiumTemplate = wp_path + "buy/common/html/bikePremiumTemplate.html";
        $scope.buyOptionDisabled = false;
    
        //for wordpress
        if ($rootScope.wordPressEnabled) {
            $scope.rippleColor = '';
        } else {
            $scope.rippleColor = '#f8a201';
        }

        //for wordpress
        $scope.bikeInputSectionHTML = wp_path + 'buy/bike/html/BikeInputSection.html';
        $scope.bikeRiderSectionHTML = wp_path + 'buy/bike/html/BikeRiderSection.html';
        $scope.bikeIDVSectionHTML = wp_path + 'buy/bike/html/BikeIDVSection.html';
        $scope.bikeShareEmailSectionHTML = wp_path + 'buy/bike/html/BikeShareEmailSection.html';
        $scope.bikeInsuranceTypeSectionHTML = wp_path + 'buy/bike/html/BikeInsuranceTypeSection.html';
        $scope.bikePACoverSectionHTML = wp_path + 'buy/bike/html/BikePACoverSection.html';
        $scope.vehicalOwnerTypeSectionHTML = wp_path + 'buy/bike/html/VehicalOwnerTypeSection.html';

        if ($location.path() == "/PBBikeResult") {
            $scope.PBBikeInputSection = wp_path + 'buy/common/html/PBHTML/PBBikeInputSection.html';
            $scope.PBBikeRidersSection = wp_path + 'buy/common/html/PBHTML/PBBikeRidersSection.html';
            $scope.PBBikeBestResultSection = wp_path + 'buy/common/html/PBHTML/PBBikeBestResultSection.html';
            $scope.inputSectionEnabled = true;
            $scope.ridersSectionEnabled = false;
            $scope.resultSectionEnabled = false;
            $scope.PACoverDeclaration = false;
            $scope.commonInfo = localStorageService.get("professionalQuoteParams").commonInfo;
        }
       
        $rootScope.title = $scope.p365Labels.policies365Title.bikeResultQuote;
        // if (localStorageService.get("userLoginInfo")) {
        //     $rootScope.userLoginStatus = localStorageService.get("userLoginInfo").status;
        //     $rootScope.username = localStorageService.get("userLoginInfo").username;
        // }
        var bikeQuoteCookie = localStorageService.get("bikeQuoteInputParamaters");
        
        //Added By Abhisek M
        var UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED");

        if (localStorageService.get("PROF_QUOTE_ID_ENCRYPTED")) {
            $scope.UNIQUE_PROF_QUOTE_ID_ENCRYPTED = localStorageService.get("PROF_QUOTE_ID_ENCRYPTED");
        }

        //added for Expand & collapse DOM element for ipos 
        $scope.bikeInputSection = false;
        $scope.idvInputSection = false;
        $scope.riderInputSection = false;
        $scope.bikeInsuranceInputSection = false;
        $scope.ownerInputSection = false;

        //for agencyPortal
        // $scope.modalView = false;
        // if ($rootScope.agencyPortalEnabled) {
        //     //checking for lead
        //     var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
        //     $scope.createLeadAP = $location.search().createLead;
        //     if (quoteUserInfoCookie && $scope.createLeadAP == 'true') {
        //         messageIDVar = '';
        //         $scope.modalView = true;
        //     } else if (!quoteUserInfoCookie || $scope.createLeadAP == 'true') {
        //         $scope.modalView = true;
        //     }
        // }

        if (localStorage.getItem('quoteUserInfo')) {
            const quoteUserInfo = JSON.parse(localStorage.getItem('quoteUserInfo'));
            console.log('quoteUserInfo in agency car result is::', quoteUserInfo);
            if (quoteUserInfo) {
                $scope.quoteUserInfo = quoteUserInfo;
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
            }
        }

        //if ($rootScope.agencyPortalEnabled) {
        if ($location.search().messageId) {
            //added by gauri for mautic application for agency portal specific          
            console.log('imauticAutomation in agency is: ', imauticAutomation);
            if (imauticAutomation == true) {
                console.log('$location.search().source  in agency is: ', $location.search().source);
                if ($location.search().source) {
                    if ($location.search().source == 'ramp') {
                        //  if(!(localStorageService.get("quoteUserInfo"))){
                        var docId = "LeadProfile-" + $location.search().messageId;
                        getDocUsingIdTransDB(RestAPI, docId, function (callback) {
                            console.log('response for lead document is :::', callback);
                            if (callback) {
                                var quoteUserInfo = {};
                                if (callback.LeadDetails) {
                                    if (callback.LeadDetails.lastActivity.contactInfo.firstName) {
                                        quoteUserInfo.firstName = callback.LeadDetails.lastActivity.contactInfo.firstName;
                                    } if (callback.LeadDetails.lastActivity.contactInfo.lastName) {
                                        quoteUserInfo.lastName = callback.LeadDetails.lastActivity.contactInfo.lastName;
                                    } if (callback.LeadDetails.lastActivity.contactInfo.emailId) {
                                        quoteUserInfo.emailId = callback.LeadDetails.lastActivity.contactInfo.emailId;
                                    } if (callback.LeadDetails.lastActivity.contactInfo.mobileNumber) {
                                        quoteUserInfo.mobileNumber = callback.LeadDetails.lastActivity.contactInfo.mobileNumber;
                                    }
                                    quoteUserInfo.termsCondition = true;
                                    quoteUserInfo.createLeadStatus = false;
                                    console.log('quote user info is: ', quoteUserInfo);
                                    localStorageService.set("quoteUserInfo", quoteUserInfo);
                                    // $scope.fetchCarrierSpecificVariants();
                                   imatBikeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                                } else {
                                   imatBikeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                                    //$scope.fetchCarrierSpecificVariants();
                                    console.log('unable to read data from quote id');
                                }
                            } else {
                                   imatBikeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                                // $scope.fetchCarrierSpecificVariants(); 
                            }
                        });
                    } else {
                        // $scope.fetchCarrierSpecificVariants();
                        imatBikeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted')
                    }
                } else {
                    console.log('no source found creating lead using imat');
                    // $scope.fetchCarrierSpecificVariants();
                     imatBikeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                }
            }
        } else if ($rootScope.agencyPortalEnabled || pospEnabled) {
            // $scope.fetchCarrierSpecificVariants();
               imatBikeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
        }
        // Fetch lead id from url for iQuote+.
        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
            if ($location.search().messageId) {
                messageIDVar = $location.search().messageId;
                //$scope.quoteUserInfo.messageId = $location.search().messageId;
            }
            if (String($location.search().leaddetails) != "undefined") {
                var leaddetails = JSON.parse($location.search().leaddetails);
                if (!leaddetails.messageId) {
                    leaddetails.messageId = $location.search().messageId;
                }
                localStorageService.set("quoteUserInfo", leaddetails);
            }
            //added to collapse & expand inputSection for ipos
            $scope.bikeInputSection = true;
            $scope.idvInputSection = true;
            $scope.riderInputSection = true;
            $scope.bikeInsuranceInputSection = true;
            $scope.ownerInputSection = true;
        }

        $scope.bikeQuoteRequestFormation = function (bikeQuoteRequestParam) {
            $scope.quoteRequest = {};
            $scope.quoteRequest.vehicleInfo={};
            $scope.quoteRequest.quoteParam={};
 
            $scope.quoteRequest.vehicleInfo.IDV = bikeQuoteRequestParam.vehicleInfo.IDV;
            $scope.quoteRequest.vehicleInfo.PreviousPolicyExpiryDate = bikeQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
            $scope.quoteRequest.vehicleInfo.TPPolicyExpiryDate = bikeQuoteRequestParam.vehicleInfo.TPPolicyExpiryDate;
            $scope.quoteRequest.vehicleInfo.TPPolicyStartDate = bikeQuoteRequestParam.vehicleInfo.TPPolicyStartDate;
            $scope.quoteRequest.vehicleInfo.RTOCode = bikeQuoteRequestParam.vehicleInfo.RTOCode;
            $scope.quoteRequest.vehicleInfo.city = bikeQuoteRequestParam.vehicleInfo.city;
            if(bikeQuoteRequestParam.vehicleInfo.dateOfRegistration){
                $scope.quoteRequest.vehicleInfo.dateOfRegistration = bikeQuoteRequestParam.vehicleInfo.dateOfRegistration;
           }
           $scope.quoteRequest.vehicleInfo.idvOption = bikeQuoteRequestParam.vehicleInfo.idvOption;
           $scope.quoteRequest.vehicleInfo.best_quote_id = bikeQuoteRequestParam.vehicleInfo.best_quote_id;
           $scope.quoteRequest.vehicleInfo.previousClaim = bikeQuoteRequestParam.vehicleInfo.previousClaim;
           $scope.quoteRequest.vehicleInfo.registrationNumber = bikeQuoteRequestParam.vehicleInfo.registrationNumber;
           $scope.quoteRequest.vehicleInfo.registrationPlace = bikeQuoteRequestParam.vehicleInfo.registrationPlace;
           $scope.quoteRequest.vehicleInfo.state = bikeQuoteRequestParam.vehicleInfo.state;
           $scope.quoteRequest.vehicleInfo.make = bikeQuoteRequestParam.vehicleInfo.make;
           $scope.quoteRequest.vehicleInfo.model = bikeQuoteRequestParam.vehicleInfo.model;
           $scope.quoteRequest.vehicleInfo.variant = bikeQuoteRequestParam.vehicleInfo.variant.toString();
           $scope.quoteRequest.quoteParam.ncb = bikeQuoteRequestParam.quoteParam.ncb;
           $scope.quoteRequest.quoteParam.ownedBy = bikeQuoteRequestParam.quoteParam.ownedBy;
           $scope.quoteRequest.quoteParam.policyType = bikeQuoteRequestParam.quoteParam.policyType;
           if(bikeQuoteRequestParam.quoteParam.riders)
           $scope.quoteRequest.quoteParam.riders = bikeQuoteRequestParam.quoteParam.riders; 
       }

        /*below functions created for expand & collapse DOM for ipos*/
        $scope.showVehicleDetails = function () {
            $scope.bikeInputSection = !$scope.bikeInputSection;
        }

        $scope.showRiderDetails = function () {
            $scope.riderInputSection = !$scope.riderInputSection;
        }

        $scope.showIDVDetails = function () {
            $scope.idvInputSection = !$scope.idvInputSection;
        }

        $scope.showInsuranceDetails = function () {
            $scope.bikeInsuranceInputSection = !$scope.bikeInsuranceInputSection;
        }

        //added to collapse & expand owner Section for ipos
        $scope.showOwnerDetails = function () {

            $scope.ownerInputSection = !$scope.ownerInputSection;
        }

        /*end ipos function for expand & collapse of DOM*/

        $scope.ownDamageYears = bikeOwnDamageYears;
        $scope.personalAccidentYears = bikePersonalAccidentYears;
        $scope.thirdPartyDamageCoveredYears = bikeThirdPartyDamageCoveredYears;
        $rootScope.personalAccidentValidity = [1, 5];
        $rootScope.ownDamageValidity = [1, 5];
        $rootScope.thirdPartyDamageValidity = [5];
        $scope.KotakDeclarationForPACover = KotakDeclarationForPACover;
        $scope.idvOptions = IDVOptionsGen;
        $scope.carrierVariantList = [];
        var variantList = [];
        //flag added to display resultConfirm Modal
        var resultCnfrmBuyFlag = false;
        var buyConfrmFlag = false;

        if ($rootScope.bikeQuoteRequest) {
            if ($rootScope.bikeQuoteRequest.length == $rootScope.quoteResultCount) {
                if ($rootScope.bikeQuoteResult) {
                    if ($rootScope.bikeQuoteResult.length == 0) {
                        $scope.noQuoteResultFound = true;
                        $rootScope.bikeQuoteRequest = [];

                        $rootScope.bikeQuoteRequest.push({
                            status: 2,
                            message: $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg)
                        });
                        // $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                    }
                }
            }
        }

        // Fetching tool-tip contents from DB for instant quote screen.
        $scope.init = function () {
            $rootScope.loading = false;
            $rootScope.quoteParam = {};
            $scope.bikeInsuranceTypes = [];
            $scope.yearList = [];
            $scope.defaultMetroList = [];
            $rootScope.vehicleInfo = {};
            $rootScope.vehicleDetails = {};
            $scope.quote = {};
            $scope.selectedAddOnCovers = [];
            $scope.insuranceCompanyList = {};
            $scope.insuranceCompanyList.selectedInsuranceCompany = [];
            $rootScope.bikeAddOnCoversList = {};
            $rootScope.bikeAddOnCoversList.selectedAddOnCovers = [];
            $scope.selectPremiumFromResult = {};
            $scope.emailInputParameters = {};
            $scope.emailInputParameters.paramMap = {};
            $scope.selectedCarrier = [];

            var setFlag = false;
            var userIdvStatus = false;
            
            $scope.userIDVError = false;
            $scope.basicExpanded = false;
            $scope.savingsExpanded = false;
            $scope.ridersExpanded = false;
            //$scope.resultCnfrmBuyFlag = false;
           // $scope.buyConfrmFlag = false;
            $scope.idvDetailsModal = false;
            $scope.riderDetailsModal = false;
            $scope.OdOnlyModal = false;
            $scope.showCarrierVehicleVariants = false;
            //added for iquote+ to display loader on carrier variant selection
            $scope.displayLoader = false;
            $scope.noCarrierVariantFound = false;
            $scope.passengerCoverSAList = bikePassengerCoverSAList;
            
            $scope.toggleBasicExpanded = function () {
                $scope.basicExpanded = !$scope.basicExpanded;
            };

            $scope.toggleSavingsExpanded = function () {
                $scope.savingsExpanded = !$scope.savingsExpanded;
            };

            $scope.toggleRidersExpanded = function () {
                $scope.ridersExpanded = !$scope.ridersExpanded;
            };

            //code for default selection of individual 	
            $scope.individualClick = function (getOwner) {
                $scope.ownerTypeModal = false;
                $scope.quoteBikeInputForm.$dirty = true;
                //$scope.vehicleDetails.idvOption = 1;
                $scope.vehicleInfo.IDV = 0;
                $scope.singleClickBikeQuote();
            }

            $scope.ownerChanged = function (_ownedBy) {
                //$scope.vehicleDetails.idvOption = 1;
                $scope.vehicleInfo.IDV = 0;
                if (_ownedBy) {
                    $scope.quoteParam.ownedBy = "Organization";
                } else {
                    $scope.quoteParam.ownedBy = "Individual";
                }
            }

            $scope.backToResultScreen = function () {
                if ($rootScope.isProfessionalJourneySelected) {
                    $location.path("/professionalJourneyResult");
                } else {
                    $location.path("/PBQuote");
                }
            };

            $scope.backToQuotes = function () {
                $location.path("/professionalJourneyResult");
            }

          

            $scope.confirmInput = function () {
                $scope.inputSectionEnabled = false;
                $scope.resultSectionEnabled = false;
                $scope.ridersSectionEnabled = true;
            }

            $scope.showEditInputSection = function () {
                $scope.inputSectionEnabled = true;
                $scope.resultSectionEnabled = false;
                $scope.ridersSectionEnabled = false;
            }
            $scope.backToRiderSection = function () {
                $scope.inputSectionEnabled = false;
                $scope.resultSectionEnabled = false;
                $scope.ridersSectionEnabled = true;
            }

            $scope.quoteParam = localStorageService.get("bikeQuoteInputParamaters").quoteParam;
            $scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;

            if ($scope.vehicleDetails.displayVehicle) {
                $scope.vehicleDisplayName = $scope.vehicleInfo.vehicleDetails;
            }
            if ($scope.vehicleInfo.IDV > 0) {
                $scope.showIDVPopUp = true;
            }
           
            //for professional journey prepopulation 
            var  professionalQuoteBikeCookie;
            var professionalBikeParam = false;
            if(localStorageService.get("professionalQuoteParams")){
             if(localStorageService.get("professionalQuoteParams").bikeInfo){
                professionalBikeParam = true;
                professionalQuoteBikeCookie = localStorageService.get("professionalQuoteParams").bikeInfo;
             }
            }
                if (professionalBikeParam) {
                    if (professionalQuoteBikeCookie.registrationPlace) {
                        $scope.vehicleInfo.registrationPlace = professionalQuoteBikeCookie.registrationPlace;
                    } else if (professionalQuoteBikeCookie.registrationNumber) {
                        $scope.vehicleInfo.registrationNumber =professionalQuoteBikeCookie.registrationNumber;
                    }
                    $scope.vehicleDetails.regYear = professionalQuoteBikeCookie.registrationYear;
                }
            
            if ($scope.quoteParam.policyType == 'renew') {
                if ($scope.vehicleDetails.regYear) {
                    if (parseInt($scope.vehicleDetails.regYear) < 2018) {
                        $scope.showBundle = false;
                     // $scope.quoteParam.onlyODApplicable = false;
                    } else
                        $scope.showBundle = true;
                }
            }
            $scope.vehicleDetails = localStorageService.get("selectedBikeDetails");

            $rootScope.showBikeRegAreaStatus = $scope.vehicleDetails.showBikeRegAreaStatus;
            $rootScope.vehicleDetails.registrationNumber = $scope.vehicleDetails.registrationNumber;

            $scope.addOnCovers = localStorageService.get("addOnCoverListForBike");

            $rootScope.bikeAddOnCoversList.selectedAddOnCovers = [];
            if ($scope.quoteParam.riders) {
                console.log('$scope.addOnCovers is step 1: ',$scope.addOnCovers);
                for (var i = 0; i < $scope.addOnCovers.length; i++) {
                    for (var j = 0; j < $scope.quoteParam.riders.length; j++) {
                        if ($scope.addOnCovers[i].riderId == $scope.quoteParam.riders[j].riderId) {
                            if ($scope.addOnCovers[i].riderId != 11 && $scope.addOnCovers[i].riderId != 15) {
                                $scope.addOnCovers[i].riderAmount = $scope.quoteParam.riders[j].riderAmount;
                            }
                            $rootScope.bikeAddOnCoversList.selectedAddOnCovers.push($scope.addOnCovers[i]);
                            break;
                        }
                    }
                }
                console.log('$rootScope.bikeAddOnCoversList.selectedAddOnCovers step 1',$rootScope.bikeAddOnCoversList.selectedAddOnCovers);
                localStorageService.set("addOnCoverListForBike", $scope.addOnCovers);
            }

            for(var i = 0 ; i< $scope.quoteParam.riders.length; i++)
            {
                if($scope.quoteParam.riders[i].riderId == 10){
                    $scope.BikePACoverDetails={};
                    console.log("inside pacover if............ :");
                   // quoteParam.onlyODApplicable =false;
                   $scope.BikePACoverDetails.isPACoverApplicable = true;
                   $scope.PACoverModal = false;
                   $scope.PACoverFlag = 1 ;                 
                break;
                }
                
            }

            $scope.PACoverAddon = function () {

                $scope.tempVar = {};
               
                $scope.tempVar.riderId = 10;
                $scope.tempVar.riderName = "Personal Accident Cover";
            

             //   console.log("inside PACoverAddon",$scope.quoteParam.riders)
                if ($scope.quoteParam.riders) {
                    $scope.quoteParam.riders.push( $scope.tempVar);
                   
                }              
                console.log("inside PACoverAddon",$scope.quoteParam.riders)
            }

            $scope.bikePopupIntegerMap = function (tempBikeQuoteResult) {
                for(var i=0;i<tempBikeQuoteResult.length;i++){
                 if(tempBikeQuoteResult[i].netPremiumMean)
                 tempBikeQuoteResult[i].netPremiumMean = Number(tempBikeQuoteResult[i].netPremiumMean);
 
                 
                 if(tempBikeQuoteResult[i].proffesionalRating)
                 tempBikeQuoteResult[i].proffesionalRating = Number(tempBikeQuoteResult[i].proffesionalRating);
 
                 if(tempBikeQuoteResult[i].premiumRatio)
                 tempBikeQuoteResult[i].premiumRatio = Number(tempBikeQuoteResult[i].premiumRatio);
 
                 if(tempBikeQuoteResult[i].claimIndex)
                 tempBikeQuoteResult[i].claimIndex = Number(tempBikeQuoteResult[i].claimIndex);
 
                 if(tempBikeQuoteResult[i].insurerIndex)
                 tempBikeQuoteResult[i].insurerIndex = Number(tempBikeQuoteResult[i].insurerIndex);
 
                 if(tempBikeQuoteResult[i].basicCoverage)
                 tempBikeQuoteResult[i].basicCoverage = Number(tempBikeQuoteResult[i].basicCoverage);
 
                 if(tempBikeQuoteResult[i].netPremiumMax)
                 tempBikeQuoteResult[i].netPremiumMax = Number(tempBikeQuoteResult[i].netPremiumMax);
 
                 if(tempBikeQuoteResult[i].grossPremium)
                 tempBikeQuoteResult[i].grossPremium = Number(tempBikeQuoteResult[i].grossPremium);
 
                 if(tempBikeQuoteResult[i].ncbPercentage)
                 tempBikeQuoteResult[i].ncbPercentage = Number(tempBikeQuoteResult[i].ncbPercentage);
 
                 if(tempBikeQuoteResult[i].netPremium)
                 tempBikeQuoteResult[i].netPremium = Math.floor(Number(tempBikeQuoteResult[i].netPremium));
     
                 if(tempBikeQuoteResult[i].totalDiscountAmount)
                 {
                 tempBikeQuoteResult[i].totalDiscountAmount = Number(tempBikeQuoteResult[i].totalDiscountAmount);
                 }
                 if(tempBikeQuoteResult[i].totalRiderAmount)
                 tempBikeQuoteResult[i].totalRiderAmount = Number(tempBikeQuoteResult[i].totalRiderAmount);
 
                 if(tempBikeQuoteResult[i].paidDriverCover){
                     tempBikeQuoteResult[i].paidDriverCover = Number(tempBikeQuoteResult[i].paidDriverCover);
                 }else{
                     tempBikeQuoteResult[i].paidDriverCover = 0;
                 }
     
                 for(var j=0;j<tempBikeQuoteResult[i].discountList.length;j++)
                 {
                        if(tempBikeQuoteResult[i].discountList[j].discountAmount)
                        tempBikeQuoteResult[i].discountList[j].discountAmount=Number(tempBikeQuoteResult[i].discountList[j].discountAmount);
                 }
                 tempBikeQuoteResult[i].maxIdvValue =Number(tempBikeQuoteResult[i].maxIdvValue);
                 tempBikeQuoteResult[i].minIdvValue =Number(tempBikeQuoteResult[i].minIdvValue);
                 tempBikeQuoteResult[i].insuredDeclareValue =Number(tempBikeQuoteResult[i].insuredDeclareValue);
                 tempBikeQuoteResult[i].serviceTax =Number(tempBikeQuoteResult[i].serviceTax);
                 tempBikeQuoteResult[i].odpremium = Number(tempBikeQuoteResult[i].odpremium);
                 tempBikeQuoteResult[i].tppremium = Number(tempBikeQuoteResult[i].tppremium);
                 //_data.llDriverCover =  Number(_data.llDriverCover);
                }
             return tempBikeQuoteResult ;
             }
            if (localStorageService.get("bikeQuoteInputParamaters").quoteParam.riders) {
                $scope.selectedAddOn = localStorageService.get("bikeQuoteInputParamaters").quoteParam.riders.length;
            }
            console.log('$scope.vehicleDetails.regYear is : ',$scope.vehicleDetails.regYear);
            $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
            console.log('$scope.manufacturingYearList is ',$scope.manufacturingYearList);
            $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
            $scope.calculatedVehicleRegistrationDate = getDateForDisplay($scope.vehicleInfo.dateOfRegistration);
            //$scope.calculatedVehicleExpiryDate = $scope.vehicleDetails.policyStatus.displayText2;
            $scope.defaultMetroList = localStorageService.get("defaultMetroCityList");

            $scope.ownerShipChange = yesNoStatusGeneric;
            $scope.sortTypes = sortTypesVehicleGeneric;
            $scope.sortType = sortTypesVehicleGeneric[0];

            $scope.selectedSortOption = $scope.sortTypes[0];

            //$scope.quoteParam.ownerShipChange = $scope.ownerShipChange[1].value;
            //$scope.vehicleDetails.ownerShipChange = $scope.quoteParam.ownerShipChange;

            $scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;
            $scope.policyStatusList = policyStatusListGeneric;
            $scope.ncbList = ncbListGeneric;
            $scope.previousClaimStatus = previousClaimStatusGeneric;
            $scope.comparePoliciesDisplayList = comparePoliciesDisplayValues;
            $scope.comparePoliciesTypeList = comparePoliciesTypeListGen;
            $scope.insurancePlanTypes = bikeInsurancePlanTypesGen;
            $scope.insuranceTypeList = insuranceTypeListGen;
            $rootScope.selectedInsuranceType = $scope.insuranceTypeList[0].value;

            var vehicleDetailsCookie = localStorageService.get("bikeRegistrationDetails");
            if (vehicleDetailsCookie) {
                if (String(vehicleDetailsCookie.registrationNumber) != "undefined" && vehicleDetailsCookie.registrationNumber != null) {
                    $rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;
                }
            }
            if (!$scope.defaultMetroList) {
                $scope.defaultMetroList = commonResultLabels.popularRTOList.data;
                localStorageService.set("defaultMetroCityList", $scope.defaultMetroList);
                console.log('fetching default metrolist from application labels', $scope.defaultMetroList);
            }

            //function created to reset vehicle details on cancel
            $scope.resetVehicleDetails = function () {
                $scope.vehicleInfoCopy = angular.copy($scope.vehicleInfo);
                $scope.vehicleDetailsCopy = angular.copy($scope.vehicleDetails);
            }
            //for Reset
            $scope.resetVehicleDetails();

            //for wordPress
            $scope.displayIDVOption = function () {
                $scope.displayIDVLabel = "IDV  ";
                if ($scope.vehicleDetails.idvOption == 1) {
                    $scope.selectedIDV = $scope.displayIDVLabel + " - Best Deal";
                } else if ($scope.vehicleDetails.idvOption == 2) {
                    $scope.selectedIDV = $scope.displayIDVLabel + " - Your IDV";
                } else {
                    $scope.selectedIDV = $scope.displayIDVLabel + " - min IDV";
                }
            };
            // if ($rootScope.wordPressEnabled) {
            $scope.displayIDVOption();
            // }

            $scope.currentResultTab = wp_path + 'buy/bike/html/TwoWheelerComprehensiveResult.html';
            $scope.onClickResultTab = function () {
                $scope.quoteBikeInputForm.$setDirty();
                if ($scope.quoteParam.insuranceType == 1) {
                    $scope.zeroDepreciationStatus = true;
                    $scope.vehicleDetails.zeroDepreciation = "Y";
                    $scope.sortTypes = sortTypesVehicleGeneric;
                    $scope.sortType = sortTypesVehicleGeneric[0];
                    $scope.currentResultTab = wp_path + 'buy/bike/html/TwoWheelerComprehensiveResult.html';
                } else {
                    $scope.zeroDepreciationStatus = false;
                    $scope.vehicleDetails.zeroDepreciation = "N";
                    $scope.sortTypes = sortTypesVehicleThirdPartyGeneric;
                    $scope.sortType = sortTypesVehicleThirdPartyGeneric[0];
                    $scope.currentResultTab = wp_path + 'buy/bike/html/TwoWheelerThirdPartyLiabilityResult.html';
                }

                $scope.singleClickBikeQuote();
            };

            $scope.getDateForDisplay = function (selectedDate) {
                if (String(selectedDate) != "undefined") {
                    var dateArray = selectedDate.split("/");
                    var displayFutureDate = dateArray[0] + "-" + (monthListGeneric[Number(dateArray[1]) - 1]) + "-" + dateArray[2];
                    return displayFutureDate;
                }
                return "";
            };

            $scope.calcRiderAmt = function (selectedPremium) {
                if (String(selectedPremium.ridersList) != "undefined") {
                    var selectedRiderAmount = 0;
                    for (var i = 0; i < selectedPremium.ridersList.length; i++) {
                        if (selectedPremium.ridersList[i].riderValue != null)
                            selectedRiderAmount += selectedPremium.ridersList[i].riderValue;
                    }

                    return selectedRiderAmount;
                }
                return 0;
            };

            $scope.calcDiscountAmt = function (selectedPremium) {
                var selectedDiscountAmount = 0;
                for (var i = 0; i < selectedPremium.discountList.length; i++) {
                    if (selectedPremium.discountList[i].discountAmount != null)
                        selectedDiscountAmount += selectedPremium.discountList[i].discountAmount;
                }

                return selectedDiscountAmount;
            };

            $scope.getPopup = function (selectedPremium) {
                $scope.selectPremiumFromResult = selectedPremium;
                $scope.selectPremiumFromResult.selectedRiderAmount = $scope.calcRiderAmt(selectedPremium);
                $scope.selectPremiumFromResult.selectedDiscountAmount = $scope.calcDiscountAmt(selectedPremium);

                $scope.currentTab = wp_path + 'buy/bike/html/TwoWheelerPremiumBreakup.html';
            };

            $scope.modalCompare = false;
            $scope.toggleCompare = function () {
                var riderJson = {};
                $scope.consolatedRiderList = [];
                $scope.consolatedDiscountList = [];
                $scope.consolatedVoluntaryList = [];
                angular.forEach($scope.selectedCarrier, function (quote) {
                    angular.forEach(quote.ridersList, function (rider) {
                        if (riderJson[rider.riderId] == null) {
                            $scope.consolatedRiderList.push(rider);
                            riderJson[rider.riderId] = rider.riderName;
                        }
                    });
                });
                var discountJson = {};
                var discountVoluntaryJson = {};
                angular.forEach($scope.selectedCarrier, function (quote) {
                    angular.forEach(quote.discountList, function (discount) {
                        if (discountJson[discount.discountId] == null && discount.discountAmount != null && discount.discountAmount != 0) {
                            $scope.consolatedDiscountList.push(discount);
                            discountJson[discount.discountId] = discount.type;
                        } else if (discountJson[discount.discountId] == null && discount.discountAmount == 0) {
                            $scope.consolatedVoluntaryList.push(discount);
                            discountVoluntaryJson[discount.discountId] = discount.type;
                        }
                    });
                });
                $scope.modalCompare = true;
                $scope.hideModal = function () {
                    $scope.modalCompare = false;
                };
            };
            $scope.cardView = true;
            $scope.compareView = false;
            $scope.showCompareBtn = true;
            $scope.showCardBtn = true;
            $scope.disableSort = false;
            //newFunction for compare
            $scope.compareViewClick = function () {
                $scope.disableSort = false;
                $scope.dataLoaded = true;
                $scope.slickLoaded = true;
                $scope.cardView = true;
                $scope.compareView = false;
                $scope.showCompareBtn = true;
                $scope.showCardBtn = true;
            };
            $scope.cardViewClick = function () {
                console.log("inside cardViewClick")
                var riderJson = {};
                $scope.consolatedRiderList = [];
                $scope.consolatedDiscountList = [];
                $scope.consolatedVoluntaryList = [];
                angular.forEach($rootScope.bikeQuoteResult, function (quote) {
                    angular.forEach(quote.ridersList, function (rider) {
                        if (riderJson[rider.riderId] == null) {
                            $scope.consolatedRiderList.push(rider);
                            riderJson[rider.riderId] = rider.riderName;
                        }
                    });
                });
                var discountJson = {};
                var discountVoluntaryJson = {};
                angular.forEach($rootScope.bikeQuoteResult, function (quote) {
                    angular.forEach(quote.discountList, function (discount) {
                        if (discountJson[discount.discountId] == null && discount.discountAmount != null && discount.discountAmount != 0) {
                            $scope.consolatedDiscountList.push(discount);
                            discountJson[discount.discountId] = discount.type;
                        } else if (discountJson[discount.discountId] == null && discount.discountAmount == 0) {
                            $scope.consolatedVoluntaryList.push(discount);
                            discountVoluntaryJson[discount.discountId] = discount.type;
                        }
                    });
                });
                $scope.dataLoaded = true;
                $scope.slickLoaded = true;
                $scope.cardView = false;
                $scope.compareView = true;
                $scope.showCompareBtn = true;
                $scope.showCardBtn = true;
                $scope.disableSort = true;
            };

            setTimeout(function () {
                var maxInstantHeight = -1;

                $('.minheight_health').each(function () {
                    maxInstantHeight = maxInstantHeight > $(this).height() ? maxInstantHeight : $(this).height();
                });

                $('.minheight_health').each(function () {
                    $(this).css('height', maxInstantHeight);
                });
            }, 200);

            $scope.findRider = function (riderId, selData) {
                var returnRidervalue = "NA";
                if (!selData) {
                    returnRidervalue = "NA";
                }
                if (selData) {
                    for (var i = 0; i < selData.length; i++) {
                        if (selData[i].riderId == riderId) {
                            if (!selData[i].riderValue) {
                                selData[i].riderValue = "NA"
                            }
                            returnRidervalue = selData[i].riderValue;
                        }
                    }
                }
                return returnRidervalue;
            }
            $scope.findVoluntaryDiscount = function (discountId, selData) {
                var returnvalue = "NA";
                if (!selData) {
                    returnvalue = "NA";
                }
                if (selData) {
                    for (var i = 0; i < selData.length; i++) {
                        if (selData[i].discountId == discountId) {
                            if (!selData[i].discountAmount) {
                                selData[i].discountAmount = "NA"
                            }
                            returnvalue = selData[i].discountAmount;
                        }
                    }
                }
                return returnvalue;
            }
            $scope.findDiscount = function (discountId, selData) {
                var returnDiscountvalue = "NA";
                if (!selData) {
                    returnDiscountvalue = "NA";
                }
                if (selData) {
                    for (var i = 0; i < selData.length; i++) {
                        if (selData[i].discountId == discountId) {
                            if (!selData[i].discountAmount) {
                                selData[i].discountAmount = "NA"
                            }
                            returnDiscountvalue = selData[i].discountAmount;
                        }
                    }
                }
                return returnDiscountvalue;
            }

            $scope.modalVehicleRegistration = false;
            $scope.toggleVehicleRegistrationPopup = function (regAreaStatus) {
                $rootScope.selectedRegData = "";
                $rootScope.vehicleDetails.registrationNumber = "";
                $scope.quoteBikeInputForm.$setDirty();

                if (regAreaStatus == false) {
                    $scope.modalVehicleRegistration = false;
                    $rootScope.showBikeRegAreaStatus = false;
                } else if (regAreaStatus == true) {
                    $scope.modalVehicleRegistration = true;
                    $rootScope.showBikeRegAreaStatus = true;
                }

                $scope.hideModal = function () {
                    $scope.modalVehicleRegistration = false;
                };

                setTimeout(function () {
                    $('.clickMetro').css('height', '50px');
                    $('.showMetro').hide();
                }, 100);
                setTimeout(function () {
                    $('.clickMetro').click(function () {
                        $('.showMetro').hide();
                        $(this).find('.showMetro').show();
                        $('.thumbnail').removeClass('RToButtonActive');
                        $('.thumbnail').addClass('RToButton');
                        $(this).find('.thumbnail').addClass('RToButtonActive');
                        var getHeight = $(this).find('.showMetro').height();
                        $('.clickMetro').css('height', '50px');
                        $(this).css('height', getHeight + 50);
                    });
                }, 2000);
            };

            $scope.hideStatus = true;
            $scope.oldMetroSelected = makeObjectEmpty($scope.oldMetroSelected, "array");
            $scope.selectedMetroRTO = function (metrosRTOList) {
                $scope.metros = metrosRTOList;
                if ($scope.oldMetroSelected == metrosRTOList) {
                    $scope.hideStatus = true;
                    $scope.oldMetroSelected = makeObjectEmpty($scope.oldMetroSelected, "array");
                    setTimeout(function () {
                        $('.clickMetro').css('height', '50px');
                        $('.showMetro').hide();
                        $('.thumbnail').addClass('RToButton');
                    }, 100);
                } else {
                    $scope.hideStatus = false;
                    $scope.oldMetroSelected = metrosRTOList;
                }
                if ($scope.metros.RTODetails.length % 3 == 2) {
                    $scope.dummyLength = 1;
                } else if ($scope.metros.RTODetails.length % 3 == 1) {
                    $scope.dummyLength = 2;
                } else {
                    $scope.dummyLength = 0;
                }
            };

            // Method call to get default list form central DB.
            $scope.getRegPlaceListRTO = function (regNumber, registrationNumber) {
                if (regNumber.indexOf('-') > 0)
                    regNumber = regNumber.replace('-', '');
                return $http.get(getServiceLink + $scope.p365Labels.documentType.RTODetails + "&q=" + regNumber).then(function (callback) {
                    callback = JSON.parse(callback.data);
                    if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                        $rootScope.selectedBikeRegistrationObject = callback.data[0];
                        $rootScope.vehicleDetails.registrationNumber = registrationNumber.trim();
                        $scope.vehicleInfo.registrationNumber = $rootScope.vehicleDetails.registrationNumber;

                        //added new
                        var registrationDetails = {};
                        registrationDetails.registrationNumber = $scope.vehicleInfo.registrationNumber;
                        localStorageService.set("bikeRegistrationDetails", registrationDetails);

                        var rtoDetail = {};
                        rtoDetail.rtoName = $rootScope.selectedBikeRegistrationObject.display;
                        rtoDetail.rtoCity = $rootScope.selectedBikeRegistrationObject.city;
                        rtoDetail.rtoState = $rootScope.selectedBikeRegistrationObject.state;
                        rtoDetail.rtoObject = callback.data[0];
                        rtoDetail.cityStatus = true;
                        rtoDetail.rtoStatus = true;
                        getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
                            if (resultedRTOInfo.responseCode == $scope.p365Labels.responseCode.success) {
                                rtoDetail.pincode = resultedRTOInfo.data[0].pincode;

                                if (localStorageService.get("bikeRegAddress")) {
                                    localStorageService.get("bikeRegAddress").pincode = rtoDetail.pincode;
                                    localStorageService.get("bikeRegAddress").city = $rootScope.selectedBikeRegistrationObject.city;
                                    localStorageService.get("bikeRegAddress").state = $rootScope.selectedBikeRegistrationObject.state;
                                } else {
                                    var getCity = {};
                                    getCity.pincode = rtoDetail.pincode;
                                    getCity.city = $rootScope.selectedBikeRegistrationObject.city;
                                    getCity.state = $rootScope.selectedBikeRegistrationObject.state;
                                    //getCity.cityStatus = true;
                                    localStorageService.set("bikeRegAddress", getCity);
                                }
                            } else {
                                rtoDetail.pincode = "";
                                if (localStorageService.get("bikeRegAddress")) {
                                    localStorageService.get("bikeRegAddress").pincode = rtoDetail.pincode;
                                    localStorageService.get("bikeRegAddress").city = $rootScope.selectedBikeRegistrationObject.city;
                                    localStorageService.get("bikeRegAddress").state = $rootScope.selectedBikeRegistrationObject.state;
                                } else {
                                    var getCity = {};
                                    getCity.pincode = rtoDetail.pincode;
                                    getCity.city = $rootScope.selectedBikeRegistrationObject.city;
                                    getCity.state = $rootScope.selectedBikeRegistrationObject.state;
                                    localStorageService.set("bikeRegAddress", getCity);
                                }
                            }
                            //added new
                            localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
                            $rootScope.vehicleInfo.registrationPlace = rtoDetail.rtoName;
                        });

                        $scope.quoteBikeInputForm.$setDirty();
                        $rootScope.viewOptionDisabled = true;
                        if ($scope.vehicleInfo.make && $scope.vehicleInfo.model && $scope.vehicleInfo.variant) {
                            if($scope.vehicleDetails.displayVehicle){
                            $scope.selectedItem.displayVehicle = $scope.vehicleDetails.displayVehicle;
                            }else{
                                $scope.selectedItem.displayVehicle =  $scope.vehicleInfo.make+" "+" "+$scope.vehicleInfo.model+" "+" "+$scope.vehicleInfo.variant ;  
                            }
                        } else {
                            $scope.selectedItem = {};
                        }

                    } else {
                        $rootScope.regNumStatus = true;
                    }
                });
            };


            $scope.getRegNumber = function (registrationNumber) {
                if (String(registrationNumber) != "undefined") {
                    var registrationDetails = {};
                    registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
                    $scope.vehicleDetails = localStorageService.get("selectedBikeDetails");
                    $scope.vehicleDetails.engineNumber = '';
                    $scope.vehicleDetails.chassisNumber = '';
                    $scope.vehicleDetails.isregNumberDisabled = true;
                    localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);

                    //flag for disabling chasis number,engine number,reg number
                    $rootScope.isChasisNumber = false;
                    $rootScope.isEngineNumber = false;
                    $rootScope.isregNumber = false;

                    if ((registrationNumber.trim()).match(/([a-zA-Z]{2}[0-9]{1,2}[a-zA-Z]{0,3}[0-9]{1,4})/g) && (registrationNumber.trim()).length <= 11 && (registrationNumber.trim()).length > 4) {

                        $rootScope.regNumStatus = false;
                        $scope.fetchingBike = true;
                        if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
                            $scope.vehicleInfo.dateOfRegistration = makeObjectEmpty($scope.vehicleInfo.dateOfRegistration, "text");
                        }

                        $scope.selectedItem = {};

                        registrationDetails.registrationNumber = registrationNumber;
                        localStorageService.set("bikeRegistrationDetails", registrationDetails);


                        //$scope.vehicleDetails.idvOption = 1;
                        $scope.vehicleInfo.IDV = 0;
                        $rootScope.bikeAddOnCoversList.selectedAddOnCovers = [];

                        var request = {};
                        request.registrationNumber = registrationNumber.toUpperCase();
                        request.lob = "bike";
                        request.requestType = 'VEHICLERTOREQCONFIG';
                        RestAPI.invoke($scope.p365Labels.transactionName.getVehicleRTODetails, request).then(function (callback) {
                            if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                if (callback.data) {
                                    var vehicleRTODetails = callback.data;
                                    if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
                                        if (vehicleRTODetails.registrationYear) {
                                            var selectedRegYear = vehicleRTODetails.registrationYear;
                                           // $scope.vehicleInfo.regYear = selectedRegYear.trim();
                                           $scope.vehicleDetails.regYear = selectedRegYear.trim();
                                           $scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
                                            //$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleInfo.regYear;
                                            //$scope.validateRegistrationDate();
                                        } if (vehicleRTODetails.dateOfRegistration){
                                            $scope.vehicleInfo.dateOfRegistration = vehicleRTODetails.dateOfRegistration;
                                        }
                                    }
                                    // if (vehicleRTODetails.variantId) {
                                    //    // $scope.vehicleInfo.variantId = vehicleRTODetails.variantId.trim();
                                    //     $scope.vehicleDetails.variantId = vehicleRTODetails.variantId.trim();
                                    // }

                                    if (vehicleRTODetails.vechileIdentificationNumber) {
                                        $scope.vehicleDetails.chassisNumber = vehicleRTODetails.vechileIdentificationNumber;
                                    }
                                    if (vehicleRTODetails.engineNumber) {
                                        $scope.vehicleDetails.engineNumber = vehicleRTODetails.engineNumber;
                                    }
                                    $scope.selectedItem.displayVehicle= "";
                                    if(vehicleRTODetails.make && vehicleRTODetails.model && vehicleRTODetails.variant){
                                        $scope.vehicleInfo.make = vehicleRTODetails.make;
                                        $scope.vehicleInfo.model = vehicleRTODetails.model;
                                        $scope.vehicleInfo.variant = vehicleRTODetails.variant;
                                        if (vehicleRTODetails.displayVehicle) {
                                            $scope.selectedItem.displayVehicle = vehicleRTODetails.displayVehicle;
                                        } else {
                                            $scope.selectedItem.displayVehicle = vehicleRTODetails.make && vehicleRTODetails.model && vehicleRTODetails.variant;
                                        }
                                    }else{
                                        $scope.vehicleInfo.make ="";
                                        $scope.vehicleInfo.model = "";
                                        $scope.vehicleInfo.variant = "";
                                    } 
                                    $scope.fetchingBike = false;
                                    var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
                                    $scope.getRegPlaceListRTO(regNumber, registrationNumber);
                                } else {
                                    $scope.fetchingBike = false;
                                    $scope.selectedItem.displayVehicle = "";
                                   // $scope.vehicleInfo.displayVehicle = "";
                                  // $scope.vehicleInfo.regYear = "";
                                    var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
                                    $scope.getRegPlaceListRTO(regNumber, registrationNumber);
                                }
                            } else {
                                $scope.fetchingBike = false;
                                $scope.selectedItem.displayVehicle = "";
                               // $scope.vehicleInfo.displayVehicle = "";
                                //$scope.vehicleInfo.regYear = "";
                                var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
                                $scope.getRegPlaceListRTO(regNumber, registrationNumber);
                            }
                        });
                    } else {
                        $rootScope.regNumStatus = true;
                    }
                } else {
                    $rootScope.regNumStatus = true;
                }
            };

            // Method to get list of cities from DB.
            $scope.getRegPlaceList = function (cityName) {
                if (cityName.indexOf('-') > 0)
                    cityName = cityName.replace('-', '');
                return $http.get(getServiceLink + $scope.p365Labels.documentType.RTODetails + "&q=" + cityName).then(function (response) {
                    return JSON.parse(response.data).data;
                });
            };

            $scope.onSelect = function (item) {
                $scope.modalVehicleRegistration = false;
                $rootScope.selectedBikeRegistrationObject = item;
                $scope.vehicleInfo.registrationPlace = item.display;
                var rtoDetail = {};
                rtoDetail.rtoName = item.display;
                rtoDetail.rtoCity = item.city;
                rtoDetail.rtoState = item.state;
                rtoDetail.rtoStatus = true;

               // $scope.vehicleDetails.idvOption = 1;
               $scope.vehicleInfo.IDV = 0;
               $rootScope.bikeAddOnCoversList.selectedAddOnCovers = [];

                getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
                    if (resultedRTOInfo.responseCode == $scope.p365Labels.responseCode.success) {
                        rtoDetail.rtoPincode = resultedRTOInfo.data[0].pincode;

                        if (localStorageService.get("bikeRegAddress")) {
                            localStorageService.get("bikeRegAddress").pincode = rtoDetail.pincode;
                            localStorageService.get("bikeRegAddress").city = $rootScope.selectedBikeRegistrationObject.city;
                            localStorageService.get("bikeRegAddress").state = $rootScope.selectedBikeRegistrationObject.state;
                        } else {
                            var getCity = {};
                            getCity.pincode = rtoDetail.rtoPincode;
                            getCity.city = $rootScope.selectedBikeRegistrationObject.city;
                            getCity.state = $rootScope.selectedBikeRegistrationObject.state;
                            localStorageService.set("bikeRegAddress", getCity);
                        }
                    } else {
                        rtoDetail.rtoPincode = "";
                        if (localStorageService.get("bikeRegAddress")) {
                            localStorageService.get("bikeRegAddress").pincode = rtoDetail.rtoPincode;
                            localStorageService.get("bikeRegAddress").city = $rootScope.selectedBikeRegistrationObject.city;
                            localStorageService.get("bikeRegAddress").state = $rootScope.selectedBikeRegistrationObject.state;
                        } else {
                            var getCity = {};
                            getCity.pincode = rtoDetail.pincode;
                            getCity.city = $rootScope.selectedBikeRegistrationObject.city;
                            getCity.state = $rootScope.selectedBikeRegistrationObject.state;
                            localStorageService.set("bikeRegAddress", getCity);
                        }
                    }
                    $scope.quoteBikeInputForm.$setDirty();
                    $scope.quoteBikeInputForm.bikeInputForm.$setDirty();
                });
                 localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
                $scope.vehicleInfo.registrationPlace = item.display;
                $rootScope.vehicleDetails.registrationNumber = '';
            };

            $scope.setRangePrevPolicyExpiryDate = function () {
                // Setting properties for previous policy expiry date-picker.
                //Yogesh-25052017: Based on discussion with uday, minimum date must start by today. Hence minimum date limit been changed from +1 to 0.
                //Yogesh-12072017: Based on discussion with uday, minimum date limit must depend upong previous policy expiry status. maximum date limit should not be in future if policy is already expired.
                var prevPolExpDateOption = {};
                if ($scope.vehicleDetails.policyStatus.key == 1) {
                    prevPolExpDateOption.minimumDateStringFormat = $scope.vehicleInfo.dateOfRegistration;
                    prevPolExpDateOption.maximumDateStringFormat = $scope.vehicleDetails.policyStatus.expiryDate;
                } else if ($scope.vehicleDetails.policyStatus.key == 2) {
                    prevPolExpDateOption.minimumDayLimit = -90;
                    prevPolExpDateOption.maximumDayLimit = -1;
                } else {
                    prevPolExpDateOption.minimumDayLimit = 0;
                    prevPolExpDateOption.maximumDayLimit = 60;
                }
                prevPolExpDateOption.changeMonth = true;
                prevPolExpDateOption.changeYear = true;
                prevPolExpDateOption.dateFormat = "dd/mm/yy";
                $scope.previousPolicyExpiryDateOptions = setP365DatePickerProperties(prevPolExpDateOption);
                
                $scope.odPolicyExpiryDate = setP365DatePickerProperties(prevPolExpDateOption);
                if($scope.vehicleInfo.TPPolicyExpiryDate){
                var prevPolExpDateOption = {};
                prevPolExpDateOption.minimumDateStringFormat = $scope.vehicleInfo.PreviousPolicyExpiryDate;
                $scope.tpPolicyExpiryDate = setP365DatePickerProperties(prevPolExpDateOption);
                }
                
                
        }

            $scope.changePolStatus = function () {
                if ($location.search().isForRenewal) {
                    if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
                        $scope.renewal = true;
                        //$scope.calculatedVehicleExpiryDate = $scope.vehicleDetails.policyStatus.displayText2;
                        $scope.setRangePrevPolicyExpiryDate();
                    } else {
                        $scope.renewal = false;
                        if(!$rootScope.flag )
                        $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                        //$scope.calculatedVehicleExpiryDate = "";
                    }
                } else {
                    if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
                        $scope.renewal = true;
                        if(!$rootScope.flag )
                        $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;
                        //$scope.calculatedVehicleExpiryDate = $scope.vehicleDetails.policyStatus.displayText2;

                        $scope.setRangePrevPolicyExpiryDate();
                    } else {
                        $scope.renewal = false;
                        if(!$rootScope.flag )
                        $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                        //$scope.calculatedVehicleExpiryDate = "";
                    }
                }
                  if($scope.quoteParam.policyType = "renew"){
                    if ($scope.vehicleDetails.policyStatus.key == 3) {
                        $scope.vehicleDetails.previousPolicyExpired = "N";
                    } else {
                        $scope.vehicleDetails.previousPolicyExpired = "Y";
                    }
                }

            };

            $scope.changeExpiryDate = function () {
                if (String($scope.vehicleDetails.policyExpiryDate) !== "undefined") {
                    convertDateFormatToString($scope.vehicleDetails.policyExpiryDate, function (formattedPolicyExpiryDate) {
                        var futureDate = new Date();
                        futureDate = new Date((futureDate.setDate(futureDate.getDate() + Number(30))));

                        var policyExpiryDate = formattedPolicyExpiryDate.split("/");
                        var tempPolicyExpiryDate = policyExpiryDate[1] + "/" + policyExpiryDate[0] + "/" + policyExpiryDate[2];

                        if (new Date(tempPolicyExpiryDate) < new Date() || new Date(tempPolicyExpiryDate) > futureDate) {
                            $scope.vehicleDetails.policyExpiryDate = new Date();
                        }

                        convertDateFormatToString($scope.vehicleDetails.policyExpiryDate, function (formattedPolicyExpiryDate) {
                            //$scope.calculatedVehicleExpiryDate = $scope.getDateForDisplay(formattedPolicyExpiryDate);

                        });
                    });
                }
            };
            $scope.alterRenewal = function () {
                var todayDate = new Date();
                if ($scope.vehicleDetails.insuranceType.type != $scope.bikeInsuranceTypes[1].type) {
                    $scope.polStatus = false;
                    $scope.renewal = false;

                    //$scope.vehicleInfo.regYear = todayDate.getFullYear().toString();
                    $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                    $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                    $scope.selectedYear = $scope.manufacturingYearList[0];
                    //$scope.vehicleInfo.regYear = $scope.manufacturingYearList[0];
                    $scope.vehicleDetails.regYear = todayDate.getFullYear().toString();
                    if(!$rootScope.flag ){
                    $scope.vehicleInfo.dateOfRegistration = ("0" + todayDate.getDate().toString()).substr(-2) + "/" + ("0" + (Number(todayDate.getMonth()) + 1).toString()).substr(-2) + "/" + $scope.vehicleDetails.regYear;
                    $scope.vehicleDetails.PreviousPolicyStartDate = makeObjectEmpty($scope.vehicleDetails.PreviousPolicyStartDate, "text");
                    $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                    $scope.vehicleInfo.ODPolicyExpiryDate = $scope.vehicleInfo.PreviousPolicyExpiryDate;
                    }
                    if ($scope.quoteParam.onlyODApplicable != undefined) {
                        if ($scope.quoteParam.onlyODApplicable == false || $scope.quoteParam.onlyODApplicable == true) {
                            delete $scope.quoteParam.onlyODApplicable;
                        }
                    }
                } else {
                    $scope.polStatus = true;
                    $scope.renewal = true;
                    $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                    $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                    // if (!$scope.quoteParam.onlyODApplicable) {
                    //     $scope.quoteParam.onlyODApplicable = false;
                    // }
                    //$scope.manufacturingYearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
                    var current_Year = Number(todayDate.getFullYear());
                    if(!$rootScope.flag ){
                    if (current_Year == $scope.vehicleDetails.regYear) {
                        $scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleDetails.regYear;
                    } else {
                        $scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
                    }
                    convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPolicyExpiryDate) {
                        var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPolicyExpiryDate));
                        var tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
                        tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));

                        convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
                            $scope.vehicleDetails.PreviousPolicyStartDate = formattedPrevPolStartDate;
                          
                        });

                    });
                    $scope.quoteParam.policyType = $scope.vehicleDetails.insuranceType.value;
                }

              
            }
                $scope.changePolStatus();
            };

            $scope.alterRenewal();

            $scope.cancelVehicleInfoChange = function () {
                $rootScope.viewOptionDisabled = false;
                angular.copy($scope.vehicleInfoCopy, $scope.vehicleInfo);
                angular.copy($scope.vehicleDetailsCopy, $scope.vehicleDetails);

                $scope.quoteBikeInputForm.bikeInputForm.$setPristine();

            };

            // Setting carrier logo list

            $scope.modalPreviewReport = false;
            $scope.togglePreviewReport = function () {
                $scope.modalPreviewReport = !$scope.modalPreviewReport;
                $scope.hideModal = function () {
                    $scope.modalPreviewReport = false;
                };
            };

            $scope.modalMoreDetails = false;
            $scope.toggleMoreDetails = function () {
                $scope.modalMoreDetails = !$scope.modalMoreDetails;
                $scope.hideModal = function () {
                    $scope.modalMoreDetails = false;
                };
            };

            $scope.updateSort = function (sortOption) {
                $scope.activeSort = sortOption.key;
                $scope.selectedSortOption = sortOption;
                if (sortOption.key == 1) {
                    $scope.sortKey = "grossPremium";
                    $scope.sortReverse = false;
                } else if (sortOption.key == 2) {
                    $scope.sortKey = "insuredDeclareValue";
                    $scope.sortReverse = true;
                } else if (sortOption.key == 3) {
                    $scope.sortKey = "insurerIndex";
                    $scope.sortReverse = true;
                }
                $scope.toggleState();
            };

            $scope.toggleSortOrder = false;
            $scope.updateSortOrder = function () {
                $scope.toggleSortOrder = !$scope.toggleSortOrder;
                if ($scope.selectedSortOption.key == 1) {
                    $scope.sortKey = "grossPremium";
                    $scope.sortReverse = $scope.toggleSortOrder;
                } else if ($scope.selectedSortOption.key == 2) {
                    $scope.sortKey = "insuredDeclareValue";
                    $scope.sortReverse = $scope.toggleSortOrder;
                } else if ($scope.selectedSortOption.key == 3) {
                    $scope.sortKey = "insurerIndex";
                    $scope.sortReverse = $scope.toggleSortOrder;
                }
            };

            $scope.checkForEdit = function () {
                if ($rootScope.showBikeRegAreaStatus == false && (String($rootScope.vehicleDetails.registrationNumber) === "undefined" || String($rootScope.vehicleDetails.registrationNumber).length < 6)) {
                    $rootScope.regNumStatus = true;
                } else {
                    $rootScope.regNumStatus = false;
                }

                if ($scope.vehicleDetails.idvOption == 2) {
                    if ($scope.vehicleInfo.IDV >= $scope.minIDVSuggested && $scope.vehicleInfo.IDV <= $scope.maxIDVSuggested) {
                        userIdvStatus = false;
                        $scope.userIDVError = false;
                    } else {
                        userIdvStatus = true;
                        $scope.userIDVError = true;
                    }
                }
            };
            $scope.isMinPremium = function (grossPremiumValue, carrierIDValue) {
                var min = $rootScope.bikeQuoteResult[0].grossPremium;

                for (var i = 0; i <= $rootScope.bikeQuoteResult.length - 1; i++) {
                    var carrierIdMin = $rootScope.bikeQuoteResult[i].carrierId;
                    if (Number($rootScope.bikeQuoteResult[i].grossPremium) < min) {
                        min = $rootScope.bikeQuoteResult[i].grossPremium;
                        carrierIDValue = carrierIdMin;
                    }
                }
                if (min === grossPremiumValue) {
                    $scope.selMinCarrierId = carrierIDValue;
                    return true;
                } else {
                    return false;
                }
            };

            $scope.toggleChangeClose = function () {
                $rootScope.viewOptionDisabled = false;
                angular.copy($scope.vehicleInfoCopy, $scope.vehicleInfo);
                angular.copy($scope.vehicleDetailsCopy, $scope.vehicleDetails);
                $scope.quoteBikeInputForm.bikeInputForm.$setPristine();

            };

            //function created to display carrier if premium > 0.
            $scope.validatePremium = function (data) {
                if (Number(data.netPremium) > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.validateInsurancePlanType = function (data) {
                var returnvalue = false;
                if (data.policyType == 'new') {
                    if ($rootScope.selectedInsuranceType == 'comprehensive' && data.comprehensive) {
                        returnvalue = true;
                    } else if ($rootScope.selectedInsuranceType == 'liability' && data.liability) {
                        returnvalue = true;
                    } else {
                        returnvalue = false;
                    }
                } else if (data.policyType == 'renew') {
                    returnvalue = true;
                }else if (data.policyType == 'odonly') {
                    returnvalue = true;
                } else {
                    returnvalue = false;
                }
                return returnvalue;
            }

            $scope.submitPACoverDetails = function (key) {
                $scope.PACoverModal = false;
                $scope.BikePACoverDetails[key] = true;

                if($scope.quoteParam.riders){
                    for (var j = 0; j < $scope.quoteParam.riders.length; j++) {
    
                        if($scope.quoteParam.riders[j].riderName == "Personal Accident Cover")
                        $scope.quoteParam.riders.splice(j,1);
                        $scope.PACoverFlag = 0;
    
                    }
                }

               // $scope.ispACoverapplicable = false ;
    

             //   localStorageService.set("BikePACoverDetails", $scope.BikePACoverDetails);
                $scope.singleClickBikeQuote();
            }

            $scope.planTypeError = false;
            $scope.submitInsuranceType = function (policyType) {
                if ((policyType == $scope.insuranceTypeList[0].value) && $rootScope.ownDamageValidity.length == 0) {
                    $scope.planTypeError = true;
                } else if ($scope.BikePACoverDetails.isPACoverApplicable && $rootScope.personalAccidentValidity.length == 0) {
                    $scope.planTypeError = true;
                } else {
                    $scope.planTypeError = false;
                    $scope.insuranceTypeModal = false;
                    $scope.filterResult(policyType);
                }
            }
            $scope.filterResult = function (policyType) {
                $rootScope.selectedInsuranceType = policyType;
                localStorageService.set("selectedInsuranceType", policyType);
                if ($scope.quoteParam.policyType == 'new') {
                    $rootScope.bikeQuotePolicyType = $rootScope.bikeQuoteResultCopy;
                    $rootScope.bikeQuoteResult = [];
                    if (policyType == $scope.insuranceTypeList[0].value) {
                        for (var i = 0; i < $rootScope.bikeQuotePolicyType.length; i++) {
                            if ($rootScope.bikeQuotePolicyType[i][policyType]) {

                                if ($scope.BikePACoverDetails.isPACoverApplicable) {
                                    if ($rootScope.ownDamageValidity.indexOf($rootScope.bikeQuotePolicyType[i]['ownDamagePolicyTerm']) != -1 && $rootScope.thirdPartyDamageValidity.indexOf($rootScope.bikeQuotePolicyType[i]['liabilityPolicyTerm']) != -1 && $rootScope.personalAccidentValidity.indexOf($rootScope.bikeQuotePolicyType[i]['PACover']) != -1) {
                                        $rootScope.bikeQuoteResult.push($rootScope.bikeQuotePolicyType[i]);
                                    }
                                } else {
                                    if ($rootScope.ownDamageValidity.indexOf($rootScope.bikeQuotePolicyType[i]['ownDamagePolicyTerm']) != -1 && $rootScope.thirdPartyDamageValidity.indexOf($rootScope.bikeQuotePolicyType[i]['liabilityPolicyTerm']) != -1) {
                                        $rootScope.bikeQuoteResult.push($rootScope.bikeQuotePolicyType[i]);
                                    }
                                }
                            }
                        }
                    } else if (policyType == $scope.insuranceTypeList[1].value) {
                        for (var i = 0; i < $rootScope.bikeQuotePolicyType.length; i++) {
                            if ($rootScope.bikeQuotePolicyType[i][policyType]) {
                                for (var j = 0; j < $rootScope.thirdPartyDamageValidity.length; j++) {
                                    if ($rootScope.bikeQuotePolicyType[i]['liabilityPolicyTerm'] == $rootScope.thirdPartyDamageValidity[j]) {
                                        $rootScope.bikeQuoteResult.push($rootScope.bikeQuotePolicyType[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //for filter results
            setTimeout(function () {
                $rootScope.bikeQuoteResultCopy = $rootScope.bikeQuoteResult;
                if ($scope.quoteParam.policyType == 'new') {
                    $rootScope.ownDamageValidity = [1, 5];
                    $scope.PACoverValidity($scope.BikePACoverDetails.isPACoverApplicable);
                    $scope.filterResult($rootScope.selectedInsuranceType);
                }
            }, 100);


            // Changes for idv button	-	modification-0001
            $scope.toggleIDVChangeClose = function () {
                //$scope.vehicleInfo.IDV = localStorageService.get("bikeQuoteInputParamaters").IDV;
                $scope.vehicleInfo.IDV = localStorageService.get("selectedBikeDetails").IDV;
                $scope.vehicleDetails.idvOption = angular.copy($rootScope.idvOptionCopy);
                //added for wordPress if idv option is 2,displaying your idv pop-up.
                // if ($rootScope.wordPressEnabled) {
                $scope.displayIDVOption();
                $scope.idvDetailsModal = false;
                // }
            }

            //function to set IDV when user enters wrong values		
            $scope.validateUserIDV = function () {
                if (Number($scope.vehicleInfo.IDV) < $scope.minIDVSuggested || Number($scope.vehicleInfo.IDV) > $scope.maxIDVSuggested) {
                    $scope.userIDVError = true;
                    $scope.quoteBikeInputForm.$setDirty();
                } else {
                    $scope.userIDVError = false;
                }
            }

            $scope.updateIDVRange = function () {
                for(var i=0 ; i < $rootScope.bikeQuoteResult.length ; i++){
                    $rootScope.bikeQuoteResult[i].minIdvValue=Number($rootScope.bikeQuoteResult[i].minIdvValue);
                    $rootScope.bikeQuoteResult[i].maxIdvValue=Number($rootScope.bikeQuoteResult[i].maxIdvValue);
                }
                console.log('$rootScope.bikeQuoteResult in updateIDVRange',$rootScope.bikeQuoteResult);   
                if ($scope.vehicleDetails.idvOption == 2) {
                    $rootScope.bikeQuoteResultMin = $filter('orderBy')($rootScope.bikeQuoteResult, 'minIdvValue');
                    $rootScope.bikeQuoteResultMax = $filter('orderBy')($rootScope.bikeQuoteResult, '-maxIdvValue');
                    console.log('$rootScope.bikeQuoteResultMin[0] is : ',$rootScope.bikeQuoteResultMin[0]);
                    $scope.minIDVSuggested = parseFloat($rootScope.bikeQuoteResultMin[0].minIdvValue).toFixed(0)
                    $scope.maxIDVSuggested = parseFloat($rootScope.bikeQuoteResultMax[0].maxIdvValue).toFixed(0)
                } else if ($scope.vehicleDetails.idvOption == 3) {
                    $rootScope.bikeQuoteResult = $filter('orderBy')($rootScope.bikeQuoteResult, 'minIdvValue');
                    $scope.minIDVSuggested = parseFloat($rootScope.bikeQuoteResult[0].minIdvValue).toFixed(0)
                    $scope.maxIDVSuggested = parseFloat($rootScope.bikeQuoteResult[0].maxIDV).toFixed(0)
                    if ($scope.vehicleInfo.IDV == 0) {
                        $scope.vehicleInfo.IDV = $scope.minIDVSuggested;
                    }
                    console.log('$scope.minIDVSuggested is: ',$scope.minIDVSuggested);
                    console.log('$scope.maxIDVSuggested is: ',$scope.maxIDVSuggested);
                }
            }

            $scope.updateUserIDV = function () {
                // if ($rootScope.wordPressEnabled) {
                $scope.displayIDVOption();
                $scope.showIDVPopUp = false;
                // }
                if ($scope.vehicleDetails.idvOption == 2) {
                    $scope.showIDVPopUp = true;
                    $scope.quoteBikeInputForm.$setDirty();
                    $scope.updateIDVRange();
                    $scope.vehicleInfo.IDV= $scope.minIDVSuggested;
                    if (Number($scope.vehicleInfo.IDV) < $scope.minIDVSuggested || Number($scope.vehicleInfo.IDV) > $scope.maxIDVSuggested) {
                        $scope.userIDVError = true;
                    } else {
                        $scope.userIDVError = false;
                    }
                } else if ($scope.vehicleDetails.idvOption == 3) {
                    $scope.updateIDVRange();
                    $scope.vehicleInfo.IDV = $scope.minIDVSuggested;
                    // if (!$rootScope.isFromProfessionalJourney) {
                    $scope.quoteBikeInputForm.$setDirty();
                    $scope.singleClickBikeQuote();
                    // }
                } else {
                    $scope.userIDVError = false;
                    $scope.showIDVPopUp = false;
                    // if (!$rootScope.isFromProfessionalJourney) {
                    $scope.quoteBikeInputForm.$setDirty();
                    $scope.singleClickBikeQuote();
                    // }
                }
            }

            //added to update IDV range on back-button
            if ($scope.vehicleDetails.idvOption == 2 || $scope.vehicleDetails.idvOption == 3) {
                $scope.updateIDVRange();
            }

            $rootScope.editForMobile = function () {
                $rootScope.showonEdit = "inline !important";
                $rootScope.hideonEdit = "none !important";
                $scope.flagforMobile = true;
            }

            var setChangeFlag = true;
            $scope.toggleChange = function () {
                if ($rootScope.showCarRegAreaStatus == false && (String($rootScope.vehicleDetails.registrationNumber) === "undefined" || String($rootScope.vehicleDetails.registrationNumber).length < 6)) {
                    $rootScope.regNumStatus = true;
                } else {
                    $rootScope.regNumStatus = false;
                }
                //idv will be reset to default only if registration number or make/model changes 
                $scope.vehicleDetails.idvOption = 1;
                $scope.vehicleInfo.IDV = 0;
            
                // if ($scope.quoteParam.riders) {
                //     $scope.vehicleInfo.previousPolicyZeroDepStatus = false;
                //     $scope.vehicleInfo.previousPolicyInvoiceCoverStatus = false;
                // }
                //added for wordPress-as on vehicle input change we resetting idv to best deal,hiding idv popup. 
                if ($rootScope.wordPressEnabled) {
                    $scope.showIDVPopUp = false;
                    $scope.OdOnlyModal = false;
                }
               
                    var prevPolExpDateOption = {};
                    $scope.vehicleInfo.TPPolicyExpiryDat = $scope.vehicleInfo.PreviousPolicyExpiryDate;
                    prevPolExpDateOption.minimumDayLimit = $scope.vehicleInfo.PreviousPolicyExpiryDate;
                    prevPolExpDateOption.changeMonth = true;
                    prevPolExpDateOption.changeYear = true;
                    prevPolExpDateOption.dateFormat = "dd/mm/yy";
                    $scope.tpPolicyExpiryDate = setP365DatePickerProperties(prevPolExpDateOption);
                    convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPrevpolicyExpirytDate) {
                        convertStringFormatToDate($scope.vehicleInfo.TPPolicyExpiryDate, function (formattedTPpolicyExpiryDate) {
                           
                                var selPrevpolicyExpirytDate = angular.copy(formattedPrevpolicyExpirytDate);
                                var tempCalcTPPolicyExpiryDate = new Date(selPrevpolicyExpirytDate.setFullYear(selPrevpolicyExpirytDate.getFullYear()));
                                tempCalcTPPolicyExpiryDate = new Date(tempCalcTPPolicyExpiryDate.setDate(tempCalcTPPolicyExpiryDate.getDate()+1));
                                convertDateFormatToString(tempCalcTPPolicyExpiryDate, function (formattedTPpolicyExpiryDate) {
                                    $scope.vehicleInfo.TPPolicyExpiryDate = formattedTPpolicyExpiryDate;
                                    
                            });
                        });
                    });
                $scope.singleClickBikeQuote();
            }

            $scope.callSingleClickBikeQuote = function () {
                if (localStorageService.get("bikeProductToBeAddedInCart")) {
                    $scope.productInCart = localStorageService.get("bikeProductToBeAddedInCart");
                    console.log("callSingleClickBikeQuote.......", $scope.productInCart);
                    $scope.bikeDetailsCopy = angular.copy(localStorageService.get("bikeDetailsCopy"));
                    $scope.bikeVehicleInfoCopy = angular.copy(localStorageService.get("bikeVehicleInfoCopy"));
                    $scope.bikeInfoCopy = angular.copy(localStorageService.get("bikeInfoCopy"));
                }
                $scope.quoteBikeInputForm.$setDirty();
                $scope.quoteBikeInputForm.bikeInputForm.$setDirty();
                $scope.resultSectionEnabled = true;
                $scope.inputSectionEnabled = false;
                $scope.ridersSectionEnabled = false;
                $scope.singleClickBikeQuote();
            }

            $scope.errorMessage = function (errorMsg) {
                if ($scope.errorRespCounter && (String($rootScope.bikeQuoteResult) == "undefined" || $rootScope.bikeQuoteResult.length == 0)) {
                    $rootScope.loading = false;
                    $scope.errorRespCounter = false;
                    $scope.quoteCalcSummaryError = true;
                    $scope.quoteCalculationError = errorMsg;
                } else if ($rootScope.bikeQuoteResult.length > 0) {
                    $rootScope.loading = false;
                    $scope.quoteCalculationError = "";
                }
            };

            $scope.tooltipPrepare = function (bikeResult) {
                if (bikeResult != null && bikeResult != "undefined" && bikeResult.length > 0) {
                    var resultCarrierId = [];
                    var testCarrierId = [];
                    for (var i = 0; i < bikeResult.length; i++) {
                        var carrierInfo = {};
                        carrierInfo.id = bikeResult[i].carrierId;
                        carrierInfo.name = bikeResult[i].insuranceCompany;

                        if (p365Includes(testCarrierId, bikeResult[i].carrierId) == false) {
                            resultCarrierId.push(carrierInfo);
                            testCarrierId.push(bikeResult[i].carrierId);
                        }
                    }
                    $rootScope.resultedCarriers = resultCarrierId;
                }
            };

            //filter for best premium
            $scope.customFilterBike = function () {
               // console.log('inside $scope.customFilterBike function: ',$rootScope.bikeQuoteResult);
                $scope.netPremiumTotalBike = 0;
                $scope.netPremiumAverageBike = 0;
                $scope.netPremiumMaxBike = 0;
                $scope.proffesionalRatingBike = 0;

                if($rootScope.bikeQuoteResult){
                for (var i = 0; i < $rootScope.bikeQuoteResult.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalBike += $rootScope.bikeQuoteResult[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageBike = Number(($scope.netPremiumTotalBike / $rootScope.bikeQuoteResult.length).toFixed(5));
                }
                for (var i = 0; i < $scope.bikeQuoteResult.length; i++) {
                        $rootScope.bikeQuoteResult[i].premiumRatio = $rootScope.bikeQuoteResult[i].netPremium/$rootScope.bikeQuoteResult[i].insuredDeclareValue;
                        $rootScope.bikeQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageBike / $rootScope.bikeQuoteResult[i].premiumRatio).toFixed(5));                       
                        
                    if ($rootScope.bikeQuoteResult[i].netPremiumMax > $scope.netPremiumMaxBike) {
                        $scope.netPremiumMaxBike = $rootScope.bikeQuoteResult[i].netPremiumMax;
                    }
                }

                for (var i = 0; i < $rootScope.bikeQuoteResult.length; i++) {  
                        $rootScope.bikeQuoteResult[i].netPremiumMean = Number((($rootScope.bikeQuoteResult[i].netPremiumMax / $scope.netPremiumMaxBike) * 5).toFixed(1));
                        if(!$rootScope.bikeQuoteResult[i].netPremiumMean){
                        $rootScope.bikeQuoteResult[i].netPremiumMean = 3.5; 
                    }
                    $rootScope.bikeQuoteResult[i].proffesionalRating = ($rootScope.bikeQuoteResult[i].netPremiumMean * 0.5) +
                         ($rootScope.bikeQuoteResult[i].claimIndex * 0.2) +
                        ($rootScope.bikeQuoteResult[i].insurerIndex * 0.3);
                    if(!$rootScope.bikeQuoteResult[i].proffesionalRating){
                        $rootScope.bikeQuoteResult[i].proffesionalRating = 3.5
                    }
                     if(!$rootScope.bikeQuoteResult[i].insurerIndex){
                        $rootScope.bikeQuoteResult[i].insurerIndex = 3.5;
                        }
                        if(!$rootScope.bikeQuoteResult[i].claimIndex){
                        $rootScope.bikeQuoteResult[i].claimIndex = 3.5;
                    }
                }
                $rootScope.bikeQuoteResult = $filter('orderBy')($rootScope.bikeQuoteResult, 'proffesionalRating');
            }
                $scope.sortReverse = true;
                return true;
            }
            $scope.processResult = function () {
                $rootScope.bikeQuoteResultCopy = $rootScope.bikeQuoteResult;

                if (localStorageService.get("bikeProductToBeAddedInCart")) {
                    var carrierAllReadyAdded = false;
                    for (var i = 0; i < $rootScope.bikeQuoteResult.length; i++) {
                        if (localStorageService.get("bikeProductToBeAddedInCart").carrierId == $rootScope.bikeQuoteResult[i].carrierId) {
                            //hard coded as it has one value
                            $rootScope.bikeQuoteResult[i].netPremiumMean = 5;
                            $scope.selectProduct($rootScope.bikeQuoteResult[i], false);
                            $rootScope.bikeQuote = $rootScope.bikeQuoteResult[i];
                            $scope.isGotBikeQuotes = true;
                            var carrierAllReadyAdded = true;

                            break;
                        }
                    }
                    if (!carrierAllReadyAdded) {
                        $scope.isGotBikeQuotes = true;
                        //$scope.customFilterBike();
                    }
                }

                $scope.tooltipPrepare($rootScope.bikeQuoteResult);
            };

            $scope.calculateBikeQuote = function (bikeQuoteResult, _transactionName, quoteIdStatus) {
                $rootScope.bikeQuoteRequest = [];
                $rootScope.bikeQuoteResult = [];
                $rootScope.bikeQuoteResultCopy = [];
                $rootScope.bikeQuoteErrorResponse = [];
                $rootScope.bikeQuoteResultResponseCopy = [];
                $scope.dataLoaded = false;

                if (_transactionName == 'calculateBikeProductQuote') {
                    $rootScope.bikeQuoteResult = $rootScope.bikeQuoteResultResponseCopy;
                }

                $scope.quote.quoteParam = $scope.quoteParam;
                $scope.quote.vehicleInfo = $scope.vehicleInfo;
                //$scope.quote.requestType = $scope.p365Labels.request.bikeRequestType;
                localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
                localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);

                //For Reset
                $scope.resetVehicleDetails();
                if (bikeQuoteResult.responseCode == $scope.p365Labels.responseCode.success1) {
                    $rootScope.loading = false;
                    $scope.responseCodeList = [];
                    $scope.requestId = bikeQuoteResult.QUOTE_ID;

                    if (!$scope.wordPressEnabled && _transactionName == 'bikeQuote') {
                        $scope.carrierQuoteList = [];
                        if (bikeQuoteResult.unMappedCarrierId) {
                            $scope.carrierQuoteList = bikeQuoteResult.unMappedCarrierId;
                        }
                    }

                    if (quoteIdStatus) {

                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.requestId);
                    }

                    //added IDV quote ID from Best deal quote ID
                    if ($scope.vehicleDetails.idvOption == 1) {
                        localStorageService.set("bike_best_quote_id", $scope.requestId);
                    }

                    if (bikeQuoteResult.encryptedQuoteId) {
                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", bikeQuoteResult.encryptedQuoteId);
                    }

                    $rootScope.bikeQuoteRequest = bikeQuoteResult.data;

                    if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0) {
                        $rootScope.bikeQuoteResult.length = 0;
                    }

                    //added to display error message if no quote response came
                    var quoteResultCount = 0;
                    angular.forEach($rootScope.bikeQuoteRequest, function (obj, i) {
                        $scope.dataLoaded = true;
                        //$scope.slickLoaded=false;
                        var request = {};
                        var header = {};

                        header.messageId = messageIDVar;
                        header.campaignID = campaignIDVar;
                        header.source = sourceOrigin;
                        header.transactionName = $scope.p365Labels.transactionName.bikeQuoteResult;
                        header.deviceId = deviceIdOrigin;
                        request.header = header;
                        request.body = obj;

                        $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                            success(function (callback, status) {
                                var bikeQuoteResponse = JSON.parse(callback);
                                quoteResultCount += 1;
                                var i;
                                var arrayName =[];
                                console.log("bikeQuoteResponse is...",bikeQuoteResponse);
                                if (bikeQuoteResponse.QUOTE_ID == $scope.requestId)
                                    $scope.responseCodeList.push(bikeQuoteResponse.responseCode);
                                if (bikeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1 && bikeQuoteResponse.QUOTE_ID == $scope.requestId) {
                                    for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
                                        if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
                                            $rootScope.bikeQuoteResult.push(bikeQuoteResponse.data.quotes[0]);
                                            $rootScope.bikeQuoteRequest[i].status = 1;
                                        }
                                    }
   
                                    $scope.processResult();

                                } else {
                                    if (!$scope.wordPressEnabled && _transactionName == 'bikeQuote') {
                                        $scope.carrierQuoteList.push(obj);
                                    }
                                    $scope.errorMsg = bikeQuoteResponse.message;
                                    $rootScope.bikeQuoteErrorResponse.push({
                                        status: 0,
                                        carrierId :obj.carrierId,
                                        message: $sce.trustAsHtml("<div>We did not get quote from the Insurer. It may be because:</b></div><br/><ul class=errorUL><li class=errorPlacementLeft>1.{{errorMsg}}</li></div>")
                                    })
                                    if ($rootScope.bikeQuoteRequest.length == quoteResultCount && _transactionName == 'bikeQuote') {
                                        if ($rootScope.bikeQuoteResult.length == 0) {
                                            $scope.noQuoteResultFound = true;
                                        }
                                        console.log(' $scope.noQuoteResultFound in  transactionName getCarQuote step 1 is ::', $scope.noQuoteResultFound);
                                    }
                                    // else if ($rootScope.bikeQuoteRequest.length == quoteResultCount && _transactionName == 'calculateBikeProductQuote') {
                                    //     if ($rootScope.bikeQuoteResult.length == 0) {
                                    //         angular.forEach($rootScope.bikeQuoteResultResponseCopy, function (obj, i) {
                                    //             $rootScope.bikeQuoteResult.push(obj);
                                    //         });
                                    //     }
                                    //     console.log(' $scope.noQuoteResultFound in  transactionName calculateCarProductQuote step 1 is ::', $scope.noQuoteResultFound);
                                    // }
                                    for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
                                        if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
                                            $rootScope.bikeQuoteRequest[i].status = 2;
                                            $rootScope.bikeQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        }
                                    }
                                }
                            }).
                            error(function (data, status) {
                                $scope.responseCodeList.push($scope.p365Labels.responseCode.systemError);
                                console.log("errroeroerroerroereroroeroeoroeororroreroeorererer............data,status",data,status);
                            });
                    });
                    $scope.bikeRequestStatus = 0;
                    $scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
                        if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
                            if ($scope.responseCodeList.length == $rootScope.bikeQuoteRequest.length) {
                                if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success)) {
                                    $scope.bikeRequestStatus = 1;
                                } else if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                                    $scope.bikeRequestStatus = 2;
                                    $scope.errorMessage($scope.p365Labels.validationMessages.productNotFoundMsg);
                                } else {
                                    $scope.bikeRequestStatus = 2;
                                    $scope.errorMessage($scope.p365Labels.validationMessages.generalisedErrMsg);
                                }
                            }
                    }, true);
                    setTimeout(function () {
                        if ($scope.quoteParam.policyType == 'new') {
                            $rootScope.ownDamageValidity = [1, 5];
                            $scope.PACoverValidity($scope.BikePACoverDetails.isPACoverApplicable);
                            $rootScope.selectedInsuranceType = $scope.insuranceTypeList[0].value;
                            $scope.filterResult($rootScope.selectedInsuranceType);
                        }
                    }, 200);
                } else {

                    if (_transactionName == 'bikeQuote') {
                        $scope.noQuoteResultFound = true;
                        $rootScope.bikeQuoteResultResponseCopy = $rootScope.bikeQuoteResult;
                        $rootScope.bikeQuoteRequest.push({
                            status: 2,
                            message: $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg)
                        });
                        //  $rootScope.bikeQuoteRequest[0].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);

                        if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0)
                            $rootScope.bikeQuoteResult.length = 0;
                    }
                    console.log('_transactionName for get quote is::', _transactionName);
                    console.log('$rootScope.carQuoteResultResponseCopy in  get quote is::', $rootScope.bikeQuoteResultResponseCopy.length);

                    $scope.responseCodeList = [];
                    if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0)
                        $rootScope.bikeQuoteResult.length = 0;

                    $scope.errorMessage(callback.message);
                }

            };

            $scope.submitPrevPolZeroDepCover = function () {
                $scope.modalPrevPolZeroDepCover = false;
                $scope.singleClickBikeQuote();
            };
            $scope.hidePrevPolZeroDepCoverModal = function () {
                $scope.modalPrevPolZeroDepCover = false;
                $scope.resetRiderSelection();
            };

            $scope.submitPrevPolInvoiceCover = function () {
                $scope.modalPrevInvoiceCover = false;
                $scope.singleClickBikeQuote();
            }
            $scope.hidePrevInvoiceCoverModal = function () {
                $scope.modalPrevInvoiceCover = false;
                $scope.resetRiderSelection();
            }

            $scope.displaySelecteRidersModal = false;
            $scope.showSelectedRiders = function () {
                $scope.displaySelecteRidersModal = true;
            }
            $scope.hideSelectedRiders = function () {
                $scope.displaySelecteRidersModal = false;
            }

            $scope.showPolicyTypeModal = function () {
              
                $scope.prevPolTypeModal = true;
               
            }

            $scope.hidePrevPolTypeModal = function () {
                $scope.prevPolTypeModal = false;
            }

            $scope.calculateQuoteOnAddOnCover = function (selRider) {
                setTimeout(function () {
                    if ($('.checkValidation').is(':visible') == false) {
                        var quoteCalcFlag = true;
                        if ($scope.quoteParam.policyType != "renew") {
                            $scope.vehicleInfo.previousPolicyZeroDepStatus = false;
                            $scope.vehicleInfo.previousPolicyInvoiceCoverStatus = false;
                            for (var i = 0; i < $rootScope.bikeAddOnCoversList.selectedAddOnCovers.length; i++) {
                                if ($rootScope.bikeAddOnCoversList.selectedAddOnCovers[i].riderId == 11) {
                                    $scope.vehicleInfo.previousPolicyZeroDepStatus = true;
                                }
                                if ($rootScope.bikeAddOnCoversList.selectedAddOnCovers[i].riderId == 15) {
                                    $scope.vehicleInfo.previousPolicyInvoiceCoverStatus = true;
                                }
                            }
                        } else {
                            var i;
                            if (selRider.riderId == 11) {
                                var zeroDepRiderStatus = false;
                                for (i = 0; i < $rootScope.bikeAddOnCoversList.selectedAddOnCovers.length; i++) {
                                    if ($rootScope.bikeAddOnCoversList.selectedAddOnCovers[i].riderId == selRider.riderId) {
                                        zeroDepRiderStatus = true;
                                        break;
                                    }
                                }
                                if (zeroDepRiderStatus) {
                                    $scope.vehicleInfo.previousPolicyZeroDepStatus = true;
                                    if (!$rootScope.wordPressEnabled) {
                                        quoteCalcFlag = false;
                                        $scope.modalPrevPolZeroDepCover = true;
                                    }
                                } else {
                                    $scope.vehicleInfo.previousPolicyZeroDepStatus = false;
                                    $scope.modalPrevPolZeroDepCover = false;
                                }
                            } else if (selRider.riderId == 15) {
                                var invoiceCoverRiderStatus = false;
                                for (i = 0; i < $rootScope.bikeAddOnCoversList.selectedAddOnCovers.length; i++) {
                                    if ($rootScope.bikeAddOnCoversList.selectedAddOnCovers[i].riderId == selRider.riderId) {
                                        invoiceCoverRiderStatus = true;
                                        break;
                                    }
                                }
                                if (invoiceCoverRiderStatus) {
                                    $scope.vehicleInfo.previousPolicyInvoiceCoverStatus = true;
                                    if (!$rootScope.wordPressEnabled) {
                                        quoteCalcFlag = false;
                                        $scope.modalPrevInvoiceCover = true;
                                    }
                                } else {
                                    $scope.vehicleInfo.previousPolicyInvoiceCoverStatus = false;
                                    $scope.modalPrevInvoiceCover = false;
                                }
                            }
                        }
                        if (!$rootScope.wordPressEnabled && quoteCalcFlag) {
                            $scope.singleClickBikeQuote();
                        }
                    }
                    $scope.$apply();
                }, 100);
            };

            $scope.callForLanding = function () {

                $rootScope.Regpopup = false;
                $scope.bikeDisplayNames = localStorageService.get("bikeMakeListDisplay");
                $scope.vehicleDetails = localStorageService.get("selectedBikeDetails");
                var selectedMake = "";
                var selectedModel = "";
                var selectedVariant = "";
                console.log('bikeQuoteCookie is: ',JSON.stringify(bikeQuoteCookie));
                if (bikeQuoteCookie) {                    
                    $scope.vehicleInfo.make = bikeQuoteCookie.vehicleInfo.make;
					$scope.vehicleInfo.model = bikeQuoteCookie.vehicleInfo.model;
                    $scope.vehicleInfo.variant = bikeQuoteCookie.vehicleInfo.variant;
                    selectedMake  = $scope.vehicleInfo.make;
                    selectedModel = $scope.vehicleInfo.model;
                    $scope.bikeModelList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                                if (value.make == selectedMake) {
                                    $scope.bikeModelList.push(value.model);
                                }
                        });
                        $scope.bikeVariantList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                            if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
                                    if($scope.bikeVariantList.indexOf(value.variant) == -1){
                                    $scope.bikeVariantList.push(value.variant);
                                    }
                                }
                        });
                        console.log('$scope.bike model list in callForLanding is: ',$scope.bikeModelList);
                        console.log('$scope.bike variant list in call for landing is: ',$scope.bikeVariantList);
                        setTimeout(function () {
                        $scope.vehicleInfo.make = bikeQuoteCookie.vehicleInfo.make;
						$scope.vehicleInfo.model = bikeQuoteCookie.vehicleInfo.model;
						$scope.vehicleInfo.variant = bikeQuoteCookie.vehicleInfo.variant;
                        $scope.bikeModelList = [];
                        selectedMake  = $scope.vehicleInfo.make;
                        selectedModel = $scope.vehicleInfo.model;
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                                if (value.make == selectedMake) {
                                    $scope.bikeModelList.push(value.model);
                                }
                        });
                        $scope.bikeVariantList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                            if ((value.make == $scope.vehicleInfo.make) && (value.model== $scope.vehicleInfo.model)){
                                    if($scope.bikeVariantList.indexOf(value.variant) == -1){
                                    $scope.bikeVariantList.push(value.variant);
                                    }
                                }
                        });
                        console.log('$scope.bike model list in settimeout callForLanding is: ',$scope.bikeModelList);
                        console.log('$scope.bike variant list in call for landing  settimeout is: ',$scope.bikeVariantList);
                    }, 100);
                }else{
					setTimeout(function () {
						$scope.vehicleInfo.make = "Hero MotoCorp";
						$scope.vehicleInfo.model = "Duet";
                        $scope.vehicleInfo.variant = "VX";
                        selectedMake  = $scope.vehicleInfo.make;
                        selectedModel = $scope.vehicleInfo.model;
                        $scope.bikeModelList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                                if (value.make == selectedMake) {
                                    $scope.bikeModelList.push(value.model);
                                }
                        });
                        $scope.bikeVariantList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                            if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
                                    if($scope.bikeVariantList.indexOf(value.variant) == -1){
                                    $scope.bikeVariantList.push(value.variant);
                                    }
                                }
                        });
                        console.log('$scope.bike model list in callForLanding else is: ',$scope.bikeModelList);
                        console.log('$scope.bike variant list in call for landing else is: ',$scope.bikeVariantList);
					}, 100)
                }
                
                $scope.searchText = null;
                $scope.searchText1 = null;
                $scope.searchText2 = null;
                $scope.querySearch = querySearch;
                $scope.modelSearch = modelSearch;
                $scope.variantSearch = variantSearch;

                function querySearch(query) {
                    console.log('*** inside query search ***',query);
                    var filteredVehicle = [];
                    var uniqueVehicle = [];
                    angular.forEach($scope.bikeDisplayNames, function (value) {
                        if (filteredVehicle.length <= 40) {
                            $scope.selectedVehicle = value.make;
                            if (value.make.toLowerCase().includes(query.toLowerCase())) {
                                console.log('filtered vehicle is : ',filteredVehicle);
                                if(filteredVehicle.indexOf(value.make) == -1){
                                    filteredVehicle.push(value.make);
                                }
                            }
                        }
                    });
                    return filteredVehicle;
                }
                function modelSearch(query) {
                    var filteredModel= [];
                    angular.forEach($scope.bikeModelList, function (model) {
                        if (filteredModel.length <= 40) {
                            $scope.selectedVehicle = model;
                            if (model.toLowerCase().includes(query.toLowerCase())) {
                                if(filteredModel.indexOf(model) == -1){
                                filteredModel.push(model);
                                }
                            }
                        }
                    });
                    return filteredModel;
                }

                function variantSearch(query) {
                    console.log('query in modelsearch is: ',query);
                    var filteredVariant= [];
                    angular.forEach($scope.bikeVariantList, function (variant) {
                        if (filteredVariant.length <= 40) {
                            if (variant.toLowerCase().includes(query.toLowerCase())) {
                                if(filteredVariant.indexOf(variant) == -1){
                                    filteredVariant.push(variant);
                                }
                            }
                        }
                    });
                    return filteredVariant;
                }
            };

                $scope.selectedDisplayVehicle = function (selectedMake) {
                    console.log('inside selected display vehicle');
                    if (selectedMake) {                     
                        $scope.bikeModelList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                                if (value.make == selectedMake) {
                                    $scope.bikeModelList.push(value.model);
                                }
                        });
                       // if($scope.resetDisplayVehicle || bikeQuoteCookie){
                            $scope.vehicleInfo.model = "";
                            $scope.vehicleInfo.variant = "";
                       //  }
                        
                        console.log('$scope.bikeModelList is: ',$scope.bikeModelList);
                        
                        $scope.vehicleDetails.idvOption = 1;
                        $rootScope.bikeAddOnCoversList.selectedAddOnCovers = [];
                        if (!$rootScope.wordPressEnabled) {

                            $scope.carrierVariantList = [];
                            variantList = [];
                            if ($scope.showCarrierVehicleVariants) {
                                $scope.displayLoader = true;
                            }
                            $scope.noCarrierVariantFound = false;
                            //$scope.fetchCarrierSpecificVariants();
                        }
                    }
                };
                $scope.selectedDisplayModel = function(selectedModel){
                    if (selectedModel) {
                        $scope.bikeVariantList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
                            if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
                                    if($scope.bikeVariantList.indexOf(value.variant) == -1){
                                        $scope.bikeVariantList.push(value.variant);
                                    }
                                }
                        });
                        //if($scope.resetDisplayVehicle  || bikeQuoteCookie){
                            $scope.vehicleInfo.variant = ""; 
                        //}
                        console.log('$scope.bikeVariantList is: ',$scope.bikeVariantList);                       
                    }
                };

                $scope.selectedDisplayVariant = function(selectedVariant){
                    $scope.resetDisplayVehicle = true;           
                };
            
            $scope.onSelectCarrierVariant = function (variant, data) {
                $scope.calcQuoteOnVariant = true;
                $scope.carrierVarients = variant;
                variant.carrierId = data.carrierId;
                var variantIdAlreadyExist = false;
                if (variantList.length > 0) {
                    for (var i = 0; i < variantList.length; i++) {
                        if (variantList[i].carrierId == variant.carrierId) {
                            variantList[i] = variant;
                            variantIdAlreadyExist = true;
                            break;
                        }
                    }
                }
                if (!variantIdAlreadyExist) {
                    variantList.push(variant);
                }
                console.log('variant list is::', variantList);
            }

            //for electriacl and non electrical cover
            $scope.minRiderLimit = minBikeAccessoriesLimit;
            $scope.maxRiderLimit = maxBikeAccessoriesLimit;

            $scope.validateRiderAmount = function (selRiderAmt) {
                if (selRiderAmt < $scope.minRiderLimit || selRiderAmt > $scope.maxRiderLimit) {
                    $scope.setDisabled = true;
                } else {
                    setTimeout(function () {
                        if ($('.checkValidation').is(':visible') == false) {
                            $scope.setDisabled = false;
                            if (!$rootScope.wordPressEnabled) {
                                $scope.calculateQuoteOnAddOnCover();
                            }
                        }
                        $scope.$apply();
                    }, 100);
                }
            }
            // if ($rootScope.wordPressEnabled) {
            $scope.callForLanding();
            // }

            //if (!$scope.wordPressEnabled) {
            //$scope.fetchCarrierSpecificVariants();
            //}
            //defaultValue for riders electrical/nonelectrical
            $scope.getRiderDefaultValue = function (riderId) {
                var riderVal = 4000;
                if (riderId == 25) {
                    return riderVal;
                } else if (riderId == 30) {
                    var riderVal = 5000;
                    return riderVal;
                }
            }

            //function created to reset rider
            //details in p365 wordPress
            $scope.resetRiderSelection = function () {
                // if ($scope.riderListCopy) {
                //     angular.copy($scope.riderListCopy, $rootScope.bikeAddOnCoversList.selectedAddOnCovers);
                // } else {
                //     $rootScope.bikeAddOnCoversList.selectedAddOnCovers = [];
                // }
                $rootScope.bikeAddOnCoversList.selectedAddOnCovers = [];
                if ($scope.quoteParam.riders) {
                    for (var i = 0; i < $scope.addOnCovers.length; i++) {
                        for (var j = 0; j < $scope.quoteParam.riders.length; j++) {
                            if ($scope.addOnCovers[i].riderId == $scope.quoteParam.riders[j].riderId) {
                                if ($scope.addOnCovers[i].riderId != 11 && $scope.addOnCovers[i].riderId != 15) {
                                    $scope.addOnCovers[i].riderAmount = $scope.quoteParam.riders[j].riderAmount;
                                }
                                $rootScope.bikeAddOnCoversList.selectedAddOnCovers.push($scope.addOnCovers[i]);
                                break;
                            }
                        }
                    }
                    localStorageService.set("addOnCoverListForBike", $scope.addOnCovers);
                }

                if (localStorageService.get("bikeQuoteInputParamaters").quoteParam.riders) {
                    $scope.selectedAddOn = localStorageService.get("bikeQuoteInputParamaters").quoteParam.riders.length;
                }
                angular.copy($scope.vehicleInfoCopy, $scope.vehicleInfo);
                $scope.riderDetailsModal = false;
            }

            $scope.changePolicyType = function () {
                $scope.polTypeChanged = true;
                if ($scope.BikePACoverDetails.isPACoverApplicable) {
                    $scope.BikePACoverDetails = {};
                    $scope.BikePACoverDetails.existingInsurance = true;
                    $scope.BikePACoverDetails.isPACoverApplicable = false;


                    if($scope.quoteParam.riders){
                        for (var j = 0; j < $scope.quoteParam.riders.length; j++) {
        
                            if($scope.quoteParam.riders[j].riderName == "Personal Accident Cover")
                            $scope.quoteParam.riders.splice(j,1);
                            $scope.PACoverFlag = 0;
        
                        }
                    }

                }
                $scope.singleClickBikeQuote();
            }

            $scope.singleClickBikeQuote = function (_transactionName) {
                _transactionName = (_transactionName) ? _transactionName : $scope.p365Labels.getRequest.quoteBike;

                if (($scope.quoteBikeInputForm.$valid && $scope.quoteBikeInputForm.$dirty) || $scope.polTypeChanged) {
                    setTimeout(function () {

                        if ($scope.flagforMobile) {
                            $rootScope.showonEdit = "none !important";
                            $rootScope.hideonEdit = "inline !important";
                            $scope.flagforMobile = false;
                        }

                        $rootScope.loading = true;
                        $scope.dataLoaded = false;
                        $scope.idvDetailsModal = false;
                        $scope.riderDetailsModal = false;
                        $scope.OdOnlyModal = false;
                        $scope.quoteCalcSummaryError = false;
                        $scope.isGotBikeQuotes = false;
                        $scope.noCarrierVariantFound = false;
                        $scope.noQuoteResultFound = false;
                        $scope.polTypeChanged = false;
                        $scope.quoteBikeInputForm.$setPristine();
                        $scope.quote = {};

                        $scope.quoteParam.riders = [];

                        if($scope.PACoverFlag == 1){
                            $scope.PACoverAddon();
                        }

                        $scope.bikeRequestStatus = 0;
                        //for adding mobile number in quote request if call goes to quote calculation
                        // if (localStorageService.get("quoteUserInfo")) {
                        //     $scope.quote.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                        // }
                        //$rootScope.modalShown = true;
                        $scope.errorRespCounter = true;

                        if (String($scope.selectedCarrier) != "undefined" && $scope.selectedCarrier.length > 0) {
                            $scope.selectedCarrier.length = 0;
                        }

                        $scope.displayIDVOption();
                        $scope.vehicleInfo.IDV = Number($scope.vehicleInfo.IDV);
                        selectedRiderListForBike($rootScope.bikeAddOnCoversList.selectedAddOnCovers, $scope.quoteParam.riders, function () {

                            if ($scope.vehicleDetails.idvOption == 1) {
                                $scope.vehicleInfo.IDV = 0;
                            }

                            if ($rootScope.wordPressEnabled && $rootScope.bikeAddOnCoversList.selectedAddOnCovers.length > 0) {
                                $scope.riderListCopy = angular.copy($rootScope.bikeAddOnCoversList.selectedAddOnCovers);
                            }
                            //added to reset idv on cancel of your idv pop-up
                            $rootScope.idvOptionCopy = angular.copy($scope.vehicleDetails.idvOption);
                         
                            if ($rootScope.selectedBikeRegistrationObject != null || String($rootScope.selectedBikeRegistrationObject) != "undefined") {
                               $scope.vehicleInfo.city = $rootScope.selectedBikeRegistrationObject.city;
                                $scope.vehicleInfo.RTOCode = $rootScope.selectedBikeRegistrationObject.regisCode;
                                $scope.vehicleInfo.state = $rootScope.selectedBikeRegistrationObject.state;
                            } else {
                                for (var i = 0; i < $scope.defaultMetroList.length; i++) {
                                    if ($scope.defaultMetroList[i].cityName.toUpperCase()== $scope.vehicleInfo.city.toUpperCase()) {
                                        for (var j = 0; j < $scope.defaultMetroList[i].RTODetails.length; j++) {
                                            var selectedMetroDetails = $scope.defaultMetroList[i].RTODetails[j];
                                            if (selectedMetroDetails.display == $scope.vehicleInfo.registrationPlace) {
                                               // $scope.quoteParam.zone = selectedMetroDetails.zone;
                                                $scope.vehicleInfo.city = selectedMetroDetails.city;
                                                $scope.vehicleInfo.RTOCode = selectedMetroDetails.regisCode;
                                                $scope.vehicleInfo.state = selectedMetroDetails.state;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            //$scope.calculatedVehicleExpiryDate = getDateForDisplay($scope.vehicleInfo.PreviousPolicyExpiryDate);

                            $scope.calculatedVehicleRegistrationDate = getDateForDisplay($scope.vehicleInfo.dateOfRegistration);
                            $scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
                            $scope.vehicleDetails.showBikeRegAreaStatus = $rootScope.showBikeRegAreaStatus;
                            //$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0,2)+$scope.vehicleInfo.registrationPlace.substr(3,2).trim();
                            if ($rootScope.showBikeRegAreaStatus) {
                                if($scope.vehicleInfo.registrationPlace.indexOf("-")!=-1){
                                    $scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0, 2).toUpperCase() + $scope.vehicleInfo.registrationPlace.substr(3, 2).toUpperCase();
                                }else{
                                    $scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0, 4);
                                    }
                            } else {
                                $scope.vehicleInfo.RTOCode = $scope.vehicleDetails.registrationNumber.substr(0, 4).toUpperCase();
                            }
                            $scope.quoteParam.policyType = $scope.vehicleDetails.insuranceType.value;
                            $scope.selectedSortOption = $scope.sortTypes[0];
                            if($scope.quoteParam.policyType == "renew"){
                            if ($scope.vehicleInfo.previousClaim == "true" || $scope.vehicleDetails.policyStatus.key == $scope.policyStatusList[0].key ||
                                  $scope.vehicleDetails.policyStatus.key == 1)
                                $scope.quoteParam.ncb = 0;
                            else
                                $scope.quoteParam.ncb = $scope.vehicleDetails.ncb.value;
                            }else{
                                $scope.quoteParam.ncb = 0;
                            }

                            if (buyConfrmFlag) {
                                resultCnfrmBuyFlag = true;
                                buyConfrmFlag = false;
                            } else {
                               resultCnfrmBuyFlag = false;
                            }
                            //added IDV quote ID based on IDV selection in Result and removing for best deal
                            if ($scope.vehicleDetails.idvOption == 2 || $scope.vehicleDetails.idvOption == 3) {
                                //$scope.quote.QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
                                $scope.vehicleInfo.best_quote_id = localStorageService.get("bike_best_quote_id");
                            } else {
                                delete $scope.vehicleInfo.best_quote_id
                            }

                            if (!$scope.wordPressEnabled && _transactionName == 'calculateBikeProductQuote') {
                                $scope.calcQuoteOnVariant = false;
                                $scope.vehicleInfo.carrierVariants = [];
                                if (variantList.length > 0) {
                                    $scope.vehicleInfo.carrierVariants = variantList;
                                }
                                if (localStorageService.get("BIKE_UNIQUE_QUOTE_ID")) {
                                   // $scope.quote.QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
                                }
                            }
                            //added by gauri for mautic application
                            if (imauticAutomation == true) {
                                  imatBikeLeadQuoteInfo(localStorageService, $scope, 'ViewQuote');
                            }

                            if ($scope.quoteParam.riders) {
                                $scope.selectedAddOn = $scope.quoteParam.riders.length;
                            }
                            if($scope.odOnlyPlan){
                                $scope.quoteParam.policyType ="odonly";
                            }
                            //$scope.vehicleInfo.IDV = 0;
                            $scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
                           
                            $scope.quote.quoteParam = $scope.quoteParam;
                            $scope.quote.vehicleInfo = $scope.vehicleInfo;
                            //$scope.quote.PACoverDetails = $scope.BikePACoverDetails;
                            //$scope.quote.requestType = $scope.p365Labels.request.bikeRequestType;

                            // Google Analytics Tracker added.
                            //analyticsTrackerSendData($scope.quote);

                            $scope.requestId = null;
                            if (_transactionName == "calculateBikeProductQuote") {
                                if (localStorageService.get("bikeProductToBeAddedInCart")) {
                                    $scope.quote.carrierId = localStorageService.get("bikeProductToBeAddedInCart").carrierId;
                                    $scope.quote.productId = localStorageService.get("bikeProductToBeAddedInCart").productId;
                                }
                            }

                            if (localStorageService.get("PROF_QUOTE_ID")) {
                              //  $scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                            }
                            console.log('professionalQuoteBikeCookie in single click is',professionalQuoteBikeCookie);
                            if (professionalBikeParam) {
                                var professionalQuoteCookie =localStorageService.get("professionalQuoteParams");
                            }else{
                                professionalQuoteBikeCookie = {};
                                var professionalQuoteCookie = {};
                                professionalQuoteCookie.bikeInfo = {};
                            }
                            professionalQuoteBikeCookie.registrationYear = $scope.vehicleDetails.regYear;
                            professionalQuoteBikeCookie.TPPolicyStartDate = $scope.vehicleInfo.TPPolicyStartDate;
                            professionalQuoteBikeCookie.TPPolicyExpiryDate = $scope.vehicleInfo.TPPolicyExpiryDate;
                            professionalQuoteBikeCookie.make = $scope.vehicleInfo.make;
                            professionalQuoteBikeCookie.model = $scope.vehicleInfo.model;
                            professionalQuoteBikeCookie.variant = $scope.vehicleInfo.variant;
                            professionalQuoteBikeCookie.registrationPlace = $scope.vehicleInfo.registrationPlace;
                            //professionalQuoteCookie.bikeInfo.variantId = $scope.vehicleDetails.variantId;
                            professionalQuoteCookie.bikeInfo =  professionalQuoteBikeCookie;
                            console.log('professionalQuoteCookie is step 1: ',professionalQuoteCookie);
                            localStorageService.set("professionalQuoteParams", professionalQuoteCookie);
                            
                            if ($scope.quoteParam.policyType == 'renew') {
                                if ($scope.vehicleDetails.regYear) {
                                    if (parseInt($scope.vehicleDetails.regYear) < 2018) {
                                        $scope.showBundle = false;
                                       // $scope.quoteParam.onlyODApplicable = false;
                                    }else {
                                        $scope.showBundle = true;
                                    }
                                }
                            }
                            $scope.bikeQuoteRequestFormation($scope.quote);
                            RestAPI.invoke(_transactionName, $scope.quoteRequest).then(function (callback) {
                            
                                if (callback.responseCode == $scope.p365Labels.responseCode.success1) {
                                    $scope.calculateBikeQuote(callback, _transactionName, true);
                                } else {
                                    $scope.responseCodeList = [];
                                    if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0)
                                        $rootScope.bikeQuoteResult.length = 0;

                                    $rootScope.bikeQuoteResult = [];
                                    $rootScope.bikeQuoteRequest = [];
                                    $scope.errorMessage(callback.message);
                                }
                            });
                        });
                    }, 100);
                } else {
                    $scope.idvDetailsModal = false;
                    $scope.riderDetailsModal = false;
                    $scope.OdOnlyModal = false;
                }
            };

            $scope.setRangePrevPolicyStartDate = function () {
                // Setting properties for previous policy start date-picker.
                var prevPolStartDateOption = {};
                var tempCalcPrevPolStartDate = "";

                if ($scope.productValidation.isShortFallSupported) {
                    convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPrevPolExpDate) {
                        var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPrevPolExpDate));
                        tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
                        tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));

                        prevPolStartDateOption.maximumDateLimit = formattedPrevPolExpDate;
                        
                    });

                    if (String($scope.prevPolicyStartDateWarning) != "undefined" && $scope.prevPolicyStartDateWarning != "") {
                        convertStringFormatToDate($scope.vehicleInfo.dateOfRegistration, function (formattedRegistrationDate) {
                            prevPolStartDateOption.minimumDateLimit = formattedRegistrationDate;
                        });
                    } else {
                        prevPolStartDateOption.minimumDateLimit = tempCalcPrevPolStartDate;
                    }
                } else {
                    convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPrevPolExpDate) {
                        var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPrevPolExpDate));
                        tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
                        tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));
                    });

                    if (String($scope.prevPolicyStartDateWarning) != "undefined" && $scope.prevPolicyStartDateWarning != "") {
                        convertStringFormatToDate($scope.vehicleInfo.dateOfRegistration, function (formattedRegistrationDate) {
                            prevPolStartDateOption.minimumDateLimit = formattedRegistrationDate;
                            prevPolStartDateOption.maximumDateLimit = formattedRegistrationDate;
                        });
                    } else {
                        prevPolStartDateOption.minimumDateLimit = tempCalcPrevPolStartDate;
                        prevPolStartDateOption.maximumDateLimit = tempCalcPrevPolStartDate;
                    }
                }

                prevPolStartDateOption.changeMonth = true;
                prevPolStartDateOption.changeYear = true;
                prevPolStartDateOption.dateFormat = "dd/mm/yy";
                $scope.previousPolicyStartDateOptions = setP365DatePickerProperties(prevPolStartDateOption);
            
            };

            $scope.validatePrevPolicyStartDate = function () {
                if (String($scope.vehicleDetails.PreviousPolicyStartDate) !== "undefined" && String($scope.vehicleInfo.PreviousPolicyExpiryDate) !== "undefined") {
                    convertStringFormatToDate($scope.vehicleDetails.PreviousPolicyStartDate, function (formattedPrevPolStartDate) {
                        convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPrevPolExpDate) {
                            convertStringFormatToDate($scope.vehicleInfo.dateOfRegistration, function (formattedDateOfRegistration) {
                                var selPreviousPolicyExpiryDate = angular.copy(formattedPrevPolExpDate);
                                var tempCalcPrevPolStartDate = new Date(selPreviousPolicyExpiryDate.setFullYear(selPreviousPolicyExpiryDate.getFullYear() - 1));
                                tempCalcPrevPolStartDate = new Date(tempCalcPrevPolStartDate.setDate(tempCalcPrevPolStartDate.getDate() + 1));
                                convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
                                    $scope.vehicleDetails.PreviousPolicyStartDate = formattedPrevPolStartDate;
                            
                                });
                            });
                        });
                    });
                }
            };
            // $scope.validateTPPolicyExpirytDate = function () {
            //     console.log("Inside ValidateTPPolicy");         
            //     if (String($scope.vehicleInfo.ODPolicyExpiryDate) !== undefined && String($scope.vehicleInfo.TPPolicyExpiryDate) !== undefined) {
            //         console.log("Inside if Inside ValidateTPPolicy");
            //        convertStringFormatToDate($scope.vehicleInfo.ODPolicyExpiryDate, function (formattedODpolicyExpirytDate) {
            //             convertStringFormatToDate($scope.vehicleInfo.TPPolicyExpiryDate, function (formattedTPpolicyExpiryDate) {
                           
            //                     var selODpolicyExpirytDate = angular.copy(formattedODpolicyExpirytDate);
            //                     var tempCalcTPPolicyExpiryDate = new Date(selODpolicyExpirytDate.setFullYear(selODpolicyExpirytDate.getFullYear()));
            //                     tempCalcTPPolicyExpiryDate = new Date(tempCalcTPPolicyExpiryDate.setDate(tempCalcTPPolicyExpiryDate.getDate()+1));
            //                     convertDateFormatToString(tempCalcTPPolicyExpiryDate, function (formattedTPpolicyExpiryDate) {
            //                         $scope.vehicleInfo.TPPolicyExpiryDate = formattedTPpolicyExpiryDate;
            //                         //prevPolExpDateOption.minimumDayLimit = $scope.vehicleInfo.TPPolicyExpiryDate;
            //                     console.log("ODPolicyExpirytDate", $scope.vehicleInfo.ODPolicyExpiryDate,"TPPolicyExpiryDate-----------", $scope.vehicleInfo.TPPolicyExpiryDate);
            //                 });
            //             });
            //         });
            //     }
            // };
            
            $scope.$watch('vehicleInfo.PreviousPolicyExpiryDate', function () {
                $scope.validatePrevPolicyStartDate();
            })
            $scope.validateRegistrationDate = function () {
                if (String($scope.vehicleInfo.dateOfRegistration) !== "undefined") {
                    convertStringFormatToDate($scope.vehicleInfo.dateOfRegistration, function (formattedRegistrationDate) {
                        var selDateOfRegistration = new Date(angular.copy($scope.vehicleInfo.dateOfRegistration));
                        var selPreviousPolicyStartDate = new Date(angular.copy($scope.vehicleDetails.PreviousPolicyStartDate));

                        if (selPreviousPolicyStartDate < selDateOfRegistration) {
                            $scope.vehicleDetails.PreviousPolicyStartDate = $scope.vehicleInfo.dateOfRegistration;
                            $scope.validatePrevPolicyStartDate();
                        } else {
                            $scope.prevPolicyStartDateWarning = "";
                            convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPolicyExpiryDate) {
                                var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPolicyExpiryDate));
                                var tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
                                tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));
                                convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
                                    $scope.vehicleDetails.PreviousPolicyStartDate = formattedPrevPolStartDate;
                                });
                            });
                        }

                        $scope.setRangePrevPolicyExpiryDate();
                        $scope.calculatedVehicleRegistrationDate = getDateForDisplay($scope.vehicleInfo.dateOfRegistration);
                        //$scope.vehicleInfo.regYear = $scope.vehicleInfo.dateOfRegistration.split("/")[2];
                        $scope.vehicleDetails.regYear = $scope.vehicleInfo.dateOfRegistration.split("/")[2];
                        $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                        $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                        $scope.registrationDateError = "";
                    });
                }
            };

            $scope.initTwoWheelerResultCtrl = function () {
                // Setting properties for registration date-picker.
                var regDateOption = {};
                if ($scope.vehicleDetails.insuranceType.type != bikeInsuranceTypeGeneric[1].type) {
                    regDateOption = {};
                    regDateOption.minimumDayLimit = -9;
                    regDateOption.maximumDayLimit = +30;
                    regDateOption.changeMonth = true;
                    regDateOption.changeYear = true;
                    regDateOption.dateFormat = "dd/mm/yy";
                    $scope.dateOfRegistrationOptions = setP365DatePickerProperties(regDateOption);
                } else {
                    regDateOption = {};
                    regDateOption.minimumYearLimit = "-15Y";
                    regDateOption.maximumYearLimit = "-0Y";
                    regDateOption.changeMonth = true;
                    regDateOption.changeYear = true;
                    regDateOption.dateFormat = "dd/mm/yy";
                    $scope.dateOfRegistrationOptions = setP365DatePickerProperties(regDateOption);
                }

                $scope.setRangePrevPolicyExpiryDate();
            };

            //calls for fetching rating
             $scope.customFilterBike();

            //code for download share pdf
            if($location.search().sharePDF){
                if ($rootScope.parseCarrierList) {
                    for (var j = 0; j < $rootScope.bikeQuoteResult.length; j++) {
                        if ($rootScope.bikeQuoteResult[j].carrierId == $rootScope.parseCarrierList[0]) {
                            sharePDFQuote = $rootScope.bikeQuoteResult[j] ;
                            break ;
                        }
                    }
                }
                //function created to display image in share PDF
                var getImageFromUrl = function(url, callback) {
                    var img = new Image();
                    img.onError = function() {
                    alert('Cannot load image: "'+url+'"');
                    };
                    img.onload = function() {
                    callback(img);
                    };
                    img.src = url;
                    }
                
                    var createPDF = function(imgData) {
                        var doc = new jsPDF();
                        var width = doc.internal.pageSize.width;    
                        var height = doc.internal.pageSize.height;
                        var options = {
                             pagesplit: true
                    };
                $scope.displayPDF= true;
                console.log('sharePDFQuote is : ',sharePDFQuote);
                var doc_name = sharePDFQuote.insuranceCompany+"_"+"premiumBreakup.pdf";
                doc.addImage(imgData, 'PNG', 10, 10,35,15, 'p365logo'); 
                var xaxis = 10;
                var yaxis = 20;
                doc.setTextColor(100);
                doc.setFontSize(18);
                doc.text(10,40 ,'Premium Breakup');
                doc.setTextColor(150);
                doc.setFontSize(12);
                doc.text(10,50 ,'Company Name :');
                doc.text(60,50 ,sharePDFQuote.insuranceCompany);
                doc.text(10,60 ,'Vehicle Details :');
                var vehicleDetails = $scope.vehicleInfo.make+""+""+$scope.vehicleInfo.model+" "+" "+$scope.vehicleInfo.variant;
                doc.text(60,60,vehicleDetails);
                doc.text(10,80,'Basic coverage :');
                doc.text(60,90,'Basic own damage');
                doc.text(120,90,String(Math.round(sharePDFQuote.odpremium)));                              
                doc.text(60,100,'Basic third party');
                doc.text(120,100,String(Math.round(sharePDFQuote.tppremium)));
                var totalBasicCoverage =Number(sharePDFQuote.odpremium)+Number(sharePDFQuote.tppremium);
                var totalBasicCoverage1 = "+"+totalBasicCoverage ;
                doc.text(120,110,totalBasicCoverage1);
                var yaxis = 110;
                yaxis+=10;
                var discountListFlag = false;
            if(sharePDFQuote.totalDiscountAmount > 0){
                doc.text(10,yaxis,'Savings/Discounts :');
               // yaxis+=10;
                for(var i= 0 ; i < sharePDFQuote.discountList.length ; i++){
                    // yaxis = yaxis+i*10;
                    yaxis+=10;
                    doc.text(60,yaxis,sharePDFQuote.discountList[i].type);
                    doc.text(120,yaxis,String(sharePDFQuote.discountList[i].discountAmount)); 
                }
                yaxis+=10;
                var totalDiscountAmount ="-"+sharePDFQuote.totalDiscountAmount;
                doc.text(120,yaxis,totalDiscountAmount);
                yaxis+=10; 
            }
           
            
            if(discountListFlag){
                if(sharePDFQuote.ridersList){
                    if(sharePDFQuote.totalRiderAmount > 0 ){
                    yaxis = yaxis+10;
                    var riderCount = 0; 
                    for(var i=0 ; i < sharePDFQuote.ridersList.length ; i++){
                        if(sharePDFQuote.ridersList[i].riderType != 'NA' && sharePDFQuote.ridersList[i].riderType != 'included' && sharePDFQuote.ridersList[i].riderValue > 0){
                            if(riderCount == 0){
                                doc.text(10,ycords,'Add-on cover :');
                            }
                            riderCount+=1;
                            yaxis = yaxis+10;
                            doc.text(60,yaxis,sharePDFQuote.ridersList[i].riderName); 
                            doc.text(120,yaxis,String(sharePDFQuote.ridersList[i].riderValue));   
                        }
                    }
                    if( sharePDFQuote.totalRiderAmount > 0){
                    setTimeout(function()  {
                        console.log('inside rider list timeout-1');
                        yaxis = yaxis+10;
                    var totalRiderAmount ="+"+sharePDFQuote.totalRiderAmount;
                    doc.text(120,yaxis,totalRiderAmount);
                    yaxis = yaxis+10;
                    },500)
                }else{
                    yaxis = yaxis+10;
                }
              }
            }else{
                 yaxis = yaxis+10;
            }
        }else{
            if(sharePDFQuote.ridersList){
                var riderCount=0;
                for(var i=0 ; i < sharePDFQuote.ridersList.length ; i++){
                    if(sharePDFQuote.ridersList[i].riderType != 'NA' && sharePDFQuote.ridersList[i].riderType != 'included' && sharePDFQuote.ridersList[i].riderValue > 0){
                        if(riderCount == 0){
                            doc.text(10,yaxis,'Add-on cover :');
                        }
                        riderCount+=1;
                        yaxis = yaxis+10;
                        doc.text(60,yaxis,sharePDFQuote.ridersList[i].riderName); 
                        doc.text(120,yaxis,String(sharePDFQuote.ridersList[i].riderValue));   
                    }
                }
                if( sharePDFQuote.totalRiderAmount > 0){
                yaxis = yaxis+10;
                setTimeout(function()  {
                    console.log('inside rider list timeout-2');
                yaxis = yaxis+10;
                var totalRiderAmount ="+"+sharePDFQuote.totalRiderAmount;
                doc.text(120,yaxis,totalRiderAmount);
                yaxis = yaxis+10;
                },500)
            }else{
                yaxis = yaxis+10;
            }
        }
        }
                setTimeout(function()  {
                yaxis = yaxis+10;
                doc.text(10,yaxis,'Net Premium :');
                doc.text(120,yaxis,String(sharePDFQuote.netPremium));
                yaxis+=10;
                doc.text(10,yaxis,'GST :');
                doc.text(120,yaxis,String(sharePDFQuote.serviceTax));
                yaxis+=10;
                doc.text(10,yaxis,'Total Premium :');
                doc.text(120,yaxis,String(sharePDFQuote.grossPremium));
                yaxis+=10;
                doc.text(10,yaxis,'Total Payable :');
                doc.text(120,yaxis,String(sharePDFQuote.grossPremium));
        
                doc.setTextColor(100);
                doc.setFontSize(10);
                yaxis+=30;
                doc.text(70,yaxis,'Navnit Insurance Broking Private Limited');
                doc.setTextColor(150);
                doc.setFontSize(10);
                yaxis+=5;
                doc.text(40,yaxis,'172 Solitaire Corporate Park Building No 1,7th Floor,Andheri-Ghatkopar Link Road,');
                yaxis+=5;
                doc.text(40,yaxis,'Andheri(East),Mumbai,400093,Maharashtra,India');
                yaxis+=5;
                doc.text(40,yaxis,'Product Information is authentic and solely based on the information received from the insurer');
                yaxis+=5;
                doc.text(40,yaxis,'IRDAI Broker Licence Code No');
                yaxis+=5;
                doc.text(40,yaxis,'IRDA/ CB 446/09/2021');
                $scope.displayPDF= false;
                // Save the PDF
                doc.save(doc_name);
                },500)
            }
            if(!idepProdEnv){
                getImageFromUrl('http://uat.policies365.com/app/img/clogo/logo.png', createPDF);
                }else{
                getImageFromUrl('https://www.policies365.com/app/img/clogo/logo.png', createPDF);
                }
            }
            //setting flag for showing quote user info popup in share email
            if ($rootScope.flag || $rootScope.isOlarked) {
                $scope.riderListCopy = angular.copy($rootScope.bikeAddOnCoversList.selectedAddOnCovers);
                if (localStorageService.get("quoteUserInfo")) {
                    $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
                }
                $rootScope.loading = false;
                $rootScope.flag = false;
                $rootScope.isOlarked = false;
            }

            $scope.initTwoWheelerResultCtrl();

            //});
        }
        //init call
        $scope.init();


        $scope.hideResultCnfrmBuyModal = function () {
            $scope.modalResultCnfrmBuy = false;
        };



        $scope.submitResultCnfrmBuy = function () {
            $scope.modalResultCnfrmBuy = false;
            if ($scope.resultCnfrmBuy.$dirty) {
                $scope.resultCnfrmBuy.$setPristine();
                resultCnfrmBuyFlag = true;
                buyConfrmFlag = true;
                $scope.quoteBikeInputForm.$setDirty();
                $scope.singleClickBikeQuote();
            }else{
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    $rootScope.loading = true;
                    // if (String($location.search().leaddetails) != "undefined") {
                    //     var leaddetails = JSON.parse($location.search().leaddetails);
                    //     localStorageService.set("quoteUserInfo", leaddetails);
                    // }
                    $location.path('/buyTwoWheeler').search({ quoteId: localStorageService.get("BIKE_UNIQUE_QUOTE_ID"), carrierId: $scope.selectedProduct.carrierId, productId: $scope.selectedProduct.productId, lob: $scope.selectedProduct.quoteType });
                } else {
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                    $rootScope.loading = true;
                    $location.path('/buyTwoWheeler');
                }
            }
        };

        $scope.selectProduct = function (selectedProduct, _redirectTOResult) {
            _redirectTOResult = (_redirectTOResult == false) ? _redirectTOResult : true;
            var QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
            updateSelectedProduct(RestAPI, QUOTE_ID, selectedProduct, function (updatedProductCallback) {
                if (updatedProductCallback.data) {
                    var updatedProduct = updatedProductCallback.data;
                    if (updatedProduct.selectedCarrier && updatedProduct.selectedProduct) {
                        $rootScope.selectedCarrierIdForBike = updatedProduct.selectedCarrier;
                        $rootScope.selectedProductIdForBike = updatedProduct.selectedProduct
                    }
                    if (_redirectTOResult) {
                        $location.path('/professionalJourneyResult');
                    }
                }
            });
        }

        $scope.confirmBuyProduct = function (_selectedProduct) {
            resultCnfrmBuyFlag = true;
            $scope.buyProduct(_selectedProduct);
        }

        $scope.buyProduct = function (selectedProduct) {
            // if user comes form Dashboard  to renew policy   
            // if (localStorageService.get("renewPolicyDetails")) {
            //     var renewPolicyDetails = localStorageService.get("renewPolicyDetails");
            //     if (localStorageService.get("BIKE_UNIQUE_QUOTE_ID") == renewPolicyDetails.QUOTE_ID) {
            //         $location.path("/proposalresdata").search({ proposalId: renewPolicyDetails.encryptedQuoteId, LOB: 2 });
            //     }
            // }

            $scope.buyScreenTemplate(selectedProduct);
        };

        $scope.buyScreenTemplate = function (selectedProduct) {
            localStorageService.set("bikeSelectedProduct", selectedProduct);
            $scope.selectedProduct = selectedProduct;

            if ($scope.requestId) {
                if ($scope.vehicleDetails.idvOption == 2 || $scope.vehicleDetails.idvOption == 3) {
                    localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.requestId);
                    if (selectedProduct.encryptedQuoteId) {
                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", selectedProduct.encryptedQuoteId);
                    }
                }
            }
            //added by gauri for mautic application
            if (imauticAutomation == true) {
                imatBuyClicked(localStorageService, $scope, 'BuyClicked');
            }
            var buyScreenParam = {};
            buyScreenParam.documentType = "proposalScreenConfig";
            buyScreenParam.businessLineId = localStorageService.get("selectedBusinessLineId");
            buyScreenParam.carrierId = selectedProduct.carrierId;
            buyScreenParam.productId = selectedProduct.productId;
            buyScreenParam.QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
            //code added to hide voluntary Deductable discount if it is 0 or not applicable for carrier from Confirm Buy screen
            $rootScope.voluntaryDeductable = 0;
            $rootScope.antiTheftDeviceAmount = 0;
            for (var i = 0; i < selectedProduct.discountList.length; i++) {
                if (selectedProduct.discountList[i].type == "Voluntary Deductible Discount" && selectedProduct.discountList[i].discountAmount > 0) {
                    $rootScope.voluntaryDeductable = selectedProduct.discountList[i].discountAmount;
                }
                if (selectedProduct.discountList[i].type == "Anti-Theft Discount" && selectedProduct.discountList[i].discountAmount > 0) {
                    $rootScope.antiTheftDeviceAmount = selectedProduct.discountList[i].discountAmount;
                }
            }

            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.productDataReader, buyScreenParam, function (buyScreen) {
                if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {
                    localStorageService.set("buyScreen", buyScreen.data);
                    $scope.productValidation = buyScreen.data.validation;
                    if (!resultCnfrmBuyFlag) {
                        if ($scope.quoteParam.policyType == "renew")
                            $scope.setRangePrevPolicyStartDate();
                        $scope.modalResultCnfrmBuy = true;
                    }

                    if (resultCnfrmBuyFlag) {
                        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                            $rootScope.loading = true;
                            // if (String($location.search().leaddetails) != "undefined") {
                            //     var leaddetails = JSON.parse($location.search().leaddetails);
                            //     localStorageService.set("quoteUserInfo", leaddetails);
                            // }
                            $location.path('/ipos').search({ quoteId: localStorageService.get("BIKE_UNIQUE_QUOTE_ID"), carrierId: $scope.selectedProduct.carrierId, productId: $scope.selectedProduct.productId, lob: $scope.selectedProduct.quoteType });
                        } else {
                            $rootScope.loading = true;
                            $location.path('/buyTwoWheeler');
                        }
                        $scope.$apply();
                    }
                    // getListFromDB(RestAPI, "", $scope.p365Labels.documentType.carCarrier, $scope.p365Labels.request.findAppConfig, function (bikeCarrierList) {
                    //     if (bikeCarrierList.responseCode == $scope.p365Labels.responseCode.success) {
                    //         localStorageService.set("bikeCarrierList", bikeCarrierList.data);
                    //         var docId = $scope.p365Labels.documentType.buyScreen + "-" + localStorageService.get("selectedBusinessLineId");
                    //         if ($scope.resultCnfrmBuyFlag) {
                    //             if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    //                 $rootScope.loading = true;
                    //                 // if (String($location.search().leaddetails) != "undefined") {
                    //                 //     var leaddetails = JSON.parse($location.search().leaddetails);
                    //                 //     localStorageService.set("quoteUserInfo", leaddetails);
                    //                 // }
                    //                 $location.path('/ipos').search({ quoteId: localStorageService.get("BIKE_UNIQUE_QUOTE_ID"), carrierId: $scope.selectedProduct.carrierId, productId: $scope.selectedProduct.productId, lob: $scope.selectedProduct.quoteType });
                    //             } else {
                    //                 $rootScope.loading = true;
                    //                 $location.path('/buyTwoWheeler');
                    //             }
                    //             $scope.$apply();
                    //         }
                    //     } else {
                    //         console.log('unable to proceed due to failed transaction name: findAppConfig for  bikeCarrierList');
                    //         $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                    //     }
                    // });
                } else {
                    console.log('unable to proceed due to failed transaction name: findAppConfig for  bikeCarrierList');
                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                }
            });
        };
        //added for validating registration number
        $scope.validateRegistrationNumber = function (registrationNumber) {
            if (String(registrationNumber) != "undefined") {
                registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
                if ((registrationNumber.trim()).match(/([a-zA-Z]{1,3}[0-9]{1,4})/g) && (registrationNumber.trim()).length <= 7 && (registrationNumber.trim()).length >= 2) {
                    $scope.regNumStatus = false;
                } else {
                    $scope.regNumStatus = true;
                }
                $scope.vehicleInfo.registrationNumber = registrationNumber.trim();
            }
        }
        $rootScope.signout = function () {
            $rootScope.userLoginStatus = false;
            var userLoginInfo = {};
            userLoginInfo.username = "";
            userLoginInfo.status = $rootScope.userLoginStatus;
            localStorageService.set("userLoginInfo", userLoginInfo);
            $location.path("/quote");
        };

        $scope.state = false;
        $scope.toggleState = function () {
            $scope.state = !$scope.state;
        };

        $scope.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
            setTimeout(function () {
                $('.md-click-catcher').click(function () {
                    $scope.activeMenu = '';
                });
            }, 100);
        };

        $scope.clickForActive = function (item) {
            $scope.activeMenu = item;
        };

        $scope.clickForViewActive = function (item) {
            $scope.activeViewMenu = item;
        };

        $scope.clickForViewActive('Compare');

        //$scope.QUOTE_ID=localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
        $scope.EmailChoices = [{ 'username': '', 'addNew': true, paramMap: { 'docId': '', 'LOB': localStorageService.get("selectedBusinessLineId").toString(), 'userId': '', 'selectedPolicyType': '', 'make': '', 'model': '', 'registrationNum': '', 'Variant': '' } }];

        //$scope.modalView=false;
        $scope.modalEmailView = false;
        $scope.emailPopUpDisabled = false;

        if (localStorageService.get("quoteUserInfo")) {
            $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
        }

        $scope.addNewChoice = function () {
            var newItemNo = $scope.EmailChoices.length + 1;
            if (newItemNo <= 3) {
                $scope.EmailChoices.push({
                    'username': ''
                })
                $scope.EmailChoices[0].addNew = false;
                $scope.EmailChoices[1].addNew = true;
                $scope.emailPopUpDisabled = false;
            }
            if (newItemNo == 3) {
                $scope.EmailChoices[2].addNew = false;
                $scope.emailPopUpDisabled = true;
            }
        };

        $scope.removeChoice = function () {
            var lastItem = $scope.EmailChoices.length - 1;
            $scope.EmailChoices.splice(lastItem);
        };

        $scope.showForShare = function (data) {
            if ($rootScope.parseCarrierList) {
                for (var j = 0; j < $rootScope.parseCarrierList.length; j++) {
                    if (data.carrierId == $rootScope.parseCarrierList[j]) {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }
        $scope.sendEmail = function () {

            $scope.flagArray = [];
            var index = -1;
            for (var i = 0; i < $scope.EmailChoices.length; i++) {
                var flagCheck = {};
                if ($scope.EmailChoices[i].username == '' || $scope.EmailChoices[i].username == undefined) {
                    continue;
                }
                //code for encode
                var encodeQuote = localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED");
                var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
                var encodeEmailId = $scope.EmailChoices[i].username;

                var encodeCarrierList = [];
                if ($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0) {
                    encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
                    jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
                } else {
                    encodeCarrierList.push("ALL");

                }

                $scope.EmailChoices[i].funcType = "SHAREVEHICLEQUOTE";

                $scope.EmailChoices[i].isBCCRequired = 'Y';
                $scope.EmailChoices[i].paramMap = {};
                /*$scope.EmailChoices[i].paramMap.docId=String(localStorageService.get("BIKE_UNIQUE_QUOTE_ID"));*/
                $scope.EmailChoices[i].paramMap.docId = String(encodeQuote);
                $scope.EmailChoices[i].paramMap.LOB = String(encodeLOB);
                // $scope.EmailChoices[i].paramMap.make = $scope.vehicleDetails.bikeMakeObject.make;
                // $scope.EmailChoices[i].paramMap.model = $scope.vehicleDetails.bikeModelObject.model;
                // $scope.EmailChoices[i].paramMap.Variant = $scope.vehicleDetails.bikeVariantObject.variant;
                $scope.EmailChoices[i].paramMap.vehicleName = $scope.selectedItem.displayVehicle;
                $scope.EmailChoices[i].paramMap.userId = String(encodeEmailId);
                $scope.EmailChoices[i].paramMap.carriers = String(jsonEncodeCarrierList);
                $scope.EmailChoices[i].paramMap.selectedPolicyType = "Two Wheeler";
                if ($rootScope.vehicleDetails.registrationNumber) {
                    $scope.EmailChoices[i].paramMap.registrationNum = $rootScope.vehicleDetails.registrationNumber.toUpperCase();
                } else {
                    $scope.EmailChoices[i].paramMap.registrationNum = $scope.vehicleInfo.registrationPlace;
                }
                var url = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;

                var request = {};
                var header = {};

                header.messageId = messageIDVar;
                header.campaignID = campaignIDVar;
                header.source = sourceOrigin;
                header.transactionName = sendEmail;
                header.deviceId = deviceIdOrigin;
                request.header = header;
                var arr = $scope.EmailChoices;




                var body = {};
                body.longURL = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;

                $http({ method: 'POST', url: getShortURLLink, data: body }).
                    success(function (shortURLResponse) {

                        if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {

                            index++;
                            request.body = arr[index];
                            request.body.paramMap.url = url;
                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                success(function (callback) {
                                    var emailResponse = JSON.parse(callback);
                                    var receipientNum = $scope.EmailChoices.length;
                                    if (i == receipientNum) {
                                        if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.shareEmailModal = false;
                                            $scope.modalEmailView = true;

                                            /*for(var i=1;i<$scope.EmailChoices.length;i++)
                                            $scope.EmailChoices[i]=[];*/
                                        } else {
                                            localStorageService.set("emailDetails", undefined);
                                        }
                                    }

                                });
                        } else {
                            console.log("error in shoren url service ")

                        }
                    });


            }

        }

        $scope.showShareEmailModal = function () {
            if (localStorageService.get("quoteUserInfo") && localStorageService.get("quoteUserInfo").emailId) {
               // if ($scope.crmEmailSend || $rootScope.wordPressEnabled) {
                if ($rootScope.wordPressEnabled) {
                    //Added by gauri for mautic application				
                    if (imauticAutomation == true) {
                        imatShareQuote(localStorageService, $scope, 'ShareQuote');
                    } else {
                        $scope.sendEmail();
                    }
                    $scope.shareEmailModal = false;
                    $scope.modalEmailView = true;
                } else {
                    $scope.shareEmailModal = true;
                }

            } else {
                $scope.shareEmailModal = true;
            }
        }

        $scope.sendQuotesByEmail = function () {
            var quoteUserInfo = {};
            // if user entered email id then add to tghe localstorage 
            if ($scope.EmailChoices.length > 0) {
                //check for locaal storge for user info
                if (localStorageService.get("quoteUserInfo")) {
                    var quoteUserInfo = localStorageService.get("quoteUserInfo")
                        quoteUserInfo.emailId = $scope.EmailChoices[0].username;
                        localStorageService.set("quoteUserInfo", quoteUserInfo);
                } else {
                    var quoteUserInfo = {};
                    quoteUserInfo.emailId = $scope.EmailChoices[0].username;
                    localStorageService.set("quoteUserInfo", quoteUserInfo);
                }
                 if ($rootScope.wordPressEnabled) {
                if (imauticAutomation == true) {
                    imatShareQuote(localStorageService, $scope, 'ShareQuote');
                } else {
                    $scope.sendEmail();
                }
              }else {
                $scope.sendEmail();
            }
                $scope.shareEmailModal = false;
                $scope.modalEmailView = true;
            }
        }

        $scope.deleteReceipient = function (index) {
            $scope.EmailChoices.splice(index, 1);
            if ($scope.EmailChoices.length < 3) {
                $scope.emailPopUpDisabled = false;
                if ($scope.EmailChoices.length == 1) {
                    $scope.EmailChoices[0].addNew = true;
                    $scope.EmailChoices[1].addNew = false;
                } else {
                    $scope.EmailChoices[0].addNew = false;
                    $scope.EmailChoices[1].addNew = true;
                }
            }
        }

        $scope.hideEmailModal = function () {
            $scope.modalEmailView = false;
            $scope.shareEmailModal = false;
        }


        // Create lead with available user information by calling webservice for share email and agency
        $scope.leadCreationUserInfo = function () {
            var userInfoWithQuoteParam = {};
            $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
            localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
            userInfoWithQuoteParam.quoteParam = localStorageService.get("bikeQuoteInputParamaters").quoteParam;
            userInfoWithQuoteParam.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
            userInfoWithQuoteParam.contactInfo = $scope.quoteUserInfo;
            if ($rootScope.agencyPortalEnabled) {
                const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                userInfoWithQuoteParam.contactInfo.createLeadStatus = false;
                userInfoWithQuoteParam.requestSource = sourceOrigin;
                $location.search('createLead', 'false');
                if (localdata) {
                    userInfoWithQuoteParam.userName = localdata.username;
                    userInfoWithQuoteParam.agencyId = localdata.agencyId;
                }
            } else {
                $scope.quoteUserInfo.emailId = $rootScope.decryptedEmailId;
                userInfoWithQuoteParam.requestSource = "web";
            }
            //	Webservice call for lead creation.	-	modification-0010
            if ($scope.quoteUserInfo != null) {
                if (($scope.quoteUserInfo.messageId == '') || ($scope.quoteUserInfoForm.$dirty)) {
                    RestAPI.invoke($scope.p365Labels.transactionName.createLead, userInfoWithQuoteParam).then(function (callback) {
                        if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                            messageIDVar = callback.data.messageId;
                            $scope.quoteUserInfo.messageId = messageIDVar;
                            localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                            $scope.modalView = false;
                        }

                    });

                } else {
                    messageIDVar = $scope.quoteUserInfo.messageId;
                }
            }
        };

        $scope.pdfviewer = function(data){
            console.log('inside pdf viewer');

            var encodeQuote = localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED");
              $rootScope.encryptedQuote_Id = encodeQuote;
              var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
              var encodeEmailId = $scope.EmailChoices[0].username;
              var encodeCarrierList = [];
      
              jsonEncodeCarrierList = [];
              jsonEncodeCarrierList.push(data.carrierId);
             
              $rootScope.encryptedQuote_Id = encodeQuote;
              $rootScope.encryptedLOB = encodeLOB;
              $rootScope.encryptedEmail = encodeEmailId;
              $rootScope.encryptedCarriers = jsonEncodeCarrierList;
              
            var body = {};
            body.longURL = shareQuoteLink + String($rootScope.encryptedQuote_Id) + "&LOB=" + String($rootScope.encryptedLOB) + "&userId=" + String($rootScope.encryptedEmail) + "&carriers=" + String($rootScope.encryptedCarriers)+"&sharePDF=true";
          $http({ method: 'POST', url: getShortURLLink, data: body }).
                    success(function (shortURLResponse) {
        var shortURL = shortURLResponse.data.shortURL;
         if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
          //sending SMS
          var validateAuthParam = {};
          validateAuthParam.paramMap = {};
          validateAuthParam.mobileNumber =  localStorageService.get("quoteUserInfo").mobileNumber;
          validateAuthParam.paramMap.firstName =  localStorageService.get("quoteUserInfo").firstName;
          validateAuthParam.funcType = "SharePDF";
          console.log("quote user info in pdf viewer function is: ",localStorageService.get("quoteUserInfo"));
      
          var encodeQuote = localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED");
              $rootScope.encryptedQuote_Id = encodeQuote;
              var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
              var encodeEmailId = $scope.EmailChoices[0].username;
              var encodeCarrierList = [];
      
              jsonEncodeCarrierList = [];
              jsonEncodeCarrierList.push(data.carrierId);
             
              $rootScope.encryptedQuote_Id = encodeQuote;
              $rootScope.encryptedLOB = encodeLOB;
              $rootScope.encryptedEmail = encodeEmailId;
              $rootScope.encryptedCarriers = jsonEncodeCarrierList;
              validateAuthParam.paramMap.docId = String($rootScope.encryptedQuote_Id);
              validateAuthParam.paramMap.LOB = String($rootScope.encryptedLOB);
              validateAuthParam.paramMap.userId = String($rootScope.encryptedEmail);
              if ($rootScope.encryptedCarriers){
              validateAuthParam.paramMap.carriers = String($rootScope.encryptedCarriers);
              }

              if(shortURL){
              validateAuthParam.paramMap.longURL = shortURL;
              }else{
              validateAuthParam.paramMap.longURL = shareQuoteLink + String($rootScope.encryptedQuote_Id) + "&LOB=" + String($rootScope.encryptedLOB) + "&userId=" + String($rootScope.encryptedEmail) + "&carriers=" + String($rootScope.encryptedCarriers)+"&sharePDF=true";
              }
              
              console.log('validateAuthParam.paramMap is: ',validateAuthParam);    
              getDocUsingParam(RestAPI,"sendSMS", validateAuthParam, function (createOTP) {
                if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                    //var smsHint = "PDF Shared Successfully";
                    $scope.PDFURL = $sce.trustAsResourceUrl(validateAuthParam.paramMap.longURL);
                    $scope.sharePDF = true;
                    // var smsHint = $sce.trustAsHtml("PDF Shared Successfully.please use this link : <a href={{validateAuthParam.paramMap.longURL}}> for pdf download");
                   // $rootScope.P365Alert("Policies365",smsHint, "Ok");
                    
                   console.log("sms sent successfully for share pdf");
                } else {
                    $rootScope.P365Alert("Policies365","unable to sent SMS,right now", "Ok"); 
                }
            });
        }else{
                console.log('failure response for shorten url service');
            }
            })  
          }
        
        $scope.hideSharePDFModal = function (){
                $scope.sharePDF = false;
        }

        $scope.openBikePopup = function (selectedTab, _data) {
            if(_data.netPremium)
            _data.netPremium = Math.floor(Number(_data.netPremium));

            if(_data.totalDiscountAmount)
            _data.totalDiscountAmount = Number(_data.totalDiscountAmount);

            if(_data.totalRiderAmount)
            _data.totalRiderAmount = Number(_data.totalRiderAmount);


            for(var i=0;i<_data.discountList.length;i++)
            {             
                   if(_data.discountList[i].discountAmount)
                   _data.discountList[i].discountAmount=Number(_data.discountList[i].discountAmount);
            }           
            _data.maxIdvValue =Number(_data.maxIdvValue);
            _data.minIdvValue =Number(_data.minIdvValue);
            _data.insuredDeclareValue =Number(_data.insuredDeclareValue);
            _data.serviceTax =Number(_data.serviceTax);
            _data.odpremium = Number(_data.odpremium);
            //_data.llDriverCover =  Number(_data.llDriverCover);
            if(_data.paidDriverCover){
                _data.paidDriverCover = Number(_data.paidDriverCover);
            }else{
                _data.paidDriverCover = 0;
            }
            _data.tppremium = Number(_data.tppremium);

            $scope.bikeProductToBeAddedInCart = _data;
            $rootScope.selectedTabBike = selectedTab;
            $scope.premiumModalBike = !$scope.premiumModalBike;
        }
        $scope.hidePremiumModalBike = function () {
            $scope.premiumModalBike = false;
        }

        // if (localStorageService.get("BikePACoverDetails")) {
        //     $scope.BikePACoverDetails = localStorageService.get("BikePACoverDetails");
        // }

        $scope.PACoverValidity = function (applicable) {
            if (applicable) {
                $rootScope.personalAccidentValidity = [1, 5];
            } else {
                $rootScope.personalAccidentValidity = [];
            }
        }
       // $scope.PACoverValidity($scope.BikePACoverDetails.isPACoverApplicable);
        $scope.togglePACover = function () {
            $scope.PACoverFlag = 0 ;
            $scope.isPACoverApplicableCopyForReset = angular.copy(!$scope.BikePACoverDetails.isPACoverApplicable);
            $scope.PACoverValidity($scope.BikePACoverDetails.isPACoverApplicable);
            $scope.displayForChange = false;
            if ($scope.BikePACoverDetails.isPACoverApplicable) {
                $scope.BikePACoverDetails = {};
                $scope.BikePACoverDetails.isPACoverApplicable = true;
                $scope.PACoverModal = false;
                $scope.PACoverFlag = 1 ;
                $scope.singleClickBikeQuote();
            } else {
                $scope.PACoverModal = true;
                $scope.BikePACoverDetails.existingInsurance = true;
            }
        }
        $scope.changePolicyPlan = function (){
            $scope.odOnlyPlan = !$scope.odOnlyPlan ;
            if($scope.odOnlyPlan){
                $scope.showOdOnlyVModal();
            }
           // $scope.OdOnlyModal = !$scope.OdOnlyModal;
            console.log('inside changePolicyPlan function',$scope.odOnlyPlan);
            
            var prevPolExpDateOption = {};
            $scope.vehicleInfo.TPPolicyExpiryDat = $scope.vehicleInfo.PreviousPolicyExpiryDate;
            prevPolExpDateOption.minimumDayLimit = $scope.vehicleInfo.PreviousPolicyExpiryDate;
            prevPolExpDateOption.changeMonth = true;
            prevPolExpDateOption.changeYear = true;
            prevPolExpDateOption.dateFormat = "dd/mm/yy";
            $scope.tpPolicyExpiryDate = setP365DatePickerProperties(prevPolExpDateOption);
            convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPrevpolicyExpirytDate) {
                convertStringFormatToDate($scope.vehicleInfo.TPPolicyExpiryDate, function (formattedTPpolicyExpiryDate) {
                   
                        var selPrevpolicyExpirytDate = angular.copy(formattedPrevpolicyExpirytDate);
                        var tempCalcTPPolicyExpiryDate = new Date(selPrevpolicyExpirytDate.setFullYear(selPrevpolicyExpirytDate.getFullYear()));
                        tempCalcTPPolicyExpiryDate = new Date(tempCalcTPPolicyExpiryDate.setDate(tempCalcTPPolicyExpiryDate.getDate()+1));
                        convertDateFormatToString(tempCalcTPPolicyExpiryDate, function (formattedTPpolicyExpiryDate) {
                            $scope.vehicleInfo.TPPolicyExpiryDate = formattedTPpolicyExpiryDate;
                            
                    });
                });
            });
            
               
                prevPolExpDateOption.minimumDayLimit = -1825;
                prevPolExpDateOption.maximumDayLimit = 0;
                prevPolExpDateOption.changeMonth = true;
                prevPolExpDateOption.changeYear = true;
                prevPolExpDateOption.dateFormat = "dd/mm/yy";
                $scope.tpPolicyStartDate = setP365DatePickerProperties(prevPolExpDateOption);
            
        }

        $scope.togglePAQuestions = function (key) {
            $scope.BikePACoverDetails = {};
            $scope.BikePACoverDetails.isPACoverApplicable = false;
            $scope.BikePACoverDetails[key] = true;
        }

        //below piece of code written for displaying idv ,rider,discount,insurance Type section menu as pop-up.
        $scope.showPACoverModal = function () {
            $scope.displayForChange = true;
            $scope.PACoverModal = true;
        }

        $scope.hidePACoverModal = function () {
            $scope.PACoverModal = false;
            if (!$scope.displayForChange) {
                $scope.BikePACoverDetails.isPACoverApplicable = $scope.isPACoverApplicableCopyForReset;
            }
        }
        $scope.showRiderModal = function () {
            if (localStorageService.get("bikeQuoteInputParamaters").quoteParam.riders) {
                $scope.selectedAddOn = localStorageService.get("bikeQuoteInputParamaters").quoteParam.riders.length;
            }
            $scope.riderDetailsModal = !$scope.riderDetailsModal;
        }
        $scope.showIDVModal = function () {
            $scope.idvDetailsModal = !$scope.idvDetailsModal;
        }
        $scope.showOdOnlyVModal = function () {
           
            $scope.OdOnlyModal = !$scope.OdOnlyModal;
           // $scope.odOnlyPlan = !$scope.odOnlyPlan;
            console.log("inside show od only modal ",$scope.odOnlyPlan);
           // $scope.singleClickBikeQuote();

        }

        $scope.insuranceTypeModal = false;
        $scope.showInsuranceTypeModal = function () {
            $scope.insuranceTypeModal = true;
        }
        $scope.hideInsuranceTypeModal = function () {
            $scope.insuranceTypeModal = false;
        }

        $scope.hideRiderDetailsModal = function () {
            $scope.resetRiderSelection();
            $scope.riderDetailsModal = false;
        }
        $scope.hideOdOnlyDetailsModal = function () {
            
            $scope.OdOnlyModal = false;
            $scope.odOnlyPlan = false;
            $scope.resetRiderSelection();
        }

        $scope.hideIDVModal = function () {
            $scope.toggleIDVChangeClose();
            $scope.idvDetailsModal = false;
        }

        $scope.showVehicleOwnerModal = function () {
            $scope.ownerTypeModal = !$scope.ownerTypeModal;
            $scope.tempOwner = angular.copy($scope.quoteParam.ownedBy);
        }
        $scope.hideVehicleOwnerModal = function () {
            $scope.quoteParam.ownedBy = angular.copy($scope.tempOwner)
            $scope.ownerTypeModal = false;
        }

        $scope.redirectToResult = function () {
            $scope.leadCreationUserInfo();
        };

        $scope.redirectToAPResult = function () {
            $scope.leadCreationUserInfo();
        };

        $scope.missionCompled = function () {
            $rootScope.loading = false;
        };

        $scope.changeCarrierVehicleVariants = function () {
            $scope.showCarrierVehicleVariants = !$scope.showCarrierVehicleVariants;
            variantList = [];
            if ($scope.carrierVariantList.length == 0 && !$scope.noCarrierVariantFound && $scope.showCarrierVehicleVariants) {
                $scope.displayLoader = true;
                $scope.noCarrierVariantFound = false;
            }
        }

        // Hide the footer navigation links.
        $(".activateFooter").hide();
        $(".activateHeader").hide();
    }]);