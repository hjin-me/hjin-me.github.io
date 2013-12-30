/**
 * Created by huangjin02 on 13-12-30.
 */
define(['./Sharp', 'mmclass'], function (Sharp, mmClass) {

  var Class = mmClass.Class;

  /**
   *
   * @type {*}
   */
  var CircleSharp = Class.extend(Sharp)({

    /**
     *
     * @param $super
     * @param ctx
     * @param {Object} options
     * @param {int} options.borderWidth
     * @param {int} options.borderStyle
     * @param {int} options.borderColor
     * @param {int} options.r
     * @param {int} options.x
     * @param {int} options.y
     *
     */
    constructor: function($super, ctx, options) {
      options = options || {};
      $super(ctx, options);
      var self = this;
      self.data.border = {};

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

      self.data.circle = {};
      self.style.circle = {
        get x() {
          return self.data.circle.x || 0;
        },
        set x(val) {
          self.data.circle.x = val;

          self.data.rect.left = self.data.circle.x - self.data.circle.r;
          self.data.rect.right = self.data.circle.x + self.data.circle.r;

          return self;
        },
        get y() {
          return self.data.circle.y || 0;
        },
        set y(val) {
          self.data.circle.y = val;

          self.data.rect.top = self.data.circle.y - self.data.circle.r;
          self.data.rect.bottom = self.data.circle.y + self.data.circle.r;
          return self;
        },
        get r() {
          return self.data.circle.r || 0;
        },
        set r(val) {
          self.data.circle.r = val;

          self.data.rect.left = self.data.circle.x - self.data.circle.r;
          self.data.rect.right = self.data.circle.x + self.data.circle.r;
          self.data.rect.top = self.data.circle.y - self.data.circle.r;
          self.data.rect.bottom = self.data.circle.y + self.data.circle.r;

          self.data.rect.width = 2 * self.data.circle.r;
          self.data.rect.height = 2 * self.data.circle.r;

          return self;
        }
      }
    },

    _clear: function () {
      // TODO 默认为透明
      var self = this, ctx = self.ctx, rect = self.capture, borderWidth = self.style.border.width;

      var top = Math.min(rect.top, rect.bottom) - borderWidth - 0.5, left = Math.min(rect.left, rect.right) - borderWidth - 0.5
        , right = Math.max(rect.left, rect.right) + borderWidth + 0.5, bottom = Math.max(rect.top, rect.bottom) + borderWidth + 0.5;

      console.log('rect', rect);
      console.log(top, left, bottom, right);

      ctx.clearRect(left, top, right - left, bottom - top);
    },

    _draw: function() {
      var self = this, ctx = self.ctx;

      ctx.beginPath();

      ctx.arc(self.style.circle.x, self.style.circle.y, self.style.circle.r, 0, 2 * Math.PI);

      ctx.strokeStyle = self.style.border.color;
      ctx.lineWidth = self.style.border.width;

      ctx.stroke();

      self.capture = {};
    }
  });


  return CircleSharp;
});