
var scrollv; // register two global vars for two scrollable instances
'use strict';
angular.module('iquoteTabNavigation', ['LocalStorageModule'])
    .controller('iquoteTabNavigationController', ['$scope', '$rootScope', '$window', '$filter', 'RestAPI', 'localStorageService', '$timeout', '$location', '$interval', '$http', '$sce', '$q',
        function ($scope, $rootScope, $window, $filter, RestAPI, localStorageService, $timeout, $location, $interval, $http, $sce, $q) {

            $rootScope.iquoteTabNavigationHTML = wp_path + 'buy/common/html/iquoteTabNavigation.html';

            $rootScope.onClickIquoteTab = function (tab) {

                if ($rootScope.isActiveTab == tab.name) {
                    console.log('current tab is clicked');
                    return;
                }
                if (tab.name == 'ipos') {
                    for (var i = 0; i < $rootScope.mainTabsMenu.length; i++) {
                        if ($rootScope.mainTabsMenu[i].name == 'ipos') {
                            $rootScope.mainTabsMenu[i].active = true;
                            $rootScope.isActiveTab = tab.name;
                        } else {
                            $rootScope.mainTabsMenu[i].active = false;
                        }
                    }

                    if (tab.url) {
                        $location.path(tab.url).search(tab.requestParam);
                    } else {
                        $location.path('/proposalNotAvailable');
                    }
                } else if (tab.name == 'iquote') {
                    for (var i = 0; i < $rootScope.mainTabsMenu.length; i++) {
                        if ($rootScope.mainTabsMenu[i].name == 'iquote') {
                            $rootScope.isActiveTab = tab.name;
                            $rootScope.mainTabsMenu[i].active = true;
                        } else {
                            $rootScope.mainTabsMenu[i].active = false;
                        }
                    }
                    $location.path(tab.url).search(tab.requestParam);
                }
            }
        }]);