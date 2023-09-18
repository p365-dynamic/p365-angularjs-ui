'use strict';
angular.module('buyTravel', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('buyTravelController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$http', '$window', '$sce', '$filter',
        function($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $http, $window, $sce, $filter) {

            $scope.travelProposalSectionHTML = wp_path + 'buy/travel/html/TravelProposalSection.html';
            var applicationLabel = localStorageService.get("applicationLabels");
            $scope.globalLabel = applicationLabel.globalLabels;

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
            var SPACE = " ";

            $scope.numRecords = 4;
            $scope.page = 1;
            $scope.travelProposal = {};
            $scope.insuredDetails = {};
            $scope.tripDetails = {};
            $scope.quoteParam = {};
            $scope.medicalInfo = {};
            $scope.medicalInfo.medicalQuestionarrie = [];
            $scope.medicalQuestionarrier = [];
            $scope.preExistingDiseases = 'N';
            $scope.masterDiseaseDetails = {};
            $scope.communicationAddress = {};
            $scope.numberOfTravellers = getList(1);
            $scope.isAddressSameAsCommun = true;
            $scope.screenOneStatus = true;
            $scope.proposalFormValid = true;
            $scope.accordion = 1;
            $scope.authenticate = {};
            var buyScreens = localStorageService.get("buyScreen");
            $scope.productValidation = buyScreens.validation;
            if ($scope.productValidation.areaMaxLength) {
                $scope.areaMaxLength = $scope.productValidation.areaMaxLength;
            } else {
                $scope.areaMaxLength = 250;
            }
            $scope.OTPFlag = $scope.productValidation.OTPFlag;
            $scope.requestFormat = buyScreens.requestFormat;
            $scope.transactionName = buyScreens.transaction.proposalService.name;
            $scope.paymentURL = buyScreens.paymentUrl;
            $scope.relationType = travelGeneric;
            $scope.storedDOBs = [];
            $scope.storedGenders = [];
            $scope.nomineeRelationType = nomineeRelationTypeGeneric;
            $scope.appointeeRelationType = nomineeRelationTypeGeneric;
            $scope.currencySymbols = currencySymbolList;

            $scope.premiumDetails = {};
            $scope.iposRequest = {};
            $scope.iposRequest.parent_id = String($rootScope.parent_id) != $scope.globalLabel.errorMessage.undefinedError ? $rootScope.parent_id : $location.search().recordId;
            $scope.iposRequest.parent_type = String($rootScope.parent_type) != $scope.globalLabel.errorMessage.undefinedError ? $rootScope.parent_type : $location.search().moduleName;
            $scope.iposRequest.requestType = $scope.globalLabel.request.createShareQuoteRecord;

            //added for future generali insured relation list 
            if ($scope.productValidation.futureGenRelationFlag) {
                $scope.relationType = futureGenTravelGeneric;
            }

            //function to go back to result Screen
            $scope.backToResultScreen = function() {
                $location.path("/travelResult");
            };

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

            var DOBOption = {};
            DOBOption.minimumYearLimit = "-50Y";
            DOBOption.maximumYearLimit = "-0Y";
            DOBOption.changeMonth = true;
            DOBOption.changeYear = true;
            DOBOption.dateFormat = DATE_FORMAT;
            $scope.regularDOBOptions = setP365DatePickerProperties(DOBOption);

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

            $scope.initTravellersDOB = function() {
                var len = $scope.selectedTravellers.length;
                for (var i = 0; i < len; i++) {
                    var travellerDOBOption = {};
                    travellerDOBOption.minimumYearLimit = "-" + $scope.productValidation.maxAge + "Y";
                    travellerDOBOption.maximumYearLimit = "-" + $scope.productValidation.maleMinAgeSingle + "y";
                    travellerDOBOption.changeMonth = true;
                    travellerDOBOption.changeYear = true;
                    travellerDOBOption.dateFormat = DATE_FORMAT;
                    $scope['travellerDOBOptions' + i] = setP365DatePickerProperties(travellerDOBOption);
                }
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



            $scope.genderType = travelGenderTypeGeneric;
            $scope.preDiseaseStatus = preDiseaseStatusGen;
            $scope.maritalStatusType = maritalStatusListGeneric;
            $scope.undertakingList = religareUndertakingList;
            $scope.yesNoStatus = yesNoStatusGeneric;
            $scope.treatmentGiven = [{ 'value': 'Out Patient' }, { 'value': 'treatmentGiven' }];
            $scope.monthList = healthmonthListGeneric;

            $scope.proposerDetails = {};
            $scope.proposerDetails.permanentAddress = {};
            $scope.permanentAddressDetails = {};
            $scope.insuredTravellerDetails = {};
            $scope.nominationDetails = {};
            $scope.declarationDetails = [];

            $scope.editProposerInfo = function() {
                $scope.accordion = '1';
                // reinitializing proposal Details on to edit
                $scope.proposerDetails = localStorageService.get("proposerDetails");
            };

            $scope.editInsuredInfo = function() {
                $scope.accordion = '3';
                // reinitializing Insured Details on to edit
                $scope.selectedTravellers = localStorageService.get("selectedTravellersForTravel");
            };
            $scope.editAddressInfo = function() {
                $scope.accordion = '2';
                // reinitializing proposal Details on to edit
                $scope.proposerDetails = localStorageService.get("proposerDetails");
            };
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
                    angular.copy($scope.communicationAddress, $scope.permanentAddressDetails);
                } else {
                    $scope.permanentAddressDetails.houseNo = angular.copy($scope.communicationAddress.houseNo);
                    $scope.permanentAddressDetails.pincode = angular.copy($scope.communicationAddress.pincode);
                    $scope.permanentAddressDetails.state = angular.copy($scope.communicationAddress.state);
                    $scope.permanentAddressDetails.stateCode = angular.copy($scope.communicationAddress.stateCode);
                    $scope.permanentAddressDetails.cityCode = angular.copy($scope.communicationAddress.cityCode);
                    $scope.permanentAddressDetails.city = angular.copy($scope.communicationAddress.city);
                    $scope.permanentAddressDetails.addressLine = angular.copy($scope.communicationAddress.addressLine);
                }
                $scope.proposerDetails.permanentAddress = $scope.permanentAddressDetails;
            };

            //function returns the list of areas matching to pincode
            $scope.getPinCodeAreaList = function(searchValue) {
                var docType = $scope.globalLabel.documentType.cityDetails;
                var carrierId = $scope.selectedProduct.carrierId;
                return $http.get(getSearchServiceLink + docType + "&q=" + searchValue + "&id=" + carrierId).then(function(response) {
                    return JSON.parse(response.data).data;
                });
            };

            // function sets up all communication address properties
            $scope.onSelectPinOrAreaComm = function(item) {
                $scope.communicationAddress.stateCode = item.stateCode;
                $scope.communicationAddress.state = item.state;
                $scope.communicationAddress.cityCode = item.cityCode;
                $scope.communicationAddress.city = item.city;
                $scope.communicationAddress.pincode = item.pincode;
            };

            //function sets up all permanent address properties
            $scope.onSelectPinOrAreaPerm = function(item) {
                $scope.permanentAddressDetails.stateCode = item.stateCode;
                $scope.permanentAddressDetails.state = item.state;
                $scope.permanentAddressDetails.cityCode = item.cityCode;
                $scope.permanentAddressDetails.city = item.city;
                $scope.permanentAddressDetails.pincode = item.pincode;
            };

            //fxn to calculate default comm area details
            $scope.calcDefaultAreaDetails = function(areaCode) {
                if (areaCode != null && String(areaCode) != $scope.globalLabel.errorMessage.undefinedError && String(areaCode).length > 0) {
                    var docType = $scope.globalLabel.documentType.cityDetails;
                    var carrierId = $scope.selectedProduct.carrierId;
                    $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function(response) {
                        var areaDetails = JSON.parse(response.data);
                        if (areaDetails.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.onSelectPinOrAreaComm(areaDetails.data[0]);
                        }
                    });
                }
            };

            //fxn to calculate default perm area details
            $scope.calcDefaultPermAreaDetails = function(areaCode) {
                if (areaCode != null && String(areaCode) != $scope.globalLabel.errorMessage.undefinedError && String(areaCode).length > 0) {
                    var docType = $scope.globalLabel.documentType.cityDetails;
                    var carrierId = $scope.selectedProduct.carrierId;
                    $http.get(getSearchServiceLink + docType + "&q=" + areaCode + "&id=" + carrierId).then(function(response) {
                        var areaDetails = JSON.parse(response.data);
                        if (areaDetails.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.onSelectPinOrAreaPerm(areaDetails.data[0]);
                        }
                    });
                }
            }


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
                    $scope.selectedTravellers[index].passportNo = EMPTY;
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
                    $scope.selectedTravellers[index].passportNo = EMPTY;
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
                                var tempDOBinDD_MM_YY = String(tempDateArray[0] + '/' + tempDateArray[1] + '/' + tempDateArray[2]);
                                console.log('tempDOBinDD_MM_YY in confirm status is :',tempDOBinDD_MM_YY);
                                $scope.storedDOBs[index] =tempDOBinDD_MM_YY;
                                console.log('$scope.storedDOBs[index] in confirm status is :',$scope.storedDOBs[index]);
                                $scope.ageList = [];
                                $scope.loading = true;

                                for (var i = 0; i < $scope.quoteRecalcParam.quoteParam.travellers.length; i++) {
                                    if ($scope.quoteRecalcParam.quoteParam.travellers[i].relation == SELF) {
                                        $scope.proposerDetails.dateOfBirth = $scope.quoteRecalcParam.quoteParam.travellers[i].dob;
                                        /*$scope.quoteRecalcParam.quoteParam.travellers[i].dob = $scope.quoteRecalcParam.quoteParam.travellers[i].dob;*/
                                        $scope.proposerDetails.age = getAgeFromDOB($scope.quoteRecalcParam.quoteParam.travellers[i].dob);
                                        $scope.quoteRecalcParam.quoteParam.travellers[i].age = getAgeFromDOB($scope.quoteRecalcParam.quoteParam.travellers[i].dob);
                                    } else {
                                        /*$scope.quoteRecalcParam.quoteParam.travellers[i].dob = $scope.quoteRecalcParam.quoteParam.travellers[i].dob;*/
                                        $scope.quoteRecalcParam.quoteParam.travellers[i].age = getAgeFromDOB($scope.quoteRecalcParam.quoteParam.travellers[i].dob);
                                    }
                                    $scope.ageList.push($scope.quoteRecalcParam.quoteParam.travellers[i].age);
                                }
                                $scope.quoteRecalcParam.quoteParam.quoteMinAge = getMinAge($scope.ageList);
                                $scope.quoteRecalcParam.quoteParam.quoteMaxAge = getMaxAge($scope.ageList);
                                localStorageService.set("selectedTravellersForTravel", $scope.quoteRecalcParam.quoteParam.travellers);
                                //$scope.quoteRecalc = prepareQuoteRequest($scope.quoteRecalcParam);

                                //call reCalcQuotes fxn here
                                $scope.reCalcQuotes($scope.quoteRecalcParam);

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
                            /*if($scope.proposerDetails.dateOfBirth != $scope.quoteRecalcParam.quoteParam.travellers[index].dob){
                            	$scope.changeDateOfBirth(index);
                            }*/
                            $scope.proposerDetails.dateOfBirth = $scope.quoteRecalcParam.quoteParam.travellers[index].dob;
                        }
                    }
                }
            };



            $scope.init = function() {
                $scope.selectedProduct = localStorageService.get("selectedProduct");
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
                                $scope.diseaseShow = true;
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

                        $scope.numberOfPages = Math.floor($scope.diseaseList.length / $scope.numRecords);
                        $scope.diseaseListDisable = angular.copy($scope.diseaseList);
                        for (var i = 0; i < $scope.diseaseListDisable.length; i++) {
                            $scope.diseaseListDisable[i].subParentId = $scope.diseaseListDisable[i].parentId
                        }
                        if ($scope.occupationCheck) {
                            var occupationDocId = $scope.globalLabel.documentType.travelOccupation + "-" + $scope.selectedProduct.carrierId + "-" + $scope.selectedProduct.productId;
                            getDocUsingId(RestAPI, occupationDocId, function(occupationList) {
                                $scope.occupationList = occupationList.Occupation;
                                localStorageService.set("travelBuyOccupationList", occupationList.Occupation);
                                $scope.prePopulateProposerDetails();
                            });
                        } else {
                            $scope.prePopulateProposerDetails();
                        }
                    });


                });
            };

            $scope.prePopulateTravellerDetails = function() {
                $scope.quote = localStorageService.get("travelQuoteInputParamaters");
                $scope.quoteRecalcParam = angular.copy(localStorageService.get("travelQuoteInputParamaters"));
                $scope.quoteParam = $scope.quote.quoteParam;
                $scope.medicalInfo.medicalQuestionarrie = $scope.medicalQuestionarrier;
                $scope.travelDetails = localStorageService.get("travelDetails");
                $scope.QuoteResult = localStorageService.get("travelQuoteResult");
                //declaring deseaseDetails of travellers here
                for (var i = 0; i < $scope.quoteParam.travellers.length; i++) {
                    $scope.quoteParam.travellers[i].diseaseDetails = [];

                }
                $scope.quote.quoteParam = $scope.quoteParam;
                $scope.selectedTravellers = $scope.quoteParam.travellers;
                $scope.initTravellersDOB();

                /*for pre populate 1st traveller's dob and gender from quoteRespons
                 * .
                 * */
                for (var i = 0; i < $scope.QuoteResult.length; i++) {
                    $scope.travelQuoteResponse = $scope.QuoteResult[i];
                    if ($scope.travelQuoteResponse) {
                        if ($scope.selectedProduct.carrierId == $scope.travelQuoteResponse.carrierId) {
                            if ($scope.travelQuoteResponse.travellers) {
                                var len = $scope.travelQuoteResponse.travellers.length;
                                $scope.storedDOBs = [];
                                for (var j = 0; j < len; j++) {
                                    if ($scope.travelQuoteResponse.travellers[j].relation == SELF) {
                                        $scope.proposerDetails.dateOfBirth = $scope.travelQuoteResponse.travellers[j].memberDOB;
                                        $scope.proposerDetails.gender = $scope.travelQuoteResponse.travellers[j].gender;
                                        if ($scope.travelQuoteResponse.travellers.length > 1)
                                            $scope.proposerDetails.maritalStatus = MARRIED;
                                        else
                                            $scope.proposerDetails.maritalStatus = SINGLE;

                                    } else if ((getAgeFromDOB($scope.travelQuoteResponse.travellers[0].memberDOB) < $scope.productValidation.maleMinAgeMarried)) {
                                        $scope.proposerDetails.dateOfBirth = calcDOBFromAge($scope.productValidation.maleMinAgeSingle);
                                        $scope.proposerDetails.gender = MALE;
                                        $scope.proposerDetails.maritalStatus = SINGLE;
                                    }

                                    /*if((getAgeFromDOB($scope.travelQuoteResponse.travellers[0].memberDOB) < $scope.productValidation.maleMinAgeMarried)){
                                    	$scope.proposerDetails.dateOfBirth = calcDOBFromAge($scope.productValidation.maleMinAgeSingle);
                                    	$scope.proposerDetails.gender  = MALE;
                                    }else{
                                    	$scope.proposerDetails.dateOfBirth = $scope.travelQuoteResponse.travellers[0].memberDOB;
                                    	$scope.proposerDetails.gender  = $scope.travelQuoteResponse.travellers[0].gender;
                                    }*/
                                    if ((getAgeFromDOB($scope.travelQuoteResponse.travellers[j].memberDOB) < $scope.productValidation.maleMinAgeSingle)) {
                                        $scope.selectedTravellers[j].gender = $scope.travelQuoteResponse.travellers[j].gender;
                                        $scope.selectedTravellers[j].dob = $scope.travelQuoteResponse.travellers[j].memberDOB;
                                        if ($scope.selectedTravellers[j].gender == MALE) {
                                            $scope.selectedTravellers[j].relation = SON;
                                        } else {
                                            $scope.selectedTravellers[j].relation = DAUGHTER;
                                        }
                                        $scope.changeRelation(j);
                                    } else {
                                        $scope.selectedTravellers[j].dob = $scope.travelQuoteResponse.travellers[j].memberDOB;
                                        $scope.selectedTravellers[j].gender = $scope.travelQuoteResponse.travellers[j].gender;
                                    }
                                    $scope.storedDOBs.push($scope.travelQuoteResponse.travellers[j].memberDOB);
                                    $scope.storedGenders.push($scope.travelQuoteResponse.travellers[j].gender);

                                }
                            }
                        }
                    }
                }
                localStorageService.set("selectedTravellersForTravel", $scope.selectedTravellers);
                for (var i = 0; i < $scope.selectedTravellers.length; i++) {
                    $scope.nomieeDetails = {};
                    $scope.selectedTravellers[i].nomineeDetails = $scope.nomieeDetails;
                    $scope.selectedTravellers[i].carrierMedicalQuestion = [];
                    for (var diseaseCount = 0; diseaseCount < $scope.selectedTravellers[i].diseaseDetails.length; diseaseCount++) {
                        var key = $scope.selectedTravellers[i].relationshipCode + '-' + $scope.selectedTravellers[i].diseaseDetails[diseaseCount].masterDiseaseCode;
                        $scope.masterDiseaseDetails[key] = $scope.selectedTravellers[i].diseaseDetails[diseaseCount];
                    }
                }

                $scope.quoteRecalcParam.quoteParam.travellers = $scope.selectedTravellers;
                $scope.numberOfTravellers = getList($scope.selectedTravellers.length);
                /*if($scope.selectedTravellers[0].relation == undefined || String($scope.selectedTravellers[0].relation) == "undefined"){
                	$scope.selectedTravellers[0].relation = SELF;
                	$scope.changeRelation(0);
                }*/
                if ($scope.quoteParam.pedStatus == 'Y') {
                    $scope.preDiseaseApplicable = true;
                    $scope.preExistingDiseases = 'Y';
                    $scope.clicktoShowDisease();
                } else {
                    $scope.preExistingDiseases = 'N';
                    $scope.preDiseaseApplicable = false;
                }
                //			$scope.getRelationshipList();
            };

            $scope.prePopulateProposerDetails = function() {
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
                if (localStorageService.get("proposerDetails")) {
                    $scope.proposerDetails = localStorageService.get("proposerDetails");
                } else if (localStorageService.get("quoteUserInfo")) {
                    $scope.proposerDetails = angular.copy(localStorageService.get("quoteUserInfo"));
                } else {
                    $scope.proposerDetails = {};
                }

                $scope.prePopulateTravellerDetails();

                if (localStorageService.get("travelBuyOccupationList")) {
                    $scope.occupationList = localStorageService.get("travelBuyOccupationList");
                    $scope.proposerDetails.occupation = $scope.occupationList[0].occupation;
                }
                if (buyScreens.visitPurposes) {
                    $scope.purposeListOfVisit = buyScreens.visitPurposes;
                    $scope.proposerDetails.purposeOfVisit = $scope.purposeListOfVisit[0].purposeOfVisit;
                }
            }



            $scope.proposalInfo = function() {
                var proposalReq = travelProposalRequestDef;
                //premiumDetails
                proposalReq.premiumDetails = localStorageService.get("selectedProduct");
                //			proposalReq.premiumDetails.sumInsuredCurrency = proposalReq.premiumDetails.sumInsuredCurrencySymbol;
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
                var travellers = angular.copy(localStorageService.get("selectedTravellersForTravel"));
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
                    proposalReq.medicalQuestionarrie = angular.copy($scope.medicalInfo.medicalQuestionarrie);
                    $scope.preExistingDiseases = 'N';
                    var diseaseDetails = [];

                    for (var l = 0; l < travellers[j].carrierMedicalQuestion.length; l++) {
                        if (travellers[j].carrierMedicalQuestion[l] == null || travellers[j].carrierMedicalQuestion[l] == undefined ||
                            String(travellers[j].carrierMedicalQuestion[l]) == $scope.globalLabel.errorMessage.undefinedError) {
                            travellers[j].carrierMedicalQuestion.splice(l, 1);
                            l = l - 1;
                        }
                    }

                    for (var k = 0; k < $scope.medicalInfo.medicalQuestionarrie.length; k++) {
                        if ($scope.medicalInfo.medicalQuestionarrie[k].applicable == 'false' && $scope.medicalInfo.medicalQuestionarrie[k].questionCode == "PREXDISEA") {
                            $scope.preExistingDiseases = 'N';
                            diseaseDetails = [];
                            break;
                        } else if ($scope.medicalInfo.medicalQuestionarrie[k].applicable == 'true' && $scope.medicalInfo.medicalQuestionarrie[k].questionCode == "PREXDISEA") {
                            $scope.preExistingDiseases = 'Y';
                            diseaseDetails = [];
                            for (var l = 0; l < travellers[j].diseaseDetails.length; l++) {
                                if (travellers[j].diseaseDetails[l] != null) {
                                    diseaseDetails.push(travellers[j].diseaseDetails[l]);
                                }
                            }
                            break;
                        }

                    }
                    travellerDetail.preExistingDiseases = $scope.preExistingDiseases;
                    travellerDetail.diseaseDetails = diseaseDetails;
                    travellerDetail.carrierMedicalQuestion = travellers[j].carrierMedicalQuestion;
                    proposalReq.travellerDetails[j] = travellerDetail;
                }
                proposalReq.declarationDetails = $scope.declarationDetails;
                $scope.travelProposeFormDetails = proposalReq;
                $scope.travelProposeFormDetails.productId = proposalReq.premiumDetails.productId;
                return proposalReq;

            };

            $scope.showAuthenticateForm = function() {
                $scope.disableOTP = false;
                var validateAuthParam = {};
                validateAuthParam.paramMap = {};
                validateAuthParam.mobileNumber = $scope.proposerDetails.mobileNumber;
                validateAuthParam.funcType = $scope.globalLabel.functionType.optAuth;
                validateAuthParam.paramMap.OTP = $scope.globalLabel.functionType.otpGenerate;
                /*if(sessionIDvar){		
                	validateAuthParam.sessionId=sessionIDvar;		
                }*/
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
            $scope.hideModalAP = function() {
                $scope.modalAP = false;
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
                        //console.log('$scope.proposalId ', $scope.proposalId);
                        var proposalId = $scope.proposalId;
                        var proposal_url = "" + sharePaymentLink + "" + proposalId + "&lob=5";

                        $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                        localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);



                        $scope.responseToken = proposeFormResponse.data;
                        $scope.responseToken.paymentGateway = $scope.paymentURL;
                        $scope.responseToken.businessLineId = $scope.globalLabel.businessLineType.travel;
                        localStorageService.set("travelReponseToken", $scope.responseToken);
                        getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.paymentService, $scope.responseToken, function(paymentDetails) {
                            if (paymentDetails.responseCode == $scope.globalLabel.responseCode.success) {
                                $scope.paymentServiceResponse = paymentDetails.data;

                                //added by gauri for mautic application
                                if (imauticAutomation == true) {
                                    imatTravelProposal(localStorageService, $scope, 'MakePayment');
                                }

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
                                //added by gauri for imautic
                                if (imauticAutomation == true) {
                                    imatEvent('ProposalFailed');
                                }
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



            /*----- iPOS+ Functions-------*/



            /*$scope.getCarrierList = function(){
            	getListFromDB(RestAPI, "", $scope.globalLabel.documentType.travelCarrier, $scope.globalLabel.request.findAppConfig, function(travelCarrierList){
            		if(travelCarrierList.responseCode == $scope.globalLabel.responseCode.success){
            			$scope.carrierList = travelCarrierList.data;
            			var docId = $scope.globalLabel.documentType.buyScreen + "-" + $scope.selectedProductInputParam.quoteParam.quoteType;
            			getDocUsingId(RestAPI, docId, function(buyScreenTooltip){
            				$scope.buyTooltip = buyScreenTooltip.toolTips;
            				$scope.getRelationshipList();
            				$rootScope.loading = false;
            			});
            		}else{
            			$rootScope.P365Alert("Policies365", $scope.globalLabel.errorMessage.serverError, "Ok");
            		}
            	});
            }*/
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
                            imatTravelProposal(localStorageService, $scope, 'SubmitProposal');
                        } else {


                            $rootScope.encryptedProposalID = $scope.encryptedProposalId;
                            var body = {};
                            body.longURL = sharePaymentLink + String($scope.responseToken.proposalId) + "&lob=" + String($scope.globalLabel.businessLineType.travel);
                            $http({ method: 'POST', url: getShortURLLink, data: body }).
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
                                        //     //	console.log('smsResponse',smsResponse);
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

                                    console.log(shortURLResponse.message);
                                }
                            });
                        }


                    } else if (proposeFormResponse.responseCode == $scope.globalLabel.responseCode.error) {
                        $scope.disablePaymentButton = false;
                        $scope.loading = false;
                        $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                    } else {
                        $scope.loading = false;
                        var serverError = $scope.globalLabel.errorMessage.serverError;
                        $rootScope.P365Alert("Policies365", serverError, "Ok");
                    }
                });
            }
            $scope.hideModalIPOS = function() {
                $scope.modalIPOS = false;
            };

            /*----- ./iPOS+ Functions-------*/
            /*----- iPOS+ Code Starts -------*/

            $scope.iposRequest = {};
            $scope.iposRequest.docId = $location.search().quoteId;
            $scope.iposRequest.carrierId = $location.search().carrierId;
            $scope.iposRequest.productId = $location.search().productId;
            if ($scope.iposRequest.docId) {
                $http.get('ApplicationLabels.json').then(function(applicationCommonLabels) {
                    $scope.globalLabel = applicationCommonLabels.data.globalLabels;
                    localStorageService.set("applicationLabels", applicationCommonLabels.data);
                    $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                    $scope.tripTypeList = tripTypeListGeneric;
                    RestAPI.invoke("quoteDataReader", $scope.iposRequest).then(function(quoteData) {
                        if (quoteData.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.quoteInfo = quoteData.data;
                            $scope.selectedProductInputParam = $scope.quoteInfo.quoteRequest;
                            /*if(localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID") != $scope.iposRequest.docId){
                            	localStorageService.set("quoteResponse",$scope.quoteInfo.quoteResponse);
                            }
                            if(localStorageService.get("quoteResponse")){
                            	$scope.quoteCalcResponse = localStorageService.get("quoteResponse");
                            }else{*/
                            $scope.quoteCalcResponse = $scope.quoteInfo.quoteResponse;
                            /*}*/
                            for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                                $scope.quoteCalcResponse[i].id = (i + 1);
                                if ($scope.quoteCalcResponse[i].carrierId == $scope.iposRequest.carrierId && $scope.quoteCalcResponse[i].productId == $scope.iposRequest.productId) {
                                    $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                                    $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                                    break;
                                }
                            }

                            $scope.changeInsuranceCompany = function() {
                                $location.path('/ipos').search({ quoteId: localStorageService.get("TRAVEL_UNIQUE_QUOTE_ID"), carrierId: $scope.premiumDetails.selectedProductDetails.carrierId, productId: $scope.premiumDetails.selectedProductDetails.productId, lob: localStorageService.get("selectedBusinessLineId") });
                                //$scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                            }
                            var buyScreenParam = {};
                            buyScreenParam.documentType = "proposalScreenConfig";
                            buyScreenParam.carrierId = Number($scope.iposRequest.carrierId);
                            buyScreenParam.businessLineId = Number($scope.globalLabel.businessLineType.travel);
                            buyScreenParam.productId = Number($scope.iposRequest.productId);
                            localStorageService.set("selectedProduct", $scope.selectedProduct);
                            getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.productDataReader, buyScreenParam, function(buyScreen) {
                                if (buyScreen.responseCode == $scope.globalLabel.responseCode.success) {
                                    var buyScreens = buyScreen.data;
                                    $scope.proposerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                                    $scope.travellersDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
                                    $scope.medicalDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                                    $scope.occupationDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);

                                    $scope.productValidation = buyScreens.validation;
                                    $scope.requestFormat = buyScreens.requestFormat;
                                    $scope.transactionName = buyScreens.transaction.proposalService.name;
                                    if (buyScreens.visitPurposes) {
                                        $scope.purposeListOfVisit = buyScreens.visitPurposes;
                                        $scope.proposerDetails.purposeOfVisit = $scope.purposeListOfVisit[0].purposeOfVisit;
                                    }
                                    $scope.occupationCheck = $scope.productValidation.occupationCheck;
                                    $scope.init();
                                } else {
                                    $scope.loading = false;
                                    $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.iposFormErrorMsg, "Ok");
                                }
                            });
                        } else {

                            $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.iposFormErrorMsg, "Ok");
                        }
                    });
                }); /*----- iPOS+ Code Ends -------*/
            } else {
                var applicationLabels = localStorageService.get("applicationLabels");
                $scope.globalLabel = applicationLabels.globalLabels;
                $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
                $rootScope.loaderContent = { businessLine: '5', header: 'Travel Insurance', desc: $sce.trustAsHtml($scope.globalLabel.applicationLabels.travel.proverbBuyProduct) };
                $rootScope.title = $scope.globalLabel.policies365Title.travelBuyQuote;
                $scope.selectedProductInputParam = localStorageService.get("travelQuoteInputParamaters");

                //			$scope.carrierList = localStorageService.get("carrierList");
                $scope.buyTooltip = localStorageService.get("buyScreenTooltip");
                var buyScreens = localStorageService.get("buyScreen");
                $scope.productValidation = buyScreens.validation;
                $scope.OTPFlag = $scope.productValidation.OTPFlag;
                $scope.requestFormat = buyScreens.requestFormat;
                $scope.transactionName = buyScreens.transaction.proposalService.name;
                if (buyScreens.visitPurposes)
                    $scope.purposeListOfVisit = buyScreens.visitPurposes;

                $scope.occupationCheck = $scope.productValidation.occupationCheck;

                $scope.proposerDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
                $scope.travellersDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
                $scope.medicalDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
                $scope.occupationDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);
                $scope.redirectUrl = buyScreens.redirectSuccessUrl;
                $scope.init();
            }

            //function to setCommunication Address using google API

            $scope.$watch('communicationAddress.addressLine', function(newValue) {
                if ($scope.isAddressSameAsCommun) {
                    $scope.changePermentAddress();
                }
            });

            $scope.$watch('communicationAddress.houseNo', function(newValue) {
                if ($scope.isAddressSameAsCommun) {
                    $scope.changePermentAddress();

                }
            });

            $scope.$on("setCommAddressByAPI", function() {
                setTimeout(function() {
                    var googleAddressObject = angular.copy($rootScope.chosenCommPlaceDetails);
                    getAddressFields(googleAddressObject, function(fomattedAddress, formattedCity, formattedState, formattedPincode) {
                        $scope.communicationAddress.addressLine = fomattedAddress;
                        if (String(formattedPincode) != $scope.globalLabel.errorMessage.undefinedError && formattedPincode != EMPTY) {
                            $scope.calcDefaultAreaDetails(formattedPincode);
                        } else {
                            $scope.communicationAddress.pincode = EMPTY;
                            $scope.communicationAddress.state = EMPTY;
                            $scope.communicationAddress.city = EMPTY;
                            $scope.communicationAddress.stateCode = EMPTY;
                            $scope.communicationAddress.cityCode = EMPTY;
                        }

                        $scope.$apply();
                    });
                }, 10);
            });

            $scope.$on("setRegAddressByAPI", function() {
                setTimeout(function() {
                    var googleAddressObject = angular.copy($rootScope.chosenRegPlaceDetails);
                    getAddressFields(googleAddressObject, function(fomattedAddress, formattedCity, formattedState, formattedPincode) {
                        $scope.vehicleDetails.address = fomattedAddress;
                        if (String(formattedPincode) != $scope.globalLabel.errorMessage.undefinedError && formattedPincode != EMPTY) {
                            $scope.calcDefaultPermAreaDetails(formattedPincode);
                        } else {
                            $scope.permanentAddressDetails.pincode = EMPTY;
                            $scope.permanentAddressDetails.state = EMPTY;
                            $scope.permanentAddressDetails.city = EMPTY;
                        }

                        $scope.$apply();
                    });
                }, 10);
            });

            //medical related functions
            /*for temporary purpose using hard coded disease list starting from here.
             * you can remove this single line after you get actual diseaseList.
             * you can find this hard coded list in TravelProposalRequest.js file
             * */


            $scope.isRegreatPolicyMsg = false;
            var quesArr = [];
            $scope.inputTypeCheck = function(sel, quesId, mquestion) {
                if (sel == 'true') {
                    $scope.selectedQuestions = quesId;
                    quesArr.push(quesId);

                    //added for Bharti Axa based on regreatPolicy flag user allowed to proceed further.
                    //for some medical question if we select 'no' and for some medical question if we select 'yes' ,restrict user for proceding further
                    if (mquestion.isRegretPolicy == 'N' && $scope.productValidation.proceedWithN) {
                        $scope.regretErrorMessage = $scope.globalLabel.errorMessage.regretPolicyMsgBH;
                        $scope.isRegreatPolicyMsg = true;
                    }
                    if (mquestion.isRegretPolicy == 'N' && !$scope.productValidation.proceedWithN) {
                        $scope.isRegreatPolicyMsg = false;
                    }
                } else {
                    if (quesArr.length > 0)
                        quesArr.splice(-1, quesId);

                    for (var i = 0; i < $scope.quoteParam.travellers.length; i++) {
                        for (var j = 0; j < $scope.quoteParam.travellers[i].carrierMedicalQuestion.length; j++) {
                            if ($scope.quoteParam.travellers[i].carrierMedicalQuestion[j]) {
                                if (quesId == $scope.quoteParam.travellers[i].carrierMedicalQuestion[j].questionCode) {
                                    $scope.quoteParam.travellers[i].carrierMedicalQuestion[j].applicable = false;
                                }
                            }
                        }
                    }
                    if (mquestion.isRegretPolicy == 'N' && !$scope.productValidation.proceedWithN) {
                        var screenCnfrmError = mquestion.message;
                        $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                        $scope.isRegreatPolicyMsg = true;
                    } else {
                        $scope.regretErrorMessage = $scope.globalLabel.errorMessage.regretPolicyMsgBH;
                        $scope.isRegreatPolicyMsg = false;
                    }
                }
            };
            $scope.isDiseaseApplicable = function(relationshipCode, masterDiseasesCode) {
                var key = relationshipCode + "-" + masterDiseasesCode;
                if ($scope.masterDiseaseDetails[key] != null) {
                    return true;
                }
                return false;
            };

            $scope.isDisableApplicable = function(parentId) {
                for (var i = 0; i < $scope.diseaseListDisable.length; i++) {
                    if (parentId == $scope.diseaseListDisable[i].subParentId) {
                        return false;
                    }
                    return true;
                }
            }

            $scope.changeGender = function() {
                //add code to recalculate quotes on change of gender
            };



            $scope.calculateProposerAge = function(proposerDob) {
                if (String(proposerDob) !== $scope.globalLabel.errorMessage.undefinedError) {
                    $scope.proposerAge = getAgeFromDOB(proposerDob);
                    $scope.validateData();
                }
            };



            $scope.calculateNomineeAge = function(traveller_id, nomineeDob) {
                if (String(nomineeDob) !== $scope.globalLabel.errorMessage.undefinedError) {
                    for (var i = 0; i < $scope.selectedTravellers.length; i++) {

                        if ($scope.selectedTravellers[i].traveller_id == traveller_id) {
                            $scope.selectedTravellers[i].nomineeAge = getAgeFromDOB(nomineeDob);
                        }
                    }
                    $scope.nomineeAge = getAgeFromDOB(nomineeDob);
                }
            };
            $scope.calculateApointeeAge = function(apointeeDob) {
                if (String(apointeeDob) !== $scope.globalLabel.errorMessage.undefinedError) {
                    $scope.apointeeAge = getAgeFromDOB(String(apointeeDob));
                }
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

                            $http({ method: 'POST', url: getQuoteCalcLink, data: request }).
                            success(function(callback, status) {
                                var travelQuoteResponse = JSON.parse(callback);
                                $scope.responseRecalculateCodeList.push(travelQuoteResponse.responseCode);
                                if (travelQuoteResponse.responseCode == $scope.globalLabel.responseCode.success) {
                                    if (travelQuoteResponse.data != null && travelQuoteResponse.data.quotes[0].carrierId == $scope.selectedProduct.carrierId &&
                                        travelQuoteResponse.data.quotes[0].planId == $scope.selectedProduct.planId) {
                                        $scope.loading = false;
                                        $scope.selectedProduct.grossPremium = travelQuoteResponse.data.quotes[0].grossPremium;
                                        if (travelQuoteResponse.data.quotes[0].netPremium) {
                                            $scope.selectedProduct.netPremium = travelQuoteResponse.data.quotes[0].netPremium;
                                        }
                                        if (travelQuoteResponse.data.quotes[0].serviceTax) {
                                            $scope.selectedProduct.serviceTax = travelQuoteResponse.data.quotes[0].serviceTax;
                                        }
                                        $scope.premiumDetails = travelQuoteResponse.data.quotes[0];
                                        $scope.selectedProduct = travelQuoteResponse.data.quotes[0];
                                        /*$scope.checkForPanCardValidation();*/
                                        if (travelQuoteResponse.data.quotes[0].carrierQuoteId != undefined || travelQuoteResponse.data.quotes[0].carrierQuoteId != '' || travelQuoteResponse.data.quotes[0].carrierQuoteId != null) {
                                            $scope.selectedProduct.carrierQuoteId = travelQuoteResponse.data.quotes[0].carrierQuoteId;
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

            //function for validation of age and marrital status ,gender for hdfc
            $scope.validateData = function() {
                console.log("called validateData");
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
                /*if($scope.productValidation.proposerAgeCheck){
                	console.log("calling validateData");
                	$scope.validateData();
                }else if($scope.productValidation.individualFloaterPlan){ 
                	if($scope.proposalApp.proposerInfo.personalInfo.martialStatus==MARRIED)
                		$scope.modalIndividualFloaterPlan=true;
                	}*/
            }

        }
    ]);