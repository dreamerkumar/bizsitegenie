'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var getallfeaturesandprops = require('../../app/controllers/getallfeaturesandprops.server.controller');

	app.route('/get-all-items-and-props')
		.get(users.requiresLogin, getallfeaturesandprops.get);
};
