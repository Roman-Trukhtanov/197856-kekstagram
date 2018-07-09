'use strict';

(function () {
  var picturesContainer = document.querySelector('.pictures');

  var pictureTemplate = document.querySelector('#picture').content;

  var imgFiltersContainer = document.querySelector('.img-filters');

  var getPictureElement = function (picture) {
    var pictureElement = pictureTemplate.querySelector('.picture__link').cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = (picture.comments.length).toString();

    pictureElement.addEventListener('click', function () {
      window.openPictureOverlay(picture);
    });

    return pictureElement;
  };

  var picturesData = null;

  var removePictureElements = function () {
    var pictureElements = Array.from(picturesContainer.querySelectorAll('.picture__link'));

    pictureElements.forEach(function (it) {
      picturesContainer.removeChild(it);
    });
  };

  var renderPictures = function (pictures) {
    var pictureElements = [];

    pictures.forEach(function (it) {
      pictureElements.push(getPictureElement(it));
    });

    picturesContainer.appendChild(window.utils.fillFragment(pictureElements));
  };

  var sortFiltersMap = {
    'filter-popular': window.utils.debounce(function (sortedArray) {
      removePictureElements();
      renderPictures(sortedArray);
    }),

    'filter-new': window.utils.debounce(function (sortedArray) {
      var sortedByNewPictures = sortedArray.slice();
      sortedByNewPictures = window.utils.shuffleArray(sortedByNewPictures).slice(15);

      removePictureElements();
      renderPictures(sortedByNewPictures);
    }),

    'filter-discussed': window.utils.debounce(function (sortedArray) {
      var sortedByCommentsOrder = sortedArray.slice()
        .sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });

      removePictureElements();

      renderPictures(sortedByCommentsOrder);
    })
  };

  var onImgFiltersContainerClick = function (evt) {
    var target = evt.target;
    var activeButton = imgFiltersContainer.querySelector('.img-filters__button--active');

    if (target !== activeButton) {
      if (target.classList.contains('img-filters__button')) {
        activeButton.classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
        activeButton = target;

        sortFiltersMap[target.id](picturesData);
      }
    }
  };

  var enableSortPictures = function () {
    imgFiltersContainer.classList.remove('img-filters--inactive');
    imgFiltersContainer.addEventListener('click', onImgFiltersContainerClick);
  };

  var onSuccess = function (allPictures) {
    picturesData = allPictures;

    renderPictures(allPictures);

    enableSortPictures();
  };

  var onError = function (message) {
    window.requestResult.displayError(message, true);
  };

  window.backend.load(onSuccess, onError);
})();
