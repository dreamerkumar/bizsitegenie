'use strict';

//<%= humanizedPluralName %> service used to communicate <%= humanizedPluralName %> REST endpoints
angular.module('<%= slugifiedPluralName %>').factory('<%= classifiedPluralName %>', ['$resource',
	function($resource) {
		return $resource('<%= slugifiedPluralName %>/:<%= camelizedSingularName %>Id', 
		{ 
			<%=camelizedSingularName %>Id: '@_id'
		}, 
		{
			search: {
				url: '/<%= slugifiedPluralName %>/search/',
				method: 'GET',
				isArray: true
			},
			update: {
				method: 'PUT'
			}<%if(isChildCrud){%>,
			queryForParentId: {
				method: 'GET',
				isArray: true,
				params: { parentId: '@parentId' }
			}<%}%>
		});
	}
]);