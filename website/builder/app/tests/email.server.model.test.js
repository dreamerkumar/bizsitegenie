'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Email = mongoose.model('Email');

/**
 * Globals
 */
var user, email;

/**
 * Unit tests
 */
describe('Email Model Unit Tests:', function() {
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
			email = new Email({
				
				name: 'Email Name',
				
				positionIndex: 'Email Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return email.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			email.name = '';
			
			email.positionIndex = '';
			

			return email.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Email.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
