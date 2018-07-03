'use strict';

(function () {
  /* Добавление новой картинки в галерею (c применением эффектов, добавлением комментариев и хеш-тегов */
  var uploadFileElement = document.querySelector('#upload-file');
  var pictureEditorElement = document.querySelector('.img-upload__overlay');
  var closePictureEditorBtn = pictureEditorElement.querySelector('#upload-cancel');

  var effectsElement = pictureEditorElement.querySelector('.img-upload__effects');
  var checkedEffect = effectsElement.querySelector('.effects__radio:checked');
  var selectedEffect = checkedEffect.value;

  var effectProgressElement = pictureEditorElement.querySelector('.img-upload__scale');
  var effectValueElement = effectProgressElement.querySelector('.scale__value');
  var defaultEffectValue = effectValueElement.value;

  var lineElement = effectProgressElement.querySelector('.scale__line');
  var pinElement = effectProgressElement.querySelector('.scale__pin');
  var levelElement = effectProgressElement.querySelector('.scale__level');

  var previewElement = pictureEditorElement.querySelector('.img-upload__preview');
  var previewPictureElement = previewElement.querySelector('img');

  /* Изменение размера изображения внутри блока с редактированием изображения */
  var pictureSizeInputElement = document.querySelector('.resize__control--value');
  var pictureSizeMinusBtn = document.querySelector('.resize__control--minus');
  var pictureSizePlusBtn = document.querySelector('.resize__control--plus');

  var pictureSize = parseInt(pictureSizeInputElement.value, 10);

  var MIN_PICTURE_SIZE = 25;
  var MAX_PICTURE_SIZE = 100;
  var RESIZING_STEP = 25;

  var applyPictureSize = function (size) {
    pictureSizeInputElement.value = size + '%';
    previewPictureElement.style.transform = 'scale(' + (size / 100) + ')';
  };

  var resizePicture = function (isIncrease) {
    if (isIncrease) {
      pictureSize += RESIZING_STEP;
    } else {
      pictureSize -= RESIZING_STEP;
    }

    pictureSize = window.utils.clump(pictureSize, MIN_PICTURE_SIZE, MAX_PICTURE_SIZE);

    applyPictureSize(pictureSize);
  };

  var onPictureSizeMinusBtnClick = function () {
    resizePicture(false);
  };

  var onPictureSizePlusBtnClick = function () {
    resizePicture(true);
  };

  /* Объект-мапа, со всеми поддерживаемыми эффектами */
  var effectsMap = {
    'none': function () {
      return 'none';
    },

    'chrome': function (value) {
      var maxValue = 1;
      var coefficient = maxValue * value / 100;

      return 'grayscale(' + coefficient + ')';
    },

    'sepia': function (value) {
      var maxValue = 1;
      var coefficient = maxValue * value / 100;

      return 'sepia(' + coefficient + ')';
    },

    'marvin': function (value) {
      return 'invert(' + value + '%)';
    },

    'phobos': function (value) {
      var maxValue = 3;
      var coefficient = maxValue * value / 100;

      return 'blur(' + coefficient + 'px)';
    },

    'heat': function (value) {
      var coefficient = 1;
      var maxValue = 3;

      if (value !== 0) {
        coefficient = maxValue * value / 100;
      }

      return 'brightness(' + coefficient + ')';
    }
  };

  var changeProgress = function (value) {
    pinElement.style.left = value + '%';
    levelElement.style.width = value + '%';
  };

  var onPinElementMouseDown = function (evt) {
    evt.preventDefault();

    disableEffectOverlay();
    enableMovePin();
  };

  var onPinElementMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    setEffectLevel(moveEvt.clientX);
  };

  var onPinElementMouseUp = function (upEvt) {
    upEvt.preventDefault();

    setEffectLevel(upEvt.clientX);

    enableEffectOverlay();
    disableMovePin();
  };

  var enableMovePin = function () {
    document.addEventListener('mousemove', onPinElementMouseMove);
    document.addEventListener('mouseup', onPinElementMouseUp);
  };

  var disableMovePin = function () {
    document.removeEventListener('mousemove', onPinElementMouseMove);
    document.removeEventListener('mouseup', onPinElementMouseUp);
  };

  var setEffectLevel = function (x) {
    x = window.utils.clump(x, window.lineElementProps.leftPos, window.lineElementProps.rightPos);
    var effectLevel = (x - window.lineElementProps.leftPos) / window.lineElementProps.width * 100;

    applyEffect(selectedEffect, effectLevel.toFixed(2));
  };

  var enableEffectOverlay = function () {
    lineElement.addEventListener('click', onLineElementClick);
    pinElement.addEventListener('mousedown', onPinElementMouseDown);
  };

  var disableEffectOverlay = function () {
    lineElement.removeEventListener('click', onLineElementClick);
    pinElement.addEventListener('mousedown', onPinElementMouseDown);
  };

  var onLineElementClick = function (evt) {
    setEffectLevel(evt.clientX);
  };

  var applyEffect = function (effectName, pinPosition) {
    effectValueElement.value = pinPosition;
    changeProgress(effectValueElement.value);

    effectProgressElement.classList.toggle('hidden', effectName === 'none');

    previewPictureElement.style.filter = effectsMap[effectName](effectValueElement.value);
  };

  var onPictureEditorEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      if (evt.target !== hashTagInputElement && evt.target !== textCommentElement) {
        closePictureEditor();
      }
    }
  };

  /* Поле ввода комментария к картинке */
  var textCommentElement = pictureEditorElement.querySelector('.text__description');

  /* Валидация хеш-тегов */
  var hashTagInputElement = pictureEditorElement.querySelector('.text__hashtags');

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
    var filteredHashTags = window.utils.getFilteredArray(hashTagInputElement.value, ' ');

    hashTagInputElement.setCustomValidity(getHashTagValidity(filteredHashTags));
  };

  /* Открытие блока с редактированием изображения */
  var openPictureEditor = function () {
    applyPictureSize(pictureSize);

    checkedEffect.checked = true;
    applyEffect(checkedEffect.value, defaultEffectValue);

    pictureEditorElement.classList.remove('hidden');

    pictureSizeMinusBtn.addEventListener('click', onPictureSizeMinusBtnClick);
    pictureSizePlusBtn.addEventListener('click', onPictureSizePlusBtnClick);

    enableEffectOverlay();

    window.lineElementProps = {
      leftPos: lineElement.getBoundingClientRect().left,
      rightPos: lineElement.getBoundingClientRect().right,
      width: lineElement.offsetWidth
    };

    document.addEventListener('keydown', onPictureEditorEscPress);
    closePictureEditorBtn.addEventListener('click', onClosePictureEditorBtnClick);
    hashTagInputElement.addEventListener('input', onHashTagInputElementInput);
  };

  var onClosePictureEditorBtnClick = function () {
    closePictureEditor();
  };

  var closePictureEditor = function () {
    pictureEditorElement.classList.add('hidden');
    uploadFileElement.value = '';

    pictureSize = MAX_PICTURE_SIZE;

    document.removeEventListener('keydown', onPictureEditorEscPress);
    closePictureEditorBtn.removeEventListener('click', onClosePictureEditorBtnClick);

    pictureSizeMinusBtn.removeEventListener('click', onPictureSizeMinusBtnClick);
    pictureSizePlusBtn.removeEventListener('click', onPictureSizePlusBtnClick);

    hashTagInputElement.removeEventListener('input', onHashTagInputElementInput);
    disableEffectOverlay();
  };

  var onEffectsElementChange = function (evt) {
    selectedEffect = evt.target.value;
    applyEffect(selectedEffect, defaultEffectValue);
  };

  var uploadFile = function () {
    effectsElement.addEventListener('change', onEffectsElementChange);

    uploadFileElement.addEventListener('change', function () {
      openPictureEditor();
    });
  };

  uploadFile();
})();
