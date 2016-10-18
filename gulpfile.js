/**
 * dependency
 * gulp
 * gulp-uglify
 * gulp-concat
 * gulp-babel
 * babel-preset-es2015
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// gulp webpack
var webpack = require('webpack-stream');
var babel = require('gulp-babel');

// 信息流
gulp.task('dist', function() {
	gulp.src('./index.js').pipe(webpack({
			output: {
				filename: 'element.js'
			}
		}))
		.pipe(gulp.dest('./dist/'))
});


// development
gulp.task('dev', function() {
	gulp.watch('./**/**', ['dist'])
});