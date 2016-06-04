'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var userGroupRoles = require('../../app/controllers/user-group-roles.server.controller');

	// User group roles Routes
	app.route('/user-group-roles')
		.get(userGroupRoles.list)
		.post(users.requiresLogin, userGroupRoles.create);

	app.route('/user-group-roles/:userGroupRoleId')
		.get(users.requiresLogin, userGroupRoles.hasAuthorization, userGroupRoles.read)
		.delete(users.requiresLogin, userGroupRoles.hasAuthorization, userGroupRoles.delete);

	// Finish by binding the User group role middleware
	app.param('userGroupRoleId', userGroupRoles.userGroupRoleByID);
};
