/*
 * Description	: This controller file for instant car quote calculation.
 * Author		: Yogesh Shisode
 * Date			: 14 June 2016
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */

'use strict';
angular.module('carInstantQuote', ['CoreComponentApp', 'LocalStorageModule'])
	.controller('carInstantQuoteController', ['$scope', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q', '$anchorScroll', function ($scope, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q, $anchorScroll) {

		$scope.p365Labels = insCarQuoteLabels;
		if ($location.path() == '/car') {
			$rootScope.title = $scope.p365Labels.policies365Title.carInstantQuoteLanding;
		} else {
			$rootScope.title = $scope.p365Labels.policies365Title.carInstantQuote;
		}
		$anchorScroll('home');
		$scope.focusInput = true;
		$rootScope.loading = true;
		$rootScope.instantQuoteSummaryStatus = true;
		$rootScope.instantQuoteInvalidSummaryStatus = true;
		$rootScope.disableLandingLeadBtn = false;
		$scope.resetDisplayVehicle = false;

		// //added for prepopulating faster
		// $scope.quoteParam = defaultCarQuoteParam.quoteParam;
		// $scope.vehicleDetails = defaultCarQuoteParam.vehicleDetails;
		// $scope.vehicleInfo = defaultCarQuoteParam.vehicleInfo;
		// $rootScope.vehicleInfo = defaultCarQuoteParam.vehicleInfo;
		//$scope.vehicleInfo.previousPolicyZeroDepStatus = defaultCarQuoteParam.vehicleInfo.previousPolicyZeroDepStatus;
		//$scope.CarPACoverDetails = defaultCarQuoteParam.PACoverDetails;
		
		
		
		$scope.carQuoteRequestFormation = function (carQuoteRequestParam) {
            $scope.quoteRequest = {};
            $scope.quoteRequest.vehicleInfo={};
            $scope.quoteRequest.quoteParam={};
 
            $scope.quoteRequest.vehicleInfo.IDV = carQuoteRequestParam.vehicleInfo.IDV;
            $scope.quoteRequest.vehicleInfo.PreviousPolicyExpiryDate = carQuoteRequestParam.vehicleInfo.PreviousPolicyExpiryDate;
            $scope.quoteRequest.vehicleInfo.TPPolicyExpiryDate = carQuoteRequestParam.vehicleInfo.TPPolicyExpiryDate;
            $scope.quoteRequest.vehicleInfo.TPPolicyStartDate = carQuoteRequestParam.vehicleInfo.TPPolicyStartDate;
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
				//$scope.vehicleInfo.fuel = carQuoteCookie.vehicleInfo.fuel;
				$scope.vehicleInfo.fuel = "PETROL";
				 $scope.selectedVariantDetails = {
				 	"selectedItem" : ""
				 };
				$scope.selectedVariantDetails.selectedItem = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
				//$scope.selectedVariant = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
				$scope.carModelList = [];
				console.log('carQuoteCookie in callForLanding  is :',carQuoteCookie);
					angular.forEach($scope.carDisplayNames, function (value) {
						if (value.make.includes($scope.vehicleInfo.make)) {
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
				$scope.vehicleInfo.fuel = carQuoteCookie.vehicleInfo.fuel;
				//$scope.selectedVariant = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
				$scope.selectedVariantDetails = {
					"selectedItem" : ""
				}
				$scope.selectedVariantDetails.selectedItem = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";		

				$scope.carModelList = [];
				console.log('$scope.selectedVariantDetails in settimeout  is :',$scope.selectedVariantDetails);
					angular.forEach($scope.carDisplayNames, function (value) {
						
							if (value.make.includes($scope.vehicleInfo.make)) {
								$scope.carModelList.push(value.model);
							}
					});
					$scope.carVariantList = [];
					angular.forEach($scope.carDisplayNames, function (value) {
						if ((value.make.includes($scope.vehicleInfo.make)) && (value.model.includes($scope.vehicleInfo.model))) {
								var variantDetails = value.variant+"-"+value.cubicCapacity;
								$scope.carVariantList.push(variantDetails);								 					
							}
					});
			}, 100);
		}
		 else {
				setTimeout(function () {
					//$scope.vehicleInfo = {};
					$scope.vehicleInfo.IDV = 0,
					$scope.vehicleInfo.RTOCode = "MH01",
					$scope.vehicleInfo.previousClaim ="false",
					$scope.vehicleInfo.registrationPlace= "MH-01 Mumbai Tardeo",
					$scope.vehicleInfo.make = "Maruti Suzuki";
					$scope.vehicleInfo.model = "Alto 800";
					$scope.vehicleInfo.variant = "LX";
					$scope.vehicleInfo.fuel = "PETROL";
					$scope.vehicleInfo.cubicCapacity = "796";
					$scope.vehicleInfo.idvOption = 1,
					//$scope.vehicleInfo = defaultCarQuoteParam.vehicleInfo;

					// $scope.quote = {};
					// $scope.quote.quoteParam = defaultCarQuoteParam.quoteParam;
					// $scope.quote.vehicleInfo = $scope.vehicleInfo;
					// localStorageService.set("carQuoteInputParamaters", $scope.quote);

				$scope.selectedVariantDetails = {
					"selectedItem" : ""
				};
				$scope.selectedVariantDetails.selectedItem = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
				
				//$scope.selectedVariant = $scope.vehicleInfo.variant+""+""+"-"+$scope.vehicleInfo.cubicCapacity+"cc";
			  $scope.carModelList = [];
			  console.log('$scope.vehicleInfo in else part is :',$scope.vehicleInfo);
				  angular.forEach($scope.carDisplayNames, function (value) {
					  
						  if (value.make.includes($scope.vehicleInfo.make)) {
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

	//}
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
						console.log('**$scope.resetDisplayVehicle in selectedDisplayVehicle is ** : ',$scope.resetDisplayVehicle);
						if($scope.resetDisplayVehicle){
							$scope.vehicleInfo.model ="";
							$scope.selectedVariantDetails = {
								"selectedItem" : ""
							};
						}
						
                        angular.forEach($scope.carDisplayNames, function (value) {
							if($scope.carModelList.indexOf(value.model)== -1){	
							if (value.make.includes(selectedMake1)) {
                                    $scope.carModelList.push(value.model);
								}
							}
                        });                        
						console.log('$scope.carModelList is: ',$scope.carModelList);
                    }
				};
				
                $scope.selectedDisplayModel = function(selectedModel1){
                    if (selectedModel1) {
						$scope.carVariantList = [];
						$scope.filteredCarVariantLst = [];
						if($scope.resetDisplayVehicle){
							$scope.selectedVariantDetails = {
								"selectedItem" : ""
							};
						}
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
						console.log(' $scope.resetDisplayVehicle  in  $scope.selectedVariantDetails is:',$scope.resetDisplayVehicle);
					}			                                  
                };
			

		$scope.instantQuoteCalculation = function (addOnCoverForCar) {
			$scope.quoteParam = {};
			$scope.vehicleInfo = {};
			$scope.vehicleDetails = {};
			$rootScope.vehicleInfo = {};
			$rootScope.vehicleDetails = {};

			$scope.toggleCounter = 0;

			$scope.carInsuranceTypes = [];
			$scope.yearList = [];
			$scope.defaultMetroList = [];
			var carRegistrationDetails = {};
			var carQuoteCookie = localStorageService.get("carQuoteInputParamaters");
			var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");

			var registrationDetails = {};
			var professionalCarQuoteCookie = {};
			var professionalCarParams = false;

			$scope.defaultMetroList = localStorageService.get("defaultMetroCityList");
			$scope.carInsuranceTypes = carInsuranceTypeGeneric;
			$scope.policyStatusList = policyStatusListGeneric;
			$scope.ncbList = ncbListGeneric;
			$scope.previousClaimStatus = previousClaimStatusGeneric;
			$scope.fuelList = ["PETROL","DIESEL" , "LPG/CNG"];

			$rootScope.regNumStatus = false;
			//$rootScope.viewOptionDisabled = true;
			//$rootScope.tabSelectionStatus = true;
			$rootScope.disableCarRegPopup = true;
			if ($rootScope.wordPressEnabled) {
				$scope.instantQuoteCarForm = false;
			} else {
				$scope.instantQuoteCarForm = true;
			}
			if ($scope.carInstantQuoteForm.$valid) {
				$rootScope.instantQuoteInvalidSummaryStatus = true;
			}else {
				$rootScope.instantQuoteInvalidSummaryStatus = false;
			}

			//default metro list fix
			if(!$scope.defaultMetroList){
				$scope.defaultMetroList = commonResultLabels.popularRTOList.data;
				localStorageService.set("defaultMetroCityList",$scope.defaultMetroList);
			}

			if(localStorageService.get("professionalQuoteParams")){
				if(localStorageService.get("professionalQuoteParams").carInfo)
				professionalCarQuoteCookie = localStorageService.get("professionalQuoteParams").carInfo;
				professionalCarParams = true;					 
			}
			$scope.callForLanding();

				$rootScope.openRegPopup = function () {
					$scope.vehicleDetails.insuranceType = { type: "Insure New Car", value: "new" };
					$scope.alterRenewal();
					$rootScope.Regpopup = true;
				}
				$scope.closePop = function () {
					if ($scope.disabledRedirectToResult)
						$scope.disabledRedirectToResult = false;
					$rootScope.Regpopup = false;
				}
			
			$scope.setRangesPrevPolicyExpiryDate = function () {
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
			}

			$scope.validatePrevPolicyStartDate = function () {
				if (String($scope.vehicleDetails.PreviousPolicyStartDate) !== "undefined" && String($scope.vehicleDetails.PreviousPolicyExpiryDate) !== "undefined") {
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

			// Method call to get default list form central DB.
			$scope.getRegPlaceListRTO = function (regNumber, registrationNumber) {
				if (regNumber.indexOf('-') > 0)
					regNumber = regNumber.replace('-', '');
				return $http.get(getServiceLink + $scope.p365Labels.documentType.RTODetails + "&q=" + regNumber).then(function (callback) {
					callback = JSON.parse(callback.data);
					if (callback.responseCode == $scope.p365Labels.responseCode.success) {
						$rootScope.selectedCarRegistrationObject = callback.data[0];
						$rootScope.vehicleDetails.registrationNumber = registrationNumber.trim();
						$scope.vehicleInfo.registrationNumber = $rootScope.vehicleDetails.registrationNumber.toUpperCase();

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
									localStorageService.set("carRegAddress", getCity);
								}
							} else {
								$scope.pincode = "";
								rtoDetail.pincode = "";
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
							localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
							$scope.vehicleInfo.registrationPlace = rtoDetail.rtoName;
						});
						$scope.carInstantQuoteForm.$setDirty();
					} else {
						$rootScope.regNumStatus = true;
					}
				});
			};

			// Fetch RTO details using entered registration number.
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
					$scope.isCarFound = true;
					if ((registrationNumber.trim()).match(/^[a-zA-Z]{2}[0-9]{1,2}[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 11 && (registrationNumber.trim()).length > 4) {
						$rootScope.regNumStatus = false;
						//$rootScope.viewOptionDisabled = true;
						$scope.fetchingCar = true;
						if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
							$scope.vehicleInfo.dateOfRegistration = makeObjectEmpty($scope.vehicleInfo.dateOfRegistration, "text");
						}

						//$scope.selectedItem = {};
						$scope.selectedVariantDetails = {
							"selectedItem":""
						}

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
											$scope.vehicleDetails.regYear = "";
										}
									}
									if (vehicleRTODetails.uMake && vehicleRTODetails.model && vehicleRTODetails.variant && vehicleRTODetails.fuelType) {
										$scope.vehicleInfo.make = vehicleRTODetails.uMake;
										$scope.vehicleInfo.model = vehicleRTODetails.model;
										$scope.vehicleInfo.variant = vehicleRTODetails.variant;
										$scope.vehicleInfo.fuel = vehicleRTODetails.fuelType;
										if(vehicleRTODetails.cubicCapacity)
										$scope.vehicleInfo.cubicCapacity = vehicleRTODetails.cubicCapacity;
										if(vehicleRTODetails.variant && vehicleRTODetails.cubicCapacity){
											$scope.selectedVariantDetails.selectedItem =  $scope.selectedVariantDetails.selectedItem = vehicleRTODetails.variant+""+""+"-"+vehicleRTODetails.cubicCapacity+"cc";
											}
									}else{
										$scope.selectedItem.displayVehicle = '';
										$scope.vehicleInfo.make = '';
										$scope.vehicleInfo.model = '';
										$scope.vehicleInfo.variant = '';
										$scope.vehicleInfo.fuel = '';
										$scope.vehicleInfo.cubicCapacity = '';
										$scope.isCarFound = false;
										$scope.fetchingCar = false;
									}

									if (vehicleRTODetails.vechileIdentificationNumber) {
										$scope.vehicleDetails.chassisNumber = vehicleRTODetails.vechileIdentificationNumber;
									}
									if (vehicleRTODetails.engineNumber) {
										$scope.vehicleDetails.engineNumber = vehicleRTODetails.engineNumber;
									}
									// if (vehicleRTODetails.displayVehicle) {
									// 	$scope.selectedItem.displayVehicle = vehicleRTODetails.displayVehicle;
									// 	//$scope.vehicleInfo.displayVehicle = vehicleRTODetails.displayVehicle;
									// } else {
									// 	$scope.isCarFound = false;
									// 	$scope.selectedItem.displayVehicle = "";
									// 	//$scope.vehicleInfo.displayVehicle = "";
									// }
									$scope.fetchingCar = false;
									var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
									$scope.getRegPlaceListRTO(regNumber, registrationNumber);
								} else {
									$scope.isCarFound = false;
									$scope.fetchingCar = false;
									$scope.selectedItem.displayVehicle = "";
									$scope.vehicleInfo.displayVehicle = "";
									$scope.vehicleDetails.regYear = "";
									var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
									$scope.getRegPlaceListRTO(regNumber, registrationNumber);
								}
							}
							else {
								$scope.isCarFound = false;
								$scope.fetchingCar = false;
								$scope.selectedItem.displayVehicle = "";
								$scope.vehicleInfo.displayVehicle = "";
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
					var urlPattern = $location.path();
				}
			};

			// Function created to change insurance type.
			$scope.alterRenewal = function () {
				if ($scope.vehicleDetails.insuranceType.type != $scope.carInsuranceTypes[1].type) {
					$scope.polStatus = false;
					$scope.renewal = false;
					$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
					//$scope.vehicleInfo.regYear = $scope.yearList[0];
					$scope.vehicleDetails.regYear = $scope.yearList[0];
					//console.log('$scope.quoteParam.onlyODApplicable in new policy is:',$scope.quoteParam.onlyODApplicable);
					// if($scope.quoteParam.onlyODApplicable!=undefined){	
					// if($scope.quoteParam.onlyODApplicable==false || $scope.quoteParam.onlyODApplicable==true){
					// 		delete $scope.quoteParam.onlyODApplicable;
					// 	}
					// }				
				} else {
					$scope.polStatus = true;
					$scope.renewal = true;
					$scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
					// if(!$scope.quoteParam.onlyODApplicable){
                    //     $scope.quoteParam.onlyODApplicable = false;
                    // }
					//console.log('$scope.quoteParam.onlyODApplicable in re-new policy is:',$scope.quoteParam.onlyODApplicable);
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
				if (String($rootScope.carQuoteResult) == "undefined" || $rootScope.carQuoteResult.length == 0) {
					//$scope.errorRespCounter = false;
					$scope.updateAnnualPremiumRange(1000, 5000);
					$rootScope.instantQuoteSummaryStatus = false;
					$rootScope.instantQuoteSummaryError = errorMsg;
					//$rootScope.viewOptionDisabled = true;
					//$rootScope.tabSelectionStatus = true;
					$scope.instantQuoteCarForm = false;
					$rootScope.disableCarRegPopup = false;
				} else if ($rootScope.carQuoteResult.length > 0) {
					$rootScope.instantQuoteSummaryStatus = true;
					//$rootScope.viewOptionDisabled = false;
					//$rootScope.tabSelectionStatus = true;
					$scope.instantQuoteCarForm = false;
					$rootScope.disableCarRegPopup = false;
				}
				$rootScope.loading = false;
			};

			// Preparing tooltip to be displayed on instant quote screen.
			$scope.tooltipPrepare = function (carResult) {
				var riderCount = 0;
				var i;
				var resultCarrierId = [];
				var testCarrierId = [];

				for (i = 0; i < carResult.length; i++) {
					//push only net premium if greater than 0
					var result = carResult[i];
					if (Number(result.netPremium) > 0) {
						var carrierInfo = {};
						if (result.policyType == "new" && result.comprehensive) {
							carrierInfo.id = result.carrierId;
							carrierInfo.name = result.insuranceCompany;
							carrierInfo.annualPremium = result.netPremium;
							carrierInfo.claimsRating = result.insurerIndex;
							if ($rootScope.wordPressEnabled) {
								carrierInfo.insuredDeclareValue = result.insuredDeclareValue;
								carrierInfo.businessLineId = "2";
							}
							if (p365Includes(testCarrierId, result.carrierId) == false) {
								resultCarrierId.push(carrierInfo);
								testCarrierId.push(result.carrierId);
							}
						}
						else if (result.policyType == "renew") {
							carrierInfo.id = result.carrierId;
							carrierInfo.name = result.insuranceCompany;
							carrierInfo.annualPremium = result.netPremium;
							carrierInfo.claimsRating = result.insurerIndex;
							if ($rootScope.wordPressEnabled) {
								carrierInfo.insuredDeclareValue = result.insuredDeclareValue;
								carrierInfo.businessLineId = "2";
							}
							if (p365Includes(testCarrierId, result.carrierId) == false) {
								resultCarrierId.push(carrierInfo);
								testCarrierId.push(result.carrierId);
							}
						}
					}
				}

				$rootScope.resultedCarriers = resultCarrierId;
				$rootScope.resultCarrierId = resultCarrierId;

				$rootScope.calculatedQuotesLength = (String(carResult.length)).length == 2 ? String(carResult.length) : ("0" + String(carResult.length));
				$rootScope.calculatedRidersLength = (String(riderCount)).length == 2 ? String(riderCount) : ("0" + String(riderCount));
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
				if ($rootScope.carQuoteResult.length > 0) {
					//$rootScope.viewOptionDisabled = false;
					//$rootScope.tabSelectionStatus = true;
					//$rootScope.modalShown = false;
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

					//localStorageService.set("carQuoteCalculationResult", $rootScope.carQuoteResult);

					if (localStorageService.get("selectedBusinessLineId") == 3)
						$scope.tooltipPrepare($rootScope.carQuoteResult);
				}
			};

			// Instant quote calculation function.
			$scope.singleClickCarQuote = function () {
				setTimeout(function () {
					if (!$scope.carInstantQuoteForm.$invalid) {
						$scope.quote = {};
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.instantQuoteInvalidSummaryStatus = true;
						//$scope.quoteParam.policyExpiredAge = 0;
						//$rootScope.viewOptionDisabled = true;
						//$rootScope.tabSelectionStatus = false;
						//$scope.errorRespCounter = true;
						$scope.instantQuoteCarForm = true;
						$rootScope.disableCarRegPopup = true;
						$rootScope.loading = true;
						$rootScope.quoteResultCount =0;

						var todayDate = new Date();
						if ($scope.quoteParam.policyType == $scope.carInsuranceTypes[0].value) {

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
									$scope.vehicleDetails.PreviousPolicyStartDate = $scope.vehicleInfo.dateOfRegistration;
								} else {
									convertDateFormatToString(tempCalcPrevPolStartDate, function (formattedPrevPolStartDate) {
										$scope.vehicleDetails.PreviousPolicyStartDate = formattedPrevPolStartDate;
									});
								}
							});
						}
				
						if ($rootScope.selectedCarRegistrationObject != null || String($rootScope.selectedCarRegistrationObject) != "undefined") {
							$scope.vehicleInfo.registrationPlace = $rootScope.selectedCarRegistrationObject.display;
							$rootScope.vehicleInfo.registrationPlace = $rootScope.selectedCarRegistrationObject.display;
							$scope.vehicleInfo.city = $rootScope.selectedCarRegistrationObject.city;
							$scope.vehicleInfo.RTOCode = $rootScope.selectedCarRegistrationObject.regisCode;
							$scope.vehicleInfo.state = $rootScope.selectedCarRegistrationObject.state;
						} else {
							var city = (localStorageService.get("carRegAddress")) ? localStorageService.get("carRegAddress").city : "Mumbai";
							var selectedMetroDetails;

							for (var i = 0; i < $scope.defaultMetroList.length; i++) {
								if ($scope.defaultMetroList[i].city == city) {
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

						$scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
						
						if ($rootScope.showCarRegAreaStatus) {                          
                            	$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0,2).toUpperCase() + $scope.vehicleInfo.registrationPlace.substr(3,2).toUpperCase();
                        }else{
                                $scope.vehicleInfo.RTOCode = $scope.vehicleDetails.registrationNumber.substr(0, 4).toUpperCase();  
							}
						
						$scope.vehicleDetails.showCarRegAreaStatus = $rootScope.showCarRegAreaStatus;
						localStorageService.set("selectedBusinessLineId", 3);
						//$scope.quoteParam.documentType = $scope.p365Labels.documentType.quoteRequest;
						//$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");

						var personDob = new Date(new Date().getFullYear() - 46);
						convertDateFormatToString(personDob, function (formattedDateOfBirth) {
							$scope.vehicleDetails.dateOfBirth = personDob;
							$scope.vehicleDetails.formattedDateOfBirth = formattedDateOfBirth;
						});

						/*ncb is sent for expired policies  - as suggested by kuldeep.p*/
						if ($scope.vehicleInfo.previousClaim == "true" || $scope.quoteParam.policyType == "new")
							$scope.quoteParam.ncb = 0;
						else
							$scope.quoteParam.ncb = $scope.vehicleDetails.ncb.value;

						//idv option is set to best deal based on Uday's discussion
						$scope.vehicleDetails.idvOption = 1;

						//$scope.quoteParam.policyExpiredAge = $scope.vehicleDetails.expiry / 365;
						//$scope.vehicleDetails.manufacturingYear = $scope.vehicleInfo.regYear;
						$scope.vehicleDetails.manufacturingYear = $scope.vehicleDetails.regYear;
						//explicity added to make IDV as 0, as we come from LMS system, request was taking the LMS actual vale as IDV
						$scope.vehicleInfo.IDV = 0;
						//$scope.quoteParam.userIdv = 0;

						//added IDV quote ID based on IDV selection in Result and removing as IDV is zero
						delete $scope.vehicleInfo.best_quote_id

						if($scope.quoteParam.quoteType){
							delete $scope.quoteParam.quoteType;
						}
						$scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.vehicleInfo = $scope.vehicleInfo;
						//$scope.quote.PACoverDetails = $scope.CarPACoverDetails;
						//$scope.quote.requestType = carRequestType;
						localStorageService.set("carQuoteInputParamaters", $scope.quote);
						localStorageService.set("selectedCarDetails", $scope.vehicleDetails);
						
						if (localStorageService.get("professionalQuoteParams")) {
							if(localStorageService.get("professionalQuoteParams").carInfo){
							var professionalQuoteCookie = localStorageService.get("professionalQuoteParams");
							professionalQuoteCookie.carInfo.registrationYear = $scope.vehicleDetails.regYear;
							professionalQuoteCookie.carInfo.make = $scope.vehicleInfo.make;
							professionalQuoteCookie.carInfo.model = $scope.vehicleInfo.model;
							professionalQuoteCookie.carInfo.variant = $scope.vehicleInfo.variant;
							professionalQuoteCookie.carInfo.fuel = $scope.vehicleInfo.fuel;
							professionalQuoteCookie.carInfo.cubicCapacity = $scope.vehicleInfo.cubicCapacity;
							
							localStorageService.set("professionalQuoteParams", professionalQuoteCookie);
							}else{
							$scope.profQuoteCookie = {};
							$scope.profQuoteCookie.carInfo = {};
							$scope.profQuoteCookie.carInfo.registrationYear = $scope.vehicleDetails.regYear;
							$scope.profQuoteCookie.carInfo.make = $scope.vehicleInfo.make;
							$scope.profQuoteCookie.carInfo.model = $scope.vehicleInfo.model;
							$scope.profQuoteCookie.carInfo.variant = $scope.vehicleInfo.variant;
							$scope.profQuoteCookie.carInfo.fuel = $scope.vehicleInfo.fuel;
							$scope.profQuoteCookie.carInfo.cubicCapacity = $scope.vehicleInfo.cubicCapacity;
							localStorageService.set("professionalQuoteParams", $scope.profQuoteCookie);
							}
						} else {
							$scope.profQuoteCookie = {};
							$scope.profQuoteCookie.carInfo = {};
							$scope.profQuoteCookie.carInfo.registrationYear = $scope.vehicleDetails.regYear;
							//$scope.profQuoteCookie.bikeInfo.variantId = $scope.vehicleDetails.variantId;
							$scope.profQuoteCookie.carInfo.make = $scope.vehicleInfo.make;
							$scope.profQuoteCookie.carInfo.model = $scope.vehicleInfo.model;
							$scope.profQuoteCookie.carInfo.variant = $scope.vehicleInfo.variant;
							$scope.profQuoteCookie.carInfo.fuel = $scope.vehicleInfo.fuel;
							$scope.profQuoteCookie.carInfo.cubicCapacity = $scope.vehicleInfo.cubicCapacity;
							localStorageService.set("professionalQuoteParams", $scope.profQuoteCookie);
						}

						//added to reset idv on cancel of your idv pop-up
						$rootScope.idvOptionCopy = angular.copy($scope.vehicleDetails.idvOption);

						$scope.requestId = null;
						var quoteUserInfo = localStorageService.get("quoteUserInfo");
						// if (quoteUserInfo) {
						// 	$scope.quote.mobileNumber = quoteUserInfo.mobileNumber;
						// }
						// if (localStorageService.get("PROF_QUOTE_ID")) {
						// 	$scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
						// }
						// Service call for quote calculation.
						$scope.carQuoteRequestFormation($scope.quote);
                        RestAPI.invoke(getCarQuote, $scope.quoteRequest).then(function (callback) {

							$rootScope.carQuoteRequest = [];

							if (callback.responseCode == $scope.p365Labels.responseCode.success1) {
								$scope.responseCodeList = [];

								$scope.requestId = callback.QUOTE_ID;
						
								$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;

								
								localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);		
								localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.requestId);
								localStorageService.set("car_best_quote_id", $scope.requestId);


								$rootScope.carQuoteRequest = callback.data;

								if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0) {
									$rootScope.carQuoteResult.length = 0;
								}

								$rootScope.carQuoteResult = [];

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
											$rootScope.quoteResultCount +=1;
											if (carQuoteResponse.QUOTE_ID == $scope.requestId) {
												$scope.responseCodeList.push(carQuoteResponse.responseCode);

												if (carQuoteResponse.responseCode == $scope.p365Labels.responseCode.success1) {
													for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
														if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
															$rootScope.loading = false;
															$rootScope.carQuoteResult.push(carQuoteResponse.data.quotes[0]);
															$rootScope.carQuoteRequest[i].status = 1;
														}
													}
													$scope.processResult();
												} else {
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

								$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
									if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
										$rootScope.loading = false;
									if ($scope.responseCodeList.length == $rootScope.carQuoteRequest.length) {
										$rootScope.loading = false;
										$rootScope.setTooltip = false;

										for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
											if ($rootScope.carQuoteRequest[i].status == 0) {
												$rootScope.carQuoteRequest[i].status = 2;
												$rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMotorErrMsg);
											}
										}
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
								if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0)
									$rootScope.carQuoteResult.length = 0;

								$rootScope.carQuoteResult = [];
								$scope.errorMessage(callback.message);
							}
						});
					}
				}, 100);
			};

			$scope.changeRegYear = function () { };

			// Pre-population of UI fields. 
			$scope.prePopulateFields = function () {
				var i;
				if (!localStorageService.get("selectedCarDetails")) {
					for (var i = 0; i < $scope.policyStatusList.length; i++) {
						if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
							$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
							break;
						}
					}
				} else {
					if (localStorageService.get("selectedCarDetails").policyStatus) {
						var getPolicyStatus = localStorageService.get("selectedCarDetails").policyStatus;
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

				//taking registration year and fuel from angular copy.as registration year  and fuel making empty in Car Registration API
				if ($scope.vehicleDetails.regYear == '') {
					$scope.vehicleDetails.regYear = $rootScope.regYearCopy;
				}

				var carRegistrationDetails = localStorageService.get("carRegistrationDetails");
				if (carRegistrationDetails) {
					if (String(carRegistrationDetails.registrationNumber) != "undefined" && carRegistrationDetails.registrationNumber != null) {
						$rootScope.vehicleDetails.registrationNumber = carRegistrationDetails.registrationNumber;
					}
				}
				console.log('** vehicleInfo in prepopulate field is **',$scope.vehicleInfo);
			};

			// Function created to fetch default input parameters for car.
			$scope.fetchDefaultInputParamaters = function (defaultQuoteStatus, defaultInputParamCallback) {
				$scope.renewal = true;
				$scope.polStatus = true;

				if (defaultQuoteStatus) {
					console.log('inside defaultQuoteStatus: ',defaultCarQuoteParam);
					$scope.quoteParam = defaultCarQuoteParam.quoteParam;
					$scope.vehicleDetails = defaultCarQuoteParam.vehicleDetails;
					//$scope.vehicleInfo = defaultCarQuoteParam.vehicleInfo;
					
					$scope.vehicleInfo.IDV = 0,
					$scope.vehicleInfo.RTOCode = "MH01",
					$scope.vehicleInfo.previousClaim ="false",
					$scope.vehicleInfo.registrationPlace= "MH-01 Mumbai Tardeo",
					$scope.vehicleInfo.idvOption = 1,
					$scope.vehicleInfo.make="Maruti Suzuki";
					$scope.vehicleInfo.model="Alto 800";
					$scope.vehicleInfo.variant="LX";
					$scope.vehicleInfo.fuel = "PETROL";
					$scope.vehicleInfo.cubicCapacity = "796";

					$rootScope.vehicleInfo = $scope.vehicleInfo;
					console.log('** $rootScope.vehicleInfo in fetchDefaultParam is ** :',$rootScope.vehicleInfo);

					if ($rootScope.wordPressEnabled) {
						$rootScope.disableCarRegPopup = false;
						$scope.quote = {};
						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.vehicleInfo = $scope.vehicleInfo;
						for (var i = 0; i < $scope.policyStatusList.length; i++) {
							if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
								$scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
								break;
							}
						}
						localStorageService.set("selectedBusinessLineId", 3);
						//localStorageService.set("carQuoteInputParamaters", $scope.quote);
						localStorageService.set("selectedCarDetails", $scope.vehicleDetails);
					}
				
					console.log('** $scope.quote in carQuoteInputParamaters is ** :',$scope.quote);
					if(professionalCarParams) {
						$scope.vehicleDetails.regYear = professionalCarQuoteCookie.registrationYear
						if(professionalCarQuoteCookie.registrationPlace){
						$rootScope.vehicleInfo.registrationPlace = professionalCarQuoteCookie.registrationPlace;
						$scope.vehicleInfo.registrationPlace = professionalCarQuoteCookie.registrationPlace;
						}
						$scope.vehicleInfo.make = professionalCarQuoteCookie.make;
						$scope.vehicleInfo.model = professionalCarQuoteCookie.model;
						$scope.vehicleInfo.variant = professionalCarQuoteCookie.variant;
						$scope.vehicleInfo.fuel = professionalCarQuoteCookie.fuel;
						$scope.vehicleInfo.cubicCapacity = professionalCarQuoteCookie.cubicCapacity;
						console.log('** professionalCarQuoteCookie is **',$scope.vehicleInfo);
					}
						$rootScope.showCarRegAreaStatus = true;
					$scope.prePopulateFields();
				} else
				 {
					if (carQuoteCookie.quoteParam) {
						$scope.quoteParam = carQuoteCookie.quoteParam;
					}
					if ($rootScope.wordPressEnabled) {
						$rootScope.disableCarRegPopup = false;
					}
					$scope.vehicleDetails = vehicleDetailsCookie;
					if (localStorageService.get("selectedCarDetails")) {
						vehicleDetailsCookie.displayVehicle = localStorageService.get("selectedCarDetails").displayVehicle;
					}
					$scope.vehicleInfo = carQuoteCookie.vehicleInfo;
					console.log('inside else part of defaultQuoteStatus: ',$scope.vehicleInfo);
					if(professionalCarParams) {
						//if(localStorageService.get("professionalQuoteParams").carInfo){
						$scope.vehicleDetails.regYear = professionalCarQuoteCookie.registrationYear;
						//$scope.vehicleDetails.registrationPlace = professionalBikeQuoteCookie.registrationPlace;
						if(professionalCarQuoteCookie.registrationPlace){
						$rootScope.vehicleInfo = {};
						$rootScope.vehicleInfo.registrationPlace = professionalCarQuoteCookie.registrationPlace;
						$scope.vehicleInfo.registrationPlace = professionalCarQuoteCookie.registrationPlace;
						}
						$scope.vehicleInfo.make = professionalCarQuoteCookie.make;
						$scope.vehicleInfo.model = professionalCarQuoteCookie.model;
						$scope.vehicleInfo.variant = professionalCarQuoteCookie.variant;
						$scope.vehicleInfo.fuel = professionalCarQuoteCookie.fuel;
						$scope.vehicleInfo.cubicCapacity = professionalCarQuoteCookie.cubicCapacity;
					    $scope.selectedItem = {'displayVehicle': vehicleDetailsCookie.displayVehicle};
						//}
				}

					$scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
					$scope.vehicleDetails.selectedAddOnCovers = makeObjectEmpty($scope.vehicleDetails.selectedAddOnCovers, "array");
					$scope.vehicleDetails.addOnCoverCustomAmount = makeObjectEmpty($scope.vehicleDetails.addOnCoverCustomAmount, "array");

					$scope.vehicleDetails.checkforNonElectrical = false;
					$scope.vehicleDetails.checkforElectrical = false;
					$scope.vehicleDetails.checkforPsgCover = false;
					$scope.vehicleDetails.checkforLpgCngCover = false;
					$scope.vehicleDetails.checkforDriverAccCover = false;
					$scope.vehicleDetails.checkforAccessoriesCover = false;

					if ((localStorageService.get("carRegistrationPlaceUsingIP") != undefined && localStorageService.get("carRegistrationPlaceUsingIP") != null) && localStorageService.get("carRegistrationPlaceUsingIP").rtoStatus == true) {
						$scope.vehicleInfo.registrationPlace = localStorageService.get("carRegistrationPlaceUsingIP").rtoName;
						$rootScope.vehicleInfo.registrationPlace = localStorageService.get("carRegistrationPlaceUsingIP").rtoName;
						$rootScope.selectedCarRegistrationObject = localStorageService.get("carRegistrationPlaceUsingIP").rtoObject;
					}

					$rootScope.showCarRegAreaStatus = vehicleDetailsCookie.showCarRegAreaStatus;
					$rootScope.vehicleDetails.registrationNumber = carRegistrationDetails.registrationNumber;
					$scope.prePopulateFields();
				}
				console.log('$scope.vehicle info in step 2 is: ',$scope.vehicleInfo);
				defaultInputParamCallback();
			};

			// Checking whether cookie is present or not.
			if (carQuoteCookie) {
				$scope.fetchDefaultInputParamaters(false, function () { });
			} else {
				$scope.fetchDefaultInputParamaters(true, function () { });
			}

			// Below piece of code written to access function from outside controller.
			$scope.$on("callSingleClickCarQuote", function () {
				$scope.singleClickCarQuote();
			});
		};

		if (!localStorageService.get("ridersCarStatus")) {
			// To get the car rider list applicable for this user.
			getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.car, $scope.p365Labels.request.findAppConfig, function (addOnCoverForCar) {
				localStorageService.set("addOnCoverListForCar", addOnCoverForCar);
				localStorageService.set("ridersCarStatus", true);
				getListFromDB(RestAPI, "", "CarDataList", $scope.p365Labels.request.findAppConfig, function (callbackCar5) {
					if (callbackCar5.responseCode == $scope.p365Labels.responseCode.success) {
						localStorageService.set("carMakeListDisplay", callbackCar5.data);
						$scope.instantQuoteCalculation(addOnCoverForCar);
					}
				});
			});
		} else {
			$scope.instantQuoteCalculation(localStorageService.get("addOnCoverListForCar"));
		}

		$scope.backToProfessionalJourney = function () {
			$location.path("/professionalJourney");
		}
	}]);
