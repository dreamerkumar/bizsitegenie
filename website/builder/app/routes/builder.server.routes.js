'use strict';

module.exports = function(app) {
	// Root routing
	var builder = require('../../app/controllers/builder.server.controller');
	app.route('/builder').get(builder.builder);
};