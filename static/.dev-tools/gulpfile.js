'use strict';

// Плагины

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;


// Пути

var path = {
    build: {
        html: '../../',
        js: '../../js/',
        css: '../../css/',
        img: '../../img/',
        sprite: '../../img/',
        fonts: '../../fonts/'
    },
    src: {
        html: '../*.html',
        js: '../js/main.js',
        style: '../less/main.less',
        img: '../assets/images/**/*.*',
        sprite : '../assets/sprite/**/*.*',
        fonts: '../assets/fonts/**/*.*'
    },
    watch: {
        html: '../**/*.html',
        js: '../js/**/*.js',
        style: '../less/**/*.less',
        img: '../assets/images/**/*.*',
        sprite: '../assets/sprite/**/*.*',
        fonts: '../assets/fonts/**/*.*'
    }
};


var config = {
    server: {
        baseDir: "../../"
    },
    tunnel: false // external port
    // port: 3001 // default port
};


// build html

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});


// build js

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});


// build sprites

gulp.task('sprite:build', function() {
  var spriteData =
      gulp.src(path.src.sprite)
          .pipe(spritesmith({
              imgName: 'sprite.png',
              imgPath: '../../images/icons.png',
              cssName: 'sprite.less',
              cssFormat: 'less',
              algorithm: 'binary-tree',
              cssVarMap: function(sprite) {
                  sprite.name = sprite.name
              }
          }));

  spriteData.img.pipe(gulp.dest(path.build.sprite));
  spriteData.css.pipe(gulp.dest('../less/elements/'));
});



// build css

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        //.pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefixer())
        //.pipe(cssmin())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});


// build images

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});


// copy fonts

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


// build

gulp.task('build', [
    //'clean',
    'html:build',
    'js:build',
    'sprite:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


// gulp watch

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


// browsersync

gulp.task('webserver', function () {
    browserSync(config);
});


// gulp clean

gulp.task('clean', function (cb) {
    rimraf(path.build.js, cb);
    rimraf(path.build.img, cb);
    rimraf(path.build.fonts, cb);
});


// gulp default task
// build -> webserver -> watch

gulp.task('default', ['build', 'webserver', 'watch']);
