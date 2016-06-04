'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feature = mongoose.model('Feature'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, feature;

/**
 * Feature routes tests
 */
describe('Feature CRUD tests', function() {
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

		// Save a user to the test db and create new Feature
		user.save(function() {
			feature = {
				
				name: 'Feature Name',
				
				parentCrudId: 'Feature Name',
				
				positionIndex: 'Feature Name',
				
			};

			done();
		});
	});

	it('should be able to save Feature instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feature
				agent.post('/features')
					.send(feature)
					.expect(200)
					.end(function(featureSaveErr, featureSaveRes) {
						// Handle Feature save error
						if (featureSaveErr) done(featureSaveErr);

						// Get a list of Features
						agent.get('/features')
							.end(function(featuresGetErr, featuresGetRes) {
								// Handle Feature save error
								if (featuresGetErr) done(featuresGetErr);

								// Get Features list
								var features = featuresGetRes.body;

								// Set assertions
								(features[0].user._id).should.equal(userId);

								
								(features[0].name).should.match('Feature Name');
								
								(features[0].parentCrudId).should.match('Feature Name');
								
								(features[0].positionIndex).should.match('Feature Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Feature instance if not logged in', function(done) {
		agent.post('/features')
			.send(feature)
			.expect(401)
			.end(function(featureSaveErr, featureSaveRes) {
				// Call the assertion callback
				done(featureSaveErr);
			});
	});

	it('should not be able to save Feature instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		feature.name = '';
		
		feature.parentCrudId = '';
		
		feature.positionIndex = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feature
				agent.post('/features')
					.send(feature)
					.expect(400)
					.end(function(featureSaveErr, featureSaveRes) {
						// Set message assertion
						(featureSaveRes.body.message).should.match('Please fill \'name\'');
						
						// Handle Feature save error
						done(featureSaveErr);
					});
			});
	});

	it('should be able to update Feature instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feature
				agent.post('/features')
					.send(feature)
					.expect(200)
					.end(function(featureSaveErr, featureSaveRes) {
						// Handle Feature save error
						if (featureSaveErr) done(featureSaveErr);

						// Update Feature property name
						
						feature.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						feature.parentCrudId = 'WHY YOU GOTTA BE SO MEAN?';
						
						feature.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Feature
						agent.put('/features/' + featureSaveRes.body._id)
							.send(feature)
							.expect(200)
							.end(function(featureUpdateErr, featureUpdateRes) {
								// Handle Feature update error
								if (featureUpdateErr) done(featureUpdateErr);

								// Set assertions
								(featureUpdateRes.body._id).should.equal(featureSaveRes.body._id);
								
								(featureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featureUpdateRes.body.parentCrudId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(featureUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Features if not signed in', function(done) {
		// Create new Feature model instance
		var featureObj = new Feature(feature);

		// Save the Feature
		featureObj.save(function() {
			// Request Features
			request(app).get('/features')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Feature if not signed in', function(done) {
		// Create new Feature model instance
		var featureObj = new Feature(feature);

		// Save the Feature
		featureObj.save(function() {
			request(app).get('/features/' + featureObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('name', feature.name);
					
					res.body.should.be.an.Object.with.property('parentCrudId', feature.parentCrudId);
					
					res.body.should.be.an.Object.with.property('positionIndex', feature.positionIndex);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Feature instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feature
				agent.post('/features')
					.send(feature)
					.expect(200)
					.end(function(featureSaveErr, featureSaveRes) {
						// Handle Feature save error
						if (featureSaveErr) done(featureSaveErr);

						// Delete existing Feature
						agent.delete('/features/' + featureSaveRes.body._id)
							.send(feature)
							.expect(200)
							.end(function(featureDeleteErr, featureDeleteRes) {
								// Handle Feature error error
								if (featureDeleteErr) done(featureDeleteErr);

								// Set assertions
								(featureDeleteRes.body._id).should.equal(featureSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Feature instance if not signed in', function(done) {
		// Set Feature user 
		feature.user = user;

		// Create new Feature model instance
		var featureObj = new Feature(feature);

		// Save the Feature
		featureObj.save(function() {
			// Try deleting Feature
			request(app).delete('/features/' + featureObj._id)
			.expect(401)
			.end(function(featureDeleteErr, featureDeleteRes) {
				// Set message assertion
				(featureDeleteRes.body.message).should.match('User is not logged in');

				// Handle Feature error error
				done(featureDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Feature.remove().exec(function(){
				done();
			});	
		});
	});
});
