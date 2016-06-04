'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dashboard = mongoose.model('Dashboard'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dashboard;

/**
 * Dashboard routes tests
 */
describe('Dashboard CRUD tests', function() {
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

		// Save a user to the test db and create new Dashboard
		user.save(function() {
			dashboard = {
				
				name: 'Dashboard Name',
				
				content: 'Dashboard Name',
				
			};

			done();
		});
	});

	it('should be able to save Dashboard instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dashboard
				agent.post('/dashboard')
					.send(dashboard)
					.expect(200)
					.end(function(dashboardSaveErr, dashboardSaveRes) {
						// Handle Dashboard save error
						if (dashboardSaveErr) done(dashboardSaveErr);

						// Get a list of Dashboards
						agent.get('/dashboard')
							.end(function(dashboardGetErr, dashboardGetRes) {
								// Handle Dashboard save error
								if (dashboardGetErr) done(dashboardGetErr);

								// Get Dashboards list
								var dashboard = dashboardGetRes.body;

								// Set assertions
								(dashboard[0].user._id).should.equal(userId);

								
								(dashboard[0].name).should.match('Dashboard Name');
								
								(dashboard[0].content).should.match('Dashboard Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dashboard instance if not logged in', function(done) {
		agent.post('/dashboard')
			.send(dashboard)
			.expect(401)
			.end(function(dashboardSaveErr, dashboardSaveRes) {
				// Call the assertion callback
				done(dashboardSaveErr);
			});
	});

	
	it('should not be able to save Dashboard instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		dashboard.name = '';
		
		dashboard.content = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dashboard
				agent.post('/dashboard')
					.send(dashboard)
					.expect(400)
					.end(function(dashboardSaveErr, dashboardSaveRes) {
						// Set message assertion
						(dashboardSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Dashboard save error
						done(dashboardSaveErr);
					});
			});
	});
	

	it('should be able to update Dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dashboard
				agent.post('/dashboard')
					.send(dashboard)
					.expect(200)
					.end(function(dashboardSaveErr, dashboardSaveRes) {
						// Handle Dashboard save error
						if (dashboardSaveErr) done(dashboardSaveErr);

						// Update Dashboard property name
						
						dashboard.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						dashboard.content = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Dashboard
						agent.put('/dashboard/' + dashboardSaveRes.body._id)
							.send(dashboard)
							.expect(200)
							.end(function(dashboardUpdateErr, dashboardUpdateRes) {
								// Handle Dashboard update error
								if (dashboardUpdateErr) done(dashboardUpdateErr);

								// Set assertions
								(dashboardUpdateRes.body._id).should.equal(dashboardSaveRes.body._id);
								
								(dashboardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(dashboardUpdateRes.body.content).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dashboards if not signed in', function(done) {
		// Create new Dashboard model instance
		var dashboardObj = new Dashboard(dashboard);

		// Save the Dashboard
		dashboardObj.save(function() {
			// Request Dashboards
			request(app).get('/dashboard')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dashboard if not signed in', function(done) {
		// Create new Dashboard model instance
		var dashboardObj = new Dashboard(dashboard);

		// Save the Dashboard
		dashboardObj.save(function() {
			request(app).get('/dashboard/' + dashboardObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', dashboard.name);
					
					res.body.should.be.an.Object.with.property('content', dashboard.content);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dashboard instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dashboard
				agent.post('/dashboard')
					.send(dashboard)
					.expect(200)
					.end(function(dashboardSaveErr, dashboardSaveRes) {
						// Handle Dashboard save error
						if (dashboardSaveErr) done(dashboardSaveErr);

						// Delete existing Dashboard
						agent.delete('/dashboard/' + dashboardSaveRes.body._id)
							.send(dashboard)
							.expect(200)
							.end(function(dashboardDeleteErr, dashboardDeleteRes) {
								// Handle Dashboard error error
								if (dashboardDeleteErr) done(dashboardDeleteErr);

								// Set assertions
								(dashboardDeleteRes.body._id).should.equal(dashboardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dashboard instance if not signed in', function(done) {
		// Set Dashboard user 
		dashboard.user = user;

		// Create new Dashboard model instance
		var dashboardObj = new Dashboard(dashboard);

		// Save the Dashboard
		dashboardObj.save(function() {
			// Try deleting Dashboard
			request(app).delete('/dashboard/' + dashboardObj._id)
			.expect(401)
			.end(function(dashboardDeleteErr, dashboardDeleteRes) {
				// Set message assertion
				(dashboardDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dashboard error error
				done(dashboardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Dashboard.remove().exec(function(){
				done();
			});	
		});
	});
});
