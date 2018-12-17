'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var LEFT_ARROW_KEYCODE = 37;
  var RIGHT_ARROW_KEYCODE = 39;

  var DEBOUNCE_INTERVAL = 500;

  window.utils = {
    isEscKeycode: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },

    isLeftArrowKeycode: function (evt) {
      return evt.keyCode === LEFT_ARROW_KEYCODE;
    },

    isRightArrowKeycode: function (evt) {
      return evt.keyCode === RIGHT_ARROW_KEYCODE;
    },

    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },

    clamp: function (value, min, max) {
      return Math.max(min, Math.min(value, max));
    },

    fillFragment: function (arr) {
      var fragment = document.createDocumentFragment();

      arr.forEach(function (it) {
        fragment.appendChild(it);
      });

      return fragment;
    },

    getFilteredArray: function (str, symbol) {
      return str.split(symbol)
        .filter(function (it) {
          return it !== '';
        });
    },

    isFocusOnField: function (tagName) {
      return (tagName !== 'INPUT' && tagName !== 'TEXTAREA');
    },

    shuffleArray: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[j];
        array[j] = array[i];
        array[i] = temp;
      }
      return array;
    },

    debounce: function (fun) {
      var lastTimeout = null;

      return function () {
        var args = arguments;

        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }

        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
