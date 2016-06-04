'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string'),
	fs = require('fs'),
	ejs = require('ejs'),
	mkdirp = require('mkdirp'),
	_ = require('underscore'),
	nameProcessor = require('../../common/name-processor');

JSON.minify = JSON.minify || require("node-json-minify");

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

//This sub generator cannot be used directly. It can only be called from the crud-from-json-file sub generator
var ModuleGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		if(!this.options || !this.options.origArgs){
			throw Error('This sub generator cannot be used directly. It can only be called from the crud-from-json-file sub generator.');
		}
		_.extend(this, this.options);
		
		this.menuId = 'topbar';

		this._setParentRoute();

		//set the various names for each property
		this._setPropertyValues();
	},

	_setParentRoute: function(){
		function setParentRouteRecursive(obj, paths) {
			if(obj.parent){
				paths.routePath = "/{0}/:{1}Id{2}".format(obj.parent.slugifiedPluralName, obj.parent.camelizedSingularName, paths.routePath);
				paths.routeUrl = "'/{0}/' + $stateParams.{1}Id + {2}".format(obj.parent.slugifiedPluralName, obj.parent.camelizedSingularName, paths.routeUrl);
				return setParentRouteRecursive(obj.parent, paths);
			}
			return paths;
		}
		var parentPaths = setParentRouteRecursive(this, {routePath: "", routeUrl: "''"});
		this.parentRoutePath = parentPaths.routePath;
		this.parentRouteUrl = parentPaths.routeUrl;		
	},

	//sets the various values that would be used for rendering for each property
	_setPropertyValues: function(){
		
		this.properties = this.properties || [];

		for(var ctr = 0; ctr < this.origArgs.properties.length; ctr++){
		
			var prop = this.origArgs.properties[ctr];

			prop.moduleName = this.camelizedSingularName; //used in the view templates

			this._setPropertyNames(prop);

			this._setCreateEditMarkupValues(prop);

			this._setFormFieldType(prop);

			this.properties.push(prop);
		}
	},

	//set the form field type based on the tagName and type fields provided in the input
	_setFormFieldType: function(prop){
		switch(prop.tagName){
			case "input":
				switch(prop.attributes.type){
					case "password":
						prop.formFieldType = "password";
						break;					
					case "email":
						prop.formFieldType = "email";
						break;
					case "radio":
						prop.formFieldType = "radio";
						break;
					case "checkbox":
						prop.formFieldType = "checkbox";
						break;
					case "text":
						prop.formFieldType = "textbox";
						break;
					default:
						throw Error('Unsupported type for a form field with input tag for ' + prop.propertyLabel);
				}
				break;
			case "textarea":
				prop.formFieldType = "textarea";
				break;
			case 'number':
				prop.formFieldType = 'number';
				break;
			case 'integer':
				prop.formFieldType = 'integer';
				break;
			case 'datetime':
				prop.formFieldType = 'datetime';
				break;
			case 'image':
				prop.formFieldType = 'image';
				break;
			case "file":
				prop.formFieldType = "file";
				break;
			case "select":
				prop.formFieldType = "select";
				break;
			case 'foreignkeyref':
				prop.formFieldType = 'foreignkeyref';
				break;
			case 'lookupfromprop':
				prop.formFieldType = 'lookupfromprop';
				break;
			default:
				throw Error('Unsuppported form field tag for ' + prop.propertyLabel + '. The tagName supplied was ' + prop.formFieldType);
		}
	},

	//sets the properties being used to define the created edit markup for the property
	_setCreateEditMarkupValues: function(prop){
		prop.tagName = prop.tagName || 'input';
		prop.attributes = prop.attributes || {};
		prop.attributes.type = prop.attributes.type || 'text';
	},

	//sets the various names for each property
	_setPropertyNames: function(prop){

			var slugifiedName = _str.slugify(prop.propertyLabel); //test-property-name
			var slugifiedPluralName = inflections.pluralize(slugifiedName); //test-property-names
			var slugifiedSingularName = inflections.singularize(slugifiedName); //test-property-name

			prop.humanizedPluralName = slugifiedPluralName; //Test property names
			prop.humanizedSingularName = _str.humanize(slugifiedSingularName); //Test property name
			prop.humanizedSingularAllLowerCaseName = this._makeFirstLetterLowerCase(prop.humanizedSingularName); //test property name	


			var propertyName = nameProcessor.getSimpleName(prop.propertyLabel);

			prop.slugifiedSingularName = propertyName;//inflections.singularize(prop.slugifiedName); //test-property-name
			prop.camelizedPluralName = propertyName;//_str.camelize(prop.slugifiedPluralName); //testNames
			prop.camelizedSingularName = propertyName;//_str.camelize(prop.slugifiedSingularName); //testName
			if(prop.camelizedSingularName === 'parentid'){
				throw Error('The property label \'{0}\' is not supported.'.format(prop.propertyLabel));
			}
			prop.classifiedPluralName = propertyName;//_str.classify(prop.slugifiedPluralName); //TestNames
			prop.classifiedSingularName = propertyName;//_str.classify(prop.slugifiedSingularName); //TestName
		
	},

	_makeFirstLetterLowerCase: function(val){
		if(val){
			var array = val.split();
			if(array && array.length){
				array[0] = array[0].toLowerCase();
				return array.join();
			}
		}
		return val;
	},

	renderModule: function() {		

		function mkdirpError(err) {
			if(err)throw Error(err);
		}

		// Create module folder
		mkdirp('public/modules/' + this.slugifiedPluralName, mkdirpError);

		// Create module supplemental folders
		mkdirp('public/modules/' + this.slugifiedPluralName + '/css', mkdirpError);
		mkdirp('public/modules/' + this.slugifiedPluralName + '/img', mkdirpError);
		mkdirp('public/modules/' + this.slugifiedPluralName + '/directives', mkdirpError);
		mkdirp('public/modules/' + this.slugifiedPluralName + '/filters', mkdirpError);

		// Render express module files
		this.template('express-module/_.server.controller.js', 'app/controllers/' + this.slugifiedPluralName + '.server.controller.js');
		this.template('express-module/_.server.model.js', 'app/models/' + this.slugifiedSingularName + '.server.model.js');
		this.template('express-module/_.server.routes.js', 'app/routes/' + this.slugifiedPluralName + '.server.routes.js');
		this.template('express-module/_.server.model.test.js', 'app/tests/' + this.slugifiedSingularName + '.server.model.test.js');
		this.template('express-module/_.server.routes.test.js', 'app/tests/' + this.slugifiedSingularName + '.server.routes.test.js');

		// Render angular module files
		this.template('angular-module/config/_.client.routes.js', 'public/modules/' + this.slugifiedPluralName + '/config/' + this.slugifiedPluralName + '.client.routes.js');
		this.template('angular-module/controllers/_.client.controller.js', 'public/modules/' + this.slugifiedPluralName + '/controllers/' + this.slugifiedPluralName + '.client.controller.js');
		this.template('angular-module/services/_.client.service.js', 'public/modules/' + this.slugifiedPluralName + '/services/' + this.slugifiedPluralName + '.client.service.js');
		this.template('angular-module/tests/_.client.controller.test.js', 'public/modules/' + this.slugifiedPluralName + '/tests/' + this.slugifiedPluralName + '.client.controller.test.js');

		// Render menu configuration
		if(!this.isChildCrud){
			this.template('angular-module/config/_.client.config.js', 'public/modules/' + this.slugifiedPluralName + '/config/' + this.slugifiedPluralName + '.client.config.js');
		}
		
		this._addView('create');
		this._addView('edit');
		this._addView('list');
		this._addView('view');

		// Render angular module definition
		this.template('angular-module/_.client.module.js', 'public/modules/' + this.slugifiedPluralName + '/' + this.slugifiedPluralName + '.client.module.js');
	},

	// Renders angular module views
	_addView: function(viewType){

		this.viewType = viewType;
		var templateSource = 'angular-module/views/_.{0}.client.view.html'.format(viewType);
			
		var templateDestination =
			'public/modules/{0}/views/{1}-{2}.client.view.html'.format(this.slugifiedPluralName, viewType,
					(viewType === 'list'? this.slugifiedPluralName: this.slugifiedSingularName));

		this.template(templateSource, templateDestination);
	}
});

module.exports = ModuleGenerator;