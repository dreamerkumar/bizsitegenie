'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Textbox = mongoose.model('Textbox');

/**
 * Globals
 */
var user, textbox;

/**
 * Unit tests
 */
describe('Textbox Model Unit Tests:', function() {
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
			textbox = new Textbox({
				
				name: 'Textbox Name',
				
				positionIndex: 'Textbox Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return textbox.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			textbox.name = '';
			
			textbox.positionIndex = '';
			

			return textbox.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Textbox.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
