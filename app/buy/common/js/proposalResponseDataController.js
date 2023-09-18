var organizationName;
angular.module('proposalresdata', ['CoreComponentApp'])
.controller('proposalResponseDataController', ['RestAPI', '$scope','$rootScope', '$location',  '$window', function(RestAPI, $scope,$rootScope, $location, $window){
	var wp_path;
	if(wordPressEnabled) {
		wp_path = localized;
		$rootScope.wordPressEnabled = wordPressEnabled;
		$rootScope.wp_path = wp_path;
	} else {
		$rootScope.wp_path = '';
		wp_path = '';
	}
	if(!wordPressEnabled && pospEnabled){
		wp_path = localized;
		$rootScope.pospEnabled = pospEnabled;
		$rootScope.wordPressEnabled = wordPressEnabled;
		$rootScope.wp_path = wp_path;
	}

	if(baseEnvEnabled){
		$rootScope.baseEnvEnabled = baseEnvEnabled;
	}

	if(agencyPortalEnabled){
		$rootScope.agencyPortalEnabled = agencyPortalEnabled;
	}
	var businessLineId = "";
	var urlPattern = $location.path();
	var redirectURL = $location.$$absUrl;
	var proposalId = $location.search().proposalId;
	
	// this block is added for iQuote to add orgnization name in req eg.NIBPL.
	if($location.search().orgName){
		organizationName = $location.search().orgName;
	}
	
	redirectURL = redirectURL.split("\?")[0];
	
	getDocUsingIdTransDB(RestAPI, proposalId, function(proposalDataResponse){
		if(proposalDataResponse != null){
			businessLineId = proposalDataResponse.businessLineId;
			if(businessLineId == 1)
			{
				redirectURL  = redirectURL.replace(urlPattern,'/proposalresdatalife'); 
			}
			if(businessLineId == 2)
			{
				redirectURL  = redirectURL.replace(urlPattern,'/proposalresdatabike'); 
			}
			else if(businessLineId == 3)
			{
				redirectURL  = redirectURL.replace(urlPattern,'/proposalresdatacar');
			}
			else if(businessLineId == 4)
			{
				redirectURL  = redirectURL.replace(urlPattern,'/proposalresdatahealth');
			}else if(businessLineId == 5){
				redirectURL  = redirectURL.replace(urlPattern,'/proposalresdatatravel');
			}
			$window.location = redirectURL + "?proposalId=" + proposalId + "&lob=" + businessLineId;
		}
	});
}]);