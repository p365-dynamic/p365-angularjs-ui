
    /*
 * Description	: This file is responsible for capture all the details from entire profession wise Journey.
 * Author		: Akash Kumawat
 * Date			: 08-Jan-2019
 *
 * */
'use strict';
angular.module('professionalJourney', ['CoreComponentApp', 'LocalStorageModule', 'ngMessages'])
    .controller('professionalJourneyController', ['RestAPI', '$scope', '$rootScope', '$location', '$http', 'localStorageService', '$timeout', '$sce', '$filter', '$controller', '$anchorScroll', function (RestAPI, $scope, $rootScope, $location, $http, localStorageService, $timeout, $sce, $filter, $controller, $anchorScroll) {
        $controller('motorController', { $scope: $scope, $rootScope: $rootScope });

        $scope.declaration = function () {
            /*All the required objects & variable declaration starts here
             * ex. $scope.personalInfo = true;
             * 	   $scope.profession = {} ;
             * */
            $scope.p365Labels = commonResultLabels
            $scope.termAndConditions = termAndConditions;
            $scope.privacyPolicy = privacyPolicy;
            $scope.agentName = "Mia";
            $scope.personalInfo = false;
            $scope.incomeInfo = false;
            $scope.familyInfo = false;
            $scope.showMoreProfession = false;
            $scope.isAgeApplicable = true;
            $rootScope.showRecommendedRider = false;
            $rootScope.isProfessionalJourneySelected = false;
            $scope.specializationFlag = false;
            $scope.LiabilityFlag = false; 
            $scope.showOtpButton = true;
            $scope.disableContact = false;

            $scope.globalLabel = {};
            $scope.commonInfo = {};
            $scope.commonInfo.familyHistory = [];
            $scope.vehicleDetails = {};
            $scope.slideConfig = {};
            $scope.slideConfig.slides = [];
            $scope.addressDetails = {
                "streetDetails": "",
                "city": "",
                "state": "",
                "pincode": "",
                "displayArea": "",
                "address": ""
            };
            $scope.commonInfo.address = $scope.addressDetails;
            $scope.commonInfo.termsCondition = true;
            $scope.healthInfo = {};
            $scope.selectedFamilyMember = [];

            $scope.progress = 0;
            $scope.commonInfo.gender = 'Male';
            //added for health product journey
            $rootScope.insuredGender = $scope.commonInfo.gender;
            $scope.commonInfo.salutation = 'Mr';
            /*All the required variable declaration ends here*/

            /*All the required simple & generic array declaration starts here
             * ex. $scope.professionList = [];
             * */
            $scope.professionList = [];
            $scope.incomeRsangeList = [];
            $scope.family = [];
            $scope.ageList = [];
            $scope.professionSpecializationList = [];
            $scope.professionalLiabilityList = [];
            $scope.diseaseList = [];
            $scope.weightStatus = [];
            $scope.dailyActivityStatus = [];
            $scope.ngoList = [];
            $scope.homeOwnershipList = [];
            $scope.clinicOwnershipList = [];
            /*All the required simple & generic array  declaration ends here*/
        }
       
        $scope.setEditProfile = function (_status) {
            $rootScope.editProfile = _status;
        }

        $scope.askMia = function (_question, _answer) {
            $scope.miaTimeout = false;
            if (_question == -1) {
                _answer.currentQuestionCode = _answer.professionCode + "000";
            } else {
                _answer.currentQuestionCode = $scope.slideConfig.slides[_question].quesId;
            }

            RestAPI.invoke("miaassistmentinfo", _answer).then(function (miaAnswer) {
                if (miaAnswer.responseCode == 1000) {

                    $scope.miaAnswer = miaAnswer.data;
                    $timeout(function () {
                        $scope.miaTimeout = true;
                    }, 5000);
                } else {
                    $scope.miaAnswer = undefined;
                }
            });
        }

        $scope.initConfimationScreen = function () {
            $scope.bikeDetails = localStorageService.get("selectedBikeDetails");
            $scope.carDetails = localStorageService.get("selectedCarDetails");

            if ($scope.bikeDetails) {
                if ($scope.bikeDetails.showBikeRegAreaStatus) {
                    $rootScope.showBikeRegAreaStatus = $scope.bikeDetails.showBikeRegAreaStatus;
                } else {
                    $rootScope.showBikeRegAreaStatus = true;
                }
            }
            if ($scope.carDetails) {
                if ($scope.carDetails.showCarRegAreaStatus) {
                    $rootScope.showCarRegAreaStatus = $scope.carDetails.showCarRegAreaStatus;
                } else {
                    $rootScope.showCarRegAreaStatus = false;
                }
            }

            if (localStorageService.get("professionalQuoteParams")) {
                var professionalQuoteParams = localStorageService.get("professionalQuoteParams");
                $scope.carInfo = professionalQuoteParams.carInfo;
                $scope.bikeInfo = professionalQuoteParams.bikeInfo;
                $scope.commonInfo = professionalQuoteParams.commonInfo;
                if (professionalQuoteParams.healthInfo) {
                    $scope.healthInfo = professionalQuoteParams.healthInfo;
                }
                if ($scope.commonInfo.incomeRange) {
                    $rootScope.incomeAbsoluteValue = $scope.commonInfo.incomeRange.absoluteValue;
                }
                if ($scope.commonInfo.ngo) {
                    $rootScope.ngoName = $scope.commonInfo.ngo.name;
                }

            }
            $scope.addressDetails = localStorageService.get("commAddressDetails");
            $scope.profession = localStorageService.get("profession");
        }

        //code check for spez and liability
        $scope.checkSpecz = function () {
            if ($scope.specializationFlag == false) {
                $scope.commonInfo.specialization = "";
                $rootScope.specialization = "";
            }
        }
        $scope.checkLiab = function () {
            if ($scope.LiabilityFlag == false) {
                $scope.commonInfo.professionalLiability = "";
                $scope.commonInfo.clinicStatus = "";
                $rootScope.professionalLiability = "";
            }
        }

        $scope.getProfessionsQuestionList = function (profession) {
            var searchData = {};
            searchData.documentType = "ProfessionQuestion";
            searchData.professionName = profession.professionName;
            searchData.professionCode = profession.professionCode;
            $scope.progressLimit = 0;
            $scope.slideConfig = {};
            $scope.slideConfig.slides = [];

            getDocUsingParam(RestAPI, "getProfessionsQuestions", searchData, function (professionQuestionList) {
              if (professionQuestionList != null && String(professionQuestionList) != "undefined") {
                    $scope.slideConfig.slides = professionQuestionList.data;
                    var _length = $scope.slideConfig.slides.length;
                    for (var index = 0; index < _length; index++) {
                        if ($scope.slideConfig.slides[index].slideKey == "confirmation") {
                            $scope.progressLimit = index;
                        }
                    }

                    for (var i = 0; i < $scope.slideConfig.slides.length; i++) {
                        if ($scope.slideConfig.slides[i].slideKey == "specialisation") {
                            $scope.specializationFlag = true;
                            $scope.checkSpecz();
                        }
                        if ($scope.slideConfig.slides[i].slideKey == "personalLibility") {
                            $scope.LiabilityFlag = true;
                            $scope.checkLiab();
                        }
                    }
                    if ($rootScope.editProfile) {
                        $scope.initConfimationScreen();
                        $scope.updateSlideStatusByKey("confirmation");
                    } else if ($rootScope.editCarDetails) {
                        $scope.updateSlideStatusByKey("carRTO");
                    } else if ($rootScope.editBikeDetails) {
                        $scope.updateSlideStatusByKey("bikeRTO");
                    } else if ($rootScope.editFamilyDetails) {
                        $scope.updateSlideStatusByKey("familyDetails");
                    } else {

                        $scope.updateSlideStatusByIndex(0);
                    }
                }
            });
        }


        function getLocationDetails() {
            var mapCords = {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 18
            }
            var map = new google.maps.Map(document.getElementById("mapViewer"), mapCords);
        }

        $scope.getCoordinates = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(getLocationDetails);
            } else {
                var position = undefined;
                getLocationDetails(position);
            }
        }


        $scope.validateAnswer = function (answerNode) {
            if (answerNode && answerNode.skipTo) {
                $scope.skipTo = answerNode.skipTo;
                $scope.skippedFrom = answerNode.skippedFrom;
                for (let index = 0; index < answerNode.skippedParams.length; index++) {
                    const element = answerNode.skippedParams[index];

                    $scope.commonInfo[element] = "";
                }
            } else {
                $scope.skipTo = null;
                $scope.skippedFrom = null;
            }
        }

        $scope.updateSlideStatusByIndex = function (currentStatus) {

            if (currentStatus != null && currentStatus != undefined) {
                $scope.slideStatus = {};
                $scope.slideStatus.isFirst = false;
                $scope.slideStatus.isLast = false;
                if (currentStatus == 0) {
                    $scope.slideStatus.isFirst = true;
                    $scope.slideStatus.current = Number(currentStatus);
                    $scope.slideStatus.next = Number(currentStatus + 1);
                }
                if (currentStatus >= 1 && currentStatus < $scope.slideConfig.slides.length) {
                    $scope.slideStatus.prev = Number(currentStatus - 1);
                    $scope.slideStatus.current = Number(currentStatus);
                    $scope.slideStatus.next = Number(currentStatus + 1);
                }
                if (currentStatus == ($scope.slideConfig.slides.length)) {
                    $scope.slideStatus.isLast = true;
                    $scope.slideStatus.prev = Number(currentStatus - 1);
                    $scope.slideStatus.current = Number(currentStatus);
                }
                $scope.slideClass = 'slide-left'
            } else if (currentStatus == null) {
                console.error("Slide status is not updated caused by Order is null");
            } else if (currentStatus == "") {
                console.error("Slide status is not updated caused by Order is empty");
            } else if (currentStatus == undefined) {
                console.error("Slide status is not updated caused by Order is undefined");
            }
        }

        $scope.updateSlideStatusByKey = function (_key) {

            if (_key != null && _key != "" && _key != undefined) {
                var _length = $scope.slideConfig.slides.length;
                for (var index = 0; index < _length; index++) {
                    if ($scope.slideConfig.slides[index].slideKey == _key) {
                        $scope.updateSlideStatusByIndex(index);
                        break;
                    }
                }
            } else if (currentStatus == null) {
                console.error("Slide status is not updated caused by KEY is null");
            } else if (currentStatus == "") {
                console.error("Slide status is not updated caused by KEY is empty");
            } else if (currentStatus == undefined) {
                console.error("Slide status is not updated caused by KEY is undefined");
            }
        }

        $scope.prev = function () {
            $scope.showOtpButton = true;
            $scope.askMia(Number($scope.slideStatus.prev), $scope.quoteRequest);
            if ($scope.skippedFrom) {
                $scope.updateSlideStatusByKey($scope.skippedFrom);
                $scope.skipTo = null;
                $scope.skippedFrom = null;
            } else {
                $scope.updateSlideStatusByIndex($scope.slideStatus.prev);
            }
            $scope.slideClass = 'slide-right';
        }

        $scope.next = function () {
            $scope.updateSlideStatusByIndex($scope.slideStatus.next);
            $scope.slideClass = 'slide-left'
        }

        $scope.professionSelects = function (profession) {
            if (profession) {
                $scope.quoteRequest = {};
                $scope.profession = profession;
                localStorageService.set("profession", $scope.profession);
                $scope.personalInfo = true;
                $scope.quoteRequest.professionId = profession.professionId;
                $scope.quoteRequest.profession = profession.professionName;
                $scope.quoteRequest.professionCode = profession.professionCode;
                $scope.getProfessionsQuestionList(profession);
            }
        }
        $scope.updateProgress = function (currentStage) {
            $scope.progress = (((currentStage + 1) * 100) / ($scope.progressLimit));
        }

        $scope.moreProfessions = function () {
            $scope.showMoreProfession = true;
        }

        $scope.getMoreProfessionsList = function (query) {
            var filteredProfessions = [];
            angular.forEach($scope.professionList, function (value) {
                if (filteredProfessions.length <= 5) {
                    if (value.professionName.toLowerCase().includes(query.toLowerCase())) {
                        filteredProfessions.push(value);
                    }
                }
            });
            return filteredProfessions;
        }

        $scope.skipCarDetails = function (slideIndex) {
            $anchorScroll('home');
            $scope.carInfo = {};
            $scope.carDetails = {};
            $scope.carDetails.showCarRegAreaStatus = false;
            $scope.carVehicleInfo = {};
            $scope.selectedCar.displayVehicle = "";
            localStorageService.removeRecord("carQuoteInputParamaters");
            localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
            $scope.updateSlideStatusByIndex(slideIndex + 1);
        }

        $scope.skipBikeDetails = function (slideIndex) {
            $anchorScroll('home');
            $scope.bikeInfo = {};
            $scope.bikeDetails = {};
            $scope.bikeDetails.showBikeRegAreaStatus = true;
            $scope.bikeVehicleInfo = {};
            $scope.selectedBike.displayVehicle = "";
            localStorageService.removeRecord("bikeQuoteInputParamaters");
            //localStorageService.set("bikeQuoteInputParamaters", undefined);
            localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
            $scope.updateSlideStatusByIndex(slideIndex + 1);
        }
        var count = 0;
        $scope.submitFormDetails = function (slideIndex, isUpdateReq) {
            $scope.showOtpButton  = true;
            $anchorScroll('home');
            $scope.quoteRequest.carInfo = $scope.carInfo;
            $scope.quoteRequest.bikeInfo = $scope.bikeInfo;
            if ($scope.commonInfo.gender == 'Male') {
                $scope.commonInfo.salutation = 'Mr';
            } else {
                $scope.commonInfo.salutation = 'Miss';
            }
            $('#wplc_name').val($scope.commonInfo.firstName);
            if ($rootScope.ngoName) {
                for (var i = 0; i < $scope.ngoList.length; i++) {
                    if ($scope.ngoList[i].name == $rootScope.ngoName) {
                        $scope.commonInfo.ngo = $scope.ngoList[i];
                        break;
                    }
                }
            }
            if ($rootScope.specialization) {
                $scope.commonInfo.specialization = angular.copy($rootScope.specialization.value);
            }
            if ($rootScope.professionalLiability) {
                $scope.commonInfo.professionalLiability = angular.copy($rootScope.professionalLiability.value);
            }

            $scope.quoteRequest.commonInfo = $scope.commonInfo;
            if ($scope.addressDetails) {
                localStorageService.set("commAddressDetails", $scope.addressDetails);
            }
            localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
            $scope.askMia(slideIndex, $scope.quoteRequest);

            if (isUpdateReq) {
                if ($scope.quoteRequest.healthInfo) {
                    $scope.healthInfo = $scope.quoteRequest.healthInfo;
                    if ($scope.healthInfo.selectedFamilyMembers) {
                        for (var i = 0; i < $scope.healthInfo.selectedFamilyMembers.length; i++) {
                            if ($scope.healthInfo.selectedFamilyMembers[i].relation.toUpperCase() == 'SELF') {
                                $scope.healthInfo.selectedFamilyMembers[i].gender = $scope.commonInfo.gender;
                                break;
                            }
                        }
                    }

                }
                if ($scope.commonInfo.familyComp) {
                    for (var i = 0; i < $scope.commonInfo.familyComp.length; i++) {
                        if ($scope.commonInfo.familyComp[i].relation.toUpperCase() == 'SELF') {
                            $scope.commonInfo.familyComp[i].gender = $scope.commonInfo.gender;
                            break;
                        }
                    }
                }
                $scope.setEditProfile(false);
                $scope.initConfimationScreen();
                $scope.updateSlideStatusByKey("confirmation");
            } else {
                if ($scope.skipTo) {
                    $scope.updateSlideStatusByKey($scope.skipTo);
                    $scope.skipTo = null;
                } else {
                    $scope.updateSlideStatusByIndex(slideIndex + 1);
                }

            }
        }

        // Method to get list of pincodes
        $scope.getPinCodeAreaList = function (searchValue) {
            var docType = "CityDetails";
            return $http.get(getSearchServiceLink + docType + "&q=" + searchValue).then(function (response) {
                return JSON.parse(response.data).data;
            });
        };


        $scope.onSelectPinOrArea = function (item) {
            $scope.addressDetails.pincode = item.pincode;
            $scope.addressDetails.city = item.city;
            $scope.addressDetails.state = item.state;
        }

        $scope.submitFamilyIncome = function (slideIndex, isUpdateReq) {
            $scope.showOtpButton = true; 
            if ($rootScope.incomeAbsoluteValue) {
                for (var i = 0; i < $scope.incomeRangeList.length; i++) {
                    if ($scope.incomeRangeList[i].absoluteValue == $rootScope.incomeAbsoluteValue) {
                        $scope.commonInfo.incomeRange = $scope.incomeRangeList[i];
                        break;
                    }
                }
                $scope.quoteRequest.commonInfo = $scope.commonInfo;
                localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                $scope.askMia(slideIndex, $scope.quoteRequest);
                if (isUpdateReq) {
                    $scope.setEditProfile(false);
                    $scope.initConfimationScreen();
                    $scope.updateSlideStatusByKey("confirmation");
                } else {
                    if ($scope.skipTo) {
                        $scope.updateSlideStatusByKey($scope.skipTo);
                        $scope.skipTo = null;
                    }
                    $scope.updateSlideStatusByIndex(slideIndex + 1);
                }
            }
        }

        $scope.submitFamilyDetails = function (slideIndex, isUpdateReq) {
            $anchorScroll('home');
            var current_Year = new Date().getFullYear();
            $scope.commonInfo.familyComp = [];
            $scope.healthInfo.selectedFamilyMembers = [];
            $scope.dieaseDetails = [];

            for (var i = 0; i < $scope.family.length; i++) {
                if ($scope.family[i].val) {
                    var member = {};
                    member.relation = $scope.family[i].member;
                    member.birthYear = $scope.family[i].birthYear;
                    member.display = $scope.family[i].member;
                    member.id = $scope.family[i].id;
                    member.salutation = $scope.family[i].gender == "M" ? "Mr" : "Ms";
                    member.existSince = "";
                    member.existSinceError = false;
                    member.status = false;
                    member.relationship = $scope.family[i].relationship;

                    if (current_Year == $scope.family[i].birthYear) {
                        member.age = calculateAgeByDOB("01/01/" + $scope.family[i].birthYear);
                        member.dob = "01/01/" + $scope.family[i].birthYear;
                        $scope.family[i].dob = "01/01/" + $scope.family[i].birthYear;
                    } else {
                        member.age = calculateAgeByDOB("01/07/" + $scope.family[i].birthYear);
                        member.dob = "01/07/" + $scope.family[i].birthYear;
                        $scope.family[i].dob = "01/07/" + $scope.family[i].birthYear;
                    }
                    //adding gender in $scope.commonInfo
                    if (member.relation.toUpperCase() == "SELF") {
                        $scope.commonInfo.age = member.age;
                        member.gender = $scope.commonInfo.gender;
                    }
                    $scope.family[i].age = member.age;
                    if (member.relation.toUpperCase() == "SPOUSE") {
                        if ($scope.commonInfo.gender == 'Male') {
                            member.gender = 'Female';
                        } else {
                            member.gender = 'Male';
                        }
                    } else {
                        if (member.relation.toUpperCase() != "SELF") {
                            if ($scope.family[i].gender == 'M') {
                                member.gender = 'Male';
                            } else {
                                member.gender = 'Female';
                            }
                        }
                    }
                    member.dieaseDetails = [];
                    $scope.commonInfo.familyComp.push(member);
                    $scope.healthInfo.selectedFamilyMembers.push(member);
                    $scope.commonInfo.familyMemberCount = $scope.commonInfo.familyComp.length;
                }
            }
            $scope.quoteRequest.commonInfo = $scope.commonInfo;

            localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
            $scope.askMia(slideIndex, $scope.quoteRequest);
            if (isUpdateReq) {
                $scope.setEditProfile(false);
                $scope.initConfimationScreen();
                $scope.updateSlideStatusByKey("confirmation");
            } else {
                if ($scope.skipTo) {
                    $scope.updateSlideStatusByKey($scope.skipTo);
                    $scope.skipTo = null;
                }
                $scope.updateSlideStatusByIndex(slideIndex + 1);
            }
        }

        $scope.submitLifeStyleDetails = function (slideIndex, isUpdateReq) {
            $anchorScroll('home');
            $scope.commonInfo.dailyActivity = $scope.dailyActivityStatus[$rootScope.dailyActivity].value;
            $scope.commonInfo.weight = $scope.weightStatus[$rootScope.weight].value;
            $scope.quoteRequest.commonInfo = $scope.commonInfo;
            localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
            $scope.askMia(slideIndex, $scope.quoteRequest);
            if (isUpdateReq) {
                $scope.setEditProfile(false);
                $scope.initConfimationScreen();
                $scope.updateSlideStatusByKey("confirmation");
            } else {
                if ($scope.skipTo) {
                    $scope.updateSlideStatusByKey($scope.skipTo);
                    $scope.skipTo = null;
                }
                $scope.updateSlideStatusByIndex(slideIndex + 1);
            }
        }

        $scope.addMember = function () {
            $scope.showAdditionalMembers = true;
        }

        $scope.$on("setCommAddressByAPI", function () {
            setTimeout(function () {
                var googleAddressObject = angular.copy($rootScope.chosenCommPlaceDetails);
                getAddressFields(googleAddressObject, function (fomattedAddress, formattedCity, formattedState, formattedPincode) {
                    if (formattedPincode) {
                        $scope.addressDetails.pincode = formattedPincode;
                    } else {
                        $scope.addressDetails.pincode = "";
                    }
                    if (fomattedAddress) {
                        $scope.addressDetails.streetDetails = (formattedPincode) ? fomattedAddress + "," + formattedPincode : fomattedAddress;
                        $scope.addressDetails.displayArea = fomattedAddress;
                    }
                    if (formattedState) {
                        $scope.addressDetails.state = formattedState;
                    } else {
                        $scope.addressDetails.state = "";
                    }
                    if (formattedCity) {
                        $scope.addressDetails.city = formattedCity;
                    } else {
                        $scope.addressDetails.city = "";
                    }
                    localStorageService.set("commAddressDetails", $scope.addressDetails);
                    $scope.$apply();
                });
            }, 10);
        });

        $scope.redirectToResult = function () {
            $location.path('/professionalJourneyResult');
        }

        $scope.createLead = function () {
            var leadInfo = {};
            var quoteParam = {};
            var contactInfo = {};
            if (messageIDVar) {
                contactInfo.messageId = messageIDVar;
            } else {
                contactInfo.messageId = '';
            }
            contactInfo.termsCondition = true;
            contactInfo.firstName = $scope.commonInfo.firstName;
            contactInfo.lastName = $scope.commonInfo.lastName;
            contactInfo.emailId = $scope.commonInfo.emailId;
            contactInfo.mobileNumber = $scope.commonInfo.mobileNumber;
            contactInfo.createLeadStatus = false;
            $('#wplc_email').val($scope.commonInfo.emailId);
            leadInfo.isProfessionalJourney = true;
            for (let index = 0; index < professionListForCRM.length; index++) {
                const element = professionListForCRM[index];
                if (element.index == $scope.quoteRequest.professionId) {
                    leadInfo.profession = professionListForCRM[index].value;
                }
            }
            $rootScope.isFromLeadForm = true;
            localStorageService.set("updateProdcutInCartFlag", true);
            localStorageService.set("policies365-application-version", APPLICATION_VERSION);

            quoteParam.documentType = "QuoteRequest";
            quoteParam.quoteType = "ProfessionalJourney";

            requestSource = "web";
            leadInfo.quoteParam = quoteParam;
            leadInfo.contactInfo = contactInfo;
            
            $scope.commonInfo.address = $scope.addressDetails;
            leadInfo.documentType = "professionalQuoteRequest";
            leadInfo.profession = $scope.profession.professionName;
            leadInfo.professionCode = $scope.profession.professionCode;
            leadInfo.professionId = $scope.profession.professionId;
            leadInfo.commonInfo = $scope.commonInfo;
            leadInfo.carInfo = $scope.carInfo;
            leadInfo.bikeInfo = $scope.bikeInfo;
            leadInfo.healthInfo = $scope.healthInfo;
            if ($scope.commonInfo.familyHistory) {
                leadInfo.commonInfo.diseaseCount = $scope.commonInfo.familyHistory.length;
            }

            localStorageService.set("quoteUserInfo", contactInfo);
            $scope.quoteUserInfo = contactInfo;
            RestAPI.invoke($scope.globalLabel.transactionName.createLead, leadInfo).then(function (leadCallback) {
                if (leadCallback.responseCode == $scope.globalLabel.responseCode.success) {
                    messageIDVar = leadCallback.data.messageId;
                    if (contactInfo.messageId != messageIDVar) {
                        // $rootScope.authenticated = false;
                    }
                }
                $scope.quoteRequest.documentType = "professionalQuoteRequest";
                $scope.quoteRequest.profession = $scope.profession.professionName;
                $scope.quoteRequest.professionCode = $scope.profession.professionCode;
                $scope.quoteRequest.professionId = $scope.profession.professionId;
                $scope.quoteRequest.commonInfo = $scope.commonInfo;
                $scope.quoteRequest.carInfo = $scope.carInfo;
                $scope.quoteRequest.bikeInfo = $scope.bikeInfo;
                $scope.quoteRequest.healthInfo = $scope.healthInfo;
                if ($scope.commonInfo.familyHistory) {
                    $scope.quoteRequest.commonInfo.diseaseCount = $scope.commonInfo.familyHistory.length;
                }
                localStorageService.set("selectedCarDetails", $scope.carDetails);
                localStorageService.set("selectedBikeDetails", $scope.bikeDetails);
                localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                localStorageService.set("selectedFamilyForHealth", $scope.family);
                $scope.redirectToResult();
            });
        }


        var numberSon = 1;
        var numberDaughter = 1;

        $scope.addNewSon = function (index) {
            for (var i = 0; i < $scope.family.length; i++) {
                if ($scope.family[i].member == "Son") {
                    numberSon = numberSon + 1;
                }
            }
            $scope.family[index].iconFlag = false;
            $scope.family.push({ 'member': 'Son', 'relation': 'SON', 'visible': true, 'age': 5, 'gender': 'M', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 82, iconFlag: true, 'count': numberSon });
        };

        $scope.addNewDaughter = function (index) {
            for (var i = 0; i < $scope.family.length; i++) {
                if ($scope.family[i].member == "Daughter") {
                    numberDaughter = numberDaughter + 1;
                }
            }
            $scope.family[index].iconFlag = false;
            $scope.family.push({ 'member': 'Daughter', 'relation': 'DAUGHTER', 'visible': true, 'age': 5, 'gender': 'F', 'relationship': 'CH', 'occupationClass': 2, 'val': true, 'other': false, 'mandatory': false, 'minAge': 1, 'maxAge': 25, iconFlag: true, 'count': numberDaughter });
        };

        $scope.addChild = function (data, index) {
            if (data.member == "Son") {
                $scope.addNewSon(index);
            }
            if (data.member == "Daughter") {
                $scope.addNewDaughter(index);
            }
        }

        $scope.isOnwed = function (status) {
            if (status.toLowerCase() == "own")
                return true;
            else
                return false;
        }

        //setting selected gender in health product journey 
        $scope.changeGender = function () {
            $rootScope.insuredGender = $scope.commonInfo.gender;
            if ($scope.commonInfo.gender == 'Male') {
                $scope.commonInfo.salutation = 'Mr';
            } else {
                $scope.commonInfo.salutation = 'Miss';
            }
        }
        $scope.fetchLocalStorageDetails = function () {

            if (localStorageService.get("professionalQuoteParams")) {
                $scope.quoteRequest = localStorageService.get("professionalQuoteParams");

            }
            if (localStorageService.get("selectedFamilyForHealth")) {
                $scope.family = localStorageService.get("selectedFamilyForHealth");
                if (localStorageService.get("healthQuoteInputParamaters")) {
                    $scope.quoteParam = localStorageService.get("healthQuoteInputParamaters").quoteParam;
                    $scope.personalInfo = localStorageService.get("healthQuoteInputParamaters").personalInfo;

                    if (localStorageService.get("professionalQuoteParams")) {
                        $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                        if ($scope.quoteRequest.healthInfo) {
                            $scope.healthInfo = $scope.quoteRequest.healthInfo;
                        } else {
                            $scope.healthInfo = {};
                        }
                    } else {
                        $scope.quoteRequest = {};
                        $scope.quoteRequest.healthInfo = {};
                        $scope.quoteRequest.commonInfo = {};
                        $scope.healthInfo = {};
                        $scope.commonInfo = $scope.quoteRequest.commonInfo;
                    }
                    if ($scope.personalInfo.selectedFamilyMembers) {
                        $scope.healthInfo.selectedFamilyMembers = [];
                        for (var i = 0; i < $scope.personalInfo.selectedFamilyMembers.length; i++) {
                            $scope.healthInfo.selectedFamilyMembers.push({
                                "gender": $scope.personalInfo.selectedFamilyMembers[i].gender,
                                "dob": $scope.personalInfo.selectedFamilyMembers[i].dob,
                                "display": $scope.personalInfo.selectedFamilyMembers[i].display,
                                "existSince": $scope.personalInfo.selectedFamilyMembers[i].existSince,
                                "id": $scope.personalInfo.selectedFamilyMembers[i].id,
                                "salutation": $scope.personalInfo.selectedFamilyMembers[i].salutation,
                                "relationship": $scope.personalInfo.selectedFamilyMembers[i].relationship,
                                "age": $scope.personalInfo.selectedFamilyMembers[i].age,
                                "existSinceError": $scope.personalInfo.selectedFamilyMembers[i].existSinceError,
                                "status": $scope.personalInfo.selectedFamilyMembers[i].status,
                                "relation": $scope.personalInfo.selectedFamilyMembers[i].relation
                            });
                        }
                    }

                    if ($scope.quoteRequest.commonInfo) {
                        $scope.commonInfo = $scope.quoteRequest.commonInfo;
                        if ($scope.quoteParam.selfGender == 'M' || $scope.quoteParam.selfGender == 'Male') {
                            $scope.commonInfo.gender = 'Male';
                        } else {
                            $scope.commonInfo.gender = 'Female';
                        }
                        $scope.quoteRequest.commonInfo = $scope.commonInfo;
                        $scope.changeGender();
                        localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
                    }
                }

                //retrieving birthYear from dob
                for (var i = 0; i < $scope.family.length; i++) {
                    if ($scope.family[i].val && $scope.family[i].dob) {
                        var tempDOB = $scope.family[i].dob.split("/");
                        $scope.family[i].birthYear = tempDOB[2];
                    }
                }
            }
            if (localStorageService.get("lifeQuoteInputParamaters")) {
                $scope.quoteParam = localStorageService.get("lifeQuoteInputParamaters").quoteParam;
                if (localStorageService.get("professionalQuoteParams")) {
                    $scope.quoteRequest = localStorageService.get("professionalQuoteParams");
                    if ($scope.quoteRequest.commonInfo) {
                        $scope.commonInfo = $scope.quoteRequest.commonInfo;
                        //$scope.commonInfo.smoking = $scope.quoteParam.tobacoAdicted;
                        $scope.commonInfo.age = $scope.quoteParam.age;
                        if ($scope.quoteParam.tobacoAdicted == 'Y') {
                            $scope.commonInfo.smoking = true;
                        } else {
                            $scope.commonInfo.smoking = false;
                        }
                    }
                } else {
                    $scope.quoteRequest = {};
                    $scope.quoteRequest.commonInfo = {};
                    $scope.commonInfo = $scope.quoteRequest.commonInfo;
                }

                if ($scope.quoteParam.gender) {
                    if ($scope.quoteParam.gender == 'M' || $scope.quoteParam.gender == 'Male') {
                        $scope.commonInfo.gender = 'Male';
                    } else {
                        $scope.commonInfo.gender = 'Female';
                    }
                    $scope.changeGender();
                }

                $scope.quoteRequest.commonInfo = $scope.commonInfo;

                localStorageService.set("professionalQuoteParams", $scope.quoteRequest);
            }
        }
        $scope.initialisation = function () {
            //added for wordPress
            if (wordPressEnabled) {
                $rootScope.wordPressEnabled = wordPressEnabled;
                $rootScope.wp_path = wp_path;
            } else {
                $rootScope.wp_path = '';
            }

            $scope.getCoordinates();
            //object initializing with generic values; 
            $scope.incomeRangeList = annualIncomesGeneric;
            $scope.family = healthFamilyListGeneric;
            $scope.family.forEach(function (healthFamilyListGeneric) {
                healthFamilyListGeneric.dob = calcDOBFromAge(healthFamilyListGeneric.age);
            });
            $scope.ageList = ageList;
            if ($scope.profession.professionCode == "DR") {
                $scope.professionSpecializationList = drProfessionSpecializationList;
                $scope.professionalLiabilityList = drProfessionalLiabilityList;
            } else if ($scope.profession.professionCode == "IT") {
                $scope.professionSpecializationList = itProfessionSpecializationList;
                $scope.professionalLiabilityList = itProfessionalLiabilityList;
            } else if ($scope.profession.professionCode == "CA") {
                $scope.professionSpecializationList = caProfessionSpecializationList;
                $scope.professionalLiabilityList = caProfessionalLiabilityList;
            } else if ($scope.profession.professionCode == "ECOMM") {
                $scope.professionSpecializationList = retailProfessionSpecializationList;
                $scope.professionalLiabilityList = retailProfessionLiabilityList;
            } else if ($scope.profession.professionCode == "SELFEMP") {
                $scope.professionSpecializationList = freelancerProfessionSpecializationList;
                $scope.professionalLiabilityList = freelancerProfessionLiabilityList;
            } else if ($scope.profession.professionCode == "EDUT") {
                $scope.professionSpecializationList = educatorProfessionSpecializationList;
                $scope.professionalLiabilityList = educatorProfessionLiabilityList;
            } else if ($scope.profession.professionCode == "GOVT") {
                $scope.professionSpecializationList = govtProfessionSpecializationist;
            } else if ($scope.profession.professionCode == "HOSP") {
                $scope.professionSpecializationList = hospitalityProfessionSpecializationList;
                $scope.professionalLiabilityList = hospitalityProfessionLiabilityList;
            } else if ($scope.profession.professionCode == "LAW") {
                $scope.professionSpecializationList = legalProfessionSpecializationList;
                $scope.professionalLiabilityList = legalProfessionLiabilityList;
            } else if ($scope.profession.professionCode == "MANU") {
                $scope.professionSpecializationList = manufacturingProfessionSpecializationList;
            } else if ($scope.profession.professionCode == "REAL") {
                $scope.professionSpecializationList = realEstateProfessionSpecializationList;
                $scope.professionalLiabilityList = realEstateProfessionLiabilityList;
            } else if ($scope.profession.professionCode == "ARMY") {
                $scope.professionSpecializationList = armedForcesProfessionSpecializationList;
            } else {
                $scope.professionSpecializationList = drProfessionSpecializationList;
                $scope.professionalLiabilityList = drProfessionalLiabilityList;
            }


            $scope.diseaseList = diseaseList;
            $scope.weightStatus = weightStatus;
            $scope.dailyActivityStatus = dailyActivityStatus;
            $scope.ngoList = ngoList;
            $scope.homeOwnershipList = homeOwnershipList;
            $scope.clinicOwnershipList = clinicOwnershipList;
            $scope.quoteRequest.commonInfo = $scope.commonInfo;
            $rootScope.weight = 1;
            $rootScope.dailyActivity = 1;
            if (localStorageService.get("commAddressDetails")) {
                $scope.addressDetails = localStorageService.get("commAddressDetails");
            }
            if (localStorageService.get("selectedBikeDetails")) {
                $scope.bikeDetails = localStorageService.get("selectedBikeDetails");
            }
            if (localStorageService.get("selectedCarDetails")) {
                $scope.carDetails = localStorageService.get("selectedCarDetails");
            }

            $http.get(wp_path + 'ApplicationLabels.json').then(function (response) {
                localStorageService.set("applicationLabels", response.data);
                $scope.globalLabel = response.data.globalLabels;
                // Fetching default Metro cities and respective RTO details.
                var popularRTOParam = {};
                popularRTOParam.popularRTOList = "Y";
                getDocUsingParam(RestAPI, $scope.globalLabel.transactionName.getPopularRTO, popularRTOParam, function (callbackMetro) {
                     if(callbackMetro.data){
                            localStorageService.set("defaultMetroCityList", callbackMetro.data);
                            $scope.defaultMetroList = callbackMetro.data;
                            }else{   
                            localStorageService.set("defaultMetroCityList", defaultMetroListVar);
                            $scope.defaultMetroList = defaultMetroListVar;
                            }

                    getListFromDB(RestAPI, "", "CarDataList", $scope.globalLabel.request.findAppConfig, function (callbackCar5) {
                        if (callbackCar5.responseCode == $scope.globalLabel.responseCode.success) {
                            $scope.carDisplayNames = callbackCar5.data;
                            localStorageService.set("carMakeListDisplay", callbackCar5.data);
                            $scope.askMia(-1, $scope.quoteRequest);
                        }
                    });

                    setTimeout(function () {
                        // getListFromDB(RestAPI, "", $scope.globalLabel.documentType.twowheeler, $scope.globalLabel.request.findAppConfig, function (bikeMakecallback) {
                        //     if (bikeMakecallback.responseCode == $scope.globalLabel.responseCode.success) {
                        //         $scope.bikeMakeNames = bikeMakecallback.data;
                        //         localStorageService.set("bikeMakeList", bikeMakecallback.data);
                                getListFromDB(RestAPI, "", "BikeVariants", $scope.globalLabel.request.findAppConfig, function (callbackBike5) {
                                    if (callbackBike5.responseCode == $scope.globalLabel.responseCode.success) {
                                        $scope.bikeDisplayNames = callbackBike5.data;
                                        localStorageService.set("bikeMakeListDisplay", callbackBike5.data);
                                    }
                                });
                            // } else {
                            //     $rootScope.P365Alert("Policies365", $scope.globalLabel.validationMessages.generalisedErrMsg, "Ok");
                            // }
                    // });
                    }, 300);
                });
            });
            if (localStorageService.get("profession") && localStorageService.get("professionalQuoteParams")) {
                $scope.fetchLocalStorageDetails();

                if (localStorageService.get("professionalQuoteParams").commonInfo) {
                    $scope.commonInfo = localStorageService.get("professionalQuoteParams").commonInfo;
                    if ($scope.commonInfo.incomeRange) {
                        $rootScope.incomeAbsoluteValue = $scope.commonInfo.incomeRange.absoluteValue;
                    }
                    if ($scope.commonInfo.ngo) {
                        $rootScope.ngoName = $scope.commonInfo.ngo.name;
                    }
                    for (var i = 0; i < $scope.dailyActivityStatus.length; i++) {
                        if ($scope.commonInfo.dailyActivity == $scope.dailyActivityStatus[i].value) {
                            $rootScope.dailyActivity = $scope.dailyActivityStatus[i].index;
                            break;
                        }
                    }
                    for (var i = 0; i < $scope.weightStatus.length; i++) {
                        if ($scope.commonInfo.weight == $scope.weightStatus[i].value) {
                            $rootScope.weight = $scope.weightStatus[i].index;
                            break;
                        }
                    }
                    var counter = 0;
                    for (var i = 0; i < $scope.professionSpecializationList.length; i++) {
                        if ($scope.commonInfo.specialization === $scope.professionSpecializationList[i].value) {
                            counter = 1;
                        }
                        if (counter == 0) {
                            $rootScope.specialization = $scope.professionSpecializationList[0];
                        } else {
                            $rootScope.specialization = $scope.professionSpecializationList[i];
                            break;
                        }
                    }

                    // if liablity not tgere
                    var liabilitycounter = 0;
                    if ($scope.professionalLiabilityList.length > 0) {
                        for (var i = 0; i < $scope.professionalLiabilityList.length; i++) {
                            if ($scope.commonInfo.professionalLiability === $scope.professionalLiabilityList[i].value) {
                                liabilitycounter = 1;
                            }
                            if (liabilitycounter == 0) {
                                if ($scope.profession.professionCode == "DR") {
                                    $rootScope.professionalLiability = $scope.professionalLiabilityList[0];
                                } else {
                                    $rootScope.professionalLiability = $scope.professionalLiabilityList[1];
                                }
                            } else {
                                $rootScope.professionalLiability = $scope.professionalLiabilityList[i];
                                break;
                            }

                        }
                    }
                    if ($rootScope.specialization) {
                        $rootScope.specialization = $scope.professionSpecializationList.find(function (specialization) {
                            return $rootScope.specialization.value === specialization.value;
                        });
                    }
                    if ($rootScope.professionalLiability) {

                        $rootScope.professionalLiability = $scope.professionalLiabilityList.find(function (professionalLiability) {
                            return $rootScope.professionalLiability.label === professionalLiability.label;
                        });
                    }
                    if ($scope.commonInfo.familyComp && $scope.commonInfo.familyComp.length > 0) {
                        for (var i = 0; i < $scope.commonInfo.familyComp.length; i++) {
                            if ($scope.family[i].relation == $scope.commonInfo.familyComp[i].relation) {
                                $scope.family[i].birthYear = $scope.commonInfo.familyComp[i].birthYear;
                                $scope.family[i].status = true;
                                $scope.family[i].val = true;
                            }
                        }
                    }
                } else {
                    if (localStorageService.get("quoteUserInfo")) {
                        var quoteUserInfo = localStorageService.get("quoteUserInfo");
                        $scope.commonInfo.firstName = quoteUserInfo.firstName;
                        $scope.commonInfo.lastName = quoteUserInfo.lastName;
                        $scope.commonInfo.emailId = quoteUserInfo.emailId;
                        $scope.commonInfo.mobileNumber = quoteUserInfo.mobileNumber;
                    }
                    $scope.commonInfo.gender = 'Male';
                    $scope.changeGender();

                    $rootScope.incomeAbsoluteValue = $scope.incomeRangeList[0].absoluteValue;
                    $scope.commonInfo.specialization = $scope.professionSpecializationList[0].value;
                    $rootScope.specialization = $scope.professionSpecializationList[0];
                    $rootScope.specialization = $scope.professionSpecializationList.find(function (specialization) {
                        return $rootScope.specialization.value === specialization.value;
                    });

                    //if liablity not there
                    if ($scope.professionalLiabilityList.length > 0) {
                        $scope.commonInfo.professionalLiability = $scope.professionalLiabilityList[0].value;
                        $rootScope.professionalLiability = $scope.professionalLiabilityList[0];
                        $rootScope.professionalLiability = $scope.professionalLiabilityList.find(function (professionalLiability) {
                            return $rootScope.professionalLiability.label === professionalLiability.label;
                        });
                    }
                    $scope.commonInfo.homeStatus = 'Owned';
                    $scope.commonInfo.clinicStatus = 'Owned';
                    $rootScope.ngoName = $scope.ngoList[0].name;
                    $scope.commonInfo.smoking = false;
                    $scope.fetchLocalStorageDetails();
                }
            } else {
                // this code will be removed while delployment on server
                if (localStorageService.get("quoteUserInfo")) {
                    var quoteUserInfo = localStorageService.get("quoteUserInfo");
                    $scope.commonInfo.firstName = quoteUserInfo.firstName;
                    $scope.commonInfo.lastName = quoteUserInfo.lastName;
                    $scope.commonInfo.emailId = quoteUserInfo.emailId;
                    $scope.commonInfo.mobileNumber = quoteUserInfo.mobileNumber;
                }
                $scope.commonInfo.gender = 'Male';
                $scope.changeGender();
                $rootScope.incomeAbsoluteValue = $scope.incomeRangeList[0].absoluteValue;
                $scope.commonInfo.specialization = $scope.professionSpecializationList[0].value;

                $rootScope.specialization = $scope.professionSpecializationList[0];
                $rootScope.specialization = $scope.professionSpecializationList.find(function (specialization) {
                    return $rootScope.specialization.value === specialization.value;
                });

                if ($scope.professionalLiabilityList.length > 0) {
                    $scope.commonInfo.professionalLiability = $scope.professionalLiabilityList[0].value;
                    $rootScope.professionalLiability = $scope.professionalLiabilityList[0];
                    $rootScope.professionalLiability = $scope.professionalLiabilityList.find(function (professionalLiability) {
                        return $rootScope.professionalLiability.label === professionalLiability.label;
                    });
                }
                $scope.commonInfo.homeStatus = 'Owned';
                $scope.commonInfo.clinicStatus = 'Owned';
                $rootScope.ngoName = $scope.ngoList[0].name;
                $scope.commonInfo.smoking = false;
                $scope.fetchLocalStorageDetails();
            }
            for (var i = 0; i < $scope.family.length; i++) {
                if ($scope.family[i].relationship == 'A' && $scope.family[i].val == true) {
                    $scope.showAdditionalMembers = true;
                }
            }
            localStorageService.set("selectedFamilyForHealth", $scope.family);

        }

        //function to reset birth year
        $scope.changeFamilyMemberStatus = function (member) {
            $scope.isAgeApplicable = true;
            for (var i = 0; i < $scope.family.length; i++) {
                if ($scope.family[i].relation == member.relation) {
                    if (!member.val) {
                        $scope.family[i].birthYear = '';
                        member.invalidAge = false;
                    }
                }
            }

            //disabling next if user age is invalid
            for (var i = 0; i < $scope.family.length; i++) {
                if ($scope.family[i].val) {
                    if ($scope.family[i].invalidAge) {
                        $scope.isAgeApplicable = false;
                        break;
                    }
                }
            }
        }

        $scope.validateAge = function (selectedMember) {
            $scope.isAgeApplicable = true;
            var today = new Date();
            var age = today.getFullYear() - selectedMember.birthYear;
            if (selectedMember.relation != "SON" && selectedMember.relation != "DAUGHTER") {
                if (Number(age) > Number(selectedMember.maxAge) || Number(age) < Number(selectedMember.minAge)) {
                    selectedMember.invalidAge = true;
                } else {
                    selectedMember.invalidAge = false;
                }
            } else {
                if (Number(age) > 100 || Number(age) < 0) {
                    selectedMember.invalidAge = true;
                } else {
                    selectedMember.invalidAge = false;
                }

            }
            //disabling next if user age is invalid
            for (var i = 0; i < $scope.family.length; i++) {
                if ($scope.family[i].val) {
                    if ($scope.family[i].invalidAge) {
                        $scope.isAgeApplicable = false;
                        break;
                    }
                }
            }
        };

        $scope.init = function () {
            $scope.declaration();
            $scope.initialisation();
        };

        var profession = {};
        if (localStorage.getItem("profession")) {
            profession = JSON.parse(localStorage.getItem("profession"));
            $scope.professionSelects(profession);
            $scope.init();
        }
        // }

        $scope.showRiskAssessmentDemo = function () {
            $scope.riskAssessmentDemoModal = true;
        }
        $scope.hideRiskAssessmentDemo = function () {
            $scope.riskAssessmentDemoModal = false;
        }

        $scope.showInsuranceProfileDemo = function () {
            $scope.insuranceProfileDemoModal = true;
        }
        $scope.hideInsuranceProfileDemo = function () {
            $scope.insuranceProfileDemoModal = false;
        }

        
        // for sending otp details to the customers 
        $scope.sendOTP = function() {
            if ($scope.commonInfo.mobileNumber) {
                $scope.disableContact = true;
                var validateAuthParam = {};
                validateAuthParam.paramMap = {};
                validateAuthParam.mobileNumber = $scope.commonInfo.mobileNumber;
                validateAuthParam.funcType = $scope.p365Labels.functionType.otpAuth;
                validateAuthParam.paramMap.OTP = $scope.p365Labels.functionType.otpGenerate;
                getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.sendSMS, validateAuthParam, function(createOTP) {
                    if (createOTP.responseCode == $scope.p365Labels.responseCode.success) {
                        $scope.createOTPError = "";
                        $scope.modalOTPError = false;
                        $scope.showOtpButton = false;
                        } else if (createOTP.responseCode == $scope.p365Labels.responseCode.userNotExist) {
                        $scope.createOTPError = createOTP.message;
                        $scope.modalOTPError = true;
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {
                        $scope.createOTPError = createOTP.message;
                        $scope.modalOTPError = true;
                    } else if (createOTP.responseCode == $scope.p365Labels.responseCode.mobileInvalidCode) {
                        $scope.createOTPError = createOTP.message;
                        $scope.modalOTPError = true;
                    } else {
                        $scope.createOTPError = $scope.p365Labels.errorMessage.createOTP;
                        $scope.modalOTPError = true;
                    }
                });
            }
            
        };
        $scope.resendOTP = function() {
            $scope.sendOTP();
        };
    
        $scope.submitOTP = function() {
            var authenticateUserParam = {};
            authenticateUserParam.mobileNumber = $scope.commonInfo.mobileNumber;
            authenticateUserParam.OTP = Number($scope.commonInfo.OTP);
            getDocUsingParam(RestAPI, $scope.p365Labels.transactionName.validateOTP, authenticateUserParam, function(validateOTP) {
               
                $rootScope.authenticated = false;
                if (validateOTP.responseCode == $scope.p365Labels.responseCode.success) {
                    $rootScope.authenticated = true;
                    $scope.invalidOTPError = "";
                    $scope.createLead();    
                } else if (validateOTP.responseCode == $scope.p365Labels.responseCode.noRecordsFound) {                    
                    $scope.invalidOTPError = $scope.p365Labels.validationMessages.invalidOTP;
                } else if (validateOTP.responseCode == $scope.p365Labels.responseCode.expiredOTP) {                   
                    $scope.invalidOTPError = $scope.p365Labels.errorMessage.expiredOTP;
                } else if (validateOTP.responseCode == $scope.p365Labels.responseCode.blockedMobile) {                    
                    $scope.invalidOTPError = validateOTP.message;
                } else {                    
                    $scope.invalidOTPError = $scope.p365Labels.errorMessage.authOTP;
                }
            });
        };


        // if the mobile number is changed then ask for otp verification
        $scope.$watch('commonInfo.mobileNumber', function (newValue) {
            if(localStorageService.get("quoteUserInfo")){
                if($scope.commonInfo){
                if($scope.commonInfo.mobileNumber != localStorageService.get("quoteUserInfo").mobileNumber)            
                      $rootScope.authenticated = false;
                else
                      $rootScope.authenticated = true;
            }
        }
        });

        $scope.changeNumber = function(){
            $scope.disableContact = false;
            $scope.showOtpButton = true;            
        }

    }]);