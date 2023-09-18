//claims controller
'use strict';
angular.module('claimsMain', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages']) 
.controller('claimsMainController', ['$scope', '$window', '$rootScope', '$location','$http', 'RestAPI', 'localStorageService', function ($scope, $window, $rootScope, $location, $http, RestAPI, localStorageService){
	loadDatbase(function(){
		$http.get(wp_path+'ApplicationLabels.json').then(function (response) {
			localStorageService.set("applicationLabels", response.data);
			$scope.globalLabel = localStorageService.get("applicationLabels").globalLabels;
			$rootScope.wp_path = wp_path;
			$scope.tabs = [{title:"Register Claim",id:1, url: 'registerClaim.tpl.html',className:' registerTab tabs',bgcolor:'wp_pinkBg',icon:wp_path+"img/Register_claim.png" },
				              //{ title:"Claim Form",id:2, url: 'claimForm.tpl.html',className:' claimTab tabs' },
				               { title:"Track Claim",id:3, url: 'trackClaim.tpl.html',className:' trackTab tabs',bgcolor:'wp_greenBg',icon:wp_path+"img/Track_claim.png" },
				               { title:"Garage List",id:4, url: 'garageList.tpl.html',className:' garageTab tabs',bgcolor:'wp_lightblueBg',icon:wp_path+"img/Garage_list.png" },
				               { title:"Hospital List",id:5,url: 'hospitalList.tpl.html',className:' hospitalTab tabs',bgcolor:'wp_lightGreyBg',icon:wp_path+"img/Hospital_List.png" }];
		
			$scope.onClickMainTab =  function (tab, flag) {
				$rootScope.bgcolorFromClaimsSelection = tab.bgcolor;
				$rootScope.setTabVal = tab;
				$rootScope.setFlagVal = flag;
				$location.path("/claims");
				
			}
			if(localStorage.getItem("fromPillarPage")){
				
				$scope.onClickMainTab($scope.tabs[0],true);
				
			}
		});
		
	});
}]);