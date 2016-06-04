'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	App = mongoose.model('App'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, app;

/**
 * App routes tests
 */
describe('App CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new App
		user.save(function() {
			app = {
				
				name: 'App Name',
				
				appDescription: 'App Name',
				
				appKeyword: 'App Name',
				
				appAuthor: 'App Name',
				
				bootstrapTheme: 'App Name',
				
			};

			done();
		});
	});

	it('should be able to save App instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new App
				agent.post('/apps')
					.send(app)
					.expect(200)
					.end(function(appSaveErr, appSaveRes) {
						// Handle App save error
						if (appSaveErr) done(appSaveErr);

						// Get a list of Apps
						agent.get('/apps')
							.end(function(appsGetErr, appsGetRes) {
								// Handle App save error
								if (appsGetErr) done(appsGetErr);

								// Get Apps list
								var apps = appsGetRes.body;

								// Set assertions
								(apps[0].user._id).should.equal(userId);

								
								(apps[0].name).should.match('App Name');
								
								(apps[0].appDescription).should.match('App Name');
								
								(apps[0].appKeyword).should.match('App Name');
								
								(apps[0].appAuthor).should.match('App Name');
								
								(apps[0].bootstrapTheme).should.match('App Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save App instance if not logged in', function(done) {
		agent.post('/apps')
			.send(app)
			.expect(401)
			.end(function(appSaveErr, appSaveRes) {
				// Call the assertion callback
				done(appSaveErr);
			});
	});

	it('should not be able to save App instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		app.name = '';
		
		app.appDescription = '';
		
		app.appKeyword = '';
		
		app.appAuthor = '';
		
		app.bootstrapTheme = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new App
				agent.post('/apps')
					.send(app)
					.expect(400)
					.end(function(appSaveErr, appSaveRes) {
						// Set message assertion
						(appSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle App save error
						done(appSaveErr);
					});
			});
	});

	it('should be able to update App instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new App
				agent.post('/apps')
					.send(app)
					.expect(200)
					.end(function(appSaveErr, appSaveRes) {
						// Handle App save error
						if (appSaveErr) done(appSaveErr);

						// Update App property name
						
						app.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						app.appDescription = 'WHY YOU GOTTA BE SO MEAN?';
						
						app.appKeyword = 'WHY YOU GOTTA BE SO MEAN?';
						
						app.appAuthor = 'WHY YOU GOTTA BE SO MEAN?';
						
						app.bootstrapTheme = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing App
						agent.put('/apps/' + appSaveRes.body._id)
							.send(app)
							.expect(200)
							.end(function(appUpdateErr, appUpdateRes) {
								// Handle App update error
								if (appUpdateErr) done(appUpdateErr);

								// Set assertions
								(appUpdateRes.body._id).should.equal(appSaveRes.body._id);
								
								(appUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(appUpdateRes.body.appDescription).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(appUpdateRes.body.appKeyword).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(appUpdateRes.body.appAuthor).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(appUpdateRes.body.bootstrapTheme).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Apps if not signed in', function(done) {
		// Create new App model instance
		var appObj = new App(app);

		// Save the App
		appObj.save(function() {
			// Request Apps
			request(app).get('/apps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single App if not signed in', function(done) {
		// Create new App model instance
		var appObj = new App(app);

		// Save the App
		appObj.save(function() {
			request(app).get('/apps/' + appObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', app.name);
					
					res.body.should.be.an.Object.with.property('appDescription', app.appDescription);
					
					res.body.should.be.an.Object.with.property('appKeyword', app.appKeyword);
					
					res.body.should.be.an.Object.with.property('appAuthor', app.appAuthor);
					
					res.body.should.be.an.Object.with.property('bootstrapTheme', app.bootstrapTheme);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete App instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new App
				agent.post('/apps')
					.send(app)
					.expect(200)
					.end(function(appSaveErr, appSaveRes) {
						// Handle App save error
						if (appSaveErr) done(appSaveErr);

						// Delete existing App
						agent.delete('/apps/' + appSaveRes.body._id)
							.send(app)
							.expect(200)
							.end(function(appDeleteErr, appDeleteRes) {
								// Handle App error error
								if (appDeleteErr) done(appDeleteErr);

								// Set assertions
								(appDeleteRes.body._id).should.equal(appSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete App instance if not signed in', function(done) {
		// Set App user 
		app.user = user;

		// Create new App model instance
		var appObj = new App(app);

		// Save the App
		appObj.save(function() {
			// Try deleting App
			request(app).delete('/apps/' + appObj._id)
			.expect(401)
			.end(function(appDeleteErr, appDeleteRes) {
				// Set message assertion
				(appDeleteRes.body.message).should.match('User is not logged in');

				// Handle App error error
				done(appDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			App.remove().exec(function(){
				done();
			});	
		});
	});
});
