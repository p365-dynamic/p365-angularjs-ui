

'use strict';
angular.module('homeInstantQuote', ['CoreComponentApp', 'LocalStorageModule'])
.controller('homeInstantQuoteController', ['$scope', '$rootScope', '$window', '$location', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$http', '$sce', function($scope, $rootScope, $window, $location, $filter, RestAPI, localStorageService, $timeout, $interval, $http, $sce){

	// Setting application labels to avoid static assignment.	-	modification-0003
	
	var applicationLabels = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	$rootScope.loaderContent={businessLine:'7',header:'Home Insurance',desc:$sce.trustAsHtml($scope.globalLabel.applicationLabels.home.proverbInstantQuote)};
	
	if($location.path() == '/home'){
		//console.log("location : ",$location.path());
		//$rootScope.title = $scope.globalLabel.policies365Title.homeInstantQuoteLanding;
	}else{
		$rootScope.title = $scope.globalLabel.policies365Title.homeInstantQuote;
	}
	$rootScope.carrierDetails = {};
	

	//$rootScope.GSTTag = false;
	
	if($rootScope.wordPressEnabled){
		$scope.instantQuoteHomeForm =false;
	}else{
		$scope.instantQuoteHomeForm = true;
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
			$scope.singleClickHomeQuote();
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

	// getDocUsingId(RestAPI, $scope.globalLabel.applicationLabels.criticalIllness.ridersDocInDB, function(carrierDetails){
		// $rootScope.carrierDetails = carrierDetails;
		$scope.instantQuoteCalculation = function(){
			// addRidersToDefaultQuote(addOnCoverForCriticalIllness, localStorageService.get("selectedBusinessLineId"), function(defaultRiderList, defaultRiderArrayObject){
			//console.log("in home instantquuotecal start");
				var homeQuoteCookie = localStorageService.get("homeQuoteInputParamaters");
				//console.log("homeQuoteCookie",homeQuoteCookie);
				var personalDetailsCookie = localStorageService.get("homePersonalDetails");
	
				
				$scope.quote = {};
				$scope.quoteParam = {};
				$scope.personalDetails = {};
               
				$scope.typeOfHome=homeTypeGeneric;
				//console.log($scope.typeOfHome);
				$scope.sumamount = 20;			
				$rootScope.viewOptionDisabled = true;
				$rootScope.tabSelectionStatus = true;
				$scope.instantQuoteHomeForm = true;
				
										
				//logic written only when the user comes from campaign
				//if($location.path() =='/lifeLandingCampaign'){
				$rootScope.openRegPopup = function(){
					$rootScope.Regpopup = true;
				}
				$scope.closePop = function(){
					$rootScope.Regpopup = false;			
				}
				//}
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

				$scope.calculatePropertyAge=function(){
					var urlPattern = $location.path();
					if(!$rootScope.wordPressEnabled  || urlPattern == "/home")
					{
						$scope.singleClickHomeQuote();	
					}	
				}
//				$scope.calculateSumAssured = function(){
//					listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
//						$scope.quoteParam.sumInsured = selectedSumAssured.amount;
//						$scope.personalDetails.sumInsuredObject = selectedSumAssured;
//						// $scope.personalDetails.sumInsuredList = sumInsuredArray;
//						
//						var urlPattern = $location.path();
//						if(!$rootScope.wordPressEnabled  || urlPattern == "/home")
//						{
//							//console.log("step-3");
//							$scope.singleClickHomeQuote();	
//						}	
//					});
//				}

				$scope.errorMessage = function(errorMsg){
					if((String($rootScope.homeQuoteResult) == "undefined" || $rootScope.homeQuoteResult.length == 0)){
						$scope.updateAnnualPremiumRange(1000, 5000);
						$rootScope.instantQuoteSummaryStatus = false;
						$rootScope.instantQuoteSummaryError = errorMsg;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteHomeForm = false;
					} else if($rootScope.homeQuoteResult.length > 0){
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = false;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteHomeForm = false;
					}
					$rootScope.loading = false;
				}
				// Function created to set tool-tip content.	-	modification-0005
				$scope.tooltipPrepare = function(homeResult){
					
					var resultCarrierId = [];
					var testCarrierId = [];
					for(var i = 0; i < homeResult.length; i++){
						//push only net premium if greater than 0
							var carrierInfo = {};
							carrierInfo.id = homeResult[i].carrierId;
							
							carrierInfo.name = homeResult[i].insuranceCompany;
							carrierInfo.annualPremium = homeResult[i].grossPremium;
							//carrierInfo.annualPremium = ciResult[i].monthlyFinalPremium;
							//carrierInfo.isMonthlyPremium = false;
							
							carrierInfo.claimsRating = homeResult[i].insurerIndex;
							if($rootScope.wordPressEnabled)
							{
							carrierInfo.sumInsured=homeResult[i].structureSumInsured;
							carrierInfo.businessLineId="7";
							}
							if(p365Includes(testCarrierId,homeResult[i].carrierId) == false){
							
						
							resultCarrierId.push(carrierInfo);
								testCarrierId.push(homeResult[i].carrierId);
							}
								
							
					}
					
					$rootScope.resultCarrierId=resultCarrierId;
					//console.log('$rootScope.resultCarrierId',$rootScope.resultCarrierId);
					
					$rootScope.quoteResultInsurerList =  "\n<ul style='text-align: left;' class='tickpoints'>";
					for(var i = 0; i < resultCarrierId.length; i++){
						$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
						
					}
					$rootScope.quoteResultInsurerList += "</ul>";

					
					$rootScope.calculatedQuotesLength = (String(homeResult.length)).length == 2 ? String(homeResult.length) : ("0" + String(homeResult.length));
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
					$scope.instantQuoteHomeForm = false;
					$rootScope.loading = false;
					//for campaign
					$rootScope.campaignFlag = true;
//					console.log('$rootScope.paQuoteResult'+JSON.stringify($rootScope.paQuoteResult));
					$rootScope.homeQuoteResult = $filter('orderBy')($rootScope.homeQuoteResult, 'grossPremium');
				
					var minAnnualPremiumValue = $rootScope.homeQuoteResult[0].grossPremium;
					var annualPremiumSliderArray = [];

					for(var j = 0; j < $rootScope.homeQuoteResult.length; j++){
						var calculatedDiscAmt = 0;
						var discountAmtList = $rootScope.homeQuoteResult[j].discountList;
						if(String(discountAmtList) != "undefined"){
							for(var i = 0; i < discountAmtList.length; i++){
								calculatedDiscAmt += discountAmtList[i].discountAmount;
							}
							calculatedDiscAmt += $rootScope.homeQuoteResult[j].grossPremium;
							annualPremiumSliderArray.push(calculatedDiscAmt);
						}else{
							annualPremiumSliderArray.push($rootScope.homeQuoteResult[j].grossPremium);
						}
					}

					annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
					$scope.updateAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);
					if(localStorageService.get("selectedBusinessLineId") == 7)
						$scope.tooltipPrepare($rootScope.homeQuoteResult);
				}

				// Function created to get default input parameter from DB.	-	modification-0006
				$scope.singleClickHomeQuote = function(){
					//console.log("in .singleClickHomeQuote");
					setTimeout(function(){
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = true;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = false;
						$scope.instantQuoteHomeForm = true;
						$rootScope.loading = true;
						localStorageService.set("selectedBusinessLineId",7);
						$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
						$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
						$scope.quoteParam.personType = relationLifeQuoteGeneric[0];
					  if($scope.quoteParam.homeType === "Owned")
					  {
						$scope.quoteParam.structureSumInsured=Number($scope.quoteParam.structureSumInsured);
					  }
					  else {
						$scope.quoteParam.structureSumInsured=0;
					  }
						
						$scope.quoteParam.contentSumInsured	=Number($scope.quoteParam.contentSumInsured);
						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.personalDetails=$scope.personalDetails;
						
						$scope.quote.requestType = $scope.globalLabel.request.homeRequestType;
							
						
						localStorageService.set("homeQuoteInputParamaters", $scope.quote);
						localStorageService.set("homePersonalDetails", $scope.personalDetails);
						
						//analyticsTrackerSendData($scope.quote); //	-	modification-0004
						$scope.requestId = null;
						
						
						RestAPI.invoke($scope.globalLabel.getRequest.quoteHome, $scope.quote).then(function(callback){
							console.log("in restapi home");
							$rootScope.homeQuoteRequest = [];
							if(callback.responseCode == $scope.globalLabel.responseCode.success){
								$scope.responseCodeList = [];

								$scope.requestId = callback.QUOTE_ID;

								localStorageService.set("HOME_UNIQUE_QUOTE_ID", $scope.requestId);
								$rootScope.homeQuoteRequest = callback.data;
								//console.log('$rootScope.paQuoteRequest'+JSON.stringify($rootScope.paQuoteRequest));
								if(String($scope.homeQuoteResult) != "undefined" && $scope.homeQuoteResult.length > 0){
									$scope.homeQuoteResult.length = 0;
								}

//								if(String($rootScope.paQuoteResult) != "undefined" && $rootScope.paQuoteResult.length > 0){
//									$rootScope.paQuoteResult.length = 0;
//								}
								//for olark
								// olarkCustomParam(localStorageService.get("HOME_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),true);
								$rootScope.homeQuoteResult = [];

								angular.forEach($rootScope.homeQuoteRequest, function(obj, i){
									var request = {};
									var header = {};

									header.messageId = messageIDVar;
									header.campaignID = campaignIDVar;
									header.source=sourceOrigin;
									header.deviceId = deviceIdOrigin;
									header.browser = browser.name+" V - "+browser.version ;
									header.transactionName = $scope.globalLabel.transactionName.homeQuoteResult;
									request.header = header;
									request.body = obj;

									$http({method: 'POST', url: getQuoteCalcLink, data: request}).
									success(function(callback, status){
										//console.log('callback'+JSON.stringify(callback));
										var homeQuoteResponse = JSON.parse(callback);
										if(homeQuoteResponse.QUOTE_ID == $scope.requestId){
											$scope.responseCodeList.push(homeQuoteResponse.responseCode);
											
											if(homeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success){
												for(var i = 0; i < $rootScope.homeQuoteRequest.length; i++){
													if($rootScope.homeQuoteRequest[i].messageId == homeQuoteResponse.messageId){
//														paQuoteResponse.data.quotes[0].grossPremium = Math.round(paQuoteResponse.data.quotes[0].annualPremium / 365);
														homeQuoteResponse.data.quotes[0].insuranceCompany = (homeQuoteResponse.data.quotes[0].insuranceCompany);
														
														$rootScope.homeQuoteResult.push(homeQuoteResponse.data.quotes[0]);
														
														$rootScope.homeQuoteRequest[i].status = 1;
													}
												}
												//console.log('$rootScope.paQuoteResult'+JSON.stringify($rootScope.paQuoteResult));
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

									if($scope.responseCodeList.length == $rootScope.homeQuoteRequest.length){
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

								if(String($rootScope.homeQuoteResult) != "undefined" && $rootScope.homeQuoteResult.length > 0)
									$rootScope.homeQuoteResult.length = 0;

								$rootScope.homeQuoteResult = [];
								$scope.errorMessage(callback.message);
							}
						});
					},100);	
				}
				
				//Below piece of code written to access function from outside controller.
				$scope.$on("callSingleClickHomeQuote", function(){
					//console.log("step-1");
					//console.log("in callSingleClickHomeQuote func");
					$scope.singleClickHomeQuote();
				});


				$scope.calculateHomePremium = function()
				{	

					if(!$rootScope.wordPressEnabled)
					{	
						//console.log("in ng change func in if");
						$scope.singleClickHomeQuote();

					}
					//console.log("selected value is : ",$scope.quoteParam.homeType);
					//console.log("in ng change func outside if");
					
				}
				// Function created to pre-populate input fields. 
				$scope.prePopulateFields = function(){
//					for(var i = 0; i < propertyAgeGeneric.length; i++){
//						console.log('propertyAgeGeneric.length',propertyAgeGeneric.length);
//						console.log('$scope.quoteParam.propertyAge',$scope.quoteParam.propertyAge);
//						if($scope.quoteParam.propertyAge == propertyAgeGeneric[i].propertyAge){
//							$scope.personalDetails.propertyAgeObject = propertyAgeGeneric[i];
//							console.log('$scope.personalDetails.propertyAgeObject',$scope.personalDetails.propertyAgeObject);
//							break;
//						}
//					}
				}	
//					listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
//						$scope.quoteParam.sumInsured = selectedSumAssured.amount;
//						$scope.personalDetails.sumInsuredObject = selectedSumAssured;
//						// $scope.personalDetails.sumInsuredList = sumInsuredArray;
//					});

/*getDocUsingId(RestAPI, $scope.globalLabel.documentType.defaultHomeQuoteParam, function(callback){
console.log("callback",callback);
});*/
				// Function created to get default input parameter from DB.	-	modification-0007
				$scope.fetchDefaultInputParamaters = function(defaultQuoteStatus, defaultInputParamCallback){

					getDocUsingId(RestAPI, $scope.globalLabel.documentType.defaultHomeQuoteParam, function(callback){
						
						if(defaultQuoteStatus){
							$scope.quoteParam = callback.quoteParam;
							$scope.personalDetails = callback.personalDetails;
							//$scope.PremiumFrequencyList=callback.premiumFrequencyList;
							//for wordPress
							if($rootScope.wordPressEnabled){
								 $scope.quote={};
								 $scope.quote.personalDetails=$scope.personalDetails;
								 $scope.quote.quoteParam=$scope.quoteParam;
								 localStorageService.set("selectedBusinessLineId",7);
								 localStorageService.set("homeQuoteInputParamaters", $scope.quote);
								 localStorageService.set("homePersonalDetails", $scope.personalDetails);
								 
							 }
						}else{														
							$scope.quoteParam = homeQuoteCookie.quoteParam;
							$scope.personalDetails = personalDetailsCookie;				
						}
					
						$scope.personalDetails.pincode = localStorageService.get("cityDataFromIP") ? (localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : $scope.personalDetails.pincode) : $scope.personalDetails.pincode;
						$scope.calcDefaultAreaDetails($scope.personalDetails.pincode);
						$scope.prePopulateFields();
						
						$rootScope.loading = false;
						defaultInputParamCallback();
					});
					//console.log("in fetch default end");
				}

				// Below piece of code written to check whether paQuoteCookie is present or not. 
				if(homeQuoteCookie != null && String(homeQuoteCookie) !== "undefined"){
					
					$scope.quote = homeQuoteCookie;
					$scope.quoteParam = homeQuoteCookie.quoteParam;
					$scope.personalDetails =homeQuoteCookie.personalDetails;
					
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
//console.log("in instant quote cal end");
		}
		
		
			$scope.showAmount = function(amount){
				if(amount>100000)
				return Math.round(amount/100000)
				else
				return 0;
			}
			$scope.checkSum = function(amount){

				if(amount < 100000 || amount == undefined || typeof(amount) == undefined   ){
					$rootScope.disableNextScreen = true;
					$scope.message = "Please enter the amount Greater than or equal to 1 Lac ";
				}
				if(amount > 500000000)
				{	
					$rootScope.disableNextScreen = true;				
					$scope.message = "Please enter the amount Less than 5 Crore ";

				}
				if(amount > 100000 && amount <=2000000000 )
				{
					$rootScope.disableNextScreen = false;
					$scope.message = "";
				}				

			}
			$scope.showContentAmount = function(amount){
				if(amount>100000)
				return Math.round(amount/100000)
				else
				return 0;
			}
			$scope.checkContentSum = function(amount){
				
				if(amount < 100000 || amount == undefined || typeof(amount) == undefined   ){
					$rootScope.disableNextScreen = true;
					$scope.message = "Please enter the amount Greater than or equal to 1 Lac ";
				}
				if(amount > 500000000)
				{	
					$rootScope.disableNextScreen = true;				
					$scope.message = "Please enter the amount Less than 5 Crore ";

				}
				if(amount > 100000 && amount <=2000000000 )
				{
					$rootScope.disableNextScreen = false;
					$scope.message = "";
				}				

			}
			$scope.showPropertyAge =function(age){
				if(age >= 1)
					return age;
			}
			
			$scope.checkPropertyAge = function(age){
			if(age <= 1 || age == undefined || typeof(age) == undefined){
				$rootScope.disableNextScreen =true;
				$scope.message ="Please enter the property age greater than or equal to 1 year";
			}
			if(age > 40){
				$rootScope.disableNextScreen = true;				
				$scope.message = "Please enter the property age less than 40 years ";

			}
			if(age >= 1 && age <=40){
				$rootScope.disableNextScreen = false;
				$scope.message = "";
			}				
			
		}
			$rootScope.tooltipContent = localStorageService.get("homeInstantQuoteTooltipContent");
			$scope.instantQuoteCalculation();
		
}]);