'use strict';

(function () {
  var messageErrorContainer = document.querySelector('#picture')
    .content
    .querySelector('.img-upload__message--error')
    .cloneNode(true);

  var messageSuccessContainer = document.querySelector('#picture')
    .content
    .querySelector('.img-upload__message--success')
    .cloneNode(true);

  var displayError = function (message) {
    messageErrorContainer.querySelector('.error-message').textContent = message;

    var reloadElement = messageErrorContainer.querySelector('.error__link');

    document.body.appendChild(messageErrorContainer);

    messageErrorContainer.classList.remove('hidden');

    reloadElement.addEventListener('click', function () {
      reloadPage();
    });

    document.addEventListener('keydown', onMessageErrorContainerEscPress);
  };

  var reloadPage = function () {
    window.location.reload();
  };

  var onMessageErrorContainerEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      reloadPage();
    }
  };

  var displaySuccess = function () {
    var linkElement = messageSuccessContainer.querySelector('.success__link');

    document.body.appendChild(messageSuccessContainer);
    messageSuccessContainer.classList.remove('hidden');

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
    messageSuccessContainer.classList.add('hidden');

    document.body.removeChild(messageSuccessContainer);
  };

  window.displayRequestResult = {
    displayError: displayError,
    displaySuccess: displaySuccess
  };
})();
