/* jshint node: true, mocha: true */
'use strict';

var mongoose = require('mongoose');
var should = require('should');

var helper = require('../helper');
var integerValidation = require('../index');

module.exports = function() {

	describe('Validation', function() {
		afterEach(helper.afterEach);

		it('throws error if value is not an integer', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerSchema().plugin(integerValidation));

			new Integer({
				value: 0.5
			}).save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('does not throw error if value is an integer', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerSchema().plugin(integerValidation));

			new Integer({
				value: 1
			}).save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('does not throw error when value is not set', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerSchema().plugin(integerValidation));

			new Integer().save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should only throw error on number types', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerStringSchema().plugin(integerValidation));

			new Integer({
				value: '0.5'
			}).save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('throws error if value is not an integer in nested object', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerNestedObjectSchema().plugin(integerValidation));

			new Integer({
				nested: {
					value: 0.5
				}
			}).save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('throws error if value is not an integer in nested array object', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerNestedObjectArraySchema().plugin(integerValidation));

			new Integer().save(function(err) {
				should.not.exist(err);

				new Integer({
					nested: [{
						value: 0.5
					}, {
						value: 1
					}]
				}).save(function(err) {
					should.exist(err);
					should.exist(err.errors['nested.0.value']);
					should.not.exist(err.errors['nested.1.value']);
					done();
				});

			});
		});

		it('throws error if value is not an integer in nested nested array object', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerNestedNestedObjectArraySchema().plugin(integerValidation));

			new Integer({
				nested: [{
					nested: [{
						value: 0.5
					}, {
						value: 1
					}]
				}]
			}).save(function(err) {
				should.exist(err);
				should.exist(err.errors['nested.0.nested.0.value']);
				should.not.exist(err.errors['nested.0.nested.1.value']);
				done();
			});
		});

		it('throws error if value is not an integer in nested schema', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerNestedSchema());

			new Integer({
				nested: {
					value: 0.5
				}
			}).save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('throws error if value is not an integer in nested array schema', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerNestedSchemaArray());

			new Integer().save(function(err) {
				should.not.exist(err);

				new Integer({
					nested: [{
						value: 0.5
					}, {
						value: 1
					}]
				}).save(function(err) {
					should.exist(err);
					should.exist(err.errors['nested.0.value']);
					should.not.exist(err.errors['nested.1.value']);
					done();
				});
			});
		});

		it('should allow additional custom validation', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerValidationSchema().plugin(integerValidation));

			new Integer({
				value: 6.5
			}).save(function(err) {
				should.exist(err);
				err.errors.value.message.should.equal('Error, expected `value` to be an integer. Value: `6.5`');
				done();
			});
		});

		it('should throw no error on null values', function(done) {
			var Integer = mongoose.model('Integer', helper.createDefaultNullIntegerSchema().plugin(mongooseInteger));

			new Integer().save(function(err) {
				should.not.exist(err);

				done();
			});
		});
	});
};
