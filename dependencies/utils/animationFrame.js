/**
 * Created by huangjin02 on 13-12-30.
 */
define([], function() {
  var lastTime = 0;
  var requestAnimationFrame, cancelAnimationFrame;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
      || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!requestAnimationFrame)
    requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!cancelAnimationFrame)
    cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };

  return {
    /**
     * @function requestAnimationFrame
     * @param {Function}
     * @return {*}
     */
    requestAnimationFrame: requestAnimationFrame,
    /**
     * @function cancelAnimationFrame
     * @param {*}
     */
    cancelAnimationFrame: cancelAnimationFrame
  }
});