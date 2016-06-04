'use strict';

// Configuring the new module
angular.module('itemspreadsheet').run(['Menus',
	function(Menus) {
		// Add as a sub menu item to items top bar menu items
		Menus.addSubMenuItem('topbar', 'item', 'Itemspreadsheets', 'itemspreadsheet');
	}
]);
