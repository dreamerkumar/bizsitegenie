'use strict';


angular.module('core').controller('BaseController', ['$scope', 'Authentication', 'Menus', 'GetUserRoles', 'BuilderSetup', '$window', '$rootScope',
	function($scope, Authentication, Menus, GetUserRoles, BuilderSetup, $window, $rootScope) {

		var errFn = function(errorResponse) {
			var err = 'An error occured: ';
			if(errorResponse && errorResponse.data && errorResponse.data.message){
				err = err + errorResponse.data.message;
			} else {
				err = err + errorResponse;
			}
			$scope.error = err;
		};

		var body = angular.element(document).find('body');
		$scope.menu = Menus.getMenu('topbar');

		$scope.$on('$stateChangeSuccess', function() {
			$scope.isAuthenticated = Authentication && Authentication.user;
			$rootScope.displayExpandedView = false; //will be set specificaly by pages that need to display expanded

		});

		$scope.$watch('isAuthenticated', function(){
			if($scope.isAuthenticated){

				BuilderSetup.get(function(response){

					$scope.appId = response.appId;
					 GetUserRoles.get(function(userRoles){
						$scope.userRoles = userRoles;
						$scope.userDoesNotHaveAccessToConfigure = !userRoles.build;
					});

				},function(errorResponse) {
					$scope.userRoles = {};
					var err = 'An error occured: ';
					if(errorResponse && errorResponse.data && errorResponse.data.message){
						err = err + errorResponse.data.message;
					} else {
						err = err + errorResponse;
					}
					$scope.error = err;
				});

			} else {
				$scope.userRoles = {};
			}
		});
	}
]);