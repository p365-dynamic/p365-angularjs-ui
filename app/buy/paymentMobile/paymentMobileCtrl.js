/*paymentMobileController Controller*/
angular.module('policies365')
    .controller('paymentMobileController',
    ['$scope', '$window', '$rootScope', '$location', '$http', 'RestAPI', 'localStorageService', '$timeout', '$routeParams',
        function ($scope, $window, $rootScope, $location, $http, RestAPI, localStorageService, $timeout, $routeParams) {


            $rootScope.title = "Routing to Payment Gateway";
            var response = JSON.parse($location.search().responseParams);
            $scope.paymentServiceResponse = response;
            localStorage.setItem('selectedBusinessLineId', response.businessLineId);
            //based on isFromMobileApp value, we're rendering differnt template in paysuccess, payfailure page
            localStorage.setItem('isFromMobileApp', true);
            $timeout(function () {
                $scope.paymentForm.setAction($scope.paymentServiceResponse.paymentURL);
                $scope.paymentForm.commit();
            }, 100);

        }]);