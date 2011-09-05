(function() {
  $(function() {
    var drop_zone, page, table_handler;
    Modernizr.addTest('filereader', function() {
      return typeof FileReader !== "undefined";
    });
    if (Modernizr.draganddrop) {
      console.log('yes');
    } else {
      console.log('no');
    }
    if (Modernizr.webworkers) {
      console.log('yes');
    }
    if (Modernizr.filereader) {
      console.log('yes for filereader');
    } else {
      console.log('NO for filereader');
    }
    window.onscroll = function() {
      $('#footer').css('position', 'relative');
      return $('#footer').css('bottom', '1px');
    };
    page = document.getElementById('page');
    page.ondragover = function() {
      return false;
    };
    page.ondragend = function() {
      console.log('ondragend');
      return false;
    };
    page.ondrop = function(event) {
      console.log('ondrop');
      return false;
    };
    table_handler = new ResultsTable('#results-container', $('#entry-tmpl'));
    drop_zone = new DropZone('drop-zone', table_handler.handle_new_file);
  });
}).call(this);
