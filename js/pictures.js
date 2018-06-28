'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var NUMBER_OF_PICTURES = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;

var ESC_KEYCODE = 27;

var pictureTemplate = document.querySelector('#picture').content;

var picturesContainer = document.querySelector('.pictures');

var generatePictures = function (picturesAmount, minLikes, maxLikes) {
  var pictures = [];

  for (var i = 0; i < picturesAmount; i++) {
    pictures.push({
      'url': 'photos/' + (i + 1) + '.jpg',
      'likes': getRandomInt(minLikes, maxLikes),
      'comments': generateComments(getRandomInt(1, 2)),
      'description': DESCRIPTIONS[
        getRandomInt(0, (DESCRIPTIONS.length - 1))
      ]
    });
  }

  return pictures;
};

var generateComments = function (amountComments) {
  var comments = [];

  for (var j = 0; j < amountComments; j++) {
    comments.push(COMMENTS[
      getRandomInt(0, (COMMENTS.length - 1))
    ]);
  }

  return comments;
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var getPictureElement = function (picture) {
  var pictureElement = pictureTemplate.querySelector('.picture__link').cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = (picture.comments.length).toString();

  pictureElement.addEventListener('click', function () {
    openPictureOverlay(picture);
  });

  return pictureElement;
};

var fillFragment = function (pictures) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(getPictureElement(pictures[i]));
  }

  return fragment;
};

var createComment = function (comment) {
  var commentElement = document.createElement('li');
  var userIconElement = document.createElement('img');
  var commentText = document.createTextNode(comment);

  commentElement.classList.add('social__comment', 'social__comment--text');

  userIconElement.classList.add('social__picture');
  userIconElement.src = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
  userIconElement.alt = 'Аватар комментатора фотографии';
  userIconElement.width = 35;
  userIconElement.height = 35;

  commentElement.appendChild(userIconElement);
  commentElement.appendChild(commentText);

  return commentElement;
};

var pictureOverlayContainer = document.querySelector('.big-picture');
var commentsContainer = pictureOverlayContainer.querySelector('.social__comments');
var closePictureOverlayBtn = pictureOverlayContainer.querySelector('#picture-cancel');

var onPictureOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePictureOverlay();
  }
};

var openPictureOverlay = function (picture) {
  commentsContainer.innerHTML = '';

  pictureOverlayContainer.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  pictureOverlayContainer.querySelector('.likes-count').textContent = picture.likes;
  pictureOverlayContainer.querySelector('.comments-count').textContent = (picture.comments.length).toString();
  pictureOverlayContainer.querySelector('.social__caption').textContent = picture.description;

  for (var i = 0; i < picture.comments.length; i++) {
    commentsContainer.appendChild(
        createComment(picture.comments[i])
    );
  }

  pictureOverlayContainer.classList.remove('hidden');

  document.addEventListener('keydown', onPictureOverlayEscPress);

  closePictureOverlayBtn.addEventListener('click', onClosePictureOverlayBtnClick);
};

var onClosePictureOverlayBtnClick = function () {
  closePictureOverlay();
};

var closePictureOverlay = function () {
  pictureOverlayContainer.classList.add('hidden');

  closePictureOverlayBtn.removeEventListener('click', onClosePictureOverlayBtnClick);
  document.removeEventListener('keydown', onPictureOverlayEscPress);
};

var allPictures = generatePictures(NUMBER_OF_PICTURES, MIN_LIKES, MAX_LIKES);

picturesContainer.appendChild(fillFragment(allPictures));

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

  if (pictureSize < MIN_PICTURE_SIZE) {
    pictureSize = MIN_PICTURE_SIZE;
  }

  if (pictureSize > MAX_PICTURE_SIZE) {
    pictureSize = MAX_PICTURE_SIZE;
  }

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

  lineElement.removeEventListener('click', onLineElementClick);

  var startCoords = {
    x: evt.clientX
  };

  var onPinElementMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    if (pinElement.offsetLeft === 0) {
      var pinElementLeftPosition = pinElement.getBoundingClientRect().left + pinElement.offsetWidth / 2;
      startCoords.x = pinElementLeftPosition;

      if (moveEvt.clientX > pinElementLeftPosition) {
        updateCoords(moveEvt);
      }
    } else if (pinElement.offsetLeft === lineElement.offsetWidth) {
      var pinElementRightPosition = pinElement.getBoundingClientRect().right - pinElement.offsetWidth / 2;
      startCoords.x = pinElementRightPosition;

      if (moveEvt.clientX < pinElementRightPosition) {
        updateCoords(moveEvt);
      }
    } else {
      updateCoords(moveEvt);
    }

  };

  var updateCoords = function (moveEvt) {
    var shift = {
      x: startCoords.x - moveEvt.clientX
    };

    startCoords.x = moveEvt.clientX;

    setEffectLevel(shift.x);
  };

  var onPinElementMouseUp = function (upEvt) {
    upEvt.preventDefault();

    lineElement.addEventListener('click', onLineElementClick);

    document.removeEventListener('mousemove', onPinElementMouseMove);
    document.removeEventListener('mouseup', onPinElementMouseUp);
  };

  document.addEventListener('mousemove', onPinElementMouseMove);
  document.addEventListener('mouseup', onPinElementMouseUp);
};

