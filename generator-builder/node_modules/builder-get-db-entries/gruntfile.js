'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		sourceFiles: ['gruntfile.js', 'index.js', 'config/**/*.js', 'app/**/*.js'],
		mochaTests: ['tests/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: {
				src: watchFiles.sourceFiles,
				options: {
					jshintrc: true
				}
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec'
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('setConfigAndDbConnection', 'Task that sets the config and the MongoDb database connection.', function() {
		var init = require('./config/init')();
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'default']); //todo: define the default task

	// Lint task(s).
	grunt.registerTask('lint', ['jshint']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'setConfigAndDbConnection', 'mochaTest']);
};