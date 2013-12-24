/**
 * Created by huangjin02 on 13-12-24.
 */
(function () {

  var file_picker = document.getElementById('take_pic');
  var raw_image = document.getElementById('raw_image');


  file_picker.addEventListener('change', function (e) {

    if(!this.files[0]) {
      alert('未选择文件');
    }

    if(this.files[0].type.indexOf('image/jp') === -1) {
      alert('请选择 jpeg 格式图片');
    }

    var fr = new FileReader();

    fr.onload = function() {
      var data;
      try {
        data = Exif.loadFromArrayBuffer(this.result);
      } catch(e) {
        print(e._stack);
        return ;
      }

      print(data);

    };

    fr.readAsArrayBuffer(this.files[0]);

    var fr2 = new FileReader();

    fr2.onload = function() {
      raw_image.src = this.result;
    };

    fr2.readAsDataURL(this.files[0]);

  });

  function print(data) {
    var output = document.getElementById('exif');

    output.innerHTML = JSON.stringify(data, null, 2);
  }
}());