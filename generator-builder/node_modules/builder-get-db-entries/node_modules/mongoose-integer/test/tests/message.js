/* jshint node: true, mocha: true */
'use strict';

var mongoose = require('mongoose');
var should = require('should');

var helper = require('../helper');
var integerValidation = require('../index');

module.exports = function() {

	describe('Message', function() {
		afterEach(helper.afterEach);

		it('should use default validation message', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerSchema().plugin(integerValidation));

			new Integer({
				value: 0.5
			}).save(function(err) {
				should.exist(err);
				err.errors.value.message.should.equal('Error, expected `value` to be an integer. Value: `0.5`');
				done();
			});
		});

		it('should use custom message via options', function(done) {
			var Integer = mongoose.model('Integer', helper.createIntegerSchema().plugin(integerValidation, {
				message: 'Path: {PATH}, value: {VALUE}, type: {TYPE}'
			}));

			new Integer({
				value: 0.5
			}).save(function(err) {
				should.exist(err);
				err.errors.value.message.should.equal('Path: value, value: 0.5, type: user defined');
				done();
			});
		});

		it('should use custom message from schema configuration', function(done) {
			var Integer = mongoose.model('Integer', helper.createCustomIntegerSchema().plugin(integerValidation, {
				message: 'Path: {PATH}, value: {VALUE}, type: {TYPE}'
			}));

			new Integer({
				value: 0.5
			}).save(function(err) {
				should.exist(err);
				err.errors.value.message.should.equal('Value is not an integer.');
				done();
			});
		});
	});
};
