'use strict';

module.exports = {
	app: {
		title: 'Web Application Builder',
		description: 'Generate full fledged web application with multi user logins and ability to store data in hierarchical format',
		keywords: 'Website Creator, Website Generator, Web Application Creator, Web Application Generator'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [			
				'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.4/sandstone/bootstrap.min.css',
				'public/lib/angular-gridster/angular-gridster.min.css',
				'public/lib/nvd3/build/nv.d3.min.css',
				'public/lib/angular-bootstrap-datetimepicker/css/datetimepicker.css',
				'public/lib/angular-ui-grid/ui-grid.min.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',

				'public/lib/angular-ui-scroll/dist/ui-scroll.js',
				'public/lib/angular-ui-scrollpoint/dist/scrollpoint.js',
				'public/lib/angular-ui-event/dist/event.js',
				'public/lib/angular-ui-mask/dist/mask.js',
				'public/lib/angular-ui-validate/dist/validate.js',
				'public/lib/angular-ui-indeterminate/dist/indeterminate.js',
				'public/lib/angular-ui-uploader/dist/uploader.js',

				'public/lib/angular-ui-utils/index.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/modules/features/ng-sortable.js',
				'http://d3js.org/d3.v3.min.js',

				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/javascript-detect-element-resize/jquery.resize.js',
				'public/lib/angular-gridster/angular-gridster.min.js',
				'public/lib/nvd3/build/nv.d3.min.js',
				'public/lib/angular-nvd3/dist/angular-nvd3.min.js',

				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular-bootstrap-datetimepicker/js/datetimepicker.js',

				'public/lib/ng-file-upload/ng-file-upload-all.min.js',
				'public/lib/angular-ui-grid/ui-grid.min.js',
				'public/lib/pdfmake/pdfmake.min.js',
				'public/lib/pdfmake/vfs_fonts.js',

				'public/lib/angular-smart-table/smart-table.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	},
	builderAssets: {
		lib: {
			css: [			
				'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.4/sandstone/bootstrap.min.css',
				'builder/public/lib/angular-gridster/angular-gridster.min.css',
				'builder/public/lib/nvd3/build/nv.d3.min.css',
				'builder/public/lib/angular-bootstrap-datetimepicker/css/datetimepicker.css',
				'builder/public/lib/angular-ui-grid/ui-grid.min.css'
			],
			js: [
				'builder/public/lib/angular/angular.js',
				'builder/public/lib/angular-resource/angular-resource.js', 
				'builder/public/lib/angular-cookies/angular-cookies.js', 
				'builder/public/lib/angular-animate/angular-animate.js', 
				'builder/public/lib/angular-touch/angular-touch.js', 
				'builder/public/lib/angular-sanitize/angular-sanitize.js', 
				'builder/public/lib/angular-ui-router/release/angular-ui-router.js',

				'builder/public/lib/angular-ui-scroll/dist/ui-scroll.js',
				'builder/public/lib/angular-ui-scrollpoint/dist/scrollpoint.js',
				'builder/public/lib/angular-ui-event/dist/event.js',
				'builder/public/lib/angular-ui-mask/dist/mask.js',
				'builder/public/lib/angular-ui-validate/dist/validate.js',
				'builder/public/lib/angular-ui-indeterminate/dist/indeterminate.js',
				'builder/public/lib/angular-ui-uploader/dist/uploader.js',

				'builder/public/lib/angular-ui-utils/index.js',
				'builder/public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'builder/public/modules/features/ng-sortable.js',
				'http://d3js.org/d3.v3.min.js',

				'builder/public/lib/jquery/dist/jquery.min.js',
				'builder/public/lib/javascript-detect-element-resize/jquery.resize.js',
				'builder/public/lib/angular-gridster/angular-gridster.min.js',
				'builder/public/lib/nvd3/build/nv.d3.min.js',
				'builder/public/lib/angular-nvd3/dist/angular-nvd3.min.js',

				'builder/public/lib/bootstrap/dist/js/bootstrap.min.js',
				'builder/public/lib/moment/min/moment.min.js',
				'builder/public/lib/angular-bootstrap-datetimepicker/js/datetimepicker.js',

				'builder/public/lib/ng-file-upload/ng-file-upload-all.min.js',
				'builder/public/lib/angular-ui-grid/ui-grid.min.js',
				'builder/public/lib/pdfmake/pdfmake.min.js',
				'builder/public/lib/pdfmake/vfs_fonts.js',

				'builder/public/lib/angular-smart-table/smart-table.min.js'
			]
		},
		css: [
			'builder/public/modules/**/css/*.css'
		],
		js: [
			'builder/public/config.js',
			'builder/public/application.js',
			'builder/public/modules/*/*.js',
			'builder/public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'builder/public/lib/angular-mocks/angular-mocks.js',
			'builder/public/modules/*/tests/*.js'
		]
	},
	sharedAssets: {
		lib: {
			css: [
				
			],
			js: [

			]
		},
		css: [
			'shared/public/modules/**/css/*.css'
		],
		js: [
			'shared/public/config.js',
			'shared/public/application.js',
			'shared/public/modules/*/*.js',
			'shared/public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'shared/public/lib/angular-mocks/angular-mocks.js',
			'shared/public/modules/*/tests/*.js'
		]
	}

};