var gulp = require("gulp");
var nodemon = require("gulp-nodemon");


gulp.task('run', function name() {
    var configuration = {
        script: 'app.js',
        ext: 'js',
        env : {
            PORT: 3001
        },
        ignore: ['./node_modules/**']
    };

    nodemon(configuration).on('restart', function name() {
        console.log('Restarting Server .')
    });

});



