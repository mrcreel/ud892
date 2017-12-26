var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function () {
  // place code for your default task here
  console.log("Hello world!");
});

gulp.task('styles', function () {
  /* body... */
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 5%'] // 'last 2 versions' 
    }))
    .pipe(gulp.dest('./css'));
});