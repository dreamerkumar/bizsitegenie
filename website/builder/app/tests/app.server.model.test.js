'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	App = mongoose.model('App');

/**
 * Globals
 */
var user, app;

/**
 * Unit tests
 */
describe('App Model Unit Tests:', function() {
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
			app = new App({
				
				name: 'App Name',
				
				appDescription: 'App Name',
				
				appKeyword: 'App Name',
				
				appAuthor: 'App Name',
				
				bootstrapTheme: 'App Name',
				
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return app.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without property name', function(done) { 
			
			app.name = '';
			
			app.appDescription = '';
			
			app.appKeyword = '';
			
			app.appAuthor = '';
			
			app.bootstrapTheme = '';
			

			return app.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		App.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});
	});
});
