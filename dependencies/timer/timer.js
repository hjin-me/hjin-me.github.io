/**
 * Created by huangjin02 on 13-12-25.
 */

define([], function() {
  var arr = {};

  var getTime = function() {
    return Date.now();
  } ;

  if( window.performance && performance.now) {
    getTime = function(){
      return performance.now();
    };
  }

  var timer = function () {
  };

  timer.start = function(name) {
    if(arr.hasOwnProperty(name)) {
      throw new Error('name duplicate');
    }

    arr[name] = {
      start: getTime(),
      end: null,
      time: null
    };
    window.console && console.time && console.time(name);
  };
  timer.end = function(name) {
    if(!arr.hasOwnProperty(name)) {
      console.warn('no timer named ' + name);
      return null;
    }

    arr[name].end = getTime();
    window.console && console.timeEnd && console.timeEnd(name);
    arr[name].time = arr[name].end - arr[name].start;

    return arr[name].time;
  };

  window.timer = new timer;

  return timer;

});



