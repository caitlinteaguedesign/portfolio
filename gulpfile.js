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

const CURRENT_YEAR = new Date().getFullYear();

// utilities

function copyStaticAssets() {
   console.log("copy the things");
   return src('./test/**/*').pipe(dest('./build/'))
}

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

function devNunjuck() {
   console.log("throwing dev nunchoku");
   return src("src/pages/**/*.njk")
      .pipe(data(function(){
         return importFresh("./src/data/global.json");
      }))
      .pipe(data({
         current_year: CURRENT_YEAR,
         stylesheet: "styles.full.css"
      }))
      .pipe(
         nunjucksRender({
            path: ["src/templates"]
         })
      )
      .pipe(prettier({singleQuote: true, tabWidth: 3}))
      .pipe(dest("build"))
      .pipe(browserSync.reload({stream: true}));
}

function prodNunjuck() {
   console.log("throwing prod nunchoku");
   return src("src/pages/**/*.njk")
      .pipe(data(function(){
         return importFresh("./src/data/global.json");
      }))
      .pipe(data({
         current_year: CURRENT_YEAR,
         stylesheet: "styles.min.css"
      }))
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
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(rename({suffix: ".full"}))
      .pipe(dest("build/css"))
      .pipe(browserSync.reload({stream: true}));
}

function prodSass() {
   console.log("getting prod sassy");
   return src("./src/scss/**/*.scss")
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename({suffix: ".min"}))
      .pipe(dest("build/css"));
}

function devJs() {
   console.log("writing dev scripts");
   return src(["./src/js/jquery-3.6.0.min.js", "./src/js/ready.js", "./src/js/*.js"])
      .pipe(sourcemaps.init())
      .pipe(concat("main.js"))
      .pipe(sourcemaps.write())
      .pipe(dest("build/js"))
      .pipe(browserSync.reload({stream: true}));
}

function prodJs() {
   console.log("writing prod scripts");
   return src(["./src/js/jquery-3.6.0.min.js", "./src/js/ready.js", "./src/js/*.js"])
      .pipe(concat("main.js"))
      .pipe(dest("build/js"));
}

function startBrowser() {
   console.log("Launching");
   browserSync.init({
      server: {
         baseDir: "./build/",
         browser: "Firefox"
      }
   })
}

// custom tasks

function development(done) {
   cleanDirectory("build/");
   devNunjuck();
   devSass();
   devJs();
   copyStaticAssets();

   startBrowser();

   watch(["src/**/*.njk", "src/data/*.json"], function(done) {
      cleanFiles("html", "!build/archive/**");
      devNunjuck();
      done();
   });

   watch(["src/scss/**/*.scss"], function(done) {
      cleanDirectory("build/css");
      devSass();
      done();
   });

   watch(["src/js/*.js"], function(done) {
      cleanDirectory("build/js");
      devJs();
      done();
   });

   done();
}

function production(done) {
   cleanDirectory("build/");
   prodNunjuck();
   prodSass();
   prodJs();
   copyStaticAssets();
   done();
}

exports.default = development;
exports.build = production;