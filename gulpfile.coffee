gulp = require('gulp')
sass = require('gulp-sass')(require('sass'))
autoprefixer = require('gulp-autoprefixer')
coffee = require('gulp-coffee')
sourcemaps = require('gulp-sourcemaps')
plumber = require('gulp-plumber')
debug = require('gulp-debug')
pug = require('gulp-pug')
pugRef = require('pug')
notify = require('gulp-notify')
browserSync = require('browser-sync').create()

srcPath = 'src/'
sassDestDir = 'sass'
cssDestDir = 'css'
viewPath = 'sample/'
csDestDir = 'cs'
jsDestDir = 'js'
destPath = 'dist/'

gulp.task 'webserver', (done)->
  browserSync.init(
    server: ''
    index: 'sample/index.html'
  )

  done()

pugRef.filters.php = (block) ->
  return '\n<?php\n'+block+'\n?>'

gulp.task 'sass', ()->
  gulp.src [ srcPath+sassDestDir+'/**/*.scss']
    .pipe debug(title: 'start sass:')
    .pipe plumber(
      errorHandler:
        notify.onError(
          title: 'sass compile error'
          message: '<%= error %>'
        )
    )
    .pipe sourcemaps.init()
    .pipe sass({
      precision: 10
      outputStyle: 'expanded'
    })
    .pipe sourcemaps.write(
      ''
      includeContent: false
      sourceRoot: '../../'+srcPath+sassDestDir+'/'
    )
    .pipe debug(title: 'end sass:')
    .pipe gulp.dest(destPath+cssDestDir+'/')
    .pipe browserSync.stream()

gulp.task 'autoprefixer', ()->
  gulp.src [ destPath+cssDestDir+'/'+'**/*.css']
    .pipe debug(title: 'start autoprefixer:')
    .pipe autoprefixer()
    .pipe debug(title: 'end autoprefixer:')
    .pipe gulp.dest(destPath+cssDestDir+'/')
    .pipe browserSync.stream()

gulp.task 'pug', ()->
  gulp.src srcPath+'pug/**/[^_]*.pug'
    .pipe debug(title: 'start pug:')
    .pipe plumber(
      errorHandler:
        notify.onError(
          title: 'pug compile error'
          message: '<%= error %>'
        )
    )
    .pipe pug(
      pretty: true
    )
    .pipe gulp.dest(viewPath)
    .pipe debug(title: 'end pug:')
    .on('end',
      ()->
        browserSync.reload()
    )

gulp.task 'coffee', ()->
  gulp.src srcPath+csDestDir+'/*.coffee'
    .pipe debug(title: 'start coffee:')
    .pipe plumber(
      errorHandler:
        notify.onError(
          title: 'coffee compile error'
          message: '<%= error %>'
        )
    )
    .pipe debug(title: 'start lint:')
    .pipe debug(title: 'end lint:')
    .pipe sourcemaps.init()
    .pipe coffee(
      bare: true
    )
    .pipe sourcemaps.write(
      './'
      sourceRoot: '../../'+srcPath+csDestDir+'/'
    )
    .pipe gulp.dest(destPath+jsDestDir+'/')
    .pipe debug(title: 'end coffee:')
    .on('end',
      ()->
        browserSync.reload()
    )

gulp.task 'watch', (done)->
  gulp.watch srcPath+sassDestDir+'/**/*.scss', gulp.series('sass', 'autoprefixer')

  gulp.watch [srcPath+csDestDir+'/*.coffee'], gulp.task('coffee')

  gulp.watch srcPath+'pug/**/*.pug', gulp.task('pug')

  done()

gulp.task 'build', gulp.series('sass', 'autoprefixer', 'pug', 'coffee')

gulp.task 'default', gulp.parallel('webserver', 'watch')
