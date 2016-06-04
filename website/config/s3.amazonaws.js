'use strict';

exports.getConfig = function() {
	return {
		S3_BUCKET: process.env.S3_BUCKET || 'TODO-CONFIGURE',
		AWS_ACCESS_KEY: process.env.S3_AWS_ACCESS_KEY || 'TODO-CONFIGURE',
		AWS_SECRET_KEY: process.env.S3_AWS_ACCESS_KEY || 'TODO-CONFIGURE',
		FOLDER_PATH: process.env.S3_FOLDER_PATH || 'TODO-CONFIGURE'
	};
};