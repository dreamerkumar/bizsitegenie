'use strict';

angular.module('property').factory('UpdatePropertyPositions', ['$resource',
	function($resource) {
		return $resource('property/update-property-positions');
	}
]);