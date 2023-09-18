'use strict';
angular.module('buyHealth', ['CoreComponentApp', 'LocalStorageModule', 'checklist-model', 'ngMessages'])
    .controller('buyHealthController', ['$scope', '$rootScope', '$timeout', 'RestAPI', 'localStorageService', '$location', '$http', '$window', '$sce', '$filter', function ($scope, $rootScope, $timeout, RestAPI, localStorageService, $location, $http, $window, $sce, $filter) {


        $scope.healthProposalSectionHTML = wp_path + 'buy/health/html/healthProposalSection.html';
        //$scope.globalLabel = localStorageService.get("applicationLabels").globalLabels;
        $scope.p365Labels = healthProposalLabels;
        $scope.premiumDetails = {};
        $scope.saveProposal = false;
        $scope.saveNomineeDetails = false;
        $scope.savePersonalDetails = false;
        $scope.saveInsuredDetails = false;
        $scope.saveMedicalDetails = false;
        $scope.redirectForPayment = false;
        $scope.proposalId = null;

        //Method to init variables
        $scope.prePopulateInsuredDetails = function () {
            // Values pre-population of Insured Info with input paramters.
            $scope.proposalStatusForm = false;
            $scope.proposalApp.proposerInfo.permanentAddress = {};
            $scope.permanentAddressDetails = {};
            $scope.proposalApp.insuredMembers = [];
            $scope.masterDieaseDetails = {};
            for (var i = 0; i < $scope.memberList.length; i++) {
                $scope.insuredMember = angular.copy($scope.insuredMemberDef);
                $scope.insuredMember.dateOfBirth = $scope.memberList[i].dob;
                if ($scope.memberList[i].gender == 'Male') {
                    $scope.insuredMember.gender = 'M';
                    $scope.insuredMember.salutation = "Mr";
                } else {
                    $scope.insuredMember.gender = 'F';
                    $scope.insuredMember.salutation = 'Ms';
                }

                //$scope.insuredMember.dieaseDetails=$scope.memberList[i].dieaseDetails;

                $scope.insuredMember.carrierMedicalQuestion = [];

                if ($scope.productValidation.isIndividualNominee) {
                    $scope.insuredMember.nomineeDetails = {};
                    $scope.insuredMember.nomineeDetails.relationship = $scope.memberList[i].relation;
                } else {
                    $scope.productValidation.isIndividualNominee = false;
                }

                if ($scope.insuredMember.dieaseDetails.length >= 1) {
                    $scope.insuredMember.preExistingDieases = "Y";
                } else {
                    $scope.insuredMember.preExistingDieases = "N";
                }
                $scope.insuredMember.relationship = $scope.memberList[i].relation;
                $scope.insuredMember.relationshipCode = $scope.memberList[i].relationship;

                //$scope.insuredMember.salutation = $scope.memberList[i].gender == "M" ? "Mr" : "Ms";
                if ($scope.insuredMember.relationship == "Self") {
                    $scope.insuredMember.firstName = String($scope.proposalApp.proposerInfo.personalInfo.firstName) != "undefined" ? $scope.proposalApp.proposerInfo.personalInfo.firstName : "";
                    $scope.selfAsInsured = $scope.insuredMember;
                } else if ($scope.insuredMember.relationship == "Spouse") {
                    $scope.insuredMember.firstName = "";
                    $scope.spouseAsInsured = $scope.insuredMember;
                } else {
                    $scope.insuredMember.firstName = "";
                }
                $scope.insuredMember.lastName = $scope.proposalApp.proposerInfo.personalInfo.lastName;
                //setting height unit and weight unit
                $scope.insuredMember.heightUnit = "cm";
                $scope.insuredMember.weightUnit = "kg";
                $scope.proposalApp.insuredMembers.push($scope.insuredMember);

                //Create disease details json
                if ($scope.memberList[i].dieaseDetails) {
                    for (var diseaseCount = 0; diseaseCount < $scope.memberList[i].dieaseDetails.length; diseaseCount++) {
                        var key = $scope.insuredMember.relationshipCode + '-' + $scope.memberList[i].dieaseDetails[diseaseCount].masterDieaseCode;
                        $scope.masterDieaseDetails[key] = $scope.memberList[i].dieaseDetails[diseaseCount];
                    }
                }
            }
        };

        $scope.checkForPanCardValidation = function () {
            if (!$scope.productValidation.panCardRequired) {
                if (Number($scope.proposalApp.coverageDetails.totalPremium) >= $scope.productValidation.panAmount) {
                    $scope.productValidation.panCardRequired = true;
                } else {
                    $scope.productValidation.panCardRequired = false;
                }
            }

        }

        $scope.backToResultScreen = function () {
            /*$scope.medicalProposeFormCookieDetails.proposerDetails = $scope.proposerDetails; 
			$scope.medicalProposeFormCookieDetails.nominationDetails = $scope.nominationDetails;
			$scope.medicalProposeFormCookieDetails.appointeeDetails = $scope.appointeeDetails;
			$scope.medicalProposeFormCookieDetails.medicalDetails = $scope.medicalDetails;
			$scope.medicalProposeFormCookieDetails.insuranceDetails = $scope.insuranceDetails;
			$scope.medicalProposeFormCookieDetails.proposerInfo = $scope.proposerInfo;
			$scope.medicalProposeFormCookieDetails.nominationInfo = $scope.nominationInfo;
			$scope.medicalProposeFormCookieDetails.appointeeInfo = $scope.appointeeInfo;
			$scope.medicalProposeFormCookieDetails.medicalInfo = $scope.medicalInfo;
			$scope.medicalProposeFormCookieDetails.insuranceInfo = $scope.insuranceInfo;
	
			localStorageService.set("medicalProposeFormCookieDetails", $scope.medicalProposeFormCookieDetails);*/
            $location.path("/healthResult");
        };

        $scope.prePopulateProposerDetails = function () {

            // Pre-populate Proposer Details.
            $scope.userGeoDetails = localStorageService.get("commAddressDetails");
            var quoteUserInfo = localStorageService.get("quoteUserInfo");
            $scope.memberList = $scope.selectedProductInputParam.personalInfo.selectedFamilyMembers;
            $scope.proposalApp.proposerInfo.personalInfo.gender = $scope.selectedProductInputParam.quoteParam.selfGender;
            $scope.proposalApp.proposerInfo.personalInfo.riders = $scope.selectedProductInputParam.quoteParam.riders;

            //$scope.proposalApp.proposerInfo.contactInfo.locality = ($scope.userGeoDetails.area) ? $scope.userGeoDetails.area : "";
            //$scope.proposalApp.proposerInfo.contactInfo.city = ($scope.userGeoDetails.city) ? $scope.userGeoDetails.city : "";
            if ($scope.userGeoDetails.area) {
                $scope.proposalApp.proposerInfo.contactInfo.locality = $scope.userGeoDetails.area;
            } else {
                $scope.proposalApp.proposerInfo.contactInfo.locality = "";
            }
            if ($scope.userGeoDetails.city) {
                $scope.proposalApp.proposerInfo.contactInfo.city = $scope.userGeoDetails.city;
            } else {
                $scope.proposalApp.proposerInfo.contactInfo.city = {};
            }
            $scope.proposalApp.proposerInfo.contactInfo.state = ($scope.userGeoDetails.state) ? $scope.userGeoDetails.state : "";
            $scope.proposalApp.proposerInfo.contactInfo.pincode = ($scope.userGeoDetails.pincode) ? $scope.userGeoDetails.pincode : "";

            if ($scope.quoteUserInfo) {
                $scope.proposalApp.proposerInfo.contactInfo.emailId = ($scope.quoteUserInfo.emailId) ? $scope.quoteUserInfo.emailId : "";
                $scope.proposalApp.proposerInfo.contactInfo.mobile = ($scope.quoteUserInfo.mobileNumber) ? $scope.quoteUserInfo.mobileNumber : "";
                $scope.proposalApp.proposerInfo.personalInfo.lastName = ($scope.quoteUserInfo.lastName) ? $scope.quoteUserInfo.lastName : "";
                $scope.proposalApp.proposerInfo.personalInfo.firstName = ($scope.quoteUserInfo.firstName) ? $scope.quoteUserInfo.firstName : "";
                $scope.proposalApp.proposerInfo.personalInfo.lastName = ($scope.quoteUserInfo.lastName) ? $scope.quoteUserInfo.lastName : "";
            }
            //$scope.proposalApp.proposerInfo.personalInfo.salutation = findSalutation($scope.proposalApp.proposerInfo.personalInfo.gender);
            $scope.proposalApp.proposerInfo.personalInfo.salutation = $scope.proposalApp.proposerInfo.personalInfo.gender == "M" ? "Mr" : "Ms";
            //$scope.productValidation.panCardRequired = Number($scope.selectedProduct.annualPremium) >= 50000 ? true : false;

            $scope.proposalApp.coverageDetails.policyTerm = $scope.policyTermList[0].term;
            //added policy term unit as year.
            $scope.proposalApp.coverageDetails.policyTermUnit = $scope.policyTermList[0].unit;

            for (var i = 0; i < $scope.memberList.length; i++) {
                if ($scope.memberList[i].relation == "Self") {

                    $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = $scope.memberList[i].dob;
                    $scope.proposerAge = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
            //        $scope.Age=getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                    $scope.proposalApp.proposerInfo.personalInfo.age =Math.floor(getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth));
                    console.log("$scope.proposalApp.proposerInfo.personalInfo:",$scope.proposalApp.proposerInfo.personalInfo.age);
                    $scope.storedDOB = angular.copy($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                    $scope.selectedGender = angular.copy($scope.proposalApp.proposerInfo.personalInfo.gender);
                    break;
                }
            }


            $scope.proposalApp.proposerInfo.personalInfo.age =Math.floor(getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth));
            console.log("$scope.proposalApp:",$scope.proposalApp.proposerInfo.personalInfo.age);
            $scope.newPinCode = angular.copy($scope.proposalApp.proposerInfo.contactInfo);
            //this is for pan card validation
            $scope.checkForPanCardValidation();

            // This flag is required for Aegon Religare Product.
            $scope.prePopulateInsuredDetails();
        };


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

        //$scope.proposalApp.proposerInfo.permanentAddress.push($scope.permanentAddressDetails);
        $scope.prePopulateInsuranceDetails = function () {
            $scope.diseaseShow = false;
            // $scope.proposalApp.proposerInfo.contactInfo.streetDetails = '';
            // $scope.proposalApp.proposerInfo.contactInfo.houseNo = '';
            $scope.proposalApp.socialStatusDetails.socialStatus = "No";
            $scope.proposalApp.socialStatusDetails.unorganizedSector = "No";
            $scope.proposalApp.socialStatusDetails.belowPovertyLine = "No";
            $scope.proposalApp.socialStatusDetails.informalSector = "No";
            $scope.proposalApp.socialStatusDetails.phyicallyChallenged = "No";
            $scope.insuranceDetails.preDiseaseStatus = $scope.selectedProductInputParam.personalInfo.preDiseaseStatus;
            if ($scope.insuranceDetails.preDiseaseStatus == 'Yes') {
                $scope.preDiseaseApplicable = 'true';
                $scope.diseaseShow = true;
            } else {
                $scope.preDiseaseApplicable = 'false';
            }
            // Pre-populating new policy start date.
            $scope.prePopulateProposerDetails();
        };
        $scope.populateCoverageDetails = function () {
            var polEndDate;

            //for HDFC Deductible amount
            $scope.selectedProduct = localStorageService.get("healthSelectedProduct");

            $scope.insuranceInfo = {};
            $scope.insuranceInfo.policyStartDate = new Date(new Date().setDate((new Date()).getDate() + 1));
            convertDateFormatToString($scope.insuranceInfo.policyStartDate, function (formattedPolStartDate) {
                $scope.proposalApp.coverageDetails.policyStartDate = formattedPolStartDate;
            });
            if (String($scope.insuranceInfo.policyStartDate) !== "undefined") {
                var futureDate = new Date((new Date().setDate(new Date().getDate() + Number($scope.productValidation.policyStartDateLimit))));

                if ($scope.insuranceInfo.policyStartDate <= new Date() || $scope.insuranceInfo.policyStartDate > futureDate) {
                    var todayDate = new Date(new Date().setDate(new Date().getDate() + 1));
                    $scope.proposalApp.coverageDetails.policyStartDate = (Number(todayDate.getDate())) + "/" + (Number(todayDate.getMonth()) + 1) + "/" + todayDate.getFullYear();
                    polEndDate = new Date(todayDate.setFullYear(todayDate.getFullYear() + 1));
                    $scope.proposalApp.coverageDetails.policyEndDate = (Number(polEndDate.getDate())) + "/" + (Number(polEndDate.getMonth()) + 1) + "/" + polEndDate.getFullYear();
                } else {
                    var tempPolicyExpiryDate = $scope.insuranceInfo.policyStartDate;
                    polEndDate = new Date(tempPolicyExpiryDate.setFullYear(tempPolicyExpiryDate.getFullYear() + 1));
                    polEndDate = new Date(polEndDate.setDate((polEndDate.getDate() - 1)));

                    convertDateFormatToString(polEndDate, function (formattedPolEndDate) {
                        $scope.proposalApp.coverageDetails.policyEndDate = formattedPolEndDate;
                    });
                }

            }
            $scope.proposalApp.proposerInfo.personalInfo.riders = $scope.selectedProductInputParam.quoteParam.riders;
            $scope.proposalApp.coverageDetails.sumAssured = $scope.selectedProduct.sumInsured;
            $scope.proposalApp.coverageDetails.totalPremium = $scope.selectedProduct.annualPremium;
            $scope.proposalApp.coverageDetails.basePremium = $scope.selectedProduct.basicPremium;
            $scope.proposalApp.coverageDetails.serviceTax = $scope.selectedProduct.serviceTax;
            if ($scope.selectedProduct.totalCount) {
                $scope.proposalApp.coverageDetails.totalCount = $scope.selectedProduct.totalCount;
            }
            $scope.proposalApp.carrierId = Number($scope.selectedProduct.carrierId);
            $scope.proposalApp.planId = Number($scope.selectedProduct.planId);
            $scope.proposalApp.coverageDetails.carrierQuoteId = $scope.selectedProduct.carrierQuoteId;
            $scope.proposalApp.coverageDetails.deductible = $scope.selectedProduct.deductible;
            $scope.newdeductible = angular.copy($scope.proposalApp.coverageDetails.deductible);
            if ($scope.selectedProduct.deductibleAmount) {
                $scope.proposalApp.coverageDetails.deductible = $scope.selectedProduct.deductibleAmount;
            }


            /*if($scope.selectedProduct.riderList != null)
            {
            	for(var count=0 ; count < $scope.selectedProduct.riderList.length; count++)
            	{
            		var rider = angular.copy($scope.riderDef)
            		rider.riderId = $scope.selectedProduct.riderList[count].riderId;
            		rider.premiumAmount = $scope.selectedProduct.riderList[count].riderPremiumAmount;
            		$scope.proposalApp.coverageDetails.riders.push(rider);
            	}
            }*/
            if ($scope.proposalApp.proposerInfo.personalInfo.riders != null) {
                $scope.proposalApp.coverageDetails.riders = $scope.proposalApp.proposerInfo.personalInfo.riders;
            }
            if ($scope.productValidation.selfMarriedRestricted) {

            }
            //Prepopulation of Insurance Details
            $scope.prePopulateInsuranceDetails();
        };

        $scope.init = function () {
            //Setting Disease List Page
            $scope.numRecords = 4;
            $scope.page = 1;

            //setting treatmentList
            //$scope.seltreatmentGiven={'value':'Out Patient'};
            $scope.treatmentGiven = [{ 'value': 'Out Patient' }, { 'value': 'treatmentGiven' }];

            // Setting application labels to avoid static assignment.	-	modification-0003
            /*var applicationLabels  = localStorageService.get("applicationLabels");
            $scope.globalLabel = applicationLabels.globalLabels;*/

            //Code By Vikas K
            $scope.proposalApp = healthProposalRequestDef;
            $scope.healthDieaseDef = healthDieaseDef;
            $scope.medicalDieaseDef = medicalDieaseDef;
            $scope.healthRiderPremiumDef = healthRiderPremiumDef;
            $scope.healthDeclartionDef = healthDeclartionDef;
            $scope.insuredMemberDef = insuredMemberDef;
            $scope.riderDef = healthRiderPremiumDef;
            //$scope.medicalQuestionarrier=religareHealthQuestions;
            $scope.undertakingList = religareUndertakingList;
            $scope.annualIncomesRange = annualIncomesGeneric;
            $scope.yesNoStatus = yesNoStatusGeneric;

            //Code By Vikas K
            $scope.proposerInfo = {};
            $scope.authenticate = {};
            $scope.insuranceDetails = {};
            $scope.insuredDetails = {};

            $scope.insuredList = [];
            $scope.policyTermList = [];

            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = false;
            $scope.screenFourStatus = false;
            $scope.screenFiveStatus = false;
            $scope.updateBtnStatus = false;
            $scope.addBtnStatus = true;
            $scope.insuredFormValid = true;
            $scope.proposalFormValid = true;

            $scope.loading = false;

            $scope.diseaseQuestionFormError = "";
            $scope.accordion = '1';

            $scope.salutationsList = [{ "value": "Mr", "display": "Mr." }, { "value": "Ms", "display": "Ms." }, { "value": "Mrs", "display": "Mrs." }];
            $scope.maritalStatusType = maritalStatusListGeneric;
            $scope.diabetesMellitusTermList = diabetesMellitusTermListGeneric;
            $scope.nomineeRelationType = nomineeRelationTypeGeneric;
            $scope.appointeeRelationType = nomineeRelationTypeGeneric;
            $scope.nomineeRelationTypeFuture = nomineeRelationFutureTypeGeneric;
            //$scope.nomineeRelationTypeCigna = nomineeRelationCignaTypeGeneric;
            $scope.diseaseQuestionList = religareDiseaseQuestionList;
            $scope.genderType = genderTypeGeneric;
            $scope.monthList = healthmonthListGeneric;
            $scope.policyTermList = getPolicyTerms($scope.productValidation.policyTermLimit);

            // $scope.buyScreenRidersStatus = ($scope.buyScreenRiders == null || String($scope.buyScreenRiders) == "undefined") ? false : true;
            // Update policy start date limit depends upon financial year.
            if ($scope.productValidation.policyStartDateLimit == 1000) {
                $scope.productValidation.policyStartDateLimit = getDays(getCurrentFinancialYearDate(), 1);
            }

            if (localStorageService.get("professionalQuoteParams")) {
                if (localStorageService.get("professionalQuoteParams").commonInfo) {
                    $scope.commonInfo = localStorageService.get("professionalQuoteParams").commonInfo;
                } else {
                    if (localStorageService.get("quoteUserInfo")) {
                        $scope.commonInfo = localStorageService.get("quoteUserInfo");
                        $scope.commonInfo.salutation = ($scope.proposalApp.proposerInfo.personalInfo.gender == "F") ? "Miss" : "Mr";
                    }
                }
            } else {
                if (localStorageService.get("quoteUserInfo")) {
                    $scope.commonInfo = localStorageService.get("quoteUserInfo");
                    $scope.commonInfo.salutation = ($scope.proposalApp.proposerInfo.personalInfo.gender == "F") ? "Miss" : "Mr";
                }
            }

            $scope.populateCoverageDetails();

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



            //for deductible
            $scope.deductibleDiv = false;
            $scope.deductibleDropdown = function () {
                if ($scope.selectedProduct.deductible) {
                    $scope.deductibleDiv = true;
                    if ($scope.selectedProduct.sumInsured <= 300000) {
                        $scope.deductibleRange = deductiblePlanA;
                    } else if ($scope.selectedProduct.sumInsured >= 400000 && $scope.selectedProduct.sumInsured <= 1000000) {
                        $scope.deductibleRange = deductiblePlanB;
                    } else {
                        $scope.deductibleRange = deductiblePlanC;
                    }
                }
            }
            $scope.deductibleDropdown();

            var searchData = {};
            searchData.documentType = "DiseaseQuestion";
            searchData.carrierId = $scope.selectedProduct.carrierId;
            searchData.planId = $scope.selectedProduct.planId;
            searchData.riders = $scope.proposalApp.coverageDetails.riders;
            //alert(searchData.planId)
            getDocUsingParam(RestAPI, "getHealthQuestionList", searchData, function (callback) {
                $scope.medicalQuestionarrier = callback.data;
                for (var i = 0; i < $scope.medicalQuestionarrier.length; i++) {
                    if ($scope.medicalQuestionarrier[i].questionCode == 'PREXDISEA') {
                        if ($scope.medicalQuestionarrier[i].applicable == 'true') {
                            $scope.diseaseShow == true;
                            $scope.clicktoShowDisease();
                        }
                    }
                }
                $scope.checkForStartHealth = false;
                /*for(var i=0; i<$scope.medicalQuestionarrier.length; i++){
                	if($scope.medicalQuestionarrier[i].questionCode=='TERMCOND'){
                		if($scope.medicalQuestionarrier[i].applicable!='true'){
                			$scope.checkForStartHealth=true;
                			alert('falee');
                			$scope.medicalDetailsForm.$invalid;
                		}else if($scope.medicalQuestionarrier[i].applicable=='true'){
                			$scope.checkForStartHealth=false;
                		}
                	}
                }*/

                var searchDiseaseData = {};
                searchDiseaseData.documentType = "DiseaseMapping";
                searchDiseaseData.carrierId = $scope.selectedProduct.carrierId;
                searchDiseaseData.planId = $scope.selectedProduct.planId;
                searchDiseaseData.riders = $scope.proposalApp.coverageDetails.riders;
                getDocUsingParam(RestAPI, "getHealthQuestionList", searchDiseaseData, function (callback) {
                    $scope.diseaseList = callback.data;
                    $scope.numberOfPages = Math.ceil($scope.diseaseList.length / $scope.numRecords);
                    $scope.diseaseListDisable = angular.copy($scope.diseaseList);
                    for (var i = 0; i < $scope.diseaseListDisable.length; i++) {
                        $scope.diseaseListDisable[i].subParentId = $scope.diseaseListDisable[i].parentId
                    }


                });
            });
        };
        $scope.isDieaseApplicable = function (relationshipCode, masterDieasesCode) {
            var key = relationshipCode + "-" + masterDieasesCode;
            if ($scope.masterDieaseDetails[key] != null) {
                return true;
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

        $scope.setDropDown3 = function (dropDown) {
            $scope.dropdownValue3 = JSON.parse(dropDown);
        }
        $scope.setDropDown4 = function (dropDown) {
            $scope.dropdownValue4 = JSON.parse(dropDown);
        }
        $scope.getAnnualIncome = function (income) {
            $scope.proposalApp.proposerInfo.personalInfo.annualIncome = income.annualIncome;
        }

        $scope.changeOccupation = function () {
            if (String($scope.selfAsInsured) != "undefined") {
                $scope.selfAsInsured.occupation = $scope.proposalApp.proposerInfo.personalInfo.occupation;
            }
        }

        $scope.changeGender = function () {
            if (String($scope.selectedGender) != 'undefined' || $scope.selectedGender != null) {
                $scope.proposalApp.proposerInfo.personalInfo.salutation = $scope.proposalApp.proposerInfo.personalInfo.gender == "M" ? "Mr" : "Ms";
                $scope.selfAsInsured.gender = $scope.proposalApp.proposerInfo.personalInfo.gender;

                //$scope.selfAsInsured.salutation = findSalutation($scope.selfAsInsured.gender);
                $scope.selfAsInsured.salutation = $scope.selfAsInsured.gender == "M" ? "Mr" : "Ms";
                if ($scope.commonInfo) {
                    $scope.commonInfo.salutation = ($scope.selfAsInsured.gender == "F") ? "Miss" : "Mr";
                }

                if ($scope.selfAsInsured.gender == "M" && $scope.spouseAsInsured) {
                    $scope.spouseAsInsured.gender = "F";
                    $scope.spouseAsInsured.salutation = $scope.spouseAsInsured.gender == "M" ? "Mr" : "Ms";
                } else if ($scope.selfAsInsured.gender == "F" && $scope.spouseAsInsured) {
                    $scope.spouseAsInsured.gender = "M";
                    $scope.spouseAsInsured.salutation = $scope.spouseAsInsured.gender == "M" ? "Mr" : "Ms";
                }

                if ($scope.selectedGender != $scope.proposalApp.proposerInfo.personalInfo.gender) {
                    //$scope.$watch('proposalApp.proposerInfo.personalInfo.dateOfBirth', function(newValue) {
                    $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.genderChangeMsg, "No", "Yes", function (confirmStatus) {
                        if (confirmStatus) {
                            $scope.loading = true;
                            $scope.selectedProductInputParamForPin.quoteParam.selfGender = $scope.proposalApp.proposerInfo.personalInfo.gender;


                            for (var i = 0; i < $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers.length; i++) {
                                if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == "Self") {
                                    $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = $scope.selfAsInsured.gender;
                                    $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].salutation = $scope.selfAsInsured.salutation;
                                }
                                if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].relation == "Spouse") {
                                    $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = $scope.spouseAsInsured.gender;
                                    $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].salutation = $scope.spouseAsInsured.salutation;
                                }
                                if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender == "M") {
                                    $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = "Male";
                                }
                                if ($scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender == "F") {
                                    $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].gender = "Female";
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

                            if ($scope.selectedProduct.childPlanId != null) {
                                $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                            }
                            $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                            if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                            }
                            $scope.quote = localStorageService.get("healthQuoteInputParamaters");
                            $scope.quote.personalInfo = $scope.selectedProductInputParamForPin.personalInfo;
                            $scope.quote.quoteParam = $scope.selectedProductInputParamForPin.quoteParam;
                            localStorageService.set("healthQuoteInputParamaters", $scope.quote);
                            if (localStorageService.get("PROF_QUOTE_ID")) {
                                $scope.selectedProductInputParamForPin.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
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

                                        header.messageId = messageIDVar;
                                        header.campaignID = campaignIDVar;
                                        header.source = sourceOrigin;
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
                            if ($scope.commonInfo) {
                                $scope.commonInfo.salutation = ($scope.proposalApp.proposerInfo.personalInfo.gender == "F") ? "Miss" : "Mr";
                            }

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
                    if ($scope.commonInfo) {
                        $scope.commonInfo.salutation = ($scope.proposalApp.proposerInfo.personalInfo.gender == "F") ? "Miss" : "Mr";
                    }
                    $scope.selectedGender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                    for (var j = 0; j < $scope.proposalApp.insuredMembers.length; j++) {
                        if ($scope.proposalApp.insuredMembers[j].relationship == "Self") {
                            $scope.proposalApp.insuredMembers[j].gender = $scope.proposalApp.proposerInfo.personalInfo.gender;
                        }
                    }
                }
            }
        }

        /* $scope.changeDateOfBirth = function(){
        	$scope.selfAsInsured.dateOfBirth = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
        	$scope.proposerAge = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
        }; */


        // Populate list of years based on age.
        $scope.getYearList = function (dateofBirth) {
            var dateArr = dateofBirth.split("/");
            var newDOB = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
            return listRegistrationYear("buyScreen", calculateAgeByDOB(newDOB)); //getAgeFromDOB()
        };
        $scope.setDieaseStartDate = function (insuredDieaseDetails) {
            if (insuredDieaseDetails.startMonth != null) {
                insuredDieaseDetails.startDate = "01/" + insuredDieaseDetails.startMonth + "/" + insuredDieaseDetails.startYear;
            } else if (insuredDieaseDetails.startYear != null) {
                insuredDieaseDetails.startDate = "01/01/" + insuredDieaseDetails.startYear;
            }
        };

        $scope.closeDiseaseQuestionModal = function (selInsuredInfo) {
            var deleteList = [];

            for (var i = 0; i < $scope.diseaseQuestionList.length; i++) {
                //if(selInsuredInfo.selectedDiseaseQuestions.includes($scope.diseaseQuestionList[i].id)== true && $scope.diseaseQuestionList[i].existSinceError == true){
                if (p365Includes(selInsuredInfo.selectedDiseaseQuestions, $scope.diseaseQuestionList[i].id) == true && $scope.diseaseQuestionList[i].existSinceError == true) {
                    deleteList.push($scope.diseaseQuestionList[i].id);
                    $scope.diseaseQuestionList[i].existSinceError = false;
                }
            }

            if (selInsuredInfo.selectedDiseaseQuestions.length == 0) {
                selInsuredInfo.preExistingDisease = "No";
            }

            selInsuredInfo.selectedDiseaseQuestions = selInsuredInfo.selectedDiseaseQuestions.filter(function (obj) {
                return deleteList.indexOf(obj) === -1;
            });

            $scope.diseaseQuestionFormError = "";
            $scope.modalHealthQuestion = false;
        };

        $scope.getDiseaseQuestions = function (getDiseaseQuestions) {
            return selInsuredInfo.selectedDiseaseQuestions;
        };

        $scope.checkDiseaseQuestion = function (selId, selStatus) {
            for (var i = 0; i < $scope.diseaseQuestionList.length; i++) {
                if ($scope.diseaseQuestionList[i].id == selId) {
                    $scope.diseaseQuestionList[i].status = (selStatus == true ? "Yes" : "No");
                }
            }
        };
        $scope.submitDiseaseQuestions = function (selInsuredInfo) {
            if (!$scope.healthQuestionForm.$invalid && $scope.validateDiseaseQuestionForm()) {
                $scope.diseaseQuestionFormError = "";
                for (var i = 0; i < $scope.diseaseQuestionList.length; i++)
                    delete $scope.diseaseQuestionList[i].$$hashKey;

                if (selInsuredInfo.selectedDiseaseQuestions.length == 0)
                    selInsuredInfo.preExistingDisease = "No";

                selInsuredInfo.diseaseQuestionList = $scope.diseaseQuestionList;
                $scope.modalHealthQuestion = false;
            } else {
                $scope.diseaseQuestionFormError = "Do not let left any selected field empty or invalid.";
            }
        };
        $scope.submitDieaseList = function ($mdMenu, ev) {
            $scope.diseaseShow = false;
        };
        $scope.changeInsuredHospitalCash = function (selInsuredInfo) {
            if (selInsuredInfo.hospitalCash == "1") {
                $rootScope.P365Confirm("Policies365", "You have Hospital Cash benefit of Rs. 1000 for each completed day of hospitalization subject to max. of 7 days per hospitalization and 14 days for a policy period. This will increase your premium by Rs.403 ( Premium 350+ Service Tax of Rs. 53) over what is quoted.  Are you sure want to proceed?", "No", "Yes", function (confirmStatus) {
                    if (confirmStatus) {
                        $scope.selectedProduct.annualPremium = Number($scope.selectedProduct.annualPremium) + 403;
                    } else {
                        selInsuredInfo.hospitalCash = "0";
                    }
                });
            } else {
                $scope.selectedProduct.annualPremium = Number($scope.selectedProduct.annualPremium) - 403;
            }
        };
        $scope.changeInsuredPersonalAccident = function (selInsuredInfo) {
            var adultLimit = Number($scope.productValidation.personalAccidentCoverLimit.adult);
            var childLimit = Number($scope.productValidation.personalAccidentCoverLimit.child);
            var totalCount = 0;

            for (var i = 0; i < $scope.insuredList.length; i++) {
                if ($scope.insuredList[i].isPersonalAccidentApplicable == "true") {
                    totalCount += 1;
                }
            }

            if (selInsuredInfo.isPersonalAccidentApplicable == "true") {
                if (totalCount <= (childLimit + adultLimit)) {
                    if (selInsuredInfo.relation == "Son" || selInsuredInfo.relation == "Daughter") {
                        if (childLimit < 1) {
                            selInsuredInfo.isPersonalAccidentApplicable = "false";
                            $rootScope.P365Alert("Policies365", $scope.productValidation.messages.personalAccidentCover, "Ok");
                        }
                    } else {
                        if (adultLimit < 1) {
                            selInsuredInfo.isPersonalAccidentApplicable = "false";
                            $rootScope.P365Alert("Policies365", $scope.productValidation.messages.personalAccidentCover, "Ok");
                        }
                    }
                } else {
                    selInsuredInfo.isPersonalAccidentApplicable = "false";
                    $rootScope.P365Alert("Policies365", $scope.productValidation.messages.personalAccidentCover, "Ok");
                }
            }
        };
        $scope.validateExistSince = function (selInsuredInfo, selExistSince, selIndex) {
            if (String(selExistSince) != "undefined") {
                var todayDate = new Date();

                var diseaseExistDateArray = selExistSince.split("/");
                var diseaseExistDate = new Date(diseaseExistDateArray[1] + "/" + diseaseExistDateArray[0] + "/" + diseaseExistDateArray[2]);

                var InsuredDOBArray = selInsuredInfo.dateOfBirth.split("/");
                var InsuredDOB = new Date(InsuredDOBArray[1] + "/" + InsuredDOBArray[0] + "/" + InsuredDOBArray[2]);

                if (diseaseExistDate < InsuredDOB || diseaseExistDate > todayDate) {
                    $scope.diseaseQuestionList[selIndex].existSinceError = true;
                    selExistSince = InsuredDOBArray[0] + "/" + InsuredDOBArray[1] + "/" + InsuredDOBArray[2];
                } else {
                    $scope.diseaseQuestionList[selIndex].existSinceError = false;
                }
            } else {
                $scope.diseaseQuestionList[selIndex].existSinceError = true;
            }
        };
        $scope.validateDiseaseQuestionForm = function () {
            for (var i = 0; i < $scope.diseaseQuestionList.length; i++) {
                if ($scope.diseaseQuestionList[i].existSinceError == true) {
                    return false;
                }
            }

            return true;
        };
        //Setting properties for proposer DOB date-picker.
        $scope.initHealthBuyScreen = function () {
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
                    //}
                    //}
                    if ($scope.selectedProduct.selectedFamilyMembers[i].relationship == "S") {
                        var selfInsuredMinDOBOption = $scope.selectedProduct.selectedFamilyMembers[i].minDOB;
                        var selfInsuredMaxDOBOption = $scope.selectedProduct.selectedFamilyMembers[i].maxDOB;
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

                    //for hdfc date validation
                    var selfInsuredDOBOptionDiseaseS = {}
                    if (selfInsuredMinDOBOption) {
                        selfInsuredDOBOptionDiseaseS.minimumDateStringFormat = selfInsuredMinDOBOption;
                        selfInsuredDOBOptionDiseaseS.maximumDateStringFormat = "0";
                    }

                    selfInsuredDOBOptionDiseaseS.changeMonth = true;
                    selfInsuredDOBOptionDiseaseS.changeYear = true;
                    selfInsuredDOBOptionDiseaseS.dateFormat = "dd/mm/yy";
                    $scope['selfInsuredDOBOptionDiseaseS' + i] = setP365DatePickerProperties(selfInsuredDOBOptionDiseaseS);

                    var selfInsuredDOBOptionDiseaseSP = {}
                    if (selfMinDOBOption && selfMaxDOBOption) {
                        selfInsuredDOBOptionDiseaseSP.minimumDateStringFormat = selfMinDOBOption;
                        selfInsuredDOBOptionDiseaseSP.maximumDateStringFormat = "0";
                    }

                    selfInsuredDOBOptionDiseaseSP.changeMonth = true;
                    selfInsuredDOBOptionDiseaseSP.changeYear = true;
                    selfInsuredDOBOptionDiseaseSP.dateFormat = "dd/mm/yy";
                    $scope['selfInsuredDOBOptionDiseaseSP' + i] = setP365DatePickerProperties(selfInsuredDOBOptionDiseaseSP);

                    // need to check if validations are getting based on number of family members selected at the time of quote.
                    if ($scope.productValidation.insuredChildAgeMax != null) {
                        var childInsuredDateOption = {};
                        if (childMinDOBOption && childMaxDOBOption) { //added for HDFC TOP UP plan:child min age should be 90  days and max will be 23 years & 364 days.
                            if ($scope.productValidation.hdfcChildMinYearLimit) {
                                childInsuredDateOption.minimumYearLimit = "-" + $scope.productValidation.hdfcInsuredChildAgeMax + "Y" + " - 1D";
                                childInsuredDateOption.maximumYearLimit = "-" + $scope.productValidation.hdfcInsuredChildAgeMin + "D";
                            } else {
                                childInsuredDateOption.minimumDateStringFormat = childMinDOBOption;
                                childInsuredDateOption.maximumDateStringFormat = childMaxDOBOption;
                            }
                        }

                        childInsuredDateOption.changeMonth = true;
                        childInsuredDateOption.changeYear = true;
                        childInsuredDateOption.dateFormat = "dd/mm/yy";
                        $scope['childInsuredDateOptions' + i] = setP365DatePickerProperties(childInsuredDateOption);
                    }

                    //for hdfc date validation
                    if ($scope.productValidation.insuredChildAgeMax != null) {
                        var childInsuredDateOptionDisease = {};
                        if (childMinDOBOption && childMaxDOBOption) {
                            childInsuredDateOptionDisease.minimumDateStringFormat = childMinDOBOption;
                            childInsuredDateOptionDisease.maximumDateStringFormat = "0";
                        }
                        childInsuredDateOptionDisease.changeMonth = true;
                        childInsuredDateOptionDisease.changeYear = true;
                        childInsuredDateOptionDisease.dateFormat = "dd/mm/yy";
                        $scope['childInsuredDateOptionDisease' + i] = setP365DatePickerProperties(childInsuredDateOptionDisease);
                    }
                }
            }
            var proposerDOBOption = {};
            // added for HDFC Top UP Plan: age allowed should be 65 years 364 days
            if ($scope.productValidation.hdfcMinYearLimit) {
                proposerDOBOption.minimumYearLimit = "-" + $scope.productValidation.hdfcProposerMaxAge + "Y" + " - 1D";
            } else {
                proposerDOBOption.minimumYearLimit = "-" + $scope.productValidation.proposerAgeMax.age + "Y";
            }
            proposerDOBOption.maximumYearLimit = "-" + $scope.productValidation.proposerAgeMin.age + "Y";
            proposerDOBOption.changeMonth = true;
            proposerDOBOption.changeYear = true;
            proposerDOBOption.dateFormat = "dd/mm/yy";
            $scope.proposerDOBOptions = setP365DatePickerProperties(proposerDOBOption);

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

            $scope.permanentAddressDetails.isAddressSameAsCommun = true;
            if ($scope.permanentAddressDetails.isAddressSameAsCommun) {
                $scope.permanentAddressDetails.houseNo = $scope.proposalApp.proposerInfo.contactInfo.houseNo;
                $scope.permanentAddressDetails.streetDetails = $scope.proposalApp.proposerInfo.contactInfo.streetDetails;
                $scope.permanentAddressDetails.pincode = $scope.proposalApp.proposerInfo.contactInfo.pincode;
                $scope.permanentAddressDetails.locality = $scope.proposalApp.proposerInfo.contactInfo.locality;
                $scope.permanentAddressDetails.city = $scope.proposalApp.proposerInfo.contactInfo.city;
                $scope.permanentAddressDetails.state = $scope.proposalApp.proposerInfo.contactInfo.state;

                $scope.proposalApp.proposerInfo.personalInfo = $scope.permanentAddressDetails;

                var quoteUserInfo = localStorageService.get("quoteUserInfo");
                $scope.proposalApp.proposerInfo.personalInfo.gender = $scope.selectedProductInputParam.quoteParam.selfGender;
                if (!$scope.iposRequest.docId && quoteUserInfo) {
                    $scope.proposalApp.proposerInfo.personalInfo.lastName = String(quoteUserInfo.lastName) !== "undefined" ? quoteUserInfo.lastName : "";
                    $scope.proposalApp.proposerInfo.personalInfo.firstName = String(quoteUserInfo.firstName) !== "undefined" ? quoteUserInfo.firstName : "";
                }
                $scope.proposalApp.proposerInfo.personalInfo.salutation = $scope.proposalApp.proposerInfo.personalInfo.gender == "M" ? "Mr" : "Ms";
                for (var i = 0; i < $scope.memberList.length; i++) {
                    if ($scope.memberList[i].relation == "Self") {
                        $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = $scope.memberList[i].dob;
                        $scope.proposerAge = getAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                        break;
                    }
                }
            }


        };
        $scope.initWatch = function () {
            /*
             * Reena-: As discussed with Uday and Dany, default marital status set to MARRIED.
             */
            $scope.proposalApp.proposerInfo.personalInfo.martialStatus = $scope.maritalStatusType[0].name;

            if ($scope.proposalApp.nomineeDetails.dateOfBirth) {
                $scope.nomineeAge = getAgeFromDOB($scope.proposalApp.nomineeDetails.dateOfBirth);
            }

            $scope.$watch('selectedProduct.sumInsured', function (newValue) {
                $scope.deductibleDropdown();
            });

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

        $scope.updateFirstName = function (name) {
            $scope.proposalApp.proposerInfo.personalInfo.firstName = name;
        }
        $scope.updateLastName = function (name) {
            $scope.proposalApp.proposerInfo.personalInfo.lastName = name;
        }

        $scope.calculateProposerAge = function (proposerDob) {
            if (String(nomineeDob) !== "undefined") {
                $scope.proposerAge = getAgeFromDOB(proposalApp.proposerInfo.personalInfo.dateOfBirth);
            }
        };

        $scope.calculateNomineeAge = function (nomineeDob) {
            if (String(nomineeDob) !== "undefined") {
                $scope.nomineeAge = getAgeFromDOB($scope.proposalApp.nomineeDetails.dateOfBirth);
            }
        };
        $scope.calculateApointeeAge = function (apointeeDob) {
            if (String(apointeeDob) !== "undefined") {
                $scope.proposalApp.nomineeDetails.apointeeDetails.age = calculateAgeByDOB(String($scope.proposalApp.nomineeDetails.apointeeDetails.dateOfBirth));
            }
        };

        //$scope.count=0;
        //$scope.bmiValidationCount=[];
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
                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.regretPolicyMsg, "Ok");

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
                        //isBmiValidationApplicable flag added for royal sundaram and hdfc topup and medisure plan for showing bmi popup to user and allowing user for proceeding further.
                        if ((!$scope.productValidation.isBmiValidationApplicable) && ($scope.productValidation.isBmiValidationApplicable != undefined)) {
                            if (bmi > Number($scope.productValidation.bmiMaxLimit)) {
                                bmiArr[index] = bmi;
                            } else {
                                bmiArr[index] = bmi;
                            }
                            for (var i = 0; i < bmiArr.length; i++) {
                                if (bmiArr[i] > $scope.productValidation.maxValidBmi || bmiArr[i] < $scope.productValidation.minValidBmi) {
                                    $scope.bmiMsg = true;
                                    break;
                                } else {
                                    $scope.bmiMsg = false;
                                }
                            }
                            //added for hdfc plan for making preExisting disease status as true explicitly from backend,although user has not selected preExisting Disease as applicable(true). 
                            if ($scope.productValidation.hdfcBMI && $scope.bmiMsg) {
                                $scope.proposalApp.hdfcBMI = true;
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

        //	function created to recalculate quote on BMI for future generali
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
                    if (localStorageService.get("PROF_QUOTE_ID")) {
                        $scope.selectedProductInputParamForPin.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
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

                                header.messageId = messageIDVar;
                                header.campaignID = campaignIDVar;
                                header.source = sourceOrigin;
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
        $scope.$watch('noResults', function (newValue) {
            if (newValue == true) {
                $scope.proposalApp.proposerInfo.contactInfo.pincode = "";
                $scope.proposalApp.proposerInfo.contactInfo.locality = "";
                $scope.proposalApp.proposerInfo.contactInfo.city = "";
                $scope.proposalApp.proposerInfo.contactInfo.state = "";
            }
        })
        //
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
                                    $scope.selectedProductInputParamForPin.personalInfo.selectedFamilyMembers[i].age = getProposerAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                                    //localStorageService.set("healthQuoteInputParamaters").personalInfo.selectedFamilyMembers[i].dob = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
                                    // var healthInputParamDetails=localStorageService.get("healthQuoteInputParamaters").personalInfo.selectedFamilyMembers;
                                    // healthInputParamDetails.personalInfo.selectedFamilyMembers=$scope.selectedProductInputParamForPin.personalInfo;

                                }
                            }
                            $scope.selectedProductInputParamForPin.quoteParam.selfAge = getProposerAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);
                            for (var j = 0; j < $scope.selectedProductInputParamForPin.quoteParam.dependent.length; j++) {
                                if ($scope.selectedProductInputParamForPin.quoteParam.dependent[j].relationShip == "S") {
                                    $scope.selectedProductInputParamForPin.quoteParam.dependent[j].age = getProposerAgeFromDOB($scope.proposalApp.proposerInfo.personalInfo.dateOfBirth);

                                }
                            }

                            if ($scope.selectedProduct.childPlanId != null) {
                                $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                            }
                            $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                            if (localStorageService.get("quoteUserInfo").mobileNumber) {
                                $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                            }
                            localStorageService.set("healthQuoteInputParamaters", $scope.selectedProductInputParamForPin);
                            if (localStorageService.get("PROF_QUOTE_ID")) {
                                $scope.selectedProductInputParamForPin.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
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

                                        header.messageId = messageIDVar;
                                        header.campaignID = campaignIDVar;
                                        header.source = sourceOrigin;
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
                                                                $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = '';
                                                                var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgDob
                                                                $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                            }
                                                        } else {
                                                            $scope.loading = false;
                                                            $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth = '';
                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgDob
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
            $scope.selfAsInsured.dateOfBirth = $scope.proposalApp.proposerInfo.personalInfo.dateOfBirth;
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
                        if (localStorageService.get("PROF_QUOTE_ID")) {
                            $scope.selectedProductInputParamForPin.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
                        }
                        RestAPI.invoke($scope.p365Labels.getRequest.quoteHealth, $scope.selectedProductInputParamForPin).then(function (callback) {
                            $scope.healthRecalculateQuoteRequest = [];
                            if (callback.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.responseRecalculateCodeList = [];

                                localStorageService.set("QUOTE_ID", callback.QUOTE_ID);
                                localStorageService.set("HEALTH_UNIQUE_QUOTE_ID", callback.QUOTE_ID);
                                $scope.healthRecalculateQuoteRequest = callback.data;
                                //for adding mobile number in quote request if call goes to quote calculation


                                $scope.healthQuoteResult = [];
                                $scope.quoteCalcResponse = [];
                                angular.forEach($scope.healthRecalculateQuoteRequest, function (obj, i) {
                                    var request = {};
                                    var header = {};

                                    header.messageId = messageIDVar;
                                    header.campaignID = campaignIDVar;
                                    header.source = sourceOrigin;
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
                    if ($scope.proposalApp.proposerInfo.contactInfo) {
                        if ($scope.proposalApp.proposerInfo.contactInfo.streetDetails) {
                            item.displayArea = $scope.proposalApp.proposerInfo.contactInfo.streetDetails;
                        }
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

                if ($scope.proposalApp.proposerInfo.contactInfo) {
                    if ($scope.proposalApp.proposerInfo.contactInfo.streetDetails) {
                        item.displayArea = $scope.proposalApp.proposerInfo.contactInfo.streetDetails;
                    }
                }
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
                if (!$scope.iposRequest.docId) {
                    $scope.proposalApp.proposerInfo.personalInfo.lastName = String(quoteUserInfo.lastName) !== "undefined" ? quoteUserInfo.lastName : "";
                    $scope.proposalApp.proposerInfo.personalInfo.firstName = String(quoteUserInfo.firstName) !== "undefined" ? quoteUserInfo.firstName : "";
                }
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
        // Code for Registration Address by Supriya
        $scope.getPinCodeAreaList = function (AreaName) {
            var docType;
            if (isNaN(AreaName)) {
                docType = "Area";
            } else {
                docType = "Pincode";
            }

            return $http.get(getServiceLink + docType + "&q=" + AreaName).then(function (responseReg) {

                return JSON.parse(responseReg.data).data;

            });
        };
        $scope.$watch('noResultsReg', function (newValueReg) {
            if (newValueReg == true) {
                $scope.permanentAddressDetails.locality = "";
                $scope.permanentAddressDetails.city = "";
                $scope.permanentAddressDetails.pincode = "";
                $scope.permanentAddressDetails.state = "";
            }
        })

        $scope.resetCommunicationAddress = function () {
            if (String($scope.proposerDetails.address) == "undefined" || $scope.proposerDetails.address.length == 0) {
                $scope.proposerDetails.pincode = "";
                $scope.proposerDetails.state = "";
                $scope.proposerDetails.city = "";
                $scope.proposerDetails.doorNo = "";
            }
        };
        $scope.getdeductible = function () {

            if ($scope.newdeductible != $scope.proposalApp.coverageDetails.deductible) {

                $rootScope.P365Confirm($scope.p365Labels.common.p365prompt, $scope.p365Labels.common.deductibleChangeMsg, "No", "Yes", function (confirmStatus) {
                    if (confirmStatus) {
                        $scope.loading = true;
                        $scope.selectedProductInputParamForPin.quoteParam.deductible = $scope.proposalApp.coverageDetails.deductible;
                        $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                        $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                        if (localStorageService.get("quoteUserInfo").mobileNumber) {
                            $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                        }
                        if (localStorageService.get("PROF_QUOTE_ID")) {
                            $scope.selectedProductInputParamForPin.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
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

                                    header.messageId = messageIDVar;
                                    header.campaignID = campaignIDVar;
                                    header.source = sourceOrigin;
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
                                                    if (healthQuoteResponse.data.quotes[0].childPlanId != undefined) {
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
                                                    if ($scope.selectedProduct.childPlanId != undefined) {
                                                        if (healthQuoteResponse.data.quotes[0].childPlanId == $scope.selectedProduct.childPlanId) {
                                                            $scope.loading = false;
                                                            var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgDeductible
                                                            $rootScope.P365Alert("Policies365", screenCnfrmError, "Ok");
                                                        }
                                                    } else {
                                                        $scope.loading = false;
                                                        var screenCnfrmError = $scope.selectedProduct.insuranceCompany + '' + $scope.p365Labels.errorMessage.screenConfirmErrorMsgDeductible
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

                            }

                        });
                        $scope.newdeductible = $scope.proposalApp.coverageDetails.deductible;
                        $scope.proposalApp.coverageDetails.deductible = $scope.newdeductible;

                    } else {
                        $scope.proposalApp.coverageDetails.deductible = $scope.newdeductible;
                    }
                });

            } else {
                $scope.proposalApp.coverageDetails.deductible = $scope.newdeductible;
            }

        }

        $scope.resetRegistrationAddress = function () {
            if (String($scope.vehicleDetails.address) == "undefined" || $scope.vehicleDetails.address.length == 0) {
                $scope.vehicleDetails.pincode = "";
                $scope.vehicleDetails.state = "";
                $scope.vehicleDetails.city = "";
                $scope.vehicleDetails.doorNo = "";
            }
        };

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

        $scope.$on("setCommAddressByAPI", function () {
            setTimeout(function () {
                var googleAddressObject = angular.copy($rootScope.chosenCommPlaceDetails);
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
                var googleAddressObject = angular.copy($rootScope.chosenRegPlaceDetails);
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

        $scope.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);

            $scope.hideDisease = function () {
                $mdMenu.hide();
            };
        };

        $scope.clicktoDisable = function () {
            setTimeout(function () {
                $('.md-click-catcher').css('pointer-events', 'none');
            }, 100);
        };

        $scope.clicktoShowDisease = function () {
            $scope.diseaseShow = true;
        };
        $scope.clicktoHideDisease = function () {
            $scope.diseaseShow = false;
        };
        /*hdfc*/
        //$scope.inputTypeDiv=false;
        /*$scope.selectedQuestions=[];
		$scope.inputTypeCheck=function(sel,quesId,index){
			alert(sel);alert(index)
			if(sel=='true'){
				$scope.selectedQuestions.push(quesId)
			}else{
	
				$scope.selectedQuesftions.splice(index,1)
			}
		}*/
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

        /*end*/
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
        //$scope.EnableSubmit=true;
        $scope.stateChanged = function (qId, relationship, id) {
            var i;
            //added 'id' to check condition, as the relationship is not unique.
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
            //$scope.selDiseaseList.push(qId.disease+',');
            /*if($scope.answers[qId]){ //If it is checked
            	alert('test');
            }*/

            /*for( i = 0; i < $scope.questionLength.length; i++){
            	if($scope.questionLength[i].applicable==true){
            		$scope.EnableSubmit=false;
            		break;
            	}
            }*/
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

                        if ($scope.selectedProduct.childPlanId != null) {
                            $scope.selectedProductInputParamForPin.childPlanId = Number($scope.selectedProduct.childPlanId);
                        }
                        $scope.selectedProductInputParamForPin.sumInsured = $scope.selectedProduct.sumInsured;
                        if (localStorageService.get("quoteUserInfo").mobileNumber) {
                            $scope.selectedProductInputParamForPin.mobileNumber = localStorageService.get("quoteUserInfo").mobileNumber;
                        }
                        if (localStorageService.get("PROF_QUOTE_ID")) {
                            $scope.selectedProductInputParamForPin.PROF_QUOTE_ID = localStorageService.get("PROF_QUOTE_ID");
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

                                    header.messageId = messageIDVar;
                                    header.campaignID = campaignIDVar;
                                    header.source = sourceOrigin;
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

        $scope.Section1Inactive = false;
        $scope.Section2Inactive = true;
        $scope.Section3Inactive = true;
        $scope.Section4Inactive = true;
        $scope.Section5Inactive = true;
        $scope.Section6Inactive = true;
        $scope.submitProposerInfo = function () {
            $scope.accordion = '2';
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.screenFourStatus = false;
            $scope.screenFiveStatus = false;
            $scope.screenSixStatus = false;
            $scope.Section2Inactive = false;

            //added by gauri for imautic
            if (imauticAutomation == true) {
                imatEvent('ProposalFilled');
            }

            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.saveProposal = true;
                $scope.savePersonalDetails = true;
                $scope.saveNomineeDetails = false;
                $scope.saveInsuredDetails = false;
                $scope.saveMedicalDetails = false;

                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };

        $scope.submitAddressDetails = function () {
            $scope.accordion = '3';
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.screenFourStatus = false;
            $scope.screenFiveStatus = false;
            $scope.screenSixStatus = false;
            $scope.Section3Inactive = false;
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.saveProposal = true;
                $scope.savePersonalDetails = true;
                $scope.saveNomineeDetails = false;
                $scope.saveInsuredDetails = false;
                $scope.saveMedicalDetails = false;

                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };

        $scope.editProposerInfo = function () {
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = false;
            $scope.screenThreeStatus = false;
            $scope.screenFiveStatus = false;
            $scope.screenSixStatus = false;
            $scope.accordion = '1';
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
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.saveProposal = true;
                $scope.saveInsuredDetails = true;
                $scope.savePersonalDetails = true;
                $scope.saveMedicalDetails = false;
                $scope.saveNomineeDetails = false;
                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };

        $scope.editInsuredInfo = function () {
            $scope.screenOneStatus = false;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.accordion = '3';
        };
        $scope.editAddressInfo = function () {
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = false;
            $scope.accordion = '2';
        };
        $scope.submitNomineeInfo = function () {
            $scope.accordion = '5';
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.screenFourStatus = true;
            $scope.screenFiveStatus = true;
            $scope.screenSixStatus = false;
            $scope.Section5Inactive = false;
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.saveProposal = true;
                $scope.saveInsuredDetails = true;
                $scope.saveNomineeDetails = true;
                $scope.savePersonalDetails = true;
                $scope.saveMedicalDetails = false;

                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };
        $scope.editNomineeInfo = function () {
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.screenFourStatus = true;
            $scope.accordion = '4';
        };
        $scope.submitMedicalInfo = function () {
            $scope.accordion = '6';
            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.screenFourStatus = true;
            $scope.screenFiveStatus = true;
            $scope.screenSixStatus = true;
            $scope.Section6Inactive = false;
            if ($rootScope.baseEnvEnabled && !$rootScope.wordPressEnabled) {
                $scope.saveProposal = true;
                $scope.saveInsuredDetails = true;
                $scope.saveNomineeDetails = true;
                $scope.savePersonalDetails = true;
                $scope.saveMedicalDetails = true;

                /* call a function to submit proposal for save purpose*/
                $scope.submitProposalData();
            }
        };
        $scope.editMedicalInfo = function () {

            $scope.screenOneStatus = true;
            $scope.screenTwoStatus = true;
            $scope.screenThreeStatus = true;
            $scope.screenFourStatus = true;
            $scope.screenFiveStatus = true;
            $scope.accordion = '5';
        };

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
            $scope.authenticate.enteredOTP = "";
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
                        if ($scope.proposalFormValid) {
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
                if ($scope.proposalFormValid) {
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
        }

        $scope.redirectToPaymentGateway = function () {
            if ($scope.paymentURLParam) {
                if ($rootScope.affilateUser || $rootScope.agencyPortalEnabled) {
                    $window.top.location.href = $scope.paymentServiceResponse.paymentURL + $scope.paymentURLParam;
                } else {
                    if($scope.paymentURLParam=="?"){
                        $window.location.href = $scope.paymentServiceResponse.paymentURL; 
                    }else{
                    $window.location.href = $scope.paymentServiceResponse.paymentURL + $scope.paymentURLParam;
                    }
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

            $scope.proposalApp.QUOTE_ID = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
            $scope.proposalApp.insuranceCompany = $scope.selectedProduct.insuranceCompany;
            $scope.proposalApp.planName = $scope.selectedProduct.planName;
            $scope.proposalApp.quoteType = $scope.p365Labels.businessLineType.health;
            $scope.proposalApp.businessLineId = $scope.p365Labels.businessLineType.health;

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
                if ($rootScope.baseEnvEnabled && $rootScope.agencyPortalEnabled) {
                    $scope.proposalApp.baseEnvStatus = false;
                    $scope.proposalApp.source = sourceOrigin;
                } else {
                    $scope.proposalApp.baseEnvStatus = baseEnvEnabled;
                    $scope.proposalApp.source = sourceOrigin;
                }
            } else {
                $scope.proposalApp.source = sourceOrigin;
            }

            if (campaignSource.utm_source) {
                $scope.proposalApp.utm_source = campaignSource.utm_source;
            }
            if (campaignSource.utm_medium) {
                $scope.proposalApp.utm_medium = campaignSource.utm_medium;
            }
            localStorageService.set("medicalFinalProposeForm", $scope.proposalApp);
            if ($scope.proposalApp.QUOTE_ID) {
                RestAPI.invoke("submitHealthProposal", $scope.proposalApp).then(function (proposeFormResponse) {

                    if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {

                        $scope.proposalId = proposeFormResponse.data.proposalId;
                        // added to get the encrypted proposal id 
                        $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                        localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);

                        $scope.responseToken = proposeFormResponse.data;
                        $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.health;
                        $scope.responseToken.QUOTE_ID = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
                       
                        localStorageService.set("medicalReponseToken", $scope.responseToken);
                        getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.paymentService, $scope.responseToken, function (paymentDetails) {
                            if (paymentDetails.responseCode == $scope.p365Labels.responseCode.success) {
                                $scope.paymentServiceResponse = paymentDetails.data;

                                //added by gauri for mautic application
                                if (imauticAutomation == true) {
                                    imatHealthProposal(localStorageService, $scope, 'MakePayment', function (shortURLResponse) {
                                });
                                }

                                //olark
                                if($scope.paymentServiceResponse.paramterList!=null)
                                     var paymentURLParamListLength = $scope.paymentServiceResponse.paramterList.length;
                               
                                for (var i = 0; i < paymentURLParamListLength; i++) {
                                    if ($scope.paymentServiceResponse.paramterList[i].name == 'SourceTxnId' && $scope.paymentServiceResponse.paramterList[i].ngModel == 'SourceTxnId') {
                                        olarkCustomParam($scope.paymentServiceResponse.paramterList[i].value, $scope.p365Labels.businessLineType.health, '', 'proposal');
                                    }
                                }
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
                                //added by gauri for imautic
                                if (imauticAutomation == true) {
                                    imatEvent('ProposalFailed');
                                }
                                $scope.loading = false;
                                $scope.disablePaymentButton = false;
                                var buyScreenCnfrmError = paymentDetails.responseCode + " : " + $scope.p365Labels.validationMessages.buyScreenCnfrmError.replace("INSURER_NAME", $scope.selectedProduct.insuranceCompany);
                                $rootScope.P365Alert("Policies365", buyScreenCnfrmError, "Ok");
                            }
                        });
                    } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error) {
                        $scope.loading = false;
                        $scope.disablePaymentButton = false;
                        $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                    } else {
                        $scope.loading = false;
                        $scope.disablePaymentButton = false;
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

        $rootScope.signout = function () {
            $rootScope.userLoginStatus = false;
            var userLoginInfo = {};
            userLoginInfo.username = undefined;
            userLoginInfo.status = $rootScope.userLoginStatus;
            localStorageService.set("userLoginInfo", userLoginInfo);
            $location.path("/quote");
        };

        $scope.missionCompled = function () {
            $scope.loading = false;
        };

        /*----- iPOS+ Functions-------*/
        $scope.sendProposalEmail = function () {
            var proposalDetailsEmail = {};
            proposalDetailsEmail.paramMap = {};
            proposalDetailsEmail.funcType = $scope.p365Labels.functionType.proposalDetailsTemplate;
            proposalDetailsEmail.isBCCRequired = 'Y';
            proposalDetailsEmail.username = $scope.proposalApp.proposerInfo.contactInfo.emailId.trim();
            proposalDetailsEmail.paramMap.customerName = $scope.proposalApp.proposerInfo.personalInfo.firstName.trim() + " " + $scope.proposalApp.proposerInfo.personalInfo.lastName.trim();
            proposalDetailsEmail.paramMap.selectedPolicyType = $scope.p365Labels.insuranceType.health;
            proposalDetailsEmail.paramMap.quoteId = $scope.responseToken.QUOTE_ID;
            proposalDetailsEmail.paramMap.premiumAmount = String($scope.selectedProduct.annualPremium);
            proposalDetailsEmail.paramMap.docId = String($scope.responseToken.encryptedProposalId);
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

            if ($scope.savePersonalDetails) {
                if ($scope.proposalApp.proposalId) {
                    delete $scope.proposalApp['proposalId'];
                }
            }
            if ($scope.saveInsuredDetails) {
                if (localStorageService.get("proposalId")) {
                    $scope.proposalId = localStorageService.get("proposalId");
                    $scope.proposalApp.proposalId = $scope.proposalId;
                }
            }
            if ($scope.saveNomineeDetails) {
                if (localStorageService.get("proposalId")) {
                    $scope.proposalId = localStorageService.get("proposalId");
                    $scope.proposalApp.proposalId = $scope.proposalId;

                }
            }
            if ($scope.saveMedicalDetails) {
                if (localStorageService.get("proposalId")) {
                    $scope.proposalId = localStorageService.get("proposalId");
                    $scope.proposalApp.proposalId = $scope.proposalId;

                }
            }
            if (!$scope.saveProposal) {

                if (localStorageService.get("proposalId")) {
                    $scope.proposalId = localStorageService.get("proposalId");

                    $scope.proposalApp.proposalId = $scope.proposalId;
                }
            }
            $scope.proposalApp.insuranceCompany = $scope.selectedProduct.insuranceCompany;
            $scope.proposalApp.planName = $scope.selectedProduct.planName;
            $scope.proposalApp.carrierId = $scope.selectedProduct.carrierId;
            $scope.proposalApp.productId = Number($location.search().productId);
            $scope.proposalApp.planId = $scope.selectedProduct.planId;
            $scope.proposalApp.requestType = $scope.p365Labels.request.healthPropRequestType;
            $scope.proposalApp.carrierProposalStatus = false;
            if (!$rootScope.wordPressEnabled) {
                $scope.proposalApp.baseEnvStatus = baseEnvEnabled;
                $scope.proposalApp.source = sourceOrigin;
            } else {
                $scope.proposalApp.source = sourceOrigin;
            }

            $scope.proposalApp.QUOTE_ID = $scope.iposRequest.docId;
            $scope.loading = true;
            $scope.proposalApp.businessLineId = "4";
            if (!$scope.saveProposal) {

                $scope.proposalApp.isCleared = true;
                delete $scope.proposalApp.proposalId;
                if ($rootScope.agencyPortalEnabled) {
                    const localdata = JSON.parse(localStorage.getItem('finalLocalStorage'));
                    $scope.proposalApp.requestSource = sourceOrigin;
                    if (localdata) {
                        $scope.proposalApp.userName = localdata.username;
                        $scope.proposalApp.agencyId = localdata.agencyId;
                    }
                    if (campaignSource.utm_source) {
                        $scope.proposalApp.utm_source = campaignSource.utm_source;
                    }
                    if (campaignSource.utm_medium) {
                        $scope.proposalApp.utm_medium = campaignSource.utm_medium;
                    }
                }
                if ($scope.proposalApp.QUOTE_ID) {
                    RestAPI.invoke("submitHealthProposal", $scope.proposalApp).then(function (proposeFormResponse) {
                        if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.success) {
                            $scope.responseToken = proposeFormResponse.data;
                            $scope.responseToken.businessLineId = $scope.p365Labels.businessLineType.health;
                            $scope.responseToken.QUOTE_ID = $scope.iposRequest.docId;

                            $scope.proposalId = proposeFormResponse.data.proposalId;

                            // added to store the encrypted store prosal id 
                            $scope.encryptedProposalId = proposeFormResponse.data.encryptedProposalId;
                            localStorageService.set("proposalIdEncrypted", $scope.encryptedProposalId);
                            localStorageService.set("medicalReponseToken", $scope.responseToken);

                            //added by gauri for mautic application
                            if (imauticAutomation == true) {
                                // imatHealthProposal(localStorageService, $scope, 'SubmitProposal');
                                imatHealthProposal(localStorageService, $scope, 'SubmitProposal', function (shortURLResponse) {
                                    if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                        $scope.shortURLResponse = shortURLResponse;
                                        console.log('$scope.shortURLResponse in medical buy product is:', $scope.shortURLResponse)
                                        $scope.sendProposalEmail();
                                    } else {
                                        console.log(shortURLResponse.message);
                                        $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                        $scope.loading = false;
                                    }
                    
                                });
                            } else {
                                var body = {};
                                body.longURL = sharePaymentLink + String($scope.responseToken.encryptedProposalId) + "&lob=" + String($scope.p365Labels.businessLineType.health);
                                $http({ method: 'POST', url: getShortURLLink, data: body }).
                                    success(function (shortURLResponse) {
                                        if (shortURLResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                            $scope.shortURLResponse = shortURLResponse;
                                            $scope.sendProposalEmail();
                                            //code for sending SMS Link to customer - commented as discussed with Srikanth
                                            // 		var proposalDetailsSMS = {};
                                            // 		proposalDetailsSMS.paramMap = {};
                                            // 		proposalDetailsSMS.funcType = "SHAREPROPOSAL";
                                            // proposalDetailsSMS.paramMap.customerName =  $scope.proposalApp.proposerInfo.personalInfo.firstName.trim() + " " + $scope.proposalApp.proposerInfo.personalInfo.lastName.trim();
                                            // 		proposalDetailsSMS.paramMap.premiumAmount = String($scope.selectedProduct.grossPremium);
                                            // 		proposalDetailsSMS.paramMap.docId = String($scope.responseToken.proposalId);
                                            // 		proposalDetailsSMS.paramMap.LOB = String($scope.p365Labels.businessLineType.health);
                                            // proposalDetailsSMS.mobileNumber = $scope.proposalApp.proposerInfo.contactInfo.mobileNumber;
                                            // 		proposalDetailsSMS.paramMap.url = shortURLResponse.data.shortURL;
                                            // 		RestAPI.invoke($scope.p365Labels.transactionName.sendSMS, proposalDetailsSMS).then(function (smsResponse) {
                                            // 			if (smsResponse.responseCode == $scope.p365Labels.responseCode.success) {
                                            // 				$scope.smsResponseError = "";
                                            // 				//$scope.modalOTP = true;		
                                            // 			} else if (smsResponse.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                                            // 				$scope.smsResponseError = smsResponse.message;
                                            // 				//$scope.modalOTPError = true;
                                            // 			} else {
                                            // 				$scope.smsResponseError = $scope.p365Labels.errorMessage.createOTP;
                                            // 				//$scope.modalOTPError = true;
                                            // 			}

                                            // 		});
                                            // });
                                        } else {
                                            $rootScope.P365Alert("Policies365", $scope.p365Labels.errorMessage.emailSentFailed, "Ok");
                                            $scope.loading = false;
                                        }
                                    });

                            }


                        } else if (proposeFormResponse.responseCode == $scope.p365Labels.responseCode.error) {
                            $scope.loading = false;
                            $scope.disablePaymentButton = false;
                            $rootScope.P365Alert("Error", proposeFormResponse.data, "Ok");
                        } else {
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
            if ($scope.redirectForPayment == true) {
                $scope.redirectToPaymentGateway();
            }
        }

        $scope.hideModalAP = function () {
            $scope.modalAP = false;
        };

        /*----- iPOS+ Functions Ends -------*/

        /*----- iPOS+ Code Starts -------*/
        $scope.selectedProduct = localStorageService.get("healthSelectedProduct");
        $scope.iposRequest = {};
        //$scope.iposRequest.docId = $location.search().quoteId;
        $scope.iposRequest.docId = localStorageService.get("HEALTH_UNIQUE_QUOTE_ID");
        $scope.iposRequest.carrierId = $scope.selectedProduct.carrierId;
        $scope.iposRequest.planId = $scope.selectedProduct.planId;
        if (!$rootScope.wordPressEnabled) {
            //$http.get(wp_path + 'ApplicationLabels.json').then(function (applicationCommonLabels) {
            //$scope.globalLabel = applicationCommonLabels.data.globalLabels;
            $scope.p365Labels = healthProposalLabels;
            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
            // localStorageService.set("applicationLabels", applicationCommonLabels.data);
            $scope.userGeoDetails = {};
            RestAPI.invoke("quoteDataReader", $scope.iposRequest).then(function (quoteData) {
                if (quoteData.responseCode == $scope.p365Labels.responseCode.success) {
                    $scope.quoteInfo = quoteData.data;
                    $scope.selectedProductInputParamForPin = angular.copy($scope.quoteInfo.quoteRequest)
                    $scope.selectedProductInputParam = $scope.quoteInfo.quoteRequest;
                    $scope.quoteCalcResponse = $scope.quoteInfo.quoteResponse;

                    for (var j = 0; j < $scope.quoteCalcResponse.length; j++) {
                        $scope.quoteCalcResponse[j].id = (j + 1);
                    }

                    for (var i = 0; i < $scope.quoteCalcResponse.length; i++) {
                        if ($scope.quoteCalcResponse[i].carrierId == $scope.iposRequest.carrierId &&
                            $scope.quoteCalcResponse[i].planId == $scope.iposRequest.planId) {
                            $scope.premiumDetails.selectedProductDetails = $scope.quoteCalcResponse[i];
                            $scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;
                            break;
                        }
                    }

                    $scope.changeInsuranceCompany = function () {
                        // reloading same page for updating form validations and carrier specific fields  -- Akash K.
                        $location.path('/buyHealth').search({ quoteId: localStorageService.get("HEALTH_UNIQUE_QUOTE_ID"), carrierId: $scope.premiumDetails.selectedProductDetails.carrierId, productId: $scope.premiumDetails.selectedProductDetails.planId, lob: localStorageService.get("selectedBusinessLineId") });
                        /*$scope.selectedProduct = $scope.premiumDetails.selectedProductDetails;*/
                    }

                    var buyScreenParam = {};
                    buyScreenParam.documentType = "proposalScreenConfig";
                    buyScreenParam.carrierId = Number($scope.iposRequest.carrierId);
                    buyScreenParam.businessLineId = Number($scope.p365Labels.businessLineType.health);
                    buyScreenParam.productId = Number($scope.iposRequest.planId);

                    $scope.userGeoDetails.area = $scope.quoteInfo.quoteRequest.personalInfo.displayArea;
                    $scope.userGeoDetails.pincode = $scope.quoteInfo.quoteRequest.personalInfo.pincode;
                    $scope.userGeoDetails.state = $scope.quoteInfo.quoteRequest.personalInfo.state;
                    $scope.userGeoDetails.city = $scope.quoteInfo.quoteRequest.personalInfo.city;

                    localStorageService.set("healthSelectedProduct", $scope.selectedProduct);

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
                            $scope.redirectUrl = buyScreens.redirectSuccessUrl;
                            $scope.requestFormat = buyScreens.requestFormat;
                            $scope.transactionName = buyScreens.transaction.proposalService.name;
                            //commented by Dany-discussed with Pravin
                            // buyScreenParam.documentType = "HealthPlan";
                            // getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.getPlanRiders, buyScreenParam, function(buyScreenRiders) {
                            //     if (buyScreenRiders.responseCode == $scope.p365Labels.responseCode.success) {
                            //         $scope.buyScreenRiders = buyScreenRiders.data;
                            //     }
                            var occupationDocId = $scope.p365Labels.documentType.healthOccupation + "-" + $scope.selectedProduct.carrierId + "-" + $scope.selectedProduct.planId;
                            getDocUsingId(RestAPI, occupationDocId, function (occupationList) {
                                $scope.occupationList = occupationList.Occupation;
                                getListFromDB(RestAPI, "", $scope.p365Labels.documentType.healthCarrier, $scope.p365Labels.request.findAppConfig, function (carrierList) {
                                    if (carrierList.responseCode == $scope.p365Labels.responseCode.success) {
                                        $scope.carrierList = carrierList.data;
                                        var docId = $scope.p365Labels.documentType.buyScreen + "-" + Number($scope.selectedProductInputParam.quoteParam.quoteType);
                                        getDocUsingId(RestAPI, docId, function (buyScreenTooltip) {
                                            $scope.buyTooltip = buyScreenTooltip.toolTips;
                                            $scope.init();
                                            $scope.initHealthBuyScreen();
                                            $scope.initWatch();

                                        });
                                    } else {
                                        $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.iposFormErrorMsg, "Ok");
                                    }
                                });
                            });
                            // });
                        } else {
                            $scope.loading = false;
                            $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.iposFormErrorMsg, "Ok");
                        }
                    });
                } else {

                    $rootScope.P365Alert("Policies365", $scope.p365Labels.validationMessages.iposFormErrorMsg, "Ok");
                }
            });
            //}); /*----- iPOS+ Code Ends -------*/
        } else {
            //var applicationLabels = localStorageService.get("applicationLabels");
            //$scope.globalLabel = applicationLabels.globalLabels;
            $scope.p365Labels = healthProposalLabels;
            $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");
            $rootScope.loaderContent = { businessLine: '4', header: 'Health Insurance', desc: $sce.trustAsHtml($scope.p365Labels.common.proverbBuyProduct) };
            $rootScope.title = $scope.p365Labels.policies365Title.medicalBuyQuote;
            $scope.selectedProductInputParamForPin = angular.copy(localStorageService.get("healthQuoteInputParamaters"));
            $scope.selectedProductInputParam = localStorageService.get("healthQuoteInputParamaters");
            $scope.userGeoDetails = localStorageService.get("commAddressDetails");
            $scope.occupationList = localStorageService.get("healthBuyOccupationList");
            $scope.carrierList = localStorageService.get("carrierList");
            //commented by Dany-checked with Pravin
            // $scope.buyScreenRiders = localStorageService.get("buyScreenRiders");
            $scope.buyTooltip = localStorageService.get("buyScreenTooltip");
            var buyScreens = localStorageService.get("buyScreen");

            $scope.proposalDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[0].template);
            $scope.insurerInfoTemplate = $sce.trustAsHtml(buyScreens.templates[1].template);
            $scope.nomineeInfoTemplate = $sce.trustAsHtml(buyScreens.templates[2].template);
            $scope.medicalInfoTemplate = $sce.trustAsHtml(buyScreens.templates[3].template);
            $scope.prevPolicyDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[4].template);
            $scope.personalIdDetailsTemplate = $sce.trustAsHtml(buyScreens.templates[5].template);

            $scope.productValidation = buyScreens.validation;
            $scope.redirectUrl = buyScreens.redirectSuccessUrl;
            $scope.requestFormat = buyScreens.requestFormat;
            $scope.transactionName = buyScreens.transaction.proposalService.name;

            $scope.init();
            $scope.initHealthBuyScreen();
            $scope.initWatch();
            $scope.OTPFlag = $scope.productValidation.OTPFlag;
            //for hdfc :accepted PreExisting disease
            if ($scope.productValidation.acceptedPreExistDisease) {

                $scope.proposalApp.acceptedPreExistDisease = {};
                $scope.proposalApp.acceptedPreExistDisease.applicable = "false";
            }
            if ($scope.productValidation.individualFloaterPlan) { //added for future generali,if family floater plan if insured member is married not allowing to purchase policy
                if ($scope.proposalApp.proposerInfo.personalInfo.martialStatus == "MARRIED")
                    $scope.modalIndividualFloaterPlan = true;
            }
        }

        // setTimeout(function () {

        // 	var baseTop = $("div#sticky").offset().top;
        // 	$(window).scroll(function () {
        // 		var top = $(window).scrollTop();
        // 		if (top >= baseTop) {
        // 			$("div#sticky").css({
        // 				"position": "fixed",
        // 				"top": "0px", "width": "22%"
        // 			});
        // 		} else if (top < baseTop) {
        // 			$("div#sticky").css({
        // 				"position": "",
        // 				"top": "",
        // 				"width": "100%"
        // 			});
        // 		}
        // 	});

        // }, 1000);
        // // Hide the footer navigation links.
        // $(".activateFooter").hide();
        // $(".activateHeader").hide();

    }]);