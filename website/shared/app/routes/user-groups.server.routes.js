'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var userGroups = require('../../app/controllers/user-groups.server.controller');

	// User groups Routes
	app.route('/user-groups')
		.get(userGroups.list)
		.post(users.requiresLogin, userGroups.create);

	app.route('/user-groups/:userGroupId')
		.get(users.requiresLogin, userGroups.hasAuthorization, userGroups.read)
		.delete(users.requiresLogin, userGroups.hasAuthorization, userGroups.delete);

	// Finish by binding the User group middleware
	app.param('userGroupId', userGroups.userGroupByID);
};
