/*
 * Description	: This is the controller file for instant health quote calculation.
 * Author		: Shubham Jain
 * Date			: 10 August 2016
 * */
'use strict';
angular.module('healthInstantQuote', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model'])
	.controller('healthInstantQuoteController', ['$scope', '$rootScope', '$window', '$location', '$filter', 'RestAPI', '$http', 'localStorageService', '$interval', '$timeout', '$sce', '$anchorScroll', function ($scope, $rootScope, $window, $location, $filter, RestAPI, $http, localStorageService, $interval, $timeout, $sce, $anchorScroll) {
		//$scope.loading=true;
		// Setting application labels to avoid static assignment

		//var applicationLabels  = localStorageService.get("applicationLabels");
		//$scope.globalLabel = applicationLabels.globalLabels;
		$anchorScroll('home');

		$scope.p365Labels = insHealthQuoteLabels;
		$rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbInstantQuote) };
		if ($location.path() == '/health') {
			$rootScope.title = $scope.p365Labels.policies365Title.healthInstantQuoteLanding;
		} else {
			$rootScope.title = $scope.p365Labels.policies365Title.healthInstantQuote;
		}

		$rootScope.loading = true;
		$rootScope.instantQuoteSummaryStatus = true;
		$rootScope.disableLandingLeadBtn = false;
		$rootScope.GSTTag = false;

		//added for prepopulating faster
		$scope.quoteParam = defaultHealthQuoteParam.quoteParam;
		$scope.ratingParam = defaultHealthQuoteParam.ratingParam;
		$scope.personalInfo = defaultHealthQuoteParam.personalInfo;
		//end
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
				//$scope.familyList = localStorageService.get("selectedFamilyForHealth");
				// if(localStorageService.get("selectedFamilyForHealth")){
				// 	$scope.familyList = localStorageService.get("selectedFamilyForHealth");
				// }else{

				// }
				
				$scope.familyList = healthFamilyListGeneric;
				$scope.genderType = genderTypeGeneric;
				$scope.preDiseaseStatus = preDiseaseStatusGeneric;
				$scope.personalInfo.selFamilyMember = selectedFamilyMemberId;
				$rootScope.tabSelectionStatus = true;
				$scope.medicalInstant.collapseFamilyList = false;
				if ($rootScope.wordPressEnabled) {
					$scope.instantQuoteHealthForm = false;
				} else {
					$scope.instantQuoteHealthForm = true;
				}

				var DOBOption = {};
				DOBOption.changeMonth = true;
				DOBOption.changeYear = true;
				DOBOption.dateFormat = DATE_FORMAT;
				$scope.DOBOptions = setP365DatePickerProperties(DOBOption);
				var dateRange = {};

				var member;
				$scope.$watch(function (scope) { return scope.familyList; }, function () {
					$scope.selectedFamilyArray = [];
					for (var i = 0; i < $scope.familyList.length; i++) {
						if ($scope.familyList[i].relationship == 'S' || $scope.familyList[i].relationship == 'SP' || $scope.familyList[i].relationship == 'A') {
							dateRange.minimumYearLimit = "-99Y";
							dateRange.maximumYearLimit = "-18Y";
							dateRange.changeMonth = true;
							dateRange.changeYear = true;
							dateRange.dateFormat = DATE_FORMAT;

						} if ($scope.familyList[i].relationship == 'CH') {
							dateRange.minimumYearLimit = "-25Y" + " - 1D";
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
							$scope.selectedFamilyArray.push(member);
						}
					}
				}, true);


				$scope.getAgeArray = function (minAge, maxAge) {
					var ageArray = [];
					for (var i = 0, j = minAge; j <= maxAge; i++ , j++) {
						ageArray.push(j);
					}
					return ageArray;
				};

				// Method to get list of pincodes
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
							$scope.onSelectPinOrArea(areaDetails.data[0], false);
						}
					});
				};
				$scope.onSelectPinOrArea = function (item, dirtyStatus) {
					$scope.modalPIN = false;
					$scope.selectedArea = item.area;
					$scope.personalInfo.pincode = item.pincode;
					if (item.area) {
						$scope.personalInfo.displayArea = item.area + ", " + item.district;
					} else {
						$scope.personalInfo.displayArea = item.displayArea;
					}
					item.city = item.district;
					$scope.personalInfo.city = item.district;
					$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalInfo.displayArea;
					$scope.personalInfo.state = item.state;
					console.log("item.state", item.state);
					localStorageService.set("commAddressDetails", item);
					setTimeout(function(){
						var urlPattern = $location.path();
						if(urlPattern == "/healthLanding"){	
							sourceOrigin="landing";
					console.log("sourceOrigin for health landing is : ",sourceOrigin);
							$scope.singleClickHealthQuote();
						}
					},100);
					// setTimeout(function(){
					// 	/*if(!$rootScope.wordPressEnabled){
					// 		$scope.singleClickHealthQuote();
					// 	}else{
					// 		$scope.instantQuoteHealthForm=false;
					// 	}*/
					// 	 if(dirtyStatus){
					// 	 	$scope.singleClickHealthQuote();
					// 	 }					
					// },100);
				};

				$scope.getDisease = function () {
					if ($scope.selectedDisease)
						return $scope.selectedDisease.diseaseList;
				};

				$scope.removeFamilyMember = function (data) {
					data.val = false;
					setTimeout(function () {
						$scope.singleClickHealthQuote();
					}, 100);
				};

				$scope.removePreDisease = function (data) {
					var i;
					for (i = 0; i < $scope.selectedDisease.diseaseList.length; i++) {
						if ($scope.selectedDisease.diseaseList[i] == data.diseaseId) {
							$scope.selectedDisease.diseaseList.splice(i, 1);
							break;
						}
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
				};

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
					//var sonList={'member':'Son','age': 5, 'gender':'M', 'relationship':'CH', 'occupationClass':2, 'val':true, 'other':false, 'mandatory':false, 'minAge':1, 'maxAge':25,iconFlag:true};
					//$scope.familyList.splice(index,0,sonList);
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


				$scope.validateFamilyForm = function () {
					$scope.familyErrors = [];
					var submitFamilyForm = true;
					var ageOfSelf, ageOfSpouse, ageOfFather, lesserAge;
					for (var i = 0; i < $scope.familyList.length; i++) {
						if ($scope.familyList[i].member == "Self") {

							if ($scope.familyList[i].val) {
								$scope.ratingParam.isSelf = "Y";
								ageOfSelf = Number($scope.familyList[i].age);
							}
							else {
								$scope.ratingParam.isSelf = "N";
							}
						} else if ($scope.familyList[i].member == "Spouse") {

							if ($scope.familyList[i].val) {
								$scope.ratingParam.isSpouse = "Y";
								ageOfSpouse = Number($scope.familyList[i].age);
							}
							else {
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

				$scope.updateDiseaseList = function () {

					var i;
					for (i = 0; i < $scope.diseaseList.length; i++) {
						for (var j = 0; j < $scope.diseaseList[i].familyList.length; j++) {
							//if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[j].diseaseId)){
							if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[j].diseaseId)) {
								//if(!$scope.personalInfo.selFamilyMember.includes($scope.diseaseList[i].familyList[j].id)){
								if (p365Includes($scope.personalInfo.selFamilyMember, $scope.diseaseList[i].familyList[j].id)) {
									$scope.diseaseList[i].familyList.splice(j, 1);
									j = 0;
								}
							} else {
								//commented as the disease list is coming empty for pre existing disease
								//$scope.diseaseList[i].familyList = [];
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
						//commented as the disease list is coming empty for pre existing disease
						//$scope.personalInfo.preDiseaseStatus = "No";
						//$scope.isDiseased = true;
					}
				};

				$scope.submitFamily = function () {
					var submitFamilyForm = true;
					submitFamilyForm = $scope.validateFamilyForm();
					$scope.personalInfo.selFamilyMember = [];
					var familyCounter = 0;
					var familyMemberExistStatus = false;
					for (var i = 0; i < $scope.familyList.length; i++) {
						if ($scope.familyList[i].val == true) {
							$scope.personalInfo.selFamilyMember.push($scope.familyList[i].id);
							familyMemberExistStatus = true;
							familyCounter += 1;
						}
					}

					if (familyCounter > 1) {
						$scope.quoteParam.planType = "F";
					} else {
						$scope.quoteParam.planType = "I";
					}

					$scope.updateDiseaseList();
					if (familyMemberExistStatus) {
						if (submitFamilyForm == true) {
							$scope.modalFamily = false;
							setTimeout(function () {
							}, 100);
						}
					} else {
						$scope.familyErrors.push("Please select atleast one member.");
					}
				};

				$scope.closeFamilyMemberModal = function () {
					$scope.familyList = $scope.oldFamilyList;
					$scope.modalFamily = false;
				};

				$scope.closePreExistingDiseaseModal = function () {
					var deleteList = [];
					for (var i = 0; i < $scope.diseaseList.length; i++) {
						//if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[i].diseaseId)== true && $scope.diseaseList[i].familyList.length == 0){
						if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[i].diseaseId) == true && $scope.diseaseList[i].familyList.length == 0) {
							deleteList.push($scope.diseaseList[i].diseaseId);
							//}else if($scope.oldSelectedDiseaseList.includes($scope.diseaseList[i].diseaseId) == false){
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
					var submitDiseaseForm = true;
					var i;
					$scope.ratingParam.criticalIllness = "N";
					$scope.ratingParam.organDonar = "N";

					if ($scope.selectedDisease.diseaseList.length > 0) {
						for (i = 0; i < $scope.diseaseList.length; i++) {
							//if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[i].diseaseId)== true){
							if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[i].diseaseId) == true) {
								if ($scope.diseaseList[i].diseaseType == "OrganDonar") {
									$scope.ratingParam.organDonar = "Y";
								}

								if ($scope.diseaseList[i].diseaseType == "Critical") {
									$scope.ratingParam.criticalIllness = "Y";
								}

								if ($scope.diseaseList[i].familyList.length == 0) {
									$scope.diseaseError = "Please select family members against each selected disease";
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
							$scope.personalInfo.preDiseaseStatus = "No";
							$scope.isDiseased = false;
						}

						for (i = 0; i < $scope.selectedFamilyArray.length; i++) {
							$scope.selectedFamilyArray[i].dieaseDetails = [];
							$scope.dieaseDetails = [];

							for (var j = 0; j < $scope.diseaseList.length; j++) {

								//if($scope.selectedDisease.diseaseList.includes($scope.diseaseList[j].diseaseId)== true){
								if (p365Includes($scope.selectedDisease.diseaseList, $scope.diseaseList[j].diseaseId) == true) {

									for (var k = 0; k < $scope.diseaseList[j].familyList.length; k++) {

										if ($scope.selectedFamilyArray[i].id == $scope.diseaseList[j].familyList[k].id) {
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
								else {
									$scope.diseaseList[j].familyList = [];
								}
							}

							$scope.selectedFamilyArray[i].dieaseDetails.push($scope.dieaseDetails);
						}



						// setTimeout(function(){
						// 	if(!$rootScope.wordPressEnabled)
						// 	$scope.singleClickHealthQuote();
						// },100);
					}
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

						// setTimeout(function(){
						// 	if(!$rootScope.wordPressEnabled)
						// 	$scope.singleClickHealthQuote();
						// },100);
					}
				};

				$scope.modalHealth = false;
				$scope.toggleHealth = function () {

					if (!$scope.instantQuoteHealthForm) {
						$scope.oldSelectedDiseaseList = angular.copy($scope.selectedDisease.diseaseList);
						$scope.modalHealth = !$scope.modalHealth;
						$('.md-click-catcher').click(function () {
							$('.md-select-menu-container').hide();
						});
					}
				};

				$scope.familyList.forEach(function (healthFamilyListGeneric) {
					healthFamilyListGeneric.dob = calcDOBFromAge(healthFamilyListGeneric.age);
				});
				$scope.modalFamily = false;
				$scope.toggleFamily = function () {
					if (!$scope.instantQuoteHealthForm) {
						$scope.oldFamilyList = angular.copy($scope.familyList);
						$scope.modalFamily = !$scope.modalFamily;
					}
					setTimeout(function () {
						$('.hiddenAge').each(function () {
							var hiddenVal = $(this).val();
							$(this).closest('span').find('.ageDropdown').val(hiddenVal);
						});
					}, 500);
				};

				$scope.validateAge = function (data, dob) {
					var dateArr = dob.split("/");
					var newDOB = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
					data.age = calculateAgeByDOB(newDOB);
				}
				$scope.modalPIN = false;
				$scope.togglePin = function () {
					if (!$scope.instantQuoteHealthForm) {
						$scope.modalPIN = !$scope.modalPIN;
						$scope.oldPincode = $scope.personalInfo.pincode;
						$scope.hideModal = function () {
							$scope.personalInfo.pincode = $scope.oldPincode;
							$scope.modalPIN = false;
						};
					}
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
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteHealthForm = false;
						$rootScope.loading = false;
					} else if ($rootScope.healthQuoteResult.length > 0) {
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteHealthForm = false;
						$rootScope.loading = false;
					}
				};

				$scope.tooltipPrepare = function (healthResult) {
					var i;
					// $rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
					// $rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
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

							if (healthResult[i].totalCount) {
								carrierInfo.totalCount = healthResult[i].totalCount;
							}
							if ($rootScope.wordPressEnabled) {
								carrierInfo.businessLineId = "4";
								carrierInfo.sumInsured = healthResult[i].sumInsured;
							}
							/*if(testCarrierId.includes(healthResult[i].carrierId) == false){
								resultCarrierId.push(carrierInfo);
								testCarrierId.push(healthResult[i].carrierId);
							}*/
							if (p365Includes(testCarrierId, healthResult[i].carrierId) == false) {
								resultCarrierId.push(carrierInfo);
								testCarrierId.push(healthResult[i].carrierId);
							}
						}
					}
					$rootScope.resultCarrierId = resultCarrierId;
					// $rootScope.quoteResultInsurerList = $rootScope.tooltipContent.quoteDesc + "\n<ul style='text-align: left;' class='tickpoints'>";
					for (i = 0; i < resultCarrierId.length; i++) {
						$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
					}
					$rootScope.quoteResultInsurerList += "</ul>";

					// $rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
					$rootScope.calculatedQuotesLength = (String(healthResult.length)).length == 2 ? String(healthResult.length) : ("0" + String(healthResult.length));
					$rootScope.calculatedRidersLength = (String(addOnCoverForHealth.length)).length == 2 ? String(addOnCoverForHealth.length) : ("0" + String(addOnCoverForHealth.length));
					setTimeout(function () {

						scrollv = new scrollable({
							wrapperid: "scrollable-v",
							moveby: 4,
							mousedrag: true
						});


					}, 3000);
				};

				$scope.processResult = function () {
					//for wordPress
					//sometimes $rootScope.healthQuoteResult[0] is getting undefind. to have a check
					if ($rootScope.healthQuoteResult.length > 0) {
						$rootScope.enabledProgressLoader = false;
						//flag to proceed further on button click if atleast 1 quote result comes in product journey
						//$rootScope.disableHealthNextScreen = false;
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteHealthForm = false;
						$rootScope.loading = false;
						//for campaign
						$rootScope.campaignFlag = true;
						$rootScope.healthQuoteResult = $filter('orderBy')($rootScope.healthQuoteResult, 'annualPremium');

						var minAnnualPremiumValue = $rootScope.healthQuoteResult[0].annualPremium;
						var annualPremiumSliderArray = [];

						for (var j = 0; j < $rootScope.healthQuoteResult.length; j++) {
							var calculatedDiscAmt = 0;
							var discountAmtList = $rootScope.healthQuoteResult[j].discountDetails;
							if (String(discountAmtList) != "undefined") {
								for (var i = 0; i < discountAmtList.length; i++) {
									calculatedDiscAmt += discountAmtList[i]["com.sutrr.quote.healthquotecalc.DiscountDetails"].discountAmount;
								}
								calculatedDiscAmt += $rootScope.healthQuoteResult[j].annualPremium;
								annualPremiumSliderArray.push(calculatedDiscAmt);
							} else {
								annualPremiumSliderArray.push($rootScope.healthQuoteResult[j].annualPremium);
							}
						}

						annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
						$scope.updateAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);

						if (localStorageService.get("selectedBusinessLineId") == 4) {
							//$scope.tooltipPrepare($rootScope.healthQuoteResult);
						}
					}
				};

				$scope.calculateHealthPremiumOnSubmit = function () {
					//  setTimeout(function(){
					// 		if(!$rootScope.wordPressEnabled){	
					// 			$scope.singleClickHealthQuote();
					// 			}
					// 	},100);
				}

				$scope.changeHospitalLimit = function (hospitalisationLimit) {
					//  setTimeout(function(){
					$scope.hospitalisationLimit = hospitalisationLimit;
					// 	if(!$rootScope.wordPressEnabled){
					// 		$scope.singleClickHealthQuote();
					// 	}					
					// },100);

				}


				$scope.singleClickHealthQuote = function () {
					var i;
					setTimeout(function () {

						$rootScope.tabSelectionStatus = false;
						$scope.errorRespCounter = true;
						$scope.instantQuoteHealthForm = false;
						$rootScope.loading = true;
						$rootScope.quoteResultCount=0;
						//added for disable next button in product journey 
						//$rootScope.disableHealthNextScreen = true;
						$scope.quoteParam.dependent = [];
						$scope.quoteParam.preExistingDisease = [];
						$scope.personalInfo.selectedFamilyMembers = [];

						$scope.personalInfo.minHospitalisationLimit = $scope.hospitalisationLimit.minHosLimit;
						$scope.personalInfo.maxHospitalisationLimit = $scope.hospitalisationLimit.maxHosLimit;
						//$scope.personalInfo.hospitalisationLimitDisplayValue = $scope.hospitalisationLimit.displayValue;					
						$scope.quoteParam.childCount = 0;
						$scope.quoteParam.adultCount = 0;
						$scope.quoteParam.totalCount = 0;


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
								member.dob = $scope.familyList[i].dob;
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
						localStorageService.set("selectedBusinessLineId", 4);
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
						if (localStorageService.get("PROF_QUOTE_ID")) {
							$scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
						}

						// Google Analytics Tracker added.
						//analyticsTrackerSendData($scope.quote);
						var quoteUserInfo = localStorageService.get("quoteUserInfo");
						if (quoteUserInfo) {
							$scope.quote.mobileNumber = quoteUserInfo.mobileNumber;
						}
						if (campaignSource.utm_source) {
							$scope.quote.utm_source = campaignSource.utm_source;
						}
						if (campaignSource.utm_medium) {
							$scope.quote.utm_medium = campaignSource.utm_medium;
						}
						RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.quote).then(function (healthQuoteResult) {
							$rootScope.healthQuoteRequest = [];

							if (healthQuoteResult.responseCode == $scope.p365Labels.responseCode.success) {
								$scope.responseCodeList = [];

								$scope.requestId = healthQuoteResult.QUOTE_ID;
								localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.requestId);
								$scope.UNIQUE_QUOTE_ID_ENCRYPTED = healthQuoteResult.encryptedQuoteId;
								localStorageService.set("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
								console.log("$scope.UNIQUE_QUOTE_ID_ENCRYPTED",$scope.UNIQUE_QUOTE_ID_ENCRYPTED)

								$rootScope.healthQuoteRequest = healthQuoteResult.data;

								if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0) {
									$rootScope.healthQuoteResult.length = 0;
								}
								//for olark
								// olarkCustomParam(localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), true);
								$rootScope.healthQuoteResult = [];


								angular.forEach($rootScope.healthQuoteRequest, function (obj, i) {
									var request = {};
									var header = {};

									header.messageId = messageIDVar;
									header.campaignID = campaignIDVar;
									header.source = sourceOrigin;
									header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
									header.deviceId = deviceIdOrigin;
									
									if (campaignSource.utm_source) {
										obj.utm_source = campaignSource.utm_source;
									}
									if (campaignSource.utm_medium) {
										obj.utm_medium = campaignSource.utm_medium;
									}

									request.header = header;
									request.body = obj;

									$http({ method: 'POST', url: getQuoteCalcLink, data: request }).
										success(function (callback, status) {
											var healthQuoteResponse = JSON.parse(callback);
											$rootScope.quoteResultCount +=1;
											if (healthQuoteResponse.QUOTE_ID == $scope.requestId) {
												$scope.responseCodeList.push(healthQuoteResponse.responseCode);

												if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {

													for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
														if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
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
										$rootScope.loading = false;
									if ($scope.responseCodeList.length == $rootScope.healthQuoteRequest.length) {
										$rootScope.loading = false;

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
											//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
											//comments updated based on Uday
											$scope.errorMessage($sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedMedicalErrMsg));
										}
									}
								}, true);
							} else {
								$scope.responseCodeList = [];
								$rootScope.loading = false;
								if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0)
									$rootScope.healthQuoteResult.length = 0;

								$rootScope.healthQuoteResult = [];
								$scope.errorMessage(healthQuoteResult.message);
							}
						});
					}, 100);
				};


				// Below piece of code written to access function from outside controller.
				$scope.$on("callSingleClickHealthQuote", function () {
					$scope.singleClickHealthQuote();
				});

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
					// $scope.personalInfo.pincode = localStorageService.get("cityDataFromIP") ? (localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : $scope.personalInfo.pincode) : $scope.personalInfo.pincode;
					$scope.personalInfo.pincode = localStorageService.get("cityDataFromIP") ? (localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : $scope.personalInfo.pincode) : $scope.personalInfo.pincode;
					console.log('$rootScope.insuredGender::', $rootScope.insuredGender);
					//added for product journey
					if ($rootScope.insuredGender) {
						var selectedGender = $rootScope.insuredGender;
						console.log('selectedGender is:', selectedGender);
						if (selectedGender == 'Male') {
							$scope.quoteParam.selfGender = 'M';
						} else {
							$scope.quoteParam.selfGender = 'F';
						}
					}

					if ($rootScope.wordPressEnabled) {
						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.ratingParam = $scope.ratingParam;
						$scope.quote.personalInfo = $scope.personalInfo;
						$scope.quote.requestType = $scope.p365Labels.request.healthRequestType;
						localStorageService.set("healthQuoteInputParamaters", $scope.quote);
					}
					$scope.calcDefaultAreaDetails($scope.personalInfo.pincode);

				};

				if (healthQuoteCookie != null && String(healthQuoteCookie) !== "undefined") {

					$scope.quote = healthQuoteCookie;
					$scope.quoteParam = healthQuoteCookie.quoteParam;
					$scope.personalInfo = healthQuoteCookie.personalInfo;
					$scope.ratingParam = healthQuoteCookie.ratingParam;

					$scope.familyList = localStorageService.get("selectedFamilyForHealth");

					$scope.isDiseased = localStorageService.get("isDiseasedForHealth");
					$scope.selectedArea = localStorageService.get("selectedArea");
					if (localStorageService.get("selectedDisease")) {
						$scope.selectedDisease = localStorageService.get("selectedDisease");
					}

					$scope.selectedFamilyArray = localStorageService.get("selectedFamilyArray");
					$scope.diseaseList = localStorageService.get("diseaseList");

					if (!$rootScope.wordPressEnabled) {
						var item = localStorageService.get("commAddressDetails");
						$scope.modalPIN = false;
						$scope.selectedArea = item.area;
						$scope.personalInfo.pincode = item.pincode;
						$scope.personalInfo.displayArea = item.area + ", " + item.city;
						$scope.personalInfo.city = item.city;
						$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalInfo.displayArea;
					} else {
						$scope.displayPincodeInfo = $scope.personalInfo.pincode + " - " + $scope.personalInfo.displayArea;
					}
					/*	var item = localStorageService.get("commAddressDetails");
						$scope.modalPIN = false;
						$scope.selectedArea = item.area;
						$scope.personalInfo.pincode = item.pincode;
						$scope.personalInfo.displayArea = item.area + ", " + item.district;
						$scope.personalInfo.city = item.district;
						$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalInfo.displayArea;
						$scope.selectedFamilyArray = localStorageService.get("selectedFamilyArray");
						$scope.diseaseList = localStorageService.get("diseaseList");*/

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
					/*if($rootScope.wordPressEnabled){
						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.ratingParam = $scope.ratingParam;
						$scope.quote.personalInfo = healthQuoteCookie.personalInfo;
						$scope.selectedArea = localStorageService.get("selectedArea");
						$scope.quote.requestType = $scope.globalLabel.request.healthRequestType;
						localStorageService.set("healthQuoteInputParamaters", $scope.quote);
					}*/
					setTimeout(function () {
						if (!$rootScope.wordPressEnabled) {
							$scope.singleClickHealthQuote();
						}
					}, 100);
				} else {
					$scope.fetchDefaultInputParamaters(function () { });
				}
				if (localStorageService.get("healthQuoteInputParamaters")) {
					$scope.quote = localStorageService.get("healthQuoteInputParamaters");
					$scope.quoteParam = $scope.quote.quoteParam;
					$scope.personalInfo = localStorageService.get("healthQuoteInputParamaters").personalInfo;
				}

				console.log('$rootScope.insuredGender::', $rootScope.insuredGender);
				//added for product journey
				if ($rootScope.insuredGender) {
					var selectedGender = $rootScope.insuredGender;
					console.log('selectedGender is:', selectedGender);
					if (selectedGender == 'Male') {
						$scope.quoteParam.selfGender = 'M';
					} else {
						$scope.quoteParam.selfGender = 'F';
					}
				}
				console.log('$scope.quoteParam.selfGender :', $scope.quoteParam.selfGender);

				// if (localStorageService.get("professionalQuoteParams")) {
				// 	$scope.quoteRequest = localStorageService.get("professionalQuoteParams");

				// 	//    $scope.personalInfo.selectedFamilyMembers =[];
				// 	// 	if($scope.personalInfo.selectedFamilyMembers.length > 0){
				// 	// 		//$scope.personalInfo.selectedFamilyMembers.push($scope.healthInfo.selectedFamilyMembers);
				// 	// 	}		
				// 	if ($scope.quoteRequest.commonInfo) {
				// 		$scope.commonInfo = $scope.quoteRequest.commonInfo;
				// 		if ($scope.quoteParam.selfGender == 'M') {
				// 			$scope.commonInfo.gender = 'Male';
				// 		} else {
				// 			$scope.commonInfo.gender = 'Female';
				// 	}		

				// 		$scope.quote.personalInfo = $scope.personalInfo;
				// 		$scope.quote.quoteParam = $scope.quoteParam;
				// 		$scope.quoteRequest.commonInfo = $scope.commonInfo;

				// 		localStorageService.set("healthQuoteInputParamaters", $scope.quote);
				// 		localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
				// 	}
				// }
			});
		};

		if (!localStorageService.get("ridersHealthStatus")) {
			// To get the health rider list applicable for this user.
			getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.health, $scope.p365Labels.request.findAppConfig, function (addOnCoverForHealth) {
				localStorageService.set("addOnCoverForHealth", addOnCoverForHealth);
				localStorageService.set("ridersHealthStatus", true);
				//fetching disease list
				getListFromDB(RestAPI, "", "Disease", $scope.p365Labels.request.findAppConfig, function (callback) {
					if (callback.responseCode == $scope.p365Labels.responseCode.success) {
						var diseaseData = callback.data;

						for (var i = 0; i < diseaseData.length; i++)
							diseaseData[i].familyList = [];
						localStorageService.set("diseaseList", diseaseData);

						getListFromDB(RestAPI, "", $scope.p365Labels.documentType.hospitalizationLimit, $scope.p365Labels.request.findAppConfig, function (hospitalizationLimitList) {
							if (hospitalizationLimitList.responseCode == $scope.p365Labels.responseCode.success) {
								localStorageService.set("hospitalizationLimitList", hospitalizationLimitList.data);
								//for reset
								localStorageService.set("hospitalizationLimitListReset", hospitalizationLimitList.data);

							}
							if (localStorageService.get("selectedBusinessLineId")) {
								var selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
							} else {
								var selectedBusinessLineId = 4;
							}
							var docId = $scope.p365Labels.documentType.instantQuoteScreen + "-" + selectedBusinessLineId;
							// getDocUsingId(RestAPI, docId, function(tooltipContent){
							// 	localStorageService.set("healthInstantQuoteTooltipContent", tooltipContent.toolTips);
							// 	$rootScope.tooltipContent = tooltipContent.toolTips;
							// 	$scope.healthInstantQuoteCalculation(addOnCoverForHealth);
							// });
							//added here as health tooltip call removed
							$scope.healthInstantQuoteCalculation(addOnCoverForHealth);
						});
					} else {
						$rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
					}
				});
			});
		} else {

			//$rootScope.tooltipContent = localStorageService.get("healthInstantQuoteTooltipContent");
			$scope.healthInstantQuoteCalculation(localStorageService.get("addOnCoverForHealth"));
		}

		setTimeout(function () {
			$('.hiddenAge').each(function () {
				var hiddenVal = $(this).val();
				$(this).closest('span').find('.ageDropdown').val(hiddenVal);
			});
		}, 2000);
	}]);