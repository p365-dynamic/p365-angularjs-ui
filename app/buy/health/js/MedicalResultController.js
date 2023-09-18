/*
 * Description	: This is the controller file for health quote calculation result page.
 * Author		: Shubham Jain
 * Date			: 10 August 2016
 * */

/*QuoteResultHealth Controller*/
var jsonEncodeCarrierList = [];
'use strict';
angular.module('healthResult', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages', 'checklist-model'])
    .controller('healthResultController', ['$scope', '$rootScope', '$filter', '$location', '$http', 'RestAPI', 'localStorageService', '$interval', '$timeout', '$sce', '$anchorScroll', function ($scope, $rootScope, $filter, $location, $http, RestAPI, localStorageService, $interval, $timeout, $sce, $anchorScroll) {
        // Setting application labels to avoid static assignment
        var carrierAllReadyAdded = false;
        var setFlag = false;
        $anchorScroll('home');

        $rootScope.landingFlag = false;
        var applicationLabels = localStorageService.get("applicationLabels");
        $scope.globalLabel = applicationLabels.globalLabels;
        $scope.p365Labels = insHealthQuoteLabels;
        $rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbResult) };
        $rootScope.title = $scope.p365Labels.policies365Title.medicalResultQuote;

        $scope.filterBenefitModal = false;
        $rootScope.isBackButtonPressed = false;
        $rootScope.disableLandingLeadBtn = false;

        $scope.resultCnfrmBuyFlag = false;
        $scope.buyConfrmFlag = false;

        $scope.isRiderFormDirty = false;
        //for wordpress
        if ($rootScope.wordPressEnabled) {
            $scope.rippleColor = '';
        } else {
            $scope.rippleColor = '#f8a201';
        }
        // for share email
        $scope.EmailChoices = [{ 'username': '', 'addNew': true, paramMap: { 'docId': '', 'LOB': localStorageService.get("selectedBusinessLineId").toString(), userId: '', 'selectedPolicyType': '' } }]; //$scope.quoteParam.quoteType
        
        if($rootScope.isHealthLanding){
        $scope.healthAffilatedLeadId = $sce.trustAsResourceUrl("https://tracking.icubeswire.co/aff_a?offer_id=1954&adv_sub1= "+messageIDVar+"&adv_sub2="+localStorageService.get("quoteUserInfo").mobileNumber);
        console.log('inside health landing $scope.healthAffilatedLeadId is: ',$scope.healthAffilatedLeadId);
        }
        //for wordpress
        $scope.healthFeaturesTemplate = wp_path + "buy/common/html/featureBenefitsHealth.html";
        $scope.healthPremiumTemplate = wp_path + "buy/common/html/healthPremiumTemplate.html";
        $scope.healthInputSectionHTML = wp_path + 'buy/health/html/HealthInputSection.html';
        $scope.healthAddOnSectionHTML = wp_path + 'buy/health/html/HealthAddOnSection.html';
        $scope.healthShareEmailSectionHTML = wp_path + 'buy/health/html/HealthShareEmailSection.html'
        if ($location.path() == "/PBHealthResult") {
            $scope.PBHealthInputSection = wp_path + 'buy/common/html/PBHTML/PBHealthInputSection.html';
            $scope.PBHealthRidersSection = wp_path + 'buy/common/html/PBHTML/PBHealthRiderSection.html';
            $scope.PBHealthBestResultSection = wp_path + 'buy/common/html/PBHTML/PBHealthBestResultSection.html';
            $scope.inputSectionEnabled = true;
            $scope.ridersSectionEnabled = false;
            $scope.resultSectionEnabled = false;
            $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
            if ($scope.quoteRequest.commonInfo) {
                $scope.commonInfo = $scope.quoteRequest.commonInfo;
            }
            if ($scope.quoteRequest.healthInfo) {
                $scope.healthInfo = $scope.quoteRequest.healthInfo;
            }
            $scope.PBHealthRiderForm = {};
            $scope.healthInputForm = {};
        }


        if (localStorageService.get("userLoginInfo")) {
            $rootScope.userLoginStatus = localStorageService.get("userLoginInfo").status;
            $rootScope.username = localStorageService.get("userLoginInfo").username;
        }

        if (localStorageService.get("PROF_QUOTE_ID_ENCRYPTED")) {
            $scope.UNIQUE_PROF_QUOTE_ID_ENCRYPTED = localStorageService.get("PROF_QUOTE_ID_ENCRYPTED");
        }

        //added for expand-collapse DOM for ipos
        $scope.healthInputSection = false;
        $scope.riderInputSection = false;

        $rootScope.loading = true;

        $scope.quoteUserInfo = {};
        $scope.quoteUserInfo.messageId = '';
        $scope.quoteUserInfo.termsCondition = true;

        //for agencyPortal
        // $scope.modalView = false;
        // if ($rootScope.agencyPortalEnabled) {
        //     $scope.createLeadAP = $location.search().createLead;
        //     //checking for lead
        //     var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
        //     if (!quoteUserInfoCookie || $scope.createLeadAP == 'true') {
        //         messageIDVar = '';
        //         $scope.modalView = true;
        //     }
        // }

        if ($rootScope.agencyPortalEnabled) {
            const quoteUserInfo = JSON.parse(localStorage.getItem('quoteUserInfo'));
            console.log('quoteUserInfo in agency car result is::', quoteUserInfo);
            if (quoteUserInfo) {
                $scope.quoteUserInfo = quoteUserInfo;
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
            }
            //added by gauri for mautic application for agency portal specific
            if (imauticAutomation == true) {
                imatHealthLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
            }

        }

        $scope.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED");

        // Fetch lead id from url for iQuote+.
        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
            /*if($location.search().docId){
			localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $location.search().docId);
		}
*/
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
            $scope.healthInputSection = true;
            $scope.riderInputSection = true;
        }

        /*beolw functions created to collapse & expand DOM for ipos*/
        $scope.showPolicyDetails = function () {
            $scope.healthInputSection = !$scope.healthInputSection;
        }

        $scope.showRiderDetails = function () {
            $scope.riderInputSection = !$scope.riderInputSection;
        }
        /* end ipos functions to expand-collapse DOM for ipos*/

        $scope.backToResultScreen = function () {
            if ($rootScope.wordPressEnabled) {
                $rootScope.isBackButtonPressed = true;
            }
            if ($rootScope.isProfessionalJourneySelected) {
                $location.path("/professionalJourneyResult");
            } else {
                $location.path("/PBQuote");
            }
        };

        $scope.backToQuotes = function () {
            $location.path("/professionalJourneyResult");
        }

        var docId = $scope.p365Labels.documentType.quoteResultScreen + "-" + localStorageService.get("selectedBusinessLineId");

        //	getDocUsingId(RestAPI, docId, function (tooltipContent) {
        //$scope.familyList = healthFamilyListGeneric;
        //$scope.tooltipContent = tooltipContent.toolTips;

        $scope.declaration = function () {
            $rootScope.loading = false;
            $scope.insuranceCompanyList = {};
            $scope.insuranceCompanyList.selectedInsuranceCompany = [];
            $scope.quoteFinalResult = {};
            $scope.quote = {};
            $scope.ratingParam = {};
            $scope.selectedDisease = {};
            $scope.toDisplay = {};
            $scope.mainFeature = {};
            $scope.hospitalisationLimit = {};
            $scope.medicalInstant = {};
            $scope.hospitalList = {};
            $scope.parent = {};

            $scope.selectedFamilyArray = [];
            $scope.selectedDisease.diseaseList = [];
            //$scope.selectedFeatures = [];

            $scope.selectedCarrierName = {};
            $scope.selectedCarrierName.CompanyName = [];

            // $scope.defaultCarrierList ={};
            // $scope.defaultCarrierList='ALL';
            // $scope.selectedCarrierName.CompanyName.push('ALL');
            //added for product/professional journey  to display No-CoPay feature seperately
            $scope.NoCoPayFeatures = { "name": "No Co-Pay", "featureId": 36, "description": "Insurance companies deduct certain specified % of amount called Co-pay before settling the final claim amount and it is generally applicable beyond certain age.", "riders": { "riderId": 38, "riderName": "No Copay" }, "category": "Copay" };
            //for olark
            // olarkCustomParam(localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), false);
            //var carrierLogoList = localStorageService.get("carrierLogoList");

            $scope.quote = localStorageService.get("healthQuoteInputParamaters");
            $scope.quoteParam = localStorageService.get("healthQuoteInputParamaters").quoteParam;
            $scope.personalInfo = localStorageService.get("healthQuoteInputParamaters").personalInfo;
            $scope.selectedArea = localStorageService.get("selectedArea");
            $scope.isDiseased = localStorageService.get("isDiseasedForHealth");
            $scope.familyList = localStorageService.get("selectedFamilyForHealth");
            //console.log('1:$scope.familyList'+JSON.stringify($scope.familyList));
            $scope.selectedDisease = localStorageService.get("selectedDisease");
            console.log('$scope.selectedDisease is: ', $scope.selectedDisease);
            $scope.selectedFamilyArray = localStorageService.get("selectedFamilyArray");
            $scope.diseaseList = localStorageService.get("diseaseList");
            console.log('$scope.diseaseList is: ', $scope.diseaseList);
            $scope.userGeoDetails = localStorageService.get("commAddressDetails");

            $scope.hospitalList = localStorageService.get("hospitalList"); // Tooltip for Hospitalization Cashless Facility
            $scope.hospitalizationLimitArray = localStorageService.get("hospitalizationLimitList");
            //$scope.hospitalisationLimit=$rootScope.hospitalisationLimit;
            $scope.hospitalisationLimit = localStorageService.get("hospitalisationLimitVal");
            //reset functionality
            $scope.quoteReset = localStorageService.get("healthQuoteInputParamatersReset");
            $scope.quoteParamReset = localStorageService.get("healthQuoteInputParamatersReset").quoteParam;
            $scope.personalInfoReset = localStorageService.get("healthQuoteInputParamatersReset").personalInfo;
            $scope.selectedAreaReset = localStorageService.get("selectedAreaReset");
            $scope.isDiseasedReset = localStorageService.get("isDiseasedForHealthReset");
            $scope.familyListReset = localStorageService.get("selectedFamilyForHealthReset");
            $scope.selectedDiseaseReset = localStorageService.get("selectedDiseaseReset");
            $scope.selectedFamilyArrayReset = localStorageService.get("selectedFamilyArrayReset");
            $scope.diseaseListReset = localStorageService.get("diseaseListReset");
            $scope.hospitalListReset = localStorageService.get("hospitalListReset");
            $scope.hospitalizationLimitArrayReset = localStorageService.get("hospitalizationLimitListReset");
            $scope.hospitalisationLimitReset = localStorageService.get("hospitalisationLimitValReset");
            $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
            //$scope.familyList = healthFamilyListGeneric;
            if ($scope.quoteRequest) {
                $scope.commonInfo = $scope.quoteRequest.commonInfo;
                $scope.healthInfo = $scope.quoteRequest.healthInfo;
            }
            if (localStorageService.get("healthRecommendedRiders")) {
                $scope.recommendedHealthRiders = localStorageService.get("healthRecommendedRiders");
            } else {
                $scope.recommendedHealthRiders = [];
            }
            if (localStorageService.get("selectedFeatures")) {
                $rootScope.selectedFeatures = localStorageService.get("selectedFeatures");
                console.log('$rootScope.selectedFeatures length is:', $rootScope.selectedFeatures);
            } else {
                $rootScope.selectedFeatures = [];
            }
            if (localStorageService.get("addressDetails")) {
                $scope.addressDetails = localStorageService.get("addressDetails");
            }
            //$scope.compareHealthPoliciesDisplayList = compareHealthPoliciesDisplayValues);

            $scope.sortTypes = sortTypesHealthGeneric;
            $scope.planBenefits = planBenefitsGeneric;
            $scope.roomTypesArray = roomRentBenefitList;
            $scope.preExistingCoverages = preExistingCoveragesGeneric;
            $scope.genderType = genderTypeGeneric;
            $scope.preDiseaseStatus = preDiseaseStatusGeneric;

            $scope.selectedSortOption = $scope.sortTypes[0];

            //commenting  for professional journey quote should be display without preexisting feature
            //$scope.parent.roomType = $scope.roomTypesArray[0];
            //$scope.parent.coverageAfter = $scope.preExistingCoverages[0];
            $scope.parent.coverageAfter = [];
            $scope.activeSort = $scope.sortTypes[0].key;

            $scope.toDisplay.categoryFeature = 'Y';
            $scope.mainFeature.resultFeature = 'Y';

            setFlag = false;
            var setExposeFlag = true;
            var setExposeReportFlag = true;

            $scope.expose = false;
            $scope.disabledRiderCheckGroup = true;
            $scope.medicalInstant.collapseFamilyList = false;
            $scope.errorSectionButtonStatus = true;
            $scope.parent.roomRentFeature = false;
            $scope.parent.preExistingCoverageFeature = false;


            $rootScope.modalShown = false;
        }

        if ($rootScope.healthQuoteRequest) {
            if ($rootScope.healthQuoteRequest.length == $rootScope.quoteResultCount) {
                if ($scope.quotesToShow) {
                    if ($scope.quotesToShow.length == 0) {
                        $scope.noQuoteResultFound = true;
                        $rootScope.healthQuoteRequest = [];

                        $rootScope.healthQuoteRequest.push({
                            status: 2,
                            message: $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedErrMsg)
                        });
                        // $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                    }
                }
            }
        }





        $scope.init = function () {


            $scope.quotesToShow = $rootScope.healthQuoteResult;
            $scope.quotesToShowCopy = angular.copy($scope.quotesToShow);

            angular.forEach($rootScope.healthQuoteResult, function (obj, i) {
                $scope.selectedCarrierName.CompanyName.push(obj.insuranceCompany);
            });

            console.log('$scope.quotesToShow::', $scope.quotesToShow);
            console.log('is professional journey::', $rootScope.professionalJourney);

            if ($scope.recommendedHealthRiders.length > 0) {
                for (var i = 0; i < $scope.planBenefits.length; i++) {
                    for (var j = 0; j < $scope.recommendedHealthRiders.length; j++) {
                        if ($scope.planBenefits[i].riders.riderId == $scope.recommendedHealthRiders[j].riderId) {
                            $scope.planBenefits[i].isRecommended = true;
                        }
                    }
                }
                for (var i = 0; i < $scope.roomTypesArray.length; i++) {
                    for (var j = 0; j < $scope.recommendedHealthRiders.length; j++) {
                        if ($scope.roomTypesArray[i].riderId == $scope.recommendedHealthRiders[j].riderId) {
                            $scope.roomTypesArray[i].isRecommended = true;
                        }
                    }
                }
            }
            //code for compare - filter based on features
            $rootScope.consolidatedHospitalizationRelatedList = [];
            $rootScope.consolidatedPreventiveOutPatientRelatedList = [];
            $rootScope.consolidatedEnhancedCoverageList = [];
            $rootScope.consolidatedPreExistingDiseasesList = [];
            for (var i = 0; i < $scope.quotesToShow.length; i++) {
                getAllProductFeatures($scope.quotesToShow[i], true);
            }

            //var tempHospLimit = $scope.quotesToShow[0].sumInsured;

            /*var tempHospLimit=$scope.hospitalisationLimit;
	
			for(var i = 0; i < $scope.hospitalizationLimitArray.length; i++){
				if($scope.hospitalizationLimitArray[i].minHosLimit <= tempHospLimit && $scope.hospitalizationLimitArray[i].maxHosLimit > tempHospLimit){
					$scope.hospitalisationLimit = $scope.hospitalizationLimitArray[i];
					break;
				}
			})*/
            $scope.validateAge = function (data, dob) {
                var dateArr = dob.split("/");
                var newDOB = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
                data.age = calculateAgeByDOB(newDOB);
            }
            //added for  wordPress health input reset
            $scope.resetHealthInputDetails = function () {
                $scope.quoteParamCopy = angular.copy($scope.quoteParam);
                $scope.personalInfoCopy = angular.copy($scope.personalInfo);
                $scope.hospitalisationLimitCopy = angular.copy($scope.hospitalisationLimit);
                $scope.familyListCopy = angular.copy($scope.familyList);
                $scope.selectedDiseaseCopy = angular.copy($scope.selectedDisease);
                $scope.diseaseListCopy = angular.copy($scope.diseaseList);
                if ($rootScope.selectedFeatures.length > 0) {
                    $rootScope.selectedFeaturesCopy = angular.copy($rootScope.selectedFeatures);
                }
                if ($scope.quoteParam.riders) {
                    if ($scope.quoteParam.riders.length > 0) {
                        $scope.riderCopy = angular.copy($scope.quoteParam.riders);
                    }
                }
            }

            $scope.resetOnCancel = function () {
                angular.copy($scope.quoteParamCopy, $scope.quoteParam);
                angular.copy($scope.personalInfoCopy, $scope.personalInfo);
                angular.copy($scope.familyListCopy, $scope.familyList);
                angular.copy($scope.diseaseListCopy, $scope.diseaseList);
                angular.copy($scope.selectedDiseaseCopy, $scope.selectedDisease);
                angular.copy($scope.hospitalisationLimitCopy, $scope.hospitalisationLimit);
                if ($scope.selectedDisease.diseaseList.length > 0) {
                    $scope.isDiseased = true;
                } else {
                    $scope.isDiseased = false;
                }
                $scope.quoteHealthInputForm.healthInputForm.$setPristine();
                $scope.quoteHealthInputForm.$setUntouched();
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

            $scope.getProfessionalBestQuotes = function () {
                if (localStorageService.get("healthProductToBeAddedInCart")) {
                    $scope.productInCart = localStorageService.get("healthProductToBeAddedInCart");
                }

                console.log('$scope.productInCart for health is:', $scope.productInCart);
                $scope.resultSectionEnabled = true;
                $scope.inputSectionEnabled = false;
                $scope.ridersSectionEnabled = false;
                if ($rootScope.healthQuoteResult.length > 0)
                    $scope.isGotHealthQuotes = true;

                if ($scope.quoteHealthInputForm.$dirty || $scope.isRiderFormDirty) {
                    $scope.singleClickHealthQuote();
                } else {
                    $rootScope.healthQuote = $scope.productInCart;
                }
            }

            //added to display section on "confirm" in professional journey
            $scope.confirmInput = function () {
                $scope.parent.roomType = $scope.roomTypesArray[0];
                $scope.parent.coverageAfter = $scope.preExistingCoverages[0];
                $scope.inputSectionEnabled = false;
                $scope.resultSectionEnabled = false;
                $scope.ridersSectionEnabled = true;
                //$scope.getProfessionalBestQuotes();
            }

            $scope.getAgeArray = function (minAge, maxAge) {
                var ageArray = [];
                for (var i = 0, j = minAge; j <= maxAge; i++ , j++) {
                    ageArray[i] = j;
                }
                return ageArray;
            };

            $scope.noCoPayClick = function (isNoCoPayApplicable) {
                var isNoCopayExist = false;
                if (isNoCoPayApplicable) {
                    //$scope.quoteParam.riders.push($scope.NoCoPayFeatures.riders);
                    $rootScope.selectedFeatures.push($scope.NoCoPayFeatures);
                } else {
                    // console.log('$scope.selectedFeatures is::', $rootScope.selectedFeatures);
                    // for (var i = 0; i < $scope.quoteParam.riders.length; i++) {
                    // 	if ($scope.quoteParam.riders[i].riderId == $scope.NoCoPayFeatures.riders.riderId) {
                    // 		$scope.quoteParam.riders.splice(i, 1);
                    // 		break;
                    // 	}
                    // }
                    for (var i = 0; i < $rootScope.selectedFeatures.length; i++) {
                        if ($rootScope.selectedFeatures[i].riders.riderId == $scope.NoCoPayFeatures.riders.riderId) {
                            $rootScope.selectedFeatures.splice(i, 1);
                            break;
                        }
                    }
                }
                console.log('$scope.selectedFeatures is::', $rootScope.selectedFeatures);
            }

            $scope.resetFeatures = function () {
                if ($rootScope.selectedFeatures.length > 0) {
                    // if ($rootScope.selectedFeaturesCopy) {
                    // 	angular.copy($rootScope.selectedFeaturesCopy, $rootScope.selectedFeatures);
                    // 	//angular.copy($scope.riderCopy, $scope.quoteParam.riders);
                    // 	//$scope.selected = [];
                    // 	//$scope.selected = $rootScope.selectedFeatures;
                    // 	$scope.parent.coverageAfter = [];
                    // 	$scope.parent.roomType = [];
                    // } else {
                    // 	$rootScope.selectedFeatures = [];
                    // 	$scope.parent.coverageAfter = [];
                    // 	$scope.parent.roomType = [];
                    // 	console.log('$scope.selectedFeatures feature is: ', $rootScope.selectedFeatures);
                    // 	//$scope.selectedFeatures.splice(0, 0)
                    // 	//$scope.selectedFeatures =[];
                    // 	//$scope.quoteParam.riders = [];
                    // }
                    $rootScope.selectedFeatures = [];
                    $scope.parent.coverageAfter = [];
                    $scope.parent.roomType = [];
                    $scope.isNoCoPayApplicable = false;
                    if ($scope.quoteParam.riders.length > 0) {
                        $scope.quoteHealthInputForm.$dirty = true;
                        $scope.quoteHealthInputForm.$setDirty();
                        setTimeout(function () {
                            $scope.singleClickHealthQuote();
                        }, 100);

                    }
                    console.log('$scope.selectedFeatures length after reset: ', JSON.stringify($rootScope.selectedFeatures.length));
                } else {
                    $rootScope.selectedFeatures = [];
                    $scope.parent.coverageAfter = [];
                    $scope.parent.roomType = [];
                    $scope.isNoCoPayApplicable = false;
                }
            };

            //for wordPress
            if ($scope.wordPressEnabled) {
                $scope.resetHealthInputDetails();
            }
            $scope.filterForFeatures = function () {
                var indexes = [];
                var i;
                var quoteFeatures = new Array($rootScope.healthQuoteResult.length);

                for (i = 0; i < quoteFeatures.length; i++) {
                    var array = [];
                    var length;
                    for (var j = 0; j < $rootScope.healthQuoteResult.length; j++) {
                        length = 0;
                        length = $rootScope.healthQuoteResult[j].featuresList[0].HospitalizationRelated.length + $rootScope.healthQuoteResult[j].featuresList[1].PreventiveOutPatientRelated.length + $rootScope.healthQuoteResult[j].featuresList[2].EnhancedCoverage.length + $rootScope.healthQuoteResult[j].featuresList[3].PreExistingDiseases.length;
                    }

                    quoteFeatures[i] = new Array(length);

                    var arr1 = $rootScope.healthQuoteResult[i].featuresList[0].HospitalizationRelated.concat($rootScope.healthQuoteResult[i].featuresList[1].PreventiveOutPatientRelated);
                    var arr2 = arr1.concat($rootScope.healthQuoteResult[i].featuresList[2].EnhancedCoverage);
                    quoteFeatures[i] = arr2.concat($rootScope.healthQuoteResult[i].featuresList[3].PreExistingDiseases);
                }

                for (var p = 0; p < quoteFeatures.length; p++) {
                    var counter = 0;
                    for (var q = 0; q < quoteFeatures[p].length; q++) {
                        for (var n = 0; n < $rootScope.selectedFeatures.length; n++) {
                            if (quoteFeatures[p][q].featureId == $rootScope.selectedFeatures[n].featureId && quoteFeatures[p][q].isFeatureAvailable == "Yes") {
                                if ($rootScope.selectedFeatures[n].featureId == 1 && quoteFeatures[p][q].valueLimit == $scope.parent.roomType.id) {
                                    counter++;
                                } else if ($rootScope.selectedFeatures[n].featureId == 1 && quoteFeatures[p][q].valueLimit == 4 && ($scope.parent.roomType.id == 1 || $scope.parent.roomType.id == 2)) {
                                    counter++;
                                } else if ($rootScope.selectedFeatures[n].featureId == 60 && quoteFeatures[p][q].valueLimit == parseInt($scope.parent.coverageAfter.value)) {
                                    counter++;
                                } else if ($rootScope.selectedFeatures[n].featureId == 36 && quoteFeatures[p][q].valueLimit == 0) {
                                    counter++;
                                } else if ($rootScope.selectedFeatures[n].featureId == 57 || $rootScope.selectedFeatures[n].featureId == 22 || $rootScope.selectedFeatures[n].featureId == 52) {
                                    counter++;
                                } else {
                                    counter = 0;
                                }
                            } else if (quoteFeatures[p][q].featureId == $rootScope.selectedFeatures[n].featureId && quoteFeatures[p][q].isFeatureAvailable == "No") {
                                counter = 0;
                                break;
                            }

                            if (counter == 0)
                                break;
                        }
                    }
                    if (counter > 0) {
                        indexes.push(p);
                    }
                }
                $scope.quotesToShow = [];
                if ($rootScope.selectedFeatures.length > 0) {
                    for (i = 0; i < indexes.length; i++) {
                        if (indexes[i] > -1) {
                            $scope.quotesToShow.push($rootScope.healthQuoteResult[indexes[i]]);
                        }
                    }
                } else {
                    $scope.quotesToShow = $rootScope.healthQuoteResult;
                }

                if ($scope.quotesToShow.length <= 0) {
                    $scope.errorSectionButtonStatus = false;
                    $scope.quoteCalculationError = "No product are available for selected plan benefits.";
                }
            };

            //commented for product/professional journey as result will appear without preExisting coverage feature
            //$scope.filterForFeatures();

            $scope.selected = [];

            //logic for preselection of riders
            //$scope.quoteParam.riders = [];
            $scope.quoteParam.riders = $scope.quoteParam.riders == undefined ? [] : $scope.quoteParam.riders;

            $scope.addPreExistingCoverageAsFeature = function (item) {
                if ($scope.parent.preExistingCoverageFeature) {
                    var preExistingCoverageExist = false;
                    var preExtngFeature = {};
                    //preExtngFeature.name = $scope.parent.coverageAfter.name;
                    //preExtngFeature.featureId = $scope.parent.coverageAfter.featureId;
                    for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                        if ($rootScope.selectedFeatures[i].featureId == 60) {
                            preExistingCoverageExist = true;
                            break;
                        }
                    }
                    if (!preExistingCoverageExist) {
                        $rootScope.selectedFeatures.push($scope.parent.coverageAfter);
                    } else {
                        for (var index = 0; index < $rootScope.selectedFeatures.length; index++) {
                            if ($rootScope.selectedFeatures[index].featureId == item.featureId) {
                                $rootScope.selectedFeatures[index].value = item.value;
                                $rootScope.selectedFeatures[index].featureId = item.featureId;
                                $rootScope.selectedFeatures[index].name = item.name;
                                $rootScope.selectedFeatures[index].category = item.category;
                                $rootScope.selectedFeatures[index].subCategory = item.subCategory;
                                $rootScope.selectedFeatures[index].display = item.display;
                                break;
                            }
                        }
                    }
                } else {
                    for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                        if ($rootScope.selectedFeatures[i].featureId == 60) {
                            $rootScope.selectedFeatures.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            $scope.addRoomRentAsFeature = function (item) {
                if (item.riders.riderId == 43) {
                    if ($scope.parent.roomRentFeature) {
                        var roomRentExist = false;
                        for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                            if ($rootScope.selectedFeatures[i].featureId == 1 || $rootScope.selectedFeatures[i].featureId == 2 || $rootScope.selectedFeatures[i].featureId == 3 || $rootScope.selectedFeatures[i].featureId == 4) {
                                roomRentExist = true;
                                break;
                            }
                        }
                        if (!roomRentExist) {
                            $rootScope.selectedFeatures.push($scope.parent.roomType);
                        } else {
                            //else block added from product/profession journey
                            for (var index = 0; index < $rootScope.selectedFeatures.length; index++) {
                                if ($rootScope.selectedFeatures[index].riders) {
                                    if ($rootScope.selectedFeatures[index].riders.riderId == item.riders.riderId) {
                                        $rootScope.selectedFeatures[index].riders.value = item.riders.value;
                                        $rootScope.selectedFeatures[index].featureId = item.featureId;
                                        $rootScope.selectedFeatures[index].id = item.id;
                                        // $rootScope.selectedFeatures[index].category = item.category;
                                        // $rootScope.selectedFeatures[index].subCategory = item.subCategory;
                                        $rootScope.selectedFeatures[index].description = item.description;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                            if ($rootScope.selectedFeatures[i].featureId == 1 || $rootScope.selectedFeatures[i].featureId == 2 || $rootScope.selectedFeatures[i].featureId == 3 || $rootScope.selectedFeatures[i].featureId == 4) {
                                $rootScope.selectedFeatures.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }

            $scope.featuresSelected = function (item, list, status) {
                $scope.quoteHealthInputForm.$dirty = true;
                $scope.quoteHealthInputForm.$setDirty();
                //console.log('item is:',item);
                //console.log('list is:',list);
                console.log('selected features is:', $rootScope.selectedFeatures);
                if (status) {
                    var idx = list.indexOf(item);
                    var i;
                    console.log('index is:', idx);
                    if (idx > -1) {
                        list.splice(idx, 1);
                        $scope.quoteParam.riders.splice(idx, 1);
                        console.log('list is:', list);
                    } else {
                        //added from professional/product journey
                        if ($scope.quoteParam.riders.length > 0) {
                            var roomRentExist = false;
                            console.log('$scope.quoteParam.riders  in step 1 is::', $scope.quoteParam.riders);
                            for (var index = 0; index < $scope.quoteParam.riders.length; index++) {
                                if ($scope.quoteParam.riders[index].riderId == item.riders.riderId) {
                                    $scope.quoteParam.riders[index].value = item.riders.value;
                                    console.log('inside if $scope.quoteParam.riders  in step 2 is::', $scope.quoteParam.riders);
                                    roomRentExist = true;
                                    break;
                                }
                            }
                            if (!roomRentExist) {
                                $scope.quoteParam.riders.push(item.riders);
                                list.push(item);
                            }
                        } else {
                            $scope.quoteParam.riders.push(item.riders);
                            console.log('$scope.quoteParam.riders in step 2 after push is::', $scope.quoteParam.riders);
                            list.push(item);
                        }
                    }

                    // for( i = 0; i < $rootScope.selectedFeatures.length; i++){
                    // 	delete $rootScope.selectedFeatures[i].$$hashKey;	
                    // }

                    //commenting with douts
                    // for( i = 0; i < $scope.selectedFeatures.length; i++){
                    // 	if($scope.selectedFeatures[i].featureId == 60){
                    // 		$scope.selectedFeatures.splice(i, 1);
                    // 		break;
                    // 	}
                    // }

                    console.log('$scope.parent.roomRentFeature', $scope.parent.roomRentFeature);
                    console.log('roomRentExist', roomRentExist);
                    //added since product/professional journey
                    if (item.riders.riderId == 43) {
                        if ($scope.parent.roomRentFeature) {
                            //var roomRentFeature = {};
                            //roomRentFeature.name = $scope.parent.roomType.name;
                            //roomRentFeature.featureId = $scope.parent.roomType.featureId;					
                            //$scope.selectedFeatures.push(roomRentFeature);
                            var roomRentExist = false;
                            for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                                if ($rootScope.selectedFeatures[i].featureId == 1 || $rootScope.selectedFeatures[i].featureId == 2 || $rootScope.selectedFeatures[i].featureId == 3 || $rootScope.selectedFeatures[i].featureId == 4) {
                                    roomRentExist = true;
                                    break;
                                }
                            }
                            if (!roomRentExist) {
                                $rootScope.selectedFeatures.push($scope.parent.roomType);
                            } else {
                                //else block added from product/profession journey
                                for (var index = 0; index < $rootScope.selectedFeatures.length; index++) {
                                    if ($rootScope.selectedFeatures[index].riders) {
                                        if ($rootScope.selectedFeatures[index].riders.riderId == item.riders.riderId) {
                                            $rootScope.selectedFeatures[index].riders.value = item.riders.value;
                                            $rootScope.selectedFeatures[index].featureId = item.featureId;
                                            $rootScope.selectedFeatures[index].id = item.id;
                                            $rootScope.selectedFeatures[index].category = item.category;
                                            $rootScope.selectedFeatures[index].subCategory = item.subCategory;
                                            $rootScope.selectedFeatures[index].description = item.description;
                                            break;
                                        }
                                    }
                                }
                            }
                        } else {
                            //if($scope.roomRentSelected){
                            for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                                if ($rootScope.selectedFeatures[i].featureId == 1 || $rootScope.selectedFeatures[i].featureId == 2 || $rootScope.selectedFeatures[i].featureId == 3 || $rootScope.selectedFeatures[i].featureId == 4) {
                                    $rootScope.selectedFeatures.splice(i, 1);
                                    break;
                                }
                            }
                            //}
                        }
                    }
                    console.log('$scope.selectedFeatures  length before filter is::', $rootScope.selectedFeatures.length);
                    console.log('$scope.selectedFeatures before filter is::', $rootScope.selectedFeatures);
                    // $scope.filterResultByRider();
                } else {
                    if ($scope.parent.preExistingCoverageFeature) {
                        var preExistingCoverageExist = false;
                        var preExtngFeature = {};
                        //preExtngFeature.name = $scope.parent.coverageAfter.name;
                        //preExtngFeature.featureId = $scope.parent.coverageAfter.featureId;
                        for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                            if ($rootScope.selectedFeatures[i].featureId == 60) {
                                preExistingCoverageExist = true;
                                break;
                            }
                        }
                        if (!preExistingCoverageExist) {
                            $rootScope.selectedFeatures.push($rootScope.parent.coverageAfter);
                        } else {
                            for (var index = 0; index < $rootScope.selectedFeatures.length; index++) {
                                if ($rootScope.selectedFeatures[index].featureId == item.featureId) {
                                    $rootScope.selectedFeatures[index].value = item.value;
                                    $rootScope.selectedFeatures[index].featureId = item.featureId;
                                    $rootScope.selectedFeatures[index].name = item.name;
                                    $rootScope.selectedFeatures[index].category = item.category;
                                    $rootScope.selectedFeatures[index].subCategory = item.subCategory;
                                    $rootScope.selectedFeatures[index].display = item.display;
                                    break;
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < $rootScope.selectedFeatures.length; i++) {
                            if ($rootScope.selectedFeatures[i].featureId == 60) {
                                $rootScope.selectedFeatures.splice(i, 1);
                                break;
                            }
                        }
                    }
                    //$scope.filterResultByRider();
                    //$scope.filterForFeatures();
                }
            };

            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };

            $scope.checkFilterDropdowns = function (name) {
                if (name == "roomType" && $scope.planBenefits[4].val == true)
                    $scope.filterForFeatures();
                else if (name == "coverageAfter" && $scope.planBenefits[5].val == true)
                    $scope.filterForFeatures();
            };
            var DOBOption = {};
            DOBOption.changeMonth = true;
            DOBOption.changeYear = true;
            DOBOption.dateFormat = DATE_FORMAT;
            $scope.DOBOptions = setP365DatePickerProperties(DOBOption);

            var dateRange = {};
            var member;
            $scope.$watch(function (scope) { return scope.familyList; }, function () {
                var id = 1;
                $scope.selectedFamilyArray = [];
                for (var i = 0; i < $scope.familyList.length; i++) {
                    if ($scope.familyList[i].relationship == 'S' || $scope.familyList[i].relationship == 'SP' || $scope.familyList[i].relationship == 'A') {
                        dateRange.minimumYearLimit = "-99Y";
                        dateRange.maximumYearLimit = "-18Y";
                        dateRange.changeMonth = true;
                        dateRange.changeYear = true;
                        dateRange.dateFormat = DATE_FORMAT;

                    }
                    if ($scope.familyList[i].relationship == 'CH') {
                        dateRange.minimumYearLimit = "-25Y" + " - 1D";;
                        dateRange.maximumYearLimit = "00Y";
                        dateRange.changeMonth = true;
                        dateRange.changeYear = true;
                        dateRange.dateFormat = DATE_FORMAT;
                    }
                    if ($scope.familyList[i].val == true) {
                        member = {};
                        member.id = $scope.familyList[i].id;
                        member.display = $scope.familyList[i].member;
                        member.age = $scope.familyList[i].age;
                        member.dob = $scope.familyList[i].dob;
                        member.relation = $scope.familyList[i].relationship;
                        $scope['DOBOptions' + i] = setP365DatePickerProperties(dateRange);
                        member.existSince = "";
                        member.existSinceError = false;
                        member.status = false;
                        if (member.relation == "Son" || member.relation == "Daughter") {
                            member.label = ($scope.familyList[i].member.concat(" aged ")).concat($scope.familyList[i].age);
                        } else {
                            member.label = $scope.familyList[i].member;
                        }

                        id++;
                        $scope.selectedFamilyArray.push(member);
                    }
                }
            }, true);

            // Method to get list of pincodes or areas
            $scope.getPinCodeAreaList = function (areaName) {
                var docType;
                if (isNaN(areaName)) {
                    docType = "Area";
                } else {
                    docType = "Pincode";
                }
                return $http.get(getServiceLink + docType + "&q=" + areaName).then(function (response) {
                    return JSON.parse(response.data).data;
                });
            };

            $scope.calcDefaultAreaDetails = function (areaCode) {
                $http.get(getServiceLink + "Pincode" + "&q=" + areaCode).then(function (response) {
                    var areaDetails = JSON.parse(response.data);
                    if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.onSelectPinOrArea(areaDetails.data[0], true);
                    }
                });
            };
            $scope.getHospitalList = function () {
                //console.log('$scope.personalInfo.city',$scope.personalInfo.city)

                var str = $scope.personalInfo.city


                var splitStr = str.toLowerCase().split(' ');
                for (var i = 0; i < splitStr.length; i++) {
                    // You do not need to check if i is larger than splitStr length, as your for does that for you
                    // Assign it back to the array
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                }
                // Directly return the joined string
                var cityFormatted = splitStr.join(' ');

                getListFromDB(RestAPI, cityFormatted, "cashlessHospital", $scope.p365Labels.request.findAppConfig, function (hospitalList) {
                    if (hospitalList.responseCode == $scope.p365Labels.responseCode.success) {

                        $scope.hospitalList = hospitalList.data;
                        console.log('$scope.hospitalList', $scope.hospitalList)
                        localStorageService.set("hospitalList", hospitalList.data);

                    }
                });
                // var documentId = $scope.globalLabel.documentType.hospitalDetails + "-" + $scope.personalInfo.pincode;
                // getDocUsingId(RestAPI, documentId, function (hospitalList) {
                // 	if (hospitalList != null && String(hospitalList) != "undefined") {
                // 		localStorageService.set("hospitalList", hospitalList.hospitalDetails);
                // 		$scope.hospitalList = hospitalList.hospitalDetails;
                // 	} else {
                // 		localStorageService.set("hospitalList", undefined);
                // 		$scope.hospitalList = "";
                // 	}
                // });
            };
            $scope.onSelectPinOrArea = function (item, dirtyStatus) {
                if (item.area) {
                    $scope.displayArea = item.area + ", " + item.district;
                } else {
                    $scope.displayArea = item.displayArea;
                }
                $scope.modalPIN = false;
                $scope.selectedArea = item.area;
                $scope.personalInfo.pincode = item.pincode;
                $scope.personalInfo.displayArea = $scope.displayArea;
                $scope.personalInfo.city = item.district;
                $scope.personalInfo.state = item.state;
                item.city = item.district;
                $scope.getHospitalList();
                localStorageService.set("commAddressDetails", item);
                if (dirtyStatus) {
                    $scope.quoteHealthInputForm.$dirty = true;
                    $scope.quoteHealthInputForm.healthInputForm.$setDirty();
                    // if (!$rootScope.wordPressEnabled) {
                    // 	$scope.singleClickHealthQuote();
                    // }
                }


            };

            $scope.openHospitalList = function (selCarrierId) {
                $scope.hospitalModal = !$scope.hospitalModal;
                $rootScope.selCarrierId = selCarrierId;
            }
            $scope.closeModalHospital = function () {
                $scope.hospitalModal = false;
            }


            // if ($scope.userGeoDetails != null && String($scope.userGeoDetails) != "undefined") {
            // 	$scope.onSelectPinOrArea($scope.userGeoDetails, false);
            // }

            var numberSon = 1;
            var numberDaughter = 1;
            $scope.addNewSon = function (index) {
                for (var i = 0; i < $scope.familyList.length; i++) {
                    if ($scope.familyList[i].member == "Son") {
                        numberSon = numberSon + 1;
                    }
                }
                $scope.familyList[index].iconFlag = false;
                $scope.calculatedDOB = calcDOBFromAge(5);
                $scope.familyList.push({ 'member': 'Son', 'relation': 'SON', 'visible': true, 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 82, iconFlag: true, 'dob': $scope.calculatedDOB });
            };

            $scope.addNewDaughter = function (index) {
                for (var i = 0; i < $scope.familyList.length; i++) {
                    if ($scope.familyList[i].member == "Daughter") {
                        numberDaughter = numberDaughter + 1;
                    }
                }
                $scope.familyList[index].iconFlag = false;
                $scope.calculatedDOB = calcDOBFromAge(5);
                $scope.familyList.push({ 'member': 'Daughter', 'relation': 'DAUGHTER', 'visible': true, 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, iconFlag: true, 'dob': $scope.calculatedDOB });
            };

            //		Function to create compare view and card list
            $scope.cardView = true;
            $scope.compareView = false;
            $scope.showCompareBtn = true;
            $scope.showCardBtn = true;
            $scope.disableSort = false;
            //newFunction for compare
            $scope.compareViewClick = function () {
                $scope.dataLoaded = true;
                $scope.slickLoaded = true;
                $scope.cardView = true;
                $scope.compareView = false;
                $scope.showCompareBtn = true;
                $scope.showCardBtn = true;
                $scope.disableSort = false;
                //$scope.modalCompare = true;
                //$scope.hideModal= function(){
                //$scope.modalCompare = false;
                //};
            };
            $scope.cardViewClick = function () {
                $scope.dataLoaded = true;
                $scope.slickLoaded = true;
                $scope.cardView = false;
                $scope.compareView = true;
                $scope.showCompareBtn = true;
                $scope.showCardBtn = true;
                $scope.disableSort = true;
                //$rootScope.carQuoteResult=$scope.selectedCarrier;
            };
            $scope.findDisplayLimit = function (displayLimitValue) {
                var returnvalue = "NOT AVAILABLE";

                if (displayLimitValue != null) {
                    returnvalue = displayLimitValue;
                }

                return returnvalue;
            };
            $scope.hospitalFeatures = function (hospitalizationRelated, selData) {
                var returnHospitalFeatures = "NA";
                for (var i = 0; i < selData.length; i++) {
                    if (selData[i].CompareName == hospitalizationRelated) {
                        if (!selData[i].compareDisplayLimit) {
                            selData[i].compareDisplayLimit = "NA"
                        }
                        returnHospitalFeatures = selData[i].compareDisplayLimit;
                    }
                }
                return returnHospitalFeatures;
            }
            $scope.preventiveFeature = function (preventiveOutPatient, selData) {
                var returnPreventiveFeatures = "NA";
                for (var i = 0; i < selData.length; i++) {
                    if (selData[i].CompareName == preventiveOutPatient) {
                        if (!selData[i].compareDisplayLimit) {
                            selData[i].compareDisplayLimit = "NA"
                        }
                        returnPreventiveFeatures = selData[i].compareDisplayLimit;
                    }
                }
                return returnPreventiveFeatures;
            }
            $scope.enhancedFeature = function (enhancedCoverage, selData) {
                var returnEnhancedFeatures = "NA";
                for (var i = 0; i < selData.length; i++) {
                    if (selData[i].CompareName == enhancedCoverage) {
                        if (!selData[i].compareDisplayLimit) {
                            selData[i].compareDisplayLimit = "NA"
                        }
                        returnEnhancedFeatures = selData[i].compareDisplayLimit;
                    }
                }
                return returnEnhancedFeatures;
            }
            $scope.preExFeature = function (preExistingDisease, selData) {
                var returnPreDiseaseFeatures = "NA";
                for (var i = 0; i < selData.length; i++) {
                    if (selData[i].CompareName == preExistingDisease) {
                        if (!selData[i].compareDisplayLimit) {
                            selData[i].compareDisplayLimit = "NA"
                        }
                        returnPreDiseaseFeatures = selData[i].compareDisplayLimit;
                    }
                }
                return returnPreDiseaseFeatures;
            }
            $scope.updateDiseaseList = function () {
                var i;
                for (i = 0; i < $scope.diseaseList.length; i++) {
                    for (var j = 0; j < $scope.diseaseList[i].familyList.length; j++) {
                        //if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[j].diseaseId)){
                        if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[j].diseaseId)) {
                            //if(!$scope.personalInfo.selFamilyMember.includes($scope.diseaseList[i].familyList[j].id)){
                            if (p365Includes($scope.personalInfo.selFamilyMember, $scope.diseaseList[i].familyList[j].id) == false) {
                                $scope.diseaseList[i].familyList.splice(j, 1);
                                j = 0;
                            }
                        } else {
                            $scope.diseaseList[i].familyList = [];
                        }
                    }
                }

                var deleteList = [];
                for (i = 0; i < $scope.diseaseList.length; i++) {
                    //if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[i].diseaseId)== true && $scope.diseaseList[i].familyList.length == 0){
                    if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[i].diseaseId) == true && $scope.diseaseList[i].familyList.length == 0) {
                        deleteList.push($scope.diseaseList[i].diseaseId);
                    }
                }

                $scope.selectedDisease.diseaseList = $scope.selectedDisease.diseaseList.filter(function (obj) {
                    return deleteList.indexOf(obj) === -1;
                });

                if ($scope.selectedDisease.diseaseList.length == 0) {
                    $scope.personalInfo.preDiseaseStatus = "No";
                    $scope.isDiseased = false;
                }
            };

            $scope.submitFamily = function () {
                var i;
                var submitFamilyForm = true;
                submitFamilyForm = $scope.validateFamilyForm();

                var familyCounter = 0;
                var familyMemberExistStatus = false;
                for (i = 0; i < $scope.familyList.length; i++) {
                    if ($scope.familyList[i].val == true) {
                        familyMemberExistStatus = true;
                        familyCounter += 1;
                    }
                }

                if (familyCounter > 1) {
                    $scope.quoteParam.planType = "F";
                } else {
                    $scope.quoteParam.planType = "I";
                }

                if (familyMemberExistStatus) {
                    if (submitFamilyForm == true) {
                        $scope.modalFamily = false;
                        $scope.quoteHealthInputForm.$setDirty();
                        $scope.quoteHealthInputForm.healthInputForm.$setDirty();
                    }
                } else {
                    $scope.familyErrors.push("Please select atleast one member.");
                }
            };

            $scope.validateFamilyForm = function () {
                $scope.familyErrors = [];
                var submitFamilyForm = true;
                var i;
                var ageOfSelf, ageOfSpouse, ageOfFather, lesserAge;
                for (i = 0; i < $scope.familyList.length; i++) {
                    if ($scope.familyList[i].member == "Self") {

                        if ($scope.familyList[i].val) {
                            $scope.ratingParam.isSelf = "Y";
                            ageOfSelf = Number($scope.familyList[i].age);
                        } else {
                            $scope.ratingParam.isSelf = "N";
                        }
                    } else if ($scope.familyList[i].member == "Spouse") {

                        if ($scope.familyList[i].val) {
                            $scope.ratingParam.isSpouse = "Y";
                            ageOfSpouse = Number($scope.familyList[i].age);
                        } else {
                            $scope.ratingParam.isSpouse = "N";
                        }
                    } else if ($scope.familyList[i].member == "Father") {
                        if ($scope.familyList[i].val) {
                            ageOfFather = Number($scope.familyList[i].age);
                        }
                    }

                    if (ageOfSelf == 'undefined' || ageOfSelf == '' || ageOfSelf == null) {
                        lesserAge = ageOfSpouse;
                    } else {
                        lesserAge = ageOfSpouse < ageOfSelf ? ageOfSpouse : ageOfSelf;
                        //alert(lesserAge)
                    }
                    if ($scope.familyList[i].val == true) {
                        if ($scope.familyList[i].relationship == "CH" && $scope.familyList[i].age > lesserAge - 1) {
                            /*if($scope.familyErrors.includes("Child's age should be at least 18 years lesser than the younger parent")==false){
                            	$scope.familyErrors.push("Child's age should be at least 18 years lesser than the younger parent");
                            	submitFamilyForm=false;
                            }*/
                            if (p365Includes($scope.familyErrors, "Please correct,Child age is same as or greater than the Parent's age") == false) {
                                $scope.familyErrors.push("Please correct,Child age is same as or greater than the Parent's age");
                                submitFamilyForm = false;
                            }
                        }

                        if (($scope.familyList[i].member == "Father" || $scope.familyList[i].member == "Mother") && $scope.familyList[i].age < ageOfSelf + 1) {
                            /*if($scope.familyErrors.includes("Your Parents' age should be at least 18 years more than your age")==false){
                            	$scope.familyErrors.push("Your Parents' age should be at least 18 years more than your age");
                            	submitFamilyForm=false;
                            }*/
                            if (p365Includes($scope.familyErrors, "Please correct,Your age is same as or greater than your Parent's age") == false) {
                                $scope.familyErrors.push("Please correct,Your age is same as or greater than your Parent's age");
                                submitFamilyForm = false;
                            }
                        }

                        if (($scope.familyList[i].member == "Father-in-Law" || $scope.familyList[i].member == "Mother-in-Law") && $scope.familyList[i].age < ageOfSpouse + 1) {
                            /*if($scope.familyErrors.includes("Your In-Laws' age should be at least 18 years more than your spouse's age")==false){
                            	$scope.familyErrors.push("Your In-Laws' age should be at least 18 years more than your spouse's age");
                            	submitFamilyForm=false;
                            }*/
                            if (p365Includes($scope.familyErrors, "Please correct, your Spouse's age is same as or greater than your In-Laws' age") == false) {
                                $scope.familyErrors.push("Please correct, your Spouse's age is same as or greater than your In-Laws' age");
                                submitFamilyForm = false;
                            }
                        }

                        if (($scope.familyList[i].member == "Grand Father" || $scope.familyList[i].member == "Grand Mother") && $scope.familyList[i].age < ageOfFather + 1 && $scope.familyList[i].age < ageOfSelf + 2) {
                            /*if($scope.familyErrors.includes("Your Grand Parents' age should be at least 18 years more than your father's age")==false){
                            	$scope.familyErrors.push("Your Grand Parents' age should be at least 18 years more than your father's age");
                            	submitFamilyForm=false;
                            }*/
                            if (p365Includes($scope.familyErrors, "Please correct,your Father's age is same as or greater than your Grand Parents' age") == false) {
                                $scope.familyErrors.push("Please correct,your Father's age is same as or greater than your Grand Parents' age");
                                submitFamilyForm = false;
                            }
                        }
                    }
                }
                return submitFamilyForm;
            };

            $scope.closeFamilyMemberModal = function () {
                $scope.familyList = $scope.oldFamilyList;
                $scope.modalFamily = false;
            };

            $scope.closePreExistingDiseaseModal = function () {
                var deleteList = [];
                for (var i = 0; i < $scope.diseaseList.length; i++) {
                    if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[i].diseaseId) == true && $scope.diseaseList[i].familyList.length == 0) {
                        deleteList.push($scope.diseaseList[i].diseaseId);
                    } else if (p365Includes($scope.oldSelectedDiseaseList, $scope.diseaseList[i].diseaseId) == false) {
                        deleteList.push($scope.diseaseList[i].diseaseId);
                    }
                }

                $scope.selectedDisease.diseaseList = $scope.selectedDisease.diseaseList.filter(function (obj) {
                    return deleteList.indexOf(obj) === -1;
                });

                if ($scope.selectedDisease.diseaseList.length == 0) {
                    $scope.personalInfo.preDiseaseStatus = "No";
                    $scope.isDiseased = false;
                }

                $scope.modalHealth = false;
            };

            $scope.submitPreDiseaseList = function () {
                var i;
                var submitDiseaseForm = true;
                $scope.ratingParam.criticalIllness = "N";
                $scope.ratingParam.organDonar = "N";

                for (i = 0; i < $scope.diseaseList.length; i++) {
                    //if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[i].diseaseId) == true){
                    if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[i].diseaseId) == true) {
                        if ($scope.diseaseList[i].diseaseType == "OrganDonar")
                            $scope.ratingParam.organDonar = "Y";

                        if ($scope.diseaseList[i].diseaseType == "Critical")
                            $scope.ratingParam.criticalIllness = "Y";

                        if ($scope.diseaseList[i].familyList.length == 0) {
                            $scope.diseaseError = "Please select family members against each selected disease";
                            submitDiseaseForm = false;
                        }
                    }
                }
                if (submitDiseaseForm) {
                    $scope.modalHealth = false;
                    $scope.diseaseError = "";

                    if ($scope.selectedDisease.diseaseList.length == 0) {
                        $scope.personalInfo.preDiseaseStatus = "No";
                        $scope.isDiseased = false;
                    }

                    for (i = 0; i < $scope.diseaseList.length; i++) {
                        if ($scope.diseaseList[i].familyList) {
                            for (var j = 0; j < $scope.diseaseList[i].familyList.length; j++) {
                                for (var k = 0; k < $scope.selectedFamilyArray.length; k++) {
                                    if ($scope.diseaseList[i].familyList[j].id == $scope.selectedFamilyArray[k].id) {
                                        $scope.diseaseList[i].familyList[j].status = true;
                                    }
                                }
                            }
                        }
                    }

                    $scope.quoteHealthInputForm.$setDirty();
                    // if(!$rootScope.wordPressEnabled){
                    // 	$scope.singleClickHealthQuote();
                    // }			
                }
            };

            $scope.getDisease = function () {
                return $scope.selectedDisease.diseaseList;
            };


            $scope.removeFamilyMember = function (data) {
                data.val = false;
            };

            $scope.removePreDisease = function (data) {
                var i;
                for (i = 0; i < $scope.selectedDisease.diseaseList.length; i++) {
                    if ($scope.selectedDisease.diseaseList[i] == data.diseaseId) {
                        $scope.selectedDisease.diseaseList.splice(i, 1);
                        break;
                    }
                }
                if ($rootScope.wordPressEnabled) {
                    $scope.quoteHealthInputForm.healthInputForm.$setDirty();
                }
                for (i = 0; i < $scope.diseaseList.length; i++) {
                    if ($scope.diseaseList[i].diseaseId == data.diseaseId) {
                        $scope.diseaseList[i].familyList = [];
                        break;
                    }
                }

                if ($scope.selectedDisease.diseaseList.length == 0) {
                    $scope.personalInfo.preDiseaseStatus = "No";
                    $scope.isDiseased = false;
                }
                $scope.submitPreDiseaseList();

            };

            $scope.checkDisease = function (value, checked) {
                var idx = $scope.selectedDisease.diseaseList.indexOf(value);
                if (idx >= 0 && !checked) {
                    $scope.selectedDisease.diseaseList.splice(idx, 1);
                }
                if (idx < 0 && checked) {
                    $scope.selectedDisease.diseaseList.push(value);
                }
                console.log('$scope.selectedDisease.diseaseList in check disease: ', $scope.selectedDisease.diseaseList);
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

            $scope.clicktoDisable = function () {
                setTimeout(function () {
                    $('.md-click-catcher').css('pointer-events', 'none');
                }, 100);
            };

            $scope.rateit = {
                readonly_enables: true
            };

            $scope.diseaseClick = function () {
                if ($scope.personalInfo.preDiseaseStatus == "Yes") {
                    $scope.isDiseased = true;
                    $scope.toggleHealth();
                } else {
                    $scope.isDiseased = false;
                    $scope.selectedDisease.diseaseList.length = 0;
                    $scope.selectedDisease.diseaseList = [];
                    for (var i = 0; i < $scope.diseaseList.length; i++) {
                        $scope.diseaseList[i].familyList.length = 0;
                        $scope.diseaseList[i].familyList = [];
                    }

                    // setTimeout(function () {
                    // 	if (!$rootScope.wordPressEnabled) {
                    // 		$scope.singleClickHealthQuote();
                    // 	}
                    // }, 100);
                }
            };

            $scope.modalHealth = false;
            $scope.toggleHealth = function () {
                $scope.modalHealth = !$scope.modalHealth;
                $scope.oldSelectedDiseaseList = angular.copy($scope.selectedDisease.diseaseList);
            };


            $scope.modalFamily = false;
            $scope.toggleFamily = function () {
                $scope.modalFamily = !$scope.modalFamily;
                $scope.oldFamilyList = angular.copy($scope.familyList);
            };

            $scope.modalPIN = false;
            $scope.togglePin = function () {
                $scope.modalPIN = !$scope.modalPIN;
                $scope.oldPincode = $scope.personalInfo.pincode;
                $scope.hideModal = function () {
                    $scope.personalInfo.pincode = $scope.oldPincode;
                    $scope.modalPIN = false;
                };
            };

            $rootScope.editForMobile = function () {
                $rootScope.showonEdit = "inline !important";
                $rootScope.hideonEdit = "none !important";
                $scope.flagforMobile = true;
            }

            //This one is in use currently 
            /*$scope.submitBtn=false;
            $scope.editBtn=true;*/
            var setChangeFlag = true;
            $scope.toggleChange = function (clickEvent) {
                $rootScope.loading = true;

                setTimeout(function () {

                    $('.firstPane').addClass('opened');
                    $('.firstPaneContent').show();
                    if ($('.viewDiv').is(':visible') == true) {
                        //$(".modifyDiv").slideDown();
                        //$(".viewDiv").slideUp();
                        /*$scope.editBtn=false;
					$scope.submitBtn=true;
					$scope.cancelBtn=true;	*/
                    } else {
                        if ($('.modifyDiv').is(':visible') == true && clickEvent == "cancel") {
                            var i;
                            $scope.getHospitalList();
                            $scope.quote = $scope.quoteReset;
                            $scope.quoteParam = $scope.quoteReset.quoteParam;
                            $scope.personalInfo = $scope.quoteReset.personalInfo;
                            $scope.selectedArea = $scope.selectedArea;
                            $scope.isDiseased = $scope.isDiseasedReset;
                            $scope.familyList = $scope.familyListReset;
                            $scope.selectedDisease = $scope.selectedDiseaseReset;
                            $scope.selectedFamilyArray = $scope.selectedFamilyArrayReset;
                            $scope.diseaseList = $scope.diseaseListReset;
                            $scope.userGeoDetails = $scope.userGeoDetailsReset;
                            $scope.hospitalList = $scope.hospitalListReset; // Tooltip for Hospitalization Cashless Facility
                            $scope.hospitalizationLimitArray = $scope.hospitalizationLimitArrayReset;

                            for (i = 1; i < $scope.familyList.length; i++) {
                                if ($scope.familyList[i].age < $scope.ratingParam.minInsuredAge)
                                    $scope.ratingParam.minInsuredAge = Number($scope.familyList[i].age);
                                if ($scope.familyList[i].age > $scope.ratingParam.minInsuredAge)
                                    $scope.ratingParam.maxInsuredAge = Number($scope.familyList[i].age);
                            }

                            for (i = 0; i < $scope.familyList.length; i++) {
                                if ($scope.familyList[i].val == true) {
                                    member = {};
                                    member.relationShip = $scope.familyList[i].relationship;
                                    member.age = Number($scope.familyList[i].age);
                                    if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && member.relationShip == "S") {
                                        member.gender = "F";
                                    } else if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && member.relationShip == "SP") {
                                        member.gender = "M";
                                    } else {
                                        member.gender = $scope.familyList[i].gender;
                                    }
                                    //member.gender = $scope.familyList[i].gender;
                                    member.occupationClass = $scope.familyList[i].occupationClass;
                                    $scope.quoteParam.dependent.push(member);
                                }
                            }

                            for (i = 0; i < $scope.familyList.length; i++) {
                                if ($scope.familyList[i].val == true) {
                                    member = {};
                                    member.id = Number($scope.familyList[i].id);
                                    member.age = Number($scope.familyList[i].age);
                                    member.dob = $scope.familyList[i].dob;
                                    //member.gender = $scope.familyList[i].gender == "M" ? "Male" : "Female";
                                    member.salutation = $scope.familyList[i].gender == "M" ? "Mr" : "Ms";
                                    member.existSince = "";
                                    member.existSinceError = false;
                                    member.status = false;
                                    member.relationship = $scope.familyList[i].relationship;
                                    if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && $scope.familyList[i].relationship == "S") {
                                        member.gender = "Female";
                                    } else if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && $scope.familyList[i].relationship == "SP") {
                                        member.gender = "Male";
                                    } else {
                                        member.gender = $scope.familyList[i].gender == "M" ? "Male" : "Female";
                                    }

                                    member.relation = $scope.familyList[i].member;
                                    if (member.relation == "Son" || member.relation == "Daughter") {
                                        member.display = member.relation + " aged " + member.age;
                                    } else {
                                        member.display = member.relation;
                                    }

                                    $scope.personalInfo.selectedFamilyMembers.push(member);
                                }
                            }

                            for (i = 0; i < $scope.personalInfo.selectedFamilyMembers.length; i++) {
                                $scope.personalInfo.selectedFamilyMembers[i].dieaseDetails = [];

                                $scope.dieaseDetails = [];
                                for (var j = 0; j < $scope.diseaseList.length; j++) {
                                    //if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[j].diseaseId)== true){
                                    if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[j].diseaseId) == true) {
                                        for (var k = 0; k < $scope.diseaseList[j].familyList.length; k++) {
                                            if ($scope.personalInfo.selectedFamilyMembers[i].id == $scope.diseaseList[j].familyList[k].id) {
                                                $scope.diseaseList[j].familyList[k].status = true;
                                                var dieaseDetails = {};
                                                dieaseDetails.dieaseCode = $scope.diseaseList[j].diseaseId;
                                                dieaseDetails.dieaseName = $scope.diseaseList[j].disease;
                                                dieaseDetails.masterDieaseCode = $scope.diseaseList[j].diseaseCode;
                                                dieaseDetails.applicable = true;
                                                $scope.dieaseDetails.push(dieaseDetails);
                                            }
                                        }


                                    }
                                }
                                $scope.personalInfo.selectedFamilyMembers[i].dieaseDetails = $scope.dieaseDetails;

                            }
                            $scope.userGeoDetails = $scope.userGeoDetailsReset;
                            $scope.hospitalList = $scope.hospitalListReset; // Tooltip for Hospitalization Cashless Facility
                            $scope.hospitalizationLimitArray = $scope.hospitalizationLimitArrayReset;
                            $scope.hospitalisationLimit = $scope.hospitalisationLimitReset;
                            //$scope.singleClickHealthQuote();

                            $rootScope.loading = false;
                        }
                    }
                }, 500);
            };

            $scope.setfromController = true;
            setFlag = true;
            $scope.submitReportBtn = false;
            $scope.editReportBtn = true;
            $scope.toggleReportChange = function () {
                $('.thirdPane').addClass('opened');
                $('.thirdPaneContent').show();
                if ($('.viewReportDiv').is(':visible') == true) {
                    $(".modifyReportDiv").show();
                    $(".viewReportDiv").hide();
                    $scope.editReportBtn = false;
                    $scope.submitReportBtn = true;
                    $scope.cancelReportBtn = true;
                    setFlag = false;
                } else if ($('.modifyReportDiv').is(':visible') == true) {
                    $(".viewReportDiv").slideDown();
                    $(".modifyReportDiv").slideUp();
                    $scope.editReportBtn = true;
                    $scope.submitReportBtn = false;
                    $scope.cancelReportBtn = false;
                    setFlag = true;
                }
            };

            $scope.checkDisable = function () {
                if (setFlag == false) {
                    $scope.setfromController = false;
                } else {
                    $scope.setfromController = true;
                }
            };

            $(".toggleResetChange").click(function () {
                $(".viewReportDiv").slideDown();
                $(".modifyReportDiv").slideUp();
                $(this).closest('.InsideWrapper').find('.changeReportText').text('Edit');
                $(this).closest('.InsideWrapper').find('.substituteIcon').addClass('changeicon');
                $(this).closest('.InsideWrapper').find('.substituteIcon').removeClass('submiticon');
            });

            // Function created to sort quote result.

            // $scope.updateSort = function (sortOption) {
            // 	$scope.activeSort = sortOption.key;
            // 	$scope.selectedSortOption = sortOption;
            // 	if (sortOption.key == 1) {
            // 		$scope.sortKey = "annualPremium";
            // 		$scope.sortReverse = false;
            // 	} else if (sortOption.key == 2) {
            // 		$scope.sortKey = "sumInsured";
            // 		$scope.sortReverse = true;
            // 	} else if (sortOption.key == 3) {
            // 		//$scope.quotesToShow = $filter('orderBy')($scope.quotesToShow,"ratingsList[1]["+$scope.keySliderHospitalizationRelatedFeature.value+"]",true);
            // 		$scope.sortKey = "insurerIndex";
            // 		$scope.sortReverse = true;
            // 	} else if (sortOption.key == 4) {
            // 		$scope.sortKey = "ratingsList[1][" + $scope.keySliderHospitalizationRelatedFeature.value + "]";
            // 		$scope.sortReverse = true;
            // 	} else if (sortOption.key == 5) {
            // 		$scope.sortKey = "ratingsList[2][" + $scope.keySliderPreventiveOutPatientRelatedFeature.value + "]";
            // 		$scope.sortReverse = true;
            // 	} else if (sortOption.key == 6) {
            // 		$scope.sortKey = "ratingsList[3][" + $scope.keySliderEnhancedCoverageFeature.value + "]";
            // 		$scope.sortReverse = true;
            // 	} else if (sortOption.key == 7) {
            // 		$scope.sortKey = "ratingsList[4][" + $scope.keySliderPreExistingDiseasesFeature.value + "]";
            // 		$scope.sortReverse = true;
            // 	}
            // 	$scope.toggleState();
            // };

            // $scope.updateSortOrder = function () {
            // 	if ($scope.selectedSortOption.key == 1) {
            // 		$scope.sortKey = "annualPremium";
            // 	} else if ($scope.selectedSortOption.key == 2) {
            // 		$scope.sortKey = "sumInsured";
            // 	} else if ($scope.selectedSortOption.key == 3) {
            // 		$scope.sortKey = "insurerIndex";
            // 	} else if ($scope.selectedSortOption.key == 4) {
            // 		$scope.sortKey = "ratingsList[1][" + $scope.keySliderHospitalizationRelatedFeature.value + "]";
            // 	} else if ($scope.selectedSortOption.key == 5) {
            // 		$scope.sortKey = "ratingsList[2][" + $scope.keySliderPreventiveOutPatientRelatedFeature.value + "]";
            // 	} else if ($scope.selectedSortOption.key == 6) {
            // 		$scope.sortKey = "ratingsList[3][" + $scope.keySliderEnhancedCoverageFeature.value + "]";
            // 	} else if ($scope.selectedSortOption.key == 7) {
            // 		$scope.sortKey = "ratingsList[4][" + $scope.keySliderPreExistingDiseasesFeature.value + "]";
            // 	}
            // 	$scope.sortReverse = !$scope.sortReverse;
            // };
            // if ($rootScope.healthQuoteResult[0]) {
            // 	$scope.keySliderHospitalizationRelatedFeature = {
            // 		value: $rootScope.healthQuoteResult[0].risks['1']
            // 	};

            // 	$scope.keySliderPreventiveOutPatientRelatedFeature = {
            // 		value: "" + $rootScope.healthQuoteResult[0].risks['2']
            // 	};

            // 	$scope.keySliderEnhancedCoverageFeature = {
            // 		value: "" + $rootScope.healthQuoteResult[0].risks['3']
            // 	};

            // 	$scope.keySliderPreExistingDiseasesFeature = {
            // 		value: "" + $rootScope.healthQuoteResult[0].risks['4']
            // 	};
            // }

            $scope.tabs = [{
                title: 'Hospitalisation Coverage',
                url: 'hospitalisation.tpl.html',
                className: 'tabs'
            }, {
                title: 'Preventive & Out-Patient',
                url: 'preventive.tpl.html',
                className: 'tabs'
                //disabled: true
            }, {
                title: 'Bonus/Additional Coverage',
                url: 'enhanced.tpl.html',
                className: 'tabs'
                //disabled: true
            }, {
                title: 'Exclusions & Shared Costs',
                url: 'disease.tpl.html',
                className: 'tabs'
                //disabled: true
            }];


            $scope.currentTab = 'hospitalisation.tpl.html';
            $scope.onClickTab = function (tab) {
                if (tab.disabled)
                    return;
                $scope.currentTab = tab.url;
            };

            $scope.isActiveTab = function (tabUrl) {
                return tabUrl == $scope.currentTab;
            };

            $scope.healthmodalBeneFeature = false;
            $scope.viewBeneFeature = function (selectedData) {
                $scope.healthmodalBeneFeature = true;
                $scope.beneFeatures = selectedData;
            };

            $scope.closeBeneFeatureHealth = function () {
                $scope.healthmodalBeneFeature = false;
            };

            $scope.errorRespCounter = true;
            $scope.errorMessage = function (errorMsg) {
                if ($scope.errorRespCounter && (String($rootScope.healthQuoteResult) == "undefined" || $rootScope.healthQuoteResult.length == 0)) {
                    $scope.errorRespCounter = false;
                    $scope.errorSectionButtonStatus = true;
                    $scope.quoteCalculationError = errorMsg;
                    $rootScope.viewOptionDisabled = true;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.loading = false;
                } else if ($rootScope.healthQuoteResult.length > 0) {
                    $scope.errorSectionButtonStatus = true;
                    $scope.quoteCalculationError = "";
                    $rootScope.viewOptionDisabled = false;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.loading = false;
                }
            };

            $scope.fetchDefaultInputParamaters = function (defaultInputParamCallback) {
                $scope.personalInfo.preDiseaseStatus = "No";
                $scope.isDiseased = false;
                $scope.quoteParam = defaultHealthQuoteParam.quoteParam;
                $scope.ratingParam = defaultHealthQuoteParam.ratingParam;
                $scope.personalInfo = defaultHealthQuoteParam.personalInfo;

                $scope.personalInfo.pincode = localStorageService.get("cityDataFromIP") ? (localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : $scope.personalInfo.pincode) : $scope.personalInfo.pincode;
                $scope.calcDefaultAreaDetails($scope.personalInfo.pincode);
                defaultInputParamCallback();

            };

            $scope.calculateDefaultQuote = function (errorFlag) {
                localStorageService.remove("healthQuoteInputParamaters");
                if (errorFlag == 0) {
                    $location.path('/quote');
                } else {
                    $scope.quoteHealthInputForm.$setDirty();
                    $scope.selectedFamilyArray = [];
                    $scope.selectedDisease.diseaseList = [];

                    $scope.parent.roomRentFeature = false;
                    $scope.parent.preExistingCoverageFeature = false;


                    $scope.familyList = healthFamilyListGeneric;
                    $scope.fetchDefaultInputParamaters(function () {
                        $scope.singleClickHealthQuote();
                    });
                }
            };


            //filter for best premium
            $scope.customFilterHealth = function () {
                $scope.netPremiumTotalHealth = 0;
                $scope.netPremiumAverageHealth = 0;
                $scope.netPremiumMaxHealth = 0;
                $scope.proffesionalRatingHealth = 0;

                for (var i = 0; i < $scope.quotesToShow.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalHealth += $scope.quotesToShow[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageHealth = Number(($scope.netPremiumTotalHealth / $scope.quotesToShow.length).toFixed(5));
                }
                for (var i = 0; i < $scope.quotesToShow.length; i++) {
                    $scope.quotesToShow[i].netPremiumMax = Number(($scope.netPremiumAverageHealth / $scope.quotesToShow[i].premiumRatio).toFixed(5));
                    if ($scope.quotesToShow[i].netPremiumMax > $scope.netPremiumMaxHealth) {
                        $scope.netPremiumMaxHealth = $scope.quotesToShow[i].netPremiumMax;
                    }
                }
                for (var i = 0; i < $scope.quotesToShow.length; i++) {
                    $scope.quotesToShow[i].netPremiumMean = Number((($scope.quotesToShow[i].netPremiumMax / $scope.netPremiumMaxHealth) * 5).toFixed(1));
                    $scope.quotesToShow[i].proffesionalRating = ($scope.quotesToShow[i].netPremiumMean * 0.3) +
                        ($scope.quotesToShow[i].hospitalIndex * 0.2) +
                        ($scope.quotesToShow[i].benefitIndex * 0.3) +
                        ($scope.quotesToShow[i].insurerIndex * 0.2);
                    $scope.quotesToShow[i].proffesionalRating = $scope.quotesToShow[i].proffesionalRating;
                }

                $scope.quotesToShow = $filter('orderBy')($scope.quotesToShow, 'proffesionalRating');
                $scope.quotesToShow = $scope.quotesToShow;
                //	console.log('$scope.quotesToShow',$scope.quotesToShow)
                $scope.sortReverse = true;
                return true;
            }

            $scope.customFilterHealthSelectedProduct = function () {
                $scope.netPremiumTotalHealth = 0;
                $scope.netPremiumAverageHealth = 0;
                $scope.netPremiumMaxHealth = 0;
                $scope.proffesionalRatingHealth = 0;

                for (var i = 0; i < $scope.quotesToShow.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalHealth += $scope.quotesToShow[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageHealth = Number(($scope.netPremiumTotalHealth / $scope.quotesToShow.length).toFixed(5));
                }
                for (var i = 0; i < $scope.quotesToShow.length; i++) {
                    $scope.quotesToShow[i].netPremiumMax = Number(($scope.netPremiumAverageHealth / $scope.quotesToShow[i].premiumRatio).toFixed(5));
                    if ($scope.quotesToShow[i].netPremiumMax > $scope.netPremiumMaxHealth) {
                        $scope.netPremiumMaxHealth = $scope.quotesToShow[i].netPremiumMax;
                    }
                }
                for (var i = 0; i < $scope.quotesToShow.length; i++) {
                    $scope.quotesToShow[i].netPremiumMean = Number((($scope.quotesToShow[i].netPremiumMax / $scope.netPremiumMaxHealth) * 5).toFixed(1));
                    $scope.quotesToShow[i].proffesionalRating = ($scope.quotesToShow[i].netPremiumMean * 0.3) +
                        ($scope.quotesToShow[i].hospitalIndex * 0.2) +
                        ($scope.quotesToShow[i].benefitIndex * 0.3) +
                        ($scope.quotesToShow[i].insurerIndex * 0.2);
                    $scope.quotesToShow[i].proffesionalRating = $scope.quotesToShow[i].proffesionalRating;
                }


                console.log('localStorageService.get("healthProductToBeAddedInCart in step 1:', localStorageService.get("healthProductToBeAddedInCart"));
                var carrierAllReadyAdded = false;
                if (localStorageService.get("healthProductToBeAddedInCart")) {
                    for (var i = 0; i < $scope.quotesToShow.length; i++) {
                        if (localStorageService.get("healthProductToBeAddedInCart").carrierId && localStorageService.get("healthProductToBeAddedInCart").planId && localStorageService.get("healthProductToBeAddedInCart").childPlanId) {
                            if (localStorageService.get("healthProductToBeAddedInCart").carrierId == $scope.quotesToShow[i].carrierId && localStorageService.get("healthProductToBeAddedInCart").planId == $scope.quotesToShow[i].planId && localStorageService.get("healthProductToBeAddedInCart").childPlanId == $scope.quotesToShow[i].childPlanId) {
                                console.log('localStorageService.get("healthProductToBeAddedInCart in step 2:', $scope.quotesToShow[i]);
                                //hard coded as it has one value
                                //$scope.quotesToShow[i].netPremiumMean = 5;
                                $scope.selectProduct($scope.quotesToShow[i], false);
                                $rootScope.healthQuote = $scope.quotesToShow[i];
                                var carrierAllReadyAdded = true;
                                break;
                            }
                        } else if (localStorageService.get("healthProductToBeAddedInCart").carrierId && localStorageService.get("healthProductToBeAddedInCart").planId) {
                            if (localStorageService.get("healthProductToBeAddedInCart").carrierId == $scope.quotesToShow[i].carrierId && localStorageService.get("healthProductToBeAddedInCart").planId == $scope.quotesToShow[i].planId) {
                                console.log('localStorageService.get("healthProductToBeAddedInCart in step 3:', $scope.quotesToShow[i]);
                                $scope.selectProduct($scope.quotesToShow[i], false);
                                $rootScope.healthQuote = $scope.quotesToShow[i];
                                var carrierAllReadyAdded = true;
                                break;
                            }
                        }

                    }

                    if (!carrierAllReadyAdded) {
                        $scope.customFilterHealth();
                        $rootScope.healthQuote = $scope.quotesToShow[0];
                        $scope.isGotHealthQuotes = true;
                    } else {
                        $scope.isGotHealthQuotes = true;
                    }
                }
            }


            $scope.processResult = function () {
                $rootScope.viewOptionDisabled = false;
                $rootScope.tabSelectionStatus = true;
                $rootScope.modalShown = false;
                $rootScope.loading = false;
                console.log('inside health premium step 2');
                //$rootScope.healthQuoteResult = $filter('orderBy')($rootScope.healthQuoteResult, 'annualPremium');
                // for(var j = 0; j < $rootScope.healthQuoteResult.length; j++){
                // 	if(j==$rootScope.healthQuoteResult.length -1 ){
                // 		$timeout(function(){
                // 			//$scope.dataLoaded=true;
                // 			$rootScope.loading = false;
                // 			//$scope.slickLoaded=true;
                // 		},3000);
                // 	}
                // }
                //$scope.selectProduct($rootScope.healthQuoteResult[0], false);
                $scope.quotesToShow = $rootScope.healthQuoteResult;
                $scope.quotesToShowCopy = angular.copy($scope.quotesToShow);
                console.log('inside health premium step 2', $scope.quotesToShowCopy.length);

                $scope.selectedCarrierName.CompanyName = [];
                angular.forEach($scope.quotesToShowCopy, function (obj, i) {
                    $scope.selectedCarrierName.CompanyName.push(obj.insuranceCompany);
                });

                //$scope.filterForFeatures();
                //$scope.displayRibbon();
                //commented as Add to cart is removed
                // $scope.customFilterHealthSelectedProduct();



            };

            $scope.isMinPremium = function (annualPremiumValue, carrierIDValue) {
                if (String($rootScope.healthQuoteResult[0]) != "undefined") {
                    var min = $rootScope.healthQuoteResult[0].annualPremium;

                    for (var i = 0; i <= $rootScope.healthQuoteResult.length - 1; i++) {
                        var carrierIdMin = $rootScope.healthQuoteResult[i].carrierId;
                        if (Number($rootScope.healthQuoteResult[i].annualPremium) < min) {
                            min = $rootScope.healthQuoteResult[i].annualPremium;
                            carrierIDValue = carrierIdMin;
                        }
                    }
                    if (min === annualPremiumValue) {
                        $scope.selMinCarrierId = carrierIDValue;
                        return true;
                    } else {
                        return false;
                    }
                }
            };

            // $scope.displayRibbon = function () {


            // 	$scope.isMaxIndex = function (insurerIndex, sumInsured, annualPremium, carrierSelID) {
            // 		if (String($rootScope.healthQuoteResult[0]) != "undefined") {
            // 			var maxSel = (annualPremium / (insurerIndex * sumInsured)) * 1000;

            // 			var insurerIndex0 = $rootScope.healthQuoteResult[0].insurerIndex;
            // 			var sumInsured0 = $rootScope.healthQuoteResult[0].sumInsured;
            // 			var annualPremium0 = $rootScope.healthQuoteResult[0].annualPremium;
            // 			var max = (annualPremium0 / (sumInsured0 * insurerIndex0)) * 1000;

            // 			for (var i = 0; i <= $rootScope.healthQuoteResult.length - 1; i++) {
            // 				var insurerIndexI = $rootScope.healthQuoteResult[i].insurerIndex;
            // 				var sumInsuredI = $rootScope.healthQuoteResult[i].sumInsured;
            // 				var annualPremiumI = $rootScope.healthQuoteResult[i].annualPremium;
            // 				var carrierIdI = $rootScope.healthQuoteResult[i].carrierId;

            // 				var maxI = (annualPremiumI / (sumInsuredI * insurerIndexI)) * 1000;

            // 				if (Number(maxI) < max) {
            // 					max = maxI;
            // 					carrierSelID = carrierIdI;

            // 				}
            // 			}
            // 			if (max === maxSel) {
            // 				$scope.selCarrierId = carrierSelID;
            // 				return true;
            // 			} else {
            // 				return false;
            // 			}
            // 		}
            // 	};
            // };
            // $scope.displayRibbon();

            $scope.singleClickHealthQuote = function () {
                var i;
                console.log('$scope.quoteHealthInputForm.$dirty : ', $scope.quoteHealthInputForm.$dirty);
                //setTimeout(function(){
                if ($scope.quoteHealthInputForm.$dirty || $scope.isRiderFormDirty) {
                    setTimeout(function () {
                        if ($scope.flagforMobile) {
                            $rootScope.showonEdit = "none !important";
                            $rootScope.hideonEdit = "inline !important";
                            $scope.flagforMobile = false;
                        }
                        $scope.dataLoaded = false;
                        $rootScope.modalShown = true;
                        $scope.errorRespCounter = true;
                        $scope.filterBenefitModal = false;
                        $scope.isRiderFormDirty = false;
                        $rootScope.loading = true;
                        $scope.noQuoteResultFound = false;
                        //added to display loader in product/profession journey
                        $scope.isGotHealthQuotes = false;
                        $scope.quoteParam.dependent = [];
                        $scope.quoteParam.preExistingDisease = [];
                        $scope.quoteParam.riders = [];
                        $scope.personalInfo.selectedFamilyMembers = [];

                        // $scope.healthInfo = {};
                        // $scope.healthInfo.selectedFamilyMembers = [];

                        if ($scope.buyConfrmFlag) {
                            $scope.resultCnfrmBuyFlag = true;
                            $scope.buyConfrmFlag = false;
                        } else {
                            $scope.resultCnfrmBuyFlag = false;
                        }
                        $scope.personalInfo.minHospitalisationLimit = $scope.hospitalisationLimit.minHosLimit;
                        $scope.personalInfo.maxHospitalisationLimit = $scope.hospitalisationLimit.maxHosLimit;
                        $scope.personalInfo.hospitalisationLimitDisplayValue = $scope.hospitalisationLimit.displayValue;
                        $scope.quoteParam.childCount = 0;
                        $scope.quoteParam.adultCount = 0;
                        $scope.quoteParam.totalCount = 0;
                        //for adding mobile number in quote request if call goes to quote calculation
                        if (localStorageService.get("quoteUserInfo")) {
                            if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                $scope.quote.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                            }
                        }
                        $scope.validateFamilyForm();
                        /*this was the cause behind sending multipal quote reqs.
                         * 
                         * $scope.submitPreDiseaseList();*/

                        if ($scope.isDiseased == true) {
                            $scope.quoteParam.preExistingDisease = $scope.selectedDisease.diseaseList;
                        }

                        for (i = 0; i < $scope.familyList.length; i++) {
                            if ($scope.familyList[i].member == 'Self')
                                $scope.quoteParam.selfAge = Number($scope.familyList[i].age);
                        }
                        for (i = 0; i < $scope.familyList.length; i++) {
                            if ($scope.familyList[i].member == 'Spouse')
                                $scope.ratingParam.spouseAge = Number($scope.familyList[i].age);
                        }

                        $scope.ratingParam.minInsuredAge = Number($scope.familyList[0].age);
                        $scope.ratingParam.maxInsuredAge = Number($scope.familyList[0].age);

                        for (i = 1; i < $scope.familyList.length; i++) {
                            if ($scope.familyList[i].age < $scope.ratingParam.minInsuredAge)
                                $scope.ratingParam.minInsuredAge = Number($scope.familyList[i].age);
                            if ($scope.familyList[i].age > $scope.ratingParam.minInsuredAge)
                                $scope.ratingParam.maxInsuredAge = Number($scope.familyList[i].age);
                        }

                        for (i = 0; i < $scope.familyList.length; i++) {
                            if ($scope.familyList[i].val == true) {
                                member = {};
                                member.relationShip = $scope.familyList[i].relationship;
                                member.age = Number($scope.familyList[i].age);
                                if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && member.relationShip == "S") {
                                    member.gender = "F";
                                } else if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && member.relationShip == "SP") {
                                    member.gender = "M";
                                } else {
                                    member.gender = $scope.familyList[i].gender;
                                }
                                //member.gender = $scope.familyList[i].gender;
                                member.occupationClass = $scope.familyList[i].occupationClass;
                                $scope.quoteParam.dependent.push(member);
                            }
                        }

                        for (i = 0; i < $scope.familyList.length; i++) {
                            if ($scope.familyList[i].val == true) {
                                member = {};
                                member.id = Number($scope.familyList[i].id);
                                member.age = Number($scope.familyList[i].age);
                                member.dob = $scope.familyList[i].dob;
                                //member.gender = $scope.familyList[i].gender == "M" ? "Male" : "Female";
                                member.salutation = $scope.familyList[i].gender == "M" ? "Mr" : "Ms";
                                member.existSince = "";
                                member.existSinceError = false;
                                member.status = false;
                                member.relationship = $scope.familyList[i].relationship;
                                if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && $scope.familyList[i].relationship == "S") {
                                    member.gender = "Female";
                                } else if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && $scope.familyList[i].relationship == "SP") {
                                    member.gender = "Male";
                                } else {
                                    member.gender = $scope.familyList[i].gender == "M" ? "Male" : "Female";
                                }
                                /*if($scope.familyList[i].member == "Spouse"){
                            if(member.gender == "Male")
                                member.relation = "Husband";
                            else
                                member.relation = "Spouse";
                        }else{
                            member.relation = $scope.familyList[i].member;
                        }*/
                                member.relation = $scope.familyList[i].member;
                                if (member.relation == "Son" || member.relation == "Daughter") {
                                    member.display = member.relation + " aged " + member.age;
                                } else {
                                    member.display = member.relation;
                                }

                                $scope.personalInfo.selectedFamilyMembers.push(member);

                                //code added for professional journey
                                // $scope.healthInfo.selectedFamilyMembers.push(member);
                                // if (localStorageService.get("professionalQuoteParams")) {
                                // 	$scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                                // 	//$scope.healthInfo = $scope.quoteRequest.healthInfo;
                                // 	if ($scope.quoteRequest.commonInfo) {
                                // 		$scope.commonInfo = $scope.quoteRequest.commonInfo;
                                // 	} else {
                                // 		$scope.commonInfo = {};
                                // 	}
                                // } else {
                                // 	$scope.quoteRequest = {};
                                // 	$scope.commonInfo = {};
                                // }
                                // $scope.commonInfo.familyComp = [];
                                // $scope.healthInfo.selectedFamilyMembers.forEach(function (element) {
                                // 	$scope.commonInfo.familyComp.push(element);
                                // });
                                // if ($scope.quoteParam.selfGender == 'M' || $scope.quoteParam.selfGender == 'male') {
                                // 	$scope.commonInfo.gender = 'Male';
                                // } else {
                                // 	$scope.commonInfo.gender = 'Female';
                                // }
                                //$scope.quoteRequest.healthInfo = $scope.healthInfo;
                                //$scope.quoteRequest.commonInfo = $scope.commonInfo;
                                //end 	
                            }
                        }

                        for (i = 0; i < $scope.personalInfo.selectedFamilyMembers.length; i++) {
                            $scope.personalInfo.selectedFamilyMembers[i].dieaseDetails = [];

                            $scope.dieaseDetails = [];
                            for (var j = 0; j < $scope.diseaseList.length; j++) {

                                //if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[j].diseaseId)== true){
                                if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[j].diseaseId) == true) {
                                    for (var k = 0; k < $scope.diseaseList[j].familyList.length; k++) {
                                        if ($scope.personalInfo.selectedFamilyMembers[i].id == $scope.diseaseList[j].familyList[k].id) {
                                            $scope.diseaseList[j].familyList[k].status = true;
                                            var dieaseDetails = {};
                                            dieaseDetails.dieaseCode = $scope.diseaseList[j].diseaseId;
                                            dieaseDetails.dieaseName = $scope.diseaseList[j].disease;
                                            dieaseDetails.masterDieaseCode = $scope.diseaseList[j].diseaseCode;
                                            dieaseDetails.applicable = true;
                                            $scope.dieaseDetails.push(dieaseDetails);
                                        }
                                    }


                                }
                            }

                            $scope.personalInfo.selectedFamilyMembers[i].dieaseDetails = $scope.dieaseDetails;
                        }
                        $scope.ratingParam.maxAllowedChildAge = $scope.quote.ratingParam.maxAllowedChildAge;
                        for (var i = 0; i < $scope.quoteParam.dependent.length; i++) {
                            if ($scope.quoteParam.dependent[i].relationShip == "CH" && $scope.quoteParam.dependent[i].age <= $scope.ratingParam.maxAllowedChildAge)
                                $scope.quoteParam.childCount++;
                            else
                                $scope.quoteParam.adultCount++;
                        }

                        //this logic will not require here once code deployed to production,just change 
                        //"$scope.quoteParam.planType" to Individaul in defaultHealthParam document
                        //logic starts
                        var familyCounter = 0;
                        var familyMemberExistStatus = false;
                        for (var i = 0; i < $scope.familyList.length; i++) {
                            if ($scope.familyList[i].val == true) {
                                familyCounter += 1;
                            }
                        }
                        if (familyCounter > 1) {
                            $scope.quoteParam.planType = "F";
                        } else {
                            $scope.quoteParam.planType = "I";
                        }
                        //logic ends

                        for (var i = 0; i < $rootScope.selectedFeatures.length; i++) {
                            if ($rootScope.selectedFeatures[i].featureId != 60) {
                                $scope.quoteParam.riders.push($rootScope.selectedFeatures[i].riders);
                            }
                        }
                        $scope.quoteParam.totalCount = $scope.quoteParam.adultCount + $scope.quoteParam.childCount;
                        $scope.quoteParam.documentType = $scope.p365Labels.documentType.quoteRequest;
                        $scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
                        $scope.quote.quoteParam = $scope.quoteParam;
                        $scope.quote.ratingParam = $scope.ratingParam;
                        $scope.quote.personalInfo = $scope.personalInfo;

                        $scope.quote.requestType = $scope.p365Labels.request.healthRequestType;
                        localStorageService.set("healthQuoteInputParamaters", $scope.quote);
                        localStorageService.set("selectedArea", $scope.selectedArea);
                        localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
                        localStorageService.set("selectedFamilyForHealth", $scope.familyList);
                        //console.log('2 in SH $scope.familyList'+JSON.stringify($scope.familyList));
                        localStorageService.set("selectedDisease", $scope.selectedDisease);
                        console.log('$scope.selectedDisease in single click : ' + JSON.stringify($scope.selectedDisease));
                        localStorageService.set("selectedFamilyArray", $scope.selectedFamilyArray);
                        localStorageService.set("diseaseList", $scope.diseaseList);
                        localStorageService.set("hospitalisationLimitVal", $scope.hospitalisationLimit);
                        //added for professional journey
                        //localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                        localStorageService.set("selectedFeatures", $rootScope.selectedFeatures);
                        if (localStorageService.get("PROF_QUOTE_ID")) {
                            $scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                        }
                        //for wordPress Reset
                        if ($rootScope.wordPressEnabled) {
                            $scope.resetHealthInputDetails();
                        }

                        if (campaignSource.utm_source) {
                            $scope.quote.utm_source = campaignSource.utm_source;
                        }
                        if (campaignSource.utm_medium) {
                            $scope.quote.utm_medium = campaignSource.utm_medium;
                        }
                        
                        $scope.quoteHealthInputForm.$setPristine();
                        $scope.quoteHealthInputForm.$setUntouched();
                        $rootScope.consolidatedHospitalizationRelatedList = [];
                        $rootScope.consolidatedPreventiveOutPatientRelatedList = [];
                        $rootScope.consolidatedEnhancedCoverageList = [];
                        $rootScope.consolidatedPreExistingDiseasesList = [];
                        $rootScope.healthQuoteResult = [];
                        RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.quote).then(function (healthQuoteResult) {
                            $scope.quotesToShow = [];
                            $rootScope.healthQuoteRequest = [];

                            if (healthQuoteResult.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.responseCodeList = [];
                                $scope.dataLoaded = true;
                                //$scope.slickLoaded=false;
                                $scope.requestId = healthQuoteResult.QUOTE_ID;
                                localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.requestId);

                                $scope.UNIQUE_QUOTE_ID_ENCRYPTED = healthQuoteResult.encryptedQuoteId;
                                localStorageService.set("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
                                console.log("$scope.UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED)

                                $rootScope.healthQuoteRequest = healthQuoteResult.data;


                                if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0) {
                                    $rootScope.healthQuoteResult.length = 0;
                                }

                                //added by gauri for mautic application
                                $scope.quoteUserInfo = localStorageService.get('quoteUserInfo');
                                if (localStorageService.get("professionalQuoteParams")) {
                                    $scope.professionalParam = localStorageService.get("professionalQuoteParams");
                                }

                                if (imauticAutomation == true) {
                                    imatHealthLeadQuoteInfo(localStorageService, $scope, 'ViewQuote');
                                }
                                //added to display error message if no quote response came
                                var quoteResultCount = 0;

                                angular.forEach($rootScope.healthQuoteRequest, function (obj, i) {
                                    var request = {};
                                    var header = {};

                                    header.messageId = messageIDVar;
                                    header.campaignID = campaignIDVar;
                                    header.source = sourceOrigin;
                                    header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                                    header.deviceId = deviceIdOrigin;
                                    request.header = header;

                                    if (campaignSource.utm_source) {
                                        obj.utm_campaign = campaignSource.utm_source;
                                    }
                                    if (campaignSource.utm_medium) {
                                        obj.utm_medium = campaignSource.utm_medium;
                                    }
                                    request.body = obj;

                                    $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                        success(function (callback, status) {
                                            var healthQuoteResponse = JSON.parse(callback);
                                            quoteResultCount += 1;
                                            if (healthQuoteResponse.QUOTE_ID == $scope.requestId) {
                                                $scope.responseCodeList.push(healthQuoteResponse.responseCode);
                                                if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                    for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                                                        if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
                                                            if (Number(healthQuoteResponse.data.quotes[0].annualPremium > 0)) {
                                                                console.log('inside health premium step 1');
                                                                $rootScope.loading = false;
                                                                $rootScope.healthQuoteResult.push(healthQuoteResponse.data.quotes[0]);
                                                            }
                                                            getAllProductFeatures(healthQuoteResponse.data.quotes[0], true);
                                                            $rootScope.healthQuoteRequest[i].status = 1;
                                                        }
                                                    }
                                                    $scope.processResult();
                                                } else {
                                                    if ($rootScope.healthQuoteRequest.length == quoteResultCount) {
                                                        $scope.loading = false;
                                                        if ($rootScope.healthQuoteResult.length == 0) {
                                                            $scope.noQuoteResultFound = true;
                                                            console.log('noQuoteResultFound flag is::', $scope.noQuoteResultFound);
                                                        }
                                                    }
                                                    for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                                                        if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
                                                            $rootScope.healthQuoteRequest[i].status = 2;
                                                            //$rootScope.healthQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                            $rootScope.healthQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                                        }
                                                    }
                                                }
                                            }
                                        }).
                                        error(function (data, status) {
                                            $scope.responseCodeList.push($scope.p365Labels.responseCode.systemError);
                                        });
                                });

                                $scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
                                    //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
                                    //$rootScope.loading = false;
                                    if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
                                        /*$rootScope.loading = false;*/

                                        if ($scope.responseCodeList.length == $rootScope.healthQuoteRequest.length) {
                                            /*$rootScope.loading = false;*/

                                            for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                                                if ($rootScope.healthQuoteRequest[i].status == 0) {
                                                    $rootScope.healthQuoteRequest[i].status = 2;
                                                    //$rootScope.healthQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                    $rootScope.healthQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                                }
                                            }

                                            //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
                                            if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success)) {
                                                // This condition will satisfy only when at least one product is found in the quoteResponse array.
                                                //}else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
                                            } else if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                                                $scope.errorMessage($scope.p365Labels.validationMessages.productNotFoundMsg);
                                            } else {
                                                $scope.errorMessage($scope.p365Labels.validationMessages.generalisedErrMsg);
                                            }
                                        }
                                }, true);
                            } else {
                                // localStorageService.remove("healthQuoteInputParamaters");
                                // localStorageService.remove("selectedFamilyForHealth");
                                // localStorageService.remove("isDiseasedForHealth");
                                // localStorageService.remove("diseaseForHealth");
                                // localStorageService.remove("selectedArea");
                                // localStorageService.remove("addOnCoverForHealth");
                                // localStorageService.remove("selectedFamilyArray");
                                // localStorageService.remove("diseaseList");
                                // localStorageService.set("ridersHealthStatus", false);
                                $rootScope.loading = false;
                                $scope.responseCodeList = [];

                                $rootScope.healthQuoteRequest.push({
                                    status: 2,
                                    message: $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedErrMsg)
                                });
                                $scope.noQuoteResultFound = true;
                                console.log('noQuoteResultFound flag  in step 2 is::', $scope.noQuoteResultFound);
                                //         $rootScope.healthQuoteRequest[0].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedErrMsg);

                                if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0)
                                    $rootScope.healthQuoteResult.length = 0;

                                $rootScope.healthQuoteResult = [];
                                $scope.errorMessage(healthQuoteResult.message);
                            }
                        });
                        // $scope.displayRibbon();
                    }, 100);
                } else {
                    $scope.filterBenefitModal = false;
                }
                //},100);
            };
            //added for wordpress
            $scope.calculateQuoteOnSubmit = function () {
                $scope.quoteHealthInputForm.$dirty = true;
                $scope.quoteHealthInputForm.$setDirty();
                // if (!$rootScope.wordPressEnabled) {
                // 	$scope.singleClickHealthQuote();
                // }
            }

            $scope.changeHospitalLimit = function (hospitalisationLimit) {
                setTimeout(function () {
                    $scope.hospitalisationLimit = hospitalisationLimit;
                    // if (!$rootScope.wordPressEnabled) {
                    // 	$scope.singleClickHealthQuote();
                    // }
                }, 100);

            }

            var windowWidth = window.screen.width;
            if (windowWidth < 768) {
                $scope.mobileFit = true;
                $scope.webFit = false;
            } else {
                $scope.mobileFit = false;
                $scope.webFit = true;
            }



            $scope.state = false;

            $scope.toggleState = function () {
                $scope.state = !$scope.state;
            };

            $scope.toggleBasicExpanded = function () {
                $scope.basicExpanded = !$scope.basicExpanded;
            };

            $scope.applyPreExistingCoverageFilter = function (data) {
                // 	$scope.quotesToShow = [];
                // 	$rootScope.healthQuoteResult = [];
                // 	console.log('$scope.parent.coverageAfter in apply preExisting filter is: ',$scope.parent.coverageAfter);
                // 	for(var i=0;i < $scope.quotesToShowCopy.length ; i++){
                // 		if($scope.quotesToShowCopy[i].featuresList){
                // 			console.log('$scope.quotesToShowCopy[i].featuresList is: ',$scope.quotesToShowCopy[i].featuresList);
                // 			for(var j= 0; j < $scope.quotesToShowCopy[i].featuresList.length ; j++ ){
                // 		if($scope.quotesToShowCopy[i].featuresList[j].PreExistingDiseases){
                // 			for(var k=0; k < $scope.quotesToShowCopy[i].featuresList[j].PreExistingDiseases.length; k++){
                // 				if($scope.quotesToShowCopy[i].featuresList[j].PreExistingDiseases[k].featureId == 60){
                // 					if($scope.quotesToShowCopy[i].featuresList[j].PreExistingDiseases[k].valueLimit <= $scope.parent.coverageAfter.value && $scope.quotesToShowCopy[i].featuresList[j].PreExistingDiseases[k].valueLimit > 0){
                // 						$rootScope.healthQuoteResult.push($scope.quotesToShowCopy[i]);
                // 					}
                // 				}	
                // 			}
                // 		}
                // 	}
                // }
                // 	}

                // 	$scope.quotesToShow=$rootScope.healthQuoteResult;
                // 	console.log('$scope.quotesToShow after preExisting filter:: ',$scope.quotesToShow);	
                if ($scope.parent.coverageAfter.length > 0) {
                    console.log('$scope.parent.coverageAfter is present ..falatupana');
                    //$scope.selectedCarrierName.CompanyName = [];
                    if (data.featuresList) {
                        var preExistingCoverageApplicable = false;
                        //console.log('data in apply preexisting filter is: ', data);
                        for (var j = 0; j < data.featuresList.length; j++) {
                            if (data.featuresList[j].PreExistingDiseases) {
                                for (var k = 0; k < data.featuresList[j].PreExistingDiseases.length; k++) {
                                    if (data.featuresList[j].PreExistingDiseases[k].featureId == 60) {
                                        if (data.featuresList[j].PreExistingDiseases[k].valueLimit <= $scope.parent.coverageAfter.value && data.featuresList[j].PreExistingDiseases[k].valueLimit > 0) {
                                            preExistingCoverageApplicable = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (preExistingCoverageApplicable) {
                            //$scope.selectedCarrierName.CompanyName.push(data.insuranceCompany);
                            return data;
                        } else {
                            return '';
                        }
                    }
                } else {
                    return data;
                }
            }

            $scope.applyFilter = function () {
                // $scope.quoteHealthInputForm.$dirty = true;
                // $scope.quoteHealthInputForm.$setDirty();

                setTimeout(function () {
                    $scope.singleClickHealthQuote();
                }, 100);
            }

            //setting flag for showing quote user info popup in share email
            if ($rootScope.flag || $rootScope.isOlarked) {
                if ($rootScope.selectedFeatures != undefined) {
                    $rootScope.selectedFeatures = $rootScope.selectedFeatures;
                    if ($rootScope.roomRentFeature) {
                        $scope.parent.roomRentFeature = $rootScope.roomRentFeature;
                    }
                }
                $scope.customFilterHealth();
                if ($rootScope.flag) {
                    //$scope.redirectToResult();
                    $rootScope.flag = false;
                    $rootScope.isOlarked = false;
                }
                console.log("$scope.EmailChoices", $scope.EmailChoices);
                if (localStorageService.get("quoteUserInfo")) {
                    console.log(localStorageService.get("quoteUserInfo"))
                    $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
                }
                $rootScope.loading = false;

            }
        };

        //$scope.init();
        $scope.declaration();
        $scope.$watch(function () {
            return $rootScope.healthQuoteResult;
        }, function () {
            $rootScope.healthQuoteResult = $rootScope.healthQuoteResult;
            //console.log('step000')
            if ($rootScope.healthQuoteResult) {
                // console.log('step1')
                if ($rootScope.healthQuoteResult.length > 0) {
                    // console.log('step2')
                    $scope.init();
                    //$scope.callForInit = true;
                }
            }
        }, true);

        $scope.hideResultCnfrmBuyModal = function () {
            $scope.familyList = $scope.oldFamilyList;
            $scope.modalResultCnfrmBuy = false;
            $rootScope.loading = false;
        };


        $scope.submitResultCnfrmBuy = function () {
            if ($scope.resultCnfrmBuy.$dirty) {
                var i;
                var submitFamilyForm = true;
                submitFamilyForm = $scope.validateFamilyForm();

                var familyCounter = 0;
                var familyMemberExistStatus = false;
                for (i = 0; i < $scope.familyList.length; i++) {
                    if ($scope.familyList[i].val == true) {
                        familyMemberExistStatus = true;
                        familyCounter += 1;
                    }
                }

                if (familyCounter > 1) {
                    $scope.quoteParam.planType = "F";
                } else {
                    $scope.quoteParam.planType = "I";
                }

                if (familyMemberExistStatus) {
                    if (submitFamilyForm == true) {
                        $scope.modalResultCnfrmBuy = false;
                        $scope.resultCnfrmBuy.$setPristine();
                        $scope.resultCnfrmBuyFlag = true;
                        $scope.buyConfrmFlag = true;
                        $scope.quoteHealthInputForm.$setDirty();
                        $scope.singleClickHealthQuote();
                    }
                } else {
                    $scope.familyErrors.push("Please select atleast one member.");
                }
            } else {
                $rootScope.loading = true;
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    // if (String($location.search().leaddetails) != "undefined") {
                    //     var leaddetails = JSON.parse($location.search().leaddetails);
                    //     localStorageService.set("quoteUserInfo", leaddetails);
                    // }
                    /*comment because it is causing to reload localStorage old value are getting flush out.
                     * $location.path('/ipos').search({quoteId:localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"),carrierId:selectedProduct.carrierId,productId:selectedProduct.planId,lob:localStorageService.get("selectedBusinessLineId")});*/
                    $location.path('/buyHealth').search({ quoteId: localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"), carrierId: localStorageService.get("healthSelectedProduct").carrierId, productId: localStorageService.get("healthSelectedProduct").planId, lob: localStorageService.get("selectedBusinessLineId") });
                } else {
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                    //wigzo tracking code added as per mail confirmation - srikanth
                    /*if(idepProdEnv && $rootScope.wordPressEnabled){
                    		wigzo('track', 'healthbuy');
                    		wigzo('identify',{email:$scope.quoteUserInfo.emailId,phone:$scope.quoteUserInfo.mobileNumber,userId:$scope.quoteUserInfo.messageId,custom1:new Date(),custom2:'healthBuy'});	
                    }*/
                    console.log('redirecting to health buy product::');
                    $location.path('/buyHealth');
                }
            }
        };

        $scope.buyProduct = function (selectedProduct) {

            // if user comes form Dashboard  to renew policy   
            if (localStorageService.get("renewPolicyDetails")) {
                var renewPolicyDetails = localStorageService.get("renewPolicyDetails");
                console.log("HEALTH_UNIQUE_QUOTE_ID", localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"))
                console.log("renewPolicyDetails", renewPolicyDetails);
                if (localStorageService.get("HEALTH_UNIQUE_QUOTE_ID") == renewPolicyDetails.QUOTE_ID) {
                    $location.path("/proposalresdata").search({ proposalId: renewPolicyDetails.encryptedQuoteId, LOB: 1 });
                }
            }
            //added for mautic
            $scope.selectedProduct = selectedProduct;
            $rootScope.title = $scope.p365Labels.policies365Title.confirmPopup;
            localStorageService.set("healthSelectedProduct", selectedProduct);
            //added by gauri for mautic application
            if (imauticAutomation == true) {
                imatBuyClicked(localStorageService, $scope, 'BuyClicked');
            }


            //code to update riderlist to quote param if implicit riders available with plan
            if ($scope.quote.quoteParam.riders) {
                for (var i = 0; i < $scope.quote.quoteParam.riders.length; i++) {
                    if ($scope.quote.quoteParam.riders[i].riderFlag == true) {
                        $scope.quote.quoteParam.riders.splice(i, 1);
                        i = i - 1;
                    }
                }
                $scope.quoteParam.riders = $scope.quote.quoteParam.riders;
            }

            if (selectedProduct.riderList) {
                if (selectedProduct.riderList.length > 0) {
                    var riderFromSel;
                    for (var i = 0; i < selectedProduct.riderList.length; i++) {
                        riderFromSel = {};
                        riderFromSel.riderId = selectedProduct.riderList[i].riderId;
                        riderFromSel.riderName = selectedProduct.riderList[i].riderName;
                        riderFromSel.riderFlag = true;
                        //added as discussed by sanket for hdfc plan
                        if (selectedProduct.riderList[i].riderPremiumAmount) {
                            riderFromSel.riderPremiumAmount = selectedProduct.riderList[i].riderPremiumAmount;
                        }
                        $scope.quoteParam.riders.push(riderFromSel);

                    }
                }
            }
            $scope.quote.quoteParam.riders = $scope.quoteParam.riders;
            localStorageService.set("healthQuoteInputParamaters", $scope.quote);
            //end

            var buyScreenParam = {};
            buyScreenParam.documentType = "proposalScreenConfig";
            buyScreenParam.businessLineId = localStorageService.get("selectedBusinessLineId");
            buyScreenParam.carrierId = selectedProduct.carrierId;
            buyScreenParam.productId = selectedProduct.planId;
            buyScreenParam.QUOTE_ID = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.productDataReader, buyScreenParam, function (buyScreen) {
                if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {
                    localStorageService.set("buyScreen", buyScreen.data);
                    // buyScreenParam.documentType = "HealthPlan";
                    if (!$scope.resultCnfrmBuyFlag) {
                        $scope.oldFamilyList = angular.copy($scope.familyList);
                        $scope.modalResultCnfrmBuy = true;
                    }
                    // getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.getPlanRiders, buyScreenParam, function(buyScreenRiders) {
                    //     if (buyScreenRiders.responseCode == $scope.p365Labels.responseCode.success) {
                    //         localStorageService.set("buyScreenRiders", buyScreenRiders.data);
                    //     } else {
                    //         localStorageService.set("buyScreenRiders", undefined);
                    //     }
                    var occupationDocId = $scope.p365Labels.documentType.healthOccupation + "-" + selectedProduct.carrierId + "-" + selectedProduct.planId;
                    getDocUsingId(RestAPI, occupationDocId, function (occupationList) {
                        localStorageService.set("healthBuyOccupationList", occupationList.Occupation);

                        getListFromDB(RestAPI, "", $scope.p365Labels.documentType.healthCarrier, $scope.p365Labels.request.findAppConfig, function (carrierList) {
                            if (carrierList.responseCode == $scope.p365Labels.responseCode.success) {
                                localStorageService.set("carrierList", carrierList.data);
                                var docId = $scope.p365Labels.documentType.buyScreen + "-" + localStorageService.get("selectedBusinessLineId");
                                getDocUsingId(RestAPI, docId, function (buyScreenTooltip) {
                                    localStorageService.set("buyScreenTooltip", buyScreenTooltip.toolTips);
                                    if ($scope.resultCnfrmBuyFlag) {
                                        $rootScope.loading = true;
                                        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                                            // if (String($location.search().leaddetails) != "undefined") {
                                            //     var leaddetails = JSON.parse($location.search().leaddetails);
                                            //     localStorageService.set("quoteUserInfo", leaddetails);
                                            // }
                                            /*comment because it is causing to reload localStorage old value are getting flush out.
                                             * $location.path('/ipos').search({quoteId:localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"),carrierId:selectedProduct.carrierId,productId:selectedProduct.planId,lob:localStorageService.get("selectedBusinessLineId")});*/
                                            $location.path('/buyHealth').search({ quoteId: localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"), carrierId: selectedProduct.carrierId, productId: selectedProduct.planId, lob: localStorageService.get("selectedBusinessLineId") });
                                        } else {
                                            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                                            //wigzo tracking code added as per mail confirmation - srikanth
                                            /*if(idepProdEnv && $rootScope.wordPressEnabled){
                                            		wigzo('track', 'healthbuy');
                                            		wigzo('identify',{email:$scope.quoteUserInfo.emailId,phone:$scope.quoteUserInfo.mobileNumber,userId:$scope.quoteUserInfo.messageId,custom1:new Date(),custom2:'healthBuy'});	
                                            }*/
                                            console.log('redirecting to health buy product::');
                                            $location.path('/buyHealth');
                                        }
                                    }
                                });
                            } else {
                                $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                            }
                        });
                    });
                    // });
                } else {
                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                }
            });
        };

        $scope.selectProduct = function (selectedProduct, _redirectTOResult) {
            _redirectTOResult = (_redirectTOResult == false) ? _redirectTOResult : true;
            if (_redirectTOResult) {
                $rootScope.loading = true;
                var QUOTE_ID = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
                console.log('selectedProduct in medical result is', selectedProduct);
                updateHealthSelectedProduct(RestAPI, QUOTE_ID, selectedProduct, function (updatedProductCallback) {
                    console.log("_updatedProduct : ", updatedProductCallback);
                    if (updatedProductCallback.data) {
                        var updatedProduct = updatedProductCallback.data;
                        if (updatedProduct.selectedCarrier && updatedProduct.selectedProduct) {
                            $rootScope.selectedCarrierIdForHealth = updatedProduct.selectedCarrier;
                            $rootScope.selectedProductIdForHealth = updatedProduct.selectedProduct;
                            if (updatedProduct.childPlanId) {
                                $rootScope.selectedChildPlanIdForHealth = updatedProduct.selectedChildPlanId;
                            }
                        }
                        $location.path('/professionalJourneyResult');
                    }

                });
            }
        }

        // $scope.selectProduct = function (_selectedProduct, _redirectTOResult) {
        // 	_redirectTOResult = (_redirectTOResult == false) ? _redirectTOResult : true;
        // 	localStorageService.set("updateProdcutInCartFlag", false);
        // 	localStorageService.set("healthProductToBeAddedInCart", _selectedProduct);
        // 	//var carDetailsInCart = localStorageService.get("selectedCarDetails");
        // 	//localStorageService.set("carDetailsToBeAddedInCart", carDetailsInCart);
        // 	if (_redirectTOResult) {
        // 		$location.path('/professionalJourneyResult');
        // 	}
        // }

        $rootScope.signout = function () {
            $rootScope.userLoginStatus = false;
            var userLoginInfo = {};
            userLoginInfo.username = "";
            userLoginInfo.status = $rootScope.userLoginStatus;
            localStorageService.set("userLoginInfo", userLoginInfo);
            $location.path("/quote");
        };

        $scope.missionCompled = function () {
            $rootScope.loading = false;
        };

        //code for share email

        var flag = false;
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
                var encodeQuote = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED");
                var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
                var encodeEmailId = $scope.EmailChoices[i].username;
                var encodeCarrierList = [];
                if ($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0) {
                    encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
                    var jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
                } else {
                    encodeCarrierList.push("ALL");
                }

                $rootScope.encryptedQuote_Id = encodeQuote;
                $rootScope.encryptedLOB = encodeLOB
                $rootScope.encryptedEmail = encodeEmailId;
                $rootScope.encryptedCarriers = jsonEncodeCarrierList

                $scope.EmailChoices[i].funcType = "SHAREHEALTHQUOTE";
                $scope.EmailChoices[i].isBCCRequired = 'Y';
                $scope.EmailChoices[i].paramMap = {};
                /*$scope.EmailChoices[i].paramMap.docId=String(localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"));*/
                $scope.EmailChoices[i].paramMap.docId = String($rootScope.encryptedQuote_Id);
                $scope.EmailChoices[i].paramMap.LOB = String($rootScope.encryptedLOB);
                $scope.EmailChoices[i].paramMap.userId = String($rootScope.encryptedEmail);
                $scope.EmailChoices[i].paramMap.carriers = String($rootScope.encryptedCarriers);
                $scope.EmailChoices[i].paramMap.selectedPolicyType = "HEALTH";
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


                if ($scope.crmEmailSend || $rootScope.wordPressEnabled) {
                    //Added by gauri for mautic application				
                    if (imauticAutomation == true) {
                        imatShareQuote(localStorageService, $scope, 'ShareQuote');
                        $scope.shareEmailModal = false;
                        $scope.modalEmailView = true;
                        $scope.crmEmailSend = false;

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
                    if (quoteUserInfo) {
                        quoteUserInfo.emailId = $scope.EmailChoices[0].username;
                        localStorageService.set("quoteUserInfo", quoteUserInfo);
                        $scope.crmEmailSend = true;
                        $scope.showShareEmailModal();
                    }
                } else {
                    var quoteUserInfo = {};
                    localStorageService.set("quoteUserInfo", quoteUserInfo);
                    $scope.sendQuotesByEmail();
                }
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
            $scope.shareEmailModal = false;
            $scope.modalEmailView = false;
        }

        // Create lead with available user information by calling webservice for share email.
        $scope.leadCreationUserInfo = function () {
            var userInfoWithQuoteParam = {};
            $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
            localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
            userInfoWithQuoteParam.quoteParam = localStorageService.get("healthQuoteInputParamaters").quoteParam;
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
        //code added for displaying rider menu as pop-up 
        $scope.showFilterBenefitModal = function () {
            $scope.filterBenefitModal = !$scope.filterBenefitModal;
        }

        $scope.hideFilterBenefitModal = function () {
            $scope.filterBenefitModal = false;
        }


        $scope.redirectToResult = function () {
            $scope.leadCreationUserInfo();
        };

        $scope.redirectToAPResult = function () {
            $scope.leadCreationUserInfo();
        };
        //function created to display carrier if premium > 0.
        $scope.validatePremium = function (data) {
            if (data) {
                if (Number(data.basicPremium) > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        $scope.openHealthPopup = function (selectedTab, _data) {
            $scope.filterPincode = $scope.personalInfo.pincode;
            $scope.filterCity = $scope.personalInfo.city;
            $scope.healthProductToBeAddedInCart = _data;
            $rootScope.selectedTabHealth = selectedTab;
            $scope.premiumModalHealth = !$scope.premiumModalHealth;
        }
        $scope.hidePremiumModalHealth = function () {
            $scope.premiumModalHealth = false;
        }

        $scope.openMapHospital = function (hos) {
            $scope.searchKeyHospital = googleMapURL + '' + hos.hospitalName + ',' + hos.pincode;
            window.open($scope.searchKeyHospital, '_blank');
        }
        $scope.selectAllInsurer = function () {
            //$scope.selectedCarrierName.CompanyName = $scope.quotesToShowCopy;
            $scope.selectedCarrierName.CompanyName = [];
            $scope.quotesToShow = [];
            angular.forEach($scope.quotesToShowCopy, function (obj, i) {
                $scope.selectedCarrierName.CompanyName.push(obj.insuranceCompany);
            });
            $scope.quotesToShow = $scope.quotesToShowCopy;
            console.log('$scope.selectedCarrierName.CompanyName on all select::', $scope.selectedCarrierName.CompanyName);
            console.log('$scope.quotesToShowCopy length is::', $scope.quotesToShowCopy);
        }
        $scope.DeselectAllInsurer = function () {
            $scope.selectedCarrierName.CompanyName = [];
            $scope.quotesToShow = [];
            console.log('$scope.selectedCarrierName.CompanyName on all select::', $scope.selectedCarrierName.CompanyName);
            console.log('$scope.quotesToShow length is::', $scope.quotesToShow);
        }
        //function created to filter result based on selection criteria(e.g.carrier name)
        $scope.filterResult = function () {
            $scope.quotesForBrand = [];
            $scope.quotesToShow = [];
            console.log('$scope.selectedCarrierName in fiter result::', $scope.selectedCarrierName);
            if ($scope.selectedCarrierName.CompanyName.length > 0) {
                for (var i = 0; i < $scope.quotesToShowCopy.length; i++) {
                    for (var j = 0; j < $scope.selectedCarrierName.CompanyName.length; j++) {
                        if ($scope.quotesToShowCopy[i].insuranceCompany == $scope.selectedCarrierName.CompanyName[j]) {
                            $scope.quotesForBrand.push($scope.quotesToShowCopy[i]);
                        }
                    }
                }
                $scope.quotesToShow = $scope.quotesForBrand;
            }
            //  else {
            // 	$scope.quotesToShow = $scope.quotesToShowCopy;
            // }
            console.log('$scope.selectedCarrierName.CompanyName on all select::', $scope.selectedCarrierName.CompanyName);
            console.log('$scope.quotesToShow length is::', $scope.quotesToShow);
        }

        $(".activateFooter").hide();
        $(".activateHeader").hide();
        // Function created to get Product Features and update Quote Result Object on Quote Calculation - modification-0008
        function getAllProductFeatures(selectedProduct, productFetchStatus) {
            if (selectedProduct.featuresList[0].HospitalizationRelated) {
                for (var i = 0; i < selectedProduct.featuresList[0].HospitalizationRelated.length; i++) {
                    if (selectedProduct.featuresList[0].HospitalizationRelated[i].compareView == 'Y') {
                        if ($rootScope.consolidatedHospitalizationRelatedList.indexOf(selectedProduct.featuresList[0].HospitalizationRelated[i].CompareName) === -1) {
                            $rootScope.consolidatedHospitalizationRelatedList.push(selectedProduct.featuresList[0].HospitalizationRelated[i].CompareName);
                        }
                    }
                }
            }
            if (selectedProduct.featuresList[1].PreventiveOutPatientRelated) {
                for (var i = 0; i < selectedProduct.featuresList[1].PreventiveOutPatientRelated.length; i++) {
                    if (selectedProduct.featuresList[1].PreventiveOutPatientRelated[i].compareView == 'Y') {
                        if ($rootScope.consolidatedPreventiveOutPatientRelatedList.indexOf(selectedProduct.featuresList[1].PreventiveOutPatientRelated[i].CompareName) === -1) {
                            $rootScope.consolidatedPreventiveOutPatientRelatedList.push(selectedProduct.featuresList[1].PreventiveOutPatientRelated[i].CompareName);
                        }
                    }
                }
            }
            if (selectedProduct.featuresList[2].EnhancedCoverage) {
                for (var i = 0; i < selectedProduct.featuresList[2].EnhancedCoverage.length; i++) {
                    if (selectedProduct.featuresList[2].EnhancedCoverage[i].compareView == 'Y') {
                        if ($rootScope.consolidatedEnhancedCoverageList.indexOf(selectedProduct.featuresList[2].EnhancedCoverage[i].CompareName) === -1) {
                            $rootScope.consolidatedEnhancedCoverageList.push(selectedProduct.featuresList[2].EnhancedCoverage[i].CompareName);
                        }
                    }
                }
            }
            if (selectedProduct.featuresList[3].PreExistingDiseases) {
                for (var i = 0; i < selectedProduct.featuresList[3].PreExistingDiseases.length; i++) {
                    if (selectedProduct.featuresList[3].PreExistingDiseases[i].compareView == 'Y') {
                        if ($rootScope.consolidatedPreExistingDiseasesList.indexOf(selectedProduct.featuresList[3].PreExistingDiseases[i].CompareName) === -1) {
                            $rootScope.consolidatedPreExistingDiseasesList.push(selectedProduct.featuresList[3].PreExistingDiseases[i].CompareName);
                        }
                    }
                }
            }
        }
    }]);