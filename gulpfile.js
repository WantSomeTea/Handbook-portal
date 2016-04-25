var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var rimraf = require('gulp-rimraf');
var ignore = require('gulp-ignore');
var convertEncoding = require('gulp-convert-encoding');
var jsObfuscator = require('gulp-js-obfuscator');

gulp.task('pre-commit', ['test']);

gulp.task('test', function () {
    return gulp.src('testFile.js')
        .pipe(convertEncoding({
            from: 'windows-1251',
            to: 'UTF-8'
        }))
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(jsObfuscator())
        .pipe(gulp.dest(''));
});

gulp.task('css',function(){
    gulp.src(['public/stylesheets/signin.css', 'public/stylesheets/style.css'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('public/stylesheets/dist'));
});

gulp.task('publicJs',function(){
    gulp.src(['public/javascripts/index.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(ngAnnotate())
        .pipe(jsObfuscator())
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('apiJs', function () {
    gulp.src(['routes/api/*.js', '!routes/api/*-min.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(jsObfuscator())
        .pipe(gulp.dest('routes/api'));
});

gulp.task('modelsJs', function () {
    gulp.src(['models/*.js', '!models/aws/*.js', '!models/rdbms/*.js', '!models/*-min.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(jsObfuscator())
        .pipe(gulp.dest('models'));
});


gulp.task('delFiles', function () {
    return gulp.src([
            'public/stylesheets/signin.css',
            'public/stylesheets/style.css',
            'public/javascripts/index.js',
            'public/javascripts/settings.js',
            'routes/api/*.js',
            'models/*.js'
        ], {read: false})
        .pipe(ignore.exclude('routes/api/*.min.js', 'models/*.min.js', 'models/aws/*.js', 'models/rdbms/*.js'))
        .pipe(rimraf({force: true}))
});


gulp.task('default', function(){
    gulp.watch('models/*.js', ['modelsJs']);
    gulp.watch('routes/api/*.js', ['apiJs']);
    gulp.watch('public/javascripts/index.js', 'public/javascripts/settings.js',['publicJs']);
    gulp.watch('public/stylesheets/*.css',['css']);
});
