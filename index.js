var React = require('react')
  , clone = require('clone');

var LazyInput = React.createClass({
  displayName: "LazyInput",
  propTypes: {
    type: React.PropTypes.string,               // ['text'] type of input/textarea
    lazyLevel: React.PropTypes.number           // [1000]   number of ms to wait before responding to changes in prop.value
    // note: passes through everything but lazyLevel
  },
  getDefaultProps: function() {
    return {
      type: 'text',
      lazyLevel: 1000
    }
  },
  getInitialState: function() {
    return { value: this.props.value };
  },
  componentWillReceiveProps: function(nextProps) {
    this.updateIfNotLazy(nextProps.value);
  },
  updateIfNotLazy: function(newValue) {
    if(!this.procrastinating) {
      this.setState({ value: newValue, requestedValue: undefined });
    }else {
      this.setState({ requestedValue: newValue });
    }
  },
  procrastinate: function() {
    this.procrastinating = true;
    if(this.procrastinationTimer) { clearTimeout(this.procrastinationTimer); }
    this.procrastinationTimer = setTimeout(this.ohAlrightAlready, this.props.lazyLevel);
  },
  ohAlrightAlready: function() {
    this.procrastinating = false;
    this.updateIfNotLazy(this.state.requestedValue);
  },
  onChange: function(event) {
    this.procrastinate();
    this.setState({ value: event.target.value });
    this.props.onChange.apply(null, arguments);
  },
  getProps: function() {
    // for the most part, we are just going to pass through whatever comes in
    var props = clone(this.props);
    props.value = this.state.value;
    delete props.lazyLevel;
    if(props.onChange) { props.onChange = this.onChange; }
    return props;
  },
  render: function() {
    return React.createElement(this.props.type === "textarea" ? "textarea" : "input", this.getProps());
  }

});

module.exports = LazyInput;
