module.exports = function( grunt ) {
	'use strict';
	//
	// Grunt configuration:
	//
	// https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
	//
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		,banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd H:MM") %> */'
		// default watch configuration
		,watch: {
			options: {
				livereload: false
			},
			jst: {
				files: [
					'app/templates/**/*.html'
				],
				tasks: 'jst'
			},
			sass: {
				files: [
					'app/styles/sass/**/*.scss'
				],
				tasks: 'sass:dist'
			}
		}
		// default lint configuration, change this to match your setup:
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
		,lint: {
			files: [
				'Gruntfile.js',
				'app/scripts/**/*.js',
				'test/**/*.js'
			]
		}
		// specifying JSHint options and globals
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
		,jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				// unused: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				"jQuery": true,
				"define": false
			},
			all: []
		}
		,requirejs: {
			options: {
				appDir: "app",
				baseUrl: "./scripts",
				mainConfigFile: "app/scripts/config.js",
				dir: "release/app",
				optimizeCss: "none",
				skipDirOptimize: true,
				optimize: "none",
				preserveLicenseComments: false,
				keepBuildDir: true,
				removeCombined: false
			}
			,mainIncludeFiles:[
				'main'
				,'talent'
				,'collections/index', 'routers/index'
				,'helpers/index', 'network/index'
				,"views/common/layouts/master-layout"
				,"views/common/layouts/empty-layout"
			]
			,main: {
				options: {
					modules: [
						{
							name: "main"
							,include: '<%= requirejs.mainIncludeFiles %>'
						}
					]
				}
			}
			,home: {
				options: {
					modules: [
						{
							name: "views/home/index-page-view"
							,exclude: '<%= requirejs.mainIncludeFiles %>'
						}
					]
				}
			}
		}
		,uglify: {
			options : {
				banner: '<%= banner %>',
        		// report: 'gzip',
				preserveComments: false
			}
			,main: {
				files: {
					'release/app/scripts/main.min.js': ['release/app/scripts/main.js']
				}
			}
			,home: {
				files: {
					'release/app/scripts/views/home/index-page-view.min.js': ['release/app/scripts/views/home/index-page-view.js']
				}
			}
			,form: {
				files: {
					'release/app/scripts/views/form/index-page-view.min.js': ['release/app/scripts/views/form/index-page-view.js']
				}
			}
			,plugins : {
				files: {
					'release/app/scripts/views/plugins/index-page-view.min.js': ['release/app/scripts/views/plugins/index-page-view.js']
				}
			}
		}
		,jst: {
			compile: {
				options: {
					prettify: true,
					// namespace: 'jst',
					processName: function(filename) {
						var index = filename.lastIndexOf('/');
						return filename.replace("app/templates/","").split(".")[0];
					},
					amd: true
				},
				files: {
					"app/scripts/templates/common.js": ["app/templates/common/**/*.html"]
					,"app/scripts/templates/home.js": ["app/templates/home/**/*.html"]
					,"app/scripts/templates/form.js" : ["app/templates/form/**/*.html"]
					,"app/scripts/templates/plugins.js" : ["app/templates/plugins/**/*.html"]
				}
			}
		}
		,cssjoin: {
			join :{
				files: {
					'release/app/styles/all.css': ['app/styles/all.css'],
				}
			}
		}
		,cssmin: {
			options: {
				// report: 'gzip',
				banner: '<%= banner %>'
			},
			compress: {
				files: {
				  'app/styles/css/all.min.css': ['app/styles/css/all.css']
				}
			}
		}
		,sass: {
			options:{
				trace:true
				,loadPath: [
					'app/styles/sass/'
				]
			},
			dist: {
				files: {
					'app/styles/css/all.css': 'app/styles/sass/all.scss'
				}
			}
		}
		,jsdoc : {
			dist : {
				src: [
					'app/scripts/main.js',
					'app/scripts/helpers/**/*.js',
					'app/scripts/network/**/*.js',
					'app/scripts/views/**/*.js',
					'app/scripts/collections/**/*.js',
					'app/scripts/models/**/*.js',
					'README.md'
				],
				options: {
					destination: 'doc'
				}
			}
		}
		,connect: {
			server: {
				options: {
					hostname: 'localhost',
					// port: 80,
					base: 'app'
				}
			}
		}
		,bower: {
			target: {
				rjsConfig: 'app/scripts/config.js'
				,exclude: []
			}
		}
		,concurrent: {
			compilejs: {
				tasks: [
				//top channels start
					'requirejs:main'
					,'requirejs:home'
				//top channels end
				]
			}
			,minjs: {
				tasks: [
					'uglify:main'
					,'uglify:home'
				]
			}
		}
		,sloc: {
			'app/scripts': ['**.js']
		}
	});
	grunt.registerTask('build', ['jst','concurrent:compilejs','concurrent:minjs']);
	grunt.registerTask('win', ['jst','sass','watch']);
	grunt.registerTask('server', ['jst','connect','watch']);

	// customized tasks by the project
	grunt.loadNpmTasks('grunt-contrib-jst');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-cssjoin');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-sloc');

};
