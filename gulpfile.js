var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    _ = require('underscore');
   
var paths = {
    allScss:               './assets/sass/**/*.scss',
    scss:               './assets/sass/application.scss',
    images:             './assets/images/**/*',
    fonts:              ['./assets/fonts/**/*', './node_modules/angular-ui-grid/ui-grid.woff'],
    scripts:            './assets/js/**/*.js', // all scripts for watching
    scripts_vendor:     ['./assets/js/vendor/*.js'],
    scripts_app:        ['./assets/js/*.js', './assets/js/partials/*.js','./assets/js/modules/*.js'],
    scripts_directives: './assets/js/directives/*.js',
    scripts_services:   './assets/js/services/*.js',
    scripts_controllers:'./assets/js/controllers/*.js'
};

gulp.task('sass', function() {
    return gulp.src(paths.scss)
        .pipe(sass({
            includePaths: _.flatten([require("bourbon").includePaths, require("bourbon-neat").includePaths]),
            style: 'compressed',
            quiet: false
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', function(){
    var scripts = _.flatten([paths.scripts_vendor, paths.scripts_app, paths.scripts_directives, paths.scripts_services, paths.scripts_controllers]);
    return gulp.src(scripts)
        .pipe(gp_concat('scripts.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('images', function(){
    return gulp.src(paths.images)
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('fonts', function(){
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function() {
    gulp.watch(paths.allScss, ['sass']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.fonts, ['fonts']);
});

gulp.task('default', ['fonts', 'sass', 'scripts']);
