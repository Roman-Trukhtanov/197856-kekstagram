'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content;

  var getPictureElement = function (picture) {
    var pictureElement = pictureTemplate.querySelector('.picture__link').cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = (picture.comments.length).toString();

    pictureElement.addEventListener('click', function () {
      window.preview.openPictureOverlay(picture);
    });

    return pictureElement;
  };

  window.picture = {
    fillFragment: function (pictures) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < pictures.length; i++) {
        fragment.appendChild(getPictureElement(pictures[i]));
      }

      return fragment;
    }
  };
})();
