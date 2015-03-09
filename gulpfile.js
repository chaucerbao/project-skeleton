"use strict";

/* Configuration */
var path = require("path"),
  src = path.join(__dirname, "/src/"),
  dest = path.join(__dirname, "/public/"),
  production = false;

var css = {
  src: src + "css/",
  dest: dest + "css/",
  globs: ["**/*.scss", "!**/_*.scss"]
};

var js = {
  src: src + "js/",
  dest: dest + "js/",
  globs: ["**/*.js", "!**/_*.js"],
  public: "/js/"
};

var img = {
  src: src + "img/",
  dest: dest + "img/",
  globs: ["**/*.{gif,jpg,png,svg}"]
};

var font = {
  src: src + "icon/",
  dest: dest + "font/",
  globs: ["**/*.svg"],
  name: "icon-font",
  public: "/font/"
};

var types = [css, js, img, font];

/* Plugins */
var gulp = require("gulp"),
  gutil = require("gulp-util"),
  plumber = require("gulp-plumber"),
  runSequence = require("run-sequence"),
  newer = require("gulp-newer"),
  gzip = require("gulp-gzip"),
  del = require("del"),
  sourcemaps = require("gulp-sourcemaps"),
  server = require("gulp-server-livereload"),

  /* CSS */
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  postcssProcessors = [
    require("autoprefixer-core"),
    require("csswring")
  ],

  /* Javascript */
  gulpWebpack = require("gulp-webpack"),
  webpack = require("webpack"),

  /* Image */
  imagemin = require("gulp-imagemin"),

  /* Icon Font */
  iconfont = require("gulp-iconfont"),
  iconfontCss = require("gulp-iconfont-css");

/* Webpack Configuration */
var webpackConfig = {
  entry: {
    "entry": js.src + "entry"
  },
  output: {
    path: js.dest,
    filename: "[name].js",
    chunkFilename: "[hash].js",
    publicPath: js.public
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: "style!css!postcss!sass"
    }, {
      test: /\.js$/,
      loader: "babel",
      exclude: /node_modules/
    }]
  },
  postcss: postcssProcessors,
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common"
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin()
  ],
  devtool: "eval"
};

/* Attach a files() method for generating globs with an absolute path */
types.forEach(function(type) {
  type.files = function(target, globs) {
    var dir = target === "dest" ? this.dest : this.src,
      files = [];

    (globs || this.globs).forEach(function(glob) {
      files.push(dir + glob);
    });

    return files;
  }.bind(type);
});

/* CSS */
gulp.task("css", function() {
  var noop = gutil.noop;

  del.sync(css.dest);

  return gulp.src(css.files())
    .pipe(plumber())
    .pipe(production ? noop() : sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(postcssProcessors))
    .pipe(production ? noop() : sourcemaps.write())
    .pipe(gulp.dest(css.dest));
});

/* Javascript */
gulp.task("js", function() {
  var config = webpackConfig;

  if (production) {
    delete config.devtool;
  }

  del.sync(js.dest);

  return gulp.src(js.files())
    .pipe(plumber())
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest(js.dest));
});

/* Images */
gulp.task("img", function() {
  return gulp.src(img.files())
    .pipe(plumber())
    .pipe(newer(img.dest))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(img.dest));
});

/* Icon Font */
gulp.task("font", function() {
  return gulp.src(font.files(), {
      base: path.join(path.relative(src, __dirname))
    })
    .pipe(plumber())
    .pipe(newer(path.join(font.dest, font.name + ".woff")))
    .pipe(iconfontCss({
      fontName: font.name,
      path: "scss",
      targetPath: path.join(path.relative(font.dest, css.src), "_icons.scss"),
      fontPath: font.public
    }))
    .pipe(iconfont({
      fontName: font.name,
      normalize: true,
      fontHeight: 500,
      appendCodepoints: true
    }))
    .pipe(gulp.dest(font.dest));
});

/* Clean destination directories */
gulp.task("clean", function(callback) {
  var paths = types.map(function(type) {
    return type.dest;
  });

  return del(paths, callback);
});

/* Compress CSS/JS assets in destination directories */
gulp.task("gzip", function() {
  gulp.src(css.files("dest", ["**/*.css"]))
    .pipe(gzip())
    .pipe(gulp.dest(css.dest));
  gulp.src(js.files("dest", ["**/*.js"]))
    .pipe(gzip())
    .pipe(gulp.dest(js.dest));
});

gulp.task("watch", ["build"], function() {
  gulp.watch(css.files(), ["css"]);
  gulp.watch(js.files().concat(
    /* Also watch for CSS changes */
    js.files("src", css.globs.slice(0, 1))
  ), ["js"]);
  gulp.watch(img.files(), ["img"]);
  gulp.watch(font.files(), ["font"]);

  gulp.src(dest)
    .pipe(server({
      host: "0.0.0.0",
      port: 8080,
      livereload: true
    }));
});

gulp.task("build", ["css", "js", "img", "font"]);

gulp.task("dist", function(callback) {
  production = true;

  runSequence("build", "gzip", callback);
});

gulp.task("default", ["build"]);
