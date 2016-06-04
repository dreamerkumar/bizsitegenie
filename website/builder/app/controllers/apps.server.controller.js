'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	App = mongoose.model('Builder-App'),
	childProcess = require('child_process'),
	_ = require('lodash');

/**
 * Create a App
 */
exports.create = function(req, res) {
	var app = new App(req.body);
	app.user = req.user;

	app.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(app);
		}
	});
};

/**
 * Show the current App
 */
exports.read = function(req, res) {
	res.jsonp(req.app);
};

/**
 * Update a App
 */
exports.update = function(req, res) {
	var app = req.app ;

	app = _.extend(app , req.body);

	app.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(app);
		}
	});
};

/**
 * Delete an App
 */
exports.delete = function(req, res) {
	var app = req.app ;

	app.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(app);
		}
	});
};

/**
 * List of Apps
 */
exports.list = function(req, res) {	
		
	App.find().sort('-created').populate('user', 'displayName').exec(function(err, apps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(apps);
		}
	});
};

/**
* Generate Features
*/
exports.generateFeatures = function(req, res){
	var appId = req.body.appId;
	var shellScriptToGenerateFiles = __dirname + '/' + 'generatefeatures.sh';
	childProcess.execFile(shellScriptToGenerateFiles, [appId], function(error, stdout, stderr){
		if(!error){
			res.status(200).send({message: 'Features were generated successfully'});			
		} else {
			return res.status(500).send({
				error: error,
				stderr: stderr,
				stdout: stdout
			});
		}
	});
};

/**
* Restarts Server
* Needs to be called after new files are generated. The new files need to be registered before they will show up for the application
* This function only stops the node server. If we run the process using forever, then the forever module will automatically restart the node server
* The restart will only work if we are running with forever.
* (forever server.js runs the process showing server logs as well. forever list shows all processes. forever stop process_id stops the process)
*/
exports.makeNewFeaturesAvailableToUse = function(req, res){
	process.exit(0);
};

/**
* Called to check if the node server is alive
*/
exports.checkIfServerIsAlive = function(req, res){
	return res.status(200).send({alive: true});
};

/**
 * App middleware
 */
exports.appByID = function(req, res, next, id) { 
	App.findById(id).populate('user', 'displayName').exec(function(err, app) {
		if (err) return next(err);
		if (! app) return next(new Error('Failed to load App ' + id));
		req.app = app ;
		next();
	});
};

/**
 * App authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.app.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
