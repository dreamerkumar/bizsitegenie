'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var secondOfFours = require('../../app/controllers/second-of-fours.server.controller');

	// Second of fours Routes
	app.route('/second-of-fours')
		.get(secondOfFours.list)
		.post(users.requiresLogin, secondOfFours.create);

	app.route('/second-of-fours/:secondOfFourId')
		.get(secondOfFours.read)
		.put(users.requiresLogin, secondOfFours.hasAuthorization, secondOfFours.update)
		.delete(users.requiresLogin, secondOfFours.hasAuthorization, secondOfFours.delete);

	// Finish by binding the Second of four middleware
	app.param('secondOfFourId', secondOfFours.secondOfFourByID);
};
