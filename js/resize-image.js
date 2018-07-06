'use strict';

(function () {
  var MIN_PICTURE_SIZE = 25;
  var MAX_PICTURE_SIZE = 100;
  var RESIZING_STEP = 25;

  /* Изменение размера изображения внутри блока с редактированием изображения */
  var pictureSizeInputElement = document.querySelector('.resize__control--value');
  var pictureSizeMinusBtn = document.querySelector('.resize__control--minus');
  var pictureSizePlusBtn = document.querySelector('.resize__control--plus');

  var pictureSize = parseInt(pictureSizeInputElement.value, 10);
  var defaultPictureSize = pictureSize;

  var previewPicture = null;

  var applyPictureSize = function (size) {
    pictureSizeInputElement.value = size + '%';

    previewPicture.style.transform = 'scale(' + (size / 100) + ')';
  };

  var resizePicture = function (isIncrease) {
    pictureSize = isIncrease
      ? pictureSize + RESIZING_STEP
      : pictureSize - RESIZING_STEP;

    pictureSize = window.utils.clamp(pictureSize, MIN_PICTURE_SIZE, MAX_PICTURE_SIZE);

    applyPictureSize(pictureSize);
  };

  var onPictureSizeMinusBtnClick = function () {
    resizePicture(false);
  };

  var onPictureSizePlusBtnClick = function () {
    resizePicture(true);
  };

  var enableResizeImage = function (element) {
    pictureSizeMinusBtn.focus();

    previewPicture = element;
    applyPictureSize(pictureSize, previewPicture);

    pictureSizeMinusBtn.addEventListener('click', onPictureSizeMinusBtnClick);
    pictureSizePlusBtn.addEventListener('click', onPictureSizePlusBtnClick);
  };

  var disableResizeImage = function () {
    pictureSize = defaultPictureSize;

    pictureSizeMinusBtn.removeEventListener('click', onPictureSizeMinusBtnClick);
    pictureSizePlusBtn.removeEventListener('click', onPictureSizePlusBtnClick);
  };

  window.resizeImage = {
    enableResizeImage: enableResizeImage,

    disableResizeImage: disableResizeImage
  };
})();
