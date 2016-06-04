'use strict';

// Properties controller
angular.module('property').controller('PropertyController', ['$scope', '$stateParams', '$location', 'Authentication', 'Property', 'UpdatePropertyPositions', 'SelectItemOrProperty',
	function($scope, $stateParams, $location, Authentication, Property, UpdatePropertyPositions, SelectItemOrProperty) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		// Create new Property
		$scope.create = function() {
			// Create new Property object
			var property = new Property ({
					
				
					referenceDisplayFormat: this.referenceDisplayFormat,
				
					col: this.col,
				
					selectorControlType: this.selectorControlType,
				
					parentId: this.parentId,
				
					row: this.row,
				
					option: this.option,
				
					refDescription: this.refDescription,
				
					referencedPropertyName: this.referencedPropertyName,
				
					selectorControlAttribute: this.selectorControlAttribute,
				
					type: this.type,
				
					name: this.name,
				
					value: this.value,
				
					referencedFeatureId: this.referencedFeatureId,
				
					referencedFeatureName: this.referencedFeatureName,
				
					propertyNamesForDisplay: this.propertyNamesForDisplay,
				
					referenceDescription: this.referenceDescription,
				
			});

			// Redirect after save
			property.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/property/' + response._id);

				// Clear form fields
				
				$scope.referenceDisplayFormat = '';
				
				$scope.col = '';
				
				$scope.selectorControlType = '';
				
				$scope.parentId = '';
				
				$scope.row = '';
				
				$scope.option = '';
				
				$scope.refDescription = '';
				
				$scope.referencedPropertyName = '';
				
				$scope.selectorControlAttribute = '';
				
				$scope.type = '';
				
				$scope.name = '';
				
				$scope.value = '';
				
				$scope.referencedFeatureId = '';
				
				$scope.referencedFeatureName = '';
				
				$scope.propertyNamesForDisplay = '';
				
				$scope.referenceDescription = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

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

		// Update existing Property
		$scope.update = function() {
			var property = $scope.property;

			property.$update(function() {
				$location.path($scope.parentRouteUrl + '/property/' + property._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.setForeignKeyRef = function(property){
			SelectItemOrProperty.getForeignKeyControlProperties(property.type, $stateParams.itemId).then(function(result) {
				
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
				console.log('property updated', modifiedProperty);
			}, function(errorResponse) {
				cconsole.error('Error occured while trying to save property', errorResponse);
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