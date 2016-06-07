'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Entity = mongoose.model('Feature'),
	getProcessor = require('../app/processors/get-features.js'),
	path = require('path'),
	parentCrudId = 'test parent crud id';

/**
 * Globals
 */
var parentId = 'parentId';

/**
 * Unit tests
 */
describe('processors.get-features tests', function(){

	beforeEach(function(done){
		var user = new User({firstName: 'Full',lastName: 'Name',displayName: 'Full Name',email: 'test@test.com',username: 'username',password: 'password'});

		user.save(function(err) {
			var item = new Entity({
				parentCrudId: parentCrudId,
				name: 'first feature',
				positionIndex: '1',
				parentId: parentId,
				user: user
			});

			item.save(function(saveErr) {
				should.not.exist(saveErr);

				var item1 = new Entity({
					parentCrudId: parentCrudId,
					name: 'second feature',
					positionIndex: '2',
					parentId: parentId,
					user: user
				});

				item1.save(function(saveErr1) {
					should.not.exist(saveErr1);
					done();
				});	
			});			
		});		
	 });

	describe('list', function() {
		it('should return the entries from the database for a given parentId', function(done) {
			getProcessor.list(parentId, parentCrudId, function(err, val){
				should.not.exist(err);
				should.exist(val);
				should.equal(val.length, 2);
				val[0].parentId.toString().should.be.equal(parentId.toString());
				done();
			});
		});
	});

	describe('list', function() {
		it('should be sorted on the positionIndex', function(done) {
			getProcessor.list(parentId, parentCrudId, function(err, val){
				should.not.exist(err);
				should.exist(val);
				should.equal(val.length, 2);
				val[0].positionIndex.toString().should.be.equal('1');
				val[1].positionIndex.toString().should.be.equal('2');
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