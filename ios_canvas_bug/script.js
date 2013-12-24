/**
 * Created by huangjin02 on 13-12-24.
 */
(function(){

  var filePicker = document.getElementById('take_pic');
  var raw_image = document.getElementById('raw_image');

  filePicker.addEventListener('change', function (e) {

    if(!this.files[0]) {
      alert('未选择文件')
    }

    if(this.files[0].type.indexOf('image/jp') === -1) {
      alert('请选择 jpeg 格式图片');
    }

    var fr = new FileReader();

    fr.onload = function() {

      var img = new Image();
      img.onload = function() {
        renderAllImage(img);
        [300, 600, 1200, 1800, 2000, 2200, 2400, 3000, 3263].forEach(function(size) {
          console.log('prepare render size (' + size + ')');
          renderPartialImage(img, size);
        });
        console.log('end');
      };
      img.src = this.result;
      raw_image.src = this.result;

    };

    fr.readAsDataURL(this.files[0]);

  });

  function renderAllImage(img) {
    var canvasFull = document.getElementById('canvas_full');

    var ctx = canvasFull.getContext('2d');

    var sx = 0, sy = 0, sw = img.width, sh = img.height, dx = 0, dy = 0, dw, dh;
    var horizontal = img.width > img.height;

    if (horizontal) {
      // 图片是水平的
      dw = 300;
      dh = dw / sw * sh;

      canvasFull.style.height = dh + 'px';

    } else {
      // 图片是垂直的
      dh = 300;
      dw = sw / sh * dh;

      canvasFull.style.width = dw + 'px';
    }
    console.log(sx, sy, sw, sh, dx, dy, dw, dh);

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

  }

  function renderPartialImage(img, rawSize) {
    var canvasPartial = document.getElementById('canvas_partial_' + rawSize);

    if(!canvasPartial) {
      console.warn('element not found. ' + rawSize);
      return ;
    }

    var ctx = canvasPartial.getContext('2d');

    var size = Math.min(rawSize, Math.max(img.width, img.height));

    var sx = 0, sy = 0, sw = size, sh = size, dx = 0, dy = 0, dw = 300, dh = 300;


    console.log(sx, sy, sw, sh, dx, dy, dw, dh);

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

    console.log('render size : ' + size + '; raw size is : ' + rawSize);
  }


  function oneByOne() {

  }

}());
