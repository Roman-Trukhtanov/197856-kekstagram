'use strict';

(function () {
  var messageErrorTemplate = document.querySelector('#picture')
    .content
    .querySelector('.img-upload__message--error')
    .cloneNode(true);

  var messageSuccessTemplate = document.querySelector('#picture')
    .content
    .querySelector('.img-upload__message--success')
    .cloneNode(true);

  var displayError = function (message) {
    messageErrorTemplate.querySelector('.error-message').textContent = message;

    var reloadElement = messageErrorTemplate.querySelector('.error__link');

    document.body.appendChild(messageErrorTemplate);

    messageErrorTemplate.classList.remove('hidden');

    reloadElement.addEventListener('click', function () {
      closeMessageError();
    });

    document.addEventListener('keydown', onMessageErrorContainerEscPress);
  };

  var onMessageErrorContainerEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      closeMessageError();
    }
  };

  var displaySuccess = function () {
    var linkElement = messageSuccessTemplate.querySelector('.success__link');

    document.body.appendChild(messageSuccessTemplate);
    messageSuccessTemplate.classList.remove('hidden');

    linkElement.addEventListener('click', function () {
      closeMessageSuccess();
    });

    document.addEventListener('keydown', onMessageSuccessContainerEscPress);
  };

  var onMessageSuccessContainerEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      closeMessageSuccess();
    }
  };

  var closeMessageSuccess = function () {
    messageSuccessTemplate.classList.add('hidden');

    document.removeEventListener('keydown', onMessageSuccessContainerEscPress);
    document.body.removeChild(messageSuccessTemplate);
  };

  var closeMessageError = function () {
    messageErrorTemplate.classList.add('hidden');

    document.removeEventListener('keydown', onMessageErrorContainerEscPress);
    document.body.removeChild(messageErrorTemplate);

    window.location.reload();
  };

  window.requestResult = {
    displayError: displayError,
    displaySuccess: displaySuccess
  };
})();
