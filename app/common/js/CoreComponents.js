/*
 * This file contains core component 
 * which is an API to call web services
 * 
 */
var coreCompApp = angular.module('CoreComponentApp', []);
var request = {};
var header = {};
var leadSource={};
var browser = get_browser_info();
coreCompApp.service('RestAPI',function($http){
	$http.defaults.useXDomain = true;
	this.invoke = function(method,data){
		header.messageId = messageIDVar;
		header.campaignID = campaignIDVar;
		header.source=sourceOrigin;
		header.deviceId = deviceIdOrigin;
		header.browser = browser.name+" V - "+browser.version;
		header.transactionName=method;
		data.campaign_id = campaign_id;
		//data.requestSource = requestSource;
		data.requestSource = sourceOrigin;
		data.messageId = messageIDVar;
		//data.leadSource = campaignSource;
		request.header=header;
		request.body=data;
		var req = {
				method: 'POST',
				url:'http://uatservices.policies365.com/cxf/authrestservices/integrate/invoke',
				//  url:'http://localhost:8981/cxf/authrestservices/integrate/invoke',
				//url:'WEBSERVICE_URL/authrestservices/integrate/invoke',
				//url:'http://mdevserv.infintus.com/cxf/authrestservices/integrate/invoke',

				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json;charset=utf-8'
				},
				data:request
		};
		return $http(req).then(
				function successCallback(callback, status, headers, config){
					function isJson(str) {
						try {
							JSON.parse(str);
						} catch (e) {
							return false;
						}
						return true;
					}

					if(isJson(callback.data)){
						return JSON.parse(callback.data);
					}else{
						return callback.data;
					}
				},
				function errorCallback(error, status, headers, config){
					return error;
				}
		);
	};
});
