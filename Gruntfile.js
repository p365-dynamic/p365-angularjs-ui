module.exports = function(grunt) {

	// 1. All configuration goes here 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			cleanStart : ["dist", '.tmp'],
			cleanEnd : ['.tmp']
		},

		copy: {
			main: {
				expand: true,
				cwd: 'deploy/',
				src: ['**', '!**/**/*.js', '!**/**/**/*.js', '!**/*.css'],
				dest: 'dist/'
			}
		},

		useminPrepare: {
			html: 'deploy/index.html'
		},

		usemin: {
			html: ['dist/index.html']
		},

		uglify: {
			options: {
				report: 'min',
				mangle: false
			}
		},
		
		imagemin: {
		    dynamic: {
		        files: [{
		            expand: true,
		            cwd: 'deploy/',
					src: ['**/**/*.{png,jpg,gif}', '**/**/**/*.{png,jpg,gif}', '**/*.{png,jpg,gif}'],
					dest: 'dist/'
		        }]
		    }
		}
	});

	// 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-usemin');

	// 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
	grunt.registerTask('default', [
	                               'clean:cleanStart', 'copy', 'useminPrepare', 'concat', 'uglify', 'imagemin', 'cssmin', 'usemin', 'clean:cleanEnd'
	                               ]);
};