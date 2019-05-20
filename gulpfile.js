"use strict";

var gulp = require("gulp");
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgSprite = require('gulp-svg-sprite');
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var terser = require("gulp-terser");
var pipeline = require('readable-stream').pipeline;



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
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html",  gulp.series("html", "refresh"));
});

gulp.task("images", function () {
  return gulp.src('./source/img/*')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false,
        },{
          cleanupAttrs: true,
        },{
          inlineStyles: false,
        },{
          removeComments: true,
        },{
          removeEditorsNSData: true,
        },{
          minifyStyles: false,
        },{
          convertStyleToAttrs: false,
        },{
          removeUnknownsAndDefaults: false,
        },{
          removeNonInheritableGroupAttrs: false,
        }]
      })
    ]))
    .pipe(gulp.dest("./source/img"))
});

gulp.task("webp", () => {
  return gulp.src("./source/img/*{jpg,png}")
    .pipe(webp({quality: 85}))
    .pipe(gulp.dest("./source/img"))
});


gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      }
    ))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("./build"));
});

gulp.task("js", function () {
  return gulp.src("./source/js/*.js")
    .pipe(terser())
    .pipe(rename({
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(gulp.dest("./build/js"))
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("./build");
});

gulp.task("build", gulp.series("clean", "copy", "css", "js", "sprite", "html"));

gulp.task("start", gulp.series("build", "server"));

gulp.task("optimizeImgs", gulp.series("images", "webp"));


gulp.task("refresh", function (done) {
  server.reload();
  done();
});
