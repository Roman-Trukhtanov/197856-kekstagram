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
      && evt.target !== window.validateFields.hashTagInputElement
      && evt.target !== window.validateFields.textCommentElement) {

      closePictureEditor();
    }
  };

  /* Открытие блока с редактированием изображения */
  var openPictureEditor = function () {
    document.body.classList.add('modal-open');
    pictureEditorElement.classList.remove('hidden');

    window.resizeImage.enableResizeImage();
    window.overlayEffect.enableApplicationEffect();

    document.addEventListener('keydown', onPictureEditorEscPress);
    closePictureEditorBtn.addEventListener('click', onClosePictureEditorBtnClick);

    window.validateFields.enableValidationField();
    uploadFormElement.addEventListener('submit', onUploadFormElementSubmit);
  };

  var onClosePictureEditorBtnClick = function () {
    closePictureEditor();
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

    window.validateFields.disableValidationField();
  };

  var onLoadForm = function () {
    closePictureEditor();
    window.displayRequestResult.displaySuccess();
  };


  var onErrorForm = function (message) {
    closePictureEditor();
    window.displayRequestResult.displayError(message);
  };

  var onUploadFormElementSubmit = function (evt) {
    window.backend.upload(new FormData(uploadFormElement), onLoadForm, onErrorForm);
    evt.preventDefault();
  };

  var uploadFile = function () {
    uploadFileElement.addEventListener('change', function () {
      openPictureEditor();
    });
  };

  uploadFile();

  window.editUploadedImage = {
    previewPictureElement: previewPictureElement,
    pictureEditorElement: pictureEditorElement
  };
})();
