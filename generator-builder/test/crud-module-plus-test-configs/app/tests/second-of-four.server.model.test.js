'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SecondOfFour = mongoose.model('SecondOfFour');

/**
 * Globals
 */
var user, secondOfFour;

/**
 * Unit tests
 */
describe('Second of four Model Unit Tests:', function() {
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
			secondOfFour = new SecondOfFour({
				
				name: 'Second of four Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return secondOfFour.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			secondOfFour.name = '';
			

			return secondOfFour.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		SecondOfFour.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
