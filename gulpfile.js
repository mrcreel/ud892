/*eslint-env node*/

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync').create();
const jasmine = require('gulp-jasmine-phantom');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('default', 
  ['styles', 'lint', 'copy-html'],
  function(){
    gulp.watch('./sass/**/*.scss', ['styles']);
    gulp.watch('./js/**/*.js', ['lint']);
    gulp.watch('./index.html', ['copy-html']);
    gulp.watch('./dist/index.html').on('change', browserSync.reload);

    browserSync.init({
      server: './dist'
    });
    return gulp.src('src/images/*')
      .pipe(imagemin({
        progressive: true,
        use: [pngquant()]
      }))
      .pipe(gulp.dest('dist/images'));
  });

browserSync.stream();

gulp.task('styles', function () {
  /* body... */
  gulp.src('./sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 5%'] // 'last 2 versions' 
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('scripts', function() {
  gulp.src('./js/**/*.js')
    .pipe(babel())
    .pipe(concat('./all.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts-dist', function() {
  gulp.src('./js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('./all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js'));

});
gulp.task('lint', function(){
  // ESLint ignores files with "node_modules" paths. 
  // So, it's best to have gulp ignore the directory as well. 
  // Also, Be sure to return the stream from the task; 
  // Otherwise, the task may end before the stream has finished. 
  return gulp.src(['./js/**/*.js','!node_modules/**'])
  // eslint() attaches the lint output to the "eslint" property 
  // of the file object so it can be used by other modules. 
    .pipe(eslint())
  // eslint.format() outputs the lint results to the console. 
  // Alternatively use eslint.formatEach() (see Docs). 
    .pipe(eslint.format())
  // To have the process exit with an error code (1) on 
  // lint error, return the stream and pipe to failAfterError last. 
    .pipe(eslint.failAfterError());
});

gulp.task('tests', function(){
  gulp.src('./tests/spec/extraSpec.js')
    .pipe(jasmine({
      integration: true,
      vendor: './js/** *.js'
    }));
});

gulp.task('copy-html', function(){
  gulp.src('./index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function(){
  gulp.src('./img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
});
gulp.task('dist', [
  'copy-html',
  'copy-images',
  'styles',
  'lint',
  'scripts-dist'
]);