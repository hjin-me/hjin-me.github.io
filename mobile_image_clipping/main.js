requirejs.config({
  baseUrl: '/',
  paths: {
    'mmclass': '/dependencies/mmclass/dist/class'
  },
  packages: [
    {
      name: 'utils',
      location: '/dependencies/utils',
      main: 'main'
    },
    {
      name: 'zrender',
      location: '/dependencies/zrender/src/',
      main: 'zrender'
    }
    ,
    {
      name: 'exif',
      location: 'dependencies/exif',
      main: 'exif'
    }
    ,
    {
      name: 'timer',
      location: 'dependencies/timer',
      main: 'timer'
    }
    ,
    {
      name: 'touch',
      location: 'dependencies/touch',
      main: 'touch-0.2.9'
    }
    , {
      name: 'underscore',
      location: 'dependencies/underscore',
      main: 'underscore'
    }
  ],
  shim: {
    touch: {
      deps: ['underscore'],
      exports: 'touch'
    },
    underscore: {
      exports: '_'
    }
  },
  urlArgs: "__ts={{DATE}}"
});

require(['timer', 'exif', 'touch', 'utils', '/mobile_image_clipping/ImageSharp.js', '/mobile_image_clipping/BorderSharp.js'], function (timer, EXIF, touch, utils, ImageSharp, BorderSharp) {

  var targetImg = new Image();
  targetImg.onload = function () {
    clippingInterface(targetImg);
    gestureInterface(targetImg);
  };
  targetImg.src = '/images/beauty.jpg';

  function touchInterface(img) {
    var touchCanvas = document.querySelector('#ps-lite-touch canvas');
    var ctx = touchCanvas.getContext('2d');

    var dx = 0, dy = 0, dw = touchCanvas.width, dh = touchCanvas.height;

    if (img.width > img.height) {
      dh = img.height / img.width * dw;
    } else {
      dw = img.width / img.height * dh;
    }

    ctx.drawImage(targetImg, dx, dy, dw, dh);

  }

  function clippingInterface(img) {
    var bg = document.querySelector("#ps-lite-clipping .bg");
    var fg = document.querySelector("#ps-lite-clipping .fg");

    var imgSharp = new ImageSharp(img, bg.getContext('2d'));

    var dw = bg.width, dh = bg.height;

    if (img.width > img.height) {
      dh = img.height / img.width * dw;
    } else {
      dw = img.width / img.height * dh;
    }

    imgSharp.style.left = 10;
    imgSharp.style.top = 20;
    imgSharp.style.width = dw;
    imgSharp.style.height = dh;

    imgSharp.draw();

    var boxSharp = new BorderSharp(fg.getContext('2d'));

    boxSharp.style.border.width = 1;
    boxSharp.style.border.color = "#0000FF";


    touch.on('#ps-lite-clipping', 'touchstart', function (ev) {
      console.log('touchstart prevent');
      ev.originEvent.touches = ev.originEvent.touches || [];
      ev.originEvent.preventDefault();
      console.log('fingers', ev.originEvent.touches.length);
    });

    touch.on('#ps-lite-clipping', 'drag', {interval: 16}, function(ev){
      console.log(ev.position, ev.distanceX, ev.distanceY);
      // ev.position.x // Pointer 坐标
      // ev.position.y // Pointer 坐标
      utils.requestAnimationFrame(function () {
        boxSharp._capture();
        boxSharp.style.left = ev.position.x - ev.distanceX;
        boxSharp.style.top = ev.position.y - ev.distanceY;
        boxSharp.style.width = ev.distanceX;
        boxSharp.style.height = ev.distanceY;
        boxSharp.refresh();
      });
    })

  }


  function gestureInterface(img) {
    var gestureCanvas = document.querySelector('#ps-lite-gesture canvas');
    var ctx = gestureCanvas.getContext('2d');

    var imgSharp = new ImageSharp(img, ctx);

    var dx = 0, dy = 0, dw = gestureCanvas.width, dh = gestureCanvas.height;

    if (img.width > img.height) {
      dh = img.height / img.width * dw;
    } else {
      dw = img.width / img.height * dh;
    }

    imgSharp.style.left = 10;
    imgSharp.style.top = 20;
    imgSharp.style.width = dw;
    imgSharp.style.height = dh;

    imgSharp.draw();

    touch.on('#ps-lite-gesture', 'touchstart', function (ev) {
      console.log('touchstart prevent');
      ev.originEvent.touches = ev.originEvent.touches || [];
      // if (ev.originEvent.touches.length > 1) {
        ev.originEvent.preventDefault();
      // }
      console.log('fingers', ev.originEvent.touches.length);
    });

    imgSharp.lock();
    touch.on('#ps-lite-gesture', 'pinch', {interval: 16}, function (ev) {

      console.dir(ev.scale);
      utils.requestAnimationFrame(function() {
        imgSharp.scale(ev.scale);

        if(ev.fingerStatus === 'end'){
          imgSharp.lock();
        }
      });
    });

    touch.on('#ps-lite-gesture', 'drag', function(ev){
      utils.requestAnimationFrame(function () {

        imgSharp.translate(ev.distanceX, ev.distanceY);
        if(ev.fingerStatus === 'end'){
          imgSharp.lock();
        }
      });
    })
  }

});