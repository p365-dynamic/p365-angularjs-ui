/*
 * Description	: This file contains the functions to perform analytics related operations.
 * Author		: 1) Yogesh S Shisode, 
 * 				  2) Shubham Jain
 * Date			: 17 May 2016
 * 
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *  5		31-05-2016		added fxns getDocUsingId 													  		  modification-0005		Shubham Jain
 *  8		02-06-2016		Function created to check whether array is empty or not.							  modification-0008		Yogesh S.
 *  11		16-06-2016		Function created to get city from IP address using some API.						  modification-0011		Yogesh S.
 *  12		21-07-2016		Function to get list of registration years depending upon maxVehicleAge.			  modification-0012		Yogesh S.
 *  13		21-07-2016		Function created to get any array list from database.								  modification-0013		Yogesh S.
 *  15		29-07-2016		Function created to get default rider list respective business line.				  modification-0015		Yogesh S.
 *  16		12-08-2016		Function created to calculate age from DOB.											  modification-0016		Yogesh S.
 *  17		27-08-2016		Function created to get array with unique elements.									  modification-0017		Yogesh S.
 *  18		30-08-2016		Function created to get array list of calculated sum assured values.				  modification-0018		Yogesh S.
 *  23		08-11-2016		Function created to calculate date of birth of a person form age.					  modification-0023		Yogesh S.
 *  24		14-11-2016		Function created to calculate age of the person in days/years.						  modification-0024		Yogesh S.
 *  25		14-11-2016		Function created to get difference in days from current date and specified date.	  modification-0025		Yogesh S.
 *  26		15-11-2016		Function created to get document using input parameters.							  modification-0026		Yogesh S.
 *  27		03-12-2016		Function to get list of manufacture years depending upon registration year.			  modification-0027		Yogesh S.
 *  28		03-02-2017		Method to get the address using google map api.										  modification-0028		Yogesh S.
 *  29		05-02-2017		Method to get the selected date in required string format.							  modification-0029		Yogesh S.
 *	30		05-02-2017		Method to get the selected date in required date format.							  modification-0030		Yogesh S.
 *	31		23-03-2017		Method to get the pin-code from the selected city.									  modification-0031		Yogesh S.
 *  32		04-04-2017		Method to populate policy term list.												  modification-0032		Yogesh S.
 *  33		04-04-2017		Method to populate current financial year. 											  modification-0033		Yogesh S.
 *  34		18-04-2017		Method to create display format for date.											  modification-0034		Yogesh S.
 *  35		25-04-2017		Method which generates policy status list.											  modification-0035		Yogesh S.
 *  36		26-04-2017		Method created to set properties of custom date picker.								  modification-0036		Yogesh S.
 *  37		01-08-2017		Method created to validate using include function(work around for IE).				  modification-0037		Dany
 *  38		11-09-2017		Method created to send custom URL for CRM(olark)									  modification-0038		Dany
 *  39		17-10-2017		Method to format date.																  modification-0039		Yogesh S.
 *  40		26-10-2017		Function is created to make provided object empty.									  modification-0040		Yogesh S.
 *  41		16-11-2017		Function created to call doc by id from central Quote Database						  modification-0041		Yogesh S.
 *  42		31-01-2018		Function created to call doc by id from central Transaction Database.				  modification-0042		Yogesh S.
 *  43		31-01-2018		Function created to encrypt the contents of local storage.				              modification-0043		Akash K.
 *  44		31-01-2018		Function created to decrypt the contents of local storage.				  			  modification-0044		Akash K.
 *  45		09-04-2018		Function to get list depends upon max limit.										  modification-0045		Akash K.
 *  46		09-04-2018		Function to get list of travellers upon max limit and age limit.					  modification-0046		Akash K.
 *  47		20-04-2018		condition to give dynamic path for wordpress.										  modification-0047		Sandip P.
 *  48    	11-04-2018		Function created to get maximum age from ageList									  modification-0048		Akash K.
 *  49		11-04-2018		Function created to get minimum age from ageList									  modification-0049		Akash K.
 * 	50		13-06-2018		Function created to calculate proposer age from DOB.								  modification-0050		Sandip P
 * 	51		06-07-2018		Function to get minimum date from the dateList   									  modification-0051		Akash K.
 *  52		06-07-2018		Function to get Maximum date from the dateList   									  modification-0052		Akash K.
 *  53      06-11-2018		Function to validate email															  modification-0053		Akash K.
 *  54		01-11-2018		Function to detect user Agent														  modification-0054     Tarandeep C.
 *  55		10-01-2019		Function to fetch cookies with provided key											modification-0055     Akash K.			
 *  56		18-04-2019		//code for imautic - modification-0056												modification-0056     Gauri B.
										  	
 * */
var item = {};
//Function created to call doc by id from central Database.	-	modification-0005
function getDocUsingId(RestAPI, documentId, callbackFunction) {
    var document = {};
    document.documentType = documentId;
    RestAPI.invoke("dataReader", document).then(function(callback) {
        callbackFunction(callback.data);
    });
}

//Function created to call doc by id from central Quote Database.	-	modification-0041
function getDocUsingIdQuoteDB(RestAPI, documentId, callbackFunction) {
    var document = {};
    document.docId = documentId;
    RestAPI.invoke("quoteDataReader", document).then(function(callback) {
        callbackFunction(callback.data);
    });
}

//Function created to call doc by id from central Trans Database.	-	modification-0042
function getDocUsingIdTransDB(RestAPI, documentId, callbackFunction) {
    var document = {};
    document.docId = documentId;
    RestAPI.invoke("transDataReader", document).then(function(callback) {
        callbackFunction(callback.data);
    });
}

