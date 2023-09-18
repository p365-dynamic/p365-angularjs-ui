'use strict';
angular.module('motor', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
	.controller('motorController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$filter', '$anchorScroll', '$sce', '$window', function (RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $filter, $anchorScroll, $sce, $window) {

		$scope.declaration = function () {
			$scope.carVehicleInfo = {};
			$scope.bikeVehicleInfo = {};
			$scope.bikeDetails = {};
			$scope.carDetails = {};
			$scope.bikeInfo = {};
			$scope.carInfo = {};
			$scope.selectedCar = {};
			$scope.selectedBike = {};
			$scope.isCarFound = true;
			$scope.isBikeFound = true;
			$scope.ncbList = [];
			$scope.policyStatusList = [];
		}
		$scope.initialisation = function () {
			var todayDate = new Date();
			var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
				("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
			getPolicyStatusList(formatedTodaysDate);

			$scope.policyStatusList = policyStatusListGeneric;

			var professionalQuoteCookie = localStorageService.get("professionalQuoteParams");
			var carDetailsCookie = localStorageService.get("selectedCarDetails");
			$scope.carDisplayNames = localStorageService.get("carMakeListDisplay");
			if (carDetailsCookie) {
				$scope.carDetails = carDetailsCookie;
				$rootScope.showCarRegAreaStatus = carDetailsCookie.showCarRegAreaStatus;
				$scope.selectedCar.displayVehicle = $scope.carDetails.displayVehicle;
			} else {
				$scope.carDetails = {
					"insuranceType": { type: "Renew Existing Policy", value: "renew" },
					"expiry": 20,
					"policyStatusKey": 3,
					"maxVehicleAge": 15,
					"maxDepreciationRate": 0.5,
					"showCarRegAreaStatus": false,
					"idvOption": 1,
					"minCompulsoryDeductible": 1000,
					"maxCompulsoryDeductible": 2000
				};
				for (var i = 0; i < $scope.policyStatusList.length; i++) {
					if ($scope.carDetails.policyStatusKey == $scope.policyStatusList[i].key) {
						$scope.carDetails.policyStatus = $scope.policyStatusList[i];
						break;
					}
				}
			}

			if (localStorageService.get("carRegistrationDetails")) {
				var vehicleDetailsCookie = localStorageService.get("carRegistrationDetails");
				if (String(vehicleDetailsCookie.registrationNumber) != "undefined" && vehicleDetailsCookie.registrationNumber != null) {
					$scope.carDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;
					localStorageService.set("selectedCarDetails", $scope.carDetails);
				}
			}
			var bikeQuoteCookie = localStorageService.get("bikeQuoteInputParamaters");
			var bikeDetailsCookie = localStorageService.get("selectedBikeDetails");
			$scope.bikeDisplayNames = localStorageService.get("bikeMakeListDisplay");

			if (bikeDetailsCookie) {
				$scope.bikeDetails = bikeDetailsCookie;
				$rootScope.showBikeRegAreaStatus = bikeDetailsCookie.showBikeRegAreaStatus;
				$scope.selectedBike.displayVehicle = $scope.bikeDetails.displayVehicle;
			} else {
				$scope.bikeDetails = {
					"insuranceType": { type: "Renew Existing Policy", value: "renew" },
					"expiry": 20,
					"policyStatusKey": 3,
					"maxVehicleAge": 15,
					"maxDepreciationRate": 0.5,
					"showBikeRegAreaStatus": false,
					"idvOption": 1,
					"zeroDepreciation": "N"
				};
				for (var i = 0; i < $scope.policyStatusList.length; i++) {
					if ($scope.bikeDetails.policyStatusKey == $scope.policyStatusList[i].key) {
						$scope.bikeDetails.policyStatus = $scope.policyStatusList[i];
						break;
					}
				}
			}
			if (localStorageService.get("bikeRegistrationDetails")) {
				var vehicleDetailsCookie = localStorageService.get("bikeRegistrationDetails");
				if (String(vehicleDetailsCookie.registrationNumber) != "undefined" && vehicleDetailsCookie.registrationNumber != null) {
					$scope.bikeDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;
					localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
				}
			}

			if (professionalQuoteCookie) {
				$scope.carInfo = (professionalQuoteCookie.carInfo) ? professionalQuoteCookie.carInfo : {};
				$scope.bikeInfo = (professionalQuoteCookie.bikeInfo) ? professionalQuoteCookie.bikeInfo : {};
			} else {
				$scope.carInfo = {};
				$scope.bikeInfo = {};
			}

			$scope.ncbList = ncbListGeneric;
			$scope.carInsuranceTypes = carInsuranceTypeGeneric;
			$scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;
			for (var i = 0; i < $scope.ncbList.length; i++) {
				if ($scope.ncbList[i].value == 25) {
					$scope.carDetails.ncb = $scope.ncbList[i];
					$scope.bikeDetails.ncb = $scope.ncbList[i];
					break;
				}
			}

			//$scope.carDetails.insuranceType = $scope.carInsuranceTypes[1];
			$scope.carDetails.insuranceType = { type: "Renew Existing Policy", value: "renew" };
			$scope.carDetails.maxVehicleAge = 15;
			$scope.carYearList = listRegistrationYear($scope.carDetails.insuranceType.value, $scope.carDetails.maxVehicleAge);

			//$scope.bikeDetails.insuranceType = $scope.bikeInsuranceTypes[1];
			$scope.bikeDetails.insuranceType = { type: "Renew Existing Policy", value: "renew" };
			$scope.bikeDetails.maxVehicleAge = 15;
			$scope.bikeYearList = listRegistrationYear($scope.bikeDetails.insuranceType.value, $scope.bikeDetails.maxVehicleAge);

			if (localStorageService.get("carRegistrationPlaceUsingIP")) {
				$rootScope.showCarRegAreaStatus = true;
				$scope.carVehicleInfo.registrationPlace = localStorageService.get("carRegistrationPlaceUsingIP").rtoName;
				$scope.showCarDetails = true;
			} else {
				$rootScope.showCarRegAreaStatus = false;
				if (localStorageService.get("carRegistrationDetails")) {
					$scope.carDetails.registrationNumber = localStorageService.get("carRegistrationDetails").registrationNumber;
					$scope.showCarDetails = true;
				}
			}
			if (localStorageService.get("bikeRegistrationPlaceUsingIP")) {
			   $rootScope.showBikeRegAreaStatus = true;
				$scope.showBikeDetails = true;
				$scope.bikeVehicleInfo.registrationPlace = localStorageService.get("bikeRegistrationPlaceUsingIP").rtoName;
			} else {
				$rootScope.showBikeRegAreaStatus = false;
				if (localStorageService.get("bikeRegistrationDetails")) {
					$scope.bikeDetails.registrationNumber = localStorageService.get("bikeRegistrationDetails").registrationNumber;
					$scope.showBikeDetails = true;
				}
			}

		}
		$scope.init = function () {
			$scope.declaration();
			$scope.initialisation();
		};
		$scope.init();
		$scope.galleryPopup = function () {
			setTimeout(function () {
				$('.clickMetro').css('height', '50px');
				$('.showMetro').hide();
				$scope.$apply();
			}, 100);

			// setTimeout(function () {
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
			// }, 2000);
		}

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
			}
			else {
				$scope.dummyLength = 0;
			}
		};
		$scope.toggleCarRegistrationPopup = function (regAreaStatus) {
			$scope.modalCarRegistration = regAreaStatus;
			$rootScope.showCarRegAreaStatus = regAreaStatus;
			$scope.carDetails.showCarRegAreaStatus = regAreaStatus;
			$scope.galleryPopup();
			$scope.hideCarModal = function () {
				$scope.modalCarRegistration = false;
			};
		}
		$scope.toggleBikeRegistrationPopup = function (regAreaStatus) {
			$scope.modalBikeRegistration = regAreaStatus;
			$rootScope.showBikeRegAreaStatus = regAreaStatus;
			$scope.bikeDetails.showBikeRegAreaStatus = regAreaStatus;

			$scope.galleryPopup();
			$scope.hideBikeModal = function () {
				$scope.modalBikeRegistration = false;
			};
		}

		//Car make model and RTO details start
		$scope.selectedDisplayCar = function (selectedVariant) {
			if (selectedVariant) {
				var object = {};
				if (typeof selectedVariant == typeof object) {
					if (selectedVariant.variantId) {
						$scope.carInfo.variantId = selectedVariant.variantId;
						$scope.carDetails.variantId = selectedVariant.variantId;
					}
					$scope.carInfo.make = selectedVariant.make;
					$scope.carInfo.model = selectedVariant.model ;
					$scope.carInfo.variant = selectedVariant.variant;
					if(selectedVariant.fuelType){
					$scope.carInfo.fuel = selectedVariant.fuelType;
					}
					if( selectedVariant.cubicCapacity){
					$scope.carInfo.cubicCapacity = selectedVariant.cubicCapacity;
					}
					$scope.carDetails.displayVehicle = selectedVariant.displayVehicle;
					$scope.carDetails.variantId = selectedVariant.variantId;
				} else {
					$scope.carDetails.displayVehicle = selectedVariant;
					$scope.carDetails.variantId = selectedVariant.variantId;
				}
				$scope.isCarFound = true;
				localStorageService.set("selectedCarDetails", $scope.carDetails);
			}
		};

		$scope.changeCarRegYear = function () { }

		// Function created to change policy status.
		$scope.changePolStatusCar = function () {

			if ($scope.carDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
				$scope.renewal = true;
				if ($scope.carDetails.policyStatus) {
					$scope.carInfo.PreviousPolicyExpiryDate = $scope.carDetails.policyStatus.expiryDate;
				}
			} else {
				$scope.renewal = false;
				$scope.carInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.carInfo.PreviousPolicyExpiryDate, "text");
			}
			if ($scope.carDetails.policyStatus) {
				if ($scope.carDetails.policyStatus.key == 3)
					$scope.carInfo.previousPolicyExpired = "N";
				else
					$scope.carInfo.previousPolicyExpired = "Y";
			}
			if ($scope.toggleCounter == 1) {
				var urlPattern = $location.path();
			}
		};

		// Function created to change policy status.
		$scope.changePolStatusBike = function () {
			if ($scope.bikeDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
				$scope.renewal = true;
				if ($scope.bikeDetails.policyStatus) {
					$scope.bikeInfo.PreviousPolicyExpiryDate = $scope.bikeDetails.policyStatus.expiryDate;
				}
			} else {
				$scope.renewal = false;
				$scope.bikeInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.bikeInfo.PreviousPolicyExpiryDate, "text");
			}

			if ($scope.bikeDetails.policyStatus) {
				if ($scope.bikeDetails.policyStatus.key == 3)
					$scope.bikeInfo.previousPolicyExpired = "N";
				else
					$scope.bikeInfo.previousPolicyExpired = "Y";
			}
			if ($scope.toggleCounter == 1) {
				var urlPattern = $location.path();
			}
		};

		//Car make model and RTO details end

		$scope.changePolStatusCar();
		$scope.changePolStatusBike();

		//Bike make model and RTO details start


		$scope.selectedDisplayBike = function (selectedVariant) {
			if (selectedVariant) {
				var object = {};
				if (typeof selectedVariant == typeof object) {
					if (selectedVariant.variantId) {
						$scope.bikeInfo.variantId = selectedVariant.variantId;
						$scope.bikeDetails.variantId = selectedVariant.variantId;
					 }
					if(selectedVariant.make && selectedVariant.model && selectedVariant.variant){ 
					    $scope.bikeInfo.make = selectedVariant.make;
					    $scope.bikeInfo.model = selectedVariant.model ;
					    $scope.bikeInfo.variant = selectedVariant.variant;
					}
					
					$scope.bikeDetails.displayVehicle = selectedVariant.displayVehicle;
					//$scope.bikeDetails.variantId = selectedVariant.variantId;
				} else {
					$scope.bikeDetails.displayVehicle = selectedVariant;
					$scope.bikeDetails.variantId = selectedVariant.variantId;
				}
				$scope.isBikeFound = true;
				localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
			}
		};

		$scope.changeBikeRegYear = function () { }

		$scope.carStates = loadAllStatesForCar();
		$scope.bikeStates = loadAllStatesForBike();

		$scope.searchCar = null;
		$scope.searchBike = null;

		$scope.vehicleSearch = function (query, lob) {
			var filteredVehicle = [];
			if (lob) {
				if (lob == 3) {
					angular.forEach($scope.carDisplayNames, function (value) {
						if (filteredVehicle.length <= 20) {
							if (value.displayVehicle.toLowerCase().includes(query.toLowerCase())) {
								filteredVehicle.push(value);
							}
						}
					});
				} else if (lob == 2) {
					angular.forEach($scope.bikeDisplayNames, function (value) {
						if (filteredVehicle.length <= 20) {
							if (value.displayVehicle.toLowerCase().includes(query.toLowerCase())) {
								filteredVehicle.push(value);
							}
						}
					});
				}
			} else {

			}
			return filteredVehicle;
		}

		/**
		 * Build `states` list of key/value pairs
		 */
		function loadAllStatesForCar() {
			return $scope.carDisplayNames;
		}
		function loadAllStatesForBike() {
			return $scope.bikeDisplayNames;
		}

		// Fetch RTO details using entered registration number.
		$scope.getCarRegNumber = function (registrationNumber) {
			if (String(registrationNumber) != "undefined") {
				var registrationDetails = {};
				registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
				$scope.carDetails.registrationNumber = registrationNumber;
				//flag for disabling chasis number,engine number,reg number
				$rootScope.isregNumber = false;
				$scope.isCarFound = true;
				$scope.carDetails.engineNumber = '';
				$scope.carDetails.chassisNumber = '';
				$scope.carDetails.displayVehicle = '';
				$scope.carDetails.isregNumberDisabled = true;
				localStorageService.set("selectedCarDetails", $scope.carDetails);

				if ((registrationNumber.trim()).match(/^[a-zA-Z]{2}[0-9]{1,2}[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 11 && (registrationNumber.trim()).length > 4) {
					$rootScope.regNumStatus = false;
					$scope.fetchingCar = true;
					registrationDetails.registrationNumber = registrationNumber;
					localStorageService.set("carRegistrationDetails", registrationDetails);

					var request = {};
					request.registrationNumber = registrationNumber.toUpperCase();
					request.lob = "car";
					request.requestType = 'VEHICLERTOREQCONFIG';
					RestAPI.invoke($scope.globalLabel.transactionName.getVehicleRTODetails, request).then(function (callback) {
						if (callback.responseCode == $scope.globalLabel.responseCode.success) {
							if (callback.data) {
								var vehiclertoDetails = callback.data;
								$scope.isCarFound = true;
								$scope.showCarDetails = true;
								if (vehiclertoDetails.registrationYear) {
									var selectedRegYear = vehiclertoDetails.registrationYear;
									$scope.carInfo.registrationYear = selectedRegYear.trim();
								} else {
									$scope.carInfo.registrationYear = "";
									$scope.isCarFound = false;
								}

								if (vehiclertoDetails.variantId) {
									$scope.carInfo.variantId = vehiclertoDetails.variantId;
									$scope.carDetails.variantId = vehiclertoDetails.variantId;
								}

								if (vehiclertoDetails.displayVehicle) {
									$scope.selectedCar.displayVehicle = vehiclertoDetails.displayVehicle;
								} else {
									$scope.isCarFound = false;
									$scope.selectedCar.displayVehicle = "";
								}

								if (vehiclertoDetails.vechileIdentificationNumber) {
									$scope.carDetails.chassisNumber = vehiclertoDetails.vechileIdentificationNumber;
								}
								if (vehiclertoDetails.engineNumber) {
									$scope.carDetails.engineNumber = vehiclertoDetails.engineNumber;
								}
								$scope.fetchingCar = false;
								var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
								$scope.getCarRegPlaceListRTO(regNumber, registrationNumber);
							} else {
								$scope.fetchingCar = false;
								$scope.isCarFound = false;
								$scope.showCarDetails = true;
								$scope.selectedCar.displayVehicle = "";
								$scope.carInfo.registrationYear = "";
								var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
								$scope.getCarRegPlaceListRTO(regNumber, registrationNumber);
							}
						}
						else {
							$scope.fetchingCar = false;
							$scope.isCarFound = false;
							$scope.showCarDetails = true;
							$scope.selectedCar.displayVehicle = "";
							$scope.carInfo.registrationYear = "";
							var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
							$scope.getCarRegPlaceListRTO(regNumber, registrationNumber);
						}
					});
				} else {
					$rootScope.regNumStatus = true;
				}
			} else {
				$rootScope.regNumStatus = true;
			}
		};

		$scope.getRegPlaceList = function (city) {
			if (city.indexOf('-') > 0)
				city = city.replace('-', '');
			return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + city).then(function (response) {
				return JSON.parse(response.data).data;
			});
		};


		$scope.onSelectCar = function (item) {
			$scope.modalCarRegistration = false;
			$rootScope.showCarRegAreaStatus = true;
			$scope.carVehicleInfo.selectedRegistrationObject = item;
			$scope.showCarDetails = true;
			//flag for disabling registation number
			$rootScope.isregNumber = false;
			//reseting chasis number,engine number on click of vehicleRegistrationPopup
			$scope.carDetails.engineNumber = '';
			$scope.carDetails.chassisNumber = '';
			$scope.carDetails.isregNumberDisabled = false;
			$scope.carVehicleInfo.registrationNumber = '';
			localStorageService.set("selectedCarDetails", $scope.carDetails);

			var rtoDetail = {};
			rtoDetail.rtoName = item.display;
			rtoDetail.rtoCity = item.city;
			rtoDetail.rtoState = item.state;
			rtoDetail.rtoStatus = true;
			rtoDetail.registrationPlace = item.display;
			$scope.carInfo.city = item.city;
			$scope.carInfo.state = item.state;


			getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
				if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
					rtoDetail.rtoPincode = resultedRTOInfo.data[0].pincode;
					if (localStorageService.get("carRegAddress")) {
						localStorageService.get("carRegAddress").pincode = rtoDetail.pincode;
						localStorageService.get("carRegAddress").city = $scope.carVehicleInfo.selectedRegistrationObject.city;
						localStorageService.get("carRegAddress").state = $scope.carVehicleInfo.selectedRegistrationObject.state;
					} else {
						var getCity = {};
						getCity.pincode = rtoDetail.pincode;
						getCity.city = $scope.carVehicleInfo.selectedRegistrationObject.city;
						getCity.state = $scope.carVehicleInfo.selectedRegistrationObject.state;
						localStorageService.set("carRegAddress", getCity);
					}
				} else {
					rtoDetail.rtoPincode = "";
					if (localStorageService.get("carRegAddress")) {
						localStorageService.get("carRegAddress").pincode = rtoDetail.pincode;
						localStorageService.get("carRegAddress").city = $scope.carVehicleInfo.selectedRegistrationObject.city;
						localStorageService.get("carRegAddress").state = $scope.carVehicleInfo.selectedRegistrationObject.state;
					} else {
						var getCity = {};
						getCity.pincode = rtoDetail.pincode;
						getCity.city = $scope.carVehicleInfo.selectedRegistrationObject.city;
						getCity.state = $scope.carVehicleInfo.selectedRegistrationObject.state;
						localStorageService.set("carRegAddress", getCity);
					}
				}
				localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
				$scope.carVehicleInfo.registrationPlace = item.display;
				$scope.carDetails.registrationNumber = '';
			});
		};

		$scope.onSelectBike = function (item) {
			$scope.modalBikeRegistration = false;
			$rootScope.showBikeRegAreaStatus = true;
			$scope.bikeVehicleInfo.selectedRegistrationObject = item;
			$scope.showBikeDetails = true;
			//flag for disabling registation number
			$rootScope.isregNumber = false;
			//reseting chasis number,engine number on click of vehicleRegistrationPopup
			$scope.bikeDetails.engineNumber = '';
			$scope.bikeDetails.chassisNumber = '';
			$scope.bikeDetails.isregNumberDisabled = false;
			$scope.bikeVehicleInfo.registrationNumber = '';
			localStorageService.set("selectedBikeDetails", $scope.bikeDetails);

			var rtoDetail = {};
			rtoDetail.rtoName = item.display;
			rtoDetail.rtoCity = item.city;
			rtoDetail.rtoState = item.state;
			rtoDetail.rtoStatus = true;
			rtoDetail.registrationPlace = item.display;
			$scope.bikeInfo.city = item.city;
			$scope.bikeInfo.state = item.state;
			getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
				if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
					rtoDetail.rtoPincode = resultedRTOInfo.data[0].pincode;

					if (localStorageService.get("bikeRegAddress")) {
						localStorageService.get("bikeRegAddress").pincode = rtoDetail.pincode;
						localStorageService.get("bikeRegAddress").city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
						localStorageService.get("bikeRegAddress").state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
					} else {
						var getCity = {};
						getCity.pincode = rtoDetail.pincode;
						getCity.city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
						getCity.state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
						localStorageService.set("bikeRegAddress", getCity);
					}
				} else {
					rtoDetail.rtoPincode = "";

					if (localStorageService.get("bikeRegAddress")) {
						localStorageService.get("bikeRegAddress").pincode = rtoDetail.pincode;
						localStorageService.get("bikeRegAddress").city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
						localStorageService.get("bikeRegAddress").state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
					} else {
						var getCity = {};
						getCity.pincode = rtoDetail.pincode;
						getCity.city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
						getCity.state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
						localStorageService.set("bikeRegAddress", getCity);
					}
				}
				localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
				$scope.bikeVehicleInfo.registrationPlace = item.display;
				$scope.bikeDetails.registrationNumber = '';
			});
		};

		// Method call to get default list form central DB.
		$scope.getCarRegPlaceListRTO = function (regNumber, registrationNumber) {
			if (regNumber.indexOf('-') > 0)
				regNumber = regNumber.replace('-', '');
			return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + regNumber).then(function (callback) {
				callback = JSON.parse(callback.data);
				if (callback.responseCode == $scope.globalLabel.responseCode.success) {
					$scope.carVehicleInfo.selectedRegistrationObject = callback.data[0];
					$scope.carDetails.registrationNumber = registrationNumber.trim();
					localStorageService.set("carRegistrationNumber", registrationNumber.trim());
					var rtoDetail = {};
					rtoDetail.rtoName = $scope.carVehicleInfo.selectedRegistrationObject.display;
					rtoDetail.rtoCity = $scope.carVehicleInfo.selectedRegistrationObject.city;
					rtoDetail.rtoState = $scope.carVehicleInfo.selectedRegistrationObject.state;
					rtoDetail.rtoObject = callback.data[0];
					rtoDetail.cityStatus = true;
					rtoDetail.rtoStatus = true;
					$scope.carInfo.city = $scope.carVehicleInfo.selectedRegistrationObject.city;
					$scope.carInfo.state = $scope.carVehicleInfo.selectedRegistrationObject.state;

					getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
						if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
							rtoDetail.pincode = resultedRTOInfo.data[0].pincode;

							if (localStorageService.get("carRegAddress")) {
								localStorageService.get("carRegAddress").pincode = rtoDetail.pincode;
								localStorageService.get("carRegAddress").city = $scope.carVehicleInfo.selectedRegistrationObject.city;
								localStorageService.get("carRegAddress").state = $scope.carVehicleInfo.selectedRegistrationObject.state;
							} else {
								var getCity = {};
								getCity.pincode = rtoDetail.pincode;
								getCity.city = $scope.carVehicleInfo.selectedRegistrationObject.city;
								getCity.state = $scope.carVehicleInfo.selectedRegistrationObject.state;
								localStorageService.set("carRegAddress", getCity);
							}

						} else {
							$scope.pincode = "";
							rtoDetail.pincode = "";

							if (localStorageService.get("carRegAddress")) {
								localStorageService.get("carRegAddress").pincode = rtoDetail.pincode;
								localStorageService.get("carRegAddress").city = $scope.carVehicleInfo.selectedRegistrationObject.city;
								localStorageService.get("carRegAddress").state = $scope.carVehicleInfo.selectedRegistrationObject.state;
							} else {
								var getCity = {};
								getCity.pincode = rtoDetail.pincode;
								getCity.city = $scope.carVehicleInfo.selectedRegistrationObject.city;
								getCity.state = $scope.carVehicleInfo.selectedRegistrationObject.state;
								localStorageService.set("carRegAddress", getCity);
							}
						}
						localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
						$scope.carVehicleInfo.registrationPlace = rtoDetail.rtoName;
						localStorageService.set("carDisplayVehicle", $scope.carDetails.displayVehicle);
					});
				} else {
					$rootScope.regNumStatus = true;
				}
			});
		};




		$scope.getBikeRegPlaceListRTO = function (regNumber, registrationNumber) {
			if (regNumber.indexOf('-') > 0)
				regNumber = regNumber.replace('-', '');
			return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + regNumber).then(function (callback) {
				callback = JSON.parse(callback.data);
				if (callback.responseCode == $scope.globalLabel.responseCode.success) {
					$scope.bikeVehicleInfo.selectedRegistrationObject = callback.data[0];
					$scope.bikeDetails.registrationNumber = registrationNumber.trim();
					localStorageService.set("bikeRegistrationNumber", registrationNumber.trim());

					var rtoDetail = {};
					rtoDetail.rtoName = $scope.bikeVehicleInfo.selectedRegistrationObject.display;
					rtoDetail.rtoCity = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
					rtoDetail.rtoState = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
					rtoDetail.rtoObject = callback.data[0];
					rtoDetail.cityStatus = true;
					rtoDetail.rtoStatus = true;
					$scope.bikeInfo.city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
					$scope.bikeInfo.state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
					getPincodeFromCity($http, rtoDetail, function (resultedRTOInfo) {
						if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
							rtoDetail.pincode = resultedRTOInfo.data[0].pincode;

							if (localStorageService.get("bikeRegAddress")) {
								localStorageService.get("bikeRegAddress").pincode = rtoDetail.pincode;
								localStorageService.get("bikeRegAddress").city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
								localStorageService.get("bikeRegAddress").state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
							} else {
								var getCity = {};
								getCity.pincode = rtoDetail.pincode;
								getCity.city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
								getCity.state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
								localStorageService.set("bikeRegAddress", getCity);
							}
						} else {
							$scope.pincode = "";
							rtoDetail.pincode = "";

							if (localStorageService.get("bikeRegAddress")) {
								localStorageService.get("bikeRegAddress").pincode = rtoDetail.pincode;
								localStorageService.get("bikeRegAddress").city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
								localStorageService.get("bikeRegAddress").state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
							} else {
								var getCity = {};
								getCity.pincode = rtoDetail.pincode;
								getCity.city = $scope.bikeVehicleInfo.selectedRegistrationObject.city;
								getCity.state = $scope.bikeVehicleInfo.selectedRegistrationObject.state;
								localStorageService.set("bikeRegAddress", getCity);
							}
						}
						localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
						$scope.bikeVehicleInfo.registrationPlace = rtoDetail.rtoName;
						localStorageService.set("bikeDisplayVehicle", $scope.bikeDetails.displayVehicle);
					});
				} else {
					$rootScope.regNumStatus = true;
				}
			});
		};

