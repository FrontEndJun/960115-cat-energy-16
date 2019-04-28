"use strict";
var Comb = require('csscomb');
var comb = new Comb('csscombcust');

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var imagemin = require('imagemin');
var imageminWebp = require('imagemin-webp');
var svgSprite = require('gulp-svg-sprite');

function csscomb(done) {
  comb.processPath('source/css/style.css');
  done();
}

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer({
          browsers: ['last 2 versions']
        })
      ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});


gulp.task("start", gulp.series("css", csscomb, "server"));


gulp.task("webp", () => {
  return imagemin(['source/img/*.{jpg,png}'], 'build/img/', {
    use: [
      imageminWebp({quality: 80})
    ]
  });
});

gulp.task("sprite", function (){
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      }
    ))
    .pipe(gulp.dest("source/img"));
});
