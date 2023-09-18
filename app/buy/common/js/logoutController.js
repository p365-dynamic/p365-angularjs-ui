'use strict';
angular.module('logout', ['LocalStorageModule']) 
.controller('logoutController', ['$scope', '$rootScope', '$location', 'localStorageService', function ($scope, $rootScope, $location, localStorageService){
	//loadDatbase(function(){
		console.log('logout');
		// $rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled");
		// if(wordPressEnabled){
			$scope.userLoginInfo = {};
			localStorageService.set("userLoginInfo",$scope.userLoginInfo);
			$('.signin_link a').text('My Account');
			$('.logout_link').closest('li').attr('style','display:none !important');
			localStorage.setItem("loggedIn", "false");
		// }
		setTimeout(function(){
			$('.logout_link').closest('li').attr('style','display:none !important');
		},100);
	//})
}]);