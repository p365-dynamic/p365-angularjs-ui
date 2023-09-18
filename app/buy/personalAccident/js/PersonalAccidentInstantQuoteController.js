

'use strict';
angular.module('personalAccidentInstantQuote', ['CoreComponentApp', 'LocalStorageModule'])
.controller('personalAccidentInstantQuoteController', ['$scope', '$rootScope', '$window', '$location', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$http', '$sce', function($scope, $rootScope, $window, $location, $filter, RestAPI, localStorageService, $timeout, $interval, $http, $sce){

	// Setting application labels to avoid static assignment.	-	modification-0003
	
	var applicationLabels = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	$rootScope.loaderContent={businessLine:'8',header:'PA Insurance',desc:$sce.trustAsHtml($scope.globalLabel.applicationLabels.personalAccident.proverbInstantQuote)};
	
	if($location.path() == '/personalAccident'){
		//$rootScope.title = $scope.globalLabel.policies365Title.personalAccidentInstantQuoteLanding;
	}else{
		$rootScope.title = $scope.globalLabel.policies365Title.personalAccidentInstantQuote;
	}
	//$rootScope.carrierDetails = {};
	$scope.selectedFamilyArray = [];

	//$rootScope.GSTTag = false;
	$scope.familyList = personalAccidentFamilyListGeneric;
	$scope.occupationList=personalAccidentOccupationListGeneric;
	
//	if($rootScope.wordPressEnabled){
//		
//		$scope.instantQuotePersonalAccidentForm =false;
//	}else{
//		console.log('else');
//		$scope.instantQuotePersonalAccidentForm = true;
//	}
	//code for setting dob of person
	var DOBOption = {};
	DOBOption.changeMonth = true;
	DOBOption.changeYear = true;
	DOBOption.dateFormat = DATE_FORMAT;
	$scope.DOBOptions = setP365DatePickerProperties(DOBOption);
	
	var dateRange = {};
	
	var member;
	$scope.$watch(function(scope) { return scope.familyList; }, function(){ 
		$scope.selectedFamilyArray=[];
		for(var i=0;i<$scope.familyList.length;i++){
				if($scope.familyList[i].relationship == 'S'){
								dateRange.minimumYearLimit = "-99Y";
								dateRange.maximumYearLimit = "-18Y";
								dateRange.changeMonth = true;
								dateRange.changeYear = true;
								dateRange.dateFormat = DATE_FORMAT;
							
				}
				if($scope.familyList[i].val==true){
				member={};
				member.id = $scope.familyList[i].id;
				member.display = $scope.familyList[i].member;
				member.age=$scope.familyList[i].age;
				member.dob = $scope.familyList[i].dob;
				member.relation = $scope.familyList[i].relationship;
				$scope['DOBOptions' + i] = setP365DatePickerProperties(dateRange);
				member.existSince = "";
				member.existSinceError = false;
				member.status = false;
				
				$scope.selectedFamilyArray.push(member);
			}
		}
	},true);
	
	$scope.familyList.forEach(function(personalAccidentFamilyListGeneric){
		personalAccidentFamilyListGeneric.dob = calcDOBFromAge(personalAccidentFamilyListGeneric.age);
	});
	$scope.modalFamilyInfo = false;
	$scope.toggleFamilyInfo = function(){
		//if(!$scope.instantQuotePersonalAccidentForm){
			$scope.oldFamilyList = angular.copy($scope.familyList);
			$scope.modalFamilyInfo = !$scope.modalFamilyInfo;
		//}
		setTimeout(function(){
			$('.hiddenAge').each(function(){
				var hiddenVal=$(this).val();
				$(this).closest('span').find('.ageDropdown').val(hiddenVal);
			});
		},500);
	};

	$scope.submitFamily = function(){
		var submitFamilyForm = true;
		$scope.personalDetails.selFamilyMember = [];
		var familyCounter = 0;
		var familyMemberExistStatus = false;
		for(var i = 0; i < $scope.familyList.length; i++){
			if($scope.familyList[i].val == true){
				$scope.personalDetails.selFamilyMember.push($scope.familyList[i]);
				familyMemberExistStatus = true;
				familyCounter += 1;
			}
		}
		for(var i=0;i<$scope.personalDetails.selFamilyMember.length;i++){
			$scope.quoteParam.age = $scope.personalDetails.selFamilyMember[i].age;
			$scope.quoteParam.dob = $scope.personalDetails.selFamilyMember[i].dob;
			$scope.quoteParam.personType = $scope.personalDetails.selFamilyMember[i].member;
}
	

		if(familyMemberExistStatus){
			if(submitFamilyForm == true){
				$scope.modalFamilyInfo = false;			
			}	
		}else{
			//$scope.familyErrors.push("Please select atleast one member.");
		}
	};
	$scope.closeFamilyMemberModal = function(){
		$scope.familyList = $scope.oldFamilyList;
		$scope.modalFamilyInfo = false;
	};
	
	$scope.getAgeArray = function(minAge, maxAge){
		var ageArray = [];
		for(var i=0, j=minAge; j<=maxAge; i++,j++){
			ageArray.push(j);
		}
		return ageArray;   
	};
	$scope.validateAge = function(data,dob){
		var dateArr=dob.split("/");
		var newDOB=dateArr[1]+'/'+dateArr[0]+'/'+dateArr[2];
		data.age = calculateAgeByDOB(newDOB);
		//console.log('data.age ',data.age );
	}
	// Method to get list of pincodes
	$scope.getPinCodeAreaList = function(areaName){
		var docType;
		if(isNaN(areaName)){
			docType = "Area";
		}else{
			docType = "Pincode";
		}

		return $http.get(getServiceLink+docType+"&q="+areaName).then(function(response){
			return JSON.parse(response.data).data;
		});
	};
	$scope.calcDefaultAreaDetails = function(areaCode){
		$http.get(getServiceLink+"Pincode"+"&q="+areaCode).then(function(response){
			var areaDetails = JSON.parse(response.data);
			if(areaDetails.responseCode == $scope.globalLabel.responseCode.success){
				$scope.onSelectPinOrArea(areaDetails.data[0]);						
			}
		});
	};

	$scope.onSelectPinOrArea = function(item){
		$scope.modalPIN = false;
		$scope.selectedArea = item.area;
		$scope.personalDetails.pincode = item.pincode;
		$scope.personalDetails.displayArea = item.area + ", " + item.district;
		$scope.personalDetails.city = item.district;
		$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalDetails.displayArea;
		$scope.personalDetails.state = item.state;
		
		localStorageService.set("userGeoDetails", item);
		setTimeout(function(){
			if(!$rootScope.wordPressEnabled)
			$scope.singleClickPersonalAccidentQuote();
		},100);
	};

	$scope.modalPIN = false;
	$scope.togglePin = function(){
		//if(!$scope.instantQuotePersonalAccidentForm){
			$scope.modalPIN = !$scope.modalPIN;
			$scope.oldPincode = $scope.personalDetails.pincode;
			$scope.hideModal = function(){
				$scope.personalDetails.pincode = $scope.oldPincode;
				$scope.modalPIN = false;
			};
		//}
	};
	
	// $rootScope.loading = true;
	$rootScope.instantQuoteSummaryStatus = true;
	$rootScope.disableLandingLeadBtn=false;

		$scope.instantQuoteCalculation = function(){
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
										
				//logic written only when the user comes from campaign
				//if($location.path() =='/lifeLandingCampaign'){
				$rootScope.openRegPopup = function(){
					$rootScope.Regpopup = true;
				}
				$scope.closePop = function(){
					$rootScope.Regpopup = false;			
				}
	
				// Function created to set annual premium amount range.	-	modification-0008
				$scope.updateAnnualPremiumRange = function(minPremiumValue, maxPremiumValue){
					if(minPremiumValue > maxPremiumValue){
						$rootScope.minAnnualPremium = maxPremiumValue;
						$rootScope.maxAnnualPremium = minPremiumValue;
					}else{
						$rootScope.minAnnualPremium = minPremiumValue;
						$rootScope.maxAnnualPremium = maxPremiumValue;
					}
				}

//				$scope.calculateSumAssured = function(){
//					listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
//						$scope.quoteParam.sumInsured = selectedSumAssured.amount;
//						$scope.personalDetails.sumInsuredObject = selectedSumAssured;
//						// $scope.personalDetails.sumInsuredList = sumInsuredArray;
//						
//						var urlPattern = $location.path();
//						if(!$rootScope.wordPressEnabled  || urlPattern == "/personalAccident")
//						{
//							//console.log("step-3");
//							$scope.singleClickPersonalAccidentQuote();	
//						}	
//					});
//				}

				$scope.errorMessage = function(errorMsg){
					if((String($rootScope.paQuoteResult) == "undefined" || $rootScope.paQuoteResult.length == 0)){
						$scope.updateAnnualPremiumRange(1000, 5000);
						$rootScope.instantQuoteSummaryStatus = false;
						$rootScope.instantQuoteSummaryError = errorMsg;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuotePersonalAccidentForm = false;
					} else if($rootScope.paQuoteResult.length > 0){
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = false;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuotePersonalAccidentForm = false;
					}
					$rootScope.loading = false;
				}
				// Function created to set tool-tip content.	-	modification-0005
				$scope.tooltipPrepare = function(paResult){
					
					var resultCarrierId = [];
					var testCarrierId = [];
					for(var i = 0; i < paResult.length; i++){
						//push only net premium if greater than 0
							var carrierInfo = {};
							carrierInfo.id = paResult[i].carrierId;
							
							carrierInfo.name = paResult[i].insuranceCompany;
							carrierInfo.annualPremium = paResult[i].grossPremium;							
							carrierInfo.claimsRating = paResult[i].insurerIndex;
							if($rootScope.wordPressEnabled)
							{
							carrierInfo.sumInsured=paResult[i].sumInsured;
							carrierInfo.businessLineId="8";
							}
							if(p365Includes(testCarrierId,paResult[i].carrierId) == false){
							resultCarrierId.push(carrierInfo);
								testCarrierId.push(paResult[i].carrierId);
							}
								
							
					}
					
					$rootScope.resultCarrierId=resultCarrierId;
					
					$rootScope.quoteResultInsurerList =  "\n<ul style='text-align: left;' class='tickpoints'>";
					for(var i = 0; i < resultCarrierId.length; i++){
						$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
						
					}
					$rootScope.quoteResultInsurerList += "</ul>";

					
					$rootScope.calculatedQuotesLength = (String(paResult.length)).length == 2 ? String(paResult.length) : ("0" + String(paResult.length));
					setTimeout(function(){

						scrollv = new scrollable({
							wrapperid: "scrollable-v",
							moveby: 4,
							mousedrag: true
						})


					},2000)
				}

				$scope.processResult = function(){
					//for wordPress
					$rootScope.enabledProgressLoader=false;
					
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

					for(var j = 0; j < $rootScope.paQuoteResult.length; j++){
						var calculatedDiscAmt = 0;
						var discountAmtList = $rootScope.paQuoteResult[j].discountList;
						if(String(discountAmtList) != "undefined"){
							for(var i = 0; i < discountAmtList.length; i++){
								calculatedDiscAmt += discountAmtList[i].discountAmount;
							}
							calculatedDiscAmt += $rootScope.paQuoteResult[j].grossPremium;
							annualPremiumSliderArray.push(calculatedDiscAmt);
						}else{
							annualPremiumSliderArray.push($rootScope.paQuoteResult[j].grossPremium);
						}
					}

					annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
					$scope.updateAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);
					if(localStorageService.get("selectedBusinessLineId") == 8)
						$scope.tooltipPrepare($rootScope.paQuoteResult);
				}
				$scope.setPolicyStartDate=function(){
					if($scope.quoteParam.policyStartDate == "" | $scope.quoteParam.policyStartDate == undefined){
					var today=new Date();
					var dd=today.getDate(); 
					var mm=today.getMonth()+1;
					var yyyy=today.getFullYear();
					if(dd<10){
						dd='0'+dd;
					}if(mm<10){
						mm='0'+mm;
					}
					today=dd+'/'+mm+'/'+yyyy;
					$scope.quoteParam.policyStartDate=today;
					}
				}
				
				// Function created to get default input parameter from DB.	-	modification-0006
				$scope.singleClickPersonalAccidentQuote = function(){
					setTimeout(function(){
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = true;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = false;
						$scope.instantQuotePersonalAccidentForm = true;
						$rootScope.loading = true;
						localStorageService.set("selectedBusinessLineId",8);
						$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
						$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
						$scope.quoteParam.personType = relationLifeQuoteGeneric[0];
						
						
						
						
						//$scope.quoteParam.occupation=$scope.personalDetails.occupation;
						$scope.quoteParam.annualIncome=Number($scope.quoteParam.annualIncome);
						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.personalDetails=$scope.personalDetails;
						
						$scope.quote.requestType = $scope.globalLabel.request.personalAccidentRequestType;
							
						
						localStorageService.set("personalAccidentQuoteInputParamaters", $scope.quote);
						localStorageService.set("personalAccidentPersonalDetails", $scope.personalDetails);
						$scope.setPolicyStartDate();
						//analyticsTrackerSendData($scope.quote); //	-	modification-0004
						$scope.requestId = null;
						
						var quoteUserInfo = localStorageService.get("quoteUserInfo");
						if(quoteUserInfo){
							$scope.quote.mobileNumber = quoteUserInfo.mobileNumber;
						}
						
						RestAPI.invoke($scope.globalLabel.getRequest.quotePersonalAccident, $scope.quote).then(function(callback){
							$rootScope.paQuoteRequest = [];
							if(callback.responseCode == $scope.globalLabel.responseCode.success){
								$scope.responseCodeList = [];

								$scope.requestId = callback.QUOTE_ID;

								localStorageService.set("PERSONAL_ACCIDENT_UNIQUE_QUOTE_ID", $scope.requestId);
								$rootScope.paQuoteRequest = callback.data;
								if(String($scope.paQuoteResult) != "undefined" && $scope.paQuoteResult.length > 0){
									$scope.paQuoteResult.length = 0;
								}

							//for olark
								// olarkCustomParam(localStorageService.get("PERSONAL_ACCIDENT_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),true);
								$rootScope.paQuoteResult = [];

								angular.forEach($rootScope.paQuoteRequest, function(obj, i){
									var request = {};
									var header = {};

									header.messageId = messageIDVar;
									header.campaignID = campaignIDVar;
									header.source=sourceOrigin;
									header.deviceId = deviceIdOrigin;
									header.browser = browser.name+" V - "+browser.version ;
									header.transactionName = $scope.globalLabel.transactionName.personalAccidentQuoteResult;
									request.header = header;
									request.body = obj;

									$http({method: 'POST', url: getQuoteCalcLink, data: request}).
									success(function(callback, status){
										var paQuoteResponse = JSON.parse(callback);
										if(paQuoteResponse.QUOTE_ID == $scope.requestId){
											$scope.responseCodeList.push(paQuoteResponse.responseCode);
											
											if(paQuoteResponse.responseCode == $scope.globalLabel.responseCode.success){
												for(var i = 0; i < $rootScope.paQuoteRequest.length; i++){
													if($rootScope.paQuoteRequest[i].messageId == paQuoteResponse.messageId){
														paQuoteResponse.data.quotes[0].insuranceCompany = (paQuoteResponse.data.quotes[0].insuranceCompany);
														
														$rootScope.paQuoteResult.push(paQuoteResponse.data.quotes[0]);
														
														$rootScope.paQuoteRequest[i].status = 1;
													}
												}
												$scope.processResult();
											}
										}
									}).
									error(function(data, status){
										$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
									});
								});

								
								$scope.$watch('responseCodeList', function(newValue, oldValue, scope){
									//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
									if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.success))
										$rootScope.loading = false;

									if($scope.responseCodeList.length == $rootScope.paQuoteRequest.length){
										$rootScope.loading = false;
										//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
										if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.success)){
											// This condition will satisfy only when at least one product is found in the quoteResponse array.
											//} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
										} else if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.quoteNotAvailable)){
											$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
										}else{
											//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
											//comments updated based on Uday
											$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg));
										}
									}
								}, true);
							}else{
								$scope.responseCodeList = [];
//								if(String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0)
//									$scope.quoteResult.length = 0;

								if(String($rootScope.paQuoteResult) != "undefined" && $rootScope.paQuoteResult.length > 0)
									$rootScope.paQuoteResult.length = 0;

								$rootScope.paQuoteResult = [];
								$scope.errorMessage(callback.message);
							}
						});
					},100);	
				}
				
				//Below piece of code written to access function from outside controller.
				$scope.$on("callSingleClickPersonalAccidentQuote", function(){
					
					$scope.singleClickPersonalAccidentQuote();
				});


				$scope.calculatePersonalAccidentPremium = function(healthCondition)
				{	
					if(!$rootScope.wordPressEnabled)
					{	
						$scope.singleClickPersonalAccidentQuote();
					}
				}
				// Function created to pre-populate input fields. 