//Function created to get document using input paramters.	-	modification-0026
function getDocUsingParam(RestAPI, transactionName, inputParam, callbackFunction) {

    RestAPI.invoke(transactionName, inputParam).then(function(callback) {
        
		callbackFunction(callback);
    });
}

function updateSelectedProduct(RestAPI, quoteId, product, callbackFunction) {
    var inputParam = {};
    inputParam.QUOTE_ID = quoteId;
    inputParam.selectedProduct = String(product.productId);
    inputParam.selectedCarrier = String(product.carrierId);
    RestAPI.invoke("updateSelectedProduct", inputParam).then(function(callback) {
        callbackFunction(callback);
    });
}

function updateHealthSelectedProduct(RestAPI, quoteId, product, callbackFunction) {
    var inputParam = {};
    inputParam.QUOTE_ID = quoteId;
    inputParam.selectedProduct = String(product.planId);
    inputParam.selectedCarrier = String(product.carrierId);
    if (product.childPlanId) {
        inputParam.selectedChildPlanId = String(product.childPlanId);
    } else {
        inputParam.selectedChildPlanId = '';
    }
    RestAPI.invoke("updateSelectedProduct", inputParam).then(function(callback) {
        callbackFunction(callback);
    });
}

//Function created to check whether array is empty or not.	-	modification-0008
function isArrayEmpty(array, callback) {
    return array.filter(function(el) {
        callback(Object.keys(el).length !== 0);
    });
}

//Function created to get city from IP address using some API.	-	modification-0011
function findCityBasedIP(HTTP, position, responseCodeSuccess, callback) {
    console.log("geolocator : " + JSON.stringify(position));
    if (String(position) != "undefined") {
        var request = {};
        var header = {};

        var geolocationParam = {};
        geolocationParam.latitude = position.coords.latitude;
        geolocationParam.longitude = position.coords.longitude;

        console.log("captured latitude and longitude : " + JSON.stringify(geolocationParam));
        var geoLocationAPILink = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + geolocationParam.latitude + "," + geolocationParam.longitude + "&sensor=true";
        console.log("geoLocationAPILink : " + geoLocationAPILink);
        HTTP.get(geoLocationAPILink).then(function(geoLocationAPIResponse) {
            console.log("geoLocationAPIResponse : " + JSON.stringify(geoLocationAPIResponse));
            if (geoLocationAPIResponse.status == 200) {
                var geoLocationDetails = geoLocationAPIResponse.data;
                console.log("GeoLocation Response Status 200 ");
                if (String(geoLocationDetails.error_message) == "undefined") {
                    getAddressFields(geoLocationDetails.results[0], function(fomattedAddress, cityFromIP, stateFromIP, pincodeFromIP) {
                        console.log("geolocator success details : " + cityFromIP + " : " + stateFromIP + " : " + pincodeFromIP + " : " + fomattedAddress);
                        callback(cityFromIP, pincodeFromIP, stateFromIP, true);
                    });
                } else {
                    console.log("GeoLocation Response Error Message Received.");
                    callback("Mumbai", "400007", "Maharashtra", true);
                }
            } else {
                console.log("GeoLocation Response Status " + geoLocationAPIResponse.status);
                callback("Mumbai", "400007", "Maharashtra", true);
            }
        });

        /*header.transactionName = "geoLocatorRequest";
        request.header = header;
        request.body = geolocationParam;
        console.log("geolocator request : " + JSON.stringify(request));	
        HTTP({method:'POST', url: getQuoteCalcLink, data: request}).
        success(function(geolocationResponse, status) {
        	console.log("geolocator response : " + JSON.stringify(geolocationResponse));
        	var geolocationInfo = JSON.parse(geolocationResponse);
        	if(geolocationInfo.responseCode == responseCodeSuccess){
        		console.log("geolocator success : " + JSON.stringify(geolocationInfo));
        		getAddressFields(geolocationInfo.data.results[0], function(fomattedAddress, cityFromIP, stateFromIP, pincodeFromIP){
        			console.log("geolocator success details : " + cityFromIP + " : " + stateFromIP + " : " + pincodeFromIP + " : " + fomattedAddress);
        			callback(cityFromIP, pincodeFromIP, stateFromIP, true);
        		});
        	}else{
        		console.log("geolocator failure 1");
        		callback("Mumbai", "400007", "Maharashtra", true);
        	}
        }).
        error(function(data, status){
        	console.log("geolocator failure 2");
        	callback("Mumbai", "400007", "Maharashtra", true);
        });*/
    } else {
        callback("Mumbai", "400007", "Maharashtra", true);
    }
}

//Function to get list of registration years depending upon maxVehicleAge.	-	modification-0012
function listRegistrationYear(insuranceType, maxVehicleAge) {
    var currentYear = new Date().getFullYear();
    var yearListGeneric = [];
    if (insuranceType == "new") {
        yearListGeneric.push(String(currentYear));
    } else {
        for (var i = 0; i < maxVehicleAge; i++) {
            yearListGeneric.push(String(currentYear - i));
        }
    }

    return yearListGeneric;
}

//Function to get list of manufacture years depending upon registration year.	-	modification-0027
function listManufactureYear(registrationYear, maxVehicleAge) {
    var yearList = [];
    for (var i = 0; i < maxVehicleAge; i++) {
        yearList.push(Number(registrationYear) - i);
    }
    return yearList;
}

//Function to get age list depends upon min and max.	-	modification-0027
function getAgeList(minAge, maxAge) {
    var ageArray = [];
    for (var i = 0, j = minAge; j <= maxAge; i++, j++) {
        ageArray.push(j);
    }
    return ageArray;
}


