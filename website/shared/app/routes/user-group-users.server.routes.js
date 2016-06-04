'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var userGroupUsers = require('../../app/controllers/user-group-users.server.controller');

	// User group users Routes
	app.route('/user-group-users')
		.get(userGroupUsers.list)
		.post(users.requiresLogin, userGroupUsers.create);

	app.route('/user-group-users/:userGroupUserId')
		.get(users.requiresLogin, userGroupUsers.hasAuthorization, userGroupUsers.read)
		.delete(users.requiresLogin, userGroupUsers.hasAuthorization, userGroupUsers.delete);

	// Finish by binding the User group user middleware
	app.param('userGroupUserId', userGroupUsers.userGroupUserByID);
};
