'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Option11 = mongoose.model('Option11');

/**
 * Globals
 */
var user, option11;

/**
 * Unit tests
 */
describe('Option Model Unit Tests:', function() {
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
			option11 = new Option11({
				
				text: 'Option Name',
				
				value: 'Option Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return option11.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			option11.text = '';
			
			option11.value = '';
			

			return option11.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Option11.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
