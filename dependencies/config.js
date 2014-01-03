/**
 * Created by huangjin02 on 14-1-3.
 */
define([], function() {
  requirejs.config({
    baseUrl: '/',
    paths: {
      'mmclass': '/dependencies/mmclass/dist/class'
    },
    packages: [
      {
        name: 'utils',
        location: '/dependencies/utils',
        main: 'main'
      },
      {
        name: 'zrender',
        location: '/dependencies/zrender/src/',
        main: 'zrender'
      }
      ,
      {
        name: 'exif',
        location: 'dependencies/exif',
        main: 'exif'
      }
      ,
      {
        name: 'timer',
        location: 'dependencies/timer',
        main: 'timer'
      }
      ,
      {
        name: 'touch',
        location: 'dependencies/touch',
        main: 'touch-0.2.9'
      }
      , {
        name: 'underscore',
        location: 'dependencies/underscore',
        main: 'underscore'
      }
    ],
    shim: {
      touch: {
        deps: ['underscore'],
        exports: 'touch'
      },
      underscore: {
        exports: '_'
      }
    },
    urlArgs: "__ts={{DATE}}"
  });
});