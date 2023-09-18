/*
 * Description	: This is the controller file for Email.
 * Author		: Akash Kumawat
 * Date			: 29 Jan 2019
 *
 * */
var sourceOrigin;
var organizationName;
angular.module('shareProfessionalQuoteByEmail', [])
	.controller('ShareProfessionalQuoteByEmailController', ['$scope', '$rootScope', '$location', '$filter', '$http', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$mdDialog', '$window', '$sce',
		function ($scope, $rootScope, $location, $filter, $http, RestAPI, localStorageService, $timeout, $interval, $mdDialog, $window, $sce) {
			if ($location.search().docId) {
				$scope.p365Labels = commonResultLabels;
				console.log('$scope.p365Labels in share professional quote is: ', $scope.p365Labels);

				$scope.decryptedQuote_Id = String($location.search().docId);
				$scope.decryptedLOB = String($location.search().LOB);
				$scope.decryptedEmailId = String($location.search().userId);
				
				var request = {};
				request.LOB = 0;
				request.docId = $scope.decryptedQuote_Id;
				request.userId = $scope.decryptedEmailId;
				$rootScope.isActiveTab2 = 0;
				localStorageService.set("PROF_QUOTE_ID", $scope.decryptedQuote_Id);
				localStorageService.set("selectedBusinessLineId",request.LOB);

				$scope.carInsuranceTypes = carInsuranceTypeGeneric;
				$scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;
				$scope.ncbList = ncbListGeneric;

				if(localStorageService.get("userLoginInfo") == null || String(localStorageService.get("userLoginInfo")) == "undefined"){
					var userLoginInfo = {};
					userLoginInfo.username = undefined;
					userLoginInfo.mobileNumber = undefined;
					userLoginInfo.status = false;
					console.log("UL shareProf: ", userLoginInfo);
					localStorageService.set("userLoginInfo", userLoginInfo);
				}		

				if($location.search().sharedProfile){
					$rootScope.sharedProfileString = "";
					var sharedProfile = String($location.search().sharedProfile);
					if(sharedProfile == "riskProfile"){
						$rootScope.sharedProfileString = "riskProfile";
					}else if(sharedProfile == "insuranceAssessment"){
						$rootScope.sharedProfileString = "insuranceAssessment";
					}else{
						$rootScope.sharedProfileString = "";
					}
				}

				//added to store lead info
				if (String($location.search().leaddetails) != "undefined") {
					var leaddetails = JSON.parse($location.search().leaddetails);
					localStorageService.set("quoteUserInfo", leaddetails);
				}

				// Fetch lead id from url for iQuote+.
				if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
					if ($location.search().messageId) {
						messageIDVar = $location.search().messageId;
						$scope.quoteUserInfo.messageId = $location.search().messageId;
					}
				}
				console.log("carInsuranceTypeGeneric : ", carInsuranceTypeGeneric);

				if ($location.search().sharedProfile) {
					$rootScope.sharedProfileString = "";
					var sharedProfile = String($location.search().sharedProfile);
					if (sharedProfile == "riskProfile") {
						$rootScope.sharedProfileString = "riskProfile";
					} else if (sharedProfile == "insuranceAssessment") {
						$rootScope.sharedProfileString = "insuranceAssessment";
					} else {
						$rootScope.sharedProfileString = "";
					}
				}
				RestAPI.invoke("quoteDataReader", request).then(function (_professionalQuoteCallback) {

					if (_professionalQuoteCallback.responseCode == 1000) {
						console.log("in shareProfessionalQuoteByEmail")

						console.log("_professionalQuoteCallback : ", _professionalQuoteCallback);
						var _professionalQuoteData = _professionalQuoteCallback.data;

						if (_professionalQuoteData) {
							var professionalQuoteRequest = {};
							professionalQuoteRequest.professionId = _professionalQuoteData.professionId;
							professionalQuoteRequest.profession = _professionalQuoteData.profession;
							professionalQuoteRequest.professionCode = _professionalQuoteData.professionCode;
							professionalQuoteRequest.currentQuestionCode = _professionalQuoteData.currentQuestionCode
							professionalQuoteRequest.bikeInfo = _professionalQuoteData.bikeInfo;
							professionalQuoteRequest.carInfo = _professionalQuoteData.carInfo;
							professionalQuoteRequest.healthInfo = _professionalQuoteData.healthInfo;
							professionalQuoteRequest.commonInfo = _professionalQuoteData.commonInfo;
							//localStorageService.set("quoteUserInfo", professionalQuoteRequest.commonInfo);
							var profession = {};
							profession.professionId = _professionalQuoteData.professionId;
							profession.professionName = _professionalQuoteData.profession;
							profession.professionCode = _professionalQuoteData.professionCode;						localStorage.setItem("profession",JSON.stringify(profession));
							localStorageService.set("commAddressDetails", _professionalQuoteData.commonInfo.address);
							localStorageService.set("updateProdcutInCartFlag", true);
							localStorageService.set("professionalQuoteParams", professionalQuoteRequest);
							//localStorageService.set("selectedCarDetails", professionalQuoteRequest.carInfo);
							console.log("gtggggg", professionalQuoteRequest);
							if (_professionalQuoteData.lobQuoteId) {
								angular.forEach(_professionalQuoteData.lobQuoteId, function (object, index) {
									var req = {};
									req.docId = object.QUOTE_ID;
									req.lob = object.businessLineId;

									$scope.quoteParam = {};
									$scope.carQuote = {};
									//$scope.vehicleInfo = {};

									var request = {};
									var header = {};
									header.messageId = messageIDVar;
									header.source = sourceOrigin;
									header.transactionName = "quoteDataReader";
									header.deviceId = deviceIdOrigin;
									request.header = header;
									request.body = req;
									console.log("QUOTE ID GOING TO BE READ : ",req.docId);
									$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
										success(function (callback, status) {
											callback = JSON.parse(callback);

											if (callback.data) {
												if (callback.data.businessLineId == 3 || callback.data.businessLineId == 2) {
													var todayDate = new Date();
													var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
														("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
													getPolicyStatusList(formatedTodaysDate);
													$scope.policyStatusList = policyStatusListGeneric;
													if (callback.data.businessLineId == 3) {
														$scope.carQuoteRequest = callback.data.carQuoteRequest;
														$rootScope.carQuoteResult = callback.data.carQuoteResponse;
														$scope.carRequestId = callback.data.carQuoteResponse.QUOTE_ID;
														//$scope.quoteParam = $scope.carQuoteRequest.quoteParam;
														$scope.carQuote.quoteParam = $scope.carQuoteRequest.quoteParam;

														//$scope.vehicleInfo = $scope.carQuoteRequest.vehicleInfo;
														$scope.carQuote.vehicleInfo = $scope.carQuoteRequest.vehicleInfo;

														localStorageService.set("selectedCarDetails", professionalQuoteRequest.carInfo);
														localStorageService.set("carQuoteInputParamaters", $scope.carQuote);

														var riderReq = {};
														riderReq.documentType = "Rider";
														riderReq.searchValue = "Car";

														var riderRequest = {};
														var riderHeader = {};
														riderHeader.messageId = messageIDVar;
														riderHeader.source = sourceOrigin;
														riderHeader.transactionName = "findAppConfig";
														riderHeader.deviceId = deviceIdOrigin;
														riderRequest.header = riderHeader;
														riderRequest.body = riderReq;

														// $http({ method: 'POST', url: getQuoteCalcLink, data: riderRequest }).
														// 	success(function (addOnCoverList, status) {
														// 		var addOnCoverListForCar = addOnCoverList;	

														$scope.carDetails = {};
														$scope.CarPACoverDetails = {
															"isPACoverApplicable": false,
															"existingInsurance": true
														}
														// if ($scope.carQuoteRequest.quoteParam) {
														// 	$scope.carDetails.policyType = $scope.carQuoteRequest.quoteParam.policyType;
														// 	if ($scope.carQuoteRequest.quoteParam.riders) {
														// 		var selectedAddOnCoversForCar = [];
														// 		for (i = 0; i < addOnCoverListForCar.length; i++) {
														// 			for (var j = 0; j < $scope.carQuoteRequest.quoteParam.riders.length; j++) {
														// 				if (addOnCoverListForCar[i].riderId == $scope.carQuoteRequest.quoteParam.riders[j].riderId) {
														// 					selectedAddOnCoversForCar.push(addOnCoverListForCar[i]);
														// 					break;
														// 				}
														// 			}
														// 		}
														// 		localStorageService.set("addOnCoverListForCar", selectedAddOnCoversForCar);
														// 		//localStorageService.set("ridersCarStatus", true);
														// 	}																	
														// 	//localStorageService.set("selectedBusinessLineId", 3);																	
														// }
														console.log('callback.data.carQuoteResponse in share profession: ', callback.data.carQuoteResponse);
														//$scope.CARPACoverDetails = callback.data.carQuoteResponse.PACoverDetails;


														if ($scope.carQuoteRequest.vehicleInfo.registrationNumber) {
															$rootScope.showCarRegAreaStatus = false;
															$scope.carDetails.showCarRegAreaStatus = false;
															$scope.carDetails.registrationNumber = $scope.vehicleInfo.registrationNumber;
														} else {
															$scope.carDetails.showCarRegAreaStatus = true;
															$rootScope.showCarRegAreaStatus = true;
														}

														if ($scope.carQuoteRequest.vehicleInfo.previousPolicyExpired == "N") {
															$scope.carDetails.policyStatusKey = 3;
														} else {
															$scope.carDetails.policyStatusKey = 2;
														}

														if ($scope.carQuoteRequest.vehicleInfo.displayVehicle) {
															$scope.carDetails.displayVehicle = $scope.carQuoteRequest.vehicleInfo.displayVehicle;
														}

														$scope.carDetails.idvOption = $scope.carQuoteRequest.vehicleInfo.idvOption;
														$scope.carDetails.manufacturingYear = $scope.carQuoteRequest.vehicleInfo.regYear;

														$scope.carDetails.expiry = 20;
														$scope.carDetails.maxVehicleAge = 15;

														if ($scope.carQuoteRequest.vehicleInfo.previousPolicyExpired == "N")
															$scope.carDetails.policyStatusKey = 3;
														else
															$scope.carDetails.policyStatusKey = 2;


														for (var i = 0; i < $scope.carInsuranceTypes.length; i++) {
															if ($scope.carQuoteRequest.quoteParam.policyType == $scope.carInsuranceTypes[i].value) {
																$scope.carDetails.insuranceType = $scope.carInsuranceTypes[i];
																break;
															}
														}

														for (var i = 0; i < $scope.policyStatusList.length; i++) {
															if ($scope.carDetails.policyStatusKey == $scope.policyStatusList[i].key) {
																$scope.carDetails.policyStatus = $scope.policyStatusList[i];
																break;
															}
														}

														for (i = 0; i < $scope.ncbList.length; i++) {
															if ($scope.carQuoteRequest.quoteParam.ncb == $scope.ncbList[i].value) {
																$scope.carDetails.ncb = $scope.ncbList[i];
																break;
															}
														}
														if ($scope.carDetails.idvOption == 1) {
															localStorageService.set("CAR_IDV_QUOTE_ID", $scope.CAR_UNIQUE_QUOTE_ID);
														}
														localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.carRequestId);
														localStorageService.set("CarPACoverDetails", $scope.CarPACoverDetails);
														localStorageService.set("selectedCarDetails", $scope.carDetails);

														//});
													} else if (callback.data.businessLineId == 2) {
														$scope.bikeQuoteRequest = callback.data.bikeQuoteRequest;
														$rootScope.bikeQuoteResult = callback.data.bikeQuoteResponse;
														$scope.quoteParam = {};
														$scope.bikeQuote = {};
														//$scope.vehicleInfo = {};
														//$scope.quoteParam = $scope.bikeQuoteRequest.quoteParam;
														$scope.bikeQuote.quoteParam = $scope.bikeQuoteRequest.quoteParam;
														//$scope.BIKE_UNIQUE_QUOTE_ID = $scope.bikeResponse.QUOTE_ID;
														//$scope.vehicleInfo = $scope.bikeQuoteRequest.vehicleInfo;
														$scope.bikeQuote.vehicleInfo = $scope.bikeQuoteRequest.vehicleInfo;
														localStorageService.set("selectedBikeDetails", professionalQuoteRequest.bikeInfo);
														localStorageService.set("bikeQuoteInputParamaters", $scope.bikeQuote);
														//localStorageService.set("selectedBusinessLineId", 2);
														console.log('bikeQuoteInputParamaters is:: ', $scope.bikeQuote);

														var riderReq = {};
														riderReq.documentType = "Rider";
														riderReq.searchValue = "Bike";


														var riderRequest = {};
														var riderHeader = {};
														riderHeader.messageId = messageIDVar;
														riderHeader.source = sourceOrigin;
														riderHeader.transactionName = "findAppConfig";
														riderHeader.deviceId = deviceIdOrigin;
														riderRequest.header = riderHeader;
														riderRequest.body = riderReq;

														$scope.bikeDetails = {};
														console.log('$scope.bikeQuoteRequest step 1 : ', $scope.bikeQuoteRequest);
														$scope.bikeQuoteResponse = callback.data.bikeQuoteResponse;
														$scope.bikeRequestId = callback.data.bikeQuoteResponse.QUOTE_ID;
														console.log('$scope.bikeQuoteRequest is ...', $scope.bikeQuoteRequest);
														//$scope.BIKEPACoverDetails = callback.data.bikeQuoteRequest.PACoverDetails;
														$scope.BikePACoverDetails = {
															"isPACoverApplicable": false,
															"existingInsurance": true
														}

														if (localStorageService.get("selectedBikeDetails")) {
															$scope.bikeDetails = localStorageService.get("selectedBikeDetails");
														}
														if ($scope.bikeQuoteRequest.vehicleInfo.registrationNumber) {
															$rootScope.showBikeRegAreaStatus = false;
															$scope.bikeDetails.showBikeRegAreaStatus = false;
															$scope.bikeDetails.registrationNumber = $scope.vehicleInfo.registrationNumber;
														} else {
															$scope.bikeDetails.showBikeRegAreaStatus = true;
															$rootScope.showBikeRegAreaStatus = true;
														}

														if ($scope.bikeQuoteRequest.vehicleInfo.previousPolicyExpired == "N")
															$scope.bikeDetails.policyStatusKey = 3;
														else
															$scope.bikeDetails.policyStatusKey = 2;

														if ($scope.bikeQuoteRequest.vehicleInfo.previousPolicyExpired == "N") {
															$scope.bikeDetails.policyStatusKey = 3;
														} else {
															$scope.bikeDetails.policyStatusKey = 2;
														}

														$scope.bikeDetails.idvOption = $scope.bikeQuoteRequest.vehicleInfo.idvOption;
														$scope.bikeDetails.manufacturingYear = $scope.bikeQuoteRequest.vehicleInfo.regYear;

														$scope.bikeDetails.policyType = $scope.bikeQuoteRequest.quoteParam.policyType;

														$scope.bikeDetails.expiry = 20;
														$scope.bikeDetails.maxVehicleAge = 15;

														for (var i = 0; i < $scope.carInsuranceTypes.length; i++) {
															if ($scope.bikeQuoteRequest.quoteParam.policyType == $scope.carInsuranceTypes[i].value) {
																$scope.bikeDetails.insuranceType = $scope.carInsuranceTypes[i];
																break;
															}
														}

														for (var i = 0; i < $scope.policyStatusList.length; i++) {
															if ($scope.bikeDetails.policyStatusKey == $scope.policyStatusList[i].key) {
																$scope.bikeDetails.policyStatus = $scope.policyStatusList[i];
																break;
															}
														}

														for (i = 0; i < $scope.ncbList.length; i++) {
															if ($scope.bikeQuoteRequest.quoteParam.ncb == $scope.ncbList[i].value) {
																$scope.bikeDetails.ncb = $scope.ncbList[i];
																break;
															}
														}
														if ($scope.bikeQuoteRequest.vehicleInfo.displayVehicle) {
															$scope.bikeDetails.displayVehicle = $scope.bikeQuoteRequest.vehicleInfo.displayVehicle;
														}

														if ($scope.bikeDetails.idvOption == 1) {
															localStorageService.set("BIKE_IDV_QUOTE_ID", $scope.BIKE_UNIQUE_QUOTE_ID);
														}

														localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.bikeRequestId);
														localStorageService.set("BikePACoverDetails", $scope.BikePACoverDetails);
														localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
														localStorageService.set("bikeDetailsToBeAddedInCart", $scope.bikeDetails);
														//});					
													}
												} else if (callback.data.businessLineId == 4) {

													$scope.healthResponse = callback.data;
													$rootScope.healthQuoteResult = callback.data.quoteResponse;
													$scope.healthRequestId = callback.data.quoteResponse.QUOTE_ID;
													//service for setting local storage info
													// getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.health, $scope.globalLabel.request.findAppConfig, function(addOnCoverForHealth){
													// 	localStorageService.set("addOnCoverForHealth", addOnCoverForHealth);
													// 	localStorageService.set("ridersHealthStatus", true);
													//fetching disease list
													//getListFromDB(RestAPI, "", "Disease", "findAppConfig", function (callback) {
													//if (callback.responseCode == $scope.p365Labels.responseCode.success) {
													$scope.diseaseList = [];													
													$scope.healthQuote = {};
													$scope.selectedFamilyArray = [];
													$scope.selectedDisease = {};
													$scope.diseaseList = {};
													$scope.selectedDisease.diseaseList = [];
													$scope.selectedFeatures = [];
													$rootScope.healthQuoteResult = [];
													var item = {};
													$scope.hospitalisationLimit = {};
													$scope.isDiseased = false;

													//$scope.quote = $scope.healthResponse.quoteRequest;
													console.log('$scope.healthResponse is', $scope.healthResponse);
													$scope.healthQuote.quoteParam = $scope.healthResponse.quoteRequest.quoteParam;
													$scope.healthQuote.personalInfo = $scope.healthResponse.quoteRequest.personalInfo;
													$scope.selectedArea = $scope.healthResponse.quoteRequest.personalInfo.displayArea;
													$scope.selectedBusinessLineId = $scope.healthResponse.businessLineId;
													$scope.selectedFamilyArray = $scope.healthQuote.personalInfo.selectedFamilyMembers;
													$scope.healthQuote.ratingParam = $scope.healthResponse.quoteRequest.ratingParam;
													
													for(var i=0; i < $scope.selectedFamilyArray.length;i++)
													{
														for(var j=0; j < $scope.selectedFamilyArray[i].dieaseDetails.length;j++)
														{	
															if($scope.selectedFamilyArray[i].dieaseDetails.length > 0)
															{		
																if($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode!=undefined)
																{
																	//if($scope.selectedDisease.diseaseList.includes($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode))
																	if(p365Includes($scope.selectedDisease.diseaseList,$scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode))
																	{
																		continue;	
																	}	
																	$scope.selectedDisease.diseaseList.push($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode);
																	$scope.isDiseased=true;
																}
															}	
														} 
								
													}
													for (var i = 0; i < $scope.healthResponse.quoteResponse.length; i++) {
														if (Number($scope.healthResponse.quoteResponse[i].basicPremium > 0)) {
															$rootScope.healthQuoteResult.push($scope.healthResponse.quoteResponse[i]);
														}

													}
													$rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;

													if ($scope.healthQuote.personalInfo.pincode) {
														item.pincode = $scope.healthQuote.personalInfo.pincode;
													}
													if ($scope.healthQuote.personalInfo.city) {
														item.district = $scope.healthQuote.personalInfo.city;
													}
													item.displayArea = $scope.healthQuote.personalInfo.displayArea;
													item.state = $scope.healthQuote.personalInfo.state;

													if ($scope.healthQuote.personalInfo.preDiseaseStatus == "Yes") {
														$scope.isDiseased = true;
													}
													console.log('health quote param is: ', $scope.healthQuote);
													//$scope.hospitalisationLimit.minHosLimit = $scope.healthQuote.personalInfo.minHospitalisationLimit;
													//$scope.hospitalisationLimit.maxHosLimit = $scope.healthQuote.personalInfo.maxHospitalisationLimit;

													$scope.familyList = healthFamilyListGeneric;
													var sonCount = 0;
													var daughterCount = 0;
													for (var j = 0; j < $scope.familyList.length; j++) {
														$scope.familyList[j].val = false;
													}

													for (i = 0; i < $scope.selectedFamilyArray.length; i++) {
														if ($scope.selectedFamilyArray[i].relation == 'Son') {
															sonCount += 1;
														} else if ($scope.selectedFamilyArray[i].relation == 'Daughter') {
															daughterCount += 1;
														}
														for (var j = 0; j < $scope.familyList.length; j++) {
															if ($scope.selectedFamilyArray[i].relation == $scope.familyList[j].member) {
																$scope.familyList[j].val = true;
																break;
															}
														}
													}
													for (i = 0; i < sonCount - 1; i++) {
														$scope.familyList.push({ 'member': 'Son', 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 82, iconFlag: true });

													}
													for (i = 0; i < daughterCount - 1; i++) {
														$scope.familyList.push({ 'member': 'Daughter', 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, iconFlag: true });
													}
													if (localStorageService.get("selectedDisease")) {
														$scope.selectedDisease = localStorageService.get("selectedDisease");
													}

													localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.healthRequestId);
													localStorageService.set("selectedArea", $scope.selectedArea);
													localStorageService.set("selectedFamilyForHealth", $scope.familyList);
													localStorageService.set("selectedFamilyArray", $scope.selectedFamilyArray);
													localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
													localStorageService.set("userGeoDetails", item);
													localStorageService.set("selectedDisease", $scope.selectedDisease);

													//reset functionality
													localStorageService.set("healthQuoteInputParamatersReset", $scope.healthQuote);
													localStorageService.set("selectedAreaReset", $scope.selectedArea);
													localStorageService.set("selectedFamilyForHealthReset", $scope.familyList);
													localStorageService.set("selectedFamilyArrayReset", $scope.selectedFamilyArray);
													localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
													localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);

													for (var i = 0; i < $scope.diseaseList.length; i++) {
														$scope.diseaseList[i].familyList = [];
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

															for (i = 0; i < sonCount - 1; i++) {
																$scope.familyList.push({ 'member': 'Son', 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 82, iconFlag: true });
		
															}
															for (i = 0; i < daughterCount - 1; i++) {
																$scope.familyList.push({ 'member': 'Daughter', 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, iconFlag: true });
															}
															if (localStorageService.get("selectedDisease")) {
																$scope.selectedDisease = localStorageService.get("selectedDisease");
															}
								
															localStorageService.set("healthQuoteInputParamaters", $scope.healthQuote);
															localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.healthRequestId);
															localStorageService.set("selectedArea", $scope.selectedArea);
															localStorageService.set("selectedFamilyForHealth", $scope.familyList);
															localStorageService.set("selectedFamilyArray", $scope.selectedFamilyArray);
															localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
															localStorageService.set("userGeoDetails", item);
															localStorageService.set("selectedDisease", $scope.selectedDisease);
								
															//reset functionality
															localStorageService.set("healthQuoteInputParamatersReset", $scope.healthQuote);
															localStorageService.set("selectedAreaReset", $scope.selectedArea);
															localStorageService.set("selectedFamilyForHealthReset", $scope.familyList);	
															localStorageService.set("selectedFamilyArrayReset", $scope.selectedFamilyArray);
															localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
															localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);
						
															for (var i = 0; i < $scope.diseaseList.length; i++) {
																$scope.diseaseList[i].familyList = [];
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
															localStorageService.set("diseaseList", $scope.diseaseList);
															localStorageService.set("diseaseListReset", $scope.diseaseList);
															console.log('$scope.diseaseList is in quote response::', $scope.diseaseList);
															
												console.log("$scope.healthQuoteRequest : ", $scope.healthResponse);

															for (i = 0; i < sonCount - 1; i++) {
																$scope.familyList.push({ 'member': 'Son', 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 82, iconFlag: true });
		
															}
															for (i = 0; i < daughterCount - 1; i++) {
																$scope.familyList.push({ 'member': 'Daughter', 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, iconFlag: true });
															}
															if (localStorageService.get("selectedDisease")) {
																$scope.selectedDisease = localStorageService.get("selectedDisease");
															}
								
															localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.healthRequestId);
															localStorageService.set("selectedArea", $scope.selectedArea);
															localStorageService.set("selectedFamilyForHealth", $scope.familyList);
															localStorageService.set("selectedFamilyArray", $scope.selectedFamilyArray);
															localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
															localStorageService.set("userGeoDetails", item);
															localStorageService.set("selectedDisease", $scope.selectedDisease);
								
															//reset functionality
															localStorageService.set("healthQuoteInputParamatersReset", $scope.healthQuote);
															localStorageService.set("selectedAreaReset", $scope.selectedArea);
															localStorageService.set("selectedFamilyForHealthReset", $scope.familyList);	
															localStorageService.set("selectedFamilyArrayReset", $scope.selectedFamilyArray);
															localStorageService.set("isDiseasedForHealth", $scope.isDiseased);
															localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);
						
															for (var i = 0; i < $scope.diseaseList.length; i++) {
																$scope.diseaseList[i].familyList = [];
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
															localStorageService.set("diseaseList", $scope.diseaseList);
															localStorageService.set("diseaseListReset", $scope.diseaseList);
															console.log('$scope.diseaseList is in quote response::', $scope.diseaseList);
															
												console.log("$scope.healthQuoteRequest : ", $scope.healthResponse);

														}
													}
													localStorageService.set("diseaseList", $scope.diseaseList);
													localStorageService.set("diseaseListReset", $scope.diseaseList);
													console.log('$scope.diseaseList is in quote response::', $scope.diseaseList);

													console.log("$scope.healthQuoteRequest : ", $scope.healthResponse);

												} else if (callback.data.businessLineId == 1) {
													$scope.lifeQuoteRequest = callback.data.lifeQuoteRequest;
													$rootScope.lifeQuoteResult = callback.data.lifeQuoteResponse;
													$scope.lifeRequestId = callback.data.QUOTE_ID;
													console.log("$scope.lifeQuoteRequestId : ", $scope.lifeRequestId);

													$scope.lifeQuote = {};
													$scope.quoteParam = {};
													$scope.personalDetails = {};

													$scope.lifeQuote.quoteParam = $scope.lifeQuoteRequest.quoteParam
													$scope.lifeQuote.personalDetails = $scope.lifeQuoteRequest.personalDetails;
													$scope.personalDetails = $scope.lifeQuote.personalDetails;
													localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.lifeRequestId);
													localStorageService.set("lifeQuoteInputParamaters", $scope.lifeQuote);
													localStorageService.set("lifePersonalDetails", $scope.personalDetails);
													//localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.LIFE_UNIQUE_QUOTE_ID);
													//});
													//});
												}
												else {
													//console.log("New Businessline : ", callback.data);
												}
											}
										});
								});
							}
						} else {
					console.log("Unable to process with null");
						 }
						 console.log("Redirecting to professionalJourneyResult 123.. ");

						$location.path('/professionalJourneyResult');
						// setTimeout(function(){
						// 	console.log("Redirecting to professionalJourneyResult 123.. ");
						// 	$rootScope.isFromShareProfessional =true;
						// 	$location.path('/professionalJourneyResult');						
						// },2000);					 		
					} else {
						console.log("Not able to fetch professional related data : ", _professionalQuoteData);
					}

				});

				//});
			}

		}]);