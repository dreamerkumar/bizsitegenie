'use strict';

angular.module('core').factory('BuilderSetup', ['$resource',
	function($resource) {
		return $resource('builder-setup');
	}
]);