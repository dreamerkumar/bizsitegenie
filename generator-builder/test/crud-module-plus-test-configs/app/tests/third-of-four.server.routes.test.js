'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ThirdOfFour = mongoose.model('ThirdOfFour'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, thirdOfFour;

/**
 * Third of four routes tests
 */
describe('Third of four CRUD tests', function() {
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

		// Save a user to the test db and create new Third of four
		user.save(function() {
			thirdOfFour = {
				
				name: 'Third of four Name',
				
			};

			done();
		});
	});

	it('should be able to save Third of four instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Third of four
				agent.post('/third-of-fours')
					.send(thirdOfFour)
					.expect(200)
					.end(function(thirdOfFourSaveErr, thirdOfFourSaveRes) {
						// Handle Third of four save error
						if (thirdOfFourSaveErr) done(thirdOfFourSaveErr);

						// Get a list of Third of fours
						agent.get('/third-of-fours')
							.end(function(thirdOfFoursGetErr, thirdOfFoursGetRes) {
								// Handle Third of four save error
								if (thirdOfFoursGetErr) done(thirdOfFoursGetErr);

								// Get Third of fours list
								var thirdOfFours = thirdOfFoursGetRes.body;

								// Set assertions
								(thirdOfFours[0].user._id).should.equal(userId);

								
								(thirdOfFours[0].name).should.match('Third of four Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Third of four instance if not logged in', function(done) {
		agent.post('/third-of-fours')
			.send(thirdOfFour)
			.expect(401)
			.end(function(thirdOfFourSaveErr, thirdOfFourSaveRes) {
				// Call the assertion callback
				done(thirdOfFourSaveErr);
			});
	});

	it('should not be able to save Third of four instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		thirdOfFour.name = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Third of four
				agent.post('/third-of-fours')
					.send(thirdOfFour)
					.expect(400)
					.end(function(thirdOfFourSaveErr, thirdOfFourSaveRes) {
						// Set message assertion
						(thirdOfFourSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Third of four save error
						done(thirdOfFourSaveErr);
					});
			});
	});

	it('should be able to update Third of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Third of four
				agent.post('/third-of-fours')
					.send(thirdOfFour)
					.expect(200)
					.end(function(thirdOfFourSaveErr, thirdOfFourSaveRes) {
						// Handle Third of four save error
						if (thirdOfFourSaveErr) done(thirdOfFourSaveErr);

						// Update Third of four property name
						
						thirdOfFour.name = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Third of four
						agent.put('/third-of-fours/' + thirdOfFourSaveRes.body._id)
							.send(thirdOfFour)
							.expect(200)
							.end(function(thirdOfFourUpdateErr, thirdOfFourUpdateRes) {
								// Handle Third of four update error
								if (thirdOfFourUpdateErr) done(thirdOfFourUpdateErr);

								// Set assertions
								(thirdOfFourUpdateRes.body._id).should.equal(thirdOfFourSaveRes.body._id);
								
								(thirdOfFourUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Third of fours if not signed in', function(done) {
		// Create new Third of four model instance
		var thirdOfFourObj = new ThirdOfFour(thirdOfFour);

		// Save the Third of four
		thirdOfFourObj.save(function() {
			// Request Third of fours
			request(app).get('/third-of-fours')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Third of four if not signed in', function(done) {
		// Create new Third of four model instance
		var thirdOfFourObj = new ThirdOfFour(thirdOfFour);

		// Save the Third of four
		thirdOfFourObj.save(function() {
			request(app).get('/third-of-fours/' + thirdOfFourObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', thirdOfFour.name);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Third of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Third of four
				agent.post('/third-of-fours')
					.send(thirdOfFour)
					.expect(200)
					.end(function(thirdOfFourSaveErr, thirdOfFourSaveRes) {
						// Handle Third of four save error
						if (thirdOfFourSaveErr) done(thirdOfFourSaveErr);

						// Delete existing Third of four
						agent.delete('/third-of-fours/' + thirdOfFourSaveRes.body._id)
							.send(thirdOfFour)
							.expect(200)
							.end(function(thirdOfFourDeleteErr, thirdOfFourDeleteRes) {
								// Handle Third of four error error
								if (thirdOfFourDeleteErr) done(thirdOfFourDeleteErr);

								// Set assertions
								(thirdOfFourDeleteRes.body._id).should.equal(thirdOfFourSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Third of four instance if not signed in', function(done) {
		// Set Third of four user 
		thirdOfFour.user = user;

		// Create new Third of four model instance
		var thirdOfFourObj = new ThirdOfFour(thirdOfFour);

		// Save the Third of four
		thirdOfFourObj.save(function() {
			// Try deleting Third of four
			request(app).delete('/third-of-fours/' + thirdOfFourObj._id)
			.expect(401)
			.end(function(thirdOfFourDeleteErr, thirdOfFourDeleteRes) {
				// Set message assertion
				(thirdOfFourDeleteRes.body.message).should.match('User is not logged in');

				// Handle Third of four error error
				done(thirdOfFourDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			ThirdOfFour.remove().exec(function(){
				done();
			});	
		});
	});
});
