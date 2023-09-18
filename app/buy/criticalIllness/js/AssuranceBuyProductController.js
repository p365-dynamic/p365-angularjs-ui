/*QuoteResult Controller*/

/**
 * @Author:Prathamesh.Waghmare
 * @Description: Life Proposal Form created
 * 
 */

'use strict';
angular.module('buyAssurance', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('buyAssuranceController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$window', '$http', '$filter', '$interval', '$sce', function($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $window, $http, $filter, $interval, $sce) {
        // Setting application labels to avoid static assignment.

        $scope.lifeProposalSectionHTML = wp_path + 'buy/life/html/LifeProposalSection.html';

        var applicationLabels = localStorageService.get("applicationLabels");
        $scope.globalLabel = applicationLabels.globalLabels;

        $rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.life.proverbBuyProduct) };
        $rootScope.title = $scope.globalLabel.policies365Title.lifeBuyQuote;
        $rootScope.loaderContent = { businessLine: '1', header: 'Life Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.life.proverbResult) };

        $scope.genderMorF;
        $scope.nationalityList = {};
        $scope.appointeeRelList = {};
        $scope.nomineeRelList = {};
        $scope.occupationList = {};
        $scope.personalDetails = {};
        $scope.proposerInfo = {};
        $scope.proposerDetails = {};
        $scope.assuranceInfo = {};
        $scope.assuranceDetails = {};
        $scope.nominationInfo = {};
        $scope.nominationDetails = {};
        $scope.appointeeInfo = {};
        $scope.appointeeDetails = {};
        $scope.insuranceInfo = {};
        $scope.insuranceDetails = {};
        $scope.lifeProposeFormCookieDetails = {};
        $scope.authenticate = {};
        $scope.iposRequest = {};

        $scope.iposRequest.parent_id = String($rootScope.parent_id) != "undefined" ? $rootScope.parent_id : $location.search().recordId;
        $scope.iposRequest.parent_type = String($rootScope.parent_type) != "undefined" ? $rootScope.parent_type : $location.search().moduleName;
        $scope.iposRequest.requestType = $scope.globalLabel.request.createShareQuoteRecord;
        console.log("createProposalRecord :", $scope.globalLabel.request.createProposalRecord);


        var nationalityFlag = false;
        var staffFlag = false;
        $scope.screenOneStatus = true;
        $scope.screenTwoStatus = false;
        $scope.screenThreeStatus = false;
        $scope.previousPolicyStatus = true;
        $scope.previousPolicyStatus = true;

        var genderType = [{ "label": "Male", "value": "M" }, { "label": "Female", "value": "F" }, { "label": "Other", "value": "Other" }];

        $scope.lifePersonalInformation = localStorageService.get("lifePersonalDetails");
        $scope.marrital = maritalStatusListGeneric;
        $scope.proposerDetails.marrital = $scope.marrital[0].name;
        $scope.annualIncome = annualIncomesGeneric;
        $scope.gender = genderType;
        $scope.carrierStaff = yesNoStatusGeneric;

        var quoteUserInfo = localStorageService.get("quoteUserInfo");
        var buyScreens = localStorageService.get("buyScreen");
        $scope.selectedProduct = localStorageService.get("lifeSelectedProduct");
        $scope.selectedProductInputParam = localStorageService.get("lifeQuoteInputParamaters");
        $scope.addOnCovers = localStorageService.get("addOnCoverListForLife");
        $scope.lifeInfo = localStorageService.get("lifePersonalDetails");

        $scope.ownerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
        $scope.productValidation = buyScreens.validation;
        $scope.redirectSuccessUrl = buyScreens.redirectSuccessUrl;
        $scope.redirectFailureUrl = buyScreens.redirectFailureUrl;
        $scope.requestFormat = buyScreens.requestFormat;
        $scope.transactionName = buyScreens.transaction.proposalService.name;
        $scope.paymentURL = buyScreens.paymentUrl;

        $scope.proposerDetails.dateOfBirth = $scope.selectedProductInputParam.personalDetails.dateOfBirth;

        if ($scope.selectedProductInputParam.quoteParam.gender == "M") {
            $scope.proposerDetails.gender = "Male";
            $scope.proposerDetails.salutation = "Mr";
        } else {
            $scope.proposerDetails.gender = "Female";
            $scope.proposerDetails.salutation = "Mr";
        }

        //prepopulated details for gender and dob
        $scope.prePopulateProposerDetails = function() {
            $scope.storedDOB = angular.copy($scope.selectedProductInputParam.personalDetails.dateOfBirth);
            $scope.genderDefault = angular.copy($scope.proposerDetails.gender);
            if ($scope.selectedProductInputParam.quoteParam.gender == "M") {
                $scope.storedGENDER = angular.copy($scope.proposerDetails.gender);
            } else {
                $scope.storedGENDER = angular.copy($scope.proposerDetails.gender);
            }

        };
        $scope.prePopulateProposerDetails();

        $scope.proposerDetails.emailId = String(quoteUserInfo.emailId) !== "undefined" ? quoteUserInfo.emailId : "";
        $scope.proposerDetails.mobileNumber = String(quoteUserInfo.mobileNumber) !== "undefined" ? quoteUserInfo.mobileNumber : "";
        $scope.proposerDetails.lastName = String(quoteUserInfo.lastName) !== "undefined" ? quoteUserInfo.lastName : "";
        $scope.proposerDetails.firstName = String(quoteUserInfo.firstName) !== "undefined" ? quoteUserInfo.firstName : "";
        $scope.assuranceDetails.purchasedLoan = "No";
        $scope.proposerDetails.incomeStatus = $scope.lifeInfo.annualIncomeObject.display;

        $scope.riderStatus = false;
        if ($scope.selectedProduct.ridersList != null && String($scope.selectedProduct.ridersList) != "undefined") {
            for (var i = 0; i < $scope.selectedProduct.ridersList.length; i++) {
                if ($scope.selectedProduct.ridersList[i].riderValue != null) {
                    $scope.riderStatus = true;
                    delete $scope.selectedProduct.ridersList[i].$$hashKey;
                }
            }
        }

        //fxn to calculate default area details
        $scope.calcDefaultAreaDetails = function(areaCode) {
            $http.get(getServiceLink + "Pincode" + "&q=" + areaCode).then(function(response) {
                var areaDetails = JSON.parse(response.data);
                if (areaDetails.responseCode == $scope.globalLabel.responseCode.success) {
                    $scope.loading = false;
                    $scope.onSelectPinOrArea(areaDetails.data[0]);
                }
            });
        }

        $scope.proposerDetails.pincode = localStorageService.get("cityDataFromIP") ? localStorageService.get("cityDataFromIP").cityStatus == true ? localStorageService.get("cityDataFromIP").pincode : "110002" : "110002";
        $scope.calcDefaultAreaDetails($scope.proposerDetails.pincode);
        $scope.modalPIN = false;
        $scope.togglePin = function() {
            $scope.modalPIN = !$scope.modalPIN;
            $scope.hideModal = function() {
                $scope.modalPIN = false;
            }
        };

        $scope.hideModal = function() {
            $scope.modalOTP = false;
            $scope.proceedPaymentStatus = true;
            $scope.authenticate.enteredOTP = "";
        };

        $scope.hideModalError = function() {
            $scope.modalOTPError = false;
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
                    $scope.invalidOTPError = "";
                } else {
                    $scope.invalidOTPError = $scope.globalLabel.errorMessage.createOTP;
                }
            });
        };
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

        $scope.onSelectVehiclePinOrArea = function(item) {
            $scope.assuranceDetails.registrationAddress = item;
            $scope.displayArea = item.area + ", " + item.city;
            $scope.assuranceDetails.area = item.area;
            $scope.assuranceDetails.pincode = item.pincode;
            $scope.assuranceDetails.city = item.city;
            $scope.assuranceDetails.state = item.state;
            $scope.loadPlaceholder();
            localStorageService.set("regGeoDetails", item);
        };

        // Method to get list of pincodes
        $scope.getPinCodeAreaList = function(searchValue) {
            var docType = $scope.globalLabel.documentType.cityDetails;
            var carrierId = $scope.selectedProduct.carrierId;

            return $http.get(getSearchServiceLink + docType + "&q=" + searchValue + "&id=" + carrierId).then(function(response) {
                return JSON.parse(response.data).data;
            });
        };

        $scope.loadPlaceholder = function() {
            setTimeout(function() {
                $('.buyform-control').on('focus blur', function(e) {
                    $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
                }).trigger('blur');
            }, 100);
        }

        $scope.onSelectPinOrArea = function(item) {
            $scope.displayArea = item.area + ", " + item.district;
            $scope.modalPIN = false;
            $scope.proposerDetails.area = item.area;
            $scope.proposerDetails.pincode = item.pincode;
            $scope.proposerDetails.city = item.district;
            $scope.proposerDetails.state = item.state;
            $scope.loadPlaceholder();
            localStorageService.set("userGeoDetails", item);
        }

        $scope.changeMaritalStatus = function() {}

        $scope.changeOccupation = function() {}

        $scope.changeIncome = function() {

            }
            //Carrier wise staff flag
        $scope.changeStaff = function() {
            if ($scope.proposerDetails.StaffStatus == "Yes") {
                $scope.staffFlag = true;
            } else {
                $scope.staffFlag = false;
                $scope.proposerDetails.staffCode = "";
            }
        }

        $scope.changeGender = function() {
            if ($scope.proposerDetails.gender == "Male" || $scope.proposerDetails.gender == "Other") {
                $scope.proposerDetails.salutation = "Mr";
            } else {
                $scope.proposerDetails.salutation = "Mrs";
            }
            //calling recalculate Quotes As per Gender
            $scope.recalculateProposerGender();

        }

        $scope.changeNationality = function() {
            if ($scope.proposerDetails.nationalityStatus == "Other") {
                $scope.nationalityFlag = true;
            } else {
                $scope.nationalityFlag = false;
                $scope.proposerDetails.otherNationality = "";
            }
        }

        $scope.changeNationalityOther = function() {}

        $scope.changeNomineeRelation = function() {
            $scope.personalDetails = $scope.proposerDetails;
        }

        $scope.changeAppointeeRelation = function() {};

        $scope.changeRegAddress = function() {
            if ($scope.assuranceDetails.isPersonAddressSameAsCommun) {
                $scope.assuranceDetails.registrationAddress = $scope.proposerDetails.communicationAddress;
                $scope.assuranceDetails.address = $scope.proposerDetails.address;
                $scope.assuranceDetails.doorNo = $scope.proposerDetails.doorNo;
                $scope.assuranceDetails.addressLine1 = $scope.proposerDetails.addressLine1;
                $scope.assuranceDetails.addressLine2 = $scope.proposerDetails.addressLine2;
                $scope.assuranceDetails.area = $scope.proposerDetails.area;
                $scope.assuranceDetails.pincode = $scope.proposerDetails.pincode;
                $scope.assuranceDetails.city = $scope.proposerDetails.city;
                $scope.assuranceDetails.state = $scope.proposerDetails.state;
            } else {
                $scope.assuranceDetails.registrationAddress = "";
                $scope.assuranceDetails.address = "";
                $scope.assuranceDetails.doorNo = "";
                $scope.assuranceDetails.pincode = "";
                $scope.assuranceDetails.addressLine1 = "";
                $scope.assuranceDetails.addressLine2 = "";
                $scope.assuranceDetails.area = "";
                $scope.assuranceDetails.city = "";
                $scope.assuranceDetails.state = "";
            }
        };

        //calculation
        $scope.calculateProposerAge = function() {
            $scope.proposerDetails.personAge = getAgeFromDOB($scope.proposerDetails.dateOfBirth);
            $scope.selectedProductInputParam.personalDetails.dateOfBirth = $scope.proposerDetails.dateOfBirth;
            $scope.selectedProductInputParam.quoteParam.age = parseInt(getAgeFromDOB($scope.proposerDetails.dateOfBirth));
            $scope.calculateMaturityAgeGap();
            $scope.recalculateProposerAge();
        };

        //maturity age gap calculated as discuss with uday sir
        $scope.calculateMaturityAgeGap = function() {
            if ($scope.selectedProductInputParam.quoteParam.age > 35) {
                $scope.selectedProductInputParam.personalDetails.maturityAge = maturityAgeConstant;
            } else {
                $scope.selectedProductInputParam.personalDetails.maturityAge = $scope.selectedProductInputParam.quoteParam.age + 40;
            }
        }

        $scope.backToResultScreen = function() {
            $location.path("/lifeResult");
        }

        $scope.showAuthenticateForm = function() {

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
                    $scope.createOTPError = "";
                    $scope.modalOTP = true;
                } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                    $scope.createOTPError = createOTP.message;
                    $scope.modalOTPError = true;
                } else {
                    $scope.createOTPError = $scope.globalLabel.errorMessage.createOTP;
                    $scope.modalOTPError = true;
                }
            });
        };

        $scope.validateProposerDateOfBirth = function() {
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

        $scope.changePurchasedLoan = function() {
            if ($scope.assuranceDetails.purchasedLoan == "No") {
                $scope.assuranceDetails.financeInstitution = "";
            }
            $scope.loadPlaceholder();
        }

        $scope.validateNomineeDateOfBirth = function() {
            $scope.nominationDetails.personAge = getAgeFromDOB($scope.nominationDetails.dateOfBirth);
            if ($scope.nominationDetails.personAge < 18) {
                $scope.appointeeStatus = true;
                $scope.nomineeRelationList = buyScreenMinorNomineeRealtion;
                $scope.loadPlaceholder();
                $scope.appointeeRelationList = buyScreenAppointeeRelation;
            } else {
                $scope.appointeeStatus = false;
                $scope.nomineeRelationList = buyScreenNotMinorNomineeRealtion;
                $scope.appointeeRelationList = buyScreenAppointeeRelation;
            }
        }

        $scope.validateAppointeeDateOfBirth = function() {
            $scope.appointeeDetails.personAge = getAgeFromDOB($scope.appointeeDetails.dateOfBirth);
            if ($scope.appointeeDetails.personAge < 18) {
                $scope.appointeeDetails.dateOfBirth = undefined;
                $scope.appointeeDateOfBirthError = $scope.productValidation.messages.dateOfBirthInvalid;
            } else {
                $scope.loadPlaceholder();
                $scope.appointeeDateOfBirthError = "";
            }
        }

        $scope.validatePolicyStartDate = function() {
            if (String($scope.insuranceDetails.policyStartDate) !== "undefined") {
                var todayDate = new Date();
                var polStartDate = $scope.insuranceDetails.policyStartDate.split("/");
                var tempPolStartDate = polStartDate[1] + "/" + polStartDate[0] + "/" + polStartDate[2];

                var regDate = $scope.selectedProductInputParam.assuranceInfo.dateOfRegistration.split("/");
                var tempRegDate = regDate[1] + "/" + regDate[0] + "/" + regDate[2];
                var futureDate = new Date((tempRegDate.setDate(tempRegDate.getDate() + Number($scope.productValidation.policyStartDateLimit))));

                if (new Date(tempPolStartDate).setHours(0, 0, 0, 0) < todayDate.setHours(0, 0, 0, 0)) {
                    $scope.insuranceDetails.policyStartDate = undefined;
                    $scope.insuranceDetails.policyEndDate = undefined;
                    $scope.policyStartDateError = $scope.productValidation.messages.policyStartDateInvalidOne;
                } else {
                    if (new Date(tempPolStartDate).setHours(0, 0, 0, 0) < new Date(tempRegDate).setHours(0, 0, 0, 0)) {
                        $scope.insuranceDetails.policyStartDate = undefined;
                        $scope.insuranceDetails.policyEndDate = undefined;
                        var dispRegistrationDate = regDate[0] + "-" + monthListGeneric[Number(regDate[1])] + "-" + regDate[2];
                        $scope.policyStartDateError = $scope.productValidation.messages.policyStartDateInvalidTwo.replace("DISP_REGISTRATION_DATE", dispRegistrationDate);
                    } else if (new Date(tempPolStartDate).setHours(0, 0, 0, 0) > futureDate.setHours(0, 0, 0, 0)) {
                        $scope.insuranceDetails.policyStartDate = undefined;
                        $scope.insuranceDetails.policyEndDate = undefined;
                        var dispFutureDate = futureDate.getDate() + "-" + monthListGeneric[Number(futureDate.getMonth())] + "-" + futureDate.getFullYear();
                        $scope.policyStartDateError = $scope.productValidation.messages.policyStartDateInvalidThree.replace("DISP_FUTURE_DATE", dispFutureDate);
                    } else {
                        var polEndDate = new Date(new Date(String(tempPolStartDate)).setFullYear(new Date(tempPolStartDate).getFullYear() + 1));
                        var tempPolEndDate = new Date(polEndDate.setDate(polEndDate.getDate() - 1));
                        $scope.insuranceDetails.policyEndDate = tempPolEndDate.getDate() + "/" + (Number(tempPolEndDate.getMonth()) + 1) + "/" + tempPolEndDate.getFullYear();
                        $scope.policyStartDateError = "";
                        $scope.loadPlaceholder();
                    }
                }
            }
        }

        $scope.accordion = '1';
        $scope.editPesonalInfo = function() {
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.accordion = '1';
        };

        $scope.editNomineeInfo = function() {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.accordion = '2';
        };

        $scope.Section2Inactive = true;
        $scope.Section3Inactive = true;
        $scope.Section4Inactive = true;

        $scope.submitPersonalDetails = function() {

            $scope.proceedPaymentStatus = true;
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.screenFourStatus = false;
            $scope.Section2Inactive = false;
            $scope.accordion = '2';
            $scope.splitAddressField();
            //added by gauri for imautic
            if (imauticAutomation == true) {
                imatEvent('ProposalFilled');
            }
            if (!$scope.assuranceDetails.isPersonAddressSameAsCommun) {
                $scope.splitVehicleAddressField();
            }
            $scope.lifeProposeFormCookieDetails.proposerDetails = $scope.proposerDetails;
            $scope.lifeProposeFormCookieDetails.proposerInfo = $scope.proposerInfo;
        };

        $scope.submitNomineeDetails = function() {
            /*if($scope.Section3Inactive)
            	$scope.assuranceDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);*/
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = true;
            $scope.proceedPaymentStatus = true;
            $scope.Section3Inactive = false;
            $scope.accordion = '3';
        }

        //DropDownList fetching from Database 
        var occupationDocId = $scope.globalLabel.documentType.lifeOccupation + "-" + $scope.selectedProduct.carrierId;
        getDocUsingId(RestAPI, occupationDocId, function(occupationList) {
            $scope.occupationList = occupationList.Occupation;

            var nomineeRelationDocId = $scope.globalLabel.documentType.lifeNomineeRelation + "-" + $scope.selectedProduct.carrierId;
            getDocUsingId(RestAPI, nomineeRelationDocId, function(nomineeRelationList) {
                $scope.nomineeRelList = nomineeRelationList.NomineeRelation;

                var appointeeRelationDocId = $scope.globalLabel.documentType.lifeAppointeeRelation + "-" + $scope.selectedProduct.carrierId;
                getDocUsingId(RestAPI, appointeeRelationDocId, function(appointeeRelationList) {
                    $scope.appointeeRelList = appointeeRelationList.AppointeeRelation;

                    var nationalityDocId = $scope.globalLabel.documentType.lifeNationality + "-" + $scope.selectedProduct.carrierId;
                    getDocUsingId(RestAPI, nationalityDocId, function(nationalityList) {
                        $scope.nationalityList = nationalityList.Nationality;
                    });
                });
            });
        });

        $scope.splitAddressField = function() {
            $scope.proposerDetails.addressLine1 = "";
            $scope.proposerDetails.addressLine2 = "";

            var tempAddressArray = $scope.proposerDetails.address[0].split(/[\s,]+/);
            var addressArrayLength = tempAddressArray.length;

            if (addressArrayLength > 1) {
                var addressArrayLimit = Math.round(addressArrayLength / 2);

                for (var i = 0; i < addressArrayLimit; i++) {
                    if (i == (addressArrayLimit - 1))
                        $scope.proposerDetails.addressLine1 += tempAddressArray[i].trim();
                    else
                        $scope.proposerDetails.addressLine1 += tempAddressArray[i].trim() + " ";
                }

                for (var i = addressArrayLimit; i < addressArrayLength; i++) {
                    if (i == (addressArrayLength - 1))
                        $scope.proposerDetails.addressLine2 += tempAddressArray[i].trim();
                    else
                        $scope.proposerDetails.addressLine2 += tempAddressArray[i].trim() + " ";
                }
            } else {
                $scope.proposerDetails.addressLine1 = $scope.proposerDetails.address[0];
                $scope.proposerDetails.addressLine2 = "";
            }
        }

        $scope.proposalInfo = function() {
            $scope.lifeProposeFormDetails = {};

            $scope.proposerDetails.panNumber = String($scope.proposerDetails.panNumber) != "undefined" ? $scope.proposerDetails.panNumber.toUpperCase() : "";
            $scope.lifeProposeFormDetails.premiumDetails = $scope.selectedProduct;
            $scope.lifeProposeFormDetails.proposerDetails = $scope.proposerDetails;
            $scope.lifeProposeFormDetails.nominationDetails = $scope.nominationDetails;
            $scope.lifeProposeFormDetails.appointeeDetails = $scope.appointeeDetails;
            $scope.lifeProposeFormDetails.assuranceDetails = $scope.assuranceDetails;

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

            if ($scope.referralCode) {
                $scope.lifeProposeFormDetails.referralCode = $scope.referralCode;
            }

            if ($scope.assuranceInfo.addOnCoverCustomAmount != null && JSON.stringify($scope.assuranceInfo.addOnCoverCustomAmount) != "undefined") {
                $scope.lifeProposeFormDetails.premiumDetails.PAUnnamedCoverSI = $scope.assuranceInfo.addOnCoverCustomAmount.passengerCover;
                $scope.lifeProposeFormDetails.premiumDetails.DriverCoverSI = $scope.assuranceInfo.addOnCoverCustomAmount.driverAccidentCover;
                $scope.lifeProposeFormDetails.premiumDetails.ElectricalAccessoriesSI = $scope.assuranceInfo.addOnCoverCustomAmount.electricalAccessories;
                $scope.lifeProposeFormDetails.premiumDetails.NonElectricalAccessoriesSI = $scope.assuranceInfo.addOnCoverCustomAmount.nonElectricalAccessories;
                $scope.lifeProposeFormDetails.premiumDetails.LPGCNGKitSI = $scope.assuranceInfo.addOnCoverCustomAmount.lpgCngKitCover;
            } else {
                $scope.lifeProposeFormDetails.premiumDetails.PAUnnamedCoverSI = 0;
                $scope.lifeProposeFormDetails.premiumDetails.DriverCoverSI = 0;
                $scope.lifeProposeFormDetails.premiumDetails.ElectricalAccessoriesSI = 0;
                $scope.lifeProposeFormDetails.premiumDetails.NonElectricalAccessoriesSI = 0;
                $scope.lifeProposeFormDetails.premiumDetails.LPGCNGKitSI = 0;
            }

            if ($scope.selectedProduct.paidDriverCover > 0) {
                $scope.lifeProposeFormDetails.premiumDetails.PAtoOD = "Yes";
            } else {
                $scope.lifeProposeFormDetails.premiumDetails.PAtoOD = "No";
            }
            //added user-idv in proposal request as suggested by srikant
            $scope.lifeProposeFormDetails.premiumDetails.userIdv = localStorageService.get("lifeQuoteInputParamaters").quoteParam.userIdv;
            $scope.lifeProposeFormDetails.carrierId = $scope.selectedProduct.carrierId;
            $scope.lifeProposeFormDetails.productId = $scope.selectedProduct.productId;
            $scope.lifeProposeFormDetails.requestType = $scope.globalLabel.request.lifePropRequestType;
        }

        /*----- iPOS+ Functions-------*/
        $scope.getCarrierList = function() {
            getListFromDB(RestAPI, "", $scope.globalLabel.documentType.lifeCarrier, $scope.globalLabel.request.findAppConfig, function(lifeCarrierList) {
                if (lifeCarrierList.responseCode == $scope.globalLabel.responseCode.success) {
                    $scope.carrierList = lifeCarrierList.data;
                    var docId = $scope.globalLabel.documentType.buyScreen + "-" + $scope.selectedProductInputParam.quoteParam.quoteType;
                    getDocUsingId(RestAPI, docId, function(buyScreenTooltip) {
                        $scope.buyTooltip = buyScreenTooltip.toolTips;
                        $scope.getRelationshipList();
                        $rootScope.loading = false;
                    });
                } else {

                    $rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.serverError, "Ok");
                }
            });
        }

        //recalculate Gender 
        $scope.recalculateProposerGender = function() {
            if (($scope.storedGENDER) != 'undefined' || $scope.storedGENDER != null) {
                if ($scope.proposerDetails.gender == "Male" || $scope.proposerDetails.gender == "Other") {
                    $scope.genderMorF = 'M';
                    $scope.selectedProductInputParam.quoteParam.gender = $scope.genderMorF;
                } else {
                    $scope.genderMorF = 'F';
                    $scope.selectedProductInputParam.quoteParam.gender = $scope.genderMorF
                }
                if ($scope.storedGENDER != $scope.proposerDetails.gender) {
                    $rootScope.P365Confirm($scope.globalLabel.applicationLabels.common.p365prompt, $scope.globalLabel.applicationLabels.common.genderChangeMsg, "No", "Yes", function(confirmStatus) {
                        if (confirmStatus) {
                            $scope.loading = true;
                            $scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.personalDetails.maturityAge - $scope.selectedProductInputParam.quoteParam.age;
                            //$scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.quoteParam.;
                            RestAPI.invoke($scope.globalLabel.getRequest.quoteLife, $scope.selectedProductInputParam).then(function(callback) {
                                $scope.lifeRecalculateQuoteRequest = [];
                                if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                    $scope.responseRecalculateCodeList = [];

                                    localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                    localStorageService.set("LIFE_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                    $scope.lifeRecalculateQuoteRequest = callback.data;

                                    $scope.lifeQuoteResult = [];
                                    $scope.quoteCalcResponse = [];
                                    angular.forEach($scope.lifeRecalculateQuoteRequest, function(obj, i) {
                                        var request = {};
                                        var header = {};

                                        header.messageId = messageIDVar;
                                        header.campaignID = campaignIDVar;
                                        header.source = sourceOrigin;
                                        header.transactionName = $scope.globalLabel.transactionName.lifeQuoteResult;
                                        header.deviceId = deviceIdOrigin;
                                        request.header = header;
                                        request.body = obj;

                                        $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                        success(function(callback, status) {
                                            var lifeQuoteResponse = JSON.parse(callback);

                                            if (lifeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                                if (lifeQuoteResponse.data != null && lifeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                    lifeQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {

                                                    console.log("sucessfullyyyyyyyyyyyyyyyyyyyyyyy");
                                                    $scope.selectedProduct.annualPremium = lifeQuoteResponse.data.quotes[0].annualPremium;
                                                    $scope.selectedProduct.monthlyFinalPremium = lifeQuoteResponse.data.quotes[0].monthlyFinalPremium;
                                                    $scope.selectedProduct.basicPremium = lifeQuoteResponse.data.quotes[0].basicPremium;
                                                    $scope.selectedProduct.monthlyBasePremium = lifeQuoteResponse.data.quotes[0].monthlyBasePremium;
                                                    $scope.selectedProduct.serviceTax = lifeQuoteResponse.data.quotes[0].sericeTax;
                                                    $scope.selectedProduct.sumInsured = lifeQuoteResponse.data.quotes[0].sumInsured;
                                                    $scope.selectedProduct.adjustedPremium = lifeQuoteResponse.data.quotes[0].adjustedPremium;

                                                    console.log("After $scope.selectedProduct", $scope.selectedProduct);

                                                    $scope.loading = false;
                                                }
                                                lifeQuoteResponse.data.quotes[0].id = lifeQuoteResponse.messageId;
                                                $scope.quoteCalcResponse.push(lifeQuoteResponse.data.quotes[0]);
                                            } else {
                                                if (lifeQuoteResponse.data != null && lifeQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                                    lifeQuoteResponse.data.quotes[0].productId == $scope.selectedProduct.productId) {

                                                    $scope.loading = false;
                                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.globalLabel.errorMessage.screenConfirmErrorMsg
                                                    $rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, screenCnfrmError, "Ok");

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
                                    $scope.proposerDetails.gender = $scope.storedGENDER;
                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.globalLabel.errorMessage.screenConfirmErrorMsgDob
                                    $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                }

                            });
                            $scope.storedGENDER = $scope.proposerDetails.gender;
                            $scope.proposerDetails.gender = $scope.storedGENDER;

                        } else {
                            $scope.loading = false;
                            $scope.proposerDetails.gender = $scope.storedGENDER;
                            $scope.storedGENDER = $scope.proposerDetails.gender;

                        }
                    });
                } else {
                    $scope.loading = false;
                    $scope.proposerDetails.gender = $scope.storedGENDER;
                    $scope.storedGENDER = $scope.proposerDetails.gender;
                }
            }
        }

        $scope.recalculateProposerAge = function() {
            if (String($scope.storedDOB) != 'undefined' || $scope.storedDOB != null) {
                if ($scope.storedDOB != $scope.proposerDetails.dateOfBirth) {
                    $rootScope.P365Confirm($scope.globalLabel.applicationLabels.common.p365prompt, $scope.globalLabel.applicationLabels.common.DobChangeMsg, "No", "Yes", function(confirmStatus) {
                        if (confirmStatus) {
                            $scope.loading = true;
                            $scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.personalDetails.maturityAge - $scope.selectedProductInputParam.quoteParam.age;
                            //$scope.selectedProductInputParam.quoteParam.policyTerm = $scope.selectedProductInputParam.quoteParam.;
                            RestAPI.invoke($scope.globalLabel.getRequest.quoteLife, $scope.selectedProductInputParam).then(function(callback) {
                                $scope.lifeRecalculateQuoteRequest = [];
                                if (callback.responseCode == $scope.globalLabel.responseCode.success) {
                                    $scope.responseRecalculateCodeList = [];

                                    localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                    localStorageService.set("LIFE_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                    $scope.lifeRecalculateQuoteRequest = callback.data;

                                    $scope.lifeQuoteResult = [];
                                    $scope.quoteCalcResponse = [];
                                    angular.forEach($scope.lifeRecalculateQuoteRequest, function(obj, i) {
                                        var request = {};
                                        var header = {};

                                        header.messageId = messageIDVar;
                                        header.campaignID = campaignIDVar;
                                        header.source = sourceOrigin;
                                        header.transactionName = $scope.globalLabel.transactionName.lifeQuoteResult;
                                        header.deviceId = deviceIdOrigin;
                                        request.header = header;
                                        request.body = obj;

                                        $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                                        success(function(callback, status) {
                                            var lifeQuoteResponse = JSON.parse(callback);

                                            if (lifeQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
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
                                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.globalLabel.errorMessage.screenConfirmErrorMsg
                                                    $rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, screenCnfrmError, "Ok");
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
                                    $scope.proposerDetails.dateOfBirth = '';
                                    var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.globalLabel.errorMessage.screenConfirmErrorMsgDob
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

        $scope.submitProposalData = function(selectedPolicyDetails) {
            console.log("Proposal form submission");
            $scope.proposalInfo();
            $scope.lifeProposeFormDetails.QUOTE_ID = $scope.iposRequest.docId;
            $scope.lifeProposeFormDetails.businessLineId = $scope.globalLabel.businessLineType.life;
            $scope.lifeProposeFormDetails.carrierProposalStatus = false;
            if (!$rootScope.wordPressEnabled) {
                $scope.lifeProposeFormDetails.baseEnvStatus = baseEnvEnabled;
            }
            $scope.loading = true;
            console.log("Proposal submission started");

            RestAPI.invoke($scope.transactionName, $scope.lifeProposeFormDetails).then(function(proposeFormResponse) {
                if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success) {
                    $scope.responseToken = proposeFormResponse.data;
                    $scope.responseToken.paymentGateway = $scope.paymentURL;
                    $scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.life;
                    localStorageService.set("lifeReponseToken", $scope.responseToken);
                    console.log("Payment service started");


                    //added by gauri for mautic application
                    if (imauticAutomation == true) {
                        imatCriticalIllnessProposal(localStorageService, $scope, 'SubmitProposal');
                    }

                    getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.paymentService, $scope.responseToken, function(paymentDetails) {
                        console.log("Sending payment link to customer.");
                        var proposalDetailsEmail = {};
                        proposalDetailsEmail.paramMap = {};
                        proposalDetailsEmail.funcType = $scope.globalLabel.functionType.proposalDetailsTemplate;
                        proposalDetailsEmail.username = $scope.proposerDetails.emailId.trim();
                        proposalDetailsEmail.paramMap.customerName = $scope.proposerDetails.firstName.trim() + " " + $scope.proposerDetails.lastName.trim();
                        proposalDetailsEmail.paramMap.selectedPolicyType = $scope.globalLabel.insuranceType.life;
                        proposalDetailsEmail.paramMap.quoteId = $scope.iposRequest.docId;
                        proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                        proposalDetailsEmail.paramMap.docId = String($scope.responseToken.proposalId);
                        proposalDetailsEmail.paramMap.LOB = String($scope.globalLabel.businessLineType.life);
                        RestAPI.invoke($scope.globalLabel.transactionName.sendEmail, proposalDetailsEmail).then(function(emailResponse) {
                            if (emailResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                $scope.loading = false;
                                $scope.modalIPOS = true;


                                var createRecordDetails = {};

                                createRecordDetails.parent_id = $scope.iposRequest.parent_id;
                                createRecordDetails.parent_type = $scope.iposRequest.parent_type;
                                createRecordDetails.requestType = $scope.iposRequest.requestType;

                                console.log("$scope.globalLabel.transactionName.createRecord ", $scope.globalLabel.transactionName.createRecord);
                                RestAPI.invoke($scope.globalLabel.transactionName.createRecord, createRecordDetails).then(function(createRecordResponse) {
                                    console.log("createRecordResponse:::::", createRecordResponse);
                                });


                            } else {
                                $rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.emailSentFailed, "Ok");
                            }
                        });
                    });
                } else {
                    $scope.loading = false;
                    if ($scope.vehicleDetails.registrationNumber) {
                        var formatRegisCode = $scope.vehicleDetails.registrationNumber;
                        $scope.assuranceInfo.registrationNumber = formatRegisCode.substring(4);
                    }

                    $rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.serverError, "Ok");
                }
            });
        }

        $scope.hideModalIPOS = function() {
            $scope.modalIPOS = false;
        };
        /*----- iPOS+ Functions Ends -------*/
        $scope.prepopulateFields = function() {
            $scope.authenticate.enteredOTP = "";
            $scope.proposerDetails.tobacoAdicted = $scope.selectedProductInputParam.quoteParam.tobacoAdicted;
        }

        $scope.prepopulateFields();

        $scope.proceedForPayment = function() {
            $scope.proceedPaymentStatus = false;
            var authenticateUserParam = {};

            authenticateUserParam.mobileNumber = $scope.proposerDetails.mobileNumber;
            authenticateUserParam.OTP = Number($scope.authenticate.enteredOTP);
            getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.validateOTP, authenticateUserParam, function(createOTP) {
                if (createOTP.responseCode == $scope.globalLabel.responseCode.success) {
                    $scope.modalOTP = false;
                    $scope.invalidOTPError = "";
                    $scope.proposerDetails.userOTP = authenticateUserParam.OTP;
                    $scope.proposalInfo();
                    $scope.lifeProposeFormDetails.QUOTE_ID = localStorageService.get("LIFE_UNIQUE_QUOTE_ID");
                    $scope.lifeProposeFormDetails.businessLineId = $scope.globalLabel.businessLineType.life;
                    if (!$rootScope.wordPressEnabled) {
                        $scope.lifeProposeFormDetails.baseEnvStatus = baseEnvEnabled;
                        $scope.lifeProposeFormDetails.source = "website";
                    } else {
                        $scope.lifeProposeFormDetails.source = "wordpress";
                    }
                    localStorageService.set("lifeProposeFormDetails", $scope.lifeProposeFormDetails);
                    // Google Analytics Tracker added.
                    //analyticsTrackerSendData($scope.lifeProposeFormDetails); 

                    $scope.loading = true;

                    RestAPI.invoke($scope.transactionName, $scope.lifeProposeFormDetails).then(function(proposeFormResponse) {
                        $scope.modalOTP = false;
                        $scope.authenticate.enteredOTP = "";
                        $scope.modalOTPError = false;
                        $scope.proceedPaymentStatus = true;

                        if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.responseToken = proposeFormResponse.data;
                            $scope.responseToken.paymentGateway = $scope.paymentURL;
                            $scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.life;
                            localStorageService.set("lifeReponseToken", $scope.responseToken);


                            $scope.proposalId = proposeFormResponse.data.proposalId;
                            //added by gauri for mautic application
                            if (imauticAutomation == true) {
                                imatCriticalIllnessProposal(localStorageService, $scope, 'MakePayment');
                            }



                            getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.paymentService, $scope.responseToken, function(paymentDetails) {
                                if (paymentDetails.responseCode == $scope.globalLabel.responseCode.success) {
                                    $scope.paymentServiceResponse = paymentDetails.data;
                                    //olark
                                    var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                    // for(var i = 0; i < paymentURLParamListLength; i++){
                                    // 	if($scope.paymentServiceResponse.paramterList[i].name=='SourceTxnId' && $scope.paymentServiceResponse.paramterList[i].ngModel=='SourceTxnId'){
                                    // 		olarkCustomParam($scope.paymentServiceResponse.paramterList[i].value, $scope.globalLabel.businessLineType.life,'', 'proposal');
                                    // 	}
                                    // }

                                    if ($scope.paymentServiceResponse.method == "GET") {
                                        var paymentURLParam = "?";
                                        var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                                        for (var i = 0; i < paymentURLParamListLength; i++) {
                                            if (i < (paymentURLParamListLength - 1))
                                                paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value + "&";
                                            else
                                                paymentURLParam += $scope.paymentServiceResponse.paramterList[i].name + "=" + $scope.paymentServiceResponse.paramterList[i].value;
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
                            $scope.loading = false;
                            $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                        } else {
                            //added by gauri for imautic
                            if (imauticAutomation == true) {
                                imatEvent('ProposalFailed');
                            }
                            $scope.loading = false;
                            var buyScreenCnfrmError = proposeFormResponse.responseCode + " : " + $scope.globalLabel.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                            $rootScope.P365Alert($scope.globalLabel.applicationLabels.common.p365prompt, buyScreenCnfrmError, "Ok");
                        }
                    });
                } else if (createOTP.responseCode == $scope.globalLabel.responseCode.noRecordsFound) {
                    $scope.invalidOTPError = $scope.globalLabel.validationMessages.invalidOTP;
                } else if (createOTP.responseCode == $scope.globalLabel.responseCode.expiredOTP) {
                    $scope.invalidOTPError = $scope.globalLabel.validationMessages.expiredOTP;
                } else if (createOTP.responseCode == $scope.globalLabel.responseCode.blockedMobile) {
                    $scope.invalidOTPError = createOTP.message;
                } else {
                    $scope.invalidOTPError = $scope.globalLabel.validationMessages.authOTP;
                }
            });
        };
        setTimeout(function() {
            $('.buyform-control').on('focus blur', function(e) {
                $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
            }).trigger('blur');
        }, 4000)

        setTimeout(function() {
            $('.buyform-control').on('focus blur', function(e) {
                $(this).parents('.buyform-group').toggleClass('focusedInput', (e.type === 'focus' || this.value.length > 0));
            }).trigger('blur');
        }, 500)

        $scope.scheduleVehicleInspection = function() {
            $location.path('/FourWheelerscheduleInspection');
        }

        $rootScope.signout = function() {
            $rootScope.userLoginStatus = false;
            var userLoginInfo = {};
            userLoginInfo.username = undefined;
            userLoginInfo.status = $rootScope.userLoginStatus;
            localStorageService.set("userLoginInfo", userLoginInfo);
            $location.path("/quote");
        }

        // Hide the footer navigation links.
        $(".activateFooter").hide();
        $(".activateHeader").hide();
    }]);