'use strict';

// Abcds controller
angular.module('abcd').controller('AbcdController', ['$scope', '$stateParams', '$location', 'Authentication', 'Authorization', 'Abcd',
	function($scope, $stateParams, $location, Authentication, Authorization, Abcd) {
		$scope.authentication = Authentication;
		
		$scope.parentRouteUrl = '';

		
		var accessTypes = ['read', 'create', 'edit', 'delete'];
		accessTypes.forEach(function(accessType){
			Authorization.checkAccess('57509fe4aa937cd61da7591e', accessType)
			.then(function(result){
				$scope[accessType + 'AccessType'] = result;
				if(accessType === 'create'){
					$scope.createAuthorized = result === 'hasAccess';
					$scope.createUnauthorized = !$scope.createAuthorized;
				} else if(accessType === 'read'){
					if(result === 'hasAccess' || result === 'hasAccessIfUserCreatedIt') {
						$scope.listViewAuthorized = true;
						$scope.listViewUnauthorized = false;
					} else {
						$scope.listViewAuthorized = false;
						$scope.listViewUnauthorized = true;
					}
				}
			})
			.catch(function(err){
				$scope[accessType + 'AccessType'] = null;
				if(accessType === 'create'){
					$scope.createAuthorized = false;
					$scope.createUnauthorized = !$scope.createAuthorized;
				} else if(accessType === 'read'){
					$scope.listViewAuthorized = false;
					$scope.listViewUnauthorized = true;
				}
			});
		});


		$scope.onSuccessfulUploadInCreateMode = function(propertyName, fileName, fileKey) {
			$scope[propertyName] = fileName;
			$scope[propertyName + "_fileKey"] = fileKey;
		};

		$scope.onSuccessfulUploadInEditMode = function(propertyName, fileName, fileKey) {
			$scope.abcd[propertyName] = fileName;
			$scope.abcd[propertyName + "_fileKey"] = fileKey;
		};

		// Create new Abcd
		$scope.create = function() {
			// Create new Abcd object
			var abcd = new Abcd ({
					
				
					a: this.a,	
				
					b: this.b,	
				
					c: this.c,	
				
					d: this.d,	
				
			});

			// Redirect after save
			abcd.$save(function(response) {
				$location.path($scope.parentRouteUrl + '/abcd/' + response._id);

				// Clear form fields
				
				$scope.a = '';
				
				$scope.b = '';
				
				$scope.c = '';
				
				$scope.d = '';
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Abcd
		$scope.remove = function(abcd) {
			if ( abcd ) { 
				abcd.$remove();

				for (var i in $scope.abcd) {
					if ($scope.abcd [i] === abcd) {
						$scope.abcd.splice(i, 1);
					}
				}
			} else {
				$scope.abcd.$remove(function() {
					$location.path($scope.parentRouteUrl + '/abcd');
				});
			}
		};

		// Update existing Abcd
		$scope.update = function() {
			var abcd = $scope.abcd;

			abcd.$update(function() {
				$location.path($scope.parentRouteUrl + '/abcd/' + abcd._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Abcds
		$scope.find = function() {
			$scope.abcd = Abcd.query();
		};

		// Find existing Abcd for view
		$scope.findOneForRead = function() {
			Authorization.checkAccess('57509fe4aa937cd61da7591e', 'read')
				.then(function(result){
					$scope.readAccessType = result;
					if($scope.readAccessType !== 'hasAccess' && $scope.readAccessType !== 'hasAccessIfUserCreatedIt'){
						$scope.setUnauthorized();
						return;
					}

					Abcd.get({ 
						abcdId: $stateParams.abcdId
					}).$promise.then(function(result){
						$scope.abcd = result;
						if(!result){
							return;
						}
						$scope.setAuthorized();
					}).catch(function(err){
						if(err.status && err.status === 403){
							$scope.setUnauthorized();
						}
						console.error('Error occurred on getting abcd', err)
					});
				})
				.catch(function(err){
					$scope.setUnauthorized();					
				});
		};

		// Find existing Abcd to edit
		$scope.findOneForEdit = function() {
			Authorization.checkAccess('57509fe4aa937cd61da7591e', 'edit')
				.then(function(result){
					$scope.editAccessType = result;
					if($scope.editAccessType !== 'hasAccess' && $scope.editAccessType !== 'hasAccessIfUserCreatedIt'){
						$scope.setUnauthorized();
						return;
					}

					Abcd.get({ 
						abcdId: $stateParams.abcdId
					}).$promise.then(function(result){
						$scope.abcd = result;
						if(!result){
							return;
						}
						if($scope.editAccessType === 'hasAccess' || ($scope.editAccessType === 'hasAccessIfUserCreatedIt' && Authentication.user._id === result.user._id)) {
							$scope.setAuthorized();
						} else {
							$scope.setUnauthorized();
						}

					}).catch(function(err){
						if(err.status && err.status === 403){
							$scope.setUnauthorized();
						}
						console.error('Error occurred on getting abcd', err)
					});
				})
				.catch(function(err){
					$scope.setUnauthorized();					
				});
		};

		$scope.setAuthorized = function(){
			$scope.authorized = true;
			$scope.unauthorized = false;
		};

		$scope.setUnauthorized = function(){
			$scope.authorized = false;
			$scope.unauthorized = true;
		};

		$scope.handleToGrid = {};
		$scope.gridColumns = [{
				field: 'a',
				displayName: 'A'
			},{
				field: 'b',
				displayName: 'B'
			},{
				field: 'c',
				displayName: 'C'
			},{
				field: 'd',
				displayName: 'D'
			}
		];
	}
]);