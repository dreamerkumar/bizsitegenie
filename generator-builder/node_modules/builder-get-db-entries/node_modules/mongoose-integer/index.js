/* jshint node: true */
'use strict';

module.exports = function(schema, options) {
	options = options || {};
	var message = options.message || 'Error, expected `{PATH}` to be an integer. Value: `{VALUE}`';

	var addIntegerValidation = function(pathname, schema) {
		var instance = schema.paths[pathname].instance;
		var options = schema.paths[pathname].options;

		if (options.integer && instance === 'Number') {
			var pathMessage = message;
			if (typeof options.integer === 'string') {
				pathMessage = options.integer;
			}

			schema.path(pathname).validate(function(value) {
				if (!value) return true;

				return parseInt(value) === value;
			}, pathMessage);
		}
	};

	var recursiveIteration = function(schema) {
		for (var key in schema.paths) {
			if (schema.paths[key].schema) recursiveIteration(schema.paths[key].schema);
			else addIntegerValidation(schema.paths[key].path, schema);
		}
	};

	recursiveIteration(schema);
};
