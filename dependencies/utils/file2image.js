/**
 * Created by huangjin02 on 14-1-3.
 */
define([], function() {

  var file2image = function(selector) {
    var self = this;
    self.events = [];

    if(selector instanceof Element) {
      self.el = selector;
    } else {
      self.el = document.querySelector(selector);
    }

    self.el.addEventListener('change', function() {
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

          self.trigger(img);
        };

        img.src = this.result;
      };

      fr.readAsDataURL(this.files[0]);
    });

  };

  file2image.prototype.onChange = function(cb) {
    if(typeof cb === 'function') {
      this.events.push(cb);
    }
  };

  file2image.prototype.trigger = function(img) {
    for(var i = 0, n = this.events.length; i < n; i++) {
      this.events[i].call(this.el, img);
    }
  };


  return file2image
});