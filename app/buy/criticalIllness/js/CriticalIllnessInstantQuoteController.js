

'use strict';
angular.module('criticalIllnessInstantQuote', ['CoreComponentApp', 'LocalStorageModule'])
.controller('criticalIllnessInstantQuoteController', ['$scope', '$rootScope', '$window', '$location', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$http', '$sce', function($scope, $rootScope, $window, $location, $filter, RestAPI, localStorageService, $timeout, $interval, $http, $sce){

	// Setting application labels to avoid static assignment.	-	modification-0003
	
	var applicationLabels = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	$rootScope.loaderContent={businessLine:'6',header:'CI Insurance',desc:$sce.trustAsHtml($scope.globalLabel.applicationLabels.criticalIllness.proverbInstantQuote)};
	if($location.path() == '/criticalIllness'){
		$rootScope.title = $scope.globalLabel.policies365Title.criticalIllnessInstantQuoteLanding;
	}else{
		$rootScope.title = $scope.globalLabel.policies365Title.criticalIllnessInstantQuote;
	}
	$rootScope.carrierDetails = {};
	$rootScope.GSTTag = false;
	
	// $rootScope.loading = true;
	$rootScope.instantQuoteSummaryStatus = true;
	$rootScope.disableLandingLeadBtn=false;

	// getDocUsingId(RestAPI, $scope.globalLabel.applicationLabels.criticalIllness.ridersDocInDB, function(carrierDetails){
		// $rootScope.carrierDetails = carrierDetails;
		$scope.instantQuoteCalculation = function(){
			// addRidersToDefaultQuote(addOnCoverForCriticalIllness, localStorageService.get("selectedBusinessLineId"), function(defaultRiderList, defaultRiderArrayObject){

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

				$scope.calculateSumAssured = function(){
					listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
						$scope.quoteParam.sumInsured = selectedSumAssured.amount;
						$scope.personalDetails.sumInsuredObject = selectedSumAssured;
						// $scope.personalDetails.sumInsuredList = sumInsuredArray;
						
						var urlPattern = $location.path();
						if(!$rootScope.wordPressEnabled  || urlPattern == "/criticalIllness")
						{
							$scope.singleClickCriticalIllnessQuote();	
						}	
					});
				}

				$scope.errorMessage = function(errorMsg){
					if((String($rootScope.ciQuoteResult) == "undefined" || $rootScope.ciQuoteResult.length == 0)){
						$scope.updateAnnualPremiumRange(1000, 5000);
						$rootScope.instantQuoteSummaryStatus = false;
						$rootScope.instantQuoteSummaryError = errorMsg;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteCriticalIllnessForm = false;
					} else if($rootScope.ciQuoteResult.length > 0){
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = false;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteCriticalIllnessForm = false;
					}
					$rootScope.loading = false;
				}

				// Function created to set tool-tip content.	-	modification-0005
				$scope.tooltipPrepare = function(ciResult){
					
					var resultCarrierId = [];
					var testCarrierId = [];
					for(var i = 0; i < ciResult.length; i++){
						//push only net premium if greater than 0
							var carrierInfo = {};
							carrierInfo.id = ciResult[i].carrierId;
							carrierInfo.name = ciResult[i].insuranceCompany;
							carrierInfo.annualPremium = ciResult[i].annualPremium;
							//carrierInfo.annualPremium = ciResult[i].monthlyFinalPremium;
							carrierInfo.isMonthlyPremium = false;
							carrierInfo.claimsRating = ciResult[i].insurerIndex;
							if($rootScope.wordPressEnabled)
							{
							carrierInfo.sumInsured=ciResult[i].sumInsured;
							carrierInfo.businessLineId="6";
							}
							
							if(p365Includes(testCarrierId,ciResult[i].carrierId) == false){
								resultCarrierId.push(carrierInfo);
								testCarrierId.push(ciResult[i].carrierId);
							}
					}
					
					$rootScope.resultCarrierId=resultCarrierId;

					
					$rootScope.quoteResultInsurerList =  "\n<ul style='text-align: left;' class='tickpoints'>";
					for(var i = 0; i < resultCarrierId.length; i++){
						$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
					}
					$rootScope.quoteResultInsurerList += "</ul>";

					
					$rootScope.calculatedQuotesLength = (String(ciResult.length)).length == 2 ? String(ciResult.length) : ("0" + String(ciResult.length));
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
					$scope.instantQuoteCriticalIllnessForm = false;
					$rootScope.loading = false;
					//for campaign
					$rootScope.campaignFlag = true;
					$rootScope.ciQuoteResult = $filter('orderBy')($rootScope.ciQuoteResult, 'dailyPremium');
					var minDailyPremiumValue = $rootScope.ciQuoteResult[0].dailyPremium;
					var dailyPremiumSliderArray = [];

					for(var j = 0; j < $rootScope.ciQuoteResult.length; j++){
						var calculatedDiscAmt = 0;
						var discountAmtList = $rootScope.ciQuoteResult[j].discountList;
						if(String(discountAmtList) != "undefined"){
							for(var i = 0; i < discountAmtList.length; i++){
								calculatedDiscAmt += discountAmtList[i].discountAmount;
							}
							calculatedDiscAmt += $rootScope.ciQuoteResult[j].dailyPremium;
							dailyPremiumSliderArray.push(calculatedDiscAmt);
						}else{
							dailyPremiumSliderArray.push($rootScope.ciQuoteResult[j].dailyPremium);
						}
					}

					dailyPremiumSliderArray = $filter('orderBy')(dailyPremiumSliderArray);
					$scope.updateAnnualPremiumRange(minDailyPremiumValue, dailyPremiumSliderArray[dailyPremiumSliderArray.length - 1]);
					if(localStorageService.get("selectedBusinessLineId") == 6)
						$scope.tooltipPrepare($rootScope.ciQuoteResult);
				}

				// Function created to get default input parameter from DB.	-	modification-0006
				$scope.singleClickCriticalIllnessQuote = function(){
					setTimeout(function(){
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = true;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = false;
						$scope.instantQuoteCriticalIllnessForm = true;
						$rootScope.loading = true;
						localStorageService.set("selectedBusinessLineId",6);
						$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
						$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
						$scope.quoteParam.personType = relationLifeQuoteGeneric[0];
						$scope.quoteParam.payoutId = $scope.payoutOptions[0].id;
						$scope.quoteParam.annualIncome = $scope.personalDetails.annualIncomeObject.annualIncome;
						$scope.quoteParam.annualIncomeInterval = $scope.personalDetails.annualIncomeObject.annualIncomeInterval;
						$scope.quoteParam.sumInsured = (Math.round(parseInt($scope.personalDetails.sumInsuredAmount)/10000)*10000);
						
						// Yogesh-12072017: Based on discussion with uday, Maturity age constant value changes from 70 to 50 and value of policy term at least have 5 year. 
						//maturity age difference as 40 - uday
						if($scope.quoteParam.age > 35){
							//$scope.personalDetails.maturityAge = maturityAgeConstant;
							var policyTerm = 20;
							// maturityAgeConstant - $scope.quoteParam.age
						}else{
							var policyTerm = 20;
						}
						//var policyTerm = maturityAgeConstant - $scope.quoteParam.age;
						if(policyTerm < $scope.personalDetails.minPolicyTermLimit){
							$scope.quoteParam.policyTerm = $scope.personalDetails.minPolicyTermLimit;
						}else{
							$scope.quoteParam.policyTerm = policyTerm;
						}

						$scope.personalDetails.minMaturityAge = $scope.quoteParam.age + 5;
						$scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);

						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.personalDetails=$scope.personalDetails;
						$scope.quote.requestType = $scope.globalLabel.request.criticalIllnessRequestType;
							
						
						localStorageService.set("criticalIllnessQuoteInputParamaters", $scope.quote);
						localStorageService.set("criticalIllnessPersonalDetails", $scope.personalDetails);
						
						//analyticsTrackerSendData($scope.quote); //	-	modification-0004
						$scope.requestId = null;
						
						var quoteUserInfo = localStorageService.get("quoteUserInfo");
						if(quoteUserInfo){
							$scope.quote.mobileNumber = quoteUserInfo.mobileNumber;
						}
						RestAPI.invoke($scope.globalLabel.getRequest.quoteCriticalIllness, $scope.quote).then(function(callback){
							$rootScope.ciQuoteRequest = [];

							if(callback.responseCode == $scope.globalLabel.responseCode.success){
								$scope.responseCodeList = [];

								$scope.requestId = callback.QUOTE_ID;

								localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID", $scope.requestId);
								$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
								localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
								
								$rootScope.ciQuoteRequest = callback.data;

								if(String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0){
									$scope.quoteResult.length = 0;
								}

								if(String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0){
									$rootScope.ciQuoteResult.length = 0;
								}
								//for olark
								// olarkCustomParam(localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),true);
								$rootScope.ciQuoteResult = [];

								angular.forEach($rootScope.ciQuoteRequest, function(obj, i){
									var request = {};
									var header = {};

									header.messageId = messageIDVar;
									header.campaignID = campaignIDVar;
									header.source=sourceOrigin;
									header.deviceId = deviceIdOrigin;
									header.browser = browser.name+" V - "+browser.version ;
									header.transactionName = $scope.globalLabel.transactionName.criticalIllnessQuoteResult;
									request.header = header;
									request.body = obj;

									$http({method: 'POST', url: getQuoteCalcLink, data: request}).
									success(function(callback, status){
										var ciQuoteResponse = JSON.parse(callback);
										if(ciQuoteResponse.QUOTE_ID == $scope.requestId){
											$scope.responseCodeList.push(ciQuoteResponse.responseCode);
											
											if(ciQuoteResponse.responseCode == $scope.globalLabel.responseCode.success){
												for(var i = 0; i < $rootScope.ciQuoteRequest.length; i++){
													if($rootScope.ciQuoteRequest[i].messageId == ciQuoteResponse.messageId){
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
									error(function(data, status){
										$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
									});
								});

								
								$scope.$watch('responseCodeList', function(newValue, oldValue, scope){
									//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
									if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.success))
										$rootScope.loading = false;

									if($scope.responseCodeList.length == $rootScope.ciQuoteRequest.length){
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
								if(String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0)
									$scope.quoteResult.length = 0;

								if(String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0)
									$rootScope.ciQuoteResult.length = 0;

								$rootScope.ciQuoteResult = [];
								$scope.errorMessage(callback.message);
							}
						});
					},100);	
				}
				
				//Below piece of code written to access function from outside controller.
				$scope.$on("callSingleClickCriticalIllnessQuote", function(){
					$scope.singleClickCriticalIllnessQuote();
				});


				$scope.calculateCriticalIllnessPremium = function(healthCondition)
				{	
					if(!$rootScope.wordPressEnabled)
					{	
						$scope.singleClickCriticalIllnessQuote();
					}
				}
				// Function created to pre-populate input fields. 
				$scope.prePopulateFields = function(){
					for(var i = 0; i < annualIncomesGeneric.length; i++){
						if($scope.quoteParam.annualIncome == annualIncomesGeneric[i].annualIncome){
							$scope.personalDetails.annualIncomeObject = annualIncomesGeneric[i];
							break;
						}
					}
					
					listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
						$scope.quoteParam.sumInsured = selectedSumAssured.amount;
						$scope.personalDetails.sumInsuredObject = selectedSumAssured;
						// $scope.personalDetails.sumInsuredList = sumInsuredArray;
					});

					setTimeout(function(){
						var urlPattern = $location.path();
						if(!$rootScope.wordPressEnabled  || urlPattern == "/life" || urlPattern == "/childrmz" || urlPattern == "/pensionrmz" || urlPattern == "/mobilife" || urlPattern == "/childeid" ||  urlPattern == "/pensioneid" || urlPattern == "/childmonsoon" || urlPattern == "/pensionmonsoon" || urlPattern == "/lifemonsoon" || urlPattern == "/childindependence" || urlPattern == "/pensionindependence" || urlPattern == "/lifeindependence" || urlPattern == "/child-insurance" || urlPattern == "/pension-insurance" || urlPattern == "/life-insurance"){	
							$scope.singleClickCriticalIllnessQuote();
						}else {
							$scope.instantQuoteCriticalIllnessForm=false;
						}
					},100);
				}

				// Function created to get default input parameter from DB.	-	modification-0007
				$scope.fetchDefaultInputParamaters = function(defaultQuoteStatus, defaultInputParamCallback){
				
						if(defaultQuoteStatus){
							$scope.quoteParam = defaultCriticalIllnessQuoteParam.quoteParam;
							$scope.personalDetails = defaultCriticalIllnessQuoteParam.personalDetails;
							//console.log('$scope.personalDetails',$scope.personalDetails.sumInsured);
							$scope.PremiumFrequencyList=defaultCriticalIllnessQuoteParam.premiumFrequencyList;
							//for wordPress
							if($rootScope.wordPressEnabled){
								 $scope.quote={};
								 $scope.quote.personalDetails=$scope.personalDetails;
								 $scope.quote.quoteParam=$scope.quoteParam;
								 localStorageService.set("selectedBusinessLineId",6);
								 localStorageService.set("criticalIllnessQuoteInputParamaters", $scope.quote);
								 localStorageService.set("criticalIllnessPersonalDetails", $scope.personalDetails);								 
								 localStorageService.set("premiumFrequencyList",$scope.PremiumFrequencyList);
							 }
						}else{														
							$scope.quoteParam = ciQuoteCookie.quoteParam;
							$scope.personalDetails = personalDetailsCookie;
							$scope.PremiumFrequencyList=premiumFrequencyListCookie;
							$scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
							$scope.personalDetails.selectedAddOnCovers = makeObjectEmpty($scope.quoteParam.riders, "array");
						}
					
						$scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
						$scope.prePopulateFields();
						$rootScope.loading = false;
						defaultInputParamCallback();
				
				}

				// Below piece of code written to check whether ciQuoteCookie is present or not. 
				if(ciQuoteCookie != null && String(ciQuoteCookie) !== "undefined"){
					$scope.fetchDefaultInputParamaters(false, function(){});
				}else{
					$scope.fetchDefaultInputParamaters(true, function(){});
				}

			// });
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
			 
		


	
		// if(!localStorageService.get("ridersCriticalIllnessStatus")){
		// 	// To get the life rider list applicable for this user.
		// 	// getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.criticalIllness, $scope.globalLabel.request.findAppConfig, function(addOnCoverForCriticlalIllness){
		// 		console.log('callback3',addOnCoverForLife)
		// 		localStorageService.set("addOnCoverForCriticalIllness", addOnCoverForCriticlalIllness);
		// 		localStorageService.set("ridersLifeStatus", true);
		// 		var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
		// 		getDocUsingId(RestAPI, docId, function(tooltipContent){
		// 			console.log('callback4',tooltipContent);
		// 			localStorageService.set("criticalIllnessInstantQuoteTooltipContent", tooltipContent.toolTips);
		// 			$rootScope.tooltipContent = tooltipContent.toolTips;
		// 			$scope.instantQuoteCalculation(addOnCoverForCriticlalIllness);
		// 		// });
		// 	});
		// }else{
			$rootScope.tooltipContent = localStorageService.get("criticalIllnessInstantQuoteTooltipContent");
			$scope.instantQuoteCalculation();
		// }

	// });
	// Function created to get Product Features and update Quote Result Object Initially - modification-0009
	// function getAllProductFeatures(selectedProduct, productFetchStatus)
	// {
	// 	var variableReplaceArray = [];
	// 	var productFeatureJSON = {};
	// 	var customFeaturesJSON = {};
		
	// 	$rootScope.consolidatedBenefitsList = [];
	// 	$rootScope.consolidatedSavingsList = [];
	// 	$rootScope.consolidatedFlexibilityList = [];
		
		
	// 	productFeatureJSON.documentType = $scope.globalLabel.documentType.criticalIllnessProduct;
	// 	productFeatureJSON.carrierId = selectedProduct.carrierId;
	// 	productFeatureJSON.productId = selectedProduct.productId;
	// 	productFeatureJSON.businessLineId = 1;
		
	// 	var selectedCarrierId = selectedProduct.carrierId;
	// 	var selectedProductId = selectedProduct.productId;
		
		// for(var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++){
		// 	if(selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
		// 		$scope.brochureUrl = $rootScope.carrierDetails.brochureList[i].brochureUrl;
		// }

		// variableReplaceArray.push({
		// 	'id': '{{sumInsured}}',
		// 	'value': Math.round(selectedProduct.sumInsured)
		// });
		// variableReplaceArray.push({
		// 	'id': '{{monthlyPayout}}',
		// 	'value': selectedProduct.monthlyPayout
		// });
		// variableReplaceArray.push({
		// 	'id': '{{policyTerm}}',
		// 	'value': selectedProduct.policyTerm
		// });

		// if(productFetchStatus){
		// 	RestAPI.invoke($scope.globalLabel.transactionName.getProductFeatures, productFeatureJSON).then(function(callback){
		// 		 console.log('callback5',callback);
		// 		var scopeVariableName = 'productFeaturesList_' + selectedCarrierId + '_' + selectedProductId;
		// 		var productFeatureJSONName = 'productFeaturesJSON_' + selectedCarrierId + '_' + selectedProductId;
				
		// 		$rootScope[productFeatureJSONName] = {};
				
		// 		$scope[scopeVariableName] = callback.data[0].Features;
		// 		for(var i = 0; i < variableReplaceArray.length; i++){
		// 			if(p365Includes($scope[scopeVariableName][1].details,variableReplaceArray[i].id)){
		// 				$scope[scopeVariableName][1].details = $scope[scopeVariableName][1].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
		// 			}
		// 		}
		// 		for(var i = 0; i< $scope[scopeVariableName].length; i++)
		// 		{
		// 			$rootScope[productFeatureJSONName][callback.data[0].Features[i].titleForCompareView] = callback.data[0].Features[i].detailsForCompareView;
		// 		}
		// 		selectedProduct.features = $rootScope[productFeatureJSONName];
				
		// 		for(var i=0;i< $scope[scopeVariableName].length; i++)
		// 		{
		// 			if($scope[scopeVariableName][i].featureCategory == "Benefits" && $scope[scopeVariableName][i].compareView == "Y")
		// 			{
		// 				if($rootScope.consolidatedBenefitsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
		// 				{
		// 					$rootScope.consolidatedBenefitsList.push($scope[scopeVariableName][i].titleForCompareView);
		// 				}
		// 			}
		// 			if($scope[scopeVariableName][i].featureCategory == "Savings" && $scope[scopeVariableName][i].compareView == "Y")
		// 			{
		// 				if($rootScope.consolidatedSavingsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
		// 				{
		// 					$rootScope.consolidatedSavingsList.push($scope[scopeVariableName][i].titleForCompareView);
		// 				}
		// 			}
		// 			if($scope[scopeVariableName][i].featureCategory == "Flexibility" && $scope[scopeVariableName][i].compareView == "Y")
		// 			{
		// 				if($rootScope.consolidatedFlexibilityList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
		// 				{
		// 					$rootScope.consolidatedFlexibilityList.push($scope[scopeVariableName][i].titleForCompareView);
		// 				}
		// 			}
		// 		}

		// 	});
		// }
	// }
}]);