'use strict';
var users = require('../../../app/controllers/users.server.controller');

module.exports = function(app) {

	var builderSetup = require('../../app/controllers/builder-setup.server.controller');
	app.route('/builder-setup').get(users.requiresLogin, builderSetup.setUpAppOrReturnAppId);
};