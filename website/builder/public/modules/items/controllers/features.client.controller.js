'use strict';

// Items controller
angular.module('items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 
		'Items', 'ItemParents', '$timeout', '$q', '$uibModal', '$window',
	function($scope, $stateParams, $location, Authentication, Items, ItemParents, $timeout, $q, $uibModal, $window) {
		$scope.authentication = Authentication;
		$scope.appId = $stateParams.appId;
		$scope.parentRouteUrl = '/apps/' + $stateParams.appId + '';
		$scope.isChildItem = false;

		// Remove existing Item
		$scope.remove = function(item) {
			if ( item ) { 
				item.$remove();

				for (var i in $scope.items) {
					if ($scope.items [i] === item) {
						$scope.items.splice(i, 1);
					}
				}
			} else {
				$scope.item.$remove(function() {
					$location.path($scope.parentRouteUrl + '/items');
				});
			}
		};

		// Update existing Item
		$scope.update = function() {
			var item = $scope.item;

			item.$update(function() {
				$location.path($scope.parentRouteUrl + '/items/' + item._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Items
		// $scope.find = function() {
		// 	$scope.items = Items.queryForParentId({parentId: $scope.appId});
		// };
		
		$scope.overrideSelectExpansion = function(event, el){
			event.preventDefault();
		};

		$scope.sortableOptions = {
			clone: true,
		    accept: function (sourceItemHandleScope, destSortableScope) {
		    	return false;
		    },
		    itemMoved: function (eventObj) {
				var insertedAt = eventObj.dest.index;
				var controlType = $scope.items[insertedAt];
				
				var positionIndex = ItemItems.getPositionIndexForNewlyInsertedItem(insertedAt);
				console.log(insertedAt);
				console.log(positionIndex);
				$scope.insertNewProperty(controlType, positionIndex, insertedAt);

		    },
		    orderChanged: function(event) {//Do what you want
		    	console.log('source orderChanged');
		    },	
		};


		$scope.availableFormControls = ['textbox', 'textarea', 'checkbox', 'dropDown', 'radioButtons', 'foreignkeyref', 'lookupfromprop'];
		$scope.dragControlListeners = {
		    accept: function (sourceItemHandleScope, destSortableScope) {
		    	console.log('accept');
		    	return true;
		    },//override to determine drag is allowed or not. default is true.
		    itemMoved: function (event) {//Do what you want
		    	console.log('itemMoved');
		    	console.log(event);
		    },
		    orderChanged: function(eventObj) {
		    	var movedToIndex = eventObj.dest.index;
		    	var positionIndex = ItemItems.getPositionIndexForNewlyInsertedItem(movedToIndex);
				$scope.items[movedToIndex].positionIndex = positionIndex;
				$scope.items[movedToIndex].savePositionIndex();
		    }
		    //containment: '#board'//optional param.
		};
	}
]);