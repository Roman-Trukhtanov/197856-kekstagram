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
var PICTURE_INDEX = 0;

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

var getPictureOverlay = function (picture) {
  var pictureOverlayContainer = document.querySelector('.big-picture');
  var commentsContainer = pictureOverlayContainer.querySelector('.social__comments');

  pictureOverlayContainer.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  pictureOverlayContainer.querySelector('.likes-count').textContent = picture.likes;
  pictureOverlayContainer.querySelector('.comments-count').textContent = (picture.comments.length).toString();
  pictureOverlayContainer.querySelector('.social__caption').textContent = picture.description;

  for (var i = 0; i < picture.comments.length; i++) {
    commentsContainer.appendChild(
        createComment(picture.comments[i])
    );
  }

  return pictureOverlayContainer;
};

var allPictures = generatePictures(NUMBER_OF_PICTURES, MIN_LIKES, MAX_LIKES);

picturesContainer.appendChild(fillFragment(allPictures));

var pictureOverlay = getPictureOverlay(allPictures[PICTURE_INDEX]);

/* Скрывает блок с количеством комментариев внутри блока с большой картинкой */
var commentsCountElement = pictureOverlay.querySelector('.social__comment-count');
commentsCountElement.classList.add('visually-hidden');

/* Скрывает кнопку 'загрузить еще' внутри блока с большой картинкой */
var loadMoreBtn = pictureOverlay.querySelector('.social__loadmore');
loadMoreBtn.classList.add('visually-hidden');

/* Показывает блок с большой картинкой  */
pictureOverlay.classList.remove('hidden');
