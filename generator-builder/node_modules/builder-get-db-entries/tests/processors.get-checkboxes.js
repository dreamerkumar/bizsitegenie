'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Entity = mongoose.model('Checkbox'),
	getProcessor = require('../app/processors/get-checkboxes.js'),
	path = require('path');

/**
 * Globals
 */
var parentId = 'parentId';

/**
 * Unit tests
 */
describe('processors.get-checkboxes tests', function(){

	beforeEach(function(done){
		var user = new User({firstName: 'Full',lastName: 'Name',displayName: 'Full Name',email: 'test@test.com',username: 'username',password: 'password'});

		user.save(function(err) {
			var item = new Entity({
				name: 'test name',
				value: 'test value',
				positionIndex: '1',
				parentId: parentId,
				user: user
			});

			item.save(function(saveErr) {
				should.not.exist(saveErr);
				done();
			});			
		});		
	 });

	describe('list', function() {
		it('should return the entries from the database for a given parentId', function(done) {
			getProcessor.list(parentId, function(err, val){
				should.not.exist(err);
				should.exist(val);
				should.equal(val.length, 1);
				val[0].parentId.toString().should.be.equal(parentId.toString());
				done();
			});
		});
	});

	afterEach(function(done){
		Entity.remove().exec(function(){
			User.remove().exec(function(){
				done();	
			});
		});	
	});
});