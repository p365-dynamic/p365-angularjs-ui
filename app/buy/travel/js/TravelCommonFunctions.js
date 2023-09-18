/*
 * Description	: This file contains the functions to perform analytics related operations.
 * Author		: 1) Akash Kumawat, 
 * Date			: 03 JUL 2018
 * 
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 * 1.		03-JUL-2018			function to prepare quote request													modification-001	Akash K.
 * 1.		03-JUL-2018			function to prepare proposal request												modification-002	Akash K.
 * 
 */

//function to prepare quote request		-	modification-001
function prepareQuoteRequest(quote){
		var quoteRequest = {};
		quoteRequest.quoteParam = {};
		quoteRequest.travelDetails = {};
		quoteRequest.quoteParam.travellers = [];
		quoteRequest.travelDetails.destinations = []
		
		for(var i=0; i<quote.quoteParam.travellers.length;i++){
			var traveller = {};
			traveller.gender 	   = quote.quoteParam.travellers[i].gender;
			traveller.traveller_id = quote.quoteParam.travellers[i].traveller_id;
			traveller.age		   = quote.quoteParam.travellers[i].age;
			traveller.relation		   = quote.quoteParam.travellers[i].relation;
			if(quote.quoteParam.travellers[i].diseaseDetails != undefined && quote.quoteParam.travellers[i].diseaseDetails.length != 0){
				traveller.diseaseDetails = quote.quoteParam.travellers[i].diseaseDetails;
			}
			quoteRequest.quoteParam.travellers.push(traveller);
		}
		if(quoteRequest.quoteParam.travellers.length > 1){
			quoteRequest.quoteParam.planType = "F";
		}else{
			quoteRequest.quoteParam.planType = "I";
		}
		quoteRequest.quoteParam.quoteMinAge    = quote.quoteParam.quoteMinAge;
		quoteRequest.quoteParam.quoteMaxAge    = quote.quoteParam.quoteMaxAge;
		quoteRequest.quoteParam.documentType   = quote.quoteParam.documentType;
		quoteRequest.quoteParam.isIndian       = quote.quoteParam.isIndian;
		quoteRequest.quoteParam.isOciPioStatus = quote.quoteParam.isOciPioStatus;
		quoteRequest.quoteParam.travellingFromIndia = quote.quoteParam.travellingFromIndia;
		quoteRequest.quoteParam.pedStatus      = quote.quoteParam.pedStatus;
		quoteRequest.quoteParam.quoteType      = quote.quoteParam.quoteType;
		quoteRequest.quoteParam.policyType     = quote.quoteParam.policyType;
		quoteRequest.travelDetails.startdate   = quote.travelDetails.startdate;
		quoteRequest.travelDetails.enddate     = quote.travelDetails.enddate;
		quoteRequest.travelDetails.tripType	   = quote.travelDetails.tripType;
		if(quoteRequest.travelDetails.tripType == 'single'){
			quoteRequest.travelDetails.tripDuration = 0;
		}else{
			quoteRequest.travelDetails.tripDuration = quote.travelDetails.tripDuration;
		}
		quoteRequest.travelDetails.sumInsured  = quote.travelDetails.sumInsured;
		quoteRequest.travelDetails.source		= quote.travelDetails.source;
		quoteRequest.travelDetails.destinations = quote.travelDetails.destinations;
		quoteRequest.requestType = quote.requestType;
		return quoteRequest;
	}


//function to prepare proposal request		-	modification-002
function prepareProposalRequest(proposal){
 var proposalRequest = {};
 
 return proposalRequest;	
}
