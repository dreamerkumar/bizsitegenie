'use strict';

// Configuring the new module
angular.module('<%= slugifiedPluralName %>').run(['Menus', 'Authorization',
	function(Menus, Authorization) {
		Authorization.checkAccess('<%=origArgs.featureId%>', 'read').then(function(result){
			// Add as a sub menu item to top bar menu items
			Menus.addSubMenuItem('<%= menuId %>', 'item', '<%= humanizedPluralName %>', '<%= slugifiedPluralName %>');
		});
	}
]);
