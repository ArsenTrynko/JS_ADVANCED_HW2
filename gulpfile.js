const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const image = require('gulp-image');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');


const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'build'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/styles'
    },
    images: {
        src: 'src/IMG/*.*',
        dest: 'build/IMG'
    }

};


function browser(done) {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    })
    done();
    
}

function browserReload(done){
    browserSync.reload();
    done();
}

function buildCSS(){
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error',sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

function buildHTML(){
    return gulp.src(paths.pug.src)
        .pipe(pug())
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browserSync.stream())
}   

function buildIMG(){
    return gulp.src(paths.images.src)
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream())
}


function watch(){
    gulp.watch(paths.styles.src,buildCSS)
    gulp.watch(paths.pug.src,buildHTML)
    gulp.watch(paths.images.src,buildIMG) 
}

function cleanBuild(){
    return gulp.src('build',{read:false, allowEmpty:true})
        .pipe(clean())
}

const build = gulp.series(cleanBuild,gulp.parallel(buildCSS,buildHTML,buildIMG));

gulp.task('build',build)


gulp.task('default',gulp.parallel(watch,build,browser))