var setEffectLevel = function (shiftX) {
  var effectLevel = ((pinElement.offsetLeft - shiftX) / lineElement.offsetWidth) * 100;

  if (effectLevel > 100) {
    effectLevel = 100;
  }

  if (effectLevel < 0) {
    effectLevel = 0;
  }

  effectValueElement.value = effectLevel;

  applyEffect(selectedEffect, effectValueElement.value);
};

var onLineElementClick = function (evt) {
  var lineElementClickPosition = (evt.clientX - lineElement.getBoundingClientRect().left) / lineElement.offsetWidth * 100;

  applyEffect(selectedEffect, lineElementClickPosition);
};

var applyEffect = function (effectName, pinPosition) {
  effectValueElement.value = pinPosition;
  changeProgress(effectValueElement.value);

  effectProgressElement.classList.toggle('hidden', effectName === 'none');

  previewPictureElement.style.filter = effectsMap[effectName](effectValueElement.value);
};

var onPictureEditorEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    if (evt.target !== hashTagInputElement && evt.target !== textCommentElement) {
      closePictureEditor();
    }
  }
};

/* Поле ввода комментария к картинке */
var textCommentElement = pictureEditorElement.querySelector('.text__description');

/* Валидация хеш-тегов */
var hashTagInputElement = pictureEditorElement.querySelector('.text__hashtags');

var getFilteredArray = function (str, symbol) {
  return str.split(symbol)
    .filter(function (it) {
      return it !== '';
    });
};

var getHashTagValidity = function (hashTags) {
  var message = '';

  if (hashTags.length > 5) {
    message = 'Превышено максимальное количество тегов (максимум 5 - хеш-тегов)';
  }

  for (var i = 0; i < hashTags.length; i++) {
    if (hashTags[i] === '#') {
      message = 'Хеш-тег не может состоять тольк из "#": ' + hashTags[i];
      break;
    } else if (hashTags[i][0] !== '#') {
      message = 'Хеш-тег должен начинаться с "#": ' + hashTags[i];
      break;
    }

    if (hashTags[i].length > 20) {
      message = 'Превышена максимальная длина хеш-тега (20 - символов): ' + hashTags[i];
      break;
    }

    var currentHashTag = hashTags[i].toLowerCase();

    for (var j = i + 1; j < hashTags.length; j++) {
      var nextHashTag = hashTags[j].toLowerCase();

      if (currentHashTag === nextHashTag) {
        message = 'Одинаковые хеш-теги: ' + hashTags[i] + ' и ' + hashTags[j];
        break;
      }
    }
  }

  return message;
};

var onHashTagInputElementInput = function () {
  var filteredHashTags = getFilteredArray(hashTagInputElement.value, ' ');

  hashTagInputElement.setCustomValidity(getHashTagValidity(filteredHashTags));
};

/* Игнорирование ошибок на скрытом поле */
var onEffectValueElementInvalid = function () {
  if (!effectValueElement.validity.valid) {
    effectValueElement.setCustomValidity('');
  }
};

/* Открытие блока с редактированием изображения */
var openPictureEditor = function () {
  applyPictureSize(pictureSize);

  checkedEffect.checked = true;
  applyEffect(checkedEffect.value, defaultEffectValue);

  pictureEditorElement.classList.remove('hidden');

  pictureSizeMinusBtn.addEventListener('click', onPictureSizeMinusBtnClick);
  pictureSizePlusBtn.addEventListener('click', onPictureSizePlusBtnClick);

  /* Обработчики на элементы слайдера */
  lineElement.addEventListener('click', onLineElementClick);
  pinElement.addEventListener('mousedown', onPinElementMouseDown);

  document.addEventListener('keydown', onPictureEditorEscPress);

  closePictureEditorBtn.addEventListener('click', onClosePictureEditorBtnClick);

  hashTagInputElement.addEventListener('input', onHashTagInputElementInput);

  /* Т.к поле скрыто, если через js изменять значение, то при отрпавке формы поле ругается */
  effectValueElement.addEventListener('invalid', onEffectValueElementInvalid);
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

  lineElement.removeEventListener('click', onLineElementClick);
  pinElement.addEventListener('mousedown', onPinElementMouseDown);

  hashTagInputElement.removeEventListener('input', onHashTagInputElementInput);
  effectValueElement.removeEventListener('invalid', onEffectValueElementInvalid);
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
