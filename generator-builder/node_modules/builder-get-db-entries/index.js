'use strict';
var init = require('./config/init')(),
	getApp = require('./app/processors/get-app.js'),
	Q = require('q');


module.exports.getAppByID = getApp.getAppByID;

/*
 * @parentCrudId is is the id of the parent feature,
 * when a feature is a child module
 */
module.exports.getFeatures = function(appId, parentCrudId){
	
	return Q.Promise(function(resolve, reject, notify) {

		function callback(err, values){
			if (!err) {
                resolve(values);
            } else {
                reject(new Error(err));
            }
		}

		require('./app/processors/get-features.js').list(appId, parentCrudId, callback);
	});
};

module.exports.getListForParentId = function(parentId, entityType, internal){
	
	return Q.Promise(function(resolve, reject, notify) {


		function callback(err, values){
			if (!err) {
                resolve(values);

            } else {
                reject(new Error(err));
            }
		}

		var processor = require('./app/processors/get-property.js');


		processor.list(parentId, callback);
	});
};

exports = module.exports;


//below code can be used to run directly from command prompt
// exports.getListForParentId('56b2d51cc5a3ed920d88e92a', 0).then(function(results){
// 	console.log('results are', results);
// }).catch(function(err){
// 	console.log('sorry. got an error', err);
// });
