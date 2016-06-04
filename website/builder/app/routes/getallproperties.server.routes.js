'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var getallproperties = require('../../app/controllers/getallproperties.server.controller');

	app.route('/build-get-all-properties')
		.get(users.requiresLogin, getallproperties.get);
};
