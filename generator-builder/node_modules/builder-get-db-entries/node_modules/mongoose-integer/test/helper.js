/* jshint node: true */
'use strict';

var mongoose = require('mongoose');
var integerValidation = require('../index');

module.exports = {

	afterEach: function(done) {
		for (var key in mongoose.connection.collections) {
			mongoose.connection.collections[key].remove();
		}

		mongoose.models = {};
		mongoose.modelSchemas = {};
		mongoose.connection.models = {};
		done();
	},

	createIntegerSchema: function() {
		return new mongoose.Schema({
			value: {
				type: Number,
				integer: true
			}
		});
	},

	createIntegerStringSchema: function() {
		return new mongoose.Schema({
			value: {
				type: String,
				integer: true
			}
		});
	},

	createIntegerNestedObjectSchema: function() {
		return new mongoose.Schema({
			nested: {
				value: {
					type: Number,
					integer: true
				}
			}
		});
	},

	createIntegerNestedObjectArraySchema: function() {
		return new mongoose.Schema({
			nested: [{
				value: {
					type: Number,
					integer: true
				}
			}]
		});
	},

	createIntegerNestedNestedObjectArraySchema: function() {
		return new mongoose.Schema({
			nested: [{
				nested: [{
					value: {
						type: Number,
						integer: true
					}
				}]
			}]
		});
	},

	createIntegerNestedSchema: function() {
		var nestedSchema = new mongoose.Schema({
			value: {
				type: Number,
				integer: true
			}
		});

		nestedSchema.plugin(mongooseInteger);

		return new mongoose.Schema({
			nested: nestedSchema
		});
	},

	createIntegerNestedSchemaArray: function() {
		var nestedSchema = new mongoose.Schema({
			value: {
				type: Number,
				integer: true
			}
		});

		nestedSchema.plugin(integerValidation);

		return new mongoose.Schema({
			nested: [nestedSchema]
		});
	},

	createIntegerValidationSchema: function() {
		var schema = new mongoose.Schema({
			value: {
				type: Number,
				integer: true,
				required: true,
				min: 1,
				max: 10
			}
		});

		schema.path('value').validate(function(value) {
			return value > 5;
		}, 'Value is not greater than 5.');

		return schema;
	},

	createCustomIntegerSchema: function() {
		return new mongoose.Schema({
			value: {
				type: Number,
				integer: 'Value is not an integer.'
			}
		});
	},

	createDefaultNullIntegerSchema: function() {
		return new mongoose.Schema({
			value: {
				type: Number,
				integer: true,
				default: null
			}
		});
	}
};
