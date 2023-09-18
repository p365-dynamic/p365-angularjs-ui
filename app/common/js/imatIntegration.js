if (icrmEnabled == true || agencyPortalEnabled == true) {
    /** 
     * This file is included as part of p365 website and it takes care of sending information to iMat for customer engagement 
     */
    /**
     * Sending Bike Lead Deatails and Quote information to iMAT
     * This function been invoked from GetQuoteTemlateController.js and TwoWheelerResultController.js
     * @param {*} localStorageService 
     * @param {*} $scope 
     * @param {*} localStorage
     */

    function imatBikeLeadQuoteInfo(localStorageService, $scope, formEvent) {
        console.log('inside bikel ead quoteinfo',formEvent);
        if(localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED")){
            var lastBikeQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=2";
        }else{
            var lastBikeQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("BIKE_UNIQUE_QUOTE_ID") + "&LOB=2";
        }
        console.log('lastBikeQuoteUrl is::',lastBikeQuoteUrl);
        if(localStorageService.get("quoteUserInfo")){
        if (localStorageService.get("quoteUserInfo").firstName)
            $('#mauticform_input_crmintegrationleadform_first_name').val(localStorageService.get("quoteUserInfo").firstName);
        if (localStorageService.get("quoteUserInfo").lastName)
            $('#mauticform_input_crmintegrationleadform_last_name').val(localStorageService.get("quoteUserInfo").lastName);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (localStorageService.get("quoteUserInfo").mobileNumber)
            $('#mauticform_input_crmintegrationleadform_mobile').val(localStorageService.get("quoteUserInfo").mobileNumber);
        }
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("CallCentre");
        if (agencyPortalEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("agency");
        $('#mauticform_input_crmintegrationleadform_line_of_business').val("bike");
        if (localStorageService.get("BIKE_UNIQUE_QUOTE_ID"))
            $('#mauticform_input_crmintegrationleadform_last_quoteid').val(localStorageService.get("BIKE_UNIQUE_QUOTE_ID"));
        //if (localStorageService.get("BIKE_UNIQUE_QUOTE_ID_ENCRYPTED")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: lastBikeQuoteUrl }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    $scope.short_url=responseData.data.shortURL;
                    console.log("data.shortURL step 1", $scope.short_url);
                   // $('#mauticform_input_crmintegrationleadform_last_bike_quote_url').val(responseData.data.shortURL);
                   if ($scope.short_url)
                   $('#mauticform_input_crmintegrationleadform_last_bike_quote_url').val($scope.short_url);
                    if (localStorageService.get("selectedBikeDetails").displayVehicle)
                        $('#mauticform_input_crmintegrationleadform_bike_name').val(localStorageService.get("selectedBikeDetails").displayVehicle);
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                    if (agencyPortalEnabled == true) {
                        if (localStorage.getItem("finalLocalStorage")) {
                            var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                            $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                            $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                        }
                    }
            
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                   console.log('form event ',formEvent)
                        $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                    $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
                }
            });
       // }
     
    //    if ($scope.short_url)
    //    $('#mauticform_input_crmintegrationleadform_last_bike_quote_url').val($scope.short_url);
    //     if (localStorageService.get("selectedBikeDetails").displayVehicle)
    //         $('#mauticform_input_crmintegrationleadform_bike_name').val(localStorageService.get("selectedBikeDetails").displayVehicle);
    //     if (icrmEnabled == true)
    //         $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
    //     if (agencyPortalEnabled == true) {
    //         if (localStorage.getItem("finalLocalStorage")) {
    //             var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
    //             $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
    //             $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
    //         }
    //     }

    //     if (icrmEnabled == true)
    //         $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
    //    console.log('form event ',formEvent)
    //         $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
    //     $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    //     console.log("IN iQuote IMAT FUNCTTIIONNN clicked....");
    //     console.log(formEvent);
    }

    function imatTravelLeadQuoteInfo(localStorageService, $scope, formEvent) {
        var lastTravelQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=5";
        if(localStorageService.get("quoteUserInfo")){
        if (localStorageService.get("quoteUserInfo").firstName)
            $('#mauticform_input_crmintegrationleadform_first_name').val(localStorageService.get("quoteUserInfo").firstName);
        if (localStorageService.get("quoteUserInfo").lastName)
            $('#mauticform_input_crmintegrationleadform_last_name').val(localStorageService.get("quoteUserInfo").lastName);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (localStorageService.get("quoteUserInfo").mobileNumber)
            $('#mauticform_input_crmintegrationleadform_mobile').val(localStorageService.get("quoteUserInfo").mobileNumber);
        }
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("CallCentre");
        if (agencyPortalEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("agency");
        $('#mauticform_input_crmintegrationleadform_line_of_business').val("travel");
        if (localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"))
            $('#mauticform_input_crmintegrationleadform_last_quoteid').val(localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"));
        //if (localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID_ENCRYPTED")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: lastTravelQuoteUrl }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_last_travel_quote_url').val(responseData.data.shortURL);
                    if (localStorageService.get("travelDetails").destinations)
                    $('#mauticform_input_crmintegrationleadform_destinations').val(localStorageService.get("travelDetails").destinations);
                if (localStorageService.get("travelDetails").tripType)
                    $('#mauticform_input_crmintegrationleadform_triptype').val(localStorageService.get("travelDetails").tripType);
                if (localStorageService.get("travelDetails").startDate)
                    $('#mauticform_input_crmintegrationleadform_startdate').val(localStorageService.get("travelDetails").startDate);
                if (localStorageService.get("travelDetails").endDate)
                    $('#mauticform_input_crmintegrationleadform_enddate').val(localStorageService.get("travelDetails").endDate);
                if (localStorageService.get("travelDetails").sumInsured)
                    $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("travelDetails").sumInsured);
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                if (agencyPortalEnabled == true) {
                    if (localStorage.getItem("finalLocalStorage")) {
                        var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                        $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                    }
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                    $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                    $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
                }   

                }
            });
        //}
        // if (localStorageService.get("travelDetails").destinations)
        //     $('#mauticform_input_crmintegrationleadform_destinations').val(localStorageService.get("travelDetails").destinations);
        // if (localStorageService.get("travelDetails").tripType)
        //     $('#mauticform_input_crmintegrationleadform_triptype').val(localStorageService.get("travelDetails").tripType);
        // if (localStorageService.get("travelDetails").startDate)
        //     $('#mauticform_input_crmintegrationleadform_startdate').val(localStorageService.get("travelDetails").startDate);
        // if (localStorageService.get("travelDetails").endDate)
        //     $('#mauticform_input_crmintegrationleadform_enddate').val(localStorageService.get("travelDetails").endDate);
        // if (localStorageService.get("travelDetails").sumInsured)
        //     $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("travelDetails").sumInsured);
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        // if (agencyPortalEnabled == true) {
        //     if (localStorage.getItem("finalLocalStorage")) {
        //         var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
        //         $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
        //     }
        //     if (icrmEnabled == true)
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        //     $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        //     $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
        // }
    }

    function imatCriticalIllnessLeadQuoteInfo(localStorageService, $scope, formEvent) {
        var lastCriticalIllnessQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=6";
        console.log('IN iQuote IMAT function CriticalIllness leadquoteinfo');
        if (localStorageService.get("quoteUserInfo").firstName)
            $('#mauticform_input_crmintegrationleadform_first_name').val(localStorageService.get("quoteUserInfo").firstName);
        if (localStorageService.get("quoteUserInfo").lastName)
            $('#mauticform_input_crmintegrationleadform_last_name').val(localStorageService.get("quoteUserInfo").lastName);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (localStorageService.get("quoteUserInfo").mobileNumber)
            $('#mauticform_input_crmintegrationleadform_mobile').val(localStorageService.get("quoteUserInfo").mobileNumber);
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("CallCentre");
        if (agencyPortalEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("agency");
        $('#mauticform_input_crmintegrationleadform_line_of_business').val("criticalIllness");
        if (localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID"))
            $('#mauticform_input_crmintegrationleadform_last_quoteid').val(localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID"));
        //if (localStorageService.get("CRITICAL_ILLNESS_UNIQUE_QUOTE_ID_ENCRYPTED")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: lastCriticalIllnessQuoteUrl }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_last_critical_quote_url').val(responseData.data.shortURL);
                    if (localStorageService.get("criticalIllnessQuoteInputParamaters").sumInsured)
                    $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("criticalIllnessQuoteInputParamaters").sumInsured);
                if (localStorageService.get("criticalIllnessQuoteInputParamaters").age)
                    $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("criticalIllnessQuoteInputParamaters").age);
                if (localStorageService.get("criticalIllnessQuoteInputParamaters").gender)
                    $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("criticalIllnessQuoteInputParamaters").gender);
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                if (agencyPortalEnabled == true) {
                    if (localStorage.getItem("finalLocalStorage")) {
                        var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                        $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                    }
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                    $('#mauticform_input_crmintegrationleadform_formevent').val(formEvent);
                    $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
                }


                }
            });
        //}
        // if (localStorageService.get("criticalIllnessQuoteInputParamaters").sumInsured)
        //     $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("criticalIllnessQuoteInputParamaters").sumInsured);
        // if (localStorageService.get("criticalIllnessQuoteInputParamaters").age)
        //     $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("criticalIllnessQuoteInputParamaters").age);
        // if (localStorageService.get("criticalIllnessQuoteInputParamaters").gender)
        //     $('#mauticform_input_crmintegrationleadform_suminsured').val(localStorageService.get("criticalIllnessQuoteInputParamaters").gender);
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        // if (agencyPortalEnabled == true) {
        //     if (localStorage.getItem("finalLocalStorage")) {
        //         var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
        //         $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
        //     }
        //     if (icrmEnabled == true)
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        //     $('#mauticform_input_crmintegrationleadform_formevent').val(formEvent);
        //     $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
        // }
    }

    function imatCarLeadQuoteInfo(localStorageService, $scope, formEvent) {
        console.log('inside car',formEvent);
        if(localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED")){
            var lastCarQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=3";
        }else{
            var lastCarQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("CAR_UNIQUE_QUOTE_ID") + "&LOB=3";    
        }
        console.log('lastCarQuoteUrl is::',lastCarQuoteUrl);
        console.log('Log in iMATIntegration****', formEvent);
        if(localStorageService.get("quoteUserInfo")){
        if (localStorageService.get("quoteUserInfo").firstName)
            $('#mauticform_input_crmintegrationleadform_first_name').val(localStorageService.get("quoteUserInfo").firstName);
        if (localStorageService.get("quoteUserInfo").lastName)
            $('#mauticform_input_crmintegrationleadform_last_name').val(localStorageService.get("quoteUserInfo").lastName);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (localStorageService.get("quoteUserInfo").mobileNumber)
            $('#mauticform_input_crmintegrationleadform_mobile').val(localStorageService.get("quoteUserInfo").mobileNumber);
        }
            if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("CRM");
        if (agencyPortalEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("agency");
        $('#mauticform_input_crmintegrationleadform_line_of_business').val("car");
        if (localStorageService.get("CAR_UNIQUE_QUOTE_ID"))
            $('#mauticform_input_crmintegrationleadform_last_quoteid').val(localStorageService.get("CAR_UNIQUE_QUOTE_ID"));
        //if (localStorageService.get("CAR_UNIQUE_QUOTE_ID_ENCRYPTED")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: lastCarQuoteUrl }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_last_car_quote_url').val(responseData.data.shortURL);
                    if (localStorageService.get("selectedCarDetails").displayVehicle)
                    $('#mauticform_input_crmintegrationleadform_car_name').val(localStorageService.get("selectedCarDetails").displayVehicle);
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                if (agencyPortalEnabled == true) {
                    if (localStorage.getItem("finalLocalStorage")) {
                        var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                        $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                    }
                }
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                console.log(' Log in iMATIntegration1', formEvent);
                $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                console.log('Log in iMATIntegration22', formEvent);
                $('#mauticform_input_crmintegrationleadform_submit').trigger('click');


                }
            });
       // }
        // if (localStorageService.get("selectedCarDetails").displayVehicle)
        //     $('#mauticform_input_crmintegrationleadform_car_name').val(localStorageService.get("selectedCarDetails").displayVehicle);
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        // if (agencyPortalEnabled == true) {
        //     if (localStorage.getItem("finalLocalStorage")) {
        //         var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
        //         $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
        //     }
        // }
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        // console.log('Gauri Log in iMATIntegration11', formEvent);
        // $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        // console.log('Gauri Log in iMATIntegration22', formEvent);
        // $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }

    function imatHealthLeadQuoteInfo(localStorageService, $scope, formEvent) {
        if(localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED")){
            var lastHealthQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=4";
        }else{
            var lastHealthQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("HEALTH_UNIQUE_QUOTE_ID") + "&LOB=4";
        }
        if(localStorageService.get("quoteUserInfo")){
        if (localStorageService.get("quoteUserInfo").firstName)
            $('#mauticform_input_crmintegrationleadform_first_name').val(localStorageService.get("quoteUserInfo").firstName);
        if (localStorageService.get("quoteUserInfo").lastName)
            $('#mauticform_input_crmintegrationleadform_last_name').val(localStorageService.get("quoteUserInfo").lastName);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (localStorageService.get("quoteUserInfo").mobileNumber)
            $('#mauticform_input_crmintegrationleadform_mobile').val(localStorageService.get("quoteUserInfo").mobileNumber);
        }
            if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("CRM");
        if (agencyPortalEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("agency");
        $('#mauticform_input_crmintegrationleadform_line_of_business').val("health");
        if (localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"))
            $('#mauticform_input_crmintegrationleadform_last_quoteid').val(localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"));
       // if (localStorageService.get("HEALTH_UNIQUE_QUOTE_ID_ENCRYPTED")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: lastHealthQuoteUrl }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_last_health_quote_url').val(responseData.data.shortURL);
                    if(localStorageService.get("healthQuoteInputParamaters")){
                        if (localStorageService.get("healthQuoteInputParamaters").quoteParam)
                            $('#mauticform_input_crmintegrationleadform_age').val(localStorageService.get("healthQuoteInputParamaters").quoteParam.selfAge);
                        if (localStorageService.get("healthQuoteInputParamaters").quoteParam)
                            $('#mauticform_input_crmintegrationleadform_gender').val(localStorageService.get("healthQuoteInputParamaters").quoteParam.selfGender);
                        }
                        if (localStorageService.get("healthQuoteInputParamaters").personalInfo)
                            $('#mauticform_input_crmintegrationleadform_pincode').val(localStorageService.get("healthQuoteInputParamaters").personalInfo.pincode);
                        if (messageIDVar)
                            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
                        if (icrmEnabled == true)
                            $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                        if (agencyPortalEnabled == true) {
                            if (localStorage.getItem("finalLocalStorage")) {
                                var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                                $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                                $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                            }
                        }
                        if (icrmEnabled == true)
                            $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                        $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                        $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
                 

                }
            });
       // }
    //     if(localStorageService.get("healthQuoteInputParamaters")){
    //     if (localStorageService.get("healthQuoteInputParamaters").quoteParam)
    //         $('#mauticform_input_crmintegrationleadform_age').val(localStorageService.get("healthQuoteInputParamaters").quoteParam.selfAge);
    //     if (localStorageService.get("healthQuoteInputParamaters").quoteParam)
    //         $('#mauticform_input_crmintegrationleadform_gender').val(localStorageService.get("healthQuoteInputParamaters").quoteParam.selfGender);
    //     }
    //     if (localStorageService.get("healthQuoteInputParamaters").personalInfo)
    //         $('#mauticform_input_crmintegrationleadform_pincode').val(localStorageService.get("healthQuoteInputParamaters").personalInfo.pincode);
    //     if (messageIDVar)
    //         $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
    //     if (icrmEnabled == true)
    //         $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
    //     if (agencyPortalEnabled == true) {
    //         if (localStorage.getItem("finalLocalStorage")) {
    //             var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
    //             $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
    //             $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
    //         }
    //     }
    //     if (icrmEnabled == true)
    //         $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
    //     $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
    //     $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
     }

    function imatLifeLeadQuoteInfo(localStorageService, $scope, formEvent) {
        var lastLifeQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED") + "&LOB=1";
        if (localStorageService.get("quoteUserInfo").firstName)
            $('#mauticform_input_crmintegrationleadform_first_name').val(localStorageService.get("quoteUserInfo").firstName);
        if (localStorageService.get("quoteUserInfo").lastName)
            $('#mauticform_input_crmintegrationleadform_last_name').val(localStorageService.get("quoteUserInfo").lastName);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (localStorageService.get("quoteUserInfo").mobileNumber)
            $('#mauticform_input_crmintegrationleadform_mobile').val(localStorageService.get("quoteUserInfo").mobileNumber);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("CRM");
        if (agencyPortalEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("agency");
        $('#mauticform_input_crmintegrationleadform_line_of_business').val("life");
        if (localStorageService.get("LIFE_UNIQUE_QUOTE_ID"))
            $('#mauticform_input_crmintegrationleadform_last_quoteid').val(localStorageService.get("LIFE_UNIQUE_QUOTE_ID"));
       // if (localStorageService.get("LIFE_UNIQUE_QUOTE_ID_ENCRYPTED")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: lastLifeQuoteUrl }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_last_life_quote_url').val(responseData.data.shortURL);
                    if ($scope.quoteParam.age)
                    $('#mauticform_input_crmintegrationleadform_age').val($scope.quoteParam.age);
                if ($scope.quoteParam.gender)
                    $('#mauticform_input_crmintegrationleadform_gender').val($scope.quoteParam.gender);
                if ($scope.quoteParam.annualIncome)
                    $('#mauticform_input_crmintegrationleadform_line_of_income').val($scope.quoteParam.annualIncome);
                if (messageIDVar)
                    $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                if (agencyPortalEnabled == true) {
                    if (localStorage.getItem("finalLocalStorage")) {
                        var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                        $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                    }
                }
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                $('#mauticform_input_crmintegrationleadform_submit').trigger('click');


                }
            });
       // }
        // if ($scope.quoteParam.age)
        //     $('#mauticform_input_crmintegrationleadform_age').val($scope.quoteParam.age);
        // if ($scope.quoteParam.gender)
        //     $('#mauticform_input_crmintegrationleadform_gender').val($scope.quoteParam.gender);
        // if ($scope.quoteParam.annualIncome)
        //     $('#mauticform_input_crmintegrationleadform_line_of_income').val($scope.quoteParam.annualIncome);
        // if (messageIDVar)
        //     $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        // if (agencyPortalEnabled == true) {
        //     if (localStorage.getItem("finalLocalStorage")) {
        //         var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
        //         $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
        //     }
        // }
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        // $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        // $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }

    function imatProfessionalLeadQuoteInfo(localStorageService, $scope, formEvent) {
        var lastProfessionalQuoteUrl = "" + shareQuoteLink + "" + localStorageService.get("PROF_QUOTE_ID_ENCRYPTED") + "&LOB=0";
        if (localStorageService.get("quoteUserInfo").firstName)
            $('#mauticform_input_crmintegrationleadform_first_name').val(localStorageService.get("quoteUserInfo").firstName);
        if (localStorageService.get("quoteUserInfo").lastName)
            $('#mauticform_input_crmintegrationleadform_last_name').val(localStorageService.get("quoteUserInfo").lastName);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (localStorageService.get("quoteUserInfo").mobileNumber)
            $('#mauticform_input_crmintegrationleadform_mobile').val(localStorageService.get("quoteUserInfo").mobileNumber);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("CRM");
        if (agencyPortalEnabled == true)
            $('#mauticform_input_crmintegrationleadform_company').val("agency");
        $('#mauticform_input_crmintegrationleadform_line_of_business').val("professionaljourney");
        if (localStorageService.get("PROF_QUOTE_ID"))
            $('#mauticform_input_crmintegrationleadform_last_quoteid').val(localStorageService.get("PROF_QUOTE_ID"));
        if (localStorageService.get("PROF_QUOTE_ID_ENCRYPTED")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: lastProfessionalQuoteUrl }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_last_professional_quote_u').val(responseData.data.shortURL);
                    if ($scope.quoteRequest && $scope.quoteRequest.professionCode)
                    $('#mauticform_input_crmintegrationleadform_professional_code').val($scope.quoteRequest.professionCode);
                if ($scope.carDetails && $scope.carDetails.displayVehicle)
                    $('#mauticform_input_crmintegrationleadform_car_name').val($scope.carDetails.displayVehicle);
                if ($scope.bikeDetails && $scope.bikeDetails.displayVehicle)
                    $('#mauticform_input_crmintegrationleadform_bike_name').val($scope.bikeDetails.displayVehicle);
                // IF COMMON INFO IS PRESENT THEN TAKE THIS VALUES 
                if ($scope.commonInfo) {
                    if ($scope.commonInfo.age)
                        $('#mauticform_input_crmintegrationleadform_age').val($scope.commonInfo.age);
                    if ($scope.commonInfo.gender)
                        $('#mauticform_input_crmintegrationleadform_gender').val($scope.commonInfo.gender);
                    if ($scope.commonInfo.incomeRange && $scope.commonInfo.incomeRange.annualIncome)
                        $('#mauticform_input_crmintegrationleadform_income').val($scope.commonInfo.incomeRange.annualIncome);
                    if ($scope.commonInfo.address && $scope.commonInfo.address.pincode)
                        $('#mauticform_input_crmintegrationleadform_pincode').val($scope.commonInfo.address.pincode);
                } // ($scope.commonInfo ends 
                if (messageIDVar)
                    $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                if (agencyPortalEnabled == true) {
                    if (localStorage.getItem("finalLocalStorage")) {
                        var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                        $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                    }
                }
                if (icrmEnabled == true)
                    $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
        
                    
                }
            });
        }
        // if ($scope.quoteRequest && $scope.quoteRequest.professionCode)
        //     $('#mauticform_input_crmintegrationleadform_professional_code').val($scope.quoteRequest.professionCode);
        // if ($scope.carDetails && $scope.carDetails.displayVehicle)
        //     $('#mauticform_input_crmintegrationleadform_car_name').val($scope.carDetails.displayVehicle);
        // if ($scope.bikeDetails && $scope.bikeDetails.displayVehicle)
        //     $('#mauticform_input_crmintegrationleadform_bike_name').val($scope.bikeDetails.displayVehicle);
        // // IF COMMON INFO IS PRESENT THEN TAKE THIS VALUES 
        // if ($scope.commonInfo) {
        //     if ($scope.commonInfo.age)
        //         $('#mauticform_input_crmintegrationleadform_age').val($scope.commonInfo.age);
        //     if ($scope.commonInfo.gender)
        //         $('#mauticform_input_crmintegrationleadform_gender').val($scope.commonInfo.gender);
        //     if ($scope.commonInfo.incomeRange && $scope.commonInfo.incomeRange.annualIncome)
        //         $('#mauticform_input_crmintegrationleadform_income').val($scope.commonInfo.incomeRange.annualIncome);
        //     if ($scope.commonInfo.address && $scope.commonInfo.address.pincode)
        //         $('#mauticform_input_crmintegrationleadform_pincode').val($scope.commonInfo.address.pincode);
        // } // ($scope.commonInfo ends 
        // if (messageIDVar)
        //     $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        // if (agencyPortalEnabled == true) {
        //     if (localStorage.getItem("finalLocalStorage")) {
        //         var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
        //         $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
        //     }
        // }
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        // $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        // $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }

    function imatBuyClicked(localStorageService, $scope, formEvent) {
        if ($scope.selectedProduct.insuranceCompany)
            $('#mauticform_input_crmintegrationleadform_carrier_name').val($scope.selectedProduct.insuranceCompany);
        if ($scope.selectedProduct.carrierId)
            $('#mauticform_input_crmintegrationleadform_carrier_id').val($scope.selectedProduct.carrierId);
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        if (agencyPortalEnabled == true) {
            if (localStorage.getItem("finalLocalStorage")) {
                var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
            }
        }
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }

    function imatBikeProposal(localStorageService, $scope, formEvent, callbackFunction) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=2";
        if ($scope.proposalId)
            $('#mauticform_input_crmintegrationleadform_bike_proposal_id').val($scope.proposalId);
        if (localStorageService.get("proposalIdEncrypted")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: proposal_url }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    $scope.shortURLResponse = responseData;
                    console.log("data.shortURL", responseData.data.shortURL)

                    $('#mauticform_input_crmintegrationleadform_proposal_url').val(responseData.data.shortURL);
                    if (messageIDVar)
                        $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                    if (agencyPortalEnabled == true) {
                        if (localStorage.getItem("finalLocalStorage")) {
                            var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                            $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                            $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                        }
                    }
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                    $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                    $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
                    callbackFunction($scope.shortURLResponse);
                }
            });
        } else {
            if (messageIDVar)
                $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
            if (icrmEnabled == true)
                $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
            if (agencyPortalEnabled == true) {
                if (localStorage.getItem("finalLocalStorage")) {
                    var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                    $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                    $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                }
            }
            if (icrmEnabled == true)
                $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
            $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
            $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
            console.log('$scope.shortURLResponse in else part bike imautic function', $scope.shortURLResponse);
            $scope.shortURLResponse = {};
            callbackFunction($scope.shortURLResponse);
        }
    }

    function imatCarProposal(localStorageService, $scope, formEvent, callbackFunction) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=3";
        if ($scope.proposalId)
            $('#mauticform_input_crmintegrationleadform_car_proposal_id').val($scope.proposalId);
        if (localStorageService.get("proposalIdEncrypted")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: proposal_url }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $scope.shortURLResponse = responseData;
                    $('#mauticform_input_crmintegrationleadform_proposal_url').val(responseData.data.shortURL);
                    if (messageIDVar)
                        $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                    if (agencyPortalEnabled == true) {
                        if (localStorage.getItem("finalLocalStorage")) {
                            var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                            $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                            $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                        }
                    }
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                    $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                    $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
                    callbackFunction($scope.shortURLResponse);
                }
            });
        } else {
            if (messageIDVar)
                $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
            if (icrmEnabled == true)
                $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
            if (agencyPortalEnabled == true) {
                if (localStorage.getItem("finalLocalStorage")) {
                    var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                    $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                    $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                }
            }
            if (icrmEnabled == true)
                $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
            $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
            $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
            $scope.shortURLResponse = {};
            callbackFunction($scope.shortURLResponse);
        }
        // if (messageIDVar)
        //     $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        // if (agencyPortalEnabled == true) {
        //     if (localStorage.getItem("finalLocalStorage")) {
        //         var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
        //         $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
        //         $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
        //     }
        // }
        // if (icrmEnabled == true)
        //     $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        // $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        // $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
        // callbackFunction($scope.shortURLResponse);
    }

    function imatCriticalIllnessProposal(localStorageService, $scope, formEvent) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=6";
        if ($scope.proposalId)
            $('#mauticform_input_crmintegrationleadform_travel_proposal_id').val($scope.proposalId);
        if (localStorageService.get("proposalIdEncrypted")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: proposal_url }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_proposal_url').val(responseData.data.shortURL);
                }
            });
        }
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        if (agencyPortalEnabled == true) {
            if (localStorage.getItem("finalLocalStorage")) {
                var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
            }
        }
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        $('#mauticform_input_crmintegrationleadform_formevent').val(formEvent);
        $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }


    function imatHealthProposal(localStorageService, $scope, formEvent, callbackFunction) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=4";
        if ($scope.proposalId)
            $('#mauticform_input_crmintegrationleadform_health_proposal_id').val($scope.proposalId);
        if (localStorageService.get("proposalIdEncrypted")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: proposal_url }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL);
                    $scope.shortURLResponse = responseData;
                    $('#mauticform_input_crmintegrationleadform_proposal_url').val(responseData.data.shortURL);
                    if (messageIDVar)
                        $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
                    if (agencyPortalEnabled == true) {
                        if (localStorage.getItem("finalLocalStorage")) {
                            var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                            $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                            $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                        }
                    }
                    if (icrmEnabled == true)
                        $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
                    $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
                    $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
                    callbackFunction($scope.shortURLResponse);
                }
            });
        } else {
            if (messageIDVar)
                $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
            if (icrmEnabled == true)
                $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
            if (agencyPortalEnabled == true) {
                if (localStorage.getItem("finalLocalStorage")) {
                    var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                    $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                    $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
                }
            }
            if (icrmEnabled == true)
                $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
            $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
            $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
            $scope.shortURLResponse = {};
            callbackFunction($scope.shortURLResponse);
        }
    }

    function imatLifeProposal(localStorageService, $scope, formEvent) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=1";
        if ($scope.proposalId)
            $('#mauticform_input_crmintegrationleadform_life_proposal_id').val($scope.proposalId);
        if (localStorageService.get("proposalIdEncrypted")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: proposal_url }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_proposal_url').val(responseData.data.shortURL);
                }
            });
        }
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        if (agencyPortalEnabled == true) {
            if (localStorage.getItem("finalLocalStorage")) {
                var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
            }
        }
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }

    function imatTravelProposal(localStorageService, $scope, formEvent) {
        var proposal_url = "" + sharePaymentLink + "" + localStorageService.get("proposalIdEncrypted") + "&lob=5";
        if ($scope.proposalId)
            $('#mauticform_input_crmintegrationleadform_travel_proposal_id').val($scope.proposalId);
        if (localStorageService.get("proposalIdEncrypted")) {
            $.ajax({
                url: getShortURLLink,
                type: "POST",
                data: JSON.stringify({ longURL: proposal_url }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(responseData) {
                    console.log("data.shortURL", responseData.data.shortURL)
                    $('#mauticform_input_crmintegrationleadform_proposal_url').val(responseData.data.shortURL);
                }
            });
        }
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        if (agencyPortalEnabled == true) {
            if (localStorage.getItem("finalLocalStorage")) {
                var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
            }
        }
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }

    function imatShareQuote(localStorageService, $scope, formEvent) {
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if ($scope.EmailChoices[0].username)
            $('#mauticform_input_crmintegrationleadform_additional_email').val($scope.EmailChoices[0].username);
        if (localStorageService.get("quoteUserInfo").emailId)
            $('#mauticform_input_crmintegrationleadform_email').val(localStorageService.get("quoteUserInfo").emailId);
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agency_id').val("CallCentre");
        if (agencyPortalEnabled == true) {
            if (localStorage.getItem("finalLocalStorage")) {
                var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
            }
        }
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }

    function imatEvent(formEvent) {
        if (messageIDVar)
            $('#mauticform_input_crmintegrationleadform_leadmsgid').val(messageIDVar);
        if (agencyPortalEnabled == true) {
            if (localStorage.getItem("finalLocalStorage")) {
                var agency = JSON.parse(localStorage.getItem("finalLocalStorage"));
                $('#mauticform_input_crmintegrationleadform_agency_id').val(agency.agencyId);
                $('#mauticform_input_crmintegrationleadform_agent_name').val(agency.username);
            }
        }
        if (icrmEnabled == true)
            $('#mauticform_input_crmintegrationleadform_agent_name').val(JSON.parse(localStorage.getItem("loggedInUser")));
        $('#mauticform_input_crmintegrationleadform_sub_stage').val(formEvent);
        $('#mauticform_input_crmintegrationleadform_submit').trigger('click');
    }
}