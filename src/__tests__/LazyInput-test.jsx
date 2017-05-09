// jest.dontMock('../LazyInput');
var testdom = require('./testdom')();
var sinon = require('sinon');
var expect = require('expect.js');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');


describe('LazyInput', function() {
  var LazyInput
    , sinonSandbox;
  beforeEach(function() {
    LazyInput = require('../LazyInput');
    sinonSandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sinonSandbox.restore();
  });

  it('should render an input box by default when type is not specified', function() {
    var input = TestUtils.renderIntoDocument(<LazyInput />);
    expect(TestUtils.findRenderedDOMComponentWithTag(input, 'input')).not.to.be(undefined);
  });
  it('should render an input box when given type "text"', function() {
    var input = TestUtils.renderIntoDocument(<LazyInput type="text" />);
    expect(TestUtils.findRenderedDOMComponentWithTag(input, 'input')).not.to.be(undefined);
  });
  it('should render a textarea when given type "textarea"', function() {
    var input = TestUtils.renderIntoDocument(<LazyInput type="textarea" />);
    expect(TestUtils.findRenderedDOMComponentWithTag(input, 'textarea')).not.to.be(undefined);
  });
  it('should render an input for all other types', function() {
    var input = TestUtils.renderIntoDocument(<LazyInput type="tel" />);
    expect(TestUtils.findRenderedDOMComponentWithTag(input, 'input')).not.to.be(undefined);
  });

  it('should render a custom type when a React class is given', function() {
    var CustomType = function(props) {
      return <input className="custom" {...props} />
    };

    var input = TestUtils.renderIntoDocument(<LazyInput type={CustomType} />);
    expect(TestUtils.findRenderedDOMComponentWithClass(input, 'custom')).not.to.be(undefined);
  });

  describe("props", function() {
    // specificially import props
    it('should put the value into the input element when specified', function() {
      var input = TestUtils.renderIntoDocument(<LazyInput value="xyzzy" readOnly />);
      expect(TestUtils.findRenderedDOMComponentWithTag(input, 'input').value).to.be('xyzzy');
    });
    it('should put the value into the textarea when specified', function() {
      var input = TestUtils.renderIntoDocument(<LazyInput type="textarea" value="xyzzy" readOnly />);
      var ie = TestUtils.findRenderedDOMComponentWithTag(input, 'textarea');
      expect(ie.value).to.be('xyzzy');
    });
    it('should specify the form name on the input element when given', function() {
      var input = TestUtils.renderIntoDocument(<LazyInput name="customForm" />);
      var textarea = TestUtils.renderIntoDocument(<LazyInput name="customForm" type="textarea" />);
      expect(TestUtils.findRenderedDOMComponentWithTag(input, 'input').name).to.be('customForm');
      expect(TestUtils.findRenderedDOMComponentWithTag(textarea, 'textarea').name).to.be('customForm');
    });

    it('should pass through props', function() {
      var props = { name: "customForm" };
      var customProp = "xyzzy" + Date.now();
      props[customProp] = "myCustomProp";
      var shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(React.createElement(LazyInput, props));
      var input = shallowRenderer.getRenderOutput();
      expect(input.props.name).to.be('customForm');
      expect(input.props[customProp]).to.be("myCustomProp");
    });

    it('should filter out the lazyLevel prop', function() {
      var shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<LazyInput lazyLevel={100000} />);
      expect(shallowRenderer.getRenderOutput().props.lazyLevel).to.be(undefined);
    });

    it('should redirect onChange to the custom implementation', function() {
      var onChange = function() {};
      var shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<LazyInput onChange={onChange} />);
      expect(shallowRenderer.getRenderOutput().props.onChange).not.to.be(onChange);
    });
  });

  describe("procrastination", function() {
    var mockOnChange
      , input
      , inputElement;
    beforeEach(function() {
      mockOnChange = sinon.spy();
      input = TestUtils.renderIntoDocument(<LazyInput value="xyzzy" onChange={mockOnChange} />);
      inputElement = TestUtils.findRenderedDOMComponentWithTag(input, 'input');
    });

    it("should call onChange when value is changed", function() {
      var calledWith
        , mockOnChange = function(e) { calledWith = e.target.value; }
        , input = TestUtils.renderIntoDocument(<LazyInput value="a" onChange={mockOnChange} />)
        , inputElement = TestUtils.findRenderedDOMComponentWithTag(input, 'input');
      TestUtils.Simulate.change(inputElement, { target: { value: "aa" } });
      expect(calledWith).to.be('aa');
    });
    it("should immediately show changes that come via onChange", function() {
      TestUtils.Simulate.change(inputElement, { target: { value: 'xx' } });
      expect(inputElement.value).to.be('xx');
    });
    it("should update the element immediately if not procrastinating", function() {
      // input.setProps({value: "xyzzyy", onChange: mockOnChange});
      var inputContainer = ReactDOM.findDOMNode(input).parentNode;
      inputElement = inputContainer.querySelector('input');
      expect(inputElement.value).to.be('xyzzy');
      ReactDOM.render(<LazyInput value="xyzzyy" onChange={mockOnChange} />, inputContainer);
      inputElement = inputContainer.querySelector('input');
      expect(inputElement.value).to.be('xyzzyy');
    });
    it("should not update the element if it is procrastinating (ie. right after a change)", function() {
      TestUtils.Simulate.change(inputElement, { target: { value: 'xx' } });
      // input.setProps({ value: "xyzzyy", onChange: mockOnChange });
      var inputContainer = ReactDOM.findDOMNode(input).parentNode;
      ReactDOM.render(<LazyInput value="xyzzyy" onChange={mockOnChange} />, inputContainer);
      inputElement = inputContainer.querySelector('input');
      expect(inputElement.value).to.be('xx');
    });

    describe('timer', function() {
      var clock;
      beforeEach(function() { clock = sinon.useFakeTimers(); });
      afterEach(function()  { clock.restore(); });

      it("should update the element after the procrastination timer has run (default 1000ms)", function() {
        TestUtils.Simulate.change(inputElement, { target: { value: 'xx' } });
        // input.setProps({ value: "xyzzyy", onChange: mockOnChange });
        var inputContainer = ReactDOM.findDOMNode(input).parentNode;
        ReactDOM.render(<LazyInput value="xyzzyy" onChange={mockOnChange} />, inputContainer);
        inputElement = inputContainer.querySelector('input');
        expect(inputElement.value).to.be('xx');
        clock.tick(1500);
        expect(inputElement.value).to.be('xyzzyy');
      });
      it('should set the procrastination timer according to the lazyLevel prop', function() {
        input = TestUtils.renderIntoDocument(<LazyInput value="a" onChange={mockOnChange} lazyLevel={2500} />);
        inputElement = TestUtils.findRenderedDOMComponentWithTag(input, 'input');
        TestUtils.Simulate.change(inputElement, { target: { value: 'xx' } });
        // input.setProps({ value: "xyzzyy", onChange: mockOnChange });
        var inputContainer = ReactDOM.findDOMNode(input).parentNode;
        ReactDOM.render(<LazyInput value="xyzzyy" onChange={mockOnChange} />, inputContainer);
        inputElement = inputContainer.querySelector('input');
        expect(inputElement.value).to.be('xx');
        clock.tick(1500);
        expect(inputElement.value).to.be('xx');
        clock.tick(1000);
        expect(inputElement.value).to.be('xyzzyy');
      });
      it("should clean up the procrastination timer when the component is unmounted", function() {
        TestUtils.Simulate.change(inputElement, { target: { value: 'xx' } });
        // input.setProps({ value: "xyzzyy", onChange: mockOnChange });
        var inputContainer = ReactDOM.findDOMNode(input).parentNode;
        ReactDOM.render(<LazyInput value="xyzzyy" onChange={mockOnChange} />, inputContainer);
        inputElement = inputContainer.querySelector('input');
        ReactDOM.unmountComponentAtNode(inputContainer);
        expect(clock.timers).to.eql({});
      });
    });
  });
});
