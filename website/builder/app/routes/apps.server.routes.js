'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var apps = require('../../app/controllers/apps.server.controller');

	// Apps Routes
	app.route('/apps')
		.get(apps.list)
		.post(users.requiresLogin, apps.create);

	app.route('/apps/generate-items')
		.put(users.requiresLogin, apps.generateFeatures);

	app.route('/apps/make-new-items-available-to-use')
		.put(users.requiresLogin, apps.makeNewFeaturesAvailableToUse);

	app.route('/apps/check-if-server-is-alive')
		.get(users.requiresLogin, apps.checkIfServerIsAlive);

	app.route('/apps/:appId')
		.get(apps.read)
		.put(users.requiresLogin, apps.hasAuthorization, apps.update)
		.delete(users.requiresLogin, apps.hasAuthorization, apps.delete);

	// Finish by binding the App middleware
	app.param('appId', apps.appByID);
};
