'use strict';

module.exports = {
	port: 443,
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/webapplication',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.4/sandstone/bootstrap.min.css',		
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/ng-sortable/dist/ng-sortable.js',
				'public/modules/features/ng-sortable.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	builderAssets: {
		lib: {
			css: [
				'builder/public/lib/bootstrap/dist/css/bootstrap.min.css',
				'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.4/sandstone/bootstrap.min.css',		
			],
			js: [
				'builder/public/lib/angular/angular.js',
				'builder/public/lib/angular-resource/angular-resource.min.js',
				'builder/public/lib/angular-animate/angular-animate.min.js',
				'builder/public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'builder/public/lib/angular-ui-utils/ui-utils.min.js',
				'builder/public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'builder/public/lib/ng-sortable/dist/ng-sortable.js',
				'builder/public/modules/features/ng-sortable.js'
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
		callbackURL: 'https://localhost:443/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'TODO-CONFIGURE CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'TODO-CONFIGURE CONSUMER_SECRET',
		callbackURL: 'https://localhost:443/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'TODO-CONFIGURE APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'TODO-CONFIGURE APP_SECRET',
		callbackURL: 'https://localhost:443/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'TODO-CONFIGURE APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'TODO-CONFIGURE APP_SECRET',
		callbackURL: 'https://localhost:443/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'TODO-CONFIGURE APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'TODO-CONFIGURE APP_SECRET',
		callbackURL: 'https://localhost:443/auth/github/callback'
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