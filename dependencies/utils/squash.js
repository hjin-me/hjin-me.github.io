/**
 * Created by huangjin02 on 14-1-8.
 */
define([], function() {

  var squash = {};
  squash.fix = function(img, exif, callback) {
    console.log('natural', img.naturalWidth, img.naturalHeight);
    console.log('normal', img.width, img.height);

    exif = exif || {};

    var size = 1024;
    var canvas = document.getElementById('test');
    var ctx = canvas.getContext('2d');
    canvas.width = canvas.height = size;

    var orientation = exif.Orientation = exif.Orientation || 1;
    var width = img.naturalWidth;
    var height = img.naturalHeight;

    if(squash.detectSubsampling(img)) {
      width /= 2;
      height /= 2;
    }

    if(width > height) {
      canvas.height = Math.ceil(height / width * size);
    } else {
      canvas.width = Math.ceil(width / height * size);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var d = size / 2;
    var tmpCanvas = document.getElementById('test-tmp');
    tmpCanvas.width = d;
    tmpCanvas.height = d;
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    //squash.transformCoordinate(canvas, width, height, orientation);

    var dw = d * canvas.width / width;
    var dh = d * canvas.height / height;
    var sy = 0;
    var dy = 0;
    // var p = 0, k = 0;
    //while (p < 1) {
    while (sy < img.height) {

      var sx = 0;
      var dx = 0;
      //while(k < 2) {
      while (sx < img.width) {
        console.log( dx, dy, dw, dh);
        tmpCtx.clearRect(0, 0, d, d);
        tmpCtx.drawImage(img, -sx, -sy);
        ctx.drawImage(tmpCanvas, 0, 0, d, d, dx, dy, dw, dw);
        sx += d;
        dx += dw;
        // k ++;
      }

      sy += d;
      dy += dw;
      // p ++

    }
    // ctx.restore();

    img = new Image();
    img.onload = function() {

      console.log('toDataURL', img.width, img.height);

      exif.PixelXDimension = img.width;
      exif.PixelYDimension = img.height;

      callback(img, exif);
    };
    img.src = canvas.toDataURL('image/jpeg', 1);

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
  /**
   * Detect subsampling in loaded image.
   * In iOS, larger images than 2M pixels may be subsampled in rendering.
   */
  squash.detectSubsampling = function(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, -iw + 1, 0);
      // subsampled image becomes half smaller in rendering size.
      // check alpha channel value to confirm image is covering edge pixel or not.
      // if alpha value is 0 image is not covering, hence subsampled.
      return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
    } else {
      return false;
    }
  };

  return squash;

});