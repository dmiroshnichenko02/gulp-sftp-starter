'use strict'

require('dotenv').config()
const gulp = require('gulp')
const sftp = require('gulp-sftp-up4')
const watch = require('gulp-watch')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const postcss = require('gulp-postcss')
const tailwindcss = require('tailwindcss')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const minify = require('gulp-minify')
const gulpif = require('gulp-if')

// Config
const remoteDir = '/wp-content/themes/[your-theme]' // SFTP theme path
const localDir = ['./dist/**/*']

const host = process.env.HOST
const username = process.env.USERNAME
const password = process.env.PASSWORD
const port = process.env.PORT

// Styles

gulp.task('styles', () => {
	const plugins = [tailwindcss]

	return gulp
		.src('src/sass/**/*.+(scss|sass)')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest('dist/inc/css'))
})

//Configs deploy
gulp.task('configs', () => {
	return gulp
		.src([
			'./tailwind.config.js',
			'./tsconfig.json',
			'./gulpfile.js',
			'./package.json',
			'package-lock.json',
			'./.prettierrc'
		])
		.pipe(gulp.dest('dist/config'))
})

// JS

// gulp.task('scripts', function () {
// 	return gulp.src('src/js/**/*.js').pipe(gulp.dest('dist/inc/js'))
// })

// TS

gulp.task('typescript', function () {
	return gulp
		.src('src/ts/**/*.ts')
		.pipe(gulp.dest('dist/inc/ts'))
		.pipe(tsProject())
		.js.pipe(minify())
		.pipe(gulpif('*-min.js', gulp.dest('dist/inc/js')))
})

// HTML

gulp.task('html', function () {
	return gulp
		.src('src/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist/'))
})

// PHP

gulp.task('php', function () {
	return gulp.src('src/*.php').pipe(gulp.dest('dist/'))
})

// SASS

gulp.task('sass', function () {
	return gulp.src('src/sass/**/*.+(scss|sass)').pipe(gulp.dest('dist/inc/sass'))
})

// Fonts

gulp.task('fonts', function () {
	return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/inc/fonts'))
})

// Watch

gulp.task('watch', () => {
	watch('src/sass/**/*.+(scss|sass)', gulp.parallel('styles'))
	// watch('src/js/**/*.js', gulp.parallel('scripts'))
	watch('src/*.html', gulp.parallel('html'))
	watch('src/**/*.php', gulp.parallel('php'))
	watch('src/fonts/**/*', gulp.parallel('fonts'))
	watch('src/sass/**/*.+(scss|sass)', gulp.parallel('sass'))
	watch('src/ts/**/*.ts', gulp.parallel('typescript'))
	watch('src', gulp.parallel('configs'))
})

// Watch deploy

gulp.task('watch-deploy', () => {
	watch(localDir, { verbose: true }, function (event) {
		if (event.event === 'change') {
			console.log('Change detected! Uploading file "' + event.path + '"')
			const filePath = event.path.replace(__dirname + '/dist/', '')
			const remotePath =
				remoteDir + '/' + filePath.substring(0, filePath.lastIndexOf('/'))
			return gulp
				.src([event.path])
				.pipe(
					sftp({
						port,
						host,
						username,
						password,
						remotePath: remotePath
					})
				)
				.on('error', function (err) {
					console.error('Error:', err.toString())
				})
		}
	})
})

gulp.task(
	'default',
	gulp.parallel(
		'watch',
		'html',
		'fonts',
		'sass',
		'php',
		'typescript',
		'styles',
		'configs',
		// 'scripts',
		'watch-deploy'
	)
)
