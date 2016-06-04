'use strict';
var util = require('util'),
	path = require('path'),
	yeoman = require('yeoman-generator'),
	_str = require('underscore.string'),
	chalk = require('chalk'),
	fs = require('fs'),
	yosay = require('yosay'),
	mkdirp = require('mkdirp'),
	_ = require('underscore');


var MeanGeneratorBase = yeoman.generators.Base.extend({
	init: function() {

		function getJsonObj(jsonFilePath){
			var fs = require('fs');
			var fileData = fs.readFileSync(jsonFilePath, 'utf8');			
			return JSON.parse(fileData);
		}

		// read the local package file
		this.pkg = getJsonObj(path.join(__dirname, '../package.json'));

		// invoke npm install on finish
		this.on('end', function() {
			if (!this.options['skip-install']) {
				this.npmInstall();
			}
		});

		// Have Yeoman greet the user.
	    this.log(yosay(
	      chalk.magenta('You\'re using the MEAN.JS PLUS generator. It is a fork of the Official MEAN.JS generator with some added features.')
	    ));
	
		if(!this.args || !this.args.length){
			throw Error('Please pass the name as the first argument when calling the app-base sub generator');
		}

		if(!this.options){
			throw Error('This sub generator cannot be used directly. It can only be called from the main generator with the json data passed as options.');
		}

		this.setApplicationDetails(this.args[0], this.options);
	},

	setApplicationDetails: function(name, jsonInput) {

		this.appName = name;
		
		_.extend(this, jsonInput);

		this.appDescription = this.appDescription || this.appName;
		this.appKeywords = this.appKeywords || this.appName;
		this.appAuthor = this.appAuthor || this.appName + ' Author';

		this.slugifiedAppName = _str.slugify(this.appName);
		this.humanizedAppName = _str.humanize(this.appName);
		this.capitalizedAppAuthor = _str.capitalize(this.appAuthor);
	},

	setFlagsForAngularApplicationModules: function() {
		this.angularCookies = true;
		this.angularAnimate = true;
		this.angularTouch =  true;
		this.angularSanitize = true;
	},

	copyApplicationFolder: function() {
		
		function mkdirpError(err) {
			if(err)throw Error(err);
		}

		// Copy application folder
		mkdirp('app', mkdirpError);
		mkdirp('app/controllers', mkdirpError);
		mkdirp('app/models', mkdirpError);
		mkdirp('app/routes', mkdirpError);
		mkdirp('app/tests', mkdirpError);
		this.directory('app/views');

		// Copy base files
		this.copy('app/controllers/core.server.controller.js');
		this.copy('app/controllers/users.server.controller.js');
		this.copy('app/controllers/errors.server.controller.js');
		this.directory('app/controllers/users');
		this.copy('app/models/user.server.model.js');
		this.copy('app/routes/core.server.routes.js');
		this.copy('app/routes/users.server.routes.js');
		this.copy('app/tests/user.server.model.test.js');

		// Create public folders
		mkdirp('public', mkdirpError);
		mkdirp('public/modules', mkdirpError);

		// Copy public folder content
		this.copy('public/application.js');
		this.copy('public/humans.txt');
		this.copy('public/robots.txt');

		// Copy public folder modules
		this.directory('public/modules/users');

		// Copy core module files
		this.directory('public/modules/core/config');
		this.directory('public/modules/core/controllers');
		this.directory('public/modules/core/css');
		this.directory('public/modules/core/img');
		this.directory('public/modules/core/services');
		this.directory('public/modules/core/tests');
		this.copy('public/modules/core/views/home.client.view.html');
		this.copy('public/modules/core/core.client.module.js');

		// Copy config folder
		mkdirp('config', mkdirpError);
		mkdirp('config/env', mkdirpError);
		mkdirp('config/sslcerts', mkdirpError);

		// Copy config folder content
		this.directory('config/strategies');
		this.copy('config/config.js');
		this.copy('config/init.js');
		this.copy('config/express.js');
		this.copy('config/passport.js');

		// Copy project files
		this.copy('karma.conf.js');
		this.fs.copy(
			this.templatePath('gruntfile.js'),
			this.destinationPath('gruntfile.js')
		);
		//this.copy('gruntfile.js');
		this.copy('server.js');
		this.copy('Procfile');
		this.copy('fig.yml');
		this.copy('Dockerfile');
		this.copy('generate-ssl-certs.sh');
		this.copy('README.md');
		this.copy('LICENSE.md');

		// Copy project hidden files
		this.copy('bowerrc', '.bowerrc');
		this.copy('csslintrc', '.csslintrc');
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
		this.copy('gitignore', '.gitignore');
		this.copy('slugignore', '.slugignore');
		this.copy('travis.yml', '.travis.yml');
	},

	renderApplicationEnvironmentConfigFiles: function() {
		this.template('config/env/_all.js', 'config/env/all.js');
		this.template('config/env/_development.js', 'config/env/development.js');
		this.template('config/env/_production.js', 'config/env/production.js');
		this.template('config/env/_test.js', 'config/env/test.js');
		this.template('config/env/_secure.js', 'config/env/secure.js');
	},

	renderAngularApplicationConfigFile: function() {
		this.template('public/_config.js', 'public/config.js');
	},

	renderCoreModuleFiles: function() {
		this.template('public/modules/core/views/_header.client.view.html', 'public/modules/core/views/header.client.view.html');
	},

	renderApplicationDependenciesFiles: function() {
		this.template('_package.json', 'package.json');
		this.template('_bower.json', 'bower.json');
	}
});

module.exports = MeanGeneratorBase;