//Function to get list depends upon max limit.	-	modification-0045
function getList(maxLimit) {
    var result = [];
    var j = 1;
    for (var i = 0; i < maxLimit; i++, j++) {
        result.push(j);
    }
    return result;
}

//Function to get list of travellers upon max limit and age limit.	-	modification-0046
function getTravellerList(maxLimit, defaultAge, minAge, maxAge) {
    var travellers = [];
    var j = 1;
    for (var i = 0; i < maxLimit; i++, j++) {
        var travellerInfo = {};
        travellerInfo.id = j;
        travellerInfo.minAge = minAge;
        travellerInfo.maxAge = maxAge;
        travellerInfo.age = defaultAge;
        travellerInfo.gender = "M";
        travellerInfo.status = true;
        travellers.push(travellerInfo);
    }
    return travellers;
}

//Function created to get any array list from database.	-	modification-0013
function getListFromDB(RestAPI, searchData, documentType, transactionName, callbackFunction) {
    var searchJson = {};
    searchJson.searchValue = searchData;
    searchJson.documentType = documentType;
    RestAPI.invoke(transactionName, searchJson).then(function(callback) {
        callbackFunction(callback);
    });
}

//Function created to calculate age of the person in days/years.	-	modification-0024
function getAge(dateString, term) {
    var birthdate = new Date(dateString).getTime();
    var now = new Date().getTime();
    var n = (now - birthdate) / 1000; // now find the difference between now and the birthdate.

    if (Number(term) == 1) {
        var day_n = Math.floor(n / 86400);
        return day_n;
    } else if (Number(term) == 2) {
        var month_n = Math.floor(n / 2629743);
        return month_n;
    } else {
        var year_n = (n / 31556926).toFixed(2);
        return year_n;
    }
}

function calculateAgeByDOB(dateString) {
    var birthDate = new Date(dateString);
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function findSalutation(gender) {
    if (gender == 'Male') {
        return 'Mr';
    } else if (gender == 'Female') {
        return 'Ms';
    } else if (gender == 'M') {
        return 'Mr';
    } else {
        return 'Ms';
    }

}

//Function created to calculate age from DOB.	-	modification-0016
function getAgeFromDOB(dateOfBirth) {
    var tempDOB = dateOfBirth.split("/");
    var calcDOB = tempDOB[1] + "/" + tempDOB[0] + "/" + tempDOB[2];

    var birthdate = new Date(calcDOB).getTime();
    var now = new Date().getTime();
    var n = (now - birthdate) / 1000; // now find the difference between now and the birthdate.

    var month_n = Math.floor(n / 2629743);
    month_n = month_n % 12;

    if (String(month_n).length == 1)
        month_n = 0 + "" + month_n;

    var year_n = Math.floor(n / 31556926);
    var calDOB = year_n + "." + month_n;
    var calAge = Number(Number(calDOB).toFixed(2));
    return calAge;
}

//Function created to calculate proposal age from DOB.	-	modification-0050
function getProposerAgeFromDOB(dateOfBirth) {
    var tempDOB = dateOfBirth.split("/");
    var calcDOB = tempDOB[1] + "/" + tempDOB[0] + "/" + tempDOB[2];

    var birthdate = new Date(calcDOB).getTime();
    var now = new Date();
    now = now.setDate(now.getDate() - 1);
    var n = (now - birthdate) / 1000; // now find the difference between now and the birthdate.
    var month_n = Math.floor(n / 2629743);
    month_n = month_n % 12;
    if (String(month_n).length == 1)
        month_n = 0 + "" + month_n;

    var year_n = Math.floor(n / 31556926);
    var calDOB = year_n + "." + month_n;
    var calAge = Number(Number(calDOB).toFixed(2));

    return calAge;
}

//Function created to get difference in days from current date and specified date.	-	modification-0025
function getDays(dateString) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var today = new Date();
    var currDate = today.getFullYear() + "," + (Number(today.getMonth()) + 1) + "," + today.getDate();
    var firstDate = new Date(dateString);
    var secondDate = new Date(currDate);

    return (Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))));
}

//Function created to calculate date of birth of a person form age.	-	modification-0023
function calcDOBFromAge(personAge) {
    var currentDate = new Date();
    var birthYear = currentDate.getFullYear() - personAge;
    var birthMonth = currentDate.getMonth() + 1;

    if (birthMonth <= 6)
        return ("01/01/" + birthYear);
    else
        return ("01/07/" + birthYear);
}

//Function created to get default rider list respective business line.	-	modification-0015
function addRidersToDefaultQuote(defaultRiders, businessLine, callbackFunction) {

    var defaultRiderArray = [];
    var defaultRiderArrayObject = [];

    for (var i = 0; i < defaultRiders.length; i++) {
        if (defaultRiders[i].isEnable == "Y") {
            var rider = {};
            rider.riderName = defaultRiders[i].riderName;
            rider.riderId = defaultRiders[i].riderId;
            defaultRiderArray.push(rider);
            defaultRiderArrayObject.push(defaultRiders[i]);
            break;
        }
    }

    callbackFunction(defaultRiderArray, defaultRiderArrayObject);
}


//Function created to get default rider list Bike respective business line.	-	modification-0042
function addRidersToDefaultQuoteBike(defaultRiders, businessLine, callbackFunction) {
    var defaultRiderArray = [];
    var defaultRiderArrayObject = [];

    for (var i = 0; i < defaultRiders.length; i++) {
        if (defaultRiders[i].isEnable == "Y") {
            var rider = {};
            rider.riderName = defaultRiders[i].riderName;
            rider.riderId = defaultRiders[i].riderId;
            defaultRiderArray.push(rider);
            defaultRiderArrayObject.push(defaultRiders[i]);
        }
    }

    callbackFunction(defaultRiderArray, defaultRiderArrayObject);
}


