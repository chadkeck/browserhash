(function() {
  var prevent_file_opening, show_browsers;
  show_browsers = function() {};
  prevent_file_opening = function() {
    var page;
    page = document.getElementById('page');
    page.ondragover = function() {
      return false;
    };
    page.ondragend = function() {
      return false;
    };
    return page.ondrop = function(event) {
      return false;
    };
  };
  $(function() {
    var alert_area, drop_zone, failed, table_handler, template;
    Modernizr.addTest('filereader', function() {
      return typeof FileReader !== "undefined";
    });
    failed = false;
    if (Modernizr.draganddrop) {} else {
      failed = true;
    }
    if (Modernizr.webworkers) {} else {
      failed = true;
    }
    if (Modernizr.filereader) {} else {
      failed = true;
    }
    if (failed) {
      template = $('#browsers-tmpl').tmpl().appendTo('#page');
      $('#drop-area-container').hide();
      $('#footer').hide();
      $('#footer-shadow').hide();
      return;
    }
    $('#alert-area').css('visibility', 'hidden');
    prevent_file_opening();
    alert_area = new AlertArea('#alert-area');
    table_handler = new ResultsTable('#results-container', $('#entry-tmpl'));
    return drop_zone = new DropZone('drop-zone', table_handler.handle_new_file, alert_area.show_message, alert_area.clear);
  });
}).call(this);
