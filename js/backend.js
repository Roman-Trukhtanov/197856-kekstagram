'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var TIMEOUT = 20000;

  var StatusNumber = {
    SUCCESSFUL: 200,
    REDIRECT: 300,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
  };

  var StatusMessage = {};

  StatusMessage[StatusNumber['SUCCESSFUL']] = 'Успешно отправлен';
  StatusMessage[StatusNumber['REDIRECT']] = 'Ресурс переехал';
  StatusMessage[StatusNumber['BAD_REQUEST']] = 'Неправильный запрос';
  StatusMessage[StatusNumber['INTERNAL_SERVER_ERROR']] = 'Ошибка на стороне сервера';

  var setupRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusNumber.SUCCESSFUL) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      var messageError = (StatusMessage[xhr.status]) || 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;

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
