'use strict';

//Itemroles service used to communicate Itemroles REST endpoints
angular.module('itemroles').factory('Itemroles', ['$resource',
	function($resource) {
		return $resource('itemroles/:itemrolesId', 
		{ 
			itemrolesId: '@_id'
		}, 
		{
			'query': {
				method:'GET', 
				isArray:true, 
				cache: true //will use the query method for web application authorization only. we will cache this. getByAccessType will not be cached and used in the admin screen
			},
			search: {
				url: '/itemroles/search/',
				method: 'GET',
				isArray: true
			},
			getByAccessType: {
				url: '/itemroles/getbyaccesstype',
				method: 'GET',
				params:{
					parentId:'@parentId',
					accesstype: '@accesstype'
				},
				isArray: true
			},
			deleteItemRole: {
				url: '/itemroles/deleteitemrole',
				method: 'POST',
				params:{
					parentId:'@parentId',
					accesstype: '@accesstype',
					role: '@role'
				}
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);