'use strict';

// Second of fours controller
angular.module('second-of-fours').controller('SecondOfFoursController', ['$scope', '$stateParams', '$location', 'Authentication', 'SecondOfFours',
	function($scope, $stateParams, $location, Authentication, SecondOfFours) {
		$scope.authentication = Authentication;
		$scope.parentId = $stateParams.firstOfFourId;
		$scope.parentRouteUrl = '/first-of-fours/' + $stateParams.firstOfFourId + '';

		// Create new Second of four
		$scope.create = function() {
			// Create new Second of four object
			var secondOfFour = new SecondOfFours ({
					parentId: $scope.parentId,
				
					name: this.name,
				
			});

			// Redirect after save
			secondOfFour.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/second-of-fours/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Second of four
		$scope.remove = function(secondOfFour) {
			if ( secondOfFour ) { 
				secondOfFour.$remove();

				for (var i in $scope.secondOfFours) {
					if ($scope.secondOfFours [i] === secondOfFour) {
						$scope.secondOfFours.splice(i, 1);
					}
				}
			} else {
				$scope.secondOfFour.$remove(function() {
					$location.path($scope.parentRouteUrl + '/second-of-fours');
				});
			}
		};

		// Update existing Second of four
		$scope.update = function() {
			var secondOfFour = $scope.secondOfFour;

			secondOfFour.$update(function() {
				$location.path($scope.parentRouteUrl + '/second-of-fours/' + secondOfFour._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Second of fours
		$scope.find = function() {
			$scope.secondOfFours = SecondOfFours.queryForParentId({parentId: $scope.parentId});
		};

		// Find existing Second of four
		$scope.findOne = function() {
			$scope.secondOfFour = SecondOfFours.get({ 
				secondOfFourId: $stateParams.secondOfFourId
			});
		};
	}
]);