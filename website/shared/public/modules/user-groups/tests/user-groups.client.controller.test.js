'use strict';

(function() {
	// User groups Controller Spec
	describe('User groups Controller Tests', function() {
		// Initialize global variables
		var UserGroupsController,
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

			// Initialize the User groups controller.
			UserGroupsController = $controller('UserGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one User group object fetched from XHR', inject(function(UserGroups) {
			// Create sample User group using the User groups service
			var sampleUserGroup = new UserGroups({
				
				name: 'New User group',
				
			});

			// Create a sample User groups array that includes the new User group
			var sampleUserGroups = [sampleUserGroup];

			// Set GET response
			$httpBackend.expectGET('user-groups').respond(sampleUserGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userGroups).toEqualData(sampleUserGroups);
		}));

		it('$scope.findOne() should create an array with one User group object fetched from XHR using a userGroupId URL parameter', inject(function(UserGroups) {
			// Define a sample User group object
			var sampleUserGroup = new UserGroups({
				
				name: 'New User group',
				
			});

			// Set the URL parameter
			$stateParams.userGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/user-groups\/([0-9a-fA-F]{24})$/).respond(sampleUserGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userGroup).toEqualData(sampleUserGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UserGroups) {
			// Create a sample User group object
			var sampleUserGroupPostData = new UserGroups({
				
				name: 'New User group',
				
			});

			// Create a sample User group response
			var sampleUserGroupResponse = new UserGroups({
				_id: '525cf20451979dea2c000001',
				
				name: 'New User group',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New User group';
			

			// Set POST response
			$httpBackend.expectPOST('user-groups', sampleUserGroupPostData).respond(sampleUserGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			


			// Test URL redirection after the User group was created
			expect($location.path()).toBe('/user-groups/' + sampleUserGroupResponse._id);
		}));

		it('$scope.update() should update a valid User group', inject(function(UserGroups) {
			// Define a sample User group put data
			var sampleUserGroupPutData = new UserGroups({
				_id: '525cf20451979dea2c000001',
				
				name: 'New User group',
				
			});

			// Mock User group in scope
			scope.userGroup = sampleUserGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/user-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/user-groups/' + sampleUserGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid userGroupId and remove the User group from the scope', inject(function(UserGroups) {
			// Create new User group object
			var sampleUserGroup = new UserGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new User groups array and include the User group
			scope.userGroups = [sampleUserGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/user-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUserGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.userGroups.length).toBe(0);
		}));
	});
}());