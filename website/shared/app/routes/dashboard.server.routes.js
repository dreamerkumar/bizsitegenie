'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var dashboard = require('../../app/controllers/dashboard.server.controller');

	// Dashboards Routes
	app.route('/dashboard')
		.get(dashboard.list)
		.post(users.requiresLogin, dashboard.create);

	
	app.route('/dashboard/search')
		.get(dashboard.search);

	app.route('/dashboard/:dashboardId')
		.get(users.requiresLogin, dashboard.hasAuthorization, dashboard.read)
		.put(users.requiresLogin, dashboard.hasAuthorization, dashboard.update)
		.delete(users.requiresLogin, dashboard.hasAuthorization, dashboard.delete);

	// Finish by binding the Dashboard middleware
	app.param('dashboardId', dashboard.dashboardByID);
};
