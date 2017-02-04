var React = require('react');
var expect = require('expect');

describe('root', function () {
  it('renders without problems', function () {
    var five = 5;
    expect(five).toExist();
    expect(five).toEqual(5);
  });
});