'use strict';
var crudModulePlusCaller = require('../crud-from-json-file/crudModulePlusCaller'),
	dbGetter = require('bizsitegenie-get-db-entries'),
	Q = require('q'),
	_str = require('underscore.string'),
	propertyTypes = [
		'properties',
		'features'],
		_appId,
	nameProcessor = require('../../common/name-processor');
/*
* _appId should be passed as the name argument
*/
var CrudFromDbGenerator = crudModulePlusCaller.extend({
	init: function() {
		var generatorIsDone = this.async();

		if(!this.name){
			throw Error('Please provide the database id of the app as the first argument');
			this._exitGenerator();
		}
		_appId = this.name;

		//get the list of features for the given app
		dbGetter.getFeatures(_appId, 0)

			.then(this._processFeatures.bind(this))
			.then(function(){
				this.log('Initial processing done for appId: ' + _appId + '. The app will now be generated.');
				generatorIsDone();//this code to end the generator is as per the documentation but doesn't actually work
				//this is probably because we use composeWith which fails to report the end once it's done
				//luckily the end function does get called at the right time after everything is done. 
				//I have put in the code in that function to exit the generator.
			}.bind(this))
			.catch(function (error) {
	    		this.log('Error condition at init: ' + error);
	    		this._exitGenerator();
			}.bind(this))
	},

	_processFeatures: function(features){
		var d = Q.defer();
		if(!features || !features.length){
			var msg = 'No feature could be obtained for the give app id ' + _appId;
			this.log('Error condition at _processFeatures: ' + msg);
			d.reject(msg);
		} 

		var ctr = 0;
		features.forEach(function(entry){
			this._processFeature(entry)
				.catch(function(err){
					this.log('Error condition at _processFeatures: ' + err);
					d.reject(err);
				}.bind(this))
				.done(function(){
					ctr++; 
					if(ctr === features.length){
						d.resolve(true);
					}
				});
		}.bind(this));
		
		return d.promise;
	},

	_processFeature: function(feature){
		var d = Q.defer();
		this.log('Processing for root level feature: ' + feature.name);
		this._retriveFeatureData(feature._id)
			.then(function(jsonData){
				this.log('Generating files for the jsonData ' + jsonData);
				this.process(jsonData, feature.name);
			}.bind(this))
			.then(d.resolve)
			.catch(function(exception){
				this.log('Error condition at _processFeature: ' + exception);
				d.reject(exception);
			}.bind(this));
		return d.promise;
	},

	_retriveFeatureData: function(featureId){
		var d = Q.defer();
		try {

			var callingArray = [];
			propertyTypes.forEach(function(propertyType){
				if(propertyType === 'features'){
					callingArray.push(dbGetter.getFeatures(_appId, featureId));
				} else {
					callingArray.push(dbGetter.getListForParentId(featureId, propertyType));
				}
			});
			this.log('Retrieving data for featureId: ' + featureId);
			Q.all(callingArray)
				.then(this._getPropertiesAndChildModules.bind(this))
				.then(this._populateChildModules.bind(this))
				.then(function(result){
					result.featureId = featureId;
					d.resolve(result);
				})
				.catch(	function (error) {
					this.log('Error condition at _retriveFeatureData: ' + error);
		    		d.reject(error);
				}.bind(this));

		} catch(exception){
			this.log('Error condition at _retriveFeatureData: ' + error);
			d.reject(exception);
		}

		return d.promise;
	},

	/*
	* @featureJson only has the name and id field.This function retrieves data based on the id of the child module
	* and replace the two placeholder valuew with the full json for each child module
	*/
	_populateChildModules: function(featureJson){
		var d = Q.defer(), //will not exit the function until d.resolve or reject is called
			modules = [];
		try {
			if(featureJson.childModules && featureJson.childModules.length > 0){
				featureJson.childModules.forEach(function(entry){
					if(!entry || !entry.id || !entry.name){
						var val = entry;
						try{ val =  JSON.stringify(entry); } catch(err) {}
						var msg = 'Error condition at _populateChildModules: Invalid values for module: ' + val + ' (required values are id and name)';
						this.log(msg);
						d.reject(msg);
					}
					this.log('Processing child module with id ' + entry.id);
					this._retriveFeatureData(entry.id)
						.then(function(childJson){
							this.log('Json data retrieved for child module: ' + childJson);
							childJson.name = entry.name;
							modules.push(childJson);
							
							if(modules.length === featureJson.childModules.length){
								featureJson.childModules = modules;
								d.resolve(featureJson);
							}
						}.bind(this))
						.catch(function(err){
							this.log('Error condition at _populateChildModules: ' + err);
							d.reject(err)
						}.bind(this));
				}.bind(this));
			} else {				
				d.resolve(featureJson);
			}
		}
		catch(exception){
			this.log('Error condition at _populateChildModules: ' + exception);
			d.reject(exception);
		}
		return d.promise;
	},

	_getPropertiesAndChildModules: function(values){
		var d = Q.defer();
		try{
			var props = [],			
				ctr = 0;
			
			//add the property type to each item and concat it to the main list
			propertyTypes.forEach(function(propertyType){
				var list = values[ctr];
				ctr++;
				list.forEach(function(item){
					item.propertyType = propertyType;
				});
				props = props.concat(list);
			}.bind(this));

			//sort the list on position index
			props.sort(function(a, b){
				return parseInt(a.positionIndex) > parseInt(b.positionIndex);
			});

			var properties = [], childModules = [];
			props.forEach(function(property){			
				if(property.propertyType === 'features')
				{
					//just add the id and name here
					//then recursively replace them with actual values from the database
					childModules.push({id: property._id, name: property.name});
				} else {
					//compute and add the property json
					var value = this._getPropertyJson(property);
					if(value) {
						properties.push(value);
					}
				}
			}.bind(this));

			d.resolve({properties: properties, childModules: childModules});
			
		} catch(exception){
			this.log('Error condition at _getPropertiesAndChildModules: ' + exception);
			d.reject(exception);
		}
		return d.promise;
	},

	_getPropertyJson: function(property){
		switch(property.type){
			case 'textbox': 
				return this._getPropertyJson_textboxes(property);
			case 'textarea': 
				return this._getPropertyJson_textareas(property);
			case 'select': 
				return this._getPropertyJson_selects(property);
			case 'radio': 
				return this._getPropertyJson_radios(property);
			case 'checkbox': 
				return this._getPropertyJson_checkboxes(property);
			case "number":
				return this._getPropertyJson_number(property);
			case "integer":
				return this._getPropertyJson_integer(property);
			case "datetime":
				return this._getPropertyJson_datetime(property);
			case "image":
				return this._getPropertyJson_image(property);
			case "file":
				return this._getPropertyJson_file(property);
			case 'foreignkeyref': 
				return this._getPropertyJson_foreignkeyrefs(property);
			case 'lookupfromprop': 
				return this._getPropertyJson_lookupfromprops(property);
			default:
				throw Error('Unknown property type ' + property.type);
		}
	},
	_getPropertyJson_number: function(property) {
		return {
			propertyLabel: property.name,
			required:  property.required,
			tagName: property.type
		};
	},
	_getPropertyJson_integer: function(property) {
		return {
			propertyLabel: property.name,
			required:  property.required,
			tagName: property.type
		};
	},
	_getPropertyJson_datetime: function(property) {
		return {
			propertyLabel: property.name,
			required:  property.required,
			tagName: property.type
		};
	},
	_getPropertyJson_image: function(property) {
		return {
			propertyLabel: property.name,
			required:  property.required,
			tagName: property.type
		};
	},
	_getPropertyJson_file: function(property) {
		return {
			propertyLabel: property.name,
			required:  property.required,
			tagName: property.type
		};
	},
	_getPropertyJson_checkboxes: function(property){
		return {
			propertyLabel: property.name,
			tagName: 'input',
			required: property.required,
			attributes: {
				type: 'checkbox',
				value: property.value
			}
		};
	},

	_getPropertyJson_emails: function(property){
		return {
			propertyLabel: property.name,
			tagName: 'input',
			required: property.required,
			attributes: {
				type: 'email'
			}
		};
	},

	_getPropertyJson_passwords: function(property){
		return {
			propertyLabel: property.name,
			tagName: 'input',
			required: property.required,
			attributes: {
				type: 'password'
			}
		};
	},

 	_getPropertyJson_radios: function(property){
		var tagOptions = [];
		var options = property.option && property.option.length > 0? property.option.split(',') : [];
		options.forEach(function(option){
			tagOptions.push({text: option, attributes: {value: option}});
		});
		if(!options.length) {
			console.error('Options missing for property ' + property.name + '. This property will be ignored.');
			return null;
		}

 		return {
 			propertyLabel: property.name,
 			tagName: 'input',
			required: property.required,
 			attributes: {
 				type: 'radio'
			},
			inputTagRadioTypeOptions: tagOptions,
 		};
 	},
 
 	_getPropertyJson_selects: function(property){
		var tagOptions = [];
		var options = property.option && property.option.length > 0? property.option.split(',') : [];
		if(!options.length) {
			console.error('Options missing for property ' + property.name + '. This property will be ignored.');
			return null;
		}
		options.forEach(function(option){
			tagOptions.push({text: option, attributes: {value: option}});
		});
		
 		return {
 			propertyLabel: property.name,
 			tagName: 'select',
			required: property.required,
			selectTagOptions: tagOptions
 		};
 	},

	_getPropertyJson_textareas: function(property){
		return {
			propertyLabel: property.name,
			tagName: 'textarea',
			required: property.required,
			attributes: {
				rows: property.row,
				cols: property.col
			}
		};
	},

	_getPropertyJson_textboxes: function(property){
		return {
			propertyLabel: property.name,
			required: property.required,
			tagName: 'input'
		};
	},

	_getPropertyJson_foreignkeyrefs: function(property){
		var val = {
			propertyLabel: property.name,
			tagName: 'foreignkeyref',
			required: property.required,
			attributes: {
				referencedFeatureName: this._getSlugifiedClassName(property.referencedFeatureName),
				selectorControlType: property.selectorControlType,
				selectorControlAttribute:property.selectorControlAttribute,
				referencedFeatureId: property.referencedFeatureId,
				propertyColumnNamesForDisplay: this._getPropertyColumnNames(property.propertyNamesForDisplay),
				propertyNamesForDisplay: property.propertyNamesForDisplay,
				propertyNamesForSearch: property.propertyNamesForDisplay,
				referenceDescription: property.referenceDescription,
				referenceDisplayFormat: property.referenceDisplayFormat
			}
		};
		if(!property.referencedFeatureName) {
			console.error('Required attribute referencedFeatureName missing for property ' + property.name + '. This property will be ignored.');
			return null;
		}
		if(!property.propertyNamesForDisplay) {
			console.error('Required attribute propertyNamesForDisplay missing for property ' + property.name + '. This property will be ignored.');
			return null;
		}
		return val;
	},

	_getPropertyJson_lookupfromprops: function(property){
		var val = {
			propertyLabel: property.name,
			tagName: 'lookupfromprop',
			required: property.required,
			attributes: {
				refId: property.refId,
				referencedFeatureName: this._getSlugifiedClassName(property.referencedFeatureName),
				referencedPropertyName: property.referencedPropertyName,
				referencedPropertyColumnName: nameProcessor.getSimpleName(property.referencedPropertyName),
				refDescription: property.refDescription,
				selectorControlType: property.selectorControlType,
				selectorControlAttribute: property.selectorControlAttribute
			}
		};
		if(!property.referencedFeatureName) {
			console.error('Required attribute referencedFeatureName missing for property ' + property.name + '. This property will be ignored.');
			return null;
		}
		if(!property.referencedPropertyName) {
			console.error('Required attribute referencedPropertyName missing for property ' + property.name + '. This property will be ignored.');
			return null;
		}
		return val;
	},

	_getSlugifiedClassName: function(name){
		var slugifiedName = _str.slugify(name);
		return _str.classify(slugifiedName);
	},

	_getPropertyColumnNames: function(propertyLabels){
        if(!propertyLabels || !propertyLabels.length){
            return propertyLabels;
        }

        return propertyLabels
            .split(',')
            .map(function(item){ return nameProcessor.getSimpleName(item);})
            .join(',');
    },

	_exitGenerator: function(){
		this.log('The generator is exiting now');
		process.exit(0);
	},

	/*
	* This function thankfully gets called after all the composeWith functions which appear to run async. We can use this function to exit
	* http://stackoverflow.com/questions/33010498/composewith-in-yeoman-generator-not-emitting-an-end-event-and-thus-not-driving
	*/
	end: function(){
		this._exitGenerator();
	}

});

module.exports = CrudFromDbGenerator;