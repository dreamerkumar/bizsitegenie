'use strict';

// Properties controller
angular.module('property').controller('ListPropertyController', ['$scope', '$stateParams', '$location', 'Authentication', 'Property', 
		'UpdatePropertyPositions', 'SelectItemOrProperty', 'GetRadioOrSelectOptions',
	function($scope, $stateParams, $location, Authentication, Property, UpdatePropertyPositions, SelectItemOrProperty, GetRadioOrSelectOptions) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Remove existing Property
		$scope.remove = function(property) {
			if ( property ) { 
				property.$remove();

				for (var i in $scope.property) {
					if ($scope.property [i] === property) {
						$scope.property.splice(i, 1);
					}
				}
			} else {
				$scope.property.$remove(function() {
					$location.path($scope.parentRouteUrl + '/property');
				});
			}
		};

		$scope.setForeignKeyRef = function(property){
			SelectItemOrProperty.getForeignKeyControlProperties(property.type, $stateParams.itemId).then(function(result){

				if(!result.referencedFeatureName){
					alert('Cannot save. Required attribute referencedFeatureName missing');
					return;
				}

				if(result.referencedFeatureName === $scope.item.name){
					var err = 'Error: You cannot reference a item property to the same item';
					alert(err);
					return;
				}

				if(property.type === "foreignkeyref"){
					if(!result.propertyNamesForDisplay){
						alert('Cannot save. Required attribute propertyNamesForDisplay missing');
						return;
					}
				}
				
				if(property.type === "lookupfromprop"){
					if(!result.referencedPropertyName){
						alert('Cannot save. Required attribute referencedPropertyName missing');
						return;
					}
				}
				
				angular.extend(property, result);
				$scope.updateProperty(property);
								
			})
			.catch(function(error){
				console.error(error);
			});
		};

		$scope.getradioorselectoptions = function(property){
			GetRadioOrSelectOptions.getRadioOrSelectOptions(property).then(function(result){
				
			})
			.catch(function(error){
				if(error) {
					console.error(error);
				}
			});
		};

		// Update existing Property
		$scope.updateProperty = function(modifiedProperty) {
			modifiedProperty.$update(function() {
				console.log('property updated', modifiedProperty)
			}, function(errorResponse) {
				console.error('Error occured while trying to save property', errorResponse);
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Properties
		$scope.find = function() {
			$scope.property = Property.query({parentId: $stateParams.itemId});
		};

		// Find existing Property
		$scope.findOne = function() {
			$scope.property = Property.get({ 
				propertyId: $stateParams.propertyId,
				parentId: $stateParams.itemId
			});
		};

		$scope.dragControlListeners = {
		    orderChanged: function(eventObj) {
		    	var childPropertyPositions = $scope.property.map(function(item){ return item._id;});
		    	var updatePropertyPositions = new UpdatePropertyPositions({itemId: $stateParams.itemId, childPropertyPositions: childPropertyPositions});
				
		    	updatePropertyPositions.$save(function(response) {
					console.log('New positions saved');			
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		    }

		};
	}
]);