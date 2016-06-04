'use strict';

// Configuring the new module
angular.module('apps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Apps', 'apps', 'dropdown', '/apps(/create)?');
		Menus.addSubMenuItem('topbar', 'apps', 'List Apps', 'apps');
		Menus.addSubMenuItem('topbar', 'apps', 'New App', 'apps/create');
	}
]);
