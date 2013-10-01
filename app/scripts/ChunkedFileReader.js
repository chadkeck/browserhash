/*global define */
define(function () {
  'use strict';

  function ChunkedFileReader(options) {
    var _chunkStartByte,
      _file,
      _chunkSize,
      _cryptoLib,
      _options,
      _digests = {},
      _progressBar;

    var callOptionalHandler = function (handlerName, value) {
      var handler;
      if (_options.hasOwnProperty(handlerName)) {
        handler = _options[handlerName];
        // TODO: change to 'call' or 'apply'
        handler(value);
      }
    };

    var attachEventHandlers = function (obj, handlers) {
      var eventName, eventHandler;
      for (eventName in handlers) {
        eventHandler = handlers[eventName];
        obj.addEventListener(eventName, eventHandler);
      }
    };

    var onFileReaderError = function (e) {
      // TODO: handle error
    };

    var onFileReaderSuccess = function (e) {
      // TODO: need to check here whether we need to read
      // another chunk or not. we can get rid of readNextChunk
      window.requestAnimationFrame(readNextChunk);
    };

    var PERF_MON = true;
    var digestUpdateTimes = {
      'MD5': 0,
      'SHA1': 0,
      'SHA256': 0,
      'SHA3': 0
    };

    var createDigestObjects = function () {
      var cryptoJsObjectNames = [
        'MD5',
        'SHA1',
        'SHA256',
        //'SHA3'
      ], cryptoJsObjectName, i;
      for (i = 0; i < cryptoJsObjectNames.length; i++) {
        cryptoJsObjectName = cryptoJsObjectNames[i];
        _digests[cryptoJsObjectName] = _cryptoLib.algo[cryptoJsObjectName].create();
      }
    };
    var updateDigest = function (digestType, words) {
      var digestObj = _digests[digestType];

      if (PERF_MON) {
        var startTime = performance.now();
      }

      digestObj.update(words);

      if (PERF_MON) {
        var endTime = performance.now();
        digestUpdateTimes[digestType] += endTime - startTime;
      }
    };
    var updateDigests = function (words) {
      var digestType;
      for (digestType in _digests) {
        updateDigest(digestType, words);
      }
    };
    var finalizeDigests = function () {
      var digestType, digestObj, digestStrings = {};
      for (digestType in _digests) {
        digestObj = _digests[digestType];
        digestStrings[digestType] = digestObj.finalize().toString();
      }
      return digestStrings;
    };

    var onFileProgressEvent = function (e) {
      // TODO: if file doesn't have known size, display an
      // indeterminte (barber poll) progress bar. E.g.:
      //_progressBar.attributes.removeNamedItem('value');
      var totalProgressPercent = Math.round(
        ((_chunkStartByte + e.loaded) / _file.size) * 100
      );
      callOptionalHandler('onProgress', totalProgressPercent);
      //_progressBar.value = totalProgressPercent;
    };

    var readNextChunk = function () {
      var digestStrings;

      _chunkStartByte += _chunkSize;

      if (_file.size <= _chunkStartByte) {
        digestStrings = finalizeDigests();
        _options.onDigests(digestStrings);
        console.warn('PERFORMANCE', digestUpdateTimes);
      } else {
        readChunk(_file, _chunkStartByte, _chunkSize);
      }
    };

    var onFileReaderStart = function (e) {
      // TODO
    };

    var onFileReaderEnd = function (e) {
      var chunk, view, cryptoWords;
      chunk = e.target.result;
      try {
        view = new Uint32Array(chunk);
        cryptoWords = _cryptoLib.lib.WordArray.create(view);
        updateDigests(cryptoWords);
      } catch (err) {
        // FIXME: small files can't be read ATM
        throw err;
      }
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
      var blob = file.slice(startByte, startByte + chunkSize);
      readBlob(blob);
    };

    var readFileInChunks = function (file, chunkSize) {
      _file = file;
      _chunkStartByte = 0;
      _chunkSize = chunkSize;
      createDigestObjects();

      callOptionalHandler('onProgress', 0);
      readChunk(_file, _chunkStartByte, _chunkSize);
    };

    /*
    var parseOptions = function (options) {
    };
    */

    (function (options) {
      _options = options;

      _cryptoLib = _options.cryptoLib;

      //_progressBar = document.getElementById('progress');

      readFileInChunks(_options.file, _options.chunkSize);
    })(options);
  }

  return ChunkedFileReader;
});
