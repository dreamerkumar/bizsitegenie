'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Textarea = mongoose.model('Textarea');

/**
 * Globals
 */
var user, textarea;

/**
 * Unit tests
 */
describe('Textarea Model Unit Tests:', function() {
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
			textarea = new Textarea({
				
				name: 'Textarea Name',
				
				row: 'Textarea Name',
				
				col: 'Textarea Name',
				
				positionIndex: 'Textarea Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return textarea.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			textarea.name = '';
			
			textarea.row = '';
			
			textarea.col = '';
			
			textarea.positionIndex = '';
			

			return textarea.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Textarea.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
