'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserGroup = mongoose.model('UserGroup');

/**
 * Globals
 */
var user, userGroup;

/**
 * Unit tests
 */
describe('User group Model Unit Tests:', function() {
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
			userGroup = new UserGroup({
				
				name: 'User group Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return userGroup.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			userGroup.name = '';
			

			return userGroup.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		UserGroup.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
