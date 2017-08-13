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
    build: { // Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        sprite: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { // Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js', // Скрипты
        style: 'src/style/main.less', // Стили
        img: 'src/assets/img/**/*.*', // Картинки
        sprite : 'src/assets/sprite/**/*.*', // и исходники спрайтов в отдельную папку
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less',
        img: 'src/assets/img/**/*.*',
        sprite: 'src/assets/sprite/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};


var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false // внешний доступ отключен
    // port: 3001 // порт по умолчанию
};


// собираем html

gulp.task('html:build', function () {
    gulp.src(path.src.html) // Выберем файлы по нужному пути
        .pipe(rigger()) // Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) // Выплюнем их в папку build
        .pipe(reload({stream: true})); // И перезагрузим наш сервер для обновлений
});


// собираем js библиотеки
/*
gulp.task('js:libs', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'bower_components/jquery-ui/jquery-ui.min.js', // jquery-ui
        'bower_components/slick-carousel/slick/slick.min.js' // и ещё slick...
        ])
        .pipe(gulp.dest(path.build.js)); // Выгружаем в папку app/js
});
*/

// собираем javascript

gulp.task('js:build', function () {
    gulp.src(path.src.js) // Найдем наш main файл
        .pipe(rigger()) // Прогоним через rigger
        .pipe(sourcemaps.init()) // Инициализируем sourcemap
        //.pipe(uglify()) // Сожмем наш js
        .pipe(sourcemaps.write()) // Пропишем карты
        .pipe(gulp.dest(path.build.js)) // Выплюнем готовый файл в build
        .pipe(reload({stream: true})); // И перезагрузим сервер*/
});


// спрайты

gulp.task('sprite:build', function() {
  var spriteData =
      gulp.src(path.src.sprite) // путь, откуда берем картинки для спрайта
          .pipe(spritesmith({
              imgName: 'sprite.png',
              imgPath: '/img/sprite.png',
              cssName: 'sprite.less',
              cssFormat: 'less',
              algorithm: 'binary-tree',
              cssVarMap: function(sprite) {
                  sprite.name = sprite.name
              }
          }));

  spriteData.img.pipe(gulp.dest(path.build.sprite)); // путь, куда сохраняем картинку
  spriteData.css.pipe(gulp.dest('./src/style/elements/')); // путь, куда сохраняем стили
});



// собираем less

gulp.task('style:build', function () {
    gulp.src(path.src.style) // выбираем main.less
        //.pipe(sourcemaps.init()) // То же самое что и с js
        .pipe(less()) // Скомпилируем
        .pipe(prefixer()) // Добавим вендорные префиксы
        .pipe(cssmin()) // Сожмем
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) // И в build
        .pipe(reload({stream: true}));
});


// собираем изображения

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});


// копируем шрифты

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


// build

gulp.task('build', [
    'clean',
    'html:build',
    //'js:libs',
    'js:build',
    'sprite:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


// мониторинг изменений в файлах

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


// запуск browsersync

gulp.task('webserver', function () {
    browserSync(config);
});


// очистка папки build по требованию

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


// таск по умолчанию: сделать экспорт проекта,
// запустить сервер и мониторить изменения

gulp.task('default', ['build', 'webserver', 'watch']);
