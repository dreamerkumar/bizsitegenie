'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Foreignkeyref = mongoose.model('Builder-Foreignkeyref'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, foreignkeyref;

/**
 * Foreignkeyref routes tests
 */
describe('Foreignkeyref CRUD tests', function() {
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

		// Save a user to the test db and create new Foreignkeyref
		user.save(function() {
			foreignkeyref = {
				
				propertyNamesForSearch: 'Foreignkeyref Name',
				
				name: 'Foreignkeyref Name',
				
				parentId: 'Foreignkeyref Name',
				
				positionIndex: 'Foreignkeyref Name',
				
				referencedFeatureId: 'Foreignkeyref Name',
				
				referencedFeatureName: 'Foreignkeyref Name',
				
				propertyNamesForDisplay: 'Foreignkeyref Name',
				
				referenceDescription: 'Foreignkeyref Name',
				
				referenceDisplayFormat: 'Foreignkeyref Name',
				
				selectorControlType: 'Foreignkeyref Name',
				
				selectorControlAttribute: 'Foreignkeyref Name',
				
			};

			done();
		});
	});

	it('should be able to save Foreignkeyref instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Foreignkeyref
				agent.post('/foreignkeyref')
					.send(foreignkeyref)
					.expect(200)
					.end(function(foreignkeyrefSaveErr, foreignkeyrefSaveRes) {
						// Handle Foreignkeyref save error
						if (foreignkeyrefSaveErr) done(foreignkeyrefSaveErr);

						// Get a list of Foreignkeyrefs
						agent.get('/foreignkeyref')
							.end(function(foreignkeyrefGetErr, foreignkeyrefGetRes) {
								// Handle Foreignkeyref save error
								if (foreignkeyrefGetErr) done(foreignkeyrefGetErr);

								// Get Foreignkeyrefs list
								var foreignkeyref = foreignkeyrefGetRes.body;

								// Set assertions
								(foreignkeyref[0].user._id).should.equal(userId);

								
								(foreignkeyref[0].propertyNamesForSearch).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].name).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].parentId).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].positionIndex).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].referencedFeatureId).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].referencedFeatureName).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].propertyNamesForDisplay).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].referenceDescription).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].referenceDisplayFormat).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].selectorControlType).should.match('Foreignkeyref Name');
								
								(foreignkeyref[0].selectorControlAttribute).should.match('Foreignkeyref Name');
								

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Foreignkeyref instance if not logged in', function(done) {
		agent.post('/foreignkeyref')
			.send(foreignkeyref)
			.expect(401)
			.end(function(foreignkeyrefSaveErr, foreignkeyrefSaveRes) {
				// Call the assertion callback
				done(foreignkeyrefSaveErr);
			});
	});

	
	it('should not be able to save Foreignkeyref instance if no property name is provided', function(done) {
		// Invalidate property value field
		
		foreignkeyref.propertyNamesForSearch = '';
		
		foreignkeyref.name = '';
		
		foreignkeyref.parentId = '';
		
		foreignkeyref.positionIndex = '';
		
		foreignkeyref.referencedFeatureId = '';
		
		foreignkeyref.referencedFeatureName = '';
		
		foreignkeyref.propertyNamesForDisplay = '';
		
		foreignkeyref.referenceDescription = '';
		
		foreignkeyref.referenceDisplayFormat = '';
		
		foreignkeyref.selectorControlType = '';
		
		foreignkeyref.selectorControlAttribute = '';
		

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Foreignkeyref
				agent.post('/foreignkeyref')
					.send(foreignkeyref)
					.expect(400)
					.end(function(foreignkeyrefSaveErr, foreignkeyrefSaveRes) {
						// Set message assertion
						(foreignkeyrefSaveRes.body.message).should.match('Please fill \'property names for search\'');
						
						// Handle Foreignkeyref save error
						done(foreignkeyrefSaveErr);
					});
			});
	});
	

	it('should be able to update Foreignkeyref instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Foreignkeyref
				agent.post('/foreignkeyref')
					.send(foreignkeyref)
					.expect(200)
					.end(function(foreignkeyrefSaveErr, foreignkeyrefSaveRes) {
						// Handle Foreignkeyref save error
						if (foreignkeyrefSaveErr) done(foreignkeyrefSaveErr);

						// Update Foreignkeyref property name
						
						foreignkeyref.propertyNamesForSearch = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.name = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.parentId = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.positionIndex = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.referencedFeatureId = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.referencedFeatureName = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.propertyNamesForDisplay = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.referenceDescription = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.referenceDisplayFormat = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.selectorControlType = 'WHY YOU GOTTA BE SO MEAN?';
						
						foreignkeyref.selectorControlAttribute = 'WHY YOU GOTTA BE SO MEAN?';
						

						// Update existing Foreignkeyref
						agent.put('/foreignkeyref/' + foreignkeyrefSaveRes.body._id)
							.send(foreignkeyref)
							.expect(200)
							.end(function(foreignkeyrefUpdateErr, foreignkeyrefUpdateRes) {
								// Handle Foreignkeyref update error
								if (foreignkeyrefUpdateErr) done(foreignkeyrefUpdateErr);

								// Set assertions
								(foreignkeyrefUpdateRes.body._id).should.equal(foreignkeyrefSaveRes.body._id);
								
								(foreignkeyrefUpdateRes.body.propertyNamesForSearch).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.parentId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.positionIndex).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.referencedFeatureId).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.referencedFeatureName).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.propertyNamesForDisplay).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.referenceDescription).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.referenceDisplayFormat).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.selectorControlType).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								(foreignkeyrefUpdateRes.body.selectorControlAttribute).should.match('WHY YOU GOTTA BE SO MEAN?');
								
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Foreignkeyrefs if not signed in', function(done) {
		// Create new Foreignkeyref model instance
		var foreignkeyrefObj = new Foreignkeyref(foreignkeyref);

		// Save the Foreignkeyref
		foreignkeyrefObj.save(function() {
			// Request Foreignkeyrefs
			request(app).get('/foreignkeyref')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Foreignkeyref if not signed in', function(done) {
		// Create new Foreignkeyref model instance
		var foreignkeyrefObj = new Foreignkeyref(foreignkeyref);

		// Save the Foreignkeyref
		foreignkeyrefObj.save(function() {
			request(app).get('/foreignkeyref/' + foreignkeyrefObj._id)
				.end(function(req, res) {
					// Set assertion
					
					res.body.should.be.an.Object.with.property('propertyNamesForSearch', foreignkeyref.propertyNamesForSearch);
					
					res.body.should.be.an.Object.with.property('name', foreignkeyref.name);
					
					res.body.should.be.an.Object.with.property('parentId', foreignkeyref.parentId);
					
					res.body.should.be.an.Object.with.property('positionIndex', foreignkeyref.positionIndex);
					
					res.body.should.be.an.Object.with.property('referencedFeatureId', foreignkeyref.referencedFeatureId);
					
					res.body.should.be.an.Object.with.property('referencedFeatureName', foreignkeyref.referencedFeatureName);
					
					res.body.should.be.an.Object.with.property('propertyNamesForDisplay', foreignkeyref.propertyNamesForDisplay);
					
					res.body.should.be.an.Object.with.property('referenceDescription', foreignkeyref.referenceDescription);
					
					res.body.should.be.an.Object.with.property('referenceDisplayFormat', foreignkeyref.referenceDisplayFormat);
					
					res.body.should.be.an.Object.with.property('selectorControlType', foreignkeyref.selectorControlType);
					
					res.body.should.be.an.Object.with.property('selectorControlAttribute', foreignkeyref.selectorControlAttribute);
					
					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Foreignkeyref instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Foreignkeyref
				agent.post('/foreignkeyref')
					.send(foreignkeyref)
					.expect(200)
					.end(function(foreignkeyrefSaveErr, foreignkeyrefSaveRes) {
						// Handle Foreignkeyref save error
						if (foreignkeyrefSaveErr) done(foreignkeyrefSaveErr);

						// Delete existing Foreignkeyref
						agent.delete('/foreignkeyref/' + foreignkeyrefSaveRes.body._id)
							.send(foreignkeyref)
							.expect(200)
							.end(function(foreignkeyrefDeleteErr, foreignkeyrefDeleteRes) {
								// Handle Foreignkeyref error error
								if (foreignkeyrefDeleteErr) done(foreignkeyrefDeleteErr);

								// Set assertions
								(foreignkeyrefDeleteRes.body._id).should.equal(foreignkeyrefSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Foreignkeyref instance if not signed in', function(done) {
		// Set Foreignkeyref user 
		foreignkeyref.user = user;

		// Create new Foreignkeyref model instance
		var foreignkeyrefObj = new Foreignkeyref(foreignkeyref);

		// Save the Foreignkeyref
		foreignkeyrefObj.save(function() {
			// Try deleting Foreignkeyref
			request(app).delete('/foreignkeyref/' + foreignkeyrefObj._id)
			.expect(401)
			.end(function(foreignkeyrefDeleteErr, foreignkeyrefDeleteRes) {
				// Set message assertion
				(foreignkeyrefDeleteRes.body.message).should.match('User is not logged in');

				// Handle Foreignkeyref error error
				done(foreignkeyrefDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Foreignkeyref.remove().exec(function(){
				done();
			});	
		});
	});
});
