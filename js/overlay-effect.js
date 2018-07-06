'use strict';

(function () {
  var effectsElement = document.querySelector('.img-upload__effects');
  var checkedEffect = effectsElement.querySelector('.effects__radio:checked');
  var selectedEffect = checkedEffect.value;

  var effectProgressElement = document.querySelector('.img-upload__scale');
  var effectValueElement = effectProgressElement.querySelector('.scale__value');
  var defaultEffectValue = effectValueElement.value;

  var lineElement = effectProgressElement.querySelector('.scale__line');
  var pinElement = effectProgressElement.querySelector('.scale__pin');
  var levelElement = effectProgressElement.querySelector('.scale__level');

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

  var lineElementProps = {};

  var previewPicture = null;

  var changeProgress = function (value) {
    pinElement.style.left = value + '%';
    levelElement.style.width = value + '%';
  };

  var onPinElementMouseDown = function (evt) {
    evt.preventDefault();

    disableEffectOverlay();
    enableMovePin();
  };

  var onPinElementMouseMove = function (evt) {
    evt.preventDefault();

    setEffectLevel(evt.clientX);
  };

  var onPinElementMouseUp = function (evt) {
    evt.preventDefault();

    setEffectLevel(evt.clientX);

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
    x = window.utils.clamp(x, lineElementProps.leftPos, lineElementProps.rightPos);
    var effectLevel = (x - lineElementProps.leftPos) / lineElementProps.width * 100;

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

    previewPicture.style.filter = effectsMap[effectName](effectValueElement.value);
  };

  var onEffectsElementChange = function (evt) {
    selectedEffect = evt.target.value;
    applyEffect(selectedEffect, defaultEffectValue);
  };

  var enableApplicationEffect = function (element) {
    previewPicture = element;

    checkedEffect.checked = true;
    applyEffect(checkedEffect.value, defaultEffectValue);

    effectsElement.addEventListener('change', onEffectsElementChange);

    enableEffectOverlay();

    lineElementProps = {
      leftPos: lineElement.getBoundingClientRect().left,
      rightPos: lineElement.getBoundingClientRect().right,
      width: lineElement.offsetWidth
    };
  };

  var disableApplicationEffect = function () {
    disableEffectOverlay();
  };

  window.overlayEffect = {
    enableApplicationEffect: enableApplicationEffect,
    disableApplicationEffect: disableApplicationEffect
  };
})();
