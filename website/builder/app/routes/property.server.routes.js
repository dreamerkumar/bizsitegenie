'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var property = require('../../app/controllers/property.server.controller');
	var addMultipleProperties = require('../../app/controllers/add-multiple-properties.server.controller');
	var updatePropertyPositions = require('../../app/controllers/update-property-positions.server.controller');

	// Properties Routes
	app.route('/property')
		.get(property.list)
		.post(users.requiresLogin, property.hasCreateAuthorization, property.create);

	
	app.route('/property/search')
		.get(property.search);

	app.route('/property/add-multiple-properties')
		.post(users.requiresLogin, addMultipleProperties.addMultipleProperties);

	app.route('/property/update-property-positions')
		.post(users.requiresLogin, updatePropertyPositions.updatePropertyPositions);

	app.route('/property/:propertyId')
		.get(users.requiresLogin, property.hasReadAuthorization, property.read)
		.put(users.requiresLogin, property.hasEditAuthorization, property.update)
		.delete(users.requiresLogin, property.hasDeleteAuthorization, property.delete);

	// Finish by binding the Property middleware
	app.param('propertyId', property.propertyByID);
};
