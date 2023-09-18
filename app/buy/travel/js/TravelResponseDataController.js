/*
 * Description	: This controller file for car proposal response data result.
 * Author		: Akash Kumawat
 * Date			: 25 JUNE 2018
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */
var messageIDVar;
angular.module('proposalresdatatravel', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('proposalResponseDataTravelController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce) {
        //Constants are declared here 
        var SELF = "Self";
        var SPOUSE = "Spouse";
        var SON = "Son";
        var DAUGHTER = "Daughter";
        var DATE_FORMAT = "dd/mm/yy";
        var FATHER = "Father";
        var MOTHER = "Mother";
        var FEMALE = "Female";
        var MALE = "Male";
        var SINGLE = "SINGLE";
        var MARRIED = "MARRIED";
        var EMPTY = "";
        loadDatbase(function() {
            $scope.travelProposalSectionHTML = wp_path + 'buy/travel/html/TravelProposalSection.html';
            $http.get(wp_path + 'ApplicationLabels.json').then(function(applicationCommonLabels) {
                $scope.globalLabel = applicationCommonLabels.data.globalLabels;
                localStorageService.set("applicationLabels", applicationCommonLabels.data);
                $rootScope.loaderContent = {
                    businessLine: '5',
                    header: 'Travel Insurance',
                    desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.travel.proverbBuyProduct)
                };
                $rootScope.title = $scope.globalLabel.policies365Title.travelBuyQuote;
                $rootScope.loading = true;

                $scope.proposalFormValid = true;


                //$scope level flags 
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = false;
                $scope.screenThreeStatus = false;
                $scope.isAddressSameAsCommun = true;

                // $scope level JSON objects or variables default values
                $scope.accordion = 1;
                $scope.numberOfTravellers = getList(1);

                // Generic assignments of required fields
                $scope.genderType = genderTypeGeneric;
                $scope.preDiseaseStatus = preDiseaseStatusGeneric;
                $scope.maritalStatusType = maritalStatusListGeneric;
                $scope.undertakingList = religareUndertakingList;
                $scope.medicalQuestionarrier = QuestionListGen;
                $scope.monthList = healthmonthListGeneric;
                $scope.relationType = travelGeneric;
                $scope.nomineeRelationType = nomineeRelationTypeGeneric;
                $scope.appointeeRelationType = nomineeRelationTypeGeneric;
                $scope.currencySymbols = currencySymbolList;


                // $scope level JSON objects declaration for further use.
                $scope.proposalStatus = {};
                $scope.proposerDetails = {};
                $scope.proposerDetails.permanentAddress = {};
                $scope.communicationAddress = {};
                $scope.permanentAddressDetails = {};
                $scope.insuredTravellerDetails = {};
                $scope.insuredDetails = {};
                $scope.nominationDetails = {};
                $scope.travelProposalApp = {};
                $scope.tripDetails = {};
                $scope.quoteParam = {};
                $scope.declarationDetails = [];
                $scope.travelDetails = {};
                $scope.authenticate = {};
                $scope.travelProposalResponse = {};
                $scope.paymentResponse = {};
                $scope.travelPolicyResponse = {};
                $scope.nomineeDetails = {};
                $scope.nomineeDetails.apointeeDetails = {};
                $scope.selectedProduct = {};
                $scope.quoteUserInfo = {};
                $scope.premiumDetails = {};
                $scope.medicalInfo = {};
                $scope.medicalInfo.medicalQuestionarrie = [];
                $scope.masterDiseaseDetails = {};

                //$scope level lists
                $scope.storedDOBs = [];
                $scope.storedGenders = [];

                // Function is used to reset Communication address
                $scope.resetCommunicationAddress = function() {
                    if (String($scope.communicationAddress.addressLine) == $scope.globalLabel.errorMessage.undefinedError || $scope.communicationAddress.addressLine.length == 0) {
                        $scope.communicationAddress.pincode = EMPTY;
                        $scope.communicationAddress.state = EMPTY;
                        $scope.communicationAddress.city = EMPTY;
                    }
                };

                // Function is used to reset Permanent address
                $scope.resetPermenentAddress = function() {
                    if (String($scope.permanentAddressDetails.address) == $scope.globalLabel.errorMessage.undefinedError || $scope.permanentAddressDetails.addressLine.length == 0) {
                        $scope.permanentAddressDetails.pincode = EMPTY;
                        $scope.permanentAddressDetails.state = EMPTY;
                        $scope.permanentAddressDetails.city = EMPTY;
                    }
                };

                // Function is used to change Permanent address
                $scope.changePermentAddress = function() {
                    if ($scope.isAddressSameAsCommun) {
                        $scope.permanentAddressDetails = $scope.communicationAddress;
                    } else {
                        $scope.permanentAddressDetails.houseNo = EMPTY;
                        $scope.permanentAddressDetails.pincode = EMPTY;
                        $scope.permanentAddressDetails.state = EMPTY;
                        $scope.permanentAddressDetails.stateCode = EMPTY;
                        $scope.permanentAddressDetails.cityCode = EMPTY;
                        $scope.permanentAddressDetails.city = EMPTY;
                        $scope.permanentAddressDetails.addressLine = EMPTY;
                    }
                    $scope.proposerDetails.permanentAddress = $scope.permanentAddressDetails;
                };

                $scope.proposalInfo = function() {

                    var proposalReq = travelProposalRequestDef;

                    //premiumDetails
                    proposalReq.premiumDetails = angular.copy(localStorageService.get("selectedProduct"));
                    //				proposalReq.premiumDetails.sumInsuredCurrency = proposalReq.premiumDetails.sumInsuredCurrencySymbol;
                    proposalReq.premiumDetails.sumInsuredCurrencySymbol = proposalReq.premiumDetails.sumInsuredCurrencySymbol;

                    //proposerDetails 
                    proposalReq.proposerDetails.salutation = findSalutation($scope.proposerDetails.gender);
                    proposalReq.proposerDetails.firstName = $scope.proposerDetails.firstName;
                    proposalReq.proposerDetails.lastName = $scope.proposerDetails.lastName;
                    proposalReq.proposerDetails.dateOfBirth = $scope.proposerDetails.dateOfBirth;
                    proposalReq.proposerDetails.gender = $scope.proposerDetails.gender;
                    proposalReq.proposerDetails.mobileNumber = $scope.proposerDetails.mobileNumber;
                    proposalReq.proposerDetails.emailId = $scope.proposerDetails.emailId;
                    proposalReq.proposerDetails.maritalStatus = $scope.proposerDetails.maritalStatus;
                    if ($scope.proposerDetails.occupation) {
                        proposalReq.proposerDetails.occupation = $scope.proposerDetails.occupation;
                    }
                    if ($scope.proposerDetails.purposeOfVisit) {
                        proposalReq.proposerDetails.purposeOfVisit = $scope.proposerDetails.purposeOfVisit;
                    }
                    proposalReq.proposerDetails.communicationAddress = $scope.communicationAddress;
                    if ($scope.isAddressSameAsCommun) {
                        proposalReq.proposerDetails.isCommuniationAddressSameAsPermanant = "Y";
                        $scope.changePermentAddress();
                        proposalReq.proposerDetails.permanantAddress = $scope.proposerDetails.permanentAddress;
                    } else {
                        proposalReq.proposerDetails.isCommuniationAddressSameAsPermanant = "N";
                        proposalReq.proposerDetails.permanantAddress = $scope.permanentAddressDetails;

                    }

                    //travelDetails
                    proposalReq.travelDetails = localStorageService.get("travelDetails");
                    if (proposalReq.travelDetails.tripType = 'single') {
                        proposalReq.travelDetails.tripDuration = 0;
                    }
                    //travellerDetails
                    var travellers = localStorageService.get("selectedTravellersForTravel");
                    for (var j = 0; j < travellers.length; j++) {
                        var travellerDetail = {};
                        var nomineeDetail = {};
                        var appointeeDetail = {};
                        travellerDetail.traveller_id = travellers[j].traveller_id;
                        travellerDetail.salutation = findSalutation(travellers[j].gender);
                        travellerDetail.firstName = travellers[j].firstName;
                        travellerDetail.lastName = travellers[j].lastName;
                        travellerDetail.dateOfBirth = travellers[j].dob;
                        travellerDetail.gender = travellers[j].gender;
                        travellerDetail.passportNo = travellers[j].passportNo.toUpperCase();

                        /*
                         * will add these details letter as per required
                         * travellerDetail.mobileNo		=	EMPTY;
                         * travellerDetail.emailId		=	EMPTY; 
                         * ravellerDetail.aadharNo		=	EMPTY;
                         * travellerDetail.pancardNo	=	EMPTY;*/
                        travellerDetail.relation = travellers[j].relation;
                        nomineeDetail.firstName = travellers[j].nomineeDetails.firstName;
                        nomineeDetail.lastName = travellers[j].nomineeDetails.lastName;
                        nomineeDetail.dateOfBirth = travellers[j].nomineeDetails.dateOfBirth;
                        //nomineeDetail.gender		=   EMPTY;
                        nomineeDetail.relation = travellers[j].nomineeDetails.relation;
                        if (travellers[j].nomineeAge < 18) {
                            appointeeDetail.firstName = travellers[j].nomineeDetails.apointeeDetails.firstName;
                            appointeeDetail.lastName = travellers[j].nomineeDetails.apointeeDetails.lastName;
                            appointeeDetail.dateOfBirth = travellers[j].nomineeDetails.apointeeDetails.dateOfBirth;
                            //appointeeDetail.gender      = 	EMPTY;
                            appointeeDetail.relation = travellers[j].nomineeDetails.apointeeDetails.relation;
                            travellerDetail.appointeeDetails = {};
                        }
                        travellerDetail.nomineeDetails = nomineeDetail;
                        if (travellers[j].nomineeAge < 18)
                            travellerDetail.appointeeDetails = appointeeDetail;

                        //medical details
                        proposalReq.medicalQuestionarrie = $scope.medicalInfo.medicalQuestionarrie;
                        var preExistingDieases = '';
                        var diseaseDetails = [];

                        for (var l = 0; l < travellers[j].carrierMedicalQuestion.length; l++) {
                            if (travellers[j].carrierMedicalQuestion[l] == null || travellers[j].carrierMedicalQuestion[l] == undefined ||
                                String(travellers[j].carrierMedicalQuestion[l]) == $scope.globalLabel.errorMessage.undefinedError) {
                                travellers[j].carrierMedicalQuestion.splice(l, 1);
                                l = l - 1;
                            }
                        }
                        for (var k = 0; k < $scope.medicalInfo.medicalQuestionarrie.length; k++) {
                            if (!$scope.medicalInfo.medicalQuestionarrie[k].applicable) {
                                if ($scope.medicalInfo.medicalQuestionarrie[k].questionCode == "PREXDISEA") {
                                    preExistingDieases = "N";
                                    diseaseDetails = [];
                                }
                            } else {
                                if ($scope.medicalInfo.medicalQuestionarrie[k].questionCode == "PREXDISEA") {
                                    preExistingDieases = "Y";
                                    diseaseDetails = [];
                                    for (var l = 0; l < travellers[j].diseaseDetails.length; l++) {
                                        if (travellers[j].diseaseDetails[l] != null) {
                                            var disease = {};
                                            disease.diseaseCode = travellers[j].diseaseDetails[l].diseaseCode;
                                            disease.diseaseName = travellers[j].diseaseDetails[l].diseaseName;
                                            disease.diseaseType = travellers[j].diseaseDetails[l].diseaseType;
                                            disease.diseaseDesc = travellers[j].diseaseDetails[l].diseaseDesc;
                                            if (travellers[j].diseaseDetails[l].applicable) {
                                                disease.fromdate = travellers[j].diseaseDetails[l].startDate;
                                            }
                                            disease.applicable = travellers[j].diseaseDetails[l].applicable;
                                            diseaseDetails.push(disease);
                                        }
                                    }
                                }
                            }

                        }
                        travellerDetail.preExistingDieases = preExistingDieases;
                        travellerDetail.diseaseDetails = diseaseDetails;
                        travellerDetail.carrierMedicalQuestion = travellers[j].carrierMedicalQuestion;
                        proposalReq.travellerDetails[j] = travellerDetail;
                    }
                    proposalReq.declarationDetails = $scope.declarationDetails;
                    $scope.travelProposeFormDetails = proposalReq;
                    $scope.travelProposeFormDetails.productId = proposalReq.premiumDetails.productId;
                    return proposalReq;
                };

                $scope.reCalcQuotes = function(travelQuoteInputParams) {
                    /*RestAPI.invoke($scope.globalLabel.transactionName.travelProductQuote,travelQuoteInputParams).then(function(callback){*/
                    if (localStorageService.get("quoteUserInfo").mobileNumber) {
                        travelQuoteInputParams.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                    }
                    RestAPI.invoke($scope.globalLabel.getRequest.quoteTravel, travelQuoteInputParams).then(function(callback) {
                        $scope.travelRecalculateQuoteRequest = [];
                        if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.responseRecalculateCodeList = [];
                            $scope.travelQuoteResult = [];
                            $scope.quoteCalcResponse = [];
                            if (String($scope.quoteCalcResponse) != $scope.globalLabel.errorMessage.undefinedError && $scope.quoteCalcResponse.length > 0) {
                                $scope.quoteCalcResponse.length = 0;
                            }
                            localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                            localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                            $scope.travelRecalculateQuoteRequest = callback.data;


                            angular.forEach($scope.travelRecalculateQuoteRequest, function(obj, i) {
                                var request = {};
                                var header = {};

                                header.messageId = messageIDVar;
                                header.campaignID = campaignIDVar;
                                header.source = sourceOrigin;
                                header.transactionName = $scope.globalLabel.transactionName.travelQuoteResult;
                                header.deviceId = deviceIdOrigin;
                                request.header = header;
                                request.body = obj;

                                $http({
                                    method: 'POST',
                                    url: getQuoteCalcLink,
                                    data: request
                                }).
                                success(function(callback, status) {
                                    var travelQuoteResponse = JSON.parse(callback);
                                    $scope.responseRecalculateCodeList.push(travelQuoteResponse.responseCode);
                                    if (travelQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                        if (travelQuoteResponse.data != null && travelQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                            travelQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                            $scope.loading = false;
                                            $scope.premiumDetails = travelQuoteResponse.data.quotes[0];
                                            $scope.selectedProduct = travelQuoteResponse.data.quotes[0];
                                            /*$scope.checkForPanCardValidation();*/
                                            if (travelQuoteResponse.data.quotes[0].carrierQuoteId != undefined || travelQuoteResponse.data.quotes[0].carrierQuoteId != '' || travelQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                $scope.selectedProduct.carrierQuoteId = travelQuoteResponse.data.quotes[0].carrierQuoteId;
                                            }
                                            if ($scope.selectedProduct.sumInsuredCurrency != undefined && $scope.selectedProduct.sumInsuredCurrency != "") {
                                                for (var k = 0; k < $scope.currencySymbols.length; k++) {
                                                    if ($scope.currencySymbols[k].symbol == $scope.selectedProduct.sumInsuredCurrency) {
                                                        $scope.selectedProduct.sumInsuredCurrency = $scope.currencySymbols[k].symbol;
                                                        $scope.selectedProduct.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[k].htmlCode);
                                                    }
                                                }
                                            } else {
                                                $scope.selectedProduct.sumInsuredCurrency = $scope.currencySymbols[0].symbol;
                                                $scope.selectedProduct.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[0].htmlCode);
                                            }
                                            localStorageService.set("selectedProduct", $scope.selectedProduct);
                                        }
                                        travelQuoteResponse.data.quotes[0].id = travelQuoteResponse.messageId;
                                        $scope.quoteCalcResponse.push(travelQuoteResponse.data.quotes[0]);
                                    } else {
                                        if (travelQuoteResponse.data != null && travelQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                            travelQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                            $scope.loading = false;
                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.globalLabel.errorMessage.screenConfirmErrorMsgDob;
                                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                        }
                                    }
                                }).
                                error(function(data, status) {
                                    $scope.responseRecalculateCodeList.push($scope.globalLabel.responseCode.systemError);
                                    $scope.loading = false;
                                });
                            });

                        } else {
                            $scope.loading = false;
                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.globalLabel.errorMessage.screenConfirmErrorMsgDob;
                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                        }

                    });
                };

                $scope.showAuthenticateForm = function() {
                    $scope.disableOTP = false;
                    var validateAuthParam = {};
                    validateAuthParam.paramMap = {};
                    validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                    validateAuthParam.funcType = $scope.globalLabel.functionType.optAuth;
                    validateAuthParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;
                    if (sessionIDvar) {
                        validateAuthParam.sessionId = sessionIDvar;
                    }
                    getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.sendSMS, validateAuthParam, function(createOTP) {
                        if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.createOTPError = EMPTY;
                            $scope.modalOTP = true;
                        } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                            $scope.createOTPError = createOTP.message;
                            $scope.modalOTPError = true;
                            $scope.disableOTP = true;
                        } else {
                            $scope.createOTPError = $scope.globalLabel.errorMessage.createOTP;
                            $scope.modalOTPError = true;
                        }
                    });
                };

                $scope.hideModal = function() {
                    $scope.modalOTP = false;
                    $scope.disablePaymentButton = true;
                    $scope.authenticate.enteredOTP = EMPTY;
                };

                $scope.hideModalError = function() {
                    $scope.modalOTPError = false;
                };

                $scope.validateAuthenticateForm = function() {
                    //OTP check
                    if ($scope.OTPFlag) {
                        $scope.showAuthenticateForm();

                    } else if (!$scope.OTPFlag) {
                        $scope.proceedForPayment();
                    }
                };

                $scope.resendOTP = function() {
                    var validateAuthParam = {};
                    validateAuthParam.paramMap = {};
                    validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                    validateAuthParam.funcType = $scope.globalLabel.functionType.optAuth;
                    validateAuthParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;
                    if (sessionIDvar) {

                        validateAuthParam.sessionId = sessionIDvar;

                    }
                    getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.sendSMS, validateAuthParam, function(createOTP) {
                        if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.invalidOTPError = EMPTY;
                        } else if (createOTP.responseCode == $scope.globalLabel.responseCode.userNotExist) {
                            $scope.invalidOTPError = createOTP.message;
                        } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                            $scope.invalidOTPError = createOTP.message;
                        } else if (createOTP.responseCode == $scope.globalLabel.responseCode.mobileInvalidCode) {
                            $scope.invalidOTPError = createOTP.message;
                        } else {
                            $scope.invalidOTPError = $scope.globalLabel.errorMessage.createOTP;
                        }
                    });
                };

                // Populate list of years based on age.
                $scope.getYearList = function(dateofBirth) {
                    var dateArr = dateofBirth.split("/");
                    var newDOB = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
                    return listRegistrationYear("buyScreen", calculateAgeByDOB(newDOB)); //getAgeFromDOB()
                };
                $scope.setDieaseStartDate = function(insuredDiseaseDetails) {
                    if (insuredDiseaseDetails.startMonth != null) {
                        insuredDiseaseDetails.startDate = "01/" + insuredDiseaseDetails.startMonth + "/" + insuredDiseaseDetails.startYear;
                    } else if (insuredDiseaseDetails.startYear != null) {
                        insuredDiseaseDetails.startDate = "01/01/" + insuredDiseaseDetails.startYear;
                    }
                };

                $scope.proceedForPayment = function() {
                    $scope.modalOTP = false;
                    $scope.modalOTPError = false;


                    if ($scope.proposalFormValid) {
                        var proposalSubmitConfirmMsg = "Please make sure you have entered the right Mobile Number and Email ID. All our communication will be sent to your Mobile " + $scope.proposerDetails.mobileNumber + " or Email " + $scope.proposerDetails.emailId + ". Is the entered Mobile No. and Email ID right?";
                        $rootScope.P365Confirm($scope.globalLabel.applicationLabels.common.p365prompt, proposalSubmitConfirmMsg, "No", "Yes", function(confirmStatus) {
                            if (confirmStatus) {
                                /*for(var i=0;i<$scope.quoteParam.travellers.length;i++){
                                    for(var j=0;j<$scope.quoteParam.travellers[i].carrierMedicalQuestion.length;j++){
                                        if($scope.$scope.quoteParam.travellers[i].carrierMedicalQuestion[j] == null || 
                                               $scope.quoteParam.travellers[i].carrierMedicalQuestion[j]==undefined || 
                                               String($scope.quoteParam.travellers[i].carrierMedicalQuestion[j])==$scope.globalLabel.errorMessage.undefinedError){
                                            $scope.$scope.quoteParam.travellers[i].carrierMedicalQuestion.splice(j,1);
                                            j=j-1;
                                        }
                                    }
                                }*/
                                $scope.proceedForConfirm();

                            }
                        });
                    }

                }
                $scope.submitProposalRequest = function() {
                    var proposalReqNode = $scope.proposalInfo();
                    $scope.travelProposeFormDetails.QUOTE_ID = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");
                    $scope.travelProposeFormDetails.requestType = $scope.globalLabel.request.travelPropRequestType;
                    $scope.travelProposeFormDetails.planId = $scope.travelProposeFormDetails.premiumDetails.planId;
                    $scope.travelProposeFormDetails.carrierId = $scope.travelProposeFormDetails.premiumDetails.carrierId;
                    $scope.travelProposeFormDetails.businessLineId = $scope.globalLabel.businessLineType.travel;
                    if (!$rootScope.wordPressEnabled) {
                        $scope.travelProposeFormDetails.baseEnvStatus = baseEnvEnabled;
                        $scope.travelProposeFormDetails.source = sourceOrigin;
                    } else {
                        $scope.travelProposeFormDetails.source = sourceOrigin;
                    }
                    // Google Analytics Tracker added.
                    //analyticsTrackerSendData($scope.travelProposeFormDetails); 
                    $scope.loading = true;
                    if ($rootScope.agencyPortalEnabled) {
                        const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                        $scope.travelProposeFormDetails.requestSource = sourceOrigin;
                        $scope.travelProposeFormDetails.userName = localdata.username;
                        $scope.travelProposeFormDetails.agencyId = localdata.agencyId;
                    }
                    RestAPI.invoke($scope.globalLabel.transactionName.submitTravelProposal, $scope.travelProposeFormDetails).then(function(proposeFormResponse) {
                        if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success) {

                            $scope.responseToken = proposeFormResponse.data;
                            $scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.travel;
                            $scope.responseToken.QUOTE_ID = $scope.iposRequest.docId;
                            localStorageService.set("travelReponseToken", $scope.responseToken);

                            $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                            localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);


                            //added by gauri for mautic application
                            if (imauticAutomation == true) {
                                imatTravelProposal(localStorageService, $scope, 'MakePayment');
                            } else {


                                $rootScope.encryptedProposalID = $scope.encryptedProposalId;
                                var body = {};
                                body.longURL = sharePaymentLink + String($scope.responseToken.proposalId) + "&lob=" + String($scope.globalLabel.businessLineType.travel);
                                $http({
                                    method: 'POST',
                                    url: getShortURLLink,
                                    data: body
                                }).
                                success(function(shortURLResponse) {
                                    if (shortURLResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                        var proposalDetailsEmail = {};
                                        proposalDetailsEmail.paramMap = {};
                                        proposalDetailsEmail.funcType = $scope.globalLabel.functionType.proposalDetailsTemplate;
                                        proposalDetailsEmail.isBCCRequired = 'Y';
                                        proposalDetailsEmail.username = proposalReqNode.proposerDetails.emailId.trim();
                                        proposalDetailsEmail.paramMap.customerName = proposalReqNode.proposerDetails.firstName.trim() + SPACE + proposalReqNode.proposerDetails.lastName.trim();
                                        proposalDetailsEmail.paramMap.selectedPolicyType = $scope.globalLabel.insuranceType.travel;
                                        proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
                                        proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                                        proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
                                        proposalDetailsEmail.paramMap.LOB = String($scope.globalLabel.businessLineType.travel);
                                        proposalDetailsEmail.paramMap.url = shortURLResponse.data.shortURL;
                                        RestAPI.invoke($scope.globalLabel.transactionName.sendEmail, proposalDetailsEmail).then(function(emailResponse) {
                                            if (emailResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                if (baseEnvEnabled == true && agencyPortalEnabled == true) {
                                                    var frameURL = agencyPortalUrl + proposalDetailsEmail.paramMap.docId + "&lob=" + proposalDetailsEmail.paramMap.LOB;

                                                    // var frameURL = "http://testing.policies365.com/#/proposalresdata?proposalId=" + proposalDetailsEmail.paramMap.docId + "&lob=" + proposalDetailsEmail.paramMap.LOB;
                                                    $scope.URLforPayment = $sce.trustAsResourceUrl(frameURL);
                                                    $scope.modalAP = true;
                                                    $scope.loading = false;
                                                } else {
                                                    $scope.loading = false;
                                                    $scope.modalIPOS = true;
                                                }
                                            } else {
                                                $scope.loading = false;
                                                $rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.emailSentFailed, "Ok");
                                            }
                                            //code for sending SMS Link to customer
                                            // var proposalDetailsSMS = {};
                                            // proposalDetailsSMS.paramMap = {};
                                            // proposalDetailsSMS.funcType = "SHAREPROPOSAL";
                                            // proposalDetailsSMS.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
                                            // proposalDetailsSMS.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                                            // proposalDetailsSMS.paramMap.docId = String($scope.responseToken.proposalId);
                                            // proposalDetailsSMS.paramMap.LOB = String($scope.globalLabel.businessLineType.travel);
                                            // proposalDetailsSMS.mobileNumber = $scope.proposerDetails.mobileNumber;
                                            // proposalDetailsSMS.paramMap.url = shortURLResponse.data.shortURL;
                                            // RestAPI.invoke($scope.globalLabel.transactionName.sendSMS, proposalDetailsSMS).then(function(smsResponse) {
                                            //     //	
                                            //     if (smsResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                            //         $scope.smsResponseError = "";
                                            //         //$scope.modalOTP = true;		
                                            //     } else if (smsResponse.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                                            //         $scope.smsResponseError = smsResponse.message;
                                            //         //$scope.modalOTPError = true;
                                            //     } else {
                                            //         $scope.smsResponseError = $scope.globalLabel.errorMessage.createOTP;
                                            //         //$scope.modalOTPError = true;
                                            //     }

                                            // });
                                        });
                                    } else {
                                        $scope.loading = false;
                                        $rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.emailSentFailed, "Ok");


                                    }
                                });
                            }


                        } else if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.error) {
                            $scope.disablePaymentButton = false;
                            $scope.loading = false;
                            $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                        } else {
                            //added by gauri for imautic
                            if (imauticAutomation == true) {
                                imatEvent('ProposalFailed');
                            }
                            $scope.loading = false;
                            var serverError = $scope.globalLabel.errorMessage.serverError;
                            $rootScope.P365Alert("Policies365", serverError, "Ok");
                        }
                    });
                }
                $scope.proceedForConfirm = function() {


                    $scope.disablePaymentButton = false;
                    var authenticateUserParam = {};
                    authenticateUserParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                    authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);


                    $scope.disablePaymentButton = true;
                    $scope.modalOTP = false;
                    $scope.modalOTPError = false;

                    $scope.loading = true;
                    $scope.proposalInfo();

                    $scope.travelProposeFormDetails.QUOTE_ID = localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID");
                    $scope.travelProposeFormDetails.requestType = $scope.globalLabel.request.travelPropRequestType;
                    $scope.travelProposeFormDetails.planId = $scope.travelProposeFormDetails.premiumDetails.planId;
                    $scope.travelProposeFormDetails.carrierId = $scope.travelProposeFormDetails.premiumDetails.carrierId;
                    $scope.travelProposeFormDetails.businessLineId = $scope.globalLabel.businessLineType.travel;
                    if (!$rootScope.wordPressEnabled) {
                        $scope.travelProposeFormDetails.baseEnvStatus = baseEnvEnabled;
                        $scope.travelProposeFormDetails.source = sourceOrigin;
                    } else {
                        $scope.travelProposeFormDetails.source = sourceOrigin;
                    }
                    localStorageService.set("travelFinalProposeForm", $scope.travelProposeFormDetails);
                    // Google Analytics Tracker added.
                    //analyticsTrackerSendData($scope.travelProposeFormDetails); 
                    $scope.loading = true;
                    RestAPI.invoke($scope.globalLabel.transactionName.submitTravelProposal, $scope.travelProposeFormDetails).then(function(proposeFormResponse) {


                        $scope.modalOTP = false;
                        $scope.authenticate.enteredOTP = EMPTY;
                        $scope.modalOTPError = false;
                        if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success) {

                            //added by gauri for mautic application
                            //
                            var proposalId = $scope.proposalId;
                            var proposal_url = "" + sharePaymentLink + "" + proposalId + "&lob=5";

                            $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                            localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                            //added by gauri for mautic application
                            if (imauticAutomation == true) {
                                imatTravelProposal(localStorageService, $scope, 'SubmitProposal');
                            }

                            $scope.responseToken = proposeFormResponse.data;
                            $scope.responseToken.paymentGateway = $scope.paymentURL;
                            $scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.travel;
                            localStorageService.set("travelReponseToken", $scope.responseToken);
                            getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.paymentService, $scope.responseToken, function(paymentDetails) {
                                if (paymentDetails.responseCode == $scope.globalLabel.responseCode.success) {
                                    $scope.paymentServiceResponse = paymentDetails.data;
                                    //olark
                                    var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                    // for (var i = 0; i < paymentURLParamListLength; i++) {
                                    //     if ($scope.paymentServiceResponse.paramterList[i].name == 'SourceTxnId' && $scope.paymentServiceResponse.paramterList[i].ngModel == 'SourceTxnId') {
                                    //         olarkCustomParam($scope.paymentServiceResponse.paramterList[i].value, $scope.globalLabel.businessLineType.travel, '', 'proposal');
                                    //     }
                                    // }

                                    if ($scope.paymentServiceResponse.method == "GET") {
                                        var paymentURLParam = "?";
                                        paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                        for (i = 0; i < paymentURLParamListLength; i++) {
                                            if (i < (paymentURLParamListLength - 1)) {
                                                paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value + "&";
                                            } else {
                                                paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value;
                                            }
                                        }
                                        $window.location.href = $scope.paymentServiceResponse.paymentURL + paymentURLParam;
                                    } else {
                                        $timeout(function() {
                                            $scope.paymentForm.setAction($scope.paymentServiceResponse.paymentURL);
                                            $scope.paymentForm.commit();
                                        }, 100);
                                    }
                                } else {
                                    $scope.loading = false;
                                    var buyScreenCnfrmError = paymentDetails.responseCode + " : " + $scope.globalLabel.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                    $rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, buyScreenCnfrmError, "Ok");
                                }
                            });
                        } else if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.error) {
                            $scope.disablePaymentButton = false;
                            $scope.loading = false;
                            $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                        } else {
                            $scope.loading = false;
                            $scope.disablePaymentButton = false;
                            var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.globalLabel.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                            $rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, buyScreenCnfrmError, "Ok");
                        }
                    });

                };

                $scope.hideModalIPOS = function() {
                    $scope.modalIPOS = false;
                };

                $scope.hideModalAP = function() {
                    $scope.modalAP = false;
                };

                $scope.editProposerInfo = function() {
                    $scope.accordion = 1;
                    $scope.screenOneStatus = true;
                    $scope.screenTwoStatus = false;
                    $scope.screenThreeStatus = false;
                    $scope.disableAllFields();
                }

                $scope.editInsuredInfo = function() {
                    $scope.accordion = 2;
                    $scope.screenOneStatus = false;
                    $scope.screenTwoStatus = true;
                    $scope.screenThreeStatus = false;
                    $scope.disableAllFields();
                }

                $scope.submitPersonalDetails = function() {
                    $scope.screenOneStatus = true;
                    $scope.screenTwoStatus = true;
                    $scope.screenThreeStatus = false;
                    $scope.screenFourStatus = false;
                    $scope.Section2Inactive = false;
                    $scope.accordion = 2;
                    $scope.quoteParam.proposerDetails = $scope.proposerDetails;
                    localStorageService.set("proposerDetails", $scope.proposerDetails);

                    //added by gauri for imautic
                    if (imauticAutomation == true) {
                        imatEvent('ProposalFilled');
                    }
                    for (var i = 0; i < $scope.selectedTravellers.length; i++) {
                        if ($scope.selectedTravellers[i].relation && $scope.selectedTravellers[i].relation == SELF) {
                            $scope.selectedTravellers[i].relationshipCode = 'S';
                            $scope.selectedTravellers[i].firstName = $scope.proposerDetails.firstName;
                            $scope.selectedTravellers[i].lastName = $scope.proposerDetails.lastName;
                            $scope.selectedTravellers[i].dob = $scope.proposerDetails.dateOfBirth;
                            $scope.selectedTravellers[i].gender = $scope.proposerDetails.gender;
                            $scope.selectedTravellers[i].sameAsProposer = true;
                            $scope.changeDateOfBirth(i);
                        } else if ($scope.selectedTravellers[i].relation && $scope.selectedTravellers[i].relation == SPOUSE) {
                            $scope.selectedTravellers[i].gender = ($scope.proposerDetails.gender == FEMALE) ? MALE : FEMALE;
                            $scope.selectedTravellers[i].sameAsProposer = false;
                        }
                    }
                };

                $scope.submitAddressDetails = function() {
                    $scope.screenOneStatus = true;
                    $scope.screenTwoStatus = true;
                    $scope.screenThreeStatus = true;
                    $scope.screenFourStatus = false;
                    $scope.Section2Inactive = false;
                    $scope.accordion = 3;
                    $scope.quoteParam.proposerDetails = $scope.proposerDetails;
                    localStorageService.set("proposerDetails", $scope.proposerDetails);
                    for (var i = 0; i < $scope.selectedTravellers.length; i++) {
                        if ($scope.selectedTravellers[i].relation && $scope.selectedTravellers[i].relation == SELF) {
                            $scope.selectedTravellers[i].relationshipCode = 'S';
                            $scope.selectedTravellers[i].firstName = $scope.proposerDetails.firstName;
                            $scope.selectedTravellers[i].lastName = $scope.proposerDetails.lastName;
                            $scope.selectedTravellers[i].dob = $scope.proposerDetails.dateOfBirth;
                            $scope.selectedTravellers[i].gender = $scope.proposerDetails.gender;
                            $scope.selectedTravellers[i].sameAsProposer = true;
                        } else if ($scope.selectedTravellers[i].relation && $scope.selectedTravellers[i].relation == SPOUSE) {
                            $scope.selectedTravellers[i].gender = ($scope.proposerDetails.gender == FEMALE) ? MALE : FEMALE;
                            $scope.selectedTravellers[i].sameAsProposer = false;
                        }
                    }

                };
                // fxn to submit traveller's info
                $scope.submitInsuredDetails = function() {
                    $scope.screenOneStatus = true;
                    $scope.screenTwoStatus = true;
                    $scope.screenThreeStatus = true;
                    $scope.screenFourStatus = true;
                    $scope.Section2Inactive = false;
                    $scope.accordion = 4;
                    localStorageService.set("selectedTravellersForTravel", $scope.selectedTravellers);
                };



                $scope.proposalDocParam = {};
                var proposalId = $location.search().proposalId;


                $scope.proposalDocParam.proposalId = proposalId;
                $scope.proposalDocParam.businessLineId = $scope.globalLabel.businessLineType.travel;

                // Record in crm.
                $scope.iposRequest = {};
                $scope.iposRequest.parent_id = String($rootScope.parent_id) != $scope.globalLabel.errorMessage.undefinedError ? $rootScope.parent_id : $location.search().recordId;
                $scope.iposRequest.parent_type = String($rootScope.parent_type) != $scope.globalLabel.errorMessage.undefinedError ? $rootScope.parent_type : $location.search().moduleName;
                $scope.iposRequest.requestType = $scope.globalLabel.request.createProposalRecord;
                $scope.quote = {};
                // requesting proposal data using proposalID
                RestAPI.invoke($scope.globalLabel.transactionName.proposalDataReader, $scope.proposalDocParam).then(function(proposalDataResponse) {
                    if (proposalDataResponse.responsecode == $scope.globalLabel.responseCode.success) {
                        $scope.responseProduct = proposalDataResponse.data.PolicyTransaction;
                        if ($scope.responseProduct.proposalRequest.declarationDetails) {
                            for (var i = 0; i < $scope.responseProduct.proposalRequest.declarationDetails.length; i++) {
                                $scope.declarationDetails[i].accepted = $scope.responseProduct.proposalRequest.declarationDetails[i].accepted;
                            }
                        }
                        //Proposal Form Details
                        $scope.proposalStatusForm = true;
                        if ($scope.responseProduct.travelProposalResponse != null) {
                            $scope.proposalStatus.statusDateProp = $scope.responseProduct.travelProposalResponse.updatedDate;
                            $scope.proposalStatus.statusProp = "completed";
                        }
                        if ($scope.responseProduct.paymentResponse != null) {
                            if ($scope.responseProduct.paymentResponse.transactionStatusCode == 1) {
                                $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                                $scope.proposalStatus.statusPaym = "completed";
                                $scope.disableAllFields = function() {
                                    setTimeout(function() {
                                        $('form md-option').attr('disabled', 'disabled');
                                        $('form md-select').attr('disabled', 'disabled');
                                        $('input').attr('disabled', 'disabled');
                                        $('md-radio-button').attr('disabled', 'disabled');
                                        $('md-checkbox').attr('disabled', 'disabled');
                                        $scope.medicalDetailsForm.$invalid = true;
                                    }, 1000);
                                }
                                $scope.disableAllFields();
                            } else if ($scope.responseProduct.paymentResponse.transactionStatusCode == 0) {
                                $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                                $scope.proposalStatus.statusPaym = "failed";
                            } else {
                                $scope.proposalStatus.statusPaym = "pending";
                                $scope.proposalStatus.statusPoli = "pending";
                            }
                        }
                        if ($scope.responseProduct.travelPolicyResponse != null) {
                            if ($scope.responseProduct.travelPolicyResponse.transactionStatusCode == 1) {
                                $scope.proposalStatus.statusDatePoli = $scope.responseProduct.travelPolicyResponse.updatedDate;
                                $scope.proposalStatus.statusPoli = "completed";
                            } else if ($scope.responseProduct.travelPolicyResponse.transactionStatusCode == 0) {
                                $scope.proposalStatus.statusDatePoli = $scope.responseProduct.travelPolicyResponse.updatedDate;
                                $scope.proposalStatus.statusPoli = "failed";
                            }
                        }

                        $scope.travelProposalApp.documentType = "TravelProposalRequest";
                        $scope.travelProposalApp.carrierId = $scope.responseProduct.proposalRequest.premiumDetails.carrierId;
                        $scope.travelProposalApp.productId = $scope.responseProduct.proposalRequest.premiumDetails.productId;
                        $scope.travelProposalApp.planId = $scope.responseProduct.proposalRequest.premiumDetails.planId;
                        $scope.travelProposalApp.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        localStorageService.set("QUOTE_ID", $scope.responseProduct.QUOTE_ID);
                        localStorageService.set("TRAVEL_UNIQUE_QUOTE_ID", $scope.responseProduct.QUOTE_ID);
                        $scope.travelProposalApp.businessLineId = $scope.globalLabel.businessLineType.travel;
                        messageIDVar = $scope.responseProduct.leadMessageId;

                        /*$scope.quote.requestType = $scope.globalLabel.request.travelPropRequestType;*/

                        var buyScreenParam = {};
                        buyScreenParam.documentType = $scope.globalLabel.applicationLabels.common.constants.proposalScreenConfig;
                        buyScreenParam.businessLineId = Number($scope.globalLabel.businessLineType.travel);
                        buyScreenParam.carrierId = $scope.travelProposalApp.carrierId;
                        buyScreenParam.productId = $scope.travelProposalApp.productId;
                        buyScreenParam.QUOTE_ID = $scope.travelProposalApp.QUOTE_ID;

                        getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.productDataReader, buyScreenParam, function(buyScreen) {
                            if (buyScreen.responseCode == $scope.globalLabel.responseCode.success) {
                                var buyScreens = buyScreen.data;
                                $scope.productValidation = buyScreens.validation;
                                $scope.requestFormat = buyScreens.requestFormat;
                                $scope.transactionName = buyScreens.transaction.proposalService.name;
                                if (buyScreens.visitPurposes) {
                                    $scope.purposeListOfVisit = buyScreens.visitPurposes;
                                    $scope.proposerDetails.purposeOfVisit = $scope.purposeListOfVisit[0].purposeOfVisit;
                                }
                                $scope.occupationCheck = $scope.productValidation.occupationCheck;
                                $scope.paymentURL = buyScreens.paymentUrl;
                                $scope.OTPFlag = $scope.productValidation.OTPFlag;

                                $scope.proposerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                                $scope.travellersDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
                                $scope.medicalDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                                $scope.occupationDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);
                                if ($scope.productValidation.areaMaxLength) {
                                    $scope.areaMaxLength = $scope.productValidation.areaMaxLength;
                                } else {
                                    $scope.areaMaxLength = 250;
                                }
                                getDocUsingIdQuoteDB(RestAPI, $scope.travelProposalApp.QUOTE_ID, function(quoteCalcDetails) {
                                    $scope.quoteCalcResponse = quoteCalcDetails.quoteResponse;
                                    $scope.quoteCalcRequest = quoteCalcDetails.quoteRequest;

                                    for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                                        if ($scope.quoteCalcResponse[i].carrierId == $scope.responseProduct.proposalRequest.premiumDetails.carrierId) {
                                            $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                                            $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                                            break;
                                        }
                                    }

                                    $scope.changeInsuranceCompany = function() {
                                        $location.path('/buyTravel').search({
                                            quoteId: localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"),
                                            carrierId: $scope.premiumDetails.selectedProductDetails.carrierId,
                                            productId: $scope.premiumDetails.selectedProductDetails.productId,
                                            lob: localStorageService.get("selectedBusinessLineId")
                                        });
                                        /*$scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;*/
                                    }

                                    $scope.quoteCalcRequest.quoteParam.userIdv = parseInt($scope.responseProduct.proposalRequest.premiumDetails.sumInsured);
                                    if ($scope.productValidation.reQuoteCalc) {
                                        RestAPI.invoke($scope.globalLabel.getRequest.quoteTravel, $scope.quoteCalcRequest).then(function(proposeFormResponse) {
                                            $scope.travelRecalculateQuoteRequest = [];
                                            if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                $scope.responseProduct.QUOTE_ID = proposeFormResponse.QUOTE_ID;
                                                localStorageService.set("QUOTE_ID", proposeFormResponse.QUOTE_ID);
                                                $scope.travelRecalculateQuoteRequest = proposeFormResponse.data;
                                                $scope.quoteCalcResponse = [];
                                                angular.forEach($scope.travelRecalculateQuoteRequest, function(obj, i) {
                                                    var request = {};
                                                    var header = {};

                                                    header.transactionName = $scope.globalLabel.transactionName.travelQuoteResult;
                                                    header.deviceId = deviceIdOrigin;
                                                    request.header = header;
                                                    request.body = obj;

                                                    $http({
                                                        method: 'POST',
                                                        url: getQuoteCalcLink,
                                                        data: request
                                                    }).
                                                    success(function(callback, status) {
                                                        var travelQuoteResponse = JSON.parse(callback);
                                                        $scope.responseRecalculateCodeList.push(travelQuoteResponse.responseCode);
                                                        if (travelQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                            if (travelQuoteResponse.data != null && travelQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                travelQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId) {
                                                                $scope.loading = false;
                                                                $scope.premiumDetails = travelQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = travelQuoteResponse.data.quotes[0];
                                                                $scope.proposalDataReader();
                                                            }
                                                            travelQuoteResponse.data.quotes[0].id = travelQuoteResponse.messageId;
                                                            $scope.quoteCalcResponse.push(travelQuoteResponse.data.quotes[0]);
                                                        } else {
                                                            if (travelQuoteResponse.data != null && travelQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                travelQuoteResponse.data.quotes[0].productId == $scope.responseProduct.productId) {
                                                                $scope.loading = false;
                                                                $scope.propScreenError = $scope.globalLabel.validationMessages.generalisedErrMsg;
                                                                $scope.modalPropScreenError = true;
                                                            }
                                                        }
                                                    })
                                                });
                                            } else {
                                                $scope.propScreenError = $scope.globalLabel.validationMessages.generalisedErrMsg;
                                                $scope.modalPropScreenError = true;
                                            }
                                        });
                                    } else {
                                        $scope.proposalDataReader();
                                    }
                                }); // ./getDocUsingIdQuoteDB;
                            } else {
                                $rootScope.P365Alert("Error", buyScreen.data, "Ok");
                            }
                        }); // ./getDocUsingParam;
                        $scope.redirectToQuote = function() {
                            $location.path("/quote");
                        }
                    } else {
                        // If screen are not present in DB. Show Error Message and redirect to instant quote screen (home page).
                        $scope.loading = false;
                        var buyScreenCnfrmError = $scope.globalLabel.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                        $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                    }


                    $scope.initTravellersDOB = function() {
                            var len = $scope.selectedTravellers.length;
                            for (var i = 0; i < len; i++) {
                                var travellerDOBOption = {};
                                if ($scope.selectedTravellers[i].relation == FATHER || $scope.selectedTravellers[i].relation == MOTHER) {
                                    travellerDOBOption.minimumYearLimit = "-100Y";
                                    fAge = Math.round(getAgeFromDOB($scope.proposerDetails.dateOfBirth));
                                    travellerDOBOption.maximumYearLimit = "-" + (fAge + 21) + "y";
                                    travellerDOBOption.changeMonth = true;
                                    travellerDOBOption.changeYear = true;
                                    travellerDOBOption.dateFormat = DATE_FORMAT;
                                    $scope['travellerDOBOptions' + i] = setP365DatePickerProperties(travellerDOBOption);
                                } else if ($scope.selectedTravellers[i].relation == SON || $scope.selectedTravellers[i].relation == DAUGHTER) {
                                    travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.childMaxAge + "Y";
                                    travellerDOBOption.maximumDayLimit = -$scope.productValidation.childMinAge;
                                    travellerDOBOption.changeMonth = true;
                                    travellerDOBOption.changeYear = true;
                                    travellerDOBOption.dateFormat = DATE_FORMAT;
                                    $scope['travellerDOBOptions' + i] = setP365DatePickerProperties(travellerDOBOption);
                                } else {
                                    travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.maxAge + "Y";
                                    travellerDOBOption.maximumYearLimit = "-" + $scope.productValidation.maleMinAgeSingle + "y";
                                    travellerDOBOption.changeMonth = true;
                                    travellerDOBOption.changeYear = true;
                                    travellerDOBOption.dateFormat = DATE_FORMAT;
                                    $scope['travellerDOBOptions' + i] = setP365DatePickerProperties(travellerDOBOption);
                                }
                            }
                        }
                        //fxn to prepopulate all form fields by reading proposalDoc
                    $scope.prePopulateForm = function() {
                        $scope.quote = $scope.responseProduct.proposalRequest;
                        for (var w = 0; w < $scope.quoteCalcRequest.quoteParam.travellers.length; w++) {
                            $scope.quoteCalcRequest.quoteParam.travellers[w].dob = angular.copy($scope.quoteCalcRequest.quoteParam.travellers[w].memberDOB);
                            delete $scope.quoteCalcRequest.quoteParam.travellers[w].memberDOB;
                        }
                        $scope.quoteParam = $scope.quoteCalcRequest.quoteParam;
                        $scope.quote.quoteParam = $scope.quoteParam;
                        $scope.quote.requestType = $scope.quoteCalcRequest.requestType
                        $scope.quoteRecalcParam = angular.copy($scope.quote);
                        $scope.proposerDetails = $scope.responseProduct.proposalRequest.proposerDetails;

                        $scope.communicationAddress = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress;
                        var addressFlag = $scope.responseProduct.proposalRequest.proposerDetails.isCommuniationAddressSameAsPermanant;
                        $scope.isAddressSameAsCommun = (addressFlag == 'Y') ? true : false;
                        if ($scope.isAddressSameAsCommun) {
                            $scope.permanentAddressDetails = $scope.responseProduct.proposalRequest.proposerDetails.communicationAddress;
                        } else {
                            $scope.permanentAddressDetails = $scope.responseProduct.proposalRequest.proposerDetails.permanantAddress;
                        }
                        $scope.selectedProduct = $scope.responseProduct.proposalRequest.premiumDetails;
                        localStorageService.get("selectedBusinessLineId", $scope.selectedProduct.quoteType);

                        if ($scope.selectedProduct.sumInsuredCurrency != undefined && $scope.selectedProduct.sumInsuredCurrency != "") {
                            for (var k = 0; k < $scope.currencySymbols.length; k++) {
                                if ($scope.currencySymbols[k].symbol == $scope.selectedProduct.sumInsuredCurrency) {
                                    $scope.selectedProduct.sumInsuredCurrency = $scope.currencySymbols[k].symbol;
                                    $scope.selectedProduct.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[k].htmlCode);
                                }
                            }
                        } else {
                            $scope.selectedProduct.sumInsuredCurrency = $scope.currencySymbols[0].symbol;
                            $scope.selectedProduct.sumInsuredCurrencySymbol = $sce.trustAsHtml($scope.currencySymbols[0].htmlCode);
                        }
                        localStorageService.set("selectedProduct", $scope.selectedProduct);

                        $scope.travelDetails = $scope.responseProduct.proposalRequest.travelDetails;
                        localStorageService.set("travelDetails", $scope.travelDetails);
                        $scope.selectedTravellers = $scope.responseProduct.proposalRequest.travellerDetails;

                        if ($scope.responseProduct.proposalRequest.travellerDetails) {
                            var len = $scope.responseProduct.proposalRequest.travellerDetails.length;
                            $scope.storedDOBs = [];
                            $scope.storedGenders = [];
                            for (var j = 0; j < len; j++) {


                                if ((getAgeFromDOB($scope.responseProduct.proposalRequest.travellerDetails[j].dateOfBirth) < $scope.productValidation.maleMinAgeSingle)) {
                                    $scope.selectedTravellers[j].gender = $scope.responseProduct.proposalRequest.travellerDetails[j].gender;
                                    $scope.selectedTravellers[j].dob = $scope.responseProduct.proposalRequest.travellerDetails[j].dateOfBirth;
                                    if ($scope.selectedTravellers[j].gender == MALE) {
                                        $scope.selectedTravellers[j].relation = SON;
                                    } else {
                                        $scope.selectedTravellers[j].relation = DAUGHTER;
                                    }

                                    $scope.changeRelation(j);
                                } else {
                                    $scope.selectedTravellers[j].dob = $scope.responseProduct.proposalRequest.travellerDetails[j].dateOfBirth;
                                    $scope.selectedTravellers[j].gender = $scope.responseProduct.proposalRequest.travellerDetails[j].gender;
                                }
                                $scope.storedDOBs.push($scope.responseProduct.proposalRequest.travellerDetails[j].dateOfBirth);
                                $scope.storedGenders.push($scope.responseProduct.proposalRequest.travellerDetails[j].gender);
                            }

                        }
                        $scope.quoteRecalcParam.quoteParam.travellers = $scope.selectedTravellers;
                        localStorageService.set("selectedTravellersForTravel", $scope.selectedTravellers);
                        $scope.medicalQuestionarrier = $scope.responseProduct.proposalRequest.medicalQuestionarrie;
                        $scope.medicalInfo.medicalQuestionarrie = $scope.medicalQuestionarrier;

                        $scope.initTravellersDOB();
                    }

                    $scope.initDatePickers = function() {
                        // Setting properties for proposer DOB date-picker.
                        var proposerDOBOption = {};
                        proposerDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMaxLimit + "Y";
                        proposerDOBOption.maximumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMinLimit + "Y";
                        proposerDOBOption.changeMonth = true;
                        proposerDOBOption.changeYear = true;
                        proposerDOBOption.dateFormat = DATE_FORMAT;
                        $scope.proposerDOBOptions = setP365DatePickerProperties(proposerDOBOption);

                        var nomineeDOBOption = {};
                        nomineeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMaxLimit + "Y";
                        nomineeDOBOption.maximumYearLimit = "-1Y";
                        nomineeDOBOption.changeMonth = true;
                        nomineeDOBOption.changeYear = true;
                        nomineeDOBOption.dateFormat = DATE_FORMAT;
                        $scope.nomineeDOBOptions = setP365DatePickerProperties(nomineeDOBOption);

                        var appointeeDOBOption = {};
                        appointeeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMaxLimit + "Y";
                        appointeeDOBOption.maximumYearLimit = "-" + $scope.productValidation.proposerDateOfBirthMinLimit + "y";
                        appointeeDOBOption.changeMonth = true;
                        appointeeDOBOption.changeYear = true;
                        appointeeDOBOption.dateFormat = DATE_FORMAT;
                        $scope.appointeeDOBOptions = setP365DatePickerProperties(appointeeDOBOption);

                        var hospitalisedOption = {};
                        hospitalisedOption.minimumMonthLimit = "-48m";
                        hospitalisedOption.maximumMonthLimit = "0m";
                        hospitalisedOption.changeMonth = true;
                        hospitalisedOption.changeYear = true;
                        hospitalisedOption.dateFormat = DATE_FORMAT;
                        $scope.hospitalisedDateOptions = setP365DatePickerProperties(hospitalisedOption);

                        var claimDateOption = {};
                        claimDateOption.minimumMonthLimit = "-48m";
                        claimDateOption.maximumMonthLimit = "0m";
                        claimDateOption.changeMonth = true;
                        claimDateOption.changeYear = true;
                        claimDateOption.dateFormat = DATE_FORMAT;
                        $scope.claimedDateOptions = setP365DatePickerProperties(claimDateOption);
                    }
                    $scope.proposalDataReader = function() {
                            $scope.occupationCheck = $scope.productValidation.occupationCheck;
                            if ($scope.occupationCheck) {
                                var occupationDocId = $scope.globalLabel.documentType.travelOccupation + "-" + $scope.travelProposalApp.carrierId + "-" + $scope.travelProposalApp.productId;
                                getDocUsingId(RestAPI, occupationDocId, function(occupationList) {
                                    $scope.occupationList = occupationList.Occupation;
                                    localStorageService.set("travelBuyOccupationList", occupationList.Occupation);
                                }); // ./getDocUsingId;
                            }
                            $rootScope.loading = false;
                            $scope.prePopulateForm();
                            $scope.initDatePickers();
                        } // ./proposalDataReader;
                }); // ./RestAPI.invoke proposalDataReader

                //functions to toggle UI

                $scope.clicktoShowDisease = function() {
                    $scope.diseaseShow = true;
                };

                $scope.submitDieaseList = function() {
                    $scope.diseaseShow = false;
                };

                $scope.clicktoHideDisease = function() {
                    $scope.diseaseShow = false;
                };

                $scope.clickToShowDiagnosed = function() {
                    $scope.dignosedShow = true;
                }

                $scope.clickToHideDiagnosed = function() {
                    $scope.dignosedShow = false;
                }

                $scope.clicktoShowLastClaim = function() {
                    $scope.lastClaimShow = true;
                }

                $scope.clicktoHideLastClaim = function() {
                    $scope.lastClaimShow = false;
                }

                //show feedback form popup.
                $scope.showTermsDiv = false;
                $rootScope.showTerms = function(terms) {
                    $scope.termsAndConditions = $sce.trustAsHtml(terms);
                    $scope.showTermsDiv = true;

                };

                $scope.TermsCheck = function(sel) {
                    if (sel == 'true') {
                        $scope.termsAndConditionsAgree = false;
                    } else {
                        $scope.termsAndConditionsAgree = true;
                    }
                }

                $rootScope.closeTerms = function() {
                    $scope.showTermsDiv = false;
                };



                $scope.next = function() {
                    $scope.page = $scope.page + 1;
                };

                $scope.back = function() {
                    $scope.page = $scope.page - 1;
                };


                /*//fxn to fetch relationship list
                $scope.getRelationshipList = function(){
                	getDocUsingId(RestAPI, "relationshipdetailslist", function(relationList){
                		$scope.relationList = relationList.relationships; 
                		//$scope.fetchOccupationList($scope.globalLabel.documentType.healthOccupation,$scope.selectedProduct.carrierId,$scope.selectedProduct.planId);
                	})};*/

                // fxn to change traveller's relation with proposer	
                $scope.changeRelation = function(index) {
                    var fAge = 0;
                    var travellerDOBOption = {};
                    travellerDOBOption.changeMonth = true;
                    travellerDOBOption.changeYear = true;
                    travellerDOBOption.dateFormat = DATE_FORMAT;
                    if ($scope.selectedTravellers[index].relation != SELF) {
                        $scope.selectedTravellers[index].sameAsProposer = false;
                        $scope.selectedTravellers[index].lastName = $scope.proposerDetails.lastName;
                        if ($scope.selectedTravellers[index].relation == SPOUSE) {
                            $scope.selectedTravellers[index].gender = ($scope.proposerDetails.gender == MALE) ? FEMALE : MALE;
                            if ($scope.selectedTravellers[index].gender == FEMALE) {
                                travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.maxAge + "Y" + " - 1D";
                                travellerDOBOption.maximumYearLimit = "-" + $scope.productValidation.femaleMinAge + "y";
                                $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                                $scope.selectedTravellers[index].dob = "";
                            } else {
                                travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.maxAge + "Y" + " - 1D";
                                travellerDOBOption.maximumYearLimit = "-" + $scope.productValidation.maleMinAgeMarried + "y";
                                $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                                $scope.selectedTravellers[index].dob = "";
                            }
                        } else if ($scope.selectedTravellers[index].relation == SON) {
                            $scope.selectedTravellers[index].gender = MALE;
                            travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.childMaxAge + "Y";
                            travellerDOBOption.maximumDayLimit = -$scope.productValidation.childMinAge;
                            $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                            /*$scope.selectedTravellers[index].dob = "";*/
                        } else if ($scope.selectedTravellers[index].relation == DAUGHTER) {
                            $scope.selectedTravellers[index].gender = FEMALE;
                            travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.childMaxAge + "Y";
                            travellerDOBOption.maximumDayLimit = -$scope.productValidation.childMinAge;
                            $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                            /*$scope.selectedTravellers[index].dob = "";*/
                        } else if ($scope.selectedTravellers[index].relation == FATHER) {
                            $scope.selectedTravellers[index].gender = MALE;
                            travellerDOBOption.minimumYearLimit = "-100Y";
                            fAge = Math.round(getAgeFromDOB($scope.proposerDetails.dateOfBirth));
                            travellerDOBOption.maximumYearLimit = "-" + (fAge + 21) + "y";
                            $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                            $scope.selectedTravellers[index].dob = "";
                        } else if ($scope.selectedTravellers[index].relation == MOTHER) {

                            $scope.selectedTravellers[index].gender = FEMALE;
                            travellerDOBOption.minimumYearLimit = "-100Y";
                            fAge = Math.round(getAgeFromDOB($scope.proposerDetails.dateOfBirth));
                            travellerDOBOption.maximumYearLimit = "-" + (fAge + 18) + "y";
                            $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                            $scope.selectedTravellers[index].dob = "";
                        }
                    } else {
                        $scope.selectedTravellers[index].sameAsProposer = true;
                        $scope.selectedTravellers[index].gender = $scope.proposerDetails.gender;
                        $scope.selectedTravellers[index].dob = $scope.proposerDetails.dateOfBirth;
                        $scope.selectedTravellers[index].firstName = $scope.proposerDetails.firstName;
                        $scope.selectedTravellers[index].lastName = $scope.proposerDetails.lastName;
                        $scope.changeDateOfBirth(index);
                        if ($scope.selectedTravellers[index].gender == FEMALE) {
                            travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.maxAge + "Y" + " - 1D";
                            travellerDOBOption.maximumYearLimit = "-" + $scope.productValidation.femaleMinAge + "y";
                            $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                        } else {
                            if ($scope.proposerDetails.maritalStatus == MARRIED) {
                                travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.maxAge + "Y" + " - 1D";
                                travellerDOBOption.maximumYearLimit = "-" + $scope.productValidation.maleMinAgeMarried + "y";
                                $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                            } else if ($scope.proposerDetails.maritalStatus == SINGLE) {
                                travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.maxAge + "Y" + " - 1D";
                                travellerDOBOption.maximumYearLimit = "-" + $scope.productValidation.maleMinAgeSingle + "y";
                                $scope['travellerDOBOptions' + index] = setP365DatePickerProperties(travellerDOBOption);
                            }
                        }
                    }
                    localStorageService.set("selectedTravellersForTravel", $scope.selectedTravellers);
                }

                $scope.changeDateOfBirth = function(index) {
                    if (String($scope.storedDOBs[index]) != 'undefined' || $scope.storedDOBs[index] != null || $scope.storedDOBs[index] != undefined) {
                        var dob = angular.copy($scope.quoteRecalcParam.quoteParam.travellers[index].dob);
                        var tempDOB = angular.copy($scope.quoteRecalcParam.quoteParam.travellers[index].dob);
                        var tempDateArray = tempDOB.split("/");
                        var tempDOBinMM_DD_YY = String(tempDateArray[0] + '/' + tempDateArray[1] + '/' + tempDateArray[2]);
                        if ($scope.storedDOBs[index] != tempDOBinMM_DD_YY) {
                            $rootScope.P365Confirm($scope.globalLabel.applicationLabels.common.p365prompt, $scope.globalLabel.applicationLabels.common.DobChangeMsg, "No", "Yes", function(confirmStatus) {
                                if (confirmStatus) {

                                    $scope.loading = true;
                                    var tempDOBinDD_MM_YY = String(tempDateArray[0] + '/' + tempDateArray[1] + '/' + tempDateArray[2]);
                                    $scope.storedDOBs[index] = tempDOBinDD_MM_YY;
                                    $scope.ageList = [];

                                    for (var i = 0; i < $scope.quoteRecalcParam.quoteParam.travellers.length; i++) {
                                        if ($scope.quoteRecalcParam.quoteParam.travellers[i].relation == SELF) {
                                            $scope.proposerDetails.age = getAgeFromDOB($scope.quoteRecalcParam.quoteParam.travellers[i].dob);
                                            $scope.quoteRecalcParam.quoteParam.travellers[i].age = getAgeFromDOB($scope.quoteRecalcParam.quoteParam.travellers[i].dob);
                                        } else {
                                            $scope.quoteRecalcParam.quoteParam.travellers[i].age = getAgeFromDOB($scope.quoteRecalcParam.quoteParam.travellers[i].dob);
                                        }
                                        $scope.ageList.push($scope.quoteRecalcParam.quoteParam.travellers[i].age);
                                    }

                                    $scope.quoteRecalcParam.quoteParam.quoteMinAge = getMinAge($scope.ageList);
                                    $scope.quoteRecalcParam.quoteParam.quoteMaxAge = getMaxAge($scope.ageList);
                                    localStorageService.set("selectedTravellersForTravel", $scope.quoteRecalcParam.quoteParam.travellers);
                                    $scope.quoteRecalc = prepareQuoteRequest($scope.quoteRecalcParam);

                                    //call reCalcQuotes fxn here
                                    $scope.reCalcQuotes($scope.quoteRecalc);

                                } else {
                                    $scope.loading = false;
                                    $scope.quoteRecalcParam.quoteParam.travellers[index].dob = $scope.storedDOBs[index];
                                    if ($scope.quoteRecalcParam.quoteParam.travellers[index].relation == SELF) {
                                        $scope.proposerDetails.dateOfBirth = $scope.quoteRecalcParam.quoteParam.travellers[index].dob;
                                    }
                                }
                            });
                        } else {
                            $scope.storedDOBs[index] = dob;
                            $scope.quoteRecalcParam.quoteParam.travellers[index].dob = $scope.storedDOBs[index];
                            if ($scope.quoteRecalcParam.quoteParam.travellers[index].relation == SELF) {
                                $scope.proposerDetails.dateOfBirth = $scope.quoteRecalcParam.quoteParam.travellers[index].dob;
                            }
                        }
                    }
                };

                $scope.getOccupationList = function() {
                    var occupationDocId = $scope.globalLabel.documentType.travelOccupation + "-" + $scope.selectedProduct.carrierId + "-" + $scope.selectedProduct.productId;
                    getDocUsingId(RestAPI, occupationDocId, function(occupationList) {
                        $scope.occupationList = occupationList.Occupation;
                        localStorageService.set("travelBuyOccupationList", occupationList.Occupation);
                    });
                }

                $scope.init = function() {
                    $scope.medicalQuestionarrier = [];
                    var searchData = {};
                    searchData.documentType = $scope.globalLabel.documentType.travelDiseaseQuestion;
                    searchData.carrierId = $scope.selectedProduct.carrierId;
                    searchData.planId = $scope.selectedProduct.planId;
                    searchData.lob = $scope.globalLabel.businessLineType.travel;
                    getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getHealthQuestionList, searchData, function(callback) {
                        $scope.medicalQuestionarrier = callback.data;
                        for (var i = 0; i < $scope.medicalQuestionarrier.length; i++) {
                            if ($scope.medicalQuestionarrier[i].questionCode == 'PREXDISEA') {
                                if ($scope.medicalQuestionarrier[i].applicable == 'true') {
                                    $scope.diseaseShow == true;
                                    $scope.clicktoShowDisease();
                                }
                            }
                        }
                        $scope.termsAndConditionsAgree = false;
                        var searchDiseaseData = {};
                        searchDiseaseData.documentType = $scope.globalLabel.documentType.travelDiseaseMapping;
                        searchDiseaseData.carrierId = $scope.selectedProduct.carrierId;
                        searchDiseaseData.planId = $scope.selectedProduct.planId;
                        searchDiseaseData.lob = $scope.globalLabel.businessLineType.travel;
                        getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getHealthQuestionList, searchDiseaseData, function(callback) {
                            $scope.diseaseList = callback.data;
                            $scope.numberOfPages = Math.ceil($scope.diseaseList.length / $scope.numRecords);
                            $scope.diseaseListDisable = angular.copy($scope.diseaseList);
                            for (var i = 0; i < $scope.diseaseListDisable.length; i++) {
                                $scope.diseaseListDisable[i].subParentId = $scope.diseaseListDisable[i].parentId
                            }
                            if ($scope.occupationCheck) {
                                $scope.getOccupationList();
                            }
                        });


                    });
                };




            }); // ./loading applicationLabels
        }); // ./loadDatabase

        //function for validation of age and marrital status ,gender for hdfc
        $scope.validateData = function() {
            if ($scope.proposerAge < $scope.productValidation.maleMinAgeSingle && $scope.proposerDetails.maritalStatus == $scope.productValidation.checkSingleStatus && $scope.proposerDetails.gender == MALE) {
                $scope.proposerDetailsForm.dateOfBirth.$setValidity('dateOfBirth', true);
                $scope.proposerDetailsForm.gender.$setValidity('gender', true);
                $scope.proposerDetailsForm.maritalStatus.$setValidity('maritalStatus', true);
                $scope.errorMsg = true;
            } else if ($scope.proposerAge < $scope.productValidation.maleMinAgeMarried && $scope.proposerDetails.maritalStatus == $scope.productValidation.checkMarriedStatus && $scope.proposerDetails.gender == MALE) {
                $scope.proposerDetailsForm.dateOfBirth.$setValidity('dateOfBirth', false);
                $scope.proposerDetailsForm.gender.$setValidity('gender', false);
                $scope.proposerDetailsForm.maritalStatus.$setValidity('maritalStatus', false);
                $scope.errorMsg = true;
            } else if ($scope.proposerAge < $scope.productValidation.femaleMinAge && $scope.proposerDetails.gender == FEMALE) {
                $scope.proposerDetailsForm.dateOfBirth.$setValidity('dateOfBirth', true);
                $scope.proposerDetailsForm.gender.$setValidity('gender', true);
                $scope.proposerDetailsForm.maritalStatus.$setValidity('maritalStatus', true);
                $scope.errorMsg = true;
            } else {
                $scope.proposerDetailsForm.dateOfBirth.$setValidity('dateOfBirth', true);
                $scope.proposerDetailsForm.gender.$setValidity('gender', true);
                $scope.proposerDetailsForm.maritalStatus.$setValidity('maritalStatus', true);
                $scope.errorMsg = false;
                for (var i = 0; i < $scope.selectedTravellers.length; i++) {
                    if ($scope.selectedTravellers[i].relation == SELF) {
                        $scope.changeRelation(i);
                        break;
                    }
                }
            }
            if ($scope.proposerDetails.maritalStatus == SINGLE) {
                for (var i = 0; i < $scope.selectedTravellers.length; i++) {
                    if ($scope.selectedTravellers[i].relation == SPOUSE || $scope.selectedTravellers[i].relation == SON || $scope.selectedTravellers[i].relation == DAUGHTER) {
                        $scope.proposerDetailsForm.maritalStatus.$setValidity('maritalStatus', false);
                        $scope.errorMsgFlag = true;
                        break;
                    }
                }
            } else {
                $scope.proposerDetailsForm.maritalStatus.$setValidity('maritalStatus', true);
                $scope.errorMsgFlag = false;
            }

        }

        //code added to check while change of DOB to recalculate or not
        $scope.validateDOB = function() {
            $scope.proposerAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
            if ($scope.productValidation.proposerAgeCheck) {
                $scope.validateData();
            } else {
                for (var i = 0; i < $scope.selectedTravellers.length; i++) {
                    if ($scope.selectedTravellers[i].relation == SELF) {
                        $scope.changeRelation(i);
                        break;
                    }
                }
            }
        }

        //code added to check while change of gender to recalculate quote or not
        $scope.validateGender = function() {
            if ($scope.productValidation.proposerAgeCheck) {
                $scope.validateData();
            } else {
                $scope.changeGender();
            }
        }

        //code added to check while on change of marital status recalculate quote or not
        $scope.validateMaritalStatus = function() {
            $scope.validateData();
        }
        $scope.backToResultScreen = function() {


            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $location.path("/sharefromAPI").search({
                    docId: $scope.bikeProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED,
                    LOB: 5
                });
            }

        }

    }]);