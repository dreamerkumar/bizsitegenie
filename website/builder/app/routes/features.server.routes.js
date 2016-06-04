'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var features = require('../../app/controllers/features.server.controller');

	// Features Routes
	app.route('/items')
		.get(features.list)
		.post(users.requiresLogin, features.create);

	app.route('/items/:featureId')
		.get(features.read)
		.put(users.requiresLogin, features.hasAuthorization, features.update)
		.delete(users.requiresLogin, features.hasAuthorization, features.delete);

	// Finish by binding the Feature middleware
	app.param('featureId', features.featureByID);
};
