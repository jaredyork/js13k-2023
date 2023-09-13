import gulp from 'gulp';
import browserSync from 'browser-sync';

import fs from 'fs';
import babel from 'gulp-babel';
import htmlmin from 'gulp-htmlmin';
import stripImportExport from 'gulp-strip-import-export';
import terser from 'gulp-terser';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import webp from 'imagemin-webp';
import order from 'gulp-order';
import concat from 'gulp-concat';
import extReplace from 'gulp-ext-replace';
import zip from 'gulp-zip';
import advzip from 'gulp-advzip';
import micro from 'gulp-micro';
import size from 'gulp-size';

gulp.task('buildHTML', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dest'));
});

gulp.task('buildJS', () => {
    return gulp.src('./src/js/*.js')
        .pipe(stripImportExport())

        .pipe(order([
            'src/js/class-tile.js',
            'src/js/class-brick-tile.js',
            'src/js/class-dirt-tile.js',
            'src/js/class-stone-tile.js',
            'src/js/class-grass-tile.js',
            'src/js/class-jewel-tile.js',
            'src/js/class-crown-tile.js',
            'src/js/class-entity.js',
            'src/js/class-particle.js',
            'src/js/class-person.js',
            'src/js/class-knight.js',
            'src/js/class-archer.js',
            'src/js/class-cloud.js',
            'src/js/class-scene.js',
            'src/js/class-scene-main.js',
            'src/js/class-scene-main-menu.js',
            'src/js/class-scene-gameover.js',
            'src/js/class-game.js',
            'src/js/functions.js',
            'src/js/init.js'
        ], { base: './' }))
        .pipe(concat('init.js'))
        .pipe(terser({
            mangle: {
                eval: true,
                toplevel: true
            },
            compress: {
                ecma: 2016,
                passes: 5
            },
            module: false,
            toplevel: true
        }))
        .pipe(gulp.dest('./dest/js'));
});

gulp.task('minImages', () => {
    return gulp.src(['./src/images/**/*.jpg', './src/images/**/*.png'], {base: 'src'})
        .pipe(imagemin([
        webp({
            quality: 100,
            alphaQuality: 0,
            lossless: true,
            method: 6
        })
        ]))
        .pipe(extReplace('.webp'))
        .pipe(gulp.dest('./dest'))
});

gulp.task('zip', () => {
    return gulp.src('./dest/**/*')
        .pipe(zip('game.zip'))
        .pipe(advzip({
            optimizationLevel: 4,
            iterations: 10
          }))
        .pipe(size())
        .pipe(micro({limit: 13 * 1024}))
        .pipe(gulp.dest('./game.zip'));
});

gulp.task('build', gulp.series('buildHTML', 'buildJS', 'minImages', 'zip'));

gulp.task('browser-sync', (done) => {
    browserSync.reload();
    done();
});

gulp.task('watch', function() {
    browserSync('./src/**', {
        server: {
            baseDir: './dest'
        }
    });

    gulp.watch('./src/**', gulp.series('build', 'zip'));
});