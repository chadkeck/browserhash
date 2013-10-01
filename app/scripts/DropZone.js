/*global define */
define(function () {
  'use strict';

  function DropZone(options) {
    var element;

    var showDropAvailable = function () {
      element.classList.add('drag-on');
      return false;
    };

    var showDropUnavailable = function () {
      element.classList.remove('drag-on');
      return false;
    };

    var handleDrop = function (e) {
      e.stopPropagation();
      e.preventDefault();

      showDropUnavailable();

      options.onDrop(e);
    };

    var installDragDropHandlers = function () {
      element.ondragover = showDropAvailable;
      element.ondragenter = showDropAvailable;
      element.ondragleave = showDropUnavailable;

      element.ondrop = handleDrop;
    };

    (function () {
      element = options.element;
      installDragDropHandlers();
    })();
  }

  return DropZone;
});