//Function created to get array with unique elements.	-	modification-0017
function uniq_fast(inputArray, callback) {
    var seen = {};
    var resultArray = [];
    var len = inputArray.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = inputArray[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            resultArray[j++] = item;
        }
    }
    callback(resultArray);
}

//Function created to get array list of calculated sum assured values.	-	 modification-0018
function listSumAssuredAmt(annualIncome, callback) {
    var maxSumAssured = annualIncome * 20;
    var defaultSumAssured = annualIncome * 10;
    var selectedSumAssured = arraySumAssuredGeneric[0];
    var resultSumAssuredArray = [];

    for (var i = 0; i < arraySumAssuredGeneric.length; i++) {
        if (arraySumAssuredGeneric[i].amount <= maxSumAssured)
            resultSumAssuredArray.push(arraySumAssuredGeneric[i]);
    }

    for (var i = 0; i < arraySumAssuredGeneric.length; i++)
        if (arraySumAssuredGeneric[i].amount <= defaultSumAssured)
            selectedSumAssured = arraySumAssuredGeneric[i];

    callback(resultSumAssuredArray, selectedSumAssured);
}

//Method to get selected rider list
function selectedRiderList(totalRiderList, selectedRiders, requestedRiders, callback) {
    //var ZeroDepStatus = "N";
    // for (var i = 0; i < selectedRiders.length; i++) {
    // 	if (selectedRiders[i].riderId == 6) {
    // 		ZeroDepStatus = "Y";
    // 		break;
    // 	}
    // }

    for (var i = 0; i < selectedRiders.length; i++) {
        //if (selectedRiders[i].riderId != 24) {
            item = {};
            item.riderId = selectedRiders[i].riderId;
            item.riderName = selectedRiders[i].riderName;
            item.riderAmount = 0;
            requestedRiders.push(item);
        //} //else if (ZeroDepStatus == "Y") {
        // 	item = {};
        // 	item.riderId = selectedRiders[i].riderId;
        // 	item.riderName = selectedRiders[i].riderName;
        // 	item.riderAmount = 0;
        // 	requestedRiders.push(item);
        // }
    }

    for (var i = 0; i < totalRiderList.length; i++) {
        delete totalRiderList[i].$$hashKey;
        // if (totalRiderList[i].riderId == 24)
        // 	totalRiderList[i].isEnable = ZeroDepStatus;
    }
    callback();
}

//Method to get selected rider list for bike
function selectedRiderListForBike(selectedRiders, requestedRiders, callback) {
    console.log("selectedRiders ---3: ", selectedRiders);
    if (selectedRiders.length > 0) {
        for (var i = 0; i < selectedRiders.length; i++) {
            item = {};
            item.riderId = selectedRiders[i].riderId;
            item.riderName = selectedRiders[i].riderName;
            // condition added to check if the rider has amount more than 0 then get selected amount or set it to 0;
            if (selectedRiders[i].riderAmount > 0) {
                item.riderAmount = Number(selectedRiders[i].riderAmount);
            } else {
                item.riderAmount = 0;
            }
            requestedRiders.push(item);
        }
    } else {
        requestedRiders = undefined;
    }

    callback();
}

function selectedRiderListForLife(totalRiderList, selectedRiders, requestedRiders, callback) {
    for (var i = 0; i < selectedRiders.length; i++) {
        item = {};
        item.riderId = selectedRiders[i].riderId;
        item.riderName = selectedRiders[i].riderName;
        requestedRiders.push(item);
    }
    for (var i = 0; i < totalRiderList.length; i++) {
        delete totalRiderList[i].$$hashKey;
        if (totalRiderList[i].riderId == 24)
            totalRiderList[i].isEnable = ZeroDepStatus;
    }
    callback();
}

function selectedRiderListForHealth(totalRiderList, selectedRiders, requestedRiders, callback) {
    var ZeroDepStatus = "N";
    for (var i = 0; i < selectedRiders.length; i++) {
        if (selectedRiders[i].riderId == 6)
            ZeroDepStatus = "Y";
        item = {};
        item.riderId = selectedRiders[i].riderId;
        item.riderName = selectedRiders[i].riderName;
        requestedRiders.push(item);
    }

    for (var i = 0; i < totalRiderList.length; i++) {
        delete totalRiderList[i].$$hashKey;
        if (totalRiderList[i].riderId == 24)
            totalRiderList[i].isEnable = ZeroDepStatus;
    }
    callback();
}

function addOnCoversWithStatus(recommendedAddon, vehicleAge, callback) {
    var addOnStatus = "Y";
    var ZeroDepStatus = "N";

    // for (var i = 0; i < recommendedAddon.length; i++) {
    // 	if (recommendedAddon[i].riderId == 6) {
    // 		ZeroDepStatus = "Y";
    // 		break;
    // 	}
    // }

    if (vehicleAge > 5)
        addOnStatus = "N";
    else
        addOnStatus = "Y";

    for (var recAddOncounter = 0; recAddOncounter < recommendedAddon.length; recAddOncounter++) {
        if (recommendedAddon[recAddOncounter].riderId == 10) {
            recommendedAddon[recAddOncounter].isEnable = addOnStatus;
            continue;
        } //else if (recommendedAddon[recAddOncounter].riderId == 24) {
        // 	recommendedAddon[recAddOncounter].isEnable = ZeroDepStatus;
        // 	continue;
        // }
    }
    callback();
}

