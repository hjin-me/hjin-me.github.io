/**
 * Created by huangjin02 on 13-12-30.
 */
define([], function () {
  var ImageSharp = function (img, ctx) {
    var self = this;

    self.ctx = ctx;

    self.data = {
      orgin: {
        x: '50%',
        y: '50%'
      },
      rect: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        width: img.width,
        height: img.height
      },
      raw: img
    };

    self.style = {
      get left() {
        return self.data.rect.left;
      },
      set left(val) {
        self.data.rect.left = parseFloat(val);
        return self;
      },
      get top() {
        return self.data.rect.top;
      },
      set top(val) {
        self.data.rect.top = parseFloat(val);
        return self;
      },

      get width() {
        return self.data.rect.width;
      },
      set width(val) {
        self.data.rect.width = parseFloat(val);
        self.data.orgin.x = self.data.rect.width / 2;
        return self;
      },
      get height() {
        return self.data.rect.height;
      },
      set height(val) {
        self.data.rect.height = parseFloat(val);
        self.data.orgin.x = self.data.rect.height / 2;
        return self;
      }
    };

    self.capture = {};
    self._lock = {};
  };

  ImageSharp.prototype.lock = function () {
    this._lock.width = this.style.width;
    this._lock.height = this.style.height;
    this._lock.left = this.style.left;
    this._lock.top = this.style.top;
  };

  ImageSharp.prototype.unlock = function () {
    this._lock = null;
  };

  ImageSharp.prototype.scale = function (ratio) {
    // TODO 暂时只支持中心缩放
    var self = this, lock = self._lock;
    self._capture();

    if (!lock) {
      self.lock();
    }


    var center = {
      x: self.style.left + self.style.width / 2,
      y: self.style.top + self.style.height / 2
    };

    self.style.width = lock.width * ratio;
    self.style.height = lock.height * ratio;

    self.style.left = center.x - self.style.width / 2;
    self.style.top = center.y - self.style.height / 2;

    self._clear();
    self._draw();

    if (!lock) {
      self.unlock();
    }
  };

  /**
   *
   * @param x
   * @param [y]
   * @param [z]
   */
  ImageSharp.prototype.translate = function (x, y, z) {
    var self = this, lock = self._lock;
    self._capture();

    if (!lock) {
      self.lock();
    }

    self.style.left = lock.left + x;
    self.style.top = lock.top + y;

    self._clear();
    self._draw();

    if (!lock) {
      self.unlock();
    }
  };

  /**
   *
   * @param x
   * @param [y]
   * @param [z]
   */
  ImageSharp.prototype.translateTo = function (x, y, z) {
    var self = this, lock = self._lock;
    self._capture();

    if (!lock) {
      self.lock();
    }

    self.style.left = x;
    self.style.top = y;

    self._clear();
    self._draw();

    if (!lock) {
      self.unlock();
    }
  };

  ImageSharp.prototype.draw = function () {
    this._draw();
  };

  ImageSharp.prototype._capture = function () {
    for (var i in this.data.rect) {
      if (this.data.rect.hasOwnProperty(i)) {
        this.capture[i] = this.data.rect[i];
      }
    }
    console.dir(this.data);
    console.dir(this.capture);
  };

  ImageSharp.prototype._clear = function () {
    // TODO 默认为透明
    var self = this, ctx = self.ctx, rect = self.capture;
    ctx.clearRect(rect.left - 0.5, rect.top - 0.5, rect.width + 1, rect.height + 1);
    self.capture = {};
  };

  ImageSharp.prototype._draw = function () {
    var self = this;

    var sx = 0, sy = 0, sw = self.data.raw.width, sh = self.data.raw.height
      , dx = self.style.left, dy = self.style.top, dw = self.style.width, dh = self.style.height;

    self.ctx.drawImage(self.data.raw, sx, sy, sw, sh, dx, dy, dw, dh);
  };

  return ImageSharp;
});