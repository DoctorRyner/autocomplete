const
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    server = require('gulp-webserver'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    tsify = require('tsify'),
    browserify = require('browserify'),
    glob = require('glob').sync,
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify')
    
gulp.task('html', () => gulp.src('src/index.html').pipe(gulp.dest('build')))

gulp.task('json', () => gulp.src('src/json/*').pipe(gulp.dest('build/json')))

gulp.task('fonts', () => gulp.src('src/fonts/*').pipe(gulp.dest('build/fonts')))

gulp.task('sass', () => gulp.src('src/style.scss')
                            .pipe(sass().on('error', sass.logError))
                            .pipe(gulp.dest('build')))

const compile = (srcPath, outFile, outDir, shouldUglify = false) => {
    browserify(glob(srcPath))
        .plugin(tsify)
        .bundle().on('error', err => console.log(err.stack))
        .pipe(source(outFile))
        .pipe(buffer())
        .pipe(gulpif(shouldUglify, uglify()))
        .pipe(gulp.dest(outDir))
}

gulp.task('ts', () => compile('src/ts/**/*.ts*', 'app.js', 'build'))
gulp.task('production', ['html', 'sass'], () => compile('src/ts/**/*.ts*', 'app.js', 'build', true))
gulp.task('test', () => compile('test/*.ts', 'test.js', 'test/.build'))

gulp.task('server', () => {
    gulp.watch('src/index.html', ['html'])
    gulp.watch('src/style.scss', ['sass'])
    gulp.watch('src/ts/**/*.ts*', ['ts'])

    gulp.src('build').pipe(server({ livereload: true, fallback: 'index.html' }))
})

gulp.task('default', ['ts', 'sass', 'html', 'fonts', 'json'], () => gulp.start('server'))