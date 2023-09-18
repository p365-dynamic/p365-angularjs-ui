// var organizationName;
// var messageIDVar;
// var campaignIDVar;
// var campaign_id;
// var requestSource;
// var campaignSource = {};
// var admitad_uid;
var scrollv;
'use strict'; console.log("outside dcp controller");
angular.module('dcpResult', ['CoreComponentApp', 'LocalStorageModule']).controller('dcpResultController', ['$scope', '$controller', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q', function($scope, $controller, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q) {
        var wp_path = '';
        console.log("inside dcp controller");
        setTimeout(function() {
            $scope.main = function() {
                if (agencyPortalEnabled) {
                	if ($location.search().lob && $location.search().lob != 0) {
                        var lob = $location.search().lob;
                        localStorage.setItem("lob_array", lob);
                        $scope.selectedBusinessLineId = parseInt(lob[0]);
                        localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                    }
                    if ($location.search().lob && $location.search().lob == 0) {
                        $rootScope.apAdmin = true;
                        $scope.selectedBusinessLineId = 3;
                        var lob = $location.search().lob;
                        localStorage.setItem("lob_array", lob);
                        localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                    }
                } else if ($location.search().lob) {
                    $scope.selectedBusinessLineId = parseInt($location.search().lob);
                    localStorageService.set("selectedBusinessLineId", $scope.selectedBusinessLineId);
                }
                $rootScope.parent_id = $location.search().recordId;
                $rootScope.parent_type = $location.search().moduleName;

                // this block is added for iQuote to add orgnization name in req eg.NIBPL.
                if ($location.search().orgName) {
                    organizationName = $location.search().orgName;
                }
                if ($rootScope.accessDenied == false) {
                    if (!(localStorageService.get("selectedBusinessLineId"))) {
                        localStorage.setItem('selectedBusinessLineId', 3);
                        localStorageService.set("selectedBusinessLineId", 3);
                        $scope.$broadcast("onClickTabID", 3);
                    } else {
                        $scope.selectedBusinessLineId = localStorageService.get("selectedBusinessLineId");
                        $scope.$broadcast("onClickTabID", $scope.selectedBusinessLineId);
                    }
                }
            }
            $scope.$broadcast("invokeGetQuoteTemplate", {});
            $scope.main();
			$controller('headerNavigationController', { $scope: $scope });
        }, 500);
    }]);