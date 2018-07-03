'use strict';

(function () {
  var NUMBER_OF_PICTURES = 25;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;

  var picturesContainer = document.querySelector('.pictures');

  var allPictures = window.generateData.generatePictures(NUMBER_OF_PICTURES, MIN_LIKES, MAX_LIKES);

  picturesContainer.appendChild(window.picture.fillFragment(allPictures));
})();
