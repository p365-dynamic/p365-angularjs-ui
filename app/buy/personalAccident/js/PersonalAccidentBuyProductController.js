/*QuoteResult Controller*/

/**
 * @Author:
 * @Description: PA Proposal Form created
 * 
 */

'use strict';
angular.module('buyPersonalAccident', ['CoreComponentApp','LocalStorageModule', 'checklist-model', 'ngMessages'])
.controller('buypersonalAccidentController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce){
	
	
	$scope.paProposalSectionHTML = wp_path+'buy/personalAccident/html/PersonalAccidentProposalSection.html';
	// Setting application labels to avoid static assignment.
	var applicationLabels  = localStorageService.get("applicationLabels");
	
	$scope.globalLabel = applicationLabels.globalLabels;
	$rootScope.loaderContent={businessLine:'8',header:'Personal Accident  Insurance',desc:$sce.trustAsHtml($scope.globalLabel.applicationLabels.life.proverbBuyProduct)};
	$rootScope.title ="Buy Personal Accident Policy  ";
	
	$scope.numRecords = 4;
	$scope.page = 1;
	$scope.genderMorF='';
	$scope.medicalInfo = {};
	$scope.medicalInfo.medicalQuestionarrier = [];
	$scope.medicalQuestionarrie = [];
	$scope.today = new Date();
	$scope.nationalityList={};
	$scope.appointeeRelList={};
	$scope.nomineeRelList={};
	$scope.occupationList={};
	$scope.personalDetails={};
	$scope.proposerDetails = {};
	$scope.assuranceInfo = {};
	$scope.assuranceDetails = {};
	$scope.addressDetails = {};
	$scope.declartionDetails = {};
	$scope.addressDetails.communicationAddress = {};
	$scope.addressDetails.isAddressSameAsCommun = true;
	$scope.nomineeDateOfBirthMinLimit = false;
	$scope.permanentAddressDetails = {};
	$scope.nominationInfo = {};
	$scope.nominationDetails = {};
	$scope.appointeeInfo = {};
	$scope.nominationDetails.appointeeDetails = {};
	$scope.previouspolicyobj = {};
	$scope.insuranceDetails = {};
	//$scope.lifeProposeFormCookieDetails = {};
	$scope.PAProposeFormCookieDetails = {};
	$scope.authenticate={};
	$scope.selectedDiseaseList = [];
	$scope.selectedJobsList = [];
	$scope.selectedJob = {};
	$scope.coverageDetails = {};
	

	var nationalityFlag = false;
	var staffFlag = false;
	$scope.screenOneStatus = true;
	$scope.screenTwoStatus = false;
	$scope.screenThreeStatus = false;
	$scope.previousPolicyStatus = true;
	$scope.previousPolicyStatus = true;	
	

	var genderType = [{"label" : "Male", "value" : "M"}, {"label" : "Female", "value" : "F"},{"label":"Other","value":"Other"}];

	$scope.personalDetails = localStorageService.get("personalAccidentPersonalDetails");	
	$scope.selectedProduct = localStorageService.get("personalAccidentSelectedProduct");
	$scope.selectedProductInputParam = localStorageService.get("personalAccidentQuoteInputParamaters");
	
	if(localStorageService.get("personalAccidentQuoteInputParamaters")){
		$scope.personalDetails.annualIncome = localStorageService.get("personalAccidentQuoteInputParamaters").quoteParam.annualIncome;
	}
	console.log("$scope.selectedProductInputParam",$scope.selectedProductInputParam);


	$scope.marrital= maritalStatusListGeneric;
	$scope.proposerDetails.martialStatus=$scope.marrital[0].name;
	$scope.annualIncomeList =annualIncomesGeneric;
	$scope.gender =genderType;
	$scope.carrierStaff = yesNoStatusGeneric;
	$scope.policyTypes = policyTypesGeneric;

	var quoteUserInfo = localStorageService.get("quoteUserInfo");
	var buyScreens = localStorageService.get("buyScreen");

	
	
	$scope.ownerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);

	$scope.productValidation = buyScreens.validation;
	$scope.redirectSuccessUrl = buyScreens.redirectSuccessUrl;
	$scope.redirectFailureUrl = buyScreens.redirectFailureUrl;
	$scope.requestFormat = buyScreens.requestFormat;
	$scope.transactionName = buyScreens.transaction.proposalService.name;
	$scope.paymentURL = buyScreens.paymentUrl;
	
	// get DOB
	$scope.proposerDetails.dateOfBirth= $scope.selectedProductInputParam.personalDetails.dateOfBirth;

	// console.log("$scope.proposerDetails",$scope.proposerDetails);
	if($scope.selectedProductInputParam.quoteParam.gender=="M"){
		$scope.proposerDetails.gender = "Male";
		$scope.proposerDetails.salutation = "Mr";
	}
	else{
		$scope.proposerDetails.gender = "Female";
		$scope.proposerDetails.salutation = "Mr";
	}

	$scope.showJobsDiscription = function(job){
		$scope.selectedJob = job;
		$scope.selectedJob.applicable = true;
		console.log("$scope.selectedJob dd: "+JSON.stringify($scope.selectedJob));
	}
	
	//prepopulated details for gender and dob
	$scope.prePopulateProposerDetails = function()
	{
		$scope.storedDOB=angular.copy($scope.selectedProductInputParam.personalDetails.dateOfBirth);
		$scope.genderDefault =angular.copy($scope.proposerDetails.gender);  
		if($scope.selectedProductInputParam.quoteParam.gender=="M"){
			$scope.storedGENDER = angular.copy($scope.proposerDetails.gender);
		}else{
			$scope.storedGENDER = angular.copy($scope.proposerDetails.gender);
		}
		$scope.medicalInfo.medicalQuestionarrier  = $scope.medicalQuestionarrie;
		$scope.assuranceDetails.isPersonAddressSameAsCommun = true;

		
	};
	$scope.prePopulateProposerDetails();


	
	$scope.proposerDetails.emailId = String(quoteUserInfo.emailId) !== "undefined" ? quoteUserInfo.emailId : "";
	$scope.proposerDetails.mobileNumber = String(quoteUserInfo.mobileNumber) !== "undefined" ? quoteUserInfo.mobileNumber : "";
	$scope.proposerDetails.lastName = String(quoteUserInfo.lastName) !== "undefined" ? quoteUserInfo.lastName : "";
	$scope.proposerDetails.firstName = String(quoteUserInfo.firstName) !== "undefined" ? quoteUserInfo.firstName : "";
	
	// $scope.proposerDetails.middleName = "fsdsf";
	// $scope.proposerDetails.fatherOrHusbandName = "fsdsf";
	// $scope.proposerDetails.motherFirstName = "fsdsf";
	// // // $scope.proposerDetails.motherLastName = "fsdsf";
	// $scope.proposerDetails.pancard = "fsdsf4565f";
	// $scope.addressDetails.communicationAddress.houseNo = "sdsad";
	// $scope.addressDetails.communicationAddress.address = "sfsdfs";
	// $scope.addressDetails.communicationAddress.pincode = "43100";
	// $scope.nominationDetails.firstName = "hghhghghgh";
	// // $scope.coverageDetails.policyStartDate = "24/01/2019";
	// $scope.nominationDetails.lastName  = "hhjhjh";
	// $scope.nominationDetails.dateOfBirth  = "01/01/1984";

	// $scope.assuranceDetails.purchasedLoan = "No";
	// $scope.proposerDetails.incomeStatus=$scope.lifeInfo.annualIncomeObject.display;
	// $scope.proposerDetails.heightInCM = 150;
	// $scope.proposerDetails.heightInFeet = (Number($scope.proposerDetails.heightInCM)/30.48);
	// $scope.proposerDetails.weightInKG = 60;

	// $scope.riderStatus = false;
	// if($scope.selectedProduct.ridersList != null && String($scope.selectedProduct.ridersList) != "undefined"){
	// 	for(var i = 0; i < $scope.selectedProduct.ridersList.length; i++){
	// 		if($scope.selectedProduct.ridersList[i].riderValue != null){
	// 			$scope.riderStatus = true;
	// 			delete $scope.selectedProduct.ridersList[i].$$hashKey;
	// 		}
	// 	}		
	// }

	//fxn to calculate default comm area details
	$scope.calcDefaultAreaDetails = function(areaCode){
		if(areaCode != null && String(areaCode) != $scope.globalLabel.errorMessage.undefinedError && String(areaCode).length > 0){
			var docType = $scope.globalLabel.documentType.cityDetails;
			var carrierId = $scope.selectedProduct.carrierId;
			$http.get(getSearchServiceLink+docType+"&q="+areaCode+"&id="+carrierId).then(function(response){
				var areaDetails = JSON.parse(response.data);
				if(areaDetails.responseCode == $scope.globalLabel.responseCode.success){
					$scope.onSelectPinOrAreaComm(areaDetails.data[0]);
				}
			});
		}
	};	
	
	//fxn to calculate default perm area details
	$scope.calcDefaultPermAreaDetails = function(areaCode){
		if(areaCode != null && String(areaCode) != $scope.globalLabel.errorMessage.undefinedError && String(areaCode).length > 0){
			var docType = $scope.globalLabel.documentType.cityDetails;
			var carrierId = $scope.selectedProduct.carrierId;
			$http.get(getSearchServiceLink+docType+"&q="+areaCode+"&id="+carrierId).then(function(response){
				var areaDetails = JSON.parse(response.data);
				if(areaDetails.responseCode == $scope.globalLabel.responseCode.success){
					$scope.onSelectPinOrAreaPerm(areaDetails.data[0]);
				}
			});
		}
	}

	/*$scope.addressDetails.communicationAddress.pincode = localStorageService.get("cityDataFromIP") ? localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : "110002";
	$scope.calcDefaultAreaDetails($scope.addressDetails.communicationAddress.pincode);*/

	$scope.hideModal = function(){
		$scope.modalOTP = false;
		$scope.proceedPaymentStatus = true;
		$scope.authenticate.enteredOTP="";
	};

	$scope.hideModalError = function(){
		$scope.modalOTPError = false;
	};

	$scope.resendOTP = function(){
		var validateAuthParam = {};
		validateAuthParam.paramMap = {};
		validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
		validateAuthParam.funcType = $scope.globalLabel.functionType.optAuth;
		validateAuthParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;
		if(sessionIDvar){

			validateAuthParam.sessionId=sessionIDvar;

		}
		getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.sendSMS, validateAuthParam, function(createOTP){
			if(createOTP.responseCode == $scope.globalLabel.responseCode.success){
				$scope.invalidOTPError = "";
			}else{
				$scope.invalidOTPError = $scope.globalLabel.errorMessage.createOTP;
			}
		});
	};
	//date picker code
	var proposerDOBOption = {};
	// proposerDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
	// proposerDOBOption.maximumYearLimit = "-" + $scope.productValidation.proposerAgeMin.age + "Y";
	proposerDOBOption.changeMonth = true;
	proposerDOBOption.changeYear = true;
	proposerDOBOption.dateFormat = "dd/mm/yy";
	$scope.proposerDOBOptions = setP365DatePickerProperties(proposerDOBOption);

	var nomineeDOBOption = {};
	//nomineeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
	nomineeDOBOption.maximumYearLimit = "-1Y";
	nomineeDOBOption.changeMonth = true;
	nomineeDOBOption.changeYear = true;
	nomineeDOBOption.dateFormat = "dd/mm/yy";
	/*nomineeDOBOption.dateFormnomineeDOBOptionsat = "dd/mm/yy";*/
	$scope.nomineeDOBOptions = setP365DatePickerProperties(nomineeDOBOption);

	var appointeeDOBOption = {};
	//appointeeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
	appointeeDOBOption.maximumYearLimit = "-18Y";
	appointeeDOBOption.changeMonth = true;
	appointeeDOBOption.changeYear = true;
	appointeeDOBOption.dateFormat = "dd/mm/yy";
	$scope.appointeeDOBOptions = setP365DatePickerProperties(appointeeDOBOption);


