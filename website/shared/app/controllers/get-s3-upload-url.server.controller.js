'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	_ = require('lodash'),
	aws = require('aws-sdk'),
	s3Config = require('../../../config/s3.amazonaws').getConfig(),
	crypto = require('crypto'),
	moment = require('moment'),
	s3Url = 'https://s3.amazonaws.com/' + s3Config.S3_BUCKET,
	uuid = require('node-uuid');


//https://github.com/danialfarid/ng-file-upload/wiki/Direct-S3-upload-and-Node-signing-example
exports.post = function(req, res) {
    var request = req.body;
    var fileName = request.filename;
    if(!fileName){
    	return res.send('Filename is missing');
    }
    if(!request.type){
    	return res.send('File type is missing');
    }
    var path = s3Config.FOLDER_PATH + uuid.v4() + '/' + fileName.replace(/ /g,"_");

    var readType = 'private';

    var expiration = moment().add(5, 'm').toDate(); //15 minutes

    var s3Policy = {
        'expiration': expiration,
        'conditions': [{
                'bucket': s3Config.S3_BUCKET
            },
            ['starts-with', '$key', path], 
            {
                'acl': readType
            },
            {
              'success_action_status': '201'
            },
            ['starts-with', '$Content-Type', request.type],
            ['content-length-range', 1, 10485760], //min and max
        ]
    };

    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    // sign policy
    var signature = crypto.createHmac('sha1', s3Config.AWS_SECRET_KEY)
        .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

    var credentials = {
        url: s3Url,
        fields: {
            key: path,
            AWSAccessKeyId: s3Config.AWS_ACCESS_KEY,
            acl: readType,
            policy: base64Policy,
            signature: signature,
            'Content-Type': request.type,
            success_action_status: 201
        }
    };
    res.jsonp(credentials);
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


//https://www.terlici.com/2015/05/23/uploading-files-s3.html
// exports.get = function(req, res) {

// 	aws.config.update({accessKeyId: s3Config.AWS_ACCESS_KEY, secretAccessKey: s3Config.AWS_SECRET_KEY});

//     var s3 = new aws.S3()
// 	var options = {
// 		Bucket: s3Config.S3_BUCKET,
// 		Key: req.query.file_name,
// 		Expires: 60,
// 		ContentType: req.query.file_type,
// 		ACL: 'private'
// 	}

// 	s3.getSignedUrl('putObject', options, function(err, data){
		
// 		if(err) return res.send('Error with S3', err)

// 		res.json({
// 			signed_request: data,
// 			url: 'https://s3.amazonaws.com/' + s3Config.S3_BUCKET + '/' + req.query.file_name
// 		});
// 	});
// };
//the html content that works with the above
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Limitless Image Upload</title>
//   </head>
//   <body>
//     <h1>Welcome!</h1>
//     <br>Please select an image
//     <input type="file" id="image">
//     <br>
//     <img id="preview">

//     <script>
//     function upload(file, signed_request, url, done) {
//       var xhr = new XMLHttpRequest()
//       xhr.open("PUT", signed_request)
//       xhr.setRequestHeader('x-amz-acl', 'public-read')
//       xhr.onload = function() {
//         if (xhr.status === 200) {
//           done()
//         }
//       }

//       xhr.send(file)
//     }

//     function sign_request(file, done) {
//       var xhr = new XMLHttpRequest()
//       xhr.open("GET", "/get-s3-upload-url?fileName=" + file.name + "&file_type=" + file.type)

//       xhr.onreadystatechange = function() {
//         if(xhr.readyState === 4 && xhr.status === 200) {
//           var response = JSON.parse(xhr.responseText)
//           done(response)
//         }
//       }

//       xhr.send()
//     }

//     document.getElementById("image").onchange = function() {
//       var file = document.getElementById("image").files[0]
//       if (!file) return

//       sign_request(file, function(response) {
//         upload(file, response.signed_request, response.url, function() {
//           document.getElementById("preview").src = response.url
//         })
//       })
//     }
//     </script>
//   </body>
// </html>
