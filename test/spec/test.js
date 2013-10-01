/*global describe, it */
'use strict';
(function () {
  var ChunkedFileReader = require('ChunkedFileReader');
  require('chai').should();

  describe('ChunkedFileReader', function () {
    console.log(ChunkedFileReader);
    describe('maybe a bit more context here', function () {
      it('should run here few assertions', function () {
        var hi = 'hello';
        hi.should.equal('hello');
      });
    });
  });
})();