//				$scope.prePopulateFields = function(){
////					for(var i = 0; i < annualIncomesGeneric.length; i++){
////						if($scope.quoteParam.annualIncome == annualIncomesGeneric[i].annualIncome){
////							$scope.personalDetails.annualIncomeObject = annualIncomesGeneric[i];
////							break;
////						}
////					}
////					for(var i = 0; i < personalAccidentOccupationListGeneric.length; i++){
////						
////						if($scope.personalDetails.occupation == personalAccidentOccupationListGeneric[i].occupation){
////							$scope.personalDetails.occupation = personalAccidentOccupationListGeneric[i];
////							break;
////						}
////					}
////					
////					listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
////						$scope.quoteParam.sumInsured = selectedSumAssured.amount;
////						$scope.personalDetails.sumInsuredObject = selectedSumAssured;
////						// $scope.personalDetails.sumInsuredList = sumInsuredArray;
////					});
//
////					setTimeout(function(){
////						var urlPattern = $location.path();
////						if(!$rootScope.wordPressEnabled  || urlPattern == "/life" || urlPattern == "/childrmz" || urlPattern == "/pensionrmz" || urlPattern == "/mobilife" || urlPattern == "/childeid" ||  urlPattern == "/pensioneid" || urlPattern == "/childmonsoon" || urlPattern == "/pensionmonsoon" || urlPattern == "/lifemonsoon" || urlPattern == "/childindependence" || urlPattern == "/pensionindependence" || urlPattern == "/lifeindependence" || urlPattern == "/child-insurance" || urlPattern == "/pension-insurance" || urlPattern == "/life-insurance"){	
////							$scope.singleClickPersonalAccidentQuote();
////						}else {
////							$scope.instantQuotePersonalAccidentForm=false;
////						}
////					},100);
//				}

				// Function created to get default input parameter from DB.	-	modification-0007
				$scope.fetchDefaultInputParamaters = function(defaultQuoteStatus, defaultInputParamCallback){
					getDocUsingId(RestAPI, $scope.globalLabel.documentType.defaultPersonalAccidentQuoteParam, function(callback){
						if(defaultQuoteStatus){
							$scope.quoteParam = callback.quoteParam;
							$scope.personalDetails = callback.personalDetails;
							$scope.PremiumFrequencyList=callback.premiumFrequencyList;
							//for wordPress
							if($rootScope.wordPressEnabled){
								 $scope.quote={};
								 $scope.quote.personalDetails=$scope.personalDetails;
								 $scope.quote.quoteParam=$scope.quoteParam;
								 localStorageService.set("selectedBusinessLineId",8);
								 localStorageService.set("personalAccidentQuoteInputParamaters", $scope.quote);
								 localStorageService.set("personalAccidentPersonalDetails", $scope.personalDetails);
								 
							 }
						}else{														
							$scope.quoteParam = paQuoteCookie.quoteParam;
							$scope.personalDetails = personalDetailsCookie;				
						}
					
						$scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
						$scope.personalDetails.pincode = localStorageService.get("cityDataFromIP") ? (localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : $scope.personalDetails.pincode) : $scope.personalDetails.pincode;
						$scope.calcDefaultAreaDetails($scope.personalDetails.pincode);
//						$scope.prePopulateFields();
						
						$rootScope.loading = false;
						defaultInputParamCallback();
					});
				}

				// Below piece of code written to check whether paQuoteCookie is present or not. 
				if(paQuoteCookie != null && String(paQuoteCookie) !== "undefined"){
					
					$scope.quote = paQuoteCookie;
					$scope.quoteParam = paQuoteCookie.quoteParam;
					$scope.personalDetails =paQuoteCookie.personalDetails;
					
					if(!$rootScope.wordPressEnabled){
						var item = localStorageService.get("userGeoDetails");
						$scope.modalPIN = false;
						$scope.selectedArea = item.area;
						
						$scope.personalDetails.pincode = item.pincode;
						$scope.personalDetails.displayArea = item.area + ", " + item.district;
						$scope.personalDetails.city = item.district;
						$scope.displayPincodeInfo = item.pincode + " - " + $scope.personalDetails.displayArea;
					}else{
						$scope.displayPincodeInfo = $scope.personalDetails.pincode + " - " + $scope.personalDetails.displayArea;
					}
				$scope.fetchDefaultInputParamaters(false, function(){});
					
			}else{
					$scope.fetchDefaultInputParamaters(true, function(){});
			}

//			 });
		}
		
		
			$scope.showAmount = function(amount){
				if(amount>100000)
				return Math.round(amount/100000)
				else
				return 0;
			}
			$scope.checkSum = function(amount){

				if(amount < 500000 || amount == undefined || typeof(amount) == undefined   ){
					$rootScope.disableNextScreen = true;
					$scope.message = "Please enter the amount Greater Than 5 Lac ";
				}
				if(amount > 25000000)
				{	
					$rootScope.disableNextScreen = true;				
					$scope.message = "Please enter the amount Less than 2.5 Crore ";

				}
				if(amount > 500000 && amount <=20000000 )
				{
					$rootScope.disableNextScreen = false;
					$scope.message = "";
				}				

			}
		
			$rootScope.tooltipContent = localStorageService.get("personalAccidentInstantQuoteTooltipContent");
			$scope.instantQuoteCalculation();
		
}]);