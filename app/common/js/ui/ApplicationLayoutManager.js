'use strict';

angular.module('policies365', [
	'quote',
	'motor',
	 'contact',
	'claims',
	'logout',
	'signIn',
	// 'terms',
	// 'privacy',
	'assurancePurchasingStatement',
	'medicalPurchasing',
	'fourWheelerPolicyPurchase',
	'twoWheelerPolicyPurchase',
	'travelPolicyPurchase',
	'lifeInstantQuote',
	'healthInstantQuote',
	'carInstantQuote',
	'bikeInstantQuote',
	'travelInstantQuote',
	'criticalIllnessInstantQuote',
	'carResult',
	'bikeResult',
	'lifeResult',
	'healthResult',
	'travelResult',
	'criticalIllnessResult',
	'shareQuoteByEmail',
	'shareProfessionalQuoteByEmail',
	'buyHealth',
	'campaign',
	'proposalresdatahealth',
	'buyFourWheeler',
	'proposalresdatacar',
	'proposalresdatatravel',
	'proposalresdatalife',
	'proposalresdata',
	'ipos',
	'buyTwoWheeler',
	'proposalresdatabike',
	'buyAssurance',
	'FourWheelerscheduleInspection',
	'paySuccessHealth',
	'paySuccessLife',
	'paySuccessCar',
	'paySuccessBike',
	'paySuccessTravel',
	'payFailureHealth',
	'payFailureLife',
	'payFailureCar',
	'payFailureBike',
	'payFailureTravel',
	'paySuccess',
	'payFailure',
	'dashboard',
	'professionalJourney',
	'professionalJourneyResult',	
	'headerApp',
	'headerNavigationApp',
	'iquoteNavigation',
	'iquoteTabNavigation',
	'buyTravel',
	'dcpResult',
	'ngRoute',
	'ngCookies',
	'ngMaterial',
	'angularUtils.directives.dirPagination',
	'angular.filter',
	'ui.date',
	'ui.bootstrap',
	'ngRateIt',
	'angular.drag.resize',
	'ngSanitize',
	'checklist-model'
])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/quote', {
				controller: 'quoteController',
				templateUrl: wp_path + 'buy/common/html/GetQuoteTemplate.html',
				title: 'Instant Quote'
			})
			.when('/PBQuote', {
				controller: 'quoteController',
				templateUrl: wp_path + 'buy/common/html/PBHTML/PBGetQuoteTemplate.html'
			})
			.when('/accessDenied', {
				controller: '',
				templateUrl: wp_path + 'buy/common/html/AccessDenied.html',
				title: 'Access Denied'
			})
			.when('/proposalNotAvailable', {
				controller: '',
				templateUrl: wp_path + 'buy/common/html/proposalNotAvailable.html',
				title: 'Proposal Not Available'
			})
			.when('/lifeInstantQuote', {
				controller: 'lifeInstantQuoteController',
				templateUrl: wp_path + 'buy/life/html/AssuranceInstantQuote.html'
			})
			.when('/healthInstantQuote', {
				controller: 'healthInstantQuoteController',
				templateUrl: wp_path + 'buy/health/html/MedicalInstantQuote.html'
			})
			.when('/carInstantQuote', {
				controller: 'carInstantQuoteController',
				templateUrl: wp_path + 'buy/car/html/FourWheelerInstantQuote.html'
			})
			.when('/bikeInstantQuote', {
				controller: 'bikeInstantQuoteController',
				templateUrl: wp_path + 'buy/bike/html/TwoWheelerInstantQuote.html'
			})
			.when('/travelInstantQuote', {
				controller: 'travelInstantQuoteController',
				templateUrl: wp_path + 'buy/travel/html/TravelInstantQuote.html'
			})
			.when('/criticalIllnessInstantQuote', {
				controller: 'criticalIllnessInstantQuoteController',
				templateUrl: wp_path + 'buy/criticalIllness/html/CriticalIllnessInstantQuote.html'
			})
			.when('/personalAccidentInstantQuote', {
				controller: 'personalAccidentInstantQuoteController',
				templateUrl: wp_path + 'buy/personalAccident/html/PersonalAccidentInstantQuote.html'
			})
			.when('/homeInstantQuote', {
				controller: 'homeInstantQuoteController',
				templateUrl: wp_path + 'buy/home/html/HomeInstantQuote.html'
			})
			.when('/lifeResult', {
				controller: 'lifeResultController',
				templateUrl: wp_path + 'buy/life/html/AssuranceResult.html'
			})
			.when('/healthResult', {
				controller: 'healthResultController',
				templateUrl: wp_path + 'buy/health/html/MedicalResult.html'
			})
			.when('/healthLanding', {
				controller: 'quoteController',
				templateUrl: wp_path + 'buy/common/html/landing/healthLanding.html'
			})
			.when('/bikeLanding', {
				controller: 'quoteController',
				templateUrl: wp_path + 'buy/common/html/landing/bikeLanding.html'
			})
			.when('/lifeLanding', {
				controller: 'quoteController',
				templateUrl: wp_path + 'buy/common/html/landing/lifeLanding.html'
			})
			.when('/carResult', {
				controller: 'carResultController',
				templateUrl: wp_path + 'buy/car/html/FourWheelerResult.html'
			})
			.when('/bikeResult', {
				controller: 'bikeResultController',
				templateUrl: wp_path + 'buy/bike/html/TwoWheelerResult.html'
			})
			.when('/travelResult', {
				controller: 'travelResultController',
				templateUrl: wp_path + 'buy/travel/html/TravelResult.html'
			})
			.when('/criticalIllnessResult', {
				controller: 'criticalIllnessResultController',
				templateUrl: wp_path + 'buy/criticalIllness/html/CriticalIllnessResult.html'
			})
			.when('/personalAccidentResult', {
				controller: 'personalAccidentResultController',
				templateUrl: wp_path + 'buy/personalAccident/html/PersonalAccidentResult.html'
			})
			.when('/homeResult', {
				controller: 'homeResultController',
				templateUrl: wp_path + 'buy/home/html/HomeResult.html'
			})
			.when('/sharefromAPI', {
				controller: 'ShareQuoteByEmailController',
				templateUrl: wp_path + 'buy/common/html/ShareEmailTemplate.html'
			})
			.when('/professionalShareAPI', {
				controller: 'ShareProfessionalQuoteByEmailController',
				templateUrl: wp_path + 'buy/common/html/ShareEmailTemplate.html'
			})
			.when('/dcpResult', {
				controller: 'dcpResultController',
				templateUrl: wp_path + 'buy/common/html/DcpResultTemplate.html'
			})
			.when('/buyHealth', {
				controller: 'buyHealthController',
				templateUrl: wp_path + 'buy/health/html/MedicalBuyProduct.html'
			})
			.when('/buyTravel', {
				controller: 'buyTravelController',
				templateUrl: wp_path + 'buy/travel/html/TravelBuyProduct.html'
			})
			.when('/proposalresdatahealth', {
				controller: 'proposalResponseDataHealthController',
				templateUrl: wp_path + 'buy/health/html/MedicalBuyProduct.html'
			})

			.when('/buyAssurance', {
				controller: 'buyAssuranceController',
				templateUrl: wp_path + 'buy/life/html/AssuranceBuyProduct.html'
			})
			.when('/buyPersonalAccident', {
				controller: 'buypersonalAccidentController',
				templateUrl: wp_path + 'buy/personalAccident/html/PersonalAccidentBuyProduct.html'
			})
			.when('/buyFourWheeler', {
				controller: 'buyFourWheelerController',
				templateUrl: wp_path + 'buy/car/html/FourWheelerBuyProduct.html'
			})
			.when('/proposalresdatacar', {
				controller: 'proposalResponseDataCarController',
				templateUrl: wp_path + 'buy/car/html/FourWheelerBuyProduct.html'
			})
			.when('/proposalresdatatravel', {
				controller: 'proposalResponseDataTravelController',
				templateUrl: wp_path + 'buy/travel/html/TravelBuyProduct.html'
			})
			.when('/proposalresdatalife', {
				controller: 'proposalResponseDataLifeController',
				templateUrl: wp_path + 'buy/life/html/AssuranceBuyProduct.html'
			})
			.when('/proposalresdata', {
				controller: 'proposalResponseDataController',
				templateUrl: wp_path + 'buy/common/html/proposalresdata.html'
			})
			.when('/ipos', {
				controller: 'iposController',
				template: " "
			})
			.when('/FourWheelerscheduleInspection', {
				controller: 'FourWheelerscheduleInspectionController',
				templateUrl: wp_path + 'buy/car/html/FourWheelerscheduleInspection.html'
			})
			.when('/buyTwoWheeler', {
				controller: 'buyTwoWheelerController',
				templateUrl: wp_path + 'buy/bike/html/TwoWheelerBuyProduct.html'
			})
			.when('/proposalresdatabike', {
				controller: 'proposalResponseDataBikeController',
				templateUrl: wp_path + 'buy/bike/html/TwoWheelerBuyProduct.html'
			})
			.when('/contact', {
				controller: 'contactController',
				templateUrl: wp_path + 'common/html/ContactUs.html'
			})
			.when('/logout', {
				controller: 'logoutController',
				templateUrl: wp_path + 'buy/common/html/logout.html'
			})
			.when('/signIn', {
				controller: 'signInController',
				templateUrl: wp_path + 'buy/common/html/signIn.html',
				title: 'SignIn'
			})
			.when('/claims', {
				controller: 'claimsController',
				templateUrl: wp_path + 'buy/common/html/Claims.html'
			})			
			.when('/paysuccesspersonalaccident', {
				controller: 'paySuccessPersonalAccidentController',
				templateUrl: wp_path + 'buy/personalAccident/html/PersonalAccidentPaySuccess.html'
			})
			.when('/paysuccesshealth', {
				controller: 'paySuccessHealthController',
				templateUrl: wp_path + 'buy/health/html/MedicalPaySuccess.html'
			})
			.when('/paysuccesslife', {
				controller: 'paySuccessLifeController',
				templateUrl: wp_path + 'buy/life/html/AssurancePaySuccess.html'
			})
			.when('/paysuccesscar', {
				controller: 'paySuccessCarController',
				templateUrl: wp_path + 'buy/car/html/FourWheelerPaySuccess.html'
			})
			.when('/paysuccessbike', {
				controller: 'paySuccessBikeController',
				templateUrl: wp_path + 'buy/bike/html/TwoWheelerPaySuccess.html'
			})
			.when('/paysuccesstravel', {
				controller: 'paySuccessTravelController',
				templateUrl: wp_path + 'buy/travel/html/TravelPaySuccess.html'
			})
			.when('/payfailurepersonalaccident', {
				controller: 'payFailurePersonalAccidenntController',
				templateUrl: wp_path + 'buy/personalAccident/html/PersonalAccidentPayFailure.html'
			})
			.when('/payfailurehealth', {
				controller: 'payFailureHealthController',
				templateUrl: wp_path + 'buy/health/html/MedicalPayFailure.html'
			})
			.when('/payfailurelife', {
				controller: 'payFailureLifeController',
				templateUrl: wp_path + 'buy/life/html/AssurancePayFailure.html'
			})
			.when('/payfailurecar', {
				controller: 'payFailureCarController',
				templateUrl: wp_path + 'buy/car/html/FourWheelerPayFailure.html'
			})
			.when('/payfailurebike', {
				controller: 'payFailureBikeController',
				templateUrl: wp_path + 'buy/bike/html/TwoWheelerPayFailure.html'
			})
			.when('/payfailuretravel', {
				controller: 'payFailureTravelController',
				templateUrl: wp_path + 'buy/travel/html/TravelPayFailure.html'
			})
			.when('/paysuccess', {
				controller: 'paySuccessController',
				templateUrl: wp_path + 'buy/common/html/PaySuccess.html'
			})
			.when('/payfailure', {
				controller: 'payFailureController',
				templateUrl: wp_path + 'buy/common/html/PayFailure.html'
			})
			.when('/dashboard', {
				controller: 'dashboardController',
				templateUrl: wp_path + 'common/html/Dashboard.html'
			})
			.when('/professionalJourney', {
				controller: 'professionalJourneyController',
				templateUrl: wp_path + 'buy/common/html/professionalJourney.html'
			})
			.when('/professionalJourneyResult', {
				controller: 'professionalJourneyResultController',
				templateUrl: wp_path + 'buy/common/html/professionalJourneyResult.html'
			})
			.when('/PBCarResult', {
				controller: 'carResultController',
				templateUrl: wp_path + 'buy/common/html/PBHTML/PBCarResult.html'
			})
			.when('/PBBikeResult', {
				controller: 'bikeResultController',
				templateUrl: wp_path + 'buy/common/html/PBHTML/PBBikeResult.html'
			})
			.when('/PBHealthResult', {
				controller: 'healthResultController',
				templateUrl: wp_path + 'buy/common/html/PBHTML/PBHealthResult.html'
			})
			.when('/PBLifeResult', {
				controller: 'lifeResultController',
				templateUrl: wp_path + 'buy/common/html/PBHTML/PBLifeResult.html'
			})
			.when('/motor', {
				controller: 'motorController',
				templateUrl: ''
			})
			.when('/lifePurchasing', {
				controller: 'assurancePurchasingStatementController',
				templateUrl: wp_path + 'buy/life/html/AssurancePurchasingStatement.html'
			})
			.when('/medicalPurchasing', {
				controller: 'medicalPurchasingController',
				templateUrl: wp_path + 'buy/health/html/medicalPurchasing.html'
			})
			.when('/carpolicypurchase', {
				controller: 'fourWheelerPolicyPurchaseController',
				templateUrl: wp_path + 'buy/car/html/fourWheelerPolicyPurchase.html'
			})
			.when('/travelpolicypurchase', {
				controller: 'travelPolicyPurchaseController',
				templateUrl: wp_path + 'buy/travel/html/TravelPolicyPurchase.html'
			})
			.when('/bikepolicypurchase', {
				controller: 'twoWheelerPolicyPurchaseController',
				templateUrl: wp_path + 'buy/bike/html/twoWheelerPolicyPurchase.html'
			})
			.when('/iquoteNavigation', {
				controller: 'iquoteNavigationController',
				templateUrl: wp_path + 'buy/common/html/iquoteNavigation.html'
			})
			/**
		  * paymentMobile route is specific to MobileApp and it uses
		  * ngFormCommit directive.Pls,don't modify this route
		  */
			.when('/paymentMobile', {
				controller: 'paymentMobileController',
				templateUrl: wp_path + 'buy/paymentMobile/paymentMobile.html'
			})
			
			.otherwise({ redirectTo: '/professionalJourney' });
	}])
	.run(['$rootScope', '$location', '$cookieStore', '$http', '$mdDialog',
		function ($rootScope, $location, $cookieStore, $http, $mdDialog) {
			$http.defaults.useXDomain = true;
			// keep user logged in after page refresh
			$rootScope.globals = $cookieStore.get('globals') || {};
			if ($rootScope.globals.currentUser) {
				$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
			}

			
			// Listener to watch route changes. Redirect to home page when reload event triggered.
			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				console.log('$location.path',$location.path());
				var urlPattern = $location.path();
				$rootScope.hideBackButton = true;
				$rootScope.landingFlag = false;
				//$rootScope.logoLoader = false;
				$rootScope.hideForInit = 'showOnLoad';
				if(urlPattern =="/healthLanding" || urlPattern =="/lifeLanding"){
					$('#pagewrap').addClass('landing');
					//$('#menu-footer-menu').addClass('landing');
					
				}
				$('#headerwrap').show();
				$('#footerwrap').show();

				if (customEnvEnabled || wordPressEnabled) {
					if (wordPressEnabled) {
						if (urlPattern != "/dashboard" && urlPattern != "/medicalPurchasing" && urlPattern != "/carpolicypurchase" && urlPattern != "/bikepolicypurchase" && urlPattern != "/lifePurchasing" && urlPattern != "/claims" && urlPattern != "/travelpolicypurchase") {
							if (window.location.href.indexOf("sign-in") > -1) {
								urlPattern = "/signIn";
							} else if (window.location.href.indexOf("contact-us") > -1) {
								urlPattern = "/contact";
							}else if (window.location.href.indexOf("claims") > -1) {
								urlPattern = "/claims";
							} else if (window.location.href.indexOf("logout") > -1) {
								urlPattern = "/logout";
							}
							//  else if (window.location.href.indexOf("-lifeproduct") > -1) {
							// 	urlPattern = "/lifeproduct";
							// } else if (window.location.href.indexOf("-carproduct") > -1) {
							// 	urlPattern = "/carproduct";
							// } else if (window.location.href.indexOf("-healthproduct") > -1) {
							// 	urlPattern = "/healthproduct";
							// } else if (window.location.href.indexOf("-bikeproduct") > -1) {
							// 	urlPattern = "/bikeproduct";
							// } else if (window.location.href.indexOf("-travelproduct") > -1) {
							// 	urlPattern = "/travelproduct";
							// } 
							else if (window.location.href.indexOf("payment/") > -1 && !p365Includes(paymentPageUrls, urlPattern)) {
								$rootScope.isCarProductTabClicked = true;
								$rootScope.reloadStatus = true;
								//$location.path('/PBQuote');
							} else if (window.location.href.indexOf("car/") > -1 && !p365Includes(carPageUrls, urlPattern)) {
								$rootScope.isCarProductTabClicked = true;
								$rootScope.reloadStatus = true;
								$rootScope.hideBackButton = false;
								$location.path('/PBQuote');
							} else if (window.location.href.indexOf("bike/") > -1 && !p365Includes(bikePageUrls, urlPattern)) {
								$rootScope.isBikeProductTabClicked = true;
								$rootScope.reloadStatus = true;
								$rootScope.hideBackButton = false;
								$location.path('/PBQuote');
							} else if (window.location.href.indexOf("health/") > -1 && !p365Includes(healthPageUrls, urlPattern)) {
								$rootScope.isHealthProductTabClicked = true;
								$rootScope.reloadStatus = true;
								$rootScope.hideBackButton = false;
								$location.path('/PBQuote');
							} else if (window.location.href.indexOf("term/") > -1 && !p365Includes(lifePageUrls, urlPattern)) {
								$rootScope.isLifeProductTabClicked = true;
								$rootScope.reloadStatus = true;
								$rootScope.hideBackButton = false;
								$location.path('/PBQuote');
							} else if (window.location.href.indexOf("travel/") > -1 && !p365Includes(travelPageUrls, urlPattern)) {
								$rootScope.isTravelProductTabClicked = true;
								$rootScope.reloadStatus = true;
								$location.path('/PBQuote');
							} else if (window.location.href.indexOf("criticalillness/") > -1  && !p365Includes(criticalIllnessPageUrls, urlPattern)) {
								$rootScope.isCriticalIllnessProductTabClicked = true;
								$rootScope.reloadStatus = true;
								$location.path('/PBQuote');
							} else if (window.location.href.indexOf("shareprofile/") > -1 && !p365Includes(professionalPageUrls, urlPattern) && !p365Includes(travelPageUrls, urlPattern) && !p365Includes(lifePageUrls, urlPattern) && !p365Includes(healthPageUrls, urlPattern)
							&& !p365Includes(bikePageUrls, urlPattern) && !p365Includes(carPageUrls, urlPattern) && !p365Includes(criticalIllnessPageUrls, urlPattern)) {
									$rootScope.reloadStatus = true;
									console.log("condition for professional Share API in layoutManager is working");
									$location.path('/professionalShareAPI');
							} else if (window.location.href.indexOf("sharequote/") > -1 && !p365Includes(travelPageUrls, urlPattern) && !p365Includes(lifePageUrls, urlPattern) && !p365Includes(healthPageUrls, urlPattern)
							&& !p365Includes(bikePageUrls, urlPattern) && !p365Includes(carPageUrls, urlPattern)  && !p365Includes(criticalIllnessPageUrls, urlPattern)) {
									$rootScope.reloadStatus = true;
									console.log("condition for quote Share API in layoutManager is working");
										$location.path('/sharefromAPI');																
							} else if (window.location.href.indexOf("ipos/") > -1 && !p365Includes(proposalPageUrls, urlPattern) && !p365Includes(travelPageUrls, urlPattern)
								&& !p365Includes(lifePageUrls, urlPattern) && !p365Includes(healthPageUrls, urlPattern)
								&& !p365Includes(bikePageUrls, urlPattern) && !p365Includes(carPageUrls, urlPattern)  && !p365Includes(criticalIllnessPageUrls, urlPattern)) {
								$rootScope.reloadStatus = true;								
							}
						}
					}

					if (urlPattern != "/critical-illness" && urlPattern != "/healthLanding" && urlPattern != "/lifeLanding" && urlPattern != "/personal-accident" &&
						urlPattern != "/claims" && urlPattern != "/logout" && urlPattern != "/contact" && urlPattern != "/signIn" &&
						urlPattern != "/quote" && urlPattern.indexOf("pay") == -1 && urlPattern.indexOf("proposalresdata") == -1 && urlPattern.indexOf("professionalShareAPI") == -1 && urlPattern.indexOf("sharefromAPI") == -1 &&
						urlPattern.indexOf("ipos") == -1 && (p365Includes(productPageUrls, urlPattern) == false) && !$rootScope.reloadStatus) {
							$location.path('/professionalJourney');
					} else {
						//for landing page campaign
						$rootScope.reloadStatus = true;
						if (wordPressEnabled) {
							if (urlPattern == "/signIn") {
								$location.path('/signIn');
							} else if (urlPattern == "/contact") {
								$location.path('/contact');
							} else if (urlPattern == "/claims") {
								$location.path('/claims');
							} else if (urlPattern == "/logout") {
								$location.path('/logout');
							} else if (p365Includes(productPageUrls, urlPattern)) {
								$location.path(urlPattern);
							}
						}
					}
				} else if (baseEnvEnabled && !wordPressEnabled) {
					if (urlPattern != "/claims" && urlPattern.indexOf("pay") == -1 && urlPattern.indexOf("proposalresdata") == -1 && urlPattern.indexOf("professionalShareAPI") == -1 && urlPattern.indexOf("sharefromAPI") == -1 && urlPattern.indexOf("dcpResult") == -1 && urlPattern.indexOf("ipos") == -1 && urlPattern.indexOf("iquoteNavigation") == -1 && !$rootScope.reloadStatus) {
						$rootScope.landingFlag = false;
						$location.path('/dcpResult');
					} else {
						$rootScope.reloadStatus = true;
					}
				}
				//for wordpress
				if (wordPressEnabled) {
					if (urlPattern != "/quote") {
						if (urlPattern.indexOf("pay") > 0) {
							$('.hideourpartners').hide();
							$('.hidetestimonials').hide();
							$('.hideonjs').show();
							$('.hideproductpagesection').show();
						} else {
							$('.hideonjs').hide();
							$('.hideourpartners').hide();
							$('.hidetestimonials').hide();
							$('.hideproductpagesection').hide();

						}
					} else {
						$('.hideonjs').show();
						$('.hideourpartners').show();
						$('.hidetestimonials').show();
						$('.hideproductpagesection').show();
					}
				}


			});

			$rootScope.datepickerOptions = { format: 'dd/mm/yyyy', language: 'en', autoclose: true, weekStart: 0 };
			$rootScope.rateit = 0;

			/*ngmaterial modal start */
			$rootScope.status = '  ';
			$rootScope.customFullscreen = false;

			$rootScope.P365Alert = function (dialogTitle, dialogBody, buttonCaption) {
				var ev = {
					"isTrusted": true
				};
				// Appending dialog to document.body to cover sidenav in docs app
				// Modal dialogs should fully cover application
				// to prevent interaction outside of dialog
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#popupContainer')))
						.clickOutsideToClose(true)
						.title('')
						.textContent(dialogBody)
						.ariaLabel('Alert Dialog Demo')
						.ok(buttonCaption)
						.targetEvent(ev)
				);
			};

			$rootScope.P365Confirm = function (dialogTitle, dialogBody, submitButtonCaption, cancelButtonCaption, callback) {
				var ev = {
					"isTrusted": true
				};
				// Appending dialog to document.body to cover sidenav in docs app
				var confirm = $mdDialog.confirm()
					.title(dialogTitle)
					.textContent(dialogBody)
					.ariaLabel('P365')
					.targetEvent(ev)
					.ok(submitButtonCaption)
					.cancel(cancelButtonCaption);

				$mdDialog.show(confirm).then(function () {
					callback(false);
				}, function () {
					callback(true);
				});
			};

			$rootScope.showPrompt = function () {
				var ev = {
					"isTrusted": true
				};
				// Appending dialog to document.body to cover sidenav in docs app
				var confirm = $mdDialog.prompt()
					.title('Policies365')
					.textContent('Policies365')
					.placeholder('Policies365')
					.ariaLabel('Policies365')
					.initialValue('Policies365')
					.targetEvent(ev)
					.ok('Ok!')
					.cancel('Cancel');

				$mdDialog.show(confirm).then(function (result) {
					$rootScope.status = 'Policies365 ' + result + '.';
				}, function () {
					$rootScope.status = 'Policies365';
				});
			};
			/*ngmaterial modal end */
		}])

	.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}
	])
	.config(function ($mdDateLocaleProvider) {
		$mdDateLocaleProvider.formatDate = function (date) {
			return date ? moment(date).format('DD/MM/YYYY') : '';
		};
	})
	.directive('resetDirective', ['$parse', function ($parse) {
		return function (scope, element, attr) {
			var fn = $parse(attr.resetDirective);
			var masterModel = angular.copy(fn(scope));

			// Error check to see if expression returned a model
			if (!fn.assign) {
				throw Error('Expression is required to be a model: ' + attr.resetDirective);
			}

			element.bind('reset', function (event) {
				scope.$apply(function () {
					fn.assign(scope, angular.copy(masterModel));
					scope.form.$setPristine();
				});

				// TODO: memoize prevention method
				if (event.preventDefault) {
					return event.preventDefault();
				}
				else {
					return false;
				}
			});
		};
	}])
	.directive('capitalizeFirst', function (uppercaseFilter, $parse) {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, modelCtrl) {
				var capitalize = function (inputValue) {
					if (inputValue != null && String(inputValue) != "undefined") {
						var capitalized = inputValue.charAt(0).toUpperCase() +
							inputValue.substring(1).toLowerCase();
						if (capitalized !== inputValue) {
							modelCtrl.$setViewValue(capitalized);
							modelCtrl.$render();
						}
						return capitalized;
					}
				}
				var model = $parse(attrs.ngModel);
				modelCtrl.$parsers.push(capitalize);
				capitalize(model(scope));
			}
		};
	})
	.directive('capitalize', function () {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, modelCtrl) {
				var capitalize = function (inputValue) {
					if (inputValue != null && String(inputValue) != "undefined") {
						var capitalized = inputValue.toUpperCase();
						if (capitalized !== inputValue) {
							modelCtrl.$setViewValue(capitalized);
							modelCtrl.$render();
						}
						return capitalized;
					}
				}
				modelCtrl.$parsers.push(capitalize);
				capitalize(scope[attrs.ngModel]); // capitalize initial value
			}
		};
	})
	.directive('sidebarDirective', function () {
		return {
			link: function (scope, element, attr) {
				scope.$watch(attr.sidebarDirective, function (newVal) {
					if (newVal) {
						element.addClass('show');
						return;
					}
					element.removeClass('show');
				});
			}
		};
	})
	.directive('simpleAccordion', function () {
		return {
			// attribute
			restrict: 'A',
			scope: {
				// default: '400ms'
				// options: 'milliseconds', 'slow', or 'fast'
				toggleSpeed: '@toggleSpeed',
				slideUpSpeed: '@slideUpSpeed',
				// default: 'swing'
				// options: 'swing', 'linear'
				toggleEasing: '@toggleEasing',
				slideUpEasing: '@slideUpEasing'
			},
			link: function (scope, element, attrs) {
				element.find('.accordion-toggle').click(function () {
					var elem = $(this);
					if (elem.hasClass("opened") == true) {
						$('.accordion-toggle').removeClass('opened');
					} else {
						$('.accordion-toggle').removeClass('opened');
						elem.addClass('opened');
					}

					elem.next().slideToggle(scope.toggleSpeed, scope.toggleEasing);
					$(".accordion-content").not($(this).next()).slideUp(scope.slideUpSpeed, scope.slideUpEasing);
				});
			}
		};
	})

	.directive('modalDialog', function () {
		return {
			restrict: 'E',
			scope: {
				show: '='
			},
			replace: true, // Replace with the template below
			transclude: true, // we want to insert custom content inside the directive
			link: function (scope, element, attrs) {
				scope.dialogStyle = {};
				if (attrs.width)
					scope.dialogStyle.width = attrs.width;
				if (attrs.height)
					scope.dialogStyle.height = attrs.height;
				scope.hideModal = function () {
					scope.show = false;
				};
			},
			template: "<div class='ng-modal' ng-show='show'> <div class='ng-modal-overlay' ng-click=''></div><div class='ng-modal-dialog wp_modelDialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
		};
	})
	.directive('counter', function () {
		return {
			restrict: 'A',
			scope: { value: '=value' },
			template: '<a href="javascript:;" class="counter-minus" ng-click="minus()">-</a>\
                            			   <input type="text" class="counter-field" ng-model="value" ng-change="changed()" >\
                            			   <a  href="javascript:;" class="counter-plus" ng-click="plus()">+</a>',
			link: function (scope, element, attributes) {
				// Make sure the value attribute is not missing.
				if (angular.isUndefined(scope.value)) {
					throw "Missing the value attribute on the counter directive.";
				}
				var min = angular.isUndefined(attributes.min) ? null : parseInt(attributes.min);
				var max = angular.isUndefined(attributes.max) ? null : parseInt(attributes.max);
				var step = angular.isUndefined(attributes.step) ? 1 : parseInt(attributes.step);
				element.addClass('counter-container');
				// If the 'editable' attribute is set, we will make the field editable.
				scope.readonly = angular.isUndefined(attributes.editable) ? true : false;
				/**
				 * Sets the value as an integer.
				 */
				var setValue = function (val) {
					scope.value = parseInt(val);
				}
				// Set the value initially, as an integer.
				setValue(scope.value);
				/**
				 * Decrement the value and make sure we stay within the limits, if defined.
				 */
				scope.minus = function () {
					if (min && (scope.value <= min || scope.value - step <= min) || min === 0 && scope.value < 1) {
						setValue(min);
						return false;
					}
					setValue(scope.value - step);
				};
				/**
				 * Increment the value and make sure we stay within the limits, if defined.
				 */
				scope.plus = function () {
					if (max && (scope.value >= max || scope.value + step >= max)) {
						setValue(max);
						return false;
					}
					setValue(scope.value + step);
				};
				/**
				 * This is only triggered when the field is manually edited by the user.
				 * Where we can perform some validation and make sure that they enter the
				 * correct values from within the restrictions.
				 */
				scope.changed = function () {
					// If the user decides to delete the number, we will set it to 0.
					if (!scope.value) setValue(0);
					// Check if what's typed is numeric or if it has any letters.
					if (/[0-9]/.test(scope.value)) {
						setValue(scope.value);
					}
					else {
						setValue(scope.min);
					}
					// If a minimum is set, let's make sure we're within the limit.
					if (min && (scope.value <= min || scope.value - step <= min)) {
						setValue(min);
						return false;
					}
					// If a maximum is set, let's make sure we're within the limit.
					if (max && (scope.value >= max || scope.value + step >= max)) {
						setValue(max);
						return false;
					}
					// Re-set the value as an integer.
					setValue(scope.value);
				};
			}
		}
	})
	.directive('expose', function () {
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="expose"></div>',
			link: function (scope, element, attr) {
				scope.$watch('expose', function (val) {
					if (val)
						$(element).show();
					else
						$(element).hide();
				});
			}
		}
	}).directive('bindHtmlCompile', ['$compile', function ($compile) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.$watch(function () {
					return scope.$eval(attrs.bindHtmlCompile);
				}, function (value) {
					// In case value is a TrustedValueHolderType, sometimes it
					// needs to be explicitly called into a string in order to
					// get the HTML string.
					element.html(value && value.toString());
					// If scope is provided use it, otherwise use parent scope
					var compileScope = scope;
					if (attrs.bindHtmlScope) {
						compileScope = scope.$eval(attrs.bindHtmlScope);
					}
					$compile(element.contents())(compileScope);
				});
			}
		};
	}])
	.directive("ngFormCommit", [function () {
		return {
			require: "form",
			link: function ($scope, $el, $attr, $form) {
				$form.setAction = function (formAction) {
					$el[0].action = formAction;
				};
				$form.commit = function () {
					$el[0].submit();
				};
			}
		};
	}])
	.directive('focusMe', function ($timeout) {
		return {
			link: function (scope, element, attrs) {
				scope.$watch(attrs.focusMe, function (value) {
					if (value === true) {
						//$timeout(function() {
						element[0].focus();
						scope[attrs.focusMe] = false;
						//});
					}
				});
			}
		};
	})
	.directive('tooltip', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				$(element).hover(function () {
					// on mouseenter
					$(element).tooltip('show');
				}, function () {
					// on mouseleave
					$(element).tooltip('hide');
				});
			}
		};
	})
	.directive('numbersOnly', function () {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, modelCtrl) {
				modelCtrl.$parsers.push(function (inputValue) {
					if (inputValue == undefined) return ''
					var transformedInput = inputValue.replace(/[^0-9]/g, '');
					if (transformedInput != inputValue) {
						modelCtrl.$setViewValue(transformedInput);
						modelCtrl.$render();
					}
					return transformedInput;
				});
			}
		};
	})
	.directive('noSpecialChar', function () {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, modelCtrl) {
				modelCtrl.$parsers.push(function (inputValue) {
					if (inputValue == undefined) return ''
					var transformedInput = inputValue.replace(/[^0-9a-zA-z]/g, '');
					if (transformedInput != inputValue) {
						modelCtrl.$setViewValue(transformedInput);
						modelCtrl.$render();
					}

					return transformedInput;
				});
			}
		};
	})
	.directive('charactersOnly', function () {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, modelCtrl) {
				modelCtrl.$parsers.push(function (inputValue) {
					if (inputValue == undefined) return ''
					var transformedInput = inputValue.replace(/[^a-zA-z]/g, '');
					if (transformedInput != inputValue) {
						modelCtrl.$setViewValue(transformedInput);
						modelCtrl.$render();
					}

					return transformedInput;
				});
			}
		};
	})
	.directive('googleplace', function () {
		return {
			require: 'ngModel',
			scope: {
				ngModel: '=',
				details: '=?'
			},
			link: function (scope, element, attrs, model) {
				var options = {
					types: [],
					componentRestrictions: { country: ["in"] }
				};
				scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

				google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
					scope.$apply(function () {
						scope.details = scope.gPlace.getPlace();
						//model.$setViewValue(element.val());
						scope.$emit("setCommAddressByAPI", {});
					});
				});
			}
		};
	})
	.directive('googleregplace', function () {
		return {
			require: 'ngModel',
			scope: {
				ngModel: '=',
				details: '=?'
			},
			link: function (scope, element, attrs, model) {
				var options = {
					types: [],
					componentRestrictions: { country: ["in"] }
				};
				scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

				google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
					scope.$apply(function () {
						scope.details = scope.gPlace.getPlace();
						//model.$setViewValue(element.val());
						scope.$emit("setRegAddressByAPI", {});
					});
				});
			}
		};
	})
	.directive('loading', function () {
		return {
			restrict: 'E',
			replace: true,
			//template: "<div class='loading'><div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>",
			// template: "<div class='loading'><div class='cs-loader'><div class='cs-loader-inner'><label> &#9679;</label><label> &#9679;</label><label> &#9679;</label><label> &#9679;</label><label> &#9679;</label><label> &#9679;</label></div></div></div>",
			//template: "<div  class='loading'><div class='loaderPlacer'><img ng-if='!$root.wordPressEnabled' ng-src='{{$root.wp_path}}img/{{loaderContent.businessLine}}.gif'><img ng-if='$root.wordPressEnabled && !$root.professionalJourney' ng-src='{{$root.wp_path}}img/loader.gif'><p ng-if='!$root.wordPressEnabled' class='title'>{{loaderContent.header}}</p><div ng-if='!$root.wordPressEnabled' ng-bind-html='loaderContent.desc' bind-html-compile='loaderContent.desc' class=subTitle></div></div> <div class='spinner' ng-if='$root.professionalJourney'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div></div>",
			template: "<div  class='loading'><div class='loaderPlacer'><div class='spinner'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div></div></div>",
			link: function (scope, element, attr) {

				scope.$watch('loading', function (val) {
					if (val)
						$(element).show();
					else
						$(element).hide();
				});
			}
		}
	})
	.directive('afterRender', ['$timeout', function ($timeout) {
		var def = {
			restrict: 'A',
			terminal: true,
			transclude: false,
			link: function (scope, element, attrs) {
				$timeout(scope.$eval(attrs.afterRender), 5000);  //Calling a scoped method
			}
		};
		return def;
	}])
	.directive('p365Chart', function () {
		return {
			restrict: 'E',
			replace: false,
			require: '?items',
			scope: {
				items: '=',
				chartType: '=',
				chartTitle: '=',
				xaxis: '=',
				yAxisTitle: '=',
				displayWidth: "=displayWidth",
				displayHeight: "=displayHeight"
			},
			controller: function ($scope, $element, $attrs) {
			},
			template: "<div id='ChartContainer' style='margin: 0 auto'>not working</div>",
			link: function (scope, element, attrs) {
				var themeColors = new Array(scope.items.length);
				for (let index = 0; index < scope.items.length; index++) {
					const element = scope.items[index];
					var colorCode = '';
					if (element.name.toLowerCase() == 'comprehensive') {
						colorCode = '#2f88e0';
					} else if (element.name.toLowerCase() == 'recommended') {
						colorCode = '#f1558e';
					} else {
						colorCode = '#8fec7c';
					}
					themeColors[index] = colorCode;
				}

				var chart = Highcharts.chart(element[0], {
					chart: {
						renderTo: element[0],
						type: scope.chartType,
						backgroundColor: 'transparent'
					},
					title: {
						text: scope.chartTitle
					},
					tooltip: {
						borderRadius: 8,
						borderWidth: 2,
						useHTML: true,
						formatter: function () {
							return "Sum Insured :<b>&#8377;&nbsp;" + this.point.ammount + "<b>";
						}

					},
					xAxis: {
						tickPixelInterval: 1,
						categories: scope.xaxis
					},
					colors: themeColors,
					yAxis: {
						min: 0,
						title: {
							text: scope.yAxisTitle
						}
					},
					legend: {
						align: 'center',
						itemDistance: 2,
						width: 300,
						itemStyle: {
							fontWeight: 'normal',
							fontSize: '11px'
						}

					},
					plotOptions: {
						series: {
							stacking: 'percent',
							pointWidth: 20,
							pointPadding: 0
						}
					},
					credits: {
						enabled: false
					},
					series: scope.items
				})
				chart.setSize(scope.displayWidth, scope.displayHeight);
			}
		}
	})
	.directive('p365PieChart', function () {
		return {
			restrict: 'E',
			replace: false,
			require: '?items',
			scope: {
				items: '=',
				chartTitle: '=',
				displayLegends: '=displayLegends',
				displayLables: '=displayLables',
				displayWidth: "=displayWidth",
				displayHeight: "=displayHeight",
				innerSize: "=innerSize",
				pieSize:"=pieSize"
			},
			controller: function ($scope, $element, $attrs) {
			},
			template: "<div class='PieChartContainer' style='margin: 0 auto'>not working</div>",
			link: function (scope, element, attrs) {
				var themeColors = new Array(scope.items.length);
				var highRiskCount = 0;
				var mediumRiskCount = 0;
				var lowRiskCount = 0;
				var innerPieSize = (scope.innerSize) ? scope.innerSize+'%' : '60%';
				var outerPieSize = (scope.pieSize) ? scope.pieSize+'%' : '100%';
				for (let index = 0; index < scope.items.length; index++) {
					const element = scope.items[index];
					var colorCode = '';
					if (element.riskPriority.toLowerCase() == 'very high') {
						colorCode = '#fe0000';
					} else if (element.riskPriority.toLowerCase() == 'high') {
						colorCode = '#fc005a';
					} else if (element.riskPriority.toLowerCase() == 'medium') {
						colorCode = '#00b7eb';
					} else if (element.riskPriority.toLowerCase() == 'low') {
						colorCode = '#fed966';
					} else if (element.riskPriority.toLowerCase() == 'very low') {
						colorCode = '#c4c038';
					}
					themeColors[index] = colorCode;
				}
				var chart = Highcharts.chart(element[0], {
					chart: {
						// renderTo:'PieChartContainer',
						renderTo: element[0],
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'pie',
						backgroundColor: 'transparent'
					},
					title: {
						text: scope.chartTitle
					},
					tooltip: {
						pointFormat: '{point.riskPriority}',
						borderRadius: 8,
						borderWidth: 2
					},
					colors: themeColors,
					plotOptions: {
						pie: {
							innerSize: innerPieSize,
							depth: 50,
							size: outerPieSize,
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: scope.displayLables,
								useHTML: true,
								style:{
									width:'100px'
								},
								// formatter: function () {
								// 	return "<span class='font12'>"+this.point.name+""+Number(this.point.percentage)+" %</span>";
								// }
								format:'<span style="font-size:10px;">{point.name}: <span style="color:{point.color}">{point.riskPriority}</span></span>'
							},
							showInLegend: scope.displayLegends
						}
					},
					credits: {
						enabled: false
					},
					series: [{
						name: 'Risk',
						colorByPoint: true,
						data: scope.items
					}]
				})

				chart.setSize(scope.displayWidth, scope.displayHeight);
			}

		}
	})
	.service('anchorSmoothScroll', function () {

		this.scrollTo = function (eID) {

			// This scrolling function
			// is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

			var startY = currentYPosition();
			var stopY = elmYPosition(eID);
			var distance = stopY > startY ? stopY - startY : startY - stopY;
			if (distance < 100) {
				scrollTo(0, stopY); return;
			}
			var speed = Math.round(distance / 100);
			if (speed >= 20) speed = 20;
			var step = Math.round(distance / 25);
			var leapY = stopY > startY ? startY + step : startY - step;
			var timer = 0;
			if (stopY > startY) {
				for (var i = startY; i < stopY; i += step) {
					setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
					leapY += step; if (leapY > stopY) leapY = stopY; timer++;
				} return;
			}
			for (var i = startY; i > stopY; i -= step) {
				setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
				leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
			}

			function currentYPosition() {
				// Firefox, Chrome, Opera, Safari
				if (self.pageYOffset) return self.pageYOffset;
				// Internet Explorer 6 - standards mode
				if (document.documentElement && document.documentElement.scrollTop)
					return document.documentElement.scrollTop;
				// Internet Explorer 6, 7 and 8
				if (document.body.scrollTop) return document.body.scrollTop;
				return 0;
			}

			function elmYPosition(eID) {
				var elm = document.getElementById(eID);
				var y = elm.offsetTop;
				var node = elm;
				while (node.offsetParent && node.offsetParent != document.body) {
					node = node.offsetParent;
					y += node.offsetTop;
				} return y;
			}

		};

	})
	//filter for indian currency format
	/*.filter('regexINR', function() {
		return function(val){
			if(val!=undefined){
				 val=val.toString().replace(/\,/g, '');
				 var lastThree = val.substring(val.length-3);
				 var otherNumbers = val.substring(0,val.length-3);
				 if(otherNumbers != '')
					 lastThree = ',' + lastThree;
				 var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
				 return res;
			}
		};
	 })*/
	//filter for indian currency format
	.filter('regexINR', function () {
		return function (val) {
			if (val != undefined) {
				val = val.toString().replace(/\,/g, '');
				var afterPoint = '';
				if (val.indexOf('.') > 0)
					afterPoint = val.substring(val.indexOf('.'), val.length);
				val = Math.floor(val);
				val = val.toString();
				var lastThree = val.substring(val.length - 3);
				var otherNumbers = val.substring(0, val.length - 3);
				if (otherNumbers != '')
					lastThree = ',' + lastThree;
				var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
				return res;
			}
		};
	});


