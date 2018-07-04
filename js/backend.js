'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var statuses = {
    SUCCESSFUL: 200,
    REDIRECT: 300,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
  };

  var TIMEOUT = 20000;

  var setupRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === statuses.SUCCESSFUL) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      var messageError = '';
      switch (xhr.status) {
        case statuses.REDIRECT:
          messageError = 'Ресурс переехал';
          break;

        case statuses.BAD_REQUEST:
          messageError = 'Неправильный запрос';
          break;

        case statuses.INTERNAL_SERVER_ERROR:
          messageError = 'Ошибка на стороне сервера';
          break;

        default:
          messageError = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
      onError(messageError);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setupRequest(onLoad, onError);
      xhr.open('GET', LOAD_URL);
      xhr.send();
    },

    upload: function (data, onLoad, onError) {
      var xhr = setupRequest(onLoad, onError);
      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  };
})();