$scope.getBikeRegNumber = function (registrationNumber) {
			if (String(registrationNumber) != "undefined") {
				$scope.fetchingBike = true;
				var registrationDetails = {};
				registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');
				$scope.bikeDetails.registrationNumber = registrationNumber;
				//flag for disabling chasis number,engine number,reg number
				$rootScope.isregNumber = false;
				$scope.isBikeFound = false;
				$scope.bikeDetails.engineNumber = '';
				$scope.bikeDetails.chassisNumber = '';
				$scope.bikeDetails.displayVehicle = '';
				$scope.bikeDetails.isregNumberDisabled = true;
				localStorageService.set("selectedBikeDetails", $scope.carDetails);
				if ((registrationNumber.trim()).match(/^[a-zA-Z]{2}[0-9]{1,2}[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 11 && (registrationNumber.trim()).length > 4) {
					$rootScope.regNumStatus = false;
					$scope.fetchingBike = true;
					$scope.isBikeFound = true;
					registrationDetails.registrationNumber = registrationNumber;
					localStorageService.set("bikeRegistrationDetails", registrationDetails);
					$scope.bikeDetails.registrationNumber = registrationNumber;

					var request = {};
					request.registrationNumber = registrationNumber.toUpperCase();
					request.lob = "bike"
					request.requestType = 'VEHICLERTOREQCONFIG';
					RestAPI.invoke($scope.globalLabel.transactionName.getVehicleRTODetails, request).then(function (callback) {
						if (callback.responseCode == $scope.globalLabel.responseCode.success) {
							if (callback.data) {
								var vehiclertoDetails = callback.data;
								$scope.isBikeFound = true;
								$scope.showBikeDetails = true;
								if (vehiclertoDetails.registrationYear) {
									var selectedRegYear = vehiclertoDetails.registrationYear;
									$scope.bikeInfo.registrationYear = selectedRegYear.trim();
								} else {
									$scope.bikeInfo.registrationYear = "";
									$scope.isBikeFound = false;
								}

								if (vehiclertoDetails.variantId) {
									$scope.bikeInfo.variantId = vehiclertoDetails.variantId;
									$scope.bikeDetails.variantId = vehiclertoDetails.variantId;
								}
                               
								 if (vehiclertoDetails.displayVehicle) {
								 	$scope.selectedBike.displayVehicle = vehiclertoDetails.displayVehicle;
								 }
								 if (vehicleRTODetails.uMake && vehicleRTODetails.model && vehicleRTODetails.variant) {
                                    $scope.bikeInfo.make = vehicleRTODetails.uMake;
                                    $scope.bikeInfo.model = vehicleRTODetails.model;
									$scope.bikeInfo.variant = vehicleRTODetails.variant; 
								 }
								//else {
								// 	$scope.isBikeFound = false;
								// 	$scope.selectedBike.displayVehicle = "";
								// }

								if (vehiclertoDetails.vechileIdentificationNumber) {
									$scope.bikeDetails.chassisNumber = vehiclertoDetails.vechileIdentificationNumber;
								}
								if (vehiclertoDetails.engineNumber) {
									$scope.bikeDetails.engineNumber = vehiclertoDetails.engineNumber;
								}
								$scope.fetchingBike = false;
								var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
								$scope.getBikeRegPlaceListRTO(regNumber, registrationNumber);
							} else {
								$scope.fetchingBike = false;
								$scope.isBikeFound = false;
								$scope.showBikeDetails = true;
								$scope.bikeInfo.registrationYear = "";
								$scope.selectedBike.displayVehicle = "";
								var regNumber = registrationNumber.trim().slice(0, 2) + "-" + registrationNumber.trim().slice(2, 4);
								$scope.getBikeRegPlaceListRTO(regNumber, registrationNumber);
							}
						}
						else {
							$scope.fetchingBike = false;
							$scope.isBikeFound = false;
							$scope.showBikeDetails = true;
							$scope.bikeInfo.registrationYear = "";
							$scope.selectedBike.displayVehicle = "";
							var regNumber = registrationNumber.trim().slice(0, 2) + "-" + registrationNumber.trim().slice(2, 4);
							$scope.getBikeRegPlaceListRTO(regNumber, registrationNumber);
						}
					});
				} else {
					$rootScope.regNumStatus = true;
				}
			} else {
				$rootScope.regNumStatus = true;
			}
		}
	}]);