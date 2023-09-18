/*
 * Description	: This is the controller file for life quote result.
 * Author		: Yogesh Shisode
 * Date			: 13 June 2016
 * Modification :
 * 
 * 
 * Sr.Id	   Date				Description																						Search ID			Modified By
 *  1		16-06-2016		Dropdown list inserted for sortTypes.															modification-0001		Yogesh S.
 *  2		16-06-2016		Function created to sort quote result.															modification-0002		Yogesh S.
 *  3		16-06-2016		Setting application labels to avoid static assignment.											modification-0003		Yogesh S.
 *  4		29-07-2016		Function created to get default list of input paramters from DB.								modification-0004		Yogesh S.
 *  5		08-08-2016		Directive added to view tooltip content using ng-repeat.										modification-0005		Yogesh S.
 *  6		20-07-2017		Function created to update maturity list depends upon the age selected by user.					modification-0006		Yogesh S.
 *  7		03-08-2017		Card View/Compare Policy view implemented for life quote result									modification-0007		Parul Jain
 *	8		14-08-2017		Function created to get Product Features and update Quote Result Object	on Quote Calculation	modification-0008		Parul Jain
 * */
var jsonEncodeCarrierList = [];
'use strict';
angular.module('lifeResult', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages', 'checklist-model'])
    .controller('lifeResultController', ['$scope', '$rootScope', '$filter', '$location', '$http', '$window', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$sce', function($scope, $rootScope, $filter, $location, $http, $window, RestAPI, localStorageService, $timeout, $interval, $sce) {


        // Setting application labels to avoid static assignment.	-	modification-0003
        var applicationLabels = localStorageService.get("applicationLabels");
        $scope.globalLabel = applicationLabels.globalLabels;
        $scope.p365Labels = insLifeQuoteLabels;
        $rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbResult) };
        $rootScope.title = $scope.p365Labels.policies365Title.lifeResultQuote;

        $scope.quote = {};
        $scope.payoutDetails = {};

        //for wordpress
        if ($rootScope.wordPressEnabled) {
            $scope.rippleColor = '';
        } else {
            $scope.rippleColor = '#f8a201';
        }

        //for wordpress
        $scope.lifeInputSectionHTML = wp_path + 'buy/life/html/LifeInputSection.html';
        $scope.lifeRiderSectionHTML = wp_path + 'buy/life/html/LifeRiderSection.html';
        $scope.lifePayoutSectionHTML = wp_path + 'buy/life/html/LifePayoutSection.html';
        $scope.lifeShareEmailSectionHTML = wp_path + 'buy/life/html/LifeShareEmailSection.html'
        $scope.lifeFeaturesTemplate = wp_path + "buy/common/html/featureBenefitsLife.html";
        $scope.lifePremiumTemplate = wp_path + "buy/common/html/lifePremiumTemplate.html";

        //for olark
        // olarkCustomParam(localStorageService.get("LIFE_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), false);
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
        $scope.payoutOptionModal = false;
        $scope.riderDetailsModal = false;

        //added for professional journey-commenting for temporary purpose as to hide monthly premium
        $rootScope.isAnnualPremium = $scope.isAnnualPremium;

        //added to collapse & expand inputSection for ipos
        $scope.lifeInputSection = false;
        $scope.payoutInputSection = false;
        $scope.riderInputSection = false;

        $scope.quoteUserInfo = {};
        $scope.quoteUserInfo.messageId = '';
        $scope.quoteUserInfo.termsCondition = true;

        if($rootScope.isLifeLanding){
            $scope.lifeAffilatedLeadId = $sce.trustAsResourceUrl("https://tracking.icubeswire.co/aff_a?offer_id=1951&adv_sub1= "+messageIDVar+"&adv_sub2="+localStorageService.get("quoteUserInfo").mobileNumber);
            console.log('inside health landing $scope.healthAffilatedLeadId is: ',$scope.healthAffilatedLeadId);
            }

        //for agencyPortal
        $scope.modalView = false;

        if ($location.path() == "/PBLifeResult") {
            $scope.PBLifeInputSection = wp_path + 'buy/common/html/PBHTML/PBLifeInputSection.html';
            $scope.PBLifeRidersSection = wp_path + 'buy/common/html/PBHTML/PBLifeRiderSection.html';
            $scope.PBLifeBestResultSection = wp_path + 'buy/common/html/PBHTML/PBLifeBestResultSection.html';
            $scope.inputSectionEnabled = true;
            $scope.ridersSectionEnabled = false;
            $scope.resultSectionEnabled = false;
            $scope.commonInfo = localStorageService.get("professionalQuoteParams").commonInfo;
        }

        // if ($rootScope.agencyPortalEnabled) {
        //     var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
        //     $scope.createLeadAP = $location.search().createLead;
        //     if (quoteUserInfoCookie && $scope.createLeadAP == 'true') {
        //         messageIDVar = '';
        //         $scope.modalView = true;
        //     } else if (!quoteUserInfoCookie || $scope.createLeadAP == 'true') {
        //         $scope.modalView = true;
        //     }
        // }
        if ($rootScope.agencyPortalEnabled) {
            const quoteUserInfo = JSON.parse(localStorage.getItem('quoteUserInfo'));
            console.log('quoteUserInfo in agency life result is::', quoteUserInfo);
            if (quoteUserInfo) {
                $scope.quoteUserInfo = quoteUserInfo;
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
            }
            //added by gauri for mautic application for agency portal specific
            if (imauticAutomation == true) {
                imatLifeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
            }

        }

        // Fetch lead id from url for iQuote+.
        if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
            if ($location.search().messageId) {
                messageIDVar = $location.search().messageId;
                // $scope.quoteUserInfo.messageId = $location.search().messageId;
            }
            console.log('quote user info in life result step 1 is::', localStorageService.get("quoteUserInfo"));
            if (String($location.search().leaddetails) != "undefined") {
                var leaddetails = JSON.parse($location.search().leaddetails);
                if (!leaddetails.messageId) {
                    leaddetails.messageId = $location.search().messageId;
                }
                console.log('leaddetails in life result is::', leaddetails);
                localStorageService.set("quoteUserInfo", leaddetails);
            }
            //added to collapse & expand inputSection for ipos
            $scope.lifeInputSection = true;
            $scope.payoutInputSection = true;
            $scope.riderInputSection = true;
        }
        $scope.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED");
        if (localStorageService.get("PROF_QUOTE_ID_ENCRYPTED")) {
            $scope.UNIQUE_PROF_QUOTE_ID_ENCRYPTED = localStorageService.get("PROF_QUOTE_ID_ENCRYPTED");
        }



        /*below functions for expand-collapse of DOM for ipos */
        $scope.showPersonalDetails = function() {
            $scope.lifeInputSection = !$scope.lifeInputSection;
        }

        $scope.showRiderDetails = function() {
            $scope.riderInputSection = !$scope.riderInputSection;
        }

        $scope.showPayoutDetails = function() {
                $scope.payoutInputSection = !$scope.payoutInputSection;
            }
            /*end of ipos function for expand-collapse of DOM 	*/

        $scope.backToResultScreen = function() {
            if ($rootScope.wordPressEnabled) {
                $rootScope.isBackButtonPressed = true;
            }
            if ($rootScope.isProfessionalJourneySelected) {
                $location.path("/professionalJourneyResult");
            } else {
                $location.path("/PBQuote");
            }
        };

        var carrierRiderList = angular.copy($rootScope.carrierDetails);

        // var docId = $scope.p365Labels.documentType.quoteResultScreen + "-" + localStorageService.get("selectedBusinessLineId");
        // getDocUsingId(RestAPI, docId, function (tooltipContent) {
        // 	$scope.tooltipContent = tooltipContent.toolTips;
        //removed tooltip calls
        $scope.declaration = function() {
            $rootScope.loading = false;
            $scope.selectedAddOnCovers = [];
            $scope.sortByElement = [];
            $scope.selectedCarrier = [];

            $scope.riderFeatureLength = 0;

            $scope.expose = false;
            $scope.tempStatus = true;

            var setFlag = false;
            var setExposeFlag = true;
            var setExposeReportFlag = true;

            $scope.quoteParam = localStorageService.get("lifeQuoteInputParamaters").quoteParam;
            $scope.personalDetails = localStorageService.get("lifePersonalDetails");

            $scope.insuranceCompanyList = {};
            $scope.insuranceCompanyList.selectedInsuranceCompany = [];

            // To get the rider list applicable for this user.
            $scope.addOnCovers = localStorageService.get("addOnCoverForLife");
            $scope.personalDetails.selectedAddOnCovers = $scope.personalDetails.selectedAddOnCovers == undefined ? [] : $scope.personalDetails.selectedAddOnCovers;
            $scope.selectedAddOnCoversCopy = angular.copy($scope.personalDetails.selectedAddOnCovers);

            $scope.sortType = sortTypesLifeGeneric[0];
            $scope.sortTypes = sortTypesLifeGeneric;

            $scope.relationType = relationLifeQuoteGeneric;
            $scope.healthConditionType = healthConditionGeneric;
            $scope.annualIncomesRange = annualIncomesGeneric;
            $scope.riskLevels = riskLevelsGeneric;
            $scope.annualIncomesRange = annualIncomesGeneric;
            $scope.genderType = genderTypeGeneric;
            $scope.tobaccoAddictionStatus = tobaccoAddictionStatusGeneric;
            $scope.maturityAgeList = getAgeList($scope.personalDetails.minMaturityAge, $scope.personalDetails.maxMaturityAge);
            $scope.ageList = getAgeList($scope.personalDetails.minInsuredAge, $scope.personalDetails.maxInsuredAge);
            $scope.comparePoliciesDisplayList = comparePoliciesDisplayValues;

            // Added by Parul Jain
            $scope.compareLifePoliciesDisplayList = compareLifePoliciesDisplayValues;

            $scope.payoutOptions = lifePayoutOptionsGeneric;

            $scope.payoutDetails.payoutOption = $scope.payoutOptions[0];
            $scope.payoutName = $scope.payoutOptions[0].name;
            $scope.selectedSortOption = $scope.sortTypes[0];
            //$scope.payoutId = $scope.payoutOptions[0].id;
            if ($scope.quoteParam) {
                for (var i = 0; i < $scope.payoutOptions.length; i++) {
                    if ($scope.payoutOptions[i].id == $scope.quoteParam.payoutId) {
                        $scope.payoutDetails.payoutOption = $scope.payoutOptions[i];
                        break;
                    }
                }
            } else {
                $scope.payoutId = $scope.payoutOptions[0].id;
            }

            //commenting with douts as maturityAge should be insured upto age entered by users on load
            //$scope.personalDetails.maturityAge = lifematurityAgeConstant;

            $scope.personalDetails.dateOfBirth = calcDOBFromAge($scope.quoteParam.age);
            $scope.personAge = $scope.quoteParam.age;

            //added for reset
            $scope.quoteParamCopy = angular.copy($scope.quoteParam);
            $scope.personalDetailsCopy = angular.copy($scope.personalDetails);

            if ($rootScope.wordPressEnabled) {
                $scope.selectedPayoutOptionCopy = angular.copy($scope.payoutDetails.payoutOption);
            }
        }


        $scope.init = function() {

            // 	if($scope.quoteParam.frequency){
            // 	if($scope.quoteParam.frequency = "Annual"){
            // 		$scope.isAnnualPremium =true;
            // 		$scope.isMonthlyPremium =false;
            // 	}else{
            // 		$scope.isAnnualPremium =false;
            // 		$scope.isMonthlyPremium =true;
            // 	}
            // }

            $scope.togglePayoutChange = function(selectedPayout) {
                $scope.payoutId = selectedPayout.id;
                $scope.payoutName = selectedPayout.name;
                $scope.singleClickLifeQuote();
            }

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


            $scope.sendEmail = function () {

                var index = -1;
                for (var i = 0; i < $scope.EmailChoices.length; i++) {
                    if ($scope.EmailChoices[i].username == '' || $scope.EmailChoices[i].username == undefined) {
                        continue;
                    }
                    //code for encode
                    var encodeQuote = localStorageService.get("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED");
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


                    $scope.EmailChoices[i].funcType = "SHARELIFEQUOTE";
                    $scope.EmailChoices[i].isBCCRequired = 'Y';
                    $scope.EmailChoices[i].paramMap = {};
                    /*$scope.EmailChoices[i].paramMap.docId=String(localStorageService.get("LIFE_UNIQUE_QUOTE_ID"));*/
                    $scope.EmailChoices[i].paramMap.docId = String($rootScope.encryptedQuote_Id);
                    $scope.EmailChoices[i].paramMap.LOB = String($rootScope.encryptedLOB);
                    $scope.EmailChoices[i].paramMap.userId = String($rootScope.encryptedEmail);
                    $scope.EmailChoices[i].paramMap.carriers = String($rootScope.encryptedCarriers);
                    $scope.EmailChoices[i].paramMap.monthlyPremiumOption = String($rootScope.encryptedMonthlyPremium);
                    $scope.EmailChoices[i].paramMap.selectedPolicyType = "LIFE";
                    var body = {};
                    body.longURL = shareQuoteLink + $scope.EmailChoices[i].paramMap.docId + "&LOB=" + $scope.EmailChoices[i].paramMap.LOB + "&userId=" + $scope.EmailChoices[i].paramMap.userId + "&carriers=" + $scope.EmailChoices[i].paramMap.carriers;
                    $http({ method: 'POST', url: getShortURLLink, data: body }).
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

                            if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                index++;
                                request.body = arr[index];
                                request.body.paramMap.url = shortURLResponse.data.shortURL;
                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                    success(function (callback) {
                                        var emailResponse = JSON.parse(callback);
                                        var receipientNum = $scope.EmailChoices.length;
                                        if (i == receipientNum) {
                                            if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {

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
          


            $scope.showShareEmailModal = function() {
                if (localStorageService.get("quoteUserInfo") && localStorageService.get("quoteUserInfo").emailId) {

                    if ($scope.crmEmailSend || $rootScope.wordPressEnabled) {
                        //Added by gauri for mautic application				
                        if (imauticAutomation == true) {
                            imatShareQuote(localStorageService, $scope, 'ShareQuote');
                            $scope.shareEmailModal = false;
                            $scope.modalEmailView = true;
                            $scope.crmEmailSend = false;
                        }else{
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



            $scope.sendQuotesByEmail = function() {
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

            // Create lead with available user information by calling webservice for share email.
            $scope.leadCreationUserInfo = function() {
                var userInfoWithQuoteParam = {};
                $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                userInfoWithQuoteParam.quoteParam = localStorageService.get("lifeQuoteInputParamaters");
                userInfoWithQuoteParam.contactInfo = $scope.quoteUserInfo;
                if ($rootScope.agencyPortalEnabled) {
                    const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                    userInfoWithQuoteParam.contactInfo.createLeadStatus = false;
                    userInfoWithQuoteParam.requestSource = sourceOrigin;
                    $location.search('createLead', 'false');
                    if(localdata){
                    userInfoWithQuoteParam.userName = localdata.username;
                    userInfoWithQuoteParam.agencyId = localdata.agencyId;
                    }
                } else {
                    $scope.quoteUserInfo.emailId = $rootScope.decryptedEmailId;
                    userInfoWithQuoteParam.requestSource = sourceOrigin;
                }

                //	Webservice call for lead creation.	-	modification-0010
                if ($scope.quoteUserInfo != null) {
                    if (($scope.quoteUserInfo.messageId == '') || ($scope.quoteUserInfoForm.$dirty)) {
                        RestAPI.invoke($scope.p365Labels.transactionName.createLead, userInfoWithQuoteParam).then(function(callback) {
                            if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                messageIDVar = callback.data.messageId;
                                $scope.quoteUserInfo.messageId = messageIDVar;
                                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                                $scope.modalView = false;
                            }

                        });

                    } else {
                        messageIDVar = $scope.quoteUserInfo.messageId;
                    }
                }
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
                    $scope.isAnnualPremium = true;
                    $scope.premiumChoice = false;
                }
                if ($rootScope.selectedAddOnCovers != undefined) {
                    $scope.personalDetails.selectedAddOnCovers = $rootScope.selectedAddOnCovers;
                }
                angular.copy($scope.personalDetails.selectedAddOnCovers, $scope.selectedAddOnCoversCopy);
                for (var i = 0; i < $scope.payoutOptions.length; i++) {
                    if ($scope.payoutOptions[i].id == $scope.quoteParam.payoutId) {
                        $scope.payoutDetails.payoutOption = $scope.payoutOptions[i];
                        break;
                    }
                }
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

            $scope.updateRiders = function(rider) {
                var selectedRidersWithRequest = $scope.personalDetails.selectedAddOnCovers;
                var flag = -1;

                for (var i = 0; i < selectedRidersWithRequest.length; i++) {
                    if (selectedRidersWithRequest[i].riderId == rider.riderId)
                        flag = i;
                }

                if (flag > -1)
                    selectedRidersWithRequest.splice(flag, 1);
                else
                    selectedRidersWithRequest.push(rider);
                $scope.personalDetails.selectedAddOnCovers = selectedRidersWithRequest;
            }
            $rootScope.editForMobile = function() {
                $rootScope.showonEdit = "inline !important";
                $rootScope.hideonEdit = "none !important";
                $scope.flagforMobile = true;
            }
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
                        $scope.singleClickLifeQuote();
                    } else {
                        /*$scope.quote = localStorageService.get("lifeQuoteInputParamaters");
                        $scope.personalDetails = localStorageService.get("lifePersonalDetails");*/
                        angular.copy($scope.quoteParamCopy, $scope.quoteParam);
                        angular.copy($scope.personalDetailsCopy, $scope.personalDetails);
                        $scope.quoteLifeInputForm.lifeInputForm.$setPristine();
                        $scope.lifeInputForm = false;
                        $scope.editBtn = true;
                        $scope.cancelBtn = false;
                        $scope.submitBtn = false;
                    }
                }
            }

            // $scope.setfromController = true;
            // var setFlag = true;
            // $scope.submitReportBtn = false;
            // $scope.editReportBtn = true;
            // $scope.toggleReportChange = function(){
            // 	$('.thirdPane').addClass('opened');
            // 	$('.thirdPaneContent').show();
            // 	if($('.viewReportDiv').is(':visible') == true){
            // 		$(".modifyReportDiv").show();
            // 		$(".viewReportDiv").hide();
            // 		$scope.editReportBtn = false;
            // 		$scope.submitReportBtn = true;;
            // 		$scope.cancelReportBtn = true;
            // 		setFlag = false;
            // 	} else if($('.modifyReportDiv').is(':visible') == true){
            // 		$(".viewReportDiv").slideDown();
            // 		$(".modifyReportDiv").slideUp();
            // 		$scope.editReportBtn = true;
            // 		$scope.submitReportBtn = false;
            // 		$scope.cancelReportBtn = false;
            // 		setFlag = true;
            // 	}
            // }

            // Function created to sort quote result.	-	modification-0002
            // $scope.updateSort = function(sortOption) {
            //     $scope.activeSort = sortOption.key;
            //     $scope.selectedSortOption = sortOption;
            //     if (sortOption.key == 1) {
            //         $scope.sortKey = "annualPremium";
            //         $scope.sortReverse = false;
            //     } else if (sortOption.key == 2) {
            //         $scope.sortKey = "sumInsured";
            //         $scope.sortReverse = true;
            //     } else if (sortOption.key == 3) {
            //         $scope.sortKey = "insurerIndex";
            //         $scope.sortReverse = true;
            //     } else if (sortOption.key == 4) {
            //         $scope.sortKey = "ratingsList['8'][" + $scope.benefitFeatureRiskType.id + "]";
            //         $scope.sortReverse = true;
            //     } else if (sortOption.key == 5) {
            //         $scope.sortKey = "ratingsList['9'][" + $scope.flexibleFeatureRiskType.id + "]";
            //         $scope.sortReverse = true;
            //     } else if (sortOption.key == 6) {
            //         $scope.sortKey = "ratingsList['11'][" + $scope.savingFeatureRiskType.id + "]";
            //         $scope.sortReverse = true;
            //     } else if (sortOption.key == 7) {
            //         $scope.sortKey = "ratingsList['10'][" + $scope.eligibilityFeatureRiskType.id + "]";
            //         $scope.sortReverse = true;
            //     }

            //     $scope.toggleState();
            // }
            // $scope.updateSortOrder = function() {
            //     if ($scope.selectedSortOption.key == 1) {
            //         $scope.sortKey = "annualPremium";
            //     } else if ($scope.selectedSortOption.key == 2) {
            //         $scope.sortKey = "sumInsured";
            //     } else if ($scope.selectedSortOption.key == 3) {
            //         $scope.sortKey = "insurerIndex";
            //     } else if ($scope.selectedSortOption.key == 4) {
            //         $scope.sortKey = "ratingsList['8'][" + $scope.benefitFeatureRiskType.id + "]";
            //     } else if ($scope.selectedSortOption.key == 5) {
            //         $scope.sortKey = "ratingsList['9'][" + $scope.flexibleFeatureRiskType.id + "]";
            //     } else if ($scope.selectedSortOption.key == 6) {
            //         $scope.sortKey = "ratingsList['11'][" + $scope.savingFeatureRiskType.id + "]";
            //     } else if ($scope.selectedSortOption.key == 7) {
            //         $scope.sortKey = "ratingsList['10'][" + $scope.eligibilityFeatureRiskType.id + "]";
            //     }
            //     $scope.sortReverse = !$scope.sortReverse;
            // }

            $scope.getRiskLabel = function(riskType) {
                for (var i = 0; i < $scope.riskLevels.length; i++)
                    if ($scope.riskLevels[i].id == riskType)
                        return $scope.riskLevels[i];
            }

            // $scope.benefitFeatureRiskType = $scope.getRiskLabel($rootScope.lifeQuoteResult[0].risks['8']);
            // $scope.flexibleFeatureRiskType = $scope.getRiskLabel($rootScope.lifeQuoteResult[0].risks['9']);
            // $scope.eligibilityFeatureRiskType = $scope.getRiskLabel($rootScope.lifeQuoteResult[0].risks['10']);
            // $scope.savingFeatureRiskType = $scope.getRiskLabel($rootScope.lifeQuoteResult[0].risks['11']);

            // Function created to get default list of input paramters from DB.	-	modification-0004
            $scope.fetchDefaultInputParamaters = function(defaultInputParamCallback) {
                $scope.quoteParam = defaultLifeQuoteParam.quoteParam;
                $scope.personalDetails = defaultLifeQuoteParam.personalDetails;

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

            }

            //maturity age difference as 40 - uday
            $scope.calculateMaturityAgeGap = function() {
                    if ($scope.quoteParam.age >= 35) {
                        $scope.personalDetails.maturityAge = lifematurityAgeConstant;
                    } else {
                        $scope.personalDetails.maturityAge = $scope.quoteParam.age + 30;
                    }
                }
                //commenting since professional journey
                //$scope.calculateMaturityAgeGap();
                // Yogesh-20072017: As discussed with Uday, function created to update maturity list depends upon the age selected by user.	-	modification-0006

            $scope.updateMaturityAgeList = function() {
                // maturity age and the self age gap is made 40 if the age is less than 35, if age is greater than 35 the the max maturity of 75 is kept-uday
                $scope.calculateMaturityAgeGap();

                var minMaturityAge = $scope.quoteParam.age + 5;

                if ($scope.personalDetails.maturityAge < minMaturityAge) {
                    $scope.personalDetails.maturityAge = minMaturityAge;
                }

                $scope.maturityAgeList = getAgeList(minMaturityAge, $scope.personalDetails.maxMaturityAge);
            }

            $scope.errorRespCounter = true;
            $scope.errorMessage = function(errorMsg) {
                if ($scope.errorRespCounter && (String($rootScope.lifeQuoteResult) == "undefined" || $rootScope.lifeQuoteResult.length == 0)) {
                    $scope.errorRespCounter = false;
                    $scope.errorRespMsg = errorMsg;
                    $rootScope.progressBarStatus = false;
                    $rootScope.viewOptionDisabled = true;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.loading = false;
                } else if ($rootScope.lifeQuoteResult.length > 0) {
                    $rootScope.progressBarStatus = false;
                    $rootScope.viewOptionDisabled = false;
                    $rootScope.tabSelectionStatus = true;
                    $rootScope.loading = false;
                }
            }


            //filter for best premium
            $scope.customFilterLife = function() {
                $scope.netPremiumTotalLife = 0;
                $scope.netPremiumAverageLife = 0;
                $scope.netPremiumMaxLife = 0;
                $scope.proffesionalRatingLife = 0;

                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalLife += $rootScope.lifeQuoteResult[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageLife = Number(($scope.netPremiumTotalLife / $rootScope.lifeQuoteResult.length).toFixed(5));
                }
                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    $rootScope.lifeQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageLife / $rootScope.lifeQuoteResult[i].premiumRatio).toFixed(5));
                    if ($rootScope.lifeQuoteResult[i].netPremiumMax > $scope.netPremiumMaxLife) {
                        $scope.netPremiumMaxLife = $rootScope.lifeQuoteResult[i].netPremiumMax;
                    }
                }
                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    $rootScope.lifeQuoteResult[i].netPremiumMean = Number((($rootScope.lifeQuoteResult[i].netPremiumMax / $scope.netPremiumMaxLife) * 5).toFixed(1));
                    $rootScope.lifeQuoteResult[i].proffesionalRating = ($rootScope.lifeQuoteResult[i].netPremiumMean * 0.4) +
                        ($rootScope.lifeQuoteResult[i].claimIndex * 0.2) +
                        ($rootScope.lifeQuoteResult[i].benefitIndex * 0.2) +
                        ($rootScope.lifeQuoteResult[i].insurerIndex * 0.2);


                }
                $rootScope.lifeQuoteResult = $filter('orderBy')($rootScope.lifeQuoteResult, 'proffesionalRating');
                $rootScope.lifeQuoteResult = $rootScope.lifeQuoteResult;
                $scope.sortReverse = true;
                return true;

            }

            $scope.customFilterLifeSelectedProduct = function() {
                $scope.netPremiumTotalLife = 0;
                $scope.netPremiumAverageLife = 0;
                $scope.netPremiumMaxLife = 0;
                $scope.proffesionalRatingLife = 0;

                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    //Get Total of premium
                    $scope.netPremiumTotalLife += $rootScope.lifeQuoteResult[i].premiumRatio;
                    //Get avg of premium
                    $scope.netPremiumAverageLife = Number(($scope.netPremiumTotalLife / $rootScope.lifeQuoteResult.length).toFixed(5));
                }
                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    $rootScope.lifeQuoteResult[i].netPremiumMax = Number(($scope.netPremiumAverageLife / $rootScope.lifeQuoteResult[i].premiumRatio).toFixed(5));
                    if ($rootScope.lifeQuoteResult[i].netPremiumMax > $scope.netPremiumMaxLife) {
                        $scope.netPremiumMaxLife = $rootScope.lifeQuoteResult[i].netPremiumMax;
                    }
                }
                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    $rootScope.lifeQuoteResult[i].netPremiumMean = Number((($rootScope.lifeQuoteResult[i].netPremiumMax / $scope.netPremiumMaxLife) * 5).toFixed(1));
                    $rootScope.lifeQuoteResult[i].proffesionalRating = ($rootScope.lifeQuoteResult[i].netPremiumMean * 0.4) +
                        ($rootScope.lifeQuoteResult[i].claimIndex * 0.2) +
                        ($rootScope.lifeQuoteResult[i].benefitIndex * 0.2) +
                        ($rootScope.lifeQuoteResult[i].insurerIndex * 0.2);


                }
                var carrierAllReadyAdded = false;
                for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                    if (localStorageService.get("lifeProductToBeAddedInCart").carrierId == $rootScope.lifeQuoteResult[i].carrierId && localStorageService.get("lifeProductToBeAddedInCart").productId == $rootScope.lifeQuoteResult[i].productId) {
                        console.log('localStorageService.get("lifeProductToBeAddedInCart in step 3:', $rootScope.lifeQuoteResult[i]);
                        //hard coded as it has one value
                        $scope.selectProduct($rootScope.lifeQuoteResult[i], false);
                        $rootScope.lifeQuoteResult[0] = $rootScope.lifeQuoteResult[i];
                        var carrierAllReadyAdded = true;
                        $scope.isGotLifeQuotes = true;
                        break;
                    }
                }
                if (!carrierAllReadyAdded) {
                    console.log('inside life custom filter');
                    $scope.customFilterLife();
                    $scope.isGotLifeQuotes = true;
                    //$rootScope.healthQuote = $rootScope.lifeQuoteResult[0];
                }
            }
            $scope.processResult = function() {
                $rootScope.progressBarStatus = false;
                $rootScope.viewOptionDisabled = false;
                $rootScope.tabSelectionStatus = true;
                $rootScope.loading = false;
                //commented as Add to cart is removed
                // $scope.customFilterLifeSelectedProduct();
                //$scope.selectProduct($rootScope.lifeQuoteResult[0], false);
                //$rootScope.lifeQuoteResult = $filter('orderBy')($rootScope.lifeQuoteResult, 'dailyPremium');
                /*for(var j = 0; j < $rootScope.lifeQuoteResult.length; j++){
                	if(j==$rootScope.lifeQuoteResult.length -1 ){
                		$timeout(function(){
                			$scope.dataLoaded=true;
                			//$scope.slickLoaded=true;
                		},1000);
                	}
                }*/

            }

            $scope.displaySelecteRidersModal = false;
            $scope.showSelectedRiders = function() {
                $scope.displaySelecteRidersModal = true;
            }
            $scope.hideSelectedRiders = function() {
                $scope.displaySelecteRidersModal = false;
            }

            $scope.isMinPremium = function(annualPremiumValue, carrierIDValue) {
                var min = $rootScope.lifeQuoteResult[0].annualPremium;

                for (var i = 0; i <= $rootScope.lifeQuoteResult.length - 1; i++) {
                    var carrierIdMin = $rootScope.lifeQuoteResult[i].carrierId;
                    if (Number($rootScope.lifeQuoteResult[i].annualPremium) < min) {
                        min = $rootScope.lifeQuoteResult[i].annualPremium;
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

            // $scope.displayRibbon = function() {


            //     $scope.isMaxIndex = function(insurerIndex, sumInsured, annualPremium, carrierSelID) {
            //         var maxSel = (annualPremium / (insurerIndex * sumInsured)) * 1000;

            //         var insurerIndex0 = $rootScope.lifeQuoteResult[0].insurerIndex;
            //         var sumInsured0 = $rootScope.lifeQuoteResult[0].sumInsured;
            //         var annualPremium0 = $rootScope.lifeQuoteResult[0].annualPremium;
            //         var max = (annualPremium0 / (sumInsured0 * insurerIndex0)) * 1000;

            //         for (var i = 0; i <= $rootScope.lifeQuoteResult.length - 1; i++) {
            //             var insurerIndexI = $rootScope.lifeQuoteResult[i].insurerIndex;
            //             var sumInsuredI = $rootScope.lifeQuoteResult[i].sumInsured;
            //             var annualPremiumI = $rootScope.lifeQuoteResult[i].annualPremium;
            //             var carrierIdI = $rootScope.lifeQuoteResult[i].carrierId;

            //             var maxI = (annualPremiumI / (sumInsuredI * insurerIndexI)) * 1000;

            //             if (Number(maxI) < max) {
            //                 max = maxI;
            //                 carrierSelID = carrierIdI;

            //             }
            //         }
            //         if (max === maxSel) {
            //             $scope.selCarrierId = carrierSelID;
            //             return true;
            //         } else {
            //             return false;
            //         }
            //     }
            // }
            // $scope.displayRibbon();

            //function created to reset payout details for wordpress p365
            $scope.resetPayoutDetails = function() {
                    if ($scope.selectedPayoutOptionCopy) {
                        $scope.payoutDetails.payoutOption = $scope.selectedPayoutOptionCopy;
                        for (var i = 0; i < $scope.payoutOptions.length; i++) {
                            if ($scope.payoutDetails.payoutOption.id == $scope.payoutOptions[i].id) {
                                $scope.payoutDetails.payoutOption = $scope.payoutOptions[i];
                                break;
                            }
                        }
                    } else {
                        $scope.payoutDetails.payoutOption = [];
                    }
                    $scope.payoutOptionModal = false;
                }
                //function created to reset rider details for wordpress p365
            $scope.resetRiderDetails = function() {
                    if ($scope.selectedAddOnCoversCopy) {
                        angular.copy($scope.selectedAddOnCoversCopy, $scope.personalDetails.selectedAddOnCovers);
                    } else {
                        $scope.personalDetails.selectedAddOnCovers = [];
                    }
                    $scope.riderDetailsModal = false;
                }
                //function created to display carrier if premium > 0.
            $scope.validatePremium = function(data) {
                if ($scope.isMonthlyPremium) {
                    if (Number(data.monthlyFinalPremium) > 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else if ($scope.isAnnualPremium) {
                    if (Number(data.annualPremium) > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            };

            $scope.singleClickLifeQuote = function() {
                //setTimeout(function(){
                if ($scope.quoteLifeInputForm.$dirty || $scope.quoteLifeInputForm.lifeInputForm.$dirty) {
                    setTimeout(function() {

                        if ($scope.flagforMobile) {
                            $rootScope.showonEdit = "none !important";
                            $rootScope.hideonEdit = "inline !important";
                            $scope.flagforMobile = false;
                        }

                        $scope.quoteLifeInputForm.$setPristine();
                        $scope.quoteParam.riders = [];
                        selectedRiderListForLife($scope.addOnCovers, $scope.personalDetails.selectedAddOnCovers, $scope.quoteParam.riders, function() {
                            $scope.errorRespCounter = true;
                            $rootScope.loading = true;
                            $scope.dataLoaded = false;
                            $scope.payoutOptionModal = false;
                            $scope.riderDetailsModal = false;
                            $scope.isGotLifeQuotes = false;
                            //$scope.personalDetails.selectedAddOnCovers = $scope.personalDetails.selectedAddOnCovers;

                            $scope.quoteParam.documentType = $scope.p365Labels.documentType.quoteRequest;
                            $scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");
                            $scope.quoteParam.payoutId = $scope.payoutDetails.payoutOption.id;
                            $scope.quoteParam.sumInsured = $scope.personalDetails.sumInsuredObject.amount;
                            $scope.quoteParam.annualIncome = $scope.personalDetails.annualIncomeObject.annualIncome;
                            $scope.quoteParam.annualIncomeInterval = $scope.personalDetails.annualIncomeObject.annualIncomeInterval;
                            $scope.quoteParam.healthCondition = "Good";

                            if ($scope.isAnnualPremium) {
                                $scope.quoteParam.frequency = "Annual";
                            } else {
                                $scope.quoteParam.frequency = "Monthly";
                            }
                            //for wordpress reset
                            if ($scope.personalDetails.selectedAddOnCovers.length > 0) {
                                $scope.selectedAddOnCoversCopy = angular.copy($scope.personalDetails.selectedAddOnCovers);
                            }

                            $scope.selectedPayoutOptionCopy = angular.copy($scope.payoutDetails.payoutOption);


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

                            if ($scope.quoteParam.riders.length == 0) {
                                $scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
                            }

                            if ($scope.personalDetails.selectedAddOnCovers.length <= 2) {
                                $scope.riderFeatureLength = 0;
                            } else if ($scope.personalDetails.selectedAddOnCovers.length == 3) {
                                $scope.riderFeatureLength = 1;
                            } else {
                                $scope.riderFeatureLength = 2;
                            }
                            $scope.quote.quoteParam = $scope.quoteParam;
                            $scope.quote.personalDetails = $scope.personalDetails;
                            $scope.quote.requestType = $scope.p365Labels.request.requestType;

                            // if($scope.commonInfo){
                            // 	$scope.quoteRequest= localStorageService.get("professionalQuoteParams");
                            // 	if($scope.quoteParam.tobacoAdicted=='N'){
                            // 		$scope.quoteRequest.commonInfo.smoking = false;
                            // 	}else{
                            // 		$scope.quoteRequest.commonInfo.smoking = true;
                            // 	}
                            // 	commonInfo = localStorageService.set("professionalQuoteParams",$scope.quoteRequest);
                            // }
                            localStorageService.set("lifeQuoteInputParamaters", $scope.quote);
                            localStorageService.set("lifePersonalDetails", $scope.personalDetails);

                            //added for reset
                            $scope.quoteParamCopy = angular.copy($scope.quoteParam);
                            $scope.personalDetailsCopy = angular.copy($scope.personalDetails);

                            if (localStorageService.get("PROF_QUOTE_ID")) {
                                $scope.quote.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                            }
                            if (campaignSource.utm_source) {
                                $scope.quote.utm_source = campaignSource.utm_source;
                            }
                            if (campaignSource.utm_medium) {
                                $scope.quote.utm_medium = campaignSource.utm_medium;
                            }
                            // Google Analytics Tracker added.
                            //analyticsTrackerSendData($scope.quote);
                            $scope.requestId = null;
                            $rootScope.lifeQuoteResult = [];
                            RestAPI.invoke($scope.p365Labels.getRequest.quoteLife, $scope.quote).then(function(callback) {
                                $rootScope.lifeQuoteRequest = [];
                                if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                    $rootScope.loading = false;
                                    $scope.dataLoaded = true;
                                    //$scope.slickLoaded=false;
                                    $scope.responseCodeList = [];

                                    $scope.requestId = callback.QUOTE_ID;

                                    localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.requestId);
                                    $rootScope.lifeQuoteRequest = callback.data;
                                    $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId
                                    localStorageService.set("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
                                    //added by gauri for mautic application
                                    $scope.quoteUserInfo = localStorageService.get('quoteUserInfo');
                                    $scope.professionalParam = localStorageService.get("professionalQuoteParams");
                                    console.log('newly added varibale', $scope.professionalParam);

                                    if (imauticAutomation == true) {
                                        imatLifeLeadQuoteInfo(localStorageService, $scope, 'ViewQuote');
                                    }
                                    if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0) {
                                        $rootScope.lifeQuoteResult.length = 0;
                                    }
                                    //for olark
                                    // olarkCustomParam(localStorageService.get("LIFE_UNIQUE_QUOTE_ID"), localStorageService.get("selectedBusinessLineId"), localStorageService.get("quoteUserInfo"), false);
                                    angular.forEach($rootScope.lifeQuoteRequest, function(obj, i) {
                                        var request = {};
                                        var header = {};

                                        header.messageId = messageIDVar;
                                        header.campaignID = campaignIDVar;
                                        header.source = sourceOrigin;
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

                                        $http({
                                            method: 'POST',
                                            url: getQuoteCalcLink,
                                            data: request
                                        }).
                                        success(function(callback, status) {
                                            var lifeQuoteResponse = JSON.parse(callback);
                                            if (lifeQuoteResponse.QUOTE_ID == $scope.requestId) {
                                                $scope.responseCodeList.push(lifeQuoteResponse.responseCode);
                                                if (lifeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                    lifeQuoteResponse.data.quotes[0].dailyPremium = Math.round(lifeQuoteResponse.data.quotes[0].annualPremium / 365);
                                                    lifeQuoteResponse.data.quotes[0].insuranceCompany = JSON.parse(lifeQuoteResponse.data.quotes[0].insuranceCompany);

                                                    $rootScope.carrierDetails = angular.copy(carrierRiderList);
                                                    for (var j = 0; j < $rootScope.carrierDetails.riderList.length; j++) {
                                                        if ($rootScope.carrierDetails.riderList[j].carrierId == lifeQuoteResponse.data.quotes[0].carrierId &&
                                                            $rootScope.carrierDetails.riderList[j].productId == lifeQuoteResponse.data.quotes[0].productId) {
                                                            lifeQuoteResponse.data.quotes[0].riders = $rootScope.carrierDetails.riderList[j].riders;
                                                        }
                                                    }

                                                    for (var k = 0; k < lifeQuoteResponse.data.quotes[0].riderList.length; k++) {
                                                        for (var l = 0; l < lifeQuoteResponse.data.quotes[0].riders.length; l++) {
                                                            if (lifeQuoteResponse.data.quotes[0].riderList[k].riderId == lifeQuoteResponse.data.quotes[0].riders[l].riderId) {
                                                                lifeQuoteResponse.data.quotes[0].riders[l] = lifeQuoteResponse.data.quotes[0].riderList[k];
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    for (var m = 0; m < lifeQuoteResponse.data.quotes[0].riders.length; m++) {
                                                        if (lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'At Additional Cost') {
                                                            lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "additionalCost";
                                                            lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Additional Cost";
                                                        } else if (lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'Not Available') {
                                                            lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "notAvailable";
                                                            lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Not Available";
                                                        } else if (lifeQuoteResponse.data.quotes[0].riders[m].riderType == 'Included') {
                                                            lifeQuoteResponse.data.quotes[0].riders[m].riderImgPath = "included";
                                                            lifeQuoteResponse.data.quotes[0].riders[m].riderTooltipName = "Included";
                                                        }
                                                    }

                                                    for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
                                                        if ($rootScope.lifeQuoteRequest[i].messageId == lifeQuoteResponse.messageId) {
                                                            //alert("lifeQuoteResponse.data.quotes[0] : " + JSON.stringify(lifeQuoteResponse.data.quotes[0]));
                                                            $rootScope.lifeQuoteResult.push(lifeQuoteResponse.data.quotes[0]);
                                                            getAllProductFeatures(lifeQuoteResponse.data.quotes[0], true);
                                                            $rootScope.lifeQuoteRequest[i].status = 1;

                                                        }
                                                    }

                                                    $scope.processResult();
                                                } else {
                                                    for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
                                                        if ($rootScope.lifeQuoteRequest[i].messageId == lifeQuoteResponse.messageId) {
                                                            $rootScope.lifeQuoteRequest[i].status = 2;
                                                            //$rootScope.lifeQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                            //comments updated based on Uday
                                                            $rootScope.lifeQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                                        }
                                                    }
                                                }
                                            }
                                        }).
                                        error(function(data, status) {
                                            $scope.responseCodeList.push($scope.p365Labels.responseCode.systemError);
                                        });
                                    });

                                    $scope.$watch('responseCodeList', function(newValue, oldValue, scope) {
                                        //if($scope.responseCodeList.includes($scope.p365Labels.responseCode.success))
                                        if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success))
                                        /*$rootScope.loading = false;*/

                                            if ($scope.responseCodeList.length == $scope.lifeQuoteRequest.length) {
                                            /*$rootScope.loading = false;*/
                                            for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
                                                if ($rootScope.lifeQuoteRequest[i].status == 0) {
                                                    $rootScope.lifeQuoteRequest[i].status = 2;
                                                    //$rootScope.lifeQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                    $rootScope.lifeQuoteRequest[i].message = $sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg);
                                                }
                                            }
                                            //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
                                            if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.success)) {
                                                // This condition will satisfy only when at least one product is found in the quoteResponse array.
                                                //} else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
                                            } else if (p365Includes($scope.responseCodeList, $scope.p365Labels.responseCode.quoteNotAvailable)) {
                                                $scope.errorMessage($scope.p365Labels.validationMessages.productNotFoundMsg);
                                            } else {
                                                $scope.errorMessage($scope.p365Labels.validationMessages.generalisedErrMsg);
                                            }
                                        }
                                    }, true);
                                } else {
                                    $scope.responseCodeList = [];
                                    if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0)
                                        $rootScope.lifeQuoteResult.length = 0;

                                    $rootScope.lifeQuoteResult = [];

                                    // Yogesh-27092017- Error message not configured from webservice if we didnt found any products. So setting static error message.
                                    $scope.errorMessage($sce.trustAsHtml($scope.p365Labels.validationMessages.generalisedLifeErrMsg));
                                }
                            });
                        });
                        //  $scope.displayRibbon();
                    }, 100);
                } else {
                    $scope.payoutOptionModal = false;
                    $scope.riderDetailsModal = false;
                }
                //},100);
            }

            $scope.state = false;
            $scope.toggleState = function() {
                $scope.state = !$scope.state;
            };

            /*	// This piece of code will be called to store carrier specific buy quote links used for redirection.
            getDocUsingId(RestAPI, $scope.globalLabel.documentType.lifeProductBuyConfig, function(lifeProductBuyConfigDetails){
            	$scope.lifeProductBuyConfigDetails = lifeProductBuyConfigDetails;
            });*/

            // });
        }

        $scope.declaration();


        $scope.$watch(function() {
            return $rootScope.lifeQuoteResult;
        }, function() {
            $rootScope.lifeQuoteResult = $rootScope.lifeQuoteResult;
            //console.log('step000')
            if ($rootScope.lifeQuoteResult) {
                // console.log('step1')
                if ($rootScope.lifeQuoteResult.length > 0) {
                    // console.log('step2')
                    $scope.init();
                    //$scope.callForInit = true;
                }
            }
        }, true);

        //added to display section on "confirm" in professional journey
        $scope.confirmInput = function() {
            $scope.inputSectionEnabled = false;
            $scope.resultSectionEnabled = false;
            $scope.ridersSectionEnabled = true;
        }

        $scope.showEditInputSection = function() {
            $scope.inputSectionEnabled = true;
            $scope.resultSectionEnabled = false;
            $scope.ridersSectionEnabled = false;
        }
        $scope.backToRiderSection = function() {
            $scope.inputSectionEnabled = false;
            $scope.resultSectionEnabled = false;
            $scope.ridersSectionEnabled = true;
        }

        $scope.getProfessionalBestQuotes = function() {
            //$rootScope.loading = true;
            if (localStorageService.get("lifeProductToBeAddedInCart")) {
                $scope.productInCart = localStorageService.get("lifeProductToBeAddedInCart");
            }

            console.log('$scope.productInCart for life is:', $scope.productInCart);
            $scope.resultSectionEnabled = true;
            $scope.inputSectionEnabled = false;
            $scope.ridersSectionEnabled = false;
            //$scope.quoteHealthInputForm.$dirty = true;
            $scope.quoteLifeInputForm.$dirty = true;
            $scope.singleClickLifeQuote();
        }

        $scope.backToQuotes = function() {
            $location.path("/professionalJourneyResult");
        }

        $scope.getProductFeatures = function(selectedProduct, productFetchStatus) {
            var variableReplaceArray = [];
            var productFeatureJSON = {};
            productFeatureJSON.documentType = $scope.p365Labels.documentType.lifeProduct;
            productFeatureJSON.carrierId = selectedProduct.carrierId;
            productFeatureJSON.productId = selectedProduct.productId;
            productFeatureJSON.businessLineId = 1;

            for (var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++) {
                if (selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
                    $scope.brochureUrl = wp_path + $rootScope.carrierDetails.brochureList[i].brochureUrl;
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
                'value': $scope.quoteParam.policyTerm
            });

            if (productFetchStatus) {
                RestAPI.invoke($scope.p365Labels.transactionName.getProductFeatures, productFeatureJSON).then(function(callback) {
                    $scope.productFeaturesList = callback.data[0].Features;
                    for (var j = 0; j < $scope.productFeaturesList.length; j++) {
                        for (var i = 0; i < variableReplaceArray.length; i++) {
                            if (p365Includes($scope.productFeaturesList[j].details, variableReplaceArray[i].id)) {
                                $scope.productFeaturesList[j].details = $scope.productFeaturesList[j].details.replace(variableReplaceArray[i].id, variableReplaceArray[i].value);
                            }
                        }
                    }
                });
            }

            $scope.modelBeneFeatureLife = true;
        }

        $scope.modelBeneFeatureLife = false;
        $scope.closeBeneFeatureLife = function() {
            $scope.modelBeneFeatureLife = false;
        }


        $scope.buyProductProxy = function(selectedProduct) {
            //$scope.lifeProductBuyConfigDetails = undefined;
            var postMethodDynamicFormArray = [];
            var tempParentJson = {};
            var selectedRidersJson = {};
            $scope.postMethodFormContent = [];

            selectedProduct.riderList.forEach(function(riderObj) {
                selectedRidersJson[riderObj.riderName] = riderObj;
            });
            postMethodDynamicFormArray.length = 0;
            //var redirectionURLDocId = $scope.globalLabel.documentType.lifeProductBuyConfig + '-' + selectedProduct.carrierId + '-' + selectedProduct.productId;

            var buyProductDetails = { frequency: {} };
            //$scope.quoteParam.selectedPremiumAmt=selectedPremiumAmt;
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
                buyProductDetails.quoteResponse.frequency = "3"; // check lifeFrequencyGeneric in DropdownListManager.js
            }
            if ($scope.isAnnualPremium) {
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

            var buyQuoteURL = $scope.lifeProductBuyConfigDetails.quoteurl;
            var buyQuoteMethod = $scope.lifeProductBuyConfigDetails.method;
            var buyQuoteURLParamList = $scope.lifeProductBuyConfigDetails.paramList;
            var buyQuoteURLParams = "?";
            var buyProductPlan = $scope.lifeProductBuyConfigDetails.planName;

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
                                } else if (buyQuoteURLParamList[i].definedValueStatus == 'integer') {
                                    buyQuoteURLParams += buyQuoteURLParamList[i].cname + "=" + buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] + "&";
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
                                    postMethodDynamicFormArray.push({ 'name': buyQuoteURLParamList[i].cname, 'value': buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] });
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
                                    if (buyQuoteURLParamList[i].isPayout)
                                        tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + buyQuoteURLParamList[i].definedValue[String($scope.payoutOptions[selectedProduct.payoutId].id)] + '", ';
                                    else
                                        tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + buyQuoteURLParamList[i].definedValue[buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname]] + '", ';
                                } else if (selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRider)
                                    tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + selectedRidersJson[buyQuoteURLParamList[i].pname].riderSumAssured + '", ';
                                else if (!selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRider)
                                    tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "0", ';
                                else if (selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRiderStatus) {
                                    tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "true", ';
                                } else if (!selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRiderStatus)
                                    tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "false", ';
                                else {
                                    tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname] + '", ';
                                }
                            }
                            if (buyQuoteURLParamList[i].definedValueStatus === 'date') {
                                var pdate = buyProductDetails[buyQuoteURLParamList[i].parentNode][buyQuoteURLParamList[i].pname];
                                var dateformat = buyQuoteURLParamList[i].definedValue["format"];
                                var newFormattedDate = dateFormater(pdate, dateformat);
                                tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : "' + newFormattedDate + '", ';
                            }
                            if (buyQuoteURLParamList[i].definedValueStatus === 'integer')
                                if (selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRider)
                                    tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : ' + selectedRidersJson[buyQuoteURLParamList[i].pname].riderSumAssured + ', ';
                                else if (!selectedRidersJson.hasOwnProperty(buyQuoteURLParamList[i].pname) && buyQuoteURLParamList[i].isRider)
                                tempParentJson[buyQuoteURLParamList[i].parentElement] += '"' + buyQuoteURLParamList[i].cname + '" : 0, ';
                            else
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
            if ($scope.isAnnualPremium) {
                //$scope.premiumTypeMonthOrAnnual="Annual";
                selectedProduct.premiumTypeMonthOrAnnual = "Annual Premium";
                selectedProduct.annualPremium = selectedProduct.annualPremium;
            }
            localStorageService.set("lifeSelectedProduct", selectedProduct);
            $scope.selectedProduct = selectedProduct;
            if ($scope.modalCompare) {
                $scope.modalCompare = false;
            }

            var buyScreenParam = {};
            buyScreenParam.documentType = proposalScreenConfig;
            buyScreenParam.businessLineId = localStorageService.get("selectedBusinessLineId");
            buyScreenParam.carrierId = selectedProduct.carrierId;
            buyScreenParam.productId = selectedProduct.productId;
            buyScreenParam.QUOTE_ID = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
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
                if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {

                    localStorageService.set("buyScreen", buyScreen.data);
                    $scope.productValidation = buyScreen.data.validation;
                    if (!$scope.resultCnfrmBuyFlag) {
                        if ($scope.quoteParam.policyType == "renew")
                            $scope.setRangePrevPolicyStartDate();
                        $scope.modalResultCnfrmBuy = true;
                    }

                    $rootScope.loading = true;
                    $location.path('/buyAssurance');

                    getListFromDB(RestAPI, "", lifeCarrier, findAppConfig, function(lifeCarrierList) {
                        if (lifeCarrierList.responseCode == $scope.p365Labels.responseCode.success) {
                            localStorageService.set("lifeCarrierList", lifeCarrierList.data);
                            var docId = $scope.p365Labels.documentType.buyScreen + "-" + localStorageService.get("selectedBusinessLineId");

                        } else {
                            $location.path('/quote');
                            $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                        }
                    });
                } else {
                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                }
            });
        };

        //Edelweiss tokio life proposal form logic modified by - Prathamesh waghmare
        $scope.buyProduct = function(selectedProduct) {

            // if user comes form Dashboard  to renew policy   
            if (localStorageService.get("renewPolicyDetails")) {
                var renewPolicyDetails = localStorageService.get("renewPolicyDetails");
                if (localStorageService.get("LIFE_UNIQUE_QUOTE_ID") == renewPolicyDetails.QUOTE_ID) {
                    $location.path("/proposalresdata").search({ proposalId: renewPolicyDetails.encryptedQuoteId, LOB: 1 });
                }
            }

            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");

            if (selectedProduct.carrierId == 9) {
                //Kotak Life proposal Form will get called
                $scope.buyScreenTemplate(selectedProduct);
            } else {
                // RedirectionURL logic modified by - Shrutarshi Saha

                //$scope.lifeProductBuyConfigDetails = undefined;
                var redirectionURLDocId = $scope.p365Labels.documentType.lifeProductBuyConfig + '-' + selectedProduct.carrierId + '-' + selectedProduct.productId;

                getDocUsingId(RestAPI, redirectionURLDocId, function(lifeProductBuyConfigDetails) {
                    //if(lifeProductBuyConfigDetails.responseCode == $scope.globalLabel.responseCode.success)
                    setTimeout(function() {
                        if (lifeProductBuyConfigDetails) {
                            $scope.lifeProductBuyConfigDetails = lifeProductBuyConfigDetails;
                            if (!$scope.$$phase) {
                                $scope.buyProductProxy(selectedProduct);
                            }
                        } else {
                            $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.generalisedErrMsg, "Ok");
                        }
                    }, 100);
                });
                /*$timeout(function(){
                	//$scope.buyProductProxy(selectedProduct);
                }, 500);*/
            }

            //added by gauri for mautic application
            if (imauticAutomation == true) {
                imatBuyClicked(localStorageService, $scope, 'BuyClicked');
            }
        };

        $scope.selectProduct = function(selectedProduct, _redirectTOResult) {
            _redirectTOResult = (_redirectTOResult == false) ? _redirectTOResult : true;
            if (_redirectTOResult) {
                var QUOTE_ID = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
                console.log('QUOTE_ID', QUOTE_ID);
                console.log('localStorageService.get("LIFE_UNIQUE_QUOTE_ID")', selectedProduct);
                updateSelectedProduct(RestAPI, QUOTE_ID, selectedProduct, function(updatedProductCallback) {
                    console.log("_updatedProduct : ", updatedProductCallback);
                    if (updatedProductCallback.data) {
                        var updatedProduct = updatedProductCallback.data;
                        if (updatedProduct.selectedCarrier && updatedProduct.selectedProduct) {
                            $rootScope.selectedCarrierIdForLife = updatedProduct.selectedCarrier;
                            $rootScope.selectedProductIdForLife = updatedProduct.selectedProduct;
                        }
                        $location.path('/professionalJourneyResult');
                    }

                });
            }
        }

        // $scope.selectProduct = function (_selectedProduct, _redirectTOResult) {
        // 	console.log('inside select product function');
        // 	_redirectTOResult = (_redirectTOResult == false) ? _redirectTOResult : true;
        // 	localStorageService.set("updateProdcutInCartFlag", false);
        // 	localStorageService.set("lifeProductToBeAddedInCart", _selectedProduct);
        // 	if (_redirectTOResult) {
        // 		$location.path('/professionalJourneyResult');
        // 	}
        // }

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
            angular.forEach($rootScope.lifeQuoteResult, function(quote) {
                angular.forEach(quote.riders, function(rider) {
                    if (riderJson[rider.riderId] == null) {
                        $scope.consolatedRiderList.push(rider);
                        riderJson[rider.riderId] = rider.riderName;
                    }
                });
            });
            var discountJson = {};
            angular.forEach($rootScope.lifeQuoteResult, function(quote) {
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
        $scope.annualPremiumClick = function() {
            console.log('inside annualPremiumClick function');
            // Calculating the frequency whether it is annual or monthly for kotak 
            for (var i = 0; i < $rootScope.lifeQuoteResult.length; i++) {
                if ($rootScope.lifeQuoteResult[i].carrierId == 9) {
                    $scope.singleClickLifeQuote();
                    break;
                }
            }
            $scope.isMonthlyPremium = !$scope.isMonthlyPremium;
            $scope.isAnnualPremium = !$scope.isAnnualPremium;
            $rootScope.isAnnualPremium = $scope.isAnnualPremium;
        }

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

        $scope.showPayoutOptionModal = function() {
            $scope.payoutOptionModal = !$scope.payoutOptionModal;
        }
        $scope.hidePayoutOptionModal = function() {
            $scope.resetPayoutDetails();
            $scope.payoutOptionModal = false;
        }


        $scope.hideRiderDetailsModal = function() {
                $scope.resetRiderDetails();
                $scope.riderDetailsModal = false;
            }
            // Hide the footer navigation links.

        $scope.openLifePopup = function(selectedTab, _data) {
            $scope.lifeProductToBeAddedInCart = _data;
            $rootScope.selectedTabLife = selectedTab;
            $scope.premiumModalLife = !$scope.premiumModalLife;
        }
        $scope.hidePremiumModalLife = function() {
            $scope.premiumModalLife = false;
        }


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

            productFeatureJSON.documentType = $scope.p365Labels.documentType.lifeProduct;
            productFeatureJSON.carrierId = selectedProduct.carrierId;
            productFeatureJSON.productId = selectedProduct.productId;
            productFeatureJSON.businessLineId = 1;


            var selectedCarrierId = selectedProduct.carrierId;
            var selectedProductId = selectedProduct.productId;

            for (var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++) {
                if (selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId) {
                    if ($rootScope.carrierDetails.brochureList[i].productId) {
                        if (selectedProduct.productId == $rootScope.carrierDetails.brochureList[i].productId) {
                            $scope.brochureUrl = wp_path + $rootScope.carrierDetails.brochureList[i].brochureUrl;
                        }
                    } else {
                        $scope.brochureUrl = wp_path + $rootScope.carrierDetails.brochureList[i].brochureUrl;
                    }
                }
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

            if (productFetchStatus) {
                RestAPI.invoke($scope.p365Labels.transactionName.getProductFeatures, productFeatureJSON).then(function(callback) {
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