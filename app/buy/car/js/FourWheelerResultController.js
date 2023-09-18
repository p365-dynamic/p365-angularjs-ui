/*
 * Description	: This controller file for car quote result.
 * Author		: Yogesh Shisode
 * Date			: 14 June 2016
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */
var jsonEncodeCarrierList = []; 
'use strict';
angular.module('carResult', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('carResultController', ['$scope', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q', '$controller', '$anchorScroll', function ($scope, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q, $controller, $anchorScroll) {

        $scope.EmailChoices = [{ 'username': '', 'addNew': true, paramMap: { 'docId': '', 'LOB': localStorageService.get("selectedBusinessLineId").toString(), 'userId': '', 'selectedPolicyType': '', 'make': '', 'model': '', 'registrationNum': '', 'Variant': '' } }]; //$scope.quoteParam.quoteType
        $scope.p365Labels = insCarQuoteLabels;
        
        // Setting application labels to avoid static assignment
        var applicationLabels = localStorageService.get("applicationLabels");
        $scope.globalLabel = applicationLabels.globalLabels;
        var carQuoteCookie;
       var updateQuoteStatus = false;
        $anchorScroll('home');
        $rootScope.title = $scope.p365Labels.policies365Title.carResultQuote;
        //$rootScope.isBackButtonPressed = false;
        $scope.isRiderFormDirty = false;
        $scope.buyOptionDisabled = false;
        $scope.isThirdPartyResource = false;
        $scope.resetDisplayVehicle = false; 
        //added for ODonly plan
        $scope.odOnlyPlan = false;
        //for wordpress
        if ($rootScope.wordPressEnabled) {
            $scope.rippleColor = '';
        } else {
            $scope.rippleColor = '#f8a201';
        }

        $scope.carPremiumTemplate = wp_path + "buy/common/html/garageModal.html";
        $rootScope.iquoteTabNavigation = wp_path + 'buy/common/html/iquoteTabNavigation.html';

        $scope.carInputSectionHTML = wp_path + 'buy/car/html/CarInputSection.html';
        $scope.carRiderSectionHTML = wp_path + 'buy/car/html/CarRiderSection.html';
        $scope.carIDVSectionHTML = wp_path + 'buy/car/html/CarIDVSection.html';
        $scope.carShareEmailSectionHTML = wp_path + 'buy/car/html/CarShareEmailSection.html';
        $scope.carInsuranceTypeSectionHTML = wp_path + 'buy/car/html/CarInsuranceTypeSection.html';
        $scope.vehicalOwnerTypeSectionHTML = wp_path + 'buy/car/html/VehicalOwnerTypeSection.html';
        $scope.carPACoverSectionHTML = wp_path + 'buy/car/html/CarPACoverSection.html';
       
        if ($location.path() == "/PBCarResult") {
            $scope.PBCarInputSection = wp_path + 'buy/common/html/PBHTML/PBCarInputSection.html';
            $scope.PBCarRidersSection = wp_path + 'buy/common/html/PBHTML/PBCarRidersSection.html';
            $scope.PBCarBestResultSection = wp_path + 'buy/common/html/PBHTML/PBCarBestResultSection.html';
            $scope.inputSectionEnabled = true;
            $scope.ridersSectionEnabled = false;
            $scope.resultSectionEnabled = false;
            $scope.PACoverDeclaration = false;
            $scope.commonInfo = localStorageService.get("professionalQuoteParams").commonInfo;
        }

        $scope.focusInput = true;
        $scope.quoteUserInfo = {};
        $scope.quoteUserInfo.messageId = '';
        $scope.carrierVarients = '';
        $scope.selectedAddOn = '';
        $scope.quoteUserInfo.termsCondition = true;
        $scope.showPrevRiderPlanStatusDiv = false;
        $scope.isPrevPolStatusRiderSelected = false;
        $rootScope.loading = true;
        $scope.resetDisplayVehicle = false;

        $scope.CarPACoverDetails = {};
        $scope.CarPACoverDetails.isPACoverApplicable = false;
        $scope.fuelList = ["PETROL","DIESEL" , "LPG/CNG"];

        var docId = $scope.p365Labels.documentType.quoteResultScreen + "-" + localStorageService.get("selectedBusinessLineId");
        var registrationDetails = {};
        var sharePDFQuote = {};

        //added for Expand & collapse DOM element for ipos 
        $scope.carInputSection = false;
        $scope.idvInputSection = false;
        $scope.riderInputSection = false;
        $scope.discountInfoInputSection = false;
   
        $scope.carInsuranceInputSection = false;
        $scope.ownerInputSection = false;
        $rootScope.isCarProductTabClicked = false;
        $scope.showCarrierVehicleVariants = false;
        //added for iquote+ to display loader on carrier variant selection
        $scope.displayLoader = false;
        $scope.noCarrierVariantFound = false;
 
		$scope.carQuoteRequestFormation = function (carQuoteRequestParam) {
            $scope.quoteRequest = {};
            $scope.quoteRequest.vehicleInfo={};
            $scope.quoteRequest.quoteParam={};
 
            $scope.quoteRequest.vehicleInfo.IDV = carQuoteRequestParam.vehicleInfo.IDV;
            $scope.quoteRequest.vehicleInfo.PreviousPolicyExpiryDate = carQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
            $scope.quoteRequest.vehicleInfo.TPPolicyStartDate = carQuoteRequestParam.vehicleInfo.TPPolicyStartDate;
            $scope.quoteRequest.vehicleInfo.TPPolicyExpiryDate = carQuoteRequestParam.vehicleInfo.TPPolicyExpiryDate
            $scope.quoteRequest.vehicleInfo.RTOCode = carQuoteRequestParam.vehicleInfo.RTOCode;
            $scope.quoteRequest.vehicleInfo.city = carQuoteRequestParam.vehicleInfo.city;
            if(carQuoteRequestParam.vehicleInfo.dateOfRegistration){
                $scope.quoteRequest.vehicleInfo.dateOfRegistration = carQuoteRequestParam.vehicleInfo.dateOfRegistration;
           }
           $scope.quoteRequest.vehicleInfo.idvOption = carQuoteRequestParam.vehicleInfo.idvOption;
           $scope.quoteRequest.vehicleInfo.best_quote_id = carQuoteRequestParam.vehicleInfo.best_quote_id;
           $scope.quoteRequest.vehicleInfo.previousClaim = carQuoteRequestParam.vehicleInfo.previousClaim;
           $scope.quoteRequest.vehicleInfo.registrationNumber = carQuoteRequestParam.vehicleInfo.registrationNumber;
           $scope.quoteRequest.vehicleInfo.registrationPlace = carQuoteRequestParam.vehicleInfo.registrationPlace;
           $scope.quoteRequest.vehicleInfo.state = carQuoteRequestParam.vehicleInfo.state;
           $scope.quoteRequest.vehicleInfo.make = carQuoteRequestParam.vehicleInfo.make;
           $scope.quoteRequest.vehicleInfo.model = carQuoteRequestParam.vehicleInfo.model;
           $scope.quoteRequest.vehicleInfo.variant = carQuoteRequestParam.vehicleInfo.variant.toString();
           if(carQuoteRequestParam.vehicleInfo.fuel){
          // $scope.quoteRequest.vehicleInfo.fuel = carQuoteRequestParam.vehicleInfo.fuel;
           $scope.quoteRequest.vehicleInfo.fuel = "PETROL";
            }  
		   $scope.quoteRequest.vehicleInfo.cubicCapacity = carQuoteRequestParam.vehicleInfo.cubicCapacity;
           $scope.quoteRequest.quoteParam.ncb = carQuoteRequestParam.quoteParam.ncb;
           $scope.quoteRequest.quoteParam.ownedBy = carQuoteRequestParam.quoteParam.ownedBy;
           $scope.quoteRequest.quoteParam.policyType = carQuoteRequestParam.quoteParam.policyType;
           if(carQuoteRequestParam.quoteParam.riders)
           $scope.quoteRequest.quoteParam.riders = carQuoteRequestParam.quoteParam.riders; 
   }

        //function created to get list of carrier specific variants  for iquote+
        $scope.fetchCarrierSpecificVariants = function () {
            var request = {};
            var searchValue = {};
            searchValue = $scope.vehicleInfo.variantId;
            var documentType = "CarMapping";
            $scope.carrierVariantList = [];
            getListFromDB(RestAPI, searchValue, documentType, "findAppConfig", function (callback) {
                imatCarLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                if (callback.responseCode == 1000) {
                    $scope.carrierVariantList = callback.data;
                    $scope.displayLoader = false;
                    $scope.noCarrierVariantFound = false;
                } else {
                    $scope.noCarrierVariantFound = true;
                    $scope.displayLoader = false;
                }

            });
        }
        if (localStorageService.get("quoteUserInfo")) {
            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo").emailId;
        }
        console.log('quote user info in result page is: ',JSON.stringify(localStorageService.get("quoteUserInfo")));

        if (localStorage.getItem('quoteUserInfo')) {
            const quoteUserInfo = JSON.parse(localStorage.getItem('quoteUserInfo'));
            if (quoteUserInfo) {
                $scope.quoteUserInfo = quoteUserInfo;
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
            }
        } 

        //if ($rootScope.agencyPortalEnabled) {
        if ($location.search().messageId) {
            //added by gauri for mautic application for agency portal specific          
            if (imauticAutomation == true) {
                if ($location.search().source) {
                    if ($location.search().source == 'ramp') {
                        //  if(!(localStorageService.get("quoteUserInfo"))){
                        var docId = "LeadProfile-" + $location.search().messageId;
                        getDocUsingIdTransDB(RestAPI, docId, function (callback) {
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

                                    localStorageService.set("quoteUserInfo", quoteUserInfo);
                                    $scope.fetchCarrierSpecificVariants();
                                    // imatCarLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                                } else {
                                    $scope.fetchCarrierSpecificVariants();
                                }
                            } else {
                                $scope.fetchCarrierSpecificVariants();
                            }
                        });
                    } else {
                        $scope.fetchCarrierSpecificVariants();
                        //imatCarLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted')
                    }
                } else {
                    $scope.fetchCarrierSpecificVariants();
                }
            }
        } else if ($rootScope.agencyPortalEnabled || pospEnabled) {
            $scope.fetchCarrierSpecificVariants();
        }

        // Fetch lead id from url for iQuote+.
        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
            if ($location.search().messageId) {
                messageIDVar = $location.search().messageId;
                // $scope.quoteUserInfo.messageId = $location.search().messageId;
            }

            if (String($location.search().leaddetails) != "undefined") {
                var leaddetails = JSON.parse($location.search().leaddetails);
                if (!leaddetails.messageId) {
                    leaddetails.messageId = $location.search().messageId;
                }
                localStorageService.set("quoteUserInfo", leaddetails);
            }
            //added to collapse & expand inputSection for ipos
            $scope.carInputSection = true;
            $scope.idvInputSection = true;
            $scope.riderInputSection = true;
            $scope.discountInfoInputSection = true;
           // $scope.prevZeroDepStatus = true;
        }

        //added to collapse & expand inputSection for ipos
        $scope.showVehicleDetails = function () {
            $scope.carInputSection = !$scope.carInputSection;
        }

        //added to collapse & expand owner Section for ipos
        $scope.showOwnerDetails = function () {

            $scope.ownerInputSection = !$scope.ownerInputSection;
        }

        //added to collapse & expand inputSection for ipos
        $scope.showRiderDetails = function () {
            $scope.riderInputSection = !$scope.riderInputSection;
        }
        //added to collapse & expand inputSection for ipos
        $scope.showInsuranceDetails = function () {
            $scope.carInsuranceInputSection = !$scope.carInsuranceInputSection;
        }

        //added to collapse & expand inputSection for ipos
        $scope.showIDVDetails = function () {
            $scope.idvInputSection = !$scope.idvInputSection;
        }

        //added to collapse & expand inputSection for ipos
        $scope.showDiscountInfoDetails = function () {
            $scope.discountInfoInputSection = !$scope.discountInfoInputSection;
        }
        // $scope.showPrevZeroDepDetails = function () {
        //    // $scope.prevZeroDepStatus = !$scope.prevZeroDepStatus;
        // }

        $scope.backToResultScreen = function () {
            // if ($rootScope.wordPressEnabled) {
            //     $rootScope.isBackButtonPressed = true;
            // }
            if ($rootScope.isProfessionalJourneySelected) {
                $location.path("/professionalJourneyResult");
            } else {
                $location.path("/PBQuote");
            }
        };

        $scope.ownDamageYears = carOwnDamageYears;
        $scope.personalAccidentYears = carPersonalAccidentYears;
        $scope.thirdPartyDamageCoveredYears = carThirdPartyDamageCoveredYears;
        $rootScope.thirdPartyDamageValidity = [3];
        $rootScope.personalAccidentValidity = [1, 3];
        $rootScope.ownDamageValidity = [1, 3];

        $scope.KotakDeclarationForPACover = KotakDeclarationForPACover;
        $scope.idvOptions = IDVOptionsGen;

        $scope.carInsuranceTypes = [];
        $scope.yearList = [];
        $scope.addOnCovers = [];
        $rootScope.vehicleInfo = {};
        $rootScope.vehicleDetails = {};
        $scope.quote = {};
        $scope.insuranceCompanyList = {};
        $scope.insuranceCompanyList.selectedInsuranceCompany = [];
        $scope.selectedAddOnCovers = [];
        $rootScope.carAddOnCoversList = {};
        $rootScope.carAddOnCoversList.selectedAddOnCovers = [];
        $scope.selectPremiumFromResult = {};
        $scope.emailInputParameters = {};
        $scope.emailInputParameters.paramMap = {};
        $scope.defaultMetroList = [];
        $scope.vehicleInfo = {};
        var variantList = [];
        var resultCnfrmBuyFlag = false;
        var buyConfrmFlag = false;

        $scope.userIDVError = false;
        $scope.basicExpanded = false;
        $scope.savingsExpanded = false;
        $scope.ridersExpanded = false;
       // $scope.lpgCngCoverStatus = false;
        //$scope.resultCnfrmBuyFlag = false;
        $scope.prevPolZeroDepStatus = false;
        //$scope.buyConfrmFlag = false;
        $scope.riderDetailsModal = false;
        $scope.idvDetailsModal = false;
        $scope.OdOnlyModal = false;
        $scope.toggleBasicExpanded = function () {
            $scope.basicExpanded = !$scope.basicExpanded;
        };

        $scope.toggleSavingsExpanded = function () {
            $scope.savingsExpanded = !$scope.savingsExpanded;
        };

        $scope.toggleRidersExpanded = function () {
            $scope.ridersExpanded = !$scope.ridersExpanded;
        };

        $scope.quoteParam = localStorageService.get("carQuoteInputParamaters").quoteParam;
        
        $scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;

        if ($scope.vehicleInfo.displayVehicle) {
            $scope.vehicleDisplayName = $scope.vehicleInfo.displayVehicle;
        }

        // if ($scope.quoteParam.userIdv > 0) {
        //     $scope.showIDVPopUp = true;
        // }

        //     if($scope.quoteParam.policyType == 'renew'){
        //     if($scope.vehicleDetails.regYear)
        //     {   
        //         if(parseInt($scope.vehicleDetails.regYear)<2018)
        //         {
        //             $scope.showBundle= false;
        //             $scope.quoteParam.onlyODApplicable = false;
        //         }else
        //         $scope.showBundle= true;          
        //     }
        // }

        //for professional journey prepopulation 
        var  professionalQuoteCarCookie;
        var professionalCarParams = false;
        if(localStorageService.get("professionalQuoteParams")){
         if(localStorageService.get("professionalQuoteParams").carInfo){
            professionalQuoteCarCookie = localStorageService.get("professionalQuoteParams").carInfo;
            professionalCarParams = true;
        }
        }
        if(professionalCarParams) {
            //if(localStorageService.get("professionalQuoteParams").carInfo){
            if (professionalQuoteCarCookie.registrationPlace) {
                    $scope.vehicleInfo.registrationPlace = professionalQuoteCarCookie.registrationPlace;
            } else if (professionalQuoteCarCookie.registrationNumber) {
                    $scope.vehicleInfo.registrationNumber =professionalQuoteCarCookie.registrationNumber;
            }
                    $scope.vehicleDetails.regYear = professionalQuoteCarCookie.registrationYear;
       // }
          }

        $scope.vehicleDetails = localStorageService.get("selectedCarDetails");
        $scope.garageDetails = localStorageService.get("garageDetails");
        $scope.UNIQUE_QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
        var UNIQUE_QUOTE_ID_ENCRYPTED = '';
        UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED");
        // get professional  quote id encrypted 
        if (localStorageService.get("PROF_QUOTE_ID_ENCRYPTED")) {
            $scope.UNIQUE_PROF_QUOTE_ID_ENCRYPTED = localStorageService.get("PROF_QUOTE_ID_ENCRYPTED");
        }

        $scope.defaultMetroList = localStorageService.get("defaultMetroCityList");
        carQuoteCookie = localStorageService.get("carQuoteInputParamaters");
        $scope.passengerCoverSAList = passengerCoverSAList;
        $scope.driverAccidentSAList = driverAccidentSAList;
        $scope.sortTypes = sortTypesVehicleGeneric;
        $scope.autoAssociationStatus = autoAssociationStatusGeneric;
        $scope.antiTheftDeviceStatus = antiTheftDeviceStatusGeneric;
        $scope.carInsuranceTypes = carInsuranceTypeGeneric;
        $scope.policyStatusList = policyStatusListGeneric;
        $scope.ncbList = ncbListGeneric;
        $scope.passengerCoverList = defaultPassengerCover;
        $scope.previousClaimStatus = previousClaimStatusGeneric;
        $scope.carIgnoredRiders = carIngnoredRidersForUI;
        $scope.comparePoliciesDisplayList = comparePoliciesDisplayValues;
        $scope.comparePoliciesTypeList = comparePoliciesTypeListGen;
        $scope.insurancePlanTypes = carInsurancePlanTypesGen;
        $scope.insuranceTypeList = insuranceTypeListGen;
        $rootScope.selectedInsuranceType = $scope.insuranceTypeList[0].value;
        $scope.selectedSortOption = $scope.sortTypes[0];

        //displaying message if no carrier result got
        if ($rootScope.carQuoteRequest) {
            if ($rootScope.carQuoteRequest.length == $rootScope.quoteResultCount) {
                if ($rootScope.carQuoteResult) {
                    if ($rootScope.carQuoteResult.length == 0) {
                        $scope.noQuoteResultFound = true;
                        $rootScope.carQuoteRequest = [];

                        $rootScope.carQuoteRequest.push({
                            status: 2,
                            message: $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg)
                        });
                        // $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                    }
                }
            }
        }


        //default metro list fix
        if (!$scope.defaultMetroList) {
            $scope.defaultMetroList = commonResultLabels.popularRTOList.data;
            localStorageService.set("defaultMetroCityList", $scope.defaultMetroList);
        }

        //code for default selection of individual 	
        $scope.individualClick = function (getOwner) {
            $scope.ownerTypeModal = false
            $scope.quoteCarInputForm.$dirty = true;
            $scope.vehicleDetails.idvOption = 1;
            $scope.singleClickCarQuote();
        }
        $scope.ownerChanged = function (_owneredBy) {
            $scope.vehicleDetails.idvOption = 1;
            if (_owneredBy) {
                $scope.quoteParam.ownedBy = "Organization";
            } else {
                $scope.quoteParam.ownedBy = "Individual";
            }
        }

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

        console.log("$location.search().sharePDF : ",$location.search().sharePDF);
         //code for download share pdf
         if($location.search().sharePDF){
            if ($rootScope.parseCarrierList) {
                for (var j = 0; j < $rootScope.carQuoteResult.length; j++) {
                    if ($rootScope.carQuoteResult[j].carrierId == $rootScope.parseCarrierList[0]) {
                        sharePDFQuote = $rootScope.carQuoteResult[j] ;
                        break ;
                    }
                }
            }

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
            doc.addImage(imgData, 'PNG', 10, 10,35,20, 'p365logo'); 
            var xaxis = 10;
            var yaxis = 20;
            // doc.setTextColor(20);
            // doc.setFontSize(7);
            // doc.text(19,24,'WE CARE.WE SERVE');
            doc.setTextColor(100);
            doc.setFontSize(18);
            doc.text(10,40 ,'Premium Breakup');
            doc.setTextColor(150);
            doc.setFontSize(12);
            doc.text(10,50 ,'Company Name :');
            doc.text(60,50 ,sharePDFQuote.insuranceCompany);
            doc.text(10,60 ,'Vehicle Details :');
            var vehicleDetails = $scope.vehicleInfo.make+" "+" "+$scope.vehicleInfo.model+" "+" "+$scope.vehicleInfo.variant+" "+" "+"("+$scope.vehicleInfo.cubicCapacity+" "+" "+"cc"+")";
            doc.text(60,60,vehicleDetails);
            doc.text(10,80,'Basic coverage :');
            doc.text(60,90,'Basic own damage');
            doc.text(120,90,String(sharePDFQuote.odpremium));                              
            doc.text(60,100,'Basic third party');
            doc.text(120,100,String(sharePDFQuote.tppremium));
            var totalBasicCoverage =Number(sharePDFQuote.odpremium)+Number(sharePDFQuote.tppremium);
            var totalBasicCoverage1 = "+"+totalBasicCoverage ;
            doc.text(120,110,totalBasicCoverage1);
          
            var yaxis = 110; 
            var ycords = yaxis;
            var discountListFlag = false;
            if(sharePDFQuote.totalDiscountAmount > 0){ 
                discountListFlag = true;       
                doc.text(10,120,'Savings/Discounts :');
                var discountCount = sharePDFQuote.discountList.length ;
                var count = 0 ;
                ycords = ycords+10;
                if(count < discountCount){
                doc.text(60,ycords,sharePDFQuote.discountList[count].type);
                doc.text(120,ycords,String(sharePDFQuote.discountList[count].discountAmount));
                count = count+1;
                }
                ycords = ycords+10;
                var totalDiscountAmount ="-"+sharePDFQuote.totalDiscountAmount;
                doc.text(120,ycords,totalDiscountAmount);
            }

            if(discountListFlag){
            if(sharePDFQuote.ridersList){
                var riderCount = 0 ;
                for(var i=0 ; i < sharePDFQuote.ridersList.length ; i++){
                    if(sharePDFQuote.ridersList[i].riderType != 'NA' && sharePDFQuote.ridersList[i].riderType != 'included' && sharePDFQuote.ridersList[i].riderValue > 0){
                        if(riderCount == 0){
                            doc.text(10,ycords,'Add-on cover :');
                        }
                        riderCount+=1;
                        ycords = ycords+10;
                        doc.text(60,ycords,sharePDFQuote.ridersList[i].riderName); 
                        doc.text(120,ycords,String(sharePDFQuote.ridersList[i].riderValue));   
                    }
                }
                if( sharePDFQuote.totalRiderAmount > 0){
                setTimeout(function()  {
                    console.log('inside rider list timeout-1');
                 ycords = ycords+10;
                var totalRiderAmount ="+"+sharePDFQuote.totalRiderAmount;
                doc.text(120,ycords,totalRiderAmount);
                yaxis = ycords+10;
                },500)
            }else{
                yaxis = ycords+10;
            }
            
        }else{
             yaxis = ycords+10;
        }
    }else{
        if(sharePDFQuote.ridersList){
            if(sharePDFQuote.totalRiderAmount > 0 ){
            var riderCount=0;
            for(var i=0 ; i < sharePDFQuote.ridersList.length ; i++){
                if(sharePDFQuote.ridersList[i].riderType != 'NA' && sharePDFQuote.ridersList[i].riderType != 'included' && sharePDFQuote.ridersList[i].riderValue > 0){
                    if(riderCount == 0){
                        doc.text(10,ycords,'Add-on cover :');
                    }
                    riderCount+=1;
                    ycords = ycords+10;
                    doc.text(60,ycords,sharePDFQuote.ridersList[i].riderName); 
                    doc.text(120,ycords,String(sharePDFQuote.ridersList[i].riderValue));   
                }
            }
            if( sharePDFQuote.totalRiderAmount > 0){
            ycords = ycords+10;
            setTimeout(function()  {
                console.log('inside rider list timeout-2');
             ycords = ycords+10;
            var totalRiderAmount ="+"+sharePDFQuote.totalRiderAmount;
            doc.text(120,ycords,totalRiderAmount);
            yaxis = ycords+10;
            },500)
        }else{
            yaxis = ycords+10;
        }
     }
    }
    }
            setTimeout(function()  {
                yaxis = yaxis+10;
            console.log('yaxis in step 6 is :',yaxis);
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
            console.log('yaxis in step 7 is :',yaxis);
            doc.setTextColor(100);
            doc.setFontSize(10);
            yaxis+=30;
            doc.text(70,yaxis,'Navnit Insurance Broking Private Limited');
            doc.setTextColor(150);
            doc.setFontSize(10);
            yaxis+=5;
            doc.text(40,yaxis,'172 Solitaire Corporate Park Building No 1,7th Floor,Andheri-Ghatkopar Link Road,');
            yaxis+=5;
            doc.text(40,yaxis,'Andheri(East),Mumbai,400093,Maharashtra,India.Email-contact@policies365.com');
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
        
        console.log('$rootScope.flag in result page is : ',$rootScope.flag);
        //condition added as when we came from share API the values are being overriden
        if ($rootScope.flag) {
            if (!$scope.vehicleDetails.passengerCover) {
                $scope.vehicleDetails.passengerCover = defaultPassengerCover.riderAmount;
            }
            if (!$scope.vehicleDetails.driverAccidentCover) {
                $scope.vehicleDetails.driverAccidentCover = defaultDriverAccidentCover.riderAmount;
            }
            if (!$scope.vehicleDetails.lpgCngKitCover) {
                $scope.vehicleDetails.lpgCngKitCover = defaultLpgCngKitCover.riderAmount;
            }
            if (!$scope.vehicleDetails.electricalAccessories) {
                $scope.vehicleDetails.electricalAccessories = defaultElectricalAccessoriesCover.riderAmount;
            }
            if (!$scope.vehicleDetails.nonElectricalAccessories) {
                $scope.vehicleDetails.nonElectricalAccessories = defaultNoElectricalAccessoriesCover.riderAmount;
            }
           
        } else {
            $scope.vehicleDetails.passengerCover = defaultPassengerCover.riderAmount;
            $scope.vehicleDetails.driverAccidentCover = defaultDriverAccidentCover.riderAmount;
            $scope.vehicleDetails.lpgCngKitCover = defaultLpgCngKitCover.riderAmount;
            $scope.vehicleDetails.electricalAccessories = defaultElectricalAccessoriesCover.riderAmount;
            $scope.vehicleDetails.nonElectricalAccessories = defaultNoElectricalAccessoriesCover.riderAmount;
        }
        if ($location.search().isForRenewal) {
            if ($scope.vehicleDetails.checkforDriverAccCover) {
                $scope.checkforDriverAccCoverCopy = angular.copy($scope.vehicleDetails.checkforDriverAccCover);
                $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover = defaultDriverAccidentCover.riderAmount;
            } else {
                $scope.checkforDriverAccCoverCopy = angular.copy($scope.vehicleDetails.checkforDriverAccCover);
            }

            if ($scope.vehicleDetails.checkforPsgCover) {
                $scope.checkforPsgCoverCopy = angular.copy($scope.vehicleDetails.checkforPsgCover);
                $scope.vehicleDetails.addOnCoverCustomAmount.passengerCover = defaultPassengerCover.riderAmount;
            } else {
                $scope.checkforPsgCoverCopy = angular.copy($scope.vehicleDetails.checkforPsgCover);
            }
            if ($scope.vehicleDetails.checkforLpgCngCover) {
                $scope.checkforLpgCngCoverCopy = angular.copy($scope.vehicleDetails.checkforLpgCngCover);
                $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = defaultLpgCngKitCover.riderAmount;
            } else {
                $scope.checkforLpgCngCoverCopy = angular.copy($scope.vehicleDetails.checkforLpgCngCover);
            }
        }
        $scope.vehicleDetails.isAntiTheftDevice = String($scope.quoteParam.isAntiTheftDevice) != "undefined" ? ($scope.quoteParam.isAntiTheftDevice == "Y" ? "Yes" : "No") : "Yes";
        $scope.vehicleDetails.isAutoAssociation = String($scope.quoteParam.isARAIMember) != "undefined" ? ($scope.quoteParam.isARAIMember == "Y" ? "Yes" : "No") : "No";
        if ($scope.vehicleDetails.showCarRegAreaStatus) {
            $rootScope.showCarRegAreaStatus = $scope.vehicleDetails.showCarRegAreaStatus;
        }
        $rootScope.vehicleDetails.registrationNumber = $scope.vehicleDetails.registrationNumber;
        $scope.vehicleDetails.regYear = $scope.vehicleInfo.dateOfRegistration.split("/")[2];
       $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
        $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
        $scope.calculatedVehicleRegistrationDate = getDateForDisplay($scope.vehicleInfo.dateOfRegistration);
        //$scope.calculatedVehicleExpiryDate = $scope.vehicleDetails.policyStatus.displayText2;

        // To get the rider list applicable for this user.
        $scope.addOnCovers = localStorageService.get("addOnCoverListForCar");
        $rootScope.carAddOnCoversList.selectedAddOnCovers = $scope.vehicleDetails.selectedAddOnCovers == undefined ? [] : $scope.vehicleDetails.selectedAddOnCovers;
        $scope.vehicleAge = getAgeFromDOB($scope.vehicleInfo.dateOfRegistration);
        addOnCoversWithStatus($scope.addOnCovers, $scope.vehicleAge, function () { });

        $scope.previousPolicyExpiryDateCopy = angular.copy($scope.vehicleInfo.PreviousPolicyExpiryDate);
        var vehicleDetailsCookie = localStorageService.get("carRegistrationDetails");
        if (vehicleDetailsCookie) {
            if (String(vehicleDetailsCookie.registrationNumber) != "undefined" && vehicleDetailsCookie.registrationNumber != null) {
                $rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;
            }
        }

        if (localStorageService.get("carQuoteInputParamaters").quoteParam.riders) {
            $scope.selectedAddOn = localStorageService.get("carQuoteInputParamaters").quoteParam.riders.length;
        }
        //prepopulating selected riders
        $rootScope.carAddOnCoversList.selectedAddOnCovers = [];
         if ($scope.quoteParam.riders) {
            for (var i = 0; i < $scope.addOnCovers.length; i++) {
                for (var j = 0; j < $scope.quoteParam.riders.length; j++) {
                    if ($scope.addOnCovers[i].riderId == $scope.quoteParam.riders[j].riderId) {
       
                        if ($scope.addOnCovers[i].riderId == 20) {
                            $scope.vehicleDetails.checkforDriverAccCover = true;
                            $scope.vehicleDetails.driverAccidentCover = $scope.quoteParam.riders[j].riderAmount;
                            $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover = $scope.vehicleDetails.driverAccidentCover;
                            break;
                        } else if ($scope.addOnCovers[i].riderId == 21) {
                            $scope.vehicleDetails.checkforPsgCover = true;
                            $scope.vehicleDetails.passengerCover = $scope.quoteParam.riders[j].riderAmount;
                            $scope.vehicleDetails.addOnCoverCustomAmount.passengerCover = $scope.vehicleDetails.passengerCover;
                            break;
                        } else if ($scope.addOnCovers[i].riderId == 35) {
                            $scope.vehicleDetails.checkforLpgCngCover = true;
                            $scope.vehicleDetails.lpgCngKitCover = $scope.quoteParam.riders[j].riderAmount;
                            $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = $scope.vehicleDetails.lpgCngKitCovers;
                            break;
                        } else if ($scope.addOnCovers[i].riderId == 25) {
                            $scope.vehicleDetails.checkforAccessoriesCover = true;
                            $scope.vehicleDetails.checkforElectrical = true;
                            $scope.vehicleDetails.lpgCngKitCover = $scope.quoteParam.riders[j].riderAmount;
                            $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = $scope.vehicleDetails.lpgCngKitCovers;
                            break;
                        } else if ($scope.addOnCovers[i].riderId == 30) {
                            $scope.vehicleDetails.checkforAccessoriesCover = true;
                            $scope.vehicleDetails.checkforNonElectrical = true;
                            $scope.vehicleDetails.lpgCngKitCover = $scope.quoteParam.riders[j].riderAmount;
                            $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = $scope.vehicleDetails.lpgCngKitCovers;
                            break;
                        }else if ($scope.addOnCovers[i].riderId == 6) {
                            $scope.vehicleDetails.checkZeroDepCover = true;
 
                        }
                        if ($scope.addOnCovers[i].riderId != 20 && $scope.addOnCovers[i].riderId != 21 && $scope.addOnCovers[i].riderId != 35 && $scope.addOnCovers[i].riderId != 25 && $scope.addOnCovers[i].riderId != 30) {
                            $rootScope.carAddOnCoversList.selectedAddOnCovers.push($scope.addOnCovers[i]);
                            break;
                        }
                    }
                }
            }
        }

        if($scope.quoteParam.riders){
        for(var i = 0 ; i < $scope.quoteParam.riders.length; i++){
                if($scope.quoteParam.riders[i].riderId == 11){
                    $scope.CarPACoverDetails={};
                   $scope.CarPACoverDetails.isPACoverApplicable = true;
                   $scope.PACoverModal = false;
                   $scope.PACoverFlag = 1 ;                 
                    break;
                }               
            }
        }

        $scope.addOnCoverCustomAmt = function () {
            if ($scope.vehicleDetails.addOnCoverCustomAmount != null && JSON.stringify($scope.vehicleDetails.addOnCoverCustomAmount) != "undefined") {
                $scope.vehicleDetails.passengerCover = $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover > 0 ? $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover : $scope.vehicleDetails.passengerCover;
                $scope.vehicleDetails.driverAccidentCover = $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover > 0 ? $scope.vehicleDetails.driverAccidentCover : $scope.vehicleDetails.driverAccidentCover;
                $scope.vehicleDetails.electricalAccessories = $scope.vehicleDetails.addOnCoverCustomAmount.electricalAccessories > 0 ? $scope.vehicleDetails.addOnCoverCustomAmount.electricalAccessories : $scope.vehicleDetails.electricalAccessories;
                $scope.vehicleDetails.nonElectricalAccessories = $scope.vehicleDetails.addOnCoverCustomAmount.nonElectricalAccessories > 0 ? $scope.vehicleDetails.addOnCoverCustomAmount.nonElectricalAccessories : $scope.vehicleDetails.nonElectricalAccessories;
                $scope.vehicleDetails.lpgCngKitCover = $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover > 0 ? $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover : $scope.vehicleDetails.lpgCngKitCover;
            } else {
                $scope.vehicleDetails.checkforNonElectrical = false;
                $scope.vehicleDetails.checkforElectrical = false;
                $scope.vehicleDetails.checkforPsgCover = false;
                $scope.vehicleDetails.checkforLpgCngCover = false;
                $scope.vehicleDetails.checkforDriverAccCover = false;
                $scope.vehicleDetails.checkforAccessoriesCover = false;
            }
        };

        //function created to reset vehicle details on cancel
        $scope.resetVehicleDetails = function () {
            $scope.vehicleInfoCopy = angular.copy($scope.vehicleInfo);
            $scope.vehicleDetailsCopy = angular.copy($scope.vehicleDetails);
        }
        $scope.addOnCoverCustomAmt();

        // $scope.onClickTab = function (tab) {
        //     if (tab.disabled)
        //         return;
        //     $scope.currentTab = tab.url;
        // };

        // $scope.isActiveTab = function (tabUrl) {
        //     return tabUrl == $scope.currentTab;
        // };

        //for wordPress
        $scope.displayIDVOption = function () {
            $scope.displayIDVLabel = "IDV ";
            if ($scope.vehicleDetails.idvOption == 1) {
                $scope.selectedIDV = $scope.displayIDVLabel + " - Best Deal";
            } else if ($scope.vehicleDetails.idvOption == 2) {
                $scope.selectedIDV = $scope.displayIDVLabel + " - Your IDV";
            } else {
                $scope.selectedIDV = $scope.displayIDVLabel + " - min IDV";
            }
        };

        $scope.displayIDVOption();


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
            $scope.modalMoreDetails = true;
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
            } else if (data.policyType == 'odonly') {
                returnvalue = true;
            }else {
                returnvalue = false;
            }
            return returnvalue;
        }

        $scope.submitPACoverDetails = function (key) {
            $scope.PACoverModal = false;
            $scope.CarPACoverDetails[key] = true;
            localStorageService.set("CarPACoverDetails", $scope.CarPACoverDetails);
            $scope.singleClickCarQuote();
        }

        $scope.planTypeError = false;
        $scope.submitInsuranceType = function (policyType) {
            if ((policyType == $scope.insuranceTypeList[0].value) && $rootScope.ownDamageValidity.length == 0) {
                $scope.planTypeError = true;
            } else if ($scope.CarPACoverDetails.isPACoverApplicable && $rootScope.personalAccidentValidity.length == 0) {
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
                $rootScope.carQuotePolicyType = $rootScope.carQuoteResultCopy;
                $rootScope.carQuoteResult = [];

                if (policyType == $scope.insuranceTypeList[0].value) {
                    for (var i = 0; i < $rootScope.carQuotePolicyType.length; i++) {
                        if ($rootScope.carQuotePolicyType[i][policyType]) {
                            if ($scope.CarPACoverDetails.isPACoverApplicable) {
                                if ($rootScope.ownDamageValidity.indexOf($rootScope.carQuotePolicyType[i]['ownDamagePolicyTerm']) != -1 && $rootScope.thirdPartyDamageValidity.indexOf($rootScope.carQuotePolicyType[i]['liabilityPolicyTerm']) != -1 && $rootScope.personalAccidentValidity.indexOf($rootScope.carQuotePolicyType[i]['PACover']) != -1) {
                                    $rootScope.carQuoteResult.push($rootScope.carQuotePolicyType[i]);
                                }
                            } else {
                                if ($rootScope.ownDamageValidity.indexOf($rootScope.carQuotePolicyType[i]['ownDamagePolicyTerm']) != -1 && $rootScope.thirdPartyDamageValidity.indexOf($rootScope.carQuotePolicyType[i]['liabilityPolicyTerm']) != -1) {
                                    $rootScope.carQuoteResult.push($rootScope.carQuotePolicyType[i]);
                                }
                            }
                        }
                    }

                } else if (policyType == $scope.insuranceTypeList[1].value) {
                    for (var i = 0; i < $rootScope.carQuotePolicyType.length; i++) {
                        if ($rootScope.carQuotePolicyType[i][policyType]) {
                            for (var j = 0; j < $rootScope.thirdPartyDamageValidity.length; j++) {
                                if ($rootScope.carQuotePolicyType[i]['liabilityPolicyTerm'] == $rootScope.thirdPartyDamageValidity[j]) {
                                    $rootScope.carQuoteResult.push($rootScope.carQuotePolicyType[i])
                                }
                            }
                        }
                    }
                }
            }
        }
        //for filter results
        setTimeout(function () {
            $rootScope.carQuoteResultCopy = $rootScope.carQuoteResult;
            if ($scope.quoteParam.policyType == 'new') {
                $rootScope.ownDamageValidity = [1, 3];
                $scope.PACoverValidity($scope.CarPACoverDetails.isPACoverApplicable);
                $scope.filterResult($rootScope.selectedInsuranceType);
            }
        }, 100);

        $scope.toggleIDVChangeClose = function () {
            //$scope.quoteParam.userIdv = localStorageService.get("carQuoteInputParamaters").quoteParam.userIdv;
            $scope.vehicleInfo.IDV = localStorageService.get("carQuoteInputParamaters").vehicleInfo.IDV;
            $scope.vehicleDetails.idvOption = angular.copy($rootScope.idvOptionCopy)
            $scope.displayIDVOption();
            // if ($scope.vehicleDetails.idvOption == 2) {
            //     $scope.showIDVPopUp = true;
            // } else {
            //     $scope.showIDVPopUp = false;
            // }
            $scope.idvDetailsModal = false;
        };


        //function to set IDV when user enters wrong values
        $scope.validateUserIDV = function () {
            if (Number($scope.vehicleInfo.IDV) < $scope.minIDVSuggested || Number($scope.vehicleInfo.IDV) > $scope.maxIDVSuggested) {
                $scope.userIDVError = true;
                $scope.quoteCarInputForm.$setDirty();
            } else {
                $scope.userIDVError = false;
            }
        }
        $scope.updateIDVRange = function () {
            for(var i=0 ; i < $rootScope.carQuoteResult.length ; i++){
                $rootScope.carQuoteResult[i].minIdvValue=Number($rootScope.carQuoteResult[i].minIdvValue);
                $rootScope.carQuoteResult[i].maxIdvValue=Number($rootScope.carQuoteResult[i].maxIdvValue);
            }
            if ($scope.vehicleDetails.idvOption == 2) {
                $rootScope.carQuoteResultMin = $filter('orderBy')($rootScope.carQuoteResult, 'minIdvValue');
                $rootScope.carQuoteResultMax = $filter('orderBy')($rootScope.carQuoteResult, '-maxIdvValue');
                $scope.minIDVSuggested = parseFloat($rootScope.carQuoteResultMin[0].minIdvValue).toFixed(0);
                $scope.maxIDVSuggested = parseFloat($rootScope.carQuoteResultMax[0].maxIdvValue).toFixed(0);
                if ($scope.vehicleInfo.IDV == 0) {
                    $scope.vehicleInfo.IDV = Number($scope.minIDVSuggested);
                }
            } else if ($scope.vehicleDetails.idvOption == 3) {
                $rootScope.carQuoteResult = $filter('orderBy')($rootScope.carQuoteResult, 'minIdvValue');
                $scope.minIDVSuggested = parseFloat($rootScope.carQuoteResult[0].minIdvValue).toFixed(0)
                $scope.maxIDVSuggested = parseFloat($rootScope.carQuoteResult[0].maxIDV).toFixed(0)
                if ($scope.vehicleInfo.IDV == 0) {
                    $scope.vehicleInfo.IDV = Number($scope.minIDVSuggested);
                }
            }
        }

        $scope.updateUserIDV = function () {
            $scope.displayIDVOption();
           // $scope.showIDVPopUp = false;

            if ($scope.vehicleDetails.idvOption == 2) {
               // $scope.showIDVPopUp = true;
                $scope.quoteCarInputForm.$setDirty();
                $scope.updateIDVRange();
                $scope.vehicleInfo.IDV = Number($scope.minIDVSuggested);
                if (Number($scope.vehicleInfo.IDV) < $scope.minIDVSuggested || Number($scope.vehicleInfo.IDV) > $scope.maxIDVSuggested) {
                    $scope.userIDVError = true;
                } else {
                    $scope.userIDVError = false;
                }
            } else if ($scope.vehicleDetails.idvOption == 3) {
                $scope.updateIDVRange();
                $scope.vehicleInfo.IDV = Number($scope.minIDVSuggested);
                $scope.quoteCarInputForm.$setDirty();
                $scope.singleClickCarQuote();
            } else {
                $scope.userIDVError = false;
                $scope.quoteCarInputForm.$setDirty();
                $scope.singleClickCarQuote();
            }
        }


        $scope.garageDataCheck = function (selCarrierID) {
            var returnGarageDataCheck = false;
            if ($scope.garageDetails) {
                for (var i = 0; i < $scope.garageDetails.length; i++) {
                    if ($scope.garageDetails[i].carrierId == selCarrierID) {
                        returnGarageDataCheck = true;
                    }
                }
            }
            return returnGarageDataCheck;
        }

        //added to update IDV range on back-button
        if ($scope.vehicleDetails.idvOption == 2 || $scope.vehicleDetails.idvOption == 3) {
            $scope.updateIDVRange();
        }


        $scope.data = {};
        $scope.data.group1 = 1;
        $scope.modalCompare = false;
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
            $scope.dataLoaded = true;
            $scope.slickLoaded = true;
            $scope.cardView = false;
            $scope.compareView = true;
            $scope.showCompareBtn = true;
            $scope.showCardBtn = true;
            $scope.disableSort = true;
            var riderJson = {};
            $scope.consolatedRiderList = [];
            $scope.consolatedDiscountList = [];
            angular.forEach($rootScope.carQuoteResult, function (quote) {
                angular.forEach(quote.ridersList, function (rider) {
                    if (riderJson[rider.riderId] == null) {
                        $scope.consolatedRiderList.push(rider);
                        riderJson[rider.riderId] = rider.riderName;
                    }
                });
            });
            var discountJson = {};
            angular.forEach($rootScope.carQuoteResult, function (quote) {
                angular.forEach(quote.discountList, function (discount) {
                    if (discountJson[discount.discountId] == null && discount.discountAmount != null && discount.discountAmount != 0) {
                        $scope.consolatedDiscountList.push(discount);
                        discountJson[discount.discountId] = discount.type;
                    }
                });
            });
        };

        $scope.findRider = function (riderId, selRiderData) {
            var returnRidervalue = "NA";
            if (!selRiderData) {
                returnRidervalue = "NA";
            }
            if (selRiderData) {
                for (var i = 0; i < selRiderData.length; i++) {
                    if (selRiderData[i].riderId == riderId) {
                        if (!selRiderData[i].riderType) {
                            selRiderData[i].riderType = "NA"
                        }
                        returnRidervalue = selRiderData[i].riderType;
                    }
                }
            }
            return returnRidervalue;
        }

        $scope.findDiscount = function (discountId, selData) {
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

        $scope.modalVehicleRegistration = false;
        $scope.toggleVehicleRegistrationPopup = function (regAreaStatus) {
            $rootScope.selectedRegData = "";
            $rootScope.vehicleDetails.registrationNumber = "";
            $scope.quoteCarInputForm.$setDirty();

            //reseting chasis number,engine number on click toggling of vehicleRegistrationPopup
            $rootScope.isChasisNumber = false;
            $rootScope.isEngineNumber = false;
            $rootScope.isregNumber = false;

            $scope.vehicleDetails = localStorageService.get("selectedCarDetails");
            $scope.vehicleDetails.engineNumber = '';
            $scope.vehicleDetails.chassisNumber = '';
            $scope.vehicleDetails.isregNumberDisabled = false;
            localStorageService.set("selectedCarDetails", $scope.vehicleDetails);

            if (regAreaStatus == false) {
                $scope.modalVehicleRegistration = false;
                $rootScope.showCarRegAreaStatus = false;
            } else if (regAreaStatus == true) {
                $scope.modalVehicleRegistration = true;
                $rootScope.showCarRegAreaStatus = true;
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

        // Method to get list of cities from DB.
        $scope.getRegPlaceList = function (city) {
            if (city.indexOf('-') > 0)
                city = city.replace('-', '');
            return $http.get(getServiceLink + $scope.p365Labels.documentType.RTODetails + "&q=" + city).then(function (response) {
                return JSON.parse(response.data).data;
            });
        };

        $scope.onSelect = function (item) {
            $scope.modalVehicleRegistration = false;

            $rootScope.selectedCarRegistrationObject = item;

            //flag for disabling registation number
            $rootScope.isregNumber = false;
            //reseting chasis number,engine number on click of vehicleRegistrationPopup
            $scope.vehicleDetails = localStorageService.get("selectedCarDetails");

            $scope.vehicleDetails.engineNumber = '';
            $scope.vehicleDetails.chassisNumber = '';
            $scope.vehicleDetails.isregNumberDisabled = false;

            $scope.vehicleDetails.idvOption = 1;
            $rootScope.carAddOnCoversList.selectedAddOnCovers = [];

            if ($scope.vehicleInfo.registrationNumber) {
                delete $scope.vehicleInfo.registrationNumber
            }
            localStorageService.set("selectedCarDetails", $scope.vehicleDetails);

            var rtoDetail = {};
            rtoDetail.rtoName = item.display;
            rtoDetail.rtoCity = item.city;
            rtoDetail.rtoState = item.state;
            rtoDetail.rtoStatus = true;
            getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
                if (resultedRTOInfo.responseCode == $scope.p365Labels.responseCode.success) {
                    rtoDetail.rtoPincode = resultedRTOInfo.data[0].pincode;

                    if (localStorageService.get("carRegAddress")) {
                        localStorageService.get("carRegAddress").pincode = rtoDetail.pincode;
                        localStorageService.get("carRegAddress").city = $rootScope.selectedCarRegistrationObject.city;
                        localStorageService.get("carRegAddress").state = $rootScope.selectedCarRegistrationObject.state;
                    } else {
                        var getCity = {};
                        getCity.pincode = rtoDetail.pincode;
                        getCity.city = $rootScope.selectedCarRegistrationObject.city;
                        getCity.state = $rootScope.selectedCarRegistrationObject.state;
                        localStorageService.set("carRegAddress", getCity);
                    }
                } else {
                    rtoDetail.rtoPincode = "";

                    if (localStorageService.get("carRegAddress")) {
                        localStorageService.get("carRegAddress").pincode = rtoDetail.pincode;
                        localStorageService.get("carRegAddress").city = $rootScope.selectedCarRegistrationObject.city;
                        localStorageService.get("carRegAddress").state = $rootScope.selectedCarRegistrationObject.state;
                    } else {
                        var getCity = {};
                        getCity.pincode = rtoDetail.pincode;
                        getCity.city = $rootScope.selectedCarRegistrationObject.city;
                        getCity.state = $rootScope.selectedCarRegistrationObject.state;
                        localStorageService.set("carRegAddress", getCity);
                    }
                }
                $scope.quoteCarInputForm.$setDirty();
                $scope.quoteCarInputForm.carInputForm.$setDirty();
            });
            localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
            $scope.vehicleInfo.registrationPlace = item.display;
            $rootScope.vehicleDetails.registrationNumber = '';
        };

        $scope.setRangePrevPolicyExpiryDate = function () {
            // Setting properties for previous policy expiry date-picker 
            //Yogesh-23052017: Based on discussion with uday, minimum date must start by today. Hence minimum date limit been changed from +1 to 0.
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
                if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
                    $scope.renewal = true;
                    //$scope.calculatedVehicleExpiryDate = $scope.vehicleDetails.policyStatus.displayText2;
                    $scope.setRangePrevPolicyExpiryDate();
                } else {
                    $scope.renewal = false;
                    if (!$rootScope.flag)
                        $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                    //$scope.calculatedVehicleExpiryDate = "";
                }
            } else {
                if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
                    $scope.renewal = true;

                    if (!$rootScope.flag)
                        $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;
                    //$scope.calculatedVehicleExpiryDate = $scope.vehicleDetails.policyStatus.displayText2;
                    $scope.setRangePrevPolicyExpiryDate();
                } else {
                    $scope.renewal = false;
                    if (!$rootScope.flag)
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

        $scope.validateLpgCngKitCover = function () {
            if ($scope.vehicleDetails.checkforLpgCngCover) {
                var minLimit = minLpgCngKitCoverLimit;
                var maxLimit = maxLpgCngKitCoverLimit;
                if ($scope.vehicleDetails.lpgCngKitCover >= minLimit && $scope.vehicleDetails.lpgCngKitCover <= maxLimit) {
                    $scope.invalidLpgCngKitCoverAmount = "";

                    if (($scope.vehicleDetails.addOnCoverCustomAmount == null) ||
                        ($scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover != Number($scope.vehicleDetails.lpgCngKitCover))) {
                        updateQuoteStatus = true;
                    }
                    return true;
                } else {
                    $scope.invalidLpgCngKitCoverAmount = "Please enter amount between " + minLimit + "-" + maxLimit + ".";
                    updateQuoteStatus = false;
                    return false;
                }
            } else {
                if (String($scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover) != "undefined" && $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover > 0) {
                    if (!$rootScope.wordPressEnabled) {
                        $scope.singleClickCarQuote();
                    }
                }
            }
        };

        $scope.validateAccessories = function () {
            if (!$scope.vehicleDetails.checkforAccessoriesCover) {
                if ($scope.vehicleDetails.checkforElectrical || $scope.vehicleDetails.checkforNonElectrical) {
                    $scope.vehicleDetails.checkforElectrical = false;
                    $scope.vehicleDetails.checkforNonElectrical = false;
                    //$scope.calculateQuoteOnAddOnCover();
                    if (!$rootScope.wordPressEnabled) {
                        $scope.singleClickCarQuote();
                    }
                }
            }
        };

        $scope.validateElectricalAccessories = function () {
            var minLimit = minCarAccessoriesLimit;
            var maxLimit = maxCarAccessoriesLimit;
            if ($scope.vehicleDetails.electricalAccessories >= minLimit && $scope.vehicleDetails.electricalAccessories <= maxLimit) {
                $scope.invalidElectricalAccessoriesAmount = "";

                if (($scope.vehicleDetails.addOnCoverCustomAmount == null) ||
                    ($scope.vehicleDetails.addOnCoverCustomAmount.electricalAccessories != Number($scope.vehicleDetails.electricalAccessories))) {
                    updateQuoteStatus = true;
                }
                return true;
            } else {
                $scope.invalidElectricalAccessoriesAmount = "Please enter amount between " + minLimit + "-" + maxLimit + ".";
                updateQuoteStatus = false;
                return false;
            }
        };

        $scope.validateNonElectricalAccessories = function (quoteCallStatus) {
            var minLimit = minCarAccessoriesLimit;
            var maxLimit = maxCarAccessoriesLimit;
            if ($scope.vehicleDetails.nonElectricalAccessories >= minLimit && $scope.vehicleDetails.nonElectricalAccessories <= maxLimit) {
                $scope.invalidNonElectricalAccessoriesAmount = "";

                if (($scope.vehicleDetails.addOnCoverCustomAmount == null) ||
                    ($scope.vehicleDetails.addOnCoverCustomAmount.nonElectricalAccessories != Number($scope.vehicleDetails.nonElectricalAccessories))) {
                   updateQuoteStatus = true;
                }
                return true;
            } else {
                $scope.invalidNonElectricalAccessoriesAmount = "Please enter amount between " + minLimit + "-" + maxLimit + ".";
               updateQuoteStatus = false;
                return false;
            }
        };

        $scope.updateQuoteResult = function () {
            var updateQuoteResultStatus = false;
            if ($scope.vehicleDetails.checkforNonElectrical && $scope.validateNonElectricalAccessories(false)) {
                if (($scope.vehicleDetails.addOnCoverCustomAmount == null) ||
                    ($scope.vehicleDetails.addOnCoverCustomAmount.nonElectricalAccessories != Number($scope.vehicleDetails.nonElectricalAccessories))) {
                    updateQuoteResultStatus = true;
                    updateQuoteStatus = false;
                }
            }

            if ($scope.vehicleDetails.checkforElectrical && $scope.validateElectricalAccessories(false)) {
                if (($scope.vehicleDetails.addOnCoverCustomAmount == null) ||
                    ($scope.vehicleDetails.addOnCoverCustomAmount.electricalAccessories != Number($scope.vehicleDetails.electricalAccessories))) {
                    updateQuoteResultStatus = true;
                    updateQuoteStatus = false;
                }
            }

            if (updateQuoteStatus)
                updateQuoteResultStatus = true;

            if (updateQuoteResultStatus) {
                if (!$rootScope.wordPressEnabled) {
                    $scope.singleClickCarQuote();
                }
            }
        };

        $scope.updateQuoteResultStatus = function () {
            updateQuoteStatus = true;
        };

        $scope.alterRenewal = function () {
            var todayDate = new Date();
            if ($scope.vehicleDetails.insuranceType.type != $scope.carInsuranceTypes[1].type) {
                $scope.quoteParam.policyType = "new";
                $scope.polStatus = false;
                $scope.renewal = false;
                $scope.vehicleDetails.regYear = todayDate.getFullYear().toString();
                $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                //$scope.manufacturingYearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
                $scope.selectedYear = $scope.manufacturingYearList[0];
                //$scope.vehicleDetails.regYear = $scope.manufacturingYearList[0];
                if (!$rootScope.flag) {
                    $scope.vehicleInfo.dateOfRegistration = ("0" + todayDate.getDate().toString()).substr(-2) + "/" + ("0" + (Number(todayDate.getMonth()) + 1).toString()).substr(-2) + "/" + $scope.vehicleDetails.regYear;
                    $scope.vehicleDetails.PreviousPolicyStartDate = makeObjectEmpty($scope.vehicleDetails.PreviousPolicyStartDate, "text");
                    $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                }
                $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                // if ($scope.quoteParam.onlyODApplicable != undefined) {
                //     if ($scope.quoteParam.onlyODApplicable == false || $scope.quoteParam.onlyODApplicable == true) {
                //         delete $scope.quoteParam.onlyODApplicable;
                //     }
                // }
            } else {
                $scope.quoteParam.policyType = "renew";
                // if(!$scope.quoteParam.onlyODApplicable){
                // $scope.quoteParam.onlyODApplicable = false;
                // }
                $scope.polStatus = true;
                $scope.renewal = true;
                // $scope.manufacturingYearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);           
                $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                var current_Year = todayDate.getFullYear();
                if (!$rootScope.flag) {
                    if (current_Year == $scope.vehicleDetails.regYear) {
                        $scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleDetails.regYear;
                    } else {
                        $scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
                    }
                    $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                    convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPolicyExpiryDate) {
                        var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPolicyExpiryDate));
                        var tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
                        tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));

                        convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
                            $scope.vehicleDetails.PreviousPolicyStartDate = formattedPrevPolStartDate;
                        });
                    });
                }
            }
            $scope.changePolStatus();
        };

        $scope.alterRenewal();

        $scope.validateVehicleDetails = function () {
            $scope.setValidityFlag = [];
            if ($scope.vehicleDetails.displayVehicle) {
                $scope.setValidityFlag.pop('selVehicleRequiredFlag');
            } else {
                $scope.setValidityFlag.push('selVehicleRequiredFlag');
            }
        }

        $scope.calculatePersonAge = function () {
            $scope.quoteParam.personAge = getAgeFromDOB($scope.vehicleDetails.formattedDateOfBirth);
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

        $scope.updateSortOrder = function () {
            if ($scope.selectedSortOption.key == 1) {
                $scope.sortKey = "grossPremium";
            } else if ($scope.selectedSortOption.key == 2) {
                $scope.sortKey = "insuredDeclareValue";
            } else if ($scope.selectedSortOption.key == 3) {
                $scope.sortKey = "insurerIndex";
            }
            $scope.sortReverse = !$scope.sortReverse;
        };

        // $scope.editPrevZeroDepBtn = true;
        // $scope.togglePrevZeroDepChange = function () {
        //     $scope.tempPrevPolicyZeroDepStatus = angular.copy($scope.vehicleInfo.previousPolicyZeroDepStatus);
        //     $('.secondPane').addClass('opened');
        //     $('.secondPaneContent').show();
        //     if ($('.viewPrevZeroDepDiv').is(':visible') == true) {
        //         // $(".modifyPrevZeroDepDiv").slideDown();
        //         // $(".viewPrevZeroDepDiv").slideUp();
        //         $scope.editPrevZeroDepBtn = false;
        //         $scope.cancelPrevZeroDepBtn = true;
        //     } else if ($('.modifyPrevZeroDepDiv').is(':visible') == true) {
        //         $scope.editPrevZeroDepBtn = true;
        //         $scope.cancelPrevZeroDepBtn = false;
        //     }
        // };

        // $scope.togglePrevZeroDepChangeClose = function () {
        //     $(".viewPrevZeroDepDiv").slideDown();
        //     $(".modifyPrevZeroDepDiv").slideUp();

        //     $scope.editPrevZeroDepBtn = true;
        //     $scope.cancelPrevZeroDepBtn = false;
        // };

        $scope.changePrevZeroDepValue = function (selectedZeroDepStatus) {
            if (String($scope.selectedCarrier) != "undefined" && $scope.selectedCarrier.length > 0) {
                $scope.selectedCarrier.length = 0;
            }

            //$scope.togglePrevZeroDepChangeClose();
            if ($scope.tempPrevPolicyZeroDepStatus != selectedZeroDepStatus) {
                $scope.singleClickCarQuote();
            }
        };
        $scope.showPrevPolZeroDepCoverModal = function (selRiderId) {
            if ($scope.quoteParam.policyType == "renew") {
                var riderStatus = false;
                for (var i = 0; i < $rootScope.carAddOnCoversList.selectedAddOnCovers.length; i++) {
                    if ($rootScope.carAddOnCoversList.selectedAddOnCovers[i].riderId == selRiderId) {
                        riderStatus = true;
                        break;
                    }
                }
                $scope.zeroDepRiderListCopy = angular.copy($rootScope.carAddOnCoversList.selectedAddOnCovers);

                if (!riderStatus) {
                    if (!$rootScope.wordPressEnabled) {
                        $scope.modalPrevPolZeroDepCover = true;
                    }
                } else {
                    $scope.vehicleInfo.previousPolicyZeroDepStatus = false;
                    if (!$rootScope.wordPressEnabled) {
                        $scope.singleClickCarQuote();
                    } else {
                        $scope.quoteCarInputForm.$setDirty();
                    }
                    setTimeout(function () { }, 500);
                }
            } else {
                $scope.vehicleInfo.previousPolicyZeroDepStatus = true;
                if (!$rootScope.wordPressEnabled) {
                    $scope.singleClickCarQuote();
                } else {
                    $scope.quoteCarInputForm.$setDirty();
                }
                setTimeout(function () { }, 500);
            }
        };

        $scope.hidePrevPolZeroDepCoverModal = function () {
            if ($scope.zeroDepRiderListCopy) {
                angular.copy($scope.zeroDepRiderListCopy, $rootScope.carAddOnCoversList.selectedAddOnCovers);
            } else {
                $rootScope.carAddOnCoversList.selectedAddOnCovers = [];
            }

            $scope.modalPrevPolZeroDepCover = false;
            $scope.resetRiderSelection();
        };

        $scope.submitPrevPolZeroDepCover = function () {
            $scope.modalPrevPolZeroDepCover = false;
            $scope.singleClickCarQuote();
        };

        $scope.submitPrevPolInvoiceCover = function () {
            $scope.modalPrevInvoiceCover = false;
            $scope.singleClickCarQuote();
        }
        $scope.hidePrevInvoiceCoverModal = function () {
            $scope.modalPrevInvoiceCover = false;
            $scope.resetRiderSelection();
        }
        $scope.submitEngineProtectorCover = function () {
            $scope.modalPrevEngineProtector = false;
            $scope.singleClickCarQuote();
        }
        $scope.hidePrevEngineProtectorModal = function () {
            $scope.modalPrevEngineProtector = false;
            $scope.resetRiderSelection();
        }
        $scope.submitPrevTyreSecureCover = function () {
            $scope.modalPrevTyreSecure = false;
            $scope.singleClickCarQuote();
        }
        $scope.hidePrevTyreSecureModal = function () {
            $scope.modalPrevTyreSecure = false;
            $scope.resetRiderSelection();
        }
        $scope.isMinPremium = function (grossPremiumValue, carrierIDValue) {
            var min = $rootScope.carQuoteResult[0].grossPremium;

            for (var i = 0; i <= $rootScope.carQuoteResult.length - 1; i++) {
                var carrierIdMin = $rootScope.carQuoteResult[i].carrierId;
                if (Number($rootScope.carQuoteResult[i].grossPremium) < min) {
                    min = $rootScope.carQuoteResult[i].grossPremium;
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

        //to open garage in google maps
        var googleMapURL = "https://www.google.co.in/maps/search/";
        $scope.openMap = function (garage) {
            $scope.searchKey = googleMapURL + '' + garage.repairerName + ',' + garage.pincode;
            window.open($scope.searchKey, '_blank');
        }


        $scope.toggleChangeClose = function () {
            angular.copy($scope.vehicleInfoCopy, $scope.vehicleInfo);
            angular.copy($scope.vehicleDetailsCopy, $scope.vehicleDetails);
            $scope.quoteCarInputForm.carInputForm.$setPristine();
            $scope.validateVehicleDetails();
        };
        $rootScope.editForMobile = function () {
            $rootScope.showonEdit = "inline !important";
            $rootScope.hideonEdit = "none !important";
            $scope.flagforMobile = true;
        }
        $scope.toggleChange = function () {
            if ($scope.flagforMobile) {
                $rootScope.showonEdit = "none !important";
                $rootScope.hideonEdit = "inline !important";
                $scope.flagforMobile = false;
            }
            // $('.firstPane').addClass('opened');
            // $('.firstPaneContent').show();
            $scope.vehicleDetails.idvOption = 1;
            // if ($rootScope.viewOptionDisabled == false) {
            if ($scope.quoteParam.riders) {               
                $scope.checkedRider = false;
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
            $scope.singleClickCarQuote();
            //}
        };

        $scope.toggleReportClose = function () {
            angular.copy($scope.vehicleInfoCopy, $scope.vehicleInfo);
            $scope.quoteCarInputForm.$setPristine();
        };

        $scope.toggleReportChange = function () {
            $('.thirdPane').addClass('opened');
            $('.thirdPaneContent').show();
            if ($('.viewReportDiv').is(':visible') == true) {

            } else if ($('.modifyReportDiv').is(':visible') == true) {
                $scope.quoteCarInputForm.$dirty = true;
                $scope.singleClickCarQuote();
            }
        };

        $(".toggleResetChange").click(function () {
            $(this).closest('.InsideWrapper').find('.changeReportText').text('Edit');
            $(this).closest('.InsideWrapper').find('.substituteIcon').addClass('changeicon');
            $(this).closest('.InsideWrapper').find('.substituteIcon').removeClass('submiticon');
        });


        $scope.callSingleClickCarQuote = function () {
            if (localStorageService.get("carProductToBeAddedInCart")) {
                $scope.productInCart = localStorageService.get("carProductToBeAddedInCart");
                $scope.carDetailsCopy = angular.copy(localStorageService.get("carDetailsCopy"));
                $scope.carVehicleInfoCopy = angular.copy(localStorageService.get("carVehicleInfoCopy"));
                $scope.carInfoCopy = angular.copy(localStorageService.get("carInfoCopy"));
            }
            $scope.resultSectionEnabled = true;
            $scope.inputSectionEnabled = false;
            $scope.ridersSectionEnabled = false;
            if ($scope.quoteCarInputForm.$dirty || $scope.isRiderFormDirty) {
                $scope.singleClickCarQuote();
            } else {
                $rootScope.carQuote = {};

                $rootScope.carQuote = $scope.productInCart;
            }
        }

        $scope.errorMessage = function (errorMsg) {
            if ($scope.errorRespCounter && (String($rootScope.carQuoteResult) == "undefined" || $rootScope.carQuoteResult.length == 0)) {
                $scope.errorRespCounter = false;
                $scope.quoteCalcSummaryError = true;
                $scope.quoteCalculationError = errorMsg;
            } else if ($rootScope.carQuoteResult.length > 0) {
                $scope.quoteCalculationError = "";
            }
            $rootScope.loading = false;
            $scope.tooltipPrepare($rootScope.carQuoteResult);
        };

        $scope.tooltipPrepare = function (carResult) {
            if (carResult != null && carResult != "undefined" && carResult.length > 0) {
                var resultCarrierId = [];
                var testCarrierId = [];
                for (var i = 0; i < carResult.length; i++) {
                    var carrierInfo = {};
                    carrierInfo.id = carResult[i].carrierId;
                    carrierInfo.name = carResult[i].insuranceCompany;

                    if (p365Includes(testCarrierId, carResult[i].carrierId) == false) {
                        resultCarrierId.push(carrierInfo);
                        testCarrierId.push(carResult[i].carrierId);
                    }
                }
                $rootScope.resultedCarriers = resultCarrierId;
            }
        };




        //filter for best premium
        $scope.customFilterCar = function () {
            $scope.netPremiumTotalCar = 0;
            $scope.netPremiumAverageCar = 0;
            $scope.netPremiumMaxCar = 0;
            $scope.proffesionalRatingCar = 0;

            for (var i = 0; i < $rootScope.carQuoteResult.length; i++) {
                $rootScope.carQuoteResult[i].premiumRatio = $rootScope.carQuoteResult[i].netPremium/$rootScope.carQuoteResult[i].insuredDeclareValue;
                //Get Total of premium
                $scope.netPremiumTotalCar += $rootScope.carQuoteResult[i].premiumRatio;
                //Get avg of premium
                $scope.netPremiumAverageCar = Number(($scope.netPremiumTotalCar / $rootScope.carQuoteResult.length).toFixed(5));
            }
            for (var i = 0; i < $scope.carQuoteResult.length; i++) {
                $rootScope.carQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageCar / $rootScope.carQuoteResult[i].premiumRatio).toFixed(5));

                if ($rootScope.carQuoteResult[i].netPremiumMax > $scope.netPremiumMaxCar) {
                    $scope.netPremiumMaxCar = $rootScope.carQuoteResult[i].netPremiumMax;
                }
            }
            for (var i = 0; i < $rootScope.carQuoteResult.length; i++) {
                $rootScope.carQuoteResult[i].netPremiumMean = Number((($rootScope.carQuoteResult[i].netPremiumMax / $scope.netPremiumMaxCar) * 5).toFixed(1));
                $rootScope.carQuoteResult[i].proffesionalRating = ($rootScope.carQuoteResult[i].netPremiumMean * 0.3) +
                    ($rootScope.carQuoteResult[i].garageIndex * 0.2) +
                    ($rootScope.carQuoteResult[i].claimIndex * 0.2) +
                    ($rootScope.carQuoteResult[i].insurerIndex * 0.3);
                $rootScope.carQuoteResult[i].proffesionalRating = $rootScope.carQuoteResult[i].proffesionalRating;
                if(!$rootScope.carQuoteResult[i].netPremiumMean){
                    $rootScope.carQuoteResult[i].netPremiumMean = 3.5; 
                }if(!$rootScope.carQuoteResult[i].proffesionalRating){
                    $rootScope.carQuoteResult[i].proffesionalRating = 3.5
                }if(!$rootScope.carQuoteResult[i].insurerIndex){
                    $rootScope.carQuoteResult[i].insurerIndex = 3.5;
                }if(!$rootScope.carQuoteResult[i].claimIndex){
                    $rootScope.carQuoteResult[i].claimIndex = 3.5;
                }if(!$rootScope.carQuoteResult[i].garageIndex){
                    $rootScope.carQuoteResult[i].garageIndex = 3.5;
                }
            }
            $rootScope.carQuoteResult = $filter('orderBy')($rootScope.carQuoteResult, 'proffesionalRating');
            $scope.sortReverse = true;
            return true;
        }

        $scope.customFilterCarSelectedProduct = function () {

            $scope.netPremiumTotalCar = 0;
            $scope.netPremiumAverageCar = 0;
            $scope.netPremiumMaxCar = 0;
            $scope.proffesionalRatingCar = 0;

            for (var i = 0; i < $rootScope.carQuoteResult.length; i++) {
                //Get Total of premium
                $scope.netPremiumTotalCar += $rootScope.carQuoteResult[i].premiumRatio;
                //Get avg of premium
                $scope.netPremiumAverageCar = Number(($scope.netPremiumTotalCar / $rootScope.carQuoteResult.length).toFixed(5));
            }
            for (var i = 0; i < $scope.carQuoteResult.length; i++) {
                $rootScope.carQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageCar / $rootScope.carQuoteResult[i].premiumRatio).toFixed(5));

                if ($rootScope.carQuoteResult[i].netPremiumMax > $scope.netPremiumMaxCar) {
                    $scope.netPremiumMaxCar = $rootScope.carQuoteResult[i].netPremiumMax;
                }
            }
            for (var i = 0; i < $rootScope.carQuoteResult.length; i++) {
                $rootScope.carQuoteResult[i].netPremiumMean = Number((($rootScope.carQuoteResult[i].netPremiumMax / $scope.netPremiumMaxCar) * 5).toFixed(1));
                $rootScope.carQuoteResult[i].proffesionalRating = ($rootScope.carQuoteResult[i].netPremiumMean * 0.3) +
                    ($rootScope.carQuoteResult[i].garageIndex * 0.2) +
                    ($rootScope.carQuoteResult[i].claimIndex * 0.2) +
                    ($rootScope.carQuoteResult[i].insurerIndex * 0.3);
                $rootScope.carQuoteResult[i].proffesionalRating = $rootScope.carQuoteResult[i].proffesionalRating;
            }

            var carrierAllReadyAdded = false;
            if (localStorageService.get("carProductToBeAddedInCart")) {
                for (var i = 0; i < $rootScope.carQuoteResult.length; i++) {
                    if (localStorageService.get("carProductToBeAddedInCart").carrierId == $rootScope.carQuoteResult[i].carrierId) {
                        //hard coded as it has one value
                        $scope.selectProduct($rootScope.carQuoteResult[i], false);
                        $rootScope.carQuote = $rootScope.carQuoteResult[i];
                        $scope.isGotCarQuotes = true;
                        var carrierAllReadyAdded = true;

                        break;
                    }
                }
            }
            if (!carrierAllReadyAdded) {
                $scope.customFilterCar();
                $rootScope.carQuote = $rootScope.carQuoteResult[0];
                $scope.isGotCarQuotes = true;
            }
        }

        $scope.processResult = function (_transactionName) {
            $rootScope.tabSelectionStatus = true;
            $rootScope.carQuoteResultCopy = $rootScope.carQuoteResult;

            if (_transactionName == 'carQuote') {
                $rootScope.carQuoteResultResponseCopy = $rootScope.carQuoteResult;
            }
            $scope.customFilterCarSelectedProduct();
            $scope.tooltipPrepare($rootScope.carQuoteResult);
        };


        $scope.garageListFilter = function () {
            $scope.garageList = {};
            //$scope.garageList.variantId = $scope.vehicleInfo.variantId;
            $scope.garageList.city = $scope.vehicleInfo.city;
            $scope.garageList.regisCode = $scope.vehicleInfo.RTOCode;
            $scope.garageList.make = $scope.vehicleInfo.make;
            RestAPI.invoke(getGarageDetails, $scope.garageList).then(function (callbackGarage) {
                if (callbackGarage.responseCode == $scope.p365Labels.responseCode.success) {
                    var garageResponse = callbackGarage;
                    if (garageResponse != null && String(garageResponse) != "undefined") {
                        $scope.garageDetails = garageResponse.data;
                        localStorageService.set("garageDetails", garageResponse.data)
                    } else {
                        localStorageService.set("garageDetails", undefined);
                        $scope.garageDetails = "";
                    }
                } else {
                    localStorageService.set("garageDetails", undefined);
                    $scope.garageDetails = "";
                }

            });
        }
        $scope.calculateCarQuote = function (carQuoteResult, _transactionName, quoteIdStatus) {
            $rootScope.carQuoteRequest = [];
            $rootScope.carQuoteResult = [];
            $rootScope.carQuoteResultCopy = [];
            $rootScope.carQuoteErrorResponse = [];

            if (_transactionName == 'calculateCarProductQuote') {
                $rootScope.carQuoteResult = $rootScope.carQuoteResultResponseCopy;
            }

            if($scope.odOnlyPlan){
                $scope.quoteParam.policyType ="odonly";
            }
            $scope.quote.quoteParam = $scope.quoteParam;
            $scope.quote.vehicleInfo = $scope.vehicleInfo;

            localStorageService.set("carQuoteInputParamaters", $scope.quote);
            localStorageService.set("selectedCarDetails", $scope.vehicleDetails);

            //For Reset
            $scope.resetVehicleDetails();
            $scope.dataLoaded = false;

            if (carQuoteResult.responseCode == $scope.p365Labels.responseCode.success1) {
                $scope.dataLoaded = true;
                //$scope.slickLoaded=false;
                $rootScope.loading = false;
                $scope.responseCodeList = [];

                $rootScope.carQuoteRequest = carQuoteResult.data;
                $scope.requestId = carQuoteResult.QUOTE_ID;


                if (!$scope.wordPressEnabled && _transactionName == 'carQuote') {
                    $scope.carrierQuoteList = [];
                    if (carQuoteResult.unMappedCarrierId) {
                        $scope.carrierQuoteList = carQuoteResult.unMappedCarrierId;
                    }
                }
                if (quoteIdStatus) {
                    localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.requestId);
                }
                if (carQuoteResult.encryptedQuoteId) {
                   // UNIQUE_QUOTE_ID_ENCRYPTED = carQuoteResult.encryptedQuoteId;
                    localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", carQuoteResult.encryptedQuoteId)
                }

                //added IDV quote ID from Best deal quote ID
                if ($scope.vehicleDetails.idvOption == 1) {
                    localStorageService.set("car_best_quote_id", $scope.requestId);
                }
                //for olark
                olarkCustomParam(localStorageService.get("CAR_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), false);

                //added to display error message if no quote response came
                var quoteResultCount = 0;

                angular.forEach($rootScope.carQuoteRequest, function (obj, i) {
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
                            quoteResultCount += 1;

                            if (carQuoteResponse.QUOTE_ID == $scope.requestId) {
                                $scope.responseCodeList.push(carQuoteResponse.responseCode);

                                if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                        if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
                                            $rootScope.carQuoteResult.push(carQuoteResponse.data.quotes[0]);
                                            $rootScope.carQuoteRequest[i].status = 1;
                                        }
                                    }
                                    $scope.processResult(_transactionName);
                                } else if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.invalidPlan) {
                                    $scope.responseCodeList.push(carQuoteResponse.responseCode);

                                    if (!$scope.wordPressEnabled && _transactionName == 'carQuote') {
                                        $scope.carrierQuoteList.push(obj);
                                    }
                                    if ($rootScope.carQuoteRequest.length == quoteResultCount && _transactionName == 'carQuote') {
                                        if ($rootScope.carQuoteResult.length == 0) {
                                            $scope.noQuoteResultFound = true;
                                        }
                                    }

                                    if(carQuoteResponse.invalidRiderMessage){
                                        $scope.errorMsg = carQuoteResponse.invalidRiderMessage;
                                    }else{
                                        $scope.errorMsg =  carQuoteResponse.message;
                                    }

                                    $rootScope.carQuoteErrorResponse.push({
                                        status: 0,
                                        carrierId :obj.carrierId,
                                        message: $sce.trustAsHtml("<div>We did not get quote from the Insurer. It may be because:</b></div><br/><ul class=errorUL><li class=errorPlacementLeft>1.{{errorMsg}}</li></div>")
                                    })

                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                        if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
                                            $rootScope.carQuoteRequest[i].status = 2;
                                            if (carQuoteResponse.invalidRiderMessage) {
                                                $scope.invalidPlanOption = carQuoteResponse.invalidRiderMessage;
                                                $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml("<div>We did not get quote from the Insurer. It may be because </b></div><br/><ul class=errorUL><li class=errorPlacementLeft>{{invalidPlanOption}}</li></div>");    
                                            
                                            } else {
                                                $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                            }
                                        }
                                    }
                                    $scope.processResult(_transactionName);
                                } else {
                                    if (!$scope.wordPressEnabled && _transactionName == 'carQuote') {
                                        $scope.carrierQuoteList.push(obj);
                                    }
                                    $scope.errorMsg = carQuoteResponse.message;
                                    $rootScope.carQuoteErrorResponse.push({
                                        status: 0,
                                        carrierId :obj.carrierId,
                                        message: $sce.trustAsHtml("<div>We did not get quote from the Insurer. It may be because : </b></div><br/><ul class=errorUL><li class=errorPlacementLeft>1.{{errorMsg}}</li></div>")
                                    })
                                    if ($rootScope.carQuoteRequest.length == quoteResultCount && _transactionName == 'carQuote') {
                                        if ($rootScope.carQuoteResult.length == 0) {
                                            $scope.noQuoteResultFound = true;
                                        }
                                    }
                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                        if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
                                            $rootScope.carQuoteRequest[i].status = 2;
                                            $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        }
                                    }
                                }
                            }
                        }).
                        error(function (data, status) {
                            $scope.responseCodeList.push($scope.p365Labels.responseCode.systemError);
                        });
                });

                $scope.carRequestStatus = 0;
                $scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
                    if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
                        if ($scope.responseCodeList.length == $rootScope.carQuoteRequest.length) {

                            for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                if ($rootScope.carQuoteRequest[i].status == 0) {
                                    $rootScope.carQuoteRequest[i].status = 2;
                                    $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                }
                            }

                            if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success)) {
                                $scope.carRequestStatus = 1;
                            } else if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {

                                $scope.carRequestStatus = 2;
                                if ($rootScope.carQuoteResult.length == 0) {
                                    if (_transactionName == 'carQuote') {
                                        $scope.noQuoteResultFound = true;
                                        $rootScope.carQuoteResultResponseCopy = $rootScope.carQuoteResult;
                                        $rootScope.carQuoteRequest.push({
                                            status: 2,
                                            message: ''
                                        });
                                        $rootScope.carQuoteRequest[0].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                    }
                                }
                                $scope.errorMessage($scope.p365Labels.validationMessages.productNotFoundMsg);
                            } else {
                                $scope.carRequestStatus = 2;
                                $scope.errorMessage($scope.p365Labels.validationMessages.generalisedErrMsg);
                            }
                        }
                }, true);
                setTimeout(function () {
                    if ($scope.quoteParam.policyType == 'new') {
                        $rootScope.ownDamageValidity = [1, 3];
                        $scope.PACoverValidity($scope.CarPACoverDetails.isPACoverApplicable);
                        $rootScope.selectedInsuranceType = 'comprehensive';

                        $scope.filterResult($rootScope.selectedInsuranceType);
                    }
                }, 100);
            } else {
                $scope.responseCodeList = [];

                if (_transactionName == 'carQuote') {
                    $scope.noQuoteResultFound = true;
                    $rootScope.carQuoteResultResponseCopy = $rootScope.carQuoteResult;
                    $rootScope.carQuoteRequest.push({
                        status: 2,
                        message: $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg)
                    });
                    //   $rootScope.carQuoteRequest[0].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                   
                    if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0)
                        $rootScope.carQuoteResult.length = 0;
                }
      
                $scope.errorMessage(carQuoteResult.message);
            }
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
            console.log('variantIdAlreadyExist flag  is::', variantIdAlreadyExist);
            if (!variantIdAlreadyExist) {
                variantList.push(variant);
            }
            console.log('variant list is::', variantList);
        }
       

            // $scope.selectedDisplayVehicle = function (selectedVariant) {
            //     if (selectedVariant) {
            //         var object = {};
            //         if (typeof selectedVariant == typeof object) {
            //             // if (selectedVariant.variantId) {
            //             //     $scope.vehicleInfo.variantId = selectedVariant.variantId;
            //             //     $scope.vehicleDetails.variantId = selectedVariant.variantId;
            //             // }
            //             $scope.vehicleDetails.displayVehicle = selectedVariant.displayVehicle;
            //             $scope.vehicleInfo.make = selectedVariant.make;
            //             $scope.vehicleInfo.model = selectedVariant.model;
            //             $scope.vehicleInfo.variant = selectedVariant.variant.toString();
            //             if(selectedVariant.fuelType){
            //             $scope.vehicleInfo.fuel = selectedVariant.fuelType.toString();
            //             }
            //             $scope.vehicleInfo.cubicCapacity = selectedVariant.cubicCapacity;
            //         } else {
            //             $scope.vehicleDetails.displayVehicle = selectedVariant;
            //         }
            //         $scope.vehicleDisplayName = $scope.vehicleDetails.displayVehicle;
            //         $scope.vehicleDetails.idvOption = 1;
            //         $rootScope.carAddOnCoversList.selectedAddOnCovers = [];
            //         $scope.vehicleDetails.checkforLpgCngCover = false;
            //         $scope.vehicleDetails.checkforDriverAccCover = false;
            //         $scope.vehicleDetails.checkforPsgCover = false;
            //         $scope.vehicleDetails.checkforAccessoriesCover = false;
            //         $scope.vehicleDetails.checkforElectrical = false;
            //         $scope.vehicleDetails.checkforNonElectrical = false;

            //         //fetching carrier specific list of variants in iquote+
            //         if (!$rootScope.wordPressEnabled) {
            //             $scope.carrierVariantList = [];
            //             $scope.carrierQuoteList = [];
            //             variantList = [];
            //             $scope.noCarrierVariantFound = false;
            //             $scope.fetchCarrierSpecificVariants();
            //         }
            //     }
            // };
       
            $scope.callForLanding = function () {
                //logic written only when the user comes from campaign
                //if ($rootScope.wordPressEnabled) {
                    $rootScope.Regpopup = false;
                    $scope.carDisplayNames = localStorageService.get("carMakeListDisplay");
                    var carQuoteCookie = localStorageService.get("carQuoteInputParamaters");
                    if (carQuoteCookie) {			
                        $scope.vehicleInfo.make = carQuoteCookie.vehicleInfo.make;
                        $scope.vehicleInfo.model = carQuoteCookie.vehicleInfo.model;
                        $scope.vehicleInfo.variant = carQuoteCookie.vehicleInfo.variant;
                        $scope.vehicleInfo.cubicCapacity = carQuoteCookie.vehicleInfo.cubicCapacity;
                       // $scope.vehicleInfo.fuel = carQuoteCookie.vehicleInfo.fuel;
                       $scope.vehicleInfo.fuel = "PETROL";
                         $scope.selectedVariantDetails = {
                             "selectedItem" : ""
                         };
                        $scope.selectedVariantDetails.selectedItem = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
                        //$scope.selectedVariant = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
                        $scope.carModelList = [];
                        console.log('$scope.selectedVariantDetails in step 1 carQuoteCookie  is :',$scope.selectedVariantDetails);
                            angular.forEach($scope.carDisplayNames, function (value) {
                                    if (value.make == $scope.vehicleInfo.make) {
                                        $scope.carModelList.push(value.model);
                                    }
                            });
        
                            $scope.carVariantList = [];
                            angular.forEach($scope.carDisplayNames, function (value) {
                                if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
                                        var variantDetails = value.variant+"-"+value.cubicCapacity;
                                        $scope.carVariantList.push(variantDetails);									 					
                                    }
                            });
                                      
                    setTimeout(function () {
                        $scope.vehicleInfo.make = carQuoteCookie.vehicleInfo.make;
                        $scope.vehicleInfo.model = carQuoteCookie.vehicleInfo.model;
                        $scope.vehicleInfo.variant = carQuoteCookie.vehicleInfo.variant;
                        $scope.vehicleInfo.cubicCapacity = carQuoteCookie.vehicleInfo.cubicCapacity;
                       // $scope.vehicleInfo.fuel = carQuoteCookie.vehicleInfo.fuel;
                        $scope.vehicleInfo.fuel = "PETROL"; 
                       //$scope.selectedVariant = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
                        $scope.selectedVariantDetails = {
                            "selectedItem" : ""
                        };
                        $scope.selectedVariantDetails.selectedItem = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";		
        
                        $scope.carModelList = [];
                        console.log('$scope.selectedVariantDetails in settimeout  is :',$scope.selectedVariantDetails);
                            angular.forEach($scope.carDisplayNames, function (value) {
                                
                                    if (value.make == $scope.vehicleInfo.make) {
                                        $scope.carModelList.push(value.model);
                                    }
                            });
                            $scope.carVariantList = [];
                            angular.forEach($scope.carDisplayNames, function (value) {
                                if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
                                        var variantDetails = value.variant+"-"+value.cubicCapacity;
                                        $scope.carVariantList.push(variantDetails);									 					
                                    }
                            });
                    }, 100);
                }
                 else {
                        setTimeout(function () {
                            $scope.vehicleInfo = {};
                            $scope.vehicleInfo.IDV = 0,
                            $scope.vehicleInfo.RTOCode = "MH01",
                            $scope.vehicleInfo.previousClaim ="false",
                            $scope.vehicleInfo.registrationPlace= "MH-01 Mumbai Tardeo",
                            $scope.vehicleInfo.idvOption = 1,
                            $scope.vehicleInfo.make = "Maruti Suzuki";
                            $scope.vehicleInfo.model = "Alto 800";
                            $scope.vehicleInfo.variant = "LX";
                            $scope.vehicleInfo.fuel = "PETROL";
                            $scope.vehicleInfo.cubicCapacity = "796";
        
                        $scope.selectedVariantDetails = {
                            "selectedItem" : ""
                        };
                        $scope.selectedVariantDetails.selectedItem = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
                        
                        //$scope.selectedVariant = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
                      $scope.carModelList = [];
                      console.log('$scope.vehicleInfo.make in else part is :',$scope.selectedVariantDetails);
                          angular.forEach($scope.carDisplayNames, function (value) {
                              
                                  if (value.make == $scope.vehicleInfo.make) {
                                      $scope.carModelList.push(value.model);
                                  }
                          });
                          $scope.carVariantList = [];
                          angular.forEach($scope.carDisplayNames, function (value) {
                            if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
                                    var variantDetails = value.variant+"-"+value.cubicCapacity;
                                    $scope.carVariantList.push(variantDetails);									 					
                                  }
                          });
                    }, 100)
                }
        
            
                $scope.searchText = null;
                $scope.searchText1 = null;
                $scope.searchText2 = null;
                $scope.querySearch = querySearch;
                $scope.modelSearch = modelSearch;
                $scope.variantSearch = variantSearch;

                function querySearch(query) {
                    var filteredVehicle = [];
                    var uniqueVehicle = [];
                    angular.forEach($scope.carDisplayNames, function (value) {
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
                    angular.forEach($scope.carModelList, function (model) {
                        if (filteredModel.length <= 40) {
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
                    angular.forEach($scope.carVariantList, function (value) {
                        if (filteredVariant.length <= 40) {
							console.log('variant details is : ',value);
                            if (value.toLowerCase().includes(query.toLowerCase())) {
                                if(filteredVariant.indexOf(value) == -1){
									var variantDetails = value;
									filteredVariant.push(variantDetails);
                                }
                            }
                        }
					});
					console.log('filteredVariant list is: ',filteredVariant);
                    return filteredVariant;
                }
            }
			
                $scope.selectedDisplayVehicle = function (selectedMake1) {
                    if (selectedMake1) {                     
                        $scope.carModelList = [];
                        //if($scope.resetDisplayVehicle){
							$scope.vehicleInfo.model ="";
							$scope.selectedVariantDetails = {
								"selectedItem" : ""
                            };
                           //// $scope.selectedVariantDetails.selectedItem = "";
						//}
                        angular.forEach($scope.carDisplayNames, function (value) {
							if($scope.carModelList.indexOf(value.model)== -1){	
							if (value.make == selectedMake1) {
                                    $scope.carModelList.push(value.model);
								}
							}
                        });
                        $scope.vehicleDetails.idvOption = 1;
                        $rootScope.carAddOnCoversList.selectedAddOnCovers = [];                        
						console.log('$scope.carModelList is: ',$scope.carModelList);
                    }
				};
				
                $scope.selectedDisplayModel = function(selectedModel1){
                    if (selectedModel1) {
						$scope.carVariantList = [];
                        $scope.filteredCarVariantLst = [];
                        //if($scope.resetDisplayVehicle){
							$scope.selectedVariantDetails = {
								"selectedItem" : ""
                            };
                           // $scope.selectedVariantDetails.selectedItem = "";
						//}
                        angular.forEach($scope.carDisplayNames, function (value) {
                            if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
									if($scope.carVariantList.indexOf(value.variant) == -1){
											var variantDetails = value.variant+""+""+"-"+value.cubicCapacity+""+"cc";
											$scope.carVariantList.push(variantDetails);
                                    }
							}
                        });
                        console.log('$scope.carVariantList  is: ',$scope.carVariantList);                       
                    }
				};
				
                $scope.selectedDisplayVariant = function(selectedVariant){
					console.log('selectedVariant1 in selectedDisplayVariant step 1 is: ',selectedVariant);
					if(selectedVariant){
					 console.log('** selectedVariant in step 2 is ** : ',selectedVariant);
							$scope.selectedVariantDetails.selectedItem  = selectedVariant;
							var variantIndex =  selectedVariant.lastIndexOf("-");
							var ccindex = selectedVariant.lastIndexOf("cc");
							var newccindex = ccindex - variantIndex;
							console.log('newccindex is ***: ',newccindex);
							if(variantIndex!= -1){
								$scope.vehicleInfo.variant = selectedVariant.substr(0,variantIndex);
							}if(ccindex!= -1){
								$scope.vehicleInfo.cubicCapacity = selectedVariant.substr(variantIndex+1,newccindex-1);
                            }
                            $scope.resetDisplayVehicle = true;
						console.log('$scope.selectedVariantDetails in else part is:',$scope.selectedVariantDetails);
					}			                                  
                };
			//}


        $scope.callForLanding();

        // Default selection of selected riders.

        selectedRiderList($scope.addOnCovers, $rootScope.carAddOnCoversList.selectedAddOnCovers, $scope.quoteParam.riders, function () { });

        if (!$scope.wordPressEnabled && !$rootScope.agencyPortalEnabled) {
            $scope.fetchCarrierSpecificVariants();
        }
        $scope.singleClickCarQuote = function (_transactionName) {
            //setTimeout(function(){
            _transactionName = (_transactionName) ? _transactionName : getCarQuote;
            var i;
            var selectedMetroDetails;
            if (($scope.quoteCarInputForm.$valid && $scope.quoteCarInputForm.$dirty) || ($scope.quoteCarInputForm.carInputForm.$valid && $scope.quoteCarInputForm.carInputForm.$dirty) || $scope.isRiderFormDirty || $scope.calcQuoteOnVariant) {
                setTimeout(function () {
                    if ($scope.flagforMobile) {
                        $rootScope.showonEdit = "none !important";
                        $rootScope.hideonEdit = "inline !important";
                        $scope.flagforMobile = false;
                    }

                    $rootScope.loading = true;
                    $scope.dataLoaded = false;
                    $scope.riderDetailsModal = false;
                    $scope.idvDetailsModal = false;
                    $scope.OdOnlyModal = false;
                    $scope.quoteCalcSummaryError = false;
                    $scope.isRiderFormDirty = false;
                    $scope.carRequestStatus = 0;
                    $scope.isGotCarQuotes = false;
                    $scope.noCarrierVariantFound = false;
                    $scope.noQuoteResultFound = false;
                    $scope.quoteCarInputForm.$setPristine();

                    $scope.vehicleDetails.addOnCoverCustomAmount = {};
                    $scope.vehicleInfo.IDV = Number($scope.vehicleInfo.IDV);
                    if (String($scope.selectedCarrier) != "undefined" && $scope.selectedCarrier.length > 0) {
                        $scope.selectedCarrier.length = 0;
                    }

                    if ($rootScope.carAddOnCoversList.selectedAddOnCovers.length > 0) {
                        $scope.riderListCopy = angular.copy($rootScope.carAddOnCoversList.selectedAddOnCovers);
                    }
                    if($scope.quoteParam.quoteType){
                    delete $scope.quoteParam.quoteType;
                    }

                    $scope.quoteParam.riders = [];                   
                    if($scope.PACoverFlag == 1){
                        $scope.PACoverAddon();
                    }
                    
                    selectedRiderList($scope.addOnCovers, $rootScope.carAddOnCoversList.selectedAddOnCovers, $scope.quoteParam.riders, function () {
                        $scope.quote = {};

                        $scope.errorRespCounter = true;

                        // if ($scope.vehicleInfo.fuel == 'DIESEL' || $scope.vehicleInfo.fuel == 'PETROL') {
                        //     $scope.lpgCngCoverStatus = true;
                        // } else {
                        //     $scope.lpgCngCoverStatus = false;
                        // }

                        defaultPassengerCover.riderAmount = Number($scope.vehicleDetails.passengerCover);
                        defaultPassengerCover.seatingCapacity = Number($scope.vehicleInfo.seatingCapacity);
                        defaultDriverAccidentCover.riderAmount = Number($scope.vehicleDetails.driverAccidentCover);
                        defaultLpgCngKitCover.riderAmount = Number($scope.vehicleDetails.lpgCngKitCover);

                        if ($scope.validateElectricalAccessories(false)) {
                            defaultElectricalAccessoriesCover.riderAmount = Number($scope.vehicleDetails.electricalAccessories);
                        } else {
                            defaultElectricalAccessoriesCover.riderAmount = defaultElectricalAccessoriesCover.riderAmount;
                            $scope.vehicleDetails.electricalAccessories = defaultElectricalAccessoriesCover.riderAmount;
                            $scope.invalidElectricalAccessoriesAmount = "";
                        }

                        if ($scope.validateNonElectricalAccessories(false)) {
                            defaultNoElectricalAccessoriesCover.riderAmount = Number($scope.vehicleDetails.nonElectricalAccessories);
                        } else {
                            defaultNoElectricalAccessoriesCover.riderAmount = defaultNoElectricalAccessoriesCover.riderAmount;
                            $scope.vehicleDetails.nonElectricalAccessories = defaultNoElectricalAccessoriesCover.riderAmount;
                            $scope.invalidNonElectricalAccessoriesAmount = "";
                        }

                        if ($scope.vehicleDetails.checkforDriverAccCover) {
                            $scope.quoteParam.riders.push(defaultDriverAccidentCover);
                            $scope.checkforDriverAccCoverCopy = angular.copy($scope.vehicleDetails.checkforDriverAccCover);
                            $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover = defaultDriverAccidentCover.riderAmount;
                        } else {
                            $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover = 0;
                            $scope.checkforDriverAccCoverCopy = angular.copy($scope.vehicleDetails.checkforDriverAccCover);
                        }


                        if ($scope.vehicleDetails.checkforPsgCover) {
                            $scope.quoteParam.riders.push(defaultPassengerCover);
                            $scope.checkforPsgCoverCopy = angular.copy($scope.vehicleDetails.checkforPsgCover);
                            $scope.vehicleDetails.addOnCoverCustomAmount.passengerCover = defaultPassengerCover.riderAmount;
                        } else {
                            $scope.vehicleDetails.addOnCoverCustomAmount.passengerCover = 0;
                            $scope.checkforPsgCoverCopy = angular.copy($scope.vehicleDetails.checkforPsgCover);
                        }
                        if ($scope.vehicleDetails.checkforLpgCngCover) {
                            $scope.quoteParam.riders.push(defaultLpgCngKitCover);
                            $scope.checkforLpgCngCoverCopy = angular.copy($scope.vehicleDetails.checkforLpgCngCover);
                            $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = defaultLpgCngKitCover.riderAmount;
                        } else {
                            $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = 0;
                            $scope.checkforLpgCngCoverCopy = angular.copy($scope.vehicleDetails.checkforLpgCngCover);
                        }

                        if ($scope.vehicleDetails.checkforAccessoriesCover) {
                            if ($scope.vehicleDetails.checkforElectrical) {
                                $scope.quoteParam.riders.push(defaultElectricalAccessoriesCover);
                                $scope.vehicleDetails.addOnCoverCustomAmount.electricalAccessories = defaultElectricalAccessoriesCover.riderAmount;
                            } else {
                                $scope.vehicleDetails.addOnCoverCustomAmount.electricalAccessories = 0;
                            }

                            if ($scope.vehicleDetails.checkforNonElectrical) {
                                $scope.quoteParam.riders.push(defaultNoElectricalAccessoriesCover);
                                $scope.vehicleDetails.addOnCoverCustomAmount.nonElectricalAccessories = defaultNoElectricalAccessoriesCover.riderAmount;
                            } else {
                                $scope.vehicleDetails.addOnCoverCustomAmount.nonElectricalAccessories = 0;
                            }
                        } else {
                            $scope.vehicleDetails.addOnCoverCustomAmount.nonElectricalAccessories = 0;
                            $scope.vehicleDetails.addOnCoverCustomAmount.electricalAccessories = 0;
                        }
                        $scope.vehicleDetails.selectedAddOnCovers = $rootScope.carAddOnCoversList.selectedAddOnCovers;

                       // $scope.quoteParam.isRiderSelected = "N";
                        if ($scope.quoteParam.riders.length == 0) {
                            $scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
                        } 
                        if ($scope.vehicleDetails.idvOption == 1) {
                            //$scope.quoteParam.userIdv = 0;
                            $scope.vehicleInfo.IDV = 0;
                        }
                        $scope.displayIDVOption();

                        //added to reset idv on cancel of your idv pop-up
                        $rootScope.idvOptionCopy = angular.copy($scope.vehicleDetails.idvOption);

                        //setting Policy Type
                        if ($scope.vehicleDetails.insuranceType.value == $scope.carInsuranceTypes[0].value) {
                           // $scope.vehicleInfo.previousPolicyZeroDepStatus = true;
                            $scope.quoteParam.policyType = "new";
                        } else {
                            $scope.quoteParam.policyType = "renew";
                        }

                        if ($rootScope.selectedCarRegistrationObject != null || String($rootScope.selectedCarRegistrationObject) != "undefined") {
                           // $scope.quoteParam.zone = $rootScope.selectedCarRegistrationObject.zone;
                            $scope.vehicleInfo.city = $rootScope.selectedCarRegistrationObject.city;
                            $scope.vehicleInfo.registrationPlace = $rootScope.selectedCarRegistrationObject.display;
                            $scope.vehicleInfo.RTOCode = $rootScope.selectedCarRegistrationObject.regisCode;
                            $scope.vehicleInfo.state = $rootScope.selectedCarRegistrationObject.state;
                        } else {
                            for (i = 0; i < $scope.defaultMetroList.length; i++) {
                                if ($scope.defaultMetroList[i].city == $scope.vehicleInfo.city) {
                                    for (var j = 0; j < $scope.defaultMetroList[i].RTODetails.length; j++) {
                                        selectedMetroDetails = $scope.defaultMetroList[i].RTODetails[j];
                                        if (selectedMetroDetails.display == $scope.vehicleInfo.registrationPlace) {
                                            $scope.vehicleInfo.city = selectedMetroDetails.city;
                                            // $scope.vehicleInfo.isCostal = selectedMetroDetails.isCostal;
                                            // $scope.vehicleInfo.isAutoAssociation = selectedMetroDetails.isAutoAssociation;
                                            // $scope.vehicleInfo.isEarthQuakeArea = selectedMetroDetails.earthQuakeArea;
                                            $scope.vehicleInfo.RTOCode = selectedMetroDetails.regisCode;
                                            $scope.vehicleInfo.state = selectedMetroDetails.state;
                                            // $scope.quoteParam.customerpinCode = "";
                                            // $scope.quoteParam.customerCity = "";
                                            // $scope.quoteParam.customerState = "";
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        $scope.calculatedVehicleRegistrationDate = getDateForDisplay($scope.vehicleInfo.dateOfRegistration);
                        $scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
                        $scope.vehicleDetails.showCarRegAreaStatus = $rootScope.showCarRegAreaStatus;
                        // if ($scope.vehicleInfo.registrationPlace) {
                        //     $scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0, 2) + $scope.vehicleInfo.registrationPlace.substr(3, 2).trim();
                        // }
                        if ($rootScope.showCarRegAreaStatus) {
                            if($scope.vehicleInfo.registrationPlace.indexOf("-")!=-1){
                            $scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0, 2).toUpperCase() + $scope.vehicleInfo.registrationPlace.substr(3, 2).toUpperCase();
                            }else{
                                $scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0, 4);
                            }
                        } else {
                            $scope.vehicleInfo.RTOCode = $scope.vehicleDetails.registrationNumber.substr(0, 4).toUpperCase();
                        }
                        $scope.vehicleDetails.regYear = String($scope.vehicleInfo.dateOfRegistration.split("/")[2]);
                        $scope.vehicleAge = getAgeFromDOB($scope.vehicleInfo.dateOfRegistration);
                        
                        addOnCoversWithStatus($scope.addOnCovers, $scope.vehicleAge, function () { });
                        
                        if ($scope.vehicleInfo.previousClaim == "true" || $scope.quoteParam.policyType == "new") {
                            $scope.quoteParam.ncb = 0;
                        } else {
                            $scope.quoteParam.ncb = $scope.vehicleDetails.ncb.value;
                        }

                        if (buyConfrmFlag) {
                                resultCnfrmBuyFlag = true;
                                buyConfrmFlag = false;
                        } else {
                                resultCnfrmBuyFlag = false;
                        }
                        //added IDV quote ID based on IDV selection in Result and removing for best deal
                        if ($scope.vehicleDetails.idvOption == 2 || $scope.vehicleDetails.idvOption == 3) {
                            //$scope.quote.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
                            $scope.vehicleInfo.best_quote_id = localStorageService.get("car_best_quote_id");
                        } else {
                            delete $scope.vehicleInfo.best_quote_id
                        }

                        //added by gauri for mautic application
                        if (imauticAutomation == true) {
                            imatCarLeadQuoteInfo(localStorageService, $scope, 'ViewQuote');
                        }

                        if (!$scope.wordPressEnabled && _transactionName == 'calculateCarProductQuote') {
                            $scope.calcQuoteOnVariant = false;
                            $scope.vehicleInfo.carrierVariants = [];
                            if (variantList.length > 0) {
                                $scope.vehicleInfo.carrierVariants = variantList;
                            }
                            // if (localStorageService.get("CAR_UNIQUE_QUOTE_ID")) {
                            //     $scope.quote.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
                            // }
                        }
                        if ($scope.quoteParam.riders) {
                            $scope.selectedAddOn = $scope.quoteParam.riders.length;
                        }
                        
                        if($scope.odOnlyPlan){
                          $scope.quoteParam.policyType ="odonly";
                        }

                        $scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
                        $scope.quote.quoteParam = $scope.quoteParam;
                        $scope.quote.vehicleInfo = $scope.vehicleInfo;
                       // $scope.quote.PACoverDetails = $scope.CarPACoverDetails;
                       
                        // Google Analytics Tracker added.
                        //analyticsTrackerSendData($scope.quote);

                        $scope.requestId = null;
                        updateQuoteStatus = false;

                        if (_transactionName == "calculateCarProductQuote") {
                            if (localStorageService.get("carProductToBeAddedInCart")) {
                                $scope.quote.carrierId = localStorageService.get("carProductToBeAddedInCart").carrierId;
                                $scope.quote.productId = localStorageService.get("carProductToBeAddedInCart").productId;
                            }
                        }
                        // if (localStorageService.get("PROF_QUOTE_ID")) {
                        //     $scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                        // }
                        if (professionalQuoteCarCookie) {
                            var professionalQuoteCookie =localStorageService.get("professionalQuoteParams");
                        }else{
                            professionalQuoteCarCookie = {};
                        }
                        professionalQuoteCarCookie.registrationYear = $scope.vehicleDetails.regYear;
                        professionalQuoteCarCookie.TPPolicyStartDate = $scope.vehicleInfo.TPPolicyStartDate;
                        professionalQuoteCarCookie.TPPolicyExpiryDate = $scope.vehicleInfo.TPPolicyExpiryDate;
                        professionalQuoteCarCookie.make = $scope.vehicleInfo.make;
                        professionalQuoteCarCookie.model = $scope.vehicleInfo.model;
                        professionalQuoteCarCookie.variant = $scope.vehicleInfo.variant;
                        professionalQuoteCarCookie.fuel = $scope.vehicleInfo.fuel;
                        professionalQuoteCarCookie.cubicCapacity = $scope.vehicleInfo.cubicCapacity;
                        professionalQuoteCarCookie.registrationPlace = $scope.vehicleInfo.registrationPlace;                      
                        //professionalQuoteCookie.carInfo =  professionalQuoteCarCookie;
                        
                        localStorageService.set("professionalQuoteParams.carInfo", professionalQuoteCarCookie);
                        // if ($scope.quoteParam.policyType == 'renew') {
                        //     if ($scope.vehicleDetails.regYear) {
                        //         if (parseInt($scope.vehicleDetails.regYear) < 2018) {
                        //             $scope.showBundle = false;
                        //             $scope.quoteParam.onlyODApplicable = false;
                        //         } else {
                        //             $scope.showBundle = true;
                        //         }
                        //     }
                        // }
							$scope.carQuoteRequestFormation($scope.quote);
                        RestAPI.invoke(_transactionName, $scope.quoteRequest).then(function (callback) {
                            if (callback) {
                                $scope.calculateCarQuote(callback, _transactionName, true);
                                $scope.garageListFilter();
                            }
                        });
                    });
                }, 100);
            } else {
                $scope.riderDetailsModal = false;
                $scope.idvDetailsModal = false;
                $scope.OdOnlyModal = false;
            }
        };

        $scope.displaySelecteRidersModal = false;
        $scope.showSelectedRiders = function () {
            $scope.displaySelecteRidersModal = true;
        }
        $scope.hideSelectedRiders = function () {
            $scope.displaySelecteRidersModal = false;
        }


        $scope.calculateQuoteOnAddOnCover = function (selRider) {
            var quoteCalcFlag = true;
            if ($scope.quoteParam.policyType == "renew") {
                var i;
                if (selRider.riderId == 8) {
                    $scope.vehicleInfo.checkEngineProtector = true;
                    var engineProtectorRiderStatus = false;
                    for (i = 0; i < $rootScope.carAddOnCoversList.selectedAddOnCovers.length; i++) {
                        if ($rootScope.carAddOnCoversList.selectedAddOnCovers[i].riderId == selRider.riderId) {
                            engineProtectorRiderStatus = true;
                            break;
                        }
                    }
                    if (!engineProtectorRiderStatus) {
                        if (!$rootScope.wordPressEnabled) {
                            quoteCalcFlag = false;
                            $scope.modalPrevEngineProtector = true;
                        }
                    } else {
                        $scope.vehicleInfo.checkEngineProtector = false;
                        $scope.vehicleInfo.engineProtectorStatus = false;
                        $scope.modalPrevEngineProtector = false;
                    }
                } else if (selRider.riderId == 10) {
                    $scope.vehicleInfo.checkInvoiceCover = true;
                    var invoiceCoverStatus = false;
                    for (i = 0; i < $rootScope.carAddOnCoversList.selectedAddOnCovers.length; i++) {
                        if ($rootScope.carAddOnCoversList.selectedAddOnCovers[i].riderId == selRider.riderId) {
                            invoiceCoverStatus = true;
                            break;
                        }
                    }
                    if (!invoiceCoverStatus) {
                        //$scope.vehicleInfo.roadSideAssistanceStatus=true;
                        if (!$rootScope.wordPressEnabled) {
                            quoteCalcFlag = false;
                            $scope.modalPrevInvoiceCover = true;
                        }
                    } else {
                        $scope.vehicleInfo.checkInvoiceCover = false;
                        $scope.vehicleInfo.invoiceCoverStatus = false;
                        $scope.modalPrevInvoiceCover = false;
                    }
                } else if (selRider.riderId == 37) {
                    $scope.vehicleInfo.checkTyreCoverRider = true;
                    var tyreCoverRiderStatus = false;
                    for (i = 0; i < $rootScope.carAddOnCoversList.selectedAddOnCovers.length; i++) {
                        if ($rootScope.carAddOnCoversList.selectedAddOnCovers[i].riderId == selRider.riderId) {
                            tyreCoverRiderStatus = true;
                            break;
                        }
                    }
                    if (!tyreCoverRiderStatus) {
                        //$scope.vehicleInfo.tyreCoverStatus=true;
                        if (!$rootScope.wordPressEnabled) {
                            quoteCalcFlag = false;
                            $scope.modalPrevTyreSecure = true;
                        }
                    } else {
                        $scope.vehicleInfo.checkTyreCoverRider = false;
                        $scope.vehicleInfo.tyreCoverStatus = false;
                        $scope.modalPrevTyreSecure = false;
                    }
                }
            }
            if (!$rootScope.wordPressEnabled && quoteCalcFlag) {
                $scope.singleClickCarQuote();
            } else {
                $scope.quoteCarInputForm.$setDirty();
            }
            setTimeout(function () { }, 500);
        }

        //function created to calculate quote on submit for p365 wordPress & on-change event for iquote+
        $scope.calculateQuoteOnClick = function () {
            if (!$rootScope.wordPressEnabled) {

                $scope.singleClickCarQuote();
            } else {
                $scope.quoteCarInputForm.$setDirty();
            }
            setTimeout(function () { }, 500);
        }

        // function created to reset rider details in p365 wordPress
        $scope.resetRiderSelection = function () {
            if (localStorageService.get("carQuoteInputParamaters").quoteParam.riders) {
                $scope.selectedAddOn = localStorageService.get("carQuoteInputParamaters").quoteParam.riders.length;
            }
            $scope.vehicleDetails.checkforDriverAccCover = false;
            $scope.vehicleDetails.checkforPsgCover = false;
            $scope.vehicleDetails.checkforLpgCngCover = false;
            $scope.vehicleDetails.checkforAccessoriesCover = false;
            $scope.vehicleDetails.checkforElectrical = false;
            $scope.vehicleDetails.checkforNonElectrical = false;
            $rootScope.carAddOnCoversList.selectedAddOnCovers = [];
            if ($scope.quoteParam.riders) {
                for (var i = 0; i < $scope.addOnCovers.length; i++) {
                    for (var j = 0; j < $scope.quoteParam.riders.length; j++) {
                        if ($scope.addOnCovers[i].riderId == $scope.quoteParam.riders[j].riderId) {
                            if ($scope.addOnCovers[i].riderId == 20) {
                                $scope.vehicleDetails.checkforDriverAccCover = true;
                                $scope.vehicleDetails.driverAccidentCover = $scope.quoteParam.riders[j].riderAmount;
                                $scope.vehicleDetails.addOnCoverCustomAmount.driverAccidentCover = $scope.vehicleDetails.driverAccidentCover;
                                break;
                            } else if ($scope.addOnCovers[i].riderId == 21) {
                                $scope.vehicleDetails.checkforPsgCover = true;
                                $scope.vehicleDetails.passengerCover = $scope.quoteParam.riders[j].riderAmount;
                                $scope.vehicleDetails.addOnCoverCustomAmount.passengerCover = $scope.vehicleDetails.passengerCover;
                                break;
                            } else if ($scope.addOnCovers[i].riderId == 35) {
                                $scope.vehicleDetails.checkforLpgCngCover = true;
                                $scope.vehicleDetails.lpgCngKitCover = $scope.quoteParam.riders[j].riderAmount;
                                $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = $scope.vehicleDetails.lpgCngKitCovers;
                                break;
                            } else if ($scope.addOnCovers[i].riderId == 25) {
                                $scope.vehicleDetails.checkforAccessoriesCover = true;
                                $scope.vehicleDetails.checkforElectrical = true;
                                $scope.vehicleDetails.lpgCngKitCover = $scope.quoteParam.riders[j].riderAmount;
                                $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = $scope.vehicleDetails.lpgCngKitCovers;
                                break;
                            } else if ($scope.addOnCovers[i].riderId == 30) {
                                $scope.vehicleDetails.checkforAccessoriesCover = true;
                                $scope.vehicleDetails.checkforNonElectrical = true;
                                $scope.vehicleDetails.lpgCngKitCover = $scope.quoteParam.riders[j].riderAmount;
                                $scope.vehicleDetails.addOnCoverCustomAmount.lpgCngKitCover = $scope.vehicleDetails.lpgCngKitCovers;
                                break;
                            }
                            if ($scope.addOnCovers[i].riderId != 20 && $scope.addOnCovers[i].riderId != 21 && $scope.addOnCovers[i].riderId != 35 && $scope.addOnCovers[i].riderId != 25 && $scope.addOnCovers[i].riderId != 30) {
                                $rootScope.carAddOnCoversList.selectedAddOnCovers.push($scope.addOnCovers[i]);
                                break;
                            }
                        }
                    }
                }
            }
            
            angular.copy($scope.vehicleInfoCopy, $scope.vehicleInfo);
            $scope.riderDetailsModal = false;
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
                    $scope.vehicleDetails.regYear = $scope.vehicleInfo.dateOfRegistration.split("/")[2];
                    $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                    $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                    $scope.registrationDateError = "";
                });
            }
        };


        $scope.initFourWheelerResultCtrl = function () {
            $rootScope.loading = false;
            // Setting properties for user dob date-picker.
            var dobDateOption = {};
            dobDateOption.minimumYearLimit = "-100Y";
            dobDateOption.maximumYearLimit = "-18Y";
            dobDateOption.changeMonth = true;
            dobDateOption.changeYear = true;
            dobDateOption.dateFormat = "dd/mm/yy";
            $scope.userDateOfBirthOptions = setP365DatePickerProperties(dobDateOption);
            var regDateOption = {};
            // Setting properties for registration date-picker.
            if ($scope.vehicleDetails.insuranceType.type != carInsuranceTypeGeneric[1].type) {
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
        //setting flag for showing quote user info popup in share email
        if ($rootScope.flag) {
            $scope.validateRegistrationDate();
            $scope.validatePrevPolicyStartDate();
            $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.previousPolicyExpiryDateCopy;
            $scope.prevPolZeroDepStatus = $rootScope.prevPolZeroDepStatus;
            $scope.vehicleDetails = localStorageService.get("selectedCarDetails");
            $scope.vehicleDetails.idvOption = $scope.vehicleInfo.idvOption;
            $scope.displayIDVOption();
            $scope.customFilterCar();
            // if ($rootScope.selectedAddOnCovers) {
            //     $rootScope.carAddOnCoversList.selectedAddOnCovers = $rootScope.selectedAddOnCovers;
            // }

            $scope.riderListCopy = angular.copy($rootScope.carAddOnCoversList.selectedAddOnCovers);
            // if ($scope.prevPolZeroDepStatus) {
            //     $scope.vehicleInfo.previousPolicyZeroDepStatus = true;
            // } else {
            //     $scope.vehicleInfo.previousPolicyZeroDepStatus = false;
            // }

            if (localStorageService.get("quoteUserInfo")) {
                $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
            }
            $rootScope.loading = false;
            $rootScope.flag = false;
            //$rootScope.isOlarked = false;
        }
        $scope.initFourWheelerResultCtrl();
        
        $scope.getRegNumber = function (registrationNumber) {
            if (String(registrationNumber) != "undefined") {
                var registrationDetails = {};
                registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
                $scope.vehicleDetails = localStorageService.get("selectedCarDetails");

                $scope.vehicleDetails.engineNumber = '';
                $scope.vehicleDetails.chassisNumber = '';
                $scope.vehicleDetails.isregNumberDisabled = true;
                localStorageService.set("selectedCarDetails", $scope.vehicleDetails);

                //flag for disabling chasis number,engine number,reg number
                $rootScope.isChasisNumber = false;
                $rootScope.isEngineNumber = false;
                $rootScope.isregNumber = false;

                if ((registrationNumber.trim()).match(/^[a-zA-Z]{2}[0-9]{1,2}[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 11 && (registrationNumber.trim()).length > 4) {
                    $rootScope.regNumStatus = false;
                    if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
                        $scope.vehicleInfo.dateOfRegistration = makeObjectEmpty($scope.vehicleInfo.dateOfRegistration, "text");
                    }

                   // $scope.selectedItem = {};
                    $scope.selectedVariantDetails = {
                        "selectedItem" : ""
                    };

                    registrationDetails.registrationNumber = registrationNumber;
                    localStorageService.set("carRegistrationDetails", registrationDetails);

                    var request = {};
                    request.registrationNumber = registrationNumber.toUpperCase();
                    request.lob = "car";
                    request.requestType = 'VEHICLERTOREQCONFIG';

                    RestAPI.invoke($scope.p365Labels.transactionName.getVehicleRTODetails, request).then(function (callback) {
                        if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                            if (callback.data) {
                                var vehicleRTODetails = callback.data;
                                $scope.isCarFound = true;
                                if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
                                    if (vehicleRTODetails.registrationYear) {
                                        var selectedRegYear = vehicleRTODetails.registrationYear;
                                        $scope.vehicleDetails.regYear = selectedRegYear.trim();
                                        $scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
                                        $scope.validateRegistrationDate();
                                    } else {
                                        $scope.isCarFound = false;
                                        $scope.vehicleInfo.dateOfRegistration  = "";
                                    }
                                    if (vehicleRTODetails.dateOfRegistration){
                                        $scope.vehicleInfo.dateOfRegistration = vehicleRTODetails.dateOfRegistration;
                                    }else{
                                        $scope.vehicleInfo.dateOfRegistration = '';
                                    }
                                }
                                // if (vehicleRTODetails.variantId) {
                                //     $scope.vehicleInfo.variantId = vehicleRTODetails.variantId.trim();
                                //     $scope.vehicleDetails.variantId = vehicleRTODetails.variantId.trim();
                                // }
                                if (vehicleRTODetails.uMake && vehicleRTODetails.model && vehicleRTODetails.variant && vehicleRTODetails.fuelType) {
                                    $scope.vehicleInfo.make = vehicleRTODetails.uMake;
                                    $scope.vehicleInfo.model = vehicleRTODetails.model;
                                    $scope.vehicleInfo.variant = vehicleRTODetails.variant;
                                    $scope.vehicleInfo.fuel = vehicleRTODetails.fuelType;
                                    if(vehicleRTODetails.variant && vehicleRTODetails.cubicCapacity){
                                    $scope.selectedVariantDetails.selectedItem =  $scope.selectedVariantDetails.selectedItem = vehicleRTODetails.variant+""+""+"-"+vehicleRTODetails.cubicCapacity+"cc";
                                    }
                                      
                                }else{
                                   // $scope.selectedItem.displayVehicle = '';
                                    $scope.vehicleInfo.make = '';
                                    $scope.vehicleInfo.model = '';
                                    $scope.vehicleInfo.variant = '';
                                    $scope.vehicleInfo.fuel = '';
                                    $scope.vehicleInfo.cubicCapacity = "";
                                    $scope.isCarFound = false;
                                    $scope.fetchingCar = false;
                                }
                                if (vehicleRTODetails.vechileIdentificationNumber) {
                                    $scope.vehicleDetails.chassisNumber = vehicleRTODetails.vechileIdentificationNumber;
                                }
                                if (vehicleRTODetails.engineNumber) {
                                    $scope.vehicleDetails.engineNumber = vehicleRTODetails.engineNumber;
                                }
                                
                                $scope.fetchingCar = false;
                                var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
                                $scope.getRegPlaceListRTO(regNumber, registrationNumber);
                            } else {
                                $scope.isCarFound = false;
                                $scope.fetchingCar = false;
                                $scope.selectedItem.displayVehicle = "";
                               // $scope.vehicleInfo.displayVehicle = "";
                                $scope.vehicleDetails.regYear = "";
                                var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
                                $scope.getRegPlaceListRTO(regNumber, registrationNumber);
                            }
                        } else {
                            $scope.isCarFound = false;
                            $scope.fetchingCar = false;
                            $scope.selectedItem.displayVehicle = "";
                           // $scope.vehicleInfo.displayVehicle = "";
                            $scope.vehicleDetails.regYear = "";
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

        // Method call to get default list form central DB.
        $scope.getRegPlaceListRTO = function (regNumber, registrationNumber) {
            if (regNumber.indexOf('-') > 0)
                regNumber = regNumber.replace('-', '');
            return $http.get(getServiceLink + $scope.p365Labels.documentType.RTODetails + "&q=" + regNumber).then(function (callback) {
                callback = JSON.parse(callback.data);
                if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                    $rootScope.selectedCarRegistrationObject = callback.data[0];
                    $rootScope.vehicleDetails.registrationNumber = registrationNumber.trim();
                    $scope.vehicleInfo.registrationNumber = $rootScope.vehicleDetails.registrationNumber;

                    var rtoDetail = {};
                    rtoDetail.rtoName = $rootScope.selectedCarRegistrationObject.display;
                    rtoDetail.rtoCity = $rootScope.selectedCarRegistrationObject.city;
                    rtoDetail.rtoState = $rootScope.selectedCarRegistrationObject.state;
                    rtoDetail.rtoObject = callback.data[0];
                    rtoDetail.cityStatus = true;
                    rtoDetail.rtoStatus = true;
                    getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
                        if (resultedRTOInfo.responseCode == $scope.p365Labels.responseCode.success) {
                            rtoDetail.pincode = resultedRTOInfo.data[0].pincode;
                            if (localStorageService.get("carRegAddress")) {
                                localStorageService.get("carRegAddress").pincode = rtoDetail.pincode;
                                localStorageService.get("carRegAddress").city = $rootScope.selectedCarRegistrationObject.city;
                                localStorageService.get("carRegAddress").state = $rootScope.selectedCarRegistrationObject.state;
                            } else {
                                var getCity = {};
                                getCity.pincode = rtoDetail.pincode;
                                getCity.city = $rootScope.selectedCarRegistrationObject.city;
                                getCity.state = $rootScope.selectedCarRegistrationObject.state;
                                //getCity.cityStatus = true;
                                localStorageService.set("carRegAddress", getCity);
                            }
                        } else {
                            $scope.pincode = "";
                        }
                        localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
                        $scope.vehicleInfo.registrationPlace = rtoDetail.rtoName;
                    });
                    //resetting idv and rider on regNumber change
                    $rootScope.carAddOnCoversList.selectedAddOnCovers = [];
                    $scope.vehicleDetails.idvOption = 1;
                    $scope.quoteCarInputForm.$setDirty();
                    if ($scope.vehicleInfo.displayVehicle) {
                        $scope.selectedItem.displayVehicle = $scope.vehicleInfo.displayVehicle;
                        //fetching carrier specific list of variants in iquote+
                        if (!$rootScope.wordPressEnabled) {
                            $scope.carrierVariantList = [];
                            $scope.carrierQuoteList = [];
                            $scope.noCarrierVariantFound = false;
                            variantList = [];
                            //$scope.fetchCarrierSpecificVariants();
                        }
                    } else {
                        $scope.selectedItem = {};
                    }
                } else {
                    $rootScope.regNumStatus = true;
                }
            });
        };


        $scope.hideResultCnfrmBuyModal = function () {
            $scope.modalResultCnfrmBuy = false;
        };

        $scope.submitResultCnfrmBuy = function () {
            $scope.modalResultCnfrmBuy = false;
            if ($scope.resultCnfrmBuy.$dirty) {
                $scope.resultCnfrmBuy.$setPristine();
                resultCnfrmBuyFlag = true;
                buyConfrmFlag = true;
                $scope.quoteCarInputForm.$setDirty();
                $scope.singleClickCarQuote();
            } else {
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    $rootScope.loading = true;

                    // if (String($location.search().leaddetails) != "undefined") {
                    //     var leaddetails = JSON.parse($location.search().leaddetails);
                    //     localStorageService.set("quoteUserInfo", leaddetails);
                    // }

                    /*comment because it is causing to reload localStorage old value are getting flush out.
                     * $location.path('/ipos').search({quoteId:localStorageService.get("CAR_UNIQUE_QUOTE_ID"),carrierId:$scope.selectedProduct.carrierId,productId:$scope.selectedProduct.productId,lob:$scope.selectedProduct.quoteType});*/
                    $location.path('/buyFourWheeler').search({ quoteId: localStorageService.get("CAR_UNIQUE_QUOTE_ID"), carrierId: $scope.selectedProduct.carrierId, productId: $scope.selectedProduct.productId, lob: $scope.selectedProduct.quoteType });
                } else {
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                    $rootScope.loading = true;
                    $location.path('/buyFourWheeler');
                }
            }
        };

        //added for TATA AIG -if in user previous policy any one from zero dep,invoice cover,tyre cover,engine cover is not present then restrict user to go further. 
        $scope.checkPrevPolStatusRider = function (param) {
            $scope.isPrevPolStatusRiderSelected = param;
            if (!$scope.isPrevPolStatusRiderSelected) {
                $scope.modalResultCnfrmBuy = false;
            }
        }

        $scope.selectProduct = function (selectedProduct, _redirectTOResult) {
            _redirectTOResult = (_redirectTOResult == false) ? _redirectTOResult : true;
            var QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
            updateSelectedProduct(RestAPI, QUOTE_ID, selectedProduct, function (updatedProductCallback) {
                if (updatedProductCallback.data) {
                    var updatedProduct = updatedProductCallback.data;
                    if (updatedProduct.selectedCarrier && updatedProduct.selectedProduct) {
                        $rootScope.selectedCarrierIdForCar = updatedProduct.selectedCarrier;
                        $rootScope.selectedProductIdForCar = updatedProduct.selectedProduct
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
            $rootScope.title = $scope.p365Labels.policies365Title.confirmPopup;
            $scope.buyScreenTemplate(selectedProduct);
        };

        $scope.buyScreenTemplate = function (selectedProduct) {
            $scope.showPrevRiderPlanStatusDiv = false;
            localStorageService.set("carSelectedProduct", selectedProduct);
            $scope.selectedProduct = selectedProduct;

            if ($scope.requestId) {
                if ($scope.vehicleDetails.idvOption == 2 || $scope.vehicleDetails.idvOption == 3) {
                    localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.requestId);
                }
                if (UNIQUE_QUOTE_ID_ENCRYPTED) {
                    localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED",UNIQUE_QUOTE_ID_ENCRYPTED)
                }
            }

            if ($scope.modalCompare) {
                $scope.modalCompare = false;
            }

            //added by gauri for mautic application
            if (imauticAutomation == true) {
                imatBuyClicked(localStorageService, $scope, 'BuyClicked');
            }
            var buyScreenParam = {};
            buyScreenParam.documentType = proposalScreenConfig;
            buyScreenParam.businessLineId = localStorageService.get("selectedBusinessLineId");
            buyScreenParam.carrierId = selectedProduct.carrierId;
            buyScreenParam.productId = selectedProduct.productId;
            buyScreenParam.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
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

            getDocUsingParam(RestAPI, productDataReader, buyScreenParam, function (buyScreen) {
                if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {
                    localStorageService.set("buyScreen", buyScreen.data);
                    $scope.productValidation = buyScreen.data.validation;
                    if (!resultCnfrmBuyFlag) {
                        if ($scope.quoteParam.policyType == "renew")
                            $scope.setRangePrevPolicyStartDate();
                        $scope.modalResultCnfrmBuy = true;
                    }
                    //added for TATA AIG  
                    if ($scope.selectedProduct.previousRiderPlanStatus) {
                        $scope.selectedRiderList = [];
                        for (var i = 0; i < $scope.selectedProduct.ridersList.length; i++) {
                            if ($scope.selectedProduct.ridersList[i].riderName == "Engine Protector") {
                                $scope.selectedRiderList.push($scope.selectedProduct.ridersList[i]);
                            } else if ($scope.selectedProduct.ridersList[i].riderName == "Invoice Cover") {
                                $scope.selectedRiderList.push($scope.selectedProduct.ridersList[i]);
                            } else if ($scope.selectedProduct.ridersList[i].riderName == "Zero Depreciation cover") {
                                $scope.selectedRiderList.push($scope.selectedProduct.ridersList[i]);
                            } else if ($scope.selectedProduct.ridersList[i].riderName == "Tyre Secure") {
                                $scope.selectedRiderList.push($scope.selectedProduct.ridersList[i]);
                            }
                        }
                        $scope.showPrevRiderPlanStatusDiv = true;
                        $scope.isPrevPolStatusRiderSelected = true;
                    }
                    if (resultCnfrmBuyFlag) {
                    if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                        $rootScope.loading = true;
                        // if (String($location.search().leaddetails) != "undefined") {
                        //     var leaddetails = JSON.parse($location.search().leaddetails);
                        //     localStorageService.set("quoteUserInfo", leaddetails);
                        // }
                        $location.path('/ipos').search({ quoteId: localStorageService.get("CAR_UNIQUE_QUOTE_ID"), carrierId: $scope.selectedProduct.carrierId, productId: $scope.selectedProduct.productId, lob: $scope.selectedProduct.quoteType });
                    } else {
                        $rootScope.loading = true;
                        $location.path('/buyFourWheeler');
                    }
                        $scope.$apply();
                }
                
            } else {
                    console.log('unable to proceed due to failed transaction name: findAppConfig for  carCarrierList');
                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                }
            });
        };

$rootScope.signout = function () {
    $rootScope.userLoginStatus = false;
    var userLoginInfo = {};
    userLoginInfo.username = "";
    userLoginInfo.status = $rootScope.userLoginStatus;
    localStorageService.set("userLoginInfo", userLoginInfo);
    $location.path("/quote");
};

// $scope.state = false;
// $scope.toggleState = function () {
//     $scope.state = !$scope.state;
// };
// $scope.$mdMenu = { open: this.open };

$scope.openMenu = function ($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
    setTimeout(function () {
        $('.md-click-catcher').click(function () {
            $scope.activeMenu = '';
        });
    }, 100);
};

// $scope.clickForActive = function (item) {
//     $scope.activeMenu = item;
// };

// $scope.clickForViewActive = function (item) {
//     $scope.activeViewMenu = item;
// };

// $scope.clickForViewActive('Compare');

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
        var encodeQuote = localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED");
        var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
        var encodeEmailId = $scope.EmailChoices[i].username;
        var encodeCarrierList = [];


        // commented as told by danny

        if ($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0) {
            encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
            jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
        } else {
            encodeCarrierList.push("ALL");
        }
       
        $rootScope.encryptedQuote_Id = encodeQuote;
        $rootScope.encryptedLOB = encodeLOB
        $rootScope.encryptedEmail = encodeEmailId;
        $rootScope.encryptedCarriers = jsonEncodeCarrierList

        $scope.EmailChoices[i].funcType = "SHAREVEHICLEQUOTE";
        $scope.EmailChoices[i].isBCCRequired = 'Y';
        $scope.EmailChoices[i].paramMap = {};

        $scope.EmailChoices[i].paramMap.docId = String($rootScope.encryptedQuote_Id);
        $scope.EmailChoices[i].paramMap.LOB = String($rootScope.encryptedLOB);
        $scope.EmailChoices[i].paramMap.userId = String($rootScope.encryptedEmail);
        
        if ($rootScope.encryptedCarriers)
        $scope.EmailChoices[i].paramMap.carriers = String($rootScope.encryptedCarriers);
        $scope.EmailChoices[i].paramMap.vehicleName = $scope.vehicleDetails.displayVehicle;
        $scope.EmailChoices[i].paramMap.selectedPolicyType = "Four Wheeler";
        if ($rootScope.vehicleDetails.registrationNumber) {
            $scope.EmailChoices[i].paramMap.registrationNum = $rootScope.vehicleDetails.registrationNumber.toUpperCase();
        } else {
            $scope.EmailChoices[i].paramMap.registrationNum = $scope.vehicleInfo.registrationPlace;
        }

        var body = {};
        body.longURL = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;
        $http({ method: 'POST', url: getShortURLLink, data: body }).
            success(function (shortURLResponse) {

                var request = {};
                var header = {};
                var arr = $scope.EmailChoices;

                header.messageId = messageIDVar;
                header.campaignID = campaignIDVar;
                header.source = sourceOrigin;
                header.transactionName = sendEmail;
                header.deviceId = deviceIdOrigin;
                request.header = header;

                if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                    index++;
                    request.body = arr[index];
                    request.body.paramMap.url = shortURLResponse.data.shortURL;
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
                    console.log(shortURLResponse.message);
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
$scope.hideEmailModal = function () {
    $scope.modalEmailView = false;
    $scope.shareEmailModal = false;
}

// Create lead with available user information by calling webservice.
$scope.leadCreationUserInfo = function () {
    var userInfoWithQuoteParam = {};
    $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
    localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
    userInfoWithQuoteParam.quoteParam = localStorageService.get("carQuoteInputParamaters").quoteParam;
    userInfoWithQuoteParam.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
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
            RestAPI.invoke(createLead, userInfoWithQuoteParam).then(function (callback) {
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

// if (localStorageService.get("CarPACoverDetails")) {
//     $scope.CarPACoverDetails = localStorageService.get("CarPACoverDetails");
// }
    $scope.displayPDF= false;
  $scope.pdfviewer = function(data){
      console.log('inside pdf viewer');
   
      var encodeQuote = localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED");
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

    var encodeQuote = localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED");
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
            validateAuthParam.paramMap.longURL = shareQuoteLink + validateAuthParam.paramMap.docId + "&LOB=" + validateAuthParam.paramMap.LOB + "&userId=" + validateAuthParam.paramMap.userId + "&carriers=" +validateAuthParam.paramMap.carriers+"&sharePDF=true";
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
        }
        });
  }

            $scope.hideSharePDFModal = function (){
                $scope.sharePDF = false;
            }

$scope.openCarPopup = function (selectedTab, _data) {
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
console.log('openCarPopup................',_data);
    $scope.carProductToBeAddedInCart = _data;
    $rootScope.selectedTabCar = selectedTab;
    $scope.premiumModalCar = !$scope.premiumModalCar;
}

var googleMapURL = "https://www.google.co.in/maps/search/";
$scope.openMap = function (garage) {
    $scope.searchKey = googleMapURL + '' + garage.repairerName + ',' + garage.pincode;
    window.open($scope.searchKey, '_blank');
}

$scope.hidePremiumModalCar = function () {
    $scope.premiumModalCar = false;
}

$scope.PACoverValidity = function (applicable) {
    if (applicable) {
        $rootScope.personalAccidentValidity = [1, 3];
    } else {
        $rootScope.personalAccidentValidity = [];
    }
}

$scope.PACoverAddon = function () {
    $scope.tempVar = {};   
    $scope.tempVar.riderId = 11;
    $scope.tempVar.riderName = "Personal Accident Cover";

    if ($scope.quoteParam.riders) {
        $scope.quoteParam.riders.push( $scope.tempVar);      
    }              
    console.log("inside PACoverAddon",$scope.quoteParam.riders)
};

$scope.PACoverValidity($scope.CarPACoverDetails.isPACoverApplicable);
$scope.togglePACover = function () {
    $scope.isPACoverApplicableCopyForReset = angular.copy(!$scope.CarPACoverDetails.isPACoverApplicable);
    $scope.PACoverFlag = 0 ;
    $scope.PACoverValidity($scope.CarPACoverDetails.isPACoverApplicable);
    $scope.displayForChange = false;
    if ($scope.CarPACoverDetails.isPACoverApplicable) {
        $scope.CarPACoverDetails = {};
        $scope.PACoverFlag = 1 ;
        $scope.CarPACoverDetails.isPACoverApplicable = true;
        $scope.PACoverModal = false;
        // if (!$rootScope.isFromProfessionalJourney) {
        $scope.singleClickCarQuote();
        // }
    } else {
        $scope.PACoverModal = true;
        $scope.CarPACoverDetails.existingInsurance = true;
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
//below piece of code written for displaying idv ,rider,discount,insurance Type section menu as pop-up.
$scope.showPACoverModal = function () {
    $scope.displayForChange = true;
    $scope.PACoverModal = true;
}

$scope.hidePACoverModal = function () {
    $scope.PACoverModal = false;
    if (!$scope.displayForChange) {
        $scope.CarPACoverDetails.isPACoverApplicable = $scope.isPACoverApplicableCopyForReset;
    }
}

$scope.showRiderModal = function () {
    if (localStorageService.get("carQuoteInputParamaters").quoteParam.riders) {
        $scope.selectedAddOn = localStorageService.get("carQuoteInputParamaters").quoteParam.riders.length;
    }
    $scope.riderDetailsModal = !$scope.riderDetailsModal;
    $scope.vehicleInfoCopy = angular.copy($scope.vehicleInfo);
}
$scope.showIDVModal = function () {
    $scope.idvDetailsModal = !$scope.idvDetailsModal;
}
$scope.showOdOnlyVModal = function () {
           
    $scope.OdOnlyModal = !$scope.OdOnlyModal;
   // $scope.odOnlyPlan = !$scope.odOnlyPlan;
    console.log("inside show od only modal ",$scope.odOnlyPlan);
  

}
$scope.showVehicleOwnerModal = function () {
    $scope.ownerTypeModal = !$scope.ownerTypeModal;
    $scope.tempOwner = angular.copy($scope.quoteParam.ownedBy);
}
$scope.hideVehicleOwnerModal = function () {
    $scope.quoteParam.ownedBy = angular.copy($scope.tempOwner)
    $scope.ownerTypeModal = false;
}

$scope.insuranceTypeModal = false;
$scope.showInsuranceTypeModal = function () {
    $scope.insuranceTypeModal = true;
}
$scope.hideInsuranceTypeModal = function () {
    $scope.insuranceTypeModal = false;
}

$scope.hideRiderDetailsModal = function () {
    $scope.riderDetailsModal = false;
    $scope.resetRiderSelection();
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

$scope.showPolicyTypeModal = function () {
    $scope.prevPolTypeModal = true;
}

$scope.hidePrevPolTypeModal = function () {
    $scope.prevPolTypeModal = false;
}

$scope.alterPrevPolType = function () {
    $scope.prevPolTypeDiv = true;
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


// Hide the footer navigation links.
$(".activateFooter").hide();
$(".activateHeader").hide();
    }]);