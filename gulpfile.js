/**
 * Node.js Project Base Gulpfile
 * @author  Muhammad Dadu
 */
'use strict';

const $ 	= require('gulp-load-plugins')();
const del 	= require('del');
const gulp 	= require('gulp');
const fs 	= require('fs');
const path 	= require('path');
const pkg 	= require('./package.json');

/**
 * Helper methods
 */
function deleteDir(dir) {
	return (done) => {
		del([dir]).then(() => { done(); });
	};
}

function dir(file) {
	return path.join(__dirname, file);
}
dir.src = (file) => {
	return path.join(SRC_DIR, file);
}
dir.test = (file) => {
	return path.join(TEST_DIR, file);
}

function argFromFlag(flag) {
	let argv = process.argv;
	let index = argv.indexOf(`--${flag}`);
	if (!!~index && index + 1 < process.argv.length) {
		return process.argv[index + 1];
	}
	return false;
}

/*
 * Directories
 */
const COVERAGE_DIR 	= dir('coverage');
const DIST_DIR 		= dir('dist');
const DOCS_DIR 		= dir('docs');
const SRC_DIR 		= dir('src');
const TEST_DIR 		= dir('test');

const SRC_GLOB 	= dir.src('**/*.js');
const TEST_GLOB	= dir.test('**/*_test.js');

const TEST_SETUP_FILE = dir.test('setup.js');

const MY_DOCS = {
	'changelog': [ dir('./CHANGELOG.md') ]
};

/*
 * lint tasks
 */
let lint = (pattern) => {
	return gulp.src(pattern)
		.pipe($.plumber())
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.eslint.failAfterError());
}

gulp.task('lint-src', () => {
	return lint(SRC_GLOB);
});

gulp.task('lint-test', () => {
	return lint(TEST_GLOB);
});

/*
 * Clean tasks
 */
gulp.task('clean-coverage', deleteDir(COVERAGE_DIR));
gulp.task('clean-dist', 	deleteDir(DIST_DIR));
gulp.task('clean-docs', 	deleteDir(DOCS_DIR));

gulp.task('clean', ['clean-coverage', 'clean-dist', 'clean-docs']);

/*
 * build tasks
 */
gulp.task('build', ['clean-dist', 'lint-src'], () => {
	return gulp
		.src(SRC_GLOB)
		.pipe($.plumber())
		.pipe($.debug({ title: 'build' }))
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(DIST_DIR));
});

gulp.task('docs', ['lint-src', 'clean-docs'], () => {
	return gulp
		.src(SRC_DIR)
		.pipe($.plumber())
		.pipe($.debug({ title: 'docs' }))
		.pipe($.esdoc({
			destination: DOCS_DIR,
			manual: MY_DOCS,
			test: {
				type: 'mocha',
				source: TEST_DIR
			},
			plugins: [
				{ name: 'esdoc-es7-plugin' }
			],
			title: pkg.name,
		}));
});

gulp.task('watch', ['build'], () => {
	gulp.watch(SRC_GLOB, ['build'])
		.on('change', (evt) => {
			console.log('File %s has been %s', evt.path, evt.type);
		})
		.on('error', (evt) => {
			console.log('File has an error %s', evt.path, evt.type);
		});

	/**
	 * Execute commands whilst watching for changes
	 */
	let tasks = Object.keys(gulp.tasks);

	process.stdin.resume();
	process.stdin.on('data', (chunk) => {
		let command = String(chunk).trim();

		if (!!~tasks.indexOf(command)) {
			gulp.start([command]);
			// parse args
			return;
		}
	});
});

/*
 * test tasks
 */
gulp.task('test', ['lint-src', 'lint-test'], () => {
	let suite = argFromFlag('suite');
	let grep = argFromFlag('grep');
	let testsToRun = suite
		? suite.split(',').map(s => dir.test(s))
		: [TEST_GLOB];

	testsToRun.unshift(TEST_SETUP_FILE);

	return gulp.src(testsToRun)
		.pipe($.plumber())
		.pipe($.debug({ title: 'build' }))
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write())
		.pipe($.injectModules())
		.pipe($.debug({ title: 'test' }))
		.pipe($.mocha({ grep: grep }));
});

gulp.task('t', ['test']);

gulp.task('coverage', ['lint-src', 'lint-test', 'clean-coverage'], (cb) => {
	gulp.src(SRC_GLOB)
		.pipe($.plumber())
		.pipe($.debug({ title: 'build' }))
		.pipe($.sourcemaps.init())
		.pipe($.babelIstanbul())
		.pipe($.sourcemaps.write())
		.pipe($.injectModules())
		.on('finish', () => {
			gulp.src([TEST_SETUP_FILE, TEST_GLOB])
				.pipe($.plumber())
				.pipe($.debug({ title: 'test' }))
				.pipe($.sourcemaps.init())
				.pipe($.babel())
				.pipe($.sourcemaps.write())
				.pipe($.injectModules())
				.pipe($.mocha())
				.pipe($.babelIstanbul.writeReports())
				.on('end', cb);
		});
});

gulp.task('default', ['build']);
