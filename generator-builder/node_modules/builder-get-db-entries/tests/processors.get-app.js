'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	App = mongoose.model('App'),
	getApp = require('../app/processors/get-app.js'),
	path = require('path');

/**
 * Globals
 */
var appId;

/**
 * Unit tests
 */
describe('processors.get-app tests', function(){

	beforeEach(function(done){
		var user, app;
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function(err) {
			app = new App({
				name: 'App Name',
				appDescription: 'App Name',
				appKeyword: 'App Name',
				appAuthor: 'App Name',
				bootstrapTheme: 'App Name',
				user: user
			});

			app.save(function(appSaveErr) {
				should.not.exist(appSaveErr);
				appId = app._id;
				done();
			});			
		});		
	 });

	describe('getAppByID', function() {
		it('should return the app from the database for a given app id', function(done) {
			getApp.getAppByID(appId, function(err, val){
				should.not.exist(err);
				should.exist(val);
				val._id.toString().should.be.equal(appId.toString());
				done();
			});
		});
	});

	afterEach(function(done){
		App.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});	
	});
});