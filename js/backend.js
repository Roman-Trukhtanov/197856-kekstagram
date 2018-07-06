'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var Status = {
    SUCCESSFUL: 200,
    300: 'Ресурс переехал',
    400: 'Неправильный запрос',
    500: 'Ошибка на стороне сервера'
  };

  var TIMEOUT = 20000;

  var setupRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === Status.SUCCESSFUL) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      var messageError = (xhr.status in Status)
        ? Status[xhr.status]
        : 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;

      onError(messageError);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = setupRequest(onLoad, onError);
    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var upload = function (data, onLoad, onError) {
    var xhr = setupRequest(onLoad, onError);
    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,

    upload: upload
  };
})();
