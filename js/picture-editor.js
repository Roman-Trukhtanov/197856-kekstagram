'use strict';

(function () {
  /* Добавление новой картинки в галерею (c применением эффектов, добавлением комментариев и хеш-тегов */
  var uploadFileElement = document.querySelector('#upload-file');
  var pictureEditorElement = document.querySelector('.img-upload__overlay');
  var closePictureEditorBtn = pictureEditorElement.querySelector('#upload-cancel');

  var previewElement = pictureEditorElement.querySelector('.img-upload__preview');
  var previewPictureElement = previewElement.querySelector('img');

  var uploadFormElement = document.querySelector('#upload-select-image');

  var onPictureEditorEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)
      && window.utils.isFocusOnField(evt.target.tagName)) {

      closePictureEditor();
    }
  };

  var onClosePictureEditorBtnClick = function () {
    closePictureEditor();
  };

  /* Открытие блока с редактированием изображения */
  var openPictureEditor = function (fileUrl) {
    previewPictureElement.src = fileUrl;
    document.body.classList.add('modal-open');
    pictureEditorElement.classList.remove('hidden');

    window.resizeImage.enableResizeImage(previewPictureElement);
    window.overlayEffect.enableApplicationEffect(previewPictureElement);

    document.addEventListener('keydown', onPictureEditorEscPress);
    closePictureEditorBtn.addEventListener('click', onClosePictureEditorBtnClick);

    window.validationField.enableValidationField();
    uploadFormElement.addEventListener('submit', onUploadFormElementSubmit);
  };

  var closePictureEditor = function () {
    pictureEditorElement.classList.add('hidden');
    document.body.classList.remove('modal-open');

    uploadFileElement.value = '';

    document.removeEventListener('keydown', onPictureEditorEscPress);
    closePictureEditorBtn.removeEventListener('click', onClosePictureEditorBtnClick);

    window.resizeImage.disableResizeImage();
    window.overlayEffect.disableApplicationEffect();

    uploadFormElement.removeEventListener('submit', onUploadFormElementSubmit);

    window.validationField.disableValidationField();
  };

  var onLoadForm = function () {
    closePictureEditor();
    window.requestResult.displaySuccess();
  };


  var onErrorForm = function (message) {
    closePictureEditor();
    window.requestResult.displayError(message, true);
  };

  var onUploadFormElementSubmit = function (evt) {
    window.backend.upload(new FormData(uploadFormElement), onLoadForm, onErrorForm);
    evt.preventDefault();
  };

  var uploadFile = function () {
    uploadFileElement.addEventListener('change', function () {
      window.readFile(uploadFileElement, openPictureEditor);
    });
  };

  uploadFile();
})();
