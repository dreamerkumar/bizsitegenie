'use strict';

//Properties service used to communicate Add Multiple Properties REST endpoints
angular.module('property').factory('AddMultipleProperties', ['$resource',
	function($resource) {
		return $resource('property/add-multiple-properties');
	}
]);