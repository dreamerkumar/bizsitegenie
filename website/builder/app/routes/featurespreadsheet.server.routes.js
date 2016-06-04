'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var featurespreadsheet = require('../../app/controllers/featurespreadsheet.server.controller');

	// Featurespreadsheets Routes
	app.route('/itemspreadsheet')
		.get(featurespreadsheet.list)
		.post(users.requiresLogin, featurespreadsheet.create);

	
	app.route('/itemspreadsheet/search')
		.get(featurespreadsheet.search);

	app.route('/itemspreadsheet/:featurespreadsheetId')
		.get(users.requiresLogin, featurespreadsheet.hasAuthorization, featurespreadsheet.read)
		.put(users.requiresLogin, featurespreadsheet.hasAuthorization, featurespreadsheet.update)
		.delete(users.requiresLogin, featurespreadsheet.hasAuthorization, featurespreadsheet.delete);

	// Finish by binding the Featurespreadsheet middleware
	app.param('featurespreadsheetId', featurespreadsheet.featurespreadsheetByID);
};
