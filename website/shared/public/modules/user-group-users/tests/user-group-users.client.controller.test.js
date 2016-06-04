'use strict';

(function() {
	// User group users Controller Spec
	describe('User group users Controller Tests', function() {
		// Initialize global variables
		var UserGroupUsersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the User group users controller.
			UserGroupUsersController = $controller('UserGroupUsersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one User group user object fetched from XHR', inject(function(UserGroupUsers) {
			// Create sample User group user using the User group users service
			var sampleUserGroupUser = new UserGroupUsers({
				
				userId: 'New User group user',
				
			});

			// Create a sample User group users array that includes the new User group user
			var sampleUserGroupUsers = [sampleUserGroupUser];

			// Set GET response
			$httpBackend.expectGET('user-group-users').respond(sampleUserGroupUsers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userGroupUsers).toEqualData(sampleUserGroupUsers);
		}));

		it('$scope.findOne() should create an array with one User group user object fetched from XHR using a userGroupUserId URL parameter', inject(function(UserGroupUsers) {
			// Define a sample User group user object
			var sampleUserGroupUser = new UserGroupUsers({
				
				userId: 'New User group user',
				
			});

			// Set the URL parameter
			$stateParams.userGroupUserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/user-group-users\/([0-9a-fA-F]{24})$/).respond(sampleUserGroupUser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userGroupUser).toEqualData(sampleUserGroupUser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UserGroupUsers) {
			// Create a sample User group user object
			var sampleUserGroupUserPostData = new UserGroupUsers({
				
				userId: 'New User group user',
				
			});

			// Create a sample User group user response
			var sampleUserGroupUserResponse = new UserGroupUsers({
				_id: '525cf20451979dea2c000001',
				
				userId: 'New User group user',
				
			});

			// Fixture mock form input values
			
			scope.userId = 'New User group user';
			

			// Set POST response
			$httpBackend.expectPOST('user-group-users', sampleUserGroupUserPostData).respond(sampleUserGroupUserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.userId).toEqual('');
			


			// Test URL redirection after the User group user was created
			expect($location.path()).toBe('/user-group-users/' + sampleUserGroupUserResponse._id);
		}));

		it('$scope.update() should update a valid User group user', inject(function(UserGroupUsers) {
			// Define a sample User group user put data
			var sampleUserGroupUserPutData = new UserGroupUsers({
				_id: '525cf20451979dea2c000001',
				
				userId: 'New User group user',
				
			});

			// Mock User group user in scope
			scope.userGroupUser = sampleUserGroupUserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/user-group-users\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/user-group-users/' + sampleUserGroupUserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid userGroupUserId and remove the User group user from the scope', inject(function(UserGroupUsers) {
			// Create new User group user object
			var sampleUserGroupUser = new UserGroupUsers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new User group users array and include the User group user
			scope.userGroupUsers = [sampleUserGroupUser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/user-group-users\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUserGroupUser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.userGroupUsers.length).toBe(0);
		}));
	});
}());