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
   * @param {int} options.r
   * @param {int} options.x
   * @param {int} options.y
   * @constructor
   */
  function CircleSharp(canvas, options) {
    SharpBase.call(this, canvas, options);

    var self = this;
    self.data.border = {
      width: 1,
      color: '#ffffff'
    };

    self.style.border = {
      get color() {
        return self.data.border.color || '#ffffff';
      },
      set color(val) {
        self.data.border.color = val;
        return self;
      },
      get width() {
        return self.data.border.width || 1;
      },
      set width(val) {
        self.data.border.width = parseFloat(val);
        return self;
      }

    };

    self.data.circle = {
      x: 0,
      y: 0,
      r: 0
    };
    self.style.circle = {
      get x() {
        return self.data.circle.x || 0;
      },
      set x(val) {
        self.data.circle.x = val;

        self.data.rect.left = self.data.circle.x - self.data.circle.r;
        self.data.rect.right = self.canvas.width - self.data.circle.x - self.data.circle.r;

        return self;
      },

      get y() {
        return self.data.circle.y || 0;
      },
      set y(val) {
        self.data.circle.y = val;

        self.data.rect.top = self.data.circle.y - self.data.circle.r;
        self.data.rect.bottom = self.canvas.height - self.data.circle.y - self.data.circle.r;
        return self;
      },

      get r() {
        return self.data.circle.r || 0;
      },
      set r(val) {
        self.data.circle.r = val;

        self.data.rect.left = self.data.circle.x - self.data.circle.r;
        self.data.rect.right = self.canvas.width - self.data.circle.x - self.data.circle.r;
        self.data.rect.top = self.data.circle.y - self.data.circle.r;
        self.data.rect.bottom = self.canvas.height - self.data.circle.y - self.data.circle.r;

        self.data.rect.width = 2 * self.data.circle.r;
        self.data.rect.height = 2 * self.data.circle.r;

        return self;
      }
    }
  }

  // inherit SharpBase
  CircleSharp.prototype = new SharpBase();

  // correct the constructor pointer because it points to Person
  CircleSharp.prototype.constructor = CircleSharp;

  CircleSharp.prototype._clear = function () {
    // TODO 默认为透明
    var self = this, ctx = self.ctx, rect = self.capture, borderWidth = self.style.border.width;

    var top = rect.top - borderWidth - 0.5
      , left = rect.left - borderWidth - 0.5
      , width = Math.abs(rect.width) + 2 * borderWidth + 1
      , height = Math.abs(rect.height) + 2 * borderWidth + 1;

    console.log('rect', rect);
    console.log(top, left, width, height);

    ctx.clearRect(left, top, width, height);
  };

  CircleSharp.prototype._draw = function () {
    var self = this, ctx = self.ctx;

    ctx.beginPath();

    ctx.arc(self.style.circle.x, self.style.circle.y, self.style.circle.r, 0, 2 * Math.PI);

    ctx.strokeStyle = self.style.border.color;
    ctx.lineWidth = self.style.border.width;

    ctx.stroke();
  };

  return CircleSharp;

});