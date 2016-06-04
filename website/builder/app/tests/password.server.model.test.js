'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Password = mongoose.model('Password');

/**
 * Globals
 */
var user, password;

/**
 * Unit tests
 */
describe('Password Model Unit Tests:', function() {
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
			password = new Password({
				
				name: 'Password Name',
				
				positionIndex: 'Password Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return password.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			password.name = '';
			
			password.positionIndex = '';
			

			return password.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Password.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
