'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Featureroles = mongoose.model('Featureroles'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, featureroles;

/**
 * Featurerole routes tests
 */
describe('Featurerole CRUD tests', function() {
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

		// Save a user to the test db and create new Featurerole
		user.save(function() {
			featureroles = {
				
				parentId: 'Featurerole Name',
				
				accesstype: 'Featurerole Name',
				
				role: 'Featurerole Name',
				
			};

			done();
		});
	});

	it('should be able to save Featurerole instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurerole
				agent.post('/featureroles')
					.send(featureroles)
					.expect(200)
					.end(function(featurerolesSaveErr, featurerolesSaveRes) {
						// Handle Featurerole save error
						if (featurerolesSaveErr) done(featurerolesSaveErr);

						// Get a list of Featureroles
						agent.get('/featureroles')
							.end(function(featurerolesGetErr, featurerolesGetRes) {
								// Handle Featurerole save error
								if (featurerolesGetErr) done(featurerolesGetErr);

								// Get Featureroles list
								var featureroles = featurerolesGetRes.body;

								// Set assertions
								(featureroles[0].user._id).should.equal(userId);

								
								(featureroles[0].parentId).should.match('Featurerole Name');
								
								(featureroles[0].accesstype).should.match('Featurerole Name');
								
								(featureroles[0].role).should.match('Featurerole Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Featurerole instance if not logged in', function(done) {
		agent.post('/featureroles')
			.send(featureroles)
			.expect(401)
			.end(function(featurerolesSaveErr, featurerolesSaveRes) {
				// Call the assertion callback
				done(featurerolesSaveErr);
			});
	});

	
	it('should not be able to save Featurerole instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		featureroles.parentId = '';
		
		featureroles.accesstype = '';
		
		featureroles.role = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurerole
				agent.post('/featureroles')
					.send(featureroles)
					.expect(400)
					.end(function(featurerolesSaveErr, featurerolesSaveRes) {
						// Set message assertion
						(featurerolesSaveRes.body.message).should.match('Please fill \'parent id\'');
						
						// Handle Featurerole save error
						done(featurerolesSaveErr);
					});
			});
	});
	

	it('should be able to update Featurerole instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurerole
				agent.post('/featureroles')
					.send(featureroles)
					.expect(200)
					.end(function(featurerolesSaveErr, featurerolesSaveRes) {
						// Handle Featurerole save error
						if (featurerolesSaveErr) done(featurerolesSaveErr);

						// Update Featurerole property name
						
						featureroles.parentId = 'WHY YOU GOTTA BE SO MEAN?';
						
						featureroles.accesstype = 'WHY YOU GOTTA BE SO MEAN?';
						
						featureroles.role = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Featurerole
						agent.put('/featureroles/' + featurerolesSaveRes.body._id)
							.send(featureroles)
							.expect(200)
							.end(function(featurerolesUpdateErr, featurerolesUpdateRes) {
								// Handle Featurerole update error
								if (featurerolesUpdateErr) done(featurerolesUpdateErr);

								// Set assertions
								(featurerolesUpdateRes.body._id).should.equal(featurerolesSaveRes.body._id);
								
								(featurerolesUpdateRes.body.parentId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featurerolesUpdateRes.body.accesstype).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featurerolesUpdateRes.body.role).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Featureroles if not signed in', function(done) {
		// Create new Featurerole model instance
		var featurerolesObj = new Featureroles(featureroles);

		// Save the Featurerole
		featurerolesObj.save(function() {
			// Request Featureroles
			request(app).get('/featureroles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Featurerole if not signed in', function(done) {
		// Create new Featurerole model instance
		var featurerolesObj = new Featureroles(featureroles);

		// Save the Featurerole
		featurerolesObj.save(function() {
			request(app).get('/featureroles/' + featurerolesObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('parentId', featureroles.parentId);
					
					res.body.should.be.an.Object.with.property('accesstype', featureroles.accesstype);
					
					res.body.should.be.an.Object.with.property('role', featureroles.role);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Featurerole instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Featurerole
				agent.post('/featureroles')
					.send(featureroles)
					.expect(200)
					.end(function(featurerolesSaveErr, featurerolesSaveRes) {
						// Handle Featurerole save error
						if (featurerolesSaveErr) done(featurerolesSaveErr);

						// Delete existing Featurerole
						agent.delete('/featureroles/' + featurerolesSaveRes.body._id)
							.send(featureroles)
							.expect(200)
							.end(function(featurerolesDeleteErr, featurerolesDeleteRes) {
								// Handle Featurerole error error
								if (featurerolesDeleteErr) done(featurerolesDeleteErr);

								// Set assertions
								(featurerolesDeleteRes.body._id).should.equal(featurerolesSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Featurerole instance if not signed in', function(done) {
		// Set Featurerole user 
		featureroles.user = user;

		// Create new Featurerole model instance
		var featurerolesObj = new Featureroles(featureroles);

		// Save the Featurerole
		featurerolesObj.save(function() {
			// Try deleting Featurerole
			request(app).delete('/featureroles/' + featurerolesObj._id)
			.expect(401)
			.end(function(featurerolesDeleteErr, featurerolesDeleteRes) {
				// Set message assertion
				(featurerolesDeleteRes.body.message).should.match('User is not logged in');

				// Handle Featurerole error error
				done(featurerolesDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Featureroles.remove().exec(function(){
				done();
			});	
		});
	});
});
