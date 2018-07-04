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

    clamp: function (value, min, max) {
      return Math.max(min, Math.min(value, max));
    },

    getFilteredArray: function (str, symbol) {
      return str.split(symbol)
        .filter(function (it) {
          return it !== '';
        });
    },

    fillFragment: function (arr) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < arr.length; i++) {
        fragment.appendChild(arr[i]);
      }

      return fragment;
    }
  };
})();
