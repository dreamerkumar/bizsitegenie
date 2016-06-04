'use strict';

// Third of fours controller
angular.module('third-of-fours').controller('ThirdOfFoursController', ['$scope', '$stateParams', '$location', 'Authentication', 'ThirdOfFours',
	function($scope, $stateParams, $location, Authentication, ThirdOfFours) {
		$scope.authentication = Authentication;
		$scope.parentId = $stateParams.secondOfFourId;
		$scope.parentRouteUrl = '/first-of-fours/' + $stateParams.firstOfFourId + '/second-of-fours/' + $stateParams.secondOfFourId + '';

		// Create new Third of four
		$scope.create = function() {
			// Create new Third of four object
			var thirdOfFour = new ThirdOfFours ({
					parentId: $scope.parentId,
				
					name: this.name,
				
			});

			// Redirect after save
			thirdOfFour.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/third-of-fours/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Third of four
		$scope.remove = function(thirdOfFour) {
			if ( thirdOfFour ) { 
				thirdOfFour.$remove();

				for (var i in $scope.thirdOfFours) {
					if ($scope.thirdOfFours [i] === thirdOfFour) {
						$scope.thirdOfFours.splice(i, 1);
					}
				}
			} else {
				$scope.thirdOfFour.$remove(function() {
					$location.path($scope.parentRouteUrl + '/third-of-fours');
				});
			}
		};

		// Update existing Third of four
		$scope.update = function() {
			var thirdOfFour = $scope.thirdOfFour;

			thirdOfFour.$update(function() {
				$location.path($scope.parentRouteUrl + '/third-of-fours/' + thirdOfFour._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Third of fours
		$scope.find = function() {
			$scope.thirdOfFours = ThirdOfFours.queryForParentId({parentId: $scope.parentId});
		};

		// Find existing Third of four
		$scope.findOne = function() {
			$scope.thirdOfFour = ThirdOfFours.get({ 
				thirdOfFourId: $stateParams.thirdOfFourId
			});
		};
	}
]);