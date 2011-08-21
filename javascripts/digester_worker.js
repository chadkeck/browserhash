(function() {
  var calculate_digests, send_digest;
  this.importScripts("lib/md5.js");
  this.importScripts("lib/sha1.js");
  this.importScripts("lib/sha256.js");
  this.importScripts("lib/sha512.js");
  send_digest = function(digest_type, file_info) {
    var digest, digest_info, file_contents, file_name, lib_fn;
    file_contents = file_info.file_contents;
    file_name = file_info.file_name;
    lib_fn = eval('rstr_' + digest_type);
    digest = rstr2hex(lib_fn(file_contents));
    digest_info = {
      file_name: file_name,
      digest_type: digest_type,
      digest: digest
    };
    return postMessage(digest_info);
  };
  calculate_digests = function(file_info) {
    var digest_type, digest_types, _i, _len, _results;
    digest_types = ['md5', 'sha1', 'sha256', 'sha512'];
    _results = [];
    for (_i = 0, _len = digest_types.length; _i < _len; _i++) {
      digest_type = digest_types[_i];
      _results.push(send_digest(digest_type, file_info));
    }
    return _results;
  };
  this.onmessage = function(event) {
    var file_info;
    file_info = event.data;
    calculate_digests(file_info);
  };
}).call(this);
