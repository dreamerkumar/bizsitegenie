'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string'),
	fs = require('fs'),
	ejs = require('ejs'),
	mkdirp = require('mkdirp'),
	jsonDataFromInputFile = require('../app/jsonDataFromInputFile'),
	_slugifiedNames = [],
	_reservedModuleNames = ['app', 'apps', 'feature', 'features', 'property', 'break','case','class','catch','const','continue','debugger','default','delete','do','else','export','extends',
		'finally','for','function','if','import','in','instanceof','new','return','super','switch','this','throw','try','typeof','var','void','while',
		'with','yield','enum','implements','package','protected','static','let','interface','private','public','await','abstract','boolean','byte','char',
		'double','final','float','goto','int','long','native','short','synchronized','throws','transient','volatile','user','users','option','options','role',
		'roles','userGroup','userGroups','userGroupRole', 'userGroupRoles', 'userGroupUser', 'userGroupUsers', 'visualizations'];

if (!String.prototype.format) {
	String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

/*
* Base function: This should be extended by the actual generator defined in a index.js file
*/
var CrudModulePlusCaller = yeoman.generators.NamedBase.extend({
	process: function(argsJson, name) {

		if(!argsJson || argsJson === ''){
			throw new Error('Error condition at CrudModulePlusCaller::process: argsJson not provided');
		}
		if(!name || name === ''){
			throw new Error('Error condition at CrudModulePlusCaller::process: name not provided');
		}

		//set the options for all the names recursively first 
		//this will avoid any overwrites with the same name as we are checking for uniqueness of the names during setting
		//the uniqueness is checked using the array _slugifiedNames where we keep storing each new unique name
		this._setModuleOptionsRecursively(argsJson, name);

		//call the generator recursively to generate the files for the module and all sub modules
		this._callCrudModulePlusGeneratorRecursively(argsJson, name);
	},

	_callCrudModulePlusGeneratorRecursively: function(origArgs, name, isChildCrud, parentOptions){
		
		this._callCrudModulePlusGenerator(origArgs, name, isChildCrud, parentOptions);

		if(origArgs.childModules && origArgs.childModules.length > 0){
			origArgs.childModules.forEach(function(module){
				this._callCrudModulePlusGeneratorRecursively(module, module.name, true, origArgs.options);
			}.bind(this));
		}
	},	

	_callCrudModulePlusGenerator: function(origArgs, name, isChildCrud, parentOptions){		
		this.composeWith('builder:crud-module-plus', {
			options: origArgs.options,
			args : [this.name]
		});
	},

	_setModuleOptionsRecursively: function(origArgs, name, isChildCrud, parentOptions){
		
		if(!name || name === ''){
			throw new Error('Error condition at CrudModulePlusCaller::_setModuleOptionsRecursively: name not provided');
		}
		
		var opt = {
			origArgs: origArgs,
			name: name,
			isChildCrud: isChildCrud,
			parent: parentOptions
		};
		this._setHumanizedNamesForModule(opt);
	
		this._setSlugifiedAndSlugifiedPluralNames(opt);

		opt.slugifiedSingularName = opt.slugifiedName;//inflections.singularize(opt.slugifiedName); avoiding plurals and singular names as it can cause conflict between modules
		opt.camelizedPluralName = _str.camelize(opt.slugifiedPluralName);
		opt.camelizedSingularName = _str.camelize(opt.slugifiedSingularName);

		opt.classifiedPluralName = _str.classify(opt.slugifiedPluralName);
		opt.classifiedSingularName = _str.classify(opt.slugifiedSingularName);

		//now do the same thing for all child modules
		if(opt.origArgs.childModules && opt.origArgs.childModules.length > 0){
			opt.origArgs.childModules.forEach(function(module){
				this._setModuleOptionsRecursively(module, module.name, true, opt);
			}.bind(this));
		}

		origArgs.options = opt;
	},

	//sets the humanized names for the module 
	//called separately, as the other derived names might need to be modified to avoid duplicates
	_setHumanizedNamesForModule: function(opt)
	{
		var slugifiedName = _str.slugify(opt.name);

		var slugifiedPluralName = inflections.pluralize(slugifiedName);
		var slugifiedSingularName = inflections.singularize(slugifiedName);

		opt.humanizedPluralName = _str.humanize(slugifiedPluralName);
		opt.humanizedSingularName = _str.humanize(slugifiedSingularName);
	},

	//sets the first two slugfied names
	//ensures unique names if createNew flag is set
	_setSlugifiedAndSlugifiedPluralNames: function(opt){
		var path = '';
		var origName = _str.slugify(opt.name);

		origName = this._avoidProblemModuleNames(origName);

		
		function setPath(obj, generator){
			obj.slugifiedPluralName = obj.slugifiedName; //inflections.pluralize(obj.slugifiedName); avoiding plurals and singular names as it can cause conflict between modules
			path = generator.destinationPath('public/modules/' + obj.slugifiedPluralName);  
		}

		opt.slugifiedName = origName;
		setPath(opt, this);
		 
		var conditionPassed = false;
		var ctr = 0;
		while(!conditionPassed){
			ctr++;
			if ((opt.origArgs.createNew && fs.existsSync(path)) || this._slugifiedNameAlreadyExists(opt.slugifiedName)) {
				throw new Error('Duplicate Feature Name Encountered:' + opt.slugifiedName);//it will be tricky to support this with foreign references
 				opt.slugifiedName = origName + ctr;
				setPath(opt, this);
			} else {
				_slugifiedNames.push(opt.slugifiedName);
				conditionPassed = true;
			}
		};
	},

	_slugifiedNameAlreadyExists: function(val){
		var flag = false;
		_slugifiedNames.forEach(function(name){
			if(name === val) {
				flag = true;
				return true;
			}
		});
		return flag;
	},

	_avoidProblemModuleNames: function(name) {
		
		if(this._startsWithNumber(name)){
			throw new Error('Error condition at CrudModulePlusCaller::_avoidProblemModuleNames: feature name should not start with a number');
		}


		var matched = false;
		_reservedModuleNames.forEach(function(entry){
			if(entry.toLowerCase() === name.toLowerCase()){
				matched = true;
				return true;
			}
		});

		if(matched){
			throw new Error('Error condition at CrudModulePlusCaller::_avoidProblemModuleNames: feature name matches with a reserved name');
		}

		if(!/^[a-zA-Z0-9]+$/.test(name)){
			reject('Error condition at CrudModulePlusCaller::_avoidProblemModuleNames: featuer name should only contain alphabets and numbers');
		};

		return name;
	},

	_startsWithNumber: function(val){
		return /^[0-9].*$/.test(val);
	}
});

module.exports = CrudModulePlusCaller;