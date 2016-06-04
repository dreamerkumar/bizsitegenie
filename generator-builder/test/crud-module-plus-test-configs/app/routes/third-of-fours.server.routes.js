'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var thirdOfFours = require('../../app/controllers/third-of-fours.server.controller');

	// Third of fours Routes
	app.route('/third-of-fours')
		.get(thirdOfFours.list)
		.post(users.requiresLogin, thirdOfFours.create);

	app.route('/third-of-fours/:thirdOfFourId')
		.get(thirdOfFours.read)
		.put(users.requiresLogin, thirdOfFours.hasAuthorization, thirdOfFours.update)
		.delete(users.requiresLogin, thirdOfFours.hasAuthorization, thirdOfFours.delete);

	// Finish by binding the Third of four middleware
	app.param('thirdOfFourId', thirdOfFours.thirdOfFourByID);
};
