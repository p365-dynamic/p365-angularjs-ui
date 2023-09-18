/*
 * Description	: This is the controller file for single click bike quote calculation.
 * Author		: Yogesh
 * Date			: 28 June 2016
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *  1		28-06-2016		Sort quote result based on specific property.										  modification-0001		Yogesh S.
 *	2		28-06-2016		Setting carrier logo list.															  modification-0002		Yogesh S.
 *	
 * */
'use strict';
angular.module('bikeInstantQuote', ['CoreComponentApp', 'LocalStorageModule'])
	.controller('bikeInstantQuoteController', ['$scope', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q', '$anchorScroll', function ($scope, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q, $anchorScroll) {
		$scope.p365Labels = insBikeQuoteLables;
		$rootScope.loaderContent = { businessLine: '2', header: 'Bike Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbInstantQuote) };
		$anchorScroll('home');
		if ($location.path() == '/bike') {
			$rootScope.title = $scope.p365Labels.policies365Title.bikeInstantQuoteLanding;
		} else {
			$rootScope.title = $scope.p365Labels.policies365Title.bikeInstantQuote;
		}
		$scope.focusInput = true;
		$rootScope.loading = true;
		$rootScope.instantQuoteSummaryStatus = true;
		$rootScope.disableLandingLeadBtn = false;
		$scope.resetDisplayVehicle = false;

		var registrationDetails = {};
		var bikeQuoteCookie;
		var vehicleDetailsCookie;
		var professionalBikeQuoteCookie;
		var professionalBikeParam = false;

		//added for prepopulating faster
		$scope.quoteParam = defaultBikeQuoteParam.quoteParam;
		$scope.vehicleDetails = defaultBikeQuoteParam.vehicleDetails;
		$scope.vehicleInfo = defaultBikeQuoteParam.vehicleInfo;
		$rootScope.vehicleInfo = defaultBikeQuoteParam.vehicleInfo;
		$scope.BikePACoverDetails = defaultBikeQuoteParam.PACoverDetails;
		//end

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

		$scope.instantQuoteCalculation = function (addOnCoverList) {
			//	Calculating default riders from DB.
			//addRidersToDefaultQuote renamed to addRidersToDefaultQuoteBike
			addRidersToDefaultQuoteBike(addOnCoverList, localStorageService.get("selectedBusinessLineId"), function (defaultRiderList, defaultRiderArrayObject) {
				$scope.quoteParam = {};
				$scope.vehicleInfo = {};
				$scope.vehicleDetails = {};
				$rootScope.vehicleInfo = {};
				$rootScope.vehicleDetails = {};

				$scope.bikeInsuranceTypes = [];
				$scope.yearList = [];
				$scope.defaultMetroList = [];
				var bikeRegistrationDetails = {};

				bikeQuoteCookie = localStorageService.get("bikeQuoteInputParamaters");
				vehicleDetailsCookie = localStorageService.get("selectedBikeDetails");
				$scope.defaultMetroList = localStorageService.get("defaultMetroCityList");

				$scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;
				$scope.policyStatusList = policyStatusListGeneric;
				$scope.ncbList = ncbListGeneric;
				$scope.previousClaimStatus = previousClaimStatusGeneric;

				$rootScope.regNumStatus = false;
				//$rootScope.viewOptionDisabled = true;
				//$rootScope.tabSelectionStatus = true;
				if ($rootScope.wordPressEnabled) {
					$scope.instantQuoteBikeForm = false;
					$rootScope.disableBikeRegPopup = false;
				} else {
					$scope.instantQuoteBikeForm = true;
					$rootScope.disableBikeRegPopup = true;
				}
				//default metro list fix
				if (!$scope.defaultMetroList) {
					$scope.defaultMetroList = commonResultLabels.popularRTOList.data;
					localStorageService.set("defaultMetroCityList", $scope.defaultMetroList);
				}
				//logic written only when the user comes from campaign
				$scope.callForLanding();

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
										localStorageService.set("bikeRegAddress", getCity);
									}
								} else {
									$scope.pincode = "";
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
								//localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
								$rootScope.vehicleInfo.registrationPlace = rtoDetail.rtoName;
							});

							//$rootScope.viewOptionDisabled = true;
							$scope.bikeInstantQuoteForm.$setDirty();
							// if ($scope.vehicleInfo.displayVehicle) {
							// 	$scope.selectedItem.displayVehicle = $scope.vehicleInfo.displayVehicle;
							// } else {
							// 	$scope.selectedItem = {};
							// }
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
							// var regNumber = registrationNumber.trim().slice(0, 2) + "-" + registrationNumber.trim().slice(2, 4);
							if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
								$scope.vehicleInfo.dateOfRegistration = makeObjectEmpty($scope.vehicleInfo.dateOfRegistration, "text");
							}

							$scope.selectedItem = {};

							registrationDetails.registrationNumber = registrationNumber;
							localStorageService.set("bikeRegistrationDetails", registrationDetails);

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
												$scope.vehicleDetails.regYear = selectedRegYear.trim();
												$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleDetails.regYear;
												//$scope.validateRegistrationDate();
											} else {
												$scope.vehicleDetails.regYear = "";
											}
										}
										// if (vehicleRTODetails.variantId) {
										// 	$scope.vehicleInfo.variantId = vehicleRTODetails.variantId.trim();
										// 	$scope.vehicleDetails.variantId = vehicleRTODetails.variantId.trim();
										// }

										if (vehicleRTODetails.vechileIdentificationNumber) {
											$scope.vehicleDetails.chassisNumber = vehicleRTODetails.vechileIdentificationNumber;
										}
										if (vehicleRTODetails.engineNumber) {
											$scope.vehicleDetails.engineNumber = vehicleRTODetails.engineNumber;
										}
										//$scope.selectedItem.displayVehicle= "";
										if(vehicleRTODetails.make && vehicleRTODetails.model && vehicleRTODetails.variant){
											$scope.vehicleInfo.make = vehicleRTODetails.make;
											$scope.vehicleInfo.model = vehicleRTODetails.model;
											$scope.vehicleInfo.variant = vehicleRTODetails.variant;
											// if (vehicleRTODetails.displayVehicle) {
											// 	$scope.selectedItem.displayVehicle = vehicleRTODetails.displayVehicle;
											// } else {
											// 	$scope.selectedItem.displayVehicle = vehicleRTODetails.make && vehicleRTODetails.model && vehicleRTODetails.variant;
											// }
										}else{
											$scope.vehicleInfo.make = "";
											$scope.vehicleInfo.model = "";
											$scope.vehicleInfo.variant = "";
										}
										
										$scope.fetchingBike = false;
										var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
										$scope.getRegPlaceListRTO(regNumber, registrationNumber);
									} else {
										$scope.fetchingBike = false;
										//$scope.selectedItem.displayVehicle = "";
										//$scope.vehicleInfo.displayVehicle = "";
										$scope.vehicleDetails.regYear = "";
										var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
										$scope.getRegPlaceListRTO(regNumber, registrationNumber);
									}
								}
								else {
									$scope.fetchingBike = false;
									//$scope.selectedItem.displayVehicle = "";
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

				// Function created to change policy status.
				$scope.changePolStatus = function () {
					if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
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
					$scope.vehicleInfo.TPPolicyExpiryDate = $scope.vehicleInfo.TPPolicyExpiryDate;
					$scope.vehicleInfo.TPPolicyStartDate = $scope.vehicleInfo.TPPolicyStartDate;
					$scope.vehicleInfo.ODPolicyExpiryDate = $scope.vehicleInfo.PreviousPolicyExpiryDate;
				};

				// Function created to change insurance type.
				$scope.alterRenewal = function () {
					if ($scope.vehicleDetails.insuranceType.type != $scope.bikeInsuranceTypes[1].type) {
						$scope.polStatus = false;
						$scope.renewal = false;
						$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
						$scope.vehicleDetails.regYear = $scope.yearList[0];
						// if ($scope.quoteParam.onlyODApplicable != undefined) {
						// 	if ($scope.quoteParam.onlyODApplicable == false || $scope.quoteParam.onlyODApplicable == true) {
						// 		delete $scope.quoteParam.onlyODApplicable;
						// 	}
						// }
					} else {
						$scope.polStatus = true;
						$scope.renewal = true;
						if (!$scope.quoteParam.onlyODApplicable) {
							//$scope.quoteParam.onlyODApplicable = false;
						}
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
						//$rootScope.viewOptionDisabled = true;
						//$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteBikeForm = false;
						$rootScope.disableBikeRegPopup = false;
						$rootScope.loading = false;
					} else if ($rootScope.bikeQuoteResult.length > 0) {
						$rootScope.instantQuoteSummaryStatus = true;
						//$rootScope.viewOptionDisabled = false;
						//$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteBikeForm = false;
						$rootScope.disableBikeRegPopup = false;
						$rootScope.loading = false;
					}
				};

				$scope.tooltipPrepare = function (bikeResult) {
					var riderCount = 0;
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
							if (bikeResult[i].policyType == "new" && bikeResult[i].comprehensive) {
								carrierInfo.id = bikeResult[i].carrierId;
								carrierInfo.name = bikeResult[i].insuranceCompany;
								carrierInfo.annualPremium = bikeResult[i].netPremium;
								carrierInfo.claimsRating = bikeResult[i].insurerIndex;
								if ($rootScope.wordPressEnabled) {
									carrierInfo.businessLineId = "2";
									carrierInfo.insuredDeclareValue = bikeResult[i].insuredDeclareValue;
								}
								if (p365Includes(testCarrierId, bikeResult[i].carrierId) == false) {
									resultCarrierId.push(carrierInfo);
									testCarrierId.push(bikeResult[i].carrierId);
								}
							}
							else if (bikeResult[i].policyType == "renew") {
								carrierInfo.id = bikeResult[i].carrierId;
								carrierInfo.name = bikeResult[i].insuranceCompany;
								carrierInfo.annualPremium = bikeResult[i].netPremium;
								carrierInfo.claimsRating = bikeResult[i].insurerIndex;
								if ($rootScope.wordPressEnabled) {
									carrierInfo.businessLineId = "2";
									carrierInfo.insuredDeclareValue = bikeResult[i].insuredDeclareValue;
								}
								if (p365Includes(testCarrierId, bikeResult[i].carrierId) == false) {
									resultCarrierId.push(carrierInfo);
									testCarrierId.push(bikeResult[i].carrierId);
								}
							}
						}
					}
					$rootScope.resultCarrierId = resultCarrierId;
					for (i = 0; i < resultCarrierId.length; i++) {
						$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
					}
					$rootScope.quoteResultInsurerList += "</ul>";

					$rootScope.calculatedQuotesLength = (String(bikeResult.length)).length == 2 ? String(bikeResult.length) : ("0" + String(bikeResult.length));
					$rootScope.calculatedRidersLength = (String(riderCount)).length == 2 ? String(riderCount) : ("0" + String(riderCount));
					setTimeout(function () {

						scrollv = new scrollable({
							wrapperid: "scrollable-v",
							moveby: 4,
							mousedrag: true
						});


					}, 2000);
				};


				$scope.ResponseChecker = function () {
					if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
						$rootScope.loading = false;
					if ($scope.responseCodeList.length == $rootScope.bikeQuoteRequest.length) {
						$rootScope.loading = false;
						if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success)) {
							// This condition will satisfy only when at least one product is found in the quoteResponse array.
						} else if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
							$scope.errorMessage($scope.p365Labels.validationMessages.productNotFoundMsg);
						} else {
							$scope.errorMessage($sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg));
						}
					}
				};

				$scope.processResult = function () {
					if ($rootScope.bikeQuoteResult.length > 0) {
						//for wordPress
						$rootScope.enabledProgressLoader = false;

						//$rootScope.viewOptionDisabled = false;
						//$rootScope.tabSelectionStatus = true;
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

						if (localStorageService.get("selectedBusinessLineId") == 2)
							$scope.tooltipPrepare($rootScope.bikeQuoteResult);
					}
				};

				// Instant quote calculation function.
				$scope.singleClickBikeQuote = function () {
					setTimeout(function () {
						if ($scope.bikeInstantQuoteForm.$valid) {
							$scope.quote = {};
							$rootScope.instantQuoteSummaryStatus = true;
							//$rootScope.viewOptionDisabled = true;
							//$rootScope.tabSelectionStatus = false;
							$scope.errorRespCounter = true;
							$scope.instantQuoteBikeForm = true;
							$rootScope.disableBikeRegPopup = true;
							$rootScope.loading = true;
							$rootScope.quoteResultCount = 0;

							if ($rootScope.selectedBikeRegistrationObject != null || String($rootScope.selectedBikeRegistrationObject) != "undefined") {
								$scope.vehicleInfo.registrationPlace = $rootScope.selectedBikeRegistrationObject.display;
								$rootScope.vehicleInfo.registrationPlace = $rootScope.selectedBikeRegistrationObject.display;
								$scope.vehicleInfo.city = $rootScope.selectedBikeRegistrationObject.city;
								$scope.vehicleInfo.RTOCode = $rootScope.selectedBikeRegistrationObject.regisCode;
								$scope.vehicleInfo.state = $rootScope.selectedBikeRegistrationObject.state;
							} else {
								var vehicleCityName = localStorageService.get("bikeRegAddress") != null ? localStorageService.get("bikeRegAddress").city : "MUMBAI";
								for (var i = 0; i < $scope.defaultMetroList.length; i++) {
									if ($scope.defaultMetroList[i].cityName.toUpperCase() == vehicleCityName.toUpperCase()) {
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

							$scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
							$scope.vehicleDetails.showBikeRegAreaStatus = $rootScope.showBikeRegAreaStatus;
							//$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0,2)+$scope.vehicleInfo.registrationPlace.substr(3,2).trim();
							
							if($scope.quoteParam.quoteType){
                                delete $scope.quoteParam.quoteType;
                            }
							if ($rootScope.showBikeRegAreaStatus) {
								$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0, 2).toUpperCase() + $scope.vehicleInfo.registrationPlace.substr(3, 2).toUpperCase();
							} else {
								$scope.vehicleInfo.RTOCode = $scope.vehicleDetails.registrationNumber.substr(0, 4).toUpperCase();
							}

							var todayDate = new Date();
							if ($scope.quoteParam.policyType == $scope.bikeInsuranceTypes[0].value) {
								$scope.vehicleInfo.dateOfRegistration = ("0" + todayDate.getDate().toString()).substr(-2) + "/" + ("0" + (Number(todayDate.getMonth()) + 1).toString()).substr(-2) + "/" + $scope.vehicleDetails.regYear;
								$scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
							} else {
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
										$scope.vehicleDetails.PreviousPolicyStartDate = $scope.vehicleInfo.dateOfRegistration;
									} else {
										convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
											$scope.vehicleDetails.PreviousPolicyStartDate = formattedPrevPolStartDate;
										});
									}
								});
							}
							localStorageService.set("selectedBusinessLineId", 2);
							$scope.vehicleDetails.manufacturingYear = $scope.vehicleDetails.regYear;
							//$scope.quoteParam.documentType = $scope.p365Labels.documentType.quoteRequest;
							//$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");

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
							//$scope.quoteParam.userIdv = 0;
							delete $scope.vehicleInfo.best_quote_id

							$scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
							$scope.quote.quoteParam = $scope.quoteParam;
							$scope.quote.vehicleInfo = $scope.vehicleInfo;
							localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
							localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);
							
							//assigning product based quote parameter to professional quote request
							if (localStorageService.get("professionalQuoteParams")) {
								if(localStorageService.get("professionalQuoteParams").bikeInfo){
								var professionalQuoteCookie = localStorageService.get("professionalQuoteParams");
								professionalQuoteCookie.bikeInfo.registrationYear = $scope.vehicleDetails.regYear;
								professionalQuoteCookie.bikeInfo.make = $scope.vehicleInfo.make;
								professionalQuoteCookie.bikeInfo.model = $scope.vehicleInfo.model;
								professionalQuoteCookie.bikeInfo.variant = $scope.vehicleInfo.variant;
								//professionalQuoteCookie.bikeInfo.variantId = $scope.vehicleDetails.variantId;
								localStorageService.set("professionalQuoteParams", professionalQuoteCookie);
								}else{
								$scope.profQuoteCookie = {};
								$scope.profQuoteCookie.bikeInfo = {};
								$scope.profQuoteCookie.bikeInfo.registrationYear = $scope.vehicleDetails.regYear;
								//$scope.profQuoteCookie.bikeInfo.variantId = $scope.vehicleDetails.variantId;
								$scope.profQuoteCookie.bikeInfo.make = $scope.vehicleInfo.make;
								$scope.profQuoteCookie.bikeInfo.model = $scope.vehicleInfo.model;
								$scope.profQuoteCookie.bikeInfo.variant = $scope.vehicleInfo.variant;
								localStorageService.set("professionalQuoteParams", $scope.profQuoteCookie);
								}
							} else {
								$scope.profQuoteCookie = {};
								$scope.profQuoteCookie.bikeInfo = {};
								$scope.profQuoteCookie.bikeInfo.registrationYear = $scope.vehicleDetails.regYear;
								//$scope.profQuoteCookie.bikeInfo.variantId = $scope.vehicleDetails.variantId;
								$scope.profQuoteCookie.bikeInfo.make = $scope.vehicleInfo.make;
								$scope.profQuoteCookie.bikeInfo.model = $scope.vehicleInfo.model;
								$scope.profQuoteCookie.bikeInfo.variant = $scope.vehicleInfo.variant;
								localStorageService.set("professionalQuoteParams", $scope.profQuoteCookie);
							}

							//added to reset idv on cancel of your idv pop-up
							$rootScope.idvOptionCopy = angular.copy($scope.vehicleInfo.idvOption);
							// Google Analytics Tracker added.
							//analyticsTrackerSendData($scope.quote);
							$scope.requestId = null;
							var quoteUserInfo = localStorageService.get("quoteUserInfo");
							// if (quoteUserInfo) {
							// 	$scope.quote.mobileNumber = quoteUserInfo.mobileNumber;
							// }
							if (localStorageService.get("PROF_QUOTE_ID")) {
								//$scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
							}
							$rootScope.bikeQuoteResult = [];
							$scope.bikeQuoteRequestFormation($scope.quote);
							// Service call for quote calculation.
							RestAPI.invoke($scope.p365Labels.getRequest.quoteBike, $scope.quoteRequest).then(function (callback) {
								$rootScope.bikeQuoteRequest = [];

								if (callback.responseCode == $scope.p365Labels.responseCode.success1) {
									$scope.responseCodeList = [];

									$scope.requestId = callback.QUOTE_ID;

									$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;

									localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.requestId);
									localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
									localStorageService.set("bike_best_quote_id", $scope.requestId);
									$rootScope.bikeQuoteRequest = callback.data;

									if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0) {
										$rootScope.bikeQuoteResult.length = 0;
									}
									//for olark
									// olarkCustomParam(localStorageService.get("BIKE_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), true);
									angular.forEach($rootScope.bikeQuoteRequest, function (obj, i) {
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
												$rootScope.quoteResultCount += 1;
												if (bikeQuoteResponse.QUOTE_ID == $scope.requestId) {
													$scope.responseCodeList.push(bikeQuoteResponse.responseCode);

													if (bikeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
														for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
															if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
																$rootScope.bikeQuoteResult.push(bikeQuoteResponse.data.quotes[0]);
																$rootScope.bikeQuoteRequest[i].status = 1;
															}
														}
														$scope.processResult();
													} else {
														for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
															if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
																$rootScope.bikeQuoteRequest[i].status = 2;
																$rootScope.bikeQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
															}
														}
													}
													$scope.ResponseChecker();
												}
											}).
											error(function (data, status) {
												$scope.responseCodeList.push($scope.p365Labels.responseCode.systemError);

											});
									});

									$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
										if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
											$rootScope.loading = false;
										if ($scope.responseCodeList.length == $rootScope.bikeQuoteRequest.length) {
											$rootScope.loading = false;
											if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success)) {
											} else if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
												$scope.errorMessage($scope.p365Labels.validationMessages.productNotFoundMsg);
											} else {
												$scope.errorMessage($sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg));
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
						}
					}, 100);
				};

				$scope.changeRegYear = function () {
					var urlPattern = $location.path();
					if (!$rootScope.wordPressEnabled || urlPattern == "/bike" || urlPattern == "/bikermz" || urlPattern == "/bikeeid" || urlPattern == "/mobibike" || urlPattern == "/bikemonsoon" || urlPattern == "/bikeindependence" || urlPattern == "/bike-insurance") {
						$scope.singleClickBikeQuote();
					}
				}
				$scope.prePopulateFields = function () {
					if (!localStorageService.get("selectedBikeDetails")) {
						for (var i = 0; i < $scope.policyStatusList.length; i++) {
							if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
								$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
								break;
							}
						}
					} else {
						if (localStorageService.get("selectedBikeDetails").policyStatus) {
							var getPolicyStatus = localStorageService.get("selectedBikeDetails").policyStatus;
							for (var i = 0; i < $scope.policyStatusList.length; i++) {
								if (getPolicyStatus.key == $scope.policyStatusList[i].key) {
									$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
									break;
								}
							}
						} else {
							for (var i = 0; i < $scope.policyStatusList.length; i++) {
								if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
									$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
									break;
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

					var bikeRegistrationDetails = localStorageService.get("bikeRegistrationDetails");
					if (bikeRegistrationDetails) {
						if (String(bikeRegistrationDetails.registrationNumber) != "undefined" && bikeRegistrationDetails.registrationNumber != null) {
							$rootScope.vehicleDetails.registrationNumber = bikeRegistrationDetails.registrationNumber;
						}
					}

				};

				// Function created to fetch default input parameters for bike.
				$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {
					$scope.renewal = false;
					$scope.polStatus = false;

					if (defaultQuoteStatus) {
						$scope.quoteParam = defaultBikeQuoteParam.quoteParam;
						$scope.vehicleDetails = defaultBikeQuoteParam.vehicleDetails;
						$scope.vehicleInfo = defaultBikeQuoteParam.vehicleInfo;
						$rootScope.vehicleInfo = defaultBikeQuoteParam.vehicleInfo;
						
						if (wordPressEnabled) {
							$rootScope.disableBikeRegPopup = false;
							$scope.quote = {};
							
							for (var i = 0; i < $scope.policyStatusList.length; i++) {
								if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
									$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
									break;
								}
							}
							
							if (professionalBikeParam) {
								$scope.vehicleDetails.regYear = professionalBikeQuoteCookie.registrationYear;
								//$scope.vehicleDetails.registrationPlace = professionalBikeQuoteCookie.registrationPlace;
								$scope.vehicleInfo.make = professionalBikeQuoteCookie.make;
								$scope.vehicleInfo.model = professionalBikeQuoteCookie.model;
								$scope.vehicleInfo.variant = professionalBikeQuoteCookie.variant;
								//bikeQuoteCookie.vehicleInfo.variantId = localStorageService.get("professionalQuoteParams").bikeInfo.variantId;
							}
							$scope.quote.vehicleInfo = $scope.vehicleInfo;
							$scope.quote.quoteParam = $scope.quoteParam;
							localStorageService.set("selectedBusinessLineId", 2);
							//localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
							localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);
						}
						//localStorageService.set("BikePACoverDetails", $scope.BikePACoverDetails);
					} else {
						// if ($rootScope.wordPressEnabled) {
						// 	$rootScope.disableBikeRegPopup = false;
						// }
						console.log('in else part of fetch default input parameters');
						if (bikeQuoteCookie.quoteParam) {
							$scope.quoteParam = bikeQuoteCookie.quoteParam;
						}
					
						$scope.vehicleDetails = vehicleDetailsCookie;
						//$scope.selectedItem = { 'displayVehicle': $scope.vehicleDetails.displayVehicle};

						$scope.vehicleInfo = bikeQuoteCookie.vehicleInfo;

						$scope.quoteParam.riders = [];

						if (vehicleDetailsCookie) {
							$rootScope.showBikeRegAreaStatus = vehicleDetailsCookie.showBikeRegAreaStatus;
						}
						$rootScope.vehicleDetails.registrationNumber = bikeRegistrationDetails.registrationNumber;
					}
						if (localStorageService.get("selectedBikeDetails")) {
							$scope.vehicleDetails = localStorageService.get("selectedBikeDetails");
						 }

						if(professionalBikeParam){
						$scope.vehicleDetails.regYear = professionalBikeQuoteCookie.registrationYear;
						//$scope.vehicleDetails.registrationPlace = professionalBikeQuoteCookie.registrationPlace;
						if(professionalBikeQuoteCookie.registrationPlace){
						$rootScope.vehicleInfo.registrationPlace = professionalBikeQuoteCookie.registrationPlace;
						$scope.vehicleInfo.registrationPlace = professionalBikeQuoteCookie.registrationPlace;
						}
						$scope.vehicleInfo.make = professionalBikeQuoteCookie.make;
						$scope.vehicleInfo.model = professionalBikeQuoteCookie.model;
						$scope.vehicleInfo.variant = professionalBikeQuoteCookie.variant;
						//$scope.selectedItem = { 'displayVehicle': $scope.vehicleDetails.displayVehicle}
					}
					$scope.prePopulateFields();
					defaultInputParamCallback();

				};

				// Checking whether cookie is present or not.
				if (bikeQuoteCookie) {
					$scope.fetchDefaultInputParamaters(false, function () { });
				} else {
					$scope.fetchDefaultInputParamaters(true, function () { });
				}

				// Below piece of code written to access function from outside controller.
				$scope.$on("callSingleClickBikeQuote", function () {
					$scope.singleClickBikeQuote();
				});
			});
		};


		$scope.callForLanding = function () {
			//logic written only when the user comes from campaign
			//if ($location.path() == '/bike' || $rootScope.wordPressEnabled) {
				var selectedMake  = "";
				var selectedModel = "";
				$rootScope.Regpopup = false;
				$scope.bikeDisplayNames = localStorageService.get("bikeMakeListDisplay");
				if(localStorageService.get("selectedBikeDetails")){
					$scope.vehicleDetails = localStorageService.get("selectedBikeDetails");
				}else{
                    $scope.vehicleDetails = defaultBikeQuoteParam.vehicleDetails;
				}

				if(localStorageService.get("professionalQuoteParams")){
					if(localStorageService.get("professionalQuoteParams").bikeInfo)
					professionalBikeParam = true;
					professionalBikeQuoteCookie = localStorageService.get("professionalQuoteParams").bikeInfo;					 
				}

				if (bikeQuoteCookie) {
					if(professionalBikeParam){
                        $scope.vehicleInfo.make = professionalBikeQuoteCookie.make;
						$scope.vehicleInfo.model = professionalBikeQuoteCookie.model;
						$scope.vehicleInfo.variant = professionalBikeQuoteCookie.variant;
					  }else{
						$scope.vehicleInfo.make = bikeQuoteCookie.vehicleInfo.make;
					    $scope.vehicleInfo.model = bikeQuoteCookie.vehicleInfo.model;
					    $scope.vehicleInfo.variant = bikeQuoteCookie.vehicleInfo.variant;
					  }
					    selectedMake=$scope.vehicleInfo.make;
                        selectedModel=$scope.vehicleInfo.model;
						$scope.bikeModelList = [];
						console.log('$scope.bikeDisplayNames are: ',$scope.bikeDisplayNames);
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
					
					setTimeout(function () {
						if(professionalBikeParam){
							$scope.vehicleInfo.make = professionalBikeQuoteCookie.make;
							$scope.vehicleInfo.model = professionalBikeQuoteCookie.model;
							$scope.vehicleInfo.variant = professionalBikeQuoteCookie.variant;
						  }else{
							$scope.vehicleInfo.make = bikeQuoteCookie.vehicleInfo.make;
							$scope.vehicleInfo.model = bikeQuoteCookie.vehicleInfo.model;
							$scope.vehicleInfo.variant = bikeQuoteCookie.vehicleInfo.variant;
						  }
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
					}, 100);
				} 
				else {
					setTimeout(function () {
						$scope.vehicleInfo.make = "Hero MotoCorp";
						$scope.vehicleInfo.model = "Duet";
						$scope.vehicleInfo.variant = "VX";
						console.log('$scope.vehicleInfo in else part of callForLanidng function :',$scope.vehicleInfo);
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
			}
			
                $scope.selectedDisplayVehicle = function (selectedMake1) {
					if (selectedMake1) {                     
                        $scope.bikeModelList = [];
                        angular.forEach($scope.bikeDisplayNames, function (value) {
							if (value.make == $scope.vehicleInfo.make) {
									$scope.bikeModelList.push(value.model);
                                }
                        });
						
						console.log('$scope.bikeModelList is: ',$scope.bikeModelList);
						if($scope.resetDisplayVehicle){
                          $scope.vehicleInfo.model = "";
						  $scope.vehicleInfo.variant = "";
						}
                    }
                };
                $scope.selectedDisplayModel = function(selectedModel1){
                    if (selectedModel1) {
						$scope.bikeVariantList = [];
						if($scope.resetDisplayVehicle){
							$scope.vehicleInfo.variant ="";
						}
                        angular.forEach($scope.bikeDisplayNames, function (value) {
							if($scope.bikeVariantList.indexOf(value.variant)== -1){
                                if ((value.make == $scope.vehicleInfo.make) && (value.model == $scope.vehicleInfo.model)){
                                    $scope.bikeVariantList.push(value.variant);
                                    }
                                }
                        });
                        console.log('$scope.bikeVariantList is: ',$scope.bikeVariantList);                       
                    }
                };
                $scope.selectedDisplayVariant = function(selectedVariant1){
					if(selectedVariant1){
					 $scope.resetDisplayVehicle = true; 
					}
					 console.log('$scope.resetDisplayVehicle in selectedDisplayVariant function step 1 is :',$scope.resetDisplayVehicle);                                 
				};
		
				$rootScope.openRegPopup = function () {
					//logic written for new bike

					$scope.vehicleDetails.insuranceType = { "type": "Insure New Bike", "value": "new" };
					$scope.alterRenewal();
					$rootScope.Regpopup = true;
				}
				$scope.closePop = function () {
					if ($scope.disabledRedirectToResult)
						$scope.disabledRedirectToResult = false;
					$rootScope.Regpopup = false;
				}
			//}
		

		if (!localStorageService.get("ridersBikeStatus")) {
			// To get the bike rider list applicable for this user.
			getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.bike, $scope.p365Labels.request.findAppConfig, function (addOnCoverList) {
				localStorageService.set("addOnCoverListForBike", addOnCoverList);
				localStorageService.set("ridersBikeStatus", true);
				getListFromDB(RestAPI, "", "BikeVariants", $scope.p365Labels.request.findAppConfig, function (callbackCar5) {

					if (callbackCar5.responseCode == $scope.p365Labels.responseCode.success) {
						localStorageService.set("bikeMakeListDisplay", callbackCar5.data);
						$scope.instantQuoteCalculation(addOnCoverList);
					}
				});
			});
		} else {
			$scope.instantQuoteCalculation(localStorageService.get("addOnCoverListForBike"));
		}
		$scope.backToProfessionalJourney = function () {
			$location.path("/professionalJourney");
		}
	}]);