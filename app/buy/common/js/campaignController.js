'use strict';
angular.module('campaign',['LocalStorageModule'])
.controller('campaignController', function($rootScope, $scope, $http, localStorageService,$location, RestAPI) {
	$rootScope.campaignId = $location.search().campaignId;
	$rootScope.source = $location.search().source;
});