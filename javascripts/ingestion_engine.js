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
    if (Modernizr.draganddrop) {
      console.log('yes drag drop');
    } else {
      failed = true;
      console.log('no drag drop');
    }
    if (Modernizr.webworkers) {
      console.log('yes webworkers');
    } else {
      failed = true;
      console.log('no webworkers');
    }
    if (Modernizr.filereader) {
      console.log('yes filereader');
    } else {
      failed = true;
      console.log('no filereader');
    }
    if (failed) {
      template = $('#browsers-tmpl').tmpl().appendTo('#page');
      $('#drop-area-container').hide();
      $('#footer').hide();
      return;
    }
    $('#alert-area').hide();
    prevent_file_opening();
    alert_area = new AlertArea('#alert-area');
    table_handler = new ResultsTable('#results-container', $('#entry-tmpl'));
    return drop_zone = new DropZone('drop-zone', table_handler.handle_new_file, alert_area.show_message, alert_area.show_filesize_message);
  });
}).call(this);
