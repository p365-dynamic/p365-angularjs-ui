var sessionIDvar;
var messageIDVar;
var campaignIDVar;
var campaign_id;
var requestSource;
var campaignSource = {};
var organizationName;
var sourceOrigin;
var rampURL;

("use strict");
angular
  .module("headerApp", ["LocalStorageModule"])
  .controller(
    "headerController",
    function (
      $rootScope,
      $scope,
      $http,
      localStorageService,
      $anchorScroll,
      RestAPI,
      $location,
      $sce,
      $window,
      $timeout
    ) {
      var wp_path;
      if (wordPressEnabled && iquoteEnabled) {
        wp_path = localized;
      } else {
        wp_path = "";
      }

      if (!wordPressEnabled && pospEnabled) {
        wp_path = localized;
      }
      $rootScope.wp_path = wp_path;
      $scope.callToFetch = function () {
        $rootScope.professionalJourney = professionalJourney;
        if (wordPressEnabled) {
          if (window.location.href.indexOf("/about-us") > -1) {
            $rootScope.title = "About Us";
          } else if (window.location.href.indexOf("/products") > -1) {
            $rootScope.title = "Products";
          } else if (window.location.href.indexOf("/claims-main") > -1) {
            $rootScope.title = "Claims";
          } else if (window.location.href.indexOf("/contact-us") > -1) {
            $rootScope.title = "Contact Us";
          } else if (window.location.href.indexOf("/sign-in") > -1) {
            $rootScope.title = "Sign In";
          } else if (window.location.href.indexOf("/logout") > -1) {
            $rootScope.title = "Logout";
          }

          setTimeout(function () {
            if (localStorageService.get("userProfileDetails")) {
              $(".logout_link")
                .closest("li")
                .attr("style", "display:inline-block !important");
              $scope.userLoginInfo =
                localStorageService.get("userProfileDetails");
              if ($scope.userLoginInfo.firstName) {
                $(".signin_link").text(
                  $scope.userLoginInfo.firstName + " Account"
                );
                localStorage.setItem("loggedIn", "true");
              } else {
                $(".logout_link")
                  .closest("li")
                  .attr("style", "display:none !important");
                localStorage.setItem("loggedIn", "false");
              }
            } else {
              $(".logout_link")
                .closest("li")
                .attr("style", "display:none !important");
              localStorage.setItem("loggedIn", "false");
            }
          }, 500);
          if (localStorageService.get("userProfileDetails")) {
            $(".logout_link")
              .closest("li")
              .attr("style", "display:inline-block !important");
            $scope.userLoginInfo =
              localStorageService.get("userProfileDetails");
            if ($scope.userLoginInfo.firstName) {
              $(".signin_link").text(
                $scope.userLoginInfo.firstName + " Account"
              );
              localStorage.setItem("loggedIn", "true");
            }
          } else {
            $(".logout_link")
              .closest("li")
              .attr("style", "display:none !important");
            localStorage.setItem("loggedIn", "false");
          }
          //localStorageService.set("wordPressEnabled", true);
        } else {
          //localStorageService.set("wordPressEnabled", false);
        }

        $scope.surveyFlag = false;
        $scope.init = function () {
          $rootScope.accessDenied = false;
          $scope.quoteUserInfo = localStorageService.get("quoteUserInfo");

          if ($scope.quoteUserInfo != null) {
            messageIDVar = $scope.quoteUserInfo.messageId;
          }
          $rootScope.bodyHeight = $window.innerHeight + "px";
          $rootScope.baseEnvEnabled = baseEnvEnabled;
          $rootScope.customEnvEnabled = customEnvEnabled;
          $rootScope.wordPressEnabled = wordPressEnabled;
          $rootScope.idepProdEnv = idepProdEnv;
          $rootScope.agencyPortalEnabled = agencyPortalEnabled;
          //localStorageService.clearAll();
          $scope.callQuoteController = function (tab) {
            $anchorScroll("home");
            if (
              tab.businessLineId !=
              localStorageService.get("selectedBusinessLineId")
            ) {
              $rootScope.loading = true;
              $rootScope.selTabObject = tab;
              $scope.$broadcast("callMethodFromHeader", {});
            }
          };

          $scope.modalTerms = false;
          $scope.toggleTerms = function () {
            $scope.modalTerms = !$scope.modalTerms;
            $(".md-click-catcher").click(function () {
              $(".md-select-menu-container").hide();
            });
          };

          $scope.closePreExistingDiseaseModal = function () {
            $scope.modalTerms = false;
          };

          //show privacy policy popup(AD)

          $scope.modalPol = false;
          $scope.togglePol = function () {
            $scope.modalPol = !$scope.modalPol;
            $(".md-click-catcher").click(function () {
              $(".md-select-menu-container").hide();
            });
          };

          $scope.closePreExistingDiseaseModalp = function () {
            $scope.modalPol = false;
          };

          //show contactus popup(AD)

          $scope.modalContact = false;
          $scope.toggleCont = function () {
            $scope.modalContact = !$scope.modalContact;
            $(".md-click-catcher").click(function () {
              $(".md-select-menu-container").hide();
            });
          };

          $scope.closePreExistingDiseaseModala = function () {
            $scope.modalContact = false;
          };

          //show Aboutus popup(AD)

          $scope.modalAbout = false;
          $scope.toggleAbout = function () {
            $scope.modalAbout = !$scope.modalAbout;
            $(".md-click-catcher").click(function () {
              $(".md-select-menu-container").hide();
            });
          };

          $scope.closePreExistingDiseaseModalx = function () {
            $scope.modalAbout = false;
          };

          //$scope.globalLabel = localStorageService.get("applicationLabels").globalLabels;
          //show feedback form popup.
          $rootScope.showFeedbackForm = function (feedType) {
            $scope.modalFeedback = true;
            //feedbackForm]
            $scope.feedback = [
              { name: "", mobileNumber: "", emailId: "", description: "" },
            ];
            if (feedType == "userLikes") {
              $scope.docType = "What you liked";
              $scope.placeholder =
                "for e.g. I like the way website is very sleek and easy to navigate.";
            } else {
              $scope.docType = "What can be better";
              $scope.placeholder =
                "for e.g. It was not evident that i am on Policy Quote page of the website. I prefer a heading or page title bar in each page would help.";
            }
            $scope.docTypeVal = feedType;
          };

          $rootScope.closeFeedbackForm = function () {
            $scope.modalFeedback = false;
            $scope.feedback = [
              { name: "", mobileNumber: "", emailId: "", description: "" },
            ];
          };

          //show feedback form popup.
          $scope.modalFeedbackSuccess = false;
          $rootScope.feedbackSuccessForm = function () {
            $scope.modalFeedbackSuccess = true;
          };

          $rootScope.closefeedbackSuccess = function () {
            $scope.modalFeedbackSuccess = false;
            $scope.feedback = [
              { name: "", mobileNumber: "", emailId: "", description: "" },
            ];
          };

          $scope.submitFeedback = function (type) {
            var feedbackParam = {};
            feedbackParam.name = $scope.feedback.name;
            feedbackParam.mobile = $scope.feedback.mobileNumber;
            feedbackParam.email = $scope.feedback.emailId;
            feedbackParam.description = $scope.feedback.description;
            feedbackParam.documentType = type;

            var request = {};
            var header = {};

            header.transactionName = "logFeedbackRequest";
            header.deviceId = deviceIdOrigin;
            request.header = header;
            request.body = feedbackParam;
            $http({ method: "POST", url: getQuoteCalcLink, data: request })
              .success(function (callback, status) {
                callback = JSON.parse(callback);
                if (
                  callback.responseCode ==
                  $scope.globalLabel.responseCode.success
                ) {
                  $scope.modalFeedback = false;
                  $rootScope.feedbackSuccessForm();
                }
              })
              .error(function (callback, status) {});
          };
          //contact Us form
          $scope.modalEmailConfirm = false;
          $scope.inputValidStatus = false;
          $scope.composeEmail = {};
          $scope.composeEmail.paramMap = {};

          $scope.hideEmailConfirmModal = function () {
            $scope.modalEmailConfirm = false;
          };

          $scope.sendEmail = function (contactUsForm) {
            if (contactUsForm.$invalid) {
              $scope.inputValidStatus = true;
              if ($scope.contactUsForm) {
                angular.forEach(
                  $scope.contactUsForm.$invalid,
                  function (field) {
                    field.$setTouched();
                  }
                );
              }
            } else {
              $scope.inputValidStatus = false;
              $scope.composeEmail.paramMap.userEmail =
                $scope.composeEmail.userEmail;

              var userInfoWithQuoteParam = {};
              var quoteUserInfo = {};
              $scope.selectedBusinessLineId = localStorageService.get(
                "selectedBusinessLineId"
              );
              // Quote user info added to central DB using DataWriter service
              quoteUserInfo.firstName = $scope.composeEmail.paramMap.USERNAME;
              quoteUserInfo.mobileNumber =
                $scope.composeEmail.paramMap.mobileNumber;
              quoteUserInfo.emailId = $scope.composeEmail.paramMap.userEmail;
              localStorageService.set("quoteUserInfo", quoteUserInfo);

              if ($scope.selectedBusinessLineId == 1) {
                userInfoWithQuoteParam.quoteParam = localStorageService.get(
                  "lifeQuoteInputParamaters"
                ).quoteParam;
                userInfoWithQuoteParam.personalDetails =
                  localStorageService.get(
                    "lifeQuoteInputParamaters"
                  ).personalDetails;
                userInfoWithQuoteParam.QUOTE_ID = localStorageService.get(
                  "LIFE_UNIQUE_QUOTE_ID"
                );
                //logic written only when the user comes from campaign
                if ($location.path() == "/life") {
                  $scope.composeEmail.paramMap.insuranceType = "life";
                }
              } else if ($scope.selectedBusinessLineId == 2) {
                userInfoWithQuoteParam.quoteParam = localStorageService.get(
                  "bikeQuoteInputParamaters"
                ).quoteParam;
                userInfoWithQuoteParam.vehicleInfo = localStorageService.get(
                  "bikeQuoteInputParamaters"
                ).vehicleInfo;
                userInfoWithQuoteParam.QUOTE_ID = localStorageService.get(
                  "BIKE_UNIQUE_QUOTE_ID"
                );
              } else if ($scope.selectedBusinessLineId == 3) {
                userInfoWithQuoteParam.quoteParam = localStorageService.get(
                  "carQuoteInputParamaters"
                ).quoteParam;
                userInfoWithQuoteParam.vehicleInfo = localStorageService.get(
                  "carQuoteInputParamaters"
                ).vehicleInfo;
                userInfoWithQuoteParam.QUOTE_ID = localStorageService.get(
                  "CAR_UNIQUE_QUOTE_ID"
                );
                //logic written only when the user comes from campaign
                if ($location.path() == "/car") {
                  $scope.composeEmail.paramMap.insuranceType = "car";
                }
              } else if ($scope.selectedBusinessLineId == 4) {
                //logic written only when the user comes from campaign
                if ($location.path() == "/health") {
                  $scope.composeEmail.paramMap.insuranceType = "health";
                }
                userInfoWithQuoteParam.quoteParam = localStorageService.get(
                  "healthQuoteInputParamaters"
                ).quoteParam;
                userInfoWithQuoteParam.QUOTE_ID = localStorageService.get(
                  "HEALTH_UNIQUE_QUOTE_ID"
                );
              }

              if (userInfoWithQuoteParam.quoteParam) {
                userInfoWithQuoteParam.quoteParam.quoteType =
                  $scope.selectedBusinessLineId;
              }
              /*userInfoWithQuoteParam.contactInfo = contactInfo;*/

              //logic written for non campaign user
              var urlPattern = $location.path();
              if (
                urlPattern != "/life" &&
                urlPattern != "/car" &&
                urlPattern != "/health" &&
                urlPattern.indexOf("pay") == -1 &&
                urlPattern.indexOf("proposalresdata") == -1 &&
                urlPattern.indexOf("sharefromAPI") == -1 &&
                urlPattern.indexOf("ipos") == -1
              ) {
                userInfoWithQuoteParam.requestSource = sourceOrigin;
              }

              $scope.composeEmail.userInfoWithQuoteParam =
                userInfoWithQuoteParam;
              if ($scope.composeEmail.paramMap.ticketType == "query") {
                $scope.composeEmail.funcType = "USERENQUIRY"; //QUERY
              } else if (
                $scope.composeEmail.paramMap.ticketType == "complaint"
              ) {
                $scope.composeEmail.funcType = "COMPLAINT";
              } else if ($scope.composeEmail.paramMap.ticketType == "request") {
                $scope.composeEmail.funcType = "REQUEST";
              } else {
                $scope.composeEmail.funcType = "USERENQUIRY";
              }
              RestAPI.invoke("createTicket", $scope.composeEmail).then(
                function (callback) {
                  if (callback.responseCode == 1000) {
                    $scope.modalContact = false;
                    $scope.modalEmailConfirm = true;
                    $scope.composeEmail = {};
                    if ($scope.contactUsForm) {
                      $scope.contactUsForm.$setPristine();
                      $scope.contactUsForm.$setUntouched();
                    }
                  }
                }
              );
            }
          };
          // Below piece of code written to access function from outside controller.
          $rootScope.$on("callCreateTicket", function (contactUsForm) {
            $scope.sendEmail(contactUsForm);
          });

          $rootScope.displayTimer = function (maxDuration) {
            var timer = maxDuration;
            $timeout(function () {
              $rootScope.displayTime = maxDuration - 1;
              maxDuration--;
              if ($rootScope.displayTime == 1) {
                $window.top.location.href = $rootScope.redirectionURL;
              }
              if ($rootScope.displayTime > 1)
                $rootScope.displayTimer(maxDuration);
            }, 1000);
          };

          $scope.closeFeedbackModal = function () {
            $rootScope.modalSurvey = false;
            if ($rootScope.affilateRedirection) {
              $rootScope.displayTime = 10;
              $rootScope.displayTimer($rootScope.displayTime);
            }
          };
          //code for survey popup
          $scope.onIframeLoad = function (src) {
            var key = src.split("?")[1];
            if (String(key) != "undefined" && key.contains("success")) {
              $scope.modalSurvey = false;
              $scope.$apply();
            }
          };

          //logic writtem for campaign
          $scope.getCampaignFunction = function () {
            //logic writtem for campaign
            if ($scope.sourceValidationResponse) {
              campaign_id = $scope.sourceValidationResponse.campaignId;
              if ($scope.sourceValidationResponse.requestSource) {
                requestSource = $scope.sourceValidationResponse.requestSource;
              }
            }
            // this condition is added for adding specific campaignID in case of renewal
            if (
              $location.search().isForRenewal &&
              $location.search().campaign
            ) {
              campaign_id = $location.search().campaign;
              if (!campaign_id) {
                campaign_id = "46b3bf3d-52fb-38a7-40be-59cc9e8728800";
              }
              var request = {};
              messageIdVar = $location.search().messageId;
              request.isRenewal = true;
              RestAPI.invoke("readEmailStatus", request).then(function (
                readStatus
              ) {
                if (readStatus.responseCode == 1000) {
                }
              });
              requestSource = sourceOrigin;
            }
          };
          //expicit call for requestSource from header & quote
          $scope.$on("invokeCampaignTemplate", function () {
            $scope.getCampaignFunction();
          });

          $scope.$broadcast("invokeCampaignTemplate", {});

          //});
        };
        function getCookieValue(a) {
          var affilateCookie = document.cookie.match(
            "(^|;)\\s*" + a + "\\s*=\\s*([^;]+)"
          );
          return affilateCookie ? affilateCookie.pop() : "";
        }
        var p365cookie = getCookieValue("wpam_id");
        if (p365cookie) {
          var request = {};
          requestSource = sourceOrigin;
          request.deviceId = p365cookie;
          deviceIdOrigin = request.deviceId;
          RestAPI.invoke("validateSource", request).then(function (callback) {
            if (callback.responseCode == 1000) {
              $scope.sourceValidationResponse = callback.data;
              sourceOrigin = $scope.sourceValidationResponse.source;
              deviceIdOrigin = $scope.sourceValidationResponse.deviceId;
              requestSource = $scope.sourceValidationResponse.deviceId;
              $rootScope.affilateUser =
                $scope.sourceValidationResponse.affilateUser;
              $rootScope.affilateRedirection =
                $scope.sourceValidationResponse.redirectToAffilateScreen;
              if ($scope.sourceValidationResponse.redirectionURL) {
                $rootScope.redirectionURL =
                  $scope.sourceValidationResponse.redirectionURL;
              }
              if ($scope.sourceValidationResponse.hideLOB) {
                $rootScope.hideLOB = $scope.sourceValidationResponse.hideLOB;
              } else {
                $rootScope.hideLOB = false;
              }
              $scope.init();
            }
          });
        } else {
          var request = {};
          request.deviceId = deviceIdOrigin;
          if (agencyPortalEnabled) {
            if ($location.search().P365Token) {
              var verifyTokenReq = angular.copy(request);
              verifyTokenReq.token = $location.search().P365Token;
              RestAPI.invoke("verifyToken", verifyTokenReq).then(function (
                tokenVerificationCallback
              ) {
                if (tokenVerificationCallback.responseCode == 1000) {
                  $rootScope.accessDenied = false;
                  tokenVerificationResp = tokenVerificationCallback.data;
                  if (
                    tokenVerificationResp &&
                    tokenVerificationResp.issuer == "Policies365"
                  ) {
                    RestAPI.invoke("validateSource", request).then(function (
                      callback
                    ) {
                      if (callback.responseCode == 1000) {
                        $scope.sourceValidationResponse = callback.data;
                        sourceOrigin = $scope.sourceValidationResponse.source;
                        deviceIdOrigin =
                          $scope.sourceValidationResponse.deviceId;
                        requestSource =
                          $scope.sourceValidationResponse.deviceId;
                        $rootScope.affilateURL =
                          $scope.sourceValidationResponse.affilateURL;
                        $rootScope.affilateUser =
                          $scope.sourceValidationResponse.affilateUser;
                        $rootScope.affilateRedirection =
                          $scope.sourceValidationResponse.redirectToAffilateScreen;
                        campaign_id =
                          $scope.sourceValidationResponse.campaignId;
                        if ($scope.sourceValidationResponse.hideLOB) {
                          $rootScope.hideLOB =
                            $scope.sourceValidationResponse.hideLOB;
                        } else {
                          $rootScope.hideLOB = false;
                        }
                        if ($scope.sourceValidationResponse.rampURL) {
                          rampURL = $scope.sourceValidationResponse.rampURL;
                        }
                        $scope.init();
                      }
                    });
                  } else {
                    $rootScope.accessDenied = true;
                    $location.path("/accessDenied");
                  }
                } else {
                  $rootScope.accessDenied = true;
                  $location.path("/accessDenied");
                }
              });
            }
          } else {
            //requestSource = "web";
            $rootScope.accessDenied = false;
            RestAPI.invoke("validateSource", request).then(function (callback) {
              if (callback.responseCode == 1000) {
                $scope.sourceValidationResponse = callback.data;
                sourceOrigin = $scope.sourceValidationResponse.source;
                deviceIdOrigin = $scope.sourceValidationResponse.deviceId;
                requestSource = $scope.sourceValidationResponse.deviceId;
                $rootScope.affilateUser =
                  $scope.sourceValidationResponse.affilateUser;
                $rootScope.affilateRedirection =
                  $scope.sourceValidationResponse.redirectToAffilateScreen;
                campaign_id = $scope.sourceValidationResponse.campaignId;
                if ($scope.sourceValidationResponse.hideLOB) {
                  $rootScope.hideLOB = $scope.sourceValidationResponse.hideLOB;
                } else {
                  $rootScope.hideLOB = false;
                }
                $scope.init();
              }
            });
          }
        }
      };
      //Database init
      loadDatbase(function () {
        if (
          localStorageService.get("policies365-application-version") != null &&
          localStorageService.get("policies365-application-version") !=
            "undefined" &&
          String(localStorageService.get("policies365-application-version")) ==
            APPLICATION_VERSION
        ) {
          $scope.callToFetch();
          localStorageService.set("websiteVisitedOnce", true);
          $rootScope.professionalJourneyInit = true;
        } else {
          localStorageService.clearAll();
          localStorageService.clearCollection();
          $http
            .get(wp_path + "ApplicationLabels.json")
            .then(function (response) {
              $scope.callToFetch();
              localStorageService.set("applicationLabels", response.data);
              localStorageService.set(
                "policies365-application-version",
                APPLICATION_VERSION
              );
              localStorage.removeItem("selectedBusinessLineId");
              localStorageService.set("selectedBusinessLineId", 3);
              localStorageService.set("websiteVisitedOnce", false);
              $scope.globalLabel = response.data.globalLabels;
              $rootScope.professionalJourneyInit = true;
            });
        }
      });
    }
  );
