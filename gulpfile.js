var assign = Object.assign || require('object.assign');
var babel = require("gulp-babel");
var del = require("del");
var gulp = require("gulp");
var runSequence = require("run-sequence");

var babelOptions = {
  moduleIds: false,
  comments: false,
  compact: false,
  stage: 2,
  optional: [
    "es7.decorators",
    "es7.classProperties"
  ]
};

gulp.task("clean", function(callback) {
  del(["dist/**/*"], callback);
});

gulp.task("build-html", function() {
  return gulp.src("src/**/*.html")
    .pipe(gulp.dest("dist/es6"))
    .pipe(gulp.dest("dist/commonjs"))
    .pipe(gulp.dest("dist/amd"))
    .pipe(gulp.dest("dist/system"));
});

gulp.task("build-js-es6", function() {
  return gulp.src("src/**/*.js")
    .pipe(gulp.dest("dist/es6"));
});

gulp.task("build-js-commonjs", function() {
  return gulp.src("src/**/*.js")
    .pipe(babel(assign({}, babelOptions, { modules: "common" })))
    .pipe(gulp.dest("dist/commonjs"))
});

gulp.task("build-js-amd", function() {
  return gulp.src("src/**/*.js")
    .pipe(babel(assign({}, babelOptions, { modules: "amd" })))
    .pipe(gulp.dest("dist/amd"))
});

gulp.task("build-js-system", function() {
  return gulp.src("src/**/*.js")
    .pipe(babel(assign({}, babelOptions, { modules: "system" })))
    .pipe(gulp.dest("dist/system"))
});

gulp.task("build", function(callback) {
  return runSequence(
    "clean",
    ["build-js-es6", "build-js-commonjs", "build-js-amd", "build-js-system", "build-html"],
    callback
  );
});
