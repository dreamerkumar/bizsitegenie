angular.module('shared-components').directive('bsgChildItemDisplay', function(Authorization){

	return {
		restrict: 'E',
		scope: {
			url: '@',
			name: '@',
			itemTypeId: '@'
		},
		templateUrl: 'shared/public/modules/shared-components/views/bsg-child-item-display.directive.view.html',
		link: function(scope){
			Authorization.checkAccess(scope.itemTypeId, 'read')
				.then(function(result){
					scope.hasAccess = true;
				});
		}
	}
});
