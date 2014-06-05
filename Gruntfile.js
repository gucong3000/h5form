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
			all: {
				files: [{
					expand: true,
					cwd: "src",			//src目录下
					src: ["*.js"],		//所有js文件
					dest: "build"		//输出到此目录下
				}],
				options: {
					preserveComments: "some",
					report: "min",
					banner: "/*! <%= pkg.name %> v<%= pkg.version %>*/\n",
					footer: "",
					compress: {
						hoist_funs: false,
						loops: false,
						unused: false
					}
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	//文件合并插件
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// Default grunt
	grunt.registerTask( "default", [ "jshint", "uglify" ] );
};
