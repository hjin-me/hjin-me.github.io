/**
 * Created by huangjin02 on 13-12-30.
 */
define(['./Sharp.js', 'mmclass'], function (Sharp, mmClass) {

  var Class = mmClass.Class;

  /**
   *
   * @type {*}
   */
  var BorderSharp = Class.extend(Sharp)({

    /**
     *
     * @param $super
     * @param ctx
     * @param {Object} options
     * @param {int} options.borderWidth
     * @param {int} options.borderStyle
     * @param {int} options.borderColor
     * @param {int} options.width
     * @param {int} options.height
     * @param {int} options.left
     * @param {int} options.top
     *
     */
    constructor: function($super, ctx, options) {
      options = options || {};
      $super(ctx, options);
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
    },

    _clear: function () {
      // TODO 默认为透明
      var self = this, ctx = self.ctx, rect = self.capture, borderWidth = self.style.border.width;
      var top = Math.min(rect.top, rect.bottom) - borderWidth - 0.5, left = Math.min(rect.left, rect.right) - borderWidth - 0.5
        , right = Math.max(rect.left, rect.right) + borderWidth + 0.5, bottom = Math.max(rect.top, rect.bottom) + borderWidth + 0.5;

      ctx.clearRect(left, top, right - left, bottom - top);
    },

    _draw: function() {
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

      self.capture = {};
    }
  });


  return BorderSharp;
});