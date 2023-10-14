const gulp = require('gulp');
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const sass = require('gulp-sass')(require('sass'));
const atimport = require('postcss-import');
const cleanCSS = require('gulp-clean-css');
const PUBLIC_CSS = '../dist/css';
const PUBLIC_JS = '../dist/js';

const SOURCE_STYLESHEET = '../dist/css/styles.css';
const TAILWIND_CONFIG = './tailwind.config.js';

var jsSource = ['js/app.js'];
var sassSource = ['sass/styles.scss'];

gulp.task('scss', function () {
	return gulp
		.src(sassSource)
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([tailwindcss, autoprefixer, cssnano]))
		.pipe(gulp.dest(PUBLIC_CSS));
});

gulp.task('js', function () {
	return gulp.src(jsSource).pipe(terser()).pipe(gulp.dest(PUBLIC_JS));
});

gulp.task('purgecss', function () {
	return gulp
		.src(SOURCE_STYLESHEET)
		.pipe(
			postcss([
				atimport(),
				tailwindcss(TAILWIND_CONFIG),
				purgecss({
					content: ['../**/*.html'],
					defaultExtractor: (content) =>
						content.match(/[\w-/:]+(?<!:)/g) || [],
				}),
			])
		)
		.pipe(
			cleanCSS({
				compatibility: 'ie8',
				level: {
					2: {
						removeDuplicateRules: true, // turns on removing duplicate rules
					},
				},
			})
		)
		.pipe(gulp.dest(PUBLIC_CSS, { overwrite: true }));
});

gulp.task('default', gulp.series('scss', 'js'));
gulp.task('purge', gulp.series('purgecss'));
