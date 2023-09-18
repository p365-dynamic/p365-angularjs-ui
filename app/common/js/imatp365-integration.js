if (wordPressEnabled == true) {
    /** 
     * This file is included as part of p365 website and it takes care of sending information to iMat for customer engagement 
     */
    /**
     * Sending Bike Lead Deatails and Quote information to iMAT
     * This function been invoked from GetQuoteTemlateController.js and TwoWheelerResultController.js
     * @param {*} localStorageService 
     * @param {*} $scope 
     */
    function imatBikeLeadQuoteInfo(localStorageService, $scope, formEvent) {
        if(localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED")){
            var lastBikeQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=2";
        }else{
            var lastBikeQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("BIKE_UNIQUE_QUOTE_ID") + "&LOB=2";
        }

        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: lastBikeQuoteUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    firstname: localStorageService.get("quoteUserInfo").firstName,
                    lastname: localStorageService.get("quoteUserInfo").lastName,
                    email: localStorageService.get("quoteUserInfo").emailId,
                    mobile: localStorageService.get("quoteUserInfo").mobileNumber,
                    leadmsgid: messageIDVar,
                    company: 'NIBPLD2CSALE',
                    lob: 'bike',
                    lastquoteid: localStorageService.get("BIKE_UNIQUE_QUOTE_ID"),
                    lastbikequoteurl: responseData.data.shortURL,
                    bikename: localStorageService.get("selectedBikeDetails").displayVehicle,
                });
                submitEvent(formEvent);
            }
        });
    }

    function imatTravelLeadQuoteInfo(localStorageService, $scope, formEvent) {
        var lastTravelQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=5";
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: lastTravelQuoteUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    firstname: localStorageService.get("quoteUserInfo").firstName,
                    lastname: localStorageService.get("quoteUserInfo").lastName,
                    email: localStorageService.get("quoteUserInfo").emailId,
                    mobile: localStorageService.get("quoteUserInfo").mobileNumber,
                    leadmsgid: messageIDVar,
                    company: 'NIBPLD2CSALE',
                    lob: 'travel',
                    lastquoteid: localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"),
                    lasttravelquoteurl: responseData.data.shortURL,
                    triptype: localStorageService.get("travelDetails").tripType,
                    enddate: localStorageService.get("travelDetails").endDate,
                    startdate: localStorageService.get("travelDetails").startDate,
                    destinations: localStorageService.get("travelDetails").destinations,
                    suminsured: localStorageService.get("travelDetails").sumInsured,
                });
                submitEvent(formEvent);
            }
        });
    }


    function imatCarLeadQuoteInfo(localStorageService, $scope, formEvent) {
        if(localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED")){
            var lastCarQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=3";
        }else{
            var lastCarQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("CAR_UNIQUE_QUOTE_ID") + "&LOB=3";    
        }
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: lastCarQuoteUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    firstname: localStorageService.get("quoteUserInfo").firstName,
                    lastname: localStorageService.get("quoteUserInfo").lastName,
                    email: localStorageService.get("quoteUserInfo").emailId,
                    mobile: localStorageService.get("quoteUserInfo").mobileNumber,
                    leadmsgid: messageIDVar,
                    company: 'NIBPLD2CSALE',
                    lob: 'car',
                    lastquoteid: localStorageService.get("CAR_UNIQUE_QUOTE_ID"),
                    lastcarquoteurl: responseData.data.shortURL,
                    carname: localStorageService.get("selectedCarDetails").displayVehicle,
                });
                submitEvent(formEvent);
            }
        });
    }

    function imatHealthLeadQuoteInfo(localStorageService, $scope, formEvent) {
        if(localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED")){
            var lastHealthQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=4";
        }else{
            var lastHealthQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("HEALTH_UNIQUE_QUOTE_ID") + "&LOB=4";
        }
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: lastHealthQuoteUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    firstname: localStorageService.get("quoteUserInfo").firstName,
                    lastname: localStorageService.get("quoteUserInfo").lastName,
                    email: localStorageService.get("quoteUserInfo").emailId,
                    mobile: localStorageService.get("quoteUserInfo").mobileNumber,
                    leadmsgid: messageIDVar,
                    company: 'NIBPLD2CSALE',
                    lob: 'health',
                    lastquoteid: localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"),
                    lasthealthquoteurl: responseData.data.shortURL,
                    age: localStorageService.get("healthQuoteInputParamaters").quoteParam.selfAge,
                    gender: localStorageService.get("healthQuoteInputParamaters").quoteParam.selfGender,
                    zipcode: localStorageService.get("healthQuoteInputParamaters").personalInfo.pincode
                });
                submitEvent(formEvent);
            }
        });
    }

    function imatLifeLeadQuoteInfo(localStorageService, $scope, formEvent) {
        var lastLifeQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=1";
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: lastLifeQuoteUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    firstname: localStorageService.get("quoteUserInfo").firstName,
                    lastname: localStorageService.get("quoteUserInfo").lastName,
                    email: localStorageService.get("quoteUserInfo").emailId,
                    mobile: localStorageService.get("quoteUserInfo").mobileNumber,
                    leadmsgid: messageIDVar,
                    company: 'NIBPLD2CSALE',
                    lob: 'life',
                    lastquoteid: localStorageService.get("LIFE_UNIQUE_QUOTE_ID"),
                    lastlifequoteurl: responseData.data.shortURL,
                    age:localStorageService.get("lifeQuoteInputParamaters").quoteParam.age,
                    gender: localStorageService.get("lifeQuoteInputParamaters").quoteParam.gender,
                    income: localStorageService.get("lifeQuoteInputParamaters").quoteParam.annualIncome
                });
                submitEvent(formEvent);
            }
        });
    }

    function imatCriticalIllnessLeadQuoteInfo(localStorageService, $scope, formEvent) {
        var lastCriticalIllnessQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=6";
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: lastCriticalIllnessQuoteUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    firstname: localStorageService.get("quoteUserInfo").firstName,
                    lastname: localStorageService.get("quoteUserInfo").lastName,
                    email: localStorageService.get("quoteUserInfo").emailId,
                    mobile: localStorageService.get("quoteUserInfo").mobileNumber,
                    leadmsgid: messageIDVar,
                    company: 'NIBPLD2CSALE',
                    lob: 'criticalIllness',
                    lastquoteid: localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID"),
                    lastcriticalillnessquoteurl: responseData.data.shortURL,
                    age: localStorageService.get("criticalIllnessQuoteInputParamaters").age,
                    gender: localStorageService.get("criticalIllnessQuoteInputParamaters").gender,
                    sumInsured: localStorageService.get("criticalIllnessQuoteInputParamaters").sumInsured,
                });
                submitEvent(formEvent);
            }
        });
    }

    function imatProfessionalLeadQuoteInfo(localStorageService, $scope, formEvent) {

        var lastProfessionalQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("PROF_QUOTE_ID_ENCRYPTED") + "&LOB=0";

        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: lastProfessionalQuoteUrl }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    firstname: localStorageService.get("quoteUserInfo").firstName,
                    lastname: localStorageService.get("quoteUserInfo").lastName,
                    email: localStorageService.get("quoteUserInfo").emailId,
                    mobile: localStorageService.get("quoteUserInfo").mobileNumber,
                    leadmsgid: messageIDVar,
                    company: 'NIBPLD2CSALE',
                    lob: 'professionaljourney',
                    lastquoteid: localStorageService.get("PROF_QUOTE_ID"),
                    lastprofessionalquoteurl: responseData.data.shortURL,
                    professionalcode: $scope.quoteRequest.professionCode,
                    carname: $scope.carDetails.displayVehicle,
                    bikename: $scope.bikeDetails.displayVehicle,
                    age: $scope.commonInfo.age,
                    gender: $scope.commonInfo.gender,
                    income: $scope.commonInfo.incomeRange.annualIncome,
                    zipcode: $scope.commonInfo.address.pincode,

                });
                submitEvent(formEvent);
            }
        });
    }

    function imatBuyClicked(localStorageService, $scope, formEvent) {
        if ($scope.selectedProduct.insuranceCompany) {
            mt('send', 'pageview', {
                carriername: $scope.selectedProduct.insuranceCompany,
                carrierid: $scope.selectedProduct.carrierId,
                leadmsgid: messageIDVar
            });
        }
        if (formEvent) {
            submitEvent(formEvent);
        }
    }

    function imatBikeProposal(localStorageService, $scope, formEvent,callbackFunction) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2";
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: proposal_url }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)
                $scope.shortURLResponse= responseData;
                mt('send', 'pageview', {
                    bikeproposalid: $scope.proposalId,
                    proposalurl: responseData.data.shortURL,
                    leadmsgid: messageIDVar
                });
                  if (formEvent) {
                      submitEvent(formEvent);
                  }
                 callbackFunction($scope.shortURLResponse);
            }
        });
    }

    function imatTravelProposal(localStorageService, $scope, formEvent) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=5";
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: proposal_url }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    travelproposalid: $scope.proposalId,
                    proposalurl: responseData.data.shortURL,
                    leadmsgid: messageIDVar
                });
                if (formEvent) {
                    submitEvent(formEvent);
                }
            }
        });
    }

    function imatCarProposal(localStorageService, $scope, formEvent ,callbackFunction) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
        console.log('proposal url from imatCarProposal function : ',proposal_url);
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: proposal_url }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)
                $scope.shortURLResponse= responseData;
                mt('send', 'pageview', {
                    carproposalid: localStorageService.get("proposalIdEncrypted"),
                    proposalurl: responseData.data.shortURL,
                    leadmsgid: messageIDVar
                });
                if (formEvent) {
                    submitEvent(formEvent);
                }
                callbackFunction($scope.shortURLResponse);
            }
        });
    }

    function imatHealthProposal(localStorageService, $scope, formEvent,callbackFunction) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=4";
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: proposal_url }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)
                $scope.shortURLResponse= responseData;
                mt('send', 'pageview', {
                    healthproposalid: $scope.proposalId,
                    proposalurl: responseData.data.shortURL,
                    leadmsgid: messageIDVar
                });
                if (formEvent) {
                    submitEvent(formEvent);
                }
                callbackFunction($scope.shortURLResponse);
            }
        });
    }

    function imatLifeProposal(localStorageService, $scope, formEvent) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=1";
        $.ajax({
            url: getShortURLLink,
            type: "POST",
            data: JSON.stringify({ longURL: proposal_url }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(responseData) {
                console.log("data.shortURL", responseData.data.shortURL)

                mt('send', 'pageview', {
                    lifeproposalid: $scope.proposalId,
                    proposalurl: responseData.data.shortURL,
                    leadmsgid: messageIDVar
                });
                if (formEvent) {
                    submitEvent(formEvent);
                }
            }
        });
    }

    function imatShareQuote(localStorageService, $scope, formEvent) {

        mt('send', 'pageview', {
            leadmsgid: messageIDVar,
            additionalemail: $scope.EmailChoices[0].username,
            email: localStorageService.get("quoteUserInfo").emailId
        });
        if (formEvent) {
            submitEvent(formEvent);
        }
    }

    function imatEvent(formEvent) {
        submitEvent(formEvent);
    }
}