'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', '$location', 
	function($scope, Authentication, Menus, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);