(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.DropZone = (function() {
    function DropZone(element_id, new_file_callback) {
      this.handle_drop = __bind(this.handle_drop, this);      this.element = document.getElementById(element_id);
      this.element.ondragover = this.handle_drag_over;
      this.element.ondragenter = this.handle_drag_enter;
      this.element.ondrop = this.handle_drop;
      this.new_file_callback = new_file_callback;
    }
    DropZone.prototype.handle_mouse_enter = function(event) {
      return false;
    };
    DropZone.prototype.handle_drag_over = function(event) {
      return false;
    };
    DropZone.prototype.handle_drag_enter = function(event) {
      event.preventDefault();
      return false;
    };
    DropZone.prototype.handle_drop = function(event) {
      var file, files, _i, _len, _results;
      event.stopPropagation();
      event.preventDefault();
      files = event.dataTransfer.files;
      if (files.length === 0) {
        return;
      }
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (file.size === 0) {
          return;
        }
        _results.push(this.new_file_callback(file));
      }
      return _results;
    };
    return DropZone;
  })();
  window.Digester = (function() {
    function Digester(file, callbacks) {
      this.handle_digest_message = __bind(this.handle_digest_message, this);      var file_reader;
      this.file_contents = void 0;
      this.file = file;
      this.callbacks = callbacks;
      file_reader = new FileReader;
      file_reader.onload = __bind(function(event) {
        var file_info, worker;
        this.file_contents = event.target.result;
        worker = new Worker('javascripts/worker.js');
        worker.onmessage = __bind(function(event) {
          return this.handle_digest_message(event.data);
        }, this);
        file_info = {
          file_name: this.file.name,
          file_contents: this.file_contents
        };
        return worker.postMessage(file_info);
      }, this);
      file_reader.readAsBinaryString(this.file);
    }
    Digester.prototype.handle_digest_message = function(digest_info) {
      var digest, digest_type, file_name;
      digest_type = digest_info.digest_type;
      digest = digest_info.digest;
      file_name = digest_info.file_name;
      return this.callbacks[digest_type](digest);
    };
    return Digester;
  })();
  window.TableRow = (function() {
    function TableRow(row, file) {
      this.handle_sha512 = __bind(this.handle_sha512, this);
      this.handle_sha256 = __bind(this.handle_sha256, this);
      this.handle_sha1 = __bind(this.handle_sha1, this);
      this.handle_md5 = __bind(this.handle_md5, this);
      this.set_field = __bind(this.set_field, this);      this.row = row;
      this.callbacks = {
        md5: this.handle_md5,
        sha1: this.handle_sha1,
        sha256: this.handle_sha256,
        sha512: this.handle_sha512
      };
      new Digester(file, this.callbacks);
    }
    TableRow.prototype.set_field = function(digest_type, digest) {
      return this.row.children('.' + digest_type).children('.digest').html(digest);
    };
    TableRow.prototype.handle_md5 = function(digest) {
      return this.set_field('md5', digest);
    };
    TableRow.prototype.handle_sha1 = function(digest) {
      return this.set_field('sha1', digest);
    };
    TableRow.prototype.handle_sha256 = function(digest) {
      return this.set_field('sha256', digest);
    };
    TableRow.prototype.handle_sha512 = function(digest) {
      return this.set_field('sha512', digest);
    };
    return TableRow;
  })();
  window.ResultsTable = (function() {
    function ResultsTable(table_id, template) {
      this.handle_new_file = __bind(this.handle_new_file, this);      this.table_id = table_id;
      this.template = template;
    }
    ResultsTable.prototype.handle_new_file = function(file) {
      var row_obj, table_data;
      table_data = {
        filename: file.name
      };
      row_obj = this.template.tmpl(table_data).appendTo(this.table_id);
      return new TableRow(row_obj.children('ul'), file);
    };
    return ResultsTable;
  })();
}).call(this);