//for policy start date 
	var startDateOptions = {};
	startDateOptions.maximumDayLimit = 20;
	startDateOptions.minimumDayLimit = 0;
	startDateOptions.changeMonth = true;
	startDateOptions.changeYear = true;
	startDateOptions.dateFormat = "dd/mm/yy";
	$scope.policystartDateOption = setP365DatePickerProperties(startDateOptions);



	$scope.onSelectVehiclePinOrArea = function(item){
		$scope.assuranceDetails.registrationAddress = item;
		$scope.displayArea = item.area + ", " + item.city;
		$scope.assuranceDetails.area = item.area;
		$scope.assuranceDetails.pincode = item.pincode;
		$scope.assuranceDetails.city = item.city;
		$scope.assuranceDetails.state = item.state;
		$scope.loadPlaceholder();
		localStorageService.set("regGeoDetails", item);
	};

	// Method to get list of pincodes
	$scope.getPinCodeAreaList = function(searchValue){
		var docType = $scope.globalLabel.documentType.cityDetails;
		var carrierId = $scope.selectedProduct.carrierId;

		return $http.get(getSearchServiceLink+docType+"&q="+searchValue+"&id="+carrierId).then(function(response){
			return JSON.parse(response.data).data;
		});
	};

	$scope.loadPlaceholder = function(){
		setTimeout(function(){
			$('.buyform-control').on('focus blur', function (e) {
				$(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
			}).trigger('blur');
		},100);
	}
	
	// function sets up all communication address properties
	$scope.onSelectPinOrAreaComm = function(item){

		console.log("onSelectPinOrAreaComm "+ JSON.stringify(item));
		$scope.addressDetails.communicationAddress.stateCode = item.stateCode;
		$scope.addressDetails.communicationAddress.state = item.state;
		$scope.addressDetails.communicationAddress.cityCode = item.cityCode;
		$scope.addressDetails.communicationAddress.city = item.city;
		$scope.addressDetails.communicationAddress.pincode = item.pincode;
		$scope.addressDetails.communicationAddress.streetDetails = item.streetDetails;
		$scope.addressDetails.communicationAddress.locality = item.locality;
		// $scope.recalculateProposerAddress();
		
		$scope.loadPlaceholder();
		localStorageService.set("userGeoDetails", item);
	};
	
	//function sets up all permanent address properties
	$scope.onSelectPinOrAreaPerm = function(item){
		$scope.permanentAddressDetails.stateCode = item.stateCode;
		$scope.permanentAddressDetails.state = item.state;
		$scope.permanentAddressDetails.cityCode = item.cityCode;
		$scope.permanentAddressDetails.city = item.city;
		$scope.permanentAddressDetails.pincode = item.pincode;
	};

	$scope.changeMaritalStatus = function(){
	}

	$scope.changeOccupation = function(){

		
		

	}

	$scope.changeIncome = function(){

	}
	
	$scope.calcHeight = function(){
		$scope.proposerDetails.heightInFeet = (Number($scope.proposerDetails.heightInCM)/30.48);		
	}
	//Carrier wise staff flag
	$scope.changeStaff=function(){
		if($scope.proposerDetails.StaffStatus=="Yes"){
			$scope.staffFlag=true;
		}
		else{
			$scope.staffFlag=false;
			$scope.proposerDetails.staffCode="";
		}
	}

	$scope.changeGender = function(){
		if($scope.proposerDetails.gender == "Male"|| $scope.proposerDetails.gender == "Other"){
			$scope.proposerDetails.salutation = "Mr";
		}else{
			$scope.proposerDetails.salutation = "Mrs";
		}
		//calling recalculate Quotes As per Gender
		$scope.recalculateProposerGender();

	}

	$scope.changeNationality =function(){
		if($scope.proposerDetails.nationalityStatus == "Other"){
			$scope.nationalityFlag=true;
		}else{
			$scope.nationalityFlag=false;
			$scope.proposerDetails.otherNationality="";
		}
	}

	$scope.changeNationalityOther=function()
	{
	}

	$scope.changeNomineeRelation = function()
	{
		$scope.personalDetails = $scope.proposerDetails;
	}


	$scope.updateSalutation = function(relation){
	


		

		

		if($scope.productValidation.isNomineeSalutationRequired || true ){
		if(relation == 'Spouse'){
			
			
			if($scope.proposerDetails.gender == "Male"){
				$scope.salutationsList  = [{"value":"Mrs","display":"Mrs."}];
				$scope.nominationDetails.salutation = 'Mrs';
			}else{
				$scope.salutationsList  = [{"value":"Mr","display":"Mr."}];
				$scope.nominationDetails.salutation = 'Mr';
			}
		}else if(relation == 'Son' || relation == 'Brother' || relation == 'Father'){
			$scope.salutationsList  = [{"value":"Mr","display":"Mr."}];
			$scope.nominationDetails.salutation = 'Mr';
		}else if(relation == 'Daughter' || relation == 'Mother' || relation == 'Sister'|| relation == 'Spouce' ){
			if(relation == 'Mother'|| relation == 'Spouce'){
				$scope.salutationsList  = [{"value":"Mrs","display":"Mrs."}];
				$scope.nominationDetails.salutation = 'Mrs';
			}else{
				$scope.salutationsList  = [{"value":"Ms","display":"Ms."},{"value":"Mrs","display":"Mrs."}];
				$scope.nominationDetails.salutation = 'Ms';
			}
		}
	}
	}





	$scope.changeAppointeeRelation = function(){
	};


	// Function is used to reset Communication address
	$scope.resetCommunicationAddress = function(){	
		if(String($scope.addressDetails.communicationAddress.address) == $scope.globalLabel.errorMessage.undefinedError || $scope.addressDetails.communicationAddress.address.length == 0){	
			$scope.addressDetails.communicationAddress.pincode = EMPTY;
			$scope.addressDetails.communicationAddress.state = EMPTY;
			$scope.addressDetails.communicationAddress.city = EMPTY;
		}
	};
	
	
	// Function is used to reset Permanent address
	$scope.resetPermanentAddress = function(){	
		if(String($scope.permanentAddressDetails.address) == $scope.globalLabel.errorMessage.undefinedError || $scope.permanentAddressDetails.address.length == 0){	
			$scope.permanentAddressDetails.pincode = EMPTY;
			$scope.permanentAddressDetails.state = EMPTY;
			$scope.permanentAddressDetails.city = EMPTY;
		}
	};
	
	$scope.changePermanentAddress = function(){
		if($scope.addressDetails.isAddressSameAsCommun){
			$scope.permanentAddressDetails = $scope.addressDetails.communicationAddress;
		}else{
			$scope.permanentAddressDetails.houseNo = EMPTY;
			$scope.permanentAddressDetails.pincode = EMPTY;
			$scope.permanentAddressDetails.state = EMPTY;
			$scope.permanentAddressDetails.stateCode = EMPTY;
			$scope.permanentAddressDetails.cityCode = EMPTY;
			$scope.permanentAddressDetails.city = EMPTY;
			$scope.permanentAddressDetails.addressLine = EMPTY;
		}
		$scope.addressDetails.permanentAddress=$scope.permanentAddressDetails;
	};

	//calculation
	$scope.calculateProposerAge = function(){
		// $scope.proposerDetails.personAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
		$scope.selectedProductInputParam.personalDetails.dateOfBirth=$scope.proposerDetails.dateOfBirth;
		// $scope.selectedProductInputParam.quoteParam.age=parseInt(getAgeFromDOB($scope.proposerDetails.dateOfBirth));
		// $scope.calculateMaturityAgeGap();
		$scope.recalculateProposerAge();
	};


	//calculte annual income
	// $scope.calculateProposerIncome = function(){
		
	// 	$scope.proposerDetails.personAge =  $scope.personalDetails.annualIncome
		
	// 	$scope.selectedProductInputParam.personalDetails.dateOfBirth=$scope.proposerDetails.dateOfBirth;
	// 	$scope.selectedProductInputParam.quoteParam.age=parseInt(getAgeFromDOB($scope.proposerDetails.dateOfBirth));
		
	// 	$scope.calculateMaturityAgeGap();
	// 	$scope.recalculateProposerAge();
	// };

	//maturity age gap calculated as discuss with uday sir
	$scope.calculateMaturityAgeGap = function(){
		if($scope.selectedProductInputParam.quoteParam.age > 35){
			$scope.selectedProductInputParam.personalDetails.maturityAge = maturityAgeConstant;
		}else{
			$scope.selectedProductInputParam.personalDetails.maturityAge = $scope.selectedProductInputParam.quoteParam.age + 40;
		}
	}

	$scope.backToResultScreen = function(){
		$location.path("/personalAccidentResult");
	}
	
	$scope.showAuthenticateForm = function(){

		
		var validateAuthParam = {};
		validateAuthParam.paramMap = {};
		validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
		validateAuthParam.funcType = $scope.globalLabel.functionType.optAuth;
		validateAuthParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;
		if(sessionIDvar){

			validateAuthParam.sessionId=sessionIDvar;

		}
		// getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.sendSMS, validateAuthParam, function(createOTP){
			
			// createOTP.responseCode == $scope.globalLabel.responseCode.success ||
			if( true){
				
				$scope.createOTPError = "";
				$scope.modalOTP = true;		
			}else if(createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile){
				$scope.createOTPError = createOTP.message;
				$scope.modalOTPError = true;
			}else{
				$scope.createOTPError = $scope.globalLabel.errorMessage.createOTP;
				$scope.modalOTPError = true;
			}
		// });		
	};

	$scope.validateProposerDateOfBirth = function(){
		if(String($scope.proposerDetails.dateOfBirth) !== "undefined"){
			var proposerAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
			if(isNaN(proposerAge)){
				$scope.proposerDetails.dateOfBirth = undefined;
				$scope.proposerDateOfBirthError = $scope.productValidation.messages.dateOfBirthInvalid;
			}else{
				if(proposerAge < $scope.productValidation.proposerDateOfBirthMinLimit){
					$scope.proposerDetails.dateOfBirth = undefined;
					$scope.proposerDateOfBirthError = $scope.productValidation.messages.proposerDateOfBirthErrorOne.replace("MIN_AGE_LIMIT", $scope.productValidation.proposerDateOfBirthMinLimit);
				}else if(proposerAge > $scope.productValidation.proposerDateOfBirthMaxLimit){
					$scope.proposerDetails.dateOfBirth = undefined;
					$scope.proposerDateOfBirthError = $scope.productValidation.messages.proposerDateOfBirthErrorTwo.replace("MAX_AGE_LIMIT", $scope.productValidation.proposerDateOfBirthMaxLimit);
				}else{
					$scope.loadPlaceholder();
					$scope.proposerAgeValue(proposorAge);
					$scope.proposerDateOfBirthError = "";
				}
			}
		}else{
			$scope.proposerDetails.dateOfBirth = undefined;
			$scope.proposerDateOfBirthError = $scope.productValidation.messages.dateOfBirthInvalid;
		}
	}

	$scope.changePurchasedLoan = function(){
		if($scope.assuranceDetails.purchasedLoan == "No"){
			$scope.assuranceDetails.financeInstitution = "";
		}
		$scope.loadPlaceholder();
	}

	$scope.validateNomineeDateOfBirth = function(){

		$scope.nominationDetails.personAge = getAgeFromDOB($scope.nominationDetails.dateOfBirth);
		if($scope.nominationDetails.personAge < 18){
			
			// console.log("itherrrrrrrrr")
		
			$scope.nomineeDateOfBirthMinLimit = true;


			// $scope.nominationDetails.appointeeStatus = true;
			//  $scope.nomineeRelationList = buyScreenMinorNomineeRealtion;
			// $scope.loadPlaceholder();
			// $scope.appointeeRelationList = buyScreenAppointeeRelation;



		}else{
		
			
			$scope.nomineeDateOfBirthMinLimit = false;

			$scope.nominationDetails.appointeeStatus = false;
			$scope.nomineeRelationList = buyScreenNotMinorNomineeRealtion;
			$scope.appointeeRelationList = buyScreenAppointeeRelation;
		}
	}

	$scope.validateAppointeeDateOfBirth = function(){
		$scope.nominationDetails.appointeeDetails.personAge = getAgeFromDOB($scope.nominationDetails.appointeeDetails.dateOfBirth);
		if($scope.nominationDetails.appointeeDetails.personAge < 18){
			$scope.nominationDetails.appointeeDetails.dateOfBirth = undefined;
			$scope.appointeeDateOfBirthError = $scope.productValidation.messages.dateOfBirthInvalid;
		}else{
			$scope.loadPlaceholder();
			$scope.appointeeDateOfBirthError = "";
		}
	}

	// $scope.validatePolicyStartDate = function(){
	// 	if(String($scope.insuranceDetails.policyStartDate) !== "undefined"){
	// 		var todayDate = new Date();
	// 		var polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
	// 		var tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];

	// 		var regDate = $scope.selectedProductInputParam.assuranceInfo.dateOfRegistration.split("/");
	// 		var tempRegDate = regDate[1] + "/" + regDate[0] + "/" + regDate[2];
	// 		var futureDate = new Date((tempRegDate.setDate(tempRegDate.getDate() + Number($scope.productValidation.policyStartDateLimit))));

	// 		if(new Date(tempPolStartDate).setHours(0,0,0,0) < todayDate.setHours(0,0,0,0)){
	// 			$scope.insuranceDetails.policyStartDate = undefined;
	// 			$scope.insuranceDetails.policyEndDate = undefined;
	// 			$scope.policyStartDateError = $scope.productValidation.messages.policyStartDateInvalidOne;
	// 		}else{
	// 			if(new Date(tempPolStartDate).setHours(0,0,0,0) < new Date(tempRegDate).setHours(0,0,0,0)){
	// 				$scope.insuranceDetails.policyStartDate = undefined;
	// 				$scope.insuranceDetails.policyEndDate = undefined;
	// 				var dispRegistrationDate = regDate[0] + "-" + monthListGeneric[Number(regDate[1])] + "-" + regDate[2];
	// 				$scope.policyStartDateError = $scope.productValidation.messages.policyStartDateInvalidTwo.replace("DISP_REGISTRATION_DATE", dispRegistrationDate);
	// 			}else if(new Date(tempPolStartDate).setHours(0,0,0,0) > futureDate.setHours(0,0,0,0)){
	// 				$scope.insuranceDetails.policyStartDate = undefined;
	// 				$scope.insuranceDetails.policyEndDate = undefined;
	// 				var dispFutureDate = futureDate.getDate() + "-" + monthListGeneric[Number(futureDate.getMonth())] + "-" + futureDate.getFullYear();
	// 				$scope.policyStartDateError = $scope.productValidation.messages.policyStartDateInvalidThree.replace("DISP_FUTURE_DATE", dispFutureDate);
	// 			}else{
	// 				var polEndDate = new Date(new Date(String(tempPolStartDate)).setFullYear(new Date(tempPolStartDate).getFullYear() + 1));
	// 				var tempPolEndDate = new Date(polEndDate.setDate(polEndDate.getDate() - 1));
	// 				$scope.insuranceDetails.policyEndDate = tempPolEndDate.getDate() + "/" + (Number(tempPolEndDate.getMonth()) + 1) + "/" + tempPolEndDate.getFullYear();
	// 				$scope.policyStartDateError = "";
	// 				$scope.loadPlaceholder();
	// 			}
	// 		}
	// 	}
	// }

	


	
	$scope.accordion='1';
	$scope.editPesonalInfo = function(){
		$scope.screenOneStatus = true;
		$scope.screenTwoStatus = true;
		$scope.screenThreeStatus = false;
		$scope.accordion='1';
	};


	$scope.editmedicalInfo = function(){
		$scope.screenOneStatus = false;
		$scope.screenTwoStatus = true;
		$scope.screenThreeStatus = false;
		$scope.accordion='2';
	};

	$scope.editNomineeInfo = function(){
		$scope.screenOneStatus = false;
		$scope.screenTwoStatus = true;
		$scope.screenThreeStatus = false;
		$scope.accordion='2';
	};


	

	$scope.Section2Inactive = true;
	$scope.Section3Inactive = true;
	$scope.Section4Inactive = true;

	$scope.submitPersonalDetails = function(){
		$scope.screenTwoStatus = true;
		$scope.Section2Inactive=false;
		$scope.accordion='2';
		$scope.PAProposeFormCookieDetails.proposerDetails = $scope.proposerDetails; 

		


		/*console.log("proposerDetails : "+JSON.stringify($scope.proposerDetails));*/
	};
	
	
	$scope.submitMedicalDetails = function(){
		$scope.screenThreeStatus = true;
		$scope.Section3Inactive = false;
		$scope.accordion='3';
		$scope.proceedPaymentStatus = true;
		// $scope.proceedPaymentStatus = true;
	}

	$scope.submitNomineeDetails = function(){
		$scope.screenFourStatus = true;
		$scope.Section4Inactive = false;
		$scope.accordion='4';
		
	}

	//DropDownList fetching from Database 
	//  var occupationDocId = $scope.globalLabel.documentType.lifeOccupation + "-" + $scope.selectedProduct.carrierId;
	// getDocUsingId(RestAPI, occupationDocId, function(occupationList){
		 $scope.occupationList = personalAccidentOccupationListGeneric;
		 

		var nomineeRelationDocId = $scope.globalLabel.documentType.paNomineeRelation + "-" + $scope.selectedProduct.carrierId;
		// console.log("nomineeRelationDocId :::::: "+nomineeRelationDocId);

		getDocUsingId(RestAPI, nomineeRelationDocId, function(nomineeRelationList){
			$scope.nomineeRelList = nomineeRelationList.NomineeRelation;

			var appointeeRelationDocId = $scope.globalLabel.documentType.paAppointeeRelation + "-" + $scope.selectedProduct.carrierId;
			
			// console.log("appointeeRelationDocId ::::::: "+appointeeRelationDocId);
			getDocUsingId(RestAPI, appointeeRelationDocId, function(appointeeRelationList){
				$scope.appointeeRelList = appointeeRelationList.AppointeeRelation;

				var nationalityDocId = $scope.globalLabel.documentType.PANationality + "-" + $scope.selectedProduct.carrierId;
			// console.log("??????????????",nationalityDocId);
			
			
				getDocUsingId(RestAPI, "PANationality-36", function(nationalityList){
					$scope.nationalityList = nationalityList.Nationality;
				
				
				var searchData={};
				searchData.documentType = "PersonalAccidentDiseaseQuestion";
				searchData.carrierId = $scope.selectedProduct.carrierId;
				searchData.planId = $scope.selectedProduct.productId;
				// searchData.riders = $scope.selectedProduct.ridersList;
				//this is working 
					getDocUsingParam(RestAPI,"getHealthQuestionList",searchData, function(callback){
							$scope.medicalQuestionarrie = callback.data;
							// console.log("medicalQuestionarrie : "+JSON.stringify($scope.medicalQuestionarrie));
							/*for(var i=0; i<$scope.medicalQuestionarrie.length; i++){
								if($scope.medicalQuestionarrie[i].questionCode=='PREXDISEA'){
									if($scope.medicalQuestionarrie[i].applicable=='true'){
										$scope.clickToShowDisease();
									}else{
										$scope.clickToHideDisease();
									}
								}
							}*/
							
						var searchDiseaseData={};
						searchDiseaseData.documentType = "PersonalAccidentDiseaseMapping";
						searchDiseaseData.carrierId = $scope.selectedProduct.carrierId;
						searchDiseaseData.planId = $scope.selectedProduct.productId;
						// searchDiseaseData.riders = $scope.selectedProduct.ridersList;
						// getDocUsingParam(RestAPI, "getHealthQuestionList",searchDiseaseData, function(callback){
						// 	console.log("collback")
						// 	$scope.diseaseList = callback.data;
						// 	// console.log("$scope.diseaseList",$scope.diseaseList);

						// 	// $scope.numberOfPages = Math.floor($scope.diseaseList.length/$scope.numRecords);	
						// 	// $scope.diseaseListDisable = angular.copy($scope.diseaseList);
						// 	// for(var i=0; i< $scope.diseaseListDisable.length;i++){
						// 	// 	$scope.diseaseListDisable[i].subParentId=$scope.diseaseListDisable[i].parentId
						// 	// }

						// 	console.log("carCarrier");
						// 	// getListFromDB(RestAPI, "", carCarrier, findAppConfig, function(carCarrierList){
						// 	// 	console.log("carCarrierList",carCarrierList);
								
						// 	// 	if(carCarrierList.responseCode == $scope.globalLabel.responseCode.success){									
						// 	// 		$scope.carrierList = carCarrierList.data;
						// 	// 		console.log("carCarrierList",$scope.carrierList);
									
						// 	// 		localStorageService.set("carCarrierList",carCarrierList.data);
						// 	// 	}
						// 	// });	
						// 	$rootScope.loading=false;

						// });
					});
				});
			});
		});
	// });

	//medical question section related functions starts here.

	var quesArr=[];
	$scope.inputTypeCheck=function(sel,quesId,mquestion){
		if(sel == 'true'){
			quesArr.push(quesId);
			
		}else{
			if(quesArr.length > 0)
				quesArr.splice(-1,quesId);
		}
	}
	
	$scope.clickToShowDisease = function(){
		$scope.diseaseShow=true;
	}
	$scope.clickToHideDisease = function(){
		$scope.diseaseShow=false;
	}
	$scope.submitDieaseList = function()
	{
		$scope.diseaseShow=false;
	};
	
	
	
	$scope.next = function(){
		$scope.page = $scope.page + 1;
	};

	$scope.back = function(){
		$scope.page = $scope.page - 1;
	};
	
	//medical question section related functions ends here.
	
	
	$scope.proposalInfo = function(){



		
		$scope.pAProposeFormDetails={};
		$scope.pAProposeFormDetailsTmp={};
		$scope.pAProposeFormDetailsTmp.proposerInfo = {}
		$scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress = {};


		//Address Detaisls
		$scope.pAProposeFormDetailsTmp.proposerInfo.communicationAddress = $scope.addressDetails.communicationAddress;
		
		 if($scope.addressDetails.isAddressSameAsCommun){
			$scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress = $scope.addressDetails.communicationAddress;
		}else{
			$scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress = $scope.addressDetails.permanentAddress;
		
		}
		console.log("proposerDetails",$scope.proposerDetails);


		

		

		//Personal info 
		$scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo = $scope.proposerDetails;
		$scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.dateOfBirth = $scope.selectedProductInputParam.quoteParam.dob
		$scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.sumInsured = $scope.selectedProduct.sumInsured;
		$scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.occupation = $scope.personalDetails.occupation;
		$scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.annualIncome = $scope.selectedProduct.AnnualIncome;
		$scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.isAddressSameAsCommun	= $scope.addressDetails.isAddressSameAsCommun
		
		// nomineeDetails
		$scope.pAProposeFormDetailsTmp.nomineeDetails = $scope.nominationDetails

		$scope.pAProposeFormDetailsTmp.coverageDetails =  $scope.selectedProduct;		  
		$scope.pAProposeFormDetailsTmp.coverageDetails.policyStartDate = $scope.coverageDetails.policyStartDate;
		$scope.pAProposeFormDetailsTmp.coverageDetails.policyEndDate = $scope.coverageDetails.policyEndDate;
		$scope.pAProposeFormDetailsTmp.insuranceCompany = $scope.selectedProduct.insuranceCompany;
		$scope.pAProposeFormDetailsTmp.planName =   $scope.selectedProduct.planName;
		$scope.pAProposeFormDetailsTmp.quoteType = $scope.selectedProduct.quoteType;

		// $scope.pAProposeFormDetailsTmp.
		$scope.pAProposeFormDetailsTmp.businessLineId = 8;
		$scope.pAProposeFormDetailsTmp.source = "";
		$scope.pAProposeFormDetailsTmp.campaign_id = "";
		$scope.pAProposeFormDetailsTmp.requestSource = "";  
		$scope.pAProposeFormDetailsTmp.messageId = "";
		$scope.pAProposeFormDetailsTmp.carrierId =  $scope.selectedProduct.carrierId
		$scope.pAProposeFormDetailsTmp.planId =  $scope.selectedProduct.planId; 		
		$scope.pAProposeFormDetails.requestType = $scope.globalLabel.request.paPropRequestType;
		
		//declartionDetails
		$scope.pAProposeFormDetailsTmp.declartionDetails    =   [];
		$scope.pAProposeFormDetailsTmp.declartionDetails[0] = $scope.declartionDetails;
		$scope.pAProposeFormDetailsTmp.declartionDetails[0].declartionCode =  "GeneralUndertaking";
		
		//medicalinfo 
		$scope.pAProposeFormDetailsTmp.medicalQuestionarrie = angular.copy($scope.medicalInfo.medicalQuestionarrier);
		
		

		// console.log("$scope.pAProposeFormDetailsTmp",$scope.pAProposeFormDetailsTmp);

		// proposerInfo.contactInfo
		// $scope.pAProposeFormDetailsTmp.proposerInfo.contactInfo =  $scope.addressDetails.communicationAddress;		
		// $scope.pAProposeFormDetailsTmp.proposerInfo.contactInfo.streetDetails = $scope.addressDetails.communicationAddress.address;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.contactIanfo.mobile = $scope.pAProposeFormDetails.mobile;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.contactInfo.emailId = $scope.pAProposeFormDetails.emailId;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.contactInfo.locality = "Require";
		// $scope.pAProposeFormDetailsTmp.proposerInfo.contactInfo.phone = "";

		// //roposerInfo.permanentAddress
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress =  $scope.addressDetails.communicationAddress;

		// if($scope.addressDetails.isAddressSameAsCommun){
		// 		$scope.addressDetails.permanentAddress = $scope.addressDetails.communicationAddress;
		// 		$scope.pAProposeFormDetailsTmp.proposerInfo.contactInfo.streetDetails;
		// 	}


		// // console.log("$scope.proposerDetails",JSON.stringify($scope.proposerDetails));

		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.gender = $scope.proposerDetails.gender;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.firstName = $scope.proposerDetails.firstName;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.lastName = $scope.proposerDetails.lastName;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.salutation = $scope.proposerDetails.salutation;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.pancard = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.dateOfBirth = $scope.proposerDetails.dateOfBirth;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.martialStatus = $scope.proposerDetails.marrital
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.isAddressSameAsCommun=$scope.addressDetails.isAddressSameAsCommun;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.occupation = $scope.personalDetails.occupationId;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress.annualIncome = $scope.personalDetails.annualIncome;
		
		// //proposerInfo.personalInfo
		// $scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo = $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress
		
		
		// console.log("$scope.addressDetails",$scope.addressDetails);
		


		// // nomineeDetails
		// $scope.pAProposeFormDetailsTmp.nomineeDetails = $scope.nominationDetails

		// // previousPolicyDetails
		// // $scope.pAProposeFormDetailsTmp.previousPolicyDetails=  $scope.previouspolicyobj;

		// // coverageDetails
		// $scope.pAProposeFormDetailsTmp.coverageDetails =  $scope.selectedProduct;		  
		// $scope.pAProposeFormDetailsTmp.coverageDetails.policyStartDate = $scope.coverageDetails.policyStartDate;
		// $scope.pAProposeFormDetailsTmp.coverageDetails.policyEndDate = $scope.coverageDetails.policyEndDate;
		// $scope.pAProposeFormDetailsTmp.insuranceCompany = $scope.selectedProduct.insuranceCompany;
		// $scope.pAProposeFormDetailsTmp.planName =   $scope.selectedProduct.planName;
		// $scope.pAProposeFormDetailsTmp.quoteType = $scope.selectedProduct.quoteType;

		// // $scope.pAProposeFormDetailsTmp.
		// $scope.pAProposeFormDetailsTmp.businessLineId = 8;
		// $scope.pAProposeFormDetailsTmp.source = "";
		// $scope.pAProposeFormDetailsTmp.campaign_id = "";
		// $scope.pAProposeFormDetailsTmp.requestSource = "";  
		// $scope.pAProposeFormDetailsTmp.messageId = "";
		// $scope.pAProposeFormDetailsTmp.carrierId =  $scope.selectedProduct.carrierId
		// $scope.pAProposeFormDetailsTmp.planId =  $scope.selectedProduct.planId; 		
		// $scope.pAProposeFormDetails.requestType = $scope.globalLabel.request.paPropRequestType;
		// // $scope.pAProposeFormDetailsTmp.documentType = "PersonalAccidentProposalRequest";
		
		// // "carrierId": 36,
		// // "planId": 1,
		// // "documentType": "PersonalAccidentProposalRequest",
	

		// //fortempery baisys change ist in mapper document  
		// $scope.pAProposeFormDetailsTmp.sumAssured = $scope.pAProposeFormDetailsTmp.sumInsured;
		// $scope.pAProposeFormDetailsTmp.basePremium = $scope.pAProposeFormDetailsTmp.grossPremium;
		// $scope.pAProposeFormDetailsTmp.totalPremium = $scope.pAProposeFormDetailsTmp.netPremium;
		
		
		// //declartionDetails
		// $scope.pAProposeFormDetailsTmp.declartionDetails    =   [];
		// $scope.pAProposeFormDetailsTmp.declartionDetails[0] = $scope.declartionDetails;
		// $scope.pAProposeFormDetailsTmp.declartionDetails[0].declartionCode =  "GeneralUndertaking";
		
		// //medicalinfo 
		// $scope.pAProposeFormDetailsTmp.medicalQuestionarrie = angular.copy($scope.medicalInfo.medicalQuestionarrier);
		
		// 		//fix somewhere Must Require 
		// console.log(">>>>>>>>>>>>>>",$scope.selectedProduct);
		// $scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.annualIncome = $scope.selectedProduct.AnnualIncome;
		
		// $scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.dateOfBirth = $scope.selectedProductInputParam.quoteParam.dob
		// $scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.sumInsured = $scope.selectedProduct.sumInsured;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.mobile = 8989888998;
		// $scope.pAProposeFormDetailsTmp.proposerInfo.communicationAddress = $scope.pAProposeFormDetailsTmp.proposerInfo.permanentAddress;		
		// $scope.pAProposeFormDetailsTmp.proposerInfo.personalInfo.emailId = $scope.proposerDetails.emailId;
		

		// ::::::::::::::::::::::
		
		// $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
		// $scope.pAProposeFormDetails.premiumDetails = $scope.selectedProduct;
		// $scope.pAProposeFormDetails.proposerDetails = $scope.proposerDetails;
		// $scope.pAProposeFormDetails.nominationDetails = $scope.nominationDetails;
		// if($scope.addressDetails.isAddressSameAsCommun){
		// 	$scope.addressDetails.permanentAddress = $scope.addressDetails.communicationAddress;
		// }
		// $scope.pAProposeFormDetails.addressDetails = $scope.addressDetails;
		// $scope.pAProposeFormDetails.medicalQuestionarrie = angular.copy($scope.medicalInfo.medicalQuestionarrier);
		// console.log("$scope.selectedJob : "+JSON.stringify($scope.selectedJob));
		// $scope.selectedJobsList[0] = $scope.selectedJob; 
		// $scope.pAProposeFormDetails.jobsDetails = $scope.selectedJobsList;
		// $scope.pAProposeFormDetails.diseaseDetails = $scope.selectedDiseaseList;

		// // //for future generali-added based on Kuldeep Patil 
		// if($scope.selectedProduct.carrierUniqueId){
		// 	$scope.pAProposeFormDetails.premiumDetails.carrierUniqueId = $scope.selectedProduct.carrierUniqueId;
		// }
		// //added for LMS
		// if($scope.selectedProduct.totalDiscountAmount==0 || $scope.selectedProduct.totalDiscountAmount)
		// {	
		// 	$scope.pAProposeFormDetails.totalDiscountAmount=$scope.selectedProduct.totalDiscountAmount;
		// }
		// if($scope.selectedProduct.totalRiderAmount==0 || $scope.selectedProduct.totalRiderAmount)
		// {	
		// 	$scope.pAProposeFormDetails.totalRiderAmount=$scope.selectedProduct.totalRiderAmount;
		// }
		// if($scope.selectedProduct.basicCoverage==0 || $scope.selectedProduct.basicCoverage)
		// {	
		// 	$scope.pAProposeFormDetails.basicCoverage=$scope.selectedProduct.basicCoverage;
		// }
	
		// //added user-idv in proposal request as suggested by srikant
		// // $scope.pAProposeFormDetails.premiumDetails.userIdv=localStorageService.get("personalAccidentQuoteInputParamaters").quoteParam.userIdv;
		// $scope.pAProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
		// $scope.pAProposeFormDetails.productId = $scope.selectedProduct.productId;
		// $scope.pAProposeFormDetails.requestType = $scope.globalLabel.request.paPropRequestType;
	}

	/*----- iPOS+ Functions-------*/
	
	// $scope.getCarrierList = function(){
	// 	// getListFromDB(RestAPI, "", $scope.globalLabel.documentType.personalAccidentCarrier, $scope.globalLabel.request.findAppConfig, function(pACarrierList){
	// 	// 	if(pACarrierList.responseCode == $scope.globalLabel.responseCode.success){			
	// 	// 		$scope.carrierList = pACarrierList.data;
	// 	// 		var docId = $scope.globalLabel.documentType.buyScreen + "-" + $scope.selectedProductInputParam.quoteParam.quoteType;
	// 	// 		getDocUsingId(RestAPI, docId, function(buyScreenTooltip){
	// 	// 			$scope.buyTooltip = buyScreenTooltip.toolTips;
	// 	// 			$scope.getRelationshipList();
	// 	// 			$rootScope.loading = false;
	// 	// 		});
	// 	// 	}else{

	// 	// 		$rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.serverError, "Ok");
	// 	// 	}
	// 	// });
	// }



	

	
	$scope.recalculateProposerOccupation=function() {
		
	//   console.log("$scope.selectedProductInputParam",$scope.selectedProductInputParam); 	

	//   		if(String($scope.personalDetails.occupationId) != 'undefined' || $scope.personalDetails.occupationId != null ){
						
	// 		 if($scope.personalDetails.occupationId != $scope.proposerDetails.occupationId || true ){
	// 			$rootScope.P365Confirm($scope.globalLabel.applicationLabels.common.p365prompt ,$scope.globalLabel.applicationLabels.common.OccupationChangeMsg ,"No","Yes",  function(confirmStatus){
	// 				if(confirmStatus){
	// 					$scope.loading = true;
	// 					$scope.selectedProductInputParam.quoteParam.occupationId = $scope.personalDetails.occupationId;
						
	// 					$scope.recalculateQuotes();
						

	// 				}else{
	// 					$scope.loading = false;

	// 				}
	// 			});
	// 		}else{
	// 			$scope.loading = false;	

	// 		}
	// 	}
	}

	$scope.recalculateProposerAddress = function()    {
	
	
	if(String($scope.addressDetails.communicationAddress.city) != 'undefined' || $scope.addressDetails.communicationAddress.city != null ){
		// addressDetails.communicationAddress.city

			 if($scope.addressDetails.communicationAddress.city != $scope.selectedProductInputParam.personalDetails.city  ){
				
				$rootScope.P365Confirm($scope.globalLabel.applicationLabels.common.p365prompt ,$scope.globalLabel.applicationLabels.common.CityChanngeMsg ,"No","Yes",  function(confirmStatus){
					if(confirmStatus){
						
						$scope.selectedProductInputParam.quoteParam.occupationId = $scope.personalDetails.occupationId;
						
						$scope.recalculateQuotes();
						
					}else{
						$scope.loading = false;

					}
				});
			}else{
				$scope.loading = false;
				// $scope.proposerDetails.dateOfBirth=$scope.storedDOB;
				// $scope.storedDOB=$scope.proposerDetails.dateOfBirth;

			}
		}
	
	}

	$scope.recalculateProposerAge = function(){
	// 	if(String($scope.storedDOB) != 'undefined' || $scope.storedDOB != null ){
	// 		if($scope.storedDOB!=$scope.proposerDetails.dateOfBirth){
	// 			$rootScope.P365Confirm($scope.globalLabel.applicationLabels.common.p365prompt ,$scope.globalLabel.applicationLabels.common.DobChangeMsg ,"No","Yes",  function(confirmStatus){
	// 				if(confirmStatus){
	// 					$scope.loading = true;
	// 					// $scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.personalDetails.maturityAge-$scope.selectedProductInputParam.quoteParam.age;
	// 					//$scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.quoteParam.;
					
	// 					$scope.recalculateQuotes();

	// 					$scope.storedDOB=$scope.proposerDetails.dateOfBirth;
	// 					$scope.proposerDetails.dateOfBirth=$scope.storedDOB;

	// 				}else{
	// 					$scope.loading = false;
	// 					$scope.proposerDetails.dateOfBirth=$scope.storedDOB;
	// 					$scope.storedDOB=$scope.proposerDetails.dateOfBirth;

	// 				}
	// 			});
	// 		}else{
	// 			$scope.loading = false;
	// 			$scope.proposerDetails.dateOfBirth=$scope.storedDOB;
	// 			$scope.storedDOB=$scope.proposerDetails.dateOfBirth;

	// 		}
	// 	}
	}

	$scope.recalculateQuotes = function() {
		$scope.loading = true;

		RestAPI.invoke($scope.globalLabel.getRequest.quotePersonalAccident, $scope.selectedProductInputParam).then(function(callback){
			$scope.PARecalculateQuoteRequest = [];
			console.log("callbackcallback recalculate  ",callback);
			
			if(callback.responseCode == $scope.globalLabel.responseCode.success){
				$scope.responseRecalculateCodeList = [];
				localStorageService.set("PERSONAL_ACCIDENT_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
				$scope.PARecalculateQuoteRequest = callback.data;
				$scope.PAQuoteResult = [];
				$scope.quoteCalcResponse = [];
				angular.forEach($scope.PARecalculateQuoteRequest, function(obj, i){
					var request = {};
					var header = {};

					header.messageId = messageIDVar;
					header.campaignID = campaignIDVar;
					header.source=sourceOrigin;
					header.transactionName = $scope.globalLabel.transactionName.personalAccidentQuoteResult;
					header.deviceId = deviceIdOrigin;
					request.header = header;
					request.body = obj;

					$http({method:'POST', url: getQuoteCalcLink, data: request}).
					success(function(callback, status) {
						var paQuoteResponse = JSON.parse(callback);
						console.log("paQuoteResponse",paQuoteResponse);
						
						if(paQuoteResponse.responseCode == $scope.globalLabel.responseCode.success){
							console.log("!!!!1",paQuoteResponse.data.quotes[0].carrierId);

							if(paQuoteResponse.data != null && paQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId 
									&& paQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId){
									// $scope.selectedProduct = paQuoteResponse.data.quotes[0];
									$scope.loading = false;
									console.log("!!!!2");
								
							}											
							paQuoteResponse.data.quotes[0].id = paQuoteResponse.messageId;
							$scope.quoteCalcResponse.push(paQuoteResponse.data.quotes[0]);
						}else{
							console.log("!!!!3");


							if(paQuoteResponse.data != null && paQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId 
									&& paQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId){

								$scope.loading = false;
								var screenCnfrmError = $scope.selectedProduct.insuranceCompany +''+$scope.globalLabel.errorMessage.screenConfirmErrorMsg
								$rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, screenCnfrmError, "Ok");
							}
						}
					})
					error(function(data, status){
						$scope.responseRecalculateCodeList.push($scope.globalLabel.responseCode.systemError);
						$scope.loading = false;
					});
				});

			}else{
				$scope.loading = false;
				
				var screenCnfrmError = $scope.selectedProduct.insuranceCompany +''+$scope.globalLabel.errorMessage.screenConfirmErrorMsgDob
				$rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
			}

		});

	}



// this calculates policy end date 
	$scope.calcualtePolicyTerm = function(date){		
				var Day =   date.split("/")[0];
				var Month = date.split("/")[1];
				var Year =  date.split("/")[2];
				var policyEndDateTemp = new Date(Date.parse(Month+'/'+Day+'/'+Year));// convet in iso format 
				policyEndDateTemp.setDate(policyEndDateTemp.getDate() + 365); // add on more year to it 
				var d= policyEndDateTemp.getDate();
				var m= policyEndDateTemp.getMonth()+1;
				$scope.coverageDetails.policyEndDate = String(((d <= 9)?'0'+d:d)+'/'+((m <= 9)?'0'+m:m)+'/'+policyEndDateTemp.getFullYear());
	}
	$scope.iposRequest = {};
	$scope.iposRequest.docId = $location.search().quoteId;
	$scope.iposRequest.carrierId = $location.search().carrierId;
	$scope.iposRequest.planId = $location.search().productId;
	
	$scope.submitProposalData = function(selectedPolicyDetails){
		$scope.submitNomineeDetails()	
		$scope.proposalInfo();
		$scope.pAProposeFormDetails.QUOTE_ID = $scope.iposRequest.docId;
		$scope.pAProposeFormDetails.businessLineId = $scope.globalLabel.businessLineType.personalAccident;
		$scope.pAProposeFormDetails.carrierProposalStatus = false;
		$scope.pAProposeFormDetails.baseEnvStatus = baseEnvEnabled;

		$scope.loading = true;
		//console.log("Proposal submission started",$scope.pAProposeFormDetails);
		//console.log("Proposal submission step 1",$scope.pAProposeFormDetailsTmp);
		if ($rootScope.agencyPortalEnabled) {
			const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
			$scope.pAProposeFormDetails.requestSource = "agency";
			$scope.pAProposeFormDetails.userName = localdata.username;
			$scope.pAProposeFormDetails.agencyId = localdata.agencyId;
		}
		RestAPI.invoke($scope.transactionName, $scope.pAProposeFormDetailsTmp).then(function(proposeFormResponse){
			if(proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success){
				$scope.responseToken = proposeFormResponse.data;
				$scope.responseToken.paymentGateway = $scope.paymentURL;
				$scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.personalAccident;

				localStorageService.set("paReponseToken", $scope.responseToken);

				console.log("Payment service started",$scope.responseToken);

				getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.paymentService, $scope.responseToken, function(paymentDetails){
					console.log("Sending payment link to customer.");
					var proposalDetailsEmail = {};
					proposalDetailsEmail.paramMap = {};
					proposalDetailsEmail.funcType = $scope.globalLabel.functionType.proposalDetailsTemplate;
					proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
					proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
					proposalDetailsEmail.paramMap.selectedPolicyType = $scope.globalLabel.insuranceType.personalAccident;
					proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
					proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
					proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
					proposalDetailsEmail.paramMap.LOB = String($scope.globalLabel.businessLineType.personalAccident);
					RestAPI.invoke($scope.globalLabel.transactionName.sendEmail, proposalDetailsEmail).then(function(emailResponse){
						if(emailResponse.responseCode == $scope.globalLabel.responseCode.success){
							$scope.loading = false;
							$scope.modalIPOS = true;
						}else{
							$rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.emailSentFailed, "Ok");
						}
						//code for sending SMS Link to customer
						var proposalDetailsSMS = {};
						proposalDetailsSMS.paramMap = {};
						proposalDetailsSMS.funcType= "SHAREPROPOSAL";
						proposalDetailsSMS.paramMap.customerName= $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
						proposalDetailsSMS.paramMap.premiumAmount=String($scope.selectedProduct.grossPremium);
						proposalDetailsSMS.paramMap.docId = String($scope.responseToken.proposalId);
						proposalDetailsSMS.paramMap.LOB = String($scope.globalLabel.businessLineType.personalAccident);
						proposalDetailsSMS.mobileNumber = $scope.proposerDetails.mobileNumber;
						RestAPI.invoke($scope.globalLabel.transactionName.sendSMS, proposalDetailsSMS).then(function(smsResponse){
						//	console.log('smsResponse',smsResponse);
							if(smsResponse.responseCode == $scope.globalLabel.responseCode.success){
								$scope.smsResponseError = "";
								//$scope.modalOTP = true;		
							}else if(smsResponse.responseCode == $scope.globalLabel.responseCode.blockedMobile){
								$scope.smsResponseError = smsResponse.message;
								//$scope.modalOTPError = true;
							}else{
								$scope.smsResponseError = $scope.globalLabel.errorMessage.createOTP;
								//$scope.modalOTPError = true;
							}
							
						});
					});
				});
			}else{
				$scope.loading = false;
				/*if($scope.vehicleDetails.registrationNumber)
				{	
					var formatRegisCode = $scope.vehicleDetails.registrationNumber;
					$scope.assuranceInfo.registrationNumber = formatRegisCode.substring(4);
				}*/

				$rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.serverError, "Ok");
			}			
		});
	}

	$scope.hideModalIPOS = function(){
		$scope.modalIPOS = false;
	};
	/*----- iPOS+ Functions Ends -------*/
	$scope.prepopulateFields=function()
	{
		$scope.authenticate.enteredOTP="";
		$scope.proposerDetails.tobacoAdicted = $scope.selectedProductInputParam.quoteParam.tobacoAdicted;
	}

	$scope.prepopulateFields();

	$scope.proceedForPayment = function(){

		

		$scope.proceedPaymentStatus = false;
		var authenticateUserParam = {};

		authenticateUserParam.mobileNumber = $scope.proposerDetails.mobileNumber;
		authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
		
		
		getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.validateOTP, authenticateUserParam, function(createOTP){
		if(createOTP.responseCode == $scope.globalLabel.responseCode.success ){

				$scope.modalOTP = false;
				$scope.invalidOTPError = "";
				/*$scope.proposerDetails.userOTP = authenticateUserParam.OTP;*/ 			
		
				$scope.proposalInfo();
				$scope.pAProposeFormDetailsTmp.QUOTE_ID = localStorageService.get("PERSONAL_ACCIDENT_UNIQUE_QUOTE_ID");

				
				// $scope.pAProposeFormDetails.businessLineId = $scope.globalLabel.businessLineType.personalAccident;
				if(!$rootScope.wordPressEnabled){
					$scope.pAProposeFormDetailsTmp.baseEnvStatus = baseEnvEnabled;
					$scope.pAProposeFormDetailsTmp.source = "website";
				}else{
					$scope.pAProposeFormDetailsTmp.source = "wordpress";
				}
				console.log("$scope.pAProposeFormDetailsTmp)",$scope.pAProposeFormDetailsTmp);
				localStorageService.set("pAProposeFormDetails", $scope.pAProposeFormDetailsTmp);
				// Google Analytics Tracker added.
				//analyticsTrackerSendData($scope.pAProposeFormDetails); 

				$scope.loading = true;
				// console.log(" $scope.pAProposeFormDetails", $scope.pAProposeFormDetails);
				// console.log("$scope.transactionName",$scope.transactionName);
				RestAPI.invoke($scope.transactionName, $scope.pAProposeFormDetailsTmp).then(function(proposeFormResponse){
					console.log("proposeFormResponse",proposeFormResponse);




					$scope.modalOTP = false;
					$scope.authenticate.enteredOTP="";
					$scope.modalOTPError = false;
					$scope.proceedPaymentStatus = true;

					if(proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success){ 
						$scope.responseToken = proposeFormResponse.data;
						$scope.responseToken.paymentGateway = $scope.paymentURL;
						$scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.personalAccident;
						// console.log("$scope.responseToken",$scope.responseToken);
						localStorageService.set("paReponseToken", $scope.responseToken);
						getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.paymentService, $scope.responseToken, function(paymentDetails){
							if(paymentDetails.responseCode == $scope.globalLabel.responseCode.success){
								$scope.paymentServiceResponse = paymentDetails.data;
								//olark
								var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
								// for(var i = 0; i < paymentURLParamListLength; i++){
								// 	if($scope.paymentServiceResponse.paramterList[i].name=='SourceTxnId' && $scope.paymentServiceResponse.paramterList[i].ngModel=='SourceTxnId'){
								// 		olarkCustomParam($scope.paymentServiceResponse.paramterList[i].value, $scope.globalLabel.businessLineType.personalAccident,'', 'proposal');
								// 	}
								// }

								if($scope.paymentServiceResponse.method == "GET"){
									var paymentURLParam = "?";
									var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
									for(var i = 0; i < paymentURLParamListLength; i++){
										if(i < (paymentURLParamListLength-1) )
											paymenztURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value + "&";
										else
											paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value;
									}

									$window.location.href = $scope.paymentServiceResponse.paymentURL + paymentURLParam;
								}else{
									$timeout(function () {
										$scope.paymentForm.setAction($scope.paymentServiceResponse.paymentURL);
										$scope.paymentForm.commit();
									}, 100);
								}
							}else{
								$scope.loading = false;
								var buyScreenCnfrmError = paymentDetails.responseCode + " : " + $scope.globalLabel.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
								$rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, buyScreenCnfrmError, "Ok");
							}
						});
					}else if(proposeFormResponse.responseCode == $scope.globalLabel.responseCode.error){
						$scope.loading = false;   
						$rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
					}
					else{
						$scope.loading = false;
						var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.globalLabel.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
						$rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, buyScreenCnfrmError, "Ok");
					}
				});
			}else if(createOTP.responseCode == $scope.globalLabel.responseCode.noRecordsFound){
				$scope.invalidOTPError = $scope.globalLabel.validationMessages.invalidOTP;
			}else if(createOTP.responseCode == $scope.globalLabel.responseCode.expiredOTP){
				$scope.invalidOTPError = $scope.globalLabel.validationMessages.expiredOTP;
			}else if(createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile){
				$scope.invalidOTPError = createOTP.message;
			}else{
				$scope.invalidOTPError = $scope.globalLabel.validationMessages.authOTP;
			}
		});
	};
	setTimeout(function(){
		$('.buyform-control').on('focus blur', function (e) {
			$(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
			
		// console.log("!!!!!!!!!!!!!!!66666")
		}).trigger('blur');
	},4000)

	setTimeout(function(){
		$('.buyform-control').on('focus blur', function (e) {
			$(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
		}).trigger('blur');
	},500)

	$scope.scheduleVehicleInspection=function(){
		$location.path('/FourWheelerscheduleInspection');
	}

	$rootScope.signout = function(){
		$rootScope.userLoginStatus = false;
		var userLoginInfo = {};
		userLoginInfo.username = undefined;
		userLoginInfo.status = $rootScope.userLoginStatus;
		localStorageService.set("userLoginInfo", userLoginInfo);
		$location.path("/quote");
	}
	
	$scope.$on("setCommAddressByAPI", function(){
		setTimeout(function(){
			var googleAddressObject = angular.copy($scope.chosenCommPlaceDetails);
			getAddressFields(googleAddressObject, function(fomattedAddress, formattedCity, formattedState, formattedPincode){
				$scope.addressDetails.communicationAddress.address = fomattedAddress;

				if(String(formattedPincode) != "undefined" && formattedPincode != ""){
					$scope.calcDefaultAreaDetails(formattedPincode);					
				}else{
					$scope.addressDetails.communicationAddress.pincode = "";
					$scope.addressDetails.communicationAddress.state = "";
					$scope.addressDetails.communicationAddress.city = "";
				}
				$scope.$apply();
			});
		},10);
	});

	$scope.$on("setRegAddressByAPI", function(){
		setTimeout(function(){
			var googleAddressObject = angular.copy($scope.chosenRegPlaceDetails);
			getAddressFields(googleAddressObject, function(fomattedAddress, formattedCity, formattedState, formattedPincode){
				$scope.permanentAddressDetails.address = fomattedAddress;

				if(String(formattedPincode) != "undefined" && formattedPincode != ""){
					$scope.calcDefaultPermAreaDetails(formattedPincode);					
				}else{
					$scope.permanentAddressDetails.pincode = "";
					$scope.permanentAddressDetails.state = "";
					$scope.permanentAddressDetails.city = "";
				}
				$scope.$apply();
			});
		},10);
	});
	$scope.showAmount = function(amount){
		if(amount>100000)
		return Math.round(amount/100000);
		else
		return 0;
	}
	$scope.checkSum = function(amount){

		if(amount < 500000 || amount == undefined || typeof(amount) == undefined   ){

			$scope.disableSubmit = true;				
			$scope.message = "Please enter the amount Greater Than 5 Lac ";
		}
		if(amount > 25000000)
		{	
			
			$scope.disableSubmit = true;				
			$scope.message = "Please enter the amount Less than 2.5 Crore ";

		}
		if(amount > 500000 && amount <=20000000 )
		{
			$scope.message = "";
		$scope.disableSubmit = false;
			
		}				

	}


	

	// Hide the footer navigation links.
	$(".activateFooter").hide();
	$(".activateHeader").hide();
}]);


