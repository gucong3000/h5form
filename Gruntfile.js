module.exports = function( grunt ) {
	"use strict";

	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}

	// The concatenated file won't pass onevar
	// But our modules can

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),

		jshint: {
			all: {
				src: ["src/**/*.js"],
				options: {
					jshintrc: true
				}
			}
		},

		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> v<%= pkg.version %>*/\n",
				preserveComments: "some",
				report: "min",
				compress: {
					hoist_funs: false,
					loops: false,
					unused: false
				}
			},
			js: {
				files: [{
					expand: true,
					cwd: "src",						//src目录下
					src: ["*.js", "!*.htc.js"],		//所有js文件
					dest: "build"					//输出到此目录下
				}]
			},
			htc: {
				options: {
					banner: grunt.file.read("src/banner.htc").replace(/<!--[\w\W\r\n]*?-->|[\r\n]+/g,"") + "\n/*! <%= pkg.name %> v<%= pkg.version %>*/\n",
					footer: "\n</SCRIPT></PUBLIC:COMPONENT>"
				},
				files: [{
					expand: true,
					cwd: "src",				//src目录下
					src: ["*.htc.js"],		//所有*.htc.js文件
					dest: "build",			//输出到此目录下
					ext: '.htc'
				}]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	//文件合并插件
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// Default grunt
	grunt.registerTask( "default", [ "jshint", "uglify" ] );
};
