'use strict';


angular.module('core').controller('BaseController', ['$scope', 'Authentication', 'Menus', 
	function($scope, Authentication, Menus) {
		
		var body = angular.element(document).find('body');
		$scope.menu = Menus.getMenu('topbar');

		// This provides Authentication context
		function isAuthenticated() {
			return Authentication && Authentication.user;
		}

		// Update background image based on whether user is still authenticated or not
		// Also update the flag isAuthenticated which is currently used to show or hide the top nav bar
		function setBackgroundImgClassAndHeader() {
			var homeBackgroundClass = 'home-background';
			$scope.isAuthenticated = isAuthenticated();
			if(!$scope.isAuthenticated){
				body.addClass(homeBackgroundClass);
			} else {
				body.removeClass(homeBackgroundClass);
			}
		}

		setBackgroundImgClassAndHeader();


		$scope.$on('$stateChangeSuccess', function() {
			setBackgroundImgClassAndHeader();
		});


	}
]);