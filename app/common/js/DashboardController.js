/*Dashboard Controller*/
'use strict';
angular.module('dashboard', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
	.controller('dashboardController', ['$scope', '$window', '$rootScope', '$location', '$http', 'RestAPI', 'localStorageService', function ($scope, $window, $rootScope, $location, $http, RestAPI, localStorageService) {

		// Setting application labels to avoid static assignment
		
		$scope.p365Labels=profileLabels;
		$rootScope.title = $scope.p365Labels.policies365Title.dashboard;

		$rootScope.wp_path = wp_path;
		
		$scope.userPoliciesSection = wp_path + "common/html/UserPoliciesSection.html";
		$scope.myProfileSection = wp_path + 'common/html/MyProfileSection.html';
		$scope.riskAndInsuranceProfileSection = wp_path + 'common/html/RiskAndInsuranceProfileSection.html';
		$scope.insuranceAssessmentHTML = wp_path + 'buy/common/html/insuranceAssessment.html';
		$scope.myQuoteSection = wp_path + 'common/html/myQuoteSection.html';
		$scope.myProposalSection = wp_path + 'common/html/myProposalSection.html';

		console.log('inside dashboard controller');
		if (localStorageService.get("userLoginInfo")) {
			$('.logout_link').closest('li').attr('style', 'display:inline-block !important');
			$scope.userLoginInfo = localStorageService.get("userLoginInfo");
			if ($scope.userLoginInfo.username) {
				$('.signin_link').text($scope.userLoginInfo.username+" Account ");
				localStorage.setItem("loggedIn", "true");
			}
		}

		$scope.modalSucess = false;
		$scope.carrierLogoList = {};
		$scope.carReponseToken = {};
		$scope.userProfileDetails = {};
		$scope.userProfileInfo = {};
		$scope.userLoginInfo = {};
		$scope.profession = {};

		$scope.currentPage = 1;
		$scope.pageSize = 5;
		$scope.sort = function (keyname) {
			$scope.sortBy = keyname;   //set the sortBy to the param passed
			$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		}
		
		
		$scope.minimumFlag = true;
        $scope.toggleMinimum = function () {
            $scope.minimumFlag = !$scope.minimumFlag;
        }
        $scope.recommendedFlag = true;
        $scope.toggleRecommended = function () {
            $scope.recommendedFlag = !$scope.recommendedFlag;
        }
        $scope.comprehensiveFlag = true;
        $scope.toggleComprehensive = function () {
            $scope.comprehensiveFlag = !$scope.comprehensiveFlag;
        }


	$scope.makeInsuranceAssessmentBlocksReady = function (_insuranceAssessmentResponse) {
		if (_insuranceAssessmentResponse != null && _insuranceAssessmentResponse != undefined && _insuranceAssessmentResponse != "") {

			for (let index = 0; index < _insuranceAssessmentResponse.length; index++) {
				if (_insuranceAssessmentResponse[index].insuranceLabel == "Health") {
					_insuranceAssessmentResponse[index].displayOrder = 1;
				} else if (_insuranceAssessmentResponse[index].insuranceLabel == "Life") {
					_insuranceAssessmentResponse[index].displayOrder = 2;
				} else if (_insuranceAssessmentResponse[index].insuranceLabel == "Car") {
					_insuranceAssessmentResponse[index].displayOrder = 3;
				} else if (_insuranceAssessmentResponse[index].insuranceLabel == "Bike") {
					_insuranceAssessmentResponse[index].displayOrder = 4;
				} else if (_insuranceAssessmentResponse[index].insuranceLabel == "Retirement") {
					_insuranceAssessmentResponse[index].displayOrder = 5;
				} else if (_insuranceAssessmentResponse[index].insuranceLabel == "Critical Illness") {
					_insuranceAssessmentResponse[index].displayOrder = 6;
				} else {
					_insuranceAssessmentResponse[index].displayOrder = 7;
				}
				if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "veryLow") {
					_insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Very Low";
				} else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "veryHigh") {
					_insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Very High";
				} else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "medium") {
					_insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Medium";
				} else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "high") {
					_insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "High";
				} else if (_insuranceAssessmentResponse[index].insCatAsPerRisk == "low") {
					_insuranceAssessmentResponse[index].insCatAsPerRiskDisplayLabel = "Low";
				}
			}
			$scope.insuranceAssessmentRes = _insuranceAssessmentResponse;
		} else if (_insuranceAssessmentResponse == null) {
			console.log("Unable to make insurance assessment chart ready caused by _insuranceAssessmentResponse is null");
		} else if (_insuranceAssessmentResponse == "") {
			console.log("Unable to make insurance assessment chart ready caused by _insuranceAssessmentResponse is empty");
		} else if (_insuranceAssessmentResponse == undefined) {
			console.log("Unable to make insurance assessment chart ready caused by _insuranceAssessmentResponse is undefined");
		}
	};

	$scope.plotChart = function (_chartType, _chartTitle, _xAxisTitles, _yAxisTitle, _data) {
		if (_chartType.toLowerCase() == 'bar') {
			$scope.chartTitle = _chartTitle;
			$scope.xaxis = _xAxisTitles;
			$scope.yAxisTitle = _yAxisTitle;
			$scope.chartType = _chartType;
			$scope.items = _data;
			$scope.isChartReady = true;
		} else if (_chartType.toLowerCase() == 'pie') {
			$scope.chartTitle = _chartTitle;
			$scope.dataItems = _data;
			$scope.isChartReady = true;
		}
	};

	$scope.makeRiskProfileChartReady = function (_riskProfileResponse) {
		if (_riskProfileResponse != null && _riskProfileResponse != undefined && _riskProfileResponse != "") {
			var _length_one = _riskProfileResponse.length;
			var legends = new Array(_length_one);
			var _series = new Array(_length_one);
			var _collectedData = [];
			for (let index = 0; index < _length_one; index++) {
				const element = _riskProfileResponse[index];
				legends[index] = element.name;
				var _length_tow = element.applicableRisk.length;
				var _xAxisTitles = new Array(_length_tow);
				var _data = new Array(_length_tow);
				for (let j = 0; j < _length_tow; j++) {
					const element_two = element.applicableRisk[j];
					var _dataElement = {};
					_xAxisTitles[j] = element_two.riskLabel;
					_dataElement.name = element_two.riskLabel;
					_dataElement.y = element_two.riskValue;
					if (element_two.riskCat == "veryLow") {
						_dataElement.riskPriority = "Very Low";
					} else if (element_two.riskCat == "veryHigh") {
						_dataElement.riskPriority = "Very High";
					} else if (element_two.riskCat == "high") {
						_dataElement.riskPriority = "High";
					} else if (element_two.riskCat == "low") {
						_dataElement.riskPriority = "Low";
					} else if (element_two.riskCat == "medium") {
						_dataElement.riskPriority = "Medium";
					}

					_collectedData.push(_dataElement);
				}
			}
			_series = _collectedData;
			$scope.risk_xAxisTitles = _xAxisTitles;
			$scope.risk_series = _series;
			$scope.risk_legends = legends;
			$scope.plotChart("pie", "", _xAxisTitles, "", _series);
		} else if (_riskProfileResponse == null) {
			console.error("Unable to make risk profile chart ready caused by _riskProfileResponse is null");
		} else if (_riskProfileResponse == "") {
			console.error("Unable to make risk profile chart ready caused by _riskProfileResponse is empty");
		} else if (_riskProfileResponse == undefined) {
			console.error("Unable to make risk profile chart ready caused by _riskProfileResponse is undefined");
		}
	};

	$scope.createRiskProfile = function(){
		$location.path("/professionalJourney");
	}
	
	var readQuote = true;
	$scope.readProfessionalQuoteID = function (PROF_QUOTE_ID) {
		if(!PROF_QUOTE_ID){
			$scope.profQuoteIdAvailable = false;
			readQuote = true;
		}else if (PROF_QUOTE_ID && readQuote) {
			$scope.profQuoteIdAvailable = true;
			var _request = {};
			_request.docId = PROF_QUOTE_ID;
			_request.lob = 0;
			RestAPI.invoke("quoteDataReader", _request).then(function (_professionalQuoteCallback) {
				if (_professionalQuoteCallback.responseCode == 1000) {
					var _professionalQuoteData = _professionalQuoteCallback.data;
					if (_professionalQuoteData) {
						if (_professionalQuoteData.riskDetails && _professionalQuoteData.riskDetails.algResponse) {
							var riskProfile = _professionalQuoteData.riskDetails.algResponse.riskAnalysis;
							var insuranceAssessment = _professionalQuoteData.riskDetails.algResponse.insuranceAnalysis;
							var recommendedRiders = _professionalQuoteData.riskDetails.algResponse.productAnalysis;
							$scope.makeInsuranceAssessmentBlocksReady(insuranceAssessment);
							$scope.makeRiskProfileChartReady(riskProfile);
							readQuote = false;

						}
						// if professional details are present W
						if(_professionalQuoteData.profession)
							$scope.profession.professionName = _professionalQuoteData.profession;
						// $scope.myQuotes = _professionalQuoteData.lobQuoteId;
					}
				}
			});
		}
	};
	
	$scope.viewQuotes = function(quote){
		if(quote.QUOTE_ID && quote.businessLineId){
			$window.location = shareQuoteLink + quote.QUOTE_ID + "&LOB=" + quote.businessLineId;
				
			// $location.path("/sharefromAPI").search({ docId: quote.QUOTE_ID, LOB: quote.businessLineId });
		}else{
			$rootScope.P365Alert("Policies365", "We are not able fetch quotes for you right now, due to technical reasons. Please try after some time or contact our insurance expert.", "Ok");
		}
	};
