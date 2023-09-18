'use strict';

angular.module('travelResult', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages', 'a8m.unique', 'ngScrollable'])
    .controller('travelResultController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$http', '$window', '$sce', '$filter',
        function($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $http, $window, $sce, $filter) {
            // Setting application labels to avoid static assignment
            $rootScope.landingFlag = false;
            var applicationLabels = localStorageService.get("applicationLabels");
            $scope.globalLabel = applicationLabels.globalLabels;

            var SELF = "Self";
            var SPOUSE = "Spouse";
            var SON = "Son";
            var DAUGHTER = "Daughter";
            var DATE_FORMAT = "dd/mm/yy";
            var FATHER = "Father";
            var MOTHER = "Mother";
            var FEMALE = "Female";
            var MALE = "Male";
            var SINGLE = "SINGLE";
            var MARRIED = "MARRIED";
            var EMPTY = "";
            var SPACE = " ";

            $rootScope.loaderContent = { businessLine: '5', header: 'Travel Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.travel.proverbResult) };

            $rootScope.title = $scope.globalLabel.policies365Title.travelResultQuote;
            $rootScope.isBackButtonPressed = false;

            //for wordpress
            if ($rootScope.wordPressEnabled) {
                $scope.rippleColor = '';
            } else {
                $scope.rippleColor = '#f8a201';
            }
            //for wordpress
            $scope.travelInputSectionHTML = wp_path + 'buy/travel/html/TravelInputSection.html';
            $scope.travelShareEmailSectionHTML = wp_path + 'buy/travel/html/TravelShareEmailSection.html';
            $scope.travelPremiumDetailSectionHTML = wp_path + 'buy/travel/html/TravelPremiumDetailsSection.html';

            if (localStorageService.get("userLoginInfo")) {
                $rootScope.userLoginStatus = localStorageService.get("userLoginInfo").status;
                $rootScope.username = localStorageService.get("userLoginInfo").username;
            }

            //added for expand-collapse DOM for ipos
            $scope.travelInputSection = false;

            $rootScope.loading = true;

            $scope.quoteUserInfo = {};
            $scope.quoteUserInfo.messageId = '';
            $scope.quoteUserInfo.termsCondition = true;


            // travel encrypred quote id  
            $scope.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED");									
            console.log("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED", localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED"));
             
            
            //for agencyPortal
            $scope.modalView = false;
            if ($rootScope.agencyPortalEnabled) {
                //checking for lead
                var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
                $scope.createLeadAP = $location.search().createLead;
                if (!quoteUserInfoCookie || $scope.createLeadAP == 'true') {
                    messageIDVar = '';
                    $scope.modalView = true;
                }
            }

            $scope.currencySymbols = currencySymbolList;

            function changeCurrencySymbol(quoteResults) {
                for (var j = 0; j < quoteResults.length; j++) {
                    if (quoteResults[j].sumInsuredCurrency != undefined && quoteResults[j].sumInsuredCurrency != "") {
                        for (var k = 0; k < $scope.currencySymbols.length; k++) {
                            if ($scope.currencySymbols[k].symbol == quoteResults[j].sumInsuredCurrency) {
                                //$rootScope.travelQuoteResult[j].sumInsuredCurrency = $scope.currencySymbols[k].symbol;
                                quoteResults[j].sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[k].htmlCode);
                                // for displaying currency symbol on input section
                                $scope.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[k].htmlCode);
                            }
                        }
                    } else {
                        quoteResults[j].sumInsuredCurrency = $scope.currencySymbols[0].symbol;
                        quoteResults[j].sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[0].htmlCode);
                        // for displaying currency symbol on input section
                        $scope.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[0].htmlCode);
                    }
                }
                return quoteResults;
            }

            $scope.initPolicyDates = function() {
                //local virables
                var startDateOptions = {};
                var endDateOptions = {};
                var tripType = $scope.travelDetails.tripType;
                if (tripType == 'single') {
                    if ($rootScope.flag) {
                        startDateOptions.minimumDateStringFormat = $scope.travelDetails.startdate;
                    } else {
                        startDateOptions.minimumDayLimit = 0;
                    }
                    startDateOptions.maximumDayLimit = 60;
                    startDateOptions.changeMonth = true;
                    startDateOptions.changeYear = true;
                    startDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
                    var startDate = angular.copy($scope.travelDetails.startdate);
                    var endDay = startDate.split("/")[0];
                    var endMonth = startDate.split("/")[1];
                    var endYear = startDate.split("/")[2];
                    var travelEndDateMin = new Date(Date.parse(endMonth + '/' + endDay + '/' + endYear));
                    travelEndDateMin.setDate(travelEndDateMin.getDate() + 1);
                    var travelEndDateMax = new Date(travelEndDateMin);
                    travelEndDateMax.setDate(travelEndDateMin.getDate() + 179);
                    //trip end date

                    endDateOptions.minimumDateStringFormat = travelEndDateMin;
                    endDateOptions.maximumDateStringFormat = travelEndDateMax;
                    endDateOptions.changeMonth = true;
                    endDateOptions.changeYear = true;
                    endDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelEndDateOptions = setP365DatePickerProperties(endDateOptions)
                } else if (tripType == 'multi') {
                    startDateOptions.minimumDayLimit = 0;
                    startDateOptions.maximumDayLimit = 60;
                    startDateOptions.changeMonth = true;
                    startDateOptions.changeYear = true;
                    startDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
                    var startDate = angular.copy($scope.travelDetails.startdate);
                    var endDay = startDate.split("/")[0];
                    var endMonth = startDate.split("/")[1];
                    var endYear = startDate.split("/")[2];
                    var travelEndDateMin = new Date(Date.parse(endMonth + '/' + endDay + '/' + endYear));
                    travelEndDateMin.setDate(travelEndDateMin.getDate() + 364);
                    var d = travelEndDateMin.getDate();
                    var m = travelEndDateMin.getMonth() + 1;
                    $scope.travelDetails.enddate = String(((d <= 9) ? '0' + d : d) + '/' + ((m <= 9) ? '0' + m : m) + '/' + travelEndDateMin.getFullYear());

                    endDateOptions.minimumDateStringFormat = $scope.travelDetails.enddate;
                    endDateOptions.maximumDateStringFormat = $scope.travelDetails.enddate;
                    endDateOptions.changeMonth = true;
                    endDateOptions.changeYear = true;
                    endDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelEndDateOptions = setP365DatePickerProperties(endDateOptions)
                }
            }


            $scope.getUpdatedTravelDates = function() {
                //local virables
                var startDateOptions = {};
                var endDateOptions = {};
                var tripType = $scope.travelDetails.tripType;
                if (tripType == 'single') {
                    //trip start date
                    startDateOptions.minimumDayLimit = 0;
                    startDateOptions.maximumDayLimit = 60;
                    startDateOptions.changeMonth = true;
                    startDateOptions.changeYear = true;
                    startDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
                    var startDate = angular.copy($scope.travelDetails.startdate);
                    var endDay = startDate.split("/")[0];
                    var endMonth = startDate.split("/")[1];
                    var endYear = startDate.split("/")[2];
                    var travelEndDateMin = new Date(Date.parse(endMonth + '/' + endDay + '/' + endYear));
                    travelEndDateMin.setDate(travelEndDateMin.getDate() + 1);
                    var d = travelEndDateMin.getDate();
                    var m = travelEndDateMin.getMonth() + 1;
                    $scope.travelDetails.enddate = String(((d <= 9) ? '0' + d : d) + '/' + ((m <= 9) ? '0' + m : m) + '/' + travelEndDateMin.getFullYear());

                    var travelEndDateMax = new Date(travelEndDateMin);
                    travelEndDateMax.setDate(travelEndDateMin.getDate() + 179);
                    //trip end date

                    endDateOptions.minimumDateStringFormat = $scope.travelDetails.enddate;
                    endDateOptions.maximumDateStringFormat = travelEndDateMax;
                    endDateOptions.changeMonth = true;
                    endDateOptions.changeYear = true;
                    endDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelEndDateOptions = setP365DatePickerProperties(endDateOptions);
                } else if (tripType == 'multi') {
                    startDateOptions.minimumDayLimit = 0;
                    startDateOptions.maximumDayLimit = 60;
                    startDateOptions.changeMonth = true;
                    startDateOptions.changeYear = true;
                    startDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
                    var startDate = angular.copy($scope.travelDetails.startdate);
                    var endDay = startDate.split("/")[0];
                    var endMonth = startDate.split("/")[1];
                    var endYear = startDate.split("/")[2];
                    var travelEndDateMin = new Date(Date.parse(endMonth + '/' + endDay + '/' + endYear));
                    travelEndDateMin.setDate(travelEndDateMin.getDate() + 364);
                    var d = travelEndDateMin.getDate();
                    var m = travelEndDateMin.getMonth() + 1;
                    $scope.travelDetails.enddate = String(((d <= 9) ? '0' + d : d) + '/' + ((m <= 9) ? '0' + m : m) + '/' + travelEndDateMin.getFullYear());

                    endDateOptions.minimumDateStringFormat = $scope.travelDetails.enddate;
                    endDateOptions.maximumDateStringFormat = $scope.travelDetails.enddate;
                    endDateOptions.changeMonth = true;
                    endDateOptions.changeYear = true;
                    endDateOptions.dateFormat = DATE_FORMAT;
                    $scope.travelEndDateOptions = setP365DatePickerProperties(endDateOptions);
                }
            }

            $scope.toggleDate = function() {
                $scope.getUpdatedTravelDates();
                //$scope.callSingleClickQuote();
            };

            $scope.toggleTripType = function() {
                $scope.travelDetails.tripDuration = $scope.tripDurationList[0].duration;
                $scope.getUpdatedTravelDates();
            }
            $scope.showTripDetails = function() {
                $scope.travelInputSection = !$scope.travelInputSection;
            }

            // Fetch lead id from url for iQuote+.
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                /*if($location.search().docId){
                	localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID", $location.search().docId);
                }*/
                if ($location.search().messageId) {
                    messageIDVar = $location.search().messageId;
                    $scope.quoteUserInfo.messageId = $location.search().messageId;
                }

                //added to collapse & expand inputSection for ipos
                $scope.travelInputSection = true;

            }
            
            /*beolw functions created to collapse & expand DOM for ipos*/
            $scope.showPolicyDetails = function() {
                    $scope.travelInputSection = !$scope.travelInputSection;
                }
                /* end ipos functions to expand-collapse DOM for ipos*/

            $scope.backToQuoteScreen = function() {
                if ($rootScope.wordPressEnabled) {
                    $rootScope.isBackButtonPressed = true;
                }
                if ($rootScope.isProfessionalJourneySelected) {
                    $location.path("/professionalJourneyResult");
                } else {
                    $location.path("/PBQuote");
                }
            };

            $scope.groupPlans = function(data) {
                var morePlans = [];
                $rootScope.travelQuoteResult = changeCurrencySymbol($rootScope.travelQuoteResult);
                for (var i = 0; i < $rootScope.travelQuoteResult.length; i++) {
                    if (data.carrierId == $rootScope.travelQuoteResult[i].carrierId && data.productId != $rootScope.travelQuoteResult[i].productId) {
                        morePlans.push($rootScope.travelQuoteResult[i]);
                    }
                }
                return morePlans;
            }

            $scope.isMoreQuoteToShow = function(morePlans, carrierId) {
                for (var i = 0; i < morePlans.length; i++) {
                    if (morePlans[i].carrierId == carrierId) {
                        return (morePlans.length > 0) ? true : false;
                    }
                }

            }

            //move to common file
            $scope.checkQuestionStatus = function(quoteParam) {
                    if (quoteParam.travellingFromIndia == 'Y') {
                        $scope.show_error_msg_1 = false;
                    } else {
                        $scope.show_error_msg_1 = true;
                    }
                    if (quoteParam.isIndian == 'Y') {
                        $scope.show_error_msg_2 = false;
                    } else {
                        $scope.show_error_msg_2 = true;
                        if (quoteParam.isOciPioStatus == 'Y') {
                            $scope.show_error_msg_1 = false;
                            $scope.show_error_msg_2 = true;
                            $scope.show_error_msg_3 = false;
                        } else {
                            $scope.show_error_msg_1 = false;
                            $scope.show_error_msg_2 = true;
                            $scope.show_error_msg_3 = true;
                        }
                    }
                }
                // var docId = $scope.globalLabel.documentType.quoteResultScreen + "-" + localStorageService.get("selectedBusinessLineId");
                //getDocUsingId(RestAPI, docId, function(tooltipContent) {
            $scope.init = function() {
                // $scope.tooltipContent = tooltipContent.toolTips;
                $rootScope.loading = false;
                $scope.insuranceCompanyList = {};
                $scope.insuranceCompanyList.selectedInsuranceCompany = [];
                $scope.quoteFinalResult = {};
                $scope.quote = {};
                $scope.selectedDisease = {};
                $scope.travelDetails = {};
                $scope.morePlans = [];
                $scope.selectedFamilyArray = [];
                $scope.selectedDisease.diseaseList = [];


                $scope.quote = localStorageService.get("travelQuoteInputParamaters");
                $scope.quoteParam = localStorageService.get("travelQuoteInputParamaters").quoteParam;
                $scope.checkQuestionStatus($scope.quoteParam);
                $scope.travelDetails = localStorageService.get("travelQuoteInputParamaters").travelDetails;
                $scope.initPolicyDates();
                $scope.isDiseased = localStorageService.get("isDiseasedForTravel");
                $scope.selectedDisease = localStorageService.get("selectedDisease");
                $scope.diseaseList = localStorageService.get("diseaseList");
                $scope.travellersList = localStorageService.get("selectedTravellersForTravel");
                for (var i = 0; i < $scope.travellersList.length; i++) {
                    $scope.travellersList[i].status = true;
                }
                $scope.selectedTravellerArray = localStorageService.get("selectedTravellerArray");
                $scope.sumInsuredList = localStorageService.get("SumInsuredList");
                $scope.relationType = (localStorageService.get("relationTypeList") != null || localStorageService.get("relationTypeList") != undefined) ? localStorageService.get("relationTypeList") : travelGeneric;
                $scope.relationTypeCopy = angular.copy($scope.relationType);
                //for Reset

                $scope.quoteReset = localStorageService.get("travelQuoteInputParamatersReset");
                $scope.quoteParamReset = localStorageService.get("travelQuoteInputParamatersReset").quoteParam;
                $scope.travelDetailsReset = localStorageService.get("travelQuoteInputParamatersReset").travelDetails;
                $scope.isDiseasedReset = localStorageService.get("isDiseasedForTravelReset");
                $scope.selectedDiseaseReset = localStorageService.get("selectedDiseaseReset");
                $scope.diseaseListReset = localStorageService.get("diseaseListReset");
                $scope.travellersListReset = localStorageService.get("selectedTravellersForTravelReset");
                $scope.selectedTravellerArrayReset = localStorageService.get("selectedTravellerArrayReset");
                $scope.sumInsuredListReset = localStorageService.get("SumInsuredListReset");

                $scope.sortTypes = sortTypesTravelGeneric;
                $scope.pedStatus = preDiseaseStatusGen;
                $scope.genderType = travelGenderTypeGeneric;
                $scope.questionStatus = questionStatusGeneric;
                $scope.tripTypeList = tripTypeListGeneric;
                $scope.tripDurationList = tripDurationListGeneric;
                $scope.travelDetails.tripDuration = $scope.tripDurationList[0].duration;
                $scope.selectedSortOption = $scope.sortTypes[0];
                $scope.activeSort = $scope.sortTypes[0].key;

                $rootScope.travelQuoteResult = changeCurrencySymbol($rootScope.travelQuoteResult);
                localStorageService.set("travelQuoteResult", $rootScope.travelQuoteResult);



                //added for  wordPress health input reset
                $scope.resetTravelInputDetails = function() {
                    $scope.quoteParamCopy = angular.copy($scope.quoteParam);
                    $scope.travelDetailsCopy = angular.copy($scope.travelDetails);
                    $scope.travellersListCopy = angular.copy($scope.travellersList);
                    $scope.selectedDiseaseCopy = angular.copy($scope.selectedDisease);
                    $scope.diseaseListCopy = angular.copy($scope.diseaseList);
                }

                $scope.resetOnCancel = function() {
                    angular.copy($scope.quoteParamCopy, $scope.quoteParam);
                    angular.copy($scope.travelDetailsCopy, $scope.travelDetails);
                    angular.copy($scope.travellersListCopy, $scope.travellersList);
                    angular.copy($scope.diseaseListCopy, $scope.diseaseList);
                    angular.copy($scope.selectedDiseaseCopy, $scope.selectedDisease);
                    $scope.checkQuestionStatus($scope.quoteParam);
                    if ($scope.selectedDisease.diseaseList.length > 0) {
                        $scope.isDiseased = true;
                    } else {
                        $scope.isDiseased = false;
                    }
                    $scope.quoteTravelInputForm.travelInputForm.$setPristine();
                }

                // function for to sort quote results
                $scope.updateSort = function(sortOption) {
                    $scope.activeSort = sortOption.key;
                    $scope.selectedSortOption = sortOption;
                    if (sortOption.key == 1) {
                        $scope.sortKey = "grossPremium";
                        $scope.sortReverse = false;
                    } else if (sortOption.key == 2) {
                        $scope.sortKey = "sumInsured";
                        $scope.sortReverse = true;
                    } else if (sortOption.key == 3) {
                        $scope.sortKey = "insurerIndex";
                        $scope.sortReverse = true;
                    } else if (sortOption.key == 4) {
                        $scope.sortKey = "ratingsList[1][" + $scope.keySliderHospitalizationRelatedFeature.value + "]";
                        $scope.sortReverse = true;
                    } else if (sortOption.key == 5) {
                        $scope.sortKey = "ratingsList[2][" + $scope.keySliderPreventiveOutPatientRelatedFeature.value + "]";
                        $scope.sortReverse = true;
                    } else if (sortOption.key == 6) {
                        $scope.sortKey = "ratingsList[3][" + $scope.keySliderEnhancedCoverageFeature.value + "]";
                        $scope.sortReverse = true;
                    } else if (sortOption.key == 7) {
                        $scope.sortKey = "ratingsList[4][" + $scope.keySliderPreExistingDiseasesFeature.value + "]";
                        $scope.sortReverse = true;
                    }
                    $scope.toggleState();
                };

                $scope.updateSortOrder = function() {
                    if ($scope.selectedSortOption.key == 1) {
                        $scope.sortKey = "grossPremium";
                    } else if ($scope.selectedSortOption.key == 2) {
                        $scope.sortKey = "sumInsured";
                    } else if ($scope.selectedSortOption.key == 3) {
                        $scope.sortKey = "insurerIndex";
                    } else if ($scope.selectedSortOption.key == 4) {
                        $scope.sortKey = "ratingsList[1][" + $scope.keySliderHospitalizationRelatedFeature.value + "]";
                    } else if ($scope.selectedSortOption.key == 5) {
                        $scope.sortKey = "ratingsList[2][" + $scope.keySliderPreventiveOutPatientRelatedFeature.value + "]";
                    } else if ($scope.selectedSortOption.key == 6) {
                        $scope.sortKey = "ratingsList[3][" + $scope.keySliderEnhancedCoverageFeature.value + "]";
                    } else if ($scope.selectedSortOption.key == 7) {
                        $scope.sortKey = "ratingsList[4][" + $scope.keySliderPreExistingDiseasesFeature.value + "]";
                    }
                    $scope.sortReverse = !$scope.sortReverse;
                };


                // Update quote annual premium range.
                /*$scope.updateAnnualPremiumRange = function(minPremiumValue, maxPremiumValue){
                	if(minPremiumValue > maxPremiumValue){
                		$rootScope.minAnnualPremium = maxPremiumValue;
                		$rootScope.maxAnnualPremium = minPremiumValue;
                	}else{
                		$rootScope.minAnnualPremium = minPremiumValue;
                		$rootScope.maxAnnualPremium = maxPremiumValue;
                	}
                };*/

                $scope.errorMessage = function(errorMsg) {
                    if ((String($rootScope.travelQuoteResult) == $scope.globalLabel.errorMessage.undefinedError || $rootScope.travelQuoteResult.length == 0)) {
                        $scope.errorRespCounter = false;
                        /*$scope.updateAnnualPremiumRange(1000, 5000);*/
                        $rootScope.instantQuoteSummaryStatus = false;
                        $rootScope.instantQuoteSummaryError = errorMsg;
                        $rootScope.tabSelectionStatus = true;
                        $scope.instantQuoteTravelForm = false;
                    } else if ($rootScope.travelQuoteResult.length > 0) {
                        $rootScope.instantQuoteSummaryStatus = true;
                        $rootScope.viewOptionDisabled = false;
                        $rootScope.tabSelectionStatus = true;
                        $scope.instantQuoteTravelForm = false;
                    }
                    $rootScope.loading = false;
                };

                $scope.customFilterTravel = function() {
                    
                        $scope.netPremiumTotalTravel = 0;
                        $scope.netPremiumAverageTravel = 0;
                        $scope.netPremiumMaxTravel = 0;
                        $scope.proffesionalRatingTravel = 0;
                        
                         for (var i = 0; i < $rootScope.travelQuoteResult.length; i++) {
                            //Get Total of premium
                            $scope.netPremiumTotalTravel += $rootScope.travelQuoteResult[i].premiumRatio;
                            
                            //Get avg of premium
                            $scope.netPremiumAverageTravel = Number(($scope.netPremiumTotalTravel / $rootScope.travelQuoteResult.length).toFixed(5));
                        }
                        for (var i = 0; i < $rootScope.travelQuoteResult.length; i++) {
                            $rootScope.travelQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageTravel / $rootScope.travelQuoteResult[i].premiumRatio).toFixed(5));
                            if ($rootScope.travelQuoteResult[i].netPremiumMax > $scope.netPremiumMaxTravel) {
                                $scope.netPremiumMaxTravel = $rootScope.travelQuoteResult[i].netPremiumMax;
                            }
                             
                        }
                        for (var i = 0; i < $rootScope.travelQuoteResult.length; i++) {
                            $rootScope.travelQuoteResult[i].netPremiumMean = Number((($rootScope.travelQuoteResult[i].netPremiumMax / $scope.netPremiumMaxTravel) * 5).toFixed(1));
                            $rootScope.travelQuoteResult[i].proffesionalRating = ($rootScope.travelQuoteResult[i].netPremiumMean * 0.4) +
                                ($rootScope.travelQuoteResult[i].claimIndex * 0.3) +
                                ($rootScope.travelQuoteResult[i].insurerIndex * 0.3);
                               // console.log(' $rootScope.travelQuoteResult[i].proffesionalRating',   $rootScope.travelQuoteResult[i].proffesionalRating);
                        }
                       
                            $rootScope.travelQuoteResult = $filter('orderBy')($rootScope.travelQuoteResult, 'proffesionalRating');
                            $rootScope.travelQuoteResult = $rootScope.travelQuoteResult;
                            $scope.sortReverse = true;
                            return true;
            
                    }
                    
                $scope.processResult = function() {
                    $rootScope.viewOptionDisabled = false;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.modalShown = false;
                    $rootScope.loading = false;
                    $rootScope.travelQuoteResult = $filter('orderBy')($rootScope.travelQuoteResult, 'grossPremium');
                    $rootScope.travelQuoteResult = changeCurrencySymbol($rootScope.travelQuoteResult);
                    localStorageService.set("travelQuoteResult", $rootScope.travelQuoteResult);
                    $scope.updateSortOrder();
                }

                $scope.displayRibbon = function() {
                    $scope.isMinPremium = function(grossPremiumValue, carrierIDValue) {
                        if (String($rootScope.travelQuoteResult[0]) != $scope.globalLabel.errorMessage.undefinedError) {
                            var min = $rootScope.travelQuoteResult[0].grossPremium;

                            for (var i = 0; i <= $rootScope.travelQuoteResult.length - 1; i++) {
                                var carrierIdMin = $rootScope.travelQuoteResult[i].carrierId;
                                if (Number($rootScope.travelQuoteResult[i].grossPremium) < min) {
                                    min = $rootScope.travelQuoteResult[i].grossPremium;
                                    carrierIDValue = carrierIdMin;
                                }
                            }
                            if (min === grossPremiumValue) {
                                $scope.selMinCarrierId = carrierIDValue;
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };

                    $scope.isMaxIndex = function(insurerIndex, sumInsured, grossPremium, carrierSelID) {
                        if (String($rootScope.travelQuoteResult[0]) != $scope.globalLabel.errorMessage.undefinedError) {
                            var maxSel = (grossPremium / (insurerIndex * sumInsured)) * 1000;

                            var insurerIndex0 = $rootScope.travelQuoteResult[0].insurerIndex;
                            var sumInsured0 = $rootScope.travelQuoteResult[0].sumInsured;
                            var grossPremium0 = $rootScope.travelQuoteResult[0].grossPremium;
                            var max = (grossPremium0 / (sumInsured0 * insurerIndex0)) * 1000;

                            for (var i = 0; i <= $rootScope.travelQuoteResult.length - 1; i++) {
                                var insurerIndexI = $rootScope.travelQuoteResult[i].insurerIndex;
                                var sumInsuredI = $rootScope.travelQuoteResult[i].sumInsured;
                                var grossPremiumI = $rootScope.travelQuoteResult[i].grossPremium;
                                var carrierIdI = $rootScope.travelQuoteResult[i].carrierId;

                                var maxI = (grossPremiumI / (sumInsuredI * insurerIndexI)) * 1000;

                                if (Number(maxI) < max) {
                                    max = maxI;
                                    carrierSelID = carrierIdI;

                                }
                            }
                            if (max === maxSel) {
                                $scope.selCarrierId = carrierSelID;
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                };
                $scope.displayRibbon();

                $scope.singleClickTravelQuote = function() {
                    setTimeout(function() {
                        /*if(!$scope.quoteTravelInputForm.$dirty){*/
                        if ($scope.show_error_msg_1 || $scope.show_error_msg_3) {
                            $rootScope.P365Alert("Policies365", $scope.globalLabel.applicationLabels.travel.errorMessage, "Ok");
                        } else {

                            $scope.ageList = [];
                            for (var i = 0; i < $scope.quoteParam.travellers.length; i++) {
                                $scope.ageList.push($scope.quoteParam.travellers[i].age);
                            }
                            $scope.quoteParam.quoteMinAge = getMinAge($scope.ageList);
                            $scope.quoteParam.quoteMaxAge = getMaxAge($scope.ageList);
                            $scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
                            $scope.quote.quoteParam = $scope.quoteParam;

                            //for adding mobile number in quote request if call goes to quote calculation
                            if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                $scope.quote.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                            }
                            $scope.quote.travelDetails = $scope.travelDetails;
                            $rootScope.tabSelectionStatus = false;
                            $scope.travelInputForm = true;
                            $rootScope.loading = true;
                            $scope.quote.requestType = $scope.globalLabel.request.travelRequestType;
                            delete $scope.quote.documentType;
                            localStorageService.set("quote", $scope.quote);
                            localStorageService.set("travelQuoteInputParamaters", $scope.quote);
                            localStorageService.set("travelDetails", $scope.travelDetails);
                            localStorageService.set("isDiseasedForTravel", $scope.isDiseased);
                            localStorageService.set("selectedDisease", $scope.selectedDisease);
                            localStorageService.set("diseaseList", $scope.diseaseList);
                            localStorageService.set("selectedTravellersForTravel", $scope.travellersList);
                            localStorageService.set("selectedTravellerArray", $scope.selectedTravellerArray);

                            if ($rootScope.wordPressEnabled) {
                                $scope.resetTravelInputDetails();
                            }
                            $scope.quoteTravelInputForm.$setPristine();
                            $scope.quote = prepareQuoteRequest($scope.quote);
                            $scope.requestId = null;
                            RestAPI.invoke($scope.globalLabel.getRequest.quoteTravel, $scope.quote).then(function(travelQuoteResult) {
                                $rootScope.travelQuoteRequest = [];
                                if (travelQuoteResult.responseCode == $scope.globalLabel.responseCode.success) {
                                    $scope.responseCodeList = [];
                                    $scope.requestId = travelQuoteResult.QUOTE_ID;
                                    localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID", $scope.requestId);
                                    $rootScope.travelQuoteRequest = travelQuoteResult.data;
                                    if(travelQuoteResult.encryptedQuoteId){
                                        $scope.UNIQUE_QUOTE_ID_ENCRYPTED = travelQuoteResult.encryptedQuoteId;
				            	         localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);						
					 
                                    }

                                    if (String($rootScope.travelQuoteResult) != $scope.globalLabel.errorMessage.undefinedError && $rootScope.travelQuoteResult.length > 0) {
                                        $rootScope.travelQuoteResult.length = 0;
                                    }

                                    angular.forEach($rootScope.travelQuoteRequest, function(obj, i) {
                                        var request = {};
                                        var header = {};

                                        header.messageId = messageIDVar;
                                        header.campaignID = campaignIDVar;
                                        header.source = sourceOrigin;
                                        header.transactionName = $scope.globalLabel.transactionName.travelQuoteResult;
                                        header.deviceId = deviceIdOrigin;
                                        request.header = header;
                                        request.body = obj;
                                        var count = 0;
                                        $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                        success(function(callback, status) {
                                            console.log("quoteRequest status : " + status);
                                            var travelQuoteResponse = JSON.parse(callback);
                                            if (travelQuoteResponse.QUOTE_ID == $scope.requestId) {
                                                $scope.responseCodeList.push(travelQuoteResponse.responseCode);
                                                if (travelQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                    $rootScope.loading = false;
                                                    for (var i = 0; i < $rootScope.travelQuoteRequest.length; i++) {
                                                        if ($rootScope.travelQuoteRequest[i].messageId == travelQuoteResponse.messageId) {
                                                            $rootScope.travelQuoteResult.push(travelQuoteResponse.data.quotes[0]);
                                                            $rootScope.travelQuoteRequest[i].status = 1;
                                                        }
                                                    }
                                                    $scope.processResult();
                                                } else if (travelQuoteResponse.responseCode == $scope.globalLabel.responseCode.invalidPlan) {
                                                    $scope.responseCodeList.push(travelQuoteResponse.responseCode);
                                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                                        if ($rootScope.travelQuoteRequest[i].messageId == travelQuoteResponse.messageId) {
                                                            $rootScope.travelQuoteRequest[i].status = 2;
                                                            if (travelQuoteResponse.invalidInputMessage) {
                                                                $scope.invalidPlanOption = travelQuoteResponse.invalidInputMessage;
                                                                $rootScope.travelQuoteRequest[i].message = $sce.trustAsHtml("<div>We did not get quote from the Insurer. It may be because</b></div><br/><ul class=errorUL><li class=errorPlacementLeft>{{invalidPlanOption}}</li></div>");
                                                            } else {
                                                                $rootScope.travelQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedFormInvalidErrMsg);
                                                            }
                                                        }
                                                    }
                                                    $scope.processResult();

                                                } else {
                                                    for (var i = 0; i < $rootScope.travelQuoteRequest.length; i++) {
                                                        if ($rootScope.travelQuoteRequest[i].messageId == travelQuoteResponse.messageId) {
                                                            $rootScope.travelQuoteRequest[i].status = 2;
                                                            $rootScope.travelQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedTravelErrMsg);
                                                        }
                                                    }
                                                }
                                            }

                                        }).error(function(data, status) {
                                            $scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
                                        });
                                    });

                                    $scope.$watch('responseCodeList', function(newValue, oldValue, scope) {
                                        if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
                                            $rootScope.loading = false;
                                        if ($scope.responseCodeList.length == $rootScope.travelQuoteRequest.length) {
                                            $rootScope.loading = false;
                                            $rootScope.setTooltip = false;

                                            for (var i = 0; i < $rootScope.travelQuoteRequest.length; i++) {
                                                if ($rootScope.travelQuoteRequest[i].status == 0) {
                                                    $rootScope.travelQuoteRequest[i].status = 2;
                                                    $rootScope.travelQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedTravelErrMsg);
                                                }
                                            }
                                            if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
                                                $scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
                                            } else {
                                                $scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedTravelErrMsg));
                                            }
                                        }
                                    }, true);
                                } else {
                                    $scope.responseCodeList = [];
                                    if (String($rootScope.travelQuoteResult) != $scope.globalLabel.errorMessage.undefinedError && $rootScope.travelQuoteResult.length > 0)
                                        $rootScope.travelQuoteResult.length = 0;

                                    $rootScope.travelQuoteResult = [];
                                    $scope.errorMessage(travelQuoteResult.message);
                                }
                            });
                            $scope.displayRibbon();
                        }
                        /*}*/
                    }, 100);
                };

                /*this function checks that wordpress is enabled or not
                 * if enabled then not calling singleClickTravelQuote on change of any UI fields
                 * else calling calling singleClickTravelQuote on change of any UI fields
                 * */
                $scope.callSingleClickQuote = function() {
                    if (!$rootScope.wordPressEnabled) {
                        $scope.singleClickTravelQuote();
                    }
                }


                $scope.calculateQuoteOnSubmit = function() {
                    //$scope.callSingleClickQuote();
                }

                $scope.isCarrierResulted = function(carrierId) {
                    for (var i = 0; $rootScope.travelQuoteResult.length; i++) {
                        if ($rootScope.travelQuoteResult[i].carrierId == carrierId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
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

                $scope.toggleState = function() {
                    $scope.state = !$scope.state;
                };

                // Method to get list of Continent details from DB.
                $scope.getContinentList = function(countryName) {
                    return $http.get(getServiceLink + $scope.globalLabel.documentType.destinationDetails + "&q=" + countryName).then(function(response) {
                        return JSON.parse(response.data).data;
                    });
                };

                $scope.newDestination = function(destination) {
                    return {
                        name: destination,
                    };
                };



                // traveller modal functions
                $scope.modalTraveller = false;
                $scope.toggleTraveller = function() {
                    $scope.oldtravellersList = angular.copy($scope.travellersList);
                    for (var i = 0; i < $scope.travellersList.length; i++) {
                        $scope.travellersList[i].minAge = 1;
                        $scope.travellersList[i].maxAge = 120;
                        $scope.travellersList[i].addNew = false;
                        $scope.changeRelation($scope.travellersList[i].relation);
                    }
                    $scope.travellersList[$scope.travellersList.length - 1].addNew = true;
                    $scope.modalTraveller = !$scope.modalTraveller;
                    setTimeout(function() {
                        $('.hiddenAge').each(function() {
                            var hiddenVal = $(this).val();
                            $(this).closest('span').find('.ageDropdown').val(hiddenVal);
                        });
                    }, 1000);
                };

                $scope.addTraveller = function(id) {
                    if (id <= 6) {
                        if (id == 6)
                            $scope.disableAddButton = true;
                        else
                            $scope.disableAddButton = false;

                        $scope.travellersList[id].addNew = false;
                        var traveller = {};
                        traveller.minAge = 1;
                        traveller.maxAge = 120;
                        traveller.gender = "Male";
                        traveller.age = 18;
                        traveller.traveller_id = $scope.travellersList.length + 1;
                        traveller.status = true;
                        traveller.addNew = true;
                        $scope.travellersList.push(traveller);
                    } else {
                        $scope.disableAddButton = true;
                    }
                    $scope.changeRelation($scope.travellersList[id].relation);
                }

                $scope.removeTraveller = function(id) {
                    if (!$scope.travellersList[id].status) {
                        $scope.travellersList.splice(id, 1);
                        if ($scope.travellersList.length < 8) {
                            $scope.disableAddButton = false;
                            $scope.travellersList[$scope.travellersList.length - 1].addNew = true;
                        }
                    }
                }

                $scope.closeTravellerModal = function() {
                    $scope.travellersList = $scope.oldtravellersList;
                    $scope.modalTraveller = false;
                };

                $scope.getAgeArray = function(minAge, maxAge) {
                    var ageArray = [];
                    for (var i = 0, j = minAge; j <= maxAge; i++, j++) {
                        ageArray.push(j);
                    }
                    return ageArray;
                };

                //for wordPress
                if ($scope.wordPressEnabled) {
                    $scope.resetTravelInputDetails();
                }

                //	Function to create compare view and card list
                $scope.cardView = true;
                $scope.compareView = false;
                $scope.showCompareBtn = true;
                $scope.showCardBtn = true;
                $scope.disableSort = false;

                //newFunction for compare
                $scope.compareViewClick = function() {
                    $scope.dataLoaded = true;
                    $scope.slickLoaded = true;
                    $scope.cardView = true;
                    $scope.compareView = false;
                    $scope.showCompareBtn = true;
                    $scope.showCardBtn = true;
                    $scope.disableSort = false;
                };

                $scope.cardViewClick = function() {
                    $scope.dataLoaded = true;
                    $scope.slickLoaded = true;
                    $scope.cardView = false;
                    $scope.compareView = true;
                    $scope.showCompareBtn = true;
                    $scope.showCardBtn = true;
                    $scope.disableSort = true;
                };

                $scope.findDisplayLimit = function(displayLimitValue) {
                    var returnvalue = "NOT AVAILABLE";
                    if (displayLimitValue != null) {
                        returnvalue = displayLimitValue;
                    }
                    return returnvalue;
                };

                function isSelected(value) {
                    var returnvalue = false;
                    for (var i = 0; i < $scope.travellersList.length; i++) {
                        if ($scope.travellersList[i].relation == value) {
                            returnvalue = true;
                        }
                    }
                    return returnvalue;
                }

                function validateGender() {
                    var isGenderValid = false;
                    for (var i = 0; i < $scope.travellersList.length; i++) {
                        if ($scope.travellersList[i].relation == FATHER || $scope.travellersList[i].relation == SON) {
                            $scope.travellersList[i].gender = MALE;
                            isGenderValid = true;
                        }
                        if ($scope.travellersList[i].relation == MOTHER || $scope.travellersList[i].relation == DAUGHTER) {
                            $scope.travellersList[i].gender = FEMALE;
                            isGenderValid = true;
                        }
                        if ($scope.travellersList[i].relation == SELF) {
                            for (var j = 0; j < $scope.travellersList.length; j++) {
                                if ($scope.travellersList[j].relation == SPOUSE) {
                                    $scope.travellersList[j].gender = ($scope.travellersList[i].gender == MALE) ? FEMALE : MALE;
                                    isGenderValid = true;
                                }
                            }
                        }
                    }
                    return isGenderValid;
                }

                $scope.changeRelation = function(relation) {
                    validateGender();
                    for (var i = 0; i < $scope.relationTypeCopy.length; i++) {
                        if (!isSelected($scope.relationTypeCopy[i].member)) {
                            $scope.relationTypeCopy[i].val = false;
                        }
                        if ($scope.relationTypeCopy[i].member == relation && isSelected(relation)) {
                            if (relation != SON && relation != DAUGHTER) {
                                $scope.relationTypeCopy[i].val = true;
                            }
                        }
                    }
                    $scope.relationType = angular.copy($scope.relationTypeCopy);
                }

                $scope.validateFamilyForm = function() {
                    $scope.familyErrors = [];
                    var submitTravellersForm = true;
                    var ageOfSelf, ageOfSpouse, ageOfFather, lesserAge;
                    for (var i = 0; i < $scope.travellersList.length; i++) {
                        if ($scope.travellersList[i].relation == SELF) {
                            if ($scope.travellersList[i].status) {
                                ageOfSelf = Number($scope.travellersList[i].age);
                            }
                        } else if ($scope.travellersList[i].relation == SPOUSE) {
                            if ($scope.travellersList[i].status) {
                                ageOfSpouse = Number($scope.travellersList[i].age);
                            }
                        } else if ($scope.travellersList[i].relation == FATHER) {
                            if ($scope.travellersList[i].status) {
                                ageOfFather = Number($scope.travellersList[i].age);
                            }
                        }
                    }
                    for (var i = 0; i < $scope.travellersList.length; i++) {
                        if (ageOfSelf == 'undefined' || ageOfSelf == '' || ageOfSelf == null) {
                            lesserAge = ageOfSpouse;
                        } else {
                            lesserAge = ageOfSpouse < ageOfSelf ? ageOfSpouse : ageOfSelf;
                        }
                        if ($scope.travellersList[i].status == true) {
                            /*console.log("Relation : " + $scope.travellersList[i].relation + " and Age : " + $scope.travellersList[i].age);*/
                            if ($scope.travellersList[i].relation == SON && $scope.travellersList[i].age > (lesserAge - 18)) {
                                if (p365Includes($scope.familyErrors, "Child's age should be at least 18 years lesser than the younger parent") == false) {
                                    $scope.familyErrors.push("Child's age should be at least 18 years lesser than the younger parent");
                                    submitTravellersForm = false;
                                }
                            }

                            if ($scope.travellersList[i].relation == DAUGHTER && $scope.travellersList[i].age > (lesserAge - 18)) {
                                if (p365Includes($scope.familyErrors, "Child's age should be at least 18 years lesser than the younger parent") == false) {
                                    $scope.familyErrors.push("Child's age should be at least 18 years lesser than the younger parent");
                                    submitTravellersForm = false;
                                }
                            }

                            if (($scope.travellersList[i].relation == FATHER || $scope.travellersList[i].relation == MOTHER) && $scope.travellersList[i].age < (ageOfSelf + 18)) {
                                if (p365Includes($scope.familyErrors, "Your Parents' age should be at least 18 years more than your age") == false) {
                                    $scope.familyErrors.push("Your Parents' age should be at least 18 years more than your age");
                                    submitTravellersForm = false;
                                }
                            }
                        }
                    }
                    return submitTravellersForm;
                };





                $scope.submitTravellers = function() {
                    var submitTravellersForm = true;
                    submitTravellersForm = $scope.validateFamilyForm();
                    var travellersCounter = 0;
                    var travellerSelectionStatus = false;
                    var relationStatus = false;
                    /*$scope.familyErrors=[];*/
                    $scope.quoteParam.travellers = [];
                    $scope.travellersList = $filter('filter')($scope.travellersList, function(value) {
                        return value.status == true;
                    })

                    for (var i = 0; i < $scope.travellersList.length; i++) {
                        if ($scope.travellersList[i].status == true) {
                            if ($scope.travellersList[i].relation != undefined && $scope.travellersList[i].relation != "") {
                                var member = {};
                                member.traveller_id = i + 1;
                                member.age = Number($scope.travellersList[i].age);
                                member.gender = $scope.travellersList[i].gender;
                                member.minAge = 1;
                                member.maxAge = 120;
                                member.relation = $scope.travellersList[i].relation;
                                member.status = $scope.travellersList[i].status;
                                $scope.quoteParam.travellers.push(member);
                                travellerSelectionStatus = true;
                                relationStatus = true;
                                travellersCounter++;
                            } else {
                                relationStatus = false;
                            }
                        } else {
                            travellerSelectionStatus = false;
                        }
                    }
                    $scope.quoteParam.travellers[$scope.quoteParam.travellers.length - 1].addNew = true;
                    $scope.travellersList = $scope.quoteParam.travellers;
                    $scope.numberOfTraveller = travellersCounter;
                    localStorageService.set("selectedTravellersForTravel", $scope.travellersList);
                    localStorageService.set("selectedTravellersForTravelReset", $scope.travellersList);
                    localStorageService.set("relationTypeList", $scope.relationType);
                    if (travellersCounter > 1) {
                        $scope.quoteParam.planType = "F";
                    } else {
                        $scope.quoteParam.planType = "I";
                    }
                    if (travellerSelectionStatus) {
                        if (relationStatus) {
                            if (submitTravellersForm == true) {
                                if ($rootScope.wordPressEnabled) {
                                    $scope.quoteTravelInputForm.travelInputForm.$setDirty();
                                }
                                $scope.modalTraveller = false;
                                //$scope.callSingleClickQuote();
                            }
                        } else {
                            $scope.familyErrors.push("Please select relation of traveller.");
                        }
                    } else {
                        $scope.familyErrors.push("Please select at least one member.");
                    }
                    $scope.selectedTravellerArray = $scope.quoteParam.travellers;
                };




                // function to manage view on UI
                $scope.toggleQuestion1 = function() {
                    if ($scope.quoteParam.travellingFromIndia == "N") {
                        $scope.show_error_msg_1 = true;
                        $scope.show_error_msg_2 = false;
                        $scope.show_error_msg_3 = false;
                        $scope.quoteParam.isIndian = "Y";
                        $scope.quoteParam.isOciPioStatus = "Y";

                    } else {
                        $scope.show_error_msg_1 = false;
                        $scope.show_error_msg_2 = false;
                        $scope.show_error_msg_3 = false;
                        $scope.quoteParam.isIndian = "Y";
                        $scope.quoteParam.isOciPioStatus = "Y";
                    }
                    $scope.calculateQuoteOnSubmit();
                };
                $scope.toggleQuestion2 = function() {
                    if ($scope.quoteParam.isIndian == "N") {
                        $scope.show_error_msg_1 = false;
                        $scope.show_error_msg_2 = true;
                        $scope.show_error_msg_3 = false;
                        $scope.quoteParam.isOciPioStatus = "Y";
                    } else {
                        $scope.show_error_msg_1 = false;
                        $scope.show_error_msg_2 = false;
                        $scope.show_error_msg_3 = false;
                        $scope.quoteParam.isOciPioStatus = "Y";
                    }
                    //$scope.callSingleClickQuote();
                };
                $scope.toggleQuestion3 = function() {
                    if ($scope.quoteParam.isOciPioStatus == "N") {
                        $scope.show_error_msg_1 = false;
                        $scope.show_error_msg_2 = true;
                        $scope.show_error_msg_3 = true;
                    } else {
                        $scope.show_error_msg_1 = false;
                        $scope.show_error_msg_2 = true;
                        $scope.show_error_msg_3 = false;
                    }
                    $scope.calculateQuoteOnSubmit();

                };


                $scope.openMenu = function($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                    setTimeout(function() {
                        $('.md-click-catcher').click(function() {
                            $scope.activeMenu = '';
                        });
                    }, 100);
                };

                $scope.clickForActive = function(item) {
                    $scope.activeMenu = item;
                };

                $scope.clickForViewActive = function(item) {
                    $scope.activeViewMenu = item;
                };

                $scope.clickForViewActive('Compare');

                $scope.clicktoDisable = function() {
                    setTimeout(function() {
                        $('.md-click-catcher').css('pointer-events', 'none');
                    }, 100);
                };

                $scope.rateit = {
                    readonly_enables: true
                };

                $scope.showMorePlans = function(data) {
                    data.isMorePlans = true;

                };

                $scope.showLessPlans = function(data) {
                    data.isMorePlans = false;
                };

                $rootScope.signout = function() {
                    $rootScope.userLoginStatus = false;
                    var userLoginInfo = {};
                    userLoginInfo.username = "";
                    userLoginInfo.status = $rootScope.userLoginStatus;
                    localStorageService.set("userLoginInfo", userLoginInfo);
                    $location.path("/quote");
                };

                $scope.missionCompled = function() {
                    $rootScope.loading = false;
                };

                //code for share email
                $scope.EmailChoices = [{ 'username': '', 'addNew': true, paramMap: { 'docId': '', 'LOB': localStorageService.get("selectedBusinessLineId").toString(), userId: '', 'selectedPolicyType': '' } }];
                var flag = false;
                //$scope.modalView=false;
                $scope.modalEmailView = false;
                $scope.emailPopUpDisabled = false;

                if (localStorageService.get("quoteUserInfo")) {
                    $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
                }

                $scope.addNewChoice = function() {
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


                $scope.removeChoice = function() {
                    var lastItem = $scope.EmailChoices.length - 1;
                    $scope.EmailChoices.splice(lastItem);
                };

                $scope.showForShare = function(data) {
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
                    // $scope.sendQuotesByEmail = function() {
                    //     $scope.flagArray = [];
                    //     var index = -1;
                    //     for (var i = 0; i < $scope.EmailChoices.length; i++) {
                    //         var flagCheck = {};
                    //         if ($scope.EmailChoices[i].username == '' || $scope.EmailChoices[i].username == undefined) {
                    //             continue;
                    //         }
                    //         //code for encode
                    //         var encodeQuote = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");
                    //         var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
                    //         var encodeEmailId = $scope.EmailChoices[i].username;
                    //         var encodeCarrierList = [];
                    //         if ($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0) {
                    //             encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
                    //             var jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
                    //         } else {
                    //             encodeCarrierList.push("ALL");
                    //         }

                //         var key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
                //         var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

                //         var encryptedQuote = CryptoJS.AES.encrypt(encodeQuote, key, { iv: iv });
                //         $rootScope.encryptedQuote_Id = encryptedQuote.ciphertext.toString();

                //         var encryptedNewLOB = CryptoJS.AES.encrypt(encodeLOB, key, { iv: iv });
                //         $rootScope.encryptedLOB = encryptedNewLOB.ciphertext.toString();

                //         var encryptedEmailId = CryptoJS.AES.encrypt(encodeEmailId, key, { iv: iv });
                //         $rootScope.encryptedEmail = encryptedEmailId.ciphertext.toString();

                //         var encryptedCarrierList = CryptoJS.AES.encrypt(jsonEncodeCarrierList, key, { iv: iv });
                //         $rootScope.encryptedCarriers = encryptedCarrierList.ciphertext.toString();

                //         $scope.EmailChoices[i].funcType = "SHARETRAVELQUOTE";
                //         $scope.EmailChoices[i].isBCCRequired = 'Y';
                //         $scope.EmailChoices[i].paramMap = {};
                //         $scope.EmailChoices[i].paramMap.docId = String($rootScope.encryptedQuote_Id);
                //         $scope.EmailChoices[i].paramMap.LOB = String($rootScope.encryptedLOB);
                //         $scope.EmailChoices[i].paramMap.userId = String($rootScope.encryptedEmail);
                //         $scope.EmailChoices[i].paramMap.carriers = String($rootScope.encryptedCarriers);
                //         $scope.EmailChoices[i].paramMap.selectedPolicyType = "TRAVEL";

                //         var body = {};
                //         body.longURL = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;
                //         $http({ method: 'POST', url: getShortURLLink, data: body }).
                //         success(function(shortURLResponse) {

                //             var request = {};
                //             var header = {};
                //             var arr = $scope.EmailChoices;

                //             header.messageId = messageIDVar;
                //             header.campaignID = campaignIDVar;
                //             header.source = sourceOrigin;
                //             header.transactionName = sendEmail;
                //             header.deviceId = deviceIdOrigin;
                //             request.header = header;

                //             if (shortURLResponse.responseCode == $scope.globalLabel.responseCode.success) {
                //                 index++;
                //                 request.body = arr[index];
                //                 request.body.paramMap.url = shortURLResponse.data.shortURL;
                //                 $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                //                 success(function(callback) {
                //                     var emailResponse = JSON.parse(callback);
                //                     var receipientNum = $scope.EmailChoices.length;
                //                     if (i == receipientNum) {
                //                         if (emailResponse.responseCode == $scope.globalLabel.responseCode.success) {

                //                             $scope.shareEmailModal = false;
                //                             $scope.modalEmailView = true;

                //                             /*for(var i=1;i<$scope.EmailChoices.length;i++)
                //     		$scope.EmailChoices[i]=[];*/
                //                         } else {
                //                             localStorageService.set("emailDetails", undefined);
                //                         }
                //                     }

                //                 });
                //             } else {
                //                 console.log(shortURLResponse.message);

                //             }
                //         });
                //     }
                // }
                $scope.deleteReceipient = function(index) {
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

                $scope.hideEmailModal = function() {
                    $scope.modalEmailView = false;
                    $scope.shareEmailModal = false;
                }

                $scope.hidePremiumDetails = function(data){
                    $scope.premiumDetailsModal = false;
                }

                $scope.showPremiumDetails = function(selectedTab,data){
                    $scope.premiumDetails = data;
                    $rootScope.selectedTabTravel = selectedTab;
                    $scope.premiumDetailsModal = !$scope.premiumDetailsModal;
                }

                //setting flag for Olarked App from share mail
                if ($rootScope.isOlarked) {
                    setTimeout(function() {
                        $rootScope.loading = false;
                    }, 500);

                }
                $scope.sendEmail = function() {
                    $scope.flagArray = [];
                    var index = -1;
                    for (var i = 0; i < $scope.EmailChoices.length; i++) {
                        var flagCheck = {};
                        if ($scope.EmailChoices[i].username == '' || $scope.EmailChoices[i].username == undefined) {
                            continue;
                        }

                        //code for encode
                        var encodeQuote = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED");
                        var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
                        var encodeEmailId = $scope.EmailChoices[0].username;

                        var encodeCarrierList = [];
                        if ($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0) {
                            encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
                            var jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
                        } else {
                            encodeCarrierList.push("ALL");
                        }

                        $scope.EmailChoices[i].funcType = "SHARETRAVELQUOTE";
                        $scope.EmailChoices[i].isBCCRequired = 'Y';
                        $scope.EmailChoices[i].paramMap = {};
                        $scope.EmailChoices[i].paramMap.docId = String(encodeQuote);
                        $scope.EmailChoices[i].paramMap.LOB = String(encodeLOB);
                        $scope.EmailChoices[i].paramMap.userId = String(encodeEmailId);
                        $scope.EmailChoices[i].paramMap.carriers = String(jsonEncodeCarrierList);
                        $scope.EmailChoices[i].paramMap.selectedPolicyType = "TRAVEL";

                        var body = {};
                        body.longURL = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;
                        $http({ method: 'POST', url: getShortURLLink, data: body }).
                        success(function(shortURLResponse) {

                            var request = {};
                            var header = {};
                            var arr = $scope.EmailChoices;

                            header.messageId = messageIDVar;
                            header.campaignID = campaignIDVar;
                            header.source = sourceOrigin;
                            header.transactionName = sendEmail;
                            header.deviceId = deviceIdOrigin;
                            request.header = header;

                            if (shortURLResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                index++;
                                request.body = arr[index];
                                request.body.paramMap.url = shortURLResponse.data.shortURL;
                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                success(function(callback) {
                                    var emailResponse = JSON.parse(callback);
                                    var receipientNum = $scope.EmailChoices.length;
                                    if (i == receipientNum) {
                                        if (emailResponse.responseCode == $scope.globalLabel.responseCode.success) {

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

                $scope.showShareEmailModal = function() {
                    if (localStorageService.get("quoteUserInfo") && localStorageService.get("quoteUserInfo").emailId) {

                        if ($scope.crmEmailSend || $rootScope.wordPressEnabled) {
                            //Added by gauri for mautic application				
                            if (imauticAutomation == true) {
                                imatShareQuote(localStorageService, $scope, 'ShareQuote');
                                $scope.shareEmailModal = false;
                                $scope.modalEmailView = true;
                                $scope.crmEmailSend = true;
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

                $scope.sendQuotesByEmail = function() {
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

                // Create lead with available user information by calling webservice for share email.
                $scope.leadCreationUserInfo = function() {
                    var userInfoWithQuoteParam = {};
                    $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
                    // Quote user info added to central DB using DataWriter service.	-	modification-0002
                    localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                    var quoteParam = angular.copy(localStorageService.get("travelQuoteInputParamaters").quoteParam);
                    userInfoWithQuoteParam.quoteParam = quoteParam;
                    userInfoWithQuoteParam.quoteParam.gender = quoteParam.travellers[0].gender;
                    userInfoWithQuoteParam.quoteParam.age = quoteParam.travellers[0].age;
                    var travelDetails = angular.copy(localStorageService.get("travelDetails"));
                    userInfoWithQuoteParam.travelDetails = travelDetails;
                    if (travelDetails.destinations.length == 1) {
                        userInfoWithQuoteParam.travelDetails.country = travelDetails.destinations[0].displayField;
                    } else if (travelDetails.destinations.length > 1) {
                        userInfoWithQuoteParam.travelDetails.country = "Multipal";
                    }
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");
                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                    userInfoWithQuoteParam.contactInfo = $scope.quoteUserInfo;

                    if ($rootScope.agencyPortalEnabled) {
                        //const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                        userInfoWithQuoteParam.contactInfo.createLeadStatus = false;
                        userInfoWithQuoteParam.requestSource = sourceOrigin;
                        $location.search('createLead', 'false');
                        userInfoWithQuoteParam.userName = localdata.username;
                        userInfoWithQuoteParam.agencyId = localdata.agencyId;
                    } else {
                        $scope.quoteUserInfo.emailId = $rootScope.decryptedEmailId;
                        userInfoWithQuoteParam.requestSource = sourceOrigin;
                    }

                    //	Webservice call for lead creation.	-	modification-0010
                    if ($scope.quoteUserInfo != null) {
                        if (($scope.quoteUserInfo.messageId == '') || ($scope.quoteUserInfoForm.$dirty)) {
                            RestAPI.invoke($scope.globalLabel.transactionName.createLead, userInfoWithQuoteParam).then(function(callback) {
                                if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                    messageIDVar = callback.data.messageId;
                                    $scope.quoteUserInfo.messageId = messageIDVar;
                                    $scope.modalView = false;
                                    localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                                }
                            });
                        } else {
                            messageIDVar = $scope.quoteUserInfo.messageId;
                        }
                    }
                };

                $scope.redirectToResult = function() {
                    $scope.leadCreationUserInfo();
                };

                $scope.redirectToAPResult = function() {
                    $scope.leadCreationUserInfo();
                };


                //functions for medical
                $scope.diseaseClick = function() {
                    if ($scope.quoteParam.pedStatus == 'Y') {
                        $scope.isDiseased = true;
                        $scope.toggleHealth();
                    } else {
                        $scope.isDiseased = false;
                        $scope.selectedDisease.diseaseList = [];
                        for (var i = 0; i < $scope.diseaseList.length; i++) {
                            $scope.diseaseList[i].travellersList = [];
                        }
                        setTimeout(function() {
                            $scope.calculateQuoteOnSubmit();
                        }, 100);
                    }
                };

                $scope.checkDisease = function(value, checked) {
                    var idx = $scope.selectedDisease.diseaseList.indexOf(value);
                    if (idx >= 0 && !checked) {
                        $scope.selectedDisease.diseaseList.splice(idx, 1);
                    }
                    if (idx < 0 && checked) {
                        $scope.selectedDisease.diseaseList.push(value);
                    }
                };

                $scope.toggleView = function() {
                    $scope.showAddButton = !$scope.showAddButton;
                }

                $scope.modalHealth = false;
                $scope.toggleHealth = function() {
                    if (!$scope.instantQuoteHealthForm) {
                        $scope.oldSelectedDiseaseList = angular.copy($scope.selectedDisease.diseaseList);
                        $scope.selectedTravellerArray = $scope.quoteParam.travellers;
                        $scope.modalHealth = !$scope.modalHealth;
                        for (var i = 0; i < $scope.diseaseList.length; i++) {
                            if ($scope.diseaseList[i].travellersList == undefined || String($scope.diseaseList[i].travellersList) == 'undefined')
                                $scope.diseaseList[i].travellersList = [];
                        }
                    }
                };

                $scope.getDisease = function() {
                    return $scope.selectedDisease.diseaseList;
                };

                $scope.closePreExistingDiseaseModal = function() {
                    var deleteList = [];


                    for (var i = 0; i < $scope.diseaseList.length; i++) {
                        if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[i].diseaseId) == true && $scope.diseaseList[i].travellersList.length == 0) {
                            deleteList.push($scope.diseaseList[i].diseaseId);
                        } else if (p365Includes($scope.oldSelectedDiseaseList, $scope.diseaseList[i].diseaseId) == false) {
                            deleteList.push($scope.diseaseList[i].diseaseId);
                        }
                    }

                    if ($scope.selectedDisease.diseaseList.length == 0) {
                        $scope.quoteParam.pedStatus = 'N';
                        $scope.isDiseased = false;
                    }
                    $scope.selectedDisease.diseaseList = $scope.selectedDisease.diseaseList.filter(function(obj) {
                        return deleteList.indexOf(obj) === -1;
                    });
                    $scope.modalHealth = false;
                };

                $scope.submitPreDiseaseList = function() {
                    $scope.ratingParam = {};
                    var submitDiseaseForm = true;
                    var i;
                    $scope.ratingParam.criticalIllness = "N";
                    $scope.ratingParam.organDonar = "N";
                    if ($scope.selectedDisease.diseaseList.length > 0) {
                        for (i = 0; i < $scope.diseaseList.length; i++) {
                            if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[i].diseaseId) == true) {
                                if ($scope.diseaseList[i].diseaseType == "OrganDonar") {
                                    $scope.ratingParam.organDonar = "Y";
                                }

                                if ($scope.diseaseList[i].diseaseType == "Critical") {
                                    $scope.ratingParam.criticalIllness = "Y";
                                }

                                if ($scope.diseaseList[i].travellersList.length == 0) {
                                    $scope.diseaseError = "Please select sumembers against each selected disease";
                                    submitDiseaseForm = false;
                                }
                            }
                        }
                    } else {
                        submitDiseaseForm = false;
                        $scope.diseaseError = "Please select disease before submit.";
                    }


                    if (submitDiseaseForm == true) {
                        $scope.modalHealth = false;
                        $scope.diseaseError = "";

                        if ($scope.selectedDisease.diseaseList.length == 0) {
                            $scope.quoteParam.pedStatus = 'N';
                            $scope.isDiseased = false;
                        }

                        for (i = 0; i < $scope.selectedTravellerArray.length; i++) {
                            $scope.selectedTravellerArray[i].diseaseDetails = [];
                            $scope.diseaseDetails = [];

                            for (var j = 0; j < $scope.diseaseList.length; j++) {
                                if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[j].diseaseId) == true) {
                                    for (var k = 0; k < $scope.diseaseList[j].travellersList.length; k++) {
                                        if ($scope.selectedTravellerArray[i].traveller_id == $scope.diseaseList[j].travellersList[k].traveller_id) {
                                            $scope.diseaseList[j].travellersList[k].status = true;

                                            var diseaseDetail = {};
                                            diseaseDetail.diseaseCode = $scope.diseaseList[j].diseaseId;
                                            diseaseDetail.diseaseName = $scope.diseaseList[j].disease;
                                            diseaseDetail.masterDiseaseCode = $scope.diseaseList[j].diseaseCode;
                                            diseaseDetail.applicable = true;
                                            $scope.diseaseDetails.push(diseaseDetail);
                                        }
                                    }
                                } else {
                                    $scope.diseaseList[j].travellersList = [];
                                }
                            }
                            if ($scope.diseaseDetails.length > 0) {
                                localStorageService.set("diseaseList", $scope.diseaseList);

                                $scope.selectedTravellerArray[i].diseaseDetails = $scope.diseaseDetails;
                            }
                        }
                        $scope.quoteParam.travellers = $scope.selectedTravellerArray;
                        localStorageService.set("selectedTravellerArray", $scope.selectedTravellerArray);
                        setTimeout(function() {
                            $scope.calculateQuoteOnSubmit();
                        }, 100);
                    }
                };

                $scope.removePreDisease = function(data) {
                    var i;
                    for (i = 0; i < $scope.selectedDisease.diseaseList.length; i++) {
                        if ($scope.selectedDisease.diseaseList[i] == data.diseaseId) {
                            $scope.selectedDisease.diseaseList.splice(i, 1);
                            break;
                        }
                    }
                    if ($rootScope.wordPressEnabled) {
                        $scope.quoteTravelInputForm.travelInputForm.$setDirty();
                    }

                    for (i = 0; i < $scope.diseaseList.length; i++) {
                        if ($scope.diseaseList[i].diseaseId == data.diseaseId) {
                            $scope.diseaseList[i].travellersList = [];
                            break;
                        }
                    }
                    if ($scope.selectedDisease.diseaseList.length == 0) {
                        $scope.quoteParam.pedStatus = 'N';
                        $scope.isDiseased = false;
                    }

                    $scope.submitPreDiseaseList();
                };

                if ($rootScope.flag || $rootScope.isOlarked) {
                    if ($rootScope.flag) {
                        $scope.redirectToResult();
                        $rootScope.flag = false;
                    }
                    if (localStorageService.get("quoteUserInfo")) {
                        $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
                    }
                    $rootScope.loading = false;
                }

            }

            $scope.$watch(function() {
                return $rootScope.travelQuoteResult;
            }, function() {
                $rootScope.travelQuoteResult = $rootScope.travelQuoteResult;
                //console.log('step000')
                if ($rootScope.travelQuoteResult) {
                    // console.log('step1')
                    if ($rootScope.travelQuoteResult.length > 0) {
                        // console.log('step2')
                        $scope.init();
                        //$scope.callForInit = true;
                    }
                }
            }, true);

            //function created to display carrier if premium > 0.
            $scope.validatePremium = function(data) {
                if (Number(data.grossPremium) > 0) {
                    return true;
                } else {
                    return false;
                }
            };


            $scope.buyProduct = function(selectedProduct) {
                localStorageService.set("selectedProduct", selectedProduct);
                localStorageService.set("travelDetails", $scope.travelDetails);
                localStorageService.set("travelQuoteInputParamaters", $scope.quote);
                var buyScreenParam = {};
                buyScreenParam.documentType = "proposalScreenConfig";
                buyScreenParam.businessLineId = Number(localStorageService.get("selectedBusinessLineId"));
                buyScreenParam.carrierId = selectedProduct.carrierId;
                buyScreenParam.productId = selectedProduct.productId;
                buyScreenParam.QUOTE_ID = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");


			        $scope.selectedProduct = selectedProduct;
                
                    //added by gauri for mautic application
                    if (imauticAutomation == true) {
                        imatBuyClicked(localStorageService, $scope, 'BuyClicked');
                    }

                //added by gauri for mautic application
                /* if (imauticAutomation == true) {
                    if ($rootScope.isFromProfessionalJourney) {
                        if (localStorageService.get("PROF_QUOTE_ID")) {
                            console.log('lastprofessionalquoteId ', localStorageService.get("PROF_QUOTE_ID"));
                            var PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                            var prof_quote_url = "" + shareProfessionalQuoteLink + "" + PROF_QUOTE_ID + "&lob=5";


                            imauticBuy(PROF_QUOTE_ID, '', prof_quote_url, messageIDVar, 'BuyClicked');

                        } else {
                            if (localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID")) {
                                console.log('lastquoteId ', localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"));
                                var TRAVEL_UNIQUE_QUOTE_ID = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");
                                var quote_url = "" + shareQuoteLink + "" + TRAVEL_UNIQUE_QUOTE_ID + "&lob=4";


                                imauticBuy('', TRAVEL_UNIQUE_QUOTE_ID, quote_url, messageIDVar, 'BuyClicked');
                            }
                        }
                    }
                } */

                //		$rootScope.loading = true;
                /*$location.path('/buyTravel');*/
                getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.productDataReader, buyScreenParam, function(buyScreen) {
                    if (buyScreen.responseCode == $scope.globalLabel.responseCode.success) {
                        //console.log('buyScreen.data'+JSON.stringify(buyScreen.data));
                        localStorageService.set("buyScreen", buyScreen.data);
                        buyScreenParam.documentType = "TravelPlan";
                        /*var occupationDocId = $scope.globalLabel.documentType.travelOccupation + "-" + selectedProduct.carrierId + "-" + selectedProduct.productId;	
                        	getDocUsingId(RestAPI, occupationDocId, function(occupationList){
                        		localStorageService.set("travelBuyOccupationList", occupationList);*/
                        /*	getListFromDB(RestAPI, "", $scope.globalLabel.documentType.travelCarrier, $scope.globalLabel.request.findAppConfig, function(carrierList){
                        		if(carrierList.responseCode == $scope.globalLabel.responseCode.success){
                        			localStorageService.set("carrierList", carrierList.data);*/
                        var docId = $scope.globalLabel.documentType.buyScreen + "-" + localStorageService.get("selectedBusinessLineId");
                        getDocUsingId(RestAPI, docId, function(buyScreenTooltip) {
                            localStorageService.set("buyScreenTooltip", buyScreenTooltip.toolTips);
                            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                                if (String($location.search().leaddetails) != $scope.globalLabel.errorMessage.undefinedError) {
                                    var leaddetails = JSON.parse($location.search().leaddetails);
                                    localStorageService.set("quoteUserInfo", leaddetails);
                                }


                                $location.path('/buyTravel').search({ quoteId: localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"), carrierId: selectedProduct.carrierId, productId: selectedProduct.productId, lob: localStorageService.get("selectedBusinessLineId") });
                            } else {
                                $location.path('/buyTravel');
                            }
                        });
                        /*}else{
								$rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
							}
						});*/
                        /*});*/
                        //});
                    } else {
                        $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
                    }
                });
            };
        }
    ]);