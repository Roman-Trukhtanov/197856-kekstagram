'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.utils = {
    isEscKeycode: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },

    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },

    clump: function (value, min, max) {
      var number = value;

      if (number < min) {
        number = min;
      }

      if (number > max) {
        number = max;
      }

      return number;
    },

    getFilteredArray: function (str, symbol) {
      return str.split(symbol)
        .filter(function (it) {
          return it !== '';
        });
    }
  };
})();
