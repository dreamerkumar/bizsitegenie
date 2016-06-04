'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserGroupRole = mongoose.model('UserGroupRole');

/**
 * Globals
 */
var user, userGroupRole;

/**
 * Unit tests
 */
describe('User group role Model Unit Tests:', function() {
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
			userGroupRole = new UserGroupRole({
				
				roleId: 'User group role Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return userGroupRole.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			userGroupRole.roleId = '';
			

			return userGroupRole.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		UserGroupRole.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
