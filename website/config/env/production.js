'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/webapplication',
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
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',

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
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
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
		css: 'builder/public/dist/application.min.css',
		js: 'builder/public/dist/application.min.js'
	},
	sharedAssets: {
		lib: {
			css: [
			],
			js: [

			]
		},
		css: 'shared/public/dist/application.min.css',
		js: 'shared/public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'TODO-CONFIGURE APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'TODO-CONFIGURE APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'TODO-CONFIGURE CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'TODO-CONFIGURE CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'TODO-CONFIGURE APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'TODO-CONFIGURE APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'TODO-CONFIGURE APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'TODO-CONFIGURE APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'TODO-CONFIGURE APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'TODO-CONFIGURE APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'TODO-CONFIGURE MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'TODO-CONFIGURE MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'TODO-CONFIGURE MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'TODO-CONFIGURE MAILER_PASSWORD'
			}
		}
	}
};
