'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Role = mongoose.model('Role');

/**
 * Globals
 */
var user, role;

/**
 * Unit tests
 */
describe('Role Model Unit Tests:', function() {
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
			role = new Role({
				
				name: 'Role Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return role.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			role.name = '';
			

			return role.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Role.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
