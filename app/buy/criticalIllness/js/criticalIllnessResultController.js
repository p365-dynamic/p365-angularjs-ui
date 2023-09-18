'use strict';
angular.module('criticalIllnessResult', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages', 'checklist-model'])
    .controller('criticalIllnessResultController', ['$scope', '$rootScope', '$filter', '$location', '$http', '$window', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$sce', function($scope, $rootScope, $filter, $location, $http, $window, RestAPI, localStorageService, $timeout, $interval, $sce) {

        // Setting application labels to avoid static assignment.	-	modification-0003
        var applicationLabels = localStorageService.get("applicationLabels");
        $scope.globalLabel = applicationLabels.globalLabels;
        $rootScope.loaderContent = { businessLine: '6', header: 'CI Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.criticalIllness.proverbResult) };
        $rootScope.title = $scope.globalLabel.policies365Title.criticalIllnessResultQuote;
        if (localStorageService.get("premiumFrequencyList")) { // get the premium frequency list 
            $scope.PremiumFrequencyList = localStorageService.get("premiumFrequencyList");
        }
        $scope.quote = {};
        //$scope.payoutDetails = {};
        $scope.quoteUserInfo = {};
        //$scope.morePlans = [];

        //for wordpress
        if ($rootScope.wordPressEnabled) {
            $scope.rippleColor = '';
        } else {
            $scope.rippleColor = '#f8a201';
		}

		$scope.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED");
        if (localStorageService.get("PROF_QUOTE_ID_ENCRYPTED")) {
            $scope.UNIQUE_PROF_QUOTE_ID_ENCRYPTED = localStorageService.get("PROF_QUOTE_ID_ENCRYPTED");
        }

        //for agencyPortal
        $scope.modalView = false;
        if ($rootScope.agencyPortalEnabled) {
            //checking for lead
            var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
            if (!quoteUserInfoCookie) {
                $scope.modalView = true;
            }
        }
        //for wordpress
        $scope.criticalIllnessInputSectionHTML = wp_path + 'buy/criticalIllness/html/CriticalIllnessInputSection.html';
        // $scope.criticalIllnessRiderSectionHTML = wp_path+'buy/criticalIllness/html/LifeRiderSection.html';
        //$scope.criticalIllnessPayoutSectionHTML = wp_path+'buy/criticalIllness/html/CriticalIllnessPayoutSection.html';
        $scope.criticalIllnessShareEmailSectionHTML = wp_path + 'buy/criticalIllness/html/CriticalIllnessShareEmailSection.html';
        $scope.criticalIllnessPremiumTemplate = wp_path + 'buy/common/html/criticalIllnessPremiumTemplate.html';

        //for olark
        olarkCustomParam(localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), false);
        //$scope.carrierLogoList = localStorageService.get("carrierLogoList");
        if (localStorageService.get("userLoginInfo")) {
            $rootScope.userLoginStatus = localStorageService.get("userLoginInfo").status;
            $rootScope.username = localStorageService.get("userLoginInfo").username;
        }
        $rootScope.loading = true;
        $rootScope.isBackButtonPressed = false;
        $rootScope.disableLandingLeadBtn = false;
        $scope.isMonthlyPremium = false;
        $scope.isAnnualPremium = true;
        $scope.isQuarterlyPremium = false;
        $scope.isHalfAnnualPremium = false;
        $scope.premiumChoice = true;
        //$scope.payoutOptionModal=false;	
        // $scope.riderDetailsModal=false;

        //added to collapse & expand inputSection for ipos
        $scope.criticalIllnessInputSection = false;
        //$scope.payoutInputSection=false;
        // $scope.riderInputSection=false;
        $scope.frequencyDetailsModal = false;


        // $scope.groupPlans = function(data){
        // 	var morePlans = [];

        // 	for(var i=0;i<$rootScope.ciQuoteResult.length;i++){
        // 		//  
        // 		if(data.carrierId == $rootScope.ciQuoteResult[i].carrierId && (data.planId != $rootScope.ciQuoteResult[i].planId)){
        // 			morePlans.push($rootScope.ciQuoteResult[i]);
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

        $scope.showPremiumFrequencyModal = function() {
            $scope.frequencyDetailsModal = !$scope.frequencyDetailsModal;
        }
        $scope.hidePremiumFrequencyModal = function() {
                $scope.frequencyDetailsModal = false;
            }
            // Fetch lead id from url for iQuote+.
        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
            messageIDVar = $location.search().messageId;
            $scope.quoteUserInfo.messageId = $location.search().messageId;

            //added to collapse & expand inputSection for ipos
            $scope.criticalIllnessInputSection = true;
            //$scope.payoutInputSection=true;
            // $scope.riderInputSection=true;	
        }

        /*below functions for expand-collapse of DOM for ipos */
        $scope.showPersonalDetails = function() {
            $scope.criticalIllnessInputSection = !$scope.criticalIllnessInputSection;
        }

        // $scope.showRiderDetails=function()
        // {
        // 	$scope.riderInputSection=!$scope.riderInputSection;
        // }

        $scope.updatePremiumFrequecy = function(selectedFreq) {
            console.log("selectedFreq : " + selectedFreq);
            if (selectedFreq == 'M') {
                $scope.isMonthlyPremium = true;
                $scope.isQuarterlyPremium = $scope.isHalfAnnualPremium = $scope.isAnnualPremium = false;
            } else if (selectedFreq == 'Q') {
                $scope.isQuarterlyPremium = true;
                $scope.isMonthlyPremium = $scope.isHalfAnnualPremium = $scope.isAnnualPremium = false;
            } else if (selectedFreq == 'HY') {
                $scope.isHalfAnnualPremium = true;
                $scope.isMonthlyPremium = $scope.isQuarterlyPremium = $scope.isAnnualPremium = false;
            } else {
                $scope.isAnnualPremium = true;
                $scope.isMonthlyPremium = $scope.isQuarterlyPremium = $scope.isHalfAnnualPremium = false;
            }
        }

        // $scope.showPayoutDetails=function()
        // {
        // 	$scope.payoutInputSection=!$scope.payoutInputSection;
        // }
        /*end of ipos function for expand-collapse of DOM 	*/

        $scope.backToResultScreen = function() {
            // if($rootScope.wordPressEnabled){
            // $rootScope.isBackButtonPressed=true;	
            // }
            // $location.path("/quote");
            if ($rootScope.wordPressEnabled) {
                $rootScope.isBackButtonPressed = true;
            }
            if ($rootScope.isProfessionalJourneySelected) {
                $location.path("/professionalJourneyResult");
            } else {
                $location.path("/PBQuote");
            }
        };




        // var carrierRiderList = angular.copy($rootScope.carrierDetails);

        var docId = $scope.globalLabel.documentType.quoteResultScreen + "-" + localStorageService.get("selectedBusinessLineId");

        getDocUsingId(RestAPI, docId, function(tooltipContent) {
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

            $scope.quoteParam = localStorageService.get("criticalIllnessQuoteInputParamaters").quoteParam;
            $scope.personalDetails = localStorageService.get("criticalIllnessPersonalDetails");


            $scope.insuranceCompanyList = {};
            $scope.insuranceCompanyList.selectedInsuranceCompany = [];
            $scope.disableSubmit = false; // disable get quotes form 

            // To get the rider list applicable for this user.

            $scope.sortType = sortTypesCriticalIllnessGeneric[0];
            $scope.sortTypes = sortTypesCriticalIllnessGeneric;

            $scope.relationType = relationLifeQuoteGeneric;
            $scope.healthConditionType = healthConditionGeneric;
            $scope.annualIncomesRange = annualIncomesGeneric;
            $scope.healthTypeCondition = healthTypeConditionGeneric;
            $scope.riskLevels = riskLevelsGeneric;
            $scope.annualIncomesRange = annualIncomesGeneric;
            $scope.genderType = genderTypeGeneric;
            $scope.tobaccoAddictionStatus = tobaccoAddictionStatusGeneric;
            $scope.maturityAgeList = getAgeList($scope.personalDetails.minMaturityAge, $scope.personalDetails.maxMaturityAge);
            $scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
            $scope.comparePoliciesDisplayList = comparePoliciesDisplayValues;

            $scope.compareLifePoliciesDisplayList = compareLifePoliciesDisplayValues;

            //	$scope.payoutOptions = lifePayoutOptionsGeneric;

            //	$scope.payoutDetails.payoutOption = $scope.payoutOptions[0];
            //$scope.payoutId = $scope.payoutOptions[0].id;
            //$scope.payoutName = $scope.payoutOptions[0].name;
            $scope.selectedSortOption = $scope.sortTypes[0];

            $scope.personalDetails.maturityAge = ciMaturityAgeConstant;
            $scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);
            $scope.personAge = $scope.quoteParam.age;

            //added for reset
            $scope.quoteParamCopy = angular.copy($scope.quoteParam);
            $scope.personalDetailsCopy = angular.copy($scope.personalDetails);

            // 	if($rootScope.wordPressEnabled){
            // $scope.selectedPayoutOptionCopy=angular.copy($scope.payoutDetails.payoutOption);
            // }
            /*$scope.togglePayoutChangeClose = function(){
			$(".viewIDVDiv").slideDown();
			$(".modifyIDVDiv").slideUp();

			$scope.editPayoutBtn = true;
			$scope.cancelPayoutBtn = false;
			$scope.submitPayoutBtn = false;
		};
		*/
            /*$scope.submitPayoutBtn = false;
            $scope.editPayoutBtn = true;
            var setPayoutChangeFlag = true;*/

            // $scope.togglePayoutChange = function(selectedPayout){
            // 	$scope.payoutId = selectedPayout.id;
            // 	$scope.payoutName = selectedPayout.name;
            // 	if(!$rootScope.wordPressEnabled)
            // 	{	
            // 		$scope.singleClickCriticalIllnessQuote();
            // 	}
            // }

            $scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
                setTimeout(function() {
                    $('.md-click-catcher').click(function() {
                        $scope.activeMenu = '';
                    });
                }, 100);
            };

            $scope.clickForActive = function(item) {
                $scope.activeMenu = item;
            };

            $scope.clickForViewActive = function(item) {
                $scope.activeViewMenu = item;
            };

            $scope.clickForViewActive('Compare');

            $scope.clicktoDisable = function() {
                setTimeout(function() {
                    $('.md-click-catcher').css('pointer-events', 'none');
                }, 100);
            };

            //code for share email
            $scope.EmailChoices = [{ 'username': '', 'addNew': true, paramMap: { 'docId': '', 'LOB': localStorageService.get("selectedBusinessLineId").toString(), 'userId': '', 'selectedPolicyType': '' } }]; //$scope.quoteParam.quoteType
            $scope.quoteUserInfo.messageId = '';
            $scope.quoteUserInfo.termsCondition = true;
            var flag = false;
            //$scope.modalView=false;
            $scope.modalEmailView = false;
            $scope.emailPopUpDisabled = false;

            if (localStorageService.get("quoteUserInfo")) {
                $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
            }

            $scope.addNewChoice = function() {
                var newItemNo = $scope.EmailChoices.length + 1;
                if (newItemNo <= 3) {
                    $scope.EmailChoices.push({
                        'username': ''
                    })
                    $scope.EmailChoices[0].addNew = false;
                    $scope.EmailChoices[1].addNew = true;
                    $scope.emailPopUpDisabled = false;
                }
                if (newItemNo == 3) {
                    $scope.EmailChoices[2].addNew = false;
                    $scope.emailPopUpDisabled = true;
                }
            };


            $scope.removeChoice = function() {
                var lastItem = $scope.EmailChoices.length - 1;
                $scope.EmailChoices.splice(lastItem);
            };

            $scope.showForShare = function(data) {
                if ($rootScope.parseCarrierList) {
                    for (var j = 0; j < $rootScope.parseCarrierList.length; j++) {
                        if (data.carrierId == $rootScope.parseCarrierList[j]) {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            }
            // $scope.sendEmail = function() {


            //     $scope.flagArray = [];
            //     var index = -1;
            //     for (var i = 0; i < $scope.EmailChoices.length; i++) {
            //         var flagCheck = {};
            //         if ($scope.EmailChoices[i].username == '' || $scope.EmailChoices[i].username == undefined) {
            //             continue;
            //         }
            //         //code for encode
			// 		var encodeQuote = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED");
			// 		// var encodeQuote = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID");
            //         var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
            //         var encodeEmailId = $scope.EmailChoices[i].username;
            //         var encodeCarrierList = [];


            //         // commented as told by danny

            //         if ($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0) {
            //             encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
            //             jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
            //         } else {
            //             encodeCarrierList.push("ALL");
            //         }



            //         $rootScope.encryptedQuote_Id = encodeQuote;
            //         $rootScope.encryptedLOB = encodeLOB
            //         $rootScope.encryptedEmail = encodeEmailId;
            //         $rootScope.encryptedCarriers = jsonEncodeCarrierList

            //         $scope.EmailChoices[i].funcType = "SHARECRITICALILLNESSQUOTE";
            //         $scope.EmailChoices[i].isBCCRequired = 'Y';
            //         $scope.EmailChoices[i].paramMap = {};
            //         //$scope.EmailChoices[i].paramMap.docId=String(localStorageService.get("CAR_UNIQUE_QUOTE_ID"));
            //         $scope.EmailChoices[i].paramMap.docId = String($rootScope.encryptedQuote_Id);
            //         $scope.EmailChoices[i].paramMap.LOB = String($rootScope.encryptedLOB);
            //         $scope.EmailChoices[i].paramMap.userId = String($rootScope.encryptedEmail);
            //         if ($rootScope.encryptedCarriers)
            //             $scope.EmailChoices[i].paramMap.carriers = String($rootScope.encryptedCarriers);
            //         // $scope.EmailChoices[i].paramMap.make=$scope.vehicleDetails.carMakeObject.make;
            //         // $scope.EmailChoices[i].paramMap.model=$scope.vehicleDetails.carModelObject.model; 
            //         // $scope.EmailChoices[i].paramMap.Variant=$scope.vehicleDetails.carVariantObject.variant;
            //         $scope.EmailChoices[i].paramMap.vehicleName = $scope.vehicleDetails.displayVehicle;
            //         $scope.EmailChoices[i].paramMap.selectedPolicyType = "Critical Illness";
            //         if ($rootScope.vehicleDetails.registrationNumber) {
            //             $scope.EmailChoices[i].paramMap.registrationNum = $rootScope.vehicleDetails.registrationNumber.toUpperCase();
            //         } else {
            //             $scope.EmailChoices[i].paramMap.registrationNum = $scope.vehicleInfo.registrationPlace;
            //         }

            //         var body = {};
            //         body.longURL = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;
            //         $http({ method: 'POST', url: getShortURLLink, data: body }).
            //         success(function(shortURLResponse) {

            //             var request = {};
            //             var header = {};
            //             var arr = $scope.EmailChoices;

            //             header.messageId = messageIDVar;
            //             header.campaignID = campaignIDVar;
            //             header.source = sourceOrigin;
            //             header.transactionName = sendEmail;
            //             header.deviceId = deviceIdOrigin;
            //             request.header = header;

            //             if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
            //                 index++;
            //                 request.body = arr[index];
            //                 request.body.paramMap.url = shortURLResponse.data.shortURL;
            //                 $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
            //                 success(function(callback) {
            //                     var emailResponse = JSON.parse(callback);
            //                     var receipientNum = $scope.EmailChoices.length;
            //                     if (i == receipientNum) {
            //                         if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
            //                             $scope.shareEmailModal = false;
            //                             $scope.modalEmailView = true;
            //                             /*for(var i=1;i<$scope.EmailChoices.length;i++)
            //                               $scope.EmailChoices[i]=[];*/
            //                         } else {
            //                             localStorageService.set("emailDetails", undefined);
            //                         }
            //                     }
            //                 });
            //             } else {
            //                 console.log(shortURLResponse.message);
            //             }
            //         });

            //     }

            // }
            // $scope.showShareEmailModal = function() {
            //     if (localStorageService.get("quoteUserInfo") && localStorageService.get("quoteUserInfo").emailId) {

            //         if ($scope.crmEmailSend || $rootScope.wordPressEnabled) {
            //             //Added by gauri for mautic application				
            //             if (imauticAutomation == true) {
            //                 imatShareQuote(localStorageService, $scope, 'ShareQuote');
            //                 $scope.shareEmailModal = false;
            //                 $scope.modalEmailView = true;
            //                 $scope.crmEmailSend = false;
            //             } else {
            //                 $scope.sendEmail();
            //             }
            //             $scope.shareEmailModal = false;
            //             $scope.modalEmailView = true;
            //         } else {
            //             $scope.shareEmailModal = true;
            //         }
            //     } else {
            //         $scope.shareEmailModal = true;
            //     }
            // }



            // $scope.sendQuotesByEmail = function() {
            //     var quoteUserInfo = {};
            //     // if user entered email id then add to tghe localstorage 
            //     if ($scope.EmailChoices.length > 0) {
            //         //check for locaal storge for user info
            //         if (localStorageService.get("quoteUserInfo")) {
            //             var quoteUserInfo = localStorageService.get("quoteUserInfo")
            //             if (quoteUserInfo) {
            //                 quoteUserInfo.emailId = $scope.EmailChoices[0].username;
            //                 localStorageService.set("quoteUserInfo", quoteUserInfo);
            //                 $scope.crmEmailSend = true;
            //                 $scope.showShareEmailModal();
            //             }
            //         } else {
            //             var quoteUserInfo = {};
            //             localStorageService.set("quoteUserInfo", quoteUserInfo);
            //             $scope.sendQuotesByEmail();
            //         }
            //     }
			// }
			
			$scope.sendEmail = function () {
				
								var index = -1;
								for (var i = 0; i < $scope.EmailChoices.length; i++) {
									if ($scope.EmailChoices[i].username == '' || $scope.EmailChoices[i].username == undefined) {
										continue;
									}
									//code for encode
									var encodeQuote = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED");
									// var encodeQuote = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID");
									var encodeLOB = String(localStorageService.get("selectedBusinessLineId"));
									var encodeEmailId = $scope.EmailChoices[i].username;
									var encodeMonthlyPremiumOption = String($scope.isMonthlyPremium);
									var encodeCarrierList = [];
				
									if ($scope.insuranceCompanyList.selectedInsuranceCompany.length > 0) {
										encodeCarrierList = $scope.insuranceCompanyList.selectedInsuranceCompany;
										jsonEncodeCarrierList = JSON.stringify(encodeCarrierList);
									} else {
										encodeCarrierList.push("ALL");
									}
				
				
									$rootScope.encryptedQuote_Id = encodeQuote
									$rootScope.encryptedLOB = encodeLOB
									$rootScope.encryptedEmail = encodeEmailId
									$rootScope.encryptedMonthlyPremium = encodeMonthlyPremiumOption
									$rootScope.encryptedCarriers = jsonEncodeCarrierList
				
				
									$scope.EmailChoices[i].funcType = "SHARECRITICALILLNESSQUOTE";
									$scope.EmailChoices[i].isBCCRequired = 'Y';
									$scope.EmailChoices[i].paramMap = {};
									/*$scope.EmailChoices[i].paramMap.docId=String(localStorageService.get("LIFE_UNIQUE_QUOTE_ID"));*/
									$scope.EmailChoices[i].paramMap.docId = String($rootScope.encryptedQuote_Id);
									$scope.EmailChoices[i].paramMap.LOB = String($rootScope.encryptedLOB);
									$scope.EmailChoices[i].paramMap.userId = String($rootScope.encryptedEmail);
									$scope.EmailChoices[i].paramMap.carriers = String($rootScope.encryptedCarriers);
									$scope.EmailChoices[i].paramMap.monthlyPremiumOption = String($rootScope.encryptedMonthlyPremium);
									$scope.EmailChoices[i].paramMap.selectedPolicyType = "Critical Illness";
									var body = {};
									body.longURL = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;
									$http({
										method: 'POST',
										url: getShortURLLink,
										data: body
									}).
									success(function (shortURLResponse) {
				
										var request = {};
										var header = {};
										var arr = $scope.EmailChoices;
				
										header.messageId = messageIDVar;
										header.campaignID = campaignIDVar;
										header.source = sourceOrigin;
										header.transactionName = sendEmail;
										header.deviceId = deviceIdOrigin;
										request.header = header;
				
										if (shortURLResponse.responseCode == 1000) {
											index++;
											request.body = arr[index];
											request.body.paramMap.url = shortURLResponse.data.shortURL;
											$http({
												method: 'POST',
												url: getQuoteCalcLink,
												data: request
											}).
											success(function (callback) {
												var emailResponse = JSON.parse(callback);
												var receipientNum = $scope.EmailChoices.length;
												if (i == receipientNum) {
													if (emailResponse.responseCode == 1000) {
														$scope.shareEmailModal = false;
														$scope.modalEmailView = true;
				
				
														/*for(var i=1;i<$scope.EmailChoices.length;i++)
														$scope.EmailChoices[i]=[];*/
													} else {
														localStorageService.set("emailDetails", undefined);
													}
												}
				
											});
										} else {
											console.log(shortURLResponse.message);
				
										}
									});
								}
							}
				
				
				
							$scope.showShareEmailModal = function () {
								if (localStorageService.get("quoteUserInfo") && localStorageService.get("quoteUserInfo").emailId) {
				
									if ($scope.crmEmailSend || $rootScope.wordPressEnabled) {
										//Added by gauri for mautic application				
										if (imauticAutomation == true) {
											imatShareQuote(localStorageService, $scope, 'ShareQuote');
											$scope.shareEmailModal = false;
											$scope.modalEmailView = true;
											$scope.crmEmailSend = false;
										} else {
											$scope.sendEmail();
										}
										$scope.shareEmailModal = false;
										$scope.modalEmailView = true;
									} else {
										$scope.shareEmailModal = true;
									}
								} else {
									$scope.shareEmailModal = true;
								}
							}
				
				
				
							$scope.sendQuotesByEmail = function () {
								var quoteUserInfo = {};
								// if user entered email id then add to tghe localstorage 
								if ($scope.EmailChoices.length > 0) {
									//check for locaal storge for user info
									if (localStorageService.get("quoteUserInfo")) {
										var quoteUserInfo = localStorageService.get("quoteUserInfo")
										if (quoteUserInfo) {
											quoteUserInfo.emailId = $scope.EmailChoices[0].username;
											localStorageService.set("quoteUserInfo", quoteUserInfo);
											$scope.crmEmailSend = true;
											$scope.showShareEmailModal();
										}
									} else {
										var quoteUserInfo = {};
										localStorageService.set("quoteUserInfo", quoteUserInfo);
										$scope.sendQuotesByEmail();
									}
								}
							}



            $scope.deleteReceipient = function(index) {
                $scope.EmailChoices.splice(index, 1);
                if ($scope.EmailChoices.length < 3) {
                    $scope.emailPopUpDisabled = false;
                    if ($scope.EmailChoices.length == 1) {
                        $scope.EmailChoices[0].addNew = true;
                        $scope.EmailChoices[1].addNew = false;
                    } else {
                        $scope.EmailChoices[0].addNew = false;
                        $scope.EmailChoices[1].addNew = true;
                    }
                }
            }

            $scope.hideEmailModal = function() {
                $scope.modalEmailView = false;
                $scope.shareEmailModal = false;
            }

            $scope.premiumFrequencyTypeName = function(premiumType) {
                if (premiumType == "Y") {
                    return $scope.globalLabel.applicationLabels.criticalIllness.annualPremium;
                } else if (premiumType == "HY") {
                    return $scope.globalLabel.applicationLabels.criticalIllness.halfYearlyPremium;

                } else if (premiumType == "Q") {
                    return $scope.globalLabel.applicationLabels.criticalIllness.quaterlyPremium;

                } else if (premiumType == "M") {
                    return $scope.globalLabel.applicationLabels.criticalIllness.monthlyPremium;
                }

            }


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




            // // Create lead with available user information by calling webservice for share email.
            $scope.leadCreationUserInfo = function() {
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
            if ($rootScope.flag || $rootScope.isOlarked) {
                $scope.isMonthlyPremium = $rootScope.decryptedMonthlyPremiumOption;
                if ($scope.isMonthlyPremium == "true") {
                    $scope.isMonthlyPremium = true;
                } else {
                    $scope.isMonthlyPremium = false;
                    $scope.isQuarterlyPremium = false;
                    $scope.isHalfAnnualPremium = false;
                    $scope.isAnnualPremium = true;
                    $scope.premiumChoice = false;
                }
                if ($rootScope.selectedAddOnCovers != undefined) {
                    $scope.personalDetails.selectedAddOnCovers = $rootScope.selectedAddOnCovers;
                }
                angular.copy($scope.personalDetails.selectedAddOnCovers, $scope.selectedAddOnCoversCopy);
                // for(var i=0; i < $scope.payoutOptions.length; i++)
                // {
                // 	if($scope.payoutOptions[i].id==$scope.quoteParam.payoutId)
                // 	{
                // 		$scope.payoutDetails.payoutOption=$scope.payoutOptions[i];
                // 		break;
                // 	}
                // }
                if ($rootScope.flag) {
                    $scope.redirectToResult();
                    $rootScope.flag = false;
                }
                if (localStorageService.get("quoteUserInfo")) {
                    $scope.EmailChoices[0].username = localStorageService.get("quoteUserInfo").emailId;
                }
                $rootScope.loading = false;
            }

            $scope.calculateSumAssured = function() {
                listSumAssuredAmt($scope.personalDetails.annualIncomeObject.annualIncome, function(sumInsuredArray, selectedSumAssured) {
                    $scope.quoteParam.sumInsured = selectedSumAssured.amount;
                    $scope.personalDetails.sumInsuredObject = selectedSumAssured;
                    $scope.personalDetails.sumInsuredList = sumInsuredArray;
                });
            }
            $rootScope.editForMobile = function() {
                    $rootScope.showonEdit = "inline !important";
                    $rootScope.hideonEdit = "none !important";
                    $scope.flagforMobile = true;
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
            $scope.toggleChange = function(clickEvent) {
                $('.firstPane').addClass('opened');
                $('.firstPaneContent').show();
                if ($('.viewDiv').is(':visible') == true) {
                    //$(".modifyDiv").slideDown();
                    //$(".viewDiv").slideUp();
                    $scope.editBtn = false;
                    $scope.submitBtn = true;
                    $scope.cancelBtn = true;
                } else {
                    if ($('.modifyDiv').is(':visible') == true && clickEvent == "submit") {
                        $scope.editBtn = true;
                        $scope.cancelBtn = false;
                        $scope.submitBtn = false;
                        $scope.singleClickCriticalIllnessQuote();
                    } else {
                        /*$scope.quote = localStorageService.get("lifeQuoteInputParamaters");
                        $scope.personalDetails = localStorageService.get("lifePersonalDetails");*/
                        angular.copy($scope.quoteParamCopy, $scope.quoteParam);
                        angular.copy($scope.personalDetailsCopy, $scope.personalDetails);
                        $scope.quoteCriticalIllnessInputForm.criticalIllnessInputForm.$setPristine();
                        $scope.criticalIllnessInputForm = false;
                        $scope.editBtn = true;
                        $scope.cancelBtn = false;
                        $scope.submitBtn = false;
                    }
                }
            }
            $scope.showAmount = function(amount) {
                if (amount > 100000)
                    return Math.round(amount / 100000);
                else
                    return 0;
            }
            $scope.checkSum = function(amount) {

                if (amount < 500000 || amount == undefined || typeof(amount) == undefined) {

                    $scope.disableSubmit = true;
                    $scope.message = "Please enter the amount Greater Than 5 Lac ";
                }
                if (amount > 25000000) {

                    $scope.disableSubmit = true;
                    $scope.message = "Please enter the amount Less than 2.5 Crore ";

                }
                if (amount > 500000 && amount <= 20000000) {
                    $scope.message = "";
                    $scope.disableSubmit = false;

                }

            }
            $scope.setfromController = true;
            var setFlag = true;
            $scope.submitReportBtn = false;
            $scope.editReportBtn = true;
            $scope.toggleReportChange = function() {
                $('.thirdPane').addClass('opened');
                $('.thirdPaneContent').show();
                if ($('.viewReportDiv').is(':visible') == true) {
                    $(".modifyReportDiv").show();
                    $(".viewReportDiv").hide();
                    $scope.editReportBtn = false;
                    $scope.submitReportBtn = true;;
                    $scope.cancelReportBtn = true;
                    setFlag = false;
                } else if ($('.modifyReportDiv').is(':visible') == true) {
                    $(".viewReportDiv").slideDown();
                    $(".modifyReportDiv").slideUp();
                    $scope.editReportBtn = true;
                    $scope.submitReportBtn = false;
                    $scope.cancelReportBtn = false;
                    setFlag = true;
                }

            }



            // /SBI does not support  base premium less than folling for time freq
            $scope.checkForSbi = function(data) {
                if (data.carrierId == 43) {
                    if (data.premiumFrequency == "Y" && data.basicPremium < 600)
                        return false;

                    else if (data.premiumFrequency == "M" && data.basicPremium < 50)
                        return false;

                    else if (data.premiumFrequency == "Q" && data.basicPremium < 150)
                        return false;

                    else if (data.premiumFrequency == "HY" && data.basicPremium < 300)
                        return false;

                    else
                        return true;

                } else {
                    return true;
                }
            }

            // Function created to sort quote result.	-	modification-0002
            $scope.updateSort = function(sortOption) {
                $scope.activeSort = sortOption.key;
                $scope.selectedSortOption = sortOption;
                if (sortOption.key == 1) {
                    $scope.sortKey = "annualPremium";
                    $scope.sortReverse = false;
                } else if (sortOption.key == 2) {
                    $scope.sortKey = "sumInsured";
                    $scope.sortReverse = true;
                } else if (sortOption.key == 3) {
                    $scope.sortKey = "insurerIndex";
                    $scope.sortReverse = true;
                } else if (sortOption.key == 4) {
                    $scope.sortKey = "ratingsList['8'][" + $scope.benefitFeatureRiskType.id + "]";
                    $scope.sortReverse = true;
                } else if (sortOption.key == 5) {
                    $scope.sortKey = "ratingsList['9'][" + $scope.flexibleFeatureRiskType.id + "]";
                    $scope.sortReverse = true;
                } else if (sortOption.key == 6) {
                    $scope.sortKey = "ratingsList['11'][" + $scope.savingFeatureRiskType.id + "]";
                    $scope.sortReverse = true;
                } else if (sortOption.key == 7) {
                    $scope.sortKey = "ratingsList['10'][" + $scope.eligibilityFeatureRiskType.id + "]";
                    $scope.sortReverse = true;
                }

                $scope.toggleState();
            }
            $scope.updateSortOrder = function() {
                if ($scope.selectedSortOption.key == 1) {
                    $scope.sortKey = "annualPremium";
                } else if ($scope.selectedSortOption.key == 2) {
                    $scope.sortKey = "sumInsured";
                } else if ($scope.selectedSortOption.key == 3) {
                    $scope.sortKey = "insurerIndex";
                } else if ($scope.selectedSortOption.key == 4) {
                    $scope.sortKey = "ratingsList['8'][" + $scope.benefitFeatureRiskType.id + "]";
                } else if ($scope.selectedSortOption.key == 5) {
                    $scope.sortKey = "ratingsList['9'][" + $scope.flexibleFeatureRiskType.id + "]";
                } else if ($scope.selectedSortOption.key == 6) {
                    $scope.sortKey = "ratingsList['11'][" + $scope.savingFeatureRiskType.id + "]";
                } else if ($scope.selectedSortOption.key == 7) {
                    $scope.sortKey = "ratingsList['10'][" + $scope.eligibilityFeatureRiskType.id + "]";
                }
                $scope.sortReverse = !$scope.sortReverse;
            }

            $scope.getRiskLabel = function(riskType) {
                for (var i = 0; i < $scope.riskLevels.length; i++)
                    if ($scope.riskLevels[i].id == riskType)
                        return $scope.riskLevels[i];
            }

            if ($rootScope.ciQuoteResult.length > 0) {
                $scope.benefitFeatureRiskType = $scope.getRiskLabel($rootScope.ciQuoteResult[0].risks['8']);
                $scope.flexibleFeatureRiskType = $scope.getRiskLabel($rootScope.ciQuoteResult[0].risks['9']);
                $scope.eligibilityFeatureRiskType = $scope.getRiskLabel($rootScope.ciQuoteResult[0].risks['10']);
                $scope.savingFeatureRiskType = $scope.getRiskLabel($rootScope.ciQuoteResult[0].risks['11']);
            }

            // Function created to get default list of input paramters from DB.	-	modification-0004
            $scope.fetchDefaultInputParamaters = function(defaultInputParamCallback) {
                getDocUsingId(RestAPI, $scope.globalLabel.documentType.defaultCriticalIllnessQuoteParam, function(callback) {
                    $scope.quoteParam = callback.quoteParam;
                    $scope.personalDetails = callback.personalDetails;

                    listSumAssuredAmt($scope.quoteParam.annualIncome, function(sumInsuredArray, selectedSumAssured) {
                        $scope.personAge = $scope.quoteParam.age;
                        $scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);
                        $scope.personalDetails.sumInsuredObject = selectedSumAssured;
                        $scope.personalDetails.sumInsuredList = sumInsuredArray;

                        for (var i = 0; i < annualIncomesGeneric.length; i++) {
                            if ($scope.quoteParam.annualIncome == annualIncomesGeneric[i].annualIncome) {
                                $scope.personalDetails.annualIncomeObject = annualIncomesGeneric[i];
                                break;
                            }
                        }

                        defaultInputParamCallback();
                    });
                });
            }

            //maturity age difference as 30 - Akash & Abhishek M.
            $scope.calculateMaturityAgeGap = function() {
                if ($scope.quoteParam.age >= 45) {
                    $scope.personalDetails.maturityAge = ciMaturityAgeConstant;
                } else {
                    $scope.personalDetails.maturityAge = $scope.quoteParam.age + 30;
                }
            }
            $scope.calculateMaturityAgeGap();
            // Yogesh-20072017: As discussed with Uday, function created to update maturity list depends upon the age selected by user.	-	modification-0006

            $scope.updateMaturityAgeList = function() {
                // maturity age and the self age gap is made 30 if the age is less than 45, if age is greater than 45 the the max maturity of 75 is kept-uday
                $scope.calculateMaturityAgeGap();

                var minMaturityAge = $scope.quoteParam.age + 1;

                if ($scope.personalDetails.maturityAge < minMaturityAge) {
                    $scope.personalDetails.maturityAge = minMaturityAge;
                }


                $scope.maturityAgeList = getAgeList(minMaturityAge, $scope.personalDetails.maturityAge);
            }

            $scope.errorRespCounter = true;
            $scope.errorMessage = function(errorMsg) {
                if ($scope.errorRespCounter && (String($rootScope.ciQuoteResult) == "undefined" || $rootScope.ciQuoteResult.length == 0)) {
                    $scope.errorRespCounter = false;
                    $scope.errorRespMsg = errorMsg;
                    $rootScope.progressBarStatus = false;
                    $rootScope.viewOptionDisabled = true;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.loading = false;
                } else if ($rootScope.ciQuoteResult.length > 0) {
                    $rootScope.progressBarStatus = false;
                    $rootScope.viewOptionDisabled = false;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.loading = false;
                }
            }

            $scope.customFilterCriticalIllness = function() {

                $scope.netPremiumTotalCI = 0;
                $scope.netPremiumAverageCI = 0;
                $scope.netPremiumMaxCI = 0;
                $scope.proffesionalRatingCI = 0;

                for (var i = 0; i < $rootScope.ciQuoteResult.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalCI += $rootScope.ciQuoteResult[i].premiumRatio;

                    //Get avg of premium
                    $scope.netPremiumAverageCI = Number(($scope.netPremiumTotalCI / $rootScope.ciQuoteResult.length).toFixed(5));
                }
                for (var i = 0; i < $rootScope.ciQuoteResult.length; i++) {
                    $rootScope.ciQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageCI / $rootScope.ciQuoteResult[i].premiumRatio).toFixed(5));
                    if ($rootScope.ciQuoteResult[i].netPremiumMax > $scope.netPremiumMaxCI) {
                        $scope.netPremiumMaxCI = $rootScope.ciQuoteResult[i].netPremiumMax;
                    }

                }
                for (var i = 0; i < $rootScope.ciQuoteResult.length; i++) {
                    $rootScope.ciQuoteResult[i].netPremiumMean = Number((($rootScope.ciQuoteResult[i].netPremiumMax / $scope.netPremiumMaxCI) * 5).toFixed(1));
                    $rootScope.ciQuoteResult[i].proffesionalRating = ($rootScope.ciQuoteResult[i].netPremiumMean * 0.4) +
                        ($rootScope.ciQuoteResult[i].claimIndex * 0.3) +
                        ($rootScope.ciQuoteResult[i].insurerIndex * 0.3);

                }
                $rootScope.ciQuoteResult = $filter('orderBy')($rootScope.ciQuoteResult, 'proffesionalRating');
                $rootScope.ciQuoteResult = $rootScope.ciQuoteResult;
                $scope.sortReverse = true;
                return true;

            }
            $scope.processResult = function() {
                $rootScope.progressBarStatus = false;
                $rootScope.viewOptionDisabled = false;
                $rootScope.tabSelectionStatus = true;
                $rootScope.loading = false;
                $rootScope.ciQuoteResult = $filter('orderBy')($rootScope.ciQuoteResult, 'dailyPremium');
                /*for(var j = 0; j < $rootScope.ciQuoteResult.length; j++){
                	if(j==$rootScope.ciQuoteResult.length -1 ){
                		$timeout(function(){
                			$scope.dataLoaded=true;
                			//$scope.slickLoaded=true;
                		},1000);
                	}
                }*/
            }

            $scope.displayRibbon = function() {
                $scope.isMinPremium = function(annualPremiumValue, carrierIDValue) {

                    var min = $rootScope.ciQuoteResult[0].annualPremium;

                    for (var i = 0; i <= $rootScope.ciQuoteResult.length - 1; i++) {
                        var carrierIdMin = $rootScope.ciQuoteResult[i].carrierId;
                        if (Number($rootScope.ciQuoteResult[i].annualPremium) < min) {
                            min = $rootScope.ciQuoteResult[i].annualPremium;
                            carrierIDValue = carrierIdMin;
                        }
                    }
                    if (min === annualPremiumValue) {
                        $scope.selMinCarrierId = carrierIDValue;

                        return true;
                    } else {
                        return false;
                    }
                }

                $scope.isMaxIndex = function(insurerIndex, sumInsured, annualPremium, carrierSelID) {
                    var maxSel = (annualPremium / (insurerIndex * sumInsured)) * 1000;

                    var insurerIndex0 = $rootScope.ciQuoteResult[0].insurerIndex;
                    var sumInsured0 = $rootScope.ciQuoteResult[0].sumInsured;
                    var annualPremium0 = $rootScope.ciQuoteResult[0].annualPremium;
                    var max = (annualPremium0 / (sumInsured0 * insurerIndex0)) * 1000;

                    for (var i = 0; i <= $rootScope.ciQuoteResult.length - 1; i++) {
                        var insurerIndexI = $rootScope.ciQuoteResult[i].insurerIndex;
                        var sumInsuredI = $rootScope.ciQuoteResult[i].sumInsured;
                        var annualPremiumI = $rootScope.ciQuoteResult[i].annualPremium;
                        var carrierIdI = $rootScope.ciQuoteResult[i].carrierId;

                        var maxI = (annualPremiumI / (sumInsuredI * insurerIndexI)) * 1000;

                        if (Number(maxI) < max) {
                            max = maxI;
                            carrierSelID = carrierIdI;

                        }
                    }
                    if (max === maxSel) {
                        $scope.selCarrierId = carrierSelID;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            $scope.displayRibbon();

            //function created to reset payout details for wordpress p365
            // $scope.resetPayoutDetails=function(){
            // 	if($scope.selectedPayoutOptionCopy){
            // 		$scope.payoutDetails.payoutOption=$scope.selectedPayoutOptionCopy;
            // 		for(var i=0; i < $scope.payoutOptions.length; i++)
            // 		{
            // 			if($scope.payoutDetails.payoutOption.id==$scope.payoutOptions[i].id)
            // 			{
            // 				$scope.payoutDetails.payoutOption=$scope.payoutOptions[i];
            // 				break;
            // 			}
            // 		}
            // 	}else{
            // 		$scope.payoutDetails.payoutOption=[];
            // 	}
            // 	$scope.payoutOptionModal=false;	
            // }
            //function created to reset rider details for wordpress p365
            // $scope.resetRiderDetails=function(){
            // 	if ($scope.selectedAddOnCoversCopy) 
            // 	  {
            // 		 angular.copy($scope.selectedAddOnCoversCopy, $scope.personalDetails.selectedAddOnCovers);
            // 	 }else{
            // 		 $scope.personalDetails.selectedAddOnCovers = [];
            // 	 }
            // 	$scope.riderDetailsModal=false;
            // }
            //function created to display carrier if premium > 0.
            $scope.validatePremium = function(data) {
                /*console.log('M:'+$scope.isMonthlyPremium);
                console.log('M-value:'+data.monthlyFinalPremium);
                console.log('Y:'+$scope.isAnnualPremium);
                console.log('Y-value:'+data.annualPremium);*/
                if (Number(data.annualPremium) > 0) {
                    return true;
                } else {
                    return false;
                }
                /*if($scope.isMonthlyPremium)
			 {
			 	if(Number(data.monthlyFinalPremium) > 0){	
			  		return true;	
			 	}else{
			 		return false;
			 	}
			 }else if($scope.isQuarterlyPremium){
				 	if(Number(data.annualPremium) > 0){
				 		return true;	
				 	}else{
				 		return false;
				 	}
			 }else if($scope.isHalfAnnualPremium){
				 	if(Number(data.annualPremium) > 0){
				 		return true;	
				 	}else{
				 		return false;
				 	}
			 }else if($scope.isAnnualPremium){
				 	if(Number(data.annualPremium) > 0){
				 		return true;	
				 	}else{
				 		return false;
				 	}
			}*/
            };

            $scope.singleClickCriticalIllnessQuote = function() {
                //setTimeout(function(){
                if ($scope.quoteCriticalIllnessInputForm.$dirty || $scope.quoteCriticalIllnessInputForm.criticalIllnessInputForm.$dirty) {
                    setTimeout(function() {

                        if ($scope.flagforMobile) {
                            $rootScope.showonEdit = "none !important";
                            $rootScope.hideonEdit = "inline !important";
                            $scope.flagforMobile = false;
                        }
                        $scope.quoteCriticalIllnessInputForm.$setPristine();
                        // $scope.quoteParam.riders = [];
                        // selectedRiderListForLife($scope.addOnCovers, $scope.personalDetails.selectedAddOnCovers, $scope.quoteParam.riders, function(){
                        $scope.errorRespCounter = true;
                        $rootScope.loading = true;
                        $scope.dataLoaded = false;
                        //$scope.payoutOptionModal=false;	
                        $scope.riderDetailsModal = false;
                        //$scope.personalDetails.selectedAddOnCovers = $scope.personalDetails.selectedAddOnCovers;

                        $scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
                        $scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");

                        //$scope.quoteParam.payoutId = $scope.payoutDetails.payoutOption.id;
                        $scope.quoteParam.sumInsured = (Math.round(parseInt($scope.personalDetails.sumInsuredAmount) / 10000) * 10000);



                        $scope.quoteParam.annualIncome = $scope.personalDetails.annualIncomeObject.annualIncome;
                        $scope.quoteParam.annualIncomeInterval = $scope.personalDetails.annualIncomeObject.annualIncomeInterval;
                        // $scope.quoteParam.healthCondition = "Y";

                        //for wordpress reset
                        // if($rootScope.wordPressEnabled && $scope.personalDetails.selectedAddOnCovers.length > 0 ){
                        // 	$scope.selectedAddOnCoversCopy=angular.copy($scope.personalDetails.selectedAddOnCovers);
                        // }
                        // if($rootScope.wordPressEnabled){
                        // 	$scope.selectedPayoutOptionCopy=angular.copy($scope.payoutDetails.payoutOption);
                        // }

                        // Yogesh-12072017: Based on discussion with uday, Maturity age constant value changes from 70 to 50 and value of policy term at least have 5 year. 
                        var policyTerm = $scope.personalDetails.maturityAge - $scope.quoteParam.age;

                        if (policyTerm < $scope.personalDetails.minPolicyTermLimit) {
                            $scope.quoteParam.policyTerm = $scope.personalDetails.minPolicyTermLimit;
                        } else {
                            $scope.quoteParam.policyTerm = policyTerm;
                        }



                        /*for(var i=0; i<$scope.personalDetails.selectedAddOnCovers.length;i++){
                        	var riderList={};
                        	riderList.riderId = $scope.personalDetails.selectedAddOnCovers[i].riderId;
                        	riderList.riderName = $scope.personalDetails.selectedAddOnCovers[i].riderName;
                        	$scope.quoteParam.riders.push(riderList);
                        }*/
                        $scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);

                        // if($scope.quoteParam.riders.length == 0){
                        // 	$scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
                        // }

                        // if($scope.personalDetails.selectedAddOnCovers.length <= 2){
                        // 	$scope.riderFeatureLength = 0;
                        // } else if($scope.personalDetails.selectedAddOnCovers.length == 3){
                        // 	$scope.riderFeatureLength = 1;
                        // }else{
                        // 	$scope.riderFeatureLength = 2;
                        // }
                        $scope.quote.quoteParam = $scope.quoteParam;
                        $scope.quote.personalDetails = $scope.personalDetails;
                        $scope.quote.requestType = $scope.globalLabel.request.criticalIllnessRequestType;
                        localStorageService.set("ciInputParamaters", $scope.quote);
                        localStorageService.set("ciPersonalDetails", $scope.personalDetails);

                        //added for reset
                        $scope.quoteParamCopy = angular.copy($scope.quoteParam);
                        $scope.personalDetailsCopy = angular.copy($scope.personalDetails);

                        // Google Analytics Tracker added.
                        //analyticsTrackerSendData($scope.quote);
                        $scope.requestId = null;
                        $rootScope.ciQuoteResult = [];
                        RestAPI.invoke($scope.globalLabel.getRequest.quoteCriticalIllness, $scope.quote).then(function(callback) {
                            $rootScope.ciQuoteRequest = [];
                            if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                $rootScope.loading = false;
                                $scope.dataLoaded = true;
                                //$scope.slickLoaded=false;
                                $scope.responseCodeList = [];

                                $scope.requestId = callback.QUOTE_ID;

                                localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID", $scope.requestId);
                                $rootScope.ciQuoteRequest = callback.data;

                                if (String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0) {
                                    $rootScope.ciQuoteResult.length = 0;
                                }




                                //added by gauri for mautic application
                                if (imauticAutomation == true) {
                                    imatCriticalIllnessLeadQuoteInfo(localStorageService, $scope, 'ViewQuote');
                                }
                                //for olark
                                olarkCustomParam(localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), false);
                                angular.forEach($rootScope.ciQuoteRequest, function(obj, i) {
                                    var request = {};
                                    var header = {};

                                    header.messageId = messageIDVar;
                                    header.campaignID = campaignIDVar;
                                    header.source = sourceOrigin;
                                    header.transactionName = $scope.globalLabel.transactionName.criticalIllnessQuoteResult;
                                    header.deviceId = deviceIdOrigin;
                                    request.header = header;
                                    request.body = obj;


                                    $http({
                                        method: 'POST',
                                        url: getQuoteCalcLink,
                                        data: request
                                    }).
                                    success(function(callback, status) {
                                        var ciQuoteResponse = JSON.parse(callback);

                                        if (ciQuoteResponse.QUOTE_ID == $scope.requestId) {
                                            $scope.responseCodeList.push(ciQuoteResponse.responseCode);
                                            if (ciQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {

                                                for (var i = 0; i < $rootScope.ciQuoteRequest.length; i++) {
                                                    if ($rootScope.ciQuoteRequest[i].messageId == ciQuoteResponse.messageId) {
                                                        ciQuoteResponse.data.quotes[0].dailyPremium = Math.round(ciQuoteResponse.data.quotes[0].annualPremium / 365);
                                                        ciQuoteResponse.data.quotes[0].insuranceCompany = (ciQuoteResponse.data.quotes[0].insuranceCompany);
                                                        $rootScope.ciQuoteResult.push(ciQuoteResponse.data.quotes[0]);
                                                        $rootScope.ciQuoteRequest[i].status = 1;
                                                    }
                                                }
                                                $scope.processResult();

                                            } else {
                                                for (var i = 0; i < $rootScope.ciQuoteRequest.length; i++) {
                                                    if ($rootScope.ciQuoteRequest[i].messageId == ciQuoteResponse.messageId) {
                                                        $rootScope.ciQuoteRequest[i].status = 2;
                                                        //$rootScope.ciQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                        //comments updated based on Uday
                                                        $rootScope.ciQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg);
                                                    }
                                                }
                                            }

                                        }

                                    }).
                                    error(function(data, status) {
                                        $scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
                                    });
                                });

                                $scope.$watch('responseCodeList', function(newValue, oldValue, scope) {
                                    //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
                                    if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
                                    /*$rootScope.loading = false;*/

                                        if ($scope.responseCodeList.length == $scope.ciQuoteRequest.length) {
                                        /*$rootScope.loading = false;*/
                                        for (var i = 0; i < $rootScope.ciQuoteRequest.length; i++) {
                                            if ($rootScope.ciQuoteRequest[i].status == 0) {
                                                $rootScope.ciQuoteRequest[i].status = 2;
                                                //$rootScope.ciQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                $rootScope.ciQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg);
                                            }
                                        }
                                        //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
                                        if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
                                            // This condition will satisfy only when at least one product is found in the quoteResponse array.
                                            //} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
                                        } else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
                                            $scope.errorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
                                        } else {
                                            $scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
                                        }
                                    }
                                }, true);
                            } else {
                                $scope.responseCodeList = [];
                                if (String($rootScope.ciQuoteResult) != "undefined" && $rootScope.ciQuoteResult.length > 0)
                                    $rootScope.ciQuoteResult.length = 0;

                                $rootScope.ciQuoteResult = [];

                                // Yogesh-27092017- Error message not configured from webservice if we didnt found any products. So setting static error message.
                                $scope.errorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedLifeErrMsg));
                            }
                        });
                        // });
                        $scope.displayRibbon();
                    }, 100);
                } else {
                    //	$scope.payoutOptionModal=false;	
                    $scope.riderDetailsModal = false;
                }
                //},100);
            }

            $scope.state = false;
            $scope.toggleState = function() {
                $scope.state = !$scope.state;
            };
            $scope.PremiumFrequencyClick = function(premiumFrequency) {
                    $scope.frequencyDetailsModal = false;
                    $scope.singleClickCriticalIllnessQuote();
                }
                /*	// This piece of code will be called to store carrier specific buy quote links used for redirection.
                getDocUsingId(RestAPI, $scope.globalLabel.documentType.lifeProductBuyConfig, function(lifeProductBuyConfigDetails){
                	$scope.lifeProductBuyConfigDetails = lifeProductBuyConfigDetails;
                });*/

        });

        // $scope.getProductFeatures = function(selectedProduct, productFetchStatus){
        // 	var variableReplaceArray = [];
        // 	var productFeatureJSON = {};
        // 	productFeatureJSON.documentType = $scope.globalLabel.documentType.criticalIllnessProduct;
        // 	productFeatureJSON.carrierId = selectedProduct.carrierId;
        // 	productFeatureJSON.productId = selectedProduct.productId;
        // 	productFeatureJSON.businessLineId = 1;

        // 	for(var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++){
        // 		if(selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
        // 			$scope.brochureUrl =wp_path+$rootScope.carrierDetails.brochureList[i].brochureUrl;
        // 	}

        // 	variableReplaceArray.push({
        // 		'id': '{{sumInsured}}',
        // 		'value': Math.round(selectedProduct.sumInsured)
        // 	});
        // 	variableReplaceArray.push({
        // 		'id': '{{monthlyPayout}}',
        // 		'value': selectedProduct.monthlyPayout
        // 	});
        // 	variableReplaceArray.push({
        // 		'id': '{{policyTerm}}',
        // 		'value': $scope.quoteParam.policyTerm
        // 	});

        // 	if(productFetchStatus){
        // 		RestAPI.invoke($scope.globalLabel.transactionName.getProductFeatures, productFeatureJSON).then(function(callback){
        // 			$scope.productFeaturesList = callback.data[0].Features;
        // 			for(var j = 0; j < $scope.productFeaturesList.length; j++){
        // 				for(var i = 0; i < variableReplaceArray.length; i++){
        // 					if(p365Includes($scope.productFeaturesList[j].details,variableReplaceArray[i].id)){
        // 						$scope.productFeaturesList[j].details = $scope.productFeaturesList[j].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
        // 					}
        // 				}
        // 			}
        // 		});
        // 	}

        // 	$scope.modelBeneFeature = true;
        // }

        $scope.modelBeneFeature = false;
        $scope.closeBeneFeatureModel = function() {
            $scope.modelBeneFeature = false;
        }


        $scope.buyProductProxy = function(selectedProduct) {
            var postMethodDynamicFormArray = [];
            var tempParentJson = {};
            $scope.postMethodFormContent = [];
            postMethodDynamicFormArray.length = 0;

            var buyProductDetails = { frequency: {} };
            buyProductDetails.quoteParam = $scope.quoteParam;
            buyProductDetails.personalDetails = $scope.personalDetails;
            buyProductDetails.quoteResponse = angular.copy(selectedProduct);
            /*
             * Below if-else sets buyProductDetails.quoteResponse.annualPremium to,
             * monthly premium amount - if customer selects monthly premium
             * annual premium amount - if customer selects annual premium
             * half-yearly premium amount - if customer selects half-yearly premium
             * semi-annual premium amount - if customer selects semi-annual premium
             * quarterly premium amount - if customer selects quarterly premium,
             * However futher conditions are commenetd, these can be used for future 
             * requirements, same can be implemented with same logic
             * Remember the changes are made on a deep copy of original selectedProduct
             * object, if the original selectedProduct is altered we are nuked.
             * */
            if ($scope.isMonthlyPremium) {
                buyProductDetails.quoteResponse.annualPremium = selectedProduct.monthlyFinalPremium;
                buyProductDetails.quoteResponse.frequency = "3";
            } else if ($scope.isQuarterlyPremium) {
                buyProductDetails.quoteResponse.annualPremium = selectedProduct.annualPremium;
                buyProductDetails.quoteResponse.frequency = "0";
            } else if ($scope.isHalfAnnualPremium) {
                buyProductDetails.quoteResponse.annualPremium = selectedProduct.annualPremium;
                buyProductDetails.quoteResponse.frequency = "0";
            } else if ($scope.isAnnualPremium) {
                buyProductDetails.quoteResponse.annualPremium = selectedProduct.annualPremium;
                buyProductDetails.quoteResponse.frequency = "0";
            }

            buyProductDetails.areaDetails = localStorageService.get("cityDataFromIP");
            buyProductDetails.contactInfo = localStorageService.get("quoteUserInfo");
            buyProductDetails.frequency.type = String($scope.isMonthlyPremium);
            if (!buyProductDetails.contactInfo.lastName) {
                buyProductDetails.contactInfo.lastName = '';
            }
            //Added line for full name, required for one the carrier.
            buyProductDetails.contactInfo.fullName = buyProductDetails.contactInfo.firstName + " " + buyProductDetails.contactInfo.lastName;

            var buyQuoteURL = $scope.criticalIllnessProductBuyConfigDetails.quoteurl;
            var buyQuoteMethod = $scope.criticalIllnessProductBuyConfigDetails.method;
            var buyQuoteURLParamList = $scope.criticalIllnessProductBuyConfigDetails.paramList;
            var buyQuoteURLParams = "?";
            var buyProductPlan = $scope.criticalIllnessProductBuyConfigDetails.planName;

            if (buyQuoteMethod == 'GET') {
                for (var i = 0; i < buyQuoteURLParamList.length; i++) {
                    if (i < (buyQuoteURLParamList.length - 1)) {
                        if (buyQuoteURLParamList[i].defaultStatus) {
                            buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + buyQuoteURLParamList[i].value + "&";
                        } else {
                            if (buyProductDetails[buyQuoteURLParamList[i].parentNode] != null) {
                                if (buyQuoteURLParamList[i].definedValueStatus == "date") {
                                    var pdate = buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname];
                                    var dateformat = buyQuoteURLParamList[i].definedValue["format"];
                                    buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + dateFormater(pdate, dateformat) + "&";
                                } else if (buyQuoteURLParamList[i].definedValueStatus) {
                                    buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + buyQuoteURLParamList[i].definedValue[buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname]] + "&";
                                } else {
                                    buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] + "&";
                                }
                            }
                        }
                    } else {
                        if (buyQuoteURLParamList[i].defaultStatus) {
                            buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + buyQuoteURLParamList[i].value;
                        } else {
                            if (buyProductDetails[buyQuoteURLParamList[i].parentNode] != null) {
                                if (buyQuoteURLParamList[i].definedValueStatus == "date") {
                                    var pdate = buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname];
                                    var dateformat = buyQuoteURLParamList[i].definedValue["format"];
                                    buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + dateFormater(pdate, dateformat) + "&";
                                } else if (buyQuoteURLParamList[i].definedValueStatus) {
                                    buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + buyQuoteURLParamList[i].definedValue[buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname]] + "&";
                                } else {
                                    buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname];
                                }
                            }
                        }
                    }
                }
                $window.open(buyQuoteURL + buyQuoteURLParams, "_blank");
            } else if (buyQuoteMethod == 'POST') {
                for (var i = 0; i < buyQuoteURLParamList.length; i++) {
                    if (!buyQuoteURLParamList[i].isChild) {
                        if (buyQuoteURLParamList[i].defaultStatus) {
                            postMethodDynamicFormArray.push({ 'name': buyQuoteURLParamList[i].cname, 'value': buyQuoteURLParamList[i].value });
                        } else {
                            if (buyProductDetails[buyQuoteURLParamList[i].parentNode] != null) {
                                if (buyQuoteURLParamList[i].definedValueStatus == "date") {
                                    var pdate = buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname];
                                    var dateformat = buyQuoteURLParamList[i].definedValue["format"];
                                    postMethodDynamicFormArray.push({ 'name': buyQuoteURLParamList[i].cname, 'value': dateFormater(pdate, dateformat) });
                                } else if (buyQuoteURLParamList[i].definedValueStatus) {
                                    postMethodDynamicFormArray.push({ 'name': buyQuoteURLParamList[i].cname, 'value': buyQuoteURLParamList[i].definedValue[buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname]] });
                                } else {

                                    if (buyQuoteURLParamList[i].cname == "Fullname") {
                                        postMethodDynamicFormArray.push({ 'name': buyQuoteURLParamList[i].cname, 'value': buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] + '+' + buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname1] });
                                    } else {
                                        postMethodDynamicFormArray.push({ 'name': buyQuoteURLParamList[i].cname, 'value': buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] });
                                    }
                                }
                            }
                        }
                    } else if (buyQuoteURLParamList[i].isChild) {
                        if (!tempParentJson.hasOwnProperty(buyQuoteURLParamList[i].parentElement))
                            tempParentJson[buyQuoteURLParamList[i].parentElement] = '';
                        if (buyQuoteURLParamList[i].defaultStatus) {
                            if (buyQuoteURLParamList[i].definedValueStatus === 'string') {
                                tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + buyQuoteURLParamList[i].value + '", ';
                            }
                            if (buyQuoteURLParamList[i].definedValueStatus === 'integer')
                                tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : ' + buyQuoteURLParamList[i].value + ', ';
                        }
                        if (!buyQuoteURLParamList[i].defaultStatus) {
                            if (buyQuoteURLParamList[i].definedValueStatus === 'string') {
                                if (buyQuoteURLParamList[i].definedValue != null) {
                                    // if(buyQuoteURLParamList[i].isPayout)
                                    // 	tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + buyQuoteURLParamList[i].definedValue[String($scope.payoutOptions[selectedProduct.payoutId].id)] + '", ';
                                    // else
                                    tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + buyQuoteURLParamList[i].definedValue[buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname]] + '", ';
                                }
                                /*else if(selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRider)
                                	tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + selectedRidersJson[buyQuoteURLParamList[i].pname].riderSumAssured +'", ';
                                else if(!selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRider)
                                	tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "0", ';
                                else if(selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRiderStatus)
                                	{
                                		tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "true", ';
                                	}
                                else if(!selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRiderStatus)
                                	tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "false", ';
                                else{*/
                                tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] + '", ';
                                //}						
                            }
                            if (buyQuoteURLParamList[i].definedValueStatus === 'date') {
                                var pdate = buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname];
                                var dateformat = buyQuoteURLParamList[i].definedValue["format"];
                                var newFormattedDate = dateFormater(pdate, dateformat);
                                console.log('new formatted date: ' + newFormattedDate);
                                tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + newFormattedDate + '", ';
                            }
                            if (buyQuoteURLParamList[i].definedValueStatus === 'integer')
                                tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : ' + buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] + ', ';
                        }
                    }
                }
                /*
                 * Edelweiss requires some of the params in an object Array,
                 * with key 'TotalSecurePlusModel', /ask for reference form provided by Edelweiss\,
                 * Hence it has been hard-coded.
                 * This may not work for other carrier's that require post
                 * form submit.
                 * */
                $scope.paymentForm.setAction(buyQuoteURL);
                var parentKeysArray = Object.keys(tempParentJson);
                var parentKeysLength = parentKeysArray.length - 1;

                /*Edelweiss plan myLife+ does not rquired params in an object Array so introduced a planName*/
                if (buyProductPlan) {
                    if (parentKeysArray.length == 0) {
                        $scope.postMethodFormContent.length = 0;
                        $scope.postMethodFormContent = postMethodDynamicFormArray;
                        $scope.$apply();
                        $scope.paymentForm.commit();
                    } else {
                        parentKeysArray.forEach(function(keyObj, keyIndex) {
                            postMethodDynamicFormArray.push({ 'name': keyObj, 'value': '[{ "MyLifePlusModel" : {' + tempParentJson[keyObj] + '} }]' });
                            if (keyIndex == parentKeysLength) {
                                $scope.postMethodFormContent.length = 0;
                                $scope.postMethodFormContent = postMethodDynamicFormArray;
                                $scope.$apply();
                                $scope.paymentForm.commit();
                            }
                        });
                    }
                } else {
                    parentKeysArray.forEach(function(keyObj, keyIndex) {
                        postMethodDynamicFormArray.push({ 'name': keyObj, 'value': '[{ "TotalSecurePlusModel" : {' + String(tempParentJson[keyObj]) + '} }]' });
                        if (keyIndex == parentKeysLength) {
                            $scope.postMethodFormContent.length = 0;
                            $scope.postMethodFormContent = postMethodDynamicFormArray;
                            $scope.$apply();
                            $scope.paymentForm.commit();
                        }
                    });
                }

            }
        };

        //buyScreenTemplate function will be called when if condition will be true
        $scope.buyScreenTemplate = function(selectedProduct) {
            if ($scope.isMonthlyPremium) {
                //$scope.premiumTypeMonthOrAnnual="Monthly";
                selectedProduct.premiumTypeMonthOrAnnual = "Monthly Premium";
                selectedProduct.monthlyFinalPremium = selectedProduct.monthlyFinalPremium;
            }
            if ($scope.isQuarterlyPremium) {
                //$scope.premiumTypeMonthOrAnnual="Annual";
                selectedProduct.premiumTypeMonthOrAnnual = "Annual Premium";
                selectedProduct.annualPremium = selectedProduct.annualPremium;
            }
            if ($scope.isHalfAnnualPremium) {
                //$scope.premiumTypeMonthOrAnnual="Annual";
                selectedProduct.premiumTypeMonthOrAnnual = "Half Annual Premium";
                selectedProduct.annualPremium = selectedProduct.annualPremium;
            }
            if ($scope.isAnnualPremium) {
                //$scope.premiumTypeMonthOrAnnual="Annual";
                selectedProduct.premiumTypeMonthOrAnnual = "Annual Premium";
                selectedProduct.annualPremium = selectedProduct.annualPremium;
            }
            localStorageService.set("criticalIllnessSelectedProduct", selectedProduct);
            $scope.selectedProduct = selectedProduct;
            if ($scope.modalCompare) {
                $scope.modalCompare = false;
            }

            var buyScreenParam = {};
            buyScreenParam.documentType = proposalScreenConfig;
            buyScreenParam.businessLineId = localStorageService.get("selectedBusinessLineId");
            buyScreenParam.carrierId = selectedProduct.carrierId;
            buyScreenParam.productId = selectedProduct.productId;
            buyScreenParam.QUOTE_ID = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID");
            //code added to hide voluntary Deductable discount if it is 0 or not applicable for carrier from Confirm Buy screen
            $rootScope.voluntaryDeductable = 0;
            $rootScope.antiTheftDeviceAmount = 0;
            for (var i = 0; i < selectedProduct.discountList.length; i++) {
                if (selectedProduct.discountList[i].type == "Voluntary Deductible Discount" && selectedProduct.discountList[i].discountAmount > 0) {
                    $rootScope.voluntaryDeductable = selectedProduct.discountList[i].discountAmount;
                }
                if (selectedProduct.discountList[i].type == "Anti-Theft Discount" && selectedProduct.discountList[i].discountAmount > 0) {
                    $rootScope.antiTheftDeviceAmount = selectedProduct.discountList[i].discountAmount;
                }
            }

            getDocUsingParam(RestAPI, productDataReader, buyScreenParam, function(buyScreen) {
                if (buyScreen.responseCode == $scope.globalLabel.responseCode.success) {

                    localStorageService.set("buyScreen", buyScreen.data);
                    $scope.productValidation = buyScreen.data.validation;
                    if (!$scope.resultCnfrmBuyFlag) {
                        if ($scope.quoteParam.policyType == "renew")
                            $scope.setRangePrevPolicyStartDate();
                        $scope.modalResultCnfrmBuy = true;
                    }

                    $rootScope.loading = true;
                    $location.path('/buyAssurance');
                    // Need to check
                    getListFromDB(RestAPI, "", criticalIllnessCarrier, findAppConfig, function(criticalIllnessCarrierList) {
                        if (criticalIllnessCarrierList.responseCode == $scope.globalLabel.responseCode.success) {
                            localStorageService.set("criticalIllnessCarrierList", criticalIllnessCarrierList.data);
                            var docId = $scope.globalLabel.documentType.buyScreen + "-" + localStorageService.get("selectedBusinessLineId");

                        } else {
                            $location.path('/quote');
                            $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
                        }
                    });
                } else {
                    $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
                }
            });
        };

        //Edelweiss tokio life proposal form logic modified by - Prathamesh waghmare
        $scope.buyProduct = function(selectedProduct) {
            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
            var redirectionURLDocId = $scope.globalLabel.documentType.criticalIllnessProductBuyConfig + '-' + selectedProduct.carrierId + '-' + selectedProduct.productId;
            getDocUsingId(RestAPI, redirectionURLDocId, function(criticalIllnessProductBuyConfigDetails) {
                if (criticalIllnessProductBuyConfigDetails)
                    $scope.criticalIllnessProductBuyConfigDetails = criticalIllnessProductBuyConfigDetails;
            });
            $timeout(function() {
                $scope.buyProductProxy(selectedProduct);
            }, 500);
        };

        $rootScope.signout = function() {
            $rootScope.userLoginStatus = false;
            var userLoginInfo = {};
            userLoginInfo.username = "";
            userLoginInfo.status = $rootScope.userLoginStatus;
            localStorageService.set("userLoginInfo", userLoginInfo);
            $location.path("/quote");
        }

        $scope.missionCompled = function() {
            $rootScope.loading = false;
        };

        $scope.data = {};
        $scope.data.group1 = 1;
        $scope.modalCompare = false;
        $scope.consolatedRiderList = [];
        $scope.consolatedDiscountList = [];
        $scope.toggleCompare = function() {
                var riderJson = {};
                angular.forEach($scope.selectedCarrier, function(quote) {
                    angular.forEach(quote.riders, function(rider) {
                        if (riderJson[rider.riderId] == null) {
                            $scope.consolatedRiderList.push(rider);
                            riderJson[rider.riderId] = rider.riderName;
                        }
                    })
                });
                var discountJson = {};
                angular.forEach($scope.selectedCarrier, function(quote) {
                    angular.forEach(quote.discountList, function(discount) {
                        if (discountJson[discount.type] == null && discount.discountAmount != null && discount.discountAmount != 0) {
                            $scope.consolatedDiscountList.push(discount);
                            discountJson[discount.type] = discount.type;
                        }
                    })
                });
                $scope.modalCompare = true;
                $scope.hideModal = function() {
                    $scope.modalCompare = false;
                }
            }
            // Card View/Compare Policy view implemented for life quote result - modification-0007
        $scope.cardView = true;
        $scope.compareView = false;
        $scope.showCompareBtn = true;
        $scope.showCardBtn = true;
        $scope.disableSort = false;
        //newFunction for compare
        $scope.compareViewClick = function() {
            var riderJson = {};
            $scope.consolatedRiderList = [];
            $scope.consolatedDiscountList = [];
            angular.forEach($rootScope.ciQuoteResult, function(quote) {
                angular.forEach(quote.riders, function(rider) {
                    if (riderJson[rider.riderId] == null) {
                        $scope.consolatedRiderList.push(rider);
                        riderJson[rider.riderId] = rider.riderName;
                    }
                });
            });
            var discountJson = {};
            angular.forEach($rootScope.ciQuoteResult, function(quote) {
                angular.forEach(quote.discountList, function(discount) {
                    //if(discountJson[discount.type] == null && discount.discountAmount != null && !discount.discountAmount === 0)
                    if (discountJson[discount.type] == null && discount.discountAmount != null) {
                        $scope.consolatedDiscountList.push(discount);
                        discountJson[discount.type] = discount.type;
                    }
                });
            });
            $scope.disableSort = false;
            $scope.dataLoaded = true;
            $scope.slickLoaded = true;
            $scope.cardView = true;
            $scope.compareView = false;
            $scope.showCompareBtn = true;
            $scope.showCardBtn = true;
            //$scope.modalCompare = true;
            //$scope.hideModal= function(){
            //$scope.modalCompare = false;
            //};
        };
        $scope.cardViewClick = function() {
            $scope.dataLoaded = true;
            $scope.slickLoaded = true;
            $scope.cardView = false;
            $scope.compareView = true;
            $scope.showCompareBtn = true;
            $scope.showCardBtn = true;
            $scope.disableSort = true;

        };
        //added for default selection of monthly premium
        $scope.premiumChoice = true;


        /*$scope.findRider = function(riderId,riders){
        	var returnvalue = "NA";
        	for(var count=0; count < riders.length; count++)
        	{
        		if(riderId == riders[count].riderId && riders[count].totalValue != 0 && riders[count].totalValue != null)
        		{
        			returnvalue = riders[count].totalValue;
        			break;
        		}
        	}
        	return returnvalue;
        }*/
        $scope.findRider = function(riderId, riders) {
            var returnvalue = "Not Available";
            if (riders == undefined) {
                returnvalue = "-";
                return returnvalue;
            }
            for (var count = 0; count < riders.length; count++) {
                if (riderId == riders[count].riderId && riders[count].riderPremiumAmount != 0 && riders[count].riderPremiumAmount != null) {
                    returnvalue = riders[count].riderPremiumAmount;
                    break;
                } else if (riderId == riders[count].riderId && riders[count].riderType == "Included" && riders[count].riderPremiumAmount == 0 || riders[count].riderPremiumAmount == undefined) {
                    returnvalue = riders[count].riderType;
                    break;
                } else if (riderId == riders[count].riderId && riders[count].riderType == "Not Available" && riders[count].riderPremiumAmount == 0) {
                    returnvalue = "0";
                    break;
                }
            }
            if (returnvalue == "-1")
                returnvalue = "-";
            return returnvalue;
        };

        $scope.findDiscount = function(type, discounts) {
            var returnvalue = "NA";
            for (var count = 0; count < discounts.length; count++) {
                if (type == discounts[count].type && discounts[count].discountAmount != 0 && discounts[count].discountAmount != null) {
                    returnvalue = discounts[count].discountAmount;
                    break;
                }
            }
            return returnvalue;
        }

        //below piece of code written for showing and hiding rider and payout menu as pop-up. 
        $scope.showRiderModal = function() {
            $scope.riderDetailsModal = !$scope.riderDetailsModal;
        }

        // $scope.showPayoutOptionModal= function(){
        // 	$scope.payoutOptionModal=!$scope.payoutOptionModal;	
        // }
        // $scope.hidePayoutOptionModal= function(){
        // 	$scope.resetPayoutDetails();
        // 	$scope.payoutOptionModal=false;	
        // }

        $scope.openCriticalIllnessPopup = function(selectedTab, _data) {
            //console.log('in openCriticalIllnessPopup selectedTab',selectedTab);
            //console.log('in openCriticalIllnessPopup _data',_data);
            $scope.criticalIllnessProductToBeAddedInCart = _data;
            $rootScope.selectedTabCriticalIllness = selectedTab;
            //console.log('$scope.premiumModalCriticalIllness',$scope.premiumModalCriticalIllness);
            $scope.premiumModalCriticalIllness = !$scope.premiumModalCriticalIllness;

        }
        $scope.hidePremiumModalCriticalIllness = function() {
            $scope.premiumModalCriticalIllness = false;
        }

        $scope.hideRiderDetailsModal = function() {
                $scope.resetRiderDetails();
                $scope.riderDetailsModal = false;
            }
            // Hide the footer navigation links.
        $(".activateFooter").hide();
        $(".activateHeader").hide();

        // Function created to get Product Features and update Quote Result Object on Quote Calculation - modification-0008
        function getAllProductFeatures(selectedProduct, productFetchStatus) {
            var variableReplaceArray = [];
            var productFeatureJSON = {};
            var customFeaturesJSON = {};

            $rootScope.consolidatedBenefitsList = [];
            $rootScope.consolidatedSavingsList = [];
            $rootScope.consolidatedFlexibilityList = [];

            productFeatureJSON.documentType = $scope.globalLabel.documentType.criticalIllnessProduct;
            productFeatureJSON.carrierId = selectedProduct.carrierId;
            productFeatureJSON.productId = selectedProduct.productId;
            productFeatureJSON.businessLineId = 1;

            var selectedCarrierId = selectedProduct.carrierId;
            var selectedProductId = selectedProduct.productId;

            for (var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++) {
                if (selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
                    $scope.brochureUrl = wp_path + $rootScope.carrierDetails.brochureList[i].brochureUrl;
            }

            variableReplaceArray.push({
                'id': '{{sumInsured}}',
                'value': Math.round(selectedProduct.sumInsured)
            });
            // variableReplaceArray.push({
            // 	'id': '{{monthlyPayout}}',
            // 	'value': selectedProduct.monthlyPayout
            // });
            variableReplaceArray.push({
                'id': '{{policyTerm}}',
                'value': selectedProduct.policyTerm
            });

            if (productFetchStatus) {
                RestAPI.invoke($scope.globalLabel.transactionName.getProductFeatures, productFeatureJSON).then(function(callback) {
                    var scopeVariableName = 'productFeaturesList_' + selectedCarrierId + '_' + selectedProductId;
                    var productFeatureJSONName = 'productFeaturesJSON_' + selectedCarrierId + '_' + selectedProductId;

                    $rootScope[productFeatureJSONName] = {};
                    $scope[scopeVariableName] = callback.data[0].Features;
                    for (var i = 0; i < variableReplaceArray.length; i++) {
                        if (p365Includes($scope[scopeVariableName][1].details, variableReplaceArray[i].id)) {
                            $scope[scopeVariableName][1].details = $scope[scopeVariableName][1].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
                        }
                    }
                    for (var i = 0; i < $scope[scopeVariableName].length; i++) {
                        $rootScope[productFeatureJSONName][callback.data[0].Features[i].titleForCompareView] = callback.data[0].Features[i].detailsForCompareView;
                    }
                    selectedProduct.features = $rootScope[productFeatureJSONName];

                    for (var i = 0; i < $scope[scopeVariableName].length; i++) {
                        if ($scope[scopeVariableName][i].featureCategory == "Benefits" && $scope[scopeVariableName][i].compareView == "Y") {
                            if ($rootScope.consolidatedBenefitsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1) {
                                $rootScope.consolidatedBenefitsList.push($scope[scopeVariableName][i].titleForCompareView);
                            }
                        }
                        if ($scope[scopeVariableName][i].featureCategory == "Savings" && $scope[scopeVariableName][i].compareView == "Y") {
                            if ($rootScope.consolidatedSavingsList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1) {
                                $rootScope.consolidatedSavingsList.push($scope[scopeVariableName][i].titleForCompareView);
                            }
                        }
                        if ($scope[scopeVariableName][i].featureCategory == "Flexibility" && $scope[scopeVariableName][i].compareView == "Y") {
                            if ($rootScope.consolidatedFlexibilityList.indexOf($scope[scopeVariableName][i].titleForCompareView) === -1) {
                                $rootScope.consolidatedFlexibilityList.push($scope[scopeVariableName][i].titleForCompareView);
                            }
                        }
                    }
                });
            }
        }
    }]);