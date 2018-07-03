'use strict';

(function () {
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

  window.generateData = {
    generatePictures: function (picturesAmount, minLikes, maxLikes) {
      var pictures = [];

      for (var i = 0; i < picturesAmount; i++) {
        pictures.push({
          'url': 'photos/' + (i + 1) + '.jpg',
          'likes': window.utils.getRandomInt(minLikes, maxLikes),
          'comments': this.generateComments(window.utils.getRandomInt(1, 2)),
          'description': DESCRIPTIONS[
            window.utils.getRandomInt(0, (DESCRIPTIONS.length - 1))
          ]
        });
      }

      return pictures;
    },

    generateComments: function (amountComments) {
      var comments = [];

      for (var j = 0; j < amountComments; j++) {
        comments.push(COMMENTS[
          window.utils.getRandomInt(0, (COMMENTS.length - 1))
        ]);
      }

      return comments;
    }
  };
})();
