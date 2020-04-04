'use strict';

(function () {
  var LOAD_URL = 'https://javascript.pages.academy/kekstagram/data';
  var UPLOAD_URL = 'https://javascript.pages.academy/kekstagram';

  var StatusNumber = {
    SUCCESSFUL: 200,
    REDIRECT: 300,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
  };

  var statusMessagesMap = {};

  statusMessagesMap[StatusNumber['SUCCESSFUL']] = 'Успешно отправлен';
  statusMessagesMap[StatusNumber['REDIRECT']] = 'Ресурс переехал';
  statusMessagesMap[StatusNumber['BAD_REQUEST']] = 'Неправильный запрос';
  statusMessagesMap[StatusNumber['INTERNAL_SERVER_ERROR']] = 'Ошибка на стороне сервера';

  var checkStatus = function (response) {
    if (response.status >= StatusNumber.SUCCESSFUL && response.status < StatusNumber.REDIRECT) {
      return response;
    } else {
      var messageError = (statusMessagesMap[response.status]) ||
        'Cтатус ответа: ' + response.status + ' ' + response.statusText;

      throw new Error(messageError);
    }
  };

  var toJSON = function (response) {
    return response.json();
  };

  var getData = function () {
    return fetch(LOAD_URL, {method: 'GET'})
      .then(checkStatus);
  };

  var setData = function (data) {
    return fetch(UPLOAD_URL, {method: 'POST', body: data})
      .then(checkStatus);
  };

  var load = function (onLoad, onError) {
    getData()
      .catch(function (err) {
        err = err.toString().replace('Error:', '');
        onError(err);
      })
      .then(toJSON)
      .then(onLoad);
  };

  var upload = function (data, onLoad, onError) {
    setData(data)
      .catch(function (err) {
        err = err.toString().replace('Error:', '');
        onError(err);
      })
      .then(onLoad);
  };

  window.backend = {
    load: load,

    upload: upload
  };
})();
