'use strict';

(function () {
  var APPLY_EFFECT_STEP = 1;
  var MIN_EFFECT_VALUE = 0;
  var MAX_EFFECT_VALUE = 100;

  var effectsElement = document.querySelector('.img-upload__effects');
  var checkedEffect = effectsElement.querySelector('.effects__radio:checked');
  var selectedEffect = checkedEffect.value;

  var effectProgressElement = document.querySelector('.img-upload__scale');
  var effectValueElement = effectProgressElement.querySelector('.scale__value');
  var defaultEffectValue = parseFloat(effectValueElement.value);

  var lineElement = effectProgressElement.querySelector('.scale__line');
  var pinElement = effectProgressElement.querySelector('.scale__pin');
  var levelElement = effectProgressElement.querySelector('.scale__level');

  var Effect = {
    NONE: 'none',
    CHROME: 'chrome',
    SEPIA: 'sepia',
    MARVIN: 'marvin',
    PHOBOS: 'phobos',
    HEAT: 'heat'
  };

  /* Объект-мапа, со всеми поддерживаемыми эффектами */
  var effectsMap = {};

  effectsMap[Effect.NONE] = function () {
    return 'none';
  };

  effectsMap[Effect.CHROME] = function (value) {
    var maxValue = 1;
    var coefficient = maxValue * value / 100;

    return 'grayscale(' + coefficient + ')';
  };

  effectsMap[Effect.SEPIA] = function (value) {
    var maxValue = 1;
    var coefficient = maxValue * value / 100;

    return 'sepia(' + coefficient + ')';
  };

  effectsMap[Effect.MARVIN] = function (value) {
    return 'invert(' + value + '%)';
  };

  effectsMap[Effect.PHOBOS] = function (value) {
    var maxValue = 3;
    var coefficient = maxValue * value / 100;

    return 'blur(' + coefficient + 'px)';
  };

  effectsMap[Effect.HEAT] = function (value) {
    var minValue = 1;
    var maxValue = 3;

    var coefficient = minValue + (value * (maxValue - minValue) / 100);

    return 'brightness(' + coefficient + ')';
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
    pinElement.focus();
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
    pinElement.addEventListener('focus', onPinElementFocus);
    pinElement.addEventListener('blur', onPinElementBlur);
  };

  var disableEffectOverlay = function () {
    lineElement.removeEventListener('click', onLineElementClick);
    pinElement.removeEventListener('mousedown', onPinElementMouseDown);
    pinElement.removeEventListener('focus', onPinElementFocus);
    pinElement.removeEventListener('blur', onPinElementBlur);
  };

  var onLineElementClick = function (evt) {
    setEffectLevel(evt.clientX);
    pinElement.focus();
  };

  var applyEffect = function (effectName, pinPosition) {
    effectValueElement.value = pinPosition;

    changeProgress(effectValueElement.value);

    effectProgressElement.classList.toggle('hidden', effectName === Effect.NONE);

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

  var onPinElementFocus = function () {
    enableArrowPress();
  };

  var onPinElementBlur = function () {
    disableArrowPress();
  };

  var enableArrowPress = function () {
    document.addEventListener('keydown', onPinElementArrowPress);
  };

  var disableArrowPress = function () {
    document.removeEventListener('keydown', onPinElementArrowPress);
  };

  var onPinElementArrowPress = function (evt) {
    if (window.utils.isLeftArrowKeycode(evt)) {
      changeSuperimposedEffect(false);
    }

    if (window.utils.isRightArrowKeycode(evt)) {
      changeSuperimposedEffect(true);
    }
  };

  var changeSuperimposedEffect = function (isIncrease) {
    var updatedEffectValue = isIncrease
      ? parseFloat(effectValueElement.value) + APPLY_EFFECT_STEP
      : parseFloat(effectValueElement.value) - APPLY_EFFECT_STEP;

    updatedEffectValue = window.utils.clamp(updatedEffectValue, MIN_EFFECT_VALUE, MAX_EFFECT_VALUE);

    applyEffect(selectedEffect, updatedEffectValue);
  };

  var disableApplicationEffect = function () {
    disableEffectOverlay();
  };

  window.overlayEffect = {
    enableApplicationEffect: enableApplicationEffect,
    disableApplicationEffect: disableApplicationEffect
  };
})();
