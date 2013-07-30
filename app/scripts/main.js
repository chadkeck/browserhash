var CryptoJS = CryptoJS || {};

require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery'
  }
});

require(['jquery', 'ChunkedFileReader'], function ($, ChunkedFileReader) {
  'use strict';

  var onDigest = function (digest) {
    console.log(digest);
  };

  var handleFiles = function (e) {
    console.log('handleFiles', e);
    var i, file, files = e.target.files;

    var chunkSize = 10 * 1024 * 1024; // 10MB
    for (i = 0; i < files.length; i++) {
      file = files[i];
      new ChunkedFileReader({
        file: file,
        chunkSize: chunkSize,
        onDigest: onDigest
      });
    }
  };

  $(function () {
    $('#input').on('change', handleFiles);
  });
});
