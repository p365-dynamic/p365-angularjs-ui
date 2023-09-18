/*
 * Description	: This file is responsible for capture all the details from entire profession wise Journey.
 * Author		: Akash Kumawat
 * Date			: 08-Jan-2019
 *
 * */
'use strict';
angular.module('professionalJourneyResult', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages', 'nzTour'])
    .controller('professionalJourneyResultController', ['nzTour', 'RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', '$controller', '$filter',
        function(nzTour, RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce, $controller, $filter) {
            $scope.openMenu = function($mdMenu, ev) {
                $mdMenu.open(ev);
            }

            $scope.declaration = function() {

                /*All the required objects & variable declaration starts here
                 * ex. $scope.intiLoad = true;
                 * 	   $scope.profession = {} ;
                 * */

                $scope.p365Labels = commonResultLabels;
                $scope.authenticate = {};
                $scope.carVehicleInfo = {};
                $scope.bikeVehicleInfo = {};
                $scope.addressDetails = {};
                $scope.isChartReady = false;
                $scope.showDesc = false;
                $rootScope.isFromProfessionalJourney = false;
                $rootScope.loading = false;    
                // $scope.riskAndInsuranceProfilePopup = false;
                $scope.riskDescSection = wp_path + 'buy/common/html/RiskDescription.html';
                $scope.carPremiumTemplate = wp_path + "buy/common/html/garageModal.html";
                $scope.bikePremiumTemplate = wp_path + "buy/common/html/bikePremiumTemplate.html";
                $scope.healthPremiumTemplate = wp_path + "buy/common/html/healthPremiumTemplate.html";
                $scope.lifePremiumTemplate = wp_path + "buy/common/html/lifePremiumTemplate.html";
                $scope.healthFeaturesTemplate = wp_path + "buy/common/html/featureBenefitsHealth.html";
                $scope.lifeFeaturesTemplate = wp_path + "buy/common/html/featureBenefitsLife.html";
                $rootScope.headerNavigation = wp_path + 'buy/common/html/headerNavigationPHP.html';
                $scope.insuranceAssessmentHTML = wp_path + 'buy/common/html/insuranceAssessment.html';


                /*All the required variable declaration ends here*/

                /*All the required simple & generic array declaration starts here
                 * ex. $scope.professionList = [];
                 * */

                /*All the required simple & generic array  declaration ends here*/
            }

            if (localStorageService.get("quoteUserInfo")) 
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");

            
            $scope.addToCart = function() {
                $location.path('/PBCarResult');
            }

            var tourConfig = {
                config: {
                    disableInteraction: true,
                    animationDuration: 300,
                }, // see config
                steps: [{
                        target: '#editProfile',
                        placementPriority: 'bottom',
                        content: 'You can edit your profile here',
                    }, {
                        target: '#riskProfile',
                        placementPriority: 'bottom',
                        content: 'This is your <span class="pinkFont">Risk Profile</span>. Your inputs and 42+  <br/>data points were analyzed to create this. <br/>Click to view 8 key risks for you.',
                    }, {
                        target: '#insuranceAssesment',
                        content: 'This is your <span class="pinkFont">Insurance Profile</span>. Your inputs, risk profile and <br/>42+  data points were analyzed to create this. <br/>Atleast have <span class="pinkFont">"Minimum"</span> coverage. <br/><span class="pinkFont">"Recommended"</span> is the way to go.',
                    }, {
                        target: '#viewMore',
                        content: 'Buying insurance can be very confusing. We have done all the hard<br/> work by analyzing over 20 data point from your profile, product<br/> features, price, claims and service to recommend the<br/> best product. You can click on <br/><span class="pinkFont">"View More Quotes"</span> to see all options.',
                    },
                    {
                        target: '#bestValue',
                        content: 'Best price guaranteed as Insurance regulations guides same<br/> price across all websites. If you find any price difference.<br/> call us at <span class="pinkFont">(022)68284343</span>',
                    }
                ]
            }
            // $scope.startTour = function() {
            //     nzTour.start(tourConfig).then(function() {})
            //         .catch(function() {});
            // }
            $scope.minimumFlag = true;
            $scope.toggleMinimum = function() {
                $scope.minimumFlag = !$scope.minimumFlag;
            }
            $scope.recommendedFlag = true;
            $scope.toggleRecommended = function() {
                $scope.recommendedFlag = !$scope.recommendedFlag;
            }
            $scope.comprehensiveFlag = true;
            $scope.toggleComprehensive = function() {
                $scope.comprehensiveFlag = !$scope.comprehensiveFlag;
            }

            /*Chart related Function Starts here*/

            $scope.plotChart = function(_chartType, _chartTitle, _xAxisTitles, _yAxisTitle, _data) {
                if (_chartType.toLowerCase() == 'bar') {
                    $scope.chartTitle = _chartTitle;
                    $scope.xaxis = _xAxisTitles;
                    $scope.yAxisTitle = _yAxisTitle;
                    $scope.chartType = _chartType;
                    $scope.items = _data;
                    $scope.isChartReady = true;
                } else if (_chartType.toLowerCase() == 'pie') {
                    $scope.chartTitle = _chartTitle;
                    $scope.dataItems = _data;
                    $scope.isChartReady = true;
                }
            }

            $scope.hideRiskChartModal = function() {
                $scope.riskChartModal = false;
            }

            $scope.hideInsuranceAssessChartModal = function() {
                $scope.insuranceAssessChartModal = false;
            }

            $scope.showRiskChartModal = function() {
                $scope.riskChartModal = true;
                $scope.isChartReady = false;
                $scope.plotChart("pie", "", $scope.risk_xAxisTitles, $scope.risk_legends, $scope.risk_series);

            }

            $scope.showInsuranceAssessChartModal = function() {
                $scope.insuranceAssessChartModal = true;
            }

            $scope.makeInsuranceAssessmentBlocksReady = function(_insuranceAssessmentResponse) {
                if (_insuranceAssessmentResponse != null && _insuranceAssessmentResponse != undefined && _insuranceAssessmentResponse != "") {

                    for (let index = 0; index < _insuranceAssessmentResponse.length; index++) {
                        if (_insuranceAssessmentResponse[index].insuranceLabel == "Health") {
                            _insuranceAssessmentResponse[index].displayOrder = 1;
                        } else if (_insuranceAssessmentResponse[index].insuranceLabel == "Life") {
                            _insuranceAssessmentResponse[index].displayOrder = 2;
                        } else if (_insuranceAssessmentResponse[index].insuranceLabel == "Car") {
                            _insuranceAssessmentResponse[index].displayOrder = 3;
                        } else if (_insuranceAssessmentResponse[index].insuranceLabel == "Bike") {
                            _insuranceAssessmentResponse[index].displayOrder = 4;
                        } else if (_insuranceAssessmentResponse[index].insuranceLabel == "Retirement") {
                            _insuranceAssessmentResponse[index].displayOrder = 5;
                        } else if (_insuranceAssessmentResponse[index].insuranceLabel == "Critical Illness") {
                            _insuranceAssessmentResponse[index].displayOrder = 6;
                        } else {
                            _insuranceAssessmentResponse[index].displayOrder = 7;
                        }
                        if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "veryLow") {
                            _insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Very Low";
                        } else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "veryHigh") {
                            _insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Very High";
                        } else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "medium") {
                            _insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Medium";
                        } else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "high") {
                            _insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "High";
                        } else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "low") {
                            _insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Low";
                        }
                    }
                    $scope.insuranceAssessmentRes = _insuranceAssessmentResponse;
                } else if (_insuranceAssessmentResponse == null) {
                    console.error("Unable to make insurance assessment chart ready caused by _insuranceAssessmentResponse is null");
                } else if (_insuranceAssessmentResponse == "") {
                    console.error("Unable to make insurance assessment chart ready caused by _insuranceAssessmentResponse is empty");
                } else if (_insuranceAssessmentResponse == undefined) {
                    console.error("Unable to make insurance assessment chart ready caused by _insuranceAssessmentResponse is undefined");
                }
            }


            $scope.makeRiskProfileChartReady = function(_riskProfileResponse) {
                if (_riskProfileResponse != null && _riskProfileResponse != undefined && _riskProfileResponse != "") {
                    var _length_one = _riskProfileResponse.length;
                    var legends = new Array(_length_one);
                    var _series = new Array(_length_one);
                    var _collectedData = [];
                    for (let index = 0; index < _length_one; index++) {
                        const element = _riskProfileResponse[index];
                        legends[index] = element.name;
                        var _length_tow = element.applicableRisk.length;
                        var _xAxisTitles = new Array(_length_tow);
                        var _data = new Array(_length_tow);
                        for (let j = 0; j < _length_tow; j++) {
                            const element_two = element.applicableRisk[j];
                            var _dataElement = {};
                            _xAxisTitles[j] = element_two.riskLabel;
                            _dataElement.name = element_two.riskLabel;
                            _dataElement.y = element_two.riskValue;
                            if (element_two.riskCat == "veryLow") {
                                _dataElement.riskPriority = "Very Low";
                            } else if (element_two.riskCat == "veryHigh") {
                                _dataElement.riskPriority = "Very High";
                            } else if (element_two.riskCat == "high") {
                                _dataElement.riskPriority = "High";
                            } else if (element_two.riskCat == "low") {
                                _dataElement.riskPriority = "Low";
                            } else if (element_two.riskCat == "medium") {
                                _dataElement.riskPriority = "Medium";
                            }
                            _collectedData.push(_dataElement);
                        }
                    }
                    _series = _collectedData;
                    $scope.risk_xAxisTitles = _xAxisTitles;
                    $scope.risk_series = _series;
                    $scope.risk_legends = legends;
                    $scope.plotChart("pie", "", _xAxisTitles, "", _series);
                } else if (_riskProfileResponse == null) {
                    console.error("Unable to make risk profile chart ready caused by _riskProfileResponse is null");
                } else if (_riskProfileResponse == "") {
                    console.error("Unable to make risk profile chart ready caused by _riskProfileResponse is empty");
                } else if (_riskProfileResponse == undefined) {
                    console.error("Unable to make risk profile chart ready caused by _riskProfileResponse is undefined");
                }
            }

            $scope.findRecommendedRiders = function(_ridersList) {
                if (_ridersList) {
                    let len = _ridersList.length;
                    for (let index = 0; index < len; index++) {
                        const element = _ridersList[index];
                        if (element.lob.toUpperCase() == "CAR") {
                            $scope.recommendedCarRiders = [];
                            for (var i = 0; i < element.riders.length; i++) {
                                if (element.riders[i].riderCategory == "Recommended") {
                                    $scope.recommendedCarRiders.push(element.riders[i]);
                                }
                            }
                        } else if (element.lob.toUpperCase() == "BIKE") {
                            $scope.recommendedBikeRiders = [];
                            for (var i = 0; i < element.riders.length; i++) {
                                if (element.riders[i].riderCategory == "Recommended") {
                                    $scope.recommendedBikeRiders.push(element.riders[i]);
                                }
                            }
                        } else if (element.lob.toUpperCase() == "LIFE") {
                            $scope.recommendedLifeRiders = [];
                            for (var i = 0; i < element.riders.length; i++) {
                                if (element.riders[i].riderCategory == "Recommended") {
                                    $scope.recommendedLifeRiders.push(element.riders[i]);
                                }
                            }
                        } else if (element.lob.toUpperCase() == "HEALTH") {
                            $scope.recommendedHealthRiders = [];
                            for (var i = 0; i < element.riders.length; i++) {
                                if (element.riders[i].riderCategory == "Recommended") {
                                    $scope.recommendedHealthRiders.push(element.riders[i]);
                                }
                            }
                            localStorageService.set("healthRecommendedRiders", $scope.recommendedHealthRiders);
                        }
                    }
                }
            }

            /*Chart Related Function Ends here*/

            //filter for best premium
            $scope.customFilterCar = function(fromJourney) {
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
                    if(!$rootScope.carQuoteResult[i].netPremiumMean){
                        $rootScope.carQuoteResult[i].netPremiumMean = 3.5; 
                    }
                    $rootScope.carQuoteResult[i].proffesionalRating = ($rootScope.carQuoteResult[i].netPremiumMean * 0.3) +
                        ($rootScope.carQuoteResult[i].garageIndex * 0.2) +
                        ($rootScope.carQuoteResult[i].claimIndex * 0.2) +
                        ($rootScope.carQuoteResult[i].insurerIndex * 0.3);
                    $rootScope.carQuoteResult[i].proffesionalRating = $rootScope.carQuoteResult[i].proffesionalRating;
         
                    if (fromJourney == true) {
                        if ($rootScope.carQuoteResult[i].proffesionalRating > $scope.proffesionalRatingCar) {
                            $scope.proffesionalRatingCar = $rootScope.carQuoteResult[i].proffesionalRating;
                            $scope.professionalResultCar = $rootScope.carQuoteResult[i];
                            localStorageService.set("carProductToBeAddedInCart", $scope.professionalResultCar);
                        }else{
                            if($rootScope.carQuoteResult[i].proffesionalRating)
                            $scope.proffesionalRatingCar = $rootScope.carQuoteResult[i].proffesionalRating;
                            else{
                                $scope.proffesionalRatingCar = "3.5";  
                            }
                            $scope.professionalResultCar = $rootScope.carQuoteResult[0];
                            localStorageService.set("carProductToBeAddedInCart", $scope.professionalResultCar);
                        }
                    }
                }
            }

            //filter for best premium
            $scope.customFilterBike = function(fromJourney) {
                $scope.netPremiumTotalBike = 0;
                $scope.netPremiumAverageBike = 0;
                $scope.netPremiumMaxBike = 0;
                $scope.proffesionalRatingBike = 0;
                for (var i = 0; i < $rootScope.bikeQuoteResult.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalBike += $rootScope.bikeQuoteResult[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageBike = Number(($scope.netPremiumTotalBike / $rootScope.bikeQuoteResult.length).toFixed(5));
                }
                for (var i = 0; i < $scope.bikeQuoteResult.length; i++) {
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
                    $rootScope.bikeQuoteResult[i].proffesionalRating = $rootScope.bikeQuoteResult[i].proffesionalRating;
                    if (fromJourney == true) {
                        if ($rootScope.bikeQuoteResult[i].proffesionalRating > $scope.proffesionalRatingBike) {
                            $scope.proffesionalRatingBike = $rootScope.bikeQuoteResult[i].proffesionalRating;
                            $scope.professionalResultBike = $rootScope.bikeQuoteResult[i];
                            localStorageService.set("bikeProductToBeAddedInCart", $scope.professionalResultBike);
                        }
                    }
                }
            }

            //filter for best premium
            $scope.customFilterLife = function(fromJourney) {
                $scope.netPremiumTotalLife = 0;
                $scope.netPremiumAverageLife = 0;
                $scope.netPremiumMaxLife = 0;
                $scope.proffesionalRatingLife = 0;

                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalLife += $rootScope.lifeQuoteResult[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageLife = Number(($scope.netPremiumTotalLife / $rootScope.lifeQuoteResult.length).toFixed(5));
                }
                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    $rootScope.lifeQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageLife / $rootScope.lifeQuoteResult[i].premiumRatio).toFixed(5));
                    if ($rootScope.lifeQuoteResult[i].netPremiumMax > $scope.netPremiumMaxLife) {
                        $scope.netPremiumMaxLife = $rootScope.lifeQuoteResult[i].netPremiumMax;
                    }
                }
                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    $rootScope.lifeQuoteResult[i].netPremiumMean = Number((($rootScope.lifeQuoteResult[i].netPremiumMax / $scope.netPremiumMaxLife) * 5).toFixed(1));

                    $rootScope.lifeQuoteResult[i].proffesionalRating = ($rootScope.lifeQuoteResult[i].netPremiumMean * 0.4) +
                        ($rootScope.lifeQuoteResult[i].claimIndex * 0.2) +
                        ($rootScope.lifeQuoteResult[i].benefitIndex * 0.2) +
                        ($rootScope.lifeQuoteResult[i].insurerIndex * 0.2);
                    if (fromJourney == true) {
                        if ($rootScope.lifeQuoteResult[i].proffesionalRating > $scope.proffesionalRatingLife) {
                            $scope.proffesionalRatingLife = $rootScope.lifeQuoteResult[i].proffesionalRating;
                            $scope.professionalResultLife = $rootScope.lifeQuoteResult[i];
                            localStorageService.set("lifeProductToBeAddedInCart", $scope.professionalResultLife);
                        }
                    }
                }


            }

            $scope.customFilterCriticalIllness = function() {
                
                                $scope.netPremiumTotalCI = 0;
                                $scope.netPremiumAverageCI = 0;
                                $scope.netPremiumMaxCI = 0;
                                $scope.proffesionalRatingCI = 0;
                
                                for (var i = 0; i < $rootScope.ciQuoteResult.length; i++) {
                                    //Get Total of premium
                                    $scope.netPremiumTotalCI += $rootScope.ciQuoteResult[i].premiumRatio;
                
                                    //Get avg of premium
                                    $scope.netPremiumAverageCI = Number(($scope.netPremiumTotalCI / $rootScope.ciQuoteResult.length).toFixed(5));
                                }
                                for (var i = 0; i < $rootScope.ciQuoteResult.length; i++) {
                                    $rootScope.ciQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageCI / $rootScope.ciQuoteResult[i].premiumRatio).toFixed(5));
                                    if ($rootScope.ciQuoteResult[i].netPremiumMax > $scope.netPremiumMaxCI) {
                                        $scope.netPremiumMaxCI = $rootScope.ciQuoteResult[i].netPremiumMax;
                                    }
                
                                }
                                for (var i = 0; i < $rootScope.ciQuoteResult.length; i++) {
                                    $rootScope.ciQuoteResult[i].netPremiumMean = Number((($rootScope.ciQuoteResult[i].netPremiumMax / $scope.netPremiumMaxCI) * 5).toFixed(1));
                                    $rootScope.ciQuoteResult[i].proffesionalRating = ($rootScope.ciQuoteResult[i].netPremiumMean * 0.4) +
                                        ($rootScope.ciQuoteResult[i].claimIndex * 0.3) +
                                        ($rootScope.ciQuoteResult[i].insurerIndex * 0.3);
                                    
                                }
                                $rootScope.ciQuoteResult = $filter('orderBy')($rootScope.ciQuoteResult, 'proffesionalRating');
                                $rootScope.ciQuoteResult = $rootScope.ciQuoteResult;
                                $scope.sortReverse = true;
                                return true;
                
                            }
            //filter for best premium
            $scope.customFilterHealth = function(fromJourney) {
                $scope.netPremiumTotalHealth = 0;
                $scope.netPremiumAverageHealth = 0;
                $scope.netPremiumMaxHealth = 0;
                $scope.proffesionalRatingHealth = 0;

                for (var i = 0; i < $scope.healthQuoteResult.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalHealth += $scope.healthQuoteResult[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageHealth = Number(($scope.netPremiumTotalHealth / $scope.healthQuoteResult.length).toFixed(5));
                }
                for (var i = 0; i < $scope.healthQuoteResult.length; i++) {
                    $scope.healthQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageHealth / $scope.healthQuoteResult[i].premiumRatio).toFixed(5));
                    if ($scope.healthQuoteResult[i].netPremiumMax > $scope.netPremiumMaxHealth) {
                        $scope.netPremiumMaxHealth = $scope.healthQuoteResult[i].netPremiumMax;
                    }
                }
                for (var i = 0; i < $scope.healthQuoteResult.length; i++) {
                    $scope.healthQuoteResult[i].netPremiumMean = Number((($scope.healthQuoteResult[i].netPremiumMax / $scope.netPremiumMaxHealth) * 5).toFixed(1));
                    $scope.healthQuoteResult[i].proffesionalRating = ($scope.healthQuoteResult[i].netPremiumMean * 0.3) +
                        ($scope.healthQuoteResult[i].hospitalIndex * 0.2) +
                        ($scope.healthQuoteResult[i].benefitIndex * 0.3) +
                        ($scope.healthQuoteResult[i].insurerIndex * 0.2);
                    if (fromJourney == true) {
                        if ($rootScope.healthQuoteResult[i].proffesionalRating > $scope.proffesionalRatingHealth) {
                            $scope.proffesionalRatingHealth = $rootScope.healthQuoteResult[i].proffesionalRating;
                            $scope.professionalResultHealth = $rootScope.healthQuoteResult[i];
                            localStorageService.set("healthProductToBeAddedInCart", $scope.professionalResultHealth);
                        }
                    }
                }

            };


            /*QuoteCalculation Function Starts here*/
            $scope.requestForQuote = function() {
                $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                if ($scope.quoteRequest.commonInfo.age >= 35) {
                    $rootScope.insuredUptoAge = 65;
                } else {
                    $rootScope.insuredUptoAge = $scope.quoteRequest.commonInfo.age + 30;
                }

                RestAPI.invoke("profappmasterservice", $scope.quoteRequest).then(function(callback) {
                    $rootScope.levelTwoQuoteRequests = [];
                    if (callback.responseCode == 1000) {
                        $rootScope.levelTwoQuoteRequests = callback.data[0];
                        var riskProfile = callback.data[1];
                        var insuranceAssessment = callback.data[2];
                        var recommendedRiders = callback.data[3];
                        $scope.makeInsuranceAssessmentBlocksReady(insuranceAssessment);
                        $scope.makeRiskProfileChartReady(riskProfile);
                        $scope.findRecommendedRiders(recommendedRiders);
                        $scope.riskAndInsuranceProfilePopup = true;                                    

                        if (String($rootScope.levelTwoQuoteResults) != "undefined" && $rootScope.levelTwoQuoteResults.length > 0) {
                            $rootScope.levelTwoQuoteResults.length = 0;
                        }
                        $rootScope.levelTwoQuoteResults = [];
                        $scope.isGotCarQuotes = false;
                        $scope.isGotBikeQuotes = false;
                        $scope.isGotHealthQuotes = false;
                        $scope.isGotLifeQuotes = false;
                        $scope.isGotCriticalIllnessQuotes = false;

                        localStorageService.set("PROF_QUOTE_ID", $rootScope.levelTwoQuoteRequests[0].PROF_QUOTE_ID);
                        localStorageService.set("PROF_QUOTE_ID_ENCRYPTED", $rootScope.levelTwoQuoteRequests[0].encryptedProfQuoteId);


                        //added by gauri for mautic application
                        localStorageService.set("PROF_QUOTE_ID_ENCRYPTED", $rootScope.levelTwoQuoteRequests[0].encryptedProfQuoteId);
                        if (imauticAutomation == true) {
                            imatProfessionalLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                        }

                        //sending welcome email to user

                        angular.forEach($rootScope.levelTwoQuoteRequests, function(obj, i) {
                            var request = {};
                            var header = {};

                            header.messageId = messageIDVar;
                            header.campaignID = campaignIDVar;
                            header.source = sourceOrigin;
                            header.transactionName = "profappgetresult";
                            header.deviceId = deviceIdOrigin;
                            request.header = header;
                            request.body = obj;
                            $scope.healthRequestStatus = 0;
                            $scope.lifeRequestStatus = 0;
                            $scope.bikeRequestStatus = 0;
                            $scope.carRequestStatus = 0;
                            $scope.criticalIllnessRequestStatus = 0;
                            // setTimeout(function(){
                            // if (obj.lob.toLowerCase() == "health") {
                            // 	$scope.healthRequestStatus = 0;
                            // } else {
                            // 	$scope.healthRequestStatus = 2;
                            // 	$rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                            // }
                            if (obj.lob.toLowerCase() == "car") {
                                $scope.carRequestStatus = 0;
                            } else {
                                $scope.carRequestStatus = 2;
                                $rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                            }
                            if (obj.lob.toLowerCase() == "bike") {
                                $scope.bikeRequestStatus = 0;
                            } else {
                                $scope.bikeRequestStatus = 2;
                                $rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                            }
                            // if (obj.lob.toLowerCase() == "life") {
                            // 	$scope.lifeRequestStatus = 0;
                            // } else {
                            // 	$scope.lifeRequestStatus = 2;
                            // 	$rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                            // }
                            // },3000);

                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).success(function(callback2, status) {

                                if (obj.lob.toLowerCase() == "life") {
                                    if (callback2.responseCode == 1000 && callback2.businessLineId == 1) {
                                        if (callback2.lifeQuoteRequest) {
                                            $scope.quote = {};
                                            $scope.quoteParam = {};
                                            $scope.personalDetails = {};

                                            $scope.quoteParam = callback2.lifeQuoteRequest.quoteParam;
                                            $scope.personalDetails = callback2.lifeQuoteRequest.personalDetails;

                                            $scope.quote.quoteParam = $scope.quoteParam;
                                            $scope.quote.personalDetails = $scope.personalDetails;
                                            localStorageService.set("lifeQuoteInputParamaters", $scope.quote);
                                            localStorageService.set("lifePersonalDetails", $scope.personalDetails);
                                        }
                                        localStorageService.set("selectedBusinessLineId", 1);
                                        $scope.calculateLifeQuote(callback2, true);
                                        $rootScope.lifeErrorMessage = "";
                                    } else if (callback2.responseCode == $scope.p365Labels.responseCode.error) {
                                        if (callback2.data) {
                                            $rootScope.lifeErrorMessage = callback2.data.msg;
                                            $scope.lifeRequestStatus = 2;
                                        } else {
                                            $rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                            $scope.lifeRequestStatus = 2;
                                        }
                                    } else {
                                        $rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                        $scope.lifeRequestStatus = 2;
                                    }
                                } else if (obj.lob.toLowerCase() == "health") {
                                    if (callback2.responseCode == 1000 && callback2.businessLineId == 4) {
                                        if (callback2.healthQuoteRequest) {
                                            $scope.quote = {};
                                            $scope.quoteParam = {};
                                            $scope.personalInfo = {};

                                            $scope.quote.quoteParam = callback2.healthQuoteRequest.quoteParam;
                                            $scope.quote.personalInfo = callback2.healthQuoteRequest.personalInfo;
                                            $scope.quote.ratingParam = callback2.healthQuoteRequest.ratingParam;
                                            localStorageService.set("healthQuoteInputParamaters", $scope.quote);
                                            localStorageService.set("healthQuoteInputParamatersReset", $scope.quote);
                                            localStorageService.set("ridersHealthStatus", false)
                                        }
                                        localStorageService.set("selectedBusinessLineId", 4);
                                        $scope.calculateHealthQuote(callback2, true);
                                        $rootScope.healthErrorMessage = "";
                                    } else if (callback2.responseCode == $scope.p365Labels.responseCode.error) {
                                        if (callback2.data) {
                                            $rootScope.healthErrorMessage = callback2.data.msg;
                                            $scope.healthRequestStatus = 2;
                                        } else {
                                            $rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                            $scope.healthRequestStatus = 2;
                                        }
                                    } else {
                                        $rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                        $scope.healthRequestStatus = 2;
                                    }
                                } else if (obj.lob.toLowerCase() == "car") {
                                    if (callback2.responseCode == 'P365RES100' && callback2.businessLineId == 3) {
                                        var quoteParamRequest = {};
                                        if (callback2.carQuoteRequest) {
                                            $scope.quote = {};
                                            $scope.quote.quoteParam={};
                                            $scope.vehicleInfo = {};

                                             $scope.quote.quoteParam.ncb = callback2.carQuoteRequest.quoteParam.ncb;
                                             if(callback2.carQuoteRequest.quoteParam.ownedBy)
                                             $scope.quote.quoteParam.ownedBy = callback2.carQuoteRequest.quoteParam.ownedBy;
                                             if(callback2.carQuoteRequest.quoteParam.policyType)
                                             $scope.quote.quoteParam.policyType = callback2.carQuoteRequest.quoteParam.policyType;
                                             if(callback2.carQuoteRequest.quoteParam.riders)
                                             $scope.quote.quoteParam.riders = callback2.carQuoteRequest.quoteParam.riders;
                                            
                                            $scope.quoteParam = $scope.quote.quoteParam;

                                            $scope.CAR_UNIQUE_QUOTE_ID = callback2.carQuoteRequestQUOTE_ID;
                                            $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback2.carQuoteRequest.encryptedQuoteId;
        
                                             if(callback2.carQuoteRequest.vehicleInfo.IDV)
                                             $scope.vehicleInfo.IDV = callback2.carQuoteRequest.vehicleInfo.IDV;
                                             if(callback2.carQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate)
                                             $scope.vehicleInfo.PreviousPolicyExpiryDate = callback2.carQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                             if(callback2.carQuoteRequest.vehicleInfo.RTOCode)
                                             $scope.vehicleInfo.RTOCode = callback2.carQuoteRequest.vehicleInfo.RTOCode;
                                            if(callback2.carQuoteRequest.vehicleInfo.city)
                                             $scope.vehicleInfo.city = callback2.carQuoteRequest.vehicleInfo.city;
                                             if(callback2.carQuoteRequest.vehicleInfo.dateOfRegistration){
                                             $scope.vehicleInfo.dateOfRegistration = callback2.carQuoteRequest.vehicleInfo.dateOfRegistration;
                                             var carRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/"); 
                                            
                                            if(localStorageService.get("selectedCarDetails")){
                                              $scope.carDetails = localStorageService.get("selectedCarDetails");
                                              $scope.carDetails.regYear = carRegistrationYearList[2] ;
                                              localStorageService.set("selectedCarDetails",$scope.carDetails);
                                              }
                                            }
                                             if(callback2.carQuoteRequest.vehicleInfo.idvOption)
                                             $scope.vehicleInfo.idvOption = callback2.carQuoteRequest.vehicleInfo.idvOption;
                                             if(callback2.carQuoteRequest.vehicleInfo.best_quote_id)
                                             $scope.vehicleInfo.best_quote_id = callback2.carQuoteRequest.vehicleInfo.best_quote_id;
                                             if(callback2.carQuoteRequest.vehicleInfo.previousClaim)
                                             $scope.vehicleInfo.previousClaim = callback2.carQuoteRequest.vehicleInfo.previousClaim;
                                             if(callback2.carQuoteRequest.vehicleInfo.registrationNumber)
                                             $scope.vehicleInfo.registrationNumber = callback2.carQuoteRequest.vehicleInfo.registrationNumber;
                                             if(callback2.carQuoteRequest.vehicleInfo.registrationPlace)
                                             $scope.vehicleInfo.registrationPlace = callback2.carQuoteRequest.vehicleInfo.registrationPlace;
                                             if(callback2.carQuoteRequest.vehicleInfo.state)
                                             $scope.vehicleInfo.state = callback2.carQuoteRequest.vehicleInfo.state;
                                            if(callback2.carQuoteRequest.vehicleInfo.make)
                                            $scope.vehicleInfo.make = callback2.carQuoteRequest.vehicleInfo.make;
                                            if(callback2.carQuoteRequest.vehicleInfo.model)
                                             $scope.vehicleInfo.model = callback2.carQuoteRequest.vehicleInfo.model;
                                             if(callback2.carQuoteRequest.vehicleInfo.variant)
                                             $scope.vehicleInfo.variant = callback2.carQuoteRequest.vehicleInfo.variant.toString();
                                             if(callback2.carQuoteRequest.vehicleInfo.fuel)
                                             $scope.vehicleInfo.fuel = callback2.carQuoteRequest.vehicleInfo.fuel;
                                             if(callback2.carQuoteRequest.vehicleInfo.cubicCapacity)
                                             $scope.vehicleInfo.cubicCapacity = callback2.carQuoteRequest.vehicleInfo.cubicCapacity;
                                            //$scope.CarPACoverDetails = {};
                                            //$scope.quoteParam = callback2.carQuoteRequest.quoteParam;
                                            //$scope.vehicleInfo = callback2.carQuoteRequest.vehicleInfo;
                                            //$scope.CarPACoverDetails = callback2.carQuoteRequest.PACoverDetails;
                                            //$scope.quote.quoteParam = $scope.quoteParam;
                                            //$scope.quote.vehicleInfo = $scope.vehicleInfo;
                                            localStorageService.set("carQuoteInputParamaters", $scope.quote);
                                 
                                        }
                                        localStorageService.set("selectedBusinessLineId", 3);
                                        $scope.calculateCarQuote(callback2, true);
                                        $rootScope.carErrorMessage = "";
                                    } else if (callback2.responseCode == $scope.p365Labels.responseCode.error) {
                                        if (callback2.data) {
                                            $rootScope.carErrorMessage = callback2.data.msg;
                                            $scope.carRequestStatus = 2;
                                        } else {
                                            $rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                            $scope.carRequestStatus = 2;
                                        }
                                    } else {
                                        $rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        $scope.carRequestStatus = 2;
                                    }
                                } else if (obj.lob.toLowerCase() == "bike") {
                                    if (callback2.responseCode == 'P365RES100' && callback2.businessLineId == 2) {
                                        if (callback2.bikeQuoteRequest) {
                                            $scope.quote = {};
                                            $scope.quote.vehicleInfo={};
                                            $scope.quote.quoteParam={};
                                           
                                            $scope.quote.vehicleInfo.IDV = callback2.bikeQuoteRequest.vehicleInfo.IDV;
                                            $scope.quote.vehicleInfo.PreviousPolicyExpiryDate = callback2.bikeQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                            $scope.quote.vehicleInfo.TPPolicyExpiryDate = callback2.bikeQuoteRequest.vehicleInfo.TPPolicyExpiryDate;
                                            $scope.quote.vehicleInfo.ODPolicyExpiryDate = callback2.bikeQuoteRequest.vehicleInfo.ODPolicyExpiryDate;
                                            $scope.quote.vehicleInfo.RTOCode = callback2.bikeQuoteRequest.vehicleInfo.RTOCode;
                                            $scope.quote.vehicleInfo.city = callback2.bikeQuoteRequest.vehicleInfo.city;
                                            if(callback2.bikeQuoteRequest.vehicleInfo.dateOfRegistration){
                                                $scope.quote.vehicleInfo.dateOfRegistration = callback2.bikeQuoteRequest.vehicleInfo.dateOfRegistration;
                                                var bikeRegistrationYearList = $scope.quote.vehicleInfo.dateOfRegistration.split("/"); 
                                               
                                               if(localStorageService.get("selectedBikeDetails")){
                                                $scope.bikeDetails = localStorageService.get("selectedBikeDetails");
                                                $scope.bikeDetails.regYear = bikeRegistrationYearList[2] ;
                                                localStorageService.set("selectedBikeDetails",$scope.bikeDetails);
                                              }
                                            }
                                           $scope.quote.vehicleInfo.idvOption = callback2.bikeQuoteRequest.vehicleInfo.idvOption;
                                           $scope.quote.vehicleInfo.best_quote_id = callback2.bikeQuoteRequest.vehicleInfo.best_quote_id;
                                           $scope.quote.vehicleInfo.previousClaim = callback2.bikeQuoteRequest.vehicleInfo.previousClaim;
                                           $scope.quote.vehicleInfo.registrationNumber = callback2.bikeQuoteRequest.vehicleInfo.registrationNumber;
                                           $scope.quote.vehicleInfo.registrationPlace = callback2.bikeQuoteRequest.vehicleInfo.registrationPlace;
                                           $scope.quote.vehicleInfo.state = callback2.bikeQuoteRequest.vehicleInfo.state;
                                           $scope.quote.vehicleInfo.make = callback2.bikeQuoteRequest.vehicleInfo.make;
                                           $scope.quote.vehicleInfo.model = callback2.bikeQuoteRequest.vehicleInfo.model;
                                           $scope.quote.vehicleInfo.variant = callback2.bikeQuoteRequest.vehicleInfo.variant.toString();
                                           
                                           $scope.quote.quoteParam.ncb = callback2.bikeQuoteRequest.quoteParam.ncb;
                                           $scope.quote.quoteParam.ownedBy = callback2.bikeQuoteRequest.quoteParam.ownedBy;
                                           $scope.quote.quoteParam.policyType = callback2.bikeQuoteRequest.quoteParam.policyType;
                                           if(callback2.bikeQuoteRequest.quoteParam.riders){
                                           $scope.quote.quoteParam.riders = callback2.bikeQuoteRequest.quoteParam.riders;
                                           } 
                                           //$scope.BikePACoverDetails = {};
                                            //$scope.quoteParam = callback2.bikeQuoteRequest.quoteParam;
                                            //$scope.vehicleInfo = callback2.bikeQuoteRequest.vehicleInfo;
                                           // $scope.BikePACoverDetails = callback2.bikeQuoteRequest.PACoverDetails;
                                            //$scope.quote.quoteParam = $scope.quoteParam;
                                            //$scope.quote.vehicleInfo = $scope.vehicleInfo;
                                            localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
                                           // localStorageService.set("BikePACoverDetails", $scope.BikePACoverDetails);
                                        }
                                        localStorageService.set("selectedBusinessLineId", 2);
                                        $scope.calculateBikeQuote(callback2, true);
                                        $rootScope.bikeErrorMessage = "";
                                    } else if (callback2.responseCode == $scope.p365Labels.responseCode.error) {
                                        if (callback2.data) {
                                            $rootScope.bikeErrorMessage = callback2.data.msg;
                                            $scope.bikeRequestStatus = 2;
                                        } else {
                                            $rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                            $scope.bikeRequestStatus = 2;
                                        }
                                    } else {
                                        $rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        $scope.bikeRequestStatus = 2;
                                    }
                                } else if (obj.lob.toLowerCase() == "criticalillness") {
                                    if (callback2.responseCode == 1000 && callback2.businessLineId == 6) {
                                        if (callback2.criticalIllnessQuoteRequest) {
                                            $scope.quote = {};
                                            $scope.quoteParam = {};
                                            $scope.personalDetails = {};

                                            $scope.quoteParam = callback2.criticalIllnessQuoteRequest.quoteParam;
                                            $scope.personalDetails = callback2.criticalIllnessQuoteRequest.personalDetails;

                                            $scope.quote.quoteParam = $scope.quoteParam;
                                            $scope.quote.personalDetails = $scope.personalDetails;
                                            localStorageService.set("criticalIllnessQuoteInputParamaters", $scope.quote);
                                            localStorageService.set("criticalIllnessPersonalDetails", $scope.personalDetails);
                                        }
                                        localStorageService.set("selectedBusinessLineId", 6);
                                       
                                        $scope.calculateCriticalIllnessQuote(callback2, true);
                                        $rootScope.criticalIllnessErrorMessage = "";
                                    } else if (callback2.responseCode == $scope.p365Labels.responseCode.error) {
                                        if (callback2.data) {
                                            $rootScope.criticalIllnessErrorMessage = callback2.data.msg;
                                            $scope.criticalIllnessRequestStatus = 2;
                                        } else {
                                            $rootScope.criticalIllnessErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedCIErrMsg);
                                            $scope.criticalIllnessRequestStatus = 2;
                                        }
                                    } else {
                                        $rootScope.criticalIllnessErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedCIErrMsg);
                                        $scope.criticalIllnessRequestStatus = 2;
                                    }
                                }
                            });
                        });
                    } else {
                        console.error("failure callback : ", callback);
                    }
                });

                $scope.updateCarAnnualPremiumRange = function(minPremiumValue, maxPremiumValue) {
                    if (minPremiumValue > maxPremiumValue) {
                        $rootScope.minAnnualPremium = maxPremiumValue;
                        $rootScope.maxAnnualPremium = minPremiumValue;
                    } else {
                        $rootScope.minAnnualPremium = minPremiumValue;
                        $rootScope.maxAnnualPremium = maxPremiumValue;
                    }
                };

                $scope.carErrorMessage = function(errorMsg) {
                    if ($scope.errorRespCounter && (String($rootScope.carQuoteResult) == "undefined" || $rootScope.carQuoteResult.length == 0)) {
                        $scope.errorRespCounter = false;
                        $scope.updateCarAnnualPremiumRange(1000, 5000);
                        $rootScope.instantQuoteSummaryStatus = false;
                        $rootScope.instantQuoteSummaryError = errorMsg;
                        $rootScope.viewOptionDisabled = true;
                        $rootScope.tabSelectionStatus = true;
                        $scope.instantQuoteCarForm = false;
                        $rootScope.disableCarRegPopup = false;
                    } else if ($rootScope.carQuoteResult.length > 0) {
                        $rootScope.instantQuoteSummaryStatus = true;
                        $rootScope.viewOptionDisabled = false;
                        $rootScope.tabSelectionStatus = true;
                        $scope.instantQuoteCarForm = false;
                        $rootScope.disableCarRegPopup = false;
                    }
                    $rootScope.loading = false;
                };



                // Preparing tooltip to be displayed on instant quote screen.
                $scope.carTooltipPrepare = function(carResult) {
                    var riderCount = 0;

                    // if ($rootScope.tooltipContent) {
                    // 	$rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
                    // 	$rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
                    // }
                    var i;
                    var resultCarrierId = [];
                    var testCarrierId = [];

                    for (i = 0; i < carResult.length; i++) {
                        //push only net premium if greater than 0
                        if (Number(carResult[i].netPremium) > 0) {
                            var carrierInfo = {};
                            carrierInfo.id = carResult[i].carrierId;
                            carrierInfo.name = carResult[i].insuranceCompany;
                            /*carrierInfo.annualPremium = carResult[i].grossPremium;*/
                            carrierInfo.annualPremium = carResult[i].netPremium;
                            carrierInfo.claimsRating = carResult[i].insurerIndex;
                            if ($rootScope.wordPressEnabled) {
                                carrierInfo.insuredDeclareValue = carResult[i].insuredDeclareValue;
                                carrierInfo.businessLineId = "2";
                            }
                            if (p365Includes(testCarrierId, carResult[i].carrierId) == false) {
                                resultCarrierId.push(carrierInfo);
                                testCarrierId.push(carResult[i].carrierId);
                            }
                        }
                    }

                    $rootScope.resultedCarriers = resultCarrierId;
                    $rootScope.resultCarrierId = resultCarrierId;
                    // if ($rootScope.tooltipContent)
                    // 	$rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
                    $rootScope.calculatedQuotesLength = (String(carResult.length)).length == 2 ? String(carResult.length) : ("0" + String(carResult.length));
                    $rootScope.calculatedRidersLength = (String(riderCount)).length == 2 ? String(riderCount) : ("0" + String(riderCount));

                };

                // Processing of quote result to displayed on UI.
                $scope.processCarResult = function() {
                    $rootScope.viewOptionDisabled = false;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.modalShown = false;
                    //$rootScope.carQuoteResult = $filter('orderBy')($rootScope.carQuoteResult, 'grossPremium');
                    $rootScope.carQuoteResultCopy = $rootScope.carQuoteResult;
                    var minAnnualPremiumValue = $rootScope.carQuoteResult[0].grossPremium;
                    var annualPremiumSliderArray = [];

                    for (var j = 0; j < $rootScope.carQuoteResult.length; j++) {
                        var calculatedDiscAmt = 0;
                        var discountAmtList = $rootScope.carQuoteResult[j].discountDetails;
                        if (String(discountAmtList) != "undefined") {
                            for (var i = 0; i < discountAmtList.length; i++) {
                                calculatedDiscAmt += discountAmtList[i]["com.sutrr.quote.carquotecalc.DiscountDetails"].discountAmount;
                            }
                            calculatedDiscAmt += $rootScope.carQuoteResult[j].grossPremium;
                            annualPremiumSliderArray.push(calculatedDiscAmt);
                        } else {
                            annualPremiumSliderArray.push($rootScope.carQuoteResult[j].grossPremium);
                        }
                    }

                    annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
                    $scope.updateCarAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);
                    $scope.isGotCarQuotes = true;
                    if (localStorageService.get("updateProdcutInCartFlag")) {
                        //load result based on premium calulation
                        $scope.customFilterCar(true);
                        //localStorageService.set("carProductToBeAddedInCart", $rootScope.carQuoteResult[0]);
                    }
                    if (localStorageService.get("carProductToBeAddedInCart")) {
                        $scope.carProductToBeAddedInCart = localStorageService.get("carProductToBeAddedInCart");
                        if (localStorageService.get("carDetailsToBeAddedInCart")) {
                            $scope.carDetails = localStorageService.get("carDetailsToBeAddedInCart");
                            localStorageService.set("selectedCarDetails", $scope.carDetails);
                        }
                    }
                    //localStorageService.set("carQuoteCalculationResult", $rootScope.carQuoteResult);
                    if (localStorageService.get("selectedBusinessLineId") == 3) {
                        $scope.carTooltipPrepare($rootScope.carQuoteResult);
                    }
                };

                $scope.calculateCarQuote = function(carQuoteResult, quoteIdStatus) {
                    $rootScope.carQuoteRequest = [];
                    $rootScope.carQuoteResult = [];
                    $rootScope.carQuoteResultCopy = [];

                    //For Reset
                    $scope.dataLoaded = false;
                    if (carQuoteResult.responseCode == $scope.p365Labels.responseCode.success1) {
                        $rootScope.carQuoteResult = [];
                        $scope.dataLoaded = true;
                        $scope.carResponseCodeList = [];
                        $rootScope.carQuoteRequest = carQuoteResult.data;
                        $scope.carRequestId = carQuoteResult.QUOTE_ID;
                        if (quoteIdStatus) {
                            localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.carRequestId);
                        }
                        if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0) {
                            $rootScope.carQuoteResult.length = 0;
                        }
                        angular.forEach($rootScope.carQuoteRequest, function(obj, i) {
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
                            success(function(callback, status) {
                                var carQuoteResponse = JSON.parse(callback);
                                if (carQuoteResponse.QUOTE_ID == $scope.carRequestId)
                                    $scope.carResponseCodeList.push(carQuoteResponse.responseCode);
                                if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {

                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                        if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
                                            $rootScope.carQuoteResult.push(carQuoteResponse.data.quotes[0]);

                                            $rootScope.carQuoteRequest[i].status = 1;
                                        }
                                    }
                                    $scope.processCarResult();
                                } else if (carQuoteResponse.responseCode == 1011) {
                                    $scope.carResponseCodeList.push(carQuoteResponse.responseCode);
                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                        if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
                                            $rootScope.carQuoteRequest[i].status = 2;
                                            if (carQuoteResponse.invalidRiderMessage) {
                                                $scope.invalidPlanOption = carQuoteResponse.invalidRiderMessage;
                                                $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml("<div>We did not get quote from the Insurer. It may be because</b></div><br/><ul class=errorUL><li class=errorPlacementLeft>{{invalidPlanOption}}</li></div>");
                                            } else {
                                                $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                            }
                                        }
                                    }
                                    $scope.processCarResult();
                                } else {
                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                        if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
                                            $rootScope.carQuoteRequest[i].status = 2;
                                            //$rootScope.carQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                            //comments updated based on Uday										
                                            $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        }
                                    }
                                }
                            }).
                            error(function(data, status) {
                                $scope.carResponseCodeList.push($scope.p365Labels.responseCode.systemError);
                            });
                        });

                        $scope.carRequestStatus = 0;
                        $scope.$watch('carResponseCodeList', function(newValue, oldValue, scope) {
                            if ($scope.carResponseCodeList.length == $rootScope.carQuoteRequest.length) {
                                if (p365Includes($scope.carResponseCodeList, $scope.p365Labels.responseCode.success)) {
                                    $rootScope.loading = false;
                                    $scope.carRequestStatus = 1;
                                } else if (p365Includes($scope.carResponseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                                    $rootScope.loading = false;
                                    $scope.carRequestStatus = 2;
                                    $rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                } else {
                                    $rootScope.loading = false;
                                    $scope.carRequestStatus = 2;
                                    $rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                }
                            }
                        }, true);
                    } else {
                        $scope.carResponseCodeList = [];
                        if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0)
                            $rootScope.carQuoteResult.length = 0;

                        $rootScope.carQuoteResult = [];
                    }
                };

                /*functions for car ends*/
                /*function for health quote calculation*/
                $scope.calculateHealthQuote = function(healthQuoteResult, quoteIdStatus) {

                    $rootScope.healthQuoteRequest = [];
                    $rootScope.healthQuoteResult = [];

                    $scope.dataLoaded = false;
                    if (healthQuoteResult.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.healthResponseCodeList = [];
                        $scope.dataLoaded = true;
                        //$scope.slickLoaded=false;
                        $scope.requestId = healthQuoteResult.QUOTE_ID;
                        if (quoteIdStatus) {
                            localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.requestId);
                        }
                        $rootScope.healthQuoteRequest = healthQuoteResult.data;

                        if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0) {
                            $rootScope.healthQuoteResult.length = 0;
                        }

                        angular.forEach($rootScope.healthQuoteRequest, function(obj, i) {
                            var request = {};
                            var header = {};

                            header.messageId = messageIDVar;
                            header.campaignID = campaignIDVar;
                            header.source = sourceOrigin;
                            header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                            header.deviceId = deviceIdOrigin;
                            request.header = header;
                            request.body = obj;

                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                            success(function(callback, status) {
                                var healthQuoteResponse = JSON.parse(callback);
                                if (healthQuoteResponse.QUOTE_ID == $scope.requestId) {
                                    $scope.healthResponseCodeList.push(healthQuoteResponse.responseCode);
                                    if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                        for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                                            if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
                                                if (Number(healthQuoteResponse.data.quotes[0].annualPremium > 0)) {
                                                    $rootScope.healthQuoteResult.push(healthQuoteResponse.data.quotes[0]);
                                                    $scope.processHealthResult();
                                                }
                                                //getAllProductFeatures(healthQuoteResponse.data.quotes[0], true);
                                                $rootScope.healthQuoteRequest[i].status = 1;
                                            }
                                        }
                                        //$scope.processHealthResult();
                                    } else {
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
                            error(function(data, status) {
                                $scope.healthResponseCodeList.push($scope.p365Labels.responseCode.systemError);
                            });
                        });
                        $scope.healthRequestStatus = 0;
                        $scope.$watch('healthResponseCodeList', function(newValue, oldValue, scope) {
                            // if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
                            // 	/*$rootScope.loading = false;*/

                            // 	if ($scope.responseCodeList.length == $rootScope.healthQuoteRequest.length) {
                            // 		/*$rootScope.loading = false;*/

                            // 		for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                            // 			if ($rootScope.healthQuoteRequest[i].status == 0) {
                            // 				$rootScope.healthQuoteRequest[i].status = 2;
                            // 				$scope.healthRequestStatus = 2;
                            // 				$rootScope.healthQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                            // 			}
                            // 		}
                            // 		if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success)) {
                            // 			// This condition will satisfy only when at least one product is found in the quoteResponse array.
                            // 			$scope.healthRequestStatus = 1;
                            // 		} else if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                            // 			//$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
                            // 			$scope.healthRequestStatus = 2;
                            // 		} else {
                            // 			//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
                            // 			$scope.healthRequestStatus = 2;
                            // 		}
                            // 	}

                            if ($scope.healthResponseCodeList.length == $rootScope.healthQuoteRequest.length) {
                                if (p365Includes($scope.healthResponseCodeList, $scope.p365Labels.responseCode.success)) {
                                    $rootScope.loading = false;
                                    $scope.healthRequestStatus = 1;
                                } else if (p365Includes($scope.healthResponseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                                    $rootScope.loading = false;
                                    $scope.healthRequestStatus = 2;
                                    $rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                } else {
                                    $rootScope.loading = false;
                                    $scope.healthRequestStatus = 2;
                                    $rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                }
                            }
                        }, true);
                    } else {
                        $scope.healthResponseCodeList = [];
                        if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0)
                            $rootScope.healthQuoteResult.length = 0;

                        $rootScope.healthQuoteResult = [];
                        //$scope.errorMessage(callback.message);
                    }
                }

                $scope.processHealthResult = function() {
                    $rootScope.viewOptionDisabled = false;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.modalShown = false;
                    $rootScope.loading = false;
                    $scope.isGotHealthQuotes = true;
                    //$rootScope.healthQuoteResult = $filter('orderBy')($rootScope.healthQuoteResult, 'annualPremium');
                    //$rootScope.healthQuoteResult = $rootScope.healthQuoteResult;

                    if (localStorageService.get("updateProdcutInCartFlag")) {
                        $scope.customFilterHealth(true);
                        //localStorageService.set("healthProductToBeAddedInCart", $rootScope.healthQuoteResult[0]);
                    }
                    if (localStorageService.get("healthProductToBeAddedInCart")) {
                        $scope.healthProductToBeAddedInCart = localStorageService.get("healthProductToBeAddedInCart");
                        // if (localStorageService.get("carDetailsToBeAddedInCart")) {
                        // 	$scope.carDetails = localStorageService.get("carDetailsToBeAddedInCart");
                        // 	localStorageService.set("selectedCarDetails", $scope.carDetails);
                        // }
                    }
                    localStorageService.set("healthQuoteCalculationResult", $rootScope.healthQuoteResult);

                };
                /*functions for health ends*/
                /*functions for bike starts*/

                $scope.tooltipBikePrepare = function(bikeResult) {
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


                $scope.processBikeResult = function() {
                    $rootScope.viewOptionDisabled = false;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.modalShown = false;
                    // $rootScope.bikeQuoteResult = $filter('orderBy')($rootScope.bikeQuoteResult, 'grossPremium');
                    $rootScope.bikeQuoteResultCopy = $rootScope.bikeQuoteResult;
                    $scope.isGotBikeQuotes = true;
                    if (localStorageService.get("updateProdcutInCartFlag")) {
                        $scope.customFilterBike(true);
                        //localStorageService.set("bikeProductToBeAddedInCart", $rootScope.bikeQuoteResult[0]);
                    }
                    if (localStorageService.get("bikeProductToBeAddedInCart")) {
                        $scope.bikeProductToBeAddedInCart = localStorageService.get("bikeProductToBeAddedInCart");
                        if (localStorageService.get("bikeDetailsToBeAddedInCart")) {
                            $scope.bikeDetails = localStorageService.get("bikeDetailsToBeAddedInCart");
                            localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
                        }
                    }
                };

                $scope.calculateBikeQuote = function(bikeQuoteResult, quoteIdStatus) {
                    $rootScope.bikeQuoteRequest = [];
                    $rootScope.bikeQuoteResult = [];
                    $rootScope.bikeQuoteResultCopy = [];
                    $scope.dataLoaded = false;

                    if (bikeQuoteResult.responseCode == $scope.p365Labels.responseCode.success1) {
                        $rootScope.loading = false;
                        $scope.bikeResponseCodeList = [];

                        $scope.bikeRequestId = bikeQuoteResult.QUOTE_ID;
                        if (quoteIdStatus) {
                            localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.bikeRequestId);
                        }
                        $rootScope.bikeQuoteRequest = bikeQuoteResult.data;

                        if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0) {
                            $rootScope.bikeQuoteResult.length = 0;
                        }

                        angular.forEach($rootScope.bikeQuoteRequest, function(obj, i) {
                            $scope.dataLoaded = true;
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
                            success(function(callback, status) {
                                var bikeQuoteResponse = JSON.parse(callback);
                                var i;
                                if (bikeQuoteResponse.QUOTE_ID == $scope.bikeRequestId)
                                    $scope.bikeResponseCodeList.push(bikeQuoteResponse.responseCode);
                                if (bikeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
                                    for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
                                        if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
                                            $rootScope.bikeQuoteResult.push(bikeQuoteResponse.data.quotes[0]);
                                            $rootScope.bikeQuoteRequest[i].status = 1;

                                        }
                                    }
                                    $scope.processBikeResult();
                                } else {
                                    for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
                                        if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
                                            $rootScope.bikeQuoteRequest[i].status = 2;
                                            //$rootScope.bikeQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                            $rootScope.bikeQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        }
                                    }
                                }
                            }).
                            error(function(data, status) {
                                $scope.bikeResponseCodeList.push($scope.p365Labels.responseCode.systemError);
                            });
                        });
                        $scope.bikeRequestStatus = 0;
                        $scope.$watch('bikeResponseCodeList', function(newValue, oldValue, scope) {
                            if ($scope.bikeResponseCodeList.length == $rootScope.bikeQuoteRequest.length) {
                                if (p365Includes($scope.bikeResponseCodeList, $scope.p365Labels.responseCode.success)) {
                                    $rootScope.loading = false;
                                    $scope.bikeRequestStatus = 1;
                                } else if (p365Includes($scope.bikeResponseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                                    $rootScope.loading = false;
                                    $scope.bikeRequestStatus = 2;
                                    $rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                } else {
                                    $rootScope.loading = false;
                                    $scope.bikeRequestStatus = 2;
                                    $rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                }
                            }
                        }, true);
                    } else {
                        $scope.bikeResponseCodeList = [];
                        if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0)
                            $rootScope.bikeQuoteResult.length = 0;
                    }

                };
                // setTimeout(function() {
                //     $scope.startTour();
                // }, 500)

                /*functions for bike ends*/
            }

            /*functions for life starts*/

            //function created to display carrier if premium > 0 for health/life.
            $scope.validatePremium = function(data) {
                if (Number(data.basicPremium) > 0) {
                    return true;
                } else {
                    return false;
                }
            };

            function getAllProductFeatures(selectedProduct, productFetchStatus) {
                var variableReplaceArray = [];
                var productFeatureJSON = {};
                var customFeaturesJSON = {};

                $rootScope.consolidatedBenefitsList = [];
                $rootScope.consolidatedSavingsList = [];
                $rootScope.consolidatedFlexibilityList = [];

                productFeatureJSON.documentType = $scope.p365Labels.documentType.lifeProduct;
                productFeatureJSON.carrierId = selectedProduct.carrierId;
                productFeatureJSON.productId = selectedProduct.productId;
                productFeatureJSON.businessLineId = 1;


                var selectedCarrierId = selectedProduct.carrierId;
                var selectedProductId = selectedProduct.productId;

                // for(var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++){
                // 	if(selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
                // 		$scope.brochureUrl = wp_path+$rootScope.carrierDetails.brochureList[i].brochureUrl;
                // }

                variableReplaceArray.push({
                    'id': '{{sumInsured}}',
                    'value': Math.round(selectedProduct.sumInsured)
                });
                variableReplaceArray.push({
                    'id': '{{monthlyPayout}}',
                    'value': selectedProduct.monthlyPayout
                });
                variableReplaceArray.push({
                    'id': '{{policyTerm}}',
                    'value': selectedProduct.policyTerm
                });

                if (productFetchStatus) {
                    RestAPI.invoke($scope.p365Labels.transactionName.getProductFeatures, productFeatureJSON).then(function(callback) {
                        var scopeVariableName = 'productFeaturesList_' + selectedCarrierId + '_' + selectedProductId;
                        var productFeatureJSONName = 'productFeaturesJSON_' + selectedCarrierId + '_' + selectedProductId;

                        $rootScope[productFeatureJSONName] = {};
                        $scope[scopeVariableName] = callback.data[0].Features;
                        for (var i = 0; i < variableReplaceArray.length; i++) {
                            if (p365Includes($scope[scopeVariableName][1].details, variableReplaceArray[i].id)) {
                                $scope[scopeVariableName][1].details = $scope[scopeVariableName][1].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
                            }
                        }
                        for (var i = 0; i < $scope[scopeVariableName].length; i++) {
                            $rootScope[productFeatureJSONName][callback.data[0].Features[i].titleForCompareView] = callback.data[0].Features[i].detailsForCompareView;
                        }
                        selectedProduct.features = $rootScope[productFeatureJSONName];

                        for (var i = 0; i < $scope[scopeVariableName].length; i++) {
                            if ($scope[scopeVariableName][i].featureCategory == "Benefits" && $scope[scopeVariableName][i].compareView == "Y") {
                                if ($rootScope.consolidatedBenefitsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1) {
                                    $rootScope.consolidatedBenefitsList.push($scope[scopeVariableName][i].titleForCompareView);
                                }
                            }
                            if ($scope[scopeVariableName][i].featureCategory == "Savings" && $scope[scopeVariableName][i].compareView == "Y") {
                                if ($rootScope.consolidatedSavingsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1) {
                                    $rootScope.consolidatedSavingsList.push($scope[scopeVariableName][i].titleForCompareView);
                                }
                            }
                            if ($scope[scopeVariableName][i].featureCategory == "Flexibility" && $scope[scopeVariableName][i].compareView == "Y") {
                                if ($rootScope.consolidatedFlexibilityList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1) {
                                    $rootScope.consolidatedFlexibilityList.push($scope[scopeVariableName][i].titleForCompareView);
                                }
                            }
                        }
                    });
                }
            }


            $scope.processLifeResult = function() {
                $rootScope.progressBarStatus = false;
                $rootScope.viewOptionDisabled = false;
                $rootScope.tabSelectionStatus = true;
                $rootScope.loading = false;
                $scope.isGotLifeQuotes = true;

                if (localStorageService.get("updateProdcutInCartFlag")) {
                    $scope.customFilterLife(true);
                }
                if (localStorageService.get("lifeProductToBeAddedInCart")) {
                    $scope.lifeProductToBeAddedInCart = localStorageService.get("lifeProductToBeAddedInCart");
                }
            }


            $scope.calculateLifeQuote = function(lifeQuoteResult, quoteIdStatus) {
                $rootScope.lifeQuoteRequest = [];
                if (lifeQuoteResult.responseCode == $scope.p365Labels.responseCode.success) {
                    $rootScope.loading = false;
                    $scope.dataLoaded = true;
                    $scope.lifeResponseCodeList = [];

                    $scope.lifeRequestId = lifeQuoteResult.QUOTE_ID;
                    if (quoteIdStatus) {
                        localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.lifeRequestId);
                    }
                    $rootScope.lifeQuoteRequest = lifeQuoteResult.data;

                    if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0) {
                        $rootScope.lifeQuoteResult.length = 0;
                    }

                    //for olark
                    angular.forEach($rootScope.lifeQuoteRequest, function(obj, i) {
                        var request = {};
                        var header = {};

                        header.messageId = messageIDVar;
                        header.campaignID = campaignIDVar;
                        header.source = sourceOrigin;
                        header.deviceId = deviceIdOrigin;
                        header.transactionName = $scope.p365Labels.transactionName.lifeQuoteResult;
                        request.header = header;
                        request.body = obj;

                        $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                        success(function(callback, status) {
                            var lifeQuoteResponse = JSON.parse(callback);
                            if (lifeQuoteResponse.QUOTE_ID == $scope.lifeRequestId) {
                                $scope.lifeResponseCodeList.push(lifeQuoteResponse.responseCode);
                                if (lifeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                    lifeQuoteResponse.data.quotes[0].dailyPremium = Math.round(lifeQuoteResponse.data.quotes[0].annualPremium / 365);
                                    lifeQuoteResponse.data.quotes[0].insuranceCompany = JSON.parse(lifeQuoteResponse.data.quotes[0].insuranceCompany);

                                    for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
                                        if ($rootScope.lifeQuoteRequest[i].messageId == lifeQuoteResponse.messageId) {
                                            if (Number(lifeQuoteResponse.data.quotes[0].monthlyBasePremium) > 0) {
                                                $rootScope.lifeQuoteResult.push(lifeQuoteResponse.data.quotes[0]);
                                                $scope.processLifeResult();
                                            }
                                            getAllProductFeatures(lifeQuoteResponse.data.quotes[0], true);
                                            $rootScope.lifeQuoteRequest[i].status = 1;

                                        }
                                    }
                                } else {
                                    for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
                                        if ($rootScope.lifeQuoteRequest[i].messageId == lifeQuoteResponse.messageId) {
                                            $rootScope.lifeQuoteRequest[i].status = 2;
                                            $rootScope.lifeQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                        }
                                    }
                                }
                            }
                        }).
                        error(function(data, status) {
                            $scope.lifeResponseCodeList.push($scope.p365Labels.responseCode.systemError);
                        });
                    });
                    $scope.lifeRequestStatus = 0;
                    $scope.$watch('lifeResponseCodeList', function(newValue, oldValue, scope) {
                        if ($scope.lifeResponseCodeList.length == $rootScope.lifeQuoteRequest.length) {
                            if (p365Includes($scope.lifeResponseCodeList, $scope.p365Labels.responseCode.success)) {
                                $rootScope.loading = false;
                                $scope.lifeRequestStatus = 1;
                            } else if (p365Includes($scope.lifeResponseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                                $rootScope.loading = false;
                                $scope.lifeRequestStatus = 2;
                                $rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                            } else {
                                $rootScope.loading = false;
                                $scope.lifeRequestStatus = 2;
                                $rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                            }
                        }
                    }, true);
                } else {
                    $scope.lifeResponseCodeList = [];
                    if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0)
                        $rootScope.lifeQuoteResult.length = 0;

                    $rootScope.lifeQuoteResult = [];
                    $scope.errorMessage($sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg));
                }
            }

            /*function for life ends*/

       
 /*function for critical illness */

 $scope.processCriticalIllnessResult = function() {
    $rootScope.progressBarStatus = false;
    $rootScope.viewOptionDisabled = false;
    $rootScope.tabSelectionStatus = true;
    $rootScope.loading = false;
    $scope.isGotCriticalIllnessQuotes = true;
    if (localStorageService.get("updateProdcutInCartFlag")) {
        $scope.customFilterCriticalIllness(true);
    }
    if (localStorageService.get("criticalIllnessProductToBeAddedInCart")) {
        $scope.criticalIllnessProductToBeAddedInCart = localStorageService.get("criticalIllnessProductToBeAddedInCart");

    } else {
        for (var i = 0; i < $rootScope.ciQuoteResult.length; i++) {
            if ($rootScope.ciQuoteResult[i].basicPremium > 0) {
                $scope.criticalIllnessProductToBeAddedInCart = $rootScope.ciQuoteResult[i];
            }
        }
    }
}
$scope.calculateCriticalIllnessQuote = function(criticalIllnessQuoteResult, quoteIdStatus) {
    $rootScope.ciQuoteRequest = [];
    if (criticalIllnessQuoteResult.responseCode == $scope.p365Labels.responseCode.success) {
        $scope.criticalIllnessResponseCodeList = [];
        $scope.requestId = criticalIllnessQuoteResult.QUOTE_ID;
        localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID", $scope.requestId);
        $rootScope.ciQuoteRequest = criticalIllnessQuoteResult.data;

        if (String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0) {
            $rootScope.ciQuoteResult.length = 0;
        }

        $rootScope.ciQuoteResult = [];

        angular.forEach($rootScope.ciQuoteRequest, function(obj, i) {
            var request = {};
            var header = {};

            header.messageId = messageIDVar;
            header.campaignID = campaignIDVar;
            header.source = sourceOrigin;
            header.deviceId = deviceIdOrigin;
            header.browser = browser.name + " V - " + browser.version;
            header.transactionName = $scope.p365Labels.transactionName.criticalIllnessQuoteResult;
            request.header = header;
            request.body = obj;

            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
            success(function(callback, status) {
                var ciQuoteResponse = JSON.parse(callback);
                if (ciQuoteResponse.QUOTE_ID == $scope.requestId) {
                    $scope.criticalIllnessResponseCodeList.push(ciQuoteResponse.responseCode);

                    if (ciQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                        for (var i = 0; i < $rootScope.ciQuoteRequest.length; i++) {
                            if ($rootScope.ciQuoteRequest[i].messageId == ciQuoteResponse.messageId) {
                                ciQuoteResponse.data.quotes[0].dailyPremium = Math.round(ciQuoteResponse.data.quotes[0].annualPremium / 365);
                                ciQuoteResponse.data.quotes[0].insuranceCompany = (ciQuoteResponse.data.quotes[0].insuranceCompany);
                                $rootScope.ciQuoteResult.push(ciQuoteResponse.data.quotes[0]);
                                $rootScope.ciQuoteRequest[i].status = 1;
                            }
                        }
                        $scope.processCriticalIllnessResult();
                    }
                }
            }).
            error(function(data, status) {
                $scope.criticalIllnessResponseCodeList.push($scope.p365Labels.responseCode.systemError);
            });
        });


        $scope.$watch('criticalIllnessResponseCodeList', function(newValue, oldValue, scope) {
            if ($scope.criticalIllnessResponseCodeList.length == $rootScope.ciQuoteRequest.length) {
                if (p365Includes($scope.criticalIllnessResponseCodeList, $scope.p365Labels.responseCode.success)) {
                    $rootScope.loading = false;
                    $scope.criticalIllnessRequestStatus = 1;
                } else if (p365Includes($scope.criticalIllnessResponseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                    $rootScope.loading = false;
                    $scope.criticalIllnessRequestStatus = 2;
                    $rootScope.criticalIllnessErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedCIErrMsg);
                } else {
                    $rootScope.loading = false;
                    $scope.criticalIllnessRequestStatus = 2;
                    $rootScope.criticalIllnessErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedCIErrMsg);
                }
            }
        }, true);
    } else {
        $scope.criticalIllnessResponseCodeList = [];

        if (String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0)
            $rootScope.ciQuoteResult.length = 0;

        $rootScope.ciQuoteResult = [];
        $scope.errorMessage(callback.message);
    }

}
/*function for critical illness ends here */
     /*QuoteCalculation Function Ends here */

            $scope.initialisation = function() {
                //object initializing with generic values; 
                $rootScope.bikeQuoteResult = $rootScope.carQuoteResult = [];
                $rootScope.healthQuoteResult = $rootScope.lifeQuoteResult = [];

                if (localStorageService.get("commAddressDetails")) {
                    $scope.addressDetails = localStorageService.get("commAddressDetails");
                }
                if (!$rootScope.displayResult) {
                    $scope.professionalQuoteParams = localStorageService.get("professionalQuoteParams");

                }
                if ($rootScope.bikeQuoteResult) {
                    $scope.selectedBike = {};
                    if (localStorageService.get("selectedBikeDetails")) {
                        $scope.bikeDetails = localStorageService.get("selectedBikeDetails");
                    }
                   // if (localStorageService.get("bikeRegistrationPlaceUsingIP")) {
                    if (localStorageService.get("bikeRegAddress")) {
                        //$scope.bikeVehicleInfo.registrationPlace = localStorageService.get("bikeRegistrationPlaceUsingIP").rtoName;
                        $scope.bikeVehicleInfo.registrationPlace = localStorageService.get("bikeRegAddress").rtoName;
                    }
                    
                    if ($scope.bikeDetails) {
                        $scope.selectedBike.displayVehicle = $scope.bikeDetails.displayVehicle;
                    }
                    var current_Year = new Date().getFullYear();
                    if (localStorageService.get("professionalQuoteParams")) {
                        $scope.bikeVehicleInfo.regYear = localStorageService.get("professionalQuoteParams").bikeInfo.registrationYear;
                        if (current_Year == $scope.bikeVehicleInfo.regYear) {
                            $scope.bikeVehicleInfo.dateOfRegistration = "01/01/" + $scope.bikeVehicleInfo.regYear;
                        } else {
                            $scope.bikeVehicleInfo.dateOfRegistration = "01/07/" + $scope.bikeVehicleInfo.regYear;
                        }
                     
                    }
                }
                if ($rootScope.carQuoteResult) {
                    $scope.selectedCar = {};
                    $scope.carDetails = localStorageService.get("selectedCarDetails");
                    if (localStorageService.get("carRegistrationPlaceUsingIP")) {
                        $scope.carVehicleInfo.registrationPlace = localStorageService.get("carRegistrationPlaceUsingIP").rtoName;
                    }
                    if ($scope.carDetails) {
                        $scope.selectedCar.displayVehicle = $scope.carDetails.displayVehicle;
                    }
                    var current_Year = new Date().getFullYear();
                    if (localStorageService.get("professionalQuoteParams")) {
                        $scope.carVehicleInfo.regYear = localStorageService.get("professionalQuoteParams").carInfo.registrationYear;
                        if (current_Year == $scope.carVehicleInfo.regYear) {
                            $scope.carVehicleInfo.dateOfRegistration = "01/01/" + $scope.carVehicleInfo.regYear;
                        } else {
                            $scope.carVehicleInfo.dateOfRegistration = "01/07/" + $scope.carVehicleInfo.regYear;
                        }
                    }
                }
                $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                $scope.commonInfo = $scope.quoteRequest.commonInfo;

                if (localStorageService.get("selectedBikeDetails")) {
                    $scope.bikeDetails = localStorageService.get("selectedBikeDetails");
                    $rootScope.showBikeRegAreaStatus = $scope.bikeDetails.showBikeRegAreaStatus;
                }
                if (localStorageService.get("selectedCarDetails")) {
                    $scope.carDetails = localStorageService.get("selectedCarDetails");
                    $rootScope.showCarRegAreaStatus = $scope.carDetails.showCarRegAreaStatus;
                }

                // added to send registration Details in quote req.
                if ($rootScope.showCarRegAreaStatus && $scope.carVehicleInfo.registrationPlace) {
                    if ($scope.quoteRequest.carInfo.registrationNumber) {
                        delete $scope.quoteRequest.carInfo.registrationNumber;
                    }
                    $scope.quoteRequest.carInfo.registrationPlace = $scope.carVehicleInfo.registrationPlace;
                } else if (!$rootScope.showCarRegAreaStatus && $scope.carDetails) {
                    $scope.quoteRequest.carInfo.registrationPlace = $scope.carVehicleInfo.registrationPlace;
                    if ($scope.carDetails.registrationNumber) {
                        $scope.quoteRequest.carInfo.registrationNumber = $scope.carDetails.registrationNumber.toUpperCase();
                    }
                }
                if ($rootScope.showBikeRegAreaStatus && $scope.bikeVehicleInfo.registrationPlace) {
                    if ($scope.quoteRequest.bikeInfo.registrationNumber) {
                        delete $scope.quoteRequest.bikeInfo.registrationNumber;
                    }
                    $scope.quoteRequest.bikeInfo.registrationPlace = $scope.bikeVehicleInfo.registrationPlace;
                } else if (!$rootScope.showBikeRegAreaStatus && $scope.bikeDetails) {
                    $scope.quoteRequest.bikeInfo.registrationPlace = $scope.bikeVehicleInfo.registrationPlace;
                    if ($scope.bikeDetails.registrationNumber) {
                        $scope.quoteRequest.bikeInfo.registrationNumber = $scope.bikeDetails.registrationNumber.toUpperCase();
                    }
                }
                
                localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                $scope.bikeInfo = $scope.quoteRequest.bikeInfo;
                $scope.carInfo = $scope.quoteRequest.carInfo;
                $scope.healthInfo = $scope.quoteRequest.healthInfo;

                /*if($rootScope.lifeQuoteResult[0]){
                	$scope.lifeResult = $rootScope.lifeQuoteResult[0];	
                }
                if($rootScope.healthQuoteResult[0]){
                	$scope.healthResult = $rootScope.healthQuoteResult[0];
                }
                if($rootScope.travelQuoteResult[0]){
                	$scope.travelResult = $rootScope.travelQuoteResult[0];
                }*/

            }

            $scope.readProfessionalQuoteID = function(PROF_QUOTE_ID) {
                if (PROF_QUOTE_ID) {
                    var _request = {};
                    _request.docId = PROF_QUOTE_ID;
                    _request.lob = 0;
                    RestAPI.invoke("quoteDataReader", _request).then(function(_professionalQuoteCallback) {
                        if (_professionalQuoteCallback.responseCode == 1000) {
                            var _professionalQuoteData = _professionalQuoteCallback.data;
                            if (_professionalQuoteData) {
                                $scope.quoteRequest = {};
                                $scope.quoteRequest.professionId = _professionalQuoteData.professionId;
                                $scope.quoteRequest.profession = _professionalQuoteData.professionName;
                                $scope.quoteRequest.professionCode = _professionalQuoteData.professionCode;
                                $scope.quoteRequest.currentQuestionCode = _professionalQuoteData.currentQuestionCode
                                $scope.quoteRequest.bikeInfo = _professionalQuoteData.bikeInfo;
                                $scope.quoteRequest.carInfo = _professionalQuoteData.carInfo;
                                $scope.quoteRequest.healthInfo = _professionalQuoteData.healthInfo;
                                $scope.quoteRequest.commonInfo = _professionalQuoteData.commonInfo;
                                if (_professionalQuoteData.riskDetails && _professionalQuoteData.riskDetails.algResponse) {
                                    var riskProfile = _professionalQuoteData.riskDetails.algResponse.riskAnalysis;
                                    var insuranceAssessment = _professionalQuoteData.riskDetails.algResponse.insuranceAnalysis;
                                    var recommendedRiders = _professionalQuoteData.riskDetails.algResponse.productAnalysis;
                                    $scope.makeInsuranceAssessmentBlocksReady(insuranceAssessment);
                                    $scope.makeRiskProfileChartReady(riskProfile);
                                    $scope.findRecommendedRiders(recommendedRiders);
                                    // $scope.riskAndInsuranceProfilePopup = true;                                     
                                    if ($rootScope.sharedProfileString != null && $rootScope.sharedProfileString != undefined && $rootScope.sharedProfileString.length > 0) {
                                        if ($rootScope.sharedProfileString == "riskProfile") {
                                            $rootScope.authenticated = true;
                                            $rootScope.alreadyShared = true;
                                            $scope.showRiskChartModal();
                                        } else if ($rootScope.sharedProfileString == "insuranceAssessment") {
                                            $rootScope.authenticated = true;
                                            $rootScope.alreadyShared = true;
                                            $scope.showInsuranceAssessChartModal();
                                            
                                        }
                                        
                                    }
                                }
                                localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                                if (_professionalQuoteData.lobQuoteId) {
                                    $scope.healthRequestStatus = 0;
                                    $scope.lifeRequestStatus = 0;
                                    $scope.bikeRequestStatus = 0;
                                    $scope.carRequestStatus = 0;
                                    $scope.tempLobArray = new Array(_professionalQuoteData.lobQuoteId.length);
                                    for (var i = 0; i < _professionalQuoteData.lobQuoteId.length; i++) {
                                        $scope.tempLobArray[i] = _professionalQuoteData.lobQuoteId[i].businessLineId;
                                    }
                                    angular.forEach(_professionalQuoteData.lobQuoteId, function(object, index) {
                                        var req = {};
                                        req.docId = object.QUOTE_ID;
                                        req.lob = object.businessLineId;

                                        var request = {};
                                        var header = {};
                                        header.messageId = messageIDVar;
                                        header.source = sourceOrigin;
                                        header.transactionName = "quoteDataReader";
                                        header.deviceId = deviceIdOrigin;
                                        request.header = header;
                                        request.body = req;



                                        if (!p365Includes($scope.tempLobArray, 1)) {
                                            $scope.lifeRequestStatus = 2;
                                            $rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                        }
                                        if (!p365Includes($scope.tempLobArray, 2)) {
                                            $scope.bikeRequestStatus = 2;
                                            $rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        }
                                        if (!p365Includes($scope.tempLobArray, 3)) {
                                            $scope.carRequestStatus = 2;
                                            $rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        }
                                        if (!p365Includes($scope.tempLobArray, 4)) {
                                            $scope.healthRequestStatus = 2;
                                            $rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                        }
                                        if (!p365Includes($scope.tempLobArray, 6)) {
                                            $scope.criticalIllnessRequestStatus = 2;
                                            $rootScope.criticalIllnessErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedCIErrMsg);
                                        }
                                        // if (req.lob == 4) {
                                        // 	$scope.healthRequestStatus = 0;
                                        // } else {
                                        // 	$scope.healthRequestStatus = 2;
                                        // 	$rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                        // }
                                        // if (req.lob == 3) {
                                        // 	$scope.carRequestStatus = 0;
                                        // } else {
                                        // 	$scope.carRequestStatus = 2;
                                        // 	$rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        // }
                                        // if (req.lob == 2) {
                                        // 	$scope.bikeRequestStatus = 0;
                                        // } else {
                                        // 	$scope.bikeRequestStatus = 2;
                                        // 	$rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                        // }
                                        // if (req.lob == 1) {
                                        // 	$scope.lifeRequestStatus = 0;
                                        // } else {
                                        // 	$scope.lifeRequestStatus = 2;
                                        // 	$rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                        // }

                                        $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                        success(function(callback, status) {
                                            callback = JSON.parse(callback);
                                            if (callback.data) {
                                                if (callback.data.businessLineId == 3) {
                                                    localStorageService.set('CAR_UNIQUE_QUOTE_ID', req.docId);
                                                    $rootScope.carQuoteResult = callback.data.carQuoteResponse;
                                                    if ($rootScope.carQuoteResult) {
                                                        $scope.isGotCarQuotes = true;
                                                        if ($rootScope.selectedCarrierIdForCar && $rootScope.selectedProductIdForCar) {
                                                            angular.forEach($rootScope.carQuoteResult, function(result, index) {
                                                                if ($rootScope.selectedCarrierIdForCar == result.carrierId && $rootScope.selectedProductIdForCar == result.productId) {
                                                                    localStorageService.set("carProductToBeAddedInCart", result);
                                                                    $scope.carProductToBeAddedInCart = result;
                                                                    if (localStorageService.get("carDetailsToBeAddedInCart")) {
                                                                        $scope.carDetails = localStorageService.get("carDetailsToBeAddedInCart");
                                                                        localStorageService.set("selectedCarDetails", $scope.carDetails);
                                                                    }
                                                                }
                                                                $scope.customFilterCar(false);
                                                            });
                                                        } else {
                                                            $scope.customFilterCar(true);
                                                            if (localStorageService.get("carProductToBeAddedInCart")) {
                                                                $scope.carProductToBeAddedInCart = localStorageService.get("carProductToBeAddedInCart");
                                                                if (localStorageService.get("carDetailsToBeAddedInCart")) {
                                                                    $scope.carDetails = localStorageService.get("carDetailsToBeAddedInCart");
                                                                    localStorageService.set("selectedCarDetails", $scope.carDetails);
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        $scope.carRequestStatus = 2;
                                                        $rootScope.carErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                                    }
                                                } else if (callback.data.businessLineId == 2) {
                                                    localStorageService.set('BIKE_UNIQUE_QUOTE_ID', req.docId);
                                                    $rootScope.bikeQuoteResult = callback.data.bikeQuoteResponse;
                                                    if ($rootScope.bikeQuoteResult) {
                                                        $scope.isGotBikeQuotes = true;
                                                        if ($rootScope.selectedCarrierIdForBike && $rootScope.selectedProductIdForBike) {
                                                            angular.forEach($rootScope.bikeQuoteResult, function(result, index) {
                                                                if ($rootScope.selectedCarrierIdForBike == result.carrierId && $rootScope.selectedProductIdForBike == result.productId) {
                                                                    localStorageService.set("bikeProductToBeAddedInCart", result);
                                                                    $scope.bikeProductToBeAddedInCart = result;
                                                                    if (localStorageService.get("bikeDetailsToBeAddedInCart")) {
                                                                        $scope.bikeDetails = localStorageService.get("bikeDetailsToBeAddedInCart");
                                                                        localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
                                                                    }
                                                                }
                                                                $scope.customFilterBike(false);
                                                            });
                                                        } else {
                                                            $scope.customFilterBike(true);
                                                            if (localStorageService.get("bikeProductToBeAddedInCart")) {
                                                                $scope.bikeProductToBeAddedInCart = localStorageService.get("bikeProductToBeAddedInCart");
                                                                if (localStorageService.get("bikeDetailsToBeAddedInCart")) {
                                                                    $scope.bikeDetails = localStorageService.get("bikeDetailsToBeAddedInCart");
                                                                    localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        $scope.bikeRequestStatus = 2;
                                                        $rootScope.bikeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
                                                    }
                                                } else if (callback.data.businessLineId == 4) {
                                                    localStorageService.set('HEALTH_UNIQUE_QUOTE_ID', req.docId);
                                                    $rootScope.healthQuoteResult = callback.data.quoteResponse;

                                                    if (localStorageService.get("healthQuoteInputParamaters")) {
                                                        $scope.quote = localStorageService.get("healthQuoteInputParamaters");

                                                        if (localStorageService.get("professionalQuoteParams")) {
                                                            $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                                                            $scope.healthInfo = $scope.quoteRequest.healthInfo;
                                                        }

                                                        if (localStorageService.get("healthQuoteInputParamaters").personalInfo) {
                                                            $scope.personalInfo = localStorageService.get("healthQuoteInputParamaters").personalInfo;
                                                            if ($scope.personalInfo.selectedFamilyMembers) {
                                                                $scope.healthInfo.selectedFamilyMembers = [];
                                                                for (var i = 0; i < $scope.personalInfo.selectedFamilyMembers.length; i++) {
                                                                    $scope.healthInfo.selectedFamilyMembers.push({
                                                                        "dieaseDetails": [],
                                                                        "gender": $scope.personalInfo.selectedFamilyMembers[i].gender,
                                                                        "dob": $scope.personalInfo.selectedFamilyMembers[i].dob,
                                                                        "display": $scope.personalInfo.selectedFamilyMembers[i].display,
                                                                        "existSince": $scope.personalInfo.selectedFamilyMembers[i].existSince,
                                                                        "id": $scope.personalInfo.selectedFamilyMembers[i].id,
                                                                        "salutation": $scope.personalInfo.selectedFamilyMembers[i].salutation,
                                                                        "relationship": $scope.personalInfo.selectedFamilyMembers[i].relationship,
                                                                        "age": $scope.personalInfo.selectedFamilyMembers[i].age,
                                                                        "existSinceError": $scope.personalInfo.selectedFamilyMembers[i].existSinceError,
                                                                        "status": $scope.personalInfo.selectedFamilyMembers[i].status,
                                                                        "relation": $scope.personalInfo.selectedFamilyMembers[i].relation
                                                                    });
                                                                }
                                                            }
                                                        }

                                                        if ($scope.quote) {
                                                            $scope.commonInfo = $scope.quoteRequest.commonInfo;
                                                            if ($scope.quote.quoteParam.selfGender == 'M' && $scope.quote.quoteParam.selfGender == 'Male') {
                                                                $scope.commonInfo.gender = 'Male';
                                                            } else {
                                                                $scope.commonInfo.gender = 'Female';
                                                            }
                                                            $scope.quoteRequest.commonInfo = $scope.commonInfo;
                                                            $scope.quoteRequest.healthInfo = $scope.healthInfo;
                                                            localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                                                        }
                                                    }

                                                    if ($rootScope.healthQuoteResult) {
                                                        $scope.isGotHealthQuotes = true;
                                                        if ($rootScope.selectedCarrierIdForHealth && $rootScope.selectedProductIdForHealth && $rootScope.selectedChildPlanIdForHealth) {
                                                            angular.forEach($rootScope.healthQuoteResult, function(result, index) {
                                                                if ($rootScope.selectedCarrierIdForHealth == result.carrierId && $rootScope.selectedProductIdForHealth == result.planId && $rootScope.selectedChildPlanIdForHealth == result.childPlanId) {
                                                                    localStorageService.set("healthProductToBeAddedInCart", result);
                                                                    $scope.healthProductToBeAddedInCart = result;
                                                                }
                                                                $scope.customFilterHealth(false);
                                                            });
                                                        } else if ($rootScope.selectedCarrierIdForHealth && $rootScope.selectedProductIdForHealth) {
                                                            angular.forEach($rootScope.healthQuoteResult, function(result, index) {
                                                                if ($rootScope.selectedCarrierIdForHealth == result.carrierId && $rootScope.selectedProductIdForHealth == result.planId) {
                                                                    localStorageService.set("healthProductToBeAddedInCart", result);
                                                                    $scope.healthProductToBeAddedInCart = result;
                                                                }
                                                                $scope.customFilterHealth(false);
                                                            });
                                                        } else {
                                                            $scope.customFilterHealth(true);
                                                            if (localStorageService.get("healthProductToBeAddedInCart")) {
                                                                $scope.healthProductToBeAddedInCart = localStorageService.get("healthProductToBeAddedInCart");
                                                            }
                                                        }
                                                    } else {
                                                        $scope.healthRequestStatus = 2;
                                                        $rootScope.healthErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg);
                                                    }
                                                } else if (callback.data.businessLineId == 1) {
                                                    localStorageService.set('LIFE_UNIQUE_QUOTE_ID', req.docId);
                                                    $rootScope.lifeQuoteResult = callback.data.lifeQuoteResponse;
                                                    $scope.personalDetails = localStorageService.get("lifePersonalDetails");
                                                    if ($scope.personalDetails) {
                                                        if ($scope.personalDetails.maturityAge)
                                                            $rootScope.insuredUptoAge = $scope.personalDetails.maturityAge;
                                                    }

                                                    if (localStorageService.get("lifeQuoteInputParamaters")) {
                                                        $scope.quote = localStorageService.get("lifeQuoteInputParamaters");
                                                        if (localStorageService.get("professionalQuoteParams")) {
                                                            $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                                                            if ($scope.quote) {
                                                                $scope.commonInfo = $scope.quoteRequest.commonInfo;
                                                                if ($scope.quote.quoteParam.gender == 'M') {
                                                                    $scope.commonInfo.gender = 'Male';
                                                                } else {
                                                                    $scope.commonInfo.gender = 'Female';
                                                                }
                                                                if ($scope.quote.quoteParam.tobacoAdicted == 'Y') {
                                                                    $scope.commonInfo.smoking = true;
                                                                } else {
                                                                    $scope.commonInfo.smoking = false;
                                                                }
                                                                $scope.commonInfo.age = $scope.quote.quoteParam.age;
                                                                $scope.quoteRequest.commonInfo = $scope.commonInfo;
                                                                localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                                                            }
                                                        }
                                                    }

                                                    if ($rootScope.lifeQuoteResult) {
                                                        $scope.isGotLifeQuotes = true;
                                                        if ($rootScope.selectedCarrierIdForLife && $rootScope.selectedProductIdForLife) {
                                                            angular.forEach($rootScope.lifeQuoteResult, function(result, index) {
                                                                if ($rootScope.selectedCarrierIdForLife == result.carrierId && $rootScope.selectedProductIdForLife == result.productId) {
                                                                    localStorageService.set("lifeProductToBeAddedInCart", result);
                                                                    $scope.lifeProductToBeAddedInCart = result;
                                                                }
                                                                $scope.customFilterLife(false);
                                                            });
                                                        } else {
                                                            $scope.customFilterLife(true);
                                                            if (localStorageService.get("lifeProductToBeAddedInCart")) {
                                                                $scope.lifeProductToBeAddedInCart = localStorageService.get("lifeProductToBeAddedInCart");
                                                            }

                                                        }
                                                    } else {
                                                        $scope.lifeRequestStatus = 2;
                                                        $rootScope.lifeErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                                    }
                                                }  else if (callback.data.businessLineId == 6) {
                                                    localStorageService.set('CRITICAL_ILLNESS_UNIQUE_QUOTE_ID', req.docId);
                                                    $rootScope.ciQuoteResult = callback.data.criticalIllnessQuoteResponse;
                                                    $scope.personalDetails = localStorageService.get("criticalIllnessPersonalDetails");
                                                    if ($scope.personalDetails) {
                                                        if ($scope.personalDetails.maturityAge)
                                                            $rootScope.insuredUptoAge = $scope.personalDetails.maturityAge;
                                                    }

                                                    if (localStorageService.get("criticalIllnessQuoteInputParamaters")) {
                                                        $scope.quote = localStorageService.get("criticalIllnessQuoteInputParamaters");
                                                        if (localStorageService.get("professionalQuoteParams")) {
                                                            $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                                                            //$scope.HealthInfo = $scope.quoteRequest.HealthInfo;
                                                            if ($scope.quote) {
                                                                $scope.commonInfo = $scope.quoteRequest.commonInfo;
                                                                if ($scope.quote.quoteParam.gender == 'M') {
                                                                    $scope.commonInfo.gender = 'Male';
                                                                } else {
                                                                    $scope.commonInfo.gender = 'Female';
                                                                }
                                                                if ($scope.quote.quoteParam.tobacoAdicted == 'Y') {
                                                                    $scope.commonInfo.smoking = true;
                                                                } else {
                                                                    $scope.commonInfo.smoking = false;
                                                                }
                                                                $scope.commonInfo.age = $scope.quote.quoteParam.age;
                                                                //$scope.commonInfo.incomeRange.label = $scope.personalDetails.annualIncomeObject.display;
                                                                $scope.quoteRequest.commonInfo = $scope.commonInfo;
                                                                localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                                                            }
                                                        }
                                                    }

                                                    if ($rootScope.ciQuoteResult) {
                                                        $scope.isGotCriticalIllnessQuotes = true;
                                                        if ($rootScope.selectedCarrierIdForCriticalIllness && $rootScope.selectedProductIdForCriticalIllness) {
                                                            angular.forEach($rootScope.ciQuoteResult, function(result, index) {
                                                                if ($rootScope.selectedCarrierIdForCriticalIllness == result.carrierId && $rootScope.selectedProductIdForCriticalIllness == result.productId) {
                                                                    localStorageService.set("criticalIllnessProductToBeAddedInCart", result);
                                                                    $scope.criticalIllnessProductToBeAddedInCart = result;
                                                                }                                                              
                                                                $scope.customFilterCriticalIllness(false);
                                                            });
                                                        } else {                                                 
                                                            $scope.customFilterCriticalIllness(true);
                                                            // localStorageService.set("carProductToBeAddedInCart", $rootScope.carQuoteResult[0]);
                                                            if (localStorageService.get("criticalIllnessProductToBeAddedInCart")) {
                                                                $scope.criticalIllnessProductToBeAddedInCart = localStorageService.get("criticalIllnessProductToBeAddedInCart");
                                                          }
                                                          
                                                        }
                                                    } else {
                                                        $scope.criticalIllnessRequestStatus = 2;
                                                        $rootScope.criticalIllnessErrorMessage = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedCIErrMsg);
                                                    }
                                                }else {
                                                       // console.log("New Businessline : ", callback.data);
                                                }
                                            }
                                        });
                                    });
                                }
                            } else {
                                console.error("Somthing went wrong with professional quotes.");
                            }
                        } else {
                            console.error("Somthing went wrong with professional quotes.");
                        }
                    });
                } else {
                    console.error("Not able to process request with unknown argument.");
                }
            }

            $scope.init = function() {
                $http.get(wp_path + 'ApplicationLabels.json').then(function(response) {
                    localStorageService.set("applicationLabels", response.data);
                    $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
                    $scope.globalLabel = response.data.globalLabels;
                    $scope.p365Labels = commonResultLabels;
                    $scope.declaration();
                    $scope.initialisation();
                    if (!$rootScope.isFromLeadForm) {
                        if (localStorageService.get("PROF_QUOTE_ID")) {
                            $scope.readProfessionalQuoteID(localStorageService.get("PROF_QUOTE_ID"));
                        } else {
                            $scope.requestForQuote();
                        }
                    } else {
                        $rootScope.isFromLeadForm = false;
                        $scope.requestForQuote();
                    }

                });
            };
            $scope.init();

            $scope.editJourneyDetailsWithSlideKey = function(_slideKey) {
                
                    if (_slideKey == "confirmation") {
                        $rootScope.editProfile = true;
                    }
                    if (_slideKey == "carRTO") {
                        $rootScope.editCarDetails = true;
                    }
                    if (_slideKey == "bikeRTO") {
                        $rootScope.editBikeDetails = true;
                    }
                    if (_slideKey == "familyDetails") {
                        $rootScope.editFamilyDetails = true;
                    }
                    $location.path("/professionalJourney");
                }
                // $scope.viewMoreQuotes = function(healthResult)	{
                // 	$location.path("/healthResult");
                // }

            $scope.addProductToCart = function(_product, _lob) {
                $rootScope.loading = true;
                if (_lob.toUpperCase() == "CAR") {
                    localStorageService.set("carProductToBeAddedInCart", _product);
                    var carDetailsCopy = angular.copy($scope.carDetails);
                    var carVehicleInfoCopy = angular.copy($scope.carVehicleInfo);
                    var carInfoCopy = angular.copy($scope.carInfo);
                    localStorageService.set("carDetailsCopy", carDetailsCopy);
                    localStorageService.set("carVehicleInfoCopy", carVehicleInfoCopy);
                    localStorageService.set("carInfoCopy", carInfoCopy);
                } else if (_lob.toUpperCase() == "BIKE") {
                    localStorageService.set("bikeProductToBeAddedInCart", _product);
                    var bikeDetailsCopy = angular.copy($scope.bikeDetails);
                    var bikeVehicleInfoCopy = angular.copy($scope.bikeVehicleInfo);
                    var bikeInfoCopy = angular.copy($scope.bikeInfo);
                    localStorageService.set("bikeDetailsCopy", bikeDetailsCopy);
                    localStorageService.set("bikeVehicleInfoCopy", bikeVehicleInfoCopy);
                    localStorageService.set("bikeInfoCopy", bikeInfoCopy);
                } else if (_lob.toUpperCase() == "HEALTH") {
                    localStorageService.set("healthProductToBeAddedInCart", _product);
                } else if (_lob.toUpperCase() == "LIFE") {
                    localStorageService.set("lifeProductToBeAddedInCart", _product);
                }
                $scope.editInputs(_lob, true);
            }

            $scope.editInputs = function(lob, _addToCartStatus) {
                _addToCartStatus = (_addToCartStatus) ? _addToCartStatus : false;
                $rootScope.isFromProfessionalJourney = true;
                $rootScope.isProfessionalJourneySelected = true;
                $rootScope.showRecommendedRider = true;
                $rootScope.loading = true;
                var request = {};
                if (lob.toUpperCase() == "BIKE" || lob.toUpperCase() == "CAR") {
                    var todayDate = new Date();
                    var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
                        ("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
                    getPolicyStatusList(formatedTodaysDate);
                    $scope.ncbList = ncbListGeneric;
                    $scope.policyStatusList = policyStatusListGeneric;
                    if (lob.toUpperCase() == "BIKE") {
                        $scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;
                        request.docId = localStorageService.get('BIKE_UNIQUE_QUOTE_ID');
                    } else {
                        $scope.carInsuranceTypes = carInsuranceTypeGeneric;
                        request.docId = localStorageService.get('CAR_UNIQUE_QUOTE_ID');
                    }
                } else if (lob.toUpperCase() == "HEALTH") {
                    request.docId = localStorageService.get('HEALTH_UNIQUE_QUOTE_ID');
                } else if (lob.toUpperCase() == "LIFE") {
                    request.docId = localStorageService.get('LIFE_UNIQUE_QUOTE_ID');
                }else if (lob.toUpperCase() == "CRITCALILLNESS") {
                    request.docId = localStorageService.get('CRITICAL_ILLNESS_UNIQUE_QUOTE_ID');
                }
                request.LOB = localStorageService.get("selectedBusinessLineId");

                RestAPI.invoke("quoteDataReader", request).then(function(callback) {
                    if (callback.responseCode == 1000) {
                        $scope.selectedBusinessLineId = callback.data.businessLineId;
                        if ($scope.selectedBusinessLineId == 2) {
                            // $scope.bikeDetails = $scope.bikeDetails;
                            $scope.quote = {};
                            $scope.bikeResponse = callback.data;
                            $scope.quoteParam = $scope.bikeResponse.bikeQuoteRequest.quoteParam;
                            $scope.quote = $scope.bikeResponse.bikeQuoteRequest;
                            $scope.quote.quoteParam = $scope.bikeResponse.bikeQuoteRequest.quoteParam;
                            $scope.BIKE_UNIQUE_QUOTE_ID = $scope.bikeResponse.QUOTE_ID;
                            $scope.vehicleInfo = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo;
                            $scope.quote.vehicleInfo = $scope.vehicleInfo;
                            $scope.selectedBusinessLineId = $scope.bikeResponse.businessLineId;
                            $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                            $rootScope.bikeQuoteResult = $scope.bikeResponse.bikeQuoteResponse;
                            $scope.bikeDetails.policyStatus = $scope.policyStatusList[2];
                            // $scope.BikePACoverDetails = {
                            //     "isPACoverApplicable": false,
                            //     "existingInsurance": true
                            // }
                            if($scope.vehicleInfo.dateOfRegistration){
								var bikeRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/");
                              if(localStorageService.get("selectedBikeDetails")){
                                $scope.bikeDetails = localStorageService.get("selectedBikeDetails");
                                $scope.bikeDetails.regYear = bikeRegistrationYearList[2] ;
                                localStorageService.set("selectedBikeDetails",$scope.bikeDetails);
                                }
                            }
                            for (i = 0; i < $scope.bikeInsuranceTypes.length; i++) {
                                if ($scope.quoteParam.policyType == $scope.bikeInsuranceTypes[i].value) {
                                    $scope.bikeDetails.insuranceType = $scope.bikeInsuranceTypes[i];
                                    break;
                                }
                            }

                            for (i = 0; i < $scope.ncbList.length; i++) {
                                if ($scope.quoteParam.ncb == $scope.ncbList[i].value) {
                                    $scope.bikeDetails.ncb = $scope.ncbList[i];
                                    break;
                                }
                            }


                            setTimeout(function() {
                                getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.bike, $scope.p365Labels.request.findAppConfig, function(addOnCoverForBike) {
                                    localStorageService.set("ridersCarStatus", true);
                                    localStorageService.set("BikePACoverDetails", $scope.BikePACoverDetails);
                                    localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.BIKE_UNIQUE_QUOTE_ID);
                                    if ($scope.bikeDetails.idvOption == 1) {
                                        localStorageService.set("BIKE_IDV_QUOTE_ID", $scope.BIKE_UNIQUE_QUOTE_ID);
                                    }
                                    localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
                                    if ($scope.recommendedBikeRiders) {
                                        //if ($scope.recommendedBikeRiders && _addToCartStatus) {
                                        for (let i = 0; i < addOnCoverForBike.length; i++) {
                                            for (let j = 0; j < $scope.recommendedBikeRiders.length; j++) {
                                                if (addOnCoverForBike[i].riderId == $scope.recommendedBikeRiders[j].riderId) {
                                                    addOnCoverForBike[i].isRecommended = true;
                                                }
                                            }
                                        }
                                    }
                                    localStorageService.set("addOnCoverListForBike", addOnCoverForBike);
                                    localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
                                    localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                                    if (_addToCartStatus) {
                                        $location.path("/PBBikeResult");
                                    } else {
                                        $location.path("/bikeResult");
                                    }
                                });
                            }, 100);


                        } else if ($scope.selectedBusinessLineId == 4) {
                            $scope.quote = {};
                            $scope.selectedFamilyArray = [];
                            $scope.selectedDisease = {};
                            $scope.diseaseList = {};
                            $scope.selectedDisease.diseaseList = [];
                            $scope.selectedFeatures = [];
                            $rootScope.healthQuoteResult = [];
                            var item = {};
                            $scope.hospitalisationLimit = {};
                            $scope.isDiseased = false;

                            $scope.healthResponse = callback.data;
                            $scope.quote = $scope.healthResponse.quoteRequest;
                            $scope.quote.quoteParam = $scope.healthResponse.quoteRequest.quoteParam;
                            $scope.quote.personalInfo = $scope.healthResponse.quoteRequest.personalInfo;
                            $scope.selectedArea = $scope.healthResponse.quoteRequest.personalInfo.displayArea;
                            $scope.selectedBusinessLineId = $scope.healthResponse.businessLineId;
                            $scope.selectedFamilyArray = $scope.quote.personalInfo.selectedFamilyMembers;
                            for (var i = 0; i < $scope.healthResponse.quoteResponse.length; i++) {
                                if (Number($scope.healthResponse.quoteResponse[i].basicPremium > 0)) {
                                    $rootScope.healthQuoteResult.push($scope.healthResponse.quoteResponse[i]);
                                }

                            }
                            $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;

                            if ($scope.quote.personalInfo.pincode) {
                                item.pincode = $scope.quote.personalInfo.pincode;
                            }
                            if ($scope.quote.personalInfo.city) {
                                item.district = $scope.quote.personalInfo.city;
                            }
                            item.displayArea = $scope.quote.personalInfo.displayArea;
                            item.state = $scope.quote.personalInfo.state;

                            if ($scope.quote.personalInfo.preDiseaseStatus == "Yes") {
                                $scope.isDiseased = true;
                            }
                            $scope.hospitalisationLimit.minHosLimit = $scope.quote.personalInfo.minHospitalisationLimit;
                            $scope.hospitalisationLimit.maxHosLimit = $scope.quote.personalInfo.maxHospitalisationLimit;
                            // //condition added as old quote id will not contain display value
                            // if ($scope.quote.personalInfo.hospitalisationLimitDisplayValue) {
                            // 	$scope.hospitalisationLimit.displayValue = $scope.quote.personalInfo.hospitalisationLimitDisplayValue;
                            // }
                            if (localStorageService.get("selectedDisease")) {
                                $scope.selectedDisease = localStorageService.get("selectedDisease");
                            }

                            localStorageService.set("healthQuoteInputParamaters", $scope.quote);
                            localStorageService.set("selectedArea", $scope.selectedArea);
                            //localStorageService.set("selectedFamilyForHealth", $scope.family);
                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                            localStorageService.set("selectedFamilyArray", $scope.selectedFamilyArray);
                            localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
                            localStorageService.set("userGeoDetails", item);
                            localStorageService.set("selectedDisease", $scope.selectedDisease);

                            //reset functionality
                            localStorageService.set("healthQuoteInputParamatersReset", $scope.quote);
                            localStorageService.set("selectedAreaReset", $scope.selectedArea);
                            //localStorageService.set("selectedFamilyForHealthReset", $scope.family);	
                            localStorageService.set("selectedFamilyArrayReset", $scope.selectedFamilyArray);
                            localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
                            localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);
                            //fetching disease list
                            getListFromDB(RestAPI, "", "Disease", $scope.p365Labels.request.findAppConfig, function(callback) {
                                if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                    $scope.diseaseList = [];
                                    $scope.diseaseList = callback.data;

                                    for (var i = 0; i < $scope.diseaseList.length; i++) {
                                        $scope.diseaseList[i].familyList = [];
                                    }
                                    for (i = 0; i < $scope.selectedFamilyArray.length; i++) {
                                        $scope.dieaseDetails = [];
                                        if ($scope.selectedFamilyArray[i].dieaseDetails) {
                                            for (var j = 0; j < $scope.selectedFamilyArray[i].dieaseDetails.length; j++) {
                                                for (var k = 0; k < $scope.diseaseList.length; k++) {
                                                    if ($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode == $scope.diseaseList[k].diseaseId) {
                                                        $scope.selectedFamilyArray[i].label = $scope.selectedFamilyArray[i].relation;
                                                        $scope.selectedFamilyArray[i].display = $scope.selectedFamilyArray[i].relation;
                                                        $scope.diseaseList[k].familyList.push($scope.selectedFamilyArray[i]);

                                                    }

                                                }
                                            }
                                        }
                                    }
                                    localStorageService.set("diseaseList", $scope.diseaseList);
                                    localStorageService.set("diseaseListReset", $scope.diseaseList);
                                    getListFromDB(RestAPI, "", $scope.p365Labels.documentType.hospitalizationLimit, $scope.p365Labels.request.findAppConfig, function(hospitalizationLimitList) {
                                        if (hospitalizationLimitList.responseCode == $scope.p365Labels.responseCode.success) {
                                            localStorageService.set("hospitalizationLimitList", hospitalizationLimitList.data);
                                            //for reset
                                            localStorageService.set("hospitalizationLimitListReset", hospitalizationLimitList.data);
                                            for (var i = 0; i < hospitalizationLimitList.data.length; i++) {
                                                if (hospitalizationLimitList.data[i].minHosLimit <= $scope.quote.personalInfo.hospitalisationLimit &&
                                                    hospitalizationLimitList.data[i].maxHosLimit > $scope.quote.personalInfo.hospitalisationLimit) {
                                                    $scope.hospitalisationLimit = hospitalizationLimitList.data[i];
                                                    break;
                                                }
                                            }
                                            localStorageService.set("hospitalisationLimitVal", $scope.hospitalisationLimit);
                                            localStorageService.set("hospitalisationLimitValReset", $scope.hospitalisationLimit);
                                        }

                                        var docId = $scope.p365Labels.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
                                        // getDocUsingId(RestAPI, docId, function (tooltipContent) {
                                        // 	localStorageService.set("healthInstantQuoteTooltipContent", tooltipContent.toolTips);
                                        // 	$rootScope.tooltipContent = tooltipContent.toolTips;
                                        var documentId = $scope.p365Labels.documentType.hospitalDetails + "-" + $scope.quote.personalInfo.pincode;
                                        getDocUsingId(RestAPI, documentId, function(hospitalList) {
                                            if (hospitalList != null && String(hospitalList) != "undefined") {
                                                localStorageService.set("hospitalList", hospitalList.hospitalDetails);
                                                $scope.hospitalList = hospitalList.hospitalDetails;
                                            } else {
                                                localStorageService.set("hospitalList", undefined);
                                                $scope.hospitalList = "";
                                            }
                                            if (_addToCartStatus) {
                                                $location.path("/PBHealthResult");
                                            } else {
                                                $location.path("/healthResult");
                                            }
                                        });
                                        //});
                                    });
                                } else {
                                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                                }
                            });
                            //});
                            //$location.path("/healthResult");
                        } else if ($scope.selectedBusinessLineId == 3) {
                            $scope.carResponse = callback.data;
                            $scope.CAR_UNIQUE_QUOTE_ID = callback.data.carQuoteRequest.QUOTE_ID;
                            $scope.quoteParam = callback.data.carQuoteRequest.quoteParam;
                            $scope.quote = callback.data.carQuoteRequest;
                            $scope.quote.quoteParam = callback.data.carQuoteRequest.quoteParam;
                            $scope.vehicleInfo = callback.data.carQuoteRequest.vehicleInfo;
                            $scope.quote.vehicleInfo = $scope.vehicleInfo;
                            $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                            $scope.carDetails.policyStatus = $scope.policyStatusList[2];

                            // $scope.CarPACoverDetails = {
                            //     "isPACoverApplicable": false,
                            //     "existingInsurance": true
                            // }
                            if($scope.vehicleInfo.dateOfRegistration){
							var carRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/");
                                if(localStorageService.get("selectedCarDetails")){
                                    $scope.carDetails = localStorageService.get("selectedCarDetails");
                                    $scope.carDetails.regYear = carRegistrationYearList[2] ;
                                    localStorageService.set("selectedCarDetails",$scope.carDetails);
                               }
                            }

                            for (i = 0; i < $scope.carInsuranceTypes.length; i++) {
                                if ($scope.quoteParam.policyType == $scope.carInsuranceTypes[i].value) {
                                    $scope.carDetails.insuranceType = $scope.carInsuranceTypes[i];
                                    break;
                                }
                            }

                            for (i = 0; i < $scope.ncbList.length; i++) {

                                if ($scope.quoteParam.ncb == $scope.ncbList[i].value) {

                                    $scope.carDetails.ncb = $scope.ncbList[i];
                                    break;
                                }
                            }
                           setTimeout(function() {
                                getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.car, $scope.p365Labels.request.findAppConfig, function(addOnCoverForCar) {
                                    if ($scope.recommendedCarRiders) {
                                        //if ($scope.recommendedCarRiders && _addToCartStatus) {
                                        for (let i = 0; i < addOnCoverForCar.length; i++) {
                                            for (let j = 0; j < $scope.recommendedCarRiders.length; j++) {
                                                if (addOnCoverForCar[i].riderId == $scope.recommendedCarRiders[j].riderId) {
                                                    addOnCoverForCar[i].isRecommended = true;
                                                }
                                            }
                                        }
                                    }
                                    localStorageService.set("addOnCoverListForCar", addOnCoverForCar);
                                    localStorageService.set("ridersCarStatus", true);
                                    //localStorageService.set("CarPACoverDetails", $scope.CarPACoverDetails);
                                    localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.CAR_UNIQUE_QUOTE_ID);
                                    if ($scope.carDetails.idvOption == 1) {
                                        localStorageService.set("car_best_quote_id", $scope.CAR_UNIQUE_QUOTE_ID);
                                    }
                                    localStorageService.set("carQuoteInputParamaters", $scope.quote);

                                    localStorageService.set("selectedCarDetails", $scope.carDetails);
                                    localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                                    if (_addToCartStatus) {
                                        $location.path("/PBCarResult");
                                    } else {
                                        $location.path("/carResult");
                                    }

                                });
                            }, 100);
                        } else if ($scope.selectedBusinessLineId == 1) {
                            $scope.quote = {};
                            $scope.personalDetails = {};

                            $scope.lifeResponse = callback.data;
                            $scope.quote = $scope.lifeResponse.lifeQuoteRequest;
                            $scope.quote.quoteParam = $scope.lifeResponse.lifeQuoteRequest.quoteParam;
                            $scope.quote.personalDetails = $scope.lifeResponse.lifeQuoteRequest.personalDetails;
                            $scope.personalDetails = $scope.quote.personalDetails;
                            $scope.LIFE_UNIQUE_QUOTE_ID = $scope.lifeResponse.QUOTE_ID;

                            $rootScope.lifeQuoteResult = $scope.lifeResponse.lifeQuoteResponse;
                            $rootScope.selectedBusinessLineId = $scope.lifeResponse.businessLineId;

                            setTimeout(function() {
                                getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.life, $scope.p365Labels.request.findAppConfig, function(addOnCoverForLife) {
                                    localStorageService.set("addOnCoverForLife", addOnCoverForLife);
                                    getDocUsingId(RestAPI, $scope.p365Labels.common.ridersDocInDB, function(carrierDetails) {
                                        $rootScope.carrierDetails = carrierDetails;
                                        var carrierRiderList = angular.copy($rootScope.carrierDetails);

                                        //if ($scope.recommendedLifeRiders && _addToCartStatus) {
                                        if ($scope.recommendedLifeRiders) {
                                            for (let i = 0; i < addOnCoverForLife.length; i++) {
                                                for (let j = 0; j < $scope.recommendedLifeRiders.length; j++) {
                                                    if (addOnCoverForLife[i].riderId == $scope.recommendedLifeRiders[j].riderId) {
                                                        addOnCoverForLife[i].isRecommended = true;
                                                    }
                                                }
                                            }
                                        }
                                        $rootScope.carrierDetails = angular.copy(carrierRiderList);
                                        for (var j = 0; j < $rootScope.carrierDetails.riderList.length; j++) {
                                            for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                                                if ($rootScope.carrierDetails.riderList[j].carrierId == $rootScope.lifeQuoteResult[i].carrierId &&
                                                    $rootScope.carrierDetails.riderList[j].productId == $rootScope.lifeQuoteResult[i].productId) {
                                                    $rootScope.lifeQuoteResult[i].riders = $rootScope.carrierDetails.riderList[j].riders;
                                                }
                                            }
                                        }
                                        for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                                            for (var k = 0; k < $rootScope.lifeQuoteResult[i].riderList.length; k++) {
                                                for (var l = 0; l < $rootScope.lifeQuoteResult[i].riders.length; l++) {
                                                    if ($rootScope.lifeQuoteResult[i].riderList[k].riderId == $rootScope.lifeQuoteResult[i].riders[l].riderId) {
                                                        $rootScope.lifeQuoteResult[i].riders[l] = $rootScope.lifeQuoteResult[i].riderList[k];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                                            for (var m = 0; m < $rootScope.lifeQuoteResult[i].riders.length; m++) {
                                                if ($rootScope.lifeQuoteResult[i].riders[m].riderType == 'At Additional Cost') {
                                                    $rootScope.lifeQuoteResult[i].riders[m].riderImgPath = "additionalCost";
                                                    $rootScope.lifeQuoteResult[i].riders[m].riderTooltipName = "Additional Cost";
                                                } else if ($rootScope.lifeQuoteResult[i].riders[m].riderType == 'Not Available') {
                                                    $rootScope.lifeQuoteResult[i].riders[m].riderImgPath = "notAvailable";
                                                    $rootScope.lifeQuoteResult[i].riders[m].riderTooltipName = "Not Available";
                                                } else if ($rootScope.lifeQuoteResult[i].riders[m].riderType == 'Included') {
                                                    $rootScope.lifeQuoteResult[i].riders[m].riderImgPath = "included";
                                                    $rootScope.lifeQuoteResult[i].riders[m].riderTooltipName = "Included";
                                                }
                                            }
                                        }
                                        localStorageService.set("addOnCoverForLife", addOnCoverForLife);
                                        localStorageService.set("lifeQuoteInputParamaters", $scope.quote);
                                        localStorageService.set("lifePersonalDetails", $scope.personalDetails);
                                        localStorageService.set("selectedBusinessLineId", $scope.lifeResponse.businessLineId);
                                        localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.LIFE_UNIQUE_QUOTE_ID);

                                        if (_addToCartStatus) {
                                            $location.path("/PBLifeResult");
                                        } else {
                                            $location.path("/lifeResult");
                                        }
                                    });
                                });
                            }, 100);
                        } else if ($scope.selectedBusinessLineId == 6) {
                            $scope.quote = {};
                            $scope.personalDetails = {};

                            $scope.criticalIllnessResponse = callback.data;
                            $scope.quote = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest;
                            $scope.quote.quoteParam = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest.quoteParam;
                            $scope.quote.personalDetails = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest.personalDetails;
                            $scope.personalDetails = $scope.quote.personalDetails;
                            $scope.CRITICAL_ILLNESS_UNIQUE_QUOTE_ID = $scope.criticalIllnessResponse.QUOTE_ID;

                            $rootScope.ciQuoteResult = $scope.criticalIllnessResponse.criticalIllnessQuoteResponse;
                            $rootScope.selectedBusinessLineId = $scope.criticalIllnessResponse.businessLineId;

                            // setTimeout(function () {
                            //     getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.life, $scope.p365Labels.request.findAppConfig, function (addOnCoverForLife) {
                            //         localStorageService.set("addOnCoverForLife", addOnCoverForLife);
                            //         getDocUsingId(RestAPI, $scope.p365Labels.common.ridersDocInDB, function (carrierDetails) {
                            //             $rootScope.carrierDetails = carrierDetails;
                            //             var carrierRiderList = angular.copy($rootScope.carrierDetails);
                            //             //if ($scope.recommendedLifeRiders && _addToCartStatus) {
                            //             if ($scope.recommendedLifeRiders) {
                            //                 for (let i = 0; i < addOnCoverForLife.length; i++) {
                            //                     for (let j = 0; j < $scope.recommendedLifeRiders.length; j++) {
                            //                         if (addOnCoverForLife[i].riderId == $scope.recommendedLifeRiders[j].riderId) {
                            //                             addOnCoverForLife[i].isRecommended = true;
                            //                         }
                            //                     }
                            //                 }
                            //             }

                            //             $rootScope.carrierDetails = angular.copy(carrierRiderList);
                            //             for (var j = 0; j < $rootScope.carrierDetails.riderList.length; j++) {
                            //                 for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                            //                     if ($rootScope.carrierDetails.riderList[j].carrierId == $rootScope.lifeQuoteResult[i].carrierId
                            //                         && $rootScope.carrierDetails.riderList[j].productId == $rootScope.lifeQuoteResult[i].productId) {
                            //                         $rootScope.lifeQuoteResult[i].riders = $rootScope.carrierDetails.riderList[j].riders;
                            //                     }
                            //                 }
                            //             }
                            //             for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                            //                 for (var k = 0; k < $rootScope.lifeQuoteResult[i].riderList.length; k++) {
                            //                     for (var l = 0; l < $rootScope.lifeQuoteResult[i].riders.length; l++) {
                            //                         if ($rootScope.lifeQuoteResult[i].riderList[k].riderId == $rootScope.lifeQuoteResult[i].riders[l].riderId) {
                            //                             $rootScope.lifeQuoteResult[i].riders[l] = $rootScope.lifeQuoteResult[i].riderList[k];
                            //                             break;
                            //                         }
                            //                     }
                            //                 }
                            //             }

                            //             for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                            //                 for (var m = 0; m < $rootScope.lifeQuoteResult[i].riders.length; m++) {
                            //                     if ($rootScope.lifeQuoteResult[i].riders[m].riderType == 'At Additional Cost') {
                            //                         $rootScope.lifeQuoteResult[i].riders[m].riderImgPath = "additionalCost";
                            //                         $rootScope.lifeQuoteResult[i].riders[m].riderTooltipName = "Additional Cost";
                            //                     } else if ($rootScope.lifeQuoteResult[i].riders[m].riderType == 'Not Available') {
                            //                         $rootScope.lifeQuoteResult[i].riders[m].riderImgPath = "notAvailable";
                            //                         $rootScope.lifeQuoteResult[i].riders[m].riderTooltipName = "Not Available";
                            //                     } else if ($rootScope.lifeQuoteResult[i].riders[m].riderType == 'Included') {
                            //                         $rootScope.lifeQuoteResult[i].riders[m].riderImgPath = "included";
                            //                         $rootScope.lifeQuoteResult[i].riders[m].riderTooltipName = "Included";
                            //                     }
                            //                 }
                            //             }
                            // localStorageService.set("addOnCoverForLife", addOnCoverForLife);
                            localStorageService.set("criticalIllnessQuoteInputParamaters", $scope.quote);
                            localStorageService.set("criticalIllnessPersonalDetails", $scope.personalDetails);
                            localStorageService.set("selectedBusinessLineId", $scope.criticalIllnessResponse.businessLineId);
                            localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID", $scope.CRITICAL_ILLNESS_UNIQUE_QUOTE_ID);

                            if (_addToCartStatus) {
                                $location.path("/PBLifeResult");
                            } else {
                                $location.path("/criticalIllnessResult");
                            }
                            //         });
                            //     });
                            // }, 100);
                        }
                    }
                });
            }

            $scope.openHealthPopup = function(selectedTab) {
                $scope.healthParam = localStorageService.get("healthQuoteInputParamaters");
                $rootScope.selectedTabHealth = selectedTab;
                setTimeout(function() {
                    $scope.filterPincode = $scope.healthParam.personalInfo.pincode;
                    $scope.filterCity = $scope.healthParam.personalInfo.city;
                    var str = $scope.healthParam.personalInfo.city;
                    var splitStr = str.toLowerCase().split(' ');
                    for (var i = 0; i < splitStr.length; i++) {
                        // You do not need to check if i is larger than splitStr length, as your for does that for you
                        // Assign it back to the array
                        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                    }
                    // Directly return the joined string
                    var cityFormatted = splitStr.join(' ');

                    getListFromDB(RestAPI, cityFormatted, "cashlessHospital", $scope.p365Labels.request.findAppConfig, function(hospitalList) {
                        if (hospitalList.responseCode == $scope.p365Labels.responseCode.success) {
                            $scope.hospitalList = hospitalList.data;
                            localStorageService.set("hospitalList", hospitalList.data);

                        }
                    });
                    $scope.premiumModalHealth = !$scope.premiumModalHealth;
                }, 100)
            }
            $scope.hidePremiumModalHealth = function() {
                $scope.premiumModalHealth = false;
            }

            $scope.openLifePopup = function(selectedTab) {
                $rootScope.selectedTabLife = selectedTab;
                $scope.premiumModalLife = !$scope.premiumModalLife;
            }
            $scope.hidePremiumModalLife = function() {
                $scope.premiumModalLife = false;
            }

            $scope.openBikePopup = function(selectedTab) {
                $rootScope.selectedTabBike = selectedTab;
                $scope.premiumModalBike = !$scope.premiumModalBike;
            }
            $scope.hidePremiumModalBike = function() {
                $scope.premiumModalBike = false;
            }

            $scope.openCarPopup = function(selectedTab) {
                $scope.garageList = {};
                if (localStorageService.get("carQuoteInputParamaters")) {
                    $scope.garageList.city = localStorageService.get("carQuoteInputParamaters").vehicleInfo.city;
                    $scope.garageList.variantId = localStorageService.get("carQuoteInputParamaters").vehicleInfo.variantId;
                    $scope.garageList.regisCode = localStorageService.get("carQuoteInputParamaters").vehicleInfo.RTOCode;
                } //else if(localStorageService.get("professionalQuoteParams")){
                // 	$scope.garageList.city = localStorageService.get("professionalQuoteParams").commonInfo.addressDetails.city;
                // 	$scope.garageList.variantId = localStorageService.get("professionalQuoteParams").carInfo.variantId;
                // 	$scope.garageList.regisCode = localStorageService.get("professionalQuoteParams").carInfo.RTOCode;
                // }
                RestAPI.invoke($scope.p365Labels.transactionName.getGarageDetails, $scope.garageList).then(function(callback) {
                    if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                        var garageResponse = callback;
                        if (garageResponse != null && String(garageResponse) != "undefined") {
                            localStorageService.set("garageDetails", garageResponse.data);
                            $scope.garageDetails = garageResponse.data;
                            $rootScope.selectedTabCar = selectedTab;
                            $scope.premiumModalCar = !$scope.premiumModalCar;
                        } else {
                            localStorageService.set("garageDetails", undefined);
                        }
                    } else {
                           localStorageService.set("garageDetails", undefined);
                    }
                });

            }
            $scope.garageDataCheck = function(selCarrierID) {
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
            $scope.getProductFeatures = function(selectedProduct, productFetchStatus) {
                var variableReplaceArray = [];
                var productFeatureJSON = {};
                if (lob == 1) {
                    productFeatureJSON.documentType = "LifeProduct";
                } else if (lob == 6) {
                    productFeatureJSON.documentType = "CriticalIllnessProduct";
                }
                productFeatureJSON.carrierId = selectedProduct.carrierId;
                productFeatureJSON.productId = selectedProduct.productId;
                productFeatureJSON.businessLineId = 1;

                /*for (var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++) {
                	if (selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
                		$scope.brochureUrl = wp_path + $rootScope.carrierDetails.brochureList[i].brochureUrl;
                }*/
                variableReplaceArray.push({
                    'id': '{{sumInsured}}',
                    'value': Math.round(selectedProduct.sumInsured)
                });
                variableReplaceArray.push({
                    'id': '{{monthlyPayout}}',
                    'value': selectedProduct.monthlyPayout
                });
                variableReplaceArray.push({
                    'id': '{{policyTerm}}',
                    'value': selectedProduct.policyTerm
                });

                if (productFetchStatus) {
                    RestAPI.invoke("getProductFeatures", productFeatureJSON).then(function(callback) {
                        getDocUsingId(RestAPI, $scope.p365Labels.common.ridersDocInDB, function(carrierDetails) {
                            $rootScope.carrierDetails = carrierDetails;
                            for (var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++) {
                                if (selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
                                    $scope.brochureUrl = wp_path + $rootScope.carrierDetails.brochureList[i].brochureUrl;
                            }
                        });
                        $scope.productFeaturesList = callback.data[0].Features;
                        for (var j = 0; j < $scope.productFeaturesList.length; j++) {
                            for (var i = 0; i < variableReplaceArray.length; i++) {
                                if (p365Includes($scope.productFeaturesList[j].details.toString(), variableReplaceArray[i].id)) {
                                    $scope.productFeaturesList[j].details = $scope.productFeaturesList[j].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
                                }
                            }
                        }
                    });
                }
                $scope.modelBeneFeatureLife = true;
            }

            $scope.modelBeneFeatureLife = false;
            $scope.closeBeneFeatureLife = function() {
                $scope.modelBeneFeatureLife = false;
            }


            $scope.healthmodalBeneFeature = false;
            $scope.viewBeneFeature = function(selectedData) {
                $scope.healthmodalBeneFeature = true;
                $scope.beneFeatures = selectedData;
            };

            $scope.closeBeneFeatureHealth = function() {
                $scope.healthmodalBeneFeature = false;
            };

            var googleMapURL = "https://www.google.co.in/maps/search/";
            $scope.openMap = function(garage) {
                $scope.searchKey = googleMapURL + '' + garage.repairerName + ',' + garage.pincode;
                window.open($scope.searchKey, '_blank');
            }
            $scope.openMapHospital = function(hos) {
                $scope.searchKeyHospital = googleMapURL + '' + hos.hospitalName + ',' + hos.pincode;
                window.open($scope.searchKeyHospital, '_blank');
            }

            $scope.hidePremiumModalCar = function() {
                $scope.premiumModalCar = false;
            }

            $scope.hideEmailModal = function() {
                $scope.emailSuccessPopup = false;
            }


            $scope.shareProfile = function(profileToBeShared, funcType) {
                if (localStorageService.get("quoteUserInfo")) 
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");

                    //Added by gauri for mautic application				
                    if (imauticAutomation == true) {
                        if (funcType === 'SHARERISKPROFILE') {
                            imatProfessionalLeadQuoteInfo(localStorageService, $scope, 'ShareRiskProfile');
                        }
                        if (funcType === 'SHAREINSURANCEPROFILE') {
                            imatProfessionalLeadQuoteInfo(localStorageService, $scope, 'ShareInsuranceProfile');
                        }
                    }else{
                        var request = {};
                    //encoding all the paramter to be shared by the user.
                    var encodeProfessionalQuote = localStorageService.get("PROF_QUOTE_ID");
                    // var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
                    var encodeLOB = 0;
                    var encodeEmailId = $scope.quoteUserInfo.emailId;

                   if(localStorageService.get("PROF_QUOTE_ID_ENCRYPTED"))
                        $scope.encryptedProfessionalQuote_Id = localStorageService.get("PROF_QUOTE_ID_ENCRYPTED");

                    $scope.encryptedLOB = 0;
                    $scope.encryptedEmail = $scope.quoteUserInfo.emailId;


                    request.funcType = funcType;
                    request.isBCCRequired = 'Y';
                    request.username = $scope.quoteUserInfo.emailId;

                    if ($scope.quoteUserInfo.mobileNumber) {
                        request.mobileNumber = $scope.quoteUserInfo.mobileNumber;
                    }
                    request.paramMap = {};
                    request.paramMap.docId = String($scope.encryptedProfessionalQuote_Id);
                    request.paramMap.LOB = String($scope.encryptedLOB);
                    request.paramMap.userId = String($scope.encryptedEmail);
                    request.paramMap.firstName = $scope.quoteUserInfo.firstName;
                    request.paramMap.helplineNumber = "(022) 68284343";
                    // request.paramMap.
                    // request.paramMap.


                    var body = {};
                    if (profileToBeShared != null && profileToBeShared != undefined && profileToBeShared.length > 0) {
                        if (profileToBeShared == "riskProfile" || profileToBeShared == "insuranceAssessment") {
                            body.longURL = shareProfessionalQuoteLink + request.paramMap.docId + "&LOB=" + request.paramMap.LOB + "&userId=" + request.paramMap.userId + "&sharedProfile=" + profileToBeShared;
                        } else {
                            body.longURL = shareProfessionalQuoteLink + request.paramMap.docId + "&LOB=" + request.paramMap.LOB + "&userId=" + request.paramMap.userId;
                        }
                    } else {
                        body.longURL = shareProfessionalQuoteLink + request.paramMap.docId + "&LOB=" + request.paramMap.LOB + "&userId=" + request.paramMap.userId;
                    }

                    $http({ method: 'POST', url: getShortURLLink, data: body }).
                        success(function (shortURLResponse) {

                            var transactionName = '';
                            if (funcType == 'WELCOMEEMAIL') {
                                transactionName = "sendWelcomeEmail";
                            } else {
                                transactionName = sendEmail;
                            }
                            var shareQuoteRequest = {};
                            var header = {};
                            header.messageId = messageIDVar;
                            header.campaignID = campaignIDVar;
                            header.source = sourceOrigin;
                            header.transactionName = transactionName;
                            header.deviceId = deviceIdOrigin;
                            shareQuoteRequest.header = header;
                            shareQuoteRequest.body = request;
                            if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                if (shortURLResponse.data) {
                                    request.paramMap.url = shortURLResponse.data.shortURL;
                                    shareQuoteRequest.body = request;
                                } else {
                                    request.paramMap.url = body.longURL;
                                    shareQuoteRequest.body = request;
                                }
                                $http({ method: 'POST', url: getQuoteCalcLink, data: shareQuoteRequest }).
                                    success(function (callback) {
                                        if (callback) {
                                            var emailResponse = JSON.parse(JSON.stringify(callback));
                                            if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                $scope.riskChartModal = false;
                                                $scope.emailSuccessPopup = true;
                                                $scope.shareProfileError = "";
                                                $scope.insuranceAssessChartModal = false;
                                            } else {
                                                $scope.shareProfileError = $scope.p365Labels.errorMessage.shareProfileError;
                                                //localStorageService.set("emailDetails", undefined);
                                            }
                                        }
                                    });
                            } else {
                                request.paramMap.url = body.longURL;
                                shareQuoteRequest.body = request;
                                $http({ method: 'POST', url: getQuoteCalcLink, data: shareQuoteRequest }).
                                    success(function (callback) {
                                        var emailResponse = JSON.parse(callback);
                                        if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.riskChartModal = false;
                                            $scope.emailSuccessPopup = true;
                                            $scope.insuranceAssessChartModal = false;
                                            $scope.shareProfileError = "";
                                        } else {
                                            $scope.shareProfileError = $scope.p365Labels.errorMessage.shareProfileError;
                                            // localStorageService.set("emailDetails", undefined);
                                        }
                                    });
                            }

                        });
                
                    }
                    $scope.riskChartModal = false;
                    $scope.emailSuccessPopup = true;
                    $scope.shareProfileError = "";
                    $scope.insuranceAssessChartModal = false;
            
            }
            $scope.sendOTP = function() {
                if ($scope.quoteUserInfo.mobileNumber) {
                  
                    var validateAuthParam = {};
                    validateAuthParam.paramMap = {};
                    validateAuthParam.mobileNumber = $scope.quoteUserInfo.mobileNumber;
                    validateAuthParam.funcType = $scope.p365Labels.functionType.otpAuth;
                    validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function(createOTP) {
                        if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                            $scope.createOTPError = "";
                            $scope.modalOTPError = false;
                        } else if (createOTP.responseCode == $scope.p365Labels.responseCode.userNotExist) {
                            $scope.createOTPError = createOTP.message;
                            $scope.modalOTPError = true;
                        } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                            $scope.createOTPError = createOTP.message;
                            $scope.modalOTPError = true;
                        } else if (createOTP.responseCode == $scope.p365Labels.responseCode.mobileInvalidCode) {
                            $scope.createOTPError = createOTP.message;
                            $scope.modalOTPError = true;
                        } else {
                            $scope.createOTPError = $scope.p365Labels.errorMessage.createOTP;
                            $scope.modalOTPError = true;
                        }
                    });
                }
            };

            $scope.resendOTP = function() {
                if ($scope.quoteUserInfo.mobileNumber) {
                    var validateAuthParam = {};
                    validateAuthParam.paramMap = {};
                    validateAuthParam.mobileNumber = $scope.quoteUserInfo.mobileNumber;
                    validateAuthParam.funcType = $scope.p365Labels.functionType.otpAuth;
                    validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function(createOTP) {
                        if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                            $scope.createOTPError = "";
                            $scope.modalOTPError = false;
                        } else if (createOTP.responseCode == $scope.p365Labels.responseCode.userNotExist) {
                            $scope.createOTPError = createOTP.message;
                            $scope.modalOTPError = true;
                        } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                            $scope.createOTPError = createOTP.message;
                            $scope.modalOTPError = true;
                        } else if (createOTP.responseCode == $scope.p365Labels.responseCode.mobileInvalidCode) {
                            $scope.createOTPError = createOTP.message;
                            $scope.modalOTPError = true;
                        } else {
                            $scope.createOTPError = $scope.p365Labels.errorMessage.createOTP;
                            $scope.modalOTPError = true;
                        }
                    });
                }
            };
            // $scope.submitOTP = function() {
            //     var authenticateUserParam = {};
            //     authenticateUserParam.mobileNumber = $scope.quoteUserInfo.mobileNumber;
            //     authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
            //     getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function(validateOTP) {
            //         if (validateOTP.responseCode == $scope.p365Labels.responseCode.success) {
            //             $rootScope.authenticated = true;
            //             $scope.invalidOTPError = "";
            //         } else if (validateOTP.responseCode == $scope.p365Labels.responseCode.noRecordsFound) {
            //             $rootScope.authenticated = false;
            //             $scope.invalidOTPError = $scope.p365Labels.validationMessages.invalidOTP;
            //         } else if (validateOTP.responseCode == $scope.p365Labels.responseCode.expiredOTP) {
            //             $rootScope.authenticated = false;
            //             $scope.invalidOTPError = $scope.p365Labels.errorMessage.expiredOTP;
            //         } else if (validateOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
            //             $rootScope.authenticated = false;
            //             $scope.invalidOTPError = validateOTP.message;
            //         } else {
            //             $rootScope.authenticated = false;
            //             $scope.invalidOTPError = $scope.p365Labels.errorMessage.authOTP;
            //         }
            //     });
            // };


            $scope.hideRiskAndInsuranceProfilePopup = function() {
                $scope.riskAndInsuranceProfilePopup = false;
                //  $scope.startTour();
            }

        }
    ]);