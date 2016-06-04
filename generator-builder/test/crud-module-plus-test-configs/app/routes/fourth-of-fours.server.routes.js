'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var fourthOfFours = require('../../app/controllers/fourth-of-fours.server.controller');

	// Fourth of fours Routes
	app.route('/fourth-of-fours')
		.get(fourthOfFours.list)
		.post(users.requiresLogin, fourthOfFours.create);

	app.route('/fourth-of-fours/:fourthOfFourId')
		.get(fourthOfFours.read)
		.put(users.requiresLogin, fourthOfFours.hasAuthorization, fourthOfFours.update)
		.delete(users.requiresLogin, fourthOfFours.hasAuthorization, fourthOfFours.delete);

	// Finish by binding the Fourth of four middleware
	app.param('fourthOfFourId', fourthOfFours.fourthOfFourByID);
};
