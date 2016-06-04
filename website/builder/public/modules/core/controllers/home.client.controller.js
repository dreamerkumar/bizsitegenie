'use strict';

angular.module('apps').controller('HomeController', ['$scope', '$stateParams', '$window', '$interval',  'Authentication', 'Apps',
	function($scope, $stateParams, $window, $interval, Authentication, Apps) {
		$scope.authentication = Authentication;

		$scope.onLoadOfHomePage = function() {
			if(!$scope.authentication || !$scope.authentication.user){
				$window.location.href = '/';
				return;
			}
		};
	}
]);