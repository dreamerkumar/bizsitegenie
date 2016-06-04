'use strict';


angular.module('core').controller('BaseController', ['$rootScope', '$scope', 'Authentication', 'Menus', 'GetUserRoles', 'Roles',
	function($rootScope, $scope, Authentication, Menus, GetUserRoles, Roles) {
		
		var body = angular.element(document).find('body');
		$scope.menu = Menus.getMenu('topbar');

		// This provides Authentication context
		function isAuthenticated() {
			return Authentication && Authentication.user;
		}

		// Update background image based on whether user is still authenticated or not
		// Also update the flag isAuthenticated which is currently used to show or hide the top nav bar
		function setBackgroundImgClassAndHeader() {
			$scope.isAuthenticated = isAuthenticated();
		}

		setBackgroundImgClassAndHeader();


		$scope.$on('$stateChangeSuccess', function() {
			setBackgroundImgClassAndHeader();
			$rootScope.displayExpandedView = false; //will be set specificaly by the dashboard page
		});

		$scope.$watch('isAuthenticated', function(){
			if($scope.isAuthenticated){
				$scope.roleCheckDone = false;
				$scope.userRoles = GetUserRoles.get();
				Roles.buildRoleStatus(function(roleStatus){
					$scope.buildRoleDoesNotExist = !roleStatus.exists;
					$scope.roleCheckDone = true;
				});	
			} else {
				$scope.userRoles = {};
			}
		});
	}
]);