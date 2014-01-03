/**
 * Created by huangjin02 on 13-12-30.
 */
define(['./animationFrame', './file2image', 'underscore'], function (animateFrame, file2image, _) {
  var utils = {};

  utils = _.extend(utils, animateFrame);
  utils.file2image = file2image;

  return utils;
});