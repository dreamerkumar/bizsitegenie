'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	<%= classifiedSingularName %> = mongoose.model('<%= classifiedSingularName %>'),
	_ = require('lodash'),
	authorization = require('./users/users.authorization.server.controller');;

/**
 * Create a <%= humanizedSingularName %>
 */
exports.create = function(req, res) {
	var <%= camelizedSingularName %> = new <%= classifiedSingularName %>(req.body);
	<%= camelizedSingularName %>.user = req.user;

	<%= camelizedSingularName %>.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(<%= camelizedSingularName %>);
		}
	});
};

/**
 * Show the current <%= humanizedSingularName %>
 */
exports.read = function(req, res) {
	res.jsonp(req.<%= camelizedSingularName %>);
};

/**
 * Update a <%= humanizedSingularName %>
 */
exports.update = function(req, res) {
	var <%= camelizedSingularName %> = req.<%= camelizedSingularName %> ;

	<%= camelizedSingularName %> = _.extend(<%= camelizedSingularName %> , req.body);

	<%= camelizedSingularName %>.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(<%= camelizedSingularName %>);
		}
	});
};

/**
 * Delete an <%= humanizedSingularName %>
 */
exports.delete = function(req, res) {
	var <%= camelizedSingularName %> = req.<%= camelizedSingularName %> ;

	<%= camelizedSingularName %>.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(<%= camelizedSingularName %>);
		}
	});
};

/**
 * Search matching multiple columns to a single search value
 */
exports.search = function(req, res) {	
	var findQueryArray = [];
	var searchKeys = req.query.searchKeys;
	if(!searchKeys){
		return res.status(400).send('Search key(s) missing');
	}
	var searchKeyArray = searchKeys.split(',');
	searchKeyArray.forEach(function(key){
		var findQuery = {};
		findQuery[key] = { "$regex": req.query.searchValue, "$options": "i" };
		findQueryArray.push(findQuery);
	});
	
	<%= classifiedSingularName %>.find().or(findQueryArray)
			.where('user').equals(req.user.id)
			.sort('-created').populate('user', 'displayName')<% 
		properties.forEach(function(prop){ if(prop.formFieldType === "foreignkeyref"){ %>.populate('<%=prop.camelizedSingularName%>','<%=prop.attributes.propertyColumnNamesForDisplay.replace(/,/g , " ")%>')<%}});
	%>.lean().exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(results);
		}
	});
};


/**
 * List of <%= humanizedPluralName %>
 */
exports.list = function(req, res) {	
	<%if(isChildCrud){%>if(!req.query || !req.query.parentId){
		return res.status(400).send({
			message: 'Required parameter parentId missing'
		});
	}<%}%>
	authorization.checkAccess(req, '<%=origArgs.featureId%>', 'read')
	.then(function(accessResult){
		var params = {};
		if(accessResult === 'hasAccessIfUserCreatedIt'){
			params.user = req.user.id;
		}
		<%if(isChildCrud){%>
		params.parentId = req.query.parentId;
		<%}%>
		<%= classifiedSingularName %>.find(params)
				.sort('-created').populate('user', 'displayName')<% 
			properties.forEach(function(prop){ if(prop.formFieldType === "foreignkeyref"){ %>.populate('<%=prop.camelizedSingularName%>','<%=prop.attributes.propertyColumnNamesForDisplay.replace(/,/g , " ")%>')<%}});
		%>.exec(function(err, <%= camelizedPluralName %>) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(<%= camelizedPluralName %>);
			}
		});
	})
	.catch(function(err){
		return res.status(403).send({message: err});
	});
};

/**
 * <%= humanizedSingularName %> middleware
 */
exports.<%= camelizedSingularName %>ByID = function(req, res, next, id) { 
	<%= classifiedSingularName %>.findById(id).populate('user', 'displayName')<% 
		properties.forEach(function(prop){ if(prop.formFieldType === "foreignkeyref"){ %>.populate('<%=prop.camelizedSingularName%>','<%=prop.attributes.propertyColumnNamesForDisplay.replace(/,/g , " ")%>')<%}});
	%>.exec(function(err, <%= camelizedSingularName %>) {
		if (err) return next(err);
		if (! <%= camelizedSingularName %>) return next(new Error('Failed to load <%= humanizedSingularName %> ' + id));
		req.<%= camelizedSingularName %> = <%= camelizedSingularName %> ;
		next();
	});
};

exports.hasReadAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '<%=origArgs.featureId%>', 'read')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.<%= camelizedSingularName %>.user.id !== req.user.id) {
					return res.status(403).send('User is not authorized');
				}
			}
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};


exports.hasCreateAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '<%=origArgs.featureId%>', 'create')
		.then(function(accessResult){
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};

exports.hasEditAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '<%=origArgs.featureId%>', 'edit')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.<%= camelizedSingularName %>.user.id !== req.user.id) {
					return res.status(403).send('User is not authorized');
				}
			}
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};

exports.hasDeleteAuthorization = function(req, res, next) {
	authorization.checkAccess(req, '<%=origArgs.featureId%>', 'delete')
		.then(function(accessResult){
			if(accessResult === 'hasAccessIfUserCreatedIt'){
				if (!req.user || req.<%= camelizedSingularName %>.user.id !== req.user.id) {
					return res.status(403).send('User is not authorized');
				}
			}
			next();

		})
		.catch(function(err){
			return res.status(403).send({message: err});
		});
};


