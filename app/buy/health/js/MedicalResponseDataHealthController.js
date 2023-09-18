/*
 * Description	: This controller file for medical proposal response data result.
 * Author		: Sayli Boralkar
 * Date			: 21 Aug 2017
 * Modification :
 * 
 * Sr.Id	   Date				Description																			Search ID			Modified By
 *
 * */
// var messageIDVar;
angular.module('proposalresdatahealth', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('proposalResponseDataHealthController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function ($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce) {
        //$rootScope.loading = true;
        loadDatbase(function () {
            $scope.healthProposalSectionHTML = wp_path + 'buy/health/html/healthProposalSection.html';

            //	$http.get(wp_path+'ApplicationLabels.json').then(function (applicationCommonLabels) {
            //$scope.globalLabel = applicationCommonLabels.data.globalLabels;
            $scope.p365Labels = healthProposalLabels;
            //localStorageService.set("applicationLabels", applicationCommonLabels.data);
            // $rootScope.loaderContent={businessLine:'4',header:'Health Insurance',desc:$sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct)};
            // $rootScope.title = $scope.globalLabel.policies365Title.medicalBuyQuote;
            $rootScope.loading = true;
            $scope.saveProposal = false;
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = false;
            $scope.screenFourStatus = false;
            $scope.redirectForPayment = false;
            $scope.screenFiveStatus = false;

            $scope.accordion = '1';
            $scope.editProposerInfo = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = false;
                $scope.screenThreeStatus = false;
                $scope.screenFiveStatus = false;
                $scope.screenSixStatus = false;
                $scope.accordion = '1';
                $scope.disableAllFields();
            };
            $scope.editInsuredInfo = function () {
                $scope.screenOneStatus = false;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.accordion = '3';
                $scope.disableAllFields();
            };
            $scope.editAddressInfo = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = false;
                $scope.accordion = '2';
                $scope.disableAllFields();
            };
            $scope.editNomineeInfo = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = true;
                $scope.accordion = '4';
                $scope.disableAllFields();
            };
            $scope.editMedicalInfo = function () {
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = true;
                $scope.screenFiveStatus = true;
                $scope.accordion = '5';
                $scope.disableAllFields();
            };



            $scope.Section2Inactive = true;
            $scope.Section3Inactive = true;
            $scope.Section4Inactive = true;
            $scope.Section5Inactive = true;

            $scope.submitProposerInfo = function () {
                $scope.accordion = '2';
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = false;
                $scope.screenFourStatus = false;
                $scope.screenFiveStatus = false;
                $scope.screenSixStatus = false;
                $scope.Section2Inactive = false;
                $scope.disableAllFields();
                //added by gauri for imautic
                if (imauticAutomation == true) {
                    imatEvent('ProposalFilled');
                }
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.proposalDetailsForm.$dirty || $scope.changeCompanyName) {
                        $scope.saveProposal = true;
                        $scope.submitProposalData();
                        $scope.proposalDetailsForm.$dirty = false;
                        $scope.changeCompanyName = false;

                    }
                }
            }

            $scope.submitAddressDetails = function () {
                $scope.accordion = '3';
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = false;
                $scope.screenFiveStatus = false;
                $scope.screenSixStatus = false;
                $scope.Section3Inactive = false;
                $scope.disableAllFields();
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.proposalDetailsForm.$dirty || $scope.changeCompanyName) {
                        $scope.saveProposal = true;
                        $scope.submitProposalData();
                        $scope.proposalDetailsForm.$dirty = false;
                        $scope.changeCompanyName = false;

                    }
                }
            };
            $scope.submitInsuredInfo = function () {
                $scope.accordion = '4';
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = true;
                $scope.screenFiveStatus = false;
                $scope.screenSixStatus = false;
                $scope.Section4Inactive = false;
                $scope.disableAllFields();
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.addInsuredForm.$dirty) {
                        $scope.saveProposal = true;
                        $scope.submitProposalData();
                        $scope.addInsuredForm.$dirty = false;
                    }
                }
            }

            $scope.submitNomineeInfo = function () {
                $scope.accordion = '5';
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = true;
                $scope.screenFiveStatus = true;
                $scope.screenSixStatus = false;
                $scope.Section5Inactive = false;
                $scope.disableAllFields();
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.addNomineeForm.$dirty) {
                        $scope.saveProposal = true;
                        $scope.submitProposalData();
                        $scope.addNomineeForm.$dirty = false;
                    }
                }
            }

            $scope.submitMedicalInfo = function () {
                $scope.accordion = '6';
                $scope.screenOneStatus = true;
                $scope.screenTwoStatus = true;
                $scope.screenThreeStatus = true;
                $scope.screenFourStatus = true;
                $scope.screenFiveStatus = true;
                $scope.screenSixStatus = true;
                $scope.Section6Inactive = false;
                $scope.disableAllFields();
                if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                    if ($scope.medicalDetailsForm.$dirty) {
                        $scope.saveProposal = true;
                        $scope.submitProposalData();
                        $scope.medicalDetailsForm.$dirty = false;
                    }
                }
            }

            $scope.disableAllFields = function () {
                if ($scope.proposalStatus) {
                    if ($scope.proposalStatus.statusPaym == "completed") {
                        setTimeout(function () {
                            $('form md-option').attr('disabled', 'disabled');
                            $('form md-select').attr('disabled', 'disabled');
                            $('input').attr('disabled', 'disabled');
                            $('md-radio-button').attr('disabled', 'disabled');
                            $('md-checkbox').attr('disabled', 'disabled');
                            $scope.insuranceDetailsForm.$invalid = true;
                        }, 1000);
                    }
                }
            }

            $scope.policytransaction = {};
            $scope.proposerInfo = {};
            $scope.proposerDetails = {};
            $scope.vehicleInfo = {};
            $scope.vehicleDetails = {};
            $scope.nominationInfo = {};
            $scope.nominationDetails = {};
            $scope.appointeeInfo = {};
            $scope.appointeeDetails = {};
            $scope.authenticate = {};
            $scope.insuranceInfo = {};
            $scope.insuranceDetails = {};
            $scope.proposalApp = {};
            $scope.coverageDetails = {};
            $scope.medicalQuestionarrier = [];
            $scope.proposalStatus = []
            $scope.proposalStatusForm = []
            $scope.declartionDetails = [];
            $scope.proposalApp.declartionDetails = [];
            $scope.proposalApp.declartionDetails.accepted = {};
            $scope.quoteUserInfo = {};

            $scope.salutationsList = [{ "value": "Mr", "display": "Mr." }, { "value": "Ms", "display": "Ms." }, { "value": "Mrs", "display": "Mrs." }];
            $scope.genderType = genderTypeGeneric;
            $scope.maritalStatusType = maritalStatusListGeneric;
            $scope.nomineeRelationType = nomineeRelationTypeGeneric;
            $scope.appointeeRelationType = nomineeRelationTypeGeneric;
            $scope.monthList = healthmonthListGeneric;

            $scope.undertakingList = religareUndertakingList;
            $scope.annualIncomesRange = annualIncomesGeneric;

            $scope.modalPropScreenError = false;

            $scope.selectedProduct = {};
            $scope.insuranceDetails = {};
            $scope.premiumDetails = [];
            $scope.proposerDetails = [];
            $scope.nominationInfo = [];
            $scope.nominationDetails = {};
            $scope.insuranceInfo = [];
            $scope.selectedProductInputParam = [];
            $scope.proposalApp.coverageDetails = {};
            $scope.proposalRequest = {};
            $scope.proposalRequest.coverageDetails = [];
            $scope.personalInfo = {};
            $scope.proposerInfo = {};
            $scope.proposalApp.proposerInfo = {};
            $scope.productValidation = [];
            //$scope.productValidation.heightWeightStatus = [];
            $scope.proposalApp.nomineeDetails = {};
            $scope.proposalApp.nomineeDetails.apointeeDetails = {};
            $scope.proposalApp.proposerInfo.personalInfo = {};
            $scope.proposalApp.proposerInfo.contactInfo = {};
            $scope.proposalApp.insuredMembers = [];
            $scope.permanentAddressDetails = {};
            $scope.insuredInfo = [];
            $scope.insuredInfo.height = [];
            $scope.insuredInfo.weight = [];
            $scope.insuredMembers = [];
            $scope.medicalQuestionarrie = [];
            $scope.mQuestion = [];
            $scope.mQuestion.questionCode = {};
            $scope.occupationList = [];
            $scope.proposalApp.previousPolicyDetails = {};
            $scope.previousPolicyDetails = [];
            $scope.nomineeAge = {};
            $scope.proposalRequest.medicalQuestionarrie = [];
            $scope.memberList = [];
            $scope.proposalApp.proposerInfo.permanentAddress = {};
            $scope.proposalApp.socialStatusDetails = {};

            $scope.coverageDetails.riders = [];
            $scope.healthProposalResponse = {};

            $scope.paymentResponse = {};
            $scope.healthPolicyResponse = {};
            $scope.income = {};
            $scope.income.annualIncome = {};
            $scope.diseaseList = [];

            $scope.insuredMemberDef = insuredMemberDef;

            var proposalDocParam = {};
            proposalDocParam.proposalId = $location.search().proposalId;
            proposalDocParam.businessLineId = $scope.p365Labels.businessLineType.health;



            $scope.iposRequest = {};
            // Record in crm.
            $scope.iposRequest.parent_id = String($rootScope.parent_id) != "undefined" ? $rootScope.parent_id : $location.search().recordId;
            $scope.iposRequest.parent_type = String($rootScope.parent_type) != "undefined" ? $rootScope.parent_type : $location.search().moduleName;
            $scope.iposRequest.requestType = $scope.p365Labels.request.createProposalRecord;

            RestAPI.invoke("proposalDataReader", proposalDocParam).then(function (proposalDataResponse) {
                if (proposalDataResponse.responsecode == $scope.p365Labels.responseCode.success) {
                    $scope.responseProduct = proposalDataResponse.data.PolicyTransaction;
                    $scope.proposalApp.documentType = "HealthProposalRequest";
                    $scope.proposalApp.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                    $scope.proposalApp.carrierId = $scope.responseProduct.carrierId;
                    $scope.proposalApp.planId = $scope.responseProduct.productId;
                    messageIDVar = $scope.responseProduct.leadMessageId;
                    // Adding campaign from proposal
                    campaign_id = $scope.responseProduct.campaign_id;
                    requestSource = $scope.responseProduct.requestSource;
                    sourceOrigin = $scope.responseProduct.source;
                    $scope.proposalApp.username = $scope.responseProduct.username;
                    $scope.proposalApp.agencyId = $scope.responseProduct.agencyId;

                    $scope.proposalApp.coverageDetails = $scope.responseProduct.proposalRequest.coverageDetails;

                    if ($scope.responseProduct.referralCode) {
                        $scope.proposalApp.referralCode = $scope.responseProduct.referralCode;
                    }

                    var buyScreenParam = {};
                    buyScreenParam.documentType = "proposalScreenConfig";
                    buyScreenParam.businessLineId = Number($scope.p365Labels.businessLineType.health);
                    buyScreenParam.carrierId = $scope.responseProduct.carrierId;
                    buyScreenParam.productId = Number($scope.responseProduct.productId);
                    buyScreenParam.QUOTE_ID = $scope.proposalApp.QUOTE_ID

                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.productDataReader, buyScreenParam, function (buyScreen) {
                        if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {
                            var buyScreens = buyScreen.data;

                            $scope.proposalDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                            $scope.insurerInfoTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
                            $scope.nomineeInfoTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                            $scope.medicalInfoTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);
                            $scope.prevPolicyDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[4].template);
                            $scope.personalIdDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[5].template);
                            $scope.productValidation = buyScreens.validation;

                            $scope.OTPFlag = $scope.productValidation.OTPFlag;
                            //for hdfc :accepted PreExisting disease
                            if ($scope.productValidation.acceptedPreExistDisease) {

                                $scope.proposalApp.acceptedPreExistDisease = {};
                                $scope.proposalApp.acceptedPreExistDisease.applicable = "false";
                            }


                            if ($scope.productValidation.individualFloaterPlan) { //added for future generali,if family floater plan if insured member is married not allowing to purchase policy
                                if ($scope.responseProduct.proposerInfo.personalInfo.martialStatus == "MARRIED")
                                    $scope.modalIndividualFloaterPlan = true;
                            }

                            getDocUsingIdQuoteDB(RestAPI, $scope.proposalApp.QUOTE_ID, function (quoteCalcDetails) {
                                var quoteCalcRequest = {};

                                quoteCalcRequest = quoteCalcDetails.quoteRequest;
                                $scope.quoteCalcResponse = quoteCalcDetails.quoteResponse;
                                quoteCalcRequest.sumInsured = $scope.responseProduct.proposalRequest.coverageDetails.sumAssured;

                                for (var j = 0; j < $scope.quoteCalcResponse.length; j++) {
                                    $scope.quoteCalcResponse[j].id = (j + 1);
                                }

                                for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                                    if ($scope.quoteCalcResponse[i].carrierId == $scope.responseProduct.carrierId &&
                                        $scope.quoteCalcResponse[i].planId == $scope.responseProduct.productId) {
                                        if ($scope.responseProduct.childPlanId) {
                                            if ($scope.quoteCalcResponse[i].childPlanId == $scope.responseProduct.childPlanId) {
                                                $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                                                $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                                                break;
                                            }
                                        } else {
                                            $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                                            $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                                            break;
                                        }
                                    }
                                }

                                $scope.changeInsuranceCompany = function () {
                                    $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;

                                    $scope.proposalApp.coverageDetails.totalPremium = $scope.selectedProduct.annualPremium;
                                    if ($scope.selectedProduct.carrierQuoteId != null && String($scope.selectedProduct.carrierQuoteId) != "undefined" && $scope.selectedProduct.carrierQuoteId != '') {
                                        $scope.proposalApp.coverageDetails.carrierQuoteId = $scope.selectedProduct.carrierQuoteId;
                                    }
                                    if ($scope.selectedProduct.serviceTax != null && String($scope.selectedProduct.serviceTax) != "undefined") {
                                        $scope.proposalApp.coverageDetails.serviceTax = $scope.selectedProduct.serviceTax;
                                    } else {
                                        $scope.proposalApp.coverageDetails.serviceTax = undefined;
                                    }
                                    $scope.proposalApp.coverageDetails.sumAssured = $scope.selectedProduct.sumInsured;
                                    //$scope.responseProduct.proposalRequest.premiumDetails=$scope.selectedProduct;
                                    $scope.changeCompanyName = true;
                                }

                                localStorageService.set("healthQuoteInputParamaters", quoteCalcRequest);

                                $scope.selectedProductInputParamForPin = angular.copy(localStorageService.get("healthQuoteInputParamaters"));
                                $scope.selectedProductInputParam = localStorageService.get("healthQuoteInputParamaters");

                                if ($scope.productValidation.requotecalc) {
                                    RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, quoteCalcRequest).then(function (callback) {
                                        $scope.healthRecalculateQuoteRequest = [];
                                        if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.responseRecalculateCodeList = [];
                                            localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                            localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                            $scope.healthRecalculateQuoteRequest = callback.data;

                                            $scope.healthQuoteResult = [];
                                            $scope.quoteCalcResponse = [];
                                            angular.forEach($scope.healthRecalculateQuoteRequest, function (obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                    success(function (callback, status) {
                                                        var healthQuoteResponse = JSON.parse(callback);
                                                        if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.responseProduct.productId) {
                                                                $scope.loading = false;
                                                                $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                $scope.checkForPanCardValidation();
                                                                if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                    $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                }
                                                                $scope.proposalDataReader();
                                                            }
                                                            healthQuoteResponse.data.quotes[0].id = healthQuoteResponse.messageId;
                                                            $scope.quoteCalcResponse.push(healthQuoteResponse.data.quotes[0]);
                                                        } else {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.responseProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.responseProduct.productId) {
                                                                $scope.loading = false;
                                                                $scope.propScreenError = $scope.p365Labels.validationMessages.generalisedErrMsg;
                                                                $scope.modalPropScreenError = true;
                                                            }
                                                        }
                                                    });
                                            });
                                        } else {
                                            $scope.propScreenError = $scope.p365Labels.validationMessages.generalisedErrMsg;
                                            $scope.modalPropScreenError = true;
                                        }
                                    });

                                } else {
                                    $scope.proposalDataReader();
                                }
                            });
                        }
                    });

                    $scope.redirectToQuote = function () {
                        $location.path("/quote");
                    }
                } else {
                    $scope.loading = false;
                    var buyScreenCnfrmError = $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                    $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                }


                $scope.proposalDataReader = function () {
                    getDocUsingId(RestAPI, "relationshipdetailslist", function (relationList) {
                        $scope.relationList = relationList.relationships;
                        var occupationDocId = $scope.p365Labels.documentType.healthOccupation + "-" + $scope.responseProduct.carrierId + "-" + $scope.responseProduct.productId;
                        getDocUsingId(RestAPI, occupationDocId, function (occupationList) {
                            localStorageService.set("healthBuyOccupationList", occupationList.Occupation);
                            $scope.occupationList = occupationList.Occupation;
                        });
                    });

                    $scope.selectedProduct.planName = $scope.responseProduct.planName;
                    $scope.selectedProduct.insuranceCompany = $scope.responseProduct.insuranceCompany;

                    $rootScope.loading = false;
                    $scope.proposalApp.coverageDetails.sumAssured = $scope.responseProduct.proposalRequest.coverageDetails.sumAssured;
                    $scope.proposalApp.proposerInfo = $scope.responseProduct.proposalRequest.proposerInfo;
                    /*					$scope.proposalApp.proposerInfo.personalInfo.firstName=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.firstName;
                    					$scope.proposalApp.proposerInfo.personalInfo.lastName=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.lastName;
                    					$scope.proposalApp.proposerInfo.personalInfo.salutation=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.salutation;
                    					$scope.proposalApp.proposerInfo.contactInfo.emailId=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.emailId;
                    					$scope.proposalApp.proposerInfo.contactInfo.mobile=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.mobile;
                    					$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.dateOfBirth;
                    					$scope.proposalApp.proposerInfo.personalInfo.gender=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.gender;
                    					$scope.proposalApp.proposerInfo.personalInfo.martialStatus=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.martialStatus;
                    					$scope.proposalApp.proposerInfo.personalInfo.pancard=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.pancard;
                    					$scope.proposalApp.proposerInfo.personalInfo.GSTIN=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.GSTIN;*/
                    $scope.storedDOB = angular.copy($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                    $scope.selectedGender = angular.copy($scope.proposalApp.proposerInfo.personalInfo.gender);

                    //for setting value for lead
                    $scope.quoteUserInfo.firstName = $scope.proposalApp.proposerInfo.personalInfo.firstName;
                    $scope.quoteUserInfo.lastName = $scope.proposalApp.proposerInfo.personalInfo.lastName;
                    $scope.quoteUserInfo.emailId = $scope.proposalApp.proposerInfo.contactInfo.emailId;
                    $scope.quoteUserInfo.mobileNumber = $scope.proposalApp.proposerInfo.contactInfo.mobile;
                    $scope.quoteUserInfo.termsCondition = true;
                    localStorageService.set("quoteUserInfo", $scope.quoteUserInfo);

                    /*	$scope.proposalApp.proposerInfo.contactInfo.aadharNumber=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.aadharNumber;
					$scope.proposalApp.proposerInfo.personalInfo.pincode=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.pincode;

					$scope.proposalApp.proposerInfo.permanentAddress.pincode=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.pincode;
					$scope.proposalApp.proposerInfo.permanentAddress.houseNo=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.houseNo;
					$scope.proposalApp.proposerInfo.permanentAddress.streetDetails=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.streetDetails;
					$scope.proposalApp.proposerInfo.permanentAddress.locality=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.locality;
					$scope.proposalApp.proposerInfo.permanentAddress.city=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.city;
					$scope.proposalApp.proposerInfo.permanentAddress.state=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.state;
*/
                    for (var i = 0; i < $scope.annualIncomesRange.length; i++) {
                        if ($scope.annualIncomesRange[i].annualIncome == $scope.responseProduct.proposalRequest.proposerInfo.personalInfo.annualIncome) {
                            $scope.annualIncome = $scope.annualIncomesRange[i];
                        }
                    }

                    /*	$scope.proposalApp.proposerInfo.contactInfo.houseNo=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.houseNo;
					$scope.proposalApp.proposerInfo.contactInfo.streetDetails=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.streetDetails;
					$scope.proposalApp.proposerInfo.contactInfo.pincode=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.pincode;
					$scope.proposalApp.proposerInfo.contactInfo.locality=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.locality;
					$scope.proposalApp.proposerInfo.contactInfo.city=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.city;
					$scope.proposalApp.proposerInfo.contactInfo.state=$scope.responseProduct.proposalRequest.proposerInfo.contactInfo.state;
*/
                    // Below piece of code added for iPos.
                    if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                        $scope.screenOneStatus = true;
                        $scope.screenTwoStatus = true;
                        $scope.screenThreeStatus = true;
                        $scope.screenFourStatus = true;
                        $scope.screenFiveStatus = true;
                        $scope.Section1Inactive = false;
                        $scope.Section2Inactive = true;
                        $scope.Section3Inactive = true;
                        $scope.Section4Inactive = true;
                        $scope.Section5Inactive = true;
                        $scope.accordion = '1';

                    }

                    //added for pancard validation
                    $scope.checkForPanCardValidation();

                    var proposerDOBOption = {};
                    proposerDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
                    proposerDOBOption.maximumYearLimit = "-" + $scope.productValidation.proposerAgeMin.age + "Y";
                    proposerDOBOption.changeMonth = true;
                    proposerDOBOption.changeYear = true;
                    proposerDOBOption.dateFormat = "dd/mm/yy";
                    $scope.proposerDOBOptions = setP365DatePickerProperties(proposerDOBOption);

                    if ($scope.selectedProduct.selectedFamilyMembers) {
                        for (var i = 0; i < $scope.selectedProduct.selectedFamilyMembers.length; i++) {
                            if ($scope.selectedProduct.selectedFamilyMembers[i].relationship == "CH") {
                                var childMinDOBOption = $scope.selectedProduct.selectedFamilyMembers[i].minDOB;
                                var childMaxDOBOption = $scope.selectedProduct.selectedFamilyMembers[i].maxDOB;


                            }
                            if ($scope.selectedProduct.selectedFamilyMembers[i].relationship == "SP" || $scope.selectedProduct.selectedFamilyMembers[i].relationship == "A") {
                                var selfMinDOBOption = $scope.selectedProduct.selectedFamilyMembers[i].minDOB;
                                var selfMaxDOBOption = $scope.selectedProduct.selectedFamilyMembers[i].maxDOB;
                            }

                            var selfInsuredDOBOption = {};
                            if (selfMinDOBOption && selfMaxDOBOption) {
                                selfInsuredDOBOption.minimumDateStringFormat = selfMinDOBOption;
                                selfInsuredDOBOption.maximumDateStringFormat = selfMaxDOBOption;
                            } else {
                                selfInsuredDOBOption.minimumYearLimit = "-" + $scope.productValidation.insuredAdultAgeMax.age + "Y";
                                selfInsuredDOBOption.maximumYearLimit = "-" + $scope.productValidation.insuredAdultAgeMin.age + "Y";
                            }
                            selfInsuredDOBOption.changeMonth = true;
                            selfInsuredDOBOption.changeYear = true;
                            selfInsuredDOBOption.dateFormat = "dd/mm/yy";
                            $scope['selfInsuredDateOptions' + i] = setP365DatePickerProperties(selfInsuredDOBOption);

                            // need to check if validations are getting based on number of family members selected at the time of quote.
                            if ($scope.productValidation.insuredChildAgeMax != null) {
                                var childInsuredDateOption = {};
                                if (childMinDOBOption && childMaxDOBOption) {
                                    childInsuredDateOption.minimumDateStringFormat = childMinDOBOption;
                                    childInsuredDateOption.maximumDateStringFormat = childMaxDOBOption;
                                } else {
                                    childInsuredDateOption.minimumYearLimit = "-" + $scope.productValidation.insuredChildAgeMax.age + "Y";
                                    childInsuredDateOption.maximumYearLimit = "-" + $scope.productValidation.insuredChildAgeMin.age + "Y";
                                }
                                childInsuredDateOption.changeMonth = true;
                                childInsuredDateOption.changeYear = true;
                                childInsuredDateOption.dateFormat = "dd/mm/yy";
                                $scope['childInsuredDateOptions' + i] = setP365DatePickerProperties(childInsuredDateOption);
                            }
                        }
                    }

                    var nomineeDOBOption = {};
                    nomineeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
                    nomineeDOBOption.maximumYearLimit = "-1Y";
                    nomineeDOBOption.changeMonth = true;
                    nomineeDOBOption.changeYear = true;
                    nomineeDOBOption.dateFormat = "dd/mm/yy";
                    /*nomineeDOBOption.dateFormnomineeDOBOptionsat = "dd/mm/yy";*/
                    $scope.nomineeDOBOptions = setP365DatePickerProperties(nomineeDOBOption);

                    var appointeeDOBOption = {};
                    appointeeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
                    appointeeDOBOption.maximumYearLimit = "-18Y";
                    appointeeDOBOption.changeMonth = true;
                    appointeeDOBOption.changeYear = true;
                    appointeeDOBOption.dateFormat = "dd/mm/yy";
                    $scope.appointeeDOBOptions = setP365DatePickerProperties(appointeeDOBOption);

                    var DOBOption = {};
                    DOBOption.minimumYearLimit = "-50Y";
                    DOBOption.maximumYearLimit = "-0Y";
                    DOBOption.changeMonth = true;
                    DOBOption.changeYear = true;
                    DOBOption.dateFormat = "dd/mm/yy";
                    $scope.regularDOBOptions = setP365DatePickerProperties(DOBOption);

                    /*//Prepared occupation list.
                    var occupation  = {};
                    occupation.occupation=$scope.responseProduct.proposalRequest.proposerInfo.personalInfo.occupation;
                    $scope.occupationList.push(occupation);*/

                    $scope.proposalApp.proposerInfo.personalInfo.occupation = $scope.responseProduct.proposalRequest.proposerInfo.personalInfo.occupation;
                    $scope.permanentAddressDetails = $scope.responseProduct.proposalRequest.proposerInfo.permanentAddress;
                    /*if(!$scope.permanentAddressDetails.isAddressSameAsCommun)
                    {
                    	$scope.permanentAddressDetails=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress;
                    	$scope.permanentAddressDetails.streetDetails=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.streetDetails;
                    	$scope.permanentAddressDetails.pincode=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.pincode;
                    	$scope.permanentAddressDetails.locality=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.locality;
                    	$scope.permanentAddressDetails.city=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.city;
                    	$scope.permanentAddressDetails.state=$scope.responseProduct.proposalRequest.proposerInfo.permanentAddress.state;
                    }*/

                    /*added for missing fields Dany*/
                    $scope.proposalApp.proposerInfo.personalInfo.isAddressSameAsCommun = $scope.permanentAddressDetails.isAddressSameAsCommun
                    $scope.proposalApp.proposerInfo.personalInfo.houseNo = $scope.responseProduct.proposalRequest.proposerInfo.contactInfo.houseNo;
                    $scope.proposalApp.proposerInfo.personalInfo.streetDetails = $scope.responseProduct.proposalRequest.proposerInfo.contactInfo.streetDetails;
                    /*End*/

                    $scope.proposalApp.insuredMembers = $scope.responseProduct.proposalRequest.insuredMembers;
                    //$scope.productValidation.heightWeightStatus = true;
                    $scope.proposalApp.nomineeDetails = $scope.responseProduct.proposalRequest.nomineeDetails;
                    /*$scope.proposalApp.nomineeDetails.firstName=$scope.responseProduct.proposalRequest.nomineeDetails.firstName;
                    $scope.proposalApp.nomineeDetails.lastName=$scope.responseProduct.proposalRequest.nomineeDetails.lastName;
                    $scope.proposalApp.nomineeDetails.dateOfBirth=$scope.responseProduct.proposalRequest.nomineeDetails.dateOfBirth;
                    $scope.proposalApp.nomineeDetails.proposerRelationship=$scope.responseProduct.proposalRequest.nomineeDetails.proposerRelationship;
                    */
                    if ($scope.productValidation.isNomineeSalutationRequired) {
                        $scope.proposalApp.nomineeDetails.salutation = $scope.responseProduct.proposalRequest.nomineeDetails.salutation;
                    }
                    if ($scope.responseProduct.proposalRequest.nomineeDetails.dateOfBirth !== null) {
                        $scope.nomineeAge = getAgeFromDOB($scope.proposalApp.nomineeDetails.dateOfBirth);
                    }
                    if ($scope.nomineeAge < 18) {
                        $scope.proposalApp.nomineeDetails.apointeeDetails = $scope.responseProduct.proposalRequest.nomineeDetails.apointeeDetails;
                        /*$scope.proposalApp.nomineeDetails.apointeeDetails.firstName=$scope.responseProduct.proposalRequest.nomineeDetails.apointeeDetails.firstName;
                        					$scope.proposalApp.nomineeDetails.apointeeDetails.lastName=$scope.responseProduct.proposalRequest.nomineeDetails.apointeeDetails.lastName;
                        					$scope.proposalApp.nomineeDetails.apointeeDetails.dateOfBirth=$scope.responseProduct.proposalRequest.nomineeDetails.apointeeDetails.dateOfBirth;
                        					$scope.proposalApp.nomineeDetails.apointeeDetails.nomineeRelationship=$scope.responseProduct.proposalRequest.nomineeDetails.apointeeDetails.nomineeRelationship;*/

                    }

                    //queastionaries part added in medical details form

                    $scope.numRecords = 4;
                    $scope.page = 1;
                    var diseaseList;
                    $scope.masterDieaseDetails = {};

                    for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                        for (var diseaseCount = 0; diseaseCount < $scope.proposalApp.insuredMembers[i].dieaseDetails.length; diseaseCount++) {
                            var key = $scope.proposalApp.insuredMembers[i].relationshipCode + '-' + $scope.proposalApp.insuredMembers[i].dieaseDetails[diseaseCount].masterDiseaseCode;
                            $scope.masterDieaseDetails[key] = $scope.proposalApp.insuredMembers[i].dieaseDetails[diseaseCount];
                        }
                    }

                    var searchData = {};
                    searchData.documentType = "DiseaseQuestion";
                    searchData.carrierId = $scope.responseProduct.carrierId;
                    searchData.planId = $scope.responseProduct.productId;
                    searchData.riders = $scope.responseProduct.proposalRequest.coverageDetails.riders;
                    getDocUsingParam(RestAPI, "getHealthQuestionList", searchData, function (callback) {
                        $scope.medicalQuestionarrier = callback.data;

                        for (var i = 0; i < $scope.responseProduct.proposalRequest.medicalQuestionarrie.length; i++) {
                            if ($scope.responseProduct.proposalRequest.medicalQuestionarrie[i].questionCode == 'PREXDISEA') {
                                if ($scope.responseProduct.proposalRequest.medicalQuestionarrie[i].applicable == 'true') {
                                    $scope.diseaseShow = true;
                                    $scope.preDiseaseApplicable = 'true';
                                    $scope.clicktoShowDisease();
                                }
                            }
                        }

                        for (var i = 0; i < $scope.medicalQuestionarrier.length; i++) {
                            for (var j = 0; j < $scope.responseProduct.proposalRequest.medicalQuestionarrie.length; j++) {
                                if ($scope.medicalQuestionarrier[i].questionCode == $scope.responseProduct.proposalRequest.medicalQuestionarrie[j].questionCode) {
                                    $scope.medicalQuestionarrier[i].applicable = $scope.responseProduct.proposalRequest.medicalQuestionarrie[j].applicable;
                                    break;
                                }

                            }
                        }

                        var searchDiseaseData = {};
                        searchDiseaseData.documentType = "DiseaseMapping";
                        searchDiseaseData.carrierId = $scope.responseProduct.carrierId;
                        searchDiseaseData.planId = $scope.responseProduct.productId;
                        searchDiseaseData.riders = $scope.responseProduct.proposalRequest.coverageDetails.riders;
                        getDocUsingParam(RestAPI, "getHealthQuestionList", searchDiseaseData, function (callback) {
                            if (callback.data) {
                                $scope.diseaseList = callback.data;
                                $scope.numberOfPages = Math.ceil($scope.diseaseList.length / $scope.numRecords);
                                $scope.diseaseListDisable = angular.copy($scope.diseaseList);
                                for (var i = 0; i < $scope.diseaseListDisable.length; i++) {
                                    $scope.diseaseListDisable[i].subParentId = $scope.diseaseListDisable[i].parentId
                                }
                            }
                        });
                    });

                    $scope.isDieaseApplicable = function (relationshipCode, masterDieasesCode) {
                        var key = relationshipCode + "-" + masterDieasesCode;
                        if ($scope.masterDieaseDetails[key] != null) {
                            if ($scope.masterDieaseDetails[key].applicable == true) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                    }
                    $scope.isDisableApplicable = function (parentId) {
                        for (var i = 0; i < $scope.diseaseListDisable.length; i++) {
                            if (parentId == $scope.diseaseListDisable[i].subParentId) {
                                return false;
                            }
                            return true;
                        }
                    }

                    $scope.diseaseShow = false;
                    $scope.clicktoShowDisease = function () {
                        $scope.diseaseShow = true;
                    };
                    $scope.clicktoHideDisease = function () {
                        $scope.diseaseShow = false;
                    };

                    $scope.bmiError = false;
                    $scope.isRegreatPolicyMsg = false;
                    var quesArr = [];
                    var regreatPolicyArr = [];
                    $scope.inputTypeCheck = function (sel, quesId, mquestion) {
                        if (sel == 'true') {
                            $scope.selectedQuestions = quesId;
                            if ((!$scope.productValidation.isBmiValidationApplicable) && ($scope.productValidation.isBmiValidationApplicable != undefined))
                                quesArr.push(quesId);
                            //added for future generali based on regreatPolicy flag user allowed to proceed further.
                            //for some medical question if we select 'yes' and for some medical question if we select 'no' ,restrict user for proceding further
                            if (mquestion.isRegretPolicy == 'Y') {
                                regreatPolicyArr.push(quesId);
                                var screenCnfrmError = $scope.p365Labels.errorMessage.regretPolicyMsg;
                                $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                            } else if (regreatPolicyArr.length > 0) {
                                regreatPolicyArr.splice(-1, quesId);
                            }
                        } else {
                            if ((!$scope.productValidation.isBmiValidationApplicable) && ($scope.productValidation.isBmiValidationApplicable != undefined)) {
                                if (quesArr.length > 0)
                                    quesArr.splice(-1, quesId);
                            }
                            for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                for (var j = 0; j < $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.length; j++) {
                                    if (quesId == $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].questionCode) {
                                        $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].applicable = 'false';
                                    }
                                }
                            }
                            if (mquestion.isRegretPolicy == 'N') {
                                regreatPolicyArr.push(quesId);
                                var screenCnfrmError = $scope.p365Labels.errorMessage.regretPolicyMsg;
                                $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                            } else if (regreatPolicyArr.length > 0) {
                                regreatPolicyArr.splice(-1, quesId);
                            }
                        }
                        if (quesArr.length > 0) {
                            $scope.bmiError = true;
                        } else {
                            $scope.bmiError = false;
                        }
                        if (regreatPolicyArr.length > 0) {
                            $scope.isRegreatPolicyMsg = true;
                        } else {
                            $scope.isRegreatPolicyMsg = false;
                        }
                    }

                    /*Star health*/
                    $scope.TermsCheck = function (sel) {
                        if (sel == 'true') {
                            $scope.checkForStartHealth = false;
                        } else {
                            $scope.checkForStartHealth = true;
                        }
                    }
                    $scope.mediError = false;
                    $scope.mediCheck = function (sel) {
                        if (sel == 'true') {
                            $scope.checkForStartHealth = true;
                            $scope.mediError = true;
                        } else {
                            $scope.checkForStartHealth = false;
                            $scope.mediError = false;
                        }
                    }



                    /*End*/

                    //show feedback form popup.
                    $scope.showTermsDiv = false;
                    $rootScope.showTerms = function () {
                        $scope.showTermsDiv = true;
                    };

                    $rootScope.closeTerms = function () {
                        $scope.showTermsDiv = false;
                    };


                    $scope.next = function () {
                        $scope.page = $scope.page + 1;
                    };

                    $scope.back = function () {
                        $scope.page = $scope.page - 1;
                    };

                    $scope.questionLength = [];
                    $scope.selDiseaseList = [];

                    $scope.stateChanged = function (qId, relationship, id) {
                        var i;

                        if (qId.applicable == true) {
                            for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                if ($scope.proposalApp.insuredMembers[i].relationship == relationship) {
                                    for (var j = 0; j < $scope.proposalApp.insuredMembers[i].dieaseDetails.length; j++) {
                                        if ($scope.proposalApp.insuredMembers[i].dieaseDetails[j].masterDiseaseCode == qId.masterDiseaseCode) {
                                            $scope.proposalApp.insuredMembers[id].dieaseDetails[j].applicable = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                if ($scope.proposalApp.insuredMembers[i].relationship == relationship) {
                                    for (var j = 0; j < $scope.proposalApp.insuredMembers[i].dieaseDetails.length; j++) {
                                        if ($scope.proposalApp.insuredMembers[i].dieaseDetails[j].masterDiseaseCode == qId.masterDiseaseCode) {
                                            $scope.proposalApp.insuredMembers[id].dieaseDetails[j].applicable = false;
                                        }
                                    }
                                }
                            }
                        }

                        for (i = 0; i < $scope.questionLength.length; i++) {
                            if ($scope.questionLength[i].dieaseCode == qId.dieaseCode) {
                                $scope.questionLength.splice(i, 1);
                                break;
                            }
                        }
                        $scope.questionLength.push(qId);
                    };

                    //$scope.proposalApp.insuredMembers.carrierMedicalQuestion=[];
                    $scope.stateChangedMedical = function (ques, sel, relation) {
                        var i, j;
                        if ($scope.productValidation.smokingFlag && ques.questionCode == "SMOKE") {
                            $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.smokingStatusChangeMsg, "No", "Yes", function (confirmStatus) {
                                if (confirmStatus) {
                                    $scope.loading = true;

                                    if (sel == true) {
                                        for (i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                            if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == relation) {
                                                $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking = 'Y';
                                                $scope.proposalApp.insuredMembers[i].isSmoking = 'Y';
                                                break;
                                            }
                                        }
                                    } else {
                                        for (i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                            if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == relation) {
                                                $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking = 'N';
                                                $scope.proposalApp.insuredMembers[i].isSmoking = 'N';
                                                break;
                                            }
                                        }
                                    }

                                    if ($scope.selectedProduct.childPlanId) {
                                        $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                                    }
                                    $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                                    if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                        $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                                    }
                                    RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.selectedProductInputParamForPin).then(function (callback) {
                                        $scope.healthRecalculateQuoteRequest = [];
                                        if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.responseRecalculateCodeList = [];
                                            localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                            localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                            $scope.healthRecalculateQuoteRequest = callback.data;

                                            $scope.healthQuoteResult = [];
                                            $scope.quoteCalcResponse = [];
                                            angular.forEach($scope.healthRecalculateQuoteRequest, function (obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                    success(function (callback, status) {
                                                        var healthQuoteResponse = JSON.parse(callback);
                                                        $scope.responseRecalculateCodeList.push(healthQuoteResponse.responseCode);
                                                        if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                                if (healthQuoteResponse.data.quotes[0].childPlanId) {
                                                                    if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                        $scope.loading = false;
                                                                        $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                        $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                        $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                        if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                            $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                        }
                                                                    }
                                                                } else {
                                                                    $scope.loading = false;
                                                                    $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                    $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                    $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                    if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                        $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                    }
                                                                }
                                                            }
                                                            healthQuoteResponse.data.quotes[0].id = healthQuoteResponse.messageId;
                                                            $scope.quoteCalcResponse.push(healthQuoteResponse.data.quotes[0]);
                                                        } else {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                                $scope.loading = false;
                                                                //$scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking=!$scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking;
                                                                for (i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                                                    if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == relation) {
                                                                        if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking == 'Y') {
                                                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking = 'N';
                                                                            $scope.proposalApp.insuredMembers[i].isSmoking = 'N';
                                                                            break;
                                                                        } else if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking == 'N') {
                                                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking = 'Y';
                                                                            $scope.proposalApp.insuredMembers[i].isSmoking = 'Y';
                                                                            break;
                                                                        }

                                                                    }
                                                                }
                                                                for (i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                                                    if ($scope.proposalApp.insuredMembers[i].relationship == relation) {
                                                                        for (j = 0; j < $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.length; j++) {
                                                                            if (ques.questionId == $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].questionCode) {
                                                                                if (sel == true) {
                                                                                    $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].applicable = 'false';
                                                                                    break;
                                                                                } else if (sel == false) {
                                                                                    $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].applicable = true;
                                                                                    break;
                                                                                }


                                                                            }
                                                                        }
                                                                    }
                                                                }

                                                                var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgSmoking
                                                                $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                            }
                                                        }
                                                    }).
                                                    error(function (data, status) {
                                                        $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                        $scope.loading = false;
                                                    });
                                            });

                                        } else {
                                            $scope.loading = false;
                                            //$scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking=!$scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking;	
                                            for (i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                                if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == relation) {
                                                    if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking) {
                                                        if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking == 'Y') {
                                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking = 'N';
                                                            $scope.proposalApp.insuredMembers[i].isSmoking = 'N';
                                                            break;
                                                        } else if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking == 'N') {
                                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].isSmoking = 'Y';
                                                            $scope.proposalApp.insuredMembers[i].isSmoking = 'Y';
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            for (i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                                if ($scope.proposalApp.insuredMembers[i].relationship == relation) {
                                                    for (j = 0; j < $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.length; j++) {
                                                        if (ques.questionId == $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].questionCode) {
                                                            if (sel == true) {
                                                                $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].applicable = 'false';
                                                                break;
                                                            } else if (sel == false) {
                                                                $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].applicable = true;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgSmoking
                                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                        }

                                    });
                                } else {
                                    $scope.loading = false;
                                    for (i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                        if ($scope.proposalApp.insuredMembers[i].relationship == relation) {
                                            for (j = 0; j < $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.length; j++) {
                                                if (ques.questionId == $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].questionCode) {
                                                    if (sel == true) {
                                                        $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].applicable = 'false';
                                                        break;
                                                    } else if (sel == false) {
                                                        $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j].applicable = true;
                                                        break;
                                                    }

                                                }
                                            }
                                        }
                                    }
                                }

                            });
                        }
                    };

                    $scope.proposalApp.previousPolicyDetails.policyNumber = $scope.responseProduct.proposalRequest.previousPolicyDetails.policyNumber;
                    $scope.proposalApp.socialStatusDetails.socialStatus = $scope.responseProduct.proposalRequest.socialStatusDetails.socialStatus;
                    $scope.proposalApp.socialStatusDetails.belowPovertyLine = $scope.responseProduct.proposalRequest.socialStatusDetails.belowPovertyLine;
                    $scope.proposalApp.socialStatusDetails.informalSector = $scope.responseProduct.proposalRequest.socialStatusDetails.informalSector;
                    $scope.proposalApp.socialStatusDetails.phyicallyChallenged = $scope.responseProduct.proposalRequest.socialStatusDetails.phyicallyChallenged;
                    $scope.proposalApp.socialStatusDetails.unorganizedSector = $scope.responseProduct.proposalRequest.socialStatusDetails.unorganizedSector;

                    $scope.proposalApp.declartionDetails[0].accepted = $scope.responseProduct.proposalRequest.declartionDetails[0].accepted;

                    //Proposal Form Details
                    $scope.proposalStatusform = true;

                    if ($scope.responseProduct.healthProposalResponse != null) {
                        $scope.proposalStatus.statusDateProp = $scope.responseProduct.healthProposalResponse.updatedDate;
                        $scope.proposalStatus.statusProp = "completed";
                    }
                    if ($scope.responseProduct.paymentResponse != null) {
                        if ($scope.responseProduct.paymentResponse.transactionStatusCode == 1) {
                            $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                            $scope.proposalStatus.statusPaym = "completed";
                            $scope.disableAllFields = function () {
                                setTimeout(function () {
                                    $('form md-option').attr('disabled', 'disabled');
                                    $('form md-select').attr('disabled', 'disabled');
                                    $('input').attr('disabled', 'disabled');
                                    $('md-radio-button').attr('disabled', 'disabled');
                                    $('md-checkbox').attr('disabled', 'disabled');
                                    $scope.insuranceDetailsForm.$invalid = true;
                                }, 1000);
                            }
                        } else if ($scope.responseProduct.paymentResponse.transactionStatusCode == 0) {
                            $scope.proposalStatus.statusDatePaym = $scope.responseProduct.paymentResponse.updatedDate;
                            $scope.proposalStatus.statusPaym = "failed";
                        } else {
                            $scope.proposalStatus.statusPaym = "pending";
                            $scope.proposalStatus.statusPoli = "pending";
                        }
                    }
                    if ($scope.responseProduct.healthPolicyResponse != null) {
                        if ($scope.responseProduct.healthPolicyResponse.transactionStatusCode == 1) {
                            $scope.proposalStatus.statusDatePoli = $scope.responseProduct.healthPolicyResponse.updatedDate;
                            $scope.proposalStatus.statusPoli = "completed";
                        } else if ($scope.responseProduct.healthPolicyResponse.transactionStatusCode == 0) {
                            $scope.proposalStatus.statusDatePoli = $scope.responseProduct.healthPolicyResponse.updatedDate;
                            $scope.proposalStatus.statusPoli = "failed";
                        }
                    }

                    $scope.showAuthenticateForm = function () {
                        var validateAuthParam = {};
                        validateAuthParam.paramMap = {};
                        validateAuthParam.mobileNumber = $scope.proposalApp.proposerInfo.contactInfo.mobile;
                        validateAuthParam.funcType = $scope.p365Labels.functionType.optAuth;
                        validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function (createOTP) {
                            if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.createOTPError = "";
                                $scope.modalOTP = true;
                            } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                                $scope.createOTPError = createOTP.message;
                                $scope.modalOTPError = true;
                            } else {
                                $scope.createOTPError = $scope.p365Labels.errorMessage.createOTP;
                                $scope.modalOTPError = true;
                            }
                        });
                    };

                    $scope.hideModal = function () {
                        $scope.modalOTP = false;
                    };

                    $scope.hideModalError = function () {
                        $scope.modalOTPError = false;
                    };
                    //$scope.screenOneStatus = true;
                    //alert($scope.screenOneStatus);

                    $scope.resendOTP = function () {
                        var validateAuthParam = {};
                        validateAuthParam.paramMap = {};
                        validateAuthParam.mobileNumber = $scope.proposalApp.proposerInfo.contactInfo.mobile;
                        validateAuthParam.funcType = $scope.p365Labels.functionType.optAuth;
                        validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;

                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function (createOTP) {
                            if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.invalidOTPError = "";
                            } else if (createOTP.responseCode == $scope.p365Labels.responseCode.userNotExist) {
                                $scope.invalidOTPError = createOTP.message;
                            } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                                $scope.invalidOTPError = createOTP.message;
                                $scope.disableOTP = true;
                            } else if (createOTP.responseCode == $scope.p365Labels.responseCode.mobileInvalidCode) {
                                $scope.invalidOTPError = createOTP.message;
                            } else {
                                $scope.invalidOTPError = $scope.p365Labels.errorMessage.createOTP;
                            }
                        });
                    };

                    $scope.validateAuthenticateForm = function () {
                        //OTP check
                        var proposalSubmitConfirmMsg = "Please make sure you have entered the right Mobile Number and Email ID. All our communication will be sent to your Mobile " + $scope.proposalApp.proposerInfo.contactInfo.mobile + " or Email " + $scope.proposalApp.proposerInfo.contactInfo.emailId + ". Is the entered Mobile No. and Email ID right?";
                        $rootScope.P365Confirm("Policies365", proposalSubmitConfirmMsg, "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                if ($scope.OTPFlag) {
                                    $scope.showAuthenticateForm();

                                } else if (!$scope.OTPFlag) {
                                    $scope.proceedForPayment();
                                }
                            }
                        });
                    };

                    var bmiArr = [];
                    var validBMI = 33;
                    $scope.bmiMsg = false;
                    $scope.bmiValidation = function (insuredInfo, index) {
                        if (!isNaN(insuredInfo.weight) && !isNaN(insuredInfo.height)) {
                            if (String(insuredInfo.weight).length > 0 && String(insuredInfo.height).length > 0) {
                                var height = Number(insuredInfo.height);
                                var weight = Number(insuredInfo.weight);
                                var bmi = (weight / (height * height)) * 10000;
                                var bmiVal = Math.round(bmi);
                                if ($scope.productValidation.bmirequotecalc) {
                                    if (bmi > Number($scope.productValidation.bmiMaxLimit) || bmi < Number($scope.productValidation.bmiMinLimit)) {
                                        $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.invalidOptionBuyPolicy, "Ok");

                                        //$scope.bmiValidationCount.splice(-1,1);
                                        insuredInfo.height = "";
                                        insuredInfo.weight = "";
                                        return false;
                                    } else if (bmi > 30 && bmi <= 34) {
                                        //$scope.count=$scope.count+1;
                                        //$scope.bmiValidationCount.push($scope.count);
                                        $scope.reCalcQuoteOnBMI(bmiVal, insuredInfo);
                                    } else if (bmi < 18.5 || bmi > 34) {
                                        var screenCnfrmError = $scope.p365Labels.errorMessage.regretPolicyMsg;
                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                        insuredInfo.height = '';
                                        insuredInfo.weight = '';
                                    }
                                } else {
                                    //isBmiValidationApplicable flag added for royal sundaram for showing bmi popup to user and allowing user for proceeding further.
                                    if ((!$scope.productValidation.isBmiValidationApplicable) && ($scope.productValidation.isBmiValidationApplicable != undefined)) {
                                        if (bmi > Number($scope.productValidation.bmiMaxLimit)) {
                                            bmiArr[index] = bmi;
                                        } else {
                                            bmiArr[index] = bmi;
                                        }
                                        for (var i = 0; i < bmiArr.length; i++) {
                                            if (bmiArr[i] > validBMI) {
                                                $scope.bmiMsg = true;
                                                break;
                                            } else {
                                                $scope.bmiMsg = false;
                                            }
                                        }
                                    } else {
                                        //added for star health .for star health if bmi  is invalid ,restrict user for proceeding further 
                                        if (bmi > Number($scope.productValidation.bmiMaxLimit) || bmi < Number($scope.productValidation.bmiMinLimit)) {
                                            $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.invalidOptionBuyPolicy, "Ok");
                                            //$scope.bmiValidationCount.splice(-1,1);
                                            insuredInfo.height = "";
                                            insuredInfo.weight = "";
                                            return false;
                                        }
                                    }
                                }
                            }
                            /*if($scope.bmiValidationCount.length > 0)
                              {
                            	  $scope.reCalcQuoteOnBMI(bmiVal,selInsuredInfo);
                              }
                              else if($scope.bmiValidationCount.length== 0)
                              {
                            	  $scope.proposalApp.coverageDetails.totalPremium=$scope.originalPremium;  
                              }*/
                        }
                    };

                    //function created to recalculate quote on BMI for future generali
                    $scope.reCalcQuoteOnBMI = function (bmiVal, selInsuredInfo) {
                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.bmiChangeMsg, "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;

                                for (var i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                    if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == selInsuredInfo.relationship) {
                                        $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].bmi = bmiVal;
                                        break;
                                    }
                                }
                                for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                    if ($scope.proposalApp.insuredMembers[i].relationship == selInsuredInfo.relationship) {
                                        $scope.proposalApp.insuredMembers[i].bmi = bmiVal;
                                        break;
                                    }
                                }

                                if ($scope.selectedProduct.childPlanId != null) {
                                    $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                                }
                                $scope.selectedProductInputParamForPin.sumInsured = Number($scope.selectedProduct.sumInsured);
                                RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.selectedProductInputParamForPin).then(function (callback) {
                                    $scope.healthRecalculateQuoteRequest = [];
                                    if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                        $scope.responseRecalculateCodeList = [];

                                        localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                        localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                        $scope.healthRecalculateQuoteRequest = callback.data;

                                        $scope.healthQuoteResult = [];
                                        $scope.quoteCalcResponse = [];
                                        angular.forEach($scope.healthRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var healthQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(healthQuoteResponse.responseCode);
                                                    if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                        if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                            if (healthQuoteResponse.data.quotes[0].childPlanId) {
                                                                if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                    $scope.loading = false;
                                                                    $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                    $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                    $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                    $scope.checkForPanCardValidation();
                                                                    if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                        $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                    }
                                                                }
                                                            } else {
                                                                $scope.loading = false;
                                                                $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                $scope.checkForPanCardValidation();
                                                                if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                    $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                }
                                                            }
                                                        }
                                                        healthQuoteResponse.data.quotes[0].id = healthQuoteResponse.messageId;
                                                        $scope.quoteCalcResponse.push(healthQuoteResponse.data.quotes[0]);
                                                    } else {
                                                        if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                            if ($scope.selectedProduct.childPlanId) {
                                                                if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                    $scope.loading = false;
                                                                    //$scope.proposalApp.proposerInfo.personalInfo.gender
                                                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgBmi
                                                                    $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                                }
                                                            } else {
                                                                $scope.loading = false;
                                                                selInsuredInfo.height = '';
                                                                selInsuredInfo.weight = '';
                                                                for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                                                    if ($scope.proposalApp.insuredMembers[i].relationship == selInsuredInfo.relationship) {
                                                                        $scope.proposalApp.insuredMembers[i].bmi = 0;
                                                                        break;
                                                                    }
                                                                }
                                                                var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgBmi
                                                                $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                            }
                                                        }
                                                    }
                                                }).
                                                error(function (data, status) {
                                                    $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                    $scope.loading = false;
                                                });
                                        });

                                    } else {
                                        $scope.loading = false;
                                        selInsuredInfo.height = '';
                                        selInsuredInfo.weight = '';
                                        for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                            if ($scope.proposalApp.insuredMembers[i].relationship == selInsuredInfo.relationship) {
                                                $scope.proposalApp.insuredMembers[i].bmi = 0;
                                                break;
                                            }
                                        }
                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgBmi
                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                    }

                                });
                            } else {
                                $scope.loading = false;
                                selInsuredInfo.height = '';
                                selInsuredInfo.weight = '';
                                for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                    if ($scope.proposalApp.insuredMembers[i].relationship == selInsuredInfo.relationship) {
                                        $scope.proposalApp.insuredMembers[i].bmi = 0;
                                        break;
                                    }
                                }

                            }
                        });
                    }


                    $scope.changeInsuredHeight = function (insuredInfo, index) {
                        if ($scope.productValidation.bmiValidationFlag) {
                            var insuredAge = getAgeFromDOB(insuredInfo.dateOfBirth);
                            if (insuredAge <= $scope.productValidation.bmiChildMinAgeLimit) {
                                return;
                            } else if (insuredAge > $scope.productValidation.bmiChildMinAgeLimit) {
                                $scope.bmiValidation(insuredInfo, index);
                            }
                            /*if($scope.bmiValidation(selInsuredInfo)){
                            	$scope.insuredInfoFormStatus = true;
                            }else{
                            	$scope.insuredInfoFormStatus = false;
                            }*/
                        }

                    };

                    $scope.changeInsuredWeight = function (insuredInfo, index) {
                        if ($scope.productValidation.bmiValidationFlag) {
                            var insuredAge = getAgeFromDOB(insuredInfo.dateOfBirth);
                            if (insuredAge <= $scope.productValidation.bmiChildMinAgeLimit) {
                                return;
                            } else if (insuredAge > $scope.productValidation.bmiChildMinAgeLimit) {
                                $scope.bmiValidation(insuredInfo, index);
                            }
                        }
                    };

                    //final submit 
                    $scope.proceedForPayment = function () {
                        if ($scope.OTPFlag) {
                            var authenticateUserParam = {};
                            authenticateUserParam.mobileNumber = $scope.proposalApp.proposerInfo.contactInfo.mobile;
                            authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
                            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function (createOTP) {
                                if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                                    $scope.modalOTP = false;
                                    $scope.modalOTPError = false;
                                    /*explicit for star health*/
                                    for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                        for (var j = 0; j < $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.length; j++) {
                                            if ($scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j] == null || $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j] == undefined || String($scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j]) == "undefined") {
                                                $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.splice(j, 1);
                                                j = j - 1;
                                            }
                                        }
                                    }
                                    $scope.proceedForConfirm();
                                } else if (createOTP.responseCode == $scope.p365Labels.responseCode.noRecordsFound) {
                                    $scope.invalidOTPError = $scope.p365Labels.validationMessages.invalidOTP;
                                } else if (createOTP.responseCode == $scope.p365Labels.responseCode.expiredOTP) {
                                    $scope.invalidOTPError = $scope.p365Labels.validationMessages.expiredOTP;
                                } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                                    $scope.invalidOTPError = createOTP.message;
                                } else {
                                    $scope.invalidOTPError = $scope.p365Labels.validationMessages.authOTP;
                                }
                            });
                        } else {
                            /*explicit for star health*/
                            for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                                for (var j = 0; j < $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.length; j++) {
                                    if ($scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j] == null || $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j] == undefined || String($scope.proposalApp.insuredMembers[i].carrierMedicalQuestion[j]) == "undefined") {
                                        $scope.proposalApp.insuredMembers[i].carrierMedicalQuestion.splice(j, 1);
                                        j = j - 1;
                                    }
                                }
                            }
                            $scope.proceedForConfirm();
                        }
                    }

                    //function for validation of age and marrital status ,gender for hdfc top up and medisure  classic plan
                    /*	$scope.errorMsg=false;*/
                    $scope.validateData = function () {
                        if ($scope.proposerAge < $scope.productValidation.maleMinAgeSingle && $scope.proposalApp.proposerInfo.personalInfo.martialStatus == $scope.productValidation.checkSingleStatus && $scope.proposalApp.proposerInfo.personalInfo.gender == 'M') {
                            $scope.proposalDetailsForm.dateofbirth.$setValidity('dateofbirth', true);
                            $scope.proposalDetailsForm.gender.$setValidity('gender', true);
                            $scope.proposalDetailsForm.maritalStatus.$setValidity('maritalStatus', true);
                            $scope.errorMsg = true;
                        } else if ($scope.proposerAge < $scope.productValidation.maleMinAgeMarried && $scope.proposalApp.proposerInfo.personalInfo.martialStatus == $scope.productValidation.checkMarriedStatus && $scope.proposalApp.proposerInfo.personalInfo.gender == 'M') {
                            $scope.proposalDetailsForm.dateofbirth.$setValidity('dateofbirth', false);
                            $scope.proposalDetailsForm.gender.$setValidity('gender', false);
                            $scope.proposalDetailsForm.maritalStatus.$setValidity('maritalStatus', false);
                            $scope.errorMsg = true;
                        } else if ($scope.proposerAge < $scope.productValidation.femaleMinAge && $scope.proposalApp.proposerInfo.personalInfo.gender == 'F') {
                            $scope.proposalDetailsForm.dateofbirth.$setValidity('dateofbirth', true);
                            $scope.proposalDetailsForm.gender.$setValidity('gender', true);
                            $scope.proposalDetailsForm.maritalStatus.$setValidity('maritalStatus', true);
                            $scope.errorMsg = true;
                        } else {
                            $scope.proposalDetailsForm.dateofbirth.$setValidity('dateofbirth', true);
                            $scope.proposalDetailsForm.gender.$setValidity('gender', true);
                            $scope.proposalDetailsForm.maritalStatus.$setValidity('maritalStatus', true);
                            $scope.errorMsg = false;
                            $scope.changeDateOfBirth();
                            $scope.changeGender();
                        }
                    }

                    //code added to check while change of DOB to recalculate or not
                    $scope.validateDOB = function () {
                        // $scope.selfAsInsured.dateOfBirth = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                        $scope.proposerAge = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                        if ($scope.productValidation.proposerAgeCheck) {
                            $scope.validateData();
                        } else {
                            $scope.changeDateOfBirth();
                        }
                    }
                    //code added to check while change of gender to recalculate quote or not
                    $scope.validateGender = function () {
                        if ($scope.productValidation.proposerAgeCheck) {
                            $scope.validateData();
                        } else {
                            $scope.changeGender();
                        }
                    }


                    //code added to check while on change of marital status recalculate quote or not
                    $scope.validateMaritalStatus = function () {
                        if ($scope.productValidation.proposerAgeCheck) {
                            $scope.validateData();
                        } else if ($scope.productValidation.individualFloaterPlan) { //added for future generali,if family floater plan if insured member is married not allowing to purchase policy
                            if ($scope.proposalApp.proposerInfo.personalInfo.martialStatus == "MARRIED")
                                $scope.modalIndividualFloaterPlan = true;
                        }
                    }

                    /*----- iPOS+ Functions-------*/
                    $scope.submitDieaseList = function ($mdMenu, ev) {
                        $scope.diseaseShow = false;
                    };
                    $scope.changeOccupation = function () {
                        if (String($scope.selfAsInsured) != "undefined") {
                            $scope.selfAsInsured.occupation = $scope.proposalApp.proposerInfo.personalInfo.occupation;
                        }
                    }

                    $scope.sendProposalEmail = function () {
                        var proposalDetailsEmail = {};
                        proposalDetailsEmail.paramMap = {};

                        proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
                        proposalDetailsEmail.username = $scope.proposalApp.proposerInfo.contactInfo.emailId.trim();
                        proposalDetailsEmail.isBCCRequired = 'Y';
                        proposalDetailsEmail.paramMap.customerName = $scope.proposalApp.proposerInfo.personalInfo.firstName.trim() + " " + $scope.proposalApp.proposerInfo.personalInfo.lastName.trim();
                        proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.health;
                        proposalDetailsEmail.paramMap.quoteId = $scope.responseToken.QUOTE_ID;
                        proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.annualPremium);
                        proposalDetailsEmail.paramMap.docId = $scope.responseToken.proposalId;
                        proposalDetailsEmail.paramMap.LOB = String($scope.p365Labels.businessLineType.health);
                        proposalDetailsEmail.paramMap.url = $scope.shortURLResponse.data.shortURL;

                        RestAPI.invoke($scope.p365Labels.transactionName.sendEmail, proposalDetailsEmail).then(function (emailResponse) {
                            if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                if (baseEnvEnabled == true && agencyPortalEnabled == true) {
                                    var frameURL = agencyPortalUrl + proposalDetailsEmail.paramMap.docId + "&lob=" + proposalDetailsEmail.paramMap.LOB;
                                    $scope.URLforPayment = $sce.trustAsResourceUrl(frameURL);
                                    $scope.loading = false;
                                    $scope.modalAP = true;
                                } else {
                                    $scope.redirectForPayment = false;
                                    $scope.loading = false;
                                    $scope.modalIPOS = true;
                                    var createRecordDetails = {};

                                    createRecordDetails.parent_id = $scope.iposRequest.parent_id;
                                    createRecordDetails.parent_type = $scope.iposRequest.parent_type;
                                    createRecordDetails.requestType = $scope.iposRequest.requestType;

                                    RestAPI.invoke($scope.p365Labels.transactionName.createRecord, createRecordDetails).then(function (createRecordResponse) {
                                    });
                                }
                            } else {
                                $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                $scope.loading = false;
                            }
                        });
                    }

                    $scope.submitProposalData = function () {
                        $('.nomineeInfo').removeClass('active');
                        $('.nomineeInfo').addClass('complete');

                        $scope.proposalApp.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        $scope.proposalApp.insuranceCompany = $scope.selectedProduct.insuranceCompany;
                        $scope.proposalApp.planName = $scope.selectedProduct.planName;
                        $scope.proposalApp.carrierId = $scope.selectedProduct.carrierId;
                        $scope.proposalApp.productId = $scope.selectedProduct.planId;
                        $scope.proposalApp.planId = $scope.selectedProduct.planId;
                        $scope.proposalApp.requestType = $scope.p365Labels.request.healthPropRequestType;
                        $scope.proposalApp.carrierProposalStatus = false;
                        $scope.proposalApp.businessLineId = "4";
                        $scope.proposalApp.proposalId = $scope.responseProduct.proposalId;
                        if (!$rootScope.wordPressEnabled) {
                            $scope.proposalApp.baseEnvStatus = baseEnvEnabled;
                            $scope.proposalApp.source = sourceOrigin;
                        } else {
                            $scope.proposalApp.source = sourceOrigin;
                        }
                        $scope.loading = true;
                        /*RestAPI.invoke("submitHealthProposal", $scope.proposalApp).then(function(proposeFormResponse){
                        	if(proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success){
                        		$scope.loading = false;
                        		$scope.modalIPOS = true;
                        		$scope.responseToken = proposeFormResponse.data;
                        		$scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.health;
                        		$scope.responseToken.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                        		localStorageService.set("medicalReponseToken", $scope.responseToken);
                        		getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.paymentService, $scope.responseToken, function(paymentDetails){
                        			var proposalDetailsEmail = {};
                        			proposalDetailsEmail.paramMap = {};
                        			proposalDetailsEmail.funcType = $scope.globalLabel.functionType.proposalDetailsTemplate;
                        			proposalDetailsEmail.username = $scope.proposalApp.proposerInfo.contactInfo.emailId.trim();
                        			proposalDetailsEmail.paramMap.customerName = $scope.proposalApp.proposerInfo.personalInfo.firstName.trim() + " " + $scope.proposalApp.proposerInfo.personalInfo.lastName.trim();
                        			proposalDetailsEmail.paramMap.selectedPolicyType = $scope.globalLabel.insuranceType.health;
                        			proposalDetailsEmail.paramMap.quoteId = $scope.responseToken.QUOTE_ID;
                        			proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.annualPremium);
                        			proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
                        			proposalDetailsEmail.paramMap.LOB = String($scope.globalLabel.businessLineType.health);
                        			RestAPI.invoke($scope.globalLabel.transactionName.sendEmail, proposalDetailsEmail).then(function(emailResponse){
                        				if(emailResponse.responseCode == $scope.globalLabel.responseCode.success){
                        					$scope.loading = false;
                        					$scope.modalIPOS = true;
                        					
                        			var createRecordDetails = {};
                        			createRecordDetails.parent_id = $scope.iposRequest.parent_id;
                        			createRecordDetails.parent_type= $scope.iposRequest.parent_type;
                        			createRecordDetails.requestType=$scope.iposRequest.requestType;
                        					
                        			RestAPI.invoke($scope.globalLabel.transactionName.createRecord, createRecordDetails).then(function(createRecordResponse){
                        			});

                        					
                        				}else{
                        					$rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.emailSentFailed, "Ok");
                        				}
                        			});
                        		});
                        	}
                        });*/
                        if (!$scope.saveProposal) {
                            $scope.proposalApp.isCleared = true;
                            delete $scope.proposalApp.proposalId;
                            if ($rootScope.agencyPortalEnabled) {
                                const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                                $scope.proposalApp.requestSource = requestSource;
                                if (localdata) {
                                    $scope.proposalApp.userName = localdata.username;
                                    $scope.proposalApp.agencyId = localdata.agencyId;
                                }
                            }
                            if ($scope.proposalApp.QUOTE_ID) {
                                RestAPI.invoke("submitHealthProposal", $scope.proposalApp).then(function (proposeFormResponse) {
                                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                        $scope.responseToken = proposeFormResponse.data;
                                        $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.health;

                                        $scope.proposalId = proposeFormResponse.data.proposalId;
                                        // added to store the encrypted store prosal id 
                                        $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                        localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                                        $scope.responseToken.QUOTE_ID = $scope.iposRequest.docId;
                                        localStorageService.set("medicalReponseToken", $scope.responseToken);
                                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.paymentService, $scope.responseToken, function (paymentDetails) {
                                            //added by gauri for mautic application
                                            if (imauticAutomation == true) {
                                                //imatHealthProposal(localStorageService, $scope, 'MakePayment');
                                                imatHealthProposal(localStorageService, $scope, 'SubmitProposal', function (shortURLResponse) {
                                                    if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                        $scope.shortURLResponse = shortURLResponse;
                                                        console.log('$scope.shortURLResponse in health buy product is:', $scope.shortURLResponse);
                                                        $scope.sendProposalEmail();
                                                    } else {
                                                        console.log(shortURLResponse.message);
                                                        $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                                        $scope.loading = false;
                                                    }
                                                });
                                            } else {
                                                $scope.redirectForPayment = false;
                                                $scope.loading = false;
                                                $scope.modalIPOS = true;
                                                var body = {};
                                                body.longURL = sharePaymentLink + String($scope.responseToken.proposalId) + "&lob=" + String($scope.p365Labels.businessLineType.health);
                                                $http({ method: 'POST', url: getShortURLLink, data: body }).
                                                    success(function (shortURLResponse) {
                                                        if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                            $scope.shortURLResponse = shortURLResponse;
                                                            $scope.sendProposalEmail();
                                                        } else {
                                                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                                            $scope.loading = false;
                                                        }
                                                    });
                                            }
                                        });
                                    } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error) {
                                        $scope.loading = false;
                                        $scope.disablePaymentButton = false;
                                        $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                                    } else {
                                        //added by gauri for imautic
                                        if (imauticAutomation == true) {
                                            imatEvent('ProposalFailed');
                                        }
                                        $scope.loading = false;
                                        var serverError = $scope.p365Labels.errorMessage.serverError;
                                        $rootScope.P365Alert("Policies365", serverError, "Ok");
                                    }
                                });
                            } else {
                                $scope.loading = false;
                                $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                            }
                        } else {
                            if ($scope.proposalApp.isCleared) {
                                delete $scope.proposalApp['isCleared'];
                            }
                            RestAPI.invoke("saveProposalService", $scope.proposalApp).then(function (proposeFormResponse) {
                                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                    $scope.proposalId = proposeFormResponse.data;
                                    localStorageService.set("proposalId", $scope.proposalId);
                                    $scope.loading = false;
                                    $scope.saveProposal = false;
                                } else {
                                    $scope.loading = false;
                                    $scope.saveProposal = false;
                                }
                            });
                        }
                    }
                    $scope.hideModalIPOS = function () {
                        $scope.modalIPOS = false;
                        $scope.authenticate.enteredOTP = "";
                        if ($scope.redirectForPayment == true) {
                            $scope.redirectToPaymentGateway();
                        }
                    }
                    /*----- iPOS+ Functions Ends -------*/

                    $scope.redirectToPaymentGateway = function () {
                        if ($scope.paymentURLParam) {
                            if ($rootScope.affilateUser || $rootScope.agencyPortalEnabled) {
                                $window.top.location.href = $scope.paymentServiceResponse.paymentURL + $scope.paymentURLParam;
                            } else {
                                $window.location.href = $scope.paymentServiceResponse.paymentURL + $scope.paymentURLParam;
                            }
                        } else {
                            $timeout(function () {
                                $scope.paymentForm.setAction($scope.paymentServiceResponse.paymentURL);
                                $scope.paymentForm.commit();
                                $scope.$apply();
                            }, 500);
                        }
                    };

                    $scope.proceedForConfirm = function () {
                        $scope.modalOTP = false;
                        $scope.authenticate.enteredOTP = "";
                        $scope.modalOTPError = false;
                        $('.nomineeInfo').removeClass('active');
                        $('.nomineeInfo').addClass('complete');
                        // Google Analytics Tracker added.
                        //analyticsTrackerSendData(proposeForm);
                        $scope.loading = true;
                        $scope.disablePaymentButton = true;
                        
                        if ($scope.annualIncome) {
                            $scope.proposalApp.proposerInfo.personalInfo.annualIncome = $scope.annualIncome.annualIncome;
                        }
                        if (localStorageService.get("HEALTH_UNIQUE_QUOTE_ID")) {
                            $scope.proposalApp.QUOTE_ID = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
                        }
                        $scope.proposalApp.insuranceCompany = $scope.selectedProduct.insuranceCompany;
                        $scope.proposalApp.planName = $scope.selectedProduct.planName;

                        //added for royal sundaram 
                        if ($scope.selectedProduct.childPlanId) {
                            $scope.proposalApp.childPlanId = $scope.selectedProduct.childPlanId;
                        }
                        if ($scope.selectedProduct.intlTreatmentUS_CANADA) {
                            $scope.proposalApp.coverageDetails.intlTreatmentUS_CANADA = $scope.selectedProduct.intlTreatmentUS_CANADA;
                        }

                        //height and weight sending as number as suggested by Pravin
                        for (var i = 0; i < $scope.proposalApp.insuredMembers.length; i++) {
                            $scope.proposalApp.insuredMembers[i].height = Number($scope.proposalApp.insuredMembers[i].height);
                            $scope.proposalApp.insuredMembers[i].weight = Number($scope.proposalApp.insuredMembers[i].weight);
                        }
                        if (!$rootScope.wordPressEnabled) {
                            $scope.proposalApp.baseEnvStatus = baseEnvEnabled;
                            $scope.proposalApp.source = sourceOrigin;
                        } else {
                            $scope.proposalApp.source = sourceOrigin;
                        }

                        localStorageService.set("healthSelectedProduct", $scope.selectedProduct);
                        localStorageService.set("medicalFinalProposeForm", $scope.proposalApp);
                        if ($scope.proposalApp.QUOTE_ID) {
                            RestAPI.invoke("submitHealthProposal", $scope.proposalApp).then(function (proposeFormResponse) {
                                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {

                                    $scope.proposalId = proposeFormResponse.data.proposalId;
                                    // added to store the encrypted store prosal id 
                                    $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                    localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                                    //added by gauri for mautic application
                                    if (imauticAutomation == true) {
                                        imatHealthProposal(localStorageService, $scope, 'MakePayment');
                                    }


                                    $scope.responseToken = proposeFormResponse.data;
                                    $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.health;
                                    $scope.responseToken.QUOTE_ID = $scope.proposalApp.QUOTE_ID;
                                    $scope.responseToken.messageId = $scope.proposalApp.messageId;
                                    $scope.responseToken.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.proposalApp.encryptedQuoteId;
                                    localStorageService.set("medicalReponseToken", $scope.responseToken);
                                    getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.paymentService, $scope.responseToken, function (paymentDetails) {

                                        if (paymentDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.paymentServiceResponse = paymentDetails.data;
                                            if ($scope.paymentServiceResponse.method == "GET") {
                                                $scope.paymentURLParam = "?";
                                                var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                                for (var i = 0; i < paymentURLParamListLength; i++) {
                                                    if (i < (paymentURLParamListLength - 1))
                                                        $scope.paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value + "&";
                                                    else
                                                        $scope.paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value;
                                                }
                                                $scope.redirectForPayment = true;
                                                $scope.loading = false;
                                                $scope.modalIPOS = true;
                                            } else {
                                                $scope.paymentURLParam = null;
                                                $scope.redirectForPayment = true;
                                                $scope.loading = false;
                                                $scope.modalIPOS = true;
                                            }
                                        } else {
                                            $scope.loading = false;
                                            var buyScreenCnfrmError = paymentDetails.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                            $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                                        }
                                    });
                                } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error) {
                                    $scope.loading = false;
                                    $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                                } else {
                                    $scope.loading = false;
                                    var buyScreenCnfrmError = $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                    $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                                }
                            });
                        } else {
                            $scope.loading = false;
                            $scope.disablePaymentButton = false;
                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                        }
                    }
                }

                //this fxn is written to update salutation based on relation
                $scope.updateSalutation = function (relation) {
                    if ($scope.productValidation.isNomineeSalutationRequired) {
                        if (relation == 'Spouse') {
                            if ($scope.proposalApp.proposerInfo.personalInfo.gender == "M") {
                                $scope.salutationsList = [{ "value": "Mrs", "display": "Mrs." }];
                                $scope.proposalApp.nomineeDetails.salutation = 'Mrs';
                            } else {
                                $scope.salutationsList = [{ "value": "Mr", "display": "Mr." }];
                                $scope.proposalApp.nomineeDetails.salutation = 'Mr';
                            }
                        } else if (relation == 'Son' || relation == 'Brother' || relation == 'Father') {
                            $scope.salutationsList = [{ "value": "Mr", "display": "Mr." }];
                            $scope.proposalApp.nomineeDetails.salutation = 'Mr';
                        } else if (relation == 'Daughter' || relation == 'Mother' || relation == 'Sister') {
                            if (relation == 'Mother') {
                                $scope.salutationsList = [{ "value": "Mrs", "display": "Mrs." }];
                                $scope.proposalApp.nomineeDetails.salutation = 'Mrs';
                            } else {
                                $scope.salutationsList = [{ "value": "Ms", "display": "Ms." }, { "value": "Mrs", "display": "Mrs." }];
                                $scope.proposalApp.nomineeDetails.salutation = 'Ms';
                            }
                        }
                    }
                }

                //pin code change
                // Code by Supriya for communication address's pincode.
                $scope.getPinCodeAreaList = function (areaName) {
                    var docType;
                    if (isNaN(areaName)) {
                        docType = "Area";
                    } else {
                        docType = "Pincode";
                    }

                    return $http.get(getServiceLink + docType + "&q=" + areaName).then(function (response) {
                        return JSON.parse(response.data).data;

                    });
                };

                // Populate list of years based on age.
                $scope.getYearList = function (dateofBirth) {
                    var dateArr = dateofBirth.split("/");
                    var newDOB = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
                    return listRegistrationYear("buyScreen", calculateAgeByDOB(newDOB)); //getAgeFromDOB()
                };

                $scope.$on("setCommAddressByAPI", function () {
                    setTimeout(function () {
                        var googleAddressObject = angular.copy($scope.chosenCommPlaceDetails);
                        getAddressFields(googleAddressObject, function (fomattedAddress, formattedCity, formattedState, formattedPincode) {
                            $scope.proposalApp.proposerInfo.contactInfo.streetDetails = fomattedAddress;
                            if (String(formattedPincode) != "undefined" && formattedPincode != "") {
                                $scope.calcDefaultAreaDetails(formattedPincode);
                            } else {
                                $scope.proposalApp.proposerInfo.contactInfo.pincode = "";
                                $scope.proposalApp.proposerInfo.contactInfo.locality = "";
                                $scope.proposalApp.proposerInfo.contactInfo.city = "";
                                $scope.proposalApp.proposerInfo.contactInfo.state = "";
                            }
                            $scope.$apply();
                        });
                    }, 10);
                });


                $scope.$on("setRegAddressByAPI", function () {
                    setTimeout(function () {
                        var googleAddressObject = angular.copy($scope.chosenRegPlaceDetails);
                        getAddressFields(googleAddressObject, function (fomattedAddress, formattedCity, formattedState, formattedPincode) {
                            $scope.permanentAddressDetails.streetDetails = fomattedAddress;
                            if (String(formattedPincode) != "undefined" && formattedPincode != "") {
                                $scope.calcDefaultRegAreaDetails(formattedPincode);
                            } else {
                                $scope.permanentAddressDetails.pincode = "";
                                $scope.permanentAddressDetails.locality = "";
                                $scope.permanentAddressDetails.city = "";
                                $scope.permanentAddressDetails.state = "";
                            }
                            $scope.$apply();
                        });
                    }, 10);
                });

                $scope.calcDefaultAreaDetails = function (areaCode) {
                    $http.get(getServiceLink + "Pincode" + "&q=" + areaCode).then(function (response) {
                        var areaDetails = JSON.parse(response.data);
                        if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                            $scope.onSelectPinOrArea(areaDetails.data[0]);
                        }
                    });
                };

                //fxn to calculate default area for registration details
                $scope.calcDefaultRegAreaDetails = function (areaCode) {
                    $http.get(getServiceLink + "Pincode" + "&q=" + areaCode).then(function (response) {
                        var areaDetails = JSON.parse(response.data);
                        if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                            $scope.onSelectPermanentPinOrArea(areaDetails.data[0]);
                        }
                    });
                };

                $scope.newPinCode = angular.copy($scope.proposalApp.proposerInfo.contactInfo);
                $scope.onSelectPinOrArea = function (item) {
                    if ($scope.newPinCode.pincode != item.pincode) {

                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.locationChangeMsg, "No", "Yes", function (confirmStatus) {
                            if (confirmStatus) {
                                $scope.loading = true;


                                //added code for quote recalculation 
                                $scope.newPinCode.pincode = item.pincode;
                                $scope.newPinCode.locality = item.area;
                                $scope.newPinCode.city = item.district;
                                $scope.newPinCode.state = item.state;

                                $scope.selectedProductInputParamForPin.personalInfo.pincode = item.pincode;
                                $scope.selectedProductInputParamForPin.personalInfo.displayArea = item.area;
                                $scope.selectedProductInputParamForPin.personalInfo.city = item.district;
                                $scope.selectedProductInputParamForPin.personalInfo.state = item.state;
                                if ($scope.selectedProduct.childPlanId != null) {
                                    $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                                }
                                $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                                if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                    $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                                }
                                RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.selectedProductInputParamForPin).then(function (callback) {
                                    $scope.healthRecalculateQuoteRequest = [];
                                    if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                        $scope.responseRecalculateCodeList = [];

                                        localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                        localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                        $scope.healthRecalculateQuoteRequest = callback.data;

                                        $scope.healthQuoteResult = [];
                                        $scope.quoteCalcResponse = [];
                                        angular.forEach($scope.healthRecalculateQuoteRequest, function (obj, i) {
                                            var request = {};
                                            var header = {};

                                            header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                                            header.deviceId = deviceIdOrigin;
                                            request.header = header;
                                            request.body = obj;

                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                success(function (callback, status) {
                                                    var healthQuoteResponse = JSON.parse(callback);
                                                    $scope.responseRecalculateCodeList.push(healthQuoteResponse.responseCode);
                                                    if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                        if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                            if (healthQuoteResponse.data.quotes[0].childPlanId) {
                                                                if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                    $scope.loading = false;
                                                                    $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                    $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                    $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                    $scope.checkForPanCardValidation();
                                                                    if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                        $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                    }
                                                                }
                                                            } else {
                                                                $scope.loading = false;
                                                                $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                $scope.checkForPanCardValidation();
                                                                if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                    $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                }
                                                            }
                                                        }
                                                        healthQuoteResponse.data.quotes[0].id = healthQuoteResponse.messageId;
                                                        $scope.quoteCalcResponse.push(healthQuoteResponse.data.quotes[0]);

                                                    } else {
                                                        if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                            healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                            if ($scope.selectedProduct.childPlanId) {
                                                                if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                    $scope.loading = false;
                                                                    $scope.proposalApp.proposerInfo.contactInfo.pincode = '';
                                                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                                                    $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                                }
                                                            } else {
                                                                $scope.loading = false;
                                                                $scope.proposalApp.proposerInfo.contactInfo.pincode = '';
                                                                var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                                                $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                            }
                                                        }
                                                    }
                                                }).
                                                error(function (data, status) {
                                                    $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                    $scope.loading = false;
                                                });
                                        });
                                    } else {
                                        $scope.loading = false;
                                        $scope.proposalApp.proposerInfo.contactInfo.pincode = '';
                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                    }

                                });
                                $scope.proposalApp.proposerInfo.contactInfo.pincode = item.pincode;
                                $scope.proposalApp.proposerInfo.contactInfo.locality = item.area;
                                $scope.proposalApp.proposerInfo.contactInfo.city = item.district;
                                $scope.proposalApp.proposerInfo.contactInfo.state = item.state;

                                /*$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth=$scope.storedDOB;
                                $scope.storedDOB=$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;*/

                            } else {
                                $scope.proposalApp.proposerInfo.contactInfo.pincode = $scope.newPinCode.pincode;
                                $scope.proposalApp.proposerInfo.contactInfo.locality = $scope.newPinCode.locality;
                                $scope.proposalApp.proposerInfo.contactInfo.city = $scope.newPinCode.city;
                                $scope.proposalApp.proposerInfo.contactInfo.state = $scope.newPinCode.state;

                                $scope.proposalApp.proposerInfo.personalInfo.pincode = $scope.newPinCode.pincode;
                                $scope.proposalApp.proposerInfo.personalInfo.locality = $scope.newPinCode.locality;
                                $scope.proposalApp.proposerInfo.personalInfo.city = $scope.newPinCode.city;
                                $scope.proposalApp.proposerInfo.personalInfo.state = $scope.newPinCode.state;

                                $scope.proposalApp.proposerInfo.permanentAddress.pincode = $scope.newPinCode.pincode;
                                $scope.proposalApp.proposerInfo.permanentAddress.locality = $scope.newPinCode.locality;
                                $scope.proposalApp.proposerInfo.permanentAddress.city = $scope.newPinCode.city;
                                $scope.proposalApp.proposerInfo.permanentAddress.state = $scope.newPinCode.state;

                            }

                            localStorageService.set("commAddressDetails", item);
                        });

                    } else {
                        $scope.proposalApp.proposerInfo.contactInfo.pincode = $scope.newPinCode.pincode;
                        $scope.proposalApp.proposerInfo.contactInfo.locality = $scope.newPinCode.locality;
                        $scope.proposalApp.proposerInfo.contactInfo.city = $scope.newPinCode.city;
                        $scope.proposalApp.proposerInfo.contactInfo.state = $scope.newPinCode.state;

                        $scope.proposalApp.proposerInfo.personalInfo.pincode = $scope.newPinCode.pincode;
                        $scope.proposalApp.proposerInfo.personalInfo.locality = $scope.newPinCode.locality;
                        $scope.proposalApp.proposerInfo.personalInfo.city = $scope.newPinCode.city;
                        $scope.proposalApp.proposerInfo.personalInfo.state = $scope.newPinCode.state;

                        $scope.proposalApp.proposerInfo.permanentAddress.pincode = $scope.newPinCode.pincode;
                        $scope.proposalApp.proposerInfo.permanentAddress.locality = $scope.newPinCode.locality;
                        $scope.proposalApp.proposerInfo.permanentAddress.city = $scope.newPinCode.city;
                        $scope.proposalApp.proposerInfo.permanentAddress.state = $scope.newPinCode.state;

                        localStorageService.set("commAddressDetails", item);
                    }


                    if ($scope.permanentAddressDetails.isAddressSameAsCommun) {
                        $scope.permanentAddressDetails.houseNo = $scope.proposalApp.proposerInfo.contactInfo.houseNo;
                        $scope.permanentAddressDetails.streetDetails = $scope.proposalApp.proposerInfo.contactInfo.streetDetails;
                        $scope.permanentAddressDetails.pincode = $scope.proposalApp.proposerInfo.contactInfo.pincode;
                        $scope.permanentAddressDetails.locality = $scope.proposalApp.proposerInfo.contactInfo.locality;
                        $scope.permanentAddressDetails.city = $scope.proposalApp.proposerInfo.contactInfo.city;
                        $scope.permanentAddressDetails.state = $scope.proposalApp.proposerInfo.contactInfo.state;

                        localStorageService.set("parmAddressDetails", $scope.permanentAddressDetails);
                        $scope.proposalApp.proposerInfo.personalInfo = $scope.permanentAddressDetails;
                        var quoteUserInfo = localStorageService.get("quoteUserInfo");
                        $scope.proposalApp.proposerInfo.personalInfo.gender = $scope.selectedProductInputParam.quoteParam.selfGender;
                        $scope.proposalApp.proposerInfo.personalInfo.lastName = String(quoteUserInfo.lastName) !== "undefined" ? quoteUserInfo.lastName : "";
                        $scope.proposalApp.proposerInfo.personalInfo.firstName = String(quoteUserInfo.firstName) !== "undefined" ? quoteUserInfo.firstName : "";

                        $scope.proposalApp.proposerInfo.personalInfo.salutation = $scope.proposalApp.proposerInfo.personalInfo.gender == "M" ? "Mr" : "Ms";
                        /*for(var i = 0; i < $scope.memberList.length; i++){
						if($scope.memberList[i].relation == "Self"){
							$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = $scope.memberList[i].dob;
							$scope.proposerAge = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
							break;
						}
					}*/

                        $scope.proposalApp.proposerInfo.personalInfo.pincode = item.pincode;
                        $scope.proposalApp.proposerInfo.personalInfo.locality = item.area;
                        $scope.proposalApp.proposerInfo.personalInfo.city = item.district;
                        $scope.proposalApp.proposerInfo.personalInfo.state = item.state;

                        $scope.proposalApp.proposerInfo.permanentAddress.pincode = item.pincode;
                        $scope.proposalApp.proposerInfo.permanentAddress.locality = item.area;
                        $scope.proposalApp.proposerInfo.permanentAddress.city = item.district;
                        $scope.proposalApp.proposerInfo.permanentAddress.state = item.state;

                    }

                    /*$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth=$scope.storedDOB;
                    $scope.storedDOB=$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;*/

                };

                $scope.onSelectPermanentPinOrArea = function (item) {
                    $scope.permanentAddressDetails.locality = item.area;
                    $scope.permanentAddressDetails.city = item.district;
                    $scope.permanentAddressDetails.pincode = item.pincode;
                    $scope.permanentAddressDetails.state = item.state;
                    localStorageService.set("parmAddressDetails", $scope.permanentAddressDetails);
                };

                $scope.$watch('proposalApp.proposerInfo.contactInfo.streetDetails', function (newValue) {
                    if ($scope.permanentAddressDetails.isAddressSameAsCommun) {
                        $scope.changeRegAddress();
                    }
                });

                $scope.$watch('proposalApp.proposerInfo.contactInfo.houseNo', function (newValue) {
                    if ($scope.permanentAddressDetails.isAddressSameAsCommun) {
                        $scope.changeRegAddress();
                    }
                });

                $scope.$watch('proposalApp.proposerInfo.personalInfo.firstName', function (newValue) {
                    for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                        if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                            $scope.proposalApp.insuredMembers[j].firstName = $scope.proposalApp.proposerInfo.personalInfo.firstName;
                        }
                    }
                });
                $scope.$watch('proposalApp.proposerInfo.personalInfo.lastName', function (newValue) {
                    for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                        if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                            $scope.proposalApp.insuredMembers[j].lastName = $scope.proposalApp.proposerInfo.personalInfo.lastName;
                        }
                    }
                });

                $scope.checkForPanCardValidation = function () {
                    if (!$scope.productValidation.panCardRequired) {
                        if (Number($scope.proposalApp.coverageDetails.totalPremium) >= $scope.productValidation.panAmount) {
                            $scope.productValidation.panCardRequired = true;
                        } else {
                            $scope.productValidation.panCardRequired = false;
                        }
                    }
                }

                $scope.changeRegAddress = function () {
                    if ($scope.permanentAddressDetails.isAddressSameAsCommun) {
                        $scope.permanentAddressDetails.houseNo = $scope.proposalApp.proposerInfo.contactInfo.houseNo;
                        $scope.permanentAddressDetails.streetDetails = $scope.proposalApp.proposerInfo.contactInfo.streetDetails;
                        $scope.permanentAddressDetails.pincode = $scope.proposalApp.proposerInfo.contactInfo.pincode;
                        $scope.permanentAddressDetails.locality = $scope.proposalApp.proposerInfo.contactInfo.locality;
                        $scope.permanentAddressDetails.city = $scope.proposalApp.proposerInfo.contactInfo.city;
                        $scope.permanentAddressDetails.state = $scope.proposalApp.proposerInfo.contactInfo.state;

                        $scope.proposalApp.proposerInfo.personalInfo.pincode = $scope.proposalApp.proposerInfo.contactInfo.pincode;
                        $scope.proposalApp.proposerInfo.personalInfo.locality = $scope.proposalApp.proposerInfo.contactInfo.locality;
                        $scope.proposalApp.proposerInfo.personalInfo.city = $scope.proposalApp.proposerInfo.contactInfo.city;
                        $scope.proposalApp.proposerInfo.personalInfo.state = $scope.proposalApp.proposerInfo.contactInfo.state;

                        $scope.proposalApp.proposerInfo.permanentAddress.pincode = $scope.proposalApp.proposerInfo.contactInfo.pincode;
                        $scope.proposalApp.proposerInfo.permanentAddress.locality = $scope.proposalApp.proposerInfo.contactInfo.locality;
                        $scope.proposalApp.proposerInfo.permanentAddress.city = $scope.proposalApp.proposerInfo.contactInfo.city;
                        $scope.proposalApp.proposerInfo.permanentAddress.state = $scope.proposalApp.proposerInfo.contactInfo.state;

                    } else {
                        $scope.permanentAddressDetails.houseNo = "";
                        $scope.permanentAddressDetails.streetDetails = "";
                        $scope.permanentAddressDetails.pincode = "";
                        $scope.permanentAddressDetails.locality = "";
                        $scope.permanentAddressDetails.city = "";
                        $scope.permanentAddressDetails.state = "";
                    }
                    $scope.proposalApp.proposerInfo.permanentAddress = $scope.permanentAddressDetails;
                };

                $scope.changeGender = function () {
                    if (String($scope.selectedGender) != 'undefined' || $scope.selectedGender != null) {
                        $scope.proposalApp.proposerInfo.personalInfo.salutation = $scope.proposalApp.proposerInfo.personalInfo.gender == "M" ? "Mr" : "Ms";
                        $scope.insuredMembers.gender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                        $scope.insuredMembers.salutation = $scope.insuredMembers.gender == "M" ? "Mr" : "Ms";

                        if ($scope.selectedGender != $scope.proposalApp.proposerInfo.personalInfo.gender) {
                            $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.genderChangeMsg, "No", "Yes", function (confirmStatus) {
                                if (confirmStatus) {
                                    $scope.loading = true;
                                    $scope.selectedProductInputParamForPin.quoteParam.selfGender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                                    for (var i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                        if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == "Self") {
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = $scope.insuredMembers.gender;
                                            if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender == "M") {
                                                $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = "Male";
                                            } else if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender == "F") {
                                                $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = "Female";
                                            }
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].salutation = $scope.insuredMembers.salutation;
                                        }
                                        if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == "Spouse" && $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender == "Male") {
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = "Female";
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].salutation = "Ms";
                                            break;
                                        }
                                        if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == "Spouse" && $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender == "Female") {
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = "Male";
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].salutation = "Mr";
                                            break;
                                        }
                                    }
                                    for (var i = 0; i < $scope.selectedProductInputParamForPin.quoteParam.dependent.length; i++) {
                                        if ($scope.selectedProductInputParamForPin.quoteParam.dependent[i].relationShip == "S") {
                                            $scope.selectedProductInputParamForPin.quoteParam.dependent[i].gender = $scope.selectedProductInputParamForPin.quoteParam.selfGender;
                                        }
                                        if ($scope.selectedProductInputParamForPin.quoteParam.dependent[i].relationShip == "SP" && $scope.selectedProductInputParamForPin.quoteParam.selfGender == "M") {
                                            $scope.selectedProductInputParamForPin.quoteParam.dependent[i].gender = "F";
                                        }
                                        if ($scope.selectedProductInputParamForPin.quoteParam.dependent[i].relationShip == "SP" && $scope.selectedProductInputParamForPin.quoteParam.selfGender == "F") {
                                            $scope.selectedProductInputParamForPin.quoteParam.dependent[i].gender = "M";
                                        }
                                    }
                                    if ($scope.selectedProduct.childPlanId) {
                                        $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                                    }
                                    $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                                    if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                        $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                                    }
                                    RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.selectedProductInputParamForPin).then(function (callback) {
                                        $scope.healthRecalculateQuoteRequest = [];
                                        if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.responseRecalculateCodeList = [];
                                            localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                            localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                            $scope.healthRecalculateQuoteRequest = callback.data;

                                            $scope.healthQuoteResult = [];
                                            $scope.quoteCalcResponse = [];
                                            angular.forEach($scope.healthRecalculateQuoteRequest, function (obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                    success(function (callback, status) {
                                                        var healthQuoteResponse = JSON.parse(callback);
                                                        $scope.responseRecalculateCodeList.push(healthQuoteResponse.responseCode);
                                                        if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                                if (healthQuoteResponse.data.quotes[0].childPlanId) {
                                                                    if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                        $scope.loading = false;
                                                                        $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                        $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                        $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                        $scope.checkForPanCardValidation();
                                                                        if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                            $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                        }
                                                                    }
                                                                } else {
                                                                    $scope.loading = false;
                                                                    $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                    $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                    $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                    $scope.checkForPanCardValidation();
                                                                    if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                        $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                    }
                                                                }
                                                            }
                                                            healthQuoteResponse.data.quotes[0].id = healthQuoteResponse.messageId;
                                                            $scope.quoteCalcResponse.push(healthQuoteResponse.data.quotes[0]);
                                                        } else {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                                if ($scope.selectedProduct.childPlanId) {
                                                                    if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                        $scope.loading = false;
                                                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgGender
                                                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                                    }

                                                                } else {

                                                                    $scope.loading = false;
                                                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgGender
                                                                    $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                                }
                                                            }
                                                        }
                                                    }).
                                                    error(function (data, status) {
                                                        $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                        $scope.loading = false;
                                                    });
                                            });

                                        } else {
                                            $scope.loading = false;
                                            $scope.proposalApp.proposerInfo.personalInfo.gender = '';
                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgGender
                                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                        }

                                    });
                                    /*$scope.storedDOB=$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                                    $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth=$scope.storedDOB;*/
                                    $scope.selectedGender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                                    $scope.proposalApp.proposerInfo.personalInfo.gender = $scope.selectedGender;
                                    for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                                        if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                                            $scope.proposalApp.insuredMembers[j].gender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                                        }
                                    }
                                } else {
                                    $scope.loading = false;
                                    /*$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth=$scope.storedDOB;
                                    $scope.storedDOB=$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;*/
                                    $scope.proposalApp.proposerInfo.personalInfo.gender = $scope.selectedGender;
                                    $scope.selectedGender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                                    for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                                        if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                                            $scope.proposalApp.insuredMembers[j].gender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                                        }
                                    }
                                }
                            });
                        } else {
                            /*$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth=$scope.storedDOB;
                            $scope.storedDOB=$scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;*/
                            $scope.proposalApp.proposerInfo.personalInfo.gender = $scope.selectedGender;
                            $scope.selectedGender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                            for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                                if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                                    $scope.proposalApp.insuredMembers[j].gender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                                }
                            }
                        }
                    }
                }

                $scope.changeDateOfBirth = function () {
                    if (String($scope.storedDOB) != 'undefined' || $scope.storedDOB != null) {

                        if ($scope.storedDOB != $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth) {
                            //$scope.$watch('proposalApp.proposerInfo.personalInfo.dateOfBirth', function(newValue) {
                            $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.DobChangeMsg, "No", "Yes", function (confirmStatus) {
                                if (confirmStatus) {
                                    $scope.loading = true;
                                    for (var i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                        if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == "Self") {
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].dob = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth
                                            $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].age = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);

                                        }
                                    }
                                    $scope.selectedProductInputParamForPin.quoteParam.selfAge = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                                    for (var j = 0; j < $scope.selectedProductInputParamForPin.quoteParam.dependent.length; j++) {
                                        if ($scope.selectedProductInputParamForPin.quoteParam.dependent[j].relationShip == "S") {
                                            $scope.selectedProductInputParamForPin.quoteParam.dependent[j].age = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);

                                        }
                                    }

                                    if ($scope.selectedProduct.childPlanId) {
                                        $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                                    }
                                    $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                                    if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                        $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                                    }
                                    RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.selectedProductInputParamForPin).then(function (callback) {
                                        $scope.healthRecalculateQuoteRequest = [];

                                        if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.responseRecalculateCodeList = [];

                                            localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                            localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                            $scope.healthRecalculateQuoteRequest = callback.data;

                                            $scope.healthQuoteResult = [];
                                            $scope.quoteCalcResponse = [];
                                            angular.forEach($scope.healthRecalculateQuoteRequest, function (obj, i) {
                                                var request = {};
                                                var header = {};

                                                header.transactionName = $scope.p365Labels.transactionName.healthQuoteResult;
                                                header.deviceId = deviceIdOrigin;
                                                request.header = header;
                                                request.body = obj;

                                                $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                    success(function (callback, status) {
                                                        var healthQuoteResponse = JSON.parse(callback);
                                                        $scope.responseRecalculateCodeList.push(healthQuoteResponse.responseCode);
                                                        if (healthQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                                if (healthQuoteResponse.data.quotes[0].childPlanId) {
                                                                    if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                        $scope.loading = false;
                                                                        $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                        if (healthQuoteResponse.data.quotes[0].basicPremium) {
                                                                            $scope.proposalApp.coverageDetails.basePremium = healthQuoteResponse.data.quotes[0].basicPremium;
                                                                        }
                                                                        if (healthQuoteResponse.data.quotes[0].serviceTax) {
                                                                            $scope.proposalApp.coverageDetails.serviceTax = healthQuoteResponse.data.quotes[0].serviceTax;
                                                                        }
                                                                        $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                        $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                        $scope.checkForPanCardValidation();
                                                                        if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                            $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                        }
                                                                    }
                                                                } else {
                                                                    $scope.loading = false;
                                                                    $scope.proposalApp.coverageDetails.totalPremium = healthQuoteResponse.data.quotes[0].annualPremium;
                                                                    if (healthQuoteResponse.data.quotes[0].basicPremium) {
                                                                        $scope.proposalApp.coverageDetails.basePremium = healthQuoteResponse.data.quotes[0].basicPremium;
                                                                    }
                                                                    if (healthQuoteResponse.data.quotes[0].serviceTax) {
                                                                        $scope.proposalApp.coverageDetails.serviceTax = healthQuoteResponse.data.quotes[0].serviceTax;
                                                                    }
                                                                    $scope.premiumDetails.selectedProductDetails = healthQuoteResponse.data.quotes[0];
                                                                    $scope.selectedProduct = healthQuoteResponse.data.quotes[0];
                                                                    $scope.checkForPanCardValidation();
                                                                    if (healthQuoteResponse.data.quotes[0].carrierQuoteId != undefined || healthQuoteResponse.data.quotes[0].carrierQuoteId != '' || healthQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                                                        $scope.proposalApp.coverageDetails.carrierQuoteId = healthQuoteResponse.data.quotes[0].carrierQuoteId;
                                                                    }
                                                                }
                                                            }
                                                            healthQuoteResponse.data.quotes[0].id = healthQuoteResponse.messageId;
                                                            $scope.quoteCalcResponse.push(healthQuoteResponse.data.quotes[0]);
                                                        } else {
                                                            if (healthQuoteResponse.data != null && healthQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                healthQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                                                if ($scope.selectedProduct.childPlanId) {
                                                                    if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                                        $scope.loading = false;
                                                                        $scope.proposalApp.proposerInfo.personalInfo.gender = '';
                                                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgGender
                                                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                                    }
                                                                } else {
                                                                    $scope.loading = false;
                                                                    $scope.proposalApp.proposerInfo.personalInfo.gender = '';
                                                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgGender
                                                                    $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                                }
                                                            }
                                                        }
                                                    }).
                                                    error(function (data, status) {
                                                        $scope.responseRecalculateCodeList.push($scope.p365Labels.responseCode.systemError);
                                                        $scope.loading = false;
                                                    });
                                            });

                                        } else {
                                            $scope.loading = false;
                                            $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = '';
                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgDob
                                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                        }

                                    });
                                    $scope.storedDOB = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                                    $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = $scope.storedDOB;
                                    for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                                        if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                                            $scope.proposalApp.insuredMembers[j].dateOfBirth = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                                        }
                                    }
                                } else {
                                    $scope.loading = false;
                                    $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = $scope.storedDOB;
                                    $scope.storedDOB = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                                    for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                                        if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                                            $scope.proposalApp.insuredMembers[j].dateOfBirth = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                                        }
                                    }
                                }
                            });
                        } else {
                            $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = $scope.storedDOB;
                            $scope.storedDOB = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                            for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                                if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                                    $scope.proposalApp.insuredMembers[j].dateOfBirth = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                                }
                            }
                        }
                    }
                }
                //end

            });

            $scope.backToResultScreen = function () {
                    var encodeQuote = $scope.proposalApp.QUOTE_ID;
                    var encodeLOB = "4";
                    $location.path("/sharefromAPI").search({ docId: $scope.responseToken.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: $scope.p365Labels.businessLineType.health });

                    //new code
                    if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                        $rootScope.mainTabsMenu[0].active = true;
                        $rootScope.mainTabsMenu[1].active = false;
                        if ($scope.responseToken.UNIQUE_QUOTE_ID_ENCRYPTED) {
                            $location.path("/sharefromAPI").search({ docId: $scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: $scope.p365Labels.businessLineType.car });
                        } else {
                            $location.path("/sharefromAPI").search({ docId: $scope.proposalApp.QUOTE_ID, LOB: $scope.p365Labels.businessLineType.car });
                        }
                    }else{
                        if ($scope.responseToken.UNIQUE_QUOTE_ID_ENCRYPTED) {
                            var shareURL = shareQuoteLink+$scope.responseToken.UNIQUE_QUOTE_ID_ENCRYPTED;
                            console.log('encrypted quote id found with share url as: ',shareURL);
                            $window.location.href = shareURL ;
                           // $location.path("/sharefromAPI").search({ docId: $scope.carProposeFormDetails.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: $scope.p365Labels.businessLineType.car });
                        } else {
                           // $location.path("/sharefromAPI").search({ docId: $scope.carProposeFormDetails.QUOTE_ID, LOB: $scope.p365Labels.businessLineType.car });
                           var  shareURL = shareQuoteLink+$scope.proposalApp.QUOTE_ID;
                           console.log(' no encrypted quote id found with share url as: ',shareURL);
                           $window.location.href = shareURL ;
                        }
                    }
            }
        });
    }]);