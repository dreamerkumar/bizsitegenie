'use strict';
var jsonDataFromInputFile = require('../app/jsonDataFromInputFile'),
	crudModulePlusCaller = require('./crudModulePlusCaller');

var CrudFromJsonFileGenerator = crudModulePlusCaller.extend({
	init: function() {

		//get the original configuration from the json file
		var origArgs = jsonDataFromInputFile.getCrudModulePlusInput(this);

		this.process(origArgs, this.name);
	},

});

module.exports = CrudFromJsonFileGenerator;