'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Checkbox = mongoose.model('Checkbox'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, checkbox;

/**
 * Checkbox routes tests
 */
describe('Checkbox CRUD tests', function() {
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

		// Save a user to the test db and create new Checkbox
		user.save(function() {
			checkbox = {
				
				name: 'Checkbox Name',
				
				value: 'Checkbox Name',
				
				positionIndex: 'Checkbox Name',
				
			};

			done();
		});
	});

	it('should be able to save Checkbox instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checkbox
				agent.post('/checkboxes')
					.send(checkbox)
					.expect(200)
					.end(function(checkboxSaveErr, checkboxSaveRes) {
						// Handle Checkbox save error
						if (checkboxSaveErr) done(checkboxSaveErr);

						// Get a list of Checkboxes
						agent.get('/checkboxes')
							.end(function(checkboxesGetErr, checkboxesGetRes) {
								// Handle Checkbox save error
								if (checkboxesGetErr) done(checkboxesGetErr);

								// Get Checkboxes list
								var checkboxes = checkboxesGetRes.body;

								// Set assertions
								(checkboxes[0].user._id).should.equal(userId);

								
								(checkboxes[0].name).should.match('Checkbox Name');
								
								(checkboxes[0].value).should.match('Checkbox Name');
								
								(checkboxes[0].positionIndex).should.match('Checkbox Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Checkbox instance if not logged in', function(done) {
		agent.post('/checkboxes')
			.send(checkbox)
			.expect(401)
			.end(function(checkboxSaveErr, checkboxSaveRes) {
				// Call the assertion callback
				done(checkboxSaveErr);
			});
	});

	it('should not be able to save Checkbox instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		checkbox.name = '';
		
		checkbox.value = '';
		
		checkbox.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checkbox
				agent.post('/checkboxes')
					.send(checkbox)
					.expect(400)
					.end(function(checkboxSaveErr, checkboxSaveRes) {
						// Set message assertion
						(checkboxSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Checkbox save error
						done(checkboxSaveErr);
					});
			});
	});

	it('should be able to update Checkbox instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checkbox
				agent.post('/checkboxes')
					.send(checkbox)
					.expect(200)
					.end(function(checkboxSaveErr, checkboxSaveRes) {
						// Handle Checkbox save error
						if (checkboxSaveErr) done(checkboxSaveErr);

						// Update Checkbox property name
						
						checkbox.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						checkbox.value = 'WHY YOU GOTTA BE SO MEAN?';
						
						checkbox.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Checkbox
						agent.put('/checkboxes/' + checkboxSaveRes.body._id)
							.send(checkbox)
							.expect(200)
							.end(function(checkboxUpdateErr, checkboxUpdateRes) {
								// Handle Checkbox update error
								if (checkboxUpdateErr) done(checkboxUpdateErr);

								// Set assertions
								(checkboxUpdateRes.body._id).should.equal(checkboxSaveRes.body._id);
								
								(checkboxUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(checkboxUpdateRes.body.value).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(checkboxUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Checkboxes if not signed in', function(done) {
		// Create new Checkbox model instance
		var checkboxObj = new Checkbox(checkbox);

		// Save the Checkbox
		checkboxObj.save(function() {
			// Request Checkboxes
			request(app).get('/checkboxes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Checkbox if not signed in', function(done) {
		// Create new Checkbox model instance
		var checkboxObj = new Checkbox(checkbox);

		// Save the Checkbox
		checkboxObj.save(function() {
			request(app).get('/checkboxes/' + checkboxObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', checkbox.name);
					
					res.body.should.be.an.Object.with.property('value', checkbox.value);
					
					res.body.should.be.an.Object.with.property('positionIndex', checkbox.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Checkbox instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Checkbox
				agent.post('/checkboxes')
					.send(checkbox)
					.expect(200)
					.end(function(checkboxSaveErr, checkboxSaveRes) {
						// Handle Checkbox save error
						if (checkboxSaveErr) done(checkboxSaveErr);

						// Delete existing Checkbox
						agent.delete('/checkboxes/' + checkboxSaveRes.body._id)
							.send(checkbox)
							.expect(200)
							.end(function(checkboxDeleteErr, checkboxDeleteRes) {
								// Handle Checkbox error error
								if (checkboxDeleteErr) done(checkboxDeleteErr);

								// Set assertions
								(checkboxDeleteRes.body._id).should.equal(checkboxSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Checkbox instance if not signed in', function(done) {
		// Set Checkbox user 
		checkbox.user = user;

		// Create new Checkbox model instance
		var checkboxObj = new Checkbox(checkbox);

		// Save the Checkbox
		checkboxObj.save(function() {
			// Try deleting Checkbox
			request(app).delete('/checkboxes/' + checkboxObj._id)
			.expect(401)
			.end(function(checkboxDeleteErr, checkboxDeleteRes) {
				// Set message assertion
				(checkboxDeleteRes.body.message).should.match('User is not logged in');

				// Handle Checkbox error error
				done(checkboxDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Checkbox.remove().exec(function(){
				done();
			});	
		});
	});
});
