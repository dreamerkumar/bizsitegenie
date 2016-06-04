'use strict';

// First of fours controller
angular.module('first-of-fours').controller('FirstOfFoursController', ['$scope', '$stateParams', '$location', 'Authentication', 'FirstOfFours',
	function($scope, $stateParams, $location, Authentication, FirstOfFours) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Create new First of four
		$scope.create = function() {
			// Create new First of four object
			var firstOfFour = new FirstOfFours ({
					
				
					name: this.name,
				
			});

			// Redirect after save
			firstOfFour.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/first-of-fours/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing First of four
		$scope.remove = function(firstOfFour) {
			if ( firstOfFour ) { 
				firstOfFour.$remove();

				for (var i in $scope.firstOfFours) {
					if ($scope.firstOfFours [i] === firstOfFour) {
						$scope.firstOfFours.splice(i, 1);
					}
				}
			} else {
				$scope.firstOfFour.$remove(function() {
					$location.path($scope.parentRouteUrl + '/first-of-fours');
				});
			}
		};

		// Update existing First of four
		$scope.update = function() {
			var firstOfFour = $scope.firstOfFour;

			firstOfFour.$update(function() {
				$location.path($scope.parentRouteUrl + '/first-of-fours/' + firstOfFour._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of First of fours
		$scope.find = function() {
			$scope.firstOfFours = FirstOfFours.query();
		};

		// Find existing First of four
		$scope.findOne = function() {
			$scope.firstOfFour = FirstOfFours.get({ 
				firstOfFourId: $stateParams.firstOfFourId
			});
		};
	}
]);