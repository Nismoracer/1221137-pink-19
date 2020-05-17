"use strict";

var gulp = require("gulp");
var del = require("del");
var rename = require("gulp-rename");

var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var uglify = require("gulp-uglify");

var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var minifyHTML = require("gulp-minify-html");

var server = require("browser-sync").create();

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/*.ico"
    ], {
      base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("js", function() {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js"))
});

gulp.task("img", function () {
  return gulp.src("source/img/*")
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: true}
        ]
      })
    ]))
    .pipe(gulp.dest("build/img"))
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
  return gulp.src("build/img/icon-*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"))
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("minify-html", function() {
	var opts = {comments:true,spare:true};

  return gulp.src("build/*.html")
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest("build"))
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series("css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html"));
  gulp.watch("source/js/*.js", gulp.series("js"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("build", gulp.series("clean", "css", "js", "img", "webp", "sprite", "copy", "html", "minify-html"));
gulp.task("start", gulp.series("build", "server"));
