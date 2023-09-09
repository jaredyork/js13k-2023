import gulp from 'gulp';
import browserSync from 'browser-sync';

import htmlmin from 'gulp-htmlmin';
import stripImportExport from 'gulp-strip-import-export';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import webp from 'imagemin-webp';
import extReplace from 'gulp-ext-replace';

gulp.task('buildHTML', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dest'));
});

gulp.task('buildJS', () => {
    return gulp.src('./src/js/*.js')
        .pipe(stripImportExport())
        .pipe(concat('game.js'))
        .pipe(terser({
            keep_fnames: true,
            mangle: true
        }))
        .pipe(gulp.dest('./dest'));
});

gulp.task('minImages', () => {
    return gulp.src(['./src/img/**/*.jpg', './src/img/**/*.png'], {base: 'src'})
        .pipe(imagemin([
        webp({
            quality: 60,
        })
        ]))
        .pipe(extReplace('.webp'))
        .pipe(gulp.dest('./dest/'))
});

gulp.task('build', gulp.series('buildHTML', 'buildJS', 'minImages'));

gulp.task('build-watch', gulp.series('build'), function(done) {
    browserSync.reload();
    done();
});

gulp.task('watch', function() {
    browserSync('./src/**', {
        server: {
            baseDir: './dest'
        }
    });

    gulp.watch('./src/**', gulp.series('build-watch'));
});