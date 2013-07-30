/*global describe, it */
'use strict';
(function () {
  require('chai').should();

  describe('Give it some context', function () {
    describe('maybe a bit more context here', function () {
      it('should run here few assertions', function () {
        var hi = 'hello';
        hi.should.equal('hello');
      });
    });
  });
})();
