'use strict';

angular.module('items').directive('controlLabel', function(){

	return {
		template: '<label ng-show="!item.editingLabel" class="control-label {{item.labelStatusClass()}}"' + 
			'		ng-click="item.changeToEditLabelMode()">{{item.getDisplayLabel()}}</label>' + 
			'	<input ng-show="item.editingLabel" type="text" class="form-control' + 
			'	enter-control-label" enter-key="item.saveItemLabel()"' + 
			'		focus="item.editingLabel" placeholder="Give this a name and press enter" ng-model="item.label">'
	};
});