/*
 * Description	: This is the controller file for life quote calculation.
 * Author		: Yogesh Shisode
 * Date			: 13 June 2016
 * Modification :
 *
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *  1		15-06-2016		Sort quote result based on specific property.										  modification-0001		Yogesh S.
 *	3		16-06-2016		Setting application labels to avoid static assignment.								  modification-0003		Yogesh S.
 *	4		22-06-2016		Google analytics tracker added.														  modification-0004		Yogesh S.
 *  5       15-05-2017      Function created to set tool-tip content.                                             modification-0005		Yogesh S.
 *  6       15-05-2017      Function created to calculate life instant quote.                                     modification-0006		Yogesh S.
 *  7       15-05-2017      Function created to get default input parameter from DB.                              modification-0007		Yogesh S.
 *  8		15-05-2017		Function created to set annual premium amount range.								  modification-0008		Yogesh S.
 *  9		14-08-2017		Function created to get Product Features and update Quote Result Object Initially	  modification-0009		Parul Jain
 * */

'use strict';
angular.module('lifeInstantQuote', ['CoreComponentApp', 'LocalStorageModule'])
.controller('lifeInstantQuoteController', ['$scope', '$rootScope', '$window', '$location', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$http', '$sce', '$anchorScroll',  function($scope, $rootScope, $window, $location, $filter, RestAPI, localStorageService, $timeout, $interval, $http, $sce,$anchorScroll){

	// Setting application labels to avoid static assignment.	-	modification-0003
	// var applicationLabels = localStorageService.get("applicationLabels");
	// $scope.globalLabel = applicationLabels.globalLabels;
	$scope.p365Labels=insLifeQuoteLabels;
	$rootScope.loaderContent={businessLine:'1',header:'Life Insurance',desc:$sce.trustAsHtml($scope.p365Labels.common.proverbInstantQuote)};
	if($location.path() == '/life'){
		$rootScope.title = $scope.p365Labels.policies365Title.lifeInstantQuoteLanding;
	}else{
		$rootScope.title = $scope.p365Labels.policies365Title.lifeInstantQuote;
	}

	$anchorScroll('home');
	$scope.payoutDetails = {};
	$scope.relationType = relationLifeQuoteGeneric;
	$scope.healthConditionType = healthConditionGeneric;
	$scope.annualIncomesRange = annualIncomesGeneric;
	$scope.genderType = genderTypeGeneric;
	$scope.tobaccoAddictionStatus = tobaccoAddictionStatusGeneric;
	$scope.payoutOptions = lifePayoutOptionsGeneric;
	$rootScope.carrierDetails = {};
	$rootScope.GSTTag = false;
	
	$rootScope.loading = true;
	$rootScope.instantQuoteSummaryStatus = true;
	$rootScope.disableLandingLeadBtn=false;

//added for prepopulating faster
	$scope.quoteParam = defaultLifeQuoteParam.quoteParam;
	$scope.personalDetails = defaultLifeQuoteParam.personalDetails;
//end

	getDocUsingId(RestAPI, $scope.p365Labels.common.ridersDocInDB, function(carrierDetails){
		$rootScope.carrierDetails = carrierDetails;

		$scope.instantQuoteCalculation = function(addOnCoverForLife){
			addRidersToDefaultQuote(addOnCoverForLife, localStorageService.get("selectedBusinessLineId"), function(defaultRiderList, defaultRiderArrayObject){

				var lifeQuoteCookie = localStorageService.get("lifeQuoteInputParamaters");
				var personalDetailsCookie = localStorageService.get("lifePersonalDetails");
				console.log('inside instant quote calculation');
				$scope.quote = {};
				$scope.quoteParam = {};
				$scope.personalDetails = {};

				$rootScope.viewOptionDisabled = true;
				$rootScope.tabSelectionStatus = true;
				$scope.instantQuoteLifeForm = true;

				
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
						$scope.personalDetails.sumInsuredList = sumInsuredArray;
						
						var urlPattern = $location.path();
						if(!$rootScope.wordPressEnabled  || urlPattern == "/lifeproduct" || urlPattern == "/lifequote")
						{
							$scope.singleClickLifeQuote();	
						}	
					});
				}

				$scope.errorMessage = function(errorMsg){
					if((String($rootScope.lifeQuoteResult) == "undefined" || $rootScope.lifeQuoteResult.length == 0)){
						$scope.updateAnnualPremiumRange(1000, 5000);
						$rootScope.instantQuoteSummaryStatus = false;
						$rootScope.instantQuoteSummaryError = errorMsg;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteLifeForm = false;
					} else if($rootScope.lifeQuoteResult.length > 0){
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = false;
						$rootScope.viewOptionDisabled = false;
						$rootScope.tabSelectionStatus = true;
						$scope.instantQuoteLifeForm = false;
					}
					$rootScope.loading = false;
				}

				// Function created to set tool-tip content.	-	modification-0005
				$scope.tooltipPrepare = function(lifeResult){
					//console.log(JSON.stringify(lifeResult))
//					$rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
//					$rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
					$rootScope.riderOptionList = "<ul style='text-align: left;' class='tickpoints'>";
					for(var i = 0; i < addOnCoverForLife.length; i++){
						$rootScope.riderOptionList += "<li>" + addOnCoverForLife[i].riderName + "</li>";
					}
					$rootScope.riderOptionList += "</ul>";

					var resultCarrierId = [];
					var testCarrierId = [];
					for(var i = 0; i < lifeResult.length; i++){
						//push only net premium if greater than 0
						if(Number(lifeResult[i].annualPremium)>0){
							var carrierInfo = {};
							carrierInfo.id = lifeResult[i].carrierId;
							carrierInfo.name = lifeResult[i].insuranceCompany;
							carrierInfo.annualPremium = lifeResult[i].annualPremium;
							//carrierInfo.annualPremium = lifeResult[i].monthlyFinalPremium;
							carrierInfo.isMonthlyPremium = false;
							carrierInfo.claimsRating = lifeResult[i].insurerIndex;
							if($rootScope.wordPressEnabled)
							{
							carrierInfo.sumInsured=lifeResult[i].sumInsured;
							carrierInfo.businessLineId="1";
							}
	
							/*if(testCarrierId.includes(lifeResult[i].carrierId) == false){
								resultCarrierId.push(carrierInfo);
								testCarrierId.push(lifeResult[i].carrierId);
							}*/
							if(p365Includes(testCarrierId,lifeResult[i].carrierId) == false){
								resultCarrierId.push(carrierInfo);
								testCarrierId.push(lifeResult[i].carrierId);
							}
						}
					}
					$rootScope.resultCarrierId=resultCarrierId;

					//$rootScope.quoteResultInsurerList = $rootScope.tooltipContent.quoteDesc + "\n<ul style='text-align: left;' class='tickpoints'>";
					for(var i = 0; i < resultCarrierId.length; i++){
						$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
					}
					$rootScope.quoteResultInsurerList += "</ul>";

				//	$rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
					$rootScope.calculatedQuotesLength = (String(lifeResult.length)).length == 2 ? String(lifeResult.length) : ("0" + String(lifeResult.length));
					$rootScope.calculatedRidersLength = (String(addOnCoverForLife.length)).length == 2 ? String(addOnCoverForLife.length) : ("0" + String(addOnCoverForLife.length));
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
					$scope.instantQuoteLifeForm = false;
					$rootScope.loading = false;
					//for campaign
					$rootScope.campaignFlag = true;
					$rootScope.lifeQuoteResult = $filter('orderBy')($rootScope.lifeQuoteResult, 'dailyPremium');
					var minDailyPremiumValue = $rootScope.lifeQuoteResult[0].dailyPremium;
					var dailyPremiumSliderArray = [];

					for(var j = 0; j < $rootScope.lifeQuoteResult.length; j++){
						var calculatedDiscAmt = 0;
						var discountAmtList = $rootScope.lifeQuoteResult[j].discountList;
						if(String(discountAmtList) != "undefined"){
							for(var i = 0; i < discountAmtList.length; i++){
								calculatedDiscAmt += discountAmtList[i].discountAmount;
							}
							calculatedDiscAmt += $rootScope.lifeQuoteResult[j].dailyPremium;
							dailyPremiumSliderArray.push(calculatedDiscAmt);
						}else{
							dailyPremiumSliderArray.push($rootScope.lifeQuoteResult[j].dailyPremium);
						}
					}

					dailyPremiumSliderArray = $filter('orderBy')(dailyPremiumSliderArray);
					$scope.updateAnnualPremiumRange(minDailyPremiumValue, dailyPremiumSliderArray[dailyPremiumSliderArray.length - 1]);
					if(localStorageService.get("selectedBusinessLineId") == 1)
						$scope.tooltipPrepare($rootScope.lifeQuoteResult);
				}

				// Function created to get default input parameter from DB.	-	modification-0006
				$scope.singleClickLifeQuote = function(){
					//setTimeout(function(){
						
						$rootScope.instantQuoteSummaryStatus = true;
						$rootScope.progressBarStatus = true;
						$rootScope.viewOptionDisabled = true;
						$rootScope.tabSelectionStatus = false;
						$scope.instantQuoteLifeForm = true;
						$rootScope.loading = true;
						localStorageService.set("selectedBusinessLineId",1);
						
						$scope.quoteParam.documentType = $scope.p365Labels.documentType.quoteRequest;
						$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
						$scope.quoteParam.personType = relationLifeQuoteGeneric[0];
						$scope.quoteParam.payoutId = $scope.payoutOptions[0].id;
						$scope.quoteParam.annualIncome = $scope.personalDetails.annualIncomeObject.annualIncome;
						$scope.quoteParam.annualIncomeInterval = $scope.personalDetails.annualIncomeObject.annualIncomeInterval;
						$scope.quoteParam.sumInsured = $scope.personalDetails.sumInsuredObject.amount;
						$scope.quoteParam.frequency = "Annual";
						// Yogesh-12072017: Based on discussion with uday, Maturity age constant value changes from 70 to 50 and value of policy term at least have 5 year. 
						//maturity age difference as 40 - uday
						if($scope.quoteParam.age >= 35){
							//$scope.personalDetails.maturityAge = lifematurityAgeConstant;
							var policyTerm = lifematurityAgeConstant - $scope.quoteParam.age
						}else{
							var policyTerm = 40;
						}
						//var policyTerm = lifematurityAgeConstant - $scope.quoteParam.age;
						if(policyTerm < $scope.personalDetails.minPolicyTermLimit){
							$scope.quoteParam.policyTerm = $scope.personalDetails.minPolicyTermLimit;
						}else{
							$scope.quoteParam.policyTerm = policyTerm;
						}

						$scope.personalDetails.minMaturityAge = $scope.quoteParam.age + 5;
						$scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);

						$scope.quote.quoteParam = $scope.quoteParam;
						$scope.quote.personalDetails=$scope.personalDetails;
						$scope.quote.requestType = $scope.p365Labels.request.requestType;

						localStorageService.set("lifeQuoteInputParamaters", $scope.quote);
						localStorageService.set("lifePersonalDetails", $scope.personalDetails);

						//analyticsTrackerSendData($scope.quote); //	-	modification-0004
						$scope.requestId = null;
						if(localStorageService.get("PROF_QUOTE_ID")){
							$scope.quote.PROF_QUOTE_ID=localStorageService.get("PROF_QUOTE_ID");
						}

						if (campaignSource.utm_source) {
							$scope.quote.utm_source = campaignSource.utm_source;
						}
						if (campaignSource.utm_medium) {
							$scope.quote.utm_medium = campaignSource.utm_medium;
						}
						RestAPI.invoke($scope.p365Labels.getRequest.quoteLife, $scope.quote).then(function(callback){
							$rootScope.lifeQuoteRequest = [];

							if(callback.responseCode == $scope.p365Labels.responseCode.success){
								$scope.responseCodeList = [];

								$scope.requestId = callback.QUOTE_ID;
								$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
								localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.requestId);
								localStorageService.set("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
								
								$rootScope.lifeQuoteRequest = callback.data;

								if(String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0){
									$scope.quoteResult.length = 0;
								}

								if(String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0){
									$rootScope.lifeQuoteResult.length = 0;
								}
								//for olark
								// olarkCustomParam(localStorageService.get("LIFE_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),true);
								$rootScope.lifeQuoteResult = [];

								angular.forEach($rootScope.lifeQuoteRequest, function(obj, i){
									var request = {};
									var header = {};

									header.messageId = messageIDVar;
									header.campaignID = campaignIDVar;
									header.source=sourceOrigin;
									header.deviceId = deviceIdOrigin;
									header.transactionName = $scope.p365Labels.transactionName.lifeQuoteResult;
									request.header = header;

									if (campaignSource.utm_source) {
										obj.utm_source = campaignSource.utm_source;
									}
									if (campaignSource.utm_medium) {
										obj.utm_medium = campaignSource.utm_medium;
									}
									request.body = obj;

									$http({method: 'POST', url: getQuoteCalcLink, data: request}).
									success(function(callback, status){
										
										var lifeQuoteResponse = JSON.parse(callback);
										if(lifeQuoteResponse.QUOTE_ID == $scope.requestId){
											$scope.responseCodeList.push(lifeQuoteResponse.responseCode);
											
											if(lifeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success){
												for(var j = 0; j < $rootScope.carrierDetails.riderList.length; j++){
													if($rootScope.carrierDetails.riderList[j].carrierId == lifeQuoteResponse.data.quotes[0].carrierId && $rootScope.carrierDetails.riderList[j].productId == lifeQuoteResponse.data.quotes[0].productId){
														lifeQuoteResponse.data.quotes[0].riders = $rootScope.carrierDetails.riderList[j].riders;
													}
												}

												for(var k = 0; k < lifeQuoteResponse.data.quotes[0].riderList.length; k++){
													for(var l = 0; l < lifeQuoteResponse.data.quotes[0].riders.length; l++){
														if(lifeQuoteResponse.data.quotes[0].riderList[k].riderId == lifeQuoteResponse.data.quotes[0].riders[l].id){
															lifeQuoteResponse.data.quotes[0].riders[l].value = lifeQuoteResponse.data.quotes[0].riderList[k].riderPremiumAmount;
														}
													}
												}
												if(lifeQuoteResponse.data.quotes[0].riders){
													for(var m = 0; m < lifeQuoteResponse.data.quotes[0].riders.length; m++){
														if(lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'At Additional Cost'){
															lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "additionalCost";
															lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Additional Cost";
															//console.log("If Part : " + lifeQuoteResponse.data.quotes[0].carrierId + " :: additionalCost :: " + lifeQuoteResponse.data.quotes[0].riders[m].riderId);
														}else if(lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'Not Available'){
															lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "notAvailable";
															lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Not Available";
															//console.log("Else If Part : " + lifeQuoteResponse.data.quotes[0].carrierId + " :: notAvailable :: " + lifeQuoteResponse.data.quotes[0].riders[m].riderId);
														}else if(lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'Included'){
															lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "included";
															lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Included";
															//console.log("Else If Part : " + lifeQuoteResponse.data.quotes[0].carrierId + " :: included :: " + lifeQuoteResponse.data.quotes[0].riders[m].riderId);
														}else{
															//console.log("Else Part : " + lifeQuoteResponse.data.quotes[0].carrierId);
														}
													}
												}
												for(var i = 0; i < $rootScope.lifeQuoteRequest.length; i++){
													if($rootScope.lifeQuoteRequest[i].messageId == lifeQuoteResponse.messageId){
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
									error(function(data, status){
										$scope.responseCodeList.push($scope.p365Labels.responseCode.systemError);
									});
								});

								$scope.$watch('responseCodeList', function(newValue, oldValue, scope){
									//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
									if(p365Includes($scope.responseCodeList,$scope.p365Labels.responseCode.success))
										$rootScope.loading = false;

									if($scope.responseCodeList.length == $rootScope.lifeQuoteRequest.length){
										$rootScope.loading = false;
										//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
										if(p365Includes($scope.responseCodeList,$scope.p365Labels.responseCode.success)){
											// This condition will satisfy only when at least one product is found in the quoteResponse array.
											//} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
										} else if(p365Includes($scope.responseCodeList,$scope.p365Labels.responseCode.quoteNotAvailable)){
											$scope.errorMessage($scope.p365Labels.validationMessages.productNotFoundMsg);
										}else{
											//$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
											//comments updated based on Uday
											$scope.errorMessage($sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg));
										}
									}
								}, true);
							}else{
								$scope.responseCodeList = [];
								if(String($scope.quoteResult) != "undefined" && $scope.quoteResult.length > 0)
									$scope.quoteResult.length = 0;

								if(String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0)
									$rootScope.lifeQuoteResult.length = 0;

								$rootScope.lifeQuoteResult = [];
								$scope.errorMessage(callback.message);
							}
						});
					//},100);	
				}
				
				//Below piece of code written to access function from outside controller.
				$scope.$on("callSingleClickLifeQuote", function(){
					$scope.singleClickLifeQuote();
				});


				$scope.calculateLifePremium=function()
				{
					if(!$rootScope.wordPressEnabled)
					{	
						$scope.singleClickLifeQuote();
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
						$scope.personalDetails.sumInsuredList = sumInsuredArray;
					});

					setTimeout(function(){
						var urlPattern = $location.path();
						if(!$rootScope.wordPressEnabled || urlPattern == "/lifeproduct" || urlPattern == "/lifequote" || urlPattern == "/lifeLanding"){	
							if(urlPattern == "/lifeLanding"){
								sourceOrigin = "landing";
								console.log("soure origin for life landing is: ",sourceOrigin);
							}
							$scope.singleClickLifeQuote();
						}else {
							$scope.instantQuoteLifeForm=false;
						}
					},100);
				}

				// Function created to get default input parameter from DB.	-	modification-0007
				$scope.fetchDefaultInputParamaters = function(defaultQuoteStatus, defaultInputParamCallback){
					if(defaultQuoteStatus){
							$scope.quoteParam = defaultLifeQuoteParam.quoteParam;
							$scope.personalDetails = defaultLifeQuoteParam.personalDetails;
							//for wordPress
							if($rootScope.wordPressEnabled){
								 $scope.quote={};
								
								 if ($scope.quoteParam.age >= 35) {
									$scope.personalDetails.maturityAge = lifematurityAgeConstant;
								} else {
									$scope.personalDetails.maturityAge = $scope.quoteParam.age + 30;
								}
								 //added for professional journey
						    if($rootScope.insuredGender){
							var selectedGender = $rootScope.insuredGender ;
							if(selectedGender=='Male'){
								$scope.quoteParam.gender='M';
							}else{
								$scope.quoteParam.gender='F';
							}
							}
								 $scope.quote.personalDetails=$scope.personalDetails;
								 $scope.quote.quoteParam=$scope.quoteParam;
								 localStorageService.set("selectedBusinessLineId",1);
								 localStorageService.set("lifeQuoteInputParamaters", $scope.quote);
								 localStorageService.set("lifePersonalDetails", $scope.personalDetails);
							 }
						}else{
							$scope.quoteParam = lifeQuoteCookie.quoteParam;
							$scope.personalDetails = personalDetailsCookie;
							
							if(!$scope.personalDetails.maturityAge){
								if ($scope.quoteParam.age >= 35) {
									$scope.personalDetails.maturityAge = lifematurityAgeConstant;
								} else {
									$scope.personalDetails.maturityAge = $scope.quoteParam.age + 30;
								}
							}							
							//localStorageService.set("lifePersonalDetails", $scope.personalDetails);

							//$scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
							//$scope.personalDetails.selectedAddOnCovers = makeObjectEmpty($scope.quoteParam.riders, "array");
						}
						//added for professional journey
						if($rootScope.insuredGender){
							var selectedGender = $rootScope.insuredGender ;
							if(selectedGender=='Male'){
								$scope.quoteParam.gender='M';
							}else{
								$scope.quoteParam.gender='F';
							}
							}

							// //added since professional journey
							// if (localStorageService.get("professionalQuoteParams")) {
							// 	$scope.quoteRequest = localStorageService.get("professionalQuoteParams");
							// 	console.log('$scope.commonInfo in step 1: ',$scope.commonInfo);
							// 	if ($scope.quoteRequest.commonInfo) {
							// 		$scope.commonInfo = $scope.quoteRequest.commonInfo;
							// 		//$scope.quoteParam.gender = $scope.commonInfo.gender;
							// 		$scope.quoteParam.age= $scope.quoteRequest.commonInfo.age;
							// 		if($scope.quoteRequest.commonInfo.smoking){
							// 			$scope.quoteParam.tobacoAdicted = 'Y';	
							// 		}else{
							// 			$scope.quoteParam.tobacoAdicted ='N' ;		
							// 		}

							// 		if ($scope.quoteParam.gender == 'M') {
							// 			$scope.commonInfo.gender = 'Male'
							// 		} else {
							// 			$scope.commonInfo.gender = 'Female';
							// 		}
							// 		$scope.quoteRequest.commonInfo = $scope.commonInfo;
							// 		$scope.quote.quoteParam = $scope.quoteParam;
							// 		localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
							// 		console.log('professionalQuoteParams in life instant screen:',localStorageService.get("professionalQuoteParams"));
							// 		localStorageService.set("lifeQuoteInputParamaters", $scope.quote);															
							// 	}
							// }							

						console.log('$rootScope.insuredGender: ',$rootScope.insuredGender);

						$scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
						$scope.prePopulateFields();
						$rootScope.loading = false;
						defaultInputParamCallback();
					
				}
				console.log('lifeQuoteCookie in instant screen is',lifeQuoteCookie);
				// Below piece of code written to check whether lifeQuoteCookie is present or not. 
				if(lifeQuoteCookie != null && String(lifeQuoteCookie) !== "undefined"){
					$scope.fetchDefaultInputParamaters(false, function(){});
				}else{
					$scope.fetchDefaultInputParamaters(true, function(){});
				}

			});
		}

		if(!localStorageService.get("ridersLifeStatus")){
			// To get the life rider list applicable for this user.
			getRiderList(RestAPI, $scope.p365Labels.documentType.riderList, $scope.p365Labels.documentType.life, $scope.p365Labels.request.findAppConfig, function(addOnCoverForLife){
				localStorageService.set("addOnCoverForLife", addOnCoverForLife);
				localStorageService.set("ridersLifeStatus", true);
				var docId = $scope.p365Labels.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
				// getDocUsingId(RestAPI, docId, function(tooltipContent){
				// 	localStorageService.set("lifeInstantQuoteTooltipContent", tooltipContent.toolTips);
				// 	$rootScope.tooltipContent = tooltipContent.toolTips;
				// 	$scope.instantQuoteCalculation(addOnCoverForLife);
				// });
				$scope.instantQuoteCalculation(addOnCoverForLife);
			});
		}else{
			//$rootScope.tooltipContent = localStorageService.get("lifeInstantQuoteTooltipContent");
			$scope.instantQuoteCalculation(localStorageService.get("addOnCoverForLife"));
		}

	});
	// Function created to get Product Features and update Quote Result Object Initially - modification-0009
	function getAllProductFeatures(selectedProduct, productFetchStatus)
	{
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
		
		for(var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++){
			if(selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
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

		if(productFetchStatus){
			RestAPI.invoke($scope.p365Labels.transactionName.getProductFeatures, productFeatureJSON).then(function(callback){
				
				var scopeVariableName = 'productFeaturesList_' + selectedCarrierId + '_' + selectedProductId;
				var productFeatureJSONName = 'productFeaturesJSON_' + selectedCarrierId + '_' + selectedProductId;
				
				$rootScope[productFeatureJSONName] = {};
				
				$scope[scopeVariableName] = callback.data[0].Features;
				for(var i = 0; i < variableReplaceArray.length; i++){
					if(p365Includes($scope[scopeVariableName][1].details,variableReplaceArray[i].id)){
						$scope[scopeVariableName][1].details = $scope[scopeVariableName][1].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
					}
				}
				for(var i = 0; i< $scope[scopeVariableName].length; i++)
				{
					$rootScope[productFeatureJSONName][callback.data[0].Features[i].titleForCompareView] = callback.data[0].Features[i].detailsForCompareView;
				}
				selectedProduct.features = $rootScope[productFeatureJSONName];
				
				for(var i=0;i< $scope[scopeVariableName].length; i++)
				{
					if($scope[scopeVariableName][i].featureCategory == "Benefits" && $scope[scopeVariableName][i].compareView == "Y")
					{
						if($rootScope.consolidatedBenefitsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
						{
							$rootScope.consolidatedBenefitsList.push($scope[scopeVariableName][i].titleForCompareView);
						}
					}
					if($scope[scopeVariableName][i].featureCategory == "Savings" && $scope[scopeVariableName][i].compareView == "Y")
					{
						if($rootScope.consolidatedSavingsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
						{
							$rootScope.consolidatedSavingsList.push($scope[scopeVariableName][i].titleForCompareView);
						}
					}
					if($scope[scopeVariableName][i].featureCategory == "Flexibility" && $scope[scopeVariableName][i].compareView == "Y")
					{
						if($rootScope.consolidatedFlexibilityList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
						{
							$rootScope.consolidatedFlexibilityList.push($scope[scopeVariableName][i].titleForCompareView);
						}
					}
				}

			});
		}
	}
}]);