/**
 * Created by huangjin02 on 13-12-30.
 */
define(['./Sharp', 'mmclass'], function (Sharp, mmClass) {

  var Class = mmClass.Class;
  var ImageSharp = Class.extend(Sharp)({

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
    },

    _clear: function () {
      // TODO 默认为透明
      var self = this, ctx = self.ctx, rect = self.capture;
      ctx.clearRect(rect.left - 0.5, rect.top - 0.5, rect.width + 1, rect.height + 1);
    },
    _draw: function () {
      var self = this;

      var sx = 0, sy = 0, sw = self.data.raw.width, sh = self.data.raw.height
        , dx = self.style.left, dy = self.style.top, dw = self.style.width, dh = self.style.height;

      self.ctx.drawImage(self.data.raw, sx, sy, sw, sh, dx, dy, dw, dh);
      self.capture = {};
    }
  });

  return ImageSharp;

});