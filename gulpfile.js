"use strict";

const gulp = require('gulp');
const mocha = require('gulp-mocha');

const config = {
    paths: {
        skills :{
            pokedex: 'public/skills/pokedex/'
        },
        tests: 'specs/*.spec.js'
    }
}

gulp.task('test', function() {
    gulp.src(config.paths.tests)
        .pipe(mocha());
});

gulp.task('default', ['test']);