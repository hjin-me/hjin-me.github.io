/**
 * Created by huangjin02 on 13-12-30.
 */
define(['utils'], function (utils) {

  function isEmpty(obj) {
    for(var i in obj) {
      if(obj.hasOwnProperty(i)) {
        return false;
      }
    }

    return true;
  }

  function SharpBase(canvas, options) {
    options = options || {};
    var self = this;
    if(canvas) {
      self.canvas = canvas;
      self.ctx = canvas.getContext('2d');
    }

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
        width: options.width || 0,
        height: options.height || 0
      },
      raw: options
    };

    self.style = {
      get left() {
        return self.data.rect.left;
      },
      set left(val) {
        if (!self.capture.hasOwnProperty('left')) {
          self.capture.left = self.data.rect.left
        }

        self.data.rect.left = parseFloat(val);
        self.data.rect.right = self.canvas.width - self.data.rect.width - self.data.rect.left;
        // return self;
      },

      get top() {
        return self.data.rect.top;
      },
      set top(val) {
        if (!self.capture.hasOwnProperty('top')) {
          self.capture.top = self.data.rect.top
        }

        self.data.rect.top = parseFloat(val);
        self.data.rect.bottom = self.canvas.height - self.data.rect.height - self.data.rect.top;
        // return self;
      },

      get width() {
        return self.data.rect.width;
      },
      set width(val) {
        if (!self.capture.hasOwnProperty('width')) {
          self.capture.width = self.data.rect.width
        }

        self.data.rect.width = parseFloat(val);
        self.data.rect.right = self.canvas.width - self.data.rect.width - self.data.rect.left;
        // self.data.orgin.x = self.data.rect.width / 2;
        // return self;
      },

      get height() {
        return self.data.rect.height;
      },
      set height(val) {
        if (!self.capture.hasOwnProperty('height')) {
          self.capture.height = self.data.rect.height
        }

        self.data.rect.height = parseFloat(val);
        self.data.rect.bottom = self.canvas.height - self.data.rect.height - self.data.rect.top;
        // self.data.orgin.x = self.data.rect.height / 2;
        // return self;
      },

      get right() {
        return self.data.rect.right;
      },
      set right(val) {
        if (!self.capture.hasOwnProperty('right')) {
          self.capture.right = self.data.rect.right
        }

        self.data.rect.right = parseFloat(val);
        self.data.rect.width = self.canvas.width - self.data.rect.right - self.data.rect.left;
      },

      get bottom() {
        return self.data.rect.bottom;
      },
      set bottom(val) {
        if (!self.capture.hasOwnProperty('bottom')) {
          self.capture.bottom = self.data.rect.bottom
        }
        self.data.rect.bottom = parseFloat(val);
        self.data.rect.height = self.canvas.height - self.data.rect.bottom - self.data.rect.top;

        return self;
      }
    };

    self.capture = {};
    self._lock = {};
    self._renderFrame = 0;
  }

  SharpBase.prototype.lock = function () {
    this._lock = {};
    this._lock.width = this.style.width;
    this._lock.height = this.style.height;
    this._lock.left = this.style.left;
    this._lock.top = this.style.top;
    this._lock.right = this.style.right;
    this._lock.bottom = this.style.bottom;
  };
  SharpBase.prototype.unlock = function () {
    this._lock = null;
  };

  SharpBase.prototype.scale = function (ratio) {
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

    self.refresh();

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
  SharpBase.prototype.translate = function (x, y, z) {
    var self = this, lock = self._lock;
    self._capture();

    if (!lock) {
      self.lock();
    }

    self.style.left = lock.left + x;
    self.style.top = lock.top + y;

    self.refresh();

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
  SharpBase.prototype.translateTo = function (x, y, z) {
    var self = this, lock = self._lock;
    self._capture();

    if (!lock) {
      self.lock();
    }

    self.style.left = x;
    self.style.top = y;

    self.refresh();

    if (!lock) {
      self.unlock();
    }
  };

  SharpBase.prototype.draw = function () {
    var self = this;
    utils.requestAnimationFrame(function(ts) {
      console.log('rect', self.data.rect);
      self._draw();
      self.capture = {};
    });
  };

  SharpBase.prototype.refresh = function () {
    var self = this;
    self._renderFrame ++;

    utils.requestAnimationFrame(function(ts) {

      if(self._renderFrame > 0) {
        console.log('renderFrame', self._renderFrame);
        self._clear();
        self._draw();
        self.capture = {};
        self._renderFrame = 0;
      } else {
        console.log('render 0 ')
      }
    });
  };

  SharpBase.prototype._capture = function () {
    if(!isEmpty(this.capture)) {
      return ;
    }
    this.capture = {};
    for (var i in this.data.rect) {
      if (this.data.rect.hasOwnProperty(i)) {
        this.capture[i] = this.data.rect[i];
      }
    }
  };

  SharpBase.prototype._clear = function () {
    // TODO 默认为透明
    var self = this, ctx = self.ctx, rect = self.capture;
    if(!rect) {
      return ;
    }
    ctx.clearRect(rect.left - 0.5, rect.top - 0.5, rect.width + 1, rect.height + 1);
  };

  SharpBase.prototype._draw = function () {
    var self = this;

    var sx = 0, sy = 0, sw = self.data.raw.width, sh = self.data.raw.height
      , dx = self.style.left, dy = self.style.top, dw = self.style.width, dh = self.style.height;

    self.ctx.drawImage(self.data.raw, sx, sy, sw, sh, dx, dy, dw, dh);
  };

  return SharpBase;
});