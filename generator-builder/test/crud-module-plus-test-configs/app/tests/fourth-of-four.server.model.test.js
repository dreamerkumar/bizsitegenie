'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FourthOfFour = mongoose.model('FourthOfFour');

/**
 * Globals
 */
var user, fourthOfFour;

/**
 * Unit tests
 */
describe('Fourth of four Model Unit Tests:', function() {
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
			fourthOfFour = new FourthOfFour({
				
				name: 'Fourth of four Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return fourthOfFour.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			fourthOfFour.name = '';
			

			return fourthOfFour.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		FourthOfFour.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
