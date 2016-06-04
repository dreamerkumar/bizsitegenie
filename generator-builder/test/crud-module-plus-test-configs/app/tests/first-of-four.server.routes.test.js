'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FirstOfFour = mongoose.model('FirstOfFour'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, firstOfFour;

/**
 * First of four routes tests
 */
describe('First of four CRUD tests', function() {
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

		// Save a user to the test db and create new First of four
		user.save(function() {
			firstOfFour = {
				
				name: 'First of four Name',
				
			};

			done();
		});
	});

	it('should be able to save First of four instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new First of four
				agent.post('/first-of-fours')
					.send(firstOfFour)
					.expect(200)
					.end(function(firstOfFourSaveErr, firstOfFourSaveRes) {
						// Handle First of four save error
						if (firstOfFourSaveErr) done(firstOfFourSaveErr);

						// Get a list of First of fours
						agent.get('/first-of-fours')
							.end(function(firstOfFoursGetErr, firstOfFoursGetRes) {
								// Handle First of four save error
								if (firstOfFoursGetErr) done(firstOfFoursGetErr);

								// Get First of fours list
								var firstOfFours = firstOfFoursGetRes.body;

								// Set assertions
								(firstOfFours[0].user._id).should.equal(userId);

								
								(firstOfFours[0].name).should.match('First of four Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save First of four instance if not logged in', function(done) {
		agent.post('/first-of-fours')
			.send(firstOfFour)
			.expect(401)
			.end(function(firstOfFourSaveErr, firstOfFourSaveRes) {
				// Call the assertion callback
				done(firstOfFourSaveErr);
			});
	});

	it('should not be able to save First of four instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		firstOfFour.name = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new First of four
				agent.post('/first-of-fours')
					.send(firstOfFour)
					.expect(400)
					.end(function(firstOfFourSaveErr, firstOfFourSaveRes) {
						// Set message assertion
						(firstOfFourSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle First of four save error
						done(firstOfFourSaveErr);
					});
			});
	});

	it('should be able to update First of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new First of four
				agent.post('/first-of-fours')
					.send(firstOfFour)
					.expect(200)
					.end(function(firstOfFourSaveErr, firstOfFourSaveRes) {
						// Handle First of four save error
						if (firstOfFourSaveErr) done(firstOfFourSaveErr);

						// Update First of four property name
						
						firstOfFour.name = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing First of four
						agent.put('/first-of-fours/' + firstOfFourSaveRes.body._id)
							.send(firstOfFour)
							.expect(200)
							.end(function(firstOfFourUpdateErr, firstOfFourUpdateRes) {
								// Handle First of four update error
								if (firstOfFourUpdateErr) done(firstOfFourUpdateErr);

								// Set assertions
								(firstOfFourUpdateRes.body._id).should.equal(firstOfFourSaveRes.body._id);
								
								(firstOfFourUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of First of fours if not signed in', function(done) {
		// Create new First of four model instance
		var firstOfFourObj = new FirstOfFour(firstOfFour);

		// Save the First of four
		firstOfFourObj.save(function() {
			// Request First of fours
			request(app).get('/first-of-fours')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single First of four if not signed in', function(done) {
		// Create new First of four model instance
		var firstOfFourObj = new FirstOfFour(firstOfFour);

		// Save the First of four
		firstOfFourObj.save(function() {
			request(app).get('/first-of-fours/' + firstOfFourObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', firstOfFour.name);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete First of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new First of four
				agent.post('/first-of-fours')
					.send(firstOfFour)
					.expect(200)
					.end(function(firstOfFourSaveErr, firstOfFourSaveRes) {
						// Handle First of four save error
						if (firstOfFourSaveErr) done(firstOfFourSaveErr);

						// Delete existing First of four
						agent.delete('/first-of-fours/' + firstOfFourSaveRes.body._id)
							.send(firstOfFour)
							.expect(200)
							.end(function(firstOfFourDeleteErr, firstOfFourDeleteRes) {
								// Handle First of four error error
								if (firstOfFourDeleteErr) done(firstOfFourDeleteErr);

								// Set assertions
								(firstOfFourDeleteRes.body._id).should.equal(firstOfFourSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete First of four instance if not signed in', function(done) {
		// Set First of four user 
		firstOfFour.user = user;

		// Create new First of four model instance
		var firstOfFourObj = new FirstOfFour(firstOfFour);

		// Save the First of four
		firstOfFourObj.save(function() {
			// Try deleting First of four
			request(app).delete('/first-of-fours/' + firstOfFourObj._id)
			.expect(401)
			.end(function(firstOfFourDeleteErr, firstOfFourDeleteRes) {
				// Set message assertion
				(firstOfFourDeleteRes.body.message).should.match('User is not logged in');

				// Handle First of four error error
				done(firstOfFourDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			FirstOfFour.remove().exec(function(){
				done();
			});	
		});
	});
});
