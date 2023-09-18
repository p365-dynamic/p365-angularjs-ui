'use strict';
angular.module('homeResult', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages','checklist-model'])
.controller('homeResultController', ['$scope', '$rootScope', '$filter', '$location', '$http', '$window', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$sce', function($scope, $rootScope, $filter, $location, $http, $window, RestAPI, localStorageService, $timeout, $interval, $sce){

	// Setting application labels to avoid static assignment.	-	modification-0003
	var applicationLabels = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	$rootScope.loaderContent={businessLine:'7',header:'Home Insurance',desc:$sce.trustAsHtml($scope.globalLabel.applicationLabels.home.proverbResult)};
	$rootScope.title = $scope.globalLabel.policies365Title.homeResultQuote;
	
	$scope.quote = {};
	$scope.quoteUserInfo = {};
	//$scope.morePlans = [];
	// $rootScope.loading = true;
	$rootScope.instantQuoteSummaryStatus = true;
	$rootScope.disableLandingLeadBtn=false;

	//for wordpress
	if($rootScope.wordPressEnabled){
		$scope.rippleColor = '';
	}else{
		$scope.rippleColor = '#f8a201';
	}
	
	//for agencyPortal
	$scope.modalView= false;
	if($rootScope.agencyPortalEnabled)
	{
		//checking for lead
	var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
	  if(!quoteUserInfoCookie){
		  $scope.modalView= true;  
	  }
	}
	//for wordpress
	$scope.homeInputSectionHTML = wp_path+'buy/home/html/HomeInputSection.html';
	$scope.homeShareEmailSectionHTML=wp_path+'buy/home/html/HomeShareEmailSection.html'

	//for olark
	// olarkCustomParam(localStorageService.get("HOME_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),false);
	//$scope.carrierLogoList = localStorageService.get("carrierLogoList");
	if(localStorageService.get("userLoginInfo")){
		$rootScope.userLoginStatus = localStorageService.get("userLoginInfo").status;
		$rootScope.username = localStorageService.get("userLoginInfo").username;
	}
	$rootScope.loading = true;
	$rootScope.isBackButtonPressed=false;
	$rootScope.disableLandingLeadBtn=false;

	
	//added to collapse & expand inputSection for ipos
	$scope.homeInputSection=false;
	$scope.typeOfHome=homeTypeGeneric;
	$scope.typeOfProperty=propertyTypeGeneric;
	$scope.policyTermArray=homePolicyTermList;
	
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
		$scope.quoteHomeInputForm.homeInputForm.$setDirty();
		$scope.modalPIN = !$scope.modalPIN;
		$scope.oldPincode =$scope.personalDetails.pincode;
		$scope.hideModal = function(){
			$scope.personalDetails.pincode = $scope.oldPincode;
			$scope.modalPIN = false;
		};
		
	};
	
	$scope.quotesToShow = $rootScope.homeQuoteResult;
	
	// 	$scope.groupPlans = function(data){
	// 	var morePlans = [];
	// 	for(var i=0;i<$rootScope.homeQuoteResult.length;i++){
	// 		if(data.carrierId == $rootScope.homeQuoteResult[i].carrierId && (data.planId != $rootScope.homeQuoteResult[i].planId)){
	// 			morePlans.push($rootScope.homeQuoteResult[i]);
	// 		}
	// 	}
		
	// 	return morePlans;
	// }
		
	// $scope.isMoreQuoteToShow = function(morePlans,carrierId){
	// 	for(var i=0;i<morePlans.length;i++){
	// 		if(morePlans[i].carrierId == carrierId){
	// 		return (morePlans.length>0)?true:false;
	// 		}
	// 	}
		
	// }
	
	// Fetch lead id from url for iQuote+.
	if($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled){
		messageIDVar = $location.search().messageId;
		$scope.quoteUserInfo.messageId = $location.search().messageId;
	
		//added to collapse & expand inputSection for ipos
		$scope.homeInputSection=true;
		
		// $scope.riderInputSection=true;	
	}
	
	/*below functions for expand-collapse of DOM for ipos */
	$scope.showPersonalDetails=function()
	{
		$scope.hometInputSection=!$scope.homeInputSection;
	}

	

	
	/*end of ipos function for expand-collapse of DOM 	*/

	$scope.backToResultScreen = function(){
		if($rootScope.wordPressEnabled){
		$rootScope.isBackButtonPressed=true;	
		}
		$location.path("/quote");
	};

	// var carrierRiderList = angular.copy($rootScope.carrierDetails);

	var docId = $scope.globalLabel.documentType.quoteResultScreen + "-" + localStorageService.get("selectedBusinessLineId");
//	console.log(' docId', docId);
	getDocUsingId(RestAPI, docId, function(tooltipContent){
		//console.log("tooltipcontent",tooltipContent);
		$scope.tooltipContent = tooltipContent.toolTips;

		$scope.selectedAddOnCovers = [];
		$scope.sortByElement = [];
		$scope.selectedCarrier = [];

		$scope.riderFeatureLength = 0;

		$scope.expose = false;
		$scope.tempStatus = true;

		var setFlag = false;
		var setExposeFlag = true;
		var setExposeReportFlag = true;

		$scope.quoteParam = localStorageService.get("homeQuoteInputParamaters").quoteParam;
		$scope.personalDetails = localStorageService.get("homePersonalDetails");
		

		$scope.insuranceCompanyList = {};
		$scope.insuranceCompanyList.selectedInsuranceCompany=[];
		$scope.disableSubmit = false; // disable get quotes form 

		// To get the rider list applicable for this user.
	
		//$scope.sortType = sortTypesCriticalIllnessGeneric[0];
		//$scope.sortTypes = sortTypesCriticalIllnessGeneric;
		$scope.sortTypes = sortTypesHomeGeneric;
		$scope.relationType = relationLifeQuoteGeneric;
		$scope.healthConditionType = healthConditionGeneric;
		$scope.annualIncomesRange = annualIncomesGeneric;
		$scope.healthTypeCondition = healthTypeConditionGeneric;
		$scope.riskLevels = riskLevelsGeneric;
		$scope.selectedSortOption = $scope.sortTypes[0];
		$scope.activeSort = $scope.sortTypes[0].key;
		
		//$scope.genderType = genderTypeGeneric;
		//$scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
		$scope.comparePoliciesDisplayList = comparePoliciesDisplayValues;

		$scope.compareLifePoliciesDisplayList = compareLifePoliciesDisplayValues;

		

		

//		$scope.personalDetails.maturityAge = paMaturityAgeConstant;
		//$scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);
		$scope.personAge = $scope.quoteParam.age;
		
		//added for reset
		$scope.quoteParamCopy=angular.copy($scope.quoteParam);
		$scope.personalDetailsCopy=angular.copy($scope.personalDetails);

			

		$scope.openMenu = function($mdOpenMenu, ev){
			$mdOpenMenu(ev);
			setTimeout(function(){
				$('.md-click-catcher').click(function(){
					$scope.activeMenu = '';
				});
			}, 100);
		};

		$scope.clickForActive = function(item){
			$scope.activeMenu = item;
		};

		$scope.clickForViewActive=function(item){
			$scope.activeViewMenu=item;
		};

		$scope.clickForViewActive('Compare');
		
		$scope.clicktoDisable = function(){
			setTimeout(function(){
				$('.md-click-catcher').css('pointer-events','none');
			},100);
		};

		//code for share email
		$scope.EmailChoices=[{'username':'','addNew':true,paramMap:{'docId':'','LOB': localStorageService.get("selectedBusinessLineId").toString(),'userId':'','selectedPolicyType':''}}];//$scope.quoteParam.quoteType
		$scope.quoteUserInfo.messageId='';
		$scope.quoteUserInfo.termsCondition=true;
		var flag=false;
		//$scope.modalView=false;
		$scope.modalEmailView=false;
		$scope.emailPopUpDisabled=false;

		if(localStorageService.get("quoteUserInfo"))
		{
			$scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
		}

		$scope.addNewChoice = function() {
			var newItemNo = $scope.EmailChoices.length+1;
			if(newItemNo <= 3){
				$scope.EmailChoices.push({
					'username':''
				})
				$scope.EmailChoices[0].addNew = false;
				$scope.EmailChoices[1].addNew = true;
				$scope.emailPopUpDisabled=false;	
			}
			if(newItemNo == 3)
			{
				$scope.EmailChoices[2].addNew = false;
				$scope.emailPopUpDisabled=true;	
			}
		};


		$scope.removeChoice = function() {
			var lastItem = $scope.EmailChoices.length-1;
			$scope.EmailChoices.splice(lastItem);
		};

//		$scope.showForShare = function(data){
//			return true;
//
//
//			// if($rootScope.parseCarrierList){
//			// 	for(var j=0;j< $rootScope.parseCarrierList.length;j++){
//			// 		if(data.carrierId==$rootScope.parseCarrierList[j]){
//			// 			return true;
//			// 		}
//			// 	}
//			// }else{
//			// 	return true;
//			// }
//		}
		$scope.showForShare = function(data){
			if($rootScope.parseCarrierList){
				for(var j=0;j< $rootScope.parseCarrierList.length;j++){
					if(data.carrierId==$rootScope.parseCarrierList[j]){
						return true;
					}
				}
			}else{
				return true;
			}
		}

		$scope.sendQuotesByEmail=function()
		{
			for(var i=0;i< $scope.EmailChoices.length;i++)
			{	
				if($scope.EmailChoices[i].username==''|| $scope.EmailChoices[i].username==undefined)
				{
					continue;
				}
				//code for encode
				var encodeQuote = localStorageService.get("HOME_UNIQUE_QUOTE_ID");
				var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
				var encodeEmailId=$scope.EmailChoices[i].username;
				var encodeMonthlyPremiumOption=String($scope.isMonthlyPremium);
				var encodeCarrierList = [];

				if($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0){
					encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
					var jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
				}else{
					encodeCarrierList.push("ALL");
				}

				var key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
				var iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

				var encryptedQuote = CryptoJS.AES.encrypt(encodeQuote, key, {iv: iv});
				$rootScope.encryptedQuote_Id = encryptedQuote.ciphertext.toString()

				var encryptedNewLOB = CryptoJS.AES.encrypt(encodeLOB, key, {iv: iv});
				$rootScope.encryptedLOB = encryptedNewLOB.ciphertext.toString();

				var encryptedEmailId = CryptoJS.AES.encrypt(encodeEmailId, key, {iv: iv});
				$rootScope.encryptedEmail = encryptedEmailId.ciphertext.toString();

				var encryptedMonthlyPremiumOption = CryptoJS.AES.encrypt(encodeMonthlyPremiumOption, key, {iv: iv});
				$rootScope.encryptedMonthlyPremium = encryptedMonthlyPremiumOption.ciphertext.toString();

				var encryptedCarrierList = CryptoJS.AES.encrypt(jsonEncodeCarrierList, key, {iv: iv});
				$rootScope.encryptedCarriers = encryptedCarrierList.ciphertext.toString();

				$scope.EmailChoices[i].funcType="SHARECIQUOTE";
				$scope.EmailChoices[i].paramMap={};
				$scope.EmailChoices[i].paramMap.docId=String($rootScope.encryptedQuote_Id);
				$scope.EmailChoices[i].paramMap.LOB=String($rootScope.encryptedLOB);
				$scope.EmailChoices[i].paramMap.userId=String($rootScope.encryptedEmail);
				$scope.EmailChoices[i].paramMap.carriers=String($rootScope.encryptedCarriers);
				$scope.EmailChoices[i].paramMap.monthlyPremiumOption=String($rootScope.encryptedMonthlyPremium) ;
				$scope.EmailChoices[i].paramMap.selectedPolicyType="HOME";

				var request = {};
				var header = {};
				var browser = get_browser_info();
					
				header.messageId = messageIDVar;
				header.campaignID = campaignIDVar;
				header.source=sourceOrigin;
				header.transactionName =sendEmail;
				header.deviceId = deviceIdOrigin;
				request.header = header;
				request.body = $scope.EmailChoices[i];			

				$http({method:'POST', url: getQuoteCalcLink, data: request}).
				success(function(callback)
						{
					var emailResponse = JSON.parse(callback);
					var receiptNum=$scope.EmailChoices.length;
					if(i==receiptNum)
					{	
						if(emailResponse.responseCode == $scope.globalLabel.responseCode.success){
							$scope.shareEmailModal=false;
							$scope.modalEmailView = true;
						}
						else{
							localStorageService.set("emailDetails", undefined);
							flagCheck.flag =false;
						}
					}
						});	

			}
		}
		
		$scope.deleteReceipient= function(index){
			 $scope.EmailChoices.splice(index,1);
			 if($scope.EmailChoices.length < 3){
				 $scope.emailPopUpDisabled=false;
				 if($scope.EmailChoices.length == 1){
						$scope.EmailChoices[0].addNew=true;
						$scope.EmailChoices[1].addNew=false;
					}else{
						$scope.EmailChoices[0].addNew=false;
						$scope.EmailChoices[1].addNew=true;
					}
			 }
		 }
		
	

//		 $scope.premiumFrequencyTypeName = function(premiumType){
//			if(premiumType == "Y"){
//				return $scope.globalLabel.applicationLabels.criticalIllness.annualPremium;
//			}else if(premiumType == "HY") {
//				return $scope.globalLabel.applicationLabels.criticalIllness.halfYearlyPremium;
//
//			}else if(premiumType == "Q") {
//				return $scope.globalLabel.applicationLabels.criticalIllness.quaterlyPremium;
//
//			}else if(premiumType == "M") {
//				return $scope.globalLabel.applicationLabels.criticalIllness.monthlyPremium;
//			}
//
//		 }


	// STARTS HEARE ....
	
	// $scope.state = false;
	// $scope.toggleState = function() {
	// 	$scope.state = !$scope.state;
	// };
	// $scope.$mdMenu = {open : this.open};

	// $scope.openMenu = function($mdOpenMenu, ev) {
	// 	$mdOpenMenu(ev);
	// 	setTimeout(function(){
	// 		$('.md-click-catcher').click(function(){
	// 			$scope.activeMenu='';
	// 		});
	// 	},100);
	// };

	// $scope.clickForActive=function(item){
	// 	$scope.activeMenu=item;
	// };

	// $scope.clickForViewActive=function(item){
	// 	$scope.activeViewMenu=item;
	// };

	// $scope.clickForViewActive('Compare');

	// $scope.clicktoDisable = function(){
	// 	setTimeout(function(){
	// 		$('.md-click-catcher').css('pointer-events','none');
	// 	},100);
	// };

///end heare 


		$scope.hideEmailModal=function()
		{
			$scope.modalEmailView =false;
			$scope.shareEmailModal=false;
		}

		// // Create lead with available user information by calling webservice for share email.
		$scope.leadCreationUserInfo = function(){
		// 	console.log("in Result controller");
		// 	var userInfoWithQuoteParam = {};
		// 	$scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
		// 	localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
		// 	userInfoWithQuoteParam.quoteParam = localStorageService.get("ciInputParamaters");
		// 	userInfoWithQuoteParam.contactInfo = $scope.quoteUserInfo;
		// 	if($rootScope.agencyPortalEnabled){
		// 	 const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
		// 	 userInfoWithQuoteParam.contactInfo.createLeadStatus = false;
		//      userInfoWithQuoteParam.requestSource = "agency";
        //      userInfoWithQuoteParam.userName = localdata.username;
        //      userInfoWithQuoteParam.agencyId = localdata.agencyId;	
		// }else{
		// 	$scope.quoteUserInfo.emailId=$rootScope.decryptedEmailId;
		// 	userInfoWithQuoteParam.requestSource = "web";
		// }

		// 	//	Webservice call for lead creation.	-	modification-0010
		// 	if($scope.quoteUserInfo != null){
		// 		if($scope.quoteUserInfo.messageId==''){
		// 	console.log("userInfoWithQuoteParam ::::::::::::::::::::: ",JSON.stringify(userInfoWithQuoteParam));
		// 			RestAPI.invoke($scope.globalLabel.transactionName.createLead, userInfoWithQuoteParam).then(function(callback){
		// 				if(callback.responseCode == $scope.globalLabel.responseCode.success){
		// 					messageIDVar = callback.data.messageId;
		// 					$scope.quoteUserInfo.messageId = messageIDVar;
		// 					localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
		// 					$scope.modalView= false;
		// 					//console.log("lead"+JSON.stringify(messageIDVar))
		// 				}

		// 			});

		// 		}else{
		// 			messageIDVar=$scope.quoteUserInfo.messageId;
		// 		}
		// 	}
		};

		$scope.redirectToResult = function() {
			$scope.leadCreationUserInfo();
		};
		
		$scope.redirectToAPResult = function() {
		$scope.leadCreationUserInfo();
	   };

		//setting flag for showing quote user info popup in share email
		if($rootScope.flag || $rootScope.isOlarked)
		{
			$scope.isMonthlyPremium=$rootScope.decryptedMonthlyPremiumOption;
			if($scope.isMonthlyPremium=="true")
			{
				$scope.isMonthlyPremium=true;
			}else{
				$scope.isMonthlyPremium=false;
				$scope.isQuarterlyPremium = false;
				$scope.isHalfAnnualPremium = false;
				$scope.isAnnualPremium=true;
				$scope.premiumChoice=false;
			}	
			if($rootScope.selectedAddOnCovers!=undefined)
			{	
				$scope.personalDetails.selectedAddOnCovers=$rootScope.selectedAddOnCovers;
			}
			angular.copy($scope.personalDetails.selectedAddOnCovers,$scope.selectedAddOnCoversCopy);
			for(var i=0; i < $scope.payoutOptions.length; i++)
			{
				if($scope.payoutOptions[i].id==$scope.quoteParam.payoutId)
				{
					$scope.payoutDetails.payoutOption=$scope.payoutOptions[i];
					break;
				}
			}
			if($rootScope.flag){
				$scope.redirectToResult();
				$rootScope.flag=false;	
			}
			if(localStorageService.get("quoteUserInfo"))
			{
				$scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
			}
			$rootScope.loading=false;
		}

		$scope.calculateSumAssured = function(){
			listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured){
				$scope.quoteParam.structureSumInsured = selectedSumAssured.amount;
				$scope.personalDetails.sumInsuredObject = selectedSumAssured;
				$scope.personalDetails.sumInsuredList = sumInsuredArray;
			});
		}

		// $scope.updateRiders = function(rider){
		// 	var selectedRidersWithRequest = $scope.personalDetails.selectedAddOnCovers;
		// 	var flag = -1;

		// 	for(var i = 0; i < selectedRidersWithRequest.length; i++){
		// 		if(selectedRidersWithRequest[i].riderId == rider.riderId)
		// 			flag = i;
		// 	}

		// 	if(flag > -1)
		// 		selectedRidersWithRequest.splice(flag, 1);
		// 	else
		// 		selectedRidersWithRequest.push(rider);
		// 	$scope.personalDetails.selectedAddOnCovers = selectedRidersWithRequest;
		// 	if(!$rootScope.wordPressEnabled)
		// 	{	
		// 		$scope.singleClickCriticalIllnessQuote();
		// 	}
		// }

		$scope.submitBtn = false;
		$scope.editBtn = true;
		var setChangeFlag = true;
		$scope.toggleChange = function(clickEvent){
			$('.firstPane').addClass('opened');
			$('.firstPaneContent').show();
			if($('.viewDiv').is(':visible') == true){
				//$(".modifyDiv").slideDown();
				//$(".viewDiv").slideUp();
				$scope.editBtn = false;
				$scope.submitBtn = true;
				$scope.cancelBtn = true;
			}else{
				if($('.modifyDiv').is(':visible') == true && clickEvent == "submit"){
					$scope.editBtn = true;
					$scope.cancelBtn = false;
					$scope.submitBtn = false;
					$scope.singleClickHomeQuote();
				}else{
					/*$scope.quote = localStorageService.get("lifeQuoteInputParamaters");
					$scope.personalDetails = localStorageService.get("lifePersonalDetails");*/
					angular.copy($scope.quoteParamCopy,$scope.quoteParam);
					angular.copy($scope.personalDetailsCopy,$scope.personalDetails);
					$scope.quoteHomeInputForm.homeInputForm.$setPristine();
					$scope.homeInputForm=false;   
					$scope.editBtn = true;
					$scope.cancelBtn = false;
					$scope.submitBtn = false;
				}
			}
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
		$scope.showPropertyAge =function(age){
			if(age => 1)
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
		$scope.setfromController = true;
		var setFlag = true;
		$scope.submitReportBtn = false;
		$scope.editReportBtn = true;
		$scope.toggleReportChange = function(){
			$('.thirdPane').addClass('opened');
			$('.thirdPaneContent').show();
			if($('.viewReportDiv').is(':visible') == true){
				$(".modifyReportDiv").show();
				$(".viewReportDiv").hide();
				$scope.editReportBtn = false;
				$scope.submitReportBtn = true;;
				$scope.cancelReportBtn = true;
				setFlag = false;
			} else if($('.modifyReportDiv').is(':visible') == true){
				$(".viewReportDiv").slideDown();
				$(".modifyReportDiv").slideUp();
				$scope.editReportBtn = true;
				$scope.submitReportBtn = false;
				$scope.cancelReportBtn = false;
				setFlag = true;
			}
			
		}



		// Function created to sort quote result.	-	modification-0002
		$scope.updateSort = function(sortOption){
			//console.log('in updateSort')
			$scope.activeSort = sortOption.key;
			$scope.selectedSortOption = sortOption;
			if(sortOption.key == 1){
				$scope.sortKey = "annualPremium";
				$scope.sortReverse = false;
			}else if(sortOption.key == 2){
				$scope.sortKey = "structureSumInsured";
				$scope.sortReverse = true;
			}else if(sortOption.key == 3){
				$scope.sortKey = "insurerIndex";
				$scope.sortReverse = true;
			}else if(sortOption.key == 4){
				$scope.sortKey = "ratingsList['8']["+$scope.benefitFeatureRiskType.id+"]";
				$scope.sortReverse = true;
			}else if(sortOption.key == 5){
				$scope.sortKey = "ratingsList['9']["+$scope.flexibleFeatureRiskType.id+"]";
				$scope.sortReverse = true;
			}else if(sortOption.key == 6){
				$scope.sortKey = "ratingsList['11']["+$scope.savingFeatureRiskType.id+"]";
				$scope.sortReverse = true;
			}else if(sortOption.key == 7){
				$scope.sortKey = "ratingsList['10']["+$scope.eligibilityFeatureRiskType.id+"]";
				$scope.sortReverse = true;
			}

			$scope.toggleState();
		}
		$scope.updateSortOrder = function(){
			//console.log('in updateSortOrder');
			if($scope.selectedSortOption.key == 1){
				$scope.sortKey = "annualPremium";
			}else if($scope.selectedSortOption.key == 2){
				$scope.sortKey = "structureSumInsured";
			}else if($scope.selectedSortOption.key == 3){
				$scope.sortKey = "insurerIndex";
			}else if($scope.selectedSortOption.key == 4){
				$scope.sortKey = "ratingsList['8']["+$scope.benefitFeatureRiskType.id+"]";
			}else if($scope.selectedSortOption.key == 5){
				$scope.sortKey = "ratingsList['9']["+$scope.flexibleFeatureRiskType.id+"]";
			}else if($scope.selectedSortOption.key == 6){
				$scope.sortKey = "ratingsList['11']["+$scope.savingFeatureRiskType.id+"]";
			}else if($scope.selectedSortOption.key == 7){
				$scope.sortKey = "ratingsList['10']["+$scope.eligibilityFeatureRiskType.id+"]";
			}
			$scope.sortReverse = !$scope.sortReverse;
		}


		
		
		// Function created to get default list of input paramters from DB.	-	modification-0004
		$scope.fetchDefaultInputParamaters = function(defaultInputParamCallback){
			getDocUsingId(RestAPI, $scope.globalLabel.documentType.defaultHomeQuoteParam, function(callback){
				$scope.quoteParam = callback.quoteParam;
				$scope.personalDetails = callback.personalDetails;
				
				listSumAssuredAmt($scope.quoteParam.annualIncome, function(sumInsuredArray, selectedSumAssured){
					$scope.personAge = $scope.quoteParam.age;
					$scope.personalDetails.sumInsuredObject = selectedSumAssured;
					$scope.personalDetails.sumInsuredList = sumInsuredArray;

					for(var i = 0; i < annualIncomesGeneric.length; i++){
						if($scope.quoteParam.annualIncome == annualIncomesGeneric[i].annualIncome){
							$scope.personalDetails.annualIncomeObject = annualIncomesGeneric[i];
							break;
						}
					}

					defaultInputParamCallback();
				});
			});
		}



		$scope.errorRespCounter=true;
		$scope.errorMessage = function(errorMsg){
			if($scope.errorRespCounter && (String($rootScope.homeQuoteResult) == "undefined" || $rootScope.homeQuoteResult.length == 0)){
				$scope.errorRespCounter = false;
				$scope.errorRespMsg = errorMsg;
				$rootScope.progressBarStatus = false;
				$rootScope.viewOptionDisabled = true;
				$rootScope.tabSelectionStatus = true;
				$rootScope.loading = false;
			} else if($rootScope.homeQuoteResult.length > 0){
				$rootScope.progressBarStatus = false;
				$rootScope.viewOptionDisabled = false;
				$rootScope.tabSelectionStatus = true;
				$rootScope.loading = false;
			}
		}
//		$scope.tooltipPrepare = function(paResult){
//			
//			var resultCarrierId = [];
//			var testCarrierId = [];
//			//$rootScope.resultCarrierId = [];
//			for(var i = 0; i < paResult.length; i++){
//				//push only net premium if greater than 0
//					var carrierInfo = {};
//					carrierInfo.id = paResult[i].carrierId;
//					
//					carrierInfo.name = paResult[i].insuranceCompany;
//					carrierInfo.annualPremium = paResult[i].grossPremium;
//					//carrierInfo.annualPremium = ciResult[i].monthlyFinalPremium;
//					//carrierInfo.isMonthlyPremium = false;
//					
//					carrierInfo.claimsRating = paResult[i].insurerIndex;
//					if($rootScope.wordPressEnabled)
//					{
//					carrierInfo.structureSumInsured=paResult[i].structureSumInsured;
//					carrierInfo.businessLineId="8";
//					}
//					if(p365Includes(testCarrierId,paResult[i].carrierId) == false){
//					
//				
//					resultCarrierId.push(carrierInfo);
//						testCarrierId.push(paResult[i].carrierId);
//					}
//						
//					
//			}
//			
//			$rootScope.resultCarrierId=resultCarrierId;
//		//	console.log('$rootScope.resultCarrierId',$rootScope.resultCarrierId);
//			
//			$rootScope.quoteResultInsurerList =  "\n<ul style='text-align: left;' class='tickpoints'>";
//			for(var i = 0; i < resultCarrierId.length; i++){
//				$rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
//				
//			}
//			$rootScope.quoteResultInsurerList += "</ul>";
//
//			
//			$rootScope.calculatedQuotesLength = (String(paResult.length)).length == 2 ? String(paResult.length) : ("0" + String(paResult.length));
//			setTimeout(function(){
//
//				scrollv = new scrollable({
//					wrapperid: "scrollable-v",
//					moveby: 4,
//					mousedrag: true
//				})
//
//
//			},2000)
//		}

		$scope.processResult = function(){
			$rootScope.progressBarStatus = false;
			$rootScope.viewOptionDisabled = false;
			$rootScope.tabSelectionStatus = true;
			$rootScope.loading = false;

			$rootScope.homeQuoteResult = $filter('orderBy')($rootScope.homeQuoteResult, 'grossPremium');
			//console.log("homeQuoteResult",homeQuoteResult);
			$rootScope.homeQuoteResult = changeCurrencySymbol($rootScope.homeQuoteResult);
		localStorageService.set("homeQuoteResult",$rootScope.homeQuoteResult);
			$scope.updateSortOrder();
			/*for(var j = 0; j < $rootScope.ciQuoteResult.length; j++){
				if(j==$rootScope.ciQuoteResult.length -1 ){
					$timeout(function(){
						$scope.dataLoaded=true;
						//$scope.slickLoaded=true;
					},1000);
				}
			}*/
			$scope.quotesToShow = $rootScope.homeQuoteResult;
			//$scope.tooltipPrepare($rootScope.paQuoteResult);
			//console.log('$rootScope.paQuoteResult in process res'+JSON.stringify($rootScope.paQuoteResult));
		}

		$scope.displayRibbon=function(){
			$scope.isMinPremium=function(annualPremiumValue,carrierIDValue){
				//console.log('$rootScope.paQuoteResult[0].grossPremium',$rootScope.paQuoteResult[0].grossPremium);
				var min=$rootScope.homeQuoteResult[0].grossPremium;

				for(var i=0;i<= $rootScope.homeQuoteResult.length-1;i++){
					var carrierIdMin=$rootScope.homeQuoteResult[i].carrierId;
					if(Number($rootScope.homeQuoteResult[i].grossPremium) < min){
						min=$rootScope.homeQuoteResult[i].grossPremium;
						carrierIDValue=carrierIdMin;
					}
				}
				if(min===annualPremiumValue){
					$scope.selMinCarrierId=carrierIDValue;

					return true;
				}else{
					return false;
				}
			}

			$scope.isMaxIndex=function(insurerIndex,structureSumInsured,grossPremium,carrierSelID){
				var maxSel=(grossPremium / (insurerIndex * structureSumInsured))*1000;
				//console.log('$rootScope.homeQuoteResult[0]',$rootScope.homeQuoteResult[0]);
				var insurerIndex0=$rootScope.homeQuoteResult[0].insurerIndex;
				var sumInsured0=$rootScope.homeQuoteResult[0].structureSumInsured;
				var annualPremium0=$rootScope.homeQuoteResult[0].grossPremium;
				var max=(annualPremium0 / (sumInsured0 * insurerIndex0))*1000;

				for(var i=0;i<= $rootScope.homeQuoteResult.length-1;i++){
					var insurerIndexI=$rootScope.homeQuoteResult[i].insurerIndex;
					var sumInsuredI=$rootScope.homeQuoteResult[i].structureSumInsured;
					var annualPremiumI=$rootScope.homeQuoteResult[i].annualPremium;
					var carrierIdI=$rootScope.homeQuoteResult[i].carrierId;

					var maxI= (annualPremiumI / (sumInsuredI * insurerIndexI))*1000;

					if(Number(maxI) < max){
						max=maxI;
						carrierSelID=carrierIdI;

					}
				}
				if(max===maxSel){
					$scope.selCarrierId=carrierSelID;
					return true;
				}else{
					return false;
				}
			}
		}
		$scope.displayRibbon();
		

		$scope.singleClickHomeQuote = function(){
			
			setTimeout(function(){
			$scope.quoteHomeInputForm.$setPristine();
				$scope.errorRespCounter = true;
				$rootScope.loading = true;
				$scope.dataLoaded=false;
				
				$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
				$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
				$scope.quoteParam.structureSumInsured=Number($scope.quoteParam.structureSumInsured);
				$scope.quoteParam.contentSumInsured=Number($scope.quoteParam.contentSumInsured);
				
				
				$scope.quote.quoteParam = $scope.quoteParam;
				$scope.quote.personalDetails=$scope.personalDetails;
				$scope.quote.requestType = $scope.globalLabel.request.homeRequestType;
//						
				localStorageService.set("hometQuoteInputParamaters",$scope.quote);
				localStorageService.set("homePersonalDetails", $scope.personalDetails);
				$rootScope.homeQuoteResult = [];
				//added for reset
				$scope.quoteParamCopy=angular.copy($scope.quoteParam);
				$scope.personalDetailsCopy=angular.copy($scope.personalDetails);
				
				// Google Analytics Tracker added.
				//analyticsTrackerSendData($scope.quote);
				$scope.requestId = null;
				$rootScope.homeQuoteResult = [];
				RestAPI.invoke($scope.globalLabel.getRequest.quoteHome, $scope.quote).then(function(callback){
					$rootScope.homeQuoteRequest = [];
					if(callback.responseCode == $scope.globalLabel.responseCode.success){
						$rootScope.loading = false;
						$scope.dataLoaded=true;
						//$scope.slickLoaded=false;
						$scope.responseCodeList = [];

						$scope.requestId = callback.QUOTE_ID;

						localStorageService.set("HOME_UNIQUE_QUOTE_ID", $scope.requestId);
						$rootScope.homeQuoteRequest = callback.data;

						if(String($rootScope.homeQuoteResult) != "undefined" && $rootScope.homeQuoteResult.length > 0){
							$rootScope.homeQuoteResult.length = 0;
						}
						//for olark
						// olarkCustomParam(localStorageService.get("HOME_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),false);
						angular.forEach($rootScope.homeQuoteRequest, function(obj, i){
							var request = {};
							var header = {};
							
							header.messageId = messageIDVar;
							header.campaignID = campaignIDVar;
							header.source=sourceOrigin;
							header.transactionName = $scope.globalLabel.transactionName.homeQuoteResult;
							header.deviceId = deviceIdOrigin;
							request.header = header;
							request.body = obj;
							

							$http({
								method: 'POST',
								url: getQuoteCalcLink,
								data: request
							}).
							success(function(callback, status){
								var homeQuoteResponse = JSON.parse(callback);
								
								if(homeQuoteResponse.QUOTE_ID == $scope.requestId){
									$scope.responseCodeList.push(homeQuoteResponse.responseCode);
									if(homeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success){

										for(var i = 0; i < $rootScope.homeQuoteRequest.length; i++){
											if($rootScope.homeQuoteRequest[i].messageId == homeQuoteResponse.messageId){
												//paQuoteResponse.data.quotes[0].grossPremium = Math.round(paQuoteResponse.data.quotes[0].annualPremium / 365);
												homeQuoteResponse.data.quotes[0].insuranceCompany = (homeQuoteResponse.data.quotes[0].insuranceCompany);
												$rootScope.homeQuoteResult.push(homeQuoteResponse.data.quotes[0]);
												$rootScope.homeQuoteRequest[i].status = 1;
											}
										}
										$scope.processResult();
										
									}else{
										for(var i = 0; i < $rootScope.homeQuoteRequest.length; i++){
											if($rootScope.homeQuoteRequest[i].messageId == homeQuoteResponse.messageId){
												$rootScope.homeQuoteRequest[i].status = 2;
												//$rootScope.ciQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
												//comments updated based on Uday
												$rootScope.homeQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg);
											}
										}
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
								/*$rootScope.loading = false;*/

								if($scope.responseCodeList.length == $scope.homeQuoteRequest.length){
									/*$rootScope.loading = false;*/
									for(var i = 0; i < $rootScope.homeQuoteRequest.length; i++){
										if($rootScope.homeQuoteRequest[i].status == 0){
											$rootScope.homeQuoteRequest[i].status = 2;
											//$rootScope.ciQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
											$rootScope.homeQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg);
										}
									}
									//if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
									if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.success)){
										// This condition will satisfy only when at least one product is found in the quoteResponse array.
										//} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
									} else if(p365Includes($scope.responseCodeList,$scope.globalLabel.responseCode.quoteNotAvailable)){
										$scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
									}else{
										$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
									}
								}
						}, true);
					}else{
						$scope.responseCodeList = [];
						if(String($rootScope.homeQuoteResult) != "undefined" && $rootScope.homeQuoteResult.length > 0)
							$rootScope.homeQuoteResult.length = 0;

						$rootScope.homeQuoteResult = [];

						// Yogesh-27092017- Error message not configured from webservice if we didnt found any products. So setting static error message.
						$scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg));								
					}
				});
			// });
			$scope.displayRibbon();
		},100);
	};


	$scope.callSingleClickQuote = function(){
		if(!$rootScope.wordPressEnabled){
			$scope.singleClickHomeQuote();
		}
	}
	
	
	$scope.calculateQuoteOnSubmit=function(){
		$scope.callSingleClickQuote();
	}
		//}
//				else{
//					$scope.payoutOptionModal=false;	
//					$scope.riderDetailsModal=false;
//			}
	//},100);

		//function created to reset payout details for wordpress p365
//		$scope.resetPayoutDetails=function(){
//			if($scope.selectedPayoutOptionCopy){
//				$scope.payoutDetails.payoutOption=$scope.selectedPayoutOptionCopy;
//				for(var i=0; i < $scope.payoutOptions.length; i++)
//				{
//					if($scope.payoutDetails.payoutOption.id==$scope.payoutOptions[i].id)
//					{
//						$scope.payoutDetails.payoutOption=$scope.payoutOptions[i];
//						break;
//					}
//				}
//			}else{
//				$scope.payoutDetails.payoutOption=[];
//			}
//			$scope.payoutOptionModal=false;	
//		}
//		
		//function created to display carrier if premium > 0.
		$scope.validatePremium=function(data)
		{ 
			 
			 if(Number(data.grossPremium) > 0){
			 		return true;	
			 	}else{
			 		return false;
			 }
		};
		
		
		$scope.buyProduct = function(selectedProduct){
			$rootScope.title = $scope.globalLabel.policies365Title.confirmPopup;
			$scope.buyScreenTemplate(selectedProduct);
		};
		
		$scope.buyScreenTemplate = function(selectedProduct){
			
			localStorageService.set("homeSelectedProduct", selectedProduct);
			$scope.selectedProduct = selectedProduct;

			if($scope.requestId){
				
					localStorageService.set("HOME_UNIQUE_QUOTE_ID", $scope.requestId);					
				
			}


			if($scope.modalCompare){
				$scope.modalCompare = false;
			}

			var buyScreenParam = {};
			buyScreenParam.documentType = proposalScreenConfig;
			buyScreenParam.businessLineId = localStorageService.get("selectedBusinessLineId");
			buyScreenParam.carrierId = selectedProduct.carrierId;
			buyScreenParam.productId = selectedProduct.productId;
			buyScreenParam.QUOTE_ID = localStorageService.get("HOME_UNIQUE_QUOTE_ID");
			
			

			
					getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.productDataReader, buyScreenParam, function(buyScreen){
						if(buyScreen.responseCode == $scope.globalLabel.responseCode.success){
							localStorageService.set("buyScreen", buyScreen.data);
							$scope.productValidation = buyScreen.data.validation;
						//	buyScreenParam.documentType = "PersonalAccidentPlan";
							
											var docId = $scope.globalLabel.documentType.buyScreen + "-" + localStorageService.get("selectedBusinessLineId");
											getDocUsingId(RestAPI, docId, function(buyScreenTooltip){
												localStorageService.set("buyScreenTooltip", buyScreenTooltip.toolTips);
												if($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled){
													if(String($location.search().leaddetails) != $scope.globalLabel.errorMessage.undefinedError){
														var leaddetails = JSON.parse($location.search().leaddetails);
														localStorageService.set("quoteUserInfo", leaddetails);
													}
													
													
													$location.path('/home').search({quoteId:localStorageService.get("HOME_UNIQUE_QUOTE_ID"),carrierId:selectedProduct.carrierId,productId:selectedProduct.productId,lob:localStorageService.get("selectedBusinessLineId")});				
												}else{
													$location.path('/home');
												}
											});
										/*}else{
											$rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
										}
									});*/
								/*});*/
							//});
						}else{
							$rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
						}
					});
					
		
		};
		



		$scope.state = false;
		$scope.toggleState = function(){
			$scope.state = !$scope.state;
		};

		
	});

	

	$rootScope.signout = function(){
		$rootScope.userLoginStatus = false;
		var userLoginInfo = {};
		userLoginInfo.username = "";
		userLoginInfo.status = $rootScope.userLoginStatus;
		localStorageService.set("userLoginInfo", userLoginInfo);
		$location.path("/quote");
	}

	$scope.missionCompled = function(){
		$rootScope.loading = false;
	};

	$scope.data = {};
	$scope.data.group1 = 1;
	$scope.modalCompare = false;
	$scope.consolatedRiderList = [];
	$scope.consolatedDiscountList = [];
	$scope.toggleCompare = function(){	
		var riderJson = {};	
		angular.forEach($scope.selectedCarrier, function (quote) {
			angular.forEach(quote.riders,function(rider){
				if(riderJson[rider.riderId] == null)
				{ 	
					$scope.consolatedRiderList.push(rider);
					riderJson[rider.riderId] = rider.riderName;					
				}
			})
		});
		var discountJson = {};
		angular.forEach($scope.selectedCarrier, function (quote) {
			angular.forEach(quote.discountList,function(discount){
				if(discountJson[discount.type] == null && discount.discountAmount != null && discount.discountAmount != 0 )
				{ 
					$scope.consolatedDiscountList.push(discount);
					discountJson[discount.type] = discount.type; 
				}
			})
		});
		$scope.modalCompare = true;
		$scope.hideModal= function(){
			$scope.modalCompare = false;
		}
	}
	// Card View/Compare Policy view implemented for life quote result - modification-0007
	$scope.cardView=true;
	$scope.compareView=false;
	$scope.showCompareBtn=true;
	$scope.showCardBtn=true;
	$scope.disableSort=false;
	//newFunction for compare
	$scope.compareViewClick = function(){	
		var riderJson = {};	
		$scope.consolatedRiderList = [];
		$scope.consolatedDiscountList = [];
		angular.forEach($rootScope.homeQuoteResult, function (quote) {
			angular.forEach(quote.riders,function(rider){
				if(riderJson[rider.riderId] == null)
				{ 	
					$scope.consolatedRiderList.push(rider);
					riderJson[rider.riderId] = rider.riderName;
				}
			});
		});
		var discountJson = {};
		angular.forEach($rootScope.homeQuoteResult, function (quote) {
			angular.forEach(quote.discountList,function(discount){
				//if(discountJson[discount.type] == null && discount.discountAmount != null && !discount.discountAmount === 0)
				if(discountJson[discount.type] == null && discount.discountAmount != null)
				{ 
					$scope.consolatedDiscountList.push(discount);
					discountJson[discount.type] = discount.type; 
				}
			});
		});
		$scope.disableSort=false;
		$scope.dataLoaded=true;
		$scope.slickLoaded=true;
		$scope.cardView=true;
		$scope.compareView=false;
		$scope.showCompareBtn=true;
		$scope.showCardBtn=true;
		//$scope.modalCompare = true;
		//$scope.hideModal= function(){
		//$scope.modalCompare = false;
		//};
	};
	$scope.cardViewClick=function(){
		$scope.dataLoaded=true;
		$scope.slickLoaded=true;
		$scope.cardView=false;
		$scope.compareView=true;
		$scope.showCompareBtn=true;
		$scope.showCardBtn=true;
		$scope.disableSort=true;

	};
	//added for default selection of monthly premium
	$scope.premiumChoice=true;
	

	
