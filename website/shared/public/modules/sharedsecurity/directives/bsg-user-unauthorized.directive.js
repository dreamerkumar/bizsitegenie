'use strict';

angular.module('sharedsecurity')

	.directive('bsgUserUnauthorized', function(){
		return {
			restrict: 'E',
			templateUrl: 'shared/public/modules/sharedsecurity/views/bsg-user-unauthorized.directive.view.html',
			scope: {
				unauthorized: '='
			},
		}
	});