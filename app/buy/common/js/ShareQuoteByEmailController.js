/*
 * Description	: This is the controller file for Email.
 * Author		: Sandip Palodkar
 * Date			: 01 Aug 2017
 *
 * */
// var sourceOrigin;
// var organizationName;
angular.module('shareQuoteByEmail', [])
    .controller('ShareQuoteByEmailController', ['$scope', '$rootScope', '$location', '$filter', '$http', 'RestAPI', 'localStorageService', '$timeout', '$interval', '$mdDialog', '$window', '$sce',
        function($scope, $rootScope, $location, $filter, $http, RestAPI, localStorageService, $timeout, $interval, $mdDialog, $window, $sce) {

            $rootScope.loading = true;
            $rootScope.quoteCallStatus = 1;
            //setting flag true for quote user info pop-up
            $rootScope.flag = true;
            // $rootScope.isOlarked = false;
            $scope.cardView = true;
            $scope.quoteUserInfo = {};
            $scope.quoteUserInfo.messageId = '';
            $scope.makeNames = [];
            $scope.ncbList = ncbListGeneric;
            //flag added to give call only once to create lead function 
            $scope.checkForLead = false;

            var wp_path;
            // added for wordPress
                if (wordPressEnabled) {
                    wp_path = localized;
                    $rootScope.wordPressEnabled = wordPressEnabled;
                    $rootScope.wp_path = wp_path;
                    //localStorageService.set("wordPressEnabled", true);
                } else {
                    $rootScope.wp_path = '';
                    wp_path = '';
                    //localStorageService.set("wordPressEnabled", false);
                }
                if(!wordPressEnabled && pospEnabled){
                    wp_path = localized;
					$rootScope.pospEnabled = pospEnabled;
                    $rootScope.wp_path = wp_path;
                }

                if(baseEnvEnabled){
                    $rootScope.baseEnvEnabled = baseEnvEnabled;
                }

                if(agencyPortalEnabled){
                    $rootScope.agencyPortalEnabled = agencyPortalEnabled;
                }

            var urlPattern = $location.path();
            var redirectURL = $location.$$absUrl;

            $scope.tabs = [{ businessLineId: 3, url: $scope.carURL, className: 'carTab tabs wp_border32', name: "car", title: "Car", inputTitle: "car", tabImgId: 0 },
                { businessLineId: 2, url: $scope.bikeURL, className: 'bikeTab tabs wp_border32', name: "bike", title: "Bike", inputTitle: "bike", tabImgId: 1 },
                { businessLineId: 1, url: $scope.lifeURL, className: 'lifeTab tabs wp_border32', name: "life", title: "Life", inputTitle: "life", tabImgId: 2 },
                { businessLineId: 4, url: $scope.healthURL, className: 'healthTab tabs wp_border32', name: "health", title: "Health", inputTitle: "family", tabImgId: 3 },
                { businessLineId: 5, url: $scope.travelURL, className: 'travelTab tabs wp_border32', name: "travel", title: "Travel", inputTitle: "travel", tabImgId: 4 },
                { businessLineId: 6, url: $scope.criticalIllnessQuoteURL, className: 'criticalIllnessTab tabs wp_border32', name: "criticalIllness", title: "CI", inputTitle: "CI", tabImgId: 5, flagToShow: $rootScope.idepProdEnv },
                { businessLineId: 0, url: $scope.professionalJournyURL, className: 'healthTab tabs wp_border32', name: "Pofessional;Journy", title: "PJ", inputTitle: "PJ", tabImgId: 5, }
            ];



            // this block is added for iQuote to add organization name in req eg.NIBPL.
            if ($location.search().orgName) {
                organizationName = $location.search().orgName;

            }

            // Method to get RTO name based on city.	-	modification-0006
            $scope.getRegPlaceListUsingIPCity = function(cityName, callback) {
                if (cityName != null && String(cityName) != "undefined") {
                    return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + cityName).then(function(response) {
                        var rtoDetailsResponse = JSON.parse(response.data);
                        var rtoDetail = {};

                        if (rtoDetailsResponse.responseCode != $scope.globalLabel.responseCode.noRecordsFound) {
                            $rootScope.vehicleInfo = {};
                            $rootScope.vehicleInfo.selectedRegistrationObject = rtoDetailsResponse.data[0];
                            rtoDetail.rtoName = rtoDetailsResponse.data[0].display;
                            rtoDetail.rtoCity = rtoDetailsResponse.data[0].city;
                            rtoDetail.rtoState = rtoDetailsResponse.data[0].state;
                            rtoDetail.rtoObject = rtoDetailsResponse.data[0];
                            rtoDetail.rtoStatus = true;
                            getPincodeFromCity($http, rtoDetail, function(resultedRTOInfo) {
                                if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
                                    rtoDetail.rtoPincode = resultedRTOInfo.data[0].pincode;
                                } else {
                                    rtoDetail.rtoPincode = "";
                                }
                                localStorageService.set("registrationPlaceUsingIP", rtoDetail);
                            });
                        } else {
                            rtoDetail.rtoName = undefined;
                            rtoDetail.rtoCity = undefined;
                            rtoDetail.rtoState = undefined;
                            rtoDetail.rtoObject = undefined;
                            rtoDetail.rtoStatus = false;
                            localStorageService.set("registrationPlaceUsingIP", rtoDetail);
                        }
                        callback();
                    });
                } else {
                    var rtoDetail = {};
                    rtoDetail.rtoName = undefined;
                    rtoDetail.rtoCity = undefined;
                    rtoDetail.rtoState = undefined;
                    rtoDetail.rtoObject = undefined;
                    rtoDetail.rtoStatus = false;
                    localStorageService.set("registrationPlaceUsingIP", rtoDetail);
                    callback();
                }

            };

            $scope.updateReadEmailStatus = function() {
               
                

                // this condition is added for adding specific campaignID in case of renewal
                //removed  $location.search().campaign
                if ($location.search().isForRenewal) {
                    //			campaign_id = $location.search().campaign;
                    //			if(!campaign_id){
                    //				campaign_id = "46b3bf3d-52fb-38a7-40be-59cc9e8728800";
                    //			}
                    var request = {};
                    var mailIDVar, smsIDVar;
                    messageIDVar = $location.search().messageId;
                    mailIDVar = $location.search().mailId;
                    smsIDVar = $location.search().smsId;
                    request.isRenewal = true;
                    if (mailIDVar && !smsIDVar) {
                        request.mailId = mailIDVar;
                    } else if (smsIDVar && !mailIDVar) {
                        request.smsID = smsIDVar;
                    }

                    RestAPI.invoke("readEmailStatus", request).then(function(readStatus) {
                        if ($scope.globalLabel.responseCode.success) {
                    
                            
                            if (smsIDVar && $location.search().LOB) {
                                localStorageService.set("selectedBusinessLineId", $location.search().LOB);
                                // added because of wordpress pages in the URL
                                var businessLineName = "";

                                if($location.search().LOB == 2){
                                    businessLineName = "bike";
                                }
                                if($location.search().LOB == 3){
                                    businessLineName = "car";
                                }
                                
                                $window.location = window.location.protocol+"//"+window.location.hostname + "/"+ businessLineName;
				                // $window.location = shareQuoteLink + $scope.userPolicyData.renewPolicyDetails.QUOTE_ID + "&LOB=" + businessLineId;	
                                
                                // $location.path("/quote");
                            }
                        }
                    });


                }
            }

            /*Function is responsible for reading Proposal Doc*/
            $scope.getRenewalData = function() {
                $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
                if ($scope.selectedBusinessLineId == 1) {

                } else if ($scope.selectedBusinessLineId == 2) {
                    if ($location.search().proposalId) {
                        var request = {};
                        request.proposalId = $location.search().proposalId;
                        request.businessLineId = $scope.globalLabel.businessLineType.bike;
                        //call for getting previous policy related data

                        RestAPI.invoke("getRenewalData", request).then(function(callback) {

                            $scope.bikeProposalRes = callback;
                            //just updating vehicle info for previous policy related data
                            localStorageService.get("bikeQuoteInputParamaters").quoteParam.ncb = $scope.bikeProposalRes.insuranceDetails.ncb;
                            localStorageService.get("bikeQuoteInputParamaters").vehicleInfo.dateOfRegistration = $scope.bikeProposalRes.vehicleDetails.registrationDate;
                            localStorageService.get("bikeQuoteInputParamaters").vehicleInfo.PreviousPolicyExpiryDate = $scope.bikeProposalRes.insuranceDetails.prevPolicyEndDate;
                            localStorageService.get("bikeQuoteInputParamaters").vehicleInfo.PreviousPolicyStartDate = $scope.bikeProposalRes.insuranceDetails.prevPolicyStartDate;

                            $scope.quoteUserInfo.emailId = $scope.bikeProposalRes.proposerDetails.emailId;
                            $scope.quoteUserInfo.mobileNumber = $scope.bikeProposalRes.proposerDetails.mobileNumber;
                            $scope.quoteUserInfo.firstName = $scope.bikeProposalRes.proposerDetails.firstName;
                            $scope.quoteUserInfo.lastName = $scope.bikeProposalRes.proposerDetails.lastName;

                            
                            localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                            for (i = 0; i < $scope.ncbList.length; i++) {
                                if ($scope.bikeProposalRes.insuranceDetails.ncb == $scope.ncbList[i].value) {
                                    $scope.vehicleDetails.ncb = $scope.ncbList[i];
                                    break;
                                }
                            }
                            $scope.vehicleDetails.policyStatus = {};
                            var date_array = $scope.bikeProposalRes.insuranceDetails.prevPolicyEndDate.split("/");
                            var new_date = new Date(date_array[2], date_array[1], date_array[0]);
                            var current_date = new Date();
                            new_date.setHours(0, 0, 0, 0);
                            var date_one = new Date(policyStatusListGeneric[0].expiryDate.split('/')[1] + "/" + policyStatusListGeneric[0].expiryDate.split('/')[0] + "/" + policyStatusListGeneric[0].expiryDate.split('/')[2]);
                            var date_two = new Date(policyStatusListGeneric[1].expiryDate.split('/')[1] + "/" + policyStatusListGeneric[1].expiryDate.split('/')[0] + "/" + policyStatusListGeneric[1].expiryDate.split('/')[2]);
                            var date_three = new Date(policyStatusListGeneric[2].expiryDate.split('/')[1] + "/" + policyStatusListGeneric[2].expiryDate.split('/')[0] + "/" + policyStatusListGeneric[2].expiryDate.split('/')[2]);

                            if ((new_date < date_two) && (new_date > date_one)) {
                                localStorageService.get("bikeQuoteInputParamaters").vehicleInfo.previousPolicyExpired = 'Y';
                                $scope.vehicleDetails.policyStatus.key = 1;
                            } else if ((new_date < date_three) && (new_date > date_two) && (new_date < current_date)) {
                                localStorageService.get("bikeQuoteInputParamaters").vehicleInfo.previousPolicyExpired = 'Y';
                                $scope.vehicleDetails.policyStatus.key = 2;
                            } else {
                                localStorageService.get("bikeQuoteInputParamaters").vehicleInfo.previousPolicyExpired = 'N';
                                $scope.vehicleDetails.policyStatus.key = 3;
                            }
                            $scope.quote = localStorageService.get("bikeQuoteInputParamaters");
                            localStorageService.set("BikeProposalResForRenewal", $scope.bikeProposalRes);
                        });
                    } else {
                        
                    }
                } else if ($scope.selectedBusinessLineId == 3) {
                    if ($location.search().proposalId) {
                        var request = {};
                        request.proposalId = $location.search().proposalId;
                        request.businessLineId = $scope.globalLabel.businessLineType.car;
                        RestAPI.invoke("getRenewalData", request).then(function(callback) {
                            $scope.carProposalRes = callback;
                            localStorageService.get("carQuoteInputParamaters").quoteParam.ncb = $scope.carProposalRes.insuranceDetails.ncb;
                            localStorageService.get("carQuoteInputParamaters").vehicleInfo.dateOfRegistration = $scope.carProposalRes.vehicleDetails.registrationDate;
                            localStorageService.get("carQuoteInputParamaters").vehicleInfo.PreviousPolicyExpiryDate = $scope.carProposalRes.insuranceDetails.prevPolicyEndDate;
                            localStorageService.get("carQuoteInputParamaters").vehicleInfo.PreviousPolicyStartDate = $scope.carProposalRes.insuranceDetails.prevPolicyStartDate;

                            $scope.quoteUserInfo.emailId = $scope.carProposalRes.proposerDetails.emailId;
                            $scope.quoteUserInfo.mobileNumber = $scope.carProposalRes.proposerDetails.mobileNumber;
                            $scope.quoteUserInfo.firstName = $scope.carProposalRes.proposerDetails.firstName;
                            $scope.quoteUserInfo.lastName = $scope.carProposalRes.proposerDetails.lastName;
                            
                            
                            localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                            for (i = 0; i < $scope.ncbList.length; i++) {
                                if ($scope.carProposalRes.insuranceDetails.ncb == $scope.ncbList[i].value) {
                                    $scope.vehicleDetails.ncb = $scope.ncbList[i];
                                    break;
                                }
                            }
                            $scope.vehicleDetails.policyStatus = {};
                            var date_array = $scope.carProposalRes.insuranceDetails.prevPolicyEndDate.split("/");
                            var new_date = new Date(date_array[2], date_array[1], date_array[0]);
                            var current_date = new Date();
                            new_date.setHours(0, 0, 0, 0);
                            var date_one = new Date(policyStatusListGeneric[0].expiryDate.split('/')[1] + "/" + policyStatusListGeneric[0].expiryDate.split('/')[0] + "/" + policyStatusListGeneric[0].expiryDate.split('/')[2]);
                            var date_two = new Date(policyStatusListGeneric[1].expiryDate.split('/')[1] + "/" + policyStatusListGeneric[1].expiryDate.split('/')[0] + "/" + policyStatusListGeneric[1].expiryDate.split('/')[2]);
                            var date_three = new Date(policyStatusListGeneric[2].expiryDate.split('/')[1] + "/" + policyStatusListGeneric[2].expiryDate.split('/')[0] + "/" + policyStatusListGeneric[2].expiryDate.split('/')[2]);
                            if ((new_date < date_two) && (new_date > date_one)) {
                                localStorageService.get("carQuoteInputParamaters").vehicleInfo.previousPolicyExpired = 'Y';
                                $scope.vehicleDetails.policyStatus.key = 1;
                            } else if ((new_date < date_three) && (new_date > date_two) && (new_date < current_date)) {
                                localStorageService.get("carQuoteInputParamaters").vehicleInfo.previousPolicyExpired = 'Y';
                                $scope.vehicleDetails.policyStatus.key = 2;
                            } else {
                                localStorageService.get("carQuoteInputParamaters").vehicleInfo.previousPolicyExpired = 'N';
                                $scope.vehicleDetails.policyStatus.key = 3;
                            }
                            $scope.quote = localStorageService.get("carQuoteInputParamaters");
                            localStorageService.set("CarProposalResForRenewal", $scope.carProposalRes);
                        });
                    } else {
                        
                    }
                } else if ($scope.selectedBusinessLineId == 4) {
                    localStorageService.set("selectedBusinessLineId", $location.search().LOB);
                    $location.path("/quote");

                } else if ($scope.selectedBusinessLineId == 5) {
                    localStorageService.set("selectedBusinessLineId", $location.search().LOB);
                    $location.path("/quote");
                } else if ($scope.selectedBusinessLineId == 1) {
                    localStorageService.set("selectedBusinessLineId", $location.search().LOB);
                    $location.path("/quote");
                }
            }

            // Function created to redirect result screen.
            $scope.redirectResultScreen = function() {
                //logic for redirection to quote/result from landing pages
                var selectedTab;
                for (var i = 0; i < $scope.tabs.length; i++) {
                    if ($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId) {
                        selectedTab = $scope.tabs[i].name;
                        break;
                    }
                }
                // this code block is added for sorting ALL recieved quoteResults.
                if ($scope.selectedBusinessLineId == 1) {
                    $rootScope.lifeQuoteResult = $filter('orderBy')($rootScope.lifeQuoteResult, 'dailyPremium');
                } else if ($scope.selectedBusinessLineId == 2) {
                    $rootScope.bikeQuoteResult = $filter('orderBy')($rootScope.bikeQuoteResult, 'grossPremium');
                } else if ($scope.selectedBusinessLineId == 3) {
                    $rootScope.carQuoteResult = $filter('orderBy')($rootScope.carQuoteResult, 'grossPremium');
                } else if ($scope.selectedBusinessLineId == 4) {
                    $rootScope.healthQuoteResult = $filter('orderBy')($rootScope.healthQuoteResult, 'annualPremium');
                } else if ($scope.selectedBusinessLineId == 5) {

                } else if ($scope.selectedBusinessLineId == 6) {
                    $rootScope.ciQuoteResult = $filter('orderBy')($rootScope.ciQuoteResult, 'annualPremium');
                }
                $location.path("/" + selectedTab + 'Result');
            }






            // Create lead with available user information by calling webservice.	-	modification-0010
            $scope.leadCreationUserInfo = function() {
                
                if (getCookie("messageId") != '') {
                    
                    messageIDVar = getCookie("messageId");
                }

                $scope.disabledRedirectToResult = true;
                /*if isForRenewal flag is there in URL then lead request is not required to be send.*/
                if (!$location.search().isForRenewal) {
                    var userInfoWithQuoteParam = {};
                    $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");

                    // Quote user info added to central DB using DataWriter service.	-	modification-0002
                    //createLeadStatus flag added to create new lead for the user who completed buy journey(transaction till payment success) for any insurance type(car/bike/health/life)

                    if (!$scope.quoteUserInfo.createLeadStatus) {
                        $scope.quoteUserInfo.createLeadStatus = false;
                    }

                    $scope.quoteUserInfo.termsCondition = true;
                                        
                    localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                    if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.life) {
                        userInfoWithQuoteParam.quoteParam = localStorageService.get("lifeQuoteInputParamaters").quoteParam;
                        userInfoWithQuoteParam.personalDetails = localStorageService.get("lifeQuoteInputParamaters").personalDetails;
                        userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
                        userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                    } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.bike) {
                        userInfoWithQuoteParam.quoteParam = localStorageService.get("bikeQuoteInputParamaters").quoteParam;
                        userInfoWithQuoteParam.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
                        userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
                        userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                    } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.car) {
                        userInfoWithQuoteParam.quoteParam = localStorageService.get("carQuoteInputParamaters").quoteParam;
                        userInfoWithQuoteParam.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
                        userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
                        userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                    } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.health) {
                        userInfoWithQuoteParam.quoteParam = localStorageService.get("healthQuoteInputParamaters").quoteParam;
                        userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
                        userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                    } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.travel) {
                        var quoteParam = angular.copy(localStorageService.get("travelQuoteInputParamaters").quoteParam);
                        userInfoWithQuoteParam.quoteParam = quoteParam;
                        for (var i = 0; i < quoteParam.travellers.length; i++) {
                            if (quoteParam.travellers[i].relation == "Self") {
                                userInfoWithQuoteParam.quoteParam.gender = quoteParam.travellers[i].gender;
                                userInfoWithQuoteParam.quoteParam.age = quoteParam.travellers[i].age;
                                break;
                            } else {
                                userInfoWithQuoteParam.quoteParam.gender = quoteParam.travellers[0].gender;
                                userInfoWithQuoteParam.quoteParam.age = quoteParam.travellers[0].age;
                            }
                        }
                        var travelDetails = angular.copy(localStorageService.get("travelDetails"));
                        userInfoWithQuoteParam.travelDetails = travelDetails;
                        if (travelDetails.destinations.length == 1) {
                            userInfoWithQuoteParam.travelDetails.country = travelDetails.destinations[0].displayField;
                        } else if (travelDetails.destinations.length > 1) {
                            userInfoWithQuoteParam.travelDetails.country = "Multipal";
                        }
                        userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");
                        userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                    } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.criticalIllness) {
                        userInfoWithQuoteParam.quoteParam = localStorageService.get("criticalIllnessQuoteInputParamaters").quoteParam;
                        userInfoWithQuoteParam.personalDetails = localStorageService.get("criticalIllnessQuoteInputParamaters").personalDetails;
                        userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID");
                        userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                    }

                    userInfoWithQuoteParam.contactInfo = $scope.quoteUserInfo;
                    userInfoWithQuoteParam.requestSource = sourceOrigin;
                    if ($location.search().lead_id) {
                        userInfoWithQuoteParam.lead_id = $location.search().lead_id;
                    }

                    //	Webservice call for lead creation.	-	modification-0010
                    if (($scope.quoteUserInfo.createLeadStatus) || ($scope.quoteUserInfo != null && $scope.quoteUserInfo.messageId == '')) {

                        if ($rootScope.affilateUser) {
                            if (messageIDVar) {
                                userInfoWithQuoteParam.contactInfo.messageId = messageIDVar;
                            }
                        }

                        RestAPI.invoke($scope.globalLabel.transactionName.createLead, userInfoWithQuoteParam).then(function(callback) {

                            if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                messageIDVar = callback.data.messageId;
                                $scope.quoteUserInfo.messageId = messageIDVar;
                                $scope.quoteUserInfo.createLeadStatus = false;

                            }
                            //if(($rootScope.wordPressEnabled && $rootScope.resultCarrierId.length > 0)){				
                            $scope.redirectResultScreen();
                            //}
                        });

                    } else {
                        messageIDVar = $scope.quoteUserInfo.messageId;
                        //if(($rootScope.wordPressEnabled && $rootScope.resultCarrierId.length > 0)){
                        $scope.redirectResultScreen();
                        //}
                    }
                } else {
                    messageIDVar = $location.search().messageId;
                    $scope.quoteUserInfo.messageId = messageIDVar
                    $scope.quoteUserInfo.createLeadStatus = false
                        /*Directly redirecting to respective ResultScreen without lead creation*/
                    $scope.redirectResultScreen();
                }
            };

            $scope.checkForRedirect = function() {
                $scope.LOB = localStorageService.get("selectedBusinessLineId");
                if (Number($scope.LOB) == 1) {
                    if ($scope.lifeQuoteResponse.length > 0 && !$scope.checkForLead) {
                        //$rootScope.loading = false;
                        $scope.checkForLead = true;
                        
                        if($rootScope.agencyPortalEnabled){
                            $scope.redirectResultScreen();
                        }else{
                            $scope.leadCreationUserInfo();
                        }
                    }
                } else if (Number($scope.LOB) == 2) {
                    if ($scope.bikeQuoteResponse.length > 0 && !$scope.checkForLead) {
                        $scope.checkForLead = true;
                        //$rootScope.loading = false;		
                        
                        if($rootScope.agencyPortalEnabled){
                            $scope.redirectResultScreen();
                        }else{
                            $scope.leadCreationUserInfo();
                        }
                    }
                } else if (Number($scope.LOB) == 3) {
                    if ($scope.carQuoteResponse.length > 0 && !$scope.checkForLead) {
                        $scope.checkForLead = true;
                        //$rootScope.loading = false;
                        
                        if($rootScope.agencyPortalEnabled){
                            $scope.redirectResultScreen();
                        }else{
                            $scope.leadCreationUserInfo();
                        }
                    }
                } else if (Number($scope.LOB) == 4) {
                    if ($scope.healthQuoteResponse.length > 0 && !$scope.checkForLead) {
                        //$rootScope.loading = false;
                        $scope.checkForLead = true;
                        
                        if($rootScope.agencyPortalEnabled){
                            $scope.redirectResultScreen();
                        }else{
                            $scope.leadCreationUserInfo();
                        }
                    }
                } else if (Number($scope.LOB) == 5) {
                    //if($scope.travelQuoteResponse.length  > 0 && !$scope.checkForLead){
                    //$rootScope.loading = false;
                    //$location.path("/travelResult");
                    $scope.checkForLead = true;
                    
                    if($rootScope.agencyPortalEnabled){
                        $scope.redirectResultScreen();
                    }else{
                        $scope.leadCreationUserInfo();
                    }
                    //}
                } else if (Number($scope.LOB) == 6) {
                    if ($scope.ciQuoteResult.length > 0 && !$scope.checkForLead) {
                        $rootScope.loading = false;
                        $scope.checkForLead = true;
                        
                        if($rootScope.agencyPortalEnabled){
                            $scope.redirectResultScreen();
                        }else{
                            $scope.leadCreationUserInfo();
                        }
                    }
                }
            }

            // Function created to change policy status.
            $scope.changePolStatus = function() {
                
                if ($scope.selectedBusinessLineId == 3) {
                    if ($location.search().isForRenewal) {
                        //
                        if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
                            $scope.renewal = true;
                            /*$scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;*/
                        } else {
                            $scope.renewal = false;
                            $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                        }
                    } else if ($scope.vehicleInfo.PreviousPolicyExpiryDate == undefined || String($scope.vehicleInfo.PreviousPolicyExpiryDate) == "undefined") {
                        //
                        if ($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type) {
                            $scope.renewal = true;
                          //  $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;
                        } else {
                            $scope.renewal = false;
                            $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                        }
                    }
                 }
                //  else if ($scope.selectedBusinessLineId == 2) {
                //     if ($location.search().isForRenewal) {
                //         if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
                //             $scope.renewal = true;
                //             //$scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;
                //         } else {
                //             $scope.renewal = false;
                //             $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                //         }
                //     } else {
                //         if ($scope.vehicleDetails.insuranceType.type == $scope.bikeInsuranceTypes[1].type) {
                //             $scope.renewal = true;
                //            // $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.vehicleDetails.policyStatus.expiryDate;
                //         } else {
                //             $scope.renewal = false;
                //             $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                //         }
                //     }
                // //     if ($scope.vehicleDetails.policyStatus.key == 3)
                // //     $scope.vehicleDetails.previousPolicyExpired = "N";
                // // else
                // //     $scope.vehicleDetails.previousPolicyExpired = "Y";
                //  }
               
            };

            // Function created to change insurance type.
            $scope.alterRenewal = function() {
                
                if ($scope.selectedBusinessLineId == 3) {
                    if ($scope.vehicleDetails.insuranceType.type != $scope.carInsuranceTypes[1].type) {
                        $scope.polStatus = false;
                        $scope.renewal = false;
                        $scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
                        //$scope.vehicleInfo.regYear = $scope.yearList[0];
                    } else {
                        $scope.polStatus = true;
                        $scope.renewal = true;
                        $scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
                    }
                }
                //  else if ($scope.selectedBusinessLineId == 2) {
                //     if ($scope.vehicleDetails.insuranceType.type != $scope.bikeInsuranceTypes[1].type) {
                //         $scope.polStatus = false;
                //         $scope.renewal = false;
                //         $scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
                //         //$scope.vehicleInfo.regYear = $scope.yearList[0];
                //     } else {
                //         $scope.polStatus = true;
                //         $scope.renewal = true;
                //         $scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);
                //     }
                // }
                $scope.quoteParam.policyType = $scope.vehicleDetails.insuranceType.value;
                $scope.changePolStatus();
            };

            // Fetch RTO details using entered registration number.
            $scope.getRegNumber = function(registrationNumber) {
                if (String(registrationNumber) != "undefined") {
                    registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');

                    //flag for disabling chasis number,engine number,reg number
                    $rootScope.isregNumber = false;
                    $scope.vehicleDetails = {};
                    /*$scope.vehicleDetails.engineNumber='';
                    $scope.vehicleDetails.chassisNumber='';
                    $scope.vehicleDetails.isregNumberDisabled=true;
                    localStorageService.set("selectedCarDetails",$scope.vehicleDetails);*/

                    if ((registrationNumber.trim()).match(/^[a-zA-Z]{2}[0-9]{2}[a-zA-Z]{0,3}[0-9]{1,4}$/) && (registrationNumber.trim()).length <= 11 && (registrationNumber.trim()).length > 4) {
                        $rootScope.regNumStatus = false;
                        $rootScope.loading = true;
                        $rootScope.viewOptionDisabled = true;
                    
                        var request = {};
                        request.registrationNumber = registrationNumber.toUpperCase();
                        request.requestType = 'VEHICLERTOREQCONFIG';
                        RestAPI.invoke($scope.globalLabel.transactionName.getVehicleRTODetails, request).then(function(callback) {
                            if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                var vehiclertoDetails = callback.data;

                                if (vehiclertoDetails.uMake) {
                                    var vehicleName = vehiclertoDetails.uMake;
                                    var selectedVehicleName = vehicleName.trim();
                                    $scope.vehicleInfo.name = selectedVehicleName;
                                }
                                if (vehiclertoDetails.model) {
                                    var vehicleModel = vehiclertoDetails.model;
                                    var selectedVehicleModel = vehicleModel.trim();
                                    $scope.vehicleInfo.model = selectedVehicleModel;
                                }
                                if (vehiclertoDetails.fuelType) {
                                    var vehicleFuel = vehiclertoDetails.fuelType;
                                    var selectedVehicleFuel = vehicleFuel.trim();
                                    $scope.vehicleInfo.fuel = selectedVehicleFuel;

                                }
                                /*if($scope.vehicleDetails.insuranceType.type == $scope.carInsuranceTypes[1].type)
                                {*/
                                if (vehiclertoDetails.registrationYear) {
                                    var selectedRegYear = vehiclertoDetails.registrationYear;
                                    $scope.vehicleInfo.regYear = selectedRegYear.trim();
                                }

                                if (vehiclertoDetails.variant) {
                                    var selectedVariant = vehiclertoDetails.variant;
                                    selectedVehicleVariant = selectedVariant.trim();
                                    $scope.vehicleInfo.variant = selectedVehicleVariant;
                                }
                                if (vehiclertoDetails.variantId) {
                                    var selectedVariantId = vehiclertoDetails.variantId;
                                    $scope.vehicleInfo.variantId = selectedVariantId.trim();
                                }
                               
                                if (vehiclertoDetails.vechileIdentificationNumber) {
                                    $scope.vehicleDetails.chassisNumber = vehiclertoDetails.vechileIdentificationNumber;
                                }
                                if (vehiclertoDetails.engineNumber) {
                                    $scope.vehicleDetails.engineNumber = vehiclertoDetails.engineNumber;
                                }

                                var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
                                //$scope.shareQuoteTemplateFunction();
                                $scope.getRegPlaceListRTO(regNumber, registrationNumber);
                            } else {
                                /*if($rootScope.defaultRegYear)
                                {
                                	$scope.vehicleInfo.regYear=$rootScope.defaultRegYear;
                                }*/

                                var regNumber = registrationNumber.trim().slice(0, 2) + "" + registrationNumber.trim().slice(2, 4);
                                //$scope.shareQuoteTemplateFunction();
                                $scope.getRegPlaceListRTO(regNumber, registrationNumber);
                            }
                        });
                    } else {
                        $rootScope.regNumStatus = true;
                        $scope.shareQuoteTemplateFunction();
                    }
                } else {
                    $rootScope.regNumStatus = true;
                    $scope.shareQuoteTemplateFunction();
                }
            };

            // Method call to get default list form central DB.
            $scope.getRegPlaceListRTO = function(regNumber, registrationNumber) {
                if (regNumber.indexOf('-') > 0)
                    regNumber = regNumber.replace('-', '');
                return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + regNumber).then(function(callback) {
                    callback = JSON.parse(callback.data);
                    if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                        $rootScope.vehicleInfo.selectedRegistrationObject = callback.data[0];
                        $rootScope.vehicleDetails.registrationNumber = registrationNumber.trim();
                        $scope.vehicleInfo.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
                        //added new 
                        //localStorageService.set("registrationPlaceUsingIP",$rootScope.vehicleInfo.selectedRegistrationObject);

                        var rtoDetail = {};
                        rtoDetail.rtoName = $rootScope.vehicleInfo.selectedRegistrationObject.display;
                        rtoDetail.rtoCity = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                        rtoDetail.rtoState = $rootScope.vehicleInfo.selectedRegistrationObject.state;
                        rtoDetail.rtoObject = callback.data[0];
                        rtoDetail.cityStatus = true;
                        rtoDetail.rtoStatus = true;
                       
                        getPincodeFromCity($http, rtoDetail, function(resultedRTOInfo) {
                            if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
                                rtoDetail.pincode = resultedRTOInfo.data[0].pincode;

                                var getCity = {};
                                getCity.pincode = rtoDetail.pincode;
                                getCity.cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                                getCity.state = $rootScope.vehicleInfo.selectedRegistrationObject.state;
                                getCity.cityStatus = true;
                                localStorageService.set("cityDataFromIP", getCity);
                            } else {
                                $scope.pincode = "";
                            }
                            localStorageService.set("registrationPlaceUsingIP", rtoDetail);
                            $scope.vehicleInfo.registrationPlace = rtoDetail.rtoName;
                        });
                        
                        $scope.shareQuoteTemplateFunction();
                    } else {

                        $rootScope.loading = false;
                        $rootScope.regNumStatus = true;
                        $scope.shareQuoteTemplateFunction();
                    }
                });
            };
            // Function created to fetch default input parameters for bike.
            $scope.fetchDefaultBikeInputParamaters = function(defaultQuoteStatus, defaultInputParamCallback) {
                $scope.renewal = false;
                $scope.polStatus = false;

                if (defaultQuoteStatus) {
                    $scope.quoteParam = defaultBikeQuoteParam.quoteParam;
                    $scope.vehicleDetails = defaultBikeQuoteParam.vehicleDetails;
                    $scope.vehicleInfo = defaultBikeQuoteParam.vehicleInfo;
                   // $scope.PACoverDetails = defaultBikeQuoteParam.PACoverDetails;
                    // if (localStorageService.get("registrationPlaceUsingIP")) {
                    //     if (localStorageService.get("registrationPlaceUsingIP").rtoStatus == true) {
                    //         $scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                    //         $rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                    //         $rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
                    //     }
                    // }
                } else {
                    var bikeQuoteCookie = localStorageService.get("bikeQuoteInputParamaters");
                    var vehicleDetailsCookie = localStorageService.get("selectedBikeDetails");
                    if (bikeQuoteCookie.quoteParam) {
                        $scope.quoteParam = bikeQuoteCookie.quoteParam;
                    }
                    // if (localStorageService.get("BikePACoverDetails")) {
                    //     $scope.PACoverDetails = localStorageService.get("BikePACoverDetails");
                    // }
                    $scope.vehicleDetails = vehicleDetailsCookie;
                    $scope.vehicleInfo = bikeQuoteCookie.vehicleInfo;

                    $scope.quoteParam.riders = [];

                    if (localStorageService.get("registrationPlaceUsingIP")) {
                        if (localStorageService.get("registrationPlaceUsingIP").rtoStatus == true) {
                            $scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                            $rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                            $rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
                        }
                    }

                    $rootScope.showBikeRegAreaStatus = vehicleDetailsCookie.showBikeRegAreaStatus;
                    $rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;
                }
                $scope.callForShareVehicleQuote();


            };
            $scope.fetchDefaultCarInputParamaters = function(defaultQuoteStatus, defaultInputParamCallback) {
                $scope.renewal = true;
                $scope.polStatus = true;

                $scope.quote = {};

                // getDocUsingId(RestAPI, $scope.globalLabel.documentType.defaultCarQuoteParam, function(callback){
                if (defaultQuoteStatus) {
                    $scope.quoteParam = defaultCarQuoteParam.quoteParam;
                    $scope.quote.quoteParam = $scope.quoteParam;
                    $scope.vehicleDetails = defaultCarQuoteParam.vehicleDetails;
                    $scope.vehicleInfo = defaultCarQuoteParam.vehicleInfo;
                    $scope.quote.vehicleInfo = $scope.vehicleInfo;
                    if (localStorageService.get("registrationPlaceUsingIP")) {
                        if (localStorageService.get("registrationPlaceUsingIP").rtoStatus == true) {
                            $scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                            $rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                            $rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
                        }
                    }
                } else {
                    var carQuoteCookie = localStorageService.get("carQuoteInputParamaters");
                    var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");
                    if (carQuoteCookie.quoteParam) {
                        $scope.quoteParam = carQuoteCookie.quoteParam;
                    }
                    $scope.vehicleDetails = vehicleDetailsCookie;
                    $scope.vehicleInfo = carQuoteCookie.vehicleInfo;

                    $scope.quoteParam.riders = makeObjectEmpty($scope.quoteParam.riders, "array");
                    $scope.vehicleDetails.selectedAddOnCovers = makeObjectEmpty($scope.vehicleDetails.selectedAddOnCovers, "array");
                    $scope.vehicleDetails.addOnCoverCustomAmount = makeObjectEmpty($scope.vehicleDetails.addOnCoverCustomAmount, "array");

                    $scope.vehicleDetails.checkforNonElectrical = false;
                    $scope.vehicleDetails.checkforElectrical = false;
                    $scope.vehicleDetails.checkforPsgCover = false;
                    $scope.vehicleDetails.checkforLpgCngCover = false;
                    $scope.vehicleDetails.checkforDriverAccCover = false;
                    $scope.vehicleDetails.checkforAccessoriesCover = false;

                    $scope.vehicleInfo.checkEngineProtector = false;
                    $scope.vehicleInfo.engineProtectorStatus = false;
                    $scope.vehicleInfo.checkInvoiceCover = false;
                    $scope.vehicleInfo.invoiceCoverStatus = false;
                    $scope.vehicleInfo.checkTyreCoverRider = false;
                    $scope.vehicleInfo.tyreCoverStatus = false;

                   if (localStorageService.get("registrationPlaceUsingIP")) {
                        if (localStorageService.get("registrationPlaceUsingIP").rtoStatus == true) {
                            $scope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                            $rootScope.vehicleInfo.registrationPlace = localStorageService.get("registrationPlaceUsingIP").rtoName;
                            $rootScope.vehicleInfo.selectedRegistrationObject = localStorageService.get("registrationPlaceUsingIP").rtoObject;
                        }
                    }

                    $rootScope.showCarRegAreaStatus = vehicleDetailsCookie.showCarRegAreaStatus;
                    $rootScope.vehicleDetails.registrationNumber = vehicleDetailsCookie.registrationNumber;
                }
                //$scope.shareQuoteTemplateFunction();
                $scope.callForShareVehicleQuote();

            }


            /*var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
            //checking for lead Id
            if(quoteUserInfoCookie != null){
            	if(quoteUserInfoCookie.messageId !=undefined || quoteUserInfoCookie.messageId != null || quoteUserInfoCookie.messageId !=''){
            		messageIDVar=quoteUserInfoCookie.messageId;
            	}else{
            		messageIDVar='';
            	}
            }*/
            loadDatbase(function() {
                /*don't remove this code, it is commented for temporary purpose, it is used to check application version
                 * if(localStorageService.get("policies365-application-version") != null && localStorageService.get("policies365-application-version") != "undefined"
                	&& String(localStorageService.get("policies365-application-version")) == APPLICATION_VERSION)
                {
                	
                	localStorageService.set("websiteVisitedOnce", true);
                	//$scope.$broadcast("invokeGetQuoteTemplate",{});
                	//call for campaign (headerController)
                	//$scope.$broadcast("invokeCampaignTemplate",{});
                	
                }
                else
                {*/
                /**/
                if (!wordPressEnabled) {
                    localStorageService.clearAll();
                    localStorageService.clearCollection();
                    localStorageService.set("policies365-application-version", APPLICATION_VERSION);
                    // localStorage.removeItem('selectedBusinessLineId');

                    if ($location.search().isForRenewal) {
                        
                        localStorageService.set("selectedBusinessLineId", $location.search().LOB);
                    } else {
                        if ($location.search().LOB) {
                            var decodeLOB = $location.search().LOB;
                            var lob = decodeLOB.toString(decodeLOB);
                            
                            localStorageService.set("selectedBusinessLineId", lob);
                        }
                    }
                    localStorageService.set("websiteVisitedOnce", false);
                }



               // added for wordPress
                if (wordPressEnabled) {
                    wp_path = localized;
                    $rootScope.wordPressEnabled = wordPressEnabled;
                    $rootScope.wp_path = wp_path;
                   // localStorageService.set("wordPressEnabled", true);
                } else {
                    $rootScope.wp_path = '';
                    wp_path = '';
                   // localStorageService.set("wordPressEnabled", false);
                }
                if(!wordPressEnabled && pospEnabled){
                    wp_path = localized;
					 $rootScope.pospEnabled = pospEnabled;
                    $rootScope.wp_path = wp_path;
                }
				
               // $rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled");
               $rootScope.wordPressEnabled = wordPressEnabled;
               $http.get(wp_path + 'ApplicationLabels.json').then(function(response) {


                    localStorageService.set("applicationLabels", response.data);
                    $scope.globalLabel = response.data.globalLabels;
                    /*localStorageService.set("policies365-application-version", APPLICATION_VERSION);*/
                    if (localStorageService.get("userLoginInfo") == null || String(localStorageService.get("userLoginInfo")) == "undefined") {
                        var userLoginInfo = {};
                        userLoginInfo.username = undefined;
                        userLoginInfo.mobileNumber = undefined;
                        userLoginInfo.status = false;
                        localStorageService.set("userLoginInfo", userLoginInfo);
                    }

                    function getCookieValue(a) {
                        var affilateCookie = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
                        return affilateCookie ? affilateCookie.pop() : '';
                    }
                    var p365cookie = getCookieValue("wpam_id");
                    var proposalDocID = "";


                    if (p365cookie) {
                        var sourceRequest = {};
                        sourceRequest.deviceId = p365cookie;
                        deviceIdOrigin = sourceRequest.deviceId;
                        /*if($location.search().source){
                           var sourceRequest={};
                           sourceRequest.deviceId=$location.search().source;
                          // request.deviceId ="droom";
                           //	deviceIdOrigin=request.deviceId;
                         */

                        RestAPI.invoke($scope.globalLabel.transactionName.validateSource, sourceRequest).then(function(callback) {
                            if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                $scope.sourceValidationResponse = callback.data;
                                sourceOrigin = $scope.sourceValidationResponse.source;
                                deviceIdOrigin = $scope.sourceValidationResponse.deviceId;
                                $rootScope.affilateUser = $scope.sourceValidationResponse.affilateUser;
                                $rootScope.affilateRedirection = $scope.sourceValidationResponse.redirectToAffilateScreen;
                                if ($scope.sourceValidationResponse.redirectionURL) {
                                    $rootScope.redirectionURL = $scope.sourceValidationResponse.redirectionURL;
                                }
                                if ($scope.sourceValidationResponse.campaignId) {
                                    campaign_id = $scope.sourceValidationResponse.campaignId;
                                }
                                if ($scope.sourceValidationResponse.requestSource) {
                                    requestSource = $scope.sourceValidationResponse.requestSource;
                                }
                                if($scope.sourceValidationResponse.hideLOB){
                                    $rootScope.hideLOB = $scope.sourceValidationResponse.hideLOB;
                                }else{
                                    $rootScope.hideLOB = false;
                                }
                            
                                // $scope.callForSurveyConfiguration();
                                //if($location.search().docId){

                                //}
                                
                                $scope.updateReadEmailStatus();

                                if ($rootScope.affilateUser) {
                                    // Function created to fetch default input parameters for car.
                                    $scope.quote = {};
                                    $scope.selectedBusinessLineId = $location.search().LOB;
                                    $rootScope.vehicleInfo = '';
                                    $rootScope.vehicleDetails = '';
                                    //sourceOrigin=$location.search().source.toLowerCase();

                                    if ($location.search().firstName) {
                                        $scope.quoteUserInfo.firstName = $location.search().firstName;
                                    }
                                    if ($location.search().lastName) {
                                        $scope.quoteUserInfo.lastName = $location.search().lastName;
                                    }
                                    if ($location.search().mobNumber) {
                                        $scope.quoteUserInfo.mobileNumber = $location.search().mobNumber;
                                    }
                                    if ($location.search().userId) {
                                        $scope.quoteUserInfo.emailId = $location.search().userId;
                                    }
                                    
                                    if ($scope.selectedBusinessLineId == 3) {
                                        // Checking whether cookie is present or not.
                                        var carQuoteCookie = localStorageService.get("carQuoteInputParamaters");
                                        if (carQuoteCookie !== null && String(carQuoteCookie) !== "undefined") {
                                            $scope.fetchDefaultCarInputParamaters(true, function() {});
                                        } else {
                                            $scope.fetchDefaultCarInputParamaters(true, function() {});
                                        }
                                    } else if ($scope.selectedBusinessLineId == 2) {
                                        // Checking whether cookie is present or not.
                                        var bikeQuoteCookie = localStorageService.get("bikeQuoteInputParamaters");
                                        if (bikeQuoteCookie !== null && String(bikeQuoteCookie) !== "undefined") {
                                            $scope.fetchDefaultBikeInputParamaters(true, function() {});
                                        } else {
                                            $scope.fetchDefaultBikeInputParamaters(true, function() {});
                                        }
                                    }
                                } else {
                                    var request = {};
                                    
                                    request.LOB = $location.search().LOB;
                                    request.docId = $location.search().docId;
                                    request.userId = $location.search().userId;
                                    request.carriers = $location.search().carriers;
                                    request.monthlyPremiumOption = $location.search().monthlyPremiumOption;

                                    if ($location.search().view) {
                                        request.view = $location.search().view;
                                        $scope.view = request.view;
                                    }
                                    
                                    
                                    if (request.userId) {
                                        // $rootScope.isOlarked = true;
                                        $rootScope.flag = false;
                                        var quoteUserInfo = {};
                                        $scope.quoteUserInfo.firstName = undefined;
                                        $scope.quoteUserInfo.emailId = undefined;
                                        $scope.quoteUserInfo.mobileNumber = undefined;
                                    
                                        
                                        localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                                    }
                                    /*Skipping decryption in case of isForRenewal flag is present*/
                                    if (!$location.search().isForRenewal) {
                                        //code for decode

                                        // Decode Quote 	
                                        $rootScope.decryptedQuote_Id = $location.search().docId;
                                        

                                        //  Decode LOB 
                                        if ($location.search().LOB) {
                                            $rootScope.decryptedLOB = $location.search().LOB
                                        }
                                        // $rootScope.decryptedEmailId = decodeEmailId;
                                        // $rootScope.decryptedMonthlyPremiumOptio = decodeMonthlyPremiumOption;
                                        // $rootScope.decryptedCarrierList  = decodeCarriers;
                                        // $rootScope.parseCarrierList = JSON.parse($rootScope.decryptedCarrierList)
                                        //end

                                        request.docId = $location.search().docId;
                                        if ($location.search().LOB) {
                                            request.LOB = $location.search().LOB;
                                        }
                                        //  request.userId=$rootScope.decryptedEmailId;
                                        //  request.carriers=$rootScope.parseCarrierList;

                                    } else if ($location.search().isForRenewal) {
                                        /*fetching lob,docid,proposalID from url without decryption*/
                                        request.LOB = $location.search().LOB;
                                        request.docId = $location.search().docId;
                                        request.userId = $location.search().userId;
                                        proposalDocID = $location.search().proposalId;
                                    }

                                    
                                    
                                // use to populate basic quote data     
                                $scope.setPopulateQuoteData = function(mainResponseNode){
                                                                    
                                            // setting the message id from the quote document
                                                if(mainResponseNode.data.messageId)
                                                messageIDVar = mainResponseNode.data.messageId; 
                                        $scope.selectedBusinessLineId = mainResponseNode.data.businessLineId;
                                       // sourceOrigin = "web";

                                        if ($location.search().userId) {
                                            //assigning user without decryption
                                            if ($location.search().isForRenewal) {
                                                $scope.quoteUserInfo.emailId = $location.search().userId;
                                            } else {
                                                $scope.quoteUserInfo.emailId = $rootScope.decryptedEmailId;
                                            }
                                        }
                                        if ($scope.selectedBusinessLineId == 1) {
                                            $scope.quote = {};
                                            $scope.personalDetails = {};

                                            $scope.lifeResponse = mainResponseNode.data;
                                            $scope.quote = $scope.lifeResponse.lifeQuoteRequest;
                                            $scope.quote.quoteParam = $scope.lifeResponse.lifeQuoteRequest.quoteParam;
                                            $scope.quote.personalDetails = $scope.lifeResponse.lifeQuoteRequest.personalDetails;
                                            $scope.personalDetails = $scope.quote.personalDetails;

                                            $rootScope.lifeQuoteResult = $scope.lifeResponse.lifeQuoteResponse;
                                            $rootScope.selectedBusinessLineId = $scope.lifeResponse.businessLineId;
                                            
                                            $scope.shareQuoteTemplateFunction();
                                        } else if ($scope.selectedBusinessLineId == 3) {
                                            
                                            
                                            $scope.vehicleDetails = {};
                                            $scope.vehicleDetails.insuranceType = {};
                                            $scope.quote = {};
                                            $scope.quote.quoteParam={};
                                            $scope.vehicleInfo = {};

                                            $scope.carResponse = callback.data;

                                             $scope.quote.quoteParam.ncb = $scope.carResponse.carQuoteRequest.quoteParam.ncb;
                                             if($scope.carResponse.carQuoteRequest.quoteParam.ownedBy){
                                             $scope.quote.quoteParam.ownedBy = $scope.carResponse.carQuoteRequest.quoteParam.ownedBy;
                                             }else if($scope.carResponse.carQuoteRequest.quoteParam.owneredBy){
                                             $scope.quote.quoteParam.ownedBy = $scope.carResponse.carQuoteRequest.quoteParam.owneredBy;
                                            }
                                             if($scope.carResponse.carQuoteRequest.quoteParam.policyType)
                                             $scope.quote.quoteParam.policyType = $scope.carResponse.carQuoteRequest.quoteParam.policyType;
                                             if($scope.carResponse.carQuoteRequest.quoteParam.riders)
                                             $scope.quote.quoteParam.riders = $scope.carResponse.carQuoteRequest.quoteParam.riders;
                                            
                                            $scope.quoteParam = $scope.quote.quoteParam;

                                            $scope.CAR_UNIQUE_QUOTE_ID = $scope.carResponse.QUOTE_ID;
                                            $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.carResponse.carQuoteRequest.encryptedQuoteId;
        
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.IDV)
                                             $scope.vehicleInfo.IDV = $scope.carResponse.carQuoteRequest.vehicleInfo.IDV;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate)
                                             $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.carResponse.carQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.RTOCode){
                                             $scope.vehicleInfo.RTOCode = $scope.carResponse.carQuoteRequest.vehicleInfo.RTOCode;
                                             }else{
                                             $scope.vehicleInfo.RTOCode = "MH01";   
                                             }
                                            if($scope.carResponse.carQuoteRequest.vehicleInfo.city){
                                             $scope.vehicleInfo.city = $scope.carResponse.carQuoteRequest.vehicleInfo.city;
                                            }else {
                                                $scope.vehicleInfo.city = "MUMBAI";  
                                            }
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.dateOfRegistration){
                                             $scope.vehicleInfo.dateOfRegistration = $scope.carResponse.carQuoteRequest.vehicleInfo.dateOfRegistration;
                                             var carRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/"); 
                                             $scope.vehicleDetails.regYear = carRegistrationYearList[2] ;
                                            }
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.idvOption)
                                             $scope.vehicleInfo.idvOption = $scope.carResponse.carQuoteRequest.vehicleInfo.idvOption;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.best_quote_id)
                                             $scope.vehicleInfo.best_quote_id = $scope.carResponse.carQuoteRequest.vehicleInfo.best_quote_id;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.previousClaim)
                                             $scope.vehicleInfo.previousClaim = $scope.carResponse.carQuoteRequest.vehicleInfo.previousClaim;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.registrationNumber)
                                             $scope.vehicleInfo.registrationNumber = $scope.carResponse.carQuoteRequest.vehicleInfo.registrationNumber;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.registrationPlace)
                                             $scope.vehicleInfo.registrationPlace = $scope.carResponse.carQuoteRequest.vehicleInfo.registrationPlace;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.state)
                                             $scope.vehicleInfo.state = $scope.carResponse.carQuoteRequest.vehicleInfo.state;
                                            if($scope.carResponse.carQuoteRequest.vehicleInfo.make){
                                            $scope.vehicleInfo.make = $scope.carResponse.carQuoteRequest.vehicleInfo.make;
                                            }else{
                                            $scope.vehicleInfo.make = $scope.carResponse.carQuoteRequest.vehicleInfo.name;  
                                            }
                                            if($scope.carResponse.carQuoteRequest.vehicleInfo.model)
                                             $scope.vehicleInfo.model = $scope.carResponse.carQuoteRequest.vehicleInfo.model;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.variant)
                                             $scope.vehicleInfo.variant = $scope.carResponse.carQuoteRequest.vehicleInfo.variant.toString();
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.fuel)
                                             $scope.vehicleInfo.fuel = $scope.carResponse.carQuoteRequest.vehicleInfo.fuel;
                                             if($scope.carResponse.carQuoteRequest.vehicleInfo.cubicCapacity)
                                             $scope.vehicleInfo.cubicCapacity = $scope.carResponse.carQuoteRequest.vehicleInfo.cubicCapacity;
                                            
                                            $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                            $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                            $rootScope.carQuoteResult = $scope.carResponse.carQuoteResponse;
                                            
                                            if(request.docId =="DefaultCarQuote"){
                                                var today = new Date(); 
                                                var priorDate = new Date(today.setDate(new Date().getDate()+27));                                             
                                                var current_date = ("0" + today.getDate().toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +today.getFullYear() ; 
                                                var prev_date = ("0" + (Number(today.getDate()) + 1).toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +(Number(today.getFullYear()) - 1).toString() ; 
                                               
                                                $scope.vehicleInfo.PreviousPolicyExpiryDate = current_date;
                                                $scope.vehicleDetails.PreviousPolicyStartDate = prev_date;
                                                $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                            }

                                            localStorageService.set("carQuoteInputParamaters", $scope.quote);
                                            $scope.callForShareVehicleQuote();
                                            /*call for getRenewalData() new call*/
                                            setTimeout(function() {
                                                if ($location.search().isForRenewal) {
                                                    $scope.getRenewalData();
                                                }
                                            }, 200);
                                        } else if ($scope.selectedBusinessLineId == 2) {
                                            
                                            $scope.vehicleDetails = {};
                                            $scope.vehicleDetails.insuranceType = {};
                                            $scope.quote = {};
                                            $scope.quote.quoteParam={};
                                            $scope.vehicleInfo = {};

                                            $scope.bikeResponse = callback.data;

                                             $scope.quote.quoteParam.ncb = $scope.bikeResponse.bikeQuoteRequest.quoteParam.ncb;
                                             if($scope.bikeResponse.bikeQuoteRequest.quoteParam.ownedBy){
                                             $scope.quote.quoteParam.ownedBy = $scope.bikeResponse.bikeQuoteRequest.quoteParam.ownedBy;
                                             }else if($scope.bikeResponse.bikeQuoteRequest.quoteParam.owneredBy){
                                             $scope.quote.quoteParam.ownedBy = $scope.bikeResponse.bikeQuoteRequest.quoteParam.owneredBy;
                                             }
                                             if($scope.bikeResponse.bikeQuoteRequest.quoteParam.policyType)
                                             $scope.quote.quoteParam.policyType = $scope.bikeResponse.bikeQuoteRequest.quoteParam.policyType;
                                             if($scope.bikeResponse.bikeQuoteRequest.quoteParam.riders)
                                             $scope.quote.quoteParam.riders = $scope.bikeResponse.bikeQuoteRequest.quoteParam.riders;
                                            
                                            $scope.quoteParam = $scope.quote.quoteParam;
                                            $scope.BIKE_UNIQUE_QUOTE_ID = $scope.bikeResponse.QUOTE_ID;
                                            $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.bikeResponse.bikeQuoteRequest.encryptedQuoteId;
        
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.IDV)
                                             $scope.vehicleInfo.IDV = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.IDV;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate)
                                             $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.RTOCode){
                                              $scope.vehicleInfo.RTOCode = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.RTOCode;
                                             }else{
                                             $scope.vehicleInfo.RTOCode = "MH01";
                                             }
                                            if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.city){
                                             $scope.vehicleInfo.city = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.city;
                                            }else {
                                            $scope.vehicleInfo.city = "MUMBAI";
                                            }
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.dateOfRegistration){
                                             $scope.vehicleInfo.dateOfRegistration = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.dateOfRegistration;
                                             var bikeRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/"); 
                                             $scope.vehicleDetails.regYear = bikeRegistrationYearList[2] ;
                                            }
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.idvOption)
                                             $scope.vehicleInfo.idvOption = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.idvOption;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.best_quote_id)
                                             $scope.vehicleInfo.best_quote_id = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.best_quote_id;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousClaim)
                                             $scope.vehicleInfo.previousClaim = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousClaim;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationNumber)
                                             $scope.vehicleInfo.registrationNumber = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationNumber;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationPlace)
                                             $scope.vehicleInfo.registrationPlace = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationPlace;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.state)
                                             $scope.vehicleInfo.state = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.state;
                                            if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.make){
                                            $scope.vehicleInfo.make = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.make;
                                            }else{
                                            $scope.vehicleInfo.make =  $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.name; 
                                            }
                                            if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.model)
                                             $scope.vehicleInfo.model = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.model;
                                             if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.variant)
                                             $scope.vehicleInfo.variant = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.variant.toString();
                                            
                                            if(request.docId =="DefaultBikeQuote"){
                                                var today = new Date();
    
                                                var current_date = ("0" + today.getDate().toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +today.getFullYear() ; 
                                                var prev_date = ("0" + (Number(today.getDate()) + 1).toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +(Number(today.getFullYear()) - 1).toString() ; 
                                               
                                                $scope.vehicleInfo.PreviousPolicyExpiryDate = current_date;
                                                $scope.vehicleInfo.PreviousPolicyStartDate = prev_date;
      
                                            }
                                            $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                            $scope.selectedBusinessLineId = $scope.bikeResponse.businessLineId;

                                            $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                            $rootScope.bikeQuoteResult = $scope.bikeResponse.bikeQuoteResponse;
                                            localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
                                            //localStorageService.set("BikePACoverDetails", $scope.PACoverDetails);
                                            /*call for getRenewalData() new call*/

                                            $scope.callForShareVehicleQuote();
                                            setTimeout(function() {
                                                if ($location.search().isForRenewal) {
                                                    $scope.getRenewalData();
                                                }
                                            }, 200);


                                        } else if ($scope.selectedBusinessLineId == 4) {
                                            $rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.health.proverbInstantQuote) };
                                            $rootScope.title = $scope.globalLabel.policies365Title.medicalResultQuote;
                                            $scope.quote = {};
                                            $scope.selectedFamilyArray = [];
                                            $scope.selectedDisease = {};
                                            $scope.diseaseList = {};
                                            $scope.selectedDisease.diseaseList = [];
                                            $scope.selectedFeatures = [];
                                            var item = {};

                                            $scope.isDiseased = false;
                                            //$scope.familyList = healthFamilyListGeneric;

                                            $scope.healthResponse = mainResponseNode.data;
                                            $scope.quote = $scope.healthResponse.quoteRequest;
                                            $scope.quote.quoteParam = $scope.healthResponse.quoteRequest.quoteParam;
                                            $scope.quote.personalInfo = $scope.healthResponse.quoteRequest.personalInfo;
                                            $scope.selectedArea = $scope.healthResponse.quoteRequest.personalInfo.displayArea;
                                            $scope.selectedBusinessLineId = $scope.healthResponse.businessLineId;
                                            $scope.selectedFamilyArray = $scope.quote.personalInfo.selectedFamilyMembers;
                                            $scope.familyList = $scope.quote.personalInfo.selectedFamilyMembers;
                                            $rootScope.healthQuoteResult = $scope.healthResponse.quoteResponse;
                                            $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                            
                                            $scope.shareQuoteTemplateFunction();
                                        } else if ($scope.selectedBusinessLineId == 5) {
                                            $scope.quote = {};
                                            $scope.selectedDisease = {};
                                            $scope.sumInsuredList = [];
                                            $scope.travelResponse = mainResponseNode.data;
                                            $scope.quote = $scope.travelResponse.quoteRequest;
                                            $scope.selectedBusinessLineId = $scope.travelResponse.businessLineId;
                                            $scope.travellersList = $scope.quote.quoteParam.travellers;
                                            $rootScope.travelQuoteResult = $scope.travelResponse.quoteResponse;
                                            $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                            
                                            $scope.shareQuoteTemplateFunction();
                                        } else if ($scope.selectedBusinessLineId == 6) {
                                            $scope.quote = {};
                                            $scope.personalDetails = {};
                                            $scope.criticalIllnessResponse = mainResponseNode.data;
                                            $scope.quote = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest;
                                            $scope.quote.quoteParam = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest.quoteParam;
                                            $scope.quote.personalDetails = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest.personalDetails;
                                            $scope.personalDetails = $scope.quote.personalDetails;
                                            
                                            $rootScope.ciQuoteResult = $scope.criticalIllnessResponse.criticalIllnessQuoteResponse;

                                            $rootScope.selectedBusinessLineId = $scope.criticalIllnessResponse.businessLineId;
                                            $scope.shareQuoteTemplateFunction();
                                        }  
                            }

                                    if ($location.search().view) {
                                        request.view = $location.search().view;
                                        $scope.view = request.view;
                                    }
                                    setTimeout(function() {     
                                        
                                        // if smsId is not present then  dont call quotes as dissuced with danny
                                        if(!$location.search().smsId){
                                            if(!request.LOB){
                                                var lob = request.docId.substr(0,3);
                                                   if(lob == 'CAR'){
                                                        request.LOB = "3";
                                                   }else if(lob == 'BIKE'){
                                                       request.LOB = "2";
                                                   }
                                            }
                                        RestAPI.invoke($scope.globalLabel.transactionName.quoteDataReader, request).then(function(mainResponseNode) {
                                            if( mainResponseNode.data == 1000 ){

                                            $scope.setPopulateQuoteData(mainResponseNode);
                                          }else if(( mainResponseNode.responseCode == 1009 )){
                                           // heare we are population data with the default quote id
                                           if(request.LOB == 3 && sourceOrigin == "agency"){                                        
                                            request.docId = "DefaultCarQuote";
                                            localStorageService.set("CAR_UNIQUE_QUOTE_ID","DefaultCarQuote");
                                          }
                                          else if(request.LOB == 2 && sourceOrigin == "agency"){                                        
                                            request.docId = "DefaultBikeQuote";
                                            localStorageService.set("BIKE_UNIQUE_QUOTE_ID","DefaultBikeQuote");
                                          }
                                            
                                          RestAPI.invoke($scope.globalLabel.transactionName.quoteDataReader, request).then(function(mainResponseNode2) {
                                                if( mainResponseNode2.responseCode == 1000  ){
                                            $scope.setPopulateQuoteData(mainResponseNode2);
                                            
                                            }else{
                                                $rootScope.loading = false;
                                                console.log('unable to proceed due to failed transaction name: ',$scope.globalLabel.transactionName.quoteDataReader);                                                
                                                $rootScope.P365Alert("Policies365", "We are not able fetch quotes for you right now, due to technical reasons. Please try after some time or contact our insurance expert.", "Ok");
                                            }                                              
                                            });

                                        }else{
                                            $rootScope.loading = false;
                                            console.log('unable to proceed due to failed transaction name: ',$scope.globalLabel.transactionName.quoteDataReader);                                                
                                            console.log('calculating default quote as no result found');
                                            if(request.LOB == 3 && sourceOrigin == "agency"){                                        
                                                request.docId = "DefaultCarQuote";
                                                localStorageService.set("CAR_UNIQUE_QUOTE_ID","DefaultCarQuote");
                                              }
                                              else if(request.LOB == 2 && sourceOrigin == "agency"){                                        
                                                request.docId = "DefaultBikeQuote";
                                                localStorageService.set("BIKE_UNIQUE_QUOTE_ID","DefaultBikeQuote");
                                              }
                                                
                                              RestAPI.invoke($scope.globalLabel.transactionName.quoteDataReader, request).then(function(mainResponseNode2) {
                                                    if( mainResponseNode2.responseCode == 1000  ){
                                                $scope.setPopulateQuoteData(mainResponseNode2);
                                                
                                                }else{
                                                    $rootScope.loading = false;
                                                    console.log('unable to proceed due to failed transaction name: ',$scope.globalLabel.transactionName.quoteDataReader);                                                
                                                    $rootScope.P365Alert("Policies365", "We are not able fetch quotes for you right now, due to technical reasons. Please try after some time or contact our insurance expert.", "Ok");
                                                }                                              
                                                });
                                            //$rootScope.P365Alert("Policies365", "We are not able fetch quotes for you right now, due to technical reasons. Please try after some time or contact our insurance expert.", "Ok");
                                        }
                                           
                                        });
                                    }
                                    }, 2000);
                                }

                            } else {
                                
                            }
                        });
                        // $scope.callForSurveyConfiguration();
                    } else { /**!**/
                        var sourceRequest = {};
                        sourceRequest.deviceId = deviceIdOrigin;
                        deviceIdOrigin = deviceIdOrigin;

                        RestAPI.invoke($scope.globalLabel.transactionName.validateSource, sourceRequest).then(function(callback) {
                            if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                $scope.sourceValidationResponse = callback.data;
                                sourceOrigin = $scope.sourceValidationResponse.source;
                                $rootScope.affilateUser = $scope.sourceValidationResponse.affilateUser;
                                $rootScope.affilateRedirection = $scope.sourceValidationResponse.redirectToAffilateScreen;
                                if ($scope.sourceValidationResponse.redirectionURL) {
                                    $rootScope.redirectionURL = $scope.sourceValidationResponse.redirectionURL;
                                }
                                if ($scope.sourceValidationResponse.campaignId) {
                                    campaign_id = $scope.sourceValidationResponse.campaignId;
                                }
                                if ($scope.sourceValidationResponse.requestSource) {
                                    requestSource = $scope.sourceValidationResponse.requestSource;
                                }
                                

                                $scope.updateReadEmailStatus();
                                //$scope.callForSurveyConfiguration();                                  
                                    var request = {};
                                    var header = {};
                                    if ($location.search().crmLeadId) {
                                        
                                        header.crmleadid = $location.search().crmLeadId;
                                        header.deviceId = deviceIdOrigin;
                                        request.header = header;
                                        
                                    }
                                    request.LOB = $location.search().LOB;
                                    request.docId = $location.search().docId;
                                    request.userId = $location.search().userId;
                                    request.carriers = $location.search().carriers;
                                    request.monthlyPremiumOption = $location.search().monthlyPremiumOption;

                                    
                                    if ($location.search().view) {
                                        request.view = $location.search().view;
                                        $scope.view = request.view;
                                    }
                                    /*Skipping decryption in case of isForRenewal flag is present*/
                                    if (!$location.search().isForRenewal) {                                  
                                        //code for decode
                                        var decodeQuote = String(request.docId);
                                        var decodeLOB = String(request.LOB);

                                        var decodeEmailId = String(request.userId);
                                        var decodeCarriers = String(request.carriers);
                                        var decodeMonthlyPremiumOption = String(request.monthlyPremiumOption);

                                        if ($location.search().userId) {
                                            // $rootScope.isOlarked = true;
                                            $rootScope.flag = false;
                                            var quoteUserInfo = {};
                                            $scope.quoteUserInfo.firstName = undefined;
                                            $scope.quoteUserInfo.emailId = decodeEmailId;
                                            $scope.quoteUserInfo.mobileNumber = undefined;
                                                                                       
                                            localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                                        }

                                        // Decode Quote 	
                                        $rootScope.decryptedQuote_Id = $location.search().docId;
                                        
                                        //  Decode LOB
                                        if ($location.search().LOB) {
                                            $rootScope.decryptedLOB = $location.search().LOB;
                                        }

                                        $rootScope.decryptedEmailId = decodeEmailId;
                                        // $rootScope.decryptedMonthlyPremiumOptio = decodeMonthlyPremiumOption;
                                        if($location.search().carriers){ 
                                        $rootScope.decryptedCarrierList  = decodeCarriers;
                                        $rootScope.parseCarrierList = JSON.parse($rootScope.decryptedCarrierList);
                                        }
                                        if($location.search().sharePDF){ 
                                            console.log("inside $location.search().sharePDF in share quote");
                                            $rootScope.parseCarrierList = [];
                                            $rootScope.decryptedCarrierList  = decodeCarriers;
                                            $rootScope.parseCarrierList.push($rootScope.decryptedCarrierList);
                                            console.log("inside $location.search().sharePDF in share quote",$rootScope.parseCarrierList);
                                            }

                                        //end
                                        if ($rootScope.decryptedLOB) {
                                            request.LOB = $rootScope.decryptedLOB;
                                        }
                                        request.docId = $rootScope.decryptedQuote_Id;
                                        // request.userId=$rootScope.decryptedEmailId;
                                        // request.carriers=$rootScope.parseCarrierList;
                                    } else if ($location.search().isForRenewal) {
                                        /*fetching lob,docid,proposalID from url without decryption*/
                                        request.LOB = $location.search().LOB;
                                        request.docId = $location.search().docId;
                                        proposalDocID = $location.search().proposalId;
                                    }

                                    if ($location.search().view) {
                                        request.view = $location.search().view;
                                        $scope.view = request.view;
                                    }

                                    $scope.loadQuoteData = function(callback){
                                        
                                        if (callback.responseCode == 1000) {
                                           // $scope.selectedBusinessLineId = callback.data.businessLineId;
                                           if(callback.data.businessLineId){
                                            $scope.selectedBusinessLineId = callback.data.businessLineId;
                                              }else if($location.search().LOB){
                                             $scope.selectedBusinessLineId =$location.search().LOB ;
                                              } 
              
                                           localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                                            //sourceOrigin = "web";

                                            if ($location.search().userId) {
                                                //assigning user without decryption
                                                if ($location.search().isForRenewal) {
                                                    $scope.quoteUserInfo.emailId = $location.search().userId;
                                                } else {
                                                    $scope.quoteUserInfo.emailId = $rootScope.decryptedEmailId;
                                                }
                                            }

                                            if ($scope.selectedBusinessLineId == 1) {
                                                $scope.quote = {};
                                                $scope.personalDetails = {};

                                                $scope.lifeResponse = callback.data;
                                                $scope.quote = $scope.lifeResponse.lifeQuoteRequest;
                                                $scope.quote.quoteParam = $scope.lifeResponse.lifeQuoteRequest.quoteParam;
                                                $scope.quote.personalDetails = $scope.lifeResponse.lifeQuoteRequest.personalDetails;
                                                $scope.personalDetails = $scope.quote.personalDetails;

                                                $rootScope.lifeQuoteResult = $scope.lifeResponse.lifeQuoteResponse;
                                                $rootScope.selectedBusinessLineId = $scope.lifeResponse.businessLineId;
                                                $scope.shareQuoteTemplateFunction();
                                            } else if ($scope.selectedBusinessLineId == 3) {
                                                $scope.vehicleDetails = {};
                                                $scope.vehicleDetails.insuranceType = {};
                                                $scope.quote = {};
                                                $scope.quote.quoteParam={};
                                                $scope.vehicleInfo = {};

                                                $scope.carResponse = callback.data;

                                                 $scope.quote.quoteParam.ncb = $scope.carResponse.carQuoteRequest.quoteParam.ncb;
                                                 if($scope.carResponse.carQuoteRequest.quoteParam.ownedBy)
                                                 $scope.quote.quoteParam.ownedBy = $scope.carResponse.carQuoteRequest.quoteParam.ownedBy;
                                                 if($scope.carResponse.carQuoteRequest.quoteParam.policyType)
                                                 $scope.quote.quoteParam.policyType = $scope.carResponse.carQuoteRequest.quoteParam.policyType;
                                                 if($scope.carResponse.carQuoteRequest.quoteParam.riders)
                                                 $scope.quote.quoteParam.riders = $scope.carResponse.carQuoteRequest.quoteParam.riders;
                                                $scope.quoteParam = $scope.quote.quoteParam;

                                                $scope.CAR_UNIQUE_QUOTE_ID = $scope.carResponse.QUOTE_ID;
                                                $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.carResponse.carQuoteRequest.encryptedQuoteId;
            
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.IDV)
                                                 $scope.vehicleInfo.IDV = $scope.carResponse.carQuoteRequest.vehicleInfo.IDV;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate)
                                                 $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.carResponse.carQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.RTOCode){
                                                 $scope.vehicleInfo.RTOCode = $scope.carResponse.carQuoteRequest.vehicleInfo.RTOCode;
                                                 }else{
                                                 $scope.vehicleInfo.RTOCode = "MH01";   
                                                 }
                                                if($scope.carResponse.carQuoteRequest.vehicleInfo.city){
                                                 $scope.vehicleInfo.city = $scope.carResponse.carQuoteRequest.vehicleInfo.city;
                                                }else{
                                                 $scope.vehicleInfo.city ="MUMBAI"; 
                                                }
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.dateOfRegistration){
                                                 $scope.vehicleInfo.dateOfRegistration = $scope.carResponse.carQuoteRequest.vehicleInfo.dateOfRegistration;
                                                 var carRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/"); 
                                                 $scope.vehicleDetails.regYear = carRegistrationYearList[2] ;
                                                }
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.idvOption)
                                                 $scope.vehicleInfo.idvOption = $scope.carResponse.carQuoteRequest.vehicleInfo.idvOption;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.best_quote_id)
                                                 $scope.vehicleInfo.best_quote_id = $scope.carResponse.carQuoteRequest.vehicleInfo.best_quote_id;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.previousClaim)
                                                 $scope.vehicleInfo.previousClaim = $scope.carResponse.carQuoteRequest.vehicleInfo.previousClaim;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.registrationNumber)
                                                 $scope.vehicleInfo.registrationNumber = $scope.carResponse.carQuoteRequest.vehicleInfo.registrationNumber;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.registrationPlace)
                                                 $scope.vehicleInfo.registrationPlace = $scope.carResponse.carQuoteRequest.vehicleInfo.registrationPlace;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.state)
                                                 $scope.vehicleInfo.state = $scope.carResponse.carQuoteRequest.vehicleInfo.state;
                                                if($scope.carResponse.carQuoteRequest.vehicleInfo.make){
                                                $scope.vehicleInfo.make = $scope.carResponse.carQuoteRequest.vehicleInfo.make;
                                                }else {
                                                $scope.vehicleInfo.make = $scope.carResponse.carQuoteRequest.vehicleInfo.name;  
                                                }
                                                if($scope.carResponse.carQuoteRequest.vehicleInfo.model)
                                                 $scope.vehicleInfo.model = $scope.carResponse.carQuoteRequest.vehicleInfo.model;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.variant)
                                                 $scope.vehicleInfo.variant = $scope.carResponse.carQuoteRequest.vehicleInfo.variant.toString();
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.fuel)
                                                 $scope.vehicleInfo.fuel = $scope.carResponse.carQuoteRequest.vehicleInfo.fuel;
                                                 if($scope.carResponse.carQuoteRequest.vehicleInfo.cubicCapacity)
                                                 $scope.vehicleInfo.cubicCapacity = $scope.carResponse.carQuoteRequest.vehicleInfo.cubicCapacity;
                                            
                                                 $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                                $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                                $rootScope.carQuoteResult = $scope.carResponse.carQuoteResponse;
                                             

                                                if(request.docId =="DefaultCarQuote"){
                                                    var today = new Date();                                              
                                                    var current_date = ("0" + today.getDate().toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +today.getFullYear() ; 
                                                    var prev_date = ("0" + (Number(today.getDate()) + 1).toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +(Number(today.getFullYear()) - 1).toString() ; 
                                                   
                                                    $scope.vehicleInfo.PreviousPolicyExpiryDate = current_date;
          
                                                   // $scope.vehicleInfo.PreviousPolicyStartDate = prev_date;
                                                   $scope.vehicleDetails.PreviousPolicyStartDate = prev_date;
                                                }

                                                localStorageService.set("carQuoteInputParamaters", $scope.quote);
                                                $scope.callForShareVehicleQuote();
                                                setTimeout(function() {
                                                    /*call for getRenewalData() new call*/
                                                    if ($location.search().isForRenewal) {
                                                        $scope.getRenewalData();
                                                    }
                                                }, 200);
                                            } else if ($scope.selectedBusinessLineId == 2) {

                                                $scope.vehicleDetails = {};
                                                $scope.vehicleDetails.insuranceType = {};
                                                $scope.quote = {};
                                                $scope.quote.quoteParam={};
                                                $scope.vehicleInfo = {};

                                                $scope.bikeResponse = callback.data;

                                                 $scope.quote.quoteParam.ncb = $scope.bikeResponse.bikeQuoteRequest.quoteParam.ncb;
                                                 if($scope.bikeResponse.bikeQuoteRequest.quoteParam.ownedBy)
                                                 $scope.quote.quoteParam.ownedBy = $scope.bikeResponse.bikeQuoteRequest.quoteParam.ownedBy;
                                                 if($scope.bikeResponse.bikeQuoteRequest.quoteParam.policyType)
                                                 $scope.quote.quoteParam.policyType = $scope.bikeResponse.bikeQuoteRequest.quoteParam.policyType;
                                                 if($scope.bikeResponse.bikeQuoteRequest.quoteParam.riders)
                                                 $scope.quote.quoteParam.riders = $scope.bikeResponse.bikeQuoteRequest.quoteParam.riders;
                                                
                                                $scope.quoteParam = $scope.quote.quoteParam;
                                                $scope.BIKE_UNIQUE_QUOTE_ID = $scope.bikeResponse.QUOTE_ID;
                                                $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.bikeResponse.bikeQuoteRequest.encryptedQuoteId;
            
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.IDV)
                                                 $scope.vehicleInfo.IDV = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.IDV;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate)
                                                 $scope.vehicleInfo.PreviousPolicyExpiryDate = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.PreviousPolicyExpiryDate;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.RTOCode){
                                                 $scope.vehicleInfo.RTOCode = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.RTOCode;
                                                 }else{
                                                    $scope.vehicleInfo.RTOCode = "MH01";  
                                                 }
                                                if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.city){
                                                 $scope.vehicleInfo.city = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.city;
                                                }else{
                                                $scope.vehicleInfo.city = "MUMBAI"; 
                                                }
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.dateOfRegistration){
                                                 $scope.vehicleInfo.dateOfRegistration = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.dateOfRegistration;
                                                 var bikeRegistrationYearList = $scope.vehicleInfo.dateOfRegistration.split("/"); 
                                                 $scope.vehicleDetails.regYear = bikeRegistrationYearList[2] ;
                                                }
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.idvOption)
                                                 $scope.vehicleInfo.idvOption = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.idvOption;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.best_quote_id)
                                                 $scope.vehicleInfo.best_quote_id = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.best_quote_id;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousClaim)
                                                 $scope.vehicleInfo.previousClaim = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousClaim;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationNumber)
                                                 $scope.vehicleInfo.registrationNumber = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationNumber;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationPlace)
                                                 $scope.vehicleInfo.registrationPlace = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.registrationPlace;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.state)
                                                 $scope.vehicleInfo.state = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.state;
                                                if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.make){
                                                $scope.vehicleInfo.make = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.make;
                                                }else{
                                                $scope.vehicleInfo.make = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.name;  
                                                }
                                                if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.model)
                                                 $scope.vehicleInfo.model = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.model;
                                                 if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.variant)
                                                 $scope.vehicleInfo.variant = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.variant.toString();
                                                                                         
                                                if(request.docId =="DefaultBikeQuote"){
                                                    var today = new Date();                                              
                                                    var current_date = ("0" + today.getDate().toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +today.getFullYear() ; 
                                                    var prev_date = ("0" + (Number(today.getDate()) + 1).toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +(Number(today.getFullYear()) - 1).toString() ; 
                                                   
                                                    $scope.vehicleInfo.PreviousPolicyExpiryDate = current_date;
                                                    $scope.vehicleInfo.PreviousPolicyStartDate = prev_date;
          
                                                }
                                                $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                                $scope.selectedBusinessLineId = $scope.bikeResponse.businessLineId;
                                                $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                                $rootScope.bikeQuoteResult = $scope.bikeResponse.bikeQuoteResponse;
                                                // 
                                                localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
                                                //localStorageService.set("BikePACoverDetails", $scope.PACoverDetails);
                                                $scope.callForShareVehicleQuote();
                                                setTimeout(function() {
                                                    /*$scope.callForShareVehicleQuote();*/
                                                    if ($location.search().isForRenewal) {
                                                        $scope.getRenewalData();
                                                    }
                                                }, 200);
                                            } else if ($scope.selectedBusinessLineId == 4) {
                                                $rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.health.proverbInstantQuote) };
                                                $rootScope.title = $scope.globalLabel.policies365Title.medicalResultQuote;
                                                $scope.quote = {};
                                                $scope.selectedFamilyArray = [];
                                                $scope.selectedDisease = {};
                                                $scope.diseaseList = {};
                                                $scope.selectedDisease.diseaseList = [];
                                                $scope.selectedFeatures = [];
                                                var item = {};

                                                $scope.isDiseased = false;
                                                $scope.familyList = healthFamilyListGeneric;

                                                $scope.healthResponse = callback.data;
                                                $scope.quote = $scope.healthResponse.quoteRequest;
                                                $scope.quote.quoteParam = $scope.healthResponse.quoteRequest.quoteParam;
                                                $scope.quote.personalInfo = $scope.healthResponse.quoteRequest.personalInfo;
                                                $scope.selectedArea = $scope.healthResponse.quoteRequest.personalInfo.displayArea;
                                                $scope.selectedBusinessLineId = $scope.healthResponse.businessLineId;
                                                $scope.selectedFamilyArray = $scope.quote.personalInfo.selectedFamilyMembers;

                                                $rootScope.healthQuoteResult = $scope.healthResponse.quoteResponse;
                                                $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                                $scope.shareQuoteTemplateFunction();
                                            } else if ($scope.selectedBusinessLineId == 5) {
                                                $scope.quote = {};
                                                $scope.selectedDisease = {};
                                                $scope.sumInsuredList = [];
                                                $scope.travelResponse = callback.data;
                                                $scope.quote = $scope.travelResponse.quoteRequest;
                                                $scope.selectedBusinessLineId = $scope.travelResponse.businessLineId;
                                                $scope.travellersList = $scope.quote.quoteParam.travellers;
                                                $rootScope.travelQuoteResult = $scope.travelResponse.quoteResponse;
                                                $rootScope.selectedBusinessLineId = $scope.selectedBusinessLineId;
                                                $scope.shareQuoteTemplateFunction();
                                            } else if ($scope.selectedBusinessLineId == 6) {
                                                $scope.quote = {};
                                                $scope.personalDetails = {};
                                                $scope.criticalIllnessResponse = callback.data;
                                                $scope.quote = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest;
                                                $scope.quote.quoteParam = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest.quoteParam;
                                                $scope.quote.personalDetails = $scope.criticalIllnessResponse.criticalIllnessQuoteRequest.personalDetails;
                                                $scope.personalDetails = $scope.quote.personalDetails;
                                                
                                                $rootScope.ciQuoteResult = $scope.criticalIllnessResponse.criticalIllnessQuoteResponse;
                                                $rootScope.selectedBusinessLineId = $scope.criticalIllnessResponse.businessLineId;
                                                $scope.shareQuoteTemplateFunction();
                                            }
                                        }
                                    }

                                    
                                    setTimeout(function() {
                                        
                                        if (request.LOB == 0 ) {
                                            localStorageService.set("professionalShareData", request);
                                            $location.path("/professionalShareAPI");
                                        }
                                                                                
                                        // if smsId is not present then  dont call quotes as dissuced with danny
                                        if(!$location.search().smsId){

                                             
                                            if(!request.LOB){
                                                var lob = request.docId.substr(0,3);
                                                   if(lob == 'CAR'){
                                                        request.LOB = "3";
                                                   }else if(lob == 'BIKE'){
                                                       request.LOB = "2";
                                                   }
                                            }
                                            RestAPI.invoke($scope.globalLabel.transactionName.quoteDataReader, request).then(function(callback) {
                                                                       
                                                if( callback.responseCode == 1000 ){                                               
                                                $scope.loadQuoteData(callback);
                                                }else if( callback.responseCode == 1009 ){
                                                
                                                // heare we are population data with the default quote id    
                                                if(request.LOB == 3 && sourceOrigin == "agency"){                                        
                                                    request.docId = "DefaultCarQuote";
                                                    localStorageService.set("CAR_UNIQUE_QUOTE_ID","DefaultCarQuote");
                                                    }
                                                 else if(request.LOB == 2 && sourceOrigin == "agency"){                                        
                                                        request.docId = "DefaultBikeQuote";
                                                        localStorageService.set("BIKE_UNIQUE_QUOTE_ID","DefaultBikeQuote");
                                                      }


                                                        RestAPI.invoke($scope.globalLabel.transactionName.quoteDataReader, request).then(function(callback2) {
                                                            if(callback2.responseCode == 1000){
                                                                $scope.loadQuoteData(callback2);
                                                        
                                                        }else{
                                                            $rootScope.loading = false;                                                
                                                            $rootScope.P365Alert("Policies365", "We are not able fetch quotes for you right now, due to technical reasons. Please try after some time or contact our insurance expert.", "Ok");
                                                        }

                                                    });
                                                }else{
                                                    $rootScope.loading = false;                                                
                                                    $rootScope.P365Alert("Policies365", "We are not able fetch quotes for you right now, due to technical reasons. Please try after some time or contact our insurance expert.", "Ok");
                                                }
                                        
                                            });
                                        }


                                    }, 2000);
                                
                            }
                        });
                        //$scope.callForSurveyConfiguration();
                    }


                    $scope.shareQuoteTemplateFunction = function() {
                        $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
                        localStorageService.set("websiteVisitedOnce", true);

                        var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
                        //checking for lead Id
                        if (quoteUserInfoCookie != null) {
                            if (quoteUserInfoCookie.messageId != undefined || quoteUserInfoCookie.messageId != null || quoteUserInfoCookie.messageId != '') {
                                messageIDVar = quoteUserInfoCookie.messageId;
                            } else {
                                messageIDVar = '';
                            }
                        }
                        if ($scope.selectedBusinessLineId == 1) {
                            $rootScope.title = $scope.globalLabel.policies365Title.lifeResultQuote;

                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                            /*	RestAPI.invoke("quoteDataReader", request).then(function(callback)
                            		{
                            	if(callback.responseCode == 1000)
                            	{*/
                            localStorageService.set("lifeQuoteInputParamaters", $scope.quote);
                            localStorageService.set("lifePersonalDetails", $scope.personalDetails);
                            localStorageService.set("selectedBusinessLineId", $scope.lifeResponse.businessLineId);
                            //

                            // Function created to set annual premium amount range.	-	modification-0008
                            $scope.updateAnnualPremiumRange = function(minPremiumValue, maxPremiumValue) {
                                if (minPremiumValue > maxPremiumValue) {
                                    $rootScope.minAnnualPremium = maxPremiumValue;
                                    $rootScope.maxAnnualPremium = minPremiumValue;
                                } else {
                                    $rootScope.minAnnualPremium = minPremiumValue;
                                    $rootScope.maxAnnualPremium = maxPremiumValue;
                                }
                            }

                            $scope.processResult = function() {
                                $rootScope.progressBarStatus = false;
                                $rootScope.viewOptionDisabled = false;
                                $rootScope.tabSelectionStatus = true;
                                //$rootScope.loading = false;
                                $rootScope.lifeQuoteResult = $filter('orderBy')($rootScope.lifeQuoteResult, 'dailyPremium');
                                var minDailyPremiumValue = $rootScope.lifeQuoteResult[0].dailyPremium;
                                var dailyPremiumSliderArray = [];

                                for (var j = 0; j < $rootScope.lifeQuoteResult.length; j++) {
                                    var calculatedDiscAmt = 0;
                                    var discountAmtList = $rootScope.lifeQuoteResult[j].discountList;
                                    if (String(discountAmtList) != "undefined") {
                                        for (var i = 0; i < discountAmtList.length; i++) {
                                            calculatedDiscAmt += discountAmtList[i].discountAmount;
                                        }
                                        calculatedDiscAmt += $rootScope.lifeQuoteResult[j].dailyPremium;
                                        dailyPremiumSliderArray.push(calculatedDiscAmt);
                                    } else {
                                        dailyPremiumSliderArray.push($rootScope.lifeQuoteResult[j].dailyPremium);
                                    }
                                }

                                dailyPremiumSliderArray = $filter('orderBy')(dailyPremiumSliderArray);
                                $scope.updateAnnualPremiumRange(minDailyPremiumValue, dailyPremiumSliderArray[dailyPremiumSliderArray.length - 1]);
                                /*if(localStorageService.get("selectedBusinessLineId") == 1)
                                				$scope.tooltipPrepare($rootScope.lifeQuoteResult);*/
                            }

                            //if(!localStorageService.get("ridersLifeStatus")){
                            // To get the life rider list applicable for this user.
                            getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.life, $scope.globalLabel.request.findAppConfig, function(addOnCoverForLife) {
                                localStorageService.set("addOnCoverForLife", addOnCoverForLife);
                                //localStorageService.set("ridersLifeStatus", true);
                                // $rootScope.selectedAddOnCovers = [];
                                // if($scope.quote.quoteParam.riders)
                                // {
                                // 	for(i=0; i < addOnCoverForLife.length;i++)
                                // 	{
                                // 		for(var j=0;j < $scope.quote.quoteParam.riders.length;j++)
                                // 		{
                                // 			if(addOnCoverForLife[i].riderId==$scope.quote.quoteParam.riders[j].riderId)
                                // 			{
                                // 				$rootScope.selectedAddOnCovers.push(addOnCoverForLife[i]);
                                // 				break;
                                // 			}
                                // 		}
                                // 	}
                                // }
                                // var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
                                // getDocUsingId(RestAPI, docId, function(tooltipContent){
                                // 	localStorageService.set("lifeInstantQuoteTooltipContent", tooltipContent.toolTips);
                                // 	$rootScope.tooltipContent = tooltipContent.toolTips;
                                //$scope.instantQuoteCalculation(addOnCoverForLife);
                                getDocUsingId(RestAPI, $scope.globalLabel.applicationLabels.life.ridersDocInDB, function(carrierDetails) {
                                    $rootScope.carrierDetails = carrierDetails;
                                    var carrierRiderList = angular.copy($rootScope.carrierDetails);

                                    $rootScope.lifeQuoteResult = [];
                                    $scope.lifeQuoteResponse = [];
                                    RestAPI.invoke($scope.globalLabel.getRequest.quoteLife, $scope.quote).then(function(callback) {
                                        $rootScope.lifeQuoteRequest = [];

                                        if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                            //$scope.dataLoaded=false;
                                            $scope.slickLoaded = false;
                                            $scope.responseCodeList = [];

                                            $scope.requestId = callback.QUOTE_ID;

                                            localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.requestId);

                                            $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
                                            localStorageService.set("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);


                                            $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
                                            localStorageService.set("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);

                                            $rootScope.lifeQuoteRequest = callback.data;

                                            if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0) {
                                                $rootScope.lifeQuoteResult.length = 0;
                                            }
                                            angular.forEach($rootScope.lifeQuoteRequest, function(obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.transactionName = $scope.globalLabel.transactionName.lifeQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({
                                                    method: 'POST',
                                                    url: getQuoteCalcLink,
                                                    data: request
                                                }).
                                                success(function(callback, status) {
                                                    var lifeQuoteResponse = JSON.parse(callback);
                                                    $scope.lifeQuoteResponse.push(callback);
                                                    if (lifeQuoteResponse.QUOTE_ID == $scope.requestId)
                                                        $scope.responseCodeList.push(lifeQuoteResponse.responseCode);
                                                    if (lifeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success && lifeQuoteResponse.QUOTE_ID == $scope.requestId) {
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
                                                            } else {}
                                                        }

                                                        for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
                                                            if ($rootScope.lifeQuoteRequest[i].messageId == lifeQuoteResponse.messageId) {
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
                                                                $rootScope.lifeQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
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
                                                //$rootScope.loading = false;

                                                    if ($scope.responseCodeList.length == $scope.lifeQuoteRequest.length) {
                                                    $rootScope.loading = false;
                                                    for (var i = 0; i < $rootScope.lifeQuoteRequest.length; i++) {
                                                        if ($rootScope.lifeQuoteRequest[i].status == 0) {
                                                            $rootScope.lifeQuoteRequest[i].status = 2;
                                                            $rootScope.lifeQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
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
                                            if (String($rootScope.lifeQuoteResult) != "undefined" && $rootScope.lifeQuoteResult.length > 0)
                                                $rootScope.lifeQuoteResult.length = 0;

                                            $rootScope.lifeQuoteResult = [];
                                            $scope.errorMessage(callback.message);
                                        }
                                        // Function created to get Product Features and update Quote Result Object Initially - modification-0009
                                        function getAllProductFeatures(selectedProduct, productFetchStatus) {
                                            //
                                            var variableReplaceArray = [];
                                            var productFeatureJSON = {};
                                            var customFeaturesJSON = {};

                                            $rootScope.consolidatedBenefitsList = [];
                                            $rootScope.consolidatedSavingsList = [];
                                            $rootScope.consolidatedFlexibilityList = [];


                                            productFeatureJSON.documentType = $scope.globalLabel.documentType.lifeProduct;
                                            productFeatureJSON.carrierId = selectedProduct.carrierId;
                                            productFeatureJSON.productId = selectedProduct.productId;
                                            productFeatureJSON.businessLineId = 1;

                                            var selectedCarrierId = selectedProduct.carrierId;
                                            var selectedProductId = selectedProduct.productId;

                                            for (var i = 0; i < $rootScope.carrierDetails.brochureList.length; i++) {
                                                if (selectedProduct.carrierId == $rootScope.carrierDetails.brochureList[i].carrierId)
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

                                            setTimeout(function() {
                                                redirectURL = redirectURL.replace(urlPattern, '/lifeResult');
                                                $window.location = redirectURL;
                                            }, 500);
                                        }

                                    });
                                });

                                // });
                            });

                            //}
                            /*}

                            		});*/
                        }
                        if ($scope.selectedBusinessLineId == 2) {
                           // $rootScope.loaderContent = { businessLine: '2', header: 'Bike Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.bike.proverbInstantQuote) };
                            $rootScope.title = $scope.globalLabel.policies365Title.bikeResultQuote;

                            $scope.bikeInsuranceTypes = bikeInsuranceTypeGeneric;
                            $scope.ncbList = ncbListGeneric;
                            $scope.policyStatusList = policyStatusListGeneric;
                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                            localStorageService.set("ridersBikeStatus", false);

                            $scope.bikeInstantQuoteCalculation = function(addOnCoverList) {
                                //	Calculating default riders from DB.

                                addRidersToDefaultQuoteBike(addOnCoverList, localStorageService.get("selectedBusinessLineId"), function(defaultRiderList, defaultRiderArrayObject) {
                                    $scope.vehicleDetails.riderArrayObject = defaultRiderArrayObject;
                               //     localStorageService.set("bikeDefaultRiderArrayObject", defaultRiderArrayObject);
                                    localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);



                                    // Function created to update bike model list.
                                    // $scope.updateBikeModelList=function(selectedMake, quoteCallStatus)
                                    // {
                                    // 	$scope.vehicleInfo.name	= selectedMake.make;
                                    // 	$scope.modelNames = selectedMake.models;

                                    // 	if($scope.vehicleInfo.model){
                                    // 		for(var i=0;i<$scope.modelNames.length;i++)
                                    // 		{
                                    // 			if($scope.modelNames[i].model.toLowerCase()==$scope.vehicleInfo.model.toLowerCase())
                                    // 			{
                                    // 				$scope.vehicleDetails.bikeModelObject = $scope.modelNames[i];
                                    // 				break;
                                    // 			}
                                    // 		}
                                    // 	}else{
                                    // 		$scope.vehicleDetails.bikeModelObject = $scope.modelNames[0];
                                    // 	}

                                    // 	if(quoteCallStatus == 0){
                                    // 		$rootScope.viewOptionDisabled = true;
                                    // 		$scope.vehicleDetails.bikeModelObject = undefined;
                                    // 		$scope.variantNames = undefined;
                                    // 		$scope.vehicleDetails.bikeVariantObject = undefined
                                    // 	}else{
                                    // 		$scope.updateBikeVariantList($scope.vehicleDetails.bikeModelObject, quoteCallStatus);
                                    // 	}
                                    // };

                                    // Function created to update bike variant list.
                                    // $scope.updateBikeVariantList=function(selectedModel, quoteCallStatus)
                                    // {
                                    // 	$scope.vehicleInfo.model = selectedModel.model;
                                    // 	$scope.variantNames = selectedModel.varients;

                                    // 	if($scope.vehicleInfo.variant){
                                    // 		for(var i=0;i<$scope.variantNames.length;i++)
                                    // 		{
                                    // 			if($scope.variantNames[i].variant.toLowerCase()==$scope.vehicleInfo.variant.toLowerCase())
                                    // 			{
                                    // 				$scope.vehicleDetails.bikeVariantObject = $scope.variantNames[i];
                                    // 				break;
                                    // 			}
                                    // 		}
                                    // 	}else{
                                    // 		$scope.vehicleDetails.bikeVariantObject =$scope.variantNames[0];
                                    // 	}
                                    // 	if(quoteCallStatus == 0){
                                    // 		$scope.vehicleDetails.bikeVariantObject = undefined;
                                    // 	}else{
                                    // 		$scope.getBikeCubicCapacityAndCalQuote($scope.vehicleDetails.bikeVariantObject, quoteCallStatus);
                                    // 	}
                                    // };
                                    // Function created to get cubic capacity, showroomPrice, vehicleType.
                                    // $scope.getBikeCubicCapacityAndCalQuote = function(selectedVariant, quoteCallStatus){
                                    // 	$scope.vehicleInfo.variant = selectedVariant.variant;
                                    // 	$scope.quoteParam.cubicCapacity = selectedVariant.cubicCapacity;
                                    // 	$scope.quoteParam.showRoomPrice = selectedVariant.showroomPrice;
                                    // 	$scope.vehicleInfo.vehicleType = selectedVariant.vehicleType;
                                    // 	$scope.vehicleInfo.variantId = selectedVariant.variantId;
                                    // 	if(quoteCallStatus != 0){
                                    // 		//for wordPress
                                    // 		/*if(!$rootScope.wordPressEnabled){	
                                    // 			$scope.singleClickBikeQuote();
                                    // 		}*/
                                    // 	}
                                    // };

                                    // Quote result premium slider.
                                    $scope.updateBikeAnnualPremiumRange = function(minPremiumValue, maxPremiumValue) {
                                        if (minPremiumValue > maxPremiumValue) {
                                            $rootScope.minAnnualPremium = maxPremiumValue;
                                            $rootScope.maxAnnualPremium = minPremiumValue;
                                        } else {
                                            $rootScope.minAnnualPremium = minPremiumValue;
                                            $rootScope.maxAnnualPremium = maxPremiumValue;
                                        }
                                    };
                                    $scope.bikeErrorMessage = function(errorMsg) {
                                        if ($scope.errorRespCounter && (String($rootScope.bikeQuoteResult) == "undefined" || $rootScope.bikeQuoteResult.length == 0)) {
                                            $scope.errorRespCounter = false;
                                            $scope.updateBikeAnnualPremiumRange(1000, 5000);
                                            $rootScope.instantQuoteSummaryStatus = false;
                                            $rootScope.instantQuoteSummaryError = errorMsg;
                                            $rootScope.viewOptionDisabled = true;
                                            $rootScope.tabSelectionStatus = true;
                                            $rootScope.disableBikeRegPopup = false;
                                            $rootScope.loading = false;
                                        } else if ($rootScope.bikeQuoteResult.length > 0) {
                                            $rootScope.instantQuoteSummaryStatus = true;
                                            $rootScope.viewOptionDisabled = false;
                                            $rootScope.tabSelectionStatus = true;
                                            $rootScope.disableBikeRegPopup = false;
                                            $rootScope.loading = false;
                                        }
                                    };

                                    $scope.bikeTooltipPrepare = function(bikeResult) {
                                        var riderCount = 0;
                                        // $rootScope.exclusiveDiscounts = $rootScope.tooltipContent.discountOptions;
                                        // $rootScope.quotesDesc = $rootScope.tooltipContent.quotesDesc;
                                        $rootScope.riderOptionList = "<ul style='text-align: left;' class='tickpoints'>";
                                        for (var i = 0; i < defaultRiderArrayObject.length; i++) {
                                            if (defaultRiderArrayObject[i].isEnable == "Y") {
                                                riderCount += 1;
                                                $rootScope.riderOptionList += "<li>" + defaultRiderArrayObject[i].riderName + "</li>";
                                            }
                                        }
                                        $rootScope.riderOptionList += "</ul>";

                                        var resultCarrierId = [];
                                        var testCarrierId = [];
                                        for (i = 0; i < bikeResult.length; i++) {
                                            //push only net premium if greater than 0
                                            if (Number(bikeResult[i].netPremium) > 0) {
                                                var carrierInfo = {};
                                                carrierInfo.id = bikeResult[i].carrierId;
                                                carrierInfo.name = bikeResult[i].insuranceCompany;
                                                carrierInfo.annualPremium = bikeResult[i].netPremium;
                                                carrierInfo.claimsRating = bikeResult[i].insurerIndex;
                                                if ($rootScope.wordPressEnabled) {
                                                    carrierInfo.businessLineId = "2";
                                                    carrierInfo.insuredDeclareValue = bikeResult[i].insuredDeclareValue;
                                                }
                                                /*if(testCarrierId.includes(bikeResult[i].carrierId) == false){
                                                			resultCarrierId.push(carrierInfo);
                                                			testCarrierId.push(bikeResult[i].carrierId);
                                                		}*/
                                                if (p365Includes(testCarrierId, bikeResult[i].carrierId) == false) {
                                                    resultCarrierId.push(carrierInfo);
                                                    testCarrierId.push(bikeResult[i].carrierId);
                                                }
                                            }
                                        }
                                        $rootScope.resultCarrierId = resultCarrierId;
                                        //$rootScope.quoteResultInsurerList = $rootScope.tooltipContent.quoteDesc + "\n<ul style='text-align: left;' class='tickpoints'>";
                                        for (i = 0; i < resultCarrierId.length; i++) {
                                            $rootScope.quoteResultInsurerList += "<li>" + resultCarrierId[i].name + "</li>";
                                        }
                                        $rootScope.quoteResultInsurerList += "</ul>";

                                        // $rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
                                        $rootScope.calculatedQuotesLength = (String(bikeResult.length)).length == 2 ? String(bikeResult.length) : ("0" + String(bikeResult.length));
                                        $rootScope.calculatedRidersLength = (String(riderCount)).length == 2 ? String(riderCount) : ("0" + String(riderCount));
                                        setTimeout(function() {

                                            scrollv = new scrollable({
                                                wrapperid: "scrollable-v",
                                                moveby: 4,
                                                mousedrag: true
                                            });

                                        }, 2000);
                                    };
                                    $scope.processBikeResult = function() {
                                        if ($rootScope.bikeQuoteResult.length > 0) {
                                            //for wordPress
                                            $rootScope.enabledProgressLoader = false;

                                            $rootScope.viewOptionDisabled = false;
                                            $rootScope.tabSelectionStatus = true;
                                            $rootScope.modalShown = false;
                                            $scope.instantQuoteBikeForm = false;
                                            $rootScope.disableBikeRegPopup = false;
                                            $rootScope.loading = false;
                                            //for campaign
                                            $rootScope.campaignFlag = true;

                                            $rootScope.bikeQuoteResult = $filter('orderBy')($rootScope.bikeQuoteResult, 'grossPremium');

                                            var minAnnualPremiumValue = $rootScope.bikeQuoteResult[0].grossPremium;
                                            var annualPremiumSliderArray = [];

                                            for (var j = 0; j < $rootScope.bikeQuoteResult.length; j++) {
                                                var calculatedDiscAmt = 0;
                                                var discountAmtList = $rootScope.bikeQuoteResult[j].bikeDiscountDetails;
                                                if (String(discountAmtList) != "undefined") {
                                                    for (var i = 0; i < discountAmtList.length; i++) {
                                                        calculatedDiscAmt += discountAmtList[i]["com.sutrr.quote.bikequotecalc.BikeDiscountDetails"].discountAmount;
                                                    }
                                                    calculatedDiscAmt += $rootScope.bikeQuoteResult[j].grossPremium;
                                                    annualPremiumSliderArray.push(calculatedDiscAmt);
                                                } else {
                                                    annualPremiumSliderArray.push($rootScope.bikeQuoteResult[j].grossPremium);
                                                }
                                            }

                                            annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
                                            $scope.updateBikeAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);

                                            if (localStorageService.get("selectedBusinessLineId") == 2)
                                                $scope.bikeTooltipPrepare($rootScope.bikeQuoteResult);
                                        }
                                    };
                                    // Instant quote calculation function.
                                    $scope.singleClickBikeQuote = function() {
                                        setTimeout(function() {
                                            //if($scope.bikeInstantQuoteForm.$valid){
                                            $scope.quote = {};
                                            $rootScope.instantQuoteSummaryStatus = true;
                                            $rootScope.viewOptionDisabled = true;
                                            $rootScope.tabSelectionStatus = false;
                                            $scope.errorRespCounter = true;
                                            $scope.instantQuoteBikeForm = true;
                                            $rootScope.disableBikeRegPopup = true;
                                            $rootScope.loading = true;

                                            // $scope.vehicleInfo.name	= $scope.vehicleDetails.bikeMakeObject.make;
                                            // $scope.vehicleInfo.model = $scope.vehicleDetails.bikeModelObject.model;
                                            // $scope.vehicleInfo.variant = $scope.vehicleDetails.bikeVariantObject.variant;

                                            if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
                                                $scope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;
                                                $rootScope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;
                                                $scope.vehicleInfo.city = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                                                // $scope.quoteParam.zone = $rootScope.vehicleInfo.selectedRegistrationObject.zone;
                                                // $scope.vehicleInfo.isCostal = $rootScope.vehicleInfo.selectedRegistrationObject.isCostal;
                                                // $scope.vehicleInfo.isEarthQuakeArea = $rootScope.vehicleInfo.selectedRegistrationObject.isEarthQuakeArea;
                                                $scope.vehicleInfo.RTOCode = $rootScope.vehicleInfo.selectedRegistrationObject.regisCode;
                                                $scope.vehicleInfo.state = $rootScope.vehicleInfo.selectedRegistrationObject.state;
                                                // $scope.quoteParam.customerpinCode = "";
                                                // $scope.quoteParam.customerCity = "";
                                                // $scope.quoteParam.customerState = "";
                                            } else {
                                                for (var i = 0; i < $scope.defaultMetroList.length; i++) {
                                                    if ($scope.defaultMetroList[i].cityName == $scope.vehicleInfo.city) {
                                                        for (var j = 0; j < $scope.defaultMetroList[i].RTODetails.length; j++) {
                                                            var selectedMetroDetails = $scope.defaultMetroList[i].RTODetails[j];
                                                            if (selectedMetroDetails.display == $scope.vehicleInfo.registrationPlace) {
                                                              //  $scope.quoteParam.zone = selectedMetroDetails.zone;
                                                                $scope.vehicleInfo.city = selectedMetroDetails.city;
                                                                // $scope.vehicleInfo.isCostal = selectedMetroDetails.isCostal;
                                                                // $scope.vehicleInfo.isEarthQuakeArea = selectedMetroDetails.earthQuakeArea;
                                                                $scope.vehicleInfo.RTOCode = selectedMetroDetails.regisCode;
                                                                $scope.vehicleInfo.state = selectedMetroDetails.state;
                                                                // $scope.quoteParam.customerpinCode = "";
                                                                // $scope.quoteParam.customerCity = "";
                                                                // $scope.quoteParam.customerState = "";
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            $scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
                                            $scope.vehicleDetails.showBikeRegAreaStatus = $rootScope.showBikeRegAreaStatus;
                                            //$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0,2)+$scope.vehicleInfo.registrationPlace.substr(3,2).trim();


                                            var todayDate = new Date();
                                            if ($scope.quoteParam.policyType == $scope.bikeInsuranceTypes[0].value) {
                                                $scope.vehicleInfo.dateOfRegistration = ("0" + todayDate.getDate().toString()).substr(-2) + "/" + ("0" + (Number(todayDate.getMonth()) + 1).toString()).substr(-2) + "/" + $scope.vehicleInfo.regYear;
                                                $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");
                                            } else {
                                                /*$scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleInfo.regYear;*/
                                                /*commented based on uday for HDFC*/
                                                //$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleInfo.regYear;
                                                //added based on uday's discussion
                                                var current_Year = todayDate.getFullYear();
                                                if (current_Year == $scope.vehicleInfo.regYear) {
                                                    $scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleInfo.regYear;
                                                } else {
                                                    $scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleInfo.regYear;
                                                }
                                                convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function(formattedPolicyExpiryDate) {
                                                    var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPolicyExpiryDate));
                                                    var tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
                                                    tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));

                                                    if (tempCalcPrevPolStartDate.setHours(0, 0, 0, 0) < new Date($scope.vehicleInfo.dateOfRegistration).setHours(0, 0, 0, 0)) {
                                                        $scope.vehicleInfo.PreviousPolicyStartDate = $scope.vehicleInfo.dateOfRegistration;
                                                    } else {
                                                        convertDateFormatToString(tempCalcPrevPolStartDate, function(formattedPrevPolStartDate) {
                                                            $scope.vehicleInfo.PreviousPolicyStartDate = formattedPrevPolStartDate;
                                                        });
                                                    }
                                                });
                                            }
                                            localStorageService.set("selectedBusinessLineId", 2);
                                            //$scope.quoteParam.vehicleAge = getAgeFromDOB($scope.vehicleInfo.dateOfRegistration);				
                                            //$scope.vehicleDetails.manufacturingYear = $scope.vehicleInfo.regYear;
                                            //$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
                                            //$scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");

                                            //$scope.quoteParam.riders  = defaultRiderList;
                                            //$scope.vehicleDetails.riderArrayObject = defaultRiderArrayObject;
                                            localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);

                                            if($scope.quoteParam.policyType == "renew"){
                                            if ($scope.vehicleInfo.previousClaim == "true" || $scope.vehicleDetails.policyStatus.key == $scope.policyStatusList[0].key ||
                                                  $scope.vehicleDetails.policyStatus.key == 1)
                                                $scope.quoteParam.ncb = 0;
                                            else
                                                $scope.quoteParam.ncb = $scope.vehicleDetails.ncb.value;
                                            }else{
                                                $scope.quoteParam.ncb = 0;
                                            }
                                            //$scope.quoteParam.policyExpiredAge = $scope.vehicleDetails.expiry / 365;

                                            //idv option is set to best deal based on Uday's discussion
                                            $scope.vehicleDetails.idvOption = 1;

                                            //explicity added to make IDV as 0, as we come from LMS system, request was taking the LMS actual vale as IDV
                                            $scope.vehicleInfo.IDV = 0;
                                            $scope.quoteParam.userIdv = 0;
                                            delete $scope.vehicleInfo.best_quote_id

                                            if(request.docId =="DefaultBikeQuote"){
                                                var today = new Date();                                              
                                                var current_date = ("0" + today.getDate().toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +today.getFullYear() ; 
                                                var prev_date = ("0" + (Number(today.getDate()) + 1).toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +(Number(today.getFullYear()) - 1).toString() ; 
                                               
                                                $scope.vehicleInfo.PreviousPolicyExpiryDate = current_date;
                                                $scope.vehicleInfo.PreviousPolicyStartDate = prev_date;
                                            }

                                            $scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
                                            $scope.quote.quoteParam = $scope.quoteParam;
                                            $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                            $scope.quote.requestType = $scope.globalLabel.request.bikeRequestType;
                                         //   localStorageService.set("bikeDefaultRiderArrayObject", defaultRiderArrayObject);
                                            localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
                                            localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);

                                            //added to reset idv on cancel of your idv pop-up
                                            $rootScope.idvOptionCopy = angular.copy($scope.vehicleDetails.idvOption);
                                            // Google Analytics Tracker added.
                                            //analyticsTrackerSendData($scope.quote);
                                            $scope.requestId = null;

                                            $rootScope.bikeQuoteResult = [];
                                            $scope.bikeQuoteResponse = [];
                                            // Service call for quote calculation.
                                            RestAPI.invoke($scope.globalLabel.getRequest.quoteBike, $scope.quote).then(function(callback) {
                                                $rootScope.bikeQuoteRequest = [];

                                                if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                                    $scope.responseCodeList = [];

                                                    $scope.requestId = callback.QUOTE_ID;

                                                    localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.requestId);

                                                    $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
                                                    localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);

                                                    localStorageService.set("BIKE_best_quote_id", $scope.requestId);
                                                    $rootScope.bikeQuoteRequest = callback.data;

                                                    if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0) {
                                                        $rootScope.bikeQuoteResult.length = 0;
                                                    }
                                                    //for olark
                                                    // olarkCustomParam(localStorageService.get("BIKE_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),true);
                                                    angular.forEach($rootScope.bikeQuoteRequest, function(obj, i) {
                                                        var request = {};
                                                        var header = {};

                                                        header.messageId = messageIDVar;
                                                        header.campaignID = campaignIDVar;
                                                        header.source = sourceOrigin;
                                                        header.transactionName = $scope.globalLabel.transactionName.bikeQuoteResult;
                                                        header.deviceId = deviceIdOrigin;
                                                        request.header = header;
                                                        request.body = obj;

                                                        $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                        success(function(callback, status) {
                                                            var bikeQuoteResponse = JSON.parse(callback);
                                                            $scope.bikeQuoteResponse.push(callback);
                                                            if (bikeQuoteResponse.QUOTE_ID == $scope.requestId) {
                                                                $scope.responseCodeList.push(bikeQuoteResponse.responseCode);

                                                                if (bikeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                                    for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
                                                                        if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
                                                                            $rootScope.bikeQuoteResult.push(bikeQuoteResponse.data.quotes[0]);
                                                                            $rootScope.bikeQuoteRequest[i].status = 1;
                                                                        }
                                                                    }
                                                                    $scope.processBikeResult();
                                                                    $scope.checkForRedirect();
                                                                } else {
                                                                    for (i = 0; i < $rootScope.bikeQuoteRequest.length; i++) {
                                                                        if ($rootScope.bikeQuoteRequest[i].messageId == bikeQuoteResponse.messageId) {
                                                                            $rootScope.bikeQuoteRequest[i].status = 2;
                                                                            //$rootScope.bikeQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                                            //comments updated based on Uday
                                                                            $rootScope.bikeQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg);
                                                                        }
                                                                    }
                                                                    $scope.checkForRedirect();
                                                                }
                                                            }
                                                        }).
                                                        error(function(data, status) {
                                                            $scope.responseCodeList.push($scope.globalLabel.responseCode.systemError);
                                                        });
                                                    });

                                                    $scope.$watch('responseCodeList', function(newValue, oldValue, scope) {
                                                        //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success))
                                                        //$rootScope.loading = false;
                                                        if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
                                                            $rootScope.loading = false;
                                                        if ($scope.responseCodeList.length == $rootScope.bikeQuoteRequest.length) {
                                                            $rootScope.loading = false;
                                                            //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
                                                            if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
                                                                // This condition will satisfy only when at least one product is found in the quoteResponse array.
                                                                //}else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
                                                            } else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
                                                                $scope.bikeErrorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
                                                            } else {
                                                                //$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
                                                                //comments updated based on Uday
                                                                $scope.bikeErrorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg));
                                                            }
                                                        }
                                                    }, true);
                                                } else {
                                                    $scope.responseCodeList = [];

                                                    if (String($rootScope.bikeQuoteResult) != "undefined" && $rootScope.bikeQuoteResult.length > 0)
                                                        $rootScope.bikeQuoteResult.length = 0;

                                                    $rootScope.bikeQuoteResult = [];
                                                    $scope.bikeErrorMessage(callback.message);
                                                }
                                            });
                                            //}
                                        }, 100);
                                    };
                                    $scope.prepopulateBikeFields = function() {
                                        $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                        if ($scope.vehicleInfo.registrationNumber) {
                                            $rootScope.showBikeRegAreaStatus = false;
                                            $scope.vehicleDetails.registrationNumber = $scope.vehicleInfo.registrationNumber;
                                        } else {
                                            $rootScope.showBikeRegAreaStatus = true;
                                        }

                                        $scope.vehicleDetails.policyType = $scope.quoteParam.policyType;
                                            var i;
                                            console.log('$scope.vehicleInfo.previousPolicyExpired is in step 1 is:::: ',$scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousPolicyExpired);
                                            if($scope.bikeResponse.bikeQuoteRequest.quoteParam.policyType == 'renew'){ 
                                            if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousPolicyExpired == 'N'){
                                                $scope.vehicleDetails.policyStatusKey = 3;
                                             }else if($scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousPolicyExpired == 'Y'){
                                                var today = new Date();
                                                var priorDate = new Date(today.setDate(new Date().getDate() - 90));
                                                var prevDate = priorDate.getDate()+"/"+(priorDate.getMonth()+1)+"/"+priorDate.getFullYear();
                                                var prevDate1 = new Date(prevDate);
                                                var prevDate2 = new Date($scope.vehicleInfo.PreviousPolicyExpiryDate);
                                    
                                                if(prevDate1 < prevDate2){
                                                $scope.vehicleDetails.policyStatusKey = 2;
                                                }else{
                                                $scope.vehicleDetails.policyStatusKey = 1;
                                                }
                                             }
                                            }
                                            $scope.vehicleDetails.expiry = 20;
                                            $scope.vehicleDetails.maxVehicleAge = 15;
                                            $scope.vehicleDetails.registrationNumber = $scope.vehicleInfo.registrationNumber;
                                            $scope.vehicleDetails.showBikeRegAreaStatus = $rootScope.showBikeRegAreaStatus;
                                            $scope.vehicleDetails.regYear = $scope.vehicleInfo.dateOfRegistration.split("/")[2];
                                            $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                                            $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                                            $scope.vehicleDetails.policyType = $scope.bikeResponse.bikeQuoteRequest.quoteParam.policyType;
                                            $scope.vehicleDetails.idvOption = $scope.vehicleInfo.idvOption;
                                            $scope.vehicleDetails.previousPolicyExpired = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.previousPolicyExpired;
                                            if($scope.vehicleInfo.make && $scope.vehicleInfo.model && $scope.vehicleInfo.variant){
                                            $scope.vehicleDetails.displayVehicle = $scope.vehicleInfo.make+" "+$scope.vehicleInfo.model+" "+$scope.vehicleInfo.variant;
                                            }else{
                                            $scope.vehicleDetails.displayVehicle = $scope.bikeResponse.bikeQuoteRequest.vehicleInfo.displayVehicle;    
                                            }
                                            //$scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.bikeResponse.encryptedQuoteId;
                                            localStorageService.set("bike_best_quote_id", $scope.vehicleInfo.best_quote_id);
                                            localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);
                                            localStorageService.set("BIKE_UNIQUE_QUOTE_ID", $scope.BIKE_UNIQUE_QUOTE_ID);
                                            localStorageService.set("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
                                            localStorageService.set("bikeQuoteInputParamaters", $scope.quote);
                                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);

                                        //Fetching selected bike details 
                                        var i;
                                        for (var i = 0; i < $scope.policyStatusList.length; i++) {
                                            if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
                                                $scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
                                                break;
                                            }
                                        }
                                        console.log('$scope.vehicleDetails.policyStatus is in step 2: ',$scope.vehicleDetails.policyStatus)
                                        for (i = 0; i < $scope.bikeInsuranceTypes.length; i++) {
                                            if ($scope.quoteParam.policyType == $scope.bikeInsuranceTypes[i].value) {
                                                $scope.vehicleDetails.insuranceType = $scope.bikeInsuranceTypes[i];
                                                break;
                                            }
                                        }
                                        for (i = 0; i < $scope.ncbList.length; i++) {
                                            if ($scope.quoteParam.ncb == $scope.ncbList[i].value) {
                                                $scope.vehicleDetails.ncb = $scope.ncbList[i];
                                                break;
                                            }
                                        }

                                        $scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);


                                        $scope.alterRenewal();
                                        localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);
                                         
                                        if ($rootScope.affilateUser) {
                                            $scope.singleClickBikeQuote();
                                        } else if (!$scope.view) {                                           
                                            if($rootScope.agencyPortalEnabled){
                                                $scope.redirectResultScreen();
                                            }else{
                                               // $scope.leadCreationUserInfo();
                                                if(localStorageService.get("quoteUserInfo")){
                                                    $scope.redirectResultScreen();
                                                }else{
                                                    $scope.leadCreationUserInfo();
                                                }
                                            }         
                                            // })
                                        } else if ($scope.view) {
                                            $scope.redirectResultScreen();
                                        }
                                    }
                                    $scope.prepopulateBikeFields();
                                });
                            };

                            if (!localStorageService.get("ridersBikeStatus")) {

                                    getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.bike, $scope.globalLabel.request.findAppConfig, function(addOnCoverList) {
                                        localStorageService.set("addOnCoverListForBike", addOnCoverList);
                                        localStorageService.set("ridersBikeStatus", true);
                                       
                                        getListFromDB(RestAPI, "", "BikeVariants", $scope.globalLabel.request.findAppConfig, function(callbackCar5) {
                                            if (callbackCar5.responseCode == $scope.globalLabel.responseCode.success) {
                                                localStorageService.set("bikeMakeListDisplay", callbackCar5.data);
                                                $scope.bikeInstantQuoteCalculation(addOnCoverList);
                                            }
                                        });
                                    });
                                   
                            } else {
                                // $rootScope.tooltipContent = localStorageService.get("bikeInstantQuoteTooltipContent");
                                $scope.bikeInstantQuoteCalculation(localStorageService.get("addOnCoverListForBike"));
                            }

                        } else if ($scope.selectedBusinessLineId == 3) {
                            //$rootScope.showCarRegAreaStatus = true;
                           // $rootScope.loaderContent = { businessLine: '3', header: 'Car Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.car.proverbInstantQuote) };
                            $rootScope.title = $scope.globalLabel.policies365Title.carResultQuote;


                            $scope.carInsuranceTypes = carInsuranceTypeGeneric;
                            $scope.ncbList = ncbListGeneric;

                            localStorageService.set("selectedBusinessLineId", 3);
                            localStorageService.set("ridersCarStatus", false);
                            // Update quote annual premium range.
                            $scope.updateCarAnnualPremiumRange = function(minPremiumValue, maxPremiumValue) {
                                if (minPremiumValue > maxPremiumValue) {
                                    $rootScope.minAnnualPremium = maxPremiumValue;
                                    $rootScope.maxAnnualPremium = minPremiumValue;
                                } else {
                                    $rootScope.minAnnualPremium = minPremiumValue;
                                    $rootScope.maxAnnualPremium = maxPremiumValue;
                                }
                            };

                            $scope.carErrorMessage = function(errorMsg) {
                                if ($scope.errorRespCounter && (String($rootScope.carQuoteResult) == "undefined" || $rootScope.carQuoteResult.length == 0)) {
                                    $scope.errorRespCounter = false;
                                    $scope.updateCarAnnualPremiumRange(1000, 5000);
                                    $rootScope.instantQuoteSummaryStatus = false;
                                    $rootScope.instantQuoteSummaryError = errorMsg;
                                    $rootScope.viewOptionDisabled = true;
                                    $rootScope.tabSelectionStatus = true;
                                    $scope.instantQuoteCarForm = false;
                                    $rootScope.disableCarRegPopup = false;
                                } else if ($rootScope.carQuoteResult.length > 0) {
                                    $rootScope.instantQuoteSummaryStatus = true;
                                    $rootScope.viewOptionDisabled = false;
                                    $rootScope.tabSelectionStatus = true;
                                    $scope.instantQuoteCarForm = false;
                                    $rootScope.disableCarRegPopup = false;
                                }
                                $rootScope.loading = false;
                            };

                            // Preparing tooltip to be displayed on instant quote screen.
                            $scope.carTooltipPrepare = function(carResult) {
                                var riderCount = 0;
                                var i;
                                var resultCarrierId = [];
                                var testCarrierId = [];

                                for (i = 0; i < carResult.length; i++) {
                                    //push only net premium if greater than 0
                                    if (Number(carResult[i].netPremium) > 0) {
                                        var carrierInfo = {};
                                        carrierInfo.id = carResult[i].carrierId;
                                        carrierInfo.name = carResult[i].insuranceCompany;
                                        /*carrierInfo.annualPremium = carResult[i].grossPremium;*/
                                        carrierInfo.annualPremium = carResult[i].netPremium;
                                        carrierInfo.claimsRating = carResult[i].insurerIndex;
                                        if ($rootScope.wordPressEnabled) {
                                            carrierInfo.insuredDeclareValue = carResult[i].insuredDeclareValue;
                                            carrierInfo.businessLineId = "2";
                                        }
                                        if (p365Includes(testCarrierId, carResult[i].carrierId) == false) {
                                            resultCarrierId.push(carrierInfo);
                                            testCarrierId.push(carResult[i].carrierId);
                                        }
                                    }
                                }

                                $rootScope.resultedCarriers = resultCarrierId;
                                $rootScope.resultCarrierId = resultCarrierId;

                                // if($rootScope.tooltipContent)
                                // 	$rootScope.exclusiveDiscountsLength = $rootScope.tooltipContent.countDiscountOptions;
                                $rootScope.calculatedQuotesLength = (String(carResult.length)).length == 2 ? String(carResult.length) : ("0" + String(carResult.length));
                                $rootScope.calculatedRidersLength = (String(riderCount)).length == 2 ? String(riderCount) : ("0" + String(riderCount));
                                setTimeout(function() {

                                    scrollv = new scrollable({
                                        wrapperid: "scrollable-v",
                                        moveby: 4,
                                        mousedrag: true
                                    });
                                }, 2000);
                            };

                            // Processing of quote result to displayed on UI.
                            $scope.processCarResult = function() {
                                if ($rootScope.carQuoteResult.length > 0) {
                                    $rootScope.viewOptionDisabled = false;
                                    $rootScope.tabSelectionStatus = true;
                                    $rootScope.modalShown = false;
                                    $scope.instantQuoteCarForm = false;
                                    $rootScope.disableCarRegPopup = false;
                                    $rootScope.loading = false;
                                    //for campaign
                                    $rootScope.campaignFlag = true;
                                    //for wordPress
                                    $rootScope.enabledProgressLoader = false;
                                    $rootScope.carQuoteResult = $filter('orderBy')($rootScope.carQuoteResult, 'grossPremium');
                                    var minAnnualPremiumValue = $rootScope.carQuoteResult[0].grossPremium;
                                    var annualPremiumSliderArray = [];

                                    for (var j = 0; j < $rootScope.carQuoteResult.length; j++) {
                                        var calculatedDiscAmt = 0;
                                        var discountAmtList = $rootScope.carQuoteResult[j].discountDetails;
                                        if (String(discountAmtList) != "undefined") {
                                            for (var i = 0; i < discountAmtList.length; i++) {
                                                calculatedDiscAmt += discountAmtList[i]["com.sutrr.quote.carquotecalc.DiscountDetails"].discountAmount;
                                            }
                                            calculatedDiscAmt += $rootScope.carQuoteResult[j].grossPremium;
                                            annualPremiumSliderArray.push(calculatedDiscAmt);
                                        } else {
                                            annualPremiumSliderArray.push($rootScope.carQuoteResult[j].grossPremium);
                                        }
                                    }

                                    annualPremiumSliderArray = $filter('orderBy')(annualPremiumSliderArray);
                                    $scope.updateCarAnnualPremiumRange(minAnnualPremiumValue, annualPremiumSliderArray[annualPremiumSliderArray.length - 1]);

                                    //localStorageService.set("carQuoteCalculationResult", $rootScope.carQuoteResult);

                                    if (localStorageService.get("selectedBusinessLineId") == 3)
                                        $scope.carTooltipPrepare($rootScope.carQuoteResult);
                                }
                            };

                            // Instant quote calculation function.
                            $scope.singleClickCarQuote = function() {
                                setTimeout(function() {
                                    //if(!$scope.carInstantQuoteForm.$invalid){
                                    $scope.quote = {};
                                    $rootScope.instantQuoteSummaryStatus = true;
                                    $rootScope.instantQuoteInvalidSummaryStatus = true;
                                  // $scope.quoteParam.policyExpiredAge = 0;
                                    $rootScope.viewOptionDisabled = true;
                                    $rootScope.tabSelectionStatus = false;
                                    $scope.errorRespCounter = true;
                                    $scope.instantQuoteCarForm = true;
                                    $rootScope.disableCarRegPopup = true;
                                    $rootScope.loading = true;
                                    var todayDate = new Date();
                                    if ($scope.quoteParam.policyType == $scope.carInsuranceTypes[0].value) {
                                        $scope.vehicleInfo.dateOfRegistration = ("0" + todayDate.getDate().toString()).substr(-2) + "/" + ("0" + (Number(todayDate.getMonth()) + 1).toString()).substr(-2) + "/" + $scope.vehicleInfo.regYear;
                                        $scope.vehicleInfo.PreviousPolicyExpiryDate = makeObjectEmpty($scope.vehicleInfo.PreviousPolicyExpiryDate, "text");

                                    } else {

                                        /*$scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleInfo.regYear;*/
                                        /*commented based on uday for HDFC*/
                                        //$scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleInfo.regYear;
                                        //added based on uday's discussion
                                        var current_Year = todayDate.getFullYear();
                                        if (current_Year == $scope.vehicleInfo.regYear) {
                                            $scope.vehicleInfo.dateOfRegistration = "01/01/" + $scope.vehicleInfo.regYear;
                                        } else {
                                            $scope.vehicleInfo.dateOfRegistration = "01/07/" + $scope.vehicleInfo.regYear;
                                        }
                                        convertStringFormatToDate($scope.vehicleInfo.PreviousPolicyExpiryDate, function(formattedPolicyExpiryDate) {
                                            var tempPreviousPolicyExpiryDate = new Date(angular.copy(formattedPolicyExpiryDate));
                                            var tempCalcPrevPolStartDate = new Date(tempPreviousPolicyExpiryDate.setFullYear(new Date(tempPreviousPolicyExpiryDate).getFullYear() - 1));
                                            tempCalcPrevPolStartDate = new Date(new Date(String(tempCalcPrevPolStartDate)).setDate(new Date(String(tempCalcPrevPolStartDate)).getDate() + 1));

                                            if (tempCalcPrevPolStartDate.setHours(0, 0, 0, 0) < new Date($scope.vehicleInfo.dateOfRegistration).setHours(0, 0, 0, 0)) {
                                                $scope.vehicleInfo.PreviousPolicyStartDate = $scope.vehicleInfo.dateOfRegistration;
                                            } else {
                                                convertDateFormatToString(tempCalcPrevPolStartDate, function(formattedPrevPolStartDate) {
                                                    $scope.vehicleInfo.PreviousPolicyStartDate = formattedPrevPolStartDate;
                                                });
                                            }
                                        });
                                    }
                                    if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
                                        $scope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;
                                        $rootScope.vehicleInfo.registrationPlace = $rootScope.vehicleInfo.selectedRegistrationObject.display;
                                        $scope.quoteParam.zone = $rootScope.vehicleInfo.selectedRegistrationObject.zone;
                                        $scope.vehicleInfo.city = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                                        $scope.vehicleInfo.isCostal = $rootScope.vehicleInfo.selectedRegistrationObject.isCostal;
                                        $scope.vehicleInfo.isAutoAssociation = $rootScope.vehicleInfo.selectedRegistrationObject.isAutoAssociation;
                                        $scope.vehicleInfo.isEarthQuakeArea = $rootScope.vehicleInfo.selectedRegistrationObject.isEarthQuakeArea;
                                        $scope.vehicleInfo.RTOCode = $rootScope.vehicleInfo.selectedRegistrationObject.regisCode;
                                        $scope.vehicleInfo.state = $rootScope.vehicleInfo.selectedRegistrationObject.state;
                                        $scope.quoteParam.customerpinCode = "";
                                        $scope.quoteParam.customerCity = "";
                                        $scope.quoteParam.customerState = "";
                                    } else {
                                        var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
                                        var selectedMetroDetails;

                                        for (var i = 0; i < $scope.defaultMetroList.length; i++) {
                                            if ($scope.defaultMetroList[i].cityName == cityName) {
                                                for (var j = 0; j < $scope.defaultMetroList[i].RTODetails.length; j++) {
                                                    selectedMetroDetails = $scope.defaultMetroList[i].RTODetails[j];
                                                    if (selectedMetroDetails.display == $scope.vehicleInfo.registrationPlace) {
                                                        $scope.quoteParam.zone = selectedMetroDetails.zone;
                                                        $scope.vehicleInfo.city = selectedMetroDetails.city;
                                                        $scope.vehicleInfo.isCostal = selectedMetroDetails.isCostal;
                                                        $scope.vehicleInfo.isAutoAssociation = selectedMetroDetails.isAutoAssociation;
                                                        $scope.vehicleInfo.isEarthQuakeArea = selectedMetroDetails.earthQuakeArea;
                                                        $scope.vehicleInfo.RTOCode = selectedMetroDetails.regisCode;
                                                        $scope.vehicleInfo.state = selectedMetroDetails.state;
                                                        $scope.quoteParam.customerpinCode = "";
                                                        $scope.quoteParam.customerCity = "";
                                                        $scope.quoteParam.customerState = "";
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    $scope.vehicleDetails.registrationNumber = String($rootScope.vehicleDetails.registrationNumber) != "undefined" ? $rootScope.vehicleDetails.registrationNumber : $scope.vehicleDetails.registrationNumber;
                                    $scope.vehicleDetails.showCarRegAreaStatus = $rootScope.showCarRegAreaStatus;
                                    //$scope.vehicleInfo.RTOCode = $scope.vehicleInfo.registrationPlace.substr(0,2)+$scope.vehicleInfo.registrationPlace.substr(3,2).trim();
                                    localStorageService.set("selectedBusinessLineId", 3);
                                    //$scope.quoteParam.documentType = $scope.globalLabel.documentType.quoteRequest;
                                   // $scope.quoteParam.quoteType = localStorageService.get("selectedBusinessLineId");

                                    var personDob = new Date(new Date().getFullYear() - 46);
                                    convertDateFormatToString(personDob, function(formattedDateOfBirth) {
                                        $scope.vehicleDetails.dateOfBirth = personDob;
                                        $scope.vehicleDetails.formattedDateOfBirth = formattedDateOfBirth;
                                    });

                                    if ($scope.vehicleInfo.previousClaim == "true" || $scope.vehicleDetails.policyStatus.key == $scope.policyStatusList[0].key ||
                                        $scope.quoteParam.policyType == "new")
                                        $scope.quoteParam.ncb = 0;
                                    else
                                        $scope.quoteParam.ncb = $scope.vehicleDetails.ncb.value;

                                    //idv option is set to best deal based on Uday's discussion
                                    $scope.vehicleDetails.idvOption = 1;
                                   // $scope.quoteParam.policyExpiredAge = $scope.vehicleDetails.expiry / 365;

                                    $scope.vehicleDetails.manufacturingYear = $scope.vehicleInfo.regYear;

                                    //explicity added to make IDV as 0, as we come from LMS system, request was taking the LMS actual vale as IDV
                                    $scope.vehicleInfo.IDV = 0;
                                   // $scope.quoteParam.userIdv = 0;

                                    //added IDV quote ID based on IDV selection in Result and removing as IDV is zero
                                    delete $scope.vehicleInfo.best_quote_id

                                    if(request.docId =="DefaultCarQuote"){
                                        var today = new Date();                                              
                                        var current_date = ("0" + today.getDate().toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +today.getFullYear() ; 
                                        var prev_date = ("0" + (Number(today.getDate()) + 1).toString()).substr(-2) + "/" + ("0" + (Number(today.getMonth()) + 1).toString()).substr(-2) + "/" +(Number(today.getFullYear()) - 1).toString() ; 
                                       
                                        $scope.vehicleInfo.PreviousPolicyExpiryDate = current_date;
                                        console.log('$scope.vehicleInfo.PreviousPolicyExpiryDate in default doc step 2 is',$scope.vehicleInfo.PreviousPolicyExpiryDate);
                                       // $scope.vehicleInfo.PreviousPolicyStartDate = prev_date;
                                       $scope.vehicleDetails.PreviousPolicyStartDate = prev_date;
                                    }

                                    $scope.vehicleInfo.idvOption = $scope.vehicleDetails.idvOption;
                                    $scope.quote.quoteParam = $scope.quoteParam;
                                    $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                    //$scope.quote.requestType = carRequestType;

                                    localStorageService.set("carQuoteInputParamaters", $scope.quote);
                                    localStorageService.set("selectedCarDetails", $scope.vehicleDetails);

                                    //For Reset
                                    //localStorageService.set("carQuoteInputParamatersReset", $scope.quote);
                                    //localStorageService.set("selectedCarDetailsReset", $scope.vehicleDetails);

                                    // Google Analytics Tracker added.
                                    //analyticsTrackerSendData($scope.quote);

                                    //added to reset idv on cancel of your idv pop-up
                                    $rootScope.idvOptionCopy = angular.copy($scope.vehicleDetails.idvOption);

                                    $scope.requestId = null;
                                    var quoteUserInfo = localStorageService.get("quoteUserInfo");
                                    // Service call for quote calculation.
                                    RestAPI.invoke(getCarQuote, $scope.quote).then(function(callback) {
                                        $rootScope.carQuoteRequest = [];

                                        if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                            $scope.responseCodeList = [];

                                            $scope.requestId = callback.QUOTE_ID;
                                            
                                            // if default quote is not loded in the agency portal 
                                            if(localStorageService.get("CAR_UNIQUE_QUOTE_ID") != "DefaultCarQuote" ){
                                                localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.requestId);
                                           
                                            }


                                            $scope.UNIQUE_QUOTE_ID_ENCRYPTED = callback.encryptedQuoteId;
                                            localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);


                                            localStorageService.set("CAR_best_quote_id", $scope.requestId);

                                            $rootScope.carQuoteRequest = callback.data;
                                            //for olark
                                            // olarkCustomParam(localStorageService.get("CAR_UNIQUE_QUOTE_ID"),localStorageService.get("selectedBusinessLineId"),localStorageService.get("quoteUserInfo"),true);

                                            if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0) {
                                                $rootScope.carQuoteResult.length = 0;
                                            }

                                            $rootScope.carQuoteResult = [];
                                            $scope.carQuoteResponse = [];
                                            angular.forEach($rootScope.carQuoteRequest, function(obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.messageId = messageIDVar;
                                                header.campaignID = campaignIDVar;
                                                header.source = sourceOrigin;

                                                header.transactionName = getCarQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function(callback, status) {
                                                    var carQuoteResponse = JSON.parse(callback);
                                                    $scope.carQuoteResponse.push(callback);
                                                    if (carQuoteResponse.QUOTE_ID == $scope.requestId) {
                                                        $scope.responseCodeList.push(carQuoteResponse.responseCode);

                                                        if (carQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                            for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                                                if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {

                                                                    $rootScope.carQuoteResult.push(carQuoteResponse.data.quotes[0]);
                                                                    $rootScope.carQuoteRequest[i].status = 1;
                                                                }
                                                            }
                                                            $scope.processCarResult();
                                                            $scope.checkForRedirect();
                                                        } else {
                                                            for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                                                if ($rootScope.carQuoteRequest[i].messageId == carQuoteResponse.messageId) {
                                                                    $rootScope.carQuoteRequest[i].status = 2;
                                                                    //$rootScope.carQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                                    //comments updated based on Uday
                                                                    $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg);
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
                                                //$rootScope.loading = false;
                                                if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
                                                    $rootScope.loading = false;
                                                if ($scope.responseCodeList.length == $rootScope.carQuoteRequest.length) {
                                                    $rootScope.loading = false;
                                                    $rootScope.setTooltip = false;

                                                    for (var i = 0; i < $rootScope.carQuoteRequest.length; i++) {
                                                        if ($rootScope.carQuoteRequest[i].status == 0) {
                                                            $rootScope.carQuoteRequest[i].status = 2;
                                                            //$rootScope.carQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                            //comments updated based on Uday
                                                            $rootScope.carQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg);
                                                        }
                                                    }

                                                    //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
                                                    if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
                                                        // This condition will satisfy only when at least one product is found in the quoteResponse array.
                                                        //}else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
                                                    } else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
                                                        $scope.carErrorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
                                                    } else {
                                                        //$scope.errorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
                                                        //comments updated based on Uday
                                                        $scope.carErrorMessage($sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMotorErrMsg));
                                                    }
                                                }
                                            }, true);
                                        } else {
                                            $scope.responseCodeList = [];
                                            if (String($rootScope.carQuoteResult) != "undefined" && $rootScope.carQuoteResult.length > 0)
                                                $rootScope.carQuoteResult.length = 0;

                                            $rootScope.carQuoteResult = [];
                                            $scope.carErrorMessage(callback.message);
                                        }
                                    });
                                    //}
                                }, 100);
                            };

                            $scope.prepopulateCarFields = function() {
                                $scope.quote.vehicleInfo = $scope.vehicleInfo;
                                if ($scope.vehicleInfo.registrationNumber) {
                                    $rootScope.showCarRegAreaStatus = false;
                                    $scope.vehicleDetails.registrationNumber = $scope.vehicleInfo.registrationNumber;
                                } else {
                                    $rootScope.showCarRegAreaStatus = true;
                                }

                                $scope.vehicleDetails.policyType = $scope.quoteParam.policyType;
                                //$scope.makeNames = localStorageService.get("carMakeList");

                                //logic written for third-party resource
                                if ($rootScope.affilateUser) {
                                    // if($location.search().make){
                                    // 	$scope.vehicleInfo.model='';
                                    // 	$scope.vehicleInfo.variant='';
                                    // 	$scope.vehicleInfo.fuel='';
                                    // 	$scope.vehicleInfo.name=$location.search().make.toLowerCase();
                                    // }
                                    // if($location.search().model){
                                    // 	$scope.vehicleInfo.variant='';
                                    // 	$scope.vehicleInfo.fuel='';
                                    // 	$scope.vehicleInfo.model=$location.search().model.toLowerCase();
                                    // }
                                    // if($location.search().fuel){
                                    // 	$scope.vehicleInfo.variant='';
                                    // 	$scope.vehicleInfo.name=$location.search().fuel.toLowerCase();
                                    // }
                                } else {
                                    // if ($scope.quoteParam.isRiderSelected == "Y" && $scope.quoteParam.policyType == "renew") {
                                    //     $rootScope.prevPolZeroDepStatus = true;
                                    // } else {
                                    //     $rootScope.prevPolZeroDepStatus = false;
                                    // }
                                    if($scope.carResponse.carQuoteRequest.quoteParam.policyType == 'renew'){
                                    if($scope.carResponse.carQuoteRequest.vehicleInfo.previousPolicyExpired == 'N'){
                                        $scope.vehicleDetails.policyStatusKey = 3;
                                     }else if($scope.carResponse.carQuoteRequest.vehicleInfo.previousPolicyExpired == 'Y'){
                                        var today = new Date();
                                        var priorDate = new Date(today.setDate(new Date().getDate() - 90));
                                        var prevDate = priorDate.getDate()+"/"+(priorDate.getMonth()+1)+"/"+priorDate.getFullYear();
                                        var prevDate1 = new Date(prevDate);
                                        var prevDate2 = new Date($scope.vehicleInfo.PreviousPolicyExpiryDate);
                                        
                                        if(prevDate1 < prevDate2){
                                        $scope.vehicleDetails.policyStatusKey = 2;
                                        }else{
                                        $scope.vehicleDetails.policyStatusKey = 1;
                                        }
                                     }
                                    }

                                    $scope.vehicleDetails.addOnCoverCustomAmount = {};
                                    $rootScope.selectedAddOnCovers = [];

                                    $scope.vehicleDetails.maxVehicleAge = 15;
                                    $scope.vehicleDetails.regYear = $scope.vehicleInfo.dateOfRegistration.split("/")[2];
                                    $scope.manufacturingYearList = listManufactureYear($scope.vehicleDetails.regYear, 2);
                                    $scope.vehicleDetails.manufacturingYear = $scope.manufacturingYearList[0];
                                    $scope.vehicleDetails.showCarRegAreaStatus = $rootScope.showCarRegAreaStatus;
                                    $scope.vehicleDetails.idvOption = $scope.vehicleInfo.idvOption;
                                    if($scope.vehicleInfo.displayVehicle){
										$scope.vehicleDetails.displayVehicle =  $scope.vehicleInfo.displayVehicle ;
									}else if($scope.vehicleInfo.make && $scope.vehicleInfo.model && $scope.vehicleInfo.variant && $scope.vehicleInfo.fuel && $scope.vehicleInfo.cubicCapacity){
									 	$scope.vehicleDetails.displayVehicle = $scope.vehicleInfo.make+" "+" "+$scope.vehicleInfo.model+" "+" "+$scope.vehicleInfo.variant+" "+" "+$scope.vehicleInfo.fuel+" "+" "+$scope.vehicleInfo.cubicCapacity;
                                    }else if($scope.vehicleInfo.make && $scope.vehicleInfo.model && $scope.vehicleInfo.variant && $scope.vehicleInfo.fuel){
                                        $scope.vehicleDetails.displayVehicle = $scope.vehicleInfo.make+" "+" "+$scope.vehicleInfo.model+" "+" "+$scope.vehicleInfo.variant+" "+" "+$scope.vehicleInfo.fuel;
                                   }else if($scope.vehicleInfo.make && $scope.vehicleInfo.model && $scope.vehicleInfo.variant){
                                    $scope.vehicleDetails.displayVehicle = $scope.vehicleInfo.make+" "+" "+$scope.vehicleInfo.model+" "+" "+$scope.vehicleInfo.variant;
                                  }
                                    
                                    // if default quote is not loded in the agency portal 
                                    if(localStorageService.get("CAR_UNIQUE_QUOTE_ID") != "DefaultCarQuote"){
                                        localStorageService.set("CAR_UNIQUE_QUOTE_ID", $scope.CAR_UNIQUE_QUOTE_ID);					
                                    }
                                    localStorageService.set("car_best_quote_id", $scope.CAR_UNIQUE_QUOTE_ID);
                                    localStorageService.set("CAR_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);
                                    localStorageService.set("carQuoteInputParamaters", $scope.quote);
                                    localStorageService.set("selectedCarDetails", $scope.vehicleDetails);
                                    localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                                }

                                //Fetching selected car details 
                                var i;
                                if($scope.quoteParam.policyType == 'renew'){
                                for (i = 0; i < $scope.policyStatusList.length; i++) {
                                    if ($scope.vehicleDetails.policyStatusKey == $scope.policyStatusList[i].key) {
                                        $scope.vehicleDetails.policyStatus = $scope.policyStatusList[i];
                                        break;
                                    }
                                }
                            }

                                for (i = 0; i < $scope.carInsuranceTypes.length; i++) {
                                    if ($scope.quoteParam.policyType == $scope.carInsuranceTypes[i].value) {
                                        $scope.vehicleDetails.insuranceType = $scope.carInsuranceTypes[i];
                                        break;
                                    }
                                }

                                for (i = 0; i < $scope.ncbList.length; i++) {
                                    if ($scope.quoteParam.ncb == $scope.ncbList[i].value) {
                                        $scope.vehicleDetails.ncb = $scope.ncbList[i];
                                        break;
                                    }
                                }
                                $scope.yearList = listRegistrationYear($scope.vehicleDetails.insuranceType.value, $scope.vehicleDetails.maxVehicleAge);

                                $scope.alterRenewal();
                                localStorageService.set("selectedCarDetails", $scope.vehicleDetails);                              

                                if ($rootScope.affilateUser) {
                                    $scope.singleClickCarQuote();
                                } else if (!$scope.view) {                                   
                                    if($rootScope.agencyPortalEnabled){
                                        $scope.redirectResultScreen();
                                    }else{                                     
                                        if(localStorageService.get("quoteUserInfo")){
                                            $scope.redirectResultScreen();
                                        }else{
                                        $scope.leadCreationUserInfo();
                                        }
                                    }
                                    // })
                                } else if ($scope.view) {
                                    $scope.redirectResultScreen();
                                }
                            }

                            /*var todayDate = new Date();
                            var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" + 
                            ("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
                            getPolicyStatusList(formatedTodaysDate);*/

                            $scope.policyStatusList = policyStatusListGeneric;
                            if (!localStorageService.get("ridersCarStatus")) {
                                    // To get the car rider list applicable for this user.
                                    getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.car, $scope.globalLabel.request.findAppConfig, function(addOnCoverForCar) {
                                        localStorageService.set("addOnCoverListForCar", addOnCoverForCar);
                                        localStorageService.set("ridersCarStatus", true);

                                        getListFromDB(RestAPI, "", "CarDataList", $scope.globalLabel.request.findAppConfig, function(callbackCar5) {
                                            if (callbackCar5.responseCode == $scope.globalLabel.responseCode.success) {
                                                localStorageService.set("carMakeListDisplay", callbackCar5.data);
                                                //$scope.instantQuoteCalculation(addOnCoverForCar);
                                            }

                                            //Fetching Garage Details
                                            $scope.garageList = {};
                                            $scope.garageList.make = $scope.vehicleInfo.make;
                                            $scope.garageList.city = $scope.vehicleInfo.city;
                                            $scope.garageList.regisCode = $scope.vehicleInfo.RTOCode;
                
                                            RestAPI.invoke($scope.globalLabel.transactionName.getGarageDetails, $scope.garageList).then(function(callbackGarage) {
                                                if (callbackGarage.responseCode == $scope.globalLabel.responseCode.success) {
                                                    var garageResponse = callbackGarage;
                                                    if (garageResponse != null && String(garageResponse) != "undefined") {
                                                        $scope.garageDetails = garageResponse.data;
                                                       localStorageService.set("garageDetails", garageResponse.data)
                                                    } else {
                                                    localStorageService.set("garageDetails", undefined);
                                                        $scope.garageDetails = "";
                                                    }
                                                } else {
                                                    localStorageService.set("garageDetails", undefined);
                                                    $scope.garageDetails = "";
                                                }

                                                $scope.prepopulateCarFields();
                                            });
                                        });
                                    });
                               // });
                            } else {
                                $scope.prepopulateCarFields();
                            }
                        } else if ($scope.selectedBusinessLineId == 4) {
                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);

                            var sonCount = 0;
                            var daughterCount = 0;
                            for (var j = 0; j < $scope.familyList.length; j++) {
                                $scope.familyList[j].val = false;
                            }
                            for (i = 0; i < $scope.selectedFamilyArray.length; i++) {
                                // if ($scope.selectedFamilyArray[i].relation == 'Son') {
                                //     sonCount += 1;
                                // } else if ($scope.selectedFamilyArray[i].relation == 'Daughter') {
                                //     daughterCount += 1;
                                // }
                                for (var j = 0; j < $scope.familyList.length; j++) {
                                    if ($scope.selectedFamilyArray[i].relation == $scope.familyList[j].member) {
                                        $scope.familyList[j].val = true;
                                        $scope.familyList[j].age = $scope.selectedFamilyArray[i].age;
                                        $scope.familyList[j].dob = $scope.selectedFamilyArray[i].dob;
                                        iconFlag: true 
                                        if ($scope.selectedFamilyArray[i].relation == 'Son') {
                                            $scope.familyList[j].iconFlag = true;
                                        } else if ($scope.selectedFamilyArray[i].relation == 'Daughter') {
                                            $scope.familyList[j].iconFlag = true;
                                        }
                                        break;
                                    }
                                }
                            }
                            // for (i = 0; i < sonCount - 1; i++) {
                            //     $scope.familyList.push({ 'member': 'Son', 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 82, iconFlag: true });

                            // }
                            // for (i = 0; i < daughterCount - 1; i++) {
                            //     $scope.familyList.push({ 'member': 'Daughter', 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, iconFlag: true });
                            // }

                            localStorageService.set("healthQuoteInputParamaters", $scope.quote);
                            localStorageService.set("selectedArea", $scope.selectedArea);
                            localStorageService.set("selectedFamilyForHealth", $scope.familyList);
                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                            /*localStorageService.set("hospitalisationLimitValReset",$scope.quote.personalInfo.hospitalisationLimit);	*/
                            localStorageService.set("selectedFamilyArray", $scope.selectedFamilyArray);

                            for (var i = 0; i < $scope.selectedFamilyArray.length; i++) {
                                for (var j = 0; j < $scope.selectedFamilyArray[i].dieaseDetails.length; j++) {
                                    if ($scope.selectedFamilyArray[i].dieaseDetails.length > 0) {
                                        if ($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode != undefined) {
                                            //if($scope.selectedDisease.diseaseList.includes($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode))
                                            if (p365Includes($scope.selectedDisease.diseaseList, $scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode)) {
                                                continue;
                                            }
                                            $scope.selectedDisease.diseaseList.push($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode);
                                            $scope.isDiseased = true;
                                        }
                                    }
                                }

                            }
                            localStorageService.set("selectedDisease", $scope.selectedDisease);
                            localStorageService.set("isDiseasedForHealth", $scope.isDiseased);

                            //setting user geo details as required in proposal screen
                            var areaCode = $scope.quote.personalInfo.pincode;
                            $http.get(getServiceLink + "Pincode" + "&q=" + areaCode).then(function(response) {
                                var areaDetails = JSON.parse(response.data);
                                if (areaDetails.responseCode == $scope.globalLabel.responseCode.success) {
                                    $scope.onSelectPinOrArea(areaDetails.data[0]);
                                    item = areaDetails.data[0];
                                }
                            });
                            $scope.onSelectPinOrArea = function(item) {
                                localStorageService.set("userGeoDetails", item);
                                localStorageService.set("commAddressDetails", item);
                            }

                            // setting user login info
                            if (localStorageService.get("userLoginInfo") == null || String(localStorageService.get("userLoginInfo")) == "undefined") {
                                var userLoginInfo = {};
                                userLoginInfo.username = undefined;
                                userLoginInfo.mobileNumber = undefined;
                                userLoginInfo.status = false;
                                localStorageService.set("userLoginInfo", userLoginInfo);
                            }

                            $scope.healthInstantQuoteCalculation = function(addOnCoverForHealth) {
                                addRidersToDefaultQuote(addOnCoverForHealth, localStorageService.get("selectedBusinessLineId"), function(defaultRiderList, defaultRiderArrayObject) {

                                    $scope.errorRespCounter = true;
                                    $scope.healthErrorMessage = function(errorMsg) {
                                        if ($scope.errorRespCounter && (String($rootScope.healthQuoteResult) == "undefined" || $rootScope.healthQuoteResult.length == 0)) {
                                            $scope.errorRespCounter = false;
                                            $scope.errorSectionButtonStatus = true;
                                            $scope.quoteCalculationError = errorMsg;
                                            $rootScope.viewOptionDisabled = true;
                                            $rootScope.tabSelectionStatus = true;
                                            $rootScope.loading = false;
                                        } else if ($rootScope.healthQuoteResult.length > 0) {
                                            $scope.errorSectionButtonStatus = true;
                                            $scope.quoteCalculationError = "";
                                            $rootScope.viewOptionDisabled = false;
                                            $rootScope.tabSelectionStatus = true;
                                            $rootScope.loading = false;
                                        }
                                    };

                                    $scope.processHealthResult = function() {
                                        if ($rootScope.healthQuoteResult.length > 0) {
                                            $rootScope.viewOptionDisabled = false;
                                            $rootScope.tabSelectionStatus = true;
                                            $rootScope.modalShown = false;
                                            //$rootScope.loading = false;
                                            $rootScope.healthQuoteResult = $filter('orderBy')($rootScope.healthQuoteResult, 'annualPremium');
                                            $scope.quotesToShow = $rootScope.healthQuoteResult;
                                            if ($scope.view)
                                                $scope.redirectResultScreen();
                                            else
                                                $scope.checkForRedirect();
                                        }
                                    };
                                    $scope.singleClickHealthQuote = function() {
                                        //webservice called for geting featurelist
                                        RestAPI.invoke($scope.globalLabel.getRequest.quoteHealth, $scope.quote).then(function(healthQuoteResult) {
                                            $rootScope.healthQuoteRequest = [];
                                            $scope.healthQuoteResponse = [];
                                            if (healthQuoteResult.responseCode == $scope.globalLabel.responseCode.success) {
                                                $scope.responseCodeList = [];

                                                $scope.dataLoaded = true;
                                                //$scope.slickLoaded=false;
                                                $scope.requestId = healthQuoteResult.QUOTE_ID;
                                                localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.requestId);

                                                $scope.UNIQUE_QUOTE_ID_ENCRYPTED = healthQuoteResult.encryptedQuoteId;
                                                localStorageService.set("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);

                                                $rootScope.healthQuoteRequest = healthQuoteResult.data;

                                                if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0) {
                                                    $rootScope.healthQuoteResult.length = 0;
                                                }

                                                angular.forEach($rootScope.healthQuoteRequest, function(obj, i) {
                                                    var request = {};
                                                    var header = {};

                                                    header.messageId = messageIDVar;
                                                    header.campaignID = campaignIDVar;
                                                    header.source = sourceOrigin;
                                                    header.deviceId = deviceIdOrigin;
                                                    header.transactionName = $scope.globalLabel.transactionName.healthQuoteResult;
                                                    request.header = header;
                                                    request.body = obj;

                                                    $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                    success(function(callback, status) {
                                                        var healthQuoteResponse = JSON.parse(callback);
                                                        $scope.healthQuoteResponse.push(callback);
                                                        if (healthQuoteResponse.QUOTE_ID == $scope.requestId) {
                                                            $scope.responseCodeList.push(healthQuoteResponse.responseCode);
                                                            if (healthQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                                for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                                                                    if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
                                                                        $rootScope.healthQuoteResult.push(healthQuoteResponse.data.quotes[0]);
                                                                        //getAllProductFeatures(healthQuoteResponse.data.quotes[0], true);
                                                                        $rootScope.healthQuoteRequest[i].status = 1;
                                                                    }
                                                                }
                                                                $scope.processHealthResult();
                                                            } else {
                                                                for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                                                                    if ($rootScope.healthQuoteRequest[i].messageId == healthQuoteResponse.messageId) {
                                                                        $rootScope.healthQuoteRequest[i].status = 2;
                                                                        //$rootScope.healthQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                                        $rootScope.healthQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMedicalErrMsg);
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
                                                    //$rootScope.loading = false;
                                                    if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success))
                                                    /*$rootScope.loading = false;*/

                                                        if ($scope.responseCodeList.length == $rootScope.healthQuoteRequest.length) {
                                                        /*$rootScope.loading = false;*/

                                                        for (var i = 0; i < $rootScope.healthQuoteRequest.length; i++) {
                                                            if ($rootScope.healthQuoteRequest[i].status == 0) {
                                                                $rootScope.healthQuoteRequest[i].status = 2;
                                                                //$rootScope.healthQuoteRequest[i].message = $scope.globalLabel.validationMessages.fetchQuoteError;
                                                                $rootScope.healthQuoteRequest[i].message = $sce.trustAsHtml($scope.globalLabel.validationMessages.generalisedMedicalErrMsg);
                                                            }
                                                        }

                                                        //if($scope.responseCodeList.includes($scope.globalLabel.responseCode.success)){
                                                        if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.success)) {
                                                            // This condition will satisfy only when at least one product is found in the quoteResponse array.
                                                            //}else if($scope.responseCodeList.includes($scope.globalLabel.responseCode.quoteNotAvailable)){
                                                        } else if (p365Includes($scope.responseCodeList, $scope.globalLabel.responseCode.quoteNotAvailable)) {
                                                            $scope.healthErrorMessage($scope.globalLabel.validationMessages.productNotFoundMsg);
                                                        } else {
                                                            $scope.healthErrorMessage($scope.globalLabel.validationMessages.generalisedErrMsg);
                                                        }
                                                    }
                                                }, true);
                                            } else {
                                                localStorageService.remove("healthQuoteInputParamaters");
                                                localStorageService.remove("selectedFamilyForHealth");
                                                localStorageService.remove("isDiseasedForHealth");
                                                localStorageService.remove("diseaseForHealth");
                                                localStorageService.remove("selectedArea");
                                                localStorageService.remove("addOnCoverForHealth");
                                                localStorageService.remove("selectedFamilyArray");
                                                localStorageService.remove("diseaseList");
                                                localStorageService.set("ridersHealthStatus", false);
                                                $scope.responseCodeList = [];
                                                if (String($rootScope.healthQuoteResult) != "undefined" && $rootScope.healthQuoteResult.length > 0)
                                                    $rootScope.healthQuoteResult.length = 0;

                                                $rootScope.healthQuoteResult = [];
                                                $scope.healthErrorMessage(callback.message);
                                            }
                                        });
                                    };

                                    $scope.prepopulateHealthFields = function() {
                                        for (var i = 0; i < $scope.diseaseList.length; i++) {
                                            $scope.diseaseList[i].familyList = [];
                                        }
                                        for (i = 0; i < $scope.selectedFamilyArray.length; i++) {
                                            $scope.dieaseDetails = [];
                                            for (var j = 0; j < $scope.selectedFamilyArray[i].dieaseDetails.length; j++) {
                                                for (var k = 0; k < $scope.diseaseList.length; k++) {
                                                    if ($scope.selectedFamilyArray[i].dieaseDetails[j].dieaseCode == $scope.diseaseList[k].diseaseId) {
                                                        $scope.selectedFamilyArray[i].label = $scope.selectedFamilyArray[i].relation;
                                                        $scope.selectedFamilyArray[i].display = $scope.selectedFamilyArray[i].relation;
                                                        $scope.diseaseList[k].familyList.push($scope.selectedFamilyArray[i]);

                                                    }

                                                }
                                            }
                                        }
                                        //added to display selected rider in result pages.
                                        $rootScope.selectedFeatures = [];
                                        $rootScope.selected = {};
                                        if ($scope.quote.quoteParam.riders) {
                                            $scope.planBenefits = planBenefitsGeneric;
                                            for (i = 0; i < $scope.planBenefits.length; i++) {
                                                for (var j = 0; j < $scope.quote.quoteParam.riders.length; j++) {
                                                    if ($scope.planBenefits[i].riders.riderId == $scope.quote.quoteParam.riders[j].riderId) {
                                                        $rootScope.selected = $scope.planBenefits[i];
                                                        $rootScope.selectedFeatures.push($scope.planBenefits[i]);
                                                        break;
                                                    }
                                                }
                                            }

                                            $scope.roomTypesArray = roomRentBenefitList;
                                            for (i = 0; i < $scope.roomTypesArray.length; i++) {
                                                for (var j = 0; j < $scope.quote.quoteParam.riders.length; j++) {
                                                    if ($scope.quote.quoteParam.riders[j].value) {
                                                        if (($scope.roomTypesArray[i].riders.riderId == $scope.quote.quoteParam.riders[j].riderId) &&
                                                            ($scope.roomTypesArray[i].name == $scope.quote.quoteParam.riders[j].value)) {
                                                            $rootScope.roomRentFeature = true;
                                                            $rootScope.selected = $scope.roomTypesArray[i];
                                                            $rootScope.selectedFeatures.push($scope.roomTypesArray[i]);
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } //end rider

                                        $scope.hospitalizationLimitArray = localStorageService.get("hospitalizationLimitList");
                                        for (var i = 0; i < $scope.hospitalizationLimitArray.length; i++) {
                                            if ($scope.hospitalizationLimitArray[i].minHosLimit == $scope.quote.personalInfo.minHospitalisationLimit &&
                                                $scope.hospitalizationLimitArray[i].maxHosLimit == $scope.quote.personalInfo.maxHospitalisationLimit) {
                                                $scope.hospitalisationLimit = $scope.hospitalizationLimitArray[i];
                                                break;
                                            }
                                        } //hospitalization limit end here
                                        $rootScope.hospitalisationLimit = $scope.hospitalisationLimit;
                                        localStorageService.set("hospitalisationLimitVal", $scope.hospitalisationLimit);

                                        //for reset
                                        localStorageService.set("diseaseList", $scope.diseaseList);
                                        localStorageService.set("healthQuoteInputParamatersReset", $scope.quote);
                                        localStorageService.set("selectedAreaReset", $scope.selectedArea);
                                        localStorageService.set("isDiseasedForHealthReset", $scope.isDiseased);
                                        localStorageService.set("selectedFamilyForHealthReset", $scope.familyList);
                                        localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);
                                        localStorageService.set("selectedFamilyArrayReset", $scope.selectedFamilyArray);
                                        localStorageService.set("diseaseListReset", $scope.diseaseList);
                                        localStorageService.set("hospitalisationLimitValReset", $scope.hospitalisationLimit);
                                        localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", $scope.healthResponse.QUOTE_ID);

                                        $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.healthResponse.encryptedQuoteId;
                                        localStorageService.set("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);


                                        if ($scope.view) {
                                            $scope.singleClickHealthQuote();
                                            //$scope.redirectResultScreen();
                                        } else {
                                            //$scope.leadCreationUserInfo();
                                            
                                            $scope.singleClickHealthQuote();
                                        }
                                    }
                                    $scope.prepopulateHealthFields();
                                });
                            };
                            if (!localStorageService.get("ridersHealthStatus")) {

                                // To get the health rider list applicable for this user.
                                getRiderList(RestAPI, $scope.globalLabel.documentType.riderList, $scope.globalLabel.documentType.health, $scope.globalLabel.request.findAppConfig, function(addOnCoverForHealth) {
                                    localStorageService.set("addOnCoverForHealth", addOnCoverForHealth);
                                    localStorageService.set("ridersHealthStatus", true);
                                    //fetching disease list
                                    getListFromDB(RestAPI, "", "Disease", $scope.globalLabel.request.findAppConfig, function(callback) {
                                        if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                            var diseaseData = callback.data;

                                            for (var i = 0; i < diseaseData.length; i++) {
                                                diseaseData[i].familyList = [];
                                            }

                                            $scope.diseaseList = diseaseData;
                                            localStorageService.set("diseaseList", diseaseData);


                                            getListFromDB(RestAPI, "", $scope.globalLabel.documentType.hospitalizationLimit, $scope.globalLabel.request.findAppConfig, function(hospitalizationLimitList) {
                                                if (hospitalizationLimitList.responseCode == $scope.globalLabel.responseCode.success) {
                                                    localStorageService.set("hospitalizationLimitList", hospitalizationLimitList.data);
                                                    //for reset
                                                    localStorageService.set("hospitalizationLimitListReset", hospitalizationLimitList.data);

                                                    $scope.healthInstantQuoteCalculation(addOnCoverForHealth);
                                                }

                                                // var docId = $scope.globalLabel.documentType.instantQuoteScreen + "-" + localStorageService.get("selectedBusinessLineId");
                                                // getDocUsingId(RestAPI, docId, function(tooltipContent){
                                                // 	localStorageService.set("healthInstantQuoteTooltipContent", tooltipContent.toolTips);
                                                // 	$rootScope.tooltipContent = tooltipContent.toolTips;

                                                // });
                                            });
                                        } else {
                                            $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
                                        }
                                    });
                                });
                            } else {
                                $scope.diseaseList = localStorageService.get("diseaseList");
                                
                                // $rootScope.tooltipContent = localStorageService.get("healthInstantQuoteTooltipContent");
                                $scope.healthInstantQuoteCalculation(localStorageService.get("addOnCoverForHealth"));
                            }
                        } else if ($scope.selectedBusinessLineId == 5) {
                            $rootScope.loaderContent = { businessLine: '5', header: 'Travel Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.travel.proverbResult) };
                            $rootScope.title = $scope.globalLabel.policies365Title.travelResultQuote;

                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                            var diseaseList = [];
                            for (var i = 0; i < $scope.travellersList.length; i++) {
                                var tempdiseaseList = [];
                                var traveller = $scope.travellersList[i];
                                if (traveller.diseaseDetails) {
                                    for (var j = 0; j < traveller.diseaseDetails.length; j++) {
                                        tempdiseaseList[j] = traveller.diseaseDetails[j].diseaseCode;
                                    }
                                }
                                angular.extend(diseaseList, tempdiseaseList);
                            }
                            $scope.selectedDisease.diseaseList = diseaseList;
                            $scope.isDiseased = ($scope.quote.quoteParam.pedStatus == 'Y') ? true : false;


                            localStorageService.set("quote", $scope.quote);
                            localStorageService.set("travelQuoteInputParamaters", $scope.quote);
                            localStorageService.set("travelDetails", $scope.quote.travelDetails);
                            localStorageService.set("isDiseasedForTravel", $scope.isDiseased);
                            localStorageService.set("selectedDisease", $scope.selectedDisease)
                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);

                            getListFromDB(RestAPI, "", "Disease", $scope.globalLabel.request.findAppConfig, function(callback) {
                                if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                    $scope.diseaseList = callback.data;
                                    for (var i = 0; i < $scope.diseaseList.length; i++) {
                                        $scope.diseaseList[i].travellersList = [];
                                    }
                                    for (i = 0; i < $scope.travellersList.length; i++) {
                                        if ($scope.travellersList[i].diseaseDetails) {

                                            for (var j = 0; j < $scope.travellersList[i].diseaseDetails.length; j++) {
                                                for (var k = 0; k < $scope.diseaseList.length; k++) {
                                                    if ($scope.travellersList[i].diseaseDetails[j].diseaseCode == $scope.diseaseList[k].diseaseId) {
                                                        $scope.diseaseList[k].travellersList.push($scope.travellersList[i]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    localStorageService.set("diseaseList", $scope.diseaseList);
                                    localStorageService.set("selectedTravellersForTravel", $scope.travellersList);
                                    localStorageService.set("selectedTravellerArray", $scope.travellersList);

                                    //Fetching sum insured list
                                    var sumInsuredDocId = $scope.globalLabel.documentType.travelSumInsuredList;
                                    getDocUsingId(RestAPI, sumInsuredDocId, function(suminsuredList) {
                                        if (suminsuredList != null && String(suminsuredList) != "undefined") {
                                            localStorageService.set("SumInsuredList", suminsuredList.SumInsured);
                                        } else {
                                            localStorageService.set("SumInsuredList", undefined);
                                        }

                                    });

                                    // setting user login info
                                    if (localStorageService.get("userLoginInfo") == null || String(localStorageService.get("userLoginInfo")) == "undefined") {
                                        var userLoginInfo = {};
                                        userLoginInfo.username = undefined;
                                        userLoginInfo.mobileNumber = undefined;
                                        userLoginInfo.status = false;
                                        localStorageService.set("userLoginInfo", userLoginInfo);
                                    }
                                    if($scope.travelResponse.encryptedQuoteId)
                                         $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.travelResponse.encryptedQuoteId;

                                    //for Reset
                                    localStorageService.set("quoteReset", $scope.quote);
                                    localStorageService.set("travelQuoteInputParamatersReset", $scope.quote);
                                    localStorageService.set("travelDetailsReset", $scope.travelDetails);
                                    localStorageService.set("isDiseasedForTravelReset", $scope.isDiseased);
                                    localStorageService.set("selectedDiseaseReset", $scope.selectedDisease);
                                    localStorageService.set("diseaseListReset", $scope.diseaseList);
                                    localStorageService.set("selectedTravellersForTravelReset", $scope.travellersList);
                                    localStorageService.set("selectedTravellerArrayReset", $scope.travellersList);
                                    localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID", $scope.travelResponse.QUOTE_ID);
                                    localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);

                                    // $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.travelResponse.encryptedQuoteId;
                                    // localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);


                                    redirectURL = redirectURL.replace(urlPattern, '/travelResult');
                                    $window.location = redirectURL;
                                } else {
                                    $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
                                }
                            });
                        } else if ($scope.selectedBusinessLineId == 6) {
                            $rootScope.loaderContent = { businessLine: '6', header: 'CI Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.criticalIllness.proverbResult) };
                            $rootScope.title = $scope.globalLabel.policies365Title.ciResultQuote;

                            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                            $scope.PremiumFrequencyList = defaultCriticalIllnessQuoteParam.premiumFrequencyList;
                            localStorageService.set("selectedBusinessLineId", 6);
                            localStorageService.set("criticalIllnessQuoteInputParamaters", $scope.quote);
                            localStorageService.set("criticalIllnessPersonalDetails", $scope.personalDetails);
                            localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID", $scope.criticalIllnessResponse.QUOTE_ID);
                            localStorageService.set("premiumFrequencyList", $scope.PremiumFrequencyList);

                            // $scope.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.criticalIllnessResponse.encryptedQuoteId;
                            // localStorageService.set("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED", $scope.UNIQUE_QUOTE_ID_ENCRYPTED);


                            // redirectURL  = redirectURL.replace(urlPattern,'/criticalIllnessResult');

                            // setting user login info
                            if (localStorageService.get("userLoginInfo") == null || String(localStorageService.get("userLoginInfo")) == "undefined") {
                                var userLoginInfo = {};
                                userLoginInfo.username = undefined;
                                userLoginInfo.mobileNumber = undefined;
                                userLoginInfo.status = false;
                                localStorageService.set("userLoginInfo", userLoginInfo);
                            }
                            $scope.checkForRedirect();
                            // $scope.leadCreationUserInfo();
                            // Create lead with available user information by calling webservice for share email.

                            // $window.location=redirectURL;	




                        }
                    }
                });
                $scope.callForShareVehicleQuote = function() {
                    if ($location.search().policyType == "new") {
                        $scope.quoteParam.policyType = "new";
                    }
                    if ($location.search().regYear) {
                        $scope.vehicleInfo.regYear = $location.search().regYear;
                    }
                    /*if($location.search().registrationNumber){
                    	$scope.vehicleInfo.registrationNumber=$location.search().registrationNumber;
                    }	*/

                    var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");
                    //checking for lead Id
                    if (quoteUserInfoCookie != null) {
                        if (quoteUserInfoCookie.messageId != undefined || quoteUserInfoCookie.messageId != null || quoteUserInfoCookie.messageId != '') {
                            messageIDVar = quoteUserInfoCookie.messageId;
                        } else {
                            messageIDVar = '';
                        }
                    }

                    var todayDate = new Date();
                    var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
                        ("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
                    getPolicyStatusList(formatedTodaysDate);
                    console.log('websiteVisitedOnce flag is: ',localStorageService.get("websiteVisitedOnce"));
                    if (!localStorageService.get("websiteVisitedOnce")) {
                        // Fetching default Metro cities and respective RTO details.
                        var popularRTOParam = {};
                        popularRTOParam.popularRTOList = "Y";
                        getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getPopularRTO, popularRTOParam, function(callbackMetro) {
                            if(callbackMetro.data){
                            localStorageService.set("defaultMetroCityList", callbackMetro.data);
                            $scope.defaultMetroList = callbackMetro.data;
                            }else{    
                            localStorageService.set("defaultMetroCityList", commonResultLabels.popularRTOList.data);
                            $scope.defaultMetroList = commonResultLabels.popularRTOList.data;
                            }
                            var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
                            if ($scope.selectedBusinessLineId == 3 && localStorageService.get("carQuoteInputParamaters")) {
                                if ($rootScope.vehicleInfo) {
                                    if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
                                        cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                                    } else {
                                        $scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
                                        cityName = $scope.vehicleInfo.city;
                                    }
                                }
                            } else if ($scope.selectedBusinessLineId == 2 && localStorageService.get("bikeQuoteInputParamaters")) {
                                if ($rootScope.vehicleInfo) {
                                    if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
                                        cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                                    } else {
                                        $scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
                                        cityName = $scope.vehicleInfo.city;
                                    }
                                }
                            }
      
                            $scope.getRegPlaceListUsingIPCity(cityName, function() {
                                /*for(var i = 0; i < $scope.tabs.length; i++){
                                	if($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId){
                                		$scope.inputTitle = $scope.tabs[i].inputTitle;
                                		$scope.currentTab = $scope.tabs[i].url;
                                		break;
                                	}
                                }*/
                            });
                            /*if($location.search().registrationNumber){
					 	$scope.getRegNumber($location.search().registrationNumber);
				 }else{
					 $scope.shareQuoteTemplateFunction(); 
				 }*/
                            $scope.shareQuoteTemplateFunction();
                        });
                    } else {
                        var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
                        if ($scope.selectedBusinessLineId == 3 && localStorageService.get("carQuoteInputParamaters")) {
                            if ($rootScope.vehicleInfo) {
                                if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
                                    cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                                } else {
                                    $scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
                                    cityName = $scope.vehicleInfo.city;
                                }
                            }
                        } else if ($scope.selectedBusinessLineId == 2 && localStorageService.get("bikeQuoteInputParamaters")) {
                            if ($rootScope.vehicleInfo) {
                                if ($rootScope.vehicleInfo.selectedRegistrationObject != null || String($rootScope.vehicleInfo.selectedRegistrationObject) != "undefined") {
                                    cityName = $rootScope.vehicleInfo.selectedRegistrationObject.city;
                                } else {
                                    $scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
                                    cityName = $scope.vehicleInfo.city;
                                }
                            }
                        }
                        $scope.getRegPlaceListUsingIPCity(cityName, function() {
                            if ($rootScope.vehicleInfo) {
                                if (($rootScope.vehicleInfo.registrationPlace == null || $rootScope.vehicleInfo.registrationPlace == undefined) && (localStorageService.get("registrationPlaceUsingIP") == undefined || localStorageService.get("registrationPlaceUsingIP").rtoStatus == false)) {
                                    var cityName = localStorageService.get("cityDataFromIP") !== null ? localStorageService.get("cityDataFromIP").cityName : "Mumbai";
                                    $scope.getRegPlaceListUsingIPCity(cityName, function() {
                                        /*if($scope.selectedBusinessLineId == 3){
                                        	$scope.$broadcast("callSingleClickCarQuote", {});
                                        }else if($scope.selectedBusinessLineId == 2){
                                        	$scope.$broadcast("callSingleClickBikeQuote", {});
                                        }*/
                                        $scope.defaultMetroList = localStorageService.get("defaultMetroCityList");

                                    });
                                }
                            }
                            if ($location.search().registrationNumber) {
                                $scope.getRegNumber($location.search().registrationNumber);
                            } else {
                                $scope.shareQuoteTemplateFunction();
                            }
                            //$scope.shareQuoteTemplateFunction();
                        });
                    }
                }
            });
        }
    ]);