//Method to get the list of riders based 
function getRiderList(RestAPI, documentType, searchData, transactionName, callbackRider) {
    var addOn = [];
    getListFromDB(RestAPI, searchData, documentType, transactionName, function(callback) {
        var riderData = callback.data;
        var count = 0;
        if(riderData){
        for (; riderData[count];) {
            addOn.push(riderData[count]);
            count++;
                }
            }
        callbackRider(addOn);
    });
}

//Method to get the address using google map api.		-	modification-0028
function getAddressFields(googleAddressObject, callbackAddress) {
    var fomattedAddress = "";
    var formattedCity = "";
    var formattedState = "";
    var formattedPincode = "";
    var addressSearchFields = ["premise", "route", "sublocality_level_2", "sublocality_level_1", "locality"];
    var searchFields = ["premise", "route", "sublocality_level_2", "sublocality_level_1", "locality", "administrative_area_level_2", "administrative_area_level_1", "postal_code"];

    if (googleAddressObject.name) {
        fomattedAddress = googleAddressObject.name + "," + fomattedAddress;
    }

    for (var i = 0; i < searchFields.length; i++) {
        for (var j = 0; j < googleAddressObject.address_components.length; j++) {
            for (var k = 0; k < googleAddressObject.address_components[j].types.length; k++) {
                if (searchFields[i] == googleAddressObject.address_components[j].types[k]) {
                    //if(addressSearchFields.includes(googleAddressObject.address_components[j].types[k])){
                     if (p365Includes(addressSearchFields, googleAddressObject.address_components[j].types[k])) {
                        fomattedAddress += googleAddressObject.address_components[j].long_name + ", ";
                    }
                    if (googleAddressObject.address_components[j].types[k] == "locality") {
                        formattedCity = googleAddressObject.address_components[j].long_name;
                    }
                    if (googleAddressObject.address_components[j].types[k] == "administrative_area_level_2") {
                        var tempCity = googleAddressObject.address_components[j].long_name;
                        if (tempCity != null && String(tempCity) != "undefined" && tempCity.length > 0)
                            formattedCity = tempCity;
                    }
                    if (googleAddressObject.address_components[j].types[k] == "administrative_area_level_1") {
                        formattedState = googleAddressObject.address_components[j].long_name;
                    }
                    if (googleAddressObject.address_components[j].types[k] == "postal_code") {
                        formattedPincode = googleAddressObject.address_components[j].long_name;
                    }
                    break;
                }
            }
        }
    }
    fomattedAddress = fomattedAddress.substr(0, (fomattedAddress.length - 2));
    callbackAddress(fomattedAddress, formattedCity, formattedState, formattedPincode);
}

//Method to get the selected date in required string format.		-	modification-0029
function convertDateFormatToString(selectedDate, callbackFormattedDate) {
    var formattedDate = ("0" + selectedDate.getDate().toString()).substr(-2) + "/" + ("0" + (selectedDate.getMonth() + 1).toString()).substr(-2) +
        "/" + (selectedDate.getFullYear().toString());
    callbackFormattedDate(formattedDate);
}

//Method to get the selected date in required date format.		-	modification-0030
function convertStringFormatToDate(selectedDate, callbackFormattedDate) {
    if (selectedDate != null && String(selectedDate) != "undefined") {
        var dateArray = selectedDate.split("/");
        var displayFutureDate = new Date(dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2]);
        callbackFormattedDate(displayFutureDate);
    }
}

//Method to get the pincode from the selected city.	-	modification-0031
function getPincodeFromCity($http, item, callbackPincode) {

    var cityName = item.rtoCity.toLowerCase();
    $http.get(getServiceLink + "Area" + "&q=" + cityName).then(function(regAreaRes) {
        callbackPincode(JSON.parse(regAreaRes.data));
    });
}

//Method to populate policy term list.	-	modification-0032
function getPolicyTerms(policyTermLimit) {
    var policyTermList = [];
    for (var i = 0; i < policyTermLimit; i++) {
        var prodTerm = {};
        prodTerm.display = (i + 1) + " Year";
        prodTerm.term = (i + 1);
        prodTerm.unit = "year";
        policyTermList.push(prodTerm);
    }
    return policyTermList;
}

//Method to populate current financial year. - modification-0033
function getCurrentFinancialYearDate() {
    var currentMonth = (new Date().getMonth()) + 1;
    if (currentMonth > 3)
        return ((Number(new Date().getFullYear()) + 1) + ",03,31");
    else
        return ((Number(new Date().getFullYear())) + ",03,31");
}

//Method to create display format for date. - modification-0034
function getDateForDisplay(selectedDate) {
    var displayFutureDate = "";
    //if(!selectedDate){
    if (selectedDate != null && String(selectedDate) != "undefined") {
        var dateArray = selectedDate.split("/");
        var displayFutureDate = dateArray[0] + "-" + (monthListGeneric[Number(dateArray[1]) - 1]) + "-" + dateArray[2];
    }
    return displayFutureDate;
}

//Method to format date. - modification-0039
function dateFormater(selectedDate, format) {
    var formatedDate = "";
    if (String(format) != "dd-mm-yyyy") {
        var dateArray = selectedDate.split("/");
        var formatedDate = dateArray[0] + "-" + dateArray[1] + "-" + dateArray[2];
    } else if (String(format) != "mm-dd-yyyy") {
        var dateArray = selectedDate.split("/");
        var formatedDate = dateArray[1] + "-" + dateArray[0] + "-" + dateArray[2];
    } else if (String(format) != "dd-mmm-yyyy") {
        var dateArray = selectedDate.split("/");
        var formatedDate = dateArray[0] + "-" + (monthListGeneric[Number(dateArray[1]) - 1]) + "-" + dateArray[2];
    }
    /*added this block of code to format date on 04-12-2018 by Akash.K*/
    if (String(format) == "dd/mm/yyyy") {
        dateArray = selectedDate.split("/");
        formatedDate = dateArray[0] + "/" + dateArray[1] + "/" + dateArray[2];
    } else if (String(format) == "mm/dd/yyyy") {
        dateArray = selectedDate.split("/");
        formatedDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
    }

    return formatedDate;
}