//	$scope.findRider = function(riderId,riders){
//		var returnvalue = "Not Available";
//		if(riders==undefined)
//		{
//			returnvalue= "-";
//			return  returnvalue;
//		}	
//		for(var count=0; count < riders.length; count++)
//		{
//			if(riderId == riders[count].riderId && riders[count].riderPremiumAmount != 0 && riders[count].riderPremiumAmount != null)
//			{
//				returnvalue = riders[count].riderPremiumAmount;
//				break;
//			}
//			else if(riderId == riders[count].riderId &&  riders[count].riderType=="Included" && riders[count].riderPremiumAmount == 0 || riders[count].riderPremiumAmount == undefined )
//			{
//				returnvalue = riders[count].riderType;
//				break;
//			} 
//			else if(riderId == riders[count].riderId &&  riders[count].riderType=="Not Available" && riders[count].riderPremiumAmount == 0)
//			{
//				returnvalue ="0";
//				break;
//			} 		
//		}
//		if(returnvalue == "-1")
//			returnvalue = "-";
//		return returnvalue;
//	};

//	$scope.findDiscount = function(type,discounts){
//		var returnvalue = "NA";
//		for(var count=0; count < discounts.length; count++)
//		{
//			if(type == discounts[count].type && discounts[count].discountAmount != 0 && discounts[count].discountAmount != null)
//			{
//				returnvalue = discounts[count].discountAmount;
//				break;
//			}
//		}
//		return returnvalue;
//	}

	//below piece of code written for showing and hiding rider and payout menu as pop-up. 
