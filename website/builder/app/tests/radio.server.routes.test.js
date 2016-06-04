'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Radio = mongoose.model('Radio'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, radio;

/**
 * Radio routes tests
 */
describe('Radio CRUD tests', function() {
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

		// Save a user to the test db and create new Radio
		user.save(function() {
			radio = {
				
				name: 'Radio Name',
				
				positionIndex: 'Radio Name',
				
			};

			done();
		});
	});

	it('should be able to save Radio instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Radio
				agent.post('/radios')
					.send(radio)
					.expect(200)
					.end(function(radioSaveErr, radioSaveRes) {
						// Handle Radio save error
						if (radioSaveErr) done(radioSaveErr);

						// Get a list of Radios
						agent.get('/radios')
							.end(function(radiosGetErr, radiosGetRes) {
								// Handle Radio save error
								if (radiosGetErr) done(radiosGetErr);

								// Get Radios list
								var radios = radiosGetRes.body;

								// Set assertions
								(radios[0].user._id).should.equal(userId);

								
								(radios[0].name).should.match('Radio Name');
								
								(radios[0].positionIndex).should.match('Radio Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Radio instance if not logged in', function(done) {
		agent.post('/radios')
			.send(radio)
			.expect(401)
			.end(function(radioSaveErr, radioSaveRes) {
				// Call the assertion callback
				done(radioSaveErr);
			});
	});

	it('should not be able to save Radio instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		radio.name = '';
		
		radio.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Radio
				agent.post('/radios')
					.send(radio)
					.expect(400)
					.end(function(radioSaveErr, radioSaveRes) {
						// Set message assertion
						(radioSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Radio save error
						done(radioSaveErr);
					});
			});
	});

	it('should be able to update Radio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Radio
				agent.post('/radios')
					.send(radio)
					.expect(200)
					.end(function(radioSaveErr, radioSaveRes) {
						// Handle Radio save error
						if (radioSaveErr) done(radioSaveErr);

						// Update Radio property name
						
						radio.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						radio.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Radio
						agent.put('/radios/' + radioSaveRes.body._id)
							.send(radio)
							.expect(200)
							.end(function(radioUpdateErr, radioUpdateRes) {
								// Handle Radio update error
								if (radioUpdateErr) done(radioUpdateErr);

								// Set assertions
								(radioUpdateRes.body._id).should.equal(radioSaveRes.body._id);
								
								(radioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(radioUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Radios if not signed in', function(done) {
		// Create new Radio model instance
		var radioObj = new Radio(radio);

		// Save the Radio
		radioObj.save(function() {
			// Request Radios
			request(app).get('/radios')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Radio if not signed in', function(done) {
		// Create new Radio model instance
		var radioObj = new Radio(radio);

		// Save the Radio
		radioObj.save(function() {
			request(app).get('/radios/' + radioObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', radio.name);
					
					res.body.should.be.an.Object.with.property('positionIndex', radio.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Radio instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Radio
				agent.post('/radios')
					.send(radio)
					.expect(200)
					.end(function(radioSaveErr, radioSaveRes) {
						// Handle Radio save error
						if (radioSaveErr) done(radioSaveErr);

						// Delete existing Radio
						agent.delete('/radios/' + radioSaveRes.body._id)
							.send(radio)
							.expect(200)
							.end(function(radioDeleteErr, radioDeleteRes) {
								// Handle Radio error error
								if (radioDeleteErr) done(radioDeleteErr);

								// Set assertions
								(radioDeleteRes.body._id).should.equal(radioSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Radio instance if not signed in', function(done) {
		// Set Radio user 
		radio.user = user;

		// Create new Radio model instance
		var radioObj = new Radio(radio);

		// Save the Radio
		radioObj.save(function() {
			// Try deleting Radio
			request(app).delete('/radios/' + radioObj._id)
			.expect(401)
			.end(function(radioDeleteErr, radioDeleteRes) {
				// Set message assertion
				(radioDeleteRes.body.message).should.match('User is not logged in');

				// Handle Radio error error
				done(radioDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Radio.remove().exec(function(){
				done();
			});	
		});
	});
});
