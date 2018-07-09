'use strict';

(function () {
  var messageErrorTemplate = document.querySelector('#picture')
    .content
    .querySelector('.img-upload__message--error')
    .cloneNode(true);

  var reloadElement = messageErrorTemplate.querySelector('.error__link');

  var messageSuccessTemplate = document.querySelector('#picture')
    .content
    .querySelector('.img-upload__message--success')
    .cloneNode(true);

  var linkElement = messageSuccessTemplate.querySelector('.success__link');

  var isReload = false;

  var displayError = function (message, isReloadPage) {
    isReload = isReloadPage;

    messageErrorTemplate.querySelector('.error-message').textContent = message;

    document.body.appendChild(messageErrorTemplate);

    messageErrorTemplate.classList.remove('hidden');

    reloadElement.addEventListener('click', onReloadElementClick);

    document.addEventListener('keydown', onMessageErrorContainerEscPress);
  };

  var onReloadElementClick = function () {
    closeMessageError(isReload);
  };

  var onMessageErrorContainerEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      closeMessageError(isReload);
    }
  };

  var displaySuccess = function () {
    document.body.appendChild(messageSuccessTemplate);
    messageSuccessTemplate.classList.remove('hidden');

    linkElement.addEventListener('click', onLinkElementClick);

    document.addEventListener('keydown', onMessageSuccessContainerEscPress);
  };

  var onLinkElementClick = function () {
    closeMessageSuccess();
  };

  var onMessageSuccessContainerEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      closeMessageSuccess();
    }
  };

  var closeMessageSuccess = function () {
    linkElement.removeEventListener('click', onLinkElementClick);
    document.body.removeChild(messageSuccessTemplate);

    document.removeEventListener('keydown', onMessageSuccessContainerEscPress);
  };

  var closeMessageError = function (isReloadPage) {
    reloadElement.removeEventListener('click', onReloadElementClick);
    document.body.removeChild(messageErrorTemplate);

    document.removeEventListener('keydown', onMessageErrorContainerEscPress);

    if (isReloadPage) {
      window.location.reload();
    }
  };

  window.requestResult = {
    displayError: displayError,
    displaySuccess: displaySuccess
  };
})();
