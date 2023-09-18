/*
 * Description	: This is the controller file for single click travel quote calculation.
 * Author		: Akash
 * Date			: 30 March  2018
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 *	
 * */
'use strict';
angular.module('travelInstantQuote', ['CoreComponentApp','LocalStorageModule','ngMaterial','ngScrollable'])
.controller('travelInstantQuoteController', ['$scope', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q', function ($scope, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q){
	/*values from local storage to variable*/
	
	var applicationLabels  = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	//Constants are declared here 
	var SELF = "Self";
	var SPOUSE = "Spouse";
	var SON = "Son";
	var DAUGHTER = "Daughter";
	var DATE_FORMAT = "dd/mm/yy";
	var FATHER = "Father";
	var MOTHER = "Mother";
	var FEMALE = "Female";
	var MALE = "Male";
	var SINGLE = "SINGLE";
	var MARRIED = "MARRIED";
	var EMPTY = "";
	var SPACE = " ";
	
	
	/*Scope variables*/
	
	$scope.travelDetails={};
	$scope.ratingParam = {};
	$scope.quoteParam = {};
	$scope.quoteParam.travellers = [];
	$scope.quote = {};
	$scope.sourcesList = {};
	$scope.sumInsuredList=[];
	$scope.continentList = [];
	$scope.selectedDisease = {};
	$scope.selectedDisease.diseaseList = [];
	$scope.diseaseList = [];
	$scope.destinations = [];
	$scope.travelInstantQuoteForm = {};
	
	
	//$Scope variables generic init
	$scope.relationType = travelGeneric;
	$scope.relationTypeCopy = angular.copy(travelGeneric);
	$scope.pedStatus = preDiseaseStatusGen;
	$scope.numberOfTravellers = getList(8);
	$scope.numberOfTraveller=$scope.numberOfTravellers[0];
	$scope.genderType = travelGenderTypeGeneric;
	$scope.questionStatus = questionStatusGeneric;
	$scope.tripTypeList = tripTypeListGeneric;
	$scope.tripDurationList = tripDurationListGeneric;
	$scope.currencySymbols = currencySymbolList;
	
	//$scope.futureGenRes = futureGenQuoteResponse;
	//localstorage
	var travelQuoteCookie = localStorageService.get("travelQuoteInputParamaters");
	var travelDetailsCookie = localStorageService.get("travelDetails");
	
	/*Flags*/
	$scope.isDiseased   = false;
	$scope.showHiddenFields = false;
	$scope.modalTraveller = false;
	$rootScope.instantQuoteSummaryStatus = true;
	$rootScope.tabSelectionStatus = true;
	$scope.instantQuoteTravelForm = false;
	$scope.disableAddButton = false;
	$rootScope.loading = false;
 
	$rootScope.loaderContent={businessLine:'5',header:'Travel Insurance',desc:$sce.trustAsHtml($scope.globalLabel.applicationLabels.travel.proverbInstantQuote)}
	
	$scope.toggleDate = function(){
		$scope.getUpdatedTravelDates();
		$scope.callSingleClickQuote();
	};

	$scope.toggleTripType = function(){
		$scope.travelDetails.tripDuration = $scope.tripDurationList[0].duration;
		$scope.getUpdatedTravelDates();
	}
	
	$scope.toggleQuestion1 = function(){
		if($scope.quoteParam.travellingFromIndia == "N"){
			$scope.show_error_msg_1 = true;
			$scope.show_error_msg_2 = false;
			$scope.show_error_msg_3 = false;
			$scope.quoteParam.isIndian = "Y";
			$scope.quoteParam.isOciPioStatus = "Y";
		}else{
			$scope.show_error_msg_1 = false;
			$scope.show_error_msg_2 = false;
			$scope.show_error_msg_3 = false;
			$scope.callSingleClickQuote();
			$scope.quoteParam.isIndian = "Y";
			$scope.quoteParam.isOciPioStatus = "Y";
		}
	};
		$scope.toggleQuestion2 = function(){
			if($scope.quoteParam.isIndian == "N"){
				$scope.show_error_msg_1 = false;
				$scope.show_error_msg_2 = true;
				$scope.show_error_msg_3 = false;
				$scope.callSingleClickQuote();
				$scope.quoteParam.isOciPioStatus = "Y";
			}else{
				$scope.show_error_msg_1 = false;
				$scope.show_error_msg_2 = false;
				$scope.show_error_msg_3 = false;
				$scope.callSingleClickQuote();
				$scope.quoteParam.isOciPioStatus = "Y";
			}
		};
		$scope.toggleQuestion3 = function(){
		if($scope.quoteParam.isOciPioStatus == "N"){
			$scope.show_error_msg_1 = false;
			$scope.show_error_msg_2 = true;
			$scope.show_error_msg_3 = true;
		}else{
			$scope.show_error_msg_1 = false;
			$scope.show_error_msg_2 = true;
			$scope.show_error_msg_3 = false;
			$scope.callSingleClickQuote();
		}
	};




	

	$scope.onSelect = function(item){
		$scope.destinations.push(item);
	};

	//sets page title 
	if($location.path() == '/travel'){
		$rootScope.title = $scope.globalLabel.policies365Title.travelInstantQuoteLanding;
	}else{
		$rootScope.title = $scope.globalLabel.policies365Title.travelInstantQuote;
	}
	
	$scope.initPolicyDates = function(){
		//local virables
		var startDateOptions = {};
		var endDateOptions = {};
		var tripType = $scope.travelDetails.tripType;
		if(tripType == 'single'){
		startDateOptions.minimumDayLimit = 0;
		
		startDateOptions.maximumDayLimit = 60;
		startDateOptions.changeMonth = true;
		startDateOptions.changeYear = true;
		startDateOptions.dateFormat = DATE_FORMAT;
		$scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
		var startDate = angular.copy($scope.travelDetails.startdate);
		var endDay =   startDate.split("/")[0];
		var endMonth = startDate.split("/")[1];
		var endYear =  startDate.split("/")[2];
		var travelEndDateMin = new Date(Date.parse(endMonth+'/'+endDay+'/'+endYear));
		
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
		}else if(tripType == 'multi'){
			startDateOptions.minimumDayLimit = 0;
			startDateOptions.maximumDayLimit = 60;
			startDateOptions.changeMonth = true;
			startDateOptions.changeYear = true;
			startDateOptions.dateFormat = DATE_FORMAT;
			$scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
			var startDate = angular.copy($scope.travelDetails.startdate);
			var endDay =   startDate.split("/")[0];
			var endMonth = startDate.split("/")[1];
			var endYear =  startDate.split("/")[2];
			var travelEndDateMin = new Date(Date.parse(endMonth+'/'+endDay+'/'+endYear));
			travelEndDateMin.setDate(travelEndDateMin.getDate() + 364);
			var d= travelEndDateMin.getDate();
			var m= travelEndDateMin.getMonth()+1;
			$scope.travelDetails.enddate = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+travelEndDateMin.getFullYear());
			
			endDateOptions.minimumDateStringFormat = $scope.travelDetails.enddate;
			endDateOptions.maximumDateStringFormat = $scope.travelDetails.enddate;
			endDateOptions.changeMonth = true;
			endDateOptions.changeYear = true;
			endDateOptions.dateFormat = DATE_FORMAT;
			$scope.travelEndDateOptions = setP365DatePickerProperties(endDateOptions)
		}
	}
	
	$scope.getUpdatedTravelDates = function(){
		//local virables
		var startDateOptions = {};
		var endDateOptions = {};
		var tripType = $scope.travelDetails.tripType;
		if(tripType == 'single'){
			//trip start date
				startDateOptions.minimumDayLimit = 0;
				startDateOptions.maximumDayLimit = 60;
				startDateOptions.changeMonth = true;
				startDateOptions.changeYear = true;
				startDateOptions.dateFormat = DATE_FORMAT;
				$scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
				var startDate = angular.copy($scope.travelDetails.startdate);
				var endDay =   startDate.split("/")[0];
				var endMonth = startDate.split("/")[1];
				var endYear =  startDate.split("/")[2];
				var travelEndDateMin = new Date(Date.parse(endMonth+'/'+endDay+'/'+endYear));
				travelEndDateMin.setDate(travelEndDateMin.getDate() + 1);
				var d= travelEndDateMin.getDate();
				var m= travelEndDateMin.getMonth()+1;
				$scope.travelDetails.enddate = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+travelEndDateMin.getFullYear());
				
				var travelEndDateMax = new Date(travelEndDateMin);
				travelEndDateMax.setDate(travelEndDateMin.getDate() + 179);
				//trip end date
				
				endDateOptions.minimumDateStringFormat = $scope.travelDetails.enddate;
				endDateOptions.maximumDateStringFormat = travelEndDateMax;
				endDateOptions.changeMonth = true;
				endDateOptions.changeYear = true;
				endDateOptions.dateFormat = DATE_FORMAT;
				$scope.travelEndDateOptions = setP365DatePickerProperties(endDateOptions);
		}else if(tripType == 'multi'){
			startDateOptions.minimumDayLimit = 0;
			startDateOptions.maximumDayLimit = 60;
			startDateOptions.changeMonth = true;
			startDateOptions.changeYear = true;
			startDateOptions.dateFormat = DATE_FORMAT;
			$scope.travelStartDateOptions = setP365DatePickerProperties(startDateOptions);
			var startDate = angular.copy($scope.travelDetails.startdate);
			var endDay =   startDate.split("/")[0];
			var endMonth = startDate.split("/")[1];
			var endYear =  startDate.split("/")[2];
			var travelEndDateMin = new Date(Date.parse(endMonth+'/'+endDay+'/'+endYear));
			travelEndDateMin.setDate(travelEndDateMin.getDate() + 364);
			var d= travelEndDateMin.getDate();
			var m= travelEndDateMin.getMonth()+1;
			$scope.travelDetails.enddate = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+travelEndDateMin.getFullYear());
			endDateOptions.minimumDateStringFormat = $scope.travelDetails.enddate;
			endDateOptions.maximumDateStringFormat = $scope.travelDetails.enddate;
			endDateOptions.changeMonth = true;
			endDateOptions.changeYear = true;
			endDateOptions.dateFormat = DATE_FORMAT;
			$scope.travelEndDateOptions = setP365DatePickerProperties(endDateOptions);
		}
}
    
		// traveller modal functions
		$scope.modalTraveller = false;
		$scope.toggleTraveller = function(){
			$scope.oldtravellersList = angular.copy($scope.travellersList);
			for(var i=0;i<$scope.travellersList.length;i++){
				$scope.travellersList[i].minAge = 1;
				$scope.travellersList[i].maxAge = 120;
				$scope.travellersList[i].addNew = false;
				$scope.changeRelation($scope.travellersList[i].relation);
			}
			$scope.travellersList[$scope.travellersList.length-1].addNew=true;
			$scope.modalTraveller = !$scope.modalTraveller;
			setTimeout(function(){
				$('.hiddenAge').each(function(){
					var hiddenVal=$(this).val();
					$(this).closest('span').find('.ageDropdown').val(hiddenVal);
				});
			},1000);
		};
		
		$scope.addTraveller = function(id){
			if(id<=6){
				if(id==6)
					$scope.disableAddButton = true;
				else
					$scope.disableAddButton = false;
				
				$scope.travellersList[id].addNew = false;
				var traveller = {};
				traveller.minAge = 1;
				traveller.maxAge = 120;
				traveller.gender = "Male";
				traveller.relation = "";
				traveller.age = 18;
				traveller.traveller_id = $scope.travellersList.length+1;
				traveller.status = true;
				traveller.addNew = true;
				$scope.travellersList.push(traveller);	
			}else{
				$scope.disableAddButton = true;
			}
			$scope.changeRelation($scope.travellersList[id].relation);
		}
		
		$scope.removeTraveller = function(id){
			
			if(!$scope.travellersList[id].status){
				$scope.travellersList.splice(id,1);
				if($scope.travellersList.length < 8){
					$scope.disableAddButton = false;
					$scope.travellersList[$scope.travellersList.length-1].addNew = true;
				}
			}
			
		}

		$scope.closeTravellerModal = function(){
			$scope.travellersList = $scope.oldtravellersList;
			$scope.modalTraveller = false;
		};
		
		$scope.getAgeArray = function(minAge, maxAge){
			var ageArray = [];
			for(var i=0, j=minAge; j<=maxAge; i++,j++){
				ageArray.push(j);
			}
			return ageArray;   
		};
	
	function isSelected(value){
		var returnvalue = false;
		for(var i=0;i<$scope.travellersList.length;i++){
			if($scope.travellersList[i].relation == value){
				returnvalue =  true;
			}
		}
		return returnvalue;
	}
	
	function validateGender(){
		var isGenderValid = false;
		for(var i=0;i<$scope.travellersList.length;i++){
			if($scope.travellersList[i].relation == FATHER || $scope.travellersList[i].relation == SON){
				$scope.travellersList[i].gender = MALE;
				isGenderValid = true;
			}
			if($scope.travellersList[i].relation == MOTHER || $scope.travellersList[i].relation == DAUGHTER){
				$scope.travellersList[i].gender = FEMALE;
				isGenderValid = true;
			}
			if($scope.travellersList[i].relation == SELF){
				for(var j=0;j<$scope.travellersList.length;j++){
					if($scope.travellersList[j].relation == SPOUSE){
						$scope.travellersList[j].gender = ($scope.travellersList[i].gender == MALE)?FEMALE:MALE;
						isGenderValid = true;
					}
				}
			}
		}
		return isGenderValid;
	}
		
	$scope.changeRelation = function(relation){
			validateGender();
			for(var i=0;i<$scope.relationTypeCopy.length;i++){
				if(!isSelected($scope.relationTypeCopy[i].member)){
					$scope.relationTypeCopy[i].val = false;
				}
				if($scope.relationTypeCopy[i].member == relation && isSelected(relation)){
						if(relation != SON && relation != DAUGHTER){
							$scope.relationTypeCopy[i].val = true;
						}
				}
		}
		$scope.relationType = angular.copy($scope.relationTypeCopy);
	}	
	
	$scope.validateFamilyForm = function(){
		$scope.familyErrors=[];
		var submitTravellersForm=true;
		var ageOfSelf, ageOfSpouse, ageOfFather, lesserAge;
		for(var i=0; i<$scope.travellersList.length; i++){
			if($scope.travellersList[i].relation == SELF){
				if($scope.travellersList[i].status){
					ageOfSelf = Number($scope.travellersList[i].age);
				}
			}else if($scope.travellersList[i].relation == SPOUSE){	
				if($scope.travellersList[i].status){
					ageOfSpouse = Number($scope.travellersList[i].age);
				}
			}else if($scope.travellersList[i].relation == FATHER ){
				if($scope.travellersList[i].status){
					ageOfFather = Number($scope.travellersList[i].age);
				}
			}
		}
		for(var i=0; i<$scope.travellersList.length; i++){
			if(ageOfSelf=='undefined' || ageOfSelf=='' || ageOfSelf==null){
				lesserAge=ageOfSpouse;
			}else{
				lesserAge = ageOfSpouse < ageOfSelf ? ageOfSpouse : ageOfSelf;
			}
			if($scope.travellersList[i].status==true){
				/*console.log("Relation : " + $scope.travellersList[i].relation + " and Age : " + $scope.travellersList[i].age);*/
				if($scope.travellersList[i].relation==SON && $scope.travellersList[i].age>(lesserAge-18)){
					if(p365Includes($scope.familyErrors,"Child's age should be at least 18 years lesser than the younger parent") == false){
						$scope.familyErrors.push("Child's age should be at least 18 years lesser than the younger parent");
						submitTravellersForm=false;
					}
				}
				
				if($scope.travellersList[i].relation==DAUGHTER && $scope.travellersList[i].age>(lesserAge-18)){
					if(p365Includes($scope.familyErrors,"Child's age should be at least 18 years lesser than the younger parent") == false){
						$scope.familyErrors.push("Child's age should be at least 18 years lesser than the younger parent");
						submitTravellersForm=false;
					}
				}
				
				if(($scope.travellersList[i].relation == FATHER || $scope.travellersList[i].relation == MOTHER) && $scope.travellersList[i].age<(ageOfSelf+18)){
					if(p365Includes($scope.familyErrors,"Your Parents' age should be at least 18 years more than your age") ==false){
						$scope.familyErrors.push("Your Parents' age should be at least 18 years more than your age");
						submitTravellersForm=false;
					}
				}
			}
		}
		return submitTravellersForm;
	};
	
	
	
	
		
	$scope.submitTravellers = function(){
		var submitTravellersForm = true;
		submitTravellersForm = $scope.validateFamilyForm();
		var travellersCounter = 0;
		var travellerSelectionStatus = false;
		var relationStatus = false;
		/*$scope.familyErrors=[];*/
		$scope.quoteParam.travellers = [];
		$scope.travellersList = $filter('filter')($scope.travellersList, function(value){
			return value.status==true;
		})
		
		for(var i = 0; i < $scope.travellersList.length; i++){
			if($scope.travellersList[i].status == true){
				if($scope.travellersList[i].relation != undefined && $scope.travellersList[i].relation != ""){
					var member = {};
					member.traveller_id = i + 1;
					member.age = Number($scope.travellersList[i].age);
					member.gender = $scope.travellersList[i].gender;
					member.minAge = 1;
					member.maxAge = 120;
					member.relation = $scope.travellersList[i].relation;
					member.status = $scope.travellersList[i].status;
					$scope.quoteParam.travellers.push(member);
					travellerSelectionStatus = true;
					relationStatus = true;
					travellersCounter++;
				}else{
					relationStatus = false;
				}
			}else{
				travellerSelectionStatus = false;
			}
		}
		$scope.quoteParam.travellers[$scope.quoteParam.travellers.length-1].addNew = true;
		$scope.travellersList = $scope.quoteParam.travellers;
		$scope.numberOfTraveller = travellersCounter;
		localStorageService.set("selectedTravellersForTravel", $scope.travellersList);
		localStorageService.set("selectedTravellersForTravelReset", $scope.travellersList);
		localStorageService.set("relationTypeList",$scope.relationType);
		if(travellersCounter > 1){
			$scope.quoteParam.planType = "F";
		}else{
			$scope.quoteParam.planType = "I";
		}
		if(travellerSelectionStatus){
			if(relationStatus){
				if(submitTravellersForm == true){
					$scope.modalTraveller = false;
					$scope.callSingleClickQuote();
				}
			}else{
				$scope.familyErrors.push("Please select relation of traveller.");
			}
		}else{
			$scope.familyErrors.push("Please select at least one member.");
		}
		$scope.selectedTravellerArray = $scope.quoteParam.travellers;
	};

	$scope.errorMessage = function(errorMsg){
		if((String($rootScope.travelQuoteResult) == $scope.globalLabel.errorMessage.undefinedError  || $rootScope.travelQuoteResult.length == 0)){
			$scope.errorRespCounter = false;
			$rootScope.instantQuoteSummaryStatus = false;
			$rootScope.instantQuoteSummaryError = errorMsg;
			$rootScope.tabSelectionStatus = true;
			$scope.instantQuoteTravelForm = false;
		}else if($rootScope.travelQuoteResult.length > 0){
			$rootScope.instantQuoteSummaryStatus = true;
			$rootScope.viewOptionDisabled = false;
			$rootScope.tabSelectionStatus = true;
			$scope.instantQuoteTravelForm = false;
		}
		$rootScope.loading = false;
	};


	// Preparing tooltip to be displayed on instant quote screen.
	$scope.tooltipPrepare = function(travelResult){
		var i;
		var resultCarrierId = [];
		var testCarrierId = [];
		$rootScope.resultCarrierId=[];
		for( i = 0; i < travelResult.length; i++){
			//push only net premium if greater than 0
			if(Number(travelResult[i].netPremium)>0){
				var carrierInfo = {};
				carrierInfo.productInfo = travelResult[i];
				$scope.quote.quoteParam.totalCount = travelResult[i].totalTravellers;
				localStorageService.set("quote", $scope.quote);
				localStorageService.set("travelQuoteInputParamaters", $scope.quote);
				if(carrierInfo.productInfo.sumInsuredCurrency != undefined && carrierInfo.productInfo.sumInsuredCurrency != ""){
					for(var k=0;k<$scope.currencySymbols.length;k++){
						if($scope.currencySymbols[k].symbol == carrierInfo.productInfo.sumInsuredCurrency){
							carrierInfo.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[k].htmlCode);
						}
					}
				}else{
					carrierInfo.productInfo.sumInsuredCurrency = $scope.currencySymbols[0].symbol;
					carrierInfo.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[0].htmlCode);
				}
				
				carrierInfo.id = travelResult[i].carrierId;
				carrierInfo.name = travelResult[i].insuranceCompany;
				carrierInfo.annualPremium = travelResult[i].grossPremium;
				carrierInfo.claimsRating = travelResult[i].insurerIndex;
				if($rootScope.wordPressEnabled)
				{	
				carrierInfo.businessLineId="5";
				carrierInfo.sumInsured=travelResult[i].sumInsured;
				}
				if(p365Includes(testCarrierId,travelResult[i].carrierId) == false){
					resultCarrierId.push(carrierInfo);
					testCarrierId.push(travelResult[i].carrierId);
				}
			}
		}
		$rootScope.resultedCarriers = resultCarrierId;
		$rootScope.resultCarrierId = resultCarrierId;

		for( i = 0; i < resultCarrierId.length; i++){
			$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
		}
		$rootScope.quoteResultInsurerList += "</ul>";

		$rootScope.calculatedQuotesLength = (String(travelResult.length)).length == 2 ? String(travelResult.length) : ("0" + String(travelResult.length));
		setTimeout(function(){ 	
			scrollv = new scrollable({
				wrapperid: "scrollable-v",
				moveby: 4,
				mousedrag: true
			});
		},2000);
	};
	
	
	
	// Processing of quote result to displayed on UI.
	$scope.processResult = function(){
		if($rootScope.travelQuoteResult.length>0){
		$rootScope.instantQuoteSummaryStatus = true;
		$rootScope.viewOptionDisabled = false;
		$rootScope.tabSelectionStatus = true;
		$rootScope.enabledProgressLoader=false;
		$rootScope.loading = false;
		$scope.instantQuoteTravelForm = false;
		//for campaign
		$rootScope.campaignFlag = true;
		$rootScope.travelQuoteResult = $filter('orderBy')($rootScope.travelQuoteResult, 'grossPremium');
	
		if(localStorageService.get("selectedBusinessLineId") == $scope.globalLabel.businessLineType.travel){
			$scope.tooltipPrepare($rootScope.travelQuoteResult);
		}
	  }
	};
	
	$scope.singleClickTravelQuote = function(){
		setTimeout(function(){
		if(!$scope.travelInstantQuoteForm.$invalid){
			
			$rootScope.tabSelectionStatus = false;
			$rootScope.loading = true;
			$scope.instantQuoteTravelForm = true;
			$scope.quote = {};
			
			localStorageService.set("selectedBusinessLineId",$scope.globalLabel.businessLineType.travel);
			$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
			$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
			$scope.quote.requestType       = $scope.globalLabel.request.travelRequestType;
			
			delete $scope.quote.documentType;
			$scope.quote.quoteParam = $scope.quoteParam;
			if($scope.quote.quoteParam.pedStatus == "Y"){
				localStorageService.set("pedDetails",$scope.selectedDisease.diseaseList);
			}
			//list to get min and max age from the selected travellers
			$scope.ageList = [];
			for(var i=0;i<$scope.quoteParam.travellers.length;i++){
				$scope.ageList.push($scope.quoteParam.travellers[i].age);
			}
			$scope.quote.quoteParam.quoteMinAge  = getMinAge($scope.ageList);
			$scope.quote.quoteParam.quoteMaxAge  = getMaxAge($scope.ageList);
			$scope.quote.travelDetails = $scope.travelDetails;
			localStorageService.set("quote", $scope.quote);
			localStorageService.set("travelQuoteInputParamaters", $scope.quote);
			localStorageService.set("travelDetails", $scope.travelDetails);
			localStorageService.set("isDiseasedForTravel", $scope.isDiseased);
			
			localStorageService.set("selectedDisease", $scope.selectedDisease);
			
			localStorageService.set("diseaseList", $scope.diseaseList);
			localStorageService.set("selectedTravellersForTravel", $scope.travellersList);
			localStorageService.set("selectedTravellerArray", $scope.selectedTravellerArray);
			localStorageService.set("relationTypeList",$scope.relationType);
			
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
			localStorageService.set("quote", $scope.quote);
			localStorageService.set("travelQuoteInputParamaters", $scope.quote);
			$scope.requestId = null;
			var quoteUserInfo = localStorageService.get("quoteUserInfo");
			RestAPI.invoke($scope.globalLabel.getRequest.quoteTravel, $scope.quote).then(function(callback){
				$rootScope.travelQuoteRequest = [];
				if(callback.responseCode == $scope.globalLabel.responseCode.success){
					$scope.responseCodeList = [];
					$scope.requestId = callback.QUOTE_ID;
					localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID", $scope.requestId);
					
					if(callback.encryptedQuoteId){
						$scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
						localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
						console.log("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED",callback.encryptedQuoteId)									
					}

					$rootScope.travelQuoteRequest = callback.data;
					//for olark
					// olarkCustomParam(localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),true);
					
					if(String($rootScope.travelQuoteResult) != $scope.globalLabel.errorMessage.undefinedError && $rootScope.travelQuoteResult.length > 0){
						$rootScope.travelQuoteResult.length = 0;
					}
					
					$rootScope.travelQuoteResult=[];
					angular.forEach($rootScope.travelQuoteRequest, function(obj, i){
						var request = {};
						var header = {};
						
						header.messageId = messageIDVar;
						header.campaignID = campaignIDVar;
						header.source=sourceOrigin;
						header.transactionName = $scope.globalLabel.transactionName.travelQuoteResult;
						header.deviceId = deviceIdOrigin;
						request.header = header;
						request.body = obj;
						
						$http({method:'POST', url: getQuoteCalcLink, data: request}).
						success(function(callback, status) {
							var travelQuoteResponse = JSON.parse(callback);
							if(travelQuoteResponse.QUOTE_ID == $scope.requestId){
								$scope.responseCodeList.push(travelQuoteResponse.responseCode);
								if(travelQuoteResponse.responseCode == $scope.globalLabel.responseCode.success){
									for(var i = 0; i < $rootScope.travelQuoteRequest.length; i++){
										if($rootScope.travelQuoteRequest[i].messageId == travelQuoteResponse.messageId){
											$rootScope.travelQuoteResult.push(travelQuoteResponse.data.quotes[0]);
											$rootScope.travelQuoteRequest[i].status = 1;
										}
									}
									$scope.processResult();
								}else{
									for(var i = 0; i < $rootScope.travelQuoteRequest.length; i++){
										if($rootScope.travelQuoteRequest[i].messageId == travelQuoteResponse.messageId){
											$rootScope.travelQuoteRequest[i].status = 2;
											$rootScope.travelQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedTravelErrMsg);
										}
									}
								}
							}
							
						}).error(function(data, status){
							$scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
						});
					});
					
					$scope.$watch('responseCodeList', function (newValue, oldValue, scope) {
						if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.success))
							$rootScope.loading = false;
						if($scope.responseCodeList.length == $rootScope.travelQuoteRequest.length){
							$rootScope.loading = false;
							$rootScope.setTooltip = false;
							
							for(var i = 0; i < $rootScope.travelQuoteRequest.length; i++){
								if($rootScope.travelQuoteRequest[i].status == 0){
									$rootScope.travelQuoteRequest[i].status = 2;
									$rootScope.travelQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedTravelErrMsg);
								}
							}
							if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.quoteNotAvailable)){
								$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
							}else{
								$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedTravelErrMsg));
							}
						}
					}, true);
				}else{
					$scope.responseCodeList = [];
					if(String($rootScope.travelQuoteResult) != $scope.globalLabel.errorMessage.undefinedError && $rootScope.travelQuoteResult.length > 0)
						$rootScope.travelQuoteResult.length = 0;
					
					$rootScope.travelQuoteResult = [];
					$scope.errorMessage(callback.message);
				}
			});
		}
		
		},100);
	};
	
	/*this function checks that wordpress is enabled or not
	 * if enabled then not calling singleClickTravelQuote on change of any UI fields
	 * else calling calling singleClickTravelQuote on change of any UI fields
	 * */
	$scope.callSingleClickQuote = function(){
		var urlPattern = $location.path();
		if(!$rootScope.wordPressEnabled || urlPattern == "/travel-insurance" || urlPattern == "/travel-insuranceMobi" || $location.path() =='/mobiDiwaliTravelInsurance' || $location.path() =='/diwaliTravelInsurance'){
			$scope.singleClickTravelQuote();
		}
	}
		//move to common file
		$scope.checkQuestionStatus = function(quoteParam){
			if(quoteParam.travellingFromIndia == 'Y'){
				$scope.show_error_msg_1 = false;
			}else{
				$scope.show_error_msg_1 = true;
			}
			if(quoteParam.isIndian == 'Y'){
				$scope.show_error_msg_2 = false;
			}else{
				$scope.show_error_msg_2 = true;
				if(quoteParam.isOciPioStatus == 'Y'){
					$scope.show_error_msg_1 = false;
					$scope.show_error_msg_2 = true;
					$scope.show_error_msg_3 = false;
				}else{
					$scope.show_error_msg_1 = false;
					$scope.show_error_msg_2 = true;
					$scope.show_error_msg_3 = true;
				}
			}
		}	
	
	
	// Pre-population of UI fields.
	$scope.prePopulateFields = function(){
			if(localStorageService.get("pedDetails")){
				$scope.selectedDisease.diseaseList = localStorageService.get("pedDetails");
			}
			if(travelDetailsCookie){
				$scope.travelDetails = travelDetailsCookie;
				var startDate = angular.copy($scope.travelDetails.startdate);
				var endDay =   startDate.split("/")[0];
				var endMonth = startDate.split("/")[1];
				var endYear =  startDate.split("/")[2];
				var travelEndDateMin = new Date(Date.parse(endMonth+'/'+endDay+'/'+endYear));
				if(travelEndDateMin < new Date())
					{
					var today = new Date(); 
					var d = today.getDate();
					var m = today.getMonth()+1;
					$scope.travelDetails.startdate = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+today.getFullYear());
					var travelEndDate = new Date(Date.parse(((m <= 9)?'0'+m:m)+'/'+((d <= 9)?'0'+d:d)+'/'+today.getFullYear()));
					travelEndDate.setDate(travelEndDate.getDate() + 1);
					d= travelEndDate.getDate();
					m= travelEndDate.getMonth()+1;
					$scope.travelDetails.enddate   = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+travelEndDate.getFullYear());
					}
				$scope.initPolicyDates();
			}else{
				var today = new Date(); 
				var d = today.getDate();
				var m = today.getMonth()+1;
				$scope.travelDetails.startdate = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+today.getFullYear());
				var travelEndDate = new Date(Date.parse(((m <= 9)?'0'+m:m)+'/'+((d <= 9)?'0'+d:d)+'/'+today.getFullYear()));
				travelEndDate.setDate(travelEndDate.getDate() + 1);
				d= travelEndDate.getDate();
				m= travelEndDate.getMonth()+1;
				$scope.travelDetails.enddate   = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+travelEndDate.getFullYear());	
				$scope.travelDetails.tripType  = $scope.tripTypeList[0].tripType;
				$scope.initPolicyDates();
			}
			if(travelQuoteCookie){
				$scope.quoteParam		  = travelQuoteCookie.quoteParam;
			}
			$scope.ageList = [];
			for(var i=0;i<$scope.quoteParam.travellers.length;i++){
				$scope.ageList.push($scope.quoteParam.travellers[i].age);
				$scope.quoteParam.travellers[i].status = true;
				$scope.quoteParam.travellers[i].age = parseInt(String($scope.quoteParam.travellers[i].age));
				for(var j=0;j<$scope.relationTypeCopy.length;j++){
					if($scope.relationTypeCopy[j].member == $scope.quoteParam.travellers[i].relation){
						if($scope.quoteParam.travellers[i].relation != SON || $scope.quoteParam.travellers[i].relation != DAUGHTER){
							$scope.relationTypeCopy[j].val = true;
						}
					}
				}
			}
			$scope.relationType = angular.copy($scope.relationTypeCopy);
			$scope.numberOfTraveller  = $scope.quoteParam.travellers.length;
			$scope.travellersList 	  = $scope.quoteParam.travellers;
	}
	
	
	// for fetching the sum insured list
	$scope.fetchSumInsured = function (){
		var sumInsuredDocId = $scope.globalLabel.documentType.travelSumInsuredList;
		getDocUsingId(RestAPI,sumInsuredDocId , function(suminsuredList){
			$scope.sumInsuredList = suminsuredList.SumInsured;
			localStorageService.set("SumInsuredList",$scope.sumInsuredList);
			$scope.fetchDiseaseListFormDB();
		});
	}
	
	// for preExisting Disease
	$scope.fetchDiseaseListFormDB = function(){
		getListFromDB(RestAPI, "", "Disease", $scope.globalLabel.request.findAppConfig, function(callback){
			if(callback.responseCode == $scope.globalLabel.responseCode.success){
				$scope.diseaseList = callback.data;
				localStorageService.set("diseaseList",$scope.diseaseList);
			}
		})}
	
	// Function created to fetch default input parameters for travel.
	$scope.fetchDefaultInputParamaters = function(defaultQuoteStatus,defaultInputParamCallback){
		
		if(defaultQuoteStatus){

				if(travelQuoteCookie.quoteParam){
					$scope.quoteParam = travelQuoteCookie.quoteParam;
				}
				if(localStorageService.get("SumInsuredList")){
					$scope.sumInsuredList = localStorageService.get("SumInsuredList");
				}else{
					$scope.fetchSumInsured();
				}
				
				if(localStorageService.get("diseaseList")){
					$scope.diseaseList = localStorageService.get("diseaseList");
				}
				
				if(localStorageService.get("isDiseasedForTravel")){
					$scope.isDiseased = localStorageService.get("isDiseasedForTravel");
				}
				
				if(travelDetailsCookie){
					$scope.travelDetails = travelDetailsCookie;
				}			
			}else{
				$scope.quoteParam = defaultTravelQuoteParam.quoteParam;
				$scope.travelDetails = defaultTravelQuoteParam.travelDetails;
			if($rootScope.wordPressEnabled){
				$scope.quote = {};
				$scope.quote.quoteParam = $scope.quoteParam;
				$scope.quote.travelDetails = $scope.travelDetails;
				localStorageService.set("selectedBusinessLineId",$scope.globalLabel.businessLineType.travel);
				localStorageService.set("travelQuoteInputParamaters", $scope.quote);
				localStorageService.set("travelDetails", $scope.travelDetails);
			}
				$scope.fetchSumInsured();
				$scope.isDiseased = false;}
			$scope.checkQuestionStatus($scope.quoteParam);
			$scope.callSingleClickQuote();
			$scope.prePopulateFields();
			$rootScope.loading = false;
//			defaultInputParamCallback();
		
	};
	
	if(travelQuoteCookie !== null && String(travelQuoteCookie) !== $scope.globalLabel.errorMessage.undefinedError){
		$scope.fetchDefaultInputParamaters(true, function(){});
	}else{
		$scope.fetchDefaultInputParamaters(false, function(){});
	}
	
	// Below piece of code written to access function from outside controller.
	$scope.$on("callSingleClickTravelQuote", function(){
		$scope.singleClickTravelQuote();
	});
	
	// Method to get list of Continent details from DB.
	$scope.getContinentList = function(countryName){
			return $http.get(getServiceLink+$scope.globalLabel.documentType.destinationDetails+"&q="+countryName).then(function(response){
			return JSON.parse(response.data).data;
		});
	};
	
	
	$scope.newDestination = function(destination){
		return {
            name: destination,
         };
	};
	
	
	$scope.getDisease = function(){
		return $scope.selectedDisease.diseaseList;
	};
	
	
	
	$scope.diseaseClick = function(){
		if($scope.quoteParam.pedStatus == 'Y'){
			$scope.isDiseased = true;
			$scope.toggleHealth();
		}else{
			$scope.isDiseased = false;
			$scope.selectedDisease.diseaseList = [];
			for(var i = 0; i < $scope.diseaseList.length; i++){
				$scope.diseaseList[i].travellersList = [];
			}
			setTimeout(function(){
				$scope.callSingleClickQuote();
			},100);
		}
	};
	
	$scope.checkDisease = function(value, checked){
		var idx = $scope.selectedDisease.diseaseList.indexOf(value);
		if (idx >= 0 && !checked){
			$scope.selectedDisease.diseaseList.splice(idx, 1);
		}
		if (idx < 0 && checked){
			$scope.selectedDisease.diseaseList.push(value);
		}
	};

	$scope.modalHealth = false;
	$scope.toggleHealth = function(){
		if(!$scope.instantQuoteHealthForm){
			$scope.oldSelectedDiseaseList = angular.copy($scope.selectedDisease.diseaseList);
			$scope.selectedTravellerArray = $scope.quoteParam.travellers;
			$scope.modalHealth = !$scope.modalHealth;
		}
	};
	
	
	$scope.closePreExistingDiseaseModal = function(){
		var deleteList = [];
		
		
		for(var i = 0; i < $scope.diseaseList.length; i++){
			if(p365Includes($scope.selectedDisease.diseaseList,$scope.diseaseList[i].diseaseId) == true && $scope.diseaseList[i].travellersList.length == 0){
				deleteList.push($scope.diseaseList[i].diseaseId);
			}else if(p365Includes($scope.oldSelectedDiseaseList,$scope.diseaseList[i].diseaseId) == false){
				deleteList.push($scope.diseaseList[i].diseaseId);
			}
		}

		if($scope.selectedDisease.diseaseList.length == 0){
			$scope.quoteParam.pedStatus = "N";
			$scope.isDiseased=false;
		}

		$scope.selectedDisease.diseaseList = $scope.selectedDisease.diseaseList.filter(function(obj) {
			return deleteList.indexOf(obj) === -1;
		});

		$scope.modalHealth = false;
	};

				
		$scope.submitPreDiseaseList = function(){
			var submitDiseaseForm = true;
			var i;
			$scope.ratingParam.criticalIllness = "N";
			$scope.ratingParam.organDonar = "N";
			if($scope.selectedDisease.diseaseList.length > 0){
				for( i = 0; i < $scope.diseaseList.length; i++){
					if(p365Includes($scope.selectedDisease.diseaseList,$scope.diseaseList[i].diseaseId) == true){
						if($scope.diseaseList[i].diseaseType == "OrganDonar"){
							$scope.ratingParam.organDonar = "Y";
						}

						if($scope.diseaseList[i].diseaseType == "Critical"){
							$scope.ratingParam.criticalIllness = "Y";
						}

						if($scope.diseaseList[i].travellersList.length == 0){
							$scope.diseaseError = "Please select sumembers against each selected disease";
							submitDiseaseForm = false;
						}
					}
				}
			}else{
				submitDiseaseForm = false;
				$scope.diseaseError = "Please select disease before submit.";
			}


			if(submitDiseaseForm){
				$scope.modalHealth = false;
				$scope.diseaseError = "";

				if($scope.selectedDisease.diseaseList.length==0){
					$scope.quoteParam.pedStatus = "N";
					$scope.isDiseased=false;
				}
				
				for( i = 0; i < $scope.selectedTravellerArray.length; i++){
					$scope.selectedTravellerArray[i].diseaseDetails = [];
					$scope.diseaseDetails = [];
					for(var j = 0; j < $scope.diseaseList.length; j++){
						if(p365Includes($scope.selectedDisease.diseaseList,$scope.diseaseList[j].diseaseId) == true){
							for(var k = 0; k < $scope.diseaseList[j].travellersList.length; k++){
								if($scope.selectedTravellerArray[i].traveller_id == $scope.diseaseList[j].travellersList[k].traveller_id){
									$scope.diseaseList[j].travellersList[k].status = true;

									var diseaseDetail={};
									diseaseDetail.diseaseCode = $scope.diseaseList[j].diseaseId;
									diseaseDetail.diseaseName = $scope.diseaseList[j].disease;
									diseaseDetail.masterDiseaseCode = $scope.diseaseList[j].diseaseCode;
									diseaseDetail.applicable = true;
									$scope.diseaseDetails.push(diseaseDetail);
								}
							}
						}
						else{
							$scope.diseaseList[j].travellersList = [];
						}
					}
					if($scope.diseaseDetails.length > 0){
						localStorageService.set("diseaseList",$scope.diseaseList);
						$scope.selectedTravellerArray[i].diseaseDetails = $scope.diseaseDetails;
					}
				}
				$scope.quoteParam.travellers = $scope.selectedTravellerArray;
				localStorageService.set("selectedTravellerArray", $scope.selectedTravellerArray);	
				setTimeout(function(){
					$scope.callSingleClickQuote();
				},100);
			}
		};
		
		$scope.removePreDisease = function(data){
			var i;
			for(i = 0; i < $scope.selectedDisease.diseaseList.length; i++){
				if($scope.selectedDisease.diseaseList[i] == data.diseaseId){
					$scope.selectedDisease.diseaseList.splice(i, 1);
					break;
				}
			}

			for( i = 0; i < $scope.diseaseList.length; i++){
				if($scope.diseaseList[i].diseaseId == data.diseaseId){
					$scope.diseaseList[i].travellersList = [];
					break;
				}
			}
			if($scope.selectedDisease.diseaseList.length == 0){
				$scope.quoteParam.pedStatus = "N";
				$scope.isDiseased = false;
			}

			$scope.submitPreDiseaseList();
		};
}]);