//	$scope.showRiderModal= function(){
//		$scope.riderDetailsModal=!$scope.riderDetailsModal;	
//	}

	$scope.showPayoutOptionModal= function(){
		$scope.payoutOptionModal=!$scope.payoutOptionModal;	
	}
	$scope.hidePayoutOptionModal= function(){
		$scope.resetPayoutDetails();
		$scope.payoutOptionModal=false;	
	}
	$scope.showShareEmailModal=function(){
		$scope.shareEmailModal=true;
		
	}
	
	$scope.hideRiderDetailsModal= function(){
		$scope.resetRiderDetails();
		$scope.riderDetailsModal=false;
	}
	// Hide the footer navigation links.
	$(".activateFooter").hide();
	$(".activateHeader").hide();

//	// Function created to get Product Features and update Quote Result Object on Quote Calculation - modification-0008
//	function getAllProductFeatures(selectedProduct, productFetchStatus)
//	{
//		var variableReplaceArray = [];
//		var productFeatureJSON = {};
//		var customFeaturesJSON = {};
//
//		$rootScope.consolidatedBenefitsList = [];
//		$rootScope.consolidatedSavingsList = [];
//		$rootScope.consolidatedFlexibilityList = [];
//
//		productFeatureJSON.documentType = $scope.globalLabel.documentType.personalAccidentProduct;
//		productFeatureJSON.carrierId = selectedProduct.carrierId;
//		productFeatureJSON.productId = selectedProduct.productId;
//		productFeatureJSON.businessLineId = 1;
//
//		var selectedCarrierId = selectedProduct.carrierId;
//		var selectedProductId = selectedProduct.productId;
//
//		for(var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++){
//			if(selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
//				$scope.brochureUrl = wp_path+$rootScope.carrierDetails.brochureList[i].brochureUrl;
//		}
//
//		variableReplaceArray.push({
//			'id': '{{structureSumInsured}}',
//			'value': Math.round(selectedProduct.structureSumInsured)
//		});
//		variableReplaceArray.push({
//			'id': '{{monthlyPayout}}',
//			'value': selectedProduct.monthlyPayout
//		});
//		variableReplaceArray.push({
//			'id': '{{policyTerm}}',
//			'value': selectedProduct.policyTerm
//		});
//
//		if(productFetchStatus){
//			RestAPI.invoke($scope.globalLabel.transactionName.getProductFeatures, productFeatureJSON).then(function(callback){
//				var scopeVariableName = 'productFeaturesList_' + selectedCarrierId + '_' + selectedProductId;
//				var productFeatureJSONName = 'productFeaturesJSON_' + selectedCarrierId + '_' + selectedProductId;
//
//				$rootScope[productFeatureJSONName] = {};
//				$scope[scopeVariableName] = callback.data[0].Features;
//				for(var i = 0; i < variableReplaceArray.length; i++){
//					if(p365Includes($scope[scopeVariableName][1].details,variableReplaceArray[i].id)){
//						$scope[scopeVariableName][1].details = $scope[scopeVariableName][1].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
//					}
//				}
//				for(var i = 0; i< $scope[scopeVariableName].length; i++)
//				{
//					$rootScope[productFeatureJSONName][callback.data[0].Features[i].titleForCompareView] = callback.data[0].Features[i].detailsForCompareView;
//				}
//				selectedProduct.features = $rootScope[productFeatureJSONName];
//
//				for(var i=0;i< $scope[scopeVariableName].length; i++)
//				{
//					if($scope[scopeVariableName][i].featureCategory == "Benefits" && $scope[scopeVariableName][i].compareView == "Y")
//					{
//						if($rootScope.consolidatedBenefitsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
//						{
//							$rootScope.consolidatedBenefitsList.push($scope[scopeVariableName][i].titleForCompareView);
//						}
//					}
//					if($scope[scopeVariableName][i].featureCategory == "Savings" && $scope[scopeVariableName][i].compareView == "Y")
//					{
//						if($rootScope.consolidatedSavingsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
//						{
//							$rootScope.consolidatedSavingsList.push($scope[scopeVariableName][i].titleForCompareView);
//						}
//					}
//					if($scope[scopeVariableName][i].featureCategory == "Flexibility" && $scope[scopeVariableName][i].compareView == "Y")
//					{
//						if($rootScope.consolidatedFlexibilityList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1)
//						{
//							$rootScope.consolidatedFlexibilityList.push($scope[scopeVariableName][i].titleForCompareView);
//						}
//					}
//				}
//			});
//		}
//	}
}]);

