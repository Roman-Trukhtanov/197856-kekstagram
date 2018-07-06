'use strict';

(function () {
  var uploadTextContainer = document.querySelector('.img-upload__text');

  /* Поле ввода комментария к картинке */
  var textCommentElement = uploadTextContainer.querySelector('.text__description');

  /* Валидация хеш-тегов */
  var hashTagInputElement = uploadTextContainer.querySelector('.text__hashtags');

  var getHashTagValidity = function (hashTags) {
    if (hashTags.length > 5) {
      return 'Превышено максимальное количество тегов (максимум 5 - хеш-тегов)';
    }

    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i] === '#') {
        return 'Хеш-тег не может состоять тольк из "#": ' + hashTags[i];
      } else if (hashTags[i][0] !== '#') {
        return 'Хеш-тег должен начинаться с "#": ' + hashTags[i];
      }

      if (hashTags[i].length > 20) {
        return 'Превышена максимальная длина хеш-тега (20 - символов): ' + hashTags[i];
      }

      var currentHashTag = hashTags[i].toLowerCase();

      for (var j = i + 1; j < hashTags.length; j++) {
        var nextHashTag = hashTags[j].toLowerCase();

        if (currentHashTag === nextHashTag) {
          return 'Одинаковые хеш-теги: ' + hashTags[i] + ' и ' + hashTags[j];
        }
      }
    }

    return '';
  };

  var onHashTagInputElementInput = function () {
    checkValidityField();
  };

  var checkValidityField = function () {
    var filteredHashTags = window.utils.getFilteredArray(hashTagInputElement.value, ' ');
    var message = getHashTagValidity(filteredHashTags);

    hashTagInputElement.classList.toggle('text__hashtags--error', (message !== ''));

    hashTagInputElement.setCustomValidity(message);
  };

  var enableValidationField = function () {
    hashTagInputElement.addEventListener('input', onHashTagInputElementInput);
  };

  var disableValidationField = function () {
    hashTagInputElement.value = '';
    textCommentElement.value = '';
    hashTagInputElement.removeEventListener('input', onHashTagInputElementInput);
  };

  window.validationField = {
    enableValidationField: enableValidationField,

    disableValidationField: disableValidationField
  };
})();