$scope.viewProposal = function (proposal) {
			if (proposal.proposalId && proposal.businessLineId) {

				$window.location = sharePaymentLink + proposal.proposalId + "&LOB=" + proposal.businessLineId;
				// $location.path("/sharefromAPI").search({ docId: quote.QUOTE_ID, LOB: quote.businessLineId });
			} else {
				$rootScope.P365Alert("Policies365", "We are not able fetch proposal for you right now, due to technical reasons. Please try after some time or contact our insurance expert.", "Ok");
			}
		};
	

		$scope.carrierLogoList = localStorageService.get("carrierLogoList");
		$scope.carReponseToken = localStorageService.get("carReponseToken");
		$scope.userProfileDetails = localStorageService.get("userProfileDetails");
		console.log("$scope.userProfileDetails",$scope.userProfileDetails)
		if($scope.userProfileDetails.profileDetails)
			$scope.profileDetails = $scope.userProfileDetails.prospectDetails; 

		if($scope.userProfileDetails && $scope.userProfileDetails.prospectDetails){
			
			if($scope.userProfileDetails.prospectDetails.personalDetails){
				$scope.commonInfo = $scope.userProfileDetails.prospectDetails.personalDetails.commonInfo;
				$scope.profession = $scope.userProfileDetails.prospectDetails.personalDetails.profession;
			}
						
	$scope.showMyQuotes = function(quotes){		
	
		// console.log("sdd",quotes);
		angular.forEach(quotes, function(quote) {
		if($scope.userProfileDetails.prospectDetails){
			if(quote.businessLineId==1 && quote.Life!="" && $scope.userProfileDetails.prospectDetails.personalDetails)
				quote.showQuoteId = true;
			else if(quote.businessLineId==2 && quote.Bike!="" && $scope.userProfileDetails.prospectDetails.vehicleDetails){
				if( $scope.userProfileDetails.prospectDetails.vehicleDetails.bikeInfo)
				quote.showQuoteId = true;			
			}else if (quote.businessLineId==3 && quote.Car!="" && $scope.userProfileDetails.prospectDetails.vehicleDetails){
				if( $scope.userProfileDetails.prospectDetails.vehicleDetails.carInfo)
				quote.showQuoteId = true;
			}else if(quote.businessLineId==4 && quote.Health!="" && $scope.userProfileDetails.prospectDetails.familyDetails)
				quote.showQuoteId = true;
			else if(quote.businessLineId==5 && false)
				quote.showQuoteId = true;

			else
				quote.showQuoteId = false
		}
	
		});
$scope.myQuotes = angular.copy(quotes);

}
$scope.showMyQuotes($scope.userProfileDetails.prospectDetails.lobQuoteId);

$scope.showMyProposals = function (proposals) {
	angular.forEach(proposals, function (proposal) {
		if ($scope.userProfileDetails.prospectDetails) {
			if (proposal.businessLineId == 1 && proposal.proposalId != "" &&  $scope.userProfileDetails.prospectDetails.personalDetails)
				proposal.showProposalId = true;
			else if (proposal.businessLineId == 2 && proposal.proposalId != "" && $scope.userProfileDetails.prospectDetails.vehicleDetails){
				if( $scope.userProfileDetails.prospectDetails.vehicleDetails.bikeInfo)
				proposal.showProposalId = true;
			}else if (proposal.businessLineId == 3 && proposal.proposalId != "" &&  $scope.userProfileDetails.prospectDetails.vehicleDetails){
				if( $scope.userProfileDetails.prospectDetails.vehicleDetails.carInfo)
				proposal.showProposalId = true;
			}else if (proposal.businessLineId == 4 && proposal.proposalId != "" && $scope.userProfileDetails.prospectDetails.familyDetails)
				proposal.showProposalId = true;
			else if (proposal.businessLineId == 5 && proposal.proposalId != "" && false)
				proposal.showProposalId = true;
			else
				proposal.showProposalId = false
		}
	});
	$scope.myProposal = angular.copy(proposals);

}
$scope.showMyProposals($scope.userProfileDetails.prospectDetails.lobProposalId);

			$scope.PROF_QUOTE_ID = $scope.userProfileDetails.prospectDetails.profQuoteId;
			$scope.readProfessionalQuoteID($scope.PROF_QUOTE_ID);
			if($scope.userProfileDetails.prospectDetails.addressDetails){
				$scope.addressDetails = $scope.userProfileDetails.prospectDetails.addressDetails.address;
			}
			if($scope.userProfileDetails.prospectDetails.familyDetails){
				$scope.familyComp = $scope.userProfileDetails.prospectDetails.familyDetails.familyComp;
			}
			if($scope.userProfileDetails.prospectDetails.vehicleDetails){
				$scope.vehicleDetails = $scope.userProfileDetails.prospectDetails.vehicleDetails;
				if($scope.vehicleDetails.carInfo){
					if($scope.vehicleDetails.carInfo.registrationNumber){
						$rootScope.showCarRegAreaStatus = false;
					}else{
						$rootScope.showCarRegAreaStatus = true;
					}
				}
				if($scope.vehicleDetails.bikeInfo){
					if($scope.vehicleDetails.bikeInfo.registrationNumber){
						$rootScope.showBikeRegAreaStatus = false;
					}else{
						$rootScope.showBikeRegAreaStatus = true;
					}
				}
			}
		}
		$scope.userLoginInfo = localStorageService.get("userLoginInfo");

		console.log(localStorageService.get("userLoginInfo"))
		$scope.userProfileDetailsCopy = angular.copy($scope.userProfileDetails);

		$scope.genderType = genderTypeGeneric;

		$scope.myProfileStatus = false;
		$scope.myPolicyStatus = true;
		$scope.modalPolicySummary = false;


		$scope.todayDate = new Date();

		$scope.businessLineLogo = {
			"1": wp_path + "img/instantIcon/life_grey.png", "2": wp_path + "img/instantIcon/bike_grey.png",
			"3": wp_path + "img/instantIcon/carIcon1.png", "4": wp_path + "img/instantIcon/health_grey.png", "5": wp_path + "img/instantIcon/travel_grey.png"
		};

		$scope.tabs = [{ title: 'My Policies', id: 1, url: 'myPolicies.tpl.html', className: 'tabs policyTab' },
		{ title: 'My Profile', id: 2, url: 'myProfile.tpl.html', className: 'tabs profileTab' }];

		$scope.initDashboard = function () {
			var dateOption = {};
			dateOption.minimumYearLimit = "-100Y";
			dateOption.maximumYearLimit = "-18Y";
			dateOption.changeMonth = true;
			dateOption.changeYear = true;
			dateOption.dateFormat = "dd/mm/yy";
			$scope.userDateOfBirthOptions = setP365DatePickerProperties(dateOption);
		}
		$scope.initDashboard();
		$scope.currentTab = 'myPolicies.tpl.html';
		$scope.onClickTab = function (tab) {
			$scope.currentTab = tab.url;
		}
		$scope.isActiveTab = function (tabUrl) {
			return tabUrl == $scope.currentTab;
		};


		if ($scope.userLoginInfo.status == false) {
			$rootScope.userLoginStatus = false;
			$location.path("/quote");
		} else {
			$rootScope.userLoginStatus = true;
			if($scope.userProfileDetails.profileDetails){
				$scope.userPolices = $scope.userProfileDetails.profileDetails.proposalDetails;
				}
			$rootScope.username = $scope.userLoginInfo.username != undefined ? ($scope.userLoginInfo.username) : $scope.userLoginInfo.mobileNumber;
		}

		$scope.hideModal = function () {
			$scope.modalSucess = false;
		}
		$scope.submitBtn = false;
		$scope.editBtn = true;
		$scope.toggleChange = function (toggleAction) {
			$('.firstPane').addClass('opened');
			$('.firstPaneContent').show();
			if ($('.viewDiv').is(':visible') == true) {
				$(".modifyDiv").slideDown();
				$(".viewDiv").slideUp();
				$scope.editBtn = false;
				$scope.submitBtn = true;
				$scope.cancelBtn = true;
			} else if ($('.modifyDiv').is(':visible') == true) {
				if (toggleAction == "submit") {
					$(".viewDiv").slideDown();
					$(".modifyDiv").slideUp();
					$scope.editBtn = true;
					$scope.cancelBtn = false;
					$scope.submitBtn = false;
					var userProfile = {};
					userProfile.firstName = $scope.userProfileDetails.firstName;
					userProfile.lastName = $scope.userProfileDetails.lastName;
					userProfile.gender = $scope.userProfileDetails.gender;
					userProfile.dateOfBirth = $scope.userProfileDetails.dateOfBirth;
					userProfile.emailId = $scope.userProfileDetails.emailId;
					userProfile.mobile = $scope.userProfileDetails.mobile;
					getDocUsingParam(RestAPI, 'profileDetails', userProfile, function (responseProfile) {
						if (responseProfile.responseCode == $scope.p365Labels.responseCode.success) {
							$scope.userProfileDetails = responseProfile.data;
							localStorageService.set("userProfileDetails", $scope.userProfileDetails);
							$scope.modalSucess = true;
							$scope.profileStatus = "Profile updated successfully";
						} else {
							$scope.modalSucess = true;
							$scope.profileStatus = "Technical Issue, please try again later";
						}
					});

				} else {
					$(".viewDiv").slideDown();
					$(".modifyDiv").slideUp();
					$scope.editBtn = true;
					$scope.cancelBtn = false;
					$scope.submitBtn = false;
					$scope.userProfileDetails = $scope.userProfileDetailsCopy;
				}
			}
		}

		$scope.purchaseStatement = function () {
			//below lines of code will display age and policy type in policy purchase statement for health
			if ($scope.selectedPolicyDetails.businessLineId == 4) {
				$scope.selectedPolicyDetails.policyDetails.policyProductType = "Health";
				for (var i = 0; i < $scope.selectedPolicyDetails.insuredDetails.insuredMembers.length; i++) {
					if ($scope.selectedPolicyDetails.insuredDetails.insuredMembers[i].dateOfBirth) {
						$scope.selectedPolicyDetails.insuredDetails.insuredMembers[i].age = calculateAgeByDOB(String($scope.selectedPolicyDetails.insuredDetails.insuredMembers[i].dateOfBirth));
					}
				}
			}
			localStorageService.set("policyDocDetails", $scope.selectedPolicyDetails);
			if ($scope.selectedPolicyDetails.businessLineId == 1) {
				// For Life Policy
			} else if ($scope.selectedPolicyDetails.businessLineId == 2) {
				$location.path("/bikepolicypurchase");
			} else if ($scope.selectedPolicyDetails.businessLineId == 3) {
				$location.path("/carpolicypurchase");
			} else if ($scope.selectedPolicyDetails.businessLineId == 5) {
				$location.path("/travelpolicypurchase");
			} else {
				$location.path("/medicalPurchasing");
			}
		}


		$scope.viewPolicySummary = function (selectedPolicy) {
			delete selectedPolicy.$$hashKey;
			$scope.modalPolicySummary = true;

			$scope.policySecretKey = selectedPolicy.secretKey;
			$scope.policyDocData = {};
			$scope.policyDocData.uKey = $scope.userProfileDetails.profileDetails.secretKey;
			$scope.policyDocData.pKey = selectedPolicy.secretKey;
			getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.getPurchaseStatement, $scope.policyDocData, function (policyDoc) {
				if (policyDoc.responseCode == $scope.p365Labels.responseCode.success) {
					$scope.selectedPolicyDetails = policyDoc.data;
					if ($scope.selectedPolicyDetails && $scope.selectedPolicyDetails.businessLineId) {
						$scope.purchaseStatement();
					}else{
						$rootScope.P365Alert("Policies365", "Your Policy is not  yet available.please,try after 30 minutes", "Ok");
					}
				} else {
					$rootScope.P365Alert("Policies365", "Your Policy is not  yet available.please,try after 30 minutes", "Ok");
				}
			});
		}

		$scope.viewPolicyDocument = function (selectedPolicy) {
			delete selectedPolicy.$$hashKey;
			$scope.modalPolicySummary = true;

			$scope.policySecretKey = selectedPolicy.secretKey;
			$scope.policyDocData = {};
			$scope.policyDocData.uKey = $scope.userProfileDetails.profileDetails.secretKey;
			$scope.policyDocData.pKey = selectedPolicy.secretKey;
			RestAPI.invoke("policyDocDownloadService", $scope.policyDocData).then(function (policyDoc) {
				$scope.policyDocumentResp = policyDoc;
				if ($scope.policyDocumentResp.responseCode == 1000) {
					if ($scope.policyDocumentResp.performDocumentAction == "DownloadDocument") {
						var pdfName = $scope.policyDocumentResp.data.policyNo + ".pdf";
						kendo.saveAs({
							dataURI: $scope.policyDocumentResp.data.policyDocData,
							fileName: pdfName
						});
					} else {
						$window.open($scope.policyDocumentResp.data.policyDocData, "_blank");
					}
				} else {
					$rootScope.P365Alert("Policies365", "Your Policy is not  yet available.please,try after 30 minutes", "Ok");
				}
			});

		}



		$scope.generateHealthCard = function () {

		}

		$scope.openMenu = function ($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
			setTimeout(function () {
				$('.md-click-catcher').click(function () {
					$scope.activeMenu = '';
				});
			}, 100);
		};

		$rootScope.signout = function () {
			$rootScope.userLoginStatus = false;
			var userLoginInfo = {};
			userLoginInfo.username = undefined;
			userLoginInfo.status = $rootScope.userLoginStatus;
			localStorageService.set("userLoginInfo", userLoginInfo);
			$location.path("/quote");
		}

		$rootScope.showLoginForm = function () {
			$rootScope.userLoginStatus = false;
		}
		
		// show the renew policy  modal
		$scope.showRenewPolicyModal = function(policyData){	
			// if policy data is not null
			if(policyData){
				
				// $scope.renewPolicyModal  = true; // commented for till proposal Id  exange service gets ready 
				$scope.userPolicyData = policyData;
				console.log($scope.userPolicyData.renewPolicyDetails.QUOTE_ID )
				
				localStorageService.set("renewPolicyDetails",policyData.renewPolicyDetails);
				$window.location = shareQuoteLink + $scope.userPolicyData.renewPolicyDetails.QUOTE_ID + "&LOB=" + policyData.businessLineId;	
				
				// $scope.gotoResultScreen();
			}
		}
		var urlPattern = $location.path();
		var redirectURL = $location.$$absUrl;
		var proposalId = $location.search().proposalId;
		redirectURL = redirectURL.split("\?")[0];


		// show the renew policy  modal		
		$scope.hideRenewPolicyModal = function(){
			$scope.renewPolicyModal  = false;
		}

		// redirect to result screen
		$scope.gotoResultScreen = function(){
			$scope.renewPolicyModal  = false;			
			// $location.path("/sharefromAPI").search({ docId: $scope.userPolicyData.renewPolicyDetails.QUOTE_ID, LOB: $scope.userPolicyData.businessLineId });
				// $window.location = shareQuoteLink + $scope.userPolicyData.renewPolicyDetails.QUOTE_ID + "&LOB=" + businessLineId;	
		}
		//redirect to proposal screen 
		$scope.gotoProposalScreen = function(){	
			$scope.renewPolicyModal  = false;				
			$location.path("/proposalresdata").search({ proposalId: $scope.userPolicyData.renewPolicyDetails.proposalId, LOB: $scope.userPolicyData.businessLineId });
		}

	}]);