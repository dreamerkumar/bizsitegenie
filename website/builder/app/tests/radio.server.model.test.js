'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Radio = mongoose.model('Radio');

/**
 * Globals
 */
var user, radio;

/**
 * Unit tests
 */
describe('Radio Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			radio = new Radio({
				
				name: 'Radio Name',
				
				positionIndex: 'Radio Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return radio.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			radio.name = '';
			
			radio.positionIndex = '';
			

			return radio.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Radio.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
