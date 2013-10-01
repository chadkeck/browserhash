/*global define */
define(function () {
  'use strict';

  function ProgressBar(options) {
    var _chunkStartByte,
      _file,
      _chunkSize,
      _options,
      _progressBar;

    var attachEventHandlers = function (obj, handlers) {
      var eventName, eventHandler;
      for (eventName in handlers) {
        eventHandler = handlers[eventName];
        obj.addEventListener(eventName, eventHandler);
      }
    };

    var digest = CryptoJS.algo.MD5.create();

    var onFileReaderError = function (e) {
      // TODO: handle error
    };

    var onFileReaderSuccess = function (e) {
      // TODO: need to check here whether we need to read
      // another chunk or not. we can get rid of readNextChunk

      window.requestAnimationFrame(readNextChunk);
    };

    var onFileProgressEvent = function (e) {
      // TODO: if file doesn't have known size, display an
      // indeterminte (barber poll) progress bar. E.g.:
      //_progressBar.attributes.removeNamedItem('value');

      var totalProgressPercent = Math.round(
        ((_chunkStartByte + e.loaded) / _file.size) * 100
      );
      _progressBar.value = totalProgressPercent;
    };

    var readNextChunk = function () {
      _chunkStartByte += _chunkSize;

      if (_file.size <= _chunkStartByte) {
        _options.onDigest(digest.finalize().toString());
      } else {
        readChunk(_file, _chunkStartByte, _chunkSize);
      }
    };

    var onFileReaderStart = function (e) {
      // TODO
    };

    var onFileReaderEnd = function (e) {
      console.log('loadend', e.target.result.byteLength, e.target.result);

      var chunk = e.target.result;
      var view = new Uint32Array(chunk);
      var cryptoWords = CryptoJS.lib.WordArray.create(view);
      digest.update(cryptoWords);
    };

    var readBlob = function (blob) {
      var fileReaderEventHandlers = {
        'progress': onFileProgressEvent,
        'loadstart': onFileReaderStart,
        'loadend': onFileReaderEnd,
        'error': onFileReaderError,
        'load': onFileReaderSuccess
      };

      var reader = new FileReader();
      attachEventHandlers(reader, fileReaderEventHandlers);
      reader.readAsArrayBuffer(blob);
    };

    var readChunk = function (file, startByte, chunkSize) {
      //console.log('readChunk', file.size, startByte, chunkSize);
      var blob = file.slice(startByte, startByte + chunkSize);
      readBlob(blob);
    };

    var readFileInChunks = function (file, chunkSize) {
      _file = file;
      _chunkStartByte = 0;
      _chunkSize = chunkSize;

      readChunk(_file, _chunkStartByte, _chunkSize);
    };

    /*
    var parseOptions = function (options) {
    };
    */

    (function (options) {
      _options = options;

      _progressBar = document.getElementById('progress');

      readFileInChunks(_options.file, _options.chunkSize);
    })(options);
  }

  return ProgressBar;
});
