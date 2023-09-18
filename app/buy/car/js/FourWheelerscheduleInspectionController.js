/*QuoteResult Controller*/

'use strict';
angular.module('FourWheelerscheduleInspection', ['CoreComponentApp','LocalStorageModule', 'checklist-model', 'ngMessages'])
.controller('FourWheelerscheduleInspectionController', ['$scope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', function($scope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval){
	// Setting application labels to avoid static assignment.
	var applicationLabels  = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	

	$scope.proposerDetails = {};
	$scope.insuranceDetails = {};
	$scope.insuredInfo = {};
	$scope.insuredDiseases = [];
	$scope.insuredDiseaseList = [];
	$scope.insuredList = [];
	$scope.insuredObjectList = [];
	$scope.vehicleDetails = {};

	$scope.screenOneStatus = true;
	$scope.screenTwoStatus = false;
	
	$scope.selectedProduct = localStorageService.get("carSelectedProduct");
	console.log("car selected product :"+JSON.stringify($scope.selectedProduct));
	$scope.selectedProductInputParam = localStorageService.get("carQuoteInputParamaters");
	//alert("car quote input param :"+JSON.stringify($scope.selectedProductInputParam));
	console.log("car quote input param :"+JSON.stringify($scope.selectedProductInputParam));
	//$scope.userGeoDetails = localStorageService.get("userGeoDetails");
	//$scope.carrierList = localStorageService.get("carrierList");
	/*
	$scope.carrierList = [{"name":"Apollo Munich"},{"name":"Bharti AXA"},{"name":"Future Generali"},
	                      {"name":"HDFC ERGO"},{"name":"ICICI Lombard"},{"name":"L&T General"},
	                      {"name":"Liberty Videocon"},{"name":"Max Bupa"},{"name":"National Insurance India"},
	                      {"name":"New India"},{"name":"Oriental Insurance"},{"name":"Reliance General"},
	                      {"name":"Royal Sundaram"},{"name":"SBI General"},{"name":"TATA AIG"},
	                      {"name":"United India"},{"name":"Universal Sompo"}];
	*/
	$scope.carrierList = companyNamesCarGeneric;
	//alert("carrier list :"+JSON.stringify($scope.carrierList));
	$scope.addOnCovers = localStorageService.get("addOnCoverListForCar");
	//alert("add on covers :"+JSON.stringify($scope.addOnCovers));
	//$scope.selectedAddOnCovers = $scope.vehicleDetails.selectedAddOnCovers == undefined ? [] : $scope.vehicleDetails.selectedAddOnCovers;
	var quoteUserInfo = localStorageService.set("quoteUserInfo");
	$scope.vehicleDetails = localStorageService.get("selectedCarDetails");
	//alert("vehicle details :"+JSON.stringify($scope.vehicleDetails));
	console.log("vehicle details :"+JSON.stringify($scope.vehicleDetails));
	if($scope.vehicleDetails.insuranceType.value == "renew")
		$scope.showPreviousPolicyForm=true;
	else 
		$scope.showPreviousPolicyForm=false;
	if($scope.vehicleDetails.policyStatus.policyType == "expired" && $scope.vehicleDetails.policyStatus.displayText2 == "> 90 days"){
		$scope.showInspectionButton=true;
		$scope.showPaymentButton=false;
	}
	else{
		$scope.showInspectionButton=false;
		$scope.showPaymentButton=true;
	}
	
	var todayDate = new Date();
	//alert("policy status :"+JSON.stringify($scope.vehicleDetails.policyStatus.label));
	if($scope.vehicleDetails.policyStatus.label == "Not yet expired"){
		//alert("case not yet expired");
		var tempPolicyStartDate=$scope.vehicleDetails.policyStatus.expiryDate.split("/");
		$scope.insuranceDetails.policyStartDate = tempPolicyStartDate[1] + "/" + tempPolicyStartDate[0] + "/" + tempPolicyStartDate[2];
	}
	else{
		//alert("case others");
		var tomorrow = new Date(); 
		tomorrow.setDate(todayDate.getDate()+1);
		//$scope.insuranceDetails.policyStartDate = todayDate.getDate() + "/" + (Number(todayDate.getMonth()) + 1) + "/" + todayDate.getFullYear();
		$scope.insuranceDetails.policyStartDate = tomorrow.getDate() + "/" + (Number(tomorrow.getMonth()) + 1) + "/" + tomorrow.getFullYear();
	}
	/* Initiating Policy End Date */
	if(String($scope.insuranceDetails.policyStartDate) !== "undefined"){
		todayDate = new Date();
		var polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
		var tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];
		var polEndDate;
		if(new Date(tempPolStartDate) < todayDate){
			$scope.insuranceDetails.policyStartDate = todayDate.getDate() + "/" + (Number(todayDate.getMonth()) + 1) + "/" + todayDate.getFullYear();
			polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
			tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];
			polEndDate = new Date(new Date().setDate((new Date(String(tempPolStartDate))).getDate() + 364));
			$scope.insuranceDetails.policyEndDate = polEndDate.getDate() + "/" + (Number(polEndDate.getMonth()) + 1) + "/" + polEndDate.getFullYear();
		}else{
		    polEndDate = new Date(new Date().setDate((new Date(String(tempPolStartDate))).getDate() + 364));
			$scope.insuranceDetails.policyEndDate = polEndDate.getDate() + "/" + (Number(polEndDate.getMonth()) + 1) + "/" + polEndDate.getFullYear(); 
		}
	}
	
	/*
	//alert("vehicle details add on covers:"+JSON.stringify($scope.vehicleDetails.selectedAddOnCovers));
	$scope.selectedAddOnCovers = [];
	if($scope.vehicleDetails.selectedAddOnCovers!=undefined){
	for(var i=0;i<$scope.addOnCovers.length;i++)
	{
		for(var j=0;j<$scope.vehicleDetails.selectedAddOnCovers.length;j++)
		{
			if($scope.addOnCovers[i].riderId==$scope.vehicleDetails.selectedAddOnCovers[j].riderId)
			{
				$scope.selectedAddOnCovers.push($scope.addOnCovers[i]);
			}
		}
		
	}
	}
	
	
	$scope.productRiders=[];
	var rider={};
	for(var i=0;i<$scope.selectedProduct.riderList.length;i++)
	{
		for(var j=0;j<$scope.vehicleDetails.selectedAddOnCovers.length;j++)
		{
			if($scope.selectedProduct.riderList[i]["com.sutrr.quote.carquotecalc.AddOnCover"].riderId==$scope.vehicleDetails.selectedAddOnCovers[j].riderId)
			{	
				rider=$scope.vehicleDetails.selectedAddOnCovers[j];
				rider.premium=$scope.selectedProduct.riderList[i]["com.sutrr.quote.carquotecalc.AddOnCover"].riderPremiumWithServiceTax;
				$scope.productRiders.push(rider);				
			}
		}
	}
	*/
	//alert("riders :"+JSON.stringify($scope.productRiders));
	/*
	var searchReq ={"documentType":"Carrier","health":"Y"}
	 RestAPI.invoke(searchReq).then(function(callback){
	  $scope.carrierNames = callback.data; 
	  alert("carrier names :"+JSON.stringify($scope.carrierNames));
	 });
	 */
	//alert("selected add on covers :"+JSON.stringify($scope.selectedAddOnCovers));
	
	
	//fetching riders
	var buyScreenParam = {};
	buyScreenParam.businessLineId = localStorageService.get("selectedBusinessLineId");
	buyScreenParam.carrierId = $scope.selectedProduct.carrierId;
	buyScreenParam.productId =$scope.selectedProduct.productId;

	buyScreenParam.documentType = "CarPlan";
	//alert("buy screen param :"+JSON.stringify(buyScreenParam));
	getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getPlanRiders, buyScreenParam, function(buyScreenRiders){
	 //alert("buyScreenRiders.responseCode :"+JSON.stringify(buyScreenRiders.responseCode));
	if(buyScreenRiders.responseCode == $scope.globalLabel.responseCode.success){
	  localStorageService.set("buyScreenRidersForCar", buyScreenRiders.data);
	 }else{
	  localStorageService.set("buyScreenRidersForCar", undefined);
	 }
	 //alert("product riders :"+JSON.stringify(localStorageService.get("buyScreenRidersForCar")));
	});
	
	
	$scope.selectedProductInputParam.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
	$scope.selectedProductInputParam.quoteParam = localStorageService.get("carQuoteInputParamaters").quoteParam;
	$scope.maritalStatusType = [{"name" : "MARRIED", "id" : 1}, {"name" : "BACHELOR/SINGLE/UNMARRIED", "id" : 2}, {"name" : "DIVORCEE/WIDOW(ER)", "id" : 3}];
	$scope.relationList = [{"name":"Son"}, {"name":"Daughter"}, {"name":"Father"}, {"name":"Mother"}, {"name":"Spouse"}];
	$scope.ncbList = [{"value":"15"},{"value":"20"},{"value":"25"},{"value":"30"},{"value":"35"},{"value":"40"},{"value":"45"}];
	//alert("selected input :"+JSON.stringify($scope.selectedProductInputParam));
	$scope.proposerDetails.gender = "Male";
	$scope.proposerDetails.emailId = String(quoteUserInfo.emailId) !== "undefined" ? quoteUserInfo.emailId : "";
	$scope.proposerDetails.mobileNumber = String(quoteUserInfo.mobileNumber) !== "undefined" ? quoteUserInfo.mobileNumber : "";
	$scope.proposerDetails.lastName = String(quoteUserInfo.lastName) !== "undefined" ? quoteUserInfo.lastName : "";
	$scope.proposerDetails.firstName = String(quoteUserInfo.firstName) !== "undefined" ? quoteUserInfo.firstName : "";
	$scope.proposerDetails.dateOfBirth = $scope.vehicleDetails.dateOfBirth;
	$scope.proposerDetails.occupation = localStorageService.get("selectedOccupationForCar");
	//$scope.coverageDetails.voluntaryDeductibleAmount = $scope.selectedProductInputParam.quoteParam.deductible;
	$scope.previousPolicyDetails = {};
	$scope.previousPolicyDetails.expiryDate = $scope.vehicleDetails.policyStatus.displayText2;
	var tempNcbPosition;
	for(var i=0;i<$scope.ncbList.length;i++)
	{
		//alert("$scope.selectedProduct.ncbPercentage :"+$scope.selectedProduct.ncbPercentage);
		//alert("$scope.ncbList[i].value :"+$scope.ncbList[i].value);
		if($scope.selectedProduct.ncbPercentage == $scope.ncbList[i].value){
			tempNcbPosition=i;
			break;
		}
		//alert("tempNcbPosition :"+tempNcbPosition);		
	}
	$scope.previousPolicyDetails.ncb = $scope.ncbList[tempNcbPosition].value;

	$scope.putNomineeLastName = function(){
		$scope.nominationDetails.lastName=$scope.proposerDetails.lastName;
	};
	$scope.updatePremium = function(){
		for(var i=0;i<$scope.selectedAddOnCovers.length;i++){
			for(var j=0;j<$scope.selectedProduct.riderList.length;j++){
				if($scope.selectedAddOnCovers[i].riderId == $scope.selectedProduct.riderList[j]["com.sutrr.quote.carquotecalc.AddOnCover"].riderId){
					$scope.selectedProduct.grossPremium+=$scope.selectedProduct.riderList[j]["com.sutrr.quote.carquotecalc.AddOnCover"].riderPremiumWithServiceTax;
				}
			}
		}
	};
	
	//fxn to calculate default area details
	$scope.calcDefaultAreaDetails = function(areaCode){
		$http.get(getServiceLink+"Pincode"+"&q="+areaCode).then(function(response){
			var areaDetails = JSON.parse(response.data);
			if(areaDetails.responseCode == $scope.globalLabel.responseCode.success){
				$scope.onSelectPinOrArea(areaDetails.data[0]);						
			}
		});
	};
	$scope.proposerDetails.pincode = localStorageService.get("cityDataFromIP") ? localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : "110002" : "110002";
	$scope.calcDefaultAreaDetails($scope.proposerDetails.pincode);

	$scope.nominationDetails = {};
	$scope.vehicleDetails = {};
	$scope.nominationDetails.dateOfBirth = '01/07/1976';
	//$scope.vehicleDetails.registrationNumber = $scope.selectedProductInputParam.vehicleInfo.registrationNumber;
	$scope.vehicleDetails.carMake = $scope.selectedProductInputParam.vehicleInfo.name;
	$scope.vehicleDetails.carModel = $scope.selectedProductInputParam.vehicleInfo.model;
	$scope.vehicleDetails.carVariant = $scope.selectedProductInputParam.vehicleInfo.variant;
	$scope.vehicleDetails.fuelType = $scope.selectedProductInputParam.vehicleInfo.fuel;
	$scope.vehicleDetails.regYear = $scope.selectedProductInputParam.vehicleInfo.regYear;
	$scope.vehicleDetails.manufacturingDate = '01/01/'+$scope.selectedProductInputParam.vehicleInfo.regYear;
	
	
	$scope.modalPIN = false;
	$scope.togglePin = function(){		
		$scope.modalPIN = !$scope.modalPIN;
		$scope.hideModal = function(){
			$scope.modalPIN = false;
		};
	};

	
	// Method to get list of pincodes
	$scope.getPinCodeAreaList = function(areaName){
		var docType;
		if(isNaN(areaName)){
				docType = "Area";
		}else{
			 	docType = "Pincode";
		}

		return $http.get(getServiceLink+docType+"&q="+areaName).then(function(response){
			//alert("response :"+JSON.stringify(response));
			return JSON.parse(response.data).data;
		});
	};

	$scope.onSelectPinOrArea = function(item){
		$scope.displayArea = item.area + ", " + item.district;
		$scope.modalPIN = false;
		$scope.proposerDetails.area = item.area;
		$scope.proposerDetails.pincode = item.pincode;
		$scope.proposerDetails.city = item.district;
		$scope.proposerDetails.state = item.state;
		localStorageService.set("userGeoDetails", item);
	};
	
	$scope.validateProposerDateOfBirth = function(){
		if(getAgeFromDOB($scope.proposerDetails.dateOfBirth) < 18){
			$scope.proposerDetails.dateOfBirth = "";
		}
	};
	
	$scope.validateNomineeDateOfBirth = function(){
		if(getAgeFromDOB($scope.nominationDetails.dateOfBirth) < 18){
			$scope.nominationDetails.dateOfBirth = "";
		}
	};
		
	$scope.validateInsuredDateOfBirth = function(){
		if($scope.insuredRelation.relation == "Self" || $scope.insuredRelation.relation == "Spouse"){
			if(getAgeFromDOB($scope.insuredDateOfBirth) < 18){
				$scope.insuredDateOfBirth = $scope.insuredRelation.dob;
			}
		}else if($scope.insuredRelation.relation == "Son" || $scope.insuredRelation.relation == "Daughter"){
			for(var i = 0; i < $scope.insuredList.length; i++){
				if($scope.insuredList[i].relation.relation == "Self" && ($scope.insuredList[i].relation.age - (getAgeFromDOB($scope.insuredDateOfBirth))) < 18){
					$scope.insuredDateOfBirth = $scope.insuredRelation.dob;
					break;
				}
			}
		}
	};
	
	
	
	$scope.changePolicyTerm = function(){
		var polStartDate;
		var tempPolStartDate;
		var polEndDate;
		if($scope.proposerDetails.policyTerm.term == 1){
			polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
			tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];
			polEndDate = new Date(new Date().setDate((new Date(String(tempPolStartDate))).getDate() + 364));
			$scope.insuranceDetails.policyEndDate = polEndDate.getDate() + "/" + (Number(polEndDate.getMonth()) + 1) + "/" + polEndDate.getFullYear();
		}else{
			 polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
			 tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];
			 polEndDate = new Date(new Date().setDate((new Date(String(tempPolStartDate))).getDate() + 364));
			$scope.insuranceDetails.policyEndDate = polEndDate.getDate() + "/" + (Number(polEndDate.getMonth()) + 1) + "/" + (Number(polEndDate.getFullYear()) + 1);
		}
	};

	$scope.calcPolicyEndDate = function(){
		var polEndDate;
		
		if(String($scope.insuranceDetails.policyStartDate) !== "undefined"){
			var todayDate = new Date();
			var polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
			var tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];

			if(new Date(tempPolStartDate) < todayDate){
				$scope.insuranceDetails.policyStartDate = todayDate.getDate() + "/" + (Number(todayDate.getMonth()) + 1) + "/" + todayDate.getFullYear();
				polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
				tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];
				polEndDate = new Date(new Date().setDate((new Date(String(tempPolStartDate))).getDate() + 364));
				$scope.insuranceDetails.policyEndDate = polEndDate.getDate() + "/" + (Number(polEndDate.getMonth()) + 1) + "/" + polEndDate.getFullYear();
			}else{
				 polEndDate = new Date(new Date().setDate((new Date(String(tempPolStartDate))).getDate() + 364));
				$scope.insuranceDetails.policyEndDate = polEndDate.getDate() + "/" + (Number(polEndDate.getMonth()) + 1) + "/" + polEndDate.getFullYear(); 
			}
		}
	};

	$scope.validatePrevPolStartDate = function(){
		if(String($scope.insuranceDetails.prevPolicyStartDate) !== "undefined"){
			var oneYearPrevDate = new Date(new Date().setDate(new Date().getDate() - 364));
			var prePolStartDate = $scope.insuranceDetails.prevPolicyStartDate.split("/");
			var tempPrePolStartDate = prePolStartDate[1] + "/" + prePolStartDate[0] + "/" + prePolStartDate[2];

			if(new Date(tempPrePolStartDate) > oneYearPrevDate){
				$scope.prevPolStartDateErr = true;
				$scope.insuranceDetails.prevPolicyStartDate = "";
			}else{
				$scope.prevPolStartDateErr = false;
				prePolStartDate = $scope.insuranceDetails.prevPolicyStartDate.split("/");
				tempPrePolStartDate = prePolStartDate[1] + "/" + prePolStartDate[0] + "/" + prePolStartDate[2];

				var prePolEndDate = new Date(tempPrePolStartDate);
				prePolEndDate.setFullYear(Number(prePolStartDate[2])+1);
				$scope.insuranceDetails.prevPolicyEndDate = prePolEndDate.getDate() + "/" + (Number(prePolEndDate.getMonth()) + 1) + "/" + prePolEndDate.getFullYear();
			}
		}
	};

	$scope.validatePrevPolEndDate = function(){
		if(String($scope.insuranceDetails.prevPolicyEndDate) !== "undefined" && String($scope.insuranceDetails.prevPolicyStartDate) !== "undefined"){
			var currentDate = new Date();
			var prePolEndDate = $scope.insuranceDetails.prevPolicyEndDate.split("/");
			var tempPrePolEndDate = prePolEndDate[1] + "/" + prePolEndDate[0] + "/" + prePolEndDate[2];
			var prePolStartDate = $scope.insuranceDetails.prevPolicyStartDate.split("/");
			var tempPrePolStartDate = prePolStartDate[1] + "/" + prePolStartDate[0] + "/" + prePolStartDate[2];

			var calcPrePolStartDate = new Date(tempPrePolStartDate);
			calcPrePolStartDate.setFullYear(Number(prePolStartDate[2])+1);

			if((new Date(tempPrePolEndDate) > currentDate) || (new Date(tempPrePolEndDate) < calcPrePolStartDate)){
				$scope.prevPolEndDateErr = true;
				$scope.insuranceDetails.prevPolicyEndDate = "";
			}else{
				$scope.prevPolEndDateErr = false;
			}
		}
	};

	$scope.cancel = function(){
		$scope.insuredFirstName = "";
		$scope.insuredLastName = "";
		$scope.insuredGender = "Male";
		$scope.insuredRelation = "";
		$scope.insuredDateOfBirth = "";
		$scope.insuredOccupation = "";
		$scope.insuredHeight = "";
		$scope.insuredWeight = "";
		$scope.isPersonalAccidentApplicable = "";
		$scope.insuredMedicineLastOneYear = "No";
		$scope.insuredInfo.insuredCriticalDrug = "";
		$scope.insuredDiseases = [];
		
		$scope.updateBtnStatus = false;
		$scope.addBtnStatus = true;
	};


	$scope.updateInsured = function(){
		var i;
		if(!$scope.addInsuredForm.$invalid){
			$scope.updateBtnStatus = false;
			$scope.addBtnStatus = true;

			var selectedDiseaseList = [];

			for( i = 0; i < $scope.insuredDiseases.length; i++){
				for(var j = 0; j < $scope.insuredDiseaseList.length; j++){
					if($scope.insuredDiseases[i].id == $scope.insuredDiseaseList[j].id){
						delete $scope.insuredDiseaseList[j].$$hashKey;
						selectedDiseaseList.push($scope.insuredDiseaseList[j]);
						break;
					}
				}
			}

			var criticalCancer = "false";
			var criticalRenal = "false";
			var criticalHeart = "false";
			var criticalPsychiatric = "false";
			var criticalDrugs = "false";

			for( i = 0; i < selectedDiseaseList.length; i++){
				if(selectedDiseaseList[i].disease == "Cancer"){
					criticalCancer = "true";
				}
				if(selectedDiseaseList[i].disease == "Kidney related"){
					criticalRenal = "true";
				}
				if(selectedDiseaseList[i].disease == "Heart ailments"){
					criticalHeart = "true";
				}
				if(selectedDiseaseList[i].disease == "Brain & Spinal cord disorders"){
					criticalPsychiatric = "true";
				}
			}

			var udatedInsured = {
					"name" : $scope.insuredFirstName + " " + (String($scope.insuredLastName) != "undefined" ? $scope.insuredLastName : ""),
					"gender" : $scope.insuredGender,
					"relation" : $scope.insuredRelation,
					"relationshipId" : $scope.insuredRelation.id,
					"dateofbirth" : $scope.insuredDateOfBirth,
					"occupation" : $scope.insuredOccupation,
					"height" : Number($scope.insuredHeight),
					"weight" : Number($scope.insuredWeight),
					"selectedDiseases" : selectedDiseaseList,
					"isPersonalAccidentApplicable" : $scope.isPersonalAccidentApplicable,
					"takingMedicineLastOneYear" : $scope.insuredMedicineLastOneYear,
					"criticalDrugName" : ($scope.insuredMedicineLastOneYear == "Yes" ? $scope.insuredInfo.insuredCriticalDrug : ""),
					"criticalDrugs" : ($scope.insuredMedicineLastOneYear == "Yes" ? "true" : "false"),
					"criticalCancer" : criticalCancer,
					"criticalRenal" : criticalRenal,
					"criticalHeart" : criticalHeart,
					"criticalPsychiatric" : criticalPsychiatric
			};

			$scope.insuredList[$scope.selEditInsuredIndex] = udatedInsured;

			$scope.insuredFirstName = "";
			$scope.insuredLastName = "";
			$scope.insuredGender = "Male";
			$scope.insuredRelation = "";
			$scope.insuredDateOfBirth = "";
			$scope.insuredOccupation = "";
			$scope.insuredHeight = "";
			$scope.insuredWeight = "";
			$scope.isPersonalAccidentApplicable = "";
			$scope.insuredMedicineLastOneYear = "No";
			$scope.insuredInfo.insuredCriticalDrug = "";
			$scope.insuredDiseases = [];
		}else{
			//alert("Please fill all the required fields.");
		}
	};

	$scope.editInsured = function(selectedInsured, selectedIndex){
		$scope.updateBtnStatus = true;
		$scope.addBtnStatus = false;

		$scope.selEditInsuredIndex = selectedIndex;

		var selectedDiseaseList = [];
		var insuredName = selectedInsured.name.split(" ");

		$scope.insuredFirstName = insuredName[0] != "undefined" ? insuredName[0] : "";
		$scope.insuredLastName = insuredName[2] != "undefined" ? insuredName[2] : "";
		$scope.insuredGender = selectedInsured.gender;
		$scope.insuredRelation = selectedInsured.relation;
		$scope.insuredDateOfBirth = selectedInsured.dateofbirth;
		$scope.insuredOccupation = selectedInsured.occupation;
		$scope.insuredHeight = selectedInsured.height;
		$scope.insuredWeight = selectedInsured.weight;
		$scope.insuredMedicineLastOneYear = selectedInsured.takingMedicineLastOneYear;
		$scope.insuredInfo.insuredCriticalDrug = selectedInsured.criticalDrugName;

		for(var i = 0; i < selectedInsured.selectedDiseases.length; i++){
			var diseaseId = {};
			diseaseId.id = selectedInsured.selectedDiseases[i].id;
			selectedDiseaseList.push(diseaseId);
		}

		$scope.insuredDiseases = selectedDiseaseList;
	};

	$scope.insertInsured = function(){
		var i;
		if(!$scope.addInsuredForm.$invalid){
			var selectedDiseaseList = [];

			for(i = 0; i < $scope.insuredDiseases.length; i++){
				for(var j = 0; j < $scope.insuredDiseaseList.length; j++){
					if($scope.insuredDiseases[i].id == $scope.insuredDiseaseList[j].id){
						delete $scope.insuredDiseaseList[j].$$hashKey;
						selectedDiseaseList.push($scope.insuredDiseaseList[j]);
						break;
					}
				}
			}

			var criticalCancer = "false";
			var criticalRenal = "false";
			var criticalHeart = "false";
			var criticalPsychiatric = "false";
			var criticalDrugs = "false";

			for( i = 0; i < selectedDiseaseList.length; i++){
				if(selectedDiseaseList[i].disease == "Cancer"){
					criticalCancer = "true";
				}
				if(selectedDiseaseList[i].disease == "Kidney related"){
					criticalRenal = "true";
				}
				if(selectedDiseaseList[i].disease == "Heart ailments"){
					criticalHeart = "true";
				}
				if(selectedDiseaseList[i].disease == "Brain & Spinal cord disorders"){
					criticalPsychiatric = "true";
				}
			}

			$scope.insuredList.push(
					{
						"name" : $scope.insuredFirstName + " " + (String($scope.insuredLastName) != "undefined" ? $scope.insuredLastName : ""),
						"gender" : $scope.insuredGender,
						"relation" : $scope.insuredRelation,
						"relationshipId" : $scope.insuredRelation.id,
						"dateofbirth" : $scope.insuredDateOfBirth,
						"occupation" : $scope.insuredOccupation,
						"height" : Number($scope.insuredHeight),
						"weight" : Number($scope.insuredWeight),
						"selectedDiseases" : selectedDiseaseList,
						"isPersonalAccidentApplicable" : $scope.isPersonalAccidentApplicable,
						"takingMedicineLastOneYear" : $scope.insuredMedicineLastOneYear,
						"criticalDrugName" : ($scope.insuredMedicineLastOneYear == "Yes" ? $scope.insuredInfo.insuredCriticalDrug : ""),
						"criticalDrugs" : ($scope.insuredMedicineLastOneYear == "Yes" ? "true" : "false"),
						"criticalCancer" : criticalCancer,
						"criticalRenal" : criticalRenal,
						"criticalHeart" : criticalHeart,
						"criticalPsychiatric" : criticalPsychiatric
					}
			);

			$scope.insuredFirstName = "";
			$scope.insuredLastName = "";
			$scope.insuredGender = "Male";
			$scope.insuredRelation = "";
			$scope.insuredDateOfBirth = "";
			$scope.insuredOccupation = "";
			$scope.insuredHeight = "";
			$scope.insuredWeight = "";
			$scope.isPersonalAccidentApplicable = "";
			$scope.insuredMedicineLastOneYear = "No";
			$scope.insuredInfo.insuredCriticalDrug = "";
			$scope.insuredDiseases = [];
		}else{
			//alert("Please fill all the required fields.");
		}
	};
	
	$scope.submitPersonalAndNominationInfo = function(){
		//alert("submit 1");
		$scope.screenOneStatus = false;
		$scope.screenTwoStatus = true;
		$('.proposerInfo').removeClass('active');
		$('.proposerInfo').addClass('complete');
		$('.prevPolicyInfo').removeClass('disabled');
		$('.prevPolicyInfo').addClass('active');
	};

	$scope.submitPreviousPolicyAndVehicleInfo = function(){
		//alert("submit 2");
		$scope.screenOneStatus = false;
		$scope.screenTwoStatus = true;
		$('.prevPolicyInfo').removeClass('active');
		$('.prevPolicyInfo').addClass('complete');
	};
	
	
	$scope.editPesonalInfo = function(){
		$scope.screenOneStatus = true;
		$scope.screenTwoStatus = false;
		$scope.screenThreeStatus = false;
		$scope.screenFourStatus = false;
	};

	$scope.proceedForPayment = function(){
		if(!$scope.insuranceDetailsForm.$invalid && $scope.insuranceDetails.undertakingStatus){
			var proposalSubmitConfirmMsg = "Please make sure you have entered the right Mobile Number and Email ID. All our communication will be sent to your Mobile " + $scope.proposerDetails.mobileNumber + " or Email " + $scope.proposerDetails.emailId + ". Is the entered Mobile No. and Email ID right?";

			$rootScope.P365Confirm("Policies365", proposalSubmitConfirmMsg, "No", "Yes", function(confirmStatus){
				if(confirmStatus){
					//$('.nomineeInfo').removeClass('active');
					//$('.nomineeInfo').addClass('complete');

					var proposeForm = {};
					proposeForm.proposerDetails = {};

					$scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
					proposeForm.proposerDetails = $scope.proposerDetails;
					proposeForm.insuranceDetails = $scope.insuranceDetails;
					proposeForm.proposerDetails.insuredDetails = $scope.insuredList;
					proposeForm.documentType = "BuyProduct";
					proposeForm.carrierId = Number($scope.selectedProduct.carrierId); 
					proposeForm.planId = Number($scope.selectedProduct.planId);

					localStorageService.set("medicalFinalProposeForm", proposeForm);

					// Google Analytics Tracker added.
					//analyticsTrackerSendData(proposeForm);

					RestAPI.invoke($scope.transactionName, proposeForm).then(function(proposeFormResponse){
						if(proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success){
							var getTokenRequest = {};
							var reponseToken = {};

							reponseToken.premium = (proposeFormResponse.data.premium != null || String(proposeFormResponse.data.premium) != "undefined") ? proposeFormResponse.data.premium : 0;
							reponseToken.serviceTax = (proposeFormResponse.data.serviceTax != null || String(proposeFormResponse.data.serviceTax) != "undefined") ? proposeFormResponse.data.serviceTax : 0;
							reponseToken.totalPremium = (proposeFormResponse.data.totalPremium != null || String(proposeFormResponse.data.totalPremium) != "undefined") ? proposeFormResponse.data.totalPremium : 0;
							reponseToken.proposalId = proposeFormResponse.data.proposalId;
							
							if($scope.getRefToken == 1){
								getTokenRequest.referenceId = proposeFormResponse.data.referenceId;
								RestAPI.invoke("getReferenceToken", getTokenRequest).then(function(referenceTokenResp){
									if(referenceTokenResp.responseCode == $scope.globalLabel.responseCode.success){
										reponseToken.redirectToken = referenceTokenResp.data.redirectToken;
										reponseToken.referenceId = referenceTokenResp.data.referenceId;
										localStorageService.set("medicalReponseToken", reponseToken);

										$window.location.href = buyScreens.paymentUrl.replace("PROPOSAL_ID", referenceTokenResp.data.redirectToken);
									}else{
										$rootScope.P365Alert("Policies365", "We are not able to connect insurance company to issue your policy. Kindly try after some time.", "Ok");
									}
								});
							}else{
								reponseToken.purchaseToken = proposeFormResponse.data.referenceId;
								$scope.proposalNum = proposeFormResponse.data.referenceId;
								localStorageService.set("medicalReponseToken", reponseToken);
								$scope.PAYMENTFORM.commit();
							}
						}else{
							$rootScope.P365Alert("Policies365", "We are facing internal issue. Kindly try after some time.", "Ok");
						}
					});
				}
			});
		}else{
			$rootScope.P365Alert("Policies365", "Please fill all the fields.", "Ok");
		}
	};
	
	$scope.scheduleInspection=function(){
		$location.path('/FourWheelerscheduleInspection');
	};
	
	// Hide the footer navigation links.
	$(".activateFooter").hide();
	$(".activateHeader").hide();

}]);