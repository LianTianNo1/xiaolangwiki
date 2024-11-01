const gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    htmlclean = require('gulp-htmlclean'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel')

// 压缩css文件
gulp.task('minify-css', function (done) {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .on('error', e => done(e))
        .pipe(gulp.dest('./public'))
})

// 压缩html文件
gulp.task('minify-html', function (done) {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .on('error', e => done(e))
        .pipe(htmlmin({
            continueOnParseError: true,
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .on('error', e => done(e))
        .pipe(gulp.dest('./public'))
})

// 压缩js文件
gulp.task('minify-js', function (done) {
    return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
        .pipe(babel({
            //将ES6代码转译为可执行的JS代码
            // presets: ['es2015'] // es5检查机制
            presets: ["@babel/preset-env"]
        }))
        .on('error', e => done(e))
        .pipe(uglify())
        .on('error', e => done(e))
        .pipe(gulp.dest('./public'))
})

// 压缩 public/images 目录内图片(Version>3)
gulp.task('minify-images', function (done) {
    const opts = { verbose: true }
    gulp.src('./public/images/**/*.*')
        .pipe(imageMinify = imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 70, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }, { cleanupIDs: false }] })
        ], opts))
        .on('error', e => done(e))
        .pipe(gulp.dest('./public/images'))
    // .on('end', () => done())
    done()
})

//4.0以前的写法
//gulp.task('default', ['minify-html', 'minify-css', 'minify-js', 'minify-images'])
//4.0以后的写法
// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.series(gulp.parallel('minify-html', 'minify-css', 'minify-js', 'minify-images')))
