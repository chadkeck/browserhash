var CryptoJS = CryptoJS || {};
var Handlebars = Handlebars || {};

require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery'
  }
});

require(['jquery', 'ChunkedFileReader', 'DropZone', 'AlertArea'], function ($, ChunkedFileReader, DropZone, AlertArea) {
  'use strict';

  var alertObj;

  var onProgress = function (percent) {
    console.log(percent + '%');
  };

  var preventDroppedFilesFromOpening = function () {
    var page = document.getElementById('page'),
      returnFalse = function () { return false; };

    page.ondragover = returnFalse;
    page.ondragend = returnFalse;
    page.ondrop = returnFalse;
  };

  var results = {}; // Result ID => Result Object
  var resultItemTemplate;
  var createResultElement = function (filename) {
    var html = resultItemTemplate({filename: filename});
    var $element = $('#results-container').append(html);
    return $element;
  };

  var onDigests = function ($element, digests) {
    var rows = $element.find('tr');
    rows.eq(0).find('.digest-value').html(digests.MD5);
    rows.eq(1).find('.digest-value').html(digests.SHA1);
    rows.eq(2).find('.digest-value').html(digests.SHA256);
    rows.eq(3).find('.digest-value').html(digests.SHA3);
  };

  var readFiles = function (files) {
    var i, file, resultElement;

    var chunkSize = 10 * 1024 * 1024; // 10MB
    for (i = 0; i < files.length; i++) {
      file = files[i];
      resultElement = createResultElement(file.name);
      new ChunkedFileReader({
        file: file,
        chunkSize: chunkSize,
        cryptoLib: CryptoJS,
        onProgress: onProgress,
        onDigests: function (digests) {
          onDigests(resultElement, digests);
        }
      });
    }
  };

  var handleFilesChosen = function (e) {
    var files = e.target.files || e.dataTransfer.files;
    console.warn(files);
    return;
    readFiles(files);
  };

  $(function () {
    preventDroppedFilesFromOpening();

    alertObj = new AlertArea('#alert-area');

    new DropZone({
      element: document.getElementById('drop-zone'),
      onDrop: handleFilesChosen
    });

    var templateHtml = $('#result-template').html();
    resultItemTemplate = Handlebars.compile(templateHtml);

    $('#file-picker').on('change', handleFilesChosen);

    // DEBUG
    /*
    for (var i = 0; i < 10; i++) {
      createResultElement('Foobar.js');
    }
    */
  });
});
