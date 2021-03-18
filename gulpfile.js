const { src, dest, watch } = require('gulp');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const prettier = require('gulp-prettier');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const browserSync = require('browser-sync').create();

const data = require('gulp-data');
const importFresh = require("import-fresh");

// utilities
function cleanDirectory(directory) {

   if(!directory) return console.log("Need a directory in build");

   console.log("sweep "+directory+" up");
   return del([
      directory+"/**/*",
   ]);
}

function cleanFiles(filetype, nots) {
   
   if(!filetype) return console.log("Need a filetype");
   
   console.log("sweep "+filetype+" up");

   return del([
      "build/**/*."+filetype,
      nots
   ]);
}

function nunjuck() {
   console.log("throwing nunchoku");
   return src("src/pages/**/*.njk")
      .pipe(data(function(){
         return importFresh("./src/data/global.json");
      }))
      .pipe(
         nunjucksRender({
            path: ["src/templates"]
         })
      )
      .pipe(prettier({singleQuote: true, tabWidth: 3}))
      .pipe(dest("build"));
}

function prodSass() {
   console.log("getting sassy");
   return src("./src/scss/**/*.scss")
      .pipe(sass({outputStyle: 'compressed'}).on('error', function() {
         console.log(sass.logError);
      }))
      .pipe(rename({suffix: ".min"}))
      .pipe(dest("build/css"));
}

function devSass() {
   console.log("getting sassy");
   return src("./src/scss/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', function() {
         console.log(sass.logError);
      }))
      .pipe(sourcemaps.write())
      .pipe(rename({suffix: ".min"}))
      .pipe(dest("build/css"));
}

function devJs() {
   console.log("writing scripts");
   return src(["./src/js/jquery-3.6.0.min.js", "./src/js/base.js", "./src/js/*.js"])
      .pipe(sourcemaps.init())
      .pipe(concat("main.js"))
      .pipe(sourcemaps.write())
      .pipe(dest("build/js"));
}

function prodJs() {
   console.log("writing scripts");
   return src(["./src/js/jquery-3.6.0.min.js", "./src/js/base.js", "./src/js/*.js"])
      .pipe(concat("main.js"))
      .pipe(dest("build/js"));
}

// custom tasks
function startBrowser() {
   console.log("Launching");
   browserSync.init({
      server: {
         baseDir: "./build/",
         browser: "Firefox"
      }
   })
}

function development(done) {
   nunjuck();
   devSass();
   devJs();
   startBrowser();

   watch(["src/**/*.njk", "src/data/*.json"], function(done) {
      cleanFiles("html", "!build/archive/**");
      nunjuck();
      done();
   }).on("change", browserSync.reload);

   watch(["src/scss/*.scss"], function(done) {
      cleanDirectory("build/css");
      devSass();
      done();
   }).on("change", browserSync.reload);;

   watch(["src/js/*.js"], function(done) {
      cleanDirectory("build/js");
      devJs();
      done();
   }).on("change", browserSync.reload);;

   done();
}

function production(done) {
   cleanFiles("html", "!build/archive/**");
   nunjuck();
   cleanDirectory("build/css");
   prodSass();
   cleanDirectory("build/js");
   prodJs();

   done();
}

exports.default = development;
exports.build = production;
exports.start = startBrowser;