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

var ESC_KEY_CODE = 27;

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
  if (evt.keyCode === ESC_KEY_CODE) {
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

var effectProgressElement = pictureEditorElement.querySelector('.img-upload__scale');
var effectValueElement = effectProgressElement.querySelector('.scale__value');
var defaultPinPosition = effectValueElement.value;

var pinElement = effectProgressElement.querySelector('.scale__pin');
var levelElement = effectProgressElement.querySelector('.scale__level');

var previewElement = pictureEditorElement.querySelector('.img-upload__preview');
var previewPictureElement = previewElement.querySelector('img');

/* Изменение размера изображения внутри оверлея */
var pictureSizeInputElement = document.querySelector('.resize__control--value');
var pictureSizeMinusBtn = document.querySelector('.resize__control--minus');
var pictureSizePlusBtn = document.querySelector('.resize__control--plus');

var pictureSize = parseInt(pictureSizeInputElement.value, 10);
var MIN_PICTURE_SIZE = 25;
var MAX_PICTURE_SIZE = 100;
var RESIZING_STEP = 25;

var imageDeformationMap = {
  'increase': function (size, step, maxSize) {
    var newSize = size;

    newSize += step;

    if (newSize > maxSize) {
      newSize = maxSize;
    }

    return newSize;
  },

  'decrease': function (size, step, minSize) {
    var newSize = size;

    newSize -= step;

    if (newSize < minSize) {
      newSize = minSize;
    }

    return newSize;
  }
};

var applyPictureSize = function (size) {
  pictureSizeInputElement.value = size + '%';
  previewPictureElement.style.transform = 'scale(' + (size / 100) + ')';
};

var resizePicture = function (param, maxValue) {
  pictureSize = imageDeformationMap[param](pictureSize, RESIZING_STEP, maxValue);
  applyPictureSize(pictureSize);
};

var onPictureSizeMinusBtnClick = function () {
  resizePicture('decrease', MIN_PICTURE_SIZE);
};

var onPictureSizePlusBtnClick = function () {
  resizePicture('increase', MAX_PICTURE_SIZE);
};

/* Объект-мапа, со всеми поддерживаемыми эффектами */
var effects = {
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

var applyEffect = function (effectName, pinPosition) {
  effectValueElement.value = pinPosition;
  changeProgress(effectValueElement.value);

  if (effectName === 'none') {
    effectProgressElement.classList.add('hidden');
    previewPictureElement.style.filter = effects[effectName]();
  } else {
    if (effectProgressElement.classList.contains('hidden')) {
      effectProgressElement.classList.remove('hidden');
    }
    previewPictureElement.style.filter = effects[effectName](effectValueElement.value);
  }
};

var onPictureEditorEscPress = function (evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    closePictureEditor();
  }
};

var openPictureEditor = function () {
  applyPictureSize(pictureSize);

  checkedEffect.checked = true;
  applyEffect(checkedEffect.value, defaultPinPosition);

  pictureEditorElement.classList.remove('hidden');

  pictureSizeMinusBtn.addEventListener('click', onPictureSizeMinusBtnClick);
  pictureSizePlusBtn.addEventListener('click', onPictureSizePlusBtnClick);

  document.addEventListener('keydown', onPictureEditorEscPress);

  closePictureEditorBtn.addEventListener('click', onClosePictureEditorBtnClick);
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
};

var onEffectsElementChange = function (evt) {
  applyEffect(evt.target.value, defaultPinPosition);
};

var uploadFile = function () {
  effectsElement.addEventListener('change', onEffectsElementChange);

  uploadFileElement.addEventListener('change', function () {
    openPictureEditor();
  });
};

uploadFile();
