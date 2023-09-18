'use strict';
angular.module('proposalresdatalife', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('proposalResponseDataLifeController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$sce', function ($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $sce) {
        $scope.loading = true;


        $scope.lifeProposalSectionHTML = wp_path + 'buy/life/html/LifeProposalSection.html';
        // Setting application labels to avoid static assignment.
        // var applicationLabels  = localStorageService.get("applicationLabels");
        // $scope.p365Labels = applicationLabels.p365Labelss;
        $scope.p365Labels = lifeProposalLabels;
        $rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };
        $rootScope.title = $scope.p365Labels.policies365Title.lifeBuyQuote;
        $scope.isFromLMS = true;
        $scope.numRecords = 4;
        $scope.status = false;
        $scope.page = 1;
        $scope.genderMorF = '';
        $scope.medicalInfo = {};
        $scope.jobsInfo = {}
        $scope.jobsInfo.tempJobDetails = [];
        $scope.medicalInfo.medicalQuestionarrier = [];
        $scope.medicalInfo.dieaseDetails = [];
        $scope.medicalQuestionarrie = [];
        $scope.nationalityList = {};
        $scope.appointeeRelList = {};
        $scope.nomineeRelList = {};
        $scope.occupationList = {};
        $scope.personalDetails = {};
        $scope.proposerDetails = {};
        $scope.assuranceInfo = {};
        $scope.assuranceDetails = {};
        $scope.addressDetails = {};
        $scope.lifeProposalApp = {};
        $scope.addressDetails.communicationAddress = {};
        $scope.addressDetails.isAddressSameAsCommun = true;
        $scope.permanentAddressDetails = {};
        $scope.nominationDetails = {};
        $scope.selectedProductInputParam = {};
        $scope.nominationDetails.nomineeAddressDetails = {};
        $scope.nominationDetails.appointeeDetails = {};
        $scope.quoteCalcResponse = {};
        $scope.quoteCalcRequest = {};
        //$scope.nominationDetails.nomineeAddressDetails.communicationAddress = {};
        //$scope.nomineeAddressDetails = {};
        $scope.nominationDetails.isNomineeAddressSameAsCommun = true;

        $scope.previousPolicyDetails = {}
        $scope.previousPolicyDetails.isPreviousPol = "false";
        $scope.previousPolicyDetails.kotakPolicy = "false";
        $scope.previousPolicyDetails.otherThanKotakPrevPol = "false";
        $scope.previousPolicyDetails.PolicyDeclined = "false";
        //$scope.previousPolicyDetails.SumInsuredForKotak=Number($scope.previousPolicyDetails.SumInsuredForKotak);
        //$scope.previousPolicyDetails.SumInsuredForOther=Number($scope.previousPolicyDetails.SumInsuredForOther)
        $scope.nominationInfo = {};

        $scope.appointeeInfo = {};

        $scope.insuranceInfo = {};
        $scope.insuranceDetails = {};
        $scope.lifeProposeFormCookieDetails = {};
        $scope.authenticate = {};
        $scope.selectedDiseaseList = [];
        $scope.selectedJobsList = [];
        $scope.jobsList = [];
        $scope.selectedJob = {};
        $scope.jobsInfo.jobsDetails = [];
        $scope.showSublist = "";
        $scope.regex = /^[\w'\-\,\#\/\"]+[\w'\-\,\s\.\#\/\"]*[\w'\-\,\.\#\/\"]+$/;

        var nationalityFlag = false;
        var staffFlag = false;
        $scope.screenOneStatus = true;
        $scope.screenTwoStatus = false;
        $scope.screenThreeStatus = false;
        $scope.screenFourStatus = false;
        $scope.screenFiverStatus = false;
        $scope.previousPolicyStatus = true;
		$scope.redirectForPayment = false;
        // colling application labels 
        $scope.p365Labels = lifeProposalLabels;

        $scope.frequencyListLife = [
            { "label": "Occasionally" },
            { "label": "Daily" },
            { "label": "Per Week" }
        ];

        $scope.durationListLife = [{ "label": " < 1 year" },
        { "label": "1-3 years" },
        { "label": "> 5 years" }
        ];

        var genderType = [{ "label": "Male", "value": "M" }, { "label": "Female", "value": "F" }];


        $scope.marrital = maritalStatusListGeneric;
        $scope.proposerDetails.marrital = $scope.marrital[0].name;
        $scope.annualIncomeList = annualIncomesGeneric;
        $scope.gender = genderType;
        $scope.carrierStaff = yesNoStatusGeneric;
        $scope.qualificationList = kotakEducationList;


        // Enable/Disable  Proposal form  function    

        $scope.accordion = '1';
        $scope.editPesonalInfo = function () {
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.accordion = '1';
        };
        $scope.editAddressInfo = function () {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.accordion = '2';
        };
        $scope.editMedicalInfo = function () {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.accordion = '3';
        };

        $scope.editNomineeInfo = function () {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.screenFourStatus = true;
            $scope.accordion = '4';
        };

        $scope.Section2Inactive = true;
        $scope.Section3Inactive = true;
        $scope.Section4Inactive = true;
        $scope.Section5Inactive = true;
        $scope.proposalDocParam = {};

        $scope.submitPersonalDetails = function () {
            $scope.screenTwoStatus = true;
            $scope.Section2Inactive = false;
            $scope.accordion = '2';
            $scope.lifeProposeFormCookieDetails.proposerDetails = $scope.proposerDetails;
            //added by gauri for imautic
            if (imauticAutomation == true) {
                imatEvent('ProposalFilled');
            }
        };
        $scope.submitNomineeDetails = function () {
            $scope.screenFiveStatus = true;
            $scope.Section5Inactive = false;
            $scope.accordion = '5';

        }



        $scope.displayIfNotNone = function () {

            angular.forEach($scope.medicalInfo.dieaseDetails, function (element) {
                if (element.questionCode == "FAMDISEASE") {
                    if (element.masterDiseaseCode == "none_fam") {
                        element.applicable = false;
                    }
                }
            })
        }
        $scope.displayIfNone = function () {
            angular.forEach($scope.medicalInfo.dieaseDetails, function (element) {
                if (element.questionCode == "FAMDISEASE") {
                    if (element.masterDiseaseCode != "none_fam") {
                        element.applicable = false;
                    }
                }
            })
        }

        $scope.submitMedicalDetails = function (obj) {
            $scope.screenFourStatus = true;
            $scope.Section4Inactive = false;
            $scope.accordion = '4';
            $scope.proceedPaymentStatus = true;
        }
        $scope.submitAddressDetails = function () {
            $scope.screenThreeStatus = true;
            $scope.Section3Inactive = false;
            $scope.accordion = '3';
            $scope.lifeProposeFormCookieDetails.proposerDetails = $scope.proposerDetails;
            if ($scope.nominationDetails.isNomineeAddressSameAsCommun) {
                $scope.nominationDetails.nomineeAddressDetails = $scope.addressDetails.communicationAddress;
                $scope.nominationDetails.isNomineeAddressSameAsCommun = true;

            }
        }
        $scope.submitNomineeDetails = function () {
            $scope.screenFiveStatus = true;
            $scope.Section5Inactive = false;
            $scope.accordion = '5';
        }

        $scope.showAuthenticateForm = function () {
            var validateAuthParam = {};
            validateAuthParam.paramMap = {};
            validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
            validateAuthParam.funcType = $scope.p365Labels.functionType.optAuth;
            validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
            if (sessionIDvar) {

                validateAuthParam.sessionId = sessionIDvar;

            }
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


        // Function related to address of sthe fields 

        //fxn to calculate default comm area details
        $scope.calcDefaultAreaDetails = function (areaCode) {
            if (areaCode != null && String(areaCode) != $scope.p365Labels.errorMessage.undefinedError && String(areaCode).length > 0) {
                var docType = $scope.p365Labels.documentType.cityDetails;
                var carrierId = $scope.selectedProduct.carrierId;
                $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {
                    var areaDetails = JSON.parse(response.data);
                    if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.onSelectPinOrAreaComm(areaDetails.data[0]);
                    }
                });
            }
        };
        //fucntion to calculate default comm area details for nominee
        $scope.calcNomineeDefaultAreaDetails = function (areaCode) {
            if (areaCode != null && String(areaCode) != $scope.p365Labels.errorMessage.undefinedError && String(areaCode).length > 0) {
                var docType = $scope.p365Labels.documentType.cityDetails;
                var carrierId = $scope.selectedProduct.carrierId;
                $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {

                    var areaDetails = JSON.parse(response.data);
                    if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.onSelectPinOrAreaNomineeComm(areaDetails.data[0]);
                    }
                });
            }
        };
        $scope.calcDefaultPermAreaDetails = function (areaCode) {
            if (areaCode != null && String(areaCode) != $scope.p365Labels.errorMessage.undefinedError && String(areaCode).length > 0) {
                var docType = $scope.p365Labels.documentType.cityDetails;
                var carrierId = $scope.selectedProduct.carrierId;
                $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function (response) {

                    var areaDetails = JSON.parse(response.data);
                    if (areaDetails.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.onSelectPinOrAreaPerm(areaDetails.data[0]);
                    }
                });
            }
        };

        // Method to get list of pincodes
        $scope.getPinCodeAreaList = function (searchValue) {
            var docType = $scope.p365Labels.documentType.cityDetails;
            var carrierId = $scope.selectedProduct.carrierId;

            return $http.get(getSearchServiceLink + docType + "&q=" + searchValue + "&id=" + carrierId).then(function (response) {
                return JSON.parse(response.data).data;
            });
        };

        $scope.loadPlaceholder = function () {
            setTimeout(function () {
                $('.buyform-control').on('focus blur', function (e) {
                    $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
                }).trigger('blur');
            }, 100);
        }

        // form share from api
        $scope.backToResultScreen = function () {
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                var encodeQuote = $scope.proposalApp.QUOTE_ID;
                var encodeLOB = "4";
                $location.path("/sharefromAPI").search({ docId: $scope.lifeProposalApp.UNIQUE_QUOTE_ID_ENCRYPTED, LOB: encodeLOB });
            }
        }

        // function sets up all communication address properties
        $scope.onSelectPinOrAreaComm = function (item) {
            $scope.addressDetails.communicationAddress.stateCode = item.stateCode;
            $scope.addressDetails.communicationAddress.state = item.state;
            $scope.addressDetails.communicationAddress.cityCode = item.cityCode;
            $scope.addressDetails.communicationAddress.city = item.city;
            $scope.addressDetails.communicationAddress.pincode = item.pincode;
            $scope.addressDetails.communicationAddress.address = item.displayField;
            $scope.loadPlaceholder();

            if ($scope.addressDetails.communicationAddress.address) {
                item.displayArea = $scope.addressDetails.communicationAddress.address;
            }
            localStorageService.set("commAddressDetails", item);
        };


        //function sets up all permanent address properties
        $scope.onSelectPinOrAreaPerm = function (item) {
            $scope.permanentAddressDetails.stateCode = item.stateCode;
            $scope.permanentAddressDetails.state = item.state;
            $scope.permanentAddressDetails.cityCode = item.cityCode;
            $scope.permanentAddressDetails.city = item.city;
            $scope.permanentAddressDetails.pincode = item.pincode;
            $scope.permanentAddressDetails.address = item.displayField;
            localStorageService.set("parmAddressDetails", item);
        };

        $scope.onSelectPinOrAreaNomineeComm = function (item) {
            $scope.nominationDetails.nomineeAddressDetails.stateCode = item.stateCode;
            $scope.nominationDetails.nomineeAddressDetails.state = item.state;
            $scope.nominationDetails.nomineeAddressDetails.cityCode = item.cityCode;
            $scope.nominationDetails.nomineeAddressDetails.city = item.city;
            $scope.nominationDetails.nomineeAddressDetails.pincode = item.pincode;
            $scope.loadPlaceholder();
            //localStorageService.set("userGeoDetails", item);
        };

        $scope.onSelectPinOrAreaAppointeeComm = function (item) {

            $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.stateCode = item.stateCode;
            $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.state = item.state;
            $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.cityCode = item.cityCode;
            $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.city = item.city;
            $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.pincode = item.pincode;
        };


        // function for model popups 
        $scope.hideModal = function () {
            $scope.modalOTP = false;
            $scope.proceedPaymentStatus = true;
            $scope.authenticate.enteredOTP = "";
        };
        $scope.hideModalIPOS = function () {
            $scope.modalIPOS = false;
            $scope.authenticate.enteredOTP = "";
			if($scope.redirectForPayment == true){
                $scope.redirectToPaymentGateway();
            }
        }
        $scope.hideModalError = function () {
            $scope.modalOTPError = false;
        };
        
        $scope.resendOTP = function () {
            var validateAuthParam = {};
            validateAuthParam.paramMap = {};
            validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
            validateAuthParam.funcType = $scope.p365Labels.functionType.optAuth;
            validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
            if (sessionIDvar) {
                validateAuthParam.sessionId = sessionIDvar;
            }
            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function (createOTP) {
                if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                    $scope.invalidOTPError = "";
                } else {
                    $scope.invalidOTPError = $scope.p365Labels.errorMessage.createOTP;
                }
            });

        };


        // get hight in feet 
        $scope.calcHeight = function () {
            $scope.proposerDetails.heightInFeet = (Number($scope.proposerDetails.heightInCM) / 30.48);
        }
        //Carrier wise staff flag
        $scope.changeStaff = function () {
            if ($scope.proposerDetails.StaffStatus == "Yes") {
                $scope.staffFlag = true;
            } else {
                $scope.staffFlag = false;
                $scope.proposerDetails.staffCode = "";
            }
        }
        // Change the gender of the Insurer
        $scope.changeGender = function () {
            if ($scope.proposerDetails.gender == "Male" || $scope.proposerDetails.gender == "Other") {
                $scope.proposerDetails.salutation = "Mr";
                if ($scope.commonInfo) {
                    $scope.commonInfo.salutation = "Mr";
                }
            } else {
                $scope.proposerDetails.salutation = "Mrs"
                if ($scope.commonInfo) {
                    $scope.commonInfo.salutation = "Miss";
                }
            }
            //calling recalculate Quotes As per Gender
            $scope.recalculateProposerGender();

        }

        // Function is used to reset Communication address
        $scope.resetCommunicationAddress = function () {
            if (String($scope.addressDetails.communicationAddress.address) == $scope.p365Labels.errorMessage.undefinedError || $scope.addressDetails.communicationAddress.address.length == 0) {
                $scope.addressDetails.communicationAddress.pincode = EMPTY;
                $scope.addressDetails.communicationAddress.state = EMPTY;
                $scope.addressDetails.communicationAddress.city = EMPTY;
            }
        };
        // Function is used to reset Communication address
        $scope.resetNomineeCommunicationAddress = function () {
            if (String($scope.nominationDetails.nomineeAddressDetails.address) == $scope.p365Labels.errorMessage.undefinedError || $scope.nominationDetails.nomineeAddressDetails.address.length == 0) {
                $scope.nominationDetails.nomineeAddressDetails.pincode = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.state = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.city = EMPTY;
            }
        };
        // Function is used to reset Permanent address
        $scope.resetAppointeeAddress = function () {
            if (String($scope.nominationDetails.appointeeDetails.appointeeAddressDetails.address) == $scope.p365Labels.errorMessage.undefinedError || $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.address.length == 0) {
                $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.pincode = EMPTY;
                $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.state = EMPTY;
                $scope.nominationDetails.appointeeDetails.appointeeAddressDetails.city = EMPTY;
            }
        };

        // Function is used to reset Permanent address
        $scope.resetPermanentAddress = function () {
            if (String($scope.permanentAddressDetails.address) == $scope.p365Labels.errorMessage.undefinedError || $scope.permanentAddressDetails.address.length == 0) {
                $scope.permanentAddressDetails.pincode = EMPTY;
                $scope.permanentAddressDetails.state = EMPTY;
                $scope.permanentAddressDetails.city = EMPTY;
            }
        };


        $scope.changePermanentAddress = function () {
            if ($scope.addressDetails.isAddressSameAsCommun) {
                $scope.permanentAddressDetails = $scope.addressDetails.communicationAddress;
                $scope.addressDetails.isAddressSameAsCommun = true;
            } else {
                $scope.permanentAddressDetails = {};
                $scope.addressDetails.isAddressSameAsCommun = false;
                /*$scope.permanentAddressDetails.doorNo = EMPTY;
                $scope.permanentAddressDetails.pincode = EMPTY;
                $scope.permanentAddressDetails.state = EMPTY;
                $scope.permanentAddressDetails.stateCode = EMPTY;ge
                $scope.permanentAddressDetails.cityCode = EMPTY;
                $scope.permanentAddressDetails.city = EMPTY;
                $scope.permanentAddressDetails.addressLine = EMPTY;*/
            }
            $scope.addressDetails.permanentAddress = $scope.permanentAddressDetails;
        };

        $scope.$watch('addressDetails.communicationAddress.doorNo', function (newValue) {
            if ($scope.addressDetails.isAddressSameAsCommun) {
                $scope.changePermanentAddress();
            }
        });

        $scope.$watch('addressDetails.communicationAddress.address', function (newValue) {
            if ($scope.addressDetails.isAddressSameAsCommun) {
                $scope.changePermanentAddress();
            }
        });
        $scope.changeNomineeAddress = function (isNomineeAddressSameAsCommun) {
            if (isNomineeAddressSameAsCommun) {
                $scope.nominationDetails.nomineeAddressDetails = $scope.addressDetails.communicationAddress;
                $scope.nominationDetails.isNomineeAddressSameAsCommun = true;
            } else {
                $scope.nominationDetails.nomineeAddressDetails = {};
                $scope.nominationDetails.isNomineeAddressSameAsCommun = false;
                /*$scope.nominationDetails.nomineeAddressDetails.doorNo = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.pincode = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.state = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.stateCode = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.cityCode = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.city = EMPTY;
                $scope.nominationDetails.nomineeAddressDetails.addressLine = EMPTY;*/
            }
            //$scope.addressDetails.nomineeAddress=$scope.nominationDetails.nomineeAddressDetails;
        };



        $scope.changeAppointeeAddress = function (isAppointeeAddressSameAsCommun) {
            if (isAppointeeAddressSameAsCommun) {
                $scope.nominationDetails.appointeeDetails.appointeeAddressDetails = $scope.addressDetails.communicationAddress;
                $scope.nominationDetails.appointeeDetails.isAppointeeAddressSameAsCommun = true;
            } else {
                $scope.nominationDetails.appointeeDetails.appointeeAddressDetails = {};
                $scope.nominationDetails.appointeeDetails.isAppointeeAddressSameAsCommun = false;
                //			$scope.nominationDetails.appointeeAddressDetails.doorNo = EMPTY;
                //			$scope.nominationDetails.appointeeAddressDetails.pincode = EMPTY;
                //			$scope.nominationDetails.appointeeAddressDetails.state = EMPTY;
                //			$scope.nominationDetails.appointeeAddressDetails.stateCode = EMPTY;
                //			$scope.nominationDetails.appointeeAddressDetails.cityCode = EMPTY;
                //			$scope.nominationDetails.appointeeAddressDetails.city = EMPTY;
                //			$scope.nominationDetails.appointeeAddressDetails.addressLine = EMPTY;
            }
            //$scope.addressDetails.appointeeAddress=$scope.nominationDetails.appointeeAddressDetails;

        };


        //calculation
        $scope.calculateProposerAge = function () {
            $scope.proposerDetails.personAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
            $scope.selectedProductInputParam.personalDetails.dateOfBirth = $scope.proposerDetails.dateOfBirth;
            $scope.selectedProductInputParam.quoteParam.age = parseInt(getAgeFromDOB($scope.proposerDetails.dateOfBirth));
            $scope.calculateMaturityAgeGap();
            $scope.recalculateProposerAge();
        };

        //maturity age gap calculated as discuss with uday sir
        $scope.calculateMaturityAgeGap = function () {
            if ($scope.selectedProductInputParam.quoteParam.age > 35) {
                $scope.selectedProductInputParam.personalDetails.maturityAge = lifematurityAgeConstant;
            } else {
                $scope.selectedProductInputParam.personalDetails.maturityAge = $scope.selectedProductInputParam.quoteParam.age + 40;
            }
        }

        $scope.validateQuestions = function () {
            $scope.showPreviouspolErrMsg = false;
            if ($scope.previousPolicyDetails.isPreviousPol == "true") {
                if ($scope.previousPolicyDetails.otherThanKotakPrevPol == "false" && $scope.previousPolicyDetails.kotakPolicy == "false") {
                    $scope.showPreviouspolErrMsg = true;
                } else if ($scope.previousPolicyDetails.otherThanKotakPrevPol == "false" || $scope.previousPolicyDetails.kotakPolicy == "true") {
                    $scope.showPreviouspolErrMsg = false;
                } else if ($scope.previousPolicyDetails.otherThanKotakPrevPol == "true" || $scope.previousPolicyDetails.kotakPolicy == "false") {
                    $scope.showPreviouspolErrMsg = false;
                }
            }
        }
        $scope.validateProposerDateOfBirth = function () {
            if (String($scope.proposerDetails.dateOfBirth) !== "undefined") {
                var proposerAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
                if (isNaN(proposerAge)) {
                    $scope.proposerDetails.dateOfBirth = undefined;
                    $scope.proposerDateOfBirthError = $scope.productValidation.messages.dateOfBirthInvalid;
                } else {
                    if (proposerAge < $scope.productValidation.proposerDateOfBirthMinLimit) {
                        $scope.proposerDetails.dateOfBirth = undefined;
                        $scope.proposerDateOfBirthError = $scope.productValidation.messages.proposerDateOfBirthErrorOne.replace("MIN_AGE_LIMIT", $scope.productValidation.proposerDateOfBirthMinLimit);
                    } else if (proposerAge > $scope.productValidation.proposerDateOfBirthMaxLimit) {
                        $scope.proposerDetails.dateOfBirth = undefined;
                        $scope.proposerDateOfBirthError = $scope.productValidation.messages.proposerDateOfBirthErrorTwo.replace("MAX_AGE_LIMIT", $scope.productValidation.proposerDateOfBirthMaxLimit);
                    } else {
                        $scope.loadPlaceholder();
                        $scope.proposerAgeValue(proposorAge);
                        $scope.proposerDateOfBirthError = "";
                    }
                }
            } else {
                $scope.proposerDetails.dateOfBirth = undefined;
                $scope.proposerDateOfBirthError = $scope.productValidation.messages.dateOfBirthInvalid;
            }
        }



        $scope.validateNomineeDateOfBirth = function () {
            $scope.nominationDetails.personAge = getAgeFromDOB($scope.nominationDetails.dateOfBirth);
            if ($scope.nominationDetails.personAge < 18) {
                $scope.nominationDetails.appointeeStatus = true;
                $scope.nomineeRelationList = buyScreenMinorNomineeRealtion;
                $scope.loadPlaceholder();
                $scope.appointeeRelationList = buyScreenAppointeeRelation;
                //for apointe
                $scope.nominationDetails.appointeeDetails.isAppointeeAddressSameAsCommun = true;
                if ($scope.nominationDetails.appointeeDetails.isAppointeeAddressSameAsCommun) {
                    $scope.nominationDetails.appointeeDetails.appointeeAddressDetails = $scope.addressDetails.communicationAddress;

                }

            } else {
                $scope.nominationDetails.appointeeStatus = false;
                $scope.nomineeRelationList = buyScreenNotMinorNomineeRealtion;
                $scope.appointeeRelationList = buyScreenAppointeeRelation;
                //for apointe
                $scope.nominationDetails.appointeeDetails = {};
            }
        }

        $scope.validateAppointeeDateOfBirth = function () {
            $scope.nominationDetails.appointeeDetails.personAge = getAgeFromDOB($scope.nominationDetails.appointeeDetails.dateOfBirth);
            if ($scope.nominationDetails.appointeeDetails.personAge < 18) {
                $scope.nominationDetails.appointeeDetails.dateOfBirth = undefined;
                $scope.appointeeDateOfBirthError = $scope.productValidation.messages.dateOfBirthInvalid;
            } else {
                $scope.loadPlaceholder();
                $scope.appointeeDateOfBirthError = "";
            }
        }

        $scope.changeMaritalStatus = function () {
            //below code added for kotak as discussed with Abhishek BA:if marital status is single then husband and wife should not come in nominee relation dropdown
            if ($scope.proposerDetails.marritalStatus == "SINGLE") {
                for (var i = 0; i < $scope.nomineeRelList.length; i++) {

                    if ($scope.nomineeRelList[i].relationNominee == "Husband") {

                        $scope.nomineeRelList.splice(i, 1);

                    }
                    if ($scope.nomineeRelList[i].relationNominee == "Wife") {
                        $scope.nomineeRelList.splice(i, 1);
                    }
                }
            }

        }

        /// get the data in url to prepopulate fields 
        var proposalId = $location.search().proposalId;

        $scope.proposalDocParam.proposalId = proposalId;
        $scope.proposalDocParam.businessLineId = $scope.p365Labels.businessLineType.life;



        // Record in crm.
        $scope.iposRequest = {};
        $scope.iposRequest.parent_id = String($rootScope.parent_id) != $scope.p365Labels.errorMessage.undefinedError ? $rootScope.parent_id : $location.search().recordId;
        $scope.iposRequest.parent_type = String($rootScope.parent_type) != $scope.p365Labels.errorMessage.undefinedError ? $rootScope.parent_type : $location.search().moduleName;
        $scope.iposRequest.requestType = $scope.p365Labels.request.createProposalRecord;
        $scope.quote = {};

        // requesting proposal data using proposalID


        // $scope.p365Labels.transactionName.proposalDataReader
        RestAPI.invoke("proposalDataReader", $scope.proposalDocParam).then(function (proposalDataResponse) {
            if (proposalDataResponse.responsecode == $scope.p365Labels.responseCode.success) {
                $scope.responseProduct = proposalDataResponse.data.PolicyTransaction;
                $scope.lifeProposalApp.documentType = "lifeProposalRequest";
                $scope.lifeProposalApp.productId = $scope.responseProduct.proposalRequest.insuranceDetails.productId;
                $scope.lifeProposalApp.planId = $scope.responseProduct.proposalRequest.insuranceDetails.planId;
                $scope.lifeProposalApp.QUOTE_ID = $scope.responseProduct.QUOTE_ID;
                $scope.lifeProposalApp.UNIQUE_QUOTE_ID_ENCRYPTED = $scope.responseProduct.encryptedQuoteId;
                $scope.lifeProposalApp.carrierId = $scope.responseProduct.proposalRequest.insuranceDetails.carrierId;
                localStorageService.set("QUOTE_ID", $scope.responseProduct.QUOTE_ID);
                localStorageService.set("LIFE_UNIQUE_QUOTE_ID", $scope.responseProduct.QUOTE_ID);
                $scope.lifeProposalApp.businessLineId = $scope.p365Labels.businessLineType.life;
                messageIDVar = $scope.responseProduct.leadMessageId;
                // Adding campaign from proposal
                campaign_id = $scope.responseProduct.campaign_id;
                requestSource = $scope.responseProduct.requestSource;
                sourceOrigin = $scope.responseProduct.source;
                $scope.lifeProposalApp.username = $scope.responseProduct.username;
                $scope.lifeProposalApp.agencyId = $scope.responseProduct.agencyId;

                var buyScreenParam = {};
                buyScreenParam.documentType = $scope.p365Labels.documentType.proposalScreenConfig;
                buyScreenParam.businessLineId = Number($scope.p365Labels.businessLineType.life);
                buyScreenParam.carrierId = $scope.lifeProposalApp.carrierId;
                buyScreenParam.productId = $scope.lifeProposalApp.productId;
                buyScreenParam.QUOTE_ID = $scope.lifeProposalApp.QUOTE_ID;


                getDocUsingParam(RestAPI, productDataReader, buyScreenParam, function (buyScreen) {
                    if (buyScreen.responseCode == $scope.p365Labels.responseCode.success) {

                        // set the buy screen validation details 
                        localStorageService.set("buyScreen", buyScreen.data);
                        // for product validation
                        var buyScreens = buyScreen.data;
                        $scope.ownerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                        $scope.prevPolicyDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                        $scope.productValidation = buyScreens.validation;
                        $scope.redirectSuccessUrl = buyScreens.redirectSuccessUrl;
                        $scope.redirectFailureUrl = buyScreens.redirectFailureUrl;
                        $scope.requestFormat = buyScreens.requestFormat;
                        $scope.transactionName = buyScreens.transaction.proposalService.name;
                        $scope.paymentURL = buyScreens.paymentUrl;

                        getDocUsingIdQuoteDB(RestAPI, $scope.lifeProposalApp.QUOTE_ID, function (quoteCalcDetails) {

                            $scope.quoteCalcResponse = quoteCalcDetails.lifeQuoteResponse;
                            $scope.quoteCalcRequest = quoteCalcDetails.lifeQuoteRequest;
                            localStorageService.set("lifeQuoteInputParamaters", $scope.quoteCalcRequest);
                            $scope.selectedProductInputParam = quoteCalcDetails.lifeQuoteRequest;
                            // for the gender purposes

                            // selected producted
                            for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                                if ($scope.quoteCalcResponse[i].carrierId == $scope.responseProduct.proposalRequest.insuranceDetails.carrierId) {
                                    $scope.selectedProduct = $scope.quoteCalcResponse[i];
                                    localStorageService.set("selectedProduct", $scope.selectedProduct);
                                    break;
                                }
                            }

                            $scope.prePopulateForm = function () {
                                // Load personal details;

                                $scope.proposerDetails = $scope.responseProduct.proposalRequest.proposerDetails;

                                $scope.proposerDetails.dateOfBirth = $scope.selectedProductInputParam.personalDetails.dateOfBirth;

                                $scope.storedDOB = angular.copy($scope.selectedProductInputParam.personalDetails.dateOfBirth);

                                if ($scope.selectedProductInputParam.quoteParam.gender == "M") {
                                    $scope.proposerDetails.gender = "Male";
                                    $scope.proposerDetails.salutation = "Mr";
                                    if ($scope.commonInfo) {
                                        $scope.commonInfo.salutation = "Mr";
                                    }
                                } else {
                                    $scope.proposerDetails.gender = "Female";
                                    $scope.proposerDetails.salutation = "Mrs";
                                    if ($scope.commonInfo) {
                                        $scope.commonInfo.salutation = "Miss";
                                    }
                                }

                                //date picker code
                                var proposerDOBOption = {};
                                proposerDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
                                proposerDOBOption.maximumYearLimit = "-" + $scope.productValidation.proposerAgeMin.age + "Y";
                                proposerDOBOption.changeMonth = true;
                                proposerDOBOption.changeYear = true;
                                proposerDOBOption.dateFormat = "dd/mm/yy";
                                $scope.proposerDOBOptions = setP365DatePickerProperties(proposerDOBOption);

                                var nomineeDOBOption = {};
                                //nomineeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
                                nomineeDOBOption.maximumYearLimit = "-1Y";
                                nomineeDOBOption.changeMonth = true;
                                nomineeDOBOption.changeYear = true;
                                nomineeDOBOption.dateFormat = "dd/mm/yy";
                                /*nomineeDOBOption.dateFormnomineeDOBOptionsat = "dd/mm/yy";*/
                                $scope.nomineeDOBOptions = setP365DatePickerProperties(nomineeDOBOption);

                                var appointeeDOBOption = {};
                                //appointeeDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
                                appointeeDOBOption.maximumYearLimit = "-18Y";
                                appointeeDOBOption.changeMonth = true;
                                appointeeDOBOption.changeYear = true;
                                appointeeDOBOption.dateFormat = "dd/mm/yy";
                                $scope.appointeeDOBOptions = setP365DatePickerProperties(appointeeDOBOption);

                                // Load Address Details                                
                                $scope.addressDetails = $scope.responseProduct.proposalRequest.addressDetails;
                                // setting the commucation address details  to local storage 
                                localStorageService.set("commAddressDetails", $scope.addressDetails.communicationAddress)
                                if ($scope.addressDetails.isAddressSameAsCommun) {
                                    $scope.permanentAddressDetails = $scope.responseProduct.proposalRequest.addressDetails.communicationAddress;
                                } else {
                                    $scope.permanentAddressDetails = $scope.responseProduct.proposalRequest.addressDetails.permanentAddress;
                                }

                                // load medical details
                                $scope.medicalInfo.medicalQuestionarrier = $scope.responseProduct.proposalRequest.medicalQuestionarrier;
                                $scope.medicalInfo.dieaseDetails = $scope.responseProduct.proposalRequest.dieaseDetails
                                $scope.jobsInfo.jobsDetails = $scope.responseProduct.proposalRequest.jobsInfo
                                $scope.tobacoAdictedTemp = ($scope.responseProduct.proposalRequest.proposerDetails.tobacoAdicted == 'Y') ? "true" : "false"


                                $scope.proposerDetails.tobacoAdicted = $scope.selectedProductInputParam.quoteParam.tobacoAdicted;
                                $scope.istobacoAddicted = ($scope.proposerDetails.tobacoAdicted == 'Y') ? "true" : "false";

                                // for tobbaco question
                                $scope.tobacoErrorMsg = false;
                                $rootScope.smokingFlag = false; // because someone has already subbmited the document                             


                                // load nomination And Appointee details  

                                $scope.nominationDetails = $scope.responseProduct.proposalRequest.nominationDetails;
                                angular.forEach($scope.nomineeRelList, function (value, key) {
                                    if ($scope.nomineeRelList[key].relationNominee == $scope.nominationDetails.nominationRelation) {
                                        $scope.nominationRelation = $scope.nomineeRelList[key];

                                    }
                                });
                                // loaad appointee details
                                angular.forEach($scope.appointeeRelList, function (value, key) {
                                    if ($scope.appointeeRelList[key].relationAppointee == $scope.nominationDetails.appointeeDetails.appointeeRelation) {
                                        $scope.appointeeRelation = $scope.appointeeRelList[key];
                                    }
                                });

                                // load previous policy details 
                                $scope.previousPolicyDetails = $scope.responseProduct.proposalRequest.previousPolicyDetails;

                                // Load undertakingStatus 
                                $scope.undertakingStatus = true;
                                $scope.loading = false;


                            }
							$scope.redirectToPaymentGateway = function(){
								if($scope.paymentGatewayURL){
									$window.open($scope.paymentGatewayURL, "_blank");
								}
							}
                            $scope.proceedForPayment = function () {
                                $scope.proceedPaymentStatus = false;
                                var authenticateUserParam = {};

                                authenticateUserParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                                authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
                                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function (createOTP) {
                                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                                        $scope.modalOTP = false;
                                        $scope.invalidOTPError = "";
                                        $scope.proposalInfo();
                                        $scope.lifeProposeFormDetails.QUOTE_ID = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
                                        $scope.lifeProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.life;
                                        if (!$rootScope.wordPressEnabled) {
                                            $scope.lifeProposeFormDetails.baseEnvStatus = baseEnvEnabled;
                                            $scope.lifeProposeFormDetails.source = sourceOrigin;
                                        } else {
                                            $scope.lifeProposeFormDetails.source = sourceOrigin;
                                        }
                                        localStorageService.set("lifeProposeFormDetails", $scope.lifeProposeFormDetails);
                                        // Google Analytics Tracker added.
                                        //analyticsTrackerSendData($scope.lifeProposeFormDetails); 
                                        if ($scope.lifeProposeFormDetails.QUOTE_ID) {
                                            $scope.loading = true;
                                            RestAPI.invoke($scope.transactionName, $scope.lifeProposeFormDetails).then(function (proposeFormResponse) {
                                                $scope.modalOTP = false;
                                                $scope.authenticate.enteredOTP = "";
                                                $scope.modalOTPError = false;
                                                $scope.proceedPaymentStatus = true;

                                                if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {

                                                    $scope.proposalId = proposeFormResponse.data.proposalId;
                                                    // added to store the encrypted store prosal id 
                                                    $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                                    localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                                                    if (proposeFormResponse.data) {
                                                        //added by gauri for mautic application
                                                        if (imauticAutomation == true) {
                                                            imatLifeProposal(localStorageService, $scope, 'MakePayment');
                                                        }
														$scope.loading = false;
														$scope.paymentGatewayURL = proposeFormResponse.data.redirectionUrl;
														$scope.redirectForPayment = true;
														$scope.modalIPOS = true;

                                                    } else {
                                                        console.error("URL is not available for redirection.");
                                                    }

                                                } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error) {
                                                    $scope.loading = false;
                                                    $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                                                } else {
                                                    //added by gauri for imautic
                                                    if (imauticAutomation == true) {
                                                        imatEvent('ProposalFailed');
                                                    }
                                                    $scope.loading = false;
                                                    var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                                    $rootScope.P365Alert($scope.p365Labels.common.p365prompt, buyScreenCnfrmError, "Ok");
                                                }
                                            });
                                        } else {
                                            $scope.loading = false;
                                            $scope.proceedPaymentStatus = true;
                                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                                        }
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
                            };



                            $scope.submitProposalData = function (selectedPolicyDetails) {
                                $scope.proposalInfo();
                                $scope.lifeProposeFormDetails.QUOTE_ID = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
                                $scope.lifeProposeFormDetails.businessLineId = $scope.p365Labels.businessLineType.life;
                                $scope.lifeProposeFormDetails.carrierProposalStatus = false;
                                $scope.lifeProposeFormDetails.baseEnvStatus = baseEnvEnabled;

                                $scope.loading = true;
                                if ($rootScope.agencyPortalEnabled) {
                                    const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                                    $scope.lifeProposeFormDetails.requestSource = requestSource;
                                    $scope.lifeProposeFormDetails.userName = localdata.username;
                                    $scope.lifeProposeFormDetails.agencyId = localdata.agencyId;
                                }
                                if ($scope.lifeProposeFormDetails.QUOTE_ID) {
                                    RestAPI.invoke($scope.transactionName, $scope.lifeProposeFormDetails).then(function (proposeFormResponse) {
                                        if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.responseToken = proposeFormResponse.data;
                                            $scope.responseToken.paymentGateway = $scope.paymentURL;
                                            $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.life;
                                            localStorageService.set("lifeReponseToken", $scope.responseToken);
                                            // added to store the encrypted store prosal id 
                                            $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                                            localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                                            //added by gauri for mautic application
                                            if (imauticAutomation == true) {
                                                imatLifeProposal(localStorageService, $scope, 'MakePayment');
												 $scope.redirectForPayment = false;
                                                $scope.loading = false;
                                                $scope.modalIPOS = true;
                                            } else {

                                                var body = {};
                                                body.longURL = sharePaymentLink + String($scope.responseToken.encryptedProposalId) + "&lob=" + String($scope.p365Labels.businessLineType.life);
                                                $http({ method: 'POST', url: getShortURLLink, data: body }).
                                                    success(function (shortURLResponse) {
                                                        if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {


                                                            // getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.paymentService, $scope.responseToken, function(paymentDetails){
                                                            var proposalDetailsEmail = {};
                                                            proposalDetailsEmail.paramMap = {};
                                                            proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
                                                            proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
                                                            proposalDetailsEmail.isBCCRequired = 'Y';
                                                            proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
                                                            proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.life;
                                                            proposalDetailsEmail.paramMap.quoteId = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
                                                            proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                                                            proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
                                                            proposalDetailsEmail.paramMap.LOB = String($scope.p365Labels.businessLineType.life);
                                                            proposalDetailsEmail.paramMap.url = shortURLResponse.data.shortURL;
                                                            RestAPI.invoke($scope.p365Labels.transactionName.sendEmail, proposalDetailsEmail).then(function (emailResponse) {
                                                                if (emailResponse.responseCode == $scope.p365Labels.responseCode.success) {
																	 $scope.redirectForPayment = false;
                                                                    $scope.loading = false;
                                                                    $scope.modalIPOS = true;

                                                                } else {
                                                                    $rootScope.P365Alert("Policies365", emailResponse.data, "Ok");
                                                                    $scope.loading = false;

                                                                }
                                                                //code for sending SMS Link to customer
                                                                var proposalDetailsSMS = {};
                                                                proposalDetailsSMS.paramMap = {};
                                                                proposalDetailsSMS.funcType = "SHAREPROPOSAL";
                                                                proposalDetailsSMS.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
                                                                proposalDetailsSMS.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                                                                proposalDetailsSMS.paramMap.docId = String($scope.responseToken.proposalId);
                                                                proposalDetailsSMS.paramMap.LOB = String($scope.p365Labels.businessLineType.life);
                                                                proposalDetailsSMS.mobileNumber = $scope.proposerDetails.mobileNumber;
                                                                proposalDetailsSMS.paramMap.url = shortURLResponse.data.shortURL;
                                                                RestAPI.invoke($scope.p365Labels.transactionName.sendSMS, proposalDetailsSMS).then(function (smsResponse) {
                                                                    if (smsResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                                        $scope.smsResponseError = "";
                                                                        //$scope.modalOTP = true;		
                                                                    } else if (smsResponse.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                                                                        $scope.smsResponseError = smsResponse.message;
                                                                        //$scope.modalOTPError = true;
                                                                    } else {
                                                                        $scope.smsResponseError = $scope.p365Labels.errorMessage.createOTP;
                                                                        //$scope.modalOTPError = true;
                                                                    }

                                                                });

                                                            });
                                                        } else {
                                                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                                            $scope.loading = false;
                                                        }
                                                    });
                                            }

                                        } else {
                                            $scope.loading = false;
                                            if ($scope.vehicleDetails.registrationNumber) {
                                                var formatRegisCode = $scope.vehicleDetails.registrationNumber;
                                                $scope.assuranceInfo.registrationNumber = formatRegisCode.substring(4);
                                            }

                                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.serverError, "Ok");
                                        }
                                    });
                                } else {
                                    $scope.loading = false;
                                    $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.generalisedErrMsg, "Ok");
                                }
                            }

                            //recalculate Gender 
                            $scope.recalculateProposerGender = function () {
                                if (($scope.storedGENDER) != 'undefined' || $scope.storedGENDER != null) {
                                    if ($scope.proposerDetails.gender == "Male" || $scope.proposerDetails.gender == "Other") {
                                        $scope.genderMorF = 'M';
                                        $scope.selectedProductInputParam.quoteParam.gender = $scope.genderMorF;
                                    } else {
                                        $scope.genderMorF = 'F';
                                        $scope.selectedProductInputParam.quoteParam.gender = $scope.genderMorF
                                    }
                                    if ($scope.storedGENDER != $scope.proposerDetails.gender) {
                                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.genderChangeMsg, "No", "Yes", function (confirmStatus) {
                                            if (confirmStatus) {
                                                $scope.loading = true;
                                                $scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.personalDetails.maturityAge - $scope.selectedProductInputParam.quoteParam.age;
                                                //$scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.quoteParam.;
                                                if (localStorageService.get("PROF_QUOTE_ID")) {
                                                    $scope.selectedProductInputParam.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                                                }
                                                RestAPI.invoke($scope.p365Labels.getRequest.quoteLife, $scope.selectedProductInputParam).then(function (callback) {
                                                    $scope.lifeRecalculateQuoteRequest = [];
                                                    if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                                        $scope.responseRecalculateCodeList = [];

                                                        localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                                        localStorageService.set("LIFE_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                                        $scope.lifeRecalculateQuoteRequest = callback.data;

                                                        $scope.lifeQuoteResult = [];
                                                        $scope.quoteCalcResponse = [];
                                                        angular.forEach($scope.lifeRecalculateQuoteRequest, function (obj, i) {
                                                            var request = {};
                                                            var header = {};

                                                            header.messageId = messageIDVar;
                                                            header.campaignID = campaignIDVar;
                                                            header.source = sourceOrigin;
                                                            header.transactionName = $scope.p365Labels.transactionName.lifeQuoteResult;
                                                            header.deviceId = deviceIdOrigin;
                                                            request.header = header;
                                                            request.body = obj;

                                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                                success(function (callback, status) {
                                                                    var lifeQuoteResponse = JSON.parse(callback);

                                                                    if (lifeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                                        if (lifeQuoteResponse.data != null && lifeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                            lifeQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {

                                                                            $scope.selectedProduct.annualPremium = lifeQuoteResponse.data.quotes[0].annualPremium;
                                                                            $scope.selectedProduct.monthlyFinalPremium = lifeQuoteResponse.data.quotes[0].monthlyFinalPremium;
                                                                            $scope.selectedProduct.basicPremium = lifeQuoteResponse.data.quotes[0].basicPremium;
                                                                            $scope.selectedProduct.monthlyBasePremium = lifeQuoteResponse.data.quotes[0].monthlyBasePremium;
                                                                            $scope.selectedProduct.serviceTax = lifeQuoteResponse.data.quotes[0].sericeTax;
                                                                            $scope.selectedProduct.sumInsured = lifeQuoteResponse.data.quotes[0].sumInsured;
                                                                            $scope.selectedProduct.adjustedPremium = lifeQuoteResponse.data.quotes[0].adjustedPremium;

                                                                            $scope.loading = false;
                                                                        }
                                                                        lifeQuoteResponse.data.quotes[0].id = lifeQuoteResponse.messageId;
                                                                        $scope.quoteCalcResponse.push(lifeQuoteResponse.data.quotes[0]);
                                                                    } else {
                                                                        if (lifeQuoteResponse.data != null && lifeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                            lifeQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {

                                                                            $scope.loading = false;
                                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                                                            $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");

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
                                                        $scope.proposerDetails.gender = $scope.storedGENDER;
                                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgDob
                                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                    }

                                                });
                                                $scope.storedGENDER = $scope.proposerDetails.gender;
                                                $scope.proposerDetails.gender = $scope.storedGENDER;
                                                if ($scope.commonInfo) {
                                                    $scope.commonInfo.salutation = ($scope.proposerDetails.gender == "Female") ? "Miss" : "Mr";
                                                }

                                            } else {
                                                $scope.loading = false;
                                                $scope.proposerDetails.gender = $scope.storedGENDER;
                                                $scope.storedGENDER = $scope.proposerDetails.gender;
                                                if ($scope.commonInfo) {
                                                    $scope.commonInfo.salutation = ($scope.proposerDetails.gender == "Female") ? "Miss" : "Mr";
                                                }

                                            }
                                        });
                                    } else {
                                        $scope.loading = false;
                                        $scope.proposerDetails.gender = $scope.storedGENDER;
                                        $scope.storedGENDER = $scope.proposerDetails.gender;
                                    }
                                }
                            }


                            $scope.recalculateProposerAge = function () {
                                if (String($scope.storedDOB) != 'undefined' || $scope.storedDOB != null) {
                                    if ($scope.storedDOB != $scope.proposerDetails.dateOfBirth) {
                                        $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.DobChangeMsg, "No", "Yes", function (confirmStatus) {
                                            if (confirmStatus) {
                                                $scope.loading = true;
                                                $scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.personalDetails.maturityAge - $scope.selectedProductInputParam.quoteParam.age;
                                                //$scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.quoteParam.;
                                                if (localStorageService.get("PROF_QUOTE_ID")) {
                                                    $scope.selectedProductInputParam.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                                                }
                                                RestAPI.invoke($scope.p365Labels.getRequest.quoteLife, $scope.selectedProductInputParam).then(function (callback) {
                                                    $scope.lifeRecalculateQuoteRequest = [];
                                                    if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                                        $scope.responseRecalculateCodeList = [];

                                                        localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                                        localStorageService.set("LIFE_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                                        $scope.lifeRecalculateQuoteRequest = callback.data;

                                                        $scope.lifeQuoteResult = [];
                                                        $scope.quoteCalcResponse = [];
                                                        angular.forEach($scope.lifeRecalculateQuoteRequest, function (obj, i) {
                                                            var request = {};
                                                            var header = {};

                                                            header.messageId = messageIDVar;
                                                            header.campaignID = campaignIDVar;
                                                            header.source = sourceOrigin;
                                                            header.transactionName = $scope.p365Labels.transactionName.lifeQuoteResult;
                                                            header.deviceId = deviceIdOrigin;
                                                            request.header = header;
                                                            request.body = obj;

                                                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                                                success(function (callback, status) {
                                                                    var lifeQuoteResponse = JSON.parse(callback);

                                                                    if (lifeQuoteResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                                                        if (lifeQuoteResponse.data != null && lifeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                            lifeQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {

                                                                            if ($scope.selectedProduct.premiumTypeMonthOrAnnual == "Monthly Premium") {
                                                                                $scope.selectedProduct.monthlyFinalPremium = lifeQuoteResponse.data.quotes[0].monthlyFinalPremium;
                                                                                $scope.selectedProduct.annualPremium = lifeQuoteResponse.data.quotes[0].annualPremium
                                                                            } else {
                                                                                $scope.selectedProduct.annualPremium = lifeQuoteResponse.data.quotes[0].annualPremium;
                                                                                $scope.selectedProduct.monthlyFinalPremium = lifeQuoteResponse.data.quotes[0].monthlyFinalPremium;

                                                                            }

                                                                            $scope.selectedProduct.basicPremium = lifeQuoteResponse.data.quotes[0].basicPremium;
                                                                            $scope.selectedProduct.monthlyBasePremium = lifeQuoteResponse.data.quotes[0].monthlyBasePremium;
                                                                            $scope.selectedProduct.serviceTax = lifeQuoteResponse.data.quotes[0].sericeTax;
                                                                            $scope.selectedProduct.sumInsured = lifeQuoteResponse.data.quotes[0].sumInsured;
                                                                            $scope.selectedProduct.adjustedPremium = lifeQuoteResponse.data.quotes[0].adjustedPremium;
                                                                            $scope.loading = false;
                                                                        }
                                                                        lifeQuoteResponse.data.quotes[0].id = lifeQuoteResponse.messageId;
                                                                        $scope.quoteCalcResponse.push(lifeQuoteResponse.data.quotes[0]);
                                                                    } else {
                                                                        if (lifeQuoteResponse.data != null && lifeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                                            lifeQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {

                                                                            $scope.loading = false;
                                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsg
                                                                            $rootScope.P365Alert($scope.p365Labels.common.p365prompt, screenCnfrmError, "Ok");
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
                                                        $scope.proposerDetails.dateOfBirth = '';
                                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgDob
                                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                    }

                                                });
                                                $scope.storedDOB = $scope.proposerDetails.dateOfBirth;
                                                $scope.proposerDetails.dateOfBirth = $scope.storedDOB;

                                            } else {
                                                $scope.loading = false;
                                                $scope.proposerDetails.dateOfBirth = $scope.storedDOB;
                                                $scope.storedDOB = $scope.proposerDetails.dateOfBirth;

                                            }
                                        });
                                    } else {
                                        $scope.loading = false;
                                        $scope.proposerDetails.dateOfBirth = $scope.storedDOB;
                                        $scope.storedDOB = $scope.proposerDetails.dateOfBirth;

                                    }
                                }
                            }

                            setTimeout(function () {
                                $('.buyform-control').on('focus blur', function (e) {
                                    $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
                                }).trigger('blur');
                            }, 4000)

                            setTimeout(function () {
                                $('.buyform-control').on('focus blur', function (e) {
                                    $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
                                }).trigger('blur');
                            }, 500)

                            $scope.scheduleVehicleInspection = function () {
                                $location.path('/FourWheelerscheduleInspection');
                            }

                            $rootScope.signout = function () {
                                $rootScope.userLoginStatus = false;
                                var userLoginInfo = {};
                                userLoginInfo.username = undefined;
                                userLoginInfo.status = $rootScope.userLoginStatus;
                                localStorageService.set("userLoginInfo", userLoginInfo);
                                $location.path("/quote");
                            }
                            /// mddical queastion start  heare 
                            var quesArr = [];
                            $rootScope.lifeRegretPolicyFlag = false;
                            $scope.inputTypeCheck = function (sel, quesId, mquestion) {

                                if (sel == 'true') {

                                    if (mquestion.questionCode == 'MULTIPLECOUNTRY' || mquestion.questionCode == 'IS_NRI' || mquestion.questionCode == 'IS_GREENCARDHOLDER') {
                                        quesArr.push(quesId);
                                        var screenCnfrmError = $scope.p365Labels.errorMessage.lifeRegretPolicyMsg;
                                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                    }

                                } else {
                                    if (quesArr.length > 0)
                                        quesArr.splice(-1, quesId);
                                }
                                if (quesArr.length > 0) {
                                    $rootScope.lifeRegretPolicyFlag = true;
                                } else {
                                    $rootScope.lifeRegretPolicyFlag = false;
                                }
                            }

                            $scope.clickToShowDisease = function (index) {
                                $scope.diseaseShow = true;
                                $scope.showSublist = index;

                            }

                            $scope.tobacoErrorMsg = false;
                            $rootScope.smokingFlag = false;
                            $scope.clickToShowDiseaseTobacco = function (index, applicable) {
                                $scope.tobacoErrorMsg = false;
                                $rootScope.smokingFlag = false;
                                $scope.tobacoAdictedTemp = ($scope.proposerDetails.tobacoAdicted == 'Y') ? "true" : "false"
                                if (applicable != $scope.tobacoAdictedTemp) {
                                    $rootScope.smokingFlag = true;
                                    $scope.tobacoErrorMsg = true;
                                }


                                $scope.showDesc = true;


                            }


                            $scope.checkJob = function () {
                                var flag = true;
                                for (var i = 0; i < $scope.jobsInfo.jobsDetails.length; i++) {
                                    if ($scope.jobsInfo.jobsDetails[i].applicable !== undefined) {
                                        if ($scope.jobsInfo.jobsDetails[i].applicable == true) {
                                            flag = false;
                                            // break;			
                                        }
                                    }
                                }
                                return flag;
                            }

                            //at lesst one deseae should be selected 
                            $scope.checkDisease = function (questionCode) {
                                var flag = true;

                                for (var i = 0; i < $scope.medicalInfo.dieaseDetails.length; i++) {
                                    if ($scope.medicalInfo.dieaseDetails[i]) {
                                        if ($scope.medicalInfo.dieaseDetails[i].questionCode == questionCode && $scope.medicalInfo.dieaseDetails[i].applicable) {
                                            flag = false;
                                            // break;			
                                        }
                                    }
                                }
                                return flag;
                            }
                            // medical related function ends heare 
                            $scope.getnumberOfPages = function (array) {

                                if (array.length <= 4) {
                                    $scope.numberOfPages = 1
                                } else if (array.length <= 8) {

                                    $scope.numberOfPages = 2
                                } else {
                                    $scope.numberOfPages = Math.floor((array.length / $scope.numRecords));
                                }
                            }
                            $scope.clickToHideDisease = function () {
                                $scope.diseaseShow = false;
                            }
                            $scope.submitDieaseList = function () {
                                $scope.diseaseShow = false;
                            };





                            $scope.proposalInfo = function () {
                                $scope.lifeProposeFormDetails = {};

                                $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
                                delete $scope.selectedProduct.features;
                                delete $scope.selectedProduct.riders;
                                $scope.lifeProposeFormDetails.premiumDetails = $scope.selectedProduct;
                                $scope.lifeProposeFormDetails.proposerDetails = $scope.proposerDetails;
                                $scope.lifeProposeFormDetails.nominationDetails = $scope.nominationDetails;
                                $scope.lifeProposeFormDetails.previousPolicyDetails = $scope.previousPolicyDetails;
                                if ($scope.addressDetails.isAddressSameAsCommun) {
                                    $scope.addressDetails.permanentAddress = $scope.addressDetails.communicationAddress;
                                }
                                // if($scope.nominationDetails.nomineeAddressDetails.isNomineeAddressSameAsCommun){
                                // 	$scope.nominationDetails.nomineeAddressDetails = $scope.addressDetails.communicationAddress;
                                // 	//$scope.nominationDetails.nomineeAddressDetails.isNomineeAddressSameAsCommun=true;

                                // }
                                // if($scope.nominationDetails.appointeeAddressDetails.isAppointeeAddressSameAsCommun){
                                // 	$scope.nominationDetails.appointeeAddressDetails= $scope.addressDetails.communicationAddress;
                                // 	//$scope.nominationDetails.appointeeAddressDetails.isAppointeeAddressSameAsCommun=true;
                                // }
                                $scope.lifeProposeFormDetails.addressDetails = $scope.addressDetails;

                                $scope.lifeProposeFormDetails.medicalQuestionarrier = angular.copy($scope.medicalInfo.medicalQuestionarrier);
                                $scope.lifeProposeFormDetails.jobsDetails = angular.copy($scope.jobsInfo.jobsDetails);
                                $scope.lifeProposeFormDetails.dieaseDetails = angular.copy($scope.medicalInfo.dieaseDetails);

                                for (var i = 0; i < $scope.lifeProposeFormDetails.dieaseDetails.length; i++) {
                                    if ($scope.lifeProposeFormDetails.dieaseDetails[i] == undefined) {
                                        $scope.lifeProposeFormDetails.dieaseDetails.splice(i, 1);
                                        i = i - 1;

                                    }
                                } // $scope.selectedJobsList[0] = $scope.selectedJob; 
                                // $scope.lifeProposeFormDetails.jobsDetails = $scope.selectedJobsList;
                                // $scope.lifeProposeFormDetails.diseaseDetails = $scope.selectedDiseaseList;

                                //for future generali-added based on Kuldeep Patil 
                                if ($scope.selectedProduct.carrierUniqueId) {
                                    $scope.lifeProposeFormDetails.premiumDetails.carrierUniqueId = $scope.selectedProduct.carrierUniqueId;
                                }
                                //added for LMS
                                if ($scope.selectedProduct.totalDiscountAmount == 0 || $scope.selectedProduct.totalDiscountAmount) {
                                    $scope.lifeProposeFormDetails.totalDiscountAmount = $scope.selectedProduct.totalDiscountAmount;
                                }
                                if ($scope.selectedProduct.totalRiderAmount == 0 || $scope.selectedProduct.totalRiderAmount) {
                                    $scope.lifeProposeFormDetails.totalRiderAmount = $scope.selectedProduct.totalRiderAmount;
                                }
                                if ($scope.selectedProduct.basicCoverage == 0 || $scope.selectedProduct.basicCoverage) {
                                    $scope.lifeProposeFormDetails.basicCoverage = $scope.selectedProduct.basicCoverage;
                                }

                                //added user-idv in proposal request as suggested by srikant
                                $scope.lifeProposeFormDetails.premiumDetails.userIdv = localStorageService.get("lifeQuoteInputParamaters").quoteParam.userIdv;
                                $scope.lifeProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
                                $scope.lifeProposeFormDetails.productId = $scope.selectedProduct.productId;
                                $scope.lifeProposeFormDetails.requestType = $scope.p365Labels.request.lifePropRequestType;
                            }

                            // nominee relation heare
                            $scope.changeNomineeRelation = function (relationObj) {

                                $scope.nominationDetails.nominationRelation = relationObj.relationNominee;
                                $scope.nominationDetails.gender = relationObj.gender;
                                $scope.personalDetails = $scope.proposerDetails;
                            }

                            $scope.changeAppointeeRelation = function (relation) {

                                $scope.nominationDetails.appointeeDetails.appointeeRelation = relation.relationAppointee;
                                $scope.nominationDetails.appointeeDetails.gender = relation.gender;
                                $scope.personalDetails = $scope.proposerDetails;
                            };

                            $scope.loadLists = function () {
                                var occupationDocId = $scope.p365Labels.documentType.lifeOccupation + "-" + $scope.selectedProduct.carrierId;
                                getDocUsingId(RestAPI, occupationDocId, function (occupationList) {
                                    $scope.occupationList = occupationList.Occupation;

                                    var nomineeRelationDocId = $scope.p365Labels.documentType.lifeNomineeRelation + "-" + $scope.selectedProduct.carrierId;
                                    getDocUsingId(RestAPI, nomineeRelationDocId, function (nomineeRelationList) {
                                        $scope.nomineeRelList = nomineeRelationList.NomineeRelation;

                                        var appointeeRelationDocId = $scope.p365Labels.documentType.lifeAppointeeRelation + "-" + $scope.selectedProduct.carrierId;
                                        getDocUsingId(RestAPI, appointeeRelationDocId, function (appointeeRelationList) {
                                            $scope.appointeeRelList = appointeeRelationList.AppointeeRelation;
                                            var nationalityDocId = $scope.p365Labels.documentType.lifeNationality + "-" + $scope.selectedProduct.carrierId;
                                            getDocUsingId(RestAPI, nationalityDocId, function (nationalityList) {
                                                $scope.nationalityList = nationalityList.Nationality;


                                                var searchData = {};
                                                searchData.documentType = "LifeDiseaseQuestion";
                                                searchData.carrierId = $scope.selectedProduct.carrierId;
                                                searchData.planId = $scope.selectedProduct.productId;
                                                searchData.riders = $scope.selectedProduct.ridersList;
                                                //gender added in medical question request as suggested by aishwarya
                                                searchData.gender = angular.copy($scope.responseProduct.gender);
                                                getDocUsingParam(RestAPI, "getHealthQuestionList", searchData, function (callback) {
                                                    $scope.medicalQuestionarrie = callback.data;


                                                    var searchDiseaseData = {};
                                                    searchDiseaseData.documentType = "LifeDiseaseMapping";
                                                    searchDiseaseData.carrierId = $scope.selectedProduct.carrierId;
                                                    searchDiseaseData.planId = $scope.selectedProduct.productId;
                                                    searchDiseaseData.riders = $scope.selectedProduct.ridersList;
                                                    searchData.gender = $scope.proposerDetails.gender;
                                                    getDocUsingParam(RestAPI, "getHealthQuestionList", searchDiseaseData, function (callback) {
                                                        // $scope.diseaseList = [];

                                                        angular.forEach(callback.data, function (element) {
                                                            element.applicable = false;
                                                        });
                                                        $scope.diseaseList = angular.copy(callback.data)
                                                        // $scope.diseaseList = callback.data;
                                                        // $scope.numberOfPages  = 1;
                                                        // $scope.numberOfPages = Math.floor($scope.diseaseList.length/$scope.numRecords);	
                                                        $scope.diseaseListDisable = angular.copy($scope.diseaseList);
                                                        for (var i = 0; i < $scope.diseaseListDisable.length; i++) {
                                                            $scope.diseaseListDisable[i].subParentId = $scope.diseaseListDisable[i].parentId
                                                        }

                                                        var searchDiseaseData = {};
                                                        searchDiseaseData.documentType = "LifeJobMapping";
                                                        searchDiseaseData.carrierId = $scope.selectedProduct.carrierId;
                                                        searchDiseaseData.planId = $scope.selectedProduct.productId;
                                                        searchDiseaseData.riders = $scope.selectedProduct.ridersList;

                                                        getDocUsingParam(RestAPI, "getHealthQuestionList", searchDiseaseData, function (callback) {
                                                            $scope.jobsList = angular.copy(callback.data)
                                                            $scope.jobsListCopy = angular.copy($scope.jobsList);
                                                            $rootScope.loading = false;
                                                            $scope.prePopulateForm();

                                                            // $scope.getCarrierList = function(){
                                                            //     getListFromDB(RestAPI, "", $scope.p365Labels.documentType.lifeCarrier, $scope.p365Labels.request.findAppConfig, function(lifeCarrierList){
                                                            //         if(lifeCarrierList.responseCode == $scope.p365Labels.responseCode.success){
                                                            //             $scope.carrierList = lifeCarrierList.data;
                                                            //             var docId = $scope.p365Labels.documentType.buyScreen + "-" + $scope.selectedProductInputParam.quoteParam.quoteType;
                                                            //             getDocUsingId(RestAPI, docId, function(buyScreenTooltip){
                                                            //                 $scope.buyTooltip = buyScreenTooltip.toolTips;
                                                            //                 // $scope.getRelationshipList();
                                                            //                 $scope.prePopulateForm();
                                                            //                 $rootScope.loading = false;
                                                            //             });
                                                            //         }else{

                                                            //             $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.serverError, "Ok");
                                                            //         }
                                                            //     });
                                                            // }



                                                        });

                                                    });
                                                });
                                            });
                                        });
                                    });
                                });

                            }

                            $scope.loadLists();

                        }); // ./getDocUsingIdQuoteDB;
                    } else {
                        $rootScope.P365Alert("Error", buyScreen.data, "Ok");
                    }
                }); // ./getDocUsingParam;

            } else {
                // If screen are not present in DB. Show Error Message and redirect to instant quote screen (home page).
                $scope.loading = false;
                var buyScreenCnfrmError = $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
            }

        });

    }]);