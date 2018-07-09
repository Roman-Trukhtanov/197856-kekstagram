'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.readFile = function (inputTypeFile, previewPicture, callback) {
    var file = inputTypeFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewPicture.src = reader.result;
        callback();
      });

      reader.readAsDataURL(file);
    } else {
      inputTypeFile.value = '';
      window.requestResult.displayError('Неверный формат файла!', false);
    }
  };
})();
