'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Feature = mongoose.model('Builder-Feature'),
	Q = require('q'),
	_ = require('lodash');

exports.updatePropertyPositions = function(req, res){
	var featureId = req.body.itemId;
	if(!featureId){
		return res.status(400).send({message: 'Cannot save. Missing featureId.'});
	}

	var childPropertyPositions = req.body.childPropertyPositions;
	if(!childPropertyPositions || !childPropertyPositions.length){
		childPropertyPositions = [];
	}

	updatePropertyPositionsForFeature(featureId, childPropertyPositions)
	.then(function(results){
		return res.status(200).send({message: 'Properties added successfully.'})
	})
	.catch(function (err) {
		return res.status(400).send({message: errorHandler.getErrorMessage(err)})
	});		
};

function updatePropertyPositionsForFeature(featureId, childPropertyPositions){

	return Q.Promise(function(resolve, reject, notify) {

		Feature.findByIdAndUpdate(featureId, { 
			$set: { 
			    'childPropertyPositions':childPropertyPositions       
			 }
		}).exec(function(err, res){ 
			if (err) { 
				reject(err);
			} else {
				if(!res){
					reject(new Error('Failed to update childPropertyPositions for feature ' + featureId));
				} else {
					resolve(res, childPropertyPositions);
				}
			}
		});
	});
};
