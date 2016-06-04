'use strict';
//http://stackoverflow.com/questions/22143628/nodejs-how-do-i-download-a-file-to-disk-from-an-aws-s3-bucket

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	aws = require('aws-sdk'),
	s3Config = require('../../../config/s3.amazonaws').getConfig(),
    urlSigner = require('amazon-s3-url-signer');

exports.get = function(req, res) {

    // download the file via aws s3 here
    var fileKey = req.query['fileKey'];

    if(!fileKey){
        return res.status(403).send('Missing file key');
    }

    aws.config.update({accessKeyId: s3Config.AWS_ACCESS_KEY, secretAccessKey: s3Config.AWS_SECRET_KEY});

    var s3 = new aws.S3();

    var options = {
        Bucket: s3Config.S3_BUCKET,
        Key: fileKey
    };

    res.attachment(fileKey);
    var fileStream = s3.getObject(options).createReadStream();
    fileStream.pipe(res);
};

exports.getSignedUrlForImage = function(req, res) {

    // download the file via aws s3 here
    var fileKey = req.query['fileKey'];

    if(!fileKey){
        return res.status(403).send('Missing file key');
    }

    var bucket = urlSigner.urlSigner(s3Config.AWS_ACCESS_KEY, s3Config.AWS_SECRET_KEY);

    var url = bucket.getUrl('GET', fileKey, s3Config.S3_BUCKET, 60); //url expires in 60 minutes

    var width = req.query['width'];
    var resizedUrl;
    if(width){
        resizedUrl = exports.getResizedImageUrl(url, width);
    }

    return res.jsonp({url: url, resizedUrl: resizedUrl});

};

exports.getResizedImageUrl = function(url, width){
    var s3PRefixToReplace = process.env.S3_PREFIX_TO_REPLACE || 'TODO-CONFIGURE s3PRefixToReplace';
    var imgixUrlPrefix = process.env.IMGIX_URL_PREFIX || 'TODO-CONFIGURE imgixUrlPrefix';

    var imgxixUrl = url.replace(s3PRefixToReplace,imgixUrlPrefix);

    return imgxixUrl + '&w=' + width;
};


/**
 * Authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user || !req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


