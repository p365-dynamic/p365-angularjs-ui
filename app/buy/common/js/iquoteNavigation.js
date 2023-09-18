var sourceOrigin;
var deviceIdOrigin;
var scrollv; // register two global vars for two scrollable instances
'use strict';
angular.module('iquoteNavigation', ['LocalStorageModule'])
    .controller('iquoteNavigationController', ['$scope', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q',
        function ($scope, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q) {
            $scope.isIquoteEnabled = false;
            $scope.isIPOSEnabled = false;
            $rootScope.loading = true;
            var rampRedirectURL = false;
            var last_visited_proposal_id = '';
            var last_visited_quote_id = '';
            var defaultLOB = 3;
				
			if($location.search().source){
                    sourceOrigin = $location.search().source ; 
                    deviceIdOrigin = $location.search().source ; 
            }
            console.log('sourceOrigin from iquote navigation is: ',$location.search().source);
            
            if ($location.search().lob && !(sourceOrigin == "agency")) {
                defaultLOB = $location.search().lob;
            }

            if ($location.search().rampUniqueId && $location.search().url) {
                rampRedirectURL = true;
                localStorage.setItem("rampUniqueId", $location.search().rampUniqueId);
                localStorage.setItem("rampRedirectURL", $location.search().url);
            }
            
            // setting the quote user info
            if ($location.search().userId) {
                $scope.quoteUserInfo = {};
                $scope.quoteUserInfo.firstName = "";
                $scope.quoteUserInfo.emailId = $location.search().userId
                $scope.quoteUserInfo.mobileNumber = "";
                localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);
            }

            $rootScope.iposRedirectionURL = '';
            $rootScope.iquoteRedirectionURL = '';
            $rootScope.iquoteRequestParam = '';
            $rootScope.iposRequestParam = '';

                $rootScope.agencyPortalEnabled = agencyPortalEnabled;
                console.log('$rootScope.agencyPortalEnabled flag is: ',$rootScope.agencyPortalEnabled);
                if ($rootScope.agencyPortalEnabled) {
                    if ($location.search().lob) {
                        $rootScope.apAdmin = true;
                        localStorage.setItem("lob_array", $location.search().lob);
                    }
                    
                    console.log('$location.search().source in step 1 is : ',$location.search().source);
                    if ($location.search().source){
                        if(($location.search().source == 'CarEager')){
                        localStorage.setItem("carEagerUniqueId",$location.search().UniqueId); 
                        } 
                    }
                }
                if ($location.search().source) {
                    if ($location.search().source =="desi_skill") {
                    localStorage.setItem("desiSkillUniqueId", $location.search().desiSkillUniqueId);
                    localStorage.setItem("desiSkillAgentId", $location.search().agentId);
                    localStorage.setItem("desiSkillUserId", $location.search().userId);
                    
                    var agencyIdVar = "";
                    if($location.search().agencyId){
                      agencyIdVar = $location.search().agencyId ;
                    } else{
                       agencyIdVar = "AGENCY133-BRANCH101";
                    }
                    localStorage.setItem("desiSkillAgencyId", agencyIdVar);

                    if($location.search().lob == 2 || $location.search().lob == "2"){
                        last_visited_quote_id = "DefaultBikeQuote";
                        last_visited_lob_id = "2";
                    }else if($location.search().lob == 3 || $location.search().lob == "3"){
                        last_visited_quote_id = "DefaultCarQuote";
                        last_visited_lob_id = "3";
                    }
                    
                    $scope.isIquoteEnabled = true;
                    var agencyIdVar = "";
                    if($location.search().agencyId){
                      agencyIdVar = $location.search().agencyId ;
                    } else{
                       agencyIdVar = "AGENCY133-BRANCH101";
                    }
                    
                    $rootScope.iquoteRequestParam = { docId: last_visited_quote_id, lob: last_visited_lob_id, agencyId :agencyIdVar ,  userId : $location.search().userId ,createLeadFlag: $location.search().createLeadFlag, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName, userId: $location.search().userId };
                    $rootScope.iquoteRedirectionURL = '/sharefromAPI';
                    $location.path('/sharefromAPI').search($rootScope.iquoteRequestParam);
                    }
                }

               // if(!rampRedirectURL){
                var leadMessageId = $location.search().messageId;
                if (leadMessageId) {
                    getListFromDB(RestAPI, leadMessageId, "leadProfileRequest", "findAppConfig", function (leadProfileRes) {
                        if (leadProfileRes.responseCode == 1000) {
                            if (leadProfileRes.data.length > 0) {
                                if (leadProfileRes.data[0].latestProposalId) {
                                    last_visited_proposal_id = leadProfileRes.data[0].latestProposalId;
                                    last_visited_lob_id = String(leadProfileRes.data[0].latestProposalBusinessLineId);
                                    if (leadProfileRes.data[0].latestQUOTE_ID) {
                                        last_visited_quote_id = leadProfileRes.data[0].latestQUOTE_ID;
                                    } else {
                                        if (last_visited_lob_id) {
                                            for (var i = 0; i < defaultQuoteIds.length; i++) {
                                                if (last_visited_lob_id == String(defaultQuoteIds[i].lob)) {
                                                    last_visited_quote_id = defaultQuoteIds[i].quoteId;
                                                    break;
                                                }
                                            }
                                        } else {
                                            for (var i = 0; i < defaultQuoteIds.length; i++) {
                                                if (defaultLOB == String(defaultQuoteIds[i].lob)) {
                                                    last_visited_quote_id = defaultQuoteIds[i].quoteId;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    last_visited_lob_id = String(leadProfileRes.data[0].latestQuoteBusinessLineId);
                                    if (leadProfileRes.data[0].latestQUOTE_ID) {
                                        last_visited_quote_id = leadProfileRes.data[0].latestQUOTE_ID;
                                    } else {
                                        if (last_visited_lob_id) {
                                            for (var i = 0; i < defaultQuoteIds.length; i++) {
                                                if (last_visited_lob_id == defaultQuoteIds[i].lob) {
                                                    last_visited_quote_id = defaultQuoteIds[i].quoteId;
                                                    break;
                                                }
                                            }
                                        } else {
                                            for (var i = 0; i < defaultQuoteIds.length; i++) {
                                                if (defaultLOB == String(defaultQuoteIds[i].lob)) {
                                                    last_visited_quote_id = defaultQuoteIds[i].quoteId;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0; i < defaultQuoteIds.length; i++) {
                                    if (defaultLOB == String(defaultQuoteIds[i].lob)) {
                                        last_visited_quote_id = defaultQuoteIds[i].quoteId;
                                        last_visited_lob_id = String(defaultQuoteIds[i].lob);
                                        break;
                                    }
                                }
                            }
                        
                            if ($location.search().rampUniqueId && $location.search().url) {
                                rampRedirectURL = true;
                                localStorage.setItem("rampUniqueId", $location.search().rampUniqueId);
                                localStorage.setItem("rampRedirectURL", $location.search().url);
                                if($location.search().quote_id){
                                    last_visited_quote_id =  $location.search().quote_id;
                                    var lob = last_visited_quote_id.substr(0,3);
                                       if(lob == 'CAR'){
                                        last_visited_lob_id= "3";
                                       }else if(lob == 'BIKE'){
                                        last_visited_lob_id = "2";
                                       }
                                }
                                $scope.isIquoteEnabled = true;
                                $rootScope.iquoteRequestParam = { docId: last_visited_quote_id, lob: last_visited_lob_id, createLeadFlag: $location.search().createLeadFlag, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName, userId: $location.search().userId };
                                $rootScope.iquoteRedirectionURL = '/sharefromAPI';
                            }
                        } else {
                            //no response from lead document
                            for (var i = 0; i < defaultQuoteIds.length; i++) {
                                if (defaultLOB == String(defaultQuoteIds[i].lob)) {
                                    last_visited_quote_id = defaultQuoteIds[i].quoteId;
                                    last_visited_lob_id = String(defaultQuoteIds[i].lob);
                                    break;
                                }
                            }
                            if($location.search().quote_id){
                                last_visited_quote_id = $location.search().quote_id;
                            }
                        }
                        console.log('last_visited_quote_id.length is: ',last_visited_quote_id.length);
                        if (last_visited_proposal_id && !rampRedirectURL) {
                            $scope.isIPOSEnabled = true;
                            $rootScope.iposRedirectionURL = '/proposalresdata';
                            $rootScope.iposRequestParam = { proposalId: last_visited_proposal_id, messageId: $location.search().messageId, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName };
                        } else {
                            $scope.isIquoteEnabled = true;
                            console.log('$location.search().source is ::',$location.search().source);
                        
                            //for ramp
                            if ($location.search().rampUniqueId && $location.search().url) {
                                rampRedirectURL = true;
                                localStorage.setItem("rampUniqueId", $location.search().rampUniqueId);
                                localStorage.setItem("rampRedirectURL", $location.search().url);
                                if($location.search().quote_id){
                                    last_visited_quote_id =  $location.search().quote_id;
                                    var lob = last_visited_quote_id.substr(0,3);
                                       if(lob == 'CAR'){
                                        last_visited_lob_id= "3";
                                       }else if(lob == 'BIKE'){
                                        last_visited_lob_id = "2";
                                       }
                                }
                            }
                        
                        }
                        if (last_visited_lob_id == 0 || last_visited_lob_id == "0") {
                            $rootScope.iquoteRequestParam = { docId: last_visited_quote_id, lob: last_visited_lob_id, messageId: $location.search().messageId, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName, userId: $location.search().userId };
                            $rootScope.iquoteRedirectionURL = '/professionalShareAPI';
                        } else {
                            $rootScope.iquoteRequestParam = { docId: last_visited_quote_id, LOB: last_visited_lob_id, messageId: $location.search().messageId, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName, userId: $location.search().userId };
                            $rootScope.iquoteRedirectionURL = '/sharefromAPI';
                        }
                        $rootScope.mainTabsMenu = [{ url: $rootScope.iquoteRedirectionURL, requestParam: $rootScope.iquoteRequestParam, className: 'iQuoteTab tabs wp_border32', name: 'iquote', title: "iQuote", active: !$scope.isIPOSEnabled },
                        { url: $rootScope.iposRedirectionURL, requestParam: $rootScope.iposRequestParam, className: 'iPosTab tabs wp_border32', name: 'ipos', title: "iPos", active: $scope.isIPOSEnabled }];
                        console.log('tab menus in step 1 is:', $rootScope.mainTabsMenu);

                        if ($scope.isIPOSEnabled) {
                            $rootScope.isActiveTab = 'ipos';
                            $location.path("/proposalresdata").search($rootScope.iposRequestParam);
                        } else if (!$scope.isIPOSEnabled) {
                            $rootScope.isActiveTab = 'iquote';
                            if ($rootScope.iquoteRedirectionURL =='/sharefromAPI') {
                                $location.path('/sharefromAPI').search($rootScope.iquoteRequestParam);
                            } else if ($rootScope.iquoteRedirectionURL == '/professionalShareAPI') {
                                $location.path('/professionalShareAPI').search($rootScope.iquoteRequestParam);
                            }
                        }
                    });
                } else {
                    $scope.isIquoteEnabled = true;
                    $rootScope.iquoteRedirectionURL = '/sharefromAPI';

                    //if lead message id is not request
                    
                    for (var i = 0; i < defaultQuoteIds.length; i++) {
                        if (defaultLOB == String(defaultQuoteIds[i].lob)) {
                            last_visited_quote_id = defaultQuoteIds[i].quoteId;
                            last_visited_lob_id = String(defaultQuoteIds[i].lob);
                        }
                    }

                    if ($location.search().rampUniqueId && $location.search().url) {
                        rampRedirectURL = true;
                        localStorage.setItem("rampUniqueId", $location.search().rampUniqueId);
                        localStorage.setItem("rampRedirectURL", $location.search().url);
                        if($location.search().quote_id){
                            last_visited_quote_id =  $location.search().quote_id;
                            var lob = last_visited_quote_id.substr(0,3);
                               if(lob == 'CAR'){
                                last_visited_lob_id= "3";
                               }else if(lob == 'BIKE'){
                                last_visited_lob_id = "2";
                               }
                        }
                        $scope.isIquoteEnabled = true;
                    }
                    $rootScope.iquoteRequestParam = { docId: last_visited_quote_id, lob: last_visited_lob_id, createLeadFlag: $location.search().createLeadFlag, leaddetails: $location.search().leaddetails, orgName: $location.search().orgName, userId: $location.search().userId };

                    $rootScope.mainTabsMenu = [{ url: $rootScope.iquoteRedirectionURL, requestParam: $rootScope.iquoteRequestParam, className: 'iQuoteTab tabs wp_border32', name: 'iquote', title: "iQuote", active: $scope.isIquoteEnabled },
                    { url: $rootScope.iposRedirectionURL, requestParam: $rootScope.iposRequestParam, className: 'iPosTab tabs wp_border32', name: 'ipos', title: "iPos", active: !$scope.isIquoteEnabled }];
                    console.log('tab menus in step 2 is:', $rootScope.mainTabsMenu);
                    $location.path('/sharefromAPI').search($rootScope.iquoteRequestParam);
                }
            //}
        }]);