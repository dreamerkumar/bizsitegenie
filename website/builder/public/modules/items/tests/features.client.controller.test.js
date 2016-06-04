'use strict';

(function() {
	// Items Controller Spec
	describe('Items Controller Tests', function() {
		// Initialize global variables
		var ItemsController,
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

			// Initialize the Items controller.
			ItemsController = $controller('ItemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Item object fetched from XHR', inject(function(Items) {
			// Create sample Item using the Items service
			var sampleItem = new Items({
				
				name: 'New Item',
				
				parentCrudId: 'New Item',
				
				positionIndex: 'New Item',
				
			});

			// Create a sample Items array that includes the new Item
			var sampleItems = [sampleItem];

			// Set GET response
			$httpBackend.expectGET('items').respond(sampleItems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.items).toEqualData(sampleItems);
		}));

		it('$scope.findOne() should create an array with one Item object fetched from XHR using a itemId URL parameter', inject(function(Items) {
			// Define a sample Item object
			var sampleItem = new Items({
				
				name: 'New Item',
				
				parentCrudId: 'New Item',
				
				positionIndex: 'New Item',
				
			});

			// Set the URL parameter
			$stateParams.itemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/items\/([0-9a-fA-F]{24})$/).respond(sampleItem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.item).toEqualData(sampleItem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Items) {
			// Create a sample Item object
			var sampleItemPostData = new Items({
				
				name: 'New Item',
				
				parentCrudId: 'New Item',
				
				positionIndex: 'New Item',
				
			});

			// Create a sample Item response
			var sampleItemResponse = new Items({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Item',
				
				parentCrudId: 'New Item',
				
				positionIndex: 'New Item',
				
			});

			// Fixture mock form input values
			
			scope.name = 'New Item';
			
			scope.parentCrudId = 'New Item';
			
			scope.positionIndex = 'New Item';
			

			// Set POST response
			$httpBackend.expectPOST('items', sampleItemPostData).respond(sampleItemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			
			expect(scope.name).toEqual('');
			
			expect(scope.parentCrudId).toEqual('');
			
			expect(scope.positionIndex).toEqual('');
			


			// Test URL redirection after the Item was created
			expect($location.path()).toBe('/items/' + sampleItemResponse._id);
		}));

		it('$scope.update() should update a valid Item', inject(function(Items) {
			// Define a sample Item put data
			var sampleItemPutData = new Items({
				_id: '525cf20451979dea2c000001',
				
				name: 'New Item',
				
				parentCrudId: 'New Item',
				
				positionIndex: 'New Item',
				
			});

			// Mock Item in scope
			scope.item = sampleItemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/items\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/items/' + sampleItemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid itemId and remove the Item from the scope', inject(function(Items) {
			// Create new Item object
			var sampleItem = new Items({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Items array and include the Item
			scope.items = [sampleItem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/items\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleItem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.items.length).toBe(0);
		}));
	});
}());