//Method which generates policy status list. - modification-0035
//Method which generates policy status list. - modification-0035
function getPolicyStatusList(businessDate) {
    var today = new Date(businessDate);
    var priorDate = new Date(new Date().setDate(today.getDate() - 90));
    var yesterdayDate = new Date(businessDate);
    var weekBeforeCurrentDate = new Date(new Date().setDate(today.getDate() - 7));

    //displaying month with appending 0 ,if month > 10
    if(priorDate.getMonth() < 9){
        var futureDate = ("0" + priorDate.getDate().toString()).substr(-2) + "/" + "0" +(priorDate.getMonth() + 1) + "/" + (priorDate.getFullYear().toString());
    }else{
        var futureDate = ("0" + priorDate.getDate().toString()).substr(-2) + "/" + (priorDate.getMonth() + 1) + "/" + (priorDate.getFullYear().toString());
    }
        var displayFutureDate = ("0" + priorDate.getDate().toString()).substr(-2) + "-" + (monthListGeneric[priorDate.getMonth()]) + "-" + (priorDate.getFullYear().toString());

    // var currentMonthLastDate = ("0" + (new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth() + 1, 0)).getDate().toString()).substr(-2) + "/" +
    //     (yesterdayDate.getMonth() + 1) + "/" + (yesterdayDate.getFullYear().toString());
    
    if(yesterdayDate.getMonth() < 9){
        var currentMonthLastDate = ("0" + (new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth() + 1, 0)).getDate().toString()).substr(-2) + "/" +"0"+
        (yesterdayDate.getMonth() + 1) + "/" + (yesterdayDate.getFullYear().toString());   
    }else{
        var currentMonthLastDate = ("0" + (new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth() + 1, 0)).getDate().toString()).substr(-2) + "/" +
        (yesterdayDate.getMonth() + 1) + "/" + (yesterdayDate.getFullYear().toString());
    }
    var displayCurrentMonthLastDate = ("0" + (new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth() + 1, 0)).getDate().toString()).substr(-2) + "-" +
        (monthListGeneric[yesterdayDate.getMonth()]) + "-" +
        (yesterdayDate.getFullYear().toString());
    
    if(weekBeforeCurrentDate.getMonth() < 9){
        var weekBeforeCurrentDateFormat = ("0" + weekBeforeCurrentDate.getDate().toString()).substr(-2) + "/" + "0" +
        (weekBeforeCurrentDate.getMonth() + 1) + "/" + (weekBeforeCurrentDate.getFullYear().toString());
    }else{
        var weekBeforeCurrentDateFormat = ("0" + weekBeforeCurrentDate.getDate().toString()).substr(-2) + "/" +
        (weekBeforeCurrentDate.getMonth() + 1) + "/" + (weekBeforeCurrentDate.getFullYear().toString());
    }
    var displayWeekBeforeCurrentDateFormat = ("0" + weekBeforeCurrentDate.getDate().toString()).substr(-2) + "-" +
        (monthListGeneric[weekBeforeCurrentDate.getMonth()]) + "-" +
        (weekBeforeCurrentDate.getFullYear().toString());

    policyStatusListGeneric = [{ "key": 1, "label": "Expired on or before " + displayFutureDate, "policyType": "renew", "displayText": "Expired", "displayText2": "> 90 days", "expiryDate": futureDate },
        { "key": 2, "label": "Expired after " + displayFutureDate, "policyType": "renew", "displayText": "Expired", "displayText2": displayWeekBeforeCurrentDateFormat, "expiryDate": weekBeforeCurrentDateFormat },
        { "key": 3, "label": "Not yet expired", "policyType": "renew", "displayText": "Not yet expired", "displayText2": displayCurrentMonthLastDate, "expiryDate": currentMonthLastDate }
    ];
}

//Method created to set properties of custom date picker.	- modification-0036
function setP365DatePickerProperties(dateOptions) {
    var minCalcDate = null;
    var maxCalcDate = null;

    if (String(dateOptions.minimumDateLimit) == "undefined" || dateOptions.minimumDateLimit == null) {
        if (String(dateOptions.minimumDateStringFormat) == "undefined" || dateOptions.minimumDateStringFormat == null) {
            if (String(dateOptions.minimumYearLimit) == "undefined" || dateOptions.minimumYearLimit == null) {
                if (String(dateOptions.minimumMonthLimit) == "undefined" || dateOptions.minimumMonthLimit == null) {
                    if (String(dateOptions.minimumDayLimit) == "undefined" || dateOptions.minimumDayLimit == null) {
                        minCalcDate = null;
                    } else {
                        minCalcDate = dateOptions.minimumDayLimit;
                    }
                } else {
                    minCalcDate = dateOptions.minimumMonthLimit;
                }
            } else {
                minCalcDate = dateOptions.minimumYearLimit;
            }
        } else {
            minCalcDate = dateOptions.minimumDateStringFormat;
        }
    } else {
        minCalcDate = new Date(dateOptions.minimumDateLimit);
    }

    if (String(dateOptions.maximumDateLimit) == "undefined" || dateOptions.maximumDateLimit == null) {
        if (String(dateOptions.maximumDateStringFormat) == "undefined" || dateOptions.maximumDateStringFormat == null) {
            if (String(dateOptions.maximumYearLimit) == "undefined" || dateOptions.maximumYearLimit == null) {
                if (String(dateOptions.maximumMonthLimit) == "undefined" || dateOptions.maximumMonthLimit == null) {
                    if (String(dateOptions.maximumDayLimit) == "undefined" || dateOptions.maximumDayLimit == null) {
                        maxCalcDate = null;
                    } else {
                        maxCalcDate = dateOptions.maximumDayLimit;
                    }
                } else {
                    maxCalcDate = dateOptions.maximumMonthLimit;
                }
            } else {
                maxCalcDate = dateOptions.maximumYearLimit;
            }
        } else {
            maxCalcDate = dateOptions.maximumDateStringFormat;
        }
    } else {
        maxCalcDate = new Date(dateOptions.maximumDateLimit);
    }

    var todayDate = new Date();

    var minYear = Number(todayDate.getFullYear()) - 100;
    var maxYear = Number(todayDate.getFullYear()) + 10;
    var yearCalcRange = minYear + ":" + maxYear;

    var dateOptionNode = {
        minDate: minCalcDate,
        maxDate: maxCalcDate,
        changeMonth: dateOptions.changeMonth,
        changeYear: dateOptions.changeYear,
        dateFormat: dateOptions.dateFormat,
        yearRange: yearCalcRange,
        showOn: 'both',
        buttonImage: wp_path + "img/profesionalCalendar.png",
        buttonImageOnly: true

    };

    return dateOptionNode;
}

