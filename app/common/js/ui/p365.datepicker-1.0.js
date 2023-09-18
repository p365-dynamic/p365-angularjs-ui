angular.module('ui.date', [])

.constant('uiDateConfig', {})
.directive('p365DatePicker', ['uiDateConfig', '$timeout', function (uiDateConfig, $timeout) {
	'use strict';
	var options;
	options = {};
	angular.extend(options, uiDateConfig);
	return {
		require:'?ngModel',
		link:function (scope, element, attrs, controller) {
			var getOptions = function () {
				return angular.extend({}, uiDateConfig, scope.$eval(attrs.p365DatePicker));
			};
			var initDateWidget = function () {
				var showing = false;
				var opts = getOptions();

				// If we have a controller (i.e. ngModelController) then wire it up
				if (controller) {

					// Set the view value in a $apply block when users selects
					// (calling directive user's function too if provided)
					var _onSelect = opts.onSelect || angular.noop;
					opts.onSelect = function (value, picker) {
						scope.$apply(function() {
							var date = element.datepicker("getDate");
							if(String(date) != "undefined"){
								convertDateFormatToString(date, function(formattedDate){
									showing = true;
									controller.$setViewValue(formattedDate);
									_onSelect(value, picker);
									element.blur();
								});
							}
						});
					};
					opts.beforeShow = function() {
						showing = true;
					};
					opts.onClose = function(value, picker) {
						showing = false;
					};

					// Update the date picker when the model changes
					controller.$render = function () {
						var date = controller.$viewValue;
						if(String(date) != "undefined"){
							convertStringFormatToDate(date, function(formattedDate){
								if ( angular.isDefined(formattedDate) && formattedDate !== null && !angular.isDate(formattedDate) ) {
									throw new Error('ng-Model value must be a Date object - currently it is a ' + typeof formattedDate + ' - use ui-date-format to convert it from a string');
								}
								element.datepicker("setDate", date);
							});
						}
					};
				}
				// If we don't destroy the old one it doesn't update properly when the config changes
				element.datepicker('destroy');
				// Create the new datepicker widget
				element.datepicker(opts);
				if ( controller ) {
					// Force a render to override whatever is in the input text box
					controller.$render();
				}
			};
			// Watch for changes to the directives options
			scope.$watch(getOptions, initDateWidget, true);
		}
	};
}
]);
