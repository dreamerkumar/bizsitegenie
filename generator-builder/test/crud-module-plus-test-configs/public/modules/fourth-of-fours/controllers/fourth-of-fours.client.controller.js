'use strict';

// Fourth of fours controller
angular.module('fourth-of-fours').controller('FourthOfFoursController', ['$scope', '$stateParams', '$location', 'Authentication', 'FourthOfFours',
	function($scope, $stateParams, $location, Authentication, FourthOfFours) {
		$scope.authentication = Authentication;
		$scope.parentId = $stateParams.thirdOfFourId;
		$scope.parentRouteUrl = '/first-of-fours/' + $stateParams.firstOfFourId + '/second-of-fours/' + $stateParams.secondOfFourId + '/third-of-fours/' + $stateParams.thirdOfFourId + '';

		// Create new Fourth of four
		$scope.create = function() {
			// Create new Fourth of four object
			var fourthOfFour = new FourthOfFours ({
					parentId: $scope.parentId,
				
					name: this.name,
				
			});

			// Redirect after save
			fourthOfFour.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/fourth-of-fours/' + response._id);

				// Clear form fields
				
				$scope.name = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fourth of four
		$scope.remove = function(fourthOfFour) {
			if ( fourthOfFour ) { 
				fourthOfFour.$remove();

				for (var i in $scope.fourthOfFours) {
					if ($scope.fourthOfFours [i] === fourthOfFour) {
						$scope.fourthOfFours.splice(i, 1);
					}
				}
			} else {
				$scope.fourthOfFour.$remove(function() {
					$location.path($scope.parentRouteUrl + '/fourth-of-fours');
				});
			}
		};

		// Update existing Fourth of four
		$scope.update = function() {
			var fourthOfFour = $scope.fourthOfFour;

			fourthOfFour.$update(function() {
				$location.path($scope.parentRouteUrl + '/fourth-of-fours/' + fourthOfFour._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Fourth of fours
		$scope.find = function() {
			$scope.fourthOfFours = FourthOfFours.queryForParentId({parentId: $scope.parentId});
		};

		// Find existing Fourth of four
		$scope.findOne = function() {
			$scope.fourthOfFour = FourthOfFours.get({ 
				fourthOfFourId: $stateParams.fourthOfFourId
			});
		};
	}
]);