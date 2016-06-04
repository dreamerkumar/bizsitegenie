'use strict';

(function() {
	// Dashboards Controller Spec
	describe('Dashboards Controller Tests', function() {
		// Initialize global variables
		var DashboardController,
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

			// Initialize the Dashboards controller.
			DashboardController = $controller('DashboardController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dashboard object fetched from XHR', inject(function(Dashboard) {
			// Create sample Dashboard using the Dashboards service
			var sampleDashboard = new Dashboard({
				
				name: 'New Dashboard',
				
				content: 'New Dashboard',
				
			});

			// Create a sample Dashboards array that includes the new Dashboard
			var sampleDashboard = [sampleDashboard];

			// Set GET response
			$httpBackend.expectGET('dashboard').respond(sampleDashboard);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dashboard).toEqualData(sampleDashboard);
		}));

		it('$scope.findOne() should create an array with one Dashboard object fetched from XHR using a dashboardId URL parameter', inject(function(Dashboard) {
			// Define a sample Dashboard object
			var sampleDashboard = new Dashboard({
				
				name: 'New Dashboard',
				
				content: 'New Dashboard',
				
			});

			// Set the URL parameter
			$stateParams.dashboardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dashboard\/([0-9a-fA-F]{24})$/).respond(sampleDashboard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dashboard).toEqualData(sampleDashboard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dashboard) {
			// Create a sample Dashboard object
			var sampleDashboardPostData = new Dashboard({
				
				name: 'New Dashboard',
				
				content: 'New Dashboard',
				
			});

			// Create a sample Dashboard response
			var sampleDashboardResponse = new Dashboard({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Dashboard',
				
				content: 'New Dashboard',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New Dashboard';
			
			scope.content = 'New Dashboard';
			

			// Set POST response
			$httpBackend.expectPOST('dashboard', sampleDashboardPostData).respond(sampleDashboardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			
			expect(scope.content).toEqual('');
			


			// Test URL redirection after the Dashboard was created
			expect($location.path()).toBe('/dashboard/' + sampleDashboardResponse._id);
		}));

		it('$scope.update() should update a valid Dashboard', inject(function(Dashboard) {
			// Define a sample Dashboard put data
			var sampleDashboardPutData = new Dashboard({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Dashboard',
				
				content: 'New Dashboard',
				
			});

			// Mock Dashboard in scope
			scope.dashboard = sampleDashboardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/dashboard\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dashboard/' + sampleDashboardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dashboardId and remove the Dashboard from the scope', inject(function(Dashboard) {
			// Create new Dashboard object
			var sampleDashboard = new Dashboard({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dashboards array and include the Dashboard
			scope.dashboard = [sampleDashboard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dashboard\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDashboard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dashboard.length).toBe(0);
		}));
	});
}());