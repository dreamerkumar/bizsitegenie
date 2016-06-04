'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var roles = require('../../app/controllers/roles.server.controller');

	// Roles Routes
	app.route('/roles')
		.get(roles.list)
		.post(users.requiresLogin, roles.create);

	app.route('/roles/:roleId')
		.get(users.requiresLogin, roles.hasAuthorization, roles.read)
		.put(users.requiresLogin, roles.hasAuthorization, roles.update)
		.delete(users.requiresLogin, roles.hasAuthorization, roles.delete);

	app.route('/build-role-status')
		.get(users.requiresLogin, roles.buildRoleStatus)

	// Finish by binding the Role middleware
	app.param('roleId', roles.roleByID);
};
