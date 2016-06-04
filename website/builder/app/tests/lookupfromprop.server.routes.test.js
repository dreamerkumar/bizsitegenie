'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Lookupfromprop = mongoose.model('Builder-Lookupfromprop'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, lookupfromprop;

/**
 * Lookupfromprop routes tests
 */
describe('Lookupfromprop CRUD tests', function() {
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

		// Save a user to the test db and create new Lookupfromprop
		user.save(function() {
			lookupfromprop = {
				
				parentId: 'Lookupfromprop Name',
				
				name: 'Lookupfromprop Name',
				
				positionIndex: 'Lookupfromprop Name',
				
				refId: 'Lookupfromprop Name',
				
				referencedFeatureName: 'Lookupfromprop Name',
				
				referencedPropertyName: 'Lookupfromprop Name',
				
				refDescription: 'Lookupfromprop Name',
				
				selectorControlType: 'Lookupfromprop Name',
				
				selectorControlAttribute: 'Lookupfromprop Name',
				
			};

			done();
		});
	});

	it('should be able to save Lookupfromprop instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lookupfromprop
				agent.post('/lookupfromprop')
					.send(lookupfromprop)
					.expect(200)
					.end(function(lookupfrompropSaveErr, lookupfrompropSaveRes) {
						// Handle Lookupfromprop save error
						if (lookupfrompropSaveErr) done(lookupfrompropSaveErr);

						// Get a list of Lookupfromprops
						agent.get('/lookupfromprop')
							.end(function(lookupfrompropGetErr, lookupfrompropGetRes) {
								// Handle Lookupfromprop save error
								if (lookupfrompropGetErr) done(lookupfrompropGetErr);

								// Get Lookupfromprops list
								var lookupfromprop = lookupfrompropGetRes.body;

								// Set assertions
								(lookupfromprop[0].user._id).should.equal(userId);

								
								(lookupfromprop[0].parentId).should.match('Lookupfromprop Name');
								
								(lookupfromprop[0].name).should.match('Lookupfromprop Name');
								
								(lookupfromprop[0].positionIndex).should.match('Lookupfromprop Name');
								
								(lookupfromprop[0].refId).should.match('Lookupfromprop Name');
								
								(lookupfromprop[0].referencedFeatureName).should.match('Lookupfromprop Name');
								
								(lookupfromprop[0].referencedPropertyName).should.match('Lookupfromprop Name');
																
								(lookupfromprop[0].refDescription).should.match('Lookupfromprop Name');
								
								(lookupfromprop[0].selectorControlType).should.match('Lookupfromprop Name');
								
								(lookupfromprop[0].selectorControlAttribute).should.match('Lookupfromprop Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Lookupfromprop instance if not logged in', function(done) {
		agent.post('/lookupfromprop')
			.send(lookupfromprop)
			.expect(401)
			.end(function(lookupfrompropSaveErr, lookupfrompropSaveRes) {
				// Call the assertion callback
				done(lookupfrompropSaveErr);
			});
	});

	
	it('should not be able to save Lookupfromprop instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		lookupfromprop.parentId = '';
		
		lookupfromprop.name = '';
		
		lookupfromprop.positionIndex = '';
		
		lookupfromprop.refId = '';
		
		lookupfromprop.referencedFeatureName = '';
		
		lookupfromprop.referencedPropertyName = '';
				
		lookupfromprop.refDescription = '';
		
		lookupfromprop.selectorControlType = '';
		
		lookupfromprop.selectorControlAttribute = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lookupfromprop
				agent.post('/lookupfromprop')
					.send(lookupfromprop)
					.expect(400)
					.end(function(lookupfrompropSaveErr, lookupfrompropSaveRes) {
						// Set message assertion
						(lookupfrompropSaveRes.body.message).should.match('Please fill \'parent\'');
						
						// Handle Lookupfromprop save error
						done(lookupfrompropSaveErr);
					});
			});
	});
	

	it('should be able to update Lookupfromprop instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lookupfromprop
				agent.post('/lookupfromprop')
					.send(lookupfromprop)
					.expect(200)
					.end(function(lookupfrompropSaveErr, lookupfrompropSaveRes) {
						// Handle Lookupfromprop save error
						if (lookupfrompropSaveErr) done(lookupfrompropSaveErr);

						// Update Lookupfromprop property name
						
						lookupfromprop.parentId = 'WHY YOU GOTTA BE SO MEAN?';
						
						lookupfromprop.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						lookupfromprop.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						
						lookupfromprop.refId = 'WHY YOU GOTTA BE SO MEAN?';
						
						lookupfromprop.referencedFeatureName = 'WHY YOU GOTTA BE SO MEAN?';
						
						lookupfromprop.referencedPropertyName = 'WHY YOU GOTTA BE SO MEAN?';
												
						lookupfromprop.refDescription = 'WHY YOU GOTTA BE SO MEAN?';
						
						lookupfromprop.selectorControlType = 'WHY YOU GOTTA BE SO MEAN?';
						
						lookupfromprop.selectorControlAttribute = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Lookupfromprop
						agent.put('/lookupfromprop/' + lookupfrompropSaveRes.body._id)
							.send(lookupfromprop)
							.expect(200)
							.end(function(lookupfrompropUpdateErr, lookupfrompropUpdateRes) {
								// Handle Lookupfromprop update error
								if (lookupfrompropUpdateErr) done(lookupfrompropUpdateErr);

								// Set assertions
								(lookupfrompropUpdateRes.body._id).should.equal(lookupfrompropSaveRes.body._id);
								
								(lookupfrompropUpdateRes.body.parentId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(lookupfrompropUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(lookupfrompropUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(lookupfrompropUpdateRes.body.refId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(lookupfrompropUpdateRes.body.referencedFeatureName).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(lookupfrompropUpdateRes.body.referencedPropertyName).should.match('WHY YOU GOTTA BE SO MEAN?');
																
								(lookupfrompropUpdateRes.body.refDescription).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(lookupfrompropUpdateRes.body.selectorControlType).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(lookupfrompropUpdateRes.body.selectorControlAttribute).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Lookupfromprops if not signed in', function(done) {
		// Create new Lookupfromprop model instance
		var lookupfrompropObj = new Lookupfromprop(lookupfromprop);

		// Save the Lookupfromprop
		lookupfrompropObj.save(function() {
			// Request Lookupfromprops
			request(app).get('/lookupfromprop')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Lookupfromprop if not signed in', function(done) {
		// Create new Lookupfromprop model instance
		var lookupfrompropObj = new Lookupfromprop(lookupfromprop);

		// Save the Lookupfromprop
		lookupfrompropObj.save(function() {
			request(app).get('/lookupfromprop/' + lookupfrompropObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('parentId', lookupfromprop.parentId);
					
					res.body.should.be.an.Object.with.property('name', lookupfromprop.name);
					
					res.body.should.be.an.Object.with.property('positionIndex', lookupfromprop.positionIndex);
					
					res.body.should.be.an.Object.with.property('refId', lookupfromprop.refId);
					
					res.body.should.be.an.Object.with.property('referencedFeatureName', lookupfromprop.referencedFeatureName);
					
					res.body.should.be.an.Object.with.property('referencedPropertyName', lookupfromprop.referencedPropertyName);
					
					res.body.should.be.an.Object.with.property('refDescription', lookupfromprop.refDescription);
					
					res.body.should.be.an.Object.with.property('selectorControlType', lookupfromprop.selectorControlType);
					
					res.body.should.be.an.Object.with.property('selectorControlAttribute', lookupfromprop.selectorControlAttribute);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Lookupfromprop instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Lookupfromprop
				agent.post('/lookupfromprop')
					.send(lookupfromprop)
					.expect(200)
					.end(function(lookupfrompropSaveErr, lookupfrompropSaveRes) {
						// Handle Lookupfromprop save error
						if (lookupfrompropSaveErr) done(lookupfrompropSaveErr);

						// Delete existing Lookupfromprop
						agent.delete('/lookupfromprop/' + lookupfrompropSaveRes.body._id)
							.send(lookupfromprop)
							.expect(200)
							.end(function(lookupfrompropDeleteErr, lookupfrompropDeleteRes) {
								// Handle Lookupfromprop error error
								if (lookupfrompropDeleteErr) done(lookupfrompropDeleteErr);

								// Set assertions
								(lookupfrompropDeleteRes.body._id).should.equal(lookupfrompropSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Lookupfromprop instance if not signed in', function(done) {
		// Set Lookupfromprop user 
		lookupfromprop.user = user;

		// Create new Lookupfromprop model instance
		var lookupfrompropObj = new Lookupfromprop(lookupfromprop);

		// Save the Lookupfromprop
		lookupfrompropObj.save(function() {
			// Try deleting Lookupfromprop
			request(app).delete('/lookupfromprop/' + lookupfrompropObj._id)
			.expect(401)
			.end(function(lookupfrompropDeleteErr, lookupfrompropDeleteRes) {
				// Set message assertion
				(lookupfrompropDeleteRes.body.message).should.match('User is not logged in');

				// Handle Lookupfromprop error error
				done(lookupfrompropDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Lookupfromprop.remove().exec(function(){
				done();
			});	
		});
	});
});
