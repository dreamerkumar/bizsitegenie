'use strict';

angular.module('items').controller('ItemPermissions', function($scope, $stateParams, $timeout, $location, Authentication, Items, Itemroles) {
		$scope.authentication = Authentication;
		
		$scope.readRoleList = {items: ''};
		$scope.editRoleList = {items: ''};
		$scope.deleteRoleList = {items: ''};
		$scope.createRoleList = {items: ''};
		$scope.manageaccessRoleList = {items: ''};
		$scope.accessSelections = {read: '', edit: '', create: '', 'delete': '', manageaccess: ''};
		
		$scope.previousSelections = {};

		$scope.addReadRole = function(roleName){
			$scope.addRole(roleName, 'read');
		};
		$scope.removeReadRole = function(roleName){
			$scope.removeRole(roleName, 'read');
		};

		$scope.addEditRole = function(roleName){
			$scope.addRole(roleName, 'edit');
		};
		$scope.removeEditRole = function(roleName){
			$scope.removeRole(roleName, 'edit');
		};

		$scope.addDeleteRole = function(roleName){
			$scope.addRole(roleName, 'delete');
		};
		$scope.removeDeleteRole = function(roleName){
			$scope.removeRole(roleName, 'delete');
		};

		$scope.addCreateRole = function(roleName){
			$scope.addRole(roleName, 'create');
		};
		$scope.removeCreateRole = function(roleName){
			$scope.removeRole(roleName, 'create');
		};

		$scope.addManageAccessRole = function(roleName){
			$scope.addRole(roleName, 'manageaccess');
		};
		$scope.removeManageAccessRole = function(roleName){
			$scope.removeRole(roleName, 'manageaccess');
		};

		$scope.addRole = function(roleName, accessType){
			$scope.error = null;
			if(!roleName){
				$scope.error = 'Cannot save role. Role name missing';
				return;
			}
			if(!accessType){
				$scope.error = 'Cannot save role. Access type missing';
				return;
			}

			// Create new Itemrole object
			var itemroles = new Itemroles ({
					parentId: $stateParams.itemId,					
					accesstype: accessType,
					role: roleName
			});

			itemroles.$save(function(response) {
				console.log(roleName + ' added successfully');				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.removeRole = function(roleName, accessType){
			$scope.error = null;
			if(!roleName){
				$scope.error = 'Cannot save role. Role name missing';
				return;
			}
			if(!accessType){
				$scope.error = 'Cannot save role. Access type missing';
				return;
			}

			var params = {
				parentId: $stateParams.itemId,
				accesstype: accessType,
				role: roleName
			};

			Itemroles.deleteItemRole(params).$promise.then(function(result){
				console.log(roleName + ' removed successfully');
			}).catch(function(err){
				$scope.error = err;
			});			
		};

		$scope.saveSelection = function(accessType){
			$scope.error = null;
			if(!accessType){
				$scope.error = 'Cannot save. accessType missing';
				return;
			}
			var selection = $scope.accessSelections[accessType];
			$scope.addRole(selection, accessType);
			if($scope.previousSelections[accessType] && $scope.previousSelections[accessType] !== selection){
				$scope.removeRole($scope.previousSelections[accessType], accessType);
				$scope.previousSelections[accessType] = selection;
			}
		};

		$scope.getAuthorizationType = function(roleList, accessType){
			var authorizationTypes = [
				'everyone',
				'allloggedinusers',
				'onlycreator',
				'creatorandroles',
				'roles'
			];
			
			if(roleList && roleList.length){
				for(var ctr = 0; ctr < authorizationTypes.length; ctr++){
					var authorizationType = authorizationTypes[ctr];
					if(roleList.indexOf(authorizationType) >= 0){
						return authorizationType;
					}
				}
			}

			return $scope.getDefaultAuthorizationType(accessType);
		};

		$scope.getDefaultAuthorizationType = function(accessType){
			switch(accessType){
				case 'read': 
					return 'everyone';
				case 'create': 
					return 'allloggedinusers';
				case 'edit': 
					return 'creatorandroles';
				case 'delete': 
					return 'creatorandroles';
				case 'manageaccess':
					return 'creatorandroles';
			}
		};

		$scope.getCurrentRoleSelection = function(accessType){
			$scope.error = null;
			if(!accessType){
				$scope.error = 'Cannot get the current role selection. accessType missing';
				return;
			}
			var params = {
				parentId: $stateParams.itemId,
				accesstype: accessType
			};
			Itemroles.getByAccessType(params).$promise.then(function(result){
				$scope[accessType + 'RoleList'].items = result;
				
				var selectionType = $scope.getAuthorizationType(result, accessType);
 
				$scope.accessSelections[accessType] = selectionType;
				$scope.previousSelections[accessType] = selectionType;
			}).catch(function(err){
				$scope.error = err;
			});
		};

		$scope.getCurrentRoleSelection('read');
		$scope.getCurrentRoleSelection('create');
		$scope.getCurrentRoleSelection('edit');
		$scope.getCurrentRoleSelection('delete');
		$scope.getCurrentRoleSelection('manageaccess');

	}
);