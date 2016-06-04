'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var featureroles = require('../../app/controllers/featureroles.server.controller');

	// Featureroles Routes
	app.route('/itemroles')
		.get(featureroles.list)
		.post(users.requiresLogin, featureroles.create);

	
	app.route('/itemroles/search')
		.get(featureroles.search);

	app.route('/itemroles/getbyaccesstype')
		.get(featureroles.getByAccessType);

	app.route('/itemroles/deleteitemrole')
		.post(featureroles.deleteFeatureRole);

	app.route('/itemroles/:featurerolesId')
		.get(users.requiresLogin, featureroles.hasAuthorization, featureroles.read)
		.put(users.requiresLogin, featureroles.hasAuthorization, featureroles.update)
		.delete(users.requiresLogin, featureroles.hasAuthorization, featureroles.delete);

	// Finish by binding the Featurerole middleware
	app.param('featurerolesId', featureroles.featurerolesByID);
};
