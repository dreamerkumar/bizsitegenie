'use strict';

// Configuring the new module
angular.module('dashboard').run(['Menus',
	function(Menus) {
		// Add as a sub menu item to features top bar menu items
		Menus.addSubMenuItem('topbar', 'item', 'Dashboards', 'dashboard');
	}
]);
