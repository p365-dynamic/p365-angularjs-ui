/*
 * Description	: This file contains methods for get instant quote.
 * Author		: Yogesh Shisode
 * Date			: 13 May 2016
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *  1		13-06-2016		Dropdown list moved to dropdown-list-manager.										  modification-0001		Yogesh S.
 *	2		16-06-2016		Quote user info added to central DB using DataWriter service.						  modification-0002		Yogesh S.
 *  3		16-06-2016		Setting application labels to avoid static assignment.								  modification-0003		Yogesh S.
 *	4		20-11-2016		Below variables used for testimonial on home page.									  modification-0004		Reena S.
 *  5		29-11-2016		Adding business line specific header to instant quote section.						  modification-0005		Reena S.
 *  6		17-03-2017		Method to get RTO name based on city.												  modification-0006		Yogesh S.
 *  7		17-03-2017		After sign out click event triggered, below function executed.						  modification-0007		Yogesh S.
 *  8		17-03-2017		Validate user using mobile number and OTP entered.									  modification-0008		Yogesh S.
 *  9		17-03-2017		Fetching city based on IP address using external API.								  modification-0009		Yogesh S.
 *  10		17-03-2017		Create lead with available user information by calling webservice.					  modification-0010		Yogesh S.
 *
 * */

var messageIDVar;
var campaignIDVar;
var campaign_id;
var requestSource;
var campaignSource = {};
var organizationName;
/*var admitad_uid;*/
var scrollv; // register two global vars for two scrollable instances
'use strict';
angular.module('quote', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('quoteController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$filter', '$anchorScroll', '$sce', '$window', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $filter, $anchorScroll, $sce, $window) {
        $rootScope.bodyHeight = $window.innerHeight + 'px';
        $scope.login = {};
        $scope.authenticate = {};
        $scope.globalLabel = {};
        console.log("in quote");
  // if ($location.search().campaignId) {
        //     $rootScope.campaignId = $location.search().campaignId;
        //     campaignSource.utm_campaign = "";
        // } else if ($location.search().utm_campaign) {
        //     campaignSource.utm_campaign = $location.search().utm_campaign;
        // } else {
        //     campaignSource.utm_campaign = "";
        // }
       if ($location.search().utm_source) {
            campaignSource.utm_source = $location.search().utm_source;
        }
       if ($location.search().utm_medium) {
            campaignSource.utm_medium = $location.search().utm_medium;
        }
        $rootScope.disableNextScreen = false;

        $scope.headerForLanding = wp_path + 'buy/common/html/headerLanding.html';
        $scope.headerForLandingMonsoon = wp_path + 'buy/MonsoonLanding/html/headerLanding.html';
        $scope.headerForLandingIndependence = wp_path + 'buy/IndependenceLanding/html/headerLanding.html';
        $scope.headerForLandingPension = wp_path + 'buy/insuranceLanding/headerLanding.html';

      
        campaignIDVar = $rootScope.campaignId;
        $rootScope.campaignFlag = false;
        $scope.globalLabel.policies365Details = {};
        $rootScope.loading = true;
        $rootScope.instantQuoteSummaryStatus = true;
        $rootScope.instantQuoteInvalidSummaryStatus = true;
        $rootScope.exclusiveDiscountsLength = "00";
        $rootScope.calculatedQuotesLength = "00";
        $rootScope.calculatedRidersLength = "00";
        $rootScope.reloadStatus = true;
        $rootScope.modalChildPlanConfirm = false;
        $scope.instantQuoteBikeForm = false;

        //added to show Lead Tracking related iframe ,if user comes from landing pages.
        $rootScope.isCarLanding = false;
        $rootScope.isBikeLanding = false;
        $rootScope.isLifeLanding = false;
        $rootScope.isHealthLanding = false;

        //added flag to disable view option & buy Now button after lead creation call 
        $scope.disabledRedirectToResult = false;
        $rootScope.displayInstantScreen = true;
        $scope.createLeadScreen = false;
        $scope.displayResult = false;

        //flag added for landing pages.
        $scope.isFromLanding = false;
        $scope.pensionLanding = false;

        //hide links in production
        if (idepProdEnv) {
            $rootScope.idepProdEnv = idepProdEnv;
        }

        //added for wordPress
        if (wordPressEnabled) {
            $rootScope.wordPressEnabled = wordPressEnabled;
            $rootScope.wp_path = wp_path;
        } else {
            $rootScope.wp_path = '';
        }

        if ($rootScope.isBackButtonPressed) {
            $rootScope.displayInstantScreen = false;
            $scope.createLeadScreen = true;
            $scope.displayResult = true;
        }

        // Below variables used for testimonial on home page.	-	modification-0004
        $scope.carouselIndex2 = 0;
        $scope.slides2 = [{ id: 0, content: "Test Message 1", person: "Test Person 1" }];

        $scope.$on("callMethodFromHeader", function() {
            tab = $rootScope.selTabObject;
            $scope.onClickTab(tab);
        });
        $scope.$on("invokeGetQuoteTemplate", function() {
            $scope.getQuoteTemplateFunction();
        });


        console.log('$location.path() for landing page is: ',$location.path());
        if( $location.path() == "/healthLanding"){
            $scope.selectedBusinessLineId = 4;
            $rootScope.isHealthLanding  = true;
            localStorageService.set("selectedBusinessLineId", 4);
        }
        if( $location.path() == "/lifeLanding"){
            $scope.selectedBusinessLineId = 1;
            $rootScope.isLifeLanding  = true;
            localStorageService.set("selectedBusinessLineId", 3);
        }
        if ($rootScope.isCarProductTabClicked) {
            localStorageService.set("selectedBusinessLineId", 3);
            $rootScope.fromPBQuote = true;
            $rootScope.isCarProductTabClicked = false;
            //$rootScope.reloadStatus = false;
        } else if ($rootScope.isBikeProductTabClicked) {
            localStorageService.set("selectedBusinessLineId", 2);
            $rootScope.fromPBQuote = true;
            $rootScope.isBikeProductTabClicked = false;
            //$rootScope.reloadStatus = false;
        } else if ($rootScope.isHealthProductTabClicked) {
            localStorageService.set("selectedBusinessLineId", 4);
            $rootScope.fromPBQuote = true;
            $rootScope.isHealthProductTabClicked = false;
            //$rootScope.reloadStatus = false;
        } else if ($rootScope.isLifeProductTabClicked) {
            localStorageService.set("selectedBusinessLineId", 1);
            $rootScope.fromPBQuote = true;
            $rootScope.isLifeProductTabClicked = false;
            //$rootScope.reloadStatus = false;
        } else if ($rootScope.isTravelProductTabClicked) {
            localStorageService.set("selectedBusinessLineId", 5);
            $rootScope.fromPBQuote = true;
            $rootScope.isTravelProductTabClicked = false;
            //$rootScope.reloadStatus = false;
        } else if ($rootScope.isCriticalIllnessProductTabClicked) {
            localStorageService.set("selectedBusinessLineId", 6);
            $rootScope.fromPBQuote = true;
            $rootScope.isCriticalIllnessProductTabClicked = false;
            //$rootScope.reloadStatus = false;
        }


        if ($rootScope.fromPBQuote) {
            $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
            if ($scope.selectedBusinessLineId == 1) {
                $rootScope.professionalTab = wp_path + 'buy/common/html/PBHTML/PBAssuranceInstantQuote.html';
                $rootScope.professionalImg = 'TermLife_Slice_Product_jrny';
                $rootScope.professionalText = 'Find Your Perfect Term Life Plan';
            } else if ($scope.selectedBusinessLineId == 2) {
                $rootScope.professionalTab = wp_path + 'buy/common/html/PBHTML/PBTwoWheelerInstantQuote.html';
                $rootScope.professionalImg = 'Bike_Slice_Product_jrny';
                $rootScope.professionalText = 'Find the best Bike plan';
            } else if ($scope.selectedBusinessLineId == 3) {
                $rootScope.professionalTab = wp_path + 'buy/common/html/PBHTML/PBFourWheelerInstantQuote.html';
                $rootScope.professionalImg = 'Car_Slice_Product_jrny';
                $rootScope.professionalText = 'Find the best Car plan';
            } else if ($scope.selectedBusinessLineId == 4) {
                $rootScope.professionalTab = wp_path + 'buy/common/html/PBHTML/PBMedicalInstantQuote.html';
                $rootScope.professionalImg = 'Health_Slice_Product_jrny';
                $rootScope.professionalText = 'Find the best Health plan';
            } else if ($scope.selectedBusinessLineId == 5) {
                $rootScope.professionalTab = wp_path + 'buy/common/html/PBHTML/PBTravelInstantQuote.html';
                $rootScope.professionalImg = 'travel_Insurance_cpl';
                $rootScope.professionalText = 'Find the best Travel plan';
            } else if ($scope.selectedBusinessLineId == 6) {
                $rootScope.professionalTab = wp_path + 'buy/common/html/PBHTML/PBCriticalIllnessInstantQuote.html';
                $rootScope.professionalImg = 'Critical_Illness_ptnt';
                $rootScope.professionalText = 'Find the best Critical Illness plan';
            }
        }


        // this function will execute only in case of professional Journey
        $scope.onClickProfessionalTab = function(tab) {
            $rootScope.isFromProfessionalJourney = false;
            $scope.selectedBusinessLineId = tab.businessLineId;
            localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
            $rootScope.fromPBQuote = true;
            $location.path("/PBQuote");
        };



        $scope.getQuoteTemplateFunction = function() {
            if (!$rootScope.wordPressEnabled) {
                $scope.displayResult = true;
            } else {
                if (localStorage.getItem('selectedBusinessLineId')) {
                    $scope.selectedBusinessLineId = localStorage.getItem('selectedBusinessLineId')
                    localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                }
            }
            if (localStorageService.get("userLoginInfo") == null || String(localStorageService.get("userLoginInfo")) == "undefined") {
                var userLoginInfo = {};
                userLoginInfo.username = undefined;
                userLoginInfo.mobileNumber = undefined;
                userLoginInfo.status = false;
                localStorageService.set("userLoginInfo", userLoginInfo);
            }
            //if(localStorageService.get("applicationLabels")){
                $scope.globalLabel = localStorageService.get("applicationLabels").globalLabels;
            //}

            $scope.quoteUserInfo = {};
            $scope.quoteUserInfo.messageId = '';
            $scope.quoteUserInfo.termsCondition = true;

            //for wordpress
            $scope.leadHTML = wp_path + 'buy/common/html/createLeadTemplate.html';
            $scope.PBLeadHTML = wp_path + 'buy/common/html/PBHTML/PBCreateLeadTemplate.html';

            //logic for redirecting to terms and condition and privacy policy page
            $scope.wp_TermsCondition = function() {
                if ($location.path() == "/quote") {
                    window.location.href = window.location.protocol + '//' + window.location.host + '/' + 'termsandconditions';
                }
            }
            $scope.wp_PrivacyPolicy = function() {
                if ($location.path() == "/quote") {
                    window.location.href = window.location.protocol + '//' + window.location.host + '/' + 'privacy-policy';
                }
            }

            if ($location.path() == '/criticalIllness') {
                $scope.selectedBusinessLineId = 6;
                $scope.createLeadForm = {};
                localStorage.setItem('selectedBusinessLineId', $scope.selectedBusinessLineId);
                localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                $scope.criticalIllnessQuoteURL = wp_path + 'buy/criticalIllness/html/CriticalIllnessInstantQuote.html';
            } else {
                $scope.criticalIllnessQuoteURL = wp_path + 'buy/criticalIllness/html/CriticalIllnessInstantQuote.html';
            }
            if ($location.path() == '/personalAccident') {
                $scope.selectedBusinessLineId = 8;
                $scope.createLeadForm = {};
                localStorage.setItem('selectedBusinessLineId', $scope.selectedBusinessLineId);
                localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                $scope.personalAccidentQuoteURL = wp_path + 'buy/personalAccident/html/PersonalAccidentInstantQuote.html';
            } else {
                $scope.personalAccidentQuoteURL = wp_path + 'buy/personalAccident/html/PersonalAccidentInstantQuote.html';
            }
            if ($location.path() == '/home') {
                $scope.selectedBusinessLineId = 7;
                $scope.createLeadForm = {};
                localStorage.setItem('selectedBusinessLineId', $scope.selectedBusinessLineId);
                localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                $scope.homeURL = wp_path + 'buy/home/html/HomeInstantQuote.html';
            } else {
                $scope.homeURL = wp_path + 'buy/home/html/HomeInstantQuote.html';
            }

                $scope.tabs = [
                    { businessLineId: 2, url: $scope.bikeURL, className: 'bikeTab tabs wp_border32', name: "bike", title: "Bike", inputTitle: "bike", tabImgId: 1, flagToShow: false },
                    { businessLineId: 3, url: $scope.carURL, className: 'carTab tabs wp_border32', name: "car", title: "Car", inputTitle: "car", tabImgId: 0, flagToShow: false },
                    { businessLineId: 4, url: $scope.healthURL, className: 'healthTab tabs wp_border32', name: "health", title: "Health", inputTitle: "family", tabImgId: 3, flagToShow: false },
                    { businessLineId: 1, url: $scope.lifeURL, className: 'lifeTab tabs wp_border32', name: "life", title: "Term Life", inputTitle: "life", tabImgId: 2, flagToShow: false },
                    { businessLineId: 6, url: $scope.criticalIllnessQuoteURL, className: 'criticalIllnessTab tabs wp_border32', name: "criticalIllness", title: "Critical Illnesss", inputTitle: "CI", tabImgId: 5, flagToShow: false },
                    { businessLineId: 5, url: $scope.travelURL, className: 'travelTab tabs wp_border32', name: "travel", title: "Travel", inputTitle: "travel", tabImgId: 4, flagToShow: $rootScope.idepProdEnv },
                    { businessLineId: 8, url: $scope.personalAccidentQuoteURL, className: 'personalAccidentTab tabs wp_border32', name: "personalAccident", title: "PA", inputTitle: "PA", tabImgId: 6, flagToShow: true },
                    { businessLineId: 7, url: $scope.homeURL, className: 'homeTab tabs wp_border32', name: "home", title: "Home", inputTitle: "home", tabImgId: 7, flagToShow: true }
                ];
            
            $scope.tabsWidth = ($rootScope.idepProdEnv && $rootScope.wordPressEnabled) ? "100%" : "110%";
            $scope.tabs_li_width = ($rootScope.idepProdEnv && $rootScope.wordPressEnabled) ? "20%" : "16%";

            $rootScope.selectedRegData = undefined;
            if (localStorageService.get("userLoginInfo")) {
                $rootScope.userLoginStatus = localStorageService.get("userLoginInfo").status;
                $rootScope.username = localStorageService.get("userLoginInfo").username;
            }
            $scope.menuItems = menuItemsGeneric;

            var quoteUserInfoCookie = localStorageService.get("quoteUserInfo");

            //added to retain the values in header controller
            $rootScope.claimDetailsUserInfo = localStorageService.get("quoteUserInfo");

            $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");

            //checking for lead Id
            if (quoteUserInfoCookie != null) {
                if (quoteUserInfoCookie.messageId != undefined || quoteUserInfoCookie.messageId != null || quoteUserInfoCookie.messageId != '') {
                    messageIDVar = quoteUserInfoCookie.messageId;
                } else {
                    messageIDVar = '';
                }
            }


            $scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
                setTimeout(function() {
                    $('.md-click-catcher').click(function() {
                        $scope.activeMenu = '';
                    });
                }, 100);
            };

            //Parallax Scroll

            /*$(window).scroll(function(){landingScroll()});
				var landHeader = document.getElementById("landInsureHeader");
				var stickyLandHeader = landHeader.offsetTop;
   
				function landingScroll(){
					alert('welcome')
					if(window.pageYOffset > stickyLandHeader){
						alert('in')
						landHeader.classList.add("stickyLandHeader");
					}else{
						alert('out')
						landHeader.classList.remove("stickyLandHeader");
					}
				}*/



            // Adding business line specific header to instant quote section.	-	modification-0005
            if ($scope.selectedBusinessLineId == 1) {
                $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelLife;
                $rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.life.proverbInstantQuote) };

            } else if ($scope.selectedBusinessLineId == 2) {
                $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelBike;
                $rootScope.loaderContent = { businessLine: '2', header: 'Bike Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.bike.proverbInstantQuote) };

            } else if ($scope.selectedBusinessLineId == 3) {
                $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelCar;
                $rootScope.loaderContent = { businessLine: '3', header: 'Car Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.car.proverbInstantQuote) };
            } else if ($scope.selectedBusinessLineId == 4) {
                $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelHealth;
                $rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.health.proverbInstantQuote) };
            } else if ($scope.selectedBusinessLineId == 5) {
                $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelTravel;
                $rootScope.loaderContent = { businessLine: '5', header: 'Travel Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.travel.proverbInstantQuote) };

            } else if ($scope.selectedBusinessLineId == 6) {
                $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelCriticalIllness;
                $rootScope.loaderContent = { businessLine: '6', header: 'CI Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.criticalIllness.proverbInstantQuote) };

            } else if ($scope.selectedBusinessLineId == 8) {
                $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelPersonalAccident;
                $rootScope.loaderContent = { businessLine: '8', header: 'PA Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.personalAccident.proverbInstantQuote) };
            }

            // Testimonial contents.	-	modification-0004
            $scope.slides2 = [{ id: 0, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent1, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName1 },
                { id: 1, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent2, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName2 },
                { id: 2, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent3, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName3 },
                { id: 3, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent4, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName4 },
                { id: 4, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent5, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName5 },
                { id: 5, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent6, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName6 },
                { id: 6, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent7, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName7 },
                { id: 7, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent8, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName8 },
                { id: 8, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent9, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName9 },
                { id: 9, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent10, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName10 },
                { id: 10, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent11, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName11 },
                { id: 11, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent12, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName12 },
                { id: 12, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent13, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName13 },
                { id: 13, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent14, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName14 },
                { id: 14, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent15, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName15 },
                { id: 15, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent16, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName16 },
                { id: 16, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent17, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName17 },
                { id: 17, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent18, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName18 },
                { id: 18, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent19, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName19 },
                { id: 19, content: $scope.globalLabel.applicationStaticContent.homePageCustSayContent20, person: $scope.globalLabel.applicationStaticContent.homePageCustSayName20 }
            ];


            // Method to get RTO name based on city.	-	modification-0006
            $scope.getRegPlaceListUsingIPCity = function(city, callback) {
                if (city != null && String(city) != "undefined") {
                    return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + city).then(function(response) {
                        var rtoDetailsResponse = JSON.parse(response.data);
                        var rtoDetail = {};
                        if (rtoDetailsResponse.responseCode != $scope.globalLabel.responseCode.noRecordsFound) {
                            $rootScope.vehicleInfo = {};
                            if(localStorageService.get("selectedBusinessLineId") == 3){
                                $rootScope.selectedCarRegistrationObject = rtoDetailsResponse.data[0];
                            }else if(localStorageService.get("selectedBusinessLineId") == 2){
                                $rootScope.selectedBikeRegistrationObject = rtoDetailsResponse.data[0];
                            }
                            //$rootScope.vehicleInfo.selectedRegistrationObject = rtoDetailsResponse.data[0];

                            $rootScope.vehicleInfo.registrationPlace = rtoDetailsResponse.data[0].display;
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
                                if (localStorageService.get("selectedBusinessLineId") == 3) {
                                    localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
                                } else if (localStorageService.get("selectedBusinessLineId") == 2) {
                                    localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
                                }
                            });
                        } else {
                            rtoDetail.rtoName = undefined;
                            rtoDetail.rtoCity = undefined;
                            rtoDetail.rtoState = undefined;
                            rtoDetail.rtoObject = undefined;
                            rtoDetail.rtoStatus = false;
                            if (localStorageService.get("selectedBusinessLineId") == 3) {
                                localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
                            } else if (localStorageService.get("selectedBusinessLineId") == 2) {
                                localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
                            }
                        }
                        $rootScope.loading = false;
                        callback();
                    });
                } else {
                    var rtoDetail = {};
                    rtoDetail.rtoName = undefined;
                    rtoDetail.rtoCity = undefined;
                    rtoDetail.rtoState = undefined;
                    rtoDetail.rtoObject = undefined;
                    rtoDetail.rtoStatus = false;
                    if (localStorageService.get("selectedBusinessLineId") == 3) {
                        localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
                    } else if (localStorageService.get("selectedBusinessLineId") == 2) {
                        localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
                    }
                    $rootScope.loading = false;
                    callback();
                }

            };

            // After sign out click event triggered, below function executed.	-	modification-0007
            $rootScope.signout = function() {
                $rootScope.userLoginStatus = false;
                var userLoginInfo = {};
                userLoginInfo.username = undefined;
                userLoginInfo.status = $rootScope.userLoginStatus;
                localStorageService.set("userLoginInfo", userLoginInfo);
                $location.path("/quote");
            };

            //for wordpress images
            if ($rootScope.wordPressEnabled) {
                $scope.slickConfig1Loaded = true;
                if ($scope.selectedBusinessLineId == 3) {
                    $scope.slickCurrentIndex = 0;
                } else if ($scope.selectedBusinessLineId == 2) {
                    $scope.slickCurrentIndex = 1;
                } else if ($scope.selectedBusinessLineId == 1) {
                    $scope.slickCurrentIndex = 2;
                } else if ($scope.selectedBusinessLineId == 4) {
                    $scope.slickCurrentIndex = 4;
                } else if ($scope.selectedBusinessLineId == 5) {
                    $scope.slickCurrentIndex = 5;
                } else if ($scope.selectedBusinessLineId == 6) {
                    $scope.slickCurrentIndex = 6;
                } else if ($scope.selectedBusinessLineId == 8) {
                    $scope.slickCurrentIndex = 8;
                }

                $scope.slickConfig = {
                    dots: false,
                    autoplay: true,
                    initialSlide: $scope.slickCurrentIndex,
                    infinite: true,
                    autoplaySpeed: 3000,
                    method: {},
                    event: {
                        beforeChange: function(event, slick, currentSlide, nextSlide) {
                            // console.log('before change', Math.floor((Math.random() * 10) + 100));
                        },
                        afterChange: function(event, slick, currentSlide, nextSlide) {
                            $scope.slickCurrentIndex = currentSlide;
                        },
                        breakpoint: function(event, slick, breakpoint) {
                            // console.log('breakpoint');
                        },
                        destroy: function(event, slick) {
                            //console.log('destroy');
                        },
                        edge: function(event, slick, direction) {
                            //console.log('edge');
                        },
                        reInit: function(event, slick) {
                            //console.log('re-init');
                        },
                        init: function(event, slick) {
                            //console.log('init');
                        },
                        setPosition: function(evnet, slick) {
                            //console.log('setPosition');
                        },
                        swipe: function(event, slick, direction) {
                            //console.log('swipe');
                        }
                    }
                };
            }


            // Show OTP input form to get login.
            $rootScope.showAuthenticateForm = function() {
                $scope.modalOTP = true;
            };

            // Close OTP input form.
            $scope.closeAuthenticateForm = function() {
                $rootScope.disableLandingLeadBtn = false;
                $scope.modalOTP = false;
            };

            // Show login form popup.
            $rootScope.showLoginForm = function() {
                $scope.modalLogin = true;
            };

            // Close login form popup.
            $scope.closeLoginForm = function() {

                $scope.modalLogin = false;
                $scope.login.MobileNumber = "";
            };

            //function created for OTP validation for landing user
            $rootScope.validateLandingUser = function(contactUsForm) {
                $scope.login = {};
                if (contactUsForm) {
                    $scope.createTicket = true;
                    if ($scope.contactUsForm) {
                        if (!$scope.contactUsForm.$invalid) {
                            $scope.login.MobileNumber = $scope.composeEmail.paramMap.mobileNumber;
                            $scope.validateLogin();
                        }
                    }
                } else {
                    $scope.createTicket = false;
                    $scope.login.MobileNumber = $scope.quoteUserInfo.mobileNumber;
                    if ($rootScope.Regpopup) {
                        $rootScope.Regpopup = false;
                    }
                    $scope.validateLogin();
                }
            }

            // Validate mobile number.
            $scope.validateLogin = function() {
                $scope.disableOTP = false;
                $scope.authenticate.enteredOTP = ""
                var validateLoginParam = {};
                validateLoginParam.paramMap = {};
                validateLoginParam.mobileNumber = $scope.login.MobileNumber;
                validateLoginParam.funcType = $scope.globalLabel.functionType.optAuth;
                validateLoginParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;
                /*if(sessionIDvar){
                	validateLoginParam.sessionId=sessionIDvar;				
                }*/
                //condition to check the transaction name from landing page
                var transactionName;
                var urlPattern = $location.path();
                if ($scope.isFromLanding) {
                    transactionName = $scope.globalLabel.transactionName.sendSMS;
                } else {
                    transactionName = userValidation;
                }

                getDocUsingParam(RestAPI, transactionName, validateLoginParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                        $scope.createOTPError = "";
                        $scope.modalLogin = false;
                        $rootScope.showAuthenticateForm();
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.userNotExist) {
                        //added to enable submit button from OTP modal in landing pages
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.createOTPError = createOTP.message;
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.createOTPError = createOTP.message;
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.mobileInvalidCode) {
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.createOTPError = createOTP.message;
                    } else {
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.createOTPError = $scope.globalLabel.errorMessage.createOTP;
                    }
                });
            };

            // Show OTP input form to get login.
            $rootScope.showAuthenticateForm = function() {
                $scope.modalOTP = true;
            };

            // Close OTP input form.
            $scope.closeAuthenticateForm = function() {
                $scope.modalOTP = false;
                $scope.login.MobileNumber = "";
                $scope.authenticate.enteredOTP = "";
            };

            // Validate user using mobile number and OTP entered.		-	modification-0008
            $scope.authenticateUser = function() {
                //$scope.login.MobileNumber = "";
                var authenticateUserParam = {};
                authenticateUserParam.mobileNumber = $scope.login.MobileNumber;
                authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);

                getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.validateOTP, authenticateUserParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                        $scope.invalidOTPError = "";
                        $scope.modalOTP = false;

                        var urlPattern = $location.path();
                        if ($scope.isFromLanding) {
                            if ($scope.createTicket) {
                                //added to enable submit button from OTP modal in landing pages
                                $rootScope.disableLandingLeadBtn = false;
                                $rootScope.$broadcast("callCreateTicket", function(contactUsForm) {});
                            } else {
                                $scope.leadCreationUserInfo();
                            }
                        } else {
                            var userLoginInfo = {};
                            userLoginInfo.username = createOTP.data.firstName;
                            userLoginInfo.mobileNumber = createOTP.data.mobile;
                            userLoginInfo.status = true;
                            localStorageService.set("userLoginInfo", userLoginInfo);
                            localStorageService.set("userProfileDetails", createOTP.data);
                            $location.path("/dashboard");
                        }
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.noRecordsFound) {
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.invalidOTPError = $scope.globalLabel.validationMessages.invalidOTP;
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.expiredOTP) {
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.invalidOTPError = $scope.globalLabel.validationMessages.expiredOTP;
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.invalidOTPError = createOTP.message;
                    } else {
                        $rootScope.disableLandingLeadBtn = false;
                        $scope.invalidOTPError = $scope.globalLabel.validationMessages.authOTP;
                    }
                });
            };

            // Resend OTP webservice call.
            $scope.resendOTP = function() {
                var validateLoginParam = {};
                validateLoginParam.paramMap = {};
                validateLoginParam.mobileNumber = $scope.login.MobileNumber;
                validateLoginParam.funcType = $scope.globalLabel.functionType.optAuth;
                validateLoginParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;
                /*if(sessionIDvar){
		
					validateLoginParam.sessionId=sessionIDvar;
		
				}*/
                getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.sendSMS, validateLoginParam, function(createOTP) {

                    if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                        $scope.invalidOTPError = "";
                        $rootScope.disableLandingLeadBtn = false;
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.userNotExist) {
                        $scope.invalidOTPError = createOTP.message;
                        $rootScope.disableLandingLeadBtn = false;
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                        $scope.invalidOTPError = createOTP.message;
                        $scope.disableOTP = true;
                        $rootScope.disableLandingLeadBtn = false;
                    } else if (createOTP.responseCode == $scope.globalLabel.responseCode.mobileInvalidCode) {
                        $scope.invalidOTPError = createOTP.message;
                        $rootScope.disableLandingLeadBtn = false;
                    } else {
                        $scope.invalidOTPError = $scope.globalLabel.errorMessage.createOTP;
                        $rootScope.disableLandingLeadBtn = false;
                    }
                });

            };

            var todayDate = new Date();
            var formatedTodaysDate = ("0" + (todayDate.getMonth() + 1).toString()).substr(-2) + "/" +
                ("0" + todayDate.getDate().toString()).substr(-2) + "/" + (todayDate.getFullYear().toString());
            getPolicyStatusList(formatedTodaysDate);
            /*Fetching default Metro cities and respective RTO details. commented because RTO details failing*/
            if (!localStorageService.get("websiteVisitedOnce")) {
                // Fetching default Metro cities and respective RTO details.
                var popularRTOParam = {};
                popularRTOParam.popularRTOList = "Y";
                if ($scope.selectedBusinessLineId == 3 || $scope.selectedBusinessLineId == 2) {
                    getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getPopularRTO, popularRTOParam, function(callbackMetro) {
                         if(callbackMetro.data){
                            localStorageService.set("defaultMetroCityList", callbackMetro.data);
                            $scope.defaultMetroList = callbackMetro.data;
                            }else{
                            $scope.defaultMetroList = commonResultLabels.popularRTOList.data;
					        localStorageService.set("defaultMetroCityList", $scope.defaultMetroList);
                            }


                        var cityName = localStorageService.get("carRegAddress") ? localStorageService.get("carRegAddress").city : "Mumbai";
                        var cityName = localStorageService.get("bikeRegistrationPlaceUsingIP") ? localStorageService.get("bikeRegistrationPlaceUsingIP").city : "MUMBAI";
                        console.log('local storage is cleared cityName is : ',cityName);
                        if ($scope.selectedBusinessLineId == 3 && localStorageService.get("carQuoteInputParamaters")) {

                            if ($rootScope.vehicleInfo) {
                                if ($rootScope.selectedCarRegistrationObject != null || String($rootScope.selectedCarRegistrationObject) != "undefined") {
                                    cityName = $rootScope.selectedCarRegistrationObject.city;
                                }else {
                                    $scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
                                    cityName = $scope.vehicleInfo.city;
                                }
                            }
                            // if(cityName == " "){
                            // 	cityName = localStorageService.get("carRegAddress")? localStorageService.get("carRegAddress").city : "Mumbai";
                            // }
                        } else if($scope.selectedBusinessLineId == 2){
                             if ($rootScope.selectedBikeRegistrationObject != null || String($rootScope.selectedBikeRegistrationObject) != "undefined") {
                                    cityName = $rootScope.selectedBikeRegistrationObject.city;
                                } 
                    }
                        //commented from website restructure
                        // else if ($scope.selectedBusinessLineId == 2 && localStorageService.get("bikeQuoteInputParamaters")) {
                        //     if ($rootScope.vehicleInfo) {
                        //         if ($rootScope.selectedRegistrationObject != null || String($rootScope.selectedRegistrationObject) != "undefined") {
                        //             cityName = $rootScope.selectedRegistrationObject.city;
                        //         } 
                                // else {
                                //     $scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
                                //     cityName = $scope.vehicleInfo.city;
                                // }
                           // }
                            // if(cityName == " "){
                            // 	cityName = localStorageService.get("bikeRegAddress")? localStorageService.get("bikeRegAddress").city : "Mumbai";
                            // }
                        //}
                        $scope.getRegPlaceListUsingIPCity(cityName, function() {
                            for (var i = 0; i < $scope.tabs.length; i++) {
                                if ($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId) {
                                    $scope.inputTitle = $scope.tabs[i].inputTitle;
                                    $scope.currentTab = $scope.tabs[i].url;
                                    break;
                                }
                            }
                        });
                        var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");
                        if (vehicleDetailsCookie) {
                            if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
                                vehicleDetailsCookie.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
                                localStorageService.set("selectedCarDetails", vehicleDetailsCookie);
                            }
                        }

                        var vehicleDetailsCookieBike = localStorageService.get("selectedBikeDetails");
                        if (vehicleDetailsCookieBike) {
                            if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
                                vehicleDetailsCookieBike.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
                                localStorageService.set("selectedBikeDetails", vehicleDetailsCookieBike);
                            }
                        }

                    });
                }
            } else {
                // var city = localStorageService.get("carRegAddress") != null ? localStorageService.get("carRegAddress").city : "Mumbai";
                console.log('city name in step 2 is: ',cityName);
                if($scope.selectedBusinessLineId == 3 ){
                    var cityName = localStorageService.get("carRegAddress") ? localStorageService.get("carRegAddress").city : "Mumbai";
                if ($scope.selectedBusinessLineId == 3 && localStorageService.get("carQuoteInputParamaters")) {
                    if ($rootScope.vehicleInfo) {
                        if ($rootScope.selectedCarRegistrationObject != null || String($rootScope.selectedCarRegistrationObject) != "undefined") {
                            cityName = $rootScope.selectedCarRegistrationObject.city;
                        } else {
                            $scope.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
                            cityName = $scope.vehicleInfo.city;
                        }
                    }
                    // if(cityName == " "){
                    // 	cityName = localStorageService.get("carRegAddress")? localStorageService.get("carRegAddress").city : "Mumbai";
                    // }
                }
                //new else if block added from website restructure 
            }else if($scope.selectedBusinessLineId == 2){
                var cityName = localStorageService.get("bikeRegistrationPlaceUsingIP") != null ? localStorageService.get("bikeRegistrationPlaceUsingIP").rtoCity : "MUMBAI";
                if ($rootScope.selectedBikeRegistrationObject != null || String($rootScope.selectedBikeRegistrationObject) != "undefined") {
                        cityName = $rootScope.selectedBikeRegistrationObject.city;
                }
            }
        
                //commented from website restructure
                //  else if ($scope.selectedBusinessLineId == 2 && localStorageService.get("bikeQuoteInputParamaters")) {
                //     if ($rootScope.vehicleInfo) {
                //         if ($rootScope.selectedRegistrationObject != null || String($rootScope.selectedRegistrationObject) != "undefined") {
                //             cityName = $rootScope.selectedRegistrationObject.city;
                //         }
                //         //  else {
                //         //     $scope.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
                //         //     cityName = $scope.vehicleInfo.city;
                //         // }
                //     }
                //     // if(cityName == " "){
                //     // 	cityName = localStorageService.get("bikeRegAddress")? localStorageService.get("bikeRegAddress").city : "Mumbai";
                //     // }
                // }

                $scope.getRegPlaceListUsingIPCity(cityName, function() {
                    if ($rootScope.vehicleInfo) {
                        if (localStorageService.get("selectedBusinessLineId") == 3) {
                            if ((!$rootScope.vehicleInfo.registrationPlace) && (!localStorageService.get("carRegistrationPlaceUsingIP") || !localStorageService.get("carRegistrationPlaceUsingIP").rtoStatus)) {
                                var city = (localStorageService.get("carRegAddress")) ? localStorageService.get("carRegAddress").city : "Mumbai";
                                $scope.getRegPlaceListUsingIPCity(city, function() {
                                    $scope.$broadcast("callSingleClickCarQuote", {});
                                });
                            }
                        } else if (localStorageService.get("selectedBusinessLineId") == 2) {
                           // if ((!$rootScope.vehicleInfo.registrationPlace) && (!localStorageService.get("bikeRegistrationPlaceUsingIP") || !localStorageService.get("bikeRegistrationPlaceUsingIP").rtoStatus)) {
                                var city = (localStorageService.get("bikeRegistrationPlaceUsingIP")) ? localStorageService.get("bikeRegistrationPlaceUsingIP").rtoCity : "Mumbai";
                                $scope.getRegPlaceListUsingIPCity(city, function() {
                                    $scope.$broadcast("callSingleClickBikeQuote", {});
                                });
                           // }
                        }
                    }

                    for (var i = 0; i < $scope.tabs.length; i++) {
                        if ($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId) {
                            $scope.inputTitle = $scope.tabs[i].inputTitle;
                            $scope.currentTab = $scope.tabs[i].url;
                            break;
                        }
                    }
                    $scope.defaultMetroList = localStorageService.get("defaultMetroCityList");
                });
                var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");
                if (vehicleDetailsCookie) {
                    if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
                        vehicleDetailsCookie.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
                        localStorageService.set("selectedCarDetails", vehicleDetailsCookie);
                    }
                }
                var vehicleDetailsCookieBike = localStorageService.get("selectedBikeDetails");
                if (vehicleDetailsCookieBike) {
                    if (String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null) {
                        vehicleDetailsCookieBike.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
                        localStorageService.set("selectedBikeDetails", vehicleDetailsCookieBike);
                    }
                }
            }
            /*
             * Fetching default Metro cities and respective RTO details irrespective of website_visited_once.*/
            /*var popularRTOParam = {};
			popularRTOParam.popularRTOList = "Y";
			getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getPopularRTO, popularRTOParam, function(callbackMetro){
				localStorageService.set("defaultMetroCityList", callbackMetro.data);
				$scope.defaultMetroList = callbackMetro.data;
		
				var city = localStorageService.get("carRegAddress") != null ? localStorageService.get("carRegAddress").city : "Mumbai";
				if($scope.selectedBusinessLineId==3 && localStorageService.get("carQuoteInputParamaters"))
				{
					if($rootScope.vehicleInfo){
						if($rootScope.selectedRegistrationObject != null || String($rootScope.selectedRegistrationObject) != "undefined")
						{
							city=$rootScope.selectedRegistrationObject.city;	
						}
						else
						{
							$scope.vehicleInfo=localStorageService.get("carQuoteInputParamaters").vehicleInfo;
							city=$scope.vehicleInfo.city;
						}
					}
				}
				else if($scope.selectedBusinessLineId==2 && localStorageService.get("bikeQuoteInputParamaters" ))
				{	if($rootScope.vehicleInfo){
					if($rootScope.selectedRegistrationObject != null || String($rootScope.selectedRegistrationObject) != "undefined")
					{
						city=$rootScope.selectedRegistrationObject.city;	
					}
					else
					{
						$scope.vehicleInfo=localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
						city=$scope.vehicleInfo.city;
					}
				}
				}
		
				$scope.getRegPlaceListUsingIPCity(city, function(){
					for(var i = 0; i < $scope.tabs.length; i++){
						if($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId){
							$scope.inputTitle = $scope.tabs[i].inputTitle;
							$scope.currentTab = $scope.tabs[i].url;
							break;
						}
					}
		
				});
				var vehicleDetailsCookie = localStorageService.get("selectedCarDetails");
				if(vehicleDetailsCookie){
					if(String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null){
						vehicleDetailsCookie.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
						localStorageService.set("selectedCarDetails", vehicleDetailsCookie);
					}
				}
		
				var vehicleDetailsCookieBike = localStorageService.get("selectedBikeDetails");
				if(vehicleDetailsCookieBike){
					if(String($rootScope.vehicleDetails) != "undefined" && $rootScope.vehicleDetails != null){
						vehicleDetailsCookieBike.registrationNumber = $rootScope.vehicleDetails.registrationNumber;
						localStorageService.set("selectedBikeDetails", vehicleDetailsCookieBike);
					}
				}
		
			});*/


            function getLocationDetails(position) {
                findCityBasedIP($http, position, $scope.globalLabel.responseCode.success, function(cityFromIP, pincodeFromIP, stateFromIP, cityFoundStatus) {
                    var IPBasedCityDetails = {};
                    IPBasedCityDetails.city = cityFromIP;
                    IPBasedCityDetails.pincode = pincodeFromIP;
                    IPBasedCityDetails.state = stateFromIP;
                    // IPBasedCityDetails.cityStatus = cityFoundStatus;
                    if ($scope.selectedBusinessLineId == 3) {
                        localStorageService.set("carRegAddress", IPBasedCityDetails);
                    } else if ($scope.selectedBusinessLineId == 2) {
                        localStorageService.set("bikeRegAddress", IPBasedCityDetails);
                    }

                    $scope.getRegPlaceListUsingIPCity(cityFromIP, function() {
                        if ($scope.selectedBusinessLineId == 3) {
                            $scope.$broadcast("callSingleClickCarQuote", {});
                        } else if ($scope.selectedBusinessLineId == 2) {
                            $scope.$broadcast("callSingleClickBikeQuote", {});
                        }
                    });
                });
            }

            if (!localStorageService.get("websiteVisitedOnce")) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLocationDetails);
                } else {
                    console.log("Geolocation is not supported by this browser.");
                    var position = undefined;
                    getLocationDetails(position);
                }
            }

            $scope.backToProfessionalJourney = function() {
                $location.path("/professionalJourney");
            }

            // Below piece of code will be executed when user changes business line from UI.
            $scope.onClickTab = function(tab) {
                if ($rootScope.tabSelectionStatus) {
                    if (tab.disabled)
                        return;
                    //wordpress	
                    $scope.disabledRedirectToResult = false;
                    if ($rootScope.wordPressEnabled) {
                        $rootScope.isBackButtonPressed = false;
                        $rootScope.viewOptionDisabled = false;
                        $scope.displayResult = false;
                        $rootScope.displayInstantScreen = true;
                        $scope.createLeadScreen = false;
                        $rootScope.enabledProgressLoader = false;
                        if (tab.businessLineId == 3) {
                            $scope.dynamicColor = "carBg";
                            $scope.dynamicInnerBg = "wp_carInnerBg";
                        } else if (tab.businessLineId == 2) {
                            $scope.dynamicColor = "bikeBg";
                            $scope.dynamicInnerBg = "wp_bikeInnerBg";
                        } else if (tab.businessLineId == 1) {
                            $scope.dynamicColor = "termBg";
                            $scope.dynamicInnerBg = "wp_lifeInnerBg";
                        } else if (tab.businessLineId == 4) {
                            $scope.dynamicColor = "healthBg";
                            $scope.dynamicInnerBg = "wp_healthInnerBg";
                        } else if (tab.businessLineId == 5) {
                            $scope.dynamicColor = "travelBg";
                            $scope.dynamicInnerBg = "wp_travelInnerBg";
                        } else if (tab.businessLineId == 6) {
                            $scope.dynamicColor = "criticalIllnessBg";
                            $scope.dynamicInnerBg = "wp_criticalIllnessInnerBg";
                        } else if (tab.businessLineId == 8) {
                            $scope.dynamicColor = "personalAccidentBg";
                            $scope.dynamicInnerBg = "wp_personalAccidentInnerBg";
                        } else if (tab.businessLineId == 7) {
                            $scope.dynamicColor = "homeBg";
                            $scope.dynamicInnerBg = "wp_homeInnerBg";
                        }
                    }

                    if ($scope.currentTab == tab.url) {
                        return;
                    }

                    $scope.inputTitle = tab.inputTitle;
                    $rootScope.minAnnualPremium = 1000;
                    $rootScope.maxAnnualPremium = 5000;
                    $rootScope.exclusiveDiscountsLength = "00";
                    $rootScope.calculatedQuotesLength = "00";
                    $rootScope.calculatedRidersLength = "00";

                    localStorage.setItem('selectedBusinessLineId', tab.businessLineId)
                    localStorageService.set("selectedBusinessLineId", tab.businessLineId);

                    if (tab.businessLineId == 1) {
                        $rootScope.instantQuoteInvalidSummaryStatus = true;
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelLife;
                    } else if (tab.businessLineId == 2) {
                        $rootScope.instantQuoteInvalidSummaryStatus = true;
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelBike;
                    } else if (tab.businessLineId == 3) {
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelCar;
                    } else if (tab.businessLineId == 4) {
                        $rootScope.instantQuoteInvalidSummaryStatus = true;
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelHealth;
                    } else if (tab.businessLineId == 5) {
                        $rootScope.instantQuoteInvalidSummaryStatus = true;
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelTravel;
                    } else if (tab.businessLineId == 6) {
                        $rootScope.instantQuoteInvalidSummaryStatus = true;
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelLife;
                    } else if (tab.businessLineId == 8) {
                        $rootScope.instantQuoteInvalidSummaryStatus = true;
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelPersonalAccident;
                    } else if (tab.businessLineId == 7) {
                        $rootScope.instantQuoteInvalidSummaryStatus = true;
                        $rootScope.instantQuoteScreenHeader = $scope.globalLabel.applicationLabels.common.premiumSliderModalLabelLife;
                    }


                    $scope.selectedBusinessLineId = tab.businessLineId;
                    $scope.currentTab = tab.url;

                }
            };

            $scope.isActiveTab = function(tabUrl) {
                return tabUrl == $scope.currentTab;
            };

            if (localStorageService.get("carRegistrationDetails")) {
                $rootScope.showCarRegAreaStatus = false;
            } else {
                if ($location.path() == "/professionalJourney") {
                    if (localStorageService.get("selectedCarDetails")) {
                        $rootScope.showCarRegAreaStatus = localStorageService.get("selectedCarDetails").showCarRegAreaStatus
                    } else{
                        $rootScope.showCarRegAreaStatus = true;
                    }
                } else {
                    $rootScope.showCarRegAreaStatus = true;
                }
            }

            if (localStorageService.get("bikeRegistrationDetails")) {
                //$rootScope.showBikeRegAreaStatus = false
                if (localStorageService.get("selectedBikeDetails")) {
                    $rootScope.showBikeRegAreaStatus = false;

                } else {
                    $rootScope.showBikeRegAreaStatus = localStorageService.get("selectedBikeDetails").showBikeRegAreaStatus
                }
            } else {
                $rootScope.showBikeRegAreaStatus = true;
            }





            $scope.modalVehicleRegistration = false;
            $scope.toggleVehicleRegistrationPopup = function(regAreaStatus) {
                $rootScope.selectedRegData = "";
                $rootScope.vehicleDetails.registrationNumber = "";
                //reseting chasis number,engine number on  toggling of vehicleRegistrationPopup
                $rootScope.isregNumber = false;
                //added for landing pages
                if (localStorageService.get("selectedBusinessLineId") == 3) {
                    $scope.vehicleDetails = localStorageService.get("selectedCarDetails");
                    $scope.vehicleDetails.engineNumber = '';
                    $scope.vehicleDetails.chassisNumber = '';
                    $scope.vehicleDetails.isregNumberDisabled = false;
                    $scope.vehicleDetails.showBikeRegAreaStatus = regAreaStatus;
                    localStorageService.set("selectedCarDetails", $scope.vehicleDetails);
                }
                if (localStorageService.get("selectedBusinessLineId") == 2) {
                    $scope.vehicleDetails = localStorageService.get("selectedBikeDetails");
                    $scope.vehicleDetails.engineNumber = '';
                    $scope.vehicleDetails.chassisNumber = '';
                    $scope.vehicleDetails.isregNumberDisabled = false;
                    $scope.vehicleDetails.showBikeRegAreaStatus = regAreaStatus;
                    localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);
                }
                if(localStorageService.get("selectedBusinessLineId")){
                if (regAreaStatus == false && localStorageService.get("selectedBusinessLineId") == 2 && $rootScope.disableBikeRegPopup == false) {
                    $scope.modalVehicleRegistration = false;
                    $rootScope.showBikeRegAreaStatus = false;
                } else if (regAreaStatus == true && localStorageService.get("selectedBusinessLineId") == 2 && $rootScope.disableBikeRegPopup == false) {
                    $scope.modalVehicleRegistration = true;
                    $rootScope.showBikeRegAreaStatus = true;
                } else if (regAreaStatus == false && localStorageService.get("selectedBusinessLineId") == 3 && $rootScope.disableCarRegPopup == false) {
                    $scope.modalVehicleRegistration = false;
                    $rootScope.showCarRegAreaStatus = false;
                } else if (regAreaStatus == true && localStorageService.get("selectedBusinessLineId") == 3 && $rootScope.disableCarRegPopup == false) {
                    $scope.modalVehicleRegistration = true;
                    $rootScope.showCarRegAreaStatus = true;
                }
            }else{
                $rootScope.showBikeRegAreaStatus = !regAreaStatus; 
                $rootScope.showCarRegAreaStatus = !regAreaStatus; 
            }

                $scope.hideModal = function() {
                    $scope.modalVehicleRegistration = false;
                    //added new
                    $rootScope.regNumStatus = false;
                };

                setTimeout(function() {
                    $('.clickMetro').css('height', '50px');
                    $('.showMetro').hide();
                }, 100);

                //setTimeout(function () {
                $('.clickMetro').click(function() {
                    $('.showMetro').hide();
                    $(this).find('.showMetro').show();
                    $('.thumbnail').removeClass('RToButtonActive');
                    $('.thumbnail').addClass('RToButton');
                    $(this).find('.thumbnail').addClass('RToButtonActive');
                    var getHeight = $(this).find('.showMetro').height();
                    $('.clickMetro').css('height', '50px');
                    $(this).css('height', getHeight + 50);
                });
                //}, 2000);
            };

            $scope.hideStatus = true;
            $scope.oldMetroSelected = undefined;
            $scope.selectedMetroRTO = function(metrosRTOList) {
                $scope.metros = metrosRTOList;

                if ($scope.oldMetroSelected == metrosRTOList) {
                    $scope.hideStatus = true;
                    $scope.oldMetroSelected = undefined;
                    setTimeout(function() {
                        $('.clickMetro').css('height', '50px');
                        $('.showMetro').hide();
                        $('.thumbnail').addClass('RToButton');
                        //$('.thumbnail').css('background','#2a3279;');
                        //$('.thumbnail').css('color','#fff');
                    }, 100);
                } else {
                    $scope.hideStatus = false;
                    $scope.oldMetroSelected = metrosRTOList;
                }
                //add dummy div for UI fix
                if ($scope.metros.RTODetails.length % 3 == 2) {
                    $scope.dummyLength = 1;
                } else if ($scope.metros.RTODetails.length % 3 == 1) {
                    $scope.dummyLength = 2;
                } else {
                    $scope.dummyLength = 0;
                }

            };

            // Method to get list of RTO details from DB.
            $scope.getRegPlaceList = function(city) {
                if (city.indexOf('-') > 0)
                    city = city.replace('-', '');
                return $http.get(getServiceLink + $scope.globalLabel.documentType.RTODetails + "&q=" + city).then(function(response) {
                    return JSON.parse(response.data).data;
                });
            };

            // Method to get list of Hospital details from DB.

            $scope.getHospitalList = function() {

                var selectedLineOfBusiness = localStorageService.get("selectedBusinessLineId");
                if (selectedLineOfBusiness == 4) {
                    var str = localStorageService.get("healthQuoteInputParamaters").personalInfo.city;
                    var splitStr = str.toLowerCase().split(' ');
                    for (var i = 0; i < splitStr.length; i++) {
                        // You do not need to check if i is larger than splitStr length, as your for does that for you
                        // Assign it back to the array
                        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                    }
                    // Directly return the joined string
                    var cityFormatted = splitStr.join(' ');
                    getListFromDB(RestAPI, cityFormatted, "cashlessHospital", $scope.globalLabel.request.findAppConfig, function(hospitalList) {
                        if (hospitalList.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.hospitalList = hospitalList.data;
                            localStorageService.set("hospitalList", hospitalList.data);
                        }
                    });
                }
            };

            // Method to get list of garage details from DB.
            $scope.getGarageList = function() {
                var documentId;
                var selectedLineOfBusiness = localStorageService.get("selectedBusinessLineId");
                if (selectedLineOfBusiness == 3) {
                    //method for garageDetails  
                    $scope.garageList = {};
                    if(vehicleInfo!=" "){
                    $scope.garageList.city = localStorageService.get("carQuoteInputParamaters").vehicleInfo.city;}
                   // $scope.garageList.variantId = localStorageService.get("carQuoteInputParamaters").vehicleInfo.variantId;
                   var selectedMake = "";
                   if(localStorageService.get("carQuoteInputParamaters")){
                        if(localStorageService.get("carQuoteInputParamaters").vehicleInfo.make){
                            $scope.garageList.make = localStorageService.get("carQuoteInputParamaters").vehicleInfo.make;
                        }else{
                            $scope.garageList.make = "Maruti Suzuki";
                        }
                   }else{
                            $scope.garageList.make = "Maruti Suzuki";
                   }
                 //  $scope.garageList.make = localStorageService.get("carQuoteInputParamaters").vehicleInfo.make;
                   if(localStorageService.get("carRegistrationDetails")){
                    $scope.garageList.regisCode = localStorageService.get("carRegistrationDetails").RTOCode;
                    }else{
                    $scope.garageList.regisCode = localStorageService.get("carQuoteInputParamaters").vehicleInfo.RTOCode;
                }
                    RestAPI.invoke($scope.globalLabel.transactionName.getGarageDetails, $scope.garageList).then(function(callback) {
                        if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                            var garageResponse = callback;
                            if (garageResponse != null && String(garageResponse) != "undefined") {
                                localStorageService.set("garageDetails", garageResponse.data);
                            } else {
                                localStorageService.set("garageDetails", undefined);
                            }
                        } else {
                            localStorageService.set("garageDetails", undefined);
                        }
                    });
                }
            }

            $scope.onSelect = function(item) {
                $scope.modalVehicleRegistration = false;
                //$rootScope.selectedRegistrationObject = item;
                $rootScope.vehicleInfo.registrationPlace = item.display;
                $rootScope.vehicleDetails.registrationNumber = '';

                //flag for disabling registration number
                $rootScope.isregNumber = false;
                //reseting chasis number,engine number on click of vehicleRegistrationPopup
                if (localStorageService.get("selectedBusinessLineId") == 2) {
                    $rootScope.selectedBikeRegistrationObject = item;
                    $scope.vehicleDetails = localStorageService.get("selectedBikeDetails")
                    $scope.vehicleDetails.engineNumber = '';
                    $scope.vehicleDetails.chassisNumber = '';
                    $scope.vehicleDetails.isregNumberDisabled = false;
                    $rootScope.showBikeRegAreaStatus = true;
                    $scope.showRegAreaStatus = $rootScope.showBikeRegAreaStatus;
                    if ($scope.vehicleInfo.registrationNumber) {
                        $scope.vehicleInfo.registrationNumber = '';
                    }
                    localStorageService.set("selectedBikeDetails", $scope.vehicleDetails);
                }
                if (localStorageService.get("selectedBusinessLineId") == 3) {
                    $rootScope.selectedCarRegistrationObject = item;
                    $scope.vehicleDetails = localStorageService.get("selectedCarDetails")
                    $scope.vehicleDetails.engineNumber = '';
                    $scope.vehicleDetails.chassisNumber = '';
                    $scope.vehicleDetails.isregNumberDisabled = false;
                    $rootScope.showCarRegAreaStatus = true;
                    $scope.showRegAreaStatus = $rootScope.showCarRegAreaStatus;
                    if ($scope.vehicleInfo.registrationNumber) {
                        $scope.vehicleInfo.registrationNumber = '';
                    }
                    localStorageService.set("selectedCarDetails", $scope.vehicleDetails);
                }


                var rtoDetail = {};
                rtoDetail.rtoName = item.display;
                rtoDetail.rtoCity = item.city;
                rtoDetail.rtoState = item.state;
                rtoDetail.rtoStatus = true;
                rtoDetail.rtoObject = item;
                getPincodeFromCity($http, rtoDetail, function(resultedRTOInfo) {
                    if (resultedRTOInfo.responseCode == $scope.globalLabel.responseCode.success) {
                        rtoDetail.rtoPincode = resultedRTOInfo.data[0].pincode;
                    } else {
                        rtoDetail.rtoPincode = "";
                    }

                    if (localStorageService.get("selectedBusinessLineId") == 3) {
                        if (localStorageService.get("carRegAddress")) {
                            localStorageService.get("carRegAddress").pincode = rtoDetail.rtoPincode;
                            localStorageService.get("carRegAddress").city = $rootScope.selectedCarRegistrationObject.city;
                            localStorageService.get("carRegAddress").state = $rootScope.selectedCarRegistrationObject.state;
                        } else {
                            var getCity = {};
                            getCity.pincode = rtoDetail.rtoPincode;
                            getCity.city = $rootScope.selectedCarRegistrationObject.city;
                            getCity.state = $rootScope.selectedCarRegistrationObject.state;

                            localStorageService.set("carRegAddress", getCity);
                        }
                        localStorageService.set("carRegistrationPlaceUsingIP", rtoDetail);
                    } else if (localStorageService.get("selectedBusinessLineId") == 2) {
                        if (localStorageService.get("bikeRegAddress")) {
                            localStorageService.get("bikeRegAddress").pincode = rtoDetail.rtoPincode;
                            localStorageService.get("bikeRegAddress").city = $rootScope.selectedBikeRegistrationObject.city;
                            localStorageService.get("bikeRegAddress").state = $rootScope.selectedBikeRegistrationObject.state;
                        } else {
                            var getCity = {};
                            getCity.pincode = rtoDetail.rtoPincode;
                            getCity.city = $rootScope.selectedBikeRegistrationObject.city;
                            getCity.state = $rootScope.selectedBikeRegistrationObject.state;
                            localStorageService.set("bikeRegAddress", getCity);
                        }
                        localStorageService.set("bikeRegistrationPlaceUsingIP", rtoDetail);
                    }

                    if (!$rootScope.wordPressEnabled || $scope.isFromLanding) {
                        if ($scope.selectedBusinessLineId == 3) {
                            $scope.$broadcast("callSingleClickCarQuote", {});
                        } else {
                            $scope.$broadcast("callSingleClickBikeQuote", {});
                        }
                    }
                });

                // if (localStorageService.get("carRegAddress")) {
                // 	var getCity = localStorageService.get("carRegAddress");
                // }
                // else {
                // 	var getCity = {};
                // }
                // getCity.pincode = rtoDetail.rtoPincode;
                // getCity.city = $rootScope.selectedRegistrationObject.city;
                // getCity.state = rtoDetail.rtoState;
                // localStorageService.set("carRegAddress", getCity);

                // if (localStorageService.get("bikeRegAddress")) {
                // 	var getCity = localStorageService.get("bikeRegAddress");
                // }
                // else {
                // 	var getCity = {};
                // }
                // getCity.pincode = rtoDetail.rtoPincode;
                // getCity.city = $rootScope.selectedRegistrationObject.city;
                // getCity.state = rtoDetail.rtoState;
                // localStorageService.set("bikeRegAddress", getCity);

            };

            //flag to redirect to quote page
            $scope.redirectWithFlag = function(param) {
                $scope.getParamForQuote = param;
            }

            // Function created to redirect result screen.
            $scope.redirectResultScreen = function() {
                //logic for redirection based on LOB
                var selectedTab;
                for (var i = 0; i < $scope.tabs.length; i++) {
                    if ($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId) {
                        selectedTab = $scope.tabs[i].name;
                        break;
                    }
                }
                $location.path("/" + selectedTab + 'Result');
            }


            if ($rootScope.isBackButtonPressed) {
                $scope.quoteUserInfo = quoteUserInfoCookie;
            }
            // Create lead with available user information by calling webservice.	-	modification-0010
            $scope.leadCreationUserInfo = function() {

                $rootScope.loading = true;
                $scope.disabledRedirectToResult = true;
                var userInfoWithQuoteParam = {};
                $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
                
                // Quote user info added to central DB using DataWriter service.	-	modification-0002
                //createLeadStatus flag added to create new lead for the user who completed buy journey(transaction till payment success) for any insurance type(car/bike/health/life)
                if (!$scope.quoteUserInfo.createLeadStatus) {
                    $scope.quoteUserInfo.createLeadStatus = false;
                }
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.life) {
                    userInfoWithQuoteParam.quoteParam = localStorageService.get("lifeQuoteInputParamaters").quoteParam;
                    userInfoWithQuoteParam.personalDetails = localStorageService.get("lifeQuoteInputParamaters").personalDetails;
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
                    userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED");
                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.bike) {
                    userInfoWithQuoteParam.quoteParam = localStorageService.get("bikeQuoteInputParamaters").quoteParam;
                    userInfoWithQuoteParam.vehicleInfo = localStorageService.get("bikeQuoteInputParamaters").vehicleInfo;
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("BIKE_UNIQUE_QUOTE_ID");
                    userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED");
                  // userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.car) {
                    userInfoWithQuoteParam.quoteParam = localStorageService.get("carQuoteInputParamaters").quoteParam;
                    userInfoWithQuoteParam.vehicleInfo = localStorageService.get("carQuoteInputParamaters").vehicleInfo;
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("CAR_UNIQUE_QUOTE_ID");
                    userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED");
                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.health) {
                    userInfoWithQuoteParam.quoteParam = localStorageService.get("healthQuoteInputParamaters").quoteParam;
                    // Added by Gauri gor getting pincode
                    userInfoWithQuoteParam.personalInfo = localStorageService.get("healthQuoteInputParamaters").personalInfo;
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
                    userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED");
                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.travel) {
                    var quoteParam = angular.copy(localStorageService.get("travelQuoteInputParamaters").quoteParam);
                    userInfoWithQuoteParam.quoteParam = quoteParam;
                    userInfoWithQuoteParam.quoteParam.gender = quoteParam.travellers[0].gender;
                    userInfoWithQuoteParam.quoteParam.age = quoteParam.travellers[0].age;
                    var travelDetails = angular.copy(localStorageService.get("travelDetails"));
                    userInfoWithQuoteParam.travelDetails = travelDetails;
                    if (travelDetails.destinations.length == 1) {
                        userInfoWithQuoteParam.travelDetails.country = travelDetails.destinations[0].displayField;
                    } else if (travelDetails.destinations.length > 1) {
                        userInfoWithQuoteParam.travelDetails.country = "Multipal";
                    }
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");
                    userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID__ENCRYPTED");
                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.criticalIllness) {

                    userInfoWithQuoteParam.quoteParam = localStorageService.get("criticalIllnessQuoteInputParamaters").quoteParam;
                    userInfoWithQuoteParam.personalDetails = localStorageService.get("criticalIllnessQuoteInputParamaters").personalDetails;
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID");
                    userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("CRITICAL_ILLNESS__UNIQUE_QUOTE_ID_ENCRYPTED");

                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;

                } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.personalAccident) {

                    userInfoWithQuoteParam.quoteParam = localStorageService.get("personalAccidentQuoteInputParamaters").quoteParam;
                    userInfoWithQuoteParam.personalDetails = localStorageService.get("personalAccidentQuoteInputParamaters").personalDetails;
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("PERSONAL_ACCIDENT_UNIQUE_QUOTE_ID");
                    // userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED");
                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                } else if ($scope.selectedBusinessLineId == $scope.globalLabel.businessLineType.home) {

                    userInfoWithQuoteParam.quoteParam = localStorageService.get("homeQuoteInputParamaters").quoteParam;
                    userInfoWithQuoteParam.personalDetails = localStorageService.get("homeQuoteInputParamaters").personalDetails;
                    userInfoWithQuoteParam.QUOTE_ID = localStorageService.get("HOME_UNIQUE_QUOTE_ID");
                    // userInfoWithQuoteParam.UNIQUE_QUOTE_ID_ENCRYPTED = localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED");
                    userInfoWithQuoteParam.quoteParam.quoteType = $scope.selectedBusinessLineId;
                }

                userInfoWithQuoteParam.contactInfo = $scope.quoteUserInfo;
                if (localStorageService.get("professionalQuoteParams")) {
                    var profQuoteRequest = localStorageService.get("professionalQuoteParams");
                    if (profQuoteRequest && profQuoteRequest.commonInfo) {
                        profQuoteRequest.commonInfo.firstName = $scope.quoteUserInfo.firstName;
                        profQuoteRequest.commonInfo.lastName = $scope.quoteUserInfo.lastName;
                        profQuoteRequest.commonInfo.mobileNumber = $scope.quoteUserInfo.mobileNumber;
                        profQuoteRequest.commonInfo.emailId = $scope.quoteUserInfo.emailId;
                        localStorageService.set("professionalQuoteParams", profQuoteRequest);
                    }
                } 
                userInfoWithQuoteParam.requestSource = "web";
                if (campaignSource.utm_source) {
                    userInfoWithQuoteParam.utm_source = campaignSource.utm_source;
                }
                if (campaignSource.utm_medium) {
                    userInfoWithQuoteParam.utm_medium = campaignSource.utm_medium;
                }

                //Webservice call for lead creation.	-	modification-0010
                //commenting as call should go to create lead always
                //if (($scope.createLeadForm.$dirty || $scope.quoteUserInfo.createLeadStatus) || ($scope.quoteUserInfo != null && $scope.quoteUserInfo.messageId == '')) {

                //added by gauri
               // $scope.quoteParam = userInfoWithQuoteParam.quoteParam;
                $scope.personalInfo = userInfoWithQuoteParam.personalInfo;

                RestAPI.invoke($scope.globalLabel.transactionName.createLead, userInfoWithQuoteParam).then(function(callback) {
                    if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                        messageIDVar = callback.data.messageId;
                        document.cookie = "messageId=" + messageIDVar;
                        $scope.quoteUserInfo.messageId = messageIDVar;
                        $scope.quoteUserInfo.createLeadStatus = false;
                        localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
                        
                        //added by gauri for mautic application
                        if (imauticAutomation == true) {
                            var selectedTab;
                            for (var i = 0; i < $scope.tabs.length; i++) {
                                if ($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId) {
                                    selectedTab = $scope.tabs[i].name;
                                    break;
                                }
                            }
                            if (selectedTab == 'bike') {
                                imatBikeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                            }
                            if (selectedTab == 'car') {
                                imatCarLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                            }
                            if (selectedTab == 'health') {
                                imatHealthLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                            }
                            if (selectedTab == 'life') {
                                imatLifeLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                            }
                            if (selectedTab == 'travel') {
                                imatTravelLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                            }
                            if (selectedTab == 'criticalIllness') {
                                imatCriticalIllnessLeadQuoteInfo(localStorageService, $scope, 'LeadSubmitted');
                            }

                        }
                    }
                    if($location.path() =="/healthLanding" || $location.path() =="/lifeLanding"){
                        var landingEmailReceipentlist =["mohammad.kantawala@navnitinsurance.com"];
                        for(var i=0 ; i < landingEmailReceipentlist.length ; i++){
                        var proposalDetailsEmail = {};
                        proposalDetailsEmail.paramMap = {};
                        proposalDetailsEmail.funcType = "LandingEmailCampaign";
                        proposalDetailsEmail.isBCCRequired = 'Y';
                        proposalDetailsEmail.paramMap.userId = landingEmailReceipentlist[i];
                        proposalDetailsEmail.username = landingEmailReceipentlist[i];
                        proposalDetailsEmail.paramMap.mobileNumber = $scope.quoteUserInfo.mobileNumber;
                        if($location.path() =="/healthLanding"){
                        proposalDetailsEmail.paramMap.selectedPolicyType = "health";
                        }else{
                        proposalDetailsEmail.paramMap.selectedPolicyType = "life"; 
                        }
                        console.log("proposalDetailsEmail in send email landing user is: ",proposalDetailsEmail);
                        
                        var request = {};
                        var header = {};
                        var arr = $scope.EmailChoices;

                        header.messageId = messageIDVar;
                        header.campaignID = campaignIDVar;
                        header.source = sourceOrigin;
                        header.transactionName = sendEmail;
                        header.deviceId = deviceIdOrigin;
                        request.header = header;
                    
                    request.body = proposalDetailsEmail;
                    $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                        success(function (callback) {
                            var emailResponse = JSON.parse(callback);
                        if (emailResponse.responseCode == 1000) {
                            console.log("email sent to :",proposalDetailsEmail.username);
                                $scope.redirectResultScreen();  
                        }
                    })
                    }
                    }
                    if($location.path() !="/healthLanding" || $location.path() !="/lifeLanding"){
                    if (($rootScope.wordPressEnabled && $rootScope.resultCarrierId) || $scope.isFromLanding) {
                        $scope.redirectResultScreen();
                    } else {
                        $scope.redirectResultScreen();
                    }
                }
                });

                //} 
                // else {
                // 	messageIDVar = $scope.quoteUserInfo.messageId;
                // 	if ($rootScope.wordPressEnabled || $scope.isFromLanding) {
                // 		$scope.redirectResultScreen();
                // 	} else {
                // 		$scope.redirectResultScreen();
                // 	}
                // }
            };
            
            // $scope.getLandingQuotes = function(){
            //     console.log("inside $scope.getLandingQuotes function");
            //     $scope.isFromLanding = true;
            //     $scope.disabledRedirectToResult = true;
            //     if( $location.path() == "/healthLanding"){
            //         $scope.selectedBusinessLineId = 4;
            //         localStorageService.set("selectedBusinessLineId", 4);
            //     }
            //     if( $location.path() == "/lifeLanding"){
            //         $scope.selectedBusinessLineId = 1;
            //         localStorageService.set("selectedBusinessLineId", 1);
            //     }
            //     if ($scope.selectedBusinessLineId == 1) {
            //         $scope.$broadcast("callSingleClickLifeQuote", {});
            //     } else if ($scope.selectedBusinessLineId == 4) {
            //         console.log('broadcast singleClickHealthQuote ',$scope.selectedBusinessLineId);
            //         $scope.$broadcast("callSingleClickHealthQuote", {});
            //     }
            // //     var count = 0;
            // //    for(var i =0 ; i < 20; i++){
            // //         setTimeout(function()
            // //         {
            // //             console.log('the value of count in while loop : ',i);
            // //        if(count == 0){
            // //         if(localStorageService.get("HEALTH_UNIQUE_QUOTE_ID")){
            // //             count += 1;
            // //             console.log('inside setTimeout');
            // //          $scope.redirectToResult();
            // //         }
            // //       }
            // //         },3000)
            // //     }
            // }
                
            $scope.redirectToResult = function() {
                console.log('inside redirectToResult function');
                if ($scope.quoteUserInfo.emailId) {
                    if (validateEmail($scope.quoteUserInfo.emailId) && $scope.quoteUserInfo.firstName && $scope.quoteUserInfo.mobileNumber) {
                        $scope.quoteUserInfoForm.emailId.$setValidity('emailId', true);
                        $scope.quoteUserInfoForm.$invalid = false;
                    }
                } else if ($scope.quoteUserInfo.firstName && $scope.quoteUserInfo.mobileNumber) {
                    $scope.quoteUserInfoForm.$invalid = false;
                }
                if ($scope.quoteUserInfoForm.$invalid) {
                    console.log('inside redirectToResult function step 2');
                    angular.forEach($scope.quoteUserInfoForm.$invalid, function(field) {
                        field.$setTouched();
                    });
                } else {
                    console.log('inside redirectToResult function step 3');
                    
                    $scope.leadCreationUserInfo();
                }
                //$scope.leadCreationUserInfo();
            };

            $scope.landingRedirection = function(){
                setTimeout(function(){
                    $scope.isFromLanding = true;
                    $scope.disabledRedirectToResult = true;
                    sourceOrigin = "landing";
                    console.log("sourceOrigin in landingRedirection function ",sourceOrigin);
                    $scope.redirectToResult();
                },500)
                
            }

            $scope.redirectToIQResult = function() {
                $rootScope.title = $scope.globalLabel.policies365Title.personaDetails;
                var documentId;
                var selectedLineOfBusiness = localStorageService.get("selectedBusinessLineId");

                messageIDVar = $location.search().messageId;

                if (!$rootScope.viewOptionDisabled) {
                    if (selectedLineOfBusiness == 2) {
                        $scope.showRegAreaStatus = $rootScope.showBikeRegAreaStatus;
                    } else if (selectedLineOfBusiness == 3) {
                        $scope.showRegAreaStatus = $rootScope.showCarRegAreaStatus;

                    }
                    if (quoteUserInfoCookie != null && String(quoteUserInfoCookie) != "undefined") { //	-	modification-0004
                        if ($scope.showRegAreaStatus == false && (String($rootScope.vehicleDetails.registrationNumber) === "undefined" || String($rootScope.vehicleDetails.registrationNumber).length < 6)) {
                            $rootScope.regNumStatus = true;
                        } else {
                            $rootScope.regNumStatus = false;
                            $scope.quoteUserInfo = quoteUserInfoCookie;
                        }
                    } else {
                        if ($scope.showRegAreaStatus == false && (String($rootScope.vehicleDetails.registrationNumber) === "undefined" || String($rootScope.vehicleDetails.registrationNumber).length < 6)) {
                            $rootScope.regNumStatus = true;
                        } else {
                            $rootScope.regNumStatus = false;
                        }
                    }
                }
                $scope.getHospitalList();
                $scope.getGarageList();

                var selectedTab;
                for (var i = 0; i < $scope.tabs.length; i++) {
                    if ($scope.tabs[i].businessLineId == $scope.selectedBusinessLineId) {
                        selectedTab = $scope.tabs[i].name;
                        break;
                    }
                }
                $location.path("/" + selectedTab + 'Result');

            };
            $rootScope.navigateView = function() {
                $scope.createLeadScreen = !$scope.createLeadScreen;
                $rootScope.displayInstantScreen = !$rootScope.displayInstantScreen;
                if ($rootScope.displayInstantScreen) {
                    $scope.displayResult = false;
                } else {
                    $scope.displayResult = true;
                }
            }

            $scope.modalView = false;
            //	This function will navigate user from instant quote screen to respective result screen.
            $scope.toggleView = function() {

                //added for health product journey
                $rootScope.disableHealthNextScreen = false;
                $rootScope.title = $scope.globalLabel.policies365Title.personaDetails;
                var documentId;
                var selectedLineOfBusiness = localStorageService.get("selectedBusinessLineId");

                if (!$rootScope.viewOptionDisabled) {
                    if (selectedLineOfBusiness == 2) {
                        $scope.showRegAreaStatus = $rootScope.showBikeRegAreaStatus;
                    } else if (selectedLineOfBusiness == 3) {
                        $scope.showRegAreaStatus = $rootScope.showCarRegAreaStatus;

                    }
                }
                if (quoteUserInfoCookie != null && String(quoteUserInfoCookie) != "undefined") { //	-	modification-0004
                    if ($scope.showRegAreaStatus == false && (String($rootScope.vehicleDetails.registrationNumber) === "undefined" || String($rootScope.vehicleDetails.registrationNumber).length < 6)) {
                        $rootScope.regNumStatus = true;
                        $scope.quoteUserInfo = quoteUserInfoCookie;
                        if ($rootScope.wordPressEnabled) {
                            //added to display result screen and hide image and viceversa for wordPress
                            $rootScope.displayInstantScreen = !$rootScope.displayInstantScreen;
                            $scope.createLeadScreen = !$scope.createLeadScreen;
                            $scope.displayResult = true;
                            //displaying loader till first quote response comes.
                            $rootScope.enabledProgressLoader = true;
                            $rootScope.resultCarrierId = [];
                            if ($scope.selectedBusinessLineId == 3) {
                                $scope.$broadcast("callSingleClickCarQuote", {});
                            } else if ($scope.selectedBusinessLineId == 2) {
                                $scope.$broadcast("callSingleClickBikeQuote", {});
                            } else if ($scope.selectedBusinessLineId == 1) {
                                $scope.$broadcast("callSingleClickLifeQuote", {});
                            } else if ($scope.selectedBusinessLineId == 4) {
                                $scope.$broadcast("callSingleClickHealthQuote", {});
                            } else if ($scope.selectedBusinessLineId == 5) {
                                $scope.$broadcast("callSingleClickTravelQuote", {});
                            } else if ($scope.selectedBusinessLineId == 6) {
                                $scope.$broadcast("callSingleClickCriticalIllnessQuote", {});
                            } else if ($scope.selectedBusinessLineId == 8) {
                                $scope.$broadcast("callSingleClickPersonalAccidentQuote", {});
                            } else if ($scope.selectedBusinessLineId == 7) {
                                $scope.$broadcast("callSingleClickHomeQuote", {});
                            }
                        } else {
                            $scope.leadCreationUserInfo();
                        }
                    } else {
                        $rootScope.regNumStatus = false;
                        $scope.quoteUserInfo = quoteUserInfoCookie;
                        if ($rootScope.wordPressEnabled) {
                            //if($scope.quoteUserInfo != null && $scope.quoteUserInfo.messageId==''){			
                            //added to display result screen and hide image and vice-versa for wordPress
                            $rootScope.displayInstantScreen = !$rootScope.displayInstantScreen;
                            $scope.createLeadScreen = !$scope.createLeadScreen;
                            $scope.displayResult = true;
                            //displaying loader till first quote response comes.
                            $rootScope.enabledProgressLoader = true;
                            $rootScope.resultCarrierId = [];
                            if ($scope.selectedBusinessLineId == 3) {
                                $scope.$broadcast("callSingleClickCarQuote", {});
                            } else if ($scope.selectedBusinessLineId == 2) {
                                $scope.$broadcast("callSingleClickBikeQuote", {});
                            } else if ($scope.selectedBusinessLineId == 1) {
                                $scope.$broadcast("callSingleClickLifeQuote", {});
                            } else if ($scope.selectedBusinessLineId == 4) {
                                $scope.$broadcast("callSingleClickHealthQuote", {});
                            } else if ($scope.selectedBusinessLineId == 5) {
                                $scope.$broadcast("callSingleClickTravelQuote", {});
                            } else if ($scope.selectedBusinessLineId == 6) {
                                $scope.$broadcast("callSingleClickCriticalIllnessQuote", {});
                            } else if ($scope.selectedBusinessLineId == 8) {
                                $scope.$broadcast("callSingleClickPersonalAccidentQuote", {});
                            } else if ($scope.selectedBusinessLineId == 7) {
                                $scope.$broadcast("callSingleClickHomeQuote", {});
                            }

                        } else {
                            $scope.leadCreationUserInfo();
                        }
                    }
                } else {
                    if ($scope.showRegAreaStatus == false && (String($rootScope.vehicleDetails.registrationNumber) === "undefined" || String($rootScope.vehicleDetails.registrationNumber).length < 6)) {
                        $rootScope.regNumStatus = true;
                    } else {
                        $rootScope.regNumStatus = false;
                        if ($rootScope.wordPressEnabled) {
                            //if($scope.quoteUserInfo != null && $scope.quoteUserInfo.messageId==''){			
                            $scope.displayResult = true;
                            $rootScope.enabledProgressLoader = true;
                            $rootScope.resultCarrierId = [];
                            $rootScope.displayInstantScreen = false;
                            $scope.createLeadScreen = !$scope.createLeadScreen;
                            if ($scope.selectedBusinessLineId == 3) {
                                $scope.$broadcast("callSingleClickCarQuote", {});
                            } else if ($scope.selectedBusinessLineId == 2) {
                                $scope.$broadcast("callSingleClickBikeQuote", {});
                            } else if ($scope.selectedBusinessLineId == 1) {
                                $scope.$broadcast("callSingleClickLifeQuote", {});
                            } else if ($scope.selectedBusinessLineId == 4) {
                                $scope.$broadcast("callSingleClickHealthQuote", {});
                            } else if ($scope.selectedBusinessLineId == 5) {
                                $scope.$broadcast("callSingleClickTravelQuote", {});
                            } else if ($scope.selectedBusinessLineId == 6) {
                                $scope.$broadcast("callSingleClickCriticalIllnessQuote", {});
                            } else if ($scope.selectedBusinessLineId == 8) {
                                $scope.$broadcast("callSingleClickPersonalAccidentQuote", {});
                            } else if ($scope.selectedBusinessLineId == 7) {
                                $scope.$broadcast("callSingleClickHomeQuote", {});
                            }
                        } else {
                            $scope.modalView = !$scope.modalView;
                        }

                    }
                }

                $scope.hideModal = function() {
                    $scope.modalView = false;
                };
                $scope.getHospitalList();
                $scope.getGarageList();
            };

            $scope.toggleModal = function(insuranceType) {
                if (insuranceType.disabled == false) {
                    localStorageService.set("selectedBusinessLineId", insuranceType.businessLineId);
                    $location.path('/quote');
                } else {
                    $rootScope.P365Alert("Policies365", "Soon this facility will be available at your service.", "Ok");
                }
            };
            $scope.submitChildPlanConfirm = function() {
                $rootScope.modalChildPlanConfirm = false;
                //$location.path('/affilateLeadTrack');
                $location.path('/Quote');
            }

        };
        $scope.$broadcast("invokeGetQuoteTemplate", {});
        $scope.$broadcast("invokeCampaignTemplate", {});

        
        // Show the footer navigation links.
        $(".activateFooter").show();
        $(".activateHeader").show();

        /*$window.scroll(function(){
            
        	var wScroll = $(this).scrollTop();		
           // $scope.$apply();
        });*/

        angular.element(document.querySelector('.bodyWrapper')).bind('scroll', function() {
            var wScrollWeb = document.querySelector('.bodyWrapper').scrollTop;
            if (wScrollWeb > '50') {
                $('.landInsureHeader').css({
                    'background': 'rgba(182, 182, 182, 0.95)',
                    'z-index': '111'
                        //'transform' : 'translate(0px,'+ wScroll/12 +'px)'
                });
                $('.landingHeader a,.landingHeader span').css({
                    'color': '#424242',
                    'font-weight': 'bold'
                        //'transform' : 'translate(0px,'+ wScroll/12 +'px)'
                });
            } else {
                $('.landInsureHeader').css({
                    'background': 'transparent',
                    'z-index': '1'
                        //'transform' : 'translate(0px,'+ wScroll/12 +'px)'
                });
            }
        })


        setTimeout(function() {

            var maxHeight = -1;

            $('.setHeight').each(function() {
                maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
            });

            $('.setHeight').each(function() {
                $(this).height(maxHeight + 25);
            });

        }, 100);
        if ($(window).width() <= 320) {
            $scope.setPosition = "bottom";
        } else {
            $scope.setPosition = "left";
        }

        $scope.toggleBasicExpanded = function() {
            $scope.basicExpanded = !$scope.basicExpanded;
        };
        //function openWindow(){
        //window.open('http:\\google.com');

        //window.close();
        //}

        ////function to show popup of survey on clicking browser close[x]
        //window.onbeforeunload=function(){
        //openWindow();
        //// $rootScope.modalSurvey = true;
        //return "true";

        //}	

        //window.onunload=function(){
        //mywindow=window.open('','','width=500','height=700');
        //}

    }]);