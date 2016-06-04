'use strict';

module.exports = {
	db: 'mongodb://localhost/webapplication-test',
	port: 3001,
	app: {
		title: 'WebApplication - Test Environment'
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
