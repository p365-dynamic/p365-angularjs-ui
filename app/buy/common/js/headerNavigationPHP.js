/*

 * Description	: This file contains methods for get instant quote.
 * Author		: Sandip
 * Date			: 23 April 2018
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By

 *
 * */

var messageIDVar;

var campaignIDVar;
var scrollv; // register two global vars for two scrollable instances
angular.module('headerNavigationApp', ['LocalStorageModule'])
	.controller('headerNavigationController', ['$scope', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q', function ($scope, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q) {
			
			$rootScope.headerNavigation = wp_path + 'buy/common/html/headerNavigationPHP.html';
			$scope.lifeURL = wp_path + 'buy/life/html/AssuranceInstantQuote.html'
			$scope.healthURL = wp_path + 'buy/health/html/MedicalInstantQuote.html'
			$scope.carURL = wp_path + 'buy/caheaderNavigationr/html/FourWheelerInstantQuote.html';
			$scope.bikeURL = wp_path + 'buy/bike/html/TwoWheelerInstantQuote.html';
			$scope.travelURL = wp_path + 'buy/travel/html/TravelInstantQuote.html';
			$scope.criticalIllnessQuoteURL = wp_path + 'buy/criticalIllness/html/CriticalIllnessInstantQuote.html';
			$scope.personalAccidentQuoteURL = wp_path + 'buy/personalAccident/html/PersonalAccidentInstantQuote.html';
			$scope.professionalQuoteURL = wp_path + 'buy/common/html/professionalJourney.html';
			   //$scope.P365Token = $location.search().P365Token;

			if(!pospEnabled){
			$rootScope.tabsMenu = [{ businessLineId: 3, url: $scope.carURL, className: 'carTab tabs wp_border32', name: "car", title: "Car", inputTitle: "car" },
			{ businessLineId: 2, url: $scope.bikeURL, className: 'bikeTab tabs wp_border32', name: "bike", title: "Bike", inputTitle: "bike" },
			{ businessLineId: 1, url: $scope.lifeURL, className: 'lifeTab tabs wp_border32', name: "life", title: "Life", inputTitle: "life" },
			{ businessLineId: 4, url: $scope.healthURL, className: 'healthTab tabs wp_border32', name: "health", title: "Health", inputTitle: "family" },
			{ businessLineId: 5, url: $scope.travelURL, className: 'travelTab tabs wp_border32', name: "travel", title: "Travel", inputTitle: "travel", tabImgId: 4 },
			{ businessLineId: 6, url: $scope.criticalIllnessQuoteURL, className: 'criticalIllnessTab tabs wp_border32', name: "criticalIllness", title: "CI", inputTitle: "CI", tabImgId: 5, flagToShow: $rootScope.idepProdEnv },
			{ businessLineId: 8, url: $scope.personalAccidentQuoteURL, className: 'personalAccidentTab tabs wp_border32', name: "personalAccident", title: "PA", inputTitle: "PA", tabImgId: 6, flagToShow: $rootScope.idepProdEnv },
			{ businessLineId: 0, url: $scope.professionalQuoteURL, className: 'professionalTab tabs wp_border32', name: "professional", title: "Professional", inputTitle: "Professional", tabImgId: 0 }];
			}else{
				$rootScope.tabsMenu = [{ businessLineId: 3, url: $scope.carURL, className: 'carTab tabs wp_border32', name: "car", title: "Car", inputTitle: "car" },
			{ businessLineId: 2, url: $scope.bikeURL, className: 'bikeTab tabs wp_border32', name: "bike", title: "Bike", inputTitle: "bike" },
			{ businessLineId: 1, url: $scope.lifeURL, className: 'lifeTab tabs wp_border32', name: "life", title: "Life", inputTitle: "life" ,flagToShow: $rootScope.idepProdEnv},
			{ businessLineId: 4, url: $scope.healthURL, className: 'healthTab tabs wp_border32', name: "health", title: "Health", inputTitle: "family" ,flagToShow: $rootScope.idepProdEnv},
			{ businessLineId: 5, url: $scope.travelURL, className: 'travelTab tabs wp_border32', name: "travel", title: "Travel", inputTitle: "travel", tabImgId: 4,flagToShow: $rootScope.idepProdEnv },
			{ businessLineId: 6, url: $scope.criticalIllnessQuoteURL, className: 'criticalIllnessTab tabs wp_border32', name: "criticalIllness", title: "CI", inputTitle: "CI", tabImgId: 5, flagToShow: $rootScope.idepProdEnv },
			{ businessLineId: 8, url: $scope.personalAccidentQuoteURL, className: 'personalAccidentTab tabs wp_border32', name: "personalAccident", title: "PA", inputTitle: "PA", tabImgId: 6, flagToShow: $rootScope.idepProdEnv },
			{ businessLineId: 0, url: $scope.professionalQuoteURL, className: 'professionalTab tabs wp_border32', name: "professional", title: "Professional", inputTitle: "Professional", tabImgId: 0 }];
			}

			$scope.className = (!$rootScope.idepProdEnv && !agencyPortalEnabled && !$rootScope.wordPressEnabled) ? "iPOS17Width" : "iPOS14Width";
			$scope.tabsWidthClassName = ($rootScope.idepProdEnv && $rootScope.wordPressEnabled) ? "wid35" : "wid40";
			$scope.tabs_li_width = ($rootScope.idepProdEnv && $rootScope.wordPressEnabled) ? "20%" : "16%";
			// condition added for agency portal	

			if (agencyPortalEnabled && !pospEnabled) {
				var lob = localStorage.getItem("lob_array");
				if (lob != null && lob != "0" && lob != undefined) {
					var lob_arr = lob.split(',');
					console.log(' lob_arr : ',lob_arr);
					$rootScope.tabsMenu = [];
					for (var i = 0; i < lob_arr.length; i++) {
						if (lob_arr[i] == "3") {
							if ($rootScope.tabsMenu.indexOf({ businessLineId: 3, url: $scope.carURL, className: 'carTab tabs wp_border32', name: "car", title: "Car", inputTitle: "car" }) < 0) {
								$rootScope.tabsMenu.push({ businessLineId: 3, url: $scope.carURL, className: 'carTab tabs wp_border32', name: "car", title: "Car", inputTitle: "car" });
								console.log("$rootScope.tabsMenu --d",$rootScope.tabsMenu);
							}
						}
						if (lob_arr[i] == "2") {
							if ($rootScope.tabsMenu.indexOf({ businessLineId: 2, url: $scope.bikeURL, className: 'bikeTab tabs wp_border32', name: "bike", title: "Bike", inputTitle: "bike" }) < 0) {
								$rootScope.tabsMenu.push({ businessLineId: 2, url: $scope.bikeURL, className: 'bikeTab tabs wp_border32', name: "bike", title: "Bike", inputTitle: "bike" });
							}
						}
						if (lob_arr[i] == "1") {
							if ($rootScope.tabsMenu.indexOf({ businessLineId: 1, url: $scope.lifeURL, className: 'lifeTab tabs wp_border32', name: "life", title: "Term", inputTitle: "life" }) < 0) {
								$rootScope.tabsMenu.push({ businessLineId: 1, url: $scope.lifeURL, className: 'lifeTab tabs wp_border32', name: "life", title: "Term", inputTitle: "life" });
							}
						}
						if (lob_arr[i] == "4") {
							if ($rootScope.tabsMenu.indexOf({ businessLineId: 4, url: $scope.healthURL, className: 'healthTab tabs wp_border32', name: "health", title: "Health", inputTitle: "family" }) < 0) {
								$rootScope.tabsMenu.push({ businessLineId: 4, url: $scope.healthURL, className: 'healthTab tabs wp_border32', name: "health", title: "Health", inputTitle: "family" });
							}
						}
						if (lob_arr[i] == "5") {
							if ($rootScope.tabsMenu.indexOf({ businessLineId: 5, url: $scope.travelURL, className: 'travelTab tabs wp_border32', name: "travel", title: "Travel", inputTitle: "travel" }) < 0) {
								$rootScope.tabsMenu.push({ businessLineId: 5, url: $scope.travelURL, className: 'travelTab tabs wp_border32', name: "travel", title: "Travel", inputTitle: "travel" });
							}
						}
						if (lob_arr[i] == "6") {
							if ($rootScope.tabsMenu.indexOf({ businessLineId: 6, url: $scope.criticalIllnessQuoteURL, className: 'criticalIllnessTab tabs wp_border32', name: "criticalIllness", title: "CI", inputTitle: "CI", flagToShow: $rootScope.idepProdEnv }) < 0) {
								$rootScope.tabsMenu.push({ businessLineId: 6, url: $scope.criticalIllnessQuoteURL, className: 'criticalIllnessTab tabs wp_border32', name: "criticalIllness", title: "CI", inputTitle: "CI", flagToShow: $rootScope.idepProdEnv });
							}
						}
						if (lob_arr[i] == "8") {
							if ($rootScope.tabsMenu.indexOf({ businessLineId: 8, url: $scope.personalAccidentQuoteURL, className: 'personalAccidentTab tabs wp_border32', name: "personalAccident", title: "PA", inputTitle: "PA", flagToShow: $rootScope.idepProdEnv }) < 0) {
								$rootScope.tabsMenu.push({ businessLineId: 8, url: $scope.personalAccidentQuoteURL, className: 'personalAccidentTab tabs wp_border32', name: "personalAccident", title: "PA", inputTitle: "PA", flagToShow: $rootScope.idepProdEnv });
							}
						}
					}
				}

			}
			if (localStorageService.get("selectedBusinessLineId") == 3) {
				$scope.tabMenu = { businessLineId: 3, url: $scope.carURL, className: 'carTab tabs wp_border32', name: "car", title: "Car", inputTitle: "car" };
			}
			else if (localStorageService.get("selectedBusinessLineId") == 2) {
				$scope.tabMenu = { businessLineId: 2, url: $scope.bikeURL, className: 'bikeTab tabs wp_border32', name: "bike", title: "Bike", inputTitle: "bike" }
			}
			else if (localStorageService.get("selectedBusinessLineId") == 1) {
				$scope.tabMenu = { businessLineId: 1, url: $scope.lifeURL, className: 'lifeTab tabs wp_border32', name: "life", title: "Term", inputTitle: "life" }
			}
			else if (localStorageService.get("selectedBusinessLineId") == 4) {
				$scope.tabMenu = { businessLineId: 4, url: $scope.healthURL, className: 'healthTab tabs wp_border32', name: "health", title: "Health", inputTitle: "family" }
			} else if (localStorageService.get("selectedBusinessLineId") == 5) {
				$scope.tabMenu = { businessLineId: 5, url: $scope.travelURL, className: 'travelTab tabs wp_border32', name: "travel", title: "Travel", inputTitle: "travel" }
			} else if (localStorageService.get("selectedBusinessLineId") == 6) {
				$scope.tabMenu = { businessLineId: 6, url: $scope.criticalIllnessQuoteURL, className: 'criticalIllnessTab tabs wp_border32', name: "criticalIllness", title: "CI", inputTitle: "CI", flagToShow: $rootScope.idepProdEnv }
			} else if (localStorageService.get("selectedBusinessLineId") == 8) {
				$scope.tabMenu = { businessLineId: 8, url: $scope.personalAccidentQuoteURL, className: 'personalAccidentTab tabs wp_border32', name: "personalAccident", title: "PA", inputTitle: "PA" }
			}

			if (!(localStorageService.get("selectedBusinessLineId"))) {
				localStorageService.set("selectedBusinessLineId", 3);
			}

			$scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
			$rootScope.isActiveTab2 = $scope.selectedBusinessLineId;

			for (var i = 0; i < $rootScope.tabsMenu.length; i++) {
				if ($rootScope.tabsMenu[i].businessLineId == $scope.selectedBusinessLineId) {
					$scope.inputTitle = $rootScope.tabsMenu[i].inputTitle;
					$scope.currentTab = $rootScope.tabsMenu[i].url;
					break;
				}
			}

			//checking for lead Id
			var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
			if (quoteUserInfoCookie != null) {
				if (quoteUserInfoCookie.messageId != undefined || quoteUserInfoCookie.messageId != null || quoteUserInfoCookie.messageId != '') {
					messageIDVar = quoteUserInfoCookie.messageId;
				}
			}
			if ($location.search().messageId) {
				messageIDVar = $location.search().messageId;
			}

			$rootScope.setLOB = function (LOB) {
				localStorage.setItem('selectedBusinessLineId', LOB);
				localStorageService.set("selectedBusinessLineId", LOB);

				if ($location.path() != '/dashboard') {
					$location.path("/quote");
				} else {
					window.location.href = window.location.protocol + '//' + window.location.host;
				}
			}

			//function added to redirect  result screen,if all carrier response came. 
			$scope.redirectToResult = function () {
				$scope.LOB = localStorageService.get("selectedBusinessLineId");
				if (Number($scope.LOB) == 1) {
					if ($rootScope.lifeQuoteRequest.length == $scope.lifeQuoteResponse.length) {
						$rootScope.loading = false;
						$location.path("/assuranceResult");
					}
				} else if (Number($scope.LOB) == 2) {
					if($rootScope.bikeQuoteResult.length > 0){
					//if ($rootScope.bikeQuoteRequest.length == $scope.bikeQuoteResponse.length) {
						$rootScope.loading = false;
						$location.path("/bikeResult");

					}
				} else if (Number($scope.LOB) == 3) {
					//if ($rootScope.carQuoteRequest.length == $scope.carQuoteResponse.length) {
					if($rootScope.carQuoteResult.length > 0){
					    $rootScope.loading = false;
						$location.path("/carResult");
					}
				} else if (Number($scope.LOB) == 4) {
					if ($rootScope.healthQuoteRequest.length == $scope.healthQuoteResponse.length) {
						$rootScope.loading = false;
						$location.path("/healthResult");
					}
				} else if (Number($scope.LOB) == 5) {
					if ($rootScope.travelQuoteRequest.length == $scope.travelQuoteResponse.length) {
						$rootScope.loading = false;
						$location.path("/travelResult");
					}
				} else if (Number($scope.LOB) == 6) {
					if ($rootScope.ciQuoteRequest.length == $scope.ciQuoteResponse.length) {
						$rootScope.loading = false;
						$location.path("/criticalIllnessResult");
					}
				} else if (Number($scope.LOB) == 8) {
					if ($rootScope.paQuoteRequest.length == $scope.paQuoteResponse.length) {
						$rootScope.loading = false;
						$location.path("/personalAccidentResult");
					}
				}
			}

			$scope.getQuoteTemplateFunction = function () {
				if (!$rootScope.wordPressEnabled) {
					$scope.displayResult = true;
				}
				if (localStorageService.get("userLoginInfo") == null || String(localStorageService.get("userLoginInfo")) == "undefined") {
					var userLoginInfo = {};
					userLoginInfo.username = undefined;
					userLoginInfo.mobileNumber = undefined;
					userLoginInfo.status = false;
					localStorageService.set("userLoginInfo", userLoginInfo);
				}
				$scope.globalLabel = localStorageService.get("applicationLabels").globalLabels;

				var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");

				if (!quoteUserInfoCookie) {
					$scope.quoteUserInfo = {};
					$scope.quoteUserInfo.messageId = '';
					$scope.quoteUserInfo.termsCondition = true;
				} else {
					$scope.quoteUserInfo = quoteUserInfoCookie;
				}

				$rootScope.selectedRegData = undefined;
				if (localStorageService.get("userLoginInfo")) {
					$rootScope.userLoginStatus = localStorageService.get("userLoginInfo").status;
					$rootScope.username = localStorageService.get("userLoginInfo").username;
				}
				$scope.menuItems = menuItemsGeneric;

				$scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");

				//checking for lead Id
				if (quoteUserInfoCookie != null) {
					if (quoteUserInfoCookie.messageId != undefined || quoteUserInfoCookie.messageId != null || quoteUserInfoCookie.messageId != '') {
						messageIDVar = quoteUserInfoCookie.messageId;
					} else {
						messageIDVar = '';
					}
				}
				if ($location.search().messageId) {
					messageIDVar = $location.search().messageId;
				}

				$scope.bikeQuoteRequestFormation = function (bikeQuoteRequestParam) {
					$scope.quoteRequest = {};
					$scope.quoteRequest.vehicleInfo={};
					$scope.quoteRequest.quoteParam={};
		 
					$scope.quoteRequest.vehicleInfo.IDV = bikeQuoteRequestParam.vehicleInfo.IDV;
					$scope.quoteRequest.vehicleInfo.PreviousPolicyExpiryDate = bikeQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
					$scope.quote.vehicleInfo.TPPolicyExpiryDate = $scope.selectedProductInputParam.vehicleInfo.TPPolicyExpiryDate;
            $scope.quote.vehicleInfo.ODPolicyExpiryDate = $scope.selectedProductInputParam.vehicleInfo.ODPolicyExpiryDate;
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

				$scope.carQuoteRequestFormation = function (carQuoteRequestParam) {
					$scope.quoteRequest = {};
					$scope.quoteRequest.vehicleInfo={};
					$scope.quoteRequest.quoteParam={};
		 
					$scope.quoteRequest.vehicleInfo.IDV = carQuoteRequestParam.vehicleInfo.IDV;
					$scope.quoteRequest.vehicleInfo.PreviousPolicyExpiryDate = carQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
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
				   $scope.quoteRequest.vehicleInfo.fuel = carQuoteRequestParam.vehicleInfo.fuel;
				   $scope.quoteRequest.vehicleInfo.cubicCapacity= carQuoteRequestParam.vehicleInfo.cubicCapacity;  
				   $scope.quoteRequest.quoteParam.ncb = carQuoteRequestParam.quoteParam.ncb;
				   $scope.quoteRequest.quoteParam.ownedBy = carQuoteRequestParam.quoteParam.ownedBy;
				   $scope.quoteRequest.quoteParam.policyType = carQuoteRequestParam.quoteParam.policyType;
				   if(carQuoteRequestParam.quoteParam.riders)
				   $scope.quoteRequest.quoteParam.riders = carQuoteRequestParam.quoteParam.riders; 
		   }
		
				// Method to get RTO name based on city.	-	modification-0006
				$scope.getRegPlaceListUsingIPCity = function (cityName, callback) {
					if (cityName != null && String(cityName) != "undefined") {
						return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + cityName).then(function (response) {
							var rtoDetailsResponse = JSON.parse(response.data);
							var rtoDetail = {};

							if (rtoDetailsResponse.responseCode != $scope.globalLabel.responseCode.noRecordsFound) {
								$rootScope.vehicleInfo = {};
								$rootScope.vehicleInfo.selectedRegistrationObject = rtoDetailsResponse.data[0];
								rtoDetail.rtoName = rtoDetailsResponse.data[0].display;
								rtoDetail.rtoCity = rtoDetailsResponse.data[0].city;
								rtoDetail.rtoState = rtoDetailsResponse.data[0].state;
								rtoDetail.rtoObject = rtoDetailsResponse.data[0];
								rtoDetail.rtoStatus = true;
								getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
									if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
										rtoDetail.rtoPincode = resultedRTOInfo.data[0].pincode;
									} else {
										rtoDetail.rtoPincode = "";
									}
									localStorageService.set("registrationPlaceUsingIP", rtoDetail);
								});
							} else {
								rtoDetail.rtoName = undefined;
								rtoDetail.rtoCity = undefined;
								rtoDetail.rtoState = undefined;
								rtoDetail.rtoObject = undefined;
								rtoDetail.rtoStatus = false;
								localStorageService.set("registrationPlaceUsingIP", rtoDetail);
							}
							callback();
						});
					} else {
						var rtoDetail = {};
						rtoDetail.rtoName = undefined;
						rtoDetail.rtoCity = undefined;
						rtoDetail.rtoState = undefined;
						rtoDetail.rtoObject = undefined;
						rtoDetail.rtoStatus = false;
						localStorageService.set("registrationPlaceUsingIP", rtoDetail);
						callback();
					}

				};
				if (!localStorageService.get("websiteVisitedOnce")) {
					// Fetching default Metro cities and respective RTO details.
					var popularRTOParam = {};
					popularRTOParam.popularRTOList = "Y";
					getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getPopularRTO, popularRTOParam, function (callbackMetro) {
						 if(callbackMetro.data){
							console.log("defaultMetroListNotVar");
                            localStorageService.set("defaultMetroCityList", callbackMetro.data);
                            $scope.defaultMetroList = callbackMetro.data;
                            }else{
                            console.log("defaultMetroListVar");    
                            localStorageService.set("defaultMetroCityList", defaultMetroListVar);
                            $scope.defaultMetroList = defaultMetroListVar;
                            }
						var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
						if ($scope.selectedBusinessLineId == 3 && localStorageService.get("carQuoteInputParamaters")) {
							if ($rootScope.vehicleInfo) {
								if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
									cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
								}
								else {
									$scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
									cityName = $scope.vehicleInfo.city;
								}
							}
						}
						else if ($scope.selectedBusinessLineId == 2 && localStorageService.get("bikeQuoteInputParamaters")) {
							if ($rootScope.vehicleInfo) {
								if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
									cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
								}
								else {
									$scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
									cityName = $scope.vehicleInfo.city;
								}
							}
						}

						$scope.getRegPlaceListUsingIPCity(cityName, function () {
							for (var i = 0; i < $rootScope.tabsMenu.length; i++) {
								if ($rootScope.tabsMenu[i].businessLineId == $scope.selectedBusinessLineId) {
									$scope.inputTitle = $rootScope.tabsMenu[i].inputTitle;
									$scope.currentTab1 = $rootScope.tabsMenu[i].url;
									break;
								}
							}

						});
						var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");
						if (vehicleDetailsCookie) {
							if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
								vehicleDetailsCookie.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
								localStorageService.set("selectedCarDetails", vehicleDetailsCookie);
							}
						}

						var vehicleDetailsCookieBike = localStorageService.get("selectedBikeDetails");
						if (vehicleDetailsCookieBike) {
							if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
								vehicleDetailsCookieBike.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
								localStorageService.set("selectedBikeDetails", vehicleDetailsCookieBike);
							}
						}

					});
				} else {
					var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
					if ($scope.selectedBusinessLineId == 3 && localStorageService.get("carQuoteInputParamaters")) {
						if ($rootScope.vehicleInfo) {
							if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
								cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
							}
							else {
								$scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
								cityName = $scope.vehicleInfo.city;
							}
						}
					}
					else if ($scope.selectedBusinessLineId == 2 && localStorageService.get("bikeQuoteInputParamaters")) {
						if ($rootScope.vehicleInfo) {
							if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
								cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
							}
							else {
								$scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
								cityName = $scope.vehicleInfo.city;
							}
						}
					}

					$scope.getRegPlaceListUsingIPCity(cityName, function () {
						if ($rootScope.vehicleInfo) {
							if (($rootScope.vehicleInfo.registrationPlace == null || $rootScope.vehicleInfo.registrationPlace == undefined) && (localStorageService.get("registrationPlaceUsingIP") == undefined || localStorageService.get("registrationPlaceUsingIP").rtoStatus == false)) {
								var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
								$scope.getRegPlaceListUsingIPCity(cityName, function () {
									if ($scope.selectedBusinessLineId == 3) {
										$scope.$broadcast("callSingleClickCarQuote", {});
									} else if ($scope.selectedBusinessLineId == 2) {
										$scope.$broadcast("callSingleClickBikeQuote", {});
									}
								});
							}
						}

						for (var i = 0; i < $rootScope.tabsMenu.length; i++) {
							if ($rootScope.tabsMenu[i].businessLineId == $scope.selectedBusinessLineId) {
								$scope.inputTitle = $rootScope.tabsMenu[i].inputTitle;
								$scope.currentTab1 = $rootScope.tabsMenu[i].url;
								break;
							}
						}
						$scope.defaultMetroList = localStorageService.get("defaultMetroCityList");
					});
					var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");
					if (vehicleDetailsCookie) {
						if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
							vehicleDetailsCookie.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
							localStorageService.set("selectedCarDetails", vehicleDetailsCookie);
						}
					}
					var vehicleDetailsCookieBike = localStorageService.get("selectedBikeDetails");
					if (vehicleDetailsCookieBike) {
						if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
							vehicleDetailsCookieBike.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
							localStorageService.set("selectedBikeDetails", vehicleDetailsCookieBike);
						}
					}
				}

				function getLocationDetails(position) {
					findCityBasedIP($http, position, $scope.globalLabel.responseCode.success, function (cityFromIP, pincodeFromIP, stateFromIP, cityFoundStatus) {
						var IPBasedCityDetails = {};
						IPBasedCityDetails.cityName = cityFromIP;
						IPBasedCityDetails.pincode = pincodeFromIP;
						IPBasedCityDetails.state = stateFromIP;
						IPBasedCityDetails.cityStatus = cityFoundStatus;
						localStorageService.set("cityDataFromIP", IPBasedCityDetails);

						$scope.getRegPlaceListUsingIPCity(cityFromIP, function () {
							if ($scope.selectedBusinessLineId == 3) {
								$scope.$broadcast("callSingleClickCarQuote", {});
							} else if ($scope.selectedBusinessLineId == 2) {
								$scope.$broadcast("callSingleClickBikeQuote", {});
							}
						});
					});
				}

				if (!localStorageService.get("websiteVisitedOnce")) {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(getLocationDetails);
					} else {
						console.log("Geolocation is not supported by this browser.");
						var position = undefined;
						getLocationDetails(position);
					}
				}

				$rootScope.showBikeRegAreaStatus = true;
				$rootScope.showCarRegAreaStatus = true;

				$scope.modalVehicleRegistration = false;

				// Method to get list of Hospital details from DB.
				$scope.getHospitalList = function () {
					var documentId;
					var selectedLineOfBusiness = localStorageService.get("selectedBusinessLineId");
					if (selectedLineOfBusiness == 4) {
						documentId = $scope.globalLabel.documentType.hospitalDetails + "-" + localStorageService.get("healthQuoteInputParamaters").personalInfo.pincode;
						getDocUsingId(RestAPI, documentId, function (hospitalList) {
							if (hospitalList != null && String(hospitalList) != "undefined") {
								localStorageService.set("hospitalList", hospitalList.hospitalDetails);
								localStorageService.set("hospitalListReset", hospitalList.hospitalDetails);
							} else {
								localStorageService.set("hospitalList", undefined);
							}
						});
					}
				};

				// Method to get list of garage details from DB.
				$scope.getGarageList = function () {
					var documentId;
					var selectedLineOfBusiness = localStorageService.get("selectedBusinessLineId");
					if (selectedLineOfBusiness == 3) {
						//method for garageDetails
						$scope.garageList = {};
						$scope.garageList.make = localStorageService.get("carQuoteInputParamaters").vehicleInfo.make;
						$scope.garageList.city = localStorageService.get("carQuoteInputParamaters").vehicleInfo.city;
						$scope.garageList.regisCode = localStorageService.get("carQuoteInputParamaters").vehicleInfo.RTOCode;

						RestAPI.invoke($scope.globalLabel.transactionName.getGarageDetails, $scope.garageList).then(function (callback) {
							if (callback.responseCode == $scope.globalLabel.responseCode.success) {
								var garageResponse = callback;
								if (garageResponse != null && String(garageResponse) != "undefined") {
									localStorageService.set("garageDetails", garageResponse.data);
									//console.log('garage'+JSON.stringify(garageResponse.data))
								} else {
									localStorageService.set("garageDetails", undefined);
								}
							} else {
								localStorageService.set("garageDetails", undefined);
							}
						});
					}
				}

			};//getQuoteTemplateFunction end here

			$scope.$on("onClickTabID", function (event, tab) {
				console.log("tab : ",tab);
				$http.get(wp_path + 'ApplicationLabels.json').then(function (response) {
					localStorageService.set("applicationLabels", response.data);
					$scope.globalLabel = response.data.globalLabels;
					$scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");

					//for carrier logo path
					$rootScope.wp_path = '';
					if(pospEnabled){
						$rootScope.wp_path = localized;
					}
					console.log("typeOf tab : ", typeof tab);
					if (tab == 1) {
						$rootScope.loading = true;
						$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelLife;
						$rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.life.proverbInstantQuote) };

					} else if (tab == 2) {
						$rootScope.loading = true;
						$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelBike;
						$rootScope.loaderContent = { businessLine: '2', header: 'Bike Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.bike.proverbInstantQuote) };

					} else if (tab == 3) {
						$rootScope.loading = true;
						$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelCar;
						$rootScope.loaderContent = { businessLine: '3', header: 'Car Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.car.proverbInstantQuote) };
					} else if (tab == 4) {
						$rootScope.loading = true;
						$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelHealth;
						$rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.health.proverbInstantQuote) };
					} else if (tab == 5) {
						$rootScope.loading = true;
						$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelTravel;
						$rootScope.loaderContent = { businessLine: '5', header: 'Travel Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.travel.proverbInstantQuote) };
					} else if (tab == 6) {
						$rootScope.loading = true;
						$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelCriticalIllness;
						$rootScope.loaderContent = { businessLine: '6', header: 'CriticalIllness Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.criticalIllness.proverbInstantQuote) };
					} else if (tab == 8) {
						$rootScope.loading = true;
						$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelPersonalAccident;
						$rootScope.loaderContent = { businessLine: '8', header: 'PersonalAccident Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.personalAccident.proverbInstantQuote) };
					}

					if (tab == 3) {
						console.log('car tab clicked from dcp');
						$scope.focusInput = true;
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.instantQuoteInvalidSummaryStatus = true;

						$scope.instantQuoteCalculation = function (addOnCoverForCar) {
							$scope.quoteParam = {};
							$scope.vehicleInfo = {};
							$scope.vehicleDetails = {};
							$rootScope.vehicleInfo = {};
							$rootScope.vehicleDetails = {};

							$scope.toggleCounter = 0;

							$scope.carInsuranceTypes = [];
							$scope.yearList = [];
							$scope.makeNames = [];
							$scope.modelNames = [];
							$scope.variantNames = [];
							$scope.fuelNames = [];
							$scope.defaultMetroList = [];
							$scope.cityDetails = {};
							$scope.quoteFinalResult = [];

							var carQuoteCookie = localStorageService.get("carQuoteInputParamaters");

							var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");
							var registrationDetails = {};

							//$scope.makeNames = localStorageService.get("carMakeList");

							if (localStorageService.get("defaultMetroCityList") != null) {
								$scope.defaultMetroList = localStorageService.get("defaultMetroCityList");
							} else {
								//service call
								var popularRTOParam = {};
								popularRTOParam.popularRTOList = "Y";
								getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getPopularRTO, popularRTOParam, function (callbackMetro) {
									 if(callbackMetro.data){
							console.log("defaultMetroListNotVar");
                            localStorageService.set("defaultMetroCityList", callbackMetro.data);
                            $scope.defaultMetroList = callbackMetro.data;
                            }else{
                            console.log("defaultMetroListVar");    
                            localStorageService.set("defaultMetroCityList", defaultMetroListVar);
                            $scope.defaultMetroList = defaultMetroListVar;
                            }
								})
							}
							$scope.carInsuranceTypes = carInsuranceTypeGeneric;
							$scope.policyStatusList = policyStatusListGeneric;
							$scope.ncbList = ncbListGeneric;
							$scope.previousClaimStatus = previousClaimStatusGeneric;

							$rootScope.regNumStatus = false;
							$rootScope.viewOptionDisabled = true;
							$rootScope.tabSelectionStatus = true;
							$rootScope.disableCarRegPopup = true;
							$scope.instantQuoteCarForm = true;
							//$scope.carInstantQuoteForm = {};

							// Function created to change policy status.
							$scope.changePolStatus = function () {
								if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
									$scope.renewal = true;
									$scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;
								} else {
									$scope.renewal = false;
									$scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
								}

								if ($scope.vehicleDetails.policyStatus.key == 3)
									$scope.vehicleDetails.previousPolicyExpired = "N";
								else
									$scope.vehicleDetails.previousPolicyExpired = "Y";
								if ($scope.toggleCounter == 1) {
									if (!$rootScope.wordPressEnabled) {
										$scope.singleClickCarQuote();
									}
								}
							};

							// Function created to change insurance type.
							$scope.alterRenewal = function () {
								if ($scope.vehicleDetails.insuranceType.type != $scope.carInsuranceTypes[1].type) {
									$scope.polStatus = false;
									$scope.renewal = false;
									$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
									$scope.vehicleDetails.regYear = $scope.yearList[0];
								} else {
									$scope.polStatus = true;
									$scope.renewal = true;
									$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
								}
								$scope.quoteParam.policyType = $scope.vehicleDetails.insuranceType.value;
								$scope.changePolStatus();
							};


							// Update quote annual premium range.
							$scope.updateAnnualPremiumRange = function (minPremiumValue, maxPremiumValue) {
								if (minPremiumValue > maxPremiumValue) {
									$rootScope.minAnnualPremium = maxPremiumValue;
									$rootScope.maxAnnualPremium = minPremiumValue;
								} else {
									$rootScope.minAnnualPremium = minPremiumValue;
									$rootScope.maxAnnualPremium = maxPremiumValue;
								}
							};

							$scope.errorMessage = function (errorMsg) {
								if ($scope.errorRespCounter && (String($rootScope.carQuoteResult) == "undefined" || $rootScope.carQuoteResult.length == 0)) {
									$scope.errorRespCounter = false;
									$scope.updateAnnualPremiumRange(1000, 5000);
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
							$scope.tooltipPrepare = function (carResult) {
								var riderCount = 0;
								if ($rootScope.tooltipContent) {
									$rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
									$rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
								}
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

								if ($rootScope.tooltipContent)
									$rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
								$rootScope.calculatedQuotesLength = (String(carResult.length)).length == 2 ? String(carResult.length) : ("0" + String(carResult.length));
								$rootScope.calculatedRidersLength = (String(riderCount)).length == 2 ? String(riderCount) : ("0" + String(riderCount));
								setTimeout(function () {

									scrollv = new scrollable({
										wrapperid: "scrollable-v",
										moveby: 1
									})
								}, 2000);
							};

							// Processing of quote result to displayed on UI.
							$scope.processResult = function () {

								if ($rootScope.carQuoteResult.length > 0) {
									$rootScope.viewOptionDisabled = false;
									$rootScope.tabSelectionStatus = true;
									$rootScope.modalShown = false;
									$scope.instantQuoteCarForm = false;
									$rootScope.disableCarRegPopup = false;
									$rootScope.loading = false;
									//for campaign
									$rootScope.campaignFlag = true;
									//for wordPress
									$rootScope.enabledProgressLoader = false;
									$rootScope.carQuoteResult = $filter('orderBy')($rootScope.carQuoteResult, 'grossPremium');
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
									$scope.updateAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);
									localStorageService.set("carQuoteCalculationResult", $rootScope.carQuoteResult);
									/*if(localStorageService.get("selectedBusinessLineId") == 3)
										$scope.tooltipPrepare($rootScope.carQuoteResult);*/

									//setTimeout(function()
									//$location.path("/carResult");
									//},500);
									//$rootScope.loading = false;
									console.log("redirecting to carResult from process Result");
									$location.path("/carResult");
								}
							};

							// Instant quote calculation function.
							$scope.singleClickCarQuote = function () {
								setTimeout(function () {
									//if(!$scope.carInstantQuoteForm.$invalid){	
									$scope.quote = {};
									$rootScope.instantQuoteSummaryStatus = true;
									$rootScope.instantQuoteInvalidSummaryStatus = true;
									//$scope.quoteParam.policyExpiredAge = 0;
									$rootScope.viewOptionDisabled = true;
									$rootScope.tabSelectionStatus = false;
									$scope.errorRespCounter = true;
									$scope.instantQuoteCarForm = true;
									$rootScope.disableCarRegPopup = true;
									$rootScope.loading = true;
									var todayDate = new Date();
									if ($scope.quoteParam.policyType == $scope.carInsuranceTypes[0].value) {
										$scope.vehicleInfo.dateOfRegistration = ("0" + todayDate.getDate().toString()).substr(-2) + "/" + ("0" + (Number(todayDate.getMonth()) + 1).toString()).substr(-2) + "/" + $scope.vehicleDetails.regYear;
										$scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
									} else {

										/*$scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleDetails.regYear;*/
										/*commented based on uday for HDFC*/
										//$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
										//added based on uday's discussion
										var current_Year = todayDate.getFullYear();
										if (current_Year == $scope.vehicleDetails.regYear) {
											$scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleDetails.regYear;
										}
										else {
											$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
										}
										convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPolicyExpiryDate) {
											var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPolicyExpiryDate));
											var tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
											tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));

											if (tempCalcPrevPolStartDate.setHours(0, 0, 0, 0) < new Date($scope.vehicleInfo.dateOfRegistration).setHours(0, 0, 0, 0)) {
												$scope.vehicleDetails.PreviousPolicyStartDate = $scope.vehicleInfo.dateOfRegistration;
											} else {
												convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
													$scope.vehicleDetails.PreviousPolicyStartDate = formattedPrevPolStartDate;
												});
											}
										});
									}
									if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
										$scope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;
										$rootScope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;

										$scope.vehicleInfo.city = $rootScope.vehicleInfo.selectedRegistrationObject.city;
										$scope.vehicleInfo.RTOCode = $rootScope.vehicleInfo.selectedRegistrationObject.regisCode;
										 $scope.vehicleInfo.state = $rootScope.vehicleInfo.selectedRegistrationObject.state;

									} else {
										var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
										var selectedMetroDetails;
										if($scope.defaultMetroList){
										for (var i = 0; i < $scope.defaultMetroList.length; i++) {
											if ($scope.defaultMetroList[i].cityName == cityName) {
												for (var j = 0; j < $scope.defaultMetroList[i].RTODetails.length; j++) {
													selectedMetroDetails = $scope.defaultMetroList[i].RTODetails[j];
													if (selectedMetroDetails.display == $scope.vehicleInfo.registrationPlace) {
														$scope.vehicleInfo.city = selectedMetroDetails.city;
														$scope.vehicleInfo.RTOCode = selectedMetroDetails.regisCode;
														$scope.vehicleInfo.state = selectedMetroDetails.state;

														break;
													}
												}
											}
										}
									}
								}

									$scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
									$scope.vehicleDetails.showCarRegAreaStatus = $rootScope.showCarRegAreaStatus;
									//$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0,2)+$scope.vehicleInfo.registrationPlace.substr(3,2).trim();
									localStorageService.set("selectedBusinessLineId", 3);
									var personDob = new Date(new Date().getFullYear() - 46);
									convertDateFormatToString(personDob, function (formattedDateOfBirth) {
										$scope.vehicleDetails.dateOfBirth = personDob;
										$scope.vehicleDetails.formattedDateOfBirth = formattedDateOfBirth;
									});

									if ($scope.vehicleInfo.previousClaim == "true" || $scope.vehicleDetails.policyStatus.key == $scope.policyStatusList[0].key ||
										$scope.quoteParam.policyType == "new")
										$scope.quoteParam.ncb = 0;
									else
										$scope.quoteParam.ncb = $scope.vehicleDetails.ncb.value;

									//idv option is set to best deal based on Uday's discussion
									$scope.vehicleDetails.idvOption = 1;

									//$scope.quoteParam.policyExpiredAge = $scope.vehicleDetails.expiry / 365;
									$scope.vehicleDetails.manufacturingYear = $scope.vehicleDetails.regYear;

									//explicity added to make IDV as 0, as we come from LMS system, request was taking the LMS actual vale as IDV
									$scope.vehicleInfo.IDV = 0;
									//$scope.quoteParam.userIdv = 0;

									//added IDV quote ID based on IDV selection in Result and removing as IDV is zero
									delete $scope.vehicleInfo.IDV_QUOTE_ID

									$scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
									$scope.quote.quoteParam = $scope.quoteParam;
									$scope.quote.vehicleInfo = $scope.vehicleInfo;
									//$scope.quote.PACoverDetails = $scope.PACoverDetails;
									//$scope.quote.requestType = carRequestType;
									//console.log("PA Cover is stored in LS from HeaderNavigation -1 : "+JSON.stringify($scope.PACoverDetails));
									localStorageService.set("carQuoteInputParamaters", $scope.quote);
									localStorageService.set("selectedCarDetails", $scope.vehicleDetails);
									//localStorageService.set("CarPACoverDetails", $scope.PACoverDetails);
									//For Reset
									//localStorageService.set("carQuoteInputParamatersReset", $scope.quote);
									//localStorageService.set("selectedCarDetailsReset", $scope.vehicleDetails);

									// Google Analytics Tracker added.
									//analyticsTrackerSendData($scope.quote);

									//added to reset idv on cancel of your idv pop-up
									$rootScope.idvOptionCopy = angular.copy($scope.vehicleDetails.idvOption);

									$scope.requestId = null;
									var quoteUserInfo = localStorageService.get("quoteUserInfo");
									// Service call for quote calculation.
									$scope.carQuoteRequestFormation($scope.quote);
									RestAPI.invoke("carQuote", $scope.quoteRequest).then(function (callback) {
										$rootScope.carQuoteRequest = [];

										if (callback.responseCode == $scope.globalLabel.responseCode.success1) {
											$scope.responseCodeList = [];

											$scope.requestId = callback.QUOTE_ID;
											localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.requestId);

											$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
											localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
											
											localStorageService.set("car_best_quote_id", $scope.requestId);

											$rootScope.carQuoteRequest = callback.data;

											if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0) {
												$rootScope.carQuoteResult.length = 0;
											}

											$rootScope.carQuoteResult = [];
											$scope.carQuoteResponse = [];
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
														$scope.carQuoteResponse.push(callback);
														if (carQuoteResponse.QUOTE_ID == $scope.requestId) {
															$scope.responseCodeList.push(carQuoteResponse.responseCode);
															if (carQuoteResponse.responseCode == $scope.globalLabel.responseCode.success1) {
																for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
																	if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
																		$rootScope.loading = false;
																		$rootScope.carQuoteResult.push(carQuoteResponse.data.quotes[0]);
																		$rootScope.carQuoteRequest[i].status = 1;
																	}
																}
																console.log("process Result is getting called");
																$scope.processResult();
															} else {
																for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
																	if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
																		$rootScope.carQuoteRequest[i].status = 2;
																		//$rootScope.carQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
																		//comments updated based on Uday
																		$rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg);
																	}
																}
															}
														}
													}).
													error(function (data, status) {
														$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
													});
											});

											$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
												//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
												//$rootScope.loading = false;
												if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
													//$rootScope.loading = false;
													if ($scope.responseCodeList.length == $rootScope.carQuoteRequest.length) {
														//$rootScope.loading = false;
														$rootScope.setTooltip = false;

														for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
															if ($rootScope.carQuoteRequest[i].status == 0) {
																$rootScope.carQuoteRequest[i].status = 2;
																//$rootScope.carQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
																//comments updated based on Uday
																$rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg);
															}
														}

														//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
														if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
															// This condition will satisfy only when at least one product is found in the quoteResponse array.
															//}else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
														} else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
															$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
														} else {
															//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
															//comments updated based on Uday
															$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg));
														}
													}
											}, true);
										} else {
											$scope.responseCodeList = [];
											if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0)
												$rootScope.carQuoteResult.length = 0;

											$rootScope.carQuoteResult = [];
											$scope.errorMessage(callback.message);
										}
									});
									//}

								}, 100);

							};

							// Pre-population of UI fields. 
							$scope.prePopulateFields = function () {
								console.log("prePopulateFields()");
								var i;

								if (!localStorageService.get("selectedCarDetails")) {
									for (var i = 0; i < $scope.policyStatusList.length; i++) {
										if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
											$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
											break;
										}
									}
								} else {
									//if we go back from result screen to instant quote screen,the previois policy status 
									//will be pre populated if it is different than 'Not yet expired'
									$scope.carDetails = localStorageService.get("selectedBikeDetails");
									var getPolicyStatusKey = localStorageService.get("selectedCarDetails").policyStatusKey;
									if (getPolicyStatusKey) {
										for (var i = 0; i < $scope.policyStatusList.length; i++) {
											if (getPolicyStatusKey == $scope.policyStatusList[i].key) {
												$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
												break;
											}
										}

									} else {
										var getPolicyStatus = localStorageService.get("selectedCarDetails").policyStatus;
										if (getPolicyStatus) {
											for (var i = 0; i < $scope.policyStatusList.length; i++) {
												if (getPolicyStatus.key) {
													if (getPolicyStatus.key == $scope.policyStatusList[i].key) {
														$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
														break;
													}
												}
											}
										}

									}
								}
								for (i = 0; i < $scope.carInsuranceTypes.length; i++) {
									if ($scope.quoteParam.policyType == $scope.carInsuranceTypes[i].value) {
										$scope.vehicleDetails.insuranceType = $scope.carInsuranceTypes[i];
										break;
									}
								}

								for (i = 0; i < $scope.ncbList.length; i++) {
									if ($scope.quoteParam.ncb == $scope.ncbList[i].value) {
										$scope.vehicleDetails.ncb = $scope.ncbList[i];
										break;
									}
								}

								$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
								$scope.alterRenewal();
								$scope.toggleCounter = 1;

								// for( i = 0; i < $scope.makeNames.length; i++){
								// 	if($scope.vehicleInfo.name)
								// 	{
								// 		if($scope.vehicleInfo.name.toLowerCase() == $scope.makeNames[i].make.toLowerCase()){
								// 			$scope.vehicleDetails.carMakeObject = $scope.makeNames[i];

								// 			// $scope.updateModelList($scope.vehicleDetails.carMakeObject, 2);

								// 			break;
								// 		}
								// 	}
								// }
								//taking registration year and fuel from angular copy.as registration year  and fuel making empty in Car Registration API
								if ($scope.vehicleDetails.regYear == '') {
									$scope.vehicleDetails.regYear = $rootScope.regYearCopy;
								}

								var vehicleDetailsCookie = localStorageService.get("vehicleRegistrationDetails");
								if (vehicleDetailsCookie) {
									if (String(vehicleDetailsCookie.registrationNumber) != "undefined" && vehicleDetailsCookie.registrationNumber != null) {
										$rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;
									}
								}

								if ($rootScope.carQuoteResult) {
									if ($rootScope.carQuoteResult.length > 0) {
										console.log('redirecting to car result from header navigation');
										$location.path("/carResult");
									} else {
										console.log("calling singleClickCarQuote() step-1");
										$scope.singleClickCarQuote();
									}
								} else {
									console.log("calling singleClickCarQuote() step-2");
									$scope.singleClickCarQuote();
								}
								//$scope.singleClickCarQuote();
							};

							// Function created to fetch default input parameters for car.
							$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {
								$scope.renewal = true;
								$scope.polStatus = true;


								if (defaultQuoteStatus) {
									$scope.quoteParam = angular.copy(defaultCarQuoteParam.quoteParam);
									$scope.vehicleDetails = angular.copy(defaultCarQuoteParam.vehicleDetails);
									$scope.vehicleInfo = angular.copy(defaultCarQuoteParam.vehicleInfo);
									//$scope.vehicleInfo.previousPolicyZeroDepStatus = angular.copy(defaultCarQuoteParam.vehicleInfo.previousPolicyZeroDepStatus);
									//$scope.PACoverDetails = angular.copy(defaultCarQuoteParam.PACoverDetails);
									$scope.vehicleDetails.displayVehicle = "Maruti Suzuki Alto 800 LX PETROL";

									/*if(String(localStorageService.get("registrationPlaceUsingIP")) != "undefined" && localStorageService.get("registrationPlaceUsingIP").rtoStatus == true){
										$scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
										$rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
										$rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
									}*/
									console.log("calling prePopulateFields() step-1");
									$scope.prePopulateFields();
								} else {
									console.log("carQuoteCookie", carQuoteCookie);

									if (carQuoteCookie.quoteParam) {
										$scope.quoteParam = carQuoteCookie.quoteParam;
									}
									$scope.vehicleDetails = vehicleDetailsCookie;
									$scope.vehicleInfo = carQuoteCookie.vehicleInfo;
									
									//$scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
									$scope.vehicleDetails.selectedAddOnCovers = makeObjectEmpty($scope.vehicleDetails.selectedAddOnCovers, "array");
									$scope.vehicleDetails.addOnCoverCustomAmount = makeObjectEmpty($scope.vehicleDetails.addOnCoverCustomAmount, "array");

									$scope.vehicleDetails.checkforNonElectrical = false;
									$scope.vehicleDetails.checkforElectrical = false;
									$scope.vehicleDetails.checkforPsgCover = false;
									$scope.vehicleDetails.checkforLpgCngCover = false;
									$scope.vehicleDetails.checkforDriverAccCover = false;
									$scope.vehicleDetails.checkforAccessoriesCover = false;

									//$scope.quoteParam.isRiderSelected = "N";

									//$scope.vehicleInfo.previousPolicyZeroDepStatus = defaultCarQuoteParam.vehicleInfo.previousPolicyZeroDepStatus;

									console.log('localStorageService.get("registrationPlaceUsingIP") in car', localStorageService.get("registrationPlaceUsingIP"));
									if (localStorageService.get("registrationPlaceUsingIP")) {
										if (localStorageService.get("registrationPlaceUsingIP").rtoStatus == true) {
											$scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
											$rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
											$rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
										}
									}

									$rootScope.showCarRegAreaStatus = vehicleDetailsCookie.showCarRegAreaStatus;
									$rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;

									//$scope.addOnCovers = localStorageService.get("addOnCoverListForCar");
									console.log("calling prePopulateFields() step-2");
									$scope.prePopulateFields();

								}
								defaultInputParamCallback();

							};

							var carQuoteCookie = localStorageService.get("carQuoteInputParamaters");
							console.log('carQuoteCookie is: ', carQuoteCookie);
							// Checking whether cookie is present or not.
							if (carQuoteCookie !== null && String(carQuoteCookie) !== "undefined") {
								$scope.fetchDefaultInputParamaters(false, function () { });
							} else {
								$scope.fetchDefaultInputParamaters(true, function () { });
							}
						}// instantQuoteCalculation end here	

						var todayDate = new Date();
						var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
							("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
						getPolicyStatusList(formatedTodaysDate);

						if (!localStorageService.get("ridersCarStatus")) {
							//fetching car make names view
							// getListFromDB(RestAPI, "", $scope.globalLabel.documentType.car, $scope.globalLabel.request.findAppConfig, function(callback4){
							// 	if(callback4.responseCode == $scope.globalLabel.responseCode.success){
							// 		localStorageService.set("carMakeList", callback4.data);
							// To get the car rider list applicable for this user.										
							getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.car, $scope.globalLabel.request.findAppConfig, function (addOnCoverForCar) {
								localStorageService.set("addOnCoverListForCar", addOnCoverForCar);
								localStorageService.set("ridersCarStatus", true);
								// Fetching tool-tip contents from DB for instant quote screen.
								// var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
								// getDocUsingId(RestAPI, docId, function(tooltipContent){
								// 	localStorageService.set("carInstantQuoteTooltipContent", tooltipContent.toolTips);
								// 	$rootScope.tooltipContent = tooltipContent.toolTips;
								//logic written only when the user comes from campaign
								getListFromDB(RestAPI, "", "CarDataList", $scope.globalLabel.request.findAppConfig, function (callbackCar5) {
									if (callbackCar5.responseCode == $scope.globalLabel.responseCode.success) {
										localStorageService.set("carMakeListDisplay", callbackCar5.data);
										//	$scope.instantQuoteCalculation(addOnCoverForCar);

										if (localStorageService.get("carQuoteInputParamaters")) {
											$scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
											if ($scope.vehicleInfo) {
												var docId = "Mobile" + $scope.vehicleInfo.variantId;
												getDocUsingId(RestAPI, docId, function (getDisplayVehicle) {
													if (getDisplayVehicle) {
														if ($scope.vehicleDetails) {
															$scope.vehicleDetails.displayVehicle = getDisplayVehicle.displayVehicle;
														}
														$scope.carDetails = localStorageService.get("selectedCarDetails");
														$scope.carDetails.displayVehicle = $scope.vehicleDetails.displayVehicle;
														localStorageService.set("selectedCarDetails", $scope.carDetails)
														console.log('display vehicle found for car');
														$scope.instantQuoteCalculation(addOnCoverForCar);
													} else {
														console.log('failed to get display vehicle from car variant');
														$scope.instantQuoteCalculation(addOnCoverForCar);
													}
												});
											}
										} else {
											$scope.instantQuoteCalculation(addOnCoverForCar);
										}
									}
								});
							});
							// }else{
							// 	$rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
							// }
							// });
						} else {
							//$rootScope.tooltipContent = localStorageService.get("carInstantQuoteTooltipContent");
							$scope.instantQuoteCalculation(localStorageService.get("addOnCoverListForCar"));
						}




					}//tab 1 end here
					else if (tab == 2) {
						var registrationDetails = {};
						var bikeQuoteCookie;
						$scope.instantQuoteCalculation = function (addOnCoverList) {
							addRidersToDefaultQuoteBike(addOnCoverList, localStorageService.get("selectedBusinessLineId"), function (defaultRiderList, defaultRiderArrayObject) {
								$scope.quoteParam = {};
								$scope.vehicleInfo = {};
								$scope.vehicleDetails = {};
								$rootScope.vehicleInfo = {};
								$rootScope.vehicleDetails = {};

								$scope.toggleCounter = 0;

								$scope.bikeInsuranceTypes = [];
								$scope.yearList = [];
								$scope.makeNames = [];
								$scope.modelNames = [];
								$scope.variantNames = [];
								$scope.makeMap = {};
								$scope.modelMap = {};
								$scope.variantMap = {};
								$scope.defaultMetroList = [];
								$scope.cityDetails = {};
								$scope.quoteFinalResult = [];

								bikeQuoteCookie = localStorageService.get("bikeQuoteInputParamaters");

								vehicleDetailsCookieBike = localStorageService.get("selectedBikeDetails");
								$scope.defaultMetroList = localStorageService.get("defaultMetroCityList");
								//$scope.makeNames = localStorageService.get("bikeMakeList");

								$scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;
								$scope.policyStatusList = policyStatusListGeneric;
								$scope.ncbList = ncbListGeneric;
								$scope.previousClaimStatus = previousClaimStatusGeneric;

								$rootScope.regNumStatus = false;
								$rootScope.viewOptionDisabled = true;
								$rootScope.tabSelectionStatus = true;
								$rootScope.disableBikeRegPopup = true;
								$scope.instantQuoteBikeForm = true;

								//$scope.getRegNumber = function(registrationNumber){}; removed

								// Function created to change policy status.
								$scope.changePolStatus = function () {
									if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
										$scope.renewal = true;
										$scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;
									} else {
										$scope.renewal = false;
										$scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
									}

									// if ($scope.vehicleDetails.policyStatus.key == 3)
									// //	$scope.vehicleInfo.previousPolicyExpired = "N";
									// else
									// 	//$scope.vehicleInfo.previousPolicyExpired = "Y";

									if ($scope.toggleCounter == 1) {
										if (!$rootScope.wordPressEnabled) {
											$scope.singleClickBikeQuote();
										}
									}
								};

								// Function created to change insurance type.
								$scope.alterRenewal = function () {
									if ($scope.vehicleDetails.insuranceType.type != $scope.bikeInsuranceTypes[1].type) {
										$scope.polStatus = false;
										$scope.renewal = false;
										$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
										$scope.vehicleDetails.regYear = $scope.yearList[0];
									} else {
										$scope.polStatus = true;
										$scope.renewal = true;
										$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
									}
									$scope.quoteParam.policyType = $scope.vehicleDetails.insuranceType.value;
									$scope.changePolStatus();
								};


								// Quote result premium slider.
								$scope.updateAnnualPremiumRange = function (minPremiumValue, maxPremiumValue) {
									if (minPremiumValue > maxPremiumValue) {
										$rootScope.minAnnualPremium = maxPremiumValue;
										$rootScope.maxAnnualPremium = minPremiumValue;
									} else {
										$rootScope.minAnnualPremium = minPremiumValue;
										$rootScope.maxAnnualPremium = maxPremiumValue;
									}
								};

								$scope.errorMessage = function (errorMsg) {
									if ($scope.errorRespCounter && (String($rootScope.bikeQuoteResult) == "undefined" || $rootScope.bikeQuoteResult.length == 0)) {
										$scope.errorRespCounter = false;
										$scope.updateAnnualPremiumRange(1000, 5000);
										$rootScope.instantQuoteSummaryStatus = false;
										$rootScope.instantQuoteSummaryError = errorMsg;
										$rootScope.viewOptionDisabled = true;
										$rootScope.tabSelectionStatus = true;
										$scope.instantQuoteBikeForm = false;
										$rootScope.disableBikeRegPopup = false;
										$rootScope.loading = false;
									} else if ($rootScope.bikeQuoteResult.length > 0) {
										$rootScope.instantQuoteSummaryStatus = true;
										$rootScope.viewOptionDisabled = false;
										$rootScfope.tabSelectionStatus = true;
										$scope.instantQuoteBikeForm = false;
										$rootScope.disableBikeRegPopup = false;
										$rootScope.loading = false;
									}
								};

								$scope.tooltipPrepare = function (bikeResult) {
									var riderCount = 0;
									//$rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
									//$rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
									$rootScope.riderOptionList = "<ul style='text-align: left;' class='tickpoints'>";
									for (var i = 0; i < defaultRiderArrayObject.length; i++) {
										if (defaultRiderArrayObject[i].isEnable == "Y") {
											riderCount += 1;
											$rootScope.riderOptionList += "<li>" + defaultRiderArrayObject[i].riderName + "</li>";
										}
									}
									$rootScope.riderOptionList += "</ul>";

									var resultCarrierId = [];
									var testCarrierId = [];
									for (i = 0; i < bikeResult.length; i++) {
										//push only net premium if greater than 0
										if (Number(bikeResult[i].netPremium) > 0) {
											var carrierInfo = {};
											carrierInfo.id = bikeResult[i].carrierId;
											carrierInfo.name = bikeResult[i].insuranceCompany;
											carrierInfo.annualPremium = bikeResult[i].netPremium;
											carrierInfo.claimsRating = bikeResult[i].insurerIndex;

											if (p365Includes(testCarrierId, bikeResult[i].carrierId) == false) {
												resultCarrierId.push(carrierInfo);
												testCarrierId.push(bikeResult[i].carrierId);
											}
										}
									}
									$rootScope.resultCarrierId = resultCarrierId;
									//$rootScope.quoteResultInsurerList = $rootScope.tooltipContent.quoteDesc + "\n<ul style='text-align: left;' class='tickpoints'>";
									for (i = 0; i < resultCarrierId.length; i++) {
										$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
									}
									$rootScope.quoteResultInsurerList += "</ul>";

									//$rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
									$rootScope.calculatedQuotesLength = (String(bikeResult.length)).length == 2 ? String(bikeResult.length) : ("0" + String(bikeResult.length));
									$rootScope.calculatedRidersLength = (String(riderCount)).length == 2 ? String(riderCount) : ("0" + String(riderCount));
									setTimeout(function () {

										scrollv = new scrollable({
											wrapperid: "scrollable-v",
											moveby: 1
										});


									}, 2000);
								};

								$scope.processResult = function () {
									if ($rootScope.bikeQuoteResult.length > 0) {
										//for wordPress
										$rootScope.enabledProgressLoader = false;

										$rootScope.viewOptionDisabled = false;
										$rootScope.tabSelectionStatus = true;
										$rootScope.modalShown = false;
										$scope.instantQuoteBikeForm = false;
										$rootScope.disableBikeRegPopup = false;
										$rootScope.loading = false;
										//for campaign
										$rootScope.campaignFlag = true;

										$rootScope.bikeQuoteResult = $filter('orderBy')($rootScope.bikeQuoteResult, 'grossPremium');

										var minAnnualPremiumValue = $rootScope.bikeQuoteResult[0].grossPremium;
										var annualPremiumSliderArray = [];

										for (var j = 0; j < $rootScope.bikeQuoteResult.length; j++) {
											var calculatedDiscAmt = 0;
											var discountAmtList = $rootScope.bikeQuoteResult[j].bikeDiscountDetails;
											if (String(discountAmtList) != "undefined") {
												for (var i = 0; i < discountAmtList.length; i++) {
													calculatedDiscAmt += discountAmtList[i]["com.sutrr.quote.bikequotecalc.BikeDiscountDetails"].discountAmount;
												}
												calculatedDiscAmt += $rootScope.bikeQuoteResult[j].grossPremium;
												annualPremiumSliderArray.push(calculatedDiscAmt);
											} else {
												annualPremiumSliderArray.push($rootScope.bikeQuoteResult[j].grossPremium);
											}
										}

										annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
										$scope.updateAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);

										//if(localStorageService.get("selectedBusinessLineId") == 2)
										//$scope.tooltipPrepare($rootScope.bikeQuoteResult);
									}
									/*setTimeout(function(){
										//$rootScope.loading = false;
										$location.path("/bikeResult");
									},100);*/
									$location.path("/bikeResult");
								};

								// Instant quote calculation function.
								$scope.singleClickBikeQuote = function () {
									setTimeout(function () {									
										//if(!$scope.bikeInstantQuoteForm.$invalid){
										$scope.quote = {};
										$rootScope.instantQuoteSummaryStatus = true;
										$rootScope.viewOptionDisabled = true;
										$rootScope.tabSelectionStatus = false;
										$scope.errorRespCounter = true;
										$scope.instantQuoteBikeForm = true;
										$rootScope.disableBikeRegPopup = true;
										$rootScope.loading = true;
										//$scope.vehicleInfo.name	= $scope.vehicleDetails.bikeMakeObject.make;
										// $scope.vehicleInfo.model = $scope.vehicleDetails.bikeModelObject.model;
										// $scope.vehicleInfo.variant = $scope.vehicleDetails.bikeVariantObject.variant;

										if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
											$scope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;
											$rootScope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;
											$scope.vehicleInfo.city = $rootScope.vehicleInfo.selectedRegistrationObject.city;
										//$scope.quoteParam.zone = $rootScope.vehicleInfo.selectedRegistrationObject.zone;
											//$scope.vehicleInfo.isCostal = $rootScope.vehicleInfo.selectedRegistrationObject.isCostal;
											//$scope.vehicleInfo.isEarthQuakeArea = $rootScope.vehicleInfo.selectedRegistrationObject.isEarthQuakeArea;
											$scope.vehicleInfo.RTOCode = $rootScope.vehicleInfo.selectedRegistrationObject.regisCode;
											$scope.vehicleInfo.state = $rootScope.vehicleInfo.selectedRegistrationObject.state;
											// $scope.quoteParam.customerpinCode = "";
											// $scope.quoteParam.customerCity = "";
											// $scope.quoteParam.customerState = "";
										} else {
											var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
											if($scope.defaultMetroList){
											for (var i = 0; i < $scope.defaultMetroList.length; i++) {
												if ($scope.defaultMetroList[i].cityName == cityName) {
													for (var j = 0; j < $scope.defaultMetroList[i].RTODetails.length; j++) {
														var selectedMetroDetails = $scope.defaultMetroList[i].RTODetails[j];
														if (selectedMetroDetails.display == $scope.vehicleInfo.registrationPlace) {
															//$scope.quoteParam.zone = selectedMetroDetails.zone;
															$scope.vehicleInfo.city = selectedMetroDetails.city;
														//	$scope.vehicleInfo.isCostal = selectedMetroDetails.isCostal;
															//$scope.vehicleInfo.isEarthQuakeArea = selectedMetroDetails.earthQuakeArea;
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
										}
										
										$scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
										$scope.vehicleDetails.showBikeRegAreaStatus = $rootScope.showBikeRegAreaStatus;
										//$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0,2)+$scope.vehicleInfo.registrationPlace.substr(3,2).trim();


										var todayDate = new Date();
										if ($scope.quoteParam.policyType == $scope.bikeInsuranceTypes[0].value) {
											$scope.vehicleInfo.dateOfRegistration = ("0" + todayDate.getDate().toString()).substr(-2) + "/" + ("0" + (Number(todayDate.getMonth()) + 1).toString()).substr(-2) + "/" + $scope.vehicleDetails.regYear;
											$scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
										} else {
											/*$scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleDetails.regYear;*/
											/*commented based on uday for HDFC*/
											//$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
											//added based on uday's discussion
											var current_Year = todayDate.getFullYear();
											if (current_Year == $scope.vehicleDetails.regYear) {
												$scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleDetails.regYear;
											}
											else {
												$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
											}
											convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function (formattedPolicyExpiryDate) {
												var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPolicyExpiryDate));
												var tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
												tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));

												if (tempCalcPrevPolStartDate.setHours(0, 0, 0, 0) < new Date($scope.vehicleInfo.dateOfRegistration).setHours(0, 0, 0, 0)) {
													//$scope.vehicleInfo.PreviousPolicyStartDate = $scope.vehicleInfo.dateOfRegistration;
												} else {
													convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
													//	$scope.vehicleInfo.PreviousPolicyStartDate = formattedPrevPolStartDate;
													});
												}
											});
										}
										localStorageService.set("selectedBusinessLineId", 2);
										//$scope.quoteParam.vehicleAge = getAgeFromDOB($scope.vehicleInfo.dateOfRegistration);				
										$scope.vehicleDetails.manufacturingYear = $scope.vehicleDetails.regYear;
										// $scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
										// $scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");

										//$scope.quoteParam.riders  = defaultRiderList;
										//$scope.vehicleDetails.riderArrayObject = defaultRiderArrayObject;

										if ($scope.vehicleInfo.previousClaim == "true" || $scope.vehicleDetails.policyStatus.key == $scope.policyStatusList[0].key ||
											$scope.quoteParam.policyType == "new" || $scope.vehicleDetails.policyStatus.key == 1)
											$scope.quoteParam.ncb = 0;
										else
											$scope.quoteParam.ncb = $scope.vehicleDetails.ncb.value;

										//$scope.quoteParam.policyExpiredAge = $scope.vehicleDetails.expiry / 365;
										//idv option is set to best deal based on Uday's discussion
										$scope.vehicleDetails.idvOption = 1;

										//explicity added to make IDV as 0, as we come from LMS system, request was taking the LMS actual vale as IDV
										$scope.vehicleInfo.IDV = 0;
										// $scope.quoteParam.userIdv = 0;
									    delete $scope.vehicleInfo.best_quote_id
				
										$scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
										$scope.quote.quoteParam = $scope.quoteParam;
										$scope.quote.vehicleInfo = $scope.vehicleInfo;
										
										localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
										localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);
	
										//added to reset idv on cancel of your idv pop-up
										$rootScope.idvOptionCopy = angular.copy($scope.vehicleDetails.idvOption);
										// Google Analytics Tracker added.
										//analyticsTrackerSendData($scope.quote);
										$scope.requestId = null;

										$rootScope.bikeQuoteResult = []; 

										// Service call for quote calculation.
										$scope.bikeQuoteRequestFormation($scope.quote);
										RestAPI.invoke("bikeQuote", $scope.quoteRequest).then(function (callback) {											$rootScope.bikeQuoteRequest = [];
										
											if (callback.responseCode == $scope.globalLabel.responseCode.success1) {
												$scope.responseCodeList = [];

												$scope.requestId = callback.QUOTE_ID;

												localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.requestId);
												
												$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
												console.log('$scope.UNIQUE_QUOTE_ID_ENCRYPTED is',$scope.UNIQUE_QUOTE_ID_ENCRYPTED);
												localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
													
												localStorageService.set("bike_best_quote_id", $scope.requestId);
												$rootScope.bikeQuoteRequest = callback.data;

												if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0) {
													$rootScope.bikeQuoteResult.length = 0;
												}
												//for olark
												$scope.bikeQuoteResponse = [];
												olarkCustomParam(localStorageService.get("BIKE_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), true);
												angular.forEach($rootScope.bikeQuoteRequest, function (obj, i) {
													var request = {};
													var header = {};

													header.messageId = messageIDVar;
													header.campaignID = campaignIDVar;
													header.source = sourceOrigin;
													header.transactionName = $scope.globalLabel.transactionName.bikeQuoteResult;
													header.deviceId = deviceIdOrigin;
													request.header = header;
													request.body = obj;

													$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
														success(function (callback, status) {
														
															var bikeQuoteResponse = JSON.parse(callback);
															$scope.bikeQuoteResponse.push(callback);
															if (bikeQuoteResponse.QUOTE_ID == $scope.requestId) {
																$scope.responseCodeList.push(bikeQuoteResponse.responseCode);

																if (bikeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success1) {
																	for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
																		if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
																			$rootScope.loading = false;
																			$rootScope.bikeQuoteResult.push(bikeQuoteResponse.data.quotes[0]);
																			$rootScope.bikeQuoteRequest[i].status = 1;
																		}
																	}

																	$scope.processResult();
																} else {
																	for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
																		if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
																			$rootScope.bikeQuoteRequest[i].status = 2;
																			//$rootScope.bikeQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
																			//comments updated based on Uday
																			$rootScope.bikeQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg);
																		}
																	}
																}
															}
														}).
														error(function (data, status) {
															$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
														});
												});

												$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
													//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
													//$rootScope.loading = false;
													if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
														//$rootScope.loading = false;
														if ($scope.responseCodeList.length == $rootScope.bikeQuoteRequest.length) {
															$rootScope.loading = false;
															//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
															if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
																// This condition will satisfy only when at least one product is found in the quoteResponse array.
																//}else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
															} else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
																$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
															} else {
																//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
																//comments updated based on Uday
																$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg));
															}
														}
												}, true);
											} else {
												$scope.responseCodeList = [];

												if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0)
													$rootScope.bikeQuoteResult.length = 0;

												$rootScope.bikeQuoteResult = [];
												$scope.errorMessage(callback.message);
											}
										});
										//}
									}, 100);

								};

								$scope.prePopulateFields = function () {

									if (!localStorageService.get("selectedBikeDetails")) {
										for (var i = 0; i < $scope.policyStatusList.length; i++) {
											if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
												$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
												break;
											}
										}
									} else {
										//if we go back from result screen to instant quote screen,the previois policy status 
										//will be pre populated if it is different than 'Not yet expired'
										// var getPolicyStatus = localStorageService.get("selectedBikeDetails").policyStatus;
										// for(var i = 0; i < $scope.policyStatusList.length; i++){
										// 	if(getPolicyStatus.key == $scope.policyStatusList[i].key){
										// 		$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
										// 		break;
										// 	}
										// }
										$scope.bikeDetails = localStorageService.get("selectedBikeDetails");
										var getPolicyStatusKey = localStorageService.get("selectedBikeDetails").policyStatusKey;
										if (getPolicyStatusKey) {
											for (var i = 0; i < $scope.policyStatusList.length; i++) {
												if (getPolicyStatusKey == $scope.policyStatusList[i].key) {
													$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
													break;
												}
											}

										} else {
											var getPolicyStatus = localStorageService.get("selectedBikeDetails").policyStatus;
											if (getPolicyStatus) {
												for (var i = 0; i < $scope.policyStatusList.length; i++) {
													if (getPolicyStatus.key) {
														if (getPolicyStatus.key == $scope.policyStatusList[i].key) {
															$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
															break;
														}
													}
												}
											}

										}
									}
									for (i = 0; i < $scope.bikeInsuranceTypes.length; i++) {
										if ($scope.quoteParam.policyType == $scope.bikeInsuranceTypes[i].value) {
											$scope.vehicleDetails.insuranceType = $scope.bikeInsuranceTypes[i];
											break;
										}
									}

									for (i = 0; i < $scope.ncbList.length; i++) {
										if ($scope.quoteParam.ncb == $scope.ncbList[i].value) {
											$scope.vehicleDetails.ncb = $scope.ncbList[i];
											break;
										}
									}

									$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
									$scope.alterRenewal();
									$scope.toggleCounter = 1;

									// for( i = 0; i < $scope.makeNames.length; i++){
									// 	if($scope.vehicleInfo.name == $scope.makeNames[i].make){
									// 		$scope.vehicleDetails.bikeMakeObject = $scope.makeNames[i];
									// 		// $scope.updateModelList($scope.vehicleDetails.bikeMakeObject, 2);
									// 		break;
									// 	}
									// }
									vehicleDetailsCookieBike = localStorageService.get("vehicleRegistrationDetails");
									if (vehicleDetailsCookieBike) {
										if (String(vehicleDetailsCookieBike.registrationNumber) != "undefined" && vehicleDetailsCookieBike.registrationNumber != null) {
											$rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookieBike.registrationNumber;
										}
									}

									if ($rootScope.bikeQuoteResult) {
										if ($rootScope.bikeQuoteResult.length > 0) {
											$location.path("/bikeResult");
										} else {
											$scope.singleClickBikeQuote();
										}
									} else {
										$scope.singleClickBikeQuote();
									}
									//$scope.singleClickBikeQuote()

								};

								// Function created to fetch default input parameters for bike.
								$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {
									$scope.renewal = false;
									$scope.polStatus = false;
									
									console.log('inside fetchDefaultInputParamaters');


									if (defaultQuoteStatus) {
										$scope.quoteParam = defaultBikeQuoteParam.quoteParam;
										$scope.vehicleDetails = defaultBikeQuoteParam.vehicleDetails;
										$scope.vehicleInfo = defaultBikeQuoteParam.vehicleInfo;
										$scope.PACoverDetails = defaultBikeQuoteParam.PACoverDetails;
										

										$scope.vehicleInfo.make = "Hero MotoCorp";
										$scope.vehicleInfo.model = "Duet";
										$scope.vehicleInfo.variant = "VX";

										console.log('inside fetchDefaultInputParamaters');
										// $scope.vehicleDetails.displayVehicle = "Hero MotoCorp Duet VX";
										/*if(String(localStorageService.get("registrationPlaceUsingIP")) != "undefined" && localStorageService.get("registrationPlaceUsingIP").rtoStatus == true){
											$scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
											$rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
											$rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
										}*/
									} else {

										if (localStorageService.get("bikeQuoteInputParamaters")) {
										
											$scope.quoteParam.ownedBy=localStorageService.get("bikeQuoteInputParamaters").quoteParam.ownedBy;
										
										
										}
										$scope.vehicleDetails = vehicleDetailsCookieBike;
										$scope.vehicleInfo = bikeQuoteCookie.vehicleInfo;
										//console.log("PA Cover is fetched from LS from HeaderNavigation -2 : "+JSON.stringify($scope.PACoverDetails));
										if (localStorageService.get("BikePACoverDetails")) {
											$scope.PACoverDetails = localStorageService.get("BikePACoverDetails");
										}
										//$scope.quoteParam.riders = [];
										console.log('localStorageService.get("registrationPlaceUsingIP") in bike', localStorageService.get("registrationPlaceUsingIP"));
										if (localStorageService.get("registrationPlaceUsingIP")) {
											if (localStorageService.get("registrationPlaceUsingIP").rtoStatus == true) {
												$scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
												$rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
												$rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
											}
										}

										if (vehicleDetailsCookieBike.showBikeRegAreaStatus) {
											$rootScope.showBikeRegAreaStatus = vehicleDetailsCookieBike.showBikeRegAreaStatus;
										}
										if (vehicleDetailsCookieBike.registrationNumber) {
											$rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookieBike.registrationNumber;
										}
									}

									$scope.prePopulateFields();
									defaultInputParamCallback();

								};
								bikeQuoteCookie = localStorageService.get("bikeQuoteInputParamaters");
								console.log('bikeQuoteCookie is: ', bikeQuoteCookie);
								// Checking whether cookie is present or not.
								if (bikeQuoteCookie !== null && String(bikeQuoteCookie) !== "undefined") {
									$scope.fetchDefaultInputParamaters(false, function () { });
								} else {
									$scope.fetchDefaultInputParamaters(true, function () { });
								}

								/*// Below piece of code written to access function from outside controller.
								$rootScope.$on("callSingleClickBikeQuote", function(){
									$scope.singleClickBikeQuote();
								});*/
							});
						};// bike instantQuoteCalculation end here

						var todayDate = new Date();
						var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
							("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
						getPolicyStatusList(formatedTodaysDate);
						if (!localStorageService.get("ridersBikeStatus")) {
							//fetching bike make names view
							// getListFromDB(RestAPI, "", $scope.globalLabel.documentType.twowheeler, $scope.globalLabel.request.findAppConfig, function(callback1){
							// 	if(callback1.responseCode == $scope.globalLabel.responseCode.success){
							// 		localStorageService.set("bikeMakeList", callback1.data);

							// To get the bike rider list applicable for this user.
							getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.bike, $scope.globalLabel.request.findAppConfig, function (addOnCoverList) {
								localStorageService.set("addOnCoverListForBike", addOnCoverList);
								localStorageService.set("ridersBikeStatus", true);

								//	Fetching tool-tip contents from DB for instant quote screen.
								// var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
								// getDocUsingId(RestAPI, docId, function(tooltipContent){
								// 	localStorageService.set("bikeInstantQuoteTooltipContent", tooltipContent.toolTips);
								// 	$rootScope.tooltipContent = tooltipContent.toolTips;
								/*//logic written only when the user comes from campaign
								if($location.path() !='/bike'){
									$scope.instantQuoteCalculation(addOnCoverList);
								}else{*/
								getListFromDB(RestAPI, "", "BikeVariants", $scope.globalLabel.request.findAppConfig, function (callbackCar5) {
									if (callbackCar5.responseCode == $scope.globalLabel.responseCode.success) {
										localStorageService.set("bikeMakeListDisplay", callbackCar5.data);
										//commenting as displayvehicle value overrriden
										//$scope.instantQuoteCalculation(addOnCoverList);

										if (localStorageService.get("bikeQuoteInputParamaters")) {
											$scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
											$scope.instantQuoteCalculation(addOnCoverList);
										} else {
											$scope.instantQuoteCalculation(addOnCoverList);
										}
									}
								});
							});
						} else {
							//$rootScope.tooltipContent = localStorageService.get("bikeInstantQuoteTooltipContent");
							$scope.instantQuoteCalculation(localStorageService.get("addOnCoverListForBike"));
						}
					}// bike tab end here

					else if (tab == 1) {
						$rootScope.carrierDetails = {};
						getDocUsingId(RestAPI, $scope.globalLabel.applicationLabels.life.ridersDocInDB, function (carrierDetails) {
							$rootScope.carrierDetails = carrierDetails;

							$scope.instantQuoteCalculation = function (addOnCoverForLife) {
								addRidersToDefaultQuote(addOnCoverForLife, localStorageService.get("selectedBusinessLineId"), function (defaultRiderList, defaultRiderArrayObject) {

									var lifeQuoteCookie = localStorageService.get("lifeQuoteInputParamaters");
									var personalDetailsCookie = localStorageService.get("lifePersonalDetails");

									$scope.quote = {};
									$scope.quoteParam = {};
									$scope.personalDetails = {};

									$scope.relationType = relationLifeQuoteGeneric;
									$scope.healthConditionType = healthConditionGeneric;
									$scope.annualIncomesRange = annualIncomesGeneric;
									$scope.genderType = genderTypeGeneric;
									$scope.tobaccoAddictionStatus = tobaccoAddictionStatusGeneric;
									$scope.payoutOptions = lifePayoutOptionsGeneric;

									$rootScope.viewOptionDisabled = true;
									$rootScope.tabSelectionStatus = true;
									$scope.instantQuoteLifeForm = true;
									//}
									// Function created to set annual premium amount range.	-	modification-0008
									$scope.updateAnnualPremiumRange = function (minPremiumValue, maxPremiumValue) {
										if (minPremiumValue > maxPremiumValue) {
											$rootScope.minAnnualPremium = maxPremiumValue;
											$rootScope.maxAnnualPremium = minPremiumValue;
										} else {
											$rootScope.minAnnualPremium = minPremiumValue;
											$rootScope.maxAnnualPremium = maxPremiumValue;
										}
									}

									/*$scope.calculateSumAssured = function(){
										listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
											$scope.quoteParam.sumInsured = selectedSumAssured.amount;
											$scope.personalDetails.sumInsuredObject = selectedSumAssured;
											$scope.personalDetails.sumInsuredList = sumInsuredArray;
											if(!$rootScope.wordPressEnabled)
											{
												$scope.singleClickLifeQuote();	
											}	
										});
									}*/

									$scope.errorMessage = function (errorMsg) {
										if ((String($rootScope.lifeQuoteResult) == "undefined" || $rootScope.lifeQuoteResult.length == 0)) {
											$scope.updateAnnualPremiumRange(1000, 5000);
											$rootScope.instantQuoteSummaryStatus = false;
											$rootScope.instantQuoteSummaryError = errorMsg;
											$rootScope.progressBarStatus = false;
											$rootScope.viewOptionDisabled = true;
											$rootScope.tabSelectionStatus = true;
											$scope.instantQuoteLifeForm = false;
										} else if ($rootScope.lifeQuoteResult.length > 0) {
											$rootScope.instantQuoteSummaryStatus = true;
											$rootScope.progressBarStatus = false;
											$rootScope.viewOptionDisabled = false;
											$rootScope.tabSelectionStatus = true;
											$scope.instantQuoteLifeForm = false;
										}
										$rootScope.loading = false;
									}

									// Function created to set tool-tip content.	-	modification-0005
									$scope.tooltipPrepare = function (lifeResult) {
										//console.log(JSON.stringify(lifeResult))
										//$rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
										//$rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
										$rootScope.riderOptionList = "<ul style='text-align: left;' class='tickpoints'>";
										for (var i = 0; i < addOnCoverForLife.length; i++) {
											$rootScope.riderOptionList += "<li>" + addOnCoverForLife[i].riderName + "</li>";
										}
										$rootScope.riderOptionList += "</ul>";

										var resultCarrierId = [];
										var testCarrierId = [];
										for (var i = 0; i < lifeResult.length; i++) {
											//push only net premium if greater than 0
											if (Number(lifeResult[i].annualPremium) > 0) {
												var carrierInfo = {};
												carrierInfo.id = lifeResult[i].carrierId;
												carrierInfo.name = lifeResult[i].insuranceCompany;
												carrierInfo.annualPremium = lifeResult[i].annualPremium;
												/*carrierInfo.annualPremium = lifeResult[i].monthlyFinalPremium;*/
												carrierInfo.isMonthlyPremium = false;
												carrierInfo.claimsRating = lifeResult[i].insurerIndex;
												if ($rootScope.wordPressEnabled) {
													carrierInfo.sumInsured = lifeResult[i].sumInsured;
													carrierInfo.businessLineId = "1";
												}

												/*if(testCarrierId.includes(lifeResult[i].carrierId) == false){
													resultCarrierId.push(carrierInfo);
													testCarrierId.push(lifeResult[i].carrierId);
												}*/
												if (p365Includes(testCarrierId, lifeResult[i].carrierId) == false) {
													resultCarrierId.push(carrierInfo);
													testCarrierId.push(lifeResult[i].carrierId);
												}
											}
										}
										$rootScope.resultCarrierId = resultCarrierId;

										//$rootScope.quoteResultInsurerList = $rootScope.tooltipContent.quoteDesc + "\n<ul style='text-align: left;' class='tickpoints'>";
										for (var i = 0; i < resultCarrierId.length; i++) {
											$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
										}
										$rootScope.quoteResultInsurerList += "</ul>";

										//$rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
										$rootScope.calculatedQuotesLength = (String(lifeResult.length)).length == 2 ? String(lifeResult.length) : ("0" + String(lifeResult.length));
										$rootScope.calculatedRidersLength = (String(addOnCoverForLife.length)).length == 2 ? String(addOnCoverForLife.length) : ("0" + String(addOnCoverForLife.length));
										setTimeout(function () {

											scrollv = new scrollable({
												wrapperid: "scrollable-v",
												moveby: 1
											})


										}, 2000)
									}

									$scope.processResult = function () {
										if ($rootScope.lifeQuoteResult.length > 0) {
											//for wordPress
											$rootScope.enabledProgressLoader = false;

											$rootScope.progressBarStatus = false;
											$rootScope.viewOptionDisabled = false;
											$rootScope.tabSelectionStatus = true;
											$scope.instantQuoteLifeForm = false;
											$rootScope.loading = false;
											//for campaign
											$rootScope.campaignFlag = true;
											$rootScope.lifeQuoteResult = $filter('orderBy')($rootScope.lifeQuoteResult, 'dailyPremium');
											var minDailyPremiumValue = $rootScope.lifeQuoteResult[0].dailyPremium;
											var dailyPremiumSliderArray = [];

											for (var j = 0; j < $rootScope.lifeQuoteResult.length; j++) {
												var calculatedDiscAmt = 0;
												var discountAmtList = $rootScope.lifeQuoteResult[j].discountList;
												if (String(discountAmtList) != "undefined") {
													for (var i = 0; i < discountAmtList.length; i++) {
														calculatedDiscAmt += discountAmtList[i].discountAmount;
													}
													calculatedDiscAmt += $rootScope.lifeQuoteResult[j].dailyPremium;
													dailyPremiumSliderArray.push(calculatedDiscAmt);
												} else {
													dailyPremiumSliderArray.push($rootScope.lifeQuoteResult[j].dailyPremium);
												}
											}

											dailyPremiumSliderArray = $filter('orderBy')(dailyPremiumSliderArray);
											$scope.updateAnnualPremiumRange(minDailyPremiumValue, dailyPremiumSliderArray[dailyPremiumSliderArray.length - 1]);
											//if(localStorageService.get("selectedBusinessLineId") == 1)
											//$scope.tooltipPrepare($rootScope.lifeQuoteResult);

											setTimeout(function () {
												$rootScope.loading = false;
												$location.path("/lifeResult");
											}, 100);
										}
									}

									// Function created to get default input parameter from DB.	-	modification-0006
									$scope.singleClickLifeQuote = function () {
										setTimeout(function () {
											$rootScope.instantQuoteSummaryStatus = true;
											$rootScope.progressBarStatus = true;
											$rootScope.viewOptionDisabled = true;
											$rootScope.tabSelectionStatus = false;
											$scope.instantQuoteLifeForm = true;
											$rootScope.loading = true;
											localStorageService.set("selectedBusinessLineId", 1);

											$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
											$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
											$scope.quoteParam.personType = relationLifeQuoteGeneric[0];
											$scope.quoteParam.payoutId = $scope.payoutOptions[0].id;
											$scope.quoteParam.annualIncome = $scope.personalDetails.annualIncomeObject.annualIncome;
											$scope.quoteParam.annualIncomeInterval = $scope.personalDetails.annualIncomeObject.annualIncomeInterval;
											$scope.quoteParam.sumInsured = $scope.personalDetails.sumInsuredObject.amount;
											$scope.quoteParam.frequency = "Annual";
											// Yogesh-12072017: Based on discussion with uday, Maturity age constant value changes from 70 to 50 and value of policy term at least have 5 year. 
											//maturity age difference as 40 - uday
											if ($scope.quoteParam.age > 35) {
												//$scope.personalDetails.maturityAge = maturityAgeConstant;
												var policyTerm = maturityAgeConstant - $scope.quoteParam.age
											} else {
												var policyTerm = 40;
											}
											//var policyTerm = maturityAgeConstant - $scope.quoteParam.age;
											if (policyTerm < $scope.personalDetails.minPolicyTermLimit) {
												$scope.quoteParam.policyTerm = $scope.personalDetails.minPolicyTermLimit;
											} else {
												$scope.quoteParam.policyTerm = policyTerm;
											}

											$scope.personalDetails.minMaturityAge = $scope.quoteParam.age + 5;
											$scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);

											$scope.quote.quoteParam = $scope.quoteParam;
											$scope.quote.personalDetails = $scope.personalDetails;
											$scope.quote.requestType = $scope.globalLabel.request.lifeRequestType;

											localStorageService.set("lifeQuoteInputParamaters", $scope.quote);
											localStorageService.set("lifePersonalDetails", $scope.personalDetails);

											//analyticsTrackerSendData($scope.quote); //	-	modification-0004
											$scope.requestId = null;

											RestAPI.invoke($scope.globalLabel.getRequest.quoteLife, $scope.quote).then(function (callback) {
												$rootScope.lifeQuoteRequest = [];

												if (callback.responseCode == $scope.globalLabel.responseCode.success) {
													$scope.responseCodeList = [];

													$scope.requestId = callback.QUOTE_ID;

													localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.requestId);

													$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
													localStorageService.set("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
													
													$rootScope.lifeQuoteRequest = callback.data;

													if (String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0) {
														$scope.quoteResult.length = 0;
													}

													if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0) {
														$rootScope.lifeQuoteResult.length = 0;
													}


													$rootScope.lifeQuoteResult = [];
													$scope.lifeQuoteResponse = [];
													angular.forEach($rootScope.lifeQuoteRequest, function (obj, i) {
														var request = {};
														var header = {};

														header.messageId = messageIDVar;
														header.campaignID = campaignIDVar;
														header.source = sourceOrigin;
														header.deviceId = deviceIdOrigin;
														header.transactionName = $scope.globalLabel.transactionName.lifeQuoteResult;
														request.header = header;
														request.body = obj;

														$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
															success(function (callback, status) {
																var lifeQuoteResponse = JSON.parse(callback);
																$scope.lifeQuoteResponse.push(callback);
																if (lifeQuoteResponse.QUOTE_ID == $scope.requestId) {
																	$scope.responseCodeList.push(lifeQuoteResponse.responseCode);

																	if (lifeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
																		for (var j = 0; j < $rootScope.carrierDetails.riderList.length; j++) {
																			if ($rootScope.carrierDetails.riderList[j].carrierId == lifeQuoteResponse.data.quotes[0].carrierId && $rootScope.carrierDetails.riderList[j].productId == lifeQuoteResponse.data.quotes[0].productId) {
																				lifeQuoteResponse.data.quotes[0].riders = $rootScope.carrierDetails.riderList[j].riders;
																			}
																		}

																		for (var k = 0; k < lifeQuoteResponse.data.quotes[0].riderList.length; k++) {
																			for (var l = 0; l < lifeQuoteResponse.data.quotes[0].riders.length; l++) {
																				if (lifeQuoteResponse.data.quotes[0].riderList[k].riderId == lifeQuoteResponse.data.quotes[0].riders[l].id) {
																					lifeQuoteResponse.data.quotes[0].riders[l].value = lifeQuoteResponse.data.quotes[0].riderList[k].riderPremiumAmount;
																				}
																			}
																		}
																		if (lifeQuoteResponse.data.quotes[0].riders) {
																			for (var m = 0; m < lifeQuoteResponse.data.quotes[0].riders.length; m++) {
																				if (lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'At Additional Cost') {
																					lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "additionalCost";
																					lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Additional Cost";
																					//console.log("If Part : " + lifeQuoteResponse.data.quotes[0].carrierId + " :: additionalCost :: " + lifeQuoteResponse.data.quotes[0].riders[m].riderId);
																				} else if (lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'Not Available') {
																					lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "notAvailable";
																					lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Not Available";
																					//console.log("Else If Part : " + lifeQuoteResponse.data.quotes[0].carrierId + " :: notAvailable :: " + lifeQuoteResponse.data.quotes[0].riders[m].riderId);
																				} else if (lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'Included') {
																					lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "included";
																					lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Included";
																					//console.log("Else If Part : " + lifeQuoteResponse.data.quotes[0].carrierId + " :: included :: " + lifeQuoteResponse.data.quotes[0].riders[m].riderId);
																				} else {
																					//console.log("Else Part : " + lifeQuoteResponse.data.quotes[0].carrierId);
																				}
																			}
																		}
																		for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
																			if ($rootScope.lifeQuoteRequest[i].messageId == lifeQuoteResponse.messageId) {
																				$rootScope.loading = false;
																				lifeQuoteResponse.data.quotes[0].dailyPremium = Math.round(lifeQuoteResponse.data.quotes[0].annualPremium / 365);
																				lifeQuoteResponse.data.quotes[0].insuranceCompany = JSON.parse(lifeQuoteResponse.data.quotes[0].insuranceCompany);
																				$rootScope.lifeQuoteResult.push(lifeQuoteResponse.data.quotes[0]);
																				//alert("lifeQuoteResponse.data : " + JSON.stringify(lifeQuoteResponse.data));
																				getAllProductFeatures(lifeQuoteResponse.data.quotes[0], true);
																				$rootScope.lifeQuoteRequest[i].status = 1;
																			}
																		}
																		$scope.processResult();
																	}
																}
															}).
															error(function (data, status) {
																$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
															});
													});

													$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
														//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
														if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
															//$rootScope.loading = false;

															if ($scope.responseCodeList.length == $rootScope.lifeQuoteRequest.length) {
																$rootScope.loading = false;
																//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
																if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
																	// This condition will satisfy only when at least one product is found in the quoteResponse array.
																	//} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
																} else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
																	$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
																} else {
																	//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
																	//comments updated based on Uday
																	$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg));
																}
															}
													}, true);
												} else {
													$scope.responseCodeList = [];
													if (String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0)
														$scope.quoteResult.length = 0;

													if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0)
														$rootScope.lifeQuoteResult.length = 0;

													$rootScope.lifeQuoteResult = [];
													$scope.errorMessage(callback.message);
												}
											});
										}, 100);

									}

									/*$scope.calculateLifePremium=function(){
										if(!$rootScope.wordPressEnabled)
										{	
											$scope.singleClickLifeQuote();
										}
									}*/
									// Function created to pre-populate input fields. 
									$scope.prePopulateFields = function () {
										for (var i = 0; i < annualIncomesGeneric.length; i++) {
											if ($scope.quoteParam.annualIncome == annualIncomesGeneric[i].annualIncome) {
												$scope.personalDetails.annualIncomeObject = annualIncomesGeneric[i];
												break;
											}
										}

										listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function (sumInsuredArray, selectedSumAssured) {
											$scope.quoteParam.sumInsured = selectedSumAssured.amount;
											$scope.personalDetails.sumInsuredObject = selectedSumAssured;
											$scope.personalDetails.sumInsuredList = sumInsuredArray;
										});

										console.log('$rootScope.lifeQuoteResult length is: ', $rootScope.lifeQuoteResult);
										if ($rootScope.lifeQuoteResult) {
											if ($rootScope.lifeQuoteResult.length > 0) {
												$location.path("/lifeResult");
											}
										}
										setTimeout(function () {
											if (!$rootScope.wordPressEnabled) {
												$scope.singleClickLifeQuote();
											} else {
												//$scope.instantQuoteLifeForm=false;

											}
										}, 100);
									}

									// Function created to get default input parameter from DB.	-	modification-0007
									$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {
										if (defaultQuoteStatus) {
											$scope.quoteParam = defaultLifeQuoteParam.quoteParam;
											$scope.personalDetails = defaultLifeQuoteParam.personalDetails;
										} else {
											$scope.quoteParam = lifeQuoteCookie.quoteParam;
											$scope.personalDetails = personalDetailsCookie;

											$scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
											$scope.personalDetails.selectedAddOnCovers = makeObjectEmpty($scope.quoteParam.riders, "array");
										}

										$scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);

										$scope.prePopulateFields();
										defaultInputParamCallback();

									}

									// Below piece of code written to check whether lifeQuoteCookie is present or not. 
									if (lifeQuoteCookie != null && String(lifeQuoteCookie) !== "undefined") {
										$scope.fetchDefaultInputParamaters(false, function () { });
									} else {
										$scope.fetchDefaultInputParamaters(true, function () { });
									}

								});
							}

							if (!localStorageService.get("ridersLifeStatus")) {
								// To get the life rider list applicable for this user.
								getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.life, $scope.globalLabel.request.findAppConfig, function (addOnCoverForLife) {
									localStorageService.set("addOnCoverForLife", addOnCoverForLife);
									localStorageService.set("ridersLifeStatus", true);
									// var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
									// getDocUsingId(RestAPI, docId, function(tooltipContent){
									//localStorageService.set("lifeInstantQuoteTooltipContent", tooltipContent.toolTips);
									//$rootScope.tooltipContent = tooltipContent.toolTips;
									$scope.instantQuoteCalculation(addOnCoverForLife);
									//});
								});
							} else {
								//$rootScope.tooltipContent = localStorageService.get("lifeInstantQuoteTooltipContent");
								$scope.instantQuoteCalculation(localStorageService.get("addOnCoverForLife"));
							}

						}); //getUsingDoc end here


						// Function created to get Product Features and update Quote Result Object Initially - modification-0009
						function getAllProductFeatures(selectedProduct, productFetchStatus) {
							var variableReplaceArray = [];
							var productFeatureJSON = {};
							var customFeaturesJSON = {};

							$rootScope.consolidatedBenefitsList = [];
							$rootScope.consolidatedSavingsList = [];
							$rootScope.consolidatedFlexibilityList = [];


							productFeatureJSON.documentType = $scope.globalLabel.documentType.lifeProduct;
							productFeatureJSON.carrierId = selectedProduct.carrierId;
							productFeatureJSON.productId = selectedProduct.productId;
							productFeatureJSON.businessLineId = 1;

							var selectedCarrierId = selectedProduct.carrierId;
							var selectedProductId = selectedProduct.productId;

							for (var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++) {
								if (selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
									$scope.brochureUrl = $rootScope.carrierDetails.brochureList[i].brochureUrl;
							}

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
								RestAPI.invoke($scope.globalLabel.transactionName.getProductFeatures, productFeatureJSON).then(function (callback) {

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


					}// life tab end here
					else if (tab == 4) {
						$scope.healthInstantQuoteCalculation = function (addOnCoverForHealth) {
							addRidersToDefaultQuote(addOnCoverForHealth, localStorageService.get("selectedBusinessLineId"), function (defaultRiderList, defaultRiderArrayObject) {
								var healthQuoteCookie = localStorageService.get("healthQuoteInputParamaters");
								$scope.quote = {};
								$scope.quoteParam = {};
								$scope.ratingParam = {};
								$scope.personalInfo = {};
								$scope.quote.quoteParam = {};
								$scope.quoteFinalResult = {};
								$scope.selectedDisease = {};
								$scope.medicalInstant = {};

								$scope.quoteFinalResult.quotes = [];
								$scope.selectedDisease.diseaseList = [];
								$scope.selectedFamilyArray = [];

								$scope.diseaseList = localStorageService.get("diseaseList");

								$scope.hospitalizationLimitArray = localStorageService.get("hospitalizationLimitList");

								$scope.familyList = healthFamilyListGeneric;
								$scope.genderType = genderTypeGeneric;
								$scope.preDiseaseStatus = preDiseaseStatusGeneric;
								$scope.personalInfo.selFamilyMember = selectedFamilyMemberId;
								$rootScope.viewOptionDisabled = true;
								$rootScope.tabSelectionStatus = true;
								$scope.instantQuoteHealthForm = true;
								$scope.medicalInstant.collapseFamilyList = false;

								var member;
								$scope.$watch(function (scope) { return scope.familyList; }, function () {
									$scope.selectedFamilyArray = [];
									for (var i = 0; i < $scope.familyList.length; i++) {
										if ($scope.familyList[i].val == true) {
											member = {};
											member.id = $scope.familyList[i].id;
											member.display = $scope.familyList[i].member;
											member.existSince = "";
											member.existSinceError = false;
											member.status = false;
											if (member.relation == "Son" || member.relation == "Daughter") {
												member.label = ($scope.familyList[i].member.concat(" aged ")).concat($scope.familyList[i].age);
											} else {
												member.label = $scope.familyList[i].member;
											}

											$scope.selectedFamilyArray.push(member);
										}
									}
								}, true);

								$scope.calcDefaultAreaDetails = function (areaCode) {
									$http.get(getServiceLink + "Pincode" + "&q=" + areaCode).then(function (response) {
										var areaDetails = JSON.parse(response.data);
										if (areaDetails.responseCode == $scope.globalLabel.responseCode.success) {
											$scope.onSelectPinOrArea(areaDetails.data[0]);
										}
									});
								};

								$scope.onSelectPinOrArea = function (item) {
									$scope.modalPIN = false;
									$scope.selectedArea = item.area;
									$scope.personalInfo.pincode = item.pincode;
									$scope.personalInfo.displayArea = item.area + ", " + item.district;
									$scope.personalInfo.city = item.district;
									$scope.personalInfo.state = item.state;
									$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalInfo.displayArea;
									localStorageService.set("commAddressDetails", item);
									// setTimeout(function(){
									// 	$scope.singleClickHealthQuote();
									// },100);
								};

								// Quote result premium slider.
								$scope.updateAnnualPremiumRange = function (minPremiumValue, maxPremiumValue) {
									if (minPremiumValue > maxPremiumValue) {
										$rootScope.minAnnualPremium = maxPremiumValue;
										$rootScope.maxAnnualPremium = minPremiumValue;
									} else {
										$rootScope.minAnnualPremium = minPremiumValue;
										$rootScope.maxAnnualPremium = maxPremiumValue;
									}
								};

								$scope.errorMessage = function (errorMsg) {
									if ($scope.errorRespCounter && ($rootScope.healthQuoteResult === "undefined" || $rootScope.healthQuoteResult.length == 0)) {
										$scope.errorRespCounter = false;
										$scope.updateAnnualPremiumRange(1000, 5000);
										$rootScope.instantQuoteSummaryStatus = false;
										$rootScope.instantQuoteSummaryError = errorMsg;
										$rootScope.viewOptionDisabled = true;
										$rootScope.tabSelectionStatus = true;
										$scope.instantQuoteHealthForm = false;
										$rootScope.loading = false;
									} else if ($rootScope.healthQuoteResult.length > 0) {
										$rootScope.instantQuoteSummaryStatus = true;
										$rootScope.viewOptionDisabled = false;
										$rootScope.tabSelectionStatus = true;
										$scope.instantQuoteHealthForm = false;
										$rootScope.loading = false;
									}
								};

								$scope.tooltipPrepare = function (healthResult) {
									var i;
									//$rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
									//$rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
									$rootScope.riderOptionList = "<ul style='text-align: left;' class='tickpoints'>";
									for (i = 0; i < addOnCoverForHealth.length; i++) {
										$rootScope.riderOptionList += "<li>" + addOnCoverForHealth[i].riderName + "</li>";
									}
									$rootScope.riderOptionList += "</ul>";

									var resultCarrierId = [];
									var testCarrierId = [];
									for (i = 0; i < healthResult.length; i++) {
										//push only net premium if greater than 0
										if (Number(healthResult[i].annualPremium) > 0) {
											var carrierInfo = {};
											carrierInfo.id = healthResult[i].carrierId;
											carrierInfo.name = healthResult[i].insuranceCompany;
											carrierInfo.annualPremium = healthResult[i].annualPremium;
											carrierInfo.claimsRating = healthResult[i].insurerIndex;

											if (p365Includes(testCarrierId, healthResult[i].carrierId) == false) {
												resultCarrierId.push(carrierInfo);
												testCarrierId.push(healthResult[i].carrierId);
											}
										}
									}
									$rootScope.resultCarrierId = resultCarrierId;
									//$rootScope.quoteResultInsurerList = $rootScope.tooltipContent.quoteDesc + "\n<ul style='text-align: left;' class='tickpoints'>";
									for (i = 0; i < resultCarrierId.length; i++) {
										$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
									}
									$rootScope.quoteResultInsurerList += "</ul>";

									//$rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
									$rootScope.calculatedQuotesLength = (String(healthResult.length)).length == 2 ? String(healthResult.length) : ("0" + String(healthResult.length));
									$rootScope.calculatedRidersLength = (String(addOnCoverForHealth.length)).length == 2 ? String(addOnCoverForHealth.length) : ("0" + String(addOnCoverForHealth.length));
									setTimeout(function () {

										scrollv = new scrollable({
											wrapperid: "scrollable-v",
											moveby: 1
										});


									}, 3000);
								};

								$scope.processResult = function () {
									if ($rootScope.healthQuoteResult.length > 0) {
										//for wordPress
										$rootScope.enabledProgressLoader = false;

										$rootScope.instantQuoteSummaryStatus = true;
										$rootScope.viewOptionDisabled = false;
										$rootScope.tabSelectionStatus = true;
										$scope.instantQuoteHealthForm = false;
										$rootScope.loading = false;
										//for campaign
										$rootScope.campaignFlag = true;
										$rootScope.healthQuoteResult = $filter('orderBy')($rootScope.healthQuoteResult, 'annualPremium');

										// var minAnnualPremiumValue = $rootScope.healthQuoteResult[0].annualPremium;
										// var annualPremiumSliderArray = [];

										// for (var j = 0; j < $rootScope.healthQuoteResult.length; j++) {
										// 	var calculatedDiscAmt = 0;
										// 	var discountAmtList = $rootScope.healthQuoteResult[j].discountDetails;
										// 	if (String(discountAmtList) != "undefined") {
										// 		for (var i = 0; i < discountAmtList.length; i++) {
										// 			calculatedDiscAmt += discountAmtList[i]["com.sutrr.quote.healthquotecalc.DiscountDetails"].discountAmount;
										// 		}
										// 		calculatedDiscAmt += $rootScope.healthQuoteResult[j].annualPremium;
										// 		annualPremiumSliderArray.push(calculatedDiscAmt);
										// 	} else {
										// 		annualPremiumSliderArray.push($rootScope.healthQuoteResult[j].annualPremium);
										// 	}
										// }

										// annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
										// $scope.updateAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);

										//if(localStorageService.get("selectedBusinessLineId") == 4)
										//$scope.tooltipPrepare($rootScope.healthQuoteResult);

										setTimeout(function () {
											//$rootScope.loading = false;
											$location.path("/healthResult");
										}, 100);
									}
								}

								$scope.singleClickHealthQuote = function () {
									var i;
									setTimeout(function () {

										$rootScope.viewOptionDisabled = true;
										$rootScope.tabSelectionStatus = false;
										$scope.errorRespCounter = true;
										$scope.instantQuoteHealthForm = true;
										$rootScope.loading = true;

										$scope.quoteParam.dependent = [];
										$scope.quoteParam.preExistingDisease = [];
										$scope.personalInfo.selectedFamilyMembers = [];

										$scope.personalInfo.minHospitalisationLimit = $scope.hospitalisationLimit.minHosLimit;
										$scope.personalInfo.maxHospitalisationLimit = $scope.hospitalisationLimit.maxHosLimit;
										$scope.quoteParam.childCount = 0;
										$scope.quoteParam.adultCount = 0;
										$scope.quoteParam.totalCount = 0;


										if ($scope.isDiseased == true)
											$scope.quoteParam.preExistingDisease = $scope.selectedDisease.diseaseList;

										for (i = 0; i < $scope.familyList.length; i++)
											if ($scope.familyList[i].member == 'Self')
												$scope.quoteParam.selfAge = Number($scope.familyList[i].age);

										for (i = 0; i < $scope.familyList.length; i++)
											if ($scope.familyList[i].member == 'Spouse')
												$scope.ratingParam.spouseAge = Number($scope.familyList[i].age);

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
												member.occupationClass = $scope.familyList[i].occupationClass;
												$scope.quoteParam.dependent.push(member);
											}
										}

										$scope.personalInfo.selectedFamilyMembers = [];
										for (i = 0; i < $scope.familyList.length; i++) {
											if ($scope.familyList[i].val == true) {
												member = {};
												member.id = Number($scope.familyList[i].id);
												member.age = Number($scope.familyList[i].age);
												member.dob = calcDOBFromAge($scope.familyList[i].age);
												//member.salutation = $scope.familyList[i].gender == "M" ? "Mr" : "Ms";
												member.existSince = "";
												member.existSinceError = false;
												member.status = false;
												member.relationship = $scope.familyList[i].relationship;

												//member.gender = $scope.familyList[i].gender == "M" ? "Male" : "Female";
												if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && member.relationship == "S") {
													member.gender = "Female";
												} else if ($scope.quoteParam.selfGender == 'F' && $scope.quoteParam.selfRelationShip == 'S' && member.relationship == "SP") {
													member.gender = "Male";
												} else {
													member.gender = $scope.familyList[i].gender == "M" ? "Male" : "Female";
												}
												member.salutation = member.gender == "Male" ? "Mr" : "Ms";

												/*if($scope.familyList[i].member == "Spouse"){
												if(member.gender == "Male")
													member.relation = "Husband";	
												else
													member.relation = "Wife";
											}else{

											}*/
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

										for (var i = 0; i < $scope.quoteParam.dependent.length; i++) {
											if ($scope.quoteParam.dependent[i].relationShip == "CH" && $scope.quoteParam.dependent[i].age <= $scope.ratingParam.maxAllowedChildAge)
												$scope.quoteParam.childCount++;
											else
												$scope.quoteParam.adultCount++;
										}

										//logic to decide plan type is "family" or "individual"
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

										localStorageService.set("selectedBusinessLineId", 4);
										//console.log(JSON.stringify($scope.personalInfo))
										$scope.quoteParam.totalCount = $scope.quoteParam.adultCount + $scope.quoteParam.childCount;
										$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
										$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");

										$scope.quote.quoteParam = $scope.quoteParam;
										$scope.quote.ratingParam = $scope.ratingParam;
										$scope.quote.personalInfo = $scope.personalInfo;
										$scope.quote.requestType = $scope.globalLabel.request.healthRequestType;


										localStorageService.set("healthQuoteInputParamaters", $scope.quote);
										localStorageService.set("selectedArea", $scope.selectedArea);
										localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
										localStorageService.set("selectedFamilyForHealth", $scope.familyList);
										localStorageService.set("selectedDisease", $scope.selectedDisease);
										localStorageService.set("selectedFamilyArray", $scope.selectedFamilyArray);
										localStorageService.set("diseaseList", $scope.diseaseList);
										$rootScope.hospitalisationLimit = $scope.hospitalisationLimit;
										localStorageService.set("hospitalisationLimitVal", $scope.hospitalisationLimit);
										//for Reset
										localStorageService.set("healthQuoteInputParamatersReset", $scope.quote);
										localStorageService.set("selectedAreaReset", $scope.selectedArea);
										localStorageService.set("isDiseasedForHealthReset", $scope.isDiseased);
										localStorageService.set("selectedFamilyForHealthReset", $scope.familyList);
										localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);
										localStorageService.set("selectedFamilyArrayReset", $scope.selectedFamilyArray);
										localStorageService.set("diseaseListReset", $scope.diseaseList);
										localStorageService.set("hospitalisationLimitValReset", $scope.hospitalisationLimit);

										// Google Analytics Tracker added.
										//analyticsTrackerSendData($scope.quote);

										RestAPI.invoke($scope.globalLabel.getRequest.quoteHealth, $scope.quote).then(function (healthQuoteResult) {
											$rootScope.healthQuoteRequest = [];

											if (healthQuoteResult.responseCode == $scope.globalLabel.responseCode.success) {
												$scope.responseCodeList = [];

												$scope.requestId = healthQuoteResult.QUOTE_ID;
												localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.requestId);

												$scope.UNIQUE_QUOTE_ID_ENCRYPTED = healthQuoteResult.encryptedQuoteId;
												localStorageService.set("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
												

												$rootScope.healthQuoteRequest = healthQuoteResult.data;

												if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0) {
													$rootScope.healthQuoteResult.length = 0;
												}


												$rootScope.healthQuoteResult = [];
												$scope.healthQuoteResponse = [];
												angular.forEach($rootScope.healthQuoteRequest, function (obj, i) {
													var request = {};
													var header = {};

													header.messageId = messageIDVar;
													header.campaignID = campaignIDVar;
													header.source = sourceOrigin;
													header.transactionName = $scope.globalLabel.transactionName.healthQuoteResult;
													header.deviceId = deviceIdOrigin;
													request.header = header;
													request.body = obj;

													$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
														success(function (callback, status) {
															var healthQuoteResponse = JSON.parse(callback);
															$scope.healthQuoteResponse.push(callback);
															if (healthQuoteResponse.QUOTE_ID == $scope.requestId) {
																$scope.responseCodeList.push(healthQuoteResponse.responseCode);

																if (healthQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {

																	for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
																		if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
																			$rootScope.loading = false;
																			$rootScope.healthQuoteResult.push(healthQuoteResponse.data.quotes[0]);
																			$rootScope.healthQuoteRequest[i].status = 1;
																		}
																	}
																	$scope.processResult();
																} else {
																	for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
																		if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
																			$rootScope.healthQuoteRequest[i].status = 2;
																			//$rootScope.healthQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
																			//comments updated based on Uday
																			$rootScope.healthQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMedicalErrMsg);
																		}
																	}
																}
															}
														}).
														error(function (data, status) {
															$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
														});
												});

												$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
													//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
													//$rootScope.loading = false;
													if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
														//$rootScope.loading = false;
														if ($scope.responseCodeList.length == $rootScope.healthQuoteRequest.length) {
															$rootScope.loading = false;

															for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
																if ($rootScope.healthQuoteRequest[i].status == 0) {
																	$rootScope.healthQuoteRequest[i].status = 2;
																	//$rootScope.healthQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
																	$rootScope.healthQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMedicalErrMsg);
																}
															}

															//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
															if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
																// This condition will satisfy only when at least one product is found in the quoteResponse array.
																//}else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
															} else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
																$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
															} else {
																//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
																//comments updated based on Uday
																$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMedicalErrMsg));
															}
														}
												}, true);
											} else {
												$scope.responseCodeList = [];

												if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0)
													$rootScope.healthQuoteResult.length = 0;

												$rootScope.healthQuoteResult = [];
												$scope.errorMessage(callback.message);
											}
										});
									}, 100);

								};

								$scope.fetchDefaultInputParamaters = function (defaultInputParamCallback) {
									$scope.isDiseased = false;
									$scope.quoteParam = defaultHealthQuoteParam.quoteParam;
									$scope.ratingParam = defaultHealthQuoteParam.ratingParam;
									$scope.personalInfo = defaultHealthQuoteParam.personalInfo;

									for (var i = 0; i < $scope.hospitalizationLimitArray.length; i++) {
										if ($scope.hospitalizationLimitArray[i].minHosLimit <= $scope.personalInfo.hospitalisationLimit
											&& $scope.hospitalizationLimitArray[i].maxHosLimit > $scope.personalInfo.hospitalisationLimit) {
											$scope.hospitalisationLimit = $scope.hospitalizationLimitArray[i];
											break;
										}
									}

									$scope.personalInfo.preDiseaseStatus = "No";
									$scope.personalInfo.pincode = localStorageService.get("cityDataFromIP") ? (localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : $scope.personalInfo.pincode) : $scope.personalInfo.pincode;
									$scope.calcDefaultAreaDetails($scope.personalInfo.pincode);

								};
								var healthQuoteCookie = localStorageService.get("healthQuoteInputParamaters");
								console.log('healthQuoteCookie is: ', healthQuoteCookie);
								if (healthQuoteCookie != null && String(healthQuoteCookie) !== "undefined") {
									$scope.quote = healthQuoteCookie;
									$scope.quoteParam = healthQuoteCookie.quoteParam;
									$scope.personalInfo = healthQuoteCookie.personalInfo;
									$scope.ratingParam = healthQuoteCookie.ratingParam;

									$scope.familyList = localStorageService.get("selectedFamilyForHealth");
									$scope.isDiseased = localStorageService.get("isDiseasedForHealth");
									$scope.selectedArea = localStorageService.get("selectedArea");
									$scope.selectedDisease = localStorageService.get("selectedDisease");

									var item = localStorageService.get("commAddressDetails");
									$scope.modalPIN = false;
									$scope.selectedArea = item.area;
									$scope.personalInfo.pincode = item.pincode;
									$scope.personalInfo.displayArea = item.area + ", " + item.district;
									$scope.personalInfo.city = item.district;
									$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalInfo.displayArea;
									$scope.selectedFamilyArray = localStorageService.get("selectedFamilyArray");
									$scope.diseaseList = localStorageService.get("diseaseList");
									$scope.hospitalizationLimitArray = localStorageService.get("hospitalizationLimitList");

									for (var i = 0; i < $scope.hospitalizationLimitArray.length; i++) {
										if ($scope.hospitalizationLimitArray[i].minHosLimit <= $scope.personalInfo.hospitalisationLimit
											&& $scope.hospitalizationLimitArray[i].maxHosLimit > $scope.personalInfo.hospitalisationLimit) {
											if (localStorageService.get("hospitalisationLimitVal")) {
												$scope.hospitalisationLimit = localStorageService.get("hospitalisationLimitVal");
											} else {
												$scope.hospitalisationLimit = $scope.hospitalizationLimitArray[i];
											}
											break;
										}
									}
									console.log('$scope.selectedFamilyArray is: ', $scope.selectedFamilyArray);
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

									localStorageService.set("hospitalisationLimitVal", $scope.hospitalisationLimit);
									if ($rootScope.healthQuoteResult) {
										if ($rootScope.healthQuoteResult.length > 0) {
											console.log('redirecting to healthResult from header navigation is:', $rootScope.healthQuoteResult.length);
											$location.path("/healthResult");
										} else {
											setTimeout(function () {
												$scope.singleClickHealthQuote();
											}, 100);
										}
									} else {
										setTimeout(function () {
											$scope.singleClickHealthQuote();
										}, 100);
									}
									// setTimeout(function(){
									// 	if(!$rootScope.wordPressEnabled){	

									// 		$scope.singleClickHealthQuote();
									// 	}else{
									// 		//$scope.instantQuoteHealthForm=false;

									// 	}											
									// },100);
								} else {
									$scope.fetchDefaultInputParamaters(function () { });
									if ($rootScope.healthQuoteResult) {
										if ($rootScope.healthQuoteResult.length > 0) {
											console.log('redirecting to healthResult from header navigation is:', $rootScope.healthQuoteResult.length);
											$location.path("/healthResult");
										} else {
											setTimeout(function () {
												$scope.singleClickHealthQuote();
											}, 100);
										}
									} else {
										setTimeout(function () {
											$scope.singleClickHealthQuote();
										}, 100);
									}
								}
							});
						}; // healthInstantQuoteCalculation end here

						if (!localStorageService.get("ridersHealthStatus")) {
							// To get the health rider list applicable for this user.
							getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.health, $scope.globalLabel.request.findAppConfig, function (addOnCoverForHealth) {
								//localStorageService.set("addOnCoverForHealth", addOnCoverForHealth);
								//localStorageService.set("ridersHealthStatus", true);
								//fetching disease list
								getListFromDB(RestAPI, "", "Disease", $scope.globalLabel.request.findAppConfig, function (callback) {
									if (callback.responseCode == $scope.globalLabel.responseCode.success) {
										var diseaseData = callback.data;

										for (var i = 0; i < diseaseData.length; i++) {
											diseaseData[i].familyList = [];
										}

										localStorageService.set("diseaseList", diseaseData);


										getListFromDB(RestAPI, "", $scope.globalLabel.documentType.hospitalizationLimit, $scope.globalLabel.request.findAppConfig, function (hospitalizationLimitList) {
											if (hospitalizationLimitList.responseCode == $scope.globalLabel.responseCode.success) {
												localStorageService.set("hospitalizationLimitList", hospitalizationLimitList.data);
												//for reset
												localStorageService.set("hospitalizationLimitListReset", hospitalizationLimitList.data);
											}

											// var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
											// getDocUsingId(RestAPI, docId, function(tooltipContent){
											//localStorageService.set("healthInstantQuoteTooltipContent", tooltipContent.toolTips);
											//$rootScope.tooltipContent = tooltipContent.toolTips;
											localStorageService.set("addOnCoverForHealth", addOnCoverForHealth);
											localStorageService.set("ridersHealthStatus", true);
											$scope.healthInstantQuoteCalculation(addOnCoverForHealth);
										});
										//});
									} else {
										$rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
									}
								});
							});
						} else {
							//$rootScope.tooltipContent = localStorageService.get("healthInstantQuoteTooltipContent");
							$scope.healthInstantQuoteCalculation(localStorageService.get("addOnCoverForHealth"));
						}

					}// health tab end here
					//travel tab starts here
					else if (tab == 5) {
						$scope.travelInstantQuoteCalculation = function () {
							var travelQuoteCookie = localStorageService.get("travelQuoteInputParamaters");
							var travelDetailsCookie = localStorageService.get("travelDetails");
							var DATE_FORMAT = "dd/mm/yy";
							$scope.quote = {};
							$scope.quoteParam = {};
							$scope.quoteParam.travellers = [];
							$scope.sumInsuredList = [];
							$scope.continentList = [];
							$scope.selectedDisease = {};
							$scope.selectedDisease.diseaseList = [];
							$scope.diseaseList = [];
							$scope.destinations = [];
							$scope.travelDetails = {};
							$scope.ratingParam = {};
							$scope.travelInstantQuoteForm = {};
							$scope.pedStatus = preDiseaseStatusGen;
							$scope.numberOfTravellers = getList(8);
							$scope.numberOfTraveller = $scope.numberOfTravellers[0];
							$scope.genderType = travelGenderTypeGeneric;
							$scope.questionStatus = questionStatusGeneric;
							$scope.tripTypeList = tripTypeListGeneric;
							$scope.tripDurationList = tripDurationListGeneric;
							$scope.travelDetails.tripDuration = $scope.tripDurationList[0].duration;
							$scope.diseaseList = localStorageService.get("diseaseList");

							$scope.errorMessage = function (errorMsg) {
								if ((String($rootScope.travelQuoteResult) == "undefined" || $rootScope.travelQuoteResult.length == 0)) {
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
								//$rootScope.loading = false;
							};


							// Preparing tooltip to be displayed on instant quote screen.
							$scope.tooltipPrepare = function (travelResult) {
								var i;
								var resultCarrierId = [];
								var testCarrierId = [];
								$rootScope.resultCarrierId = [];
								for (i = 0; i < travelResult.length; i++) {
									//push only net premium if greater than 0
									if (Number(travelResult[i].netPremium) > 0) {
										var carrierInfo = {};
										carrierInfo.productInfo = travelResult[i];
										carrierInfo.id = travelResult[i].carrierId;
										carrierInfo.name = travelResult[i].insuranceCompany;
										carrierInfo.annualPremium = travelResult[i].grossPremium;
										carrierInfo.claimsRating = travelResult[i].insurerIndex;

										if (p365Includes(testCarrierId, travelResult[i].carrierId) == false) {
											resultCarrierId.push(carrierInfo);
											testCarrierId.push(travelResult[i].carrierId);
										}
									}
								}
								$rootScope.resultedCarriers = resultCarrierId;
								$rootScope.resultCarrierId = resultCarrierId;

								for (i = 0; i < resultCarrierId.length; i++) {
									$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
								}
								$rootScope.quoteResultInsurerList += "</ul>";

								$rootScope.calculatedQuotesLength = (String(travelResult.length)).length == 2 ? String(travelResult.length) : ("0" + String(travelResult.length));
								setTimeout(function () {
									scrollv = new scrollable({
										wrapperid: "scrollable-v",
										moveby: 4,
										mousedrag: true
									});
								}, 2000);
							};

							// Processing of quote result to displayed on UI.
							$scope.processResult = function () {
								if ($rootScope.travelQuoteResult.length > 0) {
									$rootScope.instantQuoteSummaryStatus = true;
									$scope.instantQuoteTravelForm = false;
									$rootScope.loading = false;
									//for campaign
									$rootScope.campaignFlag = true;
									$rootScope.travelQuoteResult = $filter('orderBy')($rootScope.travelQuoteResult, 'grossPremium');
									//$rootScope.loading = false;
									$location.path("/travelResult");
								}
							};
							//};								

							$scope.singleClickTravelQuote = function () {
								setTimeout(function () {
									$rootScope.tabSelectionStatus = false;
									$rootScope.loading = true;
									$scope.instantQuoteTravelForm = true;
									$scope.quote = {};

									localStorageService.set("selectedBusinessLineId", $scope.globalLabel.businessLineType.travel);
									$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
									$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
									$scope.quote.requestType = $scope.globalLabel.request.travelRequestType;

									delete $scope.quote.documentType;
									$scope.quote.quoteParam = $scope.quoteParam;
									if ($scope.quote.quoteParam.pedStatus == "Y") {
										localStorageService.set("pedDetails", $scope.selectedDisease.diseaseList);
									}
									//list to get min and max age from the selected travellers
									$scope.ageList = [];
									for (var i = 0; i < $scope.quoteParam.travellers.length; i++) {
										$scope.ageList.push($scope.quoteParam.travellers[i].age);
									}
									$scope.quote.quoteParam.quoteMinAge = getMinAge($scope.ageList);
									$scope.quote.quoteParam.quoteMaxAge = getMaxAge($scope.ageList);
									$scope.quote.travelDetails = $scope.travelDetails;
									localStorageService.set("quote", $scope.quote);
									localStorageService.set("travelQuoteInputParamaters", $scope.quote);
									localStorageService.set("travelDetails", $scope.travelDetails);
									localStorageService.set("isDiseasedForTravel", $scope.isDiseased);
									localStorageService.set("selectedDisease", $scope.selectedDisease);
									localStorageService.set("diseaseList", $scope.diseaseList);
									localStorageService.set("selectedTravellersForTravel", $scope.travellersList);
									localStorageService.set("selectedTravellerArray", $scope.selectedTravellerArray);

									//for Reset
									localStorageService.set("quoteReset", $scope.quote);
									localStorageService.set("travelQuoteInputParamatersReset", $scope.quote);
									localStorageService.set("travelDetailsReset", $scope.travelDetails);
									localStorageService.set("isDiseasedForTravelReset", $scope.isDiseased);
									localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);
									localStorageService.set("diseaseListReset", $scope.diseaseList);
									localStorageService.set("selectedTravellersForTravelReset", $scope.travellersList);
									localStorageService.set("selectedTravellerArrayReset", $scope.selectedTravellerArray);
									$scope.quote = prepareQuoteRequest($scope.quote);
									$scope.requestId = null;
									var quoteUserInfo = localStorageService.get("quoteUserInfo");
									RestAPI.invoke($scope.globalLabel.getRequest.quoteTravel, $scope.quote).then(function (callback) {
										$rootScope.travelQuoteRequest = [];
										if (callback.responseCode == $scope.globalLabel.responseCode.success) {
											$scope.responseCodeList = [];
											$scope.requestId = callback.QUOTE_ID;
											localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID", $scope.requestId);

											// $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
											// localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
											
											$rootScope.travelQuoteRequest = callback.data;
											//for olark
											olarkCustomParam(localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), true);

											if (String($rootScope.travelQuoteResult) != "undefined" && $rootScope.travelQuoteResult.length > 0) {
												$rootScope.travelQuoteResult.length = 0;
											}

											$rootScope.travelQuoteResult = [];
											$scope.travelQuoteResponse = [];
											angular.forEach($rootScope.travelQuoteRequest, function (obj, i) {
												var request = {};
												var header = {};

												header.messageId = messageIDVar;
												header.campaignID = campaignIDVar;
												header.source = sourceOrigin;
												header.transactionName = $scope.globalLabel.transactionName.travelQuoteResult;
												header.deviceId = deviceIdOrigin;
												request.header = header;
												request.body = obj;


												$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
													success(function (callback, status) {
														var travelQuoteResponse = JSON.parse(callback);
														$scope.travelQuoteResponse.push(callback);
														if (travelQuoteResponse.QUOTE_ID == $scope.requestId) {
															$scope.responseCodeList.push(travelQuoteResponse.responseCode);
															if (travelQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
																for (var i = 0; i < $rootScope.travelQuoteRequest.length; i++) {
																	if ($rootScope.travelQuoteRequest[i].messageId == travelQuoteResponse.messageId) {
																		$rootScope.loading = false;
																		$rootScope.travelQuoteResult.push(travelQuoteResponse.data.quotes[0]);
																		$rootScope.travelQuoteRequest[i].status = 1;
																	}
																}
																$scope.processResult();
																//$scope.redirectToResult();

															} else {
																for (var i = 0; i < $rootScope.travelQuoteRequest.length; i++) {
																	if ($rootScope.travelQuoteRequest[i].messageId == travelQuoteResponse.messageId) {
																		$rootScope.travelQuoteRequest[i].status = 2;
																		$rootScope.travelQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedTravelErrMsg);
																	}
																}
																//$scope.redirectToResult();
															}
														}
													}).error(function (data, status) {
														$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
													});
											});

											$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
												if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
													//$rootScope.loading = false;
													if ($scope.responseCodeList.length == $rootScope.travelQuoteRequest.length) {
														//$rootScope.loading = false;
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
											if (String($rootScope.travelQuoteResult) != "undefined" && $rootScope.travelQuoteResult.length > 0)
												$rootScope.travelQuoteResult.length = 0;

											$rootScope.travelQuoteResult = [];
											$scope.errorMessage(callback.message);
										}
									});
									/*}*/
								}, 100);
							};

							/*this function checks that wordpress is enabled or not
							 * if enabled then not calling singleClickTravelQuote on change of any UI fields
							 * else calling calling singleClickTravelQuote on change of any UI fields
							 * */
							$scope.callSingleClickQuote = function () {
								if (!$rootScope.wordPressEnabled) {
									$scope.singleClickTravelQuote();
								}
							}

							//fxn to check mandetory questions status
							$scope.checkQuestionStatus = function (quoteParam) {
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

							$scope.initPolicyDates = function () {
								//local virables
								var startDateOptions = {};
								var endDateOptions = {};
								var tripType = $scope.travelDetails.tripType;
								if (tripType == 'single') {
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


							// Pre-population of UI fields.
							$scope.prePopulateFields = function () {
								if (localStorageService.get("pedDetails")) {
									$scope.selectedDisease.diseaseList = localStorageService.get("pedDetails");
								}
								if (travelDetailsCookie) {
									$scope.initPolicyDates();
									$scope.travelDetails = travelDetailsCookie;

								} else {
									var today = new Date();
									var d = today.getDate();
									var m = today.getMonth() + 1;
									$scope.travelDetails.startdate = String(((d <= 9) ? '0' + d : d) + '/' + ((m <= 9) ? '0' + m : m) + '/' + today.getFullYear());
									var travelEndDate = new Date(Date.parse(((m <= 9) ? '0' + m : m) + '/' + ((d <= 9) ? '0' + d : d) + '/' + today.getFullYear()));
									travelEndDate.setDate(travelEndDate.getDate() + 2);
									d = travelEndDate.getDate();
									m = travelEndDate.getMonth() + 1;
									$scope.travelDetails.enddate = String(((d <= 9) ? '0' + d : d) + '/' + ((m <= 9) ? '0' + m : m) + '/' + travelEndDate.getFullYear());
									$scope.travelDetails.tripType = $scope.tripTypeList[0].tripType;
									$scope.initPolicyDates();
								}
								if (travelQuoteCookie) {
									$scope.quoteParam = travelQuoteCookie.quoteParam;
									$scope.ageList = [];
									for (var i = 0; i < $scope.quoteParam.travellers.length; i++) {
										$scope.ageList.push($scope.quoteParam.travellers[i].age);
									}
									$scope.numberOfTraveller = $scope.quoteParam.travellers.length;
									$scope.travellersList = $scope.quoteParam.travellers;
								} else {
									$scope.numberOfTraveller = $scope.quoteParam.travellers.length;
									$scope.travellersList = $scope.quoteParam.travellers;
								}


							}


							// Function created to fetch default input parameters for travel.
							$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {

								if (defaultQuoteStatus) {

									if (travelQuoteCookie.quoteParam) {
										$scope.quoteParam = travelQuoteCookie.quoteParam;
									}
									if (localStorageService.get("SumInsuredList")) {
										$scope.sumInsuredList = localStorageService.get("SumInsuredList");
									} else {
										$scope.fetchSumInsured();
									}

									if (localStorageService.get("diseaseList")) {
										$scope.diseaseList = localStorageService.get("diseaseList");
									}

									if (localStorageService.get("isDiseasedForTravel")) {
										$scope.isDiseased = localStorageService.get("isDiseasedForTravel");
									}

									if (travelDetailsCookie) {
										$scope.travelDetails = travelDetailsCookie;
									}
								} else {
									$scope.quoteParam = defaultTravelQuoteParam.quoteParam;
									$scope.travelDetails = defaultTravelQuoteParam.travelDetails;
									/*if($rootScope.wordPressEnabled){*/
									$scope.quote = {};
									$scope.quote.quoteParam = $scope.quoteParam;
									$scope.quote.travelDetails = $scope.travelDetails;
									localStorageService.set("selectedBusinessLineId", $scope.globalLabel.businessLineType.travel);
									localStorageService.set("travelQuoteInputParamaters", $scope.quote);
									localStorageService.set("travelDetails", $scope.travelDetails);
									//*}*/
									$scope.fetchSumInsured();
									$scope.isDiseased = false;
								}
								$scope.checkQuestionStatus($scope.quoteParam);
								$scope.prePopulateFields();
								$scope.callSingleClickQuote();
								//$scope.prePopulateFields();

							}

							if (travelQuoteCookie !== null && String(travelQuoteCookie) !== "undefined") {
								$scope.fetchDefaultInputParamaters(true, function () { });
								setTimeout(function () {
									if (!$rootScope.wordPressEnabled) {
										$scope.singleClickTravelQuote();
									}
								}, 100);
							} else {
								$scope.fetchDefaultInputParamaters(false, function () { });
							}

						}// ./travelInstantQuoteCalculation

						// for fetching the sum insured list
						$scope.fetchSumInsured = function () {
							var sumInsuredDocId = $scope.globalLabel.documentType.travelSumInsuredList;
							getDocUsingId(RestAPI, sumInsuredDocId, function (suminsuredList) {
								$scope.sumInsuredList = suminsuredList.SumInsured;
								localStorageService.set("SumInsuredList", $scope.sumInsuredList);
								$scope.fetchDiseaseListFormDB();
							});
						}

						// for preExisting Disease
						$scope.fetchDiseaseListFormDB = function () {
							getListFromDB(RestAPI, "", "Disease", $scope.globalLabel.request.findAppConfig, function (callback) {
								if (callback.responseCode == $scope.globalLabel.responseCode.success) {
									$scope.diseaseList = callback.data;
									localStorageService.set("diseaseList", $scope.diseaseList);
								}
							})
						}

						/*// Method to get list of Continent details from DB.
						$scope.getContinentList = function(countryName){
								return $http.get(getServiceLink+$scope.globalLabel.documentType.destinationDetails+"&q="+countryName).then(function(response){
								return JSON.parse(response.data).data;
							});
						};*/
						$scope.travelInstantQuoteCalculation();

					}//travel tab ends here
					else if (tab == 6) {
						var ciQuoteCookie = localStorageService.get("criticalIllnessQuoteInputParamaters");
						var personalDetailsCookie = localStorageService.get("criticalIllnessPersonalDetails");
						var premiumFrequencyListCookie = localStorageService.get("premiumFrequencyList");

						$scope.quote = {};
						$scope.quoteParam = {};
						$scope.personalDetails = {};

						$scope.relationType = relationLifeQuoteGeneric;
						$scope.healthConditionType = healthConditionGeneric;
						$scope.annualIncomesRange = annualIncomesGeneric;
						$scope.genderType = genderTypeGeneric;
						$scope.tobaccoAddictionStatus = tobaccoAddictionStatusGeneric;
						$scope.payoutOptions = lifePayoutOptionsGeneric;
						$scope.healthTypeCondition = healthTypeConditionGeneric;
						$scope.sumamount = 20;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteCriticalIllnessForm = true;
						$scope.healthError = false;

						$scope.criticalIllnessInstantQuoteCalculation = function () {


							// Function created to set annual premium amount range.	-	modification-0008
							$scope.updateAnnualPremiumRange = function (minPremiumValue, maxPremiumValue) {
								if (minPremiumValue > maxPremiumValue) {
									$rootScope.minAnnualPremium = maxPremiumValue;
									$rootScope.maxAnnualPremium = minPremiumValue;
								} else {
									$rootScope.minAnnualPremium = minPremiumValue;
									$rootScope.maxAnnualPremium = maxPremiumValue;
								}
							}

							$scope.errorMessage = function (errorMsg) {
								if ((String($rootScope.ciQuoteResult) == "undefined" || $rootScope.ciQuoteResult.length == 0)) {
									$scope.updateAnnualPremiumRange(1000, 5000);
									$rootScope.instantQuoteSummaryStatus = false;
									$rootScope.instantQuoteSummaryError = errorMsg;
									$rootScope.progressBarStatus = false;
									$rootScope.viewOptionDisabled = true;
									$rootScope.tabSelectionStatus = true;
									$scope.instantQuoteCriticalIllnessForm = false;
								} else if ($rootScope.ciQuoteResult.length > 0) {
									$rootScope.instantQuoteSummaryStatus = true;
									$rootScope.progressBarStatus = false;
									$rootScope.viewOptionDisabled = false;
									$rootScope.tabSelectionStatus = true;
									$scope.instantQuoteCriticalIllnessForm = false;
								}
								$rootScope.loading = false;
							}

							// Function created to set tool-tip content.	-	modification-0005
							$scope.tooltipPrepare = function (ciResult) {
								var resultCarrierId = [];
								var testCarrierId = [];
								for (var i = 0; i < ciResult.length; i++) {
									//push only net premium if greater than 0
									var carrierInfo = {};
									carrierInfo.id = ciResult[i].carrierId;
									carrierInfo.name = ciResult[i].insuranceCompany;
									carrierInfo.annualPremium = ciResult[i].annualPremium;
									//carrierInfo.annualPremium = ciResult[i].monthlyFinalPremium;
									carrierInfo.isMonthlyPremium = true;
									carrierInfo.claimsRating = ciResult[i].insurerIndex;
									if ($rootScope.wordPressEnabled) {
										carrierInfo.sumInsured = ciResult[i].sumInsured;
										carrierInfo.businessLineId = "6";
									}

									if (p365Includes(testCarrierId, ciResult[i].carrierId) == false) {
										resultCarrierId.push(carrierInfo);
										testCarrierId.push(ciResult[i].carrierId);
									}
								}
								$rootScope.resultCarrierId = resultCarrierId;
								$rootScope.quoteResultInsurerList = "\n<ul style='text-align: left;' class='tickpoints'>";
								for (var i = 0; i < resultCarrierId.length; i++) {
									$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
								}
								$rootScope.quoteResultInsurerList += "</ul>";
								$rootScope.calculatedQuotesLength = (String(ciResult.length)).length == 2 ? String(ciResult.length) : ("0" + String(ciResult.length));
								setTimeout(function () {
									scrollv = new scrollable({
										wrapperid: "scrollable-v",
										moveby: 4,
										mousedrag: true
									})
								}, 2000)
							}

							$scope.processResult = function () {
								//for wordPress
								$rootScope.enabledProgressLoader = false;

								$rootScope.progressBarStatus = false;
								$rootScope.viewOptionDisabled = false;
								$rootScope.tabSelectionStatus = true;
								$scope.instantQuoteCriticalIllnessForm = false;
								$rootScope.loading = false;
								//for campaign
								$rootScope.campaignFlag = true;
								$rootScope.ciQuoteResult = $filter('orderBy')($rootScope.ciQuoteResult, 'dailyPremium');
								var minDailyPremiumValue = $rootScope.ciQuoteResult[0].dailyPremium;
								var dailyPremiumSliderArray = [];

								for (var j = 0; j < $rootScope.ciQuoteResult.length; j++) {
									var calculatedDiscAmt = 0;
									var discountAmtList = $rootScope.ciQuoteResult[j].discountList;
									if (String(discountAmtList) != "undefined") {
										for (var i = 0; i < discountAmtList.length; i++) {
											calculatedDiscAmt += discountAmtList[i].discountAmount;
										}
										calculatedDiscAmt += $rootScope.ciQuoteResult[j].dailyPremium;
										dailyPremiumSliderArray.push(calculatedDiscAmt);
									} else {
										dailyPremiumSliderArray.push($rootScope.ciQuoteResult[j].dailyPremium);
									}
								}

								dailyPremiumSliderArray = $filter('orderBy')(dailyPremiumSliderArray);
								$scope.updateAnnualPremiumRange(minDailyPremiumValue, dailyPremiumSliderArray[dailyPremiumSliderArray.length - 1]);
								/*if(localStorageService.get("selectedBusinessLineId") == 6)
									$scope.tooltipPrepare($rootScope.ciQuoteResult);*/
								setTimeout(function () {
									$rootScope.loading = false;
									$location.path("/criticalIllnessResult");
								}, 100);
							}

							// Function created to get default input parameter from DB.	-	modification-0006
							$scope.singleClickCriticalIllnessQuote = function () {
								setTimeout(function () {
									$rootScope.instantQuoteSummaryStatus = true;
									$rootScope.progressBarStatus = true;
									$rootScope.viewOptionDisabled = true;
									$rootScope.tabSelectionStatus = false;
									$scope.instantQuoteCriticalIllnessForm = true;
									$rootScope.loading = true;
									localStorageService.set("selectedBusinessLineId", 6);
									$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
									$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
									$scope.quoteParam.personType = relationLifeQuoteGeneric[0];
									$scope.quoteParam.payoutId = $scope.payoutOptions[0].id;
									$scope.quoteParam.annualIncome = $scope.personalDetails.annualIncomeObject.annualIncome;
									$scope.quoteParam.annualIncomeInterval = $scope.personalDetails.annualIncomeObject.annualIncomeInterval;
									$scope.quoteParam.sumInsured = (Math.round(parseInt($scope.personalDetails.sumInsuredObject.amount) / 100000) * 100000);

									// Yogesh-12072017: Based on discussion with uday, Maturity age constant value changes from 70 to 50 and value of policy term at least have 5 year. 
									//maturity age difference as 40 - uday
									if ($scope.quoteParam.age > 35) {
										//$scope.personalDetails.maturityAge = maturityAgeConstant;
										var policyTerm = 20;
										// maturityAgeConstant - $scope.quoteParam.age
									} else {
										var policyTerm = 20;
									}
									//var policyTerm = maturityAgeConstant - $scope.quoteParam.age;
									if (policyTerm < $scope.personalDetails.minPolicyTermLimit) {
										$scope.quoteParam.policyTerm = $scope.personalDetails.minPolicyTermLimit;
									} else {
										$scope.quoteParam.policyTerm = policyTerm;
									}

									$scope.personalDetails.minMaturityAge = $scope.quoteParam.age + 5;
									$scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);

									$scope.quote.quoteParam = $scope.quoteParam;
									$scope.quote.personalDetails = $scope.personalDetails;
									$scope.quote.requestType = $scope.globalLabel.request.criticalIllnessRequestType;


									localStorageService.set("criticalIllnessQuoteInputParamaters", $scope.quote);
									localStorageService.set("criticalIllnessPersonalDetails", $scope.personalDetails);

									//analyticsTrackerSendData($scope.quote); //	-	modification-0004
									$scope.requestId = null;


									RestAPI.invoke($scope.globalLabel.getRequest.quoteCriticalIllness, $scope.quote).then(function (callback) {
										$rootScope.ciQuoteRequest = [];

										if (callback.responseCode == $scope.globalLabel.responseCode.success) {
											$scope.responseCodeList = [];

											$scope.requestId = callback.QUOTE_ID;

											localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID", $scope.requestId);

											// $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
											// localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
											

											$rootScope.ciQuoteRequest = callback.data;

											if (String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0) {
												$scope.quoteResult.length = 0;
											}

											if (String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0) {
												$rootScope.ciQuoteResult.length = 0;
											}


											$rootScope.ciQuoteResult = [];

											angular.forEach($rootScope.ciQuoteRequest, function (obj, i) {
												var request = {};
												var header = {};

												header.messageId = messageIDVar;
												header.campaignID = campaignIDVar;
												header.source = sourceOrigin;
												header.deviceId = deviceIdOrigin;
												header.browser = browser.name + " V - " + browser.version;
												header.transactionName = $scope.globalLabel.transactionName.criticalIllnessQuoteResult;
												request.header = header;
												request.body = obj;

												$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
													success(function (callback, status) {
														var ciQuoteResponse = JSON.parse(callback);
														if (ciQuoteResponse.QUOTE_ID == $scope.requestId) {
															$scope.responseCodeList.push(ciQuoteResponse.responseCode);

															if (ciQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
																for (var i = 0; i < $rootScope.ciQuoteRequest.length; i++) {
																	if ($rootScope.ciQuoteRequest[i].messageId == ciQuoteResponse.messageId) {
																		ciQuoteResponse.data.quotes[0].dailyPremium = Math.round(ciQuoteResponse.data.quotes[0].annualPremium / 365);
																		ciQuoteResponse.data.quotes[0].insuranceCompany = (ciQuoteResponse.data.quotes[0].insuranceCompany);
																		$rootScope.ciQuoteResult.push(ciQuoteResponse.data.quotes[0]);
																		$rootScope.ciQuoteRequest[i].status = 1;
																	}
																}
																$scope.processResult();
															}
														}
													}).
													error(function (data, status) {
														$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
													});
											});


											$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
												//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
												if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
													$rootScope.loading = false;

												if ($scope.responseCodeList.length == $rootScope.ciQuoteRequest.length) {
													$rootScope.loading = false;
													//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
													if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
														// This condition will satisfy only when at least one product is found in the quoteResponse array.
														//} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
													} else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
														$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
													} else {
														//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
														//comments updated based on Uday
														$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg));
													}
												}
											}, true);
										} else {
											$scope.responseCodeList = [];
											if (String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0)
												$scope.quoteResult.length = 0;

											if (String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0)
												$rootScope.ciQuoteResult.length = 0;

											$rootScope.ciQuoteResult = [];
											$scope.errorMessage(callback.message);
										}
									});
								}, 100);
							}




							// Function created to pre-populate input fields. 
							$scope.prePopulateFields = function () {
								for (var i = 0; i < annualIncomesGeneric.length; i++) {
									if ($scope.quoteParam.annualIncome == annualIncomesGeneric[i].annualIncome) {
										$scope.personalDetails.annualIncomeObject = annualIncomesGeneric[i];
										break;
									}
								}

								listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function (sumInsuredArray, selectedSumAssured) {
									$scope.quoteParam.sumInsured = selectedSumAssured.amount;
									$scope.personalDetails.sumInsuredObject = selectedSumAssured;
									// $scope.personalDetails.sumInsuredList = sumInsuredArray;
								});

								setTimeout(function () {
									var urlPattern = $location.path();
									if (!$rootScope.wordPressEnabled) {
										$scope.singleClickCriticalIllnessQuote();
									} else {
										$scope.instantQuoteCriticalIllnessForm = false;
									}
								}, 100);
							}


							// Function created to get default input parameter from DB.	-	modification-0007
							$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {
								if (defaultQuoteStatus) {
									$scope.quoteParam = defaultCriticalIllnessQuoteParam.quoteParam;
									$scope.personalDetails = defaultCriticalIllnessQuoteParam.personalDetails;
									$scope.PremiumFrequencyList = defaultCriticalIllnessQuoteParam.premiumFrequencyList;
									$scope.quote = {};
									$scope.quote.personalDetails = $scope.personalDetails;
									$scope.quote.quoteParam = $scope.quoteParam;
									localStorageService.set("selectedBusinessLineId", 6);
									localStorageService.set("criticalIllnessQuoteInputParamaters", $scope.quote);
									localStorageService.set("criticalIllnessPersonalDetails", $scope.personalDetails);
									localStorageService.set("premiumFrequencyList", $scope.PremiumFrequencyList);
								} else {
									$scope.quoteParam = ciQuoteCookie.quoteParam;
									$scope.personalDetails = personalDetailsCookie;
									$scope.PremiumFrequencyList = premiumFrequencyListCookie;
									$scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
									$scope.personalDetails.selectedAddOnCovers = makeObjectEmpty($scope.quoteParam.riders, "array");
								}

								$scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
								$scope.prePopulateFields();
								$rootScope.loading = false;
								defaultInputParamCallback();

							}


							// Below piece of code written to check whether ciQuoteCookie is present or not. 
							if (ciQuoteCookie != null && String(ciQuoteCookie) !== "undefined") {
								$scope.fetchDefaultInputParamaters(false, function () { });
								setTimeout(function () {
									if (!$rootScope.wordPressEnabled) {
										$scope.singleClickCriticalIllnessQuote();
									}
								}, 100);
							} else {
								$scope.fetchDefaultInputParamaters(true, function () { });
							}

						}// criticalIllnessInstantQuoteCalculation ends here

						if (!localStorageService.get("criticalIllnessInstantQuoteTooltipContent")) {
							// To get the life rider list applicable for this user.
							var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
							getDocUsingId(RestAPI, docId, function (tooltipContent) {
								localStorageService.set("criticalIllnessInstantQuoteTooltipContent", tooltipContent.toolTips);
								$rootScope.tooltipContent = tooltipContent.toolTips;
								$scope.criticalIllnessInstantQuoteCalculation();
							});
						} else {
							$rootScope.tooltipContent = localStorageService.get("criticalIllnessInstantQuoteTooltipContent");
							$scope.criticalIllnessInstantQuoteCalculation();
						}
					}//Critical Illness tab ends here
					else if (tab == 8) {
						var paQuoteCookie = localStorageService.get("personalAccidentQuoteInputParamaters");
						var personalDetailsCookie = localStorageService.get("personalAccidentPersonalDetails");

						$scope.quote = {};
						$scope.quoteParam = {};
						$scope.personalDetails = {};

						$scope.relationType = relationLifeQuoteGeneric;
						$scope.healthConditionType = healthConditionGeneric;
						$scope.genderType = genderTypeGeneric;

						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuotePersonalAccidentForm = true;

						$scope.personalAccidentInstantQuoteCalculation = function () {


							// Function created to set annual premium amount range.	-	modification-0008
							$scope.updateAnnualPremiumRange = function (minPremiumValue, maxPremiumValue) {
								if (minPremiumValue > maxPremiumValue) {
									$rootScope.minAnnualPremium = maxPremiumValue;
									$rootScope.maxAnnualPremium = minPremiumValue;
								} else {
									$rootScope.minAnnualPremium = minPremiumValue;
									$rootScope.maxAnnualPremium = maxPremiumValue;
								}
							}

							$scope.errorMessage = function (errorMsg) {
								if ((String($rootScope.paQuoteResult) == "undefined" || $rootScope.paQuoteResult.length == 0)) {
									$scope.updateAnnualPremiumRange(1000, 5000);
									$rootScope.instantQuoteSummaryStatus = false;
									$rootScope.instantQuoteSummaryError = errorMsg;
									$rootScope.progressBarStatus = false;
									$rootScope.viewOptionDisabled = true;
									$rootScope.tabSelectionStatus = true;
									$scope.instantQuotePersonalAccidentForm = false;
								} else if ($rootScope.paQuoteResult.length > 0) {
									$rootScope.instantQuoteSummaryStatus = true;
									$rootScope.progressBarStatus = false;
									$rootScope.viewOptionDisabled = false;
									$rootScope.tabSelectionStatus = true;
									$scope.instantQuotePersonalAccidentForm = false;
								}
								$rootScope.loading = false;
							}

							// Function created to set tool-tip content.	-	modification-0005
							$scope.tooltipPrepare = function (paResult) {

								var resultCarrierId = [];
								var testCarrierId = [];
								for (var i = 0; i < paResult.length; i++) {
									//push only net premium if greater than 0
									var carrierInfo = {};
									carrierInfo.id = paResult[i].carrierId;

									carrierInfo.name = paResult[i].insuranceCompany;
									carrierInfo.annualPremium = paResult[i].grossPremium;
									carrierInfo.claimsRating = paResult[i].insurerIndex;
									if ($rootScope.wordPressEnabled) {
										carrierInfo.sumInsured = paResult[i].sumInsured;
										carrierInfo.businessLineId = "8";
									}
									if (p365Includes(testCarrierId, paResult[i].carrierId) == false) {
										resultCarrierId.push(carrierInfo);
										testCarrierId.push(paResult[i].carrierId);
									}


								}

								$rootScope.resultCarrierId = resultCarrierId;

								$rootScope.quoteResultInsurerList = "\n<ul style='text-align: left;' class='tickpoints'>";
								for (var i = 0; i < resultCarrierId.length; i++) {
									$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";

								}
								$rootScope.quoteResultInsurerList += "</ul>";


								$rootScope.calculatedQuotesLength = (String(paResult.length)).length == 2 ? String(paResult.length) : ("0" + String(paResult.length));
								setTimeout(function () {

									scrollv = new scrollable({
										wrapperid: "scrollable-v",
										moveby: 4,
										mousedrag: true
									})


								}, 2000)
							}

							$scope.processResult = function () {
								//for wordPress
								$rootScope.enabledProgressLoader = false;

								$rootScope.progressBarStatus = false;
								$rootScope.viewOptionDisabled = false;
								$rootScope.tabSelectionStatus = true;
								$scope.instantQuotePersonalAccidentForm = false;
								$rootScope.loading = false;
								//for campaign
								$rootScope.campaignFlag = true;
								$rootScope.paQuoteResult = $filter('orderBy')($rootScope.paQuoteResult, 'grossPremium');

								var minAnnualPremiumValue = $rootScope.paQuoteResult[0].grossPremium;
								var annualPremiumSliderArray = [];

								for (var j = 0; j < $rootScope.paQuoteResult.length; j++) {
									var calculatedDiscAmt = 0;
									var discountAmtList = $rootScope.paQuoteResult[j].discountList;
									if (String(discountAmtList) != "undefined") {
										for (var i = 0; i < discountAmtList.length; i++) {
											calculatedDiscAmt += discountAmtList[i].discountAmount;
										}
										calculatedDiscAmt += $rootScope.paQuoteResult[j].grossPremium;
										annualPremiumSliderArray.push(calculatedDiscAmt);
									} else {
										annualPremiumSliderArray.push($rootScope.paQuoteResult[j].grossPremium);
									}
								}

								annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
								$scope.updateAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);
								//										if(localStorageService.get("selectedBusinessLineId") == 8)
								//											$scope.tooltipPrepare($rootScope.paQuoteResult);
								setTimeout(function () {
									$rootScope.loading = false;
									$location.path("/personalAccidentResult");
								}, 100);

							}


							// Function created to get default input parameter from DB.	-	modification-0006
							$scope.singleClickPersonalAccidentQuote = function () {
								setTimeout(function () {
									$rootScope.instantQuoteSummaryStatus = true;
									$rootScope.progressBarStatus = true;
									$rootScope.viewOptionDisabled = true;
									$rootScope.tabSelectionStatus = false;
									$scope.instantQuotePersonalAccidentForm = true;
									$rootScope.loading = true;
									localStorageService.set("selectedBusinessLineId", 8);
									$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
									$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
									$scope.quoteParam.personType = relationLifeQuoteGeneric[0];
									var today = new Date();
									var dd = today.getDate();
									var mm = today.getMonth() + 1;
									var yyyy = today.getFullYear();
									if (dd < 10) {
										dd = '0' + dd;
									} if (mm < 10) {
										mm = '0' + mm;
									}
									today = dd + '/' + mm + '/' + yyyy;
									$scope.quoteParam.policyStartDate = today;

									//$scope.quoteParam.occupation=$scope.personalDetails.occupation;
									$scope.quoteParam.annualIncome = Number($scope.quoteParam.annualIncome);
									$scope.quote.quoteParam = $scope.quoteParam;
									$scope.quote.personalDetails = $scope.personalDetails;

									$scope.quote.requestType = $scope.globalLabel.request.personalAccidentRequestType;


									localStorageService.set("personalAccidentQuoteInputParamaters", $scope.quote);
									localStorageService.set("personalAccidentPersonalDetails", $scope.personalDetails);

									//analyticsTrackerSendData($scope.quote); //	-	modification-0004
									$scope.requestId = null;

									var quoteUserInfo = localStorageService.get("quoteUserInfo");
									if (quoteUserInfo) {
										$scope.quote.mobileNumber = quoteUserInfo.mobileNumber;
									}

									RestAPI.invoke($scope.globalLabel.getRequest.quotePersonalAccident, $scope.quote).then(function (callback) {
										$rootScope.paQuoteRequest = [];
										if (callback.responseCode == $scope.globalLabel.responseCode.success) {
											$scope.responseCodeList = [];

											$scope.requestId = callback.QUOTE_ID;

											localStorageService.set("PERSONAL_ACCIDENT_UNIQUE_QUOTE_ID", $scope.requestId);

											
											// $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
											// localStorageService.set("PERSONAL_ACCIDENT_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
											
											$rootScope.paQuoteRequest = callback.data;
											if (String($scope.paQuoteResult) != "undefined" && $scope.paQuoteResult.length > 0) {
												$scope.paQuoteResult.length = 0;
											}



											$rootScope.paQuoteResult = [];

											angular.forEach($rootScope.paQuoteRequest, function (obj, i) {
												var request = {};
												var header = {};

												header.messageId = messageIDVar;
												header.campaignID = campaignIDVar;
												header.source = sourceOrigin;
												header.deviceId = deviceIdOrigin;
												header.browser = browser.name + " V - " + browser.version;
												header.transactionName = $scope.globalLabel.transactionName.personalAccidentQuoteResult;
												request.header = header;
												request.body = obj;

												$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
													success(function (callback, status) {
														var paQuoteResponse = JSON.parse(callback);
														if (paQuoteResponse.QUOTE_ID == $scope.requestId) {
															$scope.responseCodeList.push(paQuoteResponse.responseCode);

															if (paQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
																for (var i = 0; i < $rootScope.paQuoteRequest.length; i++) {
																	if ($rootScope.paQuoteRequest[i].messageId == paQuoteResponse.messageId) {
																		paQuoteResponse.data.quotes[0].insuranceCompany = (paQuoteResponse.data.quotes[0].insuranceCompany);

																		$rootScope.paQuoteResult.push(paQuoteResponse.data.quotes[0]);

																		$rootScope.paQuoteRequest[i].status = 1;
																	}
																}
																$scope.processResult();
															}
														}
													}).
													error(function (data, status) {
														$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
													});
											});


											$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
												//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
												if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
													$rootScope.loading = false;

												if ($scope.responseCodeList.length == $rootScope.paQuoteRequest.length) {
													$rootScope.loading = false;
													//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
													if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
														// This condition will satisfy only when at least one product is found in the quoteResponse array.
														//} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
													} else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
														$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
													} else {
														//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
														//comments updated based on Uday
														$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg));
													}
												}
											}, true);
										} else {
											$scope.responseCodeList = [];
											//													if(String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0)
											//														$scope.quoteResult.length = 0;

											if (String($rootScope.paQuoteResult) != "undefined" && $rootScope.paQuoteResult.length > 0)
												$rootScope.paQuoteResult.length = 0;

											$rootScope.paQuoteResult = [];
											$scope.errorMessage(callback.message);
										}
									});
								}, 100);
							}
							$scope.calcDefaultAreaDetails = function (areaCode) {
								$http.get(getServiceLink + "Pincode" + "&q=" + areaCode).then(function (response) {
									var areaDetails = JSON.parse(response.data);
									if (areaDetails.responseCode == $scope.globalLabel.responseCode.success) {
										$scope.onSelectPinOrArea(areaDetails.data[0]);
									}
								});
							};

							$scope.onSelectPinOrArea = function (item) {
								$scope.modalPIN = false;
								$scope.selectedArea = item.area;
								$scope.personalDetails.pincode = item.pincode;
								$scope.personalDetails.displayArea = item.area + ", " + item.district;
								$scope.personalDetails.city = item.district;
								$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalDetails.displayArea;
								$scope.personalDetails.state = item.state;

								localStorageService.set("commAddressDetails", item);
								setTimeout(function () {
									if (!$rootScope.wordPressEnabled)
										$scope.singleClickPersonalAccidentQuote();
								}, 100);
							};

							// Function created to get default input parameter from DB.	-	modification-0007
							$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {
								getDocUsingId(RestAPI, $scope.globalLabel.documentType.defaultPersonalAccidentQuoteParam, function (callback) {
									if (defaultQuoteStatus) {
										$scope.quoteParam = callback.quoteParam;
										$scope.personalDetails = callback.personalDetails;
										$scope.PremiumFrequencyList = callback.premiumFrequencyList;
										//for wordPress
										if ($rootScope.wordPressEnabled) {
											$scope.quote = {};
											$scope.quote.personalDetails = $scope.personalDetails;
											$scope.quote.quoteParam = $scope.quoteParam;
											localStorageService.set("selectedBusinessLineId", 8);
											localStorageService.set("personalAccidentQuoteInputParamaters", $scope.quote);
											localStorageService.set("personalAccidentPersonalDetails", $scope.personalDetails);

										}
									} else {
										$scope.quoteParam = paQuoteCookie.quoteParam;
										$scope.personalDetails = personalDetailsCookie;
									}

									$scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
									$scope.personalDetails.pincode = localStorageService.get("cityDataFromIP") ? (localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : $scope.personalDetails.pincode) : $scope.personalDetails.pincode;
									$scope.calcDefaultAreaDetails($scope.personalDetails.pincode);
									//											$scope.prePopulateFields();

									$rootScope.loading = false;
									defaultInputParamCallback();
								});
							}

							// Below piece of code written to check whether ciQuoteCookie is present or not. 
							if (paQuoteCookie != null && String(paQuoteCookie) !== "undefined") {

								$scope.quote = paQuoteCookie;
								$scope.quoteParam = paQuoteCookie.quoteParam;
								$scope.personalDetails = paQuoteCookie.personalDetails;

								if (!$rootScope.wordPressEnabled) {
									var item = localStorageService.get("commAddressDetails");
									$scope.modalPIN = false;
									$scope.selectedArea = item.area;

									$scope.personalDetails.pincode = item.pincode;
									$scope.personalDetails.displayArea = item.area + ", " + item.district;
									$scope.personalDetails.city = item.district;
									$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalDetails.displayArea;
								} else {
									$scope.displayPincodeInfo = $scope.personalDetails.pincode + " - " + $scope.personalDetails.displayArea;
								}
								$scope.fetchDefaultInputParamaters(false, function () { });

							} else {
								$scope.fetchDefaultInputParamaters(true, function () { });
							}

							//								 });
						}// PersonalAccidntInstantQuoteCalculation ends here


						if (!localStorageService.get("personalAccidentInstantQuoteTooltipContent")) {
							// To get the life rider list applicable for this user.
							var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
							getDocUsingId(RestAPI, docId, function (tooltipContent) {
								localStorageService.set("personalAccidentInstantQuoteTooltipContent", tooltipContent.toolTips);
								$rootScope.tooltipContent = tooltipContent.toolTips;
								$scope.personalAccidentInstantQuoteCalculation();
							});
						} else {
							$rootScope.tooltipContent = localStorageService.get("personalAccidentInstantQuoteTooltipContent");
							$scope.personalAccidentInstantQuoteCalculation();
						}
					}//Personal Accident tab ends here
				}); //getUsingDoc end here					

			});
			//$rootScope.isActiveTab2($scope.currentTab);
			//}); //};//onClickTabID end here

			$rootScope.onClickMainTab = function(tab){
				if(tab.name == 'iquote'){
					$location.path('/dcpResult');
				}else{
					$location.path('/proposalNotAvailable');
				}	
			}

			// Below piece of code will be executed when user changes business line from UI.
			$rootScope.onClickTab = function (tab) {

				if (tab.disabled)
					return;
					//$scope.currentTab=3;
				if ($scope.currentTab == tab.url) {
					console.log('current tab and selected tab is same....');
					return;
				}

				$rootScope.isFromProfessionalJourney = false;
				$scope.inputTitle = tab.inputTitle;
				$rootScope.minAnnualPremium = 1000;
				$rootScope.maxAnnualPremium = 5000;
				$rootScope.exclusiveDiscountsLength = "00";
				$rootScope.calculatedQuotesLength = "00";
				$rootScope.calculatedRidersLength = "00";
				//added to clear instant quote results
				$rootScope.resultCarrierId = [];
				localStorageService.set("selectedBusinessLineId", tab.businessLineId);
				$scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
				$rootScope.isActiveTab2 = $scope.selectedBusinessLineId;

				if (!$scope.isFromDCP) {
					$scope.getQuoteTemplateFunction();
				}

				if (tab.businessLineId == 1) {
					$scope.$broadcast("onClickTabID", 1);
					$rootScope.instantQuoteInvalidSummaryStatus = true;
					$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelLife;
				} else if (tab.businessLineId == 2) {
					$scope.$broadcast("onClickTabID", 2);
					$rootScope.instantQuoteInvalidSummaryStatus = true;
					$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelBike;
				} else if (tab.businessLineId == 3) {
					$scope.$broadcast("onClickTabID", 3);
					$rootScope.instantQuoteInvalidSummaryStatus = true;
					$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelCar;
				} else if (tab.businessLineId == 4) {
					$scope.$broadcast("onClickTabID", 4);
					$rootScope.instantQuoteInvalidSummaryStatus = true;
					$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelHealth;
				} else if (tab.businessLineId == 5) {
					$scope.$broadcast("onClickTabID", 5);
					$rootScope.instantQuoteInvalidSummaryStatus = true;
					$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelTravel;
				} else if (tab.businessLineId == 6) {
					$scope.$broadcast("onClickTabID", 6);
					$rootScope.instantQuoteInvalidSummaryStatus = true;
					$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelCriticalIllness;
				} else if (tab.businessLineId == 8) {
					$scope.$broadcast("onClickTabID", 8);
					$rootScope.instantQuoteInvalidSummaryStatus = true;
					$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelPersonalAccident;
				} else if (tab.businessLineId == 0) {
					//$scope.$broadcast("onClickTabID",0);
					//$rootScope.instantQuoteInvalidSummaryStatus=true;
					//$rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelPersonalAccident;
					if (localStorageService.get("PROF_QUOTE_ID")) {
						$location.path("/professionalJourneyResult");
						console.log("Planning to redirect to professional Result with  : ", localStorageService.get("PROF_QUOTE_ID"));
					} else {
						$location.path("/professionalJourney");
					}
				}
				if (tab.businessLineId != 0) {
					$scope.selectedBusinessLineId = tab.businessLineId;
					$scope.currentTab = tab.url;
				}
			};
			$scope.$on("invokeGetQuoteTemplate", function () {
				$scope.isFromDCP = true;
				$scope.getQuoteTemplateFunction();
			});
		// }

		
		// $scope.$on("invokeHeaderNavigationPHP", function () {
		// 	console.log("invokeHeaderNavigationPHP");
		// 	$scope.invokeHeaderNavigationPHP();
		// });
	}]);