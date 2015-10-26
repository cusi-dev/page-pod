var assign = Object.assign || require("object.assign");
var babel = require("gulp-babel");
var browserSync = require("browser-sync");
var bump = require("gulp-bump");
var changelog = require("conventional-changelog");
var del = require("del");
var fs = require("fs");
var gulp = require("gulp");
var runSequence = require("run-sequence");
var yargs = require("yargs");
var vinylPaths = require("vinyl-paths");

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

var argv = yargs.argv;
var validBumpTypes = "major|minor|patch|prerelease".split("|");
var bumpType = (argv.bump || "patch").toLowerCase();

if(validBumpTypes.indexOf(bumpType) === -1) {
  throw new Error("Unrecognized bump '" + bumpType + "'.");
}

gulp.task("clean", function() {
  return gulp.src("dist")
    .pipe(vinylPaths(del));
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

gulp.task("build-styles", function() {
  return gulp.src("styles/bootstrap.css")
    .pipe(gulp.dest("dist/es6"))
    .pipe(gulp.dest("dist/commonjs"))
    .pipe(gulp.dest("dist/amd"))
    .pipe(gulp.dest("dist/system"));
});

gulp.task("build", function(callback) {
  return runSequence(
    "clean",
    ["build-js-es6", "build-js-commonjs", "build-js-amd", "build-js-system", "build-html", "build-styles"],
    callback
  );
});

gulp.task("bump-version", function(){
  return gulp.src("./package.json")
    .pipe(bump({type: bumpType})) // major|minor|patch|prerelease
    .pipe(gulp.dest("./"));
});

gulp.task("changelog", function() {
  var pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
  var changeLogOptions = {
    repository: pkg.repository.url,
    version: pkg.version,
    releaseCount: 0
  };

  return changelog(changeLogOptions)
    .pipe(fs.createWriteStream("CHANGELOG.md"));
});

gulp.task("prepare-release", function(callback){
  return runSequence(
    "build",
    "bump-version",
    "changelog",
    callback
  );
});

gulp.task("serve", ["build"], function(done) {
  browserSync({
    online: false,
    open: false,
    server: {
      baseDir: "./sample",
      routes: {
        "/page-pod": "./dist/amd"
      }
    }
  }, done);
});

function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('watch', ['serve'], function() {
  gulp.watch('./src/**/*.*', ['build', browserSync.reload]).on('change', reportChange);
  gulp.watch('./styles/**/*.*', ['build', browserSync.reload]).on('change', reportChange);
  gulp.watch('./sample/**/*.*', ['build', browserSync.reload]).on('change', reportChange);
});
