/*global define */
define(function () {
  'use strict';

  var _$container;

  function AlertArea(containerId) {
    _$container = $(containerId);
    _$container.css('visibility', 'hidden');
  }

  AlertArea.prototype.showMessage = function (message) {
    _$container
      .text(message)
      .fadeTo(0, 0)
      .css('visibility', 'visible')
      .fadeTo(600, 1);
  };

  AlertArea.prototype.clear = function () {
    if (_$container.css('visibility') === 'visible') {
      _$container
        .fadeTo(0, 1)
        .css('visibility', 'visible')
        .fadeTo(600, 0);
    }
  };

  return AlertArea;
});
