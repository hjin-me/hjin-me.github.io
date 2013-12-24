/**
 * Created by huangjin02 on 13-12-24.
 */
(function(){

  var filePicker = document.getElementById('take_pic');
  var partials = [
    document.getElementById('canvas_partial_1'),
    document.getElementById('canvas_partial_2'),
    document.getElementById('canvas_partial_3'),
    document.getElementById('canvas_partial_4')
  ];

  var output = document.getElementById('canvas');

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
        renderPartialImage(1, img, 150);
        renderPartialImage(2, img, 150);
        renderPartialImage(3, img, 150);
        renderPartialImage(4, img, 150);
      };
      img.src = this.result;
      raw_image.src = this.result;

    };

    fr.readAsDataURL(this.files[0]);

  });

  function renderPartialImage(id, img, rawSize) {

    var canvas = document.getElementById('canvas_partial_' + id);

    var ctx = canvas.getContext('2d');

    var size = Math.min(rawSize, Math.max(img.width, img.height));

    var sx = 0, sy = 0, sw = size, sh = size, dx = 0, dy = 0, dw = 300, dh = 300;


    console.log(sx, sy, sw, sh, dx, dy, dw, dh);

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

    console.log('render size : ' + size + '; raw size is : ' + rawSize);
  }


  function oneByOne() {

  }

}());
