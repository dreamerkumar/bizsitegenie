'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FourthOfFour = mongoose.model('FourthOfFour'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, fourthOfFour;

/**
 * Fourth of four routes tests
 */
describe('Fourth of four CRUD tests', function() {
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

		// Save a user to the test db and create new Fourth of four
		user.save(function() {
			fourthOfFour = {
				
				name: 'Fourth of four Name',
				
			};

			done();
		});
	});

	it('should be able to save Fourth of four instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fourth of four
				agent.post('/fourth-of-fours')
					.send(fourthOfFour)
					.expect(200)
					.end(function(fourthOfFourSaveErr, fourthOfFourSaveRes) {
						// Handle Fourth of four save error
						if (fourthOfFourSaveErr) done(fourthOfFourSaveErr);

						// Get a list of Fourth of fours
						agent.get('/fourth-of-fours')
							.end(function(fourthOfFoursGetErr, fourthOfFoursGetRes) {
								// Handle Fourth of four save error
								if (fourthOfFoursGetErr) done(fourthOfFoursGetErr);

								// Get Fourth of fours list
								var fourthOfFours = fourthOfFoursGetRes.body;

								// Set assertions
								(fourthOfFours[0].user._id).should.equal(userId);

								
								(fourthOfFours[0].name).should.match('Fourth of four Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Fourth of four instance if not logged in', function(done) {
		agent.post('/fourth-of-fours')
			.send(fourthOfFour)
			.expect(401)
			.end(function(fourthOfFourSaveErr, fourthOfFourSaveRes) {
				// Call the assertion callback
				done(fourthOfFourSaveErr);
			});
	});

	it('should not be able to save Fourth of four instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		fourthOfFour.name = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fourth of four
				agent.post('/fourth-of-fours')
					.send(fourthOfFour)
					.expect(400)
					.end(function(fourthOfFourSaveErr, fourthOfFourSaveRes) {
						// Set message assertion
						(fourthOfFourSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Fourth of four save error
						done(fourthOfFourSaveErr);
					});
			});
	});

	it('should be able to update Fourth of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fourth of four
				agent.post('/fourth-of-fours')
					.send(fourthOfFour)
					.expect(200)
					.end(function(fourthOfFourSaveErr, fourthOfFourSaveRes) {
						// Handle Fourth of four save error
						if (fourthOfFourSaveErr) done(fourthOfFourSaveErr);

						// Update Fourth of four property name
						
						fourthOfFour.name = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Fourth of four
						agent.put('/fourth-of-fours/' + fourthOfFourSaveRes.body._id)
							.send(fourthOfFour)
							.expect(200)
							.end(function(fourthOfFourUpdateErr, fourthOfFourUpdateRes) {
								// Handle Fourth of four update error
								if (fourthOfFourUpdateErr) done(fourthOfFourUpdateErr);

								// Set assertions
								(fourthOfFourUpdateRes.body._id).should.equal(fourthOfFourSaveRes.body._id);
								
								(fourthOfFourUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Fourth of fours if not signed in', function(done) {
		// Create new Fourth of four model instance
		var fourthOfFourObj = new FourthOfFour(fourthOfFour);

		// Save the Fourth of four
		fourthOfFourObj.save(function() {
			// Request Fourth of fours
			request(app).get('/fourth-of-fours')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Fourth of four if not signed in', function(done) {
		// Create new Fourth of four model instance
		var fourthOfFourObj = new FourthOfFour(fourthOfFour);

		// Save the Fourth of four
		fourthOfFourObj.save(function() {
			request(app).get('/fourth-of-fours/' + fourthOfFourObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', fourthOfFour.name);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Fourth of four instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fourth of four
				agent.post('/fourth-of-fours')
					.send(fourthOfFour)
					.expect(200)
					.end(function(fourthOfFourSaveErr, fourthOfFourSaveRes) {
						// Handle Fourth of four save error
						if (fourthOfFourSaveErr) done(fourthOfFourSaveErr);

						// Delete existing Fourth of four
						agent.delete('/fourth-of-fours/' + fourthOfFourSaveRes.body._id)
							.send(fourthOfFour)
							.expect(200)
							.end(function(fourthOfFourDeleteErr, fourthOfFourDeleteRes) {
								// Handle Fourth of four error error
								if (fourthOfFourDeleteErr) done(fourthOfFourDeleteErr);

								// Set assertions
								(fourthOfFourDeleteRes.body._id).should.equal(fourthOfFourSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Fourth of four instance if not signed in', function(done) {
		// Set Fourth of four user 
		fourthOfFour.user = user;

		// Create new Fourth of four model instance
		var fourthOfFourObj = new FourthOfFour(fourthOfFour);

		// Save the Fourth of four
		fourthOfFourObj.save(function() {
			// Try deleting Fourth of four
			request(app).delete('/fourth-of-fours/' + fourthOfFourObj._id)
			.expect(401)
			.end(function(fourthOfFourDeleteErr, fourthOfFourDeleteRes) {
				// Set message assertion
				(fourthOfFourDeleteRes.body.message).should.match('User is not logged in');

				// Handle Fourth of four error error
				done(fourthOfFourDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			FourthOfFour.remove().exec(function(){
				done();
			});	
		});
	});
});
