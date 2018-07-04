'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');

  var pictureTemplate = document.querySelector('#picture').content;

  var getPictureElement = function (picture) {
    var pictureElement = pictureTemplate.querySelector('.picture__link').cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = (picture.comments.length).toString();

    pictureElement.addEventListener('click', function () {
      window.previewPicture(picture);
    });

    return pictureElement;
  };

  var onSuccess = function (allPictures) {
    var pictureElements = [];

    allPictures.forEach(function (it) {
      pictureElements.push(getPictureElement(it));
    });

    picturesContainer.appendChild(window.utils.fillFragment(pictureElements));
  };

  var onError = function (message) {
    window.displayRequestResult.displayError(message);
  };

  window.backend.load(onSuccess, onError);
})();
