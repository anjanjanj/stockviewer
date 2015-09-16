'use strict';

describe('Service: stocksFactory', function () {

  // load the service's module
  beforeEach(module('stocks2App'));

  // instantiate service
  var stocksFactory;
  beforeEach(inject(function (_stocksFactory_) {
    stocksFactory = _stocksFactory_;
  }));

  it('should do something', function () {
    expect(!!stocksFactory).toBe(true);
  });

});
