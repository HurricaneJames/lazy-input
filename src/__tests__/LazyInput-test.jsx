var testdom = require('./testdom')();
var expect = require('expect.js');
var React;
var ReactTestUtils;
var LazyInput;

describe('LazyInput', function() {
  beforeEach(function() {
    React = require('react/addons');
    ReactTestUtils = React.addons.TestUtils;
    LazyInput = require('../LazyInput');
  });

  it("should be able to render into a document", function() {
    var lazyInput = ReactTestUtils.renderIntoDocument(<LazyInput />);
    expect(ReactTestUtils.findRenderedDOMComponentWithTag(lazyInput, 'input')).not.to.be(undefined);
  });

});