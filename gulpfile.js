var gulp = require('gulp'),
plugins = require('gulp-load-plugins')(),
pack = require('./package.json'),
port = 8989;
var del = require('del');

pack.dist = 'dist';

gulp.task('server', [/*"watch"*/], function () {
  plugins.connect.server({
    root: ['bower_components', '.tmp', 'src', 'demo'],
    port: port,
    livereload: true
  });
  plugins.bower()
  .on('end',function(){
    require('opn')('http://localhost:' + port + '/')
  });
});

var buildConactScript = function( scripts, output ){
  return gulp.src(scripts)
             .pipe(plugins.concat(output))
             .pipe(plugins.uglify())
             .pipe(plugins.header('//author: <%= author %>\n//verion: <%= version %>\n',{author:pack.author,version:pack.version}));
};

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('build', ['clean'], function(){

  buildConactScript([
      'src/js/intro.prefix',
      'src/js/guid.js',
      'src/js/config.js',
      'src/js/util.js',
      'src/js/urlUtils.js',
      'src/js/EventObserver.js',
      'src/js/StateManager.js',
      'src/js/builder.js',
      'src/js/processor/MethodProcessor.js',
      'src/js/processor/RegisterMsgProcessor.js',
      'src/js/processor/UnregisterMsgProcessor.js',
      'src/js/processor/EventMsgProcessor.js',
      'src/js/processor/StateProcessor.js',
      'src/js/frameObserver.js',
      'src/js/outro.suffix'
  ], "frameObserver.js")
    .pipe(gulp.dest( pack.dist ));

});
/*gulp.task('watch',function(){
  gulp.watch('./src/*.js', ['js']);
});*/
gulp.task('default', ['build']);
