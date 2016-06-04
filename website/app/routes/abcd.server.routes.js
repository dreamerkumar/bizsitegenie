'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var abcd = require('../../app/controllers/abcd.server.controller');

	// Abcds Routes
	app.route('/abcd')
		.get(abcd.list)
		.post(users.requiresLogin, abcd.hasCreateAuthorization, abcd.create);

	
	app.route('/abcd/search')
		.get(abcd.search);

	app.route('/abcd/:abcdId')
		.get(users.requiresLogin, abcd.hasReadAuthorization, abcd.read)
		.put(users.requiresLogin, abcd.hasEditAuthorization, abcd.update)
		.delete(users.requiresLogin, abcd.hasDeleteAuthorization, abcd.delete);

	// Finish by binding the Abcd middleware
	app.param('abcdId', abcd.abcdByID);
};
