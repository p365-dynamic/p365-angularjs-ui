//claims controller
'use strict';
angular.module('claims', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages']) 
.controller('claimsController', ['$scope', '$window', '$rootScope', '$location','$http', 'RestAPI', 'localStorageService','$anchorScroll', function ($scope, $window, $rootScope, $location, $http, RestAPI, localStorageService, $anchorScroll){
	
	//$rootScope.wordPressEnabled = localStorageService.get("wordPressEnabled")
	if(wordPressEnabled){
		$rootScope.wordPressEnabled = wordPressEnabled ;
	}
	$rootScope.wp_path = wp_path;
	$scope.tabs = [{title:"Register Claim",id:1, url: 'registerClaim.tpl.html',className:' registerTab tabs',bgcolor:'wp_pinkBg',icon:wp_path+"img/Register_claim.png", wp_tabtoshow:true},
	              //{ title:"Claim Form",id:2, url: 'claimForm.tpl.html',className:' claimTab tabs' },
	               { title:"Track Claim",id:3, url: 'trackClaim.tpl.html',className:' trackTab tabs',bgcolor:'wp_greenBg',icon:wp_path+"img/Track_claim.png",wp_tabtoshow:true },
	               { title:"Garage List",id:4, url: 'garageList.tpl.html',className:' garageTab tabs',bgcolor:'wp_lightblueBg',icon:wp_path+"img/Garage_list.png",wp_tabtoshow:true },
	               { title:"Hospital List",id:5, url: 'hospitalList.tpl.html',className:' hospitalTab tabs',bgcolor:'wp_lightGreyBg',icon:wp_path+"img/Hospital_List.png",wp_tabtoshow:true }];
	
	$scope.tabHorizontal= [{title:'Online Claim Registration',id:1,url:'onlineClaimForm.tpl.html'},
	                       {title:'Download Claim Form',id:2,url: 'claimForm.tpl.html'},
	                       {title: 'Intimate Policies365',id:3,url: 'registerClaimForm.tpl.html'}];

	$scope.insuranceType = [
	            			{ id:1,name:'Car Insurance',value:'car',label:'Motor'},
	            			{ id:2,name:'Bike Insurance',value:'bike',label:'Bike'},
	            		    { id:3,name:'Life Insurance',value:'life',label:'Life'},
	            		    { id:4,name:'Health Insurance',value:'health',label:'Health'}
	            		   ];
	
	
	
	var applicationLabels  = localStorageService.get("applicationLabels");
	$scope.globalLabel = applicationLabels.globalLabels;
	$rootScope.title = $scope.globalLabel.policies365Title.claims;
	
	$scope.disableSubmit=false;
	//to display car as insurance type by default
	$scope.getInsuranceType = function(){
		for(var i=0;i<$scope.insuranceType.length;i++){
			if($scope.insuranceType[i].value == localStorage.getItem("insurType")){
				$scope.selectedInsuranceType = $scope.insuranceType[i];
				//console.log('$scope.selectedInsuranceType',$scope.selectedInsuranceType);
			}
		}
	}
	
	
	$scope.selectedInsuranceType = $scope.insuranceType[0];
	
	 $scope.setDefault = function(){
		
		if(!localStorage.getItem("fromPillarPage")){
			$scope.selectedInsuranceType = $scope.insuranceType[0];
		}else{
			$scope.getInsuranceType();
			
			$scope.showRegistrationNo($scope.selectedInsuranceType);
			
		}
	}

	$scope.currentTab = 'onlineClaimForm.tpl.html';
			
	$scope.onClickHorizontalTab = function (tab) {
		$scope.claimDetailsUserInfo = {};
			$scope.currentTab = tab.url;
			if(tab.id == 1 || tab.id  == 2 || tab.id == 3){
				$scope.selectedInsuranceType = $scope.insuranceType[0];
				$scope.showRegistrationNo($scope.selectedInsuranceType);
			}
			
	}
	
	$scope.isActiveHorizontalTab = function(tabUrl) {
    return tabUrl == $scope.currentTab;
	}
	if($rootScope.setFlagVal){
		$anchorScroll('home');
		for (var i=0;i<$scope.tabs.length;i++){
			if($rootScope.setTabVal.id == $scope.tabs[i].id){
				$scope.tabs[i].wp_tabtoshow=false;
			}
		}
		
		if( $rootScope.setTabVal.id == 1 || $rootScope.setTabVal.id == 3 ||  $rootScope.setTabVal.id== 4){
			$scope.selectedInsuranceType = $scope.insuranceType[0];
		}else{
			$scope.selectedInsuranceType = $scope.insuranceType[3];
		}
		$scope.currentTabClaims = $rootScope.setTabVal.url;
	}else{
		$scope.currentTabClaims = 'registerClaim.tpl.html';
	}
	
	$scope.currentHeading = 'Register Claim';
	
	$scope.onClickTab = function (tab) {
		$anchorScroll('home');
		for (var i=0;i<$scope.tabs.length;i++){
			$scope.tabs[i].wp_tabtoshow=true;
		}
		tab.wp_tabtoshow=false;
		
		$scope.claimDetailsUserInfo = {};
		$scope.currentTabClaims = tab.url;	
		$scope.currentHeading = tab.title;
		if($rootScope.wordPressEnabled){
			$rootScope.bgcolorFromClaimsSelection = tab.bgcolor;
		}
		if(tab.id == 1){
			$scope.selectedInsuranceType = $scope.insuranceType[0];
			$scope.showRegistrationNo($scope.selectedInsuranceType);
		}
		if(tab.id == 4){
			$scope.selectedInsuranceType = $scope.insuranceType[0];
			$scope.showRegistrationNo($scope.selectedInsuranceType);
		}
		if(tab.id == 5){
			$scope.selectedInsuranceType = $scope.insuranceType[3];
			$scope.showRegistrationNo($scope.selectedInsuranceType);
		}
	}
	
	$scope.isActiveTab = function(tabUrl) {
			return tabUrl == $scope.currentTabClaims;
			
	};
	$scope.filterOnlineClaimData=function(res){
		$scope.onlineClaimLinkFlag = true;
		if(res.displayLabel === 'Register your claim'){
			$scope.onlineClaimLinkFlag = false;
			return true;
		}
		
		
	};
	$scope.filterClaimData=function(res){
		return(res.displayLabel === 'Claim form' || res.displayLabel === 'Reimbursement form')
	};
	
	$scope.filterTrackData=function(res){ 
		if(res.displayLabel == 'Track your claim'){
			$scope.trackDataLink.push(res.displayLabel);
			
		}
		if($scope.trackDataLink.length > 0){
			$scope.trackDataLinkFlag = false;
		}
		else {
			$scope.trackDataLinkFlag = true;
		}
		if(res.displayLabel == 'Track your claim'){
			return true;
		}
	};
	
	$scope.filterGarageListData=function(res){
		if(res.displayLabel === 'Get garage list'){
			$scope.garageDataLink.push(res.displayLabel);
		}
		if($scope.garageDataLink.length > 0){
			$scope.garageListFlag = false;
			
		}
		else
		{
			$scope.garageListFlag = true;
		}
		if(res.displayLabel === 'Get garage list'){
			return true;
		}
	}
	
	$scope.filterHospitalListData=function(res){
		if(res.displayLabel === 'Get hospital list'){
			$scope.hospitalDataLink.push(res.displayLabel);
			
		}
		if($scope.hospitalDataLink.length > 0){
			$scope.hospitalListFlag = false;
		}
		else
		{
			$scope.hospitalListFlag = true;
		}
		if(res.displayLabel === 'Get hospital list'){
			return true;
		}
	}
	
	$scope.validateRegistrationNumber=function(registrationNumber)
	{
		if(String(registrationNumber) != "undefined"){
			registrationNumber = registrationNumber.replace(/[^a-zA-Z0-9]/gi, '');	
			if((registrationNumber.trim()).match(/([a-zA-Z]{2}[0-9]{2}[a-zA-Z]{1,3}[0-9]{1,4})/g) && (registrationNumber.trim()).length <=11 && (registrationNumber.trim()).length > 4)
			{
				$scope.regNumStatus = false;
				
			}else
			{
				$scope.regNumStatus = true;
				
			}
			
		}
	}
	
	//added to get the emailid and mobile number auto populated values in  controller
	$scope.claimDetailsUserInfo = localStorageService.get("quoteUserInfo");
	
		$scope.showRegistrationNo = function(selectedInsuranceType){	
			$scope.selectedInsuranceType = selectedInsuranceType;
			if(selectedInsuranceType.id == 1 || selectedInsuranceType.id == 2){
				
				$scope.regNo = true;
			}
			else{
				
				$scope.regNo = false;
			}
				 if(selectedInsuranceType.id == 1 ){
					 var documentType="CarCarrier"; 
				 }else if(selectedInsuranceType.id == 2){
					 var documentType="BikeCarrier";
				 }else if(selectedInsuranceType.id == 3 ){
					 var documentType="LifeCarrier";
				 }else if(selectedInsuranceType.id == 4 ){
					 
					 var documentType="HealthCarrier";
				 }
				
				 $scope.InsType=selectedInsuranceType;
				
				
				//RestAPI call to get insurance company name depending on insurance type in claim form
				 getListFromDB(RestAPI, "", documentType, findAppConfig, function(CarrierList){
					 if(CarrierList.responseCode == 1000){
						$scope.carrierList=CarrierList.data;
						 //to show default carrier name
						 if(localStorage.getItem("fromPillarPage")){	
								for(var i=0;i<$scope.carrierList.length;i++){
									if($scope.carrierList[i].carrierId == localStorage.getItem("carrierId")){
										$scope.selectedCarrierName=$scope.carrierList[i];
										
									}
							
								
							}
							$scope.showDisplayLabel($scope.selectedCarrierName);
						 }else{
							$scope.selectedCarrierName=$scope.carrierList[0];
							$scope.showDisplayLabel($scope.selectedCarrierName);
						 }
							 

						 
			
				}
				})
				
		}
		
		$scope.showRegistrationNo($scope.selectedInsuranceType);
		
		$scope.showDisplayLabel=function(selectedCarrierName){
			
			var request={};
			$scope.selectedCarrierName = selectedCarrierName;
			var carrierName = $scope.selectedCarrierName.carrierName;
     		request.carrierName = carrierName.trim();
     		request.carrierId  =$scope.selectedCarrierName.carrierId;
  			request.insuranceType =$scope.selectedInsuranceType.value;
		
			//RestAPI call to get display labels and url depending on insurance company name in claim form 
			RestAPI.invoke($scope.globalLabel.transactionName.ClaimDetails,request).then(function(callback){
				$rootScope.loading = false;
				$scope.displayURL=callback;	
				localStorage.removeItem("fromPillarPage");
				localStorage.removeItem("insurType");
				localStorage.removeItem("carrierId");
				$scope.trackDataLink = [];
				$scope.garageDataLink = [];
				$scope.hospitalDataLink = [];
				
				})
				
		}
			$scope.modalEmailConfirm = false;
			$scope.inputValidStatus = false;
			$scope.composeEmail = {};
			$scope.composeEmail.paramMap = {};
			
			$scope.hideEmailConfirmModal=function()
			{
				$scope.modalEmailConfirm = false;
				$location.path("/quote");
				
			}
			
			
			$scope.sendClaimInfo = function(claimForm){
				$scope.disableSubmit=true;
		        if(claimForm.$invalid){
		                $scope.inputValidStatus = true;
		                angular.forEach($scope.claimForm.$invalid, function(field) {
		                        field.$setTouched();
		                });
		        }else{
		                $scope.inputValidStatus = false;
		                $scope.composeEmail.paramMap.selectedLineOfBusiness=$scope.selectedInsuranceType.name;
		                $scope.composeEmail.paramMap.insuranceCompany=$scope.selectedCarrierName.carrierName;
		                $scope.composeEmail.paramMap.USERNAME=$scope.claimDetailsUserInfo.firstName;
		                $scope.composeEmail.paramMap.lastName=$scope.claimDetailsUserInfo.lastName;
		                $scope.composeEmail.paramMap.userEmail=$scope.claimDetailsUserInfo.emailId;
		                $scope.composeEmail.paramMap.mobileNumber=$scope.claimDetailsUserInfo.mobileNumber;
		                $scope.composeEmail.paramMap.insuranceType="Register Claim";
		                RestAPI.invoke("createTicket", $scope.composeEmail).then(function(callback){ 
		                	if(callback.responseCode == $scope.globalLabel.responseCode.success){
		                		$scope.disableSubmit=false;
		                        $scope.composeEmail={};
		                        $scope.claimDetailsUserInfo = {};
		                        $scope.modalEmailConfirm = true;
		                        claimForm.$setPristine();
		                        claimForm.$setUntouched();
		                	}
		                });
		        }
			}
		
}]);