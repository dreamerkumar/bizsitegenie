'use strict';

// Apps controller
angular.module('apps').controller('AppsController', ['$scope', '$stateParams', '$location', '$interval',  'Authentication', 'Apps',
	function($scope, $stateParams, $location, $interval, Authentication, Apps) {
		$scope.authentication = Authentication;
		$scope.parentRouteUrl = '';

		var errFn = function(errorResponse) {
			var err = 'An error occured: ';
			if(errorResponse && errorResponse.data && errorResponse.data.message){
				err = err + errorResponse.data.message;
			} else {
				err = err + errorResponse;
			}
			$scope.error = err;
		};

		// Create new App
		$scope.create = function() {
			// Create new App object
			var app = new Apps ({
					name: this.name,
					appDescription: this.name || 'temp description',
					appKeyword: this.name || 'temp keyword',
					appAuthor: Authentication.user.displayName,
					bootstrapTheme: 'flatly',
			});

			// Redirect after save
			app.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/apps/select-theme/' + response._id);

				// reset form fields
				$scope.name = '';
				$scope.appDescription = '';
				$scope.appKeyword = '';
				$scope.appAuthor = '';
				$scope.bootstrapTheme = 'flatly';
				
			}, errFn);
		};

		$scope.selectTheme = function(theme){
			var appId = $scope.appId;
			if(!appId){
				$scope.error = 'Error. The app could not be identified';
				return;
			}
			Apps.get({ appId: appId})
				.$promise.then(function(app){
					app.bootstrapTheme = theme;
					app.$update(function() {
					$location.path($scope.parentRouteUrl + '/apps/' + app._id + '/items');
				}, errFn);
			}, errFn);
		};

		// Remove existing App
		$scope.remove = function(app) {
			if ( app ) { 
				app.$remove();

				for (var i in $scope.apps) {
					if ($scope.apps [i] === app) {
						$scope.apps.splice(i, 1);
					}
				}
			} else {
				$scope.app.$remove(function() {
					$location.path($scope.parentRouteUrl + '/apps');
				});
			}
		};

		// Update existing App
		$scope.update = function() {
			var app = $scope.app;

			app.$update(function() {
				$location.path($scope.parentRouteUrl + '/apps/' + app._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Apps
		$scope.find = function() {
			$scope.apps = Apps.query();
		};

		// Find existing App
		$scope.findOne = function() {
			$scope.app = Apps.get({ 
				appId: $stateParams.appId
			});
		};

		$scope.listThemes = function() {
			$scope.appId = $stateParams.appId;
			if(!$scope.appId){
				$scope.error = 'Error. The app could not be identified';
			}
		};

		$scope.appCreationStatus = function() {
			var appId = $stateParams.appId;
			Apps.generateItems({appId: appId}, 
				function(){
					console.log('generateItems call was a success.');
					
					//make items available
					Apps.makeNewItemsAvailableToUse({}, 
						function(){
					}, 
					function(err1){
						//keep checking if the server is alive
						var promise = $interval(function(){Apps.checkIfServerIsAlive({}, 
							function(){
								$interval.cancel(promise);
								$location.path($scope.parentRouteUrl + '/apps/' + $stateParams.appId + '/generated-app-status');
						}, function(){})}, 1000);	
					});
				}, 
				function(err2){
					console.error('Following error occured while trying to generate items: ');
					console.error(err2);
				});
		};

		$scope.generateItems = function(){
			$location.path($scope.parentRouteUrl + '/apps/' + $stateParams.appId + '/view-app-creation-status');
		};
	}
]);