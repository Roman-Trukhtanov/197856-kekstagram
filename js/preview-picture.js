'use strict';

(function () {
  var pictureOverlayContainer = document.querySelector('.big-picture');
  var commentsContainer = pictureOverlayContainer.querySelector('.social__comments');
  var closePictureOverlayBtn = pictureOverlayContainer.querySelector('#picture-cancel');
  var commentCountElement = pictureOverlayContainer.querySelector('.comments-count--current');
  var loadMoreCommentsBtn = pictureOverlayContainer.querySelector('.social__loadmore');

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

  var cloneComments = [];
  var currentAddedComments = null;
  var MAX_COMMENTS_LENGTH = 5;

  var fillCommentsContainer = function (commentsLength) {
    currentAddedComments += commentsLength;

    for (var i = 0; i < commentsLength; i++) {
      commentsContainer.appendChild(
          createComment(cloneComments[0])
      );

      cloneComments.splice(0, 1);
    }

    if (cloneComments.length === 0) {
      loadMoreCommentsBtn.classList.add('hidden');
    }

    commentCountElement.textContent = currentAddedComments.toString();
  };

  var onLoadMoreCommentsBtnClick = function (evt) {
    evt.preventDefault();

    fillCommentsContainer(window.utils.clamp(cloneComments.length, 0, MAX_COMMENTS_LENGTH));
  };

  var onPictureOverlayEscPress = function (evt) {
    if (window.utils.isEscKeycode(evt)) {
      closePictureOverlay();
    }
  };

  var onClosePictureOverlayBtnClick = function () {
    closePictureOverlay();
  };

  var openPictureOverlay = function (picture) {
    commentsContainer.innerHTML = '';

    pictureOverlayContainer.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    pictureOverlayContainer.querySelector('.likes-count').textContent = picture.likes;
    pictureOverlayContainer.querySelector('.comments-count').textContent = (picture.comments.length).toString();

    var pictureDescriptionElement = pictureOverlayContainer.querySelector('.social__caption');

    pictureDescriptionElement.textContent = picture.description ? picture.description : '';

    cloneComments = picture.comments.slice();

    loadMoreCommentsBtn.classList.toggle('hidden', (picture.comments.length <= 5));

    fillCommentsContainer(window.utils.clamp(cloneComments.length, 0, MAX_COMMENTS_LENGTH));

    document.body.classList.add('modal-open');

    pictureOverlayContainer.classList.remove('hidden');

    document.addEventListener('keydown', onPictureOverlayEscPress);

    closePictureOverlayBtn.addEventListener('click', onClosePictureOverlayBtnClick);

    loadMoreCommentsBtn.addEventListener('click', onLoadMoreCommentsBtnClick);
  };

  var closePictureOverlay = function () {
    currentAddedComments = 0;

    document.body.classList.remove('modal-open');
    pictureOverlayContainer.classList.add('hidden');

    closePictureOverlayBtn.removeEventListener('click', onClosePictureOverlayBtnClick);
    document.removeEventListener('keydown', onPictureOverlayEscPress);
    loadMoreCommentsBtn.removeEventListener('click', onLoadMoreCommentsBtnClick);
  };

  window.previewPicture = openPictureOverlay;
})();