//fxn to validate email   - modification-0053
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
}

//Method created to validate using include function(work around for IE).	- modification-0037
function p365Includes(array, SearchValue) {
    var returnValue = true;
    var checkIndexValue = array.indexOf(SearchValue);
    if (checkIndexValue < 0) {
        returnValue = false;
    }
    return returnValue;
}

//method created to send custom URL for CRM(olark)							- modification-0038
var docId, LOB, view, userId, screen, customURL, lob, proposalId;

function olarkCustomParam(documentId, LOB, quoteUserInfo, screen) {

    //code for encode
    var encodeQuote = String(documentId);
    var encodeLOB = String(LOB);
    if (quoteUserInfo) {
        userId = quoteUserInfo.emailId;
    } else {
        userId = "";
    }
    var encodeEmailId = String(userId);
    var key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
    var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');

    var encryptedQuote = CryptoJS.AES.encrypt(encodeQuote, key, { iv: iv });
    documentId = encryptedQuote.ciphertext.toString();

    var encryptedNewLOB = CryptoJS.AES.encrypt(encodeLOB, key, { iv: iv });
    LOB = encryptedNewLOB.ciphertext.toString();

    var encryptedEmailId = CryptoJS.AES.encrypt(encodeEmailId, key, { iv: iv });
    userId = encryptedEmailId.ciphertext.toString();

    docId = "docId=" + documentId;
    LOB = "LOB=" + LOB;
    view = "view=view";
    userId = "userId=" + userId;
    if (screen != 'proposal') {
        if (screen == false) {
            customURL = redirectURL + "sharefromAPI?" + docId + "&" + LOB + "&" + userId + "&" + view;
        } else {
            screen = "screen=screen";
            customURL = redirectURL + "sharefromAPI?" + docId + "&" + LOB + "&" + userId + "&" + view + "&" + screen;
        }
    } else if (screen == 'proposal') {
        proposalId = "proposalId=" + documentId;
        lob = "lob=" + LOB;
        customURL = redirectURL + "proposalresdata?" + proposalId + "&" + LOB;
    }

    if (quoteUserInfo) {
        if (idepProdEnv && customEnvEnabled) {
            olark('api.chat.updateVisitorStatus', {
                snippet: customURL
            });
            olark('api.visitor.updateFullName', {
                fullName: quoteUserInfo.firstName + " " + quoteUserInfo.lastName
            });
            olark('api.visitor.updateEmailAddress', {
                emailAddress: quoteUserInfo.emailId
            });
            olark('api.visitor.updatePhoneNumber', {
                phoneNumber: quoteUserInfo.mobileNumber
            });
        }
    }
}

//Function is created to make provided object empty.	-	modification-0040
function makeObjectEmpty(object, type) {
    var returnValue;
    if (type == "array") {
        returnValue = [];
    } else if (type == "text") {
        returnValue = "";
    } else {
        returnValue = {};
    }
    return returnValue;
}

//Function created to encrypt the contents of local storage.	-	modification-0043
function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), "_policies365_");
}

//Function created to decrypt the contents of local storage.	-	modification-0044
function decryptData(data) {
    var decryptedData = CryptoJS.AES.decrypt(data, "_policies365_");
    var decryptDataValue = decryptedData.toString(CryptoJS.enc.Utf8);

    if (decryptDataValue.trim().length > 0) {
        return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
    } else {
        return decryptedData.toString(CryptoJS.enc.Utf8);
    }
}
//condition to give dynamic path for wordpress.	-	modification-0047
//added for wordPress
var wp_path;
if (wordPressEnabled && iquoteEnabled) {
    wp_path = localized;
} else {
    wp_path = '';
} 

if(!wordPressEnabled && pospEnabled){
    wp_path = localized;
}

//created to get maximum age from ageList	-	modification-0048
function getMaxAge(ageList) {
    var maxAge = ageList[0];
    for (var i = 1; i < ageList.length; i++) {
        if (maxAge < ageList[i])
            maxAge = ageList[i];
    }
    return maxAge;
}

// created to get minimum age from ageList.	-	modification-0049
function getMinAge(ageList) {
    var minAge = ageList[0];
    for (var i = 1; i < ageList.length; i++) {
        if (minAge > ageList[i])
            minAge = ageList[i];
    }
    return minAge;
}

