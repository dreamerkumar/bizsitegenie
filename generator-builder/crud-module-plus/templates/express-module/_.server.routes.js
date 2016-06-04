'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var <%= camelizedPluralName %> = require('../../app/controllers/<%= slugifiedPluralName %>.server.controller');

	// <%= humanizedPluralName %> Routes
	app.route('/<%= slugifiedPluralName %>')
		.get(<%= camelizedPluralName %>.list)
		.post(users.requiresLogin, <%= camelizedPluralName %>.hasCreateAuthorization, <%= camelizedPluralName %>.create);

	
	app.route('/<%= slugifiedPluralName %>/search')
		.get(<%= camelizedPluralName %>.search);

	app.route('/<%= slugifiedPluralName %>/:<%= camelizedSingularName %>Id')
		.get(users.requiresLogin, <%= camelizedPluralName %>.hasReadAuthorization, <%= camelizedPluralName %>.read)
		.put(users.requiresLogin, <%= camelizedPluralName %>.hasEditAuthorization, <%= camelizedPluralName %>.update)
		.delete(users.requiresLogin, <%= camelizedPluralName %>.hasDeleteAuthorization, <%= camelizedPluralName %>.delete);

	// Finish by binding the <%= humanizedSingularName %> middleware
	app.param('<%= camelizedSingularName %>Id', <%= camelizedPluralName %>.<%= camelizedSingularName %>ByID);
};
