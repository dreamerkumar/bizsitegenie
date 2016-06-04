'use strict';

// Configuring the new module
angular.module('abcd').run(['Menus', 'Authorization',
	function(Menus, Authorization) {
		Authorization.checkAccess('57509fe4aa937cd61da7591e', 'read').then(function(result){
			// Add as a sub menu item to top bar menu items
			Menus.addSubMenuItem('topbar', 'item', 'Abcds', 'abcd');
		});
	}
]);