//fxn to get minimum date from the dateList   - modification-0051
function getMinDate(dateList) {
    var minDate = new Date(dateList[0]);
    for (var i = 1; i < dateList.length; i++) {
        var date = new Date(dateList[i]);
        if (minDate > date)
            minDate = date;
    }
    var finalMinDate = '';
    convertDateFormatToString(minDate, function(formattedMinDate) {
        finalMinDate = formattedMinDate;
    });
    return finalMinDate;
}

//fxn to get maximum date from the dateList   - modification-0052
function getMaxDate(dateList) {
    var maxDate = new Date(dateList[0]);
    for (var i = 1; i < dateList.length; i++) {
        var date = new Date(dateList[i]);
        if (maxDate < date)
            maxDate = date;
    }
    var finalMaxDate = '';
    convertDateFormatToString(maxDate, function(formattedMaxDate) {
        finalMaxDate = formattedMaxDate;
    });
    return finalMaxDate;
}

//fxn to validate email   - modification-0053
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
}

//fxn to detect userAgent - modification-0054
function get_browser_info() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE ', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

//fxn to fetch cookies with provided key - modification-0055
function getCookie(key) {
    var value = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
    return value ? value.pop() : undefined;
}


//code for imautic - modification-0056
/*function imatLeadQuoteInfo(firstName, lastName, email, mobile, leadMsgId, company, lob, lastQuoteId, lastCarQuoteUrl, lastBikeQuoteUrl, lastHealthQuoteUrl, lastLifeQuoteUrl, lastProfessionalQuoteUrl, professionalCode, carName, bikeName, age, gender, income, pincode, formEvent) {

    if (lob == 'car') {
        mt('send', 'pageview', {
            firstname: firstName,
            lastname: lastName,
            email: email,
            mobile: mobile,
            leadmsgid: leadMsgId,
            company: company,
            lob: lob,
            lastquoteid: lastQuoteId,
            lastcarquoteurl: lastCarQuoteUrl,
            carname: carName
        });
        if (formEvent) {
            submitEvent(formEvent);
        }
    }
    if (lob == 'bike') {
        mt('send', 'pageview', {
            firstname: firstName,
            lastname: lastName,
            email: email,
            mobile: mobile,
            leadmsgid: leadMsgId,
            company: company,
            lob: lob,
            lastquoteid: lastQuoteId,
            lastbikequoteurl: lastBikeQuoteUrl,
            bikename: bikeName
        });
        if (formEvent) {
            submitEvent(formEvent);
        }
    }
    if (lob == 'health') {
        mt('send', 'pageview', {
            firstname: firstName,
            lastname: lastName,
            email: email,
            mobile: mobile,
            leadmsgid: leadMsgId,
            company: company,
            lob: lob,
            lastquoteid: lastQuoteId,
            lasthealthquoteurl: lastHealthQuoteUrl,
            age: age,
            gender: gender,
            zipcode: pincode
        });
        if (formEvent) {
            submitEvent(formEvent);
        }
    }
    if (lob == 'life') {
        mt('send', 'pageview', {
            firstname: firstName,
            lastname: lastName,
            email: email,
            mobile: mobile,
            leadmsgid: leadMsgId,
            company: company,
            lob: lob,
            lastquoteid: lastQuoteId,
            lastlifequoteurl: lastLifeQuoteUrl,
            age: age,
            gender: gender,
            income: income
        });
        if (formEvent) {
            submitEvent(formEvent);
        }
    }
    if (lob == 'professionaljourney') {
        mt('send', 'pageview', {
            firstname: firstName,
            lastname: lastName,
            email: email,
            mobile: mobile,
            leadmsgid: leadMsgId,
            company: company,
            lob: lob,
            lastquoteid: lastQuoteId,
            lastprofessionalquoteurl: lastProfessionalQuoteUrl,
            professionalcode: professionalCode,
            age: age,
            gender: gender,
            income: income,
            zipcode: pincode,
            carname: carName,
            bikename: bikeName
        });
        if (formEvent) {
            submitEvent(formEvent);
        }
    }
}

function imatBuyClicked(carrierName, carrierId, leadMsgId, formEvent) {
    mt('send', 'pageview', {
        carriername: carrierName,
        carrierid: carrierId,
        leadmsgid: messageIDVar
    });
    if (formEvent) {
        submitEvent(formEvent);
    }
}

function imatProposal(lob, proposalId, proposal_url, messageIDVar, formEvent) {
    if (lob == 'car') {
        mt('send', 'pageview', {
            carproposalid: proposalId,
            proposalurl: proposal_url,
            leadmsgid: messageIDVar
        });
    }
    if (lob == 'bike') {
        mt('send', 'pageview', {
            bikeproposalid: proposalId,
            proposalurl: proposal_url,
            leadmsgid: messageIDVar
        });
    }
    if (lob == 'health') {
        mt('send', 'pageview', {
            healthproposalid: proposalId,
            proposalurl: proposal_url,
            leadmsgid: messageIDVar
        });
    }
    if (lob == 'life') {
        mt('send', 'pageview', {
            lifeproposalid: proposalId,
            proposalurl: proposal_url,
            leadmsgid: messageIDVar
        });
    }
    if (formEvent) {
        submitEvent(formEvent);
    }
}

function imatShareQuote(messageIDVar, additionalEmail, email, formEvent) {
    mt('send', 'pageview', {
        leadmsgid: messageIDVar,
        additionalemail: additionalEmail,
        email: email
    });
    if (formEvent) {
        submitEvent(formEvent);
    }
}

function imatEvent(formEvent) {
    submitEvent(formEvent);
}*/