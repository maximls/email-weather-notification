"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const cssvariables = require("postcss-css-variables");
const rucksuck = require("rucksack-css");

gulp.task("serve", ["sass"], function() {
  browserSync.init({
    proxy: "localhost:3000"
  });

  gulp.watch("public/assets/css/partials/*.scss", ["sass"]);
  gulp.watch("public/assets/css/*.scss", ["sass"]);
  gulp.watch("src/*.html").on("change", browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function() {
  return gulp
    .src("public/assets/css/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssvariables(), rucksuck()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("public/assets/css"))
    .pipe(browserSync.stream());
});

gulp.task("default", ["serve"]);
