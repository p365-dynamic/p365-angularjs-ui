/*
 * Description	: This file contains frames that will track affilate lead .
 * Author		: Sandip Palodkar
 * Date			: 13 May 2016

 * */

'use strict';
angular.module('affilateLeadTracker', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
.controller('leadTrackController', ['RestAPI', '$scope', '$rootScope', '$location','$http', 'localStorageService', '$timeout','$sce', function(RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout,$sce){
	/*
		$scope.loading=true;
		if($rootScope.isCarLanding){
			$scope.carAffilatedLeadId  = $sce.trustAsResourceUrl("https://tunicalabs.trackneo.com/track/lead?m=ifr&c=81&leadid="+messageIDVar);
			$scope.carAffilatedLeadTrackingURL=$sce.trustAsResourceUrl("https://www.s2d6.com/x/?x=sp&h=71175&o="+messageIDVar+"&g=car&s=0.00&q=1");
			$scope.carAffoyLeadTrackUrl=$sce.trustAsResourceUrl("https://af0y.com/p.ashx?o=178&e=154&t="+messageIDVar);
			$scope.carMobiyoLeadTrackUrl=$sce.trustAsResourceUrl("https://track.vnative.com/pixel?adid=5b151fceb6920d2ebe613d95&sub1="+campaignSource.utm_source+"&sub2="+messageIDVar+"&sub3=&sub4=");
			console.log('lead tracked in car..');
			$location.path($rootScope.redirectPath);
		}else if($rootScope.isBikeLanding){
			$scope.bikeAffilatedLeadId  = $sce.trustAsResourceUrl("https://tunicalabs.trackneo.com/track/lead?m=ifr&c=82&leadid="+messageIDVar);
			$scope.bikeAffilatedLeadTrackingURL=$sce.trustAsResourceUrl("https://www.s2d6.com/x/?x=sp&h=71175&o="+messageIDVar+"&g=bike&s=0.00&q=1");
			$scope.bikeAffoyLeadTrackUrl=$sce.trustAsResourceUrl("https://af0y.com/p.ashx?o=179&e=154&t="+messageIDVar);
			$scope.bikeMobiyoLeadTrackUrl=$sce.trustAsResourceUrl("https://track.vnative.com/pixel?adid=5b152011b6920d2e565760d4&sub1="+campaignSource.utm_source+"&sub2="+messageIDVar+"&sub3=&sub4=");
			$scope.bikeWhiteDwarfLeadTrackUrl=$sce.trustAsResourceUrl("https://mms.o18.click/p?t=i&oid=236255");
			$scope.bikeNetCoreLeadTrackUrl=$sce.trustAsResourceUrl("http://tracking.affiliatehub.co.in/SL2Ab?adv_sub="+messageIDVar);
			console.log('lead tracked in bike..');
			$location.path($rootScope.redirectPath);
		}else if($rootScope.isHealthLanding){
			$scope.healthAffilatedLeadId = $sce.trustAsResourceUrl("https://tunicalabs.trackneo.com/track/lead?m=ifr&c=80&leadid="+messageIDVar);
			$scope.healthAffilatedLeadTrackingURL=$sce.trustAsResourceUrl("https://www.s2d6.com/x/?x=sp&h=71175&o="+messageIDVar+"&g=health&s=0.00&q=1");
			$scope.healthAffoyLeadTrackUrl=$sce.trustAsResourceUrl("https://af0y.com/p.ashx?o=177&e=154&t="+messageIDVar);	
			$scope.healthMobiyoLeadTrackUrl=$sce.trustAsResourceUrl("https://track.vnative.com/pixel?adid=5b151f80b6920d2cab37b0e7&sub1="+campaignSource.utm_source+"&sub2="+messageIDVar+"&sub3=&sub4=");
			console.log('lead tracked in health..');
			$location.path($rootScope.redirectPath);
		}else if($rootScope.isLifeLanding){
			$scope.lifeAffilatedLeadId = $sce.trustAsResourceUrl("https://tunicalabs.trackneo.com/track/lead?m=ifr&c=77&leadid="+messageIDVar);
			$scope.lifeAffilatedLeadTrackingURL=$sce.trustAsResourceUrl("https://www.s2d6.com/x/?x=sp&h=71175&o="+messageIDVar+"&g=life&s=0.00&q=1");
			$scope.lifeWhiteDwarfLeadTrackUrl=$sce.trustAsResourceUrl("https://admlnk.com/p.ashx?o=8227&e=709&f=img&t="+messageIDVar);
			$scope.lifeNetCoreLeadTrackUrl=$sce.trustAsResourceUrl("http://tracking.affiliatehub.co.in/SL2Af?adv_sub="+messageIDVar);
			console.log('lead tracked in life..');
			$location.path($rootScope.redirectPath);
		}	
*/}]);