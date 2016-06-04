'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SecondOfFour = mongoose.model('SecondOfFour'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, secondOfFour;

/**
 * Second of four routes tests
 */
describe('Second of four CRUD tests', function() {
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

		// Save a user to the test db and create new Second of four
		user.save(function() {
			secondOfFour = {
				
				name: 'Second of four Name',
				
			};

			done();
		});
	});

	it('should be able to save Second of four instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Second of four
				agent.post('/second-of-fours')
					.send(secondOfFour)
					.expect(200)
					.end(function(secondOfFourSaveErr, secondOfFourSaveRes) {
						// Handle Second of four save error
						if (secondOfFourSaveErr) done(secondOfFourSaveErr);

						// Get a list of Second of fours
						agent.get('/second-of-fours')
							.end(function(secondOfFoursGetErr, secondOfFoursGetRes) {
								// Handle Second of four save error
								if (secondOfFoursGetErr) done(secondOfFoursGetErr);

								// Get Second of fours list
								var secondOfFours = secondOfFoursGetRes.body;

								// Set assertions
								(secondOfFours[0].user._id).should.equal(userId);

								
								(secondOfFours[0].name).should.match('Second of four Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Second of four instance if not logged in', function(done) {
		agent.post('/second-of-fours')
			.send(secondOfFour)
			.expect(401)
			.end(function(secondOfFourSaveErr, secondOfFourSaveRes) {
				// Call the assertion callback
				done(secondOfFourSaveErr);
			});
	});

	it('should not be able to save Second of four instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		secondOfFour.name = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Second of four
				agent.post('/second-of-fours')
					.send(secondOfFour)
					.expect(400)
					.end(function(secondOfFourSaveErr, secondOfFourSaveRes) {
						// Set message assertion
						(secondOfFourSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Second of four save error
						done(secondOfFourSaveErr);
					});
			});
	});

	it('should be able to update Second of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Second of four
				agent.post('/second-of-fours')
					.send(secondOfFour)
					.expect(200)
					.end(function(secondOfFourSaveErr, secondOfFourSaveRes) {
						// Handle Second of four save error
						if (secondOfFourSaveErr) done(secondOfFourSaveErr);

						// Update Second of four property name
						
						secondOfFour.name = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Second of four
						agent.put('/second-of-fours/' + secondOfFourSaveRes.body._id)
							.send(secondOfFour)
							.expect(200)
							.end(function(secondOfFourUpdateErr, secondOfFourUpdateRes) {
								// Handle Second of four update error
								if (secondOfFourUpdateErr) done(secondOfFourUpdateErr);

								// Set assertions
								(secondOfFourUpdateRes.body._id).should.equal(secondOfFourSaveRes.body._id);
								
								(secondOfFourUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Second of fours if not signed in', function(done) {
		// Create new Second of four model instance
		var secondOfFourObj = new SecondOfFour(secondOfFour);

		// Save the Second of four
		secondOfFourObj.save(function() {
			// Request Second of fours
			request(app).get('/second-of-fours')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Second of four if not signed in', function(done) {
		// Create new Second of four model instance
		var secondOfFourObj = new SecondOfFour(secondOfFour);

		// Save the Second of four
		secondOfFourObj.save(function() {
			request(app).get('/second-of-fours/' + secondOfFourObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', secondOfFour.name);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Second of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Second of four
				agent.post('/second-of-fours')
					.send(secondOfFour)
					.expect(200)
					.end(function(secondOfFourSaveErr, secondOfFourSaveRes) {
						// Handle Second of four save error
						if (secondOfFourSaveErr) done(secondOfFourSaveErr);

						// Delete existing Second of four
						agent.delete('/second-of-fours/' + secondOfFourSaveRes.body._id)
							.send(secondOfFour)
							.expect(200)
							.end(function(secondOfFourDeleteErr, secondOfFourDeleteRes) {
								// Handle Second of four error error
								if (secondOfFourDeleteErr) done(secondOfFourDeleteErr);

								// Set assertions
								(secondOfFourDeleteRes.body._id).should.equal(secondOfFourSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Second of four instance if not signed in', function(done) {
		// Set Second of four user 
		secondOfFour.user = user;

		// Create new Second of four model instance
		var secondOfFourObj = new SecondOfFour(secondOfFour);

		// Save the Second of four
		secondOfFourObj.save(function() {
			// Try deleting Second of four
			request(app).delete('/second-of-fours/' + secondOfFourObj._id)
			.expect(401)
			.end(function(secondOfFourDeleteErr, secondOfFourDeleteRes) {
				// Set message assertion
				(secondOfFourDeleteRes.body.message).should.match('User is not logged in');

				// Handle Second of four error error
				done(secondOfFourDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			SecondOfFour.remove().exec(function(){
				done();
			});	
		});
	});
});
