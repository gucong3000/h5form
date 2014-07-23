module.exports = function( grunt ) {
	"use strict";

	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}
	var banner = "/* <%= pkg.name %> v<%= pkg.version %>\n * homepage: <%= pkg.homepage %>\n */\n";

	// The concatenated file won't pass onevar
	// But our modules can

	grunt.initConfig({
		pkg: readOptionalJSON( "package.json" ),
		//js文档生成
		yuidoc: {
			compile: {
				name: "<%= pkg.name %>",
				description: "<%= pkg.description %>",
				version: "<%= pkg.version %>",
				url: "<%= pkg.homepage %>",
				options: {
/*					themedir: "node_modules/yuidocjs/themes/default",*/
					themedir: "node_modules/yuidocjs/themes/simple",
					outdir: "doc/",
					paths: "src/"
				}
			}
		},

		//js代码风格检查
		jshint: {
			options: {
				jshintrc: true
			},
			gruntfile: {
				src: ["Gruntfile.js"]
			},
			js: {
				src: ["src/**/*.js", "!src/**/*.htc.js"]
			},
			htc: {
				src: ["src/**/*.htc.js"]
			},
		},

		//js代码压缩与合并
		uglify: {
			options: {
				banner: banner,
				preserveComments: function(o, info){
					return /@(cc_on|if|else|end|_jscript(_\w+)?)\s/i.test(info.value);
				},
				report: "min",
				footer: "",
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
					banner: grunt.file.read("src/banner.htc").replace(/<!--[\w\W\r\n]*?-->|[\r\n]+/g,"") + "\n" + banner,
					footer: "\n</SCRIPT></PUBLIC:COMPONENT>"
				},
				files: [{
					expand: true,
					cwd: "src",				//src目录下
					src: ["*.htc.js"],		//所有*.htc.js文件
					dest: "build",			//输出到此目录下
					ext: ".htc"
				}]
			}
		},
		//文件变化监控
		watch: {
			gruntfile: {
				files: ["Gruntfile.js"],
				tasks: ["jshint:gruntfile"]
			},
			js: {
				files: ["src/**/*.js", "!**/*.htc.js"],
				tasks: ["jshint:js", "uglify:js"]
			},
			htc: {
				files: ["src/**/*.htc.js", "src/**/*.htc", "!src/h5form.htc"],
				tasks: ["jshint:htc", "uglify:htc", "htc"]
			}
		}
	});

	//文件变化监控插件
	grunt.loadNpmTasks("grunt-contrib-watch");
	//代码风格检查插件
	grunt.loadNpmTasks("grunt-contrib-jshint");
	//文件合并插件
	grunt.loadNpmTasks("grunt-contrib-uglify");
	//文档生成
	grunt.loadNpmTasks("grunt-contrib-yuidoc");

	// Default grunt
	grunt.registerTask( "default", [ "jshint", "uglify", "htc", "yuidoc" ] );
	grunt.task.registerTask("htc", "build htc", function() {
		grunt.file.write("src/h5form.htc", grunt.file.read("src/banner.htc") + grunt.file.read("src/h5form.htc.js") + "\n</SCRIPT></PUBLIC:COMPONENT>");
	});
};
