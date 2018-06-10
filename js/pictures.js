'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTION = [
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

var pictureTemplate = document.querySelector('#picture');

var picturesBlock = document.querySelector('.pictures');

var generatePictures = function (countPictures, minLikes, maxLikes) {
  var pictures = [];

  for (var i = 0; i < countPictures; i++) {
    pictures[i] = {};

    pictures[i].url = 'photos/' + (i + 1) + '.jpg';
    pictures[i].likes = getRandomInt(minLikes, maxLikes);

    pictures[i].comments = [];

    for (var j = 0; j < getRandomInt(1, 2); j++) {
      pictures[i].comments[j] = COMMENTS[
        getRandomInt(0, (COMMENTS.length - 1))
      ];
    }

    pictures[i].description = DESCRIPTION[
      getRandomInt(0, (DESCRIPTION.length - 1))
    ];
  }

  return pictures;
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.content.querySelector('.picture__link').cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = (picture.comments.length).toString();

  return pictureElement;
};

var fillingPicturesBlock = function (pictures) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPicture(pictures[i]));
  }

  return fragment;
};

var createSocialComment = function (comment) {
  var socialCommentElment = document.createElement('li');
  socialCommentElment.classList.add('social__comment', 'social__comment--text');

  var socialPictureElement = document.createElement('img');
  socialPictureElement.classList.add('social__picture');
  socialPictureElement.src = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
  socialPictureElement.alt = 'Аватар комментатора фотографии';
  socialPictureElement.width = 35;
  socialPictureElement.height = 35;

  socialCommentElment.appendChild(socialPictureElement);
  socialCommentElment.append(comment);

  return socialCommentElment;
};

var renderBigPicture = function (bigPicture, pictures, itemCount) {
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = pictures[itemCount].url;
  bigPicture.querySelector('.likes-count').textContent = pictures[itemCount].likes;
  bigPicture.querySelector('.comments-count').textContent = (pictures[itemCount].comments.length).toString();
  bigPicture.querySelector('.social__caption').textContent = pictures[itemCount].description;

  for (var i = 0; i < pictures[itemCount].comments.length; i++) {
    socialCommentsBlock.appendChild(
        createSocialComment(pictures[itemCount].comments[i])
    );
  }
};

var allPictures = generatePictures(NUMBER_OF_PICTURES, MIN_LIKES, MAX_LIKES);

picturesBlock.appendChild(fillingPicturesBlock(allPictures));

/* Находит блок с больщой картинкой */
var bigPictureElement = document.querySelector('.big-picture');
bigPictureElement.classList.remove('hidden');

/* Находит блок с комментариями внутри блока с большой картинкой */
var socialCommentsBlock = bigPictureElement.querySelector('.social__comments');

/* Отрисовывает и изменяет данный внутри блока с большой картинкой*/
renderBigPicture(bigPictureElement, allPictures, 0);

/* Скрывает блок с количеством комментариев внутри блока с большой картинкой */
var socialCommentCount = document.querySelector('.social__comment-count');
socialCommentCount.classList.add('visually-hidden');

/* Скрывает кнопку 'загрузить еще' внутри блока с большой картинкой */
var socialCommentLoadMore = document.querySelector('.social__loadmore');
socialCommentLoadMore.classList.add('visually-hidden');
