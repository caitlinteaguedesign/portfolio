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

function nunjuck(params) {
   console.log("throwing nunchoku");
   return src("src/pages/**/*.njk")
      .pipe(data(function(){
         return importFresh("./src/data/global.json");
      }))
      .pipe(data(params))
      .pipe(
         nunjucksRender({
            path: ["src/templates"]
         })
      )
      .pipe(prettier({singleQuote: true, tabWidth: 3}))
      .pipe(dest("build"));
}

function devSass() {
   console.log("getting dev sassy");
   return src("./src/scss/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', function() {
         console.log(sass.logError);
      }))
      .pipe(sourcemaps.write())
      .pipe(rename({suffix: ".full"}))
      .pipe(dest("build/css"));
}

function prodSass() {
   console.log("getting prod sassy");
   return src("./src/scss/**/*.scss")
      .pipe(sass({outputStyle: 'compressed'}).on('error', function() {
         console.log(sass.logError);
      }))
      .pipe(rename({suffix: ".min"}))
      .pipe(dest("build/css"));
}

function devJs() {
   console.log("writing dev scripts");
   return src(["./src/js/jquery-3.6.0.min.js", "./src/js/base.js", "./src/js/*.js"])
      .pipe(sourcemaps.init())
      .pipe(concat("main.js"))
      .pipe(sourcemaps.write())
      .pipe(dest("build/js"));
}

function prodJs() {
   console.log("writing prod scripts");
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
   cleanFiles("html", "!build/archive/**");
   cleanDirectory("build/css");
   cleanDirectory("build/js");

   nunjuck({stylesheet: "styles.full.css"});
   devSass();
   devJs();
   startBrowser();

   watch(["src/**/*.njk", "src/data/*.json"], function(done) {
      cleanFiles("html", "!build/archive/**");
      nunjuck({stylesheet: "styles.full.css"});
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
   nunjuck({stylesheet: "styles.min.css"});
   prodSass();
   prodJs();
   done();
}

exports.default = development;
exports.build = production;
exports.start = startBrowser;