'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var getS3UploadUrl = require('../../app/controllers/get-s3-upload-url.server.controller');

	app.route('/get-s3-upload-url')
		//.get(getS3UploadUrl.hasAuthorization, getS3UploadUrl.get)
		.post(getS3UploadUrl.hasAuthorization, getS3UploadUrl.post);
};
