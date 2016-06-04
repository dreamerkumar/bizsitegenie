'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Textbox = mongoose.model('Textbox'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, textbox;

/**
 * Textbox routes tests
 */
describe('Textbox CRUD tests', function() {
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

		// Save a user to the test db and create new Textbox
		user.save(function() {
			textbox = {
				
				name: 'Textbox Name',
				
				positionIndex: 'Textbox Name',
				
			};

			done();
		});
	});

	it('should be able to save Textbox instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textbox
				agent.post('/textboxes')
					.send(textbox)
					.expect(200)
					.end(function(textboxSaveErr, textboxSaveRes) {
						// Handle Textbox save error
						if (textboxSaveErr) done(textboxSaveErr);

						// Get a list of Textboxes
						agent.get('/textboxes')
							.end(function(textboxesGetErr, textboxesGetRes) {
								// Handle Textbox save error
								if (textboxesGetErr) done(textboxesGetErr);

								// Get Textboxes list
								var textboxes = textboxesGetRes.body;

								// Set assertions
								(textboxes[0].user._id).should.equal(userId);

								
								(textboxes[0].name).should.match('Textbox Name');
								
								(textboxes[0].positionIndex).should.match('Textbox Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Textbox instance if not logged in', function(done) {
		agent.post('/textboxes')
			.send(textbox)
			.expect(401)
			.end(function(textboxSaveErr, textboxSaveRes) {
				// Call the assertion callback
				done(textboxSaveErr);
			});
	});

	it('should not be able to save Textbox instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		textbox.name = '';
		
		textbox.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textbox
				agent.post('/textboxes')
					.send(textbox)
					.expect(400)
					.end(function(textboxSaveErr, textboxSaveRes) {
						// Set message assertion
						(textboxSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Textbox save error
						done(textboxSaveErr);
					});
			});
	});

	it('should be able to update Textbox instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textbox
				agent.post('/textboxes')
					.send(textbox)
					.expect(200)
					.end(function(textboxSaveErr, textboxSaveRes) {
						// Handle Textbox save error
						if (textboxSaveErr) done(textboxSaveErr);

						// Update Textbox property name
						
						textbox.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						textbox.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Textbox
						agent.put('/textboxes/' + textboxSaveRes.body._id)
							.send(textbox)
							.expect(200)
							.end(function(textboxUpdateErr, textboxUpdateRes) {
								// Handle Textbox update error
								if (textboxUpdateErr) done(textboxUpdateErr);

								// Set assertions
								(textboxUpdateRes.body._id).should.equal(textboxSaveRes.body._id);
								
								(textboxUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(textboxUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Textboxes if not signed in', function(done) {
		// Create new Textbox model instance
		var textboxObj = new Textbox(textbox);

		// Save the Textbox
		textboxObj.save(function() {
			// Request Textboxes
			request(app).get('/textboxes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Textbox if not signed in', function(done) {
		// Create new Textbox model instance
		var textboxObj = new Textbox(textbox);

		// Save the Textbox
		textboxObj.save(function() {
			request(app).get('/textboxes/' + textboxObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', textbox.name);
					
					res.body.should.be.an.Object.with.property('positionIndex', textbox.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Textbox instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Textbox
				agent.post('/textboxes')
					.send(textbox)
					.expect(200)
					.end(function(textboxSaveErr, textboxSaveRes) {
						// Handle Textbox save error
						if (textboxSaveErr) done(textboxSaveErr);

						// Delete existing Textbox
						agent.delete('/textboxes/' + textboxSaveRes.body._id)
							.send(textbox)
							.expect(200)
							.end(function(textboxDeleteErr, textboxDeleteRes) {
								// Handle Textbox error error
								if (textboxDeleteErr) done(textboxDeleteErr);

								// Set assertions
								(textboxDeleteRes.body._id).should.equal(textboxSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Textbox instance if not signed in', function(done) {
		// Set Textbox user 
		textbox.user = user;

		// Create new Textbox model instance
		var textboxObj = new Textbox(textbox);

		// Save the Textbox
		textboxObj.save(function() {
			// Try deleting Textbox
			request(app).delete('/textboxes/' + textboxObj._id)
			.expect(401)
			.end(function(textboxDeleteErr, textboxDeleteRes) {
				// Set message assertion
				(textboxDeleteRes.body.message).should.match('User is not logged in');

				// Handle Textbox error error
				done(textboxDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Textbox.remove().exec(function(){
				done();
			});	
		});
	});
});
