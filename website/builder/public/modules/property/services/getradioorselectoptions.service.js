'use strict';

angular.module('items').factory('GetRadioOrSelectOptions', function($q, $uibModal) {
		return {

			getRadioOrSelectOptions: function(property) {
				var asyncDeferred = $q.defer();

				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'builder/public/modules/property/views/getradioorselectoptions.popup.directive.view.html',
					controller: function($scope, $uibModalInstance){
			            $scope.addOptionsError = '';
			            $scope.options = property.option && property.option.length? property.option.split(',') : [];
			            
			            $scope.addOptions = function() {
			            	$scope.addOptionsError = null;

			            	if(!$scope.newOptions) {
			            		return;
			            	}
			            	
			            	//put in an array
			            	var newValues = $scope.newOptions.split(',');

			            	//remove spaces
			            	var newValues = newValues.map(function(item){ return item.trim();});
			            	
			            	//remove blank entries
			            	newValues = newValues.filter(function(val) {return val;});

			            	//check for the uniqueness of new values
			            	var lowerCaseExistingValues = $scope.options.map(function(item){ return item.trim().toLowerCase();});
			            	var lowerCaseNewValues = newValues.map(function(item){ return item.toLowerCase();});

			            	for(var ctr = 0; ctr < newValues.length; ctr++) {
			            		var newValue = newValues[ctr].toLowerCase();
			            		if(lowerCaseExistingValues.indexOf(newValue) >= 0){
			            			$scope.addOptionsError = newValues[ctr] + ' already exists';
			            			return;
			            		}
			            		if(lowerCaseNewValues.indexOf(newValue) !== ctr && lowerCaseNewValues.indexOf(newValue) >= 0) {
			            			$scope.addOptionsError = newValues[ctr] + ' is a duplicate';
			            			return;
			            		}
			            	}

			            	//save
			            	var newOptions = $scope.options.concat(newValues);
			            	property.option = newOptions.join(',');

							property.$update(function() {
								console.log('Property updated', property);
								//update display
			            		$scope.options = newOptions;
			            		$scope.newOptions = null;
							}, function(errorResponse) {
								console.error('Error occured while trying to save property', errorResponse);
								$scope.addOptionsError = errorResponse.data.message;
							});
			            };

			            $scope.remove = function(option){
			            	var newOptions = $scope.options.filter(function(item){ return item !== option;});
			            	property.option = newOptions.join(',');
			            	property.$update(function() {
			            		$scope.options = newOptions;
								console.log('Option deleted for property ', property);
							}, function(errorResponse) {
								console.error('Error occured while trying to save property', errorResponse);
							});
			            };

			            $scope.close = function () {
			                $uibModalInstance.dismiss();
			            };
					},
					size: 'md'
			    });

			    modalInstance.result.then(function (selected) {

				}, function () {
					asyncDeferred.reject();
				});

			    return asyncDeferred.promise;
			}
	}
});