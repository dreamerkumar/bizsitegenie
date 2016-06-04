'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ThirdOfFour = mongoose.model('ThirdOfFour');

/**
 * Globals
 */
var user, thirdOfFour;

/**
 * Unit tests
 */
describe('Third of four Model Unit Tests:', function() {
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
			thirdOfFour = new ThirdOfFour({
				
				name: 'Third of four Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return thirdOfFour.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			thirdOfFour.name = '';
			

			return thirdOfFour.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ThirdOfFour.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
