'use strict';

(function() {
	// User group roles Controller Spec
	describe('User group roles Controller Tests', function() {
		// Initialize global variables
		var UserGroupRolesController,
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

			// Initialize the User group roles controller.
			UserGroupRolesController = $controller('UserGroupRolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one User group role object fetched from XHR', inject(function(UserGroupRoles) {
			// Create sample User group role using the User group roles service
			var sampleUserGroupRole = new UserGroupRoles({
				
				roleId: 'New User group role',
				
			});

			// Create a sample User group roles array that includes the new User group role
			var sampleUserGroupRoles = [sampleUserGroupRole];

			// Set GET response
			$httpBackend.expectGET('user-group-roles').respond(sampleUserGroupRoles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userGroupRoles).toEqualData(sampleUserGroupRoles);
		}));

		it('$scope.findOne() should create an array with one User group role object fetched from XHR using a userGroupRoleId URL parameter', inject(function(UserGroupRoles) {
			// Define a sample User group role object
			var sampleUserGroupRole = new UserGroupRoles({
				
				roleId: 'New User group role',
				
			});

			// Set the URL parameter
			$stateParams.userGroupRoleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/user-group-roles\/([0-9a-fA-F]{24})$/).respond(sampleUserGroupRole);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userGroupRole).toEqualData(sampleUserGroupRole);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UserGroupRoles) {
			// Create a sample User group role object
			var sampleUserGroupRolePostData = new UserGroupRoles({
				
				roleId: 'New User group role',
				
			});

			// Create a sample User group role response
			var sampleUserGroupRoleResponse = new UserGroupRoles({
				_id: '525cf20451979dea2c000001',
				
				roleId: 'New User group role',
				
			});

			// Fixture mock form input values
			
			scope.roleId = 'New User group role';
			

			// Set POST response
			$httpBackend.expectPOST('user-group-roles', sampleUserGroupRolePostData).respond(sampleUserGroupRoleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.roleId).toEqual('');
			


			// Test URL redirection after the User group role was created
			expect($location.path()).toBe('/user-group-roles/' + sampleUserGroupRoleResponse._id);
		}));

		it('$scope.update() should update a valid User group role', inject(function(UserGroupRoles) {
			// Define a sample User group role put data
			var sampleUserGroupRolePutData = new UserGroupRoles({
				_id: '525cf20451979dea2c000001',
				
				roleId: 'New User group role',
				
			});

			// Mock User group role in scope
			scope.userGroupRole = sampleUserGroupRolePutData;

			// Set PUT response
			$httpBackend.expectPUT(/user-group-roles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/user-group-roles/' + sampleUserGroupRolePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid userGroupRoleId and remove the User group role from the scope', inject(function(UserGroupRoles) {
			// Create new User group role object
			var sampleUserGroupRole = new UserGroupRoles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new User group roles array and include the User group role
			scope.userGroupRoles = [sampleUserGroupRole];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/user-group-roles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUserGroupRole);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.userGroupRoles.length).toBe(0);
		}));
	});
}());