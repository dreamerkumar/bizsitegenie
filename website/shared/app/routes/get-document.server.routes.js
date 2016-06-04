'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var getDocument = require('../../app/controllers/get-document.server.controller');

	app.route('/get-document')
		.get(getDocument.hasAuthorization, getDocument.get);

	app.route('/get-signed-url-for-image')
		.get(getDocument.hasAuthorization, getDocument.getSignedUrlForImage);
};
