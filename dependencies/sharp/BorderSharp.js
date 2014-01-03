/**
 * Created by huangjin02 on 13-12-30.
 */
define(['./SharpBase'], function (SharpBase) {

  /**
   *
   * @param canvas
   * @param {Object} options
   * @param {int} options.borderWidth
   * @param {int} options.borderStyle
   * @param {int} options.borderColor
   * @param {int} options.width
   * @param {int} options.height
   * @param {int} options.left
   * @param {int} options.top
   * @constructor
   */
  function BorderSharp(canvas, options) {

    SharpBase.call(this, canvas, options);

    var self = this;
    self.data.border = {};
    self.style.border = {
      get color() {
        return self.data.border.color;
      },
      set color(val) {
        self.data.border.color = val;
        return self;
      },
      get width() {
        return self.data.border.width;
      },
      set width(val) {
        self.data.border.width = parseFloat(val);
        return self;
      }
    };
  }

  // inherit SharpBase
  BorderSharp.prototype = new SharpBase();

  // correct the constructor pointer because it points to Person
  BorderSharp.prototype.constructor = BorderSharp;

  BorderSharp.prototype._clear = function () {

    var self = this, ctx = self.ctx, rect = self.capture, borderWidth = self.style.border.width;

    if(!rect) {
      return ;
    }

    var top = rect.top - borderWidth - 0.5
      , left = rect.left - borderWidth - 0.5
      , width = Math.abs(rect.width) + 2 * borderWidth + 1
      , height = Math.abs(rect.height) + 2 * borderWidth + 1;

    console.log('rect', rect);
    console.log(top, left, width, height);

    ctx.clearRect(left, top, width, height);
  };

  BorderSharp.prototype._draw = function () {
    var self = this, ctx = self.ctx;
    ctx.beginPath();
    ctx.moveTo(self.style.left, self.style.top);
    ctx.lineTo(self.style.left, self.style.top + self.style.height);
    ctx.lineTo(self.style.left + self.style.width, self.style.top + self.style.height);
    ctx.lineTo(self.style.left + self.style.width, self.style.top);
    ctx.lineTo(self.style.left, self.style.top);

    ctx.strokeStyle = self.style.border.color;
    ctx.lineWidth = self.style.border.width;

    ctx.stroke();
  };

  return BorderSharp;

});