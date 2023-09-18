angular.module('ipos', ['LocalStorageModule'])
.controller('iposController', ['$scope', '$location', '$window', 'localStorageService', function($scope, $location, $window, localStorageService){

	loadDatbase(function(){
	//$rootScope.loading=true;
	var request = {};
	request.businessLineId = $location.search().lob;
	var urlPattern = $location.path();
	var redirectURL = $location.$$absUrl;
	
	if(request.businessLineId == 2)
	{
		redirectURL  = redirectURL.replace(urlPattern,'/buyTwoWheeler'); 
	}
	else if(request.businessLineId == 3)
	{
		redirectURL  = redirectURL.replace(urlPattern,'/buyFourWheeler'); 
	}
	else if(request.businessLineId == 4)
	{
		redirectURL  = redirectURL.replace(urlPattern,'/buyHealth');
	}else if(request.businessLineId == 5)
	{
		console.log("localStorageService quoteUserInfo ipos:",localStorageService.get("quoteUserInfo"));
		redirectURL  = redirectURL.replace(urlPattern,'/buyTravel');
	}
	$window.location=redirectURL;
	});
}]);