/**
 * Created by huangjin02 on 14-1-8.
 */
define([], function() {

  var squash = {};
  squash.fix = function(img, exif, callback) {
    exif = exif || {};

    var size = 1024;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = canvas.height = size;

    var orientation = exif.Orientation = exif.Orientation || 1;
    var width = exif.PixelXDimension = exif.PixelXDimension || img.width;
    var height = exif.PixelYDimension = exif.PixelYDimension || img.height;

    width /= 2;
    height /= 2;

    if(width > height) {
      canvas.height = Math.ceil(height / width * size);
    } else {
      canvas.width = Math.ceil(width / height * size);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var d = 256;
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    var tmpCtx = tmpCanvas.getContext('2d');

    var verticalSquashRatio = squash.detect(ctx, canvas.height) || 1;
    console.log('vertical squash ratio', verticalSquashRatio);

    if(verticalSquashRatio === 1) {
      setTimeout(function() {
        console.log('no squash');
        callback(img, exif);
      }, 0);
      return ;
    }

    var dw = canvas.width;
    var dh = canvas.height * verticalSquashRatio;
    var sy = 0;
    var dy = 0;
    while (sy < canvas.height) {
      var sx = 0;
      var dx = 0;
      while (sx < canvas.width) {
        console.log(d, dx, dy, dw, dh);
        tmpCtx.clearRect(0, 0, d, d);
        tmpCtx.drawImage(img, -sx, -sy);
        ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dh);
        sx += d;
        dx += dw;
      }
      sy += d;
      dy += dh;
    }
    ctx.restore();

    img = new Image();
    img.onload = function() {

      console.log(img.width, img.height);
      exif.PixelXDimension = img.width;
      exif.PixelYDimension = img.height;
      callback(img, exif);
    };
    img.src = canvas.toDataURL('image/jpeg', 0.9);

  };

  /**
   * Detecting vertical squash in loaded image.
   * Fixes a bug which squash image vertically while drawing into canvas for some images.
   */
  squash.detect = function(ctx, ih) {
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
  };

  return squash;

});