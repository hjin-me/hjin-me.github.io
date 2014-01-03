/**
 * Created by huangjin02 on 14-1-3.
 */
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
    ,
    {
      name: 'underscore',
      location: 'dependencies/underscore',
      main: 'underscore'
    },
    {
      name: 'sharp',
      location: 'dependencies/sharp',
      main: 'main'
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

require(['timer', 'exif', 'touch', 'utils', 'sharp'], function (timer, EXIF, touch, utils, sharp) {

  var ImageSharp = sharp.ImageSharp, BorderSharp = sharp.BorderSharp, CircleSharp = sharp.CircleSharp;

  var filePicker = new utils.file2image('#file-picker');
  filePicker.onChange(function (img) {

    clippingInterface(img);
    touchInterface(img);
    gestureInterface(img);

  });


  function touchInterface(img) {

    var bg = document.querySelector('#ps-lite-touch .bg');
    var fg = document.querySelector('#ps-lite-touch .fg');

    var imgSharp = new ImageSharp(bg, img);

    var dw = bg.width, dh = bg.height;

    if (img.width > img.height) {
      dh = img.height / img.width * dw;
    } else {
      dw = img.width / img.height * dh;
    }

    imgSharp.style.left = 0;
    imgSharp.style.top = 0;
    imgSharp.style.width = dw;
    imgSharp.style.height = dh;

    imgSharp.draw();


    var circleTimer = null, startTime = null, pointer = {};
    var clrSharp = new CircleSharp(fg);
    clrSharp.style.border.width = 1;
    clrSharp.style.border.color = 'red';


    touch.on('#ps-lite-touch', 'touchstart', function (ev) {
      ev.originEvent.preventDefault();
      var box = this.getBoundingClientRect();
      pointer = {
        x: ev.touches[0].clientX - box.left,
        y: ev.touches[0].clientY - box.top
      };
      startTime = Date.now();
      biggerCircle(startTime);
    });

    touch.on('#ps-lite-touch', 'touchend', function (ev) {
      console.log('touch end');
      window.getSelection().removeAllRanges();

      startTime = null;
      utils.cancelAnimationFrame(circleTimer);

      // 输出到输出区
      var ratio = imgSharp.data.raw.width / imgSharp.style.width;

      var cutZone = {
        left: Math.max(0, clrSharp.style.left - imgSharp.style.left) * ratio,
        top: Math.max(0, clrSharp.style.top - imgSharp.style.top) * ratio,
        bottom: Math.max(0, Math.min(imgSharp.style.bottom, clrSharp.style.bottom) - imgSharp.style.top) * ratio,
        right: Math.max(0, Math.min(imgSharp.style.right, clrSharp.style.right) - imgSharp.style.left) * ratio
      };


      outputImg(imgSharp.data.raw, cutZone.left, cutZone.top
        , cutZone.right - cutZone.left, cutZone.bottom - cutZone.top
        , 200
        , document.getElementById('touch-output'));
    });

    function biggerCircle(time) {
      console.log(time - startTime);

      clrSharp._capture();
      clrSharp.style.circle.r = (time - startTime) / 8;
      clrSharp.style.circle.x = pointer.x;
      clrSharp.style.circle.y = pointer.y;
      clrSharp.refresh();
      circleTimer = utils.requestAnimationFrame(biggerCircle);
    }
  }

  function clippingInterface(img) {
    var bg = document.querySelector("#ps-lite-clipping .bg");
    var fg = document.querySelector("#ps-lite-clipping .fg");

    var imgSharp = new ImageSharp(bg, img);

    var dw = bg.width, dh = bg.height;

    if (img.width > img.height) {
      dh = img.height / img.width * dw;
    } else {
      dw = img.width / img.height * dh;
    }

    imgSharp.style.left = 0;
    imgSharp.style.top = 0;
    imgSharp.style.width = dw;
    imgSharp.style.height = dh;

    imgSharp.draw();

    var boxSharp = new BorderSharp(fg);

    boxSharp.style.border.width = 1;
    boxSharp.style.border.color = "#0000FF";


    touch.on('#ps-lite-clipping', 'touchstart', function (ev) {
      console.log('touchstart prevent');
      ev.originEvent.touches = ev.originEvent.touches || [];
      ev.originEvent.preventDefault();
      console.log('fingers', ev.originEvent.touches.length);
    });

    touch.on('#ps-lite-clipping', 'drag', {interval: 16}, function (ev) {
      console.log('drag', ev.position, ev.distanceX, ev.distanceY);
      // ev.position.x // Pointer 坐标
      // ev.position.y // Pointer 坐标
      utils.requestAnimationFrame(function () {
        boxSharp._capture();
        if(ev.distanceX > 0) {
          boxSharp.style.left = ev.position.x - ev.distanceX;
        } else {
          boxSharp.style.left = ev.position.x;
        }
        if(ev.distanceY > 0) {
          boxSharp.style.top = ev.position.y - ev.distanceY;
        } else {
          boxSharp.style.top = ev.position.y;
        }


        boxSharp.style.width = Math.abs(ev.distanceX);
        boxSharp.style.height = Math.abs(ev.distanceY);
        boxSharp.refresh();

        if (ev.fingerStatus === 'end') {
          // 输出到输出区
          var ratio = imgSharp.data.raw.width / imgSharp.style.width;

          var cutZone = {
            left: Math.max(0, boxSharp.style.left - imgSharp.style.left) * ratio,
            top: Math.max(0, boxSharp.style.top - imgSharp.style.top) * ratio,
            bottom: Math.max(0, Math.min(imgSharp.style.bottom, boxSharp.style.bottom) - imgSharp.style.top) * ratio,
            right: Math.max(0, Math.min(imgSharp.style.right, boxSharp.style.right) - imgSharp.style.left) * ratio
          };

          outputImg(imgSharp.data.raw, cutZone.left, cutZone.top
            , cutZone.right - cutZone.left, cutZone.bottom - cutZone.top
            , 200
            , document.getElementById('clipping-output'));
        }

      });
    })

  }


  function gestureInterface(img) {

    var bg = document.querySelector("#ps-lite-gesture .bg");
    var fg = document.querySelector("#ps-lite-gesture .fg");

    var imgSharp = new ImageSharp(bg, img);

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


    var boxSharp = new BorderSharp(fg);

    boxSharp.style.border.width = 1;
    boxSharp.style.border.color = "yellow";
    boxSharp.style.left = 50;
    boxSharp.style.width = 200;
    boxSharp.style.top = 40;
    boxSharp.style.height = 160;

    boxSharp.draw();

    touch.on('#ps-lite-gesture', 'touchstart', function (ev) {
      console.log('touchstart prevent');
      ev.originEvent.touches = ev.originEvent.touches || [];
      ev.originEvent.preventDefault();
      console.log('fingers', ev.originEvent.touches.length);
    });

    imgSharp.lock();
    touch.on('#ps-lite-gesture', 'pinch', {interval: 16}, function (ev) {

      console.dir(ev.scale);
      utils.requestAnimationFrame(function () {
        imgSharp.scale(ev.scale);

        if (ev.fingerStatus === 'end') {
          imgSharp.lock();

          // 输出到输出区
          var ratio = imgSharp.data.raw.width / imgSharp.style.width;

          var cutZone = {
            left: Math.max(0, boxSharp.style.left - imgSharp.style.left) * ratio,
            top: Math.max(0, boxSharp.style.top - imgSharp.style.top) * ratio,
            bottom: Math.max(0, Math.min(imgSharp.style.bottom, boxSharp.style.bottom) - imgSharp.style.top) * ratio,
            right: Math.max(0, Math.min(imgSharp.style.right, boxSharp.style.right) - imgSharp.style.left) * ratio
          };

          outputImg(imgSharp.data.raw, cutZone.left, cutZone.top
            , cutZone.right - cutZone.left, cutZone.bottom - cutZone.top
            , 200
            , document.getElementById('gesture-output'));

        }
      });
    });

    touch.on('#ps-lite-gesture', 'drag', function (ev) {
      utils.requestAnimationFrame(function () {

        imgSharp.translate(ev.distanceX, ev.distanceY);
        if (ev.fingerStatus === 'end') {
          imgSharp.lock();

          // 输出到输出区
          var ratio = imgSharp.data.raw.width / imgSharp.style.width;

          var cutZone = {
            left: Math.max(0, boxSharp.style.left - imgSharp.style.left) * ratio,
            top: Math.max(0, boxSharp.style.top - imgSharp.style.top) * ratio,
            bottom: Math.max(0, Math.min(imgSharp.style.bottom, boxSharp.style.bottom) - imgSharp.style.top) * ratio,
            right: Math.max(0, Math.min(imgSharp.style.right, boxSharp.style.right) - imgSharp.style.left) * ratio
          };


          outputImg(imgSharp.data.raw, cutZone.left, cutZone.top
            , cutZone.right - cutZone.left, cutZone.bottom - cutZone.top
            , 200
            , document.getElementById('gesture-output'));

        }
      });
    })
  }


  function outputImg(rawImg, left, top, width, height, maxSize, outputEl) {

    console.log('output img', arguments);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = canvas.height = maxSize;

    if (width > height) {
      canvas.height = height / width * maxSize;
    } else {
      canvas.width = width / height * maxSize;
    }

    ctx.drawImage(rawImg, left, top, width, height, 0, 0, canvas.width, canvas.height);

    outputEl.src = canvas.toDataURL('image/jpeg', 0.7);

  }
});