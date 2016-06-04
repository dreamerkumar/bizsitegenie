'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FirstOfFour = mongoose.model('FirstOfFour');

/**
 * Globals
 */
var user, firstOfFour;

/**
 * Unit tests
 */
describe('First of four Model Unit Tests:', function() {
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
			firstOfFour = new FirstOfFour({
				
				name: 'First of four Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return firstOfFour.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			firstOfFour.name = '';
			

			return firstOfFour.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FirstOfFour.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
