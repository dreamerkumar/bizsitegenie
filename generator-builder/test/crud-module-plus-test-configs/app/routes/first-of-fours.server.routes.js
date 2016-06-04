'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var firstOfFours = require('../../app/controllers/first-of-fours.server.controller');

	// First of fours Routes
	app.route('/first-of-fours')
		.get(firstOfFours.list)
		.post(users.requiresLogin, firstOfFours.create);

	app.route('/first-of-fours/:firstOfFourId')
		.get(firstOfFours.read)
		.put(users.requiresLogin, firstOfFours.hasAuthorization, firstOfFours.update)
		.delete(users.requiresLogin, firstOfFours.hasAuthorization, firstOfFours.delete);

	// Finish by binding the First of four middleware
	app.param('firstOfFourId', firstOfFours.firstOfFourByID);
};
