// Karma configuration
"use strict";
module.exports = function(config) {
	var customLaunchers = {};
	var ostype = require("os").type();

	if (ostype === "Windows_NT") {
		customLaunchers.ie = {
			base: "IE",
			flags: ["-extoff"],
			"x-ua-compatible": "IE=edge"
		};
		for (let ver = 6; ver < 12; ver++) {
			customLaunchers["IETester" + ver] = {
				base: "IETester",
				flags: ["-ie" + ver],
			};
		}
	} else {
		customLaunchers.sl_chrome = {
			base: "SauceLabs",
			browserName: "chrome",
		};
		if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
			console.log("Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.");
			process.exit(1);
		} else if (!process.env.CI) {
			console.log(process.env.SAUCE_USERNAME);
			console.log(process.env.SAUCE_ACCESS_KEY);
		}
	}

	var browsers = Object.keys(customLaunchers);
	browsers.push("PhantomJS");

	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "",

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["jasmine", "requirejs"],


		// list of files / patterns to load in the browser
		files: [{
				pattern: "node_modules/jquery/dist/jquery.js",
				watched: false,
				included: true,
			}, {
				pattern: "test/**/*.*",
				watched: true,
				included: false,
			}, {
				pattern: "src/**/*.*",
				watched: true,
				included: false,
			},
			"test/**/*.html",
			"test/karma.test.js",
		],


		// list of files to exclude
		exclude: [],

		plugins: [
			"karma-coverage",
			"karma-html2js-preprocessor",
			"karma-ie-launcher",
			"karma-ietester-starter",
			"karma-jasmine",
			"karma-phantomjs-launcher",
			"karma-requirejs",
			"karma-sauce-launcher",
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			// "src/**/*.js": "coverage",
			"**/*.html": "html2js",
		},

		// test results reporter to use
		// possible values: "dots", "progress"
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ["progress", "coverage", "saucelabs"],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		sauceLabs: {
			testName: require("./package.json").name + " Karma unit test",
			retryLimit: 3,
			// startConnect: false,
			recordVideo: true,
		},

		captureTimeout: 60000,
		browserDisconnectTimeout: 60000,
		browserDisconnectTolerance: 3,
		browserNoActivityTimeout: 60000,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: browsers,
		// you can define custom flags 
		customLaunchers: customLaunchers,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,
	});
};