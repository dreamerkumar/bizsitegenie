'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var getUserRoles = require('../../app/controllers/getuserroles.server.controller');

	app.route('/get-user-roles')
		.get(users.requiresLogin, getUserRoles.get);
};
