'use strict';

(function () {
  var pictureOverlayContainer = document.querySelector('.big-picture');
  var commentsContainer = pictureOverlayContainer.querySelector('.social__comments');
  var closePictureOverlayBtn = pictureOverlayContainer.querySelector('#picture-cancel');

  var onPictureOverlayEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      window.preview.closePictureOverlay();
    }
  };

  var createComment = function (comment) {
    var commentElement = document.createElement('li');
    var userIconElement = document.createElement('img');
    var commentText = document.createTextNode(comment);

    commentElement.classList.add('social__comment', 'social__comment--text');

    userIconElement.classList.add('social__picture');
    userIconElement.src = 'img/avatar-' + window.utils.getRandomInt(1, 6) + '.svg';
    userIconElement.alt = 'Аватар комментатора фотографии';
    userIconElement.width = 35;
    userIconElement.height = 35;

    commentElement.appendChild(userIconElement);
    commentElement.appendChild(commentText);

    return commentElement;
  };

  var onClosePictureOverlayBtnClick = function () {
    window.preview.closePictureOverlay();
  };

  window.preview = {
    openPictureOverlay: function (picture) {
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
    },

    closePictureOverlay: function () {
      pictureOverlayContainer.classList.add('hidden');

      closePictureOverlayBtn.removeEventListener('click', onClosePictureOverlayBtnClick);
      document.removeEventListener('keydown', onPictureOverlayEscPress);
    }
  };
})();
