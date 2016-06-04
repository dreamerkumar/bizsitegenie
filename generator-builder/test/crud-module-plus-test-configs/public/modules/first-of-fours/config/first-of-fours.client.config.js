'use strict';

// Configuring the new module
angular.module('first-of-fours').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'First of fours', 'first-of-fours', 'dropdown', '/first-of-fours(/create)?');
		Menus.addSubMenuItem('topbar', 'first-of-fours', 'List First of fours', 'first-of-fours');
		Menus.addSubMenuItem('topbar', 'first-of-fours', 'New First of four', 'first-of-fours/create');
	}
]);
