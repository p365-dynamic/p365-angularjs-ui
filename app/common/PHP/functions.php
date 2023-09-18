<?php
//for angular init
	
	wp_enqueue_style( 'jqueryUI', get_theme_file_uri( '/app/css/jquery-ui.css' ));
	wp_enqueue_style( 'bootstrap', get_theme_file_uri( '/app/css/bootstrap.css' ));
	wp_enqueue_style( 'fAwesome', get_theme_file_uri( '/app/css/font-awesome.min.css' ));
	wp_enqueue_style( 'style', get_theme_file_uri( '/app/css/style_WP.css' ));
	wp_enqueue_style( 'responsive', get_theme_file_uri( '/app/css/responsive.css' ));
	wp_enqueue_style( 'responsiveStyle', get_theme_file_uri( '/app/css/responsiveStyle.css' ));
	wp_enqueue_style( 'col', get_theme_file_uri( '/app/css/col.css' ));
	//wp_enqueue_style( 'elastislide', get_theme_file_uri( '/app/css/elastislide.css' ));
	wp_enqueue_style( 'modal', get_theme_file_uri( '/app/css/modal.css' ));
	wp_enqueue_style( 'ng-rateit', get_theme_file_uri( '/app/css/ng-rateit.css' ));
	//wp_enqueue_style( 'datepicker', get_theme_file_uri( '/app/css/datepicker.css' ));
	wp_enqueue_style( 'angular-carousel', get_theme_file_uri( '/app/css/angular-carousel.css' ));
	wp_enqueue_style( 'datepicker', get_theme_file_uri( '/app/css/datepicker.css' ));
	wp_enqueue_style( 'opensans', get_theme_file_uri( '/app/css/opensans.css' ));
	wp_enqueue_style( 'fontcssMaterial', get_theme_file_uri( '/app/css/fontcssMaterial.css' ));
	wp_enqueue_style( 'angular-material', get_theme_file_uri( '/app/css/angular-material.css' ));
	wp_enqueue_style( 'material', get_theme_file_uri( '/app/material.min.css' ));
	wp_enqueue_style( 'slick', get_theme_file_uri( '/app/css/slick.css' ));
	wp_register_style( 'ng-material', 'https://fonts.googleapis.com/icon?family=Material+Icons' );
    	wp_enqueue_style('ng-material');
	
	//js
	wp_enqueue_script('jQueryMain', get_template_directory_uri() .'/app/common/js/ui/jquery.js');
	//wp_enqueue_script('jQueryMain', get_template_directory_uri() .'/app/common/js/ui/jquery-3.2.1.min.js');
	
	wp_enqueue_script('jQueryUI', get_template_directory_uri() .'/app/common/js/ui/jquery-ui.js');
	wp_enqueue_script('crypto', get_template_directory_uri() .'/app/common/js/ui/crypto-aes.js');
	wp_enqueue_script('dropDownManager', get_template_directory_uri() .'/app/common/js/DropdownListManager.js');
	wp_enqueue_script('transaction', get_template_directory_uri() .'/app/common/js/transaction.js');
	wp_enqueue_script('ApplicationCommonFunctions', get_template_directory_uri() .'/app/common/js/ApplicationCommonFunctions.js');
	wp_enqueue_script('p365Analytics', get_template_directory_uri() .'/app/common/js/ui/p365.analytics.js');
	wp_enqueue_script('modernizr', get_template_directory_uri() .'/app/common/js/ui/modernizr.custom.17475.js');
	wp_enqueue_script('elastislide', get_template_directory_uri() .'/app/common/js/ui/jquery.elastislide.js');
	wp_enqueue_script('masonry', get_template_directory_uri() .'/app/common/js/ui/masonry.pkgd.min.js');
	wp_enqueue_script('elastislide', get_template_directory_uri() .'/app/common/js/ui/jquery.elastislide.js');
	
	wp_enqueue_script('main', get_template_directory_uri() .'/app/common/js/ui/main.js');
	wp_enqueue_script('easing', get_template_directory_uri() .'/app/common/js/ui/easing.js');
	wp_enqueue_script('angularjs', get_template_directory_uri() .'/app/common/js/ui/angular.js');
	wp_enqueue_script('angularjs-route', get_template_directory_uri() .'/app/common/js/ui/angular-route.js');
	wp_enqueue_script('angular-touch', get_template_directory_uri() .'/app/common/js/ui/angular-touch.js');
	wp_enqueue_script('angular-cookies', get_template_directory_uri() .'/app/common/js/ui/angular-cookies.js');
	wp_enqueue_script('angular-animate', get_template_directory_uri() .'/app/common/js/ui/angular-animate.js');
	wp_enqueue_script('aria', get_template_directory_uri() .'/app/common/js/ui/angular-aria.min.js');
	wp_enqueue_script('messages', get_template_directory_uri() .'/app/common/js/ui/angular-messages.js');
	wp_enqueue_script('dirPagination', get_template_directory_uri() .'/app/common/js/ui/dirPagination.js');
	wp_enqueue_script('angular-filter', get_template_directory_uri() .'/app/common/js/ui/angular-filter.js');
	wp_enqueue_script('ang-accordion', get_template_directory_uri() .'/app/common/js/ui/ang-accordion.js');
	wp_enqueue_script('angular-carousel', get_template_directory_uri() .'/app/common/js/ui/angular-carousel.js');
	wp_enqueue_script('angular-sanitize', get_template_directory_uri() .'/app/common/js/ui/angular-sanitize.js');
	wp_enqueue_script('counter', get_template_directory_uri() .'/app/common/js/ui/counter.js');
	wp_enqueue_script('ngRate', get_template_directory_uri() .'/app/common/js/ui/ng-rateit.js');

	
	wp_enqueue_script('lodash', get_template_directory_uri() .'/app/common/js/ui/lodash.js');
	wp_enqueue_script('dropDown', get_template_directory_uri() .'/app/common/js/ui/angularjs-dropdown-multiselect.js');
	wp_enqueue_script('ui-bootstrap-tpls', get_template_directory_uri() .'/app/common/js/ui/ui-bootstrap-tpls-0.6.0.js');
	wp_enqueue_script('ApplicationLayoutManager', get_template_directory_uri() .'/app/common/js/ui/ApplicationLayoutManager.js');
	wp_enqueue_script('loki-indexed-adapter', get_template_directory_uri() .'/app/common/js/loki-indexed-adapter.min.js ');
	wp_enqueue_script('lokijs', get_template_directory_uri() .'/app/common/js/lokijs.min.js ');
	wp_enqueue_script('idep-encryption-standards', get_template_directory_uri() .'/app/common/js/ui/idep-encryption-standards.js ');
	wp_enqueue_script('idep-encryption-algorithm', get_template_directory_uri() .'/app/common/js/ui/idep-encryption-algorithm.js ');
	wp_enqueue_script('custom-idep-localstorage', get_template_directory_uri() .'/app/common/js/custom-idep-localstorage.js ');
	wp_enqueue_script('checklist-model', get_template_directory_uri() .'/app/common/js/ui/checklist-model.js ');
	wp_enqueue_script('bootstrap-select', get_template_directory_uri() .'/app/common/js/ui/bootstrap-select.js ');
	wp_enqueue_script('bootstrap', get_template_directory_uri() .'/app/common/js/ui/bootstrap.min.js ');
	wp_enqueue_script('angular-mailto', get_template_directory_uri() .'/app/common/js/ui/angular-mailto.js ');
	
	wp_enqueue_script('olarkChat', get_template_directory_uri() .'/app/common/js/ui/olarkChat.js ');
	wp_enqueue_script('gcm_service_worker', get_template_directory_uri() .'/app/common/js/ui/gcm_service_worker.js ');
	wp_enqueue_script('fb_tracking', get_template_directory_uri() .'/app/common/js/ui/fb_tracking.js ');
	wp_enqueue_script('circles', get_template_directory_uri() .'/app/common/js/ui/circles.js ');
	wp_enqueue_script('angular-circles', get_template_directory_uri() .'/app/common/js/ui/angular-circles.js ');
	wp_enqueue_script('angularMaterial', get_template_directory_uri() .'/app/common/js/ui/angular-material.js');
	wp_enqueue_script('impetus', get_template_directory_uri() .'/app/common/js/ui/impetus.js');
	wp_enqueue_script('scrollable', get_template_directory_uri() .'/app/common/js/ui/scrollable.js');
	wp_enqueue_script('moment', get_template_directory_uri() .'/app/common/js/ui/moment.js');
	wp_enqueue_script('p365.datepicker-1.0', get_template_directory_uri() .'/app/common/js/ui/p365.datepicker-1.0.js');
	wp_enqueue_script('slick', get_template_directory_uri() .'/app/common/js/ui/slick.js');
	wp_enqueue_script('slickDirective', get_template_directory_uri() .'/app/common/js/ui/slick-directive.js');
	wp_enqueue_script('ngMeta', get_template_directory_uri() .'/app/common/js/ui/ngMeta.js');
	

	wp_enqueue_script('headerController', get_template_directory_uri() .'/app/buy/common/js/headerController.js');
	wp_enqueue_script('coreComponent', get_template_directory_uri() .'/app/common/js/CoreComponents.js');
	wp_enqueue_script('ContantUsController', get_template_directory_uri() .'/app/common/js/ContantUsController.js');
	wp_enqueue_script('TermsController', get_template_directory_uri() .'/app/common/js/TermsController.js');
	wp_enqueue_script('PrivacyPolicyController', get_template_directory_uri() .'/app/common/js/PrivacyPolicyController.js');
	wp_enqueue_script('DashboardController', get_template_directory_uri() .'/app/common/js/DashboardController.js');
	wp_enqueue_script('claimsController', get_template_directory_uri() .'/app/buy/common/js/claimsController.js');
	wp_enqueue_script('PaySuccessController', get_template_directory_uri() .'/app/buy/common/js/PaySuccessController.js');
	wp_enqueue_script('PayFailureController', get_template_directory_uri() .'/app/buy/common/js/PayFailureController.js');
	wp_enqueue_script('proposalResponseDataController', get_template_directory_uri() .'/app/buy/common/js/proposalResponseDataController.js');
	wp_enqueue_script('iposController', get_template_directory_uri() .'/app/buy/common/js/iposController.js');
	wp_enqueue_script('ShareQuoteByEmailController', get_template_directory_uri() .'/app/buy/common/js/ShareQuoteByEmailController.js');
	wp_enqueue_script('campaignController', get_template_directory_uri() .'/app/buy/common/js/campaignController.js');
	wp_enqueue_script('paymentMobileCtrl', get_template_directory_uri() .'/app/buy/paymentMobile/paymentMobileCtrl.js');
	wp_enqueue_script('GetQuoteTemplateController', get_template_directory_uri() .'/app/buy/common/js/GetQuoteTemplateController.js');

	wp_enqueue_script('lifeController', get_template_directory_uri() .'/app/buy/life/js/AssuranceInstantQuoteController.js');
	wp_enqueue_script('landingPageController', get_template_directory_uri() .'/app/buy/landingPange/landingPageController.js');

	wp_enqueue_script('AssuranceResultController', get_template_directory_uri() .'/app/buy/life/js/AssuranceResultController.js');
	wp_enqueue_script('AssurancePaySuccessController', get_template_directory_uri() .'/app/buy/life/js/AssurancePaySuccessController.js');
	wp_enqueue_script('AssurncePayFailureController', get_template_directory_uri() .'/app/buy/life/js/AssurncePayFailureController.js');
	wp_enqueue_script('AssuranceBuyProductController', get_template_directory_uri() .'/app/buy/life/js/AssuranceBuyProductController.js');
	wp_enqueue_script('AssurancePurchasingStatementController', get_template_directory_uri() .'/app/buy/life/js/AssurancePurchasingStatementController.js');
	
	wp_enqueue_script('FourWheelerInstantQuoteController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerInstantQuoteController.js');
	wp_enqueue_script('FourWheelerResultController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerResultController.js');
	wp_enqueue_script('FourWheelerPaySuccessController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerPaySuccessController.js');
	wp_enqueue_script('FourWheelerPayFailureController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerPayFailureController.js');
	wp_enqueue_script('FourWheelerBuyProductController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerBuyProductController.js');
	wp_enqueue_script('FourWheelerscheduleInspectionController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerscheduleInspectionController.js');
	wp_enqueue_script('FourWheelerPolicyPurchaseController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerPolicyPurchaseController.js');
	wp_enqueue_script('FourWheelerResponseDataController', get_template_directory_uri() .'/app/buy/car/js/FourWheelerResponseDataController.js');

	wp_enqueue_script('TwoWheelerInstantQuoteController', get_template_directory_uri() .'/app/buy/bike/js/TwoWheelerInstantQuoteController.js');
	wp_enqueue_script('TwoWheelerResultController', get_template_directory_uri() .'/app/buy/bike/js/TwoWheelerResultController.js');
	wp_enqueue_script('TwoWheelerPaySuccessController', get_template_directory_uri() .'/app/buy/bike/js/TwoWheelerPaySuccessController.js');
	wp_enqueue_script('TwoWheelerPayFailureController', get_template_directory_uri() .'/app/buy/bike/js/TwoWheelerPayFailureController.js');
	wp_enqueue_script('TwoWheelerPolicyPurchaseController', get_template_directory_uri() .'/app/buy/bike/js/TwoWheelerPolicyPurchaseController.js');
	wp_enqueue_script('TwoWheelerBuyProductController', get_template_directory_uri() .'/app/buy/bike/js/TwoWheelerBuyProductController.js');
	wp_enqueue_script('TwoWheelerResponseDataController', get_template_directory_uri() .'/app/buy/bike/js/TwoWheelerResponseDataController.js');
		
	wp_enqueue_script('healthController', get_template_directory_uri() .'/app/buy/health/js/MedicalInstantQuoteController.js');
	wp_enqueue_script('MedicalPropsalRequest', get_template_directory_uri() .'/app/buy/health/js/MedicalPropsalRequest.js');
	wp_enqueue_script('MedicalResultController', get_template_directory_uri() .'/app/buy/health/js/MedicalResultController.js');
	wp_enqueue_script('MedicalPaySuccessController', get_template_directory_uri() .'/app/buy/health/js/MedicalPaySuccessController.js');
	wp_enqueue_script('MedicalBuyProductController', get_template_directory_uri() .'/app/buy/health/js/MedicalBuyProductController.js');
	wp_enqueue_script('MedicalPayFailureController', get_template_directory_uri() .'/app/buy/health/js/MedicalPayFailureController.js');
	wp_enqueue_script('medicalPurchasingController', get_template_directory_uri() .'/app/buy/health/js/medicalPurchasingController.js');
	wp_enqueue_script('MedicalResponseDataHealthController', get_template_directory_uri() .'/app/buy/health/js/MedicalResponseDataHealthController.js');
	
	wp_enqueue_script('TravelInstantQuoteController', get_template_directory_uri() .'/app/buy/travel/js/TravelInstantQuoteController.js');
	
	wp_register_script( 'googleApi', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCHs_Er19ZT9lozf3_yFlxkFncMqHUEbd8&libraries=places', null, null, true );
	wp_enqueue_script('googleApi');
	//,array( 'angularjs', 'angularjs-route' )
	
	// With get_stylesheet_directory_uri()
	wp_localize_script('ApplicationLayoutManager', 'localized',
				array(
					'partials' =>  get_template_directory_uri() . '/app/'
					//'partials' => 'http://p365dev.infintus.com/wp-content/themes/themify-ultra/app/'

					)
		);
		
	//End angular

?>
	
