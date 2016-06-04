'use strict';

(function() {
	// Roles Controller Spec
	describe('Roles Controller Tests', function() {
		// Initialize global variables
		var RolesController,
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

			// Initialize the Roles controller.
			RolesController = $controller('RolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Role object fetched from XHR', inject(function(Roles) {
			// Create sample Role using the Roles service
			var sampleRole = new Roles({
				
				name: 'New Role',
				
			});

			// Create a sample Roles array that includes the new Role
			var sampleRoles = [sampleRole];

			// Set GET response
			$httpBackend.expectGET('roles').respond(sampleRoles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.roles).toEqualData(sampleRoles);
		}));

		it('$scope.findOne() should create an array with one Role object fetched from XHR using a roleId URL parameter', inject(function(Roles) {
			// Define a sample Role object
			var sampleRole = new Roles({
				
				name: 'New Role',
				
			});

			// Set the URL parameter
			$stateParams.roleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/roles\/([0-9a-fA-F]{24})$/).respond(sampleRole);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.role).toEqualData(sampleRole);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Roles) {
			// Create a sample Role object
			var sampleRolePostData = new Roles({
				
				name: 'New Role',
				
			});

			// Create a sample Role response
			var sampleRoleResponse = new Roles({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Role',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New Role';
			

			// Set POST response
			$httpBackend.expectPOST('roles', sampleRolePostData).respond(sampleRoleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			


			// Test URL redirection after the Role was created
			expect($location.path()).toBe('/roles/' + sampleRoleResponse._id);
		}));

		it('$scope.update() should update a valid Role', inject(function(Roles) {
			// Define a sample Role put data
			var sampleRolePutData = new Roles({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Role',
				
			});

			// Mock Role in scope
			scope.role = sampleRolePutData;

			// Set PUT response
			$httpBackend.expectPUT(/roles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/roles/' + sampleRolePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid roleId and remove the Role from the scope', inject(function(Roles) {
			// Create new Role object
			var sampleRole = new Roles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Roles array and include the Role
			scope.roles = [sampleRole];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/roles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRole);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.roles.length).toBe(0);
		}));
	});
}());