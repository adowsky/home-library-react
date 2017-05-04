'use strict';

import gulp from "gulp";
import concat from "gulp-concat";
import babelify from "babelify";
import browserify from "browserify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import htmlmin from "gulp-htmlmin";
import image from "gulp-image";
import uglify from "gulp-uglify";
import gulpif from "gulp-if";
import browsersync from "browser-sync";
import proxyMiddleware from "http-proxy-middleware";
import cleanCSS from "gulp-clean-css";
import replace from "gulp-string-replace";
import uuid from "uuid/v4";

const basePath = "target/_build/";
const SOURCE_PATH = "";

const PATHS = {
    entryPoint: `${SOURCE_PATH}js/start.jsx`,
    jsOut: `${basePath}js/all.js`,
    cssInput: [
        `${SOURCE_PATH}css/reset.css`,
        `${SOURCE_PATH}css/style.css`
    ],
    cssOutput: `${basePath}css`,
    htmlInput: `${SOURCE_PATH}*.html`,
    imagesInput: `${SOURCE_PATH}/images/`,
    imagesOutput: `${basePath}/images/`,

};
const options = {
    browserify: {
        entries: PATHS.entryPoint,
        extensions: ['.jsx'],
        debug: true
    }
};

const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

gulp.task('prod', () => {
    process.env.NODE_ENV = 'production';
});


let syncInstance = browsersync.create();

gulp.task('build:js', () => {
    return browserify(options.browserify)
        .transform(babelify)
        .bundle()
        .on("error", function (err) {
            console.log("Error : " + err.message);
        })
        .pipe(source(PATHS.jsOut))
        .pipe(buffer())
        .pipe(gulpif(isProduction(), uglify()))
        .pipe(gulp.dest('.'));
});

gulp.task("build:css", () => {
    gulp.src(PATHS.cssInput)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('all.css'))
        .pipe(gulp.dest(PATHS.cssOutput))

});

gulp.task('build:html', () => {
    const version = uuid();
        return gulp.src(PATHS.htmlInput)
            .pipe(replace(/\\?v={version}/g, `?v=${version}`))
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest(basePath));
    }
);

gulp.task('build:images', () => {
    gulp.src(PATHS.imagesInput)
        .pipe(image())
        .pipe(gulp.dest(PATHS.imagesOutput));
});



gulp.task("watch", () => {
    const proxy = proxyMiddleware("/api", {target: "http://localhost:8080/"});
    syncInstance.init({
        server: {
            port: 3000,
            host: 'localhost',
            baseDir: "target/_build",
            online: true,
            middleware: [proxy]
        }
    });
    new Promise(() => {
        gulp.watch(["js/**/*.jsx"], ["js-watch"]);
        gulp.watch(["css/*.css"], ["build:css"]);
        gulp.watch(["**/*.html"], ["html-watch"]);
    });

});


gulp.task("js-watch", ["build:js"], () => syncInstance.reload());
gulp.task("html-watch", ["build:html"], () => syncInstance.reload);

gulp.task('build', ['build:css', 'build:html', 'build:js', 'build:images']);

gulp.task('build:prod', ['prod', 'build:css', 'build:html', 'build:js', 'build:images']);

gulp.task('default', ['build:html', 'build:css', 'build:js', 'watch']);