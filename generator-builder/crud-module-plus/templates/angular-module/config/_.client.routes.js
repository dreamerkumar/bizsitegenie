'use strict';

//Setting up route
angular.module('<%= slugifiedPluralName %>').config(['$stateProvider',
	function($stateProvider) {
		// <%= humanizedPluralName %> state routing
		$stateProvider.
		state('list<%= classifiedPluralName %>', {
			url: '<%=parentRoutePath%>/<%= slugifiedPluralName %>',
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/list-<%= slugifiedPluralName %>.client.view.html'
		}).
		state('create<%= classifiedSingularName %>', {
			url: '<%=parentRoutePath%>/<%= slugifiedPluralName %>/create',
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/create-<%= slugifiedSingularName %>.client.view.html'
		}).
		state('view<%= classifiedSingularName %>', {
			url: '<%=parentRoutePath%>/<%= slugifiedPluralName %>/:<%= camelizedSingularName %>Id',
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/view-<%= slugifiedSingularName %>.client.view.html'
		}).
		state('edit<%= classifiedSingularName %>', {
			url: '<%=parentRoutePath%>/<%= slugifiedPluralName %>/:<%= camelizedSingularName %>Id/edit',
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/edit-<%= slugifiedSingularName %>.client.view.html'
		});
	}
]);